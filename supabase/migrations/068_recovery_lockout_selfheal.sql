-- ────────────────────────────────────────────────────────────────────────────
-- 068_recovery_lockout_selfheal.sql — make the recovery lockout SELF-HEALING.
--
-- WHY (the bug 067 left open)
--   067 made the lockout CUMULATIVE and NON-EXPIRING: recovery_is_locked returns
--   fail_count >= 10, which is never time-bounded. Once an account crosses 10
--   cumulative wrong answers it is locked FOREVER, cleared only by a correct
--   answer reaching clear_recovery_lockout_by_email — but the edge function gates
--   on recovery_is_locked() and returns { ok:false } BEFORE it ever runs
--   verify_recovery_answer / the clear. So the correct answer can never reach the
--   clear path, and an attacker who knows only an email can pace ~10 wrong answers
--   under the 3/hour cap to PERMANENTLY kill that account's only self-service
--   recovery. That is a denial-of-service, not a brute-force defence.
--
-- WHAT THIS CHANGES (additive, idempotent, RLS-correct, service-role only)
--   The lockout becomes a series of EXPIRING windows with EXPONENTIAL backoff,
--   preserving BOTH invariants:
--     (a) brute-force stays rate-bounded (066/067's concern): each lockout cycle
--         widens the window an attacker must wait through, so sustained guessing is
--         impractically slow — total guesses-over-time stay bounded by the growing
--         windows, not unbounded.
--     (b) a correct answer is ALWAYS eventually acceptable (067's bug fixed): the
--         lock auto-expires at locked_until, so the gate reopens and the correct
--         answer reaches verify + clear. No permanent DoS.
--
--   Mechanism — per-account CYCLES with a per-cycle counter:
--     • cycle_fails counts wrong answers within the current cycle.
--     • When cycle_fails crosses RECOVERY_CYCLE_THRESHOLD (5), we bump `cycle`,
--       set locked_until = now() + backoff(cycle), and RESET cycle_fails to 0 so a
--       fresh cycle starts after the lock expires.
--     • backoff grows with the cycle count: 1 -> 15min, 2 -> 1h, 3 -> 6h,
--       4+ -> 24h (capped). The window widens fast enough that a patient attacker
--       gets only a handful of guesses per ever-longer wait.
--     • recovery_is_locked returns (now() < locked_until) — it AUTO-UNLOCKS at
--       expiry. When unlocked the account can be probed again, but only up to the
--       next threshold before the (now longer) window slams shut again.
--     • A CORRECT answer still wipes the whole row (clear_recovery_lockout*),
--       resetting cycles + counters to zero — a legit mistyper starts clean.
--
--   fail_count is kept as a cumulative lifetime tally for operator audit but is no
--   longer the lock predicate (locked_until is). locked_at remains the first-lock
--   audit stamp.
--
-- SIGNATURES ARE UNCHANGED: recovery_is_locked(text)->boolean,
--   note_recovery_verify_failure(text)->jsonb {locked,fails},
--   clear_recovery_lockout(uuid)->void, clear_recovery_lockout_by_email(text)->void.
--   The edge function needs NO redeploy.
--
-- Re-runnable: "alter table ... add column if not exists" + create-or-replace.
-- Depends on: 066, 067 (the recovery_lockouts table + RPCs this supersedes).
-- OPERATOR: apply this migration via `npx supabase db push` (this environment
--   cannot run it). 067 stays applied; this migration only ADDS columns and
--   REPLACES function bodies.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. additive columns on recovery_lockouts ─────────────────────────────────
-- cycle:        how many lockout windows this account has triggered (drives backoff).
-- cycle_fails:  wrong answers accumulated within the CURRENT cycle (resets per cycle).
-- locked_until: when the current lock expires. null / past => not locked.
alter table public.recovery_lockouts
  add column if not exists cycle        integer     not null default 0;
alter table public.recovery_lockouts
  add column if not exists cycle_fails  integer     not null default 0;
alter table public.recovery_lockouts
  add column if not exists locked_until timestamptz;

-- ── 2. recovery_is_locked — now TIME-BOUNDED (auto-unlocks at expiry) ─────────
-- True only while now() < locked_until. An expired lock returns false, so the
-- correct answer becomes reachable again (no permanent DoS). Unknown email -> no
-- row -> false (not an enumeration oracle; the edge function gates the response
-- identically whether or not a real account is locked).
create or replace function public.recovery_is_locked(p_email text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp, auth
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_uid   uuid;
  v_until timestamptz;
begin
  if v_email = '' then
    return false;
  end if;

  select u.id into v_uid from auth.users u where lower(u.email) = v_email limit 1;
  if v_uid is null then
    return false;
  end if;

  select rl.locked_until into v_until
  from public.recovery_lockouts rl
  where rl.user_id = v_uid
  limit 1;

  -- Locked only while the current backoff window is still in the future. A null or
  -- past locked_until means the window has elapsed and the gate has reopened.
  return v_until is not null and now() < v_until;
end;
$$;

revoke all on function public.recovery_is_locked(text) from public;
revoke all on function public.recovery_is_locked(text) from anon, authenticated;
grant execute on function public.recovery_is_locked(text) to service_role;

comment on function public.recovery_is_locked(text) is
  'LOGGED-OUT recovery, service_role ONLY. True only while now() < locked_until — the lock AUTO-EXPIRES (self-healing, no permanent DoS). Unknown email -> false (not an enumeration oracle; the edge function gates the response identically).';

-- ── 3. note_recovery_verify_failure — per-cycle counter + exponential backoff ─
-- Increments the cumulative tally AND the per-cycle counter. When the per-cycle
-- counter crosses RECOVERY_CYCLE_THRESHOLD it opens a new, longer lockout window
-- (exponential backoff keyed to the cycle count) and resets the per-cycle counter
-- so guessing resumes — slower — only after the window expires. Returns
-- {locked, fails} where `locked` reflects the live time-bounded state and `fails`
-- is the cumulative lifetime tally (kept signature-compatible with 067). Unknown
-- email is a no-op (no row, locked=false).
create or replace function public.note_recovery_verify_failure(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp, auth
as $$
declare
  -- Per-cycle wrong-answer budget before the window slams shut. Smaller than the
  -- old flat cap of 10 because each cycle now COSTS the attacker an escalating wait.
  c_threshold constant integer := 5;
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_uid   uuid;
  v_fails integer;
  v_cycle integer;
  v_cfails integer;
  v_until timestamptz;
begin
  if v_email = '' then
    return jsonb_build_object('locked', false, 'fails', 0);
  end if;

  select u.id into v_uid from auth.users u where lower(u.email) = v_email limit 1;
  if v_uid is null then
    return jsonb_build_object('locked', false, 'fails', 0);
  end if;

  insert into public.recovery_lockouts as rl (user_id, fail_count, cycle_fails, updated_at)
  values (v_uid, 1, 1, now())
  on conflict (user_id) do update
    set fail_count = rl.fail_count + 1,
        cycle_fails = rl.cycle_fails + 1,
        updated_at = now()
  returning rl.fail_count, rl.cycle, rl.cycle_fails, rl.locked_until
    into v_fails, v_cycle, v_cfails, v_until;

  -- Per-cycle budget exhausted -> open a NEW, longer window and start a fresh cycle.
  if v_cfails >= c_threshold then
    v_cycle := v_cycle + 1;
    -- Exponential backoff keyed to the cycle count, capped at 24h.
    v_until := now() + case
      when v_cycle <= 1 then interval '15 minutes'
      when v_cycle = 2 then interval '1 hour'
      when v_cycle = 3 then interval '6 hours'
      else interval '24 hours'
    end;
    update public.recovery_lockouts
      set cycle = v_cycle,
          cycle_fails = 0,          -- reset the per-cycle counter for the next window
          locked_until = v_until,
          locked_at = coalesce(locked_at, now()),
          updated_at = now()
      where user_id = v_uid;
  end if;

  return jsonb_build_object(
    'locked', (v_until is not null and now() < v_until),
    'fails', v_fails
  );
end;
$$;

revoke all on function public.note_recovery_verify_failure(text) from public;
revoke all on function public.note_recovery_verify_failure(text) from anon, authenticated;
grant execute on function public.note_recovery_verify_failure(text) to service_role;

comment on function public.note_recovery_verify_failure(text) is
  'LOGGED-OUT recovery, service_role ONLY. Counts one wrong answer; every 5 per-cycle wrong answers opens a NEW lockout window with EXPONENTIAL backoff (15m/1h/6h/24h) and resets the per-cycle counter. Returns {locked (time-bounded), fails (cumulative)}. Unknown email -> no-op. Self-healing: windows expire, so a correct answer is always eventually reachable.';

-- ── 4. clear_recovery_lockout / _by_email — unchanged contract (full reset) ───
-- A correct answer (or operator unlock) wipes the row, resetting cycles + counters
-- + locked_until to zero. Re-stated here so 068 is self-contained and idempotent.
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
