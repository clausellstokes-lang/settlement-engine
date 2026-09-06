-- ────────────────────────────────────────────────────────────────────────────
-- 197_consent_person_adjacent_default.sql — consent model v3, the server half.
--
-- THE RULING (§359.6): anonymous simulation aggregates are ON by CONSTRUCTION;
-- anything person-adjacent is OFF by DEFAULT.
--
-- The anonymous half needs nothing here. `world_sim_metrics` (196) is PII-free BY
-- SCHEMA — no actor column, no session column — so no flag governs it and none is
-- added. This migration is only the person-adjacent half: `research` goes back to
-- an opt-IN default, server-side, matching src/lib/consent.js v3.
--
-- PROVENANCE OF THE COLUMN: 036 creates telemetry_consent with default
-- '{"essential":true,"research":false,"ai_prose":false}'. 124 flipped `research`
-- true for the v2 opt-out and deliberately ran NO update. 194 added the
-- set_my_telemetry_consent RPC, the `v` stamp, and the consent_change_records
-- trigger. Those three are the whole history; this is the fourth and last toucher.
--
-- ── PART 1 · the fresh-profile default ──────────────────────────────────────
-- Exactly 124's inverse, which is to say: 036's original default, restored.
--
-- ── PART 2 · existing rows, and the predicate that decides them ─────────────
-- 124 could leave existing rows alone because the CLIENT resolved the effective
-- tier from `updatedAt`. v3 cannot: the flip is toward LESS capture, so a row left
-- reading `research: true` would keep the server clamp open for a user who never
-- chose it. So this migration does what 124 did not — it updates existing rows —
-- and therefore it needs a provenance test, because mass-flipping a recorded
-- choice is the exact harm 124's scope note refused.
--
-- ⚠ THE PREDICATE IS A CONJUNCTION, AND BOTH HALVES ARE LOAD-BEARING (§406).
-- The obvious test — "no consent_change_records rows" — is WRONG ON ITS OWN, and
-- the counterexample is ordinary: 194's trigger inserts a record only per CHANGED
-- key (194:439, reinforced by the table's own
-- `check (prior_value is distinct from new_value)`), while the `v` stamp lands
-- WHOLESALE with the row. So a user who opens Privacy & data and saves without
-- moving a toggle gets `v` stamped and ZERO change records. Flipping them would
-- silently overturn a deliberate review that chose to leave research on.
-- The reverse gap is real too: the trigger defaults its version to 1 when `v` is
-- absent (194:430), so a non-mirror write can leave change records on a row that
-- carries no `v`. Neither signal subsumes the other, so BOTH must be absent:
--
--     (telemetry_consent ->> 'v') is null      -- never mirrored by a user save
--   AND no consent_change_records row           -- no recorded consent event ever
--
-- A row is touched only when it carries no trace of a human decision by either
-- measure. The residual, stated plainly:
--   • neither signal  → flipped OFF. This is the intent: a pure column default
--     that no user ever chose.
--   • `v` stamped     → untouched, including the no-op-save reviewer above.
--   • change records  → untouched.
--   • UNDER-FLIP (a user who never chose but is skipped anyway) requires an
--     automatic path that stamps `v` without a user action. Verified absent at
--     this pin: the only writer of profiles.telemetry_consent is
--     consentSync.pushTelemetryConsent (consentSync.js:102), whose only caller is
--     PrivacySettings.update() (PrivacySettings.jsx:123), a toggle handler. The
--     sign-in path (authSlice.js:381 → reconcileTelemetryConsent) SELECTs and then
--     narrows the LOCAL record only; it never calls the RPC. So the under-flip set
--     is empty by construction, and stays empty only while that remains true — a
--     future boot-time mirror write would silently widen it.
--
-- THE TRIGGER FIRES ON THIS UPDATE, AND THAT IS INTENDED. Each flipped row lands
-- a consent_change_records row (research true→false) with source 'system' — the
-- trigger's documented default when app.telemetry_consent_source is unset
-- (194:429). That is the honest audit trail: the change really did happen, and it
-- really was the system, not the user, that made it.
--
-- `updated_at` is deliberately NOT touched. It is the profile's user-facing
-- last-modified signal, and the user did not modify their profile.
--
-- RE-RUNNABLE. Part 1 is a plain SET DEFAULT. Part 2 is doubly idempotent: a
-- second run matches nothing, because every row it flipped now fails BOTH the
-- `research is true` clause and the no-change-records clause.
-- ────────────────────────────────────────────────────────────────────────────

-- ── PART 1 · fresh profiles mint with research OFF (036's default, restored) ──
alter table public.profiles
  alter column telemetry_consent
  set default '{"essential": true, "research": false, "ai_prose": false}'::jsonb;

-- ── PART 2 · existing rows with no trace of a human decision ─────────────────
update public.profiles p
   set telemetry_consent = jsonb_set(p.telemetry_consent, '{research}', 'false'::jsonb, true)
 where (p.telemetry_consent ->> 'v') is null
   and coalesce((p.telemetry_consent ->> 'research')::boolean, false) is true
   and not exists (
     select 1 from public.consent_change_records c where c.user_id = p.id
   );

-- @rollback: Forward-fix first. This migration is data-safe to reverse only in the
--   narrow sense that its shape change is a column DEFAULT:
--     `alter table public.profiles alter column telemetry_consent set default
--      '{"essential": true, "research": true, "ai_prose": false}'::jsonb;`
--   restores 124's v2 default for fresh profiles.
--   PART 2 IS NOT MECHANICALLY REVERSIBLE, BY DESIGN. Re-flipping the updated rows
--   back to research:true would re-opt-in a population on a default they never
--   chose — the v2 lesson, run backwards. The rows this migration changed are
--   individually identifiable (a consent_change_records row, research true→false,
--   source 'system', created in this migration's window), so a targeted reversal is
--   possible if the owner ever directs one; it is not scripted here because doing it
--   unreviewed is the harm. The person-adjacent OFF default is owner-ruled (§359.6)
--   — roll back only on owner direction.
