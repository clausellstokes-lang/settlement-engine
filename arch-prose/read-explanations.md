# READ — THE ENGINE'S EXPLANATIONS AND CAUSAL EDGES

**Lens:** what typed explanations the engine holds per settlement, which are persisted vs
computed at render, which causal edges connect the facts the composers read, and which of the
owner's walls-example facts exist as fields today.

**Read at** `$B = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneB6`
(product tip `3b1c0eaa5`, confirmed by `git log --oneline -1` in that dock). Every path below is
relative to `$B`. Instruments at `$SC/skepINSTR` were not needed for this lens.

**Executed probes** (written under `$SC/arch-prose/`, read-only, output quoted in §7):
`_probe-arity.mjs`, `_probe-slots.mjs`, `_probe-edges.mjs`, `_probe-causal.mjs`, `_probe-def.mjs`.

---

## 1. THE HEADLINE, IN ONE PARAGRAPH

The engine already holds a **typed explanation layer** — twelve per-entity explainers behind one
dispatcher (`src/domain/explanation.js:1131`), a persisted generation trace log, a 16-variable
causal substrate whose every score carries a signed contributor list, a 46-archetype condition
catalog whose entries declare which system variables they press, and a closed 14-class **cause
vocabulary** with resolution predicates (`src/domain/worldPulse/causeVocabulary.js:45`). It also
already ships **one complete instance of the composed-prose model the owner is describing**: the
compromise-conjunction ladder (`src/domain/display/causeConjunctionContent.js`), which resolves a
four-dimension key `{role × situation × causeClass × lifecycleStage}` down a
**full → role → class → floor** specificity ladder to one seeded line, and is live on the dossier
NPC card. That is the prebuilt map the owner asked whether the files already hold.

The gap is the **seam**: not one of the eight dossier state-prose composers imports
`explanation.js`, `causalState.js`, `trace.js`, or `corruption.js`. The composers read *state*
(bands, flags, presence) and never read *why*. The one authored corpus that speaks in causal joins
— the causal register, 78 families × 6 variants = 468 sentences — has **zero importers anywhere in
`src/`**, so every one of those sentences is unreached in the shipped product.

---

## 2. THE TYPED EXPLANATIONS THE ENGINE HOLDS

### 2.1 The unified envelope — `src/domain/explanation.js`

One shape, twelve producers. `ExplanationEnvelope` (typedef at `explanation.js:86-102`):

```
{ entityType, entityId, entityLabel,
  causalReason : string|null,               // one prose sentence, machine-composed
  causes       : [{source, effect?, reason?, step?, delta?}],
  downstreamEffects : [{target, effect?, reason?, step?}],
  ifRemoved    : { consequences: string[] },
  profile      : Object|null,               // per-type payload
  references   : [{id, label, type}],
  sources      : string[],                  // which derivation fed this
  receipts     : Receipt[] }                // trace.js §C2 view; empty for non-trace explainers
```

| # | Explainer | file:line | Fields it reads | `causes` come from | `receipts`? |
|---|---|---|---|---|---|
| 1 | `explainInstitution` | `explanation.js:324` | `settlement.institutions[]` (`id,name,category,status,tags,impairments`); chains via `deriveAllSupplyChainStates`; `factionProfile.controlsInstitutionIds` | traces + controlling factions | yes |
| 2 | `explainFaction` | `explanation.js:405` | `powerStructure.factions[]`, `deriveFactionProfile` (`archetype,power,legitimacy,wants,fears,leverage,vulnerabilities,resources`) | traces only | yes |
| 3 | `explainNpc` | `explanation.js:486` | `settlement.npcs[]`, `deriveNpcProfile` (`archetype,rank,leverage,vulnerabilities,factionLink,institutionLink,consequenceIfRemoved`) | traces + faction/institution links | yes |
| 4 | `explainSupplyChain` | `explanation.js:556` | `deriveAllSupplyChainStates` (`needKey,status,controller,dependencies,substitutes,outputs,beneficiaries,victims,failureConsequences`) | traces + dependencies + controller | yes |
| 5 | `explainHook` | `explanation.js:625` | `deriveAllStructuredHooks` (`origin,severity,category,source,eventName,ifIgnored,possibleResolutions`) | `hook.source`, `hook.eventName` | **no** |
| 6 | `explainCondition` | `explanation.js:678` | `findActiveCondition` → `archetype,severity,severityBand,status,affectedSystems,duration,triggeredAt` | `triggeredAt.sourceEventType` / `.sourceEventTargetId` ONLY | **no** |
| 7 | `explainEscalationClock` | `explanation.js:739` | `deriveEscalationClocks` (`label,triggerDescription,triggerTargetId,triggerSource,triggerStatus,stages[]`) | the clock's trigger | **no** |
| 8 | `explainHistoryBeat` | `explanation.js:788` | `deriveHistoryBeats` (`key,label,text,source,references`) | `beat.source` | **no** |
| 9 | `explainSystemVariable` | `explanation.js:827` | `deriveSystemVariable(name, s)` → `{variable,score,band,contributors[]}` | **the contributors ARE the causes** (`:836-841`), carrying signed `delta` | **no** |
| 10 | `explainThreat` | `explanation.js:881` | `deriveAllThreatProfiles` (`type,severity,severityBand,currentStage,trajectory,visibility,vector,source,target,beneficiaries,victims,affectedSystems,originSurface`) | `originSurface` + condition/neighbour raw | **no** |
| 11 | `explainCapacity` | `explanation.js:970` | `deriveCapacityProfile` (`supply,demand,ratio,band,trajectory,supplyContributors[],demandContributors[]`) | supply contributors signed `+`, demand signed `−` (`:987-992`) | **no** |
| 12 | `explainDistrict` | `explanation.js:1061` | `deriveAllDistricts` (`category,wealth,safety,dominantFaction,sensoryIdentity,currentTension,hook,services,institutions,connectedDistricts,contributors`) | dominant faction + district contributors | **no** |

