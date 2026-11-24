#!/bin/sh
# VEIL-52 unit (2): MAPCOVERT-GREEN-SQL's proofs, the brief's (a)-(e) (MCSQL-HANDBACK at d56bc1ab6), on
# lane/veil-52-2026-11-24-mcsql-wip (/home/user/wt/mcsql: db9fddc7d, VEIL-44's door tip, + d56bc1ab6 merged clean as 75a410f1b;
# 212 sha256 c6679978..., rollback 62a7e609..., as the hand-back records). One mutex hold per step; rc and hour to
# /var/tmp/v52/log/q52b.log.   Usage: sh q52b.sh [step ...]
W=/home/user/wt/mcsql; O=/var/tmp/v52/out/mcsql; L=/var/tmp/v52/log/q52b.log; mkdir -p $O
UM=/home/user/wt/i44/docs/chair/2026-11-20/veil/out/v44/mapcovert/um.sh; ST=/var/tmp/v52/out
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S) $(git -C $W rev-parse --short HEAD)" >> $L; }
vt() { mx sh -c "cd $W && $E sh scripts/gate-tail.sh npx vitest run $*"; }
step_a() { vt tests/security/galleryMapCovert.pglite.test.js > $O/a.txt 2>&1; st a $?; }
step_b() { vt tests/security/galleryMapMemberCount.pglite.test.js tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySanitizer.pglite.test.js tests/security/galleryVeilCures.pglite.test.js > $O/b.txt 2>&1; st b $?; }
step_c() { mx sh -c "cd $W && $E node scripts/veil/rosterChoiceRegistry.mjs --check && $E sh scripts/gate-tail.sh npx vitest run tests/lint/rosterChoiceRegistry.walker.test.js" > $O/c.txt 2>&1; st c $?; }
step_tpl() { (export PGHOST=/var/tmp/rv7 PGUSER=postgres; dropdb --if-exists v52mcsqltpl && createdb -T v27x211 v52mcsqltpl && psql -q -v ON_ERROR_STOP=1 -d v52mcsqltpl -f $W/supabase/migrations/212_share_veil_later_cures.sql) > $O/tpl.txt 2>&1; st tpl $?; }
step_etip() { mx sh -c "UM_U=1 UM_ASSERT=map sh $UM $W $O/um-tip v52mcsqltpl stored $ST/stored-today" > $O/um-tip.txt 2>&1; st etip $?; }
step_ejoin() { mx sh -c "UM_U=1 UM_ASSERT=map sh $UM $W $O/um-join v52mcsqltpl stored $ST/stored-join" > $O/um-join.txt 2>&1; st ejoin $?; }
step_emaster() { mx sh -c "UM_U=1 UM_ASSERT=map sh $UM $W $O/um-master v52mcsqltpl stored $ST/stored-master" > $O/um-master.txt 2>&1; st emaster $?; }
step_d() { mx sh -c "cd $W && $E sh scripts/gate-tail.sh npx vitest run tests/lint" > $O/d.txt 2>&1; st d $?; }
for s in ${*:-a b c tpl etip ejoin emaster d}; do step_$s; done
echo "q52b END $(date -u +%H:%M:%S)" >> $L
