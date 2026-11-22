#!/bin/sh
# R5D-1 (VEIL-34): R5-DESC-MEASURE's copy, the db prefix r5d1jp. COPIED by R5-DESC-MEASURE (VEIL-34) from the joinprobe-wip ref (df7447e58); the server db prefix r5jp. V33-JOINPROBE PASS 2: four shards of litsurf.probe.jsx, then the table.   sh litsurf.sh <worktree> <outdir> <tpl> [N=10]
W=$1; O=$2; T=$3; N=${4:-10}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/litsurf-done.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 PGUSER=postgres RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=r5d1jp RV9_PROBE=$P/litsurf.probe.jsx RV9_N=$N RV9_SHARD=$s/4 RV9_OUT=$O/litsurf-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/litsurf-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/litsurf-done.txt) & done; wait
cat $O/litsurf-done.txt
[ "$(grep -c 'rc=0' $O/litsurf-done.txt)" = 4 ] || { echo "A LITSURF SHARD FAILED"; exit 2; }
node $P/litsurf-an.mjs $O > $O/litsurf-table.txt; rc=$?; tail -3 $O/litsurf-table.txt; exit $rc
