-- ────────────────────────────────────────────────────────────────────────────
-- 108_dossier_entitlements.sql — durable single-dossier export rights (money path).
--
-- OPERATOR NOTE
--   Schema + RPCs only; no data migration, no rows touched. Everything is
--   ADDITIVE and idempotent (if-not-exists / or-replace / drop-policy-if-exists).
--   The Stripe webhook + account-actions edge functions are the ONLY writers on
--   every value-moving path; a signed-in client can do exactly one read — ask
--   "do I hold a durable export right on this saved settlement?" (a read-only echo
--   that never leaks another buyer's data or a token hash).
--
-- PRODUCT MODEL (user-locked)
--   PDF export moves to a ladder. Anonymous: $2.99 = one-time download (the
--   existing single_dossier flow, mechanics UNCHANGED). Free account: $2.99 per
--   settlement = DURABLE re-download rights for as long as that settlement stays
--   in the account. Cartographer / Founder: unlimited export (a tier gate, not an
--   entitlement row). Durable rights REQUIRE the settlement to be SAVED to the
--   account — "save it first" — so the entitlement references the saves table
--   (public.settlements) with ON DELETE CASCADE: deleting the settlement forfeits
--   the right as a FOREIGN-KEY FACT, per the user's explicit rule.
--
--   Entitlements are their OWN ledger, not tier state: a durable right SURVIVES a
--   Cartographer upgrade/downgrade untouched. Nothing here reads or writes
--   profiles.tier.
--
-- RETRO UPGRADE (user-locked, SAME-DEVICE + SAME-SETTLEMENT + AUTOMATIC only)
--   An anonymous buyer's $2.99 purchase stays a one-shot download UNLESS, on the
--   SAME browser, they then create an account and save THAT SAME settlement. The
--   original device's {sessionId, checkoutToken} stash is the ONLY proof: after
--   the save, the client makes a silent post-save call to account-actions, which
--   verifies sha256(checkoutToken) against the webhook-recorded checkout_token_hash
--   and then calls the service-role session-claim RPC to bind the durable right to
--   the just-saved settlement. There is NO cross-device claim, NO email matching,
--   NO user-facing claim UI or settlement picker: if the stash is gone, one-shot
--   stays one-shot. buyer_email_lower is recorded for audit/support only — NO
--   claim path reads it. The UNIQUE(stripe_session_id) on entitlements is the
--   backstop against a double-claim.
--
-- MONEY-PATH POSTURE (mirror 024 / 085 / 107)
--   * Server-authoritative: value (the durable right) is minted only by the
--     WEBHOOK after a real paid session, or by a CLAIM whose token proof is
--     verified server-side. Nothing here trusts a client-supplied session id or
--     save ownership without re-checking it in the body.
--   * Idempotent: every state transition is an ATOMIC CLAIM — a single guarded
--     UPDATE ... RETURNING (the 024 credit_grant_idempotency idiom) — so an
--     at-least-once webhook redelivery, or a double-tapped claim, finds no
--     claimable row and no-ops.
--   * Enumeration-hardened: single_dossier_purchases has NO client SELECT policy
--     and NO client-reachable read of any kind — buyer_email_lower and
--     checkout_token_hash never leave the DB. The token-claim path reads the row
--     service-role (in account-actions) and echoes nothing back to the client.
--   * Refund-safe: a refunded purchase can NEVER be claimed — clawback flips the
--     purchase row to 'refunded' even when no entitlement existed yet (the
--     anonymous-refund case), closing the refund→claim race permanently.
--   * Service-role assertion IN THE BODY (024's system_grant_credits idiom),
--     belt-and-braces with the REVOKE/GRANT posture, on every value-moving RPC.
--
-- Depends on: 001 (public.settlements, auth.users, profiles).
-- @rollback: supabase/rollback/108_dossier_entitlements.down.sql — drops the four
--            RPCs (function bodies only). The two tables hold value/audit rows
--            (durable rights + the token-claim ledger) and are deliberately NOT
--            dropped; forward-fix per the runbook.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. dossier_entitlements — one durable export right per (user, saved dossier)
-- The right is minted by the webhook (source 'purchase') on a signed-in buyer's
-- paid single_dossier session, or by a retro-claim (source 'claim') that binds an
-- anonymous purchase voucher to a saved settlement the claimer owns. The FK to
-- public.settlements(id) with ON DELETE CASCADE is the "save it first" +
-- "deletion forfeits" rule as a schema fact.
create table if not exists public.dossier_entitlements (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  save_id           uuid not null references public.settlements(id) on delete cascade,
  stripe_session_id text not null unique,
  status            text not null default 'active'
                      check (status in ('active', 'clawed_back')),
  source            text not null default 'purchase'
                      check (source in ('purchase', 'claim')),
  created_at        timestamptz not null default now(),
  clawed_back_at    timestamptz,
  -- One durable right per (user, saved settlement): a second purchase against a
  -- settlement the user already holds a right to is a no-op ('already_entitled').
  unique (user_id, save_id)
);

-- The owner-SELECT policy + has_dossier_entitlement filter on (user_id, save_id).
create index if not exists idx_dossier_entitlements_user_save
  on public.dossier_entitlements(user_id, save_id);

alter table public.dossier_entitlements enable row level security;

drop policy if exists "Users read own dossier entitlements" on public.dossier_entitlements;
create policy "Users read own dossier entitlements" on public.dossier_entitlements
  for select using (auth.uid() = user_id);
-- No insert/update/delete policy ON PURPOSE: every grant/clawback/claim runs
-- through the RPCs below (webhook service-role, or the definer claim path). A
-- user can watch their entitlement but can never forge, replay, or reactivate one.

comment on table public.dossier_entitlements is
  'Durable single-dossier export rights: one row per (user, saved settlement). Minted by the webhook (source purchase) or a retro-claim (source claim). FK to public.settlements(id) ON DELETE CASCADE = the "save it first" + "deletion forfeits the right" rule as a foreign-key fact; entitlements are their own ledger and survive tier up/downgrade. Users may SELECT their own rows; all writes are RPCs.';

-- ── 2. single_dossier_purchases — the same-device token-claim ledger ─────────
-- Written ONLY by the webhook, on every paid ANONYMOUS single_dossier session.
-- Records the sha256 of the checkout token so the SAME-DEVICE token-claim path
-- can prove the original buyer without ever storing the token itself. The
-- purchase is a voucher: one claim binds it to one saved settlement. The retro
-- upgrade is same-device + same-settlement + automatic only (see the header).
create table if not exists public.single_dossier_purchases (
  stripe_session_id   text primary key,
  -- AUDIT / SUPPORT ONLY (the buyer's Stripe email, lowercased). No claim path
  -- reads this column — the token hash below is the sole proof-of-purchase. It
  -- exists so an operator can reconcile a disputed charge to its buyer inside
  -- Stripe's own access controls; it is NEVER echoed to any client.
  buyer_email_lower   text not null,
  -- sha256 hex of the anonymous device's checkout token (NEVER the token). The
  -- ONLY proof the same-device token-claim verifies against.
  checkout_token_hash text,
  amount_cents        integer,
  status              text not null default 'unclaimed'
                        check (status in ('unclaimed', 'claimed', 'refunded')),
  purchased_at        timestamptz not null default now(),
  claimed_by          uuid references auth.users(id) on delete set null,
  claimed_at          timestamptz
);

alter table public.single_dossier_purchases enable row level security;
-- No policies ON PURPOSE: reads + writes are service_role / SECURITY DEFINER only.
-- A client can NEVER select this table directly — buyer_email_lower and
-- checkout_token_hash are PII/secret material, and a direct read would let a
-- signed-in user enumerate other buyers' emails. There is NO client-reachable
-- read of any kind: the token-claim path reads the row service-role (inside
-- account-actions) and echoes nothing back to the client. RLS-on + no policy
-- denies all client access, exactly like processed_webhook_events (107) /
-- ai_spend_reservations (086).

comment on table public.single_dossier_purchases is
  'Same-device token-claim ledger for anonymous single_dossier purchases, written only by the webhook. checkout_token_hash (sha256 of the checkout token, NEVER the token) is the sole proof-of-purchase for the retro claim. buyer_email_lower is audit/support-only — no claim path reads it. status unclaimed → claimed | refunded; a refunded purchase can never be claimed. RLS-on, no policy: NO direct client read at all — the token-claim path reads service-role in account-actions.';

-- ── 3. grant_dossier_entitlement — webhook-only durable grant, claim-once ────
-- Called by the webhook on a SIGNED-IN buyer's paid single_dossier session (the
-- happy path where the purchaser already has an account and picked a saved
-- settlement at checkout). Validates the save exists AND belongs to p_user, then
-- mints the durable right idempotently.
create or replace function public.grant_dossier_entitlement(
  p_user uuid,
  p_save_id uuid,
  p_session_id text,
  p_source text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_source    text;
  v_owner     uuid;
  v_id        uuid;
  v_existing  uuid;
begin
  -- In-body service-role assertion (024's system_grant_credits idiom): the GRANT
  -- posture below already restricts execution; this makes a future grant-posture
  -- regression fail loudly instead of minting a right.
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'grant_dossier_entitlement is service-role only (got: %)', caller_role;
  end if;

  if p_user is null then
    return jsonb_build_object('ok', false, 'reason', 'user_required');
  end if;
  if coalesce(btrim(p_session_id), '') = '' then
    -- The session id is the idempotency + clawback key — refuse a grant without one.
    return jsonb_build_object('ok', false, 'reason', 'session_id_required');
  end if;
  -- Default to 'purchase'; only the two known sources are accepted.
  v_source := coalesce(p_source, 'purchase');
  if v_source not in ('purchase', 'claim') then
    return jsonb_build_object('ok', false, 'reason', 'invalid_source');
  end if;

  -- "Save it first": the settlement must EXIST and belong to p_user. A missing or
  -- foreign save is refused before any row is written — the durable right can
  -- only attach to the buyer's own saved dossier.
  select user_id into v_owner from public.settlements where id = p_save_id;
  if v_owner is null or v_owner <> p_user then
    return jsonb_build_object('ok', false, 'reason', 'save_not_found');
  end if;

  -- IDEMPOTENT on stripe_session_id: a webhook redelivery of the same paid
  -- session finds the existing row and reports already_existed WITHOUT minting a
  -- second right. Checked first so a replay is a clean success, not a conflict.
  select id into v_existing
    from public.dossier_entitlements
    where stripe_session_id = btrim(p_session_id);
  if v_existing is not null then
    return jsonb_build_object('ok', true, 'already_existed', true, 'entitlement_id', v_existing);
  end if;

  -- Mint the durable right. The UNIQUE(user_id, save_id) catches an already-held
  -- settlement (a different session for a save the user is already entitled to);
  -- the UNIQUE(stripe_session_id) is the concurrent-replay backstop.
  insert into public.dossier_entitlements (user_id, save_id, stripe_session_id, source)
    values (p_user, p_save_id, btrim(p_session_id), v_source)
    returning id into v_id;

  return jsonb_build_object('ok', true, 'already_existed', false, 'entitlement_id', v_id);
exception
  when unique_violation then
    -- Distinguish the two unique constraints so the caller gets a truthful reason.
    -- A (user, save) collision means the user already holds a right on this
    -- settlement (via a DIFFERENT session); a session collision is a concurrent
    -- replay of THIS session that raced past the pre-check.
    if exists (
      select 1 from public.dossier_entitlements
      where user_id = p_user and save_id = p_save_id
    ) and not exists (
      select 1 from public.dossier_entitlements
      where stripe_session_id = btrim(p_session_id)
    ) then
      return jsonb_build_object('ok', false, 'reason', 'already_entitled');
    end if;
    -- Concurrent same-session replay: resolve to the existing row, report success.
    select id into v_existing
      from public.dossier_entitlements
      where stripe_session_id = btrim(p_session_id);
    return jsonb_build_object('ok', true, 'already_existed', true, 'entitlement_id', v_existing);
end;
$$;

revoke all on function public.grant_dossier_entitlement(uuid, uuid, text, text) from public;
grant execute on function public.grant_dossier_entitlement(uuid, uuid, text, text) to service_role;

comment on function public.grant_dossier_entitlement(uuid, uuid, text, text) is
  'Webhook-only durable single-dossier grant. Validates the save exists AND belongs to p_user ("save it first"), then mints the entitlement idempotently on stripe_session_id (a redelivery reports already_existed). A (user,save) collision with a different session returns already_entitled; a foreign/unknown save returns save_not_found.';

-- ── 4. clawback_dossier_entitlement — refund/dispute reversal, claim-once ────
-- On charge.refunded / charge.dispute.created for a single_dossier session, the
-- webhook reverses the durable right AND poisons the purchase voucher so it can
-- never be retro-claimed. Both effects are claim-once + idempotent.
create or replace function public.clawback_dossier_entitlement(p_session_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_id     uuid;
  v_user   uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'clawback_dossier_entitlement is service-role only (got: %)', caller_role;
  end if;

  if coalesce(btrim(p_session_id), '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'session_id_required');
  end if;

  -- Poison the voucher FIRST and UNCONDITIONALLY: a refunded purchase can never
  -- be claimed, whether or not a durable right was ever minted (the anonymous-
  -- refund case, where the buyer never signed up so no entitlement exists). This
  -- closes the refund→claim race permanently — a claim after this point finds a
  -- 'refunded' row and is denied. Idempotent: a redelivered refund re-writes the
  -- same terminal status.
  update public.single_dossier_purchases
     set status = 'refunded'
   where stripe_session_id = btrim(p_session_id)
     and status <> 'refunded';

  -- ATOMIC CLAIM (the 024 idiom): exactly one caller flips active → clawed_back.
  -- A redelivered refund event — or a concurrent duplicate — finds status <>
  -- 'active', claims no row, and no-ops.
  update public.dossier_entitlements
     set status = 'clawed_back',
         clawed_back_at = now()
   where stripe_session_id = btrim(p_session_id)
     and status = 'active'
   returning id, user_id into v_id, v_user;

  if v_id is null then
    -- No active entitlement to reverse. The purchase row (if any) is already
    -- flipped to 'refunded' above, so the anonymous-refund case is fully handled
    -- — report success with a null entitlement id so the webhook does not retry.
    return jsonb_build_object('ok', true, 'entitlement_id', null);
  end if;

  return jsonb_build_object('ok', true, 'entitlement_id', v_id, 'user_id', v_user);
end;
$$;

revoke all on function public.clawback_dossier_entitlement(text) from public;
grant execute on function public.clawback_dossier_entitlement(text) to service_role;

comment on function public.clawback_dossier_entitlement(text) is
  'Webhook-only single-dossier clawback on refund/dispute, keyed by the paid session id. Flips the purchase voucher to refunded UNCONDITIONALLY (so a refunded purchase can never be claimed, even the anonymous-refund case where no entitlement exists), then claims the active entitlement active → clawed_back atomically. Returns {ok:true, entitlement_id:null} when only the anonymous-refund poison ran.';

-- ── 5. has_dossier_entitlement — read-only export gate ───────────────────────
-- The client asks "do I hold a durable export right on this saved settlement?"
-- before offering re-download. SECURITY DEFINER so it can read the caller's own
-- entitlement rows behind RLS; scoped to auth.uid() so it can NEVER report
-- another user's right.
create or replace function public.has_dossier_entitlement(p_save_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid;
begin
  v_caller := auth.uid();
  if v_caller is null then
    return false;
  end if;
  return exists (
    select 1 from public.dossier_entitlements
    where user_id = v_caller
      and save_id = p_save_id
      and status = 'active'
  );
end;
$$;

revoke all on function public.has_dossier_entitlement(uuid) from public;
grant execute on function public.has_dossier_entitlement(uuid) to authenticated;

comment on function public.has_dossier_entitlement(uuid) is
  'Read-only export gate: true when auth.uid() holds an ACTIVE durable right on p_save_id. Scoped to the caller — never reports another user''s entitlement. A clawed-back right reads false.';

-- ── 6. claim_dossier_purchase_by_session — the same-device token claim ───────
-- Service-role ONLY. account-actions verifies the checkout token against the
-- stored checkout_token_hash FIRST (the original device still holds the token in
-- its purchase stash), then calls this to atomically claim the voucher and mint
-- the durable right on the just-saved settlement. There is no email path — the
-- token proof is the sole authorization for the retro claim.
create or replace function public.claim_dossier_purchase_by_session(
  p_session_id text,
  p_user uuid,
  p_save_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_purchase  public.single_dossier_purchases%rowtype;
  v_owner     uuid;
  v_claimed   text;
  v_id        uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'claim_dossier_purchase_by_session is service-role only (got: %)', caller_role;
  end if;

  if p_user is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if coalesce(btrim(p_session_id), '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  select * into v_purchase
    from public.single_dossier_purchases
    where stripe_session_id = btrim(p_session_id);
  if v_purchase.stripe_session_id is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  if v_purchase.status = 'refunded' then
    return jsonb_build_object('ok', false, 'reason', 'refunded');
  end if;
  if v_purchase.status = 'claimed' then
    return jsonb_build_object('ok', false, 'reason', 'already_claimed');
  end if;

  -- "Save it first": the voucher binds only to a settlement p_user owns.
  select user_id into v_owner from public.settlements where id = p_save_id;
  if v_owner is null or v_owner <> p_user then
    return jsonb_build_object('ok', false, 'reason', 'save_not_found');
  end if;

  -- ATOMIC CLAIM #1: flip unclaimed → claimed exactly once.
  update public.single_dossier_purchases
     set status = 'claimed',
         claimed_by = p_user,
         claimed_at = now()
   where stripe_session_id = v_purchase.stripe_session_id
     and status = 'unclaimed'
   returning stripe_session_id into v_claimed;

  if v_claimed is null then
    return jsonb_build_object('ok', false, 'reason', 'already_claimed');
  end if;

  -- ATOMIC CLAIM #2 (same transaction): mint the durable right.
  begin
    insert into public.dossier_entitlements (user_id, save_id, stripe_session_id, source)
      values (p_user, p_save_id, v_purchase.stripe_session_id, 'claim')
      returning id into v_id;
  exception
    when unique_violation then
      if exists (
        select 1 from public.dossier_entitlements
        where user_id = p_user and save_id = p_save_id
      ) and not exists (
        select 1 from public.dossier_entitlements
        where stripe_session_id = v_purchase.stripe_session_id
      ) then
        return jsonb_build_object('ok', false, 'reason', 'already_entitled');
      end if;
      return jsonb_build_object('ok', false, 'reason', 'already_claimed');
  end;

  return jsonb_build_object('ok', true, 'entitlement_id', v_id);
end;
$$;

revoke all on function public.claim_dossier_purchase_by_session(text, uuid, uuid) from public;
grant execute on function public.claim_dossier_purchase_by_session(text, uuid, uuid) to service_role;

comment on function public.claim_dossier_purchase_by_session(text, uuid, uuid) is
  'Service-role same-device retro-claim: account-actions verifies the checkout token (held in the original device''s purchase stash) against checkout_token_hash, then calls this to atomically claim the purchase (unclaimed → claimed) and mint the durable right (source claim) in one transaction. The token proof is the sole authorization — there is no email path. Returns {ok, entitlement_id} or a reason (not_found / already_claimed / refunded / save_not_found / already_entitled).';
