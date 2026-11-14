#!/bin/sh
S=/tmp/claude-0/-home-user-settlement-engine/2e03cf9c-b2bb-5223-bf3b-aa2451a37213/scratchpad
for i in 0 1 2 3; do node $S/probes/text.mjs $1 RS $i 4 $S/dumps/$2.text.$i.jsonl > $S/dumps/$2.text.$i.log 2>&1 & done
wait; cat $S/dumps/$2.text.[0-3].jsonl > $S/dumps/$2.text.jsonl; rm $S/dumps/$2.text.[0-3].jsonl; cat $S/dumps/$2.text.[0-3].log
