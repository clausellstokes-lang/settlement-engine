# LEAVES — the desk remainder, with the real denominator and the correct unit

Measured at dock HEAD `c2f80ffc957a15ab18e756e0aae2b56ceb78fc9c`. Every figure below is
read out of the tree, not carried from a prior document.

## 1. THE UNIT, ESTABLISHED FROM THE REGISTRY RATHER THAN ASSUMED

`dossierMounts.js:83-84` defines the field that names the unit:

> `@property {string} desk the corpus leaf under src/data/dossierStateProse`

So **a corpus leaf is one `*.generated.js` file under `src/data/dossierStateProse/`**, and
the registry's `desk` field is its name. There are **SIX**, and `dossierMounts.js:106`
states the position directly:

> *"a mount needs a desk to turn live state into a pool key, and five of the six desks are
> unwritten."*

**⚠ THE REMAINDER IS NOT "SIX LEAVES".** The brief carried *"six corpus leaves at 8 to 13
cars each"*. Six is the TOTAL, not the remainder. `economy` is one of the six and it is
**partly** lit — 4 of its 15 blocks are mounted. The remainder is therefore
**FIVE WHOLLY DARK LEAVES PLUS ELEVEN DARK BLOCKS INSIDE THE LIT LEAF**, which is a
different shape to schedule than five-or-six uniform leaves.

### The three nested units, which are easy to conflate and cost different amounts

| unit | count | what it costs |
|---|---|---|
| **LEAF** (= desk) | 6 total, 1 written | one `<leaf>StateProse.js` desk module each |
| **BLOCK** | 68 total, 4 mounted, **64 dark** | one or more mount rows + one JSX site per mount |
| **POOL** | 708 total, 27 lit, **681 dark** | one live-state → pool-key arm in the desk module |

The POOL is the real cost driver: a desk module's whole job is `state → pool key`
(`economyStateProse.js:14`: *"A desk maps LIVE STATE to a POOL KEY, and nothing else."*),
so a block with 42 pools costs an order of magnitude more than a block with 3.

## 2. THE DENOMINATOR — CONFIRMED, THREE WAYS AGREEING

| leaf | blocks | dark | pools | dark pools | variants | bytes |
|---|---|---|---|---|---|---|
| `defense` | 11 | **11** | 126 | 126 | 383 | 111,827 |
| `economy` | 15 | **11** | 105 | 78 | 329 | 90,212 |
| `general` | 23 | **23** | 193 | 193 | 634 | 182,518 |
| `power` | 7 | **7** | 79 | 79 | 256 | 81,802 |
| `stressors` | 3 | **3** | 67 | 67 | 246 | 59,298 |
| `warFaith` | 9 | **9** | 138 | 138 | 418 | 115,753 |
| **TOTAL** | **68** | **64** | **708** | **681** | **2,266** | **641,410** |

Three independent agreements that 68 is the true denominator:
1. Each leaf's own generator header comment sums to 68 blocks / 2,266 variants.
2. `dossierMounts.js:11` — *"The corpus already carries a `sectionTarget` on 45 of its 68
   blocks"*.
3. `DOSSIER_MOUNTS` (4 distinct blocks) + `UNMOUNTED_BLOCKS` (64) = 68, which the walker's
   TOTALITY arm asserts is exactly the corpus.

The 708 figure is independently corroborated by the walker's own header
(`dossierMountRegistry.walker.test.js:20`): *"687 of its 708 pools carry exactly one
variant per angle"*.

## 3. THE LEAVES, ENUMERATED

Legend — `DIM` = the block partitions itself by a demoted STATE dimension, so a mount must
declare it or the walker's HONESTY arm reds. `DM-PEN` = the block frames a DM-editable
field and must render through `projectBesideDmField`, never into it. `{band}!` = at least
one variant actually USES `{band}`, which is RESERVED and cannot fill.

### 3.1 `economy` — PARTLY LIT · 11 dark blocks · 78 dark pools
Annex home: `RECEIPT_POOLS_DOSSIER_STATE.md` WRITER-1 (DS-ECO- + DS-SUP-).
Desk module: **EXISTS** — `economyStateProse.js` (15,581 B).
Mounts today: 5 rows, 4 blocks, on the `economics` tab.

| block | pools | var | flags | surface |
|---|---|---|---|---|
| DS-ECO-3 | 5 | 18 | | Economics › Live Trade Flow drift |
| DS-ECO-4 | 4 | 16 | initial `{good}`×3 | Economics › Market Prices |
| DS-ECO-5 | 7 | 21 | | Economics › Economic Flows chain cards |
| DS-SUP-1 | 6 | 18 | | Supply › SupplyChainsPanel node graph |
| DS-ECO-6 | 3 | 12 | **DM-PEN** (`safetyProfile.economicDragDesc`) | Economics › Shadow economy |
| DS-ECO-7 | 2 | 8 | | Economics/Services › freshness note |
| DS-SUP-2 | 7 | 21 | | LADDER › supply-chain status + break-cause library |
| DS-ECO-10 | 10 | 30 | initial `{good}`×2 | LADDER › export posture |
| DS-ECO-11 | 17 | 53 | | Resources/Overview › terrain + exploitation ladder |
| DS-ECO-12 | 10 | 30 | | Economics › income sources + trade profile |
| DS-SUP-3 | 7 | 21 | | Services › tier-expected catalog |

