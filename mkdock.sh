#!/bin/sh
# mkdock.sh <name> <sha> — a dock with the canonical SYMLINKED node_modules.
# ⛔ NEVER materialise packages: a dock with real copies reads a FALSE RED against the
# first-paint byte budget (measured 8,551 B over at §890). Symlinks only.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
REPO=/Users/cstokes/Desktop/settlement-engine
D="$SC/$1"; SHA="$2"
[ -d "$D" ] || git -C "$REPO" worktree add --detach "$D" "$SHA" >/dev/null 2>&1
mkdir -p "$D/node_modules"
for e in "$REPO"/node_modules/* "$REPO"/node_modules/.bin; do
  b=$(basename "$e"); [ -e "$D/node_modules/$b" ] || ln -s "$e" "$D/node_modules/$b"
done
printf '  %-18s %s  links=%s  porcelain=%s\n' "$1" "$(git -C "$D" rev-parse --short HEAD)" \
  "$(find "$D/node_modules" -maxdepth 1 -type l | wc -l | tr -d ' ')" \
  "$(git -C "$D" status --porcelain | wc -l | tr -d ' ')"
