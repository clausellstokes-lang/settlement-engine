-- 097_enforce_allocation_within_grant.sql
--
-- DEFENSE-IN-DEPTH for the credit ledger's allocation invariant.
--
-- WHY
--   spend_credits (007→057 net-current) allocates a spend across grants with
--   `least(needed, greatest(g.amount - already_allocated, 0))`, so the CODE never
--   over-allocates a grant. But nothing at the DB level *enforces* the invariant
--   `SUM(credit_spend_allocations.amount for a grant) <= that grant's amount`:
--   a future function, a manual fix, or a bug that inserts an allocation row
--   directly would silently mint spendable credit against a grant that has none
--   left, corrupting every balance derived from the ledger. The ledger is the
--   money source of truth, so this invariant belongs in the schema, not only in
--   one function's arithmetic.
--
-- WHAT
--   A constraint trigger on credit_spend_allocations (INSERT/UPDATE) that locks
--   the referenced grant row (serializing concurrent allocations to the same
--   grant even for a caller that does NOT pre-lock it, closing the READ-COMMITTED
--   two-writers race) and raises if the post-write total would exceed the grant.
--   On the correct spend_credits path this never fires — it is a backstop.

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

  select coalesce(sum(amount), 0) into allocated
    from public.credit_spend_allocations
    where grant_id = new.grant_id;

  -- On UPDATE the OLD row's amount is already inside `allocated`; swap it for NEW.
  if tg_op = 'UPDATE' then
    allocated := allocated - old.amount + new.amount;
  else
    allocated := allocated + new.amount;
  end if;

  if allocated > grant_amount then
    raise exception
      'credit over-allocation: grant % has amount % but allocations would total %',
      new.grant_id, grant_amount, allocated;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_allocation_within_grant on public.credit_spend_allocations;
create constraint trigger trg_allocation_within_grant
  after insert or update on public.credit_spend_allocations
  deferrable initially immediate
  for each row execute function public.enforce_allocation_within_grant();

revoke all on function public.enforce_allocation_within_grant() from anon, authenticated;
