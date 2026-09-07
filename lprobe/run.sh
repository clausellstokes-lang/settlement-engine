#!/bin/sh
# run.sh — THE L-PROBE DARK-ARM BATTERY. `LGT-C0-PROBE`, PLAN §6 POSITION 1.
#
#   sh run.sh <tree> <outdir> [--dry] [--cheap] [--base <BASE-TREE>] [--base-ref <REF>]
#                             [--soak-years N] [--settlements N]
#
# WHAT IT IS. Zero product bytes, zero commits, and the only control the eleven lighting
# declarations may quote. It must be measured on the tree the wave will actually light from —
# i.e. AFTER the PROSE consist lands, because 113 of prose's 200 paths are `src/domain/`
# modules OUTSIDE `display/` that emit text, and prose landing later would be mis-attributed
# to lighting.
#
# THE EIGHT OUTPUTS, and the helper that produces each:
#
#   (a) generatorGoldenMaster 3/3 + 0/525, and the bit-level dark arm   golden-control.sh
#   (b) a certification receipt per preset                              certify.sh
#   (c) the OSR per-parent presence dump (BEFORE any regeneration)      presence-dump.mjs
#   (d) the lighting-census tuple                                       census-probe.mjs
#   (e) the stability rosters                                           rosters.mjs
#   (f) a REAL-birth new-campaign fixture per preset                    birth-fixtures.mjs
#   (g) the 52-tick pulse hashes per preset                             pulse-hashes.mjs
#   (h) the class-C hashed-chunk LISTING diff                           listing.sh
#
#   plus  POSITION 1 STOP arm 1 — "does the preset catalog measure EAGER?"   eager-probe.mjs
#         (a SOURCE-level reading that needs no build — see that file's header)
#
# ⛔ ORDER IS NOT COSMETIC. (c) runs BEFORE anything that could regenerate the OSR baseline —
# that ordering IS the item, per PLAN §5.4. (f) runs before (b) and (g), because both consume
# the birth fixture's resolved rules and a second birth could disagree with the first.
#
# ⛔ THE FENCES, ENFORCED HERE RATHER THAN REMEMBERED:
#   * no register door is ever opened — no `--update`, `--write`, `--genesis`, `--rebank`, no
#     `LIGHTING_CENSUS_REFREEZE`, no `UPDATE_VOICE_BASELINE`. Every register act at the
#     landing is the chair's.
#   * every vitest and every build waits out the QUIET WINDOW and holds the GATE MUTEX.
#   * every child's EXACT status is captured in-shell to a `TRUE_EXIT_<step>=` line. A task
#     notification is not a receipt; one reported "exit code 0" over a red suite three times
#     in one day.
#   * no fallback branch prints a finding.
#
# `--cheap` runs only the steps that need neither vitest nor a build — (c) (d) (e) (f) (g)
# and the eager STOP. It is the right first pass: it is minutes, not hours, and it settles
# five of the eight outputs plus half the STOP.

set -e

TREE="$1"; OUTDIR="$2"
[ -n "$TREE" ] && [ -n "$OUTDIR" ] || {
    echo "usage: sh run.sh <tree> <outdir> [--dry] [--cheap] [--base <BASE-TREE>] [--base-ref <REF>] [--soak-years N] [--settlements N]" >&2
    exit 2
}
shift 2

KIT=$(cd "$(dirname "$0")" && pwd)
DRY=0
CHEAP=0
BASE=""
BASE_REF=""
SOAK_YEARS=5
SETTLEMENTS=4
while [ $# -gt 0 ]; do
    case "$1" in
        --dry) DRY=1; shift ;;
        --cheap) CHEAP=1; shift ;;
        --base) BASE="$2"; shift 2 ;;
        --base-ref) BASE_REF="$2"; shift 2 ;;
        --soak-years) SOAK_YEARS="$2"; shift 2 ;;
        --settlements) SETTLEMENTS="$2"; shift 2 ;;
        *) echo "run.sh: unknown argument $1" >&2; exit 2 ;;
    esac
done

mkdir -p "$OUTDIR"
OUTDIR=$(cd "$OUTDIR" && pwd)
TREE=$(cd "$TREE" && pwd)
EXITS_FILE="$OUTDIR/TRUE_EXITS.txt"
export EXITS_FILE DRY
: > "$EXITS_FILE"
# shellcheck source=/dev/null
. "$KIT/_lib.sh"

SHIM="--import $KIT/env-shim.mjs"

