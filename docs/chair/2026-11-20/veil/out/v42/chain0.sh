#!/bin/sh
# VEIL-42 unit (0): ledger ref, instruments, the pool (on the -wip at the tip's merge), then both gates. chain0/chain1 of VEIL-32 with VEIL-42's names.
W=/home/user/wip; V=$W/docs/chair/2026-11-20/veil/out; O=/var/tmp/v18/out/v42; L=$O/chain0.log; MS=$V/v27/tell2/measure
P=/var/tmp/v18/t2/pool-v42
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
echo "start $(date -u +%H:%M:%S) at $(git -C $W rev-parse --short HEAD)" > $L
git -C $W fetch -q origin review-fixes-2026-07-08 && git -C $W branch -f review-fixes-2026-07-08 FETCH_HEAD >> $L 2>&1; echo "ledger rc=$?" >> $L
sh $V/v28/seated/make-instruments.sh $W $O/seated >> $L 2>&1; echo "instruments rc=$? $(date -u +%H:%M:%S)" >> $L
sh $MS/pool.sh $W $P v28tpl >> $L 2>&1; echo "pool rc=$? $(date -u +%H:%M:%S)" >> $L
sh $MS/verify.sh $W $O/verify $P 40 > $O/verify.txt 2>&1; echo "verify rc=$? $(tail -1 $O/verify.txt)" >> $L
TELL_DB=v42m sh $MS/tell2.sh $W $O/gates v28tpl $P > $O/gates.txt 2>&1; echo "gates rc=$? $(date -u +%H:%M:%S)" >> $L
echo "END $(date -u +%H:%M:%S)" >> $L
