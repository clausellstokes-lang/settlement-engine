#!/bin/sh
# usage: lit.sh token  -> quoted-literal uses in src
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
rg -n -i -e "'$1'" -e "\"$1\"" src | head -${2:-8}
