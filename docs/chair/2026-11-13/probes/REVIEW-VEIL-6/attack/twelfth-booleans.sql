-- REVIEW-VEIL-6 — the twelfth second home, the part no marker and no name search can see: BOOLEANS and LABELS.
-- For every share with every eye shut by hand and no DM reveal (live): the party link's response. A town counts
-- when a criminal house is hidden whole (the stored town lists it, the response's institutions[] does not) and the
-- response still says, in `economicState.compound.inst`, that the town has one.
\pset tuples_only on
\pset format unaligned
select set_config('test.uid', '', false);
with sh as (select s.name, s.data, public.get_unlisted_dossier(s.unlisted_slug)->'dossier' sent from public.settlements s
             where not s.gallery_share_dm and not s.gallery_share_narrated and s.gallery_member_overrides->'$veil'->>'mode' = 'live' and jsonb_array_length(s.gallery_member_overrides->'$veil'->'deltas') > 0),
t as (select name, sent, (select count(*) from jsonb_array_elements(data->'institutions') i where not exists (select 1 from jsonb_array_elements(sent->'institutions') o where o->>'name' = i->>'name')) gone from sh)
select current_database() || ' | towns ' || count(*) || ' | with a house hidden whole ' || count(*) filter (where gone > 0)
  || ' | of them, sent hasCriminalInst=true ' || count(*) filter (where gone > 0 and sent #> '{economicState,compound,inst,hasCriminalInst}' = 'true')
  || ', hasThievesGuild=true ' || count(*) filter (where gone > 0 and sent #> '{economicState,compound,inst,hasThievesGuild}' = 'true')
  || ', hasSmuggling=true ' || count(*) filter (where gone > 0 and sent #> '{economicState,compound,inst,hasSmuggling}' = 'true')
  || ', hasGangInfra=true ' || count(*) filter (where gone > 0 and sent #> '{economicState,compound,inst,hasGangInfra}' = 'true')
  || ' | an income source named for crime (Thieves'' Guild / Smuggling Network / Criminal Syndicate / Black Market Revenue, Shadow Economy) ' || count(*) filter (where gone > 0 and exists (select 1 from jsonb_array_elements(sent->'economicState'->'incomeSources') i where i->>'source' ~ 'Thieves|Smuggling|Criminal Syndicate|Black Market|Shadow Economy'))
  || ' | with NO house hidden whole and hasCriminalInst=true ' || count(*) filter (where gone = 0 and sent #> '{economicState,compound,inst,hasCriminalInst}' = 'true')
  from t;
