#!/bin/sh
# R3-TELL-2: THE TELL'S TWO GATES (ruling 58), ONE COMMAND.
#   sh tell2.sh <worktree> <outdir> <template db: createdb -T v27x211, then the tree's 212> [pooldir=/var/tmp/v18/t2/pool-t2sig-2]
# 1. pool.sh: parts A and B of the pool (CACHED in <pooldir>; the cure's runs reuse it and re-check it with verify.sh). 2. Four shards of tell2.probe.jsx (RV9_MODE=towns) on <worktree>: the gate's 140 births,
#    twin and server (databases t2_<outdir>_<shard>), every setting, Reveal off and on. 3. tell2-an.mjs: the tables
#    (<outdir>/tell2-table.txt). EXIT: the analyzer's: 1 on any gated read of a hidden-house town failing GATE-1 or GATE-2
#    (a GATE-2 L3 Fisher p below 0.05, ruling 62 (4)), 2 on a missing shard; 0 only when both gates pass. TELL_DB names the
#    databases' prefix (default t2; R3-TELL-3 runs with TELL_DB=t3).
W=$1; O=$2; T=$3; D=${4:-/var/tmp/v18/t2/pool-t2sig-2}; P=$(cd "$(dirname "$0")" && pwd); Q=$(cd "$P/../../v27/tell2/measure" && pwd); mkdir -p $O; rm -f $O/done.txt
sh $Q/pool.sh $W $D $T > $O/pool.txt 2>&1 || { echo "POOL FAILED (see $O/pool.txt)"; exit 2; }
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ)" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=${TELL_DB:-t2}_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/tell2sha.probe.jsx RV9_SHAS=$O/shas RV9_MODE=towns RV9_N=2 RV9_SHARD=$s/4 RV9_OUT=$O/towns-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/towns-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || { echo "A TOWNS SHARD FAILED"; exit 2; }
node $Q/tell2-an.mjs $D $O > $O/tell2-table.txt; rc=$?
grep -E '^(own|off|g:|allOpen)|^GATE|^TODAY|^FISHER|^THE TOWNS LOWER|^  LOWER BY RULE|^NON-GOVERNING' $O/tell2-table.txt; exit $rc
