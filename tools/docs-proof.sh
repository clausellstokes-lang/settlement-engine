#!/bin/bash
# THE DOCS PROOF — runs master's doc-scanning tests over the ledger's amended FP volumes
# in the detached master worktree. Advisory, never the authoritative gate (that runs when
# the volumes reach master in a docs commit). Usage: bash docs-proof.sh <label>
# Writes <kit>/logs/docs-proof-<label>.log and prints the summary + exit line.
# Never read this through a pipe (CLAUDE.md): the exit is captured explicitly below.
set -u
KIT=/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17
WT=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
LEDGER=/Users/cstokes/Desktop/settlement-engine
LABEL="${1:-run}"
LOG="$KIT/logs/docs-proof-$LABEL.log"
cd "$WT" || exit 9
# the amended set: every FP volume + the fold + the spine + the later volumes the lanes may bracket
for f in "$LEDGER"/docs/DESIGN_FP_*.md "$LEDGER"/docs/DESIGN_W_SEAT.md "$LEDGER"/docs/DESIGN_W_OPS.md "$LEDGER"/docs/DESIGN_W_COIN.md "$LEDGER"/docs/DESIGN_W_FAITH.md; do
  [ -f "$f" ] && cp "$f" "$WT/docs/$(basename "$f")"
done
EXTRA=$(tr '\n' ' ' < "$KIT/docs-test-extra.txt")
# shellcheck disable=SC2086
npx vitest run tests/docs tests/lint $EXTRA > "$LOG" 2>&1
EXIT=$?
echo "exit=$EXIT" >> "$LOG"
grep -E 'Test Files|Tests  |exit=' "$LOG" | tail -4
# restore the worktree's docs so the next run starts clean
git checkout --quiet -- docs/ 2>/dev/null
# and remove the UNTRACKED copies the loop above placed (the new FP volumes are not on master): a census seat grepping
# the worktree's docs/ must never hit a staging copy (hazard found by D-FOUR-r4, 2026-10-20)
git clean -fq -- docs/ 2>/dev/null
exit $EXIT
