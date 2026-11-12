-- COHERENCE-VEIL-3: FIXTURE ROWS FOR THE READ-ONLY PRE-DEPLOY BLOCK (veil-probe-2/predeploy-readonly.sql).
-- Built on a scratch chain at 210 (the state the owner runs the block in), each row made to move one of
-- the block's numbers; the expected figure is beside each. Needs the probe helper rv.mk(slug, data,
-- overrides, reveal_dm, narration) from veil-probe-3/rv.sql (every row listed AND linked, importable).
-- (2) copies: a 1.2M-character copy; a copy past 54,333,333; a snapshot share with no copy; one whose
--     copy is a string (no copy either). expected: frozen_copies 4 (these two, (7)'s and (8)'s),
--     over_1000000 2, refused_at_211 1, snapshot_without_copy 3 (these two and (3)'s)
select rv.mk('pd-copy-big', '{"name":"T"}', jsonb_build_object('$veil', jsonb_build_object('v', 1, 'deltas', '[]'::jsonb, 'mode', 'snapshot', 'at', '2026-11-01T00:00:00Z',
  'snapshot', jsonb_build_object('name', 'T', 'pad', repeat('x', 1200000))))::text);
select rv.mk('pd-copy-refused', '{"name":"T"}', jsonb_build_object('$veil', jsonb_build_object('v', 1, 'deltas', '[]'::jsonb, 'mode', 'snapshot', 'at', '2026-11-01T00:00:00Z',
  'snapshot', jsonb_build_object('name', 'T', 'pad', repeat('x', 54400000))))::text);
select rv.mk('pd-snap-nocopy', '{"name":"T"}', '{"$veil":{"v":1,"deltas":[],"mode":"snapshot","at":"2026-11-01T00:00:00Z"}}');
select rv.mk('pd-snap-stringcopy', '{"name":"T"}', '{"$veil":{"v":1,"deltas":[],"mode":"snapshot","at":"2026-11-01T00:00:00Z","snapshot":"x"}}');
-- (3) importable snapshot shares: the four above, (7)'s and (8)'s copy rows; one more not importable.
--     expected: importable_snapshot_shares 6
select rv.mk('pd-snap-notimportable', '{"name":"T"}', '{"$veil":{"v":1,"deltas":[],"mode":"snapshot"}}');
update public.settlements set gallery_importable = false where public_slug = 'p-pd-snap-notimportable';
-- (4) member flags: revealDm "maybe", {}, "yes", 1 (4 non-boolean); true, false, null (none);
--     allowImport "no", [] (2 non-boolean). expected: 4, 2, rows_holding_one 2
select rv.mk('pd-flags-a', '{"name":"T"}', '{"a":{"revealDm":"maybe"},"b":{"revealDm":{}},"c":{"revealDm":true},"d":{"revealDm":null},"e":{"allowImport":"no"}}');
select rv.mk('pd-flags-b', '{"name":"T"}', '{"a":{"revealDm":"yes"},"b":{"revealDm":1},"c":{"revealDm":false},"d":{"allowImport":[]}}');
-- (5) 1,500 member keys withheld. expected: most 1500, rows_over_1000 1
select rv.mk('pd-withheld', '{"name":"T"}', (select jsonb_object_agg('k' || g, '{"revealDm":false}'::jsonb) from generate_series(1, 1500) g)::text);
-- (6) 2,500 deltas. expected: longest 2500, rows_over_2000 1
select rv.mk('pd-deltas', '{"name":"T"}', jsonb_build_object('$veil', jsonb_build_object('v', 1, 'deltas',
  (select jsonb_agg(jsonb_build_object('address', 'field:npc:n' || g || ':secret', 'hidden', true)) from generate_series(1, 2500) g)))::text);
-- (7) houses and anonymous events. document: 1,200 houses; 1,100 anonymous events (275 with no key at
--     all, 275 named 0.0, 275 titled -0.0, 275 labelled 0e5) plus 100 that are not (a string id, a name,
--     the number 5e-324, label true). copy: 300 anonymous (name 1e-400). narration: 310 anonymous (no id
--     key, label ""). expected: document 1200 / 1100; copy 0 / 300; narration 0 / 310
select rv.mk('pd-events', jsonb_build_object('name', 'T',
    'institutions', (select jsonb_agg(jsonb_build_object('name', 'H' || g)) from generate_series(1, 1200) g),
    'history', jsonb_build_object('historicalEvents',
      (select jsonb_agg(case when g <= 275 then '{"description":"d"}'::jsonb when g <= 550 then '{"name":0.0}'::jsonb
                              when g <= 825 then '{"title":-0.0}'::jsonb else '{"label":0e5}'::jsonb end) from generate_series(1, 1100) g)
      || '[{"id":"e1"},{"name":"Named"},{"name":5e-324},{"label":true}]'::jsonb))::text,
  jsonb_build_object('$veil', jsonb_build_object('v', 1, 'deltas', '[]'::jsonb, 'mode', 'snapshot', 'at', '2026-11-01T00:00:00Z',
    'snapshot', jsonb_build_object('name', 'T', 'history', jsonb_build_object('eventsTimeline',
      (select jsonb_agg('{"name":1e-400}'::jsonb) from generate_series(1, 300) g)))))::text,
  false,
  jsonb_build_object('name', 'T', 'history', jsonb_build_object('historicalEvents',
    (select jsonb_agg('{"label":""}'::jsonb) from generate_series(1, 310) g)))::text);
-- (8) numbers: 1e131071 in a document, -1e131071 in a copy, 2.5e130748 in a narration; a numeric id and
--     a numeric name in a document; 1e400 past double in a document.
--     expected, document / copy / narration: at_or_past_1e130748 1 / 1 / 1; with_numeric_id 2 / 1 / 0;
--     with_numeric_name_or_part 1 / 0 / 1; past_double 2 / 1 / 1
select rv.mk('pd-num-doc', '{"name":"T","npcs":[{"name":"A","id":1e131071}]}');
select rv.mk('pd-num-copy', '{"name":"T"}', '{"$veil":{"v":1,"deltas":[],"mode":"snapshot","at":"2026-11-01T00:00:00Z","snapshot":{"name":"T","npcs":[{"name":"A","id":-1e131071}]}}}');
select rv.mk('pd-num-narr', '{"name":"T"}', '{}', false, '{"name":"T","npcs":[{"name":2.5e130748}]}');
select rv.mk('pd-num-ids', '{"name":"T","npcs":[{"name":7,"id":7}],"institutions":[{"id":1e400,"name":"H"}]}');
-- (1) time limits: one per role, one per role in this database, one for every role in this database.
--     expected: authenticated 8s (role_settings); anon 3s (role_in_db_settings); every_role_in_this_db
--     60s; never the block's own 120s.
alter role authenticated set statement_timeout = '8s';
do $$ begin execute format('alter role anon in database %I set statement_timeout = %L', current_database(), '3s'); end $$;
do $$ begin execute format('alter database %I set statement_timeout = %L', current_database(), '60s'); end $$;
