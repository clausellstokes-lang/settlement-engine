#!/bin/sh
# edge-shared-ritual.sh <dock> — the ONE exception to "never materialise node_modules": the edge-shared bundle needs immer+seedrandom
# as real dirs to build. Materialise EXACTLY those two → npm run build:edge-shared → commit the re-mint (chair car) → RESTORE the symlinks
# → assert 453 symlinks again. Guard + consequence together; refuses on a dirty dock or if anything but the bundle outputs changed.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$1; REPO=/Users/cstokes/Desktop/settlement-engine; MAIN=$REPO/node_modules; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "⛔ dock dirty"; exit 1; }
NL=$(find node_modules -maxdepth 1 -type l | wc -l | tr -d ' '); echo "symlinks before: $NL"
for p in immer seedrandom; do [ -L node_modules/$p ] || { echo "⛔ node_modules/$p is not a symlink — refusing to guess its state"; exit 1; }; rm node_modules/$p; cp -R "$MAIN/$p" node_modules/$p; done
echo "materialised: immer seedrandom (real dirs)"
npm run build:edge-shared > "$SC/edge-shared-build.log" 2>&1; E=$?; echo "BUILD_EXIT=$E"; tail -3 "$SC/edge-shared-build.log" | cut -c1-140
for p in immer seedrandom; do rm -rf node_modules/$p; ln -s "$MAIN/$p" node_modules/$p; done
NL2=$(find node_modules -maxdepth 1 -type l | wc -l | tr -d ' '); [ "$NL2" = "$NL" ] || { echo "⛔ symlink count $NL -> $NL2 — restore failed"; exit 1; }; echo "symlinks restored: $NL2"
[ "$E" = "0" ] || { echo "⛔ build failed; nothing committed"; exit 1; }
CH=$(git status --porcelain -uall | awk '{print $2}'); echo "changed:"; printf '%s\n' "$CH" | sed 's/^/  /'
BAD=$(printf '%s\n' "$CH" | grep -vE '^supabase/functions/_shared/|^scripts/\.edge-shared|edge-shared' || true); [ -z "$BAD" ] || { echo "⛔ the build changed paths outside the bundle outputs:"; printf '%s\n' "$BAD"; exit 1; }
[ -n "$CH" ] || { echo "NO RE-MINT NEEDED: the bundle is byte-identical"; exit 0; }
printf '%s\n' "$CH" | xargs git add --
printf '%s\n' "Edge-shared bundle re-minted: dispositionLedger.js took the kernel clamp and is one of the bundle's inputs" "" "The ritual: immer + seedrandom materialised for the build only, restored to symlinks after (453 links before and after); the reproducibility test is the proof at the gate." "" "Seat: Fable 5.1 — validated" "" "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" > "$SC/msg-edge-shared.txt"
git commit -q -F "$SC/msg-edge-shared.txt"; echo "RE-MINT CAR $(git rev-parse --short HEAD): $(git diff --name-only HEAD~1 HEAD | tr '\n' ' ')"
