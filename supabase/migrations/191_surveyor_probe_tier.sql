-- ────────────────────────────────────────────────────────────────────────────
-- 191_surveyor_probe_tier.sql — THE COMPETENCY PROBE receipt: the tier a BYOK
-- model EARNED BY DEMONSTRATION, stored beside its health (mig-143 idiom).
--
-- WHY THIS EXISTS
--   docs/DESIGN_AI_CAPABILITY_LADDER.md §1.2 (DEMONSTRATED, NOT DECLARED) + §3
--   piece 4: a model's ceiling may never be assigned from its own name or from an
--   introspective self-assessment. The repo's conflicted-witness rule
--   (docs/DESIGN_AI_CONTROL_SURFACE.md) already forbids a self-emitted tag from
--   gating the trust ladder. So the tier is MEASURED: the surveyor-byok 'probe'
--   action runs three canonical bucketing tasks on the user's own key and grades
--   them with the SAME deterministic validators the schema walls run. The pass
--   count picks the tier. This migration is the state that receipt lands in:
--     • surveyor_byok_keys gains probe_tier + probe_checked_at + probe_model +
--       probe_version + probe_profile (NOT the key — the vault's never-selectable
--       ciphertext is untouched).
--     • surveyor_byok_set RESETS probe_tier on every set/rotate, exactly as it
--       resets health: a new key may run a different model, and a tier a
--       previous key earned is not evidence about this one.
--     • surveyor_byok_status() returns the tier alongside the health, so the
--       settings surface can say in one plain sentence what the key demonstrated.
--     • surveyor_byok_set_probe_tier() is the SERVICE-ROLE-ONLY writer (the edge,
--       after grading), mirroring surveyor_byok_set_health().
--
-- ⚠ AMENDED IN PLACE 2026-07-27 (wave L-7a, THE FORMATIVE EXAM). Why editing this file
--   rather than adding a 193: this migration is UNCOMMITTED and UNDEPLOYED — it exists
--   only as an untracked file in the integration worktree, and no database anywhere has
--   applied a byte of it. It is therefore the exact INVERSE of the hazard recorded as
--   owner queue item M38, where migrations 024/057 were retro-edited AFTER prod had
--   applied them and repo replay-from-scratch consequently diverges from prod's applied
--   bytes. No such divergence is possible here: there are no applied bytes to diverge
--   from, and a 193 would only leave a two-migration seam for readers to reassemble.
--   The moment this file is committed and pushed, that argument expires and every
--   further change is a forward migration.
--   WHAT THE AMENDMENT ADDS — the exam's TEXTURE, so the measurement can teach the model
--   it measured rather than only rank it (owner ruling 2026-07-27: "the exam should feed
--   into the actual model rather than only be a gate of choosing the model"):
--     • probe_version — closes the deferral L-3b recorded twice (a tier measured under
--       one exam is not comparable with a tier measured under another, and the ↻ PROBE v2
--       spec freezes its fixtures per version). The 4th-column persistence-shape question
--       that made it owner-gated at L-3b is resolved by the same owner ruling.
--     • probe_profile — the per-task verdicts, so a coaching block can name the exact
--       thing a model got wrong. It is VERDICTS, NOT PROSE, and the setter enforces that
--       structurally rather than trusting its one caller (§4 below).
--
-- ⚠ AMENDED IN PLACE AGAIN 2026-07-27 (wave L-WIRE, THE COACHING WIRING). The M38-inverse
--   argument above still holds byte for byte: this file remains UNCOMMITTED and UNDEPLOYED,
--   so there are still no applied bytes to diverge from, and the argument still expires the
--   moment it is committed and pushed.
--   WHAT THIS AMENDMENT ADDS — §5 below widens surveyor_byok_get so the per-request decrypt
--   ALSO returns the exam receipt. The coaching block renders per model, on the same
--   request that decrypts the key, and the alternative was a SECOND round-trip on the
--   hot path of every AI call to fetch three columns that live in the row already. This is
--   the same CARRY-ALL discipline §2 and §3 apply: 139's whole behaviour is reproduced and
--   the new fields are additive.
--   ⚠ IT IS A RETURN-TYPE CHANGE, so it is a DROP and CREATE rather than a CREATE OR
--   REPLACE (Postgres refuses to replace a function's return type), and the grants are
--   therefore re-applied immediately after. Both statements sit inside this one migration,
--   so no transaction ever observes the function missing.
--   ⚠ DEPLOY-ORDER SAFETY: edge functions and migrations deploy separately, so both orders
--   must work. ai-analyst/byok.ts therefore accepts BOTH shapes permanently — the legacy
--   bare-text return and the new object — and a rollback to 139's body degrades to "no
--   coaching" rather than to "no BYOK for anyone". That tolerance is the deploy contract,
--   not a temporary scaffold.
--
-- ⚠ AMENDED IN PLACE A THIRD TIME 2026-07-27 (the integration-skeptic pass). The
--   M38-inverse argument above STILL holds unchanged: this file remains UNCOMMITTED and
--   UNDEPLOYED, so there are no applied bytes anywhere to diverge from, and the argument
--   still expires the moment it is committed and pushed.
--   WHAT THIS AMENDMENT ADDS — §5's surveyor_byok_get also returns probe_model, making the
--   returned envelope the CARRY-ALL it was already documented to be (probe_model was the
--   one probe column surveyor_byok_status returned and this function did not).
--   WHY IT IS NEEDED, not merely tidier: coaching is a per-MODEL statement. The stored
--   profile records what one specific model did on the exam. Without probe_model the edge
--   cannot tell whether the model about to answer is the model that sat that exam, so a
--   user who probed on one model and then switched their preference to another would have
--   been shown the FIRST model's failures as if they were the second's. Coaching a model on
--   another model's mistakes is exactly the kind of unearned inference the demonstrated-not-
--   declared directive (§1.2) exists to forbid, and it is worse than no coaching. The edge
--   now renders the block only when probe_model equals the model actually resolved for the
--   request, and renders nothing on a mismatch. The column already exists (§2 added it) and
--   is already reset on rotate (§3), so this is purely a widening of what §5 hands back.
--
-- ⚠ THE PROFILE'S EXACT SHAPE (the setter REJECTS anything else, so this is a contract,
--   not a description). It mirrors probeCore.ts ProbeTaskResult[] verbatim, with
--   reasonClass normalized from absent-on-pass to an explicit null so the key set of
--   every task entry is identical and can be gated:
--
--     {
--       "tasks": [ { "key": "construct", "passed": true,  "reasonClass": null },
--                  { "key": "interpret", "passed": false, "reasonClass": "below_floor" } ],
--       "passes":   1,        -- how many tasks passed
--       "tasksRun": 2         -- always equals tasks[] length
--     }
--
--   Enforced by the setter: exactly those three top-level keys; 1..8 task entries; each
--   entry carrying exactly key/passed/reasonClass; `key` a BARE IDENTIFIER (^[A-Za-z]
--   [A-Za-z0-9]{0,31}$ — no spaces, no punctuation, so prose and ids are both
--   unrepresentable); `passed` a boolean; `reasonClass` null or one of the four declared
--   classes; a passed task carrying NO reason and a failed task carrying one. Nothing the
--   model wrote can reach this column: every value is either a boolean, a small integer,
--   or a token from a closed vocabulary. probe_version is likewise shape-checked to
--   semver at the column.
--   DRIFT OBLIGATION, stated so it is found: the four reason classes are spelled here AND
--   in probeCore.ts PROBE_REASON_CLASSES. A fifth class needs a forward migration; the
--   pglite suite and tests/edgeFunctions/surveyorByok.test.js bind the two spellings.
--
-- ⚠ TIER NAMES ARE WORKING NAMES. 'scout' / 'journeyman' / 'master' are the spec's
--   placeholders (docs/DESIGN_AI_CAPABILITY_LADDER.md §3 piece 3 + §5: "naming is
--   an owner taste pick"). The OWNER has not picked. A rename is a one-migration
--   check-constraint swap plus the edge's TIER_BY_PASSES table plus one client
--   sentence; nothing derives behaviour from the spelling.
--
-- ⚠ REGRESSION REPAIRED HERE (found while applying the latest-wins rule, 2026-07-27).
--   143 §2 redefined surveyor_byok_set to reset health to 'unverified' on set and
--   on rotate — the "never store as healthy unverified" rule. 159 §3 then redefined
--   surveyor_byok_set AGAIN to add the entitlement-gate RIDER, recreating it from
--   139's body rather than 143's, which SILENTLY DROPPED the health reset. Since 159
--   sorts after 143, the net-current deployed body does not reset health: a rotated
--   key keeps the previous key's 'healthy' status and its last_verified_at stamp
--   until something else re-writes them. tests/security/surveyorByokHealth.pglite.
--   test.js did not catch it because its source pin reads migration 143's FILE, not
--   the net-current body. This migration recreates surveyor_byok_set carrying ALL
--   THREE deltas at once — 139's base insert, 159's entitlement gate, 143's health
--   reset — plus the new probe_tier reset, and the companion pglite pin asserts the
--   NET-CURRENT body (last definition across the whole corpus), so the same
--   drop-a-delta-on-recreate accident reds next time instead of shipping.
--
-- SECURITY POSTURE — unchanged from 143/139: surveyor_byok_keys stays RLS-on with
--   ZERO select policy (ciphertext never selectable). The probe columns are read
--   ONLY through the definer surveyor_byok_status() (owner-scoped, no key material)
--   and written ONLY through the service-role surveyor_byok_set_probe_tier(). The
--   tier is a category tag, never prose, PII, or key material; probe_model is a
--   provider model id, which the user already sees in their own model picker; and
--   probe_profile is a closed-vocabulary verdict list that cannot express a sentence.
--
-- Depends on: 139 (surveyor_byok_keys + surveyor_byok_set + _surveyor_byok_secret),
--   143 (health columns + surveyor_byok_status + surveyor_byok_set_health), 159
--   (the entitlement-gate rider on surveyor_byok_set). Re-runnable
--   (add-column-if-not-exists + create-or-replace).
-- @rollback: drop function public.surveyor_byok_set_probe_tier(uuid, text, text, text, text, jsonb); drop function public.surveyor_byok_get(uuid, text); alter table public.surveyor_byok_keys drop column if exists probe_profile, drop column if exists probe_version, drop column if exists probe_model, drop column if exists probe_checked_at, drop column if exists probe_tier; then re-apply 139's surveyor_byok_get (the returns-text body, with its service_role grant), 143's surveyor_byok_status (the 7-column signature) and 159's surveyor_byok_set (the entitlement-gated body) — note that reverting surveyor_byok_set to 159 REOPENS the health-reset regression this migration repaired, and that reverting surveyor_byok_get to 139 simply stops coaching rendering (the edge accepts both shapes).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. the probe receipt columns on the vault (NOT the ciphertext) ──────────────
-- Nullable by design: NULL means "never probed", which is a different and honest
-- state from "probed and scored lowest". The ladder must be able to tell them apart
-- (an unprobed key gets the conservative floor and an invitation to probe; a key
-- that measured 'scout' gets the floor and no invitation).
alter table public.surveyor_byok_keys
  add column if not exists probe_tier       text
    check (probe_tier is null or probe_tier in ('scout','journeyman','master')),
  add column if not exists probe_checked_at timestamptz,   -- when the probe last ran, any outcome
  add column if not exists probe_model      text,          -- the model id that EARNED this tier
  -- L-7a. Shape-checked at the column rather than trusted from the caller: a version is a
  -- semver triple and nothing else, so no prose can ever land in a column whose whole job
  -- is to say which exam was sat.
  add column if not exists probe_version    text
    check (probe_version is null or probe_version ~ '^[0-9]+\.[0-9]+\.[0-9]+$'),
  -- L-7a. The per-task verdicts. The full shape contract is in this file's header, and
  -- the SETTER is where it is enforced (a check constraint cannot give a useful error,
  -- and the write path has exactly one caller to hold to account).
  -- ⚠ NO SEMICOLON may appear in these comments: the pglite suite extracts this ALTER
  -- non-greedily up to the first one, so a semicolon here would hand Postgres half a
  -- statement. The same trap the suite documents for the @rollback note.
  add column if not exists probe_profile    jsonb;

comment on column public.surveyor_byok_keys.probe_tier is
  'The capability tier this key MEASURED (DESIGN_AI_CAPABILITY_LADDER §1.2, demonstrated-not-declared): null = never probed, else scout | journeyman | master, set ONLY from the deterministic pass-count of the three canonical probe tasks. Never from a model self-assessment and never from the model name. Working names, owner taste pick pending. Read via surveyor_byok_status(); written via surveyor_byok_set_probe_tier().';

comment on column public.surveyor_byok_keys.probe_model is
  'The provider model id the probe actually ran on, so a tier can be told apart from the model it was earned by (a user who later switches model has a STALE tier, not a wrong one). Never a key, never prose.';

comment on column public.surveyor_byok_keys.probe_version is
  'Which EXAM earned this tier (probeCore.ts PROBE_VERSION). A tier measured under one exam is not comparable with a tier measured under another, and the probe v2 spec freezes its fixtures per version, so a stale version is the signal to re-probe. Semver-shaped by check constraint; never prose.';

comment on column public.surveyor_byok_keys.probe_profile is
  'The per-task VERDICTS of the run that earned this tier: {tasks:[{key,passed,reasonClass}],passes,tasksRun}. Verdicts, never prose - every value is a boolean, a small integer, or a token from a closed vocabulary, and the setter rejects anything else. Read by the deterministic coaching renderer (_shared/modelCoaching.ts), which turns a reason class into a frozen house sentence. NO model output is stored here, ever.';

-- ── 2. surveyor_byok_set — 139 base + 159 entitlement gate + 143 health reset ───
-- + the new probe reset. LATEST-WINS: this body must carry EVERY delta any earlier
-- definition added, because it is the one Postgres will end up with. See the header
-- note: 159 dropped 143's health reset by recreating from 139. Order inside the
-- body is 159's verbatim, with the reset columns re-added to both the insert and
-- the on-conflict update. CREATE OR REPLACE preserves the grants.
create or replace function public.surveyor_byok_set(p_provider text, p_key text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_uid uuid; v_provider text;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_key is null or btrim(p_key) = '' then raise exception 'key is required'; end if;
  -- RIDER (159, audit 1.3): BYOK is a Surveyor-tier capability. Refuse unless the
  -- caller holds an active entitlement or is a founder. Raises BEFORE any pgcrypto
  -- call, so an unentitled caller never reaches the vault.
  if not (public.has_surveyor_entitlement()
          or exists (select 1 from public.profiles where id = v_uid and is_founder)) then
    raise exception 'a Surveyor entitlement is required to set a provider key';
  end if;
  v_provider := coalesce(nullif(btrim(p_provider), ''), 'anthropic');
  insert into public.surveyor_byok_keys (
    user_id, provider, ciphertext, created_at, rotated_at,
    health, last_verified_at, last_checked_at, last_error_class,
    probe_tier, probe_checked_at, probe_model, probe_version, probe_profile
  )
  values (
    v_uid, v_provider, pgp_sym_encrypt(p_key, public._surveyor_byok_secret()), now(), now(),
    'unverified', null, null, null,
    null, null, null, null, null
  )
  on conflict (user_id, provider)
  do update set
    ciphertext       = excluded.ciphertext,
    rotated_at       = now(),
    health           = 'unverified',   -- 143: a rotated key must re-prove itself
    last_verified_at = null,
    last_checked_at  = null,
    last_error_class = null,
    probe_tier       = null,           -- 191: and must re-EARN its tier
    probe_checked_at = null,
    probe_model      = null,
    -- L-7a: the exam receipt clears WITH the tier. A profile outliving the tier that
    -- summarised it would coach the next key about a previous key's mistakes, which is
    -- the same class of lie 143's health reset exists to prevent.
    probe_version    = null,
    probe_profile    = null;
  return true;
end;
$$;
revoke all on function public.surveyor_byok_set(text, text) from public;
grant execute on function public.surveyor_byok_set(text, text) to authenticated;

comment on function public.surveyor_byok_set is
  'Store or rotate the caller OWN provider key (Surveyor-entitled or founder only). Resets health to unverified AND clears the whole probe receipt (tier, checked-at, model, exam version, per-task profile): a new key re-proves both that it works and what it can do.';

-- ── 3. surveyor_byok_status() — 143's seven columns PLUS the five probe fields ──
-- LATEST-WINS: every column 143 returned is carried here verbatim; the new ones are
-- APPENDED so existing positional readers keep their meaning. The L-7a pair is appended
-- after the L-3b trio for the same reason.
create or replace function public.surveyor_byok_status(p_provider text default null)
returns table (
  provider         text,
  has_key          boolean,
  health           text,
  last_verified_at timestamptz,
  last_checked_at  timestamptz,
  last_error_class text,
  rotated_at       timestamptz,
  probe_tier       text,
  probe_checked_at timestamptz,
  probe_model      text,
  probe_version    text,
  probe_profile    jsonb
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not authenticated'; end if;
  return query
    select k.provider, true, k.health, k.last_verified_at, k.last_checked_at, k.last_error_class,
           k.rotated_at, k.probe_tier, k.probe_checked_at, k.probe_model,
           k.probe_version, k.probe_profile
    from public.surveyor_byok_keys k
    where k.user_id = v_uid
      and (p_provider is null or k.provider = btrim(p_provider))
    order by k.provider;
end;
$$;
revoke all on function public.surveyor_byok_status(text) from public;
grant execute on function public.surveyor_byok_status(text) to authenticated;

comment on function public.surveyor_byok_status is
  'The user reads their OWN BYOK key health AND measured capability tier (provider, has_key, health, last_verified/checked, last_error_class, rotated_at, probe_tier, probe_checked_at, probe_model, probe_version, probe_profile) — NEVER the key material. The settings surface calls this.';

-- ── 4. surveyor_byok_set_probe_tier() — the edge writes the MEASURED receipt ────
-- SERVICE-ROLE ONLY, called by the surveyor-byok 'probe' action after grading the
-- three canonical tasks with the schema-wall validators. p_tier must be one of the
-- three measured classes: NULL is REJECTED rather than treated as a clear, because
-- the only legitimate clear is a key set/rotate (§2 above) and a silent tier wipe
-- from a caller bug would be indistinguishable from "never probed". probe_checked_at
-- is stamped on every successful write. No-op (returns false) when the user has no
-- key row for that provider.
--
-- L-7a SIGNATURE CHANGE (carrying the existing parameters forward, appending only):
-- p_probe_version and p_profile join with defaults, so any 4-argument call still
-- resolves to this function and simply records no exam receipt.
--
-- ⚠ THE PROFILE WALL. The whole point of the profile is that it holds VERDICTS and
-- cannot hold prose, and a rule enforced only in the caller is one careless edit from
-- being a lie — silently, because a stored sentence looks exactly like a stored token
-- until something renders it into a prompt. So the shape is checked HERE, at the write,
-- by the database that has no interest in the caller's good intentions. Every rejection
-- raises rather than degrading to null: a malformed profile means the edge and this
-- contract have drifted, and that must be loud in a log rather than quietly absent for
-- months. The full shape is spelled in this file's header.
create or replace function public.surveyor_byok_set_probe_tier(
  p_user          uuid,
  p_provider      text,
  p_tier          text,
  p_model         text default null,
  p_probe_version text default null,
  p_profile       jsonb default null
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_provider text; v_updated integer := 0; v_task jsonb; v_len integer;
begin
  if p_user is null then return false; end if;
  if p_tier is null or p_tier not in ('scout','journeyman','master') then
    raise exception 'invalid byok probe tier: %', p_tier;
  end if;

  -- THE PROFILE WALL (see the note above). Absent is always legal: a caller that records
  -- no texture is a 4-argument caller, not a broken one.
  if p_profile is not null then
    -- The type test stands ALONE, before anything that assumes an object: jsonb_object_keys
    -- raises its own error on a scalar, and SQL does not promise to short-circuit an OR, so
    -- folding these together would sometimes report the wrong fault.
    if jsonb_typeof(p_profile) <> 'object' then
      raise exception 'invalid byok probe profile: top level must be exactly {tasks, passes, tasksRun}';
    end if;
    if not (p_profile ?& array['tasks','passes','tasksRun'])
       or exists (select 1 from jsonb_object_keys(p_profile) k
                   where k not in ('tasks','passes','tasksRun')) then
      raise exception 'invalid byok probe profile: top level must be exactly {tasks, passes, tasksRun}';
    end if;
    if jsonb_typeof(p_profile->'tasks') <> 'array' then
      raise exception 'invalid byok probe profile: tasks must be an array of verdicts';
    end if;
    v_len := jsonb_array_length(p_profile->'tasks');
    -- An upper bound, not a guess at the exam size: it keeps a runaway caller from
    -- turning a verdict list into a payload, while leaving the exam free to grow.
    if v_len < 1 or v_len > 8 then
      raise exception 'invalid byok probe profile: tasks must hold between 1 and 8 verdicts, got %', v_len;
    end if;
    if jsonb_typeof(p_profile->'passes') <> 'number'
       or jsonb_typeof(p_profile->'tasksRun') <> 'number' then
      raise exception 'invalid byok probe profile: passes and tasksRun must be counts';
    end if;
    if (p_profile->>'tasksRun')::numeric <> v_len then
      raise exception 'invalid byok probe profile: tasksRun must equal the number of verdicts';
    end if;
    if (p_profile->>'passes')::numeric < 0 or (p_profile->>'passes')::numeric > v_len then
      raise exception 'invalid byok probe profile: passes must lie between 0 and the number of verdicts';
    end if;
    for v_task in select value from jsonb_array_elements(p_profile->'tasks') loop
      if jsonb_typeof(v_task) <> 'object' then
        raise exception 'invalid byok probe profile: each verdict must be exactly {key, passed, reasonClass}';
      end if;
      if not (v_task ?& array['key','passed','reasonClass'])
         or exists (select 1 from jsonb_object_keys(v_task) k
                     where k not in ('key','passed','reasonClass')) then
        raise exception 'invalid byok probe profile: each verdict must be exactly {key, passed, reasonClass}';
      end if;
      -- A BARE IDENTIFIER, which is what makes prose and ids structurally unrepresentable:
      -- no spaces, no punctuation, no length to hide a sentence in.
      if jsonb_typeof(v_task->'key') <> 'string'
         or (v_task->>'key') !~ '^[A-Za-z][A-Za-z0-9]{0,31}$' then
        raise exception 'invalid byok probe profile: a task key must be a bare identifier';
      end if;
      if jsonb_typeof(v_task->'passed') <> 'boolean' then
        raise exception 'invalid byok probe profile: passed must be a boolean verdict';
      end if;
      if not (jsonb_typeof(v_task->'reasonClass') = 'null'
              or (v_task->>'reasonClass') in
                 ('no_output','unsupported_emitted','dropped_at_wall','below_floor')) then
        raise exception 'invalid byok probe profile: reasonClass must be null or a declared reason class';
      end if;
      -- Pass and reason are two halves of one verdict; either half alone is a caller bug.
      if (v_task->>'passed') = 'true' and jsonb_typeof(v_task->'reasonClass') <> 'null' then
        raise exception 'invalid byok probe profile: a passed task carries no reason class';
      end if;
      if (v_task->>'passed') = 'false' and jsonb_typeof(v_task->'reasonClass') = 'null' then
        raise exception 'invalid byok probe profile: a failed task must name its reason class';
      end if;
    end loop;
  end if;

  v_provider := coalesce(nullif(btrim(p_provider), ''), 'anthropic');
  update public.surveyor_byok_keys
     set probe_tier       = p_tier,
         probe_checked_at = now(),
         probe_model      = nullif(btrim(p_model), ''),
         probe_version    = nullif(btrim(p_probe_version), ''),
         probe_profile    = p_profile
   where user_id = p_user and provider = v_provider;
  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;
revoke all on function public.surveyor_byok_set_probe_tier(uuid, text, text, text, text, jsonb) from public;
grant execute on function public.surveyor_byok_set_probe_tier(uuid, text, text, text, text, jsonb) to service_role;

comment on function public.surveyor_byok_set_probe_tier is
  'SERVICE-ROLE ONLY: the edge stamps the tier a key MEASURED after the three canonical probe tasks were graded by the schema-wall validators, together with the exam version and the per-task verdict profile. Never touches the ciphertext, never accepts a model self-assessment, rejects a null tier (only a key set/rotate clears one), and rejects any profile that is not a closed-vocabulary verdict list.';

-- ── 5. surveyor_byok_get() — 139's decrypt PLUS the exam receipt (wave L-WIRE) ──
-- LATEST-WINS, CARRY-ALL: 139's entire behaviour is reproduced verbatim (same lookup, same
-- provider defaulting, same null-on-missing-row, same SERVICE-ROLE-ONLY posture) and the
-- three probe fields are APPENDED. The only change is the envelope: a jsonb object instead
-- of a bare text key.
--
-- WHY WIDEN THIS FUNCTION rather than add a second one. The coaching block
-- (_shared/modelCoaching.ts) renders per model from the stored profile, and every AI call
-- already makes exactly this round-trip to decrypt the key. A second RPC would put an extra
-- database round-trip on the hot path of every Surveyor request to read three columns that
-- the row this query already touched is holding. The owner ruling for the wiring wave was
-- explicitly zero extra round-trips.
--
-- ⚠ RETURN-TYPE CHANGE, so DROP then CREATE: Postgres refuses to change a function's return
-- type through CREATE OR REPLACE. Both statements are in this migration, so the function is
-- never observably absent, and the grants below are re-applied because DROP takes them with
-- it. The signature (uuid, text) is unchanged, so no caller's argument list moves.
--
-- ⚠ THE VAULT POSTURE IS UNCHANGED. Still SECURITY DEFINER, still revoked from public,
-- still granted to service_role ONLY, still the sole path to plaintext, and still never
-- readable by the user themselves. The added fields are a category tag, a semver string and
-- a closed-vocabulary verdict list — the setter in §4 makes it impossible for prose to be
-- among them — so the widening carries no key material and no PII outward.
drop function if exists public.surveyor_byok_get(uuid, text);

create or replace function public.surveyor_byok_get(p_user uuid, p_provider text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_cipher bytea; v_tier text; v_model text; v_version text; v_profile jsonb;
begin
  select k.ciphertext, k.probe_tier, k.probe_model, k.probe_version, k.probe_profile
    into v_cipher, v_tier, v_model, v_version, v_profile
  from public.surveyor_byok_keys k
  where k.user_id = p_user and k.provider = coalesce(nullif(btrim(p_provider), ''), 'anthropic');
  -- 139's contract: no row means no key, and the caller falls back to the server key.
  if v_cipher is null then return null; end if;
  -- CARRY-ALL: every probe column the row holds, so the edge never needs a second
  -- round-trip and no future reader has to ask why one of the five was left behind.
  -- probe_model is what binds the profile to a model: the edge renders coaching only when
  -- it matches the model actually about to answer (see the third amendment note above).
  return jsonb_build_object(
    'key',           pgp_sym_decrypt(v_cipher, public._surveyor_byok_secret()),
    'probe_tier',    v_tier,
    'probe_model',   v_model,
    'probe_version', v_version,
    'probe_profile', v_profile
  );
end;
$$;
revoke all on function public.surveyor_byok_get(uuid, text) from public;
grant execute on function public.surveyor_byok_get(uuid, text) to service_role;

comment on function public.surveyor_byok_get is
  'Decrypt a user BYOK provider key AND return the exam receipt beside it: {key, probe_tier, probe_model, probe_version, probe_profile}. SERVICE-ROLE ONLY - the Surveyor edge functions call this per request and MUST NOT log the result. The user can never read their own plaintext back. The probe fields ride along so the deterministic coaching renderer can speak without a second round-trip; they are a category tag, a model id, a semver string and a closed-vocabulary verdict list, never prose and never key material. probe_model binds the profile to the model that earned it: the edge renders coaching only when it matches the model about to answer.';