echo "L-PROBE dark-arm battery"
echo "  tree    $TREE"
echo "  outdir  $OUTDIR"
# ⛔ NOT `|| echo "(not a git tree)"`. A fallback branch must never print a finding: git can
# fail for reasons that have nothing to do with the tree being a repo, and the fallback would
# turn an unexplained failure into evidence. Report git's OWN stderr, or nothing.
set +e
HEAD_SHA=$(git -C "$TREE" rev-parse HEAD 2>&1); HEAD_STATUS=$?
DIRTY_OUT=$(git -C "$TREE" status --porcelain 2>&1); DIRTY_STATUS=$?
set -e
if [ "$HEAD_STATUS" -eq 0 ]; then echo "  HEAD    $HEAD_SHA"; else echo "  HEAD    UNREADABLE (git exit $HEAD_STATUS): $HEAD_SHA"; fi
if [ "$DIRTY_STATUS" -eq 0 ]; then
    echo "  dirty   $(printf '%s' "$DIRTY_OUT" | grep -c . ) entr(ies)"
else
    echo "  dirty   UNREADABLE (git exit $DIRTY_STATUS): $DIRTY_OUT"
fi
echo "  mode    $([ "$DRY" = 1 ] && echo DRY || echo LIVE)$([ "$CHEAP" = 1 ] && echo ' CHEAP' || echo '')"
echo

# ── STOP arm 1 — the preset catalog's eagerness. Source-level; no build. FIRST, because it
#    is seconds and it can halt the wave before anything expensive runs.
step eager_stop node "$KIT/eager-probe.mjs" --tree "$TREE" --out "$OUTDIR/stop-eager.json"

# ── (c) THE OSR PER-PARENT PRESENCE DUMP — BEFORE ANY REGENERATION. This position is the
#    item itself (PLAN §5.4), not a convenience.
step c_presence node "$KIT/presence-dump.mjs" --tree "$TREE" --out "$OUTDIR/c-presence-dump.json"

# ── (d) the lighting-census tuple
step d_census node "$KIT/census-probe.mjs" --tree "$TREE" --out "$OUTDIR/d-lighting-census.json"

# ── (e) the stability rosters
step e_rosters node "$KIT/rosters.mjs" --tree "$TREE" --out "$OUTDIR/e-stability-rosters.json"

# ── (f) the REAL-birth fixtures. Before (b) and (g), which both consume them.
#    ⛔ `--import env-shim.mjs` is REQUIRED: the store layer reads `import.meta.env`, which is
#    undefined under bare node. See env-shim.mjs for the measurement.
# shellcheck disable=SC2086
step f_birth node $SHIM "$KIT/birth-fixtures.mjs" --tree "$TREE" --out "$OUTDIR/f-birth-fixtures.json"

# ── (g) the 52-tick pulse hashes
# shellcheck disable=SC2086
step g_pulse node $SHIM "$KIT/pulse-hashes.mjs" --tree "$TREE" --out "$OUTDIR/g-pulse-hashes.json" --settlements "$SETTLEMENTS"

if [ "$CHEAP" = "1" ]; then
    echo
    echo "── --cheap: (a), (b) and (h) were NOT run. They are the vitest, soak and build arms. ──"
    echo "TRUE_EXIT=$TRUE_EXIT"
    exit "$TRUE_EXIT"
fi

# ── (a) the golden-master control and the bit-level dark arm ────────────────────
if [ -n "$BASE" ]; then
    step a_golden sh "$KIT/golden-control.sh" "$TREE" "$OUTDIR" --base "$BASE"
else
    step a_golden sh "$KIT/golden-control.sh" "$TREE" "$OUTDIR"
fi

# ── (b) the per-preset certification — and its measured STOP ────────────────────
step b_certify sh "$KIT/certify.sh" "$TREE" "$OUTDIR" --years "$SOAK_YEARS" --settlements "$SETTLEMENTS"

# ── (h) the class-C listing diff. TWO passes; the base is the pre-wave tree. ─────
if [ -n "$BASE_REF" ]; then
    step h_listing_base sh "$KIT/listing.sh" "$TREE" "$OUTDIR" --ref "$BASE_REF"
    step h_listing_tip sh "$KIT/listing.sh" "$TREE" "$OUTDIR" --ref HEAD --against "$OUTDIR/h-listing.base.json"
else
    echo "── (h) SKIPPED: no --base-ref given. The listing diff needs a PRE-WAVE ref to diff"
    echo "   against, and PLAN §8 forbids quoting any published closure figure as a stand-in."
    echo "   Re-run with --base-ref <the sha the wave boarded from>."
    printf 'SKIPPED_h_listing=(no --base-ref)\n' >> "$EXITS_FILE"
fi

echo
echo "── every captured exit ──"
cat "$EXITS_FILE"
echo "TRUE_EXIT=$TRUE_EXIT"
exit "$TRUE_EXIT"
