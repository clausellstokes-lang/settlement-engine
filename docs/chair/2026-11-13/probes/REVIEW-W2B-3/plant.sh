#!/bin/sh
# REVIEW-W2B-3 item 4: one plant in a scratch worktree of the tip, its test files run, the plant restored.
#   sh plant.sh <worktree> <label> <file> <old-text-file> <new-text-file> <test file>...
# The old text must occur exactly once in <file>. Prints the failing titles and the files' exit; the worktree is restored
# with `git checkout -- <file>` (and checked clean) before it exits.
set -u
WT=$1; LABEL=$2; F=$3; OLD=$4; NEW=$5; shift 5
cd "$WT" || exit 2
python3 - "$F" "$OLD" "$NEW" <<'PY' || { echo "PLANT $LABEL: old text not found once"; exit 2; }
import sys
f, o, n = sys.argv[1], open(sys.argv[2]).read(), open(sys.argv[3]).read()
s = open(f).read()
if s.count(o) != 1: sys.exit(1)
open(f, 'w').write(s.replace(o, n))
PY
LOG=${TMPDIR:-/tmp}/plant.$LABEL.log
npx vitest run --maxWorkers=1 "$@" > "$LOG" 2>&1; RC=$?
echo "PLANT $LABEL exit $RC  ($(grep -E '^ +Tests ' "$LOG" | tail -1 | sed 's/^ *//'))"
grep -E '^ *(×|✗|FAIL) ' "$LOG" | sed 's/^ */   /' | sort -u | head -20
git checkout -- "$F"; [ -z "$(git status --porcelain -- "$F")" ] || echo "RESTORE FAILED $F"