Dispatcher `explainEntity(settlement, ref)` at `explanation.js:1131`; type list
`EXPLAINABLE_TYPES` at `:139-152`; id-prefix inference at `:155-184`; catalog of every explainable
entity `entityCatalog` at `:1171`; trace fan-out `relatedTraces` at `:1253`.

⛔ **Only ONE production caller of `explainEntity` exists in `src/`**: `counterfactual.js:203` and
`:244` (before/after an event preview). `entityCatalog` is used by `regenerationMode.js:113` and
`regenerationDelta.js:51`. **No dossier surface, no PDF path, and no prose composer calls any
explainer.** (Measured: `grep -rn "explainEntity\|explainInstitution\|…" src api scripts mcp-server`.)

### 2.2 The non-envelope typed causal records (the richer half)

| Record | Producer | Shape | Where |
|---|---|---|---|
| **Trace** | `recordTrace(ctx, trace)` | `{targetType, targetId, step, result, causes[{source,effect,reason}], downstreamEffects[{target,effect,reason}], ts}` | `trace.js:73-81`, writer `:224`, target vocabulary `ALLOWED_TARGET_TYPES` `:152` (13 types) |
| **Receipt** | `receiptFromTrace` / `makeReceipt` | `{id:'${source}:${targetId}:${n}', source∈{generation,event,pulse,edit}, kind∈RECEIPT_KINDS, causes[], effects[], tick}` | `trace.js:386`, `:408`, kinds `:121-125` — **derived on read, never persisted** (`trace.js:98-104`) |
| **CausalContributor** | `push()` inside 16 derivers | `{source, effect, delta:signed int, reason: a finished SENTENCE}` | typedef `causalState.js:470-476`, writer `:486` |
| **CapacityContributor** | `deriveCapacityProfile` | same shape, split supply/demand | `capacityModel.js:132-133`, `:961` |
| **ActiveCondition.causes[]** | condition emitters (e.g. `residualOutcome`) | `[{source, effect, reason}]` — same `TraceCause` shape | preserved by `activeConditions.js:671`; written at `worldPulse/stressorsCore.js:456` |
| **compromiseLifecycle stamp** | world pulse | `{causeClass, family, stage, situation, role, originTick, resolvedTick, historicizedTick, exposedTick, ageBand}` | schema `settlement.schema.js:983`; projector `worldPulse/causeLifecycle.js:597`; pulse seam `worldPulse/pulseKernel.js:1809-1816` |
| **Contradiction** | `detectContradictions` | `{id, type, classification∈{invalid, rare_but_justified, interesting_tension, user_authored_exception}, description, explanation, consequences[], references[]}` | `contradictions.js:41-50`, `:338`; six detectors at `:134, :162, :187, :216, :255, :293` |
| **SimulationSpine** | `deriveSimulationSpine` | seven frame→complement rungs (`Why it is here / It survives by / …`) | `simulationSpine.js:96`, `:789` |

### 2.3 ⭐ The closed CAUSE vocabulary — the engine's own typed "because"

`src/domain/worldPulse/causeVocabulary.js` is the piece the composed-prose model should be keyed
on. Its own header says it in the owner's words: *"A compromise (the guard captain is corrupt) is
attributed a CAUSE (the garrison is underfunded) drawn ONLY from this closed vocabulary — never
invented."* (`:6-9`)

- **14 classes in 4 families** — `CAUSE_CLASSES` at `:45-64`; verified count 14 / families
  `economic, war, faith, corruption` (probe `_probe-edges.mjs`).
  - economic: `underfunded`, `chain-starved`, `depleted`, `trade-strangled`
  - war: `levied-away`, `garrison-drained`, `siege-scarred`, `occupation`
  - faith: `conduct-drift`, `conversion-pressure`, `secularization`, `clergy-scandal`
  - corruption: `captured`, `scandal`
- **`CauseContext`** (`:96-106`) is the normalized signal snapshot: `scores` (the 16 causal
  scores), `conditions` (archetype id set), `occupied`, `deployed`, `captureState`,
  `corruptingDeity`, `rivalCult`, `revealedInstitutions`, `clergyRevealedTaint`. Built by
  `readCauseContext(item, worldState, cid)` at `:116`.
- **`CAUSE_SIGNAL`** (`:165-228`) maps each class to `'present' | 'clear' | 'ambiguous'` with a
  hysteresis band (`SCORE_LOW 40 / SCORE_HIGH 55`, `:81-82`). `presentCauseClasses(ctx)` at `:232`
  returns every class that genuinely holds RIGHT NOW, in canonical order.
- **Role coherence** — `ROLE_FAMILY_AFFINITY` (`:253-266`, 12 roles × 4 families) plus
  `ROLE_CLASS_BONUS` (`:271-278`) give `roleCauseAffinity(role, causeClass)` at `:285`. The
  canonical pairing the owner names is authored: `military: { underfunded: 0.25,
  'garrison-drained': 0.2, 'levied-away': 0.15 }`.

---

## 3. PERSISTED VS COMPUTED AT RENDER

The distinction is load-bearing for THE PROMISE: a persisted explanation is a seed input forever;
a render-time one is re-derived on every visit and can silently change when a deriver changes.

