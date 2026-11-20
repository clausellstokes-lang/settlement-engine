#!/bin/sh
# m27/kl: one shape per call, one vitest at a time (shard 0/1).   sh run.sh <lane|master>
S=$1; W=/home/user/wt/8d5768ebc; O=/var/tmp/v18/m27/kl
cd $W
env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=kltpl RV9_SERVER_DB=m27kl_$S RV9_SHAPE=$S RV9_PROBE=$O/keylevel.probe.jsx RV9_N=2 RV9_SHARD=0/1 RV9_OUT=$O/kl-$S.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/kl-$S.log 2>&1
rc=$?; echo "$S vitest rc=$rc" >> $O/done.txt; exit $rc
