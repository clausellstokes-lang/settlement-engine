#!/bin/sh
# V33-LP PIECE 1, ONE COMMAND: sh dump.sh <engine tree> <outdir> [pool=/var/tmp/v18/t2/pool-r5c-1]
#   Four shards of dump.probe.jsx with the ENGINE TREE's own vitest and node_modules (run from that tree; the probe imports
#   the tree's src by absolute path). Writes NOTHING in the engine tree outside its node_modules. Env LP_A / LP_B / LP_TOWNS
#   pass through (defaults 45 / 30 / 1: 180 part-A, 120 part-B, the 140 towns).
W=$1; O=$2; F=${3:-/var/tmp/v18/t2/pool-r5c-1}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
cd $W
echo "dump $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD)" > $O/meta.txt
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE RV6_SRC=$W RV9_PROBE=$P/dump.probe.jsx LP_POOL=$F LP_OUT=$O RV9_SHARD=$s/4 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/dump-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/meta.txt
cat $O/done.txt; [ "$(grep -c 'rc=0' $O/done.txt)" = 4 ]
