#!/bin/sh
# ratchet-inventory.sh — read a RED ratchet's CONTENTS at two refs and diff them.
#
#   sh scripts/ratchet-inventory.sh <walker-test-path> <base-ref> [head-ref]
#
# head-ref defaults to the LIVE WORKING TREE, which is the wave-end question: did my
# uncommitted work add a row to a ratchet that was already failing?
#
# ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────────────
#
# A ratchet that is RED AT BOTH ENDS produces a BYTE-IDENTICAL failing row in every
# report, and an EMPTY row-diff, while the inventory INSIDE it grows. So "the same 22
# files fail at both ends" is true and says nothing: the wave-end attribution rule is to
# diff the red ratchet's CONTENTS, not its row.
#
# Doing that BY HAND has now failed three times in one day, and the third failure is the
# one that made this script:
#
#   1. A lane reported the negative-assertion ratchet moving 71 → 73. The truth was
#      75 → 77. The DELTA was right and both ABSOLUTES were invented.
#   2. ES-1's gate receipt was false at the tree it described, and was corrected by the
#      chair in a later commit (8322b8ec).
#   3. ES-2 (84f50fe4) reported "69 rows / 269 un-anchored negatives at BOTH ends,
#      IDENTICAL as a multiset, nothing grew". The truth was 75 rows / 292 sites at base
#      and 76 / 293 at head — and the ONE row that grew was ES-2's own test file. The
#      reported figures match NEITHER end, so they were not measured at all.
#
# ⛔ THE ROOT CAUSE IS MECHANICAL, NOT MORAL, WHICH IS WHY A TOOL FIXES IT.
# VITEST NEVER PRINTS THE MEMBERS OF A FAILED ARRAY ASSERTION. The walker's row reads
#
#     AssertionError: expected [ …(76) ] to deeply equal []
#
# and that truncation is IDENTICAL in the default reporter and in `--reporter=json`
# (MEASURED 2026-08-06, vitest 4.1.8: the JSON reporter's `failureMessages[0]` was the
# same suppressed string). An agent reading either one can see the CARDINALITY and not a
# single member. Reconstructing 76 rows by hand, from a display that shows none of them,
# is exactly where invention creeps in — and a hazard that requires a careful human
# transcription EVERY SINGLE TIME will be got wrong.
#
# ── HOW IT GETS THE REAL MEMBERS ────────────────────────────────────────────────────
# A CUSTOM REPORTER (scripts/lib/ratchet-inventory-reporter.mjs) is handed the error
# object itself, whose `actual` property is the FULL serialized array — 46,907 characters
# for that same 76-row run. The truncation is a display step in the message formatter,
# not a property of the transported error. The comparer
# (scripts/lib/ratchet-inventory-compare.mjs) then checks the number of members it
# extracted against the cardinality vitest printed, and HARD-ERRORS on a mismatch rather
# than reporting a short list. A tool that can only ever say "clean" is worse than no
# tool, so it is proven RED as well as GREEN before it is trusted — see PROVEN BOTH WAYS
# at the bottom of this header.
#
# ── OUTPUT ──────────────────────────────────────────────────────────────────────────
# BASE and HEAD row counts, ONLY-IN-BASE and ONLY-IN-HEAD rows compared AS A MULTISET,
# and the exit code:
#   0 — HEAD grew nothing (rows at HEAD are a subset of BASE's)
#   1 — HEAD carries rows BASE does not (paste them into the wave's attribution)
#   2 — the measurement is untrustworthy (nothing ran, or extraction lost members)
#
# ── PROVEN BOTH WAYS, 2026-08-06 (the ES-2 repair round) ────────────────────────────
#   RED : base 8322b8ec vs head 84f50fe4 on the negative-assertion walker reported
#         exactly ONE only-in-head row — tests/domain/espionageGauntlet.test.js line
#         636 — which is the known ground truth of that wave.
#   GREEN: base 0be4800d vs head 8322b8ec (two different trees; that commit touches only
#         docs/) reported ONLY IN HEAD (0) and exited 0.
set -u

