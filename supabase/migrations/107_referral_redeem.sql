-- ────────────────────────────────────────────────────────────────────────────
-- 107_referral_redeem.sql — referral + redeem-code foundation (money path).
--
-- OPERATOR NOTE
--   Schema + RPCs only; no data migration, no rows touched. Everything is
--   ADDITIVE and idempotent (if-not-exists / or-replace / drop-policy-if-
--   exists). The Stripe webhook + create-checkout edge functions are the ONLY
--   writers on every value-moving path; a signed-in client can do exactly two
--   things — record a referral intent and ask "is this code redeemable for
--   me?" (a collapsed yes/no echo).
--
-- MONEY-PATH POSTURE (mirror 024 / 075 / 103)
--   * Server-authoritative: rewards move as Stripe coupons / credit grants the
--     WEBHOOK applies after real payment events. Nothing here trusts a
--     client-supplied amount, coupon id, or status.
--   * Idempotent: every state transition is an ATOMIC CLAIM — a single guarded
--     UPDATE ... RETURNING (the 024 credit_grant_idempotency idiom) — so an
--     at-least-once webhook redelivery finds no claimable row and no-ops.
--   * Enumeration-hardened: redeem_codes has NO client SELECT policy; the
--     validate RPC returns a collapsed verdict and NEVER the coupon id. A
--     banned/disabled referrer is indistinguishable from an unknown account
--     number, so the referral prompt cannot probe moderation state.
--   * Zero-dollar gate (red-team finding): grant_referral RE-ASSERTS
--     amount_paid > 0 inside the function, so a 100%-discounted or trialing
--     first invoice can never mint a referral reward even if the webhook's
--     own guard regresses.
--   * Service-role assertion IN THE BODY (024's system_grant_credits idiom),
--     belt-and-braces with the REVOKE/GRANT posture, on every value-moving RPC.
--
-- Depends on: 001 (profiles, auth.users), 053/054 (banned_at/disabled_at/
--             deleted_at), 057 (account_is_active), 075 (profiles.account_number).
-- @rollback: supabase/rollback/107_referral_redeem.down.sql — drops the nine
--            RPCs (function bodies only). The four tables hold value/audit
--            rows and are deliberately NOT dropped; forward-fix per the runbook.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. processed_webhook_events — generic event-level webhook idempotency ───
-- Stripe delivers at-least-once. 024's credit_grant_idempotency dedupes GRANTS
-- by delivery key; this table dedupes at the EVENT level so multi-step handlers
-- (referral grant + coupon apply + detail write) run at most once per event id.
-- The webhook claims the event id with INSERT ... ON CONFLICT DO NOTHING before
-- doing any work; a redelivery loses the claim and returns 200 without acting.
create table if not exists public.processed_webhook_events (
  event_id     text primary key,
  event_type   text,
  processed_at timestamptz not null default now()
);

alter table public.processed_webhook_events enable row level security;
-- No policies ON PURPOSE: reads + writes are service_role only (the webhook's
-- admin client). RLS-on + no policy denies all client access, exactly like
-- ai_spend_reservations (086).

comment on table public.processed_webhook_events is
  'Event-level idempotency claims for the Stripe webhook: one row per processed event id, claimed via INSERT ON CONFLICT DO NOTHING before any side effect. RLS-on, no policy: service_role only.';

-- ── 2. redeem_codes — operator-issued codes (free month / credits) ──────────
-- Codes are secrets. There is NO client SELECT policy — validation goes through
-- validate_redeem_code, which returns a collapsed verdict and never the coupon
-- id, so the table cannot be enumerated through PostgREST.
create table if not exists public.redeem_codes (
  code             text primary key,
  kind             text not null check (kind in ('free_month', 'credits')),
  stripe_coupon_id text,
  credit_amount    integer,
  applies_to       text not null default 'any'
                     check (applies_to in ('subscription', 'one_time', 'any')),
  max_uses         integer not null default 1,
  uses_count       integer not null default 0 check (uses_count >= 0),
  stackable        boolean not null default false,
  active           boolean not null default true,
  expires_at       timestamptz,
  created_at       timestamptz not null default now(),
  -- 107 hardening (beyond the base spec): shape checks so an operator typo
  -- cannot issue a code that silently grants nothing at apply time. A credits
  -- code must carry a positive amount; a free-month code must carry the Stripe
  -- coupon that implements it.
  constraint redeem_codes_credits_have_amount
    check (kind <> 'credits' or (credit_amount is not null and credit_amount > 0)),
  constraint redeem_codes_free_month_has_coupon
    check (kind <> 'free_month' or stripe_coupon_id is not null)
);

alter table public.redeem_codes enable row level security;
-- No policies ON PURPOSE (see above): service_role only.

comment on table public.redeem_codes is
  'Operator-issued redeem codes. NO client SELECT policy — codes must never be enumerable; the client-facing check is validate_redeem_code, which never returns the coupon id. Writes are service-role/operator only.';

-- ── 3. redemptions — one row per (code, user), the once-per-user gate ───────
-- Lifecycle: reserved (seat held at checkout create) → applied (webhook saw the
-- paid session) | reverted (session expired; seat handed back). The
-- UNIQUE(code, user_id) is the once-per-user-EVER gate — a reverted attempt
-- still counts, so a user cannot cycle checkout sessions to farm seats.
create table if not exists public.redemptions (
  id                uuid primary key default gen_random_uuid(),
  code              text not null references public.redeem_codes(code),
  user_id           uuid not null references auth.users(id) on delete cascade,
  stripe_session_id text,
  status            text not null default 'reserved'
                      check (status in ('reserved', 'applied', 'reverted')),
  created_at        timestamptz not null default now(),
  applied_at        timestamptz,
  unique (code, user_id)
);

-- apply/revert look up by checkout session id; partial — most rows are stamped
-- but a reserve that failed before bind stays NULL forever.
create index if not exists idx_redemptions_session
  on public.redemptions(stripe_session_id)
  where stripe_session_id is not null;
-- The owner-SELECT policy filters on user_id.
create index if not exists idx_redemptions_user
  on public.redemptions(user_id);

alter table public.redemptions enable row level security;

drop policy if exists "Users read own redemptions" on public.redemptions;
create policy "Users read own redemptions" on public.redemptions
  for select using (auth.uid() = user_id);
-- No insert/update/delete policy ON PURPOSE: every state transition runs
-- through the service-role RPCs below. A user can watch their redemption move
-- through the lifecycle but can never forge or replay one.

comment on table public.redemptions is
  'Per-(code,user) redemption lifecycle: reserved → applied | reverted. UNIQUE(code,user_id) is the once-per-user gate (a reverted attempt still counts). Users may SELECT their own rows; all writes are service-role RPCs.';

-- ── 4. referrals — one row per referee, claimed once on first real payment ──
create table if not exists public.referrals (
  id                      uuid primary key default gen_random_uuid(),
  referrer_user_id        uuid not null references auth.users(id) on delete cascade,
  referee_user_id         uuid not null references auth.users(id) on delete cascade,
  -- Snapshot of the account number the referee typed: the audit trail survives
  -- a (service-role-only) account-number rotation on the referrer.
  referrer_account_number text not null,
  status                  text not null default 'pending'
                            check (status in ('pending', 'granted', 'rejected', 'clawed_back')),
  stripe_invoice_id       text,
  referrer_reward         text,
  referee_reward          text,
  referrer_coupon_applied text,
  referee_coupon_applied  text,
  created_at              timestamptz not null default now(),
  granted_at              timestamptz,
  clawed_back_at          timestamptz,
  -- Structural self-referral bar (record_referral_intent also rejects it with
  -- a friendly reason; this is the backstop against any other write path).
  constraint referrals_no_self_referral check (referrer_user_id <> referee_user_id),
  -- One referral per referee, EVER — the intent RPC's pre-check is UX only.
  unique (referee_user_id)
);

-- One invoice can reward at most ONE referral: the race backstop for a
-- replayed/misrouted invoice id (grant_referral catches the violation).
create unique index if not exists idx_referrals_invoice_id
  on public.referrals(stripe_invoice_id)
  where stripe_invoice_id is not null;
-- The per-referrer cap counts (referrer_user_id, status) pairs.
create index if not exists idx_referrals_referrer_status
  on public.referrals(referrer_user_id, status);

alter table public.referrals enable row level security;

drop policy if exists "Users read referrals they are party to" on public.referrals;
create policy "Users read referrals they are party to" on public.referrals
  for select using (auth.uid() = referrer_user_id or auth.uid() = referee_user_id);
-- No insert/update/delete policy ON PURPOSE: intents go through
-- record_referral_intent (SECURITY DEFINER, validated); grants/clawbacks are
-- webhook-driven service-role RPCs.

comment on table public.referrals is
  'Referral lifecycle: pending (intent recorded) → granted (first REAL payment, claimed once by invoice) → clawed_back (refund/dispute). Users may SELECT rows where they are referrer or referee; all writes are RPCs.';

-- ── 5. record_referral_intent — the ONLY client-reachable referral write ────
-- Caller (auth.uid()) is the REFEREE. Records a pending row; no value moves
-- until the webhook sees a real paid invoice and calls grant_referral.
create or replace function public.record_referral_intent(p_referrer_account_number text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller       uuid;
  v_referrer     uuid;
  v_account      text;
  v_open_count   integer;
  v_referral_id  uuid;
begin
  v_caller := auth.uid();
  if v_caller is null then
    raise exception 'not authenticated';
  end if;

  -- 057 discipline: banned/disabled/deleted accounts do not write.
  if not public.account_is_active(v_caller) then
    return jsonb_build_object('ok', false, 'reason', 'account_inactive');
  end if;

  -- Normalize: account numbers are SF- + 7 uppercase Crockford chars (075), so
  -- upper(btrim()) lets a pasted-lowercase handle resolve without ever creating
  -- a second matchable form (the generator never emits lowercase).
  v_account := upper(btrim(coalesce(p_referrer_account_number, '')));
  if v_account = '' then
    return jsonb_build_object('ok', false, 'reason', 'unknown_account_number');
  end if;

  select id into v_referrer
    from public.profiles
    where account_number = v_account;

  -- Unknown AND banned/disabled/deleted referrers collapse into ONE reason:
  -- account numbers are private (075), but a leaked one must still not reveal
  -- moderation state through the referral prompt.
  if v_referrer is null or not public.account_is_active(v_referrer) then
    return jsonb_build_object('ok', false, 'reason', 'unknown_account_number');
  end if;

  if v_referrer = v_caller then
    return jsonb_build_object('ok', false, 'reason', 'self_referral');
  end if;

  -- UX pre-check; the UNIQUE(referee_user_id) below is the real gate (see the
  -- unique_violation handler).
  if exists (select 1 from public.referrals where referee_user_id = v_caller) then
    return jsonb_build_object('ok', false, 'reason', 'already_referred');
  end if;

  -- Per-referrer cap (anti-farming): at most 50 open-or-rewarded referrals.
  -- count-then-insert is not atomic under READ COMMITTED on its own — two
  -- concurrent referees could both read 49 — so the cap is serialized with a
  -- transaction-scoped advisory lock on the referrer key (the 086
  -- reserve_ai_spend idiom). Rejected/clawed-back rows do NOT count: a
  -- clawback frees the seat.
  perform pg_advisory_xact_lock(hashtext('referral_cap:' || v_referrer::text));
  select count(*)::integer into v_open_count
    from public.referrals
    where referrer_user_id = v_referrer
      and status in ('pending', 'granted');
  if v_open_count >= 50 then
    return jsonb_build_object('ok', false, 'reason', 'referrer_cap_reached');
  end if;

  insert into public.referrals (referrer_user_id, referee_user_id, referrer_account_number)
    values (v_referrer, v_caller, v_account)
    returning id into v_referral_id;

  return jsonb_build_object('ok', true, 'referral_id', v_referral_id);
exception
  when unique_violation then
    -- The UNIQUE(referee_user_id) race backstop: two concurrent intents from
    -- the same referee resolve to exactly one row, the loser lands here.
    return jsonb_build_object('ok', false, 'reason', 'already_referred');
end;
$$;

revoke all on function public.record_referral_intent(text) from public;
grant execute on function public.record_referral_intent(text) to authenticated;

comment on function public.record_referral_intent(text) is
  'Referee-side referral intent. Resolves the referrer by private account_number (075), rejects self-referral / inactive parties / duplicates / a 50-open-referral per-referrer cap (advisory-lock serialized), and inserts a pending row. No value moves here — grant_referral (webhook) does that.';

-- ── 6. grant_referral — webhook-only, claim-once, zero-dollar-gated ──────────
create or replace function public.grant_referral(
  p_referee uuid,
  p_invoice_id text,
  p_amount_paid_cents integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_referral_id uuid;
  v_referrer    uuid;
begin
  -- In-body service-role assertion (024's system_grant_credits idiom): the
  -- GRANT posture below already restricts execution, this makes a future
  -- grant-posture regression fail loudly instead of moving value.
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'grant_referral is service-role only (got: %)', caller_role;
  end if;

  if p_referee is null then
    return jsonb_build_object('ok', false, 'reason', 'referee_required');
  end if;
  -- The invoice id is the clawback key — a grant without one could never be
  -- clawed back, so refuse it.
  if coalesce(btrim(p_invoice_id), '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'invoice_id_required');
  end if;
  -- Zero-dollar red-team gate, RE-ASSERTED server-side: a fully-discounted or
  -- trialing first invoice (amount_paid = 0) must never mint a reward, even if
  -- the webhook's own check regresses. Money must actually have moved.
  if p_amount_paid_cents is null or p_amount_paid_cents <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'non_positive_amount');
  end if;

  -- ATOMIC CLAIM (the 024 idiom): exactly one caller flips pending → granted.
  -- A webhook redelivery — or a concurrent duplicate — finds status <>
  -- 'pending', claims no row, and no-ops. The row lock taken by the winning
  -- UPDATE serializes racers; the re-evaluated WHERE starves the loser.
  update public.referrals
     set status = 'granted',
         stripe_invoice_id = p_invoice_id,
         granted_at = now()
   where referee_user_id = p_referee
     and status = 'pending'
   returning id, referrer_user_id into v_referral_id, v_referrer;

  if v_referral_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_pending_referral');
  end if;

  return jsonb_build_object(
    'ok', true,
    'referral_id', v_referral_id,
    'referrer_user_id', v_referrer
  );
exception
  when unique_violation then
    -- idx_referrals_invoice_id backstop: one invoice can never reward two
    -- referrals (a replayed invoice id under a different referee).
    return jsonb_build_object('ok', false, 'reason', 'invoice_already_used');
end;
$$;

revoke all on function public.grant_referral(uuid, text, integer) from public;
grant execute on function public.grant_referral(uuid, text, integer) to service_role;

comment on function public.grant_referral(uuid, text, integer) is
  'Webhook-only referral grant on the referee''s first REAL payment. Re-asserts amount_paid > 0 (zero-dollar gate), then claims pending → granted atomically (claim-once; a redelivery no-ops). Returns the referral + referrer for the webhook''s coupon/credit step.';

-- ── 7. record_referral_grant_detail — clawback bookkeeping ──────────────────
-- After the webhook applies the actual reward (a Stripe coupon or a credit
-- grant), it records WHAT it applied per party, so clawback_referral can hand
-- back exactly the fields needed to reverse it.
create or replace function public.record_referral_grant_detail(
  p_referral_id uuid,
  p_party text,
  p_reward text,
  p_coupon_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'record_referral_grant_detail is service-role only (got: %)', caller_role;
  end if;

  -- Programmer error, not user input — raise, don't return a reason.
  if p_party not in ('referrer', 'referee') then
    raise exception 'p_party must be referrer or referee (got: %)', p_party;
  end if;

  if p_party = 'referrer' then
    update public.referrals
       set referrer_reward = p_reward,
           referrer_coupon_applied = p_coupon_id
     where id = p_referral_id
     returning id into v_id;
  else
    update public.referrals
       set referee_reward = p_reward,
           referee_coupon_applied = p_coupon_id
     where id = p_referral_id
     returning id into v_id;
  end if;

  if v_id is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.record_referral_grant_detail(uuid, text, text, text) from public;
grant execute on function public.record_referral_grant_detail(uuid, text, text, text) to service_role;

comment on function public.record_referral_grant_detail(uuid, text, text, text) is
  'Webhook bookkeeping after a referral reward is applied: stamps the per-party reward + coupon-applied columns so clawback_referral can return exactly what must be reversed.';

-- ── 8. clawback_referral — refund/dispute reversal, claim-once ───────────────
create or replace function public.clawback_referral(p_invoice_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_id               uuid;
  v_referrer         uuid;
  v_referee          uuid;
  v_referrer_reward  text;
  v_referee_reward   text;
  v_referrer_coupon  text;
  v_referee_coupon   text;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'clawback_referral is service-role only (got: %)', caller_role;
  end if;

  if coalesce(btrim(p_invoice_id), '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'invoice_id_required');
  end if;

  -- ATOMIC CLAIM, keyed by the invoice the grant stamped: only a GRANTED
  -- referral flips (pending/rejected rows are untouched — nothing was ever
  -- rewarded), and a redelivered refund event finds no claimable row.
  update public.referrals
     set status = 'clawed_back',
         clawed_back_at = now()
   where stripe_invoice_id = p_invoice_id
     and status = 'granted'
   returning id, referrer_user_id, referee_user_id,
             referrer_reward, referee_reward,
             referrer_coupon_applied, referee_coupon_applied
    into v_id, v_referrer, v_referee,
         v_referrer_reward, v_referee_reward,
         v_referrer_coupon, v_referee_coupon;

  if v_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_granted_referral');
  end if;

  -- The webhook uses these to remove the Stripe coupons / adjust credits.
  return jsonb_build_object(
    'ok', true,
    'referral_id', v_id,
    'referrer_user_id', v_referrer,
    'referee_user_id', v_referee,
    'referrer_reward', v_referrer_reward,
    'referee_reward', v_referee_reward,
    'referrer_coupon_applied', v_referrer_coupon,
    'referee_coupon_applied', v_referee_coupon
  );
end;
$$;

revoke all on function public.clawback_referral(text) from public;
grant execute on function public.clawback_referral(text) to service_role;

comment on function public.clawback_referral(text) is
  'Webhook-only referral clawback on refund/dispute, keyed by the granted invoice id. Claims granted → clawed_back atomically (a second delivery no-ops) and returns the per-party rewards + applied coupons the webhook must reverse.';

-- ── 9. validate_redeem_code — read-only UX echo, enumeration-hardened ────────
create or replace function public.validate_redeem_code(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_code public.redeem_codes%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not public.account_is_active(auth.uid()) then
    return jsonb_build_object('valid', false, 'kind', null, 'reason', 'account_inactive');
  end if;

  select * into v_code
    from public.redeem_codes
    where code = btrim(coalesce(p_code, ''));

  -- Once per user, EVER (the UNIQUE(code,user_id) gate — a reverted attempt
  -- still counts). Checked BEFORE the availability collapse so the caller who
  -- already redeemed sees the truthful reason even after the code exhausts or
  -- expires (on a max_uses=1 code their own redemption IS the exhaustion).
  -- 'already_used' necessarily confirms the code exists, but only to a caller
  -- who has already redeemed it.
  if v_code.code is not null and exists (
    select 1 from public.redemptions
    where code = v_code.code and user_id = auth.uid()
  ) then
    return jsonb_build_object('valid', false, 'kind', null, 'reason', 'already_used');
  end if;

  -- ONE collapsed reason for unknown / deactivated / expired / exhausted: a
  -- distinguishable "expired" or "exhausted" would confirm to an enumerator
  -- that a code EXISTS. This is a UX echo; the authoritative gate is
  -- reserve_redemption at checkout-create time.
  if v_code.code is null
     or not v_code.active
     or (v_code.expires_at is not null and v_code.expires_at <= now())
     or v_code.uses_count >= v_code.max_uses then
    return jsonb_build_object('valid', false, 'kind', null, 'reason', 'invalid_code');
  end if;

  -- kind lets the client phrase the confirmation ("one month free" vs "bonus
  -- credits"). The coupon id and amounts NEVER leave the server.
  return jsonb_build_object('valid', true, 'kind', v_code.kind, 'reason', null);
end;
$$;

revoke all on function public.validate_redeem_code(text) from public;
grant execute on function public.validate_redeem_code(text) to authenticated;

comment on function public.validate_redeem_code(text) is
  'Read-only redeem-code check for checkout UX. Returns a collapsed verdict ({valid, kind, reason}); unknown/inactive/expired/exhausted all read ''invalid_code'' so codes cannot be enumerated, and the coupon id is never returned. Authoritative gating happens in reserve_redemption.';

-- ── 10. reserve_redemption — guarded atomic seat claim (create-checkout) ─────
-- Called by create-checkout BEFORE the Stripe session exists, so the reserved
-- row starts WITHOUT a session id; bind_redemption_session stamps it right
-- after session create. Split this way because the session id is only known
-- after Stripe returns, and reserving after session-create would leave a paid
-- session with no seat under a max_uses race.
create or replace function public.reserve_redemption(p_code text, p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role  text;
  v_code       text;
  v_coupon     text;
  v_kind       text;
  v_credit     integer;
  v_applies    text;
  v_redemption uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'reserve_redemption is service-role only (got: %)', caller_role;
  end if;

  if p_user is null then
    return jsonb_build_object('ok', false, 'reason', 'user_required');
  end if;

  -- GUARDED ATOMIC INCREMENT: one statement takes the code's row lock, and the
  -- WHERE is re-evaluated after the lock clears — so of two concurrent
  -- reserves on the last seat (uses_count = max_uses - 1), exactly one gets a
  -- row and the loser falls through to 'invalid_code'. Same collapsed reason
  -- as validate_redeem_code for the not-reservable states.
  update public.redeem_codes
     set uses_count = uses_count + 1
   where code = btrim(coalesce(p_code, ''))
     and active
     and (expires_at is null or expires_at > now())
     and uses_count < max_uses
   returning code, stripe_coupon_id, kind, credit_amount, applies_to
    into v_code, v_coupon, v_kind, v_credit, v_applies;

  if v_code is null then
    return jsonb_build_object('ok', false, 'reason', 'invalid_code');
  end if;

  insert into public.redemptions (code, user_id, status)
    values (v_code, p_user, 'reserved')
    on conflict (code, user_id) do nothing
    returning id into v_redemption;

  if v_redemption is null then
    -- Once-per-user gate hit: hand the seat straight back (same transaction,
    -- so no window where the phantom hold blocks a legitimate reserve).
    -- Guarded decrement — never below zero; the check constraint is the
    -- backstop.
    update public.redeem_codes
       set uses_count = greatest(uses_count - 1, 0)
     where code = v_code;
    return jsonb_build_object('ok', false, 'reason', 'already_used');
  end if;

  -- stripe_coupon_id / credit_amount / applies_to go to the SERVER caller only
  -- (create-checkout enforces applies_to against the session mode and attaches
  -- the coupon). None of this shape is client-reachable.
  return jsonb_build_object(
    'ok', true,
    'stripe_coupon_id', v_coupon,
    'kind', v_kind,
    'credit_amount', v_credit,
    'applies_to', v_applies,
    'redemption_id', v_redemption
  );
end;
$$;

revoke all on function public.reserve_redemption(text, uuid) from public;
grant execute on function public.reserve_redemption(text, uuid) to service_role;

comment on function public.reserve_redemption(text, uuid) is
  'create-checkout seat claim: guarded atomic uses_count increment (active + unexpired + under max_uses in ONE statement), then the reserved redemptions row — session id stamped later by bind_redemption_session. A once-per-user conflict rolls the increment back in the same transaction.';

-- ── 11. bind_redemption_session — stamp the session id post-create ──────────
create or replace function public.bind_redemption_session(
  p_redemption_id uuid,
  p_session_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'bind_redemption_session is service-role only (got: %)', caller_role;
  end if;

  if coalesce(btrim(p_session_id), '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'session_id_required');
  end if;

  -- Write-once: a reserved row binds to exactly one checkout session (a retry
  -- with the SAME id is an idempotent success; a different id is refused so a
  -- second session can never hijack the seat).
  update public.redemptions
     set stripe_session_id = p_session_id
   where id = p_redemption_id
     and status = 'reserved'
     and (stripe_session_id is null or stripe_session_id = p_session_id)
   returning id into v_id;

  if v_id is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.bind_redemption_session(uuid, text) from public;
grant execute on function public.bind_redemption_session(uuid, text) to service_role;

comment on function public.bind_redemption_session(uuid, text) is
  'Stamps the Stripe checkout session id onto a reserved redemption right after session create. Write-once per row (same-id retries succeed idempotently); apply/revert key off this id.';

-- ── 12. apply_redemption — webhook flip on the paid session, claim-once ─────
create or replace function public.apply_redemption(p_session_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_id     uuid;
  v_code   text;
  v_user   uuid;
  v_kind   text;
  v_credit integer;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'apply_redemption is service-role only (got: %)', caller_role;
  end if;

  if coalesce(btrim(p_session_id), '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'session_id_required');
  end if;

  -- ATOMIC CLAIM: reserved → applied exactly once per session; a redelivered
  -- checkout.session.completed finds no reserved row and no-ops.
  update public.redemptions
     set status = 'applied',
         applied_at = now()
   where stripe_session_id = p_session_id
     and status = 'reserved'
   returning id, code, user_id into v_id, v_code, v_user;

  if v_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_reserved_redemption');
  end if;

  -- Joined so the webhook can grant credit-kind codes (via system_grant_credits)
  -- without a second round trip. free_month codes need no further DB action —
  -- the coupon already rode the checkout session.
  select kind, credit_amount into v_kind, v_credit
    from public.redeem_codes
    where code = v_code;

  return jsonb_build_object(
    'ok', true,
    'redemption_id', v_id,
    'code', v_code,
    'user_id', v_user,
    'kind', v_kind,
    'credit_amount', v_credit
  );
end;
$$;

revoke all on function public.apply_redemption(text) from public;
grant execute on function public.apply_redemption(text) to service_role;

comment on function public.apply_redemption(text) is
  'Webhook-only: flips the session''s redemption reserved → applied atomically (claim-once; redeliveries no-op) and returns kind + credit_amount so a credits code can be granted in the same handler.';

-- ── 13. revert_redemption — checkout.session.expired, idempotent ─────────────
create or replace function public.revert_redemption(p_session_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_id   uuid;
  v_code text;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'revert_redemption is service-role only (got: %)', caller_role;
  end if;

  if coalesce(btrim(p_session_id), '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'session_id_required');
  end if;

  -- ATOMIC CLAIM: only a reserved row flips, so a redelivered expiry event (or
  -- an expiry racing the completion) finds no row and no-ops — the seat is
  -- handed back at most once, and an APPLIED redemption is never reverted.
  update public.redemptions
     set status = 'reverted'
   where stripe_session_id = p_session_id
     and status = 'reserved'
   returning id, code into v_id, v_code;

  if v_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_reserved_redemption');
  end if;

  -- Hand the seat back. Guarded — never below zero (check constraint backstop).
  update public.redeem_codes
     set uses_count = greatest(uses_count - 1, 0)
   where code = v_code;

  return jsonb_build_object('ok', true, 'redemption_id', v_id);
end;
$$;

revoke all on function public.revert_redemption(text) from public;
grant execute on function public.revert_redemption(text) to service_role;

comment on function public.revert_redemption(text) is
  'Webhook-only: on checkout.session.expired, flips reserved → reverted atomically and hands the code seat back (guarded decrement). Idempotent — a second delivery claims no row and decrements nothing. The (code,user) unique row remains: once per user, ever.';
