#!/bin/sh
# R3-CURE-5 unit 3: THE R3 GATE, ONE COMMAND.   sh gate.sh <worktree> <outdir> <template db with 211+212 applied> [N=2]
# Four shards of gate.probe.jsx on the scratch PG16 (/var/tmp/rv7; databases r3c5_*), then gate-an.mjs writes the table
# (gate-table.txt) and exits 1 where a town reads HIGHER or the probe threw (the gate's verdict), 0 otherwise.
# The template: createdb -T x211 <tpl> && psql -v ON_ERROR_STOP=1 -d <tpl> -f <worktree>/supabase/migrations/212_share_veil_later_cures.sql
W=$1; O=$2; T=$3; N=${4:-2}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=r3c5_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/gate.probe.jsx RV9_N=$N RV9_SHARD=$s/4 RV9_OUT=$O/shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
cat $O/done.txt
node $P/gate-an.mjs $O > $O/gate-table.txt; rc=$?; cat $O/gate-table.txt; exit $rc
