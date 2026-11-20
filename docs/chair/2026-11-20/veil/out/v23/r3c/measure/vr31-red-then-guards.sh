#!/bin/sh
cd /home/user/wt/r3c; O=docs/chair/2026-11-20/veil/out/v23/r3c; SP=/tmp/claude-0/-home-user-settlement-engine/b00cf7e9-d88f-51b6-9943-eec610cb9e70/scratchpad
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX"
cp $SP/212.nofix supabase/migrations/212_share_veil_later_cures.sql; cp $SP/twin.nofix src/domain/display/galleryRosterChoices.js
$E sh scripts/gate-tail.sh -n 40 npx vitest run --maxWorkers=1 tests/security/galleryRosterChoices.pglite.test.js -t "VR31 on EVERY read" > $O/lead2-vr31-red.txt 2>&1; echo "exit $?" >> $O/lead2-vr31-red.txt
cp $SP/212.fixed supabase/migrations/212_share_veil_later_cures.sql; cp $SP/twin.fixed src/domain/display/galleryRosterChoices.js
cmp $SP/212.fixed supabase/migrations/212_share_veil_later_cures.sql && cmp $SP/twin.fixed src/domain/display/galleryRosterChoices.js && echo restored >> $O/lead2-vr31-red.txt
sh $O/measure/guards.sh
