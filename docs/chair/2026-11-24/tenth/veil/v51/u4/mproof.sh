#!/bin/sh
# VEIL-51 unit 4: MERGE M's proof on slices (the plan, 77cb42fc1): each arm through the mutex, rc and tests to $O/mproof.log.
W=/home/user/wt/r5desc; O=/var/tmp/v51/out/m; mkdir -p $O; cd $W
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY"
for f in tests/security/galleryWithholdAlways.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js tests/security/galleryVeilDesc.pglite.test.js; do
  n=$(basename $f .test.js)
  $E GATE_MUTEX_MAX_POLLS=1000000 sh scripts/gate-mutex.sh --run -- npx vitest run $f > $O/$n.log 2>&1; r=$?
  echo "$n rc=$r $(grep -o 'Tests  [^(]*([0-9]*)' $O/$n.log | tail -1) $(date -u +%H:%M:%S)" >> $O/mproof.log
done
$E sh scripts/gate-tail.sh npm run typecheck:domain:strict > $O/strict.log 2>&1; echo "domain-strict rc=$? $(date -u +%H:%M:%S)" >> $O/mproof.log
echo "TS2345 at pageRederive.js in the strict log: $(grep -c "pageRederive.js" $O/strict.log) line(s) $(date -u +%H:%M:%S)" >> $O/mproof.log
echo "mproof END $(date -u +%H:%M:%S)" >> $O/mproof.log
