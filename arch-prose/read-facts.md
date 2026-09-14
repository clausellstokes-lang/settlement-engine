# READ-FACTS — THE FACTS THE PROSE CAN READ

**Reader lens for the COMPOSED-PROSE MODEL (ARCH-BRIEF, owner commission 2026-09-07 ~22:10).**
Seat: Opus 5 — Fable-unvalidated. Read-only throughout; no product byte moved.

## 0. SOURCES, METHOD, AND WHAT IS EXECUTED VS CITED

| Source | Path | Pin |
|---|---|---|
| Product code (composers, kernel, leaves, annex, slot-shape lib) | `$SC/laneB6` | product tip 3b1c0eaa5 |
| Instruments (walkers, measures, corpus + fill helpers) | `$SC/skepINSTR` | INSTR-912 at 74a1aa0e8 |
| Prior receipt (cited where not re-executed) | `$SC/receipt-instr-912.md` | INSTR-912 |
| §912 sitting's slot census | `$SC/s12-sitting/verify/slots.mjs` | executed here |

**PARITY CHECK, EXECUTED.** The six composers, `stateProseKernel.js` and all six
`*.generated.js` leaves are BYTE-IDENTICAL between `laneB6` and `skepINSTR`
(sha256, first 16 hex, each pair SAME). So an instrument run rooted at `skepINSTR` measures
the product tip's composers, and every figure below is comparable across the two docks.

**Scripts written for this pass** (all read-only, all under `$SC/arch-prose/`, all executed):
`facts-census.mjs` (reproduces INSTR car 5), `block-census.mjs` (per-block pool/variant/slot
census), `poolkey-fan.mjs` (118 key functions), `bag-nearest.mjs` (CORRECTED bag resolver),
`dead-corrected.mjs` (unreachable variants), `poolkeys.mjs`, `slot-shapes.mjs`,
`vocab-sizes.mjs`, `dupes.mjs`.

Every figure below is either (a) printed by one of those commands, whose output I saw, or
(b) cited to a file and line. Nothing is carried on the receipt's word except where the row
says so.

---

## 1. THE READ PATH — WHAT A FACT MUST SURVIVE TO REACH A READER

A fact reaches prose along exactly one path, and there are four gates on it. The design must
place every new piece (spine, modifier, turn) somewhere on this path.

```
settlement / readings
      │
      ├── (A) POOL KEY   fact → poolKey string        118 *PoolKey functions
      │                                                the fact is rendered as a CHOICE
      │
      └── (B) SLOT BAG   fact → options.slots[name]    per (block, pool) object literal
                                                       the fact is rendered as a WORD
                          │
   readStateProse(corpus, blockId, poolKey, {slots, seed, audience, dimensions})
   laneB6/src/domain/display/stateProse/stateProseKernel.js:318
                          │
      gate 1  DIMENSIONS   eligibleVariants :247 — a pool that partitions itself by a
                           demoted STATE dimension is UNREADABLE until the caller answers it
      gate 2  AUDIENCE     variantIsAudible :159 — `dm-only` truncates to SILENCE for players
      gate 3  ANCHORED     variantIsAnchored :146 — a variant naming a slot the bag does not
                           fill is DROPPED (isFilled :136 — non-empty string only; a NUMBER
                           is rejected on purpose, §0d bans digits)
      gate 4  DRAW         drawVariant :301 — eligible[ avalanche32(fnv1a32(
                           `${seed}::${blockId}::${poolKey}`)) % eligible.length ]
                           seedless ⇒ index 0 (canonical-at-zero, :303)
                          │
      fillSlots :280 — any still-unfilled {slot} ⇒ null (a rendered `{counterpart}` is
                       worse than no sentence; second gate on the same invariant)
```

**THE DRAW KEY IS `seed :: blockId :: poolKey`** (`stateProseKernel.js:304`). It does **not**
include the variant list length or content — so THE PROMISE's re-roll rule in the brief
(§"a pool whose wording count changes RE-ROLLS") follows from `% eligible.length` alone, and
note the modulus is over the **eligible** list, not the authored pool: adding a variant that
is ineligible on this town does not move that town's draw, while adding an eligible one does.
The seed the callers pass is `String(s?._seed ?? s?.id ?? '')` (e.g.
`laneB6/src/components/new/tabs/PowerTab.jsx:223`).

**THE SIX COMPOSERS ARE THE ONLY CALLERS.** Executed grep over `laneB6/src` for
`readStateProse|stateProseSentence|hasStateProsePool`, excluding the kernel: 31 hits, all six
in `src/domain/display/stateProse/*StateProse.js` (general 11, defense 9, power 7, stressors
2, warFaith 1, economy 1). The instruments' `COMPOSERS` list
(`skepINSTR/tests/helpers/dossierComposedFill.js:42`) is therefore complete, confirmed.

**Composer entry points and their arguments** (laneB6):

| Composer | entry | signature |
|---|---|---|
| general | `generalStateProse.js:1706` | `(settlement, readings = {}, options = {})` |
| power | `powerStateProse.js:841` | `(settlement, readings = {}, options = {})` |
| economy | `economyStateProse.js:880` | `(settlement, readings = {}, options = {})` |
| defense | `defenseStateProse.js:1084` | `(settlement, options = {})` — **NO readings parameter** |
| stressors | `stressorsStateProse.js:456` | `(settlement, readings = {}, options = {})` |
| warFaith | `warFaithStateProse.js:777` | `(settlement, readings = {}, options = {})` |

Defense is the outlier by construction: it reads the raw settlement object and derives its own
keys, and it exports **nine** further desk functions that each call `readStateProse`
themselves (`defenseThreatProse:390`, `defensePostureProse:546`, `defenseCriminalProse:654`,
`defenseWallRationaleProse:774`, `defenseMilitaryStatusProse:891`, `defenseForcesProse:1051`,
`defenseStateProse:1084`, `defenseSupportingProse:1268`, `defenseMagicDependencyProse:1417`).

Callers (the UI seam): `src/components/new/generalDeskRead.js:176`,
`economyDeskRead.js:101`, `tabs/PowerTab.jsx:223`, `tabs/DefenseTab.jsx:94`,
`tabs/OverviewTab.jsx:163`, `tabs/WarFaithDesk.jsx:107`. Each has a `publicDossier` branch
that returns a frozen SILENT object instead — the audience law at the seam.

---

## 2. TABLE A — EVERY FACT THE SIX COMPOSERS READ (the 72-fact census, reproduced)

**EXECUTED**, `node arch-prose/facts-census.mjs`, via
`skepINSTR/tests/helpers/dossierComposedFill.js:414 unrenderedFacts()`:

```
generalStateProse.js     holds  34 · rendered  6 · KEY-ONLY  28
powerStateProse.js       holds   7 · rendered  1 · KEY-ONLY   6
economyStateProse.js     holds  12 · rendered  2 · KEY-ONLY  10
defenseStateProse.js     holds   9 · rendered  1 · KEY-ONLY   8
stressorsStateProse.js   holds   4 · rendered  1 · KEY-ONLY   3
warFaithStateProse.js    holds   6 · rendered  2 · KEY-ONLY   4
TOTAL: holds 72 · rendered 13 · key-only 59 (82%)
```

