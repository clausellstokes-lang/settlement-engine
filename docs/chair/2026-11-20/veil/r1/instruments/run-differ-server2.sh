#!/bin/sh
# run-differ-server2.sh <src tree> <outdir> <N> <read: gallery|link> <gen tree> <chain spec> [shards]
# VEIL-R1: run-differ-server.sh (VEIL-18) with the generator (RV9_GEN) and the chain spec as arguments, so master's
# stored shape (master's generator, chain 203+211+212 of <src>) and the party link run by the same script.
SRC=$1; OUT=$2; N=$3; READ=$4; GEN=$5; SPEC=$6; SH=${7:-4}; mkdir -p $OUT; rm -f $OUT/done.txt
export PGHOST=${PGHOST:-/var/tmp/rv7} PGUSER=postgres
TPL=tpl$(echo $OUT | md5sum | cut -c1-8)
sh /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-6/native/chain.sh $TPL $SPEC $SRC/supabase/migrations > $OUT/chain.log 2>&1
s=0; while [ $s -lt $SH ]; do
  (cd $SRC && RV6_SRC=$SRC RV9_GEN=$GEN RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$TPL RV9_SERVER_DB=${TPL}s RV9_READ=$READ RV9_PROBE=/var/tmp/v18/rv9/differ.probe.jsx RV9_N=$N RV9_SHARD=$s/$SH RV9_OUT=$OUT/shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $OUT/shard$s.log 2>&1; echo "shard $s rc=$?" >> $OUT/done.txt) &
  s=$((s+1)); done
wait
for vk in all default; do VK=$vk node /var/tmp/v18/rv9/differ-merge.mjs $OUT/shard*.json > $OUT/merge-$vk.txt; node /var/tmp/v18/rv9/differ-classify.mjs $vk $OUT/shard*.json > $OUT/classes-$vk.txt; done
node /var/tmp/v18/rv9/differ-gate.mjs ${REG:-/var/tmp/v18/rv9/reg-empty.json} ${RUL:-/var/tmp/v18/rv9/rul-vr13.json} $OUT/shard*.json > $OUT/gate.txt; echo "gate rc=$?" >> $OUT/done.txt
echo ALLDONE >> $OUT/done.txt
