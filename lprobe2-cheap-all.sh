#!/bin/sh
# lprobe2-cheap-all.sh — L-PROBE-2 (LGT-C5-PROBE2, PLAN POSITION 5) CHEAP arm at EVERY landing tip from the §899 control to the §904 tip,
# so each landing's same-seed movement is attributable (chair judgment 2026-09-06 21:20, vetoable: the plan names ONE control, the §899 tip;
# the §899 outputs died with the 09-05 reboot and are re-measured here at the same sha). Zero bytes into any tree: porcelain before == after or STOP.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
OUT=$SC/lprobe-out-905; mkdir -p $OUT
for pair in "899-control:laneLPROBEBASE" "900-desk:laneDESKTIP" "901-lightdark:laneLIGHTINT" "902-osr18:laneOSR18" "903-litdefault:laneLDEFAULT" "904-tip:laneLUIMAT"; do
  n=${pair%%:*}; d=${pair##*:}; T=$SC/$d
  P0=$(git -C $T status --porcelain -uall | wc -l | tr -d ' ')
  [ "$P0" = "0" ] || { echo "STOP: $d dirty ($P0) before the battery"; exit 8; }
  echo "=== $n @ $(git -C $T rev-parse --short HEAD) ($d) start $(date '+%H:%M:%S')"
  sh $SC/lprobe/run.sh $T $OUT/$n --cheap > $OUT/$n.run.log 2>&1; X=$?
  P1=$(git -C $T status --porcelain -uall | wc -l | tr -d ' ')
  echo "    TRUE_EXIT=$X porcelain_before=$P0 porcelain_after=$P1 end $(date '+%H:%M:%S')"; cat $OUT/$n/TRUE_EXITS.txt | tr '\n' ' '; echo
  [ "$P1" = "0" ] || { echo "STOP: $d dirty after the battery — a probe wrote into the tree: $(git -C $T status --porcelain -uall | tr '\n' ' ')"; exit 7; }
done
echo "ALL_DONE $(date '+%H:%M:%S')"
