#!/bin/zsh
# shoot-bounded.sh <in.svg> <out.png> [px] [minbytes] [seconds]
#
# ⛔⛔ J-REG4-11, MADE MECHANICAL. REG-4 measured headless Chrome writing a 708 KB screenshot and
# then STAYING ALIVE for 5 min 40 s with `execFileSync` blocked on it and four more Chromes queued
# behind. `reg0/shoot.sh` has no bound of its own, so a lane that shells it inherits the hang.
#
# THE TWO LAWS THIS ENCODES, both of them the lane's own recorded ones:
#   1. THE PNG'S EXISTENCE (and its byte floor) IS THE VERDICT — never the exit status.
#   2. THE WALL CLOCK IS BOUNDED. Chrome is killed at the deadline whether or not it has finished
#      exiting, and the file is then judged. A shot that wrote its PNG and hung is a PASS.
#
# There is no `timeout(1)` on this machine (checked), so the bound is a poll loop plus TERM/KILL.
set -u
IN="$1"; OUT="$2"; PX="${3:-2200}"; MIN="${4:-400000}"; SECS="${5:-75}"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ABS() { /usr/bin/env node -e 'process.stdout.write(require("path").resolve(process.argv[1]))' "$1"; }
IN="$(ABS "$IN")"; OUT="$(ABS "$OUT")"
TMP="$(dirname "$OUT")/.full-$(basename "$IN")"
rm -f "$OUT"
/usr/bin/env node -e '
const fs=require("fs");
let s=fs.readFileSync(process.argv[1],"utf8");
s=s.replace(/<svg([^>]*)>/, (m,a)=>"<svg"+a.replace(/\s(width|height)="[^"]*"/g,"")+">");
fs.writeFileSync(process.argv[2],s);
' "$IN" "$TMP" || { echo "SHOOT_FAIL prep"; exit 1; }

"$CH" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=1 --screenshot="$OUT" --window-size="$PX,$PX" \
  --default-background-color=FFFFFFFF "file://$TMP" >/dev/null 2>&1 &
PID=$!
i=0
while [ $i -lt $SECS ]; do
  if ! kill -0 $PID 2>/dev/null; then break; fi
  sleep 1
  i=$((i+1))
done
KILLED=0
if kill -0 $PID 2>/dev/null; then kill -TERM $PID 2>/dev/null; sleep 2; kill -KILL $PID 2>/dev/null; KILLED=1; fi
wait $PID 2>/dev/null
rm -f "$TMP"

# ⭐ THE VERDICT IS THE FILE, and it is read AFTER the kill.
if [ ! -s "$OUT" ]; then echo "SHOOT_FAIL no-output killed=$KILLED after=${i}s $OUT"; exit 1; fi
SZ=$(stat -f %z "$OUT")
if [ "$SZ" -lt "$MIN" ]; then echo "SHOOT_SUSPECT bytes=$SZ < floor=$MIN killed=$KILLED after=${i}s $OUT"; exit 2; fi
echo "SHOOT_OK bytes=$SZ killed=$KILLED after=${i}s $OUT"
