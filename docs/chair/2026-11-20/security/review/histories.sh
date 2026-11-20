#!/bin/sh
# histories.sh <template db> <213 file> <prefix> <outdir> — REVIEW-GRANTS-1's four (five) histories, each a copy of
# the template: h1 fresh; h2 EMERGENCY_REVOKE.sql; h3 emergency + the ticket thread's two lines; h4 only the two BYOK
# key functions revoked by hand (from public, anon, authenticated); h5 the same two from anon, authenticated only.
# Then 213 twice on each; every public function's ACL, owner, prosecdef, proconfig and md5(def) compared.
set -u
T=$1; M=$2; P=$3; OUT=$4; SEC=$(cd "$(dirname "$0")/.." && pwd)
export PGHOST=/var/tmp/rg1 PGUSER=postgres
mkdir -p $OUT
for h in 1 2 3 4 5; do psql -qXd postgres -c "drop database if exists ${P}h$h with (force)" -c "create database ${P}h$h template $T" >/dev/null 2>&1; done
psql -qXd ${P}h2 -v ON_ERROR_STOP=1 -f $SEC/EMERGENCY_REVOKE.sql >/dev/null 2>&1; echo "h2 emergency exit=$?"
psql -qXd ${P}h3 -v ON_ERROR_STOP=1 -f $SEC/EMERGENCY_REVOKE.sql >/dev/null 2>&1; echo "h3 emergency exit=$?"
psql -qXd ${P}h3 -v ON_ERROR_STOP=1 -c "revoke execute on function public.list_ticket_thread(uuid) from public, anon;" -c "grant execute on function public.list_ticket_thread(uuid) to authenticated, service_role;" >/dev/null; echo "h3 ticket lines exit=$?"
psql -qXd ${P}h4 -v ON_ERROR_STOP=1 -c "revoke execute on function public._surveyor_byok_secret() from public, anon, authenticated;" -c "revoke execute on function public.surveyor_byok_get(uuid,text) from public, anon, authenticated;" >/dev/null; echo "h4 exit=$?"
psql -qXd ${P}h5 -v ON_ERROR_STOP=1 -c "revoke execute on function public._surveyor_byok_secret() from anon, authenticated;" -c "revoke execute on function public.surveyor_byok_get(uuid,text) from anon, authenticated;" >/dev/null; echo "h5 exit=$?"
ACL="select p.oid::regprocedure::text, p.proowner::regrole, p.prosecdef, coalesce(array_to_string(p.proconfig,','),''), coalesce(array_to_string(array(select x::text from unnest(p.proacl) x order by 1),','),'<default>'), md5(pg_get_functiondef(p.oid)) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prokind in ('f','p') order by 1"
for h in 1 2 3 4 5; do psql -qXAt -d ${P}h$h -c "$ACL" > $OUT/before-h$h.txt; done
for h in 1 2 3 4 5; do
  psql -qX -d ${P}h$h -1 -v ON_ERROR_STOP=1 -f $M > $OUT/apply-h$h-1.txt 2>&1; e1=$?
  psql -qX -d ${P}h$h -1 -v ON_ERROR_STOP=1 -f $M > $OUT/apply-h$h-2.txt 2>&1; e2=$?
  psql -qXAt -d ${P}h$h -c "$ACL" > $OUT/after-h$h.txt; echo "h$h: 213 exit=$e1,$e2 functions=$(wc -l < $OUT/after-h$h.txt) md5=$(md5sum < $OUT/after-h$h.txt | cut -c1-12)"
done
