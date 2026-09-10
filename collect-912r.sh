#!/bin/sh
# collect-912r.sh — the §912 ledger act (LEDGER-ONLY: the S12 RATIFICATION row — the grand prose reconciliation sat by the Fable chair: Part B + the dossier ratified, corrected or re-opened rule by rule; no product car, no CAS, no seal). set -e: the guard and the consequence live together.
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
[ -f "$SC/payload-912r.json" ] || { echo "ABORT: payload-912r.json missing"; exit 1; }
git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head.912r"
python3 "$SC/apply-892.py" "$SC/payload-912r.json"
echo "--- C0 scan ---"; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-912r.md" || true
git show HEAD:docs/OWNER_DECISION_QUEUE.md > "$SC/odq.head.912r"
[ "$(git diff --no-index --numstat $SC/odq.head.912r docs/OWNER_DECISION_QUEUE.md | awk '{print $2}')" = "0" ] || { echo "ABORT: ledger deletions != 0"; exit 1; }
[ "$(git diff --no-index --numstat $SC/frq.head.912r $SC/queue-912r.md | awk '{print $2}')" = "0" ] || { echo "ABORT: queue deletions != 0"; exit 1; }
echo "  ledger and queue are PURE APPENDS"
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-912r.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-912r.md:docs/FABLE_RETROVALIDATION_QUEUE.md"
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -8
echo "  ODQ §912 rows: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§912 ')"
echo "  HANDOFF pickup: $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## ⭐⭐⭐⭐⭐ PICKUP AT §912') new / $(git show HEAD:docs/HANDOFF_CURRENT.md | grep -c '^## (superseded) PICKUP AT §911') demoted"
echo "  FRQ §912 section: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^## §912 — ')"
echo "  seat trailer Fable (must be 1): $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
cp "$SC/queue-912r.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "COLLECT_912R_OK tip=$NEW"
