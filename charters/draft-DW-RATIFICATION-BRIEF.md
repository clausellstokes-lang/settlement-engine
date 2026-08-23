# DW-0 — THE RATIFICATION BRIEF

**Lane TC-DW0-R2 (ODQ §484, dispatched by §504.6), `[OPUS-RUN · FABLE-VALIDATION
OWED]`.** For the chair, who ratifies, and for the owner, who sits the bands
immediately after. Six pages. The two amended documents and their evidence are
`draft-DWELLINGS-CHARTER.md` (§Σ AMENDMENT RECORD, 13 rows) and
`draft-DWELLINGS-ARCHITECTURE.md` (arch-6 AMENDMENT RECORD, 10 rows).

**Base unchanged:** `claude/composite-r4` = `00e7af612d428078634d52ea37054bd00b773ca6`,
re-derived at the end of this lane and still unmoved. **Nine node probes over
real generated corpora, executed in a detached worktree. Zero repo bytes
written; the worktree is porcelain-empty.**

---

## THE ONE SENTENCE

**The architecture was never in question and still is not; what was unsafe was
three measured claims and one circular argument holding it up, all four are now
replaced by measurement, and the program is two repair cars longer because the
parcel world it builds on does not compile for two thirds of real settlements.**

---

## 1 · WHAT CHANGED

### The five amendments the chair ruled, each executed

**A1 — the capacity model.** H21's "at most four buildings fit a parcel — a
theorem" is **refuted for the emitted rows** and survives for the subdivision.
The cause is the engine's own declared exemption at `cartographyBuildings.js:215-217`,
implemented at `:298-307`: a flagship takes its bound parcel unconditionally and
**never increments `occupancy`**. Measured occupancy over the tier band is
**123/598 (20.6%) on the fixture corpus, max 7**, and **228/624 (36.5%) on real
pipeline settlements, max 11**. §4.2 step 4's predicate is re-derived: capacity
is **four SLOTS**, `BUILDINGS_PER_PARCEL` is a target on the non-flagship fill,
and what allocation tests is `availableToProgram = 4 − flagshipsBoundHere`.

⛔ **And the identical-footprint finding is ruled a DEFECT, not a design, so it is
chartered as its own car rather than built over.** 183 groups, **369 of 2,839
rows (13.0%)**, attribution **100% single-mechanism**: same parcel, same medial
subcell, same shrink permille — zero duplicate parcel polygons, zero rounding
collapse. The exemption's declared scope is that a canonical institution
*appears*; nothing claims two rows may share ground. The file guards duplicate
IDENTITY (`:382`) and not duplicate GEOMETRY, and no test anywhere asserts
footprint uniqueness. It is `CG-2`.

**A2 — the merge theorem.** Refuted and replaced. **646 of 1,056 adjacent triples
(61.2%) are not collinear** because `cartographyParcels.js:100-104` rounds
interior cuts onto the integer lattice. What replaces it is the tolerance the
suite already uses: the merged parcel is `[C, cuts[s], cuts[s+2]]` **by
construction and equal to the true union within `withinWard`'s one-squared-unit
lattice tolerance** (`tests/domain/townCartographyParcels.test.js:164-172`, whose
own comment names the sqrt(0.5) bound). **Measured: max squared deviation 0.4999
against a constant of 1 — zero exceedances in 1,056; symmetric difference at most
1.403% of the merged parcel; 1,056 of 1,056 merged parcels three-vertex; 0 of
4,224 medial subcells failing the pack predicate.** The arm can now pass, and its
**failing control** is measured too: vertex-crossing pairs deviate by 291.3 to
3,183.6 squared units, **0 of 528 passing**. J5's rationale is rewritten.
Theorem (b)'s refusal is kept and confirmed at **528/528**.

