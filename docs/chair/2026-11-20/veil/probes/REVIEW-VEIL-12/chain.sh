#!/bin/sh
# chain.sh <db> <list: N | a+b+c where a may be a ceiling "203"> <migdir>
set -u
DB=$1; LIST=$2; MIG=$3
S=/var/tmp/v16/rv12
export PGHOST=/var/tmp/rv7 PGUSER=postgres
psql -qd postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
psql -qd $DB -v ON_ERROR_STOP=1 -f $S/nat/scaffold.sql >/dev/null 2>&1 || echo "scaffold failed"
apply() { sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' "$1" > $S/nat/mig.$DB.sql
  psql -qd $DB -1 -v ON_ERROR_STOP=1 -f $S/nat/mig.$DB.sql >/dev/null 2>$S/nat/err.$DB.txt || echo "FAIL $(basename $1): $(head -c 300 $S/nat/err.$DB.txt)"; }
CEIL=$(echo $LIST | cut -d+ -f1); EXTRA=$(echo $LIST | cut -s -d+ -f2-)
for f in $(ls $MIG | grep -E '^[0-9]{3}_.*\.sql$' | sort); do
  n=$(expr $(echo $f | cut -c1-3) + 0)
  if [ $n -le $CEIL ] || echo "+$EXTRA+" | grep -q "+$n+"; then apply $MIG/$f; fi
done
echo "built $DB ($LIST)"
