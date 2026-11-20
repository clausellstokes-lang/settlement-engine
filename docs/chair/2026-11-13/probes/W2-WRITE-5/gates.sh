#!/bin/sh
# gates.sh <touched files...> : strict-domain, the type ratchet, eslint on the touched files, each through gate-tail.
: "${LANE:?set LANE}"; : "${OUT:?set OUT}"; cd "$LANE" || exit 1
sh scripts/gate-tail.sh npm run typecheck:domain:strict > "$OUT/g1.log" 2>&1; e1=$?
sh scripts/gate-tail.sh npm run typecheck:ratchet > "$OUT/g2.log" 2>&1; e2=$?
sh scripts/gate-tail.sh npx eslint "$@" > "$OUT/g3.log" 2>&1; e3=$?
echo "strict=$e1 ratchet=$e2 eslint=$e3"
