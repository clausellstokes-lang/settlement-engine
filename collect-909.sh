#!/bin/sh
# collect-909.sh — the §909 ledger act (LEDGER-ONLY: the owner's 2026-09-07 delegation sitting — the chair's rulings recorded; no product car, no CAS, no seal). set -e: the guard and the consequence live together.
# Derived from collect-907.sh; the product branch must be UNCHANGED at 6ebe0ef3b; no extra file rides along.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
cd "$REPO"; [ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08); echo "LEDGER_TIP_BEFORE=$TIP"
[ "$(git rev-parse --short claude/composite-r4)" = "6ebe0ef3b" ] || { echo "ABORT: product branch moved off 6ebe0ef3b — the row declares it unchanged"; exit 1; }
echo "  product UNCHANGED at 6ebe0ef3b (a ledger-only act)"
for f in docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md docs/FABLE_RETROVALIDATION_QUEUE.md; do
  [ "$(md5 -q $f)" = "$(git show HEAD:$f | md5 -q)" ] || { echo "ABORT: worktree $f differs from HEAD"; exit 1; }
done
[ -f "$SC/payload-909.json" ] || { echo "ABORT: payload-909.json missing"; exit 1; }
echo "  no extra mapped file at §909"
git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head.909"
python3 "$SC/apply-892.py" "$SC/payload-909.json"
echo "--- C0 scan ---"; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-909.md" || true
git show HEAD:docs/OWNER_DECISION_QUEUE.md > "$SC/odq.head.909"
[ "$(git diff --no-index --numstat $SC/odq.head.909 docs/OWNER_DECISION_QUEUE.md | awk '{print $2}')" = "0" ] || { echo "ABORT: ledger deletions != 0"; exit 1; }
[ "$(git diff --no-index --numstat $SC/frq.head.909 $SC/queue-909.md | awk '{print $2}')" = "0" ] || { echo "ABORT: queue deletions != 0"; exit 1; }
echo "  ledger and queue are PURE APPENDS"
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-909.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-909.md:docs/FABLE_RETROVALIDATION_QUEUE.md"
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -8
echo "  ODQ §909 rows: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§909 ')"
echo "  HANDOFF pickup: $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## ⭐⭐⭐⭐⭐ PICKUP AT §909') new / $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## (superseded) PICKUP AT §904') demoted"
echo "  (no extra file)"
echo "  FRQ §909 section: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^## §909 — ')"
echo "  seat trailer Fable (must be 1): $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
cp "$SC/queue-909.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "COLLECT_909_OK tip=$NEW"
