#!/bin/sh
# gates.sh <tree> <logdir> <touched files...>
T=$1; L=$2; shift 2; mkdir -p $L; cd $T
for g in "npx eslint $*" "node scripts/presumed-things-door.mjs --check" "npm run typecheck:domain:strict" "npm run typecheck:ratchet" "node scripts/census/page-census.mjs --grid" "node scripts/fact-layers-door.mjs" "node scripts/check-observed-shape-readers.mjs"; do
  n=$(echo "$g" | awk '{print $2}' | tr '/:' '__')
  sh scripts/gate-tail.sh $g > $L/$n.log 2>&1; echo "$(tail -1 $L/$n.log | grep -o 'exit: [0-9]*') :: $g" >> $L/summary.txt
done
echo ALLDONE >> $L/summary.txt