Depends on: nothing new. The desk module and its test file already exist, so these are the
**cheapest blocks in the arc per pool** — they extend a written module rather than minting
one. Tabs touched: `economics`, `services`, `resources`, `overview`.

### 3.2 `stressors` — DARK · 3 blocks · 67 pools
Annex home: WRITER-4 (DS-STR- + DS-CND-). Desk module: **none**.

| block | pools | var | flags | surface |
|---|---|---|---|---|
| DS-STR-1 | 17 | 96 | `{band}!`×1 | Overview › Active crisis banners |
| DS-STR-2 | 32 | 96 | initial `{reason}`×1 | Stressor lifecycle, counterforce, synergy, origin |
| DS-CND-1 | 18 | 54 | initial `{reason}`×1 | Active conditions: severity, direction, provenance |

Three blocks but **67 pools** — the highest pool-per-block density in the corpus (22.3).
DS-STR-2 alone carries 32 pools, more than the whole `power` leaf's DS-POW-3+4+5.
Depends on: a stressor/condition state reader. Tabs: `overview`.

### 3.3 `power` — DARK · 7 blocks · 79 pools
Annex home: WRITER-2 (DS-POW-). Desk module: **none**.

| block | pools | var | flags | surface |
|---|---|---|---|---|
| DS-POW-1 | 11 | 41 | | Power › Public legitimacy banner |
| DS-POW-2 | 9 | 31 | | Power › Stability + governing authority header |
| DS-POW-3 | 5 | 16 | | Power › The Ladder |
| DS-POW-4 | 9 | 29 | | Power › Rule and succession |
| DS-POW-5 | 12 | 40 | | POWER: ruling structure, governing body, ruling-power lens |
| DS-POW-6 | 13 | 39 | | POWER: legitimacy, criminal capture, safety |
| DS-POW-7 | 20 | 60 | | POWER: blocs, coalitions, the divided court |

**No `{band}` variant use, no DIM, no DM-PEN, no sentence-initial residue.** This is the
cleanest dark leaf in the corpus and the natural second desk after economy.
Depends on: `{seat}` and `{faction}` producers (100 and 80 uses corpus-wide — both proper
nouns with real generated names). Tabs: `power`.

### 3.4 `defense` — DARK · 11 blocks · 126 pools
Annex home: WRITER-2 (DS-DEF-). Desk module: **none**.

| block | pools | var | flags | surface |
|---|---|---|---|---|
| DS-DEF-1 | 8 | 26 | **DM-PEN** (`guardEffectivenessDesc`) | Defense › Defensive posture header |
| DS-DEF-2 | 26 | 78 | | Defense › Threat assessment (five readiness rows) |
| DS-DEF-3 | 7 | 23 | **DM-PEN** (`safetyDesc`) | Defense › Public order banner |
| DS-DEF-4 | 9 | 28 | | Defense › Criminal structure + capture consequence |
| DS-DEF-5 | 11 | 33 | | Defense › Armed forces & fortifications |
| DS-DEF-6 | 21 | 64 | | Defense › Supporting capabilities |
| DS-DEF-7 | 11 | 34 | initial `{reason}`×1 | Defense › Live defense readiness + war front |
| DS-DEF-8 | 4 | 12 | | Defense › Active military status |
| DS-DEF-9 | 3 | 10 | | Viability › Magic dependency |
| DS-DEF-10 | 21 | 63 | `{band}!`×1 | DEFENSE: five arms, readiness badges, posture |
| DS-DEF-11 | 5 | 12 | | (untitled) |

Two DM-PEN blocks — the most of any leaf — so this leaf cannot land without
`projectBesideDmField` gaining its first real caller. Tabs: `defense`, `viability`.

### 3.5 `warFaith` — DARK · 9 blocks · 138 pools
Annex home: WRITER-3 (DS-WAR- + DS-FTH-). Desk module: **none**.

| block | pools | var | flags | surface |
|---|---|---|---|---|
| DS-WAR-1 | 21 | 66 | | War & Faith › War block |
| DS-WAR-2 | 28 | 83 | | War & Faith › Treaty block |
| DS-WAR-3 | 1 | 5 | | War & Faith › Whole-tab dormant note |
| DS-WAR-4 | 5 | 15 | | PDF › liveWorld slice |
| DS-WAR-5 | 31 | 93 | | WAR-ADJACENT: posture, siege, occupation, blockade, treaty |
| DS-FTH-1 | 21 | 63 | | War & Faith › Faith panel (ACTIVE mode) |
| DS-FTH-2 | 2 | 8 | | War & Faith › Faith teaser (free/anon; names no deity) |
| DS-FTH-3 | 25 | 75 | | Religion state: standing, niche, legitimacy, falls, rank |
| DS-FTH-4 | 4 | 10 | | (untitled) |