**A3 — dark versus light, and the flag bill.** The contradiction dissolves once
*dark* is split. **INERT** means nothing reads it; **DARK** means a reader exists
but is itself gated; **LIGHT** means an ungated reader reaches a user. The ESTATE
wave is **DARK, not inert**: it lands inside `compileTownCartography`, gated by
`townCartographyEnabled` — a virtual rule declared false at
`simulationRules.js:783` and **set true nowhere in `src/`** — so no user sees a
pixel move, while **eight test files compile the stage lit** and do observe the
change. The circular citation to "§6's purity argument" (the word *purity*
occurred once in the charter, inside its own citation) is **deleted**. The
one-flag posture stands on a testable rule instead: *name the surface, grep its
gate; if a gate exists you inherit it, if none exists you mint one.* The ESTATE
wave inherits; the interior pane — `buildInteriorModel`'s one external consumer,
`InteriorView.jsx:58`, **ungated and live today** — does not.

**A4 — BAND ZERO.** ⛔ **The panel's MF-4 is itself refuted: a scale exists.**
`PLAN_UNIT_CM_BY_TIER` at `compileTownSceneManifest.js:99-108` is
`{thorp 10, hamlet 14, village 20, town 30, city 50, metropolis 80}` centimetres
per plan unit; it ships as `space.planUnitCm`, is validated at
`manifestContract.js:216`, and **is already read inside the cartography stage** at
`cartographyBuildings.js:333`. Both prior lanes missed it by grepping the word
*scale*. What is wrong is the **measurable**, not the unit — see §3 below, which
is the owner's page.

**A5 — CG-1, the cartography ground.** Diagnosed to the mechanism. Over 48 real
pipeline settlements, **32 (66.7%) threw**; 29 of 32 are the binding cap, 3 the
TC-3 byte band. **The stage is TOO STRICT; the pipeline output is not malformed** —
the dark compile succeeds on all 144 settlements probed, `MAXIMUM_WARDS` never
bites, the binder orphans nothing, and the only thing that fails is a number.
Over 24 settlements per tier: canonical scene buildings run
`thorp 7/8/12 · hamlet 13/17/20 · village 30/34/39 · town 48/55/61 ·
city 36/47/51 · metropolis 48/53/59` against caps `{8, 12, 20, 32, 64, 96}` —
**hamlet, village and town fail 24 times out of 24.** The cap ladder rises
monotonically with tier; the real curve peaks at TOWN and falls at city. **The
bands were calibrated against `makeTownFixture` rosters and the stage has never
been run against what the generator produces.**

⛔ **The cure is larger than one car, so it is a train of two** — CG-1 (the bands,
plus the real-pipeline fixture corpus that removes the habitat) and CG-2 (the
subcell collision). Not larger than two: they touch different files, carry
different mutants, and CG-2's first arm is only measurable once CG-1 lets the low
tiers compile.

### What the lane found that nobody had ordered

- **`PLAN_UNIT_CM_BY_TIER` exists** (above), which moves BAND ZERO from *invent a
  number* to *ratify the one the engine already draws from*.
- **The vocabulary arithmetic is wrong twice and cancels.** 57 new cell kinds, not
  56; **two** dead members retire, not one — `ROOM_KINDS.dais` has zero
  `room('dais'` producers against a control of 2, hidden by the
  `FURNISHING_KINDS` collision. `28 − 2 + 57 = 83`: the headline survives, both
  figures under it were wrong. Fixtures are **82**, not 81.
- **B4 is a live defect, not a coarseness.** Over 60 real settlements the emitted
  prosperity labels are Prosperous 22 / **Moderate 15** / Comfortable 11 / Poor 9
  / Struggling 3, and **`Moderate` matches no arm of `interiorModel.js:83-86`** —
  a quarter of settlements reach the interior through the fall-through default,
  landing on the same value as Comfortable.
- **A naming collision:** arch-3's Pass-B labels `[B1]..[B6]` were a second name
  for the charter's own T1..T5 and collided with the band ids. Relabelled T1..T6.
- **A correction to the panel's correction:** arch-1.5's new-file count is **41**
  — the compile said 33, the panel said 40, and 40 missed
  `programMinimumTable/index.js`.
- **EST-2 splits** into **EST-2a THE MERGE** and **EST-2b THE ALLOCATION**: the
  two new arms take it from eight to ten against a cap of eight, and the cap is
  not widened. **41 cars / 45 DW commits / 47 dispatched.**

