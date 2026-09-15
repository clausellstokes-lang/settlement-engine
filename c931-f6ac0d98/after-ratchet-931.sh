#!/bin/sh
# after-ratchet-931.sh <expected-totalFiles> <expected-entries> — the totals car (commit-totals.sh, guarded), then the CAPSULE car
# (base-state-capsule.mjs --runtime-tests=<totalTests from the committed baseline>), then the train seal. Gate launched separately.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad
D=$SC/laneCONSIST-930; LOG=$MY/c931/ratchet-931.run.log; BASE=f73bdbf16d3f7a57c18d7fd57b0478b953043a73; SEAL=longtail-consist-2026-09-15
EXP_FILES=$1; EXP_ENTRIES=$2
[ -n "$EXP_FILES" ] && [ -n "$EXP_ENTRIES" ] || { echo "usage: <expected-totalFiles> <expected-entries> (read them off the MEASURED line first)"; exit 9; }
[ -s "$LOG" ] && grep -q '^TRUE_EXIT=' "$LOG" || { echo "REFUSED: the ratchet log carries no TRUE_EXIT (the run has not finished)"; exit 9; }
grep -E '^TRUE_EXIT=|^MEASURED:|^PREDICTED' "$LOG" | cut -c1-220
[ "$(grep -E '^TRUE_EXIT=' "$LOG" | tail -1)" = "TRUE_EXIT=0" ] || { echo "REFUSED: the ratchet's TRUE_EXIT is not 0 — read the log before anything else"; exit 8; }
echo "--- totals car:"; sh $SC/commit-totals.sh "$D" "$LOG" "$EXP_ENTRIES" "$EXP_FILES" "$SEAL" "$BASE"; E=$?; echo "TOTALS_EXIT=$E"; [ "$E" -eq 0 ] || exit $E
cd "$D"
TT=$(python3 -c "import json;print(json.load(open('scripts/.test-ratchet-baseline.json'))['totalTests'])"); echo "totalTests (from the committed baseline) = $TT"
echo "--- capsule car:"; sh scripts/gate-mutex.sh --run -- node scripts/base-state-capsule.mjs --runtime-tests=$TT > $MY/c931/capsule-931.log 2>&1; CE=$?; echo "CAPSULE_EXIT=$CE"; tail -3 $MY/c931/capsule-931.log | cut -c1-160
[ "$CE" = "0" ] || { echo "REFUSED: the capsule did not regenerate — read capsule-931.log"; exit 7; }
CP=$(git status --porcelain -uall); echo "capsule porcelain=[$(echo "$CP" | tr '\n' ' ')]"
if [ -n "$CP" ]; then [ "$CP" = " M docs/implementation/BASE_STATE.json" ] || { echo "REFUSED: porcelain is not exactly the capsule: [$CP]"; exit 7; }; git add docs/implementation/BASE_STATE.json && git commit -q -m "Register (capsule car): the base-state capsule regenerates at the §931 long-tail consist tip (rung 19 pending the owner's indivisible commit; no OSR movement at this landing)

base-state-capsule.mjs shells out to the observed-shape CLI; taken after the totals car with --runtime-tests=$TT (this landing's measured totalTests, read from the committed ratchet baseline — the honest figure per tests/scripts/baseStateCapsule.test.js).

Seat: Fable 5.1 — validated

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && echo "CAPSULE CAR -> $(git rev-parse --short HEAD)"; else echo "capsule unchanged — no car"; fi
N=$(git rev-list --count $BASE..HEAD); echo "CARS=$N · HEAD=$(git rev-parse --short HEAD) · porcelain=[$(git status --porcelain -uall | tr '\n' ' ')]"
git -C /Users/cstokes/Desktop/settlement-engine update-ref refs/preserve/$SEAL "$(git rev-parse HEAD)" && echo "SEALED $SEAL = $(git rev-parse --short HEAD)"
echo "NEXT: EXPECT_CARS=$N nohup sh <f86a239c>/c930/run-gate-930.sh > $MY/c931/gate-931.log (quiet law; HOLD-VITEST present), then after-cas-931.sh $N"
exit 0
