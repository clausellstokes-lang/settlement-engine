#!/usr/bin/env zsh
# run with: source census.sh <tokens…> (rg is a zsh function in this harness)
# token census on master (read-only): quoted-literal files in src, word files in src/tests, word files in ledger docs
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
printf 'token\tsrc_quoted_files\tsrc_word_files\ttests_word_files\tledger_docs_word_files\n'
for t in "$@"; do
  q=$(rg -l -e "['\"\`]$t['\"\`]" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  w=$(rg -l -w -e "$t" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  tt=$(rg -l -w -e "$t" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  d=$(rg -l -w -e "$t" "$L" 2>/dev/null | wc -l | tr -d ' ')
  printf '%s\t%s\t%s\t%s\t%s\n' "$t" "$q" "$w" "$tt" "$d"
done
