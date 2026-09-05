#!/bin/sh
# collect-8961.sh — the §896.1 RULINGS act: 28 Fable rulings written into the retrovalidation queue
# through apply-rulings.py (every anchor asserted exactly once), plus the §896.1 ledger row + card.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
cd "$REPO"; [ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08); echo "LEDGER_TIP_BEFORE=$TIP"
# §896 must already be on the ledger: the card this act demotes is §896's
git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -q '^§896 ' || { echo "ABORT: §896 not on the ledger yet — collect the clamp landing first"; exit 1; }
for f in docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md docs/FABLE_RETROVALIDATION_QUEUE.md; do
  [ "$(md5 -q $f)" = "$(git show HEAD:$f | md5 -q)" ] || { echo "ABORT: worktree $f differs from HEAD"; exit 1; }
done
[ -f "$SC/payload-8961.json" ] || { echo "ABORT: payload-8961.json missing (build it after §896 lands)"; exit 1; }
git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head.8961"
# 1. the rulings, through the asserting writer, over the HEAD blob — never the worktree copy
python3 "$SC/apply-rulings.py" "$SC/frq.head.8961" "$SC/rulings-892x.json" "$SC/queue-8961.ruled.md"
# 2. the §896.1 row + card (apply-892.py appends to the ODQ/card in the worktree; frq_in is the RULED queue)
python3 "$SC/apply-892.py" "$SC/payload-8961.json"
echo "--- C0 scan ---"; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-8961.md" || true
# rulings are INSERTIONS inside existing blocks; the queue must GROW and lose nothing
D=$(git diff --no-index --numstat "$SC/frq.head.8961" "$SC/queue-8961.md" | awk '{print $2}'); [ "$D" = "0" ] || { echo "ABORT: queue deletions=$D"; exit 1; }
echo "  RULED lines in queue-8961.md: $(grep -c '^\*RULED (§892.x, Fable 5.1):\*' $SC/queue-8961.md)  (expect 28)"
[ "$(grep -c '^\*RULED (§892.x, Fable 5.1):\*' $SC/queue-8961.md)" = "28" ] || { echo "ABORT: expected 28 rulings"; exit 1; }
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-8961.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-8961.md:docs/FABLE_RETROVALIDATION_QUEUE.md"
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -6
echo "  RULED (§892.x) lines at tip: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^\*RULED (§892.x, Fable 5.1):\*')"
echo "  ODQ §896.1 rows: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§896.1 ')"
echo "  seat trailer Fable: $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
cp "$SC/queue-8961.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "COLLECT_8961_OK tip=$NEW"
