#!/bin/zsh
# D-CH-r1 token census: quoted-literal and word hits in master src, tests, docs (worktree) and the ledger docs.
rg() { ARGV0=rg "${CLAUDE_CODE_EXECPATH:-/Users/cstokes/.local/bin/claude}" "$@"; }
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
L=/Users/cstokes/Desktop/settlement-engine/docs
for w in "$@"; do
  lit=$(rg -l -e "'$w'" -e "\"$w\"" -e "\`$w\`" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  src=$(rg -lw -- "$w" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  tst=$(rg -lw -- "$w" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  mdoc=$(rg -lw -- "$w" "$M/docs" 2>/dev/null | wc -l | tr -d ' ')
  ldoc=$(rg -lw -- "$w" "$L" 2>/dev/null | wc -l | tr -d ' ')
  printf '%-22s literal-files:%-3s src:%-4s tests:%-4s mdocs:%-4s ldocs:%-4s\n' "$w" "$lit" "$src" "$tst" "$mdoc" "$ldoc"
done
