# R-WATABOU-CODE — the reference generator's algorithms, as ideas

**Lane R-WATABOU-CODE (Fable research seat), 2026-08-25, under ODQ §673. Status:
CONFIRMED-by-reading throughout — every claim in this document was verified against
the reference implementation's source on the read dates logged in the lane receipt
(`receipts/laneRWCODE-receipt.md`); the receipt, not this body, carries file paths.
THE EXPRESSION FIREWALL (§673.2) governs this document: everything below is the
algorithmic idea restated in our words and mathematics; pseudocode is generic
notation; no identifier, comment, or structural transliteration from the source
appears here. Spine citations refer to docs/DESIGN_SPINE.md (§/A1 rows) and
docs/SPINE_DECISION_2026-08-26.md.**

Scope note: the studied desktop generator is the older open predecessor of the live
web app. It contains **no water at all** — a water-body field is declared in its
model and never populated, and no bank/crossing code exists in the generative chain.
Everything we ruled about water (§3e, A1.3 WALL×WATER) has no counterpart here; our
§648/§651 water design is ours alone. Also confirmed: the generative chain uses **no
coherent noise** — a Perlin implementation ships in its utility package and is never
touched by the generator. The organic feel has entirely structural sources (§7 of
this dossier).

The pipeline, end to end, is a strict one-shot sequence:

> seed points → Voronoi partition → selective relaxation → junction welding →
> wall wrap + gates → streets by shortest path → ward-type assignment →
> per-ward block inset → recursive building subdivision → density culling at the
> fringe → draw.

Wrapped around the whole pipeline is a **rejection loop**: any stage may declare the
result malformed (two named cases: a fortress piece below a roundness floor; a gate
that cannot reach the center), which aborts and regenerates from scratch until a
build survives. Quality is partly enforced by resampling, not only by construction.

---

## 1 · Patch seeding and relaxation — how the ground is cut into pieces

### The idea

