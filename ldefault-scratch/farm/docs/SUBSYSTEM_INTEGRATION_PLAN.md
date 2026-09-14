# Subsystem Integration Plan — Geopolitical War Layer (A/B/C) + Religion (D)

> Master integration plan unifying the War/Deployment (A), Trade War (B), Agency &
> Disposition (C), and Religion/Pantheon (D) subsystems onto one shared substrate.
> Source of truth for build order, data-shape versioning, determinism guards, gap
> closure, surfacing, and open decisions. Supersedes the per-workstream drafts.
>
> Companion spec: `docs/GEOPOLITICAL_WAR_LAYER.md`. This document is the *plan*; the
> spec is the *design rationale*. Where they disagree, this document wins (it has
> been reconciled against source; the spec carries known drifts called out below).

---

## 1. Executive Summary & Guiding Architecture

We are adding a Geopolitical War Layer (Features A/B/C) and a Religion subsystem
(Feature D) to the campaign world pulse. All four ride **one shared substrate**, built
**once**, rather than four parallel mechanisms. The user's standing priorities —
**maintainability, futureproofing, cohesion, immersion, UX, balance** — mean we build
the durable version: shared primitives, declarative registries, a versioned worldState,
and determinism guards established *before* any mechanic lands.

### The five load-bearing architectural pillars

1. **Shared contest substrate (`contestOverThirdParty`).** War, trade, and religion are
   the *same* archetype — "two aggressors contest a third party over a channel" — with
   different scoring functions. We build ONE pure primitive (generalizing the only
   working contest in the repo, `rulingPower.js` `coupContenders`/`resolveCoupVerdict`)
   and inject a `scoreFor(contender)` per feature. **It is built exactly once** (the
   Foundation track owns it); war/trade/religion are thin callers. *Three draft plans
   each declared a NEW `contestOverThirdParty.js` with three incompatible fork-key
   recipes — this plan collapses them to one owner and one fork-key recipe.*

2. **Unified disposition ledger.** Feature C's per-settlement aggressiveness scalar and
   Feature D's pantheon are both ratcheted win/loss ledgers ("dispositionStats-shaped").
   We build ONE ledger shape + ratchet helper, instantiated twice. The warlike-deity
   term folds *into* the single Feature-C aggressiveness scalar — **one model, never a
   parallel multiplier**. The scalar modulates all relationship dynamics at the single
   `candidateBase` chokepoint (`relationshipEvolution.js:369`), **signed by candidate
   intent** (boost escalation, damp de-escalation) so an aggressive settlement does not
   also sue for peace harder.

3. **Dormant-until-enabled gate.** Religion is OFF for a campaign until ≥1 settlement
   carries `config.primaryDeitySnapshot`. The activation flag is **DERIVED** (never
   stored), read off the post-time snapshot, and every Feature-D code path early-returns
   when false. Zero-deity / legacy campaigns must be **byte-identical** to today. We
   build this as a reusable named-registry pattern so future premium subsystems inherit
   the no-write / no-rng-when-inactive contract for free.

4. **worldState versioning + deep-clone discipline.** `worldState` gains new ledger keys
   (`dispositionStats`, `deployments`, `pantheon`). `ensureWorldState`'s `cloneObject` is
   **shallow** — nested ledgers would share references across the single pre-tick
   snapshot, breaking immutability — so nested ledgers route through `deepClone`
   (`src/domain/clone.js`). `worldState` today force-stamps `schemaVersion` with no
   migration dispatch; we add a real (initially no-op) `runWorldStateMigrations` chain
   modeled on `settlementMigrations.js`, the only hole-checked chain in the repo.

5. **Declarative registries + a CI consistency invariant.** New mechanics are added by
   inserting frozen entries into parallel maps keyed by a type string
   (`CONDITION_ARCHETYPE_TEMPLATES`, channel-mint bundles, the stressor catalog). Four
   downstream string registries (`populationDynamics` war sets, `flows` sets,
   `GEN_TO_PULSE` map, the condition catalog) drift silently today. We add ONE
   re-export surface and a CI invariant test so a referenced archetype that is absent
   from the catalog (or vice versa) is a build failure, not a silent no-op.

### Verified drift corrections baked into this plan (do NOT inherit the spec's claims)

- **`evaluateNpcRules` is a deterministic argmax** (`npcAgency.js:807`, `.sort()[0]`), NOT
  a softmax. No `weightedPick`/softmax exists in `src/domain` (only `src/generators/prng.js`).
  The strategy chooser's softmax sampler is **net-new code**, and because the contest
  primitive lives in `src/domain/region/` it **cannot import generators** (three-layer
  law) — it takes an injected `rng` and ships its own sampler.
- **Mint-starvation is narrower than the spec says.** `war_front` IS minted (hostile,
  `graph.js:496`, symmetric) and `military_protection` IS minted (vassal/patron/allied,
  472/480/485). **Only `religious_authority` is genuinely unminted.** The real net-new
  war mint is an **act-grade DIRECTED** `war_front` for a non-adjacent coalition siege
  (no edge exists between besieger and a distant third party to mint from).
- **The economic_capacity homeostasis loop is a DEAD SINK.** Verified: zero
  `activeConditions` archetypes list `economic_capacity`, so `deriveEconomicCapacity`'s
  condition loop (`causalState.js:432`) never fires today. `war_drain` is the missing
  SOURCE; the downstream chain (economy pressure, `settlementStrength`) is Phase-0 wired.
- **`deriveReligiousAuthority` is shallow.** It reads only faction power and has NO
  condition-scan loop; `regional_religious_pressure.affectedSystems` lacks
  `religious_authority`. Both must be fixed or Feature D never registers on the substrate.
- **Corruption onset gate is at `npcAgency.js:521`** (`hasCriminalInst`), NOT
  `corruption.js:521` (spec file-drift). Exposure already bypasses it.
- **`transferRulingPower(cause:'conquest')` is fully plumbed but NEVER fired** — the only
  emitter is `coup.js` (always `'coup'`). A won siege is the missing first caller.
- **Gallery import PRESERVES `settlement.config`** (`campaignSlice.js:455` scrubs only
  `_seed`; the `config:null` at :458 is the separate save-ROW column). So a
  config-stored `primaryDeityRef` **survives import** — the draft's "config nulled ⇒
  dormant-on-import" precondition is FALSE. This plan strips the deity ref explicitly.
- **`simulationRules` preset churn:** a new flag added to `BOOLEAN_KEYS` enters
  `RULE_COMPARISON_KEYS`; the frozen presets don't carry it, so `rulesMatchPreset`
  returns false for every preset and `presetId` silently collapses to `'custom'`. New
  flags MUST be added to all three presets.
- **Dormancy oracle is structural deep-equal (absent ≡ `{}`), not `JSON.stringify`.**
  Adding `dispositionStats:{}` to the default makes a legacy keyless save serialize
  differently under `JSON.stringify`. We define the oracle as a normalized deep-equal so
  additive empty ledgers are byte-neutral; `pantheon` is *additionally* materialized
  conditionally (only when activated) because it is the larger churn risk.

---

## 2. Unified Build Sequence

One totally-ordered sequence interleaving Foundation (F), War (A/B), Disposition (C),
Religion (R), and Surfacing (S) phases by **true dependency**, not by workstream. The
Foundation track (F0–F5) is the **sole owner** of every shared artifact; war/religion
phases consume it.

