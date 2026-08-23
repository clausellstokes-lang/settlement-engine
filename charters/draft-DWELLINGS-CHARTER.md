# DW-0 — THE DWELLINGS CHARTER

**The build charter for the DWELLINGS PROGRAM (DW).** Compiled by lane TC-DW0
(ODQ §484, chair-tier COMPILE, SOLO) from `docs/DESIGN_DWELLINGS_PROGRAM.md`
(the owner's design document and this charter's parent), from the 2.9 MB
research corpus preserved at `refs/preserve/research-dossiers-2026-08-23` =
`07fbed7b`, from the owner-decision ledger, and from the ENGINE MEASURED BY
THIS LANE at `claude/composite-r4` = `00e7af612d428078634d52ea37054bd00b773ca6`.
Ledger docs read at the ledger tip `62acaebb2334df205ee2459c8b03be947f42782c`
(§495); the chair amendment of §496 (the ESTATE wave) is compiled in.

**Model mark: `[OPUS-RUN · FABLE-VALIDATION OWED]`.**

**STATUS: A CHARTER, NOT AN IMPLEMENTATION.** Not one repo byte was written by
this lane. Every wave below is architected and priced; none is built. Per the
estate's architected-design discipline (§287.16) this document may never be
reported as built. A skeptic lane follows it (§441 J7) before the chair rules
and before the owner sits the bands.

---

## THE FIRST LINE OF THIS CHARTER

**MOST CATALOG ENTRIES ARE NOT BUILDINGS.**

Six research tranches, drawn from six unrelated literatures, kept returning the
same structural answer. A village alehouse is a dwelling's front room. A fence
is a shopkeeper. A market is open ground. On the criminal shelf only 3 of 28
rows get a building of their own, and 11 get no cell anywhere. Across the four
tranches that published a per-entry verdict table, the *building* verdict is a
minority or a bare plurality every time.

The engine today resolves every institution to a template and draws a box —
measured, quoted and cited in §0. **If this charter signed bands assuming an
institution IS a building, the grammar would be wrong for the majority of the
roster in every settlement it draws.** Every vocabulary, contract, pipeline
stage and wave below is measured against that sentence, and §3's three new
relations — `hostedIn`, `NO_BUILDING`, `occupies` — exist for no other reason.

---

## CONTENTS

- **§0 THE MEASURED GROUND** — the base, the engine home table, the three
  parcel worlds and the one chosen, the size-baseline headroom, the flag bill,
  the CH dependency.
- **§1 THE THESIS AND THE NINE LAWS**, each re-stated against the research that
  grounds it and the research that contradicts it.
- **§2 THE CLOSED VOCABULARIES** — partis, room kinds, fixture kinds,
  circulation classes, storage classes, `CompoundMember`, estate members, yard
  fixtures, joints.
- **§3 THE CONTRACTS**, including the three relations the engine lacks.
- **§4 THE DERIVATION PIPELINE**, S1–S9 plus the estate stage S4b.
- **§5 THE WAVES** — DW-1..DW-7, the ESTATE wave, DW-S, priced as cars.
- **§6 DW-S, THE SOAK LEG.**
- **§7 ⭐ THE OWNER'S BANDS** — the sitting document.
- **§8 ANTI-SCOPE.**
- **§9 THE LEDGER** — open questions, single-sourced figures, deferrals,
  judgments.
- **§Σ THE ONE-PAGE SUMMARY** the chair rules from.

## §0 · THE MEASURED GROUND

Everything in this section was read by this lane, in this lane, at the base sha
below. Nothing is a research claim carried forward: where a dossier's engine
claim is now stale it is marked **CORRECTED** and the true reading is given.
The §441 J7 rule governs — a charter's CONFIRMED home is a hypothesis until
someone opens the file, and UC-4 found two wrong homes while UC-2 found five.

### §0.1 · The base

| Thing | Value |
|---|---|
| Engine base (all `src/**` readings) | `claude/composite-r4` = `00e7af612d428078634d52ea37054bd00b773ca6` ("MF-UC2 landing: pay the seventh naked claim…") |
| Ledger/doc base (`docs/**`) | `62acaebb2334df205ee2459c8b03be947f42782c` (§495) |
| Research corpus | `refs/preserve/research-dossiers-2026-08-23` = `07fbed7b` (19 files); scratchpad copies are the working set |
| Parent design doc | `docs/DESIGN_DWELLINGS_PROGRAM.md`, 31,733 bytes, `cmp`-IDENTICAL to the ledger tip's blob |
| Catalog size | **311 rows**, counted by executed `grep -c "desc:"` over `src/data/institutionalCatalog.js` at base — 6 tier blocks, 11 shelf names (Government · Religious · Criminal · Infrastructure · Economy · Crafts · Magic · Defense · Adventuring · Entertainment · Exotic) |

### §0.2 · THE ENGINE HOME TABLE

Read `HOME` as: does the live engine have a typed place for the thing the
charter's law or the research's finding needs? Every row cites the file and the
line this lane read.

| # | Claim under test | Verdict | The measured reading, at file:line |
|---|---|---|---|
| H1 | An interior is derived from the building's parcel polygon | **REFUTED** | `interiorFootprint.js:10` states it in its own header: **"THE MAP'S FOOTPRINT IS A POINT."** `deriveBuildingFootprint` (L102-128) calls `buildTownMapModel` and finds a building by `anchorKey`; a building is a POSITION with `kind: 'landmark' \| 'fill'`. No polygon is read anywhere in `src/domain/interior/`. |
| H2 | Law 6 — orientation is READ off the parcel's street frontage, never guessed | **REFUTED** | `interiorFootprint.js:122` — `entranceSide = cardinalSide(centroid.x − building.position.x, centroid.y − building.position.y)`, i.e. the dominant axis of the vector to the DISTRICT CENTROID. `cardinalSide` is L56-59. A building with no map row falls to `SIDE_SOUTH` (L116). The street is never consulted. |
| H3 | Law 2 clamp (b) — no interior exceeds its exterior | **REFUTED** | `footprintSizeFor` (`interiorFootprint.js:80-86`) is `templateOf(kind).baseCells × widthRatio/depthRatio × tierScale(tierIndex) × prosperityScale(prosperity01)`, clamped to `MIN_CELLS 4 … MAX_CELLS 30` (L41-42). Geometry is not an input. There is no exterior to exceed. |
| H4 | A building has exactly ONE entrance (R-INST-6 gap E2) | **CONFIRMED** | `interiorModel.js:276` pushes exactly one `kind: 'entrance'` door; `L353` `const rot = (footprint.entranceSide + 2) & 3` rotates the whole canonical frame to that one side. A second, subordinate entrance is inexpressible. |
| H5 | Law 9 — storeys are a partition of the massing height envelope | **REFUTED — there are no storeys at all** | `InteriorModel` (`interiorModel.js:181-186`) is `{ interiorVersion, seedFork, meta, bounds, rooms[], walls[], doors[], furnishings[] }`. There is no `storeys[]`, no floor index on `InteriorRoom` (L160-164), and no height anywhere. The model is one flat plan. Law 9 has NO home. |
| H6 | The interior vocabulary is closed and small | **CONFIRMED, with counts** | `interiorTemplates.js:29-31` **8** `INTERIOR_KINDS`; `L35-46` **28** `ROOM_KINDS`; `L50-54` **22** `FURNISHING_KINDS`; `L86-152` **8** `TEMPLATES`; `L162-167` **4** `FUNCTION_VARIANT_ROOM` keys (`heals`/`feeds`/`arms`/`judges`). |
| H7 | `ROOM_KINDS.stall` is live | **REFUTED — it is DEAD vocabulary** | `'stall'` appears at `interiorTemplates.js:38` and, by `git grep "'stall'" claude/composite-r4 -- src` executed this lane, **nowhere else in `src/`**. No template names it; `interiorModel.js` never emits it. R-INST-2 §1.3 flagged the NAME as wrong (a stall is the market fixture, a shop is a room); the measured fact is stronger — the member has no producer at all. |
| H8 | `evidence` and `concealed` are template rooms | **CORRECTED** | Both are `ROOM_KINDS` (`interiorTemplates.js:44-45`) but neither appears in `TEMPLATES`. `evidence` is pushed by `interiorModel.js:221` when a corruption impairment is REVEALED; `concealed` by `L340` when one is COVERT and `publicSafe !== true`. They are model-level, not template-level. |
| H9 | The concealed cell is SUBTRACTED from a declared volume (R-INST-6 §Σ.1 law 9) | **CORRECTED — it is nested, not subtracted** | `interiorModel.js:335-340` sizes the concealed room at `clamp(round(host.w × 0.5), 40, host.w − 16)` by the same in `h`, and pushes it as a NEW room *overlapping* the host. The host's own `w`/`h` are never reduced and `meta.roomCount` (L402) excludes covert rooms. So the nesting is real and the priest-hunter arithmetic the research wants — every concealed cell debits its host's area, and S9 checks the sum — is **not** implemented. R-INST-6's "already does this" overstates it. |
| H10 | `FACET_INFERENCE` keywords are unanchored (R-INST-5 G1) | **CONFIRMED, and the citation is CORRECTED** | R-INST-5 cited `cohesionWeave.js` L258-276. At base the table is **L258-292**, with `institutionNature` at **L260-268**. The bare alternatives are real: `security` L262 carries `fort` (catches "**fort**une"); `vice` L266 carries `den` (catches "War**den**'s", "resi**den**t"); only `civic` L267 anchors anything (`/\bhall\b/`). |
| H11 | `trade` is tested BEFORE `vice`, so `guild\|market\|bazaar` wins (R-INST-6 §Σ.3) | **CONFIRMED** | `cohesionWeave.js:263` (`trade`) precedes `L266` (`vice`); `inferFacet` L315-322 returns on FIRST match over `name + ' ' + type + ' ' + category`. An assassins' guild therefore resolves `trade`. |
| H12 | `institutionSubstructure` is only at `refs/preserve/holding-uc2` | **CORRECTED — it is LANDED at base** | `cohesionWeave.js:285-291`, five rows (`none`/`sewer`/`mine`/`crypt`/`cellar`). R-INST-6 §Σ.3's provenance note reads it at the holding ref; that ref is superseded. |
| H13 | UC-2 `monotoneComponents.js` is BUILT AND HOLDING, not landed (R-INST-6 §Σ.5) | **CORRECTED — LANDED** | `src/domain/undercity/monotoneComponents.js` exists at base, 636 lines / 247 effective; landed by `42d3e4b1`. The base sha itself is the UC-2 landing commit's descendant. **Every "holding" clause in R-INST-6 §Σ.5 is stale.** |
| H14 | UC-5 `connectivity.js` does not exist at any ref | **CONFIRMED** | Absent from `git ls-tree -r claude/composite-r4 src/domain/undercity`; `git log --all --oneline --diff-filter=A -- src/domain/undercity/connectivity.js` returns zero rows. Three seam rows in R-INST-6 §Σ.5 depend on it. |
| H15 | The joint vocabulary is five members and closed | **CONFIRMED** | `jointVocabulary.js:27` `['grate','stair','sealed_door','sluice','breach']`; `L30` four `TEMPERAMENTS`. All five are ground-or-below: there is no ROOF joint (R-INST-6 E13) and no WATER-LANDING joint (E16). |
| H16 | `frontFor(seed)` already returns the canonical institution key | **CONFIRMED** | `colonization.js:365-370` — `{ kind: 'INSTITUTION', anchor: seed.anchor, name: seed.name }` when the seed has an anchor, else `{ kind: 'ANONYMOUS_FABRIC', anchor: null, name: null }`. §16 carry-note 1 (graph rows stay per-building addressable) is therefore **already satisfied**; DW law 7 is a lookup on that anchor, not a new derivation. |
| H17 | `CartographyParcelRow` carries a real polygon (§495) | **CONFIRMED** | `cartographyParcels.js:69-71` — `{ id, wardId, polygon: PlanPoint[], anchor: PlanPoint, provenance, decidedBy }`. |
| H18 | Containment is a theorem with no repair loop (chair R2', §497) | **CONFIRMED VERBATIM** | `cartographyParcels.js:11-20` — "there is no clipping, no jitter, no overlap repair and no 'try again with a smaller box' anywhere in this file". `cartographyBuildings.js:19-20` repeats it for the packing leaf. |
| H19 | A parcel has a derivable STREET FRONTAGE edge today | **CONFIRMED — and this is new** | `cartographyParcels.js:108` — `const polygon = [[centroid[0], centroid[1]], cuts[segment], cuts[segment + 1]]`. Vertex 0 is the ward centroid; vertices 1 and 2 are consecutive cuts of ONE ward-boundary edge (L95-105, each edge split into `PARCEL_EDGE_DIVISIONS = 3`). **The wedge's outer edge IS a third of the ward's own perimeter — the side the street runs along — so a frontage LENGTH is computable from the row that exists today, with no new geometry.** No code reads it yet. |
| H20 | A building knows its parcel | **CONFIRMED** | `CartographyBuildingRow` at `cartographyBuildings.js:73-76` carries `parcelId`; `InstitutionParcelBinding` at `cartographyParcels.js:72-73` carries `{ institutionRef, anchorKey, parcelId, placement, decidedBy }`. §495's "same property iff they share a `parcelId`" holds. |
| H21 | At most four buildings fit a parcel | **CONFIRMED, and it is a theorem** | `cartographyBuildings.js:118-141` `packFootprint` takes the MEDIAL SUBDIVISION `[v0,m01,m20] [v1,m12,m01] [v2,m20,m12] [m01,m12,m20]`; `cartographyTuning.js:273-277` states "<= 4 ALWAYS" and bands it per tier `{thorp 1, hamlet 2, village 2, town 3, city 4, metropolis 4}`. |
| H22 | The shrink ladder is fixed, not a retry | **CONFIRMED** | `cartographyBuildings.js:127` `for (let step = 0; step < 3; step++)` over `FOOTPRINT_SHRINK_PERMILLE {large 660, medium 540, small 420, dwelling 300}` minus `FOOTPRINT_SHRINK_STEP 160` per step, floored at `120` (`cartographyTuning.js:287-289`). Returns `null` when no rung is contained. |
| H23 | Vertical exists on the map | **PARTIALLY — one permille, no storeys** | `CartographyBuildingRow.heightPermille` (`cartographyBuildings.js:74`); `DWELLING_HEIGHT_PERMILLE` per tier `{100,120,140,180,220,260}` (`cartographyTuning.js:284-286`); `HEIGHT_PLAN_CEILING: 60` (L290). There is no storey count anywhere in the cartography block. |
| H24 | A WEAR ladder already exists and is derived | **CONFIRMED** | `conditionOf` (`cartographyBuildings.js:151-162`) is a FIRST-MATCH chain `ruined → burned → damaged → worn → pristine → sound` over `CONDITION_THRESHOLDS` (`cartographyTuning.js:293-297`), read off the building profile's `abandonment / warScar / occupation / neglect / repair / construction` plus `agePermille`. Its header warns the ORDER is load-bearing. This is the engine's existing home for chair ruling R5's wear ladder. |
| H25 | The painter's op count is a bare list a layer can be inserted into | **CORRECTED — it is a length IDENTITY, and a new op breaks it** | `cartographyPaint.js:15-17`: `ops.length === wards.length + streets.arterials.length + streets.lanes.length + buildings.length`, and L19-21 says plainly "`parcels[]` emits no op — a parcel is a placement SLOT, not a drawn thing". §495.4(a) calls MP-1's parcel op "an INSERTION, not surgery": true of the ORDERING, **false of the identity**. MP-1 (and DW-6 after it) must move that identity and every test that pins it. Named here so MP-1 prices it. |
| H26 | The fabric first slice has real frontage-first plots | **CONFIRMED, and it is a reference artefact** | `frontage.js:38-57` `plotWidths(widthQ, floorQ, variationQ)` cuts a street width into plots of a floor width with an alternating variation weight; `FRONTAGE_AXIS_KEYS` L19-21 are `emptinessQ, gridChaosQ, sizeFloorQ, sizeVariationQ`. But `parcelRegistry.js:1` says "Reference-only plot/frontage/DCEL-face bindings for **the admitted cross**", plot `edgeIndex` is bounded `0..3` (L73), and `massingRoster.js:1` says "Transitional reference roster for **two explicit first-slice building masses**." |
| H27 | Prosperity reaches the interior as a rich signal | **REFUTED — three buckets** | `prosperityScore` (`interiorModel.js:79-87`) regex-matches a label to **0.9 / 0.5 / 0.2**, default **0.5**. Furnishing density is `clamp(2 + round(prosperity01 × 3) + faithBump, 1, 8)` (L315). The cartography stage has a much richer `PROSPERITY_RANK` 0..6 (`cartographyTuning.js:258-262`) that the interior never sees. |
| H28 | `src/domain/**` has a hard per-file size ceiling | **CONFIRMED** | `eslint.config.js:556-558` — `files: ['src/domain/**/*.js']`, `'max-lines': ['error', { max: 800, skipBlankLines: true, skipComments: true }]`. `src/data/**` carries no such rule (which is why the 2,464-effective-line catalog passes). |

**Tally of the home table, counted off the rows above rather than from memory:
28 rows — 16 CONFIRMED (one of them, H10, confirming the finding while CORRECTING
its citation), 5 CORRECTED, 6 REFUTED, 1 PARTIAL. 16 + 5 + 6 + 1 = 28. Closes.**

### §0.3 · THE THREE PARCEL WORLDS, AND THE ONE DW BUILDS ON

The brief asked which of two parcel worlds DW builds on. Measurement finds
**three**, and naming the third is the point.

| World | What it is | Wired to | Verdict for DW |
|---|---|---|---|
| **(A) The town-map POINT model** (`townMap/townMapModel.js` via `interiorFootprint.js:109`) | Buildings as positions with `kind: 'landmark' \| 'fill'`; districts with centroids. No polygons. | The live interior stack — this is what `buildInteriorModel` reads today | **Leave.** It is why H1/H2/H3 are REFUTED. DW cannot honour laws 2, 6 or 9 on a point. |
| **(B) The CARTOGRAPHY SYNTHESIS stage** (`src/domain/townCartography/*`) | Wards → centroid triangle fans → parcels with `polygon` → footprints packed by medial subdivision, all inside the `TownSceneManifest` | `compileTownSceneManifest.js`, `townCartographyBlock.js`, `MapCartographySubTab.jsx`, `useTownCartographyBlock.js` — **live and drawn** | **BUILD ON THIS.** |
| **(C) The FABRIC first slice** (`src/domain/townMap/fabric/*`) | An exact-geometry, DCEL-backed, frontage-first subdivision with a sealed coordinate ABI | Only the orthogonal-cross reference settlement; `massingRoster.js` emits **two** explicit masses; imported outside `fabric/` by four modules, none of them a settlement's building stock | **Borrow its LAW, not its data.** |

**The choice, and the reason, stated so a skeptic can attack it.** DW-2 builds
on **(B)**. Four grounds, each measured:

1. **(B) is the only world that has a parcel for every building of every
   settlement.** (C) has two masses on one synthetic plan (H26). (A) has no
   parcels.
2. **(B) already gives DW the three facts the laws need**: a polygon (H17), a
   building→parcel key (H20), and — the finding this lane adds — a computable
   **frontage edge** (H19).
3. **(B)'s containment is a theorem, not a loop** (H18, H21, H22). Chair ruling
   R2' (§497) preserves that theorem by construction: the ESTATE wave chooses
   and UNIONS candidate wedges *before* geometry is drawn, and never repairs a
   drawn shape. Selection and union introduce no clipping, no jitter and no
   retry.
4. **(C)'s frontage law is right and (B)'s shape is wrong**, and the honest
   resolution is to move the LAW not the DATA. §495.5(1) already says the wedge
   is not a burgage plot. DW-2 therefore ports the *concept* `frontageBucket`
   from (C)/Pantin onto (B)'s measured wedge edge, and does **not** attempt to
   make (B) produce narrow-deep strips — that is a fabric re-shape, outside DW
   (§8).

**The honest cost of the choice, stated up front.** A fan wedge is a triangle
whose frontage is a third of a ward edge and whose depth runs to the ward
centroid. Real burgage plots are narrow and deep with a party wall each side.
DW's frontage buckets will therefore be *measured on a shape the historical
record never produced*. This is the charter's largest single fidelity
compromise and it is why §7 band B3 exists: the owner signs the frontage
buckets knowing the shape they are measured on.

### §0.4 · SIZE-BASELINE HEADROOM FOR EVERY FILE DW WOULD TOUCH

`scripts/.size-baseline.json` holds **10 non-comment entries** at base and
**not one of them is a DW file**. The baseline lists only files already over
their layer ceiling; a file under it is governed by the layer rule directly.
So the headroom for every DW-relevant file is `800 − effective` (`src/domain`),
computed by this lane with `$SP/DW0-eff.mjs` (an eslint-equivalent
skipBlankLines+skipComments counter, run against the base blob).

| File | eff | raw | ceiling | headroom | note |
|---|---|---|---|---|---|
| `src/domain/interior/interiorModel.js` | 249 | 438 | 800 | **551** | the whole plan model |
| `src/domain/interior/interiorTemplates.js` | 124 | 220 | 800 | **676** | the vocabularies live here |
| `src/domain/interior/interiorFootprint.js` | 56 | 136 | 800 | **744** | the envelope law |
| `src/domain/interior/interiorExport.js` | 53 | 145 | 800 | **747** | UVTT walls (the Foundry seam) |
| `src/domain/interior/index.js` | 21 | 38 | 800 | **779** | barrel |
| `src/domain/spatial/cohesionWeave.js` | 148 | 348 | 800 | **652** | CH-1's file — see §0.6 |
| `src/domain/townCartography/cartographyParcels.js` | 190 | 348 | 800 | **610** | |
| `src/domain/townCartography/cartographyBuildings.js` | 229 | 406 | 800 | **571** | |
| `src/domain/townCartography/cartographyPlan.js` | 59 | 121 | 800 | **741** | |
| `src/domain/townCartography/cartographyWards.js` | 191 | 343 | 800 | **609** | |
| `src/domain/townCartography/cartographyPaint.js` | 143 | 256 | 800 | **657** | H25's identity lives here |
| `src/domain/townCartography/cartographySynthesis.js` | 242 | 421 | 800 | **558** | the stage wiring |
| `src/domain/townCartography/cartographyTuning.js` | 143 | 361 | 800 | **657** | where owner bands would land |
| `src/domain/undercity/jointVocabulary.js` | 8 | 41 | 800 | **792** | |
| `src/domain/undercity/colonization.js` | 232 | 543 | 800 | **568** | |
| `src/domain/undercity/strataExistence.js` | 110 | 282 | 800 | **690** | |
| `src/domain/undercity/monotoneComponents.js` | 247 | 636 | 800 | **553** | landed (H13) |
| `src/domain/undercity/staticComponents.js` | 111 | 309 | 800 | **689** | |
| `src/domain/undercity/sewerDerivation.js` | 209 | 516 | 800 | **591** | |
| `src/domain/highWater.js` | 104 | 285 | 800 | **696** | law 5's decline input |
| `src/domain/display/calamityLedger.js` | 34 | 78 | 800 | **766** | |
| `src/domain/townMap/fabric/parcelRegistry.js` | 216 | 245 | 800 | **584** | reference only |
| `src/domain/townMap/fabric/frontage.js` | 226 | 268 | 800 | **574** | reference only |
| `src/domain/townMap/fabric/massingRoster.js` | 169 | 188 | 800 | **631** | reference only |
| `src/data/institutionalCatalog.js` | 2464 | 2527 | *(none)* | *n/a* | `src/data/**` has no max-lines rule (H28) |

**Reading.** No DW file is anywhere near its ceiling, so the
exact-ceiling hazard (a file at its number refusing one line) **does not bite
this program at any file it would touch**. The binding constraint on DW's car
sizes is therefore the estate's packet law (≤3 production files, a leaf ≤250
effective), not eslint. Two files deserve a watch: `interiorModel.js` (249 eff)
and `cartographySynthesis.js` (242 eff) are the ones DW would grow most, and
both are already at the 250-effective *leaf* line even though they are 551 and
558 under the eslint ceiling. **DW-2 must therefore land its geometry core in
NEW leaves beside `interiorModel.js`, not inside it.**

