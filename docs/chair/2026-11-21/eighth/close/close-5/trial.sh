#!/bin/sh
# usage: trial.sh <lit tree> <base the trial is cut from> : CLOSE-5's Q8 trial (the chair's ruling of 04:08 and 04:17 UTC), each run through the mutex
# (1) the 83 anchor files + every test file changed 244fa84ef..<base> (lit); (2) tests/lint whole (lit); (3) the two near their budgets, ALONE, one at a time
T="$1"; BASE="$2"; O=/tmp/claude-0/-home-user-settlement-engine/c4c5e7a5-54f3-5364-a337-92ee45f01117/scratchpad/q8
M=/home/user/settlement-engine/scripts/gate-mutex.sh; A=/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-5/ANCHORS-BY-FILE.tsv
mkdir -p "$O"; cd "$T" || exit 2
for v in GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR GIT_OBJECT_DIRECTORY; do unset $v; done
echo "start $(date -u +%FT%TZ) $(git rev-parse --short HEAD) base $BASE" > "$O/progress.txt"
tail -n +2 "$A" | cut -f2 | sort -u > "$O/files-anchors.txt"
git diff --name-only --diff-filter=AM 244fa84ef "$BASE" -- tests | grep -E '\.test\.(js|jsx|mjs|ts)$' | grep -v '^tests/lint/' | sort -u > "$O/files-landed.txt"
sort -u "$O/files-anchors.txt" "$O/files-landed.txt" | while read f; do [ -f "$f" ] && echo "$f"; done > "$O/files-run.txt"
echo "files: anchors $(wc -l < "$O/files-anchors.txt"), landed $(wc -l < "$O/files-landed.txt"), run $(wc -l < "$O/files-run.txt")" >> "$O/progress.txt"
part() { name="$1"; shift; sh "$M" --run -- timeout 7200 npx vitest run "$@" --reporter=dot --reporter=json --outputFile="$O/$name.json" > "$O/$name.log" 2>&1; echo "exit=$?" >> "$O/$name.log"; echo "$name $(date -u +%T) $(tail -1 "$O/$name.log")" >> "$O/progress.txt"; }
part anchors $(cat "$O/files-run.txt") --maxWorkers=3
part lint tests/lint --maxWorkers=3
part alone-metropolisTailedRoll tests/generators/metropolisTailedRoll.test.js --maxWorkers=1
part alone-espionageFence1 tests/property/espionageDormancyFence.test.js -t 'FENCE 1 \(REPLACED\)' --maxWorkers=1
echo "done $(date -u +%FT%TZ)" >> "$O/progress.txt"
