-- ────────────────────────────────────────────────────────────────────────────
-- 160_founder_transfer_cases.sql — THE CASE MACHINE (DESIGN_MONEY_WAVE §6.2, #17,
-- slice M-5b). The founder-seat transfer choreography's durable state: cases,
-- their complete audit log, and the emailed 2FA challenge codes — plus the
-- claim-once state-transition RPCs, the party-facing projection, the recovery
-- lockout read, the master switch, and the due-runner cron config seed.
--
-- ⚠ NUMBERING: 160 per manager coordination (this wave takes 157-161; the
--   perimeter/Wave-E siblings hold 156; renumber contiguously at fold — no number
--   is hardcoded in code). See 157_money_events.sql's header for the full note.
--
-- SECURITY POSTURE (§0 LAW 3 + §6.2)
--   ALL THREE tables are RLS-ON with ZERO policies (the 122 idiom): no anon /
--   authenticated read or write path exists — service_role bypasses RLS for the
--   RPCs, and the ONLY party-facing read is the definer projection
--   my_transfer_case_status() (caller's own case, safe fields only, never a
--   holder user id, never the other party's email except to the party that
--   already knows it). Every state-transition RPC is SERVICE-ROLE, claim-once
--   (atomic UPDATE ... WHERE state='<expected>' RETURNING), and appends a
--   founder_transfer_events row in the SAME transaction. All definer functions
--   pin search_path = public, pg_temp (094/131). auth.users is read FULLY
--   QUALIFIED so no auth schema is needed on the search_path.
--
-- KEY-INERT (§0 LAW 1): the whole flow gates on the system_config 'founder_transfers'
--   master switch, seeded {enabled:false}. Disabled → the edge returns
--   feature_unavailable and the UI shows the "coming under the published terms"
--   line. No transition RPC lights from a deploy alone.
--
-- 12-MONTH-HOLD CHARGEBACK INVARIANT (§0 LAW 8): a seat is transfer-eligible only
--   12 months after original purchase (transfer_eligible_at, stamped by 137's
--   claim), by which time the original $99 can no longer be charged back. The
--   only surviving reversal race is the goodwill refund, serialized in §6.7.
--
-- pgcrypto (crypt / gen_salt for the challenge hashes) comes from 008/066 — not
--   re-declared here. The function BODIES are stored at apply time; crypt runs
--   only when a challenge RPC is CALLED (pglite tests shim it — the migration
--   applies without the extension).
--
-- Depends on: 001 (auth.users), 002 (system_config), 137 (founder_seats +
--   founder_seat_transfers + release/claim primitives), 009 (profiles). Re-runnable.
-- @rollback: drop function if exists public.my_transfer_case_status();
--   drop function if exists public.transfer_case_open(smallint, uuid, text, text);
--   drop function if exists public.transfer_case_bind_nominee(uuid, uuid);
--   drop function if exists public.transfer_case_mark_awaiting_payment(uuid, text);
--   drop function if exists public.transfer_case_mark_paid(uuid, text, integer);
--   drop function if exists public.transfer_case_regress_awaiting_payment(text);
--   drop function if exists public.transfer_case_abort(uuid, text, text);
--   drop function if exists public.transfer_case_finalize(uuid);
--   drop function if exists public.transfer_case_reverse(uuid, text);
--   drop function if exists public.expire_stale_transfer_cases();
--   drop function if exists public.has_active_transfer_lock(uuid);
--   drop function if exists public.email_has_active_transfer_lock(text);
--   drop function if exists public.issue_transfer_challenge(uuid, text, text);
--   drop function if exists public.verify_transfer_challenge(uuid, text, text, text);
--   drop function if exists public.founder_transfer_enabled();
--   drop function if exists public._log_founder_transfer_event(uuid, text, text, jsonb);
--   drop table if exists public.founder_transfer_challenges;
--   drop table if exists public.founder_transfer_events;
--   drop table if exists public.founder_transfer_cases;
--   delete from public.system_config where key in ('founder_transfers','founder_transfer_cron');
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. founder_transfer_cases — one row per transfer attempt ────────────────────
create table if not exists public.founder_transfer_cases (
  id uuid primary key default gen_random_uuid(),
  seat_id smallint not null references public.founder_seats(seat_id),
  from_user uuid not null references auth.users(id),
  to_email_lower text not null,
  to_user uuid references auth.users(id),        -- bound at nominee verification
  state text not null default 'initiated' check (state in
    ('initiated','nominee_verified','awaiting_payment','cooling',
     'finalized','aborted','expired','reversed')),
  -- Payout election (§6.6): the outgoing holder picks the payout form at initiate.
  payout_form text not null default 'connect_cash'
    check (payout_form in ('connect_cash','account_credits')),
  initiated_at timestamptz not null default now(),
  nominee_verified_at timestamptz, accepted_at timestamptz, paid_at timestamptz,
  stripe_session_id text unique, price_cents integer,     -- audit snapshot of $99
  cooling_ends_at timestamptz, finalized_at timestamptz,
  aborted_at timestamptz, abort_actor text
    check (abort_actor in ('outgoing','incoming','system_anomaly','admin','chargeback')),
  abort_reason text,
  payout_status text not null default 'none' check (payout_status in
    ('none','scheduled','releasing','released','held','failed')),
  payout_due_at timestamptz, payout_amount_cents integer,  -- price_cents / 2
  stripe_transfer_id text unique, connect_account_id text,
  updated_at timestamptz not null default now()
);
alter table public.founder_transfer_cases enable row level security;
comment on table public.founder_transfer_cases is
  'Founder seat transfer cases (160, §6.2). RLS-ON zero-policy (service-role only); party reads go through my_transfer_case_status(). State transitions are claim-once via the service-role RPCs; each appends a founder_transfer_events row in the same transaction.';

