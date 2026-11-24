#!/bin/sh
# VEIL-52 (1)(a): A COPY OF wd.sh (b126c9813) for snap.probe.jsx (SNAP_G, SNAP_TICKS, SNAP_PLANT pass through). V43-MEASURE, ONE COMMAND PER FORM (run inside `sh scripts/gate-mutex.sh --run --` from the joined tree):
#   sh wd.sh <worktree> <outdir> <template db> <born|stored> [stored dir (dump.probe.jsx's output)]
# Four shards of wd.probe.jsx (databases v43x_<form>_<shard>, local PGHOST=/var/tmp/rv7 only), then wd-an.mjs over the shards
# (<outdir>/snap-table.txt). RV9_PICK=<k> takes every k-th birth of each shard (the cost shard); WD_SHARDS=<n> (default 4).
W=$1; O=$2; T=$3; F=$4; S=$5; P=$(cd "$(dirname "$0")" && pwd); N=${WD_SHARDS:-4}; mkdir -p $O; rm -f $O/done.txt
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(env -u GIT_DIR -u GIT_WORK_TREE git -C $W rev-parse HEAD) form $F pick ${RV9_PICK:-1} shards $N" > $O/window.txt
cd $W
s=0; while [ $s -lt $N ]; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 PGUSER=postgres RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=v43x52sn_$F RV9_PROBE=$P/snap.probe.jsx RV9_FORM=$F RV9_STORED_DIR=$S RV9_N=2 RV9_SHARD=$s/$N RV9_OUT=$O/snap-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/snap-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & s=$((s+1)); done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = "$N" ] || { echo "A SNAP SHARD FAILED"; exit 2; }
node $P/snap-an.mjs $O > $O/snap-table.txt; rc=$?; tail -3 $O/snap-table.txt; exit $rc
