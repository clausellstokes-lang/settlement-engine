# Lane MF-INT1 — THE INTEGRATION SPIKE: receipt

**Lane MF-INT1 (Opus 5), 2026-08-17, ODQ §265.3 as amended and pulled forward by §266.5.**
**Mandate: land nothing; convert the program's largest unknown into numbers and a mismatch list.**

**ISOLATION HELD.** Two private detached worktrees created from `refs/heads/claude/composite-r4`
@ `ac243e1c`: `/private/tmp/MFINT1-tree` (pristine app, the baseline) and `/private/tmp/MFINT1-fab`
(the same tree with the sandbox fabric laid over it). **No commits, no branch-ref moves, no pushes,
no memory writes, no stash.** `/Users/cstokes/Desktop/settlement-engine` was READ ONLY (one
`git show` of the ODQ, `git worktree add`, and reads of `map-corpus/docs/`). `.claude/worktrees/minifold`
was never touched. `scratchpad/mf-proto/build-out/**` was **READ ONLY** — no command in this lane
ever named it as a write target; every `cp` used it as SOURCE and every in-place `sed` targeted
`/private/tmp/MFINT1-fab`. Scratch files carry `MFINT1-` prefixes.

**Verified after all measurement** — the strongest available proof is byte-equality, not mtimes:
```
$ diff -rq mf-proto/build-out/src/domain/townMap/fabric  MFINT1-fab/src/domain/townMap/fabric  → FABRIC IDENTICAL
$ cmp  mapEdits.js · townMapModel.js · foundingKind.js · institutionAtlas.js
       · townLayoutV3.mf0.js · harness/renderFolio.mjs                        → SAME (6/6)
```

⚠⚠ **AND A LIVE-TREE CAVEAT, RECORDED BECAUSE IT IS EXACTLY THE HAZARD CLASS THIS ESTATE KEEPS
HITTING: MF-W0 EDITED `build-out` UNDERNEATH ME MID-LANE.** Three files carry mtimes after 06:50:
`src/.../fabric/tierGrammar.js` at **06:51:11** (before my overlay at ~06:55, so my copy captured
the post-edit bytes — and the `diff -rq` above proves it is still current), and two TEST files —
`tests/domain/townMapFabricBuildOut.test.js` at **06:56:50** and `tests/lint/derivationGraph.walker.test.js`
at **07:19:36** — **after** I copied them.
```
$ find mf-proto/build-out/src -newermt "2026-08-17 06:56" -type f | wc -l   →  0
```
⭐ **So every SOURCE measurement in this receipt is against build-out's current bytes and is not
stale. Only §4.7's (incomplete) test run used a snapshot W0 has since edited**, and that row's
finding is a runtime observation, not a pass/fail claim.

---

## §0 · THE VERDICT, STATED FIRST

> ⭐⭐⭐ **THE SPIKE DID NOT FAIL, AND THAT IS THE HEADLINE.** The sandbox fabric **runs to
> completion on a real dossier straight out of the real `generateSettlementPipeline`**, at every
> tier from thorp to metropolis, with **zero code changes to the fabric and zero fixture defaults
> supplied by me**. It also survives the persistence lifecycle: a `JSON` round-trip and a pass
> through the app's own `normalizeSettlement()` both produce a **byte-identical SVG**. The
> program's largest unknown was "does it even run" and the answer is **yes**.

> ⭐⭐⭐ **AND THE REAL RESULT IS THE SECOND ONE: IT RUNS, BUT IT RUNS PARTLY BLIND.** An
> **executed** read census over a real metropolis dossier finds **111 distinct settlement read
> paths, of which 33 resolve to `undefined`**. **Fourteen are the fabric's own**, and they cluster
> into **four defect families that silently disable whole features every sandbox exemplar
> demonstrated**: the entire **§10 stressor arm**, the **resource-ground terrain contracts**, the
> **neighbour edges**, and — most visibly — the **planned/charter morphology, which is unreachable
> on every settlement the app has ever generated**. These are not crashes. They are features that
> render as their absence, on a corpus whose fixtures mirrored the readers and so could never see
> it.

