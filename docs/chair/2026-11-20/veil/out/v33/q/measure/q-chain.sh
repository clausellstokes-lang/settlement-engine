#!/bin/sh
# V33-Q: the measures' runs, EACH inside the machine's mutex (scripts/gate-mutex.sh --run), one after another, after the seat's
# green chain's END.   sh q-chain.sh   (from anywhere; logs under out/v33/q/)
W=/home/user/wt/q; Q=$W/docs/chair/2026-11-20/veil/out/v33/q; MS=$W/docs/chair/2026-11-20/veil/out/v27/tell2/measure; D=/var/tmp/v18/t2/pool-t2sig-2
export PGHOST=/var/tmp/rv7 PGUSER=postgres GATE_MUTEX_MAX_POLLS=240
# mx: the mutex, re-asked while it gives up (exit 3: the slot held past the polls); never kills a holder
mx() { while :; do sh scripts/gate-mutex.sh --run -- "$@"; r=$?; [ $r -eq 3 ] || return $r; echo "mutex gave up; re-asking $(date -u +%H:%M:%S)" >> $L; done; }
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
L=$Q/chain.txt; echo "start $(date -u +%H:%M:%S) tip $(git -C $W rev-parse --short HEAD)" >> $L
cd $W
sha256sum supabase/migrations/212_share_veil_later_cures.sql supabase/rollback/212_share_veil_later_cures.down.sql > $Q/sha256.txt
(dropdb --if-exists t33q && createdb -T v27x211 t33q && psql -q -v ON_ERROR_STOP=1 -d t33q -f supabase/migrations/212_share_veil_later_cures.sql) > $Q/tpl.txt 2>&1; echo "tpl rc=$?" >> $L
# the probe's smoke: two towns (a failing one and a control), every mode's code path but the pool's and the births'
mx $E RV9_ONLY=r3m-town-none-0-23,r3m-village-none-0-1 sh $Q/measure/q.sh $W $Q/smoke towns t33q $D > $Q/smoke-run.txt 2>&1; echo "smoke rc=$?" >> $L
grep -q 'smoke rc=0' $L || { echo "STOP: the probe's smoke failed" >> $L; echo "END $(date -u +%H:%M:%S)" >> $L; exit 1; }
mx $E sh $MS/verify.sh $W $Q/verify $D 40 > $Q/verify-run.txt 2>&1; echo "verify rc=$? $(tail -1 $Q/verify-run.txt)" >> $L
grep -q 'verify rc=0' $L || { echo "STOP: the pool fails verify.sh" >> $L; echo "END $(date -u +%H:%M:%S)" >> $L; exit 1; }
mx $E TELL_DB=q33 sh $MS/tell2.sh $W $Q/gates t33q $D > $Q/gates-run.txt 2>&1; echo "gates rc=$? $(date -u +%H:%M:%S)" >> $L
mx $E sh $Q/measure/q.sh $W $Q/rec towns t33q $D > $Q/rec-towns-run.txt 2>&1; echo "towns rc=$? $(date -u +%H:%M:%S)" >> $L
mx $E sh $Q/measure/q.sh $W $Q/rec pool t33q $D 1 > $Q/rec-pool-run.txt 2>&1; echo "pool rc=$? $(date -u +%H:%M:%S)" >> $L
mx $E sh $Q/measure/q.sh $W $Q/rec insurg t33q $D > $Q/rec-insurg-run.txt 2>&1; echo "insurg rc=$? $(date -u +%H:%M:%S)" >> $L
node $Q/measure/q-an.mjs $Q/rec > $Q/q-an.txt 2>&1; echo "an rc=$?" >> $L
echo "END $(date -u +%H:%M:%S)" >> $L
