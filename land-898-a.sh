#!/bin/sh
# land-898-a.sh — the PROSE landing's chair chain AFTER run-registers-prose.sh: commit the register car → take the census
# totals (run-ratchet-898.sh, quiet-window + mutex) → commit the totals car (the LAST car) → seal. Then the gate is started
# separately (run-gate-898.sh, background) and after-cas-898.sh lands it. Every step gated on the previous one's exit.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/lanePROSE2; BASE=fd8b6df0013b749e24435450931618fbe78a3f13
echo "== 1. the register car"; sh $SC/commit-prose-registers.sh
[ "$(git -C $D rev-list --count $BASE..HEAD)" = "4" ] || { echo "⛔ expected 4 cars after the register car"; exit 1; }
echo "== 2. the census totals (quiet window + mutex)"; sh $SC/run-ratchet-898.sh > $SC/ratchet-898.log 2>&1 || true
grep -E '^TRUE_EXIT=|^MEASURED:|^RATCHET_PORCELAIN' $SC/ratchet-898.log
echo "== 3. the totals car (predicted entries 4, totalFiles 2468)"; sh $SC/commit-totals.sh $D $SC/ratchet-898.log 4 2468 train-prose-2026-09-05 $BASE
echo "== 4. lighting: the farmed probe vs the register at the tip (predicted equal, +0)"
PR=$(PROBE_FARM_ROOT=$SC/.farms node $SC/chair-tools/lighting-probe.mjs $D 2>/dev/null | tail -1)
RG=$(python3 -c "import json;d=json.load(open('$D/tests/lint/.lighting-census-baseline.json'));print(json.dumps({k:d[k] for k in ('files','parked','credited','titles','suiteTitles')}))")
echo "  probe   : $PR"; echo "  register: $RG"
[ "$PR" = "$RG" ] || { echo "⛔ lighting moved — a register re-take is owed before the gate (LIGHTING_CENSUS_REFREEZE), STOP"; exit 1; }
echo "LAND-898-A OK: $(git -C $D rev-list --count $BASE..HEAD) cars over $(echo $BASE | cut -c1-9); HEAD=$(git -C $D rev-parse --short HEAD); porcelain=$(git -C $D status --porcelain -uall | wc -l | tr -d ' ')"
echo "NEXT: sh $SC/run-gate-898.sh > $SC/gate-898.log 2>&1 (background), then sh $SC/after-cas-898.sh"
