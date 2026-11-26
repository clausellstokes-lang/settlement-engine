#!/bin/sh
# forks.sh <tree> <tag>: four forks of the measure; waits for all
H=/tmp/claude-0/-home-user-settlement-engine/011d3ac5-e59f-5285-9e4b-6ba55a7f95bf/scratchpad/via; TREE=$1; TAG=$2
for w in 0 1 2 3; do (cd $TREE && M_TREE=$TREE M_PLAN=$H/plan.$w.json M_OUT=$H/$TAG.$w.jsonl npx vitest run --config $H/vt.$TAG.config.mjs > $H/$TAG.$w.log 2>&1) & done; wait
