#!/bin/sh
# VEIL-52 unit 3's SLICE PROOFS (VEIL-55's rule (2)): the 140 of each stored set, RED on the lane's tip, GREEN on the -dsql-wip.
#   tpl: v52tip = v27x211 + 212 at the lane's tip dbd4cd9e5; v52dsql = v27x211 + 212 at -dsql-wip (2f849aa53)
#   um  (VEIL-44's MAP-COVERT, 6edc79094, UM_U=1 UM_ASSERT=map): the map member, its page and import_gallery_map's member carry
#        no covert copy at Reveal off: RED on v52tip (expected 21+21 today-born, 13+13 lit-born), GREEN on v52dsql (0)
#   plant (V21's standing-tail plant, wdmi WD_PLANT_TAIL=1 on r3m-city-indebted-0-46): caught at every door on v52dsql
# One mutex hold per line; rc and hour to /var/tmp/v52/log/u3.log; outputs /var/tmp/v52/u3/.
U=/var/tmp/v52/u3; L=/var/tmp/v52/log/u3.log; ST=/var/tmp/v52/out; UM=/home/user/wt/i44/docs/chair/2026-11-20/veil/out/v44/mapcovert/um.sh
M=/home/user/wt/i43/docs/chair/2026-11-20/veil/out/v52/meas; Q=/home/user/settlement-engine/docs/chair/2026-11-24/tenth/veil/v52
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
export PGHOST=/var/tmp/rv7 PGUSER=postgres
for s in ${*:-tpl umtipT umtipD umjoinT umjoinD plant}; do case $s in
  tpl) (git -C /home/user/settlement-engine show dbd4cd9e5:supabase/migrations/212_share_veil_later_cures.sql > $U/212-tip.sql
        dropdb --if-exists v52tip && createdb -T v27x211 v52tip && psql -q -v ON_ERROR_STOP=1 -d v52tip -f $U/212-tip.sql
        dropdb --if-exists v52dsql && createdb -T v27x211 v52dsql && psql -q -v ON_ERROR_STOP=1 -d v52dsql -f /home/user/wt/dsql/supabase/migrations/212_share_veil_later_cures.sql) > $U/tpl.log 2>&1; st tpl $?;;
  umtipT) mx sh -c "UM_U=1 UM_ASSERT=map sh $UM /home/user/wt/dsql $U/um-today-tip v52tip stored $ST/stored-today" > $U/um-today-tip.txt 2>&1; st umtipT $?;;
  umtipD) mx sh -c "UM_U=1 UM_ASSERT=map sh $UM /home/user/wt/dsql $U/um-today-dsql v52dsql stored $ST/stored-today" > $U/um-today-dsql.txt 2>&1; st umtipD $?;;
  umjoinT) mx sh -c "UM_U=1 UM_ASSERT=map sh $UM /home/user/wt/dsql $U/um-join-tip v52tip stored $ST/stored-join" > $U/um-join-tip.txt 2>&1; st umjoinT $?;;
  umjoinD) mx sh -c "UM_U=1 UM_ASSERT=map sh $UM /home/user/wt/dsql $U/um-join-dsql v52dsql stored $ST/stored-join" > $U/um-join-dsql.txt 2>&1; st umjoinD $?;;
  plant) mkdir -p $M && cp $Q/meas/* $M/; mx sh -c "WD_PLANT=1 WD_PLANT_TAIL=1 WD_PLANT_SEED=r3m-city-indebted-0-46 WD_SEEDS=r3m-city-indebted-0-46 WD_SHARDS=1 sh $M/wdmi.sh /home/user/wt/join $U/plant-dsql v52dsql stored $ST/stored-today" > $U/plant-dsql.txt 2>&1; st plant $?;;
esac; done
echo "u3b END $(date -u +%H:%M:%S)" >> $L
