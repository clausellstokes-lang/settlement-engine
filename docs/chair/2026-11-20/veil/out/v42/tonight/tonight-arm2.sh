#!/bin/sh
# R4I-TONIGHT-2 item C.4, ONE COMMAND:  sh tonight-arm2.sh <tree> <outdir> [template db; '' = twin only] [pooldir]
# Without <pooldir>: the tell gate's 140 births. With it: every seed of its pool-shard*.json / poolb-shard*.json.
# Four shards of tonight-arm2.probe.jsx through /var/tmp/v18/rv9/vitest.config.mjs (tonight-arm.sh's shape); then
# tonight-arm2-an.mjs prints the three halves (<outdir>/arm-table.txt). Exit 0 only when the four shards end rc=0 and
# the analyser finds (a), (b) and (c)'s role lines all equal.
W=$1; O=$2; T=${3:-}; D=${4:-}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
if [ -n "$D" ]; then SET="RV9_SET=pool RV9_POOL_DIR=$D"; else SET="RV9_SET=towns"; fi
cd $W
for s in 0 1 2 3; do (eval "env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=${RV9_SERVER_DB:-r4it2_arm} RV9_LIMIT=${RV9_LIMIT:-0} RV9_PROBE=$P/tonight-arm2.probe.jsx $SET RV9_SHARD=$s/4 RV9_OUT=$O/arm-shard$s.json RV9_OWNER_OUT=$O/owner-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs" > $O/arm-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
cat $O/done.txt
node $P/tonight-arm2-an.mjs $O > $O/arm-table.txt; rc=$?; cat $O/arm-table.txt; [ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || exit 2; exit $rc
