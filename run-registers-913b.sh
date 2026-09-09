#!/bin/sh
# run-registers-913b.sh <dock> — the §913 SECOND register pass, after car 12 cured the gate's voice-ratchet red at the sealed sixteen-car tip.
# Derived from run-registers-913.sh (chair, 21:4x): the LIGHTING DOOR IS NOT RUN (car 12 moved no test file; the census frozen at 62f201796
# still matches — the plain walker run is the receipt and a red there is a STOP); every other door runs as before; the chair commits what
# moved as a register car by hand after reading the diff. Every door under the gate mutex. Prints a PREDICTIONS line first (E4).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
BASE=3b1c0eaa51f77561a036ae7ec54682c39856192c
D=$1; [ -d "$D" ] || { echo "usage: <dock>"; exit 9; }; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
EXPECT_CARS=${EXPECT_CARS:?set EXPECT_CARS to the dock car count (16 sealed + car 12 = 17)}
[ "$(git rev-list --count $BASE..HEAD)" = "$EXPECT_CARS" ] || { echo "REFUSED: expected $EXPECT_CARS cars over 3b1c0eaa5, found $(git rev-list --count $BASE..HEAD)"; exit 8; }
M="sh scripts/gate-mutex.sh --run --"
echo "REGISTER_HEAD=$(git rev-parse HEAD) $(date '+%H:%M:%S')"
echo "PREDICTIONS (E4, §913 second pass): lighting — NO movement (car 12 touched src/domain/density/densityCreateBoundary.js only; no test file; titles 23707 / files 2545 / credited 2172 / suiteTitles 6342 unchanged — the plain walker is the receipt); OSR — exact match, 0 drift (a string rewrite adds no reader); mounts — no change; prose-numerics — 225 exact, but a snippet keyed inside densityCreateBoundary.js MAY relocate by line (the dry run decides; relocations are a re-key, never a FELL); writer-reach — provenance only (frozenAtSha 62f201796 -> HEAD; cohort 1322 -> 1322); tuning — plain green."
echo "=== 1. LIGHTING — PLAIN walker only (must be green; no door):"; $M npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js > $SC/reg913b-lighting.log 2>&1; echo "LIGHTING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg913b-lighting.log | cut -c1-60
echo "=== 1b. OSR — READ ONLY (predicted: exact match, no drift):"; node scripts/check-observed-shape-readers.mjs > $SC/reg913b-osr-dry.log 2>&1; echo "OSR_DRY_EXIT=$? (must be 0)"; head -1 $SC/reg913b-osr-dry.log | cut -c1-160; echo "  drift lines (must be 0): $(grep -c 'INPUT DRIFT\|DRIFT' $SC/reg913b-osr-dry.log)"
echo "=== 2. MOUNTS BASELINE (predicted: no change):"; $M env UPDATE_MOUNT_BASELINE=1 npx vitest run tests/lint/dossierMountRegistry.walker.test.js > $SC/reg913b-mounts.log 2>&1; echo "MOUNTS_DOOR_EXIT=$?"; echo "  changed (must be empty): [$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "=== 3. PROSE-NUMERICS re-key (dry, then --write):"; node $SC/prose-numerics-rekey.mjs "$D" > $SC/reg913b-pn-dry.log 2>&1; echo "PN_DRY_EXIT=$?"; tail -2 $SC/reg913b-pn-dry.log | cut -c1-160; node $SC/prose-numerics-rekey.mjs "$D" --write > $SC/reg913b-pn.log 2>&1; echo "PN_WRITE_EXIT=$?"; tail -1 $SC/reg913b-pn.log | cut -c1-160
echo "=== 4. WRITER-REACH --write (shrink-only; provenance only — the dry run decides):"; node scripts/check-writer-reach.mjs > $SC/reg913b-wr-dry.log 2>&1; echo "WR_DRY_EXIT=$? (read the refusal text if any)"; grep -E "DARK and unregistered|STALE|BANK THE WIN" $SC/reg913b-wr-dry.log | head -6 | cut -c1-160; $M node scripts/check-writer-reach.mjs --write > $SC/reg913b-wr.log 2>&1; echo "WRITER_REACH_WRITE_EXIT=$?"; grep -E "writer-reach WRITE|WRWALKER" $SC/reg913b-wr.log | head -3 | cut -c1-200; node scripts/check-writer-reach.mjs > $SC/reg913b-wr-plain.log 2>&1; echo "WR_PLAIN_EXIT=$? (must be 0)"
echo "=== 5. TUNING INVENTORY — PLAIN walker only (predicted green):"; $M npx vitest run tests/lint/tuningRegister.walker.test.js > $SC/reg913b-tuning.log 2>&1; echo "TUNING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg913b-tuning.log | cut -c1-60
echo "REGISTER_PORCELAIN=[$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "NEXT: review each changed register against PREDICTIONS; commit the register car by hand; then fill run-ratchet-913.sh's PREDICTED, run it, grep for a HELD line, after-ratchet-913.sh 2491 3."
exit 0