| Phase | Workstream | Goal | Key files | Green gate |
|---|---|---|---|---|
| **P0** | Baseline (DONE) | `economic_capacity` is the 15th SYSTEM_VARIABLE; economy term in `settlementStrength` + `pressureModel`. SINK half of the homeostasis loop wired. | `causalState.js` (deriveEconomicCapacity:414), `pressureModel.js`, `relationshipEvolution.js:479` | Already committed (uncommitted in tree); fixtures green. |
| **F0** | Foundation | Determinism oracle + dormancy + cross-registry invariant harness, established BEFORE any mechanic, defining the structural deep-equal oracle. | NEW `tests/domain/religionDormancy.byteIdentity.test.js`, `tests/domain/archetypeRegistryConsistency.test.js`, `tests/domain/worldStateLedger.persistence.test.js`, `tests/domain/simulationRulesPreset.stability.test.js` | All new tests pass against UNMODIFIED code; full suite green. |
| **F1** | Foundation | worldState versioning + deep-clone nested ledgers + additive empty ledgers (byte-neutral under the oracle). | `worldState.js` (createDefaultWorldState:48, ensureWorldState:76), import `clone.js` | Order-independence + golden-master + dormancy green, ZERO fixture churn. |
| **F2** | Foundation | Reusable derived dormant-until-enabled activation gate. | NEW `worldPulse/subsystemActivation.js` | Gate consumes no rng / writes no worldState when inactive; dormancy green. |
| **F3** | Foundation | The ONE `contestOverThirdParty` primitive + shared contest math + the net-new softmax sampler (rng injected). | NEW `region/contestOverThirdParty.js`, `region/contestMath.js` | Order-independent (reversed + tied contenders); single-incumbent no-op; anti-oscillation soak; pure (no Date.now/Math.random). |
| **F4** | Foundation | The ONE disposition ledger + ratchet helper + signed `candidateBase` multiplier (default exactly 1.0). | NEW `worldPulse/dispositionLedger.js`, `relationshipEvolution.js:369`, `candidateEvents.js:201`, `advanceCampaignWorld.js` | Legacy ⇒ exactly 1.0 (byte-identical); read-last/write-next pinned by MULTI-settlement fixture; signed direction test. |
| **F5** | Foundation | Declarative archetype catalog: `war_drain`/`army_deployed`/`occupation_lifted`/`relief_burden` + directed-channel mint helper + religious_authority mint (deity-gated). | `activeConditions.js:49`, `conditionPromotion.js`, NEW `worldPulse/archetypeCatalog.js`, `region/graph.js` (mintDirectedChannel) | Registry invariant green; `deriveEconomicCapacity` moves when `war_drain` present; dormancy green (religious mint inert with no deity). |
| **A1** | War (A) | Feature A core: one-army deployment record, coalition directed war_front mint, war_drain re-upsert (homeostasis), contextual troop-return, conquest emitter. Gated behind `warLayerEnabled` (default false). | NEW `worldPulse/warDeployment.js`, `worldPulse/deploymentReturn.js`, `advanceCampaignWorld.js:221/349`, `applyWorldPulse.js:221/421`, `graph.js`, `simulationRules.js` | OFF ⇒ byte-identical; ON ⇒ coalition-siege order-independence + mutual-siege convergence (numeric) + conquest fires; generator golden-master UNTOUCHED. |
| **A2** | War (B) | Feature B per-commodity trade war: `supplyCompleteness` derivation, logistic contest, incumbent + vassal hard-bias, wind-down vs conquest escalation. Shares `warLayerEnabled`. | NEW `worldPulse/supplyCompleteness.js`, `worldPulse/tradeWar.js`, `stressorDynamics.js` (windDown), `candidateEvents.js`, `advanceCampaignWorld.js` | OFF byte-identical; per-commodity order-independence; anti-oscillation soak (cooldown); vassal bias hard; escalation reachable. |
| **C1** | Disposition (C) | Feature C war/trade scoreFor + ratchet wiring on top of F4 (authored personality + government baseline + dispositionStats). | NEW `worldPulse/disposition.js` (scoreFor only; ledger is F4), `advanceCampaignWorld.js`, `applyWorldPulse.js:421` | Aggressive ⇒ >1.0 / pacifist ⇒ <1.0 / no data ⇒ 1.0; ratchet order-independent; attribution via relationshipRoles (H16). |
| **C2** | Disposition (C) | Strategy chooser (softmax generalization of `evaluateNpcRules`) with HARD-OVERRIDE return-home + exclusive-tag de-conflict. Gated behind `settlementStrategyEnabled`. | NEW `worldPulse/settlementStrategy.js`, `candidateEvents.js:109/201`, `simulationRules.js` | OFF byte-identical; softmax order-independent; hard-override always recalls + suppresses reactive candidate (no double-fire); no budget-starve. |
| **R1** | Religion (D) | Deity authoring bucket end-to-end + SET_PRIMARY_DEITY embed bridge + deriveReligiousAuthority deepening. NO pulse behavior yet. | `customContentSchema.js`, `customContentSlice.js`, `customContent.js`, `customRegistry.js`, NEW `supabase/migrations/049_custom_content_deities.sql`, `CustomContent.jsx`, `mutate.js:58/1249`, `events/registry.js`, `settlementSlice.js:1448`, `campaignSlice.js:449`, `causalState.js:539`, `activeConditions.js:276`, `SettlementDetail.jsx` | build:edge-shared committed; deity authoring round-trips local+cloud; deriveReligiousAuthority moves with a deity; dormancy byte-identity green; import lands DORMANT (ref stripped). |
| **R2** | Religion (D) | Deity-vs-deity contest (consumes F3) + conversion spread on the newly-minted religious_authority channel (consumes F5 mint) + re-embed on win. Gated `religionDynamicsEnabled` + activation. | NEW `worldPulse/religiousContest.js`, `candidateEvents.js:183`, `graph.js` (religious mint wiring), `stressorGates.js:428`, `applyWorldPulse.js`, `stressors.js:969` (spread sort) | Dormancy green WITH religion code present; deity-contest order-independence; channel mints only under deity-presence; conversion re-embeds winner. |
| **R3** | Religion (D) | good/evil ⇒ corruption knobs (relax onset gate, OQ18); warlike ⇒ the SINGLE Feature-C aggressiveness term (OQ22). | NEW `domain/npcData.js` (TRAIT_ALIGNMENT), `corruption.js:105/119/252`, `npcAgency.js:521`, `relationshipEvolution.js` (deityTemper term in F4 scalar) | OQ18 onset fires in crime-free town with evil deity; no-death-spiral soak; OQ22 no double-count; dormancy green. |
| **R4** | Religion (D) | Pantheon ledger (conditional materialization) + lazy major/minor/cult tier with hysteresis + containment; realm arcs. LAST, behind convergence tests. | `worldState.js` (conditional pantheon), NEW `worldPulse/pantheon.js`, `applyWorldPulse.js:421`, `realmEvents.js`, `wizardNews.js` | Pantheon absent when dormant; lazy-tier hysteresis (no 1-seat flip); cascade-containment soak; full-stack dormancy byte-identity. |
| **S1** | Surfacing | Dual-stressor-vocab parity fix (PDF + screen war banner) via ONE shared alias helper. | NEW `domain/display/warStatusVocab.js`, `pdf/lib/viewModel.js:644`, `new/tabs/DefenseTab.jsx:79`, `stressorPicker.js` | Pulse-born siege lights BOTH banners; generation-born sieges unchanged (no fixture churn). |
| **S2** | Surfacing | 15-var causal movement folded into 4-dim drivers/risks (low churn). | `domain/display/dossierViewModel.js`, `pdf/sections/SystemStateSnapshot.jsx`, `settlement/SystemStateBar.jsx` | war_drain/religious shifts appear as named drivers; no-condition fixtures byte-identical. |
| **S3** | Surfacing | Live war/siege/trade-war/disposition status; coalition + commodity story; map overlays (visibility-respecting). | `map/WorldPulseData.js:161`, `map/WorldPulsePanel.jsx`, `new/SummaryTab.jsx`, `map/RelationshipEdges.jsx`, `chronicle.js:60` | Coalition/commodity named; SummaryTab reads LIVE state; overlays honor channel.visibility; inert (not crash) when mints absent. |
| **S4** | Surfacing | Pantheon panel epic + chronicle/news story + realm-arc promotion (count instigators) + gallery realm-arc summary. | NEW `map/PantheonPanel.jsx`, `WorldMap.jsx`, `WorldMapToolbar.jsx`, `realmEvents.js:163`, `wizardNews.js`, `ShareToGallery.jsx`, `gallery/GalleryDetail.jsx` | Pantheon tab hidden when dormant; 4-vs-1 coalition promotes to "The War"; public realm-arc summary survives sanitizer; gallery viewer shows static war/pantheon state. |
| **Z1** | Cross-cutting | Population/food/occupation-parity cohesion fixes (converted from deferred OQs — see §6). | `populationDynamics.js:40/46`, `foodStockpile.js:271`, conquest occupation-richness in `applyWorldPulse.js` | Occupied/drained towns lose population; deployed army drains home granary (single effectiveDeficit path); pulse-conquered town matches generation occupation. |
| **Z2** | Cross-cutting | Edge-bundle freshness + pglite/migration execution coverage + full determinism battery. | `supabase/functions/_shared/aiGroundingBundle.js`, NEW `tests/security/customContentDeities.pglite.test.js` | aiGrounding bundle fresh; deities CHECK + premium RLS pinned; ENTIRE battery green = ship checkpoint. |

