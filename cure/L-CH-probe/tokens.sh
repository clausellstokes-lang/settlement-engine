#!/bin/sh
# L-CH token census (grep, not the rg shell function): files with a whole-word case-insensitive hit
# columns: src · tests · master docs · ledger docs · files in src with the quoted literal 'token'
M="$1"; L="$2"; shift 2
INC="--include=*.js --include=*.jsx --include=*.ts --include=*.mjs --include=*.json --include=*.md"
printf '%-26s %5s %5s %5s %5s %5s\n' token src tests mdocs ldocs lit
for t in "$@"; do
  s=$(grep -rliwI $INC -e "$t" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  te=$(grep -rliwI $INC -e "$t" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  md=$(grep -rliwI $INC -e "$t" "$M/docs" 2>/dev/null | wc -l | tr -d ' ')
  ld=$(grep -rliwI $INC -e "$t" "$L" 2>/dev/null | wc -l | tr -d ' ')
  li=$(grep -rlI $INC -e "'$t'" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  printf '%-26s %5s %5s %5s %5s %5s\n' "$t" "$s" "$te" "$md" "$ld" "$li"
done
