#!/bin/sh
# Token census: word-boundary, case-insensitive hit counts (files) in worktree src/tests/docs and ledger docs.
M=$1; L=/Users/cstokes/Desktop/settlement-engine/docs
shift
printf "token\tsrc_files\tsrc_ident_files\ttests_files\twt_docs\tledger_docs\n"
for t in "$@"; do
  s=$(rg -l -w -i -- "$t" $M/src 2>/dev/null | wc -l | tr -d ' ')
  # identifier-ish use: quoted string literal or as a property/const name
  si=$(rg -l -i -- "['\"\`]$t['\"\`_]|\b${t}[A-Z_]|\b[a-z]+$(echo $t | awk '{print toupper(substr($0,1,1)) substr($0,2)}')\b" $M/src 2>/dev/null | wc -l | tr -d ' ')
  te=$(rg -l -w -i -- "$t" $M/tests 2>/dev/null | wc -l | tr -d ' ')
  d=$(rg -l -w -i -- "$t" $M/docs 2>/dev/null | wc -l | tr -d ' ')
  ld=$(rg -l -w -i -- "$t" $L 2>/dev/null | wc -l | tr -d ' ')
  printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$t" "$s" "$si" "$te" "$d" "$ld"
done
