#!/bin/sh
# R3-TELL unit 1: THE POSSIBLE-WORLD MEASURE, ONE COMMAND.   sh tell.sh <worktree> <outdir> <template db: x211 + the tree's 212> [N=2]
# Four shards of tell.probe.jsx on the scratch PG16 (/var/tmp/rv7; databases tell_<outdir>_<shard>), then tell-an.mjs writes
# the table (tell-table.txt). MEASURE ONLY: the exit is the analyzer's (0), not a gate.
W=$1; O=$2; T=$3; N=${4:-2}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
echo "start $(date -u +%H:%M:%S)" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=tell_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/tell.probe.jsx RV9_N=$N RV9_SHARD=$s/4 RV9_OUT=$O/shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%H:%M:%S)" >> $O/window.txt
cat $O/done.txt
node $P/tell-an.mjs $O > $O/tell-table.txt; rc=$?; head -40 $O/tell-table.txt; exit $rc
