#!/bin/bash
rg() { ( exec -a rg "${CLAUDE_CODE_EXECPATH:-/Users/cstokes/.local/bin/claude}" "$@" ); }
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
N=${N:-5}
for t in "$@"; do echo "== $t"; rg -n -e "['\"\`]${t}['\"\`]" "$M/src" | sed "s#$M/##" | cut -c1-200 | head -$N; done
