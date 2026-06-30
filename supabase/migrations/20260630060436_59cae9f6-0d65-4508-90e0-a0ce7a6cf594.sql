
-- 1) Fix: clinics admin_notes publicly readable. Move to admin-only table.
CREATE TABLE IF NOT EXISTS public.clinic_admin_notes (
  clinic_id uuid PRIMARY KEY REFERENCES public.clinics(id) ON DELETE CASCADE,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clinic_admin_notes TO authenticated;
GRANT ALL ON public.clinic_admin_notes TO service_role;

ALTER TABLE public.clinic_admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read clinic admin notes" ON public.clinic_admin_notes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert clinic admin notes" ON public.clinic_admin_notes
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update clinic admin notes" ON public.clinic_admin_notes
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete clinic admin notes" ON public.clinic_admin_notes
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Migrate any existing notes
INSERT INTO public.clinic_admin_notes (clinic_id, notes)
SELECT id, admin_notes FROM public.clinics WHERE admin_notes IS NOT NULL
ON CONFLICT (clinic_id) DO NOTHING;

ALTER TABLE public.clinics DROP COLUMN IF EXISTS admin_notes;

-- 2) Fix: audit_log arbitrary inserts by authenticated users. Drop insert policy; only service_role (bypasses RLS) can write.
DROP POLICY IF EXISTS "Authenticated insert audit log" ON public.audit_log;

-- 3) Fix: SECURITY DEFINER has_role executable by signed-in users.
-- Convert has_role to SECURITY INVOKER. user_roles RLS allows users to read their own roles,
-- which is exactly the lookup the policies perform (has_role(auth.uid(), ...)).
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
