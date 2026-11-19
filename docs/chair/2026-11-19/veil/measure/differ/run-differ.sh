#!/bin/sh
# run-differ.sh <src tree> <outdir> [N] : the reader's counterfactual differ, 4 shards, client twin of <src>
SRC=$1; OUT=$2; N=${3:-2}; mkdir -p $OUT
for s in 0 1 2 3; do
  (cd $SRC && RV6_SRC=$SRC RV9_PROBE=/var/tmp/v18/rv9/differ.probe.jsx RV9_N=$N RV9_SHARD=$s/4 RV9_OUT=$OUT/shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $OUT/shard$s.log 2>&1; echo "shard $s rc=$?" >> $OUT/done.txt) &
done
wait
for vk in all default; do VK=$vk node /var/tmp/v18/rv9/differ-merge.mjs $OUT/shard*.json > $OUT/merge-$vk.txt; node /var/tmp/v18/rv9/differ-classify.mjs $vk $OUT/shard*.json > $OUT/classes-$vk.txt; done
echo ALLDONE >> $OUT/done.txt
