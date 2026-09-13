#!/bin/bash
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
cd $D/skepMEASURE || exit 1
wait_free(){ for i in $(seq 1 900); do V=vit; V2=est; n=$(pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l | tr -d ' '); [ "$n" -eq 0 ] && return 0; perl -e 'select(undef,undef,undef,2)'; done; return 1; }
for ln in 1205 1219 1232 1246 1260 1274 1290 1117; do
  if [ -e "$D/HOLD-VITEST" ] || ! wait_free; then echo "ABORT $ln"; continue; fi
  LINE=$(sed -n "${ln}p" scripts/mutation-sweep.sh)
  F=$(echo "$LINE" | grep -oE '(src/[^ ]+\.js|scripts/[^ ]+\.(mjs|js))$')
  cp "$F" "$D/skeptic-measure/.pb"; B=$(md5 -q "$F")
  eval "$LINE" 2>/dev/null; A=$(md5 -q "$F")
  if [ "$B" = "$A" ]; then echo "=== line $ln on $F : NO-OP (stale anchor), running anyway ==="; else echo "=== line $ln on $F : MUTATED $B -> $A ==="; fi
  npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism 2>&1 | grep -E "^ +×|Tests " | head -20
  cp "$D/skeptic-measure/.pb" "$F"; cmp -s "$D/skeptic-measure/.pb" "$F" && echo "RESTORED cmp-identical" || echo "RESTORE FAILED"
done
echo "PORCELAIN=$(git status --porcelain | wc -l)"
