#!/bin/sh
# U3R part C (the measure after the cure): template v56cure = v27x211 + the tip's 212; fc2 on both pools, the PS plant and the
# two drifts, the tree the tip's (its twin makes the T copy). Then galleryImportEqualsRead alone (long).
set -u
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
H=/home/user/settlement-engine; U=/var/tmp/v56/u3r; O=/var/tmp/v56/fc; L=/var/tmp/v56/runD.log; ST=/var/tmp/v52/out; N=/home/user/wt/u3rn
mx() { (cd $H && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S) $(git -C $N rev-parse --short HEAD)" >> $L; }
export PGHOST=/var/tmp/rv7 PGUSER=postgres
for s in ${*:-tpl c1 c2 cp cd1 cd2 ier}; do case $s in
  tpl) (dropdb --if-exists v56cure && createdb -T v27x211 v56cure && psql -q -v ON_ERROR_STOP=1 -d v56cure -f $N/supabase/migrations/212_share_veil_later_cures.sql) > $O/tplcure.log 2>&1; st tpl $?;;
  c1) mx sh $U/fc2.sh $N $O/c-today v56cure $ST/stored-today > $O/c1.txt 2>&1; st c1 $?;;
  c2) mx sh $U/fc2.sh $N $O/c-master v56cure $ST/stored-master > $O/c2.txt 2>&1; st c2 $?;;
  cp) mx sh -c "FC_PS_PLANT=1 sh $U/fc2.sh $N $O/c-plant v56cure $ST/stored-today" > $O/cp.txt 2>&1; st cp $?;;
  cd1) mx sh -c "MEAS_SEEDS=$(cat /var/tmp/v56/covert-seeds.txt) FC_DRIFT=deleted sh $U/fc2.sh $N $O/c-drift-deleted v56cure $ST/stored-today" > $O/cd1.txt 2>&1; st cd1 $?;;
  cd2) mx sh -c "MEAS_SEEDS=$(cat /var/tmp/v56/covert-seeds.txt) FC_DRIFT=renamed sh $U/fc2.sh $N $O/c-drift-renamed v56cure $ST/stored-today" > $O/cd2.txt 2>&1; st cd2 $?;;
  ier) mx sh -c "cd $N && $E sh scripts/gate-tail.sh npx vitest run tests/security/galleryImportEqualsRead.pglite.test.js" > /var/tmp/v56/tests/ier.log 2>&1; st ier $?;;
esac; done
echo "runD END $(date -u +%H:%M:%S)" >> $L
