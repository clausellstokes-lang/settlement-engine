#!/bin/zsh
# Token census: files with a whole-word, case-insensitive hit in master src/tests/docs and the ledger docs.
setopt noglob
M="$1"; L="$2"; shift 2
c() { grep -rliwI --include='*.js' --include='*.jsx' --include='*.ts' --include='*.md' --include='*.json' --include='*.mjs' -- "$1" "$2" 2>/dev/null | wc -l | tr -d ' '; }
printf '%-16s %6s %6s %6s %6s\n' token src tests mdocs ldocs
for t in "$@"; do printf '%-16s %6s %6s %6s %6s\n' "$t" $(c "$t" "$M/src") $(c "$t" "$M/tests") $(c "$t" "$M/docs") $(c "$t" "$L"); done
