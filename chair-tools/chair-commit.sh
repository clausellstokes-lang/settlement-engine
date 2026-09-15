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
SEATLINE=$(grep -c '^Seat: \(Fable 5 — validated\|Fable 5\.1 — validated\|Opus 5 — Fable-unvalidated\)$' "$MSGFILE" || true)
if [ "$SEATLINE" -ne 1 ]; then
  echo "ABORT: the message file needs exactly one seat trailer (found $SEATLINE). §685 requires one of:"
  echo "  Seat: Fable 5 — validated"
  echo "  Seat: Fable 5.1 — validated   (the owner moved the Fable seat to 5.1 on 2026-09-01, §879)"
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

# --- THE ENROLMENT GATE (§882.14) — the CLASS-C cure ---
# The seat gate above binds the CHAIR'S MARK. It does not bind the LANE'S ENROLMENT,
# and under a FABLE trailer the tool never asked for the queue at all — so a Fable
# chair that RULED an Opus lane's calls inside a ledger row left the queue without
# them, and a returning Fable seat walking the queue top to bottom (its own §5) saw
# nothing. Measured 2026-09-02 by the RETRO-AUDIT lane: SEVEN lanes lost that way
# (G0-WRW, G0-CHARSET, G0-COVERAGE, G0-WORKER, READERREVIEW, T13-BUILD, DOCKRETIRE)
# plus one — GOLDEN-BUILD — ruled nowhere at all, its seven cars held alive only by
# a detached worktree HEAD with no ref of any kind pointing at them.
# THE RULE: if the ledger text this act is about to land TALKS ABOUT retrovalidation
# — a lane's rows, a ratification, an Opus seat — then the queue must ride along AND
# its blob must differ, whatever the chair's own seat is. A chair that means to land
# such a row with no enrolment must SAY SO, in one line, in the message file:
#     Enrols: none — <the reason>
# A false positive costs one sentence. A false negative costs a lane.
if ! grep -q '^Enrols: none — ' "$MSGFILE"; then
  NEWLEDGER=$(git -C "$REPO" diff "refs/heads/review-fixes-2026-07-08" -- docs/OWNER_DECISION_QUEUE.md 2>/dev/null | grep '^+' || true)
  if printf '%s' "$NEWLEDGER" | grep -qiE 'retrovalidation|retro row|RATIFIED|SEAT: Opus 5'; then
    QUEUED2=no
    for PAIR in "$@"; do
      case "${PAIR#*:}" in docs/FABLE_RETROVALIDATION_QUEUE.md) QUEUED2=yes; QSRC2="${PAIR%%:*}" ;; esac
    done
    if [ "$QUEUED2" != "yes" ]; then
      echo "ABORT: this ledger row speaks of retrovalidation but maps no queue (§882.14)."
      echo "  Enrol the lane's rows in docs/FABLE_RETROVALIDATION_QUEUE.md and map it here,"
      echo "  or write 'Enrols: none — <reason>' in the message file if it truly enrols nothing."
      exit 1
    fi
    QN2=$(git -C "$REPO" hash-object "$QSRC2")
    QO2=$(git -C "$REPO" rev-parse "refs/heads/review-fixes-2026-07-08:docs/FABLE_RETROVALIDATION_QUEUE.md" 2>/dev/null || echo none)
    if [ "$QN2" = "$QO2" ]; then
      echo "ABORT: the queue rides along UNCHANGED on a row that speaks of retrovalidation (§882.14)."
      echo "  Presence is not a row — the same law as §688.7, now on the Fable side too."
      exit 1
    fi
  fi
fi

