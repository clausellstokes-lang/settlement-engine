#!/bin/bash
# chair-check.sh — THE CHAIR'S FULL-CHECK RUNNER (efficiency item 4; the owner's "Do all of this", 2026-09-20).
#
# It runs EXACTLY the seventeen stages of `npm run check` (read from package.json at run time and
# REFUSED if the chain is not the seventeen this script knows), with two differences and no others:
#   1. the three stages that are independent of each other and of the tests — typecheck:ratchet,
#      typecheck:domain:strict, lint — run SIDE BY SIDE (they are single-process tools; the serial
#      chain spent ~5 minutes on them one after another);
#   2. a red stage never BLINDS a later one (RUN 23 stopped in test:ratchet and never reached build
#      or verify:dist): every stage runs, every exit code is recorded, the verdict table prints all.
# The test ratchet still runs ALONE on the box (nothing else is running while it does), so no test
# budget meets extra contention; build then verify:dist follow it, in that order, as in the chain.
# ⛔ This is the chair's BATCH and TERMINAL instrument. The canonical serial `npm run check` still
#    runs unmodified in the pre-push hook before anything leaves the machine.
#
# usage: bash chair-check.sh <worktree> <label>        (logs under <SP>/checks/<label>/)
set -u
WT="$1"; LABEL="$2"
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad
OUT="$SP/checks/$LABEL"; mkdir -p "$OUT"
cd "$WT" || { echo "no worktree $WT"; exit 2; }
export GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20

EXPECTED="validate:hazard-registry validate:premortem validate:packets validate:data validate:custom-content-manifest validate:migration-head validate:edge validate:map validate:tuning-bands validate:foundry-module validate:mcp-server typecheck:ratchet typecheck:domain:strict lint test:ratchet build verify:dist"
ACTUAL="$(node -e "const s=require('./package.json').scripts.check;console.log(s.split(' && ').map(p=>p.replace(/^npm run /,'')).join(' '))")"
if [ "$ACTUAL" != "$EXPECTED" ]; then
  echo "REFUSED: package.json's check chain is not the seventeen stages this runner knows."; echo "  expected: $EXPECTED"; echo "  actual:   $ACTUAL"; exit 2
fi
[ -z "$(git status --short)" ] || { echo "REFUSED: $WT is dirty"; git status --short | head -5; exit 2; }
TIP="$(git rev-parse --short=9 HEAD)"
echo "chair-check $LABEL at $TIP in $WT — started $(date)" | tee "$OUT/verdict.txt"
rm -rf dist

run_stage() { # name -> writes <name>.log and <name>.exit
  local n="$1"; local f="${n//:/_}"
  local t0=$(date +%s)
  npm run "$n" > "$OUT/$f.log" 2>&1; local e=$?
  echo "$e" > "$OUT/$f.exit"; echo "$(( $(date +%s) - t0 ))" > "$OUT/$f.secs"
}

# S1 — the eleven validators, in chain order (fast; each recorded).
for n in validate:hazard-registry validate:premortem validate:packets validate:data validate:custom-content-manifest validate:migration-head validate:edge validate:map validate:tuning-bands validate:foundry-module validate:mcp-server; do run_stage "$n"; done
# S2 — the three independent single-process stages, side by side.
run_stage typecheck:ratchet & P1=$!
run_stage typecheck:domain:strict & P2=$!
run_stage lint & P3=$!
wait $P1 $P2 $P3
# S3 — the test ratchet, ALONE on the box (takes the exclusive mutex itself).
run_stage test:ratchet
# S4 — build, then the strict dist verification (takes the exclusive mutex itself).
run_stage build
run_stage verify:dist

FAIL=0
{
  echo; printf "%-34s %-5s %s\n" "stage" "exit" "seconds"
  for n in $EXPECTED; do f="${n//:/_}"; e="$(cat "$OUT/$f.exit")"; s="$(cat "$OUT/$f.secs")"; printf "%-34s %-5s %s\n" "$n" "$e" "$s"; [ "$e" = "0" ] || FAIL=1; done
  echo
  grep -h -E "\[test-ratchet\] (TEST REGRESSIONS|STRICT DIST|OK)|failing test\(s\) NOT in the frozen census|^    tests/.* :: " "$OUT/test_ratchet.log" "$OUT/verify_dist.log" 2>/dev/null | cut -c1-260 | head -40
  grep -h -E "built in" "$OUT/build.log" | tail -1
  echo "valid-packets line: $(grep -h -E '^valid:' "$OUT/validate_packets.log" | tail -1)"
  echo "chair-check $LABEL exit $FAIL at $(date) — tip $TIP"
} | tee -a "$OUT/verdict.txt"
exit $FAIL
