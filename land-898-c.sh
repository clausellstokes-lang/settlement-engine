#!/bin/sh
# land-898-c.sh — after land-898-b (totals car in): the owed-ledger retirement car, then the true car count for the gate.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/lanePROSE2; BASE=fd8b6df0013b749e24435450931618fbe78a3f13
# the totals car is the precondition (land-898-b stopped at its step 4 once; the totals were re-taken after fix car #3)
echo "== 0. the totals car (entries predicted 5, totalFiles 2468) — commit from the re-taken ratchet log"
git -C $D log -1 --format=%s | grep -q 'census totals re-freeze' || sh $SC/commit-totals.sh $D $SC/ratchet-898.log 5 2468 train-prose-2026-09-05 $BASE
git -C $D log -1 --format=%s | grep -q 'census totals re-freeze' || { echo "⛔ no totals car at the tip"; exit 1; }
echo "== 1. the owed-ledger retirement car"; sh $SC/retire-owed-898.sh
N=$(git -C $D rev-list --count $BASE..HEAD); echo "== 2. the gate scripts take the true count ($N)"; sh $SC/set-cars-898.sh $N
echo "== 3. lighting re-check after the ledger edit (a test-file edit; titles must be unmoved)"
PR=$(PROBE_FARM_ROOT=$SC/.farms node $SC/chair-tools/lighting-probe.mjs $D 2>/dev/null | tail -1)
RG=$(python3 -c "import json;d=json.load(open('$D/tests/lint/.lighting-census-baseline.json'));print(json.dumps({k:d[k] for k in ('files','parked','credited','titles','suiteTitles')}))")
python3 -c "import json,sys;a=json.loads(sys.argv[1]);b=json.loads(sys.argv[2]);sys.exit(0 if a==b else 1)" "$PR" "$RG" || { echo "⛔ lighting moved: $PR vs $RG"; exit 1; }; echo "  lighting unmoved"
git -C $D update-ref refs/preserve/train-prose-2026-09-05 "$(git -C $D rev-parse HEAD)" 2>/dev/null || git -C /Users/cstokes/Desktop/settlement-engine update-ref refs/preserve/train-prose-2026-09-05 "$(git -C $D rev-parse HEAD)"
echo "LAND-898-C OK: $N cars; HEAD=$(git -C $D rev-parse --short HEAD); porcelain=$(git -C $D status --porcelain -uall | wc -l | tr -d ' ')"
echo "NEXT: sh $SC/run-gate-898.sh > $SC/gate-898.log 2>&1 (background), then sh $SC/after-cas-898.sh"
