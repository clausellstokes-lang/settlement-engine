#!/bin/sh
# R4I-MEASURE's runs, IN ORDER, each its own hold of the gate mutex (so the seat can run between them), each to its own
# outdir under /var/tmp/v18/out/v42/meas/<step>, each step's exit in chain.log. `sh chain.sh [step ...]` runs the steps named, in
# the order named (default: a7 ctrl dumps t140 pool m140 bt140 bm140 bpool, the seat's order of 07:2x UTC: A's pool before C's
# sets). The pool steps wait for the seat's pool (doneA/doneB, 4 rc=0 each).
P=$(cd "$(dirname "$0")" && pwd); O=/var/tmp/v18/out/v42/meas; L=$O/chain.log; mkdir -p $O
WIP=/home/user/wt/meas; TIP=/home/user/wt/tip; MAS=/home/user/wt/master; POOL=/var/tmp/v18/t2/pool-v42
ST=/var/tmp/v18/out/v42/stored-today; SM=/var/tmp/v18/out/v42/stored-master; EMPTY=/var/tmp/v18/out/v42/emptypool
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
SEVEN=r3m-town-wartime-0-29,r3m-metropolis-none-1-137,r3m-city-infiltrated-0-42,r3m-metropolis-infiltrated-0-62,r3m-city-infiltrated-1-102,r3m-city-under_siege-1-118,r3m-city-none-1-107
MX="$E GATE_MUTEX_MAX_POLLS=100000 sh $WIP/scripts/gate-mutex.sh --run --"
step() { n=$1; shift; echo "$n start $(date -u +%H:%M:%S)" >> $L; "$@" > $O/$n.txt 2>&1; echo "$n rc=$? $(date -u +%H:%M:%S)" >> $L; }
poolready() { for f in doneA.txt doneB.txt; do [ -f $POOL/$f ] && [ "$(grep -c 'rc=0' $POOL/$f)" = 4 ] || return 1; done; }
s_a7() { step a7 sh -c "cd $WIP && $MX env MEAS_C=1 MEAS_SEEDS=$SEVEN sh $P/meas.sh $WIP $O/a7 v28tpl towns"; }
s_ctrl() { step ctrl sh -c "cd $WIP && $MX env MEAS_C=1 sh $P/meas.sh $WIP $O/ctrl v28tpl handreach"; }
s_dumps() { step dumps sh -c "mkdir -p $EMPTY && cd $WIP && $MX sh -c '$E LP_A=0 LP_B=0 LP_TOWNS=1 sh $P/../../v33/legacy/dump.sh $WIP $ST $EMPTY && $E LP_A=0 LP_B=0 LP_TOWNS=1 sh $P/../../v33/legacy/dump.sh $MAS $SM $EMPTY'"; }
s_t140() { step t140 sh -c "cd $WIP && $MX env MEAS_C=1 MEAS_STORED_CMP=$ST sh $P/meas.sh $WIP $O/t140 v28tpl towns"; }
s_m140() { step m140 sh -c "cd $WIP && $MX env MEAS_C=1 sh $P/meas.sh $WIP $O/m140 v28tpl stored $SM"; }
s_bt140() { step bt140 sh -c "cd $WIP && $MX env MEAS_BIJ=0 MEAS_DOORS=gallery,link sh $P/meas.sh $TIP $O/bt140 v42tip towns"; }
s_bm140() { step bm140 sh -c "cd $WIP && $MX env MEAS_BIJ=0 MEAS_DOORS=gallery,link sh $P/meas.sh $TIP $O/bm140 v42tip stored $SM"; }
s_pool() { until poolready; do sleep 60; done; step pool sh -c "cd $WIP && $MX env MEAS_C=1 MEAS_DOORS=gallery sh $P/meas.sh $WIP $O/pool v28tpl pool $POOL"; }
s_bpool() { step bpool sh -c "cd $WIP && $MX env MEAS_BIJ=0 MEAS_DOORS=gallery sh $P/meas.sh $TIP $O/bpool v42tip pool $POOL"; }
for n in ${@:-a7 ctrl dumps t140 pool m140 bt140 bm140 bpool}; do s_$n; done
echo "END $(date -u +%H:%M:%S)" >> $L
