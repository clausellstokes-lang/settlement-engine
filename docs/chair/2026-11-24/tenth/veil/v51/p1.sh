#!/bin/sh
# VEIL-51 UNIT 1 "STORED-PROSE": THE PROOF'S OWED STEPS (VEIL-41's proof.sh at ccc2e5473, its steps re-run on the unit's tree).
# Run:  nohup sh p1.sh [step ...] &   (no step: all, in order). Each step its own mutex hold (gave-up exit 3 retried), its rc
# and time to $L. Every database LOCAL (PGHOST=/var/tmp/rv7). Outputs under /var/tmp/v51/out/p1/.
# THE INSTRUMENTS ARE RUN UNCHANGED FROM DETACHED WORKTREES OF THE BRANCHES THAT HOLD THEM:
#   meas (the whole-document form, N90): chain B's v42/meas/meas.sh at d71a3ee44 (/home/user/wt/i42), byte-equal to VEIL-41's
#     v41/meas copy (meas.sh, meas.probe.jsx, meas-an.mjs, personIdBijection.shared.mjs: git diff empty). Run from i42 because its
#     eval sets MEAS_BIJ_MOD to <the script's checkout>/tests/security/personIdBijection.shared.mjs, which exists only there.
#   dump: v33/legacy/dump.sh at d71a3ee44 (byte-equal to ccc2e5473's).
# set55: VEIL-41's /var/tmp/v18/out/v41/pins-set.txt died with its container; RE-DERIVED BY GREP on the unit's tree (N33's grep
#   outside tests/security, 34; tests/security naming publicProse, 16; the composed-hosts walker; the four publicProse* pins) = 55,
#   written to /var/tmp/v51/set55.txt and committed beside this script as set55.txt.
C=/home/user/wt/c2; T=/home/user/wt/tip; MS=/home/user/wt/master; I42=/home/user/wt/i42/docs/chair/2026-11-20/veil/out
O=/var/tmp/v51/out/p1; L=$O/p1.log; mkdir -p $O
export PGHOST=/var/tmp/rv7 PGUSER=postgres
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { while :; do $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"; r=$?; [ $r = 3 ] || return $r; echo "  gave up, again $(date -u +%H:%M:%S)" >> $L; done; }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
B=${P1_BASE:-23bb8b8ae}
step_tpl() { dropdb --if-exists v51_c2 && createdb -T v27x211 v51_c2 && psql -q -v ON_ERROR_STOP=1 -d v51_c2 -f $C/supabase/migrations/212_share_veil_later_cures.sql > $O/tpl.txt 2>&1; st tpl $?
  sha256sum $C/supabase/migrations/212_share_veil_later_cures.sql $C/supabase/rollback/212_share_veil_later_cures.down.sql > $O/shas.txt; }
step_dumps() { mkdir -p $O/emptypool; cd $T && mx sh -c "LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh $C $O/stored-today $O/emptypool && LP_A=0 LP_B=0 LP_TOWNS=1 sh $I42/v33/legacy/dump.sh $MS $O/stored-master $O/emptypool" > $O/dumps.txt 2>&1; st dumps $?; }
# why: VEIL-41's own form (its v41 copy of meas.sh, run from its documents checkout's commit ccc2e5473 = /home/user/wt/i41, with the
#   env proof.sh passed), ONE shard, the control set: reproduces "rc 2 in about two seconds" and keeps the shard's log.
step_why() { cd $C && mx sh -c "MEAS_SHARDS=1 MEAS_BIJ=0 MEAS_BIJ_MOD=/home/user/wt/i41/docs/chair/2026-11-20/veil/out/v41/meas/personIdBijection.shared.mjs MEAS_COMMON=/home/user/wt/i41/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs MEAS_C=1 sh /home/user/wt/i41/docs/chair/2026-11-20/veil/out/v41/meas/meas.sh $C $O/why v51_c2 handreach" > $O/why.txt 2>&1; st why $?; }
step_ctrl() { cd $C && mx sh -c "MEAS_BIJ=0 MEAS_C=1 sh $I42/v42/meas/meas.sh $C $O/ctrl v51_c2 handreach" > $O/ctrl.txt 2>&1; st meas-ctrl $?; }
step_t140() { cd $C && mx sh -c "MEAS_BIJ=0 MEAS_DOORS=gallery,link sh $I42/v42/meas/meas.sh $C $O/t140 v51_c2 towns" > $O/t140.txt 2>&1; st meas-t140 $?; }
step_st140() { cd $C && mx sh -c "MEAS_BIJ=0 sh $I42/v42/meas/meas.sh $C $O/st140 v51_c2 stored $O/stored-today" > $O/st140.txt 2>&1; st meas-stored-today $?; }
step_sm140() { cd $C && mx sh -c "MEAS_BIJ=0 sh $I42/v42/meas/meas.sh $C $O/sm140 v51_c2 stored $O/stored-master" > $O/sm140.txt 2>&1; st meas-stored-master $?; }
step_set55() { cd $C && mx npx vitest run $(cat /var/tmp/v51/set55.txt) > $O/set55.log 2>&1; st set55 $?; }
step_cures() { cd $C && mx npx vitest run tests/security/galleryVeilCures.pglite.test.js tests/ops/migrationRehearsal.test.js > $O/cures.log 2>&1; st rollback-and-catalogue $?; }
step_lint() { cd $C && mx npx vitest run tests/lint > $O/lint.log 2>&1; st lint $?; }
step_copy() { cd $C && mx npx vitest run tests/copy > $O/copy.log 2>&1; st copy $?; }
step_types() { cd $C && mx sh -c "node scripts/check-full-typecheck.mjs > $O/types.log 2>&1; echo types=\$? >> $O/types.log; npx eslint \$(git diff --name-only --diff-filter=d $B HEAD -- src tests | tr '\n' ' ') > $O/eslint.log 2>&1; echo eslint=\$? >> $O/eslint.log"; st types-eslint $?; }
step_build() { cd $C && mx sh -c "npm run build > $O/build.log 2>&1 && VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js > $O/dist.log 2>&1"; st build-dist $?; }
# tipbuild (added 23:22 UTC): the same build and dist pins on the lane's tip b58abc48b (/home/user/wt/tip), to attribute
#   the c2 tree's size reds: run as `sh p1.sh tipbuild`.
step_tipbuild() { cd $T && mx sh -c "npm run build > $O/tipbuild.log 2>&1 && VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js > $O/tipdist.log 2>&1"; st tip-build-dist $?; }
# lintcure (added 23:40 UTC, the chair's condition of 23:32): HandRows' stored income-mix words drawn from their source. RED at
#   ced3b1de7: /var/tmp/v51/out/lc/red.log (the walker alone, rc 1; regen.log names :1986). GREEN on the slice, then lint whole.
step_lintcure() { cd $C && mx sh -c "npx vitest run tests/lint/proseDrawnAnchors.walker.test.js > $O/../lc/green-walker.log 2>&1; echo rc=\$? >> $O/../lc/green-walker.log; npx vitest run tests/security/galleryVeilHandRows.pglite.test.js > $O/../lc/green-handrows.log 2>&1; echo rc=\$? >> $O/../lc/green-handrows.log; npx eslint tests/security/galleryVeilHandRows.pglite.test.js > $O/../lc/eslint.log 2>&1; echo rc=\$? >> $O/../lc/eslint.log; npx vitest run tests/lint > $O/../lc/lint.log 2>&1; echo rc=\$? >> $O/../lc/lint.log"; st lintcure $?; }
STEPS=${*:-"tpl dumps ctrl t140 st140 sm140 set55 cures lint copy types build"}
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) c2 at $(git -C $C rev-parse HEAD) steps: $STEPS" >> $L
for s in $STEPS; do step_$s; done
echo "END $(date -u +%H:%M:%S)" >> $L
