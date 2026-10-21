#!/bin/sh
# D-PT-p5 token census: word-file counts in master src/tests/docs, quoted literals in master src, and ledger docs hits.
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
for t in offer_accepted deed_acceptance closedRecent fromIds RECORD_CLEARING met_in_person refused_request menace_weakened menace_ended SET_PRESENCE NAME_PARTY MARK_DEED ANSWER_ENGAGEMENT KEEP_PLEDGE SEND_WORD DIRECT_TO_PARTY BAN_PARTY PARDON_PARTY STRIKE_ENGAGEMENT AMEND_ENGAGEMENT RECORD_MEETING employerOf partyEmployerOf; do
  s=$(grep -rlw -- "$t" $M/src 2>/dev/null | wc -l | tr -d ' ')
  te=$(grep -rlw -- "$t" $M/tests 2>/dev/null | wc -l | tr -d ' ')
  d=$(grep -rlw -- "$t" $M/docs 2>/dev/null | wc -l | tr -d ' ')
  q=$(grep -rlE -- "['\"\`]$t['\"\`]" $M/src 2>/dev/null | wc -l | tr -d ' ')
  ld=$(grep -rlw -- "$t" $L 2>/dev/null | sed "s#$L/##" | tr '\n' ' ')
  echo "$t | src $s | tests $te | master-docs $d | quoted-src $q | ledger-docs: $ld"
done
