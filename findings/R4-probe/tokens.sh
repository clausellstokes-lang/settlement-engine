#!/bin/zsh
# R4 token census: rg -w -i hit counts (files) in worktree src/tests/docs and ledger docs; first src hit.
W=$1; L=/Users/cstokes/Desktop/settlement-engine/docs; shift
for t in "$@"; do
  s=$(rg -w -i -l --glob '!**/*.generated.*' -- "$t" $W/src 2>/dev/null | wc -l | tr -d ' ')
  sc=$(rg -w -i -c --glob '!**/*.generated.*' -- "$t" $W/src 2>/dev/null | awk -F: '{n+=$NF} END{print n+0}')
  te=$(rg -w -i -l -- "$t" $W/tests 2>/dev/null | wc -l | tr -d ' ')
  d=$(rg -w -i -l -- "$t" $W/docs 2>/dev/null | wc -l | tr -d ' ')
  ld=$(rg -w -i -l -- "$t" $L 2>/dev/null | wc -l | tr -d ' ')
  q=$(rg -w -i -o --glob '!**/*.generated.*' -- "'$t'|\"$t\"|$t:" $W/src 2>/dev/null | head -1 | sed "s|$W/||" | cut -c1-110)
  printf '%-22s srcFiles=%-4s srcHits=%-5s tests=%-4s wtDocs=%-4s ledgerDocs=%-4s quotedToken: %s\n' "$t" "$s" "$sc" "$te" "$d" "$ld" "$q"
done
