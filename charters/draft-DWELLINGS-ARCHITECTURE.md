# DW — THE DWELLINGS ARCHITECTURE

**The builder's document.** Its companion is `draft-DWELLINGS-CHARTER.md`, which
is what the owner sits and the chair rules. This one is what a build lane opens.
Cross-referenced by section; nothing is duplicated.

Compiled by lane TC-DW0 (ODQ §484, extended by §499) against
`claude/composite-r4` = `00e7af612d428078634d52ea37054bd00b773ca6`. Ledger docs
at `62acaebb`. Every engine claim below was read at file:line by this lane.

**Model mark: `[OPUS-RUN · FABLE-VALIDATION OWED]`. Nothing here is built.**

## HOW TO USE THIS DOCUMENT

| Part | Answers |
|---|---|
| **arch-0** | Where does the work touch the existing engine, exactly? |
| **arch-1** | What files do I create, and how big may each be? |
| **arch-2** | What are the shapes, field by field, and who owns each? |
| **arch-3** | What happens, in order, from seed to pixel? |
| **arch-4** | What are the packets, and in what order? |
| **arch-5** | What pins what? |
| **arch-6** | What will hurt if I get it wrong? |

**Charter cross-references** use the form `charter §N`. The charter's §0 engine
home table is the authority for every measurement restated here.

## arch-0 · THE SEAMS, MEASURED

Every row: the exact insertion point at file:line, what the module returns
today, and what changes. Verdicts are **CONFIRMED** (read at the cited line),
**CORRECTED** (a prior claim was wrong; the true reading is given) or **ABSENT**.

### 0.1 · `src/domain/townCartography/cartographySynthesis.js` — the stage order

**CONFIRMED.** `compileTownCartography(manifest, settlement, options)` is exported
at **L317**. The stage order inside it, read at base:

| Line | Call | Emits |
|---|---|---|
| L371 | `compileTownWardLayers({...})` | `layers.wards`, `layers.streets` |
| **L385** | `compileTownParcelLayers({ districts, wards, streets, buildings, digest, tier, placement })` | `parcelLayers.parcels`, `parcelLayers.institutionBindings` |
| **L400** | `compileTownBuildingLayers({ buildings, semantics, wards, parcels, institutionBindings, ... })` | `buildingLayers.buildings`, `receipts` |
| L413 | `return { ... }` | the cartography block |

Its own comment at **L395-399** states the law the insertion must respect: "the
footprints pack INSIDE the parcels the line above just carved, from the SAME
manifest's buildings and semantics. Called ONCE, after the parcel leaf, and it
consumes TC-3b's binding receipt VERBATIM rather than re-deriving a second
binding that could disagree."

**WHAT CHANGES.** Two insertions, both BETWEEN L385 and L400 — i.e. after the
carve and before the packing, which is exactly where allocation belongs:

```
L371  compileTownWardLayers(...)
L385  compileTownParcelLayers(...)          <- UNCHANGED (the ONE LAW's carve)
NEW   compileProgramMinimumLookup(...)      <- EST-1: institutions -> ProgramMinimum
NEW   allocateParcels({ parcels, institutionBindings, programs, ... })
                                            <- EST-2a MERGE + EST-2b SELECT
NEW   [time advance only] accreteEstates(...)  <- EST-5
L400  compileTownBuildingLayers(...)        <- consumes the ALLOCATED parcels
L413  return { ..., estates, programs }
```

