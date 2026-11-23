#!/bin/sh
# chain.sh <db> <through> <migdir> [extra file applied after]: native chain 001..through, each file in its own transaction.
set -u
DB=$1; THROUGH=$2; MIG=$3; EXTRA=${4:-}
S=/tmp/claude-0/-home-user-settlement-engine/f87af9a7-d5c7-5553-9326-6c79fdba1af5/scratchpad
export PGHOST=/var/tmp/cv5 PGUSER=postgres
psql -qd postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
psql -qd $DB -v ON_ERROR_STOP=1 -f $S/nat/scaffold.sql >/dev/null 2>&1 || echo "scaffold failed"
apply() { sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' "$1" > $S/nat/mig.$DB.sql
  psql -qd $DB -1 -v ON_ERROR_STOP=1 -f $S/nat/mig.$DB.sql >/dev/null 2>$S/nat/err.$DB.txt || echo "FAIL $(basename $1): $(head -c 300 $S/nat/err.$DB.txt)"; }
for f in $(ls $MIG | grep -E '^[0-9]{3}_.*\.sql$' | sort); do
  n=$(echo $f | cut -c1-3); [ $(expr $n + 0) -le $THROUGH ] || continue
  apply $MIG/$f
done
[ -n "$EXTRA" ] && apply "$EXTRA"
echo "built $DB through $THROUGH ${EXTRA:++ $(basename $EXTRA)}"
