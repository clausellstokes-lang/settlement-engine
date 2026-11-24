#!/bin/sh
# R4I-SQL-2 item 1 (b), RED FIRST: the measure's C (MEAS_C=1) on the control towns (handreach), the instrument copied verbatim,
# read from the read-only snapshot (as run-1a.sh); template sql2_redtpl = v27x211 + 212 at 392aff978 (logs/1b-template-red.txt).
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
R=${SQL2_SRC:-/var/tmp/sql2red}; TPL=${SQL2_TPL:-sql2_redtpl}; O=${SQL2_OUT:-/var/tmp/v18/out/v42/sql2/sql2ctrlred}
L=${SQL2_LOG:-/home/user/wt/sql/docs/chair/2026-11-20/veil/out/v42/sql2/logs/1b-ctrl-red.log}
mkdir -p $(dirname $O); cd $R
echo "start $(date -u +%FT%TZ) src $R ($(cat $R/SNAPSHOT.txt 2>/dev/null || git -C $R rev-parse HEAD)) twin $(sha256sum src/domain/display/galleryVeilPeople.js | cut -c1-16) tpl $TPL out $O" > $L
$E GATE_MUTEX_MAX_POLLS=100000 sh /home/user/wt/sql/scripts/gate-mutex.sh --run -- env MEAS_C=1 sh $R/docs/chair/2026-11-20/veil/out/v42/sql2/meas.sh $R $O $TPL handreach >> $L 2>&1
echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $L
