#!/bin/sh
# V43-PAGES, ONE COMMAND (inside `sh scripts/gate-mutex.sh --run --` from the joined tree):
#   sh pages.sh <worktree> <outdir> <template db> <F|N> [shards=4]
# PG_PICK=k reads every k-th row (the cost run); PG_RESTORE=0 skips the restore loop. Databases v43x_pg<mode>_<shard>, local
# PGHOST=/var/tmp/rv7 only. One JSON per birth in <outdir>/rows; logs <outdir>/<mode>-shard<s>.log; exit codes in <outdir>/done-<mode>.txt.
W=$1; O=$2; T=$3; M=$4; N=${5:-4}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O/rows; rm -f $O/done-$M.txt
echo "start $M $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(env -u GIT_DIR -u GIT_WORK_TREE git -C $W rev-parse HEAD) pick ${PG_PICK:-1} shards $N" >> $O/window.txt
cd $W
s=0; while [ $s -lt $N ]; do
  (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 PGUSER=postgres \
    RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod PG_TPL=$T PG_DB=v43x_pg$(echo $M | tr 'FN' 'fn') RV9_PROBE=$P/pages.probe.mjs PG_MODE=$M PG_SHARD=$s/$N PG_OUT=$O/rows \
    npx vitest run --config $P/pages.vitest.config.mjs > $O/$M-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done-$M.txt) &
  s=$((s+1)); done; wait
echo "end $M $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done-$M.txt; [ "$(grep -c 'rc=0' $O/done-$M.txt)" = "$N" ]