**The `institutionBindings` receipt is the hinge.** Allocation must rewrite
`binding.parcelId` (to a merged parcel's id) and must NOT re-bind anything else,
or the "consumes the binding VERBATIM" law at L397 breaks. So allocation's output
is *the same receipt with parcelIds substituted*, plus a new `parcels` array in
which merged rows replace their constituents.

### 0.2 · `cartographyParcels.js` — the carve, and why the merge must consume it

**CONFIRMED, verbatim.** The header at **L11-20** buys containment as a theorem
and names the four things absent: "there is no clipping, no jitter, no overlap
repair and no 'try again with a smaller box' anywhere in this file." **L34-38**:
"this leaf roots no stream, forks no label, and consumes nobody's entropy."

`carveCandidates(ward, centroid)` at **L91-128** produces the fan;
`orderCandidates(candidates, placement, digest, wardId)` at **L144-165** orders
it; `PARCEL_EDGE_DIVISIONS = 3` at `cartographyTuning.js:217`;
`PARCELS_PER_WARD` at `cartographyTuning.js:221-223`
`{thorp 2, hamlet 3, village 4, town 6, city 8, metropolis 12}`.

**CONFIRMED, and it is the geometric fact the whole ESTATE wave rests on:**
**L108** — `const polygon = [[centroid[0], centroid[1]], cuts[segment], cuts[segment + 1]]`.
Vertex 0 is the ward centroid; vertices 1–2 are consecutive cuts of ONE ward
boundary edge (L95-105). Therefore:

- **the outer edge is unambiguous and its length is computable** — measured,
  1,098 of 1,098 shipped parcels yield exactly one, none degenerate. ⛔ **It is
  a WARD BOUNDARY, not a street** (amended, charter §Σ AR-4): only 163 of 1,098
  outer-edge midpoints (14.8%) lie within 8 plan units of any street polyline,
  and the median distance to the nearest street is 41.1 plan units. **And what a
  parti is gated on is HALF that edge** — the medial subcell's own face, which is
  the ground one building fronts and the only frontage measurable available
  before the building is drawn (charter §7 BAND ZERO).
- ⛔ **the union of `(e,s)` and `(e,s+1)` is `[C, cuts[s], cuts[s+2]]` BY
  CONSTRUCTION, and equals the true union to within the suite's own
  one-squared-unit lattice tolerance** — NOT exactly, and the difference is the
  amendment (charter §Σ AR-2). The compile's reason, "the three cuts are
  collinear on ward edge `e`", is **false**: `cartographyParcels.js:100-104`
  rounds both interior cuts onto the integer lattice, and **646 of 1,056 real
  adjacent triples (61.2%) are not collinear.** What holds instead, measured:
  the middle cut's perpendicular deviation from the chord is at most **0.7070**
  plan units — the sqrt(0.5) lattice bound `withinWard`'s own comment names at
  `tests/domain/townCartographyParcels.test.js:164-172` — so the squared
  deviation maxes at **0.4999** against that predicate's constant of **1**, with
  **0 exceedances in 1,056**. The symmetric difference against the true union is
  at most **1.403%** of the merged parcel's area (median 0.213%). **1,056 of
  1,056 merged parcels are three-vertex triangles** (so the
  `parcel.polygon.length !== 3` pin at `:265` stays green) and **0 of 4,224 of
  their medial subcells fail the existing pack predicate.**

**WHAT CHANGES: nothing in this file.** The merge is a CONSUMER. Chair Q-C (see
charter §9.6) recommends a new leaf for exactly this reason — `cartographyParcels.js`
owns the carve and the ONE LAW, and a second writer inside it would be the fork
the law exists to prevent. The fan is always LARGER than the tier's take, so
spare candidates exist by construction and allocation needs no new geometry.

### 0.3 · `cartographyBuildings.js` — where the program-driven draft replaces the packing

**CONFIRMED.** `packFootprint(parcel, index, start)` at **L118-141**: the medial
subdivision `[v0,m01,m20] [v1,m12,m01] [v2,m20,m12] [m01,m12,m20]` (**L123**), the
anchor test (**L126**), the FIXED three-rung ladder `for (let step = 0; step < 3; step++)`
(**L127**), the exact containment re-check on every vertex (**L135-137**), and
`return null` when no rung is contained (**L140**).

`CartographyBuildingRow` at **L73-76** =
`{ id, parcelId, role, footprint, heightPermille, agePermille, condition,
styleToken, provenance, decidedBy, institutionRef?, placement?, lynchElement? }`.

`conditionOf(profile, agePermille)` at **L151-162** — the FIRST-MATCH wear chain
`ruined → burned → damaged → worn → pristine → sound`, thresholds at
`cartographyTuning.js:293-297`, and its own header warns the order is
load-bearing.

The header at **L22-24**: "A dwelling that cannot pack is SKIPPED — fill is
best-effort. An institution that cannot pack is NAMED."

> ### ⛔ 0.3a · THE FLAGSHIP EXEMPTION, AND THE DEFECT ITS UNSTATED HALF PRODUCES
>
> **New in the amendment (charter §Σ AR-1; §0 H21, H29). Read this before
> writing a line of EST-2a, EST-2b or EST-3.**
>
> **What the exemption is, in the code's own words.** `cartographyBuildings.js:215-217`
> declares the `occupancy` map as *"Non-flagship occupancy per parcel; flagships
> are exempt (§6.3a3)"*, and `:298-307` implements it: at round `k === 1` a
> canonical institution takes its BOUND parcel unconditionally with
> `subcell = arrived % 4`, and **never increments `occupancy`.** The stated
> reason is at `:299-300` — *"a canonical institution always appears, or the map
> forks from the dossier."* **That reason is sound and the exemption is a design
> decision**: the roster's truth outranks a geometric cap, which is the same
> principle chair ruling R2′ rests on.
>
> **What it also does, which nothing declares.** Because the flagship round does
> not consume a subcell, the instance round's `subcell = occupancy.get(parcel.id) || 0`
> (`:317`) and the dwelling fill's `for (let subcell = occupancy.get(parcel.id) || 0; …)`
> (`:359`) both BEGIN at the subcell the first flagship already holds. And
> `arrived % 4` WRAPS, so the fifth flagship on a parcel stands where the first
> one stands. Measured over 32 real pipeline settlements: **183 duplicate-footprint
> groups, 369 of 2,839 rows (13.0%)**, attribution **100% single-mechanism —
> same parcel, same medial subcell, same shrink permille**; zero duplicate parcel
> polygons, zero rounding collapse. Occupancy over the tier band runs **20.6% on
> the fixture corpus (max 7) and 36.5% on pipeline settlements (max 11)**.
>
> **Ruled a DEFECT, not a design, and it gets its own car (CG-2).** The
> exemption's declared scope is *appearance*; nothing claims two rows may share
> ground. The file guards duplicate IDENTITY (`:382`) and not duplicate GEOMETRY;
> `packFootprint`'s docstring calls the four subcells "the theorem
> `BUILDINGS_PER_PARCEL <= 4` states"; and no test anywhere asserts footprint
> uniqueness. **EST-2b and EST-3 may not be built until CG-2 lands**, because
> `programSatisfied` would otherwise be a receipt for a capacity nothing keeps.
>
> **CG-2's cure reuses machinery already in this file:** the flagship round
> increments `occupancy`; when its bound parcel is full it spills to the ward's
> next parcel by the sibling walk at **`:309-314`** the instance round already
> uses; and when the ward is full it takes the "an institution that cannot pack
> is NAMED" path the header at `:22-24` already promises — which is R2′(e)'s
> REPORTED CONTRADICTION.

**WHAT CHANGES.** EST-3 inserts a program-driven placement BEFORE the current
subcell assignment for INSTITUTION rows only. Dwelling packing is untouched.
Concretely: where `dressRow(parcel, subcell, ...)` today picks a medial subcell by
index, an institution row picks the subcell(s) its `ProgramMinimum` needs, and a
multi-cell institution claims more than one subcell of the same parcel. The
three-rung ladder and the exact predicate are reused UNCHANGED — that is what
keeps containment a theorem.

**The existing "an institution that cannot pack is NAMED" path is exactly where
R2′(e)'s REPORTED CONTRADICTION lands.** It already exists; DW gives it a richer
payload (the institution, the tier, the minimum, the best envelope found).

### 0.4 · `cartographyPaint.js` — the new ops and their position

**CORRECTED — and this is the arch-0 row most likely to be missed.**
**L15-17** states a LENGTH IDENTITY, not a band:

```
ops.length === wards.length + streets.arterials.length
             + streets.lanes.length + buildings.length
```

**L19-21**: "`parcels[]` emits no op — a parcel is a placement SLOT, not a drawn
thing — but it is still READ, because a building's tone rides the ward that owns
its parcel." The read is at **L147** (`requireLayer(block.parcels, ...)`),
**L184-185** (the per-row loop) and **L225-228** (`parcelId` → `wardId`).

ODQ §495.4(a) calls MP-1's parcel op "an INSERTION, not surgery". **True of the
back-to-front ORDERING; false of the identity.** Any new op class changes L15-17
and every test that pins it.

**WHAT CHANGES.** MP-1 adds the `parcel` op and edits the identity to
`+ parcels.length`. DW-6d adds `estate` and `member` ops and edits it again. The
back-to-front position is fixed by the painter's ordering law: **wards → parcels
→ estates → streets → buildings → members**. Also **L23-28**: "GEOMETRY IS
COPIED, NEVER RECOMPUTED… the painter owns no geometry" — DW must hand the
painter finished polygons, never a derivation.

### 0.5 · `src/domain/interior/*` — the cell grammar and the ONE entrance

| Fact | Verdict | Line |
|---|---|---|
| "THE MAP'S FOOTPRINT IS A POINT" | **CONFIRMED** | `interiorFootprint.js:10` |
| `deriveBuildingFootprint` reads `buildTownMapModel`, finds by `anchorKey`, returns `{institutionId, widthCells, depthCells, entranceSide, source, mapPosition}` | **CONFIRMED** | `interiorFootprint.js:102-128` |
| `entranceSide = cardinalSide(centroid − position)` | **CONFIRMED** | `interiorFootprint.js:122`; `cardinalSide` L56-59 |
| `footprintSizeFor` ignores geometry; `MIN_CELLS 4 / MAX_CELLS 30` | **CONFIRMED** | `interiorFootprint.js:80-86`, L41-42 |
| ONE entrance door | **CONFIRMED** | `interiorModel.js:276` |
| ONE rotation from ONE `entranceSide` | **CONFIRMED** | `interiorModel.js:353` |
| **No storeys anywhere in `InteriorModel`** | **CONFIRMED** | `interiorModel.js:181-186` |
| `prosperityScore` is a 3-bucket regex → 0.9/0.5/0.2 | **CONFIRMED** | `interiorModel.js:79-87` |
| Furnishing density `clamp(2 + round(p×3) + faithBump, 1, 8)` | **CONFIRMED** | `interiorModel.js:315` |
| Concealed cell nests at half host dims but does NOT debit the host | **CORRECTED** | `interiorModel.js:335-340`; host `w`/`h` unchanged; `meta.roomCount` L402 excludes covert |
| 8 kinds / 28 rooms / 22 furnishings / 8 templates / 4 variants | **CONFIRMED** | `interiorTemplates.js:29-31, 35-46, 50-54, 86-152, 162-167` |
| `'stall'` has ZERO producers in `src/` | **CONFIRMED** | defined `interiorTemplates.js:38`; `git grep "'stall'" claude/composite-r4 -- src` returns that one line |

**WHAT CHANGES.**
- `interiorFootprint.js` (56 eff, 744 headroom) gains a parcel-aware path: when
  a `CartographyParcelRow` exists for the building, read the envelope from the
  ALLOCATED parcel and the entrance from the FRONTAGE LIST, and keep the current
  point-model path as the fallback for a settlement with no cartography block.
  **Two paths, one flag-free branch on data presence** — not a second truth,
  because the fallback is strictly the degenerate case.
- `interiorModel.js` (249 eff) is **not grown**. Storeys, circulation, storage
  and the second entrance land in NEW leaves that `interiorModel.js` composes.
  Rationale: at 249 effective it is already at the estate's 250-effective LEAF
  line even though eslint's ceiling is 800 (charter §0.4).
- `interiorTemplates.js` (124 eff, 676 headroom) absorbs the enum growth of
  DW-1a and DW-1b.

### 0.6 · `src/domain/spatial/cohesionWeave.js` — `facetOf`, post-CH

**CONFIRMED, with the citation CORRECTED.** `FACET_INFERENCE` is **L258-292**
(R-INST-5 cited L258-276); `institutionNature` **L260-268**; `trade` (L263)
precedes `vice` (L266); `inferFacet` first-match at **L315-322** over
`name + ' ' + type + ' ' + category`; `facetOf` at **L331-335** resolves
DECLARED ?? INFERRED ?? null. `institutionSubstructure` **L285-291** is LANDED
here (**CORRECTED** — R-INST-6 read it at `refs/preserve/holding-uc2`).

**WHAT CHANGES: nothing, by DW.** CH-1 anchors the keywords and adds the
per-entry `interiorKind` override. **DW reads `interiorKind` where declared and
`facetOf` only as CH-1 leaves it**, and no DW module may re-derive a facet from
a name.

### 0.7 · `townScene` / `scene3d` — the massing the plans must agree with

**CONFIRMED.** The cartography block reaches the manifest at
`compileTownSceneManifest.js:495-519` — "S-CARTO: the town-cartography synthesis
stage… never a parallel town generator"; `attachTownCartographyLayers` at L519.
The contract that validates a building row is
`src/domain/townScene/cartographyContract.js`, which declares `heightPermille`
in its typedef at **L225** and validates it at **L581** (`requirePermille`).

**ABSENT: a storey count.** `heightPermille` is the ONLY vertical fact anywhere
in the cartography block or its contract, and `grep -n heightPermille` over
`src/components` and `src/domain/townScene` returns exactly those two lines —
i.e. **`scene3d` does not read `heightPermille` directly at all**; it consumes
the compiled geometry. So the 3D massing and a DW storey partition can only
agree through the CONTRACT, not through a shared field.

**WHAT CHANGES.** DW-2b partitions `heightPermille` into storeys and emits the
partition as a DERIVED value carried on the plan, never written back into the
building row. Charter §9.6 Q-B is the open question: whether the massing block
should gain a storey field so the two surfaces share one number instead of two
derivations of one number. **Until that is ruled, DW is a pure reader of
`heightPermille` and the agreement is a TEST (arch-5), not a field.**

### 0.8 · `src/data/institutionalCatalog.js` — the roster the program table keys off

**CONFIRMED. 311 rows**, counted by executed `grep -c "desc:"` at base. Six tier
blocks (`thorp` L6, `hamlet` L155, `village` L435, `town` L891, `city` L1539,
`metropolis` L2249) and 11 shelf names. Rows are keyed by their NAME string;
there is no id field. 2,464 effective lines — and `src/data/**` carries **no**
`max-lines` rule (`eslint.config.js` scopes the 800 to `src/domain/**/*.js` at
L556-558 and `src/generators/**/*.js` at L531-533).

**WHAT CHANGES: nothing, by DW.** The `ProgramMinimum` table keys off
`(shelf, name, tier)` — the row's authored address — and lives in its own module.
CH-3 fixes the data slips.

### 0.9 · The undercity leaves — the seam

**CONFIRMED.** `jointVocabulary.js:27` — five `JOINT_KINDS`
`['grate','stair','sealed_door','sluice','breach']`; **L30** four `TEMPERAMENTS`.
`colonization.js:365-370` — `frontFor(seed)` returns
`{ kind: 'INSTITUTION', anchor: seed.anchor, name: seed.name }` or
`{ kind: 'ANONYMOUS_FABRIC', anchor: null, name: null }`.
`colonization.js:373-381` — the smugglers' tunnel's licence, and the note that
its TOLL half has no typed home (D-UC0-2).

**CORRECTED:** UC-2 `monotoneComponents.js` is **LANDED** at base (636 lines /
247 eff; landed by `42d3e4b1`), not "built and holding".
**ABSENT:** UC-5 `connectivity.js` — not in the tree at any ref
(`git log --all --diff-filter=A` returns zero adds).

**WHAT CHANGES: nothing in the undercity.** DW is a pure consumer: it looks up
`frontFor(seed).anchor`, draws the surface side of a joint the undercity already
emitted, and adds only ATTRIBUTES to its own `Joint` record (charter §2.8).

### 0.10 · The demography layer — the `Estate.ownerRef` gap

**ABSENT, and this is the measurement chair R8(a) asked for.**

| Probe | Result |
|---|---|
| `git grep -niE "householdId\|household_id" claude/composite-r4 -- src` | **zero rows** |
| `src/domain/worldPulse/demographicsKernel.js` exports | **one function**, `advanceDemographics` (L233) — aggregate, not per-household |
| Dwelling identity | `cartographyBuildings.js:9-10` — "Dwellings are population-derived filler with **NO parallel identity**: their ids resolve to nothing outside this block, **by design** (design §3)"; ids are `carto:dwelling:<wardId>:<ordinal>` (**L363**) |
| Institution identity | `anchorForInstitution(inst)` — exists, stable, already used by the map, the interior and `frontFor` |

**CONSEQUENCE.** `Estate.ownerRef` resolves to an institution anchor or to the
reserved literal `ANONYMOUS_FABRIC`. **DW does not mint a household.** See
charter §9.4 J4 and §9.3 D-3.

### 0.11 · `institutionLifecycle.js` — where a dissolving owner's holdings hand off

**CONFIRMED, and the seam is clean.** 60,069 bytes at base.
`applyInstitutionLifecycleOutcome`'s close branch at **L1006-1024** does not
delete the row; it rewrites it as
`{ ...target, status: 'remnant', _worldPulseInactive: true,
_worldPulseEconomyClosed: true, worldPulseFate, closedByWorldPulseOutcomeId,
remnantReason }`. `closureFateForInstitution` at **L651-656** returns
`shuttered` / `bankrupt` / `closed_for_want_of_custom`.

**A remnant keeps its identity, so `Estate.ownerRef` stays resolvable** and the
holdings are RECLASSED rather than orphaned. `worldPulseFate` is the natural
first link of the reclass chain.

**⚠ THE GAP, named:** there is no holdings field to hand off today, because
holdings do not exist. **⚠ AND A HAZARD:** `closureFateForInstitution` uses the
same UNANCHORED substring style CH-1 is fixing elsewhere (`/yard/`, `/works/`),
so **DW must read `worldPulseFate` as a signal and never re-derive it from the
name.**

### 0.12 · The packet manifest — change paths are CLEAR

**CONFIRMED by executed scan** of `docs/implementation/PACKET_MANIFEST.json` at
base: **167 packets LANDED, 1 SUPERSEDED, ZERO non-terminal.** Every DW-relevant
file appears only under LANDED packets (`TC-3A/3B/4/5A` for the cartography,
`MF-UC0` for `cohesionWeave.js`, `MF-VS1`/`MF-T*` for the fabric). **No change
path is reserved against any file DW would touch**, so arch-4's cars can claim
their paths freely. Re-run the scan at the DW-1 base before minting, because the
CH cars will land in between and will reserve `cohesionWeave.js` and the catalog
— ⛔ **and so will CG-1 and CG-2, which reserve `cartographyTuning.js` and
`cartographyBuildings.js` respectively** (charter §5.0′). EST-3 modifies
`cartographyBuildings.js` and every EST car touches `cartographySynthesis.js`, so
the de-duplication at DW-1's base must include the CG paths, not only CH's.

### ⛔ 0.13 · THE PHYSICAL SCALE — IT EXISTS, IT IS PER-TIER, AND DW MUST NOT MINT ONE

**New in the amendment (charter §Σ AR-4; §0 H30). Both the compile lane and the
skeptic panel reported that no plan-unit-to-physical scale exists in `src/`.
Both were wrong, and both missed it the same way: they grepped the word *scale*,
and the engine's spelling is `planUnitCm`.**

**CONFIRMED, at file:line.** `PLAN_UNIT_CM_BY_TIER` at
`src/domain/townScene/compileTownSceneManifest.js:99-108`:

```js
Object.freeze({ thorp: 10, hamlet: 14, village: 20, town: 30, city: 50, metropolis: 80 })
```

— centimetres per plan unit. Read at **`:286`**, shipped on every manifest as
`space.planUnitCm`, validated as a positive integer at
`manifestContract.js:216`, consumed by `compileTownSceneGeometry.js` (default 30,
at `:67`, `:160`, `:229`) and by `threeSceneRuntime.js:422` to place 3D geometry
in centimetres — **and already read INSIDE the cartography stage** at
`cartographyBuildings.js:333`, where `heightPermille` divides by
`canonical.planUnitCm`.

**WHAT CHANGES.** `geometry/frontageReader.js` converts to feet through
`manifest.space.planUnitCm` and **never through a DW-minted constant**. A second
scale would be a second truth about how big a town is, and the 3D massing already
draws from the first. The `frontageQ` field of arch-2 §2.3 stays in plan units;
the BUCKET is computed in feet from it.

⚠ **AND THE THING A BUILDER WILL OTHERWISE GET WRONG.** The plan frame is
**tier-invariant** — measured, a town's ward bounding box spans about 814 plan
units and a metropolis's about 807, while the metropolis holds twenty times the
population. Real size is expressed by `planUnitCm`, not by extent. **So a plan
unit has no constant physical value, and any DW code that hard-codes one is
wrong at five tiers out of six.**

## arch-1 · THE MODULE TREE

**The caps that bind.** `src/domain/**/*.js` carries `max-lines: 800` effective
(`eslint.config.js:556-558`); `scripts/.size-baseline.json` lists **10** entries
and **none is a DW file**, so no DW file is at an exact ceiling and the
one-line-refusal hazard does not bite this program (charter §0.4). The BINDING
cap is therefore the estate's packet law: **a leaf ≤ 250 effective, ≤ 3 modified
production files per car.**

**PURITY.** Every file marked *pure* below has no store, no clock, no
`Math.random`, no `localeCompare`, and no entropy beyond a named seeded fork or
a `sceneDigest` read. The cartography leaves additionally consume NO entropy at
all (`cartographyParcels.js:34-38`), and every new cartography-side file must
keep that property. Files marked *seam* touch an existing module.

### 1.1 · New directory layout

```
src/domain/dwellings/                 (new — the grammar; pure)
  vocabulary/
    cellVocabulary.js
    fixtureVocabulary.js
    partiCatalog.js
    circulationVocabulary.js
    storageVocabulary.js
    relations.js
  program/
    programMinimum.js                 (the contract + the reader)
    programMinimumTable.js            (the DATA, one row per catalog row per tier)
  geometry/
    frontageReader.js
    verticalPartition.js
    partiPlacement.js
    circulationDeriver.js
    storageDeriver.js
  dressing/
    fixtureDeriver.js
    supplyStateVariants.js
    yardFixtures.js
  seam/
    undercityProjection.js
  validate/
    lawfulnessWalker.js
    reachabilityAbsence.js
    continuityArm.js
    arithmeticArms.js
  project/
    planPane.js
    planPdf.js
    planFoundryWalls.js
    estateView.js
  delta/
    planDelta.js
  index.js                            (the barrel)

src/domain/townCartography/           (existing dir; new leaves)
  cartographyAllocation.js            (EST-2a union + EST-2b select; pure, zero entropy)
  cartographyEstates.js               (EST-4/5: ownership, accretion, reverse motions)

src/domain/soak/                      (existing tree; one new leaf)
  dwellingsSoakLeg.js
```

### 1.2 · The files, by wave

Legend: **eff** is the estimated effective line count; **cap** is 250 for a leaf.

#### DW-1 — vocabularies (all pure, no seam except two enum hosts)

| File | Responsibility (ONE each) | Exports | Imports | eff | Kind |
|---|---|---|---|---|---|
| `vocabulary/cellVocabulary.js` | the 83 cell kinds, frozen, with their group (⛔ **28 − 2 dead + 57 new**, charter §Σ AR-7 — the total is unchanged, both intermediates are corrected) | `CELL_KINDS`, `CELL_GROUP`, `isCellKind` | none | ~110 | pure, CREATE |
| `vocabulary/fixtureVocabulary.js` | ⛔ the **82** fixture kinds (was 81) + `RECESS` + `SUBDIVISION` | `FIXTURE_KINDS`, `isFixtureKind`, `RECESS_STATES` | none | ~110 | pure, CREATE |
| `vocabulary/partiCatalog.js` | the 48 partis + `GATED_COURT_RING`'s attribute space + the instance list | `PARTIS`, `PARTI_FAMILY`, `GATED_COURT_RING_INSTANCES`, `isParti` | none | ~150 | pure, CREATE |
| `vocabulary/circulationVocabulary.js` | 9 classes, ~55 sub-forms, 5 width + 4 length buckets, 6 licence grades | `CIRCULATION_CLASSES`, `SUB_FORMS`, `WIDTH_BUCKETS`, `LENGTH_BUCKETS`, `LICENCE_GRADES` | none | ~180 | pure, CREATE |
| `vocabulary/storageVocabulary.js` | the §453 classes + ~35 sub-forms + the 6 adjacency polarities + the general store prohibition | `STORAGE_CLASSES`, `STORAGE_SUB_FORMS`, `ADJACENCY_POLARITIES`, `storeProhibitsDoor` | none | ~170 | pure, CREATE |
| `vocabulary/relations.js` | `hostedIn`, `NO_BUILDING`, `occupies`/`owns`, `CompoundMember` kinds incl. `PARTY_WALL`/`ENCROACHMENT`/`CHIEF_RENT`, the `NO_BUILDING` reason enum | `RELATION_KINDS`, `COMPOUND_MEMBER_KINDS`, `NO_BUILDING_REASONS` | none | ~90 | pure, CREATE |
| `interiorTemplates.js` | *(seam)* retire `stall`; re-point `ROOM_KINDS`/`FURNISHING_KINDS` at the new vocabularies | unchanged | + the two vocabularies | 124 → ~130 | **seam, MODIFY** (676 headroom) |

#### DW-2 — the geometry core (all pure)

| File | Responsibility | Exports | eff | Kind |
|---|---|---|---|---|
| `geometry/frontageReader.js` | the ORDERED frontage list from a parcel polygon; frontage kinds and status grades; `frontageBucket`. ⛔ **The bucket is computed from the SUBCELL FACE (half the outer edge), converted to feet through `manifest.space.planUnitCm` — never a DW constant** (arch-0 §0.13, charter §7 BAND ZERO). `OPEN_SHOPFRONT`/`GATE_PASSAGE` are derived from the STREET layer explicitly and recorded `refused` where none is within reach: the outer edge is a ward boundary and only 14.8% are near a street | `readFrontages`, `frontageBucketOf`, `slotFaceOf` | ~180 | pure, CREATE |
| `geometry/verticalPartition.js` | `heightPermille` → `Storey[]`; double-height cells; descending ladders; `privacyDepth` | `partitionVertical` | ~170 | pure, CREATE |
| `geometry/partiPlacement.js` | the eligible-set filter (program → frontage → era/culture) then the weighted draw; `PartiModifier` | `eligiblePartis`, `drawParti` | ~200 | pure, CREATE |
| `geometry/circulationDeriver.js` | the two-step S8 (required-by-kind, then optional-with-`mintedBy`); the second subordinate entrance | `deriveCirculation` | ~210 | pure, CREATE |
| `geometry/storageDeriver.js` | S9 storage cells + the polarity checks + the absence record | `deriveStorage` | ~180 | pure, CREATE |
| `interiorFootprint.js` | *(seam)* the parcel-aware envelope path with the point-model fallback | + `deriveParcelEnvelope` | 56 → ~120 | **seam, MODIFY** (744 headroom) |

#### ESTATE wave

| File | Responsibility | Exports | eff | Kind |
|---|---|---|---|---|
| `program/programMinimum.js` | the contract, the reader, the satisfaction predicate | `lookupProgram`, `satisfies`, `ProgramMinimum` typedef | ~130 | pure, CREATE |
| `program/programMinimumTable.js` | THE DATA: one row per (shelf, name, tier) with cells, adjacencies, open ground, frontage minimum and a citation | `PROGRAM_MINIMUM_TABLE` | **~700** | pure, CREATE — **see the size note below** |
| `townCartography/cartographyAllocation.js` | select-or-union candidate wedges until the program is satisfied; the bounded union; the reported contradiction | `allocateParcels` | ~210 | pure, ZERO-ENTROPY, CREATE |
| `townCartography/cartographyEstates.js` | `Estate` records; `owns`/`occupies`; accretion; the four reverse motions; the remembered-seam un-merge | `compileEstates`, `advanceEstates` | ~240 | pure, CREATE |
| `dressing/yardFixtures.js` | the closed yard-fixture set keyed to function × prosperity × condition × season, with the wear ladder | `deriveYardFixtures` | ~150 | pure, CREATE |
| `cartographySynthesis.js` | *(seam)* wire the two new calls between L385 and L400 | unchanged surface | 242 → ~262 | **seam, MODIFY** (558 headroom) |

> ⚠ **`programMinimumTable.js` at ~700 effective is the one file that approaches
> the 800 ceiling**, and it is DATA, not logic. Two lawful shapes, and the
> architecture picks the second:
> **(a)** one 700-line module — under the ceiling, over the leaf line, and it
> grows every time a catalog row is added.
> **(b) SPLIT BY SHELF** — `programMinimumTable/{government,religious,criminal,
> infrastructure,economy,crafts,magic,defense,adventuring,entertainment,exotic}.js`
> plus an `index.js` that freezes the union, each shelf file ~60-90 effective and
> each under the leaf line. **Chosen: (b).** It keeps every file a leaf, it makes
> a car per shelf possible if DW-R2 needs to land incrementally, and it mirrors
> the catalog's own authored structure, so a reader can diff a shelf against its
> catalog block.

#### DW-3 / DW-4 / DW-5 / DW-6 / DW-7 / DW-S

| File | Responsibility | eff | Kind |
|---|---|---|---|
| `dressing/fixtureDeriver.js` | typed fixtures per function at the prosperity/wear grade; `RECESS` and `SUBDIVISION` placement | ~180 | pure |
| `dressing/supplyStateVariants.js` | the cold forge, the empty granary floor, the dark vault | ~90 | pure |
| `seam/undercityProjection.js` | `frontFor(seed).anchor` → the surface joint; the DOWN-STAIR diagnostic; the UC-5 honesty clause | ~140 | pure, **seam-reader** |
| `validate/lawfulnessWalker.js` | floor / ceiling / licence / reasoned-absence / geometry / vertical | ~230 | pure |
| `validate/reachabilityAbsence.js` | reachability + refused-joint ABSENCE + severability + `approach: NONE`/`HATCH_ONLY` + the zero-cell certificate | ~190 | pure |
| `validate/continuityArm.js` | anchors persist across single-band changes; the host-keyed stable key | ~120 | pure |
| `validate/arithmeticArms.js` | `furnaces ≤ flues + portableFurnaces`; the concealed-cell area debit; crowd egress | ~110 | pure |
| `project/planPane.js` | the lazy on-click pane model (data only; the component is a consumer) | ~160 | pure |
| `project/planPdf.js` | multi-floor page model | ~140 | pure |
| `project/planFoundryWalls.js` | UVTT wall data from `Storey[]` | ~130 | pure |
| `project/estateView.js` | the parcel's buildings top-down with the main plan opened | ~120 | pure |
| `delta/planDelta.js` | the only stored artefact; replay at S12-post; the strict no-op | ~110 | pure |
| `soak/dwellingsSoakLeg.js` | the nine arms of charter §6.1 + the findings report | ~240 | pure |
| `interiorExport.js` | *(seam)* Foundry walls from storeys | 53 → ~110 | **seam, MODIFY** (747 headroom) |
| `cartographyPaint.js` | *(seam)* the `estate`/`member` ops and the identity edit | 143 → ~165 | **seam, MODIFY** (657 headroom) |
| `interiorModel.js` | *(seam)* compose the new leaves; do NOT absorb them | 249 → ~275 | **seam, MODIFY** — see below |

> ⚠ **`interiorModel.js` is the file to watch.** At 249 effective it sits at the
> estate's 250-effective LEAF line while being 551 under eslint's ceiling. Every
> DW wave will want to add to it. **Rule for every builder: `interiorModel.js`
> may gain composition calls and nothing else.** Logic goes in a new leaf under
> `src/domain/dwellings/`.

### 1.3 · Modified-file headroom, per car

Every MODIFY target with its measured effective count, its ceiling, and how much
of the headroom the DW work is estimated to consume:

| File | eff now | ceiling | est. after | headroom left | cars that touch it |
|---|---|---|---|---|---|
| `interiorTemplates.js` | 124 | 800 | ~130 | 670 | DW-1a, DW-1b |
| `interiorFootprint.js` | 56 | 800 | ~120 | 680 | DW-2a |
| `interiorModel.js` | 249 | 800 | ~275 | 525 | DW-2b/d/e, DW-3a, DW-6a |
| `interiorExport.js` | 53 | 800 | ~110 | 690 | DW-6c |
| `cartographySynthesis.js` | 242 | 800 | ~262 | 538 | EST-2b, EST-3, EST-4, EST-5 |
| `cartographyBuildings.js` | 229 | 800 | ~265 | 535 | EST-3 |
| `cartographyPaint.js` | 143 | 800 | ~165 | 635 | DW-6d (after MP-1) |
| `cartographyTuning.js` | 143 | 800 | ~175 | 625 | wherever a signed band lands |

**None is close to its ceiling.** The size-baseline needs no new entry, and no
existing entry moves — which is itself a claim a car must verify, because
`tests/lint/sizeBaseline.test.js` demands that a file falling UNDER its layer
ceiling has its entry DELETED and none of these has an entry to begin with.

### 1.4 · Single-writer assignments (one module owns each fact)

| Fact | Its ONE writer |
|---|---|
| the cell vocabulary | `vocabulary/cellVocabulary.js` |
| the parti catalog | `vocabulary/partiCatalog.js` |
| a `ProgramMinimum` row | `program/programMinimumTable/<shelf>.js` |
| which parcel an institution gets | `townCartography/cartographyAllocation.js` |
| whether two parcels merged, and when | `townCartography/cartographyAllocation.js` |
| an `Estate`'s membership | `townCartography/cartographyEstates.js` |
| a `Storey[]` | `geometry/verticalPartition.js` |
| a `CirculationCell` | `geometry/circulationDeriver.js` |
| a `StorageCell` | `geometry/storageDeriver.js` |
| a yard fixture | `dressing/yardFixtures.js` |
| a `Joint`'s attributes | `seam/undercityProjection.js` (kinds stay the undercity's) |
| a `PlanDelta` | `delta/planDelta.js` |

