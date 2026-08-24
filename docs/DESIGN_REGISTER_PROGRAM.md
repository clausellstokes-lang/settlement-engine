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
