#!/bin/sh
# (3) RIVAL's OWED ARMS, ONCE (the chair, 23:49; rides only if every one passes its FIRST run): VEIL-40's runner UNCHANGED at
#   61a99a90d (/home/user/wt/r5rival, its own tree; node_modules linked, package-lock byte-equal), `run.sh <tree> <logdir> chains|arms|
#   after|cost`, each heavy step through the gate mutex inside the runner (so it is NOT wrapped in mx here). Logs /var/tmp/v51/out/rival/.
#   Run as: sh rival.sh
step_rival() { for w in chains arms after cost; do sh /home/user/wt/r5rival/docs/chair/2026-11-20/veil/out/v40/r5drival/run.sh /home/user/wt/r5rival /var/tmp/v51/out/rival $w > /var/tmp/v51/out/rival-$w.txt 2>&1; st rival-$w $?; done; }
O=/var/tmp/v51/out/u4; L=$O/u4.log; mkdir -p /var/tmp/v51/out/rival
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
step_rival
echo "rival END $(date -u +%H:%M:%S)" >> $L
