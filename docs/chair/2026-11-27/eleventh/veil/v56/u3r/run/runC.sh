#!/bin/sh
# U3R part C: round 2 (name/tier) red/green; the security files naming what changed, on the base and on the tip; rollback
# rehearsal; lint whole; typecheck. One mutex hold a line. rc and hour to /var/tmp/v56/runC.log.
set -u
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
H=/home/user/settlement-engine; T=/var/tmp/v56/tests; L=/var/tmp/v56/runC.log; N=/home/user/wt/u3rn; B=/home/user/wt/dsql
mx() { W=$1; shift; (cd $H && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh -c "cd $W && $E sh scripts/gate-tail.sh $*"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S) $3" >> $L; }
SEC="tests/security/galleryAlivenessTitleChain.pglite.test.js tests/security/galleryChronicleProjection.pglite.test.js tests/security/galleryMapMemberCount.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js tests/security/gallerySanitizer.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryServerVeil.pglite.test.js tests/security/galleryUnlisted.pglite.test.js tests/security/galleryVeilCures.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js tests/security/galleryVeilRecent.pglite.test.js tests/security/galleryVeilSignalCopies.pglite.test.js tests/security/galleryVeilTell3.pglite.test.js tests/security/galleryVeilTell4.pglite.test.js tests/security/galleryVeilTell5.pglite.test.js tests/security/galleryVeilTell8.pglite.test.js tests/security/galleryWithholdAlways.pglite.test.js tests/security/galleryWorldSnapshotScanner.pglite.test.js tests/security/savedMapsSnapshotTrigger.pglite.test.js tests/security/shareRenderTwice.pglite.test.jsx"
for s in ${*:-r2 g2 secT secB rb lint tc}; do case $s in
  r2) cp $N/tests/security/galleryCovertFrozen.pglite.test.js /home/user/wt/u3rc/tests/security/galleryCovertFrozen.pglite.test.js
      mx /home/user/wt/u3rc npx vitest run tests/security/galleryCovertFrozen.pglite.test.js > $T/r2.log 2>&1; st r2 $? 5ab9caeb7+nametest
      git -C /home/user/wt/u3rc checkout -q -- tests/security/galleryCovertFrozen.pglite.test.js;;
  g2) mx $N npx vitest run tests/security/galleryCovertFrozen.pglite.test.js tests/security/galleryMapCovert.pglite.test.js tests/security/galleryCovertUnread.pglite.test.js > $T/g2.log 2>&1; st g2 $? $(git -C $N rev-parse --short HEAD);;
  secT) mx $N npx vitest run $SEC > $T/secT.log 2>&1; st secT $? $(git -C $N rev-parse --short HEAD);;
  secB) mx $B npx vitest run $SEC > $T/secB.log 2>&1; st secB $? 2f849aa53;;
  rb) (export PGHOST=/var/tmp/rv7 PGUSER=postgres; Q="select p.oid::regprocedure::text||'|'||md5(pg_get_functiondef(p.oid))||'|'||p.provolatile||'|'||p.prosecdef||'|'||coalesce(p.proacl::text,'') from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prokind='f' order by 1"
        dropdb --if-exists u3r_rb; createdb -T v27x211 u3r_rb && psql -q -v ON_ERROR_STOP=1 -d u3r_rb -f $N/supabase/migrations/212_share_veil_later_cures.sql && psql -Atc "$Q" -d u3r_rb > $T/rb-up1.txt \
        && psql -q -v ON_ERROR_STOP=1 -d u3r_rb -f $N/supabase/rollback/212_share_veil_later_cures.down.sql && psql -Atc "$Q" -d u3r_rb > $T/rb-down.txt && psql -Atc "$Q" -d v27x211 > $T/rb-211.txt \
        && psql -q -v ON_ERROR_STOP=1 -d u3r_rb -f $N/supabase/migrations/212_share_veil_later_cures.sql && psql -Atc "$Q" -d u3r_rb > $T/rb-up2.txt \
        && cmp $T/rb-down.txt $T/rb-211.txt && cmp $T/rb-up1.txt $T/rb-up2.txt && echo "EQUAL down=211 $(wc -l < $T/rb-211.txt) functions; up1=up2 $(wc -l < $T/rb-up1.txt)") > $T/rb.log 2>&1; st rb $? $(git -C $N rev-parse --short HEAD); dropdb --if-exists -h /var/tmp/rv7 -U postgres u3r_rb;;
  lint) mx $N npx vitest run tests/lint > $T/lint.log 2>&1; st lint $? $(git -C $N rev-parse --short HEAD);;
  tc) mx $N npm run typecheck > $T/tc.log 2>&1; st tc $? $(git -C $N rev-parse --short HEAD);;
  ier) mx $N npx vitest run tests/security/galleryImportEqualsRead.pglite.test.js > $T/ier.log 2>&1; st ier $? $(git -C $N rev-parse --short HEAD);;
esac; done
echo "runC END $(date -u +%H:%M:%S)" >> $L
