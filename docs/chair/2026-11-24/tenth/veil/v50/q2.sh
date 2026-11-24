#!/bin/sh
# VEIL-50 unit (1)(c): THE TRIAL JOIN'S REDS NOW, on /home/user/wt/join (local only, pushed nowhere: 9e6547f0f + the line f03e9a868 +
# the tip b58abc48b; no conflict). VEIL-43's chain1 form (b126c9813 out/v43/chain1.sh), re-pointed; failing tests classed by its
# fails.mjs against RED-AT-LINE.tsv at the chair's branch (point 113). Run: sh scripts/gate-mutex.sh --run -- sh <this> (from the
# documents checkout). Each step's rc and hour to /var/tmp/v50/out/q2/done.txt.
W=/home/user/wt/join; F=/home/user/wt/i43/docs/chair/2026-11-20/veil/out/v43/fails.mjs; R=/var/tmp/v50/RED-AT-LINE.tsv
O=/var/tmp/v50/out/q2; L=$O/done.txt
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mkdir -p $O; cd $W; echo "start $(date -u +%H:%M:%S) at $(git rev-parse --short HEAD)" > $L
$E npm run -s typecheck:domain:strict > $O/strict.txt 2>&1; echo "strict rc=$? $(date -u +%H:%M:%S)" >> $L
$E sh scripts/gate-tail.sh npx vitest run tests/generators/fortuneLawMerits.test.js tests/domain/fortuneLastingSentence.test.js tests/domain/display/tensionCause.test.js tests/security/traditionDescriptionSharedPage.test.js tests/lint/recentConflictReaders.walker.test.js tests/domain/display/criminalVeilSwitch.test.js --reporter=default --reporter=json --outputFile=$O/five.json > $O/five.txt 2>&1; echo "five rc=$? $(date -u +%H:%M:%S)" >> $L
git grep -l -E "galleryPayloadFor|applyVeil|projectShareVeil|get_gallery_dossier|get_unlisted_dossier" -- tests ':!tests/security' > $O/named-files.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint --reporter=default --reporter=json --outputFile=$O/lint.json > $O/lint.txt 2>&1; echo "lint rc=$? $(date -u +%H:%M:%S)" >> $L
$E sh scripts/gate-tail.sh npx vitest run $(cat $O/named-files.txt) --reporter=default --reporter=json --outputFile=$O/named.json > $O/named.txt 2>&1; echo "named rc=$? $(date -u +%H:%M:%S)" >> $L
$E sh scripts/gate-tail.sh npx vitest run tests/security --maxWorkers=2 --reporter=default --reporter=json --outputFile=$O/security.json > $O/security.txt 2>&1; echo "security rc=$? $(date -u +%H:%M:%S)" >> $L
for s in five lint named security; do [ -f $O/$s.json ] && node $F $O/$s.json $R > $O/$s-fails.txt 2>&1; done
echo "END $(date -u +%H:%M:%S)" >> $L
