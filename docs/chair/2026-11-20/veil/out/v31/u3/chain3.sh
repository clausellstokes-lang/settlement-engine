#!/bin/sh
# VEIL-31: unit (iii)'s re-runs by the seat (chain2 re-pointed): the red, the greens, the typecheck, eslint, both gates on the seat's pool, at the builder's tip.
C=/home/user/settlement-engine; W=/home/user/wt/r3tell5b; O=/var/tmp/v18/out/v31/u3; MS=docs/chair/2026-11-20/veil/out/v27/tell2/measure
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
: > $O/done.txt; echo "start $(date -u +%H:%M:%S) tip $(git -C $W rev-parse --short HEAD)" >> $O/done.txt
R=/home/user/wt/v31u3red; [ -d $R ] || git -C $C worktree add --detach $R 090a2e905 > /dev/null 2>&1; [ -d $R/node_modules ] || cp -al $C/node_modules $R/node_modules
(cd $R && $E sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilTell5.pglite.test.js --maxWorkers=1 > $O/red-t5.txt 2>&1); echo "red-t5 at 090a2e905 rc=$? (expect 1)" >> $O/done.txt
(cd /home/user/wt/v31tip && true)
cd $W && $E node scripts/check-full-typecheck.mjs > $O/typecheck.txt 2>&1; echo "typecheck rc=$? $(tail -1 $O/typecheck.txt)" >> $O/done.txt
cd $W; $E npx eslint src/domain/display/galleryRosterChoices.js src/domain/veil/rosterChoiceRegistry.js tests/security/galleryVeilTell5.pglite.test.js > $O/eslint.txt 2>&1; echo "eslint rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/mutationCoverageManifest.test.js tests/lint/rosterChoicePools.walker.test.js > $O/green-walkers.txt 2>&1; echo "walkers+manifest at tip rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilTell3.pglite.test.js tests/security/galleryVeilTell4.pglite.test.js tests/security/galleryVeilTell5.pglite.test.js --maxWorkers=1 > $O/green-arms.txt 2>&1; echo "arms 3+4+5 at tip rc=$?" >> $O/done.txt
$E node scripts/veil/rosterChoiceRegistry.mjs --check > $O/registry-check.txt 2>&1; echo "registry-check rc=$?" >> $O/done.txt
sha256sum supabase/migrations/212_share_veil_later_cures.sql supabase/rollback/212_share_veil_later_cures.down.sql supabase/migrations/211_server_side_share_veil.sql supabase/rollback/211_server_side_share_veil.down.sql > $O/sha256.txt
dropdb --if-exists v31u3tpl && createdb -T v27x211 v31u3tpl && psql -q -v ON_ERROR_STOP=1 -d v31u3tpl -f supabase/migrations/212_share_veil_later_cures.sql > $O/tpl.txt 2>&1; echo "tpl rc=$?" >> $O/done.txt
sh $W/$MS/verify.sh $W $O/verify /var/tmp/v18/t2/pool-t2sig-2 40 > $O/verify.txt 2>&1; echo "verify rc=$? $(tail -1 $O/verify.txt)" >> $O/done.txt
TELL_DB=v31u3 sh $W/$MS/tell2.sh $W $O/gates v31u3tpl /var/tmp/v18/t2/pool-t2sig-2 > $O/gates.txt 2>&1; echo "gates rc=$? $(date -u +%H:%M:%S)" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js --maxWorkers=1 > $O/green-sv.txt 2>&1; echo "sv+handrows+born rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js tests/security/criminalSwitchHandReach.pglite.test.js --maxWorkers=1 > $O/green-harn.txt 2>&1; echo "harnesses rc=$?" >> $O/done.txt
echo "END $(date -u +%H:%M:%S)" >> $O/done.txt
