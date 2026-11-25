#!/bin/sh
# VEIL-51 UNIT 5 step (1): the plant run of wd (b126c9813, unchanged; tree /home/user/wt/u4m; template v51_c2), one mutex call, no retry
# (wd-an exits 3 on MAP OTHER). The natural master-born run is u4's wd-master (00:52). Run: sh u5.sh
O=/var/tmp/v51/out/u5; mkdir -p $O; P=$(cd "$(dirname "$0")" && pwd); export PGHOST=/var/tmp/rv7 PGUSER=postgres
rm -rf $O/stored-plant5; node $P/plant5.mjs /var/tmp/v51/out/p1/stored-master $O/stored-plant5 > $O/plant5.txt 2>&1; echo "plant5 rc=$? $(date -u +%H:%M:%S)" >> $O/u5.log
cd /home/user/settlement-engine && env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE GATE_MUTEX_MAX_POLLS=1000000 sh scripts/gate-mutex.sh --run -- sh /home/user/wt/i43/docs/chair/2026-11-20/veil/out/v43/meas/wd.sh /home/user/wt/u4m $O/wd-plant5 v51_c2 stored $O/stored-plant5 > $O/wd-plant5.txt 2>&1; echo "wd-plant5 rc=$? $(date -u +%H:%M:%S)" >> $O/u5.log
