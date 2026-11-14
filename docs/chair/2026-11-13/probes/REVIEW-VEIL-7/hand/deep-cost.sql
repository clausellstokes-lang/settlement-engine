-- hand/deep-cost.sql   REVIEW-VEIL-7, LOCAL scratch chain only.   psql -d <chain> -v depth=600 -v houses=50 -v strings=2000 -v dm=false -f deep-cost.sql
-- One town, stored once: `houses` criminal houses hidden whole by hand (each name "Aa guild <i>"), one open house,
-- `strings` strings under economicState.primaryExports that each hold the first word of every hidden name and no
-- hidden name ("an aa cargo <j>"), and one value nested `depth` arrays deep under economicState.deep.
-- Reveal DM is `dm`. Prints, for the gallery read as anon: ok or the error, the milliseconds, and how many export strings came back.
\pset tuples_only on
\pset format unaligned
\timing off
delete from public.settlements where public_slug = 'rv7deep';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
select gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Deepwell', 'town',
  jsonb_build_object('name', 'Deepwell', 'tier', 'town',
    'institutions', (select jsonb_agg(jsonb_build_object('name', 'Aa guild ' || i, 'category', 'Criminal')) from generate_series(1, :houses) i) || '[{"name":"Fish market","category":"Economy"}]'::jsonb,
    'economicState', jsonb_build_object(
       'primaryExports', (select jsonb_agg('an aa cargo ' || j) from generate_series(1, :strings) j),
       'deep', (repeat('[', :depth) || '"bottom"' || repeat(']', :depth))::jsonb)),
  true, 'rv7deep', now(), 'rv7deepl', 'unlisted',
  jsonb_build_object('$veil', jsonb_build_object('v', 1, 'mode', 'live', 'deltas',
     (select jsonb_agg(jsonb_build_object('address', 'card:institution:aa-guild-' || i, 'hidden', true)) from generate_series(1, :houses) i))),
  :dm, true;
select set_config('test.uid', '', false);
set role anon;
do $$
declare t0 timestamptz := clock_timestamp(); d jsonb; msg text;
begin
  begin
    d := (select to_jsonb(g.data) from public.get_gallery_dossier('rv7deep') g);
    msg := 'ok | houses listed ' || jsonb_array_length(d -> 'institutions') || ' | exports back ' || jsonb_array_length(d #> '{economicState,primaryExports}');
  exception when others then msg := 'ERROR ' || left(sqlerrm, 120);
  end;
  raise notice '% | % | % ms', current_database(), msg, round(extract(epoch from clock_timestamp() - t0) * 1000);
end $$;
reset role;
delete from public.settlements where public_slug = 'rv7deep';
