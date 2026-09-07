# TRACK-G2 — THE SHIFT MAP (branch `claude/w-r2-g2`, base 163601a4)

Every fix in this batch was reviewed as golden-shifting. The branch is **RED BY DESIGN**:
the same-seed goldens stay red until the owner-signed regen moment re-records them all at
once (batched with the W-R2-LIGHT preset shifts). This map enumerates, per fix, the files
changed, the fixtures/fields that move, the one-sentence semantic justification, and the
**fold-back** determination (a fix that proved byte-identical for the committed goldens).

## Gate outcome (this branch)
- **Predicted golden reds — category (a), by design (5 files):**
  1. `tests/property/generatorGoldenMaster.test.js` — same-seed generation master.
  2. `tests/property/beliefMapGolden.test.js` — belief-map projection master.
  3. `tests/property/worldpulseDeityGolden.test.js` — deity-pulse mechanical master.
  4. `tests/joins/institutionIdentity.test.js` — the fixed-seed roster golden.
  5. `tests/pdf/goldenViewModel.test.js` — the PDF SHARED_FIELDS canon snapshot.
  All five are fresh-generation / projection masters that legitimately move when the catalog
  gains an institution (D6) and the data fixes change generated values (4, 5, 6, 7). Every
  **dormancy** golden (settlementPolitics / resourceDynamics / naval / momentum / corruptionWeb /
  supplyWebWarfare / peaceCausal / generosity / settlementLifecycle / spatialDigest / seaLanes)
  stayed GREEN — the lazy-kernel dormancy law is intact; nothing perturbs a dormant path.
- **Everything else — category (b):** GREEN. validate:data / validate:migration-head /
  validate:edge / validate:map ✓; typecheck ✓; typecheck:domain:strict (0 errors) ✓; lint
  (0 errors) ✓; full test suite green except the 5 goldens above; aiGrounding + analytics
  bundle freshness ✓; size-ratchet ✓; **EXCEPT** the first-paint budget — see the OWNER-GATED
  item at the end of this doc.

---

## Fix 1 — `domain-top-state-2` (law_order alias) — verdict PARTIAL (binding correction applied)
- **Files:** `src/domain/worldPulse/stressorsCore.js` (drop the `law_order` alias from
  CAUSAL_SYSTEM_ALIASES; succession_void co-declares `criminal_opportunity`; stale comment
  corrected), `src/domain/crisisLifecycle.js` (byte-identical mirror STRESSOR_SYSTEM_ALIASES
  dropped in lockstep), `src/domain/causalState.js` (deriveLawOrder scan comment corrected —
  the seam is now live), `tests/domain/stressorCounterforces.test.js` (pin updated).
- **Fixtures/fields that move:** any settlement carrying a **resolved succession_void residual**
  condition — its `affectedSystems` gains `law_order` (previously the alias remapped it to
  `criminal_opportunity`), and `criminal_opportunity` is retained via the co-declaration, so
  `deriveLawOrder`'s condition scan now fires for lawless-interregnum settlements.
- **Justification:** `law_order` became the 16th real SYSTEM_VARIABLE; the stale alias was
  diverting the one stressor that declares it away from the purpose-built variable, while the
  binding correction required keeping `criminal_opportunity` (an existing variable) intact — so
  the stressor co-declares both rather than a clean alias deletion.
- **Fold-back:** the committed generation/projection goldens are **fresh** worlds (no
  tick-resolved residuals), so this fix contributes NO shift to them; the only fixture that
  moves is the counterforces pin. **Byte-identical for the committed goldens** → the pin update
  is the whole footprint. (Live-world worlds that resolve a succession_void will shift at
  soak/tick time — that is the intended semantic, but no committed golden exercises it.)

## Fix 2 — `domain-top-state-1` (condition drift write-back) — verdict CONFIRMED
- **Files:** `src/domain/activeConditions.js` (preserve raw status when input status invalid),
  `tests/domain/activeConditions.test.js` (two-tick pins).
- **Fixtures/fields that move:** ONLY a condition reaching `withTickedConditionDurations` with a
  **missing / legacy / invalid** status AND a directional template default — its written-back
  `status` stays raw instead of being canonicalized to the template default, so severity holds
  flat from tick 2 instead of inventing +0.04/tick motion.
- **Justification:** the drift's own no-invented-motion invariant was defeated by the return
  writing `canonical.status`; the fix writes `VALID_STATUSES.has(c.status) ? canonical.status :
  c.status`, keeping normally-created (already-directional) conditions byte-identical.
