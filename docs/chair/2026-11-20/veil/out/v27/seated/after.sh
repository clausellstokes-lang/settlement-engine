#!/bin/sh
# VEIL-27: at 8d5768ebc: acceptance, the one-command gate, the largest town's cost rows, the v8245 rows. Outputs /var/tmp/v18/out/v27/at-8d5/
W=/home/user/wt/8d5768ebc; O=/var/tmp/v18/out/v27/at-8d5; mkdir -p $O; export PGHOST=/var/tmp/rv7 PGUSER=postgres
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
L=/var/tmp/v18/lib/docs/chair; P6=$L/2026-11-13/probes/REVIEW-VEIL-6
echo "start $(date -u +%H:%M:%S)" > $O/steps.txt
(cd /var/tmp/v18 && RV6_PGMOD=/var/tmp/v18/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh $W $O/accept > $O/accept.txt 2>&1); echo "accept exit $? $(date -u +%H:%M:%S)" >> $O/steps.txt
dropdb --if-exists r3c6tpl; createdb -T x211 r3c6tpl && psql -q -v ON_ERROR_STOP=1 -d r3c6tpl -f $W/supabase/migrations/212_share_veil_later_cures.sql > $O/tpl.log 2>&1; echo "tpl exit $?" >> $O/steps.txt
sh $W/docs/chair/2026-11-20/veil/out/v25/r3c5/measure/gate.sh $W $O/gate r3c6tpl 2 > $O/gate.txt 2>&1; echo "gate exit $? $(date -u +%H:%M:%S)" >> $O/steps.txt
(cd $W && $E RV6_SRC=$W RV9_PROBE=/var/tmp/v18/m27/big.probe.jsx RV9_OUT=/var/tmp/v18/m27/big.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/big-probe.log 2>&1); echo "big exit $? $(date -u +%H:%M:%S)" >> $O/steps.txt
node /var/tmp/v18/m27/big-cost.mjs > $O/cost-big-town.txt 2>&1; echo "bigcost exit $?" >> $O/steps.txt
dropdb --if-exists r3c2_x211; dropdb --if-exists r3c2_base; dropdb --if-exists r3c2_after
createdb -T x211 r3c2_x211 && createdb -T x212 r3c2_after && sh $P6/native/chain.sh r3c2_base 212 /var/tmp/v18/m27/base/supabase/migrations > $O/chain-base.log 2>&1; echo "chains exit $?" >> $O/steps.txt
sh /var/tmp/v18/m27/cost.sh > $O/cost-v8245.txt 2>&1; echo "v8245 exit $? $(date -u +%H:%M:%S)" >> $O/steps.txt
echo DONE >> $O/steps.txt
