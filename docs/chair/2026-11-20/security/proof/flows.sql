-- flows.sql — the product's own paths, as the browser's roles, on a scratch chain. Each step
-- prints its outcome; the same file runs on the chain without and with EMERGENCY_REVOKE.sql.
\set ON_ERROR_STOP 0
\set ON_ERROR_ROLLBACK on
\pset format unaligned
\pset tuples_only on
\set u2 '''22222222-2222-2222-2222-222222222222'''
\set u1 '''11111111-1111-1111-1111-111111111111'''
create temp table ids(k text primary key, v text);
grant all on ids to anon, authenticated, service_role;
-- SAVE (authenticated user 2222: insert, update; RLS + every settlements trigger as the visitor)
begin; select set_config('test.uid', :u2, false) is null; select set_config('request.jwt.claim.role', 'authenticated', false) is null; set role authenticated;
insert into public.settlements (user_id, name, tier, data, config)
  values (:u2::uuid, 'Probe Town', 'town', '{"name":"Probe Town","tier":"town","population":900,"npcs":[]}'::jsonb, '{}'::jsonb)
  returning 'SAVE insert ok';
insert into ids select 'sid', id::text from public.settlements where name = 'Probe Town';
update public.settlements set name = 'Probe Town', data = data || '{"note":"edited"}' where id = (select v::uuid from ids where k='sid') returning 'SAVE update ok';
select 'SAVE read-own rows=' || count(*) from public.settlements;
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
-- SHARE (unlisted) as the owner, then the unlisted read as anon
begin; select set_config('request.jwt.claim.role', 'authenticated', false) is null; set role authenticated;
insert into ids select 'uslug', public.share_settlement_unlisted((select v::uuid from ids where k='sid'));
select 'SHARE unlisted slug present=' || (v is not null) from ids where k='uslug';
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
begin; select set_config('test.uid', '', false) is null; select set_config('request.jwt.claim.role', 'anon', false) is null; set role anon;
select 'SHARE anon get_unlisted_dossier name=' || coalesce(public.get_unlisted_dossier((select v from ids where k='uslug')) ->> 'name', '<null>');
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
-- PUBLISH as the owner; GALLERY reads as anon; one gallery vote/comment as another user
begin; select set_config('test.uid', :u2, false) is null; select set_config('request.jwt.claim.role', 'authenticated', false) is null; set role authenticated;
insert into ids select 'pslug', public.publish_settlement((select v::uuid from ids where k='sid'));
select 'PUBLISH slug present=' || (v is not null) from ids where k='pslug';
update public.settlements set gallery_importable = true where id = (select v::uuid from ids where k='sid') returning 'PUBLISH importable set';
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
begin; select set_config('test.uid', '', false) is null; select set_config('request.jwt.claim.role', 'anon', false) is null; set role anon;
select 'GALLERY anon list rows=' || count(*) from public.list_gallery_dossiers(0, 24, 'relevant', '', '{}'::jsonb, false);
select 'GALLERY anon dossier name=' || coalesce(name, '<null>') from public.get_gallery_dossier((select v from ids where k='pslug'));
select 'GALLERY anon more-by-creator rows=' || count(*) from public.list_gallery_more_by_creator((select v from ids where k='pslug'), 6);
select 'GALLERY anon bump_public_view ok' from (select public.bump_public_view((select v from ids where k='pslug'), 'probe-device')) x;
select 'GALLERY anon founders_roll rows=' || count(*) from public.founders_roll();
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
begin; select set_config('test.uid', :u1, false) is null; select set_config('request.jwt.claim.role', 'authenticated', false) is null; set role authenticated;
select 'GALLERY u1 vote=' || public.toggle_gallery_vote((select v::uuid from ids where k='sid'))::text;
select 'GALLERY u1 comment ok' from (select public.add_gallery_comment((select v::uuid from ids where k='sid'), 'A fine town.')) x;
select 'GALLERY u1 comments rows=' || count(*) from public.list_gallery_comments((select v::uuid from ids where k='sid'));
-- IMPORT as another user (1111)
select 'IMPORT u1 rows=' || count(*) || ' name=' || coalesce(max(name), '<none>') from public.import_gallery_dossier((select v from ids where k='pslug'));
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
-- MAPS: a saved map insert (its INVOKER trigger calls _gallery_world_snapshot_is_safe as the visitor)
begin; select set_config('test.uid', :u2, false) is null; select set_config('request.jwt.claim.role', 'authenticated', false) is null; set role authenticated;
insert into public.saved_maps (user_id, name, map_data) values (:u2::uuid, 'Probe Map', '{}'::jsonb) returning 'MAP insert ok';
insert into ids select 'mid', id::text from public.saved_maps where name = 'Probe Map';
select 'MAP publish slug present=' || (public.publish_map((select v::uuid from ids where k='mid')) is not null);
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
begin; select set_config('test.uid', '', false) is null; select set_config('request.jwt.claim.role', 'anon', false) is null; set role anon;
select 'MAP anon list rows=' || count(*) from public.list_gallery_maps(0, 24, 'relevant', '', '{}'::jsonb);
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
-- SELF-SERVICE doors as 2222
begin; select set_config('test.uid', :u2, false) is null; select set_config('request.jwt.claim.role', 'authenticated', false) is null; set role authenticated;
select 'SELF credit balance=' || public.get_credit_balance(:u2::uuid);
select 'SELF surveyor entitlement=' || public.has_surveyor_entitlement();
select 'SELF byok status ok' from (select public.surveyor_byok_status('anthropic')) x;
select 'SELF byok set again=' || public.surveyor_byok_set('anthropic', 'sk-FAKE-TEST-KEY-123');
select 'SELF premium access=' || public.current_user_has_premium_access();
select 'SELF my tickets rows=' || count(*) from public.list_my_tickets();
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
-- EDGE (service_role): the BYOK decrypt the ai-analyst function performs
begin; select set_config('test.uid', '', false) is null; select set_config('request.jwt.claim.role', 'service_role', false) is null; set role service_role;
select 'EDGE service byok_get=' || coalesce(public.surveyor_byok_get(:u2::uuid, 'anthropic')::text, '<null>');
select 'EDGE service usage_precheck ok' from (select public.surveyor_usage_precheck(:u2::uuid, 'anthropic', 'x')) x;
select 'EDGE service account_is_active=' || public.account_is_active(:u2::uuid);
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
