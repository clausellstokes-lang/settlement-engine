#!/bin/sh
# lprobe-cheap-899.sh — the L-PROBE battery's CHEAP pass (steps c d e f g + the eager STOP: no vitest, no build, no register door)
# on the §899 landed tree, run AFTER the gate and the CAS so it measures the tree the lighting wave lights from. Prints the
# TRUE_EXITS file at the end; a task notification is not a receipt.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
TREE=$SC/laneCLAMP3; OUT=$SC/lprobe-out-899
[ -d "$TREE" ] || { echo "REFUSED: no tree"; exit 9; }
[ -z "$(git -C "$TREE" status --porcelain -uall)" ] || { echo "REFUSED: tree dirty — the battery must read a committed tip"; exit 8; }
echo "L-PROBE CHEAP at $(git -C "$TREE" rev-parse --short HEAD) (must equal the §899 CAS: $(git -C /Users/cstokes/Desktop/settlement-engine rev-parse --short claude/composite-r4)) → $OUT"
mkdir -p "$OUT"; sh $SC/lprobe/run.sh "$TREE" "$OUT" --cheap 2>&1 | tee "$OUT/run.log" | cut -c1-200
echo "--- TRUE_EXITS:"; cat "$OUT/TRUE_EXITS.txt" 2>/dev/null || echo "(no TRUE_EXITS file — the run did not reach its receipt)"
echo "--- outputs:"; ls -la "$OUT" | tail -n +2 | awk '{print "  "$5"\t"$9}'
echo "--- porcelain after (must be empty: the battery writes nothing into the tree): [$(git -C "$TREE" status --porcelain -uall | tr '\n' ' ')]"
