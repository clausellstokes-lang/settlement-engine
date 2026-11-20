#!/bin/sh
# VEIL-29: the seat's re-run of R3-TELL-3's green at b3b533027, one heavy job at a time, each read by its own exit.
W=/home/user/wt/v29t3; O=/var/tmp/v18/out/v29/t3; cd $W; rm -f $O/green-done.txt
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js --maxWorkers=1 > $O/green-sv-handrows.txt 2>&1; echo "sv+handrows rc=$?" >> $O/green-done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js tests/security/criminalSwitchHandReach.pglite.test.js --maxWorkers=1 > $O/green-harnesses.txt 2>&1; echo "harnesses rc=$?" >> $O/green-done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/rosterChoicePools.walker.test.js --maxWorkers=1 > $O/green-walkers.txt 2>&1; echo "walkers rc=$?" >> $O/green-done.txt
$E node scripts/veil/rosterChoiceRegistry.mjs --check > $O/registry-check.txt 2>&1; echo "registry-check rc=$?" >> $O/green-done.txt
$E npx eslint src/domain/display/galleryRosterChoices.js src/domain/veil/rosterChoiceRegistry.js tests/security/galleryVeilTell3.pglite.test.js > $O/eslint.txt 2>&1; echo "eslint rc=$?" >> $O/green-done.txt
PGHOST=/var/tmp/rv7 PGUSER=postgres sh $W/docs/chair/2026-11-20/veil/out/v25/r3c5/measure/gate.sh $W $O/r3gate t29tpl 2 > $O/r3gate-run.txt 2>&1; echo "r3gate rc=$?" >> $O/green-done.txt
$E R3_MEASURES=$O/born-green-measures.txt sh scripts/gate-tail.sh npx vitest run tests/security/galleryRosterChoices.pglite.test.js --maxWorkers=1 > $O/born-green.txt 2>&1; echo "born rc=$?" >> $O/green-done.txt
(cd /var/tmp/v18 && $E PGHOST=/var/tmp/rv7 PGUSER=postgres RV6_PGMOD=/var/tmp/v18/pgmod sh /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all-v27.sh $W $O/accept > $O/acceptance.txt 2>&1); echo "acceptance rc=$?" >> $O/green-done.txt
echo "END $(date -u +%H:%M:%S)" >> $O/green-done.txt
