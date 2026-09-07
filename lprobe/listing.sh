#!/bin/sh
# listing.sh — OUTPUT (h): THE CLASS-C HASHED-CHUNK LISTING DIFF. Builds in a SCRATCH COPY,
# never in the dock, and never in the measured tree.
#
#   sh listing.sh <tree> <outdir> [--ref <git-ref>] [--against <base-measure.json>]
#                                 [--scratch <dir>] [--allow-dirty] [--keep] [--dry]
#
# ⛔⛔ THE THREE LAWS THIS SCRIPT IS BUILT AROUND, EACH OF WHICH HAS COST SOMEBODY A LANDING.
#
#  1. THE MEASURED TREE RECEIVES NO BUILD. `npm run build` writes `dist/`, and its `prebuild`
#     (`generate-sitemap.mjs`) and `postbuild` (`prerender-routes.mjs`) write more. A build in
#     the dock would drop artefacts into a tree the chair is about to gate. So the source is
#     extracted with `git archive <ref>` into a scratch root outside the tree, and the build
#     happens there.
#
#  2. ⛔⛔ `node_modules` IS SYMLINKED WHOLE AND NEVER MATERIALISED. Measured, both
#     directions: a dock whose packages are real copies instead of symlinks grew first paint
#     **8,551 B past budget** and failed a gate that had nothing wrong with it. `ln -s` of the
#     WHOLE directory preserves the tree's own form — a directory of package symlinks — so the
#     scratch build and the dock build see the same module graph. NEVER `npm install` here.
#
#  3. A DIRTY TREE IS REFUSED BY DEFAULT. `git archive <ref>` extracts the REF, not the
#     working tree, so a dirty dock would be built at HEAD while the chair believed it built
#     what is on disk — the "stale copy chosen silently" failure. This refuses and names the
#     dirty paths. `--allow-dirty` proceeds, and the refusal is recorded in the output either
#     way so no reader can miss it.
#
# THE STOP (PLAN §6 POSITION 1): the wave halts when any listing diff exceeds
# `(margin − 100 B)`, where the margin is the BASE build's headroom under
# `CLOSURE_BUDGET_BYTES` — a constant this kit reads out of
# `tests/build/vendorPdfLazy.test.js`, never from a record. PLAN §8's standing order is that
# every published closure figure (1,047,205 / 1,046,712 / 1,046,662 / 675,764) is at least six
# landings stale and NONE may be quoted, so both sides are measured, every time.
#
# USAGE IN TWO PASSES:
#   sh listing.sh <tree> <out> --ref <PRE-WAVE sha>            -> out/h-listing.base.json
#   sh listing.sh <tree> <out> --ref HEAD --against <that>     -> out/h-listing.tip.json + the STOP

set -e

TREE="$1"; OUTDIR="$2"
[ -n "$TREE" ] && [ -n "$OUTDIR" ] || { echo "usage: sh listing.sh <tree> <outdir> [--ref R] [--against F] [--scratch D] [--allow-dirty] [--keep] [--dry]" >&2; exit 2; }
shift 2

KIT=$(cd "$(dirname "$0")" && pwd)
REF="HEAD"
AGAINST=""
SCRATCH=""
ALLOW_DIRTY=0
KEEP=0
DRY=0
while [ $# -gt 0 ]; do
    case "$1" in
        --ref) REF="$2"; shift 2 ;;
        --against) AGAINST="$2"; shift 2 ;;
        --scratch) SCRATCH="$2"; shift 2 ;;
        --allow-dirty) ALLOW_DIRTY=1; shift ;;
        --keep) KEEP=1; shift ;;
        --dry) DRY=1; shift ;;
        *) echo "listing.sh: unknown argument $1" >&2; exit 2 ;;
    esac
done

export DRY
mkdir -p "$OUTDIR"
TREE=$(cd "$TREE" && pwd)
OUTDIR=$(cd "$OUTDIR" && pwd)
# The LABEL is fixed BEFORE the exits file is named, because this script runs TWICE into one
# outdir (base, then tip) and a shared exits file would let the second run truncate the
# first's receipts.
LABEL=$([ -n "$AGAINST" ] && echo tip || echo base)
# ⛔ THIS SCRIPT OWNS ITS OWN EXITS FILE AND NEVER INHERITS ONE. `run.sh` exports
# EXITS_FILE for its own steps; a child that inherited it and then truncated it would
# ERASE the parent's captured receipts — a silent loss of exactly the evidence this
# battery exists to produce.
EXITS_FILE="$OUTDIR/TRUE_EXITS.listing.$LABEL.txt"
export EXITS_FILE
: > "$EXITS_FILE"
# shellcheck source=/dev/null
. "$KIT/_lib.sh"

MEASURE="$OUTDIR/h-listing.$LABEL.json"
[ -n "$SCRATCH" ] || SCRATCH="$OUTDIR/scratch-build.$LABEL"

