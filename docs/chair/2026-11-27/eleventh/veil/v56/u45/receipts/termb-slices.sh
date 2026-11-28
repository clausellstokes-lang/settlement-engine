#!/bin/sh
# U45B term (b): the files that name what it changed, on the clean tree /home/user/wt/u45c (e9933b8a5 + term (b))
O=/var/tmp/u45b/termb; mkdir -p $O; cd /home/user/wt/u45c
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
for f in tests/security/galleryRosterChoices.pglite.test.js tests/security/galleryVeilDescNames.pglite.test.js tests/security/galleryWithholdAlways.pglite.test.js tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilCures.pglite.test.js tests/ops/migrationRehearsal.test.js "tests/lint/veilDoorsPassStored.walker.test.js tests/lint/standingReaders.walker.test.js tests/lint/rosterChoiceRegistry.walker.test.js tests/lint/rosterChoiceComposedHosts.walker.test.js tests/lint/veilTypeofGuard.walker.test.js"; do
  n=$(basename $(echo $f | cut -d' ' -f1) .test.js)
  $E GATE_MUTEX_MAX_POLLS=1000000 sh scripts/gate-mutex.sh --run -- npx vitest run $f > $O/$n.log 2>&1; echo "$n rc=$? $(date -u +%T)" >> $O/exits.txt
done
echo "END $(date -u +%T)" >> $O/exits.txt
