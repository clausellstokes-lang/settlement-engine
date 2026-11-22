#!/bin/sh
# VEIL-32: npm ci, ledger ref, instruments, pool (at the lane tip), then the tip's gates (= chain1 follows).
C=/home/user/settlement-engine; V=$C/docs/chair/2026-11-20/veil/out; L=/var/tmp/v18/out/v32/chain0.log
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
echo "start $(date -u +%H:%M:%S) at $(git -C $C rev-parse --short HEAD)" > $L
cd $C && $E npm ci > /var/tmp/v18/out/v32/npm-ci.txt 2>&1; echo "npm-ci rc=$? $(date -u +%H:%M:%S)" >> $L
git -C $C fetch -q origin review-fixes-2026-07-08 && git -C $C branch -f review-fixes-2026-07-08 FETCH_HEAD >> $L 2>&1; echo "ledger rc=$?" >> $L
sh $V/v28/seated/make-instruments.sh $C /var/tmp/v18/out/v32/seated >> $L 2>&1; echo "instruments rc=$? $(date -u +%H:%M:%S)" >> $L
sh $V/v27/tell2/measure/pool.sh $C /var/tmp/v18/t2/pool-t2sig-2 v28tpl >> $L 2>&1; echo "pool rc=$? $(date -u +%H:%M:%S)" >> $L
echo "END $(date -u +%H:%M:%S)" >> $L
