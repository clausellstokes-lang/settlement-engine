#!/bin/sh
# collect-905.sh — the §905 ledger act (LEDGER-ONLY: L-PROBE-2 + the eleven declarations; no product car, no CAS, no seal). set -e: the guard and the consequence live together.
# Derived from collect-904.sh; the CAS/seal guards become "the product branch is UNCHANGED at 6582958ce" and the golden-shift ledger rides along as a PURE APPEND.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
cd "$REPO"; [ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08); echo "LEDGER_TIP_BEFORE=$TIP"
[ "$(git rev-parse --short claude/composite-r4)" = "6582958ce" ] || { echo "ABORT: product branch moved off 6582958ce — the row declares it unchanged"; exit 1; }
echo "  product UNCHANGED at 6582958ce (a ledger-only act)"
for f in docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md docs/FABLE_RETROVALIDATION_QUEUE.md; do
  [ "$(md5 -q $f)" = "$(git show HEAD:$f | md5 -q)" ] || { echo "ABORT: worktree $f differs from HEAD"; exit 1; }
done
[ -f "$SC/payload-905.json" ] || { echo "ABORT: payload-905.json missing"; exit 1; }
[ -s "$SC/golden-shift.ledger.905.md" ] || { echo "ABORT: golden-shift.ledger.905.md missing"; exit 1; }
grep -q '⟦' "$SC/golden-shift.ledger.905.md" && { echo "ABORT: token in the golden-shift ledger"; exit 1; }
git show HEAD:docs/GOLDEN_SHIFT_LEDGER.md > "$SC/gsl.head.905"
[ "$(git diff --no-index --numstat $SC/gsl.head.905 $SC/golden-shift.ledger.905.md | awk '{print $2}')" = "0" ] || { echo "ABORT: golden-shift ledger deletions != 0"; exit 1; }
[ "$(grep -c '^# GOLDEN SHIFT LEDGER' $SC/golden-shift.ledger.905.md)" = "$(( $(grep -c '^# GOLDEN SHIFT LEDGER' $SC/gsl.head.905) + 1 ))" ] || { echo "ABORT: the golden-shift ledger must gain exactly one entry"; exit 1; }
echo "  golden-shift ledger: PURE APPEND, +1 entry"
git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head.905"
python3 "$SC/apply-892.py" "$SC/payload-905.json"
echo "--- C0 scan ---"; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-905.md" "$SC/golden-shift.ledger.905.md" || true
git show HEAD:docs/OWNER_DECISION_QUEUE.md > "$SC/odq.head.905"
[ "$(git diff --no-index --numstat $SC/odq.head.905 docs/OWNER_DECISION_QUEUE.md | awk '{print $2}')" = "0" ] || { echo "ABORT: ledger deletions != 0"; exit 1; }
[ "$(git diff --no-index --numstat $SC/frq.head.905 $SC/queue-905.md | awk '{print $2}')" = "0" ] || { echo "ABORT: queue deletions != 0"; exit 1; }
echo "  ledger and queue are PURE APPENDS"
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-905.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-905.md:docs/FABLE_RETROVALIDATION_QUEUE.md" "$SC/golden-shift.ledger.905.md:docs/GOLDEN_SHIFT_LEDGER.md"
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -8
echo "  ODQ §905 rows: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§905 ')"
echo "  HANDOFF pickup: $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## ⭐⭐⭐⭐⭐ PICKUP AT §905') new / $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## (superseded) PICKUP AT §904') demoted"
echo "  GSL entries: $(git show HEAD:docs/GOLDEN_SHIFT_LEDGER.md | grep -c '^# GOLDEN SHIFT LEDGER') (was $(grep -c '^# GOLDEN SHIFT LEDGER' $SC/gsl.head.905))"
echo "  FRQ §905 section: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^## §905 — ')"
echo "  seat trailer Fable (must be 1): $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
cp "$SC/queue-905.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "COLLECT_905_OK tip=$NEW"