> ⭐⭐⭐ **THE §220 GATE IS THE REAL PROBLEM, AND IT IS NOT CLOSE.** At metropolis, `buildFabric`
> costs **2.3–4.2 seconds** where the map the app ships today costs **5–21 ms** — **two to three
> orders of magnitude**, measured in the same process on the same settlement. **97 % of the
> dossier→SVG time is `buildFabric`**; the SVG serialization is 22 ms and the browser is genuinely
> fine (first paint 23 ms; pan/zoom frames vsync-locked at the 16.7 ms median with a 33-35 ms p95,
> i.e. roughly one dropped frame in twenty — see §4.4's software-raster caveat). **VERDICT: the §220 gate is NOT achievable
> at current grain — but it is achievable, because the cost is CONCENTRATED, not diffuse.** A CPU
> profile puts **70 % of the build in three modules** and **14 % of the entire build inside
> `Number.prototype.toFixed(6)`** (`fabricGeometry.q6`, a string-keying helper). The supporting
> number is in §4.6.

> ⚠⚠ **THE COSTLIEST SEAM IS NOT DATA, IT IS THE RENDERER'S OUTPUT TYPE.** `renderFolio` emits an
> **opaque SVG string**. The app's on-screen map is a **React JSX SVG tree** whose every district
> and building is an element carrying `onPointerEnter` / `onPointerDown` for hover, pin and
> drag-edit (`SettlementMapPane.jsx`, 793 lines, one of 54 files in `src/components/townMap/`),
> and **the PDF path consumes a DrawOp list, not an SVG string** (`TownMapPlate.jsx` maps ops to
> react-pdf primitives). **Dropping the folio in as a string destroys the entire interaction
> surface and cannot enter the export path at all.** The fabric already carries the identity the
> adapter needs (`parcel.key`, `landmark.anchorKey/identityKey/districtId`), so this is a
> projection to write, not a redesign — but it is the single largest item on the seam list.

---

## §1 · METHOD, AND WHAT EACH CONFIGURATION IS

Everything below was executed. Nothing is extrapolated except where labelled.

| config | what it is | why |
|---|---|---|
| **BASELINE** | `/private/tmp/MFINT1-tree` @ `ac243e1c`, untouched | the app as it stands; the pre-existing-red reference |
| **CONFIG A** | app tree + sandbox `fabric/**` + `townMapModel.js` + `mapEdits.js` + `townLayoutV3.js` + `foundingKind.js` + `institutionAtlas.js`; **the app's OWN `narrativeGenerator.js` kept** | ⭐ **this is the spike.** The real dossier, unmodified, meeting the fabric |
| **CONFIG B** | Config A + the sandbox's modified `narrativeGenerator.js` | the sandbox's own world, for attribution by difference |

The overlay was derived from the sandbox's own `laneMFB8b-sync.sh`, with one correction: that
script copies `townLayoutV3.mf0.js` under its `.mf0` name while `townMapModel.js` imports
`./townLayoutV3.js`. See §3.6.1 — **`townLayoutV3.js` exists on no branch of this repo**.

**Instrument for the mismatch list** — an executed read census, not a grep. The settlement is
wrapped in a recursive `Proxy` (depth 3) that records every property read and whether it resolved.
**Anti-distortion control**: the proxied build produces `parcels=2587`, identical to the unproxied
build of the same seed, so the proxy did not change what the fabric did.
Script: `MFINT1-readcensus.mjs`. Data: `MFINT1-readcensus-metropolis.json`.

---

## §2 · THE HEADLINE RUN — CONFIG A, REAL DOSSIER, NO ADAPTER

```
OK   town         Rajigiri   tier=town        pop=  2307  gen= 116.7ms model= 7.9ms fab= 2424.4ms rend= 35.4ms els=249 bytes=384800
OK   city         Beloburg   tier=city        pop= 22034  gen=  49.2ms model= 3.5ms fab= 2596.0ms rend= 20.9ms els=322 bytes=499855
OK   metropolis   Birdarya   tier=metropolis  pop= 93428  gen=  58.7ms model= 4.6ms fab= 2443.5ms rend= 23.7ms els=339 bytes=610698
OK   metropolis2  Varamala   tier=metropolis  pop= 55260  gen=  56.0ms model= 3.2ms fab= 3541.1ms rend= 23.8ms els=349 bytes=646068
```

**CONFIRMED**: four for four, no exception thrown, no fixture default supplied. The fabric's entry
seam (`settlement`, landed `model`) is compatible with the real pipeline's output **as a type**.

**Lifecycle paths traced and CONFIRMED clean** (the class this owner is most often bitten by):

| path | result |
|---|---|
| fresh generate → fabric → SVG | builds |
| `JSON.parse(JSON.stringify(s))` → fabric → SVG | **byte-identical SVG**, `parcels` equal |
| `normalizeSettlement(saved)` → fabric → SVG | **byte-identical SVG**, `parcels` equal; `normalizeSettlement` adds and removes **no** top-level key |
| same seed twice | identical (`renderFolio` output compared as strings) |

⚠ **NOT traced**: the map-edit path (`mapEdits` pins / reroll salt / lens under v3), the undo path,
and the Supabase save→load round trip through the real store. Stated as a gap, not a pass.

---

## §3 · THE MISMATCH LIST — THE PRIMARY DELIVERABLE

### §3.1 · ODQ §251.2's four dossier fields, verified against the real pipeline

§251.2 says the fix is *"four dossier fields (`supplyChains`, `neighbors`, `institutions`,
`resources`) that the map today reads FOR LABELS AND NEVER FOR GEOMETRY."*
**RULING FROM EXECUTION: that sentence is right in spirit and wrong in three of its four names.**
Enumerated from `Object.keys(settlement)` on a real metropolis (41 top-level keys):

| §251.2 name | exists at top level? | what is actually there | consequence |
|---|---|---|---|
| `institutions` | ✅ **yes**, `array[53]` | `institutions[]`, entries keyed by `catalogId` (**not `id`**) | the one field that is as described |
| `resources` | ❌ **no such key** | `resourceAnalysis.availableResources[11]`, plus `config.nearbyResources*` (8 spellings) | see §3.2.2 — the fabric reads **six** spellings and **none is the live one** |
| `neighbors` | ❌ **no such key** | `neighborRelationship` (live singular object, `null` unless a neighbour was imported) and `neighbourNetwork[]` (UK, persisted at save time) | see §3.2.3 — and the geometry the map needs **does not exist at all** |
| `supplyChains` | ❌ **no such key** anywhere in a settlement | `resourceAnalysis.resourceChains[]` and `economicState.activeChains[20]`. The string `supplyChains` exists in `src/` only as (a) a **computed `useMemo`** in `ChainEdges.jsx` — whose own header says *"No `supplyChains` store slice is needed"* — and (b) a **custom-content category id** in `CustomContent.jsx` | a landing brief that says "read `settlement.supplyChains`" describes a field that has never existed on a settlement |

⭐ The §251.2 claim that these are read *for labels and not geometry* **is now false in the sandbox
direction**: the fabric reads `resourceAnalysis.availableResources` for **iconography** (`immersion.js:166-178`
→ fish / pick / sheaf / tree / wheel marks) and reads the resource words for **ground contracts**
(`substrate.js: resourceContracts()` → `RESOURCE_GROUND` relief/wet/rock floors). The intent has
already crossed from label to geometry; only the spelling stopped it.

### §3.2 · CLASS A — dead reads the fabric BELIEVES are live (the real defects)

