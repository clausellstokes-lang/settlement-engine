#!/bin/sh
# MC (VEIL-56) (the second half of run.sh, its steps 4 on): every step of this seat's measure, ONE mutex hold a step, each step's rc and the hour (date -u) to
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
# 4. the map read's candidate cures, untracked, applied one on top of the other; then the split by step with both applied
step_trialmap() { fresh mct_u3 mcu3; mx node $M/trialmap.mjs mct_u3 $S $O/trialmap-u3.json $M/fixed-salt.sql $M/trial-roster.sql $M/trial-sanit.sql > $O/trialmap-u3.txt 2>&1; st trialmap $?; }
step_btrial() { fresh mcb_tr mcu3; psql -X -q -v ON_ERROR_STOP=1 -d mcb_tr -f $M/trial-roster.sql -f $M/trial-sanit.sql > $O/btrial-apply.txt 2>&1
  mx node $V52/b-steps.mjs mcb_tr $S $O/bsteps-trial.json > $O/bsteps-trial.txt 2>&1; st btrial $?; }
# the differential: every door, every row, as built against both trials (the fixed salt in both)
step_diff() { for v in base trial; do db=mcd_$v; fresh $db mcu3; psql -X -q -v ON_ERROR_STOP=1 -d $db -f $M/fixed-salt.sql > $O/diff-apply-$v.txt 2>&1
  [ $v = trial ] && psql -X -q -v ON_ERROR_STOP=1 -d $db -f $M/trial-roster.sql -f $M/trial-sanit.sql >> $O/diff-apply-$v.txt 2>&1
  mx node $M/diff.mjs $db $S $O/diff-$v.json > $O/diff-$v.txt 2>&1; st diff-$v $?; done
  node $M/cmp-diff.mjs $O/diff-base.json $O/diff-trial.json > $O/diff-cmp.txt 2>&1; st diff-cmp $?; }
# READ-COST: (i), then (ii'), then (ii), each on top of the last, on n115's 840 rows
step_readcost() { fresh mcr_u3 mcu3; mx node $M/readcost.mjs mcr_u3 $S $O/readcost-u3.json $M/fixed-salt.sql $M/rc-i.sql $M/rc-keep-old.sql $M/rc-iid.sql $M/rc-ii.sql > $O/readcost-u3.txt 2>&1; st readcost $?; }
for s in "$@"; do step_$s; done
echo "run2 END $* $(date -u +%FT%TZ)" >> $L
