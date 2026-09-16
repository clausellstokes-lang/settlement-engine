# Generation contracts

**Status:** CANONICAL  
**Scope:** settlement generation, final assembly, and owner-facing read models

## Bottom line

Settlement generation has one resolved truth and several deliberately different
projections of it. A generator may derive prose, economic analysis, or a PDF
summary from that truth, but those projections do not become competing sources
of state.

The seven contracts below close the most common routes to contradiction:

1. **World law** decides what generated entities and claims are eligible.
2. **Resource truth** records which native and custom resources exist and which
   native resources are depleted.
3. **Cultural identity** materializes one seed-stable local expression of the
   selected culture.
4. **Content profile** bounds themes introduced by generation.
5. **Isolation support** explains how an isolated settlement remains viable.
6. **Power freshness** proves political power consumed the final economy.
7. **Coherence receipt** audits the final assembled dossier after repair passes.

```text
raw config
  -> resolveConfig
       -> effective config + culture identity + content profile
       -> immutable GenerationContext / WorldLaw
  -> resolveResources
       -> effective-config resource roster and condition sidecars
  -> bounded producers
       -> institutions, services, NPCs, history, economy, prose
  -> isolation and structural passes
  -> final economy -> power projection and fingerprint assertion
  -> final assembly and repairs
  -> generationCoherenceReceipt
  -> dossier, PDF, save, and simulation consumers
```

## Contract map

| Contract | Authority | Persisted settlement data | Primary consumers |
|---|---|---|---|
| World law | `generators/generationContext.js` | Not serialized; stable profile IDs and `worldLawVersion` receipt metadata only | institution, service, NPC, secret, history, and isolation producers |
| Resource truth | `steps/resolveResources.js` plus `domain/resourceSemantics.js` | `config.nearbyResources*` and definition-identity sidecars | economy, food, isolation, trace, resource analysis |
| Cultural identity | `data/cultureProfiles.js`, materialized by `steps/resolveConfig.js` | `culturalIdentity`, plus compatibility prose in `culturalNotes` | generation weighting, dossier prose, PDF, AI grounding |
| Content profile | `domain/generationContentProfile.js`, resolved by `steps/resolveConfig.js` | `config.contentProfile` and resolved `config.contentBoundaries` | world law, generated-theme filters, coherence audit |
| Isolation support | `generators/isolationSupport.js` | `isolationSupport` | structural validation, coherence audit, owner explanation |
| Power freshness | `generators/power/economyReconciliation.js` plus `steps/powerEconomyReconcilePass.js` | `powerStructure.powerProjectionVersion` and `powerStructure.economyInputFingerprint` | faction power, legitimacy, relationships, capture state, final assembly |
| Coherence receipt | `generators/generationCoherence.js` plus direct final-graph judgments in `generators/generationReceiptJudgments.js` | `generationCoherenceReceipt` | corpus gates, owner-facing diagnostics, future certification |

## 1. World law is transient policy

`GenerationContext` captures the resolved tier, route, terrain, culture profile,
and content profile for one run. Its immutable `worldLaw` composes hard magic
facts, route capabilities, and generated-theme boundaries behind predicates such
as `allowsInstitution`, `allowsService`, and `allowsHistoryEvent`.

The object is intentionally **not persisted**. It contains functions and is valid
only during the run that created it. Saves persist the resolved facts and the
coherence receipt, never a rehydratable imitation of those predicates. Direct
generator callers must use `resolveGenerationWorldLaw`, which accepts an existing
context/law or creates the same policy fallback.

Precedence is explicit:

- `magicExists: false` is a hard prohibition, even when magic priority is high.
- zero magic priority also means functional magic is unavailable.
- custom labels are presentation, not implicit mechanics; explicit metadata is
  required before a custom entity is treated as magical.
- culture may alter bounded likelihood, but never overrides world-law
  eligibility.

## 2. Resource truth lives in the resolved config

The effective config written by `resolveResources` is the current flat-shape
authority:

- `nearbyResources` is the display roster.
- `nearbyResourcesNative` and `nearbyResourcesCustom` retain source membership,
  including same-label native/custom pairs.
- `nearbyResourcesNativeDepleted` is authoritative for native depletion.
- `nearbyResourceDefinitions` and
  `nearbyResourceDefinitionsDepleted` retain immutable custom-definition
  identity.

