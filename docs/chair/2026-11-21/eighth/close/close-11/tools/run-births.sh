#!/bin/sh
# run-births.sh <tree> <plan> <out> <measure>: births through the gate mutex; exit code appended to <out>.log
T=/tmp/claude-0/-home-user-settlement-engine/011d3ac5-e59f-5285-9e4b-6ba55a7f95bf/scratchpad/tools
until sh /home/user/settlement-engine/scripts/gate-mutex.sh --run -- node $T/births.mjs --tree="$1" --plan="$2" --out="$3" --measure="$4" --workers=4 >> "$3.log" 2>&1; rc=$?; [ $rc -ne 3 ]; do echo "mutex gave up; retry" >> "$3.log"; done
echo "EXIT $rc" >> "$3.log"
