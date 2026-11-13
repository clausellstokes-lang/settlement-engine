with towns as (select distinct on (name) name, data from settlements order by name, public_slug),
st as (select t.name, n->>'id' id, regexp_replace(pf.value #>> '{}', ' vq6n[0-9]+z', '', 'g') as phys, regexp_replace(n->'presentation'->>'impression', ' vq6n[0-9]+z', '', 'g') imp
   from towns t, jsonb_array_elements(t.data->'npcs') n, jsonb_each(case when jsonb_typeof(n->'physical')='object' then n->'physical' else jsonb_build_object('s', n->'physical') end) pf where jsonb_typeof(pf.value)='string')
select current_database() || ' | towns ' || (select count(*) from towns) || ' | persons with an impression: ' || count(distinct (name, id)) filter (where imp is not null)
  || ' | persons whose STORED impression embeds a string of their OWN stored appearance (6 chars or more): ' || count(distinct (name, id)) filter (where length(phys) >= 6 and position(lower(phys) in lower(imp)) > 0)
  || ' | … or a word run of it (first 12 chars): ' || count(distinct (name, id)) filter (where length(phys) >= 12 and position(lower(left(phys, 12)) in lower(imp)) > 0) from st;
