-- REVIEW-VEIL-6, by hand: the eleventh second home, and the twelfth beside it, on a row I wrote. A criminal house
-- "Black market bazaar" hidden whole by hand; a chain that names it "Black market" (the engine's processor name) and
-- an open house "Fish market" that another chain names; the town's compound list of lower-cased names, a boolean and
-- an income label, as the generator writes them. Run on a chain: psql -d <db> -f eleventh-hand.sql
\pset tuples_only on
\pset format unaligned
delete from public.settlements where public_slug like 'rv6ele%';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
select gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Aliaston', 'town',
  '{"name":"Aliaston","tier":"town","institutions":[
     {"name":"Black market bazaar","category":"Criminal","tags":["criminal","underground"],"desc":"Contraband."},
     {"name":"Fish market","category":"Economy","tags":["market"],"desc":"Fish."}],
    "economicState":{"activeChains":[
       {"chainId":"criminal_economy.black_market","label":"Black market","processingInstitutions":["Black market"]},
       {"chainId":"fishing","label":"Fishing","processingInstitutions":["Fish market"]}],
      "compound":{"inst":{"names":["black market bazaar","fish market"],"hasCriminalInst":true,"hasMarket":true}},
      "incomeSources":[{"source":"Black Market Revenue","percentage":12},{"source":"Market Taxes","percentage":30}],
      "situationDesc":"Honest trade gets by, but a busy black market undercuts it."}}'::jsonb,
  true, 'rv6ele-' || k, now(), 'rv6elel-' || k, 'unlisted', ov::jsonb, false, true
from (values ('hidden', '{"$veil":{"v":1,"mode":"live","deltas":[{"address":"card:institution:black-market-bazaar","hidden":true}]}}')) v(k, ov);
select set_config('test.uid', '', false);
select current_database() || ' | link | institutions sent: ' || (select string_agg(i->>'name', ', ') from jsonb_array_elements(d->'institutions') i)
   || ' | chains sent: ' || coalesce((select string_agg(c->>'label' || ' <- ' || (c->'processingInstitutions')::text, ' ; ') from jsonb_array_elements(d->'economicState'->'activeChains') c), '(none)')
   || ' | compound names: ' || coalesce((d->'economicState'->'compound'->'inst'->'names')::text, '(none)') || ' | hasCriminalInst: ' || coalesce((d->'economicState'->'compound'->'inst'->'hasCriminalInst')::text, '(absent)')
   || ' | income: ' || coalesce((select string_agg(i->>'source', ', ') from jsonb_array_elements(d->'economicState'->'incomeSources') i), '(none)') || ' | situationDesc: ' || coalesce(d->'economicState'->>'situationDesc', '(absent)')
  from (select public.get_unlisted_dossier(s.unlisted_slug)->'dossier' d from public.settlements s where s.public_slug like 'rv6ele%') q;
delete from public.settlements where public_slug like 'rv6ele%';
