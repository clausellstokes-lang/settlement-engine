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
PASS=0; FAIL=0
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
  src/App.jsx
  scripts/mutation-coverage-manifest.json
  src/domain/display/chroniclersLetter.js
  src/design/townGlyphs/medieval.js
  src/lib/flagRegistry.js
  tests/copy/.composed-prose-seams-baseline.json
  src/domain/realm/heraldRouting.js
  src/domain/townMap/audienceProjection.js
  src/domain/townScene/sceneProjection.js
  src/components/townMap/fog/FogPlayerView.jsx
  src/components/townMap/scene3d/SettlementScene3D.jsx
  src/components/townMap/scene3d/TownSceneCanvas.jsx
  supabase/migrations/182_operational_obligation_health.sql
  supabase/migrations/183_application_command_journal.sql
  supabase/migrations/184_import_reconciliation_commands.sql
  src/store/canonEventCommandTransaction.js
  src/store/campaignImportedCreation.js
  src/domain/display/economyFreshness.js
  src/components/new/tabs/EconomicsTab.jsx
  src/store/operationRegistry.js
  src/store/aiSlice.js
  src/store/neighbourSlice.js
  src/generators/steps/assembleInstitutions.js
  tests/fixtures/distribution-envelopes.manifest.json
  src/domain/display/discourseKernel.js
  src/domain/townMap/arch/params.js
  src/domain/townMap/arch/kit.js
  src/domain/townMap/arch/conditionParams.js
  src/domain/dossier/realmEntityWeb.js
  tests/security/aiSpendSafety.pglite.test.js
  tests/security/systemConfigPublicRead.pglite.test.js
  supabase/migrations/087_review_money_hardening.sql
  src/lib/worldExport.js
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
  local label="$1" file="$2" check="$3"
  if [ "${MUTATION_SWEEP_ALLOW_DIRTY:-}" != "1" ] && git diff --quiet -- "$file" 2>/dev/null; then
    results+=("BROKEN  GAP  $label  (mutation did not apply — $file is unchanged; stale anchor?)"); FAIL=$((FAIL+1))
    return
  fi
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

# 21. Voice mechanics — an exclamation point lands in a scanned prose string
#     literal (the em-dash/'!' ban, shrink-only over src/data + src/domain).
printf "\nexport const _mutVoice = 'sweep probe!';\n" >> src/data/stressTypes.js
check_caught "voice/exclamation in scanned data prose" src/data/stressTypes.js "npx vitest run tests/copy/voiceMechanics.test.js"

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

# 44. Fog authorization — compile a shared fog surface with the DM audience
#     instead of the player audience. The fail-closed boundary test must red
#     before any unrevealed fact could reach a live player window or handout.
perl -0pi -e "s/audience: 'player',/audience: 'dm',/" src/components/townMap/fog/FogPlayerView.jsx
check_caught "town-scene/fog player surface uses dm audience" src/components/townMap/fog/FogPlayerView.jsx "npx vitest run tests/security/townSceneFogFailClosed.test.js"

# 45. Accessible companion layout — remove the responsive layout hook from the
#     scene root. The local accessibility contract must catch the loss before
#     high-zoom and narrow-screen CSS silently stop stacking the companion.
perl -0pi -e "s/data-town-scene-layout/data-scene-layout/" src/components/townMap/scene3d/SettlementScene3D.jsx
check_caught "town-scene/accessibility layout hook removed" src/components/townMap/scene3d/SettlementScene3D.jsx "npx vitest run tests/ui/townSceneAccessibility.contract.test.jsx"

# 46. WebGL recovery — detach the listener from the real context-loss event.
#     The canvas browser contract must prove context loss is prevented, paused,
#     announced, and delegated to recovery.
perl -0pi -e "s/webglcontextlost/webglcontextlost-disabled/g" src/components/townMap/scene3d/TownSceneCanvas.jsx
check_caught "town-scene/canvas context-loss listener detached" src/components/townMap/scene3d/TownSceneCanvas.jsx "npx vitest run tests/ui/townSceneCanvas.contract.test.jsx"

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
perl -0pi -e "s/chronicle: nextChronicle \};\n    get\(\)\.updateSavedSettlement\(saveId, \{ aiData: nextAiData \}\);/chronicle: nextChronicle };\n    get().updateSavedSettlement(saveId, { aiData: nextAiData, aiRevisionCount: 1 });/" src/store/aiSlice.js
check_caught "patch-keys/call site writes an unadmitted key" src/store/aiSlice.js "npx vitest run tests/store/savedSettlementPatchKeysWalker.test.js"

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

echo ""
echo "── Mutation sweep results ──────────────────────────────"
for r in "${results[@]}"; do echo "  $r"; done
echo "────────────────────────────────────────────────────────"
echo "  CAUGHT: $PASS    MISSED/BROKEN: $FAIL"
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
if [ "$FAIL" -eq 0 ]; then echo "  spine holds: every injected regression was caught."; else echo "  SPINE GAP: $FAIL regression(s) slipped past the gate or the gate is broken."; fi
exit "$FAIL"