-- One LIVE case per seat, per from_user, and per to_user (the three partial uniques
-- that make a double-initiate / double-nominate structurally impossible).
create unique index if not exists uidx_transfer_live_per_seat
  on public.founder_transfer_cases(seat_id)
  where state in ('initiated','nominee_verified','awaiting_payment','cooling');
create unique index if not exists uidx_transfer_live_per_from
  on public.founder_transfer_cases(from_user)
  where state in ('initiated','nominee_verified','awaiting_payment','cooling');
create unique index if not exists uidx_transfer_live_per_to
  on public.founder_transfer_cases(to_user)
  where state in ('initiated','nominee_verified','awaiting_payment','cooling');

-- ── 2. founder_transfer_events — the complete append-only audit log ─────────────
create table if not exists public.founder_transfer_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.founder_transfer_cases(id),
  at timestamptz not null default now(),
  actor text not null check (actor in ('outgoing','incoming','system','webhook','admin')),
  event text not null, detail jsonb not null default '{}'::jsonb
);
alter table public.founder_transfer_events enable row level security;
comment on table public.founder_transfer_events is
  'Append-only audit log for founder transfer cases (160). RLS-ON zero-policy — reachable only via the service-role RPCs (which append in the same transaction as each state change).';
create index if not exists idx_transfer_events_case on public.founder_transfer_events(case_id, at);

