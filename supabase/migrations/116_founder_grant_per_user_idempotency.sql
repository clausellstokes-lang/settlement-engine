-- 116_founder_grant_per_user_idempotency.sql
--
-- Close the founder-bonus double-grant race (cycle-5 money-path review).
--
-- THE RACE. The founder_lifetime 30-credit bonus is once-PER-ACCOUNT.
-- create-checkout's founder gate only checks the GLOBAL founder_seats_taken()
-- count — it does NOT block a SECOND concurrent founder_lifetime checkout for the
-- SAME not-yet-founder user (is_founder is still false for both in-flight
-- sessions, and the seat counter has room). Both paid sessions reach the
-- stripe-webhook founder_grant. system_grant_credits (024) deduped founder_grant
-- ONLY on the per-SESSION delivery key (metadata->>'stripe_session_id'), so two
-- sessions = two keys = both atomic claims succeed = 60 credits, not 30. The
-- webhook's own once-per-account SELECT (grantCreditsForSessionOnce, oncePerUser)
-- is a non-atomic read-then-write: two concurrent deliveries can both pass it.
--
-- THE FIX. Derive the founder_grant idempotency (delivery) key from the USER, not
-- the session: 'founder:' || target_user. The existing credit_grant_idempotency
-- primary key (source, idempotency_key) plus INSERT ... ON CONFLICT DO NOTHING
-- then makes two concurrent founder grants for one account resolve to exactly one
-- grant — the loser reads no claim and returns the current balance. 'purchase'
-- stays keyed on stripe_session_id (a credit pack is legitimately re-buyable);
-- 'monthly_allowance' stays keyed on stripe_invoice_id.
--
-- CLAWBACK INVARIANT (do NOT regress). The founder refund clawback finds the
-- buyer by credit_ledger.metadata->>'stripe_session_id' = the refunded session id.
-- ONLY the delivery KEY moves to a per-user value; the ledger row's metadata still
-- carries the REAL checkout session id (the webhook passes it), and a new guard
-- REQUIRES it for founder_grant so a founder row can never be written without its
-- clawback key.
--
-- FORK DISCIPLINE (the net-current rule). Recreated from 024's net-current body
-- VERBATIM, with exactly three deltas:
--   (1) search_path pinned `public, pg_temp`. 094 ALTERed 024's bare
--       `set search_path = public` to append pg_temp on every definer function;
--       the net-current STATE of this function therefore includes pg_temp, and a
--       bare-`public` recreate would silently drop that hardening. Pin it here.
--   (2) the founder_grant delivery-key split (per-user, above).
--   (3) the founder_grant metadata.stripe_session_id guard (clawback, above).
-- Everything else — the service-role check, the amount bounds, the atomic claim,
-- the <<grant_fn>> label + audit write + grant/revoke — is 024 unchanged.
--
-- MERGE / RENUMBER NOTE. Authored as 111 on master; renumbered to 116 when
-- reconciled onto fix/holistic-remediation (111-115 were already taken by the
-- pin-search-path, redemption-gate, revoke-service-set, ai-pricing-config, and
-- pricing-resync-cron migrations). The two test loaders
-- (tests/security/creditLedgerHarness.js and tests/security/creditLedger.pglite.
-- test.js) reference '116' to match.
--
-- @rollback: recreate 024's system_grant_credits body verbatim (founder_grant keyed
--   on metadata->>'stripe_session_id'), re-pinning pg_temp so 094's hardening is not
--   lost: `... security definer set search_path = public, pg_temp as $$ ... $$;`. The
--   backfilled per-user claims are inert under the old body; purge if desired with
--   `delete from public.credit_grant_idempotency where source = 'founder_grant'
--   and idempotency_key like 'founder:%';`. NOTE this REINSTATES the founder
--   double-grant race — roll back only to unblock a broken deploy, then re-fix.

