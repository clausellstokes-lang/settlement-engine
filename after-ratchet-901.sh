#!/bin/sh
# after-ratchet-901.sh <expected-totalFiles> <expected-entries> — the §901 version (derived from 900 by targeted substitution; the capsule step is SKIPPED by ruling): the totals car (guarded on TRUE_EXIT,
# the MEASURED figures you pass in after reading the log — E4: a figure is derived, never guessed), then the CAPSULE car
# (`base-state-capsule.mjs --runtime-tests=<totalTests from the log>` → docs/implementation/BASE_STATE.json), then the
# re-stamp of the kit at the FINAL car count, then the train seal. No owed-ledger car at §900 (entries stay 3). The gate is
# launched SEPARATELY (run-gate-901.sh). Every exit captured; refuses on anything unexpected. POSIX sh.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/laneLIGHTINT; LOG=$SC/ratchet-901.run.log; BASE=04bb92d19735594718e61b271d5bdf4ddfd4a2cc; SEAL=light-int-2026-09-05
EXP_FILES=$1; EXP_ENTRIES=$2
[ -n "$EXP_FILES" ] && [ -n "$EXP_ENTRIES" ] || { echo "usage: <expected-totalFiles> <expected-entries> (read them off the MEASURED line first)"; exit 9; }
[ -s "$LOG" ] && grep -q '^TRUE_EXIT=' "$LOG" || { echo "REFUSED: the ratchet log carries no TRUE_EXIT (the run has not finished)"; exit 9; }
grep -E '^TRUE_EXIT=|^MEASURED:|^PREDICTED' "$LOG" | cut -c1-220
[ "$(grep -E '^TRUE_EXIT=' "$LOG" | tail -1)" = "TRUE_EXIT=0" ] || { echo "REFUSED: the ratchet's TRUE_EXIT is not 0 — read the log before anything else"; exit 8; }
echo "--- totals car:"; sh $SC/commit-totals.sh "$D" "$LOG" "$EXP_ENTRIES" "$EXP_FILES" "$SEAL" "$BASE"; E=$?; echo "TOTALS_EXIT=$E"; [ "$E" -eq 0 ] || exit $E
cd "$D"
TT=$(python3 -c "import json;print(json.load(open('scripts/.test-ratchet-baseline.json'))['totalTests'])"); echo "totalTests (from the committed baseline) = $TT"
echo "--- capsule car: SKIPPED BY RULING (RULING-OSR-900-NO-WRITE addendum: base-state-capsule.mjs shells out to the OSR CLI, which refuses by lineage until rung 18; the capsule test was green in the whole-suite proof)"
cd "$D"
N=$(git rev-list --count $BASE..HEAD); echo "CARS=$N · HEAD=$(git rev-parse --short HEAD) · porcelain=[$(git status --porcelain -uall | tr '\n' ' ')]"
echo "--- re-stamp the kit at $N cars:"; python3 $SC/mk-landing-kit.py 901 laneLIGHTINT $BASE landing-lighting-2026-09-05 $N 2>&1 | tail -2
grep -q "^GATE_CARS=\|cars=$N\|EXPECT.*$N" $SC/run-gate-901.sh || grep -n "$N" $SC/run-gate-901.sh | head -2
git update-ref refs/preserve/$SEAL "$(git rev-parse HEAD)" && echo "SEALED $SEAL = $(git rev-parse --short refs/preserve/$SEAL)"
echo "NEXT: launch run-gate-901.sh in the background (quiet law; ~20 min; NO lane vitest meanwhile), then after-cas-901.sh, then fill texts-901 (__CARS__=$N __ENTRIES__ __TESTS__ __TOTALS__) and collect."
exit 0
