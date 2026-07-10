-- 109_dossier_voucher_preserve_on_already_entitled.sql
--
-- Fix: a single-dossier voucher was CONSUMED (unclaimed → claimed) without minting a
-- durable right whenever the target settlement was ALREADY entitled. In 108's
-- claim_dossier_purchase_by_session, ATOMIC CLAIM #1 flips the voucher to 'claimed'
-- BEFORE ATOMIC CLAIM #2 discovers, via the (user_id, save_id) unique constraint, that
-- the user already holds a right on this save — and then returns 'already_entitled'
-- with the voucher burned for nothing. The buyer paid, the voucher is spent, and they
-- gained no additional entitlement.
--
-- The right behavior: a voucher that can mint nothing on this save must NOT be consumed,
-- so it stays spendable on a DIFFERENT settlement. Two guards, both preserving the
-- voucher:
--   1. CHECK-BEFORE-CONSUME (common, settled case): before CLAIM #1, if the save already
--      carries a durable right for this user, return 'already_entitled' WITHOUT flipping
--      the voucher.
--   2. RESTORE-IN-RACE (rare TOCTOU): if a concurrent claim mints the right between the
--      pre-check and CLAIM #2's insert, CLAIM #1 has already flipped THIS voucher in this
--      transaction; restore it to 'unclaimed' before returning 'already_entitled'. The
--      restore is safe because this uncommitted transaction owns the just-set 'claimed'
--      row (no other session can see or claim it yet).
--
-- Recreated from 108's NET-CURRENT body (108 is the sole definition). Every other line —
-- the service-role gate, the not_found/refunded/already_claimed/save_not_found ladder,
-- CLAIM #1, CLAIM #2, the signature, the GRANT, and search_path — is 108 verbatim; only
-- the two voucher-preservation guards are added. No new object; re-affirms the
-- service-role-only GRANT.
--
-- @rollback: re-apply 108's definition of claim_dossier_purchase_by_session (drops both
--            guards, restoring the burn-on-already_entitled behavior).

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

  -- GUARD 1 (check-before-consume): if the save already carries a durable right for this
  -- user, the voucher can mint nothing (the (user_id, save_id) unique index), so do NOT
  -- burn it — leave it 'unclaimed' so it stays spendable on another settlement.
  if exists (
    select 1 from public.dossier_entitlements
    where user_id = p_user and save_id = p_save_id
  ) then
    return jsonb_build_object('ok', false, 'reason', 'already_entitled');
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
        -- GUARD 2 (restore-in-race): a concurrent claim minted the (user, save) right
        -- between GUARD 1 and here, so CLAIM #1 burned THIS voucher for nothing. Restore
        -- it to 'unclaimed' (this txn owns the just-set 'claimed' row, so no one else can
        -- see it yet) so the paid voucher stays spendable on another settlement.
        update public.single_dossier_purchases
           set status = 'unclaimed', claimed_by = null, claimed_at = null
         where stripe_session_id = v_purchase.stripe_session_id
           and status = 'claimed'
           and claimed_by = p_user;
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
  'Service-role same-device retro-claim: account-actions verifies the checkout token (held in the original device''s purchase stash) against checkout_token_hash, then calls this to atomically claim the purchase (unclaimed → claimed) and mint the durable right (source claim) in one transaction. The token proof is the sole authorization — there is no email path. Preserves the voucher when it can mint nothing: an already-entitled save returns already_entitled WITHOUT consuming the voucher (checked before the claim, and restored if a concurrent claim wins the race). Returns {ok, entitlement_id} or a reason (not_found / already_claimed / refunded / save_not_found / already_entitled).';
