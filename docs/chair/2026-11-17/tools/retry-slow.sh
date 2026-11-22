#!/bin/sh
# retry-slow.sh — after whole.sh: every file with a red that ran 19 s or more is run AGAIN, ALONE, on a quiet machine;
# names.final.txt is names.txt with those files' rows replaced by what the lone runs read (the sixth chair, 2026-11-17).
# usage: sh retry-slow.sh <worktree> <outdir>     (run it DIRECTLY as a background command; nothing else on the machine)
set -u
WT="$1"; OUT="$2"; HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$WT" || exit 2
ls "$OUT"/vitest-*-of-*.json >/dev/null 2>&1 || { echo "no shard reports in $OUT"; exit 2; }
node "$HERE/slowfails.mjs" "$OUT"/vitest-*-of-*.json > "$OUT/slow.files.txt"
mkdir -p "$OUT/retry"; rm -f "$OUT/retry"/*.json; n=0
while read -r f; do
  [ -n "$f" ] || continue
  n=$((n + 1))
  npx vitest run "$f" --reporter=json --outputFile="$OUT/retry/$n.json" > "$OUT/retry/$n.log" 2>&1
  echo "$f exit=$?" >> "$OUT/retry/exits.txt"
done < "$OUT/slow.files.txt"
if [ "$n" -gt 0 ]; then node "$HERE/failnames.mjs" "$OUT"/retry/*.json > "$OUT/retry.names.txt" 2> "$OUT/retry.counts.txt"; else : > "$OUT/retry.names.txt"; fi
# names.txt minus every row of a retried file, plus the lone runs' rows.
# (2026-11-17 19:40 UTC, found by CHECKS-2: with an EMPTY slow.files.txt awk's NR==FNR took names.txt for the first file and
# names.final.txt came out empty. The slow list is now handed to awk by -v file reading, and an empty list keeps every row.)
if [ -s "$OUT/slow.files.txt" ]; then
  awk -v SLOW="$OUT/slow.files.txt" 'BEGIN { while ((getline line < SLOW) > 0) slow[line]=1 } { split($0, a, " :: "); if (!(a[1] in slow)) print }' "$OUT/names.txt" > "$OUT/names.final.tmp"
else
  cp "$OUT/names.txt" "$OUT/names.final.tmp"
fi
cat "$OUT/retry.names.txt" >> "$OUT/names.final.tmp"; sort -u "$OUT/names.final.tmp" > "$OUT/names.final.txt"; rm -f "$OUT/names.final.tmp"
echo "retried $n files · names $(wc -l < "$OUT/names.txt") -> $(wc -l < "$OUT/names.final.txt")"
