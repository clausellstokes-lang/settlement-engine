#!/bin/sh
# collect-907.sh — the §907 ledger act (LEDGER-ONLY: HORIZON-B6's three CAPACITY measurements + the C4' clause (4) amendment; no product car, no CAS, no seal). set -e: the guard and the consequence live together.
# Derived from collect-905.sh; the product branch must be UNCHANGED at 4243bdc61; DESIGN_HORIZON.md rides along as a ONE-LINE IN-PLACE AMENDMENT (numstat 1/1, the §907 mark exactly once, line count unchanged).
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
cd "$REPO"; [ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08); echo "LEDGER_TIP_BEFORE=$TIP"
[ "$(git rev-parse --short claude/composite-r4)" = "4243bdc61" ] || { echo "ABORT: product branch moved off 4243bdc61 — the row declares it unchanged"; exit 1; }
echo "  product UNCHANGED at 4243bdc61 (a ledger-only act)"
for f in docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md docs/FABLE_RETROVALIDATION_QUEUE.md; do
  [ "$(md5 -q $f)" = "$(git show HEAD:$f | md5 -q)" ] || { echo "ABORT: worktree $f differs from HEAD"; exit 1; }
done
[ -f "$SC/payload-907.json" ] || { echo "ABORT: payload-907.json missing"; exit 1; }
[ -s "$SC/design-horizon.907.md" ] || { echo "ABORT: design-horizon.907.md missing"; exit 1; }
git show HEAD:docs/DESIGN_HORIZON.md > "$SC/design-horizon.head.907.md"
NS=$(git diff --no-index --numstat "$SC/design-horizon.head.907.md" "$SC/design-horizon.907.md" | awk '{print $1"/"$2}'); [ "$NS" = "1/1" ] || { echo "ABORT: DESIGN_HORIZON amendment numstat is $NS, not 1/1"; exit 1; }
[ "$(grep -c 'CHAIR-AMENDED §907' $SC/design-horizon.907.md)" = "1" ] || { echo "ABORT: the §907 mark must appear exactly once"; exit 1; }
[ "$(wc -l < $SC/design-horizon.907.md)" = "$(wc -l < $SC/design-horizon.head.907.md)" ] || { echo "ABORT: DESIGN_HORIZON line count changed"; exit 1; }
echo "  DESIGN_HORIZON.md: one-line in-place amendment, mark once, line count unchanged"
git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head.907"
python3 "$SC/apply-892.py" "$SC/payload-907.json"
echo "--- C0 scan ---"; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-907.md" "$SC/design-horizon.907.md" || true
git show HEAD:docs/OWNER_DECISION_QUEUE.md > "$SC/odq.head.907"
[ "$(git diff --no-index --numstat $SC/odq.head.907 docs/OWNER_DECISION_QUEUE.md | awk '{print $2}')" = "0" ] || { echo "ABORT: ledger deletions != 0"; exit 1; }
[ "$(git diff --no-index --numstat $SC/frq.head.907 $SC/queue-907.md | awk '{print $2}')" = "0" ] || { echo "ABORT: queue deletions != 0"; exit 1; }
echo "  ledger and queue are PURE APPENDS"
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-907.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-907.md:docs/FABLE_RETROVALIDATION_QUEUE.md" "$SC/design-horizon.907.md:docs/DESIGN_HORIZON.md"
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -8
echo "  ODQ §907 rows: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§907 ')"
echo "  HANDOFF pickup: $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## ⭐⭐⭐⭐⭐ PICKUP AT §907') new / $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## (superseded) PICKUP AT §904') demoted"
echo "  DESIGN_HORIZON §907 mark: $(git show HEAD:docs/DESIGN_HORIZON.md | grep -c 'CHAIR-AMENDED §907')"
echo "  FRQ §907 section: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^## §907 — ')"
echo "  seat trailer Fable (must be 1): $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
cp "$SC/queue-907.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "COLLECT_907_OK tip=$NEW"
