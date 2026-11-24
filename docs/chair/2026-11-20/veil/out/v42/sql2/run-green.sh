#!/bin/sh
# R4I-SQL-2 items 3 and 6, the heavy runs FROM THE WORKTREE (/home/user/wt/sql), each its own hold of the gate mutex, each to its
# own log in logs/, each log's last line "EXIT rc=<the run's own code>". `sh run-green.sh [step ...]` (default: every step).
#   3a  criminalSwitchHandReach.pglite.test.js (tooth (ii) green)
#   3b  the measure's C on the control towns (handreach), template v42sql2 = v27x211 + this tree's 212, re-made here
#   6a  tests/security: every file naming _gallery_veil_rekey, rekeyPeople, people.rekey or factions[].members, and every
#       reader of tests/security/personIdBijection.shared.mjs (changed by cause, (G))
#   6b  tests/lint WHOLE and tests/copy WHOLE (the ledger ref fetched first)
#   6c  the typecheck ratchet (ceiling 167)
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
W=/home/user/wt/sql; D=$W/docs/chair/2026-11-20/veil/out/v42/sql2; L=$D/logs; MX="$E GATE_MUTEX_MAX_POLLS=100000 sh $W/scripts/gate-mutex.sh --run --"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
cd $W
hd() { echo "start $(date -u +%FT%TZ) tree $(git rev-parse HEAD) 212 $(sha256sum supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16) twin $(sha256sum src/domain/display/galleryVeilPeople.js | cut -c1-16) dirty $(git status --porcelain --untracked-files=no | wc -l)"; }
s_3a() { f=$L/3a-handreach-green.log; hd > $f; $MX npx vitest run tests/security/criminalSwitchHandReach.pglite.test.js --maxWorkers=1 >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_3b() { f=$L/3b-ctrl-green.log; hd > $f
  { dropdb --if-exists v42sql2 && createdb -T v27x211 v42sql2 && psql -X -q -v ON_ERROR_STOP=1 -d v42sql2 -f supabase/migrations/212_share_veil_later_cures.sql; echo "v42sql2 rc=$?"; } >> $f 2>&1
  $MX env MEAS_C=1 sh $D/meas.sh $W /var/tmp/v18/out/v42/sql2/sql2ctrlgreen v42sql2 handreach >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
SEC="tests/security/criminalSwitchSalt.test.js tests/security/factionMemberPublicParity.pglite.test.js tests/security/gallerySanitizer.pglite.test.js tests/security/galleryVeilCures.pglite.test.js tests/security/galleryVeilIds.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js tests/security/galleryWithholdAlways.pglite.test.js"
s_6a() { f=$L/6a-security.log; hd > $f; $MX npx vitest run $SEC --maxWorkers=1 >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_6b() { f=$L/6b-lint-copy.log; hd > $f; $E git fetch -q origin review-fixes-2026-07-08 >> $f 2>&1; echo "ledger fetch rc=$? $(git rev-parse origin/review-fixes-2026-07-08)" >> $f
  $MX npx vitest run tests/lint tests/copy --maxWorkers=1 >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_6c() { f=$L/6c-typecheck.log; hd > $f; $MX npm run typecheck:ratchet >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
for n in ${@:-3a 3b 6a 6b 6c}; do s_$n; done
