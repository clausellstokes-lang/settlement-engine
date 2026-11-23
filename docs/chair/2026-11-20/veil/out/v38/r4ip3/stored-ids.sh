#!/bin/sh
# R4I-PAGE-3 ST, ONE COMMAND (stored.sh's shape): THE STORED ARM'S PERSON-ID PROBE and its table.
#   sh stored-ids.sh <worktree> <stored dir> <outdir> <template db: v27x211 + the tree's 212> [db prefix=sid]
# Four shards of stored-ids.probe.jsx read every stored document of <stored dir> (dump.sh's output) through <worktree>'s
# twin and server (databases <prefix>_<outdir basename>_<shard>, local PGHOST=/var/tmp/rv7 only). Env passes through:
# RV9_LIMIT, RV9_BIRTH (1: stored-only keys against the tree's own birth of each seed). Then ids-an.mjs <outdir>.
W=$1; S=$2; O=$3; T=$4; X=${5:-sid}; P=$(cd "$(dirname "$0")" && pwd)
mkdir -p $O; rm -f $O/done.txt
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) stored $S" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=${X}_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/stored-ids.probe.jsx RV9_STORED_DIR=$S RV9_OUT_DIR=$O RV9_SHARD=$s/4 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/ids-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || { echo "A SHARD FAILED"; exit 2; }
node $P/ids-an.mjs $O > $O/ids-table.txt; rc=$?; cat $O/ids-table.txt; exit $rc