**Dependency notes:** F0→F1→F2→F3→F4→F5 is the foundation spine. A1 depends on F1/F3/F4/F5. A2 depends on A1 (reuses conquest emitter). C1 depends on F4. C2 depends on C1. R1 depends on F0/F1/F5. R2 depends on R1/F2/F3/F5. R3 depends on R2 + F4. R4 depends on R2/R3 + F1. S1 depends on none (can run early but listed after mechanics for fixture coherence). S2 depends on F5. S3 depends on A1/A2/R2. S4 depends on R4. Z1 depends on A1/R2. Z2 is the final gate.

---

## 3. Per-Phase Detail

### F0 — Determinism oracle + dormancy + registry invariant harness
- **Files:** four NEW test files (no production change).
- **Data shape:** none. F0 PINS the current shape as the baseline.
- **The oracle (load-bearing decision):** `religionDormancy.byteIdentity.test.js` uses a
  **structural normalized deep-equal** that treats an absent key as `{}`/`[]`/default —
  NOT raw `JSON.stringify`. This is what lets F1 add additive empty ledgers without
  churn. Document the oracle inline; every later "byte-identical" gate references it.
- **Determinism guards:** `archetypeRegistryConsistency.test.js` asserts every archetype
  string referenced by `populationDynamics` war sets, `flows` sets, and `GEN_TO_PULSE`
  resolves to a catalog entry (and flags dead catalog entries). `simulationRulesPreset.stability.test.js`
  asserts a hypothetical new default-false flag round-trips and keeps each named preset's
  `presetId` stable (guards the `RULE_COMPARISON_KEYS` churn trap).
- **Gate:** all four pass against unmodified `master`.
- **Closes:** the headline dormant-byte-identity guarantee is currently UNGUARDED; the
  four-registry drift trap; the preset-churn trap.

### F1 — worldState versioning + deep-clone ledgers
- **Files:** `worldState.js` (add `dispositionStats:{}`, `deployments:{}` to
  `createDefaultWorldState`; explicit `deepClone` coercion lines in `ensureWorldState`;
  add a no-op `runWorldStateMigrations(raw)` chain called before the spread). Import
  `deepClone` from `clone.js`.
- **Data shape / versioning:** `dispositionStats` and `deployments` exist as empty `{}`
  on a fresh world. Under the F0 oracle a legacy keyless save normalizes equal to `{}`
  for both = byte-neutral. **`pantheon` is NOT added here** (conditional, R4).
  `WORLD_STATE_SCHEMA_VERSION` stays 1 (additive); the migration chain exists for the
  first future *breaking* shape.
- **Determinism guards:** `cloneObject` is shallow — the two new ledgers MUST be
  `deepClone`d or the pre-tick snapshot aliases live state across ticks. Test mutates the
  returned ledger and asserts the input is untouched (non-aliasing).
- **Gate:** order-independence + golden-master + dormancy green; zero fixture churn.
- **Closes:** shallow-clone latent aliasing bug; absent worldState migration machinery.

### F2 — Reusable activation gate
- **Files:** NEW `subsystemActivation.js` exporting `isSubsystemActive(snapshot, predicate)`
  + a `SUBSYSTEM_GATES` registry (`religionActive: snapshot => snapshot.settlements.some(s => s.settlement?.config?.primaryDeitySnapshot)`).
- **Determinism guards:** gate reads **postTimeSnapshot** (#3, built at
  `advanceCampaignWorld.js:349`, post embed-on-assign), is read-only, consumes no rng.
- **Gate:** test proves zero-write / zero-rng when inactive; dormancy green.
- **Closes:** scattered-inline-dormancy-check anti-pattern; futureproofs premium gating.

### F3 — `contestOverThirdParty` + contest math (THE shared primitive)
- **Files:** NEW `region/contestMath.js` (`logistic`, `softmaxWeights`,
  `stableSampleByWeight`, `sortedContenderTieBreak` via a `hash01` copy) and NEW
  `region/contestOverThirdParty.js`.
- **Signature (frozen here, all consumers obey):**
  `contestOverThirdParty({ prizeId, channelType, contenders:[{id, scoreFor}], incumbentId, rng, tick })`.
- **Determinism guards (critical):**
  - Score = `logistic(weighted log-odds sum)`, **never raw product** (saturates to 0).
  - Incumbent advantage via the coup `amplifiedWeight` idiom — **but raise the upset
    floor**: do NOT inherit `resolveCoupVerdict`'s 0.1 per-resolution upset floor for a
    per-tick/per-commodity contest (too hot; see §6 balance). Add hysteresis/cooldown.
  - **Sort contenders by (descending weight, then codepoint id) BEFORE the cumulative-
    weight winner walk** — the walk is order-dependent; never iterate a Map/Object/Set
    directly. Tie-break with `hash01(codepoint-sorted contender set + ':' + channelType +
    ':' + prizeId + ':' + tick)`.
  - Fork key recipe (frozen): `contest:<channelType>:<prizeId>:<tick>`. This is THE recipe;
    the three draft variants are discarded.
  - `rng` is INJECTED (no `createPRNG`, no `generators` import — three-layer law).
  - <2 contenders ⇒ default-neutral no-op (single-incumbent field byte-identical).
- **Gate:** reversed-contender AND equal-weight-tie order-independence; single-incumbent
  no-op; anti-oscillation soak; pure.
- **Closes:** `contestOverThirdParty` does not exist (the biggest unbuilt piece); the
  net-new softmax sampler; the divergent-fork-key risk.

### F4 — Disposition ledger + signed candidateBase multiplier
- **Files:** NEW `dispositionLedger.js` (`createLedgerEntry`, `readDisposition` →
  centered-on-1.0 multiplier, returns **exactly 1.0** when absent; `ratchetDisposition`
  → idempotent accumulate). Edit `candidateBase` (`relationshipEvolution.js:369`) to
  multiply severity/probability by a **per-candidate-intent-signed** factor from
  `ctx.dispositionFactor`. Thread the factor map through `candidateEvents.js:201` and
  compute it in `advanceCampaignWorld.js` after postTimeSnapshot (349), before candidate
  gen (372). Ratchet-write post-apply (after 421).
- **Data shape:** `candidateBase` candidates gain a `direction` tag (escalation /
  de-escalation) so the multiplier can be signed. `dispositionStats` populated once a
  contest resolves.
