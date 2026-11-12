p='211.sql'; s=open(p).read()
def rep(old, new):
    global s
    assert s.count(old)==1, old[:80]
    s=s.replace(old,new)
# resolve takes the people
rep("""create or replace function public._gallery_veil_resolve(pub jsonb, overrides jsonb, link boolean)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$""",
"""create or replace function public._gallery_veil_resolve(pub jsonb, overrides jsonb, link boolean, people text[])
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$""")
rep("""  card_deltas as (
    select 'card:npc:' || k as address, true as hidden, o::bigint as ord
      from jsonb_each(ov) with ordinality x(k, v, o)
     where k <> '$veil' and jsonb_typeof(v) = 'object' and v -> 'revealDm' = 'false'::jsonb
  ),""","""  -- readShareVeil's member keys read as card deltas (revealDm:false). Only a key that NAMES A PERSON
  -- of the document can hide anything, so only those are worked on: one lookup per person, never a
  -- walk over what a sharer stored (the review's F4). Every such delta hides, so their order is moot.
  card_deltas as (
    select 'card:npc:' || p as address, true as hidden, 0::bigint as ord
      from unnest(people) p
     where p <> '$veil' and jsonb_typeof(ov -> p) = 'object' and ov -> p -> 'revealDm' = 'false'::jsonb
  ),""")
# _gallery_veil computes people once and serves them
rep("""create or replace function public._gallery_veil(pub jsonb, overrides jsonb, link boolean)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
declare
  res jsonb := public._gallery_veil_resolve(pub, overrides, link);
begin
  if res is null then return null; end if;
  return jsonb_build_object(""","""create or replace function public._gallery_veil(pub jsonb, overrides jsonb, link boolean)
returns jsonb language plpgsql immutable set search_path = public, pg_temp as $$
declare
  -- every person of the document, by the client's member key (the served booleans and the card deltas)
  people text[] := array(select distinct public._gallery_veil_card_id('npc', c.card)
                           from public._gallery_veil_cards(case when jsonb_typeof(pub) = 'object' then pub else '{}' end, 'npc') c);
  res jsonb := public._gallery_veil_resolve(pub, overrides, link, people);
begin
  if res is null then return jsonb_build_object('people', to_jsonb(people)); end if;
  return jsonb_build_object('people', to_jsonb(people), """)
# served: by person
rep("""create or replace function public._gallery_veil_served(overrides jsonb, groupings jsonb)
returns jsonb language sql immutable set search_path = public, pg_temp as $$
  select coalesce((
      select jsonb_object_agg(k, m) from (
        select k, jsonb_strip_nulls(jsonb_build_object(
            'revealDm', case when jsonb_typeof(v -> 'revealDm') = 'boolean' then v -> 'revealDm' end,
            'allowImport', case when jsonb_typeof(v -> 'allowImport') = 'boolean' then v -> 'allowImport' end)) as m
          from jsonb_each(case when jsonb_typeof(overrides) = 'object' then overrides else '{}' end) x(k, v)
         where k <> '$veil' and jsonb_typeof(v) = 'object') q
       where m <> '{}'), '{}')""","""create or replace function public._gallery_veil_served(overrides jsonb, groupings jsonb, people jsonb)
returns jsonb language sql immutable set search_path = public, pg_temp as $$
  -- each person's member entry, looked up by the person's key (a key naming no person is no one's
  -- override: the review's F4, so the work is the document's, not what a sharer stored)
  select coalesce((
      select jsonb_object_agg(k, m) from (
        select k, jsonb_strip_nulls(jsonb_build_object(
            'revealDm', case when jsonb_typeof(v -> 'revealDm') = 'boolean' then v -> 'revealDm' end,
            'allowImport', case when jsonb_typeof(v -> 'allowImport') = 'boolean' then v -> 'allowImport' end)) as m
          from (select k, overrides -> k as v
                  from jsonb_array_elements_text(case when jsonb_typeof(people) = 'array' then people else '[]' end) k
                 where jsonb_typeof(overrides) = 'object') x
         where k <> '$veil' and jsonb_typeof(v) = 'object') q
       where m <> '{}'), '{}')""")
s=s.replace("public._gallery_veil_served(s.gallery_member_overrides, vl.v -> 'groupings')","public._gallery_veil_served(s.gallery_member_overrides, vl.v -> 'groupings', vl.v -> 'people')")
assert s.count("vl.v -> 'people')")==2
# _gallery_veil returns body only when res; reads use vl.v -> 'body' -- check groupings for unmarked: absent -> null ok
open(p,'w').write(s); open('211.f4.sql','w').write(s)
