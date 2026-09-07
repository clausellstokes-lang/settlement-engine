-- ────────────────────────────────────────────────────────────────────────────
-- 058_scope_system_config_public_read.sql — make system_config private-by-default
-- at the read boundary (review B16 finding #15).
--
-- THE PROBLEM
--   002 created system_config with `CREATE POLICY ... FOR SELECT USING (true)` —
--   so EVERY row is world-readable by any anonymous visitor. Today the only row is
--   the benign support_enabled flag, but the open-ended `using (true)` invites a
--   leak the moment an operator drops a sensitive key (feature flags, internal
--   thresholds, future operational config) into the table.
--
-- THE FIX
--   Replace the blanket policy with a KEY ALLOWLIST: only the explicitly public
--   keys are anon-readable; every other key is private by default. Writes still go
--   exclusively through the service_role (no insert/update policy), unchanged.
--   Elevated roles can still read everything via their own admin paths; this only
--   tightens the ANON/authenticated public read.
--
-- Adding a new public key in future = extend the allowlist in a follow-up
-- migration (a deliberate, reviewed act) rather than relying on default-public.
--
-- Re-runnable: DROP POLICY IF EXISTS + CREATE POLICY.
-- Depends on: 002 (system_config + the original blanket policy).
-- ────────────────────────────────────────────────────────────────────────────

-- Drop the blanket `using (true)` read so nothing is public-by-default.
drop policy if exists "Anyone can read system config" on public.system_config;

-- Public reads are now scoped to a known-safe allowlist of keys. A newly added
-- config key is PRIVATE until it is explicitly added here.
drop policy if exists "Public reads scoped to safe config keys" on public.system_config;
create policy "Public reads scoped to safe config keys" on public.system_config
  for select
  using (key in ('support_enabled'));

comment on policy "Public reads scoped to safe config keys" on public.system_config is
  'Anon/authenticated may read ONLY the allowlisted public keys (currently support_enabled). Every other key is private by default — add new public keys here deliberately. Writes remain service_role-only (no insert/update policy).';
