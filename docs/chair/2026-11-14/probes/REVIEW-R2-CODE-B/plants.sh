#!/bin/sh
# plants.sh <repo> <plant tree> <guards file: "<commit> <test> :: <src...>"> <out>: for each guard, the plant tree reset to the
# tip, the guard's own commit's src change reverse-applied (git apply -R; the cure taken out), the guard run alone; then the tree
# restored. A guard that stays green on its plant does not guard its cure. Each result: applied?, tests passed/failed, titles failed.
R=$1; P=$2; G=$3; O=$4; : > $O
while read c t sep rest; do
  cd $P && git checkout -q -- . && git clean -qfd src tests >/dev/null
  if [ -n "$rest" ]; then git -C $R diff $c^ $c -- src/ > $O.patch; if git apply -R --check $O.patch 2>/dev/null; then git apply -R $O.patch; ap=applied; else ap=NOT-APPLIED; fi; else ap=no-src; fi
  if [ "$ap" = applied ]; then npx vitest run --reporter=json --outputFile=$O.$c.json $t > $O.$c.log 2>&1; ex=$?; r=$(node -e "const j=require('$O.$c.json');console.log(j.numPassedTests+'/'+j.numTotalTests+' failed '+j.numFailedTests+' :: '+j.testResults.flatMap(f=>f.assertionResults.filter(a=>a.status==='failed').map(a=>a.title)).slice(0,3).join(' | ').slice(0,300))" 2>/dev/null); else ex=-; r=-; fi
  echo "$c $t $ap exit=$ex $r" >> $O
done < $G
cd $P && git checkout -q -- . && git status --short | grep -v node_modules | head -3
