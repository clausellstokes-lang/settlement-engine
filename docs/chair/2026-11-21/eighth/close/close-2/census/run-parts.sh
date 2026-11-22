#!/bin/sh
# usage: run-parts.sh <tree> <tag>   (CLOSE-1 unit 4: the whole suite in parts, each through the mutex, names by JSON)
T="$1"; TAG="$2"; O=/tmp/claude-0/-home-user-settlement-engine/42f6469f-2193-55ee-b1bb-cd23b1d653f1/scratchpad/u4/$TAG
M=/home/user/settlement-engine/scripts/gate-mutex.sh
mkdir -p "$O"; cd "$T" || exit 2
for v in GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR GIT_OBJECT_DIRECTORY; do unset $v; done
echo "start $(date -u +%FT%TZ) $(git rev-parse --short HEAD)" > "$O/progress.txt"
XENV=; part() { name="$1"; shift; sh "$M" --run -- timeout 10800 env $XENV npx vitest run "$@" --maxWorkers=3 --reporter=dot --reporter=json --outputFile="$O/$name.json" > "$O/$name.log" 2>&1; echo "exit=$?" >> "$O/$name.log"; echo "$name $(date -u +%T) $(tail -1 $O/$name.log)" >> "$O/progress.txt"; }
part gen tests/generators tests/data tests/property
part domain tests/domain
sh "$M" --run -- timeout 1800 npm run build > "$O/build.log" 2>&1; echo "exit=$?" >> "$O/build.log"; echo "build $(date -u +%T) $(tail -1 $O/build.log)" >> "$O/progress.txt"
XENV=VERIFY_DIST=1 part build tests/build; XENV=
part lint tests/lint
part ui tests/components tests/ui tests/pdf tests/store tests/lib
REST=$(ls -d tests/*/ | sed 's#/$##' | grep -vxE 'tests/(lint|build|domain|generators|data|property|components|ui|pdf|store|lib|fixtures|setup|helpers)')
part rest $REST $(ls tests/*.test.* 2>/dev/null)
echo "done $(date -u +%FT%TZ)" >> "$O/progress.txt"
