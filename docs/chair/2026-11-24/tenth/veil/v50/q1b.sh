#!/bin/sh
# VEIL-50 unit (1)(b), q1's corrected steps (19:3x): wd.probe.jsx (b126c9813) imports src/data/dailyLife/commonerResentments.js,
# which the tip lacks (the line's Daily Life page): it runs from the TRIAL JOIN's tree, whose veil source and SQL are byte-equal to
# the tip's (`git diff b58abc48b cdab6d2fc -- src/domain/display/gallery*.js src/domain/veil src/domain/people/cardVeil.js
# src/lib/gallery.js src/lib/publicSafe.js supabase` is EMPTY), against template v28tpl (the tip's 212): the server's doors are the
# tip's. um.probe.jsx at d71a3ee44 imports the R4-IDS file galleryVeilPeople.js: VEIL-44's MAP-COVERT copy (6edc79094,
# out/v44/mapcovert/um.sh, which loads it only for UM_M=1) is used instead, UM_U=1, unchanged.
V=docs/chair/2026-11-20/veil/out; O=/var/tmp/v50/out; L=/var/tmp/v50/log/q1.log
I43=/home/user/wt/i43/$V; I44=/home/user/wt/i44/$V
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
step_umtip() { mx sh -c "UM_U=1 sh $I44/v44/mapcovert/um.sh /home/user/wt/tip $O/um-tip v28tpl stored $O/stored-today" > $O/um-tip.txt 2>&1; st umtip-b $?; }
step_umaster() { mx sh -c "UM_U=1 sh $I44/v44/mapcovert/um.sh /home/user/wt/tip $O/um-master v28tpl stored $O/stored-master" > $O/um-master.txt 2>&1; st umaster-b $?; }
step_umjoin() { mx sh -c "UM_U=1 sh $I44/v44/mapcovert/um.sh /home/user/wt/join $O/um-join v28tpl stored $O/stored-join" > $O/um-join.txt 2>&1; st umjoin-b $?; }
step_wdtip() { mx sh $I43/v43/meas/wd.sh /home/user/wt/join $O/wd-tip v28tpl stored $O/stored-today > $O/wd-tip.txt 2>&1; st wdtip-b $?; }
step_wdmaster() { mx sh $I43/v43/meas/wd.sh /home/user/wt/join $O/wd-master v28tpl stored $O/stored-master > $O/wd-master.txt 2>&1; st wdmaster-b $?; }
for s in ${*:-umtip umaster umjoin wdtip wdmaster}; do step_$s; done
echo "q1b END $(date -u +%H:%M:%S)" >> $L
