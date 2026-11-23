#!/bin/sh
# VEIL-30: the seat's re-runs at the merge (ruling 73 (1); the chair's 22:19 order): R3-TELL-3's red (95f2ddfb8) and
# R3-TELL-4's red (fff96514a), both arms green at the merged tip; the tell's two gates at the merged tip (verify first);
# the restated analyzer over the lane tip's towns; then the green chain. One heavy job at a time, each read by its own exit.
M=/home/user/wt/v30m; O=/var/tmp/v18/out/v30/m; C=/home/user/settlement-engine; MS=docs/chair/2026-11-20/veil/out/v27/tell2/measure
mkdir -p $O; : > $O/done.txt
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
echo "start $(date -u +%H:%M:%S) merged $(git -C $M rev-parse --short HEAD)" >> $O/done.txt
for c in 95f2ddfb8:t3red fff96514a:t4red; do sha=${c%%:*}; n=${c##*:}; W=/home/user/wt/v30$n
  [ -d $W ] || git -C $C worktree add --detach $W $sha > /dev/null 2>&1; [ -d $W/node_modules ] || cp -al $C/node_modules $W/node_modules; done
[ -d $M/node_modules ] || cp -al $C/node_modules $M/node_modules
(cd /home/user/wt/v30t3red && $E R3_MEASURES=$O/red-t3-measures.txt sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilTell3.pglite.test.js --maxWorkers=1 > $O/red-t3.txt 2>&1); echo "red-t3 rc=$? (expect 1: units 2 and 4b)" >> $O/done.txt
(cd /home/user/wt/v30t4red && $E R3_MEASURES=$O/red-t4-measures.txt sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilTell4.pglite.test.js --maxWorkers=1 > $O/red-t4.txt 2>&1); echo "red-t4 rc=$? (expect 1)" >> $O/done.txt
(cd $M && $E R3_MEASURES=$O/green-arms-measures.txt sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilTell3.pglite.test.js tests/security/galleryVeilTell4.pglite.test.js --maxWorkers=1 > $O/green-arms.txt 2>&1); echo "green-arms rc=$?" >> $O/done.txt
dropdb --if-exists v30tpl && createdb -T v27x211 v30tpl && psql -q -v ON_ERROR_STOP=1 -d v30tpl -f $M/supabase/migrations/212_share_veil_later_cures.sql > $O/tpl.txt 2>&1; echo "tpl rc=$?" >> $O/done.txt
sh $M/$MS/verify.sh $M $O/verify /var/tmp/v18/t2/pool-t2sig-2 40 > $O/verify.txt 2>&1; echo "verify rc=$? $(tail -1 $O/verify.txt)" >> $O/done.txt
TELL_DB=v30m sh $M/$MS/tell2.sh $M $O/gates v30tpl /var/tmp/v18/t2/pool-t2sig-2 > $O/gates.txt 2>&1; echo "gates rc=$? $(date -u +%H:%M:%S)" >> $O/done.txt
node $M/$MS/tell2-an.mjs /var/tmp/v18/t2/pool-t2sig-2 /var/tmp/v18/out/v30/tip > $O/tip-restated-table.txt 2>&1; echo "tip-restated rc=$?" >> $O/done.txt
cd $M
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js --maxWorkers=1 > $O/green-sv-handrows.txt 2>&1; echo "sv+handrows rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js tests/security/criminalSwitchHandReach.pglite.test.js --maxWorkers=1 > $O/green-harnesses.txt 2>&1; echo "harnesses rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/rosterChoicePools.walker.test.js --maxWorkers=1 > $O/green-walkers.txt 2>&1; echo "walkers rc=$?" >> $O/done.txt
$E node scripts/veil/rosterChoiceRegistry.mjs --check > $O/registry-check.txt 2>&1; echo "registry-check rc=$?" >> $O/done.txt
$E npx eslint src/domain/display/galleryRosterChoices.js src/domain/veil/rosterChoiceRegistry.js tests/security/galleryVeilTell3.pglite.test.js tests/security/galleryVeilTell4.pglite.test.js > $O/eslint.txt 2>&1; echo "eslint rc=$?" >> $O/done.txt
sh $M/docs/chair/2026-11-20/veil/out/v25/r3c5/measure/gate.sh $M $O/r3gate v30tpl 2 > $O/r3gate-run.txt 2>&1; echo "r3gate rc=$?" >> $O/done.txt
$E R3_MEASURES=$O/born-green-measures.txt sh scripts/gate-tail.sh npx vitest run tests/security/galleryRosterChoices.pglite.test.js --maxWorkers=1 > $O/born-green.txt 2>&1; echo "born rc=$?" >> $O/done.txt
(cd /var/tmp/v18 && $E RV6_PGMOD=/var/tmp/v18/pgmod sh /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all-v27.sh $M $O/accept > $O/acceptance.txt 2>&1); echo "acceptance rc=$? $(grep -c '^PASS' $O/acceptance.txt) PASS" >> $O/done.txt
echo "END $(date -u +%H:%M:%S)" >> $O/done.txt
