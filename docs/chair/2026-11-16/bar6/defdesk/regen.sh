#!/bin/sh
# regen.sh : the census re-taken to a scratch copy only, the desks regenerated, the census and every other desk put back
cd /tmp/claude-0/-home-user-settlement-engine/06562874-283a-51e1-a6ad-7ca8a1e010b2/scratchpad/wt || exit 2
node scripts/wiring-census.mjs > /dev/null || exit 1
node scripts/generate-dossier-state-prose.mjs > ../gen.out 2>&1 || { tail -5 ../gen.out; exit 1; }
git checkout docs/content/wiring-census.json
for f in $(git diff --name-only -- src/data | grep -v 'src/data/dossierStateProse/defense.generated.js'); do echo "REVERT other desk: $f"; git checkout -- "$f"; done
git status --short
