-- born/edited-after-birth.sql   REVIEW-VEIL-7, on a database a cold run left behind (LOCAL scratch only).
-- THE TEXT CURES MATCH A SENTENCE WORD FOR WORD. For every live share with hand hides and no reveal: a copy whose
-- hidden SOURCES were edited after the birth (" (as amended)" appended to every tie's description and tension, every
-- current tension's description, every event's lasting effects), the second homes left as the birth composed them.
-- Counts, on the party link, the second homes sent for the share as stored and for the edited copy.
\pset tuples_only on
\pset format unaligned
delete from public.settlements where public_slug like 'rv7ed-%';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
select gen_random_uuid(), user_id, name, tier,
  jsonb_set(jsonb_set(jsonb_set(data,
    '{relationships}', coalesce((select jsonb_agg(case when jsonb_typeof(r) = 'object' then r
        || case when jsonb_typeof(r->'description') = 'string' then jsonb_build_object('description', (r->>'description') || ' (as amended)') else '{}' end
        || case when jsonb_typeof(r->'tension') = 'string' then jsonb_build_object('tension', (r->>'tension') || ' (as amended)') else '{}' end else r end order by o)
      from jsonb_array_elements(data->'relationships') with ordinality x(r, o)), '[]')),
    '{history,currentTensions}', coalesce((select jsonb_agg(case when jsonb_typeof(t->'description') = 'string' then t || jsonb_build_object('description', (t->>'description') || ' (as amended)') else t end order by o)
      from jsonb_array_elements(data#>'{history,currentTensions}') with ordinality x(t, o)), '[]')),
    '{history,historicalEvents}', coalesce((select jsonb_agg(case when jsonb_typeof(e->'lastingEffects') = 'array' then e || jsonb_build_object('lastingEffects',
        (select jsonb_agg(case when jsonb_typeof(f) = 'string' then to_jsonb((f #>> '{}') || ' (as amended)') else f end) from jsonb_array_elements(e->'lastingEffects') f)) else e end order by o)
      from jsonb_array_elements(data#>'{history,historicalEvents}') with ordinality x(e, o)), '[]')),
  true, 'rv7ed-' || public_slug, now(), 'rv7edl-' || public_slug, 'unlisted', gallery_member_overrides, false, true
from public.settlements
where public_slug not like 'rv7%' and not gallery_share_dm and jsonb_array_length(coalesce(gallery_member_overrides #> '{$veil,deltas}', '[]')) > 0
  and coalesce(gallery_member_overrides #>> '{$veil,mode}', 'live') = 'live' and not coalesce(gallery_share_narrated, false)
  and jsonb_typeof(data->'relationships') = 'array' and jsonb_typeof(data#>'{history,currentTensions}') = 'array' and jsonb_typeof(data#>'{history,historicalEvents}') = 'array';
select set_config('test.uid', '', false);
select current_database() || ' | ' || kind || ' | shares ' || count(*)
  || ' | prominentRelationship.full ' || count(*) filter (where d #> '{prominentRelationship,full}' is not null)
  || ' | .tension ' || count(*) filter (where d #> '{prominentRelationship,tension}' is not null)
  || ' | .phrasing ' || count(*) filter (where d #> '{prominentRelationship,phrasing}' is not null)
  || ' | pressureSentence ' || count(*) filter (where d -> 'pressureSentence' is not null)
  || ' | siegeNarrative ' || count(*) filter (where d #> '{history,siegeNarrative}' is not null)
  || ' | shares with a legacy annotation sent ' || count(*) filter (where exists (select 1 from jsonb_array_elements(d #> '{history,legacyAnnotations}') a where a ? 'annotation'))
  || ' | annotations sent ' || coalesce(sum((select count(*) from jsonb_array_elements(d #> '{history,legacyAnnotations}') a where a ? 'annotation')), 0)
from (select case when s.public_slug like 'rv7ed-%' then 'sources edited after the birth' else 'as stored' end as kind, public.get_unlisted_dossier(s.unlisted_slug) -> 'dossier' as d
        from public.settlements s
       where s.public_slug like 'rv7ed-%' or 'rv7ed-' || s.public_slug in (select public_slug from public.settlements)) q
group by kind order by kind;
delete from public.settlements where public_slug like 'rv7ed-%';
