#!/bin/sh
# chain.sh <db> <through> [migdir]: build a native chain 001..through, each file in its own transaction (as `supabase db push` does).
set -u
DB=$1; THROUGH=$2; MIG=${3:-/tmp/claude-0/-home-user-settlement-engine/41bd6027-5844-54f9-b716-fc5eddd88409/scratchpad/veil/supabase/migrations}
export PGHOST=/var/tmp/rv3 PGUSER=postgres
psql -qd postgres -c "drop database if exists $DB with (force)" -c "create database $DB" >/dev/null
psql -qd $DB -v ON_ERROR_STOP=1 -f /tmp/claude-0/-home-user-settlement-engine/41bd6027-5844-54f9-b716-fc5eddd88409/scratchpad/nat/scaffold.sql >/dev/null 2>&1 || echo "scaffold failed"
for f in $(ls $MIG | grep -E '^[0-9]{3}_.*\.sql$' | sort); do
  n=$(echo $f | cut -c1-3); [ $(expr $n + 0) -le $THROUGH ] || continue
  sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' $MIG/$f > /tmp/rv3mig.$DB.sql
  psql -qd $DB -1 -v ON_ERROR_STOP=1 -f /tmp/rv3mig.$DB.sql >/dev/null 2>/tmp/rv3err.$DB.txt || { echo "FAIL $f: $(head -c 300 /tmp/rv3err.$DB.txt)"; }
done
echo "built $DB through $THROUGH"
