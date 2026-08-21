# RETRO-E1 — EVIDENCE MEMO FOR THE FABLE CHAIR
## Map-architecture cluster: §238, §239, §240, §241, §252, §255, §257

**Role:** read-only evidence verifier. I ruled nothing, edited nothing, ran no repo gate,
executed no state-mutating command. Everything labelled CONFIRMED below was executed or
observed **by me** in this session (file reads, image reads, arithmetic recomputation, greps
over the built tree and the lane logs). PLAUSIBLE means the receipt claims it and I could not
independently execute it.

**Artifacts read in full:** `laneMFB8b-receipt.md` (596 l), `laneMFARCH-receipt.md` (696 l),
`laneMFARCH2-receipt.md` (727 l), `laneMFW1-receipt.md` (424 l), `laneMFSPEC-receipt.md` (488 l);
ODQ §238-§241, §252, §255, §257 (+§266.2a); `docs/FABLE_RETROVALIDATION_QUEUE.md`.
**Primary sources beyond the receipts:** the built tree at `laneMFARCH2-tip/src/**`
(`epochAxis.js`, `builtUmbrella.js`, `wallCircuit.js`, `walls.js`), `laneMFARCH2-tip/tests/domain/
townMapWallCircuit.test.js`, `laneMFARCH2-tip/harness/exemplars.mjs`, the lane's own captured
logs (`MFW1-water-*.log`, `MFW1-corpus-spread-*.log`, `MFARCH-epoch.log`, `MFARCH-temporal.log`,
`MFARCH-predaudit.txt`), the repo's `map-corpus/docs/{GENERATION-SPEC,MORPHOLOGY-PLAN,
MORPHOLOGY-CONTEXT,laneMFS1-urbanism-atlas,laneHF-CALIBRATION}.md`, and four zoom plates read
as images (b8b ownerview BEFORE/AFTER, a 3× crop of each, arch2 owner zoom + a 3× crop).

---

# §238 · MF-B8b COLLECTED

## (a) The predicate class supersedes the shared-object framing as MF-ARCH's governing contract

**EVIDENCE.** `laneMFB8b-receipt.md:16-20` — *"§230.1's leading hypothesis … is REFUTED, by hash,
on every walled leaf. The census's `claimLine` reconstructs **byte-identically** from the lens's
`polygon` under the band's own offset."* The mechanism is located exactly:
`laneMFB8b-receipt.md:100-108` names four copies of the vertex-sampled predicate with
file:line (`groundLaw.js:268-279`, `:296-318`, `laneMFB8-drawn.mjs:166-180`, `:106-118`).
The owner's own back-house is reproduced numerically at `:113-119` —
`per-vertex distance … 7.882 5.475 10.251 10.677 ⇒ VERTEX penetration −1.019 (the census reads
CLEAN) / EDGE penetration 4.348`. The contract that supersedes is stated at `:526` and `:531-532`:
*"one artifact, one accessor, AND one proven predicate — with the census's independence bought by
counterfactuals rather than by a second implementation"* and *"MF-ARCH's enforcement should be a
source scan for raw-handle reads, not an honour system around accessors."*
The cross-tree control is the strongest part: `:137-141` measures the **b7** tree with b7's own
`wallClaims` — `MF-B7 11,308 bodies · STREET 0/671 · WATER 0/16 · WALL 0/84`.

**STATUS: CONFIRMED (receipt-executed, and the b7 arm is a genuine cross-tree control, not an
inference).** The ODQ's figures `B7 671/16/84` and `B8 1,299/13/190` reproduce the receipt table
to the unit; `B8b 0/0/0 over 23,116` reproduces `:48-50`.

**DOUBTS.**
1. ⚠ **ODQ §238.1's wording overstates the hash result.** It says *"the censused and drawn
   circuits were ALREADY byte-identical (town sha 857ffc4f both ways)"*. The receipt's own probe
   (`:84-90`) shows **DRAWN `ring.polygon` sha = `8f8ad7f365637e40`** and **CENSUS `ring.claimLine`
   sha = `857ffc4f1b110ec3`** — *different*. What is byte-identical is the census claimLine and a
   **reconstruction** of it from the drawn polygon under `shift = 1.132`. Byte-identity between
   drawn and censused holds only for the `shift = 0` old-core rings (`:95`). The finding survives
   intact (the two surfaces are one object up to a declared pure offset), but the ledger sentence
   as written is not what the instrument measured.
2. ⚠ The §201B orphan-segment cure is quoted as fact in §238.3 ("§201B's 4 orphan segments gone").
   That is measured (0 on every leaf), but the receipt is explicit that the **cause** is
   `PLAUSIBLE cause, not confirmed` (`:374-376`) and names the experiment that would settle it.
   Nothing in the ledger row misstates this; noting it so the chair does not inherit a mechanism
   claim.

## (b) Accepting the same-seed shift on the thorp-byte-identical argument

**EVIDENCE.** `laneMFB8b-receipt.md:346` — `thorp b60d7bc50f96d306… ← UNCHANGED from b8`, and
`:364-366`: *"THE THORP IS BYTE-IDENTICAL TO b8 AND THAT IS A PROOF, NOT A COINCIDENCE. It is the
one leaf with no wall and no body in any reserved claim, so the one leaf this wave should not
move."* Causes 93-96 are enumerated at `:505-513` with "Fifteen of sixteen leaves move."

**STATUS: PLAUSIBLE.** The sha table is receipt-quoted; I did not re-render. The *argument* is
sound and is the correct shape of control (a negative control on the one leaf the change cannot
reach). The receipt applies the same control logic again at MF-ARCH-2 (`laneMFARCH2-receipt.md:
489-493`, six unwalled leaves byte-identical after the epoch axis), which is corroborating.

**DOUBTS.**
3. ⚠ **The thorp is a one-bit control, and it went dark one wave later.** MF-ARCH-2's J-A2-8
   (`laneMFARCH2-receipt.md:627-631`) records exactly this: *"The cost is that the six unwalled
   leaves are no longer a control for the epoch work."* Ratifying (b) is fine; ratifying it as a
   general method should carry the note that the control was spent.
4. ⚠ `sizeBaseline` at b8b is reported as `MAX 794 … against the 800 ceiling — UNDER` (`:58`)
   while the same receipt's hazard block says *"My own stricter count reads 800 … the margin is
   six lines under one reading and zero under another"* (`:502-504`). Not a listed judgment, but
   the landing declaration inherits it.

## (c) The chair's zoom-based visual verdict that the wall now runs clear

**EVIDENCE — I read the pixels.** Both plates are 900×900 crops of a 3000 px town render
(3 px/unit), `mf-proto-out/b8b/MFB8b-zoom-ownerview{-BEFORE,}.png`. I also cut a 3× upscale of
the wall/fabric band (source rect x 380-780, y 130-320) from each.

**BEFORE, what is actually visible:** the heavy black circuit crosses the upper third with two
tower dots on it. In the 3× crop it **visibly overlays building outlines in at least two places**
— a grey body and its triangular gable mark pass *under* the black band and reappear on both
sides (source ≈ x 620-650, y 165-190), and a second block's roofs sit tight under the stroke at
≈ x 660-700, y 175-200. Separately, **two heavy black rectangles stand alone in open field at the
left, attached to nothing** (≈ x 0-90, y 250-320) — the receipt's orphaned gatehouse piers,
present exactly as described (`laneMFB8b-receipt.md:394-398`).

**AFTER, what is actually visible:** the circuit follows the **same path** through this crop
(same curve, same tower dot) — the wall did not move here; **the bodies did.** Every place the
stroke previously overlaid a body is now clear tan ground; no building outline passes under the
black stroke anywhere along its visible run. The gable marks that sat under the stroke are now
below it; the brown body at ≈ x 670-700 has been pulled down to clear it. Fabric elsewhere in the
crop is visibly re-shuffled (a long grey bar appears at ≈ x 580-620 that is absent in BEFORE) —
consistent with §17.3's demotion ladder re-firing and "182 more bodies survive" (`:341`).
**And the wall now reaches its own gatehouse:** in AFTER the run continues down-left past x ≈ 120
and terminates at the two piers, which now stand *on* the circuit; in BEFORE the run simply
stopped at x ≈ 135 leaving them stranded.

**STATUS: CONFIRMED at the ink level.** The chair's verdict is corroborated by what I can see:
zero ink-over-body crossings after, at least two before, and the gatehouse reconnection is
unambiguous.

**DOUBTS — and these matter for how the verdict is ratified.**
5. ⚠⚠ **The zoom cannot verify the claim the ledger attaches to it.** The drawn stroke is
   ≈4.6 view units wide; the §200 **band** is 8.696 units (`laneMFB8b-receipt.md:88`). A zoom can
   only show **ink** crossings — which the receipt lists as its own separate line (`:51`,
   "§200 DRAWN INK crossings 0"). "0 of 23,116 bodies in the wall BAND" is invisible at any
   resolution. ODQ §238.2's *"B8b: 0/0/0 over 23,116 drawn bodies, chair-verified by zoom at the
   owner's exact crop"* reads as the zoom verifying the census. It does not, and the receipt is
   honest about this (`:407-408`: *"The measured evidence is what carries this claim; the zoom
   corroborates it"*). Ratify the zoom as corroboration, not as verification.
6. ⚠ **"the intervallum is open" (§238.2) is not what the plate shows.** What is visible is
   *unbuilt tan ground* between wall and fabric. No street is drawn there. §239.2's wall-side
   street is wave-nine work and was not built at b8b. The phrase should not be read as the
   intervallum lane existing.
7. ⚠ The receipt itself flags the *other* crop as weak: *"Honestly: this crop's change is modest,
   because the town only ever had two convicted bodies"* (`:406-407`, the wall-run zoom). The
   town leaf carried only 2 of the corpus's 190 wall convictions (`:310`). **The town is the
   corpus's weakest leaf for this defect**; the leaves that carried it (metropolis 61, highwater
   47, city 32) were never zoomed at all. A visual verdict taken on the least-affected leaf is
   weak evidence for a corpus claim.

## (d) The MF-ARCH mandate's ordering

**EVIDENCE.** ODQ §238.5 lists: SCC diagnostic → predicate unification → raw-handle source scan →
keyedRandom + lineage → fixed-precision topology + three hash tiers → spatial indexing +
equivalence pins + per-census budgets → cross-engine CI. This is a faithful transcription of the
b8b handoff (`laneMFB8b-receipt.md:422-437`, §8's numbered "what I did not do", which is the
handoff list) with the SCC promoted to first — and b8b explicitly asks for that promotion:
*"§234.2 asks for the diagnostic FIRST; this lane is the worked example it should be validated
against, not the tool"* (`:433-435`).

**STATUS: CONFIRMED** (the ordering is derivable from the receipt, not invented).
The ordering also proved itself: MF-ARCH built the SCC first and it immediately caught its own
extractor blindness (`laneMFARCH-receipt.md:89-93`) — a diagnostic-first order paying off.

**DOUBTS.**
8. ⚠ Items 5-7 were never reached at MF-ARCH (`laneMFARCH-receipt.md:525-528`) and item 5
   (spatial indexing / equivalence pins / runtime budgets) was **still unbuilt after MF-ARCH-2**
   (`laneMFARCH2-receipt.md:534-539`). Two consecutive waves consumed by items 1-4. The ordering
   was right; the *sizing* was optimistic by a factor of ~2. Worth recording if the chair ratifies
   the ordering as a method.

---

# §239 · THE WALL-SIDE STREET / BLOCK TERMINATION / TEMPORAL PRIMACY

Note: §239 is an **owner-law row with a chair amendment**; the only executed evidence that bears
on it is MF-ARCH's same-turn evaluation of the §239 graph fact.

## (a) The AMENDMENT of "walls first" into temporal primacy — is the genesis objection real, and is the temporal edge the right general rule?

**EVIDENCE — the genesis objection.** ODQ §239.3's own statement: *"a circuit cannot be literally
first at genesis (it wraps something that must already exist)."* This is confirmed by the built
derivation: `epochAxis.js:319-339` (`epochCircuitRing`) traces a circuit from a **cell mask that
must already exist**; `wallCircuit.js:219` passes `body: epochCircuitRing({…})`. There is no
construction in the tree in which a circuit precedes any fabric. **The genesis objection is real.**

**EVIDENCE — the temporal edge.** The §239 year test was run and **returned nothing**.
`MFARCH-temporal.log` (executed, read by me in full):
```
DISTINCT circuit inputsHash across those years : 1
DISTINCT circuit contentHash across those years: 1
⚠⚠ AND THIS ARM CANNOT CONCLUDE FROM THAT … The fabric itself is year-invariant at this
   seed (roads/frontage/umbrella points identical at every year, including year 18 before
   the wall) … the two hypotheses make the same prediction here.
