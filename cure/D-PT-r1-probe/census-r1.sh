#!/usr/bin/env bash
# D-PT-r1 token census on master (read-only). Columns: quoted-literal files in src · word files in src · word files in tests · word files in ledger docs
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
RG=$(command -v rg || echo /opt/homebrew/bin/rg)
printf 'token\tsrc_quoted\tsrc_word\ttests_word\tledger_docs_word\n'
for t in "$@"; do
  q=$(grep -rlE "['\"\`]$t['\"\`]" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  w=$(grep -rlw -e "$t" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  tt=$(grep -rlw -e "$t" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  d=$(grep -rlw -e "$t" "$L" 2>/dev/null | wc -l | tr -d ' ')
  printf '%s\t%s\t%s\t%s\t%s\n' "$t" "$q" "$w" "$tt" "$d"
done
