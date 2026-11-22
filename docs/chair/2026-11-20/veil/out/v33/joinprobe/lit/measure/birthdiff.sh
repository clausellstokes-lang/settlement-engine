#!/bin/sh
# V33-JOINPROBE PASS 2: four shards of birthdiff.probe.jsx over a pool's seeds, then the table.   sh birthdiff.sh <worktree> <pooldir> <outdir>
W=$1; D=$2; O=$3; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/birthdiff-done.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE RV6_SRC=$W RV9_PROBE=$P/birthdiff.probe.jsx RV9_POOL=$D RV9_SHARD=$s/4 RV9_OUT=$O/birthdiff-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/birthdiff-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/birthdiff-done.txt) & done; wait
cat $O/birthdiff-done.txt
[ "$(grep -c 'rc=0' $O/birthdiff-done.txt)" = 4 ] || { echo "A BIRTHDIFF SHARD FAILED"; exit 2; }
node $P/birthdiff-an.mjs $O > $O/birthdiff-table.txt; rc=$?; tail -1 $O/birthdiff-table.txt; exit $rc
