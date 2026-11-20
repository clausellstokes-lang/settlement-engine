-- actor.sql — the chair's VEIL-DOORS class on chain 001..203: an outsider (anon) names an admin's uuid as p_actor.
-- Test-only: user 1111 is made 'admin' inside the transaction; everything is rolled back.
\set ON_ERROR_STOP 0
\set ON_ERROR_ROLLBACK on
\pset format unaligned
\pset tuples_only on
begin;
update public.profiles set role = 'admin' where id = '11111111-1111-1111-1111-111111111111';
insert into public.settlements (id, user_id, name, tier, data) values ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Victim Town', 'town', '{}'::jsonb);
select set_config('request.jwt.claim.role', 'anon', true) is null, set_config('test.uid', '', true) is null;
set local role anon;
select 'anon admin_soft_delete_settlement(actor=admin) -> ' || coalesce(public.admin_soft_delete_settlement('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', true, 'probe')::text, 'ok');
select 'anon admin_set_content_banned(actor=admin) -> ' || coalesce(public.admin_set_content_banned('11111111-1111-1111-1111-111111111111', 'settlement', '33333333-3333-3333-3333-333333333333', true, 'probe')::text, 'ok');
select 'anon set_account_disabled(actor=admin, target=2222) -> ' || coalesce(public.set_account_disabled('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', true, 'probe')::text, 'ok');
select 'anon admin_billing_summary(actor=admin, target=2222) -> ' || coalesce(left(public.admin_billing_summary('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222')::text, 80), 'null');
select 'anon handle_premium_downgrade(2222) -> ' || coalesce(public.handle_premium_downgrade('22222222-2222-2222-2222-222222222222')::text, 'ok');
reset role;
select 'after anon calls: victim settlement admin_deleted_at set=' || (admin_deleted_at is not null) || ', profile 2222 tier=' || (select tier from public.profiles where id = '22222222-2222-2222-2222-222222222222') from public.settlements where id = '33333333-3333-3333-3333-333333333333';
rollback;