Byte-for-byte the receipt's §5.2 print (`receipt-instr-912.md:651-657`). **The receipt's
correction stands and the design must carry it: a KEY-ONLY fact is not dark — it selects
which authored sentence the reader meets. 59 is an UPPER bound on the authoring wave's
opportunity, not a count of invisible facts.**

### A.1 The full lists, by composer

`R` = reaches a slot bag (rendered as a word). `K` = key-only (rendered as a choice).
Type/values are from the composer's own JSDoc `readings` typedef; the closed-or-open column
says whether a PUBLISHED closed vocabulary exists that a piece may quantify or totalise over.

**generalStateProse.js** — readings typedef at `generalStateProse.js:1668-1693`.

| Fact (field path) | R/K | Type / values | Closed? |
|---|---|---|---|
| `readings.exploitation` | R | `{fullyExploited, partiallyExploited, unexploited}` | open (counts) |
| `readings.govFaction` | R | proper name | open |
| `readings.governingName` | R | proper name | open |
| `readings.history` | R | `{age, historicalCharacter, founding{foundedBy, initialChallenge}, historicalEvents[]{type,name,yearsAgo,anchored,lastingEffects}}` | mixed |
| `readings.primaryImports` | R | list of goods | open |
| `settlement.name` | R | proper name | open |
| `readings.scores` | K | `Record<axis, band>`; **5 axes × 4 bands** measured from DS-GEN-3's pool keys: military·monster·internal·economic·magical × {STRONG, ADEQUATE, WEAK, CRITICAL} | **CLOSED (4)** |
| `readings.prosperity` | K | DS-GEN-3 keys: 5 compound bands (`Poverty / Impoverished` … `Wealthy / Thriving`); DS-ECO-8 keys: 7 (`SUBSISTENCE`…`WEALTHY`) | **CLOSED, but TWO vocabularies for one fact** |
| `readings.safetyLabel` | K | 14 head words `SAFETY_BANDS` (`labelBands.js:71`), bucketed to **3** pools in DS-GEN-3 | **CLOSED (14 → 3)** |
| `readings.viable` | K | boolean | **CLOSED (2)** |
| `readings.readinessLabel` | K | 6 (`Fortress`…`Undefended`, DS-GEN-3 pool keys) | **CLOSED (6)** |
| `readings.foodSecurityLabel` | K | 6 (`Secure, Surplus, Pressured, Import-Dependent, Deficit, Deficit × Active Famine`) | **CLOSED (6)** |
| `readings.terrainType` | K | terrain enum | closed (per producer) |
| `readings.tradeRouteAccess` | K | 5 `ACCESS_NOUN` keys `road, river, port, crossroads, mountain_pass` (`economyStateProse.js:172`) | **CLOSED (5)** |
| `readings.isEntrepot` | K | boolean | **CLOSED (2)** |
| `readings.inst` | K | institution roster projection | open |
| `readings.tier` | K | settlement tier enum | closed |
| `readings.foodBalance` | K | balance record | mixed |
| `readings.conflicts` | K | `[{intensity, parties, issue, stakes}]` | open (list) |
| `readings.criticalIssueCount` | K | number | **NEVER a word** (digits banned) |
| `readings.coherenceNotes` | K | `[{type, tab}]` | open |
| `readings.structuralViolations` / `.structuralSuggestions` | K | lists | open |
| `readings.prominentRelationship` | K | one tie | open |
| `readings.relationships` | K | `[{flagDriven}]` | open |
| `readings.hookCategories` / `.clockIds` | K | id lists | open |
| `readings.activeChains` | K | supply chains | open |
| `readings.lifecycleStatus` | K | remnant/lifecycle enum | closed |
| `readings.steadings` | K | list | open |
| `readings.ancientRuin` | K | `{name, yearsAgo}` | open |
| `readings.neighbours` / `.crossEngagements` | K | lists | open |
| `readings.populationTrend` | K | `{band, window}` | closed band |
| `readings.conditions` (via `readings.*`) | — | see stressors | |

**powerStateProse.js** — readings typedef at `powerStateProse.js:829-833`.

| Fact | R/K | Values | Closed? |
|---|---|---|---|
| `settlement.name` | R | proper | open |
| `readings.contenders` | K | `{challengers[]{name}}` | open |
| `readings.politics` | K | `{blocs[]}` | open |
| `readings.riskLabel` | K | risk band | closed |
| `readings.structuralLens` | K | `{rulingPower, economicBase}` | mixed |
| `settlement.economicState` | K | economy record | mixed |
| `settlement.powerStructure` | K | `{governingName, stability, publicLegitimacy{label,breakdown,flags}, recentConflict, factions, government, criminalCaptureState, previousGovernments}` | mixed |

Measured value spaces from DS-POW-1's 11 pool keys: legitimacy label ∈ {Endorsed, Approved,
Tolerated, Contested, Legitimacy Crisis} (**5**), plus a breakdown-dominance family
(PROSPERITY favourable/adverse, SAFETY adverse, DEFENSE adverse, FOOD adverse = **5**) and
`governanceFractured true` (**1**). DS-POW-2's 9 keys: stability tokens {stable, unstable,
critical, siege, Desperate, unclassified} (**6**) + governing-share {DOMINANT, NARROW}
(**2**) + `recentConflict present` (**1**). `STABILITY_BANDS` holds **16** label words
(`labelBands.js:84`); the pool key collapses them to 6.

**economyStateProse.js** — readings typedef at `economyStateProse.js:858-866`.

| Fact | R/K | Values | Closed? |
|---|---|---|---|
| `readings.impairedInstitution` | R | one institution name | open |
| `settlement.name` | R | proper | open |
| `readings.exportPosture` | K | `{status}` | closed |
| `readings.flowDrift` | K | `{band, tradeDependent}` | closed band |
| `readings.foodBalance` | K | `FoodBalanceView` | mixed |
| `readings.granaryOutlook` | K | `GranaryOutlookView` (carries `season`) | mixed |
| `readings.notableAbsences` | K | `[{key}]` | open list |
| `settlement.config` | K | world config | mixed |
| `settlement.economicState` | K | includes `economicComplexity` ∈ **11** producer strings (`COMPLEXITY_LABEL`, `labelBands.js:130`) → **8** distinct band words (`COMPLEXITY_BAND_BY_LABEL`, :149) → **11** bare-common fills (`COMPLEXITY_NOUN`, `economyStateProse.js:211`) | **CLOSED (11)** |
| `settlement.economicViability` | K | `{viable}` boolean | **CLOSED (2)** |
| `settlement.resourceAnalysis` | K | chains, raw resources, final products | open |
| `settlement.tier` | K | tier enum | closed |

**defenseStateProse.js** — no readings parameter; every fact is a `settlement.*` read.

