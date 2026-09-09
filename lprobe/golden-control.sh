#!/bin/sh
# golden-control.sh — OUTPUT (a): THE `generatorGoldenMaster` 3/3 + 0/525 CONTROL, and the
# BIT-LEVEL DARK ARM beside it.
#
#   sh golden-control.sh <tree> <outdir> [--base <BASE-TREE>] [--dry]
#
# TWO INSTRUMENTS, AND THEY ANSWER DIFFERENT QUESTIONS. Both are run, because either alone
# has a documented blind spot.
#
#   1. `tests/property/generatorGoldenMaster.test.js` — the COMMITTED manifest. 3 tests, and
#      a pass means ZERO of its 525 rows moved. The suite's own header records what a moving
#      row looks like ("305 rows of 525 moved", "0 rows added, 0 removed"), so the figure to
#      capture is the row movement, not merely the green.
#
#   2. `scripts/dormancy-bit-compare.mjs --arm generation` — 600 full generations, 6 tiers x
#      100 seeds, hashed through the committed dormancy oracle. Its own docblock says why it
#      exists: "§872's declared shift was visible ONLY to the informal probe … the golden arm
#      green (no pinned corpus carries it)". So the golden master CAN be green over a real
#      same-seed shift, and this arm is what sees it.
#
# ⛔ THE COMPARATOR REFUSES A SELF-COMPARISON, AND THAT REFUSAL IS LOAD-BEARING — "a
# comparator that can compare a thing with itself will eventually be asked to, and it will
# answer 'identical'". `--base` is therefore passed to the script as `--against` too, so the
# refusal fires here rather than being discovered in a clean diff.
#
# ⛔ THE UNFLOORED VERDICT IS NOT A PASS. When the tree's freeze register carries no
# `distinctFloor` for the arm's surface, the script prints UNFLOORED and says plainly that
# the run proves the corpus RAN, not that it DISCRIMINATES. This script forwards that verdict
# verbatim and never upgrades it.
#
# ⚠ THE VITEST STEP GOES THROUGH THE GATE MUTEX AND THE QUIET WINDOW. A targeted run that
# skipped the mutex has returned a sibling's workers as SKIPS and read green, and an
# under-load run reds DOOR 3 on a timeout that has nothing to do with the code.

set -e

TREE="$1"; OUTDIR="$2"
[ -n "$TREE" ] && [ -n "$OUTDIR" ] || { echo "usage: sh golden-control.sh <tree> <outdir> [--base <BASE-TREE>] [--dry]" >&2; exit 2; }
shift 2

KIT=$(cd "$(dirname "$0")" && pwd)
BASE=""
DRY=0
while [ $# -gt 0 ]; do
    case "$1" in
        --base) BASE="$2"; shift 2 ;;
        --dry) DRY=1; shift ;;
        *) echo "golden-control.sh: unknown argument $1" >&2; exit 2 ;;
    esac
done

export DRY
# ⛔ THIS SCRIPT OWNS ITS OWN EXITS FILE AND NEVER INHERITS ONE. `run.sh` exports
# EXITS_FILE for its own steps; a child that inherited it and then truncated it would
# ERASE the parent's captured receipts — a silent loss of exactly the evidence this
# battery exists to produce.
EXITS_FILE="$OUTDIR/TRUE_EXITS.golden.txt"
export EXITS_FILE
mkdir -p "$OUTDIR"
: > "$EXITS_FILE"
# shellcheck source=/dev/null
. "$KIT/_lib.sh"

TREE=$(cd "$TREE" && pwd)
OUTDIR=$(cd "$OUTDIR" && pwd)
GOLDEN_LOG="$OUTDIR/a-goldenMaster.log"
TIP_TSV="$OUTDIR/a-dormancy.tip.tsv"
TIP_ERR="$OUTDIR/a-dormancy.tip.summary.txt"

if [ "$DRY" = "1" ]; then
    echo "DRY golden-control.sh"
    echo "  tree   $TREE"
    echo "  base   ${BASE:-<none — the tip arm only>}"
    echo "  1) quiet window: $QUIET_PROBES consecutive probes, load-1 < $QUIET_LOAD_CEILING, zero vitest/worker processes"
    echo "  2) sh $TREE/scripts/gate-mutex.sh --run -- npx vitest run tests/property/generatorGoldenMaster.test.js"
    echo "       -> $GOLDEN_LOG    expect 3 passed, 0 of 525 rows moved"
    echo "  3) node $TREE/scripts/dormancy-bit-compare.mjs --tree $TREE --arm generation${BASE:+ --against $BASE}"
    echo "       -> $TIP_TSV (600 rows)   summary -> $TIP_ERR"
    if [ -n "$BASE" ]; then
        echo "  4) node $BASE/scripts/dormancy-bit-compare.mjs --tree $BASE --arm generation --against $TREE"
        echo "       -> $OUTDIR/a-dormancy.base.tsv"
        echo "  5) diff base.tsv tip.tsv -> $OUTDIR/a-dormancy.diff.txt   (expect EMPTY on a dark arm)"
    fi
    echo "  ⛔ never over an out/ tree; never a self-comparison; UNFLOORED is not a pass"
    exit 0
