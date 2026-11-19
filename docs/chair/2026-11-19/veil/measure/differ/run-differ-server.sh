#!/bin/sh
# run-differ-server.sh <src tree> <outdir> [N] [read]: the reader's differ THROUGH THE SERVER (VR15): a chain 001..212 of
# <src>'s migrations as the template, 4 shards each cloning it; then merge, classify, and the reader's gate (empty registry,
# the VR13 rng ruling) over the shards.
SRC=$1; OUT=$2; N=${3:-2}; READ=${4:-gallery}; mkdir -p $OUT; rm -f $OUT/done.txt
export PGHOST=${PGHOST:-/var/tmp/rv7} PGUSER=postgres
TPL=tpl$(echo $OUT | md5sum | cut -c1-8)
sh /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-6/native/chain.sh $TPL 212 $SRC/supabase/migrations > $OUT/chain.log 2>&1
for s in 0 1 2 3; do
  (cd $SRC && RV6_SRC=$SRC RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$TPL RV9_SERVER_DB=${TPL}s RV9_READ=$READ RV9_PROBE=/var/tmp/v18/rv9/differ.probe.jsx RV9_N=$N RV9_SHARD=$s/4 RV9_OUT=$OUT/shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $OUT/shard$s.log 2>&1; echo "shard $s rc=$?" >> $OUT/done.txt) &
done
wait
for vk in all default; do VK=$vk node /var/tmp/v18/rv9/differ-merge.mjs $OUT/shard*.json > $OUT/merge-$vk.txt; node /var/tmp/v18/rv9/differ-classify.mjs $vk $OUT/shard*.json > $OUT/classes-$vk.txt; done
node /var/tmp/v18/rv9/differ-gate.mjs ${REG:-/var/tmp/v18/rv9/reg-empty.json} ${RUL:-/var/tmp/v18/rv9/rul-vr13.json} $OUT/shard*.json > $OUT/gate.txt; echo "gate rc=$?" >> $OUT/done.txt
echo ALLDONE >> $OUT/done.txt
