#!/bin/sh
until grep -q XQUEUE-DONE /tmp/claude-0/-home-user-settlement-engine/264f2cd3-2300-5be6-af7e-6509ebfae300/scratchpad/xqueue.out; do sleep 30; done
for c in C V; do /tmp/claude-0/-home-user-settlement-engine/264f2cd3-2300-5be6-af7e-6509ebfae300/scratchpad/run-node.sh food-d447-$c node /home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-7/mirror/food-of.mjs /home/user/wt/lit /home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-7/before-after/plans/plan-$c.json /home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-7/before-after/food/food-d447-$c.jsonl; echo "food-d447-$c rc=$? $(date +%T)"; done
echo TAILQ-DONE
