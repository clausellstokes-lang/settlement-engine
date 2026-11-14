#!/bin/sh
# birth720.sh <tree> <out-dir> — the review's 720 births (the census's births.mjs), records only
mkdir -p $2; TREE=$(cd $1 && pwd) OUT=$(cd $2 && pwd) node /tmp/claude-0/-home-user-settlement-engine/2c9c36b3-4f07-553f-9d7c-74f45bdf3360/scratchpad/census/docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/births.mjs
