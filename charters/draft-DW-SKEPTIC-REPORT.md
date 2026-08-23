# DW-SKEPTIC — THE ADVERSARIAL REPORT ON THE DWELLINGS CHARTER

**Lane TC-DW-SKEPTIC (ODQ §484), `[OPUS-RUN · FABLE-VALIDATION OWED]`.** The panel
that runs before the chair ratifies DW-0 and before the owner sits the bands
(§441 J7). Targets: `draft-DWELLINGS-CHARTER.md` (164,539 B) and
`draft-DWELLINGS-ARCHITECTURE.md` (103,566 B), with the compile lane's receipt.

**How this lane differs from the compile lane.** The compile lane declared, and
it was honest about it: no worktree, no `npm ci`, no vitest, no wall clock —
every engine claim a READ at file:line. This lane created the worktree and
**executed**.

| Fact | Value |
|---|---|
| Worktree | `$SP/laneTCDWSKEP-tree`, detached at `00e7af612d428078634d52ea37054bd00b773ca6` |
| Tip re-derived | `claude/composite-r4` = `00e7af612` — **UNCHANGED** since the compile. No advance to re-check. |
| `npm ci` | exit **0**; `node_modules` = **468** entries; `df -k /` = 18,446,928 KB free |
| Base green proved | `gate-mutex --run -- npx vitest run` over `townCartographyParcels` + `townCartographyBuildings` + `townCartographyPaint` + `interiorModel` + `testRatchet`: **5 files / 180 tests PASSED, TRUE_EXIT=0** |
| Research corpus | `refs/preserve/research-dossiers-2026-08-23` advanced `07fbed7b` to `3449e748`; the diff adds **only** the five `charters/` files. **No research file changed.** 19 files at `07fbed7b`, as the charter states. |
| Executed probes | **25** — 10 node probes over real generated corpora (`DWSKEP-geom`, `-geom2`, `-refute`, `-eff`, `-perf`, `-cover`, `-occ`, `-dup`, `-front`, `-quad`), 1 mutexed vitest battery, 2 python recounts of the charter's own tables, 12 targeted source/grep probes. Every absence claim carries a positive control. |
| Repo bytes written | **zero** under `src/`, `docs/`, `tests/`. Worktree left `git status --porcelain` EMPTY (proof at the end). |

**Headline.** The charter's *measurement discipline* is excellent — every one of
the 24 effective/raw line counts in §0.4 reproduced EXACTLY under eslint's own
Linter, and every file:line citation I re-opened was right. Its *reasoning from
those measurements* is where it fails. **Three claims the program is built on
are refuted by execution, and two of them are load-bearing for the wave that
moves the map.** The bands are largely sourced, but one cannot be implemented as
written and two send the owner to the wrong band.

---

## 1 · THE VERDICT TABLE

Legend: **CONFIRMED** · **REFUTED** · **OVERSTATED** (true but weaker than
stated) · **UNDERSTATED** (true and stronger than stated) · **UNTESTABLE**.

### 1.1 · The six refutations — the program's justification

Each probed by a run that would have failed if the refutation were false, and
every absence claim carries a positive control.

| # | Claim | Probe (executed) | Output | Verdict |
|---|---|---|---|---|
| a | The interior reads a POINT, not a polygon | `deriveBuildingFootprint` called on a real settlement, absent and present anchors | keys are `institutionId, widthCells, depthCells, entranceSide, source, mapPosition`; **no `polygon` key**; `mapPosition = {x:457,y:371}` for the real anchor (positive control: the anchor resolved, so the probe can see a building) | **CONFIRMED** |
| b | The entrance is guessed from a district centroid | `interiorFootprint.js:122` re-read; `cardinalSide` at L56-59; `SIDE_SOUTH` fallback at L116 | verbatim as cited | **CONFIRMED** |
| c | No exterior to clamp against | `footprintSizeFor` arity = **3** (`kind, tierIndex, prosperity01`); identical output for two different settlements at identical scalars | geometry is not an input and cannot be | **CONFIRMED** |
| d | **There are no storeys at all** | `buildInteriorModel` executed; model keys enumerated; whole model serialized and substring-scanned | keys = `interiorVersion, seedFork, meta, bounds, rooms, walls, doors, furnishings`; no key matching `/stor\|floor\|level\|height\|elev/i` at model OR room level; the strings "storey" and "floor" appear **nowhere** in the serialized model. Positive control: `walls`, `doors`, `bounds` all present | **CONFIRMED** |
| e | Prosperity arrives as three buckets against the map's seven | 14 prosperity labels through `buildInteriorModel`; distinct (footprint, furnishing-count) signatures counted | **exactly 3** signatures: `{destitute, poor, struggling}`; `{modest, middling, comfortable, thriving, booming, empty, unknown}`; `{prosperous, wealthy, rich, opulent}`. Map ladder `PROSPERITY_RANK` at `cartographyTuning.js:258-262` has ranks 0..6 (**seven**) | **CONFIRMED** |
| f | `ROOM_KINDS.stall` has zero producers | (i) `grep -rn "'stall'" src/` = **1** hit (the definition), positive control `'workfloor'` = **2** (definition plus producer); (ii) `grep "room('stall'"` = **0**, positive control `room('hall'` = **2**; (iii) 288 generated interiors across 6 tiers x 8 kinds x 3 prosperities x 2 publicSafe: 24 of 28 room kinds emitted, `stall` never | **CONFIRMED — and UNDERSTATED, see below** |

