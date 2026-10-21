#!/bin/sh
# token census: rg -w -i counts (files) on master src/tests/docs and the ledger docs
W=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
for t in "$@"; do
  printf "%-28s src:%-4s tests:%-4s mdocs:%-4s ldocs:%-4s\n" "$t" \
   "$(rg -w -i -l -- "$t" $W/src 2>/dev/null | wc -l | tr -d ' ')" \
   "$(rg -w -i -l -- "$t" $W/tests 2>/dev/null | wc -l | tr -d ' ')" \
   "$(rg -w -i -l -- "$t" $W/docs 2>/dev/null | wc -l | tr -d ' ')" \
   "$(rg -w -i -l -- "$t" $L 2>/dev/null | wc -l | tr -d ' ')"
done
