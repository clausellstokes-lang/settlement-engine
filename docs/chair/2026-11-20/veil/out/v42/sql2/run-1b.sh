#!/bin/sh
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
cd /home/user/wt/sql
L=/home/user/wt/sql/docs/chair/2026-11-20/veil/out/v42/sql2/logs/1b-ctrl-red.log
mkdir -p /var/tmp/v18/out/v42/sql2
echo "start $(date -u +%FT%TZ) HEAD $(git rev-parse HEAD) twin $(sha256sum src/domain/display/galleryVeilPeople.js | cut -c1-16) tpl sql2_redtpl" > $L
$E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- env MEAS_C=1 sh docs/chair/2026-11-20/veil/out/v42/sql2/meas.sh /home/user/wt/sql /var/tmp/v18/out/v42/sql2/sql2ctrlred sql2_redtpl handreach >> $L 2>&1
echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $L
