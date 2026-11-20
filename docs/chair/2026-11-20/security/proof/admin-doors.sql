-- admin-doors.sql — set_curated / set_featured / set_featured_map on a chain that HOLDS a public town and map:
-- as anon, as a plain signed-in user (1111), as a developer (2222, made developer inside the transaction). Rolled back.
\set ON_ERROR_STOP 0
\set ON_ERROR_ROLLBACK on
\pset format unaligned
\pset tuples_only on
select id as sid from public.settlements where name = 'Probe Town' \gset
select id as mid from public.saved_maps where name = 'Probe Map' \gset
begin;
update public.profiles set role = 'developer' where id = '22222222-2222-2222-2222-222222222222';
select set_config('request.jwt.claim.role', 'anon', true) is null, set_config('test.uid', '', true) is null;
set local role anon;
select 'anon set_curated -> ' || coalesce(public.set_curated(:'sid'::uuid, true, 1)::text, 'ok');
select 'anon set_featured -> ' || coalesce(public.set_featured(:'sid'::uuid, true, 1)::text, 'ok');
select 'anon set_featured_map -> ' || coalesce(public.set_featured_map(:'mid'::uuid, true, 1)::text, 'ok');
reset role;
select 'after anon: town curated=' || is_curated || ' featured=' || is_featured from public.settlements where name = 'Probe Town';
select 'after anon: map featured=' || is_featured from public.saved_maps where name = 'Probe Map';
select set_config('request.jwt.claim.role', 'authenticated', true) is null, set_config('test.uid', '11111111-1111-1111-1111-111111111111', true) is null;
set local role authenticated;
select 'plain user set_curated -> ' || coalesce(public.set_curated(:'sid'::uuid, true, 1)::text, 'ok');
reset role;
select set_config('test.uid', '22222222-2222-2222-2222-222222222222', true) is null;
set local role authenticated;
select 'developer set_curated -> ' || coalesce(public.set_curated(:'sid'::uuid, true, 1)::text, 'ok');
select 'developer set_featured_map -> ' || coalesce(public.set_featured_map(:'mid'::uuid, true, 1)::text, 'ok');
reset role;
select 'after developer: town curated=' || is_curated || ', map featured=' || (select is_featured from public.saved_maps where name = 'Probe Map') from public.settlements where name = 'Probe Town';
rollback;
