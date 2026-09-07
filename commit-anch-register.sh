#!/bin/sh
# commit-anch-register.sh — after run-ratchet-anch.sh: commit the census-totals register car (the LAST car before the
# gate) in laneANCH2 as a CHAIR act, and seal the train. Refuses on anything but exactly the ratchet baseline changed.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneANCH2; LOG=$SC/ratchet-anch.log; REPO=/Users/cstokes/Desktop/settlement-engine
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2); [ "$TE" = "0" ] || { echo "⛔ ratchet TRUE_EXIT=$TE (from the LOG)"; exit 1; }
grep -q '^RATCHET_HEAD=272dbd2da' "$LOG" || { echo "⛔ the ratchet ran at a different head: $(grep '^RATCHET_HEAD=' "$LOG")"; exit 1; }
grep -qE 'SCOPE SENTINEL|update REFUSED' "$LOG" && { echo "⛔ sentinel/refusal in the ratchet log"; exit 1; }
grep -E '^MEASURED:|^PREDICTED' "$LOG" | cut -c1-160
P=$(git -C "$D" status --porcelain -uall)
if [ -z "$P" ]; then echo "NO REGISTER CAR NEEDED: the ratchet changed nothing (totals already current)"; git -C "$D" rev-parse --short HEAD; exit 0; fi
[ "$P" = " M scripts/.test-ratchet-baseline.json" ] || { echo "⛔ porcelain is not exactly the ratchet baseline: [$P]"; exit 1; }
TT=$(python3 -c "import json;d=json.load(open('$D/scripts/.test-ratchet-baseline.json'));print(d['totalTests'])")
TF=$(python3 -c "import json;d=json.load(open('$D/scripts/.test-ratchet-baseline.json'));print(d['totalFiles'])")
EN=$(python3 -c "import json;d=json.load(open('$D/scripts/.test-ratchet-baseline.json'));print(len(d['entries']))")
MA=$(python3 -c "import json;d=json.load(open('$D/scripts/.test-ratchet-baseline.json'));print(d['measuredAtSha'][:9])")
[ "$MA" = "272dbd2da" ] || { echo "⛔ measuredAtSha=$MA is not the composed tip 272dbd2da"; exit 1; }
[ "$TF" = "2468" ] || { echo "⛔ totalFiles=$TF moved (predicted UNCHANGED 2468) — a test file was added; STOP and look"; exit 1; }
[ "$EN" = "6" ] || { echo "⛔ entries=$EN (predicted 6)"; exit 1; }
echo "register: totalTests 31489 -> $TT · totalFiles $TF · entries $EN · measuredAt $MA"
cat > "$SC/msg-anch-register.txt" <<MSG
ANCHORS register (last car): the census totals re-freeze at the composed tip — totalTests 31489 -> $TT, totalFiles $TF unchanged, entries $EN

The three ANCHORS cars were replayed from a2a0d2320 onto the clamp landing df7cdd37e with zero file overlap
(clamp 21 files, anchors 8, intersection 0). They add two tests to tests/domain/rumorFallbackPhrasePools.test.js
(the lane counted 588 -> 590) and no test file, so totalFiles was predicted UNCHANGED and totalTests was refused in
advance as a figure: this run, scripts/check-test-ratchet.mjs --update under the gate mutex, is the derivation.
Lighting: the probe at 272dbd2da reads 2521/371/2150/23184/6214, identical to the register the clamp consist took
at ff9b7a53c, so no lighting act is owed (the two new tests sit under describe.each and are census-invisible).

Seat: Fable 5.1 — validated

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
cd "$D"; git add scripts/.test-ratchet-baseline.json; git commit -q -F "$SC/msg-anch-register.txt"
NEW=$(git rev-parse HEAD); P2=$(git status --porcelain -uall); [ -z "$P2" ] || { echo "⛔ porcelain after commit: [$P2]"; exit 1; }
[ "$(git log -1 --format=%B | grep -cE '^Seat: ')" = "1" ] || { echo "⛔ seat trailer count != 1"; exit 1; }
[ "$(git diff --name-only HEAD~1 HEAD)" = "scripts/.test-ratchet-baseline.json" ] || { echo "⛔ the car touched more than the baseline (hook?)"; exit 1; }
git -C "$REPO" update-ref refs/preserve/train-anchors-replay2-2026-09-05 "$NEW"
echo "REGISTER CAR $(git rev-parse --short "$NEW") committed; cars over df7cdd37e=$(git rev-list --count df7cdd37e..HEAD); sealed train-anchors-replay2-2026-09-05"
