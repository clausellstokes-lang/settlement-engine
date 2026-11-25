# N5 slices on the code tree (VEIL-51 unit 4): each through the mutex, one call, no retry; rc and counts to n5.log.
cd /home/user/wt/r5desc || exit 9
O=/var/tmp/v51/out/n5; L=$O/n5.log
echo "n5 start $(git log -1 --format=%h) $(date -u +%T)" >> $L
for f in tests/security/galleryVeilDescNames.pglite.test.js tests/security/galleryWithholdAlways.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js; do
  b=$(basename $f .test.js)
  env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE GATE_MUTEX_MAX_POLLS=1000000 sh scripts/gate-mutex.sh --run -- npx vitest run $f > $O/$b.log 2>&1; rc=$?
  echo "$b rc=$rc $(grep -E '^ +Tests ' $O/$b.log | tail -1 | tr -s ' ') $(date -u +%T)" >> $L
done
sh scripts/gate-tail.sh npm run typecheck:domain:strict > $O/strict.log 2>&1; echo "domain-strict rc=$? $(date -u +%T)" >> $L
echo "n5 END $(date -u +%T)" >> $L
