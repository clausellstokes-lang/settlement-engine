#!/bin/sh
# R-PA3 token census: rg -w -i counts (files with a hit) in code-of-record src/ and tests/, fp-p8 docs/, and the ledger branch docs/ (git grep, read-only).
C=/home/user/master-code-of-record; D=/home/user/fp-p8/docs; L=/home/user/settlement-engine
printf "%-22s %6s %6s %6s %6s\n" token src tests docs ledger
for t in "$@"; do
  s=$(rg -w -i -l --glob '!*.generated.*' -- "$t" $C/src 2>/dev/null | wc -l)
  te=$(rg -w -i -l -- "$t" $C/tests 2>/dev/null | wc -l)
  d=$(rg -w -i -l -- "$t" $D 2>/dev/null | wc -l)
  l=$(git -C $L grep -w -i -l -e "$t" origin/review-fixes-2026-07-08 -- docs/ 2>/dev/null | wc -l)
  printf "%-22s %6s %6s %6s %6s\n" "$t" "$s" "$te" "$d" "$l"
done
