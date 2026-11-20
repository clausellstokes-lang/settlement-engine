#!/bin/sh
# catalogue.sh <db> <migdir>: REVIEW-VEIL-12's FINAL CATALOGUE. Every function 211 and 212 create or restate (parsed from the
# files), its provolatile in the live database, whether its body draws randomness itself, and whether it REACHES a drawer
# through any chain of calls (a transitive closure over every public function's source, by name followed by "(").
# Prints: the table, then the violators (a function that reaches a drawer and is not volatile): must be EMPTY.
DB=$1; MIG=$2; export PGHOST=/var/tmp/rv7 PGUSER=postgres
NAMES=$(cat $MIG/211_*.sql $MIG/212_*.sql | grep -oiE 'create( or replace)? function +(public\.)?"?[a-z_0-9]+' | sed -E 's/.*function +(public\.)?"?//I' | tr 'A-Z' 'a-z' | sort -u | tr '\n' ',' | sed 's/,$//')
psql -qAtF' | ' -d $DB -v names="$NAMES" <<'SQL'
with recursive fn as (
  select p.oid, p.proname, p.provolatile, coalesce(p.prosrc,'') || coalesce(pg_get_function_sqlbody(p.oid),'') as src
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'),
drawer as (select oid, proname from fn where src ~* '(gen_random_uuid|gen_random_bytes|uuid_generate_v[14]|\mrandom\s*\(|setseed|clock_timestamp|nextval\s*\()'),
reach(oid, proname, via) as (
  select oid, proname, proname::text from drawer
  union
  select f.oid, f.proname, r.via from fn f join reach r on f.src ~ ('\m' || r.proname || '\s*\(') and f.oid <> r.oid)
select '== ' || count(*) || ' functions named by 211/212' from fn where proname = any(string_to_array(:'names', ','))
union all
select f.proname::text || ' | ' || f.provolatile::text || ' | draws=' || (f.oid in (select oid from drawer)) || ' | reaches=' || coalesce((select string_agg(distinct via, '+') from reach r where r.oid = f.oid), '-')
  from fn f where f.proname = any(string_to_array(:'names', ','))
; with recursive fn as (select p.oid, p.proname, p.provolatile, coalesce(p.prosrc,'') || coalesce(pg_get_function_sqlbody(p.oid),'') as src from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'), drawer as (select oid, proname from fn where src ~* '(gen_random_uuid|gen_random_bytes|uuid_generate_v[14]|\mrandom\s*\(|setseed|clock_timestamp|nextval\s*\()'), reach(oid, proname, via) as (select oid, proname, proname::text from drawer union select f.oid, f.proname, r.via from fn f join reach r on f.src ~ ('\m' || r.proname || '\s*\(') and f.oid <> r.oid) select '== VIOLATORS (reaches a drawer, not volatile; any public function): must be empty'
union all select f.proname::text || ' | ' || f.provolatile::text || ' | via ' || string_agg(distinct r.via, '+') from fn f join reach r on r.oid = f.oid where f.provolatile::text <> 'v' group by f.proname, f.provolatile::text
; select '== named by 211/212 but absent from the catalogue: ' || coalesce(string_agg(x, ','), 'none') from unnest(string_to_array(:'names', ',')) x where x not in (select p.proname::text from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public');
SQL
