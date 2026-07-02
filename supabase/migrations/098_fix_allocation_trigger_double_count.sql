-- 098_fix_allocation_trigger_double_count.sql
--
-- FIX for 097's enforce_allocation_within_grant() double-count.
--
-- WHY
--   trg_allocation_within_grant is an AFTER constraint trigger, so by the time
--   the function runs, the allocation row that fired it is ALREADY inside
--   `SUM(amount) WHERE grant_id = new.grant_id`. 097's body then added
--   NEW.amount again (INSERT) / swapped OLD for NEW (UPDATE — but the summed
--   row already holds NEW.amount), double-counting the firing row. Effect: any
--   allocation of more than half a grant's remaining headroom was falsely
--   rejected — allocating 3 of a fresh 5-grant raised, an exact 5-of-5 raised,
--   and the 1-credit welcome grant could never be spent.
--
-- WHAT
--   Replace the function body with the AFTER-trigger-correct check: the summed
--   total IS the post-write total for both INSERT and UPDATE, so compare it to
--   the grant directly, with no tg_op/OLD/NEW arithmetic. Everything else from
--   097 is correct and kept verbatim: the FOR UPDATE grant-row lock (which is
--   what serializes concurrent allocations to the same grant), the missing-row
--   and kind raises, security definer + pinned search_path, and the execute
--   revoke. The trigger itself (deferrable initially immediate, AFTER
--   INSERT/UPDATE) is untouched — create-or-replace of the function is enough.
--
-- @rollback: re-run 097's `create or replace function public.enforce_allocation_
--   within_grant()` body to restore the previous function (NOTE: that reinstates
--   the double-count rejection bug), or drop the backstop entirely with
--   supabase/rollback/097_enforce_allocation_within_grant.down.sql.

create or replace function public.enforce_allocation_within_grant()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  grant_amount integer;
  grant_kind   text;
  allocated    integer;
begin
  -- Lock the grant row so concurrent allocation inserts to the same grant
  -- serialize here (not only inside spend_credits' `for update of g`).
  select amount, kind into grant_amount, grant_kind
    from public.credit_ledger
    where id = new.grant_id
    for update;

  if grant_amount is null then
    raise exception 'credit allocation references missing ledger row %', new.grant_id;
  end if;
  if grant_kind <> 'grant' then
    raise exception 'credit allocation grant_id % is a % row, not a grant', new.grant_id, grant_kind;
  end if;

  -- AFTER trigger: this sum already includes the row that fired it — the new
  -- row on INSERT, the updated (NEW.amount) row on UPDATE — so it IS the
  -- post-write total. No OLD/NEW adjustment (that was 097's double-count).
  select coalesce(sum(amount), 0) into allocated
    from public.credit_spend_allocations
    where grant_id = new.grant_id;

  if allocated > grant_amount then
    raise exception
      'credit over-allocation: grant % has amount % but allocations would total %',
      new.grant_id, grant_amount, allocated;
  end if;

  return new;
end;
$$;

-- create-or-replace preserves the function's ACL, but re-assert 097's lockdown
-- so this file is self-containedly safe even applied in isolation.
revoke all on function public.enforce_allocation_within_grant() from anon, authenticated;
