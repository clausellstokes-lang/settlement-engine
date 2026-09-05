#!/bin/sh
# commit-golden-898.sh — after golden-rerecord-898.sh: commit the re-recorded generator golden master as the DECLARED shift's
# fixture car. Guarded on the wrapper log's TRUE_EXIT, the parsed row count, and porcelain being exactly the golden fixture(s).
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/lanePROSE2; W=$SC/golden-rerecord-898.wrapper.log; cd "$D"
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$W" | tail -1 | cut -d= -f2); [ "$TE" = "0" ] || { echo "⛔ golden door TRUE_EXIT=$TE — read $SC/golden-rerecord-898.log"; exit 1; }
GR=$(grep -oE 'GOLDEN_ROWS: total=[0-9]+ moved=[0-9]+' "$W" | tail -1 | grep -oE 'moved=[0-9]+' | cut -d= -f2); GT=$(grep -oE 'GOLDEN_ROWS: total=[0-9]+' "$W" | tail -1 | grep -oE '[0-9]+$')
[ -n "$GR" ] && [ -n "$GT" ] || { echo "⛔ row count not parsed from the wrapper log"; grep GOLDEN_ROWS "$W"; exit 1; }
CH=$(git status --porcelain -uall | awk '{print $2}' | sort); echo "changed:"; printf '%s\n' "$CH" | sed 's/^/  /'
BAD=$(printf '%s\n' "$CH" | grep -vE '^tests/fixtures/generator-golden-master' || true); [ -z "$BAD" ] || { echo "⛔ the door changed more than the golden fixture:"; printf '%s\n' "$BAD"; exit 1; }
[ -n "$CH" ] || { echo "⛔ nothing changed — but the arm was red; inspect"; exit 1; }
[ "$GR" -gt 0 ] || { echo "⛔ moved=0 rows yet the fixture changed — inspect"; exit 1; }
printf '%s\n' "$CH" | xargs git add --
cat > "$SC/msg-golden-898.txt" <<MSG
PROSE landing: the generator golden master is re-recorded — $GR of $GT rows move, every one on cured emitted text

The declared same-seed text shift's own fixture. The golden-freeze register is UNFROZEN, so the env door
(UPDATE_GOLDEN=1) is the form and the ledger entry in docs/GOLDEN_SHIFT_LEDGER.md is the declaration; no shift-record
file is signed pre-freeze (LIGHT-PLAN §4). Rows unmoved: $((GT-GR)). No rules value, no preset, no flag moved
(simulationRules.js diff empty across the span). Taken under the gate mutex after the quiet window.

Seat: Fable 5.1 — validated

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
git commit -q -F "$SC/msg-golden-898.txt"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ porcelain after commit"; exit 1; }
echo "GOLDEN CAR $(git rev-parse --short HEAD): $GR/$GT rows moved; cars over fd8b6df00=$(git rev-list --count fd8b6df00..HEAD)"
