#!/bin/bash
M="$1"; shift
cd "$M" || exit 2
for t in "$@"; do
  echo "== $t"
  grep -rnE --include='*.js' --include='*.jsx' --include='*.mjs' -- "['\"\`]$t['\"\`]" src 2>/dev/null | cut -c1-200 | head -8
done
