#!/bin/sh
# V33-JOINPROBE step 4: out/v32/chain1.sh's lines from typecheck to the acceptance run, RE-POINTED at the join probe's tree
# (M = the worktree, O = <out>/chain, template jp1tpl, TELL_DB=jp1m, the pool pool-jp1), then not tests/lint whole but the
# join's (the tests/lint test files the merge changes against the lane side ed027fca7), plus the line's
# tests/domain/display/troubleHooksShared.test.js and tests/lint/samenessHideable.walker.test.js.
M=/home/user/wt/jp; O=$M/docs/chair/2026-11-20/veil/out/v33/joinprobe/chain; MS=docs/chair/2026-11-20/veil/out/v27/tell2/measure; POOL=/var/tmp/v18/t2/pool-jp1
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mkdir -p $O; : > $O/done.txt; echo "start $(date -u +%H:%M:%S) tip $(git -C $M rev-parse --short HEAD)" >> $O/done.txt
cd $M
sha256sum supabase/migrations/212_share_veil_later_cures.sql supabase/rollback/212_share_veil_later_cures.down.sql supabase/migrations/211_server_side_share_veil.sql supabase/rollback/211_server_side_share_veil.down.sql > $O/sha256.txt
$E node scripts/check-full-typecheck.mjs > $O/typecheck.txt 2>&1; echo "typecheck rc=$? $(tail -1 $O/typecheck.txt)" >> $O/done.txt
$E npx eslint src/domain/display/galleryRosterChoices.js src/domain/veil/rosterChoiceRegistry.js tests/security/galleryVeilTell3.pglite.test.js tests/security/galleryVeilTell4.pglite.test.js tests/security/galleryVeilTell5.pglite.test.js > $O/eslint.txt 2>&1; echo "eslint rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/mutationCoverageManifest.test.js tests/lint/rosterChoicePools.walker.test.js > $O/green-walkers.txt 2>&1; echo "walkers+manifest rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilTell3.pglite.test.js tests/security/galleryVeilTell4.pglite.test.js tests/security/galleryVeilTell5.pglite.test.js --maxWorkers=1 > $O/green-arms.txt 2>&1; echo "arms 3+4+5 rc=$?" >> $O/done.txt
$E node scripts/veil/rosterChoiceRegistry.mjs --check > $O/registry-check.txt 2>&1; echo "registry-check rc=$?" >> $O/done.txt
dropdb --if-exists jp1tpl && createdb -T v27x211 jp1tpl && psql -q -v ON_ERROR_STOP=1 -d jp1tpl -f supabase/migrations/212_share_veil_later_cures.sql > $O/tpl.txt 2>&1; echo "tpl rc=$?" >> $O/done.txt
sh $M/$MS/verify.sh $M $O/verify $POOL 40 > $O/verify.txt 2>&1; echo "verify rc=$? $(tail -1 $O/verify.txt)" >> $O/done.txt
TELL_DB=jp1m sh $M/$MS/tell2.sh $M $O/gates jp1tpl $POOL > $O/gates.txt 2>&1; echo "gates rc=$? $(date -u +%H:%M:%S)" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js --maxWorkers=1 > $O/green-sv.txt 2>&1; echo "sv+handrows+born rc=$?" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js tests/security/criminalSwitchHandReach.pglite.test.js --maxWorkers=1 > $O/green-harn.txt 2>&1; echo "harnesses rc=$?" >> $O/done.txt
sh $M/docs/chair/2026-11-20/veil/out/v25/r3c5/measure/gate.sh $M $O/r3gate jp1tpl 2 > $O/r3gate-run.txt 2>&1; echo "r3gate rc=$?" >> $O/done.txt
(cd /var/tmp/v18 && $E RV6_PGMOD=/var/tmp/v18/pgmod sh /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all-v27.sh $M $O/accept > $O/acceptance.txt 2>&1); echo "acceptance rc=$? $(grep -c '^PASS' $O/acceptance.txt) PASS" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/domain/display/troubleHooksShared.test.js tests/lint/samenessHideable.walker.test.js --maxWorkers=1 > $O/line-two.txt 2>&1; echo "troubleHooksShared+samenessHideable rc=$?" >> $O/done.txt
git -C $M diff --name-only ed027fca7 HEAD -- tests/lint | grep -E '\.test\.(js|jsx|mjs)$' > $O/join-lint-files.txt
$E sh scripts/gate-tail.sh npx vitest run $(cat $O/join-lint-files.txt) --maxWorkers=1 > $O/lint-join.txt 2>&1; rc=$?; echo "lint-join ($(wc -l < $O/join-lint-files.txt) files) rc=$rc $(date -u +%H:%M:%S)" >> $O/done.txt
echo "END $(date -u +%H:%M:%S)" >> $O/done.txt
