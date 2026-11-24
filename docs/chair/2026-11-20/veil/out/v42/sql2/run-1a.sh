#!/bin/sh
# R4I-SQL-2 item 1 (a), RED FIRST: criminalSwitchHandReach.pglite.test.js at the red commit, read from a read-only snapshot
# (/var/tmp/sql2red = `git archive b5b6a5474`, code = 392aff978, node_modules linked to /home/user/wip's), so the worktree may
# be edited while the run waits on the mutex. Log in the worktree.
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
R=${SQL2_SRC:-/var/tmp/sql2red}; L=${SQL2_LOG:-/home/user/wt/sql/docs/chair/2026-11-20/veil/out/v42/sql2/logs/1a-handreach-red.log}
cd $R
echo "start $(date -u +%FT%TZ) src $R ($(cat $R/SNAPSHOT.txt 2>/dev/null || git -C $R rev-parse HEAD)) 212 $(sha256sum supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16)" > $L
$E GATE_MUTEX_MAX_POLLS=100000 sh /home/user/wt/sql/scripts/gate-mutex.sh --run -- npx vitest run tests/security/criminalSwitchHandReach.pglite.test.js --maxWorkers=1 >> $L 2>&1
echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $L