- **Determinism guards:** **READ last-tick ledger at candidate-build (~372); WRITE
  next-tick post-apply (~421)** — mirrors `refreshRelationshipMemory`'s once-post-outcome
  stamp (`applyWorldPulse.js:734`). Never read a half-updated ledger mid-tick. Default
  1.0 keeps legacy byte-identical. Attribution via `relationshipRoles` (H16), not edge
  from/to, so a reversed-authored save credits the same winner.
- **Gate:** legacy ⇒ exactly 1.0; **MULTI-settlement** fixture proves win@N appears at
  N+1 not N (single-settlement fixtures do NOT exercise the cross-settlement ratchet);
  signed-direction test (boost raid, damp truce in the same tick).
- **Closes:** disposition multiplier doesn't exist; ledger read/write timing unspecified
  in spec; the blind-multiply de-escalation hazard.

### F5 — Declarative archetype catalog + directed mints
- **Files:** `activeConditions.js` (add frozen `war_drain` → `['economic_capacity']`,
  `army_deployed` → `['defense_readiness']`, `occupation_lifted` (+polarity clone of
  `siege_lifted`), `relief_burden` (reuse `alliance_burden` shape); add
  `'religious_authority'` to `regional_religious_pressure.affectedSystems`).
  `conditionPromotion.js` (promotion rules). NEW `archetypeCatalog.js` (single re-export
  surface). `region/graph.js` (`mintDirectedChannel` helper — the ONE directed mint home
  for both act-grade war_front and deity-gated religious_authority).
- **Determinism guards:** `war_drain` MUST NOT also join `TRADE_ARCHETYPES` (economy
  pressure already absorbs `economic_capacity` at 50% — double-count). religious_authority
  mint is **deity-presence-gated** so legacy edge channel-count is unchanged.
- **Gate:** registry invariant green; `deriveEconomicCapacity` provably moves with a
  `war_drain` condition; dormancy green.
- **Closes:** the dead `economic_capacity` SINK gets its SOURCE; the genuine
  religious_authority mint gap; the directed-coalition-siege mint gap; consolidates the
  three draft directed-mint helpers into one.

### A1 — Feature A core (war/deployment)
- **Files:** NEW `warDeployment.js` (one-army-per-home guard on
  `worldState.deployments`, emits deployment record + directed war_front mint + siege-
  onset queuedImpact), `deploymentReturn.js` (clone of `coupVerdictOutcomes`, forked
  `'deployment-return'`, contextual occupied→liberation / sieged→relief /
  vassal→coup-by-legitimacy, generic-residual suppression). `advanceCampaignWorld.js`
  (insert return resolver ~221; insert evaluator reading postTimeSnapshot ~349/372; emit
  conquest powerTransfer on won siege). `applyWorldPulse.js` (apply directed mint;
  re-upsert war_drain). `simulationRules.js` (`warLayerEnabled` default false — add to
  DEFAULT + BOOLEAN_KEYS **and all three presets**).
- **Data shape:** `worldState.deployments` populated; directed war_front channels minted;
  war_drain/army_deployed conditions stamped; `outcome.powerTransfer{cause:'conquest'}`
  emitted (first ever).
- **Determinism guards:** deployment ids deterministic (home+target+tick+channel);
  timers ride `queuedImpacts` delayTicks (queue-this-tick / mature-next via
  `advanceRegionalImpacts` at `applyWorldPulse.js:504`); **war_drain severity is derived
  from the PRE-TICK postTimeSnapshot channel count, NOT this-tick's freshly-minted
  channels** (the deploy mint affects war_drain only next tick — avoids intra-tick
  read-after-write); army-as-record (no echo); one-army existence guard.
- **Test gates:** OFF byte-identical; 2-attacker coalition order-independence (anti-vacuity:
  war_front actually minted); **numeric** mutual-siege convergence (war_drain lowers
  econ_cap enough to flip the confidence gate AND a single aggressor can still deploy);
  conquest fires + is liberatable; generator golden-master UNTOUCHED (proves war is
  pulse-only).
- **Closes:** aggressor has no condition (war_drain/army_deployed); deployed-army modeling
  ambiguity (record + reversible conditions, not catalog stressor); directed mint;
  conquest never fires; no-echo carve-out.

### A2 — Feature B (trade war)
- **Files:** NEW `supplyCompleteness.js` (0..1 from chain status + `trade_dependency`
  channel strength), `tradeWar.js` (codepoint-sorted commodities; `contestOverThirdParty`
  per third party with logistic `supplyCompleteness × economicStrength × diplomaticStanding`;
  incumbent + vassal hard-bias; emits probability-1 partner-flip candidate).
  `stressorDynamics.js` (`windDownSponsoredStressors` for defeated wind-down).
  `candidateEvents.js`, `advanceCampaignWorld.js` (escalation reuses A1 conquest emitter).
- **Determinism guards:** contest forked per F3 recipe; vassal hard-bias deterministic
  (no rng when forced); supplyCompleteness reads pre-tick snapshot; probability-1 bypasses
  the roll; **vassal forced commitment routes through the vassal's trade/economy pressure**
  so `vassalStrain` rises and `vassal_rebellion` stays reachable (escape valve verified at
  `relationshipEvolution.js:1404` — vassal is NOT a one-way ruin trap).
- **Test gates:** OFF byte-identical; per-commodity order-independence; **anti-oscillation
  soak with a flip cooldown** (raised upset floor + hysteresis); vassal escape test
  (sustained forced commitment eventually trips rebellion); escalation/wind-down reachable.
- **Closes:** `supplyCompleteness` doesn't exist; per-commodity contest; trade-war griefing
  oscillation; vassal-ruin trap (mitigated, not a trap).

### C1 — Feature C scoreFor + ratchet wiring
- **Files:** NEW `disposition.js` (the war/trade `scoreFor` + factor computation reading
  AUTHORED `npc.personality` importance-weighted + government baseline + last-tick
  `dispositionStats`; the LEDGER itself is F4). `advanceCampaignWorld.js`,
  `applyWorldPulse.js:421` (ratchet from resolved outcomes).
- **Determinism guards:** reads AUTHORED `npc.personality` (surfaced via the snapshot's
  `settlement.npcs`), NEVER RNG `npcStates.alignment` (`npcAgency.js:445`); never mutates
  frozen personality. The pulse has no existing personality read-path — confirm it reaches
  `candidateBase` via the snapshot.
- **Test gates:** aggressive ⇒ >1.0, pacifist ⇒ <1.0, no data ⇒ 1.0; ratchet
  order-independent; attribution via relationshipRoles.
- **Closes:** authored-personality read path; the win/loss history ledger.

### C2 — Strategy chooser (softmax)
- **Files:** NEW `settlementStrategy.js` (per-SETTLEMENT loop modeled on
  `evaluateNpcRules`; HARD-OVERRIDE return-home early-return BEFORE sampling; else
  enumerate codepoint-sorted moves → score utility (with the C1/F4 scalar) → softmax via
  the F3/contestMath sampler forked `strategy:<id>:<tick>` → emit ONE probability-1
  candidate). `candidateEvents.js` (add a `strategy:<settlement>` and war/deity contest
  pattern to the `exclusiveTags` allowlist at :109; gate at :201). `simulationRules.js`
  (`settlementStrategyEnabled` default false — add to all three presets).
- **Determinism guards:** runs **once per settlement** (not per-edge — avoids N-edge
  double-fire / `maxPerSettlement` budget-starve); probability-1 bypasses the identity
  pass-roll (no double-randomize); softmax fork on `strategy:<id>:<tick>`; codepoint-sort
  moves before `weightedPick`. **`relationship:<key>` is NOT in `exclusiveTags` today
  (verified `candidateEvents.js:109-119`)** — the new exclusive tag is what makes the
  hard-override actually suppress the reactive edge candidate.
- **Test gates:** OFF byte-identical; softmax order-independent; hard-override always
  recalls and suppresses the reactive candidate (exactly one applied outcome); no
  budget-starve.
