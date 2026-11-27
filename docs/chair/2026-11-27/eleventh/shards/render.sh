#!/bin/sh
# usage: render.sh LABEL K N SHA REF TARGETS  -> prints the prompt; OUT is lane/shard-<label>-<k>of<n>-2026-11-27
T=/home/user/wt/chair/docs/chair/2026-11-27/eleventh/prompts/TEMPLATE-SHARD-RUNNER.txt
LABEL="$1"; K="$2"; N="$3"; SHA="$4"; REF="$5"; TARGETS="$6"
L=$(printf '%s' "$LABEL" | tr 'A-Z' 'a-z')
OUT="lane/shard-$L-${K}of${N}-2026-11-27"
SHORT=$(printf '%s' "$SHA" | cut -c1-10)
sed -e "s|@@LABEL@@|$LABEL|g" -e "s|@@K@@|$K|g" -e "s|@@N@@|$N|g" -e "s|@@SHA@@|$SHA|g" -e "s|@@REF@@|$REF|g" -e "s|@@OUT@@|$OUT|g" -e "s|@@SHORT@@|$SHORT|g" -e "s|@@TARGETS@@|$TARGETS|g" "$T"
