-- REVIEW-VEIL-5, by hand: on a Reveal-DM share, the keys the client's FULL mode never shows (publicSafe.js ::
-- toPublicSafe, the `if (full)` block): are they in the response? One row per key, per read.
\set owner '11111111-1111-1111-1111-111111111111'
delete from public.settlements where public_slug like 'rv5full%';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
select gen_random_uuid(), :'owner', 'Fulltown', 'town',
  '{"name":"Fulltown","tier":"town","npcs":[{"id":"npc_1","name":"Ada","role":"reeve","secret":"s","dmNotes":"RV5N_npc_dmNotes","notes":"RV5N_npc_notes"}],
    "dossierNotes":"RV5N_dossierNotes","dmNotes":"RV5N_dmNotes","notes":"RV5N_notes","narrativeNotes":"RV5N_narrativeNotes","tabNotes":{"power":"RV5N_tabNotes"},
    "dmLayer":{"x":"RV5N_dmLayer"},"decrees":[{"t":"RV5N_decrees"}],"_seed":"RV5N_seed","_regenSeed":"RV5N_regenSeed","_config":{"k":"RV5N_config"},
    "customContentRoster":[{"id":"RV5N_customContentRoster"}],"customContentProvenance":[{"id":"RV5N_customContentProvenance"}],
    "config":{"latentPantheon":"RV5N_latentPantheon","_seed":"RV5N_configSeed","culture":"x"},"aiData":{"x":"RV5N_aiData"},"aiDailyLife":"RV5N_aiDailyLife",
    "mapEdits":{"x":"RV5N_mapEdits"},"migrationReports":[{"unmapped":"RV5N_migrationReports"}],"institutions":[{"name":"Hall","notes":"RV5N_inst_notes","dmNotes":"RV5N_inst_dmNotes"}]}'::jsonb,
  true, 'rv5full-' || k, now(), 'rv5fulll-' || k, 'unlisted', ov::jsonb, true, true
from (values ('unmarked', '{}'), ('marked', '{"$veil":{"v":1,"deltas":[]}}')) v(k, ov);
select set_config('test.uid', '', false);
select s.public_slug, 'gallery sends: ' || coalesce((select string_agg(distinct m[1], ' ' order by m[1]) from regexp_matches(g.data::text, 'RV5N_([A-Za-z_]+)', 'g') m), '(none)')
  from public.settlements s, lateral public.get_gallery_dossier(s.public_slug) g where s.public_slug like 'rv5full%' order by 1;
select s.unlisted_slug, 'link sends: ' || coalesce((select string_agg(distinct m[1], ' ' order by m[1]) from regexp_matches(public.get_unlisted_dossier(s.unlisted_slug)::text, 'RV5N_([A-Za-z_]+)', 'g') m), '(none)')
  from public.settlements s where s.public_slug like 'rv5full%' order by 1;
select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false);
select s.public_slug, 'import sends: ' || coalesce((select string_agg(distinct m[1], ' ' order by m[1]) from regexp_matches(g.data::text, 'RV5N_([A-Za-z_]+)', 'g') m), '(none)')
  from public.settlements s, lateral public.import_gallery_dossier(s.public_slug) g where s.public_slug like 'rv5full%' order by 1;
