select set_config('test.uid', '', false);
select rv.mk('r4o9000', '{"name":"T","npcs":[{"name":"A"}],"deep":' || repeat('{"a":', 9000) || '{"theHook":"x"}' || repeat('}', 9000) || ',"lore":{"aHook":"z"}}', '{"$veil":{"v":1,"deltas":[]}}', true);
select rv.mk('r4a9000', '{"name":"T","npcs":[{"name":"A"}],"deep":' || repeat('[', 9000) || '{"theHook":"x"}' || repeat(']', 9000) || ',"lore":{"aHook":"z"}}', '{"$veil":{"v":1,"deltas":[]}}', true);
select rv.mk('r1', '{"name":"T","npcs":[{"id":"a","name":"Ann"},{"id":"z","name":"Rvpost Newcomer","secret":"POSTSNAP_SECRET"}],"institutions":[{"id":"i","name":"Mill","desc":"POSTSNAP_DESC"}]}',
  '{"$veil":{"v":1,"deltas":[],"mode":"snapshot","at":"2026-11-01T00:00:00Z","snapshot":{"name":"T","npcs":[{"id":"a","name":"Ann"}],"institutions":[{"id":"i","name":"Mill","desc":"FROZEN_DESC"}]}}}');
\pset format unaligned
\pset tuples_only on
select s || ' | ' || rv.reads(s) from unnest(array['r4o9000','r4a9000']) s;
select 'R1 gallery: ' || (select data from public.get_gallery_dossier('p-r1'))::text;
select 'R1 map member: ' || (public.get_gallery_map('m-r1') -> 'members' -> 0 -> 'settlement')::text;
select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false);
select 'R1 import: ' || (select data from public.import_gallery_dossier('p-r1'))::text;
