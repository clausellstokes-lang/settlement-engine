#!/bin/bash
# P5b token probe: for each token, count hits in fold §5 (L700-922), fold whole, each volume (nonzero), master src.
DOCS=/Users/cstokes/Desktop/settlement-engine/docs
MASTER=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src
FOLD=$DOCS/DESIGN_FP_COHERENCE_FOLD.md
sed -n 700,922p "$FOLD" > /tmp/p5b-fold5.txt
while IFS='|' read -r row tok mode; do
  [ -z "$tok" ] && continue
  if [ "$mode" = "w" ]; then G="grep -w"; else G="grep"; fi
  f5=$($G -c -- "$tok" /tmp/p5b-fold5.txt)
  fa=$($G -c -- "$tok" "$FOLD")
  vols=""
  for f in $DOCS/DESIGN_FP_ARCH_*.md $DOCS/DESIGN_FP_SPINE.md $DOCS/DESIGN_FP_GENERALS.md; do
    n=$($G -c -- "$tok" "$f"); if [ "$n" != "0" ]; then v=$(basename "$f" .md | sed 's/DESIGN_FP_ARCH_//; s/DESIGN_FP_//'); vols="$vols $v:$n"; fi
  done
  src=$($G -rl -- "$tok" "$MASTER" 2>/dev/null | wc -l | tr -d ' ')
  echo "$row | $tok | fold§5=$f5 fold=$fa | vols:$vols | src-files=$src"
done
