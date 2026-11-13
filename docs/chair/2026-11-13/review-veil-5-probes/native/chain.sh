#!/bin/sh
# chain.sh <db> <spec> [migrations dir]
#   spec: "211" builds 001..211; "203+211" builds 001..203 then 211 alone; "203+211+204-210" then 204..210 after.
# Each file runs in its own transaction, as `supabase db push` does. LOCAL scratch cluster only:
#   PGHOST=/var/tmp/rv5 (unix socket, trust auth, listen_addresses=''), user postgres.
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
DB=$1; SPEC=$2; MIG=${3:-${RV5_MIG:?set RV5_MIG or pass the migrations dir}}
export PGHOST=${PGHOST:-/var/tmp/rv5} PGUSER=postgres
TMP=${TMPDIR:-/var/tmp}/rv5mig.$DB.sql
psql -qd postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
psql -qd $DB -v ON_ERROR_STOP=1 -f $HERE/scaffold.sql >/dev/null 2>&1 || echo "scaffold failed"
apply() { # lo hi
  for f in $(ls $MIG | grep -E '^[0-9]{3}_.*\.sql$' | sort); do
    n=$(expr $(echo $f | cut -c1-3) + 0); [ $n -ge $1 ] && [ $n -le $2 ] || continue
    sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' $MIG/$f > $TMP
    psql -qd $DB -1 -v ON_ERROR_STOP=1 -f $TMP >/dev/null 2>$TMP.err || echo "FAIL $f: $(head -c 300 $TMP.err)"
  done
}
first=1
for part in $(echo $SPEC | tr '+' ' '); do
  case $part in
    *-*) lo=${part%-*}; hi=${part#*-};;
    *) if [ $first = 1 ]; then lo=1; hi=$part; else lo=$part; hi=$part; fi;;
  esac
  apply $lo $hi; first=0
done
psql -qd $DB -v ON_ERROR_STOP=1 >/dev/null <<SQL
insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222') on conflict do nothing;
insert into public.profiles (id) values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222') on conflict do nothing;
update public.profiles set role = 'developer' where id = '11111111-1111-1111-1111-111111111111';
create or replace function public.current_user_has_premium_access() returns boolean language sql stable as \$f\$ select true \$f\$;
SQL
echo "built $DB spec $SPEC"
