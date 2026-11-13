#!/bin/bash
# plant.sh <worktree> <guards file> <outdir> <commit...>: for each commit, reverse its src diff at the worktree's tip,
# run the guards (json), restore src. Prints per plant: applied?, and each guard file red/green with failing titles.
W=$1; G=$(cat $2); O=$3; shift 3; mkdir -p $O
for c in "$@"; do
  cd $W; git -C /home/user/settlement-engine diff $c^ $c -- src > $O/$c.patch
  if git apply -R --check $O/$c.patch 2>/dev/null; then git apply -R $O/$c.patch; ap=applied; else ap=NOT-APPLIED; fi
  npx vitest run $G --reporter=json --outputFile=$O/$c.json > $O/$c.log 2>&1
  echo "### plant $c ($ap)"; node -e 'const r=require(process.argv[1]); for(const f of r.testResults){ const bad=f.assertionResults.filter(a=>a.status!=="passed"); if(bad.length||f.status!=="passed") console.log("   RED "+f.name.split("/").pop()+" ("+bad.length+"): "+bad.map(a=>a.title).join(" ; ").slice(0,300)); }' $O/$c.json
  git checkout -q -- src
done
