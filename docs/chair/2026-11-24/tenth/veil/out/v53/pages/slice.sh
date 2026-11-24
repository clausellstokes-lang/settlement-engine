#!/bin/sh
# VEIL-53, RULING V6 (a): PAGES' probe (V43's pages.probe.mjs, COPIED VERBATIM from b126c9813 beside this file) in (F) mode on
# a SLICE of the banked 720 on the trial join: every PICK-th birth, the restore loop on every birth of the slice, the views
# dumped (term (2)'s walk), NO server sample (PG_SERVER_EVERY=0: no database is opened). Run from the tree, inside
#   sh scripts/gate-mutex.sh --run -- sh <this> <worktree> <outdir> [pick=12] [shards=2]
W=$1; O=$2; K=${3:-12}; N=${4:-2}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O/rows; rm -f $O/done-F.txt
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(env -u GIT_DIR -u GIT_WORK_TREE git -C $W rev-parse HEAD) pick $K shards $N" >> $O/window.txt
cd $W
s=0; while [ $s -lt $N ]; do
  (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE \
    RV6_SRC=$W RV9_PROBE=$P/pages.probe.mjs PG_MODE=F PG_SHARD=$s/$N PG_OUT=$O/rows PG_PICK=$K PG_SERVER_EVERY=0 PG_DUMP_VIEWS=1 \
    npx vitest run --config $P/pages.vitest.config.mjs > $O/F-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done-F.txt) &
  s=$((s+1)); done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done-F.txt; [ "$(grep -c 'rc=0' $O/done-F.txt)" = "$N" ]
