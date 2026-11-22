#!/bin/sh
# V33-C1 PIECE 3, ONE COMMAND: sh prose.sh <worktree> <stored dir> <outdir>   (four shards of prose.probe.jsx; env RV9_LIMIT passes)
W=$1; S=$2; O=$3; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) stored $S" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE RV6_SRC=$W RV9_PROBE=$P/prose.probe.jsx RV9_STORED_DIR=$S RV9_OUT_DIR=$O RV9_SHARD=$s/4 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/prose-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt; [ "$(grep -c 'rc=0' $O/done.txt)" = 4 ]
