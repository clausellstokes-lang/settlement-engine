-- MEASURE: the cost of preparing one 300 KB text (PostgreSQL 16)
\pset tuples_only on
\pset format unaligned
do $$
declare t0 timestamptz; a text; u text; r text; n int; esc text;
begin
  select string_agg('"an aa cargo ' || j || '"', ', ') into a from generate_series(1, 20000) j;
  select string_agg('"the caf' || chr(233) || ' ' || chr(8212) || ' cargo ' || j || '"', ', ') into u from generate_series(1, 14000) j;
  select string_agg('"an \"aa\" cargo\n' || j || '"', ', ') into esc from generate_series(1, 14000) j;
  raise notice 'ascii % chars, non-ascii % chars, escaped % chars', length(a), length(u), length(esc);
  t0 := clock_timestamp(); n := (a ~ '[^\x01-\x7f]')::int; raise notice 'ascii test on ascii: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); n := (a ~ '\\')::int; raise notice 'backslash test: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); n := position('\' in a); raise notice 'backslash position(): % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); r := regexp_replace(esc, '\\(?:u[0-9a-fA-F]{4}|.)', ' ', 'g'); raise notice 'neutralise 42,000 escapes: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); r := regexp_replace(a, '"([^"]*)"[^"]*', '"\1"', 'g'); raise notice 'gapless, 20,000 tokens: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); r := normalize(u, NFKC); raise notice 'normalize NFKC non-ascii: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); n := (u is nfkc normalized)::int; raise notice 'is nfkc normalized (yes): % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); r := regexp_replace(u, '[\u0300-\u036f]+', '', 'g'); raise notice 'strip marks (none): % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); r := regexp_replace(a, '[^a-z0-9]+', '_', 'g'); raise notice 'fold by regexp_replace (ascii): % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); r := translate(a, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'); raise notice 'translate A-Z: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
  t0 := clock_timestamp(); n := length(a::text); raise notice 'length: % ms', round(extract(epoch from clock_timestamp() - t0) * 1000, 1);
end $$;
