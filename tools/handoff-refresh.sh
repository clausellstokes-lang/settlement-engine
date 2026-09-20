#!/bin/sh
# handoff-refresh.sh — re-copy the chair kit to its durable path and re-seal it as a local
# preserve ref, so the account switch can happen at any moment. Run after every landing.
set -e
S=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad
K=$S/chair-kit-923472dc; L=/Users/cstokes/Desktop/settlement-engine; C=$S/consist
D=/Users/cstokes/Desktop/settlement-engine-kits/chair-kit-923472dc-2026-09-19
# volatile working files at the scratchpad root ride along
cp "$S/PR-BODY.md" "$S/REPORT-2026-09-19-the-fixes-consist.md" "$S/ORDER-QUEUE.md" "$K/" 2>/dev/null || true
for n in 5 6 7 8 9 10 11 12; do cp "$S/consist-check-2-run$n.log" "$K/logs/" 2>/dev/null || true; done
cp "$S/consist-ratchet-update.log" "$K/logs/" 2>/dev/null || true
# the refresh stamp inside the handoff
NOW=$(date "+%Y-%m-%d %H:%M EDT"); CT=$(git -C "$C" rev-parse --short HEAD); LT=$(git -C "$L" rev-parse --short HEAD)
printf '\n---\n**Refreshed %s** — consist tip %s · ledger tip %s · %s\n' "$NOW" "$CT" "$LT" "${1:-no note}" >> "$K/HANDOFF-ACCOUNT-SWITCH-2026-09-19.md"
mkdir -p "$D"; rsync -a --delete "$K/" "$D/"
# seal: a private index → tree → a parentless commit → the preserve ref (local; pushed with the chain)
export GIT_INDEX_FILE="$S/kit-seal.index"; rm -f "$GIT_INDEX_FILE"
git -C "$L" --work-tree="$K" add -f -A . >/dev/null 2>&1
T=$(git -C "$L" write-tree); unset GIT_INDEX_FILE
CM=$(git -C "$L" commit-tree "$T" -m "chair kit 923472dc — 2026-09-19 (refreshed $NOW; consist $CT; ledger $LT)")
git -C "$L" update-ref refs/preserve/chair-kit-923472dc-2026-09-19 "$CM"
echo "kit copied to $D; sealed as refs/preserve/chair-kit-923472dc-2026-09-19 = $CM (tree $T)"
