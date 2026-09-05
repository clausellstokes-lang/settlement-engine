#!/bin/sh
# rekey-898.sh — the prose-numerics re-key for the PROSE landing, run AFTER run-registers-prose.sh has finished (its wizard
# step must not be running). Dry run → assert FELL=0 NEW=0 → --write → assert the ledger changed → re-run the dry run → exact.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/lanePROSE2; cd "$D"
ps -ax -o command | grep -q '[w]izardNewsAuthoring' && { echo "⛔ the wizard walker is still running — wait"; exit 1; }
node "$SC/prose-numerics-rekey.mjs" "$D" > "$SC/rekey-898-dry.log" 2>&1 || { echo "⛔ dry run exit $? — log:"; tail -8 "$SC/rekey-898-dry.log"; exit 1; }
head -1 "$SC/rekey-898-dry.log"
grep -q 'FELL=0 NEW=0' "$SC/rekey-898-dry.log" || { echo "⛔ FELL or NEW rows measured — review:"; grep -E '  (FELL|NEW) ' "$SC/rekey-898-dry.log"; exit 1; }
node "$SC/prose-numerics-rekey.mjs" "$D" --write | tail -1
git status --porcelain -uall | grep -q 'prose-numerics-baseline' || { echo "⛔ the ledger did not change after --write"; exit 1; }
node "$SC/prose-numerics-rekey.mjs" "$D" | head -1 | grep -q 'rekeyed=0 relocated=0 FELL=0 NEW=0' && echo "REKEY OK: the ledger is exact again at $(git rev-parse --short HEAD) (+the working changes)" || { echo "⛔ post-write dry run is not clean"; exit 1; }