| Fact | R/K | Notes |
|---|---|---|
| `settlement.name` | R | the only rendered fact |
| `settlement.config` | K | `config.monsterThreat` feeds `wallRationalePoolKey` and `charterPoolKey` |
| `settlement.defenseProfile` | K | `walls.present`, `garrison`, `militia`, `readiness.label` (6), `economicGates.military`, `magicDependency`, `navy`, `port`, `blockaded`, `perimeter`, `force` |
| `settlement.economicState` | K | granary, port, tradeAccess |
| `settlement.economicViability` | K | `viable` boolean |
| `settlement.powerStructure` | K | `government` (the `{seat}` fill), `criminalCaptureState` |
| `settlement.resourceAnalysis` | K | active chains → `namedMagicChainGood` |
| `settlement.stress` | K | `activeDefenceStress` |
| `settlement.tier` | K | tier enum |

**stressorsStateProse.js** — readings typedef at `stressorsStateProse.js:448-450`.

| Fact | R/K | Values |
|---|---|---|
| `settlement.name` | R | proper |
| `readings.banners` | K | crisis banner list → arity + framing keys |
| `readings.conditions` | K | `[{…}]`; only the FIRST is described (`stressorsStateProse.js:441-443`). DS-CND-1's 18 keys measure the space: SEVERITY {low, medium, high, critical} (**4**), DIRECTION {worsening, stable/flat, easing} (**3**), ARCHETYPE {reconstruction, boom, flourishing} (**3**), PROVENANCE {present, absent} (**2**), DURATION {inside wind-down} (**1**), FAMILY {acute crisis, regional transmission, war layer aggressor, occupation layer, recovery} (**5**) |
| `readings.worldStressor` | K | `WorldStressorView` → lifecycle + origin keys |

**warFaithStateProse.js** — `WarFaithReadings` typedef; bag at `warFaithStateProse.js:788`.

| Fact | R/K | Values |
|---|---|---|
| `readings.war` | R | fills `{counterpart}` (only when the reading names EXACTLY ONE opposing town — `warFaithStateProse.js:790-794`) and `{term}` |
| `settlement.name` | R | proper |
| `readings.faith` | K | patron `rankAxis` {major, minor, cult} (**3**), `cults[]` present (**1**), piety `band` {devout, faithful, observant, lukewarm, secular} (**5**), piety `trend` {rising, falling, steady} (**3**), `ranks`/standings (**3** shapes), sink (**2**), mandate (**3**), `hasEmbed && !live` (**1**) — DS-FTH-1's 21 pool keys |
| `readings.hasPatron` | K | boolean |
| `readings.patronFallCause` | K | cause enum |
| `readings.settlementId` | K | id (used to orient treaty documents, never printed) |

---

## 3. TABLE B — THE COMPOSED FILL (the bag), PER BLOCK — AND A CORRECTION TO THE INSTRUMENT

### 3.1 ⛔ THE INSTRUMENT'S BAG RESOLVER RESOLVES A BAG NAME TO THE FILE'S **FIRST** DECLARATION

`skepINSTR/tests/helpers/dossierComposedFill.js:159 resolveBag` finds a bag by
``new RegExp(`\\bconst\\s+${name}\\s*=`).exec(src)`` — the **first** match in the file,
regardless of which function the call site is in. Four composers declare `const slots` more
than once (executed grep):

| Composer | `const slots` declarations |
|---|---|
| defenseStateProse.js | **9** — lines 393, 547, 656, 776, 892, 1053, 1087, 1271, 1419 |
| powerStateProse.js | **2** — lines 633, 867 (+ `stabilitySlots` 868) |
| stressorsStateProse.js | 2 — lines 458, 508 (both `{settlement}` only; no effect) |
| general / economy / warFaith | 1 each (1707 / 897 / 788) |

So every defense site was credited with line 393's bag (`{settlement}` only) and DS-POW-1
with line 633's (`{settlement, faction, npc}`). **Both are wrong.** Read from source:

| Block | site | bag const | TRUE bag | instrument said |
|---|---|---|---|---|
| DS-DEF-4 | `defenseStateProse.js:663` | :656 | `settlement, seat` | `settlement` |
| DS-DEF-11 | :789 | :776 | `settlement, defwork` | `settlement` |
| DS-DEF-9 | :1429 | :1419 | `settlement, good` | `settlement` |
| DS-POW-1 | `powerStateProse.js:872` | :867 | `settlement, seat` | `settlement, faction, npc` |
| DS-POW-2 | :876 | :868 `stabilitySlots` | `settlement, faction` | correct |

The composer's own source states the DS-POW-1/DS-POW-2 split explicitly and gives the reason
— `{seat}` is the governing BODY in DS-POW-1 and a PLACE (the hall) in DS-POW-2, and one fill
cannot serve both (`powerStateProse.js:854-865`, which also records "keeps 21 of 31" as a
measured consequence). The instrument's number contradicted the source's own measurement,
which is how the bug surfaced.

### 3.2 THE CORRECTED PER-BLOCK BAG (executed: `bag-nearest.mjs`, then `dead-corrected.mjs`)

53 of 68 blocks are reached by a `readStateProse` call site. **15 are not.**

