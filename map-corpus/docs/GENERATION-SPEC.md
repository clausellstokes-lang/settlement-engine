# THE GENERATION SPECIFICATION

### Lane MF-SPEC (Opus 5), 2026-08-17. ODQ §246.3 — the synthesis of the three studies, the corrected atlas and the architecture program into ONE build sheet.
### This document, not the organically grown charter, is the map program's spine and wave nine's build sheet (§246.3).
### Advisory/specification deliverable. Read-only lane: no git writes, no memory writes, no edits outside this file and `laneMFSPEC-receipt.md`.

---

## §0 · HOW TO READ THIS, AND WHAT IT IS FOR

**The reader this is written for:** an engineer with no memory of this program who has to
build the settlement-map generator. Every stage below states what it consumes, what it
computes, what it emits, which law binds it, what must measure zero, and whether it exists.

**What this document is NOT.** It is not a treatise, not a re-derivation, and not a new law.
Every figure here is quoted from a named source with its section. Where two sources conflict
I say so and rule with reasons (§0.4). Where a mechanism has no derivation home it is in
Appendix A ("inspiration, not derivable") and **must not** enter the pipeline. Where the
synthesis found a hole nobody named, it is a numbered **CHAIR QUESTION** in Appendix B and is
**not** filled silently.

### §0.1 · HONESTY KEY

