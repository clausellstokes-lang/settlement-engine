#!/bin/sh
# usage: run-battery.sh <treeLabel> <corpus> <half>
T=$1; C=$2; H=$3
S=/tmp/claude-0/-home-user-settlement-engine/264f2cd3-2300-5be6-af7e-6509ebfae300/scratchpad
B=/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-7; O=$B/before-after
LOG=$O/logs/battery-$T-$C-$H.log
cd /home/user/settlement-engine
START=$(date +%s)
GATE_MUTEX_MAX_POLLS=2000 sh scripts/gate-mutex.sh --run -- node $B/read25/page-battery.mjs --plan=$O/plans/plan-$C-$H.json --out=$S/runs/$T-$C-$H --tree=/home/user/wt/ba-$T --workers=4 --views > $LOG 2>&1
E=$?
echo "exit=$E" >> $LOG
echo "secs=$(( $(date +%s)-START ))" >> $LOG
exit $E
