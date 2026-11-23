#!/bin/sh
# V33-Q: q.probe.jsx, four shards (re-pointed by VEIL-40's T5, 2026-11-23: template v40t5q, databases v40t5m_<n>, pool pool-v40).   sh q.sh <worktree> <outdir> <towns|pool|insurg> [template db] [pooldir] [stride]
# towns reads the server too (databases v40t5m_<shard> from <template db>: v27x211 + the tree's 212); pool and insurg are twin only.
# Passed through from the caller's environment: RV9_ONLY (towns), RV9_PSIZES (pool: the sizes re-born), RV9_TARGET, RV9_POOL_SIZES (insurg).
W=$1; O=$2; M=$3; T=${4:-v40t5q}; D=${5:-/var/tmp/v18/t2/pool-v40}; ST=${6:-1}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done-$M.txt
echo "start $M $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=v40t5m RV9_PROBE=$P/q.probe.jsx RV9_MODE=$M RV9_POOL_DIR=$D RV9_STRIDE=$ST RV9_N=2 RV9_SHARD=$s/4 RV9_OUT=$O/q-$M-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/q-$M-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done-$M.txt) & done; wait
echo "end $M $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done-$M.txt; [ "$(grep -c 'rc=0' $O/done-$M.txt)" = 4 ]
