-- ────────────────────────────────────────────────────────────────────────────
-- 124_consent_research_optout_default.sql — the owner-ratified research OPT-OUT.
--
-- MERGE PROVENANCE (Wave-1): our former 051, renumbered onto the adopted chain.
-- telemetry_consent is owned by 036 (the only migration that touches it — it
-- creates the column with default '{"essential":true,"research":false,
-- "ai_prose":false}'). This is an idempotent ALTER … SET DEFAULT that flips only
-- the `research` flag going forward; no other migration in 037–123 redefines the
-- column default, so 036 → 124 is the whole provenance.
--
-- Consent model v2 (client side: src/lib/consent.js). `research` flips from an
-- opt-IN default (false) to an opt-OUT default (true): new users contribute
-- anonymous STRUCTURAL data unless they turn it off. This migration moves the
-- server-side default that mints a fresh profile's telemetry_consent to match.
--
-- ── Scope discipline: NEW ROWS ONLY ─────────────────────────────────────────
-- We ALTER the column DEFAULT only. We deliberately DO NOT run any UPDATE:
-- existing rows keep whatever they hold. An existing profile either:
--   • carries a value the user explicitly set (honor it — mass-updating would
--     silently re-opt-in someone who opted out), or
--   • carries the old default (unset) — the CLIENT resolves the effective tier
--     via the `updatedAt` provenance in consent.js (updatedAt===0 / absent ⇒ new
--     default applies), and the server clamps to min(client, this column). So a
--     legacy row need not be rewritten here to get the new default behavior.
--
-- DNT is a client-only signal (the server can't observe it); the server default
-- is the opt-out baseline and the client honors DNT before anything is sent.
-- 036 created the column + old default; this only changes the default going
-- forward. Re-runnable (plain ALTER … SET DEFAULT is idempotent).
-- ────────────────────────────────────────────────────────────────────────────

alter table public.profiles
  alter column telemetry_consent
  set default '{"essential": true, "research": true, "ai_prose": false}'::jsonb;

-- NO UPDATE statement, by design. Existing rows are not mass-flipped — see the
-- scope note above. Explicit user choices and the client-side updatedAt
-- provenance are the source of truth for anyone who already has a profile.
