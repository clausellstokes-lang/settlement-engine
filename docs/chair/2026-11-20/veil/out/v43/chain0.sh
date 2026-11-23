#!/bin/sh
# VEIL-43 unit (0)/(1a): ledger ref, instruments, a NEW pool on the JOINED tree, then both gates. VEIL-42's chain0 with VEIL-43's names.
# Run as: sh scripts/gate-mutex.sh --run -- sh docs/chair/2026-11-20/veil/out/v43/chain0.sh   (from /home/user/join43)
W=/home/user/join43; V=$W/docs/chair/2026-11-20/veil/out; O=/var/tmp/v18/out/v43; L=$O/chain0.log; MS=$V/v27/tell2/measure
P=/var/tmp/v18/t2/pool-v43
mkdir -p $O
export PGHOST=/var/tmp/rv7 PGUSER=postgres
echo "start $(date -u +%H:%M:%S) at $(git -C $W rev-parse --short HEAD)" > $L
git -C $W fetch -q origin review-fixes-2026-07-08 && git -C $W branch -f review-fixes-2026-07-08 FETCH_HEAD >> $L 2>&1; echo "ledger rc=$?" >> $L
sh $V/v28/seated/make-instruments.sh $W $O/seated >> $L 2>&1; echo "instruments rc=$? $(date -u +%H:%M:%S)" >> $L
sh $MS/pool.sh $W $P v28tpl >> $L 2>&1; echo "pool rc=$? $(date -u +%H:%M:%S)" >> $L
sh $MS/verify.sh $W $O/verify $P 40 > $O/verify.txt 2>&1; echo "verify rc=$? $(tail -1 $O/verify.txt)" >> $L
TELL_DB=v43m sh $MS/tell2.sh $W $O/gates v28tpl $P > $O/gates.txt 2>&1; echo "gates rc=$? $(date -u +%H:%M:%S)" >> $L
echo "END $(date -u +%H:%M:%S)" >> $L
