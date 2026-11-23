#!/bin/sh
# VEIL-44: the machine from a fresh container (PART 36 s1 (4); PART 44's names, v44): npm ci in the door -wip, ledger ref,
# instruments, the pool, verify, both gates. Run through scripts/gate-mutex.sh --run, in the background.
W=/home/user/wip; V=$W/docs/chair/2026-11-20/veil/out; O=/var/tmp/v18/out/v44; L=$O/chain0.log; MS=$V/v27/tell2/measure
P=/var/tmp/v18/t2/pool-v44
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mkdir -p $O /var/tmp/v18/t2 /var/tmp/v18log
echo "start $(date -u +%H:%M:%S) at $(git -C $W rev-parse --short HEAD)" > $L
(cd $W && $E npm ci > /var/tmp/v18log/npm-ci.txt 2>&1); echo "npm ci rc=$? $(date -u +%H:%M:%S)" >> $L
git -C $W fetch -q origin review-fixes-2026-07-08 && git -C $W branch -f review-fixes-2026-07-08 FETCH_HEAD >> $L 2>&1; echo "ledger rc=$?" >> $L
sh $V/v28/seated/make-instruments.sh $W $O/seated >> $L 2>&1; echo "instruments rc=$? $(date -u +%H:%M:%S)" >> $L
sh $MS/pool.sh $W $P v28tpl >> $L 2>&1; echo "pool rc=$? $(date -u +%H:%M:%S)" >> $L
sh $MS/verify.sh $W $O/verify $P 40 > $O/verify.txt 2>&1; echo "verify rc=$? $(tail -1 $O/verify.txt)" >> $L
TELL_DB=v44m sh $MS/tell2.sh $W $O/gates v28tpl $P > $O/gates.txt 2>&1; echo "gates rc=$? $(date -u +%H:%M:%S)" >> $L
echo "END $(date -u +%H:%M:%S)" >> $L