| Record | Persisted on the settlement? | Evidence |
|---|---|---|
| `settlement.simulationTrace[]` | **PERSISTED** (generation only) | schema `settlement.schema.js:305`; 50 `recordTrace` call sites, all under `src/generators/steps/*` + `pipeline.js`; propagated by `assembleSettlement.js`; `trace.js:10-18` |
| `settlement.activeConditions[]` (incl. `causes[]`, `triggeredAt`, `affectedSystems`) | **PERSISTED** | `deriveAllActiveConditions` reads `settlement.activeConditions` and only normalizes (`activeConditions.js:680-684`) |
| `settlement.defenseProfile.{scores, readiness, institutions, economicGates, chainModifiers, magicDependency}` | **PERSISTED** (generation-time snapshot) | `generators/defenseGenerator.js:635-651`; ⚠ `defenseProfile.institutions` is never rebuilt after generation — `defenseStateProse.js:376-381` |
| `settlement.economicState.foodSecurity` (+ `.stockpile`) | **PERSISTED**, and re-written each pulse tick | `foodLedger.js:55-70`; live re-grade at `worldPulse/foodStockpile.js:387-409` |
| `npc.compromiseLifecycle` | **PERSISTED** stamp | `settlement.schema.js:983`; stamped at `worldPulse/causeLifecycle.js:597` via `pulseKernel.js:1813` |
| pulse record `causeLifecycleEvents[]`, `rollExplanations[]`, `corruptionEvents[]` | **PERSISTED** on the pulse record (capped: 24 / `capPersistedRollExplanations`) | `pulseKernel.js:1855-1872` |
| `ExplanationEnvelope` (all twelve) | **COMPUTED AT RENDER** | pure functions; no writer anywhere |
| `Receipt[]` | **COMPUTED AT RENDER** | stated explicitly `trace.js:100-104` ("built on read, never persisted") |
| `causalState` — 16 variables, bands, contributors | **COMPUTED AT RENDER** | ⭐ measured and recorded in-tree: *"`causalState` is not persisted on the settlement (measured: the pipeline's 38 top-level keys contain no `causalState`)"* — `defenseStateProse.js:1461-1462` |
| capacity profiles + contributors | **COMPUTED AT RENDER** | `capacityModel.js:961` |
| threat profiles, districts, hooks, clocks, history beats, contradictions, simulation spine | **COMPUTED AT RENDER** | `threatProfile.js:595`, `districtProfile.js:597`, `hookEscalation.js:347/:464`, `historyBeats.js:454`, `contradictions.js:338`, `simulationSpine.js:789` |
| `compromisedSecurityInstitutions(settlement)` | **COMPUTED AT RENDER** from persisted parts (`institutions[].impairments[].type==='corruption'` + `npcs[].corrupt`) | `corruption.js:663-692` |

**⛔ The constraint this creates.** The dossier composers cannot reach the render-time substrate
without paying its import closure. Measured in-tree (`defenseStateProse.js:1460-1468`): DefenseTab's
own closure is **25 files / 487,487 B**; adding `causalState.js` pulls **28 further files /
546,887 B**, more than doubling the tab's chunk — led by `institutionalCatalog.js` (103,260 B),
`causalState.js` (77,750 B), `settlement.schema.js` (77,413 B). A previous 293,079 B version of the
same import was refused. **Any composed-prose design that wants contributor-level causes at
dossier render must either (a) persist a slim causal digest, or (b) land the read inside a
component that already imports the substrate.**

---

## 4. THE CAUSAL EDGE GRAPH — what a "relation" may legally be

The brief's LICENSING bound says a modifier may join a spine only along an engine causal edge.
These are the edge sets that exist today, in descending order of typedness.

### 4.1 Condition archetype → system variable (the largest typed edge set)

`CONDITION_ARCHETYPE_TEMPLATES` at `activeConditions.js:58` — each entry declares
`affectedSystems: string[]`.

**Executed** (`_probe-edges.mjs`): **46 archetypes, 131 archetype→variable edges**, every value a
member of `SYSTEM_VARIABLES` (0 unknowns). Edges per variable:

```
public_legitimacy 40 · trade_connectivity 20 · social_trust 15 · defense_readiness 13
faction_power 10 · food_security 7 · labor_capacity 7 · economic_capacity 6
criminal_opportunity 5 · healing_capacity 4 · ruling_authority 2 · magical_stability 1
housing_pressure 1 · law_order 0 · infrastructure_condition 0
```

⚠ `SYSTEM_VARIABLES` holds **16** entries (`causalState.js:398-415`) although its own docblock at
`:394` still says "the 14 canonical system variables" — a stale comment, not a defect.
⚠ `law_order` and `infrastructure_condition` receive **no** archetype edge from this catalog;
`law_order` conditions arrive instead from `worldPulse/stressorsCore.js:138` (`succession_void`),
and `deriveLawOrder`'s scan at `causalState.js:945` is live only for those.
⚠ The stressor catalog authors a **looser** vocabulary and normalizes it: `CAUSAL_SYSTEM_ALIASES`
(`stressorsCore.js:404-407`) maps `faction_stability → faction_power`, `tax_revenue →
trade_connectivity`; `canonicalAffectedSystems()` at `:410`. **A relation-typed design must read
through that normalizer, never off the raw catalog.**

### 4.2 Contributor edges — fact → variable, with a signed magnitude and a sentence

Every one of the 16 derivers pushes `{source, effect, delta, reason}`. The `source` is a stable
id (`'defenseProfile.readiness.score'`, `'powerStructure.government'`, `'institutions'`,
`'safetyProfile.blackMarketCapture'`, a faction id, a condition id, a deity ref). Worked examples:

- `deriveDefenseReadiness` (`causalState.js:1034-1077`): `defenseProfile.readiness.score` ×0.6 off
  50; `defenseProfileHasWalls(def)` **+6, "Defensive walls in place."**; the `defense_readiness`
  condition scan at scale 12; the faith `war_readiness` channel.
- `deriveLawOrder` (`causalState.js:855-991`): governance legitimacy ×0.4; government archetype
  ±8; `defenseProfile.scores.internal` ×0.4; live law-order institution count (+10/+5/−6);
  `safetyProfile.blackMarketCapture` ×0.3 down; criminal faction power above 30 ×0.35 down; the
  `law_order` condition scan at scale 15; the deity `lawAxis` term; the faith `order` channel.

### 4.3 The cause-class edges (the *named* relations)

`CAUSE_SIGNAL` (`causeVocabulary.js:165-228`) is a relation table in the exact form a TURN needs —
it says which *state read* licenses which *named mechanism*:

| causeClass | the state that makes it true | file:line |
|---|---|---|
| `underfunded` | `scores.economic_capacity` below 40 | `:169` |
| `chain-starved` | condition `regional_route_disruption`/`trade_route_cut`, else `trade_connectivity` band | `:172-175` |
| `depleted` | condition `famine`/`regional_import_shortage`/`food_anchor_lost`, else `food_security` band | `:178-181` |
| `trade-strangled` | condition `trade_embargo`/`cold_war_sanctions`/`regional_export_market_loss`/`vassal_trade_coercion` | `:184-187` |
| `levied-away` | `ctx.deployed` | `:190` |
| `garrison-drained` | condition `war_drain`/`war_exhaustion`, else `defense_readiness` band | `:193-196` |
| `siege-scarred` | condition `siege`/`war_pressure`/`war_mobilization` | `:199-201` |
| `occupation` | `ctx.occupied` | `:204` |
| `conduct-drift` | `hasCorruptingDeity` | `:208` |
| `conversion-pressure` | condition `regional_religious_pressure` OR a contesting cult | `:211` |
| `secularization` | `religious_authority` band | `:213` |
| `clergy-scandal` | `clergyRevealedTaint ≥ 0.15` | `:216` |
| `captured` | `powerStructure.criminalCaptureState ∈ {corrupted, capture}` | `:220-224` |
| `scandal` | condition `corruption_exposed` OR `revealedInstitutions > 0` | `:227` |

### 4.4 Envelope-level edges (weaker, prose-shaped)

`downstreamEffects` on institutions (`enables_chain`), factions (`controls`), conditions/threats
(`pressures` → a system variable), districts (`hosts`, `connects_to`), capacities
(`sibling_reader` — explicitly **not** a feed: `explanation.js:996-1006`). `ifRemoved.consequences`
is authored English on every explainer.

### 4.5 Contradiction edges (the *tension* relations)

`contradictions.js` names five structural tensions with a classification and a consequence list —
`oversized_institution_for_tier` (`:141`), `missing_enforcement_for_tier` (`:169`),
`legitimacy_vs_crime_mismatch` (`:193`), `orphaned_faction_power` (`:235`),
`surplus_but_capacity_critical` (`:269`), `threat_without_response` (`:313`). Three of the six are
classed `interesting_tension` — i.e. the engine already labels which combinations are worth
narrating. **This is the natural licensing source for the design's TURN tier.**

---

## 5. ⭐ THE OWNER'S WALLS EXAMPLE, FACT BY FACT

Owner: *"a town's walls are fully funded by a garrison that is underpaid or not adequately funded;
if we also take into account the associated power for the guard (evil, neutral, good), or that any
of their members are compromised or not, or that the granaries are lacking…"*

| Owner's fact | Does a field exist today? | The field, and where it is computed |
|---|---|---|
| **the town's walls** | **YES, typed** | `standingDefenseForces(settlement).walls.{present,count,names}` — `src/domain/institutions/defenseInstitutionBuckets.js:88` (buckets), read live off `settlement.institutions` through the canonical live filter, **not** the frozen `defenseProfile.institutions` snapshot (`defenseStateProse.js:376-381`). Substrate twin: `defenseProfileHasWalls` at `causalState.js:380` |
| **a garrison** | **YES, typed** | `standingDefenseForces(s).garrison.present`; bucket keywords `garrison / barracks / professional guard / professional city watch / multiple garrison` at `defenseInstitutionBuckets.js:88-90` |
| **the garrison is underpaid / not adequately funded** | **YES — this is exactly `defenseProfile.economicGates.military`** | `generators/defenseGenerator.js:189` `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)`; persisted at `:467-472` and `:647-650`, and **recorded only when there is a paid stack to bite** (`hasAnyDefense`, `:177`). ×1.0 = fully funded; below 1.0 the shortfall is real. The display name for the expense is authored: `READINESS_GATE_FOR['Invasion & War'] = ['military', 'garrison pay']` — `src/domain/display/defenseDisplay.js:280`; the note is rendered at `:319-321` |
| **the treasury behind that pay** | **NO settlement-scope treasury** | `treasury.coin` is **state/realm** scope and deliberately dormant — *"no caller of the transfer primitive ships"* (`worldPulse/treasury.js:28-31`). The settlement-scope funding signal is `economicState.compound.economyOutput`, produced at `generators/priorityHelpers.js:403` |
| **the associated power for the guard (evil / neutral / good)** | **NO — no guard-alignment field** | There is no alignment on an institution or on a faction. `factionProfile` carries `archetype, power, legitimacy, wants, fears, leverage, vulnerabilities, resources` and no moral axis (`factionProfile.js:82-83`, `:311-312`). The only `alignmentAxis` in the domain is the **deity's** (`deitySnapshot.js:59`, `customContentSchema.js:152`), whose evil axis feeds corruption onset/exposure via `corruption.js:229-234` and whose `lawAxis` feeds `law_order` at `causalState.js:957-973`. **The nearest existing proxy for a "dark guard" is `powerStructure.criminalCaptureState` plus the compromised-institution read below.** This is the one owner fact with no field. |
| **members are compromised or not** | **YES, typed, split covert/revealed** | `compromisedSecurityInstitutions(settlement) → {covert: string[], revealed: string[]}` at `corruption.js:663-692`; security institutions matched by `SECURITY_INSTITUTION_RE = /(watch\|garrison\|constab\|guard\|magistrate\|court\|barracks)/i` (`:630`). *Revealed* = a non-covert `corruption`-typed impairment on the institution; *covert* = an unousted `npc.corrupt === true` homed there (`npcHomeInstitution`, `:648`). Consequence edge: `patronageSecurityDrag` (`:702`), 0.15 per institution capped at 0.3 |
| **the granaries are lacking** | **YES, three separate typed reads** | (a) presence: `economicState.compound.inst.hasGranary` → `disasterRowPoolKey(granary, hospital, church)` at `defenseStateProse.js:359` and `supplyLogisticsPoolKey(granary, port, tradeAccess)` at `:1213`; (b) stock: `foodLedger(s).storageMonths` / `deficitPct` / `resilienceScore` — `foodLedger.js:55-70`; (c) condition: archetype `food_anchor_lost` — *"A primary food institution (granary, mill, fishery) is gone."* — `activeConditions.js:298-305` |

### 5.1 ⭐⭐ The walls example is ALREADY the deepest key in the product

