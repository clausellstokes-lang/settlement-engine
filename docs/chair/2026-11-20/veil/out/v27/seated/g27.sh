#!/bin/sh
# VEIL-27: R3C5's guards.sh pointed at a worktree; outputs under /var/tmp/v18/out/v27/<tag>/   sh g27.sh <worktree> <tag> <batch...>
W=$1; T=$2; shift 2; cd $W; O=/var/tmp/v18/out/v27/$T; mkdir -p $O
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
run() { name=$1; shift; $E sh scripts/gate-tail.sh -n 60 npx vitest run --maxWorkers=1 "$@" > $O/$name.txt 2>&1; rc=$?; L=$(grep -o '[^ ]*gate-tail[.][0-9]*[.]log' $O/$name.txt | head -1); grep -E '^\s+(×)|^ FAIL|Tests |Test Files |AssertionError' $L | head -40 > $O/$name.summary.txt; echo "$name exit $rc" >> $O/guards-exits.txt; }
for b in "$@"; do case $b in
  born) R3_MEASURES=$O/born-measures.txt run born tests/security/galleryRosterChoices.pglite.test.js;;
  sv) run serverveil-handrows tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js;;
  s1) run guards-security-1 tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryVeilCures.pglite.test.js;;
  s2) run guards-security-2 tests/security/gallerySanitizer.pglite.test.js tests/security/galleryMapMemberCount.pglite.test.js tests/security/galleryVeilSignalCopies.pglite.test.js tests/security/galleryWithholdAlways.pglite.test.js;;
  harn) run guards-harnesses tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js tests/security/criminalSwitchHandReach.pglite.test.js;;
  twin) run guards-twin tests/lint/veilCopySites.walker.test.js tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/rosterChoicePools.walker.test.js tests/lint/mutationCoverageManifest.test.js tests/lint/observedShapeReaders.walker.test.js tests/domain/display/criminalVeilSwitch.test.js tests/components/curateModeCriminalSwitch.test.jsx tests/security/publicPayloadVeilTotality.test.js tests/domain/display/publicSafe.test.js tests/domain/display/publicSafeVeil.test.js tests/components/publicProseVeilInvariance.test.js tests/components/publicProseVeilOnce.test.js tests/lib/gallery.test.js tests/lib/partyLinkClient.test.js tests/store/galleryImportRederive.test.js tests/store/galleryImportServedBand.test.js;;
  known) run known-reds tests/components/phoneChromeFloor.census.test.js tests/lint/presumedThings.walker.test.js tests/lint/presumptionClasses.walker.test.js tests/lint/writerReach.walker.test.js;;
esac; done
echo "batch done: $*" >> $O/guards-exits.txt
