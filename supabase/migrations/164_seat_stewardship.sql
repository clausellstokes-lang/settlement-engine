-- ────────────────────────────────────────────────────────────────────────────
-- 164_seat_stewardship.sql — THE STEWARDSHIP LIMB (DESIGN_MONEY_WAVE §6.8, slice
-- M-10). The lifetime promise stays whole; reclamation is voluntary-first (the
-- standing buyback), abandonment-last (5y + 90d notices → escheat). All action RPCs
-- for the buyback + stewardship sweeps live here — after every dependency:
--   137 (founder_seats + founder_seat_buybacks + buyback challenges + stamps),
--   157 (money_events kind seat_buyback / refund_note),
--   160 (has_active_transfer_lock, founder_buyback_enabled, _seat_buyback_cents,
--        _seat_stewardship_dial), 161 (current_account_session — the last-sign-in read),
--   163 (system_grant_credits seat_payout arm — the buyback credits election).
--
-- OWNER RULING 2026-07-19 — the seat_buyback_cents dial: the buyback repurchase price
--   AND the abandonment claimable credit are ONE shared config figure (default $25),
--   READ AT CLAIM TIME via _seat_buyback_cents() — never hand-typed. The TRANSFER
--   payout is untouched (price_cents/2 = $49.50, the ratified even split).
--
-- ⚠ NUMBERING: 164 is the next contiguous number on the money-wave branch (163 forward-
--   references claim_due_buyback_payout @ 164). The RPC NAMES are the interface; the
--   fold renumbers ALL lanes contiguously. The doc/contract cluster (migrationContiguity,
--   migrationSequenceAll, docCounts, architectureFreshness, deployRunbookFreshness) is
--   fold-owned on this branch.
--
-- SECURITY: every function is SERVICE-ROLE, definer, search_path-pinned. The buyback
--   seat release is claim-once (holder=null WHERE holder_user_id=p_user; a redelivery
--   no-ops). The payout claim is atomic (FOR UPDATE SKIP LOCKED + idempotencyKey
--   buyback-<id> makes double-payout impossible). Escheat seats are NEVER auto-resold
--   (claim_next_founder_seat excludes security_status<>'normal', 137).
-- @rollback: drop function if exists public.sweep_seat_abandonment();
--   drop function if exists public.sweep_seat_dormancy_nudges();
--   drop function if exists public.claim_due_buyback_payout();
--   drop function if exists public.claim_founder_seat_buyback(uuid, text);
--   drop function if exists public.verify_buyback_challenge(uuid, text);
--   drop function if exists public.issue_buyback_challenge(uuid);
--   drop function if exists public._seat_holder_last_active(uuid);
-- ────────────────────────────────────────────────────────────────────────────

-- ── 0. _seat_holder_last_active — the last-sign-in read (§6.8) ───────────────────
-- current_account_session.updated_at (161, the true last sign-in) with a
-- profiles.updated_at FALLBACK for pre-M9 sessions. NULL only when BOTH are absent —
-- and the sweeps NEVER act on a NULL (never nudge/escheat on absent data).
create or replace function public._seat_holder_last_active(p_user uuid)
returns timestamptz
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(
    (select updated_at from public.current_account_session where user_id = p_user),
    (select updated_at from public.profiles where id = p_user));
$$;
revoke all on function public._seat_holder_last_active(uuid) from public;
grant execute on function public._seat_holder_last_active(uuid) to service_role;