`availableNativeResourceKeys(config)` is the canonical available-native
projection. `nativeResourceConditionRecords(config)` is a read model over the
same roster and depletion sidecar.

`resourceAnalysis.availableResources` is **not another roster**. It is the
derived resource-key and commodity-token vocabulary used by chain matching.
Consumers must not infer native mechanics from display labels, prose, terrain
potential, or that analysis projection. Legacy saves without explicit source
sidecars remain supported by the authority helpers' documented fallbacks.

## 3. Cultural identity is local, materialized, and bounded

The culture dial selects a fantasy design grammar, not a claim that a real
historical culture is uniform. A named RNG child stream materializes one local,
seed-stable record containing:

`key`, `label`, `scope`, `builtForm`, `civicPattern`, `exchangePattern`,
`foodways`, `sacredLife`, `defensePattern`, `socialTexture`, and
`architecturalDetail`. Mixed identities additionally record `sourceKeys`.

This record is the structured authority for presentation. `culturalNotes`
remains a compact compatibility projection for older PDF and AI consumers.
Institution multipliers remain in a narrow band; tier, route, resources, player
settings, and world law continue to decide eligibility.

## 4. Content profiles govern generated themes

The default `grounded` profile permits serious political and criminal pressure
while excluding generated trafficking, slavery, and torture. `heroic` also
excludes hard-drug themes. `grim` permits the complete governed topic set.
`custom` resolves each boundary from `contentBoundaries`.

Profiles constrain content introduced by the generator. They do not rewrite old
saves or player-authored prose. The resolved boundary record is persisted so
later auditing does not have to reconstruct what the profile meant at generation
time.

The Surveyor construct schema exposes `heroic`, `grounded`, and `grim`.
`custom` is intentionally absent there: the current primitive schema wall cannot
emit the required boundary object, so accepting the label alone would advertise
control the compiler cannot express.

## 5. Isolation requires an explanation, not automatic teleportation

`isolationSupport` is an immutable, RNG-free receipt. For an isolated settlement
it records required capacity, supplied capacity, deficit, status, evidence-bearing
paths, and whether viability depends on magic. Mundane paths include a local
foodshed, hinterland, reserves, seasonal access, and patronage. Magical transit
is a last substitution only when a real deficit remains and functional,
high-priority magic is allowed.

Connected settlements receive a non-applicable `connected` receipt. An explicit
player-authored isolated premise may remain precarious or untenable and be marked
as an authored structural tension; random generation must not silently ship the
same unresolved gap.

## 6. Power consumes the final economy without reopening the loop

`generatePower` establishes political intent from the provisional economy before
faction pressure is allowed to add an institution. It retains a detached,
immutable snapshot of those inputs and a named power RNG seed as transient
pipeline state. After `economyReconcilePass` has produced the final economy,
`powerEconomyReconcilePass` replays that exact intent and refreshes the
economy-dependent power projection.

The pass may change effective shares, public legitimacy, relationship ratios,
criminal capture state, and the economy-derived merchant dominance projection.
It may not add or remove generated faction identities. Neighbour factions keep
their original names, prose, and raw random weights before the combined roster is
re-normalized. The pass never calls `factionCorrelationPass` and never mutates
institutions, so the feedback loop is deliberately bounded to one pull.

The persisted `economyInputFingerprint` covers every economic field the power
projector reads: tier, prosperity, safety label, and food-security label.
Assembly asserts that fingerprint before applying the real defense-readiness
label through the same projection seam, then asserts it again. A missing or stale
fingerprint is a generation error, not an advisory warning. The transient
`powerIntent` itself is never serialized.

## 7. The coherence receipt audits; it does not repair

Final assembly creates `generationCoherenceReceipt` only after the owning repair,
structural, and NPC-coupling passes have completed. Version 1 retains its
original checks and additively records direct final-state checks for reference
integrity, chronology, conserved shares, explicit intent, narrative realization,
dramatic explanation, within-settlement repetition, and provenance.

The original checks cover:

- unresolved narrative template tokens;
- doubled articles, incorrect articles, and lower-case sentence joins;
- no-magic world-law claims;
- generated-theme boundaries;
- agreement between canonical resource conditions, analysis, and active chains;
- hard structural violations;
- agreement between the food ledger and its verdict;
- unique notable-NPC display identities; and
- explained isolation support.

Those checks feed seven separate, evidence-bearing judgments:

