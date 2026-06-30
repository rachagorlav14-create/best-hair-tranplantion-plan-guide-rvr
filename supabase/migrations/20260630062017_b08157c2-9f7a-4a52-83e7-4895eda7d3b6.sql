-- Move sensitive doctor reputation_notes into an admin-only table, matching the clinic_admin_notes pattern.
CREATE TABLE IF NOT EXISTS public.doctor_admin_notes (
  doctor_id uuid PRIMARY KEY REFERENCES public.doctors(id) ON DELETE CASCADE,
  reputation_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctor_admin_notes TO authenticated;
GRANT ALL ON public.doctor_admin_notes TO service_role;

ALTER TABLE public.doctor_admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read doctor admin notes"
  ON public.doctor_admin_notes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert doctor admin notes"
  ON public.doctor_admin_notes FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update doctor admin notes"
  ON public.doctor_admin_notes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete doctor admin notes"
  ON public.doctor_admin_notes FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Migrate any existing reputation_notes data from public doctors table.
INSERT INTO public.doctor_admin_notes (doctor_id, reputation_notes)
SELECT id, reputation_notes
FROM public.doctors
WHERE reputation_notes IS NOT NULL AND length(trim(reputation_notes)) > 0
ON CONFLICT (doctor_id) DO NOTHING;

-- Drop the publicly-readable sensitive column.
ALTER TABLE public.doctors DROP COLUMN IF EXISTS reputation_notes;