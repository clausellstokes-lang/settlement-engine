#!/bin/sh
# certify.sh — OUTPUT (b): THE PER-PRESET CERTIFICATION RECEIPT.
#
#   sh certify.sh <tree> <outdir> [--years N] [--settlements N] [--preset id] [--dry]
#
# ⛔⛔ THE STOP THIS SCRIPT USED TO BE, AND WHY IT IS NO LONGER ONE (L-OVERLAY, 2026-09-05).
# Until DOCKET item 7 (§899, car `2200db6f3`) `scripts/audit/whole-world-soak.mjs` hardwired
# `preset: SIMULATION_RULE_PRESETS.full_simulation.rules`. The only seam to another preset was
# `--rules-json`, an OVERLAY spread LAST, which left every full_simulation opt-in key the
# target preset did not name still LIT — measured then: quiet_local 33, realistic_regional 33,
# narrative_campaign 33, static_campaign 34, living_realm 15, dramatic_campaign 14,
# full_simulation 0. Six of the seven could not be certified, and this script said so.
#
# ⭐ THAT CURE LANDED. The soak now takes `--preset <id>` as the COMPOSITION BASE (it REPLACES
# full_simulation rather than overlaying it), and `--preset` with `--rules-json` is REFUSED
# upstream. So the leak of the old seam is a property of a seam this script no longer uses.
#
# ⛔ WHAT REPLACED THE LEAK CHECK, BECAUSE THE NEW SEAM HAS ITS OWN FAILURE MODE.
# `composeSoakRules` is `{ ...preset, ...seasonsOverride, ...overlay }` — it does NOT
# normalize, while a real birth resolves through `prepareRulesUpdate` ->
# `normalizeSimulationRules`. The two agree at 38474a59e for ONE measured reason: the
# normalizer is a FIXED POINT on every shipped preset table, because `preset()` builds
# `{ ...DEFAULT_SIMULATION_RULES, presetId, ...overrides }` and no shipped override needs a
# coercion or a mirror-key lockstep. The day that stops being true the soak would certify a
# world no birth produces, silently. `preset-seam.mjs` therefore checks, per preset and in
# BOTH directions, that the soak's composed `fullRules` equal the REAL birth's resolved rules
# on keys, values and key order — and that norm(table) === table. A preset that fails gets no
# marker file, and the roster below is the marker files, so it cannot be certified by accident.
#
# ⛔ THE CURE THIS SCRIPT STILL REFUSES TO TAKE. Padding either side to make them match. A
# preset that does not carry a key does not describe a world in which that key has a value.
#
# ⭐ AND THE SEAM IS TIED TO THE WORLD THAT ACTUALLY RAN, not merely to a pure function: after
# each soak this script reads the receipt's own `subsystems.presetId` and
# `subsystems.stateKeys.simulationRules.finalEntries` back out and REFUSES a receipt whose
# world did not carry the preset and the rule-key count the seam check predicted.
#
# ⚠ COST. One soak is `--years` years x `--settlements` settlements, three runs (A, B and the
# divergence arm C). Defaults here are DELIBERATELY SMALL (5 years / 4 settlements) so the
# chair chooses the real figures knowingly; the release profile is 30 years. Wall-clock per
# preset is recorded in the exits file.

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
SEAM="$OUTDIR/seam"

if [ "$DRY" = "1" ]; then
    echo "DRY certify.sh"
    echo "  tree        $TREE"
    echo "  outdir      $OUTDIR"
    echo "  years       $YEARS   settlements $SETTLEMENTS   preset ${ONLY:-<all>}"
    echo "  1) node preset-seam.mjs --fixtures $FIXTURES --tree $TREE --out $SEAM"
    echo "  2) for each preset whose SEAM HOLDS:"
    echo "       node $TREE/scripts/audit/whole-world-soak.mjs --years $YEARS --settlements $SETTLEMENTS \\"
    echo "            --seed lprobe-<id> --preset <id> \\"
    echo "            --receipt $OUTDIR/b-receipt.<id>.json --json"
    echo "       READ BACK subsystems.presetId and subsystems.stateKeys.simulationRules.finalEntries"
    echo "       node $TREE/scripts/audit/certify-subsystems.mjs $OUTDIR/b-receipt.<id>.json --json \\"
    echo "            > $OUTDIR/b-certification.<id>.json"
    echo "  3) STOP with the refusal roster for every preset whose seam does not hold."
    echo "  ⛔ --preset REPLACES the base; --rules-json is NOT passed (the two are mutually refused)"
    echo "  reads  $FIXTURES (produced by run.sh step f — certify.sh does NOT birth its own)"
    exit 0
fi

