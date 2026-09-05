#!/bin/sh
# certify.sh — OUTPUT (b): THE PER-PRESET CERTIFICATION RECEIPT — AND THE STOP THAT SAYS
# WHY SIX OF THE SEVEN CANNOT HAVE ONE.
#
#   sh certify.sh <tree> <outdir> [--years N] [--settlements N] [--preset id] [--dry]
#
# ⛔⛔ THE STOP, MEASURED AT THE DOCK TIP AND NOT ARGUED.
# The brief asked this script to produce "the per-preset receipt through the existing audit
# scripts, or a STOP saying which script cannot take a preset and why". It is the STOP.
#
#   WHICH SCRIPT.  scripts/audit/whole-world-soak.mjs — the only receipt producer. Its
#                  sibling scripts/audit/realm-scale-certification.mjs is not a second door:
#                  it SPAWNS that same soak (`:36 WHOLE_WORLD_SOAK`) with a `--lighting`
#                  overlay (`:209`), so both roads end at the same hardwired preset.
#   WHY.           `:298-302` hardwires `preset: SIMULATION_RULE_PRESETS.full_simulation.rules`.
#                  There is no `--preset`. The only seam is `--rules-json <path>`, spread LAST
#                  by `composeSoakRules` and therefore able to override full_simulation key
#                  for key — but ONLY for keys the overlay actually names.
#   THE LEAK.      MEASURED by preset-overlay.mjs over all seven presets at this tree:
#                    full_simulation     0 leaked keys   -> a CLEAN receipt is producible
#                    dramatic_campaign  14 leaked keys
#                    living_realm       15 leaked keys
#                    quiet_local        33 · realistic_regional 33 · narrative_campaign 33
#                    static_campaign    34 leaked keys
#                  The leaked keys are full_simulation's OPT-IN keys — `disastersEnabled`,
#                  `lineageClaimEnabled`, `commodityFlowEnabled`, `realmMagicDefault`, the
#                  WAVES and ONE_REGEN virtual keys — which are ABSENT from
#                  DEFAULT_SIMULATION_RULES, so `normalizeSimulationRules` never materialises
#                  them for a preset that does not name them. A "quiet_local" receipt taken
#                  through this seam would silently carry FULL SIMULATION's value for 33 keys.
#
#   THE CURE IS A CAR, NOT A PROBE. Give `whole-world-soak.mjs` a `--preset <id>` flag that
#   feeds `composeSoakRules({ preset })` directly. That is a product-byte edit and belongs to
#   a build lane with the chair's sign-off, not to a zero-byte probe.
#
#   ⛔ THE CURE THIS SCRIPT REFUSES TO TAKE. The overlay could be padded to totality by
#   inventing a value for each leaked key. Refused: a preset that does not carry a key does
#   not describe a world in which that key has a value, so the padded receipt would certify a
#   SYNTHETIC preset while being filed under a shipped one. Two of the leaked keys
#   (`realmMagicDefault`, `narrativeTempo`) are not even booleans, so the invention would be a
#   tuning choice wearing an instrument's name.
#
# WHAT THIS SCRIPT THEREFORE DOES: writes the overlays, records the leak report as EVIDENCE,
# runs the soak + certification for every preset that leaks ZERO keys, and exits non-zero with
# the roster of presets it refused. It never produces a receipt it cannot stand behind.
#
# ⚠ COST. One soak is `--years` years x `--settlements` settlements, three runs (A, B and the
# divergence arm C). Defaults here are DELIBERATELY SMALL (5 years / 4 settlements) so the
# chair chooses the real figures knowingly; the release profile is 30 years.

set -e

TREE="$1"; OUTDIR="$2"
[ -n "$TREE" ] && [ -n "$OUTDIR" ] || { echo "usage: sh certify.sh <tree> <outdir> [--years N] [--settlements N] [--preset id] [--dry]" >&2; exit 2; }
shift 2

KIT=$(cd "$(dirname "$0")" && pwd)
YEARS=5
SETTLEMENTS=4
ONLY=""
DRY=0
while [ $# -gt 0 ]; do
    case "$1" in
        --years) YEARS="$2"; shift 2 ;;
        --settlements) SETTLEMENTS="$2"; shift 2 ;;
        --preset) ONLY="$2"; shift 2 ;;
        --dry) DRY=1; shift ;;
        *) echo "certify.sh: unknown argument $1" >&2; exit 2 ;;
    esac
done

export DRY
# ⛔ THIS SCRIPT OWNS ITS OWN EXITS FILE AND NEVER INHERITS ONE. `run.sh` exports
# EXITS_FILE for its own steps; a child that inherited it and then truncated it would
# ERASE the parent's captured receipts — a silent loss of exactly the evidence this
# battery exists to produce.
EXITS_FILE="$OUTDIR/TRUE_EXITS.certify.txt"
export EXITS_FILE
mkdir -p "$OUTDIR"
: > "$EXITS_FILE"
# shellcheck source=/dev/null
. "$KIT/_lib.sh"

