#!/bin/sh
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
for w in raided robbed_road fought sheltered merged paid_quarter fed_poor robbed_quarter ROAD_COVER_BY_MIGHT bodyRouteChoice bodyDefenceOf leaderOf guild_war captured_by_local_powers; do
  q1=$(grep -rlE "['\"\`]$w['\"\`]" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  q2=$(grep -rlE "['\"\`]$w['\"\`]" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  w1=$(grep -rlw "$w" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  echo "$w | quoted src $q1 · quoted tests $q2 · word src $w1"
done
echo '--- quoted hits (src) for the landed-looking ones'
for w in raided fought sheltered merged leaderOf; do grep -rnE "['\"]$w['\"]" "$M/src" | head -2; done
