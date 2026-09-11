#!/bin/sh
# launch-soak.sh <tag> <years> <settlements> <seed> [lighting]
# Detached soak through the EXCLUSIVE gate mutex. TRUE_EXIT captured in-shell BEFORE any pipe.
set -u
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
DOCK="$SC/laneB6"
OUT="$SC/capacity-horizon"
TAG="$1"; YEARS="$2"; SETTLEMENTS="$3"; SEED="$4"; LIGHTING="${5:-}"
LOG="$OUT/soak-$TAG.log"
RECEIPT="$OUT/artifacts/$TAG.json"

if [ -n "$LIGHTING" ]; then
  set -- --years "$YEARS" --settlements "$SETTLEMENTS" --seed "$SEED" --lighting "$LIGHTING" --receipt "$RECEIPT"
else
  set -- --years "$YEARS" --settlements "$SETTLEMENTS" --seed "$SEED" --receipt "$RECEIPT"
fi

{
  echo "SOAK START $(date)"
  echo "ARGV: node --max-old-space-size=6144 scripts/audit/whole-world-soak.mjs $*"
  cd "$DOCK" || exit 97
  sh scripts/gate-mutex.sh --run -- \
    node --max-old-space-size=6144 scripts/audit/whole-world-soak.mjs "$@"
  STATUS=$?
  echo "TRUE_EXIT=$STATUS"
  echo "SOAK END $(date)"
} >> "$LOG" 2>&1
