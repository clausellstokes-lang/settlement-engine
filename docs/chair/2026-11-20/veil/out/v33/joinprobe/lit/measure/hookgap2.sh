#!/bin/sh
# V33-JOINPROBE PASS 2 (LIT) step 5: pass 1's hook-gap probe UNCHANGED (measure/hookgap.probe.jsx, the same seeds jp5-<size>-<i>), on the
# lit tree, its scratch databases jp2h_<s> (not pass 1's jp5_<s>); then pass 1's analyzer.   sh hookgap2.sh <worktree> <outdir> <tpl> [N=40]
W=$1; O=$2; T=$3; N=${4:-40}; P=$(cd "$(dirname "$0")/../../measure" && pwd); mkdir -p $O; rm -f $O/hookgap-done.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 PGUSER=postgres RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=jp2h RV9_PROBE=$P/hookgap.probe.jsx RV9_N=$N RV9_SHARD=$s/4 RV9_OUT=$O/hookgap-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/hookgap-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/hookgap-done.txt) & done; wait
cat $O/hookgap-done.txt
[ "$(grep -c 'rc=0' $O/hookgap-done.txt)" = 4 ] || { echo "A HOOKGAP SHARD FAILED"; exit 2; }
node $P/hookgap-an.mjs $O > $O/hookgap-table.txt; rc=$?; node $P/hookgap-eleven.mjs $W $O > $O/hookgap-eleven.txt 2>&1; tail -1 $O/hookgap-table.txt; exit $rc
