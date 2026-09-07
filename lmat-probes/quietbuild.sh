#!/bin/sh
# quietbuild.sh <dock> <label> <outdir>
D="$1"; LABEL="$2"; OUT="$3"
LOG="$OUT/build-$LABEL.log"
: > "$LOG"
echo "=== quiet-window sampling start $(date '+%Y-%m-%d %H:%M:%S %Z') ===" >> "$LOG"
i=1
while [ $i -le 3 ]; do
  L1=$(uptime | sed 's/.*load averages*: *//' | awk '{print $1}' | tr -d ',')
  V=$(pgrep -f vitest | wc -l | tr -d ' ')
  echo "sample $i $(date '+%H:%M:%S') load1=$L1 vitest=$V" >> "$LOG"
  OK=$(awk -v l="$L1" 'BEGIN{print (l<4.0)?1:0}')
  if [ "$OK" != "1" ] || [ "$V" != "0" ]; then
    echo "NOT QUIET at sample $i — restarting the three-sample window" >> "$LOG"
    i=1
  else
    i=$((i+1))
  fi
  [ $i -le 3 ] && sleep 60
done
echo "=== QUIET WINDOW CONFIRMED $(date '+%Y-%m-%d %H:%M:%S %Z') ===" >> "$LOG"
cd "$D" || exit 9
sh scripts/gate-mutex.sh --run -- npm run build >> "$LOG" 2>&1
EX=$?
echo "BUILD_EXIT=$EX" >> "$LOG"
echo "=== done $(date '+%Y-%m-%d %H:%M:%S %Z') ===" >> "$LOG"