**The one thing the six-refutation survey missed.** The same 288-interior sweep
shows the never-emitted set is `{concealed, dais, evidence, stall}` — four, not
one. `evidence` and `concealed` are model-level (the charter's own H8/H9 say so)
and my sweep never lit corruption. **`dais` is not.** `grep "room('dais'"`
returns **0** producers (control: `room('hall'` returns 2). It survives a naive
grep because `dais` is **also a `FURNISHING_KINDS` member** at
`interiorTemplates.js:53`, so all four of its source hits are the furnishing
spelling: `room('hall', 6, 'front', 0, ['bench','dais','table'])` at L140 and
`judges: room('chamber', 3, 'back', 0, ['dais','bench'])` at L166.
**`ROOM_KINDS.dais` is a second member with no room-producer, hidden by a
cross-vocabulary name collision.** J10 and DW-1a retire one member; they should
retire two, or state why not.

### 1.2 · The two geometry theorems — the ESTATE wave rests on these

Probed by construction over the real 20-row map corpus compiled through the
ordinary domain entry point: **132 wards, 528 ward edges, 1,056 adjacent
same-edge candidate pairs, 1,098 retained parcel rows.**

| Claim | Probe | Output | Verdict |
|---|---|---|---|
| **(a)** "the intra-edge merge of two same-fan wedges is exactly a triangle of the same family (their outer cuts are collinear), so the packing theorem survives untouched" (§3.4, §4.2, §Σ finding 2, **J5**) | For every adjacent same-edge pair, exact integer `cross(cuts[s], cuts[s+1], cuts[s+2])` | **410 collinear, 646 NOT collinear (61.2%)**. Of the 646, the middle cut falls INSIDE the claimed triangle 323 times and OUTSIDE it 323 times. Max abs(area(chord triangle) minus area(union)) = **44.5** plan units. Worked example, real ward `ward:district.market_row` e2 s0: cuts `[646,283] [621,219] [597,154]`, cross = **+89** | **REFUTED** |
| **(b)** "the vertex-crossing merge is a quad and does not [inherit the theorem]" | Union of wedge `(e, div-1)` with `(e+1, 0)` constructed for all 528 ward edges; corner collinearity and convexity tested exactly | **528 of 528 are genuine convex quadrilaterals**, zero degenerate to a triangle. `packFootprint` destructures `const [v0, v1, v2] = parcel` (`cartographyBuildings.js:119`) — a fourth vertex is silently dropped | **CONFIRMED** |

**Why (a) fails, precisely.** The charter read `cartographyParcels.js:108` (the
polygon literal) but not `:100-104` immediately above it:

```js
cuts.push([
  Math.round((a[0] * (divisions - k) + b[0] * k) / divisions),
  Math.round((a[1] * (divisions - k) + b[1] * k) / divisions),
]);
```

Only `cuts[0]` and `cuts[3]` are exact ward vertices. The two interior cuts are
**rounded onto the integer lattice**, so three consecutive cuts are collinear
only by accident. The suite already knows this: `withinWard` at
`tests/domain/townCartographyParcels.test.js:155-172` allows a one-squared-unit
boundary tolerance and its comment says "an on-edge point sits at most
sqrt(0.5) from the exact edge". My independent measurement agrees — **323 of
2,112 cut points (15.3%) lie strictly outside their own ward polygon**, by
sub-unit amounts, at base, today.

**What this costs.**

1. **arch-6 R-2's EST-2 acceptance arm 1 is unpassable as written.** It says
   "the union of two adjacent same-edge wedges is EXACTLY `[C, cuts[s],
   cuts[s+2]]` — the mutant is a convex-hull union". On real geometry the honest
   union IS a four-vertex polygon 61% of the time; the "mutant" is the correct
   answer and the arm's subject is the wrong one.
2. **J5's stated reason is false.** The intra-edge merge is still the right first
   landing, but for a different reason than the one recorded, and a judgment
   recorded with a false rationale cannot be vetoed intelligently.
3. **The merged shape must now be chosen deliberately, and both options cost
   something.** The four-vertex union is a quad — exactly the objection the
   charter raises against the vertex-crossing merge — and it also reds the
   existing `parcel.polygon.length !== 3` pin at
   `townCartographyParcels.test.js:267`. The chord triangle `[C, cuts[s],
   cuts[s+2]]` is not the union: it gains up to 44.5 plan units of ground in half
   the cases and loses up to 44.5 in the other half.
4. My own competing hypothesis was **REFUTED** and I record it: I expected
   `dispersed_orderly`'s segment-first sort plus `slice(0, perWard)` to make
   intra-edge adjacency rare among retained parcels. Measured: **577 adjacent
   same-edge pairs across 1,098 retained parcels; 113 of 132 wards have at least
   one.** The merge can fire, and often.

### 1.3 · THE CAPACITY MODEL THE ALLOCATION PASS IS BUILT ON — REFUTED

Not on the attack list, and the most expensive finding in the report.

| Claim | Probe | Output | Verdict |
|---|---|---|---|
| **H21** "At most four buildings fit a parcel — CONFIRMED, and it is a theorem", consumed by **§4.2 step 4** ("capacity is the medial-subdivision bound, 4 buildings, §0 H21") | 24 real settlements generated through `generateSettlementPipeline`, compiled with cartography lit; buildings grouped by `parcelId` and compared against `cartographyBand(BUILDINGS_PER_PARCEL, tier)` | **156 of 426 parcel-occupancy checks VIOLATE the band.** Max **16** buildings on one metropolis parcel (cap 4); **11** at city (cap 4); **9** at thorp (cap **1**) | **REFUTED** |
| Corollary: the buildings are non-overlapping | 1,497 building rows; footprints hashed and grouped | **218 rows (14.6%) share an IDENTICAL footprint with another building.** Real sample: `cat-access-to-parish-church:i01` and `cat-subsistence-farming:i01` stand on the same triangle `[[569,486],[573,466],[545,460]]` | **REFUTED** |
| Containment itself | 5,961 footprint vertices tested with `scenePointInPolygon` against their own parcel | **0 uncontained** | **CONFIRMED** |

**The cause is 20 lines from the code the charter quoted.**
`cartographyBuildings.js:216` declares the exemption in its own words —
"Non-flagship occupancy per parcel; **flagships are exempt** (§6.3a3)" — and
`:299-301` implements it: the canonical institution's first instance takes its
bound parcel unconditionally with `subcell = arrived % 4`, so the fifth flagship
on a parcel reuses subcell 0. The `<= 4 ALWAYS` comment at
`cartographyTuning.js:273-274` describes the *subdivision*, not the emitted rows,
and the suite's own cap check at
`tests/domain/townCartographyBuildings.test.js:455-457` is scoped to
`row.role === 'dwelling'`, matching the code exactly.

**What this costs.** EST-2's allocation walks candidates asking "does this
envelope satisfy the program?" with capacity = 4. The engine's real answer is "as
many flagships as bind here, stacked". An allocator built on the stated bound
triggers its bounded UNION on the wrong condition, and its `programSatisfied`
receipt is a claim about a capacity nothing enforces.

### 1.4 · Frontage — the claim that makes frontage-gated eligibility possible

| Claim | Probe | Output | Verdict |
|---|---|---|---|
| A frontage EDGE is computable from the parcel row that ships today (**H19**, §Σ finding 1) | 1,098 shipped parcel rows; outer edge = `polygon[1]` to `polygon[2]` | **Every parcel yields exactly ONE unambiguous outer edge.** Zero yield none; zero yield two; zero are zero-length. Distribution in plan units: min 25.1, p10 33.9, **median 44.0**, p90 56.0, max 74.0 | **CONFIRMED** |
| and it is "**the side the street runs along**" (H19's second clause, and law 6's whole premise) | Distance from each outer-edge midpoint to the nearest street polyline segment (1,764 streets across the corpus; the `polyline` key confirmed against the contract) | **only 163 of 1,098 (14.8%) lie within 8 plan units of any street.** Median distance to the nearest street = **41.1** plan units, about one whole frontage length. p75 = 94.7, max = 566.0 | **REFUTED** |

A ward boundary is a ward boundary. The eligibility rule needs no tie-break —
there is exactly one edge, so the brief's worry is answered — but the edge it
would gate on is not a street frontage for 85% of parcels. B3's caveat tells the
owner "our plots are fan wedges, not burgage strips". The stronger, unstated half
is that **the measured edge does not face a street.**

### 1.5 · The declared shift, the flag, and the "dark" posture

| Claim | Probe | Output | Verdict |
|---|---|---|---|
| The flag-mint bill is **SIX** test-visible surfaces, not five | All six paths opened at base | All six PRESENT and live. `contributionLedgerShape.test.js:65-66` carries **two** `toHaveLength(25)` literals and its `it` title reads "at 25" — exactly the rename-not-add shape §0.5 describes. `simulationRules.js` IS an input of `aiCharterBundle.meta.json` and `aiOutputSchemaBundle.meta.json`, so `build:edge-shared` in the same commit is real | **CONFIRMED** |
| Exactly ONE flag, minted at DW-7a, no other wave mints a gate | Wave table and §0.5's justification read against each other | No second flag is proposed. But the justification is broken, below | **CONFIRMED (claim), REFUTED (its stated reason)** |
| "DW-1..DW-6 and the ESTATE wave land DARK ... because nothing they emit is read on the generation path (**§6's purity argument**)" (§0.5) | `grep -n "purity" charter` | The word purity appears **exactly ONCE in the whole charter — inside the citation to it** (line 233). §6 is the soak leg and contains no purity argument | **REFUTED — dangling citation** |
| The ESTATE wave is "dark" | §5.0 table row read against its own adjacent cell | The same row says **dark** and **"Declared same-seed shift: YES — the drawn map of every settlement"**, and §5.4's heading is "it is the one that moves the map" | **REFUTED — internally contradictory** |
| Only ONE same-seed shift in the program | Hunted for a second across every wave | No second shift found in the waves as scoped. But the ESTATE shift's own reachability is in question — MUST-FIX 10 | **CONFIRMED, with a caveat** |

### 1.6 · The car arithmetic and the packet law

| Claim | Probe | Output | Verdict |
|---|---|---|---|
| `scripts/.size-baseline.json` holds 10 non-comment entries, none a DW file | File read, keys counted | 10 exactly: `App.jsx` 650, `explanation.js` 827, `applyWorldPulse.js` 941, `npcAgency.js` 830, `pulseKernel.js` 1581, `roadsKernel.js` 838, `settlementStrategy.js` 812, `warTermination.js` 818, `npcGenerator.js` 1350, `settlementSlice.js` 994. **No DW file at an exact ceiling** | **CONFIRMED** |
| §0.4's 24 effective/raw line counts | Independently measured with eslint's own `Linter` under `max-lines {skipBlankLines, skipComments}` | **24 of 24 EXACT**, eff and raw. `interiorModel.js` 249/438, `cartographySynthesis.js` 242/421, `monotoneComponents.js` 247/636, all of them | **CONFIRMED** |
| Every car's change paths are disjoint from every non-terminal packet's | `docs/implementation/PACKET_MANIFEST.json` parsed | **168 packets: 167 LANDED, 1 SUPERSEDED, ZERO non-terminal.** No path is reserved at base | **CONFIRMED** |
| `.test-ratchet-baseline.json` holds 11 entries against `CEILING = 17` | JSON parsed; `tests/lint/testRatchet.test.js:181` read | `entries` = **11**; `CEILING = 17` at :181; the assertion at :267 | **CONFIRMED** |
| 41 cars / 44 commits, EST-1 split four ways because 11 shelf files exceed the 3-file law | Both documents read | 3+6+5+6+3+2+4+5+4+3 = **41**; 41 minus 1 plus 4 = **44**. But the **CHARTER never mentions the split**: §5.0 says 41 and §5.4 shows EST-1 as one car creating an 11-file table. Only the architecture (line 1191) catches it | **CONFIRMED (arithmetic) / OVERSTATED (the charter alone is unbuildable at EST-1)** |
| Every new leaf under 250 effective | arch-1.2 table scanned | Every CREATE row is 210 or less **except** `program/programMinimumTable.js` at **~700**, which is why EST-1 splits. arch-1.1's layout tree still shows it as ONE file | **CONFIRMED, with a doc inconsistency** |
| arch-1.5's "33 new files" | arch-1.1 tree counted | **30** `.js` files in the layout tree; with the 11-shelf split it is **40**. 33 matches neither | **REFUTED (minor)** |

### 1.7 · The five corrections the lane made to the research

| # | Correction | Probe | Verdict |
|---|---|---|---|
| 1 | UC-2 `monotoneComponents.js` is LANDED, not holding | file present, 38,742 B, added by `42d3e4b1` — the sha the charter names | **CONFIRMED** |
| 2 | `institutionSubstructure` is LANDED at base | `cohesionWeave.js:285-291`, five rows `none/sewer/mine/crypt/cellar` | **CONFIRMED** |
| 3 | The concealed cell is NESTED, not subtracted | `interiorModel.js:333-340`: a new room is pushed overlapping the host; `host.w`/`host.h` untouched | **CONFIRMED** |
| 4 | `evidence`/`concealed` are model-level; `meta.roomCount` excludes covert | `roomCount: outRooms.filter((r) => !r.covert).length` at L402 | **CONFIRMED** |
| 5 | **The painter's op count is an IDENTITY a new op moves** | Source header `cartographyPaint.js:13-21` read; every pinning test enumerated by grep rather than from memory | **CONFIRMED — and the bill is not enumerated anywhere in either document** |

**The painter bill, enumerated.** Three test files, four assertion sites, plus
the source prose:

1. `tests/domain/townCartographyPaint.test.js:72-73` — the `expectedLength`
   helper — and `:202`, the corpus assertion that consumes it.
2. `tests/lib/townCartographyBlock.test.js:165-170` — the identity longhand.
3. `tests/ui/mapCartographySubTab.test.jsx:181-186` — the identity again, plus
   **`:187`, which asserts the rendered SVG child count equals `ops.length`.** A
   parcel op therefore moves a **rendered-surface** count, not only a domain one.
4. `tests/ui/mapCartographySubTab.test.jsx:188` — "wards precede streets precede
   buildings, in the leaf's own emitted order" — a parcel op needs a declared
   position in that order.
5. `src/domain/townCartography/cartographyPaint.js:13-21` — the header states the
   identity in prose and states that `parcels[]` emits no op. A doc-agreement or
   comment pin reading it would also move.

MP-1 and §495's "insertion, not surgery" is correctly re-scoped by the charter.
What is missing is this list: arch-6 R-8 names ONE control (DW-6d acceptance
arm 1); the bill is four sites in three files, one of them a UI render count.

### 1.8 · Vocabulary arithmetic — the counts DW-1's walkers would pin

Counted mechanically from the charter's own tables.

| Charter figure | Counted from the charter's own table | Verdict |
|---|---|---|
| §2.2 "28 minus 1 plus **56** = **83** cell kinds" | The ten group rows hold **57** distinct backticked names (6+5+9+5+8+7+4+4+6+3), zero duplicates, zero collisions with existing `ROOM_KINDS`. **28 minus 1 plus 57 = 84** | **REFUTED (off by one)** |
| §2.3 "22 plus **59** = **81** fixture kinds" | The list holds **60** distinct names, zero duplicates, zero collisions with `FURNISHING_KINDS`. **22 plus 60 = 82** | **REFUTED (off by one)** |
| §2.1 "8 families, 47 named members plus `GATED_COURT_RING` — 48 partis" | 47 distinct uppercase enum tokens in the table, none duplicated across families, plus 1 = **48** | **CONFIRMED** |

`83` and `81` are repeated in §Σ, in §3.1's `Cell` typedef comment, in §5.2, and
in arch-1.2 and arch-6 R-10. DW-1a and DW-1b are specified to land "a membership
walker" — an off-by-one in the count the walker pins is a red at the car's own
acceptance, found late.

### 1.9 · Other claims tested

| Claim | Output | Verdict |
|---|---|---|
| Catalog is 311 rows (`grep -c "desc:"`) | **311** | **CONFIRMED** |
| §9.1's 334 ledger items across 8 dossiers | Each header figure (18, 106, 27, 46, 54, 45, 24, 14) found verbatim in its own dossier at `07fbed7b`; sum = **334** | **CONFIRMED as a row count** |
| "They do not overlap" | Not provable from the headers, and the charter's own §1.2 shows the same capability (`hostedIn`) raised by at least four dossiers independently. 334 is the count of ledger ROWS, not of distinct work items | **OVERSTATED** |
| §4.5's measured lifecycle seam | `institutionLifecycle.js` = **60,069 bytes**; close branch at **L1006-1024** rewriting to `status:'remnant'`; `closureFateForInstitution` at **L651-656** returning `shuttered`/`bankrupt`/`closed_for_want_of_custom`; `closeChance` at **L620**; the fate regexes unanchored (`/yard/`, `/works/`). Every one as cited | **CONFIRMED** (one omission: the `shuttered` regex also carries `festival`, which the charter's parenthetical drops) |
| H24's wear ladder: ruined, burned, damaged, worn, pristine, sound | `conditionOf` at `cartographyBuildings.js:151-162` — exactly that first-match chain, **six** rungs | **CONFIRMED** |
| H10/H11 facet inference | `institutionNature` at **L260-268**; `security` L262 carries bare `fort`; `vice` L266 carries bare `den`; `civic` L267 is the only anchored one (`/\bhall\b/`); `trade` L263 precedes `vice` L266 | **CONFIRMED** |
| H14 `connectivity.js` at no ref | `git log --all --diff-filter=A` = **0 rows** | **CONFIRMED** |
| H15 five joints, four temperaments | `jointVocabulary.js:27` and `:30` | **CONFIRMED** |
| **C4** `householdId` returns zero rows | `grep -rniE "householdId\|household_id" src/` = **0**. Positive controls with the same grep shape: `parcelId\|parcel_id` = **27**, `anchorKey` = **153**. "household" as a word appears 205 times, all narrative prose | **CONFIRMED** |
| **C4** `cartographyBuildings.js:9-10` says what the charter says | Verbatim: "Dwellings are population-derived filler with NO parallel identity: their ids resolve to nothing outside this block, by design (design §3)." The id at L363 is `carto:dwelling:${ward.id}:${String(ordinal).padStart(3, '0')}` — **zero-padded to 3**, which the charter's shorthand drops | **CONFIRMED** |
| `demographicsKernel.js` exports one function | `advanceDemographics` at L233, sole export | **CONFIRMED** |
| arch-6 R-5's performance bound | See §4 | **UNDERSTATED — the real numbers are far better than the charter feared** |

---

## 2 · MUST-FIX — before a DW car lands wrong or an owner band is signed on air

Ordered by cost-if-wrong.

### MF-1 · The capacity model EST-2 allocates against does not exist. *(new; not on the attack list)*

H21 states 4-buildings-per-parcel as a CONFIRMED theorem and §4.2 step 4 consumes
it as the allocation capacity test. Measured: **156 of 426 parcels exceed the
band, up to 16 on one, and 14.6% of building rows sit on a footprint identical to
another's** — because `cartographyBuildings.js:216` exempts flagships from the
occupancy cap by design. **Re-state H21 as "the medial subdivision yields four
subcells; the engine caps DWELLINGS at `BUILDINGS_PER_PARCEL` and exempts
flagship institutions entirely", and re-derive §4.2 step 4's capacity predicate
from the exemption rather than from the subdivision.** Until that is done,
EST-2's union trigger and its `programSatisfied` receipt are both computed from a
false bound.

### MF-2 · Theorem (a) is false; EST-2's acceptance arm 1 cannot pass.

646 of 1,056 adjacent same-edge cut triples are non-collinear because
`cartographyParcels.js:100-104` rounds them. **Rewrite arch-6 R-2's arm 1**: the
merged parcel is `[C, cuts[s], cuts[s+2]]` **by construction**, not "equal to the
union"; add a bounded-symmetric-difference arm proving the discrepancy stays
inside the suite's existing `withinWard` rounding tolerance; add a
`polygon.length === 3` arm so the merge cannot silently emit a quad and red
`townCartographyParcels.test.js:267`. **Re-write J5's rationale** — the merge is
still the right first landing, but not for the reason recorded.

### MF-3 · The ESTATE wave cannot be both DARK and a shift on every settlement's drawn map, and the argument that makes the flag bill ONE cites a section that does not exist.

§5.0 marks the wave "dark" while its own adjacent cell declares the shift. §0.5's
justification points at "§6's purity argument"; the word purity appears **exactly
once in the charter, in that citation**. Either the wave is on-path — and §0.5's
one-flag argument needs a real justification, and the ratchets and goldens it
trips are a light wave's — or it is dark, and the declared same-seed shift is a
shift in a surface nothing lit reads. **Pick one and write the argument out.**
This premise carries J3 and the program's entire landing posture.

### MF-4 · B3's buckets are in feet; the engine has no foot.

A grep for any plan-unit-to-physical scale across `src/` returns **two** hits,
both `worldUnitsPerMapUnit: 1` in the fabric's coordinate ABI — a map/world
identity, not a physical scale. arch-2 declares `frontageQ` as "plan units".
**The owner would be signing five boundaries in a unit the engine cannot
express.** The consequence is not academic: under the natural 1:1 reading, of
1,098 real parcels **SHOP (6-10 ft) gets 0, NARROW (10-20) gets 0, STANDARD 22,
WIDE 758, GRAND 318** — two of the five buckets can never fire, and Pantin's
30-50 ft "needs a fairly large frontage" gate, which chair ruling **R1** makes
the hard filter on parti eligibility, would admit **98%** of all parcels. **R1 is
vacuous until a scale is declared and signed.** Add the scale to B3 as an
explicit owner-signed row, or re-express B3 as fractions of the ward edge.

### MF-5 · Two cross-references send the owner to the wrong band.

Charter line **1403** (§4.6's counter-force table) and line **1682** (§6.2, "The
owner sits the band that governs them at §7 B12") both cite **B12** for the
per-culture acquisition/partition balance. That is **B9**; B12 is party walls.
Line 2066 gets it right, so the charter contradicts itself. The owner reading the
consolidation-runaway section — the highest-stakes soak arm in the program — is
pointed at the wrong signature line.

### MF-6 · The vocabulary counts DW-1's walkers will pin are off by one, twice.

§2.2's own table holds **57** new cell kinds (so **84**, not 83); §2.3's own list
holds **60** new fixtures (so **82**, not 81). Both wrong figures are repeated in
§Σ, §3.1, §5.2, arch-1.2 and arch-6 R-10. Fix the five sites or re-cut the
tables.

### MF-7 · `ROOM_KINDS.dais` has no room-producer either.

Zero `room('dais'` producers (control: `room('hall'` = 2), never emitted across
288 generated interiors, hidden by the collision with `FURNISHING_KINDS.dais`.
J10 and DW-1a retire one dead member; make it two, or record why `dais` stays.

### MF-8 · The charter alone specifies an unbuildable EST-1.

§5.4 lists EST-1 as one car whose content is an 11-shelf frozen module; the
3-file packet law forbids it. Only arch-4 (line 1191) catches this and splits it
into EST-1a..EST-1d, moving the program from 41 cars to 44. **The charter is the
document the chair ratifies** — carry the split and the 44 into §5.0, §5.4 and
§Σ, or the ratified plan and the buildable plan differ at the wave that lands the
program's data spine.

### MF-9 · The frontage edge is not a street, and law 6 is built on the belief that it is.

Only 14.8% of outer-edge midpoints are within 8 plan units of a street; the median
is 41.1. H19's second clause and B3's caveat both need re-wording, and DW-2a's
frontage reader needs a stated position on what it is measuring.

### MF-10 · The parcel world DW builds on throws for most freshly generated settlements.

Over **48 real `generateSettlementPipeline` settlements** with
`townCartographyEnabled` lit, **27 (56%) threw** a premise error out of
`compileTownSceneManifest`: **all 8 village and all 8 town rows**, 6 of 8 hamlets,
3 of 8 thorps, 2 of 8 cities. 25 are "N institution bindings exceed the tier cap";
2 are the TC-4 byte band. Only metropolis was clean 8 of 8. **The 20-row corpus
the cartography stage is proved against is `makeTownFixture` output, not pipeline
output.** The flag is virtual and default `false` (`simulationRules.js:783`), so
this is latent rather than live — but §0.3 ground 1 says (B) "is the only world
that has a parcel for every building of **every settlement**", and C1 asks the
chair to confirm the choice on that ground. Measured, the ground is false today.
**Confirm C1 on the honest ground — (B) is the only candidate, and its per-tier
binding caps are unfinished work someone owes before EST-2 can claim to move
"every settlement's" map.**

---

## 3 · THE BAND AUDIT

The signing sheet has **19 rows** (Sequencing plus B1..B18). §7 introduces them as
"Sixteen bands and two rulings" (18) and §Σ calls it "Eighteen rows". **Three
counts, none matching the table, and the row the prose drops is the sequencing
decision — the one the charter itself calls the first thing the owner must
read.** Fix the count.

| # | Recommendation | Traceable to an executed measurement or a cited source? | Verdict |
|---|---|---|---|
| **Seq** | ESTATE lands before the ONE REGEN | Traceable to the tail order (ODQ §341/§456), not to a measurement, and correctly framed as a scheduling decision | **SOUND** |
| **B1** | Minimum program = HONEST | The *minimums* are cited row by row in §3.2 (R-INST-4 §3, Willis and Clark, the Fortune contract). The *policy tier* SPARE/HONEST/GENEROUS is a three-way preference with no measured boundary between the tiers | **SOURCED IN SUBSTANCE, PREFERENCE IN FORM** |
| **B2** | Follow the research exactly | Four counts cited (3/28, 11/28, ~30/124, 14/40). I verified the dossiers are unchanged at the preserve ref but did **not** re-count the verdict tables | **CITED; UNTESTED HERE** |
| **B3** | The five measured buckets | **Only two of the five boundaries are sourced** (SHOP 6-10 from Salter via Pantin; WIDE 30-50 from Pantin). NARROW 10-20, STANDARD 20-30 and GRAND 50+ are interpolations between them and rest on nothing. And the whole band is denominated in a unit the engine does not have (MF-4) | **THREE BOUNDARIES ARE PREFERENCES WEARING NUMBERS, AND THE BAND IS UNIMPLEMENTABLE AS WRITTEN** |
| **B4** | Adopt the map's seven rungs | Both ends measured here: interior = 3 buckets (executed), map `PROSPERITY_RANK` = ranks 0..6 over 9 labels at `cartographyTuning.js:258-262`; the canonical emitted vocabulary is the 7 of `src/data/constants.js:51` | **SOURCED, and strengthened**: the interior's regex has no arm for `subsistence` or `moderate`, so both fall to the 0.5 default. `Subsistence` is remapped before emission today, so it is latent, not live — but "coarse" understates it; the mapping is also unaligned |
| **B5** | Walls, then separation, then duplication | Cited to the parent's law 1 plus R-INST-4's dated sequences (King's Head, Chichester) | **SOURCED** |
| **B6** | Perishables, then fixtures, then plant; excavations never | Cited to R-INST-1 and bound to `conditionOf`. **But the parenthetical is wrong**: it gives the ladder as "sound, worn, damaged, burned, ruined" — five rungs, reversed, and **`pristine` is missing**. The engine's chain is "ruined, burned, damaged, worn, pristine, sound", six rungs (verified) | **SOURCED; THE ENGINE FACT IN THE SITTING DOCUMENT IS WRONG** |
| **B7** | Descending by default | The best-measured artefact in the corpus (Fortune contract, 8 Jan 1600, 12/11/9 ft), and §9.2 honestly flags that both pages derive from ONE primary. Feet again, but storey heights are a proportion, so less exposed than B3 | **SOURCED** |
| **B8** | Acquisition from `prosperous` up; "a small minority of main-street plots over 300 years" | `prosperous` **is** a real rung (rank 5, verified). **But "main-street plots" is not a thing the chosen parcel world can identify** — a parcel is a ward-edge wedge and only 14.8% touch a street at all (MF-9). And "a small minority" is not a number: the owner signs a feeling and the soak reports a distribution against it | **HALF-SOURCED, AND THE RECOMMENDATION IS NOT EXPRESSIBLE IN THE CHOSEN PARCEL WORLD** |
| **B9** | Roughly balanced, per culture | No number at any end. The rationale ("the soak will find the answer for you") is honest but it means the owner signs a *policy of deferral*, not a band. **And it is two decisions bundled**: the acquisition/partition balance, and whether culture is the axis that varies it | **PREFERENCE; BUNDLED; AND IT IS THE BAND THE TWO BROKEN CROSS-REFERENCES POINT AWAY FROM (MF-5)** |
| **B10** | Read from the existing closure machinery; add no dial | Fully measured, and I re-verified every line (`institutionLifecycle.js` 60,069 B; close branch L1006-1024; fates L651-656; `closeChance` L620) | **SOURCED — the best-grounded band in the sheet** |
| **B11** | Occasional; ports higher; institutions only | The *limit* is measured cold (householdId = 0 rows, with positive controls). The *rate* — rare, occasional, common — has no source. **Two decisions bundled**: the frequency, and acceptance of the household deferral | **HALF-SOURCED; BUNDLED** |
| **B12** | Common urban, rare rural | Grounded on the 1189 London regime (DWR1A). No number at either end | **SOURCED IN KIND, PREFERENCE IN DEGREE** |
| **B13** | Embellishment density WORKING | A three-way taste choice declared as such, with a non-negotiable determinism rule attached | **PREFERENCE, HONESTLY FRAMED** |
| **B14** | 3 grades by 3 wear states | Rationale is "nine is enough to read at a glance". No source, and the nine do not correspond to the engine's six-rung `conditionOf` ladder — nothing says how six condition rungs map onto three wear states | **PREFERENCE, PLUS AN UNSTATED MAPPING THE OWNER IS IMPLICITLY SIGNING** |
| **B15** | Abstract now, illustrated later | Declared pure taste | **PREFERENCE, HONESTLY FRAMED** |
| **B16** | Full plan free, secrets premium | Declared paid-surface, owner-only | **CORRECTLY GATED** |
| **B17** | Ownership events are news, renovations are not | Reasoned from the NEWS ADDRESS LAW | **REASONED** |
| **B18** | Emit the claim; the massing wave consumes it | Reasoned; defers correctly | **REASONED** |

**Bands whose recommendation rests on nothing measurable:** B9 wholly, plus the
three interpolated boundaries of B3. **Bands that are two decisions in one:** B9,
B11, and B1 weakly (policy tier versus per-tier minimum). **Bands with a wrong
engine fact in the sitting text:** B6 (the wear ladder), B8 ("main-street
plots"). **Bands that cannot be implemented as written:** B3 (no unit), B8 (no
main street).

**The sequencing decision the charter states first** is sound and correctly framed
as the owner's. My only objection is MF-10: the "drawn map of every settlement"
it promises to move is, today, a map that fails to compile for 56% of freshly
generated settlements. The owner should be told that before agreeing this wave
must ride the one regen.

---

## 4 · THE MEASURED PERFORMANCE NUMBER

The charter could not produce this (Q-D, C5, arch-6 R-5). Here it is.

**Method.** `laneTCDWSKEP-tree` at base, `npm ci` exit 0, node v24.12.0,
`process.hrtime.bigint()`, 7 reps per cell after a warm-up, real
`generateSettlementPipeline` settlements.

| Stage | thorp | village | town | city | metropolis |
|---|---|---|---|---|---|
| **A. Full settlement generation** (median ms) | 7.1 | 16.9 | 24.6 | 23.4 | **29.9** (min 25.1, max 33.0) |
| **B. Map/cartography manifest compile** (median ms, cartography LIT) | 11.5 | threw | threw | threw | **139.7** (min 136.9, max 145.1) |
| **C. ONE interior plan derivation** (ms per building) | 0.2 | 0.4 | 0.7 | 0.9 | **1.3** |
| **D. Eager derivation of every drawn building** | 1.0 ms | — | — | — | **about 309 ms** (240 buildings at 1.3 ms) |

**The answer to the owner's question.** A metropolis today costs **about 30 ms to
generate and about 140 ms to compile its map — roughly 170 ms against a 2,000 ms
budget.** The architecture's lazy, per-building plan derivation adds **1.3 ms on
click**, which is invisible. Even the worst case the architecture explicitly
excludes from the build path — deriving all 240 drawn buildings eagerly — costs
**about 309 ms**, which still fits inside two seconds alongside everything else.

**Verdict: arch-6 R-5 is UNDERSTATED. Two seconds survives with roughly an order
of magnitude of headroom, and it survives even if the laziness contract is
broken.** The dominant cost is the existing cartography compile at 140 ms, not
anything DW adds.

**Two honest caveats.** (i) These are node-side numbers on this machine with a
warm module graph; browser numbers will differ, though the ratio to budget is
what matters and it is about 12 to 1. (ii) EST-2's allocation is not measured
because it does not exist — but its own bound (at most 96 institutions times 24
candidates, so at most 2,304 integer comparisons) is negligible beside a 140 ms
compile that already runs point-in-polygon over 5,961 vertices.

**Recommendation on C5: DOWNGRADE IT.** The measurement lane the charter asks for
has now been run and it is not close. Keep a timing series in DW-S for drift and
delete the pre-DW-2 gate.

---

## 5 · THE FIVE CHAIR DECISIONS

| # | Decision | Does the evidence support the recommendation? |
|---|---|---|
| **C1** | Build on the cartography synthesis parcel world | **CONFIRM, but not on the stated ground.** Grounds 2 (polygon, parcel key) and 3 (containment) hold — I verified containment directly, 5,961 of 5,961 footprint vertices inside their parcel. Ground 1 ("a parcel for every building of every settlement") is **measurably false today** (MF-10: 56% of fresh settlements throw). Ground 2's frontage half is half-true: the edge exists, it is not a street (MF-9). The alternative is still worse, so the decision stands — but rule it on the honest grounds, with the per-tier binding caps named as owed work. |
| **C2** | The ESTATE wave lands before the ONE REGEN | **CONFIRM.** Sound as a scheduling judgment. But MF-3 means the charter has not settled whether this wave is dark or on-path, and MF-10 means the map it promises to move does not compile for most settlements today. Both belong in front of the owner with the decision. |
| **C3** | The merge lives in a new leaf, not in `cartographyParcels.js` | **CONFIRM, and the evidence is stronger than the charter's.** The charter argues single-writer and file hygiene. My measurement adds the real reason: the merge is **not** the closed-under-the-theorem operation §3.4 claims (MF-2), so it needs its own proof surface and must not be smuggled into the file whose header claims the theorem. |
| **C4** | `ownerRef` is an institution anchor or `ANONYMOUS_FABRIC` | **RATIFY.** The best-evidenced decision in the set. `householdId\|household_id` = 0 rows with two positive controls at 27 and 153; `cartographyBuildings.js:9-10` says verbatim what the charter says it says; `demographicsKernel.js` exports one aggregate function; `ANONYMOUS_FABRIC` is genuinely `colonization.js`'s existing word. Nothing to attack. |
| **C5** | Order a measurement lane for Q-D before DW-2 | **RULE IT DISCHARGED.** §4 above is that lane. About 170 ms of a 2,000 ms budget at metropolis, plus 1.3 ms per building on click. Do not spend a lane on it. |

---

## 6 · WHAT I COULD NOT TEST

Recorded so nobody reads silence as a pass.

- **The research verdict counts** (3/28, 11/28, ~30/124, 14/40 — B2's whole
  substance). I verified the dossiers are byte-unchanged at the preserve ref and
  that each ledger header says what §9.1 quotes; I did not re-derive the verdict
  tables. **That is the largest untested body of evidence under the band sheet.**
- **Every §2 vocabulary member's licence and source attribution.** I checked the
  arithmetic, not the provenance of 57 cell kinds and 60 fixtures.
- **The `ProgramMinimum` rows of §3.2** — 16 exemplars, each with a citation I did
  not open.
- **CH-1/2/3's landing shape.** The DW-1 gate depends on it and it is being
  chartered in the other seat now. arch-6 R-7's instruction to re-run the
  packet-manifest scan at the DW-1 base is correct and must actually happen: at
  base the manifest reserves nothing, but that is a fact with a short shelf life.
- **Anything about DW-S's arms**, which cannot be tested before they exist.
- **Browser-side performance.** Node only.

---

## 7 · THE VERDICT

**Is the charter safe to ratify? NOT AS IT STANDS — but it is close, and the
defects are fixable in the document rather than in the design.**

The architecture is right. Building on the cartography world is the right call,
the three relations are the right answer to the first line, one flag at DW-7a is
the right posture, the estate and parcel split is right, and the deferrals are
honestly recorded. Nothing in this report argues for a different program.

What is not safe is **ratifying §Σ and §5 as measured fact**. Three claims the
chair would be ratifying are refuted by execution — the intra-edge merge theorem
(MF-2), the four-per-parcel capacity model the allocator is built on (MF-1), and
the "the side the street runs along" clause under law 6 (MF-9) — and a fourth,
the flag-bill argument, cites a section that does not exist (MF-3). Two of those
four sit directly under the ESTATE wave, which is the wave that moves the map and
the one the owner is being asked to schedule around.

**Are the bands safe to sit? SIXTEEN OF NINETEEN ROWS, YES. THREE, NO.**

- **B3 must not be signed as written.** Three of its five boundaries are
  interpolations, and all five are in a unit the engine does not possess. Signed
  today it makes chair ruling R1 — the frontage gate on parti eligibility —
  vacuous over 98% of parcels.
- **B8 must not be signed as written.** Its threshold is real; its rate is a
  feeling; and "main-street plots" names something the chosen parcel world cannot
  identify.
- **B9 is not a band.** It is a decision to let the soak decide, which may be the
  right decision — but present it as that, not as a range with a recommendation,
  and fix the two cross-references that send the owner to B12 instead (MF-5)
  first.

Everything else in §7 is measured, cited, or honestly declared as taste. B10 and
B4 in particular are exemplary: measured at both ends, with the engine fact
quoted.

**One thing this lane wants on the record in the charter's favour.** I set out to
attack the measurements and could not. Every file:line I re-opened was right. All
24 effective-line counts reproduced exactly. The size baseline, the packet
manifest, the ratchet, the catalog count, the lifecycle seam, the flag bill, the
five corrections, the parti arithmetic and geometry theorem (b) all held under
execution. The charter's failures are failures of **inference from correct
readings** — a `Math.round` four lines above the line it quoted, an exemption
twenty lines below it, and a clause about streets it never checked. That is a far
better failure mode than the alternative, and it is why the fixes are cheap.

---

## 8 · CLEANLINESS

Ten probe scripts (`DWSKEP-geom`, `-geom2`, `-refute`, `-eff`, `-perf`, `-cover`,
`-occ`, `-dup`, `-front`, `-quad`) were written into the worktree root — never
under `src/`, `docs/` or `tests/` — executed, and deleted. No repo file was
edited at any point. `git status --porcelain` in `laneTCDWSKEP-tree` is **empty**;
`git diff HEAD` exits 0; non-`node_modules` untracked files number **0**; `git
rev-parse HEAD` is `00e7af612d428078634d52ea37054bd00b773ca6`, unmoved. Nothing
was committed, staged or pushed.
