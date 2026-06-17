#!/usr/bin/env bash
# A+ Phase 3 — deliberate-regression mutation sweep.
# For each enforced invariant ("area"), inject a regression, run ONLY the gate
# step that should catch it, assert it goes RED, then revert via git. Proves the
# enforcement spine holds the weight the docs claim. Leaves the tree clean.
#
# Run from repo root on a clean working tree for the touched files.
cd "$(dirname "$0")/.." || exit 2
PASS=0; FAIL=0
results=()

# check_caught <label> <file> <check-cmd>
# Call AFTER the file has been mutated. check-cmd must EXIT NONZERO when the
# regression is present (gate caught it). Always reverts <file> via git.
check_caught() {
  local label="$1" file="$2" check="$3"
  $check >/dev/null 2>&1; local code=$?
  git checkout -- "$file" 2>/dev/null
  if [ "$code" -ne 0 ]; then
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

echo ""
echo "── Mutation sweep results ──────────────────────────────"
for r in "${results[@]}"; do echo "  $r"; done
echo "────────────────────────────────────────────────────────"
echo "  CAUGHT: $PASS    MISSED: $FAIL"
if [ -n "$(git status --short src/ ARCHITECTURE.md 2>/dev/null)" ]; then
  echo "  WARNING: tree not clean after sweep:"; git status --short src/ ARCHITECTURE.md
fi
if [ "$FAIL" -eq 0 ]; then echo "  spine holds: every injected regression was caught."; else echo "  SPINE GAP: $FAIL regression(s) slipped past the gate."; fi
exit "$FAIL"
