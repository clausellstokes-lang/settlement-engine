-- REVIEW-VEIL-3: the second review's rows, rebuilt by hand. rv.mk / rv.reads from the lane's veil-probe-3/rv.sql (row maker and a read catcher).
select set_config('test.uid', '', false);
-- R3
select rv.mk('r3a', '{"name":"T","npcs":[{"name":"A","id":1e131071}]}', '{}');
select rv.mk('r3b', '{"name":"T","powerStructure":{"factions":[{"name":"F","members":[{"name":2.5e130748}]}]}}', '{"$veil":{"v":1,"deltas":[]}}');
select rv.mk('r3c', '{"name":"T"}', '{"$veil":{"v":1,"deltas":[],"mode":"snapshot","snapshot":{"name":"T","npcs":[{"name":"A","id":-1e131071}]}}}');
select rv.mk('r3d', '{"name":"T"}', '{"$veil":{"v":1,"deltas":[]}}', false, '{"name":"T","npcs":[{"name":"A","id":1e131071}]}');
select rv.mk('r3e', '{"name":"T","npcs":[{"name":-9.99e131071,"id":1e-16383}]}', '{"$veil":{"v":1,"deltas":[]}}');
-- R4: depth N objects / arrays ending in a hook key, Reveal DM on, marked
select rv.mk('r4o' || n, '{"name":"T","npcs":[{"name":"A"}],"deep":' || repeat('{"a":', n) || '{"theHook":"x"}' || repeat('}', n) || ',"lore":{"aHook":"z"}}', '{"$veil":{"v":1,"deltas":[]}}', true) from unnest(array[550, 900, 2000]) n;
select rv.mk('r4a' || n, '{"name":"T","npcs":[{"name":"A"}],"deep":' || repeat('[', n) || '{"theHook":"x"}' || repeat(']', n) || ',"lore":{"aHook":"z"}}', '{"$veil":{"v":1,"deltas":[]}}', true) from unnest(array[550, 900, 2000]) n;
-- R9/R11
select rv.mk('r9' || k, '{"name":"T","npcs":[{"id":"a","name":"Ann","goal":"GOAL_A","secret":"SECRET_A"}]}', '{"a":{"revealDm":' || v || '}}') from (values ('maybe', '"maybe"'), ('obj', '{}'), ('yes', '"yes"'), ('t', '"t"'), ('one', '1'), ('on', '"on"')) x(k, v);
\pset format unaligned
\pset tuples_only on
select s || ' | ' || rv.reads(s) from unnest(array['r3a','r3b','r3c','r3d','r3e','r4o550','r4o900','r4o2000','r4a550','r4a900','r4a2000','r9maybe','r9obj','r9yes','r9t','r9one','r9on']) s;
-- R11: does a word reveal? (gallery data of r9yes etc. carries GOAL_A only if revealed)
select 'R11 ' || s || ' gallery_reveals_goal=' || ((select data from public.get_gallery_dossier('p-' || s))::text like '%GOAL_A%') from unnest(array['r9yes','r9t','r9one','r9on']) s;
