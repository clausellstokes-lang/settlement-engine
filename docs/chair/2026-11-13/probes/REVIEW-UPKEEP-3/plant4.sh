# REVIEW-UPKEEP-3: the earlier reader's walker plants (plant3.sh) again at 0a07f98c7, one at a time on the scratch
# worktree, each reverted after; then one plant per guard added since 65cb03ef1, each against the test that claims it.
# usage (inside the scratch worktree): sh plant4.sh <logdir>
set -u; L=$1
G=src/generators/defenseGenerator.js; D=src/components/new/tabs/DefenseTab.jsx; X=src/lib/worldExport.js
run(){ name=$1; shift; GATE_MUTEX_TIER=shared sh scripts/gate-tail.sh sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 "$@" > $L/plant4.$name.log 2>&1; e=$?; echo "plant $name: exit $e; $(grep -E 'Tests +[0-9]' $L/plant4.$name.log | tr -s ' ')"; git checkout -- src; }
W=tests/lint/defenceDerived.walker.test.js
run clean $W
printf '\nexport const plantI = (s) => s.defenseProfile.readiness;\n' >> $G; run i $W
printf '\nimport { getActiveRng } from "../kernel/rngContext.js";\nexport const plantII = () => getActiveRng();\n' >> $G; run ii $W
printf '\nimport { createPRNG } from "../kernel/prng.js";\nexport const plantIIb = (seed) => createPRNG(seed)();\n' >> $G; run iib $W
printf '\nexport const plantIII = (n) => /wizard/i.test(n);\n' >> $G; run iii $W
printf '\nexport const plantIV = (x) => x * 0.37;\n' >> $G; run iv $W
printf '\nexport const plantV = (s) => s.defenseProfile.parts.map((p) => p.points);\n' >> $D; run v $W
printf '\nexport const plantVb = (s) => JSON.stringify(s.defenseProfile);\n' >> $X; run vb $W
