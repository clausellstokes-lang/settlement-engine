#!/bin/bash
# R-PA2 token census: files with a whole-word, case-insensitive hit in master src/tests/docs (code of record),
# the consolidated docs (fp-p8/docs) and the ledger's docs. Usage: tokens.sh <token>...
M=/home/user/master-code-of-record; D=/home/user/fp-p8/docs; L=/home/user/ledger/docs
c() { grep -rliwI --include='*.js' --include='*.jsx' --include='*.ts' --include='*.md' --include='*.json' --include='*.mjs' -- "$1" "$2" 2>/dev/null | wc -l | tr -d ' '; }
printf '%-22s %6s %6s %6s %6s %6s\n' token src tests mdocs fpdocs ldocs
for t in "$@"; do printf '%-22s %6s %6s %6s %6s %6s\n' "$t" $(c "$t" "$M/src") $(c "$t" "$M/tests") $(c "$t" "$M/docs") $(c "$t" "$D") $(c "$t" "$L"); done