-- ── 3. founder_transfer_challenges — emailed 2FA codes, hashed at rest ──────────
create table if not exists public.founder_transfer_challenges (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.founder_transfer_cases(id),
  party text not null check (party in ('outgoing','incoming')),
  purpose text not null check (purpose in ('initiate','nominee_verify','abort')),
  code_hash text not null,                    -- crypt(code, gen_salt('bf')), 066 idiom
  expires_at timestamptz not null,            -- now() + 10 min
  attempts int not null default 0, consumed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.founder_transfer_challenges enable row level security;
comment on table public.founder_transfer_challenges is
  'Emailed 2FA challenge codes for founder transfers (160, §6.3). Hashed at rest (bcrypt), 10-min TTL, 5-attempt cap. RLS-ON zero-policy — issued/verified only via the service-role RPCs.';
create index if not exists idx_transfer_challenges_case on public.founder_transfer_challenges(case_id, party, purpose, created_at desc);

-- ── 4. Config seeds (§6.3 master switch + §6.6 due-runner cron, 115 idiom) ──────
-- Master switch: DISABLED by construction (LAW 1). Dials ride the same row.
insert into public.system_config (key, value)
values ('founder_transfers', jsonb_build_object(
  'enabled', false,          -- the HARD gate; owner flips true after LEGAL SIGN-OFF
  'cooling_hours', 72,       -- §6.3 cooling window
  'payout_floor_days', 14,   -- §6.5 the 14-30 payout window's floor (owner dial to 30)
  'expiry_days', 14,         -- §6.3 stale-case expiry
  'note', 'Founder seat transfers master switch + dials. enabled=false until Connect/legal sign-off (runbook §11 step 6). connect_cash payouts also require Connect keys.'
)) on conflict (key) do nothing;

-- Due-runner cron (the 115 pattern): INERT until the operator sets url+secret.
insert into public.system_config (key, value)
values ('founder_transfer_cron', jsonb_build_object(
  'enabled', true, 'url', null, 'secret', null, 'lastDispatchedAt', null,
  'note', 'Founder transfer due-runner (finalize/expiry/payout/auto-reload-cancel sweeps). url+secret null ⇒ inert; set them (runbook §11 step 7) to arm the hourly sweep.'
)) on conflict (key) do nothing;

-- ── 4b. Stewardship config (§6.8, M-10) ─────────────────────────────────────────
-- Master switch for the STANDING BUYBACK: DISABLED by construction (LAW 1) — the owner
-- flips it true to light the buyback affordance + edge action.
insert into public.system_config (key, value)
values ('founder_buyback', jsonb_build_object(
  'enabled', false,
  'note', 'Founder standing-buyback master switch. enabled=false until the owner lights it (dark by default; the account affordance renders the coming-soon line while off).'
)) on conflict (key) do nothing;

-- THE SEAT-BUYBACK PRICE DIAL (owner ruling 2026-07-19): ONE shared cents figure read at
-- claim time by BOTH the standing buyback AND the abandonment claimable credit — never
-- hand-typed into any RPC/edge body. Default $25 (2500¢). The TRANSFER payout is NOT
-- routed through this dial — it stays price_cents/2 = $49.50 (the ratified even split).
insert into public.system_config (key, value)
values ('seat_buyback_cents', jsonb_build_object(
  'cents', 2500,
  'note', 'Standing-buyback repurchase price + abandonment claimable credit, in cents (default $25). Read at claim time. Transfer payouts are price_cents/2 and DO NOT use this dial.'
)) on conflict (key) do nothing;

-- Stewardship thresholds (§6.8): dormancy nudge cadence + abandonment notice window.
insert into public.system_config (key, value)
values ('seat_stewardship', jsonb_build_object(
  'dormancy_nudge_months', 18,       -- nudge a holder dormant this long
  'dormancy_renudge_months', 12,     -- at most once per this many months
  'abandonment_dormant_years', 5,    -- start the escheat notice sequence past this
  'abandonment_notice_window_days', 90,
  'abandonment_notice_count', 3,
  'note', 'Stewardship sweep thresholds (§6.8). The abandonment sweep fires for no one before ~2031; it exists under build-completeness.'
)) on conflict (key) do nothing;

-- ── 5. founder_transfer_enabled() — the master-switch read (surveyor_stage idiom) ─
-- FAIL-CLOSED here (opposite of the launch-whole surveyor switch): an absent row or
-- a non-true flag ⇒ DISABLED. A money surface stays dark unless explicitly enabled.
create or replace function public.founder_transfer_enabled()
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v_flag jsonb;
begin
  select value->'enabled' into v_flag from public.system_config where key = 'founder_transfers';
  return v_flag is not null and jsonb_typeof(v_flag) = 'boolean' and (v_flag)::boolean;
end;
$$;
revoke all on function public.founder_transfer_enabled() from public;
grant execute on function public.founder_transfer_enabled() to authenticated, service_role;

-- Internal dial reader (returns an int dial from the 'founder_transfers' row, or a default).
create or replace function public._founder_transfer_dial(p_key text, p_default int)
returns int
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(
    (select (value->>p_key)::int from public.system_config where key = 'founder_transfers'),
    p_default);
$$;
revoke all on function public._founder_transfer_dial(text, int) from public;
grant execute on function public._founder_transfer_dial(text, int) to service_role;

-- ── 5b. founder_buyback_enabled() + the buyback/stewardship dials (§6.8, M-10) ───
-- Master-switch read for the standing buyback (FAIL-CLOSED like the transfer switch).
create or replace function public.founder_buyback_enabled()
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v_flag jsonb;
begin
  select value->'enabled' into v_flag from public.system_config where key = 'founder_buyback';
  return v_flag is not null and jsonb_typeof(v_flag) = 'boolean' and (v_flag)::boolean;
end;
$$;
revoke all on function public.founder_buyback_enabled() from public;
grant execute on function public.founder_buyback_enabled() to authenticated, service_role;

-- THE shared buyback/abandonment cents dial (owner ruling 2026-07-19). Read at claim
-- time; default 2500 (never hand-typed). NOT used by transfer payouts.
create or replace function public._seat_buyback_cents()
returns int
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(
    (select (value->>'cents')::int from public.system_config where key = 'seat_buyback_cents'),
    2500);
$$;
revoke all on function public._seat_buyback_cents() from public;
grant execute on function public._seat_buyback_cents() to service_role;

-- Internal int-dial reader for the 'seat_stewardship' config row (or a default).
create or replace function public._seat_stewardship_dial(p_key text, p_default int)
returns int
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(
    (select (value->>p_key)::int from public.system_config where key = 'seat_stewardship'),
    p_default);
$$;
revoke all on function public._seat_stewardship_dial(text, int) from public;
grant execute on function public._seat_stewardship_dial(text, int) to service_role;

-- ── 6. _log_founder_transfer_event — the same-transaction audit append ──────────
-- Internal helper (service-role); the transition RPCs call it while holding the row,
-- so the event lands in the SAME transaction as the state change (audit can never
-- drift from state). Owned by the definer; RLS-bypassing insert.
create or replace function public._log_founder_transfer_event(
  p_case uuid, p_actor text, p_event text, p_detail jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.founder_transfer_events (case_id, actor, event, detail)
    values (p_case, p_actor, p_event, coalesce(p_detail, '{}'::jsonb));
end;
$$;
revoke all on function public._log_founder_transfer_event(uuid, text, text, jsonb) from public;
grant execute on function public._log_founder_transfer_event(uuid, text, text, jsonb) to service_role;

-- ── 7. transfer_case_open → 'initiated' ─────────────────────────────────────────
-- Validates eligibility (12-mo hold), cooldown, security_status='normal', is_founder,
-- to_email ≠ from's email, and (structurally, via the partial uniques) the three
-- live-case constraints. Called by the edge's confirm_initiate AFTER the emailed
-- challenge is verified and the anomaly pre-checks pass.
create or replace function public.transfer_case_open(
  p_seat smallint, p_from uuid, p_to_email text, p_payout_form text default 'connect_cash'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_seat public.founder_seats%rowtype;
  v_from_email text;
  v_to text := lower(btrim(coalesce(p_to_email, '')));
  v_form text := lower(btrim(coalesce(p_payout_form, 'connect_cash')));
  v_is_founder boolean;
  v_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'transfer_case_open is service-role only (got: %)', caller_role;
  end if;
  if v_form not in ('connect_cash', 'account_credits') then
    return jsonb_build_object('ok', false, 'reason', 'bad_payout_form');
  end if;
  if v_to = '' or v_to not like '%@%' then
    return jsonb_build_object('ok', false, 'reason', 'bad_email');
  end if;

  select * into v_seat from public.founder_seats where seat_id = p_seat;
  if not found or v_seat.holder_user_id is distinct from p_from then
    return jsonb_build_object('ok', false, 'reason', 'not_seat_holder');
  end if;
  if v_seat.security_status <> 'normal' then
    return jsonb_build_object('ok', false, 'reason', 'seat_' || v_seat.security_status);
  end if;
  if v_seat.transfer_eligible_at is null or now() < v_seat.transfer_eligible_at then
    return jsonb_build_object('ok', false, 'reason', 'not_yet_eligible');
  end if;
  if v_seat.cooldown_until is not null and now() < v_seat.cooldown_until then
    return jsonb_build_object('ok', false, 'reason', 'cooldown');
  end if;

  select is_founder into v_is_founder from public.profiles where id = p_from;
  if v_is_founder is distinct from true then
    return jsonb_build_object('ok', false, 'reason', 'not_founder');
  end if;

  select lower(u.email) into v_from_email from auth.users u where u.id = p_from;
  if v_from_email is not null and v_from_email = v_to then
    return jsonb_build_object('ok', false, 'reason', 'self_transfer');
  end if;

  begin
    insert into public.founder_transfer_cases (seat_id, from_user, to_email_lower, payout_form, state)
      values (p_seat, p_from, v_to, v_form, 'initiated')
      returning id into v_id;
  exception when unique_violation then
    -- One of the three live-case partial uniques rejected it (a live case already
    -- exists for this seat, this from_user, or this to_user).
    return jsonb_build_object('ok', false, 'reason', 'live_case_exists');
  end;

  perform public._log_founder_transfer_event(v_id, 'outgoing', 'opened',
    jsonb_build_object('seat_id', p_seat, 'payout_form', v_form));
  return jsonb_build_object('ok', true, 'case_id', v_id);
end;
$$;
revoke all on function public.transfer_case_open(smallint, uuid, text, text) from public;
grant execute on function public.transfer_case_open(smallint, uuid, text, text) to service_role;

-- ── 8. transfer_case_bind_nominee → 'nominee_verified' ──────────────────────────
create or replace function public.transfer_case_bind_nominee(p_case uuid, p_to_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_case public.founder_transfer_cases%rowtype;
  v_email text;
  v_updated uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'transfer_case_bind_nominee is service-role only (got: %)', caller_role;
  end if;

  select * into v_case from public.founder_transfer_cases where id = p_case;
  if not found or v_case.state <> 'initiated' then
    return jsonb_build_object('ok', false, 'reason', 'wrong_state');
  end if;

  -- The nominee's verified email must match the invited address (case-insensitive).
  select lower(u.email) into v_email from auth.users u where u.id = p_to_user;
  if v_email is null or v_email <> v_case.to_email_lower then
    return jsonb_build_object('ok', false, 'reason', 'email_mismatch');
  end if;
  -- The nominee must hold NO seat (incoming holders receive at most one).
  if exists (select 1 from public.founder_seats where holder_user_id = p_to_user) then
    return jsonb_build_object('ok', false, 'reason', 'nominee_already_holder');
  end if;
  -- The nominee must be party to no OTHER live case.
  if exists (
    select 1 from public.founder_transfer_cases
    where id <> p_case
      and (from_user = p_to_user or to_user = p_to_user)
      and state in ('initiated','nominee_verified','awaiting_payment','cooling')
  ) then
    return jsonb_build_object('ok', false, 'reason', 'nominee_in_live_case');
  end if;

  -- Claim-once. The per-to_user live uniqueness index also guards a concurrent bind.
  begin
    update public.founder_transfer_cases
      set to_user = p_to_user, state = 'nominee_verified', nominee_verified_at = now(), updated_at = now()
      where id = p_case and state = 'initiated'
      returning id into v_updated;
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'reason', 'nominee_in_live_case');
  end;
  if v_updated is null then
    return jsonb_build_object('ok', false, 'reason', 'wrong_state');
  end if;

  perform public._log_founder_transfer_event(p_case, 'incoming', 'nominee_verified', '{}'::jsonb);
  return jsonb_build_object('ok', true, 'case_id', p_case, 'seat_id', v_case.seat_id);
end;
$$;
revoke all on function public.transfer_case_bind_nominee(uuid, uuid) from public;
grant execute on function public.transfer_case_bind_nominee(uuid, uuid) to service_role;

-- ── 9. transfer_case_mark_awaiting_payment → 'awaiting_payment' ─────────────────
create or replace function public.transfer_case_mark_awaiting_payment(p_case uuid, p_session text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_updated uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'transfer_case_mark_awaiting_payment is service-role only (got: %)', caller_role;
  end if;
  update public.founder_transfer_cases
    set state = 'awaiting_payment', stripe_session_id = p_session, updated_at = now()
    where id = p_case and state = 'nominee_verified'
    returning id into v_updated;
  if v_updated is null then
    return jsonb_build_object('ok', false, 'reason', 'wrong_state');
  end if;
  perform public._log_founder_transfer_event(p_case, 'incoming', 'awaiting_payment',
    jsonb_build_object('session', p_session));
  return jsonb_build_object('ok', true, 'case_id', p_case);
end;
$$;
revoke all on function public.transfer_case_mark_awaiting_payment(uuid, text) from public;
grant execute on function public.transfer_case_mark_awaiting_payment(uuid, text) to service_role;

-- ── 10. transfer_case_mark_paid → 'cooling' (webhook, §6.6) ─────────────────────
-- Stamps paid_at, cooling_ends_at = now() + cooling_hours, the price snapshot, and
-- payout_amount_cents = price_cents / 2. Claim-once on the awaiting_payment state AND
-- the bound session id (a webhook for a different session no-ops).
create or replace function public.transfer_case_mark_paid(p_case uuid, p_session text, p_price_cents int)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_updated uuid; v_hours int;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'transfer_case_mark_paid is service-role only (got: %)', caller_role;
  end if;
  v_hours := public._founder_transfer_dial('cooling_hours', 72);
  update public.founder_transfer_cases
    set state = 'cooling', paid_at = now(), accepted_at = now(),
        cooling_ends_at = now() + make_interval(hours => v_hours),
        price_cents = p_price_cents,
        payout_amount_cents = (p_price_cents / 2),
        updated_at = now()
    where id = p_case and state = 'awaiting_payment' and stripe_session_id = p_session
    returning id into v_updated;
  if v_updated is null then
    return jsonb_build_object('ok', false, 'reason', 'wrong_state');
  end if;
  perform public._log_founder_transfer_event(p_case, 'webhook', 'paid',
    jsonb_build_object('session', p_session, 'price_cents', p_price_cents));
  return jsonb_build_object('ok', true, 'case_id', p_case, 'cooling_hours', v_hours);
end;
$$;
revoke all on function public.transfer_case_mark_paid(uuid, text, int) from public;
grant execute on function public.transfer_case_mark_paid(uuid, text, int) to service_role;

-- ── 11. transfer_case_regress_awaiting_payment (checkout.session.expired, §6.3) ──
-- An expired unpaid session regresses the case to nominee_verified so acceptance can
-- re-mint a session. Claim-once on the awaiting_payment state AND the expired session.
create or replace function public.transfer_case_regress_awaiting_payment(p_session text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'transfer_case_regress_awaiting_payment is service-role only (got: %)', caller_role;
  end if;
  update public.founder_transfer_cases
    set state = 'nominee_verified', stripe_session_id = null, updated_at = now()
    where state = 'awaiting_payment' and stripe_session_id = p_session
    returning id into v_id;
  if v_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_match');
  end if;
  perform public._log_founder_transfer_event(v_id, 'system', 'session_expired_regress',
    jsonb_build_object('session', p_session));
  return jsonb_build_object('ok', true, 'case_id', v_id);
end;
$$;
revoke all on function public.transfer_case_regress_awaiting_payment(text) from public;
grant execute on function public.transfer_case_regress_awaiting_payment(text) to service_role;

-- ── 12. transfer_case_abort → 'aborted' (legal from initiated..cooling) ─────────
-- Returns was_paid + the payment session so the edge can issue the Stripe refund for
-- a paid (cooling) case. NEVER legal after finalize.
create or replace function public.transfer_case_abort(p_case uuid, p_actor text, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text; v_case public.founder_transfer_cases%rowtype; v_updated uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'transfer_case_abort is service-role only (got: %)', caller_role;
  end if;
  if p_actor not in ('outgoing','incoming','system_anomaly','admin','chargeback') then
    return jsonb_build_object('ok', false, 'reason', 'bad_actor');
  end if;

  select * into v_case from public.founder_transfer_cases where id = p_case;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'no_case');
  end if;

  update public.founder_transfer_cases
    set state = 'aborted', aborted_at = now(), abort_actor = p_actor,
        abort_reason = left(coalesce(p_reason, ''), 500), updated_at = now()
    where id = p_case and state in ('initiated','nominee_verified','awaiting_payment','cooling')
    returning id into v_updated;
  if v_updated is null then
    return jsonb_build_object('ok', false, 'reason', 'wrong_state');
  end if;

  perform public._log_founder_transfer_event(p_case,
    case when p_actor in ('outgoing','incoming','admin') then p_actor else 'system' end,
    'aborted', jsonb_build_object('actor', p_actor, 'reason', p_reason));
  -- was_paid tells the edge whether to refund the $99 (only a cooling case was paid).
  return jsonb_build_object('ok', true, 'case_id', p_case,
    'was_paid', (v_case.state = 'cooling'), 'payment_session', v_case.stripe_session_id);
end;
$$;
revoke all on function public.transfer_case_abort(uuid, text, text) from public;
grant execute on function public.transfer_case_abort(uuid, text, text) to service_role;

-- ── 13. transfer_case_finalize → 'finalized' (§6.5, ONE transaction) ────────────
-- Guards state='cooling' AND cooling_ends_at ≤ now() AND the seat is not flagged.
-- Moves the entitlement (NOT account data, LAW 10): appends the lineage row, moves
-- the seat holder + stamps the incoming holder's OWN 12-month hold, flips profiles
-- flags. The EDGE leg (auth metadata, emails, money_events) is M-7. NO credit
-- movement of any kind.
create or replace function public.transfer_case_finalize(p_case uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_case public.founder_transfer_cases%rowtype;
  v_seat public.founder_seats%rowtype;
  v_from_name text;
  v_floor_days int;
  v_payout int;
  v_updated uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'transfer_case_finalize is service-role only (got: %)', caller_role;
  end if;

  select * into v_case from public.founder_transfer_cases where id = p_case;
  if not found then return jsonb_build_object('ok', false, 'reason', 'no_case'); end if;
  if v_case.state <> 'cooling' then return jsonb_build_object('ok', false, 'reason', 'wrong_state'); end if;
  if v_case.cooling_ends_at is null or now() < v_case.cooling_ends_at then
    return jsonb_build_object('ok', false, 'reason', 'cooling_not_elapsed');
  end if;
  if v_case.to_user is null then return jsonb_build_object('ok', false, 'reason', 'no_nominee'); end if;

  select * into v_seat from public.founder_seats where seat_id = v_case.seat_id;
  -- A payout-blocking dispute would have flagged the seat (§6.7); refuse to finalize.
  if v_seat.security_status = 'flagged' then
    return jsonb_build_object('ok', false, 'reason', 'seat_flagged');
  end if;

  -- Claim-once: flip to finalized first (a concurrent runner loses here and no-ops).
  v_floor_days := public._founder_transfer_dial('payout_floor_days', 14);
  v_payout := coalesce(v_case.payout_amount_cents, v_case.price_cents / 2);
  update public.founder_transfer_cases
    set state = 'finalized', finalized_at = now(),
        payout_status = 'scheduled',
        payout_due_at = now() + make_interval(days => v_floor_days),
        payout_amount_cents = v_payout,
        updated_at = now()
    where id = p_case and state = 'cooling'
    returning id into v_updated;
  if v_updated is null then
    return jsonb_build_object('ok', false, 'reason', 'lost_claim');
  end if;

  -- Snapshot the OUTGOING holder's opted+approved display name for the lineage.
  v_from_name := case when v_seat.display_name_status = 'approved'
    then nullif(btrim(coalesce(v_seat.display_name_optin, '')), '') end;
  insert into public.founder_seat_transfers (seat_id, from_holder, to_holder, from_display_name, note)
    values (v_case.seat_id, v_case.from_user, v_case.to_user, v_from_name, 'transfer');

  -- Move the seat entitlement. The incoming holder starts UN-OPTED and carries their
  -- OWN fresh 12-month hold + cooldown.
  update public.founder_seats
    set holder_user_id = v_case.to_user, held_since = now(), acquired_via = 'transfer',
        last_transfer_at = now(),
        cooldown_until = now() + interval '12 months',
        transfer_eligible_at = now() + interval '12 months',
        display_name_optin = null, display_name_status = 'pending', gallery_author_slug = null,
        security_status = 'normal', updated_at = now()
    where seat_id = v_case.seat_id;

  -- Move the flags (NOT account data). The auth.admin metadata mirror + emails are
  -- the edge leg (M-7); handle_premium_downgrade for a subscribed ex-founder is also
  -- the edge leg (it must respect their live Cartographer sub).
  update public.profiles set is_founder = false, updated_at = now() where id = v_case.from_user;
  update public.profiles set is_founder = true, tier = 'premium', updated_at = now() where id = v_case.to_user;

  perform public._log_founder_transfer_event(p_case, 'system', 'finalized',
    jsonb_build_object('seat_id', v_case.seat_id, 'from_user', v_case.from_user,
      'to_user', v_case.to_user, 'payout_amount_cents', v_payout, 'payout_form', v_case.payout_form));
  return jsonb_build_object('ok', true, 'case_id', p_case, 'seat_id', v_case.seat_id,
    'from_user', v_case.from_user, 'to_user', v_case.to_user,
    'payout_amount_cents', v_payout, 'payout_form', v_case.payout_form);
end;
$$;
revoke all on function public.transfer_case_finalize(uuid) from public;
grant execute on function public.transfer_case_finalize(uuid) to service_role;

-- ── 14. transfer_case_reverse → 'reversed' (§6.7, finalized + payout not released) ─
-- The seat moves BACK (lineage 'reversal' — append, never erase); payout held; flags
-- reversed. Refused once the payout has released/is-releasing (that path flags the
-- seat + accepts the residual instead).
create or replace function public.transfer_case_reverse(p_case uuid, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text; v_case public.founder_transfer_cases%rowtype;
  v_seat public.founder_seats%rowtype; v_back_name text; v_updated uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'transfer_case_reverse is service-role only (got: %)', caller_role;
  end if;

  select * into v_case from public.founder_transfer_cases where id = p_case;
  if not found then return jsonb_build_object('ok', false, 'reason', 'no_case'); end if;
  if v_case.state <> 'finalized' then return jsonb_build_object('ok', false, 'reason', 'wrong_state'); end if;
  if v_case.payout_status in ('released','releasing') then
    return jsonb_build_object('ok', false, 'reason', 'payout_released');
  end if;

  update public.founder_transfer_cases
    set state = 'reversed', payout_status = 'held', updated_at = now()
    where id = p_case and state = 'finalized' and payout_status not in ('released','releasing')
    returning id into v_updated;
  if v_updated is null then
    return jsonb_build_object('ok', false, 'reason', 'lost_claim');
  end if;

  select * into v_seat from public.founder_seats where seat_id = v_case.seat_id;
  v_back_name := case when v_seat.display_name_status = 'approved'
    then nullif(btrim(coalesce(v_seat.display_name_optin, '')), '') end;
  insert into public.founder_seat_transfers (seat_id, from_holder, to_holder, from_display_name, note)
    values (v_case.seat_id, v_case.to_user, v_case.from_user, v_back_name, 'reversal');

  -- Seat back to the ORIGINAL holder (their original hold stamps are re-established).
  update public.founder_seats
    set holder_user_id = v_case.from_user, held_since = now(), acquired_via = 'purchase',
        last_transfer_at = null, cooldown_until = null,
        transfer_eligible_at = now() + interval '12 months',
        display_name_optin = null, display_name_status = 'pending', gallery_author_slug = null,
        security_status = 'normal', updated_at = now()
    where seat_id = v_case.seat_id;
  update public.profiles set is_founder = true, tier = 'premium', updated_at = now() where id = v_case.from_user;
  update public.profiles set is_founder = false, updated_at = now() where id = v_case.to_user;

  perform public._log_founder_transfer_event(p_case, 'system', 'reversed',
    jsonb_build_object('seat_id', v_case.seat_id, 'reason', p_reason));
  return jsonb_build_object('ok', true, 'case_id', p_case, 'seat_id', v_case.seat_id);
end;
$$;
revoke all on function public.transfer_case_reverse(uuid, text) from public;
grant execute on function public.transfer_case_reverse(uuid, text) to service_role;

-- ── 15. expire_stale_transfer_cases — the due-runner sweep (§6.3) ────────────────
create or replace function public.expire_stale_transfer_cases()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_days int; v_count int := 0; r record;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'expire_stale_transfer_cases is service-role only (got: %)', caller_role;
  end if;
  v_days := public._founder_transfer_dial('expiry_days', 14);
  for r in
    update public.founder_transfer_cases
      set state = 'expired', updated_at = now()
      where state in ('initiated','nominee_verified','awaiting_payment')
        and initiated_at < now() - make_interval(days => v_days)
      returning id
  loop
    perform public._log_founder_transfer_event(r.id, 'system', 'expired', '{}'::jsonb);
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;
revoke all on function public.expire_stale_transfer_cases() from public;
grant execute on function public.expire_stale_transfer_cases() to service_role;

-- ── 16. has_active_transfer_lock — the recovery lockout read (§6.3) ─────────────
-- True iff the user is a party (from or to) to a LIVE case. The auth-recovery edge
-- refuses question-based recovery when this is true (fail-CLOSED on transport error,
-- handled edge-side). The email variant resolves email→uid for the logged-out flow.
create or replace function public.has_active_transfer_lock(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.founder_transfer_cases
    where (from_user = p_user or to_user = p_user)
      and state in ('initiated','nominee_verified','awaiting_payment','cooling'));
$$;
revoke all on function public.has_active_transfer_lock(uuid) from public;
grant execute on function public.has_active_transfer_lock(uuid) to service_role;

create or replace function public.email_has_active_transfer_lock(p_email text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v_email text := lower(btrim(coalesce(p_email, ''))); v_uid uuid;
begin
  if v_email = '' then return false; end if;
  select u.id into v_uid from auth.users u where lower(u.email) = v_email limit 1;
  if v_uid is null then return false; end if;
  return public.has_active_transfer_lock(v_uid);
end;
$$;
revoke all on function public.email_has_active_transfer_lock(text) from public;
grant execute on function public.email_has_active_transfer_lock(text) to service_role;

-- ── 17. issue_transfer_challenge / verify_transfer_challenge (066/067 idiom) ────
-- issue: generates a 6-digit code, hashes it (bcrypt), stores it with a 10-min TTL,
-- returns the PLAINTEXT code + id so the edge can email it (the seam). A fresh issue
-- retires any prior unconsumed code for the same (case, party, purpose). Refuses for
-- 1 hour after a 5-attempt lockout on this (case, party) — read from the audit log.
create or replace function public.issue_transfer_challenge(p_case uuid, p_party text, p_purpose text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_code text; v_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'issue_transfer_challenge is service-role only (got: %)', caller_role;
  end if;
  if p_party not in ('outgoing','incoming') or p_purpose not in ('initiate','nominee_verify','abort') then
    return jsonb_build_object('ok', false, 'reason', 'bad_args');
  end if;
  if not exists (select 1 from public.founder_transfer_cases where id = p_case) then
    return jsonb_build_object('ok', false, 'reason', 'no_case');
  end if;
  -- 1-hour party lockout after an over-cap (a challenge_locked event within the hour).
  if exists (
    select 1 from public.founder_transfer_events
    where case_id = p_case and event = 'challenge_locked'
      and detail->>'party' = p_party and at > now() - interval '1 hour'
  ) then
    return jsonb_build_object('ok', false, 'reason', 'locked');
  end if;

  -- Retire any prior unconsumed code for this (case, party, purpose).
  update public.founder_transfer_challenges
    set consumed_at = now()
    where case_id = p_case and party = p_party and purpose = p_purpose and consumed_at is null;

  v_code := lpad((floor(random() * 1000000))::int::text, 6, '0');
  insert into public.founder_transfer_challenges (case_id, party, purpose, code_hash, expires_at)
    values (p_case, p_party, p_purpose, crypt(v_code, gen_salt('bf')), now() + interval '10 minutes')
    returning id into v_id;
  perform public._log_founder_transfer_event(p_case, 'system', 'challenge_issued',
    jsonb_build_object('party', p_party, 'purpose', p_purpose));
  return jsonb_build_object('ok', true, 'challenge_id', v_id, 'code', v_code);
end;
$$;
revoke all on function public.issue_transfer_challenge(uuid, text, text) from public;
grant execute on function public.issue_transfer_challenge(uuid, text, text) to service_role;

-- verify: constant-shape bcrypt compare of the newest live code. Counts every wrong
-- attempt; the 5th wrong attempt LOCKS the (case, party) for 1 hour (a challenge_locked
-- event) and raises a case security signal. A correct code is consumed once.
create or replace function public.verify_transfer_challenge(p_case uuid, p_party text, p_purpose text, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text; v_ch public.founder_transfer_challenges%rowtype; v_attempts int;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'verify_transfer_challenge is service-role only (got: %)', caller_role;
  end if;

  -- Already locked out for this (case, party)? Refuse without a compare.
  if exists (
    select 1 from public.founder_transfer_events
    where case_id = p_case and event = 'challenge_locked'
      and detail->>'party' = p_party and at > now() - interval '1 hour'
  ) then
    return jsonb_build_object('ok', false, 'reason', 'locked');
  end if;

  select * into v_ch from public.founder_transfer_challenges
    where case_id = p_case and party = p_party and purpose = p_purpose
      and consumed_at is null and expires_at > now()
    order by created_at desc limit 1;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'no_live_code');
  end if;

  if crypt(coalesce(p_code, ''), v_ch.code_hash) = v_ch.code_hash then
    update public.founder_transfer_challenges set consumed_at = now() where id = v_ch.id;
    return jsonb_build_object('ok', true, 'case_id', p_case);
  end if;

  -- Wrong: count it. The 5th failure locks the party for an hour.
  update public.founder_transfer_challenges set attempts = attempts + 1
    where id = v_ch.id returning attempts into v_attempts;
  if v_attempts >= 5 then
    update public.founder_transfer_challenges set consumed_at = now() where id = v_ch.id;
    perform public._log_founder_transfer_event(p_case, 'system', 'challenge_locked',
      jsonb_build_object('party', p_party, 'purpose', p_purpose));
    return jsonb_build_object('ok', false, 'reason', 'locked');
  end if;
  return jsonb_build_object('ok', false, 'reason', 'bad_code', 'attempts', v_attempts);
end;
$$;
revoke all on function public.verify_transfer_challenge(uuid, text, text, text) from public;
grant execute on function public.verify_transfer_challenge(uuid, text, text, text) to service_role;

-- ── 18. my_transfer_case_status — the party-facing projection (authenticated) ───
-- Returns the caller's OWN live/recent case, safe fields only. The outgoing party
-- sees the invited email (they typed it); the incoming party NEVER sees the outgoing
-- holder's email — at most the outgoing holder's opted+approved display name.
create or replace function public.my_transfer_case_status()
returns table (
  case_id uuid, seat_id smallint, viewer_role text, state text,
  payout_form text, payout_status text,
  initiated_at timestamptz, nominee_verified_at timestamptz, paid_at timestamptz,
  cooling_ends_at timestamptz, finalized_at timestamptz, payout_due_at timestamptz,
  counterparty_email text, counterparty_display_name text
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with me as (select auth.uid() as uid)
  select
    c.id, c.seat_id,
    case when c.from_user = m.uid then 'outgoing' else 'incoming' end as viewer_role,
    c.state, c.payout_form, c.payout_status,
    c.initiated_at, c.nominee_verified_at, c.paid_at,
    c.cooling_ends_at, c.finalized_at, c.payout_due_at,
    -- Only the outgoing party (who typed the address) sees the counterparty email.
    case when c.from_user = m.uid then c.to_email_lower else null end as counterparty_email,
    -- The incoming party sees at most the outgoing holder's opted+approved display name.
    case when c.to_user = m.uid then (
      select case when s.display_name_status = 'approved'
        then nullif(btrim(coalesce(s.display_name_optin, '')), '') end
      from public.founder_seats s where s.seat_id = c.seat_id
    ) else null end as counterparty_display_name
  from public.founder_transfer_cases c, me m
  where m.uid is not null
    and (c.from_user = m.uid or c.to_user = m.uid)
    and c.state in ('initiated','nominee_verified','awaiting_payment','cooling','finalized')
  order by c.initiated_at desc
  limit 5;
$$;
revoke all on function public.my_transfer_case_status() from public;
grant execute on function public.my_transfer_case_status() to authenticated;
