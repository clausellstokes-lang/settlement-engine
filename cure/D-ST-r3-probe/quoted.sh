#!/bin/bash
# print quoted-literal hits of each word in master src (first 14)
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
CC="${CLAUDE_CODE_EXECPATH:-/Users/cstokes/.local/bin/claude}"
RG() { (exec -a rg "$CC" "$@"); }
cd "$M"
for w in "$@"; do echo "=== $w"; RG -n -e "['\"\`]$w['\"\`]" src | cut -c1-180 | head -${N:-14}; done
