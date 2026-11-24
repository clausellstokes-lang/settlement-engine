#!/bin/sh
# VEIL-55 (copy of VEIL-50's v50/u2.sh, only the out paths changed to /var/tmp/v55) UNIT 2 (R4-IDS with R4I-SQL-2), the lane owner's own runs. The code tree /home/user/wt/r4ids =
# lane/veil-50-2026-11-24-r4ids-wip (ab05aa487 + 040a405e0 merged plain; 212 fad4b9b9..., rollback b13c5be8... unchanged).
# R4I-SQL-2's instruments (its folder out/v42/sql2/, the measure copied verbatim from c08f514d1) are run UNCHANGED, re-pointed only
# by their arguments: my trees, my stored sets (the gate's 140, /var/tmp/v55/out/stored-{today,master}), my templates.
#   red trees: /home/user/wt/r4red1 = 392aff978 (before both cures), /home/user/wt/r4red2 = 84f2e2bba (cure 1 only: before N106's lines).
# Steps: tpl lint tc red1 grn1 red2 grn2 plant c sec. Each to /var/tmp/v55/out/u2/<step>.log ending "EXIT rc=<code> <hour>".
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
W=/home/user/wt/r4ids; R1=/home/user/wt/r4red1; R2=/home/user/wt/r4red2; P=$W/docs/chair/2026-11-20/veil/out/v42/sql2
O=/var/tmp/v55/out/u2; SM=/var/tmp/v55/out/stored-master; ST=/var/tmp/v55/out/stored-today; mkdir -p $O
MX="$E GATE_MUTEX_MAX_POLLS=100000 sh /home/user/settlement-engine/scripts/gate-mutex.sh --run --"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
fin() { echo "EXIT rc=$1 $(date -u +%FT%TZ)" >> $O/$2.log; }
tpl1() { dropdb --if-exists $1 && createdb -T v27x211 $1 && psql -X -q -v ON_ERROR_STOP=1 -d $1 -f $2/supabase/migrations/212_share_veil_later_cures.sql && echo "$1 = v27x211 + $(sha256sum $2/supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16)"; }
s_tpl() { { tpl1 u2r1 $R1 && tpl1 u2r2 $R2 && tpl1 u2g $W; } > $O/tpl.log 2>&1; fin $? tpl; }
s_lint() { cd $W; $MX npx vitest run tests/lint tests/copy --reporter=default --reporter=json --outputFile=$O/lint.json > $O/lint.log 2>&1; fin $? lint; }
s_tc() { cd $W; { $MX npm run typecheck:ratchet; $E npm run -s typecheck:domain:strict; } > $O/tc.log 2>&1; fin $? tc; }
s_red1() { cd $R1; $MX env MEAS_C=1 sh $P/meas.sh $R1 $O/red1 u2r1 handreach > $O/red1.log 2>&1; fin $? red1; }
s_grn1() { cd $W; $MX env MEAS_C=1 sh $P/meas.sh $W $O/grn1 u2g handreach > $O/grn1.log 2>&1; fin $? grn1; }
s_red2() { cd $R2; $MX env MEAS_DOORS=gallery sh $P/meas.sh $R2 $O/red2 u2r2 stored $SM > $O/red2.log 2>&1; fin $? red2; }
s_grn2() { cd $W; $MX env MEAS_DOORS=gallery sh $P/meas.sh $W $O/grn2 u2g stored $SM > $O/grn2.log 2>&1; fin $? grn2; }
s_plant() { cd $W; { echo "== red (u2r2)"; $E node $P/b-plant.mjs u2r2; echo "rc=$?"; echo "== green (u2g)"; $E node $P/b-plant.mjs u2g; echo "rc=$?"; } > $O/plant.log 2>&1; fin $? plant; }
s_c() { cd $W; $MX sh -c "for s in 0 1 2 3; do $E node $P/c-today.mjs u2r2 u2g $ST \$s/4 $O/c-today-\$s.json & done; wait" > $O/c.log 2>&1; fin $? c; }
SECN="tests/security/criminalSwitchHandReach.pglite.test.js tests/security/galleryRosterChoices.pglite.test.js tests/security/galleryServerVeil.pglite.test.js tests/security/galleryVeilHandRows.pglite.test.js tests/security/criminalSwitchSalt.test.js tests/security/galleryVeilIds.pglite.test.js"
s_sec() { cd $W; $MX npx vitest run $SECN --maxWorkers=1 > $O/sec.log 2>&1; fin $? sec; }
for n in "$@"; do s_$n; done
