# REVIEW-UPKEEP-2: each walker arm planted on the REAL tree (scratch worktree), one at a time, reverted after.
set -u
G=src/generators/defenseGenerator.js; D=src/components/new/tabs/DefenseTab.jsx; X=src/lib/worldExport.js
run(){ GATE_MUTEX_TIER=shared sh scripts/gate-tail.sh sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 tests/lint/defenceDerived.walker.test.js > /tmp/plant.$1.log 2>&1; e=$?; echo "plant $1: exit $e; $(grep -E 'Tests +[0-9]' /tmp/plant.$1.log | tr -s ' ')"; grep -E '^\s+[+-] +"' /tmp/plant.$1.log | head -3; git checkout -- $G $D $X; }
printf '\nexport const plantI = (s) => s.defenseProfile.readiness;\n' >> $G; run i
printf '\nimport { getActiveRng } from "../kernel/rngContext.js";\nexport const plantII = () => getActiveRng();\n' >> $G; run ii
printf '\nexport const plantIII = (n) => /wizard/i.test(n);\n' >> $G; run iii
printf '\nexport const plantIV = (x) => x * 0.37;\n' >> $G; run iv
printf '\nexport const plantV = (s) => s.defenseProfile.parts.map((p) => p.points);\n' >> $D; run v
printf '\nexport const plantVb = (s) => JSON.stringify(s.defenseProfile);\n' >> $X; run vb-whole-profile-serialised
git status --short src | head