| Block | pools | variants | declared slots (union over its variants) | COMPOSER BAG (corrected) | unreachable variants |
|---|---|---|---|---|---|
| DS-CND-1 | 18 | 54 | reason, settlement, timeband_age | settlement | 4 |
| DS-DEF-1 | 8 | 26 | settlement | settlement | 0 |
| DS-DEF-2 | 26 | 78 | settlement | settlement | 0 |
| DS-DEF-3 | 7 | 23 | settlement | settlement | 0 |
| DS-DEF-4 | 9 | 28 | seat, settlement | **seat, settlement** | 0 |
| DS-DEF-5 | 11 | 33 | settlement | settlement | 0 |
| DS-DEF-6 | 21 | 64 | institution, route, settlement | settlement | 2 |
| DS-DEF-8 | 4 | 12 | settlement | settlement | 0 |
| DS-DEF-9 | 3 | 10 | good, settlement | **good, settlement** | 0 |
| DS-DEF-11 | 5 | 12 | defwork, settlement | **defwork, settlement** | 0 |
| DS-ECO-1 | 5 | 15 | access, complexity, settlement | access, complexity, good, season, settlement | 0 |
| DS-ECO-2 | 7 | 21 | season, settlement | " | 0 |
| DS-ECO-3 | 5 | 18 | settlement | " | 0 |
| DS-ECO-6 | 3 | 12 | faction, settlement | " | 1 |
| DS-ECO-8 | 7 | 21 | settlement | " | 0 |
| DS-ECO-9 | 8 | 24 | settlement | " | 0 |
| DS-ECO-10 | 10 | 30 | access, good, settlement | " | 0 |
| DS-ECO-11 | 17 | 53 | chain, good, institution, resource, settlement | " + institution, resource (`exploitSlots`, `economyStateProse.js:978`) | 1 (`chain`) |
| DS-ECO-12 | 10 | 30 | faction, good, settlement | " | 1 (`faction`) |
| DS-SUP-3 | 7 | 21 | institution, settlement | " + institution (`impairedSlots`, :989) | 0 |
| DS-FTH-1 | 21 | 63 | creed, rival_creed, settlement | counterpart, creed, rival_creed, settlement, term | 0 |
| DS-FTH-2 | 2 | 8 | settlement | " | 0 |
| DS-FTH-3 | 25 | 75 | creed, institution, rival_creed, season, settlement, timeband_span | " | 6 |
| DS-GEN-2 | 3 | 15 | faction, faction2, issue, settlement, stakes | faction, faction2, issue, settlement, stakes | 0 |
| DS-GEN-3 | 42 | 128 | settlement | settlement | 0 |
| DS-GEN-5 | 5 | 20 | settlement | settlement | 0 |
| DS-GEN-6 | 9 | 32 | settlement | settlement | 0 |
| DS-GEN-7 | 8 | 30 | band, faction, govFaction, settlement | govFaction, settlement | 4 |
| DS-GEN-8 | 6 | 21 | band, resource, ruin, settlement, steading, timeband_age, timeband_since | ruin, settlement, steading, timeband_age, timeband_since | 5 |
| DS-GEN-9 | 15 | 50 | band, challenge, event, founder, reason, settlement, timeband_age, timeband_since | event, settlement, timeband_age, timeband_since | 5 |
| DS-GEN-11 | 6 | 21 | band, settlement | settlement | 2 |
| DS-GEN-12 | 5 | 16 | settlement | settlement | 0 |
| DS-GEN-13 | 4 | 12 | good, settlement | settlement | 1 |
| DS-GEN-14 | 3 | 8 | settlement, timeband_age | settlement | 1 |
| DS-GEN-16 | 5 | 12 | calamity, settlement, timeband_age | calamity, settlement, timeband_age | 0 |
| DS-GEN-17 | 5 | 11 | settlement | settlement | 0 |
| DS-GEN-18 | 4 | 10 | good, institution, resource, settlement | good, institution, resource, settlement | 0 |
| DS-HK-1 | 11 | 44 | faction, faction2, governing, settlement | governing, settlement | 3 |
| DS-POP-3 | 5 | 13 | settlement | settlement | 0 |
| DS-POW-1 | 11 | 41 | seat, settlement | **seat, settlement** | **0** |
| DS-POW-2 | 9 | 31 | faction, seat, settlement | faction, settlement | **10** (source-declared) |
| DS-POW-3 | 5 | 16 | faction, npc, settlement | faction, npc, settlement | 0 |
| DS-POW-4 | 9 | 29 | counterpart, faction, seat, settlement, timeband_age | counterpart, faction, seat, settlement | 1 (source-declared) |
| DS-POW-5 | 12 | 40 | good, institution, route, seat, settlement | seat, settlement | 3 (source-declared) |
| DS-POW-6 | 13 | 39 | faction, seat, settlement | faction, seat, settlement | 0 |
| DS-POW-7 | 20 | 60 | counterpart, faction, seat, settlement | counterpart, faction, seat, settlement | 0 |
| DS-REL-1 | 10 | 30 | counterpart, faction, npc, settlement | counterpart, faction, npc, settlement | 0 |
| DS-REL-2 | 3 | 12 | band, settlement | settlement | 3 |
| DS-STR-1 | 17 | 96 | band, season, settlement | settlement | 2 |
| DS-STR-2 | 32 | 96 | counterpart, reason, settlement | settlement | 4 |
| DS-WAR-1 | 21 | 66 | counterpart, settlement | counterpart, creed, rival_creed, settlement, term | 0 |
| DS-WAR-2 | 28 | 83 | counterpart, settlement, timeband_since, timeband_span | " | 3 |
| DS-WAR-3 | 1 | 5 | settlement | " | 0 |
| **15 with NO call site** | | **448 variants** | | — | not reachable through any composer |

The fifteen unwired blocks: `DS-DEF-7` (34), `DS-DEF-10` (63), `DS-ECO-4` (16), `DS-ECO-5`
(21), `DS-ECO-7` (8), `DS-FTH-4` (10), `DS-GEN-1` (50), `DS-GEN-10` (15), `DS-GEN-15` (12),
`DS-POP-1` (51), `DS-POP-2` (21), `DS-SUP-1` (18), `DS-SUP-2` (21), `DS-WAR-4` (15),
`DS-WAR-5` (93). At least one (`DS-DEF-7`) is DECLARED DARK in the composer's own source
(`defenseStateProse.js:1435`). The rest are the wiring census's business (ARCH-BRIEF
§3) and I do **not** assert here that any of them is a defect.

### 3.3 THE HEADLINE ARITHMETIC OF REACH (executed, `dead-corrected.mjs`)

```
CORRECTED: wired blocks 53 · reachable 1756 · UNREACHABLE 62
           in the 15 unwired blocks 448 · total 2266
```

**1,756 of 2,266 authored variants (77.5%) are reachable through a shipped composer today.**
62 are authored-but-unreachable inside a wired block (a slot the bag never offers); 448 sit
in blocks no composer calls. The uncorrected instrument reported 114 unreachable — the 52
difference is entirely the same-name shadowing above.

**The single biggest cause of unreachability is `{band}`, and it is a LAW, not a gap.**
`{band}` is declared `RESERVED` in the annex's slot register, and
`scripts/lib/dossier-slot-shapes.mjs:215` returns `RESERVED-SLOT-HAS-NO-DECLARABLE-FILL` for
any attempt to fill it: "one name for six incompatible roles" (:33-39). Seven blocks name
`{band}` and every variant that does is permanently dropped by anchored liveness — recorded
in the composer itself at `generalStateProse.js:123-129`.

---

## 4. THE SLOT CENSUS — THREE DIFFERENT "TWENTY" NUMBERS, RECONCILED

There are **three** distinct censuses in circulation and they measure three different things.
The design must say which one it means every time.

| Census | Measures | Number | Provenance |
|---|---|---|---|
| **Declared** | blocks whose VARIANT TEXT names only `{settlement}` | **20** | `s12-sitting/verify/slots.mjs`, executed here; §912 sitting A12 |
| **Bag (instrument)** | blocks whose composer bag offers only `settlement` | **22** | `receipt-instr-912.md:670`, reproduced here |
| **Bag (corrected)** | same, with the shadowing bug fixed | **19** | `arch-prose/dead-corrected.mjs`, executed here |

**Executed slot census** (`node s12-sitting/verify/slots.mjs`): `blocks 68 pools 708 variants
2266`; `{settlement}` 68, `{faction}` 13, `{institution}` 10, `{counterpart}` 10, `{good}`
10, `{seat}` 7, `{band}` 7, `{timeband_age}` 7, `{timeband_since}` 6, `{resource}` 5,
`{reason}` 4, `{season}` 4, `{chain}` 4, `{faction2}` 3, `{timeband_span}` 3, `{creed}` 3,
`{route}` 2, `{access}` 2, `{npc}` 2, `{calamity}` 2, `{rival_creed}` 2, and eleven slots on
exactly one block each (`defwork, complexity, issue, stakes, govFaction, ruin, steading,
founder, challenge, event, governing, term`). **48 of 68 blocks name a slot beyond
`{settlement}`; 20 do not.**

