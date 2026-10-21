#!/bin/sh
# token census for D-PL-MN-RN-p5: master src/tests/docs (worktree) + ledger docs
M="$1"; L="$2"; shift 2
for t in "$@"; do
  s=$(grep -rlw -- "$t" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  te=$(grep -rlw -- "$t" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  d=$(grep -rlw -- "$t" "$M/docs" 2>/dev/null | wc -l | tr -d ' ')
  ld=$(grep -rlw -- "$t" "$L" 2>/dev/null | wc -l | tr -d ' ')
  echo "$t | src $s | tests $te | wt-docs $d | ledger-docs $ld"
done
