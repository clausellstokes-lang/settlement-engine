# doors.md — THE DARK-DOOR ENUMERATION, RE-MEASURED AT THE DOCK TIP

**Lane LIGHTINGSCOPE (Opus 5), 2026-09-04. Measurement-only: no edit, no ref, no test command.**
**Measured at dock `c2f80ffc9` (`$SP/laneKERNELMARK-tree`, porcelain 0, 24 cars over `ca651d54b`).**
Every figure below is EXECUTED at that tip unless labelled PLAUSIBLE or INHERITED.

---

## §A WHERE THE INVENTORY LIVES, AND HOW DARKNESS IS DEFINED

### A.1 The authoritative home — and it is NOT in the repository

| what | where | state |
|---|---|---|
| **THE INVENTORY** | `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad/LIGHTING-INVENTORY.md` | 169,776 B · 436 lines · folded 2026-09-02 04:06 ET · header verdict `BUILD-READY WITH CHAIR ROWS 23` · **measured at `fab576aba`** |
| the panel that fed it | `…/4fb807d8-…/scratchpad/lighting-panel/{census,bill,fold}.json` | census F1–F11 + bill B1–B14, both COMPLETE, both verdict NOT READY; the fold IS the re-issue |
| **the charter, on the ledger** | `docs/OWNER_DECISION_QUEUE.md` **§882.1** (also `$SP/row-882.1-lighting.md`) | 29 of 29 findings dispositioned; 23 chair rows ruled |
| **the owner's directive, on the ledger** | `docs/OWNER_DECISION_QUEUE.md` **line 32333 (§881.4)** | verbatim: *"oh light everything up before the exhaustive review."* |
| **the derived docket** | `$SC/pending/LIGHTING.json` (36,248 B, written 2026-09-04 00:17) | **`items` = 31 entries** — this array is the home of the "roughly 31 items" claim |

⚠ **The inventory is scratchpad-only.** It is not in git on either branch, is not reachable from
`refs/preserve/sitting-892-kit-2026-09-03b`, and lives under a session uuid that dies with the
account. Its loss would cost the wave its entire design. Recorded as a risk, not acted on.

### A.2 The definition of darkness — QUOTED, not inferred

There are **three separate definitions in force**, and conflating them is the first hazard.

**(1) A RULES DOOR is dark when its key is absent-or-false in the preset a customer actually gets.**
The mechanism, quoted from `src/domain/worldPulse/simulationRules.js` and confirmed by execution:
virtual keys are *not* comparison keys, ride `...input` un-normalized, and an installed campaign
never acquires them. The default is `realistic_regional` (`:6`), and every non-instant birth path
yields `DEFAULT_SIMULATION_RULES` exactly, with **zero** virtual keys.

**(2) A FLAG IS UNCOVERED when no test drives it lit.** The denominator rule is executable and is
quoted verbatim from `tests/property/mechanismLitCoverage.test.js:186–199`:

> `for (const m of simRulesSrc.matchAll(/\b([a-zA-Z][a-zA-Z0-9]*Enabled)\b/g)) tokens.add(m[1]);`
> …plus every `.<x>Enabled` property read in a flat `worldPulse/*.js`, minus `is[A-Z]…` predicates
> and function-declared names: *"a rules key is never declared as a function."*

**(3) A KEY IS ENGINE-GATED-BUT-UNCENSUSED when it is gated `=== true` and has no manifest entry.**
`tests/lint/engineGatedRuleKeys.walker.test.js:789–794` states the law itself:

> *"the backlog must equal the measured gated-but-uncensused set exactly — **bank wins by deleting
> rows, never by widening the list**"* … *"The ceiling is the burn-down marker, never the guard.
> Lower it whenever a key earns its manifest entry and its certification row; never raise it."*

⛔ **A FOURTH THING WEARS THE SAME WORD AND IS NOT THIS.** `tests/lint/.lighting-census-baseline.json`
("THE LIGHTING CENSUS", five figures) is the **test-suite credit census** — `files` / `parked` /
`credited` / `titles` / `suiteTitles` — measuring which *test files* a parser can prove run. It has
nothing to do with dark mechanisms. Its own header says so. Two instruments, one word; a lane that
reads "refreeze the lighting census" as a door act will measure the wrong thing.

---

## §B THE DENOMINATOR — EXECUTED AT `c2f80ffc9`

Reproduce with `$SC/lightingscope/measure-presets.mjs <dock>` (read-only, ~1 s, no vitest).