fi

# ── 1 + 2. the committed manifest ───────────────────────────────────────────────
quiet_window || { note quiet_window $?; exit "$TRUE_EXIT"; }
step golden_master sh -c "cd '$TREE' && sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/generatorGoldenMaster.test.js > '$GOLDEN_LOG' 2>&1"
# The figures, taken FROM the log rather than asserted about it.
if [ -s "$GOLDEN_LOG" ]; then
    echo "── generatorGoldenMaster, quoted from its own output ──"
    set +e
    SUMMARY=$(grep -E 'Tests +[0-9]|Test Files +[0-9]|passed|failed' "$GOLDEN_LOG" | tail -8)
    set -e
    if [ -n "$SUMMARY" ]; then
        printf '%s\n' "$SUMMARY"
    else
        # ⛔ Not a finding. The log exists but carries no summary line, which is itself
        # abnormal — say exactly that and show the tail rather than implying a result.
        echo "  NO SUMMARY LINE in $GOLDEN_LOG. Its last 20 lines, verbatim:"
        tail -20 "$GOLDEN_LOG" | sed 's/^/    /'
        TRUE_EXIT=1
    fi
else
    echo "golden-control.sh: $GOLDEN_LOG is empty — the run left no output at all." >&2
    TRUE_EXIT=1
fi

# ── 3. the bit-level dark arm at the tip ────────────────────────────────────────
if [ -n "$BASE" ]; then
    step dormancy_tip sh -c "node '$TREE/scripts/dormancy-bit-compare.mjs' --tree '$TREE' --arm generation --against '$BASE' > '$TIP_TSV' 2> '$TIP_ERR'"
else
    step dormancy_tip sh -c "node '$TREE/scripts/dormancy-bit-compare.mjs' --tree '$TREE' --arm generation > '$TIP_TSV' 2> '$TIP_ERR'"
fi
expect_file "$TIP_TSV" "" "(a) the tip dormancy corpus" || TRUE_EXIT=1
ROWS=$(wc -l < "$TIP_TSV" | tr -d ' ')
if [ "$ROWS" -ne 600 ]; then
    echo "golden-control.sh: the generation arm produced $ROWS rows, not 600. A short corpus" >&2
    echo "  hashes stably to a wrong constant and reads as a pass. REFUSING to call this a control." >&2
    TRUE_EXIT=1
fi
echo "── dormancy-bit-compare (tip), its own summary ──"
cat "$TIP_ERR"

# ── 4 + 5. the two-tree diff, when a base is named ──────────────────────────────
if [ -n "$BASE" ]; then
    BASE=$(cd "$BASE" && pwd)
    if [ "$BASE" = "$TREE" ]; then
        echo "golden-control.sh: --base and <tree> are the same path. The comparator refuses a" >&2
        echo "  self-comparison and so does this script: the answer would be 'identical' whatever" >&2
        echo "  the pipeline does." >&2
        note refuse_self 2
        exit 2
    fi
    BASE_TSV="$OUTDIR/a-dormancy.base.tsv"
    step dormancy_base sh -c "node '$BASE/scripts/dormancy-bit-compare.mjs' --tree '$BASE' --arm generation --against '$TREE' > '$BASE_TSV' 2> '$OUTDIR/a-dormancy.base.summary.txt'"
    expect_file "$BASE_TSV" "" "(a) the base dormancy corpus" || TRUE_EXIT=1
    set +e
    diff "$BASE_TSV" "$TIP_TSV" > "$OUTDIR/a-dormancy.diff.txt" 2>&1
    DIFF_STATUS=$?
    set -e
    note dormancy_diff "$DIFF_STATUS"
    if [ -f "$OUTDIR/a-dormancy.diff.txt" ]; then
        MOVED=$(grep -c '^<' "$OUTDIR/a-dormancy.diff.txt" 2>/dev/null || printf 0)
        echo "── dormancy diff: $MOVED of 600 rows moved base -> tip ──"
        if [ "$DIFF_STATUS" -eq 0 ]; then
            echo "  (empty diff — the arm is DARK across these two trees)"
        fi
    else
        echo "── dormancy diff: NO DIFF FILE WAS WRITTEN. See TRUE_EXIT_dormancy_diff above. ──"
        TRUE_EXIT=1
    fi
fi

echo "TRUE_EXIT=$TRUE_EXIT"
exit "$TRUE_EXIT"
