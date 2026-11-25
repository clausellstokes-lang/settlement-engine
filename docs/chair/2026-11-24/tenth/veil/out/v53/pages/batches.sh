#!/bin/sh
# VEIL-53, RULING V6 (a) under the chair's 22:48 law (no run over 20 minutes without its partial results in a pushed file):
# the slice (every 12th birth of the banked 720) in batches of 15 seeds through PG_ONLY (the restore loop on each), one
# shard; after each batch slice-an.mjs re-reads every row so far and the table is committed and pushed.
# sh batches.sh <worktree> <outdir>
W=$1; O=$2; P=$(cd "$(dirname "$0")" && pwd); DOCS=/home/user/settlement-engine; mkdir -p $O/rows
SEEDS=$(cd $W && node -e "import('./tests/components/pageCensusWalk.shared.mjs').then(W=>{console.log(W.censusPlan('r2',1).filter((r,i)=>i%12===0).map(r=>r.seed).join(' '))})")
set -- $SEEDS; b=0
while [ $# -gt 0 ]; do
  batch=""; n=0; while [ $# -gt 0 ] && [ $n -lt 15 ]; do batch="$batch,$1"; shift; n=$((n+1)); done; batch=${batch#,}; b=$((b+1))
  [ -f $O/batch$b.done ] && continue
  while :; do
    (cd $W && sh scripts/gate-mutex.sh --run -- env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE \
      RV6_SRC=$W RV9_PROBE=$P/pages.probe.mjs PG_MODE=F PG_SHARD=0/1 PG_OUT=$O/rows PG_ONLY=$batch PG_SERVER_EVERY=0 PG_DUMP_VIEWS=1 \
      npx vitest run --config $P/pages.vitest.config.mjs > $O/batch$b.log 2>&1); rc=$?; [ $rc -ne 3 ] && break; sleep 30
  done
  echo "batch $b rc=$rc $(date -u +%H:%M:%S) seeds $batch" >> $O/batches.txt; touch $O/batch$b.done
  node $P/slice-an.mjs $O/rows > $P/slice-table.txt 2>&1; cp $O/batches.txt $P/batches.txt
  (cd $DOCS && git add $P/slice-table.txt $P/batches.txt && git commit -q -m "docs(veil, VEIL-53 V6 (a)): the FAIL-CLOSED PAGES slice, batch $b (partial)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1RXpsxm5sWDw7RYQdF" && git push -q origin lane/veil-53-2026-11-24) >> $O/push.log 2>&1
done
echo "ALL DONE $(date -u +%H:%M:%S)" >> $O/batches.txt
