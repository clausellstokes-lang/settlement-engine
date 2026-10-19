#!/bin/bash
# D-ST-r3 token census: quoted-literal files and whole-word files on master src+tests, and FP ledger docs
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
CC="${CLAUDE_CODE_EXECPATH:-/Users/cstokes/.local/bin/claude}"
RG() { (exec -a rg "$CC" "$@"); }
cd "$M"
printf "%-24s %8s %8s %8s %8s\n" token quotedSrc wordSrc wordTests fpDocs
for w in "$@"; do
  q=$(RG -l -e "['\"\`]$w['\"\`]" src 2>/dev/null | wc -l | tr -d ' ')
  a=$(RG -l -w -e "$w" src 2>/dev/null | wc -l | tr -d ' ')
  t=$(RG -l -w -e "$w" tests 2>/dev/null | wc -l | tr -d ' ')
  d=$(RG -l -w -e "$w" /Users/cstokes/Desktop/settlement-engine/docs/ 2>/dev/null | wc -l | tr -d ' ')
  printf "%-24s %8s %8s %8s %8s\n" "$w" "$q" "$a" "$t" "$d"
done
