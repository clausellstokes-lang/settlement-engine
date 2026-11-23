-- MEASURE FIRST: one alternation of ~1,200 names against ~10,000 short strings and against one 300 KB text (PostgreSQL 16)
\pset tuples_only on
\pset format unaligned
create temp table nm as select i, 'aa_?guild_?' || i as pat from generate_series(1, 1200) i;
create temp table st as select j, 'an_aa_cargo_' || j as t from generate_series(1, 10000) j;
create temp table big as select string_agg('"an_aa_cargo_' || j || '"', '_') as t from generate_series(1, 20000) j;
select 'big text chars: ' || length(t) from big;
do $$
declare t0 timestamptz; pat text; n int; b text; realpat text;
begin
  select '(?:^|_)(?:' || string_agg(nm.pat, '|') || ')(?:e?s)?(?:_|$)' into pat from nm;
  select t into b from big;
  t0 := clock_timestamp(); select count(*) into n from st where t ~ pat;
  raise notice 'shared-prefix names: 1200 alt x 10000 strings: % hits, % ms', n, round(extract(epoch from clock_timestamp() - t0) * 1000);
  t0 := clock_timestamp(); n := (b ~ pat)::int;
  raise notice 'shared-prefix names: 1200 alt x one % KB text: hit %, % ms', length(b) / 1000, n, round(extract(epoch from clock_timestamp() - t0) * 1000);
  t0 := clock_timestamp(); n := (b ~ pat)::int;
  raise notice '  again (compiled regex cached): % ms', round(extract(epoch from clock_timestamp() - t0) * 1000);
  -- names with no shared prefix: 1,200 random three-word names
  select '(?:^|_)(?:' || string_agg(md5(i::text) || '_?' || substr(md5((i * 7)::text), 1, 6) || '_?' || substr(md5((i * 13)::text), 1, 8), '|') || ')(?:e?s)?(?:_|$)' into realpat from generate_series(1, 1200) i;
  raise notice 'random names pattern chars: %', length(realpat);
  t0 := clock_timestamp(); select count(*) into n from st where t ~ realpat;
  raise notice 'random names: 1200 alt x 10000 strings: % hits, % ms', n, round(extract(epoch from clock_timestamp() - t0) * 1000);
  t0 := clock_timestamp(); n := (b ~ realpat)::int;
  raise notice 'random names: 1200 alt x one % KB text: hit %, % ms', length(b) / 1000, n, round(extract(epoch from clock_timestamp() - t0) * 1000);
  t0 := clock_timestamp(); n := (b ~ realpat)::int;
  raise notice '  again: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000);
end $$;
