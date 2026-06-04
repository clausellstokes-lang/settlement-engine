-- ────────────────────────────────────────────────────────────────────────────
-- seed_local.sql - Per-deployment bootstrap data.
--
-- This file is NOT part of the canonical migration sequence. It exists so the
-- maintainer of a specific deployment can seed their own owner account,
-- support email, and any other identity-specific values without those bleeding
-- into the public migrations the whole world clones.
--
-- Usage:
--   1. Edit the values below to match your deployment.
--   2. Run against your project once after migrations are applied:
--        psql "$DATABASE_URL" -f supabase/seed_local.sql
--      (or paste into the Supabase SQL editor for a one-off run).
--   3. Do NOT commit your filled-in copy - keep your changes in a private
--      branch or apply directly. The file in the repo stays template-clean.
--
-- Values to replace:
--   <OWNER_UUID>   - auth.users.id of the deploying maintainer's account.
--                    Get this by signing in once, then `select auth.uid();`.
--   <SUPPORT_EMAIL> - the inbox that contact-form submissions email to.
-- ────────────────────────────────────────────────────────────────────────────

-- Grant the owner account the developer role + a display name.
-- Comment this out if you don't want a developer account on this deployment.

-- UPDATE public.profiles
--   SET role = 'developer', display_name = 'Owner'
--   WHERE id = '<OWNER_UUID>';

-- Set the public support email + enable the contact surface.
-- Comment these out to keep the contact form hidden.

-- INSERT INTO public.system_config (key, value) VALUES
--   ('support_email', '"<SUPPORT_EMAIL>"'),
--   ('support_enabled', 'true')
-- ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
