-- preflight-plant.sql — CHECK_C_PREFLIGHT.sql must go red on visitor uses made by hand. Four plants, rolled back.
begin;
create policy plant_policy on public.settlements for select to authenticated using (public.has_role(auth.uid(), array['admin']));
create schema plant;
create function plant.invoker_caller(u uuid) returns jsonb language plpgsql as $f$ begin return public.handle_premium_downgrade(u); end $f$;
create table plant.t (id int, acct text default public.gen_account_number());
create view plant.v as select public.founder_transfer_enabled() as on_;
\i CHECK_C_PREFLIGHT.sql
rollback;
