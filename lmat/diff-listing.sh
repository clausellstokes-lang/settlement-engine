#!/bin/sh
A="$1"; B="$2"
# strip hashes from filenames to compare logical chunks
norm() { sed -E 's#(dist/assets/[^ /]*)-[A-Za-z0-9_-]{8}\.(js|css)#\1.\2#' ; }
echo "--- counts ---"
echo "A=$(wc -l < "$A") B=$(wc -l < "$B")"
echo "--- files present in B not A (by normalized name) ---"
comm -13 <(cut -f3 "$A" | norm | LC_ALL=C sort -u) <(cut -f3 "$B" | norm | LC_ALL=C sort -u)
echo "--- files present in A not B ---"
comm -23 <(cut -f3 "$A" | norm | LC_ALL=C sort -u) <(cut -f3 "$B" | norm | LC_ALL=C sort -u)
echo "--- content-hash CHANGED (normalized name, md5 differs) ---"
join -t'	' -j1 \
  <(awk -F'\t' '{n=$3; gsub(/-[A-Za-z0-9_-]{8}\.js$/,".js",n); gsub(/-[A-Za-z0-9_-]{8}\.css$/,".css",n); print n"\t"$1"\t"$2}' "$A" | LC_ALL=C sort -u -t'	' -k1,1) \
  <(awk -F'\t' '{n=$3; gsub(/-[A-Za-z0-9_-]{8}\.js$/,".js",n); gsub(/-[A-Za-z0-9_-]{8}\.css$/,".css",n); print n"\t"$1"\t"$2}' "$B" | LC_ALL=C sort -u -t'	' -k1,1) \
  | awk -F'\t' '$3!=$5 {printf "%s\tbytes %s -> %s (%+d)\n", $1, $2, $4, $4-$2}'
