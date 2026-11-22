#!/bin/sh
# V33-LP PIECE 2, ONE COMMAND: THE READ-STORED MODE (legacy.probe.jsx, RV9_MODE=stored) and the tell's analyzer on it.
#   sh stored.sh <worktree> <stored dir> <outdir> <template db: createdb -T v27x211, then the tree's 212> [db prefix=lp]
# Four shards read every stored document of <stored dir> (dump.sh's output) through <worktree>'s twin and its server
# (databases <prefix>_<outdir basename>_<shard>, local PGHOST=/var/tmp/rv7 only). Env passes through: RV9_ROLES, RV9_LIMIT,
# RV9_EXTRA, RV9_SERVER, RV9_SERVER_SAMPLE. Then tell2-an.mjs <outdir> <outdir> > <outdir>/tell2-table.txt (its exit kept
# in <outdir>/an-rc.txt: 1 is a red gate, a MEASURE here) and lp-an.mjs <outdir> > <outdir>/lp-table.txt.
W=$1; S=$2; O=$3; T=$4; X=${5:-lp}; P=$(cd "$(dirname "$0")" && pwd); M=$W/docs/chair/2026-11-20/veil/out/v27/tell2/measure
mkdir -p $O; rm -f $O/done.txt
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) stored $S" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=${X}_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/legacy.probe.jsx RV9_MODE=stored RV9_STORED_DIR=$S RV9_OUT_DIR=$O RV9_SHARD=$s/4 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/stored-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || { echo "A STORED SHARD FAILED"; exit 2; }
node $M/tell2-an.mjs $O $O > $O/tell2-table.txt; echo "tell2-an rc=$?" > $O/an-rc.txt
[ -f $P/lp-an.mjs ] && node $P/lp-an.mjs $O > $O/lp-table.txt
cat $O/an-rc.txt; grep -E '^GATE|^TODAY|^THE TOWNS LOWER' $O/tell2-table.txt; exit 0