TREE=$(cd "$TREE" && pwd)
OUTDIR=$(cd "$OUTDIR" && pwd)
FIXTURES="$OUTDIR/f-birth-fixtures.json"
OVERLAYS="$OUTDIR/overlays"

if [ "$DRY" = "1" ]; then
    echo "DRY certify.sh"
    echo "  tree        $TREE"
    echo "  outdir      $OUTDIR"
    echo "  years       $YEARS   settlements $SETTLEMENTS   preset ${ONLY:-<all>}"
    echo "  1) node preset-overlay.mjs --fixtures $FIXTURES --tree $TREE --outdir $OVERLAYS"
    echo "  2) for each ZERO-LEAK preset:"
    echo "       node $TREE/scripts/audit/whole-world-soak.mjs --years $YEARS --settlements $SETTLEMENTS \\"
    echo "            --seed lprobe-<id> --rules-json $OVERLAYS/overlay.<id>.json \\"
    echo "            --receipt $OUTDIR/b-receipt.<id>.json --json"
    echo "       node $TREE/scripts/audit/certify-subsystems.mjs $OUTDIR/b-receipt.<id>.json --json \\"
    echo "            > $OUTDIR/b-certification.<id>.json"
    echo "  3) STOP with the refusal roster for every preset that leaks."
    echo "  reads  $FIXTURES (produced by run.sh step f — certify.sh does NOT birth its own)"
    exit 0
fi

if [ ! -s "$FIXTURES" ]; then
    echo "certify.sh: $FIXTURES is absent or empty. Run run.sh's birth-fixtures step first;" >&2
    echo "  this script deliberately does not birth its own, so the receipt and the fixture" >&2
    echo "  can never disagree about which resolved rules were certified." >&2
    exit 2
fi

# ── 1. the overlays and the leak report ─────────────────────────────────────────
set +e
node "$KIT/preset-overlay.mjs" --fixtures "$FIXTURES" --tree "$TREE" --outdir "$OVERLAYS" \
    ${ONLY:+--preset "$ONLY"} > "$OUTDIR/b-overlay.log" 2>&1
OVERLAY_STATUS=$?
set -e
note overlay "$OVERLAY_STATUS"
cat "$OUTDIR/b-overlay.log"

# ── 2. the receipts, for the zero-leak presets only ─────────────────────────────
# The roster comes from the FILES preset-overlay actually wrote, never from a list this
# script composes: a preset that leaked has no overlay file, so it cannot be certified by
# accident.
CERTIFIED=0
if [ -d "$OVERLAYS" ]; then
    for f in "$OVERLAYS"/overlay.*.json; do
        [ -e "$f" ] || continue
        id=$(basename "$f" .json); id=${id#overlay.}
        # The seed is per-preset so two presets never share a world; `--json` keeps the
        # soak's stdout machine-readable beside the receipt it writes.
        step "soak_$id" node "$TREE/scripts/audit/whole-world-soak.mjs" \
            --years "$YEARS" --settlements "$SETTLEMENTS" --seed "lprobe-$id" \
            --rules-json "$f" --receipt "$OUTDIR/b-receipt.$id.json" --json
        if [ -s "$OUTDIR/b-receipt.$id.json" ]; then
            set +e
            node "$TREE/scripts/audit/certify-subsystems.mjs" "$OUTDIR/b-receipt.$id.json" --json \
                > "$OUTDIR/b-certification.$id.json" 2> "$OUTDIR/b-certification.$id.err"
            CERT_STATUS=$?
            set -e
            note "certify_$id" "$CERT_STATUS"
            expect_file "$OUTDIR/b-certification.$id.json" '"rows"' "(b) certification for $id" || TRUE_EXIT=1
            CERTIFIED=$((CERTIFIED + 1))
        else
            echo "certify.sh: the soak wrote no receipt for $id — see the step's TRUE_EXIT above." >&2
            TRUE_EXIT=1
        fi
    done
fi

# ── 3. the STOP ─────────────────────────────────────────────────────────────────
LEAKS="$OVERLAYS/overlay-leak-report.json"
if [ -s "$LEAKS" ]; then
    echo "── the per-preset STOP (from $LEAKS) ──"
    node -e '
      const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
      for (const row of r.rows) {
        console.log(`  ${row.presetId.padEnd(22)} leaks=${String(row.leaks).padStart(3)}`
          + (row.leaks ? "  REFUSED — no receipt produced" : "  certified"));
      }
      console.log(`  ${r.presetsWithLeaks} of ${r.rows.length} preset(s) REFUSED.`);
      console.log("  CURE: give whole-world-soak.mjs a --preset flag (a CAR, chair-signed, not a probe).");
    ' "$LEAKS"
fi

echo "certify.sh: certified $CERTIFIED preset(s); receipts in $OUTDIR"
echo "TRUE_EXIT=$TRUE_EXIT"
exit "$TRUE_EXIT"
