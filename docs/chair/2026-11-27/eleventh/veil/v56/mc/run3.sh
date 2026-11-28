#!/bin/sh
# MC (VEIL-56) (after run2.sh): the sanitiser built once (trial-sanit2.sql) timed on top of the other trials, its own
# differential, and the roster choices' statement probe. One mutex hold a step; rc and hour to /var/tmp/mc/log/run.log.
set -u
H=/home/user/settlement-engine; M=$(cd "$(dirname "$0")" && pwd); O=/var/tmp/mc/out; L=/var/tmp/mc/log/run.log; S=$O/stored-today
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mx() { (cd $H && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%FT%TZ)" >> $L; }
fresh() { psql -qd postgres -c "drop database if exists $1 with (force)" -c "create database $1 template $2" >/dev/null; }
step_trialmap2() { fresh mct2_u3 mcu3; mx node $M/trialmap.mjs mct2_u3 $S $O/trialmap2-u3.json $M/fixed-salt.sql $M/trial-roster.sql $M/trial-sanit.sql $M/trial-sanit2.sql > $O/trialmap2-u3.txt 2>&1; st trialmap2 $?; }
step_diff2() { db=mcd_trial2; fresh $db mcu3; psql -X -q -v ON_ERROR_STOP=1 -d $db -f $M/fixed-salt.sql -f $M/trial-roster.sql -f $M/trial-sanit.sql -f $M/trial-sanit2.sql > $O/diff-apply-trial2.txt 2>&1
  mx node $M/diff.mjs $db $S $O/diff-trial2.json > $O/diff-trial2.txt 2>&1; st diff-trial2 $?
  node $M/cmp-diff.mjs $O/diff-base.json $O/diff-trial2.json > $O/diff-cmp2.txt 2>&1; st diff-cmp2 $?; }
step_probe() { db=mcp_u3; fresh $db mcu3; psql -X -q -v ON_ERROR_STOP=1 -d $db -f $M/trial-roster.sql -f $M/trial-sanit.sql -f $M/trial-sanit2.sql > $O/probe-apply.txt 2>&1
  mx node $M/roster-probe.mjs $db $M/trial-roster.sql $S $O/roster-probe.json > $O/roster-probe.txt 2>&1; st probe $?; }
for s in "$@"; do step_$s; done
echo "run3 END $* $(date -u +%FT%TZ)" >> $L
