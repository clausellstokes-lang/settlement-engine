#!/bin/sh
# R3-TELL-5 unit (ii) STEP 0 (VEIL-31's builder): step0.probe.jsx over the gate's 140 births, four shards, twin and server
# (databases t5s0_<shard>, from template <tpl>), every setting but g:111, Reveal off and on.
#   sh step0.sh <worktree> <outdir> <tpl>
W=$1; O=$2; T=$3; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ)" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=t5s0 RV9_PROBE=$P/step0.probe.jsx RV9_N=2 RV9_SHARD=$s/4 RV9_OUT=$O/step0-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/step0-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || { echo "A SHARD FAILED"; exit 2; }