---

## 2 · WHAT THE CHAIR NOW RATIFIES

| # | Decision | Ruling |
|---|---|---|
| **C1** | Build on the cartography synthesis parcel world | **CONFIRM, on the honest ground.** Not "the only world with a parcel for every building" — that is measurably false — but **the only CANDIDATE**: the fabric has two masses on one synthetic plan and the point model has no parcels. The world is unfinished and CG-1/CG-2 are the named owners of finishing it. |
| **C2** | The ESTATE wave lands before the ONE REGEN | **CONFIRM**, with one thing said first: the map it promises to move does not compile today for two thirds of freshly generated settlements, so the arc in front of the regen is two repair cars longer. The scheduling logic is unchanged. |
| **C3** | The merge lives in a new leaf | **CONFIRM, with stronger evidence than the compile's.** Beyond single-writer hygiene: the merge is *not* the closed-under-the-theorem operation §3.4 originally claimed, so it needs its own proof surface and must not be smuggled into the file whose header states the theorem. |
| **C4** | `ownerRef` is an institution anchor or `ANONYMOUS_FABRIC` | **RATIFY, unamended.** Nothing in the panel or this lane touched it; it remains the best-evidenced decision in the set. |
| ~~**C5**~~ | Order a measurement lane for Q-D | ⛔ **DISCHARGED, NOT ORDERED.** ~30 ms to generate a metropolis, ~140 ms to compile its map — **~170 ms against a 2,000 ms budget**; 1.3 ms per building on click; ~309 ms for the eager worst case the architecture excludes. **Two seconds survives with roughly an order of magnitude of headroom, and survives even if the laziness contract breaks.** Keep a timing series in DW-S for drift; strike the pre-DW-2 gate. |
| ⭐ **C6** | ⛔ **NEW — ratify the CG train and its position: CG-1 and CG-2 land BEFORE DW-1** | **RATIFY.** It is the only decision on this sheet that blocks the *first* DW car. The alternative is to build DW-2 and the ESTATE wave against the fixture corpus — which is the exact substitution that caused the defect. |

**One product claim the chair should take from this, because the owner will quote
it:** the two-second build is not merely safe, it is safe by roughly tenfold, and
the dominant cost is the *existing* cartography compile at 140 ms, not anything
DW adds.

---

## 3 · THE BAND SITTING'S NEW ORDER

**Twenty rows: one scheduling ruling, BAND ZERO, and eighteen bands.** The draft's
prose said "sixteen bands and two rulings", §Σ said "eighteen rows", and the sheet
held nineteen — three counts, none of them the table's. Fixed, and every row now
carries a mark: **M** measured, **S** sourced, **T** taste, **D** deferred.

### The sitting opens with BAND ZERO, and here is why it must

B3 asked the owner to sign five frontage boundaries in feet. Measured under the
engine's own per-tier scale, the parcel's whole outer edge has a **pooled median
of 83.5 feet**, 88% of parcels land in the top bucket, two buckets never fire at
all, and **Pantin's 30-foot gate — which chair ruling R1 makes the hard filter on
parti eligibility — admits 98.8% of all 1,098 real parcels.** R1 decides nothing.

**That is not a scale problem.** No multiplier repairs it; scaling up only pushes
more parcels into GRAND. It is a *measurable* problem: **a parcel's outer edge is
a third of a ward boundary — a BLOCK FACE, not a plot frontage.**

Four candidates were measured over the same 1,098 parcels, in feet:

| What is measured | Median | B3 buckets | Pantin ≥30 ft |
|---|---|---|---|
| the whole plot edge *(the draft's spec)* | **83.5 ft** | 88% GRAND; two never fire | **98.8%** |
| ⭐ **the building slot's own face** (half of it) | **41.8 ft** | 3 / 20 / 39 / 38 across four; all five fire once tier is counted | **77%** |
| the drawn building's longest wall | 25.9 ft | 1 / 37 / 31 / 26 / 5 | 31% |
| the drawn building's street-facing wall | 14.0 ft | 5% below the smallest bucket | 7% |

**Recommendation: the building slot's own face.** It is the honest one; it is the
**only one available at allocation time**, which is where R2′ puts the filter (the
bottom two need a drawn building); and it reads right at every tier — a hamlet
slot is a shop's width, a town's a house's, a metropolis's a grand frontage.

**And the scale is not the owner's to invent.** `PLAN_UNIT_CM_BY_TIER` is landed,
validated, and what the 3D massing draws from. Recommendation: **adopt it
unchanged.** ⚠ Its honest cost, so it is signed knowingly: our towns read about
**244 m** across and metropolises **646 m**, roughly two to three times small in
absolute metres. That is a pre-existing property of the map, not something DW
introduces, and correcting it would move every 3D scene — deferred to the massing
train and recorded (D-10).

### The sheet

| # | Band | T | Recommendation |
|---|---|---|---|
| — | Sequencing *(read first)* | — | ESTATE before the one regen; CG-1/CG-2 before anything of DW's |
| ⭐ **B0** | **BAND ZERO — the scale and the measurable** | **M** | **Adopt the engine's per-tier scale; a frontage is the SLOT's face, not the plot edge** |
| B1 | Minimum program policy | S+**T** | HONEST — minimums measured, **the tier is taste** |
| B2 | Verdict split | S | Follow the research exactly |
| B3 | Frontage buckets | **M** | The five boundaries **as a function of B0**; two sourced, **three interpolated and marked** |
| B4 | Prosperity ladder | **M** | Seven rungs — **repairs a live defect** |
| B5 | What prosperity buys | S | Walls → separation → duplication |
| B6 | Shedding order | S | Perishables → fixtures → plant — **against the engine's SIX-rung ladder, corrected** |
| B7 | Storey heights | S | Descending by default |
| B8 | When plots merge | S+**T** | From `prosperous` up; **5–15% of plots over 300 y, on the longest frontages** |
| B9 | Acquisition vs partition | **D** | **9a culture is the axis — yes. 9b the balance — DEFERRED to the soak.** Not a band |
| B10 | Owner cessation | **M** | Read from the existing closure machinery |
| B11 | Non-contiguous holdings | S+**T** | Occasional; ports higher. Institutions only |
| B12 | Party walls | S | Common urban, rare rural |
| B13 | Embellishment density | **T** | WORKING — **the vocabulary is sourced, the density is not** |
| B14 | Fixture grades | **T** | 3 × 3, **with the six-to-three mapping now written out** |
| B15 | Art direction | **T** | Abstract now |
| B16 | Free-tier depth | — | Full plan free **(yours alone)** |
| B17 | News threshold | S | Ownership events are news |
| B18 | Parti↔massing | S | Emit the claim |

**The five bands the panel called "preference wearing a number" are all
dispositioned, and none is left dressed as measurement.** B1's policy tier and
B13's density are **restated as taste**. B14's hidden six-to-three wear mapping is
**written out** so nothing is signed unseen. B8's two unbuildable clauses are
**replaced** — "main-street plots" names nothing the parcel world can identify
(only 14.8% of plots touch a street), and "a small minority" is now 5–15%. B9 is
**re-written as the deferral it is** and unbundled into 9a and 9b. B15 was already
honest and stands. **B6's engine fact was simply wrong** — five rungs, reversed,
`pristine` missing, against a six-rung first-match chain — and is corrected.

---

## 4 · DISPOSITION LEDGER

**Every one of the panel's ten MUST-FIX items:**

| | Item | Disposition |
|---|---|---|
| MF-1 | the capacity model | **FIXED** — H21 refuted, predicate re-derived (AR-1); the footprint collision **chartered as CG-2** |
| MF-2 | the merge theorem / unpassable arm | **FIXED** — lattice tolerance, arm rewritten with a failing control, J5 rationale replaced (AR-2) |
| MF-3 | dark/light + the circular citation | **FIXED** — three-way posture split, citation deleted, J3 re-argued (AR-3) |
| MF-4 | "B3 is in feet; the engine has no foot" | ⛔ **REFUTED, then FIXED on the true cause** — a scale exists; the measurable was wrong (AR-4) |
| MF-5 | two cross-references to B12 | **FIXED** — both corrected to B9; 648 references swept, plus a third defect found (AR-8) |
| MF-6 | vocabulary counts off by one, twice | **FIXED** — 57 and 60 recounted; the cell total 83 survives, both intermediates corrected (AR-7) |
| MF-7 | `ROOM_KINDS.dais` has no producer | **FIXED** — J10 widened to two members; the FURNISHING `dais` explicitly kept (AR-7) |
| MF-8 | the charter specifies an unbuildable EST-1 | **FIXED** — the four-way split carried into §5.0, §5.4, §5.10 (AR-9) |
| MF-9 | the frontage edge is not a street | **FIXED** — H19 split, law 6 re-worded, DW-2a owes an explicit street derivation (AR-4) |
| MF-10 | the parcel world throws for most settlements | **FIXED by charter** — CG-1 diagnosed and chartered; C1 re-grounded (AR-5, AR-6) |

**The panel's OVERSTATED and UNDERSTATED verdicts, all dispositioned.** *The 334
ledger items "do not overlap"* — **accepted as overstated**; re-read as a count of
ledger ROWS, since §1.2 already shows one capability raised by four dossiers.
*EST-1 unbuildable in the charter alone* — **fixed** (AR-9). The `stall` finding —
**understated, fixed** at two members (AR-7). arch-6 R-5's performance bound —
**understated, replaced by measurement** (AR-10). Two further passages the report
treats as overstatements without the label: the painter's op-count bill (four
sites in three files, **carried into §0 H25**) and B3's fan-wedge caveat (its
qualitative form **replaced by the quantitative one** at §0.3).