These are reads that return `undefined` on a real dossier where the code's own shape shows it
expected a value. **Each one is a feature that renders as its absence, with nothing failing.**

#### §3.2.1 ⛔ `settlement.stressors` — A SHAPE MISMATCH THAT KILLS THE ENTIRE §10 ARM

```js
// buildFabric.js:800   const stressorKeys = Array.isArray(s.stressors) ? s.stressors.map(...) : [];
// stateMarks.js:90     const raw        = Array.isArray(s.stressors) ? s.stressors : [];
```
**The sandbox exemplars synthesize `stressors: ['under_siege']` — an ARRAY OF CATALOG KEYS.**
**A real dossier's `stressors` is a SINGLE OBJECT**, and it is the *same object* as `settlement.stress`:

```
stressors  object{type,label,icon,colour,summary,crisisHook,viabilityNote,historyColour}
           → { "type": "wartime", "label": "Wartime", … }
```
`Array.isArray({...})` is `false`, so **`active` is always empty**. Measured consequence: the
siege camp, the barred gate, the lazar house, the empty famine market, the migrant camp at the
busiest gate — **four of the sixteen sandbox exemplar leaves exist only because the harness
asserts a shape the generator never produces**, and on real input those markers can never fire.
The vocabulary is wrong as well as the shape: the catalog keys are `under_siege` / `plague_onset`
/ `famine` / `mass_migration` / `monster_pressure`; the real `stress.type` here is `wartime`.
**COST: an adapter (`stress.type` + `activeConditions[].archetype` → catalog keys) plus a
vocabulary reconciliation. ⭐ The typed source the arm needs ALREADY EXISTS under another name and
the fabric is already reading the array: `activeConditions` is read **592 times** and carries
`[{ archetype: 'war_pressure', severity: 0.5, severityBand: 'high', status: 'worsening', … }]`.
The arm is one mapping table away from live.**

#### §3.2.2 ⛔ `readResourceWords()` — SIX SPELLINGS, ZERO HITS

`substrate.js:346-357` is explicitly written to be tolerant: *"the estate spells resources several
ways … a substrate that only understood one spelling would be silently flat for the others."*
It reads `eco.tradeCommodity`, `eco.primaryIndustry`, `eco.economicBase`, `eco.resources`,
`eco.localResources`, `s.resourceAnalysis.resources`. **The census marks all six `UNDEFINED`.**
The live field is `resourceAnalysis.availableResources` — **not in the list**. So
`readResourceWords()` returns `[]`, `resourceContracts()` returns `[]`, and the whole
`RESOURCE_GROUND` terrain-contract mechanism is inert on every real settlement.
⭐ **This is the exact failure mode the comment was written to prevent**, which is what makes it
worth reporting: tolerance to six wrong spellings is not tolerance.
**COST: one line.** Add `s.resourceAnalysis?.availableResources`.

#### §3.2.3 ⛔ `readNeighbourLinks()` — THE FABRIC RE-INTRODUCED A BUG THE APP ALREADY CURED

```js
// immersion.js:473-475
const raw = Array.isArray(s.neighbors) ? s.neighbors
  : (s.neighborRelationship && Array.isArray(s.neighborRelationship.links) ? s.neighborRelationship.links
    : (s.campaign && Array.isArray(s.campaign.neighbors) ? s.campaign.neighbors : []));
```
The app's own `src/components/townMap/edgeAnnotations.js:8` documents this field verbatim:
> *"This helper shipped reading `settlement.neighbors[]`, a field NO WRITER IN THE ESTATE HAS EVER
> PRODUCED … So `buildEdgeAnnotations` returned [] for every settlement ever generated … and the
> suite still passed because every fixture hand-built the dead spelling (a fixture that mirrors
> the reader can never see a dead arm)."*

**The sandbox shipped the dead spelling again, and its own exemplar corpus mirrored it again.**
All three arms are dead: `s.neighbors` absent, `s.campaign` absent, and — CONFIRMED by generating
a settlement **with** an imported neighbour — `neighborRelationship` is populated but carries
**no `.links` array**.

