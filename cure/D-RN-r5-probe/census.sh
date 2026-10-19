#!/bin/sh
# D-RN-r5 token census on master 81f1cd963 (read-only). word files · quoted-literal files per tree.
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
for t in labelIsTrue hunt_won escaped body_ended paid_quarter robbed_quarter fed_poor; do
  w_src=$(grep -rlw -- "$t" $M/src | wc -l | tr -d ' ')
  q_src=$(grep -rlE "['\"\`]$t['\"\`]" $M/src | wc -l | tr -d ' ')
  w_tst=$(grep -rlw -- "$t" $M/tests | wc -l | tr -d ' ')
  q_tst=$(grep -rlE "['\"\`]$t['\"\`]" $M/tests | wc -l | tr -d ' ')
  w_doc=$(grep -rlw -- "$t" $M/docs | wc -l | tr -d ' ')
  w_led=$(grep -rlw -- "$t" $L | wc -l | tr -d ' ')
  echo "$t | src words $w_src quoted $q_src | tests words $w_tst quoted $q_tst | master docs $w_doc | ledger docs $w_led"
done