```
PRESET IDS (key order): quiet_local | realistic_regional | dramatic_campaign |
                        static_campaign | narrative_campaign | living_realm | full_simulation
DEFAULT_SIMULATION_PRESET_ID = realistic_regional
union of *Enabled keys across DEFAULT + all presets = 56
LIT in the default preset                          = 11
DARK in the default preset                         = 45
   of which lit in SOME preset                     = 34
   of which dark in EVERY preset                   = 11
ENGINE_GATED_VIRTUAL_RULE_KEYS                     = 29
BACKLOG_RULE_KEYS                                  = 17   (ceiling `<= 17`, shrink-only)
EXEMPT_RULE_KEYS                                   =  4   (ruled NOT subsystems)
```

### THE HEADLINE DENOMINATOR

| | count | how derived |
|---|---|---|
| rules doors that EXIST (union ∪ engine-gated ∪ backlog) | **102** | 56 + 29 + 17, disjoint by construction |
| **LIT in the default preset today** | **11** | executed |
| **DARK in the default preset today** | **91** | 45 + 29 + 17 — executed |
| …dark in the default but lit in SOME preset | 34 | executed |
| …dark in EVERY shipped preset | 57 | 11 (class E) + 29 (F) + 17 (G) |
| non-rules doors (product flags, dials, policies) | **14** | 11 `FLAG_DEFAULTS:false` + MAT dial + charset policy + generation worker |
| named-but-unminted doors (a flip is impossible) | **8** (+2 tombstones) | INHERITED from §1.6, spot-confirmed below |

⭐ **The inventory's headline figure of 91 dark rules doors REPRODUCES EXACTLY at the current tip.**
It was measured at `fab576aba`; two landings later it is still 91. The `simulationRules.js` diff
`fab576aba..c2f80ffc9` is **+25 lines, all comment** — the §890 O-12 supersession record. **No preset
value has moved.** The wave has not started.

---

## §C THE DOORS, BY CLASS

Legend — **flip** = a manifest/preset value change · **wire** = new production code · **content** = an
authored corpus leaf · **inert** = lands dark and moves no golden.

### Class A — LIT (not in scope), 11
`stressors emergentEvents relationshipDynamics npcAgency factionCompetition populationDynamics
migrationFlows tradeFlows resourceDrift tierDrift institutionLifecycle` — all `true` in the default.
⚠ `static_campaign` declares **all eleven `false`** (`:662–677`) and stays dark **by identity** —
*"A recorded world: nothing moves unless you move it"* (`SimulationRulesDialog.jsx:75`). O-15 RATIFIED.

### Class B — the 13 comparison keys, default-false · **FLIP, but never onto a legacy id**
`warLayer settlementStrategy faithSpread religionDynamics seasons` + the 8 war sub-flags
(`defenderAttrition warEconomyDrain warSupplyQuality defenderResolve allyDefense warForage warLevy
warDisposition`).
**Lighting home:** a **lit SUCCESSOR preset id**, never the legacy trio. The reason is in the tree, in
the §890 O-12 comment block this lane read at `c2f80ffc9`:
> *"lighting them on this LEGACY id makes rulesMatchPreset miss, presetIdForRules fall through to
> 'custom', and every installed Dramatic Campaign silently re-label itself at its next
> ensureWorldState with no receipt minted."*
**Cost:** flip + one birth car. **Touches `src/`:** yes (`simulationRules.js`). **Dark-inert:** no.

### Class C — WAVES (9) + ONE_REGEN (9), virtual · **FLIP, cheapest class**, 18
`momentum naval intervention settlementLifecycle peaceEngine supplyWebWarfare upswingArcs
resourceDynamics constructiveFlows distancePricedNews reframe provenanceLedger urbanFabric npcGrowth
spatialConsequence npcLadder traditions roads` — all lit in `dramatic`/`living`/`full`, absent in the
default. Virtual ⇒ **no re-label, no installed world lights** — THE PROMISE holds by construction.
**Cost:** one hunk. **Risk:** the class-C **listing diff** (does the preset catalog become eager?) is
the wave's one unmeasured byte question. **Dark-inert:** n/a.

### Class D — lit only at the ceiling · **FLIP**, 3
`disasters` (also dramatic) · `commodityFlow` · `allyIntelSharing`.

