-- ────────────────────────────────────────────────────────────────────────────
-- 066_security_questions_and_recovery.sql — security-question backend for the
-- Auth Phase 2 redesign (sign-up capture + logged-out password recovery).
--
-- WHAT THIS ADDS (all additive, idempotent, RLS-correct)
--   1. is_allowed_security_question_id(text) — the DB half of the question
--      contract. The stable id set MUST mirror src/data/securityQuestions.js
--      (SECURITY_QUESTIONS[].id); a test pins the two-way match. The DB stores
--      only the id, never the display text.
--   2. public.security_answers — one bcrypt answer hash per (user_id, slot∈{1,2}).
--      RLS ENABLED with NO policies and NO table grants to authenticated, so the
--      answer_hash can NEVER be SELECTed by a client. All access is through the
--      SECURITY DEFINER RPCs below — the same server-write-only intent as the
--      moderation-column locks (061).
--   3. set_my_security_answers(...) — caller hashes + upserts BOTH of their own
--      slots (auth.uid()). Validates the two ids are allowed and distinct.
--   4. get_my_security_question_ids() — caller reads which two questions are set
--      (slot + id only, NEVER the hash) so the account page can show them.
--   5. pick_recovery_question(email) + verify_recovery_answer(email, slot, answer)
--      — the LOGGED-OUT recovery primitives. SECURITY DEFINER, granted ONLY to
--      service_role (the rate-limited edge function calls them with the service
--      key). Never reachable by anon/authenticated. pick_ chooses ONE of the two
--      slots at random; verify_ does a constant-shape crypt() compare.
--   6. consume_recovery_rate_limit(...) — per-IP + per-email fixed-window limiter
--      for the logged-out flow, modeled on 034/035. Fail-closed, service-role only.
--
-- bcrypt: crypt(answer, gen_salt('bf')) to hash, crypt(answer, stored)=stored to
-- verify — the pgcrypto idiom (extension declared in 008). Answers are normalized
-- (trim + lowercase) before hashing so trivial casing/whitespace variants still
-- verify; the raw answer never leaves the server on any path.
--
-- OPERATOR: this migration must be applied (this environment cannot run it) AND
-- email confirmations must be enabled in the hosted Supabase Auth settings (the
-- config.toml flag flipped here only governs `supabase start` locally).
--
-- Re-runnable: create-if-not-exists / create-or-replace / drop-if-exists.
-- Depends on: 008 (pgcrypto), 057 (account_is_active — reused as a courtesy, not
--             a hard gate; recovery must work for a locked-out-but-valid account).
-- ────────────────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

-- ── 1. Allowed-question contract ─────────────────────────────────────────────
-- The stable id set, mirrored from src/data/securityQuestions.js. Keep this in
-- lockstep with that file (tests/security/securityQuestions.test.js enforces the
-- match). Append-only: retiring a question drops it from the JS list but should
-- leave its id here so already-stored answers still verify. An IMMUTABLE function
-- (not a CHECK against a literal array) keeps the allow-list in one place and lets
-- every RPC validate the same way.
create or replace function public.is_allowed_security_question_id(p_id text)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select p_id is not null and p_id in (
    'first_street',
    'childhood_friend',
    'first_pet',
    'first_school',
    'birth_city',
    'first_concert',
    'favorite_teacher',
    'first_car',
    'childhood_nickname',
    'first_employer'
  );
$$;

comment on function public.is_allowed_security_question_id(text) is
  'True when p_id is one of the fixed security-question ids. MUST mirror src/data/securityQuestions.js (SECURITY_QUESTIONS[].id); pinned by a test. The single source of truth the question RPCs validate against.';

-- ── 2. security_answers table ────────────────────────────────────────────────
-- One bcrypt hash per (user_id, slot). question_id is the stable id (never free
-- text). The hash is server-write-only: RLS ON + no policy + no authenticated
-- grant means a client can NEVER select answer_hash. Service_role bypasses RLS
-- for the recovery RPCs; the definer RPCs run as table owner for the caller paths.
create table if not exists public.security_answers (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  slot        smallint    not null check (slot in (1, 2)),
  question_id text        not null,
  answer_hash text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (user_id, slot)
);

