#!/bin/sh
# collect-896.sh — the CLAMP landing collection (§896). set -e: the guard and the consequence live together.
# Reads the CAS sha from $SC/cas-896.sha, written by the CAS step; refuses if absent or unsealed.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
cd "$REPO"; [ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08); echo "LEDGER_TIP_BEFORE=$TIP"
[ -s "$SC/cas-896.sha" ] || { echo "ABORT: cas-896.sha missing/empty — CAS first"; exit 1; }
CAS=$(cat "$SC/cas-896.sha")
GOT=$(git rev-parse --verify refs/preserve/landing-clamp-2026-09-05 2>/dev/null || echo MISSING)
[ "$GOT" = "$(git rev-parse $CAS)" ] || { echo "ABORT: seal landing-clamp is $GOT, row declares $CAS"; exit 1; }
[ "$(git rev-parse claude/composite-r4)" = "$(git rev-parse $CAS)" ] || { echo "ABORT: product branch is not at the declared tip"; exit 1; }
echo "  seal OK · product OK at $CAS"
for f in docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md docs/FABLE_RETROVALIDATION_QUEUE.md; do
  [ "$(md5 -q $f)" = "$(git show HEAD:$f | md5 -q)" ] || { echo "ABORT: worktree $f differs from HEAD"; exit 1; }
done
[ -f "$SC/payload-896.json" ] || { echo "ABORT: payload-896.json missing"; exit 1; }
git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head.896"
python3 "$SC/apply-892.py" "$SC/payload-896.json"
echo "--- C0 scan ---"; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-896.md" || true
git show HEAD:docs/OWNER_DECISION_QUEUE.md > "$SC/odq.head.896"
[ "$(git diff --no-index --numstat $SC/odq.head.896 docs/OWNER_DECISION_QUEUE.md | awk '{print $2}')" = "0" ] || { echo "ABORT: ledger deletions != 0"; exit 1; }
[ "$(git diff --no-index --numstat $SC/frq.head.896 $SC/queue-896.md | awk '{print $2}')" = "0" ] || { echo "ABORT: queue deletions != 0"; exit 1; }
echo "  ledger and queue are PURE APPENDS"
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-896.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-896.md:docs/FABLE_RETROVALIDATION_QUEUE.md"
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -6
echo "  ODQ §896 rows: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§896 ')"
echo "  FRQ R-rows: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -cE '^### R[0-9]+')  (R33..R36 = $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -cE '^### R3[3-6] '))"
echo "  seat trailer Fable (must be 1): $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
cp "$SC/queue-896.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "COLLECT_896_OK tip=$NEW"
