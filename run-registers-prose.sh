#!/bin/sh
# run-registers-prose.sh <dock> — the CHAIR's register acts for the PROSE landing, at the COMPOSED tip, in order,
# each under the quiet-window law and the gate mutex. Predictions are written by the chair BEFORE running (E4).
# ⚠ Fill __PREDICTIONS__ from the PROSE-REBASE receipt first; the script refuses to run with the placeholder in place.
D=$1; [ -d "$D" ] || { echo "usage: <dock>"; exit 9; }
grep -q '__PREDICTIONS__' "$0" && { echo "REFUSED: predictions not written (E4) — edit this script first"; exit 8; }
cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
quiet() { STREAK=0; WAITED=0; while [ $STREAK -lt 3 ]; do L=$(uptime | sed 's/.*averages: //' | awk '{print $1}'); V=$(ps -ax -o command | grep -c '[v]itest/dist/workers'); OK=$(awk -v l="$L" 'BEGIN{print (l<4.0)?1:0}'); if [ "$OK" = "1" ] && [ "$V" -eq 0 ]; then STREAK=$((STREAK+1)); else STREAK=0; fi; echo "  probe: load=$L workers=$V streak=$STREAK"; [ $STREAK -lt 3 ] && sleep 60 && WAITED=$((WAITED+60)); [ $WAITED -gt 3600 ] && { echo "GAVE UP"; exit 8; }; done; echo "QUIET CONFIRMED after ${WAITED}s"; }
# ── E4 DERIVATIONS (chair, 2026-09-05, from the PROSE-REBASE receipt at 83c7b6b66; RE-DERIVE at the FIXED tip before running) ──
#  voice baseline (tests/copy/.voice-mechanics-baseline.json): committed 102 entries / em 455 / bang 10 (budgets 670 / 15).
#    at 83c7b6b66: Tier-2 TOTAL em 770 → 311 (a standing RED turns GREEN); per-file drifted 69 → 126 = 89 FALLS + 37 rises
#    (the 37 are MAINLINE debt the refreeze banks); refreeze target 55 entries / em 311 / bang 8 — a FALL on both totals,
#    so writeShrinkOnlyBaseline ACCEPTS. Tier-3 JSX arms PRE-EXISTING and byte-identical (37 em / 15 drifted; 526 files) —
#    they stay red and stay banked. ⚠ the FIX CAR reverts 4 band files (prosperity, governanceNarrative, safetyProfile,
#    the foodLabel producer): expect em to rise by the count of restored em dashes (≤ ~12); re-run the lane's
#    $SC/prose-rebase-scratch/voice-split.mjs at the fixed tip and write the exact figures on the PREDICTIONS line.
#  known-failure census: the Tier-2 TOTAL row of tests/copy/voiceMechanics.test.js RETIRES → entries 6 → 5 (the ratchet
#    --update may only REMOVE); the other three voice rows stay; enforcement-claims and clampPrimitiveBaseline stay.
#  test ratchet: totalFiles UNCHANGED (no test file added by the car); totalTests: REFUSED as a figure — the run derives it.
#  writer-reach: plain --write; delta UNMEASURED by the lane — predict from a read-only run (`node scripts/check-writer-reach.mjs`
#    without --write) at the fixed tip and write it here before the --write.
#  prose-numerics: 1,084 moved lines RELOCATE rows (path-and-line addressed); rows in == rows out (net zero) or STOP.
#  wizardNewsAuthoring (tests/lint/.wizard-news-authoring-baseline.json): a SECOND location-bound ledger the cure moves —
#    predict from its walker's read-only output; organicSamples: its UPDATE_* door — same.
#  lighting census: +0 predicted (no test file added; titles unchanged) — the FARMED probe confirms before the gate.
echo "PREDICTIONS: __PREDICTIONS__"
echo "REGISTER_HEAD=$(git rev-parse HEAD)"
# 1. voice magnitudes — a FALL is expected (shrink-only); the instrument banks it
quiet; sh scripts/gate-mutex.sh --run -- env UPDATE_VOICE_BASELINE=1 npx vitest run tests/copy/voiceMechanics.test.js tests/copy/proseLeak.test.js > "$D/../registers-prose-voice.log" 2>&1; E1=$?; echo "VOICE_EXIT=$E1 changed=$(git status --porcelain -uall | wc -l | tr -d ' ')"; git status --porcelain -uall | head -4
# 2. writer-reach — plain --write, NEVER --genesis
node scripts/check-writer-reach.mjs --write > "$D/../registers-prose-wr.log" 2>&1; E2=$?; echo "WRITER_REACH_EXIT=$E2"; tail -3 "$D/../registers-prose-wr.log" | cut -c1-140
# 3. organic samples — the design goldens (UPDATE_ORGANIC_SAMPLES=1; enrolled in the golden-freeze register, which is UNFROZEN)
quiet; sh scripts/gate-mutex.sh --run -- env UPDATE_ORGANIC_SAMPLES=1 npx vitest run tests/design/organicSamples.test.js > "$D/../registers-prose-organic.log" 2>&1; E3=$?; echo "ORGANIC_EXIT=$E3 changed=$(git status --porcelain -uall | wc -l | tr -d ' ')"
# 4. prose-numerics — NO env door; the ledger is exact (path+line+category+snippet). $SC/prose-numerics-rekey.mjs uses the
#    walker's OWN scanner: dry run first (must show FELL=0 NEW=0 or STOP and review), then --write re-keys/moves paired rows only.
#    DERIVED at dac3b15a8 (the fix-car tip): exact 215 · RE-KEYED 10 (activeConditions.js:983 ×2, moralDrift.js:315 ×2,
#    stressConfirmPass.js:126 ×3, :127 ×3 — em dash → colon inside the snippet) · relocated 0 · FELL 0 · NEW 0.
echo "--- prose-numerics dry run:"; (cd "$D" && node "$SC/prose-numerics-rekey.mjs" "$D") > "$D/../registers-prose-pn-dry.log" 2>&1; E4=$?; head -1 "$D/../registers-prose-pn-dry.log"
[ "$E4" = "0" ] && grep -q 'FELL=0 NEW=0' "$D/../registers-prose-pn-dry.log" && (cd "$D" && node "$SC/prose-numerics-rekey.mjs" "$D" --write) | tail -1 || echo "  ⛔ prose-numerics: FELL or NEW rows — chair review before any write"
#    wizard-news (.wizard-news-authoring-baseline.json, 19 rows, keyed path:line:column+signature): DERIVED 19/19 unchanged at the
#    prose tip (relocate-ledger-rows.mjs dry run) — no act expected; the walker confirms.
# 5. the census totals — the ratchet runner stamped for this landing does this (run-ratchet-<N>.sh); not repeated here
echo "REGISTER_PORCELAIN=[$(git status --porcelain -uall | wc -l | tr -d ' ')]"; git status --porcelain -uall
echo "NEXT: review each changed register against the PREDICTIONS line; commit the register car(s) as the LAST cars (Seat: Fable 5.1 — validated); then run-ratchet-<N>.sh, then run-gate-<N>.sh"
exit 0
