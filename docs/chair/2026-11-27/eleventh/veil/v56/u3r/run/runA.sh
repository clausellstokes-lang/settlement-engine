#!/bin/sh
# U3R part A: templates, VEIL-52's measure re-run as it stands (fc.sh, 4 runs), then A2 (writer) and A3 (drift) via fc2.sh.
set -u
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
H=/home/user/settlement-engine; FC=$H/docs/chair/2026-11-24/tenth/veil/v52/frozen; U=/var/tmp/v56/u3r; O=/var/tmp/v56/fc; L=/var/tmp/v56/runA.log; ST=/var/tmp/v52/out
mkdir -p $O
mx() { (cd $H && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
export PGHOST=/var/tmp/rv7 PGUSER=postgres
for s in ${*:-tpl a1 a2 a3 a4 w1 w2 d1 d2}; do case $s in
  wp) mx sh -c "FC_PS_PLANT=1 sh $U/fc2.sh /home/user/wt/dsql $O/w-plant v52dsql $ST/stored-today" > $O/wp.txt 2>&1; st wp $?;;
  tpl) (git -C $H show dbd4cd9e5:supabase/migrations/212_share_veil_later_cures.sql > $O/212-tip.sql
        dropdb --if-exists v52tip && createdb -T v27x211 v52tip && psql -q -v ON_ERROR_STOP=1 -d v52tip -f $O/212-tip.sql
        dropdb --if-exists v52dsql && createdb -T v27x211 v52dsql && psql -q -v ON_ERROR_STOP=1 -d v52dsql -f /home/user/wt/dsql/supabase/migrations/212_share_veil_later_cures.sql) > $O/tpl.log 2>&1; st tpl $?;;
  a1) mx sh $FC/fc.sh /home/user/wt/dsql $O/today-v52tip v52tip $ST/stored-today > $O/a1.txt 2>&1; st a1 $?;;
  a2) mx sh $FC/fc.sh /home/user/wt/dsql $O/today-v52dsql v52dsql $ST/stored-today > $O/a2.txt 2>&1; st a2 $?;;
  a3) mx sh $FC/fc.sh /home/user/wt/dsql $O/master-v52tip v52tip $ST/stored-master > $O/a3.txt 2>&1; st a3 $?;;
  a4) mx sh $FC/fc.sh /home/user/wt/dsql $O/master-v52dsql v52dsql $ST/stored-master > $O/a4.txt 2>&1; st a4 $?;;
  w1) mx sh $U/fc2.sh /home/user/wt/dsql $O/w-today v52dsql $ST/stored-today > $O/w1.txt 2>&1; st w1 $?;;
  w2) mx sh $U/fc2.sh /home/user/wt/dsql $O/w-master v52dsql $ST/stored-master > $O/w2.txt 2>&1; st w2 $?;;
  d1) mx sh -c "FC_DRIFT=deleted sh $U/fc2.sh /home/user/wt/dsql $O/drift-deleted v52dsql $ST/stored-today" > $O/d1.txt 2>&1; st d1 $?;;
  d2) mx sh -c "MEAS_SEEDS=$(cat /var/tmp/v56/covert-seeds.txt) FC_DRIFT=renamed sh $U/fc2.sh /home/user/wt/dsql $O/drift-renamed v52dsql $ST/stored-today" > $O/d2.txt 2>&1; st d2 $?;;
esac; done
echo "runA END $(date -u +%H:%M:%S)" >> $L
