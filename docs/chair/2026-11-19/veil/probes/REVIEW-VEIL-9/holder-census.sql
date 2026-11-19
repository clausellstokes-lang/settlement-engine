-- REVIEW-VEIL-9 · V9-2: A HIDDEN HOUSE'S HOLDER TITLE ON ITS PERSON. For every share of this database: each person the
-- read sends whose STORED card ties them to a house (`institution.key`) that the read withholds, and whether the
-- (houses of the hideable class only: category Criminal or the tag criminal) person's sent `role` or `title` equals that tie's own `title` (the house's holder title). Gallery (anon), link (anon).
select set_config('test.uid', '', false);
with sh as (select s.public_slug, s.unlisted_slug, s.name, s.gallery_share_dm dm, s.data from public.settlements s where s.public_slug is not null and not coalesce(s.gallery_share_narrated, false)),
reads as (select sh.*, 'gallery' rd, g.data d from sh, lateral public.get_gallery_dossier(sh.public_slug) g
          union all select sh.*, 'link', public.get_unlisted_dossier(sh.unlisted_slug) -> 'dossier' from sh),
p as (select r.public_slug, r.name town, r.dm, r.rd, n->>'id' pid, n->'institution'->>'key' house, n->'institution'->>'title' htitle, sn->>'role' role, sn->>'title' title
        from reads r, jsonb_array_elements(r.data->'npcs') n, jsonb_array_elements(r.d->'npcs') sn
       where sn->>'id' = n->>'id' and jsonb_typeof(n->'institution') = 'object'
         and exists (select 1 from jsonb_array_elements(r.data->'institutions') i where i->>'name' = n->'institution'->>'key' and (i->>'category' = 'Criminal' or coalesce(i->'tags', '[]') ? 'criminal'))
         and not exists (select 1 from jsonb_array_elements(r.d->'institutions') i where lower(i->>'name') = lower(n->'institution'->>'key')))
select current_database() || ' | ' || rd || ' | ' || case when dm then 'DM on ' else 'DM off' end || ' | persons of a withheld house sent ' || count(*)
  || ' | whose role or title is the house''s holder title ' || count(*) filter (where role = htitle or title = htitle)
  || ' | towns ' || count(distinct town) filter (where role = htitle or title = htitle)
  || ' | e.g. ' || coalesce(min(town || ': ' || house || ' -> ' || coalesce(role, '-') || ' / ' || coalesce(title, '-')) filter (where role = htitle or title = htitle), '-')
from p group by rd, dm order by rd, dm;
