#!/bin/sh
# run-registers-917.sh <dock> — the §917 register pass at the rebased SEAM tip (the lighting census was refrozen by the lane's register commit; every other door runs here).
# Derived from run-registers-917.sh (chair, 21:4x): the LIGHTING DOOR IS NOT RUN (car 12 moved no test file; the census frozen at 62f201796
# still matches — the plain walker run is the receipt and a red there is a STOP); every other door runs as before; the chair commits what
# moved as a register car by hand after reading the diff. Every door under the gate mutex. Prints a PREDICTIONS line first (E4).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
BASE=8961388cea0864a73a25ed8457d608d1e08ca913
grep -qE "__(PREDICTIONS)__" "$0" && { echo "REFUSED: fill the predictions from predict-917.log first"; exit 8; }
D=$1; [ -d "$D" ] || { echo "usage: <dock>"; exit 9; }; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
EXPECT_CARS=${EXPECT_CARS:?set EXPECT_CARS to the dock car count before the register car}
[ "$(git rev-list --count $BASE..HEAD)" = "$EXPECT_CARS" ] || { echo "REFUSED: expected $EXPECT_CARS cars over 8961388ce, found $(git rev-list --count $BASE..HEAD)"; exit 8; }
M="sh scripts/gate-mutex.sh --run --"
echo "REGISTER_HEAD=$(git rev-parse HEAD) $(date '+%H:%M:%S')"
echo "PREDICTIONS (E4, §917): PREDICTED (predict-917.log 23:15 at ef3ee6cbd): lighting probe == register (2557 files / 375 parked / 2182 credited / 24048 titles / 6422 suiteTitles at 707118f80) -> PLAIN walker green, no chair refreeze; OSR dry 1972 exact, exit 0, no scanned-path delta (the lane added no product module); mounts door unchanged; prose-numerics 225 exact, no rekey; writer-reach dry 0 drift BUT the walker's digest red stands (the dark row customContentRoster-on-settlement struck at clause D-dial) -> the chair's --write moves the digest ac473495 -> 14a3b595 and frozenAtSha, cohort 1322 unchanged, no scan statistic; tuning plain green; voice E2 = the two INHERITED banked files (labelBands em 5, generalStateProse em 3)"
echo "=== 1. LIGHTING — PLAIN walker only (must be green; no door):"; $M npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js > $SC/reg917-lighting.log 2>&1; echo "LIGHTING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg917-lighting.log | cut -c1-60
echo "=== 1b. OSR — READ ONLY (predicted: exact match, no drift):"; node scripts/check-observed-shape-readers.mjs > $SC/reg917-osr-dry.log 2>&1; echo "OSR_DRY_EXIT=$? (must be 0)"; head -1 $SC/reg917-osr-dry.log | cut -c1-160; echo "  drift lines (must be 0): $(grep -c 'INPUT DRIFT\|DRIFT' $SC/reg917-osr-dry.log)"
echo "=== 2. MOUNTS BASELINE (predicted: no change):"; $M env UPDATE_MOUNT_BASELINE=1 npx vitest run tests/lint/dossierMountRegistry.walker.test.js > $SC/reg917-mounts.log 2>&1; echo "MOUNTS_DOOR_EXIT=$?"; echo "  changed (must be empty): [$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "=== 3. PROSE-NUMERICS re-key (dry, then --write):"; node $SC/prose-numerics-rekey.mjs "$D" > $SC/reg917-pn-dry.log 2>&1; echo "PN_DRY_EXIT=$?"; tail -2 $SC/reg917-pn-dry.log | cut -c1-160; node $SC/prose-numerics-rekey.mjs "$D" --write > $SC/reg917-pn.log 2>&1; echo "PN_WRITE_EXIT=$?"; tail -1 $SC/reg917-pn.log | cut -c1-160
echo "=== 4. WRITER-REACH --write (shrink-only; provenance only — the dry run decides):"; node scripts/check-writer-reach.mjs > $SC/reg917-wr-dry.log 2>&1; echo "WR_DRY_EXIT=$? (read the refusal text if any)"; grep -E "DARK and unregistered|STALE|BANK THE WIN" $SC/reg917-wr-dry.log | head -6 | cut -c1-160; $M node scripts/check-writer-reach.mjs --write > $SC/reg917-wr.log 2>&1; echo "WRITER_REACH_WRITE_EXIT=$?"; grep -E "writer-reach WRITE|WRWALKER" $SC/reg917-wr.log | head -3 | cut -c1-200; node scripts/check-writer-reach.mjs > $SC/reg917-wr-plain.log 2>&1; echo "WR_PLAIN_EXIT=$? (must be 0)"
echo "=== 5. TUNING INVENTORY — PLAIN walker only (predicted green):"; $M npx vitest run tests/lint/tuningRegister.walker.test.js > $SC/reg917-tuning.log 2>&1; echo "TUNING_PLAIN_EXIT=$? (must be 0)"; grep -E 'Tests ' $SC/reg917-tuning.log | cut -c1-60
echo "REGISTER_PORCELAIN=[$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "NEXT: review each changed register against PREDICTIONS; commit the register car by hand; then fill run-ratchet-917.sh's PREDICTED, run it, grep for a HELD line, after-ratchet-917.sh 2491 3."
exit 0
