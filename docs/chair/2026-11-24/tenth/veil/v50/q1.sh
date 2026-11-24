#!/bin/sh
# VEIL-50 unit (1)(b): THE DIRECT-SERVE MEASURE. Every instrument is the lane's, run UNCHANGED from a detached worktree of the
# branch that holds it (my permission check refused copying them onto this branch). One mutex hold per step; a step's rc and
# the hour (date -u) appended to /var/tmp/v50/log/q1.log. Usage: sh q1.sh [step ...]   steps: dumps wdtip wdmaster wdjoin umtip umjoin umaster prose
#   trees: /home/user/wt/tip = b58abc48b (the lane's tip); /home/user/wt/master = db832c892 (origin/master, master-born);
#          /home/user/wt/join = the trial join (9e6547f0f + f03e9a868 + b58abc48b, local only: both generation laws lit).
#   instruments: i42 = d71a3ee44 (dump.sh, um.sh), i43 = b126c9813 (wd.sh: NAMES), i41 = ccc2e5473 (prose.sh, c1-an.mjs).
#   template v28tpl = v27x211 + the tip's 212 (make-instruments.sh); the join's 212 is the tip's byte for byte.
V=docs/chair/2026-11-20/veil/out; O=/var/tmp/v50/out; L=/var/tmp/v50/log/q1.log; mkdir -p $O/emptypool
I41=/home/user/wt/i41/$V; I42=/home/user/wt/i42/$V; I43=/home/user/wt/i43/$V
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
step_dumps() { mx sh -c "cd /home/user/wt/tip && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/tip $O/stored-today $O/emptypool && cd /home/user/wt/master && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/master $O/stored-master $O/emptypool && cd /home/user/wt/join && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/join $O/stored-join $O/emptypool" > $O/dumps.txt 2>&1; st dumps $?; }
step_wdtip() { mx sh $I43/v43/meas/wd.sh /home/user/wt/tip $O/wd-tip v28tpl stored $O/stored-today > $O/wd-tip.txt 2>&1; st wdtip $?; }
step_wdmaster() { mx sh $I43/v43/meas/wd.sh /home/user/wt/tip $O/wd-master v28tpl stored $O/stored-master > $O/wd-master.txt 2>&1; st wdmaster $?; }
step_wdjoin() { mx sh $I43/v43/meas/wd.sh /home/user/wt/join $O/wd-join v28tpl stored $O/stored-join > $O/wd-join.txt 2>&1; st wdjoin $?; }
step_umtip() { mx sh -c "UM_U=1 sh $I42/v42/meas/um.sh /home/user/wt/tip $O/um-tip v28tpl stored $O/stored-today" > $O/um-tip.txt 2>&1; st umtip $?; }
step_umaster() { mx sh -c "UM_U=1 sh $I42/v42/meas/um.sh /home/user/wt/tip $O/um-master v28tpl stored $O/stored-master" > $O/um-master.txt 2>&1; st umaster $?; }
step_umjoin() { mx sh -c "UM_U=1 sh $I42/v42/meas/um.sh /home/user/wt/join $O/um-join v28tpl stored $O/stored-join" > $O/um-join.txt 2>&1; st umjoin $?; }
step_prose() { mx sh -c "sh $I41/v33/stored/prose.sh /home/user/wt/tip $O/stored-today $O/prose-tip && node $I41/v33/stored/c1-an.mjs $O/stored-today $O/prose-tip /home/user/wt/tip/src/domain/veil/rosterChoiceRegistry.js" > $O/prose-tip.txt 2>&1; st prose $?; }
for s in ${*:-dumps wdtip umtip wdmaster umaster wdjoin umjoin prose}; do step_$s; done
echo "q1 END $(date -u +%H:%M:%S)" >> $L
