#!/bin/bash
# usage: mounted.sh <module-basename-without-ext>
ROOT=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/lane-longtail-recon-slot
for m in "$@"; do
  f=$(find "$ROOT/src" -name "$m.js" | head -1)
  if [ -z "$f" ]; then echo "$m :: NO FILE IN src"; continue; fi
  srcimp=$(grep -rl "from '.*/$m\.js'\|from '\./$m\.js'\|from '\.\./$m\.js'" "$ROOT/src" --include=*.js --include=*.jsx | grep -v "/$m.js$" | wc -l | tr -d ' ')
  tstimp=$(grep -rl "$m\.js" "$ROOT/tests" 2>/dev/null | wc -l | tr -d ' ')
  echo "$m :: file=${f#$ROOT/} srcImporters=$srcimp testRefs=$tstimp"
  if [ "$srcimp" != "0" ]; then grep -rl "from '.*$m\.js'" "$ROOT/src" --include=*.js --include=*.jsx | grep -v "/$m.js$" | sed "s|$ROOT/|    -> |"; fi
done