### §0.5 · THE FLAG BILL, IF ANY WAVE MINTS ONE

The estate's virtual-flag mint costs **SIX test-visible surfaces**, not four
and not five (§489 + the UC-4 landing):

1. `src/domain/worldPulse/simulationRules.js` — one
   `ENGINE_GATED_VIRTUAL_RULE_KEYS` row at its ALPHABETICAL position. This file
   is an input of `aiCharterBundle` and `aiOutputSchemaBundle`, so
   `npm run build:edge-shared` runs **in the same commit** (2 bundle `.js` +
   all 5 metas) and `tests/edgeFunctions` joins the sweep.
2. `src/domain/certification/subsystemRowsVirtual.js` — the AUTHORED row.
3. `tests/domain/subsystemRowsVirtual.test.js` — THREE module-scope edits (the
   const, the `VIRTUAL_RULES` member at its authoring-order position, the
   `LANE_LEAVES` entry). Zero new titles.
4. The acceptance file must contain the LITERAL `<flag>: true`
   (`tests/property/mechanismLitCoverage.test.js` greps for it).
5. `tests/domain/contributionLedgerShape.test.js` — two `toHaveLength(N)`
   literals; **rename** the `it` title (`at N` → `at N+1`), never add one.
6. `tests/soak-harness/coveringArrayCoverage.test.js` — three flag-registry
   figures moving in lockstep while four others must not.

**Ruling for this charter: the DW program mints exactly ONE flag, at the
ACTIVATION wave (DW-7a), and no other wave mints any.** DW-1..DW-6 and the
ESTATE wave land DARK behind the existing projection surfaces and need no
engine gate, because nothing they emit is read on the generation path (§6's
purity argument). One flag, one bill of six, paid once, priced in §5. Any wave
that finds itself wanting a second flag has mis-scoped: fold it behind the same
one.

### §0.6 · THE CH DEPENDENCY — CATALOG TYPING IS CHANGING UNDER THIS CHARTER

CH-1/2/3 (ODQ §491.1) are being chartered in the other seat **right now** and
land **before DW-0's waves build** (§491.3's sequence: UC-2 → R-INST-6 → CH-1/2/3
→ DW-0 → DW waves). They change facts this charter would otherwise bake in:

| CH car | What it changes | What this charter must therefore NOT do |
|---|---|---|
| **CH-1** | `\b`-anchors every `FACET_INFERENCE` keyword; adds an explicit per-entry **`interiorKind` override** so a NAME is never the only evidence; adds a walker asserting no catalog name matches more than one rule | Never cite a *current* facet resolution as a durable fact. Every R-INST-5 G1 and R-INST-6 §Σ.3 mis-inference (`Warden's Lodge`→vice, `Dragon resident`→vice, `Charlatan fortune tellers`→security, the six `guild\|market\|bazaar` rows, every inn→generic) is **expected to be gone** at DW-1's base. DW reads `interiorKind` where declared and `facetOf` only as the fallback CH-1 leaves it. |
| **CH-2** | A declared per-entry **`magicLicense: NONE\|LOW\|MEDIUM\|HIGH`** over the 32 Magic/Exotic rows; the three shelf-as-gate paths read the license, not the shelf | R-INST-5's request R13 is **satisfied by CH-2, not by DW**. §2 lists `magicLicense` as a CONSUMED input, never a DW-minted vocabulary. DW-2's `clearSpan: EXTREME` bucket reads it. |
| **CH-3** | The five `minTier: 'metropolis'` rows authored in the CITY block; `religiousCenter` exclusivity at city tier; two `priorityCategory`/prose slips; three "Eberron" strings | No tier-conditional in this charter may be derived from a *current* `minTier`. R-INST-6's D6-1 (`Smuggling network` village row carrying `minTier:'city'`) is a CH-3 item, not a DW item. |

**The dependency, stated as a gate:** *DW-1 may not open until CH-1/2/3 have
landed.* If the chair reverses that order, DW-1's vocabulary car must be
re-priced, because the `interiorKind` override CH-1 mints is the exact hook
`hostedIn` and `NO_BUILDING` attach to (§3).

**One thing DW owes back to CH, found by this lane and not by the research:**
`ROOM_KINDS.stall` has no producer (H7). It is not a CH car — it is dead
vocabulary inside `src/domain/interior/`, so DW-1 removes it as part of the
vocabulary car and declares the (nil) shift.

## §1 · THE THESIS AND THE NINE LAWS, RE-STATED AGAINST THE RESEARCH

### §1.0 · The thesis, unchanged and now defensible

Every building the map shows becomes, on first click, a floor plan that can
EXPLAIN ITSELF: derived from facts the world already holds, contradicting no
other surface, inventing nothing. Immersion defined structurally — the absence
of contradiction plus the presence of time.

The research does not weaken the thesis. It sharpens one word in it:
*building*. The thesis must read **"every INSTITUTION the map shows resolves,
on first click, to an honest account of where it happens"** — because for most
of the roster that account is a room in someone else's house, a fixture on open
ground, or a reasoned absence. A charter that promises a plan per building
promises the wrong artefact for the majority of the 311 rows.

### §1.1 · The nine laws, one row each

For each law: what grounds it, what CONTRADICTS it, and the compiled form this
charter signs.

---

**LAW 1 — FUNCTIONS, NOT ROOMS.**

*Grounded by* the strongest convergence in the corpus. R-INST-6 §Σ.1: "nearly
every criminal function occupies a room built for something else" — the hide is
a book cupboard's three walls, the holding cell a victualler's strong-room, the
trading floor a converted tavern. R-INST-5 §Σ.1: the Tower mews became a stable
in 1548 with no change to the building — one requirement roster, two occupants,
ninety years apart. R-INST-2 §1.1, quoting Salter through Pantin: "a shop in
those days was a workshop, not a store". R-INST-4 §Σ.1: the floor is a function
on a host in nine of thirteen families.

*Contradicted by* nothing. This is the only law of the nine the research
strengthens without qualification.

*Compiled form.* Law 1 stands, with **one corollary the research supplies and
the parent document lacks: a function may be satisfied by a cell it did not
cause.** The requirement roster's satisfaction step must accept an existing
cell as a match and RECORD which function caused the cell and which merely
occupies it — because the two behave differently under law 3's shedding
(R-INST-6 §Σ.1). This is the `occupies` relation of §3.

---

**LAW 2 — THE THREE-CLAMP CEILING** (institution ceiling · parcel/massing ·
settlement economy).

*Grounded by* measured economic anchors in every tranche: Coventry 1520 — 6,601
citizens, 43 bakers, 68 brewers (R-INST-2); Southampton 1603 — 69 drinking
houses for 4,200 people (R-INST-4); Devon 1577 — 120 inns, 40 taverns, 400
alehouses (R-INST-4).

*Contradicted, three ways, each independently.* (i) **R-INST-3 §Σ.1 breaks
clamp (c) outright**: Munich's hall for 20,000 in a town of 13,000; a cathedral
licensed by a SEE in a village of 1,751 people. The faith building
out-prospers its town by ENDOWMENT. (ii) **R-INST-5 §Σ.1 breaks the whole
frame** with the airship shed: 55.3 m clear width beyond any pre-industrial
construction — the binding constraint is not the institution, the parcel or the
economy but STRUCTURE. (iii) **R-INST-6 §Σ.1 adds TOLERANCE**: a dominant
syndicate in a rich metropolis that is hunted builds nothing.

*Compiled form.* **Three clamps stay three, and each gains a named input rather
than becoming a fourth clamp.** Clamp (a) `institutionCeiling` reads
`toleranceOf(practice)` (R-INST-6's recommendation; the inputs — corruption,
watch, power structure, syndicate standing — all exist). Clamp (c) gains an
`endowed: true` ESCAPE VALVE, owner-gated, that lifts the economic clamp for a
foundation whose money comes from outside the settlement (R-INST-3, R-INST-4
items 14). And a **`clearSpan` bucket** with an `EXTREME` member is licensed by
CH-2's declared `magicLicense` — R-INST-5's exact formulation, and the best
line in the corpus: *the rooms stay the same and the spans change*.

---

**LAW 3 — THE FLOOR IS EXISTENCE.**

*Grounded by* the number that defines this program. Counted off the tranches'
own verdict tables: R-INST-6 — 11 of 28 rows NO_BUILDING at every tier, 3 of 28
a building of their own. R-INST-2 — "roughly thirty of the 124 entries have NO
BUILDING at the floor", four of them catalog REQUIRED rows. R-INST-4 — 14 of 40
NO_BUILDING or HOSTED at every tier, including two REQUIRED rows. R-INST-3 —
NO_BUILDING or HOSTED almost everywhere below town. R-INST-5 — 3 outright
NO_BUILDING plus 14 HOSTED floors.

*Contradicted by* the engine, not by the record: measured at §0 H1–H6, an
institution always resolves to a template and always draws a box.

*Compiled form.* **A zero-cell floor is a lawful, expressible, projectable
state.** S9's walker must certify a plan with zero cells, and a plan with zero
STORAGE cells, as LAWFUL with a stated reason (R-INST-5 §Σ.1's validator
requirement) — otherwise the generator invents a hut for a stone circle and a
pantry for a golem shed. And, per chair ruling **R2′ (§497)**, this floor is
never *reached* because geometry ran out: **`NO_BUILDING` and `hostedIn` are
selected by the TIER'S OWN TRUTH.** The hamlet's wayside inn genuinely IS a room
above a stable; the village alehouse genuinely IS a dwelling with a brewing
outshut. Those are different minimums, not shrunken town inns.

---

**LAW 4 — DERIVE, DON'T STORE.**

*Grounded by* R-INST-6 §Σ.1's audit: "Not one of this dossier's proposed dials
needs a stored byte" — every criminal fact is derivable from
`corruption.js`'s criminal share, `colonization.js`'s syndicate standing,
`defenseProfileHasWalls`, `tradeRouteAccess` and the licit roster.

*Contradicted by* nothing, but **extended by R-INST-4 §Σ.1 in a way the parent
document does not anticipate**: a HOSTED institution derives through a host that
itself derives, so the pure function is of `(worldSeed, HOST buildingId,
circumstances)` and **the stable key belongs to the HOST, not to the guest**.
Fourteen of forty entries in that tranche resolve into a keeper's dwelling, a
patient's chamber or a palazzo wing. If the alehouse's drink-room does not land
in the same cell of the same house on every derivation, law 5's renovation
reading breaks one level down.

*Compiled form.* Law 4 stands. **Two additions.** (1) The stable-anchor key for
a hosted function is `(hostBuildingId, functionKind, ordinal)`, never the
guest's own id. (2) `circumstancesSnapshot` gains a **time member** —
time-of-day and tide — because four joints in R-INST-4 vary within a day (the
stew's timetabled lock; the Fuggerei's 22:00 gates; the Longhouse's tide; the
Hope's trestle stage) and are otherwise underivable. Time-of-day is an INPUT to
a pure derivation, not stored state; THE PROMISE is untouched.

---

**LAW 5 — STABLE ANCHORS.**

*Grounded by* a very large dated-event corpus. R-INST-5's furnace NICHE (a
countable, dateable subdivision of wall thickness whose blocking records the
year a process stopped) is called the best fossil in the corpus. R-INST-3's set
is the richest: the socket stone without its shaft, the piscina in a cottage,
the rood stair in a pier, the truncated library over the walk. DWR1A names the
churn ranking from two recorded corpora: **insert-stack ≈ insert-floor > cross
wing ≈ outshut > raise eaves > add bay > stair turret ≈ reface**, and
identifies the hall bay as the churn hotspot.

*Contradicted by* nothing, and **corroborated across the strata seam**:
R-INST-6 §Σ.1 finds that the criminal register's characteristic fossils are
*exactly* UC-4's `FOSSIL_KINDS = ['abandoned','sealed','flooded']`.

*Compiled form.* Law 5 stands and gains four things. (1) **ONE fossil
vocabulary, imported from `colonization.js`** — DW mints no parallel enum.
(2) Two new fossil kinds the corpus forces: the **blocked recess** and the
**fixture that moved** (R-INST-5). (3) A **`reclassedTo[]` dated LIST with
named causes** — bath → brothel / tannery / laundry → dwelling; arena →
fortress → 200 houses → chapels → quarry; the 1,500-year chain is the stress
case (R-INST-4 item 18). (4) The **churn ranking above becomes the shedding and
renovation order's prior**, so a renovation draw is not uniform over kinds.

---

**LAW 6 — FRONTAGE FROM THE PARCEL.**

*Grounded by* Pantin, and this is the law's most useful number: the extended
parallel-hall parti "needs a fairly large frontage, of say 30 to 50 feet"
(R-INST-2 §3, CONFIRMED-primary from the ADS PDF), against shop widths of
6–10 ft. **Frontage decides which parti is even eligible.** That is chair ruling
R1, and it is measured, not asserted.