if [ "$DRY" = "1" ]; then
    echo "DRY listing.sh"
    echo "  tree        $TREE"
    echo "  ref         $REF          label $LABEL"
    echo "  scratch     $SCRATCH      (built here; the tree is NEVER built in)"
    echo "  1) git -C $TREE rev-parse $REF                      -> the measured sha"
    echo "  2) git -C $TREE status --porcelain                  -> REFUSE if dirty (unless --allow-dirty)"
    echo "  3) mkdir $SCRATCH && git -C $TREE archive $REF | tar -x -C $SCRATCH"
    echo "  4) ln -s $TREE/node_modules $SCRATCH/node_modules   ⛔ SYMLINK, never materialise"
    echo "  5) (cd $SCRATCH && npm run build)                   -> prebuild + vite build + postbuild"
    echo "  6) node closure-measure.mjs --dist $SCRATCH/dist --tree $SCRATCH --out $MEASURE${AGAINST:+ --against $AGAINST}"
    echo "  7) rm -rf $SCRATCH                                  (unless --keep)"
    echo "  STOP when closureDelta > (base marginBytes - 100)"
    exit 0
fi

SHA=$(git -C "$TREE" rev-parse "$REF")
DIRTY=$(git -C "$TREE" status --porcelain | wc -l | tr -d ' ')
echo "listing.sh: measuring ref $REF = $SHA (tree porcelain: $DIRTY entr(ies))"
if [ "$DIRTY" -ne 0 ] && [ "$ALLOW_DIRTY" -eq 0 ]; then
    echo "listing.sh: the tree has $DIRTY uncommitted entr(ies). \`git archive\` extracts the REF," >&2
    echo "  not the working tree, so this build would NOT be the build of what is on disk." >&2
    git -C "$TREE" status --porcelain >&2
    echo "  Pass --allow-dirty only if you mean to measure $SHA rather than the working tree." >&2
    note refuse_dirty 2
    exit 2
fi

rm -rf "$SCRATCH"
mkdir -p "$SCRATCH"
step archive sh -c "git -C '$TREE' archive '$REF' | tar -x -C '$SCRATCH'"
# ⛔ THE SYMLINK, NOT A COPY. See law 2 in the header.
ln -s "$TREE/node_modules" "$SCRATCH/node_modules"
if [ ! -e "$SCRATCH/node_modules/vite" ]; then
    echo "listing.sh: $SCRATCH/node_modules/vite is unreachable through the symlink — the build" >&2
    echo "  would fail for a reason unrelated to the wave. REFUSING." >&2
    note refuse_modules 2
    exit 2
fi
# ⛔ COUNT THE RECEIPT. An empty archive extraction passes every later `-d` check and a build
# over nothing can still leave a dist/ from a cached step.
FILES=$(find "$SCRATCH/src" -name '*.js' -o -name '*.jsx' 2>/dev/null | wc -l | tr -d ' ')
if [ "$FILES" -lt 100 ]; then
    echo "listing.sh: the extraction produced only $FILES src modules — that is not this repo. REFUSING." >&2
    note refuse_extract 2
    exit 2
fi
echo "listing.sh: extracted $FILES src modules to $SCRATCH"

quiet_window || { note quiet_window $?; exit "$TRUE_EXIT"; }
step build sh -c "cd '$SCRATCH' && npm run build"

if [ ! -f "$SCRATCH/dist/index.html" ]; then
    echo "listing.sh: the build produced no dist/index.html. See TRUE_EXIT_build above." >&2
    TRUE_EXIT=1
    echo "TRUE_EXIT=$TRUE_EXIT"
    exit "$TRUE_EXIT"
fi

if [ -n "$AGAINST" ]; then
    step measure node "$KIT/closure-measure.mjs" --dist "$SCRATCH/dist" --tree "$SCRATCH" --out "$MEASURE" --against "$AGAINST"
else
    step measure node "$KIT/closure-measure.mjs" --dist "$SCRATCH/dist" --tree "$SCRATCH" --out "$MEASURE"
fi
expect_file "$MEASURE" '"closureBytes"' "(h) the $LABEL listing" || TRUE_EXIT=1

# Record WHICH sha the measurement belongs to, inside the measurement.
node -e '
  const fs = require("fs");
  const [file, sha, ref, dirty] = process.argv.slice(1);
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  j.measuredRef = ref; j.measuredSha = sha; j.treePorcelainEntries = Number(dirty);
  fs.writeFileSync(file, `${JSON.stringify(j, null, 2)}\n`);
' "$MEASURE" "$SHA" "$REF" "$DIRTY"

[ "$KEEP" -eq 1 ] || rm -rf "$SCRATCH"
echo "listing.sh: $LABEL measurement -> $MEASURE"
echo "TRUE_EXIT=$TRUE_EXIT"
exit "$TRUE_EXIT"
