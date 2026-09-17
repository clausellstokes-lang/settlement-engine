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
#
# E-A TOTALITY (A+ tranche 2): this sweep is one half of the mutation-coverage
# contract. The other half is scripts/mutation-coverage-manifest.json — every
# correctness-asserting invariant test file in the suite is enumerated there and
# must carry either a planted mutation below (kind:"mutation", label matching a
# check_caught* call here) or a documented rationale / baselined-uncovered entry.
# tests/lint/mutationCoverageManifest.test.js enforces the pairing BOTH ways:
# a label below with no manifest entry reds, a manifest "mutation" claim with no
# label below reds, and a NEW invariant file with no manifest entry reds. Keep
# labels stable — they are the join key.
cd "$(dirname "$0")/.." || exit 2
PASS=0; CLEAR=0; FAIL=0
results=()

# ── Dirty-tree refusal guard ─────────────────────────────────────────────────
# This sweep MUTATES tracked files and reverts each with `git checkout -- <file>`.
# On a dirty tree that revert would DISCARD a maintainer's uncommitted work in
# any of those files. Refuse up front unless the files it touches are clean.
# Override for an intentional throwaway run with MUTATION_SWEEP_ALLOW_DIRTY=1.
#
# TOTALITY: this list must name EVERY check_caught / check_caught_missing target
# below and nothing else — a missing entry is uncommitted-work destruction, a
# stale entry is an over-broad refusal. Hand-maintenance drifted (7 targets were
# missing), so the pairing is now machine-enforced both ways by
# tests/lint/mutationCoverageManifest.test.js. check_caught_planted targets are
# deliberately absent: that variant refuses to overwrite an existing path.
MUTATED_FILES=(
  src/domain/prose/composedWalker.js
  src/domain/prose/passageShapes.js
  src/domain/display/stateProse/composeStateProse.js
  src/data/dossierStateProse/stressors.generated.js
  src/domain/prose/wiringCensus.js
  src/domain/prose/wiringBranch.js
  scripts/prose-rate-corpus.mjs
  scripts/wiring-census.mjs
  scripts/prose-manifest-diff.mjs
  tests/helpers/dossierManifest.js
  src/domain/prose/entryWalker.js
  src/domain/prose/grammarWalker.js
  src/domain/prose/presenceMeasure.js
  src/domain/institutions/institutionTable.js
  src/domain/display/heraldIntegrity.js
  src/domain/userEdits.js
  src/generators/cascadeGenerator.js
  src/data/stressTypes.js
  src/copy/en.js
  src/data/categoryVocabulary.js
  src/data/entityTags.js
  src/domain/display/parityContract.js
  ARCHITECTURE.md
  src/domain/events/undoEvent.js
  src/lib/saves.js
  eslint.config.js
  supabase/config.toml
  src/App.jsx
  scripts/mutation-coverage-manifest.json
  src/domain/display/chroniclersLetter.js
  src/domain/simulationSpine.js
  src/generators/generateSettlementPipeline.js
  src/design/townGlyphs/medieval.js
  src/lib/flagRegistry.js
  tests/copy/.composed-prose-seams-baseline.json
  src/domain/realm/heraldRouting.js
  src/domain/townMap/audienceProjection.js
  src/domain/townScene/sceneProjection.js
  supabase/migrations/182_operational_obligation_health.sql
  supabase/migrations/183_application_command_journal.sql
  supabase/migrations/184_import_reconciliation_commands.sql
  src/store/canonEventCommandTransaction.js
  src/store/campaignImportedCreation.js
  src/domain/display/economyFreshness.js
  src/components/new/tabs/EconomicsTab.jsx
  src/store/operationRegistry.js
  src/store/aiChronicleAppend.js
  src/store/neighbourSlice.js
  src/generators/steps/assembleInstitutions.js
  tests/fixtures/distribution-envelopes.manifest.json
  src/domain/display/discourseKernel.js
  src/domain/townMap/arch/params.js
  src/components/nav/FletchBand.jsx
  src/domain/townMap/arch/kit.js
  src/domain/townMap/arch/conditionParams.js
  src/domain/dossier/realmEntityWeb.js
  tests/security/aiSpendSafety.pglite.test.js
  tests/security/systemConfigPublicRead.pglite.test.js
  supabase/migrations/087_review_money_hardening.sql
  src/lib/worldExport.js
  src/generators/narrative/settlementOriginProse.js
  tests/lint/.coupling-inclusion-baseline.json
  src/domain/certification/couplingRegistryWar.js
  src/domain/spatial/spatialLedgerAccess.js
  src/domain/worldPulse/brokeragePlantHandoff.js
  src/domain/townMap/siteGenesis.js
  src/domain/worldPulse/worldPulseFeedCuration.js
  src/lib/chronicle.js
  src/kernel/prng.js
  src/lib/instantWorld/factionDedup.js
  src/domain/deitySnapshot.js
  src/domain/worldPulse/disposition.js
  src/domain/display/stateProse/dossierMounts.js
  src/domain/content/customContentCharset.generated.js
  tests/fixtures/.golden-freeze-register.json
  src/domain/display/publicSafe.js
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

# check_caught <label> <file> <check-cmd> [expected-full-title]
# Call AFTER the file has been mutated. check-cmd must EXIT NONZERO when the
# regression is present (gate caught it). Always reverts <file> via git, then
# re-runs check-cmd on the clean tree: CAUGHT requires mutated=red AND
# clean=green (attribution), otherwise the gate itself is broken/mistargeted.
#
# PLANT VERIFICATION — a perl substitution whose anchor no longer matches writes
# NOTHING and exits 0. The gate then stays green on an UNMUTATED tree and the
# area scores "MISSED (gate stayed green)": the operator is told the gate is
# weak when in truth the plant never fired. The dirty-tree guard above proves
# every target matched the index before the sweep started (an untracked target
# would have shown as `??` and refused the run), so a target that still matches
# the index here was never mutated — grade that BROKEN, which is
# self-diagnosing. (Under MUTATION_SWEEP_ALLOW_DIRTY=1 the premise does not
# hold, so the check is skipped rather than lying in the other direction.)
check_caught() {
  local label="$1" file="$2" check="$3" expected_title="${4:-}"
  if [ "${MUTATION_SWEEP_ALLOW_DIRTY:-}" != "1" ] && git diff --quiet -- "$file" 2>/dev/null; then
    results+=("BROKEN  GAP  $label  (mutation did not apply — $file is unchanged; stale anchor?)"); FAIL=$((FAIL+1))
    return
  fi
  local mutated_output clean_output
  mutated_output="$(NO_COLOR=1 $check 2>&1)"; local code=$?
  git checkout -- "$file" 2>/dev/null; local restore=$?
  if [ "$restore" -ne 0 ] || ! git diff --quiet -- "$file" 2>/dev/null; then
    results+=("BROKEN  GAP  $label  (target did not restore byte-identically: $file)"); FAIL=$((FAIL+1))
    return
  fi
  clean_output="$(NO_COLOR=1 $check 2>&1)"; local clean=$?
  if [ "$clean" -ne 0 ]; then
    results+=("BROKEN  GAP  $label  (gate red even without the mutation — misattributed/moved target?)"); FAIL=$((FAIL+1))
  elif [ -n "$expected_title" ] && [ "$code" -ne 0 ]; then
    local line trimmed suffix=" > $expected_title" title_matches=0
    while IFS= read -r line || [ -n "$line" ]; do
      trimmed="${line#"${line%%[!$' \t']*}"}"
      if [[ "$trimmed" == FAIL\ * && "$trimmed" == *"$suffix" ]]; then
        title_matches=$((title_matches+1))
      fi
    done <<< "$mutated_output"
    if [ "$title_matches" -eq 1 ]; then
      results+=("CAUGHT  ok   $label"); PASS=$((PASS+1))
    elif [ "$title_matches" -eq 0 ]; then
      results+=("BROKEN  GAP  $label  (missing expected failure: $expected_title)"); FAIL=$((FAIL+1))
    else
      results+=("BROKEN  GAP  $label  (ambiguous expected failure: $expected_title matched $title_matches lines)"); FAIL=$((FAIL+1))
    fi
  elif [ "$code" -ne 0 ]; then
    results+=("CAUGHT  ok   $label"); PASS=$((PASS+1))
  else
    results+=("MISSED  GAP  $label  (gate stayed green)"); FAIL=$((FAIL+1))
  fi
}

# check_clear <label> <file> <check-cmd> <expected-passed-count>
# Negative-control variant: the planted and restored forms must both stay green
# and must each report the exact two-file and test-count summaries.
check_clear() {
  local label="${1:-<missing-label>}"
  if [ "$#" -ne 4 ]; then
    results+=("BROKEN  GAP  $label  (check_clear requires exactly four arguments)"); FAIL=$((FAIL+1))
    return
  fi
  local file="$2" check="$3" expected_count="$4"
  if ! [[ "$expected_count" =~ ^[1-9][0-9]*$ ]] \
      || [ "${#expected_count}" -gt 16 ] \
      || { [ "${#expected_count}" -eq 16 ] && [[ "$expected_count" > 9007199254740991 ]]; }; then
    results+=("BROKEN  GAP  $label  (expected passed count is not a positive safe integer: $expected_count)"); FAIL=$((FAIL+1))
    return
  fi
  if [ "${MUTATION_SWEEP_ALLOW_DIRTY:-}" != "1" ] && git diff --quiet -- "$file" 2>/dev/null; then
    results+=("BROKEN  GAP  $label  (mutation did not apply — $file is unchanged; stale anchor?)"); FAIL=$((FAIL+1))
    return
  fi
  local mutated_output clean_output
  mutated_output="$(NO_COLOR=1 $check 2>&1)"; local code=$?
  git checkout -- "$file" 2>/dev/null; local restore=$?
  if [ "$restore" -ne 0 ] || ! git diff --quiet -- "$file" 2>/dev/null; then
    results+=("BROKEN  GAP  $label  (target did not restore byte-identically: $file)"); FAIL=$((FAIL+1))
    return
  fi
  clean_output="$(NO_COLOR=1 $check 2>&1)"; local clean=$?

  local expected_files="Test Files 2 passed (2)"
  local expected_tests="Tests $expected_count passed ($expected_count)"
  local mutated_files=0 mutated_tests=0 clean_files=0 clean_tests=0
  local output line normalized
  for output in "$mutated_output" "$clean_output"; do
    local files=0 tests=0
    while IFS= read -r line || [ -n "$line" ]; do
      normalized="${line//$'\t'/ }"
      while [[ "$normalized" == *"  "* ]]; do normalized="${normalized//  / }"; done
      normalized="${normalized#"${normalized%%[! ]*}"}"
      normalized="${normalized%"${normalized##*[! ]}"}"
      [ "$normalized" = "$expected_files" ] && files=$((files+1))
      [ "$normalized" = "$expected_tests" ] && tests=$((tests+1))
    done <<< "$output"
    if [ "$output" = "$mutated_output" ] && [ "$mutated_files" -eq 0 ] && [ "$mutated_tests" -eq 0 ]; then
      mutated_files=$files; mutated_tests=$tests
    else
      clean_files=$files; clean_tests=$tests
    fi
  done

  if [ "$code" -ne 0 ]; then
    results+=("BROKEN  GAP  $label  (negative control red while planted: exit $code)"); FAIL=$((FAIL+1))
  elif [ "$mutated_files" -ne 1 ] || [ "$mutated_tests" -ne 1 ]; then
    results+=("BROKEN  GAP  $label  (planted summaries wrong: files=$mutated_files tests=$mutated_tests)"); FAIL=$((FAIL+1))
  elif [ "$clean" -ne 0 ]; then
    results+=("BROKEN  GAP  $label  (negative control red after restoration: exit $clean)"); FAIL=$((FAIL+1))
  elif [ "$clean_files" -ne 1 ] || [ "$clean_tests" -ne 1 ]; then
    results+=("BROKEN  GAP  $label  (restored summaries wrong: files=$clean_files tests=$clean_tests)"); FAIL=$((FAIL+1))
  else
    results+=("CLEAR   ok   $label"); CLEAR=$((CLEAR+1))
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

# check_caught_planted <label> <path> <content> <check-cmd>
# Variant for areas whose mutation is "a NEW offending artifact LANDED" (a
# migration without RLS, an unmetered edge function). Writes <content> to <path>
# (creating parent dirs), expects red, deletes it (and any dir it created),
# expects green. The planted path must not previously exist — refuses otherwise
# so it can never delete a real file.
check_caught_planted() {
  local label="$1" file="$2" content="$3" check="$4"
  if [ -e "$file" ]; then
    results+=("BROKEN  GAP  $label  (planted path already exists — refusing to overwrite: $file)"); FAIL=$((FAIL+1))
    return
  fi
  local dir; dir="$(dirname "$file")"
  local made_dir=0
  if [ ! -d "$dir" ]; then mkdir -p "$dir"; made_dir=1; fi
  printf '%s\n' "$content" > "$file"
  $check >/dev/null 2>&1; local code=$?
  rm -f "$file"
  if [ "$made_dir" -eq 1 ]; then rmdir "$dir" 2>/dev/null; fi
  $check >/dev/null 2>&1; local clean=$?
  if [ "$clean" -ne 0 ]; then
    results+=("BROKEN  GAP  $label  (gate red even with the planted file removed)"); FAIL=$((FAIL+1))
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
check_caught "enforcement/meta-pin naked claim" ARCHITECTURE.md "npx vitest run tests/docs/enforcement-claims.test.js -t seventh --no-file-parallelism --reporter=verbose" "the banked naked-claim debt is frozen PER CLAIM — a seventh cannot hide inside it"

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

# ── E-A totality areas (14-22) — one planted mutation per invariant family the
# ── first 13 left unproven; see scripts/mutation-coverage-manifest.json ───────

# 14. Size ratchet — a baselined file grows ONE effective line past its frozen
#     tolerance-0 ceiling (App.jsx is frozen at its exact current count; the
#     baseline-honesty test must red on any drift, either direction).
printf '\nconst _mutSizeSweep = 1;\n' >> src/App.jsx
check_caught "size-ratchet/App.jsx grows past frozen ceiling" src/App.jsx "npx vitest run tests/lint/sizeBaseline.test.js"

# 15. Domain strict ratchet — a new implicit-any strict error lands in the
#     strict-clean domain kernel (ceiling 0). Gate = the enforcing script
#     itself, run bare (never piped — exit code is the signal).
printf '\nexport function _mutStrictProbe(q) { return q; }\n' >> src/domain/userEdits.js
check_caught "domain-strict/new implicit-any error" src/domain/userEdits.js "node scripts/check-domain-strict.mjs"

# 16. Committed-secrets scan — a synthetic AWS access-key shape lands in a
#     tracked text file (the scanner reads the working tree of tracked files,
#     so the uncommitted mutation is exactly what it must catch).
#     ⚠ The probe is built by CONCATENATION (the scanner's own idiom): this
#     script is itself a tracked text file in the scan corpus, so a contiguous
#     key literal here would red the gate on the CLEAN tree (proven: the first
#     totality run scored this area BROKEN for exactly that reason).
printf '\nmutation probe: %s\n' "AKIA""ABCDEFGHIJKLMNOP" >> ARCHITECTURE.md
check_caught "secrets/committed AWS key shape" ARCHITECTURE.md "npx vitest run tests/security/committedSecretsScan.test.js"

# 17. Whole-schema RLS census — a migration CREATES a public table and never
#     enables row level security (the unauthorized-access habitat).
check_caught_planted "security/public table without RLS" \
  supabase/migrations/zzz_mutation_sweep_probe.sql \
  "create table public.zzz_mutsweep_probe (id uuid primary key);" \
  "npx vitest run tests/security/publicTableRlsCensus.test.js"

# 18. AI metering census — a new edge function spends credits with NO
#     ai_usage_events insert (COGS burns invisibly; the census must red).
check_caught_planted "ai-cost/unmetered spend_credits function" \
  supabase/functions/zzz-mutsweep-probe/index.ts \
  "const r = await supabase.rpc('spend_credits', { amount: 1 });" \
  "npx vitest run tests/edgeFunctions/aiMeteringCensus.test.js"

# 19. Determinism — a localeCompare CALL in a seeded producer tree (host-ICU
#     collation forks same-seed worlds across devices/locales).
printf '\nexport const _mutLocale = (a, b) => a.localeCompare(b);\n' >> src/generators/cascadeGenerator.js
check_caught "determinism/localeCompare in generators" src/generators/cascadeGenerator.js "npx vitest run tests/lint/localeCompareGuard.test.js"

# 20. Determinism — a transcendental (Math.pow) lands in the domain kernel
#     (implementation-approximated per spec; forks same-seed worlds across
#     ENGINES while same-engine goldens stay green).
printf '\nexport const _mutTrans = Math.pow(2, 3);\n' >> src/domain/userEdits.js
check_caught "determinism/transcendental Math.pow in domain" src/domain/userEdits.js "npx vitest run tests/lint/transcendentalMathBaseline.test.js"

# 21. Voice mechanics — an exclamation point lands in the common copy registry.
#     The filtered registry assertion must own this exact red.
perl -0pi -e "s/    save:        'Save',/    save:        'Save!',/" src/copy/en.js
check_caught "voice/exclamation in scanned data prose" src/copy/en.js "npx vitest run tests/copy/voiceMechanics.test.js -t en.registry --no-file-parallelism --reporter=verbose" "en registry is clean"

# 22. Type-hygiene ratchet — a JSDoc any-cast lands in the strict-clean domain
#     (the suppression-debt counter must red on growth).
printf '\n/** @type {any} */\nexport const _mutAny = 0;\n' >> src/domain/userEdits.js
check_caught "type-hygiene/any-cast in domain" src/domain/userEdits.js "npx vitest run tests/lint/domainAnyCastBaseline.test.js"

# 23. THE MANIFEST ITSELF — a mutation-coverage label is tampered into a phantom
#     (claims coverage the sweep does not provide). The meta-test must red on
#     both the phantom claim and the now-orphaned sweep label — proving the
#     totality contract's own enforcer has teeth.
perl -0pi -e "s/faction-key\/reversed name-precedence read/zzz-phantom-label/" scripts/mutation-coverage-manifest.json
check_caught "meta/manifest label tampered" scripts/mutation-coverage-manifest.json "npx vitest run tests/lint/mutationCoverageManifest.test.js"

# 24. State-lifecycle totality — an UNREGISTERED persisted family lands in the
#     campaign record (the new-campaign envelope gains a key absent from
#     CAMPAIGN_RECORD_REGISTRY). The E-C round-trip walker must red: every
#     persisted family needs registered migrate + undo policies.
#     (Re-anchored 2026-07-27: the envelope literal moved from campaignSlice's
#     createCampaign into buildNewCampaign in campaignImportedCreation.js; the
#     old anchor made the plant a silent no-op and the step scored MISSED.
#     The python raises on a missing anchor so a future move fails LOUD.)
python3 - <<'PYEOF'
src_path = 'src/store/campaignImportedCreation.js'
src = open(src_path).read()
i = src.index("export function buildNewCampaign")
j = src.index("pendingSync: true,", i) + len("pendingSync: true,")
open(src_path, 'w').write(src[:j] + "\n    __mutLifecycleProbe: 1," + src[j:])
PYEOF
check_caught "state-lifecycle/unregistered campaign family" src/store/campaignImportedCreation.js "npx vitest run tests/store/lifecycleRoundTrip.test.js"

# 25. AI-wall census — a NEW model-calling edge function appears with no wall
#     disposition (the N-1 sweep class: a surface added after the census).
#     The E-D source scan must red on the undispositioned surface.
check_caught_planted "ai-wall/new model-calling surface unwalled" \
  supabase/functions/zzz-mutsweep-aiwall/index.ts \
  'export const probe = "callAnthropic"; // transient mutation-sweep probe' \
  "npx vitest run tests/security/aiSurfaceSourceScan.test.js"

# 26. Narrative parity — the letter composer's headline path drifts by one
#     character (the string-corruption class): every letter beat key stops
#     matching the book/recorded multiset. The E-G decade walker must red on
#     beat-set parity. (NOTE: a diff-floor off-by-one was tried first and
#     absorbed by the fixture's tick cadence — beat-KEY drift is the proven
#     mutation for this walker.)
perl -i -pe "s/headline: String\(e\.headline \|\| 'A matter of the realm'\),/headline: String(e.headline || 'A matter of the realm').slice(0, -1),/" src/domain/display/chroniclersLetter.js
check_caught "narrative/letter headline drift breaks beat parity" src/domain/display/chroniclersLetter.js "npx vitest run tests/simulation/narrativeParity.test.js"

# 27. Discourse lexicon totality (tranche 3c) — a known relation type loses its
#     connective family: drop reframe's RELATION_FOR_TYPE mapping so the live
#     vocabulary is no longer fully covered. The lexicon totality walker must red
#     (a known type with no family = deposit-and-consume).
perl -i -pe "s/^  reframe: 'adversative',\n//" src/domain/display/discourseKernel.js
check_caught "discourse/lexicon relation-type coverage gap" src/domain/display/discourseKernel.js "npx vitest run tests/lint/discourseLexiconCoverage.test.js"

# 28. Massing silhouette totality (TRANCHE M, M-0 — the institution silhouette
#     law) — a NEW glyph kind lands in the medieval library with no massing
#     silhouette spec. Every named kind must map to a composite form (or the
#     explicit generic default), so the dimensional map never renders a wrong
#     generic shape for a new institution. The M-0 silhouette walker must red.
perl -0pi -e "s/  'house-a': cottage\(\),\n/  'house-a': cottage(),\n  zzz_mutsweep_orphan: cottage(),\n/" src/design/townGlyphs/medieval.js
check_caught "massing/silhouette totality unmapped kind" src/design/townGlyphs/medieval.js "npx vitest run tests/lint/townMapMassingSilhouette.walker.test.js"


# 28b. RIBBON RETINA-TEXTURE BUDGET (V4.1, counsel R6 — the texture-complete law).
#      The comb's opacities are lifted from a whisper back toward the weights that
#      produced the "corrugated metal" verdict on the V3 band. Every retina cue on
#      this bar owes UNDER 2% EFFECTIVE INK (tone x area, which is what the eye
#      integrates); the coverage ratchet must red on the comb specifically, because
#      a budget expressed in opacity alone is exactly the budget that could not see
#      its own failure the first time.
perl -0pi -e "s/  opacities: Object\.freeze\(\[0\.13, 0\.2, 0\.27\]\),/  opacities: Object.freeze([0.5, 0.6, 0.7]),/" src/components/nav/FletchBand.jsx
check_caught "ribbon/retina texture budget blown" src/components/nav/FletchBand.jsx "npx vitest run tests/design/textureBudget.test.js"

# 29. K-1 kernel LOD-ladder totality — a NEW arch grammar ruleset lands under
#     arch/rulesets/ with no LOD-ladder + mesh-budget walker coverage. Every
#     ruleset must be a KNOWN, LOD-checked, budgeted kind (no un-walked kind ships),
#     so the registration totality must red on an unregistered ruleset file.
check_caught_planted "kernel/unwalked arch ruleset" \
  src/domain/townMap/arch/rulesets/_mutsweepOrphan.js \
  "export const orphanRuleset = () => ({ name: 'orphan', symbols: ['a'], axiom: { sym: 'a', scope: { origin: [0,0,0], frameRef: { frameIndex: 0, reflect: 0 }, size: [1,1,1] }, attrs: { materialRole: 'ashlar', params: {} } }, rules: { a: [] }, events: [] });" \
  "npx vitest run tests/lint/archLodLadder.walker.test.js"

# 30. K-3 param-contract SECURITY invariant — the covert-corruption band is opened
#     from [0,0] to allow > 0, which would let covert corruption dress the map (the
#     dossier leak). The frozen-contract test must red: covert is EXACTLY 0, forever.
perl -0pi -e "s/corruptionCovert: \{ kind: 'scalar', lo: 0, hi: 0 \}/corruptionCovert: { kind: 'scalar', lo: 0, hi: 1 }/" src/domain/townMap/arch/params.js
check_caught "kernel/param-contract covert leak" src/domain/townMap/arch/params.js "npx vitest run tests/architecture/archParamContract.test.js"

# 31. K-3 statuary SCOPE law — an existing abstract kit form is renamed to a named
#     figure ('royalEffigy'), outside the allowed abstract-form vocabulary. Product
#     scope forbids depicting a named character; the statuary census must red.
perl -0pi -e "s/  skull: \(b, role\) =>/  royalEffigy: (b, role) =>/" src/domain/townMap/arch/kit.js
check_caught "kernel/statuary named-figure" src/domain/townMap/arch/kit.js "npx vitest run tests/architecture/archStatuaryScopeCensus.test.js"

# 32. Neutral-neighbour single-writer — a SECOND module mints an implicit neutral
#     neighbour (owner order 2026-07-22: the default is a read-time reading, minted
#     only in effectiveNeighbours.js). A forked minter could leak an implicit entry
#     into neighbourNetwork → the map/road/regional-graph surfaces that read raw
#     links, so the single-writer source scan must red on any other minter.
check_caught_planted "neutral-neighbour/second implicit minter" \
  src/domain/relationships/_mutsweepImplicitNeutral.js \
  "export const evil = (id) => ({ [IMPLICIT_NEUTRAL_FLAG]: true, targetId: id, linkId: 'implicit_neutral__x__' + id });" \
  "npx vitest run tests/lint/implicitNeutralSingleSource.test.js"

# 33. Composed prose seams (cycle-3 wave 3) — the generator-output seam baseline
#     is tampered (a banked defect-class key is renamed), so the live scan of the
#     generator pipeline no longer matches the committed baseline. The shrink-only
#     ratchet must red: the T4 seam-debt counts are exact, and any drift from the
#     banked baseline (a grown seam, or an un-banked ONE-REGEN shrink) fails.
perl -0pi -e "s/\"braceToken\"/\"braceTokenTAMPERED\"/" tests/copy/.composed-prose-seams-baseline.json
check_caught "copy/composed-prose-seam baseline drift" tests/copy/.composed-prose-seams-baseline.json "npx vitest run tests/copy/composedProseSeams.test.js"

# 34. K-4 drift covert-security — the single geometry writer (conditionParams.js) is
#     made to read cv.corruptionCovert (in place of the recorded history mark), which
#     would let covert corruption drive the map's STRUCTURE — the dossier leak the
#     covert negative control forbids. The drift-totality walker's covert source scan
#     must red: no drift module ever reads corruptionCovert.
perl -0pi -e "s/Math.round\(cv.historyMark\)/Math.round(cv.corruptionCovert)/" src/domain/townMap/arch/conditionParams.js
check_caught "kernel/drift covert leak" src/domain/townMap/arch/conditionParams.js "npx vitest run tests/lint/archDriftTotality.walker.test.js"

# 35. Determinism — a randomness draw (Math.random) lands in the same-seed PDF
#     export (cycle-3 wave 6, the M21 class): the same viewmodel would emit a
#     different document each render. The pdf entropy source-scan must red on any
#     new offending artifact under src/pdf/ (the sibling of the localeCompare ban).
check_caught_planted "determinism/Math.random in pdf export" \
  src/pdf/_mutsweepEntropyProbe.jsx \
  "export const _m = Math.random();" \
  "npx vitest run tests/lint/pdfEntropyGuard.test.js"

# 36. INSPECTOR-ADDRESS-WEB no-fabrication — the address-chain resolver's degrade
#     path is made to INVENT a faction for an unmatched npc (in place of dropping
#     the level). The no-fabrication walker must red: a fabricated faction/power
#     level naming no real faction of the settlement is the exact violation of the
#     owner's "never guess a faction" constraint (THE NEWS ADDRESS LAW, 2026-07-22).
perl -0pi -e "s/return null; \/\/ no-fabrication: an unmatched npc DROPS the faction level, never invents one/return { id: 'zzz.fab', currentName: 'zzz_fabricated_faction', type: 'faction', tab: 'power' };/" src/domain/dossier/realmEntityWeb.js
check_caught "address-web/fabricated faction level" src/domain/dossier/realmEntityWeb.js "npx vitest run tests/lint/realmEntityWebNoFabrication.walker.test.js"

# 37. HERALD ROUTING totality (THE REALM INSPECTOR = NEWSPAPER, 2026-07-22) — a
#     minted candidateType loses its section: drop `conquest` from EXACT_SECTION so
#     the source-scanned literal is no longer explicitly routed (it falls to the
#     silent events catch-all). The routing totality walker must red — a producer
#     kind with no conscious classification is the exact no-orphan violation.
perl -0pi -e "s/ conquest: 'war',//" src/domain/realm/heraldRouting.js
check_caught "realm/herald routing no-orphan" src/domain/realm/heraldRouting.js "npx vitest run tests/lint/heraldRouting.walker.test.js"

# 38. Game Grade promotion safety — a proof-only workbench is flipped on in the
#     shipped flag defaults. The promotion contract must keep incomplete surfaces
#     behind their proof flag until every named acceptance blocker is closed.
perl -0pi -e "s/  settlementWorkbench: false,/  settlementWorkbench: true,/" src/lib/flagRegistry.js
check_caught "game-grade/proof-only flag promoted" src/lib/flagRegistry.js "npx vitest run tests/domain/gameGradePromotionContract.test.js"

# 39. Application-command identity — disable the fingerprint-conflict guard so
#     the journal treats same-id/different-behavior input as an ordinary replay.
#     The executed migration suite must reject that divergent identity and prove
#     the original save projection is not replaced.
perl -0pi -e "s/if v_row\\.fingerprint <> p_fingerprint then/if false then -- mutation-sweep: bypass fingerprint conflict/" supabase/migrations/183_application_command_journal.sql
check_caught "commands/journal conflict contract drift" supabase/migrations/183_application_command_journal.sql "npx vitest run tests/security/applicationCommandJournal.pglite.test.js"

# 40. Import reconciliation — disable the reviewed-vs-current membership
#     comparison so a stale topology is admitted into the rehome transaction.
#     The executed migration suite must catch the resulting write, not merely a
#     drift in the reason string returned by the stale branch.
perl -0pi -e "s/if v_actual_ids is distinct from v_expected_ids then/if false then -- mutation-sweep: admit stale membership topology/" supabase/migrations/184_import_reconciliation_commands.sql
check_caught "commands/import topology-stale drift" supabase/migrations/184_import_reconciliation_commands.sql "npx vitest run tests/security/importReconciliationCommands.pglite.test.js"

# 41. Obligation objectives — move the webhook critical boundary from 60 to 61
#     minutes in both report/list functions. The exact-boundary executed SQL test
#     must red rather than allowing a one-minute false-warning window.
perl -0pi -e "s/v_webhook_critical_age constant interval := interval '60 minutes';/v_webhook_critical_age constant interval := interval '61 minutes';/g" supabase/migrations/182_operational_obligation_health.sql
check_caught "obligations/webhook critical-age boundary drift" supabase/migrations/182_operational_obligation_health.sql "npx vitest run tests/security/operationalObligationHealth.pglite.test.js"

# 42. Town-map audience wall — admit an explicitly hidden hazard to the
#     player-visible vocabulary. The projection invariant must catch the hidden
#     derived fact before any 2D handout, fog view, or 3D compiler can consume it.
perl -0pi -e "s/visibility === 'player';/visibility === 'player' || visibility === 'hidden';/" src/domain/townMap/audienceProjection.js
check_caught "town-map/player projection admits hidden hazard" src/domain/townMap/audienceProjection.js "npx vitest run tests/security/townMapPlayerProjection.test.js"

# 43. Town-scene audience wall — make an unknown audience fail open to the DM
#     projection. The scene security suite's negative control carries a real
#     covert sentinel, so this mutation must expose it and red the gate.
perl -0pi -e "s/  return 'public';/  return 'dm';/" src/domain/townScene/sceneProjection.js
check_caught "town-scene/unknown audience fails open to dm" src/domain/townScene/sceneProjection.js "npx vitest run tests/security/townScenePlayerSafe.test.js"

# 44-46. RETIRED by TE-STRIP-1 (owner ruling, ODQ §725): the fog player surface
#     and the 3D scene root/canvas lived in src/components/townMap/, which left
#     with the legacy settlement map. Their three plants and the tests that
#     caught them are removed together; the numbering below is left undisturbed
#     so every surviving label keeps its stable join key.

# 47. R-2 edit-prose queue spine — a NEW registered prose path lands in
#     EDITABLE_FIELDS (settlement) with no explicit queue-wiring decision. The
#     wired-subset lockstep pin must red: for the three queue-wired kinds the
#     wired set EQUALS the registry, so a registered path can never silently
#     ship lever-less (or worse, wired without a lifecycle trace).
perl -0pi -e "s/    'arrivalScene',\n/    'arrivalScene',\n    'zzzMutsweepProsePath',\n/" src/domain/userEdits.js
check_caught "edit-prose/wired-subset lockstep drift" src/domain/userEdits.js "npx vitest run tests/store/editProseQueueSpine.test.js"

# ── Capability-remediation (R-3/R-4) standing plants ─────────────────────────
# Steps 48-54 were carried as kind:"rationale" entries with EXECUTED build-time
# proof while their targets were uncommitted in the live shared tree (the E-A
# amendment at b0fc33e1: an untracked/dirty mutation target is ineligible, because
# check_caught's `git checkout --` revert would destroy concurrent work rather
# than restore the plant). The program folded at b0a137db, every target below is
# now tracked and clean, so the deferred upgrade lands here.

# 48. R-3 narrative-stamp single writer — re-inline a direct
#     appendEventNarrativeSnapshot call at the command lane. The single-writer
#     source scan must red: both lanes stamp through stampPreEventNarrative, and
#     a second direct writer is exactly how the two lanes' parity drifted before.
perl -0pi -e "s/  return stampPreEventNarrative\(beforeSave, \{/  if (beforeSave === undefined) appendEventNarrativeSnapshot(beforeSave, {});\n  return stampPreEventNarrative(beforeSave, {/" src/store/canonEventCommandTransaction.js
check_caught "narrative/stamp re-inlined at the command lane" src/store/canonEventCommandTransaction.js "npx vitest run tests/store/narrativeStampParity.test.js"

# 49. R-3 economy stale-window detector — empty the rebuild-boundary vocabulary,
#     so no trail source can ever clear an accumulated economy shift. The
#     boundary pins must red (a regenerate no longer resets the window).
perl -0pi -e "s/const REBUILD_SOURCES = new Set\(\['regenerate'\]\);/const REBUILD_SOURCES = new Set([]);/" src/domain/display/economyFreshness.js
check_caught "economy-freshness/rebuild boundary vocabulary emptied" src/domain/display/economyFreshness.js "npx vitest run tests/domain/economyFreshness.test.js"

# 50. R-3/R-4 economy stale-window notes — silence the shared note leaf at the
#     tallies surface. The EconomicsTab pin, the same-sentence pin and the
#     five-surface one-copy-unit pin must all red: a tally surface may not show a
#     stale read-model with no freshness sentence.
perl -0pi -e "s|<EconomyFreshnessNote settlement=\{s\} variant=\"tallies\" />|<span />|" src/components/new/tabs/EconomicsTab.jsx
check_caught "economy-freshness/tallies note silenced at EconomicsTab" src/components/new/tabs/EconomicsTab.jsx "npx vitest run tests/components/economyFreshnessNote.test.jsx"

# 51. R-4 advertised-undo walker — re-advertise the de-advertised updatePlacement
#     row (undoToken:'mapUndo', undoState:'action'). The walker must red on both
#     sides: the advertiser carries no hand-audited ARMING entry, and the
#     de-advertised regression guard sees the promise return.
perl -0pi -e "s/(opType:'updatePlacement'[^\n]*?)undoToken:null, undoState:'none'/\${1}undoToken:'mapUndo', undoState:'action'/" src/store/operationRegistry.js
check_caught "undo-arming/de-advertised updatePlacement re-advertises mapUndo" src/store/operationRegistry.js "npx vitest run tests/store/advertisedUndoArming.walker.test.js"

# 52. R-4 dead-operation ratchet — land a registered operation no file in src
#     consumes. The shrink-only ledger must red on JOINS: an unreachable op may
#     not ship, and may not be laundered into the frozen owner-queue-#21 list.
#     ANCHOR (R-5b): re-pointed from `replaceAllPlacements` to
#     `clearAllPlacementsLocal` when the former was RETIRED out of the registry.
#     The anchor must name a row that still exists — a perl substitution whose
#     pattern no longer matches inserts nothing, and check_caught would then be
#     grading an UNMUTATED tree, i.e. reporting a pass for a probe that never ran.
perl -0pi -e "s/\n  clearAllPlacementsLocal: \{/\n  probeOrphanOp: { opType:'probeOrphanOp', label:\"Probe orphan op\", description:\"Mutation-sweep probe row: registered, consumed by nothing.\", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'none' },\n  clearAllPlacementsLocal: {/" src/store/operationRegistry.js
check_caught "dead-op/unconsumed registry row joins the frozen ledger" src/store/operationRegistry.js "npx vitest run tests/store/deadOperationRatchet.test.js"

# 53. R-4 saved-settlement patch-key walker — write a key the allowlist refuses at
#     a real call site. updateSavedSettlement refuses the patch ATOMICALLY and no
#     caller reads the envelope, so in production the whole write vanishes; the
#     live source census must red rather than let that ship silently.
perl -0pi -e "s/get\(\)\.updateSavedSettlement\(saveId, \{ aiData: nextAiData \}\);/get().updateSavedSettlement(saveId, { aiData: nextAiData, aiRevisionCount: 1 });/" src/store/aiChronicleAppend.js
check_caught "patch-keys/call site writes an unadmitted key" src/store/aiChronicleAppend.js "npx vitest run tests/store/savedSettlementPatchKeysWalker.test.js -t censused --no-file-parallelism --reporter=verbose" "(a) every censused call-site key is admitted by SAVED_SETTLEMENT_PATCH_KEYS"

# 54. R-4 config single-door scan — plant a fifth direct config-draft writer
#     outside the enumerated exemptions. The exact-set scan must red: a write that
#     never passes isAllowedConfigKey is the bypass R-3's one-validated-door claim
#     depends on not existing.
perl -0pi -e "s/    set\(state => \{ state\.importedNeighbour = null; \}\),/    set(state => { state.importedNeighbour = null; state.config.rogueKey = 1; }),/" src/store/neighbourSlice.js
check_caught "config-door/fifth direct draft writer" src/store/neighbourSlice.js "npx vitest run tests/store/configDirectWriterExemptions.scan.test.js"

# 55. Net-current extractor anchor walker — append an UNANCHORED corpus
#     extractor to an anchored suite. The habitat walker must red: a
#     create-or-replace regex without a line-start anchor takes a migration
#     header's prose quote as a function body (the wave L-5 mis-extract class;
#     098/101 carry live prose quotes today).
printf '\n%s\n%s\n' 'const mutProbeUnanchored = /create\s+or\s+replace\s+function\s+public\.mut_probe\b[\s\S]*?\$\$;/i;' 'void mutProbeUnanchored;' >> tests/security/aiSpendSafety.pglite.test.js
check_caught "extractor-anchor/unanchored corpus extractor planted" tests/security/aiSpendSafety.pglite.test.js "npx vitest run tests/lint/netCurrentExtractorAnchor.walker.test.js"

# 56. PGlite hook-timeout ratchet — append an UNGUARDED boot hook to a guarded
#     suite. The ratchet must red: a hook that boots PGlite while inheriting
#     vitest's 10000ms hookTimeout sits ON the boot-noise band under gate load
#     (the F4 flaky-red class), and the burned-down inventory tolerates zero
#     new unguarded hooks anywhere in the corpus.
printf '\n%s\n' 'beforeAll(async () => { const mutProbeDb = new PGlite(); void mutProbeDb; });' >> tests/security/systemConfigPublicRead.pglite.test.js
check_caught "pglite-hook-timeout/unguarded boot hook planted" tests/security/systemConfigPublicRead.pglite.test.js "npx vitest run tests/security/pgliteHookTimeoutRatchet.test.js"

# ── Epistemic-prevention + deity-doctrine post-fold standing plants ──────────
# These five gates carried executed build-time proof while their gate or target
# files were untracked/dirty. Fold 5f8dc783 made every target tracked and clean,
# so the E-A amendment now permits attribution-controlled standing plants.

# 57. Effect reachability — restore the historical over-broad protection law at
#     custom subsumption. Exact custom references may supersede ordinary custom
#     provenance; the generic protection predicate makes that authored effect
#     unreachable. The pinned corpus must report the one dead stratum by receipt.
perl -0pi -e "s/!isProtectedFromCustomSubsumption\(candidate, \{\n\s+exactTarget: Boolean\(target\.refId\),\n\s+\}\)/!isProtectedGenerationEntity(candidate)/" src/generators/steps/assembleInstitutions.js
check_caught "epistemic/effect reachability custom subsumption killed" src/generators/steps/assembleInstitutions.js "npx vitest run tests/generators/effectReachability.coverage.test.js --no-file-parallelism"

# 58. Distribution-envelope power — make the first registered upper bound sit
#     exactly on its expected count. loosenPending keeps the tighter-than-derived
#     shape admissible, isolating the zero-margin / under-2-sigma POWER failure.
perl -0pi -e 's/("id": "capture\.ordinaryCity\.corrupted"[\s\S]*?"bound": )7(,\n\s+"margin": )6\.008([\s\S]*?"loosenPending": )false/${1}1${2}0${3}true/' tests/fixtures/distribution-envelopes.manifest.json
check_caught "epistemic/distribution bound collapsed to zero margin" tests/fixtures/distribution-envelopes.manifest.json "npx vitest run tests/lint/distributionEnvelopePower.test.js --no-file-parallelism"

# 59. Anchored negatives — land one bare absence assertion in a scanned tree.
#     The habitat walker must refuse it because an empty subject would pass for
#     the wrong reason and the new file has no frozen allowance.
check_caught_planted "epistemic/unanchored negative assertion planted" \
  tests/property/_mutsweepUnanchoredNegative.test.js \
  "import { expect, test } from 'vitest'; test('mutation probe', () => { expect([]).not.toContain('mutsweep'); });" \
  "npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js --no-file-parallelism"

# 60. Seed-loop totality — land a corpus loop that asserts inline and therefore
#     stops at the first failing seed. The zero-habitat walker must refuse it.
check_caught_planted "epistemic/bare seed loop planted" \
  tests/property/_mutsweepBareSeedLoop.test.js \
  "import { expect, test } from 'vitest'; test('mutation probe', () => { for (const seed of ['a', 'b']) { expect(seed).toBeTruthy(); } });" \
  "npx vitest run tests/lint/seedLoopTotality.walker.test.js --no-file-parallelism"

# 61. Deity doctrine — reintroduce a premade pool module under the retired
#     generator habitat. Scan 1 must reject the DEITY_POOL producer while the
#     legacy persisted-pantheon reader remains untouched.
check_caught_planted "deity-doctrine/premade deity pool module reintroduced" \
  src/generators/data/_mutsweepDeityPool.js \
  "export const DEITY_POOL = Object.freeze([]);" \
  "npx vitest run tests/lint/noPremadeDeityPool.walker.test.js --no-file-parallelism"

# ── The public display identity + the civility veil (lane C) ─────────────────

# 62. Public display identity — land a SECOND file that reads the avatar pointer.
#     §1's guarantee is that a name and an image are one identity under one
#     consent; the census of avatar readers must therefore refuse an undeclared
#     one, because a surface that composes name and image itself is the surface
#     that keeps showing a face after consent is withdrawn.
check_caught_planted "identity/undeclared avatar reader planted" \
  src/lib/_mutsweepAvatarReader.js \
  "export const avatarPointer = (row) => row.avatar_url;" \
  "npx vitest run tests/lint/publicIdentitySingleRender.walker.test.js --no-file-parallelism"

# 63. The public-payload veil seam — take the veil off the world export's payload
#     BOUNDARY, restoring the exact defect shape VH-1 closed: a veiled dossier
#     with a raw hoisted name beside it, so one payload carries the same string
#     masked in one field and plain in its sibling. The totality pin must red on
#     the plain occurrence, not merely on the missing mark.
perl -0pi -e 's/return veilPublicPayload\(\{\n    format: WORLD_EXPORT_FORMAT/return \(\{\n    format: WORLD_EXPORT_FORMAT/' src/lib/worldExport.js
check_caught "civility-veil/public payload boundary unveiled" src/lib/worldExport.js "npx vitest run tests/security/publicPayloadVeilTotality.test.js --no-file-parallelism"

# ── The first-contact prose seams (lane PS) ─────────────────────────────────

# 64. Spine frame doubling — put the frame word back INSIDE the deriver, which
#     is the exact shape that shipped "It is currently strained by / Strained by
#     under Siege, infiltrated." to every first-run user. The frame belongs to
#     SPINE_RUNGS and to nothing else; the moment a deriver authors one too, the
#     rail prints it twice. The render pin reads the <dt>/<dd> pair out of the
#     DOM, so it is the assertion that can see the doubling at all — a test of
#     the deriver's return value alone cannot, which is why the defect shipped.
perl -0pi -e 's/  if \(joined\) return joined;/  if (joined) return `Strained by \${joined}`;/' src/domain/simulationSpine.js
check_caught "prose/spine frame word doubled into the body" src/domain/simulationSpine.js "npx vitest run tests/components/pipelineRailSpineProse.test.jsx --no-file-parallelism"

# 65. The seed-slot guard removed — restore the shape that let a caller write
#     generateSettlementPipeline({ seed, settType }) and have the seed silently
#     dropped, because `seed` is not a config key. This is not hypothetical: it
#     is how the spine's real-generation pins and its jsdom render pin were
#     spelled, so both ran unseeded for their whole life while asserting
#     seed-stable prose. Nothing could red, because no assertion can tell "this
#     seed produces this world" from "some world produced something acceptable"
#     when the seed never arrives. The contract pin's negative controls
#     (options.seed honoured, config._seed replay untouched, distinct seeds
#     diverge) mean this plant cannot be satisfied by breaking generation.
perl -0pi -e "s/if \(config && typeof config === 'object' && 'seed' in config\)/if (false)/" src/generators/generateSettlementPipeline.js
check_caught "generation/pipeline seed-slot guard removed" src/generators/generateSettlementPipeline.js "npx vitest run tests/generators/pipelineSeedSlotContract.test.js --no-file-parallelism"

# 66. The splice guard's SENTENCE-BREAK refusal deleted — nounPhrase() is the one
#     chokepoint every noun slot in the spine draws through, and this is the
#     refusal that keeps a narrative body out of a one-line slot. Its absence is
#     the shape that shipped "People fear a return of the settlement is under
#     active siege. Every resource decision is a military decision. ..." to
#     first-run users. The guard has TWO independent refusals (this and the
#     MAX_PHRASE_CHARS cap), and the suite used to prove only their CONJUNCTION:
#     deleting either, or both, left every assertion green, because the vignette
#     that motivated the guard trips both at once. The claiming pins use fixtures
#     that trip EXACTLY ONE refusal each, so each deletion is caught alone.
perl -0pi -e "s/  if \(\/\[\.!\?\]\\\\s\/\.test\(trimmed\)\) return null;\n//" src/domain/simulationSpine.js
check_caught "prose/spine splice guard sentence-break check deleted" src/domain/simulationSpine.js "npx vitest run tests/domain/simulationSpine.test.js --no-file-parallelism"

# 67. The splice guard's LENGTH cap deleted — the OTHER half of nounPhrase()'s
#     refusal, and the half that had a pin but no standing plant. Area 66 above
#     proves only the sentence-break refusal; a deletion of MAX_PHRASE_CHARS
#     survived every run of this sweep because nothing here had ever removed it.
#     The cap is what refuses a body that is long but grammatically ONE sentence
#     — an authored tension label running to 100 characters carries no terminator
#     to catch, so the sibling refusal cannot see it and the whole paragraph
#     lands in a one-line slot.
#     The gate runs BOTH claiming files: simulationSpine.test.js's GUARD 1
#     fixture (over-long, deliberately terminator-free) and, since lane RT-1,
#     historyBeats.test.js's refused-label mirror pin — the beat imports this
#     very function, so deleting the cap makes the mirror name the label where
#     it should name the type. Measured before landing: 2 red in the spine
#     suite, 1 red in the beats suite.
#     MANIFEST NOTE: this label is claimed by the meta entry
#     `meta:spine-max-phrase-chars-cap`, not by a test-file entry. The invariant
#     is a SECOND independent rule inside a file whose single manifest slot is
#     already spent on area 66 — see scripts/mutation-coverage-manifest.json.
perl -0pi -e "s/  if \(trimmed\.length > MAX_PHRASE_CHARS\) return null;\n//" src/domain/simulationSpine.js
check_caught "prose/spine splice guard LENGTH cap deleted" src/domain/simulationSpine.js "npx vitest run tests/domain/simulationSpine.test.js tests/domain/historyBeats.test.js --no-file-parallelism"

# 68. The origin corpus SHRINKS — delete two variants from the crossroads arm,
#     taking it 5 -> 3. Lane RR's shift record NARRATED the corpus size (eight
#     arms of five) and nothing asserted it; the narration was itself wrong (it
#     said 45 for 8 x 5 = 40), which is how a reader discovers that a narrated
#     count is not a guard. The three sibling pins are all structurally blind to
#     this: `pin:no-power-of-two-pool` asks only "n > 1 and not a power of two",
#     and THREE satisfies both; `pin:variant-reachability` is satisfied because
#     the three survivors are all still reachable; `pin:channels-token` counts
#     token-carrying variants per pool, not variants. Only the ROAD arm had an
#     independent size witness (pin:corpus-diversity's exact toBe(5)), which is
#     why this plant shrinks CROSSROADS — an arm with no other guard, so the red
#     is attributable to `pin:corpus-size-totality` alone.
#     Measured before landing: crossroads 5 -> 3, EXACTLY 1 red (19 passed).
#     MANIFEST NOTE: this label is claimed by the meta entry
#     `meta:origin-corpus-size-totality`. tests/generators/settlementOriginProse.test.js
#     is not an enumerated invariant file under the naming rule (its basename
#     carries none of the tokens), so it takes no test-file entry of its own.
perl -0pi -e 's/\n[^\n]*Founded at a junction on the oldest logic[^\n]*\n[^\n]*It exists because travellers had to stop somewhere[^\n]*//' src/generators/narrative/settlementOriginProse.js
check_caught "prose/origin corpus pool shrinks below five" src/generators/narrative/settlementOriginProse.js "npx vitest run tests/generators/settlementOriginProse.test.js --no-file-parallelism"

# ── The cross-layer coupling inclusion ratchet (CW-0w slice 2) ──────────────

# 69. An unregistered cross-layer import lands in a real layer module. Plant a
#     WAR-family module that reads the FAITH layer with no couplingRegistry row
#     naming it. The same-commit registry obligation is enforced by nothing but
#     this walker, so a MISSED here means the registry can go quietly partial
#     while CW-1's layer counting and CW-3's aliveness floors still treat it as
#     the layer authority.
check_caught_planted "coupling/unregistered cross-layer import planted" \
  src/domain/worldPulse/warMutsweepInclusionLeak.js \
  "import { sacredClaimFor } from './sacredClaim.js'; export const leak = sacredClaimFor;" \
  "npx vitest run tests/lint/couplingInclusion.walker.test.js --no-file-parallelism"

# 70. The inclusion inventory is made to GROW instead of shrink: delete a frozen
#     pair whose import is still live, which is how a maintainer would silently
#     re-license a legacy edge. The walker must treat the survivor as NEW and
#     demand its registry row.
perl -0pi -e 's/\{\n    "importer": "src\/domain\/worldPulse\/generosityKernel\.js",\n    "imported": "src\/domain\/worldPulse\/beliefMap\.js",\n    "direction": "[^"]*"\n  \},\n  //' tests/lint/.coupling-inclusion-baseline.json
check_caught "coupling/inclusion baseline entry deleted while its import lives" tests/lint/.coupling-inclusion-baseline.json "npx vitest run tests/lint/couplingInclusion.walker.test.js --no-file-parallelism"

# 70a. THE COUNT-NEUTRAL RETARGET EXCEPTION, PROVEN. A retargeted baseline entry is the
#      one edit permitted to change an entry's `imported` without banking and re-minting,
#      and it is licensed by a `note` joined both ways to BASELINE_RETARGETS. Strip the
#      note and the exception becomes exactly what a silent repoint looks like. It shipped
#      as a comment for one day and checked nothing; a MISSED here means it is prose again
#      and any future lane can repoint any entry at anything.
perl -0pi -e 's/,\n    "note": "RETARGETED[^"]*"\n  \}/\n  }/' tests/lint/.coupling-inclusion-baseline.json
check_caught "coupling/retarget note stripped from the baseline entry" tests/lint/.coupling-inclusion-baseline.json "npx vitest run tests/lint/couplingInclusion.walker.test.js --no-file-parallelism"

# 70b. AN ARGUED-UNLAYERED SUBSTRATE REACHES INTO A PORT. An ARGUED_UNLAYERED module has
#      no layer, so scanCrossLayerPairs cannot see it on either side and every edge
#      through it leaves the inventory — which means each admission SUBTRACTS coverage.
#      The substrate argument ("owns no subject, spoken by every port") is bought by
#      declaring an exact `reads` set, so plant the read the declaration forbids:
#      spatialLedgerAccess.js, admitted 2026-08-07 as a zero-import namespace leaf,
#      is made to read WAR. A MISSED here means an argued module can quietly become a
#      cross-layer consumer whose couplings nothing will ever name.
printf "\nimport { embattlementActive } from './embattlement.js';\nexport const mutsweepReach = embattlementActive;\n" >> src/domain/spatial/spatialLedgerAccess.js
check_caught "coupling/argued-unlayered substrate reads a port undeclared" src/domain/spatial/spatialLedgerAccess.js "npx vitest run tests/lint/couplingInclusion.walker.test.js --no-file-parallelism"

# 71. The registry's desk and the paper's routing are pulled apart: retag WR-6's
#     alliance-risk row from the war desk to trade while its kind keeps routing
#     to war. This is the belief_misjudgment-under-faith misfile class in
#     miniature — the registry keeps reading as the desk authority while the
#     Herald files the story elsewhere, and nothing else in the estate compares
#     the two.
perl -0pi -e "s/  intendedDesk: 'war',\n  kinds: \['coalition_entry_priced'\],/  intendedDesk: 'trade',\n  kinds: ['coalition_entry_priced'],/" src/domain/certification/couplingRegistryWar.js
check_caught "coupling/registry desk pulled away from heraldRouting" src/domain/certification/couplingRegistryWar.js "npx vitest run tests/lint/couplingDesk.walker.test.js --no-file-parallelism"

# 72. IN-0a — THE HANDOFF SEVERED. The paid plant's envelope reaches the lie writer
#     only because brokeragePlantHandoff carries it off the PRIOR pulse's applied
#     receipt (the kernel mouths are banked; nothing hands it over). Move the
#     transport window off the one-week lag and the carry silently returns nothing
#     forever: the commission still charges its patron, the act still narrates, and
#     the world plants NOTHING — which is exactly the live defect IN-0a was built to
#     close, restored in one token. The pins must see the road go dead.
perl -0pi -e 's/now - commissionedAtTick !== PLANT_HANDOFF_LAG_TICKS/now - commissionedAtTick !== 99/' src/domain/worldPulse/brokeragePlantHandoff.js
check_caught "info/paid plant handoff severed at the transport window" src/domain/worldPulse/brokeragePlantHandoff.js "npx vitest run tests/domain/brokeragePlantHandoffPins.test.js --no-file-parallelism"

# 73. IN-0a — THE HISTORY READ INVERTED. `appliedPlantEnvelopesAt` takes the LAST
#     pulse record because `appendPulseHistory` appends newest-last and keeps 80.
#     Reading the HEAD instead reads an eleven-month-old record forever: the carry
#     silently returns nothing, and the lane is dead with every commission still
#     being charged. This survived the wave's whole pin set once — every fixture
#     built a ONE-row history, on which the two spellings are the same object — so
#     it is planted here permanently rather than trusted to a reviewer's eye.
perl -0pi -e 's/const record = asObject\(rows\[rows\.length - 1\]\);/const record = asObject(rows[0]);/' src/domain/worldPulse/brokeragePlantHandoff.js
check_caught "info/plant handoff reads the OLDEST pulse record instead of the newest" src/domain/worldPulse/brokeragePlantHandoff.js "npx vitest run tests/domain/brokeragePlantHandoffPins.test.js --no-file-parallelism"

# 74. IN-0a — THE RECORD DOOR LOOSENED. The consume-once guard is a PAIR (the record's
#     own tick, and the commission's tick inside it) and defence in depth blinds
#     mutants: loosening this half alone left the whole pin file green until the
#     doors were pinned individually. A lower bound here lets one commission be
#     carried on every later tick of its life instead of exactly one.
perl -0pi -e 's/if \(wholeTick\(record\.tick\) !== now - PLANT_HANDOFF_LAG_TICKS\) return \[\];/if (!(Number(record.tick) <= now - PLANT_HANDOFF_LAG_TICKS)) return [];/' src/domain/worldPulse/brokeragePlantHandoff.js
check_caught "info/plant handoff record door relaxed from exact age to a lower bound" src/domain/worldPulse/brokeragePlantHandoff.js "npx vitest run tests/domain/brokeragePlantHandoffPins.test.js --no-file-parallelism"

# 75. SCW-0 — THE SITE-COHERENCE CONTRADICTION RATCHET, upgraded from a rationale to a
#     STANDING PLANT. Delete the `coal` alternative from the mountain arm's export test:
#     every settlement that reached mountain-flank BECAUSE it exports coal silently falls
#     through to the biome default, so three frozen (terrain, siteKind, decisiveToken) rows
#     VANISH and the same settlements reappear under three grown biome rows. The ratchet's
#     identity-keyed bidirectional comparison must red on both halves at once. The liveness
#     census (tests/lint/exportTokenCoverage.test.js) stays GREEN through this same mutant —
#     `coal` is still spelled elsewhere in the source it derives from — which is the
#     liveness/identity split working as designed and the reason that sibling keeps its
#     rationale while this one does not.
perl -0pi -e 's{/ore\|iron\|stone\|mine\|silver\|gold\|coal/i}{/ore|iron|stone|mine|silver|gold/i}' src/domain/townMap/siteGenesis.js
check_caught "site-coherence/coal dropped from the mountain-flank export arm" src/domain/townMap/siteGenesis.js "npx vitest run tests/lint/siteCoherenceRatchet.test.js --no-file-parallelism"

# 76. AO-6 — one applied-headline producer twin is removed. The raw-analysis
#     setup lets the filtered A6 pin own this exact red rather than a beforeAll
#     closure throw owning it accidentally.
perl -0pi -e "s@  \\[/\\\\bmay press a challenge to the government\\\\b/, 'presses a challenge to the government'\\],\\n@@" src/domain/worldPulse/worldPulseFeedCuration.js
check_caught "corpus-coverage/headline rewrite row deleted" src/domain/worldPulse/worldPulseFeedCuration.js "npx vitest run tests/lint/newsHeadlineContract.walker.test.js -t A6 --no-file-parallelism --reporter=verbose" "A6 closes the sole live challenge gap with the exact producer twin"

# 77. AO-6 — one applied summary home retains prospective/modal voice after its
#     kind leaves the membership set. The completion pin must name the red.
perl -0pi -e "s/'npc_bargain', //" src/domain/worldPulse/worldPulseFeedCuration.js
check_caught "corpus-coverage/modal summary admitted under indicative home" src/domain/worldPulse/worldPulseFeedCuration.js "npx vitest run tests/lint/newsVoiceContract.walker.test.js -t debt-free --no-file-parallelism --reporter=verbose" "contract -> cure -> bank completion is aligned and debt-free"

# 78. AO-6 — the pure Chronicle return projection silently loses summaryText.
#     The post-AO-5 Chronicle denominator must name the red.
perl -0pi -e 's/    summaryText,\n//' src/lib/chronicle.js
check_caught "corpus-coverage/chronicle summaryText projection deleted" src/lib/chronicle.js "npx vitest run tests/lint/proseFamilyContract.walker.test.js -t A7 --no-file-parallelism --reporter=verbose" "A7 closes the pure Chronicle create-and-append road at 7 7 7"

# 79. AO-6 — order-only source churn is semantically inert because the summary
#     kinds form a set. Both News walkers must remain exactly 16/16 green before
#     and after restoration.
perl -0pi -e "s/'npc_bargain', 'npc_exploit'/'npc_exploit', 'npc_bargain'/" src/domain/worldPulse/worldPulseFeedCuration.js
check_clear "corpus-coverage/summary impact set order swap stays clear" src/domain/worldPulse/worldPulseFeedCuration.js "npx vitest run tests/lint/newsVoiceContract.walker.test.js tests/lint/newsHeadlineContract.walker.test.js --no-file-parallelism" 16

# 37. MAP-SURFACE TERMINAL CENSUS — settlement-map vocabulary returns OUTSIDE the
#     allowlist (ODQ §725/§772, DESIGN_MAP_MODULE_SPLIT §11.4). The strip's promise is
#     not "those files are gone" — it is that the vocabulary may only live inside the
#     surfaces the rulings RETAINED. The plant writes the retired model builder's name
#     into the seeded-PRNG kernel, which is tracked, clean, joins MUTATED_FILES in the
#     same edit (so the E-A attribution control applies) and is deliberately NOT on the
#     allowlist — it is engine substrate that has no business naming a map surface. The
#     census must red on the FILE, not on a count, which is what makes it survive the
#     WEAVE program adding realm-surface map words by design.
perl -0pi -e "s/^ \* prng\.js — Seeded pseudo-random number generator wrapper\./ * prng.js — Seeded pseudo-random number generator wrapper. buildTownMapModel/m" src/kernel/prng.js
check_caught "map-surface/vocabulary outside the allowlist" src/kernel/prng.js "npx vitest run tests/lint/settlementMapSurfaceAllowlist.walker.test.js"

# 38. THE NO-DOUBLE-COUNT LAW (W-FAITH D1 / ODQ §866). ⚠ RE-POINTED AT F3c. This area
#     used to plant the embed CARRY and convict F2c's tripwire; F3c took that act, so
#     the old plant is now the shipped code and the tripwire is deleted. What remains
#     under guard is the law the tripwire was never about: `authoredTemper` may be READ
#     for meaning in exactly ONE src module, the seam. A second reader — here, a
#     consumer reaching around `deityTemper` for the raw key — is perfectly functional
#     at runtime, which is precisely why only a source census can see it. It is also
#     the concrete shape of D1's double-count risk: that consumer would hold the
#     authored word AND the derived one for the same term.
#     `disposition.js` is the chosen host because it is the war-appetite consumer whose
#     movement made the field mechanical in the first place, so a stray raw read there
#     is the most plausible version of this mistake, not a contrived one.
perl -0pi -e "s/^export function computeAggressiveness\(/const rawAuthoredTemper = (s) => s?.config?.primaryDeitySnapshot?.authoredTemper;\nvoid rawAuthoredTemper;\nexport function computeAggressiveness(/m" src/domain/worldPulse/disposition.js
check_caught "faith-temper/a second semantic reader of authoredTemper" src/domain/worldPulse/disposition.js "npx vitest run tests/domain/deityTemperConsumerCensus.walker.test.js --no-file-parallelism --reporter=verbose" "exactly ONE src module makes a semantic read of authoredTemper"

# 39. THE FOUR-WRITER CARRY, AND THE PATH THAT LOSES IT SILENTLY (W-FAITH F3c / ODQ
#     §866). The carry's whole safety argument is ATOMICITY: six authored-character
#     keys reach all four deity-embed writers in one act. Three of the four are
#     commit-time writers whose omission a DM would eventually notice; the fourth,
#     `deitySnapshotFrom`, is ALSO the restore-from-world builder, so a key that fails
#     to reach it survives every assign and every organic conversion and then vanishes
#     the first time a DM restores an ousted patron — no error, no receipt, and a
#     green parity test if that test only knew the commit writers.
#     The plant removes the shared picker from that one writer. It is the exact bug
#     F2c named as "the sharper half", and the round-trip assertion is what sees it.
perl -0pi -e "s/^    \.\.\.authoredCharacterEmbedKeys\(raw\),\$//m" src/domain/deitySnapshot.js
check_caught "faith-embed/the restore path drops the authored-character keys" src/domain/deitySnapshot.js "npx vitest run tests/domain/deityEmbedWriterParity.test.js --no-file-parallelism --reporter=verbose" "⛔ THE RESTORE ROUND-TRIP — a persisted embed re-picked through the builder loses nothing"

# 47. Determinism — the instantWorld composer's ban (ODQ 764.2 / 759.4, lane T9).
#     instantWorld mints a whole starting realm from a seed and sat outside EVERY
#     determinism block: src/lib/ carries only the size ratchet, so the composer and
#     its faction-dedup leaf were governed by nothing on this axis. The new
#     eslint.config.js block reds nothing on the clean tree — it is a ratchet over
#     code that is already correct — which is exactly why it needs a plant: a scope
#     that convicts nothing today is indistinguishable from a scope that convicts
#     nothing ever. A raw draw in the composer forks the same-seed world THE PROMISE
#     says is that seed's starting world forever.
printf '\nconst _mut = Math.random();\n' >> src/lib/instantWorld/factionDedup.js
check_caught "determinism/instantWorld Math.random()" src/lib/instantWorld/factionDedup.js "npx eslint src/lib/instantWorld/factionDedup.js"

# 48. TRAIN 1 C2 — THE MOUNT REGISTRY'S TOTALITY LAW. dossierMounts.js is the dossier's
#     router, and its whole claim is that every corpus block is either MOUNTED at a
#     position or DECLARED DARK, with no third state. The failure it forecloses is the
#     quiet one: a block leaves the dark list (or a new block arrives) and nothing on the
#     page ever renders it, while the darkness figure the gate reads goes on looking
#     healthy because the list got SHORTER. A shrink-only ratchet alone cannot see that —
#     shrinking is the direction it exists to permit — so the totality join against the
#     corpus is the arm that must red, and this plant is what proves it does. Strike
#     DS-CND-1 from the dark half without mounting it anywhere.
perl -0pi -e "s/  'DS-STR-1', 'DS-STR-2', 'DS-CND-1',\n/  'DS-STR-1', 'DS-STR-2',\n/" src/domain/display/stateProse/dossierMounts.js
check_caught "dossier-mounts/a corpus block leaves the dark list with no mount" src/domain/display/stateProse/dossierMounts.js "npx vitest run tests/lint/dossierMountRegistry.walker.test.js --no-file-parallelism"

# 72. CHARSET Car 1 — the charset is DERIVED from a renderer, so the arm that matters is
#     "every shipped name is printable in the dossier PDF". Strike one measured range from
#     the DOSSIER surface only; the census must then name the codepoints it can no longer
#     draw. Proved before landing: with the plant, 2 of 5 arms red and the message names
#     U+00C1 U+00C9 U+00CD U+00D3 U+00D6 U+00DA U+00DC U+00DE; restored, 5/5 green.
perl -0pi -e 's/"ranges": "D 20-7E A0-AC AE-132 /"ranges": "D 20-7E A0-AC /' src/domain/content/customContentCharset.generated.js
check_caught "naming-charset/a range leaves the dossier surface and a shipped name stops printing" src/domain/content/customContentCharset.generated.js "npx vitest run tests/data/namingDataCharset.test.js --no-file-parallelism"

# 73. TE-GOLDEN-1 car 2 — THE ROSTER-CLOSURE LAW. The golden freeze register's whole claim
#     is that every same-seed instrument in tests/ is EITHER enrolled with a register row OR
#     carries an affirmative written exclusion — no third state, because silence is not a
#     disposition. The failure it forecloses is the quiet one: an edit to the exclusion roster
#     clobbers one spelling with another, so the roster still READS as maintained (same length,
#     every row well-formed, every listed spelling still live in the tree) while one instrument
#     has silently stopped being covered. A schema check cannot see that and neither can a
#     length floor — only the join against the live AST census can, and this plant is what
#     proves it does. Collapse the UPDATE_MOUNT_BASELINE row onto the LIGHTING_CENSUS_REFREEZE
#     spelling: UPDATE_MOUNT_BASELINE goes unclaimed, and because the surviving spelling is
#     still live in the tree the stale-exclusion arm stays GREEN, so the red is attributable to
#     the closure arm ALONE.
#     ⭐ THE OTHER DIRECTION IS ALREADY COVERED IN-TREE, which is why this plant takes the
#     register side: the walker ships PLANT_NEW_SPELLING, an in-memory source minting an
#     unenrolled spelling, asserted on every gate run. Tree-gains-an-instrument is proved
#     there; roster-loses-a-member is proved here. Neither alone closes the law.
#     Measured before landing (lane GOLDENLAND, 2026-09-04): planted => EXACTLY 1 red of 84,
#     naming the arm and the file; restored cmp-exact => 84 passed.
perl -0pi -e 's/"UPDATE_MOUNT_BASELINE"/"LIGHTING_CENSUS_REFREEZE"/' tests/fixtures/.golden-freeze-register.json
check_caught "golden-freeze/the exclusion roster loses a spelling while reading as maintained" tests/fixtures/.golden-freeze-register.json "npx vitest run tests/lint/goldenFreeze.walker.test.js --no-file-parallelism" "every golden-adjacent env spelling in tests is enrolled or written-excluded"

# 74. §913 L-MAT-FIX — THE LIVING-CONTENT ROSTER PUBLISHED BY ONE ALLOWLIST ROW. The
#     fail-closed root allowlist in publicSafe.js is the ONLY thing standing between
#     `settlement.customContentRoster` and every public / gallery / anonymous read. The
#     roster records EVERY reviewed living-content definition in scope for a run — adopted
#     or NOT — so it is the author's unadopted homebrew library rather than a property of
#     the town, and every row carries the five stable, account-scoped
#     CUSTOM_DEFINITION_IDENTITY_KEYS that are exactly what would let an observer correlate
#     one private definition across two published worlds. There is no second line of
#     defence: the deeper denylist strips NOTHING here (no roster key matches
#     PRIVATE_KEY_RE, which that test's third arm MEASURES off a real generated row rather
#     than assuming), so one key added to PUBLIC_TOPLEVEL_KEYS publishes the library.
#     The failure this forecloses is the quiet one — the key is added in good faith by
#     someone growing the public dossier, nothing errors, no surface changes shape, and the
#     leak is visible only to whoever diffs two published worlds. A constant-only arm would
#     be a weak witness for it, which is why the named red below is the BEHAVIOURAL one:
#     it generates a LIT world through the real pipeline, proves the roster IS there, and
#     only then proves the projection dropped it.
#     Measured before landing (lane L-MAT-FIX, 2026-09-07): planted => EXACTLY 2 red of 6 —
#     the allowlist arm and the ⭐ BEHAVIOURAL arm, the only two an added root key can
#     reach; the provenance, denylist-census, R-D and DM-FULL arms stayed GREEN, so the
#     named red is attributable to this mutation rather than to a whole-file collapse.
#     Restored via `git checkout --` => 6 passed.
perl -0pi -e "s/'structuralViolations', 'thesis', 'tier',/'structuralViolations', 'thesis', 'tier', 'customContentRoster',/" src/domain/display/publicSafe.js
check_caught "security/the living-content roster becomes an allowlisted public key" src/domain/display/publicSafe.js "npx vitest run tests/security/livingContentRosterPublicDrop.test.js" "⭐ BEHAVIOURAL: a LIT world really carries a roster, and the default projection drops it"

# 75. INSTR-912 car 1 — THE SAME-ENTRY WALKER'S TOTALITY ARM. The Brackwater lesson is that
#     only a CLOSED COLUMN licenses a quantifier, and the arm that carries it is one branch
#     reading `col.closed`. The failure it forecloses is the quiet one: the branch stops
#     consulting the flag and every "every household", "everyone" and "the only person" in
#     the estate becomes licensed, while the four Brackwater fixtures go on looking healthy
#     because they still produce SOME findings. Strike the flag read.
#     Measured before landing (lane INSTR-912, 2026-09-07): planted => 6 red of 19,
#     including all four Brackwater tables and the anti-vacuity guard; restored => 19 passed.
perl -0pi -e 's/    \} else if \(!col\.closed\) \{/    } else if (false) {/' src/domain/prose/entryWalker.js
check_caught "prose-entry-walker/the totality arm stops reading the column's closed flag" src/domain/prose/entryWalker.js "npx vitest run tests/lint/proseEntryContradiction.walker.test.js --no-file-parallelism"

# 76. INSTR-912 car 2 — THE SEGMENT DEFINITION. Control 4's calibration reproduces PROBE_ALL's
#     407/708 and 79/708 to the unit, and it can only do that while a SEGMENT means exactly
#     what check-pair.mjs:43 means by it: a SENTENCE. Drift it to a clause split and the
#     figures move while every arm still reports something. Measured: planted => 1 red of 42,
#     naming control 4; restored => 42 passed.
perl -0pi -e "s/    \.split\(\/\(\?<=\[\.\?!\]\)\\\\s\+\(\?=\[A-Z\\\"'\(\]\)\/\)\.filter\(Boolean\)\.length;/    .split(\/(?<=[.?!;])\\\\s+\/).filter(Boolean).length;/" src/domain/prose/grammarWalker.js
check_caught "prose-move-grammar/the segment definition drifts from a sentence to a clause" src/domain/prose/grammarWalker.js "npx vitest run tests/lint/proseMoveGrammar.walker.test.js --no-file-parallelism"

# 77. INSTR-912 car 3 — THE LOADERS' EXACTNESS. A register loader that silently reads one row
#     short turns an honest OWED into a false green: the walker still runs, still reports, and
#     measures a corpus that is not the corpus. R4b's count is asserted as the integer 50, so
#     removing one disclosure line must red. Measured: planted => 1 red of 10; restored => 10.
perl -0pi -e "s/    'What was said is what was so\.',\n//" src/domain/display/heraldIntegrity.js
check_caught "prose-register-loaders/a disclosure line leaves R4b and the exact count breaks" src/domain/display/heraldIntegrity.js "npx vitest run tests/lint/proseRegisterLoaders.walker.test.js --no-file-parallelism"

# 78. INSTR-912 car 4 — PERSONS ARE NEVER CLOSED. The institution table's one unbreakable
#     claim is that `whoIsCounted.closed` is false on every settlement forever, because the
#     population is a number and there is nothing to close. Close it and the Brackwater kicker
#     becomes licensed everywhere. CORRECTED (INSTR-912 car 10; the comment read "1 red of 12"
#     and had never been executed): planted => 4 red of 18, `whoIsCounted is OPEN on every
#     tier` by name; restored cmp-exact => 18 passed.
perl -0pi -e "s/        closed: false,\n        values: Object\.freeze\(band \? \[band\] : \[\]\),/        closed: true,\n        values: Object.freeze(band ? [band] : []),/" src/domain/institutions/institutionTable.js
check_caught "institution-table/the persons column closes and the Brackwater quantifier becomes licensed" src/domain/institutions/institutionTable.js "npx vitest run tests/lint/institutionTable.walker.test.js --no-file-parallelism"

# 79. INSTR-912 car 5 — THE PUBLISHED LEXICON IS A PARTITION. The presence measure's third
#     line is the spread ACROSS SENSES, and it means nothing unless every counted noun belongs
#     to exactly one of five buckets. Rename a bucket and the partition silently becomes four
#     senses while the per-hundred-words figure goes on looking the same. Measured: planted =>
#     1 red of 9; restored => 9 passed.
perl -0pi -e "s/  smell: Object\.freeze\(\[/  smellRemoved: Object.freeze([/" src/domain/prose/presenceMeasure.js
check_caught "prose-presence/a sense leaves the published lexicon and the spread stops being a partition" src/domain/prose/presenceMeasure.js "npx vitest run tests/lint/proseMeasures.walker.test.js --no-file-parallelism"

# 80. INSTR-912 car 8 — A POOL THE CENSUS CANNOT READ MUST SAY SO. The wiring census's one
#     unbreakable claim is the owner's own: a pool whose selecting predicate is not
#     recoverable is reported WIRING-UNRESOLVED, never inferred. The failure this forecloses
#     is the quietest one an instrument has: the fallthrough starts answering RESOLVED, the
#     census claims total coverage of 708 pools, and every downstream arm — arm D's licence,
#     C-sibling's premise, the MISSING tier the authoring wave is sized from — reads a
#     confident answer built on nothing. The three rung readers go on working, so the row
#     count, the variant histogram and the fill census all stay correct while the census
#     silently stops distinguishing what it read from what it did not. Strike the status.
#     Measured before landing (lane INSTR-912, 2026-09-07): planted => 5 red of 21.
#     ⚠ THE ROSTER WAS WRONG BY ONE AND IS CORRECTED HERE (car 10, cure 20): the five were the
#     anti-vacuity split, control (c1)'s UNRESOLVED pool, control (c1c)'s "a key NEITHER rung
#     names", control (d)'s mixed fixture and the grammar walker's D/wiring arm. C-SIBLING'S
#     PREMISE GATE STAYED GREEN — so this plant is NOT evidence that C-sibling consumes the
#     census, and no other plant proves it either. RE-EXECUTED at car 10's tip: planted =>
#     7 red of 26 — the anti-vacuity split, controls (c1), (c1c), (c1e), (c1f), (d) and the
#     grammar walker's arm D. C-sibling stayed green a second time, on a file with five more
#     assertions than the first run. Restored cmp-exact => 26 passed.
#     ⛔ RE-ANCHORED AT MEASURE CAR 3 (the fold's R2, cure 3). Car 0e inserted `branchReads: [],`
#     between `predicate: []` and `fieldsRead: []` (wiringCensus.js:699-702) and this anchor
#     stopped matching: executed standalone against the committed bytes, md5
#     0a28c398a1b6cff56183212bed8fa7fd BEFORE and AFTER — the plant mutated nothing and the
#     sweep reported it as a BROKEN GAP nobody read. Car 11's lesson, which this sweep quotes
#     to itself, bit the one plant on the file the lane RE-SHAPED. Re-anchored and re-executed:
#     md5 moves, the walker reds.
perl -0pi -e 's/    predicate: \[\],\n    branchReads: \[\],\n    fieldsRead: \[\],\n    status: WIRING_STATUS\.UNRESOLVED,/    predicate: [],\n    branchReads: [],\n    fieldsRead: [],\n    status: WIRING_STATUS.RESOLVED,/' src/domain/prose/wiringCensus.js
check_caught "prose-wiring-census/an unrecoverable predicate reads as RESOLVED and the census claims total coverage" src/domain/prose/wiringCensus.js "npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism"

# 81. INSTR-912 car 9 — A COLUMN CLOSES ONLY WHERE EVERY SOURCE THE SPEC NAMES IS READ.
#     Plant #78 covers the persons column, which is open by LAW; these three cover the
#     columns that are open by MEASUREMENT, which is where the arm can go quietly vacuous.
#     `whatItDoes` reads one of the six sources CLERK-LAWS §1.2 names for it, so it is
#     `closed: false` — and a hand-written `true` beside a five-source shortfall is exactly
#     the over-licence the honesty rule exists to forbid (a closed column licenses a
#     quantifier over it). The plant writes the flag by hand instead of deriving it.
#     Measured before landing (lane INSTR-912, 2026-09-08): planted => 2 red of 17 — the
#     closed-implies-sources-read arm and the three-columns-open arm; restored cmp-exact
#     => 17 passed. RE-EXECUTED at car 10's tip: 2 red of 18, the same two arms by name.
perl -0pi -e "s/        closed: sourcesAllRead\('whatItDoes'\),/        closed: true,/" src/domain/institutions/institutionTable.js
check_caught "institution-table/a partially-filled column is closed by hand and over-licenses a quantifier" src/domain/institutions/institutionTable.js "npx vitest run tests/lint/institutionTable.walker.test.js --no-file-parallelism"

# 82. INSTR-912 car 9 — A SOURCE DECLARED READ MUST ACTUALLY BE READ. `whatItCounts` closes
#     BECAUSE all three of its §1.2 sources are read, and the third of them — the fired
#     `economicState` income row — was the one car 4 left on the table (a town holds `Market
#     Taxes`, `Church Tithes` and `Gate Tolls` and the duty column refused every one). The
#     quiet failure is a source roster that still SAYS `read: true` while the code stops
#     consulting it: the column stays closed, the census still prints, and the duty the world
#     holds silently leaves the table again. The plant strikes the read and leaves the
#     declaration standing. Measured: planted => 1 red of 17, on the positive twin;
#     restored cmp-exact => 17 passed. RE-EXECUTED at car 10's tip: 1 red of 18, same arm.
perl -0pi -e "s/\.\.\.dutyRows\.map\(\(s\) => s\.name\), \.\.\.incomeDuties/...dutyRows.map((s) => s.name)/" src/domain/institutions/institutionTable.js
check_caught "institution-table/a column source declared read stops being read and the duty leaves the table" src/domain/institutions/institutionTable.js "npx vitest run tests/lint/institutionTable.walker.test.js --no-file-parallelism"

# 83. INSTR-912 car 9 — THE RUIN FILTER MUST ROUTE THROUGH THE COLUMNS, NOT ONLY THE ROWS.
#     The table's roster is the LIVE roster, so a ruined citadel carries no wall duty — and
#     the first cut applied that to the ROWS while building the service COLUMNS from the
#     unfiltered bag. Over 30 settlements, 23 service rows named an institution the roster
#     does not hold (`(lawless)`, `(informal)`, `(street gang)`, `(arcane underground)`,
#     `(smuggling)`), and `census-city`'s `whatItDoes` carried `Arcane services (illicit)` on
#     that ground. Zero were duty-kind, so the Brackwater class did not fire — which is
#     precisely why it would have stayed latent until a duty-kind row appeared. The plant
#     removes the column filter. Measured: planted => 1 red of 17; restored cmp-exact
#     => 17 passed. RE-EXECUTED at car 10's tip: 1 red of 18, the ruin-filter arm by name.
perl -0pi -e "s/  const services = allServices\.filter\(\(row\) => !row\.institution \|\| liveNames\.has\(row\.institution\)\);/  const services = allServices;/" src/domain/institutions/institutionTable.js
check_caught "institution-table/the ruin filter leaves the service columns and an absent institution licenses a duty" src/domain/institutions/institutionTable.js "npx vitest run tests/lint/institutionTable.walker.test.js --no-file-parallelism"

# 84. INSTR-912 car 10 — "RESOLVED" MUST NEVER AGAIN BE READ AS "RECOVERED". Plant #80 covers
#     the STATUS: a pool the census cannot read must say so. This plant covers the quieter
#     half, which #80's split cannot see by construction: the status stays right, the ladder
#     goes on reaching its rungs, the anti-vacuity split still reads 318/390 — and the
#     PREDICATE comes back empty. That is exactly the tip cars 8 and 9 shipped, where 143 of
#     310 RESOLVED rows carried `predicate: []` while the receipt, this walker's own assertion
#     message and the wave's tier table all said the selecting predicate had been RECOVERED.
#     The plant strikes the predicate on rungs one and two and leaves everything else
#     standing. Measured before landing (lane INSTR-912, 2026-09-08): planted => 9 red of 26 —
#     the two new integers ("RESOLVED" IS NOT "RECOVERED"), the summary's supporting integers,
#     controls (c1b), (c1b2), (c1c), (c1d) and (c3), the fact index and the co-occurrence arm.
#     ⭐ THE ANTI-VACUITY SPLIT (318 / 390) AND THE TIER TABLE STAY GREEN — which is the whole
#     point of the plant: this is the blindness #80 cannot see, and it is what shipped.
#     Restored cmp-exact => 26 passed.
perl -0pi -e 's/        predicate: qualify\(\[\.\.\.guardRows, \.\.\.extra\], fn, callArgs\),/        predicate: [],/' src/domain/prose/wiringCensus.js
check_caught "prose-wiring-census/a resolved pool loses its predicate and RESOLVED still reads as RECOVERED" src/domain/prose/wiringCensus.js "npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism"

# 85. INSTR-912 car 10 — A SOURCE READ ONLY INTO A STRING NOBODY ASSERTS IS NOT READ.
#     `whatItCounts.closed` is DERIVED from "every source CLERK-LAWS §1.2 names is read", and
#     its third source — `economicState.treasury.coinFlows.taxed` — reaches only the column's
#     `basis` string. On every generated settlement the ledger is absent (a world-pulse
#     structure no generator writes), so the ABSENT branch is taken everywhere and replacing
#     the read with `NaN` left the whole file green: a column closed in the over-licensing
#     direction §L.2 item 62 forbids, resting on a read no arm could see go dark. Plant #82
#     covers the fired income row and plant #81 covers the derivation the flag itself rests on;
#     this is the third source. The plant strikes the read and leaves the source roster's
#     `read: true` standing. Measured before landing (lane INSTR-912, 2026-09-08):
#     planted => 1 red of 18, the present-branch arm by name; restored cmp-exact => 18 passed.
#     ⚠ THE TARGET MOVED AT CAR 11 and this plant moved with it. Car 9 read the ledger at
#     `settlement.treasury`, a path NO writer in the estate produces; car 11 re-pointed the
#     read to `settlement.economicState.treasury`, where `advanceTreasury` actually writes it.
#     The plant's pattern is the NEW line — a plant whose regex no longer matches mutates
#     nothing and reports CLEAR, which is the silent way a standing plant dies.
perl -0pi -e "s/  const taxedCoin = Number\(settlement\?\.economicState\?\.treasury\?\.coinFlows\?\.taxed\);/  const taxedCoin = NaN;/" src/domain/institutions/institutionTable.js
check_caught "institution-table/the third column source stops being read and the closed flag does not notice" src/domain/institutions/institutionTable.js "npx vitest run tests/lint/institutionTable.walker.test.js --no-file-parallelism"

# 86. MEASURE car 0 — A COVERT READING MUST NEVER READ AS AN ORDINARY ONE. The wiring
#     census's `covert` column is what makes ARCH §2.5's projector refusal executable: a pool
#     whose READS names `compromisedSecurityInstitutions().covert`, `npc.corrupt` or any
#     covert impairment may hold no unmarked variant, because on the player face it must not
#     be a candidate at all and nothing it does — including what it prevented — may be
#     observable there. This plant makes `isCovertPath` answer `false` for everything. Every
#     other column stays exactly right: the status, the rung, the predicate, the tier table
#     and the anti-vacuity split are all unmoved, and the census simply stops being able to
#     see the one class of reading that can leak a DM fact onto a player page. Measured before
#     landing (lane MEASURE, 2026-09-08): planted => 2 red of 47 — the covert control by name
#     and the committed-JSON identity arm; restored cmp-exact => 47 passed.
perl -0pi -e "s/  if \(COVERT_SOURCES\.some\(\(source\) => chain\.includes\(source\)\)\) return true;\n  return chain\.split\('\.'\)\.includes\('covert'\);/  return false;/" src/domain/prose/wiringCensus.js
check_caught "prose-wiring-census/a covert reading reads as an ordinary one and an unmarked variant passes" src/domain/prose/wiringCensus.js "npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism"

# 87. MEASURE car 0 — A DEFAULT MUST NEVER WEAR A READING'S CLOTHES. The `absent` column
#     generalises the mount registry's own test (dossierMounts.js:56-80) to the field grain:
#     a read that supplies its own fallback (`config.monsterThreat || 'frontier'`) cannot tell
#     an absent producer value from the fallback, so a modifier predicate over it is a
#     projector error unless written `present AND …`. This plant makes the `default` verdict
#     answer `measured` instead — a one-token change that leaves the `not-produced` limb, the
#     rung attribution, the tier table and every other integer standing while the whole finding
#     class goes quiet. It is the exact shape of every dead arm this subsystem has shipped.
#     Measured before landing (lane MEASURE, 2026-09-08): planted => 3 red of 47 — the
#     fallback control, the corpus absence distribution, and the committed-JSON identity arm;
#     restored cmp-exact => 47 passed.
perl -0pi -e "s/ return 'default';/ return 'measured';/" src/domain/prose/wiringCensus.js
check_caught "prose-wiring-census/a defaulting read reports as a measurement and the absence class goes quiet" src/domain/prose/wiringCensus.js "npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism"

# 88. MEASURE car 0 — AN ATTACH SET MUST EXCLUDE THE SPINES THAT ALREADY TEST THE FACT. The
#     derived attach set is what keeps the authored corpus LINEAR (ARCH §6.2, E-F1): a modifier
#     reading one fact attaches to every RESOLVED spine of its block whose own `tests` EXCLUDE
#     that fact, and a spine that already tests it would be restating itself in the second
#     sentence. This plant drops the exclusion, so every attach set becomes every spine and
#     ATTACH COVERAGE reads 100 % everywhere — the friendliest possible number, and the one
#     that would let car 9 author a modifier onto the very spine that already says its fact.
#     Measured before landing (lane MEASURE, 2026-09-08): planted => 3 red of 47 — the attach
#     control, the corpus coverage arm (DS-STR-1 stops being a finding), and the committed-JSON
#     identity arm; restored cmp-exact => 47 passed.
perl -0pi -e "s/        \.filter\(\(s\) => !\(s\.reads \|\| s\.fieldsRead \|\| \[\]\)\.includes\(field\)\)/        .filter(() => true)/" src/domain/prose/wiringCensus.js
check_caught "prose-wiring-census/an attach set keeps the spines that already test the fact" src/domain/prose/wiringCensus.js "npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism"

# 89. MEASURE car 0e — `reads` MUST BE THE SELECTING BRANCH'S FIELDS AND NOT THE WHOLE
#     FUNCTION'S. SITTING §O.1 re-cut the grain: ARCH §4.4 defines a pool's `tests` as "every
#     field the SELECTING BRANCH evaluates", and car 8 implemented the KEY FUNCTION's whole
#     reading set, so on a block whose pools come from ONE ladder every spine carried the same
#     read set and no fact of that block could attach anywhere (26 of the 50 composable
#     blocks, DS-DEF-11 among them). This plant puts the function-wide reading back on every
#     predicate row. Nothing else moves — the status, the rung, the predicate, the tier table
#     and the anti-vacuity split are untouched — and the fact budget, the attach coverage, the
#     absence distribution and the join all quietly return to the pre-ruling numbers.
#     Measured before landing (lane MEASURE, 2026-09-08): planted => 9 red of 50; restored
#     cmp-exact => 50 passed.
perl -0pi -e "s/        \.\.\.form\.path\.flatMap\(\(g\) => guardFields\(g, fn\.params, readAliases\)\),/        ...readings(fn, callArgs),/" src/domain/prose/wiringCensus.js
check_caught "prose-wiring-census/reads answers the whole key function on a row whose branch was recovered" src/domain/prose/wiringCensus.js "npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism"

# 90. MEASURE car 0e — THE BRANCH PATH MUST NOT ENTER A SIBLING BLOCK IT ONLY WALKED PAST.
#     `branchPath` recurses over REGIONS precisely so that a literal sitting AFTER an `if`
#     block does not inherit the guards INSIDE it: at `defenseStateProse.js:747` the UNWALLED
#     literals must read {walls, tier} and never the gate or the monster family, which they
#     never see. This plant drops the upper bound of the containment test, so any literal at
#     or after a consequent's start reads as being INSIDE it and the reader recurses into a
#     region it should have stepped over — the exact failure a backwards scan to the nearest
#     `if` would have. It is the quietest possible corruption: every read set grows, none
#     disappears, and the census still answers on every row.
#     Measured before landing (lane MEASURE, 2026-09-08): planted => 8 red of 50; restored
#     cmp-exact => 50 passed.
perl -0pi -e "s/    if \(at >= start && at < end\) \{/    if (at >= start) {/" src/domain/prose/wiringBranch.js
check_caught "prose-wiring-census/the branch path enters a sibling block it only walked past" src/domain/prose/wiringBranch.js "npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism"

# 91. MEASURE car 0e — A PER-TIER SILENCE MUST NOT BE CALLED LAWFUL WITHOUT ITS GROUND.
#     SITTING §O.5: a pool silent at a size where its block mounts is LAWFUL only when its own
#     RUNG spoke at that size and chose another value class (the field could not hold this
#     pool's value there); with no such sibling the rung said NOTHING at that size and the row
#     is MISSING-AT-TIER, which is the authoring wave's. This plant answers LAWFUL for every
#     silence, which is the friendliest number available: the wave's list empties, the fourth
#     tier goes to zero, and the instrument reports a clean bill on 347 rows it never tested.
#     Measured before landing (lane MEASURE, 2026-09-08): planted => 1 red of 50 — the
#     classification arm, driven on its fixture, which is the only arm that runs the live rule
#     (the corpus figures are committed DATA and a plant cannot move them); restored cmp-exact
#     => 50 passed.
perl -0pi -e "s/      const lawful = \(spokeAt\.get\(tier\) \|\| new Set\(\)\)\.has\(rung\.id\);/      const lawful = true;/" scripts/prose-rate-corpus.mjs
check_caught "prose-wiring-census/every per-tier silence is called lawful and the wave's list empties" scripts/prose-rate-corpus.mjs "npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism"

# 92. MEASURE car 0f — THE ALIAS DRAFT'S IDENTIFIER MATCH IS A CASE- AND SEPARATOR-INSENSITIVE
#     READING, AND WITHOUT IT THE ONLY STRONG EVIDENCE THE DRAFT HAS DISAPPEARS. SITTING §O.2
#     chartered a MEASUREMENT of what a normalisation between the relation table's PRODUCER
#     TOKENS (`system:food_security`, `condition:famine`) and the desks' READ PATHS
#     (`eco.foodSecurity.stockpile`) would buy. Car 0 measured the raw leaf join at 0 rows on
#     both endpoints precisely because it compared segments with no case reading; `aliasKey` is
#     that reading and nothing else. This plant drops the `.toLowerCase()`, so every camelCase
#     segment loses its capitals to the character filter (`foodSecurity` -> `foodecurity`) and
#     the three identifier candidates -- including ARCH §5.2's own worked gate edge -- vanish
#     while the docblock and generator-write rows carry on. The draft still prints, still
#     answers, and has quietly lost the half a sitting would ratify.
#     Measured before landing (lane MEASURE, 2026-09-08): planted => 2 red of 52; restored
#     cmp-exact => 52 passed.
perl -0pi -e "s/export const aliasKey = \(token\) => String\(token\)\.toLowerCase\(\)\.replace/export const aliasKey = (token) => String(token).replace/" scripts/wiring-census.mjs
check_caught "prose-wiring-census/the alias draft stops reading case and its identifier evidence disappears" scripts/wiring-census.mjs "npx vitest run tests/lint/proseWiringCensus.walker.test.js --no-file-parallelism"

# 93. MEASURE car 1 — THE CLASSIFIER'S ORDER IS ITS SPECIFICATION. `classifyCell` answers with
#     the FIRST verdict that fits, strongest first: a cell whose POOL changed also has new
#     words and usually a new variant, so testing WORDING-ONLY before REPLACED lets a signed
#     car report "only the wording moved" about a cell that now speaks a different fact. That
#     is the whole reason the composed-prose model can be accepted on a classification instead
#     of on a diff. This plant moves the WORDING-ONLY test to the front. Every count still
#     prints, every cell still gets a verdict, and the instrument has quietly stopped being
#     able to tell a rewrite from a replacement.
#     Measured before landing (lane MEASURE, 2026-09-08): planted => 1 red of 11; restored
#     cmp-exact => 11 passed.
perl -0pi -e "s/  if \(base\.pool !== tip\.pool\) return 'REPLACED';/  if (base.textSha !== tip.textSha) return 'WORDING-ONLY';/" scripts/prose-manifest-diff.mjs
check_caught "dossier-prose-manifest/the classifier tests wording before replacement and cannot tell them apart" scripts/prose-manifest-diff.mjs "npx vitest run tests/property/dossierProseManifest.test.js --no-file-parallelism"

# 94. MEASURE car 1 — THE CELL'S VARIANT IS IDENTIFIED FROM THE RENDERED SENTENCE, AND THE
#     TEMPLATE READER IS THE WHOLE IDENTIFICATION. `eligibleVariants` filters by slot ANCHORING
#     and by state DIMENSIONS, neither visible outside the desk call, so the manifest cannot
#     recompute the draw; it matches the rendered sentence against each variant's template
#     instead, and `vid`, `index` and every `pieces` entry follow from that match. This plant
#     makes `templateMatches` answer true for everything: every cell then "resolves" to the
#     first variant of its pool, the whole manifest re-keys onto a fiction, and the ambiguity
#     counter — the one arm that would notice — is answering about the same fiction.
#     Measured before landing (lane MEASURE, 2026-09-08): planted => 3 red of 11 — the
#     resolution arm, the drift arm and the template reader's own control; restored cmp-exact
#     => 11 passed.
perl -0pi -e "s/  return new RegExp\(\`\^\\\$\{source\}\\\$\`\)\.test\(String\(rendered\)\);/  return true;/" tests/helpers/dossierManifest.js
check_caught "dossier-prose-manifest/the template reader matches everything and every cell resolves to a fiction" tests/helpers/dossierManifest.js "npx vitest run tests/property/dossierProseManifest.test.js --no-file-parallelism"

# 95. MEASURE car 2 — A BYTE THAT ENTERS THE CORPUS MUST BE SEEN, AND UNTIL THIS RATCHET
#     LANDED NOTHING IN THE ESTATE COULD SEE ONE. ARCH-COMPOSED-PROSE §10 grows the six
#     dossier state leaves from 641,410 raw bytes toward a declared ceiling of about 2.8 MB.
#     The three first-paint budgets measure the ENTRY CLOSURE, which the corpus is absent
#     from by construction (it rides data-lazy), and scripts/.size-baseline.json is a max-
#     LINES instrument whose ceilingFor() returns null for src/data/**, so the corpus sat
#     outside every existing ruler: a wave that quadrupled it would have measured green
#     everywhere. This plant lengthens ONE authored sentence by fifteen repetitions of a
#     clause, +1,110 raw bytes — the smallest realistic shape of the rewrite wave's own
#     growth, and deliberately a repetitive one, because that is the payload the compressed
#     half is least able to see. The leaf still parses, the three blocks still export, every
#     other prose gate stays green, and the corpus has quietly grown.
#     Measured before landing (lane MEASURE, 2026-09-08): planted => 1 red of 17 — the RAW
#     exact arm, naming the leaf and the new count; the GZIP band did NOT fire (+64 B against
#     a 129 B band), which is why RAW is the exact ruler here; restored cmp-exact => 17 passed.
perl -0pi -e "s{It is receding\. What remains is the damage rather than the danger\.}{'It is receding. What remains is the damage rather than the danger.' . (' The ledgers still carry the entry and the streets still carry the memory.' x 15)}e" src/data/dossierStateProse/stressors.generated.js
check_caught "prose-corpus-bytes/a leaf grows by a kilobyte and the byte ratchet does not see it" src/data/dossierStateProse/stressors.generated.js "npx vitest run tests/lint/proseCorpusBytes.test.js --no-file-parallelism"

# 96. SEAM car 3a — THE COMPOSER'S ORDER MAY NOT BE A LOCALE'S. The composed model ranks
#     modifier candidates within a salience band by the kernel's 32-bit digest of key 5 and
#     breaks an EXACT tie by CODE-UNIT comparison of the candidate key. `localeCompare`
#     collates through the host's ICU/CLDR tables, so two devices can order the same two keys
#     differently and compose two DIFFERENT sentences from one seed — the same-seed,
#     every-device promise broken at the one place in the composer where two strings are
#     compared at all. This plant swaps the tie-break for a collation.
#     WHY A SOURCE FENCE AND NOT A BEHAVIOURAL ARM: the tie limb is unreachable on today's
#     content (no block ships pool metadata, so no modifier can seat), so no composed output
#     moves and no manifest can see it. A scan of the module is the only instrument that can.
#     Measured before landing (lane SEAM, 2026-09-08; cp backup, cp restore, never the
#     checkout family; md5 2a193234ea2ea7ef54b1fb1b6bfd4097 before and after): clean tree =>
#     9 passed; planted => EXACTLY 1 red, the banned-API arm by name, 8 passed; and
#     tests/lint/localeCompareGuard.test.js reds independently (1 of 3); restored
#     cmp-identical => 9 passed.
perl -0pi -e "s/  return a\.key < b\.key \? -1 : 1;/  return a.key.localeCompare(b.key);/" src/domain/display/stateProse/composeStateProse.js
check_caught "compose-state-prose-fence/the composer's tie-break becomes a locale collation and the seam stops being device-stable" src/domain/display/stateProse/composeStateProse.js "npx vitest run tests/lint/composeStateProseFence.test.js --no-file-parallelism"

# 97. SEAM car 5 -- AN UNESTABLISHED JOIN MAY NOT BE REPORTED AS A REFUSED ONE. Arm A2 licenses
#     a `consequence` or `tension` joint against the relation table for (the spine's PRIMARY
#     field, the modifier's field), with the direction read. It has THREE answers and not two:
#     both endpoints in the table's own vocabulary and no row joining them is a FAIL, because
#     the question was asked and answered; endpoints the table has never heard of are WITHHELD,
#     because the join is UNESTABLISHED rather than negative. That second answer is the shipped
#     state -- car 0's F1 measured that NONE of the 165 engine relation rows joins a desk read
#     root, source (d) empty -- so a walker that collapsed the two would report every authorable
#     joint in the estate as a failure and would blame authors for a table nobody has ratified.
#     This plant moves the unestablished limb from WITHHELD to FAIL: every other arm stays
#     green, the counts stay the same, and the one distinction the channel exists to carry is
#     gone.
#     Measured before landing (lane SEAM, 2026-09-08; cp backup, cp restore, never the checkout
#     family; md5 b40a9dc406ab010407da8bf602cc36a8 before and after): clean tree => 66 passed;
#     planted => EXACTLY 1 red, the shipped-state arm by name, 65 passed; restored cmp-identical
#     => 66 passed.
perl -0pi -e "s/emit\(out, row\(id, 'A2', 'WITHHELD', 'unestablished join'/emit(out, row(id, 'A2', 'FAIL', 'unestablished join'/" src/domain/prose/composedWalker.js
check_caught "prose-composed-walker/an unestablished relation join is reported as a refused one" src/domain/prose/composedWalker.js "npx vitest run tests/lint/proseComposed.walker.test.js --no-file-parallelism"

# ── REWRITE car 8a-2 · THE PASSAGE SHAPE IS RESCUED INSTEAD OF LICENSED ────────────────
#     The owner's ruling (b) on passage shapes is one sentence and it is the whole design:
#     "A SHAPE IS LICENSED BY THE COMPOSITION, NEVER RESCUED BY IT". Shape 2 puts the added
#     fact FIRST, so the reader meets it with no spine to hang it on, and the only thing that
#     makes it readable is the added sentence handing a noun forward into the spine. Remove
#     that guard and every unit becomes eligible for sentence-first — the shape stops being
#     licensed by the composition and starts being available to it, which is the failure the
#     module exists to refuse and which no distribution table would show as anything but a
#     healthy-looking rise in shape 2's share.
#     The plant is ONE CHARACTER: `> 0` becomes `>= 0`, so `nounCarry` reports a carry on
#     every pair including pairs sharing no word at all.
#     Measured before landing (lane REWRITE, 2026-09-09; cp backup, cp restore, never the
#     checkout family; md5 dae4ad49fd1af7510aa59c14f1bdfd98 before and after): clean tree =>
#     11 passed; planted => EXACTLY 1 red, "SHAPE 2 NEEDS THE NOUN CARRY", 10 passed;
#     restored cmp-identical => 11 passed.
perl -0pi -e "s/carries: shared\.length > 0/carries: shared.length >= 0/" src/domain/prose/passageShapes.js
check_caught "prose-passage-shapes/a passage shape is rescued by the composition instead of licensed by it" src/domain/prose/passageShapes.js "npx vitest run tests/lint/prosePassageShapes.walker.test.js --no-file-parallelism"

# ── THE PINNED FOOTER (owner orders 2026-09-16) ───────────────────────────────────────
# 98. A BOTTOM-ANCHORED LAYER MAY NOT FORGET THE PINNED FOOTER. On desktop the global footer
#     is sticky and its links row (THE BAND) floats at the viewport bottom, so every fixed
#     layer anchored to that edge composes the band's measured height through aboveFooter()
#     or FOOTER_INSET; at a bare `bottom: 72` the scroll-button stack (the owner's own square
#     arrow) lands on the footer's links. The walker freezes LIFTED and EXEMPT per file,
#     exact in both directions. The plant strips the lift from that very stack, which moves
#     one App.jsx site from LIFTED to EXEMPT's unnamed remainder.
#     Measured before landing (2026-09-16; cp backup, cp restore, never the checkout family;
#     md5 7e9f63ff538589deb2c31dd876b472fd before and after): clean tree => 11 passed;
#     planted => 2 red, the LIFTED and EXEMPT exact arms, the EXEMPT arm naming the stack by
#     line, 9 passed; restored cmp-identical => 11 passed.
perl -0pi -e "s/bottom: aboveFooter\(isMobile \? bottomClearance\(CHROME\.fabLift \+ 56\) : SP\.lg \+ 56\), right: SP\.lg, zIndex: 200,/bottom: isMobile ? bottomClearance(CHROME.fabLift + 56) : SP.lg + 56, right: SP.lg, zIndex: 200,/" src/App.jsx
check_caught "bottom-anchored-chrome/the scroll-button stack drops its footer lift and lands on the pinned band" src/App.jsx "npx vitest run tests/lint/bottomAnchoredChrome.walker.test.js --no-file-parallelism" "EXEMPT is exact: an un-lifted layer not named here is the collision the order forbids"

# 99. THE FOOTER FLOATS ONLY ITS LINKS ROW. The owner's follow-up order keeps only the links
#     row in view and shows the home button and the copyright line when the page is scrolled
#     all the way down. The mechanism is one declaration: the sticky footer's bottom offset is
#     minus THE TUCK (FOOTER_TUCKED_BOTTOM), never a literal 0. The plant writes `bottom: 0`,
#     which is exactly the first order's whole-footer-pinned shape: nothing fails to render
#     and every rect-free assertion elsewhere stays green, so only the style contract sees it.
#     Measured before landing (2026-09-16; cp backup, cp restore, never the checkout family;
#     md5 7e9f63ff538589deb2c31dd876b472fd before and after): clean tree => 23 passed;
#     planted => 2 red, (a)'s sticky-offset arm and (c)'s mobile /terms arm, 21 passed;
#     restored cmp-identical => 23 passed.
perl -0pi -e "s/bottom: FOOTER_TUCKED_BOTTOM, zIndex:/bottom: 0, zIndex:/" src/App.jsx
check_caught "pinned-footer/the footer pins whole again instead of floating only its links row" src/App.jsx "npx vitest run tests/components/pinnedFooter.test.jsx --no-file-parallelism" "sticky with a bottom of minus the tuck, on the header layer, outside any header, nav still labelled"

echo ""
echo "── Mutation sweep results ──────────────────────────────"
for r in "${results[@]}"; do echo "  $r"; done
echo "────────────────────────────────────────────────────────"
echo "  CAUGHT: $PASS    CLEAR: $CLEAR    MISSED/BROKEN: $FAIL"
# Leftover check. Scoped to MUTATED_FILES (so it can never drift from the areas
# above — the old hand-kept directory list omitted tests/ and scripts/, where five
# areas mutate) plus a tree-wide sweep for surviving PLANTED probes and .bak
# rescue copies, every one of which carries a mutsweep marker in its path.
leftover_mutations="$(git status --porcelain -- "${MUTATED_FILES[@]}" 2>/dev/null)"
leftover_plants="$(git status --porcelain --untracked-files=all 2>/dev/null | grep -Ei 'mutsweep|mutation_sweep' || true)"
if [ -n "$leftover_mutations$leftover_plants" ]; then
  echo "  WARNING: tree not clean after sweep:"
  [ -n "$leftover_mutations" ] && echo "$leftover_mutations"
  [ -n "$leftover_plants" ] && echo "$leftover_plants"
fi
if [ "$FAIL" -eq 0 ]; then echo "  spine holds: every injected regression was caught and every negative control stayed clear."; else echo "  SPINE GAP: $FAIL regression(s) slipped past the gate or the gate is broken."; fi
exit "$FAIL"
