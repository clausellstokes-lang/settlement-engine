#!/bin/sh
# VEIL-55: THE MACHINE RE-MADE in a fresh container (VEIL-50's was lost with its container), then unit 2's two unfinished steps.
# Run detached: nohup sh m0.sh > /var/tmp/v55/m0.out 2>&1 &   Every step's rc and hour (date -u) to /var/tmp/v55/m0.log.
# Trees: /home/user/wt/r4ids -> the checkout at 8430edf5c (lane/veil-55-2026-11-24-r4ids-wip); /home/user/wt/tip = b58abc48b;
# /home/user/wt/master = db832c892; i42 = d71a3ee44 (dump.sh); red trees r4red1 = 392aff978, r4red2 = 84f2e2bba (u2.sh tpl).
# Instruments run UNCHANGED from the trees that hold them: make-instruments.sh (v28 seated), dump.sh (i42), u2.sh's own.
S=/home/user/wt/docs/docs/chair/2026-11-24/tenth/veil/v55; W=/home/user/wt/r4ids; V=$W/docs/chair/2026-11-20/veil/out
I42=/home/user/wt/i42/docs/chair/2026-11-20/veil/out; O=/var/tmp/v55/out; L=/var/tmp/v55/m0.log; mkdir -p $O/emptypool
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%FT%TZ)" >> $L; }
step_ledger() { git -C $W fetch -q origin review-fixes-2026-07-08 && git -C $W branch -f review-fixes-2026-07-08 FETCH_HEAD; st ledger $?; }
step_red() { for x in "r4red1 392aff978" "r4red2 84f2e2bba"; do set -- $x; [ -d /home/user/wt/$1 ] || git -C $W worktree add --detach /home/user/wt/$1 $2 >/dev/null 2>&1; [ -e /home/user/wt/$1/node_modules ] || ln -s /home/user/settlement-engine/node_modules /home/user/wt/$1/node_modules; done; st red "$(git -C /home/user/wt/r4red1 rev-parse --short HEAD) $(git -C /home/user/wt/r4red2 rev-parse --short HEAD)"; }
step_instr() { mx sh $V/v28/seated/make-instruments.sh $W $O/seated > $O/instr.txt 2>&1; st instr "$? $(tr '\n' ' ' < $O/seated/exits.txt)"; }
step_tpl() { sh $S/u2.sh tpl; st tpl "$(tail -1 $O/u2/tpl.log)"; }
step_dumps() { mx sh -c "cd /home/user/wt/tip && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/tip $O/stored-today $O/emptypool && cd /home/user/wt/master && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/master $O/stored-master $O/emptypool" > $O/dumps.txt 2>&1; st dumps "$? today:$(tr '\n' ' ' < $O/stored-today/done.txt) master:$(tr '\n' ' ' < $O/stored-master/done.txt)"; }
step_c() { sh $S/u2.sh c; st c "$(tail -1 $O/u2/c.log)"; }
step_sec() { sh $S/u2.sh sec; st sec "$(tail -1 $O/u2/sec.log)"; }
for s in ${*:-ledger red instr tpl dumps c sec}; do step_$s; done
echo "m0 END $(date -u +%FT%TZ)" >> $L