**Executed** (`_probe-arity.mjs`): the eight desk leaves export **118** `*PoolKey` functions with
arity histogram `{1: 91, 2: 18, 3: 8, 4: 1}` — matching the brief's census exactly, and the **sole
4-fact key is the owner's walls sentence**:

```
defenseStateProse.js:747   wallRationalePoolKey(walls, monsterThreat, militaryGate, tier)
```

Its five pools and their variant counts (executed, `_probe-def.mjs`):

| pool | variants | angles |
|---|---|---|
| `WALLED-THREATENED` | 3 | ledger, street, visitor |
| `WALLED-QUIET` | 3 | visitor, elder, ledger |
| **`WALLED-STRAINED`** | **2** | ledger, unfolding |
| `UNWALLED-SMALL` | 2 | street, visitor |
| `UNWALLED-LARGE` | 2 | counterforce, ledger |

`WALLED-STRAINED` is fired by `militaryGate < 1` — **walls standing, garrison pay short**. That is
the owner's sentence, shipped today, mounted at `defense.wallRationale`
(`dossierMounts.js:361`, rung `sentence`).

### 5.2 ⛔ And it is the exact shape of the explosion problem the owner named

`wallRationalePoolKey` **short-circuits**: once `militaryGate < 1` it returns `WALLED-STRAINED`
and never consults the monster family (`:748-754`). So a walled-and-strained **frontier** town and
a walled-and-strained **settled** town read the same 2 sentences. The trade-off is written down as
a vetoable judgment in the docblock at `:732-737` — *"STRAINED OUTRANKS THREATENED OUTRANKS
QUIET… Say 'veto' to reorder."*

This is precisely the case the SPINE + MODIFIER model dissolves: `WALLED` is the spine, the
underfunded muster and the pressing country are two modifiers with different relations
(consequence / tension), and both get said instead of one silencing the other. **The 4-fact key is
the natural first migration target and the natural worked example for §6 of the architecture.**

### 5.3 The neighbouring 3-fact keys on the same desk

```
defenseStateProse.js:283   beastsRowPoolKey(monsterThreat, perimeter, force)      7 pools
defenseStateProse.js:309   invasionRowPoolKey(walls, garrison, militia)           6 pools, TOTAL over 8 combos
defenseStateProse.js:359   disasterRowPoolKey(granary, hospital, church)          5 pools
defenseStateProse.js:1213  supplyLogisticsPoolKey(granary, port, tradeAccess)
defenseStateProse.js:1244  navalDefensePoolKey(navy, port, blockaded)
```

`invasionRowPoolKey` is the clean combinatorial specimen: three booleans, eight combinations,
six authored pools (garrison outranks militia — `:304-305`), all at 3 variants each
(`_probe-def.mjs`). Composed via `defenseThreatProse` at `:390-418`.

---

## 6. THE THREE EDGE CHAINS THE BRIEF NAMES

### 6.1 walls ↔ garrison funding ↔ treasury — **COMPLETE except the treasury**

```
economicState.compound.economyOutput            (priorityHelpers.js:403)
        │
        ├─► milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)      defenseGenerator.js:189
        │        ├─► degrades defenseProfile.scores.military       defenseGenerator.js:190-191
        │        └─► PERSISTED as defenseProfile.economicGates.military   :467-472
        │                 ├─► wallRationalePoolKey → WALLED-STRAINED      defenseStateProse.js:749
        │                 └─► deriveDefenseReadiness fundingNote          defenseDisplay.js:317-321
        ├─► monsterUpkeepMult (:223) · internalUpkeepMult (:251) · econHealthMult (:289)
        └─► disasterGate = min(1, 0.55 + econOut/50 × 0.45)        defenseGenerator.js:614
                  └─► scores.disaster = resilienceScore × disasterGate    :616-618
                            └─► live re-grade each pulse tick     foodStockpile.js:397-402

standingDefenseForces(s).walls.present   (live roster)  ─┐
standingDefenseForces(s).garrison.present               ─┼─► invasionRowPoolKey   defenseStateProse.js:309
standingDefenseForces(s).militia.present                ─┘
defenseProfileHasWalls(def)  ──► +6 on defense_readiness           causalState.js:1051-1054
```

**No settlement treasury exists.** The third node of the owner's chain is `economyOutput`, an
0..100 opinion score, not coin.

### 6.2 granary ↔ stock ↔ raids — **two of three; "raids" is not an edge**

```
economicState.compound.inst.hasGranary ─► disasterRowPoolKey        defenseStateProse.js:359
                                       ─► supplyLogisticsPoolKey    defenseStateProse.js:1213
economicState.foodSecurity{storageMonths, deficitPct, surplusPct,
   importDependency, magicSupplement, resilienceScore}              foodLedger.js:55-70
        ├─► causalState.deriveFoodSecurity                          causalState.js:518
        ├─► capacityModel food_production lens                      capacityModel.js:563 (FOOD_PATTERN)
        └─► live re-grade + relief release each tick                foodStockpile.js:370-409
condition 'food_anchor_lost' → [food_security, public_legitimacy,
                                criminal_opportunity]               activeConditions.js:298-305
condition 'famine'           → [food_security, labor_capacity,
                                public_legitimacy, criminal_opportunity]  activeConditions.js:67-70
causeClass 'depleted' present ⟸ famine ∨ regional_import_shortage ∨
                                food_anchor_lost ∨ food_security<40  causeVocabulary.js:178-181
```

⛔ **"raids" is not a typed settlement fact.** There is no `raidPressure` field. The nearest typed
objects are `config.monsterThreat` (a tier, feeding the beasts row), the `banditry` threat profile
(`threatProfile.js:107`, a render-time derivation with `affectedSystems`), and route-level
`banditryLoss` on shipments (`spatial/navalLayer.js:603-619`). **No edge connects a raid to the
granary stock today.**

### 6.3 guard ↔ faction alignment ↔ compromised members — **the weakest chain**