⛔⛔ **AND THIS ONE IS NOT A RENAME.** The fabric's contract is *"Every accepted shape must carry a
NAME and a BEARING."* The real neighbour object carries `{name, tier, relationshipType,
primaryExports, primaryImports, activeChains, …}` and **no bearing, no distance, no travel time** —
which `edgeAnnotations.js` states as its own honesty boundary. **A bearing does not exist anywhere
in the dossier, and minting one is a seed-permanent world fact under THE PROMISE** (the same
objection ODQ §251.5 raised against wind/sun bearings). **OWNER-GATED: the neighbour-edge feature
cannot be built without either a new persisted world fact or a refusal.**
⭐ Mitigating: the fabric's fallback is **declared**, not silent —
`"§164a STANDALONE FALLBACK, DECLARED: this settlement carries no campaign neighbour link"` — but
the declared *reason* is factually wrong for a saved settlement that does carry `neighbourNetwork[]`.

#### §3.2.4 ⛔ `history.founding.kind` — THE PLANNED MORPHOLOGY IS UNREACHABLE IN THE PRODUCT

The sandbox's `narrativeGenerator.js` patch mints a typed `kind` beside the founder prose
(`organic|charter|military|religious|refuge|planned`). **The app's generator does not.** The
fabric degrades to `organic`, which is the documented default — but the effect is not cosmetic:

| leaf | Config A (**real app generator**) | Config B (**sandbox generator**) | folio SVG |
|---|---|---|---|
| town `mfint1-town-01` | `organic` | **`charter`** | **differs** (330 vs 336 tags) |
| city `mfint1-city-01` | `organic` | **`planned`** | **differs** (405 vs 438 tags) |
| metropolis `-01` | `organic` | **`planned`** | **differs** (429 vs 426 tags) |
| metropolis `-02` | `organic` | `organic` | **sha-identical `980cc50c2087`** |

⭐⭐ **THAT LAST ROW IS THE PROOF**: the one leaf whose kind did not move produced a
**byte-identical** SVG, and the three whose kind moved produced different SVGs. So the missing
field is exactly and only what changes the drawn map. **Three of four settlements draw the wrong
plan today**, and the real metropolis whose `foundedBy` reads *"imperial decree and the systematic
forced relocation of skilled populations"* renders as an organically-grown town.
**COST: the engine patch is written and is a declared one-added-key same-seed shift (`+95/−0` lines,
zero new RNG draws by construction — the pools become typed pairs and `pick` still draws once).
It is an OWNER-GATED generator change, not a map change.**

#### §3.2.5 · `defenseProfile.defensiveTerrain` (1 read), `institutions[].id` (12 reads), `powerStructure.governingFactionName` (64 reads)

All dead, all **harmlessly** — each sits at the head of a tolerant chain whose later arm is live
(`defenseProfile.institutions.walls`, `inst.catalogId`, `ps.governingName`). Reported for
completeness; **no cost**. They are noise in the census, not defects.

### §3.3 · CLASS B — dead reads the fabric DECLARES absent (honest, no action)

`fabricScars`, `eventLog`, `populationHistory`, `calamityHistory`, `campaign`. Each is named in a
sandbox comment as absent-at-head with the consequence stated (`snapshot.js:16`, `compile.js:121-164`,
`tierGrammar.js:18,563-614`). **These are correctly handled and should not be counted as mismatches.**
Recording them here so a successor does not "re-find" them as bugs.

### §3.4 · Reads that belong to the APP's own model, not to the fabric

The census attributes by phase. These fired inside `buildTownMapModel` — i.e. **they are
pre-existing app behaviour and the fabric did not introduce them**: `config.magicExists` (14),
`config.primaryDeitySnapshot` (14), `config.biome/region/river/riverAccess/road/roadAccess` (1 each),
`stresses` (14), `threats` (7), `neighbourNetwork` (8), `neighbours` (8), `neighborNetwork` (1),
`defenseProfile.hasWalls/walls/threats`, `economicState.availableServices`. **Not this lane's
finding and not the map program's debt** — but a standing indication that the app's own model layer
carries the same dead-spelling class.

### §3.5 · Engine-side changes the sandbox requires (the dossier is not the only seam)

| file | status vs app @ `ac243e1c` | what it is |
|---|---|---|
| `src/generators/narrativeGenerator.js` | **MODIFIED**, `+64 / −29` | mints `history.founding.kind` (§3.2.4) — **owner-gated generator change, declared same-seed shift of exactly ONE ADDED KEY** (the founder pools become typed pairs; `pick` still draws once from a pool of unchanged length and order, so no other field moves) |
| `src/domain/townMap/mapEdits.js` | **MODIFIED**, `+58 / −13` | `LAYOUT_LAW_VERSIONS` 1,2 → 1,2,3; an `isLayoutLawVersion` membership test replacing two hardcoded `=== 2` — **a persistence-dial widening**, and the sandbox's own comment records that the previous spelling made a v3 blob *"storable, unrenderable, discarded"* |
| `src/domain/townMap/townMapModel.js` | **MODIFIED**, `+22 / −8` | the v3 render-router branch |
| `src/domain/foundingKind.js` | **NEW** | the `FOUNDING_KINDS` vocabulary |
| `src/data/institutionAtlas.js` | **NEW** | institution shape atlas |
| `src/domain/townMap/townLayoutV3.js` | **NEW** — see §3.6.1 | dormant v2 delegation |
| `src/domain/townMap/fabric/**` | **43 NEW files**, 11,076 effective lines | the fabric |
| `harness/renderFolio.mjs` | **NEW, and not in `src/` at all** | 1,776 raw / 1,054 effective lines |

### §3.6 · File- and path-level collisions the landing hits on day one

**§3.6.1 ⛔ `src/domain/townMap/townLayoutV3.js` DOES NOT EXIST ON ANY BRANCH.**
```
$ for b in composite-r4 composite-r3 review-fixes-2026-07-08 master the-composite; do
    git ls-tree -r --name-only $b -- src/domain/townMap/ | grep -c townLayoutV3; done
  0 0 0 0 0
```
The sandbox's `build-out` ships it as `townLayoutV3.mf0.js`; the sync script copies it under that
name; `townMapModel.js` imports `./townLayoutV3.js`. **Every lane's `-tip` tree carries a
hand-placed `townLayoutV3.js` (verified byte-identical to the `.mf0` file).** So the sandbox has
been running against a tree the product does not have, and the overlay is only lawful because
someone placed that file by hand. **The build-out tree cannot be applied to a clean checkout as
written.** This lane reproduced the correct behaviour by copying `.mf0.js` → `townLayoutV3.js`.

**§3.6.2 ⛔ `tests/fixtures/townMapFixtures.js` IS A HARD COLLISION WITH A 66-FILE BLAST RADIUS.**
The sandbox ships a file at that exact path. It is not an extension — it is a **replacement**
(`+79/−245` lines) that **deletes** `GOLDEN_CONFIGS`, `V2_GOLDEN_CONFIGS`, `V2_EXTRA_CONFIGS`,
`LANDFORM_FIXTURES` and `makeFabricMirror`, and **changes `makeTownFixture`'s signature** from
destructured named parameters to a single `overrides` object.
```
$ grep -rl townMapFixtures tests/ | wc -l      →  66
```
consumers include `tests/property/townMapGolden.test.js`, `townMapV2Golden.test.js`,
`townMapStyleGolden.test.js`, `ageOverlayGolden.test.js`, `tests/design/townMapOpBudget.test.js`,
and nine `tests/ui/settlementMap*` files. **Copying `build-out` over a checkout silently destroys
the app's town-map golden corpus.** ⭐ The cure is cheap and this lane executed it: rename to
`tests/fixtures/townMapFabricFixtures.js` and re-point the seven sandbox test files
(`sed`, one line each). **COST: trivial — but only if it is known before the copy, which is why it
is here.**

**§3.6.3 · `acorn` is an undeclared devDependency.** The sandbox's own header says so:
> *"⚠⚠ LANDING HAZARD: this file parses source with `acorn`. It is present today only as a
> transitive dependency of vite. THE LANDING EXECUTOR OWES AN EXPLICIT devDependency, and a
> dependency bump is a MINT TRIGGER (package.json / package-lock governed)."*

Quoted rather than re-derived. Confirms the standing hazard.

---

## §4 · THE MEASURED TABLE — WITH METHOD AND LIMITS PER ROW

⚠⚠ **THE ONE CAVEAT THAT GOVERNS EVERY ABSOLUTE MILLISECOND BELOW.** This machine is an 8-core
Mac running **sibling lanes' jobs throughout**; `uptime` during measurement read
**`load averages: 15.04 16.07 11.62`** — roughly 2× oversubscribed — and `ps` showed
`MFW0-battery.mjs`, `MFW0-det.mjs` and `whole-world-soak.mjs` at 76–116 % CPU. **Absolute times are
therefore INFLATED by an unknown factor and must be read as an upper band.** Where a conclusion
depends on a number, I use a **ratio measured inside one process against the legacy path**, which
is contention-invariant. A fixed CPU benchmark (3×10⁷ `Math.sqrt`) read 279–303 ms before and after
the final measurement, so conditions were at least stable across it.

### §4.1 · Cold generation, dossier → SVG string (Config A, metropolis, n=8 seeds)

Method: `MFINT1-perf.mjs`, one fresh settlement per seed, `performance.now()` around each stage,
plus an immediate **warm re-run** of the two hot stages on the identical inputs to separate JIT
warm-up from real cost. Node v24.12.0.

| stage | median | range | note |
|---|---|---|---|
| `generateSettlementPipeline` | **55 ms** | 50–116 ms | the dossier itself; unchanged by this work |
| `buildTownMapModel` | **3.4 ms** | 2.4–9.5 ms | the landed model the fabric consumes |
| `buildFabric` **cold** | **2,436 ms** | 2,133–2,679 ms | ⛔ **the headline** |
| `buildFabric` **warm** | **2,301 ms** | 2,137–2,688 ms | ⭐ **warm ≈ cold ⇒ this is real compute, not warm-up** |
| `renderFolio` → SVG | **22 ms** | 19–30 ms | serialization is cheap |
| SVG size | **579 KB** | 525–610 KB | |
| SVG DOM elements | **394** | 311–429 | `282 path`, `83 text`, `14 g`, `8 rect`, `5 circle`, `1 title` |
| primitives (renderer's count) | **8,999** | — | many primitives merged into few `<path d>` |

**Limit:** one machine, one Node build, under load. Not a browser measurement — §4.4 is.

### §4.2 · The tier ladder — and the discontinuity at town

Method: one seed per tier, warm pass, same process, legacy path measured immediately after.

| tier | pop | parcels | `buildFabric` | `renderFolio` | folio KB | **legacy `townMapExportSvg`** | legacy KB |
|---|---|---|---|---|---|---|---|
| thorp | 35 | 8 | **370 ms** | 14 ms | 115 | **8.1 ms** | 15 |
| hamlet | 296 | 64 | 372 ms | 5 ms | 129 | 4.2 ms | 23 |
| village | 568 | 86 | 353 ms | 6 ms | 147 | 2.9 ms | 38 |
| **town** | 1,417 | 856 | **2,565 ms** | 17 ms | 318 | 5.3 ms | 65 |
| city | 11,934 | 1,389 | 2,330 ms | 21 ms | 437 | 5.6 ms | 50 |
| metropolis | 84,169 | 2,420 | 3,267 ms | 31 ms | 609 | 10.3 ms | 57 |

⭐ **Two things this table says that the metropolis number alone does not.**
(a) **There is a 7× step between village and town** (353 → 2,565 ms) as parcels go 86 → 856 and the
wall circuit appears — consistent with §4.6, where `wallCircuit.js` is the single hottest module.
(b) **Even a THORP costs 370 ms and 115 KB** against the legacy 8 ms / 15 KB. The floor is
tier-independent (the substrate walks a 96² grid five times regardless), so **the free-tier
"minimum friction" map of §247.3b inherits a ~370 ms / 115 KB floor**, not a small-town discount.

### §4.3 · Rasterization

Method: `sharp` (the same import the sandbox's `MFW0-raster.mjs` uses), two runs each, second
reported as the steady state.

| input | width | time | PNG |
|---|---|---|---|
| metropolis folio 593 KB | 1400 px | **318 ms** | 1.71 MB |
| metropolis folio 593 KB | 2400 px | **637 ms** | 3.67 MB |
| metropolis folio 646 KB | 2400 px | 603 ms | 3.29 MB |

**Limit:** librsvg/resvg through `sharp`, not a browser rasterizer. It bounds a server-side or
worker raster, not what Chrome does.

### §4.4 · The real browser — headless Chromium via the repo's own Playwright

Method: `MFINT1-browser.mjs` / `MFINT1-browser2.mjs`. 1440×900 page, the SVG injected via
`innerHTML`, timings taken with `performance.now()` and double-`requestAnimationFrame`. Pan/zoom
driven for 60 frames each (first two discarded) by mutating the root `viewBox` — which is a **true
vector re-render**, the hard case, not a composited CSS transform.

| metric | metropolis (593 KB) | metropolis (646 KB) | town (385 KB) |
|---|---|---|---|
| `innerHTML` parse | 3.9–5.1 ms | 5.1 ms | 2.6–3.5 ms |
| **to first painted frame** | **22.8–25.2 ms** | 25.9 ms | 20.8–30.2 ms |
| DOM nodes | 394 | 436 | 330 |
| **viewBox PAN**, median / p95 / max | **16.7 / 33.4 / 34.5 ms** | 16.7 / 34.7 / 35.3 | 16.7 / 18.7 / 18.8 |
| **viewBox ZOOM**, median / p95 / max | **18.7 / 33.4 / 35.4 ms** | 16.9 / 33.8 / 35.3 | 16.7 / 18.7 / 18.7 |
| synchronous style+layout per viewBox mutation | **1.0 ms** (p95 1.3) | — | 0.9 ms (p95 1.1) |
| full-page raster (`screenshot`) | 145 ms @dpr1 / **460 ms @dpr2** | — | 133 / 346 ms |

⚠⚠ **LIMITS, STATED PLAINLY BECAUSE THIS IS THE ROW MOST EASILY OVERSOLD.**
1. **The renderer is `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device))` — SOFTWARE rasterization.**
   No GPU. A real user's browser composites on hardware.
2. **16.7 ms is the vsync quantum**, so "median 16.7 ms" means *the frame's work fit in budget*,
   not that it took 16.7 ms. The honest reading of the pair (median 16.7 / p95 33-35) is: **at
   metropolis roughly one frame in twenty doubles (drops to 30 fps); at town none do.**
3. `screenshot` includes PNG encoding, so it **overstates** raster cost. It is an upper bound.
4. Not measured: a real headed browser on target hardware; touch/trackpad-driven continuous
   gestures; the map inside the actual React pane with its handlers attached.

⭐ **Nonetheless the direction is clear and I am willing to state it: the browser is not the
problem.** 394 DOM nodes and ~1 ms of style+layout per pan step is a light page. **Every second of
the §220 gate is spent before the browser is reached.**

### §4.5 · Export — the PDF row of §220

Method: the repo's real path, bundled with the repo's own `esbuild` and executed in Node —
`pdf(React.createElement(TownMapDocument, {settlement}))` `.toBlob()`, cold and warm.

| what | draw ops | react-pdf | PDF size |
|---|---|---|---|
| **today's town plate** | 89 | 97 ms cold / **28 ms warm** | **7.8 KB** |
| **today's metropolis plate** | 85 | 30 ms cold / **27 ms warm** | **7.6 KB** |

The fabric **cannot enter this path** (§0, §6.1). To price it anyway I measured **react-pdf's cost
curve on the folio's OWN path data** — the real `d` strings lifted out of the metropolis folio:

| paths rendered | react-pdf | PDF size |
|---|---|---|
| 85 (today's op count) | 563 ms | 118 KB |
| **282 (the folio's ACTUAL path count)** | **878 ms** | **255 KB** |
| 1,000 | 3,234 ms | 931 KB |
| 4,000 | 11,959 ms | 3.6 MB |
| 9,000 | 23,393 ms | 8.1 MB |

**Limit:** rows above 282 are a **synthetic scaling probe** — the folio's 282 paths repeated
cyclically — and must not be read as a folio measurement. **The 282 row is the real one.**
⇒ **CONFIRMED-adjacent projection: a folio PDF costs ≈ 2,400 ms (fabric) + ≈ 880 ms (react-pdf)
≈ 3.3 s and ≈ 255 KB**, against today's **27 ms / 7.6 KB**. Text is excluded from the probe
(83 nodes), so 3.3 s is a floor. Labelled **PLAUSIBLE**: the exact figure needs the fabric→DrawOp
projection that does not yet exist.

⭐ **A genuinely good result inside this row:** the folio SVG uses **only** `path`, `text`, `g`,
`rect`, `circle`, `title`. **Zero** filters, masks, clip-paths, gradients, patterns or blend modes.
Every one of those maps onto a react-pdf primitive `TownMapPlate.jsx` already imports. **The PDF
projection is mechanically feasible** — which was not obvious in advance.
⚠ Minor: 12 of the 83 text nodes carry non-ASCII (`·` U+00B7, `—` U+2014). `tests/pdf/fontGlyphCoverage.test.js`
scans PDF **section .jsx files** for literal strings, so it will not see `lettering.js` — but a new
fabric plate `.jsx` that hardcodes those separators would red it. **PLAUSIBLE, low cost, named so it
is not re-found.**

### §4.6 ⭐⭐ WHERE THE 2.4 SECONDS ACTUALLY GO — the number that changes the verdict

Method: `node --cpu-prof`, 3× `buildFabric` on a warm metropolis, self-time aggregated per
call frame from the sample stream.
⚠ **Limit: profiling inflates the run ~3.8× (9.1 s/build vs 2.4 s unprofiled). Read the SHARES,
not the milliseconds.**

| module | share | hottest frames |
|---|---|---|
| `fabric/wallCircuit.js` | **26.0 %** | `circuitBandSide` 12.7 %, `contentHash` 8.5 % |
| `fabric/fabricGeometry.js` | **25.9 %** | **`q6` 14.1 %**, `pointInPolygon` 7.2 %, `topoText` 1.8 % |
| `fabric/accessLaw.js` | **18.0 %** | `labelOpen` 4.7 %, `fillBand` 2.9 %, `bodyReaches` 2.7 %, `fillPoly` 2.5 % |
| garbage collector | 3.0 % | |
| everything else (10 modules) | 27 % | none above 4 % |

⭐⭐ **`q6` is `export function q6(v) { return v.toFixed(TOPOLOGY_PLACES); }`.**
**Fourteen percent of the entire build is `Number.prototype.toFixed(6)`**, called to build string
topology keys via `topoText`. That is string formatting, not geometry.
⭐ **`circuitBandSide` is an un-indexed linear scan over every ring edge for every queried point**
(`for i in ring.polygon → nearestOnSeg`), plus a `pointInPoly`, per call.

**This is the load-bearing observation of the whole spike: 70 % of the cost sits in three modules,
and the two hottest frames are a string-formatting hash and a missing spatial index — both classic,
bounded optimizations, not generative work that has to happen.**

### §4.7 · The repo gate

| run | result |
|---|---|
| **BASELINE** `vitest run tests/lint tests/build` on pristine `ac243e1c` | **3 files / 5 tests FAILED**, 163 files / 1,966 tests passed, 7 files skipped. **126 s.** Pre-existing red: `warRulingKindPools`, `warCostKindPools` (3), `clampPrimitiveBaseline`. **Not attributable to this work.** |
| **size ratchet** `tests/lint/sizeBaseline.test.js` layer ceiling for `src/domain/**` = **800 effective lines** | **all 43 fabric files pass** (`buildFabric.js` **796** — ⚠ **4 lines of headroom**; `streets.js` 712; `parcels.js` 688). **`harness/renderFolio.mjs` is 1,054 effective lines and would breach whichever ceiling applies once it moves into `src/`.** |
| **op budget** `tests/design/townMapOpBudget.test.js`, `OP_CEILING = 2200` | the folio's **8,999 primitives** exceed it **~4×** — *if and when* the fabric routes through `buildTownMapDrawList`. It does not today, so the test cannot see it. **A gate that reds on the day the export projection lands.** |
| **the sandbox's own suite, run in the app tree** | ⛔ **DID NOT COMPLETE.** 5 domain files under the app's `vite.config.js` test block ran **>15 minutes of wall clock with zero files finishing**; workers were at 74–93 % CPU (computing, not deadlocked). I stopped it. Contrast: the app's entire `tests/lint tests/build` — 173 files, 2,085 tests — finishes in **126 s**. **CONFIRMED as an observation, UNRESOLVED as a cause**; the likely driver is `townMapFabricBuildOut.test.js` (2,054 lines) calling `build(s)` dozens of times at 0.4–3.3 s each, ×5 files in parallel, under a load-15 machine. **Either way this is a real landing cost: the sandbox suite as written is minutes-to-tens-of-minutes of gate time.** |

---

## §5 · THE §220 / §247.3a VERDICT

**§220 requires, at metropolis scale and corpus grain, in the real browser app: interactive
pan/zoom frame rate, first-render time, and PDF-export time — and §247.3a promotes it to
LAUNCH-BLOCKING for the map surface.**

| §220 row | measured | verdict |
|---|---|---|
| interactive pan/zoom at metropolis | median **16.7 ms** (vsync-locked), p95 **33–35 ms** | ✅ **PASSES**, with the software-raster caveat of §4.4 |
| **first render** at metropolis | **≈ 2.5 s** — 55 ms dossier + 3 ms model + **2,436 ms fabric** + 22 ms serialize + 23 ms browser paint | ⛔ **FAILS.** §247.3a's own words are *"a wow moment that takes twenty seconds to render is not a wow moment"*; today's map does this in **10 ms** |
| PDF export at metropolis | **≈ 3.3 s / 255 KB** projected (PLAUSIBLE), vs **27 ms / 7.6 KB** today | ⛔ **FAILS** |

> ⭐⭐ **THE VERDICT, AND THE NUMBER THAT SUPPORTS IT: NOT ACHIEVABLE AT CURRENT GRAIN — AND
> ACHIEVABLE AFTER OPTIMISATION, ON THE STRENGTH OF ONE FIGURE: 70 % OF `buildFabric` IS IN THREE
> MODULES, AND ITS SINGLE HOTTEST FRAME (14.1 %) IS `Number.toFixed(6)`.**
> A cost that is 14 % string formatting and ~26 % un-indexed nearest-segment scanning is not a
> cost floor. **I will not put a post-optimisation number on it — that would be exactly the
> fabricated figure this spike exists to prevent.** What I will state is the shape: the first
> render must fall by **roughly 10–20×** to reach the ~100–250 ms a "wow in under two seconds"
> (§247.2) can absorb alongside the dossier, and the profile says the first 3–5× lives in two
> named functions.

⛔ **AND THE SCHEDULING CONSEQUENCE, WHICH IS THE POINT OF DOING THIS NOW.** Every remaining wave
adds fabric stages, and **each new stage pays this same cost profile**. Eight more waves at
today's grain do not hold 2.4 s. **The optimisation pass is not a polish item to schedule after
W8 — it is a dependency of the waves, because a wave that cannot be measured inside a browser
budget cannot be graded against §220 at all.** Recommend (vetoable): **an explicit performance
wave, sequenced next**, with `q6`/`topoText` key generation and `circuitBandSide`/`accessLaw`
spatial indexing as its named first two items, and a per-wave browser-cost row added to each
wave's receipt exactly as §220 requires.

---

## §6 · THE SEAM WORK, ORDERED BY COST

**1. ⛔⛔ THE ELEMENT-LIST PROJECTION — `fabric → addressable draw list`. LARGEST BY FAR.**
`renderFolio` emits a string; the app needs (a) React elements with `onPointerEnter/Down/Move/Up`
per district and building for hover/pin/drag-edit, and (b) a DrawOp list for `TownMapPlate.jsx` /
`TownMapDocument.jsx` / `townMapPdfExport.js` / the Foundry module / `townMapThumb.js`. **One
artifact serves both.** Mitigations found: the fabric already carries the identity (`parcel.key`,
`landmark.anchorKey/identityKey/instanceKey/districtId`), and the folio uses only primitives
react-pdf already supports (§4.5). Blast radius: 54 files in `src/components/townMap/`, plus
`src/domain/townMap/townMapDraw.js` and the six export consumers.

**2. ⛔ THE PERFORMANCE PASS.** §4.6 / §5. Gates the whole surface under §247.3a. Named first
items: `q6`/`topoText` string keys → numeric quantization; `circuitBandSide` + `accessLaw` →
spatial index; `wallCircuit.contentHash` (8.5 %).

**3. ⛔ THE LOD LADDER.** §220 names *"zoom-level LOD machinery as the pressure valve."* The fabric
already publishes a `lod` field — **unexercised by this spike**. Since the browser is comfortable
(§4.4) and the *build* is not, LOD as specified (far zoom = block masses) attacks the wrong axis
unless it also **truncates the build**, which is a different design. **Raise as a chair question,
do not assume.**

**4. ⚠ OWNER-GATED: the `history.founding.kind` generator mint** (§3.2.4). Written, declared
one-added-key same-seed shift. Without it, `planned` and `charter` plans are unreachable and three
of four settlements draw the wrong morphology.

**5. ⚠ OWNER-GATED: `LAYOUT_LAW_VERSIONS` 1,2 → 1,2,3** (§3.5) — a persistence-dial widening, plus
the mint-dial decision for new settlements.

**6. The dossier adapters, cheapest first.**
 (a) `resourceAnalysis.availableResources` into `readResourceWords` — **one line** (§3.2.2).
 (b) `stressors`: object→catalog-key adapter over `stress.type` + `activeConditions[].archetype`,
     plus a vocabulary reconciliation — **small, but it un-darks the whole §10 arm** (§3.2.1).
 (c) `institutions[].id`, `powerStructure.governingFactionName`, `defenseProfile.walls` — **no
     action**, tolerant chains already resolve (§3.2.5).

**7. ⛔ OWNER-GATED / possibly REFUSED: neighbour bearings** (§3.2.3). Not a rename. The fact does
not exist and minting it is a seed-permanent world fact under THE PROMISE.

**8. The mechanical landing chores, all cheap but all blocking.** `townLayoutV3.mf0.js` →
`townLayoutV3.js` (§3.6.1); rename `tests/fixtures/townMapFixtures.js` → `townMapFabricFixtures.js`
and re-point seven files (§3.6.2); explicit `acorn` devDependency = **a mint trigger** (§3.6.3);
`renderFolio.mjs` moves into `src/` and must be decomposed under 800 effective lines or baselined
(§4.7); `buildFabric.js` sits **4 lines** under its ceiling.

**9. The gate-time budget.** The sandbox suite did not finish in 15 minutes in the app tree
(§4.7). Sequencing, sharding, or fixture-shrinking is owed before it joins the repo gate.

**10. Bundle/chunk placement.** 43 new `src/domain` modules reached through
`src/domain/townMap/index.js` — the standing "a barrel hop drags the whole family" hazard. **Not
measured by this lane**; a build-output measurement is owed.

---

## §7 · WHAT I DID NOT DO, AND WHAT WOULD SETTLE IT

- **No headed-browser measurement on target hardware.** §4.4 is software-raster headless Chromium.
  Settled by: a headed run with `chrome://tracing` or `performance.measureUserAgentSpecificMemory`
  on a real machine, trackpad-driven.
- **No React-pane integration.** I measured the SVG in a bare page, not inside `SettlementMapPane`
  with 54 components and handlers attached. That is item 1 of §6 and cannot be measured before it
  is written.
- **No `mapEdits` / undo / Supabase round-trip through the fabric.** Fresh, `JSON`, and
  `normalizeSettlement` paths are CONFIRMED clean (§2); the edit and undo paths are **untested**.
- **The sandbox's own pins were never seen green in the app tree** (§4.7). Cause unresolved.
- **No bundle-size measurement** (§6.10).
- **The read census is one seed at one tier** (metropolis, `mfint1-metro-01`). A field absent on
  this dossier could be present on another; a different terrain or stressor may reach code this
  run did not. Settled by: re-running `MFINT1-readcensus.mjs` across the tier ladder and unioning
  the dead-read sets.
- **`fabricScars` / `eventLog` / `populationHistory` / `calamityHistory` are Class B** and I did
  **not** treat their absence as a defect (§3.3) — deliberately deferred, documented here so the
  next lane does not re-find them as bugs.

## §8 · ARTIFACTS

All in the session scratchpad root under the `MFINT1-` prefix:

| artifact | what it produces |
|---|---|
| `MFINT1-probe.mjs` | §2's Config A / Config B runs → `MFINT1-out/config{A,B}-rows.json` |
| `MFINT1-readcensus.mjs` | §3's executed read census → `MFINT1-readcensus-metropolis.json` |
| `MFINT1-perf.mjs` | §4.1's 8-seed metropolis sweep → `MFINT1-perf.json` |
| `MFINT1-browser.mjs` / `MFINT1-browser2.mjs` | §4.4 → `MFINT1-browser.json`, `MFINT1-browser2.json` |
| `MFINT1-pdfentry.mjs` / `MFINT1-pdfscale.mjs` | §4.5 (bundle with the repo's `esbuild`, `--format=cjs`) |
| `MFINT1-prof.mjs` | §4.6 (`node --cpu-prof`) → `/private/tmp/MFINT1-prof/fabric.cpuprofile` |
| `MFINT1-out/` | 8 folio SVGs (configA/configB × 4 leaves) + 8 perf-sweep SVGs |
| `MFINT1-baseline-lintbuild.log` | §4.7's pristine-tree gate baseline |
| `MFINT1-odq.md` | the ODQ extract this lane read (`git show refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md`) |

Worktrees `/private/tmp/MFINT1-tree` (pristine) and `/private/tmp/MFINT1-fab` (overlaid) are
disposable — `git worktree remove --force <path>` from any checkout. Both are detached at
`ac243e1c`; neither carries a commit. The main worktree's HEAD is `ab01cbac`, **unchanged from
what this lane observed at its first command**.
