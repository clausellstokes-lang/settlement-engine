#!/bin/sh
# V39-C2M, ONE COMMAND PER MODE: sh shards.sh <scratch tree> <stored dir> <outdir> <m1|m3> [<cdocs dir>]   (four shards of c2m.probe.jsx)
W=$1; S=$2; O=$3; MODE=$4; CD=$5; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/$MODE-done.txt
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) mode $MODE tree $W at $(git -C $W rev-parse HEAD) + $(git -C $W diff --stat | tail -1) stored $S" > $O/$MODE-window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE RV6_SRC=$W RV9_PROBE=$P/c2m.probe.jsx RV9_STORED_DIR=$S RV9_OUT_DIR=$O RV9_MODE=$MODE ${CD:+RV9_CDOCS=$CD} RV9_SHARD=$s/4 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/$MODE-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/$MODE-done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/$MODE-window.txt
cat $O/$MODE-done.txt; [ "$(grep -c 'rc=0' $O/$MODE-done.txt)" = 4 ]