```
settlement.institutions[] ∩ /watch|garrison|constab|guard|magistrate|court|barracks/i
        │                                                    corruption.js:630
        ├─ institution.impairments[].type==='corruption', covert!==true  ─► REVEALED  :679
        ├─ institution.impairments[].type==='corruption', covert===true  ─► COVERT    :680
        └─ npc.corrupt===true && !npc.ousted && home matches             ─► COVERT    :683-689
                    │
                    ├─► patronageSecurityDrag  (0.15/inst, cap 0.30)     corruption.js:702-709
                    │        ├─► npcAgency onset suppression             worldPulse/npcAgency.js:719
                    │        └─► espionage gauntlet securityEff01        espionage/espionageGauntlet.js:309
                    ├─► CauseContext.revealedInstitutions                causeVocabulary.js:129-140
                    │        └─► causeClass 'scandal' reads present      causeVocabulary.js:227
                    └─► ⛔ NOTHING in causalState.js — law_order does NOT read it
```

⛔ **`causalState.js` never imports `compromisedSecurityInstitutions`** (its only `corruption.js`
import is `deityLawDirection`, `causalState.js:51`). A bought watch therefore moves espionage and
NPC-agency math but **does not move `law_order` or `defense_readiness`**, and no dossier sentence
can see it.
⛔ **There is no guard alignment axis at all** (see §5). The design's "evil / neutral / good guard"
dimension does not exist as a field and would be a **new persisted shape** — an owner-gated row.

---

## 7. THE SEAM — what today connects explanations to composers (and what does not)

### 7.1 ⛔ The state-prose composers read no causal record

**Measured** (`grep -rn "simulationTrace|\.causes|explainEntity|deriveCausalState|contributors"
src/domain/display/stateProse/`): exactly **one** live read —

```
stressorsStateProse.js:242-250   conditionProvenancePoolKey(condition)
    reads condition.causes  and  condition.triggeredAt.sourceEventType
```

Everything else is a docblock. No composer imports `explanation.js`, `trace.js`, `causalState.js`,
`corruption.js`, or `causeVocabulary.js` (verified by listing every `^import` line in the eight
leaves).

### 7.2 ⛔ The causal register is authored, projected, tested — and unreached

`src/domain/display/stateProse/causalDossierProse.js` is a complete join-family reader: it takes a
`DossierJoin {familyId, arm, slots}` the caller must have **evidence** for, filters variants by the
arm mark, runs the kernel's eligibility and draw, and returns one line
(`readCausalDossierLine`, `:100-127`; `causalLinesForSection`, `:138-151`). Its own header names the
evidence sources: *"`causes[]`, `sourceEventId`, the CW-0 `receiptField` map"* (`:16-18`).

**Executed** (`_probe-causal.mjs`): **78 families, 78 pools, 468 variants**; 21 families with one
arm and 57 with two; section targets `relations 32 · economy 27 · power 24 · faith 20 · population
16 · tensions 15 · history 13 · defense 8`; family prefixes `JF-CPL 42 · JF-SC 11 · JF-SS 6 · JF-W
3 · JF-T 3 · JF-F 3 · JF-P 3 · JF-I 3 · JF-G 2 · JF-N 2`. A family's shape is
`{title, sectionTarget[], arms[], slots[], pools{'*': variants[]}}`.

**Measured:** `grep -rn "causalDossierProse" src --include=*.js --include=*.jsx | grep import` →
**no importer**. The only non-comment references are the generator
(`scripts/generate-dossier-state-prose.mjs:694`) and three test files. **468 authored causal
sentences ship in the bundle and reach no reader.**

### 7.3 ⭐⭐ The one place the composed model IS live — the conjunction ladder

`src/domain/display/causeConjunctionContent.js` is the working precedent for everything the brief
proposes. It resolves the conjunction key stamped by the world pulse
(`{role, situation, causeClass, lifecycleStage, ageBand}`) through **four rungs of decreasing
specificity** (`conjunctionVariantsFor`, `:186-195`):

| rung | key dimensions | table | file |
|---|---|---|---|
| 1 `full` | role × situation × causeClass × stage | `FULL_CONTENT` (`causeConjunctionContent.js:46-153`) — 7 roles, ~12 conjunctions, 2 variants each, covert/revealed split | this file |
| 2 `role` | role × causeClass × stage | `ROLE_CONTENT` | `causeConjunctionRoleContent.js` + 12 per-role leaves (337 lines each) |
| 3 `class` | causeClass × stage | `CLASS_CONTENT` | `causeConjunctionClassContent.js` (351 lines) |
| 4 `floor` | generic template + age-band register | `causeLifecyclePhrase` | `causeLifecycleVocabulary.js` (187 lines) |

Selection is a pure FNV-1a hash of `` `${seedId}::${conjunctionKeyString(key)}` `` (`:212`) —
seeded, no RNG, no Date, byte-inert to generation, lazy-chunk only (`:20-24`). `{role}` is the one
slot, filled by `roleNoun` (`:225`). Consumption seam `describeCompromiseConjunction(stamp, seedId)`
at `:239-260`, live at `src/components/new/npcComponents.jsx:265`.

⭐ **Everything the composed-prose design needs — a specificity ladder, a licensed key, a seeded
uniform draw, a floor that always speaks, an authored-tier census — already exists here and is
shipped. The design should generalise this, not invent it.** Its one structural difference from the
brief's model is that it *selects the most specific authored cell* rather than *composing a spine
with modifiers*; the brief's model is strictly the more scalable of the two, and the ladder is what
it degrades to when a hand-written TURN exists.

### 7.4 The `{reason}` slot — the single sharpest unblocked seam

**Executed** (`_probe-slots.mjs`): the state corpus is **68 blocks / 708 pools / 2,266 variants /
mean 3.20 per pool** (matches the brief). Slot census by variants naming the slot:

```
settlement 1638 · counterpart 105 · seat 92 · faction 77 · chain 38 · institution 35 · good 33
resource 30 · creed 29 · timeband_since 24 · event 22 · faction2 20 · band 16 · season 14
reason 12 · calamity 11 · timeband_age 9 · steading 9 · issue 8 · defwork 7 · access 7 · npc 7
complexity 5 · timeband_span 5 · ruin 4 · rival_creed 4 · stakes 3 · governing 3 · term 3
route 2 · govFaction 2 · founder 1 · challenge 1
```
(blocks naming: `settlement` 68, `faction` 13, `institution` 10, `counterpart` 10, `good` 10,
`reason` **4**.)

