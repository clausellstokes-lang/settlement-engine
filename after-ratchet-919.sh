#!/bin/sh
# after-ratchet-919.sh <expected-totalFiles> <expected-entries> — the §919 version (from after-ratchet-908.sh by substitution 2026-09-07 03:08; the CAPSULE step is ACTIVE again — the OSR CLI is open at rung 18): the totals car (guarded on TRUE_EXIT,
# the SEAMD figures you pass in after reading the log — E4: a figure is derived, never guessed), then the CAPSULE car
# (`base-state-capsule.mjs --runtime-tests=<totalTests from the log>` → docs/implementation/BASE_STATE.json), then the
# re-stamp of the kit at the FINAL car count, then the train seal. No owed-ledger car at §919 (entries predicted 3). The gate is
# launched SEPARATELY (run-gate-919.sh). Every exit captured; refuses on anything unexpected. POSIX sh.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
D=$SC/laneREWRITE; LOG=$SC/ratchet-919.run.log; BASE=29ec62425faa8e4c4e61b34e38ff871cc8e599a9; SEAL=rewrite-8a-2026-09-09
EXP_FILES=$1; EXP_ENTRIES=$2
[ -n "$EXP_FILES" ] && [ -n "$EXP_ENTRIES" ] || { echo "usage: <expected-totalFiles> <expected-entries> (read them off the SEAMD line first)"; exit 9; }
[ -s "$LOG" ] && grep -q '^TRUE_EXIT=' "$LOG" || { echo "REFUSED: the ratchet log carries no TRUE_EXIT (the run has not finished)"; exit 9; }
grep -E '^TRUE_EXIT=|^SEAMD:|^PREDICTED' "$LOG" | cut -c1-220
[ "$(grep -E '^TRUE_EXIT=' "$LOG" | tail -1)" = "TRUE_EXIT=0" ] || { echo "REFUSED: the ratchet's TRUE_EXIT is not 0 — read the log before anything else"; exit 8; }
echo "--- totals car:"; sh $SC/commit-totals.sh "$D" "$LOG" "$EXP_ENTRIES" "$EXP_FILES" "$SEAL" "$BASE"; E=$?; echo "TOTALS_EXIT=$E"; [ "$E" -eq 0 ] || exit $E
cd "$D"
TT=$(python3 -c "import json;print(json.load(open('scripts/.test-ratchet-baseline.json'))['totalTests'])"); echo "totalTests (from the committed baseline) = $TT"
echo "--- capsule car (ACTIVE at rung 18 — the OSR CLI is open):"; sh scripts/gate-mutex.sh --run -- node scripts/base-state-capsule.mjs --runtime-tests=$TT > $SC/capsule-919.log 2>&1; CE=$?; echo "CAPSULE_EXIT=$CE"; tail -3 $SC/capsule-919.log | cut -c1-160
[ "$CE" = "0" ] || { echo "REFUSED: the capsule did not regenerate — read capsule-919.log"; exit 7; }
CP=$(git status --porcelain -uall); echo "capsule porcelain=[$(echo "$CP" | tr '\n' ' ')]"
if [ -n "$CP" ]; then git add docs/implementation/BASE_STATE.json && git commit -q -m "Register (capsule car): the base-state capsule regenerates at the §919 tip (rung 18 still; no OSR movement at this landing)

base-state-capsule.mjs shells out to the observed-shape CLI, which refused by lineage from §900 until OSR-SCHEMA18 re-anchored the
register inside the product lineage; taken after the totals car with --runtime-tests=$TT (this landing's measured totalTests).

Seat: Fable 5.1 — validated

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && echo "CAPSULE CAR -> $(git rev-parse --short HEAD)"; else echo "capsule unchanged — no car"; fi
cd "$D"
N=$(git rev-list --count $BASE..HEAD); echo "CARS=$N · HEAD=$(git rev-parse --short HEAD) · porcelain=[$(git status --porcelain -uall | tr '\n' ' ')]"
echo "--- re-stamp the kit at $N cars:"; python3 $SC/mk-landing-kit.py 919 laneREWRITE $BASE landing-rewrite-8a-2026-09-09 $N 2>&1 | tail -2
grep -q "^GATE_CARS=\|cars=$N\|EXPECT.*$N" $SC/run-gate-919.sh || grep -n "$N" $SC/run-gate-919.sh | head -2
git update-ref refs/preserve/$SEAL "$(git rev-parse HEAD)" && echo "SEALED $SEAL = $(git rev-parse --short refs/preserve/$SEAL)"
echo "NEXT: launch run-gate-919.sh in the background (quiet law; ~20 min; NO lane vitest meanwhile), then after-cas-919.sh, then fill texts-919 (__CARS__=$N __ENTRIES__ __TESTS__ __TOTALS__) and collect."
exit 0
