#!/bin/zsh
# L-ST token census: for each word, count rg -w hits (files) in master src (as a quoted literal and bare), tests, master docs, ledger docs.
rg() { ARGV0=rg "${CLAUDE_CODE_EXECPATH:-/Users/cstokes/.local/bin/claude}" "$@"; }
W=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
printf 'word\tsrcLiteralFiles\tsrcBareFiles\ttestsFiles\tledgerDocsFiles\n'
for w in "$@"; do
  lit=$(rg -l -e "['\"]${w}['\"]" "$W/src" 2>/dev/null | wc -l | tr -d ' ')
  bare=$(rg -l -w -e "$w" "$W/src" 2>/dev/null | wc -l | tr -d ' ')
  tst=$(rg -l -w -e "$w" "$W/tests" 2>/dev/null | wc -l | tr -d ' ')
  ld=$(rg -l -w -e "$w" "$L" 2>/dev/null | wc -l | tr -d ' ')
  printf '%s\t%s\t%s\t%s\t%s\n' "$w" "$lit" "$bare" "$tst" "$ld"
done
