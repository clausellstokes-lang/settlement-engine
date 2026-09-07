-- Settlement Generator — Migration 200
-- W-FAITH F1c: the deity's AUTHORED CHARACTER — `authoredTemper`, paradigm-chart
-- positions, and the typed boon/bane pairs.
--
-- ⚠⚠ NOT DEPLOYED BY THE LANE THAT WROTE IT. Migrations are owner-gated at deploy
-- (`supabase db push` plus a bump of supabase/applied-head.json in the same act).
-- Until then the repo head sits ahead of the applied head, which
-- scripts/check-migration-head.mjs reports as a visible pending migration rather
-- than a failure. Nothing in the application waits on this: the JS admission wall
-- (customContentAdmission.js, driven by the generated projection of
-- schema/custom-content.manifest.json), the edge validator, and migration 185's
-- `_custom_content_record_valid` all already refuse a malformed value. This CHECK
-- is the LEGACY `custom_content` table's half of the same law, in the 049/056
-- idiom, and it is the only half that is not already true in production.
--
-- WHAT THIS ADDS, on top of 049 (three axes) and 056 (lawAxis):
--   • authoredTemper — OPTIONAL. Absent is the legacy shape and reads as "derive"
--     (deityAxes.deityTemper). A present value must be warlike/peacelike/neutral.
--     A SEPARATE field from the retired `temperamentAxis` mirror, which 049 still
--     requires and which stays inert to every engine temper read.
--   • characterAxes — OPTIONAL leveled positions on the shared paradigm chart, as
--     a JSON array of `AXIS:pole:level` tokens. Absent is the legacy shape.
--   • boonChannel/boonStrength and baneChannel/baneStrength — OPTIONAL typed
--     picks. Pure buff, pure bane, both, and neither are ALL legal (ODQ §797.4);
--     the only rule is that a channel and its strength travel together.
--
-- BACK-COMPAT: every guard below follows the 056 `lawAxis` pattern, NOT the 049
-- `IS NOT NULL` pattern — a NULL/absent field is ADMITTED and only a PRESENT bad
-- value is rejected. Every deity authored before this migration carries none of
-- these fields, so no existing row changes its verdict.
--
-- DIVINE IMMUTABILITY (ODQ §800.3 J4): there is deliberately NO drift column and
-- no drift key. A deity's positions are frozen at authoring; only its FORTUNES
-- (the pantheon ledger, elsewhere) move. The application refuses the drift-key
-- spellings by name (customContentSchema.validateDeity) and the canonical
-- admission wall refuses every unregistered field, so a drift key on a deity is
-- unrepresentable above this layer.
--
-- Idempotent / guarded (drop + re-add — the only safe way to extend a named CHECK
-- in Postgres). Re-run is a no-op. No RLS change (inherited from 004/017).

