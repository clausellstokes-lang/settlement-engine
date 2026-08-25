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
