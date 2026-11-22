-- Settlement Generator — Migration 003
-- Adds: RLS policies for admin/developer access to profiles and support_messages

-- ── Allow developers to read all profiles ──────────────────────────────────
CREATE POLICY "Developers read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('developer', 'admin')
    )
  );

-- ── Allow developers to update any profile ─────────────────────────────────
CREATE POLICY "Developers update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('developer', 'admin')
    )
  );

-- ── Allow developers to read all support messages ──────────────────────────
CREATE POLICY "Developers read all support messages" ON public.support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('developer', 'admin')
    )
  );

-- ── Allow developers to update support message status ──────────────────────
CREATE POLICY "Developers update support messages" ON public.support_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('developer', 'admin')
    )
  );

-- ── Add email column to profiles if not exists ─────────────────────────────
-- (Needed for admin panel user search)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

-- ── Add tier column to profiles if not exists ──────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'free'
    CHECK (tier IN ('free', 'premium'));

-- ── Sync email from auth.users into profiles via trigger ───────────────────
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'sync_email_on_user_update'
  ) THEN
    CREATE TRIGGER sync_email_on_user_update
      AFTER UPDATE OF email ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.sync_profile_email();
  END IF;
END $$;

-- ── Backfill emails from auth.users into profiles ──────────────────────────
UPDATE public.profiles p
  SET email = u.email
  FROM auth.users u
  WHERE p.id = u.id AND (p.email IS NULL OR p.email != u.email);
