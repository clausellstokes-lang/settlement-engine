#!/bin/sh
# usage: run-node.sh <logname> <cmd...>   (through the gate mutex, log with exit=)
N=$1; shift
O=/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-7/before-after
LOG=$O/logs/$N.log
cd /home/user/settlement-engine
START=$(date +%s)
GATE_MUTEX_MAX_POLLS=2000 sh scripts/gate-mutex.sh --run -- "$@" > $LOG 2>&1
E=$?
echo "exit=$E" >> $LOG; echo "secs=$(( $(date +%s)-START ))" >> $LOG
exit $E
