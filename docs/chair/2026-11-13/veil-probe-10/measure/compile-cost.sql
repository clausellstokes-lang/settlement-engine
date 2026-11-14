\pset tuples_only on
\pset format unaligned
do $$
declare t0 timestamptz; j jsonb; p text; plain text; txt text; b boolean; trie text;
begin
  j := public._gallery_veil_name_search(array(select md5(i::text) || ' ' || substr(md5((i * 7)::text), 1, 6) || ' ' || substr(md5((i * 13)::text), 1, 8) from generate_series(1, 1200) i), '{}');
  p := j ->> 'p';
  select string_agg('"an_aa_cargo_' || k || '"', '_') into txt from generate_series(1, 10000) k;
  t0 := clock_timestamp(); b := '' ~ p; raise notice 'bracketed needles (% chars): first use on an empty text (the compile): % ms', length(p), round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); b := txt ~ p; raise notice '  then % KB of text: % ms', length(txt) / 1000, round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); b := txt ~ p; raise notice '  again: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  select '(?:^|[_"])(?:' || string_agg(md5(i::text) || '_?' || substr(md5((i * 7)::text), 1, 6) || '_?' || substr(md5((i * 13)::text), 1, 8), '|') || ')(?:e?s)?(?:[_"]|$)' into plain from generate_series(1, 1200) i;
  t0 := clock_timestamp(); b := '' ~ plain; raise notice 'plain lower-case needles (% chars): the compile: % ms', length(plain), round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); b := txt ~ plain; raise notice '  then the text: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); b := txt ~ plain; raise notice '  again: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
end $$;