Each of these is enforced by a source scan in arch-5, not by convention.

### 1.5 · Total new surface

⛔ **41 new files** (amended, charter §Σ AR-8 — the compile said 33 and the
skeptic panel said 40; both are wrong). Counted off the §1.1 tree: **30** `.js`
entries. `programMinimumTable.js` is then replaced by `programMinimumTable/index.js`
plus **11** shelf files — a net +11 — giving **41**. The panel's 40 missed
`index.js`, which §1.2's own table names as a `CREATE` row at ~40 effective.

**41 new files** (~4,600 effective lines, of which ~700 is the split program
table), plus **8 modified files** consuming ~200 effective lines of headroom
between them. That is the honest size of the DW program's code, measured against
the caps rather than estimated against feel.

⛔ **Two further files land OUTSIDE that total**, in the CG train, and they are
MODIFY rather than CREATE: `cartographyTuning.js` (CG-1) and
`cartographyBuildings.js` (CG-2), plus one new fixture module and two new test
files (charter §5.0′). They repair landed code DW did not write.

## arch-2 · THE CONTRACTS AS CONCRETE SHAPES

Every field: its type, its units, whether it is **DECLARED** (authored data),
**DERIVED** (computed every time, never stored) or **STORED** (persisted — and
there are exactly two), and its refusal case. Each block names the ONE module
that owns it.

**Units, stated once.** Plan-space coordinates are the cartography stage's
integers (`PlanPoint = [number, number]`). Interior coordinates are the existing
0..1000 normalized frame. Permille means parts-per-thousand. A "bucket" is a
closed enum member, never a number, so a tuning change never breaks a type.

---

### 2.1 · `Parcel` — owner: `townCartography/cartographyAllocation.js`

```js
/**
 * A CONTIGUOUS piece of ground with ONE boundary. This is what MP-1's halo
 * outlines. A merge produces a bigger Parcel; it never produces an Estate.
 * @typedef {Object} Parcel
 * @property {string} parcelId        DECLARED  a CartographyParcelRow.id, or `${a}+${b}` for a merge
 * @property {string} wardId          DECLARED  the owning ward; a merge NEVER crosses wards
 * @property {PlanPoint[]} polygon    DERIVED   plan-space integers; for a merge, the union
 * @property {PlanPoint} anchor       DERIVED   roundedMean of the polygon
 * @property {string[]} [mergedFrom]  DERIVED   present IFF this is an amalgamation
 * @property {number}   [since]       DERIVED   the year the merge happened
 * @property {string}   [cause]       DERIVED   a closed enum member, never prose
 * @property {number} frontageQ       DERIVED   the OUTER EDGE's length, plan units.
 *                                              NOT the bucket input -- see slotFaceQ.
 * @property {number} slotFaceQ       DERIVED   frontageQ / 2: the medial subcell's own
 *                                              face, and the length B3's bucket reads
 *                                              (charter SS7 BAND ZERO, AR-4)
 * @property {'INTRA_EDGE'|'VERTEX'} [mergeKind] DERIVED
 */
```

**Refusals.** A cross-ward merge throws a premise error (it breaks the
containment theorem). A `VERTEX` merge is refused in the first landing (charter
§9.3 D-4) because the union is a quadrilateral — **measured, 528 of 528 are
genuine convex quads with zero degenerating to a triangle** — and
`cartographyBuildings.js`'s medial-subdivision proof does not apply to one
(`packFootprint` destructures three vertices at `:121`). A `polygon` that is not
integer, or whose area is zero, throws.

⛔ **AND ONE REFUSAL THE COMPILE DID NOT STATE (amended, charter §Σ AR-2).** An
`INTRA_EDGE` merge whose middle cut lies further than the suite's
one-squared-unit lattice tolerance from the chord **throws**, rather than being
silently accepted. Measured, no real geometry does — max squared deviation
**0.4999 over 1,056 triples, zero exceedances** — which is exactly why the
refusal is cheap to state and why it is the arm's failing control that has to
come from somewhere else (a vertex-crossing pair: squared deviation **291.3 to
3,183.6**, 0 of 528 passing).

⚠ **THE THING AN ALLOCATOR WILL GET BACKWARDS.** Two wedges carry four medial
subcells each — eight slots. Their union is one triangle with **four**.
**A merge HALVES the slot count while roughly doubling each slot's ground and its
frontage** (median frontage 44.0 → 90.6 plan units; measured, 1,056 of 1,056
merged parcels still yield four packable subcells). Merge to fit a BIGGER cell,
never to fit more of them.

---

### 2.2 · `Estate` — owner: `townCartography/cartographyEstates.js`

```js
/**
 * An OWNERSHIP SET over one or more parcels, CONTIGUOUS OR NOT (owner, §498).
 * "The combination of multiple, not necessarily connected, buildings belonging
 * to one singular institution or individual."
 * @typedef {Object} Estate
 * @property {string} estateId              DERIVED  `estate:${ownerRef}`
 * @property {string} ownerRef              DERIVED  an institution anchorKey, or the
 *                                                   literal 'ANONYMOUS_FABRIC'. NEVER a person.
 * @property {EstateMember[]} members       DERIVED
 * @property {number} since                 DERIVED  the year the estate first held two members
 * @property {string} cause                 DERIVED  a closed enum member
 * @property {EstateEvent[]} events         DERIVED  the dated motion list, oldest first
 */

/**
 * @typedef {Object} EstateMember
 * @property {string} parcelId              DERIVED
 * @property {'owns'|'occupies'} relation   DERIVED  'occupies' types R-INST-5's OCCUPATION
 * @property {number} since                 DERIVED
 * @property {string} cause                 DERIVED
 */

/**
 * @typedef {Object} EstateEvent
 * @property {'ACQUIRE'|'SWAP'|'PARTITION'|'DISSOLUTION'} motion  DERIVED
 * @property {number} year                  DERIVED
 * @property {string} cause                 DERIVED  closed enum
 * @property {string[]} parcelIds           DERIVED  which members moved
 * @property {string} [toOwnerRef]          DERIVED  for SWAP and PARTITION
 */
```

**Refusals.** `ownerRef` must be an institution anchor or `ANONYMOUS_FABRIC`; a
household key is REFUSED because no household identity exists in the engine
(arch-0 §0.10). A member the owner neither owns nor occupies is refused. A
geometric interpretation of an `Estate` is refused: an estate has no polygon,
only members.

**`cause` enums, closed.** Acquisition: `PROSPERITY · MARRIAGE · FOUNDATION ·
GRANT · PURCHASE_AFTER_FIRE · PURCHASE_AFTER_ABANDONMENT`. Reverse: `SUCCESSION ·
PARTIBLE_INHERITANCE · DEBT_SALE · FORFEITURE · ESCHEAT · DISSOLUTION_OF_OWNER ·
FIRE · ABANDONMENT`.

---

### 2.3 · `Compound` / `CompoundMember` — owner: `geometry/partiPlacement.js`

```js
/**
 * ONE PROPERTY: everything standing on ONE Parcel, under ONE parti.
 * @typedef {Object} Compound
 * @property {string} compoundId            DERIVED  === parcelId (no second key)
 * @property {string} parcelId              DERIVED
 * @property {CompoundMember[]} members     DERIVED
 * @property {1|2|number} entrances         DECLARED by the parti — never emergent
 * @property {Frontage[]} frontages         DERIVED  ORDERED, best first
 * @property {PlanPoint[][]} yard           DERIVED  parcel minus every footprint
 * @property {Court[]} courts               DERIVED  declared-first, then emergent (charter §3.5)
 * @property {Certification} certification  DERIVED
 */

/**
 * @typedef {Object} CompoundMember
 * @property {CompoundMemberKind} kind      DERIVED  MAIN_BUILDING | DETACHED_OUTBUILDING | RANGE
 *                                                   | YARD | COURT | GARDEN | WELL | MIDDEN
 *                                                   | PIT_FIELD | KILN | PRIVY | STABLE_BLOCK
 *                                                   | TENTER_STRIP | DRYING_FRAME_FIELD
 *                                                   | PARTY_WALL | ENCROACHMENT | CHIEF_RENT
 * @property {PlanPoint[]} polygon          DERIVED  in the parcel's frame
 * @property {'owns'|'occupies'} relation   DERIVED
 * @property {string} [buildingRef]         DERIVED  a CartographyBuildingRow.id
 * @property {number} [since] @property {string} [cause]   DERIVED
 * @property {string} [sharedWith]          DERIVED  the other parcelId, for PARTY_WALL/ENCROACHMENT
 */

/**
 * @typedef {Object} Frontage
 * @property {'OPEN_SHOPFRONT'|'DOOR'|'GATE_PASSAGE'|'COURT'|'CAUSEWAY'
 *           |'TRANSPORT_EDGE'|'WATER_EDGE'|'COVERED'|'LIBERTY_BOUNDARY'
 *           |'ORIENTED_AXIS'} kind         DERIVED
 * @property {'PRIMARY'|'SUBORDINATE'} status  DERIVED
 * @property {number} lengthQ               DERIVED  plan units, the FULL edge
 * @property {number} slotFaceQ             DERIVED  lengthQ / 2 -- the bucket's input
 * @property {number} lengthFt              DERIVED  slotFaceQ * planUnitCm / 30.48.
 *                                                   planUnitCm comes from the MANIFEST
 *                                                   (manifest.space.planUnitCm); a DW
 *                                                   constant here is a bug at five of
 *                                                   six tiers (arch-0 SS0.13)
 * @property {'SHOP'|'NARROW'|'STANDARD'|'WIDE'|'GRAND'} bucket  DERIVED
 *                                                   bucketOf(lengthFt): 6-10 | 10-20 |
 *                                                   20-30 | 30-50 | 50+. SHOP and WIDE
 *                                                   are SOURCED (Salter via Pantin;
 *                                                   Pantin primary); NARROW, STANDARD
 *                                                   and GRAND's floor are INTERPOLATED
 *                                                   and the spec must say so
 * @property {boolean} streetBacked         DERIVED  is a street polyline within reach of
 *                                                   this edge's midpoint? Measured at
 *                                                   base: TRUE for only 14.8% of parcels,
 *                                                   so this is a real field, not a
 *                                                   formality, and OPEN_SHOPFRONT /
 *                                                   GATE_PASSAGE require it
 * @property {[PlanPoint,PlanPoint]} edge   DERIVED
 */
```

**Refusals.** A member on ground the parcel does not contain. A `PARTY_WALL`
without a `sharedWith`. More than one parcel (that is an `Estate`).

---

### 2.4 · `ProgramMinimum` — owner: `program/programMinimumTable/<shelf>.js`

```js
/**
 * The minimum program: cells + adjacencies + open ground. NEVER an area.
 * DATA from the dossiers, per institution per tier, with a citation on each row.
 * @typedef {Object} ProgramMinimum
 * @property {string} shelf                 DECLARED  the catalog shelf name
 * @property {string} name                  DECLARED  the catalog row's key, verbatim
 * @property {Tier} tier                    DECLARED  the tier this row fires at
 * @property {'BUILDING'|'HOSTED'|'NO_BUILDING'|'ZONING'|'PRECINCT'|'OCCUPIED'} verdict  DECLARED
 * @property {ProgramCell[]} cells          DECLARED
 * @property {ProgramAdjacency[]} adjacencies  DECLARED
 * @property {ProgramGround[]} openGround   DECLARED
 * @property {FrontageBucket} [frontageMin] DECLARED  only where the parti family is frontage-gated
 * @property {string} citation              DECLARED  "R-INST-4 §3" — the dossier row, by name
 */

/** @typedef {{ kind: CellKind, count: number, minDims?: [number,number], note?: string }} ProgramCell */
/** @typedef {{ a: CellKind, b: CellKind, polarity: AdjacencyPolarity }} ProgramAdjacency */
/** @typedef {{ kind: 'YARD'|'COURT'|'RANGE'|'PIT_FIELD', minExtent: number }} ProgramGround */
```

**Refusals — and the first is the owner's own rule.**
**⚠ A row with an `area` or `footprint` field is REFUSED by the walker**, not
merely discouraged: an area test is satisfiable by a big empty box that still
reads wrong (chair R2′(c)). A row with an empty `citation` is refused. A row
whose `verdict` is `NO_BUILDING` but whose `cells` is non-empty is refused.
A `(shelf, name, tier)` triple with two rows is refused.

**Worked row, so the shape is unambiguous:**

```js
{ shelf: 'Economy', name: 'Inn (multiple)', tier: 'town',
  verdict: 'BUILDING',
  cells: [
    { kind: 'hall',      count: 1 },
    { kind: 'kitchen',   count: 1 },
    { kind: 'pantry',    count: 1, note: 'the service pair' },
    { kind: 'buttery',   count: 1 },
    { kind: 'lodging',   count: 3, note: 'N chambers; N rises with rank' },
    { kind: 'stable',    count: 1 },
    { kind: 'loft',      count: 1, note: 'hayloft, REQUIRED_ABOVE the stable' },
  ],
  adjacencies: [
    { a: 'loft',    b: 'stable',  polarity: 'REQUIRED_ABOVE' },
    { a: 'pantry',  b: 'hall',    polarity: 'REQUIRED_NEAR' },
    { a: 'buttery', b: 'hall',    polarity: 'REQUIRED_NEAR' },
  ],
  openGround: [{ kind: 'YARD', minExtent: 1 }],
  frontageMin: 'STANDARD',
  citation: 'R-INST-4 §3 + §Sigma.2 item 4 (gate passage HORSE 1.8-2.4 m / COACH >= 2.4-3.0 m)' }
```

---

### 2.5 · `Building`, `Storey`, `Cell` — owner: `geometry/partiPlacement.js`, `geometry/verticalPartition.js`

```js
/**
 * @typedef {Object} Building
 * @property {string} buildingId            DERIVED  a CartographyBuildingRow.id
 * @property {PartiId} parti                DERIVED
 * @property {PartiModifier} [partiModifier] DERIVED  the WRAP (TWO_PLAN_FRONT)
 * @property {PlanPoint[]} footprint        DERIVED  the engine's, NEVER re-derived here
 * @property {Storey[]} storeys             DERIVED
 * @property {number} frontageIndex         DERIVED  index into Compound.frontages
 * @property {boolean} programSatisfied     DERIVED  the receipt R2'(e) reads
 * @property {Fossil[]} fossils             DERIVED  kinds imported from colonization.js
 */

/**
 * @typedef {Object} Storey
 * @property {number} index                 DERIVED  0 = ground; negative is below grade
 * @property {'LOW'|'STANDARD'|'TALL'|'DOUBLE'} heightBucket  DERIVED
 * @property {Cell[]} cells                 DERIVED
 * @property {Joint[]} verticalJoints       DERIVED  stairs, hoists, chutes, shafts
 */

/**
 * @typedef {Object} Cell
 * @property {string} cellId                DERIVED  `${buildingId}:s${storey}:${kind}:${ordinal}`
 * @property {CellKind} kind                DERIVED
 * @property {PlanPoint[]} polygon          DERIVED
 * @property {FunctionKind[]} functions     DERIVED  MANY functions may share one cell (law 1)
 * @property {FunctionKind} causedBy        DERIVED  WHICH function caused this cell
 * @property {FunctionKind[]} occupiedBy    DERIVED  which merely occupy it
 * @property {LightReq} lightReq            DERIVED
 * @property {Fixture[]} fixtures           DERIVED
 * @property {Joint[]} joints               DERIVED
 * @property {'NORMAL'|'SINGLE'|'HATCH_ONLY'|'NONE'} approach  DERIVED
 * @property {Subdivision} [subdivisions]   DERIVED  repeated units inside one cell
 * @property {true} [covert]                DERIVED  the existing covert-scrub posture
 */
```

**Refusals.** A `kind` outside `CELL_KINDS`. Free geometry beyond a polygon (the
renderer knows how to draw each kind — the existing WALL discipline). A cell
whose polygon leaves the footprint. `causedBy` absent.

---

### 2.6 · `CirculationCell` and `StorageCell` — owners: their two derivers

```js
/**
 * @typedef {Cell & {
 *   class: CirculationClass,               // DERIVED  one of 9
 *   subForm: string,                       // DERIVED  one of ~55
 *   licence: { grade: LicenceGrade, eraFrom?: number, institutionKinds?: string[] },  // DERIVED
 *   widthBucket: 'MICRO'|'NARROW'|'STANDARD'|'BROAD'|'HALL_GRADE',   // DERIVED
 *   lengthBucket: 'SHORT'|'MEDIUM'|'LONG'|'VERY_LONG',               // DERIVED
 *   enclosure?: 'OPEN_ONE_SIDE'|'OPEN_TWO_SIDES'|'ENCLOSED',         // DERIVED
 *   level?: 'GRADE'|'UPPER'|'MEZZANINE',                             // DERIVED
 *   walkable?: boolean,                                              // DERIVED
 *   mintedBy?: { event: string, year: number },                      // DERIVED
 *   killedBy?: { event: string, year: number }                       // DERIVED
 * }} CirculationCell
 */

/**
 * @typedef {Cell & {
 *   class: StorageClass,                   // DERIVED
 *   subForm: string,                       // DERIVED
 *   sizeBucket: 'FIXTURE'|'CLOSET'|'CELL'|'BAY'|'FLOOR',             // DERIVED
 *   lightReq: 'NONE'|'NORTH'|'ANY'|'BARRED'|'END_WINDOWS'|'VIA_CORRIDOR'
 *           |'DARK'|'GROUND_LEVEL_SPLAY'|'SIDE_WINDOWS_BOTH'|'OWN_WINDOW',  // DERIVED
 *   adjacency: Array<{ polarity: AdjacencyPolarity, target: CellKind,
 *                      distance?: number, eraGrade: 'MEDIEVAL'|'LATE'|'ANY' }>  // DERIVED
 * }} StorageCell
 */
```

