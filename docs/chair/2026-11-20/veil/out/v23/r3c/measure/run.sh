#!/bin/sh
# run.sh <probe> <outdir> <template db> <N> : four shards of the probe on the scratch PG16 (/var/tmp/rv7), r3c_* databases only
S=$(cd $(dirname $0) && pwd); P=$1; O=$2; T=$3; N=$4; SRC=/home/user/wt/r3c; mkdir -p $O; rm -f $O/done.txt
cd $SRC
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX PGHOST=/var/tmp/rv7 RV6_SRC=$SRC RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=r3c_$(basename $O | tr - _) RV9_PROBE=$P RV9_N=$N RV9_SHARD=$s/4 RV9_OUT=$O/shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
