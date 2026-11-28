#!/bin/sh
for T in base cure; do for P in C V; do
  TREE=/home/user/settlement-engine; [ $T = base ] && TREE=/home/user/base777
  echo "$(date -u +%T) $T $P"
  nice -n 10 node --max-old-space-size=3072 /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/tools/boot.mjs $TREE /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/bundle-views-$T.mjs /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/ba-$P.json /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/out/ba-$T-$P.jsonl || exit 3
done; done; echo "ba done"
