#!/bin/sh
# MC (VEIL-56): every step of this seat's measure, ONE mutex hold a step, each step's rc and the hour (date -u) to
# /var/tmp/mc/log/run.log.   sh run.sh <step ...>
# Machine: VEIL-52's recipe (v52/restore.sh, its make-instruments.sh step) built PostgreSQL 16 on /var/tmp/rv7 and the
# templates v27x211 (001..211) and v28tpl (v27x211 + the lane tip dbd4cd9e5's 212); mcu3 = v27x211 + unit 3's 212 (2f849aa53).
# Every database is local; nothing here touches any other.
set -u
H=/home/user/settlement-engine; M=$(cd "$(dirname "$0")" && pwd); O=/var/tmp/mc/out; L=/var/tmp/mc/log/run.log
V52=/var/tmp/mc/v52; S=$O/stored-today; mkdir -p $O $V52
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mx() { (cd $H && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%FT%TZ)" >> $L; }
fresh() { psql -qd postgres -c "drop database if exists $1 with (force)" -c "create database $1 template $2" >/dev/null; }
step_tpl() { mx sh -c "dropdb --if-exists mcu3 && createdb -T v27x211 mcu3 && psql -X -q -v ON_ERROR_STOP=1 -d mcu3 -f /home/user/wt/u3/supabase/migrations/212_share_veil_later_cures.sql" > $O/tpl-u3.txt 2>&1; st tpl $?; }
step_dumps() { mkdir -p $O/emptypool; mx sh -c "cd /home/user/wt/tip && LP_A=0 LP_B=0 LP_TOWNS=1 sh /home/user/wt/tip/docs/chair/2026-11-20/veil/out/v33/legacy/dump.sh /home/user/wt/tip $S $O/emptypool" > $O/dumps.txt 2>&1; st dumps $?; }
step_v52() { git -C $H show origin/lane/veil-52-2026-11-24:docs/chair/2026-11-24/tenth/veil/v52/mapcost/b-steps.mjs > $V52/b-steps.mjs; st v52 $?; }
# 1. B-STEPS re-run, VEIL-52's script UNCHANGED, on a fresh copy of each template
step_bu3() { fresh mcb_u3 mcu3; mx node $V52/b-steps.mjs mcb_u3 $S $O/bsteps-u3.json > $O/bsteps-u3.txt 2>&1; st bu3 $?; }
step_btip() { fresh mcb_tip v28tpl; mx node $V52/b-steps.mjs mcb_tip $S $O/bsteps-tip.json > $O/bsteps-tip.txt 2>&1; st btip $?; }
# 3. sizes: one member's cost untracked, every stored document, unmarked and hand, both trees
step_sizes() { for t in u3:mcu3 tip:v28tpl; do n=${t%%:*}; tp=${t#*:}; for mk in unmarked hand; do db=mcs_${n}_$mk; fresh $db $tp
  mx node $M/sizes.mjs $db $S $mk $O/sizes-$n-$mk.json > $O/sizes-$n-$mk.txt 2>&1; st sizes-$n-$mk $?; done; done; }
# 2. the lock: N concurrent readers of one 20-member map, as built and with the two local trial copies
step_lock() { for v in asbuilt after out; do db=mcl_$v; fresh $db mcu3
  [ $v = asbuilt ] || psql -X -q -v ON_ERROR_STOP=1 -d $db -f $M/lock-$v.sql >> $O/lock-apply.txt 2>&1
  mx node $M/lock.mjs $db $S ${LOCK_K:-20} $O/lock-$v.json $v > $O/lock-$v.txt 2>&1; st lock-$v $?; done; }
for s in "$@"; do step_$s; done
echo "run END $* $(date -u +%FT%TZ)" >> $L
