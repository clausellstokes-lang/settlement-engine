\set st `cat /var/tmp/v51/out/v27/st.json`
\set ov `cat /var/tmp/v51/out/v27/ov.json`
select 'stored=null' k, f ->> 'name' n, coalesce(left(f ->> 'desc', 40), 'WITHHELD') d
  from jsonb_array_elements(public._gallery_veil(public._gallery_sanitize_public_json(:'st'::jsonb), :'ov'::jsonb, false, false) #> '{body,powerStructure,factions}') f where f ->> 'name' = 'The Trade Compact'
union all
select 'stored=row', f ->> 'name', coalesce(left(f ->> 'desc', 40), 'WITHHELD')
  from jsonb_array_elements(public._gallery_veil(public._gallery_sanitize_public_json(:'st'::jsonb), :'ov'::jsonb, false, false, :'st'::jsonb) #> '{body,powerStructure,factions}') f where f ->> 'name' = 'The Trade Compact';
