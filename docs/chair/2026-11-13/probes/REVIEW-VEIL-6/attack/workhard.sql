-- REVIEW-VEIL-6 — CAN A READ BE MADE TO WORK HARD? Any signed-in user stores their own row and shares it; anyone may
-- then call the reads on it. The heaviest stored share (every eye shut, no reveal, live) is amplified in place:
-- :k copies of every tie (each with its own id, description and tension, each hidden by its own two deltas),
-- :k copies of every defence-profile entry and of every chain. The gallery read and the party link are timed, three
-- times each. Run on a clone of a cold run's lane database and of its base twin; compare.
--   psql -d <clone> -v k=20 -f workhard.sql
\pset tuples_only on
\pset format unaligned
select set_config('test.uid', '', false);
create temp table rv6_pick as select id, public_slug, unlisted_slug from public.settlements s where not gallery_share_dm and not gallery_share_narrated
   and gallery_member_overrides->'$veil'->>'mode' = 'live' and jsonb_array_length(gallery_member_overrides->'$veil'->'deltas') > 0 order by length(data::text) desc limit 1;
update public.settlements s set
  data = jsonb_set(jsonb_set(jsonb_set(s.data,
     '{relationships}', (select jsonb_agg(r || jsonb_build_object('id', (r->>'id') || '-x' || g, 'description', (r->>'description') || ' copy ' || g || ' ' || md5(g::text || (r->>'id')), 'tension', (r->>'tension') || ' copy ' || g || ' ' || md5('t' || g::text || (r->>'id'))))
                           from jsonb_array_elements(s.data->'relationships') r, generate_series(1, :k) g)),
     '{economicState,activeChains}', (select jsonb_agg(c) from jsonb_array_elements(s.data->'economicState'->'activeChains') c, generate_series(1, :k) g)),
     '{defenseProfile,institutions,walls}', coalesce((select jsonb_agg(c) from jsonb_array_elements(s.data->'defenseProfile'->'institutions'->'walls') c, generate_series(1, :k * 10) g), '[]'::jsonb)),
  gallery_member_overrides = jsonb_set(s.gallery_member_overrides, '{$veil,deltas}', (s.gallery_member_overrides->'$veil'->'deltas') ||
     (select jsonb_agg(jsonb_build_object('address', 'field:relationship:' || (r->>'id') || '-x' || g || ':' || e, 'hidden', true))
        from jsonb_array_elements(s.data->'relationships') r, generate_series(1, :k) g, unnest(array['description', 'tension']) e))
  where s.id = (select id from rv6_pick);
create temp table rv6_t (read text, ms numeric, bytes int);
do $$
declare p record; t0 timestamptz; i int; x jsonb; n int;
begin
  select * into p from rv6_pick;
  for i in 1..3 loop
    t0 := clock_timestamp(); select length(g.data::text) into n from public.get_gallery_dossier(p.public_slug) g; insert into rv6_t values ('gallery', extract(epoch from clock_timestamp() - t0) * 1000, n);
    t0 := clock_timestamp(); x := public.get_unlisted_dossier(p.unlisted_slug); insert into rv6_t values ('link', extract(epoch from clock_timestamp() - t0) * 1000, length(x::text));
  end loop;
end $$;
select current_database() || ' | k=' || :k || ' | stored ' || (select length(data::text) from public.settlements where id = (select id from rv6_pick)) || ' chars, ' ||
  (select jsonb_array_length(data->'relationships') from public.settlements where id = (select id from rv6_pick)) || ' ties, ' ||
  (select jsonb_array_length(gallery_member_overrides->'$veil'->'deltas') from public.settlements where id = (select id from rv6_pick)) || ' deltas | ' ||
  string_agg(read || ' ' || round(med) || ' ms (' || b || ' chars sent)', ' | ' order by read)
  from (select read, percentile_cont(0.5) within group (order by ms) med, max(bytes) b from rv6_t group by read) q;
