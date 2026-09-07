#!/bin/sh
# run-registers-910.sh <dock> — the §910 register acts at the SOAK-HONEST-909 tip (EXPECT_CARS cars over 6ebe0ef3b), LAST, in DESK-LANDING-PLAN.md §3 order
# with the dirty-tree doors FIRST (the lighting door refuses porcelain): lighting → commit (register car 1) → mounts baseline door,
# prose-numerics re-key, writer-reach --write, plain re-runs as receipts → the chair commits register car 2 by hand after reading the diff.
# Drafted 2026-09-07 03:08 from run-registers-908.sh by substitution (chair, session b43943b4); the PREDICTIONS line and the lighting commit message are TOKENS filled from predict-910.log. DIFFERENCES FROM §903, each a prediction from predict-910.log (taken at c2337220a):
#   • NO OSR --write (the plain read matched the frozen inventory exactly and no execution input drifted; a scanned source — flagRegistry.js —
#     may change freely under provenanceDriftOf); the CLI dry read + the walker's plain run are the receipts, and a non-zero here is a STOP.
#   • TUNING: no refreeze door (no tuning table moved); the walker's PLAIN run is the receipt.
# Every door under the gate mutex; refreeze doors exit NON-ZERO on success by design. Prints a PREDICTIONS line first (E4).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
BASE=6ebe0ef3bd2e7fa0f5d0ede5c93780ecfbf3aada
# ⛔ UNFILLED-TOKEN GUARD (chair, 03:08): this file carries __TOKENS__ until predict-910.log is read; it refuses to run with any left.
grep -q "__[A-Z_]*__" "$0" && { echo "REFUSED: unfilled __TOKENS__ in $0 — fill PREDICTIONS / LIGHTING_NOTE / LIGHTING_COMMIT from predict-910.log first"; exit 8; }
D=$1; [ -d "$D" ] || { echo "usage: <dock>"; exit 9; }; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
EXPECT_CARS=${EXPECT_CARS:?set EXPECT_CARS to the dock car count before the register cars}
[ "$(git rev-list --count $BASE..HEAD)" = "$EXPECT_CARS" ] || { echo "REFUSED: expected $EXPECT_CARS cars over 6ebe0ef3b before the register cars, found $(git rev-list --count $BASE..HEAD)"; exit 8; }
[ -f "$SC/whole-910.log" ] && grep -q '^PROOF_EXIT=' "$SC/whole-910.log" || { echo "REFUSED: the §910 proof has not finished (no PROOF_EXIT in whole-910.log) — registers are taken AFTER the proof"; exit 8; }
M="sh scripts/gate-mutex.sh --run --"
echo "REGISTER_HEAD=$(git rev-parse HEAD) $(date '+%H:%M:%S')"
EXPECT_TITLES=${EXPECT_TITLES:?set EXPECT_TITLES to the predicted census titles after the door (read the farmed probe in predict-910.log)}
echo "PREDICTIONS (E4, §910, re-derived at the dock tip in predict-910.log BEFORE this runs): __PREDICTIONS__"
F=src/domain/display/stateProse/dossierMounts.js; node -e "import('$PWD/$F').then(m=>console.log('registry: mounts',m.DOSSIER_MOUNTS.length,'dark',m.UNMOUNTED_BLOCKS.length))"
echo "--- lighting: probe vs register"; PR=$(PROBE_FARM_ROOT=$SC/.farms node $SC/chair-tools/lighting-probe.mjs "$D" 2>/dev/null | tail -1); RG=$(python3 -c "import json;d=json.load(open('tests/lint/.lighting-census-baseline.json'));print(json.dumps({k:d[k] for k in ('files','parked','credited','titles','suiteTitles')}))"); echo "  probe   : $PR"; echo "  register: $RG"
echo "=== 1. LIGHTING (refuses a dirty tree — first):"; $M env LIGHTING_CENSUS_REFREEZE='Fable 5.1 chair — §910 SOAK-HONEST landing' LIGHTING_CENSUS_NOTE='__LIGHTING_NOTE__' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js > $SC/reg910-lighting.log 2>&1; echo "LIGHTING_DOOR_EXIT=$? (non-zero EXPECTED)"; $M npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js > $SC/reg910-lighting-plain.log 2>&1; echo "LIGHTING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg910-lighting-plain.log | cut -c1-60
git add tests/lint/.lighting-census-baseline.json && git commit -q -m "__LIGHTING_COMMIT__" && echo "REGISTER CAR 1 (lighting) -> $(git rev-parse --short HEAD)"
echo "=== 1b. OSR — READ ONLY (predicted: exact match, no drift; a non-zero exit or a drift line is a STOP — the chair rules before any door):"; node scripts/check-observed-shape-readers.mjs > $SC/reg910-osr-dry.log 2>&1; echo "OSR_DRY_EXIT=$? (must be 0)"; head -1 $SC/reg910-osr-dry.log | cut -c1-160; grep -c 'INPUT changed' $SC/reg910-osr-dry.log | sed 's/^/  drift lines (must be 0): /'; $M npx vitest run tests/lint/observedShapeReaders.walker.test.js > $SC/reg910-osr-walker.log 2>&1; echo "OSR_WALKER_PLAIN_EXIT=$? (must be 0)"; grep -E "Tests " $SC/reg910-osr-walker.log | cut -c1-60
echo "=== 2. MOUNTS BASELINE (predicted: no change):"; $M env UPDATE_MOUNT_BASELINE=1 npx vitest run tests/lint/dossierMountRegistry.walker.test.js > $SC/reg910-mounts.log 2>&1; echo "MOUNTS_DOOR_EXIT=$?"; echo "  changed (must be empty): [$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "=== 3. PROSE-NUMERICS re-key (dry, then --write; predicted 225 exact, nothing re-keyed):"; node $SC/prose-numerics-rekey.mjs "$D" > $SC/reg910-pn-dry.log 2>&1; echo "PN_DRY_EXIT=$?"; tail -2 $SC/reg910-pn-dry.log | cut -c1-160; node $SC/prose-numerics-rekey.mjs "$D" --write > $SC/reg910-pn.log 2>&1; echo "PN_WRITE_EXIT=$?"; tail -1 $SC/reg910-pn.log | cut -c1-160
echo "=== 4. WRITER-REACH --write (shrink-only; predicted NO refresh, provenance only — the dry run decides):"; node scripts/check-writer-reach.mjs > $SC/reg910-wr-dry.log 2>&1; echo "WR_DRY_EXIT=$? (read the refusal text if any)"; grep -E "DARK and unregistered|STALE|BANK THE WIN" $SC/reg910-wr-dry.log | head -6 | cut -c1-160; node scripts/check-writer-reach.mjs --write > $SC/reg910-wr.log 2>&1; echo "WRITER_REACH_WRITE_EXIT=$?"; tail -2 $SC/reg910-wr.log | cut -c1-200; node scripts/check-writer-reach.mjs > $SC/reg910-wr-plain.log 2>&1; echo "WR_PLAIN_EXIT=$? (must be 0)"
echo "=== 5. TUNING INVENTORY — PLAIN walker only (predicted green; no door at this landing):"; $M npx vitest run tests/lint/tuningRegister.walker.test.js > $SC/reg910-tuning.log 2>&1; echo "TUNING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg910-tuning.log | cut -c1-60
echo "=== 6. WIZARD-NEWS: nothing predicted (green in the proof); the hand re-sign is NOT run."
echo "REGISTER_PORCELAIN=[$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "NEXT: review each changed register against PREDICTIONS (expected: ONLY scripts/.writer-reach-baseline.json, provenance fields); commit register car 2 by hand; then the ratchet (run-ratchet-910.sh), after-ratchet-910.sh <2489> <3>, the kit re-stamp, texts-910, payload, run-gate-910.sh, after-cas-910.sh, collect."
exit 0
