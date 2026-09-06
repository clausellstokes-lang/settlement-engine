-- Reversal of migration 097 (enforce_allocation_within_grant).
-- DATA-SAFE and COMPLETE: 097 only adds a guard (a constraint trigger + its function),
-- no data. Dropping both restores the exact pre-097 schema. Run by hand during an
-- incident if the allocation trigger is wrongly rejecting legitimate writes.
--
-- Effect of running this: SUM(allocations) <= grant.amount is NO LONGER enforced at
-- the DB layer until you re-apply 097 (or a corrected forward migration). Only revert
-- if the trigger itself is the fault; prefer a forward fix.

drop trigger if exists trg_allocation_within_grant on public.credit_spend_allocations;
drop function if exists public.enforce_allocation_within_grant();