*Contradicted — and this is the law that takes the most damage.*
(i) **It INVERTS for a precinct**, reached independently by two tranches:
R-INST-5 §1.5 (five instances — collegiate court, teleport chamber, moated
lodge, fondaco, Tower menagerie) and R-INST-6 §15.2 (four more cultures —
fondaco, han, huiguan, galleried inn). Both recommend the same thing in the
same words: **a parti may declare `entrances: 1`, and when it does the COURT is
the frontage surface for every cell but the gate.**
(ii) **Faith buildings are oriented by AXIS, not by street** (R-INST-3 §Σ.1) —
east, the solstice, the meridian, the orientation wall. Law 6 needs an
`orientedAxis` override for that institution class.
(iii) **A second frontage of unequal status is required** (R-INST-6 E2 and
family E's `SIDE_DOOR`): the whole two-plan building depends on it.
(iv) **The owner's own wording is corrected by the research.** DWR1A ran a
negation search and reports the frontage-TAX causation UNSUPPORTED; the real
driver is frontage VALUE under a fixed per-plot rent (ODQ §442.3/§464.1). The
parent document already carries the correction at §15 P1a; it is restated here
because it is the fifth tranche correcting the owner's phrase and a successor
should not re-import the folk story.

*Compiled form.* **The frontage reader returns an ORDERED LIST of frontages,
each with a KIND and a STATUS GRADE**, not a single primary. Kinds, closed
(R-INST-5's R8 union R-INST-2's gaps 6/7 union R-INST-4's two):
`OPEN_SHOPFRONT · DOOR · GATE_PASSAGE · COURT · CAUSEWAY · TRANSPORT_EDGE ·
WATER_EDGE · COVERED (arcade/Laube/portico) · LIBERTY_BOUNDARY · ORIENTED_AXIS`.
Corner-lot handling already contemplates picking a primary from a hierarchy, so
this is an extension of an existing idea rather than a new one. The measured
frontage EDGE exists today (§0 H19).

---

**LAW 7 — BASEMENTS ARE THE UNDERCITY'S PROJECTION.**

*Grounded by* R-INST-6 §Σ.5's row-by-row seam table, and by the single cleanest
finding in that dossier: **the dominant joint is one kind at one anchor —
`stair` at "cellar door", in eleven of twenty-eight rows.** The seam is one
line, not a subsystem.

*Contradicted by* nothing, but **narrowed twice**. (i) The criminal shelf is
almost entirely a TENANT of the underground: 3 of 28 rows seed, all three the
same `Underground network` row. A criminal building's basement is the projection
of a seed a LICIT institution planted — which is precisely what
`colonization.js`'s `frontFor(seed)` already resolves (§0 H16). (ii) The
DOWN-STAIR DIAGNOSTIC (CIRC §3 C11): a keep's in-plinth store is NOT a cellar
and is law-7 EXEMPT; a gaol dungeon "down eleven steps" is a room. The test is
whether a stair descends from grade.

*Compiled form.* Law 7 stands. **DW's per-building query is a lookup on
`frontFor(seed).anchor`, never a re-derivation.** The DOWN-STAIR DIAGNOSTIC is
the licensing test. And an honesty clause the seam table forces: **until UC-5
lands, DW may draw COMPONENTS under a building but may NOT draw ROUTES between
them**, and the projection must say so rather than implying connectivity
(R-INST-6 §Σ.5 reading 4; §0 H14). R-INST-5 adds one physical refusal worth
keeping: a raised MADE PLATFORM (a moat's spoil) argues against a cellar, and
the graph should not anchor one under made ground.

---

**LAW 8 — THE PARTI DRAW.**

*Grounded by* an enormous measured catalog — every tranche delivered one, and
§2.1 de-duplicates them.

*Contradicted, four ways.* (i) **A parti may WRAP another parti**
(`TWO_PLAN_FRONT`; R-INST-6 E5) — the §5 contract cannot express it.
(ii) **Three entries are ZONINGS, not buildings** (`Alchemist quarter`,
`Mages' district`, district-shaped `Planar traders`) and two are **PRECINCTS**
— several buildings, one institution, one parcel (R-INST-5 §Σ.1). "Drawing a
zoning as one large building is the single most visible error the DW generator
could make." R-INST-3 adds the precinct independently (72 buildings at Rievaulx
in 1538). (iii) **The COMPRESSION law** (R-INST-6 §1.6): an ideal ordered
function sequence poured into a host's available cells, surplus stations
collapsing — a primary source describes exactly this. (iv) **Partis are not
free-standing shapes; they are answers to a PROGRAM** — chair ruling R2′(c).

*Compiled form.* Law 8 stands, with `PartiModifier` (the wrap), `zoning` and
`precinct` as institution kinds beside `building`, a `compressible: true` flag
on an ordered function sequence, and — R2′ — **the draw is filtered by
`programMinimum` and by the allocated envelope's frontage bucket BEFORE weights
apply.** Variety is then a consequence of the program admitting many shapes, not
of a wider dice roll.

---

**LAW 9 — VERTICAL HONESTY.**

*Grounded by* the corpus's best vertical evidence: R-INST-1's **civic STACK** —
"a ground floor that EARNS or CONTROLS under an upper floor that GOVERNS", with
the archive in the most fire-proof least-accessible cell and the bell in a
tower, CONFIRMED across England, Scotland, Germany, Italy, the Low Countries and
Flanders. R-INST-2's warehouse as N identical STORE floors with an external
hoist. R-INST-5's `ONE_CELL_PER_STOREY` tower, where the vertical partition is
not a division of a height envelope but the organising FORM, with the stair in
4.15 m of wall thickness. R-INST-4's Fortune contract: storeys of **12 / 11 /
9 ft** (3.66 / 3.35 / 2.74 m) — descending, because the cheapest seats are
highest.

*Contradicted by* the engine, totally: §0 H5 — the interior model has no
storeys, and §0 H23 — the map has one `heightPermille` and no storey count.
**Law 9 has no home at either end.** And R-INST-4 supplies the inversion the
law's own wording assumes away: storey height falls with status in the
playhouse and the inn (the worst bed is over the gate), so "the piano nobile"
is one convention among several, not the rule.

*Compiled form.* Law 9 stands and is the most expensive law in the program.
Three carriers: a **vertical parti class whose cell count IS the storey count**
(R-INST-5); a **`privacyDepth` per cell derived from the stair grammar**; and a
**`Structure` record for a construction that has a section but no plan** (the
mooring mast, the palisade, the aqueduct). Storey-height ranges are an owner
band (§7 B7) and the ladder may DESCEND.

### §1.2 · The three findings that are not laws yet, and the charter's answer

1. **`hostedIn` is the single most-requested capability in the corpus.** Seven
   families in R-INST-2 converge on it; R-INST-1 flags 17 NO-TYPED-HOME rows
   needing it; R-INST-3 needs it with a *dated fallback for when the host dies*
   (the chantry school 1547, the healer's monastery 1536–40); R-INST-5 reaches
   it from four directions as OCCUPATION; R-INST-6 reaches it from three more;
   CIRC adds that a hosted institution INHERITS its host's circulation. It is
   §3's first relation.
2. **`NO_BUILDING` is the highest-severity engine gap in two tranches
   independently** (R-INST-6 E1, asked by 7 of 9 families; R-INST-2 gap 1,
   "largest gap in the tranche"). It is §3's second relation.
3. **The corpus disagrees with itself once, and the disagreement is settled.**
   R-INST-2 dates `CORRIDOR` to "≥ 1650, continental"; R-INST-1 finds corridor
   CELLS from 1127. CIRC §5 resolves it and the charter adopts the resolution
   verbatim: **the CELL's licence is by PROGRAM and is early; the PLAN's licence
   (`corridorPlanned` as a parti attribute) is late.** One sentence becomes two
   licence rows.

## §2 · THE CLOSED VOCABULARIES

Every member below is a closed-enum member with a LICENCE (what must be true for
it to be drawable) and a source. Finite semantics: the clerk composes from these
words and never writes new ones. Where the six tranches spelled the same thing
differently, this section names it ONCE and lists the instances underneath — the
de-duplication is the work, and §2.1's first row is the largest single merge in
the corpus.

### §2.1 · PARTIS — the closed catalog, de-duplicated

**THE MERGE THAT MATTERS.** R-INST-4's `COURTYARD_GALLERY_RING`, R-INST-3's
`COLLEGIATE_COURT`, R-INST-2's `WALLED_COURT_SINGLE_GATE` /
`TWO_TIER_GALLERY_HAN` / `FONDACO_WATER_COURT`, R-INST-6's `COURT_LODGE` and
§15.2's fondaco/han/huiguan/galleried-inn convergence, and R-INST-1's
`COURTYARD_HALL_GATED` are **ONE PRIMITIVE**. Four cultures, four centuries, one
plan: **GATE → COURT → GALLERY → CELLS, with `entrances: 1`** (R-INST-6 §15.2,
which states the causal clause from a primary: the han has "one single entrance
gate to ensure security"). It is named once:

> **`GATED_COURT_RING`** — a walled perimeter with ONE controlled gate; an
> unroofed COURT as the organising element; a GALLERY on one or more sides of
> the court at one or more levels; CELLS opening off the gallery, not off each
> other. Attributes: `sides ∈ {1,2,3,4,N}` · `levels ∈ {1,2,3}` ·
> `gateKind ∈ {LAND, WATER, CAUSEWAY}` · `entrances: 1` (declared, not emergent).
> **Instances** (all one parti, differing only in attributes and fixtures):
> the collegiate court · the claustral cloister · the Venetian *fondaco* · the
> Ottoman *han*/caravanserai · the Chinese *huiguan* · the English galleried inn
> · the coaching inn · the polygon playhouse (the inn yard made permanent —
> R-INST-4 §Σ.1: "the inn yard is the ANCESTOR parti of the playhouse") · the
> bear garden · the Spanish *corral* · the gaol compound · the barrack square ·
> the almshouse's cloistered court · the criminal `COURT_LODGE` at the dominant
> tolerance rung · the mercantile courtyard house (Pantin form iv).
> **Law 6 inverts inside it** (§1.1 law 6): the COURT is the frontage surface for
> every cell except the gate.

That single merge collapses fifteen separately-proposed partis into one
primitive with four attributes. The remaining catalog, grouped by the form that
organises it:

| Family | Members (closed) | Sourced from |
|---|---|---|
| **Linear / axial** | `THROUGH_ROOM_SEQUENCE` · `BASILICAN` (porch → nave → SCREEN → chancel) · `TEMPLE_CELLA` · `MEETING_HOUSE` (transverse, no focus wall) · `HYPOSTYLE_GRID` (orientation wall, no axis) | R-INST-3 §1 C1/C6 |
| **Hall-based (vernacular)** | `HALL_HOUSE_TRIPARTITE` (service end · cross passage · open hall · solar end) · `LONGHOUSE` (byre + dwelling, one roof) · `CRUCK_COTTAGE` (three-bay) · `WEALDEN` (four bays, recessed hall between jettied ends) · `LOBBY_ENTRY` (axial stack, 17th c.) | DWR1A §1-§4; CIRC §2-bis |
| **Urban plot (Pantin's nine, de-duplicated to five)** | `PARALLEL_EXTENDED` (needs 30–50 ft frontage) · `PARALLEL_CONTRACTED` · `DOUBLE_RANGE` (shops in front, hall behind — Tackley's) · `RIGHT_ANGLE_NARROW` · `RIGHT_ANGLE_BROAD` (warehouse/court behind) | R-INST-2 §3, CONFIRMED-primary |
| **Vertical** | `STACKED_HALL_OVER_ARCADE` (the civic STACK) · `TOWER_ONE_CELL_PER_STOREY` · `N_IDENTICAL_FLOORS` (warehouse/Speicher/mill) · `SHOPHOUSE_STACK` (trade below, household above) · `GREAT_HALL_OVER_CRYPT` | R-INST-1 §1; R-INST-5 §Σ.1; R-INST-2 §18/§11 |
| **Yard-organised (roofless is the organiser, no gallery)** | `YARD_RANGE` (tannery, stable, smithy, brickfield) · `TANYARD` · `WICH_HOUSE_ROW` · `MARKET_GROUND_ZONED` · `OPEN_ENCLOSURE` (henge, grove, churchyard) | R-INST-2 §9/§12/§2; R-INST-5 §6 |
| **Compound / precinct** | `PRECINCT` (several buildings, one institution, one property) · `MOATED_PLATFORM` (causeway frontage) · `FIREPROOF_COURT_COMPOUND` (the mint) · `TWO_WARD_CASTLE` · `PALACE_COMPLEX_COURTS` · `BASTIONED_CITADEL` | R-INST-1; R-INST-3 §Σ.2 item 11; R-INST-5 §Σ.1 |
| **Ring (crowd)** | `POLYGON_YARD_GALLERIES` · `AMPHITHEATRE_ELLIPSE` · `COCKPIT_RING` · `HALL_PLAYHOUSE` · `BOX_TIER_HOUSE` | R-INST-4 §9/§10 — note these are `GATED_COURT_RING` specialisations with a stage/pit fixture, kept separate ONLY because crowd egress is an S9 property they alone carry |
| **Gate / threshold** | `GATE_TWIN_TOWERED` · `BARBICAN` · `TOLL_BAR` · `WELL_HOUSE` · `CONDUIT_HOUSE` | R-INST-1 §12; R-INST-4 §13 |
| **Non-building** | `NONE_HOSTED` · `NO_BUILDING` · `SITE` (a marked ground) · `STRUCTURE` (a section, no plan: mast, palisade, aqueduct, standing stone) · `ZONING` (N buildings on adjacent parcels) · `OCCUPIED_VOID` (an existing void colonised) | R-INST-5 R2/R3/R4; R-INST-6 §Σ.4 |

**Count: 8 families, 47 named members plus `GATED_COURT_RING`'s attribute space
— 48 partis.** Two are shared with other trains and are not DW's to mint:
`CENTRALIZED`-round and `COLLEGIATE_COURT` (R-INST-3 notes the sharing with
R-INST-1's keep and DWR1A's manor court); both fold into rows above.

### §2.2 · ROOM (CELL) KINDS — the 28 that exist, and the delta

`ROOM_KINDS` today has 28 members (§0 H6), one of them dead (`stall`, H7). Every
tranche independently reported missing kinds. De-duplicated across R-INST-2 gap
14, R-INST-3 §Σ.2, R-INST-4 item 20, R-INST-5 G8, R-INST-6 E3/E11/E13/E14 and
CIRC §4:

**Retire: 1** — `stall` (no producer; the market stall is a FIXTURE and the shop
is a room, R-INST-2 §1.3).

**Add, grouped (the union, de-duplicated — the same cell reported by four
tranches counts once):**

| Group | New cell kinds |
|---|---|
| Open-air, typed (E11) | `yard` · `court` · `garth` · `close` · `ground` (market/moot) · `parade` |
| Threshold / control (E3) | `gatehouse` · `porter_lodge` · `porch` · `lobby` · `screen_cell` |
| Work | `workfloor_wet` · `furnace_room` · `laboratory` · `preparation` · `drying_loft` · `dye_house` · `brewhouse` · `bakehouse` · `slaughter` |
| Animal | `stable` · `mews` · `byre` · `kennel` · `coach_house` |
| Service / domestic | `parlour` · `solar` · `buttery` · `pantry` · `larder` · `dairy` · `scullery` · `still_room` |
| Care / crowd | `ward` · `infirmary_hall` · `dole_gate` · `tiring_house` · `box` · `cavea` · `arena` |
| Learning / record | `carrel` · `muniment` · `chapter` · `scriptorium_bay` |
| Roof-level (E13) | `loft` · `garret` · `message_loft` · `observing_platform` |
| Below / void (E15) | `undercroft` · `crypt` · `charnel` · `dungeon` · `cistern` · `ergastulum` |
| Envelope-as-content (E14) | `dovecote` · `arsenal_floor` · `stacks_floor` |

**Count: 28 − 1 + 56 = 83 cell kinds.** That is a 3× growth of the vocabulary
and it is the single biggest number in this charter's §5 pricing. It also
crosses the packet law: a 56-member addition to one frozen array is one file,
but its consumers (the templates, the renderer's per-kind draw, the WALL pin)
are three more. **DW-1's vocabulary car therefore lands the enum in TIERS**, and
§5 splits it.

### §2.3 · FIXTURE KINDS

22 today (§0 H6). The tranches' union, de-duplicated:

`anvil · bellows · quench · potter's wheel · press · treadwheel · cresset ·
athanor · reverberatory furnace · alembic · cupel tray · condenser loop ·
still · copper · tuns · vat · tan pit · tenter · loom · sloping desk ·
pigeonhole rack · display board · shutter counter · perch · manger · trough ·
drain · wide door · tether ring · bone stack · standing stone · gate ·
well · signal mount · telescope · mooring ring · screens · plate chest ·
aumbry · press-cupboard · hanging shelf · money box · trestle stage ·
heavens · seat row · masonry bed · curtained bed · stove/Ofenbank ·
playing table · sign · lock-with-schedule · gate-with-wicket · standpipe ·
brass tap · trapdoor · chute · staddle · bin · louvre · rack-to-ceiling`

**Count: 22 + 59 = 81 fixture kinds.**

Two fixture-adjacent constructs the corpus forces that are NOT fixtures:

- **`RECESS`** (R-INST-5 R6) — "a countable, dateable, losable subdivision of
  wall thickness". A third term between fixture and cell. It is the corpus's
  best fossil: a blocked niche is a process that stopped, on a date.
- **`SUBDIVISION`** (R-INST-6 E4) — repeated units inside one cell: pledge
  boxes, bed rows, trading tables, han cells, Speicher bays, the ambachtshuis
  street, presses at 6–9 m² each. R-INST-2's gap 3 is the same thing
  ("N-IDENTICAL-CELLS generator"). One construct, `count` + `unitFootprint`.

### §2.4 · CIRCULATION CLASSES (§452 + the CIRC addendum's delta)

The §452 set **SURVIVES as the top level** and gains two classes (CIRC §4.1,
both proposed by R-INST-2 and given civic/defence/dwelling members by CIRC):

| Class | Sub-forms | Licence (the short form) |
|---|---|---|
| `THROUGH_ROOM` | `+ enfilade` · `THERMAL` (stepped, drained) · `SIGHTLINE` · `AISLED` | the floor everywhere; no licence needed |
| `CROSS_PASSAGE` / `SCREENS_PASSAGE` | `HALL` · `LONGHOUSE` · `ENTRY` · `GATE` · `NOTIONAL` | by KIND (the hall house, the gate, the inn) |
| `CORRIDOR` | `MURAL` · `SIDE_PASSAGE` · `DOUBLE_LOADED` · `THROUGH_LANE` · `SPINE` · `BACK` · `CONNECTING` · `ELEVATED/BRIDGE` | **two licences** — the CELL by PROGRAM (control, service, width-limited site) from the 12th c.; the PLAN (`corridorPlanned`) era ≥ 1650 English domestic, earlier continental/institutional |
| `GALLERY` | `ARCADE` · `LOGGIA_COURT` · `CLOISTER_WALK` · `TRESAUNCE/ALURE` · `INN_GALLERY` · `GALLERY_OVER` · `MURDER_HOLE_GALLERY` · `VERANDA` · `CELL_BLOCK` · `QUAY_ARCADE` · `PLAYHOUSE_RING` · `BOX_TIER` | by parti; gains `enclosure ∈ {OPEN_ONE_SIDE, OPEN_TWO_SIDES, ENCLOSED}`, `level ∈ {GRADE, UPPER, MEZZANINE}`, **`functions[]`** and **`walkable: bool`** (R-INST-3 §Σ.2 item 9) |
| `LONG_GALLERY` | (its own class) | elite, c. 1520s–1650, dead by 1789; width ≥ BROAD |
| `LOBBY` / `VESTIBULE` | `STACK_LOBBY` · `BAFFLE` · `SCREEN_LOBBY` · `PORCH` · `DOOR_LOBBY` · `BARBICAN` · `ENTRANCE_HALL` · `AIRLOCK` | by kind and by dated event (the stack INTO the passage mints it) |
| `STAIR_HALL` | `LADDER`(fixture) · `WINDER` · `VICE` · `STAIR_TURRET` · `EXTERNAL` · `FOREBUILDING` · `DISPLAYED` · `BACK` · `COMMON` · `MODULE` · `STEPS`(ingressus) | technology rung × visibility rung × PLACEMENT rule (DWR1A §5); gains `direction ∈ {UP, DOWN}` — DOWN is the undercity's signature |
| **`VERTICAL`** *(NEW)* | `HOIST` · `CHUTE` · `SHAFT` · `HATCH` · `WINDLASS` | non-human circulation; placed by law 9; an exterior consequence (the taking-in door column, the well-house) |
| **`EXTERIOR_WALK`** *(NEW)* | `COURT_RING` · `YARD` · `PARADE/MUSTER` · `WALL_WALK` · `PALISADE_WALK` · `RANGE/LINEAR` · `STREET` · `ROAD` · `GROUND` | a typed CARRIER, not a map fact — the fabric owns its geometry, DW owns its JOINTS |

**Count: 9 top-level classes; ~55 sub-forms** (CIRC reported ~45 and this
charter adds the playhouse ring, the box tier, the ingressus, and the four
`THROUGH_ROOM` specialisations R-INST-4 found).

**MEASURED WIDTH BUCKETS** (CIRC §6.3 — bounded ENDPOINTS, never priors):

| Bucket | Range | Anchors |
|---|---|---|
| `MICRO` | < 1.2 m | opera box 0.95–1.2 m · conduit passage c. 0.7 m · well house 1.1 m (R-INST-4 item 11) |
| `NARROW` | < 1.8 m | Fleet corridor < 2.13 m · the 4-ft side passage · longhouse passage 0.8–1.5 m · Coventry screens 0.9–1.2 m · allure ≤ 1.5 m · ingressus 1.47 m |
| `STANDARD` | 1.8–3.7 m | screens 6–7½ ft · Kerr's corridor 6–12 ft · cloister 2.5–4 m · gate passage 3.4–4.1 m |
| `BROAD` | 4–7 m | Kerr's gallery 14–20 ft · Vyne 4.9 m · Haddon 5.2 m · barbican 4.6–5.8 m · playhouse gallery 3.2–3.8 m sits at the NARROW/STANDARD line |
| `HALL_GRADE` | > 7 m | Hardwick's wide end · Campo Santo 10.5 m |

Lengths: `SHORT` < 15 · `MEDIUM` 15–35 · `LONG` 35–55 · `VERY_LONG` > 55 m.

**ERA/INSTITUTION LICENCE GRADES**, the closed set: `VERNACULAR_ANY` ·
`PROGRAM_EARLY` (control, service, site-forced — 12th c. onward) ·
`INSTITUTIONAL` (barracks, hospitals, colleges, monasteries, prisons, great
houses licence it by their own program) · `ELITE_LATE` (long gallery
1520s–1650) · `DOMESTIC_LATE` (`corridorPlanned` ≥ 1650 English) ·
`CONTINENTAL_EARLIER`.

### §2.5 · STORAGE CLASSES (§453 + the CIRC addendum's fill)

The §453 top level SURVIVES. ~35 sub-forms (CIRC §4.4), summarised:
`CLOSET{MUNIMENT · TREASURE/PLATE · GARDEROBE · CHAMBER · STUDY · PLATE_SAFE ·
LINEN · OBSERVATION}` · `PANTRY`+`BUTTERY`{the PAIR, `SERVICE_DOORS{2|3}`,
`DISPENCE`, `BUTLER'S`, `COOK'S`} · `LARDER{ANNEXED_TO_KITCHEN (medieval) ·
COLD{WET|DRY|GAME|FISH} (late)}` · `DAIRY{FARM_OUTSHUT · DETACHED · ON_PANTRY}`
· `STILL_ROOM` · `SCULLERY` · `STORE{SCREENED_BAY · STACKED_FLOOR{hoist} ·
GRANARY_FLOOR · CELL_BELOW_LODGING · DRYING_LOFT · SPEICHER{noFire} ·
ARSENAL_FLOOR · ARMS_STORE · BONDED · LUMBER · FUEL · ORDNANCE · MAGAZINE ·
INNER_ROOM · SMOKE_LOFT · COACH_HOUSE · PROPERTY/TIRING · ANIMALS · CISTERN ·
SETTLING_TANK · FOUL · ALMS · RAW/PRODUCT}` · `CELLAR/UNDERCROFT{SERVICE ·
RATSKELLER · TAP · SEPARATELY_LET · BONDED · COAL · DUNGEON}` ·
`ATTIC/GARRET_STORE{LOFT · GARRET · SMOKE_LOFT · ROOF_STORE · OVER_ROOM ·
SERVANTS}`.

**THE ADJACENCY POLARITY SET — closed, six members, and three of them are
PROHIBITIONS** (CIRC §4.3 item 6; this is the vocabulary the §453 text could not
express and R-INST-2 flagged as a gap):

| Polarity | Meaning | Worked instances |
|---|---|---|
| `REQUIRED_NEAR` | must be adjacent | pantry/buttery ↔ screens · bonded store ↔ entrance · cell ↔ stair · kitchen ↔ hall/dole gate |
| `REQUIRED_FAR` | must be distant, with a stated distance where one is sourced | charcoal ↔ furnace · dairy/stables a quarter-mile (Boorde) · magazine "a safe distance" (numeric NOT FOUND) · cesspit 2½/3½ ft from the neighbour (1189 — the program's first numeric prohibition) · kiln 10–30 m from the dwelling · bakehouse 35 m from the moat |
| `REQUIRED_ABOVE` / `REQUIRED_BELOW` | vertical order | portcullis room over the passage · chambers over services · Ratskeller under the hall BY ORDINANCE · Long Room over the bonded store · the keep's store→garrison→hall→state→private order · hayloft over stable |
| `FORBIDDEN_NEAR(HEARTH)` | no heat | the muniment room · Kerr's larder "no fireplace or hot smoke-flue in its walls" |
| **`FORBIDDEN_DOOR`** | adjacency permitted, a DOOR is not | scullery ↛ larder/dairy/pantry · dairy no door "even to its own Scullery" · fuel store ↛ smithy · fuel ↛ the bath's hot room |
| `GUARDIAN_ADJACENT` | a keeper sleeps/sits beside it | the keeper at the gate · the butler's bedroom by the plate safe · the warden's lodging under the muniment tower · the master's lodging at the almshouse gate |

Plus one non-adjacency law that is a WEIGHT rule: `NOT_ON_SUSPENDED_TIMBER`
(York's collapsed arms store).

**THE GENERAL STORE PROHIBITION** (R-INST-5 R9, reached from three directions —
fuel, bodies, feed): *a store whose contents the occupant would consume, burn,
spoil or escape through gets NO internal door.* This is the RULE that generates
most `FORBIDDEN_DOOR` rows rather than a table of them.

### §2.6 · `CompoundMember` (§494), `Parcel` and `Estate` (§498 R8)

The owner's §498 definition splits what §494 and §496 ran together. **Three
objects, named separately, each with its own vocabulary:**

**(a) `CompoundMember` — a TYPED PART OF ONE PROPERTY.** Closed member kinds:
`MAIN_BUILDING · DETACHED_OUTBUILDING · RANGE · YARD · COURT · GARDEN ·
WELL · MIDDEN · PIT_FIELD · KILN · PRIVY · STABLE_BLOCK · TENTER_STRIP ·
DRYING_FRAME_FIELD`. A member belongs to the property even when it does not
touch the main building.

**(b) `Parcel` — a CONTIGUOUS piece of ground with ONE boundary.** This is what
MP-1's halo outlines. Its vocabulary is two words: **the property line** (the
boundary) and **the merge** (the union of adjacent wedges of one ward, §498 R3
as amended — see §3.4 for the geometry).

**(c) `Estate` (= HOLDING) — an OWNERSHIP SET over one or more parcels,
CONTIGUOUS OR NOT.** The owner's own definition: "the combination of multiple,
not necessarily connected, buildings belonging to one singular institution or
individual." Vocabulary:

| Term | Definition |
|---|---|
| `estate` | the set itself: `{ ownerRef, members[], since, cause }` |
| `holding` | a synonym the projection may use in prose; not a second type |
| `owns` | the member row's relation when the owner built or bought it |
| `occupies` | the member row's relation when the owner uses a building it did not build (R-INST-5's OCCUPATION relation, finally typed) — the lent palace, the colonised ruin, the criminal front |
| `accretion` | the ONLY lawful time-advance motion on an existing property: the new work goes into the acquired ground; existing ranges STAY |
| `the seam` | the visible tell-tale of an amalgamated property — misaligned ranges, a break in the roofline, a court where the gap was. **A FEATURE, not an artefact to smooth away** (§498 R9b) |

**THE REVERSE MOTIONS (§500 R10) — ownership is reversible over time; built
fabric is not.** Four typed motions, each with `since` + `cause`, each reaching
the chronicle under the news address law:

| Term | Definition |
|---|---|
| `ACQUIRE` | a parcel joins an estate; ground may merge |
| `SWAP` / `TRANSFER` | a member changes owner; **geometry unchanged** — the cheap case, one dated event on the relation and nothing redrawn |
| `SPLIT` / `PARTITION` | an estate divides; members go to different owners; a merged parcel may subdivide back into property lines, **preferring the remembered seam** |
| `DISSOLUTION` | the owner ceases; the whole holding disperses; the buildings are RECLASSED, never un-built |

**THE THREE TYPED SHARED CONDITIONS**, added to `CompoundMember`'s enum by
§500 R10.c because a split may never un-build a range and a lawful split line
does not always exist. Each is a NAMED type with a receipt, never an accident of
geometry:

| Member kind | Definition | Grounding |
|---|---|---|
| `PARTY_WALL` | one wall, two properties | DWR1A §6: the 1189 London regime — 3 ft of stone, shared cost, written light-easements; Freiburg's *Brandmauer* records; the *Coutume de Paris* articles |
| `ENCROACHMENT` | a range standing partly on another's ground | DWR1A §6's urban customs; historically the norm, not the exception |
| `CHIEF_RENT` | the encroachment's typed compensation | the burgage's fixed per-plot rent (DWR1A's frontage-VALUE mechanism, the one that SURVIVED the negation search) |

### §2.7 · THE YARD-FIXTURE (EMBELLISHMENT) VOCABULARY — §496 R5

Closed, derived, deterministic, and chosen by *institution function × prosperity
× WEAR × season*. Every member is a fact the research already carries; none
asserts anything the engine lacks.

| Institution function | Yard fixtures (closed) | Source |
|---|---|---|
| tanning | tan pits · lime pits · **drying frames with hides** · bark store · water channel | R-INST-2 §9 |
| smithing | quench pit · fuel store (no internal door) · anvil pit · scrap heap | R-INST-2 §7/§7-bis |
| brewing | brewhouse outshut · copper · tuns · cool-backs · malt floor | R-INST-4 §2; R-INST-2 §13 |
| pottery / brick / glass / lime | kiln + **stokehole as large as the oven** · clamp · clay quarry · fuel stack | R-INST-2 §8 gap 14 |
| cloth | tenter strip (131 × 1.8 m measured) · dye vats · drying gallery | R-INST-2 §10 |
| husbandry | manger · trough · midden · bee boles · dovecote · hayrick | R-INST-2 §14/§15 |
| hospitality | mounting block · horse trough · carriage passage · dung heap · sign on its pole | R-INST-4 §3 |
| milling | leat · pond · causeway · hurst | R-INST-2 §11 |
| any dwelling | privy · well · midden · woodpile · kitchen garden | DWR1A §8 |

**THE WEAR LADDER — R-INST-1's "what decline sheds first", bound to the engine's
existing `conditionOf` chain (§0 H24).** Sheds in this order as condition
worsens `sound → worn → damaged → burned → ruined`:

1. the PERISHABLE process fixtures go first (hides on the frames, the tenter's
   cloth, the drying gallery's stock) — *a ruined tannery has frames and no
   hides; an abandoned one has neither*;
2. then the frames, racks and stacks themselves;
3. then the movable plant (copper, vats, anvil);
4. the EXCAVATED features never go (pits, leats, stokeholes) — they become the
   fossils law 5 reads.

This ordering is the whole point of R5's constraint that an embellishment never
asserts a fact the engine lacks: the fixtures are read off `conditionOf` and
`agePermille`, both of which exist and are derived.

### §2.8 · THE JOINT VOCABULARY THAT MEETS THE UNDERCITY'S

The undercity's five are closed and landed (§0 H15) and **DW imports them
unchanged**: `grate · stair · sealed_door · sluice · breach`. DW adds NOTHING to
that enum. What DW adds is the ATTRIBUTE SET the CIRC addendum and R-INST-6
found the contract cannot express:

| Attribute | Values | Why |
|---|---|---|
| `joint.target` | `CELL · UNDERCITY · OTHER_BUILDING · EXTERIOR · ROOF · WATER` | the bridge-gallery, the through-lane, the wall-walk, the message loft's aperture (E13), the water landing (E16). `UNDERCITY` is the value the five kinds already carry. |
| `joint.severable` | `bool` | the portcullis, the drawbridge, Monk Bar's four doors, the pulled-up ladder — a joint the occupant can CLOSE (a siege/news state) |
| `joint.schedule` | a time window | the stew's timetabled lock (1557), the Fuggerei's 22:00 gates, the Longhouse's tide, the Hope's trestle stage |
| `joint.refused` | `bool` | a LICENSED non-joint. S9 must prove ABSENCE, not only reachability |
| `joint.mandatoryOpen` | `bool` | the London cellar door |
| `joint: OBJECT_ONLY` | a kind flag | the foundling wheel — a joint that passes objects, never people |
| `cell.approach` | `NORMAL · SINGLE · HATCH_ONLY · NONE` | the muniment room (single newel) · the prison pit (zero doors) · the anchorhold (a cell with no door — the validator must accept it) |

**The seam is one line.** `stair` at the anchor "cellar door" carries eleven of
twenty-eight criminal rows and is already written by UC-2/UC-3/UC-4. DW's job at
the seam is to draw the SURFACE side of a joint the undercity already emitted,
resolved through `frontFor(seed).anchor` (§0 H16). **No new joint kind. No new
subsystem.**

## §3 · THE CONTRACTS

Compiled from the parent's §5, with the three relations the research demands and
the engine lacks, plus the two contracts chair rulings R2′ (§497) and R8 (§498)
add. Every field is a closed vocabulary member, a bucket with named endpoints,
or a reference to an existing engine key. **Nothing here is persisted except
`PlanDelta` and the dated amalgamation event** (law 4).

### §3.1 · The core records

```
Compound {
  compoundId,                  // = the parcelId it sits on (no second key)
  parcelId,                    // CartographyParcelRow.id  (§0 H17/H20)
  members: CompoundMember[],
  entrances: 1 | 2 | N,        // DECLARED by the parti (R-INST-5 §1.5 + R-INST-6 §15.2)
  frontages: Frontage[],       // ORDERED, with status grades (§1.1 law 6)
  yard,                        // DERIVED: parcel polygon minus every footprint
  courts: Court[],             // DERIVED: enclosed components of the yard (§3.5)
  certification
}

CompoundMember {
  kind,                        // §2.6(a)'s closed set
  polygon,                     // in the parcel's own frame
  relation: 'owns' | 'occupies',
  buildingRef?,                // CartographyBuildingRow.id where the member is built
  since?, cause?               // when the member arrived, if it post-dates the property
}

Building {
  buildingId,                  // CartographyBuildingRow.id
  parti, partiModifier?,       // §2.1; the modifier is the WRAP (R-INST-6 E5)
  footprint,                   // the engine's, never re-derived
  storeys: Storey[],           // law 9's carrier — the engine has NONE today (§0 H5)
  frontageRef,                 // which of Compound.frontages this building faces
  programSatisfied: bool,      // R2′: proof the minimum was met, carried for the receipt
  fossils: Fossil[]            // colonization.js's FOSSIL_KINDS, imported (§1.1 law 5)
}

Storey { index, heightBucket, cells: Cell[], verticalJoints: Joint[] }

Cell {
  kind,                        // §2.2's 83
  polygon, functions[],        // law 1: MANY functions may share one cell
  causedBy,                    // WHICH function caused this cell
  occupiedBy[],                // which functions merely occupy it (law 1's corollary)
  lightReq, fixtures[], joints[], approach, subdivisions?
}

CirculationCell extends Cell {
  class,                       // §2.4's 9
  subForm,                     // §2.4's ~55
  licence: { grade, era, institutionKinds[] },
  widthBucket, lengthBucket,   // §2.4's measured buckets
  enclosure?, level?, functions[], walkable?,
  mintedBy?, killedBy?         // a DATED event (CIRC §4.3 item 8)
}

StorageCell extends Cell {
  class, subForm,              // §2.5
  sizeBucket,
  lightReq: NONE | NORTH | ANY | BARRED | END_WINDOWS | VIA_CORRIDOR | DARK
          | GROUND_LEVEL_SPLAY | SIDE_WINDOWS_BOTH | OWN_WINDOW,
  adjacency: { polarity, target, distance?, eraGrade }[]   // §2.5's six polarities
}

Fixture { kind, cellRef, grade, wear, count?, unitFootprint? }
Recess  { cellRef, wallRef, depth, state: OPEN | BLOCKED, blockedYear? }

Joint {
  kind,                        // the undercity's five, imported unchanged
  target, anchor,              // §2.8's attribute set
  severable, schedule?, refused, mandatoryOpen?, direction?
}

FloorPlan {
  buildingId, derivedAt{year,tick}, circumstancesDigest,
  storeys[], underLinks[], fossils[], certification
}

PlanDelta { buildingId, path, op, value, editedAt }   // THE ONLY STORED ARTEFACT
```

### §3.2 · `programMinimum` — the R2′ contract

**Chair ruling R2′ (§497), owner-ruled: the minimum program is DATA from the
dossiers, per institution per tier — a closed, declared requirement, not a
heuristic and not a magic number.** It is a first-class contract member beside
the parti enum, and it is an INPUT TO ALLOCATION, never a test applied after
geometry.

```
ProgramMinimum {
  institutionKey,              // catalog row identity
  tier,                        // the row's own tier — a tier's smaller form is a DIFFERENT minimum
  verdict: BUILDING | HOSTED | NO_BUILDING | ZONING | PRECINCT | OCCUPIED,
  cells: { kind, count, minDims?, note }[],
  adjacencies: { a, b, polarity }[],
  openGround: { kind, minExtent }[],   // yard, court, range, pit field
  frontageMin?,                        // where a parti is frontage-gated (Pantin)
  citation                             // the dossier row, by name and section
}
```

**⚠ NEVER express a minimum as bare area or bare footprint** (R2′(c)): an area
test is satisfiable by a big empty box that still reads wrong. **Cells and
relationships, always.** Because the minimum is a PROGRAM, MANY partis satisfy
it — a courtyard range, an L on a corner plot, a deep double-pile, a street
range with a rear wing. *That* is where the owner's "varied configuration"
comes from; variety is a consequence of expressing the requirement as a
program rather than as a shape.

**The per-tier table, sourced row by row.** These are the worked exemplars
DW-R's corpus car fills out for the full roster; each already has its citation.

| Institution | Tier | Verdict | Cells (the minimum) | Open ground | Frontage | Citation |
|---|---|---|---|---|---|---|
| Alehouse | hamlet | **HOSTED** | the keeper's dwelling's fore chamber (drink) + a beer store + a brewing outshut | — | — | R-INST-4 §1.1, §2: "ordinary dwellings where the householder served home-brewed ale" |
| Ale house | village | **HOSTED** | as above; own building only at the 12-room ceiling | — | — | R-INST-4 §Σ.3 rows 3/7 |
| Wayside inn | hamlet | **HOSTED** | roadside dwelling + ONE spare chamber + stabling + a sign | — | `onRoute` | R-INST-4 §1.1: "a room above a stable and a common meal" |
| Travelers' inn | village | **BUILDING** | hall + kitchen + 2–3 chambers + stabling | yard | gate passage | R-INST-4 §Σ.3 row 6 (`L_PLAN_GATE_AND_BACK_RANGE`) |
| Inn (multiple) | **town** | **BUILDING** | hall + kitchen + service pair (spence/larder) + N chambers + stabling + hayloft over | **yard, entered through a carriage passage**; gallery to the chambers | `GATE_PASSAGE`, era-graded HORSE 1.8–2.4 m / COACH ≥ 2.4–3.0 m | R-INST-4 §3, §Σ.2 item 4. **This is the owner's "no one-room inn", stated as cells.** |
| Public playhouse | city | **BUILDING** | yard (raked) + 3 gallery levels + tiring house + gentlemen's rooms + ONE controlled door with a gatherer's station | the yard IS the organiser | one door | R-INST-4 §1.4, the Fortune contract 8 Jan 1600: 80 ft square outside / 55 ft inside; storeys **12 / 11 / 9 ft**; galleries **12½ ft** deep; stage 43 ft × half the yard |
| Shop (retail craft) | village+ | **HOSTED→BUILDING** | ONE frontage cell that is shop AND workshop (counter at the window, bench behind) | — | **6–10 ft** | R-INST-2 §1.1 (Salter via Pantin), §3 |
| Parallel-hall town house | town+ | **BUILDING** | hall + service end + solar end + cross passage | — | **"a fairly large frontage, of say 30 to 50 feet"** | R-INST-2 §3, Pantin CONFIRMED-primary |
| Warehouse | town+ | **BUILDING** | N identical STORE floors + external hoist + loading face | quay or cart yard | water or cart edge | R-INST-2 §18 |
| Town hall / civic | town+ | **BUILDING** | ground that EARNS or CONTROLS (arcade/shops/weigh/cells) + upper that GOVERNS (chamber/court/hall) + archive in the most fire-proof least-accessible cell + a bell tower | — | the square | R-INST-1 §1, CONFIRMED across six registers |
| Collegiate chamber | city | **BUILDING (precinct)** | chambers on staircases, **four to a chamber**, each with study closets **3½–5 × 4½–6 ft** | the court | the court (law 6 inverts) | R-INST-3 §13 (LOCAL Willis & Clark, measured) |
| Infirmary hall | town+ | **BUILDING** | an aisled hall of N bays with **every bed seeing the altar** + a chapel at the end | — | — | R-INST-3 §6-bis; R-INST-4 §11 |
| Parish church | village+ | **BUILDING** | porch + nave + SCREEN + chancel | churchyard (an acre, banked) | `ORIENTED_AXIS` (east) | R-INST-3 §4, §Σ.1 |
| Wayside shrine | thorp/hamlet | **NO_BUILDING** | none — a cross **0.86–2.37 m** on a socket stone | a road junction | — | R-INST-3 §2 |
| Local fence | thorp | **NO_BUILDING** | none — a chest or covered pit as a FIXTURE in a dwelling | — | — | R-INST-6 §Σ.4 row 1 |
| Assassins' guild | metropolis | **NO_BUILDING** | none, on the row's own testimony | — | — | R-INST-6 §Σ.4 row 28 |

**The refusal clause (R2′(e)).** If the roster asserts an institution and the
ward cannot supply its minimum EVEN AFTER LAWFUL MERGING, that is an UPSTREAM
defect. It surfaces as a **named, projectable finding** — "the settlement's
fabric cannot host what its roster claims", with the institution, the tier, the
minimum and the best envelope found — carried on the plan's `certification` and
readable by the DM. **Never a silent shrink, never a quiet box.** A refusal is
lawful only where SELECTION is still open (allocation); at draw time it is a
reported contradiction.

### §3.3 · THE THREE RELATIONS THE ENGINE LACKS

These three are the charter's answer to its own first line.

---

#### `hostedIn` — a function occupying another institution's interior

**Derivation.** The host is chosen, deterministically, by a ranked candidate
rule per institution family, from the roster the settlement already has:
`hostFor(inst) = firstMatch(hostPreference[inst.family], settlement.institutions
∪ settlement.dwellings)`, forked on `(worldSeed, inst.anchorKey, 'host')` to
break ties. The guest contributes a FIXTURE SET and sometimes an added or
refused joint; **its circulation is INHERITED from the host** (CIRC §4.3 item 9
— "the licence is the host's, the fixture set the guest's").

**Refusal cases.** (i) No candidate host exists → the verdict falls to
`NO_BUILDING`, not to an invented building. (ii) The host's own program has no
spare cell of the required kind → the guest's cells COMPRESS (R-INST-6 §1.6's
compression law) and surplus stations collapse; the compression is LAWFUL and
recorded, not a failure. (iii) **The host DIES** — R-INST-3's case, and it is
dated and real: the chantry school at 1547, the healer's monastery 1536–40, the
west-gallery band in the 19th century. `hostedIn` therefore carries a
`fallbackOrder[]` and a `killedBy` event; a guest whose host dies re-hosts or
falls to `NO_BUILDING` on a DATE.

**The projection of its absence.** Today a hosted institution draws its own box
(§0 H1–H6). With `hostedIn`, the projection reads: *"The fence keeps no premises.
He works the counter of the pawnbroker on Cordwainer Lane; the alteration bench
is the shop's own."* The address chain is the host's, per the NEWS ADDRESS LAW.

**Stable-key rule (law 4's extension, §1.1).** The anchor is
`(hostBuildingId, functionKind, ordinal)`. The guest's own id never keys a cell.

---

#### `NO_BUILDING` — a reasoned, projectable verdict with a fixture set on ground

**Derivation.** `NO_BUILDING` is DECLARED on the `ProgramMinimum` row for that
institution AT THAT TIER (R2′(d)) — it is the tier's truth, never a fallback
reached when geometry runs out. It carries: a `ground` (a road junction, a
market ground, a churchyard, a stretch of open water), a `fixtures[]` set, and a
`reason` string drawn from a closed enum of causes (`ITINERANT · SEASONAL ·
HOURS_ARE_THE_SECURITY · NO_PREMISES_BY_NATURE · ON_ANOTHER'S_GROUND ·
THE_GROUND_IS_THE_INSTITUTION`).

**Refusal cases.** (i) A `NO_BUILDING` row may NOT acquire cells by prosperity;
it acquires a DIFFERENT `ProgramMinimum` row at the next tier, or an
upgrade LICENCE (R-INST-3's three licensed upgrades: the bishop's chapel-of-ease
licence, the household oratory licence, the endowment). (ii) It may not consume
a parcel that a BUILDING verdict needs.

**The projection of its absence.** Today: a market square draws a counting house
with a strongroom. With the verdict: *"This institution has no premises. The
weekly market is the square itself; on market day the stalls stand five by ten
feet along the north side, and nothing stands there on any other day."*
**Four catalog REQUIRED rows depend on this** (Market square, Weekly market,
Town granary, Craft guilds — R-INST-2 §Σ law 3) plus two more in R-INST-4
(thorp/hamlet Water source). A REQUIRED row that cannot be drawn honestly is the
strongest argument in the charter for building this relation first.

---

#### `occupies` — a building used by an institution that did not build it

**Derivation.** Distinct from `hostedIn` (a function inside a live host's
interior) and from `owns`. `occupies` is a whole-building claim on a structure
whose builder is gone or is another party: the druid circle on a ring it did not
raise ("Stonehenge's principal phases predate the historical Druids by more than
two thousand years" — R-INST-5 §1.3), the resident dragon in a ruin/cistern/
amphitheatre/undercity void, the planar embassy in a lent palace ("not
purpose-built as an embassy but rather repurposed from an existing private
residence"), the undead-labour institution pointing at an existing charnel, the
criminal front over a merchant's undercroft. **§498 R8(b) types it on the
member row:** `relation: 'owns' | 'occupies'`.

**What it produces.** The occupier's plan IS the occupied building's plan, PLUS
a few added cells, a CHANGED CONTROL (which joints are severable and by whom),
and **dated modifications that are law-5 fossils running FORWARD** (a widened
opening, a broken roof).

**Refusal cases.** (i) `occupies` may not MINT the occupied structure — if no
suitable structure exists in the fabric, the verdict degrades to `NO_BUILDING`
with reason `ON_ANOTHER'S_GROUND` and a note that the world has no such ruin.
This is R-INST-5's own discipline: *no institution ever generates a landscape
fossil.* (ii) It may not occupy a structure another institution owns and
occupies.

**The projection of its absence.** Today a dragon resident draws a tavern with a
bar, a kitchen, a cellar and lodging (R-INST-5 G1, the `/den/` inside
"resi**den**t"). With `occupies`: *"The wyrm holds the old cistern under the
east quarter. Nothing was built for it; the vault's mouth was widened, and the
year that happened is remembered."*

### §3.4 · `Parcel` and `Estate` — the §498 R8 split

**The owner's definition governs: an estate is an OWNERSHIP SET, not a geometric
merge.** Two contracts, kept apart:

```
Parcel {
  parcelId,                    // CartographyParcelRow.id, or a MERGED id
  wardId,
  polygon,                     // contiguous, ONE boundary — MP-1's halo outlines THIS
  mergedFrom?: parcelId[],     // present iff this parcel is an amalgamation
  since?, cause?               // the amalgamation's DATE and CAUSE
}

Estate {
  estateId,
  ownerRef,                    // see the measured gap below
  members: { parcelId, relation: 'owns' | 'occupies' }[],
  since, cause
}
```

**The merge rule (R3, amended not superseded).** Merging makes a BIGGER PARCEL,
never an estate. It is lawful only for **adjacent candidate wedges of ONE ward**.
Measured geometry, from §0 H19:

- **Intra-edge merge (the clean case).** Wedges `(e, s)` and `(e, s+1)` are
  `[C, cuts[s], cuts[s+1]]` and `[C, cuts[s+1], cuts[s+2]]`. Because
  `cuts[s]`, `cuts[s+1]`, `cuts[s+2]` are COLLINEAR (all on ward edge `e`),
  their union is exactly the triangle `[C, cuts[s], cuts[s+2]]` — **a triangle
  of the same family.** Containment, non-overlap and integer vertices survive
  untouched, AND `cartographyBuildings.js`'s medial-subdivision theorem
  (§0 H21) still applies, so the merged parcel still takes ≤ 4 buildings by the
  same proof. Frontage doubles to 2/3 of the ward edge. **This is the merge DW-2
  should prefer and the only one that is closed under the existing theorem.**
- **Vertex-crossing merge.** Wedges `(e, 2)` and `(e+1, 0)` share the edge
  `[C, ward.polygon[e+1]]`. Their union is a genuine QUADRILATERAL, convex
  because the ward is convex with an interior centroid. Still contained, still
  non-overlapping — but **the medial-subdivision-into-four theorem does not
  apply to a quad**, so a merged parcel of this shape needs its own packing
  proof or must be refused. **Charter ruling: DW-2 refuses the vertex-crossing
  merge in its first landing and admits it only behind its own proof car.**
- **Cross-ward merge is REFUSED.** It breaks the containment theorem outright.

**⚠ THE MEASURED OWNER GAP, and the smallest honest key.** §498 R8(a) requires
`ownerRef` to resolve to an institution's canonical key OR to a household/family
from the demography layer, and forbids a named individual. Measured this lane:

- **Institutions have a canonical key** — `anchorForInstitution(inst)`, used by
  the map, the interior and `frontFor(seed).anchor` (§0 H16). Usable today.
- **HOUSEHOLDS DO NOT EXIST AS ENTITIES.** `git grep -niE "householdId|
  household_id" claude/composite-r4 -- src` returns **zero rows**. Demography is
  aggregate: `demographicsKernel.js` exports one function, `advanceDemographics`.
  And dwellings are explicitly anonymous — `cartographyBuildings.js:9-10`:
  "Dwellings are population-derived filler with **NO parallel identity**: their
  ids resolve to nothing outside this block, by design"; a dwelling id is
  `carto:dwelling:<wardId>:<ordinal>` (L363).
- **The smallest honest key, proposed (vetoable):** `ownerRef` is an
  INSTITUTION anchor, or the reserved literal `ANONYMOUS_FABRIC` — the same word
  `colonization.js:369` already uses for a piece of underground nobody owns.
  **DW does not invent a household.** Household-owned estates (the merchant with
  a house and a quay warehouse) are **DEFERRED to a future demography car** with
  this measurement as the reason (§9 D-3), because minting a household identity
  is a persistence-shape act and an owner gate, not a DW judgment call.

### §3.5 · COURT versus YARD — the definition ruling (§496 R4)

Both are DEFINITIONS, not data; neither is stored; derive-don't-store is
satisfied by construction, which is what makes "emergent" literally true.

- **YARD** = `parcel polygon − ⋃ footprints` (§495.3's subtraction).
- **COURT** = the topological case where footprints ENCLOSE part of that
  leftover — a HOLE in the open ground, i.e. a bounded component of the
  complement that does not touch the parcel boundary.

**Which wins where both apply.** A court that is a NAMED MEMBER — the collegiate
court, the fondaco court, the inn's galleried yard, all one primitive per §2.1 —
is **the parti's own declaration and it OUTRANKS the emergent reading.** The
reason is law 8 and law 4 together: the parti was DRAWN with a court as its
organising element, so the court is a cause, not an effect; treating it as an
emergent hole would let a packing accident rename the building's own organising
form. Concretely: `Compound.courts[]` is populated first from the parti's
declared members, and the emergent scan then adds only those enclosed components
NOT already claimed by a declared member. Where a declared court and an emergent
hole overlap, the declared one absorbs it.

### §3.6 · What each contract REFUSES

A contract is defined as much by what it will not express. Stated so the skeptic
can test each:

| Contract | Refuses |
|---|---|
| `Compound` | more than one parcel (that is an `Estate`); a member on ground the parcel does not contain |
| `Estate` | a named individual as `ownerRef`; a member the owner neither owns nor occupies; a geometric interpretation of itself |
| `Building` | a storey whose cells exceed the footprint; a parti whose `programMinimum` was not satisfied at allocation |
| `Cell` | a kind outside §2.2; free geometry (the renderer knows how to draw each kind — the existing WALL discipline) |
| `CirculationCell` | a cell with no licence; a `CORRIDOR` with `corridorPlanned` in a pre-1650 English domestic parti |
| `StorageCell` | a door where `FORBIDDEN_DOOR` holds; a `LARDER` adjacent to a hearth |
| `Joint` | a kind outside the undercity's five; a route between two components while UC-5 is unbuilt (§1.1 law 7) |
| `ProgramMinimum` | a bare-area or bare-footprint test (R2′(c)) |
| `PlanDelta` | anything on the generation path (THE PROMISE) |

## §4 · THE DERIVATION PIPELINE

The parent's S1–S9 survive. Chair rulings R2′ (§497), R8/R9 (§498) and R10 (§500)
insert **one new stage before the parti draw** and **one new stage that runs only
at time advance**, and both are the SAME machinery invoked at two times (§498
R9d — never two implementations that can disagree).

```
GENERATION                                  TIME ADVANCE
S1  circumstances snapshot                  S1  circumstances snapshot (new year)
S2  program minimum lookup      <- NEW      T1  ownership event (acquire / swap /
S3  parcel allocation & merge   <- NEW          partition / dissolve)     <- NEW
S4  parti draw (filtered)                   T2  ground motion  (merge or un-merge
S5  vertical partition                          along the remembered seam)
S6  function roster                         T3  ACCRETION only — never redraw
S7  placement                                   (existing ranges STAY)
S8  circulation                             T4  reclass / fossil on dissolution
S9  storage & service                       T5  the dated chronicle entry
S10 fixtures & dressing (+ yard)            then S5..S12 re-derive over the
S11 undercity projection                    unchanged lived record
S12 validation
```

The stage letters are renumbered from the parent's S1–S9 because two stages are
inserted; the parent's names are preserved and mapped in the table below.

### §4.1 · The generation pass, stage by stage

| Stage | Parent | Consumes | Emits | REFUSES |
|---|---|---|---|---|
| **S1 CIRCUMSTANCES** | S1 | the §3-table readers + a NEW **time member** (year, time-of-day, tide — §1.1 law 4) | the typed snapshot + `circumstancesDigest` | a snapshot missing a required reader (a partial snapshot is a silent lie) |
| **S2 PROGRAM MINIMUM** | *new* | the institution's catalog row, its tier, `interiorKind` (post-CH) | its `ProgramMinimum`: verdict, cells, adjacencies, open ground, frontage minimum | a bare-area test (R2′(c)); a minimum invented rather than cited |
| **S3 PARCEL ALLOCATION & MERGE** | *new* | the ward's candidate fan, the binding receipt, `ProgramMinimum` | the allocated `Parcel` (single or merged) + the merge's `since`/`cause` | a cross-ward merge; a vertex-crossing merge (first landing); any repair of a DRAWN shape |
| **S4 PARTI DRAW** | S2 | the allocated envelope's **frontage bucket**, the three clamps, prosperity × institution × culture | one parti + optional `PartiModifier` | a parti whose frontage minimum the envelope cannot meet; a parti that does not satisfy the program |
| **S5 VERTICAL PARTITION** | S3 | `heightPermille`, the parti's vertical grammar, storey-height bands | `Storey[]` | a storey count that does not reconcile with the massing silhouette |
| **S6 FUNCTION ROSTER** | S4 | the institution's floor set + prosperity ladder + demography | the roster with its shedding order attached | a roster below the floor |
| **S7 PLACEMENT** | S5 | the roster, the parti, the ORDERED frontage list, adjacency polarities | cells with polygons | an adjacency that violates a `FORBIDDEN_*` polarity |
| **S8 CIRCULATION** | S6 | the licence tables | `CirculationCell[]` in **two steps** (see below) | an unlicensed circulation cell; a `corridorPlanned` parti out of era |
| **S9 STORAGE & SERVICE** | S6 | the licence tables + the general store prohibition | `StorageCell[]` | a door where `FORBIDDEN_DOOR` holds |
| **S10 FIXTURES & DRESSING** | S7 | prosperity × wear × season × institution function | `Fixture[]` + the yard-fixture (embellishment) set | a fixture asserting a fact the engine lacks (§496 R5) |
| **S11 UNDERCITY PROJECTION** | S8 | `frontFor(seed).anchor`, the component rows | surface joints only | a ROUTE between components while UC-5 is unbuilt |
| **S12 VALIDATION** | S9 | everything | `certification` | shipping an uncertified plan |

**S8 runs as TWO steps, and this is the CIRC addendum's own ruling** (§6.1):
(i) the KIND's REQUIRED circulation set from the licence tables; (ii) the
era/prosperity/renovation OPTIONAL set, each carrying `mintedBy`. *Nothing is
"leftover space" — but equally nothing is added without a licence.*

### §4.2 · S3 in detail — allocation, and why it preserves the theorem

**Chair ruling R2′(b): allocation is a CHOICE AMONG CANDIDATES, never a repair
of a drawn shape.** The algorithm, stated so a skeptic can check that it
introduces no loop:

1. Read `ProgramMinimum` → a required cell count, a required open-ground extent,
   and a `frontageMin` where the parti family is frontage-gated.
2. Enumerate the ward's candidate fan — it already exists,
   `carveCandidates(ward, centroid)` at `cartographyParcels.js:91-128`, and the
   fan is always LARGER than the tier's take (`PARCELS_PER_WARD`, L221-223), so
   there are spare candidates by construction.
3. Order candidates by the existing A-8 placement rule (`orderCandidates`,
   L144-165) — unchanged, so no map re-lays itself.
4. Walk the ordered candidates; for each, test whether the envelope satisfies
   the program. Frontage is `|cuts[s+1] − cuts[s]|` (§0 H19); capacity is the
   medial-subdivision bound (≤ 4 buildings, §0 H21).
5. If no single candidate satisfies it, **UNION adjacent same-edge candidates**
   (§3.4's clean case) and re-test. Each union is exactly one more triangle of
   the same family, so the test can be repeated a BOUNDED number of times: at
   most `PARCEL_EDGE_DIVISIONS − 1 = 2` unions per ward edge.
6. If still unsatisfied after the bounded unions, emit the **REPORTED
   CONTRADICTION** of R2′(e) — never a shrink.

**Why the theorem survives.** Steps 2–5 select and union; they never clip, never
jitter, never re-partition and never retry a drawn shape. The union of two
adjacent same-edge wedges IS a wedge (§3.4), so
`cartographyParcels.js:11-20`'s premise set — convexity, an interior centroid, a
vertex cap — is undisturbed, and `cartographyBuildings.js`'s packing proof
applies unchanged to the result. **The ONE LAW is obeyed: this is a selection
inside an already-validated ward, not a second partition of space.**

**Determinism.** The candidate order is the existing digest-driven order; the
union rule is deterministic given that order; nothing consumes PRNG entropy.
`cartographyParcels.js:34-38` states the leaf "roots no stream, forks no label,
and consumes nobody's entropy" — S3 must keep that property, so its choices are
`sceneDigest` reads, exactly like every other choice in the leaf.

### §4.3 · WHERE THE PARTI IS DRAWN, AND WHAT FORECLOSES A DRAW

Law 8's draw is at **S4**, and it is the FOURTH stage, not the second — that is
the structural consequence of R2′. Three things foreclose a draw, in order:

1. **The program forecloses it.** A parti that cannot house the minimum's cells
   and adjacencies is not eligible, whatever its weight.
2. **The frontage forecloses it.** Measured: `PARALLEL_EXTENDED` "needs a fairly
   large frontage, of say 30 to 50 feet" (Pantin, R-INST-2 §3). A shop cell is
   6–10 ft. So the frontage bucket is a HARD FILTER on the eligible set before
   weights apply, and this is chair ruling R1: *frontage decides which partis
   are eligible; depth and storeys absorb the rest.*
3. **The era, culture and licence foreclose it.** R-INST-2 gap 12 lists twelve
   dated REFUSALS, not gradings — sawmill (1204 continental / 1594 Dutch wind /
   1760 English), glasshouse (1567/1615 English; 1291 Murano), free-standing
   warehouse (≥ c. 1580), `corridorPlanned` (≥ 1650), loomshop (≥ 1720), English
   market hall (≥ c. 1600), harbour crane (≥ 1244; England ≥ 1331), dry dock
   (≥ 1495), decoy (≥ 1620), earth cellar (≥ 1700), printing (≥ 1450), loose box
   (≥ 18th c.).

**The program is absorbed by DEPTH and HEIGHT, never sideways** (chair R1,
grounded in R-INST-1's civic STACK and R-INST-2's N-identical-floor warehouse).
So when the eligible set is thin, the resolution is a taller or deeper parti, not
a wider plot.

### §4.4 · THE SECOND SUBORDINATE ENTRANCE, AND `compound.entrances`

`compound.entrances` is **DECLARED by the parti**, not emergent (R-INST-5 §1.5;
R-INST-6 §15.2 — two tranches, nine instances, four cultures). When a parti
declares `entrances: 1`, law 6's frontage reader returns the COURT as the
frontage surface for every cell except the gate, and the street is reduced to a
single typed joint.

The SECOND, SUBORDINATE entrance (R-INST-6 finding 2 / gap E2) is a separate
thing and is placed at S7 on a frontage whose status grade is lower than the
primary's — a court, a back lane, a water stair. It is what the two-plan front
building depends on entirely: without a second frontage of unequal status, the
trade entrance and the public entrance are the same door, and family E's whole
content is inexpressible. Measured: the engine has ONE (§0 H4).

### §4.5 · THE TIME-ADVANCE PASS — accretion, and the three reverse motions

**§498 R9(b) and §500 R10, compiled as one stage family.** THE PROMISE is
constitutional: lived history is immutable. Therefore:

**T1 — the ownership event.** One of four typed motions, each with `since` and
`cause`:

| Motion | What moves | Geometry |
|---|---|---|
| **ACQUIRE** | a parcel joins an estate | ground may merge (T2) |
| **SWAP / TRANSFER** | a member changes owner | **none** — the cheap case: one dated event on the relation, nothing redrawn |
| **SPLIT / PARTITION** | an estate divides; members go to different owners | a merged parcel may subdivide (T2) |
| **DISSOLUTION** | the owner ceases; the holding disperses | none directly; T4 reclasses |

**T2 — ground motion.** Merge per §3.4. **Un-merge prefers the REMEMBERED SEAM**
(§500 R10.b): a merged `Parcel` carries `mergedFrom[]`, so a subdivision
un-merges along the line it merged along. No new geometry, no arbitrary cut, the
townscape stays legible, and it is the cheapest branch.

**T3 — ACCRETION, the ONLY lawful motion on built fabric.** When ground joins a
property, the existing ranges STAY and the new work goes into the ACQUIRED
ground: a new range, an outbuilding, or a COURT formed by enclosing the gap
between the two. **The visible seam — misaligned ranges, a break in the
roofline, a court where the gap was — is a FEATURE, not an artefact to smooth
away** (§498 R9b). It is also the historically correct tell-tale of an
amalgamated property, so the constraint the Promise imposes produces the better
result.

**T3′ — when a SPLIT must cut through built fabric** (§500 R10.c). Lived history
is immutable, so a split may never un-build a range. Two lawful outcomes, in
this order:

1. **Constrain the split line to run BETWEEN structures** — along the remembered
   seam, along an alley, along a range's flank. Always preferred.
2. Where no such line exists, the split produces a **TYPED SHARED CONDITION**,
   never a contradiction. Three members, added to §2.6(a)'s enum by this
   amendment: `PARTY_WALL` (a wall two properties share — DWR1A's 1189 London
   regime is the primary: 3 ft of stone, shared cost, written light-easements),
   `ENCROACHMENT` (a range standing partly on another's ground), and
   `CHIEF_RENT` (the encroachment's typed compensation). Each is a NAMED type
   with a receipt, never an accident of geometry. **DW-1's vocabulary as drafted
   at §2.6 could NOT express these; they are added here and §5's ESTATE wave
   prices them.**

**T4 — DISSOLUTION feeds the reuse chain.** When an owner ceases the buildings do
not vanish; they are RECLASSED, dated, with a cause, via `reclassedTo[]`
(§3.1). The research already wrote the mechanism: bath → brothel → tannery →
laundry → dwelling; the infirmary hall partitioned into eight cells with four
chimneys in 1680; arena → fortress → 200 houses → chapels → quarry over 1,500
years (R-INST-4 §Σ.1 law 5 and item 18).

> **THE MEASURED SEAM, read this lane.** `src/domain/worldPulse/institutionLifecycle.js`
> (60,069 bytes at base) already governs closure. `applyInstitutionLifecycleOutcome`'s
> close branch at **L1006-1024** does NOT delete the row: it rewrites it as
> `{ ...target, status: 'remnant', _worldPulseInactive: true,
> _worldPulseEconomyClosed: true, worldPulseFate, closedByWorldPulseOutcomeId,
> remnantReason }`. A fate enum already exists — `closureFateForInstitution`
> (**L651-656**) returns `shuttered` (market/shop/tavern/inn/bath/theatre/
> gambling), `bankrupt` (guild/craft/smith/mill/works/yard/forge/tannery/weaver)
> or `closed_for_want_of_custom`. **CONFIRMED: the hand-off point is clean.** A
> remnant keeps its identity, so `Estate.ownerRef` stays resolvable and the
> holdings are RECLASSED rather than orphaned; `worldPulseFate` is the natural
> input to the reclass chain's first link. **THE GAP, named:** there is no
> holdings field to hand off *today*, because holdings do not exist — and note
> the fate function uses the same UNANCHORED substring style CH-1 is fixing
> elsewhere (`/yard/`, `/works/`), so DW should read `worldPulseFate` as a
> signal and never re-derive it from the name.

**T5 — the chronicle entry.** Every amalgamation, swap, partition and
dissolution obeys the **NEWS ADDRESS LAW**: address chain + typed action + names
+ reason. "In 1387 the Cordwainer household threw two burgages together on
Sheep Street after the fire on the north side." Free narrative from a geometric
fact; no new stored byte beyond the event itself.

### §4.6 · ⛔ THE COUNTER-FORCE (§500 R10.e)

A naive "prosperous households acquire" rule run for 300 years converges on ONE
owner holding the whole town. That is the population-runaway lesson (ODQ §341)
transposed onto ownership, and **it cannot show up in a single-generation test —
only in the soak.** The charter therefore compiles the counter-forces as
first-class, each historically grounded:

| Counter-force | Fires on | Grounding |
|---|---|---|
| **Partible inheritance / partition on succession** | a household succession event | the standard continental partible regime; the English impartible one is the CULTURE axis, which is why §7 B12 is per-culture |
| **Decline and debt sale** | a sustained distressed streak | `institutionLifecycle.js`'s own `closeChance` machinery (L620) already models exactly this shape |
| **Institutional dissolution** | closure | measured at `institutionLifecycle.js:1006-1024` |
| **Forfeiture / escheat** | a crime or a failure of heirs | R-INST-6's tolerance ladder; R-INST-3's Dissolution (1536-40) as the mass case |
| **Fire and abandonment** | a calamity | `conditionOf`'s `burned`/`ruined` rungs (§0 H24), already derived |

**And the control is a SOAK ARM, not a hope** — §6 DW-S gains it.

## §5 · THE WAVES — DW-1..DW-7, THE ESTATE WAVE, DW-S

The parent's §9 table recompiled as an executable plan. Each wave is a set of
CARS; each car is a packet under the estate's landing law: **≤3 production files,
a leaf ≤250 effective lines**, its own acceptance, its own gate, its own commit.
Sizes are estimates from §2's counts and §0.4's headroom, and they are the
compile's own figures, not the parent's rough scale.

**Landing posture.** DW-1 through DW-6 and the ESTATE wave land **DARK**: the
leaves exist, the vocabularies are frozen, the derivations run in tests, and
nothing is wired to a drawn surface or to the generation path. DW-7a is the
single **LIGHT** wave. That posture is what makes the flag bill ONE (§0.5) and
what makes DW-1..DW-6 golden-inert by construction.

### §5.0 · The wave table

| Wave | Cars | Depends on | Dark/Light | Declared same-seed shift |
|---|---|---|---|---|
| **DW-R** (corpus) | 3 | DW-0 signed | n/a (docs + fixtures) | none |
| **DW-1** vocabularies + rosters | **6** | CH-1/2/3 landed | dark | **none** (inert enums) |
| **DW-2** geometry core | **5** | DW-1; the cartography stage | dark | none (derivations run only in tests) |
| **ESTATE** (§496/§498/§500) | **6** | DW-2 | dark | **YES — the drawn map of every settlement** |
| **DW-3** fixtures + dressing | **3** | DW-1/2 | dark | none |
| **DW-4** undercity seam | **2** | undercity landed (UC-0..UC-4 all LANDED); UC-5 for routes | dark | none |
| **DW-5** validator + continuity | **4** | DW-2..4 | dark | none |
| **DW-6** projections | **5** | DW-2..5 | dark until 7a | none |
| **DW-7** deltas, news, estate view, ACTIVATION | **4** | DW-6 | **7a is LIGHT** | **YES — the click surface** |
| **DW-S** the soak leg | **3** | DW-5 | dark (findings only) | none |
| *(MP-1, §495)* | *(map train)* | — | light | yes (a new paint op) |

**Total: 41 cars.** At the estate's observed landing cadence that is the
one-third-to-one-half-of-the-map-program scale the parent estimated, confirmed
from the compile rather than assumed.

---

### §5.1 · DW-R — the corpus (3 cars, docs and fixtures only)

| Car | Content | Acceptance |
|---|---|---|
| **DW-R1** | `DWELLING-SPEC.md` — the nine laws elaborated to buildable contracts, ODQ rulings folded, architected-vs-built marked on every row | chair-signed; a doc-agreement pin that slices the SECTION on both sides and compares ordered `name@version` lists (never a whole-document `includes()` — that pin goes vacuous on the doc's own prose) |
| **DW-R2** | **The `ProgramMinimum` table**, one row per catalog row per tier it fires at, each with its dossier citation (§3.2's 16 rows are the worked exemplars; the full table is ~311 × tiers-it-fires-at) | a walker: every catalog row that can fire at a tier has exactly one `ProgramMinimum` row, and every row carries a citation string |
| **DW-R3** | The parti catalog with weights + the measured distributions from P1c | the pre-registered benchmark's refutation rules, REGISTERED BEFORE generation |

**DW-R2 is the long pole of this wave and the owner's band sitting depends on
its shape, not its completeness** — §7 B1 signs the *policy*; DW-R2 fills the
table under it.

---

### §5.2 · DW-1 — vocabularies and rosters, dark (6 cars)

§2 counts 83 cell kinds, 81 fixture kinds, 48 partis, 9 circulation classes with
~55 sub-forms, ~35 storage sub-forms and 6 adjacency polarities. That is far too
much for one car, and §0.4 shows the constraint is the packet law, not eslint.
Split by CONSUMER, so each car's blast radius is one reader set:

| Car | Content | Files | Census cost |
|---|---|---|---|
| **DW-1a** | The CELL vocabulary: `ROOM_KINDS` 28 → 83 (retire `stall`, §0 H7); the WALL pin's allowlist | `interiorTemplates.js` + 1 new `cellVocabulary.js` + its test | +1 title (a membership walker), the enum count moves inside an existing pin |
| **DW-1b** | The FIXTURE vocabulary 22 → 81, plus `RECESS` and `SUBDIVISION` as their own constructs | `interiorTemplates.js` + 1 new + test | +1 title |
| **DW-1c** | The PARTI enum (48 members incl. `GATED_COURT_RING` with its four attributes) | 1 new `partiCatalog.js` + test | +2 titles (membership; the `GATED_COURT_RING` instance list) |
| **DW-1d** | `CirculationCell` + the class/sub-form/licence/bucket tables | 1 new `circulationVocabulary.js` + test | +2 titles |
| **DW-1e** | `StorageCell` + the six adjacency polarities + the general store prohibition | 1 new `storageVocabulary.js` + test | +2 titles |
| **DW-1f** | The three RELATIONS as typed records — `hostedIn`, `NO_BUILDING`, `occupies` — plus `CompoundMember` (§2.6a **+ `PARTY_WALL`, `ENCROACHMENT`, `CHIEF_RENT`** from §500 R10.c) | 1 new `relations.js` + test | +3 titles |

**Shift: none.** Every car adds a frozen array and a typedef that nothing on the
generation path reads. `interiorTemplates.js` is touched by 1a and 1b; at 124
effective with 676 of headroom (§0.4) it absorbs both.

> ⚠ **THE CENSUS COST IS REAL AND IT IS BOUNDED.** Measured this lane: the
> banked-failure ratchet `scripts/.test-ratchet-baseline.json` holds **11
> entries** against `CEILING = 17` (`tests/lint/testRatchet.test.js:181`) — so it
> has BURNED DOWN from the 17 a stale memory records, and there are **6 of
> headroom**. That headroom is for BANKED FAILURES, not for new titles: DW's
> +11 titles across DW-1 are ordinary census growth, and every car must carry its
> own census delta. A parked test file swallows its titles, so a delta smaller
> than the titles added is NOT arithmetic to accept.

---

### §5.3 · DW-2 — the geometry core, dark (5 cars)

The hardest wave, and §0.4 rules that it must land in NEW leaves beside
`interiorModel.js` (249 eff) rather than inside it.

| Car | Content | Depends on |
|---|---|---|
| **DW-2a** | **The frontage reader** — read the wedge's outer edge (§0 H19), return the ORDERED frontage list with kinds and status grades, including `COURT` and `CAUSEWAY` and `ORIENTED_AXIS`; compute `frontageBucket` | DW-1c |
| **DW-2b** | **The vertical partition** — `Storey[]` from the massing envelope; double-height cells; the storey-height bands (which may DESCEND, R-INST-4); `privacyDepth` from the stair grammar | DW-1a |
| **DW-2c** | **Parti placement** — the eligible-set filter (program, then frontage, then era/culture), then the weighted draw; `PartiModifier` (the wrap); `zoning` and `precinct` as institution kinds | DW-2a, DW-R2 |
| **DW-2d** | **Circulation over the placed cells**, in the CIRC addendum's two steps (required-by-kind, then optional-with-`mintedBy`); the SECOND subordinate entrance | DW-1d, DW-2c |
| **DW-2e** | **Storage and service cells** with the polarity set and the absence proof | DW-1e, DW-2c |

**Shift: none.** All five run only in tests; nothing calls them from a drawn
surface until DW-6/DW-7a.

---

### §5.4 · ⭐ THE ESTATE WAVE (§496, §498, §500) — 6 cars, and it is the one that moves the map

**Where it sits: between the geometry core (DW-2) and the fixtures wave (DW-3)**
— chair ruling R6. It is the wave that turns "buildings in plots" into
"properties".

| Car | Content | Depends on |
|---|---|---|
| **EST-1** | **The `ProgramMinimum` table lands as data** (DW-R2's output becomes a frozen module) with its walker | DW-R2, DW-1f |
| **EST-2** | **Allocation with merge** — §4.2's six steps; the intra-edge union only; the bounded union count; the digest-driven order preserved; the REPORTED CONTRADICTION path | EST-1, DW-2a |
| **EST-3** | **The draft on assembled ground** — one draft per state, no draft-then-redraft (§498 R9a); the program-driven placement replaces nothing that exists, it precedes it | EST-2, DW-2c |
| **EST-4** | **Ownership: the `Estate` contract**, `owns`/`occupies` on the member row, `ownerRef` as an institution anchor or `ANONYMOUS_FABRIC` (§3.4's measured gap) | DW-1f |
| **EST-5** | **Accretion and the reverse motions** — acquire/swap/partition/dissolve; the remembered-seam un-merge (§500 R10.b); the typed shared conditions (R10.c); `reclassedTo[]` fed from `worldPulseFate` (§4.5's measured seam) | EST-4, EST-2 |
| **EST-6** | **The embellishments** — the yard-fixture vocabulary keyed to institution function × prosperity × `conditionOf` × season, with the wear ladder (§2.7) | DW-1b, EST-3 |

**⛔ THE DECLARED SAME-SEED SHIFT.** EST-2 and EST-3 together **change the drawn
map of every existing settlement**: parcels merge, footprints move, buildings
that could not pack now can, and the multiplicity receipts change. This is a
ONE-TIME, DELIBERATE shift. The goldens that move must be named in the packet
and re-recorded with the cause stated. **Nothing else in the DW program moves a
same-seed byte.**

> ### ⛔ THE SEQUENCING CONSTRAINT THE OWNER MUST SEE
>
> **This wave changes the drawn map of every existing settlement. The endgame
> plans exactly ONE REGEN before the terminal soak (the tail order, ODQ §341 /
> §456). THIS WAVE MUST LAND BEFORE THAT REGEN OR IT FORCES A SECOND ONE.**
> It is restated in §7 as the first thing the owner reads, because it is a
> scheduling decision, not an engineering one.

**MP-1 IS THIS WAVE'S MAP-SIDE CONSUMER, AND THE TWO ARE NEVER BUILT TWICE.**
MP-1 (§495) draws the property line from what exists TODAY — the parcel
polygon, and the yard by subtraction. When the ESTATE wave lands, **the same
overlay consumes estates, courts and typed members instead, with no UI rework**:
the overlay's interface is unchanged, only its input source, so there is never a
second truth about what a yard is (§495.5(3), and chair R6). Two additions this
charter makes to MP-1's packet:

1. **The op-count identity moves.** Measured at §0 H25: `cartographyPaint.js:15-17`
   asserts `ops.length === wards + arterials + lanes + buildings`, and L19-21
   says a parcel emits no op. A `parcel` op therefore **changes that identity**
   and every test pinning it. §495.4(a) calls it "an INSERTION, not surgery" —
   true of the back-to-front ORDERING, false of the length identity. MP-1 owes
   the identity edit.
2. **The halo gains TWO TIERS** (§498 R8c) — and this is a product win for free:
   hovering any member highlights **its property line strongly AND the estate's
   other holdings faintly**. Hover the merchant's house and every plot they hold
   lights up across the town. One hover, two tiers, no new data — the estate's
   member list is already in hand.

---

### §5.5 · DW-3 — fixtures and dressing, dark (3 cars)

| Car | Content |
|---|---|
| **DW-3a** | Typed fixtures per function at the prosperity/wear grade; `RECESS` and `SUBDIVISION` placement |
| **DW-3b** | Supply-state variants — the stalled chain's COLD FORGE (R-INST-2 gap 16 calls it "the cleanest S7 demonstration"), the empty granary floor, the dark exchange vault |
| **DW-3c** | The abstract/named projection split (player tier abstract, DM tier named-and-stated) |

---

### §5.6 · DW-4 — the undercity seam, dark (2 cars)

| Car | Content |
|---|---|
| **DW-4a** | **The surface joint** — resolve `frontFor(seed).anchor` (§0 H16) to a building, draw the stair/hatch/sealed arch on the SURFACE side. Measured: this is ONE joint kind at ONE anchor for eleven of twenty-eight criminal rows (§1.1 law 7). The DOWN-STAIR DIAGNOSTIC licenses it. |
| **DW-4b** | **The honesty clause** — while UC-5 is unbuilt (§0 H14), the projection states that components are drawn but routes are not. Two rows point AWAY from the seam and must not be dragged into it: the rookery's loft (a ROOF joint the vocabulary lacks, E13) and the whisper market's transcription cell (which wants the best window). |

DW-4 has **no dependency on UC-5** by construction: it draws components, not
edges. When UC-5 lands, DW-4b's clause is deleted in a one-line follow-up.

---

### §5.7 · DW-5 — the validator suite and continuity, dark (4 cars)

| Car | Content |
|---|---|
| **DW-5a** | The lawfulness walker: floor satisfied, ceiling respected, every cell licensed, **every absence reasoned**, geometry legal, vertical partition exact |
| **DW-5b** | **The reachability + ABSENCE + SEVERABILITY suite** — S9 must prove a refused joint is NOT there, must accept `approach: NONE` (the anchorhold) and `HATCH_ONLY` (the prison pit), and must certify a **zero-cell plan and a zero-storage plan as LAWFUL with a reason** (R-INST-5 §Σ.1's explicit validator requirement) |
| **DW-5c** | The continuity arm: core-function anchors persist across single-band changes; the stable key for a hosted function is the HOST's (§1.1 law 4) |
| **DW-5d** | The arithmetic arms: `furnaces ≤ flues + portableFurnaces` (R-INST-5 R5); **every concealed cell debits its host's area and the sum checks** (the fix for §0 H9's CORRECTED reading); crowd egress reconciled with capacity (R-INST-4 item 13) |

---

### §5.8 · DW-6 — projections, dark until 7a (5 cars)

| Car | Content |
|---|---|
| **DW-6a** | The on-click pane, lazy (the vendor-lazy contract), player/DM tiers |
| **DW-6b** | The PDF chapter, multi-floor pages |
| **DW-6c** | **FOUNDRY SCENES WITH WALL DATA** — extends `interiorExport.js` (53 eff, 747 headroom). The VTT gap the market measurably wants. |
| **DW-6d** | **The parcel ring + compound member polygons** for the map's property-line halo (§494) — the surface MP-1's overlay switches onto |
| **DW-6e** | The estate view: the parcel's buildings top-down with the main plan opened |

Open question Q2 of the parent (§14) is **ruled here: the estate view is DW-6e,
not a fabric deliverable** — it reads the cartography block, which is DW's chosen
parcel world (§0.3), and putting it in the fabric would fork the two.

---

### §5.9 · DW-7 — deltas, news, activation (4 cars; 7a is the only LIGHT car)

| Car | Content | Posture |
|---|---|---|
| **DW-7a** | **ACTIVATION.** The click surface lights behind ONE flag. The exhibit gate is the owner's before/after sitting; there is no legacy to cut, so the cut counterpart is the blind-panel benchmark passing plus the owner's word. | **LIGHT — mints the program's ONE flag; the SIX-surface bill of §0.5 is paid here, once** |
| **DW-7b** | `PlanDelta` — the only stored artefact; replayed at S12-post; the **strict no-op test** (an empty delta produces byte-identical output and consumes zero rng) | dark |
| **DW-7c** | News hooks: renovations emit news back under the NEWS ADDRESS LAW; the amalgamation/partition/dissolution chronicle entries of §4.5 T5 | dark |
| **DW-7d** | The ENDOWMENT / LICENCE event stream (R-INST-3 §Σ.2 item 2, load-bearing at seven witnesses) — the input every upgrade from NO_BUILDING to OWN BUILDING actually depends on | dark |

---

### §5.10 · Landing order, with dependencies by id

```
DW-R1 → DW-R2 → DW-R3
DW-1a,b,c,d,e (parallel) → DW-1f
DW-2a (needs 1c) → DW-2b (1a) → DW-2c (2a, R2) → DW-2d (1d, 2c) → DW-2e (1e, 2c)
EST-1 (R2, 1f) → EST-2 (1, 2a) → EST-3 (2, 2c) → EST-4 (1f) → EST-5 (4, 2) → EST-6 (1b, 3)
DW-3a,b,c  →  DW-4a → DW-4b
DW-5a → DW-5b,c,d
DW-6a..e   →  DW-7b,c,d  →  DW-7a  (LAST; the only light car)
DW-S1,2,3 after DW-5
```

Two ordering rules that are not negotiable:

1. **CH-1/2/3 land before DW-1a.** The `interiorKind` override CH-1 mints is the
   hook `hostedIn` and `NO_BUILDING` attach to (§0.6).
2. **DW-7a lands LAST**, after the ONE trailing OSR mint's inputs are stable —
   because it is the only car that changes what a user sees.

## §6 · DW-S — THE SOAK LEG (§456)

The 300-year soak — the diagnostic soak at build-complete-dark and the terminal
soak before the tuning signature — gains a DWELLINGS LEG. At every soak epoch,
every building's plan is re-derived and every settlement's ownership is read.
**Findings only: never a cure in the soak tree.**

Three cars: **DW-S1** the per-epoch re-derivation harness; **DW-S2** the
assertion arms; **DW-S3** the findings report the tuning pass consumes.

### §6.1 · What the leg asserts, per epoch

| # | Arm | The assertion | Why this arm exists |
|---|---|---|---|
| **A1** | **Boundedness — cells** | cell counts per building stay inside a per-tier band; the band never ratchets upward across epochs | the population-runaway lesson (ODQ §341) applied to interiors: a plan that grows a cell every fifty years is a runaway nobody would see in a single-generation test |
| **A2** | **Boundedness — churn** | re-derivation CHURN (cells added + shed per epoch) stays inside a band | law 5's anchor stability is a claim about churn, and a claim about churn is only testable over time |
| **A3** | **Boundedness — fossils** | fossil counts never runaway | a fossil is permanent by construction, so an unbounded fossil rate is the one way law 5 can eat a plan |
| **A4** | **Determinism** | same epoch, same seed ⇒ byte-identical plan | THE PROMISE, and the precondition of every other arm |
| **A5** | **The continuity arm** | core-function anchors persist across SINGLE-BAND changes over 300 years | law 5's own definition of renovation-not-replacement |
| **A6** | **Lawfulness** | the S12 walker is green on every sampled plan, at every epoch | a plan that becomes unlawful in year 180 is the failure the walker exists to catch and a single-shot test cannot |
| **A7** | ⛔ **OWNERSHIP BOUNDEDNESS** (§500 R10.e) | over 300 years the spread of holdings stays inside a band at **both** ends | see below — the highest-value arm in the leg |
| **A8** | **Reverse-motion determinism** (§500 R10.f) | replaying the same seed to the same year reproduces the same holdings byte-for-byte, and **no reverse motion rewrites what an earlier year recorded** | THE PROMISE applied to ownership; split/swap/dissolution are dated events in an immutable record |
| **A9** | **Accretion never rewrites a lived range** (§498 R9b) | for every property that grew, every range present at epoch N is present and unmoved at epoch N+1 | this is the constitutional arm: it is the mechanical statement of "lived history is immutable" |

### §6.2 · ⛔ A7 IN DETAIL — the consolidation runaway and its control

**The failure this arm exists to catch.** A naive "prosperous households acquire"
rule, run for 300 years, converges on ONE owner holding the entire town. It is
the population-runaway lesson transposed onto ownership, and it is invisible to
every test the estate runs today because every one of them is single-generation.

**The band, at both ends:**

| End | Measure | Failure it catches |
|---|---|---|
| **Consolidation ceiling** | the largest single owner's share of a settlement's parcels, per epoch | runaway acquisition — one estate eating the town |
| **Fragmentation floor** | the MEAN holding size (parcels per estate), per epoch | runaway partition — an over-strong inheritance rule dissolving every estate to singletons |

Both are reported per epoch and both are **tuning-pass inputs beside the 300-year
population runaway and the map leg (P7)**. The owner sits the band that governs
them at §7 B12.

**Why a band and not a target.** The historical record has both — the great
consolidating estates and the partible-inheritance regions that fragmented — and
which one a settlement gets is a CULTURE fact, not a bug. The arm therefore
asserts the distribution stays inside a signed band; it never asserts a number.

### §6.3 · How the findings reach the tuning pass

DW-S3 emits a findings report, in the shape the map leg (§341) already
established, with:

- the per-epoch series for every arm above, so a drift is visible as a slope and
  not only as a threshold breach;
- the **first epoch** at which any band was approached (not only breached) —
  approaching is the signal, breaching is the failure;
- the settlements at the extremes of each distribution, named, so the tuning
  pass can open them;
- an explicit statement of which arms were NOT exercised in this soak (a
  settlement with no amalgamation event in 300 years exercises A7 vacuously, and
  a vacuous arm must announce itself — the pin-vacuity family).

**The leg's own gate is the soak's, and its findings are advisory.** Nothing in
DW-S changes a value; the tuning pass, owner-signed, does that.

## §7 · ⭐ THE OWNER'S BANDS — THE SITTING DOCUMENT

**This section is what DW-0 exists to produce.** Everything above it is
preparation. Read it in one pass: each band is a decision you can make in a
sentence, with a recommendation you can accept by saying nothing and reject by
saying one word.

Every formula is translated. No band asks you to read code.

---

### ⛔ READ THIS FIRST — THE ONE SCHEDULING DECISION

**The ESTATE wave changes the drawn map of every settlement that already
exists.** Parcels merge into properties; buildings move to fit their institution;
yards and courts appear. That is a one-time, deliberate change and it is the
point of the wave.

**The endgame plans exactly ONE regeneration before the terminal soak.** If the
ESTATE wave lands *before* that regeneration, the change rides it for free. If it
lands *after*, **it forces a second regeneration**, which the tail order does not
have room for.

> **The decision: the DW arc — and specifically the ESTATE wave — must land
> BEFORE the ONE REGEN.** Everything in §5's ordering assumes you agree. If you
> want the DW arc to slip past the regen, say so now, because it changes the
> whole endgame tail and not just this program.

---

### HOW TO READ A BAND

| Field | Means |
|---|---|
| **Controls** | what visibly changes in the product |
| **Range** | the honest span; the ends are real options, not padding |
| **Recommend** | what this charter proposes, with the research behind it |
| **Low end** | what the world looks like if you go down |
| **High end** | what it looks like if you go up |

---

### GROUP A — HOW MUCH BUILDING EXISTS AT ALL

#### **B1 · THE MINIMUM PROGRAM POLICY** — *the most consequential band in this document*

| | |
|---|---|
| **Controls** | How grand a town inn, a guildhall, a hospital looks. It is the answer to "you can't have a one-room inn." |
| **Range** | **SPARE** (the floor only: the cells the type cannot function without) · **HONEST** (the floor plus what the record shows was normal) · **GENEROUS** (the record's well-appointed example) |
| **Recommend** | **HONEST.** |
| **Why** | The research measured real minimums rather than guessing them. A town inn's honest minimum is *hall + kitchen + service pair + N chambers + stabling + hayloft over + a yard entered through a carriage passage* (R-INST-4 §3). A collegiate chamber is *four men to a chamber, each with a study closet of three-and-a-half to five feet by four-and-a-half to six* (Willis & Clark, measured). Those are not opinions; they are what the buildings were. |
| **Low end** | Buildings read thin. A town inn with a hall and two chambers is defensible and disappointing. |
| **High end** | Every institution looks like its best surviving example, which is the museum-piece problem: real towns were mostly ordinary. |

#### **B2 · THE VERDICT SPLIT — how many institutions get a building of their own**

| | |
|---|---|
| **Controls** | Whether clicking an institution usually opens a floor plan, or usually opens "this has no premises; it works out of X". |
| **Range** | The research's own numbers are the honest anchor. Counted off the tranches' verdict tables: the criminal shelf gives **3 of 28** their own building and **11 of 28** no cell anywhere; the trade shelf has **~30 of 124** with no building at the floor, four of them REQUIRED rows; hospitality has **14 of 40** hosted-or-nothing. |
| **Recommend** | **Follow the research exactly. Do not soften it.** |
| **Why** | Softening it means drawing a building where the record says there was none, which is the quiet lie the whole estate exists to eliminate. And the alternative reads *better*, not worse: "the fence keeps no premises — he works the pawnbroker's counter on Cordwainer Lane" is a more interesting click than a generic two-room box. |
| **Low end** | If you push toward more buildings, the map fills with sheds nobody built. |
| **High end** | If you push toward fewer, small settlements start to feel empty even where the record says a building stood. |

#### **B3 · FRONTAGE BUCKETS — which partis a plot can hold**

| | |
|---|---|
| **Controls** | Which building shapes are even eligible on a given plot. Wide plots get halls parallel to the street; narrow plots get halls at right angles running back. |
| **Range** | The measured anchors: a shop cell is **6–10 ft** of frontage; the extended parallel-hall parti "needs a fairly large frontage, of say **30 to 50 feet**" (Pantin, primary). Buckets: `SHOP 6–10 ft` · `NARROW 10–20` · `STANDARD 20–30` · `WIDE 30–50` · `GRAND 50+`. |
| **Recommend** | **Adopt these five buckets as measured, and accept the honest caveat below.** |
| **⚠ The caveat you should know before signing** | Our plots are **fan wedges of a ward**, not narrow-deep burgage strips (§0.3). So the buckets are measured on the right numbers but applied to a shape the historical record never produced. Making the shape right is a fabric re-shape outside this program. This is the charter's single largest fidelity compromise and you are entitled to know it before you sign the buckets. |
| **Low end** | Narrower buckets = more right-angle plans = a denser, more medieval townscape. |
| **High end** | Wider buckets = more parallel halls = a grander, later-looking townscape. |

---

### GROUP B — HOW BIG AND HOW TALL

#### **B4 · THE PROSPERITY LADDER FOR INTERIORS**

| | |
|---|---|
| **Controls** | How much a rich settlement's buildings differ from a poor one's. |
| **Range** | Today the interior sees only **three** prosperity values — 0.9 rich, 0.5 middling, 0.2 poor, defaulting to middling (measured, §0 H27). The map already has a **seven-rung** ladder (subsistence → opulent). |
| **Recommend** | **Adopt the map's seven rungs for interiors too.** |
| **Why** | Two different prosperity readings in one product is a second truth waiting to disagree. The richer ladder is already derived and already signed. |
| **Low end** | Keeping three buckets: cheap, and the middle of the range goes flat. |
| **High end** | Seven rungs: a "comfortable" town and a "prosperous" one visibly differ, which is what prosperity is for. |

#### **B5 · WHAT PROSPERITY BUYS, IN ORDER**

| | |
|---|---|
| **Controls** | The order in which a building improves as its settlement gets richer. |
| **Recommend** | **Walls first, then separation, then duplication** — the parent's law 1, confirmed by R-INST-4's own dated sequence (the King's Head: hall → parlours → "new building"; Chichester: open hall → two-room houses with chimneys). |
| **⚠ One finding worth knowing** | **Walls and heat arrive TOGETHER** — and go together in reverse as decline. That is measured, not stylistic, and it means the shedding order below is not the improvement order run backwards. |

#### **B6 · THE SHEDDING ORDER — what decline takes away first**

| | |
|---|---|
| **Controls** | What a struggling settlement's buildings lose, and in what order. |
| **Recommend** | **Perishables → process fixtures → movable plant → never the excavated features.** A ruined tannery has drying frames and no hides; an abandoned one has neither; but the tan pits stay forever and become the fossils history reads. |
| **Why** | This is R-INST-1's "what decline sheds first" bound to the wear ladder the engine already derives (`sound → worn → damaged → burned → ruined`, measured at §0 H24). Nothing new is invented. |
| **Alternative you might prefer** | Shedding ROOMS before fixtures — buildings visibly shrink in a decline. It is more dramatic and less true: real buildings kept their rooms and lost their contents. |

#### **B7 · STOREY HEIGHTS, AND WHETHER THEY DESCEND**

| | |
|---|---|
| **Controls** | The proportions of every multi-storey building. |
| **Range** | The best-measured example in the whole corpus is the Fortune playhouse contract of 8 January 1600: **12 ft, then 11 ft, then 9 ft** — the storeys get SHORTER going up. |
| **Recommend** | **Let the ladder descend by default, and reserve the tall-upper-floor (the *piano nobile*) for the parti families that actually had one.** |
| **Why** | The common instinct is "status rises with height". The record disagrees for the buildings ordinary people used: at an inn the worst bed is over the gate; at a playhouse the cheapest seats are highest. The grand upper floor is a specific continental palace convention, not a general rule. |
| **Low end** | Uniform storeys: simple, and every building looks slightly institutional. |
| **High end** | Strongly descending: characterful, and it makes top floors cramped everywhere, which is right for inns and wrong for palaces. |

---

### GROUP C — PROPERTIES, ESTATES AND TIME

#### **B8 · WHEN PLOTS MERGE**

| | |
|---|---|
| **Controls** | How often two plots become one property, and therefore how many big properties a town has. |
| **Range** | A prosperity threshold (which rung must a holder reach before acquisition is possible) crossed with a rate (how often it fires per century). |
| **Recommend** | Acquisition possible from the **`prosperous`** rung upward; a base rate tuned so a typical town sees **amalgamation on a small minority of its main-street plots over 300 years**. |
| **Why** | Plot amalgamation is historically real — Gloucester's main street had "large plots, most of them occupied by inns" — but it is a main-street phenomenon, not a townwide one. |
| **Low end** | Rare merging: the town stays a grid of equal plots; tidy, and it loses the main-street grandeur that is one of the map's best readings. |
| **High end** | Common merging: main streets become impressive and back streets empty out; past a point one holder owns everything, which is what §6's soak arm is there to catch. |

#### **B9 · ACQUISITION VERSUS PARTITION — the balance that decides everything**

| | |
|---|---|
| **Controls** | Whether a town's property over 300 years drifts toward a few great holdings or many small ones. **This band, more than any other, decides what a 300-year-old town looks like.** |
| **Range** | A single dial: acquisition strength versus partition strength, per culture. |
| **Recommend** | **Roughly balanced, with the balance set PER CULTURE**: a partible-inheritance culture fragments and an impartible one consolidates, and both are historically right. |
| **Why** | Set them by feel and the soak will find the answer for you: a naive "the rich acquire" rule run for 300 years ends with one household owning the town. §6's arm A7 measures the spread at both ends every epoch and reports it as a tuning input beside the population runaway. |
| **Low end** | Partition dominant: every estate dissolves to single plots; the town is flat and slightly implausible. |
| **High end** | Acquisition dominant: the consolidation runaway. |

#### **B10 · HOW OFTEN AN OWNER CEASES**

| | |
|---|---|
| **Controls** | How much reuse and how many fossils a 300-year-old town carries — the bath that became a brothel that became a tannery that became a dwelling. |
| **Recommend** | **Read it from the existing closure machinery rather than adding a new dial.** The engine already closes institutions under sustained economic distress, already assigns each a *fate* (`shuttered`, `bankrupt`, `closed_for_want_of_custom`), and already keeps the closed row as a **remnant** rather than deleting it (all measured, §4.5). Holdings hand off cleanly at that point. |
| **Why** | A second dissolution dial would be a second truth about why institutions die. |
| **If you want more reuse** | Raise it in the existing closure tuning, not here. |

#### **B11 · NON-CONTIGUOUS HOLDINGS — how common is the merchant with a house and a quay warehouse?**

| | |
|---|---|
| **Controls** | Whether hovering one building lights up plots across the town, or almost never does. |
| **Range** | Rare · occasional · common, per culture. |
| **Recommend** | **Occasional, and more common in ports and trading cities.** |
| **Why** | The scattered holding is the mercantile pattern; a farming village's holder holds one yard. |
| **⚠ A limit you should know** | Today the engine can hang an estate on an **institution**, because institutions have a permanent identity. It **cannot** hang one on a household: there is no household record anywhere in the engine (measured — the grep returns nothing, and dwellings are explicitly anonymous filler). So "the merchant family with three plots" needs a household identity that does not exist yet. This charter deliberately does **not** invent one; it is deferred with the measurement written down (§9 D-3), because minting a household is a persistence-shape decision and therefore yours. |
| **The consequence today** | Estates work for institutions — the abbey with its grange, the guild with its hall and its warehouse. Family holdings wait. |

#### **B12 · PARTY WALLS AND ENCROACHMENTS — how messy is the property line?**

| | |
|---|---|
| **Controls** | Whether split properties produce clean lines or shared walls, overhanging ranges and chief rents. |
| **Recommend** | **Common in dense urban wards, rare in villages.** |
| **Why** | Party walls were the urban norm and were legislated for: London's 1189 regime specified three feet of stone, shared cost and written light-easements. An overhanging range with a small standing rent is exactly the kind of detail this product sells. |
| **Low end** | Clean lines everywhere: legible and a little sterile. |
| **High end** | Messy everywhere: characterful, and it makes the halo hard to read. |

---

### GROUP D — DRESSING AND TASTE

#### **B13 · EMBELLISHMENT DENSITY — how much stuff is in the yard**

| | |
|---|---|
| **Controls** | Whether a tannery's yard shows a few hides on frames or a full working yard of pits, frames, bark store and water channel. |
| **Range** | `SPARSE` (one signature fixture per trade) · `WORKING` (the trade's actual kit) · `BUSY` (kit plus stock plus waste) |
| **Recommend** | **WORKING.** |
| **Why** | One hide on a frame reads as decoration; a working yard reads as a trade. And every fixture is derived from a fact the engine already holds — the institution's function, its prosperity, its condition, the season — so nothing is invented to fill space. |
| **⚠ The hard rule under this band, which is not negotiable** | Embellishments are **deterministic** (same seed, same hides — or the Promise and every golden break) and they **never assert a fact the engine lacks**. |

#### **B14 · FIXTURE GRADE TABLES — how good is the furniture**

| | |
|---|---|
| **Controls** | The step between a poor building's fittings and a rich one's. |
| **Recommend** | Three grades (`plain / good / fine`) crossed with three wear states (`sound / worn / broken`), driven by the prosperity rung and the condition the engine already derives. |
| **Why** | Nine combinations is enough to read at a glance and few enough to hand-check. |

#### **B15 · FIXTURE ART DIRECTION** *(parent's open question Q5)*

| | |
|---|---|
| **Controls** | What a DM sees: abstract shapes, or drawn furniture. |
| **Recommend** | **Abstract at the player tier; abstract-but-labelled at the DM tier; illustrated as a later style wave.** |
| **Why** | Abstract-furniture legibility is a strength worth respecting in the competitor's work, and the style waves come last on proven bones. This is pure taste and it is entirely yours. |

#### **B16 · FREE-TIER DEPTH** *(parent's open question Q4)*

| | |
|---|---|
| **Controls** | How much floor plan a non-paying user sees. |
| **Recommend** | **The full lawful plan free; secrets premium** — concealed chambers, undercity links, the reasons behind an absence, and the DM-tier fixture naming. |
| **Why** | The plan is the moat and it should be seen. The secrets are the DM's product. |
| **⚠ This is a paid-surface decision and therefore yours alone.** The charter proposes; it does not decide. |

---

### GROUP E — THE TWO QUESTIONS THAT ARE NOT BANDS

#### **B17 · THE NEWS THRESHOLD** *(parent's open question Q3)*

**What is newsworthy when a building changes?** Recommendation: **an
amalgamation, a partition, a dissolution and a change of use are news; a
renovation is not, unless it adds or removes a named part** (a tower, a range, a
court). Rationale: the first four have a named actor and a cause, which is what
the news address law requires; a re-floored hall has neither.

#### **B18 · THE PARTI-TO-MASSING SEAM** *(parent's open question Q1)*

**Does a parti with exterior consequences become a named massing part?**
Recommendation: **yes, but not in this program.** The belfry, the stair turret,
the tall hall window and the taking-in door column are all exterior consequences
the research confirmed, and the D5 strata wave was already designed to name
massing parts for exactly this. DW-2b emits the CLAIM (this parti wants a named
part); the massing side consumes it later. Building it inside DW would fork the
massing.

---

### THE SIGNING SHEET

Sixteen bands and two rulings. If you accept every recommendation, say so and
nothing below needs a word.

| # | Band | Recommendation |
|---|---|---|
| — | **Sequencing** | **The ESTATE wave lands BEFORE the one regen** |
| B1 | Minimum program policy | HONEST |
| B2 | Verdict split | Follow the research exactly |
| B3 | Frontage buckets | The five measured buckets, with the fan-wedge caveat known |
| B4 | Prosperity ladder | Adopt the map's seven rungs |
| B5 | What prosperity buys | Walls → separation → duplication (walls and heat together) |
| B6 | Shedding order | Perishables → fixtures → plant; excavations never |
| B7 | Storey heights | Descending by default; *piano nobile* only where the parti had one |
| B8 | When plots merge | From `prosperous` up; a small minority of main-street plots per 300 y |
| B9 | Acquisition vs partition | Balanced, set per culture |
| B10 | Owner cessation | Read from the existing closure machinery; add no dial |
| B11 | Non-contiguous holdings | Occasional; ports higher. Institutions only until households exist |
| B12 | Party walls | Common urban, rare rural |
| B13 | Embellishment density | WORKING |
| B14 | Fixture grades | 3 grades × 3 wear states |
| B15 | Art direction | Abstract now, illustrated later |
| B16 | Free-tier depth | Full plan free, secrets premium **(yours alone)** |
| B17 | News threshold | Ownership events and use-changes are news; renovations are not |
| B18 | Parti↔massing | Emit the claim; the massing wave consumes it |

## §8 · ANTI-SCOPE (AFFIRMATIVE)

Stated as what DW does NOT do, and — the affirmative half — WHO owns each thing
instead, so nothing here is a dropped thread.

### §8.1 · What DW does not do at all

| Not DW's | Why |
|---|---|
| **Named-character fates** | the product-scope law: world-only, roles never named individuals. This bites the estate contract directly — `Estate.ownerRef` may name an institution or a household, **never a person** (§498 R8a), and §3.4 records that households do not exist yet rather than inventing one. |
| **CAD / manual wall editing** | deltas are INTENTS, not geometry surgery |
| **Real-world architectural compliance** | the grammar is historical, not regulatory |
| **Generation-path writes** | THE PROMISE. A plan is a projection; nothing here writes a generation byte, ever. The one exception is the ESTATE wave's declared, one-time same-seed shift (§5.4), which changes what generation PRODUCES, not what it has already produced. |
| **Theology in temples** | culture only, the deity doctrine. Every faith parti in §2.1 is a FORM, and R-INST-3 confirms deity rank licenses nothing structural. |
| **Repo bytes before the research is taste-gated** | §456, and it is already satisfied: the research is complete and preserved. |
| **A second prosperity truth, a second fossil vocabulary, a second joint enum, a second parcel world** | each would be a fork. §7 B4, §1.1 law 5, §2.8 and §0.3 each name the ONE. |

### §8.2 · What belongs to CH (the catalog-hygiene train)

- Word-boundary anchoring of `FACET_INFERENCE`; the per-entry `interiorKind`
  override; the no-double-match walker. **CH-1.**
- The declared per-entry `magicLicense`; the three shelf-as-gate paths reading
  the licence; the leaked goods vocabulary leaving the institution gate.
  **CH-2.** R-INST-5's request R13 is CH-2's, not DW's.
- The five `minTier: 'metropolis'` rows in the city block; `religiousCenter` at
  city tier; the `priorityCategory` slip; the "MUST be downstream" prose.
  **CH-3.** R-INST-6's D6-1 (`Smuggling network`'s village-row `minTier`) is a
  CH-3 item.
- **DW's one contribution back:** `ROOM_KINDS.stall` is dead vocabulary inside
  `src/domain/interior/` (measured, §0 H7) — DW-1a removes it, because it is
  not a catalog fact.

### §8.3 · What belongs to the CONTENT train (catalog rows, owner-gated)

Each of these is a NEW catalog row or a data change, which is persistence shape
and therefore an owner gate, not a DW judgment:

- `Underground city` (L2383) and `Black market bazaar` (L2375) declare
  `facets: { subterranean }` so the sheet they describe exists
  (R-INST-6's R-INST-6-1). Golden-shifting.
- The learning gap: no school, university, library-below-metropolis,
  observatory, anchorhold or scriptorium row at any tier. R-INST-3 proposes
  three rows would close it; **no scriptorium row is wanted** (it resolves into
  carrels and study closets).
- The absent rows R-INST-4 names: leper house, soup kitchen/imaret, public
  latrine, bear garden.
- Every "catalog data observation" in R-INST-2 §Σ item 17 and R-INST-4 item 21.

### §8.4 · What belongs to MP-1 (the map train, §495)

MP-1 publishes the property line from what exists TODAY and ships before DW. DW
does not duplicate it. **The seam is stated once in §5.4 and once here:** when
the ESTATE wave lands, MP-1's overlay switches its INPUT from
`parcel-polygon-minus-footprints` to the typed estates, courts and members, and
its interface does not change. Two things this charter hands MP-1 that its own
packet does not yet carry: the op-count identity edit (§0 H25) and the two-tier
halo (§5.4).

### §8.5 · What belongs to the UNDERCITY train

- Every below-grade COMPONENT and its licence: UC-0..UC-4 (landed) and UC-2
  (landed, §0 H13).
- Every ROUTE between components: **UC-5, which does not exist** (§0 H14). DW
  draws components and says so; it does not draw edges.
- The smugglers' tunnel, which has NO front by construction
  (`front: ANONYMOUS_FABRIC` unconditionally) and therefore projects into no
  floor plan: **the map's D5 strata wave should draw it, not DW.**
- The joint vocabulary itself. DW imports the five kinds and adds only
  ATTRIBUTES (§2.8).

### §8.6 · What belongs to the FABRIC / D5 strata train

- Making the parcel the RIGHT SHAPE. §0.3 chooses the cartography wedge as DW's
  parcel world and states the compromise; turning wedges into narrow-deep
  burgage strips is a fabric re-shape.
- Naming massing parts so a parti's exterior consequence can bind to one
  (§7 B18). DW emits the claim; D5 consumes it.
- The geometry of exterior circulation. **The fabric owns the ward's, the
  street's and the yard's geometry; DW owns their JOINTS** (CIRC §6.8's seam,
  stated at DW-0 as that section asked).
- The water and sewage GRAPHS. DW owns only the well house, conduit house,
  receiver, water tower, castellum, latrine row, outfall and their joints; the
  mains, channels and cloaca are the fabric's and the undercity's (R-INST-4
  item 17 — "the DW-0 seam to state", stated).

### §8.7 · What belongs to TUNING

- Every number in §7. DW proposes; the owner signs; the tuning pass is where a
  signed number can move.
- The `smugglerShareFloor` 0.45 / `smugglerCriminalFloor` 0.35 composition,
  which leaves a 0.35–0.45 band with a tunnel and no cellar (R-INST-6 §Σ.5
  reading 6). **This charter recommends no change and flags the composition for
  the tuning pass**, where the DW soak leg will observe it directly.
- The ownership band of §6.2 / §7 B9, beside the 300-year population runaway and
  the map leg.

### §8.8 · What is DEFERRED inside DW, deliberately

Recorded here so no successor re-finds them as bugs; each has its ledger row at
§9.

- Household-owned estates (§9 D-3).
- The vertex-crossing parcel merge (§9 D-4).
- Routes between undercity components (§9 D-5) — blocked on UC-5.
- The ROOF joint kind and the WATER-LANDING joint kind (§9 D-6) — R-INST-6 E13
  and E16, both low-severity, both needing a new member of a CLOSED enum that
  another train owns.

## §9 · THE LEDGER

### §9.1 · The inherited ledger — 334 items, and they are the P1c work order

Verified by reading each dossier's own ledger header this lane:

| Dossier | Items | Header verified |
|---|---|---|
| R-INST-1 civic/defence | 18 | "final for this dossier — 18 items" |
| R-INST-2 trade/crafts | 106 | "parent items, plus the nine sub-lane lists carried verbatim… 106 items" |
| R-INST-3 faith/learning | 27 | §Σ.4, "final for this dossier — 27 items" |
| R-INST-4 hospitality/poverty/utility | 46 | "46 numbered items, built by grep over §0–§Σ, not from memory" |
| R-INST-5 magical | 54 | "54 numbered items, built by script over this dossier's own marker sentences" |
| R-INST-6 criminal | 45 | "45 numbered items, built by script over this dossier's own marker sentences" |
| R-INST-CIRC addendum | 24 | "final for this addendum — 24 items" |
| DWR1A construction history | 14 | "final for this dossier — 14 items" |
| **TOTAL** | **334** | |

**They do not overlap** (each was built over its own dossier's marker
sentences) and together they ARE the P1c work order. This charter adds no
duplicate of them; it adds the consumption rule below.

### §9.2 · ⛔ SINGLE-SOURCED FIGURES THE GRAMMAR MAY NOT CONSUME UNTIL P1c VERIFIES THEM

**The rule, stated once and binding on every wave:** a figure labelled
*digest-only*, *single-source*, *derived*, *plan-scaled* or *NOT FOUND* may be
carried in `DWELLING-SPEC.md` as a bounded endpoint with its label attached, but
**no generator weight, bucket boundary or validator threshold may be set from
it** until P1c re-verifies it against a primary. A bucket whose endpoint is a
digest is a bucket that will move.

**The three OPEN WIDTHS the brief singles out** (CIRC §6.10's list, the ones the
grammar most wants and least has):

| Figure | Status | Where a primary would come from |
|---|---|---|
| The gate passage's stated CLEAR WIDTH | **DERIVED** — from two portcullis leaves (one surveyor) minus a PLAUSIBLE groove depth; the barbican widths assume the RCHME figures are external, which is unstated | RCHME/Cadw measured surveys of a named gate |
| The ALLURE (wall-walk) width | bounded 0.7–1.5 m from a sub-lane, no prescriptive text | a measured castle survey |
| The MURAL gallery / barracks corridor / lobby width | **NOT FOUND** at every attempt | Rochester and Monk Bar measured surveys; a barracks plan |

**Digest-only figures that are load-bearing and must be labelled wherever they
appear:** Hardwick's long gallery (166 vs 162 vs 140 ft, and the width 22–40 ft
resting on ONE caption); Haddon 110 × 17 ft and The Vyne 74 × 16 ft (the only
GENTRY gallery widths in hand, digest only, pages unidentified); the Dartmoor
longhouse passage 0.8–1.5 m (plan-scaled, ±0.1–0.15 m); the Rose's gallery width
(Gurr/Orrell's INFERENCE from outer and inner walls, not an excavated
measurement); Teatro Farnese's 87 × 32 × 22 m (digest only); the Hope's
10-sided 16/24 m plan (Historic England Cloudflare-gated, digest only).

**One INDEPENDENCE caveat worth carrying forward**, because it is the sort of
thing a grammar quietly launders into two sources: the Fortune contract's
figures reach us through two pages that **both derive from one primary**
(Dulwich College, Henslowe-Alleyn Muniment 22). It is one primary read through a
scholarly transcription, not two sources. It is still the best-measured building
in the corpus.

### §9.3 · DEFERRALS — documented, NOT bugs to re-find

| # | Deferred | Rationale | Where it is written |
|---|---|---|---|
| **D-1** | Making the parcel the RIGHT SHAPE (narrow-deep burgage strips) | a fabric re-shape, outside DW; §495.5(1) already says the wedge is not a burgage plot | §0.3, §8.6, and it is surfaced to the owner at §7 B3 |
| **D-2** | The op-count identity edit is MP-1's, not DW's | MP-1 ships first and emits the first parcel op; DW-6d inherits the edited identity | §0 H25, §5.4 |
| **D-3** | **Household-owned estates** | **MEASURED: there is no household identity in the engine.** `git grep -niE "householdId\|household_id" claude/composite-r4 -- src` returns zero rows; demography is aggregate (`demographicsKernel.js` exports one function, `advanceDemographics`); dwellings are explicitly anonymous filler (`cartographyBuildings.js:9-10`, ids `carto:dwelling:<wardId>:<ordinal>` at L363). Minting a household identity is a **persistence-shape act and an owner gate**, not a DW judgment. | §3.4, surfaced to the owner at §7 B11 |
| **D-4** | The vertex-crossing parcel merge | it yields a QUADRILATERAL, and `cartographyBuildings.js`'s medial-subdivision-into-four theorem does not apply to a quad. Admitted only behind its own proof car. | §3.4 |
| **D-5** | ROUTES between undercity components | UC-5 `connectivity.js` does not exist at any ref (measured). DW-4b states the limit in the projection instead of implying connectivity. | §1.1 law 7, §5.6 |
| **D-6** | The ROOF joint kind (E13) and the WATER-LANDING joint kind (E16) | both need a new member of the undercity's CLOSED five-member enum, which another train owns. Low severity: two rows and a removal route. | §2.8, §8.8 |
| **D-7** | The 0.35–0.45 smuggler band (a tunnel with no cellar) | R-INST-6 recommends no change and flags it for the tuning pass; the DW soak leg will observe it directly | §8.7 |
| **D-8** | Illustrated fixture art | a style wave, last, on proven bones | §7 B15 |

### §9.4 · JUDGMENT CALLS — vetoable, each with its rejected alternative and its reversal

> **Decisions delegated under the §464 grant (carve-outs by nature stand: legal,
> cull, the tuning signature, each push). Each is vetoable by one word. All
> favour the owner's stated values — coherence over convenience, bold
> architecture over patches, and never a quiet lie.**

**J1 — DW builds on the CARTOGRAPHY SYNTHESIS parcel world, not the fabric first
slice.**
*Why:* it is the only world with a parcel for every building of every
settlement, it already carries the polygon, the building→parcel key and a
derivable frontage edge, and its containment is a theorem.
*Rejected:* the fabric first slice — its frontage law is right but it produces
**two** building masses on **one** synthetic orthogonal-cross plan
(`massingRoster.js:1`), so DW would have no parcels to build on.
*Reversal:* DW-2a's frontage reader is the only car that binds to the choice;
re-pointing it is one car.
*Blast radius:* nothing existing changes — DW-1..DW-6 are dark; the ESTATE wave
is where the choice becomes visible, and its shift is declared.

**J2 — ONE parti primitive, `GATED_COURT_RING`, absorbs fifteen separately
proposed partis.**
*Why:* six tranches from six literatures reached the same plan and two of them
say so explicitly. Fifteen enum members that differ only in `sides`, `levels`
and `gateKind` would be fifteen chances to drift.
*Rejected:* keeping each tranche's spelling — it reads as thorough and is a
guaranteed second truth.
*Reversal:* split the attributes back into members; a data edit in DW-1c.
*Blast radius:* the parti enum is dark at DW-1; nothing reads it yet.

**J3 — The DW program mints exactly ONE flag, at DW-7a.**
*Why:* the mint bill is SIX test-visible surfaces (§0.5) and DW-1..DW-6 are dark
by construction, so a second flag buys nothing.
*Rejected:* a flag per wave — six bills, and five of them gate nothing.
*Reversal:* mint a second flag in the wave that needs it; additive.
*Blast radius:* six surfaces, once, priced at DW-7a.

**J4 — `ownerRef` is an institution anchor or the literal `ANONYMOUS_FABRIC`;
DW does NOT invent a household.**
*Why:* measured — no household identity exists (§9.3 D-3). Inventing one is a
persistence-shape act and an owner gate. `ANONYMOUS_FABRIC` is the word
`colonization.js:369` already uses for ground nobody owns, so the vocabulary is
not new either.
*Rejected:* minting a synthetic household key from the dwelling id — it would
make anonymous filler into an identity the rest of the engine would then have to
honour, and dwellings are anonymous **by design**.
*Reversal:* widen the `ownerRef` union when a household identity lands.
*Blast radius:* estates work for institutions today; family holdings wait.

**J5 — The intra-edge merge only, in the first landing.**
*Why:* the union of two adjacent same-edge wedges is EXACTLY a triangle of the
same family (their outer cuts are collinear), so the packing theorem survives
with no new proof. The vertex-crossing union is a quad and does not inherit it.
*Rejected:* admitting both immediately — it would put an unproved shape into the
one place the estate has a theorem.
*Reversal:* the proof car (D-4) admits the quad later; additive.
*Blast radius:* fewer merges are possible in the first landing than the owner's
§496 point 2 imagines; §7 B8's rate absorbs it.

**J6 — S8 CIRCULATION runs as two steps (required-by-kind, then
optional-with-`mintedBy`), not as one draw.**
*Why:* the CIRC addendum's own ruling, and it is the only shape that satisfies
both halves of §452's directive — "never minimized by default" AND "nothing is
added without a licence".
*Rejected:* a single weighted draw over the class set — it would produce
corridors in open-hall vernacular buildings, which the record refuses outright.
*Reversal:* collapse the two steps; a DW-2d edit.

**J7 — The declared court OUTRANKS the emergent court.**
*Why:* the parti was DRAWN with a court as its organising element, so the court
is a cause, not an effect. Letting a packing accident rename a building's
organising form would invert laws 8 and 4.
*Rejected:* emergent-wins — simpler, and it means a badly-packed yard can
promote itself to a collegiate court.
*Reversal:* swap the precedence in the court scan; one predicate.

**J8 — The estate view is DW-6e, not a fabric deliverable** (the parent's open
question Q2, ruled).
*Why:* it reads the cartography block, which is DW's chosen parcel world;
putting it in the fabric would fork the two.
*Rejected:* a fabric deliverable — it would need the fabric to know about
institutions, which it deliberately does not.
*Reversal:* move the car; it consumes a block either way.

**J9 — DW-4 has no dependency on UC-5.**
*Why:* it draws COMPONENTS, not edges, and states the limit in the projection.
Waiting for UC-5 would block a whole wave on an unbuilt leaf.
*Rejected:* deferring DW-4 entirely — it would leave law 7 unimplemented through
the review.
*Reversal:* DW-4b's honesty clause is deleted in one line when UC-5 lands.

**J10 — `ROOM_KINDS.stall` is removed by DW-1a.**
*Why:* measured dead vocabulary — one definition, zero producers anywhere in
`src/`.
*Rejected:* leaving it and adding `shop` beside it, which is what R-INST-2's
naming note implies — that would leave a member with no producer forever.
*Reversal:* re-add the string.
*Blast radius:* **nil at runtime** (no producer), but it is an enum edit, so the
WALL pin's expected set moves by one and the packet must say so.

### §9.5 · CHAIR RULINGS RECORDED, INCLUDING ONE SUPERSEDED

| Ruling | Status | Note |
|---|---|---|
| **R1** frontage gates the parti; depth and height absorb | STANDS | grounded in Pantin (30–50 ft) and R-INST-1's civic STACK; compiled at §4.3 |
| **R2** refusal over repair | ⛔ **SUPERSEDED by R2′ (§497)** | **See below — recorded so no successor re-litigates it.** |
| **R2′** the minimum program is an input to ALLOCATION | STANDS | §3.2, §4.2 |
| **R3** merging is a dated, ward-local event | STANDS, **amended by §498** | it makes a bigger PARCEL, not an estate |
| **R4** courts and yards are definitions | STANDS | §3.5, with the declared-outranks-emergent ruling at J7 |
| **R5** embellishments are closed, derived, deterministic | STANDS | §2.7, bound to the engine's existing `conditionOf` |
| **R6** the ESTATE wave sits between the geometry core and fixtures; MP-1 is its consumer | STANDS | §5.4 |
| **R7** it must land before the ONE REGEN | STANDS | §7's first line |
| **R8** parcel and estate are two objects | STANDS | §2.6, §3.4 |
| **R9** assemble-then-draft at generation; ACCRETE at advance | STANDS | §4.5 |
| **R10** ownership is reversible; built fabric is not | STANDS | §4.5, §6.2 |

> **⛔ WHY R2 WAS SUPERSEDED — recorded in full so it is never re-argued.**
> R2 framed a fitting failure as an honest degradation. **Existence is decided
> UPSTREAM:** the catalog rolls the institution (an inn is a REQUIRED row at town
> tier) and the binder assigns it a parcel, so by placement time "there is an inn
> here" is already a fact of the roster. Drawing a one-room shed for it does not
> degrade honestly — **it makes the map CONTRADICT the roster**, which is the
> quiet-lie class this estate exists to eliminate. A refusal is lawful only where
> SELECTION is still open, never at draw time. The owner's words:
> *"it has to conform to the truth, and the truth comes from the dossier… there
> are minimums required for a coherent believable institution. You can't have a
> one room inn."*

### §9.6 · OPEN QUESTIONS THIS CHARTER COULD NOT CLOSE

| # | Question | Who must answer |
|---|---|---|
| **Q-A** | Does the ESTATE wave's declared same-seed shift require a fresh taste-gate sitting, or does the §464 grant's repair/capability split already cover it? It is capability, not repair, so this charter reads it as owner-gated. | **the owner** |
| **Q-B** | Is `heightPermille` sufficient to carry a storey COUNT, or does the massing block need a storey field? §0 H23 measured one permille and no count; DW-2b can partition a permille, but the 3D massing and the plan must then agree about how. | **the chair**, with the D5 strata wave |
| **Q-C** | Does the ESTATE wave's merge belong inside `cartographyParcels.js` (which owns the carve and the ONE LAW) or in a new leaf that consumes its output? Both preserve the theorem; the first is fewer files, the second is a cleaner single writer. | **the chair** |
| **Q-D** | What is the added per-settlement compute cost of re-deriving every plan, and does it threaten the two-second build the product claims? Not measured this lane. | **a measurement lane**, before DW-2 lands |
| **Q-E** | R-INST-3's ENDOWMENT/LICENCE event stream is load-bearing at seven witnesses and has no engine field. Is it DW-7d as this charter places it, or does it belong to worldPulse? | **the chair** |

## §Σ · THE ONE PAGE THE CHAIR RULES FROM

**The finding that governs everything.** Most catalog entries are not buildings.
Six tranches from six literatures agree: only 3 of 28 criminal rows get a
building of their own and 11 get no cell anywhere; ~30 of 124 trade rows have no
building at the floor, four of them REQUIRED; 14 of 40 hospitality rows are
hosted-or-nothing. **The engine resolves every institution to a template and
draws a box** — measured, quoted, at file:line. That is the gap this charter is
built around, and §3's three relations (`hostedIn`, `NO_BUILDING`, `occupies`)
are the answer.

**What was measured.** 28 engine claims tested at `claude/composite-r4` =
`00e7af61`: **16 CONFIRMED · 5 CORRECTED · 6 REFUTED · 1 PARTIAL** (16+5+6+1 = 28). The six
refutations are the program's justification: the interior reads a POINT, not a
polygon (`interiorFootprint.js:10` says so in its own header); the entrance is
guessed from a district centroid, not read from a street; there is no exterior to
clamp against; **there are no storeys at all**, so law 9 has no home; prosperity
reaches the interior as three buckets while the map has seven; and one vocabulary
member (`stall`) has no producer at all.

**Three findings this lane produced that the research did not.**
1. **A frontage edge exists TODAY.** `cartographyParcels.js:108` — a parcel is
   `[centroid, cuts[s], cuts[s+1]]`, so its outer edge is a third of the ward's
   own perimeter. Frontage length is computable from the row that already ships.
2. **The intra-edge merge is closed under the existing theorem.** Two adjacent
   same-fan wedges union to EXACTLY a triangle of the same family, because their
   outer cuts are collinear. Containment, non-overlap and the ≤4-buildings
   packing proof all survive. The vertex-crossing merge is a quad and does not.
3. **The painter's op count is an IDENTITY, not a list.** `cartographyPaint.js:15-17`.
   MP-1's parcel op moves it. §495.4(a)'s "insertion, not surgery" is true of the
   ordering and false of the identity — MP-1 owes the edit.

**The plan.** 41 cars in 10 waves. DW-1..DW-6 and the ESTATE wave land **DARK**;
DW-7a is the single LIGHT car and mints the program's **only** flag (a bill of
six surfaces, paid once). Vocabularies: **48 partis** (after merging fifteen
proposals into one `GATED_COURT_RING`), **83 cell kinds**, **81 fixture kinds**,
**9 circulation classes** with ~55 sub-forms and five measured width buckets,
**~35 storage sub-forms** with six adjacency polarities of which three are
prohibitions.

**The one same-seed shift.** The ESTATE wave changes the drawn map of every
settlement. **It must land before the endgame's ONE REGEN or it forces a second
one.** Nothing else in the program moves a same-seed byte.

**The dependency.** CH-1/2/3 land before DW-1. CH-1's `interiorKind` override is
the hook the three relations attach to; catalog typing is changing under this
charter and no current facet resolution is baked into a contract.

---

### THE THREE TO FIVE DECISIONS THE CHAIR MUST RULE BEFORE DW-1 CAN BUILD

| # | Decision | Why it blocks | This charter's recommendation |
|---|---|---|---|
| **C1** | **Confirm DW builds on the cartography synthesis parcel world, not the fabric first slice** (judgment J1) | DW-2a binds to it; every geometry car follows | **Confirm.** The fabric produces two masses on one synthetic plan; the cartography stage produces parcels for every building of every settlement, with the polygon, the parcel key and the frontage edge already in hand. |
| **C2** | **Confirm the DW arc — specifically the ESTATE wave — lands BEFORE the ONE REGEN** | it is a scheduling decision about the endgame tail, not about DW | **Confirm.** Landing after forces a second regeneration the tail order has no room for. |
| **C3** | **Rule Q-C: does the merge live inside `cartographyParcels.js` or in a new leaf that consumes it?** | EST-2's file list, and therefore its packet shape, depends on the answer | **A new leaf.** `cartographyParcels.js` owns the CARVE and the ONE LAW; a consumer preserves single-writer and keeps the theorem's file untouched. |
| **C4** | **Ratify J4 — `ownerRef` is an institution anchor or `ANONYMOUS_FABRIC`; DW does not mint a household** | EST-4's contract; and household estates are a visible product feature the owner may want sooner | **Ratify.** No household identity exists in the engine (grep returns zero; dwellings are anonymous by design). Minting one is persistence shape and an owner gate. |
| **C5** | **Order a measurement lane for Q-D (the added per-settlement compute of re-deriving every plan) before DW-2 lands** | the two-second build is a product claim and this charter did not measure the cost | **Order it.** It is one probe lane and it is cheap now, expensive after DW-2. |

**And one act that is the owner's, not the chair's:** the §7 band sitting.
Eighteen rows, each with a recommendation; accepting them all takes one word.
