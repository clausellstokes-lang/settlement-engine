\pset tuples_only on
\pset format unaligned
do $$
declare t0 timestamptz; j jsonb; n int; x text; h jsonb; doc jsonb;
begin
  t0 := clock_timestamp(); x := public._gallery_veil_name_case(); raise notice 'the case literal: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); j := public._gallery_veil_name_search(array['Aa guild 1'], array['Fish market']); raise notice 'search, 1 name: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); j := public._gallery_veil_name_search(array['Aa guild 2'], array['Fish market']); raise notice 'search, 1 name, again: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); j := public._gallery_veil_name_search(array(select 'Aa guild ' || i from generate_series(1, 600) i), array['Fish market']); raise notice 'search, 600 names: % ms (pattern % chars)', round(extract(epoch from clock_timestamp() - t0) * 1000, 1), length(j ->> 'p');
  doc := jsonb_build_object('name', 'Deepwell', 'economicState', jsonb_build_object('primaryExports', (select jsonb_agg('an aa cargo ' || k) from generate_series(1, 10000) k)));
  t0 := clock_timestamp(); h := public._gallery_veil_name_hits(doc, j); raise notice 'the whole text asked, 600 names, % KB, no hit: % ms', length(doc::text) / 1000, round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  -- the random names of the first measure, as real names: 1,200 of three words
  t0 := clock_timestamp(); j := public._gallery_veil_name_search(array(select md5(i::text) || ' ' || substr(md5((i * 7)::text), 1, 6) || ' ' || substr(md5((i * 13)::text), 1, 8) from generate_series(1, 1200) i), array(select 'Open house ' || i from generate_series(1, 300) i));
  raise notice 'search, 1,200 names of three words, 300 open names: % ms (pattern % chars)', round(extract(epoch from clock_timestamp() - t0) * 1000, 1), length(j ->> 'p');
  t0 := clock_timestamp(); h := public._gallery_veil_name_hits(doc, j); raise notice 'the whole text asked, 1,200 names, no hit: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  -- one hit in 10,000 strings: the walk
  doc := jsonb_set(doc, '{economicState,primaryExports,5000}', to_jsonb('paid to the ' || md5('77') || ' ' || substr(md5((77 * 7)::text), 1, 6) || ' ' || substr(md5((77 * 13)::text), 1, 8) || ' in full'));
  t0 := clock_timestamp(); h := public._gallery_veil_name_hits(doc, j); raise notice 'the whole text asked, 1,200 names, ONE hit: % ms, hits %', round(extract(epoch from clock_timestamp() - t0) * 1000, 1), (select count(*) from jsonb_object_keys(h));
  t0 := clock_timestamp(); doc := public._gallery_veil_name_sweep(doc, h, j -> 'blank', j -> 'raw'); raise notice 'the walk, one hit among 10,000 strings: % ms, strings back %', round(extract(epoch from clock_timestamp() - t0) * 1000, 1), jsonb_array_length(doc #> '{economicState,primaryExports}');
end $$;