```
`laneMFARCH-receipt.md:211-213` banks the class and J-ARCH-8 (`:616-617`) records the arm as
**NON-DISCRIMINATING rather than as a pass**.

**STATUS: the genesis objection is CONFIRMED. The temporal edge as a general rule is
UNSUPPORTED — and, one wave later, UNIMPLEMENTED.**

**DOUBTS — this is the sharpest thing in §239.**
9. ⚠⚠ **The temporal edge was never built; §240's epoch index replaced it entirely.** I read
   `epochAxis.js:92-160` (`deriveEpochs`). Its inputs are `hasWalls`, `extentTier`, `builtRadius`,
   `vintage`. The **year is used only as a presence gate**:
   ```js
   const dated = !!(a.vintage && Number.isFinite(a.vintage.ageAtBuild) && Number.isFinite(a.vintage.year));
   ```
   (`epochAxis.js:106`). The ordering that actually derives the ladder is `share =
   thresholdRadius(t) / now` — **tier-threshold extent shares of today's built radius**
   (`:117-123`). No year orders anything. So §239.3's *"wall(Y_wall) ← fabric(Y_wall);
   fabric(Y>Y_wall) ← wall — a one-way temporal edge"* describes a mechanism that does not exist
   in the shipped derivation. The cycles were cut by the **version/epoch index**, not by time
   (`laneMFARCH-receipt.md:274-278`; `laneMFARCH2-receipt.md:110-112`). If the chair ratifies (a),
   ratify it as *an owner-law framing that motivated the right experiment* — not as an
   implemented rule.

## (b) Generalizing block termination from wall/street to ALL hard edges

**EVIDENCE.** ODQ §239.1 only. There is **no executed evidence for this generalization anywhere
in the cluster.** The corpus material that bears on it is one step removed:
`MORPHOLOGY-PLAN.md` measures block elongation and junction mix but I found no measurement of
block termination against water or cliff. The nearest supporting fact is negative and strong:
`laneMFB8b-receipt.md:283-292` shows that the *existing* grow-then-clip order produced a
straddling region that a smoothing pass then pushed back across a corrected boundary — evidence
that post-hoc trimming is fragile, which is the argument §239.1 makes.

**STATUS: PLAUSIBLE (reasoned; no measurement).**

**DOUBTS.**
10. ⚠ The generalization is the **chair's**, not the owner's — ODQ §239.1 says so
    (*"Generalized by the chair to ALL hard edges (wall, street, water, cliff)"*). Water and cliff
    have properties wall and street do not: a cliff edge is a *terrain* boundary with no
    right-of-way, and §255's whole finding is that **"crossing" is ill-defined for a coast**
    (`laneMFW1-receipt.md:175-180`: a shore-parallel road scores `inside=775, crossings=775` on
    `city`). A rule that terminates blocks at "water" inherits that ambiguity directly. The
    generalization should not be ratified without deciding what a water edge *is* — which is
    exactly what §255.4's G-34 ruling is for. **These two rows are coupled and the coupling is
    not recorded in either.**

## (c) The wall-side street makes the no-touching law a geometric consequence rather than a policed rule

**EVIDENCE.** ODQ §239.2 only; no lane built it. The claim's plausibility rests on the fact that
the *current* mechanism is indeed a policed rule: `laneMFB8b-receipt.md:196-204` describes
`kerbHalfPlane` as *"the one repair line"* — i.e. bodies are pushed off the band after growth.
The corpus support for the exception class is real and citable: T-22 inner-face abutment is
referenced in §239.2; `laneMFS1-urbanism-atlas.md:847` supplies the flank-grammar frequencies.

**STATUS: PLAUSIBLE.**

**DOUBTS.**
11. ⚠ The claim is only true if the wall-side street is **generated before** the fabric that abuts
    it. Under the shipped derivation the wall is fitted *around finished fabric* (see §240(a)
    below), so a wall-side street generated at the same stage would be subject to the identical
    post-hoc clip. **The geometric-consequence claim is conditional on §239.1 landing first**, and
    §239.5 slots them as peers rather than as an ordered pair.
12. ⚠ The exception clause ("wall-owned structures … and late-period crowding lean-tos under
    measured space pressure") introduces a *measured space pressure* input that does not exist in
    the tree. Recorded here as a new derivation home the row does not name.

## (d) Holding both laws for wave nine rather than redirecting MF-ARCH

**EVIDENCE.** ODQ §239.5. Corroborated by MF-ARCH's own judgment, arrived at independently:
`laneMFARCH-receipt.md:280-283` — *"NOT BUILT THIS WAVE, ON INSTRUCTION AND ON JUDGMENT. Both
messages say report-only. It is also the right call independently: a version-indexed pipeline is a
same-seed shift on every walled leaf and a rewrite of the assembly's spine."*

**STATUS: CONFIRMED as consistent with the lane's own reasoning.** Two independent parties
reaching the same call is genuine support.

**DOUBTS.**
13. ⚠ The freeze was honoured for §239 but **not** for §240 — MF-ARCH-2 built the epoch axis one
    row later and it moved all sixteen leaves. §239.5 and §241.6 therefore treat two same-shaped
    geometry changes differently. The distinction (architecture cure vs feature) is defensible and
    is argued at `laneMFARCH2-receipt.md:607-609`, but the chair should note that "the foundation
    lands once, clean" (§239.5) was already not true by §252.

---

# §240 · EPOCH GENERATION

## (a) Does epoch generation truly close the genesis exception (no residual simultaneous case)?

**EVIDENCE — the acyclicity claim is CONFIRMED.** `laneMFARCH2-receipt.md:52-54`:
```
SCC · module import graph                43 nodes 151 edges — ACYCLIC
SCC · stage graph (binding granularity)  129 nodes 446 edges — 0 NON-TRIVIAL SCCs
SCC · stage graph (field granularity)    364 nodes 847 edges — 0 NON-TRIVIAL SCCs
```
and `epochAxis.js:76-77` states the reason in the module's own header: *"Every input is a FACT
that exists before any circuit is traced, which is what makes the whole pipeline acyclic: nothing
here reads a wall."* I verified that: `deriveEpochs`' four inputs contain no wall.

**EVIDENCE — and here is what the closure actually cost.** I read the derivation.
`deriveEpochs` takes `builtRadius` = **today's finished built radius** (`epochAxis.js:88, 94`) and
computes every epoch as a **share of today's extent** (`:117-123`). `epochCircuitRing`
(`builtUmbrella.js:319-339`) then cuts **today's finished `bodyMask`** with a shrunk copy of
today's outline:
```js
const shrunk = shrinkAbout(ring, ringCentroid(ring), extent);
… if (bodyMask[k] !== 1) continue;
    if (pointInPolygon((i+0.5)*cell, (j+0.5)*cell, shrunk)) m[k] = 1;
