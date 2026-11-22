-- (c) THE CATALOGUE (ruling 16): the public functions whose source draws randomness, and the transitive closure of their
-- CALLERS (a caller: a function whose source calls the name, as `name(`, word-bounded), each with provolatile.
-- The draw pattern is the part-one arm's (tests/security/galleryVeilIds.pglite.test.js :: catalogueReds).
with recursive fns as (
  select p.oid, p.proname, p.provolatile, p.prosrc from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'
), draws as (
  select proname from fns where prosrc ~* '\m(random|gen_random_uuid|gen_random_bytes|uuid_generate_v4|setseed)\s*\('
), closure(proname, via) as (
  select proname::text collate "C", 'draws'::text collate "C" from draws
  union
  select f.proname::text collate "C", c.proname::text collate "C" from fns f join closure c on f.prosrc ~* ('\m' || c.proname || '\s*\(') and f.proname <> c.proname
)
select distinct f.oid::regprocedure::text as sig, f.provolatile,
       case when f.proname in (select proname from draws) then 'DRAWS' else 'caller' end as role,
       (select string_agg(distinct via, ',') from closure c where c.proname = f.proname) as via
  from fns f where f.proname in (select proname from closure)
 order by 3 desc, 1;
