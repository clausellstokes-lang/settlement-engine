#!/bin/bash
# token census: quoted-literal hits and word hits on master src/tests/docs and the ledger docs
rg() { ( exec -a rg "${CLAUDE_CODE_EXECPATH:-/Users/cstokes/.local/bin/claude}" "$@" ); }
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
for t in "$@"; do
  lit=$(rg -c -e "['\"\`]${t}['\"\`]" "$M/src" 2>/dev/null | awk -F: '{a+=$2} END{print a+0}')
  litf=$(rg -l -e "['\"\`]${t}['\"\`]" "$M/src" 2>/dev/null | sed "s#$M/##" | head -4 | tr '\n' ' ')
  w=$(rg -w -c -e "$t" "$M/src" 2>/dev/null | awk -F: '{a+=$2} END{print a+0}')
  te=$(rg -w -c -e "$t" "$M/tests" 2>/dev/null | awk -F: '{a+=$2} END{print a+0}')
  ld=$(rg -w -c -e "$t" "$L" 2>/dev/null | awk -F: '{a+=$2} END{print a+0}')
  echo "$t | lit=$lit [$litf] | word=$w | tests=$te | ledger=$ld"
done
