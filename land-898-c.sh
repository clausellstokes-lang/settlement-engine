#!/bin/sh
# land-898-c.sh — after land-898-b (totals car in): the owed-ledger retirement car, then the true car count for the gate.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/lanePROSE2; BASE=fd8b6df0013b749e24435450931618fbe78a3f13
grep -q 'LAND-898-B OK' $SC/land-898-b.log || { echo "⛔ land-898-b did not finish OK"; exit 1; }
echo "== 1. the owed-ledger retirement car"; sh $SC/retire-owed-898.sh
N=$(git -C $D rev-list --count $BASE..HEAD); echo "== 2. the gate scripts take the true count ($N)"; sh $SC/set-cars-898.sh $N
echo "== 3. lighting re-check after the ledger edit (a test-file edit; titles must be unmoved)"
PR=$(PROBE_FARM_ROOT=$SC/.farms node $SC/chair-tools/lighting-probe.mjs $D 2>/dev/null | tail -1)
RG=$(python3 -c "import json;d=json.load(open('$D/tests/lint/.lighting-census-baseline.json'));print(json.dumps({k:d[k] for k in ('files','parked','credited','titles','suiteTitles')}))")
[ "$PR" = "$RG" ] || { echo "⛔ lighting moved: $PR vs $RG"; exit 1; }; echo "  lighting unmoved"
git -C $D update-ref refs/preserve/train-prose-2026-09-05 "$(git -C $D rev-parse HEAD)" 2>/dev/null || git -C /Users/cstokes/Desktop/settlement-engine update-ref refs/preserve/train-prose-2026-09-05 "$(git -C $D rev-parse HEAD)"
echo "LAND-898-C OK: $N cars; HEAD=$(git -C $D rev-parse --short HEAD); porcelain=$(git -C $D status --porcelain -uall | wc -l | tr -d ' ')"
echo "NEXT: sh $SC/run-gate-898.sh > $SC/gate-898.log 2>&1 (background), then sh $SC/after-cas-898.sh"
