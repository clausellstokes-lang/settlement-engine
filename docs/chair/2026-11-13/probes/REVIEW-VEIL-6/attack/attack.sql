-- REVIEW-VEIL-6 — THE ATTACK, cold. Run on a CLONE of a database a cold run left behind (its shares carry my
-- markers `vq6n<n>z` in every field hidden by hand, every eye shut):  psql -d <clone> -f attack.sql
-- Every statement is made as a non-owner: role `anon`, or role `authenticated` with the READER's id. A line of
-- output beginning `LEAK` or `OPEN` is a finding; `ok` is the expected refusal or the expected silence.
-- The scratch chain grants no table rights to the two reader roles; a hosted Supabase project does (row security is
-- the guard there), so the clone is first given those grants, to test the policies and not the absence of a grant.
\set ON_ERROR_STOP off
\set QUIET on
\pset tuples_only on
\pset format unaligned
\set reader '22222222-2222-2222-2222-222222222222'
\set owner '11111111-1111-1111-1111-111111111111'
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
select set_config('test.uid', '', false);

\echo == A. the tables, under row security
set role anon;
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'anon: rows of settlements visible: ' || count(*) from public.settlements;
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'anon: rows of saved_maps visible: ' || count(*) from public.saved_maps;
reset role;
select set_config('test.uid', :'reader', false);
set role authenticated;
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'reader: rows of settlements visible: ' || count(*) from public.settlements;
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'reader: rows of saved_maps visible: ' || count(*) from public.saved_maps;
update public.settlements set gallery_member_overrides = '{}'::jsonb where true;
select 'ok   reader: update of every settlement''s overrides: see the row count above (UPDATE 0 expected)';
reset role;
select set_config('test.uid', '', false);
-- every table and view either role can read: does any row carry a marker?
do $$
declare r record; n bigint; who text;
begin
  for who in select unnest(array['anon', 'authenticated']) loop
    for r in select c.oid::regclass as t from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
              where ns.nspname = 'public' and c.relkind in ('r', 'v', 'm') order by 1 loop
      begin
        perform set_config('test.uid', case when who = 'authenticated' then '22222222-2222-2222-2222-222222222222' else '' end, true);
        execute format('set local role %I', who);
        execute format('select count(*) from %s x where x::text ~ ''vq6n[0-9]+z''', r.t) into n;
        reset role;
        if n > 0 then raise notice 'LEAK % reads % row(s) of % carrying a marker', who, n, r.t; end if;
      exception when others then reset role; raise notice 'note % on %: %', who, r.t, left(sqlerrm, 80);
      end;
    end loop;
  end loop;
  raise notice 'ok   table scan done (a LEAK line above is a finding)';
end $$;

