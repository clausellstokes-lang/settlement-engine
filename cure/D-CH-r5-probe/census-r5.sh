#!/bin/bash
# D-CH-r5 token census: src · tests · master docs · ledger docs (word files) and quoted-literal files in src.
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
for t in "$@"; do
  s=$(grep -rlw -- "$t" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  te=$(grep -rlw -- "$t" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  md=$(grep -rlw -- "$t" "$M/docs" 2>/dev/null | wc -l | tr -d ' ')
  ld=$(grep -rlw -- "$t" "$L" 2>/dev/null | wc -l | tr -d ' ')
  q=$(grep -rlE -- "['\"\`]$t['\"\`]" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  echo "$t · src $s · tests $te · mdocs $md · ldocs $ld · quoted-src $q"
done
