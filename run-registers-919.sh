#!/bin/sh
# run-registers-919.sh <dock> — the §919 register pass at the rebased SEAM tip (the lighting census was refrozen by the lane's register commit; every other door runs here).
# Derived from run-registers-919.sh (chair, 21:4x): the LIGHTING DOOR IS NOT RUN (car 12 moved no test file; the census frozen at 62f201796
# still matches — the plain walker run is the receipt and a red there is a STOP); every other door runs as before; the chair commits what
# moved as a register car by hand after reading the diff. Every door under the gate mutex. Prints a PREDICTIONS line first (E4).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
BASE=29ec62425faa8e4c4e61b34e38ff871cc8e599a9
grep -qE "__(PREDICTIONS)__" "$0" && { echo "REFUSED: fill the predictions from predict-919.log first"; exit 8; }
D=$1; [ -d "$D" ] || { echo "usage: <dock>"; exit 9; }; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
EXPECT_CARS=${EXPECT_CARS:?set EXPECT_CARS to the dock car count before the register car}
[ "$(git rev-list --count $BASE..HEAD)" = "$EXPECT_CARS" ] || { echo "REFUSED: expected $EXPECT_CARS cars over 29ec62425, found $(git rev-list --count $BASE..HEAD)"; exit 8; }
M="sh scripts/gate-mutex.sh --run --"
echo "REGISTER_HEAD=$(git rev-parse HEAD) $(date '+%H:%M:%S')"
echo "PREDICTIONS (E4, §919): PREDICTED (predict-919.log 08:55 at b005886ef, 21 cars): lighting probe == register (2562 files / 375 parked / 2187 credited / 24163 titles / 6451 suiteTitles at da350688e) -> PLAIN walker green, no chair refreeze; OSR dry 1972 exact, exit 0, no scanned-path delta (the lane's OSR re-freeze at 8a-10 absorbed its own inputs; frozenAtSha bc441dccc); mounts door unchanged; prose-numerics 225 exact, no rekey; writer-reach dry exit 0 (HOLD line: judged 6532 / LIT 560 / LIT-NAME 4646 / DARK 1326) -> the --write is expected to move NOTHING (assert: porcelain empty after it); tuning plain green; voice E2 = the two INHERITED banked files (labelBands em 5, generalStateProse em 3)"
echo "=== 1. LIGHTING — PLAIN walker only (must be green; no door):"; $M npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js > $SC/reg919-lighting.log 2>&1; echo "LIGHTING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg919-lighting.log | cut -c1-60
echo "=== 1b. OSR — READ ONLY (predicted: exact match, no drift):"; node scripts/check-observed-shape-readers.mjs > $SC/reg919-osr-dry.log 2>&1; echo "OSR_DRY_EXIT=$? (must be 0)"; head -1 $SC/reg919-osr-dry.log | cut -c1-160; echo "  drift lines (must be 0): $(grep -c 'INPUT DRIFT\|DRIFT' $SC/reg919-osr-dry.log)"
echo "=== 2. MOUNTS BASELINE (predicted: no change):"; $M env UPDATE_MOUNT_BASELINE=1 npx vitest run tests/lint/dossierMountRegistry.walker.test.js > $SC/reg919-mounts.log 2>&1; echo "MOUNTS_DOOR_EXIT=$?"; echo "  changed (must be empty): [$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "=== 3. PROSE-NUMERICS re-key (dry, then --write):"; node $SC/prose-numerics-rekey.mjs "$D" > $SC/reg919-pn-dry.log 2>&1; echo "PN_DRY_EXIT=$?"; tail -2 $SC/reg919-pn-dry.log | cut -c1-160; node $SC/prose-numerics-rekey.mjs "$D" --write > $SC/reg919-pn.log 2>&1; echo "PN_WRITE_EXIT=$?"; tail -1 $SC/reg919-pn.log | cut -c1-160
echo "=== 4. WRITER-REACH --write (shrink-only; provenance only — the dry run decides):"; node scripts/check-writer-reach.mjs > $SC/reg919-wr-dry.log 2>&1; echo "WR_DRY_EXIT=$? (read the refusal text if any)"; grep -E "DARK and unregistered|STALE|BANK THE WIN" $SC/reg919-wr-dry.log | head -6 | cut -c1-160; $M node scripts/check-writer-reach.mjs --write > $SC/reg919-wr.log 2>&1; echo "WRITER_REACH_WRITE_EXIT=$?"; grep -E "writer-reach WRITE|WRWALKER" $SC/reg919-wr.log | head -3 | cut -c1-200; node scripts/check-writer-reach.mjs > $SC/reg919-wr-plain.log 2>&1; echo "WR_PLAIN_EXIT=$? (must be 0)"
echo "=== 5. TUNING INVENTORY — PLAIN walker only (predicted green):"; $M npx vitest run tests/lint/tuningRegister.walker.test.js > $SC/reg919-tuning.log 2>&1; echo "TUNING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg919-tuning.log | cut -c1-60
echo "REGISTER_PORCELAIN=[$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "NEXT: review each changed register against PREDICTIONS; commit the register car by hand; then fill run-ratchet-919.sh's PREDICTED, run it, grep for a HELD line, after-ratchet-919.sh 2491 3."
exit 0
