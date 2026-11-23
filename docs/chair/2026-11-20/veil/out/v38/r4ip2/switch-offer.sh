#!/bin/sh
# R4I-PAGE-2 S1, ONE COMMAND:  sh switch-offer.sh <worktree> <outdir> [pooldir]
# Without <pooldir>: the tell gate's 140 births (92 + 48). With it: every seed of its pool-shard*.json / poolb-shard*.json.
# Four shards through /var/tmp/v18/rv9/vitest.config.mjs. EXIT 0 only when every read is equal to the reference.
W=$1; O=$2; D=${3:-}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
if [ -n "$D" ]; then SET="RV9_SET=pool RV9_POOL_DIR=$D"; else SET="RV9_SET=towns"; fi
cd $W
for s in 0 1 2 3; do (eval "env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE RV6_SRC=$W RV9_PROBE=$P/switch-offer.probe.jsx $SET RV9_SHARD=$s/4 RV9_OUT=$O/offer-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs" > $O/offer-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
cat $O/done.txt
node -e "const fs=require('fs');const t={reads:0,differ:0,present:0,faults:[]};for(const f of fs.readdirSync('$O').filter(f=>/^offer-shard\d+\.json$/.test(f))){const j=JSON.parse(fs.readFileSync('$O/'+f));t.reads+=j.reads;t.differ+=j.differ;t.present+=j.present;t.faults.push(...j.faults)}console.log('reads',t.reads,'| differ from the reference',t.differ,'| groupings present (reference)',t.present);for(const x of t.faults.slice(0,20))console.log('  ',x);process.exit(t.differ?1:0)"; rc=$?
[ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || exit 2; exit $rc
