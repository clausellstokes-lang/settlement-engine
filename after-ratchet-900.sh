#!/bin/sh
# after-ratchet-900.sh <expected-totalFiles> <expected-entries> — after run-ratchet-900.sh: the totals car (guarded on TRUE_EXIT,
# the MEASURED figures you pass in after reading the log — E4: a figure is derived, never guessed), then the CAPSULE car
# (`base-state-capsule.mjs --runtime-tests=<totalTests from the log>` → docs/implementation/BASE_STATE.json), then the
# re-stamp of the kit at the FINAL car count, then the train seal. No owed-ledger car at §900 (entries stay 3). The gate is
# launched SEPARATELY (run-gate-900.sh). Every exit captured; refuses on anything unexpected. POSIX sh.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/laneDESKINT; LOG=$SC/ratchet-900.run.log; BASE=38474a59eba460f30d6596dcb65efda3a446738a; SEAL=train-desk-2026-09-05
EXP_FILES=$1; EXP_ENTRIES=$2
[ -n "$EXP_FILES" ] && [ -n "$EXP_ENTRIES" ] || { echo "usage: <expected-totalFiles> <expected-entries> (read them off the MEASURED line first)"; exit 9; }
[ -s "$LOG" ] && grep -q '^TRUE_EXIT=' "$LOG" || { echo "REFUSED: the ratchet log carries no TRUE_EXIT (the run has not finished)"; exit 9; }
grep -E '^TRUE_EXIT=|^MEASURED:|^PREDICTED' "$LOG" | cut -c1-220
[ "$(grep -E '^TRUE_EXIT=' "$LOG" | tail -1)" = "TRUE_EXIT=0" ] || { echo "REFUSED: the ratchet's TRUE_EXIT is not 0 — read the log before anything else"; exit 8; }
echo "--- totals car:"; sh $SC/commit-totals.sh "$D" "$LOG" "$EXP_ENTRIES" "$EXP_FILES" "$SEAL" "$BASE"; E=$?; echo "TOTALS_EXIT=$E"; [ "$E" -eq 0 ] || exit $E
cd "$D"
TT=$(python3 -c "import json;print(json.load(open('scripts/.test-ratchet-baseline.json'))['totalTests'])"); echo "totalTests (from the committed baseline) = $TT"
echo "--- capsule car (--runtime-tests=$TT):"; node scripts/base-state-capsule.mjs --runtime-tests="$TT" > $SC/capsule-900b.log 2>&1; E=$?; echo "CAPSULE_EXIT=$E"; tail -3 $SC/capsule-900b.log | cut -c1-200; [ "$E" -eq 0 ] || exit $E
P=$(git status --porcelain -uall); echo "porcelain after capsule: [$P]"
if [ -n "$P" ]; then
  [ "$P" = " M docs/implementation/BASE_STATE.json" ] || { echo "⛔ the capsule touched more than BASE_STATE.json"; exit 1; }
  cat > $SC/msg-900-capsule.txt <<MSG
Desk landing (capsule car): BASE_STATE.json regenerates at the composed tip with the landing's own executed test total

\`node scripts/base-state-capsule.mjs --runtime-tests=$TT\` — the figure is the census-totals register's own, taken by the ratchet run this landing executed (never a number from another tree). The capsule had been stale since the ENC-4/4c roster moves (112/378/10 against the roster's 115/381/12, DESK-900-CARS finding 4) and the coupling roster 7 → 8; it now reads the landed rosters. Runtime tests: $TT.

Seat: Fable 5.1 — validated

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
  git add docs/implementation/BASE_STATE.json && git commit -q -F $SC/msg-900-capsule.txt && echo "CAPSULE CAR -> $(git rev-parse --short HEAD)"
else echo "capsule unchanged — no car"; fi
N=$(git rev-list --count $BASE..HEAD); echo "CARS=$N · HEAD=$(git rev-parse --short HEAD) · porcelain=[$(git status --porcelain -uall | tr '\n' ' ')]"
echo "--- re-stamp the kit at $N cars:"; python3 $SC/mk-landing-kit.py 900 laneDESKINT $BASE landing-desk-2026-09-05 $N 2>&1 | tail -2
grep -q "^GATE_CARS=\|cars=$N\|EXPECT.*$N" $SC/run-gate-900.sh || grep -n "$N" $SC/run-gate-900.sh | head -2
git update-ref refs/preserve/$SEAL "$(git rev-parse HEAD)" && echo "SEALED $SEAL = $(git rev-parse --short refs/preserve/$SEAL)"
echo "NEXT: launch run-gate-900.sh in the background (quiet law; ~20 min; NO lane vitest meanwhile), then after-cas-900.sh, then fill texts-900 (__CARS__=$N __ENTRIES__ __TESTS__ __TOTALS__) and collect."
exit 0
