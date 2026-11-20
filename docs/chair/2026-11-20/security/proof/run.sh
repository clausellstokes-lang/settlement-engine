#!/bin/sh
# run.sh <kitdir> <migdir> <outdir> — the whole proof: two scratch databases from the same chain,
# `pre` (left as production is) and `post` (EMERGENCY_REVOKE.sql applied, twice); the reader's
# calls, the check, the product flows and the full call harness on both; outputs into <outdir>.
set -u
KIT=$1; MIG=$2; OUT=$3; P=$(cd "$(dirname "$0")" && pwd); SEC=$(cd "$P/.." && pwd)
export PGHOST=/var/tmp/sg PGUSER=postgres
mkdir -p $OUT
for db in pre post; do
  sh $KIT/chain.sh $db $MIG 2>&1 | grep -v NOTICE
  psql -qX -d $db -v DBNAME=$db -f $P/plant.sql
  psql -qXAt -d $db -f $P/plant2.sql | grep -vE "^f(\|f)?$"
done
psql -qXAt -d pre -f $P/calls.sql > $OUT/calls.tsv
for c in A_KEYS B_REVOKE_LIST C_PREFLIGHT D_SECRET E_ANON_CATALOGUE; do psql -qX -x -d pre -f $SEC/CHECK_$c.sql; done > $OUT/check-before.txt 2>&1
psql -qX -d post -v ON_ERROR_STOP=1 -f $SEC/EMERGENCY_REVOKE.sql > $OUT/revoke-1.txt 2>&1; echo "revoke run 1 exit=$?"
psql -qX -d post -v ON_ERROR_STOP=1 -f $SEC/EMERGENCY_REVOKE.sql > $OUT/revoke-2.txt 2>&1; echo "revoke run 2 exit=$?"
for c in A_KEYS B_REVOKE_LIST C_PREFLIGHT D_SECRET E_ANON_CATALOGUE; do psql -qX -x -d post -f $SEC/CHECK_$c.sql; done > $OUT/check-after.txt 2>&1
for db in pre post; do
  psql -qX -d $db -f $P/reader.sql 2>&1 | grep -vE "^f(\|f)?$" > $OUT/reader-$db.txt
  psql -qX -d $db -f $P/flows.sql 2>&1 | grep -vE "^f(\|f)?$" > $OUT/flows-$db.txt
  psql -qX -d $db -f $P/admin-doors.sql 2>&1 | grep -vE "^f(\|f)?$" | sed 's#psql:[^ ]*admin-doors.sql:##' > $OUT/admin-doors-$db.txt
  psql -qX -d $db -f $P/actor.sql 2>&1 | grep -vE "^f(\|f)?$" | sed 's#psql:[^ ]*actor.sql:##' > $OUT/actor-$db.txt
  sh $P/harness.sh $db $OUT/calls.tsv > $OUT/harness-$db.tsv
done