- **Fold-back:** normally-generated conditions always carry a canonical status, so this is
  **byte-identical for every fresh-generation golden**. Confirmed by reproduce-then-clear (the
  buggy code fails the new two-tick pin; the fix passes). The defect population is legacy saves /
  raw-partial ingested conditions, which no committed golden contains. **FOLD-BACK.**

## Fix 3 — `spatial-engine-1` (banditry reads route danger) — verdict CONFIRMED
- **Files:** `src/domain/spatial/embattlement.js` (new `routeDangerLevel` helper — per-hop mean
  of the ScoredRoute sum, origin excluded), `src/domain/spatial/supplyShipments.js` (ARRIVE
  branch recomputes the chosen route and reads its danger), `src/domain/spatial/commodityFlow.js`
  (arrival reads the already-scored `route`), `tests/domain/supplyShipments.test.js` (pin
  rewritten to the new semantics).
- **Fixtures/fields that move:** realized banditry (delivered fraction) at BOTH arrival sites now
  reads the **chosen route's per-hop danger** (traversed hops, origin excluded) instead of the
  origin's embattlement — an embattled producer on a calm road delivers in full; a war-zone
  intermediary / besieged destination nicks the load.
- **Justification:** route CHOICE already prices embattled ground via the route-danger model;
  the realized loss was keying on the single node routing deliberately excludes — the two danger
  models contradicted; now they agree.
- **Fold-back:** banditry fires only at spatial **tick** time on embattled routes; fresh
  generation goldens run no spatial tick, so this is **byte-identical for the committed goldens**
  → the pin rewrite is the whole footprint. (Lit spatial worlds shift at soak time.) **FOLD-BACK.**

## Fix 4 — `data-tables-5` (coal_deposits commodities) — verdict CONFIRMED
- **Files:** `src/data/resourceData.js` (`commodities: ["timber"]` → `["coal"]`).
- **Fixtures/fields that move:** any settlement with `coal_deposits` — its `localProduction`
  loses the stray `timber` token and gains `coal` (→ fuel category); a coal city without a
  carpenter/sawmill now correctly reads as needing timber imports (the suppression was wrong).
- **Justification:** the taxonomy chip fixed classification but commodity-level consumers still
  saw every coal settlement as a timber producer; `coal` was the intended token (the dead
  COMMODITY_CATEGORY_MAP `coal` row); `peat` stays live via marshlands, so `coal` keeps coal
  deposits distinct.
- **Fold-back:** GENUINE SHIFT for any golden config carrying `coal_deposits` — moves
  `generatorGoldenMaster` (localProduction/imports), and downstream `beliefMap` /
  `worldpulseDeity` / `pdf` where those configs surface. Classification pin re-verified (stays
  nonrenewable). Not a fold-back.

## Fix 5 — `data-tables-2` (terrain double-stack regression) — verdict CONFIRMED
- **Files:** `src/data/geographyData.js` (forest 2nd Sawmill row re-pointed to the distinct live
  `Woodcutter's camp`; mountain + hills redundant `Stone quarry` rows dropped),
  `tests/data/terrainInstitutionModifiersReachable.test.js` (added the ≤1-match walker).
- **Fixtures/fields that move:** institution selection odds in forest / mountain / hills — the
  `Sawmill` / `Sawmill (commercial)` and `Stone quarry` institutions no longer absorb the product
  of two modifier rows; `Woodcutter's camp` gains the forest-management boost; the generation
  trace's `resourceMult` reads the corrected single value.
- **Justification:** the G2 round-1 revival renamed dead rows onto substrings of siblings,
  double-boosting one institution 2.7–7.5× (capped at 5); the fix restores one boost per
  institution and revives the forestry-management flavor on a real, previously-unboosted
  institution.
- **Fold-back:** GENUINE SHIFT for forest/mountain/hills golden configs (selection odds) → moves
  `generatorGoldenMaster` + downstream. Pinned by the new upper-bound walker. Not a fold-back.

## Fix 6 — `generators-domain-1` (second-wave stress couplings) — verdict PARTIAL (binding correction applied)
- **Files:** `src/generators/foodGenerator.js` + `src/generators/economy/foodBalance.js` (food
  production/consumption multipliers for wartime / slave_revolt / mass_migration),
  `src/generators/economy/prosperity.js` (slave_revolt prosperity-index row),
  `tests/data/stressTypeRegistration.test.js` (source-scan pins) + new
  `tests/generators/secondWaveStressFoodProsperity.test.js` (behavioral pins).
- **Fixtures/fields that move:** a settlement under `wartime` / `slave_revolt` loses food
  production; under `mass_migration` gains food need; under `slave_revolt` drops one prosperity
  tier. **Defense scores deliberately UNCHANGED** — the binding correction established they are
  already coupled to all five second-wave types via the priorityHelpers effective-score
  multipliers, so an inline penalty would double-count.