usage() {
    echo "usage: sh scripts/ratchet-inventory.sh <walker-test-path> <base-ref> [head-ref]" >&2
    echo "  head-ref defaults to the live working tree." >&2
    exit 2
}

[ "$#" -ge 2 ] || usage
WALKER="$1"
BASE_REF="$2"
HEAD_REF="${3:-}"

REPO=$(git rev-parse --show-toplevel) || exit 2
REPORTER="$REPO/scripts/lib/ratchet-inventory-reporter.mjs"
COMPARER="$REPO/scripts/lib/ratchet-inventory-compare.mjs"
[ -f "$REPORTER" ] || { echo "ratchet-inventory: missing $REPORTER" >&2; exit 2; }
[ -f "$COMPARER" ] || { echo "ratchet-inventory: missing $COMPARER" >&2; exit 2; }
[ -d "$REPO/node_modules" ] || { echo "ratchet-inventory: $REPO/node_modules is missing." >&2; exit 2; }

WORK=$(mktemp -d "${TMPDIR:-/tmp}/ratchet-inventory.XXXXXX") || exit 2

# ⛔ THE SYMLINK COMES OUT FIRST. Each archive tree carries a node_modules SYMLINK to the
# real one; removing the tree before the link would hand `rm -rf` the live dependency
# tree through it. Delete every symlink by name, then the directory.
cleanup() {
    find "$WORK" -maxdepth 2 -name node_modules -type l -exec rm -f {} + 2>/dev/null
    rm -rf "$WORK"
}
trap cleanup EXIT INT TERM

# Materialise one ref as a throwaway checkout with the real node_modules linked in.
# `git archive` (not checkout) — the checkout family discards uncommitted work.
materialise() {
    _ref="$1"
    _dir="$WORK/$2"
    mkdir -p "$_dir" || return 1
    git -C "$REPO" archive "$_ref" | tar -x -C "$_dir" || return 1
    ln -s "$REPO/node_modules" "$_dir/node_modules" || return 1
    printf '%s' "$_dir"
}

# Run the walker in one tree and capture the full inventory. vitest exits NON-ZERO when
# the ratchet is red, which is the expected case here — the capture file, not the exit
# code, is the evidence.
capture() {
    _tree="$1"
    _out="$2"
    _label="$3"
    [ -f "$_tree/$WALKER" ] || {
        echo "ratchet-inventory: $_label has no $WALKER" >&2
        return 1
    }
    sh "$REPO/scripts/gate-mutex.sh" --wait >/dev/null || {
        echo "ratchet-inventory: the vitest gate slot never came free." >&2
        return 1
    }
    echo "ratchet-inventory: running $WALKER at $_label …" >&2
    (
        cd "$_tree" || exit 1
        RATCHET_INVENTORY_OUT="$_out" ./node_modules/.bin/vitest run "$WALKER" \
            --reporter="$REPORTER" >"$WORK/$(basename "$_out").log" 2>&1
    )
    [ -f "$_out" ] || {
        echo "ratchet-inventory: no capture written at $_label — vitest log follows:" >&2
        tail -n 30 "$WORK/$(basename "$_out").log" >&2
        return 1
    }
}

BASE_TREE=$(materialise "$BASE_REF" base) || { echo "ratchet-inventory: cannot archive $BASE_REF" >&2; exit 2; }
capture "$BASE_TREE" "$WORK/base.json" "$BASE_REF" || exit 2

if [ -n "$HEAD_REF" ]; then
    HEAD_TREE=$(materialise "$HEAD_REF" head) || { echo "ratchet-inventory: cannot archive $HEAD_REF" >&2; exit 2; }
    HEAD_LABEL="$HEAD_REF"
else
    HEAD_TREE="$REPO"
    HEAD_LABEL="working tree ($(git -C "$REPO" rev-parse --short HEAD), $(git -C "$REPO" status --porcelain | wc -l | tr -d ' ') dirty path(s))"
fi
capture "$HEAD_TREE" "$WORK/head.json" "$HEAD_LABEL" || exit 2

echo "RATCHET INVENTORY — $WALKER"
node "$COMPARER" "$WORK/base.json" "$WORK/head.json" "$BASE_REF" "$HEAD_LABEL"
