#!/bin/sh
# R4I-SQL-2's SECOND CURE (ADDENDUM 2, the chair's N106): its red and green runs. `sh run-n106.sh <step ...>`, each heavy step its
# own hold of the gate mutex, each to logs/n106-<step>.log ending "EXIT rc=<the run's own code>".
#   red-m  the measure (copied verbatim) on the master-born stored set, the gallery door, from the SNAPSHOT /var/tmp/sql2c1
#          (= `git archive 84f2e2bba`: the GAP's cure, before the two lines), template sql2_c1tpl (v27x211 + that 212)
#   red-b  the plant (b-plant.mjs) against sql2_c1tpl (light)
#   grn-m  the same measure from THE WORKTREE, template v42sql2b (v27x211 + this tree's 212, re-made here)
#   grn-c  the control towns (handreach, every door, MEAS_C=1) from the worktree, template v42sql2b
#   grn-b  the plant against v42sql2b (light)
#   sec    tests/security: the roster-choice readers and handreach; lint: tests/lint + tests/copy WHOLE; tc: the typecheck ratchet
#   after-red  wait for red-m's EXIT line (red first, in time)
#   c      c-today.mjs, four shards: the gate's 140 today-born, every read hashed modulo its bijection, sql2_c1tpl against v42sql2b
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
W=/home/user/wt/sql; S1=/var/tmp/sql2c1; P=docs/chair/2026-11-20/veil/out/v42/sql2; L=$W/$P/logs; O=/var/tmp/v18/out/v42/sql2
MX="$E GATE_MUTEX_MAX_POLLS=100000 sh $W/scripts/gate-mutex.sh --run --"; SM=/var/tmp/v18/out/v42/stored-master; ST=/var/tmp/v18/out/v42/stored-today
export PGHOST=/var/tmp/rv7 PGUSER=postgres
hd() { echo "start $(date -u +%FT%TZ) src $1 ($(cat $1/SNAPSHOT.txt 2>/dev/null || git -C $1 rev-parse HEAD)) 212 $(sha256sum $1/supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16)"; }
tplb() { dropdb --if-exists v42sql2b && createdb -T v27x211 v42sql2b && psql -X -q -v ON_ERROR_STOP=1 -d v42sql2b -f $W/supabase/migrations/212_share_veil_later_cures.sql; echo "v42sql2b rc=$?"; }
s_red_m() { f=$L/n106-red-m.log; hd $S1 > $f; cd $S1; $MX env MEAS_DOORS=gallery sh $S1/$P/meas.sh $S1 $O/sql2m140red sql2_c1tpl stored $SM >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_red_b() { f=$L/n106-red-b.log; hd $S1 > $f; cd $S1; $E node $P/b-plant.mjs sql2_c1tpl >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_grn_m() { f=$L/n106-grn-m.log; hd $W > $f; cd $W; tplb >> $f 2>&1; $MX env MEAS_DOORS=gallery sh $W/$P/meas.sh $W $O/sql2m140grn v42sql2b stored $SM >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_grn_c() { f=$L/n106-grn-c.log; hd $W > $f; cd $W; tplb >> $f 2>&1; $MX env MEAS_C=1 sh $W/$P/meas.sh $W $O/sql2ctrln106 v42sql2b handreach >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_grn_b() { f=$L/n106-grn-b.log; hd $W > $f; cd $W; tplb >> $f 2>&1; $E node $P/b-plant.mjs v42sql2b >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_c() { f=$L/n106-c.log; hd $W > $f; cd $W; tplb >> $f 2>&1
  $MX sh -c "for s in 0 1 2 3; do $E node $P/c-today.mjs sql2_c1tpl v42sql2b $ST \$s/4 $O/c-today-\$s.json & done; wait" >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
SECN="tests/security/criminalSwitchHandReach.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js"
s_sec() { f=$L/n106-sec.log; hd $W > $f; cd $W; $MX npx vitest run $SECN --maxWorkers=1 >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_lint() { f=$L/n106-lint-copy.log; hd $W > $f; cd $W; $E git fetch -q origin review-fixes-2026-07-08 >> $f 2>&1; echo "ledger fetch rc=$? $(git rev-parse origin/review-fixes-2026-07-08)" >> $f
  $MX npx vitest run tests/lint tests/copy --maxWorkers=1 >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_tc() { f=$L/n106-typecheck.log; hd $W > $f; cd $W; $MX npm run typecheck:ratchet >> $f 2>&1; echo "EXIT rc=$? $(date -u +%FT%TZ)" >> $f; }
s_after_red() { until grep -q '^EXIT' $L/n106-red-m.log 2>/dev/null; do sleep 30; done; }
for n in "$@"; do s_$(echo $n | tr - _); done
