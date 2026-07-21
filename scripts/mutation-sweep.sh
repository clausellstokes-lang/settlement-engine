#!/usr/bin/env bash
# A+ Phase 3 — deliberate-regression mutation sweep.
# For each enforced invariant ("area"), inject a regression, run ONLY the gate
# step that should catch it, assert it goes RED, then revert via git. Proves the
# enforcement spine holds the weight the docs claim. Leaves the tree clean.
#
# Run from repo root on a clean working tree for the touched files.
#
# CI wiring: this runs as the opt-in `mutation-sweep` job in
# .github/workflows/ci.yml — workflow_dispatch + a weekly cron ONLY, never
# per-push, because it runs a gate step once per injected mutation (slow). The
# job's fresh checkout is clean, so the dirty-tree guard below is a no-op there.
#
# SS4 hardening — ATTRIBUTION CONTROL. The old check_caught scored ANY nonzero
# exit as CAUGHT, so a gate erroring for an unrelated reason (a moved vitest
# target exits 1 with "No test files found" — EXECUTED) read as a healthy
# spine. Every area now re-runs its gate on the REVERTED (clean) tree: the red
# must be ATTRIBUTABLE to the mutation (mutated=red AND clean=green). A gate
# that is red either way is reported as GATE-BROKEN, not CAUGHT.
cd "$(dirname "$0")/.." || exit 2
PASS=0; FAIL=0
results=()

# ── Dirty-tree refusal guard ─────────────────────────────────────────────────
# This sweep MUTATES tracked files and reverts each with `git checkout -- <file>`.
# On a dirty tree that revert would DISCARD a maintainer's uncommitted work in
# any of those files. Refuse up front unless the files it touches are clean.
# Override for an intentional throwaway run with MUTATION_SWEEP_ALLOW_DIRTY=1.
MUTATED_FILES=(
  src/domain/userEdits.js
  src/generators/cascadeGenerator.js
  src/data/stressTypes.js
  src/data/categoryVocabulary.js
  src/data/entityTags.js
  src/domain/display/parityContract.js
  ARCHITECTURE.md
  src/domain/events/undoEvent.js
  src/lib/saves.js
  eslint.config.js
  supabase/config.toml
)
if [ "${MUTATION_SWEEP_ALLOW_DIRTY:-}" != "1" ]; then
  dirty="$(git status --porcelain -- "${MUTATED_FILES[@]}" 2>/dev/null)"
  if [ -n "$dirty" ]; then
    echo "mutation-sweep: refusing to run — files this sweep reverts have uncommitted changes:" >&2
    echo "$dirty" >&2
    echo "Commit or stash them first ('git checkout --' revert would discard them)." >&2
    echo "Set MUTATION_SWEEP_ALLOW_DIRTY=1 to override." >&2
    exit 2
  fi
fi

# check_caught <label> <file> <check-cmd>
# Call AFTER the file has been mutated. check-cmd must EXIT NONZERO when the
# regression is present (gate caught it). Always reverts <file> via git, then
# re-runs check-cmd on the clean tree: CAUGHT requires mutated=red AND
# clean=green (attribution), otherwise the gate itself is broken/mistargeted.
check_caught() {
  local label="$1" file="$2" check="$3"
  $check >/dev/null 2>&1; local code=$?
  git checkout -- "$file" 2>/dev/null
  $check >/dev/null 2>&1; local clean=$?
  if [ "$clean" -ne 0 ]; then
    results+=("BROKEN  GAP  $label  (gate red even without the mutation — misattributed/moved target?)"); FAIL=$((FAIL+1))
  elif [ "$code" -ne 0 ]; then
    results+=("CAUGHT  ok   $label"); PASS=$((PASS+1))
  else
    results+=("MISSED  GAP  $label  (gate stayed green)"); FAIL=$((FAIL+1))
  fi
}

# check_caught_missing <label> <file> <check-cmd>
# Variant for areas whose mutation is "the artifact went MISSING" (rename /
# renumber). Moves the file aside, expects red, restores, expects green.
check_caught_missing() {
  local label="$1" file="$2" check="$3"
  mv "$file" "$file.mutsweep.bak"
  $check >/dev/null 2>&1; local code=$?
  mv "$file.mutsweep.bak" "$file"
  $check >/dev/null 2>&1; local clean=$?
  if [ "$clean" -ne 0 ]; then
    results+=("BROKEN  GAP  $label  (gate red even with the file restored)"); FAIL=$((FAIL+1))
  elif [ "$code" -ne 0 ]; then
    results+=("CAUGHT  ok   $label"); PASS=$((PASS+1))
  else
    results+=("MISSED  GAP  $label  (gate stayed green)"); FAIL=$((FAIL+1))
  fi
}

echo "Running mutation sweep…"

# 1. Determinism — domain wall-clock ban (eslint)
printf '\nconst _mut = new Date();\n' >> src/domain/userEdits.js
check_caught "determinism/domain new Date()" src/domain/userEdits.js "npx eslint src/domain/userEdits.js"

# 2. Determinism — generators Math.random ban (eslint)
printf '\nconst _mut = Math.random();\n' >> src/generators/cascadeGenerator.js
check_caught "determinism/generators Math.random()" src/generators/cascadeGenerator.js "npx eslint src/generators/cascadeGenerator.js"

# 3. Data-layer purity — no runtime imports from src/data (eslint)
printf "\nimport { random as _m } from '../generators/rngContext.js';\n" >> src/data/stressTypes.js
check_caught "data-purity/src/data->generators import" src/data/stressTypes.js "npx eslint src/data/stressTypes.js"

