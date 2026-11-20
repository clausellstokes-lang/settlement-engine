-- flows-review.sql (REVIEW-GRANTS-1): the product's visitor paths, as the browser's own roles, on a scratch chain.
-- Run unchanged before and after 213; every line prints an outcome or an ERROR. A path that reaches one of 213's 21
-- helpers AS THE VISITOR would show "permission denied for function" after 213 only.
\set ON_ERROR_STOP 0
\pset format unaligned
\pset tuples_only on
\set U1 'do $q$begin perform set_config(''test.uid'',''11111111-1111-1111-1111-111111111111'',false); perform set_config(''request.jwt.claim.role'',''authenticated'',false); end$q$; set role authenticated;'
\set U2 'do $q$begin perform set_config(''test.uid'',''22222222-2222-2222-2222-222222222222'',false); perform set_config(''request.jwt.claim.role'',''authenticated'',false); end$q$; set role authenticated;'
\set ANON 'do $q$begin perform set_config(''test.uid'','''',false); perform set_config(''request.jwt.claim.role'',''anon'',false); end$q$; set role anon;'
\set SVC 'do $q$begin perform set_config(''test.uid'','''',false); perform set_config(''request.jwt.claim.role'',''service_role'',false); end$q$; set role service_role;'
\set OUT 'reset role; do $q$begin perform set_config(''test.uid'','''',false); perform set_config(''request.jwt.claim.role'','''',false); end$q$;'
create table if not exists public._rg1_ids(k text primary key, v text);
grant all on public._rg1_ids to anon, authenticated, service_role;
-- SIGN-UP (GoTrue inserts auth.users; handle_new_user runs)
insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111','u1@example.test'),('22222222-2222-2222-2222-222222222222','u2@example.test') on conflict do nothing;
update public.profiles set tier = 'premium' where id = '22222222-2222-2222-2222-222222222222';  -- a purchase (the webhook, as the service)
select 'SIGNUP profiles=' || count(*) from public.profiles where id in ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222');
-- PROFILE EDIT (u2)
:U2
update public.profiles set display_name = 'Probe Writer' where id = auth.uid() returning 'PROFILE direct update ok';
update public.profiles set public_identity_opt_in = true where id = auth.uid() returning 'PROFILE opt-in ok';
update public.profiles set avatar_url = null where id = auth.uid() returning 'PROFILE avatar ok';
select 'PROFILE update_display_name ok' from (select public.update_display_name('Probe Writer')) x;
select 'PROFILE update_display_name blocked-word: ' || coalesce((select public.update_display_name('fuck you')::text), 'returned');
select 'PROFILE security answers ok' from (select public.set_my_security_answers('first_street','elm','first_pet','rex')) x;
select 'PROFILE security ids rows=' || count(*) from (select public.get_my_security_question_ids()) x;
select 'PROFILE email pref ok' from (select public.set_my_email_preference('22222222-2222-2222-2222-222222222222'::uuid, 'product_updates', false)) x;
select 'PROFILE email pref bad category: ' || coalesce((select public.set_my_email_preference('22222222-2222-2222-2222-222222222222'::uuid, 'nope', false)::text), 'returned');
select 'PROFILE email prefs ok' from (select public.get_my_email_preferences()) x;
select 'SESSION claim ok' from (select public.claim_current_session('probe')) x;
-- SAVE a town (insert, update, upsert) and a map
insert into public.settlements (user_id, name, tier, data, config) values (auth.uid(), 'Probe Town', 'town', '{"name":"Probe Town","tier":"town","population":900,"npcs":[{"name":"Ada"}]}'::jsonb, '{}'::jsonb) returning 'SAVE town insert ok';
insert into public._rg1_ids select 'sid', id::text from public.settlements where name = 'Probe Town';
update public.settlements set data = data || '{"note":"edited"}' where id = (select v::uuid from public._rg1_ids where k='sid') returning 'SAVE town update ok';
insert into public.settlements (id, user_id, name, tier, data, config) values ((select v::uuid from public._rg1_ids where k='sid'), auth.uid(), 'Probe Town', 'town', '{"name":"Probe Town","tier":"town","population":901,"npcs":[{"name":"Ada"}]}'::jsonb, '{}'::jsonb) on conflict (id) do update set data = excluded.data returning 'SAVE town upsert ok';
select 'SAVE batch ok' from (select public.mutate_settlement_batch(auth.uid(), '[]'::jsonb, '{}'::uuid[], '[]'::jsonb)) x;
insert into public.saved_maps (user_id, name, map_data) values (auth.uid(), 'Probe Map', '{}'::jsonb) returning 'MAP insert ok';
insert into public._rg1_ids select 'mid', id::text from public.saved_maps where name = 'Probe Map';
update public.saved_maps set name = 'Probe Map' where id = (select v::uuid from public._rg1_ids where k='mid') returning 'MAP update ok';
-- PUBLISH, SHARE BY LINK, ROTATE
insert into public._rg1_ids select 'pslug', public.publish_settlement((select v::uuid from public._rg1_ids where k='sid'));
select 'PUBLISH town slug present=' || (v is not null) from public._rg1_ids where k='pslug';
update public.settlements set gallery_importable = true where id = (select v::uuid from public._rg1_ids where k='sid') returning 'PUBLISH importable ok';
insert into public._rg1_ids select 'uslug', public.share_settlement_unlisted((select v::uuid from public._rg1_ids where k='sid'));
select 'SHARE town unlisted present=' || (v is not null) from public._rg1_ids where k='uslug';
select 'SHARE town rotate present=' || (public.rotate_settlement_unlisted_slug((select v::uuid from public._rg1_ids where k='sid')) is not null);
update public._rg1_ids set v = (select unlisted_slug from public.settlements where id = (select v::uuid from public._rg1_ids where k='sid')) where k='uslug';
insert into public._rg1_ids select 'mpslug', public.publish_map((select v::uuid from public._rg1_ids where k='mid'))::text;
select 'PUBLISH map present=' || (v is not null) from public._rg1_ids where k='mpslug';
insert into public._rg1_ids select 'muslug', public.share_map_unlisted((select v::uuid from public._rg1_ids where k='mid'))::text;
select 'SHARE map unlisted present=' || (v is not null) from public._rg1_ids where k='muslug';
select 'SHARE map rotate present=' || (public.rotate_map_unlisted_slug((select v::uuid from public._rg1_ids where k='mid')) is not null);
select 'MINE dossiers rows=' || count(*) from public.list_my_gallery_dossiers();
select 'MINE unlisted rows=' || count(*) from public.list_my_unlisted_dossiers();
select 'MINE unlisted maps rows=' || count(*) from public.list_my_unlisted_maps();
:OUT
-- THE GALLERY SIGNED OUT
:ANON
select 'ANON list dossiers rows=' || count(*) from public.list_gallery_dossiers(0, 24, 'relevant', '', '{}'::jsonb, false);
select 'ANON list maps rows=' || count(*) from public.list_gallery_maps();
select 'ANON curated rows=' || count(*) from public.list_curated_dossiers();
select 'ANON featured rows=' || count(*) from public.list_featured_dossiers();
select 'ANON featured maps rows=' || count(*) from public.list_featured_maps();
select 'ANON dossier name=' || coalesce(name, '<null>') from public.get_gallery_dossier((select v from public._rg1_ids where k='pslug'));
select 'ANON gallery map ok=' || (count(*) >= 0) from (select public.get_gallery_map((select public_slug from public.saved_maps where id = (select v::uuid from public._rg1_ids where k='mid')))) x;
select 'ANON unlisted dossier name=' || coalesce(public.get_unlisted_dossier((select v from public._rg1_ids where k='uslug')) ->> 'name', '<null>');
select 'ANON unlisted map ok=' || (count(*) >= 0) from (select public.get_unlisted_map((select unlisted_slug from public.saved_maps where id = (select v::uuid from public._rg1_ids where k='mid')))) x;
select 'ANON more-by-creator rows=' || count(*) from public.list_gallery_more_by_creator((select v from public._rg1_ids where k='pslug'), 6);
select 'ANON bump view ok' from (select public.bump_public_view((select v from public._rg1_ids where k='pslug'), 'probe-device')) x;
select 'ANON founders_roll rows=' || count(*) from public.founders_roll();
select 'ANON seats taken ok' from (select public.founder_seats_taken()) x;
select 'ANON seats public rows=' || count(*) from public.list_founder_seats_public();
select 'ANON comments rows=' || count(*) from public.list_gallery_comments((select v::uuid from public._rg1_ids where k='sid'));
select 'ANON vote state ok' from (select public.get_gallery_vote_state((select v::uuid from public._rg1_ids where k='sid'))) x;
select 'ANON reaction state ok' from (select public.get_gallery_reaction_state((select v::uuid from public._rg1_ids where k='sid'))) x;
select 'ANON ai pricing ok' from (select public.get_ai_pricing()) x;
:OUT
-- ANOTHER USER: vote, reaction, comment, report, import
:U1
select 'U1 vote=' || public.toggle_gallery_vote((select v::uuid from public._rg1_ids where k='sid'))::text;
select 'U1 reaction ok' from (select public.toggle_gallery_reaction((select v::uuid from public._rg1_ids where k='sid'), 'worth_walking')) x;
select 'U1 comment ok' from (select public.add_gallery_comment((select v::uuid from public._rg1_ids where k='sid'), 'A fine town.')) x;
select 'U1 comment blocked-word: ' || coalesce((select public.add_gallery_comment((select v::uuid from public._rg1_ids where k='sid'), 'fuck this')::text), 'returned');
insert into public._rg1_ids select 'cid', id::text from public.gallery_comments where body = 'A fine town.' limit 1;
select 'U1 report dossier ok' from (select public.report_gallery_dossier((select v::uuid from public._rg1_ids where k='sid'), 'other', 'probe')) x;
select 'U1 report comment ok' from (select public.report_gallery_comment((select v::uuid from public._rg1_ids where k='cid'), 'other', 'probe')) x;
select 'U1 import rows=' || count(*) from public.import_gallery_dossier((select v from public._rg1_ids where k='pslug'));
:OUT
-- SUPPORT TICKET and its THREAD
:U2
insert into public.support_messages (user_id, email, subject, message) values (auth.uid(), 'u2@example.test', 'Feedback', 'hello') returning 'TICKET insert numbered=' || (ticket_number is not null);
insert into public._rg1_ids select 'tid', id::text from public.support_messages where subject = 'Feedback' limit 1;
select 'TICKET my tickets rows=' || count(*) from public.list_my_tickets();
select 'TICKET owner thread rows=' || count(*) from public.list_ticket_thread((select v::uuid from public._rg1_ids where k='tid'));
:OUT
:U1
select 'TICKET other user thread rows=' || count(*) from public.list_ticket_thread((select v::uuid from public._rg1_ids where k='tid'));
:OUT
:ANON
select 'TICKET anon thread rows=' || count(*) from public.list_ticket_thread((select v::uuid from public._rg1_ids where k='tid'));
:OUT
-- SELF-SERVICE (u2) and the EDGE (service_role)
:U2
select 'SELF credit balance=' || public.get_credit_balance(auth.uid());
select 'SELF credit other user: ' || public.get_credit_balance('11111111-1111-1111-1111-111111111111'::uuid);
select 'SELF welcome ok' from (select public.welcome_credit_available(auth.uid())) x;
select 'SELF surveyor entitlement=' || public.has_surveyor_entitlement();
select 'SELF byok set=' || public.surveyor_byok_set('anthropic', 'sk-FAKE-TEST-KEY-123');
select 'SELF byok status ok' from (select public.surveyor_byok_status('anthropic')) x;
:OUT
:SVC
select 'EDGE service byok_get present=' || (public.surveyor_byok_get('22222222-2222-2222-2222-222222222222'::uuid, 'anthropic') is not null);
select 'EDGE service credit balance=' || public.get_credit_balance('22222222-2222-2222-2222-222222222222'::uuid);
select 'EDGE service civility_blocked=' || public.civility_blocked('fuck');
:OUT
select 'CRON (no role) credit balance=' || public.get_credit_balance('22222222-2222-2222-2222-222222222222'::uuid);
-- UNPUBLISH, DELETE (u2)
:U2
select 'UNPUBLISH ok' from (select public.unpublish_settlement((select v::uuid from public._rg1_ids where k='sid'))) x;
delete from public.saved_maps where id = (select v::uuid from public._rg1_ids where k='mid') returning 'MAP delete ok';
delete from public.settlements where id = (select v::uuid from public._rg1_ids where k='sid') returning 'SAVE delete ok';
insert into public.deletion_requests (user_id, email) values (auth.uid(), 'u2@example.test') returning 'DELETION request ok';
:OUT
