#!/bin/sh
# lprobe2-full-904.sh — L-PROBE-2 FULL battery at the §904 tip 6582958ce (laneLUIMAT): the cheap steps again, then (a) the golden control
# + the bit-level dormancy arm against the §899 control tree (laneLPROBEBASE @ 38474a59e), (b) certification of all seven presets
# (5 y × 4 settlements through --preset), (h) the class-C listing diff base 38474a59e vs tip. Quiet-window law + gate mutex inside the kit.
# Zero bytes into either tree: porcelain before == after or the receipt says so. Chair, 2026-09-06 21:25.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
T=$SC/laneLUIMAT; B=$SC/laneLPROBEBASE; OUT=$SC/lprobe-out-905/904-tip-full
P0=$(git -C $T status --porcelain -uall | wc -l | tr -d ' '); Q0=$(git -C $B status --porcelain -uall | wc -l | tr -d ' ')
echo "FULL start $(date '+%H:%M:%S') tip=$(git -C $T rev-parse --short HEAD) base=$(git -C $B rev-parse --short HEAD) porcelain tip=$P0 base=$Q0 load=$(uptime | sed 's/.*averages*: //')"
sh $SC/lprobe/run.sh $T $OUT --base $B --base-ref 38474a59e --soak-years 5 --settlements 4 > $OUT.run.log 2>&1; X=$?
P1=$(git -C $T status --porcelain -uall | wc -l | tr -d ' '); Q1=$(git -C $B status --porcelain -uall | wc -l | tr -d ' ')
echo "FULL end $(date '+%H:%M:%S') TRUE_EXIT=$X porcelain tip $P0->$P1 base $Q0->$Q1"
echo "--- TRUE_EXITS:"; cat $OUT/TRUE_EXITS.txt; for f in golden certify listing.base listing.tip; do [ -f $OUT/TRUE_EXITS.$f.txt ] && { echo "--- $f:"; cat $OUT/TRUE_EXITS.$f.txt; }; done
echo "FULL_DONE"