- **Justification:** the five second-wave types had partial numeric integration; the real gap was
  food (all five ignored) and slave_revolt's missing prosperity row, not defense (already
  coupled). Food scoping (wartime/slave_revolt/mass_migration) follows each type's viabilityNote.
- **Fold-back:** GENUINE SHIFT for any golden config carrying one of those three stresses → moves
  `generatorGoldenMaster` + downstream. Not a fold-back. (JUDGMENT: insurgency / religious_conversion
  were NOT given food couplings — their prose implies no food impact; recorded below.)

## Fix 7 — `domain-top-state-4` (NPC rank vocabulary) — verdict CONFIRMED
- **Files:** `src/domain/npcProfile.js` (new exported `normalizeNpcRank`: maps the generator's
  `subordinate` → the palette's `secondary`, String()-coerces, collapses unknown/numeric to
  `minor`; used at the profile-surface and removal-consequence seams),
  `tests/domain/npcProfile.test.js` (vocabulary ratchet pins).
- **Fixtures/fields that move:** every non-dominant, non-minor NPC — `profile.rank`,
  `consequenceIfRemoved.severity`, and `.consequences` change from the dead-fallback `minor`
  palette to the now-live `secondary` palette; a legacy numeric `structuralRank` no longer
  crashes `.toLowerCase()`.
- **Justification:** the generator vocabulary (`dominant`/`subordinate`) and the NpcRank palette
  (`dominant`/`secondary`/`minor`) had no translation, so the middle tier was dead; translated in
  one seam (the generator's `subordinate` vocab is woven into npcStructure's template keys, so the
  fix lives at the consumption seam, not the generator).
- **Fold-back:** GENUINE SHIFT for any golden config that stamps a subordinate NPC → moves
  `generatorGoldenMaster` + the aiGrounding/causalState-fed `beliefMap`/`worldpulseDeity`/`pdf`
  projections. Not a fold-back.

## Item 9 — D6 THE UNDERWAYS (catalog + generation half) — golden-shifting
- **Files:** `src/data/institutionalCatalog.js` (village/town/city `Underground network` entries;
  metropolis inherits city via mergeCatalogs), `src/generators/steps/assembleInstitutions.js`
  (new `forbiddenResources` gate — the flood suppression), `src/data/institutionServices.js`
  (service menu), `src/data/geographyData.js` (mountain + hills excavation-affinity rows),
  `src/domain/display/institutionVocabulary.js` (identity one-liner),
  `src/data/stressInstitutionEffects.js` (insurgency + slave_revolt tunnel secrets), new
  `tests/data/underwaysInstitutionParity.test.js` (the full-parity pin).
- **What moves & who gains it (roll-dependent):** the institution is a village+ Criminal catalog
  entry (baseChance 0.08 village / 0.15 town / 0.22 city), loaded ×1.6 in mountain and ×1.3 in
  hills (excavation affinity), and **suppressed to impossible** where `marshlands` /
  `fertile_floodplain` are nearby (tunnels flood). Worlds gain it by roll; a mountain/hills
  criminal town is the most likely holder.
- **Distribution delta on institution counts:** every generated roster's RNG stream shifts (the
  catalog iteration now makes one more `rng.chance()` call per settlement in the Criminal group),
  so same-seed rosters reshuffle even where the underways does NOT roll — this is the dominant
  cause of the `institutionIdentity` / `generatorGoldenMaster` reds (e.g. the golden town's
  `Gambling den` → `Traveling performers` swap is a pure reshuffle).
- **Zero-impact proof for non-reaching worlds:** a world whose Criminal group is disabled, or
  whose tier is < village, never iterates the entry — but the catalog-iteration RNG draw still
  occurs for any settlement with a Criminal group, so "zero impact" holds only for settlements
  with NO Criminal category enabled (those reshuffle nothing). The facet law's absent-declaration
  path is byte-identical: `facetOf` on any non-facet institution returns `null` (pinned).
- **Facets:** declared `facets: { clandestine: 'clandestine', subterranean: 'subterranean' }` on
  the entry; `facetOf(inst,'clandestine')` / `facetOf(inst,'subterranean')` resolve to those
  values (pinned), and a CUSTOM clandestine institution counts identically (facet-law parity).
  This is the seam W-R2-DEPTH's engine couplings read; **id `underground_network`** (kernel-
  slugified from the name, collision-checked at module load).

---

