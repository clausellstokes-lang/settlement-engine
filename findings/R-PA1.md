# R-PA1 — THE DOSSIER'S PAST: what each settlement already says about its past, what it implies about others, and what a past must never contradict

Research seat R-PA1, program THE REALM'S PAST (PA), 2026-10-23. Census only; the chair's proposals are graded in §4.

- **Code of record:** `/home/user/master-code-of-record` @ `81f1cd963`. READ-ONLY. Cited as `path :: symbol` with the line quoted.
- **Docs:** `/home/user/fp-p8/docs` (master after PR #64). The ledger docs were read with `git grep` on `origin/review-fixes-2026-07-08`, read-only.
- **Probes:** under `KIT/findings/R-PA1-probe/`. Each one runs against a BYTE-COPY of the code of record's `src/` (`R-PA1-probe/mcr/src`, with `node_modules` symlinked from fp-p8). No probe touched the worktree, the suite or git.
  - `events.mjs` → `events.out`: dumps all 29 `HISTORICAL_EVENTS_DATA` templates.
  - `hist.mjs 30` → `hist.out`: 180 generated settlements (30 seeds × 6 tiers), with the history measured.
  - `det.mjs`: checks that the same seed gives a byte-identical whole record, and prints example shapes.
  - `present.mjs`: the present-day facts (government labels by tier, stresses, key sets) for 120 settlements.
  - `realm.mjs 40`: 40 eight-town realms (city, town ×2, village ×3, hamlet, thorp) merged into one timeline under proposal (a).
- **Evidence class:** every row is marked **C** (CONFIRMED: read at the cited symbol, or executed) or **P** (PLAUSIBLE: reasoned).
- **Coverage.**
  - **Read whole:** `historyGenerator.js`, `historyEventStrands.js`, `historyPolicyData.js`, `historyRouteContext.js`, `historyTemplate.js`, `legacyGenerator.js`, `generateNarratives.js`, `historyBeats.js`, `historyPreservation.js`, `historyCoherence.js`, `siegeCapability.js`, `customFounding.js`, `resolveNeighbour.js`, `campaign/canon.js`.
  - **Read at their cited symbols (not whole):** `genesis.js`, `relations.js`, `crossSettlementConflicts.js`, `neighbourGenerator.js`, `rulingStructure.js`, `recordRegister.js`, `editSlice.js`, `directives.js`, `userEdits.js`, `rulingPowerSeat.js`.
  - **Measured by probe instead of read** (the present-fact shapes): `powerGenerator.js`, `factionDynamics.js`, `factionCorrelation.js`, `defenseGenerator.js`, `economicGenerator.js` / `economy/`.
  - **Not run:** eslint's effective line counts (the raw `wc -l` is given).

---

## 1. THE SUBSTRATE TABLE

| `path :: symbol` | what it is (quoted evidence) | what it gives PA | gate / presets | host size (raw `wc -l`; eslint's effective count not run) | persisted / derived | class |
|---|---|---|---|---|---|---|
| `src/generators/historyGenerator.js :: generateHistory` | Builds the whole history object. Returns `{ age, founding, historicalEvents: timeline, currentTensions: tensions, historicalCharacter, ...(ancientRuin…), eventsTimeline }` | The source of every dossier's past. PA reads it and never calls it. | Always on; `config.ancientRuinsEnabled` is opt-in (default off) | 914 raw. The file's own comment says "frozen size-ratchet ceiling (scripts/.size-baseline.json = 883 effective lines) — any code line trips sizeBaseline.test.js" | persisted inside the record (`settlement.history`) | C |
| `historyGenerator.js :: resolveSettlementAge` | `if (mode === 'new') return 0; if (mode === 'custom') … Math.max(0, Math.min(5000, …))`; otherwise `getSettlementAge(tier)` | `history.age`: an integer number of years. 0 for a new town; up to 5000 when custom. | `config.settlementAgeMode` (`auto`·`new`·`custom`) | same host | persisted | C |
| `src/data/historyData.js :: AGE_BY_TIER` | `thorp {15,300} · hamlet {30,120} · village {30,250} · town {50,300} · city {100,500} · metropolis {200,800}` | The founding depth of each tier, for the realm clock | — | 1602 raw (a data file) | constant | C |
| `historyGenerator.js :: generateRelationshipEvent` (the timeline; the name is misleading) | `const yearsAgo = Math.min(age, randInt(loYearsAgo, hiYearsAgo));` `event.type = cat;` `event.templateType = tmpl.type;` | Dated events: integer `yearsAgo ≤ age` | — | same host | persisted (`history.historicalEvents`) | C |
| `src/data/historyData.js :: HISTORICAL_EVENTS_DATA` + `EVENT_TYPE_NAMES` | 29 templates of the shape `{type, description, factions, lastingEffects?, plotHooks, severity[]}`. No template carries a `name`; the title comes from `EVENT_TYPE_NAMES` | The event vocabulary PA links over (§2.1) | — | data | constant | C (`events.out`) |
| `src/generators/history/historyPolicyData.js :: STRESS_TO_TENSION`, `TIMELINE_CATEGORY_TYPES` | The stress → tension map, and the 8 categories → template pools | The two classification maps (§2.1) | — | 66 | constant | C |
| `src/generators/narrativeGenerator.js :: genArrivalDetail` | `return { age: null, reason: pick(reasonPool), foundedBy: pick(FOUNDERS_BY_TIER[tier] …), initialChallenge, overcoming, stressNote }` | `history.founding`: free prose with NO typed founder | — | 1018 | persisted | C |
| `src/generators/legacyGenerator.js :: deriveLegacyAnnotations` | `result.push({ annotation: buildAnnotation(ev, relationship, suffix), eventType: ev.type, yearsAgo: ev.yearsAgo, severity: ev.severity, eventName: ev.name })` | The landed "present-day link" from a past event to a present state. It references the event by `eventName` + `yearsAgo` | — | 283 | persisted (`history.legacyAnnotations`, only when non-empty) | C |
| `src/generators/narrative/historyCoherence.js :: historySiegeNarrative` / `siegeCapability.js :: generateSiegeCapability` | `` `The ${eventName} is still present in living memory: ` + punctuatedTension `` | `history.siegeNarrative`: one sentence or null | — | 135 + 65 | persisted | C |
| `src/domain/historyBeats.js :: deriveHistoryBeats` | Seven beats. The beats cite events by `references: { eventName, eventType, yearsAgo, severity }` | The landed READER of a dossier's past. It reads `name`/`yearsAgo` and has no ids | — | 518 | derived | C |
| `src/domain/historyPreservation.js :: carryCampaignEvents` | Campaign-era entries carry `campaignEra: true` with a stable `campaignEventId`; "generation history is never pruned" | The landed idiom for an event that comes after generation. It is the only history entry with an id | — | 205 | persisted | C |
| `src/domain/worldPulse/stressorAftermath.js :: withCampaignHistoryEvent` (and its twins `factionCapture.js :: withCaptureHistoryEvent`, `settlementLifecycleFirstClass.js`) | `campaignEventId: eventId, campaignEra: true, tick, yearsAgo: 0, … anchored: true`; capped by `MAX_CAMPAIGN_HISTORY_EVENTS`, oldest pruned first | How a past fact becomes "history like any recorded event" today. It WRITES INTO THE DOSSIER, so PA must not use it before the first advance | Lit with the pulse | — | persisted in `settlement.history` | C |
| `src/domain/userEdits.js :: EDITABLE_FIELDS`, `applyUserEdit` | `entity._userEdits[path] = { value, originalValue, editedAt }`; settlement-root history paths `history.historicalCharacter`, `history.founding.{reason,initialChallenge,overcoming,stressNote,foundedBy}` | Provenance: an edited field can be told apart from a generated one. This works for the six root prose paths only | Premium edit UI | 431 | persisted (`_userEdits` on the record) | C |
| `src/domain/canonStatus.js :: tagEntityCanon` | `source: 'generated' \| 'user' \| 'event' \| 'ai_overlay'`, `canonStatus: 'draft' \| 'canon' \| 'optional' \| 'superseded'`, `locked` | The landed provenance vocabulary. It takes `canon` and `draft` (§3) | — | 227 | derived | C |
| `src/domain/campaign/canon.js :: savePhase`, `isCanonSave`; `src/store/settlementSlice.js :: canonize` | `savePhase` returns `… \|\| 'draft'`; `canonize` sets `state.phase = 'canon'` … `state.canonizedAt = new Date().toISOString()` | The save-level draft→canon phase. The instant world is BORN `canon` (`instantWorldBody.js`: `campaignState: entry.campaignState, // { phase: 'canon', eventLog: [] }`) | — | 40 / — | persisted on the save | C |
| `src/domain/edit/recordRegister.js :: RECORD_CLASSES`, the identity-key map, `CONSISTENCY_GROUPS` | `history: 'READING'`; `'history.historicalEvents': 'name'`, `'history.legacyAnnotations': ['eventName','yearsAgo']`, `'history.currentTensions': 'type'`; `{ id: 'history-age', root: 'history', members: ['age','founding.age'] }` | The landed IDENTITY of a history entry. Edit Mode's merge keys an event by its `name` | Edit Mode | 309 | constant | C |
| `src/generators/steps/resolveNeighbour.js` + `assembleSettlement.js` | `ctx.effectiveConfig.neighborRelationship = { neighborName: rawNeighbour.name \|\| null, relationshipType: relType }` (only when a neighbour was IMPORTED); the record keeps `neighborRelationship: neighbourProfile \|\| …` | A REAL, NAMED neighbour exists whenever one was bound at generation. Otherwise the field is `null` | — | — | persisted | C |
| `src/lib/saves.js :: withNeighbourNetworkFromRelationship` | `neighbourNetwork: [{ id: \`generated_${…}\`, name, relationshipType, …, fromGeneration: true }, …net]`, plus a bidirectional back-link | A saved-only, NAMED tie between two dossiers | — | — | persisted (SAVED_ONLY_KEYS) | C |
| `src/generators/power/rulingStructure.js` (`governanceLabelMap`, `govDescByLabel`) | `"lord's steward": 'Feudal Stewardship'`, `"lord's appointee": 'Feudal Appointee'`, `'noble governor': … 'Ducal Governorship' : 'Noble Governorship'`, `'royal seat': 'Royal Authority'`, `'city-state government': 'City-State Council'`, `'informal elder consensus': tier === 'hamlet' ? 'Free Elder Council' …` | The ONLY place a generated dossier states its allegiance: in the government label and its description | — | — | persisted (`powerStructure.government`) | C |
| `src/domain/rulingPowerSeat.js :: vassalOverlordOf` | `if (String(record.state) !== VASSALIZED_RUNG) return null; return … record.occupierId` | The campaign-side allegiance: the occupations ledger at the `vassalized` rung | Pulse | 690 | persisted in `worldState.occupations` | C |
| `src/domain/traditions/genesis.js :: deriveFoundingTraditions` | `const AGE_BY_TIER = Object.freeze([8, 20, 45, 90, 170, 280, 380]);` … `ageYears = clampInt(… randFloat(0.8, 1.2), tierIndex + 2, 500)` | A SECOND settlement age, which disagrees with `history.age` (§6 H4) | — | 460 | derived | C |
| `src/generators/crossSettlementConflicts.js :: generateCrossSettlementConflictsDeterministic` | A present-tense NPC/faction friction between a pair of settlements. It has no `yearsAgo` and no history read | It does not relate two pasts | — | 292 | persisted (`crossSettlementConflicts`, saved-only) | C |
| `tests/helpers/dormancyOracle.js :: rawBitFormOf`, `stableBitFormOf`, `normalizeForDormancy` | "`rawBitFormOf` IS THE STANDING CLAIM … `stableBitFormOf` is DIAGNOSTIC" | The landed byte-identity comparators for proposal (d)'s byte-identity test | tests only | — | — | C |
| `src/domain/townMap/siteGenesis.js :: responseModeFor` + `fabricRead.js` | Response mode from `monsterThreat` + walls; "ABSENT/DARK ⇒ EMPTY … the layout engine falls back to pure current-state derivation" | The town map on master replays NO history (§2 Q6) | `urbanFabric` lit | — | `settlement.urbanFabric`, a per-advance mirror | C |

---

## 2. THE ANSWERS

### Q1 — The history generator, read whole

#### 1a. Every field of `settlement.history`

Measured over 180 records (`hist.out` `histKeys`): `age` 180 · `founding` 180 · `historicalEvents` 180 · `currentTensions` 180 · `historicalCharacter` 180 · `eventsTimeline` 180 · `siegeNarrative` 180 · `legacyAnnotations` 171. The last is absent when empty, because `generateNarratives.js` writes it only `if (legacyAnnotations.length > 0)`. `ancientRuin` is present only under the opt-in flag. **C**

| field | writer | shape and value set | class |
|---|---|---|---|
| `age` | `generateHistory` (`const age = resolveSettlementAge(tier, config)`) | an integer. By tier, the `AGE_BY_TIER` ranges above. `0` when `settlementAgeMode:'new'`; `0..5000` when `custom`. Frozen forever: "THE SETTLEMENT'S AGE IS DRAWN ONCE, HERE, AND NEVER AGAIN … `calendar.year` and `history.age` answer different questions and must never be compared or added" | C |
| `founding` | `genArrivalDetail` plus `founding.age = age` | `{ age, reason, foundedBy, initialChallenge, overcoming, stressNote }`. Every field except `age` is a free PROSE sentence (see the `foundedBy` set below) | C |
| `historicalEvents[]` | `generateRelationshipEvent` (+ the opt-in ancient ruin) | `{ yearsAgo:int, type:<category>, templateType:<template>, name, description, severity:'minor'\|'major'\|'catastrophic', lastingEffects[], plotHooks[], anchored? }`. Resource events lack `templateType` (32/920, `evKeys`). **No `id`** (`idCount 0`) | C |
| `currentTensions[]` | `buildHistoricalEvent` (also misnamed: it builds the TENSIONS) | `{ type:<template>, description, factions[], lastingEffects?, plotHooks, severity[] }`. These are PRESENT-tense. `severity` stays an array, because a tension is never rendered through `generateEventNarrative` | C (`det.mjs` tension0) |
| `historicalCharacter` | `generateHistory`'s stub, overwritten by `generateCoherence` → `buildStressProfile` | one prose sentence | C |
| `eventsTimeline[]` | `generateHistory` | `{ year: age - e.yearsAgo, yearsAgo, name, type, anchored }`. `year` is ALREADY a founding-relative year (0 = founding). Campaign-era events are never added to it ("`eventsTimeline` is deliberately NOT extended") | C |
| `legacyAnnotations[]` | `deriveLegacyAnnotations` (in the `generateNarratives` step, and again on reroll) | `{ annotation, eventType, yearsAgo, severity, eventName }`, 0–3 of them, one per event category | C |
| `siegeNarrative` | `generateCoherence` → `historySiegeNarrative` | a string or `null`. Non-null only when one of the first three events is political or disaster AND `yearsAgo < max(30, age×0.3)`. The coherence tail reads the events in their stored oldest-first order. In the measured sample the value was always `null` (`det.mjs`) | C (shape), P (rate) |
| `ancientRuin` | `generateHistory`, opt-in | `{ name, yearsAgo }`, with `yearsAgo = max(age,0) + randInt(120,400)` (THE ONE PRE-FOUNDING EVENT) | C |

#### 1b. The founding

**`founding.reason`** is a pool built from three sources: `TERRAIN_NARRATIVE_HOOKS[terrain|route]`, plus `COMMODITY_HOOKS[commodity]`, plus `pick(reasonPool)`. Every entry is prose. **C**

**`founding.foundedBy`** has 26 distinct values in 180 records. The full set, by tier (`FOUNDERS_BY_TIER`, quoted; **C**):

- **thorp:**
  - "a single extended family who came and never left"
  - "a pair of siblings…"
  - "a discharged soldier…"
  - "a healer who stopped to treat a traveller…"
- **hamlet:**
  - "three or four families…"
  - "a miller…"
  - "a retired tradesperson…"
  - "a small religious community…"
- **village:**
  - "a group of settlers seeking new opportunities"
  - "refugees fleeing war or persecution who found the location defensible"
  - "a noble granted lands by the crown and obligated to populate them"
  - "escaped serfs seeking a place beyond the reach of their former masters"
  - "a community of tradespeople who left a larger settlement under contested circumstances"
- **town:**
  - "merchants recognising economic potential…"
  - "a noble granted lands by the crown with the resources to develop them"
  - "military veterans given land grants…"
  - "a merchant consortium that needed a waypoint…"
  - "religious authorities who wanted a centre for their regional operations"
- **city:**
  - "a powerful noble house that needed a commercial base independent of rivals"
  - "a merchant coalition that grew too large for the town they started in"
  - "a military command that built fortifications…"
  - "royal decree and a century of forced investment"
- **metropolis:**
  - "imperial decree and the systematic forced relocation of skilled populations"
  - "a dynastic decision that this crossroads would anchor the realm"
  - "the slow accretion of three smaller settlements that eventually merged under a single administration"
  - "a great trade house that outgrew every other settlement in the region"

The remaining founding fields:

- **`initialChallenge`:** drawn from `CHALLENGES_BY_ROUTE[port|river|crossroads|road|isolated]`, for example "piracy and coastal raids", "rival claimants to the land", "harassment by a nearby lord", "river bandits". **C**
- **`overcoming`:** drawn from `OVERCOMING_BY_PROSPERITY`, for example "with help from external allies at a critical moment". **C**
- **`stressNote`:** `pickVariant(STRESS_NOTES[primaryStress], …)` or `null`. **C**

#### 1c. Every event TYPE with its template

Source: `events.out`. Severity is the template's draw set; the event carries one picked string. The number of lasting effects follows severity: catastrophic → 3, major → 2, minor → 1. **C**

`yearsAgo` and dating are the same for every type. The year is drawn inside the slice `[age·i/n, age·(i+1)/n]`, with a floor of 5 and a ceiling of `age` (`generateRelationshipEvent`). **C**

| template `type` | name (`EVENT_TYPE_NAMES`) | category (`TIMELINE_CATEGORY_TYPES`) | severity | lastingEffects (template) |
|---|---|---|---|---|
| succession_crisis | The Succession Crisis | political | minor/major | rival claimant bloodlines · succession charter |
| economic_disparity | The Economic Divide | economic | minor/major | arbitration council · walled quarters |
| religious_tension | The Religious Conflict | religious | minor/major | two rival congregations · licensed preaching |
| guild_conflict | The Guild War | economic | minor/major | outside adjudicator · revoked charter |
| external_threat | The Siege | disaster | major/catastrophic | watch towers and muster drills · standing levy roster |
| resource_scarcity | The Shortage | economic | minor/major | granary reserves · price ceilings |
| crime_wave | The Crime Wave | (tension only) | minor/major | watch and curfew · vigilante bands |
| magical_controversy | The Arcane Incident | magical | minor/major | spell licence · warded site |
| generational_divide | The Schism | political | minor | council split old/young · youth assembly |
| corruption_scandal | The Scandal | political | major | oversight office · disgraced families |
| outside_debt | The Debt Crisis | economic | major | "Tribute payments to the external creditor continue on a schedule" · borrowing cap |
| occupation_legacy | The Occupation | political; exile_return | major/catastrophic | collaborator/resistance quarters · "Wartime property seizures remain legally unresolved" |
| infiltration_fear | The Purge | political; occupation_infiltration | major | security office · sealed denunciations |
| disputed_land | The Land Dispute | political | minor/major | unassigned parcel · rival charters |
| population_friction | The Migration | political; demographic | minor/major | distinct districts · resettlement compact |
| leadership_vacuum | The Interregnum | political | major/catastrophic | competing partial authority · regency council |
| market_crash | The Crash | economic | minor/major | (none) |
| trade_collapse | The Trade Collapse | economic | major | (none). Factions include "Rivals who profited from the diversion" |
| great_fire | The Great Fire | disaster | major/catastrophic | (none) |
| plague_years | The Plague Years | disaster | major/catastrophic | (none) |
| great_flood | The Flood | disaster | major/catastrophic | (none) |
| heresy_trial | The Heresy Trials | religious | minor/major | (none) |
| pilgrimage_surge | The Pilgrimage | religious | minor/major | (none). Plot hook: "A rival shrine claims the relic is theirs" |
| popular_uprising | The Uprising | political | major/catastrophic | (none) |
| tyranny | The Tyranny | political | major/catastrophic | (none) |
| wild_magic | The Wild Magic | magical | minor/major | (none) |
| legitimacy_crisis | The Mandate | (tension only) | major/catastrophic | (none) |
| demographic_pressure | The Influx | (tension only) | minor/major | (none) |
| trade_dispute | The Trade Dispute | (tension only) | minor/major | (none). "A dispute over the terms of trade with a partner settlement" |
| *(resource, no template)* | The Iron Dispute · The Great Harvest Compact · The Great Construction · The Arcane Incident | economic/magical | authored | authored (Iron Dispute: "between the settlement and a rival lord") |
| *(opt-in)* | The Fall of ⟨ruin⟩ | disaster | catastrophic | "The relic ruin of … stands nearby." |

`EVENT_TYPE_NAMES` also names `exile_return: 'The Return'`, which has NO template. The `exile_return` CATEGORY draws `occupation_legacy`. **C**

**`type` is the CATEGORY on a generated event but the TEMPLATE on a campaign-era event.** `event.type = cat;` sets the category; `withCaptureHistoryEvent` writes `type: 'corruption_scandal'`. The stable template id on a generated event is `templateType`. **C**

#### 1d. Legacy annotations — what a "present-day link" is

A legacy annotation is the generator's one sentence tying a past event to a CLASS of present state. It is scored by `scoreEvent` against these present-state classes:

- legitimacy: `fractured`/`contested`/`stable` from `publicLegitimacy.score`;
- prosperity: `stressed`/`moderate`/`prosperous`;
- food: `crisis`/`pressured`/`ok`;
- faction power: `Dominant`/`Strong`/`Minor`/`Suppressed`.

Each link has a causal age ceiling, `MAX_CAUSAL_AGE` (for example `political: { legitimacy:80, faction_balance:150, governing_model:250, institutional:300 }`). The generator's own trace calls these links `` `${legacyAnnotations.length} present-day links` ``. An annotation points at its event by `eventName` + `yearsAgo` and never by id. **C**

So the landed meaning of "a present-day link" is past event → a present state of THIS dossier. It never points at another party.

#### 1e. The siege narrative

`siegeNarrative` is a living-memory sentence built from the first of the first three stored events (the oldest in the stored order) that is recent, political or disaster, and that has a name. It is joined to the first current tension's description. It names no counterpart. **C**

#### 1f. Current tensions

**The stress → tension map** is `STRESS_TO_TENSION` (**C**):

- under_siege → occupation_legacy
- famine → resource_scarcity
- occupied → occupation_legacy
- politically_fractured → leadership_vacuum
- indebted → outside_debt
- recently_betrayed → corruption_scandal
- infiltrated → infiltration_fear
- plague_onset → resource_scarcity
- succession_void → succession_crisis
- monster_pressure → external_threat
- insurgency → legitimacy_crisis
- mass_migration → demographic_pressure
- wartime → external_threat
- religious_conversion → legitimacy_crisis
- slave_revolt → legitimacy_crisis

**The neighbour → tension map** is `buildHistoricalEvent`:

- `hostile`, `rival` or `cold_war` → `'external_threat'`
- `trade_partner` → `'trade_dispute'`
- anything else → no tension

It reads `config.neighborRelationship?.relationshipType`. **C**

Tensions are also filled at random from the whole template pool (`pool = HISTORICAL_EVENTS_DATA.filter(… allowsHistoryEvent)`). That fill is why `trade_dispute` (7/180) and `external_threat` (16/180) appeared in records generated with NO neighbour (`hist.out` `tensTypes`; every probe run passed `importedNeighbour = null`). **C**

### Q2 — Which events imply another party

The governing measurement: **no generated event or tension NAMES a counterpart.** The strand builders do draw `'{ally_settlement}': pick(['Westmarch', 'Northgate', 'Riverhold', 'Silverpeak'])`, `'{former_ruler}'` and `'{deity}'` (`historyEventStrands.js :: generateTradeNarrative2`; `generateEventNarrative`'s defaults). But the only placeholders any template or variant uses are `{building_type} {demands} {duration} {location} {method} {quarter} {resource} {route_type}`, measured by a grep over the `HISTORICAL_EVENTS_DATA` block of `historyData.js` and over `historyDescVariants.js`.

So every counterpart is IMPLIED and anonymous: "an external power", "a partner settlement", "a rival lord", "enemy agents". That is exactly the slot PA may fill without contradicting a word, because there is no named party to contradict. **C**

The full classification is in the table below. The words in its "counterpart kind" column mean:

- **TOWN:** another settlement of the realm.
- **POWER:** a people or power: a lord, crown, empire or creditor.
- **MENACE:** a monster or menace (MN).
- **FAITH:** another faith, temple or shrine.

| event type / field | class | counterpart kind | why (receipt) | class |
|---|---|---|---|---|
| external_threat "The Siege" (and the tension) | LINKABLE | TOWN, POWER or MENACE | "News of approaching danger…"; a monster-pressure stress maps here, as does a hostile neighbour | C |
| occupation_legacy "The Occupation" | LINKABLE | TOWN or POWER (the occupier) | "A previous occupation ended…"; "Wartime property seizures"; in 76 of 180 records (`hist.out` `tmplCount`) | C |
| infiltration_fear "The Purge" | LINKABLE | TOWN or POWER (whose agents) | "Rumours (some true) of enemy agents" | C |
| outside_debt "The Debt Crisis" | LINKABLE | TOWN or POWER (the creditor) | "a significant debt to an external power"; "Tribute payments to the external creditor continue" | C |
| trade_collapse | LINKABLE | TOWN (the rival who diverted the trade) | factions: "Rivals who profited from the diversion" | C |
| trade_dispute (tension only) | LINKABLE | TOWN (the partner) | "terms of trade with a partner settlement" | C |
| population_friction "The Migration" / demographic_pressure "The Influx" | LINKABLE | TOWN (the source of the newcomers) | "A recently arrived group" | C |
| plague_years | AMBIGUOUS | TOWN (where it came from), or none | "A sickness moved through the settlement" names no source | C |
| pilgrimage_surge | AMBIGUOUS | FAITH (a rival shrine, in the plot hook) or none | the relic is local; the hook names a rival shrine | C |
| religious_tension / heresy_trial | AMBIGUOUS | FAITH (a rival creed), or internal | "Different faiths or interpretations competed" | C |
| disputed_land "The Land Dispute" | AMBIGUOUS | TOWN or a lord (the other charter), or internal | "A land claim from an old charter contradicts current occupation" | C |
| succession_crisis · leadership_vacuum · tyranny · popular_uprising · corruption_scandal · generational_divide · economic_disparity · guild_conflict · resource_scarcity · market_crash · crime_wave · legitimacy_crisis | LOCAL | — | internal actors only | C |
| great_fire · great_flood | LOCAL | — | natural | C |
| magical_controversy · wild_magic | LOCAL | — | internal | C |
| The Iron Dispute (resource) | LINKABLE | POWER (a "rival lord") or TOWN | authored text | C |
| The Great Harvest Compact · The Great Construction | LOCAL | — | — | C |
| The Fall of ⟨ruin⟩ (opt-in) | LOCAL to the realm, and pre-founding | none (a dead city) | — | C |
| `founding.foundedBy`: "refugees fleeing war or persecution" | LINKABLE | TOWN or POWER (the war they fled) | prose | C |
| `foundedBy`: "a noble granted lands by the crown…", "royal decree…", "imperial decree…", "a dynastic decision…" | LINKABLE | POWER (the crown, which may be a realm seat) | prose | C |
| `foundedBy`: "a merchant coalition that grew too large for the town they started in", "tradespeople who left a larger settlement…", "escaped serfs… former masters" | LINKABLE | TOWN (the MOTHER town) | prose | C |
| `foundedBy`: "the slow accretion of three smaller settlements…" | AMBIGUOUS | TOWNS that no longer exist (absorbed) | prose | C |
| `foundedBy`: families, siblings, soldier, healer, miller, settlers, merchants, veterans, consortium, noble house, military command, trade house | LOCAL | — | — | C |
| `founding.initialChallenge`: "piracy and coastal raids", "harassment by a nearby lord", "rival claimants…", "competition from nearby markets", "political pressure from surrounding lords", "hostile local inhabitants" | LINKABLE | TOWN, POWER or MENACE | prose | C |
| `founding.overcoming`: "with help from external allies at a critical moment" | LINKABLE | TOWN (an ally) | prose | C |
| `currentTensions` (present) | NOT PAST | — | They are present facts that a past must AGREE with (Q4), not events to link | C |
| `config.neighborRelationship` (`hostile`/`rival`/`cold_war`/`trade_partner`/`patron`/`client`/`allied`/`neutral`) | LINKABLE, and ALREADY LINKED when a neighbour was imported | TOWN (named) | `resolveNeighbour`: `neighborName: rawNeighbour.name`. The brief's "abstract" holds only when no neighbour was bound (then the field is `null`, and its tensions are random-pool draws) | C |

**Do any landed modules relate two settlements' pasts?** None of the three does:

- **`crossSettlementConflicts.js`** relates two settlements in the PRESENT tense only, keyed by `relType`. It has no `yearsAgo` and no `history` read. **C**
- **`traditions/relations.js`** relates two settlements FORWARD in campaign time (`IMPOSITION` keyed off `worldState.occupations[sid].state === 'vassalized'`, and `ADOPTION` from migration influx). It does not relate their pasts. **C**
- **`traditions/genesis.js`** reconstructs ONE settlement's founding traditions on its own: "foundedYear is SETTLEMENT-RELATIVE (year 1 = the founding)". **C**

**Verdict: nothing landed relates two settlements' pasts.** **C**

### Q3 — Dating

**Dating against the present and the founding.** Every generated event carries an integer `yearsAgo` measured from generation time. `eventsTimeline` already gives `year = age − yearsAgo`, a founding-relative year. Campaign-era entries are always `yearsAgo: 0` plus `tick`, and they never age, because `yearsAgo` is frozen exactly as `age` is. **C**

**Can an event predate its own founding?**

- Generated events cannot: `Math.min(age, randInt(lo, hi))`. The probe found 0 of 920 events with `yearsAgo > age` (`preFound 0`). **C**
- The opt-in ancient ruin can: `ancientYearsAgo = Math.max(age, 0) + randInt(120, 400)`, which makes its `eventsTimeline.year` NEGATIVE. **C**
- An `age: 0` settlement (`settlementAgeMode:'new'`) has an empty timeline (`age > 0 ? … : []`). **C**

**Integers and determinism.** Every year is an integer (`nonInt 0`). The record is deterministic by seed: 18 same-seed pairs gave a byte-identical history, and two whole records regenerated 30 ms apart showed 0 differing paths (`det.mjs`). **C**

**Settlement ages by tier.** This is the 30-seed measurement, in years (`hist.out`, **C**):

| tier | range drawn (min–max) | measured min / median / max | events min / median / max |
|---|---|---|---|
| thorp | 15–300 | 32 / 163 / 287 | 1 / 3 / 4 |
| hamlet | 30–120 | 31 / 83 / 120 | 1 / 2 / 5 |
| village | 30–250 | 57 / 174 / 249 | 1 / 4 / 6 |
| town | 50–300 | 50 / 138 / 300 | 1 / 4 / 8 |
| city | 100–500 | 104 / 283 / 494 | 2 / 7 / 12 |
| metropolis | 200–800 | 201 / 498 / 745 | 3 / 10 / 17 |

**The merge proposal.** Let `A* = max(age_i)` over the realm's dossiers. Then:

- **Realm year 0** is the oldest founding.
- **Town i's founding** is at realm year `A* − age_i`.
- **An event's realm year** is `A* − yearsAgo`.
- **The present (the birth)** is at realm year `A*`.
- **The clock starts** at `A* − age_(2nd)`.
- **Campaign year y** (`calendarFromWeeks`: `year = Math.floor(weeks / WEEKS_PER_YEAR) + 1`, with weeks clamped to 0 or more) corresponds to realm year `A* + y − 1`.

This is buildable with integer arithmetic and no new clock. The PERSISTED unit must be the dossier's own: an integer `yearsAgo` frozen at birth (the realm year is derived). Two reasons:

- the dossier's `yearsAgo` never moves (it is frozen);
- the campaign calendar cannot go below year 1.

`realm.mjs` measured 40 eight-town realms (**C**):

- the realm spans 202 / 295 / 499 years (min / median / max);
- the second-oldest founding is 233 years ago on average;
- 5.4% of all events fall before the clock starts, so they have no possible partner town;
- of the LINKABLE-template events, 95.2% have at least one other town already founded at their date.

Linking will rarely fail for lack of a town that existed. "Within reach" (route distance) is the real filter, and that is R-PA2's and R-PA3's to measure.

The oldest town was a city in 25 worlds, a town in 9, a thorp in 4 and a village in 2. **A thorp can be the realm's oldest settlement**, because the thorp range of 15–300 is wider than the hamlet and village ranges. See §6 H6.

### Q4 — The present facts a past must agree with

**Government and power.** `powerStructure` keys (`present.mjs`, **C**): `factions, governingName, government, stability, recentConflict, publicLegitimacy, factionRelationships, criminalCaptureState, powerProjectionVersion, economyInputFingerprint, conflicts`.

**Allegiance lives ONLY in the government label.** It is derived from the governing institution's name through `governanceLabelMap`, and stated in `govDescByLabel` (**C**). Measured over 120 records (`present.mjs`):

| label | quoted description | allegiance it states | seen (of 20 per tier) |
|---|---|---|---|
| Feudal Stewardship | "A lord's steward administers the settlement; authority flows downward from the noble" | SUBJECT to a lord | thorp 4, hamlet 9, village 5 |
| Feudal Appointee | "A lord-appointed official governs; all authority is delegated from above and revocable at will" | SUBJECT | town 2 |
| Elected Reeve | "…mediates disputes under noble oversight" | SUBJECT | village 4 |
| Noble Governorship | "A noble governor rules by hereditary or royal appointment; the settlement has little self-governance" | SUBJECT to the crown | city 1 |
| Ducal Governorship | "…by royal appointment; the city is the administrative capital of a large territory" | SUBJECT to the crown, and a regional SEAT | metropolis 2 |
| Royal Authority | "A royal seat concentrates formal authority at the apex of the realm" | APEX (the capital) | metropolis 1 |
| City-State Council | "…governs with considerable autonomy"; the institution vocabulary adds "an independent polity, owing no higher lord" (`institutionVocabulary.js`) | INDEPENDENT | city 1, metropolis 3 |
| Free Elder Council | (from the name) | FREE | hamlet 5 |
| every other label (Elder/Household Council, Headman's Authority, Town/City/Grand Council, Guild…, Merchant…, Democratic assembly, …) | — | SILENT (no allegiance stated) | the rest |

The other allegiance-bearing facts:

- **The campaign-side allegiance** is `worldState.occupations` at the `vassalized` rung (`vassalOverlordOf`). It is not dossier state. **C**
- **No generated dossier carries `previousGovernments`.** It is "written only when a power transfer happens in play (domain/rulingPower.js)" (`powerStateProse.js`). A past change of ruler is therefore prose-only on the dossier: tyranny, uprising, interregnum, succession crisis, occupation. **C**

**Factions.** Each is `{ faction, power (integer, summing to 100), isGoverning, category, powerLabel, desc }`. The pairwise relations are `powerStructure.factionRelationships` (`factionDynamics.js :: computeFactionRelationships`). **C** (shape)

**Religion and deity.**

- Faith in the dossier is the religious institutions plus `config.priorityReligion` plus the factions.
- A patron deity is ATTACHED after generation as `config.primaryDeitySnapshot`. The pipeline "never writes … `config.primaryDeitySnapshot`" (`generateSettlementPipeline.js`, the roster comment). **C**
- The history templates draw `{deity}` but never render it. A dossier's past therefore names no god. **C**

**Defenses and economy.**

- **Defenses:** `defenseProfile.{scores, readiness, institutions.{walls, garrison, militia, watch, …}}`. **C**
- **Economy:** `economicState.{prosperity, primaryExports, primaryImports, tradeAccess, tradeDependencies, foodSecurity, …}`. **C**

**Isolation.** `isolationSupport.{status: 'connected'|…, paths}`. **C**

**Neighbour.** `neighborRelationship` is either `null` or a named profile. When it is named, it is a present fact about a SPECIFIC town. **C**

**What a past would contradict.** Each of these follows from the facts above. All **P**, reasoned from the **C** facts:

1. **A conquest whose occupier still rules.** It contradicts a government label that is INDEPENDENT (City-State, Free Elder) or APEX (Royal Authority). It agrees with SUBJECT labels only if the liege is the occupier.
2. **A conquest that ended.** It agrees with any label. The dossier's own "The Occupation" already records one in 76 of 180 records.
3. **A change of rulers.** It must not touch `powerStructure.government`/`governingName` or mint `previousGovernments`. It may only EXPLAIN a dossier event that is already political: tyranny, uprising, interregnum, succession crisis, occupation.
4. **A population loss.** It must not alter `population` or `populationHistory`. It may only explain a recorded plague, siege, flood, fire or migration.
5. **A faith.** It must not set `primaryDeitySnapshot`, add a religious institution or move a faction. It may only explain a recorded religious event, and only as contact (FAITH kind).
6. **A present-day tie** (a pact, a vassal tie, a hostility) **must agree with all of these:**
   - the government label (no liege for APEX or INDEPENDENT; a SUBJECT label may take a liege of higher tier);
   - `neighborRelationship.relationshipType` when it is named (a named hostile neighbour must not become an ally at birth);
   - `currentTensions` (a `trade_dispute` tension wants a trade tie that is soured, not warm);
   - the stresses (`wartime`/`occupied`/`under_siege` imply a live enemy; 10/120 records carry `wartime`).

### Q5 — User intent and edits

**The save record.** `instantWorldBody.js` builds `saveEntry = { name, tier, settlement, config, seed, aiData: {}, campaignState: entry.campaignState, versionHistory: [] }`, with `campaignState = { phase: 'canon', eventLog: [] }`. A single dossier is born `phase: 'draft'` (`savePhase` falls back to `'draft'`) until `canonize` runs. **C**

**The record's top-level keys** are `GENERATED_KEYS` (41), plus `SAVED_ONLY_KEYS`: `'neighbourNetwork', 'interSettlementRelationships', 'crossSettlementConflicts', 'populationHistory', 'dmLayer', 'decrees', 'peaceOffers'`. The register pins both (`recordRegister.js`). **C**

**Editing.** There are three landed paths. All **C**:

- **(a) Per-field prose edits** (`userEdits.js :: applyUserEdit`) through the pending-edit queue (`store/settlementPendingEdits.js`). For history, the queue admits the six root paths. Event and tension ROWS are "DELIBERATELY NOT WIRED … authored ENTRIES carry no identity to be preserved by (… owner-parked)".
- **(b) Edit Mode** (`store/editSlice.js` over `domain/edit/*`). It has the modes `['decree','off','plain']`, a decree registry, and DM pins (`directives.js`: "One op type, `pin-fork`"). The "seal" family is `SEAL_ACTS = { acceptPeace: { type: 'make-peace', … } }`, and it is the only seal with a writer.
- **(c) Section reroll** (`regenHistoryPipeline`). It carries campaign-era events and re-applies authored root prose (`restoreAuthoredHistory`). Authored rows are lost.

**Locks and canon tags.** `canonStatus.js` reads `_authored`, `locked`, `pinned` and `source`. An edited entity reads `source:'user', canonStatus:'canon', locked:true`. **C**

**Provenance: can an edited value be told apart from a generated one?**

- YES for the six root history paths. `settlement._userEdits['history.founding.foundedBy'] = { value, originalValue, editedAt }` holds both the user's words and the generated original. **C**
- NO for an individual event row. Edit Mode's merge keys a row by `name` (`'history.historicalEvents': 'name'`), and the row carries no edit record. **C**

**Byte identity.** The generated record has NO volatile field: two same-seed generations 30 ms apart differ at 0 paths (`det.mjs`). **C**

The volatile fields all live OUTSIDE generation (**C**):

- `_userEdits[*].editedAt` (`wallClockNow()`);
- the save envelope's `savedAt`, `canonizedAt` (`new Date().toISOString()`) and `versionHistory`.

The landed comparators are `tests/helpers/dormancyOracle.js :: rawBitFormOf` (the standing claim) and `stableBitFormOf` (the sorted-key diagnostic). There is also a generator golden master: `tests/fixtures/generator-golden-master.json`, a sha256 per corpus row over 525 rows (`goldenMasterCorpus.js`). **C**

The test that holds every dossier byte-identical is therefore: for every save `s` in the born world, `rawBitFormOf(s.settlement)` before PA's replay equals `rawBitFormOf(s.settlement)` after it, and again after every veto or re-roll of the past. The comparison is over `settlement`, NOT over the save envelope. **P** (the design), **C** (the parts).

### Q6 — "The way our settlement generator replays a dossier's history before drawing the town"

**On master, nothing does this.** All **C**:

- No town-map module reads `history.*`. A grep for `historicalEvents|history.age|founding.age|eventsTimeline` across the map, town, spatial, layout, foundry, fabric and v2 paths finds only `components/map/heraldRegister.js`, a Herald reader.
- The v2 town map (`domain/townMap/siteGenesis.js`, `townLayoutV2.js`) chooses its response mode from the present: `const threatened = /frontier|hostile|war|siege|contested|dangerous/.test(String(monsterThreat …)); … if (hasWalls && threatened) mode = 'fortify'`.
- Its only time-integrating input is the urban FABRIC mirror, `settlement.urbanFabric = { drift, stocks, scars:[{kind,severity,week}], rebirths }`. That mirror is written per ADVANCE by `worldPulse/urbanFabricKernel.js`, and "ABSENT/DARK ⇒ EMPTY … falls back to pure current-state derivation" (`townMap/fabricRead.js`).
- `src/foundry/` (`generateFoundryModule.js`, `journalPages.js`, `moduleBuilder.js`, `zip.js`) is an export module.
- `GENERATION_TIME_SHIFT_MAP*.md` is the prose-variety program. Its only history row is "Historical events catalog | `src/data/historyData.js` | … needs world-scoped registry".

**What the claim refers to is DESIGN, not code.** `DESIGN_FP_ARCH_MF.md`, the map volume, is landed on the ledger, "NOT on master" and DARK. It designs four things:

- "MULTIPLE WALL RINGS (old core + expansions — derived from settlement age/history)" for a metropolis;
- growth rings, and "§11.1 PROMOTION … the new tier grows AROUND the old core";
- "§13 THE UNDERGROUND STRATUM LAW";
- "Historical marks → §7 (event log: fire scars, grid-rebuilt quarters, growth rings, ruins)".

MF's packet `MF-T2M` ("architectural-history operations", `fabric/architecturalHistory.js`) is marked LANDED on the `composite-r4` lineage. Its file exists in NO tree on this machine: not the code of record, fp-p10, fix-audit or settlement-engine. **C**

**What it would read.** MF itself measured the gap: "**INPUT GAP (MF-P1, measured):** no typed founding record exists — settlementReason is prose, not an enum — so the PLANNED band is unreachable from canonical data" (`DESIGN_FP_ARCH_MF.md` §5.0). **C**

So the map session's "replay" reads, at most, `history.age` and the dated `historicalEvents` (and the fabric once it is lit). PA cannot borrow a replay engine from it. PA could instead become the TYPED past that MF says is missing: §8 R5. **P**

### Q7 — The token census (→ §3)

---

## 3. THE TOKEN CENSUS

How the census was run:

- **Counts** are files containing the whole word, case-insensitive (`rg -w -i -l`). The trees are `src` · `tests` · the code of record's `docs` · fp-p8 `docs` · the ledger `docs` (`git grep -w -i -l` on `origin/review-fixes-2026-07-08`; given where it was run).
- **LANDED** means there is a code literal or identifier with a meaning. **PROSE-ONLY** means the word appears in comments and copy only. **FREE** means there is no hit.

| word | counts | status and meaning | for PA | class |
|---|---|---|---|---|
| `past` | 310 · 336 · 157 · 177 | PROSE-ONLY in effect. The one literal is `grammarWalker.js` returning `'past'` (a tense) | prose only | C |
| `history` | 438 · 401 · 267 · 288 | LANDED: `settlement.history`, `pulseHistory`, `calamityHistory`, `populationHistory` | NEVER name PA's layer "history"; that word is the dossier's | C |
| `prehistory` / `pre-history` | 0 · 0 · 0 · 0; ledger 1 each | FREE | an ok prose word, but misleading: the PA facts are not before history | C |
| `annals` | 2 · 1 · 3 · 3; ledger 3 | PROSE-ONLY ("Sits above the Chronicle annals", `SettlementDetail.jsx`) | **candidate code token** for the past's ledger, after a homonym check (it sits next to the Herald's "chronicle", which is LANDED) | C |
| `founding` | 149 · 118 · 93 · 97 | LANDED: `history.founding`; traditions' "FOUNDING traditions", `foundingFit`, `'founding'` element id | reuse in its meaning ("the founding"); never as a state | C |
| `founder` | 81 · 59 · 56 · 58 | LANDED: the `'{founder}'` token; traditions' founding core | prose | C |
| `foundedBy` | 15 · 8 · 3 · 3; ledger 7 | LANDED: `history.founding.foundedBy`, an editable path | never reuse as a PA field name | C |
| `lineage` | 85 · 111 · 89 · 94; ledger 188 | LANDED: treaty `lineage` (`pactAmendment.js`), the regime lineage `previousGovernments`, Herald `lineageIds` | avoid | C |
| `grudge` | 35 · 21 · 17 · 24; ledger 43 | LANDED as a value: `npcInteriorityRead.js` `kind: … 'grudge'`, plus Herald and news prose | avoid as a code token; fine in briefing prose | C |
| `feud` | 9 · 8 · 4 · 13; ledger 21 | LANDED: `relationshipEvolution.js` `ELITE_FEUD: 'elite_feud'`; partyImpactKinds "Inflame a feud". REGISTERED by PL: "`feud` · `break` · `crown war` (PL) … members vs members over their quarrel" (fold §5) | TAKEN | C |
| `briefing` | 12 · 9 · 4 · 4; ledger 10 | LANDED: the Herald command view `'briefing'` (`HeraldCommandBody.jsx`: `view === 'briefing'`, `data-testid="herald-command-briefing"`, `realm.herald-briefing` in `boundBook.js`) | **HOMONYM for proposal (e)'s "REALM BRIEFING".** Either the Herald's briefing view carries it, or PA picks another word | C |
| `proposed` | 67 · 28 · 134 · 140; ledger 151 | LANDED: the demographics plan state `'proposed'` (`demographicsPlans.js`); the copy `proposed: 'PROPOSED: the engine writes canon'` (`copy/en.js`); a GRAMMAR proposal state (fold §5 row "`signed`/`expired`…") | TAKEN as a state word | C |
| `strike` | 51 · 48 · 63 · 79 | LANDED: the motion token `strike: '300ms'` (`design/tokens.js`); a labor strike in prose | avoid as a state | C |
| `struck` | 91 · 75 · 112 · 124 | LANDED: RN deeds `struck`; "`struck` is the HEARING SEAL's quiet verdict" (fold §5 PT row); the fold's "STRUCK (§3.1.10)"; `timelineTrack.js` `struck: number` | TAKEN; a homonym with the hearing seal | C |
| `settled` | 180 · 98 · 105 · 112 | LANDED: `recordMergeTree.js` `settled: string[]`; the motion token `staticComposition: 'settled'`; WC's cohort age band | TAKEN | C |
| `kept` | 507 · 436 · 215 · 232 | LANDED: RN `pledge_kept`, PT `party_pledge` `kept · broken`; `generationContentProfile` `{ kept, excluded }` | TAKEN | C |
| `fixed` | 286 · 340 · 203 · 217 | LANDED (CSS `position: 'fixed'`, and many generic uses) | avoid | C |
| `canon` | 252 · 443 · 129 · 144 | LANDED twice: the save phase `'canon'` (`campaign/canon.js`) and `canonStatus: 'canon'` (`canonStatus.js`) | **TAKEN.** PA-L1's "THE DOSSIER IS CANON" must stay PROSE; never a PA state | C |
| `draft` (the hazard list) | — | LANDED: the save phase `'draft'` and `canonStatus 'draft'`, besides the brief's "DRAFT" (the unmeasured-constant mark) | TAKEN | C |
| `realm` | 539 · 518 · 200 · 215 | LANDED: the FP campaign WORLD (fold §5: "`realm` here is the campaign world … NEVER the kingdom (`polity`)"); MAP: a polity drawn as a shape | ok in the program's NAME and prose ("the realm's past" = the campaign world's past); never a code token for a kingdom | C |
| `polity` | 13 · 2 · 2 · 15; ledger 34 | PROSE-ONLY in `src` ("…an independent polity, owing no higher lord"). REGISTERED by PL as its code token: "`polity` + `POLITY_CLASSES` `paramount · vassal · occupied`" | PL's; PA must READ PL's polity and never mint its own | C |
| `epoch` | 41 · 42 · 42 · 49; ledger 67 | LANDED: THE EPOCH's `advanceEpoch` (`prng.js` `::epoch:`, `advanceEpochLedger.js`) | TAKEN | C |
| `era` | 33 · 31 · 80 · 90; ledger 178 | LANDED as a component: `campaignEra: true` (`historyPreservation.js` and the three pulse writers); SP-F's `ERA-PRESET-ELIGIBLE` mark | TAKEN (it would invite "pastEra" next to `campaignEra`) | C |

**Recommended code tokens.** All **P**. Each is FREE or LANDED in a compatible sense on the counts above, and each still needs the compile seat's §5 homonym pass:

- **The concept:** `realmPast`, the program's layer. As a camelCase compound it has no hit in `src`.
- **The ledger:** `spatialLedgers.annals`. The word is PROSE-ONLY today ("annals" sits beside the Herald's landed "chronicle", the same family, which is the risk to check). An alternative is `spatialLedgers.realmPast`.
- **One fact:** `pastFact` (FREE).
- **The reference to a dossier event:** `dossierEventRef = { sid, name, yearsAgo }` for a generated event (the triple the landed readers and the merge already use), or `{ sid, campaignEventId }` for a campaign-era one.
- **The time unit:** an integer `yearsAgo`, frozen at birth, in the dossier's own meaning (§2 Q3). Never a negative tick.
- **A fact's state, until the first advance.** Reject `proposed`, `struck`, `kept`, `settled`, `fixed`, `canon`, `draft`, `pin`, `seal` and `lens`, all for the receipts above. The plain alternatives were measured too, and they are TAKEN as well (**C**):
  - `offered`: a boolean key in `edit/directions.js` (`offered: boolean`);
  - `vetoed`: `FOREIGN_PRIMACY_DISPOSITIONS = ['referred', 'vetoed']`;
  - `refused`: a gate verdict and reason literals (`settlementSlice.js` `reason … 'refused'`; `settlementDeityHelpers.js` `probe.action === 'refused'`);
  - `amended`: `PACT_LINEAGE_ACTS = ['amended', …]`;
  - `held`: `HELD` is a record class in `recordRegister.js`.

  **Propose the namespaced closed list `PAST_FACT_STATES = ['as_derived', 'user_held', 'user_changed', 'user_refused']`.** All four are FREE: 0 hits across `src`, `tests` and fp-p8 `docs`, measured. A re-roll is not a state: it increments the fact's `rollIndex`, which REUSES Edit Mode's landed re-roll idiom in the same meaning (`edit/pools.js`: `` createPRNG(`edit-pool:${poolId}:${String(seed)}:${entryId}:${rollIndex}`) ``). **C** (the counts and the idiom), **P** (the choice)
- **At the first advance** the facts stop being the user's to change. `entered_history` is FREE (0 hits). Name the flag `enteredAtTick`. It must never reuse `canon` or `canonizedAt`. **C** (the count), **P** (the choice)

---

## 4. THE CHAIR'S PROPOSALS, GRADED

**(a) The realm timeline from the dossiers, oldest first, with the clock at the second-oldest founding — BUILDABLE AS WRITTEN, with three amendments.**

- It is integer arithmetic over `history.age` and `yearsAgo`, both frozen and deterministic (§2 Q3; `realm.mjs`).
- **Amendment 1, a tie-break:** two equal ages are possible because `randInt` draws integers. Break the tie by settlement id, using codepoint order and never `localeCompare`.
- **Amendment 2, ancient ruins and age 0:**
  - an opt-in ancient ruin dates before its town's founding; place it at its realm year, as a LOCAL event before the clock;
  - an `age: 0` town ("new") joins at the present, with nothing to link.
- **Amendment 3, a ceiling on custom ages:** a custom age reaches 5000 years (`resolveSettlementAge`). A coarse per-year step over 5000 years is a cost question (R-PA2). Cap the replay window, or step by event.
- Measured: 5.4% of events fall before the clock starts, and 95.2% of linkable-template events have a town founded at their date.
- **C** (the arithmetic and the measurement), **P** (the amendments).

**(b) LINKING: the LINKABLE classes — BUILDABLE, with the classes REDRAWN from measurement.**

- The LINKABLE set is §2 Q2's table. It is NOT the brief's list:
  - "raid" and "war" are not event types. The nearest is `external_threat` ("The Siege").
  - "conquest" is `occupation_legacy`, which ENDED by its own text.
  - "plague arrival" is AMBIGUOUS.
  - "schism" is `generational_divide`, which is LOCAL (old vs young). The faith split is `religious_tension`/`heresy_trial`, both AMBIGUOUS.
  - "refugees" is `population_friction`/`demographic_pressure`, and the founder "refugees fleeing war".
  - "founding by settlers" is LOCAL. Only the mother-town and crown founders are LINKABLE.
- The counterpart kinds needed are TOWN, POWER, MENACE and FAITH. POWER and MENACE are not settlements: a link to a POWER needs PL's polity (DARK), and a link to a MENACE needs MN's (DARK) (PA-BRIEF hazard "DARK volumes").
- A first version can therefore link only to TOWN. Every POWER, MENACE or FAITH link stays local until its program is lit, in keeping with the brief's own "a link is never forced".
- **C** (the classes), **P** (the staging).

**(c) "A byte-identity test on every dossier is feasible as stated" — BUILDABLE AS WRITTEN, if the test compares the SETTLEMENT and not the save envelope.**

- The generated record has no volatile field (`det.mjs`: 0 paths differ). The landed comparator is `rawBitFormOf`.
- The test must exclude the envelope's `savedAt`, `canonizedAt` and `versionHistory`, and must compare `_userEdits` as given, never re-stamped.
- One caveat (§6 H3): the pulse re-emits the record on every advance. After the first advance the dossier moves for the pulse's own reasons, so the test holds only across the PRE-ADVANCE replay and its vetoes.
- **C**

**(d) Present-day ties agree with the dossier's present — NEEDS A CAR (a pure read-only leaf, about 80–120 lines, under `src/domain/`).**

There is no landed single "allegiance of" read. The facts are spread across the government label, `neighborRelationship`, the tensions and the stresses (§2 Q4). The car is a pure leaf, `presentTiesAllowed(settlement) → { liege: 'forbidden'|'allowed'|'expected', hostility: …, trade: … }`. It reads:

- `powerStructure.government`, classified by a FROZEN TABLE over the measured labels: SUBJECT · APEX · INDEPENDENT · SILENT;
- `neighborRelationship.relationshipType` and its `name`;
- `history.currentTensions[].type`;
- `stress[].type`.

The leaf-first shape has two rules:

- Label classification by a frozen table keyed on the label string. No prose regex: MF's own rule is "A prose regex may not stand in for the missing field".
- An unknown label reads as SILENT (the tie is allowed, and flagged for review).

**P** (the shape), **C** (the inputs).

---

## 5. PERSISTED SHAPES

**Nothing new on the dossier.** PA-L1, together with `recordRegister`'s `SAVED_ONLY_KEYS` (which a walker holds equal in both directions), means a PA key on the record would be a register act and a dossier change. **C** (the register), **P** (the conclusion).

The proposed campaign-side shape lives under `spatialLedgers.annals` (or `realmPast`; see §3). It would hold:

```
{ v: 1,
  bornAt: { seedDigest, dossierDigests: { [sid]: rawBitDigest } },   // which dossiers it was derived over
  facts: [ { id, kind, atYearsAgo:int, parties:[sid|powerRef], explains: dossierEventRef|null,
             cause, state: 'as_derived'|'user_held'|'user_changed'|'user_refused', rollIndex:int, userValue?:… } ],
  userChoices: [ { factId, verb, value?, order:int } ],               // the intent; everything else re-derives
  enteredAtTick: null|int }
```

Every row of the shape is **P**. Its lifecycle:

- **Create:** at birth, derived and never drawn from the ambient stream. The seed is `${worldSeed}::realm-past`, by the `createPRNG` `fork` idiom (`prng.js`: `fork` is `createPRNG` over `${seed}::${label}`, as quoted in `rosterFinalUnderHeldRoster.test.js`). **C** (the idiom)
- **Read:** the review screen, then the Herald and the pulse after the first advance.
- **Persist:** with the campaign world, never the save's `settlement`.
- **Regenerate:** if a dossier's `rawBitDigest` differs from `dossierDigests[sid]`, re-derive the facts that touch that dossier. Re-apply `userChoices` in `order`. A choice whose fact no longer exists is FLAGGED, not dropped (PA-L2).
- **Undo:** before the first advance, `userChoices` IS the undo stack (append-only, re-derive). After it, the facts are immutable, like Herald entries.
- **Import:** carry the whole object; re-validate the digests.
- **Migrate:** `v`.
- **Dark-after-lit:** facts already entered stay readable. Dark means no new derivation.
- **Death** (a settlement is razed): its facts stay. They are history.

**Reference by `name`.** It is safe on generated events: the dedup guard `nameKey` keeps names unique within a dossier (`generateRelationshipEvent`'s final pass), and Edit Mode keys rows the same way. **C**

The reference breaks under a section REROLL, which replaces every generated event. Per proposal (f), the link to a vanished event drops, and the fact stays as "a past the dossier no longer records". **P**

**Landed idioms that carry this:**

- the drop-when-empty idiom, for absence = an empty ledger, so the dormancy oracle sees no churn: `normalizeForDormancy` treats an absent key as `{}` (**C**);
- the `campaignEventId` idempotency key, for `id` (**C**);
- the proposal ring's snapshot undo is R-PA2's to weigh.

---

## 6. HAZARDS

- **H1 — `type` is two vocabularies.** A generated event's `type` is a CATEGORY (`political`, `disaster`, …). A campaign-era event's `type` is a TEMPLATE (`corruption_scandal`, `external_threat`). PA must classify a generated event by `templateType`, and a campaign-era event by `type`. Resource events have neither a `templateType` nor a template, so they are classified by `name`. **C**
- **H2 — Events have no id.** "no id, no provenance marker, and positional index is worthless across a reroll" (`historyPreservation.js`). Reference by `name` (unique per dossier) plus `yearsAgo`; never by index. **C**
- **H3 — Two clocks.** `history.age` and `yearsAgo` are frozen forever. The campaign calendar moves and starts at year 1 (`calendarFromWeeks` clamps weeks to 0 or more). A pre-birth fact cannot be a negative tick. Keep the frozen `yearsAgo` unit and derive the realm year. **C**
- **H4 — A second settlement age.** `traditions/genesis.js` synthesizes its own age (`AGE_BY_TIER = [8, 20, 45, 90, 170, 280, 380]`, ×0.8–1.2, clamped to 500), independent of `history.age`. A tradition's `foundedYear` can therefore exceed the dossier's age, or fall far below it. If PA ever dates a tradition's import (relations' `adoptedFrom`) in the past, it meets two founding dates. Rule: PA reads `history.age` only, and never genesis's age. **C**
- **H5 — The opt-in ancient ruin breaks "no event predates its founding",** and gives `eventsTimeline.year < 0`. **C**
- **H6 — A thorp can be the realm's oldest settlement** (thorp 15–300; 4 of 40 realms). "Who founded whom" must not invent a thorp founding a city whose `foundedBy` says "royal decree". Linking a founding needs a tier check: a mother town of an equal or larger tier, or a POWER. **C** (the measurement), **P** (the rule)
- **H7 — The neighbour is not always abstract.** When a neighbour was imported at generation, `neighborRelationship.name` names a REAL saved settlement, and `saves.js` writes a bidirectional `neighbourNetwork` back-link. If both towns are in the realm, PA must REUSE that pairing and never contradict its `relationshipType`. When no neighbour was bound, the field is `null`, and any `external_threat` or `trade_dispute` tension is a random-pool draw with no partner implied. **C**
- **H8 — "Occupation" is common, and its text says it ENDED** (76 of 180 records). Linking an occupier to a realm town is a PAST tie whose present form must be "ended": no vassal tie at birth unless the government label is SUBJECT. **C**
- **H9 — The words are taken.** `canon`/`draft` (the save phase and `canonStatus`), `briefing` (a Herald view), `proposed` (the demographics plan state, plus copy), `struck` (the hearing seal's verdict; RN deeds), `kept` (pledges), `settled` (the merge tree), `era` (`campaignEra`), `epoch` (EP), `feud` (PL; `elite_feud`), `lineage` (treaties), `HELD` (a record class). See §3. **C**
- **H10 — The size ceiling.** `historyGenerator.js` is at its frozen ratchet ("883 effective lines … any code line trips sizeBaseline.test.js"). PA must not touch the generator. That is also PA-L1. **C**
- **H11 — A dead trace branch.** `generateNarratives.js` tests `history.events`, a field that does not exist (the field is `historicalEvents`), so the "present-day links" trace never fires. It is harmless, but a compile seat must not cite it as a live receipt. **C**
- **H12 — The instant world is born `canon`.** So "before the first advance" cannot be read off `savePhase`. The first-advance marker must be the campaign's own (R-PA2). **C**
- **H13 — Determinism holes.** None in generation (`det.mjs`). The derivation must not use `Date.now()` (`editedAt` and `canonizedAt` are wall-clock) or `localeCompare` (the genesis discipline), and must iterate dossiers sorted by id. **C** (the holes), **P** (the rule)
- **H14 — A naming trap in the generator.** `generateRelationshipEvent` builds the TIMELINE and `buildHistoricalEvent` builds the TENSIONS. A compile seat grepping for "relationship" will find the wrong function. **C**

---

## 7. OPEN QUESTIONS FOR THE CHAIR

1. **The labels that state no allegiance.** Should PA be allowed to give a liege to a town whose government states NO allegiance (SILENT labels: Town Council, Elder Council, and the like)? Measurement says nothing contradicts it, but it adds a present-day vassal tie that the dossier never stated. Is a SILENT dossier's present "independent by default", or "open"?
2. **What PA-L1's "a user's later edit wins" covers.** An edited `founding.foundedBy` is prose. When the user edits it to "exiles from Riverhold", does PA PARSE the prose to find a named town, or does it only drop its own founding link and offer none? A parse would be a prose regex, which MF's rule forbids.
3. **A section reroll before the first advance.** The reroll replaces all generated events and is a user act. Is it "a later edit" (the past re-reads it, and links to vanished events drop), or is the reroll forbidden while a past is under review?

---

## 8. REFINEMENTS SEEN

- **R1 — Link on `templateType`, not `type`** (H1), and use `name` + `yearsAgo` as the reference (H2). This is the triple the landed readers (`historyBeats`, `legacyGenerator`) and the Edit Mode merge (`recordRegister`) already use. Do not mint an event id on the dossier: that would be a dossier change and a register act. **C**
- **R2 — Split (b)'s counterpart kinds into TOWN · POWER · MENACE · FAITH,** and light only TOWN in the first version. POWER waits on PL's polity, MENACE on MN, and FAITH on the faith ladder (`religionState.js`). This matches "only lit programs grow; dark ones skip". **P**
- **R3 — Make the founding link tier-ordered** (H6). A mother-town link needs `tier(mother) ≥ tier(child)` and `age(mother) > age(child)`. A crown or decree founder links only to an APEX or SUBJECT-seat town (Royal Authority, Ducal Governorship) or to a POWER. **P**
- **R4 — Make the present-ties filter (d) a frozen label table, not prose.** Its source is the 30-odd government labels in `rulingStructure.js :: govDescByLabel`, each classed SUBJECT, APEX, INDEPENDENT or SILENT. The table is pinned total against that map, so a new label cannot slip through. **P**
- **R5 — PA is the typed founding record MF says is missing.** "no typed founding record exists" (`DESIGN_FP_ARCH_MF.md` §5.0). A PA founding fact (founder kind, mother town, decree) is typed. MF's morphology selector could read it LATER without PA changing the dossier. Record this as a seam, not a dependency. **P**
- **R6 — Proposal (e)'s REALM BRIEFING should ride the Herald's landed `'briefing'` view** (`HeraldCommandBody.jsx`) as a section of it, or else take another word. "briefing" is LANDED (H9). **C** (the collision), **P** (the remedy)
- **R7 — The `trade_dispute` and `external_threat` tensions drawn without a neighbour** (the random-pool fill) are the best candidates for PA's TOWN links. They state a partner or a threat and name none. When a neighbour WAS imported, the tension already belongs to that named town (H7). **C**
- **R9 — Re-roll one fact through Edit Mode's landed `rollIndex` seeding** (`edit/pools.js`), forked per fact (`${worldSeed}::realm-past:${factId}:${rollIndex}`). Re-rolling one town's ties then moves no other fact's stream. That is the "knock-on shown first" made cheap: the knock-on is exactly the set of facts whose inputs included the re-rolled fact. **C** (the idiom), **P** (the use)
- **R8 — An occupation's present form is "ended" by its own text** (H8). PA's link should make the occupier a past enemy with a live grudge, never a present liege, unless the label is SUBJECT and the occupier is the liege's realm. **P**
