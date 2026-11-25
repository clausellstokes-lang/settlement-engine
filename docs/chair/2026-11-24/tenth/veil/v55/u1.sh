#!/bin/sh
# VEIL-55: UNIT 1 (STORED-PROSE) RE-RUN ON THE MERGED TIP (dbd4cd9e5 = 8430edf5c + d7764e67a, 212 header (37)), a slice.
# RED: ppkey (VEIL-41's instrument, i41 ccc2e5473, unchanged) on the today-born stored 140 at the PRE-MERGE tip (8430edf5c, template
# v28tpl): publicProse served. GREEN: the same on the merged tip (template v55u1 = v27x211 + the merged 212). Then the unit's test
# files, the cures, tests/lint whole, tests/copy whole, from the merged worktree /home/user/wt/tipm (FIXED 03:4x: `mx` cds to the
# main checkout, so every vitest step now cds into $W INSIDE the mutex; the first files/lint run was in the wrong tree, killed). Log /var/tmp/v55/u1.log.
W=/home/user/wt/tipm; I=/home/user/wt/i41/docs/chair/2026-11-20/veil/out/v41/c2/ppkey.sh; O=/var/tmp/v55/out/u1; L=/var/tmp/v55/u1.log
ST=/var/tmp/v55/out/stored-today; mkdir -p $O
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%FT%TZ)" >> $L; }
step_tpl() { { dropdb --if-exists v55u1 && createdb -T v27x211 v55u1 && psql -X -q -v ON_ERROR_STOP=1 -d v55u1 -f $W/supabase/migrations/212_share_veil_later_cures.sql; } > $O/tpl.txt 2>&1; st tpl "$? $(sha256sum $W/supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16)"; }
step_red() { mx sh -c "cd /home/user/wt/r4ids && sh $I /home/user/wt/r4ids $ST $O/pp-red v28tpl pr" > $O/pp-red.txt 2>&1; st pp-red "$? $(tail -3 $O/pp-red.txt | tr '\n' ' ')"; }
step_grn() { mx sh -c "cd $W && sh $I $W $ST $O/pp-grn v55u1 pg" > $O/pp-grn.txt 2>&1; st pp-grn "$? $(tail -3 $O/pp-grn.txt | tr '\n' ' ')"; }
U1T="tests/components/defenseRingNoteProjection.test.jsx tests/components/publicProseEquality.test.jsx tests/domain/dossier/entityIndex.test.js tests/lint/rosterChoiceComposedHosts.walker.test.js tests/security/galleryVeilHandRows.pglite.test.js tests/security/galleryVeilSignalCopies.pglite.test.js tests/security/publicPayloadVeilTotality.test.js tests/security/rosterChoiceInversion.pglite.test.js tests/security/galleryVeilCures.pglite.test.js tests/security/tests/security/galleryVeilIds.pglite.test.js tests/security/criminalSwitchHandReach.pglite.test.js"
step_files() { (mx sh -c "cd $W && sh scripts/gate-tail.sh npx vitest run $U1T tests/ops/migrationRehearsal.test.js --maxWorkers=2" > $O/files.txt 2>&1); st files "$? $(grep -E 'Test Files|Tests ' $O/files.txt | tr '\n' ' ')"; }
step_lint() { (mx sh -c "cd $W && sh scripts/gate-tail.sh npx vitest run tests/lint --reporter=default --reporter=json --outputFile=$O/lint.json" > $O/lint.txt 2>&1); st lint "$? $(grep -E 'Test Files|Tests ' $O/lint.txt | tr '\n' ' ')"; }
step_copy() { (mx sh -c "cd $W && sh scripts/gate-tail.sh npx vitest run tests/copy" > $O/copy.txt 2>&1); st copy "$? $(grep -E 'Test Files|Tests ' $O/copy.txt | tr '\n' ' ')"; }
for s in ${*:-tpl red grn files lint copy}; do step_$s; done
echo "u1 END $(date -u +%FT%TZ)" >> $L
