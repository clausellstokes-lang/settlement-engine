#!/bin/sh
# collect-931.sh <cas-sha> — the §931 ledger act. The ledger docs are edited in $MY/c931/ledger/ (each regenerated from
# `git show HEAD:` first — the checkout copies are stale, manual §6.8a); this script proves pure appends where the law demands
# them, then commits through chair-commit.sh with --require-ref on the landing seal. set -e: guard and consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad
L=$MY/c931/ledger; REPO=/Users/cstokes/Desktop/settlement-engine; CAS=${1:?cas sha}
cd "$REPO"; [ "$(git rev-parse --show-toplevel)" = "$REPO" ] || { echo "ABORT toplevel"; exit 1; }
TIP=$(git rev-parse refs/heads/review-fixes-2026-07-08); echo "LEDGER_TIP_BEFORE=$TIP"
SEAL=$(git rev-parse --verify refs/preserve/landing-longtail-2026-09-15 2>/dev/null || echo MISSING)
[ "$SEAL" = "$(git rev-parse $CAS)" ] || { echo "ABORT: seal landing-longtail-2026-09-15 is $SEAL, row declares $CAS"; exit 1; }
[ "$(git rev-parse claude/composite-r4)" = "$(git rev-parse $CAS)" ] || { echo "ABORT: product branch is not at the declared tip"; exit 1; }
echo "  seal OK · product OK at $(git rev-parse --short $CAS)"
for f in OWNER_DECISION_QUEUE.md FABLE_RETROVALIDATION_QUEUE.md HANDOFF_CURRENT.md REWRITE_RECUT_PROGRAM_PLAN.md OWNER_SITTING_2026-09-15.md; do
  [ -s "$L/$f" ] || { echo "ABORT: $L/$f missing"; exit 1; }
  git show HEAD:docs/$f > "$L/$f.head"
done
echo "--- C0 scan (must be 0 each) ---"; for f in OWNER_DECISION_QUEUE.md FABLE_RETROVALIDATION_QUEUE.md HANDOFF_CURRENT.md REWRITE_RECUT_PROGRAM_PLAN.md OWNER_SITTING_2026-09-15.md; do printf '  %s: ' $f; LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]' "$L/$f" || true; done
for f in OWNER_DECISION_QUEUE.md FABLE_RETROVALIDATION_QUEUE.md OWNER_SITTING_2026-09-15.md; do
  D=$(git diff --no-index --numstat "$L/$f.head" "$L/$f" | awk '{print $2}'); [ "$D" = "0" ] || { echo "ABORT: $f deletions = $D (must be a pure append)"; exit 1; }
done
echo "  ledger and queue are PURE APPENDS"
echo "  recut plan: $(git diff --no-index --numstat "$L/REWRITE_RECUT_PROGRAM_PLAN.md.head" "$L/REWRITE_RECUT_PROGRAM_PLAN.md" | awk '{print "+"$1" -"$2}') (one row amended in place, append-only inside the row)"
echo "  handoff: $(git diff --no-index --numstat "$L/HANDOFF_CURRENT.md.head" "$L/HANDOFF_CURRENT.md" | awk '{print "+"$1" -"$2}')"
grep -q '^## §931 ' "$L/OWNER_DECISION_QUEUE.md" || { echo "ABORT: no §931 header in the ODQ copy"; exit 1; }
grep -hoE '__[A-Z0-9_]+__' "$L/OWNER_DECISION_QUEUE.md" "$L/HANDOFF_CURRENT.md" "$L/FABLE_RETROVALIDATION_QUEUE.md" "$L/REWRITE_RECUT_PROGRAM_PLAN.md" "$L/OWNER_SITTING_2026-09-15.md" | grep -v '^__LANEROWS__$' | grep -q . && { echo "ABORT: unfilled placeholder: $(grep -hoE '__[A-Z0-9_]+__' "$L"/*.md | grep -v '^__LANEROWS__$' | sort -u | tr '\n' ' ') (__LANEROWS__ is a pre-existing §882 note in the handoff, not ours)"; exit 1; }
# the ODQ must be the WORKING-TREE copy for chair-commit.sh (it always includes it from the working tree): place it, then commit
cp "$L/OWNER_DECISION_QUEUE.md" docs/OWNER_DECISION_QUEUE.md
git diff --cached --stat > $MY/c931/index-before.txt
SP="$MY" sh "$SC/chair-tools/chair-commit.sh" --require-ref refs/preserve/landing-longtail-2026-09-15 "$(git rev-parse $CAS)" "$TIP" "$MY/c931/msg-931.txt" "$L/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md" "$L/FABLE_RETROVALIDATION_QUEUE.md:docs/FABLE_RETROVALIDATION_QUEUE.md" "$L/REWRITE_RECUT_PROGRAM_PLAN.md:docs/REWRITE_RECUT_PROGRAM_PLAN.md" "$L/OWNER_SITTING_2026-09-15.md:docs/OWNER_SITTING_2026-09-15.md"
git diff --cached --stat > $MY/c931/index-after.txt
cmp -s $MY/c931/index-before.txt $MY/c931/index-after.txt && echo "  real index UNCHANGED (proved)" || { echo "⛔ the real index changed — read index-before/after"; exit 1; }
NEW=$(git rev-parse --short HEAD)
echo "--- READ-BACK AT $NEW ---"; git show --stat --format='%h %s' HEAD | head -8
echo "  ODQ §931 header at HEAD: $(git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep -c '^## §931 ')"
echo "  FRQ R-rows: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -cE '^### R[0-9]+')"
echo "  seat trailer Fable (must be 1): $(git log -1 --format=%B | grep -c '^Seat: Fable 5.1 — validated$')"
for f in HANDOFF_CURRENT.md FABLE_RETROVALIDATION_QUEUE.md REWRITE_RECUT_PROGRAM_PLAN.md OWNER_SITTING_2026-09-15.md; do cp "$L/$f" docs/$f; done
echo "COLLECT_931_OK tip=$NEW"
