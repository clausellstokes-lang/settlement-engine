#!/bin/sh
cd /home/user/wt/sql
L=/home/user/wt/sql/docs/chair/2026-11-20/veil/out/v42/sql2/logs/1a-handreach-red.log
echo "start $(date -u +%FT%TZ) HEAD $(git rev-parse HEAD) 212 $(sha256sum supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16)" > $L
env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- npx vitest run tests/security/criminalSwitchHandReach.pglite.test.js --maxWorkers=1 >> $L 2>&1
echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $L
