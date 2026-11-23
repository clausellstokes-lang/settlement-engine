#!/bin/sh
# V33-Q: the measures' runs, EACH inside the machine's mutex (scripts/gate-mutex.sh --run), one after another.
# RE-POINTED by VEIL-40's T5 (2026-11-23, R3-TELL-5-IVVVI-BRIEF.md): this tree (/home/user/wt/t5), outputs under out/v40/t5/,
# template v40t5q (v27x211 + this tree's 212), the pool's seeds from /var/tmp/v18/t2/pool-v40 (read, never written). NO GATE
# AND NO POOL IS RUN HERE (the brief: the seat runs one pool and one pair of gates): V33-Q's verify and tell2 steps are gone.
# Steps (each its own call, so the mutex's order file is re-read before each):   sh q-chain.sh <tpl|smoke|towns|pool|insurg|an>
W=/home/user/wt/t5; O=$W/docs/chair/2026-11-20/veil/out/v40/t5; Q=$W/docs/chair/2026-11-20/veil/out/v33/q/measure; D=/var/tmp/v18/t2/pool-v40
export PGHOST=/var/tmp/rv7 PGUSER=postgres GATE_MUTEX_MAX_POLLS=240
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
L=$O/chain.txt; mkdir -p $O; cd $W
# the failing towns of the units (GATE-MAP's rows): (iv) 117, 136; (v)(1) 113, 62; (v)(2) 23, 21; (v)(3) 14
ONLY=r3m-city-none-1-117,r3m-metropolis-indebted-1-136,r3m-city-none-1-113,r3m-metropolis-infiltrated-0-62,r3m-town-none-0-23,r3m-town-none-0-21,r3m-town-insurgency-0-14
echo "step $1 start $(date -u +%H:%M:%S) tip $(git -C $W rev-parse --short HEAD) 212 $(sha256sum supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16)" >> $L
case "$1" in
  tpl) (dropdb --if-exists v40t5q && createdb -T v27x211 v40t5q && psql -q -v ON_ERROR_STOP=1 -d v40t5q -f supabase/migrations/212_share_veil_later_cures.sql) > $O/tpl.txt 2>&1; r=$? ;;
  smoke) sh scripts/gate-mutex.sh --run -- $E RV9_ONLY=r3m-town-none-0-23,r3m-village-none-0-1 sh $Q/q.sh $W $O/smoke towns v40t5q $D > $O/smoke-run.txt 2>&1; r=$? ;;
  towns) sh scripts/gate-mutex.sh --run -- $E RV9_ONLY=$ONLY sh $Q/q.sh $W $O/rec towns v40t5q $D > $O/rec-towns-run.txt 2>&1; r=$? ;;
  pool) sh scripts/gate-mutex.sh --run -- $E RV9_PSIZES=town,city,metropolis sh $Q/q.sh $W $O/rec pool v40t5q $D 1 > $O/rec-pool-run.txt 2>&1; r=$? ;;
  insurg) sh scripts/gate-mutex.sh --run -- $E RV9_TARGET=300 RV9_POOL_SIZES=town sh $Q/q.sh $W $O/rec insurg v40t5q $D > $O/rec-insurg-run.txt 2>&1; r=$? ;;
  an) node $Q/q-an.mjs $O/rec > $O/q-an.txt 2>&1; r=$? ;;
  *) echo "usage: sh q-chain.sh <tpl|smoke|towns|pool|insurg|an>"; exit 2 ;;
esac
echo "step $1 rc=$r end $(date -u +%H:%M:%S)" >> $L
exit $r
