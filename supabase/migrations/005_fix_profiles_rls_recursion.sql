-- Settlement Generator — Migration 005
-- Fixes: infinite recursion in profiles RLS policies (introduced by 003)
--
-- Root cause: migration 003's "Developers read all profiles" policy contains
-- `EXISTS (SELECT 1 FROM public.profiles ...)` — evaluating the policy on
-- profiles triggers the SAME policy, which re-evaluates itself, etc.
--
-- Fix: wrap the role check in a SECURITY DEFINER function. SECURITY DEFINER
-- runs as the function owner and bypasses RLS on the tables it reads, so the
-- inner SELECT doesn't re-trigger the outer policy.
--
-- Safe to run whether or not migration 004 has been applied — the
-- custom_content policy drops/creates are guarded by DO blocks.

-- ── Helper function: is current user a developer/admin? ────────────────────
CREATE OR REPLACE FUNCTION public.current_user_is_privileged()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('developer', 'admin')
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_is_privileged() FROM public;
GRANT EXECUTE ON FUNCTION public.current_user_is_privileged() TO authenticated;

-- ── Drop recursive policies from migration 003 ─────────────────────────────
DROP POLICY IF EXISTS "Developers read all profiles"         ON public.profiles;
DROP POLICY IF EXISTS "Developers update any profile"        ON public.profiles;
DROP POLICY IF EXISTS "Developers read all support messages" ON public.support_messages;
DROP POLICY IF EXISTS "Developers update support messages"   ON public.support_messages;

-- Guard the custom_content drop — table may not exist yet if 004 hasn't run
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'custom_content'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "developers read all custom content" ON public.custom_content';
  END IF;
END $$;

-- ── Recreate without recursion ─────────────────────────────────────────────
CREATE POLICY "Developers read all profiles" ON public.profiles
  FOR SELECT USING (public.current_user_is_privileged());

CREATE POLICY "Developers update any profile" ON public.profiles
  FOR UPDATE USING (public.current_user_is_privileged());

CREATE POLICY "Developers read all support messages" ON public.support_messages
  FOR SELECT USING (public.current_user_is_privileged());

CREATE POLICY "Developers update support messages" ON public.support_messages
  FOR UPDATE USING (public.current_user_is_privileged());

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'custom_content'
  ) THEN
    EXECUTE 'CREATE POLICY "developers read all custom content" ON public.custom_content FOR SELECT USING (public.current_user_is_privileged())';
  END IF;
END $$;