-- ── 1. issue/verify_buyback_challenge — the caseless emailed 2FA code (§6.8) ─────
-- The 6.2 idiom (bcrypt hash, 10-min TTL, 5-attempt cap) keyed by USER (no case). The
-- lockout is per-row attempts (a 5th wrong attempt consumes the code → re-issue needed).
create or replace function public.issue_buyback_challenge(p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_code text; v_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'issue_buyback_challenge is service-role only (got: %)', caller_role;
  end if;
  if p_user is null then return jsonb_build_object('ok', false, 'reason', 'bad_args'); end if;
  -- Retire any prior unconsumed code for this user.
  update public.founder_seat_buyback_challenges set consumed_at = now()
    where user_id = p_user and consumed_at is null;
  v_code := lpad((floor(random() * 1000000))::int::text, 6, '0');
  insert into public.founder_seat_buyback_challenges (user_id, code_hash, expires_at)
    values (p_user, crypt(v_code, gen_salt('bf')), now() + interval '10 minutes')
    returning id into v_id;
  return jsonb_build_object('ok', true, 'challenge_id', v_id, 'code', v_code);
end;
$$;
revoke all on function public.issue_buyback_challenge(uuid) from public;
grant execute on function public.issue_buyback_challenge(uuid) to service_role;

create or replace function public.verify_buyback_challenge(p_user uuid, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_ch public.founder_seat_buyback_challenges%rowtype; v_attempts int;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'verify_buyback_challenge is service-role only (got: %)', caller_role;
  end if;
  select * into v_ch from public.founder_seat_buyback_challenges
    where user_id = p_user and consumed_at is null and expires_at > now()
    order by created_at desc limit 1;
  if not found then return jsonb_build_object('ok', false, 'reason', 'no_live_code'); end if;

  if crypt(coalesce(p_code, ''), v_ch.code_hash) = v_ch.code_hash then
    update public.founder_seat_buyback_challenges set consumed_at = now() where id = v_ch.id;
    return jsonb_build_object('ok', true);
  end if;

  update public.founder_seat_buyback_challenges set attempts = attempts + 1
    where id = v_ch.id returning attempts into v_attempts;
  if v_attempts >= 5 then
    update public.founder_seat_buyback_challenges set consumed_at = now() where id = v_ch.id;
    return jsonb_build_object('ok', false, 'reason', 'locked');
  end if;
  return jsonb_build_object('ok', false, 'reason', 'bad_code', 'attempts', v_attempts);
end;
$$;
revoke all on function public.verify_buyback_challenge(uuid, text) from public;
grant execute on function public.verify_buyback_challenge(uuid, text) to service_role;

-- ── 2. claim_founder_seat_buyback — the seat release (§6.8) ──────────────────────
-- Refused while a LIVE transfer case exists or the seat is not 'normal'. Claim-once
-- seat release (holder cleared → the seat returns to the unclaimed pool, cap intact,
-- resellable at $99) + lineage 'buyback' row + is_founder=false (the 6.5 subscribed-
-- ex-founder TIER logic is the edge leg, mirroring finalize). Records a
-- founder_seat_buybacks row at the seat_buyback_cents dial amount (read HERE, at claim
-- time). The payout rides the due-runner (claim_due_buyback_payout → performPayout).
create or replace function public.claim_founder_seat_buyback(p_user uuid, p_payout_form text default 'connect_cash')
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_seat smallint; v_from_name text; v_amount int; v_form text; v_bid uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'claim_founder_seat_buyback is service-role only (got: %)', caller_role;
  end if;
  if p_user is null then raise exception 'a user is required'; end if;
  v_form := case when p_payout_form = 'account_credits' then 'account_credits' else 'connect_cash' end;

  -- Refuse during a live transfer case (§6.8).
  if public.has_active_transfer_lock(p_user) then
    return jsonb_build_object('ok', false, 'reason', 'live_case');
  end if;

  -- The caller must hold a seat whose security posture is 'normal'.
  select seat_id,
         case when display_name_status = 'approved'
              then nullif(btrim(coalesce(display_name_optin, '')), '') end
    into v_seat, v_from_name
    from public.founder_seats
   where holder_user_id = p_user and security_status = 'normal';
  if v_seat is null then return jsonb_build_object('ok', false, 'reason', 'no_seat'); end if;

  v_amount := public._seat_buyback_cents();   -- dial read AT CLAIM TIME (never inlined)

  -- Claim-once release: clear the holder + reset to a fresh unclaimed 'normal' seat.
  update public.founder_seats
     set holder_user_id = null, display_name_optin = null, display_name_status = 'pending',
         gallery_author_slug = null, held_since = null, claimed_at = null,
         original_purchase_at = null, acquired_via = 'purchase', transfer_eligible_at = null,
         last_transfer_at = null, cooldown_until = null, security_status = 'normal',
         last_dormancy_nudge_at = null, abandonment_notice_started_at = null,
         abandonment_notice_count = 0, updated_at = now()
   where seat_id = v_seat and holder_user_id = p_user;
  if not found then return jsonb_build_object('ok', false, 'reason', 'lost_claim'); end if;

  insert into public.founder_seat_transfers (seat_id, from_holder, to_holder, from_display_name, note)
    values (v_seat, p_user, null, v_from_name, 'buyback');
  update public.profiles set is_founder = false, updated_at = now() where id = p_user;
  insert into public.founder_seat_buybacks (seat_id, user_id, amount_cents, payout_form, state)
    values (v_seat, p_user, v_amount, v_form, 'pending_payout')
    returning id into v_bid;

  return jsonb_build_object('ok', true, 'buyback_id', v_bid, 'seat_id', v_seat,
    'amount_cents', v_amount, 'payout_form', v_form);
end;
$$;
revoke all on function public.claim_founder_seat_buyback(uuid, text) from public;
grant execute on function public.claim_founder_seat_buyback(uuid, text) to service_role;

-- ── 3. claim_due_buyback_payout — the atomic release claim (§6.8) ────────────────
-- Mirror of claim_due_transfer_payout for buybacks (no payout floor — the 12-month hold
-- means the original $99 dispute window has closed, LAW 8). Claims ONE pending_payout
-- (or stale-releasing) buyback to 'releasing'; the due-runner then performs the payout
-- (performPayout, idempotencyKey buyback-<id>) and maps the outcome to state.
create or replace function public.claim_due_buyback_payout()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_bb public.founder_seat_buybacks%rowtype;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'claim_due_buyback_payout is service-role only (got: %)', caller_role;
  end if;
  update public.founder_seat_buybacks
    set state = 'releasing', updated_at = now()
    where id = (
      select id from public.founder_seat_buybacks
      where state = 'pending_payout'
         or (state = 'releasing' and updated_at < now() - interval '10 minutes')
      order by created_at
      limit 1
      for update skip locked
    )
    returning * into v_bb;
  if not found then return jsonb_build_object('ok', false, 'reason', 'none_due'); end if;
  return jsonb_build_object('ok', true, 'buyback_id', v_bb.id, 'from_user', v_bb.user_id,
    'payout_form', v_bb.payout_form, 'payout_amount_cents', v_bb.amount_cents,
    'connect_account_id', v_bb.connect_account_id);
end;
$$;
revoke all on function public.claim_due_buyback_payout() from public;
grant execute on function public.claim_due_buyback_payout() to service_role;

-- ── 4. sweep_seat_dormancy_nudges — the 18-month voluntary-exit nudge (§6.8) ─────
-- Seats whose holder's last sign-in is older than the dormancy threshold, nudged at
-- most once per re-nudge window. NEVER nudges on absent data (_seat_holder_last_active
-- NULL is skipped). Stamps last_dormancy_nudge_at atomically and RETURNS the nudged
-- (seat, holder) pairs so the edge can email each (seam-inert until Wave E).
create or replace function public.sweep_seat_dormancy_nudges()
returns table(seat_id smallint, user_id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_nudge int; v_renudge int; r record;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'sweep_seat_dormancy_nudges is service-role only (got: %)', caller_role;
  end if;
  v_nudge := public._seat_stewardship_dial('dormancy_nudge_months', 18);
  v_renudge := public._seat_stewardship_dial('dormancy_renudge_months', 12);
  for r in
    update public.founder_seats fs
      set last_dormancy_nudge_at = now(), updated_at = now()
      where fs.holder_user_id is not null
        and fs.security_status = 'normal'
        and public._seat_holder_last_active(fs.holder_user_id) is not null
        and public._seat_holder_last_active(fs.holder_user_id) < now() - make_interval(months => v_nudge)
        and (fs.last_dormancy_nudge_at is null
             or fs.last_dormancy_nudge_at < now() - make_interval(months => v_renudge))
      returning fs.seat_id, fs.holder_user_id
  loop
    seat_id := r.seat_id; user_id := r.holder_user_id; return next;
  end loop;
  return;
end;
$$;
revoke all on function public.sweep_seat_dormancy_nudges() from public;
grant execute on function public.sweep_seat_dormancy_nudges() to service_role;

-- ── 5. sweep_seat_abandonment — the promise-preserving reclamation of last resort ─
-- The state machine (§6.8), executed in ONE pass, returning an action per affected seat
-- so the edge can email notices/confirmations (seam-inert):
--   B) CLEAR  — any noticed seat whose holder became active AFTER the stamp (ANY sign-in
--               aborts). Returns action 'cleared'.
--   C) ESCHEAT — a noticed seat past the notice window (still no post-notice activity, by
--               construction after B): security_status→'escheat', holder cleared, lineage
--               'abandonment' row, money_events 'refund_note' {claimable_cents=dial}.
--               Exactly ONCE (an escheat seat is no longer 'normal'). Returns 'escheated'.
--   A) START  — a newly-past-threshold dormant holder: stamp the notice window (count=1).
--               Returns 'notice'.
--   A2) REMIND — pace up to notice_count notices across the window. Returns 'notice'.
-- NEVER acts on absent last-sign-in data.
create or replace function public.sweep_seat_abandonment()
returns table(action text, seat_id smallint, user_id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text; v_years int; v_window int; v_count int; v_cents int; r record;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'sweep_seat_abandonment is service-role only (got: %)', caller_role;
  end if;
  v_years := public._seat_stewardship_dial('abandonment_dormant_years', 5);
  v_window := public._seat_stewardship_dial('abandonment_notice_window_days', 90);
  v_count := greatest(1, public._seat_stewardship_dial('abandonment_notice_count', 3));
  v_cents := public._seat_buyback_cents();

  -- B) CLEAR on ANY sign-in after the notice started.
  for r in
    update public.founder_seats fs
      set abandonment_notice_started_at = null, abandonment_notice_count = 0, updated_at = now()
      where fs.abandonment_notice_started_at is not null
        and fs.holder_user_id is not null
        and public._seat_holder_last_active(fs.holder_user_id) is not null
        and public._seat_holder_last_active(fs.holder_user_id) > fs.abandonment_notice_started_at
      returning fs.seat_id, fs.holder_user_id
  loop
    action := 'cleared'; seat_id := r.seat_id; user_id := r.holder_user_id; return next;
  end loop;

  -- C) ESCHEAT — window elapsed, no post-notice activity (B already cleared active ones).
  for r in
    select fs.seat_id, fs.holder_user_id,
           case when fs.display_name_status = 'approved'
                then nullif(btrim(coalesce(fs.display_name_optin, '')), '') end as from_name
      from public.founder_seats fs
     where fs.security_status = 'normal'
       and fs.holder_user_id is not null
       and fs.abandonment_notice_started_at is not null
       and fs.abandonment_notice_started_at < now() - make_interval(days => v_window)
  loop
    insert into public.founder_seat_transfers (seat_id, from_holder, to_holder, from_display_name, note)
      values (r.seat_id, r.holder_user_id, null, r.from_name, 'abandonment');
    insert into public.money_events
      (event_key, user_id, occurred_at, kind, amount_cents, currency, description, status, metadata)
      values ('escheat:' || r.seat_id || ':' || to_char(now(), 'YYYYMMDD'), r.holder_user_id, now(),
              'refund_note', v_cents, 'usd', 'Founder seat abandonment — claimable credit held', 'paid',
              jsonb_build_object('claimable_cents', v_cents, 'seat_id', r.seat_id))
      on conflict (event_key) do nothing;
    update public.founder_seats fs
       set holder_user_id = null, security_status = 'escheat',
           display_name_optin = null, display_name_status = 'pending', gallery_author_slug = null,
           held_since = null, claimed_at = null, original_purchase_at = null, acquired_via = 'purchase',
           transfer_eligible_at = null, last_transfer_at = null, cooldown_until = null,
           abandonment_notice_started_at = null, abandonment_notice_count = 0, updated_at = now()
     where fs.seat_id = r.seat_id;
    update public.profiles set is_founder = false, updated_at = now() where id = r.holder_user_id;
    action := 'escheated'; seat_id := r.seat_id; user_id := r.holder_user_id; return next;
  end loop;

  -- A) START a notice for a newly-past-threshold dormant holder.
  for r in
    update public.founder_seats fs
      set abandonment_notice_started_at = now(), abandonment_notice_count = 1, updated_at = now()
      where fs.security_status = 'normal'
        and fs.holder_user_id is not null
        and fs.abandonment_notice_started_at is null
        and public._seat_holder_last_active(fs.holder_user_id) is not null
        and public._seat_holder_last_active(fs.holder_user_id) < now() - make_interval(years => v_years)
      returning fs.seat_id, fs.holder_user_id
  loop
    action := 'notice'; seat_id := r.seat_id; user_id := r.holder_user_id; return next;
  end loop;

  -- A2) REMINDER — pace additional notices across the window (up to notice_count).
  for r in
    update public.founder_seats fs
      set abandonment_notice_count = fs.abandonment_notice_count + 1, updated_at = now()
      where fs.abandonment_notice_started_at is not null
        and fs.security_status = 'normal'
        and fs.abandonment_notice_count < v_count
        and now() >= fs.abandonment_notice_started_at
                     + make_interval(days => (fs.abandonment_notice_count * v_window) / v_count)
      returning fs.seat_id, fs.holder_user_id
  loop
    action := 'notice'; seat_id := r.seat_id; user_id := r.holder_user_id; return next;
  end loop;
  return;
end;
$$;
revoke all on function public.sweep_seat_abandonment() from public;
grant execute on function public.sweep_seat_abandonment() to service_role;
