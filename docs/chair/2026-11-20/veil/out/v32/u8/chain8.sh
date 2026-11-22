#!/bin/sh
# VEIL-32: unit (viii)'s re-runs by the seat at the builder's tip (W), the reds at bb8de9df3 (the last red before the cure),
# the arm, the build, the NEW pool on the cured tree (ruling 88: re-read from the old pool's births), both gates, tests/lint whole.
C=/home/user/settlement-engine; W=/home/user/wt/r3tell8b; O=/var/tmp/v18/out/v32/u8; MS=docs/chair/2026-11-20/veil/out/v27/tell2/measure; AM=docs/chair/2026-11-20/veil/out/v32/tell8b/measure
NP=/var/tmp/v18/t2/pool-t2sig-3
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
: > $O/done.txt; echo "start $(date -u +%H:%M:%S) tip $(git -C $W rev-parse --short HEAD)" >> $O/done.txt
R=/home/user/wt/v32u8red; [ -d $R ] || git -C $C worktree add --detach $R bb8de9df3 > /dev/null 2>&1; [ -d $R/node_modules ] || cp -al $C/node_modules $R/node_modules
echo "red walker at bb8de9df3 rc=1 (expect 1) [first launch 10:16, kept]" >> $O/done.txt
(cd $R && $E sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilTell8.pglite.test.js --maxWorkers=1 > $O/red-tell8.txt 2>&1); echo "red tell8 at bb8de9df3 rc=$? (expect 1: half 1/2/hook and the evidence)" >> $O/done.txt
cd $W
sha256sum supabase/migrations/212_share_veil_later_cures.sql supabase/rollback/212_share_veil_later_cures.down.sql supabase/migrations/211_server_side_share_veil.sql supabase/rollback/211_server_side_share_veil.down.sql > $O/sha256.txt
$E node scripts/check-full-typecheck.mjs > $O/typecheck.txt 2>&1; echo "typecheck rc=$? $(tail -1 $O/typecheck.txt)" >> $O/done.txt
$E npx eslint src/domain/display/galleryRosterChoices.js src/domain/display/galleryVeil.js src/domain/display/galleryWithholdAlways.js src/domain/veil/importRederive.js src/domain/veil/pageRederive.js src/domain/veil/rosterChoiceRegistry.js tests/lint/crimeTypesReaders.walker.test.js tests/security/galleryVeilTell8.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js tests/security/galleryVeilSignalCopies.pglite.test.js > $O/eslint.txt 2>&1; echo "eslint rc=$?" >> $O/done.txt
$E node scripts/veil/rosterChoiceRegistry.mjs --check > $O/registry-check.txt 2>&1; echo "registry-check rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint/crimeTypesReaders.walker.test.js tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/rosterChoicePools.walker.test.js tests/lint/mutationCoverageManifest.test.js > $O/green-walkers.txt 2>&1; echo "walkers+manifest rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilTell8.pglite.test.js tests/security/galleryVeilTell3.pglite.test.js tests/security/galleryVeilTell4.pglite.test.js tests/security/galleryVeilTell5.pglite.test.js --maxWorkers=1 > $O/green-arms.txt 2>&1; echo "arms 3+4+5+8 rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js tests/security/galleryVeilCures.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js --maxWorkers=1 > $O/green-sv.txt 2>&1; echo "sv+handrows+born+cures+secondhomes rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js tests/security/criminalSwitchHandReach.pglite.test.js tests/security/galleryVeilSignalCopies.pglite.test.js --maxWorkers=1 > $O/green-harn.txt 2>&1; echo "harnesses+signalCopies rc=$? (signalCopies city-2 pre-existing: read by name)" >> $O/done.txt
dropdb --if-exists v32ctpl && createdb -T v27x211 v32ctpl && psql -q -v ON_ERROR_STOP=1 -d v32ctpl -f supabase/migrations/212_share_veil_later_cures.sql > $O/tpl.txt 2>&1; echo "tpl rc=$?" >> $O/done.txt
TELL_DB=v32a sh $W/$AM/arm.sh $W $O/arm v32ctpl > $O/arm.txt 2>&1; echo "arm rc=$? $(tail -2 $O/arm.txt | tr '\n' ' ')" >> $O/done.txt
$E npm run build > $O/build.txt 2>&1; echo "build rc=$?" >> $O/done.txt
$E VERIFY_DIST=1 sh scripts/gate-tail.sh npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js > $O/verify-dist.txt 2>&1; echo "verify-dist rc=$? (5 pre-existing at the tip per the builder: read by name)" >> $O/done.txt
sh $W/$MS/pool.sh $W $NP v32ctpl /var/tmp/v18/t2/pool-t2sig-2 > $O/pool.txt 2>&1; echo "new pool rc=$? $(date -u +%H:%M:%S)" >> $O/done.txt
sh $W/$MS/verify.sh $W $O/verify $NP 40 > $O/verify.txt 2>&1; echo "verify rc=$? $(tail -1 $O/verify.txt)" >> $O/done.txt
TELL_DB=v32g sh $W/$MS/tell2.sh $W $O/gates v32ctpl $NP > $O/gates.txt 2>&1; echo "gates rc=$? $(date -u +%H:%M:%S)" >> $O/done.txt
sh $C/docs/chair/2026-11-20/veil/out/v25/r3c5/measure/gate.sh $W $O/r3gate v32ctpl 2 > $O/r3gate-run.txt 2>&1; echo "r3gate rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint > $O/lint-whole.txt 2>&1; echo "lint-whole rc=$? $(date -u +%H:%M:%S)" >> $O/done.txt
echo "END $(date -u +%H:%M:%S)" >> $O/done.txt
