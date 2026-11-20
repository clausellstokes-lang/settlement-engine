#!/bin/sh
# chain.sh <db> <migrations dir> — builds every NNN_*.sql in the dir, each in its own transaction
# (as `supabase db push` does), on a LOCAL scratch cluster: PGHOST=/var/tmp/sg (unix socket only).
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
DB=$1; MIG=$2
export PGHOST=${PGHOST:-/var/tmp/sg} PGUSER=postgres
TMP=/var/tmp/sg/mig.$DB.sql
psql -qd postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
psql -qd $DB -v ON_ERROR_STOP=1 -f $HERE/scaffold.sql >/dev/null 2>&1 || echo "scaffold failed"
for f in $(ls $MIG | grep -E '^[0-9]{3}_.*\.sql$' | sort); do
  sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' $MIG/$f > $TMP
  psql -qd $DB -1 -v ON_ERROR_STOP=1 -f $TMP >/dev/null 2>$TMP.err || echo "FAIL $f: $(head -c 300 $TMP.err)"
done
psql -qd $DB -v ON_ERROR_STOP=1 >/dev/null <<SQL
insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222') on conflict do nothing;
insert into public.profiles (id) values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222') on conflict do nothing;
SQL
echo "built $DB from $MIG"
