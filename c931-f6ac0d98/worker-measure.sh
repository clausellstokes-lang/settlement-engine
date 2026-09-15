#!/bin/sh
# exit 0 = worker within the ceiling (good), 1 = over (bad), 125 = build failed (skip)
npm run build > /dev/null 2>&1 || exit 125
W=$(ls dist/assets/generation.worker-*.js 2>/dev/null | head -1); [ -n "$W" ] || exit 125
S=$(stat -f %z "$W"); echo "$(git rev-parse --short HEAD) worker=$S" >> /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad/c931/worker-bisect.txt
[ "$S" -le 1404493 ]
