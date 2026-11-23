#!/bin/sh
# VEIL-41 THE ONE WHOLE PROOF of "STORED-PROSE" (C2-BUILD (a') + PINS + PIN-3 + R5-TENSION), on the merged c2 tree. Each step its own
# mutex hold (gave-up exit 3 retried), its rc and time to $L. Run:  nohup sh proof.sh [step ...] &   (no step: all, in order).
# Every database LOCAL (PGHOST=/var/tmp/rv7). Logs and outputs under /var/tmp/v18/out/v41/proof/.
R=/home/user/settlement-engine; V=$R/docs/chair/2026-11-20/veil/out; C=/home/user/wt/c2; T=/home/user/wt/tip; MS=/home/user/wt/master
O=/var/tmp/v18/out/v41/proof; L=$O/proof.log; S=/var/tmp/v18/stored/today/docs; mkdir -p $O
export PGHOST=/var/tmp/rv7 PGUSER=postgres
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { while :; do $E sh scripts/gate-mutex.sh --run -- "$@"; r=$?; [ $r = 3 ] || return $r; echo "  gave up, again $(date -u +%H:%M:%S)" >> $L; done; }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
MEASENV="MEAS_BIJ=0 MEAS_BIJ_MOD=$V/v41/meas/personIdBijection.shared.mjs MEAS_COMMON=$V/v27/tell/measure/tell-common.mjs"
step_tpl() { dropdb --if-exists v41_c2 && createdb -T v27x211 v41_c2 && psql -q -v ON_ERROR_STOP=1 -d v41_c2 -f $C/supabase/migrations/212_share_veil_later_cures.sql > $O/tpl.txt 2>&1; st tpl $?
  sha256sum $C/supabase/migrations/212_share_veil_later_cures.sql $C/supabase/rollback/212_share_veil_later_cures.down.sql > $O/shas.txt; }
step_ppkey() { cd $T && mx sh $V/v41/c2/ppkey.sh $C $S $O/ppkey v41_c2 pc > $O/ppkey.txt 2>&1; st ppkey $?; }
step_prose() { cd $T && mx sh $V/v33/stored/prose.sh $C $S $O/prose > $O/prose.txt 2>&1; st prose $?; }
step_dumps() { mkdir -p $O/emptypool; cd $T && mx sh -c "LP_A=0 LP_B=0 LP_TOWNS=1 sh $V/v33/legacy/dump.sh $C $O/stored-today $O/emptypool && LP_A=0 LP_B=0 LP_TOWNS=1 sh $V/v33/legacy/dump.sh $MS $O/stored-master $O/emptypool" > $O/dumps.txt 2>&1; st dumps $?; }
step_ctrl() { cd $C && mx sh -c "$MEASENV MEAS_C=1 sh /var/tmp/v18/out/v41/mi/x1/x2/x3/x4/x5/x6/x7/meas.sh $C $O/ctrl v41_c2 handreach" > $O/ctrl.txt 2>&1; st meas-ctrl $?; }
step_t140() { cd $C && mx sh -c "$MEASENV MEAS_DOORS=gallery,link sh /var/tmp/v18/out/v41/mi/x1/x2/x3/x4/x5/x6/x7/meas.sh $C $O/t140 v41_c2 towns" > $O/t140.txt 2>&1; st meas-t140 $?; }
step_st140() { cd $C && mx sh -c "$MEASENV sh /var/tmp/v18/out/v41/mi/x1/x2/x3/x4/x5/x6/x7/meas.sh $C $O/st140 v41_c2 stored $O/stored-today" > $O/st140.txt 2>&1; st meas-stored-today $?; }
step_sm140() { cd $C && mx sh -c "$MEASENV sh /var/tmp/v18/out/v41/mi/x1/x2/x3/x4/x5/x6/x7/meas.sh $C $O/sm140 v41_c2 stored $O/stored-master" > $O/sm140.txt 2>&1; st meas-stored-master $?; }
step_gatestip() { cd $T && mx sh $V/v33/legacy/stored.sh $T $S $O/read-tip v41_tip gt > $O/read-tip.txt 2>&1; st gates-tip $?; }
step_gatesc2() { cd $T && mx sh $V/v33/legacy/stored.sh $C $S $O/read-c2 v41_c2 gc > $O/read-c2.txt 2>&1; st gates-c2 $?; }
step_set55() { cd $C && mx npx vitest run $(cat /var/tmp/v18/out/v41/pins-set.txt) > $O/set55.log 2>&1; st set55 $?; }
step_cures() { cd $C && mx npx vitest run tests/security/galleryVeilCures.pglite.test.js tests/ops/migrationRehearsal.test.js > $O/cures.log 2>&1; st rollback-and-catalogue $?; }
step_lint() { cd $C && mx npx vitest run tests/lint > $O/lint.log 2>&1; st lint $?; }
step_copy() { cd $C && mx npx vitest run tests/copy > $O/copy.log 2>&1; st copy $?; }
step_types() { cd $C && mx sh -c "node scripts/check-full-typecheck.mjs > $O/types.log 2>&1; echo types=\$? >> $O/types.log; npx eslint \$(git diff --name-only 23bb8b8ae HEAD -- src tests | tr '\n' ' ') > $O/eslint.log 2>&1; echo eslint=\$? >> $O/eslint.log"; st types-eslint $?; }
step_build() { cd $C && mx sh -c "npm run build > $O/build.log 2>&1 && VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js > $O/dist.log 2>&1"; st build-dist $?; }
STEPS=${*:-"ctrl t140 st140 sm140"}
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) c2 at $(git -C $C rev-parse HEAD) steps: $STEPS" >> $L
for s in $STEPS; do step_$s; done
echo "END $(date -u +%H:%M:%S)" >> $L