if [ ! -s "$FIXTURES" ]; then
    echo "certify.sh: $FIXTURES is absent or empty. Run run.sh's birth-fixtures step first;" >&2
    echo "  this script deliberately does not birth its own, so the receipt and the fixture" >&2
    echo "  can never disagree about which resolved rules were certified." >&2
    exit 2
fi

# ── 1. the seam check: is a `--preset P` soak a REAL BIRTH of P? ────────────────
set +e
node "$KIT/preset-seam.mjs" --fixtures "$FIXTURES" --tree "$TREE" --out "$SEAM" \
    ${ONLY:+--preset "$ONLY"} > "$OUTDIR/b-seam.log" 2>&1
SEAM_STATUS=$?
set -e
note seam "$SEAM_STATUS"
cat "$OUTDIR/b-seam.log"

# ── 2. the receipts, for the presets whose seam HOLDS only ─────────────────────
# The roster comes from the MARKER FILES preset-seam.mjs actually wrote, never from a list
# this script composes: a preset that failed the seam has no marker, so it cannot be
# certified by accident.
CERTIFIED=0
if [ -d "$SEAM" ]; then
    for f in "$SEAM"/seam-ok.*; do
        [ -e "$f" ] || continue
        id=$(basename "$f"); id=${id#seam-ok.}
        # ⛔ `--preset` REPLACES the composition base. `--rules-json` is deliberately NOT
        # passed: the soak REFUSES both together, and passing an overlay here would restore
        # the very ambiguity this seam exists to end.
        T0=$(date +%s)
        step "soak_$id" node "$TREE/scripts/audit/whole-world-soak.mjs" \
            --years "$YEARS" --settlements "$SETTLEMENTS" --seed "lprobe-$id" \
            --preset "$id" --receipt "$OUTDIR/b-receipt.$id.json" --json
        T1=$(date +%s)
        printf 'WALL_SECONDS_soak_%s=%s\n' "$id" "$((T1 - T0))" >> "$EXITS_FILE"
        echo "  wall-clock soak_$id = $((T1 - T0))s (${YEARS}y x ${SETTLEMENTS} settlements, 3 runs)"

        if [ -s "$OUTDIR/b-receipt.$id.json" ]; then
            # ⭐ THE END-TO-END TIE. The seam check proved a PURE FUNCTION; this proves the
            # WORLD. The receipt's subsystems block is built from `runA.simulationRules`, the
            # object the soak's own fixture carried, so reading presetId and the container's
            # final entry count back out convicts a soak that composed something else.
            set +e
            node -e '
              const fs = require("fs");
              const receipt = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
              const seam = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
              const id = process.argv[3];
              const row = seam.rows.find((r) => r.presetId === id);
              if (!row) { console.error(`readback: no seam row for ${id}`); process.exit(1); }
              const problems = [];
              if (receipt.presetId !== id) problems.push(`receipt.presetId is ${JSON.stringify(receipt.presetId)}, not ${JSON.stringify(id)}`);
              const sub = receipt.subsystems || {};
              if (sub.presetId !== id) problems.push(`subsystems.presetId is ${JSON.stringify(sub.presetId)} — that field is read OFF THE COMPOSED RULES, so this says the world carried another preset`);
              const entries = sub.stateKeys && sub.stateKeys.simulationRules && sub.stateKeys.simulationRules.finalEntries;
              if (entries !== row.soakKeyCount) problems.push(`the world final simulationRules container held ${entries} entries; the seam predicted ${row.soakKeyCount} (== the real birth key count ${row.birthKeyCount})`);
              if (problems.length) { for (const p of problems) console.error(`  READBACK REFUSAL: ${p}`); process.exit(1); }
              console.log(`  readback ok: ${id} — receipt.presetId, subsystems.presetId and finalEntries=${entries} all match the seam`);
            ' "$OUTDIR/b-receipt.$id.json" "$SEAM/preset-seam-report.json" "$id"
            READBACK_STATUS=$?
            set -e
            note "readback_$id" "$READBACK_STATUS"

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

# ── 3. the roster ───────────────────────────────────────────────────────────────
REPORT="$SEAM/preset-seam-report.json"
if [ -s "$REPORT" ]; then
    echo "── the per-preset seam roster (from $REPORT) ──"
    node -e '
      const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
      for (const row of r.rows) {
        console.log(`  ${row.presetId.padEnd(22)} ${row.seamHolds ? "seam HOLDS — certified" : "SEAM BROKEN — REFUSED, no receipt produced"}`
          + `   soak=${row.soakKeyCount} birth=${row.birthKeyCount} keys`);
      }
      console.log(`  ${r.presetsRefused} of ${r.rows.length} preset(s) REFUSED.`);
    ' "$REPORT"
fi

echo "certify.sh: certified $CERTIFIED preset(s); receipts in $OUTDIR"
echo "TRUE_EXIT=$TRUE_EXIT"
exit "$TRUE_EXIT"
