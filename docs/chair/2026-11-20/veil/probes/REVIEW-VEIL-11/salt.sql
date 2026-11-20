-- REVIEW-VEIL-11 — R4's salt (VR10, per-read re-key of person ids), run as: psql -d <db with one public slug :'slug' stored> -v slug=<slug>
-- (1) THE CATALOGUE: every function 211/212 create or restate (gallery and veil helpers and the public reads), its volatility,
--     and whether its body draws a salt (gen_random_uuid / random / clock) or calls one that does.
\echo '== volatility of the gallery and veil functions (i immutable, s stable, v volatile)'
select p.proname, p.provolatile, (p.prosrc ~* 'gen_random_uuid|random\(|clock_timestamp|now\(\)') as draws
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and (p.proname like '\_gallery\_%' or p.proname in ('get_gallery_dossier','get_unlisted_dossier','import_gallery_dossier','get_gallery_map','import_gallery_map'))
 order by draws desc, p.proname;
\echo '== a function that is NOT volatile and draws, or calls a drawing function by name (must be empty)'
with drawers as (select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosrc ~* 'gen_random_uuid|random\(')
select p.proname, p.provolatile, d.proname as calls
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace, drawers d
 where n.nspname = 'public' and p.provolatile <> 'v' and (p.proname = d.proname or p.prosrc ~ ('\m' || d.proname || '\('))
 order by 1;
-- (2) THE PREPARED PATH: one statement, executed 7 times (custom plans then the cache's choice), then under a forced generic
--     plan 3 times; each read's served person ids. Every execution must give a different set (no two reads equal).
set role anon;
prepare rd(text) as select (select string_agg(n->>'id', ',' order by o) from jsonb_array_elements(data->'npcs') with ordinality x(n,o)) as ids from public.get_gallery_dossier($1);
create temp table if not exists rv11_ids(k int, ids text);
reset role;
-- run loop in shell: for i in 1..7: execute rd(:'slug'); set plan_cache_mode=force_generic_plan; 3 more; count distinct