**THE TWENTY (declared):** DS-DEF-1 · DS-DEF-2 · DS-DEF-3 · DS-DEF-5 · DS-DEF-8 · DS-ECO-3 ·
DS-ECO-7 · DS-ECO-8 · DS-ECO-9 · DS-FTH-2 · DS-GEN-10 · DS-GEN-12 · DS-GEN-17 · DS-GEN-3 ·
DS-GEN-5 · DS-GEN-6 · DS-POP-2 · DS-POP-3 · DS-WAR-3 · DS-WAR-4.

**THE NINETEEN (corrected bag):** DS-CND-1 · DS-DEF-1 · DS-DEF-2 · DS-DEF-3 · DS-DEF-5 ·
DS-DEF-6 · DS-DEF-8 · DS-GEN-3 · DS-GEN-5 · DS-GEN-6 · DS-GEN-11 · DS-GEN-12 · DS-GEN-13 ·
DS-GEN-14 · DS-GEN-17 · DS-POP-3 · DS-REL-2 · DS-STR-1 · DS-STR-2.

**Only ELEVEN blocks are in both** (DS-DEF-1, 2, 3, 5, 8; DS-GEN-3, 5, 6, 12, 17; DS-POP-3):
those are the blocks that are flat *and* have no unspent slot to fill. **FIVE blocks are
declared-flat but sit in a composer that already offers more** — DS-ECO-3, DS-ECO-8,
DS-ECO-9, DS-FTH-2, DS-WAR-3 (the economy and warFaith desks pass a five-slot bag to every
block they serve); those are the cheapest authoring targets in the corpus, because the fill
already arrives and only the sentence is missing. Four more are declared-flat inside blocks
no composer calls at all (DS-ECO-7, DS-GEN-10, DS-POP-2, DS-WAR-4), where a sentence buys
nothing until the wiring lands. **Eight blocks are bag-flat but their variants already reach further**
(DS-CND-1, DS-DEF-6, DS-GEN-11, DS-GEN-13, DS-GEN-14, DS-REL-2, DS-STR-1, DS-STR-2): there
the authored prose is ahead of the wiring, and the cure is a composer line, not a sentence.

### 4.1 THE SLOT SHAPE REGISTER — what a fill may grammatically be

Parsed from the authored annex by the product's own parser
(`node arch-prose/slot-shapes.mjs` → `scripts/lib/dossier-slot-shapes.mjs:88 parseSlotShapes`
over `laneB6/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`). 31 exact rows plus one prefix
family:

| Shape | n | Slots |
|---|---|---|
| `proper` | 17 | controller, counterpart, creed, event, faction, faction2, govFaction, governing, institution, npc, rival_creed, route, ruin, seat, settlement, steading, term |
| `bare-common` | 9 | access, calamity, chain, complexity, defwork, good, reason, resource, season |
| `phrase` | 4 | challenge, founder, issue, stakes |
| `RESERVED` | 1 | **band** — no declarable fill, ever |
| prefix family | — | `timeband_*` → `phrase` (three forms in use: `_age`, `_since`, `_span`) |

`controller` is registered but named by no shipped variant. Each composer mirrors its own
subset in `SLOT_FILL_SHAPES` (general :101, power :148, economy :235, defense :121,
stressors :70, warFaith :138) and declares its literal fill tables in `SLOT_FILL_TABLES`
(only economy owns any: `ACCESS_NOUN` 5 entries :172, `COMPLEXITY_NOUN` 11 entries :211).

---

## 5. MANY-VALUED FACTS (BANDS) VS FEW-VALUED (BOOLEANS) — the arithmetic inputs

### 5.1 The key functions and how many facts each reads

**EXECUTED** (`arch-prose/poolkey-fan.mjs`): **118** `*PoolKey` functions across the six
composers (general 34, power 15, economy 16, defense 23, stressors 10, warFaith 20).

```
reads 1 fact:  91 functions
reads 2 facts: 18 functions
reads 3 facts:  8 functions
reads 4 facts:  1 function
```

This reproduces the ARCH-BRIEF's figure exactly, from my own run. **The one four-fact key is
the owner's own walls example:** `defenseStateProse.js:747
wallRationalePoolKey(walls, monsterThreat, militaryGate, tier)` → 5 pools on DS-DEF-11
(`WALLED-THREATENED, WALLED-QUIET, WALLED-STRAINED, UNWALLED-SMALL, UNWALLED-LARGE`).

The eight three-fact keys — the existing precedent for the owner's "more specific with every
relevant combination":

| Function | file:line | facts |
|---|---|---|
| `beastsRowPoolKey` | defense:283 | monsterThreat × perimeter × force |
| `invasionRowPoolKey` | defense:309 | walls × garrison × militia |
| `disasterRowPoolKey` | defense:359 | granary × hospital × church |
| `supplyLogisticsPoolKey` | defense:1213 | granary × port × tradeAccess |
| `navalDefensePoolKey` | defense:1244 | navy × port × blockaded |
| `mobilizationPoolKey` | warFaith | postureState × ticksToDeploy × covert |
| `warStatusPoolKey` | warFaith | status × occupation × otherwiseAtWar |
| `dormantNotePoolKey` | warFaith | warBeat × anyTreaty × faithHidden |

DS-DEF-2's 26 pool keys are the model of what "authored combination" costs today: five
independent lenses, each already a 2–3-fact conjunction spelled in English —
`Invasion & War: walls AND professional garrison`, `walls with citizen militia`, `walls with
NO force`, `force with NO walls`, `militia only`, `neither walls nor force` (**6 cells from
3 booleans**, the full 2×3 partition minus the impossible). Each cell holds exactly 3
variants. **This is the exponential the owner named, already paid for once by hand.**

### 5.2 MANY vs FEW — the classification the combination arithmetic depends on

**MANY-VALUED (bands, ≥4 values; the multiplicative dimension):**

| Fact | values | source |
|---|---|---|
| `safetyLabel` | **14** head words | `labelBands.js:71 SAFETY_BANDS` (collapsed to 3 in DS-GEN-3) |
| `powerStructure.stability` | **16** label words | `labelBands.js:84 STABILITY_BANDS` (collapsed to 6 in DS-POW-2) |
| `economicComplexity` | **11** producer strings / 8 band words / 11 fills | `labelBands.js:130`, `:149`, `economyStateProse.js:211` |
| `prosperity` | **7** (DS-ECO-8) or **5** compound (DS-GEN-3) | corpus pool keys |
| `scores.<axis>` × 5 axes | **4** each (STRONG/ADEQUATE/WEAK/CRITICAL) | DS-GEN-3 pool keys |
| `readiness.label` | **6** | DS-GEN-3 pool keys |
| `foodSecurity.label` | **6** | DS-GEN-3 pool keys |
| condition SEVERITY | **4** | DS-CND-1 pool keys |
| condition FAMILY | **5** | DS-CND-1 pool keys |
| piety band | **5** | DS-FTH-1 pool keys |
| legitimacy label | **5** | DS-POW-1 pool keys |
| population band (`quantityWords`) | **8** | `entryLexicons.js:33 BAND_PHRASES` |
| `tradeRouteAccess` | **5** | `economyStateProse.js:172 ACCESS_NOUN` |

**FEW-VALUED (2–3; the additive/modifier dimension):**

| Fact | values | source |
|---|---|---|
| `economicViability.viable` | 2 (boolean) | DS-GEN-3 pool keys |
| `walls.present`, `garrison`, `militia`, `port`, `navy`, `blockaded`, `court`, `prison`, `granary`, `hospital`, `church` | 2 each | the three-fact defense keys above |
| `isEntrepot`, `hasPatron`, `tradeDependent`, `governanceFractured` | 2 each | readings typedefs |
| piety `trend` | 3 (rising/falling/steady) | DS-FTH-1 |
| condition DIRECTION | 3 (worsening/stable/easing) | DS-CND-1 |
| patron `rankAxis` | 3 (major/minor/cult) | DS-FTH-1 |
| governing share | 2 (DOMINANT/NARROW) | DS-POW-2 |
| **demoted STATE dimensions** | `severity` 3, `deficit` 2, `anchor` 2 | `stateProseKernel.js:192 STATE_MARK_DIMENSIONS` |

**THE DEMOTED DIMENSIONS ARE A FOURTH AXIS THE DESIGN MUST NOT MISS.** Three blocks
(DS-GEN-1, DS-GEN-6, DS-GEN-9) carry a STATE-KEY with more dimensions than a pool key can
hold; the surplus is demoted into per-variant `marks` and gated FAIL-CLOSED
(`stateProseKernel.js:247-261`). Measured marks over the shipped corpus (executed,
`block-census.mjs`) — the mark vocabulary is live and the arm is not decorative. A composed
model that attaches modifiers must decide whether a modifier can carry a dimension mark, and
whether an unanswered dimension silences the modifier or the whole composition.

### 5.3 The corpus's current shape, executed

```
blocks 68 · pools 708 · variants 2266 · mean 3.20 variants/pool
variants-per-pool histogram:  2 → 33 pools · 3 → 547 · 4 → 96 · 5 → 17 · 6 → 15
angle → variants: ledger 681 · street 609 · visitor 403 · unfolding 230 ·
                  counterforce 170 · threshold 96 · elder 70 · canonical 7
