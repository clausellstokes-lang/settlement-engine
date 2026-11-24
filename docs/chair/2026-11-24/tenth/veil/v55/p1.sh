#!/bin/sh
# VEIL-55 UNIT 2's PROOFS (PART 44 block (0) item 4 at 47f8d31fe, with the whole-document form), after m0.sh. Every instrument
# UNCHANGED from the tree that holds it: the pool, its verify and both gates (v27/tell2/measure, the -wip's own, as VEIL-42's
# chain0.sh); R4I-SQL-2's item 4 (run-4.sh: 001..211 + 212 + down = 001..211, THE CATALOGUE, THE SALT, the smoke reads) from a
# scratch worktree of 8430edf5c (/home/user/wt/u2run: it writes its logs into its own tree); THE FORM = R4I-MEASURE's meas.sh
# frozen at 5130df7df (i42 = d71a3ee44), its control first on the red tree r4red1 (u2r1: must bite), then the tree.
# Run detached; each step's rc and hour (date -u) to /var/tmp/v55/p1.log.
W=/home/user/wt/r4ids; V=$W/docs/chair/2026-11-20/veil/out; MS=$V/v27/tell2/measure; U=/home/user/wt/u2run
F=/home/user/wt/i42/docs/chair/2026-11-20/veil/out/v42/meas/meas.sh; O=/var/tmp/v55/out/p1; L=/var/tmp/v55/p1.log
P=/var/tmp/v18/t2/pool-v55; ST=/var/tmp/v55/out/stored-today; SM=/var/tmp/v55/out/stored-master; mkdir -p $O
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
st() { echo "$1 rc=$2 $(date -u +%FT%TZ)" >> $L; }
step_run4() { (cd $U && $E sh docs/chair/2026-11-20/veil/out/v42/sql2/run-4.sh > $O/run4.txt 2>&1); st run4 "$? $(grep -c 'rc=0' $O/run4.txt) rc0-lines"; }
step_ctrl() { mx env MEAS_C=1 sh $F /home/user/wt/r4red1 $O/ctrl-red u2r1 handreach > $O/ctrl-red.txt 2>&1; st ctrl-red "$? $(tr '\n' ' ' < $O/ctrl-red/done.txt)"; }
step_ctrlg() { mx env MEAS_C=1 sh $F $W $O/ctrl-grn v28tpl handreach > $O/ctrl-grn.txt 2>&1; st ctrl-grn "$? $(tr '\n' ' ' < $O/ctrl-grn/done.txt)"; }
step_t140() { mx env MEAS_C=1 MEAS_DOORS=gallery,link sh $F $W $O/t140 v28tpl towns > $O/t140.txt 2>&1; st t140 "$? $(tr '\n' ' ' < $O/t140/done.txt)"; }
step_s140() { mx env MEAS_C=1 sh $F $W $O/s140 v28tpl stored $ST > $O/s140.txt 2>&1; st s140 "$? $(tr '\n' ' ' < $O/s140/done.txt)"; }
step_m140() { mx env MEAS_C=1 sh $F $W $O/m140 v28tpl stored $SM > $O/m140.txt 2>&1; st m140 "$? $(tr '\n' ' ' < $O/m140/done.txt)"; }
# THE STORED ARM (START-VEIL-42 (6); R4I-PAGE-3's ST, its probe and the corrected mask, personIdBijection.shared.mjs ::
# storedIdsServed, as committed in the tree): stored-ids.sh on both stored sets, template v28tpl (v27x211 + the tree's 212)
SI=$V/v38/r4ip3/stored-ids.sh
step_sidt() { mx sh $SI $W $ST $O/sid-today v28tpl > $O/sid-today.txt 2>&1; st sid-today "$? $(tr '\n' ' ' < $O/sid-today/done.txt)"; }
step_sidm() { mx sh $SI $W $SM $O/sid-master v28tpl > $O/sid-master.txt 2>&1; st sid-master "$? $(tr '\n' ' ' < $O/sid-master/done.txt)"; }
step_pool() { mx sh $MS/pool.sh $W $P v28tpl > $O/pool.txt 2>&1; st pool $?; }
step_verify() { mx sh $MS/verify.sh $W $O/verify $P 40 > $O/verify.txt 2>&1; st verify "$? $(tail -1 $O/verify.txt)"; }
step_gates() { mx env TELL_DB=v55m sh $MS/tell2.sh $W $O/gates v28tpl $P > $O/gates.txt 2>&1; st gates $?; }
step_sec() { (cd $W && mx sh scripts/gate-tail.sh npx vitest run tests/security --maxWorkers=2 --reporter=default --reporter=json --outputFile=$O/security.json > $O/security.txt 2>&1); st security "$? $(tail -4 $O/security.txt | tr '\n' ' ')"; }
step_named() { (cd $W && git grep -l -E "galleryPayloadFor|applyVeil|projectShareVeil|get_gallery_dossier|get_unlisted_dossier" -- tests ':!tests/security' > $O/named-files.txt && mx sh scripts/gate-tail.sh npx vitest run $(cat $O/named-files.txt) --reporter=default --reporter=json --outputFile=$O/named.json > $O/named.txt 2>&1); st named "$? files=$(wc -l < $O/named-files.txt) $(tail -4 $O/named.txt | tr '\n' ' ')"; }
for s in ${*:-run4 ctrl ctrlg t140 s140 m140 sidt sidm pool verify gates sec named}; do step_$s; done
echo "p1 END $(date -u +%FT%TZ)" >> $L
