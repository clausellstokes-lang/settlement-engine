#!/bin/sh
# usage: census-r4.sh <master> <docs> word...
M="$1"; D="$2"; shift 2
for w in "$@"; do
  q=$(rg -l --fixed-strings "'$w'" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  ws=$(rg -l -w --fixed-strings "$w" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  wt=$(rg -l -w --fixed-strings "$w" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  wd=$(rg -l -w --fixed-strings "$w" "$D" 2>/dev/null | wc -l | tr -d ' ')
  echo "$w | quoted-src-files $q | word src $ws · tests $wt · ledger-docs $wd"
done
