#!/bin/sh
# V39-C2M: every heavy run, one at a time, each through the gate mutex (exit 3 = gave up: retry after a pause, not a result).
# Waits for THE GATE first: C1's stored read is done when /var/tmp/v18/out/v39/remake.log has a line beginning "read rc=".
# Each step's rc and UTC hour to $L. Trees: $SC the scratch (the one-line change, never committed), $BA the base (detached at
# the branch's cut, for the base build and the base runs), $ME the branch's own tree (C1's twin for M2; src untouched).
ME=/home/user/wt/c2m; SC=/home/user/wt/c2m-scratch; BA=/home/user/wt/c2m-base
H=$ME/docs/chair/2026-11-20/veil/out/v39/c2m; O=/var/tmp/v18/out/v39/c2m; S=/var/tmp/v18/stored/today/docs; L=$O/run.log
unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE
mkdir -p $O
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
mx() { while :; do sh $ME/scripts/gate-mutex.sh --run -- "$@"; rc=$?; [ $rc -ne 3 ] && return $rc; echo "mutex gave up $(date -u +%H:%M:%S); retry in 120s" >> $L; sleep 120; done; }
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $L
until grep -q '^read rc=' /var/tmp/v18/out/v39/remake.log 2>/dev/null; do sleep 60; done
echo "gate open $(date -u +%H:%M:%S): $(grep '^read rc=' /var/tmp/v18/out/v39/remake.log)" >> $L
# M1 (and M2's feed: the stored documents, publicProse replaced by the scratch composer's)
mx sh $H/shards.sh $SC $S $O/full m1 $O/cdocs > $O/m1.txt 2>&1; st m1 $?
cp $S/index-shard*.json $O/cdocs/ && ls $O/cdocs | wc -l > $O/cdocs-count.txt; st cdocs-index $?
# M3
mx sh $H/shards.sh $SC $S $O/full m3 > $O/m3.txt 2>&1; st m3 $?
node $H/c2m-an.mjs $O/full > $O/c2m-an.txt 2>&1; st an $?
# M2: C1's measure, unchanged, on the documents carrying (c)'s prose (the twin: the branch's own tree, src = the base)
mx sh $ME/docs/chair/2026-11-20/veil/out/v33/stored/prose.sh $ME $O/cdocs $O/prose-c > $O/m2.txt 2>&1; st m2 $?
node $ME/docs/chair/2026-11-20/veil/out/v33/stored/c1-an.mjs /var/tmp/v18/stored/today $O/prose-c $ME/src/domain/veil/rosterChoiceRegistry.js > $O/m2-an.txt 2>&1; st m2-an $?
# M4: the build at the base, then at the scratch; each VERIFY_DIST'd by the two build tests
for T in base scratch; do
  [ $T = base ] && W=$BA || W=$SC
  (cd $W && mx npm run build > $O/build-$T.log 2>&1); st build-$T $?
  (cd $W && mx env VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js > $O/verify-$T.log 2>&1); st verify-$T $?
done
node $H/fp.mjs $BA/dist $SC/dist > $O/fp.txt 2>&1; st fp $?
# M5: the four pins and tests/lint whole, at the scratch and at the base
for T in scratch base; do
  [ $T = base ] && W=$BA || W=$SC
  (cd $W && mx npx vitest run tests/components/publicProseEquality.test.jsx tests/components/publicProseVeilInvariance.test.js tests/components/publicProseVeilOnce.test.js tests/domain/publicProse.test.js > $O/pins-$T.log 2>&1); st pins-$T $?
  (cd $W && mx npx vitest run tests/lint > $O/lint-$T.log 2>&1); st lint-$T $?
done
echo "END $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $L
