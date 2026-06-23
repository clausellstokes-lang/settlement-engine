-- ────────────────────────────────────────────────────────────────────────────
-- 067_recovery_verify_lockout.sql — persistent per-account brute-force lockout
-- for the logged-out security-question recovery flow (Auth Phase 2 hardening).
--
-- WHY (the gap 066 left open)
--   066's consume_recovery_rate_limit is a FIXED-WINDOW limiter: every ~15 minutes
--   the per-email budget resets. The verify path's only binding constraint on
--   answer-guessing is that per-email cap, and the per-IP cap is not a real second
--   factor (the IP is derived from client-controllable x-forwarded-for / x-real-ip
--   headers and can be rotated). So an attacker who paces themselves to the window
--   can spend a fresh budget of wrong answers indefinitely — over days, a low-
--   entropy answer (first_pet, first_car, childhood_nickname) is brute-forceable.
--
-- WHAT THIS ADDS (additive, idempotent, RLS-correct, service-role only)
--   1. public.recovery_lockouts — one CUMULATIVE wrong-answer counter per account
--      (user_id), surviving window rollover. RLS ON, no policy, no client grant —
--      reached only via the SECURITY DEFINER RPCs below (service_role).
--   2. recovery_is_locked(email) → boolean — true once an account has crossed the
--      cumulative cap. Cheap pre-check the edge function runs BEFORE picking a
--      question or verifying an answer, so a locked account reveals nothing more
--      and consumes no bcrypt work.
--   3. note_recovery_verify_failure(email) → jsonb {locked, fails} — atomically
--      increments the cumulative counter for the resolved account and reports
--      whether it is now at/over the cap. Called by the edge function on every
--      WRONG verify answer.
--   4. clear_recovery_lockout(user_id) → void — the out-of-band reset. A SUCCESSFUL
--      verify (correct answer → reset email sent) clears the counter so a legit
--      user who fat-fingered a few times before getting it right starts clean.
--      Also the operator's manual unlock hook.
--
-- THRESHOLD: RECOVERY_LOCKOUT_MAX = 10 cumulative wrong answers. With the tightened
-- per-email window cap (3/hour in the edge function) this is several windows of
-- sustained guessing before the account hard-locks until a correct answer or an
-- operator clear — bounding total lifetime guesses to a small constant instead of
-- ~unbounded-over-time. A real person who mistypes is nowhere near 10.
--
-- The lockout is keyed to the ACCOUNT (user_id), not the IP, on purpose: it must
-- survive the spoofable IP key. A missing/unknown email resolves to no row and is
-- never "locked" (we must not turn this into an enumeration oracle — see the edge
-- function, which treats lookups identically locked-or-not).
--
-- Re-runnable: create-if-not-exists / create-or-replace.
-- Depends on: 066 (security_answers, the recovery RPCs this complements).
-- OPERATOR: apply this migration (this environment cannot run it).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. recovery_lockouts table ───────────────────────────────────────────────
-- One row per account that has accumulated wrong recovery answers. fail_count is
-- cumulative across rate-limit windows; locked_at stamps the first time the cap was
-- crossed (for audit / operator triage). Cleared wholesale on a correct answer.
create table if not exists public.recovery_lockouts (
  user_id    uuid        not null primary key references auth.users(id) on delete cascade,
  fail_count integer     not null default 0,
  locked_at  timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.recovery_lockouts enable row level security;
-- No policies + no client grant: reached ONLY via the SECURITY DEFINER RPCs below
-- (service_role). A client can never read another account's failure count.
revoke all on table public.recovery_lockouts from anon, authenticated;

-- ── 2. recovery_is_locked — cheap pre-check (service-role only) ───────────────
-- True when the resolved account has crossed the cumulative cap. An unknown email
-- resolves to no user → false (NOT an enumeration signal: the edge function gates
-- the *response* identically whether or not a real account is locked).
create or replace function public.recovery_is_locked(p_email text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp, auth
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_uid   uuid;
  v_fails integer;
begin
  if v_email = '' then
    return false;
  end if;

  select u.id into v_uid from auth.users u where lower(u.email) = v_email limit 1;
  if v_uid is null then
    return false;
  end if;

  select rl.fail_count into v_fails
  from public.recovery_lockouts rl
  where rl.user_id = v_uid
  limit 1;

  -- 10 cumulative wrong answers hard-locks recovery until a correct answer or an
  -- operator clear. Kept in lockstep with the edge function's documented policy.
  return coalesce(v_fails, 0) >= 10;
end;
$$;

revoke all on function public.recovery_is_locked(text) from public;
revoke all on function public.recovery_is_locked(text) from anon, authenticated;
grant execute on function public.recovery_is_locked(text) to service_role;

comment on function public.recovery_is_locked(text) is
  'LOGGED-OUT recovery, service_role ONLY. True once an account has accumulated >=10 cumulative wrong security answers (survives rate-limit window rollover). Unknown email -> false (not an enumeration oracle; the edge function gates the response identically).';

-- ── 3. note_recovery_verify_failure — count one wrong answer (service-role) ───
-- Atomically increments the resolved account's cumulative failure counter and
-- reports whether it is now at/over the cap. Called on EVERY wrong verify answer,
-- so the budget cannot be reset by waiting out the rate-limit window. An unknown
-- email is a no-op (no row, locked=false) — wrong-but-nonexistent guesses must not
-- create lockout rows the operator would have to reason about.
create or replace function public.note_recovery_verify_failure(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp, auth
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_uid   uuid;
  v_fails integer;
begin
  if v_email = '' then
    return jsonb_build_object('locked', false, 'fails', 0);
  end if;

  select u.id into v_uid from auth.users u where lower(u.email) = v_email limit 1;
  if v_uid is null then
    return jsonb_build_object('locked', false, 'fails', 0);
  end if;

  insert into public.recovery_lockouts as rl (user_id, fail_count, updated_at)
  values (v_uid, 1, now())
  on conflict (user_id) do update
    set fail_count = rl.fail_count + 1,
        updated_at = now()
  returning rl.fail_count into v_fails;

  -- Stamp locked_at the first time the cap is crossed (idempotent: only set once).
  if v_fails >= 10 then
    update public.recovery_lockouts
      set locked_at = coalesce(locked_at, now())
      where user_id = v_uid;
  end if;

  return jsonb_build_object('locked', (v_fails >= 10), 'fails', v_fails);
end;
$$;

revoke all on function public.note_recovery_verify_failure(text) from public;
revoke all on function public.note_recovery_verify_failure(text) from anon, authenticated;
grant execute on function public.note_recovery_verify_failure(text) to service_role;

comment on function public.note_recovery_verify_failure(text) is
  'LOGGED-OUT recovery, service_role ONLY. Atomically increments an account''s CUMULATIVE wrong-answer counter (survives rate-limit windows) and returns {locked, fails}. Unknown email -> no-op. Called on every wrong verify answer to bound lifetime guesses to a constant.';

-- ── 4. clear_recovery_lockout — out-of-band reset (service-role) ──────────────
-- Wipes the cumulative counter for an account. Called by the edge function on a
-- CORRECT answer (a legit user who mistyped a few times then succeeded starts
-- clean) and is the operator's manual unlock. Keyed by user_id (the edge function
-- already holds it from a successful verify path) so it is unambiguous.
create or replace function public.clear_recovery_lockout(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_user_id is null then
    return;
  end if;
  delete from public.recovery_lockouts where user_id = p_user_id;
end;
$$;

revoke all on function public.clear_recovery_lockout(uuid) from public;
revoke all on function public.clear_recovery_lockout(uuid) from anon, authenticated;
grant execute on function public.clear_recovery_lockout(uuid) to service_role;

comment on function public.clear_recovery_lockout(uuid) is
  'LOGGED-OUT recovery, service_role ONLY. Clears an account''s cumulative wrong-answer lockout counter. Called on a correct answer (reset legit mistypers) and is the operator''s manual unlock.';

-- ── 5. clear_recovery_lockout_by_email — convenience for the edge function ────
-- The verify edge path resolves correctness via verify_recovery_answer (which
-- matches on email), so the function has the email but not the user_id. This
-- resolves email -> user_id internally so the success path is a single call and
-- never needs to SELECT auth.users from the function itself.
create or replace function public.clear_recovery_lockout_by_email(p_email text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp, auth
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_uid   uuid;
begin
  if v_email = '' then
    return;
  end if;
  select u.id into v_uid from auth.users u where lower(u.email) = v_email limit 1;
  if v_uid is null then
    return;
  end if;
  delete from public.recovery_lockouts where user_id = v_uid;
end;
$$;

revoke all on function public.clear_recovery_lockout_by_email(text) from public;
revoke all on function public.clear_recovery_lockout_by_email(text) from anon, authenticated;
grant execute on function public.clear_recovery_lockout_by_email(text) to service_role;

comment on function public.clear_recovery_lockout_by_email(text) is
  'LOGGED-OUT recovery, service_role ONLY. Resolves an email to its account and clears that account''s recovery lockout counter. The edge function calls this on a correct answer (it holds the email, not the user_id).';