⚠ **DS-FTH-2 is a PAID-SURFACE block** — *"Faith teaser (free / anon; names no deity)"*.
Mounting it touches the free/paid boundary, which is an owner-gated class.
⚠ **DS-WAR-4 mounts on the PDF path, not a tab** — the reachability arm requires exactly
one site under `src/components`, and the PDF renderer lives under `src/pdf`. This block may
not be mountable under the registry's current reachability rule at all.
Depends on: `{creed}`, `{rival_creed}`, `{term}`, `{counterpart}` producers. Tabs: `war`,
`faith`.

### 3.6 `general` — DARK · 23 blocks · 193 pools — **THE LARGEST AND THE WORST-SHAPED**
Annex home: WRITER-4 (DS-GEN- + DS-REL- + DS-POP- + DS-HK-). Desk module: **none**.

| block | pools | var | flags | surface |
|---|---|---|---|---|
| DS-POP-1 | 17 | 51 | | Population: banded counts, receipts, movement |
| DS-POP-2 | 7 | 21 | | The population trend lens, woven |
| DS-GEN-1 | 10 | 50 | **DIM:severity** | Power/Overview/History › Current tensions |
| DS-GEN-2 | 3 | 15 | initial `{stakes}`×2, `{issue}`×1 | Power/Overview › Active conflicts |
| DS-GEN-3 | 42 | 128 | | Overview › Systems Health dashboard |
| DS-GEN-5 | 5 | 20 | **DM-PEN** (`arrivalScene`) | Overview › Situation |
| DS-GEN-6 | 9 | 32 | **DIM:deficit + DM-PEN** (`settlementReason`) | Overview › Settlement origin |
| DS-GEN-7 | 8 | 30 | `{band}!`×2 | Overview › Warnings & coherence notes |
| DS-GEN-8 | 6 | 21 | `{band}!`×5 | Overview › Steadings, remnant, ancient ruin |
| DS-REL-1 | 10 | 30 | | Relationships › Neighbour network |
| DS-REL-2 | 3 | 12 | `{band}!`×3 + **DM-PEN** (`prominentRelationship.phrasing`) | Relationships/Overview › Prominent relationship |
| DS-GEN-9 | 15 | 50 | **DIM:anchor + DM-PEN** (`history.historicalCharacter`) | History › Identity header, timeline, founding |
| DS-GEN-10 | 5 | 15 | | PDF › five slices |
| DS-HK-1 | 11 | 44 | | HOOKS FRAMING |
| DS-GEN-11 | 6 | 21 | `{band}!`×2 + **DM-PEN** (`economicViability.summary`) | Viability › The coherence verdict |
| DS-GEN-12..18, DS-POP-3 | 36 | 94 | | (eight untitled blocks) |

**DS-GEN-3 alone carries 42 pools and 128 variants** — 6% of the corpus in one block, and
more pools than the entire `stressors` leaf. It is a car by itself.
This leaf holds **all three DIM blocks in the corpus**, **five of the eight DM-PEN blocks**,
**four of the seven `{band}`-using blocks**, and the only `{stakes}`/`{issue}` residue.
⚠ **DS-GEN-10 is a PDF-path block** — same reachability problem as DS-WAR-4.
Tabs: `overview`, `power`, `history`, `relationships`, `viability`, `plot_hooks`.

## 4. THE SIBLING SUBSYSTEM — a SEVENTH corpus nobody has counted

`causalDossierProse.js` reads `src/data/dossierCausalProse.generated.js`, which is a
**separate corpus not in the 68**:

- **78 join families · 468 variants · 210,260 B** (generator header, confirmed by parse).
- 57 families carry two arms, 21 carry one.
- Eight section targets: relations 32 · economy 27 · power 24 · faith 20 · population 16 ·
  tensions 15 · history 13 · defense 8.
- **21 distinct slots**, including four the state corpus does not carry at all:
  `{house}` (41 uses), `{temple}` (32), `{third_party}` (7), `{war}`, `{wound}`, `{burden}`.

It has **no mount registry of any kind**. `dossierMounts.js` routes STATE blocks only; the
causal register's routing question (`causalFamiliesForSection`) has zero callers.

Full pricing is in `desk-plan.md` §5.

## 5. WHAT IS NOT IN THE BUNDLE TODAY

Only **one** of the six leaves is imported by any `src/` module — `economy.generated.js`,
via `economyStateProse.js`. The other five (551,198 B) and the causal corpus (210,260 B)
are **761,458 B of authored content on disk that no build reaches**. Lighting each leaf
moves its bytes into that leaf's lazy tab chunk. This is the arc's dominant byte risk and
is priced in `desk-plan.md` §7.
