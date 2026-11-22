#!/bin/sh
# frame9/tools/firstpaint-index.sh — FRAME-9 · unit 1, ruling 69's first-paint proof for SR1: build two revisions in
# archived trees (this checkout's node_modules linked; the working tree is never touched), then compare the ENTRY's
# index file (dist/index.html's module script, dist/assets/index-<hash>.js) with every chunk hash normalised.
# Byte-identical after normalising = SR1 put nothing into the entry; the Brotli +107 lies in a chunk's hash names only.
# Usage, from the tree root, through the gate mutex: sh <this> <rev-before> <rev-after> <workdir>
set -eu
A="$1"; B="$2"; W="$3"; ROOT="$(pwd)"
mkdir -p "$W"
for REV in "$A" "$B"; do
  T="$W/tree-$REV"
  if [ ! -d "$T/dist" ]; then
    rm -rf "$T"; mkdir -p "$T"
    git archive "$REV" | tar -x -C "$T"
    ln -s "$ROOT/node_modules" "$T/node_modules"
    (cd "$T" && node --max-old-space-size=4096 node_modules/vite/bin/vite.js build > "$W/build-$REV.log" 2>&1) || { echo "build $REV failed: $W/build-$REV.log"; exit 1; }
  fi
  ENTRY="$(grep -oE 'src="/assets/index-[^"]+\.js"' "$T/dist/index.html" | head -1 | sed -E 's/^src="\/(.*)"$/\1/')"
  [ -n "$ENTRY" ] || { echo "no entry script in $T/dist/index.html"; exit 1; }
  sed -E 's/-[A-Za-z0-9_-]{8}\.(js|css|mjs)/-HASH.\1/g' "$T/dist/$ENTRY" > "$W/entry-$REV.norm.js"
  printf '%s\t%s\t%s bytes raw\t%s normalised sha256\n' "$REV" "$ENTRY" "$(wc -c < "$T/dist/$ENTRY" | tr -d ' ')" "$(sha256sum "$W/entry-$REV.norm.js" | cut -c1-16)"
done
if cmp -s "$W/entry-$A.norm.js" "$W/entry-$B.norm.js"; then echo "ENTRY NORMALISED: BYTE-IDENTICAL"; else echo "ENTRY NORMALISED: DIFFERS"; cmp "$W/entry-$A.norm.js" "$W/entry-$B.norm.js" || true; fi
