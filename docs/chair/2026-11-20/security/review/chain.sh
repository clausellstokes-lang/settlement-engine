#!/bin/sh
# REVIEW-GRANTS-1 chain: chain.sh <db> <migrations dir> [last NNN] — the builder's scaffold, my own cluster
# (PGHOST=/var/tmp/rg1, unix socket only). Each NNN_*.sql in its own transaction, pg_cron/pg_net stubbed.
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
DB=$1; MIG=$2; LAST=${3:-999}
export PGHOST=/var/tmp/rg1 PGUSER=postgres
TMP=/var/tmp/rg1/mig.$DB.sql
psql -qd postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
psql -qd $DB -v ON_ERROR_STOP=1 -f $HERE/../proof/scaffold.sql >/dev/null 2>&1 || echo "scaffold failed"
for f in $(ls $MIG | grep -E '^[0-9]{3}_.*\.sql$' | sort); do
  n=$(echo $f | cut -c1-3); [ "$n" -le "$LAST" ] || continue
  sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' $MIG/$f > $TMP
  psql -qd $DB -1 -v ON_ERROR_STOP=1 -f $TMP >/dev/null 2>$TMP.err || echo "FAIL $f: $(head -c 300 $TMP.err)"
done
echo "built $DB from $MIG up to $LAST"
