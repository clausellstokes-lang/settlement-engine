#!/bin/sh
# R3-CURE units 6 and 7: the guard batches, one at a time, --maxWorkers=1, at most four pglite files a run; each exit read by gate-tail
cd /home/user/wt/r3c; O=docs/chair/2026-11-20/veil/out/v23/r3c
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX"
run() { name=$1; shift; $E sh scripts/gate-tail.sh -n 60 npx vitest run --maxWorkers=1 "$@" > $O/$name.txt 2>&1; rc=$?; L=$(grep -o '/tmp/gate-tail[^ ]*log' $O/$name.txt | head -1); grep -E '^\s+(×)|^ FAIL|Tests |Test Files ' $L > $O/$name.summary.txt; echo "$name exit $rc" >> $O/guards-exits.txt; }
rm -f $O/guards-exits.txt
run guards-security-1 tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryVeilCures.pglite.test.js tests/security/galleryServerVeil.pglite.test.js
run guards-security-2 tests/security/gallerySanitizer.pglite.test.js tests/security/galleryMapMemberCount.pglite.test.js tests/security/galleryVeilSignalCopies.pglite.test.js tests/security/galleryWithholdAlways.pglite.test.js
run guards-harnesses tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js tests/security/criminalSwitchHandReach.pglite.test.js tests/security/allegianceVeil.pglite.test.js
R3_MEASURES=$PWD/$O/born-green2-measures.txt run born-green2 tests/security/galleryRosterChoices.pglite.test.js
run guards-twin tests/lint/veilCopySites.walker.test.js tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/rosterChoicePools.walker.test.js tests/lint/mutationCoverageManifest.test.js tests/lint/observedShapeReaders.walker.test.js tests/domain/display/criminalVeilSwitch.test.js tests/components/curateModeCriminalSwitch.test.jsx tests/security/publicPayloadVeilTotality.test.js tests/domain/display/publicSafe.test.js tests/domain/display/publicSafeVeil.test.js tests/components/publicProseVeilInvariance.test.js tests/components/publicProseVeilOnce.test.js tests/lib/gallery.test.js tests/lib/partyLinkClient.test.js tests/store/galleryImportRederive.test.js tests/store/galleryImportServedBand.test.js
echo done >> $O/guards-exits.txt
