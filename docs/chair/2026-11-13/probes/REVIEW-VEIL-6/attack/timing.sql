-- REVIEW-VEIL-6 — how hard a read works. The heaviest stored town of the database, its share with every eye shut by
-- hand, each read five times; the median in milliseconds. Run on a cold run's lane database and on its base twin.
--   psql -d <db> -v dm=false|true -f timing.sql
\pset tuples_only on
\pset format unaligned
select set_config('test.uid', '', false);
create temp table rv6_pick as select id, public_slug, unlisted_slug, length(data::text) as chars,
    (select m.public_slug from public.saved_maps m where m.map_data->'campaign'->'settlementIds' ? s.id::text limit 1) as map_slug
  from public.settlements s where gallery_share_dm = :dm and not gallery_share_narrated and gallery_member_overrides->'$veil'->>'mode' = 'live'
    and jsonb_array_length(gallery_member_overrides->'$veil'->'deltas') > 0 order by length(data::text) desc limit 1;
create temp table rv6_t (read text, ms numeric);
do $$
declare p record; t0 timestamptz; i int; x jsonb; n int;
begin
  select * into p from rv6_pick;
  for i in 1..5 loop
    t0 := clock_timestamp(); select count(*) into n from public.get_gallery_dossier(p.public_slug); insert into rv6_t values ('gallery', extract(epoch from clock_timestamp() - t0) * 1000);
    t0 := clock_timestamp(); x := public.get_unlisted_dossier(p.unlisted_slug); insert into rv6_t values ('link', extract(epoch from clock_timestamp() - t0) * 1000);
    t0 := clock_timestamp(); x := public.get_gallery_map(p.map_slug); insert into rv6_t values ('map', extract(epoch from clock_timestamp() - t0) * 1000);
    perform set_config('test.uid', '22222222-2222-2222-2222-222222222222', true);
    t0 := clock_timestamp(); select count(*) into n from public.import_gallery_dossier(p.public_slug); insert into rv6_t values ('import', extract(epoch from clock_timestamp() - t0) * 1000);
    perform set_config('test.uid', '', true);
  end loop;
end $$;
select current_database() || ' | ' || (select chars from rv6_pick) || ' chars | ' || string_agg(read || ' ' || round(med) || ' ms', ' | ' order by read)
  from (select read, percentile_cont(0.5) within group (order by ms) med from rv6_t group by read) q;
