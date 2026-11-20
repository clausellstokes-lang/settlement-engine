#!/bin/sh
# R3-TELL-3 unit 5: the green suites, in order, one at a time (sh green.sh <worktree> <outdir>). Every vitest run --maxWorkers=1,
# GIT_* unset, read through scripts/gate-tail.sh; the R3 gate (databases t3_g*, template t3_tpl); the acceptance run last.
W=$1; O=$2; cd $W; E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js --maxWorkers=1 > $O/green-sv-handrows.txt 2>&1; echo "sv+handrows rc=$?" >> $O/green-done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js --maxWorkers=1 > $O/green-harnesses.txt 2>&1; echo "harnesses rc=$?" >> $O/green-done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/rosterChoicePools.walker.test.js --maxWorkers=1 > $O/green-walkers.txt 2>&1; echo "walkers rc=$?" >> $O/green-done.txt
$E node scripts/veil/rosterChoiceRegistry.mjs --check > $O/registry-check.txt 2>&1; echo "registry-check rc=$?" >> $O/green-done.txt
$E sh $O/measure/r3gate.sh $W $O/r3gate t3_tpl > $O/r3gate-run.txt 2>&1; echo "r3gate rc=$?" >> $O/green-done.txt
$E R3_MEASURES=$O/born-green-measures.txt sh scripts/gate-tail.sh npx vitest run tests/security/galleryRosterChoices.pglite.test.js --maxWorkers=1 > $O/born-green.txt 2>&1; echo "born rc=$?" >> $O/green-done.txt
$E RV6_PGMOD=/var/tmp/v18/pgmod sh /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all-v27.sh $W /var/tmp/v18/out/v28/t3acc > $O/acceptance.txt 2>&1; echo "acceptance rc=$?" >> $O/green-done.txt
echo END >> $O/green-done.txt
