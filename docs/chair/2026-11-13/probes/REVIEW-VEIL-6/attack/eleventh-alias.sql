-- REVIEW-VEIL-6 — THE ELEVENTH SECOND HOME, by my own query (not the lane's guard): a chain names a house hidden
-- whole under the engine's processor name (the house's lower-cased name holds the first twelve characters of the
-- processing name), where no house the response still lists answers to that name. For every share with a veil mark:
-- the houses the gallery read no longer lists, and every string of the response's chains and trace that is such a
-- name. Run on a cold run's database (lane and base twins).
\pset tuples_only on
\pset format unaligned
select set_config('test.uid', '', false);
with sh as (select s.id, s.name, s.public_slug, s.gallery_share_dm dm, s.data, g.data sent from public.settlements s, lateral public.get_gallery_dossier(s.public_slug) g
             where s.gallery_member_overrides ? '$veil' and jsonb_array_length(s.gallery_member_overrides->'$veil'->'deltas') > 0),
gone as (select sh.public_slug, i->>'name' nm from sh, jsonb_array_elements(sh.data->'institutions') i
          where not exists (select 1 from jsonb_array_elements(sh.sent->'institutions') o where o->>'name' = i->>'name')),
open_h as (select sh.public_slug, o->>'name' nm from sh, jsonb_array_elements(sh.sent->'institutions') o),
strs as (select sh.public_slug, sh.name, sh.dm, 'processingInstitutions' as home, p #>> '{}' as v from sh, jsonb_array_elements(sh.sent->'economicState'->'activeChains') c, jsonb_array_elements(case when jsonb_typeof(c->'processingInstitutions') = 'array' then c->'processingInstitutions' else '[]' end) p
         union all select sh.public_slug, sh.name, sh.dm, 'label', c->>'label' from sh, jsonb_array_elements(sh.sent->'economicState'->'activeChains') c
         union all select sh.public_slug, sh.name, sh.dm, 'dependency', c->'dependency'->>'institution' from sh, jsonb_array_elements(sh.sent->'economicState'->'activeChains') c
         union all select sh.public_slug, sh.name, sh.dm, 'trace', x.v from sh, lateral (select regexp_replace(m[1], '^institution:', '') v from regexp_matches(coalesce(sh.sent->'simulationTrace', '[]')::text, '"(?:institution:)?([^"]{6,60})"', 'g') m) x),
hit as (select distinct s.public_slug, s.name, s.dm, s.home, s.v, g.nm from strs s join gone g on g.public_slug = s.public_slug
         where s.v is not null and length(s.v) >= 6 and (s.v = g.nm or position(left(lower(s.v), 12) in lower(g.nm)) > 0)
           and not exists (select 1 from open_h o where o.public_slug = s.public_slug and (o.nm = s.v or position(left(lower(s.v), 12) in lower(o.nm)) > 0)))
select current_database() || ' | shares read ' || (select count(*) from sh) || ' | houses hidden whole ' || (select count(*) from gone)
  || ' | a name only a hidden house answers to, sent: ' || (select count(*) from hit) || ' in ' || (select count(distinct name) from hit) || ' towns'
  || coalesce(' | e.g. ' || (select string_agg(distinct home || ': "' || v || '" <= "' || nm || '"', ' ; ') from (select * from hit order by public_slug limit 6) q), '');