\echo == B. the helper functions, called directly
select case when bool_or(has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute') or has_function_privilege('public', p.oid, 'execute'))
  then 'OPEN ' else 'ok   ' end || count(*) || ' _gallery_veil helpers; callable by a reader role: ' ||
  coalesce(string_agg(p.proname, ' ') filter (where has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute')), '(none)')
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname like '\_gallery\_veil%';
set role anon;
select 'OPEN anon called _gallery_veil_apply: ' || left(public._gallery_veil_apply('{}'::jsonb, '{}'::jsonb)::text, 40);
select 'OPEN anon called _gallery_veil_second_homes: ' || left(public._gallery_veil_second_homes('{}'::jsonb, '{}'::jsonb, '[]'::jsonb)::text, 40);
select 'OPEN anon called _gallery_veil_sources: ' || left(public._gallery_veil_sources('{}'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb)::text, 40);
select 'OPEN anon called _gallery_veil_roster_splice: ' || left(public._gallery_veil_roster_splice('{}'::jsonb, '{}'::jsonb, true, true, false)::text, 40);
select 'OPEN anon called _gallery_veil_member_revealed: ' || public._gallery_veil_member_revealed('{}'::jsonb, '{}'::jsonb, true, true, false)::text;
select 'OPEN anon called _gallery_veil_pieces: ' || left(public._gallery_veil_pieces('"x"'::jsonb)::text, 40);
select 'OPEN anon called _gallery_veil_embeds: ' || public._gallery_veil_embeds('"x"'::jsonb, array['x'])::text;
-- the older helpers a reader role MAY call (they read only their arguments): can they be made to read a stored row?
select 'note anon may call _gallery_apply_member_overrides on its own arguments: ' ||
  coalesce(left(public._gallery_apply_member_overrides('{"npcs":[]}'::jsonb, '{"npcs":[]}'::jsonb, '{}'::jsonb, true, true, false)::text, 60), 'null');
select 'note anon may call _gallery_sanitize_public_json on its own arguments: ' || left(public._gallery_sanitize_public_json('{"a":1,"secret":"x"}'::jsonb, '{}'::text[])::text, 60);
reset role;

\echo == C. arguments out of range
set role anon;
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'get_gallery_dossier(null): ' || count(*) from public.get_gallery_dossier(null);
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'get_gallery_dossier(''''): ' || count(*) from public.get_gallery_dossier('');
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'get_gallery_dossier(''%''): ' || count(*) from public.get_gallery_dossier('%');
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'get_gallery_dossier(''_____''): ' || count(*) from public.get_gallery_dossier('______');
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'get_gallery_dossier(1 MB of text): ' || count(*) from public.get_gallery_dossier(repeat('a', 1000000));
select case when public.get_unlisted_dossier(null) is null then 'ok   ' else 'LEAK ' end || 'get_unlisted_dossier(null)';
select case when public.get_unlisted_dossier('') is null then 'ok   ' else 'LEAK ' end || 'get_unlisted_dossier('''')';
select case when public.get_unlisted_dossier('%') is null then 'ok   ' else 'LEAK ' end || 'get_unlisted_dossier(''%'')';
select case when public.get_gallery_map(null) is null and public.get_gallery_map('%') is null and public.get_unlisted_map(null) is null and public.get_unlisted_map('%') is null then 'ok   ' else 'LEAK ' end || 'the two map reads on null and %';
reset role;
-- one slug kind given to the other read
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'a party link''s slug given to the gallery read answers: ' || count(*)
  from public.settlements s, lateral public.get_gallery_dossier(s.unlisted_slug) g;
select case when count(*) filter (where public.get_unlisted_dossier(s.public_slug) is not null) = 0 then 'ok   ' else 'LEAK ' end || 'a gallery slug given to the party link read answers: ' ||
  count(*) filter (where public.get_unlisted_dossier(s.public_slug) is not null) from public.settlements s;
select case when count(*) filter (where public.get_gallery_map(s.public_slug) is not null or public.get_unlisted_map(s.unlisted_slug) is not null) = 0 then 'ok   ' else 'LEAK ' end || 'a town''s slug given to a map read answers: ' ||
  count(*) filter (where public.get_gallery_map(s.public_slug) is not null or public.get_unlisted_map(s.unlisted_slug) is not null) from public.settlements s;
-- the lists as an oracle: a search for a hidden string must not find the town that hides it
set role anon;
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'list_gallery_dossiers searched for a marker finds: ' || count(*) from public.list_gallery_dossiers(0, 60, 'newest', 'vq6n', '{}'::jsonb, false);
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'list_gallery_dossiers searched for "note" finds: ' || count(*) from public.list_gallery_dossiers(0, 60, 'relevant', 'Dossier note', '{}'::jsonb, false);
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'list_gallery_maps searched for a marker finds: ' || count(*) from public.list_gallery_maps(0, 60, 'newest', 'vq6n', '{}'::jsonb);
select 'note list_gallery_dossiers(page -5, size 2000000000) rows: ' || count(*) from public.list_gallery_dossiers(-5, 2000000000, 'newest', null, '{}'::jsonb, false);
select 'note list_gallery_dossiers(a sort key of 100,000 characters) rows: ' || count(*) from public.list_gallery_dossiers(0, 60, repeat('x', 100000), null, '{}'::jsonb, false);
-- filters of the wrong shape raise (`cannot get array length of a non-array`): an error, no row
select 'note list_gallery_dossiers(filters of the wrong shape) rows: ' || count(*) from public.list_gallery_dossiers(0, 60, 'newest', null, '{"tier": {"a": [[[[1]]]]}, "prosperity": "x"}'::jsonb, false);
select 'note list_gallery_more_by_creator(limit 2000000000) rows: ' || count(*) from (select public_slug from public._gallery_public_tile_rows() limit 1) t, lateral public.list_gallery_more_by_creator(t.public_slug, 2000000000) m;
reset role;

\echo == D. ids that belong to another
set role anon;
select 'note get_gallery_vote_state / reaction_state / comments on a known id answer without data of the town: ' ||
  (select count(*) from public.settlements) || ' rows visible to anon (0 expected)';
reset role;
-- a reader makes a map of their own that names the owner's towns as its members, and reads it back
select set_config('test.uid', :'reader', false);
insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable, visibility, unlisted_slug, published_at)
select '99999999-0000-0000-0000-000000000001', :'reader', 'thief', jsonb_build_object('campaign', jsonb_build_object('settlementIds', (select jsonb_agg(id) from public.settlements))),
       true, 'thiefmap', 'map_with_campaign', true, true, 'unlisted', 'thieflink', now();
select case when coalesce(jsonb_array_length(public.get_gallery_map('thiefmap') -> 'members'), 0) = 0 then 'ok   ' else 'LEAK ' end ||
  'a reader''s own map naming the owner''s towns: members sent by get_gallery_map: ' || coalesce(jsonb_array_length(public.get_gallery_map('thiefmap') -> 'members'), 0);
select case when coalesce(jsonb_array_length(public.get_unlisted_map('thieflink') -> 'members'), 0) = 0 then 'ok   ' else 'LEAK ' end ||
  '… by get_unlisted_map: ' || coalesce(jsonb_array_length(public.get_unlisted_map('thieflink') -> 'members'), 0);
select case when count(*) filter (where x::text ~ 'vq6n[0-9]+z') = 0 then 'ok   ' else 'LEAK ' end || '… by import_gallery_map: rows ' || count(*) || ', with a marker ' || count(*) filter (where x::text ~ 'vq6n[0-9]+z')
  from (select to_jsonb(m) x from public.import_gallery_map('thiefmap') m) q;
-- a share that is not importable; a person whose card is not importable
select set_config('test.uid', '', false);
update public.settlements set gallery_importable = false where public_slug = (select min(public_slug) from public.settlements where gallery_share_dm);
select set_config('test.uid', :'reader', false);
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'import of a share that is not importable sends rows: ' || count(*)
  from public.import_gallery_dossier((select min(public_slug) from public.settlements where gallery_share_dm));
select set_config('test.uid', '', false);
update public.settlements set gallery_importable = true where true;

\echo == E. a stale share
create temp table rv6_stale as select id, public_slug, unlisted_slug from public.settlements where gallery_share_dm order by public_slug limit 3;
update public.settlements s set is_public = false, public_slug = null, published_at = null where id = (select id from rv6_stale order by public_slug limit 1);
update public.settlements s set unlisted_slug = null, visibility = case when is_public then 'public' else 'private' end where id = (select id from rv6_stale order by public_slug offset 1 limit 1);
-- the admin's own soft delete (it sets the flag and unpublishes); the party link has its own admin revoke
select public.admin_soft_delete_settlement(:'owner', (select id from rv6_stale order by public_slug offset 2 limit 1), true, 'rv6');
grant select on rv6_stale to anon, authenticated;
set role anon;
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'an unpublished share''s old gallery slug answers: ' || count(*) from rv6_stale t, lateral public.get_gallery_dossier(t.public_slug) g where t.public_slug = (select min(public_slug) from rv6_stale);
select case when count(*) filter (where public.get_unlisted_dossier(t.unlisted_slug) is not null) = 0 then 'ok   ' else 'LEAK ' end || 'a revoked link answers: ' || count(*) filter (where public.get_unlisted_dossier(t.unlisted_slug) is not null)
  from (select * from rv6_stale order by public_slug offset 1 limit 1) t;
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'a share removed by an admin: its gallery slug answers: ' || count(*) from (select * from rv6_stale order by public_slug offset 2 limit 1) t, lateral public.get_gallery_dossier(t.public_slug) g;
select case when count(*) filter (where public.get_unlisted_dossier(t.unlisted_slug) is not null) = 0 then 'ok   ' else 'note ' end || 'a share removed by an admin: its party link answers: ' || count(*) filter (where public.get_unlisted_dossier(t.unlisted_slug) is not null)
  from (select * from rv6_stale order by public_slug offset 2 limit 1) t;
reset role;
select set_config('test.uid', :'reader', false);
select case when count(*) = 0 then 'ok   ' else 'LEAK ' end || 'import of an unpublished share sends rows: ' || count(*) from rv6_stale t, lateral public.import_gallery_dossier(t.public_slug) g where t.public_slug = (select min(public_slug) from rv6_stale);
select set_config('test.uid', '', false);
