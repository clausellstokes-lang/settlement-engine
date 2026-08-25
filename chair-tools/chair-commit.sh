#!/bin/sh
# chair-commit.sh [--require-ref <refname> <sha>] <expected-tip> <message-file> [extra-file:repo-path ...]
# Private-index ledger commit: always includes docs/OWNER_DECISION_QUEUE.md from the
# working tree; extra args map a source file into the tree as src:repo/path.
#
# --require-ref: refuse to commit unless the named ref exists AND equals <sha> —
# the structural cure for the twice-bitten seal-before-declaration class (§633.1, §642):
# a ledger entry that declares a seal must name it here, so the declaration cannot
# outrun the act.
#
# THE SEAT TRAILER (§685, owner-ruled 2026-08-25): every ledger act is MARKED with the
# seat that made it. The message file MUST carry a line of exactly one of:
#     Seat: Fable 5 — validated
#     Seat: Opus 5 — Fable-unvalidated
# An Opus-seat commit MUST ALSO carry docs/FABLE_RETROVALIDATION_QUEUE.md among its
# mapped paths, so the act and its retrovalidation row land in the SAME commit. This is
# the structural cure for the class the owner named: work that is neither Fable-validated
# nor marked, which becomes indistinguishable from validated work as soon as memory fades.
# Unmarked is not a state this tool can produce.
set -e
REPO=/Users/cstokes/Desktop/settlement-engine
: "${SP:=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad}"
[ -d "$SP/chair-tools" ] || mkdir -p "$SP/chair-tools"

if [ "$1" = "--require-ref" ]; then
  REQREF="$2"; REQSHA="$3"; shift 3
else
  REQREF=""; REQSHA=""
fi
EXPECT="$1"; MSGFILE="$2"; shift 2

# --- THE SEAT GATE (cheapest check first; nothing is mutated before it passes) ---
if [ ! -f "$MSGFILE" ]; then echo "ABORT: message file '$MSGFILE' not found"; exit 1; fi
SEATLINE=$(grep -c '^Seat: \(Fable 5 — validated\|Opus 5 — Fable-unvalidated\)$' "$MSGFILE" || true)
if [ "$SEATLINE" -ne 1 ]; then
  echo "ABORT: the message file needs exactly one seat trailer (found $SEATLINE). §685 requires one of:"
  echo "  Seat: Fable 5 — validated"
  echo "  Seat: Opus 5 — Fable-unvalidated"
  exit 1
fi
if grep -q '^Seat: Opus 5 — Fable-unvalidated$' "$MSGFILE"; then
  QUEUED=no
  for PAIR in "$@"; do
    case "${PAIR#*:}" in docs/FABLE_RETROVALIDATION_QUEUE.md) QUEUED=yes ;; esac
  done
  if [ "$QUEUED" != "yes" ]; then
    echo "ABORT: an Opus-seat commit must land its retrovalidation row in the SAME act."
    echo "  Add a mapping ending in docs/FABLE_RETROVALIDATION_QUEUE.md to this call (§685.4)."
    exit 1
  fi
  # PRESENCE IS NOT A ROW (§688.7): the first spelling of this gate checked only that the
  # queue file rode along, so an unchanged file satisfied it — and the chair walked through
  # that gap on its own commit. The blob must actually DIFFER from the parent's.
  for PAIR in "$@"; do
    case "${PAIR#*:}" in docs/FABLE_RETROVALIDATION_QUEUE.md) QSRC="${PAIR%%:*}" ;; esac
  done
  QNEW=$(git -C "$REPO" hash-object "$QSRC")
  QOLD=$(git -C "$REPO" rev-parse "refs/heads/review-fixes-2026-07-08:docs/FABLE_RETROVALIDATION_QUEUE.md" 2>/dev/null || echo none)
  if [ "$QNEW" = "$QOLD" ]; then
    echo "ABORT: the retrovalidation queue is UNCHANGED — presence is not a row."
    echo "  An Opus-seat act owes a row naming what Fable re-derives (§685.4/§688.7)."
    exit 1
  fi
fi

# --- THE SUBJECT-ANCHOR GATE (§687.9) ---
# The §678 class, now bitten a THIRD time: a writer script aborts, the committer runs
# anyway (no `&&`), and a ledger message announces a section the ledger does not contain.
# Cure: if the subject opens with a § reference, that exact reference MUST be present in
# the ledger file this commit is about to land. A message cannot outrun its own entry.
SUBJ=$(head -1 "$MSGFILE")
case "$SUBJ" in
  §*)
    REF=$(printf '%s' "$SUBJ" | sed -n 's/^\(§[0-9][0-9.]*\).*/\1/p')
    if [ -n "$REF" ]; then
      if ! grep -qF "$REF" "$REPO/docs/OWNER_DECISION_QUEUE.md"; then
        echo "ABORT: the subject announces $REF but docs/OWNER_DECISION_QUEUE.md does not contain it."
        echo "  Your ledger patch did not land. Fix the patch, then commit (§687.9)."
        exit 1
      fi
    fi
    ;;
esac

if [ -n "$REQREF" ]; then
  GOT=$(git -C "$REPO" rev-parse --verify "refs/preserve/$REQREF" 2>/dev/null || echo MISSING)
  if [ "$GOT" != "$REQSHA" ]; then echo "ABORT: refs/preserve/$REQREF is '$GOT', declaration requires '$REQSHA' — seal first"; exit 1; fi
fi

cd "$REPO"
OLD=$(git rev-parse refs/heads/review-fixes-2026-07-08)
if [ "$OLD" != "$EXPECT" ]; then echo "ABORT: tip moved: $OLD (expected $EXPECT)"; exit 1; fi
export GIT_INDEX_FILE="$SP/chair-tools/commit.index"
rm -f "$GIT_INDEX_FILE"
git read-tree "$OLD"
H=$(git hash-object -w docs/OWNER_DECISION_QUEUE.md)
git update-index --cacheinfo "100644,$H,docs/OWNER_DECISION_QUEUE.md"
for PAIR in "$@"; do
  SRC="${PAIR%%:*}"; DST="${PAIR#*:}"
  HX=$(git hash-object -w "$SRC")
  # MODE PRESERVED, not assumed (§687.8): a hardcoded 100644 landed .husky/commit-msg
  # non-executable, i.e. inert — a gate that cannot run is worse than no gate, because
  # it reports as installed. The source file's own executable bit governs.
  if [ -x "$SRC" ]; then MODE=100755; else MODE=100644; fi
  git update-index --add --cacheinfo "$MODE,$HX,$DST"
done
TREE=$(git write-tree)
NEW=$(git commit-tree "$TREE" -p "$OLD" -F "$MSGFILE")
git update-ref refs/heads/review-fixes-2026-07-08 "$NEW" "$OLD"
unset GIT_INDEX_FILE
echo "LEDGER COMMIT: $NEW"
echo "COMMIT_OK"
