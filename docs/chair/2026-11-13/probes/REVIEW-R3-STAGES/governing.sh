set -u
for pair in "a-base govA" "a-tip govA" "c-base govC" "c-tip govC"; do set -- $pair; cd /tmp/claude-0/-home-user-settlement-engine/373f2d75-fbb1-5eac-bc76-72adaf28ec43/scratchpad/wt/$1; L=$(cat /tmp/claude-0/-home-user-settlement-engine/373f2d75-fbb1-5eac-bc76-72adaf28ec43/scratchpad/$2.txt | while read f; do [ -f "$f" ] && echo "$f"; done | tr '\n' ' ')
  npx vitest run $L --maxWorkers=3 --reporter=json --outputFile=/tmp/claude-0/-home-user-settlement-engine/373f2d75-fbb1-5eac-bc76-72adaf28ec43/scratchpad/gov-$1.json > /tmp/claude-0/-home-user-settlement-engine/373f2d75-fbb1-5eac-bc76-72adaf28ec43/scratchpad/gov-$1.log 2>&1; echo "$1 EXIT $?"; done
echo GOVDONE
