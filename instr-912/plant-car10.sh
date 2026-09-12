#!/bin/zsh
# plant-car10.sh — apply ONE mutation to the lane dock, run ONE focused file, restore, and
# prove the restore byte-identical. Never the checkout family: cp backup + cp restore + cmp.
#   usage: plant-car10.sh <target-file> <test-file> <perl-expression>
set -e
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR
BK=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/instr-912/.plant-backup
TARGET="$1"; TEST="$2"; EXPR="$3"
cd "$D"
echo "md5 BEFORE   $(md5 -q "$TARGET")"
cp "$TARGET" "$BK"
perl -0pi -e "$EXPR" "$TARGET"
if cmp -s "$TARGET" "$BK"; then
  echo "⛔ THE PLANT MATCHED NOTHING — the target bytes moved"; cp "$BK" "$TARGET"; rm -f "$BK"; exit 3
fi
echo "planted."
set +e
npx vitest run "$TEST" --no-file-parallelism 2>&1 | grep -E '(×|Tests  |Test Files  )' | head -40
set -e
cp "$BK" "$TARGET"
if cmp "$TARGET" "$BK"; then echo "restored: cmp byte-identical"; fi
rm -f "$BK"
echo "md5 RESTORED $(md5 -q "$TARGET")"
