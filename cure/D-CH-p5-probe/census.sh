#!/bin/bash
W=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
echo "census at $(git -C $W rev-parse --short HEAD) — $(date)"
for t in "$@"; do
  s=$(grep -rlw -- "$t" $W/src | wc -l | tr -d ' '); te=$(grep -rlw -- "$t" $W/tests | wc -l | tr -d ' ')
  md=$(grep -rlw -- "$t" $W/docs | wc -l | tr -d ' '); ld=$(grep -rlw -- "$t" $L | wc -l | tr -d ' ')
  q=$(grep -rlE -- "['\"]$t['\"]" $W/src | wc -l | tr -d ' ')
  echo -e "$t\tsrc $s · tests $te · mdocs $md · ldocs $ld · quoted-src $q"
done