create or replace function public.system_grant_credits(
  target_user uuid,
  amount integer,
  source text,
  metadata jsonb default '{}'::jsonb,
  expires_at timestamptz default null
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
<<grant_fn>>
declare
  new_balance integer;
  caller_role text;
  delivery_key text;
  claimed_key text;
  new_ledger_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'system_grant_credits is service-role only (got: %)', caller_role;
  end if;
  if amount <= 0 or amount > 10000 then
    raise exception 'amount must be between 1 and 10000 (got: %)', amount;
  end if;
  if source is null or length(source) = 0 then
    raise exception 'source is required';
  end if;

  -- founder_grant is deduped once-per-ACCOUNT: key idempotency on the USER so two
  -- concurrent founder_lifetime checkouts (distinct sessions) claim the SAME key
  -- and grant exactly once. 'purchase'/'monthly_allowance' stay per-delivery.
  delivery_key := case
    when source = 'founder_grant' then 'founder:' || target_user::text
    when source = 'purchase' then metadata->>'stripe_session_id'
    when source = 'monthly_allowance' then metadata->>'stripe_invoice_id'
    else null
  end;

  -- founder_grant's delivery key no longer comes from metadata, but the ledger row
  -- MUST still carry the real checkout session id: the founder refund clawback
  -- looks the buyer up by metadata->>'stripe_session_id' = the refunded session.
  if source = 'founder_grant'
     and coalesce(metadata->>'stripe_session_id', '') = '' then
    raise exception 'founder_grant requires metadata.stripe_session_id (refund clawback key)';
  end if;

  if source in ('purchase', 'monthly_allowance')
     and coalesce(delivery_key, '') = '' then
    raise exception 'idempotency metadata is required for source %', source;
  end if;

  if delivery_key is not null then
    insert into public.credit_grant_idempotency (source, idempotency_key, user_id)
      values (source, delivery_key, target_user)
      on conflict do nothing
      returning idempotency_key into claimed_key;

    if claimed_key is null then
      return public.get_credit_balance(target_user);
    end if;
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata, expires_at)
    values (target_user, 'grant', amount, source, coalesce(metadata, '{}'::jsonb), expires_at)
    returning id into new_ledger_id;

  if delivery_key is not null then
    update public.credit_grant_idempotency cgi
      set ledger_id = new_ledger_id
      where cgi.source = grant_fn.source
        and idempotency_key = delivery_key;
  end if;

  insert into public.credit_transactions (user_id, amount, reason)
    values (target_user, amount, source);

  new_balance := public.get_credit_balance(target_user);
  update public.profiles
    set credits = new_balance, updated_at = now()
    where id = target_user;

  perform public._audit_action(
    null,
    target_user,
    'system_grant_credits',
    jsonb_build_object('source', source, 'amount', amount),
    jsonb_build_object('new_balance', new_balance, 'expires_at', expires_at) || coalesce(metadata, '{}'::jsonb),
    null
  );

  return new_balance;
end;
$$;

revoke all on function public.system_grant_credits(uuid, integer, text, jsonb, timestamptz) from public;
grant execute on function public.system_grant_credits(uuid, integer, text, jsonb, timestamptz) to service_role;

-- Backfill the per-user founder claim for every account that ALREADY received a
-- founder_grant under the old per-SESSION scheme, so the new once-per-account
-- dedup covers existing founders too — not just accounts granted after this
-- migration. Without it, an already-granted founder whose (rare) second founder
-- checkout reached the webhook would find no per-user claim and be re-granted.
-- Point ledger_id at the earliest founder_grant row per user; ON CONFLICT DO
-- NOTHING makes it a safe no-op on re-run.
insert into public.credit_grant_idempotency (source, idempotency_key, user_id, ledger_id)
select distinct on (user_id)
  'founder_grant', 'founder:' || user_id::text, user_id, id
from public.credit_ledger
where source = 'founder_grant'
order by user_id, created_at
on conflict do nothing;
