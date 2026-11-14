#!/bin/sh
# plant.sh <tip tree> <out dir>: three plants against tests/generators/defenceMonotone.test.js, each restored after.
T=$1; O=$2; cd $T
G=src/generators/defenseGenerator.js; Wf=src/data/defenceWeights.js
run() { sh scripts/gate-tail.sh npx vitest run tests/generators/defenceMonotone.test.js > $O/plant.$1.txt 2>&1; echo "$1 exit $?" >> $O/plant.summary.txt; git checkout -- $G $Wf; }
# A: a market lowers the military by 2 (an ADD fall): must red
sed -i "s/  market: Object.freeze({ sup: 10 }),/  market: Object.freeze({ sup: 10, mil: -2 }),/" $Wf; grep -c "sup: 10, mil: -2" $Wf >> $O/plant.summary.txt; run A
# B: the scale's ends swapped (a greater rung counts LESS: an ENLARGE fall): must red
sed -i "s/houseScale: Object.freeze({ least: 0.8, greatest: 1.2 })/houseScale: Object.freeze({ least: 1.2, greatest: 0.8 })/" $Wf; grep -c "least: 1.2, greatest: 0.8" $Wf >> $O/plant.summary.txt; run B
# C: a market raises the military by 2 (no fall, scores move): must stay green
sed -i "s/  market: Object.freeze({ sup: 10 }),/  market: Object.freeze({ sup: 10, mil: 2 }),/" $Wf; grep -c "sup: 10, mil: 2 }" $Wf >> $O/plant.summary.txt; run C
git status --short $G $Wf >> $O/plant.summary.txt; echo PLANTS-DONE >> $O/plant.summary.txt