```
**STATUS: CONFIRMED that there is no residual simultaneous case — and CONFIRMED that the closure
is achieved by not implementing the generative half of the owner's law.** The epochs are a
**retrospective partition of finished modern fabric**, not a build sequence. §240.1's *"build the
inner core, STOP, build the wall that completely bounds it, THEN build the districts expanding
outside it"* is not what runs. Nothing is built epoch-wise; everything is built once and then
attributed. The receipt says so in its own words without drawing the conclusion:
`laneMFARCH2-receipt.md:241` — *"Nothing is clipped; ground is attributed."*

**DOUBTS — the chair should weigh these hard.**
14. ⚠⚠ **There is no simultaneous case because there is no epoch-wise generation.** The wall does
    not constrain anything built after it; it is fitted around a concentric slice of unconstrained
    fabric. This is precisely why MF-ARCH-2 needed **four failed containment attempts and a
    6-round outward sweep** to make the ring bound its own slice (`laneMFARCH2-receipt.md:225-231`,
    `epochAxis.js:201-237`) — a problem that cannot arise if the fabric is grown inside the wall.
    ODQ §240.1's *"acyclic BY CONSTRUCTION"* is true of the implementation; the implementation is
    not the law.
15. ⚠⚠ **`shrinkAbout` — the very defect §252 says was cured — is still the cutting window.**
    `laneMFARCH2-receipt.md:143-145` identifies the old defect as *"the older ring was
    `shrinkAbout(todayOutline, centroid, ratio)` — a SCALED COPY of the modern silhouette."*
    `laneMFARCH2-receipt.md:671` claims *"`walls.js` … no longer contains … `shrinkAbout`."* True —
    it **moved** to `epochAxis.js:170` and is **still called**, at `builtUmbrella.js:324`, to define
    each epoch's extent window. The epoch's *shape* is genuinely its own (it is the real cell mask
    intersected with the window, then closed and re-traced), so the receipt's claim at `:211` is
    defensible. But the epoch's **outer envelope is still a homothety of today's outline about a
    single centroid** (`ringCentroid(ring)`, one centre for all epochs). This is decisive for
    §252(a): see there.
16. ⚠ `OUTGROWN_SHARE = 0.86` gates whether a later circuit is earned (`epochAxis.js:67, 129`) and
    carries its own warning: *"⚠ UNSOAKED; rides the tuning signature."* §240.2 declares ring count
    "DERIVED, NEVER A KNOB"; the ladder contains one unsoaked constant that decides ring count.
    It is inherited (§42/§43) rather than minted, which is the honest defence, but it is a dial.

## (b) The tier ceilings — village 0 / town 1 / city 2 / metropolis 3 — against the corpus

**EVIDENCE — what was actually built.** `epochAxis.js:55-57`, read by me:
```js
export const TIER_CIRCUIT_CAP = Object.freeze({
  thorp: 1, hamlet: 1, village: 1, town: 1, city: 2, metropolis: 2,
});
```
**Two of the four ceilings do not match §240.2, and a third tier pair is unaddressed:**
| §240.2 | built | disclosure |
|---|---|---|
| village **0** | **1** | J-A2-4 (`laneMFARCH2-receipt.md:616-618`) — "read as the DOSSIER'S decision, not this module's" |
| town **1** | 1 | ✔ |
| city **2** | 2 | ✔ |
| metropolis **3** | **2** | J-A2-3 (`:614-615`), §252.3a — derived, withheld by cap |
| thorp / hamlet — | **1** each | **not disclosed anywhere** |

**EVIDENCE — against the corpus.** `MORPHOLOGY-PLAN.md:387` offers the corroboration:
*"hf347, the corpus's three-circuit plate … directly corroborates §240.2's binding condition — 'a
village earns zero circuits; a town one; a city may show two vintages; a metropolis three at
most'."* **But the corpus's own calibration document labels hf347 a TOWN.**
`laneHF-CALIBRATION.md:330` — *"**hf347 town-three-circuits** ★★ keeper … three generations of
defence"*; and `laneHF-CALIBRATION.md:376` — *"**hf385 town-three-circuits-CURE347** ★★★ …
'Holtmere': three circuits, none of them a ring, none concentric with any other."*
`MORPHOLOGY-PLAN.md:116` names the same plate *"hf347 town-three-circuits"* in its own φ table.

**STATUS: the ceilings are CONFIRMED-DIVERGENT from both the build and the corpus.**

**DOUBTS — this is the strongest disconfirming evidence in my rows.**
17. ⚠⚠⚠ **The corpus's only two three-circuit plates are both TOWNS.** §240.2 gives a town **one**.
    The single piece of corpus evidence PLAN offers *for* the ceilings is a plate that
    **refutes the town rung**, and PLAN cites it as corroboration without noticing. Two independent
    documents (`MORPHOLOGY-PLAN`, `laneHF-CALIBRATION`) label it a town.
18. ⚠⚠ **PLAN §6.1's "corroboration" is the Q-2 conflation.** PLAN's table
    (`MORPHOLOGY-PLAN.md:379-385`) measures **legible fabric epochs**: village 1-2, town 2-3,
    city 2-4, metropolis 3-4 — *uniformly higher than* §240.2's circuit ceilings, and measuring a
    different quantity. §257.3(a) later rules exactly that these are different objects. So the
    evidence base cited under §240.2 was already conflated when it was cited.
19. ⚠⚠ **The corpus does not support village-0 either.** `laneMFS1-urbanism-atlas.md:844` —
    *"walled ≈29, unwalled ≈12, and the split is almost exactly the tier line … hf15's light
    perimeter is the only sub-town enclosure, and hf59 substitutes a threat-facing barricade."*
    **Two sub-town enclosures exist.** §240.2 states village-0 flatly; the corpus says "essentially
    none," and the build refuses to enforce it (J-A2-4). Three independent reasons to soften.
20. ⚠⚠ **The ~10% calibration is n=3.** §240.2 rests on *"the corpus's measured ~10%
    two-vintages-in-one-frame."* Source: `laneMFS1-urbanism-atlas.md:847` — *"two vintages in one
    frame ≈3 (10%) (hf32, hf70, hf34)"* — three plates of ≈29 walled, from the 41-plate HF-1-era
    tally. Note hf34 is double-counted (it is also one of the three water-gate plates).
21. ⚠ **The build permits a walled thorp one circuit.** Nobody has raised this. §240.2's spirit
    ("a village earns zero") implies thorp/hamlet 0; the table gives them 1. No corpus leaf tests
    it (`laneMFARCH2-receipt.md:204`), so it would ship undetected.

## (c) The vintage triad and density gradient falling out as free consequences

**EVIDENCE — I grepped the built tree.** Over `laneMFARCH2-tip/src/domain/townMap/fabric/*.js`,
the token `epoch` appears in exactly **five** files:
```
builtUmbrella.js   buildFabric.js   epochAxis.js   walls.js   wallCircuit.js
```
It appears in **zero** of `parcels.js`, `morphology.js`, `organisms.js`, `tierGrammar.js`.
No grain, plot-variance, roof-pigment or density derivation reads the epoch at all.

**STATUS: CONFIRMED-FALSE as delivered.** ODQ §240.3 claims *"the VINTAGE TRIAD (T-18) falls out
free — each ring is a build era, so its grain, plot variance and roof pigment differ by
construction; the DENSITY GRADIENT (T-03, organic 2.5-5.0) emerges from epoch order instead of
being imposed."* `laneMFARCH2-receipt.md:211` repeats it: *"§240.3's vintage triad falls out of
this for free."* **Only the ring geometry differs by epoch.** Grain, plot variance, pigment and
density are produced by one pass with one model and are epoch-blind.

**DOUBTS.**
22. ⚠⚠⚠ This is the largest unsupported claim in the row, and it has propagated. §266.2a
    (`docs/OWNER_DECISION_QUEUE.md:10095-10096`) states the consequence more narrowly than it
    should: *"`epochAxis.js` mints ONE EPOCH PER CIRCUIT, so **six of sixteen** exemplar leaves
    cannot express a vintage at all."* By the code, **sixteen of sixteen** cannot express the
    *triad*; six of sixteen cannot express an epoch *count*. The chair should correct the
    magnitude when ratifying §257(a)'s downstream, since W4's per-epoch exit criteria depend on it.
23. ⚠ §240.3's third dividend (§161g demotion) is also **NOT BUILT** and the spec says so at
    `GENERATION-SPEC.md:1820-1825` — *"⛔⛔ STATUS: NOT BUILT, AND IT IS URGENT (§250.5) … WITHOUT
    THIS, EVERY NEW RING ERASES THE HISTORY THE EPOCH MODEL WAS ADOPTED TO EXPRESS."* Three of the
    four "free consequences" in §240.3 are unbuilt; the fourth (the wall as a dated event) I did
    not test.

## (d) The epoch-boundary inertia hazard's severity

**EVIDENCE.** §240.4 named it; MF-ARCH-2 closed it and **declared its cost**.
`laneMFARCH2-receipt.md:504-506` (cause 100): *"PER-EPOCH KEYED RNG STREAMS. `wall.epoch.k`
replaces one stream walked in ring order, so every gate-bricking and ditch-affordance draw on a
walled leaf moves. This is §240.4's inertia seam being closed, and it necessarily moves bytes
once."* The mechanism is pinned: `epochAxis.js:27-30` — *"Pinned directly: add a ring, and epoch 0
must come back byte-identical."* The severity argument is in `laneMFARCH2-receipt.md:719-722`:
*"One stream walked in ring order means adding a later circuit re-rolls every gate of an earlier
one — and the outer ring is traced FIRST, so the earlier epoch is exactly what moves."*

**STATUS: CONFIRMED — the hazard was real and is closed.** The "outer ring traced first" detail
makes the severity assessment concrete rather than speculative: the pre-cure failure mode was that
the *oldest* epoch was the one that re-rolled, which is the worst possible direction.

**DOUBTS.**
24. ⚠ The inertia pin is on the **circuit's own draws**. Because nothing else in the fabric reads
    the epoch (see (c)), the pin's coverage is exactly as wide as the epoch surface is — which is
    small today and will grow at W2/W4. The hazard's severity assessment is right for the current
    surface and should be re-run when G-42 lands.

---

# §241 · MF-ARCH COLLECTED

## (a) The missing-version-axis finding SUPERSEDES the §234 fold's isolate-cycles-in-solvers prescription

**EVIDENCE — the measurement chain.**
`laneMFARCH-receipt.md:124-128` (STEP 1): *"write-back mutations removed: 18 / ✔ THE READ-ONLY
GRAPH IS A DAG. Every cycle in the pipeline is created by a WRITE-BACK, so the write-back set is a
COMPLETE FEEDBACK EDGE SET — proved, not assumed."*
`:132-148` (STEP 2, the per-write-back attribution table with line numbers): *"⇒ 9 of 18
write-backs induce a REAL CYCLE; 9 are forward edges. ⇒ DISTINCT CYCLES BY MEMBERSHIP: 8"*, largest
13 (`packed.parcels ← ground`).
`:164-171` (the refutation of the lane's own hypothesis): *"GRAPH C nodes 341 edges 822 … widest
cycle, BINDING granularity: 25 stages / FIELD granularity: 24 bindings. ⛔ MY HYPOTHESIS WAS WRONG
AND THE MEASUREMENT SAID SO."*
`:264-278` (the generalization table, all eight cycles as version pairs) and the ruling:
*"no bounded solver is required anywhere, `wallCycle.js` included."*
**And it was later executed:** `laneMFARCH2-receipt.md:28-35` — cycles 8 → **0**, write-backs
18 → 4, widest cycle 25/24 → **0/0**, bounded solvers 1 → **0**; `:103-107` — the version-naming
half moved **not one byte** (determinism digest byte-identical) and cost *"exactly nine `const`
declarations"* (`:110-111`).

**STATUS: CONFIRMED — and this is the best-evidenced judgment in my whole cluster.** It was
PLAUSIBLE at §241 (report-only) and was promoted to CONFIRMED by §252's execution. Reversing an
adopted external recommendation is justified here: the review predicted "one or two tiny cycles";
the instrument measured eight; and the prescribed cure (solver isolation) was then shown
unnecessary by construction.

**DOUBTS.**
25. ⚠ **The "space cannot dissolve it" leg is thin.** `laneMFARCH-receipt.md:275` asserts
    *"Splitting the artifact finer in SPACE cannot dissolve it — I measured that and it did not."*
    The measurement is **one refinement of one graph that removed one binding from a 25-member
    cycle** (25 stages → 24 bindings). That supports "field granularity did not help here"; it does
    not support "cannot." The *version* leg is independently proved (all eight dissolved), so the
    ruling survives — but the "cannot" should not be banked as a law on this evidence.
26. ⚠ The SCC's own scope was later shown insufficient: `laneMFARCH2-receipt.md:114-125` —
    *"five more write-backs were hiding where no SCC could see them … `censusLeaf` assigned its
    survivors straight back into its caller's `packed`, `lod`, `shanty` and `faubourgs` … a stage
    graph extracted from `buildFabric` stops at the call."* So the "8 cycles" figure §241.1
    presents as proved was an **undercount by 5 write-backs** at the time it was published. The
    conclusion held; the completeness claim did not. ODQ §252.2 records this; §241.1 cannot.

## (b) J-ARCH-6 — moving the guard from read-site scan to publication point against the pilot's prescription

**EVIDENCE — the measurement that motivated the departure.**
`laneMFARCH-receipt.md:396-402` (measured exposure: water 58 reads/13 files, parcels 46/10, wall
rings 36/7, channels 19/5, accessor 2/2) and `:407-411`: *"of 36 `.walls` hits only **8 are
`fabric.walls`** — the rest are `P.walls` (a palette), `fort.walls`, `c.fortifications.walls`,
`dp.walls`. The fabric travels under `fabric`, `f`, `dp`, `P`, `a`, `ctx`, `closing`"* — seven
aliases, exactly as ODQ §241.5a states — *"an alias detector requiring two fabric signature keys on
one identifier found only 6 of the files that hold one."*
**The cure exists and I read it.** `wallCircuit.js:327-337`:
```js
export function publishCircuitRings(fabric, node) {
  Object.defineProperty(fabric, 'walls', {
    enumerable: true, configurable: false,
    get() { if (!VERIFIED.has(node)) { verifyCircuit(node); VERIFIED.add(node); } return node.rings; },
  });
  return fabric;
}
```

**STATUS: CONFIRMED — the guard exists as described, and the aliasing argument is measured rather
than asserted.** The reasoning ("one publication, unboundedly many reads") is sound.

**DOUBTS.**
27. ⚠⚠ **The guard covers one of five measured raw surfaces.** J-ARCH-4 (`:606-607`) explicitly
    leaves streets (19 reads) and water (58 reads) unguarded, and parcels (46 reads) is not
    addressed at all. ODQ §241.5a calls J-ARCH-6 *"the better law"* without noting the coverage is
    ~1/5 of the measured exposure. The law is better; the *sweep* was not taken.
28. ⚠ The getter returns `node.rings` — the raw array. Verification is memoized per node
    (`:422-426`, honestly stated), so it catches staleness at first hand-out only, not mutation
    after that. Correct for the §230 class it targets; not a general immutability guarantee.
29. ⚠ **The scan MF-B8b asked for was not abandoned — it was narrowed and kept** (`:431-433`,
    the walker refuses a second plain-name publication). ODQ §241.5a's "supersedes MF-B8b's
    prescription" slightly overstates; the accurate reading is "demoted the scan to a narrow
    complementary arm."

## (c) Accepting the latent fork-key salt defect as deferred-with-cause rather than cured in place

**EVIDENCE — and here the ledger is wrong on one word.**
`laneMFARCH-receipt.md:464-467`: *"⚠ **THE DAMAGE IS LATENT, NOT ACTIVE** … **The one path where
it is ACTIVE is the coast fallback**, whose input is the LANDED model's two-point path —
variant-invariant — so that jitter is identical at every reroll. **The corpus does not exercise
it.**"* MF-ARCH-2 reproduces the same table with the same word:
`laneMFARCH2-receipt.md:337` — ``` `${seed}|coast|i` | ⛔ **ACTIVE** ```.

**STATUS: the deferral is CONFIRMED as reasoned; the characterization is CONFIRMED-INACCURATE.**
ODQ §241.5b says *"5 of which drop the reroll salt — LATENT, not active."* **One of the five is
ACTIVE**; it is merely unexercised by the corpus. Four are latent.

**DOUBTS.**
30. ⚠⚠ The distinction matters because "latent" was the whole justification for deferring under
    the freeze. A defect that is *active but unexercised by the fixture set* is a different risk
    class — it ships broken for any world whose coast has no shore contour. Neither receipt hides
    it; the ledger row compressed it away.
31. ⚠⚠ **The deferral's cost was measured one row later and it was large.** §255 shows the
    equivalent key-spelling cure (`meander`) accounted for **+47 of the +51** waterViolations move
    and was mis-attributed to the wall. `laneMFW1-receipt.md:144-146` banks the class:
    *"A KEY-SPELLING CURE IS ALWAYS A SAME-SEED SHIFT EVEN WHEN THE DEFECT IT CURES IS LATENT."*
    MF-ARCH froze the keys **precisely because** it read them as latent, and MF-ARCH-2 then cured
    them and could not attribute the result. The chair should weigh whether "defer the latent
    cure" is the right general rule given it cost one full characterization lane.
32. ⚠ The exact ratchet is real and re-frozen (`laneMFARCH-receipt.md:480-482`;
    `laneMFARCH2-receipt.md:352-356`), but `substrate.js`'s **second spelling of the salt (4
    sites) is still open** and is the same class — recorded at `laneMFW1-receipt.md:331-334` as the
    next instance of the same mis-attribution trap.

## (d) The MF-ARCH-2 mandate ordering (epoch axis before the handed-off items)

**EVIDENCE.** `laneMFARCH-receipt.md:558-563`: *"THE FOUR THINGS TO DO FIRST, IN THIS ORDER.
1. ⭐⭐⭐ RULE ON THE VERSION-INDEXED PIPELINE (§2.4). It dissolves all eight cycles, deletes the
need for `wallCycle.js`'s solver … **Everything else in this list is cheaper after it, and some of
it becomes free.**"* ODQ §241.6 transcribes this faithfully.

**STATUS: CONFIRMED — and vindicated by outcome.** `laneMFARCH2-receipt.md:127-134` shows the
"cheaper after it" claim paying off literally: *"`lateGround.js` (43 effective lines) exists only
because of the rename … `buildFabric.js` came down from 801 to 790 effective lines — which is the
margin the epoch work then spent."*

**DOUBTS.**
33. ⚠ The prediction "some of it becomes free" was right for the *naming* half and wrong for the
    whole: the epoch axis consumed the wave and item 5 was handed off untouched for the **second**
    consecutive time (`laneMFARCH2-receipt.md:534-539`). The ordering was correct; the estimate
    that items 5-7 would follow in the same wave was not.

---

# §252 · MF-ARCH-2 COLLECTED

## (a) Holding the metropolis third-circuit cap until the run-chain lands

**EVIDENCE.** `laneMFARCH2-receipt.md:192-198`: the ladder computes three metropolis thresholds
(0.585 / 0.797 / 0.972) and the cap withholds the middle; two measured reasons are given (op
ceiling headroom, and a new visible ring is a FEATURE under the freeze). ODQ §252.3a adds the
binding reason: *"§251.4b binds: three rings without run typing come out CONCENTRIC."*

**STATUS: CONFIRMED, and the reason is STRONGER than the row states — I found independent
corroboration from two directions.**
- **From the corpus:** the corpus's own three-circuit plates were *cured* for exactly this defect.
  `laneHF-CALIBRATION.md:330` on hf347 — *"**DEFECT, DECISIVE: all three circuits are near-perfect
  CONCENTRIC OVALS — the ring prior at its most complete**, on the one subject where wall shape
  matters most … Cured in wave M by hf385."* And hf385 (`:376`) — *"three circuits, none of them a
  ring, none concentric with any other, and all three of visibly different shape."*
- **From the build:** the concentricity is not merely a *risk* of adding a third ring — it is
  **architecturally present today**. Every epoch window is `shrinkAbout(ring, ringCentroid(ring),
  extent)` (`builtUmbrella.js:324`) — a homothety of today's outline about **one centre shared by
  all epochs**. `MORPHOLOGY-CONTEXT.md:2085` names the corpus property that this cannot produce:
  *"hf385's three circuits are non-concentric **with a migrating centre**; §240 will produce nested
  rings unless CX-13 lands with it. **§240 and CX-13 are one piece of work, not two.**"*

**DOUBTS.**
34. ⚠⚠ **The concentricity problem is not deferred by capping at two — it is already shipping.**
    Four leaves carry two circuits today, and both are homothetic about one centroid. Holding the
    third circuit is right; it does not address the two that are drawn. The chair may want to note
    that §251.4b's condition applies to the *existing* two-ring leaves as well.
35. ⚠ **The headroom figure in the code disagrees with the ledger.** `epochAxis.js:50-51` says
    *"the §217 metropolis op ceiling stands at 9,700 with **78** primitives of headroom"*; the
    receipt (`:195-196`) and ODQ §252.3a say **83**. 78 is MF-ARCH's pre-wave figure
    (`laneMFARCH2-receipt.md:446-447`: *"metropolis 78→83"*). The code comment is stale in the
    module that justifies the cap. Small, but the ruling rests on that number.

## (b) Ordering characterization of waterViolations before landing

**EVIDENCE.** `laneMFARCH2-receipt.md:523-528`: *"⛔⛔ `waterViolations` RISING BY 51 IS THE ONE
FIGURE IN THIS RECEIPT THAT LOOKS LIKE A REGRESSION AND I HAVE NOT CHARACTERIZED IT … **the wall
pulling inward pushed fabric — and with it street channels — into ground near the water**."*
Listed as unfinished at `:543` and as wave-nine item 2 at `:586`.

**STATUS: CONFIRMED as the right call, and the outcome proves it decisively.** The
characterization lane refuted the wave's own stated cause (see §255(b)) and found a real
pre-existing defect. Had it been accepted as reporting-only, both would have shipped unexamined.
This is the highest-yield process ruling in my cluster.

**DOUBTS.** None material. One note:
36. ⚠ ODQ §252.3b's phrase *"no pinned law moved"* is correct but incomplete: `zoneOffBand` also
    moved the wrong way (54 → 63, `laneMFARCH2-receipt.md:517`) and was not ordered characterized.
    It is small and MF-W1 re-measured it (`laneMFW1-receipt.md:231`), but the row singles out one
    wrong-way figure when there were two.

## (c) The chair's own forensic-zoom verdict on the arch2 town

**EVIDENCE — I read `mf-proto-out/arch2/TE-zoom-arch2-owner.png` (900×900) and a 3× crop of the
river/precinct band (source rect x 560-940, y 560-860).**

What the pixels show, item by item against the chair's verdict:
- **"no violations visible" — CORROBORATED where I could test it.** The heavy black circuit crosses
  the upper-left through **open field only**; it does not touch fabric anywhere in the crop, and
  there is a broad unbuilt band between it and the first block rows (cause 97, the outer ring
  pulling in, is plainly visible). In the 3× river crop, buildings stand clear of the blue water
  band; **no body overlaps the water** in that region.
- **"burgage frontage rows are working" — CORROBORATED.** Continuous frontage lines with plots
  running back are legible in several blocks.
- **"streets read as continuous channels" — CORROBORATED.** The pale street web is unbroken; no
  severed segments visible.
- **"the government precinct … legible" — CORROBORATED.** The pale polygon labelled GOVERNMENT
  QUARTER at bottom-centre is a distinct open precinct with its own boundary.
- **"river crossings are legible" — PARTIALLY.** I can find **one** bridge mark (ladder hatching,
  ≈ x 280-310, y 720-760). The plural is not supported by this crop.
- **"several blocks' parallel building bars read MECHANICALLY" — CONFIRMED, and UNDERSTATED.**
  This is the most conspicuous defect in the image. At ≈ x 600-760 / y 380-500 there is a run of
  ~8 near-identical grey bars, same width, same depth, evenly spaced, all parallel — a comb. The
  same picket pattern repeats at ≈ x 330-450 / y 440-520, ≈ x 60-190 / y 660-780, and
  ≈ x 630-780 / y 200-300. At 3× it is unmistakable. "Several blocks" is a majority of the blocks
  in frame.
- **"the COUNTRYSIDE REMAINS THE WEAKEST SURFACE" — CONFIRMED, emphatically.** The top-left third
  of the plate is near-empty: flat olive/tan wash, a few contour squiggles, one dashed track. No
  field boundaries, hedges, farm structures or orchards.

**STATUS: CONFIRMED overall — the chair looked, and what the chair reported matches the plate.**
Both honest notes are real; one is understated.

**DOUBTS.**
37. ⚠⚠ **"No violations visible" is in tension with the census the same session published.** The
    town leaf carries **13** water violations at this tip — 9 street + 4 body
    (`laneMFW1-receipt.md:93`, executed). The verdict is a statement about what was *seen*, not
    about what is *there*, and at this scale a body 2 units into a claim is sub-pixel. Ratify the
    zoom as a **legibility** verdict, not a legality one — the same caveat as §238(c).
38. ⚠ **The two zoom crops are not comparable across waves.** The b8b ownerview and the arch2
    owner zoom show different river geometry and different label placement (GOVERNMENT QUARTER
    moves from top-right to bottom-centre). That is expected — cause 101 re-rolled the river and
    the wall pulled in — but it means the arch2 zoom is **not** a before/after of the b8b one, and
    nothing in the ledger says so.
39. ⚠ **One of thirty-two plates was viewed.** `laneMFARCH2-receipt.md:553-558` states the gap as
    *"ten leaves' walls have moved shape and the ditch has changed ring … nobody has looked."* The
    chair closed it for the town. `laneMFSPEC-receipt.md:351-353` still carries *"DID NOT VIEW
    MF-ARCH-2's 32 PLATES … Ten walled leaves' walls changed shape and nobody has looked"* as W0's
    first exit criterion, and `GENERATION-SPEC.md` records the same. **The metropolis — the leaf
    whose absorbed intermediate ring and third-circuit cap §252.3a rules on — was not viewed.**

## (d) The containment-resolution law as a general principle

**EVIDENCE.** `laneMFARCH2-receipt.md:225-231` is a four-row table of executed failures, each with
its class: radial max (⛔ 251 view units on a 392-unit city), local vertex push (⛔ 141 of 15,168),
offender-direction edge push (⛔ 33 points), bisector push (⛔ 1-2 per ring on four leaves), then
the cure at 0. The law: `:235-241` — *"A CONTAINMENT CLAIM MUST BE MADE AT THE RESOLUTION THE
BOUNDARY IS ALLOWED TO HAVE. A 20-facet stone curtain **cannot** contain a 2,300-point outline
exactly … the chord across a bay is the LAW, not an artifact."* The code is
`epochAxis.js:201-237` (`boundEpoch`) + `translateEdgesOut` (`:280-321`).

**STATUS: CONFIRMED as a well-evidenced law.** Four measured wrong answers before the right one is
exactly the standard of evidence this program asks for, and the law generalizes cleanly.

**DOUBTS — the "0 of 15,176" that the law is sold on has more slack than the row admits.**
40. ⚠⚠⚠ **The body-level pin stacks three relaxations, all disclosed in code comments, none in the
    ledger.** I read `tests/domain/townMapWallCircuit.test.js:499-527`:
    ```js
    const c = polyCentroid(b.poly);                       // (iii) POINT predicate
    …
    const held = node.rings.some((r) => r.epoch >= idx     // (i) own circuit OR ANY LATER ONE
      && (pointIn(r.polygon, c[0], c[1])
       || (r.halfRing && pointIn(r.closedPolygon, c[0], c[1]))));   // (ii) water-flank exemption
    ```
    (i) is J-A2-6, disclosed, with a **measured counter-instance**: *"one market solid sits 15
    units inside epoch 0's hull and 2.5 units outside epoch 0's ring"* (`laneMFARCH2-receipt.md:
    304-305`) — i.e. there **is** a body outside its own epoch's ring, and the pin passes it.
    (ii) admits a body outside every *drawn* circuit if it lies inside a hypothetical closed one.
    (iii) is a **centroid point-test** — the §238 blind-predicate shape, in the wave whose own law
    is *"a containment proved at the vertices is not a containment of the polygon"* (`:228`).
41. ⚠⚠ **The §240.1 "0 on every ring" pin's independent arm is vacuous on the majority of walled
    leaves.** Same file, `:494`:
    ```js
    for (const p of r.epochHull) if (!pointIn(r.polygon, p[0], p[1]) && !r.halfRing) out++;
    ```
    `out` can never increment on a half-ring, and `halfRing = water.mode === 'bankside' &&
    water.line != null` (`walls.js:298`) — the whole river family. That is **6 of 10 walled
    leaves**. The test's own comment claims this arm exists *"so the claim is not self-reported
    only"*; on those six leaves it is exactly self-reported. (The derivation's own
    `containmentResidual` still fires there and is measured against `closedPolygon`, which is the
    stated rule — so this is a pin-vacuity finding, not a live defect.)
42. ⚠⚠ **"The 6.8% went to ZERO" compares across a redefined denominator.** MF-ARCH: 1,331 of
    **19,563**. MF-ARCH-2: 0 of **15,176 epoch members** — a set that excludes the 4,607 suburb
    bodies. Total bodies are 19,783 (I summed `laneMFARCH2-receipt.md:282-293`: members 15,176 +
    suburb 4,607 = 19,783 ✓, internally consistent). The receipt defends the definition well
    (`:297-301`, guarding against the self-referential class by keying membership to the **hull**,
    one step before the ring). But 1,331/19,563 → 0/15,176 is not one census asked twice.
43. ⚠ `boundEpoch`'s docstring describes the **rejected** design as if shipped: *"SO IT IS LOCAL,
    ONE-SHOT and bounded by the pull that caused it"* (`epochAxis.js:192-195`) while the code runs
    STEP 1 **plus** up to `BOUND_ROUNDS = 6` outward sweeps. And `:314`'s
    `Math.max(0.2, bx*m[0]+by*m[1])` clamps the cosine, so the translation the comment calls
    *"exact"* (`:303`) undershoots at corners sharper than ≈78°. Both are absorbed by the sweep and
    the pinned residual — but this is the wave's own banked class (*"a function whose name
    describes its callers' belief rather than its code"*, `:703-705`) reappearing in its own new
    module.

---

# §255 · THE WATER CHARACTERIZATION

I re-derived this row's arithmetic from the lane's **own captured logs**, not from the receipt.

```
MFW1-water-arch.log   CORPUS crossings=141 exempt=27 violations=114 | street 115/25/90 | body 26/2/24 | bridges=20
MFW1-water-arch2.log  CORPUS crossings=193 exempt=28 violations=165 | street 135/8/127 | body 58/20/38 | bridges=15
MFW1-water-cf1.log    CORPUS crossings=147 exempt=29 violations=118   (everything-else, meander reverted)
MFW1-water-cf2.log    CORPUS crossings=199 exempt=21 violations=178   (meander only)
MFW1-water-cf3.log    CORPUS crossings=193 exempt=34 violations=159   (the mill cure)
```
All five carry `spyDisagreements=0`.

## (a) The not-a-regression verdict and its 2×2 decomposition

**EVIDENCE.** The 2×2 is at `laneMFW1-receipt.md:60-64`: blind/old **100**, cured/old **114**,
blind/new **153**, cured/new **165**. ODQ §255.3 transcribes it correctly. The distributional arm
is `MFW1-corpus-spread-{base,tip}.log`, which I read in full:
```
base  distinct-site 55,50,82,88,36,68   mean=63.2 sd=18.1   corpus mean=132.0 sd=39.9
tip   distinct-site 63,47,85,90,39,64   mean=64.7 sd=18.4   corpus mean=143.5 sd=26.0
```
The one-town sweep is `:192-193` — base variants 0-5 `3,8,20,3,6,10`; tip variants 0-11
`13,13,15,2,11,8,6,9,11,0,12,0`. **I recomputed both:** base mean = 50/6 = 8.333, population
sd = 5.79; tip mean = 100/12 = 8.333, population sd = 5.01. The identical means are real.

**STATUS: the 2×2 is CONFIRMED (I re-derived every cell from the logs). The verdict "not a
regression" is CONFIRMED as *not disproved*. The stronger claim in the ledger is NOT supported.**

**DOUBTS — one of these is an outright arithmetic error.**
44. ⛔⛔ **ODQ §255.1's decomposition cannot be right: +47 and −13 are from DIFFERENT orderings and
    sum to +34, not +51.** From the logs: 114 → cf2 178 = **+64** (meander first), then 178 → 165 =
    **−13** (everything else, in the new river). Alternatively 114 → cf1 118 = **+4** (everything
    else first), then 118 → 165 = **+47** (meander, in the changed world). The receipt states this
    correctly at `:20` — *"the two orderings … +64/−13 and +4/+47, both totalling +51"* — and
    `:131` names the reason: **`interaction −17`**. **ODQ §255.1 pairs `+47` with `−13`** and then
    asserts *"Both orderings of the executed 2×2 close on +51 exactly."* The two halves it quotes
    close on +34. The row's headline decomposition is arithmetically impossible as written, and the
    interaction term is dropped entirely.
45. ⚠⚠ **ODQ §255.1's sd figures are attached to the wrong quantities.** The row says *"the corpus
    distinct-site mean moved 63.2 → 64.7 against sd ≈18 — the published figures are −1.1 sd and
    +0.9 sd draws."* −1.1/+0.9 are the **one-river-town** figures (3 and 13). The published
    *corpus* figures are **−0.45 sd → +0.83 sd** (`:208-209`; I verified: (114−132.0)/39.9 = −0.45,
    (165−143.5)/26.0 = +0.83). And the distinct-site z-scores of the published draws are −0.45 and
    **−0.09**, neither of which is +0.9. Three quantities are conflated in one sentence.
    (Minor: the receipt's own "−1.1 sd" divides the base draw by the **tip's** sd 5.0; against its
    own sd 5.8 it is −0.91.)
46. ⚠⚠ **"Distributionally the wave changed NOTHING" is over-powered for n=6.** SE of each corpus
    mean is 39.9/√6 = 16.3 and 26.0/√6 = 10.6; combined SE ≈ 19.4 on an observed difference of
    11.5. **A real corpus-level shift of up to ~+38 violations would be undetectable by this
    sweep.** The observed published move (+51) sits inside that window. The correct statement is
    "consistent with noise," not "changed nothing." The receipt is honest — `:348-350`,
    *"THE REROLL SWEEPS ARE 6–12 VARIANTS, NOT A SOAK … not a distributional characterization"* —
    and J-W1-4 (`:373-377`) states the verdict as *"MF-ARCH-2 introduced none of this", not "there
    is nothing here"*. **The ledger row lost that hedge.**
47. ⚠ Base n=6 vs tip n=12 is an unbalanced comparison; the identical means to 3 s.f. are a
    coincidence of 50/6 and 100/12 and should not be read as a precision result.

## (b) The refutation of MF-ARCH-2's stated cause, and the law that a wave's attribution can be wrong

**EVIDENCE — this is the row's strongest leg.** `laneMFW1-receipt.md:97` (executed, per-leaf):
```
year-018    ⭐ 0 rings  river | 3 → 13  +10 | STREET 5/3/2 → 10/1/9 | BODY 1/0/1 → 7/3/4
```
identical in every column to the five walled river leaves, and `:108-111`: *"THE `year-018` ROW IS
THE PROOF. It carries **zero circuits** … and it moved by **+10 with the SAME NINE ADDED AND SAME
TWO GONE violation keys** as the five walled leaves. A cause that requires a wall cannot produce
that row."* Corroborated independently by the centreline witness at `:148-151`: *"`⛔ LINE MOVED`
on town/siege/plague/famine/year-018/year-100/highwater; `LINE IDENTICAL` on city/migration/fjord."*

**STATUS: CONFIRMED. The refutation is clean and the control is exactly the right shape** — an
unwalled leaf inside the corpus that a wall hypothesis cannot explain, plus a byte-identical key
set that rules out coincidence. J-W1-5's framing (`:378-382`) — *"the wave's most visible change is
not the default explanation for its most surprising number"* — is a genuine banked law.

**DOUBTS.**
48. ⚠⚠ **ODQ §255.2's second sentence commits the very error the row bans.** It says *"isolating
    the wall work on the two leaves the meander key cannot reach gives −7 each."* That −7 is the
    **cf1 column** (`:100-101`, 44 → 37), and cf1 is *"everything else"* — the epoch axis, the
    containment closure, the ditch move, per-epoch RNG **and four other fork-key changes**. The
    receipt says so explicitly at `:351-354`: *"I DID NOT AUDIT THE OTHER FOUR FORK-KEY CHANGES
    INDIVIDUALLY … That residual is +3 on `year-018`, which has no wall — **so on the town family
    the wall's own contribution is 0**, and the +3 belongs to those four keys, not to the circuit."*
    Attributing −7 to "the wall work" is narrative, not isolation — in the row that banks
    *"attribution requires ISOLATION, not narrative."*
49. ⚠ The "16% improvement" (7/44) is computed on the coastal pair only — two leaves that are one
    world (§255.5c).

## (c) Ratifying the lane's restraint in not landing a measured, working cure

**EVIDENCE.** The defect: `laneMFW1-receipt.md:269` quotes the source line —
```js
const marine = /port|quay|mill|ferry|bridge|dock|wharf/i.test(String(lm.archetype || lm.anchorKey || ''));
```
and `:271-276` measures it: *"`inst.name.mill#0#0` carries `archetype = "extraction"`, `anchorKey =
"name:mill"`, `rooted = true`. The `||` short-circuits on the truthy archetype, so **`anchorKey` is
unreachable for every landmark that has an archetype — which is all of them**."*
The cure is measured, and **I confirmed it from the log**: `MFW1-water-cf3.log` gives
`crossings=193 exempt=34 violations=159` — crossings unchanged, exempt +6, violations **165 → 159**,
street arm 127 unchanged. `:295-296` records all four render SHAs byte-identical.
The three reasons for not landing are at `:299-306`.

**STATUS: CONFIRMED (cure measured; restraint reasoned).** The three reasons are sound and the
strongest is the consistency one: two prior lanes refused exemption-widening under the same freeze
(`laneMFARCH-receipt.md:367-371` on the §205A subject set; J-ARCH-7 `:614-615`), and a third lane
quietly taking the opposite decision would break that.

**DOUBTS.**
50. ⚠ The "fifth vintage of these numbers" argument is the weakest of the three: the cure moves one
    figure by −6 with zero pixels, and the lane was already publishing an authoritative set it
    could have published with the cure in it. The consistency argument carries the ruling; the
    vintage argument is presentational.
51. ⚠ **The restraint has a cost the row does not price.** `laneMFSPEC-receipt.md:486-488` states
    it: *"until it lands, 72% of one census's convictions cannot be forgiven by any correct output,
    **which means the figure is not yet a grading surface**."* The `waterViolations` 165 that
    §255.5b adopts as authoritative is, on the lane's own reasoning, not gradeable. Both are true;
    the ledger adopts the figure without carrying that sentence.

## (d) The exemplar-set independence caveat and its retroactive effect

**EVIDENCE — CONFIRMED BY ME from the primary fixture, which the spec lane explicitly asked
someone to do.** `laneMFSPEC-receipt.md:346-350`: *"Nor did I re-check its claim that the exemplar
seeds collide 7/2 — that is a `find`-able fact about the fixture set and a builder should confirm
it once before spending §0.3b's rule on it."* I read `laneMFARCH2-tip/harness/exemplars.mjs`:
```
seed 'mf-town-01' + terrain 'riverside' : town(:20) highwater(:24) siege(:34) plague(:35)
                                          famine(:36) year-018(:40) year-100(:47)   = SEVEN
seed 'mf-city-01' + terrain 'coastal'   : city(:21) migration(:37)                  = TWO
```
**The 7/2 claim is exact.** The seven are seven *states* of one world (highwater `demote: true`;
siege/plague/famine carry `stressors`; year-018/year-100 carry `year`), which is why six of them
moved by an identical +10 with byte-identical key sets — the stressors do not touch the river.
**That ask is now discharged.**

**EVIDENCE of the retroactive effect, measured.** I applied the caveat to §241's headline using
`MFARCH-epoch.log` (executed):
```
town 169 | siege 118 | plague 170 | famine 169 | year-100 169 | highwater 51   = 846  (ONE seed)
city  70 | migration 70                                                        = 140  (ONE seed)
polycentric 310 | metropolis 35
⇒ 1331 of 19563 (6.8%)
```
**846 of the 1,331 bodies (64%) come from one seed counted six times; 140 more from a second seed
counted twice.** The corpus figure is four distinct worlds wearing ten names.

**STATUS: CONFIRMED, and the retroactive reach is wider than §255.5c states.**

**DOUBTS.**
52. ⚠⚠ §255.5c says *"every 'corpus-wide' exemplar figure we have quoted is a few settlements
    multiplied."* That is right, and it lands on §241.3's **6.8% / 1,331 of 19,563** and §252.1's
    **0 of 15,176** — both quoted in this cluster as headline evidence, neither carrying the
    caveat. §257.4 promoted the caveat to a binding usage rule for the *spec*; nothing carried it
    back into §241 or §252.
53. ⚠ **But do not over-correct.** The §241 finding is an argument about the **derivation**
    (`circuitBody: inverted.circuitRing` consumes the whole town's umbrella) and is provable from a
    single leaf. Seed replication inflates the *magnitude* and leaves the *conviction* untouched.
    The chair should discount the numbers, not the finding.
54. ⚠ The caveat's own scope is the exemplar set, not the 313-plate corpus. Two different
    "corpora" are in play in this cluster and §255.5c's wording ("the corpus distinct-site mean")
    could be read as the plate corpus. It is the 16-leaf fixture set.

---

# §257 · THE GENERATION SPECIFICATION

## (a) Q-2's ruling that epochs are FABRIC epochs, not circuit epochs

**EVIDENCE — the defect is real and I verified it three ways.**
1. *In the build:* `epochAxis.js:96-102` — `if (!a.hasWalls)` returns
   `epochs: [{ index: 0, kind: 'core', extent: 1, walled: false }]` — literally **one epoch** for
   every unwalled leaf. `laneMFARCH2-receipt.md:190` confirms it for six leaves.
2. *In the corpus:* `MORPHOLOGY-PLAN.md:379-385` measures **fabric** epochs at village **1-2**,
   town 2-3, city 2-4, metropolis 3-4 — with `[E, CONFIRMED]` and the counting method stated
   (*"by grain change, bearing change, plot-width change, or a fossil boundary"*).
3. *The settling experiment the lane named, RUN BY ME.* `laneMFSPEC-receipt.md:473-476` labelled
   Q-2's genuineness **PLAUSIBLE** and named the experiment: *"grep §150–§253 for a fabric-epoch
   derivation independent of circuits."* I ran it over `docs/OWNER_DECISION_QUEUE.md`. Every
   pre-§257 epoch hit is either §240/§241/§252 (circuit-based) or the unrelated product
   `advanceEpoch` feature flag (§197/§213). **No fabric-epoch derivation exists anywhere in
   §150-§253.** Q-2 is a genuine hole.

**STATUS: CONFIRMED — Q-2's genuineness moves from PLAUSIBLE to CONFIRMED, and the ruling's
direction is right.** It was independently re-validated downstream at §266.2a
(`docs/OWNER_DECISION_QUEUE.md:10094-10098`): *"unfolded, W4 would have built per-epoch machinery
and then discovered half the tier ladder could not use it."*

**DOUBTS.**
55. ⚠⚠ **The chair ruled the question the lane deliberately refused to answer, and did not supply
    the thing that made it refusable.** `laneMFSPEC-receipt.md:143-145`: *"I did not propose the
    fix, deliberately: minting epochs from population growth is a KNOB unless it is derived, and
    §240.2's 'ring count is DERIVED, never a knob' is the binding condition any answer must
    satisfy."* §257.3(a) declares epochs are fabric epochs but names no derivation. The spec's
    fold does gesture at one — `GENERATION-SPEC.md:790-795`: *"founding age, promotion events,
    prosperity history and recorded growth … The ≤4-epoch measured ceiling (PLAN §6.1) binds"* —
    which is the §240.2 fact family reused. **That is a direction, not a derivation**, and the
    knob risk the lane named is not yet closed. Ratify the *ruling*; do not treat the binding
    condition as satisfied.
56. ⚠⚠ **The ruling's magnitude is understated (see §240(c), doubt 22).** "Six of sixteen leaves
    cannot express a vintage" is the epoch-*count* consequence. By the grep, **no leaf can express
    the vintage triad**, because no grain/parcel/pigment module reads the epoch at all. G-42's
    scope should be sized against sixteen, not six.
57. ⚠ §257.3(a) says the ruling *"does NOT revise the owner's §240 law."* True as stated — but it
    does strand §240.2's ceilings, which were justified by PLAN §6.1's **fabric**-epoch table
    (`MORPHOLOGY-PLAN.md:387`, *"directly corroborates"*). Once the two are separated, that
    corroboration evaporates and the circuit ceilings are left with n=1 (hf347) — a plate the
    corpus labels a **town** (doubt 17). §240.2 needs a re-derivation the ruling does not order.

## (b) Q-1 — allowing a withdrawn grading target to remain a generation input

**EVIDENCE.** `laneMFSPEC-receipt.md:94-101` (C-3) and `:120-125` (Q-1). The ruling as landed is
`GENERATION-SPEC.md:12148-12154`, which quotes §257.3(b) verbatim and folds it into C-3/G-33/W0:
*"The rungs KEEP their numbers, are labelled `UNVALIDATED-BY-INSTRUMENT` in the code … and no
grading verdict may be issued against them."*

**STATUS: CONFIRMED as reasoned, and it takes the lane's own recommendation
(`:125`: "keep-labelled now, roof-count queued") — so it is a ratification, not a fresh call.**
The distinction it rests on (withdrawal for *measurement invalidity* ≠ withdrawal of a
*generation* target) is sound and the alternative is worse: `GENERATION-SPEC.md:12134-12135` —
*"Deleting them leaves `cells(pop)` **undefined below village**; replacing them with new numbers
would be tuning wearing measurement's clothes."*

**DOUBTS.**
58. ⚠ **I could not source the parenthetical "(it counts hedges as buildings)."** §257.3(b) gives
    that as the reason the instrument is invalid at low tiers. The receipt says only *"the
    instrument that produced them is invalid at those tiers"* (`GENERATION-SPEC.md:12128`). The
    mechanism may be recorded in `laneHFM1-receipt.md`/§244.5 (outside my rows), but as quoted in
    §257 it is unsourced. Worth a one-line check before it hardens into the code comment.
59. ⚠ **The label is a promise, not machinery.** "Labelled `UNVALIDATED-BY-INSTRUMENT` in the
    code" and "no grading verdict may be issued" are conventions with no walker behind them. The
    program's own §3.3 non-negotiables and the structural-prevention habit would ask for a check
    that reds if a verdict is issued at those rungs. Nothing does today.
60. ⚠ The rungs are not inert. `GENERATION-SPEC.md:12130-12131`: *"`GRAIN_SEAMS` begins
    `8 → 16 → 28 → …`, so **the withdrawn rungs shape the curve at village tier as well**."* The
    ruling scopes the withdrawal to thorp/hamlet; the numbers reach a tier that is not withdrawn.

## (c) Q-3's new derived-vs-drawn grain census

**EVIDENCE.** `laneMFSPEC-receipt.md:147-157` states the ambiguity and the metropolis case
(derivation ≈113 cells, plate measures **70**, ~38% loss) and MF-B8's named mechanism
(*"the grain instrument measures what RESOLVES, not what EXISTS"* — b7's town carried 82 plot
modules and counted 24.8). The ruling as landed is `GENERATION-SPEC.md:12211-12218`, which upholds
the spec's own PLAUSIBLE reading (b) and adds the order: *"a new census is required — DERIVED
GRAIN AND DRAWN GRAIN MUST AGREE WITHIN A STATED TOLERANCE … Reading (a) is therefore closed: the
derivation may NOT be inflated to compensate for a drawing loss."*

**STATUS: CONFIRMED as reasoned.** The ruling converts an ambiguity into a measurable and closes
the option that would have hidden a defect behind a number — the correct direction, and consistent
with §244.4/§250.6b's anti-overfit doctrine (a statistic may be a census and forbidden as a
generator input).

**DOUBTS.**
61. ⚠ **The tolerance is unspecified, and it is where the whole ruling lives.** "Within a stated
    tolerance" with no number means the census cannot be written. At the current ~38% metropolis
    loss, any honest tolerance either reds immediately (making it a blocking census on a known
    defect) or is set to accommodate 38% (making it vacuous). The ruling should carry a decision
    about which, or the census will be written to pass.
62. ⚠ The ruling upholds a reading the spec itself labelled **PLAUSIBLE** (`:466-470`, item 2:
    *"My reading of Q-3 … Reasoned from MF-B8's own runprobe finding; **not ruled**"*). Ratifying
    a PLAUSIBLE reading is fine when the alternative is worse — but the chair should note the
    evidentiary grade: this rests on one mechanism (b7's town, 82 modules → 24.8 counted) and one
    tier's miss.
63. ⚠ C-2 (the built `GRAIN_BAND` metropolis rung stale at 100-130 vs corrected 80-120,
    `:86-92`) interacts with Q-3: the metropolis derives ≈113 against a corrected target of 80-120
    while drawing 70. Correcting the band **shrinks a reported miss for a real reason** (the
    receipt says so) and simultaneously makes the derived-vs-drawn gap the only remaining problem.
    Both rulings are right; they should land together or the second will look like it fixed the
    first.

## (d) The chair's same-turn atlas fix, and the class that a ruling made after a fold does not reach the folded document

**EVIDENCE — the fix landed, and I verified it in the atlas.**
`laneMFS1-urbanism-atlas.md:924` now records the sensitivity and marks it ruled; `:926` carries the
ruling in full: *"✅ **THE CHAIR'S RULING (§249.4a, and it is the binding figure): PAPER WARMTH
PINS AT 37, centroid `#F9E9D5`.** … ⚠ Where this document still prints **34** below (the §244-FOLD
paper rows and the §2.9 correction ledger), read **37 / `#F9E9D5`** — those rows were written
before the ruling and are superseded by it."*
ODQ §257.2's description — *"The atlas now states the ruling, prints the reasoning beneath it, and
marks the superseded rows"* — is **accurate**.

**STATUS: CONFIRMED (I read the atlas).** The class is also independently re-confirmed one row
later: §266.2a found the identical failure inside the spec itself — three of six chair questions
already ruled at §257.3 and still presented as open. The class is real and recurrent.

**DOUBTS.**
64. ⚠⚠ **The fix is a preamble note; the operative rows still print the refuted number — including
    the one the atlas itself calls authoritative.** `laneMFS1-urbanism-atlas.md:1240` (the §2.9
    correction ledger):
    > *"§2.3.1 **role table** | Paper `#F7E1C8–#FEF9ED (L 222–244)` … re-pinned to **`#FAEBD8`** /
    > L 226–244 / warmth 20–50 … — **the role table is what a renderer actually reads, so it had to
    > carry the corrected values too**"*

    Four rows still carry `#FAEBD8` / warmth **34** as the target: `:936`, `:968`, `:1106`,
    `:1234`, plus `:1240`. A renderer or re-deriver that goes to the role table — which the atlas
    says is the thing renderers read — gets **34**, not 37. The blanket "read 37 below" note at
    `:926` is exactly the kind of indirection the address-rot class is about. **The class was
    named and the cure was applied one level too high.**
65. ⚠ The atlas's own §244-FOLD text argues **against** 37 on the merits (`:937`: *"THE TARGET
    BARELY MOVED — MF-S1's centroid #FBEBD6 measures L237.4 / warmth 37 and the re-pinned one
    L237.3 / warmth 34, **identical within noise**"*). The ruling is defensible on the
    register-index argument (`:926`), but the document now carries a live disagreement with itself
    on the same page. If the chair ratifies §249.4a's warmth ruling, the fold should also strike or
    re-word `:937`.
66. ⚠ **ODQ §257.2's opening is wrong on a count.** It says *"FOUR SOURCE CONFLICTS **RULED BY THE
    LANE**"*. The lane ruled **three** (C-1, C-2, C-4). C-3 was deliberately **not** ruled and was
    escalated as Q-1 — J-SPEC-3 (`laneMFSPEC-receipt.md:378-380`): *"I DID NOT RULE C-3 AND MADE IT
    Q-1 INSTEAD … deciding it either way inside a synthesis lane would install a number nobody
    measured."* The row then rules it itself at §257.3(b). The escalation is the lane's best
    judgment call in the row and the ledger erases it.
67. ⚠ §257.1's *"3,187 lines"* is not re-derivable: `map-corpus/docs/GENERATION-SPEC.md` is now
    12,362 lines / 890 KB (it has absorbed later folds). The §257-era artifact survives only as
    `GENERATION-SPEC.pre-rerank.bak` (3,784 lines / 306 KB, Aug 17 05:33 — already post-§257).
    Also the receipt disagrees with itself on size: `:14` says 248 KB, J-SPEC-10 (`:414`) says
    239 KB. Not load-bearing, but a re-deriver will not reproduce 3,187.

---

# RANKED DISCREPANCIES — sharpest first

**Tier 1 — factual errors in the ledger rows themselves.**

1. **§255.1's headline decomposition is arithmetically impossible.** `+47` and `−13` come from
   different orderings of the 2×2 and sum to **+34**, not +51. The valid pairs are (+64, −13) and
   (+4, +47); the interaction term (**−17**, `laneMFW1-receipt.md:131`) is dropped. **CONFIRMED by
   me from the lane's own executed logs** (114 / 118 / 178 / 165). The receipt is correct; the
   ledger row is not.
2. **§240.3's vintage triad is not delivered, and cannot be by this build.** The token `epoch`
   appears in **zero** of `parcels.js`, `morphology.js`, `organisms.js`, `tierGrammar.js` —
   only in the five wall/circuit modules. Grain, plot variance, roof pigment and density are
   epoch-blind. §266.2a's "six of sixteen leaves" understates it: for the *triad* it is sixteen of
   sixteen. **CONFIRMED by grep of the built tree.**
3. **§240.2's tier ceilings match neither the build nor the corpus.** Built
   `TIER_CIRCUIT_CAP = {thorp:1, hamlet:1, village:1, town:1, city:2, metropolis:2}` — village is
   **1** not 0, metropolis **2** not 3, and thorp/hamlet get 1 with no disclosure anywhere. And
   the corpus's **only two three-circuit plates, hf347 and hf385, are both labelled TOWNS**
   (`laneHF-CALIBRATION.md:330, :376`; `MORPHOLOGY-PLAN.md:116`) — while `MORPHOLOGY-PLAN.md:387`
   cites hf347 as *"directly corroborat[ing]"* a rule that gives a town one circuit.
   **CONFIRMED by reading the code and the corpus documents.**
4. **§241 carries two irreconcilable values for the same census in one row.** §241.4 quotes the
   audit (`MFARCH-predaudit.txt:34`: **444 → 251** over 20,857, 211+18=229 disagreements); §241.5c
   quotes the published census (**444 → 258**). No receipt reconciles the 7-body gap. Worse, the
   *"over-reported by 72%"* in §241.4 is computed against **258** (444/258 = +72.1%), not against
   the 251 quoted in the same sentence (444/251 = +76.9%).
5. **§255.4's cause enumeration sums to the wrong total.** *"92 of 127 … — 72 from that mismatch,
   20 because bridges refuse `rank==='passage'`, 35 because only the first crossing per channel is
   taken"* — 72+20+35 = **127**, not 92. The metric is A+B only (20+72=92), which the receipt's own
   MF-ARCH check confirms (10+50=60 of 90 = 67%, `laneMFW1-receipt.md:165-166`). The error
   originates in the receipt's §6.1 and propagated verbatim into the ledger and into
   `GENERATION-SPEC` G-34 (`laneMFSPEC-receipt.md:259-262`).

**Tier 2 — claims stronger than their evidence.**

6. **§255.1's "Distributionally the wave changed NOTHING" is unsupported at n=6.** Combined SE
   ≈19.4 on an observed corpus difference of 11.5 — a real shift of up to **+38** would be
   invisible. The receipt hedges correctly (`:348-350`, J-W1-4); the ledger dropped the hedge.
   §255.1 also attaches the one-town z-scores (−1.1/+0.9) to the published corpus figures, whose
   actual z-scores are −0.45 and +0.83.
7. **§252.1's "6.8% → 0" is a redefined census with three stacked relaxations.** Denominator
   19,563 → 15,176 (excludes 4,607 suburb bodies); `held` means own circuit **or any later one**
   (with a measured counter-instance in the receipt), plus a half-ring `closedPolygon` exemption,
   tested on the body **centroid** — a point predicate, in the wave whose own law is that vertex
   containment is not polygon containment. And the §240.1 pin's "not self-reported only" arm is
   **vacuous on half-ring rings** (`!r.halfRing` guard, `townMapWallCircuit.test.js:494`) — 6 of 10
   walled leaves.
8. **§240(a): the genesis exception is closed by not implementing the law.** `deriveEpochs` reads
   `builtRadius` = today's finished extent and slices by tier-threshold shares; `epochCircuitRing`
   cuts today's finished `bodyMask` with `shrinkAbout(todayOutline, …)`. Epochs are a
   **retrospective partition of finished fabric**, not a build sequence. Nothing is built inside a
   wall — which is why four containment attempts and a 6-round sweep were needed to make each ring
   bound its own slice.
9. **§252(a): concentricity is already shipping, not merely a risk of the third ring.** Every
   epoch window is a homothety of today's outline about **one shared centroid**
   (`builtUmbrella.js:324`), so the migrating, non-concentric centres the corpus's own cure plate
   hf385 exhibits are architecturally unreachable. `MORPHOLOGY-CONTEXT.md:2085` already says
   *"§240 and CX-13 are one piece of work, not two."* The hold is right; its ground is stronger and
   wider than stated.
10. **§255.2 over-attributes −7 to "the wall work."** cf1 is "everything else" (epoch axis +
    containment + ditch + per-epoch RNG + four other fork keys), and the receipt's §7.5 shows the
    wall's own contribution on the town family is **0**. This is narrative-not-isolation, in the
    row that banks the law against it.

**Tier 3 — precision and disclosure.**

11. **§241.5b's "LATENT, not active" is wrong on one of the five.** The coast fallback is marked
    **⛔ ACTIVE** in both receipts (`laneMFARCH-receipt.md:466`; `laneMFARCH2-receipt.md:337`) —
    merely unexercised by the corpus. That was the justification for deferring under the freeze.
12. **§257(d): the atlas fix is one level too high.** Four operative rows plus the role table
    (`laneMFS1-urbanism-atlas.md:936, 968, 1106, 1234, 1240`) still print `#FAEBD8` / warmth 34,
    including the row the atlas itself calls *"what a renderer actually reads."* The class was
    named and cured with a preamble note.
13. **§238(c) and §252(c): both zooms verify INK, not the census.** The stroke is ≈4.6 units; the
    §200 band is 8.696. Neither zoom can see a band intrusion. §252(c)'s "no violations visible"
    coexists with 13 measured water violations on the town leaf that same session.
14. **§238.1's "byte-identical both ways" is not what the probe measured.** Drawn `ring.polygon`
    sha = `8f8ad7f3…`; census `claimLine` sha = `857ffc4f…`. The identity is claimLine vs
    reconstruction-from-drawn under `shift = 1.132` (`laneMFB8b-receipt.md:84-90`).
15. **§239(a): the temporal edge was never built.** `deriveEpochs` uses `vintage.year` only as a
    presence gate (`epochAxis.js:106`); the ladder orders by tier-threshold extent share. The
    cycles were cut by the version index, not by time — and the §239 year test itself came back
    **non-discriminating** (`MFARCH-temporal.log`, J-ARCH-8).
16. **§257.2 miscounts the lane's rulings.** Three conflicts were ruled; C-3 was deliberately
    escalated unruled as Q-1 (J-SPEC-3) — the lane's best judgment call in the row, erased by the
    "four … ruled by the lane" phrasing.
17. **§252.3a's headroom figure disagrees with the module that implements the cap.**
    `epochAxis.js:50-51` says **78**; the receipt and the ledger say **83** (78 is MF-ARCH's
    pre-wave value).
18. **§241(b)'s publication guard covers ~1/5 of the measured raw-handle exposure.** Water (58
    reads), parcels (46) and streets (19) remain unguarded by J-ARCH-4's explicit deferral. "The
    better law" is right; the sweep was not taken.
19. **`boundEpoch`'s own docstring describes the rejected design** ("local, one-shot") while the
    code runs a 6-round sweep, and calls the translation "exact" where `Math.max(0.2, cos)` clamps
    it. The lane's own banked class, reappearing in the lane's own new module.
20. **§257.1's "3,187 lines" is not re-derivable** (the file is now 12,362 lines) and the receipt
    disagrees with itself on size (248 KB at `:14`, 239 KB at `:414`).

---

# TWO OPEN ASKS I DISCHARGED FOR THE CHAIR

- **The exemplar 7/2 seed collision is CONFIRMED** against the primary fixture
  (`laneMFARCH2-tip/harness/exemplars.mjs`, lines 20/21/24/34/35/36/37/40/47).
  `laneMFSPEC-receipt.md:346-350` asked a builder to confirm this once before spending §0.3b's
  binding usage rule on it. Done — it is exact.
- **Q-2's genuineness is CONFIRMED**, by running the settling experiment the spec lane named and
  labelled PLAUSIBLE (`laneMFSPEC-receipt.md:473-476`): no fabric-epoch derivation independent of
  circuits exists anywhere in ODQ §150-§253. The PLAUSIBLE label on §257.3(a)'s premise can be
  retired.

# ONE THING I COULD NOT VERIFY

- **§257.3(b)'s "(it counts hedges as buildings)"** — the mechanism given for the low-tier grain
  instrument's invalidity. Neither `laneMFSPEC-receipt.md` nor `GENERATION-SPEC.md` §Q-1 sources
  it; it may live in `laneHFM1-receipt.md` or §244.5, both outside my rows. Flagged for whoever
  holds §244.

# HELPER ARTIFACTS WRITTEN (this session, output dir only)

`retro-E1-owner-BEFORE.png`, `retro-E1-owner-AFTER.png` (3× crops of the b8b ownerview wall/fabric
band, source rect x 380-780 / y 130-320), `retro-E1-crop-water.png` (3× crop of the arch2 owner
zoom, source rect x 560-940 / y 560-860). No repo file, no lane tip and no scratchpad receipt was
modified.
