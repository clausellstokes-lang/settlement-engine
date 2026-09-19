# DESIGN_SPINE — the partition: one structure under everything drawn

**Chair-authored (Fable), 2026-08-26, under §669's release. Status: ARCHITECTURE —
five-skeptic panel before any build. Constitution: the §652 three-clause contract ·
§656's reference-base law · §668's clean-room discipline (this design derives from
observed behavior and our own laws; no GPL code was read). Vetoable throughout.**

## §1 · The object

**THE PARTITION** is a planar subdivision of the settled ground, per growth-ledger
epoch, with three levels of face and five types of edge.

Faces (pieces), coarse→fine: **WARD** (a district; carries name-rights, quarter
identity) → **BLOCK** (a contiguous built mass between ways) → **PLOT** (a tenure
piece; carries the building mass and yard). Every finer face lies inside exactly one
coarser face. Special face classes: **VOID** (square/market/green — a piece whose
emptiness is the point, furnished by its vocabulary), **FIELD** (outside pieces under
L-REG-33's sizing), **WATER** (bank-bounded), **LOSSREGION** (a piece with the decline
state machine, per REG-GROW A1.4).

Edges, typed and total (every edge carries exactly one type): **WAY** (ranked: artery
→ street → lane → path; a way is a GAP between faces — it has width but no existence
apart from its flanking faces) · **WALL** (the wrap; carries vintage year, frozen at
raise) · **BANK** (where ground meets water; derived from the §648 width profile — one
water truth) · **CROSSING** (bridge | ford | ferry — a typed edge joining two bank
nodes; §651 verbatim) · **BOUND** (party lines, fences, field balks).

