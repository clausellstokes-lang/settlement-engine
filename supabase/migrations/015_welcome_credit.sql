-- ────────────────────────────────────────────────────────────────────────────
-- 015_welcome_credit.sql — Grant 1 narrate credit on signup.
--
-- P104 / X-4: every paying user has felt what they're paying for. The
-- single strongest premium pitch is a Narrate credit the user has already
-- spent — so they know exactly what they're buying when the second one
-- costs money.
--
-- Behavior:
--   On every INSERT into auth.users, a one-time grant of 1 credit is
--   recorded in the credit_ledger with reason='welcome'. The trigger is
--   idempotent — re-running the migration on an existing user does NOT
--   re-grant (the trigger fires only at INSERT, not UPDATE).
--
--   The grant flows through the existing admin_grant_credits RPC so it
--   passes the same audit + ledger-consistency checks as a stripe
--   webhook grant. No direct table manipulation.
--
-- The client-side UI (WelcomeCreditCard.jsx) reads the ledger for an
-- unspent kind='welcome' entry and surfaces the gift card on the
-- first saved settlement. Spending it (via the existing spend_credits
-- RPC) consumes the ledger entry and dismisses the card forever.
--
-- Migration is re-runnable: the function uses CREATE OR REPLACE, and
-- the trigger is dropped before recreate.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.grant_welcome_credit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ledger_exists boolean;
begin
  -- Defense-in-depth: check the ledger before granting in case this
  -- trigger fires for any reason on a user who somehow already has a
  -- welcome credit. The auth.users INSERT path should be the only
  -- entry point, but we don't want to ever double-grant.
  select exists (
    select 1 from public.credit_ledger
    where user_id = NEW.id and reason = 'welcome'
  ) into ledger_exists;

  if ledger_exists then
    return NEW;
  end if;

  -- Use the existing system_grant_credits RPC (migration 012) so the
  -- grant goes through the same ledger machinery as a paid grant.
  -- Note: we set a stable `kind` of 'welcome' so the UI can identify
  -- these credits separately from purchased / refunded credits.
  insert into public.credit_ledger (user_id, delta, reason, source, created_at)
  values (NEW.id, 1, 'welcome', 'signup_grant', now());

  -- Mirror the grant into the user's balance. The credit_balance
  -- table is the materialized view; the ledger is canonical.
  insert into public.credit_balance (user_id, balance)
  values (NEW.id, 1)
  on conflict (user_id) do update set balance = credit_balance.balance + 1;

  return NEW;
end;
$$;

-- Drop existing trigger first so the migration is re-runnable.
drop trigger if exists auth_users_welcome_credit on auth.users;
create trigger auth_users_welcome_credit
  after insert on auth.users
  for each row
  execute function public.grant_welcome_credit();

comment on function public.grant_welcome_credit() is
  'P104 / X-4: grants 1 welcome credit on signup. Idempotent — ledger-guard prevents double-grant.';
