-- R4-CURE 1 (VEIL-22): does a cached plan serve ONE salt to every read? Constant arguments, a prepared statement, two
-- executions; two calls in one statement; the declared volatility of every function in the chain that draws or carries
-- the salt, and of the read functions that call _gallery_veil.
\pset footer off
select p.proname, case p.provolatile when 'i' then 'IMMUTABLE' when 's' then 'STABLE' else 'VOLATILE' end as volatility, l.lanname, p.prosecdef as definer
  from pg_proc p join pg_language l on l.oid = p.prolang join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and (p.proname in ('_gallery_veil', 'get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map')
        or p.proname like '\_gallery\_veil\_rekey%' or p.proname = '_gallery_veil_holders')
 order by 1;
select p.proname as draws_gen_random_uuid from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.prosrc ilike '%gen_random_uuid%' and p.proname like '%gallery%';
-- the constants: one person, one tie; unmarked (no veil record) and marked (the served version 2 marker)
prepare q_unmarked as select public._gallery_veil('{"npcs":[{"id":"npc_a","name":"Ada","role":"Smith"},{"id":"npc_b","name":"Bo","role":"Miller"}],"relationships":[{"id":"tie_npc_a_npc_b","from":"npc_a","to":"npc_b","type":"friend"}]}'::jsonb, '{}'::jsonb, false) -> 'body' -> 'npcs' -> 0 ->> 'id' as k;
prepare q_marked as select public._gallery_veil('{"npcs":[{"id":"npc_a","name":"Ada","role":"Smith"},{"id":"npc_b","name":"Bo","role":"Miller"}],"relationships":[{"id":"tie_npc_a_npc_b","from":"npc_a","to":"npc_b","type":"friend"}]}'::jsonb, '{"$veil":{"v":1,"mode":"curated","deltas":[]}}'::jsonb, false) -> 'body' -> 'npcs' -> 0 ->> 'id' as k;
\echo == the prepared statement, unmarked: EXPLAIN VERBOSE (is the call folded to a constant at planning?)
explain (verbose, costs off) execute q_unmarked;
\echo == unmarked: eight executions of one prepared statement (a generic plan after five), then one under force_generic_plan
execute q_unmarked; execute q_unmarked; execute q_unmarked; execute q_unmarked; execute q_unmarked; execute q_unmarked; execute q_unmarked; execute q_unmarked;
set plan_cache_mode = force_generic_plan; execute q_unmarked; reset plan_cache_mode;
\echo == marked: eight executions, then one under force_generic_plan
execute q_marked; execute q_marked; execute q_marked; execute q_marked; execute q_marked; execute q_marked; execute q_marked; execute q_marked;
set plan_cache_mode = force_generic_plan; execute q_marked; reset plan_cache_mode;
\echo == plan_cache_mode = force_generic_plan (as any parameter-less statement is), unmarked, two executions
set plan_cache_mode = force_generic_plan;
execute q_unmarked;
execute q_unmarked;
reset plan_cache_mode;
\echo == two reads in one statement (unmarked; marked)
select public._gallery_veil('{"npcs":[{"id":"npc_a","name":"Ada","role":"Smith"}]}'::jsonb, '{}'::jsonb, false) -> 'body' -> 'npcs' -> 0 ->> 'id' as one,
       public._gallery_veil('{"npcs":[{"id":"npc_a","name":"Ada","role":"Smith"}]}'::jsonb, '{}'::jsonb, false) -> 'body' -> 'npcs' -> 0 ->> 'id' as two;
\echo == the same constant call over two rows of one statement
select g, public._gallery_veil('{"npcs":[{"id":"npc_a","name":"Ada","role":"Smith"}]}'::jsonb, '{}'::jsonb, false) -> 'body' -> 'npcs' -> 0 ->> 'id' as k from generate_series(1, 2) g;
\echo == the read functions as the page calls them (a stored share, marked and unmarked): a prepared statement, eight executions and one under force_generic_plan
delete from public.saved_maps where public_slug like 'rcsalt-%';
delete from public.settlements where public_slug like 'rcsalt-%';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
values ('5a170000-0000-0000-0000-0000000000a1','11111111-1111-1111-1111-111111111111','Saltby','village','{"name":"Saltby","tier":"village","npcs":[{"id":"npc_a","name":"Ada","role":"Smith"},{"id":"npc_b","name":"Bo","role":"Miller"}]}'::jsonb,true,'rcsalt-u',now(),'rcsalt-u-link','unlisted','{}'::jsonb,false,true),
       ('5a170000-0000-0000-0000-0000000000a2','11111111-1111-1111-1111-111111111111','Saltby','village','{"name":"Saltby","tier":"village","npcs":[{"id":"npc_a","name":"Ada","role":"Smith"},{"id":"npc_b","name":"Bo","role":"Miller"}]}'::jsonb,true,'rcsalt-m',now(),'rcsalt-m-link','unlisted','{"$veil":{"v":1,"mode":"curated","deltas":[]}}'::jsonb,false,true);
insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'm', '{"campaign":{"settlementIds":["5a170000-0000-0000-0000-0000000000a1"]}}', true, 'rcsalt-map', 'rcsalt-mapl', 'unlisted', 'map_with_campaign', true, true);
set test.uid = '';
prepare r_gal_u as select g.data #>> '{npcs,0,id}' as k from public.get_gallery_dossier('rcsalt-u') g;
prepare r_gal_m as select g.data #>> '{npcs,0,id}' as k from public.get_gallery_dossier('rcsalt-m') g;
prepare r_link_m as select public.get_unlisted_dossier('rcsalt-m-link') #>> '{dossier,npcs,0,id}' as k;
prepare r_map as select public.get_gallery_map('rcsalt-map') #>> '{members,0,settlement,npcs,0,id}' as k;
execute r_gal_u; execute r_gal_u; execute r_gal_u; execute r_gal_u; execute r_gal_u; execute r_gal_u; execute r_gal_u; execute r_gal_u;
set plan_cache_mode = force_generic_plan; execute r_gal_u; reset plan_cache_mode;
execute r_gal_m; execute r_gal_m; execute r_gal_m; execute r_gal_m; execute r_gal_m; execute r_gal_m; execute r_gal_m; execute r_gal_m;
set plan_cache_mode = force_generic_plan; execute r_gal_m; reset plan_cache_mode;
execute r_link_m; execute r_link_m; execute r_link_m; execute r_link_m; execute r_link_m; execute r_link_m; execute r_link_m; execute r_link_m;
set plan_cache_mode = force_generic_plan; execute r_link_m; reset plan_cache_mode;
execute r_map; execute r_map; execute r_map; execute r_map; execute r_map; execute r_map; execute r_map; execute r_map;
set plan_cache_mode = force_generic_plan; execute r_map; reset plan_cache_mode;
set test.uid = '22222222-2222-2222-2222-222222222222';
prepare r_imp_m as select g.data #>> '{npcs,0,id}' as k from public.import_gallery_dossier('rcsalt-m') g;
execute r_imp_m; execute r_imp_m; execute r_imp_m; execute r_imp_m; execute r_imp_m; execute r_imp_m; execute r_imp_m; execute r_imp_m;
set plan_cache_mode = force_generic_plan; execute r_imp_m; reset plan_cache_mode;
set test.uid = '';
