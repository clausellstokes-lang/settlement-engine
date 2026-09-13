# READ-KERNEL — the composition kernel and the render path
**Reader lens (Opus, Seat: Opus 5 — Fable-unvalidated) · 2026-09-07**

Product tip read: `$SC/laneB6` at `3b1c0eaa5` (`git log --oneline -1` run in the dock).
Instruments dock `$SC/skepINSTR` was **not needed** for this lens and was not read.
Every figure below is either (a) the output of a command I ran in `$SC/laneB6` and saw, or
(b) cited to `file:line`. Where a figure is a build artefact rather than source, it says so.

Paths are relative to `$SC/laneB6` =
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneB6`.

---

## §0 — The subsystem in one diagram

```
  live settlement record + canonical READINGS (handed in by the caller)
            │
            ▼
  DESK (six of them: economy/power/stressors/warFaith/defense/general)
    ├─ a POOL-KEY function per LENS            118 functions; 91 read 1 fact, 18 two, 8 three, 1 four
    ├─ a SLOT BAG (per desk, sometimes per lens)
    └─ (sometimes) a demoted DIMENSION answer
            │  readStateProse(CORPUS, blockId, poolKey, {slots, seed, audience, dimensions})
            ▼
  KERNEL  stateProseKernel.js  — the ONLY place a pool becomes a sentence
    ├─ eligibleVariants()  four filters (dimension / audience / anchored-slots / dimension-value)
    ├─ drawVariant()       avalanche32(fnv1a32(`seed::blockId::poolKey`)) % eligible.length
    └─ fillSlots()         all-or-nothing substitution; unfilled ⇒ null
            │  {blockId, poolKey, angle, text}
            ▼
  legibilityRung(glance, line, detail)  → {glance, sentence, detail[], provenance}
            │
            ▼
  MOUNT REGISTRY  dossierMounts.js  — drawnAtMount(mount, rung)
    56 rows · 52 `sentence` · 4 `glance` · 15 blocks unmounted
            │  a `glance` row strips .sentence and .provenance
            ▼
  COMPONENT  renders each surviving sentence as its OWN <p>. No connective anywhere.