## CANDIDATE — owner-gated, RECORD ONLY (item 8, NOT implemented)
- **`data-tables` slave-trade export enable** — DATA's finding proposes flipping the enslaved-
  persons trade-good export spec to `on: true`. This is a **paid-surface / product-scope**
  change (it enables a trade-good export path around slavery), squarely owner-gated. It is
  carried on the G2 candidate list for the owner batch and is **not implemented on this branch**.
  Disposition: await the owner's ruling at the regen moment.

## JUDGMENT calls (vetoable — say the word and I flip any of them)
1. **D6 naming register → "Underground network".** The design's working name was "Underways"
   (substitution to "Smugglers' warren" invited); the id is required to be `underground_network`.
   The catalog derives the id by kernel-slugifying the NAME (no explicit-id field exists), so the
   only name that yields `underground_network` without a schema change is "Underground network" —
   which also fits the descriptive register ("Smuggling network"/"Front businesses"). The
   evocative "underways" flavor lives in the desc + the (lazy) identity one-liner. Alternative:
   add an explicit per-entry `id` field (schema change, rejected as out of scope).
2. **D6 facet declaration contract.** `facets: { clandestine: 'clandestine', subterranean:
   'subterranean' }` — the design's exact words used as self-documenting facet KINDS (not
   `institutionNature`), so W-R2-DEPTH can derive the reader contract (`facetOf(inst,'clandestine')
   === 'clandestine'`) from the design doc alone, and there is zero collision with the existing
   `institutionNature`/`institutionFunction` consumers.
3. **Fix 5 asymmetry (re-point vs drop).** Forest's redundant row was RE-POINTED to a distinct live
   institution (`Woodcutter's camp`); mountain/hills' redundant `Stone quarry` rows were DROPPED.
   The verdict preferred re-pointing to "Stonemason", but no such catalog institution exists (it
   would recreate a dead row and break the reachability ratchet), and there is no distinct live
   stone-craft institution — so the redundant rows were merged to one. Forest had a genuine
   distinct target; mountain/hills did not.
4. **Fix 6 food scoping.** Food couplings added for wartime / slave_revolt / mass_migration only
   (their viabilityNotes imply food impact); insurgency / religious_conversion were NOT given food
   couplings (prose implies none). Defense penalties deliberately NOT added inline (would
   double-count the existing multiplier coupling) — recorded as a positive pin in the walker.
5. **D6 NPC office.** The office-equivalence resolver already resolves `Underground network` to
   `[Master, Steward, Hand]` — identical to its peers `Underground city` / `Smuggling operation`.
   A bespoke "tunnel-warden" label would require extending the name classifier + INSTITUTION_ROLES,
   which changes ALL criminal institutions (outside the catalog-half fence); the generic senior
   office is the parity-complete resolution.

## Deferrals (documented, not dropped)
- **D6 history founding mention** ("dug during the siege…"): DEFERRED. It belongs in
  `historyGenerator.js`'s resourceEvents pool, but that file sits **exactly at its frozen
  size-ratchet ceiling** (`scripts/.size-baseline.json` = 883 effective lines); any code line
  trips `sizeBaseline.test.js`, and the wave protocol forbids raising the baseline while
  decomposing the file is outside the catalog-half fence. A comment-only seam note marks the spot.
  Lands when `historyGenerator.js` is decomposed. All other D6 parity elements shipped.

## ⚠️ OWNER-GATED — the first-paint budget (constitutional law 5)
The D6 catalog half is a **first-class first-paint catalog institution**, so its data
(3 tier entries + facets + `forbiddenResources` + service menu, all in the eager `data`
chunk) adds eager bytes that **exceed the ~85 B first-paint margin** — after aggressive
minimization (descs + service descs trimmed to sibling brevity; the flavor moved to the LAZY
identity one-liner; the fixes' CODE is all in the lazy engine/worker, not first-paint), the
residual is:

- **first-paint static closure = 1,123,215 B vs budget 1,121,903 B → +1,312 B.**

This is the irreducible cost of a first-class catalog institution across village/town/city; it
cannot be reclaimed within the catalog-half fence. Per the protocol I **did NOT raise the
budget** (`vendorPdfLazy.test.js` CLOSURE_BUDGET_BYTES is unchanged) — this is exactly the
"STOP if over" case. It needs an **owner decision at the regen moment**: an FP-G reclaim (the
established pattern — cf. the base's own "FP-G8 reclaim for the 39 B cumulative overflow") that
offsets the +1,312 B, OR an owner-authorized budget raise for the deliberate D6 feature. The
`tests/build/vendorPdfLazy.test.js` first-paint budget test is therefore **RED on this branch**,
alongside the 5 predicted golden reds — a documented, minimized, owner-gated exception.
