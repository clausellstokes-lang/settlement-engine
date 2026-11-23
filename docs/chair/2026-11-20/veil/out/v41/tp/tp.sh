#!/bin/sh
# V41-TP: sh tp.sh <worktree> <stored dir> <outdir> <template db> [db prefix=tp]; env RV9_LIMIT, RV9_SERVER pass through. Local PGHOST=/var/tmp/rv7 only.
W=$1; S=$2; O=$3; T=$4; X=${5:-tp}; P=/var/tmp/v18/out/v41/tp; mkdir -p $O; rm -f $O/done.txt $O/tp-shard*.json
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) stored $S tpl $T" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=${X}_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/tp.probe.jsx RV9_STORED_DIR=$S RV9_OUT_DIR=$O RV9_SEEDS=$RV9_SEEDS RV9_SKIP=$RV9_SKIP RV9_SHARD=$s/4 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/tp-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt; [ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || { echo "A SHARD FAILED"; exit 2; }
