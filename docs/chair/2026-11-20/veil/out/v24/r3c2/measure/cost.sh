#!/bin/sh
# R3-CURE-2 (VR36): the v8245 rows (REVIEW-VEIL-8 cost8.sql; REVIEW-VEIL-7 deep-cost.sql), 3 rounds, chains r3c2_x211 | r3c2_base | r3c2_after
export PGHOST=/var/tmp/rv7 PGUSER=postgres; L=/var/tmp/v18/lib/docs/chair
for spec in "5 10000 0 1" "50 500 500 1"; do set -- $spec; for r in 1 2 3; do for d in r3c2_x211 r3c2_base r3c2_after; do
  echo "  h=$1 hit=$2 cold=$3 nl=$4 round $r :: $d | $(psql -qd $d -v houses=$1 -v hitrows=$2 -v coldrows=$3 -v namelen=$4 -f $L/2026-11-14/probes/REVIEW-VEIL-8/hand/cost8.sql 2>&1 | grep NOTICE | sed 's/.*NOTICE: *//' | tr '\n' ' ')"; done; done; done
for spec in "10 200 5000 false" "10 600 10000 false"; do set -- $spec; for r in 1 2 3; do for d in r3c2_x211 r3c2_base r3c2_after; do
  echo "  depth=$1 houses=$2 strings=$3 dm=$4 round $r :: $d | $(psql -qd $d -v depth=$1 -v houses=$2 -v strings=$3 -v dm=$4 -f $L/2026-11-13/probes/REVIEW-VEIL-7/hand/deep-cost.sql 2>&1 | grep NOTICE | sed 's/.*NOTICE: *//' | tr '\n' ' ')"; done; done; done
