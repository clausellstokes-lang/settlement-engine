#!/bin/sh
# iterate.sh <cause> : the fast set, then pins.py (count pins re-keyed with the cause) and repin.mjs (the shift
# register), to a fixed point (max 6 rounds); prints the reds beyond base-reds.txt. Needs LANE (the worktree) and
# OUT (a scratch dir outside the repository). The helpers are read from this script's own directory.
H=$(cd "$(dirname "$0")" && pwd); : "${LANE:?set LANE}"; : "${OUT:?set OUT}"
cd "$LANE" || exit 1
i=0; while [ $i -lt 6 ]; do
  npx vitest run --maxWorkers=4 $(cat "$H/fastset.txt") > "$OUT/fast.it.log" 2>&1
  out=$(python3 "$H/pins.py" "$OUT/fast.it.log" "$1"; node "$H/repin.mjs" "$OUT/fast.it.log" | grep -v "^repinned 0")
  echo "$out"; [ -z "$out" ] && break; i=$((i+1))
done
grep -E "^ FAIL " "$OUT/fast.it.log" | sort -u | comm -23 - "$H/base-reds.txt" | cut -c1-220
grep -E "Tests  " "$OUT/fast.it.log"
