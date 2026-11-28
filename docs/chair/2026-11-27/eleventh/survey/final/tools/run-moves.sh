#!/bin/sh
for P in C V; do for FROM in 0 300 600; do TO=$((FROM + 300)); echo "$(date -u +%T) $P $FROM..$TO"
nice -n 10 node --max-old-space-size=3072 /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/tools/boot-final.mjs /home/user/settlement-engine /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/bundle-moves.mjs /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/tools/plan-$P.json /tmp/claude-0/-home-user-settlement-engine/3dbfe5cb-53ed-50c9-9ca0-c7f58079be72/scratchpad/out/moves-$P.jsonl $FROM $TO || exit 3
done; done; echo "moves done"