---

## 5 · WHAT IS STILL OPEN

**Three, and only the first can block anything.**

1. ⛔ **The CG train's numbers should be seen even though the repair is not the
   owner's call.** CG-1 moves per-tier bands by the rule
   `max(current, ceil(measuredMax × 1.5))`, giving `{thorp 18, hamlet 30,
   village 59, town 92, city 77, metropolis 96}`. Restoring a stage's stated
   intent is a **repair** and this lane treats it as one, but the rule is the
   thing worth vetoing. **Recommendation: sign the RULE, not the six values.**

2. **B2's four research counts remain the largest untested body of evidence under
   the sheet** (3/28, 11/28, ~30/124, 14/40). Both lanes verified the dossiers are
   byte-unchanged and that each ledger header says what §9.1 quotes; **neither
   re-derived the verdict tables.** B2 asks the owner to "follow the research
   exactly" and nobody has re-counted the research. One cheap compile lane.

3. **The canonical-building-count inversion** (D-11): a metropolis projects a
   median of 53 canonical scene buildings and a town 55, at twenty times the
   population. Correct aggregation, or a second defect upstream. **CG-1 looks and
   reports; it does not fix it**, because the cause is not in the stage it touches.

**Stated affirmatively, what this lane did NOT do:** it did not re-derive B2's
counts, open §3.2's sixteen `ProgramMinimum` citations, or check the provenance of
the 57 cell kinds and 60 fixtures — only their arithmetic. **It ran no test
against CG-1, CG-2, EST-2a or EST-2b, because none exists**; every claim about
which surfaces those cars move is a reading of the code and is labelled as such in
charter §5 and arch-5. And it measured nothing in a browser.

---

## 6 · THE SENTENCE THE CHAIR DECIDES ON

**Ratify the amended charter: its three refuted claims are replaced by executed
measurement with failing controls, its circular premise is deleted and re-argued
from a testable rule, the two defects the panel found in landed code are
chartered as CG-1 and CG-2 landing before DW-1, and the band sitting now opens
with the one question everything in Group A derives from — but ratification also
commits the estate to repairing somebody else's landed cartography stage before
DW writes its first line, and that is the part worth a second look before saying
yes.**