```

Every figure here reproduces the ARCH-BRIEF's, from my own run. The eight angles sum to
2,266 — **every variant carries an angle; none is angle-less** (executed,
`arch-prose/angles.mjs`). `canonical` is a real R1 angle held by exactly 7 variants.

The largest blocks by spine count: DS-GEN-3 (42 pools / 128 variants), DS-STR-2 (32/96),
DS-WAR-5 (31/93, unwired), DS-WAR-2 (28/83), DS-DEF-2 (26/78), DS-FTH-3 (25/75). DS-GEN-3's
42 = 20 (5 axes × 4 bands) + 5 prosperity + 3 safety buckets + 2 viability + 6 readiness +
6 food security — **six independent facts, each drawn as its own rung, never combined.** That
is the cleanest place in the corpus to demonstrate a spine+modifier lift.

---

## 6. THE LICENSING SURFACES — what a piece may CLAIM, and who says so

The composed model's LICENSING bound (ARCH-BRIEF §"BOUNDS") is enforced by four published
structures. All four are report-or-lint side; none runs at the draw.

### 6.1 The derived institution table — `skepINSTR/src/domain/institutions/institutionTable.js`

`institutionTableOf(settlement, world)` (:201) → `{settlement, rows[], columns{}}`, eleven
columns (`TABLE_COLUMNS` :47), **`closed` is a property of the COLUMN, not of the row or the
settlement** (:44-46). The one-line law the file states for itself (:8-9): *a row licenses a
NOUN and a PREDICATE; only a CLOSED COLUMN licenses a QUANTIFIER.*

| Column | closed | basis (source line) |
|---|---|---|
| institution | **true** | the live roster IS the town's full set (:250-255) |
| office | false | the NPC roster is a SAMPLE, so a town has offices it does not name (:256-261) |
| holderRole | false | no typed NPC→institution edge; a name-regex licenses the ROLE NOUN only (:262-266) |
| whatItCounts | **true** | instantiated `availableServices` rows whose name is a duty kind (:267-273) |
| whoIsCounted | **FALSE FOREVER** | population is a NUMBER; no roll of persons exists anywhere; nothing to close (:21-27, :274-280) |
| whoIsExempt | conditional | true only where a treaty TOLL-EXEMPTION term exists; `nullEverywhere` otherwise (:281-290) |
| whatItDoes | **true** | instantiated service rows + catalog desc (:291-295) |
| whatItDoesNotDo | **true** | status ∈ {ruined, removed, destroyed, remnant}, `_worldPulseInactive`, typed impairments (:296-300) |
| provenance | **true** | `FOUNDED{year,tick} | FOUNDED_UNDATED | PRE_SEED` — absence is the typed value (:301-305) |
| sustainer | false | carried whole from NL-4, not re-measured (:306-310) |

Two hazards the design inherits: the field is **`availableServices`, not `services`** —
`settlement.services` is empty on every generated settlement (measured, :133-139) — and the
duty filter `DUTY_SERVICE_KINDS` (:74) deliberately excludes bare `custom` because
"Custom enchanting" is a craft, not a customs duty (:68-71). Nineteen duty kinds were
measured over 702 service rows on twelve settlements (:64-67).

### 6.2 The typed ground the walker judges against — `skepINSTR/src/domain/prose/entryGround.js`

Two grounds, and the split is exactly the split the composed model needs:

- `estateGround({officeRoster})` (:48) — what is true of **every** settlement the product can
  generate. `whoIsCounted` open, `whoIsExempt` `nullEverywhere: true`, `office` = the union of
  role nouns, and `institution` / `whatItCounts` supplied as `values: null` so their limbs
  declare themselves **NOT-EXECUTABLE** rather than answering `[]` (:19-22). The roster is an
  INPUT, never an import — the leaf stays headless (:24-28). It **throws** on an empty roster
  (:51).
- `settlementGround(table)` (:97) — one town's table with every column filled; every limb
  runs. Throws when handed no table (:99).
- `withEntryContext(base, per)` (:82) adds `siblings`, `fill` (the block's composed fill), and
  `eventProvenance`.

**A corpus VARIANT is not bound to a settlement** (:7-9). That is the constitutional reason
the composed model cannot license a piece per-town at authoring time: a spine or modifier is
entitled by the ESTATE ground, and only a rendered town can be judged against the settlement
ground.

### 6.3 The published detector lexicons — `skepINSTR/src/domain/prose/entryLexicons.js`

Nothing here judges; every verdict is the walker's and names the column it consulted (:11-14).
Sizes executed (`arch-prose/vocab-sizes.mjs`):

| Lexicon | line | n | What it detects |
|---|---|---|---|
| `BAND_PHRASES` | 33 | 8 | the closed quantity vocabulary (transcribed from `QUANTITY_BANDS` + `nobody`; the walker pins the copy, :25-30) |
| `AUTHORED_MAGNITUDES` | 52 | 13 | magnitude words that are not a figure |
| `COUNT_NOUNS` | 62 | 22 | nouns a band may govern (souls → households is a CLAIM change) |
| `CARDINAL_WORDS` | 76 | 29 | a run = a FIGURE; `one` excluded by construction |
| `QUANTIFIERS` | 93 | 15 | judged against the column's `closed` flag; `nobody`/`no one` deliberately absent |
| `DUTY_PREDICATES` | 110 | 31 | inflected only — bare stems false-positived on "since the last muster" |
| `DUTY_STEM_NOUNS` | 129 | 12 | NOTE, never FAIL |
| `EXEMPTION_LEMMAS` | 143 | 16 | no column behind any of them until an exemption writer lands (owner-gated) |
| `AMBIGUOUS_EXEMPTION_LEMMAS` | 161 | 12 | fire only beside a duty word (measured false positives) |
| `DUTY_CONTEXT_WORDS` | 169 | 22 | the duty context the ambiguous set needs |
| `SUPPLY_CLAIM_LEXICONS` | 187 | processing 14, route 11 | **verdict is WITHHELD, not FAIL** — a per-settlement chain read |
| `OFFICE_NOUN_CANDIDATES` | 210 | 37 | `prior` deliberately absent (adjective every time in this estate) |
| `RELATION_LEMMAS` | 232 | 20 | a relation needs a JOIN FIELD; two names on one roll are two names |
| `PROVENANCE_LEXICONS` | 246 | capacity 10, spatial 10, actor 13, dated 5 | the lexical half of C3; the semantic half is WITHHELD |
| `SMALL_PARTICULARS` | 276 | 8 | a WHITELIST OF KINDS, never a tolerance number |
| `BAND_EQUIVALENCE` | 287 | 8 classes | two siblings in one class do NOT contradict |
| `CLOSE_KINDS` | 312 | 4 | civicNoun / standingFact / pronoun / abstraction — distribution reported per pool |
| `CONTRAST_SHAPES` | 304 | regex | extended by the taste sample's two blind spots |
| `SPECIFICATIONAL_COPULA` | 332 | regex | read against `closed(column)` |
| `RECORD_CITATION` | 335 | regex | fault 25 |
| `FUTURE_INDICATIVE` | 338 | regex | STATE never FATE |

**The whole file is import-free and is neither imported by nor imports the kernel** (:16-18) —
the stated reason is THE PROMISE: an installed world's draws must not move because a lint
walker landed. **The composed model must keep that fence: no checker may become a draw
input.**

### 6.4 The presence measure — `skepINSTR/src/domain/prose/presenceMeasure.js`

`presenceOf(paragraphs)` (:103) → `{words, paragraphs, sensoryNounsPerHundredWords,
texturedParagraphShare, senseShares, senseSpreadEntropy, hits}`. **IT NEVER GATES** (:6-10),
and the file states the cure for a flat pool is an AUTHORING act on a new pool key, never a
rewrite that buys a fact.

- Line 1: sensory nouns per hundred words, from the published `SENSORY_NOUNS` (:37).
- Line 2: share of paragraphs holding a licensed texture device — `hasTextureDevice` (:87)
  **strips `{slot}` markers first: a proper-noun slot is a name, not a texture** (:82-85). This
  is directly load-bearing for the composed model: adding `{settlement}` to a spine buys zero
  texture by this measure.
- Line 3: the spread across senses with entropy, so "concrete in SIGHT ALONE" is visible.

**⚠ A MEASURED CORRECTION TO THE RECEIPT.** `receipt-instr-912.md:614-616` says the lexicon
is "177 nouns in five buckets, each noun in exactly one". Executed
(`arch-prose/vocab-sizes.mjs`, `arch-prose/dupes.mjs`): **169 listed entries, 166 distinct
nouns** — sight 82, hearing 26, smell 17, touch 25, taste 19 — and **three nouns appear in
two buckets**: `smoke` (sight+smell), `stone` (sight+touch), `mud` (sight+touch). The source's
own JSDoc (:70-72) documents the collision and the `.reverse()` in `SENSE_OF_NOUN` (:74)
correctly resolves each to the FIRST declared bucket (all three → `sight`). So the mechanism
is right and both the receipt's count and its "exactly one bucket" phrasing are wrong. The
R1 readings that depend on this lexicon (sensory/100w 1.198, spread 0.79 bits at 86% sight)
are computed over a 166-noun list, not a 177-noun one.

### 6.5 The corpus loaders — `skepINSTR/tests/helpers/dossierCorpus.js`

`loadStateLeaves()` imports the six leaves as MODULES so `marks`, `angle` and `slots` are read
off objects and never regexed out of text (:69-72). Entry shape, carried verbatim from
`check-pair.mjs:22` (:12-16):

```
{ id, text, block, pool, poolId, idx, angle, marks, slots, file, line, register, siblings }
```

`siblings` = the sibling POOL KEYS of the same block; the sibling VARIANTS of one cell are
assembled by `poolCells()`. Every loader **throws** on zero rows (`refuseEmpty` :62) — the
silent-extractor class the estate already burned. The annex is read by RAW BYTES rather than
the numbered-line join, which truncates 13 wrapped rows (:22-24).

Registers with loaders: R1 state leaves, R2 causal, R5 crier voice (`newsVoice.js`,
`newsBody.js`), R14-class faction dynamics (`src/generators/factionDynamics.js`), plus the
authored annex `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`.

---

## 7. THE HARD REFUSALS — facts the prose can NEVER read as words

These are laws, not gaps. Each has an executed or cited ground.

| Refusal | Ground |
|---|---|
| **A totality over PERSONS** ("every household", "the only person") | `whoIsCounted.closed` is false on every settlement forever — the population is a NUMBER, no roll of persons exists (`institutionTable.js:21-27`, `entryGround.js:12-15`) |
| **An exemption from a duty** | `whoIsExempt` is `nullEverywhere`; no exemption writer exists on any settlement path; the one typed exemption family is a treaty TOLL term between settlements (`institutionTable.js:286-289`) |
| **A DIGIT, or a numeric slot fill** | `isFilled` rejects numbers on purpose (`stateProseKernel.js:130-137`); §0d bans digits from dossier-state prose |
| **A `{band}` fill** | `RESERVED-SLOT-HAS-NO-DECLARABLE-FILL` (`scripts/lib/dossier-slot-shapes.mjs:215`, :33-39) — one name for six incompatible roles |
| **"the holder of THIS institution"** | no typed NPC→institution edge exists; the join is inferred by name and licenses the ROLE NOUN only (`institutionTable.js:225-228`) |
| **A relation between two named institutions/factions** | licensed only where a JOIN FIELD holds it; two names on one roll are two names (`entryLexicons.js:225-231`) |
| **A processing step or route direction on a good** | needs a `supplyChainState` chain row; the walker WITHHOLDS rather than fails, because it is a per-settlement read (`entryLexicons.js:175-185`) |
| **A future indicative** | STATE never FATE (`entryLexicons.js:337-338`) |
| **A covert fact to a player** | `variantIsAudible` truncates `dm-only` to SILENCE, and an unrecognised audience reads as the player's (`stateProseKernel.js:159-163`) |
| **A sentence over an unanswered demoted dimension** | `eligibleVariants` returns `[]` — a wrong sentence is worse than no sentence (`stateProseKernel.js:254-261`) |
| **A `{faction}` fill on the economy desk** | the raw roster carries no `archetype`; that field exists only on the derived `FactionProfile`, and a desk never derives what a canonical reader owns (`economyStateProse.js:908-921`) |
| **A `{counterpart}` fill on a coalition war** | naming the first of several would be the page picking a winner by array order (`warFaithStateProse.js:790-794`) |
| **A `{seat}` fill on DS-POW-2** | no hall-name producer exists; `{seat}` there is a PLACE, not the governing body (`powerStateProse.js:854-865`) |
| **A `{timeband_age}` fill on DS-POW-4** | the desk holds no clock and the only variant that names it sits in a pool this desk never reads (`powerStateProse.js:899-921`) |

---

## 8. WHAT THIS MEANS FOR THE COMPOSED MODEL — the reader's five structural facts

1. **A modifier's cost is a BAG entry, not just a sentence.** 62 authored variants are already
   unreachable because their slot is not in the bag, and eight blocks are flat only because
   nobody wrote for a fill the composer already passes. Every planned modifier needs a named
   home in a specific `const <bag>` object literal and a shape row in the annex register.
2. **The key/word split is the model's real seam.** 59 of 72 facts today reach the reader as
   a CHOICE. A spine keyed on a fact and a modifier keyed on a second fact is exactly the
   shape 26 of the 118 key functions already take by hand (18 two-fact, 8 three-fact) — the
   composed model generalises an existing, shipped pattern rather than introducing one.
3. **The multiplicative dimension is small and named.** Thirteen facts carry ≥4 values;
   everything else is 2–3. Any combination arithmetic must be built on that table (§5.2), not
   on a nominal "68 blocks × N facts".
4. **Determinism is already whole and cheap.** `seed :: blockId :: poolKey` over
   `eligible.length` (`stateProseKernel.js:301-305`). A per-piece draw needs a per-piece
   identity in that key, and any piece identity that changes re-rolls that piece for every
   existing world — the declared TEXT shift.
5. **Licensing has a table, and the table has an honest edge.** The institution table's
   per-column `closed` flags, the estate ground's NOT-EXECUTABLE limbs, and the published
   lexicons are enough to gate a piece's claim at authoring time — but every per-settlement
   claim (chains, joins, holders) is WITHHELD to a refuter by construction, and composition
   cannot buy it back.

---

## 9. OPEN QUESTIONS

1. **The instrument's bag resolver is wrong on two composers and it gates a receipt.**
   `dossierComposedFill.js:159` resolves a bag name to the file's FIRST `const <name> =`.
   Should INSTR-912 be re-cut with a nearest-preceding (or scope-aware) resolver, and does the
   §912.1 "22 settlement-only" row become 19 in the ledger? The corrected list is in §4 above.
   This is a receipt correction, not a product change; whether it re-opens a register door is
   the chair's.
2. **Which of the 15 unwired blocks (448 variants, 19.8% of the corpus) are dead by design and
   which are wiring debt?** Only DS-DEF-7 carries a declared-dark header in the composer I
   read. The wiring census (ARCH-BRIEF §3) is the instrument for this and it is not yet built.
   The composed model's authoring budget is materially different at 1,756 live variants than
   at 2,266.
3. **Is `{band}` permanently refused, or is the composed model the occasion to split it?**
   Seven blocks name it; every such variant is dropped forever. The annex calls it "one name
   for six incompatible roles" — splitting it into six named slots is an annex + projection +
   composer act and would recover authored prose that exists today. Owner-adjacent: it changes
   the persisted annex shape and would be a declared same-seed TEXT shift.
4. **Does a WORDING FAMILY (the owner's ×4) share its parent's slot set, or may faces differ?**
   Anchored liveness is per VARIANT (`variantIsAnchored:146`). If one face names `{seat}` and
   its siblings do not, eligibility differs across the family and the brief's guarantee
   ("every face of a family is ELIGIBLE whenever its parent is") is violated by construction.
   The safe reading is: **a family's four faces must declare an identical slot set.** I have
   not seen that written anywhere and it should be a stated law.
5. **Does the draw key gain a piece identity, and at what cost to THE PROMISE?** If a modifier
   draws with `seed :: blockId :: poolKey :: pieceId`, two modifiers on one block draw
   independently (good), but every existing world's text for that block changes the day the
   first modifier lands (the declared shift). If it draws with the spine's key, the modifier
   is correlated with the spine. The design must choose and say so.
6. **May a modifier or a face carry a demoted STATE dimension mark?** `poolDimensions` is
   derived from the POOL, not the block (`stateProseKernel.js:176-182`), and an unanswered
   dimension zeroes the whole pool. If a composed block's modifier pool carries a mark the
   caller does not answer, does the modifier go silent or does the block?
7. **`powerStateProse.js:148 SLOT_FILL_SHAPES` declares only `settlement` and `seat`, but the
   desk fills `{faction}`, `{npc}` and `{counterpart}` too** (bags at :633, :867, :885, :924,
   :931). Either the register is incomplete or those slots are declared in another leaf's
   register and merged (`mergeSlotShapes`, `dossier-slot-shapes.mjs:151`). I did not resolve
   which. If the register is incomplete, `assertSlotShapesTotal` (:184) is passing on a
   partial ground.
8. **The receipt's sensory-lexicon count (177 / "each noun in exactly one") is wrong (169
   listed, 166 distinct, three duplicated).** Do the R1 presence figures need re-printing with
   the corrected denominator named, and does any authoring target keyed on them move?
9. **`readings.prosperity` has two vocabularies** — 7 keys on DS-ECO-8, 5 compound labels on
   DS-GEN-3. If a spine on one block and a modifier on another are keyed on "the same fact",
   which vocabulary is canonical for the salience scorer?
10. **`canonical` is held by exactly 7 of 2,266 R1 variants.** Which blocks hold them, and is
    an angle at n=7 a real standpoint the composed model must preserve, or a residue? (I did
    not resolve which blocks carry it; every other angle is in the hundreds except `elder` 70
    and `threshold` 96.) The salience scorer's angle handling depends on the answer.