### Class E — declared FALSE in `full_simulation` only · **FLIP**, 11
`warTermination dispositionChannels lineageClaim coalitionLedger envoyDiplomacy npcConsequences
routeLifecycle magicEconomy informationBrokerages demographics townCartography`.
⭐ Certification-visible: these are the rows a receipt already grades `DORMANT_BY_CONFIG`.
⛔ `demographicsEnabled` STOPs on three HORIZON evidence items — measured at HEAD:
`demographicsRates.js:375` = `Object.freeze({ signed: false, lit: null })`.
**OSR movement: ZERO** (INHERITED, ⟦A5·B9⟧).

### Class F — `ENGINE_GATED_VIRTUAL_RULE_KEYS`, dark everywhere, declared nowhere · **FLIP after a split**, 29
`advanceEpoch beliefAxes believedConditions believedDevotion believedScarcity casusCommercii
conquestDoctrine errandSpine espionage faithUnseating habitConditioning infoStatecraft migrationRumors
oathHolder pactFormation secondOrderBelief settlementPolitics sovereigntyTrade strategicPosture
treasury treatyLifecycleVoice treatyRenewal undercityHighWater underwaysOrganicFounding warCirculation
warMemory contributionLedger foreignSeat legitimacyUpheaval` — **29, executed at HEAD.**
⛔ **A flip here INVERTS two lighting contracts until L-MANIFEST splits the list.** `espionage`
additionally needs the Herald wiring car: **0 files under `src/domain/worldPulse/espionage/` (18 files)
write a news entry — executed at HEAD.**

### Class G — the walker's BACKLOG, gated `=== true`, in no manifest · **WIRE then FLIP**, 17
`assize commonsVoice contestedGoals corruptionWeb discourseProse economicCoupRead heirs
heraldCausalVoice intelTrade ladderPoliticalWindows memoryWeave migrationCorruptionPush
neutralNeighbors npcCredibility seaRoads thirdPartyRansom upswingHazardRead`.
Each needs a manifest entry + certification row before it leaves the backlog, and the ceiling is
shrink-only. `neutralNeighbors` additionally needs the perf car (O-6(a)).

