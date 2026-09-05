#!/bin/sh
# after-ratchet-899.sh — after run-ratchet-899.sh: the totals car (guarded on TRUE_EXIT, entries 2, totalFiles 2470), then the
# owed-ledger retirement car (three rows, OWED_CEILING 5 -> 2), then the car-count check against the stamped gate (28). The gate
# itself is launched SEPARATELY in the background (run-gate-899.sh). Every exit captured; refuses on anything unexpected.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/laneCLAMP3; LOG=$SC/ratchet-899.run.log
[ -s "$LOG" ] && grep -q '^TRUE_EXIT=' "$LOG" || { echo "REFUSED: the ratchet log carries no TRUE_EXIT (the run has not finished)"; exit 9; }
grep -E '^TRUE_EXIT=|^MEASURED:' "$LOG" | cut -c1-200
[ "$(grep -E '^TRUE_EXIT=' "$LOG" | tail -1)" = "TRUE_EXIT=0" ] || { echo "REFUSED: the ratchet's TRUE_EXIT is not 0 — read the log before anything else"; exit 8; }
echo "--- totals car:"; sh $SC/commit-totals.sh "$D" "$LOG" 2 2470 train-composed-2026-09-05 5e28d5c8376b2c7333ffc8b911b378f04629da8f; E=$?; echo "TOTALS_EXIT=$E"; [ "$E" -eq 0 ] || exit $E
echo "--- owed-ledger retirement car:"; sh $SC/retire-owed-899.sh; E=$?; echo "RETIRE_EXIT=$E"; [ "$E" -eq 0 ] || exit $E
cd "$D"; N=$(git rev-list --count 5e28d5c83..HEAD); echo "CARS=$N (the stamped gate expects 29) · HEAD=$(git rev-parse --short HEAD) · porcelain=[$(git status --porcelain -uall | tr '\n' ' ')]"
[ "$N" = "29" ] || { echo "⛔ car count $N != 29 — re-stamp the kit (mk-landing-kit.py … $N) before the gate"; exit 7; }
git update-ref refs/preserve/train-composed-2026-09-05 "$(git -C "$D" rev-parse HEAD)" && echo "SEALED train-composed = $(git rev-parse --short refs/preserve/train-composed-2026-09-05)"
echo "NEXT: launch run-gate-899.sh in the background (quiet law; ~20 min; NO lane vitest meanwhile), then after-cas-899.sh."
exit 0
