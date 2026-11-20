-- ticket.sql — list_ticket_thread on a chain that HOLDS a ticket (SEC-GRANTS-2): user 2222's ticket with one user-visible
-- reply and one internal note; called as anon, as the owner, as another signed-in user, as a support agent. Rolled back.
\set ON_ERROR_STOP 0
\set ON_ERROR_ROLLBACK on
\pset format unaligned
\pset tuples_only on
begin;
insert into public.support_messages (id, user_id, email, subject, message) values ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'probe@example.test', 'probe', 'probe body');
insert into public.support_ticket_events (ticket_id, author_id, author_role, kind, visibility, body) values
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'user', 'user_reply', 'user', 'PRIVATE THREAD TEXT'),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'support', 'internal_note', 'internal', 'INTERNAL NOTE');
select set_config('request.jwt.claim.role', 'anon', true) is null, set_config('test.uid', '', true) is null;
set local role anon;
select 'anon list_ticket_thread -> rows=' || count(*) || ' ' || coalesce(string_agg(body, ',' order by body), '') from public.list_ticket_thread('44444444-4444-4444-4444-444444444444');
reset role;
select set_config('request.jwt.claim.role', 'authenticated', true) is null, set_config('test.uid', '22222222-2222-2222-2222-222222222222', true) is null;
set local role authenticated;
select 'owner(2222) list_ticket_thread -> rows=' || count(*) || ' ' || coalesce(string_agg(body, ',' order by body), '') from public.list_ticket_thread('44444444-4444-4444-4444-444444444444');
reset role;
select set_config('test.uid', '11111111-1111-1111-1111-111111111111', true) is null;
set local role authenticated;
select 'other(1111) list_ticket_thread -> rows=' || count(*) from public.list_ticket_thread('44444444-4444-4444-4444-444444444444');
reset role;
update public.profiles set role = 'support' where id = '11111111-1111-1111-1111-111111111111';
set local role authenticated;
select 'support agent(1111) list_ticket_thread -> rows=' || count(*) || ' ' || coalesce(string_agg(body, ',' order by body), '') from public.list_ticket_thread('44444444-4444-4444-4444-444444444444');
reset role;
rollback;
