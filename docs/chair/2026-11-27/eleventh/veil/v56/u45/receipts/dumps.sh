#!/bin/sh
# U45B: the two stored pools of 140 (VEIL-51 p1.sh step_dumps; today = the lane tip's engine dbd4cd9e5, master = db832c892)
I42=/home/user/wt/i42/docs/chair/2026-11-20/veil/out; O=/var/tmp/v51/out/p1
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
cd /home/user/wt/tip
while :; do $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh -c "LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/tip $O/stored-today $O/emptypool && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/master $O/stored-master $O/emptypool"; r=$?; [ $r = 3 ] || break; done
echo "dumps rc=$r $(date -u +%T)"
