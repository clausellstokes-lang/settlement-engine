#!/bin/sh
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
for t in body_ended party_made_known_trail bodyId passed reaches_party; do
  for d in "$M/src" "$M/tests" "$L"; do
    q=$(rg -l "['\"\`]$t['\"\`]" "$d" 2>/dev/null | wc -l | tr -d ' ')
    echo "$t	$d	quoted-literal-files=$q"
  done
done
echo "--- bodyId in src"; rg -n -w bodyId "$M/src" | cut -c1-220
echo "--- 'passed' literals in src"; rg -n "['\"]passed['\"]" "$M/src" | cut -c1-220 | head -12