**Refusals.** A circulation cell with no licence. A `CORRIDOR` carrying
`corridorPlanned` in a pre-1650 English domestic parti (the CELL's early licence
is by PROGRAM and is a different row). A storage cell with a door where
`FORBIDDEN_DOOR` holds. A `LARDER` adjacent to a hearth.

---

### 2.7 · `Fixture`, `Recess`, `Subdivision`, `YardFixture`, `Joint`

```js
/** @typedef {{ kind: FixtureKind, cellRef: string, grade: 'plain'|'good'|'fine',
 *   wear: 'sound'|'worn'|'broken', count?: number, unitFootprint?: [number,number] }} Fixture */

/** A countable, dateable, LOSABLE subdivision of wall thickness. The corpus's best fossil.
 *  @typedef {{ cellRef: string, wallIndex: number, depthQ: number,
 *   state: 'OPEN'|'BLOCKED', blockedYear?: number }} Recess */

/** Repeated units inside ONE cell: pledge boxes, bed rows, han cells, Speicher bays.
 *  @typedef {{ cellRef: string, unitKind: string, count: number,
 *   unitFootprint: [number,number] }} Subdivision */

/** An embellishment on the open ground. DETERMINISTIC; asserts no fact the engine lacks.
 *  @typedef {Object} YardFixture
 *  @property {YardFixtureKind} kind        DERIVED  the closed set of charter §2.7
 *  @property {string} memberRef            DERIVED  which CompoundMember it stands on
 *  @property {PlanPoint} at                DERIVED
 *  @property {number} count                DERIVED  from prosperity x density band
 *  @property {'PRESENT'|'EMPTY'|'GONE'} stock  DERIVED  the wear ladder's first rung
 */

/** @typedef {Object} Joint
 *  @property {'grate'|'stair'|'sealed_door'|'sluice'|'breach'} kind   DERIVED — the undercity's five, IMPORTED
 *  @property {'CELL'|'UNDERCITY'|'OTHER_BUILDING'|'EXTERIOR'|'ROOF'|'WATER'} target  DERIVED
 *  @property {string} anchor               DERIVED  the surface feature ("cellar door")
 *  @property {boolean} severable           DERIVED
 *  @property {{from:number,to:number}} [schedule]  DERIVED  time-of-day window
 *  @property {boolean} refused             DERIVED  a LICENSED non-joint; S9 proves ABSENCE
 *  @property {boolean} [mandatoryOpen]     DERIVED
 *  @property {boolean} [objectOnly]        DERIVED  the foundling wheel
 *  @property {'UP'|'DOWN'} [direction]     DERIVED  DOWN is the undercity's signature
 */
```

**Refusals.** A joint `kind` outside the undercity's five (DW adds attributes,
never kinds). A `YardFixture` whose `stock` is `PRESENT` on a `ruined` building
(the wear ladder sheds perishables first). A `Recess` whose `blockedYear`
precedes the building's founding.

---

### 2.8 · The three relations — owner: `vocabulary/relations.js` (shapes) and the derivers named

```js
/** A function occupying another institution's interior.
 *  Derived by geometry/partiPlacement.js; circulation is INHERITED from the host.
 *  @typedef {Object} HostedIn
 *  @property {string} guestAnchorKey       DERIVED
 *  @property {string} hostBuildingId       DERIVED
 *  @property {string[]} fallbackOrder      DERIVED  hosts to try if the first dies
 *  @property {{year:number, cause:string}} [killedBy]  DERIVED  the host DIED (1547, 1536-40)
 *  @property {string} stableKey            DERIVED  `${hostBuildingId}:${functionKind}:${ordinal}`
 *                                                   -- NEVER the guest's own id (law 4's extension)
 *  @property {boolean} compressed          DERIVED  surplus stations collapsed (R-INST-6 SS1.6)
 */

/** A reasoned, projectable verdict with a fixture set on ground.
 *  @typedef {Object} NoBuilding
 *  @property {string} anchorKey            DERIVED
 *  @property {'ROAD_JUNCTION'|'MARKET_GROUND'|'CHURCHYARD'|'OPEN_WATER'|'HOST_THRESHOLD'} ground  DERIVED
 *  @property {Fixture[]} fixtures          DERIVED
 *  @property {'ITINERANT'|'SEASONAL'|'HOURS_ARE_THE_SECURITY'|'NO_PREMISES_BY_NATURE'
 *            |'ON_ANOTHERS_GROUND'|'THE_GROUND_IS_THE_INSTITUTION'} reason  DECLARED on the ProgramMinimum row
 *  @property {string} projection           DERIVED  the sentence the pane shows
 */

/** A building used by an institution that did not build it.
 *  @typedef {Object} Occupies
 *  @property {string} occupierAnchorKey    DERIVED
 *  @property {string} structureRef         DERIVED  an EXISTING building or fabric feature
 *  @property {Cell[]} addedCells           DERIVED
 *  @property {Joint[]} changedControl      DERIVED  which joints became severable, and by whom
 *  @property {Fossil[]} forwardFossils     DERIVED  a widened opening, a broken roof — DATED
 */
```

**Refusals, restated as code contracts.** `hostedIn` with no candidate host
falls to `NO_BUILDING`, never to an invented building. `NO_BUILDING` may not
acquire cells by prosperity — it acquires a DIFFERENT `ProgramMinimum` row at
the next tier, or an upgrade LICENCE. **`occupies` may not MINT the occupied
structure**: if the fabric has no suitable ruin, the verdict degrades to
`NO_BUILDING` with reason `ON_ANOTHERS_GROUND` — *no institution ever generates
a landscape fossil* (R-INST-5's own discipline).

---

### 2.9 · The two STORED artefacts, and only two

```js
/** @typedef {{ buildingId: string, path: string, op: 'set'|'unset'|'insert',
 *   value: unknown, editedAt: number }} PlanDelta */     // owner: delta/planDelta.js

/** @typedef {{ estateId: string, motion: EstateMotion, year: number,
 *   cause: string, parcelIds: string[], toOwnerRef?: string }} EstateEvent */
                                                          // owner: cartographyEstates.js
```

Everything else in this document is DERIVED and must be re-computable from
`(worldSeed, buildingId, circumstancesSnapshot)`. A field that is neither
DERIVED nor one of these two is a bug.

## arch-3 · THE DATA FLOW, END TO END

Two passes. **Pass A** runs at generation. **Pass B** runs at each time advance
and uses the SAME machinery (chair §498 R9d — never two implementations that can
disagree).

At every arrow: what is computed, what is derived-not-stored, what is refused,
and what a same-seed re-run must reproduce byte-for-byte.

---

### PASS A — GENERATION

```
worldSeed
   |
   v
[A1] CATALOG ROLL  -- institutionProbability + assembleInstitutions (EXISTING)
   |   computes: WHICH institutions exist, at which tier, with which facets
   |   derived-not-stored: nothing new
   |   refuses: nothing (this is upstream of DW entirely)
   |   byte-stable: already pinned by the existing goldens
   |
   |   >>> DW's FIRST LINE APPLIES HERE: by the time control reaches A2, the
   |   >>> fact "there is an inn here" is already TRUE. Nothing downstream may
   |   >>> contradict it (chair R2', SS497).
   v
[A2] PROGRAM MINIMUM LOOKUP  -- program/programMinimum.js (NEW)
   |   computes: for each institution, its ProgramMinimum at ITS tier
   |   key: (shelf, name, tier) -- the row's authored address, never a name regex
   |   derived-not-stored: the whole lookup; the TABLE is authored data
   |   refuses: a missing row (a premise error, not a default -- a silent default
   |            would let an un-researched institution draw a box again)
   |   byte-stable: a pure table read
   v
[A3] PARCEL ALLOCATION / MERGE  -- townCartography/cartographyAllocation.js (NEW)
   |   consumes: carveCandidates' fan (cartographyParcels.js:91-128, UNCHANGED),
   |             orderCandidates' order (L144-165, UNCHANGED), the binding receipt
   |   computes: which candidate each institution takes; whether adjacent same-edge
   |             candidates UNION; the merged polygon; frontageQ
   |   derived-not-stored: everything. A merge's `since`/`cause` is an EstateEvent
   |             (STORED) only when it happens at a time advance; at generation the
   |             merge is part of the starting world and needs no event.
   |   refuses: cross-ward merge; VERTEX merge (first landing); more than
   |            PARCEL_EDGE_DIVISIONS-1 = 2 unions per ward edge; an INTRA_EDGE
   |            merge outside the one-squared-unit lattice tolerance (AMENDED)
   |   >>> CAPACITY IS FOUR SLOTS, NOT THE TIER BAND (AMENDED, charter SS4.2):
   |   >>>   capacity(parcel)           = 4     the medial subcells; a merge does
   |   >>>                                      NOT raise it -- it HALVES the slot
   |   >>>                                      count and doubles each slot
   |   >>>   reservedForFill(parcel)    = BUILDINGS_PER_PARCEL[tier]  -- a TARGET
   |   >>>   availableToProgram(parcel) = 4 - flagships bound here
   |   >>> and this predicate is only TRUE once CG-2 lands: today the flagship
   |   >>> round consumes no subcell, so nothing enforces the left-hand side
   |   >>> (arch-0 SS0.3a). EST-2 MAY NOT BE BUILT BEFORE CG-2.
   |   >>> the REPORTED CONTRADICTION exits here if the program cannot be met
   |   byte-stable: zero entropy consumed -- every choice is a sceneDigest read,
   |            exactly as cartographyParcels.js:34-38 requires
   v
[A4] PARTI ELIGIBILITY BY FRONTAGE  -- geometry/frontageReader.js + partiPlacement.js
   |   computes: the ORDERED frontage list; frontageBucket; the ELIGIBLE parti set
   |   >>> THE BUCKET READS THE SUBCELL FACE, NOT THE WHOLE EDGE (AMENDED,
   |   >>> charter SS7 BAND ZERO). Measured over 1,098 real parcels under the
   |   >>> engine's own per-tier scale: the whole edge gives a median of 83.5 ft
   |   >>> and Pantin's 30-ft gate admits 98.8% -- a filter that filters nothing.
   |   >>> The subcell face gives 41.8 ft and refuses about a quarter. It is also
   |   >>> the ONLY frontage measurable available HERE, before the draw.
   |   >>> Feet come from manifest.space.planUnitCm. Never a DW constant.
   |   filter order (chair R1): program -> frontage -> era/culture -> then weights
   |   derived-not-stored: all
   |   refuses: a parti whose frontageMin exceeds the envelope's bucket; a parti
   |            the era refuses outright (12 dated refusals, R-INST-2 gap 12)
   |   byte-stable: the weighted draw forks on (worldSeed, buildingId, 'parti')
   v
[A5] THE DRAFT -- ONE TIME (chair SS498 R9a)
   |   [A5.1] verticalPartition.js  : heightPermille -> Storey[]
   |   [A5.2] partiPlacement.js     : functions -> cells within the parti
   |   [A5.3] circulationDeriver.js : the TWO steps (required-by-kind; then
   |                                  optional-with-mintedBy)
   |   [A5.4] storageDeriver.js     : cells + the six polarities + the absence record
   |   derived-not-stored: all
   |   refuses: an adjacency violating a FORBIDDEN_* polarity; an unlicensed
   |            circulation cell; a storey count that does not reconcile with the
   |            massing silhouette
   |   >>> NO DRAFT-THEN-REDRAFT. The ground was assembled at A3; A5 runs once.
   v
[A6] COMPOUND MEMBERS AND YARD  -- partiPlacement.js
   |   computes: members; yard = parcel MINUS every footprint; courts = enclosed
   |             components of the yard, DECLARED-first then emergent (charter SS3.5)
   |   derived-not-stored: all -- this is what makes "emergent" literally true
   |   refuses: a member outside the parcel
   v
[A7] FIXTURES AND EMBELLISHMENTS  -- dressing/*.js
   |   computes: cell fixtures at (prosperity x wear) grade; yard fixtures at
   |             (function x prosperity x conditionOf x season)
   |   reads: conditionOf's existing chain (cartographyBuildings.js:151-162)
   |   derived-not-stored: all
   |   refuses: a fixture asserting a fact the engine lacks; a PRESENT stock on a
   |            ruined building (the wear ladder sheds perishables first)
   |   byte-stable: DETERMINISTIC -- same seed, same hides, or the Promise breaks
   v
[A8] VALIDATION  -- validate/*.js
   |   certifies: floor satisfied, ceiling respected, every cell licensed, every
   |              absence reasoned, circulation total, refused joints ABSENT,
   |              geometry legal, vertical partition exact, the arithmetic arms
   |   refuses: shipping an uncertified plan
   v
[A9] PAINT OPS  -- cartographyPaint.js (seam)
   |   emits: ward ops -> parcel ops (MP-1) -> estate ops (DW) -> street ops ->
   |          building ops -> member ops
   |   >>> the LENGTH IDENTITY at L15-17 moves; see arch-0 SS0.4
   |   refuses: recomputing geometry (L23-28: "the painter owns no geometry")
   v
[A10] PROJECTIONS
   |   2D pane (project/planPane.js, lazy) | 3D massing (agreement is a TEST, not
   |   a field -- arch-0 SS0.7) | PDF (planPdf.js) | Foundry walls
   |   (planFoundryWalls.js -> interiorExport.js) | the estate view
   v
[A11] THE HOVER HALO  -- MP-1's overlay, input swapped at the ESTATE wave
       tier 1: THIS property line, strong
       tier 2: the estate's OTHER holdings, faint  (SS498 R8c)
       degrades honestly: a building whose parcel is absent from the block
       highlights itself alone and never guesses a boundary (SS495.5(2))
```

**What a same-seed re-run must reproduce byte-for-byte:** every arrow above. The
only entropy in the whole pass is A4's parti draw, forked on
`(worldSeed, buildingId, 'parti')`; A3 consumes none at all by construction.

---

### PASS B — TIME ADVANCE

```
year N -> year N+1
   |
   v
[T1] OWNERSHIP EVENT  -- cartographyEstates.js
   |   one of: ACQUIRE | SWAP | PARTITION | DISSOLUTION
   |   inputs: prosperity rung, succession, the closure machinery's own output
   |           (institutionLifecycle.js:1006-1024 -> status 'remnant' + worldPulseFate)
   |   STORED: the EstateEvent. This is one of exactly two stored artefacts.
   |   refuses: an event that rewrites an earlier year's record
   |
   |--- SWAP: geometry UNCHANGED. One dated event; nothing redrawn. STOP HERE.
   |
   v
[T2] GROUND MOTION  -- cartographyAllocation.js
   |   ACQUIRE   -> merge, per A3's rules (intra-edge only)
   |   PARTITION -> UN-MERGE, PREFERRING THE REMEMBERED SEAM (SS500 R10.b):
   |                Parcel.mergedFrom is read and the split follows it exactly.
   |                No new geometry, no arbitrary cut.
   |   refuses: a split line that would pass through a built range (see T3')
   v
[T3] ACCRETION -- THE ONLY LAWFUL MOTION ON BUILT FABRIC
   |   every range present at year N is present and UNMOVED at year N+1
   |   the new work goes into the ACQUIRED ground: a new range, an outbuilding,
   |   or a COURT formed by enclosing the gap between the two
   |   >>> THE SEAM IS A FEATURE. Misaligned ranges, a break in the roofline, a
   |   >>> court where the gap was. Do not smooth it.
   |
   [T3'] WHEN A SPLIT MUST CUT THROUGH BUILT FABRIC (SS500 R10.c), in order:
   |   (1) constrain the line to run BETWEEN structures -- seam, alley, flank
   |   (2) else emit a TYPED SHARED CONDITION: PARTY_WALL | ENCROACHMENT |
   |       CHIEF_RENT, each a named member with a receipt, never an accident
   v
[T4] RECLASS ON DISSOLUTION
   |   the buildings do NOT vanish. reclassedTo[] gains a dated link, seeded from
   |   worldPulseFate (shuttered | bankrupt | closed_for_want_of_custom)
   |   >>> read worldPulseFate as a SIGNAL; never re-derive it from the name --
   |   >>> closureFateForInstitution (L651-656) uses unanchored substrings
   v
[T5] THE CHRONICLE ENTRY  -- the NEWS ADDRESS LAW
   |   address chain + typed action + names + reason:
   |   "In 1387 the Cordwainer household threw two burgages together on Sheep
   |    Street after the fire on the north side."
   v
[T6] RE-DERIVE  -- A5 through A10 run again over the UNCHANGED lived record
       every plan is a pure function of (worldSeed, buildingId, circumstances@N+1)
       fossils are minted by DIFFING against the prior derivation
       refuses: writing a generation-path byte (THE PROMISE)
```

**The invariant that binds Pass B, and it is constitutional:** *replaying the
same seed to the same year reproduces the same holdings and the same plans
byte-for-byte, and no reverse motion rewrites what an earlier year recorded.*
Charter §6.1 arms A8 and A9 are its mechanical statements.

> ⛔ **STAGE LABELS RENAMED (amended, charter §Σ AR-8).** This pass's stages were
> labelled `[B1]`..`[B6]` in the compile. That was a SECOND name for the stages
> the charter's §4.5 already calls **T1..T5**, and it collided with the band ids
> `B1`..`B18` of charter §7 — so a builder reading both documents met `B3` meaning
> *accretion* here and *frontage buckets* there. They are now **T1..T6**, matching
> the charter, with `T6` the architecture's own name for what the charter's
> diagram writes as "then S5..S12 re-derive". No behaviour changes; one name for
> one thing does.

---

### 3.1 · The five refusal exits, and where each surfaces

| Exit | Fires at | Surfaces as |
|---|---|---|
| **No `ProgramMinimum` row** | A2 | a premise error at compile — never a default |
| **REPORTED CONTRADICTION** (the ward cannot host what the roster claims) | A3, after bounded merging | a named finding on the plan's `certification`, DM-readable: the institution, the tier, the minimum, the best envelope found |
| **No eligible parti** | A4 | falls to the tier's own `HOSTED` or `NO_BUILDING` row if the program declares one; otherwise the A3 contradiction |
| **`occupies` with no suitable structure** | A5.2 | degrades to `NO_BUILDING` with reason `ON_ANOTHERS_GROUND` — *no institution ever generates a landscape fossil* |
| **Split line through built fabric** | T3' | a typed shared condition, with a receipt |

**None of these is a silent shrink.** That is the whole content of chair R2′.

### 3.2 · What crosses the DW boundary, in each direction

**IN (DW reads, never writes):** the catalog row and its facets; `anchorForInstitution`;
`CartographyParcelRow`; `CartographyBuildingRow` incl. `heightPermille`,
`agePermille` and `condition`; `InstitutionParcelBinding`; the ward polygon and
centroid; `frontFor(seed)` and the undercity component rows; `worldPulseFate` and
`status: 'remnant'`; the economy's prosperity rung; the demography aggregate;
high-water; the calamity ledger.

**OUT (DW emits):** the plan (derived, never persisted); the paint ops; the
projections; `PlanDelta` (stored); `EstateEvent` (stored); the chronicle entries;
the soak findings.

**NEVER:** a write to a catalog row, a generation-path byte, a second facet
derivation, a second parcel world, a new joint kind, or a household identity.

## arch-4 · THE CARS

Packet stubs in `docs/implementation/PACKET_STANDARD.md` form. Each carries an
id, a family, a `changeManifest` with actions, the TEST path (which **must exist
at every status** — a new test file is a `CREATE` row, never a `TEST` row), its
`requiredSymbols` **as symbols, never counts** (and naming only what the
deliverable must PRESERVE at `READY` — a symbol the deliverable creates is added
at the flip to `LANDED`), its acceptance arms with the mutant that would convict
each, its census cost, its golden list with the declared shift, its flag bill and
its sweep targets.

**Family: `dwellings`.** A new family, because `MF` is the map fabric and
`catalog-hygiene` is CH's. The estate cars sit in the same family (they are DW's
wave, landing in the cartography tree).

