#!/bin/sh
for P in C V; do
  N=$(node -e "console.log(require('/tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/render-$P.json').length)")
  FROM=0
  while [ $FROM -lt $N ]; do
    TO=$((FROM + 75))
    echo "$(date -u +%T) $P $FROM..$TO of $N"
    nice -n 10 node --max-old-space-size=3072 /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/tools/boot-final.mjs /home/user/settlement-engine /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/bundle-render.mjs /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/render-$P.json /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/out/render-$P.jsonl $FROM $TO || exit 3
    FROM=$TO
  done
done
echo "render done"
