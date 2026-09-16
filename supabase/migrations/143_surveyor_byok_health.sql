-- ────────────────────────────────────────────────────────────────────────────
-- 143_surveyor_byok_health.sql — BYOK MANAGEMENT SURFACE: persistent key-health
-- + the VERIFY-BY-TEST-CALL receipt, and the aiOperationLog REFUSAL CLASS.
--
-- WHY THIS EXISTS
--   DESIGN_AI_CONTROL_SURFACE §3 + the owner commission (#29): a user who brings
--   their own provider key needs to SEE whether it works — a persistent
--   healthy/out-of-credit/invalid/rate-limited/down status with a last-verified
--   stamp — and the surface must NEVER present an unverified key as healthy. This
--   migration is the state that backs that:
--     • surveyor_byok_keys gains health + verification timestamps + last error
--       class (NOT the key — the vault's never-selectable ciphertext is untouched).
--     • surveyor_byok_set RESETS health to 'unverified' on every set/rotate, so a
--       freshly pasted key is never healthy until a real test-call proves it
--       (the "never store as healthy unverified" rule — the edge marks 'healthy'
--       ONLY after a successful minimal ping, via surveyor_byok_set_health).
--     • surveyor_byok_status() lets the user read their OWN health (never the key)
--       for the settings surface.
--     • ai_operation_log gains refusal_class so a refused/failed attempt is
--       RECEIPTED with WHY (out_of_credit / invalid / rate_limited / down / cap /
--       paused / …) — "the receipts culture applied to the user's own wallet".
--
-- SECURITY POSTURE — unchanged from 139/138:
--   surveyor_byok_keys stays RLS-on with ZERO select policy (ciphertext never
--   selectable). health/timestamps are read ONLY through the definer
--   surveyor_byok_status() (owner-scoped, no key material) and written ONLY through
--   the service-role surveyor_byok_set_health() (the edge, after a test-call/error).
--   The key is never touched by either. ai_operation_log stays append-only,
--   owner-read, definer-written; refusal_class is a category tag, never prose/PII/key.
--
-- Depends on: 139 (surveyor_byok_keys + surveyor_byok_set), 138/141 (ai_operation_log
--   + write_ai_operation_log 17-param). Re-runnable (add-column-if-not-exists +
--   create-or-replace + drop-if-exists).
-- @rollback: drop function public.surveyor_byok_set_health(uuid, text, text, text, boolean); drop function public.surveyor_byok_status(); alter table public.surveyor_byok_keys drop column if exists last_error_class, drop column if exists last_checked_at, drop column if exists last_verified_at, drop column if exists health; alter table public.ai_operation_log drop column if exists refusal_class; then re-apply 141's write_ai_operation_log (the 17-param signature) and 139's surveyor_byok_set.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. key-health columns on the vault (NOT the ciphertext) ─────────────────────
alter table public.surveyor_byok_keys
  add column if not exists health          text not null default 'unverified'
    check (health in ('unverified','healthy','out_of_credit','invalid','rate_limited','down')),
  add column if not exists last_verified_at timestamptz,   -- last SUCCESSFUL test-call
  add column if not exists last_checked_at  timestamptz,   -- last test-call OR live error, any outcome
  add column if not exists last_error_class text;          -- the class of the last failure (null when healthy)

comment on column public.surveyor_byok_keys.health is
  'Persistent BYOK key health (§3/#29): unverified until a real test-call proves it, then healthy | out_of_credit | invalid | rate_limited | down. NEVER healthy without a verified ping. Read via surveyor_byok_status(); written via surveyor_byok_set_health().';

-- ── 2. surveyor_byok_set RESETS health on set/rotate (never store as healthy) ───
-- Re-defined verbatim from 139 with ONE addition: a new/rotated key is 'unverified'
-- with no verification stamps and no error class — it becomes healthy ONLY after the
-- edge's verify-by-test-call succeeds. CREATE OR REPLACE preserves the grants.
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
  v_provider := coalesce(nullif(btrim(p_provider), ''), 'anthropic');
  insert into public.surveyor_byok_keys (user_id, provider, ciphertext, created_at, rotated_at, health, last_verified_at, last_checked_at, last_error_class)
  values (v_uid, v_provider, pgp_sym_encrypt(p_key, public._surveyor_byok_secret()), now(), now(), 'unverified', null, null, null)
  on conflict (user_id, provider)
  do update set
    ciphertext       = excluded.ciphertext,
    rotated_at       = now(),
    health           = 'unverified',   -- a rotated key must re-prove itself
    last_verified_at = null,
    last_checked_at  = null,
    last_error_class = null;
  return true;
end;
$$;
revoke all on function public.surveyor_byok_set(text, text) from public;
grant execute on function public.surveyor_byok_set(text, text) to authenticated;

-- ── 3. surveyor_byok_status() — the user reads their OWN health (never the key) ──
create or replace function public.surveyor_byok_status(p_provider text default null)
returns table (
  provider         text,
  has_key          boolean,
  health           text,
  last_verified_at timestamptz,
  last_checked_at  timestamptz,
  last_error_class text,
  rotated_at       timestamptz
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
    select k.provider, true, k.health, k.last_verified_at, k.last_checked_at, k.last_error_class, k.rotated_at
    from public.surveyor_byok_keys k
    where k.user_id = v_uid
      and (p_provider is null or k.provider = btrim(p_provider))
    order by k.provider;
end;
$$;
revoke all on function public.surveyor_byok_status(text) from public;
grant execute on function public.surveyor_byok_status(text) to authenticated;

comment on function public.surveyor_byok_status is
  'The user reads their OWN BYOK key health (provider, has_key, health, last_verified/checked, last_error_class) — NEVER the key material. The settings surface calls this.';

-- ── 4. surveyor_byok_set_health() — the edge writes health after a test-call ────
-- SERVICE-ROLE ONLY. Called by the surveyor-byok verify edge (after a minimal ping)
-- and by ai-analyst (when a live request classifies a provider error). p_health must
-- be a valid class; 'healthy' stamps last_verified_at. last_checked_at is always
-- stamped. No-op (returns false) when the user has no key row for that provider.
create or replace function public.surveyor_byok_set_health(
  p_user        uuid,
  p_provider    text,
  p_health      text,
  p_error_class text    default null,
  p_verified    boolean default false
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_provider text; v_updated integer := 0;
begin
  if p_user is null then return false; end if;
  if p_health is null or p_health not in ('unverified','healthy','out_of_credit','invalid','rate_limited','down') then
    raise exception 'invalid byok health class: %', p_health;
  end if;
  v_provider := coalesce(nullif(btrim(p_provider), ''), 'anthropic');
  update public.surveyor_byok_keys
     set health           = p_health,
         last_checked_at  = now(),
         last_verified_at = case when p_health = 'healthy' or p_verified then now() else last_verified_at end,
         last_error_class = case when p_health = 'healthy' then null else coalesce(nullif(btrim(p_error_class), ''), p_health) end
   where user_id = p_user and provider = v_provider;
  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;
revoke all on function public.surveyor_byok_set_health(uuid, text, text, text, boolean) from public;
grant execute on function public.surveyor_byok_set_health(uuid, text, text, text, boolean) to service_role;

comment on function public.surveyor_byok_set_health is
  'SERVICE-ROLE ONLY: the edge stamps BYOK key health after a verify test-call or a live provider error. Never touches the ciphertext. healthy ⇒ clears the error class + stamps last_verified_at.';

-- ── 5. ai_operation_log REFUSAL CLASS — receipt a refused/failed attempt's WHY ──
alter table public.ai_operation_log
  add column if not exists refusal_class text;   -- category of a refusal/failure (never prose/PII/key)

comment on column public.ai_operation_log.refusal_class is
  'The category of a refused/failed turn (#29): out_of_credit | invalid | rate_limited | down | cap | paused | read_only | … — so a failed attempt is receipted with WHY. Never prose, PII, or a key. Null on success.';

-- Drop the old 17-param writer first so the new 18-param version is the ONLY overload
-- (the S1b recipe: avoid create-or-replace signature-overload ambiguity).
drop function if exists public.write_ai_operation_log(
  uuid, text, text, text, text, text[], text[], text, text, text, boolean, numeric, integer, boolean, uuid, boolean, text
);

create or replace function public.write_ai_operation_log(
  p_user                uuid,
  p_feature             text,
  p_audience            text,
  p_prompt_hash         text,
  p_answer_hash         text    default null,
  p_retrieval_slice_ids text[]  default '{}',
  p_retrieval_sources   text[]  default '{}',
  p_model               text    default null,
  p_model_version       text    default null,
  p_provider            text    default null,
  p_byok                boolean default false,
  p_citation_coverage   numeric default null,
  p_claim_count         integer default null,
  p_refused             boolean default false,
  p_spend_id            uuid    default null,
  p_meta_probe          boolean default false,
  p_canary              text    default null,
  p_refusal_class       text    default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_id uuid;
begin
  if p_feature is null or btrim(p_feature) = '' then
    raise exception 'ai operation feature is required';
  end if;
  if p_prompt_hash is null or btrim(p_prompt_hash) = '' then
    raise exception 'ai operation prompt_hash is required';
  end if;
  insert into public.ai_operation_log (
    user_id, feature, audience, prompt_hash, answer_hash,
    retrieval_slice_ids, retrieval_sources, model, model_version, provider,
    byok, citation_coverage, claim_count, refused, spend_id,
    meta_probe, canary, refusal_class
  ) values (
    p_user, p_feature, coalesce(nullif(btrim(p_audience), ''), 'player'), p_prompt_hash, p_answer_hash,
    coalesce(p_retrieval_slice_ids, '{}'), coalesce(p_retrieval_sources, '{}'),
    p_model, p_model_version, p_provider,
    coalesce(p_byok, false), p_citation_coverage, p_claim_count,
    coalesce(p_refused, false), p_spend_id,
    coalesce(p_meta_probe, false), p_canary, nullif(btrim(p_refusal_class), '')
  )
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.write_ai_operation_log(uuid, text, text, text, text, text[], text[], text, text, text, boolean, numeric, integer, boolean, uuid, boolean, text, text) from public;
grant execute on function public.write_ai_operation_log(uuid, text, text, text, text, text[], text[], text, text, text, boolean, numeric, integer, boolean, uuid, boolean, text, text) to service_role;

comment on function public.write_ai_operation_log is
  'Append-only AI-analyst audit writer (SECURITY DEFINER, the ONLY insert path into ai_operation_log). Carries hashes + slice ids + coverage + the §3c extraction-defense flags (canary, meta_probe) + the #29 refusal_class — never prose, PII, or keys.';
