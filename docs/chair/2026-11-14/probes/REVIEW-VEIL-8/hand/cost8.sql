-- hand/cost8.sql   REVIEW-VEIL-8, LOCAL scratch chain only.
--   psql -d <chain> -v houses=200 -v hitrows=5000 -v coldrows=5000 -v namelen=12 -f cost8.sql
-- One town: `houses` criminal houses hidden whole by hand (name "Aa guild <i>" padded with words to `namelen` words),
-- one open house; under economicState.rows an array of `hitrows` small objects each holding ONE DISTINCT string that
-- names a hidden house ("note <j> on aa guild <i>") and `coldrows` small objects that name none. Gallery read as anon.
\pset tuples_only on
\pset format unaligned
delete from public.settlements where public_slug = 'rv8cost';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
select gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Costwell', 'town',
  jsonb_build_object('name', 'Costwell', 'tier', 'town',
    'institutions', (select jsonb_agg(jsonb_build_object('id', 'h' || i, 'name', 'Aa guild ' || i || repeat(' of the long name', :namelen), 'category', 'Criminal')) from generate_series(1, :houses) i) || '[{"name":"Fish market","category":"Economy"}]'::jsonb,
    'economicState', jsonb_build_object(
       'rows', coalesce((select jsonb_agg(jsonb_build_object('d', 'note ' || j || ' on aa guild ' || (1 + j % :houses) || repeat(' of the long name', :namelen))) from generate_series(1, :hitrows) j), '[]')
            || coalesce((select jsonb_agg(jsonb_build_object('d', 'plain cargo line ' || j)) from generate_series(1, :coldrows) j), '[]'))),
  true, 'rv8cost', now(), 'rv8costl', 'unlisted',
  jsonb_build_object('$veil', jsonb_build_object('v', 1, 'mode', 'live', 'deltas',
     (select jsonb_agg(jsonb_build_object('address', 'card:institution:h' || i, 'hidden', true)) from generate_series(1, :houses) i))),
  false, true;
select set_config('test.uid', '', false);
set role anon;
do $$
declare t0 timestamptz := clock_timestamp(); d jsonb; msg text;
begin
  begin
    d := (select to_jsonb(g.data) from public.get_gallery_dossier('rv8cost') g);
    msg := 'ok | houses listed ' || jsonb_array_length(d -> 'institutions') || ' | rows back ' || jsonb_array_length(d #> '{economicState,rows}')
           || ' | rows with d ' || (select count(*) from jsonb_array_elements(d #> '{economicState,rows}') r where r ? 'd') || ' | bytes ' || length(d::text);
  exception when others then msg := 'ERROR ' || left(sqlerrm, 160);
  end;
  raise notice '% | % | % ms', current_database(), msg, round(extract(epoch from clock_timestamp() - t0) * 1000);
end $$;
reset role;
delete from public.settlements where public_slug = 'rv8cost';
