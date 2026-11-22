#!/bin/sh
# R3-TELL-8 step 1: the measure probe, four shards (as tell2.sh runs the gate's towns).  sh m1.sh <worktree> <outdir> <template db> [only seeds]
W=$1; O=$2; T=$3; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ)" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=${TELL_DB:-t8}_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/m1.probe.jsx RV9_N=2 RV9_SHARD=$s/4 RV9_ONLY=$4 RV9_OUT=$O/m1-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/m1-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = 4 ]
