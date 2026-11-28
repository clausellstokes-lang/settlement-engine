#!/bin/sh
# gov.sh <tree> <out.json> <listfile> : run the listed test files in the tree, json reporter, exit recorded
cd "$1" && npx vitest run --maxWorkers=2 --reporter=json --outputFile="$2" $(cat "$3") > "$2.log" 2>&1; echo "EXIT $?" >> "$2.log"