**Change-path de-duplication, executed.** The live `PACKET_MANIFEST.json` at base
holds **167 LANDED + 1 SUPERSEDED + ZERO non-terminal** packets, and every
DW-relevant file appears only under LANDED ones. **No path below is reserved.**
⚠ Re-run the scan at the DW-1 base: the CH cars will land in between and will
reserve `cohesionWeave.js` and `institutionalCatalog.js` — ⛔ **and so will CG-1
and CG-2, which reserve `cartographyTuning.js` and `cartographyBuildings.js`,
both of which later EST cars also touch.**

**Standing rows every car carries** (stated once, not repeated per car):
sweep trees = `tests/domain`, `tests/lint`, `tests/property`, `tests/docs`, plus
the §489.3 grep-driven arm over all 37 test trees for every symbol the car names;
gate = the full gate, run BARE in a fresh shell with the exit captured, never
wrapped in the mutex (self-deadlock); batteries mutexed on one command line with
`GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock`.

---

### ⛔ CG — THE CARTOGRAPHY GROUND (new; charter §5.0′, §Σ AR-5). LANDS BEFORE EVERYTHING.

**Family: `cartography`, not `dwellings`.** These repair landed code DW did not
write and they do not belong to DW's family or its car count. They are here
because the DW build lane is the lane that will open them.

#### `CG-1` — the per-tier bands must fit what the generator produces
- **family** cartography · **depends on** nothing · **blocks** DW-1a
- **changeManifest**
  - `MODIFY src/domain/townCartography/cartographyTuning.js` — re-derive `MAXIMUM_INSTITUTION_BINDINGS` and `TC3_LAYER_MAX_BYTES` by the stated rule `max(current, ceil(measuredMax × 1.5))`; max +14 eff
  - `CREATE tests/fixtures/pipelineCartographyCorpus.js` — **one seeded `generateSettlementPipeline` settlement per tier, frozen**
  - `CREATE tests/domain/cartographyGroundCorpus.test.js`
- **requiredSymbols** `TOWN_CARTOGRAPHY_TUNING`, `cartographyBand`, `CARTOGRAPHY_TIERS` (preserved)
- **acceptance (6)**
  1. every settlement of the real-pipeline corpus compiles LIT without throwing — *mutant: restore any one old cap.* **This arm fails 24/24 at base for hamlet, village and town, which is what makes it an arm rather than a restatement**
  2. the existing 20-row fixture corpus still compiles LIT and its output is **byte-identical** to today — *mutant: move a band the fixture corpus sits under* — the dormancy proof
  3. every band is the stated function of the corpus, not a literal — *mutant: hand-edit one number*
  4. **no band FALLS** — *mutant: lower `metropolis` from 96 to the measured 89*
  5. the real-pipeline corpus is non-vacuous: one settlement per tier, and at least one that threw at base — **the vacuity guard, and it is not optional here: a corpus of six metropolises would pass arm 1 trivially**
  6. `MAXIMUM_WARDS` is untouched — *mutant: raise it* — it never bit (districts 1..7 against caps 8..48) and a band that never bit must not move under cover of one that did
- **census** +6 titles · **⛔ GOLDENS: the LIT cartography surfaces re-record** (settlements that threw now emit rows); the dark path and the dormancy golden do not move · **DECLARED SHIFT: yes** · **flag** none
- ⚠ **one thing to report, not to fix here:** a metropolis projects a median of **53** canonical scene buildings and a town **55**, at twenty times the population. Look and write it down; the cause is upstream of this stage (charter §9.3 D-11)

#### `CG-2` — a flagship consumes the ground it stands on
- **family** cartography · **depends on** CG-1 · **blocks** DW-1a and, specifically, EST-2b
- **changeManifest**
  - `MODIFY src/domain/townCartography/cartographyBuildings.js` — the flagship round increments `occupancy`; spills to the ward sibling by the existing walk at `:309-314`; falls to the existing NAMED-premise path at `:338` when the ward is full; max +18 eff
  - `CREATE tests/domain/cartographySubcellCollision.test.js`
- **requiredSymbols** `compileTownBuildingLayers` (preserved)
- **acceptance (5)**
  1. **no two rows in a compiled block share a footprint** — *mutant: restore the non-consuming flagship.* **Fails 183 times over 32 settlements at base**
  2. **every canonical institution still appears** — *mutant: cap flagships and drop the surplus.* This arm protects the exemption's real purpose, which is the one thing the cure must not break
  3. a flagship whose bound parcel is full lands on a ward sibling — *mutant: remove the spill*
  4. a flagship whose whole ward is full is NAMED, never silently dropped — *mutant: `continue`*
  5. dwelling packing is byte-identical to today — *mutant: touch a dwelling shrink permille* — the dormancy proof
- **census** +5 titles · **⛔ GOLDENS: the same LIT surfaces; CG-1 and CG-2 re-record as ONE act** · **DECLARED SHIFT: yes** · **flag** none

---

### DW-1 — the vocabularies

#### `DW-1a` — the cell vocabulary
- **family** dwellings · **depends on** CH-1 LANDED ⛔ **and CG-1, CG-2 LANDED**
- **changeManifest**
  - `CREATE src/domain/dwellings/vocabulary/cellVocabulary.js` — `CELL_KINDS`, `CELL_GROUP`, `isCellKind`; max +120 eff
  - `MODIFY src/domain/interior/interiorTemplates.js` — `ROOM_KINDS` re-points at `CELL_KINDS`; ⛔ **retire BOTH `'stall'` and `'dais'`** (the `FURNISHING_KINDS` `dais` at `:53` STAYS); max +10 eff
  - `CREATE tests/domain/dwellingsCellVocabulary.test.js`
- **requiredSymbols** `ROOM_KINDS`, `interiorKindOf`, `resolveRoomSet` (preserved)
- **retiredSymbols** — none (members of an array, not symbols); the retirements are asserted in the acceptance
- **acceptance (6)** — ⛔ **arms 3–5 amended (charter §Σ AR-7): TWO members retire, not one, and the walker pins the intermediates as well as the total**
  1. `CELL_KINDS` is frozen and every member is unique — *mutant: duplicate a member*
  2. every `TEMPLATES` room kind is a `CELL_KINDS` member — *mutant: rename one template room*
  3. **both `'stall'` and `'dais'` are absent from `CELL_KINDS`** — *mutant: re-add either*
  4. **no source file under `src/` produces `room('stall'` or `room('dais'`** (the retirements are real, not cosmetic) — *mutant: add a `room('dais', …)` call anywhere.* ⚠ **The scan must match the ROOM-PRODUCER spelling, not the bare string:** `'dais'` still occurs four times in `src/` after this car, twice as the surviving `FURNISHING_KINDS` member and twice in furnish lists at `interiorTemplates.js:140` and `:166`. **A bare `grep "'dais'"` arm would be red forever and would then be widened until it proved nothing** — this is exactly the cross-vocabulary collision that hid the dead member in the first place
  5. `FURNISHING_KINDS.dais` **survives** — *mutant: retire it too* — it has two live producers and retiring it deletes drawn furniture
  6. the counts are exactly **28 retired-2 added-57 = 83** — all three figures, not just the total — *mutant: add or drop one at any of the three*
- **census** +6 titles · **goldens** none — **DECLARED SHIFT: NONE** (no producer reads the new members) · **flag** none

#### `DW-1b` — fixtures, `RECESS`, `SUBDIVISION`
- `CREATE .../vocabulary/fixtureVocabulary.js` (+120) · `MODIFY interiorTemplates.js` (`FURNISHING_KINDS`, +6) · `CREATE tests/domain/dwellingsFixtureVocabulary.test.js`
- **acceptance (4)** frozen+unique; every template `furnish` member is a `FIXTURE_KINDS` member; `RECESS_STATES` is exactly `OPEN|BLOCKED`; ⛔ **count is 82** (`22 + 60`, amended from 81 — charter §Σ AR-7)
- +4 titles · no goldens · **SHIFT: NONE** · no flag

#### `DW-1c` — the parti catalog
- `CREATE .../vocabulary/partiCatalog.js` (+160) · `CREATE tests/domain/dwellingsPartiCatalog.test.js`
- **acceptance (5)** frozen+unique; every parti belongs to exactly one family; `GATED_COURT_RING` declares `entrances: 1`; its instance list has 15 members and every one names a dossier; the count is 48
- +5 titles · **SHIFT: NONE** · no flag

#### `DW-1d` — circulation vocabulary
- `CREATE .../vocabulary/circulationVocabulary.js` (+190) · test
- **acceptance (5)** 9 classes; every sub-form names exactly one class; the width buckets are ordered and non-overlapping; `CORRIDOR` carries **two** licence rows (the CELL by program, the PLAN by era) — *mutant: collapse them to one*; every bucket endpoint carries a source label
- +5 titles · **SHIFT: NONE** · no flag

#### `DW-1e` — storage vocabulary and the polarities
- `CREATE .../vocabulary/storageVocabulary.js` (+180) · test
- **acceptance (5)** the six polarities exactly; three of them are prohibitions; `storeProhibitsDoor` returns true for fuel/bodies/feed and false otherwise — *mutant: invert one*; `LARDER` carries opposite polarity at `MEDIEVAL` and `LATE`; every sub-form names a class
- +5 titles · **SHIFT: NONE** · no flag

#### `DW-1f` — the three relations and the compound members
- `CREATE .../vocabulary/relations.js` (+100) · test
- **acceptance (5)** `RELATION_KINDS` is exactly `owns|occupies|hostedIn|NO_BUILDING`; `COMPOUND_MEMBER_KINDS` includes `PARTY_WALL`, `ENCROACHMENT`, `CHIEF_RENT`; `NO_BUILDING_REASONS` has 6 members; a `NO_BUILDING` record with non-empty cells is refused — *mutant: allow it*; every enum frozen
- +5 titles · **SHIFT: NONE** · no flag

---

### DW-2 — the geometry core

#### `DW-2a` — the frontage reader
- **depends on** DW-1c
- `CREATE .../geometry/frontageReader.js` (+170) · `MODIFY src/domain/interior/interiorFootprint.js` (the parcel-aware path + the point fallback, +70) · `CREATE tests/domain/dwellingsFrontage.test.js`
- **requiredSymbols** `deriveBuildingFootprint`, `SIDE_NORTH`..`SIDE_WEST`, `footprintSizeFor`
- **acceptance (6)**
  1. for a wedge `[C, cuts[s], cuts[s+1]]`, the reader returns the OUTER edge as `PRIMARY` — *mutant: return the centroid edge*
  2. `frontageQ` equals the outer edge's length — *mutant: use the perimeter*
  3. the bucket boundaries are the five signed ones — *mutant: move one*
  4. a parti declaring `entrances: 1` makes `COURT` the primary and the street a single joint — *mutant: keep the street primary*
  5. **the point-model fallback is byte-identical to today when no parcel row exists** — *mutant: change the fallback's entrance* — this is the dormancy proof
  6. the list is ORDERED and stable across runs
- +6 titles · **goldens: NONE MOVE** (the fallback is byte-identical and the parcel path has no consumer yet) · **SHIFT: NONE** · no flag

#### `DW-2b` — the vertical partition
- `CREATE .../geometry/verticalPartition.js` (+180) · `MODIFY interiorModel.js` (composition call only, +12) · test
- **acceptance (5)** storeys sum to the height envelope; a `DOUBLE` cell spends two storeys' budget; the ladder may DESCEND (12/11/9 reproduces the Fortune contract) — *mutant: force ascending*; `privacyDepth` rises with stair depth; the count reconciles with `heightPermille` — *mutant: off-by-one*
- +5 titles · **SHIFT: NONE** · no flag

#### `DW-2c` — parti placement
- **depends on** DW-2a, EST-1
- `CREATE .../geometry/partiPlacement.js` (+210) · test
- **acceptance (6)** the filter order is program→frontage→era (assert by a case that only the right order resolves) — *mutant: reorder*; a `PARALLEL_EXTENDED` is ineligible below the `WIDE` bucket — *mutant: drop the frontage filter*; an era-refused parti is absent, not merely down-weighted; the draw forks on `(seed, buildingId, 'parti')`; the same seed gives the same parti; a `zoning` emits N buildings, not one large one — *mutant: emit one*
- +6 titles · **SHIFT: NONE** · no flag

#### `DW-2d` — circulation deriver
- `CREATE .../geometry/circulationDeriver.js` (+220) · `MODIFY interiorModel.js` (+8) · test
- **acceptance (6)** the two steps run in order; a required-by-kind cell appears without any optional pass; an optional cell carries `mintedBy`; a `CORRIDOR` is refused in a pre-1650 English domestic parti but admitted in a prison of any date — *mutant: use one licence*; the SECOND subordinate entrance appears only where a subordinate frontage exists; reachability is total over Function AND Circulation cells
- +6 titles · **SHIFT: NONE** · no flag

#### `DW-2e` — storage deriver
- `CREATE .../geometry/storageDeriver.js` (+190) · `MODIFY interiorModel.js` (+8) · test
- **acceptance (5)** every polarity is honoured; `FORBIDDEN_DOOR` produces `joint.refused = true`, not a missing joint — *mutant: omit the joint entirely, which would make the absence unprovable*; a space below the size floor becomes a FIXTURE of its host, never a cell; the medieval and late `LARDER` polarities are opposite; a zero-storage plan certifies LAWFUL with a reason
- +5 titles · **SHIFT: NONE** · no flag

---

### THE ESTATE WAVE

#### `EST-1` — the program-minimum table lands as data
- **depends on** DW-R2, DW-1f
- `CREATE src/domain/dwellings/program/programMinimum.js` (+140)
- `CREATE src/domain/dwellings/program/programMinimumTable/index.js` (+40)
- `CREATE src/domain/dwellings/program/programMinimumTable/<shelf>.js` × 11 — **11 files exceeds the 3-file packet law, so EST-1 SPLITS INTO EST-1a..EST-1d, three shelves each**, each with its own acceptance and its own commit
- `CREATE tests/domain/dwellingsProgramMinimum.test.js`
- **acceptance (6, on the joining car EST-1d)**
  1. **a walker: every catalog row that can fire at a tier has exactly one row** — *mutant: delete one row* — this is the manifest+walker pattern, and the discovery half reads the CATALOG, so a new catalog row reds until it is registered
  2. every row carries a non-empty `citation` — *mutant: blank one*
  3. **no row carries an `area` or `footprint` field** (chair R2′(c)) — *mutant: add one* — this is the guard that keeps the minimum a PROGRAM
  4. a `NO_BUILDING` row has empty `cells`
  5. `(shelf, name, tier)` is unique
  6. every `cells[].kind` is a `CELL_KINDS` member
- **census** +6 titles across four cars · **SHIFT: NONE** (data with no consumer yet) · no flag

