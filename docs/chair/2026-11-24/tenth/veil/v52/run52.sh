#!/bin/sh
# VEIL-52: ONE ORDERED RUNNER, started DETACHED (setsid nohup) so a tool's 30-minute background window cannot cut it (it cut
# n115, q52b and q52 at 22:06-22:07 UTC 2026-11-24). Each script holds the mutex per step. Log: /var/tmp/v52/log/run52.log.
H=$(cd "$(dirname "$0")" && pwd); L=/var/tmp/v52/log/run52.log
echo "run52 start $(date -u +%H:%M:%S) steps: $*" >> $L
for part in "$@"; do
  case $part in
    q52:*) sh $H/q52.sh $(echo ${part#q52:} | tr , ' ');;
    q52b:*) sh $H/q52b.sh $(echo ${part#q52b:} | tr , ' ');;
  esac
  echo "$part done rc=$? $(date -u +%H:%M:%S)" >> $L
done
echo "run52 END $(date -u +%H:%M:%S)" >> $L