The five `{reason}`-naming cells are:

```
DS-DEF-7 :: a contributor with a RECORDED reason, adverse       (declared dark)
DS-DEF-7 :: a contributor with a RECORDED reason, favourable    (declared dark)
DS-GEN-9 :: founding
DS-STR-2 :: COUNTERFORCE: a named leading source
DS-CND-1 :: PROVENANCE: causes[] or triggeredAt.sourceEventType populated   (routed, silent)
```

⛔ **`{reason}` has no producer in the tree.** Two measured refusals say why, and they are the same
refusal:

- `defenseStateProse.js:1470-1477` — the DS-DEF-7 contributor pools want a `bare-common` fill, and
  `causalState.js`'s `push()` writes `reason` as a **finished sentence** ("Defense readiness score:
  21.", "Defensive walls in place."). Every one fails `bare-common` three ways: leading capital,
  terminal period, digits. `effect` is a tag (`measured`, `walled`, `strained`), not a cause.
  *"Parsing the sentence at runtime to extract one is the config-key-walker defect in miniature and
  this desk refuses it."* The named cure: **"a noun-phrase `cause` beside `reason` on
  `CausalContributor`, which is a change to a shape twelve derivers write and owes its own proof."**
- `stressorsStateProse.js:279-294` — DS-CND-1's traced-provenance pool **routes correctly and is
  held silent by anchored liveness**, because inventing the `{reason}` vocabulary would be a lane
  ruling reader-facing prose. *"rule a `{reason}` fill vocabulary and the pool lights with NO desk
  change at all."*

⭐ **This is the cheapest real win in the whole subsystem: a closed, authored noun-phrase cause
vocabulary — which `CAUSE_CLASSES`' `label` field already almost is ("funds run short", "a
hollowed-out garrison", "a captured institution", "stores run dry") — lights three routed-silent
pools with zero desk change, and gives the composed model its connective vocabulary.**

---

## 8. WHAT A TURN MAY BE KEYED ON, TODAY

The brief says a TURN is keyed on the engine's typed explanations, never on raw fact conjunctions.
The keyable typed explanation records that exist:

| Key source | Cardinality | Persisted? | Licensing strength |
|---|---|---|---|
| `causeClass` (14) × `lifecycleStage` × `role` (12) × `situation` | the shipped conjunction ladder | key stamp persisted on `npc.compromiseLifecycle` | **strongest** — the class is closed, the predicate is a pure function of state (`CAUSE_SIGNAL`), and resolution is the same read inverted |
| condition `archetype` (46) × `severityBand` × `status` × `affectedSystems` | 46 × 4 × 3 | persisted | strong — `deriveActiveCondition` (`activeConditions.js:616`) normalizes every field, and `causes[]` is preserved |
| causal-join family (78) × arm (1–2) | 78 families, 468 variants | join derived from `causes[]`/`sourceEventId` | strong — but the reader has no caller (§7.2) |
| `Contradiction.type` (6) × `classification` (4) | 6 detectors, 3 `interesting_tension` | render-time | strong for TENSION relations specifically |
| `CausalContributor` (`source`, `effect`, signed `delta`) | ~12 derivers | render-time; costly to reach (§3) | medium — `effect` is a tag vocabulary, `reason` is a sentence |
| `Trace{step, result, causes, downstreamEffects}` | 50 emit sites, 13 target types | **persisted** | medium — generation-only; nothing from the pulse |
| `threat.originSurface` + `affectedSystems` | 1 explainer | render-time | medium |

⛔ **The one that does not exist:** an explanation record for *state that has been true for a
while without an event* — the "why is the wall still standing" case. Every typed explanation above
is either an event trace, a condition, or a score contributor. A steady state with no event and no
condition has **no explanation record at all**, and that is the majority state of a freshly
generated settlement.

---

## 9. DEFECTS AND GAPS FOUND (each a design input)

1. **`explainCondition` drops `condition.causes[]`.** The deriver preserves it
   (`activeConditions.js:671`) and the composer reads it (`stressorsStateProse.js:244`), but the
   envelope builds `causes` only from `triggeredAt.*` (`explanation.js:683-698`). The richest edge
   on the record is invisible to the one API that claims to unify causality.
2. **Eight of the twelve explainers return `receipts: []`** (hook, condition, clock, history beat,
   system variable, threat, capacity, district — everything not trace-backed; only institution,
   faction, npc and chain carry receipts). Documented as intended
   (`explanation.js:99-101`) but it means the Receipt view covers only 4 of 12 types.
3. **`explainSystemVariable` returns `downstreamEffects: []` unconditionally** — the substrate does
   not track reads (`explanation.js:843-848`). So the variable layer has causes but no
   consequences, and a modifier keyed on "what this pressure feeds" has no source.
4. **`causalState.js` never reads corruption's compromised-institution set** (§6.3) — the owner's
   "compromised members" fact reaches no dossier-visible variable.
5. **No guard/faction alignment axis** (§5) — the owner's evil/neutral/good dimension is absent.
6. **No settlement treasury and no raid-pressure field** (§6.1, §6.2).
7. **`{reason}` has no producer**, holding three routed pools silent (§7.4).
8. **The causal register has no importer** — 468 sentences unreached (§7.2).
9. **`SYSTEM_VARIABLES` docblock says 14; the array holds 16** (`causalState.js:394` vs `:398-415`).
10. **`defenseProfile.institutions` is a generation-time snapshot never rebuilt** — a ruin-flattened
    citadel stays in the `walls` bucket forever (`defenseStateProse.js:376-381`). Every composed
    sentence about fortification must read `standingDefenseForces`, never the snapshot.

---

## 10. CONSTRAINTS THE DESIGN MUST OBEY (from this lens)

