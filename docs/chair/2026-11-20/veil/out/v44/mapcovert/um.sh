#!/bin/sh
# R4I-MEASURE U and M, ONE COMMAND:  sh um.sh <tree> <outdir> <template db> <set: stored|pool> <stored or pool dir>
# Four shards of um.probe.jsx; env passes through (UM_U=1 the unmarked production read, UM_M=1 M's counts on the projection,
# MEAS_SEEDS, MEAS_SHARDS). Then um-an.mjs <outdir>. Exit 0 only when every shard ends rc=0 (2 when one does not), and, with
# UM_ASSERT=map (MAPCOVERT-RED, VEIL-44), um-an.mjs exits 1 when a map read at Reveal off carries a covert copy or sentence.
W=$1; O=$2; T=$3; S=$4; D=$5; P=$(cd "$(dirname "$0")" && pwd); N=${MEAS_SHARDS:-4}; mkdir -p $O; rm -f $O/done.txt
case $S in pool) X="RV9_POOL_DIR=$D";; *) X="RV9_STORED_DIR=$D";; esac
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) tpl $T set $S $D U=${UM_U:-0} M=${UM_M:-0} ASSERT=${UM_ASSERT:-none}" > $O/window.txt
cd $W
s=0; while [ $s -lt $N ]; do (eval "env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod MEAS_COMMON=$P/../../v27/tell/measure/tell-common.mjs RV9_SERVER_TPL=$T RV9_SERVER_DB=meas_um_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/um.probe.jsx RV9_SET=$S $X RV9_SHARD=$s/$N UM_OUT=$O/um-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs" > $O/um-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & s=$((s+1)); done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = "$N" ] || { echo "A SHARD FAILED"; exit 2; }
node $P/um-an.mjs $O > $O/table.txt; rc=$?; cat $O/table.txt; exit $rc
