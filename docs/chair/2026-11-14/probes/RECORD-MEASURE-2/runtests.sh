#!/bin/sh
# <tree> <out.json> <files...>: vitest json over the files, the tree's own config; the exit code is written beside the json
T=$1; O=$2; shift 2
cd "$T" && npx vitest run "$@" --reporter=json --outputFile="$O" > "$O.log" 2>&1; echo "EXIT $?" >> "$O.log"
