#!/bin/sh
# runfiles.sh <tree> <out.json> <file>...: vitest run of exactly these files at <tree>, JSON report to <out.json>, exit to <out.json>.exit
T=$1; O=$2; shift 2; cd "$T" && npx vitest run --reporter=json --outputFile="$O" "$@" > "$O.log" 2>&1; echo $? > "$O.exit"