- **Closes:** softmax is net-new (not a refactor of argmax); double-fire hazard;
  budget-starve hazard; HARD-OVERRIDE return-home.

### R1 — Deity authoring + embed bridge + substrate deepening (no pulse)
- **Files:** `customContentSchema.js` (frozen `DEITY_ALIGNMENT`/`DEITY_TEMPER`/`DEITY_TIER`
  under the existing `religious` group). `customContentSlice.js` (+`deities:[]` to EMPTY),
  `customContent.js` (+`deities` to EMPTY_CONTENT; also fix the drifted
  services/factions/supplyChains), `customRegistry.js` (register `deities`, prebuilt `[]`).
  NEW `049_custom_content_deities.sql` (guarded `ALTER` of `custom_content_category_check`
  to add `deities` + the three drifted categories; premium write RLS from 017 inherited).
  `CustomContent.jsx` (gods bucket + 3 axis fields). `mutate.js` (SET_PRIMARY_DEITY case +
  handler modeled on `addResource:1249`, **commits an already-resolved snapshot from
  payload** — mutate.js is pure, cannot read customContent). `events/registry.js` (impact
  spec + RERUN_KEYS). `settlementSlice.js:1448` (store action RESOLVES ref→snapshot via
  `customRegistry` and dispatches BEFORE the canon-queue branch at :1457). `campaignSlice.js`
  importGallerySettlement (**strip `config.primaryDeityRef` AND `primaryDeitySnapshot`
  from the settlement spread** — see correction below). `causalState.js:539` (add the
  condition-scan loop + tier-scaled deity term to `deriveReligiousAuthority`, keep
  `if(magnitude===0) continue`). `activeConditions.js:276` (add `religious_authority`).
  `SettlementDetail.jsx` (Assign-Primary-Deity picker, gated by `canUseCustomContent()`).
- **Data shape / versioning:** `customContent.deities[]` across the four lockstep lists
  (slice EMPTY, service EMPTY_CONTENT, SQL CHECK, registry). `settlement.config.primaryDeityRef`
  (`custom:<localUid>`) + `settlement.config.primaryDeitySnapshot` (frozen resolved
  `{name,alignment,temper,tier,_deityRef}`). Additive-optional — absence IS the legacy
  default; no settlement migration.
- **CORRECTION (verified):** gallery import PRESERVES `settlement.config` (`campaignSlice.js:455`).
  An imported deity would therefore be ACTIVE, contradicting dormant-on-import. **Fix:**
  explicitly delete `primaryDeityRef` and `primaryDeitySnapshot` in the import settlement
  spread so an imported settlement lands DORMANT and cannot resurrect a foreign pantheon.
