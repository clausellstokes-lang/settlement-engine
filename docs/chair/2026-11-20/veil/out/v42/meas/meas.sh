#!/bin/sh
# R4I-MEASURE, ONE COMMAND:  sh meas.sh <tree> <outdir> <template db> <set: towns|pool|stored|handreach> [pool or stored dir]
# Four shards of meas.probe.jsx (tonight-names.sh's shape) through /var/tmp/v18/rv9/vitest.config.mjs, run from <tree>
# (its src read by absolute path; nothing written in it). Env passes through: MEAS_BIJ (1 A/C, 0 B), MEAS_C (1: the
# stored-id search), MEAS_DOORS, MEAS_L2, MEAS_SEEDS, MEAS_FAMILIES, RV9_LIMIT, MEAS_SHARDS (default 4).
# Databases <outdir basename>_<shard> on PGHOST=/var/tmp/rv7 only. Exit 0 only when every shard ends rc=0.
W=$1; O=$2; T=$3; S=$4; D=${5:-}; P=$(cd "$(dirname "$0")" && pwd); N=${MEAS_SHARDS:-4}; mkdir -p $O; rm -f $O/done.txt
case $S in pool) X="RV9_POOL_DIR=$D";; stored) X="RV9_STORED_DIR=$D";; *) X="";; esac
DBP=meas_$(basename $O | tr -c 'a-z0-9\n' _)
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) tpl $T set $S $D bij=${MEAS_BIJ:-1} c=${MEAS_C:-0} doors=${MEAS_DOORS:-all}" > $O/window.txt
cd $W
s=0; while [ $s -lt $N ]; do (eval "env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod MEAS_BIJ_MOD=$P/../../../../../../../tests/security/personIdBijection.shared.mjs MEAS_COMMON=$P/../../v27/tell/measure/tell-common.mjs RV9_SERVER_TPL=$T RV9_SERVER_DB=$DBP RV9_PROBE=$P/meas.probe.jsx RV9_SET=$S $X RV9_SHARD=$s/$N MEAS_OUT=$O/meas-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs" > $O/meas-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & s=$((s+1)); done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = "$N" ] || { echo "A SHARD FAILED"; exit 2; }
node $P/meas-an.mjs $O > $O/table.txt; rc=$?; head -60 $O/table.txt; exit $rc
