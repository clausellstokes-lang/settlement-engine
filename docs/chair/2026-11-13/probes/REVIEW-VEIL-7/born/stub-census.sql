-- born/stub-census.sql   REVIEW-VEIL-7, on a database a cold run left behind (LOCAL scratch only).
-- A HOUSE HIDDEN WHOLE THAT IS STILL LISTED. For every share read through the party link (the default veil at least):
-- the stored houses of the hideable class (the server's own _gallery_veil_house), split by what puts them in the class
-- (a Criminal category, or a declared facet / an illegal brokerage ALONE), and how many records the response's
-- institutions[] holds beyond the stored houses outside the class (a house of the class that was not removed), and
-- how many of its records carry no name.
\pset tuples_only on
\pset format unaligned
select set_config('test.uid', '', false);
select current_database() || ' | link reads ' || count(*) || ' | stored houses of the class: by category ' || sum(by_cat) || ', by facet or brokerage alone ' || sum(by_facet)
  || ' | reads whose institutions[] holds more than the houses outside the class ' || count(*) filter (where sent > outside)
  || ' | records sent beyond them ' || sum(greatest(sent - outside, 0)) || ' | records sent with no name ' || sum(nameless)
from (
  select (select count(*) from jsonb_array_elements(s.data->'institutions') i where public._gallery_veil_house(i) and public._gallery_veil_criminal(i)) as by_cat,
         (select count(*) from jsonb_array_elements(s.data->'institutions') i where public._gallery_veil_house(i) and not public._gallery_veil_criminal(i)) as by_facet,
         (select count(*) from jsonb_array_elements(s.data->'institutions') i where not public._gallery_veil_house(i)) as outside,
         jsonb_array_length(coalesce(d->'institutions', '[]')) as sent,
         (select count(*) from jsonb_array_elements(coalesce(d->'institutions', '[]')) i where coalesce(i->>'name', '') = '') as nameless
    from public.settlements s, lateral (select public.get_unlisted_dossier(s.unlisted_slug)->'dossier' d) q
   where s.unlisted_slug is not null and s.public_slug not like 'rv7%' and jsonb_typeof(s.data->'institutions') = 'array'
     and not exists (select 1 from jsonb_array_elements(coalesce(s.gallery_member_overrides #> '{$veil,deltas}', '[]')) x where x->>'address' like 'card:institution:%' and x->'hidden' = 'false')) z;