The settled ground is a Voronoi partition of a **spiral point cloud**. Points are
laid on an outward spiral: point *i* (of 8·N, where N is the city's piece count)
sits at polar angle θ₀ + c·√i and radius r(i) = r₀ + i·(a + u), with θ₀ random,
c ≈ 5 radians, r₀ = 10, a = 2, and u a fresh uniform draw in [0,1) per point. Point
0 sits exactly at the origin. Three properties fall out:

- **A guaranteed center.** The origin point's cell is the central piece; the town
  has a middle by construction, not by search.
- **Cells grow with distance.** Radial spacing per index is roughly constant
  (≈ 2–3 units) while ring circumference grows, so point density falls with radius:
  small tight pieces at the center, big loose ones outward — the medieval density
  gradient for free, before any relaxation.
- **Structural irregularity.** The per-point radius jitter u makes every cell
  irregular *at birth*; no post-hoc noise is ever applied to coordinates.

The Voronoi is computed by incremental Delaunay insertion (Bowyer–Watson: find
triangles whose circumcircle covers the new point, re-triangulate the cavity) inside
a bounding frame; cells touching frame-derived vertices are discarded, which is why
8× more points are seeded than pieces needed. Cell polygons are the circumcenters of
a seed's incident triangles, angle-sorted.

Points are then sorted by distance from the origin, and the first N cells become the
city (the innermost cell may become the plaza); cell N — the **closest cell outside
the ring** — becomes the citadel when one is wanted. City size is expressed purely
as N: observed tier ladder 6 / 10 / 15 / 24 / 40 (small town → metropolis),
default 15. Three independent coin flips (p = 0.5 each) decide plaza / citadel /
walls existence.

### The center privilege: selective relaxation

Lloyd relaxation (move a seed to its cell's centroid, rebuild) is applied **three
iterations, and only to four seeds**: the three innermost points and the future
citadel's seed. Everything else keeps its born irregularity. The result is a
regularity *gradient*: compact, well-shaped central pieces (plaza, market frontage)
and the citadel, decaying into raw Voronoi irregularity at the periphery.

### The junction weld

After partitioning, any two adjacent vertices of a city piece closer than a **weld
epsilon of 8 units** (4× the main-street width — aggressive) are merged to their
midpoint, and the merge is propagated to every piece sharing the vertex, with
duplicate-vertex cleanup. This kills sliver edges and converts near-degenerate
four-ways into clean three-way junctions — the T-junction dominance a reader parses
as "grown, not drawn."

### Against our spine

- **Identical in law:** the partition-first substrate (SPINE §1); the settled ground
  as one planar subdivision with the drawn map a view of it (SPINE_DECISION §3);
  representative substrate at every scale — the same piece grammar at N=6 and N=40,
  scale changes count never character (A1.1, §663–664 evidence).
- **Different, ours-justified:** we build the partition per growth-ledger epoch from
  real history (§3a–3d); the reference is single-shot with no time axis. Our origin
  types (§3a: nucleated/row/planned) have no counterpart — the reference has exactly
  one morphology, the nucleated cluster.
- **Worth adopting as idea (feeds P5, the organic guard):** *regularity is applied
  where order is earned, never jitter where chaos is wanted.* The reference's whole
  organic character is structural: spiral seeding with radius jitter, selective
  central relaxation, junction welding. Our §3b guard ("irregularity is a property
  of the piece-adding rule … never a post-hoc jitter") is exactly this philosophy;
  the reference gives us the measurable form: **cell roundness (isoperimetric
  quotient) graded center→edge, with a weld epsilon several times the lane width
  producing T-junction dominance.** Both are blind-read instrument candidates.
- Also worth holding: the isoperimetric quotient 4πA/P² is the reference's only
  shape score. It gates the citadel (rebuild below 0.75) and selects farm-worthy
  countryside (0.7 floor). One scalar, three uses — cheap and effective.

---

## 2 · Ward assignment — how pieces get their kind

### The idea

Ward types are assigned by a **quota deck plus greedy location scoring**:

1. **Reserved assignments first.** The central piece (if a plaza was flipped) is the
   market/plaza. Pieces touching a wall gate become gate-quarter wards with
   probability 0.5 (walled town) or 0.2 (open town).
2. **A fixed 36-card deck** encodes the type mixture: 21 craftsmen (the default
   urban tissue), 5 slum, 2 market, 2 merchant, 2 patriciate, and 1 each of
   temple, administration, military, park. The deck is *slightly* shuffled —
   ⌊36/10⌋ = 3 random adjacent-pair swaps — so the canonical order mostly survives:
   early cards (craftsmen, merchant, temple) claim pieces while choice is rich;
   tail cards land late. Deck exhausted (N > 36): every remaining piece is a slum —
   big cities grow slums by *overflow*, an emergent poverty law.
3. **Per-type location scoring.** Each typed card is placed on the unassigned piece
   minimizing that type's score (lower = better); types without a scorer place
   uniformly at random. Observed scorers, as ideas:
   - *merchant:* distance to plaza/center (wants the middle);
   - *slum:* negative distance to center (wants the edge);
   - *temple:* if a plaza-bordering piece exists, prefer the largest such; else
     distance-to-center × area (close and small);
   - *administration:* plaza-bordering beats everything, else closest to plaza;
   - *military:* citadel-bordering beats wall-bordering beats nothing; impossible
     (score +∞) when neither wall nor citadel exists;
   - *market:* refuses adjacency to an existing market (+∞), else prefers area
     ratio to the plaza near 1 (a market should not dwarf the plaza);
   - *patriciate:* counts neighbors — a park neighbor attracts, a slum neighbor
     repels (the only purely social scorer).
4. **Countryside.** Non-city pieces: 20% of those with roundness ≥ 0.7 become
   farms; the rest stay empty ground. Outer pieces beyond 3× the wall radius are
   discarded entirely.
5. **Gate suburbs.** For each wall gate, with probability 1 − 1/(N−5) the outer
   pieces at the gate are annexed as gate-quarter suburbs — nearly always, at city
   scale. Extramural growth clusters at gates by rule.

Randomness enters at exactly four points: the three existence coins, the deck
shuffle, the unrated-type uniform pick, and the per-ward parameter draws (§5). All
placement else is deterministic greedy scoring.

### Against our spine

- **Identical in law:** wards as the coarse faces carrying quarter identity
  (SPINE §1); gate-quarters and extramural emission typed at gates/roads (§3d).
- **Different, ours-justified:** our mixture must come from the ledger — population,
  tier, institution roster, dated events (§2; A1.5 keeps institution seating its own
  car). The reference's deck is population-blind: a pure prior. Ours replaces the
  deck's *content* with truth but can keep its *shape*.
- **Worth adopting as idea:** the **two-part decomposition — a quota mixture
  (what exists, in what proportion) separated from per-type location scorers (where
  it sits)** — is exactly the shape CAR-SEATING wants: our §640 seating weights are
  the scorers; the tier/population ledger is the deck. The overflow-slum rule and
  the neighbor-social scorer (attract/repel by adjacent ward class) are cheap,
  legible mechanisms we did not have written down anywhere.

---

## 3 · The wall wrap — enclosure, circuit, towers, gates

### The idea

**Which pieces are enclosed:** exactly the N city pieces (minus nothing) — the wall
is the boundary of the city piece-set. The citadel, sitting *outside* the ring on
its own piece, gets its own private wall by the same machinery.

**The circuit polygon** is derived by an **outer-edge walk**: collect every piece
edge that no other enclosed piece traverses in the opposite direction (interior
shared edges appear twice, opposed; boundary edges once), then chain those directed
edges start-to-end into the single circumference cycle. This is our "wrap computed
along existing piece boundaries" (§3c) as literal machinery.

**The facet economy:** the raw circumference is then smoothed — every vertex not in
a reserved set is moved toward the average of itself and its two neighbors (weights
1 : f : 1 with f ≈ 1, i.e., roughly the three-point mean). Reserved vertices (where
the citadel's own shape meets the city wall) are pinned. Gate vertices get a second
smoothing pass. Net effect: the wall trace is a *straightened, calmer* version of
the piece boundary — fewer effective facets than the underlying pieces — while the
pieces themselves keep their jagged edges *behind* the wall line. Note the
consequence: after smoothing, the wall polygon and the piece boundaries are no
longer coincident; buildings still inset from the *piece* edge with an extra
main-street clearance wherever the piece edge lies on the wall (§5), so the band
between wall trace and built mass reads as a pomerium street.

**Gates** are chosen before any street exists, by candidate decimation:

- Candidates: circumference vertices where ≥ 2 enclosed pieces meet (junction
  vertices — guaranteeing an interior street can leave the gate), excluding
  reserved (citadel-contact) vertices. Zero candidates ⇒ malformed, regenerate.
- Loop: pick a candidate uniformly at random, mint a gate there, then delete it
  *and its two cycle-neighbors* from the candidate set; repeat while ≥ 3 candidates
  remain. This is blue-noise spacing on a cycle by decimation — no two gates
  adjacent, gate count scales with circuit length, placement stays random.
- **Gate-road guarantee:** if a minted gate touches only one outer piece (no
  outgoing edge into the countryside), that outer piece is *split in two* along a
  line from the gate to its most-outward-pointing vertex (scored by the dot product
  with the wall's outward normal at the gate), manufacturing the missing road
  corridor. The partition is edited to make the road network's existence true.

**Towers** are stamped at every circumference vertex that is not a gate (on active
wall segments); the citadel's towers draw larger. Gates render as a bar across the
wall direction; the drawn wall stroke is thick (0.9× main-street width), towers
≈ 1.8-unit radius dots.

### Against our spine

- **Identical in law:** wrap along piece boundaries, gates as the only crossings,
  freeze-after-raise tangential-or-clear by construction (§3c, §6 i12); the
  facet-economy resample of the trace (A1.3: "derived from the piece enclosure,
  then RESAMPLED to the form's facet economy" — the reference does precisely this,
  by neighbor-mean smoothing with reserved-vertex pins); towers-at-vertices,
  gate-as-bar (REG-2's dress vocabulary already matches the look).
- **Different, ours-justified:** our wall is a thin FACE with width and its own
  dress contract (A1.3), carries vintage, freezes, and gains posterns only by
  recorded act (S2-M3); the reference's is an ageless polyline. Our gate law runs
  the other direction in grown epochs — ways exist first, gates mint where ways
  cross the raise (§3c). The reference *chooses gates first, then routes streets
  from them* — junction-degree candidates, spacing by decimation, corridor
  manufactured if missing.
- **Worth adopting as idea:** that inversion is exactly right for our
  `derived-frozen` wraps (§3c) — when history records no gate positions, mint them
  from junction-degree candidates with cycle-decimation spacing, then let the
  street tracer prove each one (unreachable gate ⇒ malformed, re-derive). The
  **gate-road guarantee** (edit the outside partition so every gate owns an
  outgoing corridor) answers a defect class our old builder had (gates opening onto
  nothing) *structurally*, and belongs in §3c's construction.

---

## 4 · Streets — gates to center, edges as ways, widths

### The idea

The street graph is **the partition's own vertex-and-edge graph** — nodes are piece
vertices, edges are piece edges weighted by Euclidean length. No new geometry is
ever invented for a street; a street IS a chosen chain of piece edges. Vertices on
the citadel or on the wall (except gates) are struck from the graph (blocked);
vertex sets inside vs outside the city are tracked so a search can be confined to
either side.

- **Interior streets:** for each gate, shortest path (uniform-cost search over edge
  lengths; the implementation's frontier is FIFO rather than priority-ordered — an
  approximation it tolerates) from the gate to the *nearest plaza corner* (or to
  the center vertex when no plaza exists), with countryside vertices excluded. An
  unreachable gate aborts the whole build (the rejection loop again).
- **Country roads:** for each wall gate, a far point is projected radially outward
  (the gate direction scaled to a kilometer-scale constant), the existing vertex
  nearest that projection is taken as the road's origin, and the shortest path runs
  origin→gate confined to countryside vertices. Roads therefore *approach gates
  radially* and follow existing piece edges — field-boundary roads, not spline
  roads.
- **Deduplication and merging:** all streets and roads are cut into directed
  segments; segments along the plaza boundary are dropped (the plaza face is
  itself the way surface); duplicates are removed; surviving segments are chained
  end-to-end into maximal polylines — the artery list. Every artery then gets one
  smoothing pass: each interior vertex moves to the (1,3,1)/5 weighted mean of
  itself and its neighbors; endpoints (gates, plaza corners) stay pinned. Because
  street vertices ARE piece vertices (shared object identity), this smoothing
  visibly relaxes the adjoining piece outlines too — street and block agree after
  smoothing for free.
- **Width ladder:** three constants — main street 2.0, regular street 1.0, alley
  0.6 (ratio 10:5:3) — consumed as *clearance half-widths* during block inset (§5),
  and at draw time the artery renders as a 2.3-wide dark band with a 1.7-wide
  paper-colored core (an outlined road, cap-less so junctions merge).

### Against our spine

- **Identical in law:** the way as a GAP between faces with width but no
  independent existence (§1); streets-are-ground, nothing strokes a street object
  (§4 — the reference's plaza-segment drop is a literal instance: where the way is
  a face, the polyline dies); arterial ways only on the page register (§4: it draws
  arteries and nothing thinner as lines — thinner ways exist only as building
  clearances).
- **Different, ours-justified:** our ways are grown per epoch with T-junction bias
  and market-street widening (§3b) and are ranked artery→street→lane→path (§1) —
  four ranks to the reference's three widths; corridors from the regional truth
  terminate at frontier/bank nodes (§2, A1.5). The reference's gate→center star is
  a single morphology; our history can produce it (§3a nucleated) but is not
  limited to it.
- **Worth adopting as idea:** (i) **the shared-vertex smoothing trick** — because
  ways are piece edges, one smoothing pass relaxes both the way and its flanking
  faces coherently, no seam maintenance; our incremental arrangement (A1.6) should
  keep way polylines and face boundaries as one shared geometry, never two copies.
  (ii) The **radial far-point road tracer** for countryside roads at derivation
  time when the regional corridor truth underdetermines local approach geometry.
  (iii) The **width ladder magnitudes**: main : regular : alley ≈ 2 : 1 : 0.6 in
  units where a modest house side is ~3–4 — i.e., a main street about half a house
  side, an alley about a sixth. Useful normalization anchors for our rw² band
  arithmetic (A1.2).

---

## 5 · Block → building subdivision — the packed masses and the tight band

### The idea

**Step 1 — the block inset.** A ward piece becomes a buildable block by insetting
every edge by half the clearance its far side demands: wall-adjacent edge →
main/2; artery- or plaza-adjacent edge → main/2; ordinary interior edge →
regular/2; countryside-facing edge → alley/2. Convex pieces use a plain inward
offset; concave ones go through a self-intersection-resolving buffer (offset every
edge, find all self-intersections, keep the largest simple sub-polygon). This is
the entire street-space mechanism: streets are what insetting leaves unbuilt, and
a main street is wide because *both* flanking blocks each ceded half of it.

**Step 2 — recursive guillotine subdivision with two chaos dials.** A block is
recursively cut into building lots:

```
SUBDIVIDE(piece, A_min, chaosG, chaosS, p_empty, allow_gap):
  e      ← the piece's longest edge
  t      ← 0.5 + (u − 0.5) · 0.8 · chaosG          # cut point along e; u uniform
  φ      ← (u − 0.5) · (π/6) · chaosG              # cut-angle deviation from ⊥e
           (forced to 0 when area(piece) < 4·A_min  # small lots cut square)
  gap    ← alley width if allow_gap else 0
  halves ← cut piece by the line through e(t) at angle ⊥e + φ, opening gap
  for each half:
    stop_area ← A_min · 2^(4 · chaosS · (u − 0.5))  # lognormal-ish stop threshold
    if area(half) < stop_area:
        emit half as a building unless u < p_empty  # stochastic courtyard/void
    else:
        child_gap ← area(half) > A_min / (u₁·u₂)    # gaps only at coarse levels
        recurse(half, …, child_gap)
```

Four load-bearing properties:

- **The tight size band is the STOP RULE.** Lot areas land in
  A_min · 2^(±2·chaosS) — a lognormal-ish band one parameter pair wide. The
  reference band our audit measured on the live app's exports (A1.2: 2.7–4.6 rw²)
  is *manufactured by this stop rule*, not by post-selection.
- **Quad dominance is the cut rule.** Cutting perpendicular to the longest edge at
  a near-middle point keeps aspect ratios bounded and children 4–5-sided; the
  angle jitter is *suppressed entirely* for pieces under 4× the stop area, so the
  finest lots — the ones the eye reads — are cleanly rectangular even in chaotic
  wards.
- **Alleys are coarse-level gaps; party walls are fine-level no-gaps.** The gap
  (alley width 0.6) opens only while pieces are still large — the child's gap
  eligibility is a stochastic area threshold (area > A_min/(u·u), a heavy-tailed
  bar that fine pieces rarely clear). Below it, cuts are gapless: lots share
  edges, and contiguous gapless runs read as one built mass with party walls.
  **Blocks → alley-separated clusters → party-wall runs, in one recursion.**
- **Emptiness is a per-ward probability** (3–25%): dropped lots become courtyards
  and gardens, denser wards drop fewer.

**The per-ward parameter table** (roles: minimum lot area A_min; grid chaos —
cut-point and angle jitter; size chaos — stop-band width; emptiness):

| ward kind      | A_min (u uniform)      | grid chaos      | size chaos | empty |
|----------------|------------------------|-----------------|-----------|-------|
| craftsmen      | 10 + 80·u²  (skews small) | 0.5 + 0.2u   | 0.6       | 0.04  |
| merchant       | 50 + 60·u²             | 0.5 + 0.3u      | 0.7       | 0.15  |
| patriciate     | 80 + 30·u²             | 0.5 + 0.3u      | 0.8       | 0.2   |
| slum           | 10 + 30·u²             | 0.6 + 0.4u      | 0.8       | 0.03  |
| administration | 80 + 30·u²             | 0.1 + 0.3u      | 0.3       | 0.04  |
| gate quarter   | 10 + 50·u²             | 0.5 + 0.3u      | 0.7       | 0.04  |
| military       | √(blockArea)·(1+u)     | 0.1 + 0.3u      | 0.3       | 0.25  |

Read the table as a *language*: poverty = small lots + high chaos + low emptiness
(slums are dense and jumbled); wealth = large lots + moderate chaos + high
emptiness (gardens); institutions = large lots + LOW chaos (order is the signal of
authority); the military yard derives its lot size from its own block (few big
sheds and a parade gap, 25% empty). The u² draws skew every ward small-lot-ward
with a long tail — most craftsmen wards are fine-grained, a few are coarse.

**Monumental buildings** (castle, temple when not cloistered) use a different
recursion: fix TWO orthogonal cut directions once (the block's longest-edge
direction and its perpendicular) and always cut near the middle (t ∈ [0.4, 0.6])
along whichever fixed direction is more transverse to the current longest edge;
stop at a large threshold with a fill probability deciding which pieces survive
(castle ≈ 0.6, temple ≈ 0.8). One shared orientation ⇒ the surviving rectangles
read as a single articulated building (keeps, halls, wings) rather than a village.
The temple has a 40% alternative: an **annular cloister** — peel inward-offset
strips off each block edge, shortest edges first (thickness 2–6), leaving the
courtyard. The castle's site insets by 2× main-street before building (the bailey);
its lot threshold scales with √area of the site itself.

**The plaza** gets furniture, not buildings: a statue (60%: rectangle 1–2 × 1–2,
rotated to align with the plaza's longest edge) or a fountain (circle r 1–2),
offset from the centroid 20–60% of the way toward the longest edge's midpoint
(civic objects hug the busy frontage; only a fountain may sit dead-center). A park
is the radial/fan cut of its block (wedges from centroid or from the
nearest-to-centroid vertex, alley-width gaps) — grove wedges. A farm is a tiny
4×4 orthogonal cluster (threshold 8, fill 0.5) placed 30–70% of the way from a
random field vertex toward the field's centroid, randomly rotated.

### Against our spine

- **Identical in law:** plot ⊂ block ⊂ ward containment (§1); the page mass as a
  party-run of plots (A1.2 — the reference *generates* party-runs where we planned
  to *dissolve* into them; same object, two directions); the banned hollow
  block-wash stays banned (its masses are real lots, unit-lines countable);
  monuments never aggregate (A1.1/L-REG-30 — the two-direction monumental recursion
  is per-monument geometry, exactly our register law expects); VOID faces furnished
  by vocabulary, not packed (§1, §4 — plaza furniture ≙ V-B13's band).
- **Different, ours-justified:** our plots are tenure truth with lifecycle (§3d
  infill, §3f decline) and household data (A1.1); the reference's lots are
  paint-grade, born and dead in one frame. Our A_min must come from tierScale and
  the ledger, not a per-ward die. Our aggregation must stay a *view* stage (A1.2's
  dissolve) because truth plots pre-exist; but see the adoption below.
- **Worth adopting as idea — the highest-value item in this dossier (answers P1
  and half of P5):**
  1. **The band-as-stop-rule.** Page-mass discipline becomes a *generative*
     guarantee: subdivide (or dissolve) until pieces enter the band, with a
     lognormal stop threshold — the A1.2 band (2.7–4.6 rw²) is then satisfied by
     construction and the page-budget census verifies instead of legislates.
  2. **Gap-at-coarse, party-at-fine.** One recursion depth-classifies our edges:
     gap-bearing cuts ARE lane/alley WAY edges; gapless cuts ARE party BOUND
     edges. The A1.2 stage-1 dissolve ("dissolve interior party BOUND edges along
     a run") becomes trivially correct because the edge type was minted at cut
     time — the aggregation rule and the subdivision rule are one law, written
     from opposite ends. This is the missing mechanism under P1's "what exactly
     maps truth bodies to a banded page."
  3. **The chaos-dial table as ward language.** Two dials plus lot floor plus
     emptiness express class, wealth, and authority *legibly* (order = authority;
     density = poverty; emptiness = wealth). Our quarter identities (§1) should
     carry exactly such a dress-parameter tuple, sourced from ward kind + tier +
     prosperity (§2/M8 inputs), with the u²-skewed draws as the in-band variety
     mechanism.
  4. **Angle-jitter suppression at the finest scale** — chaos lives in the street
     pattern, never in the house rectangle. A one-line rule with outsized gestalt
     effect; candidate for our organic-guard instrument (measure: angle variance
     of finest-level cuts ≈ 0 while coarse-level cut angles vary).

---

## 6 · Special wards and the fringe — placement heuristics

Mostly covered in §2 (scorers) and §5 (geometry); the placement facts worth
holding as ideas:

- **The citadel sits on the ring's edge, not the center** — it is the closest
  piece *outside* the city ring, annexed, privately walled, relaxed into
  compactness, and quality-gated (roundness ≥ 0.75 or regenerate). Where its shape
  touches the countryside its vertices are pinned against smoothing and barred as
  gates — the fortress presents a hard face outward. Its gates join the city's
  gate list (streets reach it), and its interior vertices are blocked in the
  street graph (no through-traffic). Historically right (motte on the perimeter)
  and structurally cheap.
- **The plaza is the innermost cell**, thrice-relaxed, so the market is the most
  regular piece in town; the temple prefers to *overlook* it (largest
  plaza-bordering piece), the administration insists on it, markets repel each
  other. The plaza's own boundary segments are deleted from the artery list — the
  square is the street.
- **Farms:** 20% of round-enough (≥ 0.7) countryside pieces; the farmhouse cluster
  sits off-center in the field (30–70% toward the centroid from a random vertex).
  Fields fill the remaining fringe; everything past 3× wall radius is discarded.
- **Gate suburbs** (§2): near-certain at city scale, p = 1 − 1/(N−5).
- **The fringe density law** (the un-walled edge): buildings in any city ward not
  fully surrounded by city (and any suburb) pass a survival filter. For each ward
  edge that is "populated" (on an artery: weight 1; facing an enclosed city
  neighbor: 1; facing an exposed city neighbor: 0.4), a building survives if a
  noise draw centered at 1 exceeds its normalized distance to the nearest
  populated edge, *divided by* a per-vertex attraction field — vertices whose
  every incident piece is urban (or which are gates) attract with weight 2·u,
  countryside-touching vertices attract 0, and a building's attraction is the
  inverse-distance-weighted blend of its ward's vertex weights. Net: built mass
  clings to roads, gates, and the city body, and *frays* stochastically with
  distance — ribbon development at gates, thinning at the open edge. No hard
  boundary is drawn; the edge is a probability gradient.

**Against our spine:** the fringe law is our §3d extramural emission observed as a
falloff mechanism (emission at gates/roads with density decaying by distance-to-way
and distance-to-city); ours adds typing, epoch stamping, and the reader-verifier.
Worth adopting as idea: the *inverse-distance vertex-attraction blend* is a clean,
cheap way to grade emission density around gates without inventing new fields —
candidate constant block for the §3d emitter. The 3×-radius countryside clip and
the farm roundness floor (a farm wants a plowable field) are magnitudes worth
keeping in L-REG-33's sizing conversation.

---

## 7 · Where the organic feel actually comes from

The dossier's cross-cutting finding, stated once: **the reference contains zero
coordinate noise.** Its Perlin unit is dead code to the generator; nothing jitters
a vertex after birth. Every source of irregularity is a *decision* made irregular,
and every source of order is *earned* by an explicit mechanism:

| source of irregularity (structural)          | source of order (earned)                     |
|----------------------------------------------|----------------------------------------------|
| spiral seeding with per-point radius jitter  | guaranteed origin point (the center exists)  |
| raw Voronoi cell shapes at the periphery     | 3× Lloyd relaxation of the 3 central cells + citadel |
| cut-point jitter (±0.4·chaosG of the edge)   | cuts ⊥ to the longest edge (bounded aspect)  |
| cut-angle jitter (±15°·chaosG)               | angle jitter zeroed below 4× stop area       |
| lognormal stop threshold (band width 2^±2·chaosS) | the band center A_min per ward          |
| stochastic emptiness (courtyards, 3–25%)     | the deck's fixed mixture and greedy scorers  |
| fringe survival filter (probability gradient)| junction weld (ε=8) → T-junctions            |
| random gate pick                             | gate decimation spacing; junction-degree candidates |
| per-ward u² parameter draws                  | wall smoothing to the facet economy; artery (1,3,1) smoothing |

This is precisely our §3b organic guard's claim — "accretion irregularity is a
property of the PIECE-ADDING rule … never a post-hoc jitter" — implemented and
shipped in the reference our owner picked as the visual target. The guard's
instruments should therefore measure *decision statistics* (cell roundness
gradient, junction degree mix, cut-angle variance by depth, lot-area band fit,
fringe density falloff), never spectral noise properties. That closes most of P5:
grown irregularity is separable from jitter because it lives in the statistics of
discrete decisions, and each row above names a measurable.

---

## 8 · The five adoptions, ranked (and the one inversion to respect)

1. **Band-as-stop-rule + gap-at-coarse/party-at-fine recursion** (§5) — one
   recursion mints plots, alley WAYs, party BOUNDs, and the page band together;
   answers P1 with a mechanism and makes A1.2's dissolve trivially correct.
2. **Regularity-is-earned organic model with decision-statistic instruments**
   (§1, §7) — closes most of P5; relaxation-where-ordered replaces any temptation
   to jitter; the measurables list is ready for the blind-read gates.
3. **Derived-wrap gate minting: junction-degree candidates + cycle decimation +
   the gate-road guarantee + street-reachability proof** (§3) — completes §3c for
   `derived-frozen` wall events where history is silent on gates.
4. **The quota-deck / location-scorer decomposition with overflow-slums and
   social adjacency scorers** (§2) — the shape for CAR-SEATING; ledger supplies
   the deck, §640 weights supply the scorers.
5. **The ward dress-tuple language** (lot floor, two chaos dials, emptiness; §5's
   table with magnitudes) — class/wealth/authority made legible in four numbers;
   slots directly into our quarter identity under §2's prosperity inputs.

The inversion to respect rather than adopt: the reference *derives* everything
from one instant — gates before streets, walls before wards' interiors, no time.
Our spine's whole reason to exist is the axis it lacks. Every adoption above
enters as a mechanism *inside* an epoch of §3's construction, never as a
replacement for the ledger's authority over what exists when. Nothing read
contradicts a standing spine ruling; where the reference and the spine solve the
same problem, they agree to a degree that validates the spine's §656 premise —
we ruled the same laws from behavior before reading a line.
