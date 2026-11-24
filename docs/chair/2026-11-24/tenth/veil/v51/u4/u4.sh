#!/bin/sh
# VEIL-51 UNIT 4 "R5-DESC" narrowed, THE PART THAT TOUCHES NO SQL (the chair, 23:49 UTC 2026-11-24). Run: sh u4.sh [step ...]
# (1) THE MEASURE: wd (NAMES; VEIL-43's V43-MEASURE at b126c9813, run UNCHANGED from /home/user/wt/i43) on both stored pools of the
#   gate's 140 seeds (today-born /var/tmp/v51/out/p1/stored-today from ced3b1de7's engine = the tip's; master-born stored-master from
#   db832c892), the server = template v51_c2 (v27x211 + this tree's 212, byte-equal at d7764e67a), the twin = the tree
#   /home/user/wt/u4m (detached d7764e67a + ONE UNTRACKED DATA FILE, src/data/dailyLife/commonerResentments.js from ba7460c33, pure
#   data, no imports: wd imports it unconditionally for its withdrawn DAILY mode; VEIL-50's q1b ran wd from a join tree for the same
#   reason). THE PLANTED POSITIVE first: plant.mjs (a data plant on a copy of the today-born set; 4 seeds).
I43=/home/user/wt/i43/docs/chair/2026-11-20/veil/out; W=/home/user/wt/u4m; O=/var/tmp/v51/out/u4; L=$O/u4.log; mkdir -p $O
P=$(cd "$(dirname "$0")" && pwd)
export PGHOST=/var/tmp/rv7 PGUSER=postgres
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { while :; do (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); r=$?; [ $r = 3 ] || return $r; echo "  gave up, again $(date -u +%H:%M:%S)" >> $L; done; }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
step_plant() { rm -rf $O/stored-plant; node $P/plant.mjs /var/tmp/v51/out/p1/stored-today $O/stored-plant > $O/plant.txt 2>&1; st plant $?; }
step_wdplant() { mx sh $I43/v43/meas/wd.sh $W $O/wd-plant v51_c2 stored $O/stored-plant > $O/wd-plant.txt 2>&1; st wd-plant $?; }
step_wdtoday() { mx sh $I43/v43/meas/wd.sh $W $O/wd-today v51_c2 stored /var/tmp/v51/out/p1/stored-today > $O/wd-today.txt 2>&1; st wd-today $?; }
step_wdmaster() { mx sh $I43/v43/meas/wd.sh $W $O/wd-master v51_c2 stored /var/tmp/v51/out/p1/stored-master > $O/wd-master.txt 2>&1; st wd-master $?; }
STEPS=${*:-"plant wdplant wdtoday wdmaster"}
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) steps: $STEPS" >> $L
for s in $STEPS; do step_$s; done
echo "END $(date -u +%H:%M:%S)" >> $L