| mark | meaning |
|---|---|
| **CONFIRMED** | executed evidence exists — a measurement, a test run, a census, quoted with its instrument |
| **PLAUSIBLE** | reasoned from confirmed facts; no execution behind this specific claim |
| **BUILT** | the mechanism exists in the sandbox tree at MF-ARCH-2's tip, with the module and the receipt that proved it named |
| **PARTIAL** | some of it exists; what exists and what is missing are both stated |
| **NOT BUILT** | the mechanism must be written; the sketch is here |
| ⛔ **WITHDRAWN** | the *target* has been retracted; not a pass, not a fail, and it may not be graded (§249.2's fifth verdict) |
| ⚠ | a hazard that has bitten, or a figure that must not be read as more than it is |

**This lane executed nothing.** It read; it did not build, measure, or run the generator. Every
**CONFIRMED** label below therefore means *"a named upstream lane executed this and its receipt
quotes the output"*, and the receipt is cited. Nothing in this document is a fresh measurement,
and no number here was computed by me.

### §0.2 · CANONICAL SOURCES (§243 — cite these paths, never the scratchpad mirror)

| short name | path | what it is |
|---|---|---|
| **ATLAS** | `map-corpus/docs/laneMFS1-urbanism-atlas.md` | the graded target sheet, as corrected by the §244 fold (MF-S2). Its §2.9 correction ledger and §2.8.1 usage rules are **binding**. |
| **PLAN** | `map-corpus/docs/MORPHOLOGY-PLAN.md` | MF-S3a — street graph, blocks/plots, districts, centres, epochs, decay, invariants, anomaly |
| **CONTEXT** | `map-corpus/docs/MORPHOLOGY-CONTEXT.md` | MF-S3b — terrain, water, defence, edges, institution relations, circulation, morphotypes. 45 mechanisms `CX-01…CX-45`, verdicts **3 HAVE / 18 PARTIAL / 23 MISSING / 1 NOT-DERIVABLE** |
| **PRIOR-ART** | `map-corpus/docs/PRIOR-ART-FMG.md` | MF-X1 — Azgaar's FMG as prior art. Headline: **nobody ships the world→plan join** |
| **CSV** | `map-corpus/docs/laneHFM1-corpus-measured.csv` | 313 plates × 47 fields, the measured register |
| **GRAIN JSON** | `map-corpus/docs/HFM1-grain2.json` | 57 grain windows (22 reproduced byte-identically from MF-S1 + 35 re-set) |
| **LAWS** | `refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md` | ODQ. Map laws: §161(a–n), §171, §177, §184, §190–§205, §209, §212, §214, §229, §230, §232, §238–§241, §244, §249–§253 |

**Receipts for BUILT status** (scratchpad, temporary — the claims are re-quotable from the tree):
`laneMFB8-receipt.md` (the geometry wave), `laneMFB8b-receipt.md` (the wall/fabric hotfix and
the §234 architecture pilot), `laneMFARCH-receipt.md` (the SCC diagnostic and the cycle
attribution), `laneMFARCH2-receipt.md` (the epoch/version axis), **`laneMFW1-receipt.md` (the
water characterization — §0.3a's authoritative figure set, §0.3b's independence caveat and
G-34's predicate-boundary finding all come from it).**

### §0.3 · THE STATE OF THE TREE THIS SPEC IS WRITTEN AGAINST

The generator lives in the **sandbox** (`mf-proto/build-out/**`), not in the repo. Nothing in
the map program has landed on a branch. The tip is MF-ARCH-2's.

**Executed at that tip (CONFIRMED, `laneMFARCH2-receipt.md` §0):**

```
vitest (lane config, bare)               7 files / 162 tests passed, ZERO pins re-recorded
cross-process determinism                10 processes, identical=10 mismatched=0
                                         87da9c41a892a3d764c17f20728dc94437e1d868ac5f7589a46df545c1a7bf7c
cross-ENGINE determinism (4 V8 modes)    1 distinct digest
§17 / §17.4 / §205A / §200 drawn census  0 / 0 / 0 / 0 over 23,391 bodies, AREA-TRUE
§202 landlocked · §201B orphan streets   0 · 0
§232 district straddlers                 0
§240.1 containment residual, every ring  0 · epoch members outside own circuit 0 of 15,176
op ceiling (§217 per-tier ratchet)       96/96 renders under their tier ceiling
purity scan (comments stripped)          Math.random/Date/localeCompare/Math.pow/trig — NONE
sizeBaseline                             MAX 790 (buildFabric.js) against 800
SCC · module graph                       43 nodes / 151 edges — ACYCLIC
SCC · stage graph, binding granularity   129 nodes / 446 edges — 0 NON-TRIVIAL SCCs
SCC · stage graph, field granularity     364 nodes / 847 edges — 0 NON-TRIVIAL SCCs
```

⚠ **ONE THING AT THE TIP IS OPEN AND A BUILDER MUST KNOW IT.**
**Nobody has looked at MF-ARCH-2's plates.** Ten walled leaves' walls changed shape and the ditch
changed ring; 32 plates sit in `mf-proto-out/arch2/` unviewed (`laneMFARCH2-receipt.md` §9.8).
**That is wave nine's first act, before any new build.**

**The other — `waterViolations` 114 → 165 — is now CHARACTERIZED (lane MF-W1, `laneMFW1-receipt.md`).**
⭐⭐ **THE VERDICT: NOT A REGRESSION — A DIFFERENT RIVER.** The move is **+47 from the fork-key
salt cure re-rolling the river's meander (declared cause 101)** and **−13 from the epoch / wall /
version work (causes 97–100), which IMPROVED the figure.** Two orderings of the same 2×2 agree to
the unit. ⭐ **And MF-ARCH-2's own guessed cause is REFUTED BY EXECUTION: `year-018` has NO
CIRCUIT AT ALL and moved by exactly the same +10 with a byte-identical violation key set** — no
wall can explain a move on a leaf that has no wall. **Verdict: 92% sample, 8% architecture, with
the architecture half pointing the RIGHT way. No cure is owed.**

### §0.3a · ⭐ THE ONE AUTHORITATIVE FIGURE SET — use these, not any earlier vintage

**Three vintages of these numbers exist and only this set was re-measured on ONE instrument
(`laneMFW1-receipt.md` §4, every cell executed).** Quoting a mixed vintage silently adds an
instrument correction to a sample change.

> **§205A / §203 AT THE LANDING TIP:** `waterCrossings` **193** · `waterExempt` **28** ·
> `waterViolations` **165** · `bridges` **15** · `riverClaimWidth` **145.4** · `zoneOutside`
> **237** · `zoneMajorityOutside` **217** · `zoneOffBand` **63** · `zoneUnwashedBodies`
> **2,137** · `landlocked` **0** · `orphanStreets` **0** · `physicalViolations` **1**.

⭐ **TWO OF THESE MF-ARCH-2 NEVER REPORTED, AND ONE IS THE WAVE'S LARGEST SINGLE IMPROVEMENT:**
`zoneUnwashedBodies` **HALVED, 4,261 → 2,137**, and `bridges` **20 → 15** — the visible
consequence of the re-rolled river, which belongs beside `waterCrossings` rather than being
discovered later as a surprise.

⚠ **STATE THE MOVEMENT AS ONE MOVEMENT WITH TWO NAMED HALVES, NEVER AS ONE NUMBER.** MF-ARCH's
predicate corrections account for `waterCrossings` **+16**, `waterViolations` **+14** and
`zoneMajorityOutside` **−186** on a **byte-identical fabric**; MF-ARCH-2's fabric change accounts
for the rest. ⛔ **`100 → 165` IS NOT ONE MOVEMENT and must never be published as one.**

### §0.3b · ⚠⚠ THE EXEMPLAR SET IS NOT INDEPENDENT — this caveat travels with every corpus-wide figure

**The 16 exemplar leaves are not 16 worlds. SEVEN share seed `mf-town-01` + riverside** (town ·
siege · plague · famine · year-018 · year-100 · highwater) **and TWO share `mf-city-01` +
coastal** (`laneMFW1-receipt.md` §0). **So a corpus §205A total publishes a ONE-RIVER move up to
SIX TIMES:** the +51 that read as a corpus regression is really *+10 on one river town (×6), +5
on that same town demoted, −7 on one coastal city (×2)*.

⛔⛔ **THE RULE THIS SPEC ADOPTS: ANY "CORPUS-WIDE" EXEMPLAR FIGURE IN THIS DOCUMENT OR ANY
RECEIPT MUST EITHER PUBLISH THE DISTINCT-SITE TOTAL (10 worlds) BESIDE IT OR SAY THAT IT DOES
NOT.** Every count below of the form *"N bodies across 16 leaves"* is a few settlements
multiplied. ⭐ *It is the cheapest structural prevention available and it costs one line in the
harness* — otherwise the next wave will again read a one-river move as a sixfold corpus
regression.

### §0.4 · CONFLICTS FOUND IN THE SOURCES, AND HOW THEY ARE RULED HERE

Four places where two canonical sources disagree. Each is ruled with a reason; each ruling is
vetoable and none of them invents a new law.

| # | the conflict | ruling |
|---|---|---|
| **C-1** | **Paper warmth.** ATLAS §2.3.1 publishes the paper centroid `#FAEBD8`, warmth R−B **34** (the union cohort). ODQ **§249.4(a)** rules that any axis not represented in the register index pins to **HF-1 ALONE**, and that **"paper warmth pins at 37."** The atlas was folded *before* that ruling and still carries 34. | ⭐ **THE ODQ RULING BINDS: paper warmth targets 37.** §249 is the later instrument and it ruled on exactly this sensitivity, which the atlas itself flagged as vetoable in §2.3.0 ("if the chair prefers the lane's original figure, it is warmth 37, and only the paper row changes"). **The ATLAS's §2.3.1 paper row is stale on this one number and nothing else** — every other band is insensitive to the union-vs-HF-1 choice (ATLAS §2.3.0). A builder targets `#F9E9D5`-family warmth 37 within band L 226–244 / warmth 20–50. |
| **C-2** | **The metropolis grain band.** The BUILT `GRAIN_BAND` table (`tierGrammar.js`, `laneMFB8-receipt.md` §1) carries metropolis **100–130**. The corrected ATLAS T-01 **re-pinned it to 80–120** (§244.5, ATLAS §2.1a). | ⭐ **THE CORRECTED BAND BINDS; THE CODE IS STALE.** The 100–130 rung rested on **n=1** (hf34 on MF-S1's window); the re-pin rests on n=9. The generator currently aims at a superseded number. **Re-pinning `GRAIN_BAND` and re-deriving `GRAIN_SEAMS` is a wave-nine first-order edit**, and it moves the metropolis target *down* — which shrinks the reported miss for a legitimate reason and must be declared as such, never quietly. |
| **C-3** | **The thorp and hamlet grain rungs.** ATLAS T-01 ⛔ **WITHDREW** thorp (8–14) and hamlet (18–26) — instrument invalid at tier (§244.5). The BUILT `GRAIN_BAND` still consumes both as **generation** inputs. | ⚠ **THE WITHDRAWAL IS A GRADING WITHDRAWAL, NOT AUTOMATICALLY A GENERATION WITHDRAWAL — AND NOBODY HAS RULED WHICH.** Raised as **CHAIR QUESTION Q-1** (Appendix B) rather than decided here, because deleting the rungs would leave `cells(pop)` undefined below village and inventing replacements would be tuning wearing measurement's clothes. **Interim rule for a builder: the two low rungs keep their current numbers, are labelled UNMEASURED in the code, and no grading verdict may be issued against them.** |
| **C-4** | **`radialDensityFalloff`.** ATLAS **GAP-B** proposes it as a derived statistic *with per-morphology target bands*. PLAN §1.5 finds the radial reading is a **symptom** of age/wealth/land-use and that fitting to it re-bakes the concentric prior. | ⭐ **PLAN'S CORRECTION BINDS, AND ODQ §250.6(b) HAS ALREADY ADOPTED IT AS A GENERAL LAW: a descriptive statistic may be a CENSUS and must be FORBIDDEN as a GENERATOR INPUT.** GAP-B stays as a census with its bands used for *detection*; the generator's inputs are epoch age, ward wealth and land use. |

One further disagreement is **not** a conflict and is recorded so nobody re-finds it: PLAN §8's
grain figures (village 39.2 / town 54.5 / city 62.0 / metropolis 84.3) are a **partial
independent replication** on MF-S3a's own windows, several of which deliberately sit on a
*quarter* rather than a whole settlement (PLAN §8's own ⚠). **T-01's bands remain the target;
PLAN §8's figures are corroboration, and the metropolis rung agrees closely and independently.**

---

## §1 · THE PIPELINE, STAGE BY STAGE, IN DERIVATION ORDER

**The shape of the pipeline, in one paragraph.** A settlement is derived from its dossier in
one acyclic pass. First the world outside it: a region, a terrain substrate, a site chosen
because something is scarce there, and a water system with a direction. Then the settlement's
history is replayed as an ordered ladder of **epochs** — core, circuit, ring, circuit, ring
(§240) — where each epoch is a complete piece of fabric and each circuit bounds an epoch that
already exists. Inside an epoch, the order is **streets → blocks → frontage → plots →
footprints**, never the reverse. After the last epoch, the things that sit *on* the fabric are
placed: institutions by relation, water works by flow, the countryside by its own grammar.
Then the ground law makes every drawn body legal, the censuses prove it, and the lens draws it.

**THE ACYCLICITY RULE THAT MAKES THIS WORK, AND IT IS THE PROGRAM'S HARDEST-WON LESSON
(§241.2, §252.1 — CONFIRMED):** *a derivation cycle is usually a missing version axis.* All
eight cycles the SCC instrument found were **two versions of one artifact sharing one binding
name**. Naming the versions dissolved every one of them with the determinism digest
byte-identical (`laneMFARCH2-receipt.md` §1). **A builder who finds a cycle should look for the
missing version, not reach for a solver** — `wallCycle.js`, the one bounded solver this program
ever wrote, was deleted when the axis became explicit.

### §1.0 · THE STAGE MAP

```
S0   dossier read + identity/version axis          BUILT
S1   REGION                                        NOT BUILT      ← CX-38; several stages wait on it
S2   TERRAIN SUBSTRATE (relief FIELD)              PARTIAL/absent ← CX-02/CX-04; §214's terrain arm is BLOCKED on it
S3   SITE + siteReason                             PARTIAL        ← CX-01
S4   WATER SYSTEM (channel, role, flow direction)  PARTIAL        ← CX-05/CX-06/CX-08
S5   EPOCH LADDER (§240)                           BUILT          ← epochAxis.js
     ── per epoch E, in order ────────────────────────────────────
S6     district organisms / anchors for E          PARTIAL
S7     street web for E                            PARTIAL        ← junction mix, φ, load-derived width all MISSING
S8     blocks as planar faces of the street graph  PARTIAL        ← §239.1 not built
S9     frontage line per block face                NOT BUILT      ← the #1 ranked gap in both studies
S10    plot series (burgage comb)                  PARTIAL        ← landed at B8; rhythm/corner/amalgamation MISSING
S11    footprints (module + outlier budget)        PARTIAL
S12    backland cores + voids                      PARTIAL
S13    CIRCUIT for E (chain of typed runs)         PARTIAL        ← traced and contained; run typing MISSING
S14    circuit demotion of E−1 (the fossil ladder) NOT BUILT      ← §250.5; blocks multi-ring history
     ── after the last epoch ─────────────────────────────────────
S15  extramural: edge kind, faubourgs, ribbons     PARTIAL
S16  institution siting (relational)               PARTIAL        ← scale exists, relations do not
S17  water works + domestic water                  NOT BUILT
S18  countryside: open field, roads, ground        PARTIAL        ← the weakest surface in the program
S19  decay / demotion / state marks                PARTIAL
S20  GROUND LAW (reserved ground, area-true)       BUILT
S21  CENSUSES                                      BUILT
S22  LENS / RENDER (ink hierarchy, painted hand)   PARTIAL
S23  CHROME + LETTERING                            PARTIAL
```

⚠ **S1 AND S2 SIT AT THE TOP OF THE PIPELINE AND ARE THE TWO LARGEST HOLES IN IT.** CONTEXT
§14's one-paragraph answer to §246 is that we would produce *"a plausible settlement with an
implausible relationship to its world"*, and CONTEXT §10 ranks the missing substrate #1 and the
missing region #3 by breadth of effect. **Six of CONTEXT's eight reconstruction traces are hit
by the missing substrate alone.**

---

### S0 · DOSSIER READ AND THE IDENTITY / VERSION AXIS

**INPUTS.** The settlement dossier. The fields the map is entitled to read, **verified from
source, not remembered** (CONTEXT §0.6):

| fact | values | source file |
|---|---|---|
| `tier` | thorp · hamlet · village · town · city · metropolis (6) | `src/components/gallery/galleryUtils.js` |
| `config.terrainType` | plains · hills · forest · riverside · coastal · mountain · desert (**7**) | ibid. |
| `tradeRouteAccess` | port · river · crossroads · road · isolated (5) | `src/generators/economy/upgradeOpportunities.js` |
| `culture` | 11 tokens | galleryUtils |
| `economicState.prosperity` | Struggling → Wealthy (6 bands) | galleryUtils |
| water-bearing terrain | `WATER_TERRAIN = {coastal, riverside}` | `src/generators/terrainHelpers.js` |
| defences | institutions matching `wall · citadel · palisade · earthwork`; `hasWalls` boolean | `src/generators/defenseGenerator.js` |
| also present | `population` · `institutions` · `stressors` · `activeConditions` · `history` · `neighbors` · `factions` · `government` · `resources` · `supplyChains` | `src/domain/settlement.schema.js` |

⭐ **THE SINGLE MOST ACTIONABLE FINDING OF THE ENTIRE STUDY PROGRAM (CONTEXT §14, adopted at
ODQ §251.2):** almost none of the fix is a new rendering capability. It is **four dossier
fields — `supplyChains`, `neighbors`, `institutions`, `resources` — that the map today reads
FOR LABELS AND NEVER FOR GEOMETRY.** Every stage below that says MISSING with a cheap sketch
is, in the main, a stage that consumes one of those four spatially for the first time.

**MECHANISM.** Two things are established before any geometry:

1. **THE VERSION AXIS.** Every artifact that exists in more than one state carries its state in
   its **name**, not in a mutated binding. `builtUmbrella → umbrellaWalled → umbrellaFaced`;
   `packed.parcels → parcelsLawful → closing.accessible.parcels`; `lod.masses → massesLawful →
   drawn.masses`. A stage **returns a version**; it never writes back into a published artifact.
2. **THE IDENTITY AXIS.** Every entity carries a stable lineage id, and every random draw is
   `keyedRandom(seed, …, {variant})` over that id via `fabricForkKey` — never a stream position.

**OUTPUTS.** The dossier projection; the fork-key root; the three content-hash tiers.

**THE THREE HASH TIERS (BUILT, `laneMFARCH2-receipt.md` §5 — CONFIRMED):**

| tier | what it hashes | moves when |
|---|---|---|
| **WORLD** | canonical, ordered, quantized semantic state — bodies by key, rings by epoch, claims, channels, water, district identities. **No ink at all.** | the town changed |
| **PROJECTION** | the command stream with every paint attribute stripped, in document order | what is DRAWN changed |
| **RASTER** | the pixels, through `sharp`/libvips at a fixed size | a reader would see a different page |

⭐ **The first run paid for itself: `town` and `famine` share a WORLD hash and differ in
PROJECTION and RASTER** — the famine leaf's entire difference is outside the legality surface
(its six `stateMarks.marks`). One digest over the SVG could never have said that.
⚠ **WORLD's coverage boundary, stated so it is never over-read:** it covers the legality
surface and the identities — **not** `stateMarks.marks`, the immersion suite, the fields or the
relief. ⛔ The RASTER tier reports UNAVAILABLE and exits non-zero if `sharp` fails to load; it
never reads green when it cannot run.

**LAWS.** §161h §11.0 the inertia law · §241.2 / §252.1 the version axis · §234 one artifact,
one accessor, one proven predicate.
**CENSUSES.** `derivationGraph.walker.test.js` — the declared-cycle roster is **EMPTY**, with a
counterfactual that plants MF-ARCH's own write-back back into the real assembly source and
asserts the walker convicts it; a callee-write-back scan carrying the shape it forbids; the
fork-key scan asserting the assembly mints no bare-seed key. The fork-key ratchet is frozen
EXACTLY at `snapshot.js: 1, substrate.js: 4` with `buildFabric.js` asserted **ABSENT**.
**STATUS: BUILT.** `fabricGeometry.js` (`TOPOLOGY_PLACES`, `q6`, `topoText`, `r2`),
`buildFabric.js`, `tests/lint/derivationGraph.walker.test.js`. Proved by
`laneMFARCH-receipt.md` §5 (keyedRandom + lineage identities) and `laneMFARCH2-receipt.md`
§1/§4/§5.

⚠ **THREE THINGS AT S0 ARE UNFINISHED AND ARE NAMED IN THE RECEIPT** (`laneMFARCH2-receipt.md`
§9): the legality geometry is **not** stored on the quantized grid (only serialization is
fixed-precision, and quantizing storage moves every pixel and owes its own equivalence proof);
`substrate.js` carries a **second spelling** of the reroll salt (4 sites) that is correct but
duplicated; and the domain's content hash is still **4×32 bits** from `fabricRng.hash32` — the
sha-256 tiers live in the harness, not in the domain's staleness detector.

---

### S1 · THE REGION — **NOT BUILT** (CX-38)

**INPUTS.** `neighbors` (which exist, at what distance, of what tier) · `trade` /
`tradeRouteAccess` · `resources`. **All three exist in the dossier today** (CONTEXT §8.2).

**MECHANISM.** *Before* the settlement, derive a minimal region: neighbours at real distances,
roads between them carrying **ranks**, one water system, one resource catchment. The region
then fixes (a) where the settlement sits, (b) the **true bearings** of the approach roads,
(c) which gates exist and which carry weight, and (d) the extramural ordering along each road.

**OUTPUTS.** `region { neighbours[], roads[] with rank+bearing, waterSystem, catchment }`,
content-hashed and consumed by S3, S7, S13's gate stage and S15.

**LAWS.** §161a already states the half of this that is ruled — *"tradeRouteAccess sets road
count and grade quality; the neighbour link sets the main road's true exit bearing"* — and
§164a's neighbour-edge constraints. **Nothing derives the region as an object.**

**CENSUSES.** Every approach road's bearing traces to a named neighbour or a named resource;
zero roads with an invented bearing. Gate weight ordering equals road rank ordering.

**STATUS: NOT BUILT.** CONTEXT ranks it **#3 by breadth** (5 of 8 traces) and marks it a
**sequencing** finding: **CX-01 (siting), CX-15 (gates as typed road terminals), CX-22 (which
gate grows a suburb), CX-25 (road furniture and the day's-travel rule) and CX-32 (toll
avoidance) all wait on it** (CONTEXT §11.2 rank 3). PRIOR-ART independently supports the shape:
FMG's whole strength is a world model that derives settlement facts, and its
**relational-viability rule** — *a port with no counterparty is not a port* — generalizes to a
contradiction census we can run once a region exists (PRIOR-ART §7 rows 4, 5, 8).

⚠ **A settlement generated without a region will always look dropped rather than grown**
(CONTEXT §8.2). That is the sentence a builder should keep.

---

### S2 · THE TERRAIN SUBSTRATE — **PARTIAL, AND EFFECTIVELY ABSENT** (CX-02, CX-04)

**INPUTS.** `seed` · `config.terrainType` (7 tokens) · `resources` · water facts ·
`tradeRouteAccess`.

**MECHANISM.** A coarse, deterministic height / land-form grid per settlement, exposing four
derived layers:

1. **gradient** (magnitude) — drives hachure spacing, street grammar selection, terracing;
2. **aspect** (slope orientation) — ⚠ **NOT DERIVABLE TODAY**, see below;
3. **land-form class** (slope / cliff / crag / bench / marsh / flat / rock) — selects the
   drawn relief vocabulary;
4. **`buildable` mask** — the hard bound for every later growth epoch, computed from four
   refusals: **inundation · gradient · aspect · contamination** (CX-02).

**THE REFUSAL RULE, which is the whole point:** the settlement outline is the **complement of
the land the fabric refuses**, plus the epoch model — never a shape that is then clipped
(CONTEXT §1.2). §239.1 (block termination at hard edges) and §232 (the wall as a partition)
already supply the *stopping* machinery; what is missing is **something to stop against**.

**OUTPUTS.** `substrate { height, gradient, landForm, buildable }` — deterministic, nothing
persisted (§161 LAYER ZERO), content-hashed.

**LAWS.** §161 the terrain-first law (*"randomness proposes; terrain disposes"*) · §161a
substrate inputs broadened (ore→workable slopes+spoil, fisheries→shore+shoal, timber→standing
forest, quarry→exposed stone) · §161b the terraforming law with the **visible-work rule** (every
terraform leaves its workings legible in ink; an invisible edit reds the consistency pin) ·
§214 the iconography law's terrain arm.

**CENSUSES.** Substrate-vs-facts consistency (a pinned test per §161): every canonical input —
not `terrainType` alone — is expressed in the ground. Zero fabric on `buildable == false`.

**STATUS: PARTIAL, and the honest reading is *absent*.** b6 carries a **single `RELIEF 0.30`
scalar** in the cartouche (ATLAS Table C; CONTEXT §1.2). There is no field, no gradient, no
aspect, no mask. Charter §9.5b's RELIEF LAW is written (§177.2) and §214 is ruled.

⛔⛔ **THE SEQUENCING FINDING, RULED AT ODQ §251.4(a) AND RECORDED NOWHERE BEFORE CONTEXT FOUND
IT: §214 IS BLOCKED.** Its terrain arm — hachure whose spacing tightens with gradient, crag
hatch selected by land form, terraces following each band's own curve — **has no relief field
to consume**. §214's terrain arm is **re-sequenced behind the substrate**; its
**wall/iconography arm may proceed**. This is the single most consequential sequencing finding
in the study program and a builder who ignores it will write §214's terrain code against a
scalar.

⚠ **ASPECT IS NOT DERIVABLE TODAY AND MUST NOT BE INVENTED.** There is no sun bearing, no
prevailing-wind bearing, no slope orientation — and the §7/E8 correction already established
that no bearing field of any kind exists. CONTEXT §1.2 measures aspect as a **hard mask** in the
corpus (hf355's shaded shore empty and its sunny shore strung with villages; hf283's frost
hollow left unplanted). ⛔ **A bearing minted at generation becomes a SEED-PERMANENT WORLD FACT
under THE PROMISE.** CONTEXT filed it as inspiration and ODQ §251.5 recorded it as owner-gated
and **not proposed**. It stays in Appendix A.

---

### S3 · THE SITE, AND WHY IT IS THERE — **PARTIAL** (CX-01)

**INPUTS.** `config.terrainType` × `tradeRouteAccess` × `resources` × `history.foundingKind` ·
the S2 substrate · the S1 region.

**MECHANISM.** ⭐ **THE SITING LAW: A SETTLEMENT SITS AT A SCARCITY, NOT AT A CENTRE**
(CONTEXT §1.1 — the strongest single generalisation in that half). Derive a `siteReason` from a
**closed enumeration**: `ford · bridge-point · pass · gap · spur · knoll · harbour · cove ·
spring · spring-line · dry-ridge · confluence · head-of-navigation · portage · resource ·
junction`. The chosen reason then (a) fixes the anchor point on the substrate, (b) is the single
seed for the approach-road bearings, and (c) **is DRAWN** — the scarce thing is rendered and the
abundant thing is rendered as its foil.

**THE EVIDENCE, and it is unusually strong [M-view, CONTEXT §1.1]:** of the 12 plates that lane
opened, **11 place their settlement at a nameable scarcity, and in 9 of those the scarcity is
drawn LARGER than the settlement itself.** The negative case proves it — hf349's karst country
carries a great empty quarter with no settlement at all, because there is no water there.
**The corpus draws where people are NOT, and that emptiness is what makes the placement read as
a decision.**

**THE POLYCENTRIC ARM (§161, ruled).** Two strong non-adjacent sites connect by **road first**,
and ribbon development along that road shapes the town — the dumbbell and linear forms. PLAN's
TRACE 3 (hf72) confirms this is our **best current case** and the right first target.

**OUTPUTS.** `site { anchor, siteReason, secondNucleus? }`.
**LAWS.** §161 (sites are FOUND not PLACED: suitability field → best site(s)) · §161's
polycentric subseed law · §161c (a strong OUTLYING institution can be a second nucleus).
**CENSUSES.** Every settlement carries a `siteReason` from the closed enumeration; zero
settlements sited without one. The scarce feature is present in the drawn output.
**STATUS: PARTIAL.** §5.0b gives a water *mode* and b6 declares it in the cartouche — ATLAS
T-12's verdict is ★ **MEETS**, and the declaration is *"something no reference does"* (ATLAS
Table A). What is missing is that the mode is a **property** of the settlement rather than a
**point** on a substrate: nothing places the settlement AT a feature and nothing draws the
scarcity. **The missing piece is S2's substrate plus an anchor rule — not a new dossier fact.**
PRIOR-ART §7 row 4 offers a cheap, fully-derived **suitability field** construction (terrain,
hydrology, coast, resources) as approach for the anchoring term §161d already names.

---

### S4 · THE WATER SYSTEM — **PARTIAL** (CX-05, CX-06, CX-07, CX-12)

**INPUTS.** water mode (§5.0b) · `terrainType` · the S2 substrate (water obeys height) ·
`tradeRouteAccess` · `institutions` (port, mill, tannery, dye, fulling) · `supplyChains`.
⛔ **MISSING INPUT — THE BEARING TO WATER.** See §1.2's checklist row `sea` and gap **G-4**: we
derive water *mode* and not water *direction*, and a coastal settlement's whole plan orients to
the water. **Its derivation home is the S2 substrate (§161a), never a minted bearing** (§1.2).

**MECHANISM — three axes, not one.**

1. **MODE** (§5.0b, exists): THROUGH · BANKSIDE · NEAR · NONE/WELL.
2. ⭐ **ROLE (CX-05, MISSING): EDGE · SPINE · OBSTACLE.** CONTEXT §2.1's finding is that the
   mode **does not determine morphology** — *a class-4 river can be an EDGE, a SPINE or an
   OBSTACLE and the three produce opposite plans.* Shipping §205.2's width ladder without a
   role *"will change a width and nothing else"* (CONTEXT §11.1).
3. **CLASS** (§205.2, ruled, deferrable with cause): brook · stream · river · great river,
   derived from watershed + trade function + port presence. ATLAS T-13 supplies the four-rung
   visual ladder and confirms the contradiction census's premise — **every plate with a port or
   a fish market sits on class 3 or 4, and no trade settlement in the corpus sits on a brook.**

**THE FLOW DIRECTION IS THE PART THAT UNLOCKS EVERYTHING DOWNSTREAM.** The channel gets a
**directed centreline**. Without it, S17's ordered chains cannot exist and the pollution
geometry has no sign.

**THE SECOND-BANK RULE (CX-06).** One bank always builds first. ATLAS banned prior #10:
symmetric two-bank development on a THROUGH river is a defect (hf16 mirrors its banks; hf30
does it right at ~70/30). ATLAS T-12: **every THROUGH settlement must show bank asymmetry.**

**OUTPUTS.** `water { mode, role, class, centreline (directed), banks[], claim }`.
**LAWS.** §205.1 navigability — the channel is a RESERVED RIGHT-OF-WAY, bridges SPAN and never
dam, quays project from the bank, water gates open through the wall at the banks · §205.2 river
class follows function · §5.0b.
**CENSUSES.** §205A water right-of-way: **0 drawn bodies in the channel** over 23,391 bodies,
**AREA-TRUE** (BUILT — `laneMFARCH2-receipt.md` §0). Exemptions are a **register with asserted
predicates**: a bridge is exempt if a DECK covers the crossing (SPANNING); a quay/port/mill/
ferry if BANK-ROOTED (a corner on the dry side); a water gate as §161m.3 itself
(`laneMFB8-receipt.md` §6). The trade-on-a-brook contradiction census (§205.2) is unbuilt.
**STATUS: PARTIAL.** The channel is claimed and enforced area-true; the coast claims its shore
(cured at B8 — `waterClaims` returned `[]` for anything not a river, so three coastal leaves
DREW a 10.0-unit water edge and CLAIMED 0.0). ⛔ **MISSING: the role axis, the directed
centreline, the width ladder, the second-bank rule, and the join/divide consequence (CX-12).**
✅ **`waterViolations` at 165 is CHARACTERIZED** (§0.3, §0.3a) — a re-rolled meander, not a
regression. ⛔ **But the §205A exemption machinery is structurally broken: 72% of street-over-water
violations cannot be exempted BY CONSTRUCTION (G-34, §4.1a), and the street arm was designed for a
RIVER and is applied to a COAST** — a shore-parallel road scores **775 "crossings" on `city` and
555 on `fjord`**, so **the coastal leaves dominate the corpus street total and the figure is not
comparable across terrains.**

---

### S5 · THE EPOCH LADDER — **BUILT** (§240)

**This is the spine of the whole pipeline and it is the one large thing that is finished.**

**INPUTS.** `tier` · `population` current and **high-water** (§161f) · `history` founding kind,
promotion events, prosperity history, recorded fortification events · `meta.hasWalls`.

**MECHANISM (§240.1, verbatim law).** Even a fresh walled settlement generates in **ORDERED
EPOCHS**: build the inner core, **STOP**, build the wall that completely bounds it, **THEN**
build the districts expanding outside it, repeated for as many rings as are appropriate. The
chain `core(E0) → wall(E0) → ring(E1) → wall(E1) → ring(E2)…` is **ACYCLIC BY CONSTRUCTION**,
with epoch index playing the role year plays in §239.

**THE LADDER, AS BUILT** (`epochAxis.js`; `laneMFARCH2-receipt.md` §2.2). A circuit is raised
when a settlement **passes a tier threshold**, and §5's footprint bands supply the extent as
arithmetic:

```
extent(t) = FOOTPRINT_R × √(TIER_PROFILE[t].footprint[0]) ÷ today's built radius
            town 258.5u    city 352.2u    metropolis 429.5u
```

⚠ **THE `TIER_PROFILE` FOOTPRINT BANDS ARE THIS PIPELINE'S ONLY POPULATION→EXTENT RELATIONSHIP,
AND THEY HAVE NO MEASURED DERIVATION HOME.** ATLAS's own fit was withdrawn (§249.4c records it
**UNRESTORABLE from the corpus**). §1.2's checklist supplies the one piece of external evidence
we have — see gap **G-5**.

Three gates, **all facts, none of them a dial** (§240.2's binding condition — *ring count is
DERIVED, never a knob*):

1. **THE VINTAGE IS THE GATE.** No recorded founding age ⇒ ONE circuit on today's fabric,
   **understated rather than invented**.
2. **A LATER CIRCUIT IS EARNED**: the previous ring must enclose ≤ **0.86** of today's extent.
3. **THE TIER CAPS HOW MANY A SETTLEMENT MAINTAINS AT ONCE** (`TIER_CIRCUIT_CAP`).

⭐⭐ **AND WHEN THE CAP BINDS, A SETTLEMENT KEEPS ITS CURRENT CIRCUIT AND REMEMBERS ITS FIRST.**
That is history rather than convenience: the intermediate ring is the one demolished and built
over as the city expanded past it; the first survives as the change of GRAIN §11.1 draws; the
last survives because it is still the wall.

**THE CIRCUIT OF EPOCH E IS TRACED FROM EPOCH E's OWN FABRIC** — `builtUmbrella.epochCircuitRing`
cuts the **same cells** the built umbrella was made from, at the epoch's extent, and closes them
at the same `WALL_CLOSE_FRONTAGES` radius. ⛔ **What it replaced was worse than "missing": the
older ring used to be `shrinkAbout(todayOutline, centroid, ratio)` — a SCALED COPY of the modern
silhouette.** A pin now compares the metropolis's two rings as normalized radius profiles
(scale removed) and asserts they are **NOT** the same shape.

⭐⭐⭐ **THE CONTAINMENT RULE, banked as law after four measured wrong answers (§252.2): A
CONTAINMENT CLAIM MUST BE MADE AT THE RESOLUTION THE BOUNDARY IS ALLOWED TO HAVE.** A 20-facet
stone curtain **cannot** contain a 2,300-point outline — the polygon has no degrees of freedom
left. The epoch is therefore `resampleClosed(body, facets)`, the epoch **at the wall's own
resolution**, and the fabric between that hull and the raw body is **by derivation the next
epoch**. Nothing is clipped; ground is attributed. Two riders: **terrain service is subordinate
to containment** (the wall may climb the rise, it may not walk through the town), and the
closure runs **last, on a densified epoch**, as a capped monotone sweep (6) — not a solver —
with every circuit publishing its own `containmentResidual`, pinned at 0.

**OUTPUTS.** `node.epochs` (the whole ladder, suburb included, each walled entry carrying its
`body` and `containmentResidual`); per ring `epoch`, `epochHull`, `containmentResidual`,
`closedPolygon`. Per-epoch keyed RNG streams (`wall.epoch.k`). ⚠ `epochHull` and `closedPolygon`
are **DIAGNOSTIC, not a law surface** — a consumer measuring legality against them reads an
unverified copy.

**MEASURED, EVERY WALLED LEAF (CONFIRMED, `laneMFARCH2-receipt.md` §2.2/§2.7):**

| leaf | tier | rings | epoch extents |
|---|---|---|---|
| town · siege · plague · famine | town | 1 | 0.836 → suburb |
| polycentric | town | 1 | 0.840 → suburb |
| city · migration | city | 2 | 0.660 · 0.899 → suburb |
| metropolis | metropolis | 2 | 0.585 · 0.972 → suburb (**3 earned, 1 absorbed**, cap 2) |
| highwater | city (demoted) | 2 | 0.734 · 1.000 |
| year-100 | town | 1 | 1.000 (vintage unknown — understated) |
| thorp · hamlet · village · mountain · fjord · year-018 | — | 0 | **one unwalled epoch** |

**⇒ 0 of 15,176 epoch members outside their own circuit** (MF-ARCH measured 1,331 of 19,563 =
6.8% before the cure), and **4,607 bodies are EXTRAMURAL BY DERIVATION** — the suburb arriving
as a consequence of the law, not as a knife falling.

⚠ **THE CENSUS'S EPOCH ASSIGNMENT IS A FACT ABOUT THE FABRIC, NEVER "IS IT INSIDE THE RING".**
A body belongs to the innermost epoch whose **hull** contains it — the fabric the ring was traced
FROM, one derivation step BEFORE the ring. Defining membership by the ring would be the
self-referential pin class and the "0" would be worth nothing.

**LAWS.** §240 (all four clauses) · §239.3 the wall's temporal primacy · §161f continuous scale
and the high-water law · §232 the wall as a district partition · §252.2 containment resolution.
**CENSUSES.** Containment residual 0 on **every ring of every walled leaf**; epoch members
outside own circuit 0 of 15,176; the shape pin (two rings, scale removed, must differ); the
epoch-relabelling refusal in the content hash; the two-ended non-vacuity bound (there ARE
members and there IS a suburb). Counterfactual: `boundEpoch` given a trace that steps inside its
epoch **must red**.
**STATUS: BUILT.** `src/domain/townMap/fabric/epochAxis.js` (179 effective lines), amended
`walls.js`, `wallCircuit.js`, `builtUmbrella.js`, `buildFabric.js`, `leafCensus.js`,
`fabricGeometry.js`; `wallCycle.js` **DELETED**. Proved by `laneMFARCH2-receipt.md` §2, collected
at ODQ §252.

⚠ **THREE CARRIED ITEMS A BUILDER INHERITS.** (a) **§240.2 permits a metropolis three circuits
and the code draws two, deliberately** — the third is *derived and withheld by the cap* (extent
0.797), because the §217 metropolis op ceiling stands at 9,700 with 83 primitives of headroom.
**§252.3(a) ruled the cap is the thing to lift, and that it lifts WITH the run-chain, not
before, and then by measurement.** (b) **§240.2's "a village earns zero circuits" is NOT
enforced by this module** — a walled village is the landed model's decision (`meta.hasWalls`),
and no walled leaf in the corpus is below town tier, so nothing tests the difference (J-A2-4,
flagged not settled). (c) `ringsText` now includes the epoch index, so **no stored circuit hash
from any earlier wave verifies**.

⛔ **THE EPOCH LADDER IS A CIRCUIT LADDER, AND THE CORPUS ALSO SHOWS FABRIC EPOCHS THAT NO
CIRCUIT MARKS.** See **CHAIR QUESTION Q-2**.

---

## §1.1 · THE PER-EPOCH LOOP (S6 – S14)

**Everything from S6 to S14 runs once per epoch E, in order, and an epoch is complete before
its circuit derives.** §240.4 names the hazard: **each epoch boundary is an inertia seam —
adding a later ring must NOT re-derive an earlier epoch.** That is the inertia law at epoch
granularity, and it is why per-epoch keyed streams (`wall.epoch.k`) exist: one stream walked in
ring order means adding a later circuit re-rolls every gate of an earlier one, and the outer
ring is traced FIRST, so the earlier epoch is exactly what would move.

**THE THREE DIALS EACH EPOCH MUST CARRY, MEASURED (PLAN §6.2 — [M, CONFIRMED] on within-plate
pairs).** This is the calibration §240.3's vintage triad needs, and without it the epoch axis is
structurally correct and **visually inert**:

| plate | pair | grain (cells across) | φ | dead-end share | X share |
|---|---|---|---|---|---|
| hf26 | old fabric → new quarter | **46.9 → 16.3** (2.9× coarser) | 0.069 → **0.652** | 0.164 → 0.198 | 0.023 → 0.020 |
| hf274 | Oldbank → Newcharter | **47.2 → 26.6** (1.8× coarser) | 0.131 → **0.318** | 0.225 → **0.342** | 0.023 → 0.013 |
| hf239 | vicus → castra camp | 30.0 → 33.8 (≈flat) | 0.074 → **0.585** | 0.189 → 0.140 | 0.028 → **0.088** |
| hf347 | core → outer ring | 17.4 → 9.8 (1.8× coarser) | — ⚠ | 0.182 → 0.200 | 0.000 → 0.000 |

1. **GRAIN COARSENS with each newer epoch, by 1.8× to 2.9×.** Counter-intuitive and true: a new
   quarter is laid out on cheap land at a generous module; the old core has had centuries of
   subdivision. ⚠ **Old cores are the finely subdivided ones** (§250.4).
2. **ORDER RISES sharply with a newer *planned* epoch — φ by 2.4× to 9.5×.** ⭐ **But hf239
   inverts: its castra grid is its OLDEST epoch. So ORDER TRACKS THE EPOCH'S FOUNDING MODE, NOT
   ITS AGE.** "Newer = more regular" is a tendency; "planned = more regular" is the law.
3. **DEAD ENDS RISE in a young epoch that is not yet full** (0.225 → 0.342), because streets are
   laid before the fabric that would connect them.

**⚠ MAX 4 LEGIBLE EPOCHS ANYWHERE IN 313 PLATES** (PLAN §6.1) — thorp/hamlet 1 · village 1–2 ·
town 2–3 · city 2–4 · metropolis 3–4. **A five-ring settlement is outside everything the corpus
draws**, and this independently corroborates §240.2's derived ring ceilings.

**THE ATTACHMENT MODE (PLAN §6.4 — PARTIAL).** Each epoch selects one of four modes from the
facts, and each mode is a different growth run:

| mode | what it does | selected by |
|---|---|---|
| **RING** | wraps the existing mass | a circuit to wrap, or a roughly isotropic hinterland |
| **RIBBON** | extends along a road or shore | a strong single axis — `tradeRouteAccess`, the neighbour link |
| **NEW QUARTER BESIDE** | a planned block on fresh ground, **at its own bearing**, separated by a street or an edge | a charter event, a fire/sack licensing a replan, an authority able to impose a plan |
| **INFILL** | consumes backland inside the existing outline | slow growth (fast growth extends; **slow growth infills** — derivable and very legible) |

⭐ **The relation rule that recurs: a new epoch does not overwrite the old; it ABUTS it, and the
seam is a STREET.** The one exception is infill, which is precisely the mode that *does*
overwrite — which is why it is the mode that erases history.

---

### S6 · DISTRICT ORGANISMS AND ANCHORS FOR EPOCH E — **PARTIAL**

**INPUTS.** `institutions` with their attribution (§161l) · `factions` / `government` /
`powerStructure` · `wardWealth` / `prosperity` · the S2 suitability and siting rings · epoch
index and its attachment mode.

**MECHANISM (§161d/§161e, ruled, and the corpus confirms it strongly).** Growth is
**PER-DISTRICT**: each district anchors at (suitability × affinity × siting ring) and accretes
outward at a rate ∝ its economic weight and age. **The lobe count is DECIDED** — it equals the
independent anchors the facts support. The settlement outline is the **UNION UMBRELLA**: meeting
frontiers become seam streets, unmet gaps stay interior greens.

Three sub-laws (§161e), all corpus-confirmed:

- **THE RESIDENTIAL-MATRIX LAW** — housing is connective tissue everywhere; district character
  is a **layer over** the matrix; a dwelling-free district is a bug. **PLAN §4.3 confirms this
  without exception in the plates it read** — the tanners' ground has tanners' houses; the
  shipyard has shipwrights' terraces; the mining town's dressing floors sit among ordinary
  dwellings. ⭐ **VERDICT: HAVE.**
- **THE MULTIPLICITY LAW** — the same type instantiates multiple organisms where facts support:
  parishes plural, markets by good, two poor fringes.
- **THE OVERLAP LAW** — organisms are **INFLUENCE FIELDS, not exclusive polygons**; parcels
  sample the strongest local field; era-legal mixing by **parcel-grain dithering** (flat
  per-parcel character, salt-and-pepper frontiers, **never a blended wash**, since §9 forbids
  gradients); labels name only the locally dominant field.

⭐ **PLAN §4.2 IS THE STRONGEST CONFIRMATION IN THE STUDY PROGRAM.** The corpus **never** draws
a settlement as a partition of named quarters: 2–5 districts are strongly characterised, the
rest is undifferentiated residential matrix carrying no district identity at all, boundaries are
**not drawn** (the corpus reserves drawn boundaries for *jurisdictions* — a ward bound, a dual
lordship — never for character zones), and boundaries read as a **change of grain over 1–3
blocks** except where a hard edge makes the change abrupt. §161d + §161e + §167 together predict
exactly what the corpus draws. ⚠ hf40 is the exception that proves it and the corpus's own
defect list flags it: its rich/poor divide is a **single clean line** and it reads as the least
convincing thing on an otherwise superb plate (ATLAS banned prior #11).

**LEGIBLE DISTRICT COUNTS [E, PLAN §4.1]:** thorp 0–1 · hamlet 1 · village 1–3 · town 3–6 ·
city 5–9 · metropolis 8–14. ⭐ **The counts are far lower than the number of LABELS the plates
carry** — hf331 carries a dozen named things and reads as **four** districts. **Legibility
saturates well below enumeration.**

**ADJACENCY, positive and negative [E, PLAN §4.2].** Recurring pairs: castle ↔ its own precinct
wall, never directly onto poor fabric · market ↔ the widest street junction · noxious trades ↔
downwind AND downstream AND at the edge, **never adjacent to a religious precinct** · port/quay
↔ warehouse ranks ↔ merchant houses, in that order inland · poor fringe ↔ the wall's least
valuable arc and outside it. **Pairs that essentially never occur: market ↔ noxious; religious
precinct ↔ noxious; castle ↔ market directly** (there is always fabric or a forecourt between
them).

**OUTPUTS.** `organisms[]` with anchor, field strength, wealth, land use, **grain target**,
**bearing basis** and **φ target**.

**LAWS.** §161d · §161e · §161l attribution (districts are CONSTITUTED by their members; the
FOUNDING RULE — unhoused peers SEED the to-be-constructed district) · §167 the affinity matrix ·
§232 the wall as a district partition (a district touching the wall **CLIPS** at it; extramural
faubourgs form their **OWN** districts, never an intramural district's extension).

**CENSUSES.** §232 district straddlers **0** (BUILT, pinned green — 14 straddling districts of
46 pre-cure, worst 26.8% of the government quarter across its own wall). §203 arm 1 zone
containment, asked of the **partition grid** and never of the click region (J-B8-11). Zero
dwelling-free districts.
⛔ **MISSING: GAP-H, the district-legibility census** — *no law says districts must be legible
WITHOUT their labels*. PLAN §4.2 supplies the discriminator and the measured separations
(hf26 old vs new **2.9×** grain; hf274 old vs new **1.8×**; hf40 rich vs poor 1.25× in grain but
~3× in footprint size by eye). **PROPOSED BAND: neighbouring characterised districts differ by
≥1.4× in median block area OR ≥1.3× in cells-across. Below that they are one district wearing
two names.**

**STATUS: PARTIAL.** The organism model, the umbrella union, the §232 partition and the zone
containment census are BUILT (`districtPartition.js`, `leafCensus.js`;
`laneMFB8b-receipt.md` §3, `laneMFB8-receipt.md` §5). ⛔ **MISSING:** the per-organism **grain**,
**bearing basis** and **φ** targets (PLAN §1.5, §6.2 — the epoch dials); the label-free
legibility census; the wealth→**geometry** coupling (§1.5 below).

⚠ **A MEASURED TRUTH-SURFACE DEFECT IS OPEN AND OWNER-GATED.** `zoneClickCoverage` reads
**town 0.50 · city 0.57 · metropolis 0.83** — *half a town's fabric belongs to a quarter whose
click region does not cover it.* A reader can see the quarter and cannot click it. Curing it
means changing the landed **one-element-per-district-id** contract that five UI suites
hit-test — an owner-gated public surface, **reported not taken** (`laneMFB8-receipt.md`
§5/§10.4). The related **faubourg district-id change** (`${parent}~faubourg` +
`wallSide`/`parentDistrictId`) is owner-gated and **stays parked** (§238.4b).

⭐⭐ **THE CLASS THAT PRODUCED THAT FINDING, AND IT GENERALIZES: A UI SUMMARY OF A FACT IS NOT
THE FACT.** §203's containment census read **36% failure** against the click region and **1.65%**
against the ground, because `umbrella.partition` publishes one region per district id and only
its largest traced component — by design, for a landed contract.

---

### S7 · THE STREET WEB FOR EPOCH E — **PARTIAL, AND THIS IS THE PIPELINE'S SHARPEST GAP**

**INPUTS.** organism anchors and their bearing bases · the region's approach roads and their
ranks (S1) · gates (S13) · the substrate's gradient (S2) · `institutions` as origins and
destinations · `foundingKind` × `lawfulness` × epoch (the φ and X budgets).

#### §1.1.7a · THE JUNCTION-MIX LAW — **MISSING** (PLAN §1.1, adopted at §250.2)

⭐⭐ **THE SHARPEST SINGLE NUMBER IN THE STUDY PROGRAM.** [M, CONFIRMED — 35 whole-settlement
windows]:

| node type | min | **median** | max |
|---|---|---|---|
| dead end (deg 1) | 0.110 | **0.209** | 0.391 |
| **T or Y (deg 3)** | 0.510 | **0.653** | 0.738 |
| X (deg 4) | 0.000 | **0.015** | 0.055 |
| star (deg ≥5) | 0.000 | **0.000** | 0.009 |
| **X : T ratio** | 0.000 | **0.024** | 0.085 |

**The corpus's median settlement has FORTY-THREE T-junctions for every X-junction.** Not one of
the 35 windows exceeds 5.5% X-nodes; **22 of 35 have zero nodes of degree ≥5.**

⭐ **WHY THIS MATTERS MORE THAN ITS SIZE SUGGESTS: a naive street generator — one that lays a
mesh, connects points by shortest paths, or grows a lattice — produces X-junctions as its
DEFAULT. The X-junction is a design act; the T-junction is a growth act.** And ⛔ **nothing in
§201/§202 constrains it: an all-X lattice satisfies every access and attachment law we have**
(§250.2). §201.2 gives a connectivity floor; §202 gives reachability; neither constrains the
*shape* of attachment.

**MECHANISM.** Streets are generated by **ATTACHMENT, NOT INTERSECTION**: a new segment is
seeded at a point **on an existing segment** (creating a T) and grown outward until it meets a
hard edge (wall, water, cliff, another street) — and the meeting is resolved by **terminating at
the frontage**, not by crossing it. **An X may only be minted when two arterials of the same
rank cross, and that event is budgeted, not free.**

**MESH QUALITY, narrow and diagnostic [M]:** mean degree **2.13–2.67 (median 2.47)** ·
edge/node ratio **1.17–1.55 (median 1.40)** · γ connectivity **0.393–0.521 (median 0.473)**.
**The corpus draws neither a tree (γ→0.33) nor a mesh (γ→1.0); it draws a HALF-MESH WITH A
STRONG T BIAS.**

**CENSUS BANDS (per leaf, and per epoch where an epoch is legible):**
`X:T ≤ 0.09` · `deg≥5 share ≤ 0.01` · `γ ∈ [0.39, 0.52]` · `mean degree ∈ [2.1, 2.7]`.
**DERIVATION HOME.** T:X is driven by **founding kind × lawfulness × epoch**: a founded-planned
settlement (castra, bastide, charter borough) earns a **higher X budget in the epoch that was
planned and only there**; organic epochs get near-zero. §11.2's order drift moves the budget
over time. ⚠ **PLAN's TRACE 7 (hf239) makes the point sharply: the castra camp carries the
corpus's HIGHEST X share (0.088), and a global low-X rule would flatten it. The X budget must be
EPOCH-SCOPED.**

#### §1.1.7b · ORIENTATION-ORDER φ — **PARTIAL** (PLAN §1.2, adopted at §250.3)

Boeing's orientation-order φ (36 bins, bidirectional, length-weighted; 0 = maximally
disordered, 1 = a perfect single grid). **[M, CONFIRMED.]**

- **Whole settlements: φ 0.044 – 0.103 (median) – 0.433** — strongly disordered as wholes.
- ⭐ **The discriminator lives INSIDE the plate**: hf239's castra grid **0.585** vs its own vicus
  **0.074** (7.9×); hf26's Quartiere Nuovo **0.652** vs its surviving old fabric **0.069**
  (9.5×); hf274's Newcharter **0.318** vs Oldbank **0.131** (2.4×). All three rest on 76–136
  nodes and were **visually verified** — the camp skeleton traces the real *via principalis*.
  ⚠ hf347's core φ (0.707) rests on 11 nodes, is **not trustworthy**, and is used in no
  conclusion.

⭐ **PLANNED FABRIC NEVER REACHES φ=1. A PLANNED QUARTER THAT MEASURES φ > 0.8 IS DRAWN WRONG.**
The most rigidly planned quarter in the studiable corpus measures 0.652.

⭐ **φ AND X:T ARE TWO INDEPENDENT DIALS AND A PLAN NEEDS BOTH SET.** hf26's new quarter is at
φ 0.652 with an X share of only 0.020, because its grid is a **ladder** (one spine, rungs off
it) rather than a lattice.

**MECHANISM.** Each **epoch/organism** carries its own `orientationOrder` target and its own
**bearing basis**. Street bearings inside that organism are sampled from a von-Mises-like
distribution around the basis whose concentration is set by the target φ: organic → near-uniform
(φ→0.05–0.12); planned → two-lobed at 90° (φ→0.35–0.65) **with mandatory jitter** so it cannot
exceed ~0.7.
**DERIVATION HOME.** `foundingKind` × `epoch` × `lawfulness` × **event history** (a fire or a
sack licenses a *replanned* epoch — that is hf26 exactly).
**VERDICT: PARTIAL.** §5.0 and §11.2 name regularity as a dial and §161d gives per-district
grain angles. **Missing: a measurable target, the φ>0.8 ceiling, and a census that reads φ back
off the drawn geometry.** It is cheap — a histogram over drawn segment bearings — and it is the
**only number in this program directly comparable to published human-settlement figures.**

#### §1.1.7c · STREET WIDTH FROM GRAPH LOAD — **PARTIAL** (PLAN §1.4, corrected at §250.6c)

⭐ **WIDTH IS DERIVED FROM TRAFFIC, NOT ASSIGNED FROM A CLASS LADDER.** Compute a
betweenness-like load on the street graph using the settlement's own **gates, market, quays and
institution anchors** as origins/destinations; bin the load into 3–5 width classes; **the class
ladder is the QUANTISER, not the source** (§250.6c: *"width classes QUANTISE A DERIVED GRAPH
LOAD; they are not the source of width"*). The class **count** available is set by tier. The
widest rung is minted only if a top-rung generator exists (market void, arterial, quay street).

⭐ **PRIOR-ART CONVERGES ON THIS INDEPENDENTLY AND SUPPLIES THE BLUEPRINT.** FMG's road recipe —
proximity graph over anchors → cost-field pathfinding → **REUSE DISCOUNT** → segment splitting →
junction-coherent smoothing — makes hierarchy **EMERGE** rather than be labelled by fiat, and it
is *"the closest thing to a blueprint for our street layer"* (§253.3c; PRIOR-ART §7 row 3).
**ADOPT AS APPROACH, clean-room** (§248.2b — no code is copied). The same machinery re-sorts
under §161h's *"roads follow the money"*.

**MEASURED TARGETS.** Distance-transform width on the street skeleton, normalised to each
window's own cell pitch (**plot-widths**) [M, PLAN §1.4]: p50 **0.44 – 1.77 – 4.90** · p97
**1.24 – 5.72 – 22.07** · **hierarchy depth p97/p50 = 1.79 – 3.32 – 7.30**.
⚠ **THIS IS A DIFFERENT MEASUREMENT FROM ATLAS T-04's SCANLINE RATIO AND THE TWO MUST NOT BE
COMPARED DIRECTLY** — a scanline crossing a street diagonally over-reports its width and a
scanline crossing a square reports the square. Both bands are quoted in §2 with their instrument
named.
At the bottom of the ladder the hierarchy is **genuinely flat** (hf93 hamlet-street 1.79, hf88
thorp-crossroads 2.04): **there is only one class of street.** Towns and cities cluster tightly
at **2.4–4.6**.

#### §1.1.7d · DEAD ENDS ARE A POVERTY AND WATER SIGNAL — **PARTIAL** (PLAN §1.3)

Dead-end share is **not a knob** but a consequence of two derived pressures: subdivision
pressure inside a block spawns cul-de-sac access passages (§201.1b's ratified type), and a hard
edge terminates streets that reach it (§239.1). **[M]** hf40's **poor half carries 38% more dead
ends than its rich half** (0.296 vs 0.215) — *the clearest measured social signal in the graph*.
Canal morphologies raise it structurally (hf235 0.391); compact wall-bounded single-epoch towns
sit lowest (hf60, hf62 both 0.110).
**PROPOSED BAND (PLAN §1.3): rich 0.15–0.22, poor 0.26–0.34, censused per district.**

#### §1.1.7e · THE SLOPE GRAMMARS — **MISSING** (CX-03), blocked on S2

**Two street grammars, and they never mix** (CONTEXT §1.3):
- **CONTOUR-FOLLOWING streets carry the traffic** — long, curving, gently graded, wrapping the
  hill at roughly constant height.
- **FALLING-LINE links carry the pedestrians** — short, straight, steep, running directly
  downslope *between* the contour streets; where the gradient exceeds walking they become
  **stair alleys**, drawn as a ladder of treads with a **beast ramp at one edge**.
- ⭐ **THE BLOCK IS THE RESIDUE**, and it is **long, thin, curved and WEDGE-SHAPED where the
  contours converge.** *That wedge is the tell — it is what a rectangular-block generator on a
  hill cannot produce*, and under §239.1 it falls out for free.
- **The road in and out switchbacks**, and each hairpin is legible.

**[M-index]** contour/switchback/stair-alley/hollow-way/stepped is named on **24 of 138
settlement plates (17.4%)**; `terrace` on **17 (12.3%)**.
**VERDICT: MISSING.** §239.1 gives block-by-bounding-ways and §214 gives the drawn vocabulary;
**nothing generates a street that knows about gradient**, because `RELIEF` is a single scalar.
**This is the highest-leverage terrain mechanism in CONTEXT's half — one constraint on the
existing street derivation, and it converts `terrainType ∈ {hills, mountain}` from a label into
a shape.**

**S7 OUTPUTS.** `streetWeb { segments[] with rank/width/class, junctions[] typed, gates[] }`.
**S7 LAWS.** §190a the right-of-way law (the derived street web is INVIOLABLE GROUND: zero
footprint-street intersections from the square to the last alley; buildings FRONT streets,
yards behind) · §201.2 street attachment (every segment attaches at ≥1 point; alleys explicitly
exempt) · §202 universal access (transitive reachability over streets ∪ alleys ∪ courts ∪
pedestrian gaps) · §11.2 order drift · §239.1 block termination.
**S7 CENSUSES.** §17.4 drawn street right-of-way **0 of 23,391, AREA-TRUE** (BUILT) · §201B
orphan segments **0** with a sever-one-segment counterfactual (BUILT) · §202 landlocked **0**
with a seal-one-gap counterfactual (BUILT). ⛔ **MISSING: `junctionMix`, `orientationOrder φ`,
`streetLoad`, and the per-district dead-end band.**
**S7 STATUS: PARTIAL.** The legality is proven and total; **the SHAPE of the graph is
unconstrained.** GAP-C is BUILT as a reporting census — 6 width classes per leaf at ratios
`1 : ~2.1 : ~2.2 : ~3.6 : ~8.8 : 48–60`, p97/p50 **9.9 / 12.1 / 12.4** at town/city/metropolis
against the organic corpus band 16–30 — *closing, still missing* (`laneMFB8-receipt.md` §7, §9).
⚠ **`laneMFB8-receipt.md` §7 records a real finding for the chair: the market void is present at
EVERY tier including village, where ATLAS T-04 says it belongs to town+.**

---

### S8 · BLOCKS AS THE PLANAR FACES OF THE STREET GRAPH — **PARTIAL**

**MECHANISM (§239.1, ruled).** ⭐ **A BLOCK IS DEFINED BY ITS BOUNDING RIGHTS-OF-WAY, NEVER
GROWN-THEN-CLIPPED.** Where growth meets a hard edge the block **ENDS** and the next block
begins on the far side. The owner's law generalizes to **all** hard edges — wall, street, water,
cliff. §239.1 explicitly names this as *"the structural cause behind the straddling districts
(§232) and the wall-band intrusions (§238)"*.

**THE ACCEPTANCE BANDS THAT MAKE THAT LAW CHECKABLE [M, PLAN §2.1 — 35 windows]:**

| statistic | min | **median** | max | **band to census** |
|---|---|---|---|---|
| elongation (major/minor) | 1.56 | **2.14** | 3.42 | **median 1.6 – 3.0** |
| circularity (4πA/P²) | 0.126 | **0.324** | 0.578 | (descriptive) |
| solidity (area / hull area) | 0.503 | **0.748** | 0.861 | **median 0.60 – 0.86** |
| area ratio p90/p10 | 5.8 | **13.6** | 204.5 | **≥ 6** |

Three readings, each load-bearing: **the corpus does not draw square blocks — it draws STRIPS**
(a block is what is left between two roughly parallel streets); **blocks are systematically
non-convex** (a quarter of a typical block's convex hull is not block — the signature of streets
meeting at angles); and **the area spread is the information** (hf40's 204× is the rich
quarter's great walled courts against the poor quarter's slivers **in one frame**).

⭐ **THE BAND IS ALSO A DETECTOR: a generator emitting median-square, high-solidity blocks has
silently reverted to grow-then-clip even if the code says otherwise.**

**DERIVATION HOME.** None needed — **if the street graph is right, the blocks are right for
free.** That is the point.
**LAWS.** §239.1 · §232.
**CENSUSES.** The three shape bands above. ⛔ Not built.
**STATUS: PARTIAL.** B8 built **plots cut to the block's admissible span** — a quarter-module
probe walks the rank line asking the same questions the culls ask, yielding the **contiguous
admissible spans**, each divided into a whole number of plots that exactly fill it (*"nothing is
left over, because there is no leftover to leave: the module bends to the block"*). ⭐⭐ **That
lever took §202 from 6 landlocked to 0 with ZERO edits to `accessLaw.js`** — the class being *a
repair pass can only reclaim what the cut left legal* (`laneMFB8-receipt.md` §3). ⛔ **§239.1
itself — blocks as planar faces defined by bounding ways — is WAVE NINE FIRST-ORDER and is NOT
BUILT** (§239.5).

---

### S9 · THE FRONTAGE LINE — **NOT BUILT.** The #1 ranked gap in both studies.

⭐⭐⭐ **THE FRONTAGE LINE IS THE CORPUS'S PRIMARY DRAWN OBJECT** (PLAN §10.1). At zoom on any
good plate, what the eye follows is **not** buildings and **not** streets — it is the
**continuous line where the built mass meets the street**, running the length of a block and
broken only at passages. **Buildings are subdivisions BEHIND that line.**

**THIS INVERTS THE NATURAL IMPLEMENTATION ORDER** (place buildings → streets are what is left).

**MECHANISM.** Generate the frontage line as a **first-class object per block face**, then
subdivide behind it. The block face comes from the street graph (S8); the subdivision is S10's
plot series.

**THREE INDEPENDENT LINES OF EVIDENCE CONVERGE HERE** — PLAN §2.3 (the plot series is drawn as
a comb measured from the frontage), §2.4 (the block's face and interior are drawn in **different
registers**: the street face is a continuous ink line at the heaviest fabric weight, unbroken
for the whole block length except at plot passages; the interior is drawn at roughly half that
weight in fragments), and §10.1 (what the eye actually follows). ATLAS **GAP-D** reaches the same
object from the lineweight side and calls the block silhouette *"the single largest
visual-quality lever identified in this study"*. **§250.6(d) records that the #1 ranked gap
independently reproduces MF-S1's un-defer recommendation for §18.5 — confirmed by two studies on
disjoint evidence.**

**LAWS.** §190a's fronting law (*facades ON the street line — the fronting law is what gives a
channel its walls*) · §17.4 · §18.5.
**CENSUSES.** Frontage continuity per block face: the share of a block face's length carried by
a continuous frontage line, banded; passages counted, not gaps.
**STATUS: NOT BUILT as an object.** B8 landed its **consequences** (the two-tier stroke, the
building touching the street line) without the object itself. ⚠ **And the zoom found the cost of
that:** *"BLOCK FRONT LINES RUN ACROSS GROUND WITH NO BUILDINGS ON IT — a rank run whose plots
the culls thinned still emits its full front and back lines, so heavy frontage strokes appear in
open ground"* (`laneMFB8-receipt.md` §14). **A frontage line derived as an object, from what
actually stands, cannot do that.**

---

### S10 · THE PLOT SERIES (THE BURGAGE COMB) — **PARTIAL, and the built half is good**

**INPUTS.** the frontage line (S9) · `tier` × `districtWealth` (module width) · `epoch age`
(amalgamation rate) · `prosperity` **trajectory** (direction) · `institutions` needing frontage
(corner assignment).

**MECHANISM.** A plot-series generator runs along each block face: pick a module width from the
district's own distribution; emit a **run of 2–6 plots** at that width ±10%; apply an
amalgamation/subdivision event whose probability is set by wealth and epoch age; repeat.

⭐ **THE RHYTHM IS THE FINDING, AND IT IS CLUMPED, NOT NOISY** (PLAN §2.3). Adjacent plots share
widths closely — a burgage and its neighbour were laid out together — and the series then
**jumps** at intervals: a double-width plot marking an amalgamation, a narrow one marking a
subdivision. ⭐⭐ **What the eye reads as "hand-drawn" is this RUN-LENGTH STRUCTURE, not
per-plot noise.**

⭐ **A PROSPERING TOWN AMALGAMATES; A DECLINING ONE SUBDIVIDES** — a *directional* signal
derivable from the population trajectory (§161f).

⭐ **THE CORNER PLOT IS A DIFFERENT OBJECT.** At a block corner the plot turns and the building
wraps, producing an **L-footprint**. Corner buildings are consistently **larger** and
consistently the ones drawn with extra articulation. **The corner is where the smithy, the inn
and the shop go, because it has two frontages** — so corners are minted explicitly, get 1.4–2.0×
the module area, and are the preferred anchor for street-facing commercial institutions.

**MEASURED TARGETS (ATLAS T-08, [M] on hf72 and hf56 native crops):** plot depth : width ≈
**4–6 : 1** · the building occupies **30–45% of plot depth at the street end** · the remainder
is yard/toft · buildings **touch the street line** · adjacent plots in a series share widths to
within **±20–40%, never exactly**.

**STATUS: PARTIAL — the module is BUILT, the rhythm is not.** `parcels.js`, landed at MF-B8
(`laneMFB8-receipt.md` §2; ODQ §229.1):

- `PLOT_DEPTH_RATIO` **2.35 → 4.20** at town+ (1.80/1.30 below — *a croft is not a burgage*);
- the building takes **24–52% of plot depth, mean ~0.38** — measured *inside* T-08's band, and
  what appears behind it is the **TOFT**;
- series widths share to ±20–40%, one amplitude per row, per-plot draws inside it, the row
  normalised back onto its block;
- ⭐ **the building TOUCHES the street line** — the front wall used to start `gap × 0.4` behind
  it, *i.e. the frontage line dissolved by a rounding allowance*. The setback is now the
  **exception it was in the record** (one holding in six);
- **31 distinct stroke weights per leaf against b6's ONE** for the fabric.

⭐⭐ **THE FORENSIC ZOOM SAYS THE BURGAGE RANGE WOULD SIT BESIDE THE REFERENCE** —
*"continuous heavy frontage lines with rows of narrow abutting holdings on them, each divided
from its neighbour by a light party line, and long pale tofts running back to a dashed back
lane. This is hf72's structure, and b7 had no expression for it at all"*
(`laneMFB8-receipt.md` §14). **CONFIRMED by chair eyes at §252.3(c).**

⛔ **MISSING: the clumped run-length rhythm, the amalgamation/subdivision event, and the corner
plot as a distinct object.** ⚠ **And the chair's own 3000px zoom at §252.3(c) found the cost:
*several blocks' parallel building bars read MECHANICALLY — plot-width or depth variance too
low*, which is ATLAS banned prior #7's neighbourhood.** That is exactly what the run-length
structure fixes.
⚠ Two zoom defects remain open: **isolated plots carry full-length tofts** (a single surviving
fringe holding draws a 4.2:1 toft into open country, reading as a fence to nowhere), and
**clipped institution solids become spikes** (a large body reduced by the ground law's clipping
to a long dark triangle attached to nothing — *lawful geometry and a bad drawing*; the cure is a
shape-aware clip or a demotion rung for institutions).

⭐ **PLAN's TRACE 8 (hf93 hamlet-street) settles a scope question: the burgage comb is NOT a
town-and-above feature.** It is present at hamlet tier — measured φ 0.433, the highest of any
organic window, *precisely because a single street with a regular toft comb IS an ordered
structure* — and it is what the whole later block structure grows out of. **An additional
argument for un-deferring §18.5, which §209.3 SCOPE-1 already did.**

---

### S11 · FOOTPRINTS — **PARTIAL** (PLAN §3, CX-34)

**⭐ THE CORPUS AVOIDS MONOTONY WITH SIX DEVICES, AND ONLY ONE OF THEM IS PER-BUILDING NOISE.
The instinct is to jitter footprints, and jitter is the WEAKEST of the six** (PLAN §3):

1. **THE TWO-LEVEL FOOTPRINT DISTRIBUTION.** Within a block there is a **module** (the common
   house, repeated with modest variation) and a small number of **outliers** (2–4× module: the
   corner property, the inn, the merchant's house, the workshop range). **A block of 20
   buildings typically shows 16–18 near-module and 2–4 outliers.** ⭐ **The eye reads richness
   from the OUTLIERS, not from the module's variance.**
2. **L-, U- AND COURTYARD PLANS AT THE OUTLIERS.** The outliers change **plan topology**, not
   just size. ⭐ **The single most effective anti-monotony device in the corpus, because it
   breaks the SILHOUETTE, not just the size.**
3. **RUN-LENGTH RHYTHM ALONG THE FRONTAGE** (S10).
4. ⭐⭐ **ORIENTATION DISCIPLINE THAT IS LOCAL, NOT GLOBAL.** Every building in a range shares
   its neighbour's bearing to within a degree or two — they share party walls. But the *range*
   turns with the street, and adjacent ranges on different streets sit at frank angles.
   **The corpus is RIGIDLY DISCIPLINED AT THE RANGE SCALE AND FREE AT THE BLOCK SCALE.** A
   generator that jitters individual bearings destroys the range; one that aligns everything to
   a global grid destroys the block. **THE BEARING CARRIER IS THE STREET SEGMENT, AND BUILDINGS
   INHERIT IT.** *(PLAN calls this "nearly free and the single highest-return item in the
   section.")*
5. **TONE JITTER IN TWO NESTED LEVELS** — a ward-level sub-palette, then a per-building jitter
   inside it (S22).
6. **THE ROOF-TICK VOCABULARY** — gable, hip, cat-slide, cross-gable read as different plan
   marks. Two extra strokes per building.

**THE ORDINARY : NOTABLE RATIO [E, PLAN §3].** Notable structures run **2–5% of footprints at
town scale and 1–2% at city scale**, while occupying **10–20% of built area**. ⭐ **The corpus's
monumental budget is SMALL IN COUNT AND LARGE IN AREA — the opposite of a generator that
promotes many buildings by a small factor.** ⚠ ATLAS T-16 measures b6 at monumentals
**11 / 18 / 26** against the corpus's *legible* budget of town 3–7 / city 4–9 / metropolis 9+,
with a landmark-to-house footprint ratio of ~2:1 against the corpus's **5–12:1**. **We draw too
many, too small.**

#### ⭐ MATERIAL DRIVES FOOTPRINT GRAMMAR — **MISSING** (CX-34), and it is the setting-agnostic promise's structural half

A `buildingMaterial` derived from `resources` × `terrainType` × `culture` selects a **footprint
grammar**, and each grammar carries its **own packing rule, alley-width floor, party-wall
behaviour and corner radius**:

`rectangular row` (timber / stone frame) · `thick-walled courtyard compound` (earth) ·
`pile / boardwalk` (wet) · `rock-cut chamber row` (cliff) · `sod keyhole` (treeless cold) ·
`tent circle` (mobile).

**The evidence [M-view, CONTEXT §7.2]:** hf327 — no stone and no timber ⇒ thick earth walls ⇒
round-cornered compounds ⇒ wall-to-wall packing ⇒ alleys one line wide, dog-legged, dead-ended
⇒ **a grain unlike anything else in the corpus, and legibly a consequence of the building
material.** hf304's specimen sheet captions its eight vernacular dwellings with **invented
country names precisely so the plate teaches that form follows material and climate rather than
culture.**

⛔ **VERDICT: MISSING, and §251.3 adopted the finding: §17.1 (party walls) and §17.4 (fronting)
encode the euro-temperate grammar AS IF IT WERE THE ONLY ONE. The setting-agnostic promise is
STRUCTURALLY unmet, not cosmetically.** hf327 proves a second grammar produces a completely
different plan **from the same population and the same trade**. One enumerated field changes the
entire look of a non-European settlement **without a single new label**.
⚠ **`buildingMaterial` is *nearly* derivable from `resources` — but the mapping from a resource
list to a material grammar affects every footprint and therefore every leaf's geometry, i.e. it
is a declared-shift event.** CONTEXT §12.4 flags it rather than assuming it.

**LAWS.** §190 the non-overlap law — footprints are **MUTUALLY EXCLUSIVE SOLIDS**; density by
**PARTY WALLS** (the terraced-burgage form), never by overprint; the packer enforces
disjointness as a **HARD** constraint and the repair pass demotes or removes with a diagnostic
rather than overlapping · §190a fronting · §190c the worksite habitation law · §161n the
institution-scale ladder (**each rung is a REAL COMPOSITION, never a scaled sprite — the harbour
district has MORE piers, not bigger ones**).
**CENSUSES.** §17 drawn-geometry disjointness **0 intersecting pairs, all 16 leaves** (BUILT,
area-true) with a planted-overlap counterfactual.
**STATUS: PARTIAL.** Disjointness, party-wall packing, the two-tier stroke and the institution
ladder are BUILT. ⛔ **MISSING: the module + outlier-budget structure, the plan archetypes at
the outliers, the bearing-from-street rule, and the material grammar.**

---

### S12 · BACKLAND CORES AND THE VOID HIERARCHY — **PARTIAL**

#### §1.1.12a · THE BACKLAND CORE (PLAN §2.2)

⭐ **THE PERIMETER BLOCK WITH A GREEN CORE IS THE CORPUS'S DEFAULT, AND ITS INCIDENCE IS A
WEALTH READ.** Median block green share (green index `2G − R − B`, calibrated on hf72), [M]:

| window | median block green share |
|---|---|
| hf88 thorp-crossroads | 0.605 |
| hf331 dual-lordship town | 0.395 |
| hf90 thorp-plains | 0.358 |
| hf138 harbor-ribbon | 0.172 |
| hf72 **west (citadel borough)** | **0.126** |
| hf235 city-canals | 0.127 |
| hf72 **east (river borough)** | **0.028** |
| hf40 **rich quarter** | 0.0056 |
| hf40 **poor quarter** | **0.000** |
| hf34 metropolis-capital | 0.000 |

**The gradient is monotonic and it is a LAND-PRICE gradient**: backland survives at thorp scale
(0.36–0.61), thins through town (0.03–0.40), and is **extinguished entirely in the dense city
core and the poor quarter**. hf72 shows the whole gradient **inside one settlement**.
⚠ **HONEST LIMIT, and it binds any use of this number: the measure reads PIGMENT, not land use.
A plate that draws its yards in the same warm tone as its roofs scores 0 regardless. A HIGH
score is strong evidence of backland; a LOW score is NOT evidence of its absence.** One-way test
only.

**MECHANISM.** The block interior is **not empty space left over** — it is a **derived land
use**. After frontage buildings are placed, a `backland` pass fills the residual interior with
yard / garden / workshop / privy / well furniture at a density set by land price. As land price
rises, backland is **consumed by infill**.
**DERIVATION HOME.** `districtWealth` × population pressure (current vs high-water, §161f) ×
epoch age × district type (crafts consume backland for workshops; residential keeps gardens).
**VERDICT: PARTIAL.** §203 arm 2's zone-fill bands are the right home and ATLAS T-05 supplies
the per-district numbers. ⛔ **What is missing is that FILL IS CURRENTLY A SHARE, NOT A
STRUCTURE**: a block at 70% built could be a perimeter block with a garden core or a scatter
with gaps, **and those read completely differently at glance range.**
⭐ **PROPOSED: `backlandCore` as an explicit derived object per block.** This is what makes
§201's alley register and §204's rarity ruling coherent, because **a court is then a backland
core that failed to get a mouth**, rather than a separately-invented feature.

#### §1.1.12b · THE FOUR VOID KINDS (PLAN §5.3)

| kind | drawn as | generated by |
|---|---|---|
| **PUBLIC TRAFFIC VOID** | bounded by continuous frontage, entered by streets, at street tone | market, green, forecourt |
| **PRIVATE ENCLOSED VOID** | bounded by a wall or range, entered by **one controlled gap** | precinct court, cloister garth, inn yard, castle bailey |
| **BACKLAND VOID** | never entered from the street directly; reached through the plot | §1.1.12a |
| ⭐ **AGRICULTURAL / VACATED VOID *INSIDE* THE SETTLEMENT** | orchards, closes, tenter grounds, brickfields, garden plots **inside the wall** | high-water extent minus current fabric |

⭐ **THE FOURTH IS THE ONE A GENERATOR WILL FORGET, AND THE CORPUS DRAWS IT CONSTANTLY** —
hf347's ORCHARDS / CLOSES / TENTER GROUND / BRICKFIELD / BUILDING PLOTS all sit inside the outer
circuit; hf121's outer ring is GARDEN PLOTS & PADDOCKS; hf306's intramural land is NEW FIELDS
and TERRACED GARDENS.
⚠ **MEASUREMENT CAVEAT THAT MUST TRAVEL WITH ANY VOID INSTRUMENT: "largest void" is NOT "the
centre".** On type-4 plates the largest void is the *emptiness* — hf347's largest measures 1009
plot-widths² and is its unbuilt outer ring, not its market. **Separate them by asking whether
the void is bounded by FRONTAGE (a market) or by the WALL (vacancy).**

⭐ **`intramuralVacancy` — the positive generator.** Intramural land not claimed by any district
organism at the current epoch is **dressed as agricultural/industrial ground**, not left blank
and not filled with fabric. Its *area* is exactly §161f's high-water law: the circuit's enclosed
area minus the fabric the current population supports. Its *land use* derives from `terrain` +
`institutions` (a brickfield needs clay; a tenter ground needs a cloth industry — hf347 has both
and both are on the plate).
⛔ **VERDICT: MISSING. §239.4 already RECORDS the dividend** (*"a demoted town's circuit outlives
the fabric that shrank inside it… the historically exact 'half the walled town is fields'"*)
**and nothing generates what fills that ground. Left unfilled it reads as a bug; filled with
generic wash it reads as laziness; filled with derived land use it becomes hf347.**

#### §1.1.12c · CENTRES ARE MINTED BY CAUSE, NEVER PLACED BY COUNT (PLAN §5.1–§5.2)

**Six structurally distinct centre types — not one primitive resized:**

1. **THE STREET WIDENING** (cigar-shaped) — the market *is* the main street, swollen; stall
   ranks down the middle leaving two carriageways; frontage continuous through it. Most common
   at village and small-town tier.
2. **THE TRIANGULAR GREEN AT A FORK** — three roads meet, the residual triangle is the green, a
   well or cross pins it.
3. **THE CARVED SQUARE** — a deliberate rectangular void with 3–4 entry gaps, a market hall or
   cross in it, and ⭐ **ENCROACHMENT ISLANDS**: permanent buildings that have eaten into the
   square's edge. *(Already ratified as a pinned feature under §201.1c — the corpus draws it
   constantly and we keep it.)*
4. **THE CHURCHYARD / PRECINCT COURT** — an enclosed void, walled or railed, **not a traffic
   space**.
5. **THE CASTLE FORECOURT** — a cleared apron outside the castle gate, held clear for military
   reasons, often the largest single void in a small town.
6. **THE BRIDGEHEAD / QUAY WIDENING** — a void at the point of transhipment, **shaped by the
   water edge rather than by frontage**.

**MINTING RULES.** The primary market **always**, at the highest-load junction reachable from
the strongest gate · a **second market iff a second jurisdiction or a second charter/borough
exists in the dossier** · a precinct court per major religious institution · a forecourt per
fortified compound · a bridgehead/quay void per transhipment point. Then the **type** is
selected by cause × graph position: a void at a fork becomes a triangular green; a void on a
spine becomes a widening; **a void minted by an AUTHORITY becomes a carved square**.

**POLYCENTRICITY IS MEASURABLE [M, PLAN §5.2]**, as second-largest void ÷ largest void:
**monocentric (<0.15) 12 of 34 · polycentric (>0.55) 13 of 34 · intermediate 9 of 34.**
**Void count ≥4 plot-widths²: median 7 per settlement, range 0–24** — so the median studiable
settlement carries **seven distinguishable open spaces**, of which one or two are "centres".
⭐ **The polycentric plates are polycentric for DERIVABLE reasons every time**: two nuclei that
grew together; **two jurisdictions**; a water morphology with many campi; a settlement whose
centre has *moved*; a decayed settlement whose surviving huddle has its own new centre inside
the old one.
⛔ **MISSING: the void typology (we appear to have one square primitive) and the
`secondAuthority ⇒ secondCentre` derivation** — the most legible polycentricity cause in the
corpus and **fully derivable from `powerStructure` and institution attribution**.

**S12 LAWS.** §201 the alley register (an alley is BLOCK-INTERIOR space, not a street; it draws
in its block's **interior/yard ground tone**, never street colour; three lawful topologies —
isolated interior courts, through-alleys, cul-de-sac pockets; **island buildings inside block
interiors adjacent to NO street are a RATIFIED, PINNED feature**) · §202 (a route-isolated court
must still **percolate** to the web by at least a narrow pedestrian gap — a hermetically sealed
court with buildings is a violation) · §204 courts are RARE · §203 arm 2 zone fill.
**S12 CENSUSES.** ⛔ **T-06 court frequency is NOT BUILT** — courts are still not classified
(`laneMFB8-receipt.md` §9). **The band exists and is waiting:** §209.4 reconciled §204 with the
corpus — **route-isolated courts 3–15% of blocks (rare, as ruled); interior yards WITH a mouth
are a DIFFERENT OBJECT, common (15–65%) and unrestricted.** ATLAS T-06 proposes ≤12% of blocks
AND ≤20% of all block-interior open spaces, **with a floor of >0 at town+ so the feature is not
optimised away.**
**S12 STATUS: PARTIAL.** §201A.1's alley tone is BUILT and confirmed by chair eye (§212.1);
zone fill is measured with a **declared measurement mismatch** (see §2.4).

---

### S13 · THE CIRCUIT FOR EPOCH E — **PARTIAL. Traced and contained; the RUN TYPING is missing.**

**INPUTS.** the completed epoch's fabric (S6–S12) · the substrate's terrain and water (S2, S4) ·
`institutions` (which demand inclusion) · `history` fortification events · `prosperity` (masonry
is expensive) · `threats` and `defenseGenerator`'s military scores · the region's roads (gates).

#### §1.1.13a · ⭐⭐ THE CIRCUIT IS A CHAIN OF TYPED RUNS (CX-13) — the highest-leverage single mechanism in CONTEXT's half

**The corpus proved this the hard way.** The polygon/oval circuit prior **survived HF-1, HF-2
and HF-3 and deformed at least eleven plates**. It was cured — at n=6 — by **enumeration with
reasons**: naming N runs and giving each its own narrative (§242.2). *That is a
prompt-engineering result; its engineering translation is the finding.*

⭐⭐ **A WALL IS NOT A SHAPE FITTED AROUND A FABRIC. A WALL IS A SEQUENCE OF RUNS, EACH OF WHICH
IS A DECISION WITH A CAUSE — and every one of the causes comes from facts we already hold.**

| run type | cause | drawn as | our derivation home |
|---|---|---|---|
| **CREST / RIDGE RUN** | high ground worth holding | long, straight-ish, **towered** | substrate relief |
| **NOTCH** | an institution demanded inclusion | the wall **doubles back** to wrap a precinct | `institutions` |
| **DETOUR TO A WORK** | a mill, pond or quay had to be inside | a hard kink around the asset | `institutions`, `supplyChains` |
| **TERRAIN-SURRENDER RUN** | a cliff/scarp/marsh defends itself | the wall **thins to a parapet or STOPS**; **zero towers** | substrate |
| **WATER TERMINATION** | the river is the flank | wall ends at the bank; **a chain across the water** | water system (S4) |
| **TOFT-BACKS RUN** | the wall was built along existing property | **wobbles plot by plot** along the backs of the tofts | the fabric's own plot geometry |
| **NEW CUTTING** | one campaign, one decision, open ground | **ruler-straight**, long | §240 epoch model |
| **RE-USE RUN** | an older ditch or work was on the line | straight cut across an old ditch; **the ditch survives as gardens** | `history` |
| **BAD CLOSURE** | two campaigns met and did not agree | a **visible seam**, a mismatched join, one odd tower | §240 epoch model |

**MECHANISM.** Walk the boundary of the epoch's built extent and **segment it into N runs BY
CAUSE**, choosing each run's type by testing the local substrate / fabric / institution
conditions in a fixed priority order. Each run then carries its own generation parameters:
straightness, tower policy, thickness, ditch policy, wall-foot policy. **N is not a knob — it
falls out of how many distinct conditions the boundary crosses.** Closure between the first and
last run is **deliberately imperfect and marks a seam.**

⛔⛔ **VERDICT: PARTIAL, AND THE SEQUENCING IS RULED. §251.4(b): §240 AND THE RUN-CHAIN ARE ONE
PIECE OF WORK AND THEY LAND TOGETHER.** Three rings derived **without** run typing come out
**CONCENTRIC** — the exact prior the corpus spent three growth rounds and eleven deformed plates
failing to beat. *Landing §240 alone would ship the defect and then pay a declared shift twice
to remove it.* §205.3 (terrain-maximised defences) is RULED and covers two of the nine run types
correctly and explicitly (*"a cliff flank needs NO wall — drawing one is the violation"*); §161m
gives a wall-trace law. **What no law supplies is that the trace is a CHAIN OF TYPED RUNS rather
than a single trace with exceptions** — and that difference is exactly what ATLAS Table A's T-10
verdict measured as b6's failure: ***"the trace reads geometric, not economic."***

#### §1.1.13b · TOWERS, GATES, THE WALL FOOT

**⭐ TOWER PLACEMENT IS OPPORTUNISTIC, AND THE ASYMMETRY IS THE TELL [M-view, n=7]: 6 of 7
walled plates show towers ABSENT on at least one flank, and in every one of those six the bare
flank is the TERRAIN-DEFENDED one** (river, cliff/scarp, marsh).
**MECHANISM (CX-14).** A **per-RUN** tower policy: `none` on terrain-surrender and water runs;
`clustered` on runs facing approach or level ground, count driven by run length × threat;
`sparse` elsewhere. Positions within a run are **seeded-irregular** (§214 bans even spacing by
name; ATLAS banned prior #7 makes even spacing *the strongest "generated" tell in the corpus*).
⭐ **A TOWER IS A TYPE, NOT A REPEAT** — hf315 draws ten genuinely different ones, of which the
**open-backed D** and the **beaked tower** are *functional* choices, not styles.
⚠ **The difference the per-run policy buys: "irregularly spaced all the way round" is still
wrong; "clustered where it matters and absent where it does not" is right.**

**GATE COUNTS [M-view, small n but consistent]:** town **2–4** land gates · city **~4** ·
metropolis **6–7**. `gate` is named on **63 of 138 settlement plates (45.7%)** [M-index].
Gates are **typed road terminals** (CX-15) placed after the run chain and after the region's
approach roads — which is why S1 blocks this.

**⭐⭐ THE WALL-SIDE STREET (§239.2), AND ITS PER-RUN CORRECTION.** On **both** sides of the wall
there are streets, with very few exceptions — historically the **intervallum** inside
(circulation, firebreak, muster) and clear ground / ring road outside. ⭐ **THE ENGINEERING GAIN
over today's reserved band: the wall is always reachable, every gate necessarily meets the
street web, and "no building touches the wall" becomes a CONSEQUENCE OF GEOMETRY rather than a
policed rule.**
⛔⛔ **AND CONTEXT SHARPENS IT INTO A DERIVATION, WITH A CENSUS CONSEQUENCE §251.4(b) RULED:
7/7 walled plates show a wall-side street on SOME runs; 0/7 on EVERY run.** So §239.2's "very
few exceptions" is a **PER-RUN policy**, not a global rule — and **§200's clearance census WILL
RED ON CORRECT OUTPUT unless its exemption keys to RUN TYPE.** ATLAS T-22 already warned that
**inner-face abutment is NORMAL in military compounds** and must be exempted by name; CONTEXT
widens that from "military compounds" to **"any run built along existing property"** (the
toft-backs run). ⚠ **A global ring road would produce a band the corpus never draws.**

**FLANK GRAMMAR FREQUENCIES [E, ATLAS T-10] — the calibration a builder aims at:** of ~29 walled
plates, **full closed ring ≈55% · half-ring against water ≈17% · terrain-anchored with a flank
left unwalled ≈14% · wall crossing water with water gates ≈10% · two vintages in one frame
≈10%.** ⭐ **A GENERATOR THAT DRAWS A FULL RING 100% OF THE TIME IS WRONG BY ~45 PERCENTAGE
POINTS.**
**Walled incidence [E]:** walled ≈29, unwalled ≈12 of 41 settlement plates, **and the split is
almost exactly the tier line — essentially every town+ is walled; essentially no village or
below is.**

**S13 OUTPUTS.** the circuit node — one ring per epoch, carrying `epoch`, `epochHull`,
`containmentResidual`, `closedPolygon`, gates, towers, ditch.
**S13 LAWS.** §161m the wall-trace law (circuit economy — *the wall hugs tight because every
meter cost a fortune, high-water sizes what PAID for it*; terrain service; water as the fourth
wall; gates few, at the road-weighted crossings, gatehouse-built; palisade rounder/simpler vs
stone tower-to-tower curtains; citadel as the strongest corner, **never floating**) · §200 the
wall-clearance law (the wall band = stroke width + derived clearance is a RESERVED RIGHT-OF-WAY
exactly like streets: **ZERO footprint-area intersection**) · §205.3 · §214's wall arm (visible
masonry thickness — **a double-line band, never a bare polyline**; towers as drawn rounds/
squares at seeded-irregular intervals; crenellation texture where scale permits; gatehouses as
**structures**; keep/motte with hachure; palisades as tick-rows; ditches in ditch grammar;
**all tier-scaled**) · §232 · §239.2 · §240.
**S13 CENSUSES.** §200 drawn wall band **0 of 23,391, AREA-TRUE** (BUILT), with gates, towers
and wall-owned members as **NAMED census exemptions, never silent passes**. ⛔ **The run-type
exemption is NOT built and §200 will red on correct §239.2 output without it.**
**S13 STATUS: PARTIAL.** `wallCircuit.js`, `walls.js`, `reservedGround.js`, `districtPartition.js`.
The circuit is a canonical node with 17 declared inputs, a content-hashed output and re-verifying
accessors; `wallClaims` was **DELETED** because the duplicate rule *was* the defect. ⛔ **MISSING:
run typing, per-run tower/ditch/wall-foot policy, the wall-side street, the gate typing.**

⚠⚠ **THE TWO-WAVE VACUITY THIS STAGE PRODUCED IS THE PROGRAM'S SHARPEST LESSON AND A BUILDER
MUST NOT REPEAT IT.** MF-B7 reported the owner's wall/building overlap catch cured **408 → 0**.
It was **vacuous**: law and census shared a **BLIND PREDICATE** — both asked the body's
**VERTICES** against the claim's **CENTRELINE**, so a claim running *through* a body scores
clear at every corner. Area-true re-measurement against the old trees found street/water/wall
violations of **B7 671/16/84** and **B8 1,299/13/190**. ⭐⭐⭐ **THE CLASS, CORRECTED: A SHARED
OBJECT IS NOT A PROOF — THE PREDICATE IS THE VACUITY SURFACE.** §195.0's cure ("the drawn set")
was *necessary and insufficient*. The standing contract is **ONE ARTIFACT, ONE ACCESSOR, ONE
PROVEN PREDICATE**, with census independence bought by **COUNTERFACTUALS** rather than by a
second implementation, and enforced at the **PUBLICATION POINT** (a verifying accessor,
`configurable: false`) rather than by a read-site scan — because only 8 of 36 `.walls` hits are
the fabric's and it travels under **seven alias names** (§241.5a, J-ARCH-6).

---

### S14 · CIRCUIT DEMOTION — THE FOSSIL LADDER — **NOT BUILT.** Highest leverage per unit cost.

**When epoch E's circuit is superseded by epoch E+1's, the old circuit is NOT DELETED — it is
DEMOTED TO A STREET, and its furniture is transformed by a fixed table.**

| the old thing | becomes |
|---|---|
| **wall** | ⭐ **OLD WALL LANE** — a ring street, drawn slightly wider and in a different pavement tone than ordinary lanes, running the full former circuit (width = the intervallum's width) |
| **gate** | a **street widening and a break in the frontage line** where the ring street meets a radial |
| **tower** | ⭐ a **CIRCULAR BUILDING** embedded in the fabric — drawn as a circle where every other footprint is rectilinear |
| **ditch** | ⭐ **FILLED DITCH GARDENS** — a curving ribbon of long narrow garden plots immediately outside the old wall line, drawn green, following the ring exactly |
| **intervallum** | the ring street's carriageway |
| **wall stub** | a surviving masonry fragment, free-standing inside the fabric, at wall weight with rubble hatch |

**And the structural rule that generates all of it: ⭐⭐ RADIALS ARE OLDER THAN RINGS.** The
radial streets run continuously through all three circuits; the ring streets are each a
fossilised defence. **A settlement's oldest continuous geometry is its roads OUT, and its ring
geometry is the accumulated record of its walls.** Plot boundaries in the ring immediately
outside the old wall are **radial to the old circuit**, because they were laid out against it.

**A FIVE-RUNG FATE LADDER, weighted by local land pressure** (CONTEXT CX-20): high pressure →
quarried or built over; low → standing. `wall_dead` (bricked/blocked/robbed/quarried/stub/
property-line) is named on **15 of 138 settlement plates (10.9%)** [M-index] — **the corpus
treats wall death as NORMAL, not exceptional.**

⭐ **THE OLD WALL STOPS BEING A WALL AND BECOMES AN INPUT TO THE STREET, PLOT AND LAND-USE
STAGES.** That is the implementation shape: `circuitDemotion` runs at each epoch boundary and
emits real geometry into the **current** fabric.

**DERIVATION HOME.** §240's epoch index + land pressure (population growth between epochs) +
`prosperity`. **The event stream already makes the wall a first-class dated EVENT (§240.3); a
superseded circuit is simply a wall event whose settlement later exceeded it.**
**LAWS.** §240.3 (which lists the vintage triad, the density gradient and demotion as its
dividends and **does not list this one**) · §239.4 (which gets close from the other direction).
**CENSUSES.** Every superseded circuit emits ≥1 street segment, and the ring street's geometry
matches the superseded circuit's trace within the topology quantum. Zero superseded circuits
that emit nothing.
⛔⛔ **STATUS: NOT BUILT, AND IT IS URGENT (§250.5). §240 MAKES MULTI-CIRCUIT SETTLEMENTS
IMMINENT — 4 of 10 walled leaves already carry two concentric circuits — AND NOTHING SAYS WHAT
HAPPENS TO THE SUPERSEDED ONE. WITHOUT THIS, EVERY NEW RING ERASES THE HISTORY THE EPOCH MODEL
WAS ADOPTED TO EXPRESS.** Two studies found it independently (PLAN §6.3, CONTEXT CX-20) and
§251.3 records it as **§240's biggest unclaimed dividend**. **It costs one pass and it is the
difference between a town with rings and a town with a biography.**

⭐ **AND IT IS HOW A TOWN LOOKS OLD AT A GLANCE WITHOUT DRAWING A SINGLE RUIN.**

---

## §1.2 · THE WORLD→PLAN PARAMETER CHECKLIST — our stage inputs cross-checked against FMG's delegation contract

**Why this belongs in a build sheet.** FMG generates **no** town plan at all — confirmed by
exhaustion over all 248 src files and 28 renderers (§253.1); a burg is an icon, an anchor, a
label and 30 scalar fields, and plans are **delegated by URL** to Watabou's closed generators.
But that means FMG must *derive and ask for* everything a plan generator needs to know about a
world — so **its parameter set is a play-tested specification of the world→plan interface, and
it doubles as a window into what the market-leading closed generator ACCEPTS as input**
(PRIOR-ART §2.2). Learning from a specification raises **no IP question at all**; nothing here
is copied, and §248.2(b) binds — **implementations stay clean-room**.

⭐ **AND THE STRATEGIC READING (§253.1): the only OPEN implementation has a world and no plans;
the leading PLAN generator has plans and no world. NOBODY SHIPS THE JOIN — which is exactly what
this pipeline is.** The checklist below is therefore an audit of *our* join, using their query
string as the control.

### §1.2a · THE CITY CONTRACT, PARAMETER BY PARAMETER

| their parameter | derived how (PRIOR-ART §2.2, in that lane's words) | do we derive the equivalent? | disposition |
|---|---|---|---|
| `seed` | world seed + burg index, zero-padded | **YES, and better.** S0's `fabricForkKey`/`keyedRandom` over stable lineage ids, plus per-epoch streams (`wall.epoch.k`) and per-stage forks | **ahead** — theirs is a string concat with no inertia guarantee |
| `size` | ⭐ **a power law on population**: `2.13 × (population / urbanDensity) ^ 0.385`, clamped 6..100 | **PARTIALLY.** S5's `extent(t) = FOOTPRINT_R × √(TIER_PROFILE[t].footprint[0]) ÷ built radius` — a **tier-banded** relationship, not a fitted population curve | ⚠ **GAP G-5** — see §1.2c |
| `population` | burg population × global rate × urbanization share | **YES.** `population` is a first-class dossier fact, current **and** high-water (§161f) | **ahead** — they have one scalar, we have a trajectory |
| `river` | whether the cell carries a river | **YES** (§5.0b water mode) — and we carry class (§205.2) too | **ahead** |
| `coast` | whether the burg is a port | **YES** (`tradeRouteAccess`, `WATER_TERRAIN`) | parity |
| ⭐ `sea` | **THE BEARING TO OPEN WATER**, an angle normalized to 0..2 (0 = east, 0.5 = north, 1 = west, 1.5 = south), computed from the vector to the haven cell | ⛔ **NO.** We derive the water **MODE** and never a **DIRECTION** | ⛔ **GAP G-4** — see §1.2b |
| `farms` | whether the biome is arable, **widened when a river is present** | **YES, and ahead.** §16's open-field ruling plus the measured arable share restored as truth at MF-B2 (the fjord's 0.27 — *why a fjord fishes*) | **ahead** |
| `citadel`, `walls`, `plaza`, `temple`, `shantytown` | burg feature flags from population thresholds | **YES, and this is where our model is strongest.** We derive *whether* from `institutions`, `defenseGenerator` and history, not from a population break-point. ⭐ PRIOR-ART §7 row 12 keeps their thresholds as a **free plausibility band**, never as a source | **ahead** |
| `urban_castle` | citadel **and** an every-other-id parity test | **N/A** — a deterministic thinning of a flag we derive causally | deliberate difference |
| `hub` | whether the cell is a route crossroad (>3 connections, or >2 road connections) | ⛔ **NOT AT PLAN SCALE.** This is exactly S1's region: which roads arrive, at what rank | ⛔ folded into **G-1 (the region)** |
| `greens` | mirrors `plaza` | **YES** — but as derived interior greens from the umbrella's unmet gaps (§161d), not as a mirror of a flag | **ahead** |

**THE VILLAGE CONTRACT** is a **tag list** rather than a number list — a priority cascade
(`estuary` → `island,district` → `coast` → `confluence` → `river` → `pond`; then exactly one
connectivity tag from `highway` / `dead end` / `isolated`; then land use; then `no orchards` by
temperature; then `no square`, `palisade`, `sparse`/`dense`). ⭐ **PRIOR-ART calls this "a
different and in some ways better interface", and the transferable part for us is the
CONNECTIVITY TAG: `highway` / `dead end` / `isolated` is a compact statement of the settlement's
position in its road network** — which is S1's region again, and which is the input PLAN §1.4
needs for load-derived street width. **Their `style` of `sand` / `snow` / `default` from biome
and temperature is the thin version of what CONTEXT CX-34/CX-36 argue for structurally (G-6).**

⭐⭐ **AND THE CONTRACT'S OWN CEILING IS THE SHARPEST THING IN IT, RECORDED BECAUSE IT IS OUR
DIFFERENTIATOR STATED PRECISELY (PRIOR-ART §2.2):** *"Every parameter is a scalar or a boolean
about the settlement as a whole. There is no way to say 'the tannery quarter is downwind and
downstream', 'this wall ring is older than that one', or 'these three blocks burned in 1247'.
The interface itself is the proof that the world model and the plan model never truly meet — the
join is a query string."* **Every one of those three sentences names a stage in this
specification: S16's institution relations, S5's epoch ladder, and PLAN §9's `eventFootprint`.**

### §1.2b · ⭐ THE BEARING TO WATER — a real gap, with a derivation home and a hard constraint

**The finding.** FMG passes the *direction* of the sea, not merely its presence, because a
coastal town's whole plan orients to the water. **We pass neither at plan scale: §5.0b gives a
MODE (THROUGH / BANKSIDE / NEAR / NONE) and the fabric has no water bearing.**

**Where it lands.** `waterBearing` is an output of **S2, the terrain substrate** — derived from
the substrate's own geometry as the vector from the settlement anchor to the nearest open water
/ haven cell, exactly as FMG derives it from its haven cell. It then feeds:

- **S3** — the site anchor and the second-nucleus test;
- **S6** — district anchoring (§161d), because the waterfront organisms bind to that bearing;
- **S13** — the **water-termination run** and the wall-meets-water case (§205.3: circuits anchor
  ON rivers, the wall ending in water-gate towers);
- **S15** — CX-21's edge kind per bearing;
- **S4/CX-06** — the second-bank rule, which needs a *side* before it can prefer one.

⛔⛔ **THE HARD CONSTRAINT, AND IT IS WHY THIS IS NOT THE SAME ITEM AS THE MICROCLIMATE
BEARINGS.** A water bearing derived **from the terrain substrate** is a *reading* of geometry
that already exists and is deterministic from the seed — it mints nothing. **A wind or sun
bearing minted at generation would be a NEW WORLD FACT, and under THE PROMISE a world fact is
seed-permanent** — which is exactly why §251.5 refused it and CONTEXT §12.1 filed it as
owner-gated inspiration. ⭐ **The two must never be conflated: water bearing is DERIVABLE from
terrain and belongs in the pipeline; wind and sun bearings are NOT and stay in Appendix A.**
This spec adopts the distinction and nothing more.
**VERDICT: GAP G-4, MISSING, cheap, and blocked only on S2's substrate existing.** ⚠ It is a
*sub-item* of the substrate rather than a separate build: once the substrate has geometry, the
bearing is one vector.

### §1.2c · ⭐ THE POPULATION→EXTENT EXPONENT — external evidence where we recorded that we had none

**The state of our own fit.** ATLAS T-01 published `cells_across ≈ 5.7 × population^0.27`
(R² 0.80) as the interpolation rule between the grain rungs. ⛔ **It was WITHDRAWN at §244.5**
because it was fitted in log-log over 11 plan-view plates **including hf10**, whose window is
refuted — so the fit inherits the fault *at exactly the end of the range where a single point's
leverage is greatest*. **§249.4(c) then ruled the population fit UNRESTORABLE from the corpus**,
for a reason that no amount of re-fitting cures: `cells_across` is **[M]** but **every population
in the corpus but one is [E]** — an eye estimate. *A trustworthy derivation needs settlements
whose population is a FACT, i.e. our own generator's output, not reference art* (ATLAS T-01).

**The external datum.** FMG's `size` parameter is `2.13 × (population / urbanDensity)^0.385`,
clamped to 6..100 — an independent, heavily play-tested estimate of the population→built-extent
relationship, produced by a different team against a different world model and **shipped**.

**What it does and does not tell us.**

- ⚠ **THE TWO EXPONENTS ARE NOT COMPARABLE AS NUMBERS, AND SAYING SO IS THE HONEST REPORT.**
  Ours (0.27, withdrawn) was fitted on **cells across a settlement** — a *grain* quantity.
  Theirs (0.385) is on **plan extent** — a *size* quantity, and its base is
  `population / urbanDensity` rather than population. **A grain exponent and an extent exponent
  measure different things and cannot be checked against each other directly.** Anyone who
  compares 0.27 to 0.385 as if they were the same quantity is making the ATLAS's own
  hybrid-evidence mistake in a new place.
- ⭐ **WHERE IT IS GENUINELY USEFUL: it is a cross-check on §161f's EXTENT curve — S5's
  `TIER_PROFILE` footprint bands — not on T-01's grain.** Our extent ladder is measured at
  **309 → 391 → 442** view units across town → city → metropolis (**×1.27 then ×1.13**;
  `laneMFB8-receipt.md` §1). Against a ×3.5 population step from the city exemplar to the
  metropolis exemplar, a 0.385 exponent predicts roughly **×1.6**; we deliver **×1.13**.
  **PLAUSIBLE (this is arithmetic on two quoted figures, not an executed fit): our extent ladder
  grows MORE SLOWLY with population than an independent implementation's, and that is the same
  direction as B8's own measured frontage-ladder residual** — *"our extent ladder grows FASTER
  relative to the grain ladder at town→city than at city→metropolis"*, which B8 named as a **§5
  tier-table question for the chair** and did not take.
- ⛔ **DOES IT SUPPORT RESTORING A DERIVATION HOME FOR EXTENT? YES — BUT NOT BY ADOPTING THEIR
  CONSTANT.** It supports the *shape* (extent is a continuous power law in population, which is
  §161f's continuous-scale law in arithmetic form) and it supplies a **plausibility band** for
  the exponent. It cannot supply the constant, because their base quantity, their density
  assumption and their clamp are theirs. **AND THE RESTORATION PATH ATLAS ALREADY NAMED IS THE
  RIGHT ONE AND IS NOW CHEAPER THAN IT LOOKS: fit against settlements whose population is a
  FACT — our own generator's output — which we have 16 of at every tier, with byte-determinism
  and a published extent.** ⭐ *The instrument that could not be built from reference art can be
  built from our own leaves.*
- ⛔ **NOT ADOPTED HERE.** This is a cross-check reported beside our withdrawn fit, exactly as
  the chair instructed, and it is filed as **gap G-5** with a named experiment. **No exponent is
  installed, and §5's tier table is not touched by this document.**

---

## §1.3 · THE POST-EPOCH STAGES (S15 – S23)

### S15 · THE EDGE AND THE EXTRAMURAL ORDERING — **PARTIAL** (CX-21, CX-22, CX-23)

**INPUTS.** the circuit's runs and gates (S13) · the region's approach roads with ranks (S1) ·
the substrate's boundaries (S2) · `population` growth rate · `institutions` (which ones belong
outside) · `prosperity`.

**THREE EDGE KINDS, and what selects between them** (CONTEXT §4.1):

| edge | drawn as | selected by |
|---|---|---|
| **HARD** | fabric stops at a line — wall, water, cliff, marsh, intake wall | a physical or legal boundary exists |
| **FEATHERED** | plots thin, gaps widen, gardens then closes then fields; **no line anywhere** | no boundary; ordinary growth |
| **RIBBON** | fabric continues **along the ROAD only**, thinning with distance and **stopping at different distances on different roads** | growth with a strong movement axis |

⭐ **THE DETAIL THAT MATTERS: hf389 shows extramural ribbons at FIVE gates, each stopping at a
DIFFERENT distance. Equal-length ribbons would read as generated.** The stopping distance is a
per-road fact and it tracks that road's traffic.
⭐ **AND THE HARD EDGE IS NOT THE DEFAULT EVEN WHERE A WALL EXISTS** — hf385's new circuit
encloses brickfield, orchard, closes, tenter grounds and two ruled empty plots, so **the real
edge is feathered and sits well inside the circuit** (this is S12's `intramuralVacancy` seen
from outside, and CX-44's *provision ahead of occupation*).

**THE FAUBOURG LAW (§190d, ruled).** Extramural growth is the **DEFAULT** for walled
settlements: intramural infill, then **GATE FAUBOURGS** (each its own organism seeded by gate
traffic, anchored by §161c's extramural institutions, strung along approach roads), then ⭐
**THE WALL-FOOT TELL** — *a serious town keeps its glacis CLEAR; a lax, poor or peaceful one
grows lean-tos against the stones. One glance says whether anyone expects a siege.* **THE NEW
RING is the rare earned act** (wealth × pressure × time) and encloses faubourgs into wards whose
grain records their origin. **Demotion runs it backward — faubourgs empty first.**

**THE EXTRAMURAL DISTANCE LADDER (CX-23, PARTIAL).** §161c's four siting rings — INTRAMURAL /
EDGE / EXTRAMURAL-NEAR / OUTLYING — are ruled. CONTEXT finds the ladder has **more bands than
§161c names**: bands 4 (charity / contagion — hospital just *inside* a gate, leper house *far*
outside on its own road with its own ditch, chapel, well and roadside alms box) and 5 (gallows —
**the last mark on the busiest road out, on a knoll**) are uncovered, and ⭐ **the SINGLE-ARC
constraint on noxious is uncovered: noxious trades sit in ONE arc, never in more than one.**
**One table, keyed off the institution list.**

**MEASURED FREQUENCY TARGET [E, ATLAS T-21]:** of ~29 walled plates, **~20 show growth outside
the wall** — camps at the busiest gate, ribbon along every radial, a whole new quarter, a boom
fringe, a shanty belt **on the poor side only**. **Target: extramural growth present in ≥60% of
walled settlements, concentrated at ONE or TWO gates, never evenly distributed.**

**LAWS.** §190d · §161c · §232 (extramural faubourgs form their OWN districts) · §18.2 the inn
belt · §5.0e.
**CENSUSES.** ⛔ Ribbon extents unequal across roads (zero settlements with all ribbons within
X% of each other). Gate-concentration: extramural mass on ≤2 gates. Noxious in exactly one arc.
**STATUS: PARTIAL.** Faubourgs landed at MF-B5 and ATLAS T-21 grades b6 ★ **MEETS** on
extramural presence. ⛔ **MISSING: the unequal ribbon length, the gate ranking that allocates
growth (CX-22 — *which* gate grows, which waits on S1's region), the distance ladder's bands 4
and 5, and the single-arc noxious constraint.**

---

### S16 · INSTITUTION SITING AS A RELATIONAL SYSTEM — **PARTIAL. Scale exists; RELATIONS do not.**

⭐⭐ **THE GAP IN ONE SENTENCE (CONTEXT §5, adopted at §251.3): §161n gives institutions a SCALE
LADDER (how BIG) and NOTHING GIVES THEM A SITING RULE (WHERE).** *"Our dossier already knows
which institutions exist and what they are for; what it never asks is what must this be near,
and what must it never be near."*

**INPUTS.** `institutions` (a rich, already-enumerated class list) · `government` · `factions` ·
`culture` · `powerStructure` · the void hierarchy (S12) · the circuit and its gates (S13) · the
water system with its flow direction (S4).

**MECHANISM.** Each institution class carries a **siting profile**: a band relative to the
centre, a gate relation, a water relation, a wall relation, a **required** adjacency, and a set
of **PROHIBITED** adjacencies. Placement is a **constrained assignment over candidate sites, not
a scatter.**

⭐ **THE NEGATIVE RULES ARE THE CHEAP HALF AND THEY CARRY MOST OF THE REALISM.** Four predicates
prevent most of the errors a naive placer makes: **never upwind · never above the clean take ·
never on a through route · never adjacent to a dwelling.** A representative slice of the siting
table (CONTEXT §5.1 — the full table is 24 classes):

| class | centre | gate | water | wall | ⛔ never next to |
|---|---|---|---|---|---|
| great church / cathedral | at or one block off; **own precinct, AIRIER than the fabric** | — | — | often **notches the wall** to be included | the noxious arc; flood ground |
| parish church | at a secondary void or on a knoll; ⭐ **at a visibly different ANGLE to the streets around it** | — | above flood line | — | downwind of tanning or smoke |
| monastery / abbey | **outside or at the edge**, own precinct wall, own water | own gate | **takes its own leat and stew ponds**, terraforms drainage | often abutting or outside | the tight core |
| friaries | **inside but distributed and marginal**, pressed to the wall | — | — | against the wall | **each other** |
| castle / citadel | the strongest corner, **never floating** | commands one | on the bluff or water if there is one | own ditch | the market |
| market (primary) | ⭐ **IS the centre** | on the gate-to-gate spine | — | — | the shambles' drain |
| mill (water) | ⭐ **the FLOW, not the plan, sites it** | — | on the leat, across the tail | frequently OUTSIDE, **and the wall detours to include it** | above the settlement's clean take |
| mill (wind) | **on open exposed ground OUTSIDE**, on a mound | near, on the field side | — | outside | inside the fabric |
| granary | **adjacent to its intake**, at the landing, on raised platforms | — | at the landing | — | the far side from the road that feeds it |
| inns (great courtyard) | on the spine | ⭐ **band 1 OUTSIDE the busiest gate, on enormous plots** | — | — | — |
| hospital / almshouse | — | ⭐ **just INSIDE a gate** (traffic = alms) | — | — | — |
| leper house / lazaret | — | ⭐ **far OUTSIDE along its own road**, own ditch, chapel, well, alms box | isolated island if water exists | far outside | **any dwelling** |
| gallows | — | ⭐ **the last mark on the busiest road out**, on a knoll | — | far outside | — |
| tannery / dye / lime kiln | — | outside, downwind | **below the clean take, discharge fan drawn** | outside | ⭐ **upwind or upstream — and NEVER in more than ONE arc** |
| shambles | at the market, **with a blood channel to a drain** | — | drains below the water stairs | — | above a water stair |
| rope walk / tenter ground | — | — | often waterside | ⭐ **outside or against the wall — they need LENGTH and cheap flat ground** | the core |
| treasury / mint / records | ⭐ **inner walled precinct with ONE gate, and the surrounding streets BEND so none runs at its doors** | own guarded approach | — | — | a through route |

⭐ **INSTITUTIONS THAT GENERATE THEIR OWN MICRO-DISTRICT (CONTEXT §5.2).** Six classes reliably
grow a service quarter whose **trades are specific to the institution**: cathedral (close wall
with ceremonial *and* service gates, prebendal houses each unlike and each in its own garden,
almonry, works yard) · pilgrimage shrine (hospices, badge-sellers' encroachment wedge, a
**processional circuit worn wider** with station crosses) · university (schools street,
bookbinders' row, physic garden — **and the grain changes at every college wall**) · castle
(soldiers' lodgings, victualling yards, horse market, **and a mason's yard, because the castle is
always being repaired**) · treasury (scriveners and parchmenters **with soaking pits and
stretching frames at the river**) · port/customs (interpreters' street drawn as **the busiest
lane on the plate**, public crane and weighbeam the foreign enclaves must use).
⭐ **AND ANY INFRASTRUCTURE CLASS GROWS A CUSTODIAN'S DWELLING** — the keeper's cottage at the
spring house, the lock-keeper's house with garden and toll board, the wood-ward's cottage
(CX-45). *Infrastructure breeds a dwelling.*

**⭐ THE DOUBLING RULE (CONTEXT §5.3 / PLAN §10.5) — a small mechanism with a very large
legibility return, and it needs NO NEW GEOMETRY.** When a settlement holds **two jurisdictions
or two faiths, its JURISDICTIONAL institutions double and the non-jurisdictional ones stay
single** — two markets, two crosses, two tolbooths, two sets of scales, **two gallows each
outside its own gate** — and *the two halves have visibly different plot rhythms, so the
jurisdiction is legible in the grain itself.* The shared wall is **unequally maintained**, with
one ruinous tower where the responsibility lapsed. ⭐ **The selectivity is the realistic part**:
what is needed is a `jurisdictional` flag on the institution class, plus a siting rule that puts
each instance in its own authority's territory. **§161e's multiplicity law already permits
multiple instances "where facts support" and §161l already requires the real-vs-formal power
split to be READABLE IN THE DRAWING; the flag is the missing piece.**
⚠ **The anti-duplicate rule applies to PROPER NAMES only and must never be applied to
institutions that genuinely double** (§HF-4c #26).

**THE PRECINCT IS A DENSITY STEP, NOT A LINE (CX-28 — HAVE, unbuilt).** Religious and civic
precincts are drawn **AIRIER than the fabric around them**, and the boundary between the two
densities is **a wall with named gates, never a line**. ATLAS T-05 already quantifies the step
(+15–20 points of open share for religious precincts, +25–30 for military compounds). ⭐ **The
one missing clause: the precinct's own boundary must be a wall with TYPED gates (ceremonial,
service) — because that is what stops the airier zone reading as a HOLE in the fabric.**

**LAWS.** §161n the institution-scale ladder (port jetty→quay→docks ward→harbour district;
worship shrine→chapel→church→cathedral precinct; market cross→square→covered market→exchange
district; garrison watch house→barracks→citadel; water well→cistern yard→waterworks — **each
rung a REAL COMPOSITION, never a scaled sprite**) · §161c the four siting rings · §161l specific
power + attribution · §161m the supply-chain adjacency law (**PHYSICAL absolutes never violated
— port ON water, mill ON race, quarry AT stone; LOGISTICAL preferences order-scaled; ⭐ THE
LAWFULNESS DIAL — a lawful town reads as a diagram of its own supply chains, a chaotic one shows
the same institutions seeded-scattered, so disorder is legible as LOGISTICAL FRICTION and not
just crooked lanes**) · §203 zone containment · §167 the affinity matrix.
**CENSUSES.** §203 containment (BUILT, asked of the partition grid). ⛔ **MISSING: zero violated
prohibited adjacencies; every institution's siting cites a profile clause; the doubling set
instantiated exactly where two authorities exist.**
**STATUS: PARTIAL.** §161n's scale ladder and §203's containment are BUILT; a truth-anchor
exemption exists and is honest (§212.1 — MF-B7's last six landlocked bodies were **all one
parish church's arrangement**, ruled *correct: truth outranks the census*, entered as a **named
truth-anchor exemption**). ⛔ **MISSING: the entire relational layer, the micro-district
spawning, the custodian dwelling, and the `jurisdictional` flag.** CONTEXT ranks this **#5 by
breadth** (6 of 8 traces) and **the largest uncovered area in its half after the substrate.**

---

### S17 · WATER WORKS AND DOMESTIC WATER — **NOT BUILT** (CX-08, CX-09, CX-10, CX-11)

⭐⭐ **THE TRANSFERABLE RULE IS THE ORDERING, NOT THE INVENTORY (CONTEXT §2.4). Our current risk
is exactly the opposite failure: placing a mill glyph NEAR water. The corpus never does that.
Every water work is positioned relative to the FLOW and to its NEIGHBOURS IN THE CHAIN, and the
chain's members are visible consequences of one another.**

**MECHANISM — chains as ORDERED sequences along the flow vector (S4's directed centreline):**

- **the mill chain**: weir → sluice → leat → pond → wheel → tail race → **rejoin below the weir**;
- **the waterfront ladder**: each stretch's type selected by depth, bank material and the trade
  it serves;
- **the pollution chain**: ⭐ **clean take ABOVE → process → discharge fan BELOW.**

**Chain members are placed BY THE CHAIN, never independently.** ⭐ **The failed-predecessor arm
— a silted pond and a dry ghost leat — costs one flag on a chain member and delivers §161g's
decay in the water system for free.**

**DERIVATION HOME.** ⭐ **`supplyChains` — already a first-class dossier field, and this is the
single best use for it in the map** — plus river class, `institutions` (mill, tannery, dye,
fulling) and `resources`.
**[M-index] incidence over 138 settlement plates:** `quay_wharf` **21.7%** · `mill_water`
**14.5%** · `basin_dock` **8.0%** · `boom_chain` **5.8%** · `weir_sluice` **4.3%** · `leat_race`
**2.9%** (badly deflated — the leat is drawn far more often than it is written down).

**⭐ DOMESTIC WATER IS A LADDER AND AN INEQUALITY GRADIENT — the dimension the corpus teaches
best and our laws do not mention at all.** The supply ladder: the stream itself with a
**washing step** (thorp/hamlet) → **the well**, a circle with **worn, beaten stipple around it**
(universal; 13.0% [M-index]) → **the dew pond**, clay-puddled with a trodden margin (no spring
at all) → **the cistern** (rock and dry sites) → **the conduit system** (city+, *and it is a
POLITICAL object*).

**hf368 is the discovery, and it is drawn, not labelled:** a walled **spring house and settling
tank OUTSIDE the wall in the fields** on the high ground with a **keeper's cottage** beside it ·
a buried conduit running in as a bold line with **inspection-stone covers set into the street it
follows** and **its own arch under the wall**, distinct from any gate · the **GREAT CONDUIT HEAD
in the market place** with a worn paved apron · **lesser heads at street corners, each smaller
and plainer**, ending in the **poorest quarter's head, a plain pipe over a basin at the far
edge** · **private takes** to castle, abbey and two named inns, one drawn **DOTTED as an illegal
tap** · public wells scattered **by distance rather than by plan** · and a fringe with neither,
taking water from the river at three public stairs — **with the tanneries, dye yards and shambles
drawn on that same river ABOVE those stairs.**
⭐⭐ **THAT LAST CLAUSE IS THE WHOLE ARGUMENT IN ONE ADJACENCY.**

**MECHANISM.** Wells are placed by an **UNCOVERED-DISTANCE RULE** — a walk-distance field over
the fabric, wells inserted greedily where the distance is worst — **not by plan** — and each
carries a worn approach. A conduit exists **only at city+ with sufficient prosperity**, and when
it exists it emits the whole sequence above, down a **prominence ladder**.
**DERIVATION HOME.** `tier` × `prosperity` × `terrainType` (cistern vs well) × `institutions`
(which get private takes) × `population` (head count).
**LAWS.** ⛔ **NO LAW IN §150–§253 COVERS DOMESTIC WATER AT ALL.** §205 is entirely about the
channel; §161b covers terraforming; §161m covers the docks. **Nothing orders anything along a
flow.**
**STATUS: NOT BUILT.** ⭐ **Given the owner's legibility law (glance → sentence → table) this is
unusually high narrative return per unit of geometry: a well with a worn approach is THREE
PRIMITIVES and it says "people walk here every day".**
⚠ **AND IT SUBSUMES ATLAS GAP-F.** CONTEXT §11.2 rank 13 is blunt: *"GAP-F's plume alone is
decoration. Plume + upstream take is an ARGUMENT."* Build the dirt vector whole — clean take
above, discharge fan below, muck gate — or not at all.

---

### S18 · THE COUNTRYSIDE — **PARTIAL, and it is the weakest surface in the whole program**

⚠⚠ **AT VILLAGE AND THORP THE COUNTRYSIDE IS 85%+ OF THE PLATE**, and ATLAS T-24's verdict on b6
is blunt: field polygons are large flat washes with sparse scattered ticks; furrow, pasture,
orchard and waste are not distinguished; **field parcels are ~10–30× the corpus's size relative
to the settlement.** ⭐ **§229.2(c) ratified this as WAVE NINE FIRST-ORDER and named it the lever
for the census tiers' remaining grain miss** — hf3 gets 31 cells across from ~80 roofs where our
800-soul control gets 21.7 from 160, *because hf3's grain is carried by garden strips, tenure
lines and hedged fields — T-24's own subject.* **The two open items are ONE item.**
⚠ **§252.3(c): the chair's own 3000px zoom confirms it — "THE COUNTRYSIDE REMAINS THE WEAKEST
SURFACE, exactly as §229.2c predicted."**

**T-24 · SIX GROUND PRIMITIVES, PER-LAND-USE AND NOT UNIVERSAL [E]:** **furrow** (parallel
strokes **at the parcel's own bearing**) · **pasture** (flat + tuft ticks) · **orchard**
(jittered tree-round grid) · **waste** (stipple + scrub) · **reed** (tick clusters) ·
**terrace** (contour lines + tick pairs). ⭐ **Hedgerow boundaries carry individual tree rounds
at IRREGULAR spacing** — the corpus's own counter-example to banned prior #7.

**T-23 · THE ROAD LADDER — FIVE RUNGS, FIVE DISTINCT PRIMITIVES, NOT ONE PRIMITIVE SCALED [E]:**
paved + shouldered + milestoned → double-edged unpaved → thinning single line with encroachment
→ dotted → **field-boundary trace**. Plus the cart-track (double line, dashed centre) and the
pack track (dashed with animal glyphs). **§11.3's road-death ladder: HIDDEN, never absence.**
b6 draws **1 of the 5 rungs** (ATLAS Table A).

**§16 · THE OPEN-FIELD RULING (ruled at §184.2, resolving MF-B2's escalated contradiction).**
BANNED = terrain-blind geometric symmetry. **LAW = the historical open-field system:**
contiguous tiling of the working land · strips **ORIENTED toward the settlement but DEFORMED by
substrate** (contours, streams, roads) · field lanes branching from village roads · **the centre
anchoring the composition** · §161n landmark rungs at every tier.

**§190c · THE WORKSITE HABITATION LAW, adopted WITH the historical split.** **NUCLEATED**
open-field settlements keep farmers **IN the village** (the fields carry **FIELD BARNS** and
distance-driven outlying farmsteads, **never a house per strip**) versus the **DISPERSED**
pattern (enclosed / upland / frontier: **a farmstead ON each holding**). The selector derives
from terrain, safety (§10 states push dwellings inward) and tenure/culture, **and drift can
ENCLOSE over generations** — strips → hedged holdings with new farmsteads, *one of history's
great visible transformations.* **SPECIALIST KEEPERS regardless of pattern**: the mine's count
house, the forest keeper's lodge, the miller's house, the ferryman, the toll keeper.
⛔ **CX-26 records the gap precisely: DISPERSAL-VS-NUCLEATION IS NOT DERIVED, and it is the most
visible countryside fact at village and below.**

**CX-24 · THE FIELD/FABRIC JUNCTION.** A junction band per bearing (four drawn junction kinds),
plus **the intake line — one iso-elevation boundary with outsized legibility return.**
**CX-25 · ROAD FURNITURE AND THE DAY'S-TRAVEL RULE.** ⭐ **Nearly free; `neighbors` already holds
the distances; it fixes the empty countryside at low tiers.** Milestones, wayside crosses, a
junction inn at a day's travel.
**CX-37 · PROCESS GROUND — the working surface that EXCEEDS the settlement.** hf332's drying
racks cover more ground than the town does; hf343's tan pits are dozens of sunken rectangles in
ranked rows; hf354's evaporation pans run the length of the shore. ⭐ **The rule: some economies
need more GROUND than they need buildings, and the ground is sited by a PHYSICAL requirement
(wind, sun, slope, water) rather than by convenience.** An activity requiring open working
ground emits a **sized, textured ground polygon with a siting predicate**, placed **before or
alongside** the fabric, not after. **Our generator will systematically under-draw these because
they are neither buildings nor fields.**
**CX-39 · GROUND SURFACE AS A FIRST-CLASS LAYER.** An urban surface ladder with **hard
parcel-edge boundaries** — hf333's dunged stance ground **stops exactly at the hedge line**.
Pure render mechanism, large return.

**LAWS.** §2 the dressed-ground law · §16 + §16.2 + §16.5 · §11.3 · §190c · §161c OUTLYING ring.
**CENSUSES.** ⛔ Not built. Field-parcel area relative to settlement extent, banded; distinct
ground primitives per leaf ≥ 4; distinct road primitives per leaf ≥ 3 where the road web
supports them.
**STATUS: PARTIAL.** The countryside moved from lens to **derivation** at MF-B2 and the arable
share is truth (the fjord's 0.27); §15.7's substrate imperfection landed at MF-B3. ⛔ **T-23 and
T-24 are NOT BUILT (`laneMFB8-receipt.md` §10.1, J-B8-1 — vetoable and explicitly deferred to
wave nine).**

---

### S19 · DECAY, DEMOTION AND STATE — **PARTIAL**

**⭐ LIFO, AND IT IS UNAMBIGUOUS (PLAN §7.1): every decline plate in the corpus empties the MOST
RECENTLY BUILT ground first and holds the oldest core longest. Decline is the epoch model run
BACKWARDS** — which is both historically right and computationally convenient, and is §240.3's
own dividend (*the same machinery with a later epoch left empty*).

**WHAT SURVIVES LONGEST, in order (PLAN §7.2):** **the monument**, at full monumental ink and now
grossly over-scale · **the circuit**, long after the fabric that paid for it · **the street
geometry**, surviving as field boundaries and lanes · **the crossing** — bridge, ford, quay.

**⭐ THE DEMOTION DISCRIMINATOR — six signals, all derivable from the high-water law (PLAN §7.3).
How a shrunken settlement of N souls differs from a stable one of N souls:**

| # | signal | shrunken | never grew |
|---|---|---|---|
| 1 | enclosure : fabric ratio | circuit encloses **3–10×** the occupied area | no circuit, or one that fits |
| 2 | monument : settlement scale | monument sized for the **former** population — 3–5 rungs above tier | monument at its tier's rung |
| 3 | street-web extent | street geometry extends **far beyond** occupied fabric | coextensive with fabric |
| 4 | intramural land use | agricultural/industrial ground **inside** the enclosure | fields begin outside |
| 5 | ⭐ **plot-boundary inheritance** | field parcels inside the walls follow the **OLD STREET BEARINGS**, producing rectilinear fields at an angle to the surrounding countryside's | field bearings follow terrain and lanes only |
| 6 | institutional over-provision | more churches, gates and market space than the population needs; some shuttered or repurposed | provision matches population |

⭐ **SIGNAL 5 IS THE SUBTLEST, THE MOST CONVINCING, AND NEARLY FREE: when a block dies, FEED IT
TO THE FIELD GENERATOR ON ITS OWN BEARING.** The resulting field patch is rectilinear and
misaligned with the countryside, **and the eye reads "this was a town" immediately.**
⭐ **Signal 6 falls out of §161n for free IF institutions are scaled at their FOUNDING rung and
never re-derived downward — which is also the historically correct behaviour: buildings do not
shrink.**

**THE FOUR-STAGE DECAY LADDER [ATLAS T-19] — four DISCRETE stages, never a fade:** (1) full
outline, no fill; (2) broken outline + rubble stipple; (3) foundation line at ~40% weight with
vegetation wash over; (4) **a field-boundary-weight trace only, reused as agricultural
geometry.** ⭐ **Stage 4 costs nothing new — the dead blocks are fed to the field generator on
their own bearing**, which is signal 5 again from the render side.

**THE GHOST REGISTER [ATLAS T-20] — ONE opacity, ONE dash, shared by four different "not quite
there" states**: the abandoned farmstead, the surveyed-not-built streets, the out-of-ward context
fabric, the surface city above the undercity. **Recommend a single `ghostInk(weight 0.38,
dash 6-2, no fill)` used by all of them.**

**SURVEYED-BUT-NOT-BUILT IS A DRAWN STATE (PLAN §6.5) — MISSING, cheap, and it removes a defect
BY CONSTRUCTION.** A planned epoch lays its **full** street and plot grid at once, then fills it
at an occupancy rate derived from elapsed years and prosperity; unfilled plots draw in the ghost
register. ⭐ **This is the honest answer to "why does our bastide look like a filled-in grid when
real ones took two hundred years to fill" — and an unevenly-filled grid NEVER READS AS
MACHINE-MADE, which removes ATLAS banned prior #6 by construction rather than by jitter.**

**LAWS.** §161g the demotion grammar (the RUIN RING age-graded by the event log; CLOSED AND
OUTLIVED BUILDINGS — *the cathedral in the town it outlived, always at full monumental ink, the
most legible demotion tell*; the CONTRACTED DEFENCE — old circuit with bricked gates plus a
humbler new palisade inside, **two vintages, two circumferences, one glance**; CAUSE-SPECIFIC
SCARS — *razed = burn on the attack bearing; plague = intact-but-emptied; economic = nothing
broken, everything closed*; RE-PROMOTION THREADS THE RUINS) · §161f the high-water law (built
EXTENT from historical maximum, OCCUPANCY from current) · §239.4 · §11.x the drift grammar.
**STATUS: PARTIAL.** §17.3's demotion arm is BUILT (34–61 humbler-rung bodies per urban leaf,
§212.1) and the high-water leaf is an exemplar. ⛔ **MISSING: the four-stage ladder (b6 draws
ONE of four rungs — roofless shells as dashed boxes), signal 5's bearing-preserving handoff,
`intramuralVacancy`, and `plannedOccupancy`.**

⭐ **AND PLAN's TRACE 6 NAMES THE IMPORTANT ONE: DECLINE BY THINNING LOOKS WRONG; DECLINE BY
EMPTYING PLUS A NEW SMALL ORGANISM LOOKS RIGHT.** The living knot in one corner of a dead city
must be **its own organism with its own anchor**, not a thinning of the old fabric.

---

### S20 · THE GROUND LAW — **BUILT**

**This stage is finished, it is the program's hardest-won surface, and a builder should change
it only with the receipts in hand.**

**MECHANISM.** One **AREA-TRUE** predicate with **ONE HOME**, consumed by the law and by every
census: *does this body's AREA intersect reserved ground?* Reserved ground is streets ∪ water
channel ∪ wall band ∪ compounds. Bodies that violate are **demoted or removed with a
diagnostic**, never overlapped. The late passes (`lateGround.js`) each **return a version**.

**LAWS.** §190 disjointness · §190a right-of-way · §200 wall clearance · §202 universal access ·
§205.1 navigability · §203 containment.
**CENSUSES (all executed at the tip — CONFIRMED):** §17 **0** intersecting drawn pairs · §17.4
**0** of 23,391 · §205A **0** · §200 **0** · §202 landlocked **0** · §201B orphan streets **0** ·
§232 straddlers **0**. Counterfactuals: planted overlap, planted right-of-way violation, sealed
court gap, severed street segment, straddling district, stale-generation circuit.
**STATUS: BUILT.** `groundLaw.js`, `reservedGround.js`, `lateGround.js`, `accessLaw.js`,
`habitation.js`. `accessLaw.js` is **stratum-agnostic** already, which is what makes §13/§168's
underground stratum cheap when it is finally built.

⚠ **THE STANDING HAZARD A BUILDER INHERITS: TWO RESERVED SURFACES CAN OCCUPY THE SAME GROUND AND
NEITHER SURFACE'S CENSUS IS LOOKING FOR THE OTHER.** MF-B7's "unresolved structures in the
town's river" turned out to be **STREET CHANNELS** — 21 channel vertices, 43 seam vertices and 28
quarter-lane vertices inside the water — invisible because every census in this family asks
about **filled bodies**, and a street is not a body: it is a claim of its own
(`laneMFB8-receipt.md` §6). ⚠ **The cure for a street crossing water is A BRIDGE, NEVER A TRIM**
— cutting the channel at the bank severs the street web across its own river and reds §201B for
a reason that is not a defect.

---

### S21 · THE CENSUSES — **BUILT** (as a family; individual censuses are listed per stage)

**THE STANDING 0/0 FAMILY** is the acceptance surface. Three rules govern every member and each
was paid for:

1. ⭐⭐⭐ **A SHARED OBJECT IS NOT A PROOF — THE PREDICATE IS THE VACUITY SURFACE** (§238.1).
   Two waves of censuses certified themselves because law and census shared a **blind vertex
   predicate**.
2. ⭐⭐ **CENSUS INDEPENDENCE IS BOUGHT BY COUNTERFACTUALS, NOT BY A SECOND IMPLEMENTATION**
   (§238.5). Every 0/0 claim carries a planted-violation arm that must red.
3. ⭐⭐ **AND FOUR MORE BLIND PREDICATES FELL WHEN THE CLASS WAS SWEPT** (§241.4): §205A channel
   crossings 113→115, §205A body wetness 12→26 (`rooted` counted **DRY** corners), and §203
   "majority AREA" 444→251 with 229 bodies judged differently — ***a census that said AREA in its
   own comment counted CORNERS and over-reported by 72%***.

⭐ **THE PROOF THAT THE SWEEP WAS SOUND: all 16 SHAs and the determinism digest were
BYTE-IDENTICAL across it — 16 census crossings and 186 containment verdicts moved and NOT ONE
PIXEL DID**, with two instruments agreeing to the unit (+16 predicted, +16 delivered).

⚠ **STANDING HAZARDS ON THIS SURFACE, each of which has bitten:** a **timeout reds like an
assertion and is not one** (when a proof's SUBJECT grows, its budget is part of the proof — the
lane timeout is 120 s, not 30 s) · a census that **convicts an absent denominator** reports the
wrong defect at the wrong magnitude · a census that measures against **part** of its subject reds
for reasons its law does not cover · an **SCC is only as wide as its scan** (five write-backs
hid inside `censusLeaf`, invisible to any SCC scoped to `buildFabric`).
⛔ **NOT BUILT: per-census runtime budgets with a completeness status where "skipped due to
scale" can never read green**, and spatial indexing with canonical insertion **and result**
ordering plus an indexed-vs-exhaustive equivalence pin. **Handed off whole with cause**
(`laneMFARCH2-receipt.md` §9.1); `reservedGround.claimIndex` is the named template and §203's
lattice arm is the first census that will want a budget.

---

### S22 · THE LENS — **PARTIAL. The geometry is drawn; the HAND is absent.**

**SIX LENSES OVER ONE GEOMETRY** (parchment, darkFantasy, watercolor, illustrated, VTT, night),
with a landed reskin-family pin. The lens layer is where §208's aesthetic mandate lives and it
is **MF-A1's brief**, not the fabric's.

**THE INK HIERARCHY (BUILT).** MF-B8 replaced the single fabric stroke width with a measured
ladder: **31 distinct stroke widths per leaf, of which six are fabric-scale — plotTick 0.24 ·
party 0.26 · fabric 0.62 · block 1.05 · landmark 1.05 · wall 2.49** — against b6's **ONE**.
ATLAS's bar is *"the corpus never has fewer than five distinct weights on one leaf"*: ★ **MEETS
the count**, and the ratio (6.5–14.0) sits **above** the corpus's own p90/p25 band.
⚠ **THREE RUNGS WERE WRONG OR ABSENT BEFORE THE FIX, and the reason is a class: `block` sat at
0.78× the fabric weight — LIGHTER than the buildings it gathers — so the silhouette could not
have read even had it been drawn; `party` and `plotTick` did not exist.** ⭐⭐ **A SHARED CLAMP
IS A SHARED CEILING, AND A LADDER WHOSE RUNGS SHARE A CLAMP IS NOT A LADDER** — the 0.5× party
wall fell under `detail`'s 0.30 floor and would have flattened into the fabric weight *at exactly
the tier the two-tier stroke exists for*.

**THE ROOF VALUE (BUILT, and it is the most visible single change on record).** J-B8-6 moved
roofs from **L≈120 to L≈155**, into the corpus's measured band **L 128–196 (median ~160)** —
*we were darker than the whole corpus.* ⚠ **MF-B1's "the fabric must not go pale" correction is
untouched, because that correction was about a DISTANCE**: §9.7's sub-law is *roofs at least
three value steps below ROADS*, and at L 155 the roof is **80 L below the street — five clear
steps**, against b1's failed 25. ⭐ **It is also load-bearing for the grain: a rank of abutting
houses resolves into holdings only if the mass is lighter than the party lines dividing it.**
**CONFIRMED by chair eyes at §229.2(b)** — the corpus-band roof values read *more* like the
references than b6/b7's uniform dark, which was heavier than **any** corpus plate.

⛔⛔ **THE PAINTED CLOSURE IS ABSENT, AND IT IS THE DECISIVE TELL.** b6 measures **0.00 on paper
grain and 0.00 on wash variation**, one stroke-width across the fabric, and **exact fill
registration where the corpus mis-registers 2–8 px** (§209.2). The five mechanics, from ATLAS
§2.3.3, each stated as a renderer mechanic:

1. **PER-STROKE WIDTH MODULATION** — ±25% along a run. *Stroke each path as a filled outline
   whose half-width is a seeded low-frequency function of arc length.*
2. **PATH WAVER** — no line is straight, including nominally straight plot boundaries; amplitude
   ≈ 0.5–1.5× the stroke width. *Per-vertex seeded displacement + midpoint subdivision, amplitude
   keyed to the element's weight class — heavier elements waver less, proportionally.*
3. **CORNER OVERSHOOT** — joins overshoot by 2–5 px at 30–60% of corners.
4. ⭐⭐ **WASH MIS-REGISTRATION — the single most decisive property.** Fill colour runs 2–8 px
   past the ink outline in places and falls short in others. *Offset each fill path by a seeded
   per-fill vector of magnitude ~0.3–1.2× the stroke width, and dilate/erode slightly.*
   **THIS IS THE ONE PROPERTY THAT, IF OMITTED, WILL KEEP THE OUTPUT READING AS VECTOR ART NO
   MATTER WHAT ELSE IS DONE.**
5. **WITHIN-FILL WASH VARIATION** and **PAPER GRAIN** — see §2.3's bands. ⚠ *Must be produced as
   GEOMETRY OR A TILED PATTERN, never as a raster filter, to survive PDF projection.*
6. **PER-FILL TONE JITTER IN TWO NESTED LEVELS** — a **ward-level** sub-palette pick, then a
   **building-level** jitter inside it. ⭐ *That nesting is what produces IQR ~50 without the
   plate looking like confetti.* (BUILT as J-B8-7 on a 9-rung quantized ladder so the fills still
   batch: the `fabric` group carries **83 distinct fill values at the town, 211 at the city, 153
   at the metropolis**, against a b6 fabric jittering on 7 quantized steps of ±0.075.)
7. **ONE FIXED LIGHT, HARD-EDGED.** Every plate that shades uses **one direction and a hard
   edge**. §9.5's shadow ruling is corpus-confirmed: **softness is the ban, not shading.**

**§214 · FEATURE ICONOGRAPHY (ruled, wave nine first-order, and SPLIT).** Its **wall arm may
proceed**: masonry as a double-line band never a bare polyline, towers as drawn rounds/squares at
**seeded-irregular** intervals, crenellation texture where scale permits, gatehouses as
structures, keep/motte with hachure, palisades as tick-rows, ditches in ditch grammar, all
tier-scaled. ⛔ **Its terrain arm is BLOCKED on S2** (§251.4a) — see S2.

**§9.5b · THE RELIEF LAW.** Era hachures, hill profiles, rock hatching and water bodies at mode.
⛔ **Terrain drama invisible = acceptance FAIL** (§177.2) — and the fjord town currently shows no
fjord.

**LAWS.** §208 · §9 (no gradients, no filters, no blends, no drop-shadows — enforced by a
forbidden-construct scan, **ABSENT across 26 files**) · §9.1 the ink hierarchy · §9.5/§9.5b ·
§214 · §12 the immersion suite.
**CENSUSES.** The §9 forbidden-construct scan (BUILT, clean) · XML parse (BUILT, 26/26) · the
per-tier op ceiling ratchet (BUILT, 96/96 under). ⛔ **MISSING: any census on the five painted
mechanics.**
**STATUS: PARTIAL.** ⚠ **The instrument that grades this needs re-windowing before it is spent
again**: `MFS1-aesthetic.py` samples 6.6 px windows that must contain no ink edge, and at the
new grain a town building is ~15 px across, so the surviving sample is dominated by ground and
field washes rather than roofs (`laneMFB8-receipt.md` §9). **Wave nine should re-window the
instrument to the new module before re-grading the tone-jitter row.**

---

### S23 · CHROME, LETTERING AND THE TRUTH LAYER — **PARTIAL**

**⭐ THIS IS WHERE WE ALREADY BEAT THE CORPUS AND IT SHOULD NOT BE ERODED (ATLAS Table C).**
Truth in the chrome — real settlement names, real populations, real prosperity, real founding
kind, real water mode, a real 200-paces scale bar, real dated event marginalia — against
hf61's **gibberish legend**, which is the corpus's floor. A **declared derivation** in the
cartouche (*"FABRIC 1:1.3 HOUSEHOLDS (REPRESENTATIVE)"*, *"REGULARIZED PLAN · FOUNDED MILITARY ·
WATER BANKSIDE"*). An in-world legend that teaches the conventions, on **every** leaf where the
corpus has one plate of furniture. Six lenses over one geometry. Byte-identical export.
**ATLAS banned prior #12 states it plainly: corrupt or decorative lettering is a style NOT to
copy — our labels are TRUE, and this is a competitive win.**

**LETTERING [E, ATLAS §2.3.4].** Serif throughout; small-caps for display; italic for
marginalia; loose letter-spacing on display type; **labels curve along their feature**; and
⭐ **gate and road names encode DESTINATION** (Porta Peregrina, Porta Mercatorum, Porta
Fluminis) — which composes exactly with CX-15's typed gates.

**T-25 · CHROME ESCALATES WITH TIER — ⛔ MISSING (GAP-I).** Cartouche (plain rule box → moulded
frame → ornate scrolled frame with colour), compass (4-point plain → 8-point coloured), scale
bar (three registers), plus **3–8 seeded paper defects per leaf**. b6 has all three surfaces,
well made, and **identical at every tier**. ⭐ *One `chromeRung` from tier × prosperity drives all
three. Trivial, and it makes the tier read even in the margins.*

**T-26 · THE ANNOTATION LAYER IS A SEPARATE INK — the DM lens's rendering contract.** Four rules:
a different hue family (red/rust) · always dashed or dotted · always with a leader line and a
serif label · drawn above with **zero interaction with the base ink**.

**§161i's NON-DEFERRABLE RIDER, and it is easy to lose:** ⭐ **THE TRUE MEASURE IS MINTED — the
physical-distance metric gets its derivation home in-family and the scale bar ships TRUE.**
**LAWS.** §12 the immersion suite · §9.4 the document conceit · §3's audience projection ·
§10.C the DM lens · §161i.
**STATUS: PARTIAL.** Chrome, lettering, cartouche, compass, scale bar, legend and heraldry are
BUILT; the tier rung and the annotation contract are not. ⚠ Carried defects: heraldic charges
read coarse at cartouche size; no rank cartouches or district sub-labels.

---

## §2 · THE TARGET SHEET — the measured bands each stage must land in

**HOW THIS SHEET IS USED (ATLAS §2.8, binding).** Every self-judgment cites the number and
states the **ABSOLUTE DISTANCE**, never "improved" (§8.3b). Nothing here is a pin: every number
is a target for the chair to convert into a pin, a band, or a rejection. The five measurement
instruments are re-runnable against any render directory.

### §2.0 · THE FIVE USAGE RULES A LATER LANE MUST INHERIT (ATLAS §2.8.1 — binding)

1. ⭐⭐ **BANDS RE-PIN TO THE STRONGEST MEASURED COHORT, NEVER TO THE CORPUS MEDIAN (§244.4).**
   The cohort is computable: **HF-1-era plates (n=49) ∪ the measured top decile on the register
   index (threshold 73.78; n=32; 10 in both) = n=71.** *Why:* the corpus grew paler round by
   round; **pinning to the median ratifies our own drift and makes the north star chase the
   generator that drew it.** ⭐ **SIGN CHECK FOR ANYONE RE-DERIVING: done correctly, paper grain,
   wash σ and tone IQR move UP against what MF-S1 published. If your re-derivation moves them
   DOWN, you pinned to the median.** (§249.1: *a re-deriver who takes the median gets the wrong
   SIGN, not merely the wrong magnitude.*)
   ⚠ **AMENDMENT, §249.4(a): any axis NOT represented in the register index pins to HF-1 ALONE**
   — paper warmth is exactly that case, because the register index deliberately excludes chroma
   and warmth. **Paper warmth pins at 37** (see conflict **C-1**).
2. ⛔ **T-01's THORP AND HAMLET RUNGS ARE WITHDRAWN AND MAY NOT BE GRADED (§244.5).** Not
   widened — **withdrawn**, because `cells_across` counts dark runs and at thorp scale the
   bounding box is mostly hedges, tofts, furlong furrows and orchard rows. ⭐ **`hf90`, a
   TWELVE-ROOF thorp, returns 99.6 "cells across".** **What restores them: a ROOF-COUNT
   instrument** — these plates carry 6–24 roofs, so an eye count is *exact*. **Any grading
   verdict already issued against them is withdrawn with them.**
3. ⚠ **INSTRUMENT PROVENANCE — know which ruler produced each number before you compare to it.**
   `MFS1-measure.py` (texture blocks, palette clusters, colour-family shares) — ⛔ **its
   `center_edge_ratio` is the one noisy field: median 7% deviation, max 44%. DO NOT BAND THAT
   NUMBER at this precision, and T-03 rests on it.** · `MFS1-aesthetic.py` (grain σ, wash σ, tone
   IQR, stroke percentiles) — reproduces all 12 archived rows **exactly**, and **it ran on 12
   plates only**. · `MFS1-grain2.py` (fabric grain) — kernel reproduces all 22 archived rows
   exactly; **only the WINDOWS moved**, and they are hand-set. · `MFS1-streets.py` — ⚠ **NOT
   re-run at scale, deliberately**: it depends on the same hand-set cell pitch as grain, so
   **T-04's numbers are unrefreshed and unverified at thorp/hamlet.** · `HFM1-palette.py` — ⭐
   the **RECOVERED** paper/ink instrument (no original survived); calibrated against 49 published
   pairs to within 3/255 on ink hex. ⚠ *It is a recovery, not the original — and it exposed the
   paper border-inset defect the original hid.*
4. ⭐ **A GRADING COHORT MUST BE MEASURED AGAINST THE SAME INSTRUMENT AS ITS PREDECESSORS BEFORE
   ITS GRADES ARE SPENT (§244.2).** Stars, "best in corpus" calls and register-edge judgments are
   **ANNOTATIONS** until that has happened. ⛔ **HF-4c's ★★★ grades are annotations by ruling and
   NO CALIBRATION FIGURE MAY DERIVE FROM THEM** — that round awarded ★★★ to 55 of 78 (70.5%),
   not the 41 it self-reported, against HF-3's 2 of 84, and measures the **weakest of five
   rounds** on the atlas's own hand axes controlling for subject.
5. ⚠ **CANONICAL PATHS (§243).** Cite `map-corpus/` only. **The session scratchpad is a MIRROR
   that may vanish; a lane that reads it is reading a copy nothing may depend on.**

6. ⚠⚠ **A CORPUS-WIDE EXEMPLAR FIGURE IS A FEW SETTLEMENTS MULTIPLIED — PUBLISH THE
   DISTINCT-SITE TOTAL BESIDE IT OR SAY THAT YOU HAVE NOT.** Seven of the sixteen leaves share
   seed `mf-town-01` + riverside and two share `mf-city-01` + coastal, so **10 distinct worlds
   wear 16 names** (§0.3b). ⭐ **A one-river move publishes up to SIX TIMES**, which is exactly
   how MF-ARCH-2's `waterViolations` +51 read as a corpus regression when it was +10 on one town.
   **This rule governs every count in §2 and §4 of the form "N over 16 leaves".**

⭐ **AND ONE MORE, FROM THE SAME FAMILY (§249.3): A SUPERLATIVE IS A CLAIM AND MUST BE MEASURED
AT ITS STATED SCOPE.** The atlas's own 32 superlatives were audited and six were false *even of
the 12-plate sample they were drawn from.*

### §2.1 · T-01 · FABRIC GRAIN BY TIER — the headline target

| tier | **target band (cells across)** | basis | status |
|---|---|---|---|
| **thorp** | ⛔ **none — WITHDRAWN** | published 8–14 rested on n=1 with a **misplaced window** | **may not be graded** until a roof-count instrument exists |
| **hamlet** | ⛔ **none — WITHDRAWN** | published 18–26 was **interpolated through that same fault** | **may not be graded** |
| **village** | **30 – 50** | [M] n=5 → re-measured n=9, 6/9 in band, median 48.0 → **45.9** | ✅ UNCHANGED |
| **town** | **45 – 80** | [M] n=8 → re-measured n=12, 10/12 in band, median 61.3 → **57.0** | ✅ UNCHANGED |
| **city** | **60 – 95** | [M] n=5 → re-measured n=9, 7/9 in band, median 74.2 → **69.0** | ✅ UNCHANGED |
| **metropolis** | **80 – 120** | published 100–130 rested on n=1; re-measured n=9 (70.2 – 97.6 – 119.6), only 4/9 inside it | ⚠ **RE-PINNED** |

**THE ONE NUMBER THAT MATTERS MOST: the corpus's fabric grain walks 46 → 57 → 69 → 98 cells
across from village to metropolis — monotonic, ×1.24 · ×1.21 · ×1.41, and it never plateaus.**
The claim is **CONFIRMED at n = 9/12/9/9 over four tiers**, which is stronger evidence than the
withdrawn six-rung version ever had. ⭐ **The corpus makes tier legible at a glance chiefly by
GRAIN, and grain is CELLS ACROSS THE SETTLEMENT, not building size in absolute units.**

⛔ **NO INTERPOLATION RULE EXISTS BETWEEN THE RUNGS.** `cells_across ≈ 5.7 × population^0.27`
(R² 0.80) is **WITHDRAWN** and **may not be cited; no derivation may be built on it.** **The BAND
ENDPOINTS are the whole of T-01.** See §1.2c for the restoration path and the external
cross-check.

⚠ **THE ≤30% BAND-OVERLAP RIDER IS RETIRED AS UNSATISFIABLE (§249.4b)** — the atlas's own
town/city bands overlap by **57%**. Its measured overlap is recorded instead as **a FACT ABOUT
TIERS: grain alone does not separate town from city**, so tier legibility must rest on the
multi-channel read (landmark budget T-16, district channels T-17, chrome T-25). ⛔ **The IQR
alternative (village 39–48, town 47–67, city 63–81, metropolis 81–107) was measured and NOT
ADOPTED**, because narrowing the bands would silently move MF-B8's standing verdicts.

**WHERE WE STAND (CONFIRMED, `laneMFB8-receipt.md` §0; b8b re-measured town 50.5, city 61.3):**

| tier | b6 (atlas) | **b8** | band | verdict under §244.5 |
|---|---|---|---|---|
| thorp | — | 5.4 | ⛔ withdrawn | ⛔ **NOT GRADED — the reported miss was an INSTRUMENT ARTIFACT** |
| hamlet | — | 10.4 | ⛔ withdrawn | ⛔ **NOT GRADED — same cause** |
| village | 9.6 | **17.0** | 30–50 | MISSES ×1.76 from the floor |
| **town** | 26.0 | **48.0 / 50.5** | **45–80** | ★ **MEETS — STANDS** |
| **city** | 20.0 | **61.0 / 61.3** | **60–95** | ★ **MEETS — STANDS** |
| metropolis | 20.9 | **70.0** | 80–120 | ⚠ **still a miss, ×1.14 from the floor — not the ×1.43 reported against the withdrawn band** |

⭐⭐ **AND THE INVERSION IS GONE STRUCTURALLY, NOT BY TUNING (§229.1).** The b6/b7 walk inverted
at town→city (26 → 20) and flatlined above. The walk is now **5.4 → 10.4 → 17.0 → 48.0 → 61.0 →
70.0, MONOTONE** — because grain is a **continuous function of population**, so **no seam can
invert and no later tuning pass can make it.** ⭐ *A monotone function of population cannot invert
at a tier seam; a per-tier constant always can.*

**THE BUILT DERIVATION (`tierGrammar.js`), in four lines:**

```
GRAIN_BAND    thorp 8–14 · hamlet 18–26 · village 30–50 · town 45–80 · city 60–95 · metropolis 100–130
              ⚠ metropolis is STALE — conflict C-2 rules the corrected band 80–120 binds
GRAIN_SEAMS   8 → 16 → 28 → 47.5 → 70 → 97.5 → 130     (the mean of each pair of FACING endpoints)
cells(pop)    lo + (hi − lo) × bandPosition(pop, tier)  — CONTINUOUS, MONOTONE, band-bound
roofs         N = π · cells² / (4 · fill · depthRatio)
```

⭐⭐⭐ **THE SEAM CONSTRUCTION IS WHY THE INVERSION CANNOT COME BACK, AND IT IS THE ONE PIECE OF
ARITHMETIC A BUILDER MUST NOT "SIMPLIFY".** The measured bands **do not meet** — the thorp's
ceiling is 14 and the hamlet's floor is 18 — so reading each tier's own endpoints literally puts
a **JUMP at every seam**, which is the discontinuity §161f forbids in as many words. **Taking the
MEAN of the two facing endpoints makes the curve continuous, monotone, and never outside the
union of the two bands it joins.** VERIFIED: **11,765 populations swept from 1 to 200,000 — ZERO
decreases; every tier seam continuous to 2 d.p.**
⭐ **AND THE ARITHMETIC REPRODUCES THE ATLAS'S OWN INDEPENDENT CHECK.** Eliminating both the
radius and the frontage from the two definitions — *and they DO both cancel, which is what makes
this a derivation rather than a fit* — gives `N = π·cells²/(4·fill·dr)`. At 60 cells and 60%
fill that returns **2,176**; MF-S1, reasoning independently, wrote *"≈2,200 parcels"*. **Within
1%.**
⚠ **THE GRAIN DERIVATION IS THE ROOF COUNT'S ONLY HOME** — `grainCellsAcross → grainRoofs →
tierScale.roofs → the packer's calibration target. Restoring the old `220 + 640·bandPosition`
formula silently restores the inversion with no error anywhere.**
⚠ **AND THE INSTRUMENT MEASURES WHAT RESOLVES, NOT WHAT EXISTS.** b7's town already carried 82
plot modules across its window and counted 24.8 — **the ×3.3 gap was DRAWING, not derivation.**
`MFB8-runprobe.py` separates the two and should be standard.

### §2.2 · T-02 · GRAIN MUST KEEP CLIMBING ABOVE TOWN

**Target [M]: city ≥ 1.2× town grain; metropolis ≥ 1.4× city grain.**
✅ **CONFIRMED, AND ON A MUCH LARGER SAMPLE THAN IT WAS SET FROM: city/town = 69.0/57.0 = ×1.21
(n=9, n=12) and metropolis/city = 97.6/69.0 = ×1.41 (n=9, was n=1). Both within 0.01 of the
published target.** ⭐ **T-02 is the one headline figure the measurement pass STRENGTHENED rather
than moved** — and note it is a **RATIO** target, which is why it survived the absolute re-pinning
of the metropolis rung intact.
**WHERE WE STAND:** city ÷ town = **×1.27 ✔ MEETS**; metropolis ÷ city = **×1.15 ⛔ MISSES**.
⛔ **AND THE CAUSE IS THE EXEMPLARS' POPULATIONS, NOT THE LAW, WHICH B8 SHOWED RATHER THAN
CLAIMED**: the city exemplar sits at bandPosition **0.61** of its band and the metropolis at
**0.44** of its (20,091 souls against 71,325 — only ×3.5). At the derived level the same curve
gives 86.9 and 111.9 (**ratio 1.29**); at the band centres, 77.5 and 115 (**ratio 1.48 ✔**).
⭐ *Forcing 1.4 at these two populations would require the metropolis to read as a 128,000-soul
settlement, which is §161f repealed to make a ratio.* **The law is right and the exemplar pair is
close together.**

### §2.3 · THE AESTHETIC BANDS (§208) — strongest cohort, n=71

| property | **band (p5 – median – p95)** | note |
|---|---|---|
| **Paper** | centroid **`#FAEBD8`**, L **226 – 244**, warmth R−B **20 – 50** | ⭐ **target warmth 37 per §249.4a (conflict C-1), NEVER the corpus median `#FBF2E2` / warmth 25.** Warm cream, never white, never grey. ⚠ **The corpus MOVED AWAY from this target: warmth by round 37 → 27.5 → 24 → 23 → 24, in-band share 96% → ~55%. The paper is going white.** |
| **Ink** | centroid **`#2E201A`** (L 34.3); ink L **16.5 – 35.2 – 66.4** | a **warm dark brown-black**, not black and not grey — and the centroid is **UNCHANGED** under correct pinning |
| ⭐ **INK L — the quality gate** | **≤ 45 full ink · 45–62 acceptable · > 62 UNDER-INKED** | replaces the retired value-range band. Two independent derivations landed on 62 (the strongest cohort's p93 = 62.1 **and** the light end of the published ink band `#5E3420` = L 62.3). **13.7% of the 313 exceed it; only 7.0% of the strongest cohort does.** b6 measures **35.0 → MEETS** |
| **Value structure** | L1 **52** · L10 **115** · L50 **202** · L90 **231** · L99 **237** | strongly paper-weighted with a thin dark tail — ⭐ **the page is light and the INK IS THE EVENT** |
| **Chroma** | **18 – 43.3 – 70** (p5–p95 23.6 – 61.9) | ✅ **UNCHANGED.** ⭐ The band that best proves why the pinning rule matters: from the corpus **median** it is 36.2 with the top collapsing 70 → 52. **The −8 is a fact about OUR DRIFT, not about the target.** ⭐ hf40 achieves the corpus's clearest wealth read at chroma **27.8** — *colour is not what carries the information* |
| **Stroke percentiles** (normalised to a 5056 px plate) | p25 **4** · p50 **6** · p75 **10** · p90 **17** | ✅ UNCHANGED |
| **Lineweight ratio p90/p25** | **3.1 – 4.33 – 7.2** (min–max 2.8 – 9.3) | ⚠ **MOVED UP, 3.55 → 4.33, and it is a SAMPLE-SIZE CORRECTION, not corpus drift.** ⭐ **The ink hierarchy is STEEPER than the atlas published, which RAISES the bar** |
| **Paper grain σ** | **1.30 – 2.05 – 2.96** (min–max 1.00 – 3.41, n=64) | ⚠ MOVED **UP**. ⚠ **16 plates have no measurable blank paper at all — that is DATA, not a gap: they are the densest plates in the corpus.** Plus 3–8 discrete paper defects per leaf |
| **Within-fill wash σ** | **1.83 – 3.29 – 4.39** (min–max 1.22 – 4.44) | ⚠ MOVED **UP** at the floor and the median |
| **Per-fill tone jitter (IQR)** | **8.0 – 22.0 – 66.5** (min–max 4.0 – 100.1) | ⚠ MOVED **UP**. The corpus maximum over 313 is **153.0**, not 100.1 |
| **Distinct weights per leaf** | **≥ 5** | ★ *"the corpus never has fewer than five distinct weights on one leaf"* |
| **Accent** | **rationed, ~1–3% of plate area** | reserved: vats, candle ochre, annotation rust |

**THE WEIGHT LADDER, measured [M]:** wall circuit **4.0 – 5.0** (the heaviest strokes measured,
p90 = 35 px on hf55) · landmark silhouette 2.5 – 3.5 · **block silhouette 2.0** · street-fronting
building edge **1.0 (the reference weight)** · **interior party-wall / unit division 0.5** ·
plot-boundary tick 0.4 – 0.6 · field boundary / furrow 0.25 – 0.4 · **ghost register 0.38 with a
6-2 dash**.

**ROLE VALUES [M]:** Roads are **the palest built role — bare paper or paper + 2 L**. Roofs
**L 128 – 196**, and **≥3 value steps below Roads in every plate** (§9.7's binding sub-law,
corpus-confirmed). Greens (yards/tofts) one sage family, 3–5 tones. Water: river = a mid wash +
a dark bank line; sea = the same family one band darker — **never a hue jump**. Walls equal to
Ink or one step darker.

**WHERE WE STAND (b6, ATLAS Table B):** paper grain **0.00 ★ ABSENT** · within-fill wash **0.00
★ ABSENT — every fill is mathematically flat** · tone jitter **town/village/metropolis 4.0 →
MISSES ×5.5**, and ⚠ **the watercolor lens measures 0.2, FLATTER than the parchment lens, which
inverts its own definition** · wash mis-registration **★ ABSENT — the decisive "vector art"
tell** · path waver, stroke modulation, corner overshoot **ABSENT** · lineweight hierarchy
**★ MISSES at b6 → ★ MEETS at b8** (six fabric-scale weights, ratio 6.5–14.0).

### §2.4 · THE PLAN-STRUCTURE BANDS (PLAN)

| target | **band** | instrument / note |
|---|---|---|
| **junction mix — X : T** | **≤ 0.09** (corpus median **0.024**) | 35 whole-settlement windows. ⭐ *forty-three T-junctions per X* |
| **degree ≥5 share** | **≤ 0.01** (median 0.000; 22 of 35 windows have zero) | — |
| **T/Y share** | 0.510 – **0.653** – 0.738 | — |
| **dead-end share** | 0.110 – **0.209** – 0.391 | ⭐ per-district band **proposed**: rich 0.15–0.22, poor 0.26–0.34 |
| **γ connectivity** | **0.39 – 0.52** (median 0.473) | ⭐ *a half-mesh, neither tree (0.33) nor mesh (1.0)* |
| **mean degree** | **2.1 – 2.7** (median 2.47) | edge/node ratio 1.17 – **1.40** – 1.55 |
| **orientation-order φ, whole settlement** | 0.044 – **0.103** – 0.433 | Boeing φ, 36 bins, bidirectional, length-weighted |
| **φ, planned quarter** | **0.318 – 0.652**, ⛔ **hard ceiling 0.8** | *a planned quarter measuring φ > 0.8 is drawn wrong* |
| **block elongation** | median **1.6 – 3.0** (corpus median 2.14) | ⭐ *the corpus draws STRIPS, not squares* |
| **block solidity** | median **0.60 – 0.86** (corpus median 0.748) | *a quarter of a typical block's convex hull is not block* |
| **block area p90/p10** | **≥ 6** (corpus median 13.6, max 204.5) | *the spread IS the information* |
| **street width p50 / p97 (distance transform, plot-widths)** | 0.44 – **1.77** – 4.90 / 1.24 – **5.72** – 22.07 | ⚠ **a DIFFERENT quantity from T-04's scanline ratio — do not compare directly** |
| **width hierarchy p97/p50 (distance transform)** | 1.79 – **3.32** – 7.30; towns/cities cluster **2.4 – 4.6** | at hamlet/thorp the hierarchy is **genuinely flat** (1.79, 2.04) |
| **legible epochs** | thorp/hamlet 1 · village 1–2 · town 2–3 · city 2–4 · metropolis 3–4; ⛔ **NEVER more than 4** | corroborates §240.2's ring ceilings independently |
| **legible districts** | thorp 0–1 · hamlet 1 · village 1–3 · town 3–6 · city 5–9 · metropolis 8–14 | ⭐ *legibility saturates well below enumeration* |
| **district separation** | **≥1.4× in median block area OR ≥1.3× in cells-across** | proposed band for GAP-H's label-free census |
| **epoch grain step** | newer epoch **1.8× – 2.9× COARSER** | ⭐ *old cores are the finely subdivided ones* |
| **epoch φ step (planned)** | **×2.4 – ×9.5** | ⭐ *order tracks FOUNDING MODE, not age* |
| **void count ≥4 pw²** | median **7** per settlement, range 0–24 | ⚠ *"largest void" is NOT "the centre"* |
| **polycentricity index** | monocentric <0.15 (12/34) · polycentric >0.55 (13/34) | second-largest void ÷ largest void |
| **ordinary : notable** | notable **2–5% of footprints at town, 1–2% at city**, occupying **10–20% of built area** | ⭐ *small in COUNT, large in AREA* |
| **outliers per block** | 16–18 near-module, **2–4 outliers** per 20 buildings | outliers change **plan topology**, not just size |

### §2.5 · THE CONTEXT-STRUCTURE BANDS AND FREQUENCIES

| target | **band / frequency** | source |
|---|---|---|
| water relationship incidence | **BANKSIDE 44% · NONE/WELL 29% · NEAR 15% · THROUGH 12%** | ATLAS T-12 [E, n=34] |
| THROUGH settlements | **≤15%**, and **every one must show bank asymmetry** (~70/30) | ATLAS T-12 |
| walled incidence | **≈29 walled / ≈12 unwalled of 41**, and the split **is the tier line** | ATLAS T-10 |
| wall flank grammar | full ring **55%** · half-ring vs water **17%** · terrain-anchored **14%** · water gates **10%** · two vintages in frame **10%** | ⭐ **a generator drawing a full ring 100% of the time is wrong by ~45 points** |
| towers absent on a flank | **6 of 7** walled plates, and the bare flank is **always the terrain-defended one** | CONTEXT §3.2 [M-view] |
| wall-side street | **7/7 plates on SOME runs; 0/7 on EVERY run** | ⛔ **§200's census must exempt by RUN TYPE or it reds on correct output** |
| gate counts | town **2–4** · city **~4** · metropolis **6–7** | CONTEXT §3.3 [M-view] |
| extramural growth | present in **≥60%** of walled, concentrated at **ONE or TWO gates**, never even | ATLAS T-21; ribbon extents **explicitly unequal** |
| route-isolated courts | **3–15% of blocks** (proposed pin ≤12% of blocks AND ≤20% of interior open spaces, **floor > 0 at town+**) | §209.4 reconciling §204 |
| interior yards **with a mouth** | **15–65%, common and unrestricted — A DIFFERENT OBJECT** | §209.4 |
| open share in the fabric | village **5–27%** · town **2–13%** · city **1–11%** · metropolis **≈1%** | ATLAS T-05 |
| per-district open-share modifiers | government/civic **+10–15 pts** · religious precincts **+15–20** · crafts/noxious **−5** · poor quarters **tightest (~2–4%)** · military compounds **+25–30** | ATLAS T-05 [E] |
| landmark budget | thorp **1** · hamlet 1–2 · village 2–5 · town **3–7** · city 4–9 · metropolis **9+** | ATLAS T-16 |
| landmark : house footprint ratio | thorp 1.6:1 · village 3–4:1 · town 5–6:1 · city ~8:1 · metropolis ~12:1 | ⚠ b6 measures ~2:1 — **we draw too many, too small** |
| alley / sliver floor (street width p25) | **0.02 – 0.08** plot-widths | ⚠ **a HIGHER floor means UNIFORM SPACING, not tight packing.** b8 reads 0.16/0.09/0.09 — the town moved the **wrong way** |
| through-gap frequency | **~1 per 6–9 plots** along a frontage | ATLAS T-09 [E] |
| burgage plot geometry | depth:width **4–6 : 1** · building **30–45% of plot depth** · **touching the street line** · series widths ±**20–40%**, never exact | ATLAS T-08 [M] |
| street hierarchy p97/p50 (**scanline**, T-04) | organic town/city **16–30** · planned **7.5–13** · chaotic ≈14 **with the widest class MISSING** | ⚠ b8 reads 9.9 / 12.1 / 12.4 — **misses, closing** |
| widest channel p99 (scanline) | **2.7 – 6.4** plot-widths | ★ b8 reads 5.34 / 4.82 / 6.70 — **MEETS** |
| density gradient (centre : edge) | organic **2.5–5.0** · planned **1.4–1.9** · growth-ring/boom/influx **7–17** · demoted **4–5** with near-zero occupancy beyond the core | ⚠ **T-03's basis is the noisy `center_edge_ratio` — §249.4c flagged it too noisy to band, and it is flagged, not guessed** |

### §2.6 · ⛔ WHERE A TARGET DOES NOT EXIST, AND MUST NOT BE INVENTED

**Four rows carry the fifth verdict — ⛔ WITHDRAWN or UNBANDED — and a grading pass must leave
them blank rather than convert them into a pass or a fail.**

1. ⛔ **T-01 thorp and hamlet grain.** No instrument. **Restorer named: a ROOF-COUNT pass.**
   Until it exists these two rungs have **no target** and no leaf may be graded on them.
2. ⛔ **The population→grain fit.** **UNRESTORABLE from the corpus** (§249.4c) because every
   population in it but one is an eye estimate. **Restorer named in §1.2c: fit against our own
   leaves, whose populations are facts.**
3. ⛔ **T-03's density gradient.** Its basis is too noisy to band at this precision (median 7%
   deviation, max 44%). **Flagged, not guessed.** And per **C-4** it is a census, never a
   generator input.
4. ⛔ **T-05's fill share.** ⚠ **A MEASUREMENT MISMATCH, NOT SIXTEEN LEAVES OF FAILURE.** ATLAS's
   `open_share_in_core` is a **TEXTURE** measure (8×8 blocks by edge density); the built census
   computes `1 − building area ÷ wash area`. **They are different quantities and the built one
   has no measured band behind it.** The census reports it with its definition stated and its
   band declared **DERIVED-NOT-CORPUS**. ⭐ **Wave nine must either measure the atlas's own
   quantity on the plate, or set a band for ours — and say which.** (See **CHAIR QUESTION Q-4**.)

⚠ **One more the corpus itself cannot supply: the frozen corpus has ZERO trade (0/4) and ZERO
institution (0/3) coverage in the blind holdout** (§249.4c) — a known limit, recorded so nobody
mistakes silence for evidence.

---

## §3 · THE INVARIANTS — what may never move, and why

### §3.1 · ⭐⭐ THE FOUR TIER-INVARIANTS (§250.6a, ADOPTED AS LAW)

**MEASURED [M, PLAN §8] — these barely move from village to metropolis:**

| property | village | town | city | metropolis |
|---|---|---|---|---|
| T/Y share (median) | 0.678 | 0.653 | 0.596 | 0.650 |
| X share (median) | 0.011 | 0.020 | 0.007 | 0.016 |
| dead-end share (median) | 0.209 | 0.195 | 0.219 | 0.225 |
| orientation-order φ (median) | 0.085 | 0.119 | 0.069 | 0.095 |
| block elongation (median) | ~2.1 | ~2.1 | ~2.1 | ~2.1 |

⭐⭐ **THE LAW: JUNCTION MIX, DEAD-END RATE, ORIENTATION ORDER AND BLOCK ELONGATION MUST NEVER BE
SCALED WITH TIER.** They take **no input at all** — they are fixed global constants in the
street-graph generator, censused per leaf.

⭐ **WHY THIS IS ADOPTED AS LAW RATHER THAN LEFT AS AN OBSERVATION (§250.6a): these are precisely
the dials tuning would reach for when a metropolis looks wrong, and moving them destroys the
settlement's KIND rather than its SIZE.** *A metropolis is not a more ordered village; it is a
village's grammar at 100 cells across instead of 30.* **This is the most useful negative result
in the study program.**

⚠⚠ **AND THE PRECISION MATTERS, BECAUSE A LATER LANE WILL OTHERWISE PIN THE WRONG THING.
"TIER-INVARIANT" DOES NOT MEAN "CONSTANT".** The same four quantities are **strongly variant
along axes that are not tier**:

- **dead-end rate varies with WEALTH** — hf40's poor half carries **38% more** dead ends than its
  rich half (0.296 vs 0.215) — **and with EPOCH AGE**, rising in a young epoch that is not yet
  full (0.225 → 0.342);
- **φ varies enormously PER EPOCH AND PER ORGANISM** — 7.9×, 9.5× and 2.4× *within a single
  plate* — while the settlement-level median stays flat;
- **X share varies PER EPOCH** — hf239's castra camp carries the corpus's highest (0.088) while
  its own vicus carries 0.028.

⭐ **THE CORRECT STATEMENT, WHICH IS WHAT A CENSUS MUST ENCODE: these four are invariant with
POPULATION AND TIER, and variant with WEALTH, EPOCH AND FOUNDING MODE.** A census that pins them
per-leaf enforces the first; a census that pins them per-*district* or per-*epoch* would forbid
the second and would be wrong.

**VARIANT [M, PLAN §8] — these move monotonically, and `population` alone drives every one of
them (§161f's continuous-scale law, corpus-confirmed):** cells across · width hierarchy · legible
districts · legible epochs · void count.

### §3.2 · ⭐⭐ WHAT MAY NEVER BE A GENERATOR INPUT (§250.6b, ADOPTED AS A GENERAL LAW)

> **A DESCRIPTIVE STATISTIC MAY BE A CENSUS AND MUST BE FORBIDDEN AS A GENERATOR INPUT.**

**The named instance: `radialDensityFalloff`.** It is a **symptom** of age, wealth and land use;
fitting to it **re-bakes the concentric prior we ban** — *the same disease as pinning bands to
the corpus median (§244.4).* PLAN §1.5's correction is the general form: **grain is
`f(epoch_age, districtWealth, landUse)` and the radial gradient is allowed to EMERGE from the
fact that older epochs are usually inner. Never impose radius directly.**
⭐ *A generator that imposes a radial density falloff will produce a plausible BLOB and an
unreadable HISTORY.*

**Keep the statistic as a census — it is a good detector.** Its first run already caught
something real: **every leaf reads flat and several read below 1.0 — the edge is denser than the
centre** (village 1.19 · town 1.05 · city 0.65 · metropolis 0.76 · highwater 0.73, against
organic 2.5–5.0). ⚠ **It is a DIFFERENT quantity from the atlas's image-measured
`center_edge_ratio`** (which counts *all* ink including streets and ticks); the built one counts
**built-body area only**. Both definitions are stated wherever either is used.

**THE SAME LAW, RESTATED FOR THREE MORE CASES A BUILDER WILL MEET:**

| statistic | census? | generator input? |
|---|---|---|
| `radialDensityFalloff` | ✅ yes, with per-morphology detection bands | ⛔ **NEVER** |
| street **width class** | ✅ yes | ⛔ **NEVER as a source** — width **quantises a derived graph load** (§250.6c) |
| **junction mix / φ / dead-end / elongation** | ✅ yes, per leaf | ⛔ **never scaled by tier** (§3.1) |
| **aesthetic bands** | ✅ yes, against the strongest cohort | ⛔ **never re-derived from the corpus MEDIAN** (§244.4) |

### §3.3 · DETERMINISM AND IDENTITY — the non-negotiables

**These are ground, not risk (§161j): "BY-NATURE owner gates, DETERMINISM, THE PROMISE and §8
coherence are ground, not risk."** The map decision rule says implementation risk is never a
veto — *a harder-but-truer mechanism wins* — **and these four are outside that grant.**

1. ⭐⭐ **`keyedRandom` OVER STABLE LINEAGE IDS, NEVER A STREAM POSITION.** Every draw goes
   through `fabricForkKey` / `keyedRandom(seed, …, {variant})`. **A stream draw couples every
   entity to every other; a hash of the entity key does not** — which is what makes §161h's
   inertia law **arithmetically true rather than asserted**. ⭐ **PRIOR-ART independently
   confirms the primitive (§253.3a):** FMG's "unround" dither is *a perturbation built from
   STABLE ENTITY IDS that consumes NO PRNG STATE*, and it is ranked their #1 transferable idea.
   ⚠ **THE RATCHET IS FROZEN EXACTLY** at `snapshot.js: 1, substrate.js: 4`, with
   `buildFabric.js` asserted **ABSENT**; a hand-minted key is a defect by construction. ⚠
   `substrate.js` still composes its own root as `${seed}::substrate::variant:N` — **a second
   SPELLING of the salt; the salt IS there, and converting it moves every leaf for no measured
   defect.** Recorded as a duplicated-rule hazard, not cured.
2. ⭐⭐ **PER-EPOCH KEYED STREAMS.** `wall.epoch.k` replaces one stream walked in ring order.
   **One stream in ring order means adding a later circuit RE-ROLLS every gate of an earlier
   one** — and the outer ring is traced FIRST, so the earlier epoch is exactly what would move.
   **This is what makes an epoch boundary an INERTIA SEAM rather than a re-roll.**
3. ⭐⭐ **NO PLATFORM-VARIANT MATH.** The purity scan bans `Math.random`, `Date`,
   `localeCompare`, `Math.pow` and all trig, **enforced across 45 files with comments stripped,
   and it reads NONE.** ⚠ **THAT SCAN IS WHAT MAKES CROSS-ENGINE AGREEMENT PLAUSIBLE — AN
   ENFORCEMENT BY SCAN, NOT A PROOF BY EXECUTION.**
4. **FIXED-PRECISION TOPOLOGY.** Two quanta with **one home** in `fabricGeometry.js`:
   **`r2` (PAINT, 2 dp)** — what the lens strokes; nothing legal is decided from it — and
   **`q6` (TOPOLOGY, 6 dp)** applied **at the moment of serialization**, so *"did this geometry
   change"* has **one answer rather than a per-caller float tolerance**. ⚠ **THE QUANTUM IS A
   SERIALIZATION RULE, NOT A STORAGE RULE**: geometry is still carried as float and every law
   still decides on floats. Quantizing the **stored** legality geometry moves every pixel and
   owes its own equivalence proof — **not done, handed off.**
5. **BYTE-EXACT SAME-SEED OUTPUT.** 10 cross-process runs → **one digest**
   (`87da9c41…`). **CONFIRMED.**
6. **CROSS-ENGINE.** Four V8 execution modes — default (TurboFan), `--jitless` (**no JIT at
   all**), `--no-opt` (baseline tier only), and a third tiering profile — produce **ONE digest**.
   ⛔⛔ **WHAT IT DOES NOT PROVE, STATED SO IT IS NEVER READ AS MORE: one V8, one libm, one
   machine, one architecture. It says nothing about SpiderMonkey or JavaScriptCore, nothing about
   ARM vs x86, nothing about a browser.** ⚠ The **driver table** is the deliverable: adding
   `bun`, `deno` or a headless browser is **one row**, and a driver that cannot run is reported
   and exits non-zero rather than passing quietly.
7. ⭐ **THE INERTIA LAW AT FABRIC SCALE, WITH ITS UNIT NAMED (J-B8-12): THE UNIT OF INERTIA IS
   THE BLOCK, NOT THE PLOT** — a burgage row is cut **as a row**. The pin asserts **three**
   things where it once asserted one: the absolute reach, **the MEDIAN changed body moves less
   than half a frontage**, and **fewer than 12% of the fabric changes at all.** Measured:
   **967 parcels byte-identical, 44 changed, centre movement p50 0.39 · p90 2.30 · max 4.38
   units.** ⭐ *A town where every body drifted just under the old cap passed the old pin and
   fails this one.*
8. **THE ONE-DECIDER RULE.** Where the landed model asserts a fact (`meta.hasWalls`), the fabric
   does not overrule it. Refusing a circuit the model asserts would break the rule this program
   is built on (J-A2-4).
9. ⭐⭐ **ONE PREDICATE, ONE HOME — AND A CHECK THAT FAILS WHEN TWO MODULES ASK THE SAME
   GEOMETRIC QUESTION DIFFERENTLY.** §238 gave *one artifact, one accessor, one proven
   predicate*; §241.5a moved handle enforcement to the **publication point** rather than a
   read-site scan. **This extends both, and it is the fourth recurrence of the class that has
   already cost two waves:** a geometric question gets **one exported predicate**, consumers may
   not re-spell it, and the guard sits where the predicate is *published*. ⛔ **A cured predicate
   with a private second spelling in a sibling module is indistinguishable from an uncured one at
   the census** — measured cost, today: **72% of street-over-water violations unexemptable by
   construction** (§4.1a). ⚠ **And its cheapest instance is an idiom: `a || b` is "a, AND b IS
   DEAD CODE" whenever `a` is reliably truthy — a fallback that never falls back.**

### §3.4 · THE STANDING CRITIQUE — twelve priors NOT to emulate (ATLAS §2.4 + PLAN §10.6)

**These are model priors and generator defects found IN the corpus. They are not laws to
follow, and several have already bitten us.**

1. **Concentric / polygonal town shape on flat ground** — planned geometry needs a planning
   authority in the facts.
2. **Radial sunburst field parcels** — orientation *toward* the village is law; terrain-blind
   symmetry is banned (§16.2).
3. **Default river bisection** — the corpus itself refutes it: THROUGH is only 12%.
4. **Empty blocks / block-wash LOD** — block outlines with no fabric inside. ⚠ **The op budget
   will tempt us into exactly this**, and it destroys the study layer at glance range. *(This is
   why the LOD mass's `unitLines` are load-bearing, not decoration: a lane that drops them
   hollows the fabric.)*
5. **Oblique / pictorial projection on the plan leaf** — the Plan is the flagship.
6. **Machine-perfect regularity in planned quarters** — **regularity is a DIAL, never a
   lattice.** Add ±10–20% jitter, and φ's 0.8 ceiling enforces it. ⭐ *And `plannedOccupancy`
   removes this defect by CONSTRUCTION rather than by jitter.*
7. ⭐⭐ **EVEN SPACING OF REPEATED ELEMENTS — towers, crenellations, contour hachures, tent rows,
   tree ticks. THE STRONGEST "GENERATED" TELL IN THE CORPUS.** Every repeated element needs
   seeded spacing variance. (§214 bans it by name; hf36's *irregularly* spaced hedgerow trees are
   the counter-example.)
8. **Thinning the whole ink hierarchy to express a state.** ⭐ **State marks must be ADDED
   GEOMETRY IN THE SAME INK FAMILY. Famine is drawn by subtracting ACCENTS, never by lightening
   the fabric** — hf57 measures ink L 37.9, **FULL INK**, and is the corpus's own counter-example.
9. **Uniform grain across a whole settlement** — *real settlements always have a rich street and
   a poor one.* **Grain variance WITHIN a settlement is as important as grain level.**
10. **Symmetric two-bank development on a THROUGH river** — one bank always builds first.
11. **Clean wealth boundaries** — reality gradates over **2–3 blocks**; §5.0d's parcel dithering
    is the correct mechanism and the corpus **under-uses** it. ⭐ *Here we would beat the
    reference outright.*
12. **Corrupt / decorative lettering** — **our labels are TRUE. This is a competitive win, not a
    style to copy.**

**PLUS THREE PLAN-LEVEL ADDITIONS (PLAN §10.6):** the **polygon circuit with evenly-beaded
towers** (a *plan* defect, not a decoration one — it deformed at least eleven plates and survived
three corpus rounds) · **the radial-wheel prior in new habitats** (it re-appeared underground and
in an industrial layout after being suppressed in town plans — ⭐ **NEVER ARRANGE A FEATURE CLASS
"AROUND" A POINT**; galleries must chase something — a seam, a street, a water table — never
radiate) · **bilateral symmetry in compositions** (symmetry is as strong a generated tell in plan
as even spacing is in ornament).

### §3.5 · ⭐ ANOMALY IS A COLLISION, NOT A JITTER BUDGET (PLAN §9)

**The brief asked what generative mechanism produces a memorable anomaly without randomness. The
corpus's answer: EVERY GOOD ANOMALY IS A COLLISION BETWEEN TWO RULE SYSTEMS — never a
perturbation.** The camp grid that frays at exactly two gates (a planned epoch's edge meeting an
organic epoch's growth pressure at the points of highest traffic) · a rigid grid at a frank angle
to the old town with a burnt zone between them (a replanning event bounded by a fire's *actual*
footprint) · a curving green ribbon of long thin gardens through solid fabric (a filled ditch —
a defensive form surviving into a horticultural land use) · **two of everything** (two
jurisdictions sharing one crossing) · a market place inside a roofless basilica · a wall around
fields (high-water extent meeting a shrunken population) · a market place larger than the town
needs (planned capacity meeting actual population).

⭐⭐ **NONE OF THESE NEEDS A RANDOM NUMBER. Every one is deterministic given two facts already in
a dossier.**

**THE MECHANISM: let rule systems COLLIDE WITHOUT ARBITRATION** — (i) allow two organisms of the
same type to coexist when the facts support two; (ii) let an epoch boundary sit where a
**historical event's footprint** was, rather than on a tidy offset; (iii) **refuse to smooth the
seam where two bearing bases meet.**

⚠ **AND THE ONE MISSING INPUT IS NAMED AND OWNER-GATED: EVENTS DO NOT CARRY A SPATIAL FOOTPRINT.**
A fire, a sack, a flood or a landslide is a fact *about* a settlement, not a shape *on* it — yet
five plates derive their entire character from the **shape** of what happened to them.
`eventFootprint` — a derived, deterministic region seeded from the event's own identity plus
terrain, stable under the inertia law — is the mechanism that would let one dossier fact ("the
town burned in year 214") produce an entire composition. ⛔ **It touches the event/persistence
surface, which is owner-gated. PLAN flagged it and did not design it, and this specification does
the same.** See gap **G-11** and Appendix B.

---

## §4 · THE GAP LEDGER, RANKED BY LEVERAGE

**Every MISSING or PARTIAL mechanism from all three studies, the FMG cross-check and the four
build receipts, in one ordered list.** `G-n` is a **stable identifier, not a rank** — the RANK
column carries the ordering, so a row can be re-ranked without renumbering the program.

**Ranking basis:** (breadth — how many stages, traces and plates it touches) × (how many other
mechanisms unblock behind it) × (cheapness). Where two studies ranked the same item differently,
both ranks are quoted in the row.

⚠ **A ROW'S RANK IS NOT ITS WAVE.** Dependencies re-order the build; §5 does that. A high-rank
item that is BLOCKED lands after the thing it is blocked on, however valuable it is.

### §4.1 · THE LEDGER

| rank | id | mechanism | derivation home (the dossier fact that drives it) | blast radius | depends on / blocks |
|---|---|---|---|---|---|
| **1** | **G-2** | ⛔ **TERRAIN SUBSTRATE** — a relief FIELD with gradient, aspect, land-form class and a `buildable` refusal mask, replacing the `RELIEF 0.30` scalar | seed + `config.terrainType` + `resources` + water facts (§161a) | **CONTEXT ranks it #1: 6 of 8 traces.** Unblocks CX-02, CX-03, CX-04, CX-19, CX-21 and **2 of the 9 wall-run types** | ⛔ **BLOCKS §214's TERRAIN ARM (§251.4a) · blocks G-4 · blocks the slope grammars · aspect arm is NOT-DERIVABLE (Appendix A)** |
| **2** | **G-7** | ⛔ **FRONTAGE-FIRST GENERATION + the plot-series rhythm, corner plot and amalgamation event** | block face from the street graph; module width from `tier` × `districtWealth`; amalgamation from `epoch age` + **prosperity TRAJECTORY**; corner from `institutions` needing frontage | ⭐ **PLAN's #1 and ATLAS's SCOPE-1, reached independently on disjoint evidence (§250.6d).** 7 of 8 PLAN traces; most settlement plates at town+ and many below | needs S8's block faces. **Unlocks the block silhouette, the backland core, court frequency and district legibility as side effects** |
| **3** | **G-34** | ⛔⛔ **ONE PREDICATE, ONE HOME — AND A CHECK THAT FAILS WHEN TWO MODULES ASK THE SAME GEOMETRIC QUESTION DIFFERENTLY.** Unify `deriveBridges`' crossing predicate with §205A's cured one; rule on `rank === 'passage'`; replace first-crossing-per-channel with `covered === inside` | none — it is an enforcement mechanism, not a derivation | ⛔ **92 of 127 street-over-water violations (72%) CANNOT BE EXEMPTED BY CONSTRUCTION.** Unblocks most of G-28's §205A residual | ⭐ **THE §238 PREDICATE CLASS RECURRING FOR THE FOURTH TIME, AND ITS SHAPE IS NEW — see §4.1a.** Cheap; needs a **ruling** more than a lane |
| **4** | **G-3** | ⛔ **THE CIRCUIT AS A CHAIN OF TYPED RUNS (nine types, each with a cause)** + per-run tower policy | substrate + `institutions` + §240 epoch index + fabric extent + `history` fortification events | **CONTEXT #2: every walled trace (4/8).** Unblocks CX-14, CX-16, CX-18, CX-19, CX-20 | ⛔⛔ **§251.4b RULED: §240 AND THE RUN CHAIN ARE ONE PIECE OF WORK AND LAND TOGETHER.** Three rings without run typing come out CONCENTRIC. Blocks §252.3a's metropolis third circuit |
| **5** | **G-8** | ⛔ **`circuitDemotion` — THE FOSSIL LADDER.** wall→ring street · gate→widening + frontage break · tower→circular building · ditch→garden band · intervallum→carriageway | §240 epoch index + land pressure (population growth between epochs) + `prosperity` | ⭐ **PLAN's #3 and CONTEXT's #9, found independently.** Every plate with >1 circuit (~10% of walled) plus every demotion plate | ⛔⛔ **§250.5 URGENT: §240 makes multi-circuit imminent and NOTHING says what happens to the superseded ring. WITHOUT THIS, EVERY NEW RING ERASES THE HISTORY THE EPOCH MODEL WAS ADOPTED TO EXPRESS** |
| **6** | **G-9** | ⛔ **THE EPOCH DIALS** — per-epoch **grain**, **φ + bearing basis**, **attachment mode**, and `plannedOccupancy` (surveyed-not-built) | `foundingKind` × epoch × `lawfulness` × event history; occupancy from years-since-founding × `prosperity` | **PLAN's #2: 5 of 8 traces; every multi-vintage plate** | needs S5 (BUILT). ⭐ **Without these the epoch axis is structurally correct and VISUALLY INERT.** Numbers ready in §1.1's table |
| **7** | **G-13** | ⛔ **INSTITUTION SITING AS A RELATIONAL SYSTEM** — per-class siting profiles with **PROHIBITED** adjacencies; `spawnsQuarter` micro-districts; custodian dwellings; the `jurisdictional` doubling flag | `institutions` + `government` + `factions` + `culture` + the void hierarchy + the circuit | **CONTEXT #5: 6 of 8 traces.** Unblocks CX-23, CX-27, CX-28, CX-29, CX-45 | ⭐ **The NEGATIVE rules are the cheap half and carry most of the realism** — four predicates prevent most naive-placer errors. The doubling flag needs **no new geometry** |
| **8** | **G-10** | ⛔ **JUNCTION-MIX DISCIPLINE** — attachment-not-intersection generation, `junctionMix` bands, φ as a metric with its 0.8 ceiling and a read-back census | founding kind × lawfulness × **epoch** (the X budget is epoch-scoped) | **PLAN #4: ALL 8 traces, ALL plates.** | ⛔ **A generator meeting §201 and §202 perfectly can still emit an all-X lattice, and an all-X lattice reads as generated at a glance.** Cheap to census |
| **9** | **G-14** | ⛔ **WATER AS A SYSTEM** — the ROLE axis (EDGE/SPINE/OBSTACLE), a **directed** centreline, flow-ordered chains, the domestic-water ladder, the dirt vector (clean take above + plume below + muck gate) | ⭐ **`supplyChains` — a first-class dossier field that is spatially UNUSED today** + river class + `institutions` + `resources` | **CONTEXT #6: 5 of 8 traces.** Unblocks CX-08…CX-11, CX-16 | ⚠ **ATLAS GAP-F alone is decoration — plume + upstream take is an ARGUMENT.** Build it whole |
| **10** | **G-15** | ⛔ **THE COUNTRYSIDE** — T-24's six ground primitives, T-23's five road rungs, dispersal-vs-nucleation (CX-26), road furniture and the day's-travel rule (CX-25), process ground (CX-37), ground surface as a layer (CX-39) | `terrain` + `resources` + `institutions` + `neighbors` (distances) + §16 + §190c | ⭐ **85%+ of a village or thorp plate**, and **§229.2c's NAMED LEVER for the census tiers' remaining grain miss.** §252.3c: still the weakest surface | **⭐ T-23 and T-24 are ONE item, not two.** `neighbors` already holds the day's-travel distances — **road furniture is nearly free** |
| **11** | **G-16** | ⛔ **THE PAINTED CLOSURE** — wash mis-registration, within-fill variation, path waver, per-stroke modulation, paper grain | none (a render mechanic) — but the **bands** come from the strongest cohort | **Every leaf, every lens.** b6 measures **0.00** on the two the eye reads first | ⭐ **Wash mis-registration is the ONE property that, if omitted, keeps the output reading as vector art no matter what else is done.** MF-A1's brief. ⚠ Must be **geometry or a tiled pattern**, never a raster filter |
| **12** | **G-12** | ⛔ **WEALTH MUST DRIVE GEOMETRY, NOT ONLY TONE** — grain, backland extinction and dead-end rate per district | `wardWealth` / `prosperity` × population pressure × epoch age × district type | **PLAN #5: 3 of 8 traces; every stratified settlement** | measured: poor half **38% more dead ends**; green share **0.000 vs 0.0056**; ⭐ *today wealth drives TONE, not GEOMETRY* |
| **13** | **G-6** | ⛔ **FOOTPRINT GRAMMAR BY MATERIAL** (six grammars, each with its own packing rule, alley floor, party-wall behaviour and corner radius) + the water-scarcity reorganisation | `resources` × `terrainType` × `culture` — **all three exist** | **CONTEXT #4.** ⭐ **THE SETTING-AGNOSTIC PROMISE IS STRUCTURALLY UNMET, NOT COSMETICALLY (§251.3)** | ⚠ **A declared-shift event** — the mapping affects every footprint on every leaf. **Partly gated behind G-30's terrain vocabulary** |
| **14** | **G-18** | ⛔ **BLOCKS AS PLANAR FACES OF THE STREET GRAPH (§239.1)** + the three shape bands (elongation, solidity, area ratio) | none — **if the street graph is right, the blocks are right for free** | every leaf; the structural cause behind straddling districts and wall-band intrusions | needs G-10. ⭐ **The bands are also a DETECTOR: median-square high-solidity blocks convict a silent grow-then-clip** |
| **15** | **G-20** | ⛔ **THE WALL-SIDE STREET (§239.2) AS A PER-RUN DERIVATION** + §200's census exemption keyed to **RUN TYPE** | run type (G-3) + `prosperity` + era | every walled leaf | ⛔⛔ **§200's clearance census WILL RED ON CORRECT OUTPUT without the run-type exemption (§251.4b).** ⚠ A **global** ring road produces a band the corpus never draws |
| **16** | **G-17** | ⛔ **`intramuralVacancy` + the bearing-preserving dead-block handoff + the four-stage decay ladder + one shared `ghostInk`** | high-water vs current `population` (§161f) + the decline event + `terrain` + `institutions` (a brickfield needs clay) | every high-water and demotion plate | ⭐ **§239.4 already RECORDS the dividend and nothing generates what fills the ground.** Signal 5 is *nearly free* and the eye reads "this was a town" immediately |
| **17** | **G-21** | ⛔ **STREET WIDTH FROM GRAPH LOAD** (betweenness over gates, market, quays, institutions) — the class ladder becomes the **quantiser**, not the source | `tradeRouteAccess` + the neighbour link + `institutions` + `tier` (class count) + `population` (absolute width) | every leaf; T-04's hierarchy depth | needs **G-1** for the gate weights. ⭐ **PRIOR-ART supplies the blueprint (reuse discount) and CONVERGES with §250.6c** |
| **18** | **G-19** | ⛔ **`backlandCore` as an explicit derived object per block** + court classification (T-06) | `districtWealth` × population pressure × epoch age × district type | every block at town+ | ⭐ **This is what makes §201's alley register and §204's rarity ruling COHERENT — a court becomes "a backland core that failed to get a mouth"** rather than a separately-invented feature. **The band is already ruled: route-isolated 3–15%** |
| **19** | **G-4** | ⛔ **THE BEARING TO WATER** — the direction of open water, not merely its presence | ⭐ **the S2 substrate's own geometry (§161a) — DERIVED, never minted** | every coastal and bankside leaf: district anchoring, the water-termination run, the second-bank rule, edge kind per bearing | **BLOCKED on G-2**, then it is **one vector**. ⚠ **Must never be conflated with wind/sun bearings, which are NOT derivable and stay in Appendix A** |
| **20** | **G-23** | ⛔ **THE EXTRAMURAL ORDERING** — unequal ribbon length per road, gate ranking for growth allocation, distance-ladder bands 4 (charity/contagion) and 5 (gallows), the **single-arc** noxious constraint | approach-road ranks (G-1) + circuit runs (G-3) + `institutions` + `population` growth rate | **CONTEXT #8:** 4 of 8 traces | ⭐ **One table keyed off the institution list.** ⚠ Equal-length ribbons at every gate read as generated |
| **21** | **G-22** | ⛔ **CENTRE TYPOLOGY (six kinds) + `secondAuthority ⇒ secondCentre` + market placement by arrival mode** | `institutions` + `powerStructure` (§161l) + `foundingKind` + event history | **CONTEXT #7 (markets); PLAN #9.** Multiplies voids; the strongest single "this is a working place" signal | ⭐ **We appear to have ONE square primitive against the corpus's six structurally distinct types** |
| **22** | **G-24** | ⛔ **THE DISTRICT-LEGIBILITY CENSUS (GAP-H)** — render label-free and assert neighbour deltas | none (a census) | ⭐ **the acceptance test §8.4's glance layer actually needs** | band supplied by PLAN: **≥1.4× median block area OR ≥1.3× cells-across**. Needs G-9 and G-12 to have something to measure |
| **23** | **G-11** | ⛔ **`eventFootprint`** — a derived, deterministic spatial region for spatially-extended events | the event's own identity + terrain (stable under the inertia law) | **PLAN #6:** 3 of 8 traces; every stressor and aftermath plate | ⛔ **OWNER-GATED ADJACENCY — touches the event/persistence surface. PROPOSED, NOT ACTED ON.** ⭐ It is the mechanism behind most of the corpus's memorable anomalies |
| **24** | **G-25** | ⚠ **THE LANDMARK BUDGET (T-16)** — fewer, bigger — **plus the state-responsive prominence rung (GAP-G)** | `institutions` + `tier` × `population` (§161n) + the active stressor's relief function | every leaf's glance layer | measured: b6 draws **11/18/26 monumentals** against a legible budget of **3–7 / 4–9 / 9+**, at ~2:1 footprint ratio against **5–12:1** |
| **25** | **G-5** | ⚠ **A DERIVATION HOME FOR POPULATION→EXTENT** | ⭐ **our own leaves, whose populations are FACTS** — 16 per tier, byte-deterministic, with published extents | §161f's high-water law; §5's tier table; the frontage ladder's town→city residual | ⛔ **UNRESTORABLE from the corpus (§249.4c).** External cross-check in §1.2c supports the SHAPE, **not the constant.** ⚠ **Touches the §5 tier table — B8 named it a chair question and did not take it** |
| **26** | **G-26** | ⚠ **CHROME RUNG (GAP-I) + the annotation-layer contract (T-26) + §161i's TRUE MEASURE** | `tier` × `prosperity` | the margins of every leaf | ⭐ trivial, and it makes the tier read even in the margins. ⚠ **§161i's true measure is NON-DEFERRABLE** |
| **27** | **G-27** | ⛔ **THE UNDERGROUND STRATUM (§13/§168)** — unbuilt, **twice deferred**, first-class in wave nine | `institutions` + the surface fabric | its own leaf family | ⭐ **`accessLaw.js` is ALREADY stratum-agnostic**, which is what makes it cheap. ⚠ **The ring prior re-appears in new habitats — galleries must CHASE something, never radiate** |
| **28** | **G-28** | ⚠ **THE RESIDUAL AND CARRIED-DEFECT SET** — see §4.2 | — | small individually, visible collectively | several are **owner-gated** |
| **29** | **G-29** | ⚠ **SPATIAL INDEXING + PER-CENSUS RUNTIME BUDGETS + indexed-vs-exhaustive equivalence pins** | none (infrastructure) | the census family's scalability; §220's performance gate | ⭐ **Handed off WHOLE with cause** (`laneMFARCH2-receipt.md` §9.1). ⚠ **A completeness status where "skipped due to scale" can NEVER read green.** §220 is **launch-blocking** (§247.3a) |
| **30** | **G-31** | ⛔ **RELOCATION AND SUPERSESSION OF POINT FEATURES** — moved settlements, stranded quays, superseded fords and markets | a relocation event + the terrain feature that failed | 2 traces; a striking and fully-derivable state | *lower priority than the epoch items and correctly last-but-one* |
| **31** | **G-32** | ⛔ **SEASONAL / CONDITIONAL SECOND NETWORKS** | `terrain` + water mode + the lens | ⭐ **makes the winter/wet lenses STRUCTURAL rather than a recolour** | none |
| **32** | **G-30** | ⛔ **TERRAIN VOCABULARY WIDTH** — 7 tokens against ~20 structurally distinct settings | ⭐ **itself — this IS a dossier fact** | ⛔ **the single upstream blocker for the whole morphotype program; everything in CONTEXT §7 is stalled behind it** | ⛔⛔ **OWNER-GATED (persistence shape). §251.5 raised it, NOT decided.** Lane recommends **composite `terrainModifiers`** over widening the enum, because the enum is what the gallery facets and the server RPC filter on. **Chair concurs with the shape; it is the owner's call.** |
| **—** | **G-33** | ⚠ **HOUSEKEEPING FROM THE CONFLICT SET** — re-pin `GRAIN_BAND`'s metropolis rung to 80–120 and re-derive `GRAIN_SEAMS` (**C-2**); label the thorp/hamlet rungs UNMEASURED (**C-3**); target paper warmth 37 (**C-1**) | — | one table, one constant, one colour | ⚠ **All three move output and must be DECLARED, never quiet.** Blocks nothing; **do it in the same wave as any grain work so one declaration covers it** |

### §4.1a · ⭐⭐ G-34 — A CURE THAT NEVER CROSSED A MODULE BOUNDARY

**This is the §238 predicate class recurring for the FOURTH time, and it is worth its own
sub-section because its shape is new and a builder will otherwise re-create it.**

**The first three recurrences were BLIND predicates** — a rule asking the wrong question
(vertices against a centreline; `rooted` counting dry corners; a comment saying AREA over code
counting corners). **This one is different: the predicate was CURED, correctly, and the cure
STOPPED AT A MODULE BOUNDARY while a sibling module kept asking the old question.**

**MEASURED (`laneMFW1-receipt.md` §6.1), and the arithmetic is the argument:**

| the mismatch | violations it makes permanently unexemptable |
|---|---|
| `deriveBridges` asks **`crossPoint`** (a true centreline intersection) while the cured §205A census asks **`segSegClosest < half`** (a band incursion) — ⭐ **MF-ARCH's segment-true cure never crossed the module boundary** | **72** |
| `deriveBridges` refuses `rank === 'passage'` while §205A **convicts** passages | **20** |
| `deriveBridges` takes the **FIRST** crossing per channel and `break`s, while the census demands `covered === inside` | **35** |
| **total** | ⛔ **92 of 127 street-over-water violations — 72% — cannot be exempted BY CONSTRUCTION** |

⚠⚠ **THE CURE IS NOT TO CONVICT LESS.** It is to **decide whether a band incursion without a
centreline crossing is a crossing at all, and to say so IN ONE PLACE.** All three arms are the
same question — *which crossings the law intends to forgive* — and they must be ruled together.

⭐⭐⭐ **THE STRUCTURAL REQUIREMENT THIS SPEC ADOPTS, AND IT IS THE ENFORCEMENT ANALOGUE OF
§253/§241.5a's RAW-HANDLE GUARD: ONE PREDICATE, ONE HOME, AND A CHECK THAT FAILS WHEN TWO MODULES
ASK THE SAME GEOMETRIC QUESTION DIFFERENTLY.** §238 established *one artifact, one accessor, one
proven predicate*; §241.5a moved handle enforcement from a read-site scan to the **publication
point** because a scan must solve aliasing and a publication guard need not. **The same move
applies here:** a geometric question gets **one exported predicate**, its consumers may not
re-spell it, and the guard sits where the predicate is *published* rather than where it is read.
**A cured predicate with a private second spelling in a sibling module is indistinguishable from
an uncured one at the census.**

⚠ **AND ONE MORE INSTANCE OF THE SAME FAMILY, ALREADY PROVED AND COSTED (`laneMFW1-receipt.md`
§5), belongs in the same ruling:** `leafCensus.js`'s marine exemption tests
`String(lm.archetype || lm.anchorKey || '')`, and **every landmark has an archetype**, so
`anchorKey` is **dead code** and the regex's own word `mill` can never fire — *a bank-rooted
watermill standing on its own river is convicted as an unlawful structure.* ⭐ **THE CLASS:
`a || b` READS AS "a, FALLING BACK TO b" AND IS IN FACT "a, AND b IS DEAD CODE" WHENEVER `a` IS
RELIABLY TRUTHY. A FALLBACK THAT NEVER FALLS BACK IS A BLIND PREDICATE WITH AN IDIOM INSTEAD OF A
COMMENT.** The narrowest cure is proved: **exempt +6, violations 165 → 159, subject set
unchanged, and the run-1 parchment SHAs BYTE-IDENTICAL on town/city/highwater/fjord — not one
pixel moves.** ⛔ **Deliberately not landed (J-W1-2): it widens a census exemption under the
§234 feature-law freeze and it moves a published figure. It needs a ruling, not a lane.**

⚠ **A THIRD ARM RIDES THE SAME RULING: the §205A street arm was designed for a RIVER and is
applied to a COAST.** A shore-parallel road scores **775 "crossings" on `city` and 555 on
`fjord`** — so **the coastal leaves dominate the corpus street total and the figure is not
comparable across terrains.** ⭐ *This is the §205A analogue of the half-ring exemption
MF-ARCH-2 had to turn from a TOLERANCE into a RULE.*

### §4.2 · G-28 · THE RESIDUAL AND CARRIED-DEFECT SET, ITEMISED

Small individually. **Collectively they are what a reader sees.**

| item | measured | source | disposition |
|---|---|---|---|
| ✅ **`waterViolations` 114 → 165 — CHARACTERIZED, CLOSED** | **+47 the meander re-roll (cause 101), −13 the epoch/wall work (causes 97–100).** 92% sample / 8% architecture, architecture pointing the RIGHT way | `laneMFW1-receipt.md` §0, §2 | ⭐ **NO CURE OWED.** MF-ARCH-2's guessed cause was **refuted by execution** — `year-018` has no circuit and moved by the same +10 with a byte-identical key set. §252.3b discharged. **Publish per §0.3a's authoritative set** |
| ⛔ **MF-ARCH-2's 32 plates are unviewed** | 10 walled leaves' walls changed shape; the ditch changed ring | `laneMFARCH2-receipt.md` §9.8 | ⭐⭐⭐ **WAVE NINE'S FIRST ACT.** Judge: does the epoch-derived old core read as an OLDER town rather than a smaller copy; does the outer ring at 0.899 leave a suburb that reads as a suburb; does the ditch on the working circuit read right |
| ⛔ **clipped-institution SPIKE** | a large body reduced by the ground law's clip to a long dark triangle attached to nothing | `laneMFB8-receipt.md` §14; §229.2d | **NEW at b8, confirmed real by chair zoom.** Cure: a shape-aware clip **or** a demotion rung for institutions |
| ⛔ **block front lines over empty ground** | a thinned rank still emits its full front and back lines | `laneMFB8-receipt.md` §14 | ⭐ **G-7's frontage-as-an-object cannot do this** |
| ⚠ **isolated plots carry full-length tofts** | a single fringe holding draws a 4.2:1 toft into open country | `laneMFB8-receipt.md` §14 | reads as *a fence to nowhere* |
| ⚠ **parallel building bars read MECHANICALLY** | plot-width or depth variance too low | §252.3c, chair zoom at 3000px | ATLAS banned prior #7's neighbourhood — **G-7's run-length structure is the cure** |
| ⛔ **§205A's residual, now 165 and DECOMPOSED** | ⭐ **92 of 127 street violations (72%) are unexemptable BY CONSTRUCTION** (72 predicate mismatch · 20 `passage` refusal · 35 first-crossing-only); **6 more are the dead-`anchorKey` mill**; the older classes stand — quay streets running ALONG the shore inside the claim, and non-marine institutions touching the coastal claim | `laneMFW1-receipt.md` §5, §6; `laneMFB8-receipt.md` §6 | ⭐⭐ **PROMOTED OUT OF THIS SET INTO G-34** — it is one ruling, not five patches |
| ⚠ **`zoneClickCoverage` town 0.50** | half a town's fabric belongs to a quarter whose click region does not cover it | `laneMFB8-receipt.md` §5 | ⛔ **OWNER-GATED** — the cure changes a landed one-element-per-district-id contract five UI suites hit-test |
| ⚠ **the faubourg district-id change** | `${parent}~faubourg` + `wallSide`/`parentDistrictId` | §238.4b | ⛔ **OWNER-GATED and PARKED** — it rides the landing's owner review with the §232 law it serves |
| ⚠ **T-05's fill bands ungraded** | a measurement mismatch, not sixteen leaves of failure | `laneMFB8-receipt.md` §5 | **CHAIR QUESTION Q-4** |
| ⚠ **metropolis grain 70 vs band 80–120** | ×1.14 from the floor | §244.5 | the named lever is **G-15** (the countryside) plus the grain re-pin (**G-33**) |
| ⚠ **the frontage ladder's town→city step** | 4.53 → 5.25 → 5.13 — 96% of the inversion closed, the residual is town→city | `laneMFB8-receipt.md` §1 | ⛔ **a §5 TIER-TABLE question, explicitly the chair's** — see **G-5** |
| ⚠ **`substrate.js`'s second salt spelling** | 4 sites, correct but duplicated | `laneMFARCH2-receipt.md` §4 | converting it moves every leaf **for no measured defect** — a duplicated-rule hazard, not a bug |
| ⚠ **the domain content hash is 4×32 bits** | `fabricRng.hash32`; the sha-256 tiers live in the harness | `laneMFARCH2-receipt.md` §9.6 | the staleness detector says in its own comment that it is not a security primitive |
| ⚠ **streets and water are not graph nodes; §205A's subject set is 92 bodies** | raw-handle exposure: **19** street reads, **58** water reads | `laneMFARCH-receipt.md` §7 | the publication-point guard (J-ARCH-6) is the pattern to extend |

### §4.3 · THE DEPENDENCY GRAPH, STATED AS EDGES

**Read these as hard edges. Every one is either an ODQ ruling or a physical impossibility.**

```
G-2 (substrate) ──BLOCKS──▶ §214's TERRAIN ARM            [§251.4a — ruled]
G-2 ──BLOCKS──▶ G-4 (water bearing) · CX-03 slope grammars · CX-02 refusal mask
G-1 (region)   ──BLOCKS──▶ CX-01 siting · CX-15 typed gates · CX-22 gate selection
                           · CX-25 road furniture · CX-32 toll avoidance · G-21 (load weights)
G-3 (run chain) ══BOUND TO══ §240 (epoch axis)            [§251.4b — "one piece of work"]
G-3 ──BLOCKS──▶ §252.3a's METROPOLIS THIRD CIRCUIT (the cap lifts WITH the run chain, then by measurement)
G-3 ──BLOCKS──▶ G-20 (§200's run-type exemption; without it a CORRECT wall-side street REDS the census)
G-8 (circuitDemotion) ──MUST NOT LAG──▶ multi-ring output  [§250.5 — otherwise every new ring ERASES history]
G-7 (frontage-first) ──UNLOCKS──▶ block silhouette · G-19 backland/courts · G-24 district legibility
G-10 (junction mix) ──PRECEDES──▶ G-18 (blocks are the planar faces of the graph)
G-9 (epoch dials)   ──NEEDS──▶ §240 (BUILT)  ──ELSE──▶ the epoch axis is VISUALLY INERT
G-30 (terrain vocabulary, OWNER-GATED) ──BLOCKS──▶ all of CONTEXT §7's morphotypes; PARTIALLY blocks G-6
G-11 (eventFootprint, OWNER-GATED) ──UNLOCKS──▶ the replanned-quarter anomaly class
G-29 (runtime budgets) ──SERVES──▶ §220 performance gate  [LAUNCH-BLOCKING per §247.3a]
G-34 (one predicate, one home) ──PRECEDES──▶ every wave that adds a census
                               ──UNBLOCKS──▶ 92 of 127 street-over-water violations (72%)
```

⭐⭐ **THE TWO EDGES THAT COST A WAVE IF THEY SURFACE LATE, AND BOTH ARE ALREADY RULED:**
**(1) §214's terrain arm against a scalar** — a lane will write hachure code that has nothing to
consume. **(2) §240 landing without the run chain** — *"landing §240 alone would ship the defect
and then pay a declared shift TWICE to remove it."*

---

## §5 · THE IMPLEMENTATION ORDER

**What this is.** The wave plan that falls out of §4.3's dependency edges. It is a
**decomposition of the existing wave-nine mandate**, not a new mandate: §229.3, §239.5, §240.4,
§250.2, §250.5 and §251.4 have all slotted work into "wave nine" independently, and the result is
overloaded and internally ordered by dependencies nobody had written down. **This orders it.**

**EVERY EXIT CRITERION BELOW IS A MEASUREMENT, NOT AN INTENTION.** A wave is done when the
numbers are in a receipt, executed after the final edit, with the counterfactual that must red
having redded.

⚠ **THE CONCURRENCY LAW BINDS: TWO LANES / ONE LANDING / ONE GATE / ONE WORKTREE.** Where a wave
below names a parallel track, it is a second *lane*, not a second landing.
⚠ **AND EVERY WAVE FROM W1 ON CHANGES GEOMETRY, SO EVERY ONE RIDES A DECLARED ONE-TIME SHIFT
(§110.3), NEVER A SILENT REDRAW.** Attribute causes by the three-stage method MF-ARCH-2 used —
*land the behaviour-neutral half first, measure, then the geometry half, measure* — because that
is what makes a declared shift auditable.

---

### W0 · THE VERIFICATION DEBT — before any new build

**Cheap, blocks nothing, and it must precede the first line of new code.** Two of these are
outstanding obligations from the last two waves and one is housekeeping the conflict set found.

| item | what |
|---|---|
| **LOOK AT THE PLATES** | 32 plates in `mf-proto-out/arch2/`, unviewed. Ten walled leaves' walls changed shape; the ditch changed ring |
| ✅ ~~characterize `waterViolations`~~ | **DONE — lane MF-W1. §252.3b is discharged**; publish per §0.3a's authoritative set, as ONE movement with TWO named halves |
| ⭐ **G-34 THE EXEMPTION RULING** | rule the three §205A structural gaps **together** (they are one question), plus the dead-`anchorKey` mill and the coast-vs-river street arm. ⚠ **It needs a RULING more than a lane** — the cure is proved, costed and pixel-free |
| **G-33 the stale figures** | metropolis `GRAIN_BAND` → 80–120 with `GRAIN_SEAMS` re-derived (C-2); thorp/hamlet rungs labelled UNMEASURED (C-3); paper warmth → 37 (C-1) |
| ⭐ **THE DISTINCT-SITE TOTAL** | one line in the harness: publish the **10-world** total beside every 16-leaf total (§0.3b) |

**EXIT CRITERIA (measurements):**
1. **32 of 32 plates viewed, each with a written verdict**, and the three named judgments
   answered in prose: *does the epoch-derived old core read as an OLDER town rather than a
   smaller copy · does the outer ring at 0.899 of the city's extent leave a suburb that reads as
   a suburb · does the ditch on the working circuit read right.* ⚠ **Never a verdict row without
   a rendered image seen** (§231.2), and the three-number reconciliation (files / previews /
   ledger) is mandatory.
2. ✅ **ALREADY MET: `waterViolations` = 165 decomposed with counts summing to 165 and the
   direction explained** (`laneMFW1-receipt.md` §2). **The remaining obligation is publication
   discipline, not measurement:** the landing quotes §0.3a's set and states the movement as **two
   named halves**, never as `100 → 165`.
3. **G-34 ruled in ONE place**, with the resulting predicate exported from one home and a check
   that reds when a second module re-spells it. **Measurement: the unexemptable share falls from
   72% of street violations to a stated number, and the rule that forgives is written down.**
   ⚠ *The cure is not to convict less.*
4. **The harness publishes a distinct-site (10-world) total beside every 16-leaf total**, and no
   figure in the wave's receipt is quoted corpus-wide without it.
5. **The grain sweep re-run after the re-pin: ≥11,765 populations, ZERO decreases, every tier
   seam continuous to 2 d.p.** — the same proof that made the original derivation safe.
6. **Suite green, determinism 10/10, all four drawn censuses 0, 96/96 under ceiling** — the
   standing floor, re-quoted at the tip. ⭐ **And the mill cure, if ruled in, must re-quote the
   run-1 parchment SHAs as BYTE-IDENTICAL — it was proved pixel-free and that proof is the
   receipt.**

---

### W1 · THE SUBSTRATE — the biggest unblocker in the program (G-2, G-4)

**Build the relief field, the land-form classification and the `buildable` refusal mask; derive
the water bearing from it.** Nothing else in this wave.

⭐ **Why first:** it is the only item that unblocks another *ruled* law (§214's terrain arm), and
six of CONTEXT's eight traces are hit by its absence. Everything terrain-shaped — the slope
grammars, the refusal mask, two of the nine wall-run types, the hachure vocabulary, the terrace
grammar, the wedge block — is stalled behind it.

**EXIT CRITERIA (measurements):**
1. **Every leaf publishes a relief field, not a scalar**, and the substrate-vs-facts consistency
   pin is green **over every §161a input** (ore → workable slopes + spoil ground; fisheries →
   shore + shoal; timber → standing forest; quarry → exposed stone) — **not `terrainType`
   alone**, with a counterfactual that plants an inconsistent resource and reds.
2. **Zero drawn bodies on `buildable == false`,** censused per leaf, with a planted violation
   that reds.
3. **`waterBearing` present on every water-bearing leaf and traceable to substrate geometry** —
   with a pin asserting it is **derived, not stored**: perturb the substrate seed and the bearing
   must move; hold it and the bearing must be byte-identical.
4. **The fjord leaf shows a fjord and the mountain leaf shows relief, judged by eye at 3000 px**
   — §9.5b's acceptance test in its own words: **terrain drama invisible = acceptance FAIL.**
5. Determinism 10/10; ceilings 96/96; the substrate adds no cycle (SCC 0 non-trivial at both
   granularities).

---

### W2 · THE WALL, WHOLE — because it cannot be landed in pieces (G-3, G-20, G-8, §214's wall arm)

⛔⛔ **THIS WAVE IS DEFINED BY TWO RULINGS, NOT BY CONVENIENCE. §251.4b: §240 and the run chain
are ONE piece of work. §250.5: without `circuitDemotion`, every new ring ERASES the history the
epoch model was adopted to express.** Landing any of these three alone ships a defect and pays a
declared shift twice.

**Contents:** the nine run types with their causes and per-run parameters · the per-run tower
policy (`none` on terrain-surrender and water runs; `clustered` facing approach; `sparse`
elsewhere; **seeded-irregular** positions; tower as a **TYPE**) · the wall-side street as a
**per-run** derivation · **§200's clearance census re-keyed to exempt by RUN TYPE** ·
`circuitDemotion`'s five-rung fate ladder and its transformation table · §214's wall/iconography
arm (masonry band, gatehouses as structures, palisade tick-rows, ditch grammar).

**EXIT CRITERIA (measurements):**
1. **Every circuit is an enumerated chain: `N ≥ 3` runs on every walled leaf, each carrying a
   `runType` from the closed set of nine and a cited cause.** Zero runs with cause `null`.
2. **Concentricity is refuted by measurement, not by eye**: on every multi-ring leaf the rings'
   normalized radius profiles differ (the pin that already exists, extended to *all* rings), and
   **no two rings share a bay-and-lobe signature.**
3. **Flank grammar lands in the corpus's frequency band**: across the walled corpus, full closed
   ring **≈55% ± a stated tolerance**, not 100%; ≥1 leaf terminating at water; ≥1 leaf with a
   terrain-surrender run carrying **zero towers**.
4. **§200 reads 0 with the run-type exemption in place AND the exemption is non-vacuous** — a
   counterfactual that removes the exemption must red on the wall-side-street runs, proving the
   exemption is doing work rather than hiding a defect.
5. **Every superseded circuit emits geometry into the current fabric**: ≥1 ring street whose
   trace matches the superseded circuit within the topology quantum, plus ≥1 of {tower dwelling,
   ditch garden band, gate widening} per demoted circuit. **Zero superseded circuits that emit
   nothing.**
6. **Containment residual stays 0 on every ring**; epoch members outside their own circuit stay
   **0**; §232 straddlers stay **0**.
7. **Chair eyes-on at 3000 px on a two-ring leaf**, judging one question: *can a reader see that
   this town had an older wall?*

⚠ **AND THE METROPOLIS'S THIRD CIRCUIT IS THE MEASURED PRIZE OF THIS WAVE.** §252.3a: the cap
lifts **with** the run chain, then **by measurement under §217** — so the wave's own receipt owes
the op-ceiling arithmetic for a third circuit with its towers, gates and ditch against the 83
primitives of measured headroom, and an owner ruling if it does not fit.

---

### W3 · THE FABRIC ORDER — the highest visual return per unit of new input (G-10, G-18, G-7, G-19)

**Nothing in this wave needs a new dossier field or a new substrate. It is a reordering of the
pipeline we already have, and it is where the plate starts reading like the corpus.**

**Contents:** attachment-not-intersection street generation with the `junctionMix` bands and φ as
a metric with its ceiling · blocks as the **planar faces** of the street graph (§239.1) with the
three shape bands · **the frontage line as a first-class object per block face** · the plot
series' clumped run-length rhythm, amalgamation/subdivision event and **corner plot** ·
`backlandCore` as a derived object, with courts classified against §209.4's band.

**EXIT CRITERIA (measurements):**
1. **`X:T ≤ 0.09` and `deg≥5 share ≤ 0.01` on every leaf**, with `γ ∈ [0.39, 0.52]` and mean
   degree in `[2.1, 2.7]`. **Counterfactual: a lattice fixture must red.**
2. **Block shape bands met per leaf**: elongation median **1.6–3.0**, solidity median
   **0.60–0.86**, area p90/p10 **≥ 6**. ⭐ *These convict a silent grow-then-clip, so they are the
   proof that §239.1 actually landed.*
3. **Frontage continuity measured per block face and banded**, with the b8 defect gone: **zero
   block front lines over ground carrying no buildings.**
4. **Plot-series rhythm measured as run-length structure, not variance**: adjacent-plot width
   correlation high **within** runs and broken **at** jumps, with a stated amalgamation rate that
   tracks `prosperity` direction. ⭐ **The pin must distinguish clumped from uniform-random —
   a variance band alone would pass the defect §252.3c's zoom found.**
5. **Corner plots exist and are distinguishable**: 1.4–2.0× module area, L-footprint where the
   block turns, and street-facing commercial institutions preferentially anchored there.
6. **Route-isolated courts land in 3–15% of blocks with a floor > 0 at town+**, and interior
   yards *with a mouth* are counted **separately** and land in 15–65%. ⚠ *They are different
   objects and one census may not merge them.*
7. **All four drawn censuses stay 0; §202 landlocked stays 0; determinism 10/10; 96/96 under
   ceiling.**
8. **Grain re-measured with fabric-derived windows** (`MFB8-plates.mjs`, never hand-set) —
   **town and city verdicts must STAND**, and village must move toward its band or the miss must
   be attributed.

---

### W4 · HISTORY IN THE FABRIC (G-9, G-12, G-17, G-24)

**The epoch axis is built and inert. This wave makes it visible.**

**Contents:** per-epoch **grain**, **φ + bearing basis** and **attachment mode** ·
`plannedOccupancy` with unfilled plots in the ghost register · wealth driving **geometry**
(grain, backland extinction, dead-end rate) · `intramuralVacancy` · the bearing-preserving
dead-block → field handoff · the four-stage decay ladder and one shared `ghostInk` · the
**label-free district-legibility census**.

**EXIT CRITERIA (measurements):**
1. **On every multi-epoch leaf, the newer epoch measures 1.8×–2.9× COARSER in grain than the
   older**, measured on sub-windows of the same leaf.
2. **A planned epoch measures φ in 0.318–0.652 and NEVER exceeds 0.8**; its organic sibling
   measures φ ≤ 0.15. **Counterfactual: a lattice epoch at φ 0.9 must red.**
3. **Dead-end share splits by wealth within one leaf**: poor districts 0.26–0.34, rich
   0.15–0.22, measured on the same settlement.
4. **The label-free census passes**: neighbouring characterised districts differ by **≥1.4× in
   median block area OR ≥1.3× in cells-across**, with a counterfactual that flattens one
   district's grain and reds.
5. **The high-water leaf draws intramural vacancy as DERIVED LAND USE**, not blank ground and not
   a generic wash: ≥2 distinct land uses inside the circuit and outside the fabric, each citing a
   `terrain` or `institutions` source.
6. **Dead blocks appear in the field layer ON THEIR OWN BEARINGS**, measurably misaligned with
   the surrounding countryside's field bearings — the six-signal demotion discriminator readable
   at glance range.
7. **The decay ladder draws four discrete stages, not one** (b6 draws 1 of 4).

---

### W5 · THE OUTSIDE (G-1, G-15, G-23, G-21, G-25)

⚠ **THE COUNTRYSIDE IS 85%+ OF A VILLAGE OR THORP PLATE AND IS THE PROGRAM'S WEAKEST SURFACE
(§229.2c, §252.3c). It is placed here rather than earlier only because W1–W4 change the fabric it
must meet at the junction band; a builder who can afford a second lane should run it in
parallel.**

**Contents:** the region as a derived object (neighbours at real distances, roads with ranks, one
water system, one catchment) · T-24's six ground primitives at corpus parcel scale · T-23's five
road rungs as **five distinct primitives** · dispersal-vs-nucleation derived (§190c) · road
furniture and the day's-travel rule · the field/fabric junction band and the intake line · edge
kind per bearing with **unequal** ribbon extents · gate ranking for growth allocation · the
extramural distance ladder's uncovered bands and the single-arc noxious rule · street width from
graph load (now that the region supplies the gate weights) · the landmark budget.

**EXIT CRITERIA (measurements):**
1. **Field parcel area relative to settlement extent lands within a stated factor of the corpus's**
   — b6 is **10–30× too large** and that ratio is the target to close.
2. **≥4 distinct ground primitives and ≥3 distinct road primitives per leaf where the land use
   and road web support them** — b6 draws 1 of 6 and 1 of 5.
3. **Village-and-below grain moves toward its band with the countryside as the attributed
   cause**, measured on a **matched-population control** (J-B8-14: *grading a 27-soul thorp
   against a plate of 40–60 souls measures the fixture, not the fabric*).
4. **Ribbon extents are measurably unequal across a leaf's gates**, and extramural mass
   concentrates on **≤2 gates**; noxious occupies **exactly one arc**.
5. **Street width classes derive from measured graph load**, with p97/p50 moving toward the
   organic band **16–30** (scanline) from b8's 9.9 / 12.1 / 12.4 — and the class ladder shown to
   be a quantiser (perturb the load, the widths move).
6. **Landmark counts fall into 3–7 / 4–9 / 9+ and the landmark:house footprint ratio rises toward
   5–12:1** — ⭐ *fewer, bigger.*
7. **Every approach road's bearing traces to a named neighbour or resource; zero invented
   bearings.**

---

### W6 · THE SYSTEMS — four dossier fields consumed spatially for the first time (G-13, G-14, G-22, G-6)

⭐ **This is §251.2's finding turned into a wave: `supplyChains`, `neighbors`, `institutions` and
`resources` stop being labels and become geometry.**

**Contents:** institution siting profiles with **prohibited** adjacencies · `spawnsQuarter`
micro-districts and custodian dwellings · the `jurisdictional` doubling flag · the water role
axis, the directed centreline, flow-ordered chains and the domestic-water ladder · the dirt
vector whole (clean take above → process → plume below → muck gate) · centre typology and
`secondAuthority ⇒ secondCentre` · footprint grammar by material **to whatever depth G-30's owner
ruling permits**.

**EXIT CRITERIA (measurements):**
1. **Zero violated prohibited adjacencies across the corpus**, with a planted violation (a tannery
   upstream of the clean take) that reds.
2. **Every institution's placement cites a siting-profile clause; zero placements with cause
   `scatter`.**
3. **Every water-consuming institution occupies a slot in an ORDERED chain**, and the chain's
   upstream/downstream predicates hold: **zero mills off a race, zero discharges above a take.**
4. **A dual-authority fixture produces exactly the jurisdictional duplicates and no others**, with
   each instance in its own authority's territory, and **the two halves measurably differ in plot
   rhythm.**
5. **Wells place by uncovered distance**: the maximum walk distance to water falls below a stated
   bound, and removing one well must raise it (the pin is non-vacuous).
6. **≥2 distinct footprint grammars exist in the corpus's leaves and produce measurably different
   packing** (alley-width floor, corner radius, party-wall behaviour) **from the same population
   and trade** — the hf327 test.

---

### W7 · THE HAND (G-16, §214's terrain arm, G-26, G-27)

**§214's terrain arm unblocks here because W1 built its input.** The painted closure is MF-A1's
brief and is the largest remaining distance to §207's absolute bar.

**EXIT CRITERIA (measurements), all on the strongest-cohort bands:**
1. **paper grain σ ∈ 1.30–2.96 (target median 2.05)** — from **0.00**.
2. **within-fill wash σ ∈ 1.83–4.39 (target median 3.29)** — from **0.00**.
3. **per-fill tone IQR ∈ 8.0–66.5 (target median 22.0)** — from 4.0 at town/village/metropolis.
4. **wash mis-registration present and measurable at 2–8 px at native scale** — ⭐ *the decisive
   tell.*
5. **paper centroid within band at warmth 37; ink L ≤ 45 (full ink)** — b6 already MEETS ink L at
   35.0 and must not regress.
6. **≥5 distinct weights per leaf with p90/p25 inside 3.1–7.2** — b8 exceeds the count and sits
   **above** the ratio band; bring it into band or state why the excess is correct.
7. **Relief draws in hachure and rock hatch selected by land-form class, spacing tightening with
   gradient** — and the §9.5b acceptance test passes by eye.
8. ⚠ **Re-window `MFS1-aesthetic.py` to the new module BEFORE spending any of these numbers**
   (its 6.6 px sample windows are dominated by ground wash at the new grain).
9. **All of it produced as geometry or tiled patterns, never as raster filters** — the §9
   forbidden-construct scan stays clean and **PDF projection survives**.

---

### W8 · THE CLOSING LOOP (G-29, G-5, G-24's re-run, §216)

**Contents:** spatial indexing with canonical insertion **and result** ordering, the
indexed-vs-exhaustive equivalence pin, and per-census runtime budgets · the population→extent
derivation home fitted **against our own leaves** · the §216 comparison round and the blinded
test against the frozen 313-plate north star and its holdout.

**EXIT CRITERIA (measurements):**
1. **Per-census runtime budgets in force, with a completeness status where "skipped due to scale"
   can NEVER read green.**
2. **The indexed and exhaustive census results are proved equal on fixtures**, not assumed.
3. **§220's performance gate passes app-realistically** — ⛔ **LAUNCH-BLOCKING for the map surface
   (§247.3a): a wow moment that takes twenty seconds to render is not a wow moment.**
4. **An extent fit over ≥16 leaves per tier with FACT populations, reported with its R², and
   cross-checked against the external 0.385 exponent for SHAPE agreement** — with the constant
   derived from our own data, never adopted from theirs.
5. **The blinded test executed against the holdout**, whose ⛔ **ZERO trade (0/4) and ZERO
   institution (0/3) coverage** is stated as a known limit rather than discovered afterwards.

⭐ **AND THE MARKETING ARTIFACT §247.3c NAMES IS A W8 OUTPUT, NOT AN AFTERTHOUGHT: THE SAME TOWN
ACROSS TIME (year 1 → year 100 — growth, fire, shrinkage, rebuilding).** It is the artifact no
competitor can produce, our epoch/drift/snapshot design already implies it, and after W2 and W4
it is a rendering of work already done.

### §5.1 · WHAT THE ORDER BUYS, STATED PLAINLY

- **After W0** the water censuses **mean something**: a figure is comparable across terrains, a
  lawful crossing can actually be exempted, and a corpus total stops multiplying one river by six.
- **After W2** a walled settlement has a **biography** instead of rings.
- **After W3** a block reads as **fabric** instead of a bag of rectangles.
- **After W4** the epoch axis is **visible** rather than merely correct.
- **After W5** the low tiers stop losing on 85% of their own plate.
- **After W6** the settlement has a **plausible relationship to its world** — which is the exact
  deficiency §246 was asked about and CONTEXT §14 answered.
- **After W7** it stops reading as vector art.

⚠ **AND THE HONEST CAVEAT, KEPT ON THE RECORD FROM §247.4: on structure and truth the
"better than the leaders" claim is within reach and partly evidenced — town and city grain in
band, zero-violation geometry no reference plate holds itself to. On pure aesthetic polish we are
not there yet. THE PLAN IS SOUND; THE TIMELINE IS THE RISK.**

---

## APPENDIX A · INSPIRATION, NOT DERIVABLE — and therefore NOT in the pipeline

**The rule this appendix exists to enforce (§246.2): a mechanism without a derivation home is
DECORATION and must be labelled so.** Everything below is something the corpus does well that
**no dossier fact I can identify would drive.** None of it may enter §1's stages. Each row states
what fact would be needed, so a future ruling can move it out of here rather than reinvent it.

| # | the thing | why it is not derivable | what would be needed |
|---|---|---|---|
| **A-1** | ⭐ **MICROCLIMATE — wind bearing, sun bearing, aspect, frost, salt exposure** | ⛔ **We hold NO bearing field of any kind** (the §7/E8 correction established this for hazards). It is the **most frequently drawn siting logic in the corpus** — eight independent plates: the shaded shore empty and the sunny shore strung with villages; the frost hollow left unplanted; every village upwind of the ash | a prevailing-wind bearing and a sun/aspect model. ⛔⛔ **A bearing invented at generation is a NEW WORLD FACT, and under THE PROMISE that is a SEED-PERMANENT commitment. §251.5 correctly refused it. OWNER-GATED, filed, NOT PROPOSED** |
| **A-2** | **SHORE TYPE** — shingle / sand / mud / cliff / reef | `coastal` is one token; two plates key their whole waterfront off shore type | a shore-type fact, or G-30's composite modifiers |
| **A-3** | **SOIL / DRAINAGE PROXY** | one plate's entire argument is *nucleated on the spring line, dispersed on the wet clay, absent on the dry down* | a soil axis. Partly proxied by `terrainType` + water mode; **not honestly derivable today** |
| **A-4** | **BUILDING MATERIAL as a grammar** | ⚠ ***Nearly* derivable** — `resources` × `terrainType` × `culture` all exist and CX-34 names the home — **but the mapping from a resource list to a material grammar is a judgment call that affects every footprint on every leaf** | a ruling, not a fact. **It is a DECLARED-SHIFT event and is flagged rather than assumed.** *(This is why G-6 sits in the ledger with a gate on it rather than in this appendix outright.)* |
| **A-5** | **CULTURAL PLAN GRAMMARS beyond material** — walled wards, rank belts, causeway cities | these are **political** organising principles, not material ones. We hold `government` and `factions`, but whether a government type may drive a plan grammar is a product decision about how deterministic culture should be — **and it brushes the setting-agnosticism law** | an owner ruling. **Recorded, not proposed** |
| **A-6** | **THE OBLIGATION GRAPH** — that hamlet X buries at church Y | we hold `neighbors` and `institutions` **separately**; nothing relates them as a dependency | a modelling decision, not a rendering one |
| **A-7** | **A RUIN REUSED AS AN ENCLOSURE** — a market place inside a roofless basilica; an amphitheatre converted to garden terraces | needs a notion of a ruin's **usable enclosed volume** | a volume/enclosure model for ruins |
| **A-8** | **THE SPECIFIC CHARM OF A MIS-SHAPED BLOCK** — a wedge, a swallowed lane | ⭐ **our version must come from §3.5's COLLISIONS; the corpus's comes from a model's hand, and the difference is not derivable** | nothing — this is correctly answered by G-10 + G-18, not by imitation |
| **A-9** | **THE DENSITY OF INCIDENTAL NAMED DETAIL** | our truth layer names things **correctly**, which is better; the *density* of incidental naming is a taste call | a taste ruling |
| **A-10** | **WHICH OF THE SIX CENTRE TYPES "FEELS RIGHT"** beyond §1.1.12c's causal rules | the rules cover most of it; **the residue is taste** | nothing |
| **A-11** | ⭐ **THE CORPUS'S WILLINGNESS TO LEAVE LARGE AREAS QUIET** | several of the best plates have a whole sector doing very little. **PLAN could find no derivation for RESTRAINT and suspects it is a composition judgment rather than a settlement fact** | ⚠ recorded honestly. *If a later lane finds a derivation for restraint it will be worth more than most of §4's ledger* |
| **A-12** | **hf338's UNFINISHED SURVEY** — one sheet in four states of completion grading into one another | ⭐ **it is not a settlement fact at all; it is A PICTURE OF OUR OWN RENDER PIPELINE** | nothing — it is the natural reference for progressive rendering, partial-detail LOD and any surveyed/unsurveyed fog concept, and **it needs no derivation home** |

⚠ **AND ONE WITHDRAWN FINDING, LEFT VISIBLE RATHER THAN RENUMBERED AWAY (PLAN §10.3).** A finding
about **desire paths** — informal worn tracks cutting the corners between formal radiating roads
outside a gate — was **WITHDRAWN entirely** because its only witness was inside the blind
holdout. ⭐⭐ **§250.7 made the discipline law: A STUDY TAKES THE LOSS RATHER THAN CONTAMINATE THE
HOLDOUT.** If a future lane wants this finding **it must come from the holdout's own release**,
not from here. *(CONTEXT's CX-33 reaches worn approaches from a different, non-holdout direction
and is in G-15; the desire-path finding specifically is gone.)*

---

## APPENDIX B · CHAIR QUESTIONS — holes this synthesis found, raised rather than filled

**Six questions. Three are NEW — nobody in §150–§253 has ruled on them and this synthesis
surfaced them by putting the studies beside the code. Three are CARRIED — already raised by a
lane and still open, restated here because a build sheet that omits them will run into them.**
⛔ **None is answered in this document.**

### Q-1 · NEW · May a WITHDRAWN grading target remain a GENERATION input?

**The situation.** ATLAS T-01 ⛔ **withdrew** the thorp (8–14) and hamlet (18–26) grain rungs —
the instrument that produced them is invalid at those tiers, and §244.5 ordered every verdict
issued against them withdrawn too. **But the built `GRAIN_BAND` table consumes both numbers as
GENERATION inputs**, and `cells(pop)`'s seam construction reads through them: `GRAIN_SEAMS`
begins `8 → 16 → 28 → …`, so **the withdrawn rungs shape the curve at village tier as well.**

**Why it is a genuine hole.** The withdrawal is about **measurement validity**, not about whether
the numbers are a reasonable generation target. Deleting them leaves `cells(pop)` **undefined
below village**; replacing them with new numbers would be **tuning wearing measurement's
clothes**, which this program forbids by name.

**Three options, none taken:** (a) **KEEP them, labelled UNMEASURED in the code**, with a comment
citing §244.5 and a standing note that no grading verdict may be issued at those tiers — the
interim rule this spec uses; (b) **BUILD THE ROOF-COUNT INSTRUMENT FIRST** (§249.4c already queued
it; the plates carry 6–24 roofs so an eye count is *exact*) and re-derive both rungs from it,
which is the only option that restores them honestly; (c) **derive the low rungs from household
count rather than grain**, which J-B8-3 already half-does — *the roof count is the grain's
consequence above village and the household count's at and below it.*
**RECOMMENDATION (vetoable): (a) now, (b) queued.** ⚠ **But the chair must say so, because right
now the code silently spends a withdrawn number.**

### Q-2 · NEW · The epoch ladder is a CIRCUIT ladder. What derives a FABRIC epoch that no circuit marks?

**The situation.** §240's law is *core → wall → ring → wall → ring*, and the built `epochAxis.js`
implements exactly that: **one epoch per circuit, plus the suburb.** Every unwalled leaf
therefore gets **exactly ONE epoch** (`laneMFARCH2-receipt.md` §2.2 — thorp, hamlet, village,
mountain, fjord, year-018 all show `rings 0 → one unwalled epoch`).

**But PLAN §6.1 measures LEGIBLE FABRIC EPOCHS independently of circuits: village 1–2, town 2–3,
city 2–4, metropolis 3–4** — and a walled town with one circuit gets 2 epochs from the ladder
(walled + suburb) against a measured 2–3, while **an unwalled village measured at 2 epochs gets
1 by construction.**

**Why it matters and is not pedantic.** §240.3's vintage triad, PLAN §6.2's three dials and
W4's whole exit criteria are all **per-epoch**. If an unwalled settlement can have only one
epoch, then **no unwalled settlement can ever show a vintage difference, a bearing change or an
attachment mode** — and half the tier ladder is unwalled by §251's own measurement that *the
walled/unwalled split is essentially the tier line.*

**The question:** does a fabric epoch need its own derivation (from promotion events, prosperity
history and growth rate) independent of circuit events, with the circuit ladder becoming a
*subset* of the epoch ladder? ⚠ **The naive fix — minting epochs from population growth — is a
knob unless it is derived, and §240.2's "ring count is DERIVED, never a knob" is the binding
condition it must satisfy.** **RAISED, NOT ANSWERED.**

### Q-3 · NEW · Is `GRAIN_BAND` the MEASURED target or the DERIVATION target?

**The situation.** `cells(pop)` sets a **derivation** target; T-01 bands a **measured** quantity
on the rendered plate. **The code uses the same numbers for both.** At town and city that is
fine — the drawing resolves and the measured value lands in band. At metropolis the derivation
computes **≈113 cells** and the plate measures **70**: the drawing loses roughly 38%.
⭐ **MF-B8 named the mechanism precisely: *the grain instrument measures what RESOLVES, not what
EXISTS* — b7's town already carried 82 plot modules across its window and counted 24.8.**

**The question.** Two readings and they lead to different work. **(a) The band is the MEASURED
target**, the derivation should aim *above* it wherever the drawing loses, and the loss factor is
itself a measured quantity per tier. **(b) The band is BOTH**, and any measured shortfall is a
DRAWING defect to be cured (the countryside at low tiers, LOD/merge behaviour at metropolis) —
in which case the derivation must never be inflated to compensate.
⭐ **This spec's PLAUSIBLE reading is (b)** — inflating the derivation would hide a drawing defect
behind a number, and `MFB8-runprobe.py` exists precisely to separate the two. ⛔ **But the chair
has not ruled, and the metropolis miss sits on exactly this ambiguity.**

### Q-4 · CARRIED · T-05's fill: measure the atlas's quantity, or band ours?

ATLAS's `open_share_in_core` is a **texture** measure (8×8 blocks by edge density); the built
census computes `1 − building area ÷ wash area`. **Different quantities, and the built one has no
measured band.** MF-B8 flagged it and declared its band **DERIVED-NOT-CORPUS** rather than
reporting sixteen leaves of failure. **Wave nine must either measure the atlas's own quantity on
the plate, or set a band for ours — and say which.**
⚠ **A related unruled finding travels with it: the market void is present at EVERY tier including
village, where T-04 says it belongs to town+.** Either the target is wrong or the generator is;
**MF-B8 reported it for the chair and it is still open.**

### Q-5 · CARRIED · Does the extent derivation home get restored from our own leaves?

§249.4c ruled the population fit **UNRESTORABLE from the corpus**. §1.2c argues the restoration
path is our **own leaves**, whose populations are facts — 16 per tier, byte-deterministic, with
published extents. **That is a new instrument and it touches §5's tier table**, which MF-B8
explicitly declined as *"a §5 tier-table question and it is the chair's, not mine."*
**RAISED with the experiment named (G-5); not taken.**

### Q-6 · CARRIED · §240.2 says a village earns zero circuits, and the module does not enforce it

`epochAxis.js` caps how many circuits a settlement **maintains**; **whether there is a wall at all
remains the landed model's (`meta.hasWalls`)**, because refusing a circuit the model asserts would
break the one-decider rule. ⚠ **No walled leaf in the corpus is below town tier, so nothing in the
corpus tests the difference** (J-A2-4, flagged rather than settled).

---

## APPENDIX C · INSTRUMENT AND MODULE MAP, AND WHAT THIS LANE DID NOT DO

### C.1 · The instruments a builder will need

| instrument | what it measures | ⚠ |
|---|---|---|
| `MFS1-grain2.py` | fabric grain (`cells_across`) | kernel reproduces all 22 archived rows exactly; ⛔ **windows are HAND-SET — use `MFB8-plates.mjs` instead** |
| `MFB8-plates.mjs` | **windows derived from the fabric's own built-umbrella bbox** | ⭐ **the cure for the hand-keyed-address rot class — take the window from the thing it is a window on.** ⚠ conservative for lobed settlements (J-B8-13) |
| `MFB8-runprobe.py` | ⭐ **separates what RESOLVES from what EXISTS** — see Q-3 | should be standard |
| `MFS1-aesthetic.py` | grain σ, wash σ, tone IQR, stroke percentiles | reproduces all 12 archived rows exactly; ⚠ **ran on 12 plates only**; ⚠ **re-window before spending its numbers at the new grain** |
| `HFM1-palette.py` | paper / ink / L-percentiles | ⭐ **a RECOVERY, not the original** — calibrated to within 3/255 on ink hex over 49 published pairs |
| `MFS1-measure.py` | texture blocks, palette clusters, colour-family shares | ⛔ **`center_edge_ratio` is noisy (median 7%, max 44%) — DO NOT BAND IT** |
| `MFS1-streets.py` | street widths (scanline) | ⚠ **not re-run at scale; T-04 is unverified at thorp/hamlet** |
| `MFS2-bands.py` + `MFS2-bands.json` | the re-pinned aesthetic bands from the CSV | every band recomputed, **never transcribed** |
| `MFS3a-*` / `MFS3B-context-census.py` | the plan and context censuses | re-runnable beside their compendiums |
| `MFARCH2-scc.mjs` | the SCC diagnostic at binding **and** field granularity | ⚠ **an SCC is only as wide as its scan** — five write-backs hid inside `censusLeaf` |
| `MFARCH2-hashtiers.mjs` · `-engines.mjs` · `-det.mjs` · `-drawn.mjs` | the three hash tiers · four V8 modes · cross-process determinism · the drawn censuses | ⛔ RASTER exits non-zero when `sharp` is unavailable; a driver that cannot run is reported, never passed quietly |

### C.2 · The module map at MF-ARCH-2's tip

`buildFabric.js` (790 eff — the assembly) · `epochAxis.js` (179 — the ladder and the containment
closure) · `lateGround.js` (43 — the ground law's late passes) · `wallCircuit.js` (292 — the
canonical circuit node) · `walls.js` (197) · `builtUmbrella.js` (197) · `leafCensus.js` (275) ·
`fabricGeometry.js` (425 — the two quanta) · `reservedGround.js` (one answer to *does this body
stand in reserved ground*) · `districtPartition.js` (§232 as a derivation) · `tierGrammar.js` (the
grain derivation) · `parcels.js` (the plot series) · `groundLaw.js` · `habitation.js` ·
`accessLaw.js` (stratum-agnostic) · `waterWorks.js` · `substrate.js` · `snapshot.js`.
⛔ **`wallCycle.js` is DELETED** — with the version axis explicit its bounded solve had nothing
left to solve. **There are now ZERO bounded solvers in the fabric.**
⚠ **`renderFolio.mjs` is HARNESS, not domain.**

### C.3 · What this lane did NOT do — stated affirmatively so nothing is re-found as a gap

1. **Executed nothing.** No build, no test run, no measurement, no render. Every CONFIRMED label
   cites a named upstream lane's executed evidence; **no number in this document was computed by
   me.**
2. **No git writes, no memory writes, no state-mutating command of any kind.** The one git command
   used was the read-only `git show refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md`
   the brief specifies.
3. **No new law was invented.** Where the synthesis found a hole, it is a numbered chair question
   in Appendix B, not a filled gap.
4. **No holdout plate was opened, cited or reasoned from.** Every plate id in this document is
   quoted from a study that had already cleared it against the exclusion lists.
5. **The atlas, both compendiums and the prior-art study were NOT edited.** Where this document
   disagrees with one of them it says so in §0.4 and rules with reasons; **it does not silently
   replace a figure in its source.**
6. **MF-W1's characterization landed mid-lane and IS folded in** (§0.3, §0.3a, §0.3b, §4.1a,
   G-34, W0). ⚠ **What I did NOT do is re-verify any of its figures** — the authoritative set,
   the 2×2 decomposition and the 92-of-127 arithmetic are quoted from its receipt, not
   recomputed.
7. **The plates from MF-ARCH-2 were NOT viewed by this lane** — that obligation belongs to W0 and
   is stated as such rather than quietly absorbed.
8. **No owner-gated item was decided**: the terrain vocabulary (G-30), `eventFootprint` (G-11),
   the faubourg district-id change, the click-region contract, microclimate bearings (A-1),
   §5's tier table (G-5/Q-5) and the metropolis op ceiling all remain raised, not settled.
9. **Nothing here is a pin.** Every band is a target for the chair to convert into a pin, a band,
   or a rejection (ATLAS §2.8.4, inherited).

---

**MF-SPEC ends here.** This document is the map program's spine and wave nine's build sheet per
ODQ §246.3. It supersedes no law; it orders them. Where it and a later ODQ ruling disagree,
**the ODQ ruling wins** — and the disagreement should be folded back into this file, because a
build sheet that carries a refuted figure builds every future wave against a lie.

