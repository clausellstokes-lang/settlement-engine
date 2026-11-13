-- the slowest of each read over every stored share, in milliseconds (a scratch clone only)
do $t$
declare r record; t0 timestamptz; ms numeric; k text; mx jsonb := '{}'; who jsonb := '{}';
begin
  for r in select s.public_slug, s.unlisted_slug, m.public_slug as map from public.settlements s
             left join public.saved_maps m on m.map_data #>> '{campaign,settlementIds,0}' = s.id::text loop
    foreach k in array array['gallery', 'link', 'import', 'map'] loop
      if k = 'import' then perform set_config('test.uid', '22222222-2222-2222-2222-222222222222', false); end if;
      t0 := clock_timestamp();
      if k = 'gallery' then perform * from public.get_gallery_dossier(r.public_slug);
      elsif k = 'link' then perform public.get_unlisted_dossier(r.unlisted_slug);
      elsif k = 'import' then perform * from public.import_gallery_dossier(r.public_slug);
      elsif r.map is not null then perform public.get_gallery_map(r.map); end if;
      ms := round(extract(epoch from clock_timestamp() - t0) * 1000);
      perform set_config('test.uid', '', false);
      if ms > coalesce((mx ->> k)::numeric, 0) then mx := mx || jsonb_build_object(k, ms); who := who || jsonb_build_object(k, r.public_slug); end if;
    end loop;
  end loop;
  raise notice 'slowest ms %, at %', mx, who;
end $t$;
