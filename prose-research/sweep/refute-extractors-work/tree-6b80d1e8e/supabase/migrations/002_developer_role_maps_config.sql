-- Settlement Generator — Migration 002
-- Adds: developer role, saved maps/campaigns, system config, display name

-- ── Developer role on profiles ──────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'developer', 'admin')),
  ADD COLUMN IF NOT EXISTS display_name text;

-- ── Saved map campaigns ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  map_seed text,
  map_data jsonb,
  burg_settlement_map jsonb DEFAULT '{}'::jsonb,
  supply_chain_config jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_maps_user ON public.saved_maps(user_id);

-- RLS for saved_maps
ALTER TABLE public.saved_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own maps" ON public.saved_maps
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own maps" ON public.saved_maps
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own maps" ON public.saved_maps
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own maps" ON public.saved_maps
  FOR DELETE USING (auth.uid() = user_id);

-- updated_at trigger for saved_maps
CREATE TRIGGER set_updated_at_saved_maps
  BEFORE UPDATE ON public.saved_maps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── System config (developer-managed key-value store) ───────────────────────
CREATE TABLE IF NOT EXISTS public.system_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read system config (needed for contact form to know if support is enabled)
CREATE POLICY "Anyone can read system config" ON public.system_config
  FOR SELECT USING (true);

-- Only developers can write system config (enforced by edge function, but RLS as backup)
-- We use service_role for writes, so no insert/update policy needed for regular users

-- ── Support messages table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_user ON public.support_messages(user_id);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own support messages" ON public.support_messages
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create support messages" ON public.support_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Owner role bootstrap + default system config ────────────────────────────
-- Per-deployment data (owner UUID, support email) moved out of the canonical
-- schema. New instances should run supabase/seed_local.sql separately with
-- their own values. The schema migration no longer contains identity-specific
-- rows so anyone forking this repo doesn't inherit the original maintainer's
-- developer access or support inbox.
--
-- A clean schema apply still produces a working app: the system_config rows
-- read with `support_enabled=false` by default in the application code path
-- (lib/supabase.js reads the row and treats missing/false as "disabled"),
-- and there are simply no developer-role users until seed_local sets one.