1. hard structural validity;
2. cross-system semantic agreement;
3. user-intent fulfillment;
4. narrative realization and grammar;
5. explainable dramatic tension;
6. diversity and repetition; and
7. confidence and provenance.

The judgments inspect the final assembled graph rather than trusting producer
receipts. Broken NPC/faction references, invalid chronology, and unconserved
power or income shares therefore cannot certify themselves. Confidence is
categorical (`pass`, `pass_with_tension`, `needs_review`, or `not_applicable`);
there is no invented numeric confidence score.

Hardship is not itself a defect. An authored contradiction or generated crisis
passes when the dossier explains its cause and preserves the player's premise.
Only unexplained or internally contradictory pressure needs review. The
single-settlement receipt reports duplicate identities and relationships
honestly, but it does not pretend to measure cross-corpus novelty. Cohort
repetition remains the responsibility of the certification corpus and soak.

The receipt status is `coherent`, `coherent_with_authored_tensions`, or
`needs_review`. Each check retains findings; the receipt also retains repairs and
authored tensions. New v1 receipts may also carry the optional `judgments`
extension; keeping it optional preserves readability of existing v1 saves. A
receipt reports the final state and never mutates it. New settlements stamp
`worldLawVersion: 1`; older or externally-authored receipts may still omit that
metadata.

## Evolution rules

- Add a new eligibility rule to world law before teaching multiple producers to
  reinterpret config independently.
- Add a resource state once at the resolved-config authority and derive every
  display/analysis projection from it.
- Version persisted receipts when their field meaning changes; add optional
  fields for compatible extensions.
- Keep old saves readable: absent receipts mean “not recorded,” never “passed.”
- Owner surfaces may summarize receipt facts. Player-safe exports must omit
  internal findings unless a separate projection explicitly classifies them.
- The integration contract tests must fail when a transient world law is
  serialized, when resource projections drift from their authority, or when the
  persisted profile/identity/receipt metadata disagree.

## Test epistemics (EPISTEMIC PREVENTION program, 2026-07-27)

The three hazard classes discovered at the generation-lane close are now machine
law, not lore. Full program record: `docs/EPISTEMIC_PREVENTION_PLAN.md`.

- **Anchored negatives.** A negative assertion (`not.toContain` and kin) must
  prove its subject is live: `expectPresentThenAbsent` for removals,
  `expectAbsentWithAnchor` for exclusions (`tests/helpers/anchoredNegatives.js`),
  or a reviewed `// anchored: <reason>` on the line above. Enforced shrink-only by
  `tests/lint/negativeAssertionAnchor.walker.test.js` (habitat swept 181 → 2; the
  two survivors are recorded owner-queue findings).
- **Seed-loop totality.** A corpus loop must report the TRUE failure count, never
  first-hit: `collectSeedFailures` + `expectNoSeedFailures`
  (`tests/helpers/seedFailures.js`) or `it.each`. Enforced by
  `tests/lint/seedLoopTotality.walker.test.js` (habitat swept 32 → 0).
- **Powered distribution bounds.** A stochastic bound is derived, never
  hand-picked: exact binomial envelopes (`tests/helpers/distributionEnvelope.js`)
  from a measured base rate (N ≥ 400, provenance recorded) registered in
  `tests/fixtures/distribution-envelopes.manifest.json`, margin ≥ 2σ, validated by
  `tests/lint/distributionEnvelopePower.test.js`. Bounds are never loosened
  without an owner ruling (`loosenPending` keeps the tighter live bound in force
  while the choice is open; `ratifiedStricterBound` records a decision to retain
  it without pretending the choice remains pending).
  Two laws from the migration: a base rate must be measured on the corpus the
  test actually runs (the `envelope-${'{'}i{'}'}` prefix corner: 4/50 on the real corpus
  vs 89/400 on the wider family), and degenerate rates (0/N, N/N) are not
  envelope-able — rule-of-three reasoning applies, or restate as a totality
  invariant.
- **Effect reachability.** Every authored generation effect (subsumption,
  cascade, isolation substitution, repair kinds, magic substitution, faction
  pull) must fire at least once across a pinned corpus, with receipt-level
  detectors and an anti-vacuity control:
  `tests/generators/effectReachability.coverage.test.js`. Three repair strata are
  recorded there as UNREACHABLE with evidence (`repair.mutual_exclusion`,
  `repair.access_compatibility`, `repair.hard_dependency`) — re-registering one
  without fixing its producer reds the gate.
