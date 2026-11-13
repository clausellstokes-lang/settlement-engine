# surfaces.sh <tree> <tag>: each golden surface's own test, one worker, json report
cd $1
for f in tests/property/generatorGoldenMaster.test.js tests/property/espionageDormancyFence.test.js tests/property/dossierProseManifest.test.js tests/pdf/goldenViewModel.test.js tests/property/heraldKnowledgeDeskGolden.test.js tests/simulation/presetLightingWitness.test.js; do
  b=$(basename $f .test.js); TMPDIR=/home/user/rw npx vitest run $f --maxWorkers=1 --reporter=json --outputFile.json=/home/user/rw/surf-$2-$b.json > /home/user/rw/surf-$2-$b.log 2>&1; echo "$b exit $?"
done
