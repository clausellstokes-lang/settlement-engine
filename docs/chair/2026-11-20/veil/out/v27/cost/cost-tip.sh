#!/bin/sh
# VEIL-27: the cost law at the tip (72913fc86's 212 = 6260803d): the largest born town (x211 vs x212) and the v8245 rows (x211 | base 05b915ab | after)
W=/home/user/wt/tip; O=/var/tmp/v18/out/v27/cost-tip; mkdir -p $O; export PGHOST=/var/tmp/rv7 PGUSER=postgres
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
P6=/var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-6
echo "start $(date -u +%H:%M:%S) load $(cut -d' ' -f1-3 /proc/loadavg)" > $O/steps.txt
(cd $W && $E RV6_SRC=$W RV9_PROBE=/var/tmp/v18/m27/big.probe.jsx RV9_OUT=/var/tmp/v18/m27/big.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/big-probe.log 2>&1); echo "big exit $?" >> $O/steps.txt
echo "timing start load $(cut -d' ' -f1-3 /proc/loadavg)" >> $O/steps.txt
node /var/tmp/v18/m27/big-cost.mjs > $O/cost-big-town.txt 2>&1; echo "bigcost exit $?" >> $O/steps.txt
for d in r3c2_x211 r3c2_base r3c2_after; do dropdb --if-exists $d; done
createdb -T v27x211 r3c2_x211 && createdb -T v27x212 r3c2_after && sh $P6/native/chain.sh r3c2_base 212 /var/tmp/v18/m27/base/supabase/migrations > $O/chain-base.log 2>&1; echo "chains exit $?" >> $O/steps.txt
sh /var/tmp/v18/m27/cost.sh > $O/cost-v8245.txt 2>&1; echo "v8245 exit $? $(date -u +%H:%M:%S) load $(cut -d' ' -f1-3 /proc/loadavg)" >> $O/steps.txt
echo DONE >> $O/steps.txt
