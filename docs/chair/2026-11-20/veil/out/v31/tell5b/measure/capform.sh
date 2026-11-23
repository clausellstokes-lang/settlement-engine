#!/bin/sh
# R3-TELL-5b unit (iii): capform.probe.jsx, four shards, twin only.   sh capform.sh <worktree> <outdir> <towns|pool> [pooldir] [stride]
W=$1; O=$2; M=$3; D=${4:-/var/tmp/v18/t2/pool-t2sig-2}; ST=${5:-1}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done-$M.txt
echo "start $M $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE RV6_SRC=$W RV9_PROBE=$P/capform.probe.jsx RV9_MODE=$M RV9_POOL_DIR=$D RV9_STRIDE=$ST RV9_N=2 RV9_SHARD=$s/4 RV9_OUT=$O/cap-$M-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/cap-$M-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done-$M.txt) & done; wait
echo "end $M $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done-$M.txt; [ "$(grep -c 'rc=0' $O/done-$M.txt)" = 4 ]