#### `EST-2` — allocation with merge  ⛔ *(SPLITS into EST-2a and EST-2b — see the box below)*
- **depends on** EST-1d, DW-2a, ⛔ **CG-2** (its capacity predicate is only true once the flagship round consumes its subcell — arch-0 §0.3a)
- `CREATE src/domain/townCartography/cartographyAllocation.js` (+220)
- `MODIFY src/domain/townCartography/cartographySynthesis.js` — insert the call between L385 and L400; rewrite `binding.parcelId` only; max +14 eff
- `CREATE tests/domain/townCartographyAllocation.test.js`
- **requiredSymbols** `compileTownParcelLayers`, `compileTownBuildingLayers`, `carveCandidates` is private so name `compileTownParcelLayers` only
- **acceptance (8, the cap)** — ⛔ **arms 1 and 2 REWRITTEN (charter §Σ AR-2). The
  compile's arm 1 asserted the union is EXACTLY `[C, cuts[s], cuts[s+2]]`, which
  is unpassable: 646 of 1,056 real triples are not collinear. It is replaced by
  two arms, a construction claim and a bounded-fidelity claim, and the second
  carries a control that genuinely fails.**
  1. **CONSTRUCTION.** The merged parcel IS `[C, cuts[s], cuts[s+2]]` — built,
     not computed — and `polygon.length === 3`. *Mutant: emit the true
     four-vertex union (the convex hull of the two wedges), which is
     geometrically more exact and reds `townCartographyParcels.test.js:265`.*
     **This arm exists to make that trade explicit: we keep the triangle and
     accept at most 1.4% of the parcel's ground in error, rather than keep the
     ground and lose the three-vertex pin.**
  1b. **BOUNDED FIDELITY, in the suite's own unit.** For every merge the
     compiler performs, `scenePointSegmentDistanceSq(cuts[s+1], cuts[s], cuts[s+2]) <= 1`
     — the exact constant and predicate `withinWard` uses at
     `tests/domain/townCartographyParcels.test.js:164-172`, cited by name so the
     two can never drift — **and** the symmetric difference
     `area(cuts[s], cuts[s+1], cuts[s+2])` is at most 2% of the merged parcel's
     area. **Measured at base: max squared deviation 0.4999 and max symmetric
     difference 1.403%, over 1,056 triples, zero exceedances — so the arm passes
     with real headroom rather than sitting on its boundary.**
     ⛔ ***THE CONTROL, and it must be in the same file (ODQ §503: a control that
     cannot fail proves nothing).*** Run the identical predicate over a
     VERTEX-CROSSING pair — wedge `(e,2)` with `(e+1,0)`, whose "middle cut" is
     the shared ward vertex. **Measured: squared deviation 291.3 (min) to 3,183.6
     (max) over 528 pairs; 0 of 528 pass.** The arm must assert the subject
     passes AND the control fails, in one test, or it proves only that the
     tolerance is large.
  2. a merged parcel passes `scenePointInPolygon` on every vertex of every
     medial subcell — the theorem survives — *mutant: allow a VERTEX merge*.
     **Measured at base: 0 of 4,224 subcell failures over 1,056 merges, so this
     arm is green by construction and its job is to stay that way.**
  2b. ⛔ **CAPACITY IS FOUR SLOTS (new arm, charter §Σ AR-1).** `availableToProgram`
     is `4 − flagshipsBoundHere`, never `BUILDINGS_PER_PARCEL[tier]`, and
     `programSatisfied` is a claim about it. *Mutant: use the tier band* — which
     passes trivially at city and metropolis (band 4 = slots 4) and **fails at
     thorp, hamlet, village and town**, so the mutant is convicted exactly where
     the real cap ladder and the real slot count disagree.
  3. a cross-ward merge throws a premise error — *mutant: allow it*
  4. at most 2 unions per ward edge — *mutant: unbounded loop*
  5. **zero entropy consumed**: the allocation runs identically with a poisoned PRNG — *mutant: call `rng()` once*
  6. the candidate ORDER is `orderCandidates`' order, unchanged — *mutant: re-sort*
  7. when no envelope satisfies the program after bounded merging, the **REPORTED CONTRADICTION** is emitted with the institution, tier, minimum and best envelope — *mutant: return the best envelope silently*
  8. `binding.parcelId` is the ONLY binding field written — *mutant: touch `placement`*

> ### ⛔ EST-2 SPLITS IN TWO — TEN ARMS DO NOT FIT AN EIGHT-ARM CAP
>
> The amendment added arms 1b and 2b, taking EST-2 from 8 to **10**. The cap is
> 8, and widening a cap to fit a car is the move this estate does not make. The
> car splits along the seam its own arms already have:
>
> | Car | Files | Arms | What it is |
> |---|---|---|---|
> | **EST-2a — THE MERGE** | `CREATE cartographyAllocation.js` (the union half, ~110 eff) · `CREATE tests/domain/townCartographyMerge.test.js` | **1, 1b (+ its control), 2, 3, 4** — five | pure geometry: the chord triangle, the lattice tolerance with its failing control, subcell survival, the cross-ward refusal, the bounded union count |
> | **EST-2b — THE ALLOCATION** | `MODIFY cartographyAllocation.js` (the select half, ~110 eff) · `MODIFY cartographySynthesis.js` (+14) · `CREATE tests/domain/townCartographyAllocation.test.js` | **2b, 5, 6, 7, 8** — five | the capacity predicate, determinism, candidate order, the reported contradiction, the single-field binding write |
>
> **EST-2a carries the declared shift and the golden re-record; EST-2b rides it**
> — the same one-act rule the compile gave EST-2/EST-3, now over three cars.
> **The program is 41 cars / 45 dispatchable commits** (44 + this split). Charter
> §5.0's figure moves with it.

