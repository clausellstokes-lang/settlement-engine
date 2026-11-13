-- REVIEW-VEIL-6, by hand: the tenth second home on a row I wrote. A person whose impression repeats a sentence of
-- their own appearance; the appearance eye shut by hand on that person; a second person untouched. New shape and
-- master's shape differ in nothing here. Run on a chain: psql -d <db> -f impression-hand.sql
\pset tuples_only on
\pset format unaligned
delete from public.settlements where public_slug like 'rv6imp%';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
select gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Impressionton', 'town',
  '{"name":"Impressionton","tier":"town","npcs":[
     {"id":"npc_a","name":"Ada Scarred","role":"reeve","physical":{"feature":"a burn scar across the left hand RV6IMP_A","build":"tall"},"presentation":{"impression":"Tall, watchful, a burn scar across the left hand RV6IMP_A.","behaviour":"Speaks last."}},
     {"id":"npc_b","name":"Bo Plain","role":"smith","physical":{"feature":"soot to the elbows RV6IMP_B"},"presentation":{"impression":"Broad, cheerful, soot to the elbows RV6IMP_B."}}]}'::jsonb,
  true, 'rv6imp-' || k, now(), 'rv6impl-' || k, 'unlisted', ov::jsonb, false, true
from (values ('shut', '{"$veil":{"v":1,"mode":"live","deltas":[{"address":"field:npc:npc_a:physical","hidden":true}]}}'), ('open', '{"$veil":{"v":1,"mode":"live","deltas":[]}}')) v(k, ov);
select set_config('test.uid', '', false);
select current_database() || ' | ' || s.public_slug || ' | gallery: Ada''s appearance sent ' || (g.data::text ~ '"feature": "a burn scar') || ', her impression sent ' || (g.data::text ~ 'watchful, a burn scar') || ', Bo''s impression sent ' || (g.data::text ~ 'cheerful, soot')
   || ' | link: Ada''s impression sent ' || (public.get_unlisted_dossier(s.unlisted_slug)::text ~ 'watchful, a burn scar') || ', Bo''s ' || (public.get_unlisted_dossier(s.unlisted_slug)::text ~ 'cheerful, soot')
  from public.settlements s, lateral public.get_gallery_dossier(s.public_slug) g where s.public_slug like 'rv6imp%' order by s.public_slug;
delete from public.settlements where public_slug like 'rv6imp%';
