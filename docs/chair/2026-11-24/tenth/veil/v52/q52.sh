#!/bin/sh
# VEIL-52 unit (1): THE THREE MEASURES. Every lane instrument run UNCHANGED from a detached worktree of the branch that holds it;
# the two copies of wd (snap, wdmi: this branch's v52/meas/) are copied beside wd in the i43 worktree (their relative import of
# tell-common.mjs) and run from there. One mutex hold per step; each step's rc and the hour (date -u) appended to
# /var/tmp/v52/log/q52.log.   Usage: sh q52.sh [step ...]
#   trees: tip = b58abc48b; master = db832c892 (origin/master); join = the trial join rebuilt locally (9e6547f0f + f03e9a868 +
#          b58abc48b, merged clean; veil source and SQL byte-equal to the tip's); i42 = d71a3ee44 (dump.sh); i43 = b126c9813 (wd).
#   template v28tpl = v27x211 + the tip's 212 (make-instruments.sh, VEIL-50's recipe).
V=docs/chair/2026-11-20/veil/out; O=/var/tmp/v52/out; L=/var/tmp/v52/log/q52.log; mkdir -p $O/emptypool
I42=/home/user/wt/i42/$V; I43=/home/user/wt/i43/$V; M=$I43/v52/meas; HERE=$(cd "$(dirname "$0")" && pwd)
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
cpm() { mkdir -p $M && cp $HERE/meas/* $M/; }
step_dumps() { mx sh -c "cd /home/user/wt/tip && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/tip $O/stored-today $O/emptypool && cd /home/user/wt/master && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/master $O/stored-master $O/emptypool && cd /home/user/wt/join && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh /home/user/wt/join $O/stored-join $O/emptypool" > $O/dumps.txt 2>&1; st dumps $?; }
# (1b) names at the map's import: wd's copy with import_gallery_map's member as a fifth server door; a plant first, on one shard
step_miplant() { cpm; mx sh -c "WD_PLANT=1 WD_SHARDS=1 RV9_PICK=7 sh $M/wdmi.sh /home/user/wt/join $O/mi-plant v28tpl stored $O/stored-master" > $O/mi-plant.txt 2>&1; st miplant $?; }
step_mitip() { cpm; mx sh $M/wdmi.sh /home/user/wt/join $O/mi-tip v28tpl stored $O/stored-today > $O/mi-tip.txt 2>&1; st mitip $?; }
step_mimaster() { cpm; mx sh $M/wdmi.sh /home/user/wt/join $O/mi-master v28tpl stored $O/stored-master > $O/mi-master.txt 2>&1; st mimaster $?; }
step_mijoin() { cpm; mx sh $M/wdmi.sh /home/user/wt/join $O/mi-join v28tpl stored $O/stored-join > $O/mi-join.txt 2>&1; st mijoin $?; }
# (1a) the world snapshots: wd's copy reading both map reads' worlds; a plant first, on one shard
step_snplant() { cpm; mx sh -c "SNAP_PLANT=1 WD_SHARDS=1 sh $M/snap.sh /home/user/wt/join $O/sn-plant v28tpl stored $O/stored-today" > $O/sn-plant.txt 2>&1; st snplant $?; }
step_sntip() { cpm; mx sh $M/snap.sh /home/user/wt/join $O/sn-tip v28tpl stored $O/stored-today > $O/sn-tip.txt 2>&1; st sntip $?; }
step_snmaster() { cpm; mx sh $M/snap.sh /home/user/wt/join $O/sn-master v28tpl stored $O/stored-master > $O/sn-master.txt 2>&1; st snmaster $?; }
step_snjoin() { cpm; mx sh $M/snap.sh /home/user/wt/join $O/sn-join v28tpl stored $O/stored-join > $O/sn-join.txt 2>&1; st snjoin $?; }
# PP (the chair's question for the owner, via VEIL-50 22:2x): pages published before the veil; a copy of um beside um in i44
I44=/home/user/wt/i44/$V
step_pp() { mkdir -p $I44/v52/pp && cp $HERE/pp/* $I44/v52/pp/; mx sh $I44/v52/pp/pp.sh /home/user/wt/tip $O/pp-master v28tpl stored $O/stored-master > $O/pp-master.txt 2>&1; st pp $?; }
step_ppimp() { mkdir -p $I44/v52/pp && cp $HERE/pp/* $I44/v52/pp/; mx sh -c "PP_IMPORT=1 sh $I44/v52/pp/pp.sh /home/user/wt/tip $O/pp-imp v28tpl stored $O/stored-master" > $O/pp-imp.txt 2>&1; st ppimp $?; }
step_pptoday() { mkdir -p $I44/v52/pp && cp $HERE/pp/* $I44/v52/pp/; mx sh -c "PP_TODAY=1 PP_CLASSIFY_SRC=/home/user/wt/tip sh $I44/v52/pp/pp.sh /home/user/wt/master $O/pp-today v52mst stored $O/stored-master" > $O/pp-today.txt 2>&1; st pptoday $?; }
step_readcost() { mx sh -c "N115_LISTS=1 N115_OUT=/var/tmp/v52/out/readcost sh $HERE/n115.sh" > $O/readcost.txt 2>&1; st readcost $?; }
step_pptodayimp() { mkdir -p $I44/v52/pp && cp $HERE/pp/* $I44/v52/pp/; mx sh -c "PP_TODAY=1 PP_IMPORT=1 PP_CLASSIFY_SRC=/home/user/wt/tip sh $I44/v52/pp/pp.sh /home/user/wt/master $O/pp-todayimp v52mst stored $O/stored-master" > $O/pp-todayimp.txt 2>&1; st pptodayimp $?; }
step_miplant2() { cpm; mx sh -c "WD_PLANT=1 WD_PLANT_SEED=r3m-metropolis-none-1-127 WD_SEEDS=r3m-metropolis-none-1-127 WD_SHARDS=1 sh $M/wdmi.sh /home/user/wt/join $O/mi-plant2 v28tpl stored $O/stored-master" > $O/mi-plant2.txt 2>&1; st miplant2 $?; }
step_snplant2() { cpm; mx sh -c "SNAP_PLANT=1 WD_SHARDS=1 sh $M/snap.sh /home/user/wt/join $O/sn-plant2 v28tpl stored $O/stored-master" > $O/sn-plant2.txt 2>&1; st snplant2 $?; }
step_snapchron() { for spec in master:v52mst tip:v28tpl; do t=${spec%%:*}; tpl=${spec#*:}; mx sh -c "cd /home/user/wt/$t && $E PGHOST=/var/tmp/rv7 RV6_SRC=/home/user/wt/$t RV9_PROBE=$HERE/snapchron/snapchron.probe.jsx SC_TPL=$tpl SC_TAG=$t SC_DIR=$O/stored-today SC_OUT=$O/snapchron-$t.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs" > $O/snapchron-$t.log 2>&1; st snapchron-$t $?; done; }
step_miplant3() { cpm; mx sh -c "WD_PLANT=1 WD_PLANT_DESC=1 WD_PLANT_SEED=r3m-metropolis-none-1-127 WD_SEEDS=r3m-metropolis-none-1-127 WD_SHARDS=1 sh $M/wdmi.sh /home/user/wt/join $O/mi-plant3 v28tpl stored $O/stored-master" > $O/mi-plant3.txt 2>&1; st miplant3 $?; }
step_snplant3() { cpm; mx sh -c "SNAP_PLANT=1 SNAP_PLANT_PERSON=1 SNAP_MAXC=3 WD_SHARDS=1 sh $M/snap.sh /home/user/wt/join $O/sn-plant3 v28tpl stored $O/stored-master" > $O/sn-plant3.txt 2>&1; st snplant3 $?; }
step_miplant4() { cpm; mx sh -c "WD_PLANT=1 WD_PLANT_POWER=1 WD_PLANT_SEED=r3m-city-none-1-111 WD_SEEDS=r3m-city-none-1-111 WD_SHARDS=1 sh $M/wdmi.sh /home/user/wt/join $O/mi-plant4 v28tpl stored $O/stored-master" > $O/mi-plant4.txt 2>&1; st miplant4 $?; }
step_mipersonstip() { cpm; mx sh -c "WD_PERSONS=1 sh $M/wdmi.sh /home/user/wt/join $O/mi-persons-tip v28tpl stored $O/stored-today" > $O/mi-persons-tip.txt 2>&1; st mipersonstip $?; }
step_mipersonsmaster() { cpm; mx sh -c "WD_PERSONS=1 sh $M/wdmi.sh /home/user/wt/join $O/mi-persons-master v28tpl stored $O/stored-master" > $O/mi-persons-master.txt 2>&1; st mipersonsmaster $?; }
step_miplant5() { cpm; mx sh -c "WD_PLANT=1 WD_PLANT_TAIL=1 WD_PLANT_SEED=r3m-city-indebted-0-46 WD_SEEDS=r3m-city-indebted-0-46 WD_SHARDS=1 sh $M/wdmi.sh /home/user/wt/join $O/mi-plant5 v28tpl stored $O/stored-today" > $O/mi-plant5.txt 2>&1; st miplant5 $?; }
# (1c) N115: the read's time, the tip's chain against master's own, on the same public rows
step_n115() { mx sh $HERE/n115.sh > $O/n115.txt 2>&1; st n115 $?; }
for s in ${*:-dumps miplant snplant mitip mimaster mijoin sntip snmaster snjoin n115}; do step_$s; done
echo "q52 END $(date -u +%H:%M:%S)" >> $L