- **census** +5 titles (EST-2a) and +5 (EST-2b)
- **⛔ GOLDENS: THIS PAIR MOVES THEM.** The cartography determinism goldens and every same-seed LIT map surface re-record. **DECLARED SHIFT: the drawn map of every settlement changes** — parcels merge, bindings re-point. ⛔ **Amended (charter §Σ AR-3): confined to the LIT surfaces. The dark path and `townCartographyDormancyGolden.test.js` do NOT move**, because `townCartographyEnabled` is set true nowhere in `src/` and the dormancy arms do not depend on the block's contents. Named in the packet, re-recorded with the cause stated, per the non-negotiable.
- no flag — it lands inside `townCartographyEnabled` (charter §0.5's amended table)

#### `EST-3` — the draft on assembled ground
- **depends on** EST-2b, DW-2c
- `MODIFY src/domain/townCartography/cartographyBuildings.js` — institution rows claim the subcell(s) their program needs; dwellings untouched; max +36 eff
- `MODIFY src/domain/townCartography/cartographySynthesis.js` (+6)
- `CREATE tests/domain/townCartographyProgramDraft.test.js`
- **acceptance (7)** an institution claims ≥1 subcell and never more than 4; the three-rung shrink ladder is REUSED unchanged — *mutant: add a fourth rung*; `packFootprint`'s exact predicate still runs on every vertex; dwelling packing is byte-identical to today — *mutant: change a dwelling shrink permille* — the dormancy proof; a town inn's draft contains every cell of its `ProgramMinimum`; **there is no draft-then-redraft** (assert the draft function is called exactly once per building) — *mutant: call it twice*; an institution that cannot pack is still NAMED, now with the richer payload
- +7 titles · **⛔ GOLDENS MOVE** (footprints shift) · **DECLARED SHIFT: yes, the same one as EST-2a/2b, re-recorded ONCE across the three** · no flag

#### `EST-4` — ownership
- **depends on** DW-1f
- `CREATE src/domain/townCartography/cartographyEstates.js` (+180) · `MODIFY cartographySynthesis.js` (+8) · `CREATE tests/domain/townCartographyEstates.test.js`
- **acceptance (6)** membership is "shares an `ownerRef`", not "shares a boundary" — a non-contiguous member joins with no geometry change; `ownerRef` is an institution anchor or `ANONYMOUS_FABRIC` and a household key is refused — *mutant: accept a dwelling id*; `owns` and `occupies` are distinguishable on the member row; an estate has no polygon — *mutant: add one*; a dissolving owner's estate survives as a `remnant`-owned estate rather than being deleted; `estateId` is a pure function of `ownerRef`
- +6 titles · **SHIFT: NONE** (estates emit no op until DW-6d) · no flag

#### `EST-5` — accretion and the reverse motions
- **depends on** EST-4, EST-2b
- `MODIFY src/domain/townCartography/cartographyEstates.js` (+60) · `CREATE tests/domain/townCartographyAccretion.test.js` · `MODIFY cartographySynthesis.js` (+6)
- **acceptance (8, the cap)**
  1. **every range present at year N is present and unmoved at year N+1** — the constitutional arm — *mutant: re-draft on acquisition*
  2. a `PARTITION` un-merges along `mergedFrom` exactly — *mutant: cut at the centroid*
  3. a `SWAP` changes zero geometry — *mutant: touch a polygon*
  4. a split line that would cross a range emits a `PARTY_WALL` or `ENCROACHMENT` member, never a moved wall — *mutant: move the wall*
  5. `DISSOLUTION` reclasses and never deletes; `reclassedTo[]` gains a DATED link seeded from `worldPulseFate`
  6. **`worldPulseFate` is READ, never re-derived from the name** — *mutant: re-run a name regex* (the fate function's own substrings are unanchored)
  7. every motion emits an `EstateEvent` with `since` and `cause` from the closed enums
  8. replay determinism: same seed to the same year gives the same holdings
- +8 titles · **SHIFT: NONE at generation** (the motions fire at advance) · no flag

#### `EST-6` — the embellishments
- **depends on** DW-1b, EST-3
- `CREATE src/domain/dwellings/dressing/yardFixtures.js` (+160) · test
- **acceptance (6)** the set is closed; the choice is a pure function of (function, prosperity, `conditionOf`, season) — *mutant: add a random draw*; **determinism: same seed, same hides** — *mutant: seed from the clock*; a `ruined` tannery has frames and no hides and an `abandoned` one has neither — the wear ladder's first rung — *mutant: keep stock at every condition*; excavated features never shed; **no fixture asserts a fact absent from the engine** (assert every input field is read from an existing record) — *mutant: read an invented field*
- +6 titles · **SHIFT: NONE until DW-6d paints them** · no flag

---

### DW-3, DW-4, DW-5 — condensed

| Car | changeManifest (abbrev.) | Acceptance headline | Census | Shift |
|---|---|---|---|---|
| `DW-3a` fixtures | CREATE `dressing/fixtureDeriver.js`, MODIFY `interiorModel.js`, test | grade × wear is a 3×3 table; `RECESS` placement is countable and dateable | +5 | none |
| `DW-3b` supply state | CREATE `dressing/supplyStateVariants.js`, test | a stalled chain gives a COLD forge — *mutant: keep it lit* | +4 | none |
| `DW-3c` tier split | MODIFY `project/planPane.js` (created at DW-6a) — **re-order after DW-6a** | player abstract / DM named; the covert scrub stays byte-identical | +4 | none |
| `DW-4a` the seam | CREATE `seam/undercityProjection.js`, test | `stair` at "cellar door" resolves through `frontFor(seed).anchor` — *mutant: match on name*; the DOWN-STAIR diagnostic exempts an in-plinth store | +5 | none |
| `DW-4b` the honesty clause | MODIFY `seam/undercityProjection.js`, test | with UC-5 absent, the projection states components-not-routes — *mutant: imply a route* | +3 | none |
| `DW-5a` walker | CREATE `validate/lawfulnessWalker.js`, test | every absence is reasoned — *mutant: allow an unreasoned absence* | +7 | none |
| `DW-5b` reachability+absence | CREATE `validate/reachabilityAbsence.js`, test | **a refused joint is proven ABSENT**; `approach: NONE` certifies; a zero-cell plan certifies LAWFUL | +7 | none |
| `DW-5c` continuity | CREATE `validate/continuityArm.js`, test | anchors persist across a single-band change; a hosted function's key is the HOST's — *mutant: key on the guest* | +5 | none |
| `DW-5d` arithmetic | CREATE `validate/arithmeticArms.js`, test | `furnaces ≤ flues + portableFurnaces`; **the concealed cell debits its host's area and the sum checks** (the §0 H9 cure) | +5 | none |

---

### DW-6, DW-7, DW-S — condensed

| Car | changeManifest (abbrev.) | Acceptance headline | Census | Shift / flag |
|---|---|---|---|---|
| `DW-6a` pane | CREATE `project/planPane.js`, test | lazy contract honoured; tiers respected | +5 | none |
| `DW-6b` PDF | CREATE `project/planPdf.js`, test | multi-floor pages reconcile with `Storey[]` | +4 | none |
| `DW-6c` Foundry walls | CREATE `project/planFoundryWalls.js`, MODIFY `interiorExport.js`, test | UVTT walls close every cell; a door is a gap, not a wall | +5 | none |
| `DW-6d` parcel ring + members | MODIFY `cartographyPaint.js` (**the identity edit** + `estate`/`member` ops), test | `ops.length` identity holds with the new terms — *mutant: forget one term*; back-to-front order is wards→parcels→estates→streets→buildings→members | +6 | **paint goldens move; declared** |
| `DW-6e` estate view | CREATE `project/estateView.js`, test | reads the cartography block, not the fabric | +4 | none |
| `DW-7b` deltas | CREATE `delta/planDelta.js`, test | **the strict no-op: an empty delta is byte-identical and consumes zero rng** — *mutant: fork the rng unconditionally* | +5 | none |
| `DW-7c` news | MODIFY `delta/planDelta.js` + the news seam, test | every emission carries the address chain, typed action, names, reason | +5 | none |
| `DW-7d` endowment stream | CREATE `program/endowmentEvents.js`, test | an upgrade from `NO_BUILDING` to OWN is licensed by an EVENT, not by prosperity — *mutant: license by prosperity* | +5 | none |
| **`DW-7a` ACTIVATION** | MODIFY `simulationRules.js` (the flag row), MODIFY `subsystemRowsVirtual.js`, MODIFY `subsystemRowsVirtual.test.js` (3 module-scope edits), the acceptance's literal `<flag>: true`, `contributionLedgerShape.test.js` (2 literals + **rename** the title), `coveringArrayCoverage.test.js` (3 figures) | the click surface lights behind the flag; **flag off ⇒ byte-identical to today** — *mutant: leak a plan when the flag is off* | +4 titles, **0 renamed-not-added** | **THE ONE FLAG — the SIX-surface bill; `build:edge-shared` in the SAME commit (7 files); `tests/edgeFunctions` joins the sweep** |
| `DW-S1..3` soak | CREATE `soak/dwellingsSoakLeg.js` + harness + report, tests | the nine arms of charter §6.1; **a vacuous arm announces itself** | +9 | none |

---

### 4.1 · The order, as a dispatch list

```
CG-1 -> CG-2                           (not DW's; LANDED FIRST -- charter SS5.0')
CH-1, CH-2, CH-3                       (not DW's; must be LANDED before DW-1a)
DW-R1 -> DW-R2 -> DW-R3
DW-1a -> DW-1b            (both touch interiorTemplates.js: serialize them)
DW-1c, DW-1d, DW-1e, DW-1f            (parallel; no shared file)
DW-2a -> DW-2b -> DW-2d -> DW-2e      (2b/2d/2e all touch interiorModel.js: serialize)
EST-1a..1d -> DW-2c                    (2c needs the program table)
EST-2a -> EST-2b -> EST-3              (the golden re-record is ONE act across the three)
EST-4 -> EST-5
EST-6
DW-3a -> DW-3b
DW-4a -> DW-4b
DW-5a -> DW-5b, DW-5c, DW-5d           (parallel after 5a)
DW-6a -> DW-3c                         (3c re-ordered: it modifies 6a's file)
DW-6b, DW-6c, DW-6e                    (parallel)
DW-6d                                   (after MP-1 has landed its identity edit)
DW-7b -> DW-7c; DW-7d
DW-7a                                   (LAST — the only light car, the only flag)
DW-S1 -> DW-S2 -> DW-S3                (after DW-5)
```

**⛔ THREE serialization rules that are not obvious and will bite** (the first is
new — charter §Σ AR-5):

0. **CG-1 and CG-2 land before DW-1a, ahead of CH.** They MODIFY
   `cartographyTuning.js` and `cartographyBuildings.js`, both of which EST-3 also
   modifies, so the manifest scan at each EST base must include the CG paths.
   And EST-2b's capacity arm is only true once CG-2 lands.
1. **`interiorModel.js` is touched by DW-2b, DW-2d, DW-2e, DW-3a and DW-6a.**
   Five cars, one file. They must be serialized, and each must re-read the file
   at its own base — a pre-commit `eslint --fix` re-stages, so `git diff HEAD` is
   blind and the green must be re-proven AT the committed tip.
2. **`cartographySynthesis.js` is touched by EST-2b, EST-3, EST-4 and EST-5.**
   Same rule. And it is a LANDED `MODIFY` path in three earlier packets
   (TC-3A/3B/4), so the manifest scan must be re-run before each of the four.

**Total: 41 DW cars / ⛔ 45 dispatchable commits** (DW-R 3, DW-1 6, DW-2 5,
ESTATE **10** after EST-1's four-way split and EST-2's two-way split, DW-3 3,
DW-4 2, DW-5 4, DW-6 5, DW-7 4). The charter's §5 headline counts CARS as
planned; this figure counts COMMITS as dispatched; the difference is EST-1 (+3)
and EST-2 (+1). ⛔ **Amended (charter §Σ AR-2/AR-9): the compile said 41/41 and
arch-4 said 41/44; EST-2's rewritten acceptance takes it to 45.**

⛔ **Plus TWO prerequisite commits outside that total, CG-1 and CG-2** — family
`cartography`, repairing landed code (charter §5.0′), exactly as CH-1/2/3 sit
outside it. **The arc a build lane actually dispatches is 47 commits.**

## arch-5 · THE TEST ARCHITECTURE

Four layers, plus the ratchets each wave will trip. The rule underneath all of
them: **discovery is automatic, registration is manual, and the test forces them
to move together in the same change.**

### 5.1 · Layer 1 — the invariant walkers (correctness-asserting; land LAST in their wave)

These assert the data is RIGHT, so each ships WITH the fix that makes it true,
never before it.

| Walker | Asserts | Discovery half (automatic) | Registration half (manual) | The mutant that convicts it |
|---|---|---|---|---|
| **W1 containment is still a theorem** | every footprint's every vertex, and its anchor, passes `scenePointInPolygon` against its parcel — **including merged parcels** | walk every building row of a generated settlement at 5 seeded tiers, ⛔ **over BOTH corpora — the 20-row fixture set AND the real-pipeline set CG-1 lands** | none | union two wedges by convex hull (same points, wrong vertex order) |
| ⛔ **W0 no two rows share a footprint** *(new; charter §Σ AR-1 / §0 H29)* | no two building rows in one compiled block have byte-identical footprints | hash every row's footprint per block and group | none | **restore the non-consuming flagship round — which fails 183 times over 32 real settlements at base.** This walker lands WITH CG-2, never before it, because before it the property is simply false |
| ⛔ **W0b every settlement compiles** *(new; charter §Σ AR-5 / §0 H31)* | every member of the real-pipeline corpus compiles LIT without a premise error | iterate the frozen corpus | the corpus module | restore any pre-CG-1 per-tier band — **fails 24/24 at hamlet, village and town** |
| **W2 one writer per fact** | a source scan: only `cartographyAllocation.js` writes `binding.parcelId` (EST-2b); only `cartographyEstates.js` writes an `Estate`; only `verticalPartition.js` builds a `Storey[]`; only `yardFixtures.js` emits a `YardFixture` | glob `src/**/*.js`, regex the write shapes (assignment, `push`, `splice`, spread-rebuild) | the exempt list, one entry per legal writer | add a second `.parcelId =` anywhere |
| **W3 every program row is registered** | exact-set equality between the catalog's (shelf, name, tier) triples that can fire and the `ProgramMinimum` table's keys | read `institutionalCatalog.js` and enumerate | the 11 shelf files | add a catalog row without a program row; delete a program row whose catalog row still exists |
| **W4 every estate member resolves** | every `EstateMember.parcelId` names a parcel in the same block; every `ownerRef` is an institution anchor or `ANONYMOUS_FABRIC` | walk the compiled block | none | point a member at a deleted parcel |
| **W5 accretion never rewrites a lived range** | for every property that grew between epoch N and N+1, the set of ranges at N is a SUBSET of the set at N+1, and each has identical geometry | diff two epochs of the same seed | none | re-draft on acquisition |
| **W6 no `ProgramMinimum` row carries an area** | a source scan of the 11 shelf files for `area:` / `footprint:` | glob the table dir | none | add an area field (chair R2′(c)'s guard) |
| **W7 the joint vocabulary is the undercity's** | `src/domain/dwellings/**` contains no string literal equal to a joint kind outside an import from `jointVocabulary.js` | glob + regex | none | hardcode `'stair'` in a DW leaf (a second truth) |
| **W8 purity** | no `Date`, `Math.random`, `localeCompare`, or `new Date(` under `src/domain/dwellings/**` or in the two new cartography leaves | directory walk (the existing `interiorModel.test.js` idiom) | none | read the clock |

**Why W1–W8 are walkers and not pins:** each asserts a property of an OPEN,
tree-derived population, so its verdict is byte-identical however many new
instances land. That is what makes them cheap forever.

### 5.2 · Layer 2 — the acceptance suites, per car

One file per car, named in the car's `changeManifest` as a **`CREATE` row** (a
new test file is a CREATE, never a TEST — the TEST path must exist at every
status). Arms are capped at 8 and each names the mutant that would convict it —
arch-4 carries them.

**The ⛔ THREE arms every car has, whatever else it has** (the third is new —
charter §Σ AR-2/AR-5):

1. **The dormancy proof.** Before the wiring, the car's own change is
   byte-identical to today on a fixed seed set. DW-2a's fallback arm, EST-3's
   dwelling-packing arm, CG-1's fixture-corpus arm and DW-7a's flag-off arm are
   the four that matter most.
2. **The vacuity guard.** An arm that could pass over an empty population must
   assert the population is non-empty first. Measured precedent: a whole-document
   `includes(name)` PASSED after the row it checked was deleted, because the
   prose named it too. Slice the section, compare ordered lists.
3. ⛔ **THE FAILING CONTROL — a control that cannot fail proves nothing**
   (ODQ §503's measurement law, and this program earned it twice). **Any arm
   asserting that a measured quantity sits inside a tolerance must, in the same
   test file, run the identical predicate over a population that is OUTSIDE it,
   and assert that it fails.** Without the second half the arm only proves the
   tolerance is loose. Worked instances this architecture already carries:
   EST-2a's lattice arm passes 1,056 of 1,056 intra-edge triples and must show
   the vertex-crossing control failing 528 of 528; CG-1's compile arm passes on
   the real-pipeline corpus and fails 24 of 24 at three tiers with any old band
   restored; CG-2's uniqueness arm fails 183 times at base. **An arm whose base
   state is already green has not been shown to measure anything.**

> ⛔ **AND THE CORPUS RULE THAT REMOVES THE HABITAT (charter §Σ AR-5).** The
> defect CG-1 repairs exists because **every cartography corpus pin in the suite
> runs against `makeTownFixture` output** — hand-made settlements with small,
> tidy rosters — and the stage was therefore never once run against what the
> generator actually produces. Measured, real settlements exceed a shipped
> per-tier band at four of six tiers, three of them every single time. **From
> CG-1 onward, every corpus pin over the cartography stage runs against BOTH
> corpora**, and a new per-tier band is authored against the real one. That rule,
> not the six numbers CG-1 moves, is the actual cure.

### 5.3 · Layer 3 — the property and golden surfaces, and which move

| Surface | Moves? | When, and why |
|---|---|---|
| ⛔ **the eight LIT cartography test files** — `townCartographyParcels`, `…Buildings`, `…Wards`, `…Paint`, `…Determinism`, `townSceneCartography`, `tests/lib/townCartographyBlock`, `tests/hooks/useTownCartographyBlock` | **YES, TWICE** | **first by CG-1+CG-2** (settlements that threw now compile; colliding footprints separate) — ONE re-record across that pair — **then by EST-2a+EST-2b+EST-3** (parcels merge, footprints move) — a second re-record across those three. Two declared acts, each with its cause stated. |
| ⛔ `tests/property/townCartographyDormancyGolden.test.js` | **NO** | its dark baseline predates the stage and is untouched; its lit arm asserts that stripping the block recovers the dark manifest, which stays true when the block's CONTENTS change. **Named explicitly so nobody re-records it "to be safe" — doing so would destroy the fence.** |
| the same-seed map goldens | **YES** | same cause, same acts |
| `tests/domain/townCartographyPaint.test.js` (the op-count identity) | **YES** | first by MP-1 (the `parcel` op), then by DW-6d (`estate`/`member`) |
| the interior goldens | **NO** | DW-2a's fallback is byte-identical; every other DW-1/2 car is dark |
| generation goldens (economy, power, services, news) | **NO** | DW writes no generation byte. **This is a claim a car must PROVE, not assert:** every wave runs the generation golden and cites it green. |
| the covert-scrub path-independence pin | **NO** | DW-3c must keep the two public paths byte-identical |
| the flag registry figures | **YES, at DW-7a only** | three figures in `coveringArrayCoverage.test.js` move in lockstep while four others must not |

**The strict no-op test** (DW-7b) is the delta mechanism's own guard: an empty
`PlanDelta` produces output byte-identical to no delta at all, **and consumes
zero rng**. It pins that the mechanism's mere presence perturbs nothing, which is
the failure nobody thinks to check.

### 5.4 · Layer 4 — the soak-leg assertions (DW-S)

Charter §6.1's nine arms, implemented as one harness with nine independent
verdicts so a single failure does not mask the rest:

| Arm | Shape | Vacuity risk |
|---|---|---|
| A1 cell boundedness | a per-tier band, asserted per epoch | none |
| A2 churn boundedness | a delta band | vacuous if no circumstance changed — the arm must report "not exercised" |
| A3 fossil boundedness | a count band | as A2 |
| A4 determinism | re-derive twice at one epoch, compare bytes | none |
| A5 continuity | anchors persist across a single-band change | vacuous if no band changed in 300 y — **report it** |
| A6 lawfulness | the S12 walker green on every sample | none |
| **A7 ownership boundedness** | consolidation ceiling AND fragmentation floor, both per epoch | **vacuous if no amalgamation fired** — this is the arm most likely to pass while proving nothing, and it MUST announce it |
| A8 reverse-motion determinism | replay to year Y twice; and assert no event mutates an earlier year's record | vacuous if no reverse motion fired |
| A9 accretion immutability | W5, run per epoch | as A7 |

**The vacuity discipline is not optional here.** A soak that reports nine green
arms over a corpus where four were never exercised is worse than a soak that
reports five green and four not-exercised, because the first is read as proof.

### 5.5 · The ratchets each wave will trip

Measured at base, so a builder knows what to expect before the terminal gate
tells them:

| Ratchet | State at base | What DW does to it |
|---|---|---|
| **The test census** | grows with every added title | ⛔ **~145 new titles across 47 commits** (amended: +2 from DW-1a's widened acceptance and EST-2's split, +11 from CG-1 and CG-2). Each car states its own delta. ⚠ A delta SMALLER than the titles added is not arithmetic to accept — attribute it by reverting one test file at a time, because a parked file swallows its titles. |
| **The banked-failure ratchet** `scripts/.test-ratchet-baseline.json` | **11 entries**, `CEILING = 17` (`tests/lint/testRatchet.test.js:181`) — it has burned DOWN from 17 | DW should add **zero** entries. A banked failure is a debt, and every DW car is new code with no legacy red. |
| **The size baseline** `scripts/.size-baseline.json` | **10 entries**, none a DW file | DW adds **zero** entries and moves **zero**. The largest modified file ends at ~275 effective against a ceiling of 800. A car that would need an entry has mis-scoped. |
| **`sizeBaseline.test.js`'s honesty arm** | demands a file under its layer ceiling has NO entry | nothing to do, but do not "helpfully" add one |
| **Reader walkers** (the arch-drift / layer-inclusion family) | live | 33 new files in a new directory: check `.coupling-inclusion-baseline.json` and `.coupling-unlayered-baseline.json` before the first CREATE — a new top-level `src/domain/dwellings/` may need a layer declaration |
| **`.domain-any-baseline.json`** | live | DW writes **zero** `any` casts; the new files must not appear in it |
| **`.prose-numerics-baseline.json`** | live | ⚠ the charter and DWELLING-SPEC carry many measured figures; **any `docs/**.md` write is a gate risk and naked-claim debt is PER CLAIM** — DW-R1 must run the exact CLAIM_RE before committing |
| **`publicTableRlsCensus`** | +1 ratchet test per created table | **DW creates no table.** |
| **`ruinFilterRoster` / `seedLoopTotality`** | the undercity's | **DW adds no undercity row**, so neither moves. If a DW car finds itself editing either, it has crossed into the undercity train. |

### 5.6 · The structural-prevention wave, and why it is LAST

W1–W8 are correctness-asserting: they claim the data is right. Over substrate
that is still being built they would enshrine whatever is there. So:

- **Wave 0 equivalent (lands with DW-1):** only the SHRINK-ONLY guards —
  the `stall`-has-no-producer scan (W-ish, but it asserts an absence that is
  already true) and the purity scan W8. Both tolerate the current state.
- **W1–W7 land with the car that makes each true**, in the same commit as the
  fix, never before it.
- **The final prevention car (after DW-S)** re-runs every walker over the
  finished tree and freezes the exempt lists with a DATE and the commit they were
  hand-audited at.

**Ratchet kindness applies to all eight.** Every failure message names (a) the
rule and one sentence of mechanism, (b) the exact helper or module to use
instead, by path, and (c) the one legal move that is not "widen the guard".

## arch-6 · THE RISK REGISTER

Ordered by cost-if-wrong, highest first. Each risk names its CONTROL — the
specific arm, gate or measurement that catches it — because a risk without a
control is an anxiety.

---

### R-1 · THE SAME-SEED SHIFT AND THE ONE-REGEN DEADLINE — **cost: the endgame tail**

**The risk.** The ESTATE wave (EST-2a + EST-2b + EST-3) changes the drawn map of
every settlement that already exists — and ⛔ **the CG train moves the same
surfaces first**, so there are now TWO declared re-records before the regen, not
one (charter §Σ AR-3/AR-5). The endgame plans exactly ONE regeneration before
the terminal soak. **If this arc lands after that regen, it forces a second one**,
and the tail order (ODQ §341/§456) has no room for it: nothing that can move an
output may land after the tuning signature.

**Why it is first.** Every other risk on this list costs engineering time. This
one costs a scheduling decision that has already been made once and would have to
be re-made, and it is the only risk on the list that a build lane cannot fix.

**Control.** It is not a test — it is charter §7's first line, put in front of
the owner before the bands, as chair ruling R7 requires. **The control is that
the owner reads it.**

**Secondary control.** CG-1 and CG-2 re-record as ONE act; EST-2a, EST-2b and
EST-3 re-record as a SECOND, each with its cause stated, so the shifts are two
declared events in the history rather than five undeclared ones. ⛔ **And the
shifts are confined to the eight LIT cartography test surfaces**: no user sees a
pixel move, because `townCartographyEnabled` is set true nowhere in `src/`.

---

### R-2 · THE CONTAINMENT THEOREM — **cost: the map's only proof**

**The risk.** `cartographyParcels.js:11-20` earns containment as a THEOREM
precisely because it has "no clipping, no jitter, no overlap repair and no
'try again with a smaller box'". An allocation pass that retried until a
building fitted would reintroduce exactly that loop, and the map would lose the
one property it can prove rather than test.

**Why it nearly happened.** Chair ruling R2 originally framed the fix as
refusal-over-repair; R2′ (§497) superseded it because a refusal at draw time
makes the map contradict the roster. **The reconciliation is that allocation
SELECTS and UNIONS before anything is drawn** — no drawn shape is ever repaired.

**⛔ AND THE CONTROL THE COMPILE WROTE COULD NOT PASS (amended, charter §Σ AR-2).**
The compile's EST-2 arm 1 asserted the union of two adjacent same-edge wedges is
**EXACTLY** `[C, cuts[s], cuts[s+2]]`, on the reasoning that the three cuts are
collinear. **They are not: `cartographyParcels.js:100-104` rounds both interior
cuts onto the integer lattice, and 646 of 1,056 real triples (61.2%) are
non-collinear.** The arm was unpassable and its subject was the wrong one — the
honest four-vertex union is what the "mutant" would have produced.

**Controls, as amended.**
- W1 (arch-5): every vertex and anchor of every footprint passes
  `scenePointInPolygon` against its parcel, including merged parcels — **over
  both corpora**.
- **EST-2a arm 1 (CONSTRUCTION):** the merged parcel IS `[C, cuts[s], cuts[s+2]]`
  and `polygon.length === 3`. *Mutant: emit the true four-vertex union*, which is
  geometrically exact and reds `townCartographyParcels.test.js:265`. The arm
  exists to make that trade explicit.
- **EST-2a arm 1b (BOUNDED FIDELITY, in the suite's own unit):**
  `scenePointSegmentDistanceSq(cuts[s+1], cuts[s], cuts[s+2]) <= 1` — the exact
  predicate and constant `withinWard` uses at `townCartographyParcels.test.js:164-172`,
  whose own comment names the sqrt(0.5) lattice bound — plus a symmetric
  difference at most 2% of the merged parcel. **Measured: max squared deviation
  0.4999, max symmetric difference 1.403%, over 1,056 triples, zero exceedances.**
  ⛔ ***With its failing control in the same file:*** the same predicate over
  vertex-crossing pairs gives squared deviations of **291.3 to 3,183.6, 0 of 528
  passing.** Subject 1,056/1,056; control 0/528.
- EST-2a arm 4: at most 2 unions per ward edge, so the "loop" is a bounded `for`,
  not a retry.
- EST-3 acceptance arm 2: the three-rung shrink ladder is reused UNCHANGED.

**Residual.** The VERTEX-crossing merge yields a quadrilateral — **measured, 528
of 528 are genuine convex quads with zero degenerate**, and `packFootprint`
destructures three vertices at `:121` — so
`cartographyBuildings.js`'s medial-subdivision-into-four proof does not apply to
one. **Deferred, not solved** (charter §9.3 D-4). The first landing refuses it.
**The charter got this refusal right while getting the theorem it depended on
wrong**, and the asymmetry is worth carrying: structure read from the source
held; geometry inferred without running it did not.

---

### R-2b · ⛔ THE CAPACITY THE ALLOCATOR IS BUILT ON DOES NOT EXIST YET — **cost: a receipt that means nothing**

**New in the amendment (charter §Σ AR-1; §0 H21, H29; arch-0 §0.3a).**

**The risk.** The compile made H21's "at most four buildings fit a parcel" the
capacity predicate at charter §4.2 step 4. Measured, the engine emits up to
**7 rows per parcel on the fixture corpus and 11 on real pipeline settlements**,
and **13.0% of all rows share a byte-identical footprint with another row** —
because a flagship is exempt from the occupancy cap and never consumes a subcell.
**An allocator built on the stated bound triggers its bounded UNION on the wrong
condition, and `programSatisfied` is a receipt for a capacity nothing keeps.**

**Controls.**
- **CG-2 makes the bound true before EST-2b is written** — the flagship round
  consumes its subcell, spills to a ward sibling, and falls to the existing NAMED
  premise path when the ward is full. **EST-2b's dependency on CG-2 is the
  control; without it the arm below is unfalsifiable.**
- **EST-2b arm 2b:** `availableToProgram = 4 − flagshipsBoundHere`, never the
  tier band. *Mutant: use `BUILDINGS_PER_PARCEL[tier]`* — which **passes
  trivially at city and metropolis** (band 4 = slots 4) and **fails at thorp,
  hamlet, village and town**, convicting the mutant exactly where the two
  disagree.
- **W0 (arch-5):** no two rows in a compiled block share a footprint. Fails 183
  times at base; lands with CG-2.

**Residual.** ⚠ **A merge HALVES the slot count while doubling each slot** — two
wedges carry eight medial subcells, their union carries four. An allocator that
merges to fit *more* cells has the sign backwards. Stated in charter §4.2 and
arch-2 §2.1; there is no test that catches the sign error, only the prose.

---

### R-3 · DETERMINISM UNDER MERGE — **cost: THE PROMISE**

**The risk.** Allocation introduces a CHOICE that did not exist before (which
candidate, and whether to union). If that choice reads anything order-dependent,
clock-dependent or entropy-dependent, the same seed stops producing the same
town — and every golden, every soak arm and the constitutional promise go with
it.

**Why it is real and not theoretical.** `cartographyParcels.js:34-38` states that
the leaf "roots no stream, forks no label, and consumes nobody's entropy", and
`cartographyBuildings.js:30-31` notes that instances distribute round-robin "so a
single high-count institution cannot starve the rest" — i.e. the existing code is
already careful about order-dependence, and a new selection pass is exactly where
that care gets dropped.

**Controls.**
- EST-2b acceptance arm 5: **the allocation runs identically with a poisoned
  PRNG.** The mutant is a single `rng()` call.
- EST-2b acceptance arm 6: the candidate order is `orderCandidates`' order,
  unchanged.
- EST-2b acceptance arm 8: `binding.parcelId` is the only binding field written —
  because the header at `cartographySynthesis.js:397` requires the receipt be
  consumed VERBATIM.
- W8 (purity scan) over both new cartography leaves.
- DW-S arm A4 and A8: determinism at every epoch, and no reverse motion
  rewriting an earlier year.

---

### R-4 · ⛔ THE CONSOLIDATION RUNAWAY — **cost: a 300-year world that is wrong and looks fine**

**The risk.** A "prosperous holders acquire" rule, run for 300 years with no
counter-force, converges on ONE owner holding the entire town. It is the
population-runaway lesson (ODQ §341) transposed onto ownership.

**Why it is the most dangerous risk in the register after R-1.** It is
**invisible to every test the estate runs today**, because every one of them is
single-generation. A settlement generated and inspected at year 0 looks perfect.
The failure only exists in the soak, and only if someone thought to measure it.

**Controls.**
- **DW-S arm A7** is the control: a band at BOTH ends, per epoch — a
  consolidation ceiling (the largest single owner's share of parcels) and a
  fragmentation floor (the mean holding size). Reported as a tuning input beside
  the population runaway and the map leg.
- The five counter-forces are compiled as first-class, each historically grounded
  (charter §4.6): partible inheritance and partition on succession, decline and
  debt sale, institutional dissolution, forfeiture and escheat, fire and
  abandonment.
- Charter §7 B9 puts the acquisition-versus-partition balance in front of the
  owner as a per-culture band, so the number is signed rather than guessed.

**⚠ The vacuity trap on this control.** A7 passes trivially over a corpus where
no amalgamation ever fired. **The arm must report "not exercised"**, and arch-5
§5.4 makes that mandatory. An A7 that is green because nothing happened is the
exact shape of a reassuring lie.

---

### R-5 · PERFORMANCE — ⛔ **DISCHARGED BY MEASUREMENT. THE ANSWER IS NOT CLOSE.**

**Amended (charter §Σ AR-10). The compile could produce only an analytic bound
and said so honestly; the skeptic panel ran the wall clock. Here is the number,
and it is the one the owner will quote.**

| Stage (median ms, node, 7 reps after warm-up, real pipeline settlements) | thorp | village | town | city | metropolis |
|---|---|---|---|---|---|
| **A. Full settlement generation** | 7.1 | 16.9 | 24.6 | 23.4 | **29.9** |
| **B. Map/cartography manifest compile, LIT** | 11.5 | — | — | — | **139.7** |
| **C. ONE interior plan derivation, per building** | 0.2 | 0.4 | 0.7 | 0.9 | **1.3** |
| **D. Eager derivation of EVERY drawn building** *(the case the architecture excludes)* | 1.0 | — | — | — | **~309** |

**⭐ A metropolis costs about 30 ms to generate and about 140 ms to compile its
map — roughly 170 ms against a 2,000 ms budget. The architecture's lazy,
per-building plan derivation adds 1.3 ms on click, which is invisible. Even the
worst case the architecture explicitly excludes — deriving all 240 drawn
buildings eagerly — costs about 309 ms, which still fits inside two seconds
alongside everything else.**

**Two seconds survives with roughly an order of magnitude of headroom, and it
survives even if the laziness contract is broken.** The dominant cost is the
EXISTING cartography compile at 140 ms, not anything DW adds.

**Two honest caveats.** (i) These are node-side numbers on one machine with a
warm module graph; browser numbers will differ, though the ratio to budget is
what matters and it is about 12 to 1. (ii) EST-2b's allocation is not measured
because it does not exist — but its own bound (at most 96 institutions × 24
candidates = 2,304 integer comparisons) is negligible beside a 140 ms compile
that already runs point-in-polygon over 5,961 vertices.

**Control: the pre-DW-2 measurement lane charter C5 ordered is STRUCK.** Keep a
timing series in DW-S for drift. **Do not spend a lane on this.**

**The analytic bounds below are retained because they are still the right way to
reason about the SHAPE of the cost, and because they are what the timing table
above should be checked against if either ever changes.**

**What was read** (executed reads of the tuning constants at base; these are
real bounds, not estimates):

| Bound | Value | Source |
|---|---|---|
| wards per settlement | ≤ 48 (metropolis) | `cartographyTuning.js:204-206` |
| ward vertices | ≤ 8 | L209 |
| candidate fan per ward | vertices × 3 ≤ **24** | L217 + `cartographyParcels.js:95-106` |
| parcels kept per ward | ≤ 12 (metropolis) | L221-223 |
| institution bindings | ≤ 96 (metropolis) | L228-230 |
| buildings drawn | ≤ 240 (metropolis) | L278-280 |
| buildings per parcel | ≤ 4, always | L275-277 + the medial-subdivision theorem |

**The derived cost of the NEW work, per settlement, worst case (metropolis):**

- **Allocation (EST-2a/2b):** ≤ 96 institutions × ≤ 24 candidates = **≤ 2,304
  program-satisfaction tests**, each a small array comparison, plus ≤ 2 unions
  per institution. Bounded, integer, no allocation of geometry. **Negligible
  against the existing packing pass, which already runs a 3-rung ladder with an
  exact point-in-polygon test on every vertex of up to 240 footprints.**
- **Plan derivation (DW-2..DW-5):** ≤ 240 buildings × (storeys × cells). At a
  plausible ceiling of 4 storeys × 12 cells that is **≤ 11,520 cells** per
  metropolis, each with a polygon, a fixture list and a joint list. **This, not
  allocation, is the cost driver.**

**The mitigation is already in the architecture, not bolted on.** Plan derivation
is **lazy and per-building**: the pane derives ONE building's plan on click (the
vendor-lazy contract, DW-6a). Nothing derives 11,520 cells during a settlement
build. The only places that derive everything are (a) the PDF chapter, which is
an explicit user act, and (b) the soak leg, which is offline.

⛔ **The compile's closing paragraph here read "WHAT I DID NOT MEASURE, stated
plainly. I did not run a wall-clock probe… Charter §9.6 Q-D asks the chair to
order a measurement lane before DW-2 lands." It has been run.** The declaration
was honest and it is superseded by the table at the head of this row; Q-D is
CLOSED and C5 is DISCHARGED, not ordered.

**Control.** A soak-leg timing series once DW-S exists, for drift only.

⚠ **One thing the measurement changes about where to look.** The compile named
plan derivation as "the cost driver" at up to 11,520 cells per metropolis. The
wall clock says otherwise: **the existing 140 ms cartography compile is 82% of
the total and DW's lazy derivation is 0.8% of it.** If anyone ever optimises for
speed here, the target is the compile, not the plans.

---

### R-6 · THE HOUSEHOLD-IDENTITY GAP — **cost: a feature the owner may expect**

**The risk.** The owner's §498 definition of an estate explicitly includes "one
singular institution **or individual**", and §7 B11's most vivid example is the
merchant with a house on one street and a warehouse on the quay. **The engine
cannot express that today.**

**What I measured.** `git grep -niE "householdId|household_id" claude/composite-r4 -- src`
returns **zero rows**. `demographicsKernel.js` exports one function,
`advanceDemographics` — aggregate, not per-household.
`cartographyBuildings.js:9-10` states that dwellings are "population-derived
filler with **NO parallel identity**… **by design**", with ids
`carto:dwelling:<wardId>:<ordinal>` (L363).

**The decision taken, and why it is a judgment and not a gap left open.**
`ownerRef` resolves to an institution anchor or the reserved literal
`ANONYMOUS_FABRIC` (which `colonization.js:369` already uses for ground nobody
owns). **DW does not mint a household**, because minting one turns anonymous
filler into an identity the whole engine must then honour — a persistence-shape
act and an owner gate.

**Control.** EST-4 acceptance arm 2 refuses a dwelling id as an `ownerRef`.
Charter §7 B11 tells the owner the limit in their own register, before they sign
the band that depends on it.

**Residual.** Institutional estates work fully — the abbey with its grange, the
guild with its hall and its warehouse. **Family holdings wait**, and the owner
knows it.

---

### R-7 · THE CH DEPENDENCY — **cost: rework of DW-1**

**The risk.** CH-1/2/3 change catalog TYPING under this architecture: CH-1 mints
the per-entry `interiorKind` override and anchors every `FACET_INFERENCE`
keyword; CH-2 mints the declared `magicLicense`; CH-3 fixes the tier-block slips.
**A DW car that bakes a current facet resolution into a contract is wrong the day
CH-1 lands.**

**Concretely, the readings that are expected to CHANGE:** `Warden's Lodge`→vice,
`Dragon resident`→vice, `Charlatan fortune tellers`→security, the six
`guild|market|bazaar` criminal rows→trade, and every inn→generic. Each is a live
mis-inference at base (arch-0 §0.6) and each is CH-1's to cure.

**Controls.**
- The ordering rule: **CH-1/2/3 LANDED before DW-1a opens.** It is stated in the
  charter's §0.6, in §5.10 and in arch-4's dispatch list.
- **No DW module may re-derive a facet from a name.** W7-adjacent: a source scan
  could enforce it, and arch-5's W2 (one writer per fact) is the natural home —
  add `institutionNature` and `interiorKind` to its watched facts.
- Re-run the packet-manifest scan at the DW-1 base: the CH cars will reserve
  `cohesionWeave.js` and `institutionalCatalog.js` between now and then.

---

### R-8 · THE PAINTER'S LENGTH IDENTITY — **cost: a late red at the terminal gate**

**The risk.** `cartographyPaint.js:15-17` is an IDENTITY, not a band, and L19-21
says a parcel emits no op. ODQ §495.4(a) describes MP-1's parcel op as "an
INSERTION, not surgery" — **true of the ordering, false of the identity.** A car
that adds an op and does not move the identity fails at the terminal gate, which
is the most expensive place to find it.

**Control.** Named in charter §0 H25, in arch-0 §0.4 and in DW-6d's acceptance
arm 1 (the mutant: forget one term). **And it is handed to MP-1 explicitly**, so
whichever lands first pays it once.

---

### R-9 · FIVE CARS, ONE FILE — **cost: a lost green**

**The risk.** `interiorModel.js` is touched by DW-2b, DW-2d, DW-2e, DW-3a and
DW-6a; `cartographySynthesis.js` by EST-2b, EST-3, EST-4 and EST-5. Nine cars,
two files. ⛔ **And `cartographyBuildings.js` is now touched by CG-2 as well as
EST-3, and `cartographyTuning.js` by CG-1 — two more MODIFY paths in the same
trees, which the manifest scan at each EST base must include.** In a shared tree with a pre-commit `eslint --fix` that RE-STAGES,
`git diff HEAD` is blind and a green proven before the hook is not a green at the
committed tip.

**Controls.** Serialize each group (arch-4 §4.1's two serialization rules).
Re-read the file at each car's own base. **Re-prove the green AT the committed
tip**, not before the hook. And keep `interiorModel.js` to composition calls
only, so each car's delta is small enough to eyeball.

---

### R-10 · THE VOCABULARY IS 3× — **cost: a slow wave, not a wrong one**

**The risk.** 28 cell kinds become 83; 22 fixtures become 81. Every consumer of
those arrays — the templates, the renderer's per-kind draw, the WALL pin —
must grow with them, and a renderer that lacks a draw for a kind is a blank box
on a paying user's screen.

**Control.** DW-1a and DW-1b land the ENUMS only, dark, with a membership walker;
the renderer's per-kind coverage is DW-6a's problem and gets its own arm (every
`CELL_KINDS` member has a draw). The two are deliberately in different waves so
the enum growth cannot silently outrun the drawing.

---

### 6.1 · The register at a glance

| # | Risk | Cost if wrong | Control | Residual |
|---|---|---|---|---|
| ⛔ **R-0** | ⛔ **THE GROUND DOES NOT HOLD** — the stage throws on 32 of 48 real settlements and puts 13% of its rows on occupied ground | **the whole DW program: every geometry car reads what that stage emits** | **CG-1 and CG-2, landing before DW-1**; W0 and W0b; the real-pipeline corpus rule (arch-5 §5.2) | ⚠ the town/metropolis canonical-count inversion, reported by CG-1 and **not fixed** (charter D-11) |
| R-1 | the one-regen deadline | the endgame tail | charter §7's first line — the owner reads it | ⛔ the arc is now **two repair cars longer** before the regen |
| R-2 | the containment theorem | the map's only proof | W1 + **EST-2a arms 1/1b (with its failing control) + arm 4** + EST-3 arm 2 | the VERTEX merge, deferred |
| ⛔ **R-2b** | ⛔ **the capacity the allocator tests does not exist** | `programSatisfied` is a receipt for nothing; the UNION fires on the wrong condition | **CG-2 first**; EST-2b arm 2b; W0 | **a merge HALVES the slots** — prose only, no test catches the sign error |
| R-3 | determinism under merge | THE PROMISE | EST-2b arms 5/6/8, W8, DW-S A4/A8 | none |
| R-4 | the consolidation runaway | a 300-y world that looks fine | DW-S A7, both ends, per epoch | **the vacuity trap — A7 must report "not exercised"** |
| R-5 | performance | a product claim | ⛔ **MEASURED: ~170 ms of a 2,000 ms budget; 1.3 ms per building on click. C5 discharged, the lane STRUCK** | node only; browser unmeasured |
| R-6 | household identity | a feature the owner expects | EST-4 arm 2; charter §7 B11 tells them | family holdings wait |
| R-7 | the CH dependency | rework of DW-1 | CH lands first; no name-derived facets | none |
| R-8 | the painter's identity | a late terminal red | DW-6d arm 1; handed to MP-1 | none |
| R-9 | nine cars, two files | a lost green | serialize; re-prove at the tip | ⛔ **CG-1/CG-2 add two more MODIFY paths in the same two trees** — the manifest scan at each EST base must include them |
| R-10 | the 3× vocabulary | a slow wave | enums dark; coverage armed at DW-6a | none |
| ⛔ **R-11** | ⛔ **the frontage gate measures the wrong length** | chair ruling R1 admits 98.8% of parcels and filters nothing; every parti is eligible everywhere | charter §7 **BAND ZERO**, owner-signed; DW-2a reads the SUBCELL FACE and converts through `manifest.space.planUnitCm` | our plots are still fan wedges, not burgage strips — **the numbers become honest; the shape does not** (charter D-1) |

---

## AMENDMENT RECORD

**Lane TC-DW0-R2 (ODQ §484/§504.6), `[OPUS-RUN · FABLE-VALIDATION OWED]`.** Every
change this amendment made to the DW architecture, its panel finding, and its
evidence. The charter's own record at `§Σ AMENDMENT RECORD` is the authority for
the measurements; this table says what moved in THIS document. Base unchanged:
`claude/composite-r4` = `00e7af612d428078634d52ea37054bd00b773ca6`. **Zero repo
bytes written.**

| # | Part | What changed | Panel finding |
|---|---|---|---|
| **A-1** | arch-0 §0.2 | The merge claim re-stated: `[C, cuts[s], cuts[s+2]]` **by construction and within the suite's one-squared-unit lattice tolerance**, not "exactly". The street clause on the outer edge struck. | MF-2, MF-9 |
| **A-2** | arch-0 §0.3a *(new)* | **The flagship exemption and the subcell collision, diagnosed to the line.** Ruled a defect, chartered as CG-2, with the cure that reuses the sibling walk already at `:309-314`. | MF-1 |
| **A-3** | arch-0 §0.12 | The change-path scan now includes the CG paths, which reserve `cartographyTuning.js` and `cartographyBuildings.js` before EST-3 touches the latter. | AR-5 |
| **A-4** | arch-0 §0.13 *(new)* | **`PLAN_UNIT_CM_BY_TIER` exists at `compileTownSceneManifest.js:99-108`** and DW must not mint a scale. ⛔ **This refutes MF-4's central claim** — both the compile lane and the panel greped the word *scale*, and the engine's spelling is `planUnitCm`. Also: **the plan frame is tier-invariant**, so a hard-coded foot value is wrong at five tiers of six. | MF-4, refuted |
| **A-5** | arch-1.2, 1.5 | `frontageReader.js` re-specified (subcell face, manifest scale, explicit street derivation); cell/fixture counts corrected; ⛔ **"33 new files" → 41** — the compile said 33, the panel said 40, and 40 missed `programMinimumTable/index.js`, which arch-1.2 itself names as a CREATE row. | MF-6, MF-9, and a correction to the panel |
| **A-6** | arch-2 §2.1, §2.3 | `Parcel` gains `slotFaceQ`; `Frontage` gains `slotFaceQ`, `lengthFt` and `streetBacked`, with the bucket's sourced/interpolated provenance in the typedef. The `INTRA_EDGE` tolerance refusal added. The **merge-halves-the-slots** warning added. | MF-2, MF-4, MF-9 |
| **A-7** | arch-3 | Pass B's stage labels `[B1]..[B6]` → **`[T1]..[T6]`**, matching the charter's own §4.5 names and ending the collision with the band ids `B1..B18`. A3's capacity box and A4's frontage box rewritten. | new, found in the cross-reference sweep |
| **A-8** | arch-4 | **CG-1 and CG-2 chartered as full packet stubs** (family `cartography`, before everything). **EST-2's arm 1 replaced by arms 1, 1b and 2b — which takes it to ten arms against a cap of eight, so EST-2 SPLITS into EST-2a and EST-2b** rather than the cap being widened. DW-1a's acceptance widened to two retirements, with the warning that a bare `grep "'dais'"` arm would be red forever. Totals: **41 cars / 45 DW commits / 47 dispatched.** | MF-1, MF-2, MF-7, MF-10 |
| **A-9** | arch-5 | **A THIRD standing arm on every car: the failing control** (ODQ §503's law), with three worked instances. **The real-pipeline corpus rule** — every cartography corpus pin runs against both corpora — which is the structural cure, not CG-1's six numbers. W0 and W0b added. The dormancy golden named as a surface that must NOT be re-recorded. | MF-10, and the §503 measurement laws |
| **A-10** | arch-6 | R-2's control replaced with one that can pass and one that can fail; **R-2b (the capacity), R-0 (the ground) and R-11 (the frontage measurable) added**; **R-5 discharged by measurement** and the ordered lane struck. | MF-1, MF-2, MF-4, MF-10, C5 |

**What this amendment did NOT change in the architecture, affirmatively.** The
module tree's shape, the single-writer assignments, the purity rules, the layer
inclusion baselines, the DW-3/4/5/6/7 car definitions, the soak-leg arms, and the
whole of arch-2's contract set apart from the three fields named above. **And no
test was run against CG-1, CG-2, EST-2a or EST-2b, because none exists** — every
claim in this document about which surfaces those cars move is a reading of the
code, and arch-5 §5.3 labels it as such.
