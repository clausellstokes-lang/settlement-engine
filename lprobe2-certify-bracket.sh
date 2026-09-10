#!/bin/sh
# lprobe2-certify-bracket.sh — after the tip battery reports FULL_DONE: certify all seven presets at the two tips that BRACKET the lit
# default (fd36f0298 = §902 in laneOSR18, dd5f13218 = §903 in laneLDEFAULT), reading each tip's own f-birth-fixtures.json from the cheap run,
# so the lit default's effect on the certification rows is MEASURED (DORMANT_BY_CONFIG → ALIVE per subsystem), not argued. Then remove
# HOLD-VITEST (the ANCHOR-905 lane's proofs wait on it). Zero bytes into either tree. Chair, 2026-09-06 21:40.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
n=0; while ! grep -q '^FULL_DONE' $SC/lprobe2-full-904.log 2>/dev/null; do sleep 30; n=$((n+1)); [ $n -gt 120 ] && { echo "GAVE UP waiting for FULL_DONE after 60 min"; exit 5; }; done
echo "tip battery FULL_DONE seen $(date '+%H:%M:%S')"
for pair in "902-osr18:laneOSR18" "903-litdefault:laneLDEFAULT"; do
  t=${pair%%:*}; d=${pair##*:}; T=$SC/$d; OUT=$SC/lprobe-out-905/$t
  P0=$(git -C $T status --porcelain -uall | wc -l | tr -d ' ')
  echo "=== certify $t @ $(git -C $T rev-parse --short HEAD) start $(date '+%H:%M:%S') porcelain=$P0"
  sh $SC/lprobe/certify.sh $T $OUT --years 5 --settlements 4 > $OUT/certify.run.log 2>&1; X=$?
  P1=$(git -C $T status --porcelain -uall | wc -l | tr -d ' ')
  echo "    CERTIFY_EXIT=$X porcelain $P0->$P1 end $(date '+%H:%M:%S')"; tr '\n' ' ' < $OUT/TRUE_EXITS.certify.txt; echo
done
rm -f $SC/HOLD-VITEST && echo "HOLD-VITEST removed $(date '+%H:%M:%S')"
echo "BRACKET_DONE"
