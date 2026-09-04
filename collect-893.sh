#!/bin/sh
# collect-893.sh — the §893 collection. set -e throughout: the guard and the consequence in one place.
# Order: dump the FRQ HEAD blob → apply (ledger row + card + FRQ tail, all asserted, written only at the
# end) → C0 scan → chair-commit with the queue MAPPED → read back AT the committed tip.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
cd "$REPO"
[ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08)
echo "LEDGER_TIP_BEFORE=$TIP"
[ -f "$SC/msg-893.txt" ] || { echo "ABORT: msg-893.txt missing"; exit 1; }
[ -f "$SC/payload-893.json" ] || { echo "ABORT: payload-893.json missing"; exit 1; }
# three-copies hazard: every worktree copy must equal HEAD before we touch anything
for f in docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md docs/FABLE_RETROVALIDATION_QUEUE.md; do
  [ "$(md5 -q $f)" = "$(git show HEAD:$f | md5 -q)" ] || { echo "ABORT: worktree $f differs from HEAD"; exit 1; }
done
# the queue is built from the HEAD BLOB, never the worktree copy
git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head.893"
python3 "$SC/apply-892.py" "$SC/payload-893.json"
echo "--- C0 scan (own statement, not a fallback claim) ---"
LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-893.md" || true
git show HEAD:docs/OWNER_DECISION_QUEUE.md > "$SC/odq.head.893"; git show HEAD:docs/HANDOFF_CURRENT.md > "$SC/hand.head.893"
echo "ledger: $(git diff --no-index --numstat $SC/odq.head.893 docs/OWNER_DECISION_QUEUE.md | awk '{print "+"$1" -"$2}')  card: $(git diff --no-index --numstat $SC/hand.head.893 docs/HANDOFF_CURRENT.md | awk '{print "+"$1" -"$2}')  queue: $(git diff --no-index --numstat $SC/frq.head.893 $SC/queue-893.md | awk '{print "+"$1" -"$2}')"
# §893 is a PURE APPEND to the queue: deletions must be exactly 0
QDEL=$(git diff --no-index --numstat "$SC/frq.head.893" "$SC/queue-893.md" | awk '{print $2}')
[ "$QDEL" = "0" ] || { echo "ABORT: queue deletions = $QDEL, expected 0 (a §893 append deletes nothing)"; exit 1; }
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-893.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-893.md:docs/FABLE_RETROVALIDATION_QUEUE.md"
NEW=$(git rev-parse --short HEAD)
echo "--- read-back AT the committed tip $NEW ---"
git show --stat --format='%h %s' HEAD | head -6
echo "ODQ §893 rows at tip: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§893 ')"
echo "FRQ §893 section at tip: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^## §893 ')  R-rows at tip: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^### R[0-9]')"
echo "seat trailer (must be 1): $(git log -1 --format=%B | grep -c '^Seat: Opus 5 — Fable-unvalidated$')"
echo "card top: $(git show HEAD:docs/HANDOFF_CURRENT.md | sed -n '11p' | cut -c1-90)"
# refresh the worktree copy so the three-copies trap does not re-arm for the next chair
cp "$SC/queue-893.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "worktree == tip: $([ "$(md5 -q docs/FABLE_RETROVALIDATION_QUEUE.md)" = "$(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | md5 -q)" ] && echo queue-yes) $([ "$(md5 -q docs/OWNER_DECISION_QUEUE.md)" = "$(git show HEAD:docs/OWNER_DECISION_QUEUE.md | md5 -q)" ] && echo ledger-yes) $([ "$(md5 -q docs/HANDOFF_CURRENT.md)" = "$(git show HEAD:docs/HANDOFF_CURRENT.md | md5 -q)" ] && echo card-yes)"
echo "COLLECT_893_OK tip=$NEW"