alter table public.security_answers enable row level security;
-- NO policies: the table is reachable ONLY via the SECURITY DEFINER RPCs below
-- (caller paths) and service_role (recovery paths). RLS-on + no-policy denies all
-- direct anon/authenticated access — the answer_hash never leaves the server.

-- Belt-and-suspenders: revoke any inherited table privileges from the client
-- roles so even a future broad GRANT cannot accidentally expose answer_hash.
revoke all on table public.security_answers from anon, authenticated;

-- Recovery lookups join from a normalized email; index the path that matters.
create index if not exists security_answers_user_idx
  on public.security_answers (user_id);

-- ── helper: normalize an answer before hashing/compare ───────────────────────
-- Trim + lowercase so "Rover ", "rover", "ROVER" all match. Kept private to the
-- migration's functions (inlined) — a person should not have to remember casing.

-- ── 3. set_my_security_answers — caller writes their OWN two slots ────────────
-- Runs as the caller (auth.uid()). Validates both ids are allowed and DISTINCT,
-- hashes each answer with bcrypt, upserts slots 1 and 2 atomically. The raw
-- answers are consumed here and discarded; only the hash is persisted.
create or replace function public.set_my_security_answers(
  p_q1 text,
  p_a1 text,
  p_q2 text,
  p_a2 text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_a1  text := lower(btrim(coalesce(p_a1, '')));
  v_a2  text := lower(btrim(coalesce(p_a2, '')));
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if not public.is_allowed_security_question_id(p_q1)
     or not public.is_allowed_security_question_id(p_q2) then
    raise exception 'unknown security question id';
  end if;
  if p_q1 = p_q2 then
    raise exception 'the two security questions must be different';
  end if;
  if length(v_a1) < 1 or length(v_a2) < 1 then
    raise exception 'both security answers are required';
  end if;

  insert into public.security_answers (user_id, slot, question_id, answer_hash, updated_at)
  values
    (v_uid, 1, p_q1, crypt(v_a1, gen_salt('bf')), now()),
    (v_uid, 2, p_q2, crypt(v_a2, gen_salt('bf')), now())
  on conflict (user_id, slot) do update
    set question_id = excluded.question_id,
        answer_hash = excluded.answer_hash,
        updated_at  = now();
end;
$$;

revoke all on function public.set_my_security_answers(text, text, text, text) from public;
grant execute on function public.set_my_security_answers(text, text, text, text) to authenticated;

comment on function public.set_my_security_answers(text, text, text, text) is
  'Caller sets their OWN two security answers (auth.uid()). Validates ids are allowed + distinct, bcrypt-hashes each answer, upserts slots 1 and 2. The raw answers never persist; only the hash does.';

-- ── 4. get_my_security_question_ids — caller reads which questions are set ────
-- Returns {slot, question_id} for the caller, NEVER the hash. Lets the account
-- page show which two questions are configured.
create or replace function public.get_my_security_question_ids()
returns table (slot smallint, question_id text)
language sql
security definer
set search_path = public, pg_temp
as $$
  select sa.slot, sa.question_id
  from public.security_answers sa
  where sa.user_id = auth.uid()
  order by sa.slot;
$$;

revoke all on function public.get_my_security_question_ids() from public;
grant execute on function public.get_my_security_question_ids() to authenticated;

comment on function public.get_my_security_question_ids() is
  'Returns the caller''s two {slot, question_id} (NEVER the answer_hash) so the account page can show which security questions are set.';

-- ── 5a. pick_recovery_question — logged-out, service-role ONLY ────────────────
-- Given an email, returns whether an account with security answers exists and, if
-- so, ONE of its two slots chosen at random. Never returns the hash. The edge
-- function (service key) calls this AFTER its rate-limit check. The email→user
-- resolution reads auth.users (RLS-exempt under the definer's owner / service_role).
--
-- The user explicitly chose reveal-as-described: `exists` is honest about whether
-- the email has an account. Enumeration is throttled by the edge function's
-- per-IP + per-email rate limit (consume_recovery_rate_limit below), NOT by hiding
-- existence here.
create or replace function public.pick_recovery_question(p_email text)
returns table (account_exists boolean, slot smallint, question_id text)
language plpgsql
security definer
set search_path = public, pg_temp, auth
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_uid   uuid;
  v_slot  smallint;
  v_qid   text;
begin
  if v_email = '' then
    return query select false, null::smallint, null::text;
    return;
  end if;

  select u.id into v_uid
  from auth.users u
  where lower(u.email) = v_email
  limit 1;

  if v_uid is null then
    return query select false, null::smallint, null::text;
    return;
  end if;

  -- Pick ONE of the configured slots at random. If the account has no security
  -- answers (OAuth-only or pre-feature), report exists=true but no question so the
  -- caller can route to a different recovery path without leaking more.
  select sa.slot, sa.question_id
    into v_slot, v_qid
  from public.security_answers sa
  where sa.user_id = v_uid
  order by random()
  limit 1;

  if v_slot is null then
    return query select true, null::smallint, null::text;
    return;
  end if;

  return query select true, v_slot, v_qid;
end;
$$;

revoke all on function public.pick_recovery_question(text) from public;
revoke all on function public.pick_recovery_question(text) from anon, authenticated;
grant execute on function public.pick_recovery_question(text) to service_role;

comment on function public.pick_recovery_question(text) is
  'LOGGED-OUT recovery, service_role ONLY. Resolves an email to an account and returns {account_exists, one random slot, question_id} (NEVER the hash). Enumeration is throttled by the edge function''s rate limit, not by hiding existence.';

-- ── 5b. verify_recovery_answer — logged-out, service-role ONLY ────────────────
-- Constant-shape bcrypt compare for ONE slot. Returns true only when the account
-- exists, the slot is configured, and crypt(answer, stored)=stored. The edge
-- function calls this after pick_recovery_question + a fresh rate-limit consume,
-- then (on true) sends the reset email.
create or replace function public.verify_recovery_answer(
  p_email text,
  p_slot  smallint,
  p_answer text
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp, auth
as $$
declare
  v_email  text := lower(btrim(coalesce(p_email, '')));
  v_answer text := lower(btrim(coalesce(p_answer, '')));
  v_uid    uuid;
  v_hash   text;
begin
  if v_email = '' or p_slot not in (1, 2) or length(v_answer) < 1 then
    return false;
  end if;

  select u.id into v_uid
  from auth.users u
  where lower(u.email) = v_email
  limit 1;
  if v_uid is null then
    return false;
  end if;

  select sa.answer_hash into v_hash
  from public.security_answers sa
  where sa.user_id = v_uid and sa.slot = p_slot
  limit 1;
  if v_hash is null then
    return false;
  end if;

  return crypt(v_answer, v_hash) = v_hash;
end;
$$;

revoke all on function public.verify_recovery_answer(text, smallint, text) from public;
revoke all on function public.verify_recovery_answer(text, smallint, text) from anon, authenticated;
grant execute on function public.verify_recovery_answer(text, smallint, text) to service_role;

comment on function public.verify_recovery_answer(text, smallint, text) is
  'LOGGED-OUT recovery, service_role ONLY. bcrypt-compares ONE slot''s answer. Returns true only on a configured slot whose hash matches. The hash never leaves the server.';

-- ── 6. Recovery rate limit (per-IP + per-email fixed window) ─────────────────
-- The existing templates don't fit: 034 is keyed (ip, recipient) for the mailer
-- and 035 is per-IP only; the recovery flow needs BOTH an IP and an EMAIL key
-- with recovery-appropriate limits. Same proven shape as 034 — one atomic upsert
-- per scope, row-locked (no TOCTOU), counting EVERY attempt (so blowing the limit
-- keeps you blocked for the window). Fail-closed: the edge function treats a
-- limiter error as "deny" for the enumeration-sensitive recovery path.
--
-- Defaults: 15-minute window, 10 attempts/IP, 5 attempts/email — enough for a real
-- person who fat-fingers an answer, far too few to brute-force a question or to
-- enumerate emails at scale.
create table if not exists public.recovery_rate_limits (
  scope_type   text        not null check (scope_type in ('ip', 'email')),
  scope_key    text        not null,
  window_start timestamptz not null,
  count        integer     not null default 0,
  primary key (scope_type, scope_key, window_start)
);

alter table public.recovery_rate_limits enable row level security;
-- No policies: reached ONLY via the SECURITY DEFINER RPC below (service_role).

create index if not exists recovery_rate_limits_window_start_idx
  on public.recovery_rate_limits (window_start);

create or replace function public.consume_recovery_rate_limit(
  p_ip             text,
  p_email          text,
  p_window_seconds integer default 900,
  p_ip_limit       integer default 10,
  p_email_limit    integer default 5
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window     timestamptz;
  v_ip_key     text;
  v_email_key  text;
  v_ip_count   integer;
  v_email_count integer;
begin
  if p_window_seconds is null or p_window_seconds < 1 then
    p_window_seconds := 900;
  end if;

  v_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  v_ip_key    := coalesce(nullif(btrim(p_ip), ''), '0.0.0.0');
  v_email_key := lower(btrim(coalesce(p_email, '')));

  insert into public.recovery_rate_limits as rrl (scope_type, scope_key, window_start, count)
  values ('ip', v_ip_key, v_window, 1)
  on conflict (scope_type, scope_key, window_start)
    do update set count = rrl.count + 1
  returning rrl.count into v_ip_count;

  insert into public.recovery_rate_limits as rrl (scope_type, scope_key, window_start, count)
  values ('email', v_email_key, v_window, 1)
  on conflict (scope_type, scope_key, window_start)
    do update set count = rrl.count + 1
  returning rrl.count into v_email_count;

  return jsonb_build_object(
    'allowed',        (v_ip_count <= p_ip_limit and v_email_count <= p_email_limit),
    'ip_count',       v_ip_count,
    'email_count',    v_email_count,
    'ip_limit',       p_ip_limit,
    'email_limit',    p_email_limit,
    'window_start',   v_window,
    'window_seconds', p_window_seconds
  );
end;
$$;

revoke all on function public.consume_recovery_rate_limit(text, text, integer, integer, integer) from public;
grant execute on function public.consume_recovery_rate_limit(text, text, integer, integer, integer) to service_role;

comment on function public.consume_recovery_rate_limit(text, text, integer, integer, integer) is
  'Per-IP + per-email fixed-window limiter for the logged-out password-recovery flow. Atomic, row-locked, counts every attempt. Service_role only; the edge function fails CLOSED on error.';

-- ── Stale-row cleanup (mirrors 034/035) ──────────────────────────────────────
create or replace function public.cleanup_recovery_rate_limits(
  p_retention_seconds integer default 86400
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_deleted integer := 0;
begin
  if p_retention_seconds is null or p_retention_seconds < 1 then
    p_retention_seconds := 86400;
  end if;
  delete from public.recovery_rate_limits
    where window_start < now() - make_interval(secs => p_retention_seconds);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.cleanup_recovery_rate_limits(integer) from public;
grant execute on function public.cleanup_recovery_rate_limits(integer) to service_role;

do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception
  when insufficient_privilege then
    raise notice 'pg_cron extension could not be installed; schedule cleanup_recovery_rate_limits manually';
end;
$$;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'cleanup-recovery-rate-limits';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'cleanup-recovery-rate-limits',
    '53 4 * * *',
    $job$select public.cleanup_recovery_rate_limits();$job$
  );
exception
  when undefined_table or invalid_schema_name or insufficient_privilege then
    raise notice 'pg_cron unavailable; schedule cleanup_recovery_rate_limits manually';
end;
$$;