```

---

## §1 — The composition kernel, function by function

All in `src/domain/display/stateProse/stateProseKernel.js` (357 lines, zero imports, pure leaf).

| # | Export | Line | What it does | Failure mode |
|---|---|---|---|---|
| 1 | `fnv1a32(str)` | :92 | FNV-1a 32-bit over the draw key | private |
| 2 | `avalanche32(h)` | :107 | murmur3 `fmix32` finalizer over the FNV digest | private |
| 3 | `AUDIENCE_DM` / `AUDIENCE_PLAYER` | :118 / :120 | the two audiences | — |
| 4 | `SOLE_POOL = '*'` | :126 | reserved pool key for an unlabelled block | — |
| 5 | `isFilled(value)` | :136 | a fill must be a non-empty **string**; a number is rejected on purpose (§0d digit ban) | private |
| 6 | `variantIsAnchored(variant, slots)` | :146 | every `variant.slots[]` name must have a fill | returns false |
| 7 | `variantIsAudible(variant, audience)` | :159 | `dm-only` mark ⇒ DM only; an unrecognised audience reads as player (fail-closed) | returns false |
| 8 | `STATE_MARK_DIMENSIONS` | :192 | the three demoted dimensions: `severity` {minor,major,catastrophic}, `deficit` {deficit,no deficit}, `anchor` {anchored,not anchored} | frozen constant |
| 9 | `poolDimensions(pool)` | :215 | which dimensions THIS POOL partitions itself by — derived from the pool's own marks, **never declared by the caller** | `[]` for most pools |
| 10 | `eligibleVariants(pool, options)` | :247 | the four filters, in order (below) | `[]` |
| 11 | `fillSlots(text, slots)` | :280 | `/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g` substitution; **all-or-nothing** — one unfilled slot ⇒ `null` | `null` |
| 12 | `drawVariant(eligible, blockId, poolKey, seed)` | :301 | THE DRAW (see §2) | `null` on empty; `eligible[0]` on no seed |
| 13 | `readStateProse(corpus, blockId, poolKey, options)` | :318 | the whole path; returns `{blockId, poolKey, angle, text}` frozen, or `null` | `null` |
| 14 | `stateProseSentence(...)` | :341 | `readStateProse(...)?.text ?? null` | `null` |
| 15 | `hasStateProsePool(corpus, blockId, poolKey)` | :354 | presence probe with no render | `false` |

**The kernel's own five laws** are written at `stateProseKernel.js:13–57`: anchored liveness,
fail-closed audience, the avalanche-mixed draw, seedless-is-canonical-at-zero, and the demoted
state dimension. Law 3 records the measured reason for the avalanche: a raw FNV `% 8` reached
four residues of eight on `wizard_news` (`:30–35`).

### The eligibility gate, in execution order (`eligibleVariants`, :247–269)

| Order | Filter | Read from | Line | Effect on the pool |
|---|---|---|---|---|
| 1 | `poolDimensions(pool)` on the **RAW** pool, before any other filter | the pool's own `marks[]` | :252 | derives which dimensions must be answered |
| 2 | **Dimension answered?** — unanswered or out-of-vocabulary ⇒ return `[]` | `options.dimensions` | :258–261 | the whole pool goes silent (fail-closed) |
| 3 | Audience | `variant.marks` includes `dm-only` | :265 | drops covert variants |
| 4 | Anchored liveness | `variant.slots[]` vs `options.slots` | :266 | drops variants whose slots have no fill |
| 5 | Dimension value | `variantSpeaksOver` :235 | :267 | a variant carrying a dimension word speaks only over that value; one carrying none is dimension-neutral |

Comment at `:249–251` is load-bearing for the design: the dimension read is on the RAW pool
*"before any filter: the audience or a missing slot could remove the last variant carrying a
dimension word and turn a partitioned pool into one that looks unpartitioned, which is the
fail-OPEN reading wearing the gate's coat."*

---

## §2 — The variant draw, exactly

```js
// stateProseKernel.js:301
export function drawVariant(eligible, blockId, poolKey, seed) {
  if (!Array.isArray(eligible) || eligible.length === 0) return null;
  if (!seed) return eligible[0];
  return eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length];
}
```

**Key material** = `seed` · `blockId` · `poolKey`, joined by `::`. Nothing else. Not the mount,
not the slot values, not the angle, not the lens, not the tab.

| Question the design must answer | Answer at this tip | Citation |
|---|---|---|
| What is `seed` at runtime? | `String(settlement._seed ?? settlement.id ?? '')` at every desk call site | `DefenseTab.jsx:95,110,120,131,146,155,165,225`; `PowerTab.jsx:223`; `ViabilityTab.jsx:37`; `WarFaithDesk.jsx:108`; `economyDeskRead.js:112`; `generalDeskRead.js:257`; `OverviewTab.jsx:174` |
| Who writes `_seed`? | `generateSettlementPipeline.js:130` (`_seed: seed`, the **world/run** seed). `galleryImportSettlement.js:67` writes `_seed: undefined`, so an imported gallery dossier falls back to `id`. | measured by grep |
| Is the modulo over the POOL or the ELIGIBLE list? | **the eligible list** — `% eligible.length` | `:304` |
| Does adding a variant to a pool re-roll existing worlds? | **Yes, on every town where the new variant is eligible** — `eligible.length` changes, so every index shifts. Appending is NOT append-safe. | `:304` |
| Does adding a variant that is ineligible on a town move that town's draw? | **No.** Its eligible list is unchanged. | `:264–268` + `:304` |
| Does adding a *pool* move an existing draw? | **No** — a new pool key is a new draw key; existing keys are untouched. | `:304` |
| Do two pools of one block collide? | No — `poolKey` is in the key. | `:304` |
| Does the same pool read twice in one render draw the same sentence? | **Yes, by design** (`:292–294`). | `:304` |
| How does a per-instance draw get discriminated today? | By **mutating the seed**, not the key: `` `${deskSeed}::${v.type}` `` for crisis banners (`OverviewTab.jsx:284`) and `` `${seed}::${f.faction}` `` for the faction ladder (`PowerTab.jsx:480`). | those two lines |
| Which per-instance positions do **not** discriminate? | DS-GEN-2 conflicts, DS-GEN-8 steadings, DS-REL-1 neighbour ties, DS-REL-1 engagements — all loop with the SAME `options.seed`, `blockId` and (where the state matches) the same `poolKey`. Two conflicts of equal intensity therefore draw the **same variant**; they differ only if the variant names `{faction}`/`{faction2}`, which the slot bag varies. | `generalStateProse.js:1746–1761`, `:1893–1902`, `:1917–1937` |
| Seedless behaviour | `eligible[0]` — canonical-at-zero. A settlement with neither `_seed` nor `id` renders index 0 at **every** pool on the page-set, i.e. every such town reads identically. | `:303` |
| Causal register's draw | `drawVariant(eligible, join.familyId, join.arm, seed)` — the **arm** takes the poolKey slot so the two ends of one join never draw the same index | `causalDossierProse.js:116` |

**The Promise consequence, stated plainly.** Any change to the *count* of eligible variants in a
pool re-rolls that pool for every existing world. The owner's 4× wording-family plan multiplies
every pool's length by ~4, so it re-rolls **every sentence of every world** — a declared,
owner-signed same-seed TEXT shift, exactly as the brief anticipates (ARCH-BRIEF §22 bullet 6).
There is no append-only escape at this tip because the modulo is over a filtered array.

---

## §3 — The data shapes

```js
// stateProseKernel.js:62–83  (typedefs)
StateProseVariant = { angle?: string, marks?: string[], text: string, slots?: string[] }
StateProseBlock   = { title?, sectionTarget?: string[], arms?: string[], slots?: string[],
                      pools: Record<poolKey, StateProseVariant[]> }
StateProseCorpus  = Record<blockId, StateProseBlock>
```

```js
// legibilityRung.js:25–30
LegibilityRung = { glance: string,
                   sentence: string|null,
                   detail: {label,value}[],
                   provenance: {blockId, poolKey, angle}|null }
```

```js
// dossierMounts.js:138–170  (typedef DossierMount)
DossierMount = { mount: '<tab>.<position>', tab, desk, blockId,
                 rung: 'sentence'|'glance',
                 dimensions?: string[],           // declaration of intent, walker-checked
                 visibility?: 'closed-section', visibilityReason?: string }
