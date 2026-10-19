#!/bin/sh
# D-BD-r5 token census: quoted literals and word files on master src/tests and the ledger docs.
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
D=/Users/cstokes/Desktop/settlement-engine/docs
for w in retire escaped confront shared_faith by_broker by_pursuit junction wild way trail track hidden body seize_supplies; do
  q1=$(grep -rlE "['\"\`]$w['\"\`]" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  q2=$(grep -rlE "['\"\`]$w['\"\`]" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  w1=$(grep -rlw "$w" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  w3=$(grep -rlw "$w" "$D" 2>/dev/null | wc -l | tr -d ' ')
  echo "$w | quoted src $q1 · quoted tests $q2 · word src $w1 · ledger docs $w3"
done
echo '--- escaped quoted (src)'; grep -rnE "['\"]escaped['\"]" "$M/src" | head -5
echo '--- retire quoted (tests)'; grep -rnE "['\"]retire['\"]" "$M/tests" | head -3
echo '--- way quoted (src)'; grep -rnE "['\"]way['\"]" "$M/src" | head -5
echo '--- wild quoted (src)'; grep -rnE "['\"]wild['\"]" "$M/src" | head -5
echo '--- trail quoted (src)'; grep -rnE "['\"]trail['\"]" "$M/src" | head -5
