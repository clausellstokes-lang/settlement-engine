#!/bin/sh
# COHERENCE-VEIL-3: run the read-only pre-deploy block on a scratch database and prove it wrote nothing.
#   PGHOST=<socket dir> PGUSER=postgres sh docs/chair/2026-11-12/veil-probe-3/predeploy-run.sh <database>
# Before and after: the md5 of every settlements row, of every public function's definition, and the
# table's insert/update/delete counters; then the negative control (a write inside a READ ONLY
# transaction, as the same superuser, must be refused).
DB="$1"
BLOCK="$(dirname "$0")/../veil-probe-2/predeploy-readonly.sql"
state() {
  psql -d "$DB" -Atc "select md5(string_agg(md5(s::text), '' order by id)) from public.settlements s" &&
  psql -d "$DB" -Atc "select md5(string_agg(md5(pg_get_functiondef(p.oid)), '' order by p.oid)) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prokind = 'f'" &&
  psql -d "$DB" -Atc "select n_tup_ins + n_tup_upd + n_tup_del from pg_stat_user_tables where relid = 'public.settlements'::regclass"
}
echo "== before"; state
echo "== the block (ON_ERROR_STOP, superuser)"
psql -d "$DB" -v ON_ERROR_STOP=1 -f "$BLOCK"; echo "block exit $?"
sleep 1
echo "== after"; state
echo "== negative control: a write inside a READ ONLY transaction"
psql -d "$DB" -v ON_ERROR_STOP=1 -c "begin transaction read only; update public.settlements set name = name; rollback;" 2>&1; echo "control exit $?"
