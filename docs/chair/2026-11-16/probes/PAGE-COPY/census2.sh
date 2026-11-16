#!/bin/sh
# CENSUS-2 — count the record-checkable fault kinds (a..h) on any tree, one command.
#   sh docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree-root> <out-dir> [workers=4] [--files a,b,c] [--seeds <file>] [--reuse] [--count-only]
# <tree-root>: a checkout with node_modules (npm ci there first). <out-dir>: scratch, outside the repository.
# Births every seed (default: the census's 720, seeds.txt) in that tree, renders every dossier view through the tree's
# own OutputContainer as the owner (render.census2.jsx = the SECOND-WAVE-CENSUS walk), counts every pattern against
# the town's own record (count2.mjs), traces each hit line to its writer in that tree (writers2.mjs), and writes
#   <out-dir>/hits.json (every hit) · hits.by-file.json (hits grouped by writer file) · counts.txt (one row a pattern,
#   one row a writer file). --files prints only the hits whose writer file is one of those (paths from the tree root).
# --reuse skips births and render when <out-dir> already holds corpus.ndjson.gz and every dump.
# A pattern FINDS CANDIDATES: a hit is a line to read against the record, not a fault until read.
# Every stage's own exit is read (no pipe); empty counts, a missing dump or a failed stage exits non-zero.
set -u
P=$(cd "$(dirname "$0")" && pwd)
[ $# -ge 2 ] || { echo "usage: census2.sh <tree-root> <out-dir> [workers] [--files a,b] [--seeds f] [--reuse]"; exit 2; }
TREE=$(cd "$1" && pwd) || exit 2; mkdir -p "$2/dumps" || exit 2; OUT=$(cd "$2" && pwd); shift 2
W=4; FILES=""; SEEDS="$P/seeds.txt"; REUSE=0; COUNTONLY=0
while [ $# -gt 0 ]; do case "$1" in
  --files) FILES="$2"; shift 2;; --seeds) SEEDS=$(cd "$(dirname "$2")" && pwd)/$(basename "$2"); shift 2;; --reuse) REUSE=1; shift;; --count-only) COUNTONLY=1; shift;;
  *) W="$1"; shift;; esac; done
[ -d "$TREE/node_modules" ] || { echo "census2: no node_modules in $TREE (run npm ci there first)"; exit 2; }
N=$(grep -c . "$SEEDS")
T0=$(date +%s)
if [ "$REUSE" -eq 1 ] && [ -f "$OUT/corpus.ndjson.gz" ] && [ "$(ls "$OUT/dumps" | wc -l)" -eq "$N" ]; then
  echo "census2: reusing $OUT (corpus and $N dumps)"
else
  ln -sfn "$TREE/node_modules" "$OUT/node_modules"
  echo "census2: births in $TREE ($N seeds)"
  TREE=$TREE OUT=$OUT SEEDS=$SEEDS node "$P/births.mjs"; rc=$?
  [ "$rc" -eq 0 ] || { echo "census2: births FAILED (exit $rc)"; exit 1; }
  sed -e "s#__TREE__#$TREE#g" -e "s#__P__#$P#g" "$P/render.census2.jsx" > "$OUT/render.census2.jsx"
  [ -f "$TREE/src/domain/display/publicProse.js" ] || sed -i '/@stamp/d' "$OUT/render.census2.jsx"
  cat > "$OUT/vitest.census2.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$OUT/render.census2.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
CFG
  rm -f "$OUT"/dumps/*.txt
  i=0; while [ "$i" -lt "$W" ]; do awk -v w="$W" -v j="$i" 'NF && (NR-1)%w==j' "$SEEDS" > "$OUT/seeds.$i"; i=$((i+1)); done
  echo "census2: rendering $N dossiers ($W workers)"
  i=0; while [ "$i" -lt "$W" ]; do
    ( cd "$TREE" && CENSUS_OUT="$OUT/dumps" CENSUS_SEEDS="$OUT/seeds.$i" npx vitest run --config "$OUT/vitest.census2.config.mjs" > "$OUT/render.$i.log" 2>&1; echo "EXIT $?" >> "$OUT/render.$i.log" ) &
    i=$((i+1)); done
  wait
  bad=0; i=0; while [ "$i" -lt "$W" ]; do tail -1 "$OUT/render.$i.log" | grep -qx "EXIT 0" || bad=1; i=$((i+1)); done
  n=$(ls "$OUT/dumps" | wc -l)
  [ "$n" -eq "$N" ] && [ "$bad" -eq 0 ] || { echo "census2: render FAILED: $n of $N dumps; read $OUT/render.*.log"; exit 1; }
fi
T1=$(date +%s)
echo "census2: counting"
TREE=$TREE OUT=$OUT DUMPS="$OUT/dumps" CORPUS="$OUT/corpus.ndjson.gz" node "$P/count2.mjs"; rc=$?
[ "$rc" -eq 0 ] || { echo "census2: count FAILED (exit $rc)"; exit 1; }
[ "$COUNTONLY" -eq 1 ] && { echo "census2: counted (--count-only); births+render $((T1-T0))s"; exit 0; }
echo "census2: tracing writers"
TREE=$TREE OUT=$OUT node "$P/writers2.mjs"; rc=$?
[ "$rc" -eq 0 ] || { echo "census2: writer trace FAILED (exit $rc)"; exit 1; }
# the cold lists, for known-or-NEW: COLD_CUT / COLD_INC from the environment, else read from origin's round-3-cut lane
for pair in "COLD_CUT:ROUND-3-CUT.json" "COLD_INC:ROUND-3-CUT-INCREMENT.json"; do v=${pair%%:*}; f=${pair#*:}; eval cur=\${$v:-}
  if [ -z "$cur" ] && git -C "$TREE" show "origin/lane/round-3-cut-2026-11-13:docs/chair/2026-11-13/$f" > "$OUT/$f" 2>/dev/null; then eval "$v=\$OUT/\$f"; fi; done
[ -n "${COLD_CUT:-}" ] || echo "census2: no cold lists (git fetch origin lane/round-3-cut-2026-11-13 in the tree, or set COLD_CUT/COLD_INC): every line is 'unjoined'"
COLD_CUT=${COLD_CUT:-} COLD_INC=${COLD_INC:-} FILES=$FILES OUT=$OUT node "$P/report2.mjs"; rc=$?
[ "$rc" -eq 0 ] || { echo "census2: report FAILED (exit $rc)"; exit 1; }
T2=$(date +%s)
echo "census2: done; births+render $((T1-T0))s, count+trace $((T2-T1))s"
