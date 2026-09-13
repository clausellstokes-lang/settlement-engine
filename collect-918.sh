#!/bin/sh
# collect-918.sh — the LEDGER-ONLY collection (§918: the taste and the sitting; zero product bytes, the
# product branch is NOT moved). Derived from collect-912.sh (the ledger-only precedent) with the CAS/seal
# guards replaced by a product-tip identity guard. set -e: the guard and the consequence live together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
REPO=/Users/cstokes/Desktop/settlement-engine
PRODUCT=29ec62425
cd "$REPO"; [ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08); echo "LEDGER_TIP_BEFORE=$TIP"
[ "$(git rev-parse --short claude/composite-r4)" = "$PRODUCT" ] || { echo "ABORT: product branch is not at $PRODUCT (a ledger-only act moves nothing)"; exit 1; }
for R in taste-2026-09-09-armA:f07b98529 taste-2026-09-09-armB:66d5b6e08; do
  NAME="${R%%:*}"; WANT="${R#*:}"
  GOT=$(git rev-parse --short --verify "refs/preserve/$NAME" 2>/dev/null || echo MISSING)
  [ "$GOT" = "$WANT" ] || { echo "ABORT: seal refs/preserve/$NAME is $GOT, the row declares $WANT — seal first"; exit 1; }
done
echo "  product OK at $PRODUCT · the two taste seals OK"
for f in docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md docs/FABLE_RETROVALIDATION_QUEUE.md; do
  [ "$(md5 -q $f)" = "$(git show HEAD:$f | md5 -q)" ] || { echo "ABORT: worktree $f differs from HEAD"; exit 1; }
done
[ -f "$SC/payload-918.json" ] || { echo "ABORT: payload-918.json missing"; exit 1; }
if grep -qE '__[A-Z0-9_]+__' "$SC/payload-918.json"; then echo "ABORT: unfilled placeholder in payload-918.json"; exit 1; fi
git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md > "$SC/frq.head.918"
python3 "$SC/apply-892.py" "$SC/payload-918.json"
echo "--- C0 scan ---"; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' docs/OWNER_DECISION_QUEUE.md docs/HANDOFF_CURRENT.md "$SC/queue-918.md" || true
git show HEAD:docs/OWNER_DECISION_QUEUE.md > "$SC/odq.head.918"
[ "$(git diff --no-index --numstat $SC/odq.head.918 docs/OWNER_DECISION_QUEUE.md | awk '{print $2}')" = "0" ] || { echo "ABORT: ledger deletions != 0"; exit 1; }
[ "$(git diff --no-index --numstat $SC/frq.head.918 $SC/queue-918.md | awk '{print $2}')" = "0" ] || { echo "ABORT: queue deletions != 0"; exit 1; }
echo "  ledger and queue are PURE APPENDS"
SP="$SC" sh "$SC/chair-tools/chair-commit.sh" "$TIP" "$SC/msg-918.txt" docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md "$SC/queue-918.md:docs/FABLE_RETROVALIDATION_QUEUE.md"
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -6
echo "  ODQ §918 rows: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^§918 ')"
echo "  FRQ R-rows: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -cE '^### R[0-9]+')"
echo "  seat trailer Fable (must be 1): $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
[ "$(git rev-parse --short claude/composite-r4)" = "$PRODUCT" ] || { echo "⛔ the product branch MOVED during a ledger-only act"; exit 1; }
cp "$SC/queue-918.md" docs/FABLE_RETROVALIDATION_QUEUE.md
echo "COLLECT_918_OK tip=$NEW"
