-- seed-victim.sql (REVIEW-GRANTS-1): real rows for the wide harness. VICTIM 2222 (premium, private identity) owns
-- private data marked VICTIMSECRET and public data marked PUBLICOK; ATTACKER 1111; ADMIN 3333; SUPPORT 4444.
-- Written through the product's own doors as the victim where one exists; the rest as the service.
\set ON_ERROR_STOP 1
\pset format unaligned
\pset tuples_only on
select set_config('app.settings.byok_secret', 'rg1-local-test-secret-not-real', false) is null;
insert into auth.users (id, email) values
 ('11111111-1111-1111-1111-111111111111','attacker@example.test'),
 ('22222222-2222-2222-2222-222222222222','victim-VICTIMSECRET@example.test'),
 ('33333333-3333-3333-3333-333333333333','admin@example.test'),
 ('44444444-4444-4444-4444-444444444444','support@example.test') on conflict do nothing;
update public.profiles set tier='premium', display_name='VICTIMSECRET Name', public_identity_opt_in=false where id='22222222-2222-2222-2222-222222222222';
update public.profiles set role='admin' where id='33333333-3333-3333-3333-333333333333';
update public.profiles set role='support' where id='44444444-4444-4444-4444-444444444444';
create table if not exists public._rg1_ids(k text primary key, v text);
-- as the victim
do $q$begin perform set_config('test.uid','22222222-2222-2222-2222-222222222222',false); perform set_config('request.jwt.claim.role','authenticated',false); end$q$;
set role authenticated;
insert into public.settlements (user_id, name, tier, data, config) values
 (auth.uid(), 'PUBLICOK Town', 'town', '{"name":"PUBLICOK Town","tier":"town","population":900,"npcs":[{"name":"PUBLICOK Ada","secrets":"VICTIMSECRET npc secret"}],"dmNotes":"VICTIMSECRET dm notes"}'::jsonb, '{}'::jsonb),
 (auth.uid(), 'VICTIMSECRET Private Town', 'town', '{"name":"VICTIMSECRET Private Town","tier":"town","population":500,"npcs":[]}'::jsonb, '{}'::jsonb),
 (auth.uid(), 'UNLISTEDOK Town', 'town', '{"name":"UNLISTEDOK Town","tier":"town","population":700,"npcs":[]}'::jsonb, '{}'::jsonb);
insert into public.saved_maps (user_id, name, map_data) values (auth.uid(), 'VICTIMSECRET Private Map', '{"secret":"VICTIMSECRET"}'::jsonb), (auth.uid(), 'PUBLICOK Map', '{}'::jsonb);
reset role;
insert into public._rg1_ids select 'pub_sid', id::text from public.settlements where name='PUBLICOK Town';
insert into public._rg1_ids select 'priv_sid', id::text from public.settlements where name='VICTIMSECRET Private Town';
insert into public._rg1_ids select 'unl_sid', id::text from public.settlements where name='UNLISTEDOK Town';
insert into public._rg1_ids select 'priv_mid', id::text from public.saved_maps where name='VICTIMSECRET Private Map';
insert into public._rg1_ids select 'pub_mid', id::text from public.saved_maps where name='PUBLICOK Map';
set role authenticated;
select public.publish_settlement((select v::uuid from public._rg1_ids where k='pub_sid')) is null;
update public.settlements set gallery_importable = true where id = (select v::uuid from public._rg1_ids where k='pub_sid');
select public.share_settlement_unlisted((select v::uuid from public._rg1_ids where k='unl_sid')) is null;
select public.publish_map((select v::uuid from public._rg1_ids where k='pub_mid')) is null;
select public.add_gallery_comment((select v::uuid from public._rg1_ids where k='pub_sid'), 'PUBLICOK victim comment') is null;
insert into public.support_messages (user_id, email, subject, message) values (auth.uid(), 'victim-VICTIMSECRET@example.test', 'VICTIMSECRET subject', 'VICTIMSECRET ticket body');
select public.set_my_security_answers('first_street','VICTIMSECRET elm','first_pet','VICTIMSECRET rex') is null;
reset role;
-- the attacker comments on the victim's town and reports it (so comment and report rows of both exist)
do $q$begin perform set_config('test.uid','11111111-1111-1111-1111-111111111111',false); end$q$;
set role authenticated;
select public.add_gallery_comment((select v::uuid from public._rg1_ids where k='pub_sid'), 'PUBLICOK attacker comment') is null;
select public.report_gallery_dossier((select v::uuid from public._rg1_ids where k='pub_sid'), 'other', 'PUBLICOK report') is null;
reset role;
do $q$begin perform set_config('test.uid','',false); perform set_config('request.jwt.claim.role','',false); end$q$;
insert into public._rg1_ids select 'tid', id::text from public.support_messages where subject='VICTIMSECRET subject';
insert into public.support_ticket_events (ticket_id, author_id, author_role, kind, visibility, body)
  select v::uuid, '44444444-4444-4444-4444-444444444444', 'support', 'user_reply', 'user', 'VICTIMSECRET user-visible reply' from public._rg1_ids where k='tid';
insert into public.support_ticket_events (ticket_id, author_id, author_role, kind, visibility, body)
  select v::uuid, '44444444-4444-4444-4444-444444444444', 'support', 'internal_note', 'internal', 'VICTIMSECRET internal note' from public._rg1_ids where k='tid';
insert into public.credit_ledger (user_id, kind, amount, source) values ('22222222-2222-2222-2222-222222222222', 'grant', 77, 'admin_grant');
select 'seeded settlements=' || (select count(*) from public.settlements) || ' maps=' || (select count(*) from public.saved_maps)
  || ' events=' || (select count(*) from public.support_ticket_events) || ' comments=' || (select count(*) from public.gallery_comments);
