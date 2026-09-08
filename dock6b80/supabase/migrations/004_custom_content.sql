-- Settlement Generator — Migration 004
-- Adds: custom_content table for premium-only user-created content
--
-- Categories: institutions, resources, stressors, tradeGoods, tradeRoutes,
-- powerPresets, defensePresets
--
-- Each row is a single custom item; the JSONB `data` column holds the full
-- item shape (name, description, tags, fields specific to category, etc.).
-- Free users can read their grandfathered local items but cannot create/edit
-- in the cloud — this gate is enforced at the application layer.

CREATE TABLE IF NOT EXISTS public.custom_content (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category    text NOT NULL,
  data        jsonb NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT custom_content_category_check
    CHECK (category IN (
      'institutions',
      'resources',
      'stressors',
      'tradeGoods',
      'tradeRoutes',
      'powerPresets',
      'defensePresets'
    ))
);

-- Index for fast per-user lookups grouped by category
CREATE INDEX IF NOT EXISTS custom_content_user_category_idx
  ON public.custom_content (user_id, category);

-- Auto-update `updated_at` on row modification
CREATE OR REPLACE FUNCTION public.touch_custom_content_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'custom_content_touch_updated_at'
  ) THEN
    CREATE TRIGGER custom_content_touch_updated_at
      BEFORE UPDATE ON public.custom_content
      FOR EACH ROW EXECUTE FUNCTION public.touch_custom_content_updated_at();
  END IF;
END $$;

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.custom_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own custom content" ON public.custom_content
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users insert own custom content" ON public.custom_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own custom content" ON public.custom_content
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users delete own custom content" ON public.custom_content
  FOR DELETE USING (auth.uid() = user_id);

-- Developers/admins can read all custom content (for support/debugging)
CREATE POLICY "developers read all custom content" ON public.custom_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('developer', 'admin')
    )
  );
