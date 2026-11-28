T=$1; O=$2; cd $T
for f in tests/property/generatorGoldenMaster.test.js tests/property/espionageDormancyFence.test.js tests/property/dossierProseManifest.test.js tests/pdf/goldenViewModel.test.js tests/property/heraldKnowledgeDeskGolden.test.js tests/simulation/presetLightingWitness.test.js; do
  n=$(basename $f .test.js); npx vitest run $f --maxWorkers=1 > $O.$n.log 2>&1; echo "$n exit $?"
done
