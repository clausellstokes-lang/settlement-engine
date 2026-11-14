#!/bin/sh
# REVIEW-UPKEEP-CAPACITY step 4: one plant at a time in a scratch worktree at the tip (/tmp/claude-0/wt/plant), each reverting ONE cure,
# then the guard files run; each plant's vitest exit and failing titles go to $OUT/<plant>.log. The tree is restored after each plant.
W=/tmp/claude-0/wt/plant; OUT=/tmp/claude-0/plants; mkdir -p $OUT; cd $W || exit 2
FILES="tests/generators/upkeepCapacityGaps.test.js tests/generators/defenceHouseScale.test.js tests/generators/upkeepHired.test.js tests/generators/magicCountOnce.test.js tests/domain/defenseInstitutionBucketsWork.test.js tests/generators/defenseEconomicGate.test.js tests/lint/recordRegisterTotality.walker.test.js"
run() { name=$1; npx vitest run $FILES --reporter=verbose > $OUT/$name.log 2>&1; echo "EXIT $?" >> $OUT/$name.log; git checkout -q -- src tests; }
run P0-none
sed -i "s/houseScale: Object.freeze({ least: 0.8, greatest: 1.2 })/houseScale: Object.freeze({ least: 1, greatest: 1 })/" src/data/defenceWeights.js; run P1-C1-scale-off
sed -i "s/'multiple garrison', \/\/ UPKEEP/'professional city watch', 'multiple garrison', \/\/ UPKEEP/" src/domain/institutions/defenseInstitutionBuckets.js
sed -i "s/hasAny(names, \['garrison','barracks','professional guard','multiple garrison'\])/hasAny(names, ['garrison','barracks','professional guard',PROFESSIONAL_CITY_WATCH,'multiple garrison'])/" src/generators/priorityHelpers.js; run P2-C2-pcw-garrison
sed -i "s/hasAny(names, \['citizen militia','militia','household levy'\])/hasAny(names, ['citizen militia','militia'])/" src/generators/priorityHelpers.js; run P3-C3-levy
sed -i "s/^const housedOf = (list) => list.filter((i) => !isFabricInstitution(\/\*\* @type {any} \*\/ (i)));/const housedOf = (list) => list;/" src/generators/defenseGenerator.js; run P4-C4a-fabric
sed -i "s/divineShrine: Object.freeze(\['temple', 'friary'\])/divineShrine: Object.freeze(['shrine', 'temple', 'friary'])/" src/domain/institutions/defenseInstitutionBuckets.js; run P5-C4b-shrine
sed -i "s/^      successor: 'Elder Grove Council', \/\/ UPKEEP.*$//" src/data/institutionalCatalog.js; run P6-C5-druid
sed -i "s/'golem workforce', \/\/ UPKEEP/'golem workforce', 'alchemist', \/\/ UPKEEP/" src/domain/institutions/defenseInstitutionBuckets.js
sed -i "s/hasArcane: magicOn \&\& magPri >= G.arcane \&\& names.arcane,/hasArcane: magicOn \&\& magPri >= G.arcane \&\& (inst.hasMagicInst || names.arcane),/" src/generators/defenseGenerator.js; run P7-C6-alchemist
sed -i "s/const willCut = Math.min(wm, milNow - cf - cut);/const willCut = 0;/" src/generators/defenseGenerator.js; run P8-C0-will
sed -i "s/'golem workforce', \/\/ UPKEEP/'golem workforce', 'alchemist', \/\/ UPKEEP/" src/domain/institutions/defenseInstitutionBuckets.js; run P9-C6-bucket-only
