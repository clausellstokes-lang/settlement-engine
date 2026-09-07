#!/bin/sh
# land-898-a.sh — the PROSE landing's chair chain AFTER run-registers-prose.sh: commit the register car → take the census
# totals (run-ratchet-898.sh, quiet-window + mutex) → commit the totals car (the LAST car) → seal. Then the gate is started
# separately (run-gate-898.sh, background) and after-cas-898.sh lands it. Every step gated on the previous one's exit.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/lanePROSE2; BASE=fd8b6df0013b749e24435450931618fbe78a3f13
echo "== 0. the prose-numerics re-key (the runner's step failed on an unset path)"; sh $SC/rekey-898.sh
echo "== 0b. wizard-news: apply the one re-sign from the walker log (dry, then write)"; python3 $SC/wizard-resign.py $SC/registers-prose-wizard.log $D/tests/lint/.wizard-news-authoring-baseline.json; python3 $SC/wizard-resign.py $SC/registers-prose-wizard.log $D/tests/lint/.wizard-news-authoring-baseline.json --write | tail -2
echo "== 1. the register car"; sh $SC/commit-prose-registers.sh
[ "$(git -C $D rev-list --count $BASE..HEAD)" = "4" ] || { echo "⛔ expected 4 cars after the register car"; exit 1; }
echo "== 2. the census totals (quiet window + mutex)"; sh $SC/run-ratchet-898.sh > $SC/ratchet-898.log 2>&1 || true
grep -E '^TRUE_EXIT=|^MEASURED:|^RATCHET_PORCELAIN' $SC/ratchet-898.log
echo "== 3. the totals car (predicted entries 4, totalFiles 2468)"; sh $SC/commit-totals.sh $D $SC/ratchet-898.log 4 2468 train-prose-2026-09-05 $BASE
echo "== 4. lighting: the farmed probe vs the register at the tip (predicted equal, +0)"
PR=$(PROBE_FARM_ROOT=$SC/.farms node $SC/chair-tools/lighting-probe.mjs $D 2>/dev/null | tail -1)
RG=$(python3 -c "import json;d=json.load(open('$D/tests/lint/.lighting-census-baseline.json'));print(json.dumps({k:d[k] for k in ('files','parked','credited','titles','suiteTitles')}))")
echo "  probe   : $PR"; echo "  register: $RG"
python3 -c "import json,sys;a=json.loads(sys.argv[1]);b=json.loads(sys.argv[2]);sys.exit(0 if a==b else 1)" "$PR" "$RG" || { echo "⛔ lighting moved — a register re-take is owed before the gate (LIGHTING_CENSUS_REFREEZE), STOP"; exit 1; }
echo "LAND-898-A OK: $(git -C $D rev-list --count $BASE..HEAD) cars over $(echo $BASE | cut -c1-9); HEAD=$(git -C $D rev-parse --short HEAD); porcelain=$(git -C $D status --porcelain -uall | wc -l | tr -d ' ')"
echo "NEXT: sh $SC/run-gate-898.sh > $SC/gate-898.log 2>&1 (background), then sh $SC/after-cas-898.sh"
