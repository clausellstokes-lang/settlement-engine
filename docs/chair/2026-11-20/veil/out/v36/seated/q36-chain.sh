#!/bin/sh
# VEIL-36: (iv)'s measure (V33-Q's probe, unrun since 85584d03d), RE-POINTED: the tip af708f2fd (detached /home/user/wt/q36, the
# probe files taken from lane/veil-33-2026-11-22-q-wip), this seat's pool pool-v36, template t36q (lower case). Modes towns + pool
# only ((v)'s insurg later). Waits for chain1's END; every heavy step inside the gate mutex (re-asked on a give-up).
W=/home/user/wt/q36; Q=/var/tmp/v18/out/v36/q; P=$W/docs/chair/2026-11-20/veil/out/v33/q/measure; D=/var/tmp/v18/t2/pool-v36
export PGHOST=/var/tmp/rv7 PGUSER=postgres GATE_MUTEX_MAX_POLLS=240
L=$Q/chain.txt
mx() { while :; do sh scripts/gate-mutex.sh --run -- "$@"; r=$?; [ $r -eq 3 ] || return $r; echo "mutex gave up; re-asking $(date -u +%H:%M:%S)" >> $L; done; }
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
until grep -q '^END' /var/tmp/v18/out/v36/g/done.txt 2>/dev/null; do sleep 30; done
echo "start $(date -u +%H:%M:%S) tip $(git -C $W rev-parse --short HEAD)" >> $L
cd $W
sha256sum supabase/migrations/212_share_veil_later_cures.sql > $Q/sha256.txt
(dropdb --if-exists t36q && createdb -T v27x211 t36q && psql -q -v ON_ERROR_STOP=1 -d t36q -f supabase/migrations/212_share_veil_later_cures.sql) > $Q/tpl.txt 2>&1; echo "tpl rc=$?" >> $L
mx $E RV9_ONLY=r3m-town-none-0-23,r3m-village-none-0-1 sh $P/q.sh $W $Q/smoke towns t36q $D > $Q/smoke-run.txt 2>&1; echo "smoke rc=$?" >> $L
grep -q 'smoke rc=0' $L || { echo "STOP: the probe's smoke failed" >> $L; echo "END $(date -u +%H:%M:%S)" >> $L; exit 1; }
mx $E sh $P/q.sh $W $Q/rec towns t36q $D > $Q/rec-towns-run.txt 2>&1; echo "towns rc=$? $(date -u +%H:%M:%S)" >> $L
mx $E sh $P/q.sh $W $Q/rec pool t36q $D 1 > $Q/rec-pool-run.txt 2>&1; echo "pool rc=$? $(date -u +%H:%M:%S)" >> $L
node $P/q-an.mjs $Q/rec > $Q/q-an.txt 2>&1; echo "an rc=$?" >> $L
echo "END $(date -u +%H:%M:%S)" >> $L