1. **A composed sentence about defence reads `standingDefenseForces(settlement)`, never
   `defenseProfile.institutions`** — the snapshot is stale for every ruin path
   (`defenseStateProse.js:376-381`).
2. **The substrate is not persisted and costs 546,887 B / 28 files to import into a dossier tab**
   (`defenseStateProse.js:1460-1468`). Contributor-level causes at render require either a
   persisted slim digest or a host that already imports `deriveCausalState`.
3. **A relation may be typed only through the normalizer.** `canonicalAffectedSystems`
   (`stressorsCore.js:410`) is the only correct read of `affectedSystems`; the raw catalog carries
   `faction_stability` and `tax_revenue`, which are not system variables.
4. **A cause must be drawn from `CAUSE_CLASSES` and never invented** — the vocabulary is closed by
   design (`causeVocabulary.js:6-9`), and attribution must be a pure function of a `CauseContext`
   so that attribution and resolution consult the same signal.
5. **A `{reason}`-class fill is `bare-common`: no leading capital, no terminal period, no digits,
   no em dash, no snake_case** (`defenseStateProse.js:702-710`). `CausalContributor.reason` is a
   full sentence and can never fill one; a new noun-phrase field is required.
6. **Anchored liveness is the kernel's, and it is unconditional**: a variant renders only when every
   slot it names has a real non-empty string fill, and a numeric fill is rejected outright
   (`stateProseKernel.js:136-138`, `:146-151`, `:280-289`). A composed modifier inherits this.
7. **Audience is fail-closed**: a `dm-only` variant truncates to silence for the player, and an
   unrecognised audience reads as the player's (`stateProseKernel.js:159-163`). Any turn keyed on a
   covert cause (`compromised-covert`) is DM-only by construction.
8. **The draw key binds seed × block × pool**; seedless is canonical-at-zero
   (`stateProseKernel.js:301-305`). Any new piece grain adds a new key component and is therefore a
   seed input from birth — THE PROMISE.
9. **The dimension gate is fail-closed**: a pool partitioned by a demoted STATE dimension is
   UNREADABLE until the caller answers it (`stateProseKernel.js:254-261`). Composition must pass
   dimensions through, not around.
10. **One sentence rung per block per page-set** (`dossierMounts.js:26-51`), enforced by
    `sentenceMountForBlock` (`:552`) and a build-time walker. A composed spine+modifiers occupies
    ONE mount; it cannot become a second sentence about the same record at another position.
11. **A causal-join arm is required with no default** — falling through prints the counterpart
    town's condition on this town's page (`causalDossierProse.js:104-106`).
12. **Any new persisted field (guard alignment, a raid-pressure score, a settlement treasury, a
    noun-phrase `cause` on `CausalContributor`) is a persisted-shape change and therefore
    owner-gated**, and the last of those changes a shape twelve derivers write
    (`defenseStateProse.js:1490-1492`).
13. **A `DEFAULT WEARING A READING'S CLOTHES` is the recurring failure mode** — ask of every fact a
    modifier would attach whether the value is a MEASUREMENT or a fail-soft default
    (`dossierMounts.js:53-71`). `economicGates.military` is absent (not 1.0) when there is no paid
    stack (`defenseGenerator.js:465-468`); a modifier must not read absence as "fully funded".

---

## 11. OPEN QUESTIONS

1. **Does the walls example want a modifier or a re-keyed pool?** `wallRationalePoolKey` currently
   silences the country when the muster is strained (`defenseStateProse.js:748-754`). Is the fix a
   MODIFIER on a `WALLED` spine, or a 6th pool `WALLED-STRAINED-THREATENED`? The first is the
   brief's model; the second is what the corpus is shaped for today. **Chair call.**
2. **What is the `{reason}` fill vocabulary?** `CAUSE_LABEL_OF` (`causeVocabulary.js:73`) already
   holds 14 bare-common-shaped noun phrases ("funds run short", "a hollowed-out garrison"). Are
   those the vocabulary, or does the register card want its own? This lights DS-CND-1 and DS-DEF-7
   with no desk change — but it is reader-facing prose, so it is a ruling, not a lane act.
3. **Should a slim causal digest be persisted?** Persisting `{variable: {band, top-2 contributors
   as {source, causeNoun, sign}}}` for 16 variables would break the 546,887 B import wall and give
   every composer the "why" — but it is a persisted-shape change, an owner row, and it makes the
   substrate a seed input under THE PROMISE.
4. **Does the guard-alignment dimension get a field, or a proxy?** Today the nearest reads are
   `powerStructure.criminalCaptureState` and `compromisedSecurityInstitutions().{covert,revealed}`.
   Is "an evil guard" simply "a captured watch", or does the owner want a real moral axis on an
   institution? **Owner row.**
5. **Should `compromisedSecurityInstitutions` feed `law_order`?** It is the obvious missing edge
   (§6.3), but adding a term to a deriver is a same-seed behaviour shift on every world with a
   corrupt watch — a declared shift, owner-signed.
6. **Is the causal register wired in this program or retired?** 468 authored sentences, a complete
   reader, zero callers. Wiring it needs a join-deriver that turns `causes[]` / `sourceEventId`
   into `{familyId, arm, slots}`. That deriver does not exist and is not in the brief's lane list.
7. **What is the real trace volume per settlement?** 50 `recordTrace` sites are all generation-time,
   but I could not measure the per-settlement trace count: the only golden fixture
   (`tests/fixtures/generator-golden-master.json`) is a 525-entry hash map, not settlements, and the
   fences forbid running the generator. **Unmeasured — do not assume traces are dense.**
8. **Does the conjunction ladder's `situation` dimension generalise?** It is deliberately sparse —
   only the `full` rung splits covert/revealed (`causeConjunctionContent.js:26-28`). Does the
   composed model adopt the same sparseness rule for its own second dimension, and is that the
   OCCURRENCE bound in another dress?
9. **Which explanation record licenses a modifier about a STEADY state?** §8's gap: a fact that is
   simply true, with no event, no condition, and no contributor, has no explanation record. The
   majority of a fresh settlement's facts are in that class.
