#!/bin/sh
# CLOSE-MEASURE-1 · the mechanical doors of the close, in order; stops at the first failure.
# Run from the root of a tree at the joined line's tip, with its own `npm ci`.
# Classes (a) and (c) only. It re-takes NO golden and NO pin (class b: the owner's door).
#
# The clean-tree law (LANE_LAW_ADDENDUM_EFF1 §3): the two vitest-driven refreezes
# (tuning, lighting) REFUSE a dirty tree. A CLOSE seat runs steps 1-6, COMMITS them,
# then runs 7-8 at the clean tip and commits the census bill.
#   close.sh            steps 1-6, then stops and asks for the commit
#   close.sh --refreeze steps 7-8 (tree must be clean)
#   close.sh --rehearse 7-8 first on the clean tree, then 1-6 (a measuring seat that
#                       commits nothing; equivalent because steps 1-6 add no test title
#                       and no tuning value)
set -u
SEAT="${CLOSE_SEAT:-CLOSE}"
LOG="${CLOSE_LOG:-/tmp/close-doors}"; mkdir -p "$LOG"
step() { n="$1"; shift; t0=$(date +%s); "$@" > "$LOG/$n.log" 2>&1; rc=$?; t1=$(date +%s)
  echo "$n rc=$rc secs=$((t1-t0))"; return $rc; }
# A refreeze exits non-zero ON SUCCESS by design; its receipt is the ordinary re-run that follows.
refreeze() { n="$1"; test="$2"; shift 2; t0=$(date +%s); env "$@" GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 "$test" > "$LOG/$n.refreeze.log" 2>&1
  GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 "$test" > "$LOG/$n.log" 2>&1; rc=$?; t1=$(date +%s); echo "$n rc=$rc secs=$((t1-t0))"; return $rc; }
doors() {
  step 1-edge-bundles       npm run build:edge-shared                                   || exit 1
  step 2-wiring-census      node scripts/wiring-census.mjs                              || exit 2
  step 3-writer-reach       node scripts/check-writer-reach.mjs --write                 || exit 3
  step 4-presumed-things    node scripts/presumed-things-door.mjs --shrink              || exit 4
  step 5-page-census        node scripts/census/page-census.mjs --shrink                || exit 5
  step 6-pool-dominance     node scripts/census/pool-dominance.mjs --bank-new           || exit 6
}
refreezes() {
  # Measured 2026-11-15 at a7209f903: this door REFUSES [POPULATION_GREW] (two src files gained
  # unregistered tuning values): a real break, cured in src, not here. CLOSE_SKIP=7 measures past it.
  case " ${CLOSE_SKIP:-} " in *" 7 "*) echo "7-tuning SKIPPED (CLOSE_SKIP)";; *)
  refreeze 7-tuning   tests/lint/tuningRegister.walker.test.js \
    TUNING_INVENTORY_REFREEZE="$SEAT" TUNING_INVENTORY_NOTE="the close: the joined line's tuning moves" || exit 7;; esac
  refreeze 8-lighting tests/lint/sovereigntyLightingContract.walker.test.js \
    LIGHTING_CENSUS_REFREEZE="$SEAT" LIGHTING_CENSUS_NOTE="the close: every new test title of the joined line" || exit 8
}
case "${1:-}" in
  --refreeze) refreezes ;;
  --rehearse) refreezes; doors ;;
  *) doors; echo "steps 1-6 done: COMMIT them, then run: close.sh --refreeze" ;;
esac
