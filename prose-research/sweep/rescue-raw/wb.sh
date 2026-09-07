#!/bin/zsh
# usage: wb.sh <name> <original-url>
n="$1"; u="$2"
ts=$(curl -s --max-time 40 "https://archive.org/wayback/available?url=$u" | python3 -c "
import json,sys
try:
  d=json.load(sys.stdin)['archived_snapshots'].get('closest')
  print(d['timestamp'] if d else '')
except Exception: print('')")
if [[ -z "$ts" ]]; then echo "$n NOSNAP $u"; exit 1; fi
./fetch.sh "$n" "https://web.archive.org/web/${ts}id_/$u" | tail -1
echo "$n snapshot=$ts"
