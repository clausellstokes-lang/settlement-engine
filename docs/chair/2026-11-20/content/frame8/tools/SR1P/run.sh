#!/bin/sh
# SR1-P: the three proofs, one pool at a time, every output to a file. usage: sh run.sh <dir>
# <dir> holds the worktrees `base` (af2fc858f; src = 0635a1677's) and `tip` (7e86f4d8c), each with node_modules linked.
set -eu
D=$(cd "$1" && pwd); T=$D/tip/docs/chair/2026-11-20/content/frame8/tools/SR1P; O=$D/out; mkdir -p "$O"
for t in base tip; do node "$T/birthA.mjs" "$D/$t/" "$O/a.$t.jsonl" > "$O/a.$t.log" 2>&1; done
node "$T/cmpA.mjs" "$D/tip/" "$O/a.base.jsonl" "$O/a.tip.jsonl" > "$O/a.cmp.out" 2>&1
for t in base tip; do node "$T/birthB.mjs" "$D/$t/" "$O/b.$t.jsonl" > "$O/b.$t.log" 2>&1; done
node "$T/cmpB.mjs" "$D/tip/" "$O/b.base.jsonl" "$O/b.tip.jsonl" > "$O/b.cmp.out" 2>&1
# (c): the confinement tool's vitest births, under the gate mutex, run from the tip tree
cd "$D/tip"
sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/tools/confinement/trees.mjs af2fc858f 7e86f4d8c "$D/trees" --words=none > "$O/c.trees.out" 2>&1
node "$T/confkeys.mjs" "$D/tip/" "$D/trees/born-af2fc858f" "$D/trees/born-7e86f4d8c" > "$O/c.keys.out" 2>&1
