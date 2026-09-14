#!/bin/sh
# run-registers-915.sh <dock> — the §915 register pass at the rebased MEASURE tip (the lighting census was refrozen by the lane's register commit; every other door runs here).
# Derived from run-registers-915.sh (chair, 21:4x): the LIGHTING DOOR IS NOT RUN (car 12 moved no test file; the census frozen at 62f201796
# still matches — the plain walker run is the receipt and a red there is a STOP); every other door runs as before; the chair commits what
# moved as a register car by hand after reading the diff. Every door under the gate mutex. Prints a PREDICTIONS line first (E4).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
BASE=8522a17b20febb07ebe16bc9d739b9ebc54411c7
grep -qE "__(PREDICTIONS)__" "$0" && { echo "REFUSED: fill the predictions from predict-915.log first"; exit 8; }
D=$1; [ -d "$D" ] || { echo "usage: <dock>"; exit 9; }; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
EXPECT_CARS=${EXPECT_CARS:?set EXPECT_CARS to the dock car count before the register car}
[ "$(git rev-list --count $BASE..HEAD)" = "$EXPECT_CARS" ] || { echo "REFUSED: expected $EXPECT_CARS cars over 8522a17b2, found $(git rev-list --count $BASE..HEAD)"; exit 8; }
M="sh scripts/gate-mutex.sh --run --"
echo "REGISTER_HEAD=$(git rev-parse HEAD) $(date '+%H:%M:%S')"
echo "PREDICTIONS (E4, §915): lighting — NO movement: the register (files 2553 · parked 375 · credited 2178 · titles 23843 · suiteTitles 6377, measuredAtSha 40dbcfc66 — car 4b refroze it) equals the farmed probe at 1f89c5d2b (predict-915.log 09:47 read 23841 before car 4 added two titles); the plain walker is the receipt. OSR — exact 1972, 0 drift. mounts — no change (the train mounts nothing). prose-numerics — 225 exact. writer-reach — provenance only: frozenAtSha 2865da54f -> HEAD (1f89c5d2b); cohort 1322 -> 1322; the train adds no product importer (the census island and scripts/, docs/, tests/ only). tuning — plain green."
echo "=== 1. LIGHTING — PLAIN walker only (must be green; no door):"; $M npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js > $SC/reg915-lighting.log 2>&1; echo "LIGHTING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg915-lighting.log | cut -c1-60
echo "=== 1b. OSR — READ ONLY (predicted: exact match, no drift):"; node scripts/check-observed-shape-readers.mjs > $SC/reg915-osr-dry.log 2>&1; echo "OSR_DRY_EXIT=$? (must be 0)"; head -1 $SC/reg915-osr-dry.log | cut -c1-160; echo "  drift lines (must be 0): $(grep -c 'INPUT DRIFT\|DRIFT' $SC/reg915-osr-dry.log)"
echo "=== 2. MOUNTS BASELINE (predicted: no change):"; $M env UPDATE_MOUNT_BASELINE=1 npx vitest run tests/lint/dossierMountRegistry.walker.test.js > $SC/reg915-mounts.log 2>&1; echo "MOUNTS_DOOR_EXIT=$?"; echo "  changed (must be empty): [$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "=== 3. PROSE-NUMERICS re-key (dry, then --write):"; node $SC/prose-numerics-rekey.mjs "$D" > $SC/reg915-pn-dry.log 2>&1; echo "PN_DRY_EXIT=$?"; tail -2 $SC/reg915-pn-dry.log | cut -c1-160; node $SC/prose-numerics-rekey.mjs "$D" --write > $SC/reg915-pn.log 2>&1; echo "PN_WRITE_EXIT=$?"; tail -1 $SC/reg915-pn.log | cut -c1-160
echo "=== 4. WRITER-REACH --write (shrink-only; provenance only — the dry run decides):"; node scripts/check-writer-reach.mjs > $SC/reg915-wr-dry.log 2>&1; echo "WR_DRY_EXIT=$? (read the refusal text if any)"; grep -E "DARK and unregistered|STALE|BANK THE WIN" $SC/reg915-wr-dry.log | head -6 | cut -c1-160; $M node scripts/check-writer-reach.mjs --write > $SC/reg915-wr.log 2>&1; echo "WRITER_REACH_WRITE_EXIT=$?"; grep -E "writer-reach WRITE|WRWALKER" $SC/reg915-wr.log | head -3 | cut -c1-200; node scripts/check-writer-reach.mjs > $SC/reg915-wr-plain.log 2>&1; echo "WR_PLAIN_EXIT=$? (must be 0)"
echo "=== 5. TUNING INVENTORY — PLAIN walker only (predicted green):"; $M npx vitest run tests/lint/tuningRegister.walker.test.js > $SC/reg915-tuning.log 2>&1; echo "TUNING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg915-tuning.log | cut -c1-60
echo "REGISTER_PORCELAIN=[$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "NEXT: review each changed register against PREDICTIONS; commit the register car by hand; then fill run-ratchet-915.sh's PREDICTED, run it, grep for a HELD line, after-ratchet-915.sh 2491 3."
exit 0
