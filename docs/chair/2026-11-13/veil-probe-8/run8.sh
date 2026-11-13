#!/bin/sh
# run8.sh <side master|tip> <src worktree> <chains db:tpl,...> <out dir> <tag> [shards] : planted8 in N shards in parallel, then its summary
HERE=$(cd "$(dirname "$0")" && pwd)
SIDE=$1; SRC=$2; CH=$3; O=$4; TAG=$5; N=${6:-2}; mkdir -p $O
export PGHOST=${PGHOST:-/var/tmp/cv8sock}
s=0; while [ $s -lt $N ]; do
  (cd $SRC && RV5_SIDE=$SIDE RV5_SRC=$SRC RV8_ORACLE_SRC=${RV8_ORACLE_SRC:-$SRC} RV5_PROBE=planted8.probe.jsx RV5_CHAINS=$CH RV5_SEEDS=${RV5_SEEDS:-2} RV5_SIZES=${RV5_SIZES:-thorp,hamlet,village,town,city,metropolis} RV5_SHARD=$s/$N RV5_OUT=$O/$TAG-$s.json \
     npx vitest run --config $HERE/vitest.config.mjs > $O/$TAG-$s.log 2>&1; echo "shard $s exit $?" >> $O/$TAG-$s.log) &
  s=$((s+1)); done
wait
node $HERE/planted8-summary.mjs $O/$TAG-*.json > $O/$TAG.txt 2>&1; echo "summary exit $?" >> $O/$TAG.txt
