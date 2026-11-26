#!/bin/sh
# one mutex hold: the I-13 census and the births (keys + refs) on base and tip, plans C and V
G=/tmp/claude-0/-home-user-settlement-engine/f9f37e55-dc9e-512d-9953-f1c7274d335f/scratchpad/gi13
T=/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/tools
M=/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/goals-i13
TIP=/tmp/claude-0/-home-user-settlement-engine/f9f37e55-dc9e-512d-9953-f1c7274d335f/scratchpad/gi13/tip
st=0
for P in C V; do
  for W in base tip; do
    if [ $W = base ]; then TR=$G/base; else TR=$TIP; fi
    node $G/tools/gi13-run.mjs --tree=$TR --plan=$G/plan-$P.json --out=$G/out/gi13-$W-$P.jsonl --workers=4 || st=1
    node $T/births.mjs --tree=$TR --plan=$G/plan-$P.json --out=$G/out/births-$W-$P.jsonl --measure=$G/tools/keys-refs.mjs --workers=4 || st=1
  done
done
exit $st
