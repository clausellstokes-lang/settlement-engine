#!/bin/sh
# quiet-window sampler: load-1 and vitest worker count, one sample per minute
LOG="$1"
N="${2:-20}"
i=1
while [ "$i" -le "$N" ]; do
  L=$(uptime | sed 's/.*load averages*: //' | tr -d ',')
  V=$(pgrep -f 'vitest' | wc -l | tr -d ' ')
  G=$(pgrep -fl 'gate-mutex' | wc -l | tr -d ' ')
  printf 'SAMPLE %2d | %s | load: { %s } | vitest: %s | gate-mutex procs: %s\n' "$i" "$(date)" "$L" "$V" "$G" >> "$LOG"
  i=$((i+1))
  [ "$i" -le "$N" ] && sleep 60
done
echo "SAMPLER DONE $(date)" >> "$LOG"
