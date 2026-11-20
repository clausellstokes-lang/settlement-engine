#!/bin/sh
# R3-TELL-2 unit 1: THE TELL COLUMN AS A GATED ARM, ONE COMMAND.
#   sh tell2.sh <worktree> <outdir> <template db: createdb -T v27x211, then the tree's 212> [pooldir=/var/tmp/v18/t2/pool-t2sig-1]
# 1. pool.sh: the nothing-hidden pool (CACHED in <pooldir>; built once, about an hour of CPU; the cure's runs reuse it and
#    re-check it with verify.sh). 2. Four shards of tell2.probe.jsx (RV9_MODE=towns) on <worktree>: the gate's 140 births,
#    twin and server (databases t2_<outdir>_<shard>), every setting, Reveal off and on. 3. tell2-an.mjs: the tables
#    (<outdir>/tell2-table.txt). EXIT: the analyzer's: 1 on any non-member page of a hidden-house town (GATE_SCOPE, default
#    'all' settings), 2 on a missing shard; 0 only when every such page is a member.
W=$1; O=$2; T=$3; D=${4:-/var/tmp/v18/t2/pool-t2sig-1}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt
sh $P/pool.sh $W $D 300 $T > $O/pool.txt 2>&1 || { echo "POOL FAILED (see $O/pool.txt)"; exit 2; }
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ)" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=t2_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/tell2.probe.jsx RV9_MODE=towns RV9_N=2 RV9_SHARD=$s/4 RV9_OUT=$O/towns-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/towns-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt
[ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || { echo "A TOWNS SHARD FAILED"; exit 2; }
node $P/tell2-an.mjs $D $O > $O/tell2-table.txt; rc=$?
sed -n '1,/^PARITY/p' $O/tell2-table.txt; tail -1 $O/tell2-table.txt; exit $rc
