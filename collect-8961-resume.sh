#!/bin/sh
# collect-8961-resume.sh — resume the §896.1 act AFTER apply-rulings + apply-892 have already written (they are
# idempotent-refusing, so they must NOT be re-run). Asserts the worktree carries EXACTLY the §896.1 edits and
# nothing else, then commits through chair-commit.sh and reads back. Guard and consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
cd "$REPO"; [ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08); echo "LEDGER_TIP_BEFORE=$TIP"
git log -1 --format=%s HEAD | grep -q '^§896:' || { echo "ABORT: HEAD is not §896"; exit 1; }
# the worktree must be HEAD + exactly the §896.1 edits: ODQ +1/-0 (the row), HANDOFF +N/-1 (card insert + demote), FRQ identical
NS_ODQ=$(git diff HEAD --numstat -- docs/OWNER_DECISION_QUEUE.md | awk '{print $1"/"$2}'); [ "$NS_ODQ" = "1/0" ] || { echo "ABORT: ODQ numstat $NS_ODQ, expected 1/0"; exit 1; }
[ "$(grep -c '^§896\.1 ' docs/OWNER_DECISION_QUEUE.md)" = "1" ] || { echo "ABORT: §896.1 rows != 1"; exit 1; }
[ "$(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§896\.1 ')" = "0" ] || { echo "ABORT: §896.1 already at HEAD"; exit 1; }
[ "$(grep -c '^## ⭐⭐⭐⭐⭐ PICKUP AT §896\.1 ' docs/HANDOFF_CURRENT.md)" = "1" ] || { echo "ABORT: §896.1 card != 1"; exit 1; }
[ "$(grep -c '^## (superseded) PICKUP AT §896 ' docs/HANDOFF_CURRENT.md)" = "1" ] || { echo "ABORT: §896 card not demoted exactly once"; exit 1; }
[ "$(grep -c '^## ⭐⭐⭐⭐⭐ PICKUP AT' docs/HANDOFF_CURRENT.md)" = "1" ] || { echo "ABORT: more than one starred pickup"; exit 1; }
# ⚠ HANDOFF/FRQ are `D ` (staged-deleted) + `??` (untracked) in this worktree: `git diff HEAD -- path` compares HEAD to NOTHING
# and reports the whole file deleted. Compare the untracked copy against the HEAD blob with --no-index instead.
git show HEAD:docs/HANDOFF_CURRENT.md > "$SC/hand.head.8961"
NS_H=$(git diff --no-index --numstat "$SC/hand.head.8961" docs/HANDOFF_CURRENT.md | awk '{print $1"/"$2}'); ADD_H=${NS_H%/*}; DEL_H=${NS_H#*/}
[ "$DEL_H" = "1" ] || { echo "ABORT: HANDOFF deletions=$DEL_H (only the demoted heading may change)"; exit 1; }
[ "$ADD_H" -ge 2 ] || { echo "ABORT: HANDOFF additions=$ADD_H (the card block is missing)"; exit 1; }
echo "  HANDOFF vs HEAD: +$ADD_H/-$DEL_H (card inserted, one heading demoted)"
[ "$(md5 -q docs/FABLE_RETROVALIDATION_QUEUE.md)" = "$(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | md5 -q)" ] || { echo "ABORT: worktree FRQ differs from HEAD"; exit 1; }
[ -s "$SC/queue-8961.md" ] && [ -s "$SC/frq.head.8961" ] || { echo "ABORT: queue-8961.md / frq.head.8961 missing"; exit 1; }
[ "$(md5 -q $SC/frq.head.8961)" = "$(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | md5 -q)" ] || { echo "ABORT: frq.head.8961 is not HEAD's FRQ"; exit 1; }
echo "--- C0 scan ---"; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-8961.md" || true
D=$(git diff --no-index --numstat "$SC/frq.head.8961" "$SC/queue-8961.md" | awk '{print $2}'); [ "$D" = "0" ] || { echo "ABORT: queue deletions=$D"; exit 1; }
N=$(grep -c '^\*RULED (§892.x, Fable 5.1):\*' $SC/queue-8961.md); echo "  RULED lines (line-anchored) in queue-8961.md: $N (expect 28; the 29th unanchored hit is the method paragraph's prose)"
[ "$N" = "28" ] || { echo "ABORT: expected 28 rulings"; exit 1; }
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-8961.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-8961.md:docs/FABLE_RETROVALIDATION_QUEUE.md"
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -6
echo "  RULED (§892.x) lines at tip: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^\*RULED (§892.x, Fable 5.1):\*')"
echo "  ODQ §896.1 rows: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§896.1 ')"
echo "  seat trailer Fable: $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
git log -1 --format=%s HEAD | grep -q '^§896.1:' || { echo "ABORT: tip subject is not §896.1"; exit 1; }
cp "$SC/queue-8961.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "COLLECT_8961_OK tip=$NEW"