# 4. Tag governance — dead priorityCategory (closed-set drift; vitest)
perl -0pi -e "s/  'criminal',\n/  'criminal',\n  'zzz_dead_role',\n/" src/data/categoryVocabulary.js
check_caught "data-schema.4/dead priorityCategory" src/data/categoryVocabulary.js "npx vitest run tests/data/categoryGovernance.test.js"

# 5. Orphan tag — entityTags vocabulary that nothing emits/selects (vitest)
perl -0pi -e "s/  PUBLIC_AUTHORITY: 'public_authority',\n/  PUBLIC_AUTHORITY: 'public_authority',\n  ZZZ_ORPHAN: 'zzz_orphan',\n/" src/data/entityTags.js
check_caught "data-schema.5/orphan TAG" src/data/entityTags.js "npx vitest run tests/data/dataVocabularyCoverage.test.js"

# 6. PDF parity — SHARED_FIELDS canonPath drift (vitest)
perl -0pi -e "s/canonPath: '/canonPath: 'zzz.broken./g" src/domain/display/parityContract.js
check_caught "pdf/parity canonPath drift" src/domain/display/parityContract.js "npx vitest run tests/pdf/viewModelParity.test.js"

# 7. Meta-pin — completeness claim with no @enforced-by (vitest)
printf '\nThis guarantee is machine-enforced.\n' >> ARCHITECTURE.md
check_caught "enforcement/meta-pin naked claim" ARCHITECTURE.md "npx vitest run tests/docs/enforcement-claims.test.js"

# 8. Undo inverse — drop a snapshot key so an event's undo is no longer a
#    byte-exact inverse (vitest whole-object round-trip pin, domain.5)
perl -0pi -e "s/CHANGE_RULING_POWER: Object.freeze\(\['powerStructure'\]\)/CHANGE_RULING_POWER: Object.freeze([])/" src/domain/events/undoEvent.js
check_caught "domain.5/undo inverse round-trip" src/domain/events/undoEvent.js "npx vitest run tests/domain/events/undoRoundTrip.test.js"

# 9. Faction-key precedence — a hand-rolled reversed `.name || .faction` read
#    (SS4; the class regrew twice by hand — the scan must catch the next one)
printf '\nconst _mutF = { name: "a", faction: "b" };\nexport const _mutName = _mutF.name || _mutF.faction;\n' >> src/generators/cascadeGenerator.js
check_caught "faction-key/reversed name-precedence read" src/generators/cascadeGenerator.js "npx vitest run tests/lint/factionNamePrecedenceScan.test.js"

# 10. Ghost column — a settlements column written but never read back (SS4;
#     the gallery opt-in data loss, generalized into a standing walker)
perl -0pi -e "s/  if \(entry.seed !== undefined\) row.seed = entry.seed;\n/  if (entry.seed !== undefined) row.seed = entry.seed;\n  if (entry.zzz !== undefined) row.zzz_ghost = entry.zzz;\n/" src/lib/saves.js
check_caught "state-lifecycle/ghost settlements column" src/lib/saves.js "npx vitest run tests/lib/savesColumnParity.test.js"

# 11. Determinism-ban shadow — a later flat-config block whose glob overlaps
#     src/domain silently REPLACES the whole determinism ban (last-wins). The
#     coverage pin must catch the shadow the moment it lands.
perl -0pi -e "s/  \.\.\.sizeBaselineOverrides,\n/  { files: ['src\/domain\/**\/*.js'], rules: { 'no-restricted-syntax': 'off' } },\n  ...sizeBaselineOverrides,\n/" eslint.config.js
check_caught "determinism/eslint last-wins shadow block" eslint.config.js "npx vitest run tests/lint/determinismBanCoverage.test.js"

# 12. Security runIf vacuity — a renumbered migration must red the reference
#     walker LOUDLY instead of silently skipping the runIf-gated suite (SS4;
#     runIf(false) with a guaranteed-fail test was EXECUTED to exit 0).
check_caught_missing "security/runIf migration renumber" supabase/migrations/087_review_money_hardening.sql "npx vitest run tests/security/migrationRefIntegrity.meta.test.js"

# 13. Security invariant — a LOOSENED verify_jwt platform gate (C4). Flip an
#     authenticated surface's config.toml pin true→false: the deploy source of
#     truth now says "no JWT" for a money/account endpoint. The census must red —
#     proving the security spine (not just its existence) catches a weakening,
#     the gap the sweep otherwise leaves against RLS/JWT/sanitizer invariants.
perl -0pi -e "s/\[functions.account-actions\]\nverify_jwt = true/[functions.account-actions]\nverify_jwt = false/" supabase/config.toml
check_caught "security/verify_jwt platform gate loosened" supabase/config.toml "npx vitest run tests/edgeFunctions/verifyJwtPins.test.js"

echo ""
echo "── Mutation sweep results ──────────────────────────────"
for r in "${results[@]}"; do echo "  $r"; done
echo "────────────────────────────────────────────────────────"
echo "  CAUGHT: $PASS    MISSED/BROKEN: $FAIL"
if [ -n "$(git status --short src/ eslint.config.js ARCHITECTURE.md supabase/migrations/ supabase/config.toml 2>/dev/null)" ]; then
  echo "  WARNING: tree not clean after sweep:"; git status --short src/ eslint.config.js ARCHITECTURE.md supabase/migrations/ supabase/config.toml
fi
if [ "$FAIL" -eq 0 ]; then echo "  spine holds: every injected regression was caught."; else echo "  SPINE GAP: $FAIL regression(s) slipped past the gate or the gate is broken."; fi
exit "$FAIL"