- **Determinism guards:** the snapshot is captured ONCE at assign-time, frozen-by-
  convention, with **NO wall-clock field read by any pulse deriver** (drop or exclude
  `_embeddedAt` from `deriveReligiousAuthority`/contest scoreFor). Resolve+embed in the
  STORE layer at intent-time, never at canon-drain inside the pulse. Verify the embed
  survives `advanceTime` (snapshot #3). `deriveReligiousAuthority` is a transitive
  `aiGrounding` dep ⇒ run `npm run build:edge-shared` + re-commit.
- **Test gates:** authoring round-trips local+cloud; deriveReligiousAuthority moves with a
  deity, byte-identical without; SET_PRIMARY_DEITY embeds at intent-time and survives the
  canon queue; import lands DORMANT (ref stripped, snapshot stripped — no foreign ledger);
  gallery-privacy contract green; dormancy byte-identity green.
- **Closes:** no deity UI; three-way bucket drift + DB CHECK hard-reject; embed-resolution
  boundary (store-layer resolve); shallow `deriveReligiousAuthority` + missing
  `religious_authority` affectedSystem; gallery import-dormancy correctness.

### R2 — Deity contest + conversion spread + religious_authority mint wiring
- **Files:** NEW `religiousContest.js` (thin caller of F3; `scoreFor` = alignment-direction
  + warlike-posture + incumbency + tier; `conflictTag = deity:<settlementId>`). Wire the
  deity-gated `religious_authority` mint (F5 `mintDirectedChannel`) on allied/trade/vassal/
  occupation edges. `candidateEvents.js:183` (`if (rules.religionDynamicsEnabled && activated)`).
  `stressorGates.js:428` (deity-contest term on `religiousConversionGate`; the 1.6×-on-
  occupation BIRTH gate already at :436). `applyWorldPulse.js` (re-embed winning snapshot;
  seed `religious_conversion_fracture`). `stressors.js:969` (**codepoint-sort spread
  targets by a meaningful key — lowest religious_authority / highest plurality, codepoint
  id as tiebreak — before `.slice(0,3)`** so conversions flow to the weakest orthodoxies,
  deterministic AND legible).
- **Data shape:** `religious_authority` channels minted only under deity-presence;
  `config.primaryDeitySnapshot` can be OVERWRITTEN by a contest win (OQ20 stored-but-
  contestable). No new worldState key (pantheon is R4).
- **Determinism guards:** activation gate (F2) skips contest + mint when no deity (legacy
  byte-identical, channel-count unchanged); F3 fork recipe; re-embed is self-contained.
  **Same-tick multi-spread:** `applyWorldPulse.js:680` `byId.set` OVERWRITES (not merge);
  choose **commutative field-merge** (union affectedSettlementIds, `max()` severities) so
  apply order cannot change the result — pinned by an order-independence test.
  `religionDynamicsEnabled` defaults TRUE but the activation gate is the real guard;
  confirm a default-true flag with zero deities is byte-identical (it is — the gate
  short-circuits before any fork). Fix the conversion fracture's bogus `faction_stability`
  affectedSystem (not a real SYSTEM_VARIABLE).
- **Test gates:** dormancy green WITH religion code present; deity-contest order-independence;
  deity-edge mints a channel, no-deity edge mints none; conversion re-embeds winner.
- **Closes:** religious_authority mint-starvation; conversion spread no-op; same-tick
  multi-spread loss; conversion legibility (weakest-orthodoxy targeting).

### R3 — good/evil corruption + warlike aggressiveness
- **Files:** NEW `npcData.js` (frozen `TRAIT_ALIGNMENT` over AUTHORED `npc.personality`).
  `corruption.js` (`readCorruptionClimate:252` adds `hasCorruptingDeity`; optional
  `deityDisfavor` multiplier arg on `onsetHazard:105`/`exposureChance:119`, applied AFTER
  the existing sum, re-clamped, never mutating frozen TUNING). `npcAgency.js:521`
  (`onsetEnabled = hasCriminalInst || hasCorruptingDeity`). `relationshipEvolution.js`
  (deityTemper term ADDED to the F4 aggressiveness weighted sum — NO new multiplier).
- **Determinism guards:** no-deity ⇒ `hasCorruptingDeity` false, `deityDisfavor` 1.0,
  deityTemper 0 ⇒ onset gate + candidateBase unchanged ⇒ byte-identical. Onset rng forks
  `corr:<id>:<tick>` — an additive-after-sum term changes the threshold, not stream
  position. Reads AUTHORED personality (frozen), never RNG alignment. ONE bounded
  centered-on-1.0 multiplier — no stacking onset+exposure+demotion.
- **Test gates:** OQ18 evil deity in crime-free town fires onset (no-deity crime-free town
  zero onset); good deity raises exposure/demotion; no-death-spiral soak (respects
  corruption's equilibrium damping); OQ22 warlike modulates candidateBase ONCE (no
  double-count with govBaseline/personality); dormancy green.
- **NOTE:** `factionCapture.js:50` has a PARALLEL `hasCriminalInst` gate not relaxed here.
  If an evil deity should also enable faction capture in a crime-free town, that gate
  needs the same term (see §7 open decision); otherwise the evil-deity effect is half-applied.
- **Closes:** OQ18 onset hard-gate; OQ22 warlike-into-one-model.

### R4 — Pantheon ledger + lazy tiering (LAST, behind convergence tests)
- **Files:** `worldState.js` (materialize `pantheon` CONDITIONALLY — write the key
  deep-cloned ONLY when activated; absent otherwise so legacy round-trips identically).
  NEW `pantheon.js` (`deriveTierLazily` from `seatsControlled` with HYSTERESIS + a per-
  tick net-seat containment cap; aggregate from PRE-TICK snapshot only). `applyWorldPulse.js:421`
  (ratchet pantheon post-apply, read-last/write-next). `realmEvents.js` ("The Ascendancy/
  Twilight of X"). `wizardNews.js` (significance with hysteresis).
- **Data shape / versioning:** `pantheon` (dispositionStats-shaped, nested `seatsControlled`)
  materialized only when ≥1 deity assigned. Tier is a LAZY VIEW of `seatsControlled`, never
  source of truth.
- **Determinism guards (THE danger zone — religion is more connective than war):** tier
  derived LAZILY (no global per-tick rebalance); `seatsControlled` aggregated from
  postTimeSnapshot (#3) in **codepoint-sorted save-id order**; equal-seat tier ties broken
  by codepoint deity ref, never `Object.keys()` order; hysteresis state ratcheted
  read-last/write-next; conditional materialization (no pantheon key when dormant); nested
  ledger deep-cloned.
- **Test gates:** dormancy byte-identity WITH religion code present (no pantheon key);
  lazy-tier hysteresis (1-seat swing does NOT flip tier); cascade-containment soak (one
  cult cannot exceed a seat cap in M ticks, no tick-to-tick oscillation); deity-contest +
  pantheon-ratchet order-independence (insertion-order-reversed identical tiers);
  full-stack dormancy.
- **Closes:** OQ21 lazy tiering; pantheon ledger; cascade/oscillation containment.

### S1 — Dual-vocab parity (PDF + screen)
- **Files:** NEW `warStatusVocab.js` (reverse `PULSE_TO_GEN` alias inverting the existing
  `GEN_TO_PULSE_TYPE` at `stressorPicker.js:31` — single source — plus `resolveMilitaryStress`).
  `pdf/lib/viewModel.js:644` and `new/tabs/DefenseTab.jsx:79` both import it.
- **Determinism guards:** pure display, codepoint-stable, no worldState write.
- **Gate:** pulse-born siege lights BOTH banners; generation-born sieges resolve
  identically (assert no fixture churn).
- **Closes:** the dual-stressor-vocab break (symmetric-by-construction).

### S2 — 15-var movement via drivers/risks fold
- **Files:** `dossierViewModel.js` (condition-derived driver strings: `war_drain` →
  externalThreat/resourcePressure driver; `religious_authority` shift → volatility driver).
  `SystemStateSnapshot.jsx` / `SystemStateBar.jsx` already render `dim.drivers`/`dim.risks`.
- **Determinism guards:** strings appear only when the matching condition is present ⇒
  legacy/no-condition byte-identical. Author the strings to read as CAUSE, not jargon.
- **Gate:** war/religion as named drivers in PDF + screen; no-condition fixtures unchanged.
- **Closes:** the PDF 4-dimension parity break (low-churn fold, not a new chapter).

### S3 — Live war/trade/disposition status + map overlays
- **Files:** `WorldPulseData.js:161` (WAR_SHAPED_TYPES += religious_conversion_fracture /
  war_drain / army_deployed; `attackerEntity` reads `originContext.{primaryInstigatorId,
  supporterIds,contestedThirdPartyId,commodity}` resolved via pre-tick `nameById`).
  `WorldPulsePanel.jsx`, `SummaryTab.jsx` (Faith & War block reading LIVE worldState/
  embedded snapshot — a NEW data path; frozen generation fields go stale post-pulse),
  `RelationshipEdges.jsx` (war_front red front-line + religious_authority purple overlay,
  **respecting `channel.visibility`** — religious_authority is GM-default), `chronicle.js:60`
  (thread coalition + commodity).
- **Data shape:** `originContext` gains `supporterIds`/`contestedThirdPartyId`/`commodity`
  — defaulted in `normalizeStressor` so legacy renders blank, not crash.
- **Determinism guards:** name resolution from pre-tick snapshot only; coalition sets
  codepoint-sorted stable arrays; overlays inert (not crash) when mints absent.
- **Gate:** coalition/commodity named; SummaryTab reads live; overlays honor visibility;
  anti-vacuity (fixture carries a coalition).
- **Closes:** chronicle can't name coalition/commodity; SummaryTab staleness; the doc's
  false "religious_authority already purple" claim (it's net-new).

### S4 — Pantheon panel + realm-arc story + gallery coherence
- **Files:** NEW `PantheonPanel.jsx` (4th campaign workspace; hidden when the DERIVED
  activation flag is false). `WorldMap.jsx` / `WorldMapToolbar.jsx` (workspace + tab).
  `realmEvents.js:163` (**count the instigator+supporter union** — codepoint-sorted — so a
  4-vs-1 coalition promotes to "The War"). `wizardNews.js` (significance with hysteresis;
  three distinct contextual-troop-return templates). `ShareToGallery.jsx` /
  `GalleryDetail.jsx` (**a public-safe realm-arc SUMMARY field** — the raw `chronicle` key
  is stripped by both sanitizers; a sanitized digest carries the narrative).
- **Determinism guards:** pantheon tier lazy; activation derived; realmEvents count change
  moves coalition golden-master fixtures (re-pin intentionally).
- **Gate:** pantheon hidden when dormant; coalition promotes to realm arc; public realm-arc
  summary survives sanitization; gallery viewer shows static war/pantheon state.
- **Closes:** coalition never promotes (counts victims); contextual-return has no template;
  war/pantheon narrative mute on shared campaigns; pantheon panel doesn't exist.

### Z1 — Population / food / occupation-parity cohesion (converted from deferred OQs)
- **Files:** `populationDynamics.js:40/46` (add `'occupation'`,`'war_drain'` to
  WAR_CRISIS_ARCHETYPES + CRISIS_FLIGHT_ARCHETYPES so occupied/drained towns lose
  population via the existing flight path). `foodStockpile.js:271` (a settlement with an
  active outbound deployment carries a standing import-share cut routed through the SAME
  `effectiveDeficit` the blockade uses — never a parallel counter; honor magic-transit
  bypass; don't double-cut an already-occupied origin). `applyWorldPulse.js` conquest path
  (reproduce generation-time occupation richness: faction-power ×0.3 disarm + institution
  suppression — so a pulse-conquered town matches a generation-occupied one).
- **Determinism guards:** all additive condition/archetype-driven; registry invariant
  catches the new set members; food drain reads pre-tick snapshot.
- **Gate:** occupied/drained towns lose population; deployed army drains home granary
  (single path); pulse-conquered ≈ generation-occupied.
- **Closes:** population blind to occupation; army-eats-home-stockpile; gen/pulse
  occupation parity (the three biggest cohesion holes the drafts deferred).

### Z2 — Edge-bundle freshness + execution coverage + final battery
- **Files:** `aiGroundingBundle.js` (+`.meta.json`) rebuilt if any war/religion helper
  entered `aiGrounding`'s transitive graph (prefer keeping them OUT). NEW
  `customContentDeities.pglite.test.js` (deities insert under premium vs non-premium, or
  a static net-current migration scan if 049 is pure DDL).
- **Gate:** aiGrounding bundle fresh; deities CHECK + premium RLS pinned; ENTIRE
  determinism + security battery green across a clean build = ship checkpoint.
- **Closes:** edge-bundle split-brain; missing RPC/CHECK execution coverage.

---

## 4. Consolidated Gap-Closure Table

| Gap (known + newly found) | Closed by | Durable fix |
|---|---|---|
| `contestOverThirdParty` does not exist | F3 | One pure primitive, injected rng, frozen fork-key recipe; war/trade/religion are thin callers. |
| `economic_capacity` homeostasis loop is a DEAD SINK (no archetype lists it) | F5 + A1 | `war_drain` → `['economic_capacity']` archetype is the missing SOURCE; re-upsert from live front count. |
| `war_drain` calibration near-inert (<1% strength move/front) | A1 | Numeric convergence test asserts the gate flips; raise gearing + non-reverting war-exhaustion scar (see §6). |
| Disposition multiplier doesn't exist; ledger timing unspecified | F4 | One ledger; signed-by-intent multiplier; read-last/write-next pinned by multi-settlement test. |
| Blind multiply scales de-escalation wrong | F4 | Per-candidate `direction` tag; signed-direction test. |
| Softmax/`weightedPick` absent in `src/domain`; `evaluateNpcRules` is argmax | F3 + C2 | Net-new sampler in `contestMath`; strategy chooser written fresh, not a refactor. |
| `relationship:<key>` not in `exclusiveTags` ⇒ strategy double-fire | C2 | New exclusive tag pattern; one-applied-outcome test. |
| Budget-starve (guaranteed candidate still consumes `maxPerSettlement`) | C2 | Strategy runs once per settlement, not per edge. |
| Conquest never fires (`cause:'conquest'` has no emitter) | A1 (+A2) | Won siege / trade-war escalation emit `powerTransfer{cause:'conquest'}`. |
| `supplyCompleteness(X,K)` is not a number | A2 | New 0..1 derivation from chain status + `trade_dependency` channel. |
| Trade-war oscillation / griefing | A2 + F3 | Raised upset floor + incumbent advantage + flip cooldown; anti-oscillation soak. |
| Vassal forced into ruin | A2 | Route forced commitment through vassal economy pressure ⇒ `vassal_rebellion` escape valve stays reachable. |
| `religious_authority` genuinely mint-starved | F5 + R2 | Deity-gated `mintDirectedChannel` on allied/trade/vassal/occupation edges. |
| `deriveReligiousAuthority` shallow; missing affectedSystem | R1 | Condition-scan loop + tier-scaled deity term; add `religious_authority` to `regional_religious_pressure`. |
| OQ18 corruption onset hard-gate blocks evil deity | R3 | `onsetEnabled = hasCriminalInst \|\| hasCorruptingDeity`, additive, 0 when no deity. |
| OQ22 warlike as parallel multiplier (double-count) | R3 | warlike folds into the single F4 aggressiveness scalar. |
| OQ20 assigned vs contestable deity | R2 | DM assignment = incumbent seed; contest win re-embeds the winner. |
| OQ21 pantheon tier global rebalance | R4 | Lazy tier from seatsControlled + hysteresis + containment, pre-tick aggregation. |
| Pantheon-key fixture churn for legacy | F0 + F1 + R4 | Conditional materialization; structural deep-equal oracle. |
| Shallow `cloneObject` aliases nested ledgers | F1 | `deepClone` for `dispositionStats`/`deployments`/`pantheon`. |
| No worldState migration machinery | F1 | No-op `runWorldStateMigrations` chain for the first future breaking shape. |
| `simulationRules` preset churn on new flag | F0 + each flag phase | New flags added to all three presets; preset-stability test. |
| Four unsynchronized archetype string registries | F0 + F5 | `archetypeCatalog.js` re-export + CI consistency invariant. |
| Dual-stressor-vocab parity break (PDF + screen) | S1 | One shared `warStatusVocab` alias imported by both sites. |
| PDF 4-dimension parity break | S2 | War/religion folded into existing drivers/risks (no new chapter). |
| Coalition never promotes to "The War" (counts victims) | S4 | Count instigator+supporter union. |
| Chronicle can't name coalition/commodity/deity | S3 | Thread `originContext` fields; chronicle grounding. |
| War/pantheon narrative stripped from gallery | S4 | Public-safe realm-arc summary field (not the raw chronicle key). |
| SummaryTab stale after pulse | S3 | New live-data path from worldState/embedded snapshot. |
| Same-tick multi-seat conversion spread loss | R2 | Commutative field-merge in the upsert. |
| Conversion spread legibility (arbitrary targets) | R2 | Sort spread targets by weakest-orthodoxy, codepoint tiebreak. |
| Gallery import "dormant-on-import" precondition FALSE (config preserved) | R1 | Explicitly strip `primaryDeityRef` + `primaryDeitySnapshot` in the import spread. |
| Embed wall-clock leak risk | R1 | Store-layer intent-time resolve; no wall-clock field read by any deriver. |
| Population blind to occupation; no army-eats-home; gen/pulse occupation mismatch | Z1 | Add occupation/war_drain to population sets; deployment drain via `effectiveDeficit`; reproduce occupation richness on conquest. |
| `factionCapture.js:50` parallel criminal gate not relaxed | §7 open decision | Decide whether evil deity also enables faction capture; else effect is half-applied. |
| `aiGrounding` lacks structured war/deity section | §7 open decision + Z2 | Decide chronicle-prose-sufficient vs structured payload; rebuild Deno bundle either way. |
| Magic legality deaf to deity | §7 open decision | Deferred but committed as an explicit follow-up, not a vague recommendation. |
| Treasury / `tax_revenue` dead | Scope cut (pinned) | No treasury added; tribute stays as `vassal_tribute_extraction` channel drain; no future mechanic may assume a currency quantity. |
| No army NPC carrier; `loyalty` field never read | §7 open decision | Decide v1 magnitude-only army (coup by legitimacy) vs commander NPC + faction (coup reads loyalty). |

---

## 5. Determinism & Persistence Invariants

The campaign world pulse is deterministic by contract. Every new mechanic honors:

1. **Single seed, string-keyed forks.** Master rng seeded once
   (`advanceCampaignWorld.js:163`). New subsystems fork with stable string keys
   (`contest:<channelType>:<prizeId>:<tick>`, `strategy:<id>:<tick>`,
   `deployment-return`, `corr:<id>:<tick>`). Never `createPRNG` anew, never reuse another
   subsystem's key. Forks are lazy/string-keyed — an un-entered (dormant) path advances
   no rng.

2. **Single immutable pre-tick snapshot, read #3.** The snapshot is rebuilt 3× (165/204/349).
   All contests, the strategy chooser, the disposition scalar, the religion activation
   gate, and the pantheon aggregation read **postTimeSnapshot (#3)** — the same generation
   the relationship rules read. Reading #1/#2 is a staleness bug.

3. **Deep-clone nested ledgers.** `cloneObject` is shallow; `dispositionStats`,
   `deployments`, `pantheon` route through `deepClone` so the snapshot never aliases live
   state. The post-apply ratchet writes a fresh deep-cloned ledger.

4. **Ledger read/write tick split.** READ last-tick ledger at candidate-build (~372);
   WRITE next-tick post-apply (~421). Never read a half-updated ledger mid-tick. **Only a
   MULTI-settlement order-independence fixture exercises this** — single-settlement
   fixtures pass vacuously. Win/loss attribution via `relationshipRoles` (H16).

5. **war_drain read-source.** Derived from the pre-tick channel count; the deploy mint's
   effect on `war_front` count influences war_drain only NEXT tick (queuedImpacts/delayTicks).

6. **Codepoint sorts everywhere a tie is broken.** Contender winner-walk, spread targets,
   pantheon seat aggregation, coalition instigator sets — all codepoint, never locale,
   never Map/Object iteration order.

7. **Probability-1 = guaranteed, no double-randomize.** Strategy/contest candidates emit
   at probability 1 so `rollCandidates` (`candidateEvents.js:259`) treats them as
   guaranteed — the softmax sample is the ONLY randomization.

8. **Same-tick multi-spread is commutative.** `byId.set` overwrites; the field-merge
   (union ids, max severities) must be order-independent.

9. **Timers ride `queuedImpacts` + delayTicks.** Deterministic ids (record/edge id + tick
   + channel), dedupe-by-id, mature next tick at `applyWorldPulse.js:504`.

10. **Embed is wall-clock-free in the pulse.** The deity snapshot is captured at store
    intent-time; no field of it is read by any deriver/contest as a numeric/random value.

**Persistence invariants:**

- **Dormancy oracle = structural deep-equal (absent ≡ default), not `JSON.stringify`.**
  Additive empty `dispositionStats:{}`/`deployments:{}` are byte-neutral under it.
  `pantheon` is *additionally* conditional (only materialized when activated).
- **`ensureWorldState` whitelist.** New keys MUST be in both `createDefaultWorldState`
  and the explicit coercion, or they are silently dropped — except `pantheon`, which is
  conditional.
- **New `simulationRules` flags** added to DEFAULT + BOOLEAN_KEYS **and all three named
  presets** (else `presetId` collapses to `'custom'` via `RULE_COMPARISON_KEYS`).
- **Gallery import strips the deity ref + snapshot** (config is preserved by import, so
  the strip must be explicit). Activation derives from the snapshot, never a persisted
  worldState field (un-spoofable by an imported ledger).
- **`049` migration is MANDATORY** — the `004` CHECK hard-rejects a `deities` insert; the
  `017` premium write RLS is inherited.
- **aiGrounding Deno bundle** rebuilt (`npm run build:edge-shared`) whenever `causalState`
  or any transitive dep changes.

---

## 6. Surfacing, Immersion & Balance

### Player-facing story
- **The War.** Coalition sieges promote to a realm arc by counting instigators+supporters
  (S4). The chronicle names *who* besieges whom and *what* commodity is contested (S3).
  The contextual troop-return — army comes home to a sieged/occupied/vassal town — gets
  **three distinct templates** (liberation / relief / coup-by-legitimacy), the most
  cinematic beat (S4).
- **The Schism / The Twilight of X / The Ascendancy of X.** Pantheon tier transitions and
  primary-deity flips graduate to realm news with hysteresis so routine conversions don't
  bury the signal (S4). Conversions flow visibly to the weakest orthodoxies (R2).
- **Legibility.** War/religion movement appears in the causal trace as named drivers
  ("War economy drain", "religious authority shift") on both PDF and screen (S2), authored
  to read as cause, not jargon. Map overlays paint war fronts red and faith-spread purple,
  honoring channel visibility (S3).
- **Gallery.** A public-safe realm-arc summary carries the narrative to shared campaigns
  (the raw chronicle is sanitizer-stripped); the viewer sees static resulting state (S4).

### Balance knobs (and the headline risk)
- **HOMEOSTASIS UNDER-DAMPING (critical).** Traced in source: a single `war_drain` front
  moves `settlementStrength` by **<1%** (severity×18 → economic_capacity, blended ×0.5
  into economy pressure, weighted ×0.12 into strength), while relationships mean-revert
  12%/tick. **As geared today the realm will NOT seek peace from war_drain alone.** A1's
  convergence test must assert **numeric** strength deltas crossing the confidence gate,
  and we must (a) raise the gearing (war_drain severity-per-front and/or the strength
  economy weight) and (b) add a **non-mean-reverting war-exhaustion scar** (long maxAge)
  so a defeated aggressor cannot snap back to full in ~9 ticks. Pin BOTH ends: a single
  confident aggressor can still deploy; an N-front war converges to peace.
- **Contest upset floor.** Do NOT inherit the coup's 0.1 per-resolution upset floor for a
  per-tick/per-commodity contest (too hot — ~10% thrash). Raise incumbent advantage + add
  a flip cooldown; gate on an anti-oscillation soak.
- **Religion cascade containment.** Religion is more connective than war. Lazy tier +
  hysteresis + per-tick net-seat cap + news hysteresis; the cascade-containment soak gates
  R4 (one cult cannot eat the map; tier doesn't oscillate on a 1-seat swing).
- **Signed disposition.** Aggressive boosts raids AND damps truces — required by a
  dedicated test, or it regresses to incoherent "aggressive but also peace-seeking".
- **Double-count guard.** `war_drain` stays OUT of `TRADE_ARCHETYPES` (economy pressure
  already absorbs economic_capacity at 50%).

---

## 7. Open Decisions (with recommendations)

- **OQ18 — corruption onset gate.** Relax onset to `hasCriminalInst || hasCorruptingDeity`
  so an evil deity corrupts the faithful in a crime-free town. **Recommend: YES** (R3),
  mirroring the existing exposure-bypass; additive and exactly 0 when no deity.
  *Sub-decision:* `factionCapture.js:50` has a PARALLEL `hasCriminalInst` gate. **Recommend:
  also relax it** with the same `hasCorruptingDeity` term so the evil-deity effect isn't
  half-applied (NPCs corrupt but factions can't be captured).
- **OQ20 — assigned vs contestable deity.** **Recommend: stored-but-contestable** — DM
  assignment is the incumbent seed; a contest win re-embeds the winner (R2). Pure-derived
  loses the DM's founding-faith intent; immutable loses conversion.
- **OQ21 — pantheon tiering.** **Recommend: lazy from `seatsControlled` + hysteresis +
  containment**, aggregated from the pre-tick snapshot (R4). A global per-tick rebalance is
  the determinism danger zone.
- **OQ22 — warlike deity.** **Recommend: ONE new term in the single Feature-C
  aggressiveness scalar** (R3), never a parallel multiplier.
- **NEW — `warLayerEnabled` / `settlementStrategyEnabled` default.** Ship default FALSE for
  byte-identical fixtures. **Recommend:** flip to true for NEW campaigns only after the
  convergence + soak suites are green; existing presets stay false until reviewed.
- **NEW — homeostasis gearing.** The ×18→×0.5→×0.12 chain is near-inert. **Recommend:**
  raise gearing + add a non-reverting war-exhaustion scar, pinned by a numeric convergence
  band. This is balance-blocking (perpetual war otherwise).
- **NEW — army carrier.** v1 magnitude-only army (coup decided by legitimacy) vs commander
  NPC + runtime military faction (coup reads `npc.loyalty`, currently write-only).
  **Recommend: defer the carrier to a follow-on** (A1's economic war_drain already curbs
  the worst war-spam) BUT document that the return-home coup uses legitimacy, not loyalty,
  so the deferral is explicit.
- **NEW — gallery war narrative.** Raw `chronicle` is sanitizer-stripped. **Recommend:**
  add a public-safe realm-arc SUMMARY field (S4), not un-stripping chronicle.
- **NEW — AI grounding war/deity section.** The edge function reads the structured payload,
  not the chronicle prose. **Recommend:** decide explicitly — start with chronicle prose
  (cheapest), add a structured war/pantheon grounding section only if narration quality
  demands it; rebuild the Deno bundle in the same change either way.
- **NEW — magic legality vs deity.** A dominant orthodox/warlike major deity should shift
  magic legality/`religiousAcceptance`. **Recommend: an explicit committed follow-up phase
  (post-R4)**, not a vague "R4+" note — pure immersion, no determinism risk, but it must
  not silently never ship.
- **NEW — same-tick multi-spread.** Field-merge (faith spreads fast, graph-correct now) vs
  next-tick re-spread (one-seat-per-tick pacing). **Recommend: commutative field-merge**
  (union ids, max severities) so apply order can't change the result; pin with an
  order-independence test.

---

*First build step: F0 — write the four foundation test files
(`religionDormancy.byteIdentity.test.js`, `archetypeRegistryConsistency.test.js`,
`worldStateLedger.persistence.test.js`, `simulationRulesPreset.stability.test.js`) and
confirm they pass against unmodified `master`, defining the structural deep-equal dormancy
oracle inline. This is the regression tripwire every later phase is measured against.*