# --- THE APPEND-ONLY PREFIX GATE (§883.5(c), RATIFIED §892) -------------------
# THE HAZARD, FOUND BY THE CHAIR WHILE APPENDING §883.5 AND STILL OPEN UNTIL NOW:
# three copies of docs/FABLE_RETROVALIDATION_QUEUE.md existed on disk and TWO WERE
# STALE, and this tool maps by whichever path it is handed, "silently and without
# comparison". Appending to the stale one would have landed a commit that DELETED
# four strata while passing every gate this program owns — because both existing
# arms (§688.7's and §882.14's) only ask whether the blob DIFFERS from the parent's,
# and a regression differs. §892 ratified the cure and recorded that it was still
# not installed in any copy of this script: `grep -ci prefix` returned 0 in all five
# preserved toolkits and in the live copy.
#
# THE CURE: an append-only file's new version must EXTEND its parent. Refuse any
# source whose first N bytes are not byte-identical to the parent blob's N bytes.
# A truncation, a stale copy, a mid-file edit and a reordering all fail; a genuine
# append passes. Proved by `git hash-object`, so the comparison is the same one git
# itself would make.
#
# ⛔ IT COVERS BOTH APPEND-ONLY FILES, NOT ONLY THE ONE THE RECORD FOUND. The ODQ is
# read UNCONDITIONALLY from the main checkout's working tree further down
# (`H=$(git hash-object -w docs/OWNER_DECISION_QUEUE.md)`) and had NO gate of any
# kind — and that checkout is a stale snapshot whose index carries ~29,663 staged
# ODQ deletions. It is the arm the record never had.
#
# ⚠ docs/PROVENANCE_MAP.tsv is DELIBERATELY NOT in this list. Its ROWS are additive
# but its documentation header is corrected in place (§922.7), so it is not
# byte-prefix append-only. Its additivity is gated by
# tests/scripts/provenanceMap.test.js arm 3 instead. Adding it here would be a
# false red; leaving it ungated here is a deliberate, recorded choice.
APPEND_ONLY_PATHS="docs/OWNER_DECISION_QUEUE.md docs/FABLE_RETROVALIDATION_QUEUE.md"

prefix_gate() {
  PG_SRC="$1"; PG_DST="$2"
  PG_OLD=$(git -C "$REPO" rev-parse "refs/heads/review-fixes-2026-07-08:$PG_DST" 2>/dev/null || echo none)
  if [ "$PG_OLD" = none ]; then return 0; fi   # a new file has no parent to extend
  PG_PSIZE=$(git -C "$REPO" cat-file -s "$PG_OLD")
  PG_SSIZE=$(wc -c < "$PG_SRC" | tr -d ' ')
  if [ "$PG_SSIZE" -lt "$PG_PSIZE" ]; then
    echo "ABORT: $PG_DST SHRANK — $PG_SSIZE B against the parent's $PG_PSIZE B (§883.5(c))."
    echo "  Source: $PG_SRC"
    echo "  An append-only file must EXTEND its parent. You are almost certainly holding a"
    echo "  STALE COPY: build it from 'git show HEAD:$PG_DST', verify by md5, THEN append."
    exit 1
  fi
  PG_PREFIX=$(head -c "$PG_PSIZE" "$PG_SRC" | git -C "$REPO" hash-object --stdin)
  if [ "$PG_PREFIX" != "$PG_OLD" ]; then
    echo "ABORT: $PG_DST does not CONTAIN its parent as a byte prefix (§883.5(c), §892)."
    echo "  Source: $PG_SRC"
    echo "  parent blob      : $PG_OLD ($PG_PSIZE B)"
    echo "  source's first ${PG_PSIZE}B: $PG_PREFIX"
    echo "  The first $PG_PSIZE bytes differ, so this is a REWRITE, not an append — a stale copy,"
    echo "  a mid-file edit or a reordering. Every other gate here passes it, because a"
    echo "  regression DIFFERS. Rebuild from 'git show HEAD:$PG_DST' and append."
    exit 1
  fi
}

# the ODQ, which this tool always takes from the working tree
for PG_P in $APPEND_ONLY_PATHS; do
  case "$PG_P" in
    docs/OWNER_DECISION_QUEUE.md) prefix_gate "$REPO/docs/OWNER_DECISION_QUEUE.md" "$PG_P" ;;
  esac
done
# every mapped path that is append-only
for PAIR in "$@"; do
  PG_D="${PAIR#*:}"
  for PG_P in $APPEND_ONLY_PATHS; do
    if [ "$PG_D" = "$PG_P" ]; then prefix_gate "${PAIR%%:*}" "$PG_D"; fi
  done
done

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
