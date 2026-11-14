#!/bin/sh
# sh sync.sh — the probe tree's src becomes the lane's working src, then its density law is instrumented
S=/tmp/claude-0/-home-user-settlement-engine/2e03cf9c-b2bb-5223-bf3b-aa2451a37213/scratchpad
rm -rf $S/ptip/src && cp -r $S/lane/src $S/ptip/src && node $S/probes/instrument.mjs $S/ptip > /dev/null && echo synced
