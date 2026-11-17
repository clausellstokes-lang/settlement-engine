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
# names.txt minus every row of a retried file, plus the lone runs' rows
awk 'NR==FNR { slow[$0]=1; next } { split($0, a, " :: "); if (!(a[1] in slow)) print }' "$OUT/slow.files.txt" "$OUT/names.txt" > "$OUT/names.final.tmp"
cat "$OUT/retry.names.txt" >> "$OUT/names.final.tmp"; sort -u "$OUT/names.final.tmp" > "$OUT/names.final.txt"; rm -f "$OUT/names.final.tmp"
echo "retried $n files · names $(wc -l < "$OUT/names.txt") -> $(wc -l < "$OUT/names.final.txt")"
