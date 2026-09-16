# DESIGN — THE REGISTER PROGRAM (REG): the map that wins the eye first

**STATUS: ARCHITECTED, NOT BUILT.** Chair-authored (Fable) under the owner's direct order
(ODQ §570.2 "reprioritize… procedurally render the maps as the beautiful pictures shown in the
corpus" and the §580 sitting "architect all of this out"). Origin: the owner–chair design
conversation of 2026-08-24, ODQ §§570–§580. The ledger outranks this document where they ever
disagree. Per the architected-design discipline (§287.16): nothing here may be reported as built.

> ## ⭐⭐⭐ §0 · THE NORTH STAR (ODQ §580 — the tie-breaker for every visual decision)
> *"It should look like it was based off of Watabou and FTG but upgraded with the aesthetics of
> the corpus, and it should read just as good or better than Watabou and FTG, with the ease of
> reading as the corpus. All while holding on to our truths."*
>
> Parsed as precedence, applied whenever any call must be thought about:
> **LINEAGE** — the base look descends recognizably from Watabou and FTG ·
> **UPGRADE** — the corpus supplies the aesthetic elevation ·
> **BAR** — readability ≥ the leads, ease-of-reading at corpus grade ·
> **INVARIANT** — the truths hold underneath, always.
> When references disagree: the Watabou/FTG reading-grammar wins the STRUCTURE of a choice,
> the corpus wins its DRESS, and nothing ever wins against the truth beneath.

## §1 · THESIS — the priority inversion (ODQ §573.1)

Information and truth are the second and third things a user finds. The first thing is a map
that is beautiful, intuitive, and relatable. The user's arc is: **"wow" → "I can read this
instantly" → "wait, it is all real."** The first two acquire the user; the third — which no
competitor can follow — retains them. The engine's truth is unchanged by this program; it is
re-aimed: truth becomes the composition engine (real cores, epochs, institutions, wars decide
what the beautiful map shows) and the discovery layer (hover, click, the dated margin notes).

## §2 · THE LAWS THIS PROGRAM BUILDS UNDER (each cites its ledger ruling)

| # | Law | Ruling |
|---|---|---|
| L-REG-1 | Two-legged exit: REGISTER (corpus look, atlas DISTANCE) and LEGIBILITY (hierarchy + convention), equal weight | §570.5 |
| L-REG-2 | Geometry narrates: fused frontages, block-as-unit, landmark forms — ranked FIRST among builds | §571.4 |
| L-REG-3 | The wall is a district partition; core→circuit→ring; faubourgs are their own districts with typed ORIGINS; intramural densification while a circuit stands | §571.1–.3, §232, §240 |
| L-REG-4 | Triangulation: every visual element traces to Watabou, FTG, or the corpus; traceable-to-none is drift needing written justification | §574 |
| L-REG-5 | The wall band: clear-space regime (military-active) or tangential regime (long-peace encroachment), DERIVED from readiness/era/prosperity, never a dial | §575 |
| L-REG-6 | A market is one giant street: shared void surface, no seam, furnished at B13 density; market-infill fossils chartered | §576 |
| L-REG-7 | The segmented circuit: walls terminate at water (fabric Rule 3) and cliffs (new; relief-substrate consumer #3), tower/gate works at each terminus | §577 |
| L-REG-8 | The shape code: every building class carries a shape family (footprint + compound arrangement + roof form), seeded-varied within family; lands on §494 compounds, DW partis via signed band B18, and R-INST imperatives | §578 |
| L-REG-9 | A stroke may carry only meaning the geometry beneath it earns (the floating front-bars precedent: corpus-true weight on unfused geometry is noise) | §579 |
| L-REG-10 | Corpus doctrine as amended: the corpus teaches register AND layout-legibility/composition; it remains barred as structural truth or tuned probability | §573.3, §322.9 |
| L-REG-11 | Words speak human: no engine vocabulary on any user surface; cartouche as book plate; typographic ranking (places > margin whispers); the legend shrinks as drawings self-explain | §570.5(vi), LEGIBILITY law, GAME-GRADE UX |
| L-REG-12 | Determinism absolute: same seed, same map, forever; every jitter/waver/stain is seeded; no runtime AI imagery | THE PROMISE, §572.1 |

## §3 · THE LAYER MODEL — the render stack, bottom to top

Each layer consumes only layers beneath it; the north-star precedence resolves conflicts
BETWEEN layers (structure from the leads, dress from the corpus, truth invariant).

- **L0 · TRUTH GEOMETRY** (exists; the fabric at the sealed tip): parcels, streets-as-negative-
  space, wall circuits as district partitions, epochs/rings, water claims, commons. The program
  writes nothing here except through chartered fabric waves (L1).
- **L1 · LEGIBILITY GEOMETRY** (the program's first builds): frontage fusion into party-walled
  block masses · block-as-unit stroke hierarchy · landmark/shape families with forecourt voids ·
  the wall-band orientation field (space-or-tangent by regime) · market voids continuous with
  streets, furnished · circuit terminations at water/cliff · faubourg-origin typing ·
  intramural densification. **This layer is generative geometry, not paint** — it lands in the
  fabric, sandbox-first.
- **L2 · INK** — the harness INK_SCALE ladder (frontage-ratio stroke roles, measured off plate
  hf40) promoted from judging harness to render law; seeded line waver; roof hatching (class-
  varied, one NW light); the heavy front edge as the FUSED MASS's own street face (L-REG-9).
- **L3 · THE DRAWN WORLD** — countryside primitives (canopy masses with interior stroke texture,
  hedged field furrows, roads past farmsteads); water banks with current strokes; terrain in
  hachure once the relief substrate lands.
- **L4 · PAINT** — the recovered MF-A1 pass (`refs/preserve/mf-a1-recovered-2026-08-24`): paper
  grain, stains, vignette, tidemark rims, wash mis-registration, mass shadows, three-tone
  water — applied last over L2/L3, never duplicating their effects.
- **L5 · WORDS & CHROME** — the human cartouche, typographic ranking, curved ward names, dated
  marginalia as italic whispers, the self-shrinking legend, compass/scale/frame ornament.

## §4 · EXISTING MACHINERY EACH LAYER LANDS ON — unify, never mint a fourth system

| Machinery | State | Consumed by |
|---|---|---|
| `fabric/walls.js` six-rule trace + high-water law; `districtPartition.js` (§232 theorem); `epochAxis.js` (§240) | SEALED at `ee0db96d3` | L0/L1 — the wall program extends, never re-derives |
| `harness/renderFolio.mjs` INK_SCALE + op ceilings per tier | sealed (judging-only) | L2 promotes the ladder to render law |
| MF-A1 paint | RECOVERED + preserved; standalone `paint(svgText, seed)`; deterministic, verified on w2 leaves | L4 verbatim |
| v2 glyph library (26 type-shapes, NW shadows) + `massing.js` (dormant) | shipped | L1 shape families unify with these; one light everywhere |
| `folioLenses.js` ten-role palette + computed `lensContrast()` law | sealed | L2/L5; the contrast floors extend this law |
| Atlas instruments (`map-corpus/docs/` HFM1/MFS1/MFI1 sets; preserved at `map-corpus-docs-2026-08-24`) | live | the register leg of every exit |
| §523/§524 entitlements, mapEdits, tiers | shipped | untouched; the program is presentation-side |

## §5 · THE WAVES — build order, each with its observable exit

All build waves run **SANDBOX-FIRST in the fabric worktree under the map program's own method**
(P2 sandbox → seal → P5 port; cutover stays owner-gated). No engine bytes before seals.
Every wave's exit is TWO-LEGGED (L-REG-1): the named integers/differentials below PLUS no
regression on the legibility instrument set (§6). Every wave is taste-gated by an owner
judging round on crops (the CT-0 pattern).

| Wave | Content | Exit (observable) | Depends on |
|---|---|---|---|
| **REG-0** | the everything-on SPECIMEN (in flight) | owner verdict on the crops + the measured frontage-continuity delta; calibrates every wave below | — |
| **REG-G1** | ⛔ THE RELIEF SUBSTRATE — the three-customer foundation (terrain iconography §214, ridge-following Rule 2, cliff terminations §577) | a relief field replaces the scalar; hachure-able slopes exist; wall trace consumes it; N sampled settlements show nonzero relief variance | owner cost nod (it moves 3D scenes only at cutover, not before) |
| **REG-1** | FRONTAGE FUSION + block-as-unit + front-bar removal (L-REG-2, -9) | frontage-continuity ratio ≥ target band measured vs corpus urban plates; freestanding-fraction intramuros falls to its band; zero standalone blockFront ops; squint test passes at 200px | REG-0 verdict |
| **REG-2** | THE WALL PROGRAM: band regimes + orientation field + terminations + §214 wall iconography (towers, crenellation, gatehouses, ditch grammar) | zero wall-over-water/cliff ops; regime derivation fires both ways over the corpus (garrison→band, long-peace→tangent, counts > 0 each); wall is loudest stroke by measured contrast | REG-1; REG-G1 for cliff half |
| **REG-3** | THE SHAPE CODE: class shape families + compound arrangements + roof forms; unification with glyphs/massing | every map-visible class resolves to exactly one family; a blind class-from-silhouette read on N samples ≥ target; one NW light everywhere (zero divergent shadow ops) | REG-1; B18 seam consumed read-only |
| **REG-4** | MARKETS + FAUBOURG ORIGINS + DENSIFICATION (L-REG-3, -6) | zero tint seams street↔market; furniture density inside B13 band; every extramural district carries a typed origin; densification differential (population up, circuit standing ⇒ infill count up, sprawl 0) | REG-1 |
| **REG-5** | THE DRAWN WORLD: countryside primitives + water banks + terrain hachure | countryside coverage at village tier ≥ band (the 85% surface); canopy/field ops within ceilings; terrain arm gated on REG-G1 | REG-G1 |
| **REG-6** | INK AS RENDER LAW: INK_SCALE promotion + waver + hatching | lineweight-ratio instrument inside the corpus register band; determinism double-run byte-identical; op ceilings hold or a §217 signed raise | REG-1..3 (needs fused geometry) |
| **REG-7** | PAINT INTEGRATION: MF-A1 into the pipeline; the browser-parity and PDF answers | same-seed pixel-identical across browser/export; the PDF path renders the pass (baked raster or filter-free variant — the chartered decision this wave carries); wash-σ and tone-IQR inside corpus bands | REG-6 |
| **REG-8** | WORDS & CHROME: cartouche language, typographic ranking, legend shrinkage, frame ornament | zero engine-vocabulary tokens on any user surface (a scannable denylist: FABRIC, RELIEF, REPRESENTATIVE, …); legend rows ≤ the self-explaining threshold; marginalia/place-name contrast ranked | any |
| **REG-9** | COMPOSITION & THE JUDGING LOOP: derived focal hierarchy, breathing space, density narrative; then §216 rounds | the relatability side-by-side vs ALL THREE references at owner sitting; atlas DISTANCE equal-or-better, looped until it reads so | all above |

Sequencing notes: REG-G1 and REG-1 open in parallel (disjoint files); ONE gate/seal at a time
per standing law; the map-program cutover (owner eyes) remains the single point where any of
this reaches shipped `src/` — the legacy octagon wall and v1/v2 paths stay byte-frozen until it.

## §6 · INSTRUMENTS — the two-legged exit, measured never asserted

- **Register leg** (exists): the atlas DISTANCE set — wash-σ, tone-IQR, lineweight ratio, grain
  density — vs the 313-plate corpus; §216's loop-until-equal-or-better stands.
- **Legibility leg** (new; extends `lensContrast()`): the 200px SQUINT test · route-trace
  (gate→center) · chunking (wall + 5–9 wards legible) · landmark-anchor salience · role-pair
  contrast floors · frontage-continuity ratio · freestanding-fraction · blind
  class-from-silhouette reads.
- **Relatability**: the side-by-side sheet vs Watabou + FTG + a corpus plate, owner-judged.
- **Always**: determinism double-runs; op-ceiling ratchets; the no-drift trace (L-REG-4).

## §7 · BUDGETS AND NAMED HAZARDS

1. **Op ceilings**: corpus-density drawing is expensive; the cures are `<defs>/<pattern>/<use>`
   reuse and (if needed) §217 owner-signed ceiling raises — never silent.
2. **PDF filter-vanish**: react-pdf renders no SVG filters; REG-7 carries the decision (baked
   raster layer at export vs filter-free print variant). Named, not hand-waved.
3. **Browser parity**: MF-A1's §211 open hazard; REG-7's acceptance includes cross-surface
   pixel identity.
4. **Metropolis legibility**: the top tier is the hardest read at any register; REG-1/2's
   instruments run at ALL tiers and the metropolis is the named stress case.
5. **The last-mile aesthetic**: chair's honest calibration — the register band is reachable;
   "indistinguishable at arm's length" is a convergence target the judging loop measures, not a
   promise (ODQ, the possibility sitting).
6. **Rasterizer honesty**: qlmanage drops filters; all grading rasters via headless Chrome with
   the filter-control (§570.3).

## §8 · SEAMS TO THE OTHER PROGRAMS (consume, never fork)

- **DW**: B18 parti↔massing is the shape-code's interior source; §494 CompoundMember polygons
  arrive at DW-1f/EST-3 with `membersOf` return shapes unchanged (MP-1's contract) — REG-3
  reads them when they exist and does not wait on them.
- **AD (17 cars)**: the art-direction slot at the DW-6/`cartographyPaint` seam is unchanged;
  REG supplies the abstract tier AD elevates.
- **Undercity**: joints/fossils surface through DW law 7; REG draws only published joins.
- **News/marginalia**: the address law governs which dated events earn margin whispers.
- **Deferred and untouched**: D-10 absolute-metre scale (massing train) · the §290 review stop
  order (the whole REG arc precedes the ultra review, per the owner's reprioritization) ·
  market-infill fossils (chartered, rides a later fabric wave).

## §9 · OWNER-SIGNATURE SURFACES

The specimen verdict each judging round (the CT-0 gate) · every §217 op-ceiling raise · the
wall-regime derivation thresholds and any constant that shapes worlds (tuning class, signed at
the tuning pass) · the relatability drift calls (anything traceable to no reference) · the
REG-7 print-path decision if it changes export bytes for paying users.

## §10 · ANTI-SCOPE (affirmative)

No runtime AI imagery, ever. No corpus structure/probability copying (L-REG-10). No fifth map
system — every wave lands inside the fabric/harness/lens machinery of §4. No novel visual
language (L-REG-4). No engine bytes before seals; no cutover except the owner's. No new
entitlement gates (the §523 trichotomy stands; DW's ledger no-growth arm binds here too).

## §11 · OPEN QUESTIONS (for the first judging round)

Q1 the metropolis approach — density abstraction (Watabou's out) vs LOD massing (`massing.js`)
at the top tier. Q2 REG-7's print path — baked raster vs filter-free variant (cost/quality).
Q3 glyph-library unification — do the 26 oblique glyphs survive as the illustrated lens's
building layer above the fused plan masses, or retire into the shape families? Q4 how much
composition derivation (focal hierarchy weights) is chair-tunable vs owner-signed.

---
*Chair-authored 2026-08-24 (Fable), ODQ §581. Pending the skeptic panel; its findings and the
chair's rulings will be folded as an amendment section, per the DW-0 compile precedent.*

---

## AMENDMENT A1 · THE OWNER'S ROUND — TIME BUDGET SIGNED, SIX CONCERNS INTEGRATED (ODQ §583–§584, 2026-08-24)

**Layered per the estate's compile law: this amendment wins where it and the body disagree.**

### A1.1 · New laws (extending §2)

| # | Law | Ruling |
|---|---|---|
| L-REG-13 | **The time budget**: first-paint may take 10–20 s at full quality — instant parity with FTG is NOT the bar. Interaction after the paint (pan/zoom/hover/halo) stays smooth; determinism makes renders cacheable per settlement. Progressive reveal (the map drawing itself in layers before the user) is chartered as the wait's design surface | §583 |
| L-REG-14 | **The zoom ladder**: the map is a TOOL that zooms, and all three references are fixed pictures — so the register defines per-zoom-level visibility (what ink, labels, marginalia, furniture appear/hide at each step), and the corpus dress must survive 4× inspection. Interactive affordances (hover states, the §494 halo, selection) get register-consistent treatments so the tool never breaks the plate | A1 |
| L-REG-15 | **Village-first**: small tiers are FIRST-CLASS judging targets, not the city's sibling — at thorp/hamlet/village the DRAWN WORLD is the map (the corpus's own hamlet plate is its forest), and the first settlement a new user generates is small. Every judging round includes a small-tier specimen | A1 |
| L-REG-16 | **The gallery test**: variety across seeds is an exit criterion — terrain, culture-dress (within EUROPEAN_FANTASY_BASE morphology law), era, and history must visibly differentiate maps, or the register has ironed the truth flat. Watabou's sameness is the named anti-goal | A1 |
| L-REG-17 | **The used map stays in register**: DM annotations, fog-of-war, and VTT/print exports get register-consistent visual treatments — no sticky-notes-on-a-painting | A1 |

### A1.2 · Wave additions and amendments (extending §5)

| Wave | Content | Exit (observable) | Depends on |
|---|---|---|---|
| **REG-10** | THE ZOOM LADDER + INTERACTION REGISTER: per-level visibility tables; register-consistent hover/halo/selection; the cached-render + progressive-reveal pipeline (L-REG-13/14) | each zoom level's visible-element set is a declared table with a rendered proof per level; interaction smoothness at a stated frame budget on the reference machine; the reveal sequence demonstrated; cache hit = byte-identical | REG-6/7 (needs the layered render) |
| **REG-11** | THE SHARE SURFACES: one-click beautiful export, the landing hero replaced (retiring the cnocby-era samples), share-card crops, PDF parity with REG-7's print answer | the export image passes the same two-legged instruments as the pane; the landing assets regenerate from the new pipeline; zero old-renderer images on acquisition surfaces | REG-7; the landing-asset swap is an owner-visible act |
| **REG-0/9 amended** | every judging round includes a SMALL-TIER specimen (L-REG-15) and, from REG-6 onward, a GALLERY SHEET — N seeds side-by-side across terrain/culture/era — judged for differentiation (L-REG-16) | the gallery's measured spread (per-map palette/composition deltas) plus the owner's verdict | — |

### A1.3 · Instrument additions (extending §6)

The GALLERY-VARIETY instrument (render N seeds, measure palette/composition/density spread,
flag convergence) · the INTERACTION check (pan/hover latency at the frame budget, post-paint) ·
the ZOOM-LEVEL proofs (one render per declared ladder step).

### A1.4 · Docket routing (extending §8/§9)

**The deploy linkage is the strategy's critical path and is the OWNER'S docket row**: the
register reaches no user until the fabric cutover (owner eyes) and a deploy (owner's train,
nothing shipped since 2026-07-28) — scheduling that pair deliberately is the difference between
a beautiful sandbox and an acquisition engine. **External eyes** (showing specimens to real
DMs/players pre-launch) is recorded as an OPTION on the owner's docket — cheap relatability
insurance, entirely the owner's call given IP posture.

---

## AMENDMENT A2 · THE SKEPTIC PANEL'S 43 FINDINGS, RULED (ODQ §586, 2026-08-24)

**Six lenses, 43 findings, 5 BLOCKERs — every finding re-derived by the chair and RULED. This
amendment wins over the body and A1. Raw panel evidence: the 31585ce2 scratchpad,
`panels/reg-arch-panel-2026-08-24.json`.**

### A2.1 · The five BLOCKERs, cured
1. **REG-2's corpus-derivation exit is struck** (structural-truth use of the corpus): regime
   derivation fires over N GENERATED fixture settlements — a garrison/war fixture must derive
   regime B and a long-peace/prosperity fixture regime A, counts > 0 each, coin-flip-proof by
   fixture identity. The corpus appears only in register comparison.
2. **`massing.js` is LIVE, not dormant** — consumed by townPanorama and the 3D scene chains at
   HEAD. §4's row is corrected; REG-3 consumes it READ-ONLY with the shipped paths byte-frozen
   until the owner cutover.
3. **REG-I0 is chartered** — the instrument-construction car, first in the arc: builds the
   legibility instruments (squint, route-trace, tier-conditioned chunking min(wards,5)–9,
   landmark salience, role-pair contrast, frontage metrics WITH minted formulas, blind
   silhouette-read protocol with a fresh-context reader, FTG category-color hue-band arm,
   no-drift trace over the renderFolio op-class roster with a committed trace table) and
   records BASELINES at the sealed `ee0db96d3` renders — including the §571.2 straddle census
   (= 0) and outside-circuit body count (= 0), the verification the ledger ordered.
4. **REG-G1 is re-chartered as THE CLIFF-EDGE WAVE** — the sealed fabric already carries
   `reliefField()` (bands/steepShare/cragShare), height/slope Float64Arrays, hachure drawing,
   and a height-sampling wall trace; §577.2's "scalar only" premise was a b6-era fact that
   decayed by W3f (the absence-decays law, inverted). What is genuinely absent: `CLIFF` is
   declared and EMPTY in fabricDcel.js under the §297.2b hold. REG-G1 derives cliff/impassable
   edges from the existing field, discharges the hold, and gives walls the §577 termination.
   EXIT: cliffEdges > 0 on a cliff fixture AND exactly 0 on a flat plain; two relief fields at
   one seed produce DIFFERENT traces; wall-over-cliff ops = 0; dormancy byte-identical.
   (The live lane was re-aimed mid-flight.)
5. **The PDF pattern-vanish joins the filter-vanish** — react-pdf 4.8.1 enumerates NO Pattern
   and NO Use/Symbol (verified by execution). §7's cure #1 does not survive the print surface;
   Q2 is constrained by the AD charter's J-AD-5 ONE-GEOMETRY law (named as binding): baked
   raster qualifies only if one geometry feeds every surface with PDF and thumbnail identical,
   else a priced PDF-side geometry expansion. §234's §211.2b revision (geometry-baking for
   expressible mechanics; filters only for irreducible grain/blur) is a decided input to Q2.

### A2.2 · Exit-criteria repairs (the observability lens, all accepted)
REG-0's exit gains: mint the metric FORMULAS, the corpus-plate subset, and the measured band
numbers REG-1 consumes; plus the straddle/outside-circuit censuses (via REG-I0). · REG-1's
frontage band derives from the WATABOU/FTG references (corpus corroborating only), the chosen
constant recorded on the tuning surface. · REG-4's differential is scoped: SUB-THRESHOLD
population growth with circuit standing ⇒ intramural infill up AND intramural-extension-
through-wall = 0; sprawl DEFINED as untyped extramural growth; typed faubourgs lawful, counted
separately, with a positive control at a tier crossing. B13's per-rung fixture-count band is
minted by the chair before REG-4 opens (flagged chair's, per the B13 precedent). · REG-3's
blind read: N and target fixed at the REG-0 round; executor = a fresh-context reader with
labels withheld. · REG-5's band: countryside coverage at village tier within ±10 points of the
corpus-measured 85% (chair's number, vetoable); its exit gains the same "or a §217 signed
raise" clause as REG-6. · REG-7's parity leg re-stated per §234/§246 precedent: per-surface
same-seed determinism + a declared per-surface capability matrix + instrument-band agreement;
pixel identity reserved for headless Chrome alone; surface pairs enumerated; its exit also
carries the §220 performance gate as amended by §583 (first-paint 10–20 s cached; interaction
smoothness and export time measured at metropolis at corpus grain) and the MF-A1 hazard-3
anchor-free-wash law and the wrap-count precondition pin (paint() reports wrap counts; any
zero fails the wave). · REG-8 splits: cartouche language + an ENUMERATED denylist file + a
formula-pattern arm (ratios, decimals, ALL-CAPS parentheticals) open any time; the
legend-shrinkage leg depends on REG-3, its row integer set at the REG-8 round.

### A2.3 · Sequencing repairs
**B18 is struck from REG-3's dependencies** — its producer (DW-2b) runs after the REG arc;
REG-3 consumes the signed band's contract SHAPE and the §494 compounds + R-INST dossiers; a
named post-DW-2b refinement car becomes B18's exterior consumer. · **REG-6 is re-stated as the
MF-4 LENS BUILD** (the harness's own header: the ten-role architecture belongs to train mf-c)
— a src renderer consuming folioLenses + INK_SCALE with its real bill: new test surfaces, the
three-census cost, op-ceiling ratchets. · **The REG RE-PORT is chartered** as wave REG-P at
arc end: the §467-complete D3a dormant core is refreshed from the sealed sandbox before the
§171 cutover, so the cutover never lights a stale core. · The disjoint-files parallelism claim
is replaced by per-wave FILE MANIFESTS with a single writer for `buildFabric.js` and the
census surfaces. · REG-5 lands before REG-7 where seats allow; REG-7's band figures re-run at
REG-9 once all under-layers are in (stated in its exit). · **The §571.3 re-order is RULED
under the §585 delegation**: faubourg-origin typing and intramural densification build INSIDE
REG-4 (the chair exercises the "unless re-ordered" clause; recorded vetoably).

### A2.4 · Corrections of record
The §581 authoring row is backfilled in the ODQ (the phantom-citation class, §441 J7). ·
§10's trichotomy home corrects to **§524.4** (parents §523.2/.3). · REG-G1's owner cost nod
joins §9's enumeration — and under §585 the chair signs §217 raises, recorded vetoably. ·
§7.6 gains the qlmanage reconciliation (headless Chrome stays the instrument; the MF-A1
receipt's fidelity row is marked superseded pending a differential probe). · The wave count:
the arc is now **REG-I0 · REG-0 · REG-G1(cliff) · REG-1..9 · REG-10 · REG-11 · REG-P**.

---

## AMENDMENT A3 · THE FAMILY-GRAMMAR LAW — OWNER-APPROVED VARIATION (ODQ §598, §600–§601)

**A3.1 · L-REG-8 is amended:** a shape family is **ANATOMY + INVARIANTS + SLOTS, never a fixed
outline.** Pinned invariants: only what makes the class read at a glance. Every other feature is
a SLOT rolled by the building's own seed (the standing drawVariant idiom — deterministic per
building, different across buildings). **The world biases the dice:** prosperity buys the tower
and transept; foundation age accretes asymmetric chapels (the faith-tenure fact); region/culture
biases forms within the fantasy-base morphology law; parcel and orientation differentiate even
equal rolls. Variation is biography, never noise.

**A3.2 · REG-3's exit gains the dual arm:** for each family, (a) the enumerated slot table with
its bands and world-bias rules; (b) the GALLERY spread measured across N seeds (sameness reds,
L-REG-16); (c) the blind silhouette-read (unrecognizability reds). The wave builds BETWEEN those
two measurements. Variation ranges that shape worlds are tuning-signature surfaces (§9).

**A3.3 · Standing approvals of record:** the §590 rampart treatment is OWNER-APPROVED as drawn
(ODQ §598 — "Yes! I like that rampart") and is REG-2's binding dress target beside hf261/hf313;
the family-grammar mechanism is owner-approved at §600–§601 ("Perfect, I like that").

---

## AMENDMENT A4 · THE TIME BUDGET, FINAL FORM (ODQ §603)

**L-REG-13 is amended:** draft budget **20–30 s fine · 45 s worrisome · 60 s hard max,
extremely rare** — TIERED: small tiers land in single-digit seconds; the upper allowance is
city/metropolis territory. Rationale of record (the CYCLING THESIS, §603.2): truth collapses
the regenerate-search — users cycle once or twice on a map that already matches the
settlement's state, then edit; the competitive unit is time-per-satisfied-map. Interaction
smoothness, caching, and progressive reveal unchanged from §583.2. REG-7's performance gate
and REG-10's reveal pipeline consume the tiered numbers.

---

## AMENDMENT A5 · THE CHRONICLE-AND-TIME INTEGRATION (ODQ §§598–§616, compiled §617)

**The comprehensive fold of the 2026-08-24 evening sittings. Layered per the compile law: A5
wins over the body and A1–A4 where they disagree; the ledger outranks all. Pending its own
skeptic panel; findings fold as A6.**

### A5.1 · New laws (L-REG-18 … L-REG-29)

| # | Law | Ruling |
|---|---|---|
| L-REG-18 | THE RAMPART: band + walk + courses, towers-as-joints, tier-scaled — OWNER-APPROVED as drawn (the REG-0b specimen is the dress precedent beside hf261/hf313); WEAR in three grades (kept → weathered → crumbling) derived from maintenance facts × age, never an invented number | §590, §598, §614.2 |
| L-REG-19 | THE CHRONICLE FILM: continuous organic growth — ONE final render revealed along per-element APPEARANCE YEARS (true epoch + true accretion order; mid-epoch spacing interpolated under the CANON-HONESTY clause: presentation never stamped as world fact) | §607 |
| L-REG-20 | THE FILM CLOCK: duration = max(30 s, actual build); STORY-PACED (beats allocated, years non-uniform); SKIPPABLE and REPLAYABLE (the replay is the share clip) | §608 |
| L-REG-21 | THE BEAT VOCABULARY (closed, typed): BUILD · MERGE/SPLIT · DEMOLISH→REPLACE · SCAR→HEAL · SIEGE · OCCUPATION · STILLNESS · WALL-RAISING · YEAR-CARD · DEBRIS · RECLAMATION · ABANDONMENT — every beat sourced from a dated, typed world event; the RESTRAINT law: calm ink, salience from pacing never volume, no drama the world's ledger does not hold | §609, §614.3 |
| L-REG-22 | THE DF PRINCIPLE: the depth lineage — the fourth reference, for MEANING never visuals; curated emergence under THE PROMISE, against DF's chaos and opacity | §610 |
| L-REG-23 | THE DECLINE ARC: non-monotonic trajectories are first-class; the drawn decline vocabulary (hf379 ruin ladder, thinned fabric in the oversized high-water circuit, subdivided grandeur); the film contracts | §611 |
| L-REG-24 | AGE–ARC COUPLING: an arc draws the span it needs; a young place earns no ruins (the coherence direction binds both ways); plateaus lawful for the old; the sub-century scope binds forward simulation only | §611.4 |
| L-REG-25 | ⭐⭐⭐ THE PURPOSE LAW — the final tie-breaker above the north star it serves: *does this deepen the user's sense that this place is real, and theirs?* The ownership ladder: witness → reader → participant → owner, with THE PROMISE as the vow converting attachment into possession | §612 |
| L-REG-26 | FILM-LAST + THE TIMELINE CARRY-NOTE: the film assembles AFTER all map building; **every wave from A5 forward stamps its elements' timeline annotations (appearance epoch, accretion order, beat events) in its changeManifest** so the final assembly consumes emitted data and re-opens nothing | §613 |
| L-REG-27 | RECLAMATION BY GROWTH, INTERRUPTIBLE AND ONE-WAY: disaster remnants (crashed floating islands included) persist beyond the limits as landscape facts; the growth front's arrival triggers breakdown, its retreat freezes it mid-bite; the half-eaten ruin at the high-water mark is dated physical evidence; G-60's loss machinery gains its trigger | §614.1, §614.3 |
| L-REG-28 | THE ACCESSIBILITY HOLD: the accessible lens joins EVERY wave's instrument run and every judging round — beauty aimed at parchment may never silently degrade the lens nobody was grading | §615.3 |
| L-REG-29 | THE NAMING VETO + THE CAMPAIGN BOUNDARY: NO generated street/bridge/gate names (the DM's shipped annotation machinery is the naming path, owner-ruled); edge-road destination labels are CAMPAIGN-LAYER work, built after the maps, outside this program | §616.1–.2 |

### A5.2 · Wave-plan updates

| Wave | Change |
|---|---|
| REG-2 (live) | + the WEAR arm (in-wave if the timebox allows, else REG-2b), derivation measured-before-minted; the §611 synergy named (peak-vs-present lands the oversized circuit in the worst grade) |
| **REG-T (new, research seat)** | TRAJECTORY VARIABILITY, measured before built: do generated histories produce boom-bust / plateau / fade / sacked arcs at meaningful rates, with age–arc coupling (L-REG-24) holding? If thin, mint the trajectory shapes as a small typed vocabulary (constants tuning-class). Runs any time; blocks REG-D |
| **REG-D (new)** | THE DECLINE DRESS: the hf379 ruin ladder, thinned fabric, subdivided grandeur, DEBRIS/partial-RECLAMATION states drawn at their reached stage (L-REG-27). Depends on REG-3 (shapes) + REG-5 (drawn world) + REG-T |
| **REG-F (new, LAST)** | THE CHRONICLE FILM: assembles from every wave's timeline annotations. EXITS (each observable): a TIMELINE-TOTALITY walker — every drawn element carries appearance data, zero orphans; each beat kind demonstrated on a fixture with its restraint check; the clock law verified on N fixtures (duration = max(30 s, build), measured); same-seed timeline byte-identical; a CANON-HONESTY scan — zero interpolated years stamped as facts; skip and replay affordances present; **the FILM TASTE SPECIMEN (one city's whole life as an actual animation) judged before the wave completes.** Growth plates (print projection) and the share clip ride as its deliverable siblings with REG-11 |
| ALL waves | the L-REG-26 timeline carry-note is a standing changeManifest obligation from this amendment forward; the L-REG-28 accessible-lens arm joins every exit |
| Roster | SEASONAL DRESS: late wave after paint, deferred-and-recorded (§615.4) · CAMPAIGN EDGE-LABELS: outside REG entirely (§616.1) |

**Updated arc order:** REG-2 → REG-3 → REG-4 → REG-5 → REG-6 → REG-7 → REG-8 → REG-9 →
REG-D → REG-10 → REG-11 → REG-F → REG-P (the re-port carries the whole). REG-T runs
opportunistically before REG-D; the §217 raises are chair-signed per §604's spend-the-budget
grant.

### A5.3 · Machinery map additions (unify, never fork)

| Machinery | State | Consumed by |
|---|---|---|
| `epochAxis.js` (rings per epoch), accretion order in the derivation | sealed | REG-F's appearance years |
| `snapshot.js` year projection | sealed (sandbox) | REG-F prior art |
| `stateMarks.js` calm-ink events; `immersion.js` pentimento; marginalia | sealed | L-REG-21 beats; REG-D |
| G-60 typed LossRegion + dated recovery | ruled | L-REG-27's object; REG-D/REG-F |
| peakTier / T2R high-water; walls.js high-water circuit | landed/sealed | REG-D; the wear synergy |
| B8 two-way loop / EST-5 | UNBLOCKED (§611.3, CH-4 landed) | the decline dynamics' estate layer |
| `mapEdits` annotations (deltas, persisted) | shipped | L-REG-29's naming path — nothing to build |
| seasonOverride in mapEdits | shipped | the seasonal-dress late wave |

### A5.4 · Owner and tuning surfaces (updated)

Tuning-signature (world-shaping, accumulating for the soak's end): trajectory-shape constants ·
wear thresholds · reclamation rates · the fjord-crag threshold · wall-regime constants · B13
densities. Chair-judged under §585 (vetoable): film pacing weights · beat treatments · all
judging rounds. Owner by nature, unchanged: cutover · deploys · the tuning signature · the
ultra keystroke.

### A5.5 · Anti-scope additions

No generated proper names for streets/bridges/gates/squares (owner veto — the DM's hand is the
namer). No campaign-layer work inside this program. No film drama beyond the world's dated
ledger. No reclamation by timer. No wear from invented maintenance facts. The §613 film-last
order may not be traded away for an early demo beyond the chartered taste specimen.

---

## AMENDMENT A6 · THE A5 PANEL'S FINDINGS, RULED (ODQ §618; raw findings preserved in the 31585ce2 scratchpad `panels/`)

**Two blockers, thirteen majors, seven minors — none refuted. A6 wins over A5 where they
disagree. The load-bearing corrections:**

### A6.1 · The timeline architecture, rebuilt honestly (cures both BLOCKERs)
- **THE ANNOTATION SCHEMA IS MINTED AS ITS OWN MODULE** (a named fabric-side surface whose PATH
  each wave's changeManifest reserves — the manifest carries the obligation's file, never the
  data): per-element `{appearanceEpoch, withinEpochOrder, disappearanceYear?, provenance:
  'recorded'|'interpolated', beatEvents[]}` **plus a TRANSIENT-ELEMENT CHANNEL** for beat
  pre-states (the demolished predecessor's outline, the pre-merge pair, the unhealed scar, the
  siege camp) — the A5 schema had appearance only and could not draw six of the twelve beats.
- **REG-F0 IS CHARTERED — the backfill car**: the pre-A5 fabric never emitted per-element
  timeline data (epochAxis exposes ring epochs only; the derivation's loop order is never
  emitted — A5.3's row is CORRECTED accordingly). REG-F0 instruments the base element producers
  (bodies, parcels, streets, districts, wall runs) to emit epoch + within-epoch order, with a
  per-wave WALKER arm and a planted-omission control that reds at each wave's own exit.
- **The totality walker is SCOPED by the op-class roster** (i8's committed 31 classes): classes
  owing timeline data enumerated, timeless dress (paint, chrome, lettering, legend) exempt by
  name; a planted orphan moves the count by exactly one (the proven-zero law applied).
- **The canon-honesty scan gets its population and its control**: the provenance bit above,
  the fact-surface set enumerated (year cards, marginalia, dossier text), and a planted
  interpolated-year-on-a-year-card that must red.

### A6.2 · Wave exits repaired
- **REG-D's exit chartered**: a decline fixture whose drawn ruin-stage counts match its derived
  trajectory (counts > 0) · a young-fixture negative control (zero ruins — L-REG-24's coherence
  direction) · the reclamation LIFECYCLE pin (advance the front, retreat it, assert the stage
  frozen and monotone) · standard instrument/dormancy/determinism arms. REG-D binds to LANDED
  mechanisms only (peakTier/T2R, B6 shedding, the wear grid, pentimento); **the B8/EST-5 row is
  re-marked CHARTERED-POST-ARC** (its persistence artifacts are owner-gated O2/O3 and its
  producer runs in the DW train — the B18 precedent applied), with a named post-EST-5
  refinement car.
- **REG-T's verdict minted**: the arc classifier runs over the RECONSTRUCTED-EXTENT series
  (the only year-indexed series sourceable at head — stated in the exit with its length), with
  chair-set N, tier strata, and per-shape minimum-rate bands recorded before measuring; a
  two-point peak/present record may not masquerade as an arc census.
- **The wear arm gets the regime-cure differential**: a funded/young fixture derives KEPT and a
  destitute/old fixture derives CRUMBLING, counts > 0 each, thresholds on the tuning surface;
  L-REG-18 is REWORDED per §614.2's actual rule — measured facts first; a fact minted after
  measurement finds none is lawful, tuning-class, and recorded, never silent.
- **The accessible-lens arm is CHARTERED NOW** (which instruments re-run under the lens,
  baselines = their readings at the current sealed tip, a degradation band, one broken-plate
  control) — and L-REG-28 binds each wave FROM THE ARM'S LANDING, so no live wave is
  retroactively red.
- **REG-F's beat exits gain the BEAT-OCCURRENCE CENSUS** over N generated, unplanted
  settlements — and the empty production sources are named rather than hidden: **SCAR→HEAL is
  HELD on the absent event-log-at-head; DEBRIS/RECLAMATION/ABANDONMENT are HELD on the G-60
  machinery being built** (the DW-5d held-arm idiom: a held arm is recorded with its blocker,
  never counted as passing). The clock verification gains N, a tolerance, the reference
  machine, and one under-30s + one over-30s fixture; the restraint check is minted as an
  instrument (i7-style alarm-hue census + animated-element-fraction ceiling, with a
  deliberately-shouting fixture that reds).
- **REG-F's honest bill stated** (the A2.3 precedent): playback runtime + story-pacing
  allocator + twelve beat treatments + skip/replay UI + the clip-export mechanism + new test
  surfaces and the three-census landing cost. REG-F is a BUILD, not an assembly.
- **REG-10 is re-scoped**: the reveal arm is STRUCK (REG-F is the sole owner of
  reveal/playback per §606.3/§613); REG-10 keeps the zoom ladder, interaction register, and
  the cache substrate consuming the timeline annotations — and its exit declares the OVERLAP
  CONTRACT (what plays while what computes) before REG-F consumes the clock numbers.

### A6.3 · Law reconciliations
- **L-REG-27 amended to satisfy G-60 and L-REG-21 at once**: growth-front contact and
  withdrawal MINT dated `RECLAMATION_START` / `RECLAMATION_HALT` recovery operations into the
  LossRegion stream — the trigger creates the dated event; the event drives the map, the film
  beats, and the monotonicity pin. No automatic healing; no beat without a source event.
- **The film taste specimen's judge is THE OWNER** — §606.3/§607.3 post-date the §585 grant and
  the ledger outranks the delegation sweep; REG-F's exit names the owner's verdict explicitly,
  and A5.4's "all judging rounds" is scoped to exclude it.
- **The year-canonicalization inheritance** (§607.2) is a DECLARED one-time same-seed shift on
  the replay/share surface, owner-gated at its arrival — recorded in L-REG-19.
- **The carve-out list restates §585.1 verbatim**: every push and deploy · the fabric cutover ·
  the tuning signature · legal · the cull · `/code-review ultra`.
- **The naming veto's real residuals recorded**: (i) "costs zero" is STRUCK — a shipped
  generator already emits landmark names ("Tannery Row", "Dyer's Bridge") on the overview,
  summary and SOLD-PDF surfaces, coupled to CH-4's category inference; **whether the veto
  extends to these existing surfaces is AN OWNER QUESTION, queued — not auto-removed**; (ii)
  the DM-annotation path persists labels but renders them as point pins, not street-following
  lettering — L-REG-17's register-consistent annotation dress is the veto's surviving work.

## Amendment A7 — the minimum-footprint law (owner, §630)

| Law | Statement | Source |
|---|---|---|
| L-REG-30 | No small one-room blocks: a drawn building meets a minimum short-axis dimension AND minimum area; sub-minimum with a drawable neighbor fuses into it; isolated sub-minimum is not drawn. Ink-side only (L1) — the fabric building survives untouched. Monument classes never fuse INTO a neighbor (they may absorb). Floors measured by the lane, signed by the chair, tuning-surface constants. | §630 |

Home: REG-4. Exit gains: a sliver census (armed corpus, zero sub-minimum drawn buildings,
with a planted-sliver liveness control) and a REG-3 silhouette non-regression spot-check.

## Amendment A8 — the bridge law and REG-5's enlarged charter (§635)

| Law | Statement | Source |
|---|---|---|
| L-REG-31 | A bridge deck aligns to the normal of the river's local tangent within ±15° (chair's provisional band); the approach road kinks at the bridgehead — the deck is never skewed to save the road a bend; fords exempt. | §635.5 |

REG-5's charter now opens with the maintenance acts (§634.3 kit consolidation ·
`classify.mjs` group-id cure + i1/i5/i7 baseline re-records declared + i5 re-verify ·
the city 10,100 ceiling byte-edit · registering REG-4's three fabric modules with the
stageManifest/derivationGraph walkers) and carries three named deliverables beside the
countryside band: **L-REG-31 bridge alignment** (measure, cure, census + planted
control), **REG-QUAY** (the §635.4 waterfront exemption for moored bodies, drawn-quay
census + planted control), and the **byte-ceiling mint** for the signed ratchet unit.
The wall:all watch row (§635.3) binds: re-measure BEFORE any circuit-softening change.

## Amendment A9 — the bridge-siting law (owner, §637)

| Law | Statement | Source |
|---|---|---|
| L-REG-32 | A bridge sites at a local NARROWS within a road-network corridor; the roads bend toward the bridge, never the deck or site toward the roads. A road far from a narrows follows the bank. Fords mirror: wide shallow reaches. Engine-event bridges (if any) never move — derivation-time bridges re-site as declared repair. | §637 |

REG-5 carries the MEASURE only (span-vs-narrows ratio per corpus bridge + the placement
code site). **REG-BRIDGE** is the cure car: after REG-5, before REG-6; it moves the
street web, so the wall:all watch row (§635.3) and a bridgehead-faubourg re-measure
(§636/§632.4 liveness) are part of its exit.

## Amendment A10 — REG-D re-founded on the growth ledger (§643)

REG-D's dependency row updates: its input is the GROWTH LEDGER's emitted decline/debris
states (DESIGN_REG_GROW.md A1.4 — LossRegion lifecycle, hf379 time-clock, pressure-clock
recovery), superseding the "LANDED mechanisms only" binding of A6.2 for decline substrate.
REG-D remains dress-only: it draws reached states, it never invents them. Sequenced after
REG-GROW-B lands its ledger.

## Amendment A11 — the cultivated-land sizing law (owner, §644)

| Law | Statement | Source |
|---|---|---|
| L-REG-33 | Cultivated area scales with tier under a subsistence→trade inflection: thorp→village fields sized to feed the population (sourced acres-per-capita, tuning-surface); town→metropolis local extent decelerates below self-sufficiency while near-ring INTENSITY rises (gardens/orchards/closes) and trade dependence stays visible through the drawn roads, markets, quays. | §644 |

Home: REG-H, beside the mosaic. Exits: per-tier area census against the band with a
planted over-cultivated control; the self-sufficiency ratio reported per settlement.
Frame-correct under REG-GROW: extent reads the ledger's population per epoch.

## Amendment A12 — the conformance block compiled, the law table extended, the arc restated (§647)

**This amendment compiles what §§639–646 minted in the ledger into the program's own pages.
Where an ODQ section carries more detail, it governs; this is the finding aid.**

### A12.1 · New laws (numbered here; full text at their ODQ homes)
| Law | Statement (short) | Source |
|---|---|---|
| L-REG-33 | Cultivated land scales with tier: subsistence (extent ∝ population) → trade (extent decelerates, near-ring intensity rises) | §644, A11 |
| L-REG-34 | LEGEND AGREEMENT: every legend row has ≥1 locatable instance; every drawn glyph class is taught; planted-orphan control | §646.1i |
| L-REG-35 | EVENT ADDRESS: every dated event label sits at its addressable place (road/gate/seat/wall), never open water or empty field | §646.1iii |
| L-REG-36 | RUINS NEED ADDRESSES: a decay-state body on high-pressure ground traces to an anchoring event or does not stand | §646.1ii |
| (candidate) | QUARTER-NAME-EARNED: a named quarter's geometry visibly earns its name — REG-9 ratifies or strikes | §646.1iv |
| (census) | TANGENTIAL-OR-CLEAR at the wall: §575's law gains its own census (buildings near the wall tangential or clear; no footprint crosses) | §645.2 |

### A12.2 · The conformance block, one charter row per car
| Car | Scope (compiled) | Grounding / gates | Exits (headline) |
|---|---|---|---|
| **REG-ROUTE** | Water is an ABSOLUTE corridor refusal; landings terminate corridors (ferry/quay glyph); a gate at EVERY wall crossing or the way is severed; the weaving coast road; stranded zero-mouth fragments (honeycombs lawful, §640.2); grade response + crag avoidance; map-edge gates; opens by DIAGNOSING the black bars; approach-road presence (§646) | Internal-contradiction class — ungated (§640.3) | crossing census (every crossing gated), corridor-water census, fragment census, all with planted controls |
| **REG-DEF** | Gate breach vs gatehouse width; tower rhythm with bowshot logic; keep/citadel for military foundings (Kitaqiao's cartouche says garrison, §645-era read); siege-camp standoff per R-MORPH's Corfe band (camps ≥~400 m) | R-MORPH §6 at weights grade (one-site caveat) | rhythm census; keep-presence census on military foundings |
| **REG-WATER** | Upstream/downstream as WEIGHTS (dossier: intramural tanners lawful); water-draw contamination weighted-real; mills adopt R-INST-2 §11 (waterPower enum incl. wind/horse, era gates, mills NOT universal) + PRESENCE clause (a 20k city has mills, §646.2); conduit/well ternary; the RIVER-UPHILL drainage defect (own measure first); townLayoutV2.js:209 name-match residual | §640.2 weights-not-walls | siting-weight census; mill-presence census; drainage measure |
| **REG-SITE** | Institution siting as PULLS AND DRAWS (§640.2): hospitals edge-or-gate; fairs hall-or-field; noxious edge/water pull, intramural lawful; town hall DRAWN; market institutions unified with the drawn square; coaching inns on approaches; graveyard/churchyard PRESENCE census (§646.2); toll bridges need water | Dossier-confirmed rows; §638.2 satisfied | per-institution pull censuses; presence censuses |
| **REG-H** | The hinterland mosaic (meadow/pasture/common/waste/orchards — the surface `fields.js` promises and never publishes, §641.2); floodplain-meadow INVERSION (R-MORPH: never ploughed, most valuable); field lanes + farm tracks; tenure consistency (Elton); L-REG-33 sizing law with per-tier area census; grazed-common ≠ dense canopy (§646.2); frame-correct via the growth ledger | R-MORPH §1 payload-grade — GATE OPEN (§642.2) | mosaic-share census per tier; area-band census + over-cultivation control; self-sufficiency ratio reported |
| **REG-TERR** | In-town slope expression (terrace/stair/contour streets — weights grade, gradients unminted per R-MORPH §4 flag); relief expression SHEET-WIDE (a steep-hills cartouche with zero relief marks, §646.2); the open-water stroke tangle cure | R-MORPH §4 digest-grade | slope-response census on relief≥band leaves |
| **REG-BRIDGE** (in flight) | River-profile mint → fords drawn (wide reaches) → narrows re-siting + bent approaches → floating decks + angle outliers (excess predicate) → carto:bridge disposition | §641.5; L-REG-31/32 | see the lane brief; two independent instruments must agree |
| **REG-GROW A/B** | docs/DESIGN_REG_GROW.md + its A1 (the ledger/frame split; no invented history; T2 rides A) | §643 | the differential passes; snapshot divergence; totality walker |

### A12.3 · The arc, restated once (supersedes §370's order)
REG-BRIDGE (in flight) → REG-GROW-A → REG-GROW-B → REG-ROUTE → REG-DEF → REG-WATER →
REG-SITE → REG-H → REG-TERR → REG-6 → REG-7 → REG-8 (+L-REG-34/35 censuses) → REG-9
(judging AFTER conformance; quarter-name candidate ruled; third warehouse round already
owed) → REG-D (ledger-founded, A10) → REG-10 → REG-11 → REG-F0 → REG-F (owner judges
the film specimen) → REG-P (the port; totality walker bill; tierForPopulation ≡
popToTier gate). Side obligations ride their owners (TE-WSEAM measure · COVER-REFRESH ·
dead-code sweep · the §646 dress rows in REG-6/7).

### A12.4 · The signed-constants register
Every chair-signed constant now lives in **docs/SIGNED_CONSTANTS.md** — one sheet,
three statuses (CHAIR-SIGNED vetoable · OWNER-SIGNED · UNMINTED-PENDING), maintained at
every signature; it is the tuning pass's walking sheet.

## Amendment A13 — THE SPINE RECONCILIATION (§675; supersedes stale clauses BY NAME)

**Authority: DESIGN_SPINE.md body+A1 and ODQ §§669–672. Where any earlier section of
this document conflicts with A13, A13 wins. Inventory: recon-inventory-wave1/2.json
(155 rows, 66+39 clean sections); this amendment rules them.**

### A13.1 · THE ONE ARC ORDER (supersedes §370, A5.2's order, and A12.3 — all BY NAME)
SPINE-1 → SPINE-2 → REG-GROW-A resumes (ledger on the partition) → THE DRESS RE-BASE
(the §653 paint rebuild absorbing the surviving held cars: scenario weight · port
atlas · relief grammar · fabric ink · ford glyph re-cut · road/water layering ·
REG-ROUTE's residue: grade response, crag avoidance, fragments) → registers/zoom
(REG-10-class) → words (REG-8, reduced: cartouche language + denylist; L-REG-34 homes
in the page view, L-REG-35 in the view law) → judging (REG-9, gestalt-first at page
scale) → decline dress (REG-D on ledger/LossRegion states) → REG-11 share → REG-F0
(rescoped: totality walker + any pre-partition legacy layer still alive) → REG-F (the
film; owner judges the specimen) → REG-P (the port: the §652 three-clause check ·
tierForPopulation ≡ popToTier · the vocabulary totality walker · the cutover that
retires the legacy painters, carto:bridge, the legacy port path).
### A13.2 · WAVE-TABLE SUPERSESSIONS: **REG-QUAY is DISSOLVED** (A8's row — a moored
piece is a lawful face; SPINE-2 owns quays). **REG-ROUTE is SUBSUMED** (A12.2 row —
water refusal is spine §3a construction; residue to the dress re-base). **REG-GROW-B
is DISSOLVED into spine construction** (quarter minting = a construction step; ring +
form censuses = spine §6 exits). **REG-BRIDGE's remaining scope is SPINE-2's** (A9's
sequencing clause is dead; L-REG-31/32 carry as construction laws). **REG-6 = the
dress re-base** (its third and final statement; "MF-4 lens build" and "INK AS RENDER
LAW … needs fused geometry" both superseded). **REG-7 = print projection + parity
only** (MF-A1 L4 integration moved to the dress re-base). **A10's dependency
sentence** reads: REG-D consumes the ledger's reached states, sequenced per A13.1.
**REG-F0's charter** reads: the A6.1 emission is partition-native in SPINE-1; F0 is
the totality walker + legacy-layer sweep only.
### A13.3 · LAYER/LAW RETARGETS: §3's L0/L1 rows read "the PARTITION (faces
WARD/BLOCK/PLOT + VOID/FIELD/WATER/LOSSREGION; typed edges WAY/WALL-band/BANK/
CROSSING/BOUND/CLIFF) built per ledger epoch" — parcels/streets-web/wallCircuit
derivations are replaced per spine §5. §4's walls row reads: "the wall FAMILY extends
or reads the BAND FACE, never re-derives" (A1.3/A1.7-M5). The law table stands with
these annotations: L-REG-2/3/6/7's STATEMENTS now bind partition objects (fused
frontages = party-run dissolve; district partition = ward faces; market void = VOID
face; wall termination = the WALL×WATER invariant with water gates/termini). §11 Q1's
density-abstraction question is ANSWERED by A1.2's two-stage aggregation.
### A13.4 · KEEP-BUT-ANNOTATE (the honest class): every clause so marked in the
inventory carries the reading "true as written; its measurement basis re-verifies on
the partition at the wave that consumes it" — the SIGNED_CONSTANTS rows the corrected
RE-VERIFY block names (nine; that file governs the list) carry the same note.

## Amendment A14 — VERIFIER CORRECTIONS TO A13 (§677; the red verdicts ruled)

### A14.1 · THE WALKER HOME (corrects A13.1/A13.2 by name): the A6.1 totality walker
is **SPINE-1's** (SPINE A1.7 M3 governs; SPINE §7's SPINE-2 listing is the walker's
RE-RUN at SPINE-2's exit, stated here so both listings are true). **REG-F0 = the
legacy-layer sweep ONLY.**
### A14.2 · THE WALL TAXONOMY (corrects A13.3): **WALL is a THIN FACE** (SPINE A1.3)
— the face list reads WARD/BLOCK/PLOT + VOID/FIELD/WATER/LOSSREGION/**WALL-BAND**;
the typed-edge list reads WAY/BANK/CROSSING/BOUND/CLIFF plus the band's own boundary
edges. Any earlier edge-list spelling of the wall is superseded.
### A14.3 · A5.2 STANDING CONTENT (superseded BY NAME now): the REG-F sibling clause
("growth plates + share clip ride with REG-11") reads: REG-11 is its own leg per
A13.1; the SHARE CLIP and GROWTH PLATES ride **REG-F** as deliverables. The A5.2
REG-D dependency row reads per A13.2. **REG-T: COMPLETED** (its census executed;
receipt laneREGT-receipt.md) — REG-D's old dependency on it is SATISFIED-HISTORICAL;
its post-spine re-run rides REG-D's opening measure.
### A14.4 · THE FIVE DRESS CARS (fills A13's systematic gap; each split
construction-vs-content per §670.1(v)'s ROUTE pattern): **REG-DEF** — gate placement
+ wall/water termini = SPINE construction (§3c/A1.3); tower rhythm, keep siting, the
siege band = DRESS RE-BASE rows. **REG-WATER** — banks/drainage = SPINE-2; the
upstream/downstream + mill-presence weights = re-base content; `townLayoutV2.js:209`
DIES AT CUTOVER with its module (annotate, never edit — adjudicated). **REG-SITE** —
the pulls/draws land as the POST-SPINE SEATING CAR shaped by SPINE A2.4 (quota deck
from the ledger + §640 scorers). **REG-H** — the mosaic + L-REG-33's DRESS half =
re-base content on FIELD faces; the SIZING half = the constructor per epoch (this is
also A11's split, named). **REG-TERR** — both halves = re-base rows on partition
views. Four ride THE DRESS RE-BASE's slot in A13.1's arc; REG-SITE's content rides
the post-spine SEATING CAR as stated; none is a standalone wave anymore.
### A14.5 · FILM + DECLINE ANNOTATIONS: **L-REG-19's reveal mechanism = the
truncated-fold frames** (SPINE A1.4; the "ONE final render revealed along appearance
years" sentence describes the EFFECT, the fold is the mechanism). **The L-REG-27
family** (A5.1 row · A5.3 G-60 row · A6.3's RECLAMATION_START/HALT mint): LossRegion
is a PARTITION FACE CLASS; the minted recovery events land on the face's state
machine (SPINE §3f).
### A14.6 · A13.4's blanket is CARVED: it covers only rows the inventory marked
KEEP-BUT-ANNOTATE; the A12.2 scope columns of the five dress cars are governed by
A14.4, not the blanket.
