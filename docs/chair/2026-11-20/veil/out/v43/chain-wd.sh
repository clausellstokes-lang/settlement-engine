#!/bin/sh
# VEIL-43 unit (1)(a): chain B's whole-document comparer (L1 only) on the gate's 140 towns of the JOINED tree, value for value (MEAS_BIJ=0).
# Run as: sh scripts/gate-mutex.sh --run -- sh <this>   (from /home/user/join43), after chain0.
export PGHOST=/var/tmp/rv7 PGUSER=postgres MEAS_BIJ=0
O=/var/tmp/v18/out/v43/wd-towns; mkdir -p $O
sh /home/user/settlement-engine/docs/chair/2026-11-20/veil/out/v43/wd/wdrun.sh /home/user/join43 $O v28tpl towns > $O/run.txt 2>&1; echo "wd-towns rc=$? $(date -u +%H:%M:%S)" >> $O/run.txt
