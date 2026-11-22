#!/bin/sh
# frame9/tools/proofb-explain.sh — FRAME-9 · unit 1: why SR1's proof (b) read 2,541 reasons differing (SR1-RESULTS, pair
# 334f9fb68 -> 4eea702d8, counted by a proofB.mjs that was never committed) and 2,592 (FRAME-8's SR1P, pair
# af2fc858f -> 7e86f4d8c, frame8/tools/SR1P/birthB.mjs + cmpB.mjs). The two pairs' trees differ under src/ only by F5R's
# render files and the one-home cure (same bytes out), so FRAME-8's two scripts are run on SR1's own pair: if they read
# 2,592 there, the 51 is the lost script's counting, not the trees.
# Usage, from the tree root, through the gate mutex: sh <this> <workdir>
set -eu
W="$1"; ROOT="$(pwd)"; S=docs/chair/2026-11-20/content/frame8/tools/SR1P
mkdir -p "$W/tools"
git show "origin/lane/frame-8-2026-11-20-sr1p-wip:$S/birthB.mjs" > "$W/tools/birthB.mjs"
git show "origin/lane/frame-8-2026-11-20-sr1p-wip:$S/cmpB.mjs" > "$W/tools/cmpB.mjs"
for REV in 334f9fb68 4eea702d8; do
  T="$W/tree-$REV"
  if [ ! -f "$W/b.$REV.jsonl" ]; then
    rm -rf "$T"; mkdir -p "$T"; git archive "$REV" | tar -x -C "$T"; ln -s "$ROOT/node_modules" "$T/node_modules"
    node "$W/tools/birthB.mjs" "$T/" "$W/b.$REV.jsonl" > "$W/b.$REV.log" 2>&1
  fi
done
node "$W/tools/cmpB.mjs" "$W/tree-4eea702d8/" "$W/b.334f9fb68.jsonl" "$W/b.4eea702d8.jsonl" > "$W/b.cmp.out" 2>&1
grep -E '"(towns|err|rolesSame|rolesMoved|keyMoved|powerOrStakeMoved|reasonsDiffer|loses|split)"' "$W/b.cmp.out"
