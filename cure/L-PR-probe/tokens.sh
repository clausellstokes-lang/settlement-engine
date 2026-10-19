#!/bin/bash
# L-PR token census: word-boundary files in src/ and tests/, and quoted-literal files in src/, at master.
M="$1"; shift
cd "$M" || exit 2
for t in "$@"; do
  s=$(grep -rlw --include='*.js' --include='*.jsx' --include='*.mjs' --include='*.ts' -- "$t" src 2>/dev/null | wc -l | tr -d ' ')
  lit=$(grep -rlE --include='*.js' --include='*.jsx' --include='*.mjs' --include='*.ts' -- "['\"\`]$t['\"\`]" src 2>/dev/null | wc -l | tr -d ' ')
  te=$(grep -rlw -- "$t" tests 2>/dev/null | wc -l | tr -d ' ')
  printf '%s\tsrc-w=%s\tsrc-literal=%s\ttests-w=%s\n' "$t" "$s" "$lit" "$te"
done
