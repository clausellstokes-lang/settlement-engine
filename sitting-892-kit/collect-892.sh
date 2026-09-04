#!/bin/sh
# collect-892.sh — the §892 sitting's collection, ONE command, set -e throughout (the guard and the
# consequence in one place). Order: build the queue from the HEAD blob → write the ledger row + card
# (apply-892.py, asserting) → C0 scan (own statement) → chair-commit (three trailers · subject anchor ·
# queue-blob gates) with the queue MAPPED → read back at the committed tip.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
cd "$REPO"
[ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08)
echo "LEDGER_TIP_BEFORE=$TIP"
[ -f "$SC/msg-892.txt" ] || { echo "ABORT: msg-892.txt missing"; exit 1; }
[ -f "$SC/payload-892.json" ] || { echo "ABORT: payload-892.json missing"; exit 1; }
# worktree copies must equal HEAD before we start (three-copies hazard)
for f in docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md docs/FABLE_RETROVALIDATION_QUEUE.md; do
  [ "$(md5 -q $f)" = "$(git show HEAD:$f | md5 -q)" ] || { echo "ABORT: worktree $f differs from HEAD"; exit 1; }
done
# 1. the queue, from the HEAD blob, non-dry (refuses on any unfilled placeholder)
python3 "$SC/build-queue-892.py" "$SC/queue-892.md"
# 2. the ledger row + card (apply-892.py also takes frq_in/frq_tail/frq_out; we hand it the built queue as-is)
python3 "$SC/apply-892.py" "$SC/payload-892.json"
echo "--- C0 scan (own statement) ---"
LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-892.md" || true
git show HEAD:docs/OWNER_DECISION_QUEUE.md > "$SC/odq.head"; git show HEAD:docs/HANDOFF_CURRENT.md > "$SC/hand.head"; git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head"
echo "ledger: $(git diff --no-index --numstat $SC/odq.head docs/OWNER_DECISION_QUEUE.md | awk '{print "+"$1" -"$2}')  card: $(git diff --no-index --numstat $SC/hand.head docs/HANDOFF_CURRENT.md | awk '{print "+"$1" -"$2}')  queue: $(git diff --no-index --numstat $SC/frq.head $SC/queue-892.md | awk '{print "+"$1" -"$2}')"
# the queue's deletions must be exactly 2 (the old §3 clause) — the builder asserted it; re-assert from the numstat
QDEL=$(git diff --no-index --numstat "$SC/frq.head" "$SC/queue-892.md" | awk '{print $2}')
[ "$QDEL" = "2" ] || { echo "ABORT: queue deletions = $QDEL, expected 2"; exit 1; }
# 3. the commit (queue mapped with a changed blob; Fable trailer; subject anchor)
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-892.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-892.md:docs/FABLE_RETROVALIDATION_QUEUE.md"
# 4. read-back at the committed tip
NEW=$(git rev-parse --short HEAD)
echo "--- read-back at $NEW ---"
git show --stat --format='%h %s' HEAD | head -6
echo "§892 rows at tip: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§892 ')"
echo "queue §892 section at tip: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^## §892 ')  rulings at tip: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c '^\*RULED (§892')  §3 amended at tip: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -c 'MARKED by the seat that DID the work')"
echo "card top: $(git show HEAD:docs/HANDOFF_CURRENT.md | sed -n '11p' | cut -c1-90)"
echo "seat trailer: $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
# the worktree copy of the queue must be refreshed to the committed blob so the three-copies trap does not re-arm
cp "$SC/queue-892.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "worktree == tip: $([ "$(md5 -q docs/FABLE_RETROVALIDATION_QUEUE.md)" = "$(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | md5 -q)" ] && echo queue-yes) $([ "$(md5 -q docs/OWNER_DECISION_QUEUE.md)" = "$(git show HEAD:docs/OWNER_DECISION_QUEUE.md | md5 -q)" ] && echo ledger-yes) $([ "$(md5 -q docs/HANDOFF_CURRENT.md)" = "$(git show HEAD:docs/HANDOFF_CURRENT.md | md5 -q)" ] && echo card-yes)"
echo "COLLECT_892_OK tip=$NEW"
