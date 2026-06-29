
-- =========================================================================
-- 1. Expand clinics table
-- =========================================================================
ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS brand_name text,
  ADD COLUMN IF NOT EXISTS branch_name text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS google_place_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS google_maps_url text,
  ADD COLUMN IF NOT EXISTS google_rating numeric(3,2),
  ADD COLUMN IF NOT EXISTS google_rating_count integer,
  ADD COLUMN IF NOT EXISTS last_synced_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS data_confidence text DEFAULT 'low' CHECK (data_confidence IN ('low','medium','high')),
  ADD COLUMN IF NOT EXISTS data_source text DEFAULT 'sample' CHECK (data_source IN ('sample','admin','google_places','user_submitted','verified')),
  ADD COLUMN IF NOT EXISTS doctor_led boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS consultation_fee integer,
  ADD COLUMN IF NOT EXISTS package_price_low integer,
  ADD COLUMN IF NOT EXISTS package_price_high integer,
  ADD COLUMN IF NOT EXISTS pros text[],
  ADD COLUMN IF NOT EXISTS cons text[],
  ADD COLUMN IF NOT EXISTS red_flags text[],
  ADD COLUMN IF NOT EXISTS admin_notes text;

CREATE INDEX IF NOT EXISTS idx_clinics_city ON public.clinics(city);
CREATE INDEX IF NOT EXISTS idx_clinics_country ON public.clinics(country);
CREATE INDEX IF NOT EXISTS idx_clinics_brand ON public.clinics(brand_name);

-- =========================================================================
-- 2. doctors table
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES public.clinics(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  qualification text,
  years_experience integer,
  city text,
  country text,
  techniques text[],
  bio text,
  profile_url text,
  photo_url text,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified','admin_verified','sample')),
  reputation_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctors TO anon, authenticated;
GRANT ALL ON public.doctors TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors are publicly readable" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Admins manage doctors" ON public.doctors FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER doctors_touch BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================================
-- 3. photo_analysis_jobs
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.photo_analysis_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','failed')),
  error text,
  source text NOT NULL DEFAULT 'user' CHECK (source IN ('guest','user')),
  inputs jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photo_analysis_jobs TO authenticated;
GRANT ALL ON public.photo_analysis_jobs TO service_role;
ALTER TABLE public.photo_analysis_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their analysis jobs" ON public.photo_analysis_jobs FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER photo_jobs_touch BEFORE UPDATE ON public.photo_analysis_jobs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================================
-- 4. photo_analysis_results
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.photo_analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.photo_analysis_jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  norwood_stage text,
  ludwig_stage text,
  pattern text,
  affected_zones text[],
  graft_estimate_low integer,
  graft_estimate_high integer,
  zone_split jsonb,
  donor_quality text,
  sessions_required integer,
  risk_flags text[],
  confidence_score numeric(3,2),
  notes text,
  raw_response jsonb,
  is_demo boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photo_analysis_results TO authenticated;
GRANT ALL ON public.photo_analysis_results TO service_role;
ALTER TABLE public.photo_analysis_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own results" ON public.photo_analysis_results FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- =========================================================================
-- 5. image_quality_scores
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.image_quality_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_id uuid REFERENCES public.scalp_photos(id) ON DELETE CASCADE,
  job_id uuid REFERENCES public.photo_analysis_jobs(id) ON DELETE CASCADE,
  lighting_score numeric(3,2),
  angle_score numeric(3,2),
  blur_score numeric(3,2),
  scalp_visibility_score numeric(3,2),
  overall_score numeric(3,2),
  issues text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.image_quality_scores TO authenticated;
GRANT ALL ON public.image_quality_scores TO service_role;
ALTER TABLE public.image_quality_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own quality scores" ON public.image_quality_scores FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- =========================================================================
-- 6. clinic_submissions
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.clinic_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  clinic_name text NOT NULL,
  city text,
  country text,
  website text,
  phone text,
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clinic_submissions TO authenticated;
GRANT ALL ON public.clinic_submissions TO service_role;
ALTER TABLE public.clinic_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users create and see own submissions" ON public.clinic_submissions FOR SELECT TO authenticated
  USING (auth.uid() = submitted_by OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users insert submissions" ON public.clinic_submissions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins manage submissions" ON public.clinic_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete submissions" ON public.clinic_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER submissions_touch BEFORE UPDATE ON public.clinic_submissions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================================
-- 7. audit_log
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit log" ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Authenticated insert audit log" ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_id);
