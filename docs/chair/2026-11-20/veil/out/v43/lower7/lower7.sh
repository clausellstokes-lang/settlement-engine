#!/bin/sh
# V43-LOWER7, ONE COMMAND (inside `sh scripts/gate-mutex.sh --run --` from the joined tree):   sh lower7.sh <worktree> <outdir> <template db>
# One run of lower7.probe.jsx on the eight towns (database v43x_l7, local PGHOST=/var/tmp/rv7 only), then lower7-an.mjs.
W=$1; O=$2; T=$3; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O
SEEDS=r3m-city-indebted-1-106,r3m-city-insurgency-1-104,r3m-city-insurgency-1-114,r3m-city-none-1-117,r3m-city-politically_fractured-1-120,r3m-city-under_siege-1-108,r3m-metropolis-indebted-1-136,r3m-town-insurgency-0-14
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(env -u GIT_DIR -u GIT_WORK_TREE git -C $W rev-parse HEAD)" > $O/window.txt
cd $W
env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 PGUSER=postgres RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=v43x_l7 RV9_PROBE=$P/lower7.probe.jsx RV9_ONLY=$SEEDS RV9_OUT=$O/rows.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/rows.log 2>&1; rc=$?
echo "probe rc=$rc end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt; exit $rc
