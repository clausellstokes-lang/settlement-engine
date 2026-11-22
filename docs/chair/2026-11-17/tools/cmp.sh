#!/bin/sh
# cmp.sh — two whole checks compared BY NAME (the sixth chair, 2026-11-17).
# Usage: sh cmp.sh <base outdir> <tip outdir>     Prints: steps whose exit differs; names red at the tip only; names
# red at the base only. "Red at the tip and not at the base" is the landing's own.
B="$1"; T="$2"
echo "== steps whose exit differs (step base tip) =="
awk -F'\t' 'NR==FNR { b[$1]=$2; next } ($1 in b) && b[$1]!=$2 { print $1, b[$1], $2 }' "$B/summary.tsv" "$T/summary.tsv"
echo "== red at the tip only: $(comm -13 "$B/names.txt" "$T/names.txt" | wc -l) =="
comm -13 "$B/names.txt" "$T/names.txt"
echo "== red at the base only: $(comm -23 "$B/names.txt" "$T/names.txt" | wc -l) =="
comm -23 "$B/names.txt" "$T/names.txt"
echo "== counts: base $(cat "$B/counts.txt") | tip $(cat "$T/counts.txt") =="
