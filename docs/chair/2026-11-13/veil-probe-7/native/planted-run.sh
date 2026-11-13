#!/bin/sh
# planted-run.sh <side master|tip> <src worktree> <chains> <tag> : the review's planted.probe.jsx, two shards in parallel, then its summary
SP=/tmp/claude-0/-home-user-settlement-engine/8fc63fbf-b962-558f-b5bd-0662f19e4c79/scratchpad; R=$SP/rv5/docs/chair/2026-11-13/review-veil-5-probes
SIDE=$1; SRC=$2; CH=$3; TAG=$4; O=$SP/p7/planted; mkdir -p $O
export PGHOST=/var/tmp/cv7
for s in 0 1; do
  (cd $SRC && RV5_SIDE=$SIDE RV5_SRC=$SRC RV5_PROBE=planted.probe.jsx RV5_CHAINS=$CH RV5_SEEDS=2 RV5_SHARD=$s/2 RV5_OUT=$O/$TAG-$s.json \
     npx vitest run --config $R/vitest.config.mjs > $O/$TAG-$s.log 2>&1; echo "shard $s exit $?" >> $O/$TAG-$s.log) &
done
wait
node $R/planted-summary.mjs $O/$TAG-0.json $O/$TAG-1.json > $O/$TAG.txt 2>&1; echo "summary exit $?" >> $O/$TAG-0.log
