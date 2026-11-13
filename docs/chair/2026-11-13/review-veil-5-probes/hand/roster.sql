-- REVIEW-VEIL-5, by hand: a person hidden by the per-member switch (revealDm:false) on a Reveal-DM share, whose card is
-- also embedded in a power's roster (master's shape: factions[].members[] and powerStructure.factions[].members[]).
-- UNMARKED (a share exported before the veil) and MARKED. Run on a clone of a chain: psql -d <db> -f roster.sql
\set owner '11111111-1111-1111-1111-111111111111'
delete from public.settlements where public_slug like 'rv5roster%';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
select gen_random_uuid(), :'owner', 'Rostertown', 'town',
  '{"name":"Rostertown","tier":"town","npcs":[{"id":"npc_1","name":"Ada Hidden","role":"reeve","secret":"RV5SECRET_ADA","goal":{"short":"RV5GOAL_ADA"},"factionAffiliation":"Town Council"},{"id":"npc_2","name":"Bo Shown","role":"smith","secret":"RV5SECRET_BO"}],
    "factions":[{"name":"Town Council","members":[{"id":"npc_1","name":"Ada Hidden","role":"reeve","secret":"RV5SECRET_ADA","goal":{"short":"RV5GOAL_ADA"}}]}],
    "powerStructure":{"factions":[{"faction":"Town Council","category":"government","members":[{"id":"npc_1","name":"Ada Hidden","role":"reeve","secret":"RV5SECRET_ADA","goal":{"short":"RV5GOAL_ADA"}}]}]}}'::jsonb,
  true, 'rv5roster-' || k, now(), 'rv5rosterl-' || k, 'unlisted', ov::jsonb, true, true
from (values ('unmarked', '{"npc_1":{"revealDm":false}}'), ('marked', '{"npc_1":{"revealDm":false},"$veil":{"v":1,"deltas":[]}}')) v(k, ov);
select set_config('test.uid', '', false);
select 'gallery ' || s.public_slug as read, (g.data::text ~ 'RV5SECRET_ADA') as ada_secret_sent, (g.data::text ~ 'RV5GOAL_ADA') as ada_goal_sent, (g.data::text ~ 'RV5SECRET_BO') as bo_secret_sent,
       (select string_agg(p, ' ') from (select distinct m[1] as p from regexp_matches(g.data::text, '"(npcs|factions|members|powerStructure)"', 'g') m) q) as lists
  from public.settlements s, lateral public.get_gallery_dossier(s.public_slug) g where s.public_slug like 'rv5roster%' order by 1;
select 'link ' || s.unlisted_slug as read, (public.get_unlisted_dossier(s.unlisted_slug)::text ~ 'RV5SECRET') as any_secret_sent from public.settlements s where s.public_slug like 'rv5roster%' order by 1;
select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false);
select 'import ' || s.public_slug as read, (g.data::text ~ 'RV5SECRET_ADA') as ada_secret_sent, (g.data::text ~ 'RV5GOAL_ADA') as ada_goal_sent
  from public.settlements s, lateral public.import_gallery_dossier(s.public_slug) g where s.public_slug like 'rv5roster%' order by 1;