-- 1. The chart-position predicate.
--
-- WHY A FUNCTION AND NOT AN INLINE EXPRESSION: a CHECK constraint may not contain
-- a subquery or a set-returning call, and the one-position-per-axis rule is
-- inherently a set rule (count the DISTINCT axes and compare to the length). An
-- IMMUTABLE SQL function is the only lawful home for it, and a plain function call
-- IS legal inside a CHECK.
--
-- CASE rather than a chain of ANDs on purpose: SQL does not guarantee AND
-- short-circuits, and `jsonb_array_elements` ERRORS on a non-array, so a guard that
-- only "usually" runs first would turn a malformed value into a hard exception
-- instead of a clean rejection. CASE evaluates in written order.
--
-- EXECUTE is deliberately NOT revoked (unlike 185's `_custom_content_record_valid`,
-- which is only ever called from SECURITY DEFINER bodies): a CHECK is evaluated as
-- the writing role, so revoking EXECUTE here would make every deity write fail.
--
-- The axis roster mirrors DEITY_CHART_AXIS_IDS in src/domain/customContentSchema.js
-- and the `deityAxisPosition` schema in schema/custom-content.manifest.json. It is
-- the paradigm catalog's roster MINUS every axis whose existence is itself an open
-- owner ruling (DEVOTION carries `ownerRulingPending`), so nothing is frozen into a
-- database constraint ahead of the pen.
create or replace function public._deity_chart_axes_valid(p_axes jsonb)
returns boolean
language sql
immutable
as $$
  select case
    -- Absent is always legal: a god at neutral on every axis is a real choice.
    when p_axes is null then true
    -- THE SCALAR ARM. The manifest types this field `string-or-string-list`, and
    -- every layer above honours both arms: the JS admission wall
    -- (customContentAdmission.validateStringList), the edge validator, and
    -- migration 185's own `_custom_content_record_valid`. A single position must
    -- therefore be authorable as a bare token, or the database would refuse
    -- content the whole application admits. One token cannot repeat an axis, so
    -- the vocabulary check is the entire rule on this arm.
    when jsonb_typeof(p_axes) = 'string' then
      -- EXACTLY three colon-separated parts. `split_part` alone would read
      -- `MERCY:vice:defining:extra` as a valid token (it ignores the tail), while
      -- the JS wall compares against a closed list and rejects it — a divergence
      -- that would let the database admit content the application refuses.
      array_length(string_to_array(p_axes #>> '{}', ':'), 1) = 3
      and split_part(p_axes #>> '{}', ':', 1) in (
        'CANDOR', 'MERCY', 'COURAGE', 'TEMPER', 'GENEROSITY', 'HUMILITY',
        'FIDELITY', 'INDUSTRY', 'JUSTICE', 'PRUDENCE', 'TRUST', 'CHEER',
        'FORBEARANCE', 'PROTECTION', 'TEMPERANCE', 'CONTENT')
      and split_part(p_axes #>> '{}', ':', 2) in ('virtue', 'vice')
      and split_part(p_axes #>> '{}', ':', 3) in ('a_touch', 'marked', 'defining')
    when jsonb_typeof(p_axes) <> 'array' then false
    -- One position per axis, so the roster length IS the cap.
    when jsonb_array_length(p_axes) > 16 then false
    -- Every entry is a string from the closed AXIS:pole:level vocabulary.
    when exists (
      select 1
      from jsonb_array_elements(p_axes) as t(pos)
      where jsonb_typeof(t.pos) <> 'string'
         -- Same arity guard as the scalar arm above, same reason.
         or array_length(string_to_array(t.pos #>> '{}', ':'), 1) is distinct from 3
         or split_part(t.pos #>> '{}', ':', 1) not in (
              'CANDOR', 'MERCY', 'COURAGE', 'TEMPER', 'GENEROSITY', 'HUMILITY',
              'FIDELITY', 'INDUSTRY', 'JUSTICE', 'PRUDENCE', 'TRUST', 'CHEER',
              'FORBEARANCE', 'PROTECTION', 'TEMPERANCE', 'CONTENT')
         or split_part(t.pos #>> '{}', ':', 2) not in ('virtue', 'vice')
         or split_part(t.pos #>> '{}', ':', 3) not in ('a_touch', 'marked', 'defining')
    ) then false
    -- NO AXIS NAMED TWICE. The list shape can express what the model forbids, so
    -- the rule the volume calls arithmetic has to be enforced as a refusal here.
    else (
      select count(distinct split_part(t.pos #>> '{}', ':', 1)) = jsonb_array_length(p_axes)
      from jsonb_array_elements(p_axes) as t(pos)
    )
  end;
$$;

COMMENT ON FUNCTION public._deity_chart_axes_valid(jsonb) IS
  'W-FAITH F1c: is this a legal set of deity paradigm-chart positions? NULL/absent is legal; a present value must be a JSON array of at most 16 AXIS:pole:level tokens from the closed vocabulary, with no axis named twice. Mirrors customContentSchema.validateDeity and the deityAxisPosition schema in schema/custom-content.manifest.json.';

-- 2. Widen the deity-axes CHECK that 049 established and 056 extended.
ALTER TABLE public.custom_content
  DROP CONSTRAINT IF EXISTS custom_content_deity_axes_check;

ALTER TABLE public.custom_content
  ADD CONSTRAINT custom_content_deity_axes_check
    CHECK (
      category <> 'deities'
      OR (
        -- 049: the three required axes, unchanged.
        (data->>'alignmentAxis')   IS NOT NULL AND (data->>'alignmentAxis')   IN ('good', 'evil', 'neutral')
        AND (data->>'temperamentAxis') IS NOT NULL AND (data->>'temperamentAxis') IN ('warlike', 'peacelike', 'neutral')
        AND (data->>'rankAxis')        IS NOT NULL AND (data->>'rankAxis')        IN ('major', 'minor', 'cult')
        -- 056: lawAxis, tolerant of absence.
        AND ((data->>'lawAxis') IS NULL OR (data->>'lawAxis') IN ('lawful', 'chaotic', 'neutral'))
        -- F1c: the authored stance dial, tolerant of absence.
        AND ((data->>'authoredTemper') IS NULL
             OR (data->>'authoredTemper') IN ('warlike', 'peacelike', 'neutral'))
        -- F1c: the chart positions.
        AND public._deity_chart_axes_valid(data->'characterAxes')
        -- F1c: boon and bane. Each value is closed; each PAIR is both-or-neither.
        AND ((data->>'boonChannel') IS NULL OR (data->>'boonChannel') IN (
              'harvest', 'trade', 'craft', 'healing', 'sea', 'order',
              'war_readiness', 'learning', 'hearth'))
        AND ((data->>'baneChannel') IS NULL OR (data->>'baneChannel') IN (
              'harvest', 'trade', 'craft', 'healing', 'sea', 'order',
              'war_readiness', 'learning', 'hearth'))
        AND ((data->>'boonStrength') IS NULL OR (data->>'boonStrength') IN ('faint', 'firm', 'heavy'))
        AND ((data->>'baneStrength') IS NULL OR (data->>'baneStrength') IN ('faint', 'firm', 'heavy'))
        AND (((data->>'boonChannel') IS NULL) = ((data->>'boonStrength') IS NULL))
        AND (((data->>'baneChannel') IS NULL) = ((data->>'baneStrength') IS NULL))
      )
    );

COMMENT ON CONSTRAINT custom_content_deity_axes_check ON public.custom_content IS
  'Feature D / R1 + B5 + W-FAITH F1c: deity rows must carry valid alignment/temperament/rank axes; lawAxis, authoredTemper, characterAxes (one position per axis, closed AXIS:pole:level vocabulary) and the boon/bane pairs (both-or-neither) are all tolerated absent but validated when present. Mirrors validateDeity() and customContentSchema.js. Non-deity rows unaffected.';
