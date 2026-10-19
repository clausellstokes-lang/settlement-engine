#!/bin/bash
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
cd "$M"
echo "# D-PT-r5 census at 81f1cd963 (by the worktree path) ($(date)); ledger-docs counts include PT's own r5 text"
for w in waysKnown needPlaceOf party_made_known_trail body_ended; do
  q=$(grep -rlE "['\"\`]${w}['\"\`]" src | wc -l | tr -d ' ')
  echo "$w: src-word-files $(grep -rlw -- "$w" src | wc -l | tr -d ' ') · tests $(grep -rlw -- "$w" tests | wc -l | tr -d ' ') · master-docs $(grep -rlw -- "$w" docs | wc -l | tr -d ' ') · src-quoted $q · ledger-docs $(grep -rlw -- "$w" "$L" | tr '\n' ' ')"
done