```

```js
// dmFieldProjection.js:135  (the DM's-pen projection shape)
projectBesideDmField(fieldValue, machineLine) → { field, beside: string|null, hasField: boolean }
```

`marks` is **one untyped bag carrying three disjoint vocabularies** — the audience mark, the
state-dimension words, and (causal register only) the family-local arm names
(`stateProseKernel.js:48–53`). Measured over the six state leaves, the bag holds exactly eight
values and no arm names: `dm-only` 83, `minor` 20, `major` 20, `catastrophic` 10, `deficit` 11,
`no deficit` 11, `anchored` 19, `not anchored` 13.

---

## §4 — The corpus, measured at the product tip

Run: `node arch-prose/kernel-census.mjs $PWD/src/data/dossierStateProse` in `$SC/laneB6`.

```
blocks 68   pools 708   variants 2266
sentences-per-variant { 1: 1624, 2: 634, 3: 8 }   multi-sentence 642  (28.3 %)
mean 123.8 chars, max 229
pool sizes (variants → #pools): 2→33, 3→547, 4→96, 5→17, 6→15
sentence-initial-lowercase variants: 0
```

| Leaf file | blocks | pools | variants | bytes |
|---|---|---|---|---|
| `general.generated.js` | 23 | 193 | 634 | 182,518 |
| `warFaith.generated.js` | 9 | 138 | 418 | 115,753 |
| `defense.generated.js` | 11 | 126 | 383 | 111,827 |
| `economy.generated.js` | 15 | 105 | 329 | 90,212 |
| `power.generated.js` | 7 | 79 | 256 | 81,802 |
| `stressors.generated.js` | 3 | 67 | 246 | 59,298 |
| **total** | **68** | **708** | **2,266** | **641,410** |

Angles: `ledger` 681 · `street` 609 · `visitor` 403 · `unfolding` 230 · `counterforce` 170 ·
`threshold` 96 · `elder` 70 · `canonical` 7. (Identical to the brief's `variants-per-pool.mjs`
figures — an independent cross-check.)

**Slot uses** (variant-uses, not declarations):

| slot | uses | slot | uses | slot | uses |
|---|---|---|---|---|---|
| `settlement` | 1638 | `event` | 22 | `defwork` | 7 |
| `counterpart` | 105 | `faction2` | 20 | `access` | 7 |
| `seat` | 92 | `band` | 16 | `npc` | 7 |
| `faction` | 77 | `season` | 14 | `complexity` | 5 |
| `chain` | 38 | `reason` | 12 | `timeband_span` | 5 |
| `institution` | 35 | `calamity` | 11 | `ruin` | 4 |
| `good` | 33 | `timeband_age` | 9 | `rival_creed` | 4 |
| `resource` | 30 | `steading` | 9 | `stakes` | 3 |
| `creed` | 29 | `issue` | 8 | `governing` | 3 |
| `timeband_since` | 24 | | | `term` 3 · `route` 2 · `govFaction` 2 · `founder` 1 · `challenge` 1 |

**Anchored-liveness fragility, measured:**
- 505 of 2,266 variants name **no slot at all** (always eligible).
- 1,238 more name only `{settlement}`.
- 393 of 708 pools have **no** slot-free variant.
- **89 of 708 pools have no variant whose slots are a subset of `{settlement}`** — those are the
  pools that can go wholly silent on a fill refusal. (First rows: `DS-DEF-11 | WALLED-QUIET`,
  `DS-DEF-11 | WALLED-STRAINED`, `DS-ECO-1 | COMBINATION C1`, `DS-ECO-2 | GRANARY: well stocked`…)
- 21 of 708 pools are **wholly `dm-only`** — silent on every player page by kernel law 2.

**Per-block pool/variant table** (68 rows) is in this run's output; the ten largest blocks are
DS-GEN-3 (42 pools / 128 variants), DS-STR-2 (32/96), DS-WAR-5 (31/93, unmounted),
DS-WAR-2 (28/83), DS-DEF-2 (26/78), DS-FTH-3 (25/75), DS-DEF-6 (21/64, four lenses C3-blocked),
DS-DEF-10 (21/63, unmounted), DS-FTH-1 (21/63), DS-WAR-1 (21/66), DS-POW-7 (20/60).

**The fourth register (causal joins):** `src/data/dossierCausalProse.generated.js`, 210,260 B,
**78 families · 468 variants · 105 distinct arms** (6 variants per family, `[angle · arm]`).
⛔ **It has no production caller.** `grep -rn "readCausalDossierLine|causalLinesForSection"` over
`src/` returns only the module's own definition and two prose mentions in sibling docblocks
(`stateProseKernel.js:52`, `economyStateProse.js:66`). The entire explanation-shaped register is
authored, projected, shipped and dark.

---

## §5 — The bag: what each composer reads and what it exposes

Every desk obeys the same contract, stated at `economyStateProse.js:48–55`:
*"A desk maps LIVE STATE to a POOL KEY, and nothing else."* It never derives a number a canonical
reader owns; those arrive as `readings`.

| Desk | file | signature | READINGS it takes (the bag in) | rungs it returns (the bag out) | `readStateProse` sites |
|---|---|---|---|---|---|
| economy | `economyStateProse.js:880` | `(settlement, readings, options)` | `foodBalance`, `granaryOutlook`, `flowDrift`, `exportPosture`, `notableAbsences`, `impairedInstitution` | 17 keys: `prosperityHeader, prosperityRung, foodTile, granaryTile, foodSecurityRung, incomeMix, criminalLine, tradeProfile, shadowEconomy, tradeFlow, exportPosture, terrainIdentity, economicStrengths, strategicValue, exploitation, catalogStanding, impairedService` | 1 (a shared `line()` closure, :928) |
| power | `powerStateProse.js:841` | `(settlement, readings, options)` | `contenders`, `riskLabel`, `structuralLens`, `politics` | 14 keys: `legitimacyBanner, legitimacyLens, stabilityHeader, stabilityLens, legitimacyReading, captureReading, operationReading, successionRisk, successionHold, rulingStructure, governingTitle, blocPresence, blocGlue, blocEnd` (+ `powerLadderRung` per faction, :628) | 7 (`line`, `line2`, `line4`, `line5`, `line6`, `line7`, ladder) |
| stressors | `stressorsStateProse.js:456` | `(settlement, readings, options)` | `banners`, `conditions`, `worldStressor` | 9 keys (+ `crisisBannerRung` per banner, :505) | 2 |
| warFaith | `warFaithStateProse.js:777` | `(settlement, readings, options)` | `war{status,exhaustionBand,mobilization,postureState,occupation,occupierPosition,treaties,warBeat,counterpart}`, `faith` (`faithPanelModel`), `hasPatron`, `patronFallCause`, `settlementId` | 23 keys across 4 positions | 1 |
| defense | `defenseStateProse.js` | **seven** entry points (`defenseStateProse:1084`, `defenseThreatProse:390`, `defensePostureProse:546`, `defenseCriminalProse:654`, `defenseWallRationaleProse:774`, `defenseMilitaryStatusProse:891`, `defenseForcesProse:1051`, `defenseSupportingProse:1268`, `defenseMagicDependencyProse:1417`) | reads the settlement directly + `structureKey` for DS-DEF-4 | 23 rungs total; two entry points return the **DM-pen projection shape** rather than bare rungs (`defenseStateProse` :1099, `defensePostureProse` :554) | 9 |
| general | `generalStateProse.js:1706` | `(settlement, readings, options)` | ~30 declared reading fields (`generalStateProse.js:1671–1694`) | a **grouped** frozen shape, not a flat bag: `{overview{10}, history{3}, viability{1}, hooks{1}, economics{1}, relationships{2}, steadings{3}}` — see `GENERAL_STATE_PROSE_SILENT` :1635 | 11 |

**Two shapes a designer must not flatten:**
1. `generalStateProse` groups **by position** on purpose (`:1663–1668`): *"a flat bag would let a
   caller pass the ground line to the market position with nothing to notice."*
2. Three general-desk positions are **index-paired lists with nulls kept in place** — conflicts
   (`:1746`), steading rows (`:1893`), neighbour pairs (`:1917`). The null is part of the contract
   (`:1601–1604`).

**Slot bags are per-desk and sometimes per-lens.** `economyStateProse.js:972–984` records the
finding (`R-DST-ROLE`): `{good}` means the town's leading export in the shared bag and the finished
article of one resource line in the exploitation lens, so that lens carries its own override.
`powerStateProse.js:854–868` records the same for `{seat}` (governing BODY in DS-POW-1/4/5/6, the
HALL in DS-POW-2), and answers it by leaving `{seat}` unfilled on DS-POW-2 — costing 10 of 31
variants and no pool.

**The shape contract** each desk declares:
`SLOT_FILL_SHAPES` + `SLOT_FILL_TABLES` (`economyStateProse.js:235,252`; `powerStateProse.js:148,161`;
`stressorsStateProse.js:70,81`; `warFaithStateProse.js:138,153`; `defenseStateProse.js:121,131`;
`generalStateProse.js:101,148`), mirrored against the annex by the projection contract test. The
fill predicates are per-desk copies: `bareCommonFill`, `properFill`, `singularBareCommonFill`
(`economyStateProse.js:273,311,332`), `phraseFill` (`generalStateProse.js:381`),
`bareCommonFill` (`defenseStateProse.js:702`, `generalStateProse.js:1208` — the second adds a
parenthetical refusal the first lacks).

---

## §6 — The mount registry (56 rows, 15 dark)

`src/domain/display/stateProse/dossierMounts.js`, `DOSSIER_MOUNTS` at `:257–469`.

Measured by parsing the file:

```
rows 56   sentence 52   glance 4   distinct blocks mounted 53
unmounted 15
rows per tab: overview 14, economics 10, defense 8, power 7, faith 4, war 3,
              history 3, viability 2, resources 1, services 1, daily_life 1,
              plot_hooks 1, relationships 1        (13 tabs)
rows per desk: general 18, economy 12, defense 9, power 7, warFaith 7, stressors 3
```

- **52 `sentence` rows over 52 distinct blocks** — the C3 law ("one sentence rung per block per
  page-set") holds with zero exceptions in the data. `sentenceMountForBlock` (:552) fails closed
  and returns `null` if two rows ever claim one block.
- **4 `glance` rows**: `economics.economyTile`→DS-ECO-8, `economics.foodTile`→DS-ECO-2,
  `economics.seasonTile`→DS-ECO-2, `faith.nicheRow`→DS-FTH-3.
- **DS-ECO-2 is the one glance-only block** — it is mounted twice and never speaks.
  ⇒ **52 of 68 blocks can emit a sentence; 16 cannot** (15 unmounted + DS-ECO-2).
- `UNMOUNTED_BLOCKS` (:483): `DS-DEF-7, DS-DEF-10, DS-ECO-4, DS-ECO-5, DS-SUP-1, DS-ECO-7,
  DS-SUP-2, DS-POP-1, DS-POP-2, DS-GEN-1, DS-GEN-10, DS-GEN-15, DS-WAR-4, DS-WAR-5, DS-FTH-4`.
  The list is **SHRINK-ONLY** and machine-ordered; a new block cannot be parked there (:475–481).
- Only **two rows declare `dimensions`**: `overview.origin` → `['deficit']` (:334) and
  `history.identity` → `['anchor']` (:440). The third dimension (`severity`, DS-GEN-1) has no
  mount at all — `generalStateProse.js:393–425` records why: the producer writes `severity` as an
  ARRAY (`["minor","major"]`) on 100 % of tensions over 48 settlements, so any collapse would be a
  default wearing a reading's clothes, and the cure moves same-seed output and is the owner's.
- Only **two rows declare `visibility: 'closed-section'`**: `defense.publicOrder` (:313) and
  `defense.criminalStructure` (:364), both with a measured `visibilityReason` ("open on 43 of 60
  generated towns").
- The **FIRST-PAINT LAW** at `:90–111` is the sharpest constraint on any new mount: a `sentence`
  row inside a collapsible host that is closed on first paint is **dark to every reader while every
  instrument is green** (`Primitives.jsx:114` renders `{open && <div>…}` — a collapsed host emits
  no bytes at all).

Router reads: `mountById` (:521), `mountsForTab` (:533), `sentenceMountForBlock` (:552),
`drawnAtMount` (:581 — the one that strips `sentence` **and** `provenance` on a glance row).

**Cross-tab rows that break the "leaf = tab" assumption:** `viability.magicDependency`
(defense leaf), `resources.groundAndWorkings` / `services.catalogStanding` /
`daily_life.standingOfLiving` (economy leaf), `economics.craftReason` (general leaf),
`overview.notableConnection` / `relationships.network` (general leaf).

---

## §7 — Who renders the mounts, and the one-caller rule

`grep -rln dossierMounts src/` returns exactly eight consumer files:

| File | Positions it draws |
|---|---|
| `src/components/new/generalDeskRead.js` | all 18 general-desk rows, behind ONE call |
| `src/components/new/tabs/EconomicsGlance.jsx` | `economics.prosperityHeader`, the three glance tiles; **owns the shared `DeskLines` renderer** (:162) |
| `src/components/new/tabs/EconomicsTab.jsx` | `economics.tradeFlow` (:52), `economics.foodSecurity` (:324), `economics.shadowEconomy` (:686), `economics.commercialProfile` (:344), `economics.exportPosture` (:380) |
| `src/components/new/tabs/PowerTab.jsx` | the 7 power rows (:224–244) + the per-faction ladder (:477) |
| `src/components/new/tabs/OverviewTab.jsx` | `overview.crisisBanners`, `overview.stressorLifecycle`, `overview.activeConditions` (:177–189), per-banner at :283 |
| `src/components/new/tabs/DefenseTab.jsx` | the 8 defense rows (:101–229) |
| `src/components/new/tabs/WarFaithDesk.jsx` | the 7 war/faith rows (:123–224) |
| `src/components/new/tabs/ViabilityTab.jsx` | `viability.magicDependency` (:40) |

Plus `ResourcesTab.jsx:72`, `ServicesTab.jsx:122`, `DailyLifeTab.jsx:197` importing `DeskLines`
from `EconomicsGlance.jsx`, and `HistoryTab.jsx:37`, `PlotHooksTab.jsx:32`, `ViabilityTab.jsx:43`,
`EconomicsTab.jsx:328`, `OverviewTab.jsx:201` calling `generalDeskLines`.

**ARM 2 of the mount walker admits exactly ONE component file per desk** — the reason
`generalDeskRead.js` exists at all (`generalDeskRead.js:1–35`; `generalStateProse.js:10–33`), and
the reason the general desk's paid-surface gate is a single expression at
`generalDeskRead.js:181`. `economyDeskRead.js` is the same act for the economy leaf.

**The paid-surface gate (§885.3)** is spelled at every caller as
`publicDossier ? <SILENT frozen shape> : <desk>(…)` — e.g. `DefenseTab.jsx:92`,
`WarFaithDesk.jsx:106`, `PowerTab.jsx:222`, `generalDeskRead.js:181`. A free anonymous viewer sees
**no corpus prose at all**.

### How a position emits its sentences — `DeskLines`

```jsx
// EconomicsGlance.jsx:162  (and the byte-similar `WarFaithDesk.jsx:122`)
export function DeskLines({ mount, rungs }) {
  const lines = (rungs || []).map((rung) => drawnAtMount(mount, rung)?.sentence).filter(Boolean);
  if (lines.length === 0) return null;
  return (<div …>{lines.map((line) => (<p key={line} …>{line}</p>))}</div>);
}
```

**This is the whole of today's multi-sentence composition.** N lenses at one mount become N
**independent `<p>` elements** in declared order. There is:
- **no connective** of any kind between them;
- **no coherence pass** — nothing checks that lens 3 does not restate lens 1;
- **no relation typing** — order is the component's array order, chosen by the desk author;
- **no sibling-agreement check** across mounts or tabs;
- **a latent React key collision**: `key={line}` means two lenses that draw byte-identical text at
  one mount collide on key (⚠ not observed firing; flagged as a hazard the composed model must not
  make reachable).

`DefenseTab.jsx` uses the same idiom inline rather than through `DeskLines`
(`threatLines` :113, `forceLines` :123, `postureLines` :138, `statusLines` :149,
`supportingLines` :168, `criminalLines` :229).

---

## §8 — How many sentences a block emits

Two different counts, and the design needs both.

**(a) Sentences per VARIANT** — measured over all 2,266:

| sentences in one variant's `text` | variants | share |
|---|---|---|
| 1 | 1,624 | 71.7 % |
| 2 | 634 | 28.0 % |
| 3 | 8 | 0.35 % |

So **28.3 % of the corpus is already a two- or three-sentence unit inside a single, atomic,
undrawable-apart variant.** Mean 123.8 chars, max 229. 386 variants carry a semicolon.

**(b) Lenses (= draws) per MOUNT** — the position-level count, read off the components:

| mount | block | lenses drawn | citation |
|---|---|---|---|
| `faith.patronSeat` | DS-FTH-1 | **8** | `WarFaithDesk.jsx:178–181` |
| `overview.systemsHealth` | DS-GEN-3 | up to **11** (4 status + 5 score axes + food) | `generalStateProse.js:1718–1725` |
| `war.standing` | DS-WAR-1 | 5 | `WarFaithDesk.jsx:137–141` |
| `defense.threatAssessment` | DS-DEF-2 | 5 | `DefenseTab.jsx:113` |
| `defense.armedForces` | DS-DEF-5 | 5 | `DefenseTab.jsx:123` |
| `overview.activeConditions` | DS-CND-1 | 5 | `OverviewTab.jsx:185–189` |
| `resources.groundAndWorkings` | DS-ECO-11 | 4 | `ResourcesTab.jsx:72` |
| `history.identity` | DS-GEN-9 | 4 | `generalStateProse.js:1819–1824` |
| `defense.postureHeader` | DS-DEF-1 | 3 | `DefenseTab.jsx:138–140` |
| `economics.commercialProfile` | DS-ECO-12 | 3 | `EconomicsTab.jsx:344` |
| `power.criminalUnderside` | DS-POW-6 | 3 | `PowerTab.jsx:228–230` |
| `power.blocs` | DS-POW-7 | 3 | `PowerTab.jsx:234–236` |
| `viability.verdict` | DS-GEN-11 | 3 | `generalStateProse.js:1979–1983` |
| `war.treaties` | DS-WAR-2 | 3 | `WarFaithDesk.jsx:146–148` |
| `overview.origin` | DS-GEN-6 | 2 (route + tier overlay — the registry's **one written exception**) | `dossierMounts.js:45–51`; `generalStateProse.js:1737–1740` |
| `overview.crisisBanners` | DS-STR-1 | 2 + one per banner | `OverviewTab.jsx:177–178, 283` |
| `power.legitimacyBanner` · `power.stabilityHeader` · `power.rulingStructure` · `power.succession` · `defense.publicOrder` · `defense.militaryStatus` · `defense.criminalStructure` · `defense.supportingCapabilities` · `overview.notableConnection` · `services.catalogStanding` · `overview.stressorLifecycle` | — | 2 each | as cited above |
| `overview.conflicts` · `overview.steadings` · `relationships.network` · `plot_hooks.framing` · `overview.warnings` | — | one per ROW (unbounded) | `generalStateProse.js:1746, 1893, 1917, 1988, 1770` |
| everything else | — | 1 | — |

**The composed-prose arithmetic starts here.** A position drawing L lenses over pools of ~3
variants each already produces ~3^L textually distinct readings *for one state cell*: DS-FTH-1's
eight lenses over 3-variant pools give 3^8 = 6,561 renderings of one town's faith paragraph — but
they are **eight assertions in a row**, not one sentence that grew more specific. What the corpus
does NOT have today is a way for one fact to *modify* another's sentence.

---

## §9 — Existing connective and multi-sentence composition

**Between lenses at a mount:** none. Separate `<p>` per sentence (§7).

**Inside a variant** (the only place relation is expressed today), measured over 2,266 variants —
count of variants containing the token at least once:

| connective | variants | connective | variants |
|---|---|---|---|
| `and` | 1,789 | `because` | 81 |
| `which` | 186 | `so` | 56 |
| `yet` | 54 | `but` | 36 |
| `when` | 33 | `while` | 19 |
| `and that` | 11 | `though` | 9 |

Top opening words of a variant's **second** sentence: `The` 207, `What` 75, `It` 59, `A` 28,
`Nothing` 25, `Whatever` 25, `There` 17, `That` 16, `Its` 14.

Reading (mine, vetoable): the corpus's relational grammar today is **within-variant and mostly
additive** — `and` is near-universal, contrast (`but`/`though`/`yet` ≈ 99 variants) and
consequence (`because`/`so` ≈ 137) are minority moves, and the two-sentence form usually restates
or extends with a definite noun phrase rather than joining with a connective. The MODIFIER +
RELATION-CARRYING CONNECTIVE the brief specifies **does not exist as a data shape anywhere**;
where it exists as prose it is baked inside an atomic variant and cannot be detached.

---

## §10 — Every place a second fact already modifies a sentence

Nine mechanisms. This is the inventory the composed model either subsumes or must keep working.

| # | Mechanism | Where | What it does | Grain |
|---|---|---|---|---|
| 1 | **Multi-fact pool KEYS** | 27 of 118 key functions take ≥2 facts: 18 take two, 8 take three, 1 takes four (`wallRationalePoolKey(walls, monsterThreat, militaryGate, tier)`, `defenseStateProse.js:747`) | the second fact selects a *different pool* — a hand-authored cross-product cell | pool |
| 2 | **Conjunctive pool key STRINGS** | 111 of 708 pool keys carry a conjunction marker (` AND `, ` × `, ` · `, `with`, `without`, `, `). Examples: `Beasts & Monsters: plagued, perimeter AND organized force`; `SHORTAGE × trade-dependent`; `<family> · <state>` (DS-WAR-2, 28 pools = 7 families × 3 compliance states + floor) | the authored combinatorial explosion the owner names as the danger, already present | pool |
| 3 | **The demoted STATE dimension** (kernel law 5) | `STATE_MARK_DIMENSIONS` :192; `variantSpeaksOver` :235; used by 2 mounts | a second fact filters *within* a pool: a marked variant speaks only over its value, an unmarked one over all. 104 variants carry a dimension word. | variant |
| 4 | **The audience mark** | `variantIsAudible` :159 | `dm-only` removes 83 variants; 21 pools are wholly covert and silent on a player page | variant |
| 5 | **Anchored liveness** | `variantIsAnchored` :146 | the presence of a *name* (a second fact) removes variants: 89 pools have no `{settlement}`-only fallback | variant |
| 6 | **Lens ordering — most-specific-wins** | 12+ sites, each with a written reachability argument | a second fact chooses which of several lenses *fires at all*. The two canonical write-ups: `powerStateProse.js:53–62` (lens C before lens B or `governanceFractured true` becomes unreachable) and `warFaithStateProse.js:309–311` (`stretchedThin` outranks `strengthened`). Others: `foodSecurityPoolKey` blockade override (`economyStateProse.js:394`), `stabilityLensPoolKey` conflict-before-share (`powerStateProse.js:375`), `wallRationalePoolKey` STRAINED>THREATENED>QUIET (:733), `magicDependencyPoolKey` named-chain rung (:1388), `craftReasonPoolKey`'s four-step annex order (`generalStateProse.js:1304–1310`), `steadingPoolKey` forced>charterPending>organic (:1423), `treatyDocumentPoolKey` expiry-outranks-role (:428) | lens |
| 7 | **Surface gates** — a second fact silences a whole block | `martial` gate for all five DS-WAR-1 lenses (`warFaithStateProse.js:828–829`); `magicWorks === false` (`defenseStateProse.js:1002`); `terrainNamed` (`economyStateProse.js:966–968`); `primaryStress` suppresses DS-GEN-5 (`generalStateProse.js:862`); `martial`/`hasPatron` teaser split (:871) | R-DST-K applied to a combination | block |
| 8 | **Per-instance seed suffix** | `OverviewTab.jsx:284`, `PowerTab.jsx:480` | a second fact (the instance identity) varies the *draw*, not the pool | draw |
| 9 | **The DM's pen** | `dmFieldProjection.js:135`; 8 blocks in `DM_FIELD_FRAMED_BY_BLOCK` (:85) | a human-authored field *replaces* the position and the machine line renders BESIDE, never into it. Blocks: DS-GEN-5, DS-GEN-6, DS-GEN-9, DS-GEN-11, DS-REL-2, DS-DEF-1, DS-DEF-3, DS-ECO-6 | position |

**Nothing in this inventory is a modifier attached to a spine.** Mechanisms 1–2 buy specificity by
authoring a whole new sentence per cell — precisely the exponential the owner wants bounded.
Mechanisms 3–5 only *subtract*. Mechanism 6 only *chooses*. Mechanism 8 only *varies*.

---

## §11 — Delivery: the chunk

Probe: took a real variant string (`DS-ECO-9 | BLOCKADED`, `"The stores are sealed off from the
road…"`) and grepped `dist/assets/*.js`.

| Fact | Value |
|---|---|
| Chunk carrying the state-prose data | **`dist/assets/data-lazy-pqPyi0JA.js`** — the ONLY match |
| Its size on disk | **939,520 B** (raw, un-gzipped) |
| Referenced from `dist/index.html`? | **No** — `grep -c data-lazy dist/index.html` = 0, so it is not preloaded at first paint |
| Source bytes it carries from this subsystem | 641,410 B (six state leaves) + 210,260 B (causal register, dark) = 851,670 B |

⚠ **Caveat, stated because it matters:** `dist/` in this dock is a build artefact
(`data-lazy-pqPyi0JA.js` mtime 2026-09-07 08:31; the corpus source mtime 2026-09-06 23:39). It is
consistent with the tip but I did not build it and the fences forbid building. The chunk **identity**
(`data-lazy-*`, not first-paint) is the load-bearing fact and is confirmed by the probe.

A 4× wording expansion takes the six state leaves from 641 KB to roughly 2.5 MB raw. That lands
entirely in this lazy chunk, and the causal register (210 KB, dark) is already sitting in it.

---

## §12 — What the composed-prose design inherits (the short list)

1. **One draw function.** Everything routes through `drawVariant`. A second draw shape (spine draw
   + modifier draw + wording draw) means either three keys or a re-keyed single draw; either way
   the change is confined to `stateProseKernel.js` and the desks are untouched.
2. **The pool key is a string chosen by a desk function.** A spine/modifier schema can be carried
   *inside the existing corpus shape* by naming pools with a prefix (the `poolsByToken` precedent,
   `powerStateProse.js:763`) — the corpus IS already the key table there.
3. **`legibilityRung` is the only sentence carrier**, and it holds exactly ONE sentence
   (`sentence: string|null`). A composed spine+modifiers must either be joined to one string before
   it reaches a rung, or the rung shape must grow — and `drawnAtMount` (`:585`) strips only
   `sentence` and `provenance`, so a new field would leak past the glance gate unless it is added
   to that strip list.
4. **The mount is the composition boundary today, and it is unenforced.** `DeskLines` will
   concatenate however many rungs it is handed, in array order, with no relation typing. The
   composed model's ≤2-modifier bound has **no enforcement point** at this tip; the natural one is
   the desk's return shape (a position returns one composed rung, not a list).
5. **The C3 law is per PAGE-SET and structurally enforced** (`sentenceMountForBlock` :552 + the
   walker). A composed block that wants to speak twice cannot, without a registry act.
6. **The paid gate and the audience gate are per-caller and already correct.** A composed sentence
   assembled from a public spine and a `dm-only` modifier would silently leak covert content unless
   the licence check runs per *piece*.
7. **Anchored liveness is per-piece already.** A modifier naming an unfillable slot drops itself,
   which is the right default — but 89 pools have no `{settlement}`-only floor today, so the
   composed model's "spine + up to two modifiers" floor is NOT currently guaranteed by the data.
8. **The explanation seam is authored and dark.** 78 causal families / 468 variants / 105 arms
   ship in the lazy chunk with no caller. Turns keyed on typed explanations have a corpus, a
   reader (`causalDossierProse.js`) and no wiring.

---

## OPEN QUESTIONS

1. **Where does composition live?** The kernel returns one sentence per pool and knows nothing of
   mounts. Composing a spine with modifiers requires a new layer — in the kernel (`composeStateProse`),
   in each desk, or in a new `stateProseComposer.js` between them. The one-caller rule (ARM 2) and
   the desk-derives-nothing law both push it **below** the desks; the salience scoring needs the
   readings bag, which pushes it **into** them. Unresolved.
2. **How is the draw re-keyed?** A single flat draw over (variant × wording) is the brief's default,
   but it makes a wording family's members compete with each other's *siblings* in one modulo. A
   two-level draw needs a second key segment; the only free segment today is the seed prefix
   (`${seed}::${wording}`), which is what the two per-instance sites already abuse. Which one?
3. **Does the modulo become append-safe?** Every design that keeps `% eligible.length` re-rolls
   every world on every authoring pass. An index-stable draw (hash-per-variant-id, argmax) would
   make the authoring wave non-disruptive. Is the owner's declared one-time shift meant to be the
   *only* one, or one per wave?
4. **What is `seed` when a settlement has neither `_seed` nor `id`?** `''` ⇒ index 0 everywhere
   (`:303`). `galleryImportSettlement.js:67` nulls `_seed` deliberately. Does an imported gallery
   dossier reliably carry an `id`, and is a canonical-at-zero page acceptable if not?
5. **Which position owns the connective — the corpus or the composer?** Every connective in the
   corpus today is inside an atomic variant. If the composer supplies the connective, 28.3 % of
   variants (the multi-sentence ones) are structurally different from the rest and cannot serve as
   spines without being split — a corpus act.
6. **How is the ≤2-modifier bound enforced, and by which instrument?** No walker measures sentence
   count per position today; the mount walker measures rungs, not sentences.
7. **Does the composed model keep `legibilityRung.sentence` as one string?** If yes, the composed
   paragraph is opaque to `drawnAtMount`'s glance strip and to the fingerprint walkers, which read
   sentences. If no, `drawnAtMount:585` must learn the new field.
8. **The four index-paired list positions** (conflicts, steadings, neighbours, engagements) draw the
   SAME variant for every row of equal state. Under the composed model this is the owner's
   "repeated only because the instance repeated" — except the instances are *different* (two
   different quarrels). Does salience or a per-instance seed suffix cure it, and is that a
   same-seed text shift on its own?
9. **DS-ECO-2 and the 15 unmounted blocks.** 16 of 68 blocks can never emit a sentence. Does the
   composed model treat their pools as a modifier reservoir (they are authored, licensed prose about
   real facts), or does it inherit their darkness?
10. **The causal register.** 468 authored variants, 105 arms, zero callers. Are these the TURNS, or
    is the turn a new authored artefact and the causal register a separate wiring debt?
11. **Render cost.** Six desks run per page-set, ~31 `readStateProse` call sites plus loops, and
    most callers are un-memoized (`PlotHooksTab.jsx:32` is the only `useMemo`). A spine + 2 modifiers
    + salience scoring multiplies the draw count by ~3 and adds a scoring pass. Nobody has measured
    the current per-dossier cost, and I could not (no build, no vitest).
12. **The `key={line}` collision** in both `DeskLines` implementations
    (`EconomicsGlance.jsx:168`, `WarFaithDesk.jsx:128`): two identical sentences at one mount collide.
    Composition makes near-identical siblings more likely, not less. Is this worth curing in the
    migration car?
