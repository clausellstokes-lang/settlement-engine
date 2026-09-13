#!/bin/sh
# commit-totals.sh <dock> <ratchet-log> <expected-entries> <expected-totalFiles> <seal-name> <base-sha>
# After run-ratchet-N.sh: commit the census-totals register as the LAST car (a chair act), guarded on the log's TRUE_EXIT,
# the predicted entries/totalFiles, the measuredAtSha being the dock's HEAD at measurement, and porcelain being exactly the
# baseline file. Seals the train. Refuses on anything else. POSIX sh.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
D=$1; LOG=$2; EXP_ENTRIES=$3; EXP_FILES=$4; SEAL=$5; BASE=$6; REPO=/Users/cstokes/Desktop/settlement-engine
[ -d "$D" ] && [ -s "$LOG" ] && [ -n "$SEAL" ] && [ -n "$BASE" ] || { echo "usage: <dock> <log> <entries> <totalFiles> <seal> <base>"; exit 9; }
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2); [ "$TE" = "0" ] || { echo "⛔ ratchet TRUE_EXIT=$TE (from the LOG)"; exit 1; }
grep -qE 'SCOPE SENTINEL|update REFUSED' "$LOG" && { echo "⛔ sentinel/refusal in the ratchet log"; exit 1; }
RH=$(grep -oE '^RATCHET_HEAD=[0-9a-f]+' "$LOG" | cut -d= -f2); cd "$D"
[ "$RH" = "$(git rev-parse HEAD)" ] || { echo "⛔ the ratchet ran at $RH but the dock HEAD is $(git rev-parse HEAD)"; exit 1; }
grep -E '^MEASURED:|^PREDICTED' "$LOG" | cut -c1-200
P=$(git status --porcelain -uall)
if [ -z "$P" ]; then echo "NO TOTALS CAR NEEDED: the ratchet changed nothing"; exit 0; fi
[ "$P" = " M scripts/.test-ratchet-baseline.json" ] || { echo "⛔ porcelain is not exactly the ratchet baseline: [$P]"; exit 1; }
J=scripts/.test-ratchet-baseline.json
TT=$(python3 -c "import json;print(json.load(open('$J'))['totalTests'])"); TF=$(python3 -c "import json;print(json.load(open('$J'))['totalFiles'])"); EN=$(python3 -c "import json;print(len(json.load(open('$J'))['entries']))"); MA=$(python3 -c "import json;print(json.load(open('$J'))['measuredAtSha'])")
[ "$MA" = "$RH" ] || { echo "⛔ measuredAtSha=$MA is not the measured head $RH"; exit 1; }
[ "$TF" = "$EXP_FILES" ] || { echo "⛔ totalFiles=$TF (predicted $EXP_FILES) — a test file was added or lost; STOP and look"; exit 1; }
[ "$EN" = "$EXP_ENTRIES" ] || { echo "⛔ entries=$EN (predicted $EXP_ENTRIES) — the known-failure census moved differently than derived; STOP and look:"; python3 -c "import json;[print('   ',k) for k in json.load(open('$J'))['entries']]"; exit 1; }
BT=$(git show "${BASE}:${J}" | python3 -c "import json,sys;print(json.load(sys.stdin)['totalTests'])"); BF=$(git show "${BASE}:${J}" | python3 -c "import json,sys;print(json.load(sys.stdin)['totalFiles'])"); if [ "$BF" = "$TF" ]; then TFW="totalFiles $TF unchanged"; else TFW="totalFiles $BF -> $TF"; fi
echo "totals: totalTests $BT -> $TT · totalFiles $TF · entries $EN · measuredAt $(echo $MA | cut -c1-9)"
cat > "$SC/msg-totals.txt" <<MSG
Register (last car): the census totals re-freeze at the composed tip — totalTests $BT -> $TT, $TFW, entries $EN

Taken after every content and register car in the lineage that lands (the last car before the gate), under the gate
mutex, with totalFiles and entries predicted in writing and totalTests refused as a figure: this run is its derivation.

Seat: Fable 5.1 — validated

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
git add "$J"; git commit -q -F "$SC/msg-totals.txt"
[ -z "$(git status --porcelain -uall)" ] || { echo "⛔ porcelain after commit"; exit 1; }
[ "$(git diff --name-only HEAD~1 HEAD)" = "$J" ] || { echo "⛔ the car touched more than the baseline (hook?)"; exit 1; }
git -C "$REPO" update-ref "refs/preserve/$SEAL" "$(git rev-parse HEAD)"
echo "TOTALS CAR $(git rev-parse --short HEAD) committed; cars over $(echo $BASE | cut -c1-9)=$(git rev-list --count "$BASE"..HEAD); sealed $SEAL"