Vertices where edges meet; **FRONTIER** vertices/edges mark where the next epoch may
add pieces (the reference's `extendable`, §665).

Invariants (each an instrument, each with a planted control): planarity (no two faces
overlap) · coverage (settled ground is exactly the union of faces) · edge-type
totality (no untyped edge) · containment (plot ⊂ block ⊂ ward) · **no WAY edge spans
WATER** (§651 — structurally: a way meeting a bank terminates at a bank node) · a WALL
edge coincides with face boundaries only (walls end districts BY DEFINITION).

## §2 · Inputs — truth only, consumed never invented

Site: the heightfield and the channel network with its §648 width profile (**the
profile is the single authority for banks**; `sub.wet` remains terrain wetness for
marsh/refusal beyond channels — the WSEAM ratchet keeps pinning their agreement).
Per ledger epoch: population and tier (via `tierScale`, the sole sizer) · dated events
(wall raises, disasters, founding/extension acts) · institution roster + the §640
seating weights · regional corridors (terminating at frontier or bank nodes) ·
origin type per accretion act (organic | planned | linear/green/row — R-MORPH-grounded,
weights grade until fetched-CONFIRMED).

## §3 · Construction, per ledger epoch (the kernel A1 already ruled, re-targeted)

- **3a FOUNDING (epoch 0):** site + roads constitute the initial frame in the typed
  form its origin demands: a nucleated cluster at a crossing, a row village along one
  way, a planned plat of regular plots when the history holds a founding act (§640.2
  — regularity must be EARNED by a dated act).
- **3b ACCRETION:** pieces are added at frontier edges under the epoch's growth
  pressure. Organic: plot-by-plot along way-edges, T-junction bias, market-street
  widening — the way network GROWS as the gaps between added pieces, never as drawn
  objects. Planned act: a plat lands whole. (The organic/neat guard: accretion
  irregularity is a property of the PIECE-ADDING rule per origin type, judged by the
  gestalt gates and the blind-read instruments — never a post-hoc jitter.)
- **3c THE WALL EVENT:** at a recorded (or derived-then-frozen, provenance
  `derived-frozen`) raise year, the wrap is computed along existing piece boundaries
  enclosing the built faces; gates mint where WAY edges cross it; the wrap FREEZES —
  later epochs may only add gates by recorded act. Tangential-or-clear (§575/§645)
  holds by construction: pieces abut the wall edge or stand off it; nothing crosses.
- **3d UNDER A STANDING WRAP:** growth is infill — plot subdivision and court infill
  under the saturation threshold (GROW-A's measured constant) — then TYPED extramural
  emission only, at gates/roads/bridgeheads, stamped at emission with the reader as
  verifier (A1.5).
- **3e WATER:** banks from the profile; **crossings as typed edges** — bridge at the
  admissible narrows with the 75° kink law (§648), ford at the wide reach, ferry where
  the corridor demands and no deck is earned; quays as water-edge pieces with moored
  sub-pieces (the §635.4 exemption becomes unnecessary — a moored piece is a lawful
  face, not a refused body).
- **3f DECLINE:** pieces empty → abandon → LossRegion per the ruled state machine
  (time-driven decay, pressure-driven recovery, never conflated; §643.3).
- **3g EMISSION:** every face and edge emits A6.1's schema verbatim ({appearanceEpoch,
  withinEpochOrder, disappearanceYear?, provenance, beatEvents[]} + the transient
  channel); the film replays deltas; a frame is the partition truncated at epoch K
  (prefix-closure — append-only deltas, per A1.1's ledger/frame split).

## §4 · Views — paint under the three-clause contract, structurally

Views read the partition plus closed dress vocabularies, and nothing else.

- **PAGE REGISTER — the disciplined projection (§663's law):** the page draws
  **BLOCK-level masses in the reference's size band** (quads-dominant, tight area
  band), arterial ways only, the wrap with its rampart dress, banks and crossings,
  void furniture at B13/V-QUAY bands, field pieces, ward names. Target page budget:
  **hundreds of shapes, not tens of thousands** — pinned by a page-shape census and
  the signed byte ceilings. ⚠ THE IDENTITY LAW: the projection AGGREGATES plots into
  masses but every mass carries its member-plot ids — zoom reveals plots, then
  buildings, then interiors; truth is never discarded, only staged (the register
  ladder's original design, now with its mechanism).
- **ZOOM REGISTERS:** plot-level with yards and the shape families; the full dress
  vocabularies at their chartered registers; monuments always drawn at their own
  register (they never aggregate — L-REG-30's absorb-never-absorbed, generalized).
- Streets are GROUND — the gap rendered as shared surface, never a stroke (§650
  enforced by there being no street object to stroke). The wall is the wrap dressed
  by REG-2's vocabulary. Water is the bank-bounded body with shore strokes (corpus
  grammar). Scenario/history marks ride faces and edges they address (L-REG-35).

## §5 · Replaces / consumes / retires

REPLACES (the defect-bearing core): `streets.js` web derivation · `parcels.js`
packing · `builtUmbrella`/`wallCircuit` extent derivation · `deriveSquares` blobs ·
the road-band painting. CONSUMES UNCHANGED: `tierScale` sizing · the §648 channel
profile · the institutions catalog + §640 seating weights · snapshot's dated events ·
the heightfield · every dress vocabulary and its constants · the ledger kernel
(GROW-A's two S0 modules slot in; its diagnosis is this design's premise). RETIRES AT
CUTOVER (already ruled): the legacy painters, carto:bridge, the legacy port path.
SEALED-WAVE ARMS: `--fuse/--shapes/--market/--footprint` re-target partition faces —
their LAWS and instruments carry; their parcel-era code paths retire with honest
declaration.

## §6 · Exits (every zero with a live control)

i12 tangential-or-clear → **0 BY CONSTRUCTION**, planted-violation control still must
red · the crossing census (every WAY×WALL intersection is a gate; every WAY×WATER
terminates at a bank node) · the WSEAM agreement ratchet (banks vs wet, pinned) · the
REG-4 differential (circuit stands, infill up, sprawl 0, `--break` fails) · snapshot
divergence via truncation (planted growth epoch) · **the page-budget census** (page
shapes within the reference band; bytes at §641.4 ceilings — first wave where BYTES
bind by design) · determinism incl. manifest, double-run, literal flags · dormancy
(`REG_FABRIC_OPTS.partition`; OFF ⇒ byte-identical corpus) · performance (ledger ≤
~2 s metropolis; the page frame ≤ 1.3× today's build; zoom frames on demand) · the
identity law census (every page mass resolves to its member plots; zero orphans) ·
gestalt gates at PAGE SCALE FIRST (§660's order) with fresh-eyes blind reads.

## §7 · Cars

**SPINE-1** (Opus): the partition structure + §3a–3d construction + the page view
skeleton, dormant; exits: invariants, tangential, differential, dormancy,
determinism, page budget. **SPINE-2**: §3e water/crossings/quays + §3f–3g
decline/emission + the identity law; exits: crossing census, WSEAM, snapshot
divergence, totality walker. **Then GROW-A resumes** (ledger integration on the
partition). **Then the dress re-base** (REG-6 absorbing the surviving held cars:
scenario weight · port atlas · relief grammar · fabric ink · ford glyph re-cut ·
road/water layering — most of the rest dissolved by construction).

## §8 · Open questions for the panel

P1: the aggregation rule (plots→masses) — what exactly maps 25–30k truth bodies to a
banded page without identity loss or seam artifacts at mass boundaries? P2: the wrap
algorithm — along-piece-edges hull vs the §575 tangential band; how do 3c's frozen
wraps reproduce today's rings' LOOK (the rampart dress fits what geometry)? P3:
per-epoch planarity maintenance cost — is the ledger ≤2 s claim honest under
subdivision-heavy epochs? P4: the sealed-arm re-target — can `--fuse/--shapes/--market
/--footprint` genuinely re-express on faces, or do any carry parcel-era assumptions
that break? P5: the organic guard — which measurable property separates grown
irregularity from jitter, and does the R-MORPH grounding suffice at weights grade?
P6: anything in §§628–668 this design contradicts or drops.


---

# AMENDMENT A1 — the five-skeptic panel folded in (§670; 0/5 refuted, 7 blockers ruled)

**The build brief reads body + A1; A1 wins conflicts. Panel evidence lives in the §670
collection; rulings only here.**

## A1.1 · THE SUBSTRATE RULING (S1/S5-B1): the partition holds the **REPRESENTATIVE**
substrate — tierGrammar's signed law stands (above village the map is representative
and the cartouche prints the ratio). Measured truth at metropolis: ~4.3k bodies, not
the body's erroneous "25–30k" (corrected; that figure was household-census grade,
which lives in the compendium's data, never in map faces). Census tiers
(thorp–village) draw EVERY building — **aggregation exists only above the census
tiers** (S5-M3). The identity ladder ends at the representative plot + its household
roster as data; the "then interiors" clause is STRUCK (m1 — unminted capability).

## A1.2 · THE PAGE LAW RULING (S1/S5-B2, the panel's own two-stage cure adopted):
the page unit is the **PARTY-RUN MASS** — (stage 1) generalize REG-1's fusion as a
face-set DISSOLVE of interior party BOUND edges along a run (every fusion break is
already a typed edge, so the organic guard and the aggregation rule are ONE law);
(stage 2) chunk adjacent runs within one BLOCK face up to the band ceiling, members
concatenated. The band is pinned in **road-width² space: 2.7–4.6 rw²** (the reference
band under normalization; runs measure 2.9–3.5 rw² — inside). The page budget anchors
to the REFERENCE'S OWN PER-TIER COUNTS (town ≈ the 616-class page; city/metropolis ≈
the Grimfall thousands — "hundreds" was a town-scale figure, corrected). Seam law
(S5-M4): aggregation is face-set dissolve over SHARED edges; simplify each shared
polyline ONCE, both faces reuse it; **one page-mass dress law** — ridge geometry is
truth (one ridge per party-run, hf378) DECOUPLED from chunking; a chunk boundary
never breaks a continuous ridge. Identity census is a **BIJECTION** (S5-M1): every
truth plot is drawn-as-itself XOR owned by exactly one drawn mass, both directions,
checked at the END of the view derivation. After cutover there is **ONE aggregator**
(this one); the §181.2a LOD merge retires with the printed ratio RE-HOMED to the page
register's own emission (S5-M2), and masses carry member unit-lines COUNTED in the
budget (no hollow block-wash — the banned class stays banned).

## A1.3 · THE WALL RULING (S2-B1/B2): **WALL is a THIN FACE, not an edge** — the
band's ground with width, bounded by inner/outer edges, preserving §575's two regimes,
the stones' reserved ground, and REG-2's dress contract (runBands/inkHalf consume the
band face's geometry). **The wrap's trace is derived from the piece enclosure, then
RESAMPLED to the form's facet economy** (the walls.js facet law carries over: the
turn distribution is a property of the FORM) — pieces then conform to the BAND face
(abut or clear), which is what the tangential census measures. WALL×WATER gains its
invariant + law (S2-M1): a wall face terminates at a bank with a WATER GATE or
TERMINUS WORK (minting rules from the sealed vocabulary — hf313's water gate, the
cliff/water termini; S2-M2); the half-ring is a lawful wall face whose fourth side IS
the bank. GATE ECONOMY (S2-M3): gates mint for major ways at the raise; thereafter a
way may NOT cross the band ungated — later ways dead-end at the band, divert to a
gate, or a recorded act mints a postern (the ledger carries it). VINTAGE HONESTY
(S2-M4): the wall event's year comes from the ledger's recorded/derived-frozen value
with provenance — the §11.11 stamp defect (a vintage with no year) is structurally
excluded by the schema requiring the year field. The circuit node's published
contract gets a SUCCESSOR SPEC (S2-M5): typed runs over an ordered vertex cycle,
claims cut from one offset copy — the band face publishes the same surface.

## A1.4 · THE LEDGER RECONCILIATION (S3-B1): DESIGN_REG_GROW A1.1 stands with one
declared refinement — the ledger remains the pure DATA pre-stage; **the PARTITION
CONSTRUCTOR is a single-shot stage that FOLDS the ledger's epochs inside one build**
(one construction per build; lawClaims built once from the FINAL partition; a frame =
the same fold on the truncated ledger — prefix closure preserved because the fold is
append-only). The narrow reading "buildFabric stays byte-wise as-is" is SUPERSEDED by
name, here.

## A1.5 · INPUT PROVENANCE (S3-B2): SPINE-1 does not trust broken producers — the
corridor water-refusal cure is ABSORBED into §3a (corridors terminate at bank/frontier
nodes by the partition's own construction; REG-ROUTE's row is thereby subsumed and
its remaining scope — grade response, crag avoidance, fragments — re-charters as a
post-spine dress car). The §640 seating weights are NOT SPINE-1 inputs — institution
seating remains its own car (CAR-SEATING held per the review; S3-M6), and CAR-FRAME
is ABSORBED by the page view (frame-to-extent is the view's first duty).

## A1.6 · CONSTRUCTION COST (S4-B): batch per-epoch re-noding is REFUTED by
measurement; the constructor is **INCREMENTAL — one maintained arrangement, epochs
APPEND into it** (the panel's own one-shot noding of 108k segs in ~1.5 s proves the
scale feasible; append-only matches prefix closure). The cost model is stated: ~40
banded epochs is the multiplier and is priced, not assumed. **The performance exit
gains an OWNING instrument and car** (S4-M1): a perf harness with a PINNED protocol
(warm process, three samples, per tier) lands IN SPINE-1; budgets: constructor ≤
2.5 s metropolis warm; page frame ≤ 1.5× the pinned warm city baseline (1.29 s).

## A1.7 · COMPLETENESS SWEEPS (S3): **CLIFF joins the edge taxonomy** (M1 — live
fabric at the seal). **The accessible-lens arm joins §6** (M2 — the same omission
A1.6-GROW cured; it is now a standing checklist item for every architecture doc).
**A6.1 emission moves INTO SPINE-1** (M3 — L-REG-26 binds every wave; the totality
walker rides with it). **GROW-B's content is restored**: quarter minting (§3f-GROW)
is a construction step consuming ledger tier-threshold events; the ring census and
form census join §6 (M4). The §5 ledger completes over the wall family (M5:
walls.js/wallRuns/circuitDemotion/districtPartition/epochAxis each named — extend or
read the band face, never re-derive) and the arm declaration covers ALL TEN arms
(M10 — the I1 lesson). L-REG-34's legend census homes in the page view's exit (M7);
L-REG-5's regime inputs (readiness/era/prosperity) join §2 (M8). SPINE-1's exits
regain the WAY×WALL crossing half (M9 — SPINE-1 builds gates, so it proves them).
m3 banked: packed.blocks are lane-padded quads — never partition faces.

---

# AMENDMENT A2 — THE MATHEMATICS ADOPTED (§676; ideas from the §673 code study, expression firewall attested in laneRWCODE-receipt.md)

## A2.1 · THE STOP-RULE SUBDIVISION (P1's mechanism — adopted). Plot generation inside
a block face is a recursive guillotine cut that HALTS when a piece's area falls below
a threshold drawn per ward from a floor area scaled by 2^(±2·chaos). The size band is
therefore MANUFACTURED by the halt condition — the §6 page-budget census becomes a
VERIFIER of the mechanism, never a legislator against it. **Cut-time edge typing:**
while pieces are coarse, cuts open gap edges (typed WAY at lane rank); below a
stochastic area bar, cuts are gapless (typed party BOUND) — so party-wall runs are
GENERATED, and A1.2's stage-1 dissolve is the exact inverse of the cut that made
them: subdivision and aggregation are ONE law.
## A2.2 · THE ORGANIC GUARD METRICS (P5 closed). The reference contains ZERO
coordinate noise; its order/irregularity balance is entirely DECISION statistics —
relaxation privileged to the center, seeded spirals, jittered cut choices, and a
junction weld that manufactures T-dominance. The guard therefore measures: roundness
gradient center→edge · junction-degree mix (T vs X share) · cut-angle variance by
recursion depth — and NEVER spectral/jitter metrics. "Never post-hoc jitter" (§3b)
is enforceable: any coordinate-noise op class in i8's roster inside the constructor
is a conviction.
## A2.3 · DERIVED-WRAP GATE MINTING (the §3c history-silent case). Gate candidates =
wrap vertices where ≥2 interior pieces meet; spacing by cycle decimation (choose one,
suppress neighbors); every gate carries a GATE-ROAD GUARANTEE (split the outer piece
if no outgoing corridor exists); street-reachability is a rejection gate. Recorded
history always wins where it speaks.
## A2.4 · THE QUOTA-DECK / SCORER DECOMPOSITION (noted for the future seating car,
not SPINE scope): ward-mix as a quota deck with SLUM-AS-OVERFLOW (poverty as
emergence — aligned with our wealth truth, which supplies the deck from the ledger)
separated from per-type location scorers (the §640 weights). The four-dial ward
dress tuple (lot floor · two chaos dials · emptiness) is the wealth-legibility
mechanism the rich/poor laws asked for.

## A2 addendum (§677) · THE INTERIORS POINTER: A1.1's struck "then interiors" clause
resolves per §672.1 — interiors are THE DWELLINGS PROGRAM'S MINT: the identity ladder
ends at the representative plot + its household roster until DW lands, whereupon the
ladder's final rung reads "then DW's interiors" (the plot face carries the DW
binding). §4's zoom sentence reads accordingly.
