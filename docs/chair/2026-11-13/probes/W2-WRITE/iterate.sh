#!/bin/sh
# iterate.sh <cause> : re-run the fast set and re-key count pins until nothing more moves (max 6 rounds)
SP=/tmp/claude-0/-home-user-settlement-engine/0e6c4fff-bdc8-5f8a-955c-3091ff150160/scratchpad
cd $SP/lane || exit 1
i=0; while [ $i -lt 6 ]; do
  npx vitest run --maxWorkers=2 $(cat $SP/edits/fastset.txt) > $SP/fast.it.log 2>&1
  out=$(python3 $SP/edits/pins.py $SP/fast.it.log "$1"; node $SP/edits/repin.mjs $SP/fast.it.log | grep -v "^repinned 0")
  echo "$out"
  [ -z "$out" ] && break
  i=$((i+1))
done
grep -E "^ FAIL " $SP/fast.it.log | sort -u | comm -23 - $SP/edits/base-reds.txt | cut -c1-220
grep -E "Tests  " $SP/fast.it.log
