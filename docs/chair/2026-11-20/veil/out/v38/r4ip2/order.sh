#!/bin/sh
# R4I-PAGE-2 item O, ONE COMMAND:  sh order.sh <worktree> <outdir> [template db, e.g. v28tpl; '' = twin only] [pooldir]
# Without <pooldir>: the tell gate's 140 births (92 + 48). With it: every seed of its pool-shard*.json / poolb-shard*.json.
# Four shards of order.probe.jsx through /var/tmp/v18/rv9/vitest.config.mjs; then order-an.mjs prints the counts
# (<outdir>/order-table.txt). RV9_RENDER=0 in the caller's environment skips the render (served order only).
W=$1; O=$2; T=${3:-}; D=${4:-}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
if [ -n "$D" ]; then SET="RV9_SET=pool RV9_POOL_DIR=$D"; else SET="RV9_SET=towns"; fi
cd $W
for s in 0 1 2 3; do (eval "env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=r4ip2_order RV9_PROBE=$P/order.probe.jsx $SET RV9_SHARD=$s/4 RV9_OUT=$O/order-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs" > $O/order-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
cat $O/done.txt
node $P/order-an.mjs $O > $O/order-table.txt; rc=$?; cat $O/order-table.txt; [ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || exit 2; exit $rc
