#!/bin/bash
# quoted-literal census on master src for cross-volume tokens (SEAMS-r2); grep -r (rg is a zsh function here)
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
cd "$M" || exit 1
for w in "$@"; do
  files=$(grep -rlE "['\"\`]${w}['\"\`]" src --include='*.js' --include='*.jsx' --include='*.ts' 2>/dev/null)
  n=$(printf '%s' "$files" | grep -c . )
  f=$(printf '%s\n' "$files" | head -3 | tr '\n' ' ')
  echo "$w	$n	$f"
done
