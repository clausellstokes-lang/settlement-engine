#!/bin/sh
# collect-911.sh — the §911 ledger act (LEDGER-ONLY: the CAP-HORIZON-909 measurement row — the 600-year horizon, the 12-settlement timing probe and its dark twin, the four chair rulings; no product car, no CAS, no seal). set -e: the guard and the consequence live together.
# Derived from collect-909.sh + collect-907.sh; the product branch must be UNCHANGED at 3b1c0eaa5; DESIGN_HORIZON.md rides along as a THREE-LINE IN-PLACE AMENDMENT (numstat 3/3, the §911 mark exactly three times, line count unchanged).
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
cd "$REPO"; [ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08); echo "LEDGER_TIP_BEFORE=$TIP"
[ "$(git rev-parse --short claude/composite-r4)" = "3b1c0eaa5" ] || { echo "ABORT: product branch moved off 3b1c0eaa5 — the row declares it unchanged"; exit 1; }
echo "  product UNCHANGED at 3b1c0eaa5 (a ledger-only act)"
for f in docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md docs/FABLE_RETROVALIDATION_QUEUE.md; do
  [ "$(md5 -q $f)" = "$(git show HEAD:$f | md5 -q)" ] || { echo "ABORT: worktree $f differs from HEAD"; exit 1; }
done
[ -f "$SC/payload-911.json" ] || { echo "ABORT: payload-911.json missing"; exit 1; }
[ -s "$SC/design-horizon.911.md" ] || { echo "ABORT: design-horizon.911.md missing"; exit 1; }
git show HEAD:docs/DESIGN_HORIZON.md > "$SC/design-horizon.head.911.md"
NS=$(git diff --no-index --numstat "$SC/design-horizon.head.911.md" "$SC/design-horizon.911.md" | awk '{print $1"/"$2}'); [ "$NS" = "3/3" ] || { echo "ABORT: DESIGN_HORIZON amendment numstat is $NS, not 3/3"; exit 1; }
[ "$(grep -c 'CHAIR-AMENDED §911' $SC/design-horizon.911.md)" = "3" ] || { echo "ABORT: the §911 mark must appear exactly three times"; exit 1; }
[ "$(wc -l < $SC/design-horizon.911.md)" = "$(wc -l < $SC/design-horizon.head.911.md)" ] || { echo "ABORT: DESIGN_HORIZON line count changed"; exit 1; }
echo "  DESIGN_HORIZON.md: three-line in-place amendment, mark three times, line count unchanged"
git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head.911"
python3 "$SC/apply-892.py" "$SC/payload-911.json"
echo "--- C0 scan ---"; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-911.md" "$SC/design-horizon.911.md" || true
git show HEAD:docs/OWNER_DECISION_QUEUE.md > "$SC/odq.head.911"
[ "$(git diff --no-index --numstat $SC/odq.head.911 docs/OWNER_DECISION_QUEUE.md | awk '{print $2}')" = "0" ] || { echo "ABORT: ledger deletions != 0"; exit 1; }
[ "$(git diff --no-index --numstat $SC/frq.head.911 $SC/queue-911.md | awk '{print $2}')" = "0" ] || { echo "ABORT: queue deletions != 0"; exit 1; }
echo "  ledger and queue are PURE APPENDS"
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-911.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-911.md:docs/FABLE_RETROVALIDATION_QUEUE.md" "$SC/design-horizon.911.md:docs/DESIGN_HORIZON.md"
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -8
echo "  ODQ §911 rows: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§911 ')"
echo "  HANDOFF pickup: $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## ⭐⭐⭐⭐⭐ PICKUP AT §911') new / $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## (superseded) PICKUP AT §910') demoted"
echo "  DESIGN_HORIZON §911 marks: $(git show HEAD:docs/DESIGN_HORIZON.md | grep -c 'CHAIR-AMENDED §911')"
echo "  FRQ §911 section: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^## §911 — ')"
echo "  seat trailer Fable (must be 1): $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
cp "$SC/queue-911.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "COLLECT_911_OK tip=$NEW"