### Class H — EXEMPT, ruled NOT subsystems · not candidates, 4
`routineMajorApproval institutionPoliticalControl biomeTruth climateTruth` — **4 at HEAD** (the
inventory said 3; the fold's correction ⟦A2·F7⟧ is right).

### Class I — named, NOT minted · **WIRE — a flip is impossible**, 8 (+2 tombstones)
Files naming each door string, executed at HEAD:

| door | files naming it | verdict |
|---|---|---|
| `irregularForceEnabled` | **0** | CONFIRMED unbuilt — SEAT-7/8, ≈4 cars, 2–3 days, the arc's longest pole |
| `operationsVoiceEnabled` | 2 | `operationsVoice.js:605` — *"NAMED, NOT MINTED"* |
| `envoyTaskCatalogEnabled` | 2 | `envoyTaskCatalog.js:622` — *"NAMED, NOT MINTED"* |
| `infiltrationDepthEnabled` | 5 | `infiltrationDepth.js:58–61` — *"NO PRODUCTION CALLER, AND NO FLAG IS MINTED"* |
| `missionDispatcherEnabled` | 4 | `missionDispatcher.js:66–68` |
| `characterDriftEnabled` | 9 | no manifest home, no production caller |
| `faithFieldEnabled` | 4 | strings only (`FAITH_FIELD_DOOR`) |
| `seatBooksEnabled` | 1 | a comment at `strategicPosture.js:36` |

### Class J — non-rules doors · mixed
| door | home | state at HEAD | class |
|---|---|---|---|
| MAT dial | `livingContentLaw.js:94` `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION` | v1 | flip + wire (create boundary + 3 persistence paths) |
| product flags | `src/lib/flagRegistry.js` | **11 `false`** — `copyGuard perimeterCaptcha imFellDisplayFace settlementWorkbench heraldCommandBrief realmItemShadowDiagnostics settlementScene3dDefault mobileSingleChrome advanceWorkerParanoia handbookVoice warEconomySurfacing`; `founderRecognition:true` (O-16 landed §890) | flip ×3 this wave |
| charset policy | `schema/custom-content.manifest.json:31` | `"enforcement": "report"` | flip, gated on CS-9's plant |
| generation worker | — | **`generationWorker` has 0 hits in `src`+`tests`** | the registry entry does not yet exist to flip |
| faith tuning | `faithTuningSurface.js:125` | `{ signed: false, live: true }` — O-17's law half LANDED | content (a fixture) |
| demographic tuning | `demographicsRates.js:375` | `{ signed: false, lit: null }` | wire (HORIZON) |

---

## §D WHAT THIS WAVE ACTUALLY LIGHTS — the honest denominator

Every term below is EXECUTED at `c2f80ffc9`; no term is inherited.

| family | exist | lit today | **dark today** | how counted |
|---|---|---|---|---|
| rules doors | **102** | 11 | **91** | union 56 + engine-gated 29 + backlog 17 |
| product flags (`FLAG_DEFAULTS`) | **38** | 27 | **11** | executed: `total = 38  TRUE = 27  FALSE = 11` |
| named mechanism doors | **3** | 0 | **3** | MAT dial at v1 · charset policy `"report"` · `generationWorker` (absent — nothing to flip) |
| named-but-unminted doors | **8** | 0 | **8** | a flip is impossible; a BUILD is owed (+2 tombstones, excluded) |
| **TOTAL** | **151** | **38** | **113** | |

*(the two tuning signatures — faith `{signed:false,live:true}`, demographic `{signed:false,lit:null}` —
are counted in neither column: they are VALUES, signed last, and are not lighting doors.)*

### What the wave lights, and what stays dark on purpose

| | count | basis |
|---|---|---|
| **this wave lights** | **≈ 96 rules doors + 5 non-rules doors** | 45 default-dark + 29 class F + 17 class G + 5 flips (MAT dial, 3 product flags, charset wall) — **and `generationWorker` only if WORKER Car 1 lands its entry first** |
| **stays dark, deliberately, and recorded** | **≈ 23** | `static_campaign`'s 11 (dark by identity, O-15) · 4 flags with unmet promotion proofs · `imFellDisplayFace` (to the walk with its OFL vendoring) · 2 security-posture flags (`copyGuard`, `perimeterCaptcha`) · the 3 module-side doors (O-8, §739.1/§740.1) · 2 tombstones |
| **cannot be lit — a BUILD is owed first** | **8** | class I; `irregularForceEnabled` alone is ≈4 cars and 2–3 days |

⚠ **"≈96" is arithmetic over a PLAN and is labelled as such.** The 151, the 113, the 91, the 11, the
29, the 17, the 4 and the 38 are MEASUREMENTS. How many of the 17 backlog keys earn a manifest entry
inside this wave is a design choice not yet made, so the lit total cannot be tightened from the tree.

## §E THE DOCKET'S 31 ITEMS — RE-VERIFIED AT `c2f80ffc9`

`$SC/pending/LIGHTING.json` `items` = **31**, verified by this lane at the current tip.
⚠ **The docket's own prose is internally inconsistent with its own array** and both errors matter:
its `status` string says *"30 pending items: 16 prerequisite builds, **7 wave cars**, 2
register/declaration acts, the src-prose car, and 6 owner rows"* — that sums to **32**, and the wave
cars are **6**, not 7 (`L-HOMES` has no item of its own; it is the container for P4–P13).
**The true composition of the 31: 16 builds + 6 cars + 2 register acts + 1 prose car + 6 owner rows.**

**Landed status re-executed at `c2f80ffc9` — every "landed=NO" claim in the docket still holds:**

| probe | result at HEAD | docket said |
|---|---|---|
| `NEW_CAMPAIGN_SIMULATION_PRESET_ID` | **0 hits** | NO ✓ |
| `presetLightingWitness` | **0 hits** | NO ✓ |
| `irregularForceEnabled` | **0 hits** | NO ✓ |
| `generationWorker` (src+tests) | **0 hits** | NO ✓ |
| `mobileSingleChrome / handbookVoice / warEconomySurfacing` | all `false` (`flagRegistry.js:78/:86/:87`) | NO ✓ |
| `founderRecognition` | `true` (`:74`) | O-16 landed ✓ |
| `DEMOGRAPHIC_TUNING_SIGNATURE` | `{signed:false, lit:null}` | PARTIAL ✓ |
| `charsetPolicy.enforcement` | `"report"` | NO ✓ |
| espionage news writers | **0 of 18 files** | NO ✓ |
| `FAITH_TUNING_SIGNATURE` | `{signed:false, live:true}` | PARTIAL ✓ (law half in, fixture out) |

⇒ **Nothing on the lighting wave has moved since the docket was built.** The four §890 "lighting rows"
(O-12, O-16, O-17, O-10(b)) were **owner-row dispositions, not wave cars** — O-12 landed a *record*
holding the eight sub-flags dark, O-16 flipped one flag, O-17 landed the faith law without its fixture,
O-10(b) measured a residual of zero. The 31-item wave is entirely ahead.
