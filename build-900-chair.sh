#!/bin/sh
# build-900-chair.sh — the §900 chair BUILD acts in laneDESKINT, run ONLY when no lane is working in the dock and porcelain is empty:
#   1. the edge-shared re-mint by the ritual (materialise immer+seedrandom → build:edge-shared → commit → RESTORE symlinks)
#   2. the full `npm run build` (the worker bundle + the eight closure chunks), the WORKER bundle's byte figure measured from dist/,
#      and the listing of hashed chunks kept for HORIZON-B1's `__vite__mapDeps` by-filename diff
#   Prints every figure; the WORKER_BUNDLE_CEILING_BYTES arm is written by the chair BY HAND from the printed figure (a chair car), never here.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/laneDESKINT; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
echo "BUILD ACTS at $(git rev-parse --short HEAD) $(date '+%H:%M:%S') · symlinks before: $(find node_modules -maxdepth 1 -type l | wc -l | tr -d ' ')"
echo "--- 1. edge-shared re-mint (the ritual):"; sh $SC/edge-shared-ritual.sh "$D" 2>&1 | tail -8 | cut -c1-160; echo "RITUAL_EXIT=$? · symlinks after: $(find node_modules -maxdepth 1 -type l | wc -l | tr -d ' ') (must be 453) · porcelain=[$(git status --porcelain -uall | tr '\n' ' ')]"
grep -rlE '/Users/cstokes' src/data/edge 2>/dev/null | head -3 | sed 's/^/  ⛔ HOME PATH IN A MINTED INPUT ROW: /'
echo "--- 2. the full build (dist/):"; sh scripts/gate-mutex.sh --run -- npm run build > $SC/build-900.log 2>&1; echo "BUILD_EXIT=$?"; tail -3 $SC/build-900.log | cut -c1-140
echo "--- the WORKER bundle(s) in dist/ (bytes):"; find dist -name '*.js' | grep -iE 'worker' | while read f; do printf '  %8d  %s\n' "$(wc -c < "$f" | tr -d ' ')" "$f"; done
echo "--- hashed chunk listing → $SC/listing-900.txt:"; find dist -name '*.js' -exec sh -c 'printf "%s %s\n" "$(wc -c < "$1" | tr -d " ")" "$(basename "$1")"' _ {} \; | sort -k2 > $SC/listing-900.txt; wc -l < $SC/listing-900.txt | xargs echo "  chunks:"
echo "--- __vite__mapDeps in the entry (filenames):"; grep -ohE '__vite__mapDeps[^;]{0,400}' dist/assets/index-*.js 2>/dev/null | head -1 | grep -oE '"[^"]+\.js"' | tr '\n' ' ' | cut -c1-400; echo
echo "porcelain after build (dist/ must be ignored): [$(git status --porcelain -uall | tr '\n' ' ')]"
echo "NEXT: write the WORKER_BUNDLE_CEILING_BYTES arm from the printed worker bytes (monotone-down; cite this log) as a chair car; diff listing-900.txt by filename against HORIZON-B1's prediction; then the whole suite, the registers (plan §3 + f2), the kit, the gate."
