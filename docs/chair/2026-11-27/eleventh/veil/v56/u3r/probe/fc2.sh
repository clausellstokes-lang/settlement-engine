#!/bin/sh
# FROZEN-COVERT MEASURE (VEIL-52, RULING V28 (2)): a copy of VEIL-44's um.sh (6edc79094), run the same way.
#   sh fc.sh <tree> <outdir> <template db> <stored dir>
# Four shards of fc.probe.jsx under /var/tmp/v18/rv9/vitest.config.mjs; then fc-an.mjs <outdir>. Exit 0 only when every
# shard ends rc=0 (2 when one does not). FC_MASTER: master's tree (default /home/user/wt/master). MEAS_COMMON: absolute.
W=$1; O=$2; T=$3; D=$4; P=$(cd "$(dirname "$0")" && pwd); N=${MEAS_SHARDS:-4}; mkdir -p $O; rm -f $O/done.txt
MC=${MEAS_COMMON:-/home/user/wt/i44/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs}; FM=${FC_MASTER:-/home/user/wt/master}
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) master $FM at $(git -C $FM rev-parse HEAD) tpl $T set $D" > $O/window.txt
cd $W
s=0; while [ $s -lt $N ]; do (eval "env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod MEAS_COMMON=$MC FC_MASTER=$FM RV9_SERVER_TPL=$T RV9_SERVER_DB=meas_fc_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/fc2.probe.jsx RV9_SET=stored RV9_STORED_DIR=$D RV9_SHARD=$s/$N FC_OUT=$O/fc-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs" > $O/fc-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & s=$((s+1)); done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = "$N" ] || { echo "A SHARD FAILED"; exit 2; }
node $P/fc2-an.mjs $O > $O/table.txt; rc=$?; cat $O/table.txt; exit $rc
