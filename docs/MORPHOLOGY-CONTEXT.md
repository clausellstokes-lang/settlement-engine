# THE CONTEXT-STRUCTURE COMPENDIUM — MF-S3b
### Lane MF-S3b (Opus 5), 2026-08-17. ODQ §245 (study the urban planning) as sharpened by **§246 (the reconstruction test)**.
### Advisory deliverable. Read-only lane: no git writes, no memory writes, no edits outside this file, the `MFS3B-*` instruments and the receipt.

> **STATUS RECONCILIATION — 2026-08-20.** This is a visual-corpus reconstruction and hypothesis
> catalogue, not historical evidence and not an executable mechanism registry. `GENERATION-SPEC`
> §§10.17–10.23 and ODQ §287 supersede every proposed derivation/default that conflicts with typed
> canonical causes, evidence-domain dormancy, inertia, uncertainty, or the no-frequency law. In
> particular, corpus scenes do not license universal open fields, tier/prosperity siting, water-
> access wealth rules, automatic custodian dwellings, country/culture morphotypes, wall defaults or
> rural ratios. Every `CX-*` proposal remains dormant until explicit canon and the matching promoted
> evidence domain authorize it; the corpus may grade visual register only.

**The question this document answers is §246's, not §245's.** Not "what does the corpus
look like" but **"if we had to produce a plate of this kind with OUR pipeline, what would
we need, what would we emit, and where would we diverge?"** Every finding therefore lands
in the RECONSTRUCTION FORM:

> **MECHANISM** — the deterministic rule, its pipeline stage and its inputs.
> **DERIVATION HOME** — the dossier fact that drives it. *A mechanism with no derivation
> home is decoration, and is labelled so.*
> **VERDICT** — **HAVE** (name the law) · **PARTIAL** (name the missing piece) ·
> **MISSING** (mechanism sketch; proposal only, the chair rules) · **NOT-DERIVABLE**
> (say so plainly; filed in §12).

**The calibration is binding (§246.2): REGISTER AND KIND, never pixel-identity.** The
corpus carries defects we ban (§2.4's twelve priors) and its labels are decorative where
ours are TRUE. The test is *"could our process have produced a plate indistinguishable in
kind and quality from this one?"* — never *"can we redraw this plate."*

**Scope split.** My sibling lane **MF-S3a** owns THE PLAN: street graph, blocks, plots,
frontage, building variance, districts, centres, growth sequence, decay morphology, the
anomaly catalogue. I own THE CONTEXT: terrain, water, defence, the edge and the outside,
institution siting as a relational system, circulation, regional morphotypes, and whatever
else the plates teach. Where the two touch (block termination at the wall; the market as
both a void and a logistics fact) I cross-reference rather than re-derive, and say so.

---

## §0 · METHOD, SAMPLE, AND THE HONESTY KEY

### §0.1 · The closed legacy evaluation roster is excluded — the accounting

⚠ **STATUS CORRECTION (SPEC §10.17):** this lane did not open the 81 excluded image files, but it
did reason from some of their index descriptions, and the broader corpus program had already
viewed/measured every plate. This is a clean lane-level pixel exclusion, not proof that the final
roster was untouched by calibration.

`docs/laneHFM1-holdout-proposal.json` names three overlapping sets. The brief requires the
UNION of the proposal and its adopted 12-swap fix (§244.6):

| set | n |
|---|---|
| `proposed` | 53 |
| `minimal_swap.proposed` | 53 |
| `minimal_swap.added` | 12 |
| **UNION (excluded from this study)** | **81** |
| corpus on disk | 313 |
| **ELIGIBLE FOR STUDY** | **232** |

**81 plates were excluded and never opened by this lane.** The union is larger than either
individual list because the swap replaced twelve members without the two lists being
nested; excluding only one list would have leaked plates that are evaluation members under
the adopted set. The excluded ids are listed in the receipt.

This cost the study real evidence and the cost is named, not hidden: the holdout took
`hf267` (the extramural institution-ring reference), `hf311` (the definitive gate-suburb
zoom), `hf345` (the castle bailey interior), `hf346` (head of navigation), `hf344`
(churchyard social geography), `hf371` (the grain catchment), `hf365` (walls decaying into
property), `hf349` (karst), `hf354` (salt lake), `hf326`, `hf335`, `hf336`, `hf301`, `hf312`.
Several of those are the single best plate for a section of my brief. Where a finding rests
on a plate description I could read in the index but a plate I could not open, it is marked
**[E-index]** and never **[M-view]**.

### §0.2 · The 8-item scrub list

34 of the 232 eligible plates carry a text contamination (real place, real river, real
date, real language, real unit, or a drawn human figure). They remain valid for geometry
and are used throughout for structure. **No lettering, naming, or chrome observation in
this document cites any of them.** The set is enumerated in the instrument
(`MFS3B-context-census.py`, `SCRUB`).

### §0.3 · Three evidence tiers, and what each is worth

| tag | what it means | how big |
|---|---|---|
| **[M-view]** | I opened the plate and counted or measured the thing myself | **n = 12 plates viewed at 1100 px** |
| **[M-index]** | reproducible keyword census over the corpus's own per-plate descriptions | **n = 232 eligible** (138 settlement-role) |
| **[E]** | reasoned inference, from the descriptions or from the two figures above | stated per claim |

**The 12 plates I opened**, chosen to span water relationship, defence relationship and
setting, none of them holdout members:
`hf62` bankside town · `hf318` unequal circuit (town) · `hf372` unequal circuit under siege ·
`hf385` three circuits · `hf389` metropolis · `hf373` contour hill town · `hf368` city water
works · `hf327` mud-brick river-and-caravan city · `hf332` shore ribbon town ·
`hf146` marsh levels · `hf276` unbridged gorge · `hf381` the country's ways.

### §0.4 · ⚠ What the [M-index] census is, and the confound it carries

`MFS3B-context-census.py` parses **two** description sources — `laneHF-CALIBRATION.md`
(bullet row per plate, hf85→) and `laneMFS1-urbanism-atlas.md` PART 1 (prose block per
plate, hf3–hf84) — into one record per plate, then counts 49 context features by regex.
Coverage after the second source was added: **232 of 232 eligible plates described, zero
gaps.**

**It measures the PROSE, not the pixels.** It counts how often a feature was worth writing
down by the lane that viewed the plate. Three consequences, all binding on every figure
below:

1. **It is a LOWER BOUND.** An unremarked ford is still a ford. A census share of 5% means
   "named on 5%", never "present on 5%".
2. **⚠ DESCRIPTION-LENGTH CONFOUND, measured:** atlas-sourced blocks run **median 1,917
   characters** (n=35); index-sourced rows run **median 508** (n=197) — a 3.8× verbosity
   gap that tracks the description's ERA, not the plate's content. Any comparison between
   the HF-1-era plates and the later rounds is confounded and is not made in this document.
3. **It systematically under-reports the OBVIOUS.** The sharpest instance, and it is worth
   naming because it nearly misled me: the census finds an explicit "towers absent on this
   flank" statement on only **7 of 138 settlement plates (5.1%) [M-index]** — yet **6 of the
   7 walled plates I actually opened show exactly that asymmetry [M-view]**. A viewer does
   not write down what the drawing makes obvious. **Rule adopted for this lane: a census
   share may falsify an "always" claim but may never establish a "rarely" one.**

The instrument, its CSV output, and this note ship together. It is re-runnable and its
denominator is printed on every run, so a later lane re-running it against a changed atlas
sees the n change rather than silently inheriting a share.

### §0.5 · What already exists, so this is extension and not repetition

MF-S1's atlas (`laneMFS1-urbanism-atlas.md`) already covers, in my area: **T-10** wall
presence and flank grammar, **T-11** threat-directed defence, **T-12** water relationship
incidence, **T-13** river class ladder, **T-14** water is worked, **T-15** pollution,
**T-21** extramural growth, **T-22** the wall-foot tell, **T-23** the road ladder,
**T-24** ground primitives. Those were tallied over **~34–41 plates** of the pre-HF-2
corpus. This document does not restate them; it **extends them onto the 232-plate eligible
set, decomposes each into per-run / per-flank / per-distance structure, and converts each
into a reconstruction mechanism.** Where MF-S1's figure and mine disagree, I say so.

⚠ MF-S2 is editing the atlas concurrently. I treated it as read-only, quoted no figure from
it as authoritative, and cite `laneHFM1-corpus-measured.csv` or my own instrument for
numbers.

### §0.6 · Our derivation vocabulary, verified from source, not remembered

Every DERIVATION HOME below has to land on a fact the dossier actually holds. I read the
vocabulary out of the tree rather than trusting recall:

| fact | values | source |
|---|---|---|
| `tier` | thorp · hamlet · village · town · city · metropolis (6) | `src/components/gallery/galleryUtils.js` |
| `config.terrainType` | plains · hills · forest · riverside · coastal · mountain · desert (**7**) | ibid. |
| `tradeRouteAccess` | port · river · crossroads · road · isolated (5) | `src/generators/economy/upgradeOpportunities.js` |
| `culture` | 11 tokens | galleryUtils |
| `economicState.prosperity` | Struggling → Wealthy (6 bands) | galleryUtils |
| water-bearing terrain | `WATER_TERRAIN = {coastal, riverside}` | `src/generators/terrainHelpers.js` |
| defences | institutions matching `wall · citadel · palisade · earthwork`; `hasWalls` boolean | `src/generators/defenseGenerator.js` |
| also present | population · institutions · stressors · activeConditions · history · neighbors · factions · government · resources · supplyChains | `src/domain/settlement.schema.js` |

⭐ **Hold that terrain row in mind through §7. It is seven tokens.** The corpus expresses at
least twenty structurally distinct settings. That single line is the largest single
NOT-DERIVABLE in this compendium and it is the reason §7 exists.

---

## §1 · TERRAIN ACCOMMODATION AND SITING LOGIC

### §1.1 · ⭐ THE SITING LAW: a settlement sits at a SCARCITY, not at a centre

This is the strongest single generalisation in my half of the corpus, and it is the one
our pipeline most conspicuously does not express. **In every substrate-scale plate that
draws both a country and its settlements, the settlements are placed at the point where
some necessity is locally SCARCE and locally AVAILABLE — and the plate draws the scarcity
so the placement is legible without a caption.**

The catalogue, with the plate that teaches it (all eligible, ★ = I opened it):

| scarcity | the settlement sits at | plates |
|---|---|---|
| **dry ground** in a wet country | the one gravel ridge / terp / levee | ★hf146, hf127, hf240, hf358 (midden ridge), hf284 |
| **water** in a dry country | the spring, the rock spring, the qanat head, the resurgence | hf145, hf125, hf253, hf297, hf104 |
| **the spring LINE** on permeable rock | a row of villages, one per spring, along the scarp foot | hf142 (four named), hf250, hf220, hf356, hf349 |
| **a crossing** | the ford, then the bridge, at the lowest/only crossable point | hf155, hf143, ★hf318 (ford inside the wall), ★hf385, hf263 |
| **a bottleneck** | the narrows, the pass, the wind-gap, the siq | hf148, hf158, hf250, hf298, ★hf276 |
| **a break of bulk** | the head of navigation, the portage, the falls | hf157, ★hf381 (Riverport at the falls), hf295 |
| **shelter** | behind the bar, the spit, the island, the cove | hf222, hf144 (one stream-cut cove in miles of cliff), hf151, ★hf332 |
| **level ground** in vertical country | the delta flat, the alluvial fan, the bench, the saddle | hf249, hf355, hf141, hf130, hf96 |
| **defensible ground** | the knoll, the spur, the crag, the rock bowl | ★hf385 (The Knolle), hf236, hf298, hf22 |
| **the stone / the seam / the salt** | at the resource, and nowhere else | hf220, hf270, hf271, hf287, hf195 |
| **the junction of two networks** | where the caravan road meets the river | ★hf327, hf104, hf157 |

**[M-index]** `spring_line` is named on **23 of 232 eligible (9.9%)** and `wet_refusal` on
**16 (6.9%)**; both are lower bounds under §0.4. **[M-view]** of the 12 plates I opened,
**11 place their settlement at a nameable scarcity, and in 9 of those the scarcity is drawn
larger than the settlement** — the peat moor dwarfs Sedgewick (hf146); the drying racks
dwarf Saltern Howe (hf332); the gorge dwarfs both villages (hf276); the desert edge and
the great river bracket Tamboura (hf327).

The negative case proves it. hf349's karst country carries **a great empty quarter with no
settlement at all** — sheep walks, drystone walls, quarries, lime kilns and nothing else —
because there is no water there. **The corpus draws where people are NOT, and that emptiness
is what makes the placement read as a decision.**

> **CX-01 · SITE-AT-SCARCITY**
> **MECHANISM.** Substrate stage, before any fabric: derive a `siteReason` for the
> settlement from `terrainType` × `tradeRouteAccess` × water facts, from a closed
> enumeration (ford · bridge-point · pass · gap · spur · knoll · harbour · cove · spring ·
> spring-line · dry-ridge · confluence · head-of-navigation · portage · resource · junction).
> The chosen reason then (a) fixes the settlement's anchor point on the substrate, (b) is
> the single seed for the approach-road bearings (CX-38), and (c) is DRAWN — the scarce
> thing is rendered and the abundant thing is rendered as its foil.
> **DERIVATION HOME.** `config.terrainType` + `tradeRouteAccess` + `resources` +
> `history.foundingKind`. All five exist.
> **VERDICT — PARTIAL.** §5.0b gives us a water mode and b6 declares it in the cartouche
> (atlas T-12 verdict: MEETS — better than any reference). What is missing is that the mode
> is a PROPERTY of the settlement rather than a POINT on a substrate: nothing places the
> settlement AT a feature, and nothing draws the scarcity. The missing piece is a substrate
> with named features and an anchor rule, not a new dossier fact.

### §1.2 · What the fabric REFUSES, and how the refusal shapes the outline

The corpus's settlement outlines are, to a first approximation, **the complement of the
land the fabric refuses.** Four refusal classes, each drawn:

1. **WET GROUND.** hf389's south run follows the reed marsh edge exactly and the fabric
   stops dead at it [M-view]; hf317's flood wash has a hard edge running *through the middle
   of streets*, and the fabric adapts (raised thresholds, undercrofts) rather than retreating;
   hf146's fabric occupies the ridge and refuses everything either side; ★hf372's fields stop
   at the river's soft ground.
2. **STEEP GROUND.** hf373's fabric stops at the cliff's edge parapet [M-view]; hf355's
   shaded shore has the mountain straight down to the water and carries **no road and one
   ghost hamlet**; hf144's cliffs carry miles of nothing.
3. **BAD ASPECT.** ⭐ This one is a genuine discovery for us. hf355 draws the **shaded
   shore empty and the sunny shore strung with villages**; hf149 ("no sun, no corn") farms
   only the sunny shore; hf283 leaves the **frost hollow honestly unplanted** and puts the
   village *above* the frost line; hf350 puts every village **upwind of the ash** and none
   downwind. Aspect is not decoration in this corpus — it is a hard mask.
4. **SOUR / POISONED GROUND.** hf354's "sour edge" beyond which fields are salt-killed and
   a line of dead trees stands; hf343's strip of sour unused ground between the tan pits and
   the wall; hf332's church removed uphill from the salt air.

> **CX-02 · THE REFUSAL MASK**
> **MECHANISM.** Substrate stage: compute a boolean/graded `buildable` mask over the
> substrate from four refusals — inundation, gradient, aspect, contamination — and make it
> the hard bound for every later growth epoch. The settlement outline is then a CONSEQUENCE
> of the mask plus the epoch model (§240), never a shape.
> **DERIVATION HOME.** inundation ← water mode + `terrainType`; gradient ← relief;
> aspect ← ⚠ **no fact exists** (see §12); contamination ← noxious `institutions` +
> flow vector.
> **VERDICT — PARTIAL, and the missing arm is ASPECT.** §239.1 (block termination at hard
> edges) and §232 (the wall as a partition) already give us the *stopping* machinery — the
> owner's law is exactly right and is the correct place to hang this. What we lack is the
> mask itself: b6 has a single `RELIEF 0.30` scalar in the cartouche (atlas Table C), not a
> field, so there is nothing for a block to terminate against except the wall and the water.
> **Aspect is NOT-DERIVABLE today** — there is no sun bearing, no slope orientation, and
> §7/E8's correction (no bearing field exists) applies. Sketch in §12.

### §1.3 · Slope response: two street grammars, and they never mix

The corpus is unambiguous, and the rule is cheap to implement:

- **CONTOUR-FOLLOWING streets** carry the traffic. Long, curving, gently graded, they wrap
  the hill at roughly constant height. hf373 [M-view] has three of them wrapping Kerrack
  Holt; hf329 the same; hf130 four stacked benches; hf126, hf96, hf116.
- **FALLING-LINE links** carry the pedestrians. Short, straight, steep, they run directly
  downslope BETWEEN the contour streets, and where the gradient exceeds walking they become
  **stair alleys** — drawn as a ladder of treads, with a **beast ramp at one edge**
  (hf320's specimen). hf373 [M-view] shows perhaps a dozen; hf329, hf357, hf310.
- **The block is the residue.** Blocks between two contour streets are **long, thin, curved,
  and wedge-shaped where the contours converge** [M-view hf373]. That wedge is the tell —
  it is what a rectangular-block generator on a hill cannot produce.
- **The road in and out switchbacks**, and each hairpin is legible (hf158, hf130, ★hf373's
  spring path, hf276's rock-cut stair path drawn as dotted switchbacks [M-view]).
- **Terracing** appears where the slope is FARMED rather than built: contour bands pinching
  and opening with the gradient, retaining walls with masonry pair-ticks, a stair ladder
  between bands, and — the detail that makes it read — **the crop rows follow each band's
  own curve, not a global bearing** (hf116, hf126, hf230, hf283, ★hf373's olive-and-vine
  benches).

**[M-index]** `contour_street` (contour/switchback/stair-alley/hollow-way/stepped) is named
on **24 of 138 settlement plates (17.4%)** and `terrace` on **17 (12.3%)**.

> **CX-03 · THE TWO-GRAMMAR SLOPE RESPONSE**
> **MECHANISM.** Street stage: where local gradient exceeds a threshold, generate the
> street web as a two-class graph — arterials constrained to follow iso-elevation bands
> (a contour walk), links generated perpendicular to them, links whose gradient exceeds a
> second threshold promoted to `stair` class (own primitive, own texture, ramp edge). Blocks
> are then defined by their bounding ways per §239.1, which produces the wedge for free.
> **DERIVATION HOME.** relief field + `terrainType ∈ {hills, mountain}`.
> **VERDICT — MISSING.** §239.1 gives block-by-bounding-ways; §214 gives the drawn
> vocabulary; **nothing generates a street that knows about gradient.** With `RELIEF` a
> single scalar there is no field to walk. This is the highest-leverage terrain mechanism in
> my half: it is one constraint on the existing street derivation, and it converts
> `terrainType ∈ {hills, mountain}` from a label into a shape.

### §1.4 · Terrain reads at plan scale with FOUR conventions, and they are not interchangeable

hf376 catalogues them and hf386 classifies them; both are eligible specimen sheets:

| convention | what it is for | corpus rule |
|---|---|---|
| **HACHURE** | slope | strokes thick uphill, tapered; **spacing tightens with gradient**; bare crest ridges (hf112) |
| **ROCK HATCH** | cliff and crag | closed angular cells, **not** slope hachure; heaviest line on the cliff edge; graded scree stipple (hf113, ★hf276) |
| **SPLAYED HILL** | the old shaded humped form | era-legal but semi-pictorial; hf224, hf253 |
| **LEVEL LINE** | contours | ⚠ **post-medieval**; the corpus drifted into it three times (hf294, hf322, hf355) and now names it as a convention to refuse |

⭐ **The finding our renderer must take:** relief is drawn by **stroke density and stroke
direction**, never by tone. Every plate that shades uses **one fixed direction and a hard
edge** (atlas §2.3.3.8, corpus-confirmed). The one plate that used a strong tonal grey wash
for a mountain (hf355) is flagged as the darkest non-night plate in the corpus and sits at
the edge of the calm-ink law.

> **CX-04 · RELIEF AS GEOMETRY, PER-LAND-FORM**
> **MECHANISM.** Render stage: relief emits **hachure** for graded slope and **rock hatch**
> for cliff/crag, selected by a land-form classification of the substrate (gradient +
> a rock flag), never one texture scaled. Hachure stroke spacing is a function of local
> gradient; both aggregate into `defs`/patterns per MF-A1's proven approach.
> **DERIVATION HOME.** relief field + `terrainType`.
> **VERDICT — HAVE the law, MISSING the input.** §214 names exactly this ("relief in the
> corpus's hachure/contour vocabulary… cliffs in crag grammar… drawn vocabulary at corpus
> weight, never tint washes alone") and it is wave-nine first-order. The law is written
> correctly and completely; it has no relief field to consume. **§214 cannot be built to
> its own text until CX-02's substrate exists.** That dependency is not recorded anywhere I
> could find and is the single most consequential sequencing finding in this section.

---

## §2 · WATER — THE WHOLE SYSTEM

### §2.1 · The relationship class is right, but it is the WRONG AXIS ON ITS OWN

MF-S1's T-12 established the incidence of THROUGH / BANKSIDE / NEAR / NONE and confirmed
that THROUGH is rare. That holds and I do not re-tally it. **What the wider corpus adds is
that the mode does not determine the morphology — a second axis does, and nobody has named
it.** The same "BANKSIDE" label covers three structurally opposite settlements:

| second axis | what the water IS to the fabric | signature | plates |
|---|---|---|---|
| **WATER AS EDGE** | a wall the town backs onto | fabric on one side only; the waterfront is a WORKED FACE (quays, mills, stairs); the far bank is fields | ★hf62, ★hf332, ★hf372 |
| **WATER AS SPINE** | the main street | fabric on BOTH sides, oriented to the water; crossings are frequent; the channel carries the traffic the street would | hf235 (canals), hf240 (levee), hf307 (inhabited bridge), hf358 |
| **WATER AS OBSTACLE** | a thing to be got across | fabric organised at the CROSSING and nowhere else; queue yards, tolls, waiting inns; the two sides may be different settlements | ★hf276, hf275, hf248, hf157 |

⭐ **The discriminator is not the geometry, it is the ECONOMY.** A settlement whose trade
moves ON the water gets SPINE; whose trade moves ACROSS it gets OBSTACLE; whose trade
merely uses it gets EDGE. This is derivable from facts we already hold and it changes the
whole plan, so it is the highest-value water finding in this document.

> **CX-05 · THE WATER ROLE AXIS (second to the mode)**
> **MECHANISM.** Substrate stage, immediately after the water mode: derive
> `waterRole ∈ {edge, spine, obstacle}`. `spine` requires a navigable class (§205.2) AND
> a water-borne trade profile; `obstacle` requires the settlement's `siteReason` to be a
> crossing; `edge` is the default. The role then selects the fabric's orientation rule, the
> crossing count, and the waterfront kit.
> **DERIVATION HOME.** `tradeRouteAccess ∈ {port, river}` + `supplyChains` +
> `siteReason` (CX-01) + river class (§205.2).
> **VERDICT — MISSING.** §5.0b gives the mode; §205.1/§205.2 give navigability and class.
> Nothing derives what the water is FOR. Cheap: one enumerated field over facts that exist.

### §2.2 · Bank asymmetry, and the law of the second bank

MF-S1 found bank asymmetry at hf30 (~70/30). The eligible corpus sharpens it into a rule
with a mechanism:

- **[M-view] hf62:** the far bank carries **six buildings and fields** against a full walled
  town — roughly 95/5. The far-bank cluster sits **exactly at the bridge foot** and nowhere
  else along the reach.
- **[M-view] hf318, hf372, hf389:** the far bank is fields in all three; not one has a
  second built bank.
- **hf274:** the two banks are two JURISDICTIONS — old royal tangle vs young charter grid —
  with a dashed borough boundary drawn **mid-river**, and the rivalry drawn in the economics
  (toll-free old ferry undercutting the new bridge).
- **hf275, ★hf276:** the two banks are two SETTLEMENTS of unequal size, and the bigger one
  is the one with the toll.
- **The counter-example is named as a defect:** hf16's two banks mirror each other, and
  atlas prior #10 bans it.

⭐ **The law: the second bank is never a mirror. It is one of exactly four things** —
(a) fields, (b) a bridgehead knot at the crossing only, (c) a subordinate settlement,
(d) a rival jurisdiction. The choice is derivable.

> **CX-06 · THE SECOND-BANK RULE**
> **MECHANISM.** After the crossing is placed: the far bank receives fabric only via an
> explicit rule — nothing (default), a bridgehead cluster whose extent is a function of
> crossing traffic, a subordinate settlement, or a second jurisdiction. Never a mirrored
> copy. A THROUGH settlement additionally asserts a bank split no closer than ~65/35.
> **DERIVATION HOME.** crossing type + `tradeRouteAccess` + `neighbors` (for the
> subordinate/rival cases) + `factions`/`government` (for dual lordship).
> **VERDICT — PARTIAL.** §5.0b's THROUGH mode exists and atlas prior #10 records the ban;
> **no mechanism enforces asymmetry or chooses among the four kinds.** Note this is a
> district-level fact and composes with §232 (the wall as partition) — the far bank is
> always its own district.

### §2.3 · Crossings generate fabric — the crossing kit, drawn seven ways

hf263 is the eligible dictionary: **clapper+ford · trestle on piles · stone arch with
cutwater noses and flood arches · fortified with H-gatehouse and toll · chapel-on-pier ·
pontoon with a lift-out gap · ferry.** The corpus then shows what each *does to the fabric*:

- **The crossing is a TOLL POINT, and the toll is the fabric's reason.** [M-index] `bridge`
  and `toll` co-occur on **8 of 138** settlement plates — a lower bound, but of the crossing
  plates I opened, **hf276 has a toll post, hf381 a toll fort at the pass, hf318's chain
  closes the river** [M-view].
- **The crossing generates a QUEUE.** hf276 draws "goods queue yards" on **both** rims
  [M-view]; hf311 draws carts waiting in a rank at the toll bar; hf295 barges queuing at
  the lock; hf340 a worn rutted **waiting ground** where carts stand.
- **The crossing widens into a MARKET.** The bridge-street market is real: hf155's market
  street IS the road widening at the bridge; hf307's inhabited bridge has a market place at
  mid-span; hf363's *new* market is at the *new* bridge, and the old one dies.
- **The crossing is DEFENDED at the point where it is a hole in the wall.** hf62's bridge
  passes a gate-structure straddling the wall line [M-view]; hf274's one bridge is gate-towered
  at BOTH ends; hf313's water gate; hf263's fortified type.
- **⭐ The crossing MOVES, and the old one is drawn.** hf381 [M-view] shows an ancient ford
  beside the stone bridge that replaced it, **with its old approach lanes dwindling to
  dotted**; hf155's ford ghost with hollow-ways beside the new bridge; hf252's ford that
  moves year to year (this year's stakes vs last year's ghost track); ★hf318 and ★hf385 both
  keep the FORD as a named feature inside a town that has long since bridged.

> **CX-07 · THE CROSSING KIT**
> **MECHANISM.** Once a crossing exists: emit a bundle keyed to crossing class — toll
> post/bar, a queue/laydown ground sized by traffic, a bridge-foot widening that becomes a
> market if the settlement has one to place, a chapel or shrine on the structure at
> town+, and a defensive member where the crossing pierces a circuit. The crossing class
> itself walks a ladder with the settlement's age and wealth (ford → stepping stones →
> plank/clapper → trestle → stone arch → fortified).
> **DERIVATION HOME.** river class (§205.2) + `tradeRouteAccess` + `population` +
> `prosperity` + `history` (for the ladder rung and for the superseded predecessor).
> **VERDICT — PARTIAL.** §205.1 gives "bridges SPAN, never dam" and b6 draws bridges and
> water gates (atlas T-14: MEETS). What is missing is that **a crossing is an institution
> with a catchment, not a line segment** — no toll, no queue ground, no market coupling, and
> no superseded predecessor. The predecessor arm is the cheap half and pays into §240's
> epoch model directly: the previous crossing is a *dated event*, so it lands as a ghost for
> free.

### §2.4 · Worked water — and the finding that the chain is a SEQUENCE, not a set

hf340 is the eligible definitive plate and it is unambiguous: the mill is not an object,
it is **an ordered chain along a flow vector**, and every element is positioned by the one
before it —

> weir set at an angle + fish pass → head sluice → **leat, drawn deliberately straighter and
> more level than the river, embanked on its lower side** → waste hatch spilling surplus
> back → mill pond with a silt fan at its inlet and a drawn-down muddy margin → the mill
> standing ACROSS the tail with the wheel in a masonry-cheeked pit → tail race rejoining
> BELOW the weir → and beside the leat, **wet meadow with rush ticks, because the leat leaks.**

Plus the two details that make it teach rather than list: **an older FAILED mill upstream,
a stub with a silted pond and a dry ghost leat**, and the **waiting ground** where carts
stand. hf264 puts ten works on one river in working order and confirms the ordering.

The waterfront is the same argument in the horizontal: hf322 draws **one continuous shore
changing character stretch by stretch** — open beach with hulls and capstans → stone hard
with cart ruts running into the water → timber jetty on piles with a crane → stone quay
with coped edge, uneven bollards and tread-ladder stairs → wet dock with gate leaves → mud
berth with a hulk → revetted bank → slipway with a ribbed cradle → boat noost cut for one
hull → fish landing with sorting boards and drying frames → **and a SHORE LEFT, an old quay
line stranded behind new silt with the working edge moved outward.**

**[M-index]** over 138 settlement plates: `quay_wharf` **21.7%**, `mill_water` **14.5%**,
`basin_dock` **8.0%**, `boom_chain` **5.8%**, `weir_sluice` **4.3%**, `leat_race` **2.9%**
(badly deflated — the leat is drawn far more often than it is written down).

⭐ **The transferable rule is the ordering, not the inventory.** Our current risk is exactly
the opposite failure: placing a mill glyph *near* water. The corpus never does that. **Every
water work in the corpus is positioned relative to the flow and to its neighbours in the
chain, and the chain's members are visible consequences of one another.**

> **CX-08 · THE FLOW-ORDERED WATER CHAIN**
> **MECHANISM.** Water-works stage, after the channel exists and carries a flow direction:
> instantiate chains as ORDERED sequences along the flow vector — a mill chain (weir →
> sluice → leat → pond → wheel → tail race → rejoin below the weir), a waterfront ladder
> (each stretch's type selected by depth, bank material and the trade it serves), a
> pollution chain (clean take above → process → discharge fan below, §2.6). Chain members
> are placed by the chain, never independently.
> **DERIVATION HOME.** `supplyChains` (already a first-class dossier field, and this is the
> single best use for it in the map) + river class + `institutions` (mill, tannery, dye,
> fulling) + `resources`.
> **VERDICT — MISSING, and it is the best-supported MISSING in this document.** §205.1
> reserves the channel; §161b covers terraforming; §161m covers the docks. **Nothing orders
> anything along a flow.** We already hold `supplyChains` and do nothing spatial with it.
> Sketch: give the channel a directed centreline, let each water-consuming institution
> request a slot on it with an upstream/downstream predicate, and solve the ordering. The
> failed-predecessor arm (a silted pond and a dry ghost leat) then costs one flag on a
> chain member and delivers §161g decay in the water system for free.

### §2.5 · Domestic water — a ladder, and an INEQUALITY GRADIENT

This is the dimension the brief asked for that the corpus turns out to teach best, and it
is almost entirely absent from our laws.

**The supply ladder, by settlement type [E from the eligible set]:**

| rung | drawn as | appears when |
|---|---|---|
| the stream itself, with a **washing step** | steps into the water, a hard bottom | thorp/hamlet; ★hf332's washing step at the stream mouth |
| **the well** | a circle with **worn/beaten stipple around it** | universal; [M-index] 13.0% of settlement plates |
| **the dew pond** | a circle with a trodden margin, clay-puddled | no spring at all (hf349's hilltop hamlet, hf142, hf356) |
| **the cistern** | a circle under a court; or a great vaulted one under a square | rock/dry sites; ★hf373 has four "rain catches" plus one great vaulted cistern under Crown Square [M-view]; hf329, hf298, hf104, hf192 |
| **the conduit system** | spring house + buried line + heads of decreasing grandeur | city+, and it is a *political* object (below) |

⭐ **hf368 [M-view] is the discovery. Water access is drawn as an INEQUALITY, and the
gradient is spatial:**

- a walled **spring house and settling tank OUTSIDE the wall in the fields**, on the high
  ground, with a **keeper's cottage beside it**;
- the buried conduit running in as a bold line with **inspection-stone covers set into the
  street it follows**, and **its own arch under the wall** — the conduit gets its own
  piercing, distinct from any gate;
- the **GREAT CONDUIT HEAD in the market place** with a worn paved apron;
- **lesser heads at street corners, each smaller and plainer**, ending in the **poorest
  quarter's head, a plain pipe over a basin at the far edge**;
- **private takes** as thin lines to castle, abbey and two named inns — and **one drawn
  DOTTED as an illegal tap**;
- **public wells scattered by distance rather than by plan** (four of them);
- and a fringe with neither conduit nor well, taking water from the river at **three public
  stairs** — with **the tanneries, dye yards and shambles drawn on that same river ABOVE
  those stairs.**

That last clause is the whole argument in one adjacency, and it is drawn, not labelled.

> **CX-09 · THE DOMESTIC WATER LADDER**
> **MECHANISM.** After the fabric: place domestic water by rung, selected from tier ×
> terrain × prosperity. Wells are placed by an **uncovered-distance rule** (a walk-distance
> field over the fabric, wells inserted greedily where the distance is worst) — not by plan
> — and each carries a worn approach. A conduit exists only at city+ with sufficient
> prosperity, and when it exists it emits: an extramural source with a custodian dwelling,
> a routed buried line with its own wall piercing, one great head at the primary void,
> lesser heads down a prominence ladder, and private takes to the highest-status
> institutions.
> **DERIVATION HOME.** `tier` + `prosperity` + `terrainType` (cistern vs well) +
> `institutions` (which get private takes) + `population` (head count).
> **VERDICT — MISSING.** No law in §150–§245 covers domestic water at all. §205 is
> entirely about the channel. Given the owner's legibility law (glance → sentence → table)
> this is unusually high narrative return per unit of geometry: a well with a worn approach
> is three primitives and it says *people walk here every day*.

> **CX-10 · THE WATER-ACCESS GRADIENT**
> **MECHANISM.** The prominence of a quarter's water point is a function of the quarter's
> wealth, and the poorest quarter's supply is drawn as the *worst available rung* rather
> than omitted. Optional one-accent extras: an illegal tap (dotted) where lawfulness is low.
> **DERIVATION HOME.** ward wealth (§10.A3 already exists) + `prosperity` + lawfulness.
> **VERDICT — MISSING, and it is a §5.0d composition.** §5.0d's parcel dithering and
> §10.A3's ward wealth already give us a wealth field; this hangs one more channel off it.
> Atlas prior #11 warns that b6-era wealth boundaries are too clean — a water gradient is a
> *second* dithered channel and would blur the boundary as a side effect.

### §2.6 · Drainage, sewage, and the moral geometry of upstream/downstream

hf369 (the refuse plate), hf343 (the tannery ground) and hf368 together give a complete
system. **The organising fact is that dirt has a DIRECTION**, and every plate that draws
dirt draws the direction:

- **the plot tail** holds the privy, as far from the house as the ground allows, with cess
  pit beside it; several straddle boundaries; a row of six over one channel behind a
  tenement (hf369);
- **the yard midden** is a stippled mass with a kerb; the town's **great common midden is
  OUTSIDE the wall** with cart ruts converging on it;
- ⭐ **the MUCK LANE** — drawn wider and fouler than its neighbours, with a deep worn central
  channel, **running out through a small gate that exists for no other purpose** (hf369).
  A gate whose entire reason is refuse is a superb legibility object;
- **street channels with gratings**; a **covered drain under one street only**, serving the
  shambles and the fish stones; **the overflow flushes the shambles** (hf368);
- a **scavengers' yard and a dung wharf** where the muck is barged to the market gardens —
  **which are drawn beyond, with the same dung spread on them** (hf369, hf371-class logic);
- **the discharge fan**: hf343's foul outfall spreading below with **dead reeds beneath it**,
  and a **walled paddling place upstream where the clean water is taken**; hf180's plume as
  the plate's only chroma; hf270 and hf287's stream drawn **dark below and clear above**.

**[M-index]** `drain_sewer` **3.6%** of settlement plates, `noxious` **8.7%** — both severe
lower bounds; the noxious arc is present far more often than it is written.

> **CX-11 · THE DIRT VECTOR**
> **MECHANISM.** Every noxious or waste-producing institution carries a `dischargeVector`
> (flow direction if on water, prevailing wind if not) and three consequences are emitted:
> (a) a downstream/downwind **plume or fan** in the plate's one reserved accent, with a
> dead-vegetation mark; (b) a **clean-take point upstream** of it, which is where the
> settlement's water stairs/paddling place go; (c) a **midden/common-dump outside the
> nearest edge**, with a worn approach and, at town+, its own minor gate. Siting of the
> institution itself is already covered; this is the consequence layer.
> **DERIVATION HOME.** `institutions` (noxious classes) + flow vector + ⚠ wind bearing
> (**does not exist** — see §12).
> **VERDICT — PARTIAL.** MF-S1's **GAP-F** already sketches the `dischargePlume` and it
> stands unruled; §6's noxious rule and §161c's EDGE ring cover the siting. What GAP-F does
> not carry, and what I add on this evidence: **the clean-take point and the ordering
> relation between them.** The plume alone is decoration; plume + upstream take is an
> argument. Also add the muck gate — one extra gate class, very cheap.

### §2.7 · Where water DIVIDES and where it JOINS — the owner's question, answered

The corpus answers this crisply and the answer is a rule:

**Water DIVIDES when crossing it is expensive.** hf276 [M-view]: two villages a bowshot
apart across a gorge, "a day's journey" by the long way round, each with its own church,
its own well, its own spring, its own fields — **two settlements, not one.** hf275: a big
south town and a north hamlet. hf274: two boroughs with a boundary drawn mid-river.
hf312: eight islands where the sea is the road but each island does ONE job.

**Water JOINS when it is cheaper than the land.** hf381 [M-view] labels the river "the
cheapest way of all". hf151's rowing-lane dashes link every farm ("the sea is the road").
hf353's summer river network and hf312's dashed boat paths converging on the kirk. hf235's
canals ARE the streets. hf146 [M-view]: the timber causeways on piles are what makes three
terp farms members of one village rather than three hermitages.

⭐ **The discriminator is the crossing cost against the settlement's own scale**, and it is
computable: if the cheapest crossing is cheaper than the internal journey the settlement
already tolerates, water joins; otherwise it divides. hf307's inhabited bridge is the
limit case — the crossing became the settlement.

> **CX-12 · JOIN-OR-DIVIDE**
> **MECHANISM.** When a water body intersects the settlement's footprint, resolve
> `join | divide` from crossing cost vs settlement extent. `divide` emits two districts with
> separate centres, duplicated minor institutions (well, chapel, mill), and a crossing
> economy at the single link. `join` emits water-side frontage on both banks, multiple
> crossings, and boat-path dashes as first-class routes.
> **DERIVATION HOME.** river class (§205.2) + `population` + crossing kit (CX-07).
> **VERDICT — MISSING.** §232 makes the WALL a district partition; **the same law should
> extend to water, and the owner's §239.1 already generalised block termination to "wall,
> street, water, cliff" — so half the machinery is ruled.** What is missing is the
> *duplication* consequence: a divided settlement needs two of the small things, and that
> is what makes it read as divided rather than as one settlement with a river drawn on it.

---

## §3 · DEFENSIVE LOGIC — STRUCTURE, NOT DECORATION

### §3.1 · ⭐⭐ THE CIRCUIT IS A CHAIN OF RUNS, AND EACH RUN HAS A CAUSE

This is the most important structural finding in my half of the corpus, and the corpus
proved it the hard way. The **polygon/oval circuit prior survived HF-1, HF-2 and HF-3** and
deformed at least eleven plates. It was cured — at n=6 — by **enumeration with reasons**:
naming N runs and giving each run its own narrative (§242.2, counter-phrase #24).

That is a prompt-engineering result. **Its engineering translation is the finding, and it
is exactly the shape our generator needs:** a wall is not a shape fitted around a fabric.
**A wall is a SEQUENCE OF RUNS, each of which is a decision with a cause**, and the causes
come from facts we already hold.

The run taxonomy, read off the four enumerated plates I opened (hf318, hf372, hf385, and
hf389; hf373 confirms at hill-town scale) [M-view]:

| run type | cause | drawn as | seen on |
|---|---|---|---|
| **CREST / RIDGE RUN** | high ground worth holding | long, straight-ish, **towered** | hf318 "CREST WALL RUN", hf372 "THE CREST", hf389 north |
| **NOTCH** | an institution demanded inclusion | the wall **doubles back** to wrap a precinct | hf318 "ABBEY CLOSE NOTCH", hf389 (church precinct), hf374 (cathedral close) |
| **DETOUR TO A WORK** | a mill, pond or quay had to be inside | a hard kink around the asset | hf372 (around mill + mill pond) |
| **TERRAIN-SURRENDER RUN** | a cliff/scarp/marsh defends itself | the wall **thins to a parapet or STOPS**; **zero towers** | hf318 "SCARP", hf372 "CLIFF FACE", hf373 "CLIFF'S EDGE PARAPET", hf389 (marsh) |
| **WATER TERMINATION** | the river is the flank | wall ends at the bank; **a chain across the water** | hf318, hf372, hf385 ("RIVER CHAIN" ×2), hf389 (chain between two drums) |
| **TOFT-BACKS RUN** | the wall was built along existing property | **wobbles plot by plot** along the backs of the tofts | hf372 "TOFT BACKS", hf318 (burgage tofts), hf385 "CROOKED BACKS" |
| **NEW CUTTING** | one campaign, one decision, open ground | **ruler-straight**, long | hf385 "NEW WALL CUTTING", hf374, hf389 west |
| **RE-USE RUN** | an older ditch or work was on the line | straight cut across an old ditch; the ditch survives as gardens | hf318 "OLD DITCH GARDEN STRIP", hf372 "OLD DITCH" |
| **BAD CLOSURE** | two campaigns met and did not agree | a **visible seam**, a mismatched join, one odd tower | hf318 "SEAM AT TOWER BUILD", hf373 "MISMATCHED JOIN", hf385, hf389 |

**Every one of those nine causes is derivable from facts we hold.** Terrain gives crest,
surrender and water termination; `institutions` gives the notch and the detour; the epoch
model (§240) gives the new cutting and the bad closure; the fabric's own plot geometry
gives the toft-backs run; `history` gives the re-use run.

> **CX-13 · THE CIRCUIT AS AN ENUMERATED RUN CHAIN**
> **MECHANISM.** Wall stage (per §240, once per epoch, bounding an epoch that is already
> complete): walk the boundary of the epoch's built extent and **segment it into N runs by
> CAUSE**, choosing each run's type from the taxonomy above by testing the local
> substrate/fabric/institution conditions in a fixed priority order. Each run then carries
> its own generation parameters: straightness, tower policy, thickness, ditch policy,
> wall-foot policy (CX-17). N is not a knob — it falls out of how many distinct conditions
> the boundary crosses. Closure between the first and last run is deliberately imperfect and
> **marks a seam**.
> **DERIVATION HOME.** relief/water substrate + `institutions` + §240 epoch index +
> fabric extent + `history` (fortification events).
> **VERDICT — PARTIAL, and this is the highest-leverage single mechanism in my half.**
> §205.3 (terrain-maximised defences) is RULED and covers two of the nine run types
> correctly and explicitly ("a cliff flank needs NO wall — drawing one is the violation").
> §161m gives a wall-trace law. §240 gives the epoch that a circuit bounds. **What no law
> supplies is that the trace is a CHAIN OF TYPED RUNS rather than a single trace with
> exceptions** — and that difference is exactly what atlas Table A's T-10 verdict measured
> as b6's failure: *"the trace reads geometric, not economic."* Implementing §205.3 as a
> post-hoc exception on a single trace will reproduce the reference corpus's own worst
> defect. Implementing it as run typing produces the cure the corpus needed six attempts to
> find.

### §3.2 · Tower placement is OPPORTUNISTIC, and the asymmetry is the tell

**[M-view, n=7 walled plates opened]: 6 of 7 show towers ABSENT on at least one flank, and
in every one of those six the bare flank is the terrain-defended one** (river, cliff/scarp,
marsh). The seventh (hf368) is a plate the index itself flags for the oval prior.

Per-plate: hf318 towers on the W/NW/crest runs, none on the scarp or river · hf372 five
towers on two of seven runs, both facing level ground · hf385 six on the new circuit's
open W/NW, none along the river · hf389 clustered on the N/NW/W, absent on river and marsh ·
hf373 on the N/NE, the SW cliff carrying only a parapet · hf62 bastions on the landward arc,
the river face a low quay wall.

**[M-index] the census names an explicit absence on only 7 of 138 (5.1%)** — the §0.4
under-report in its purest form. The viewed sample is the honest figure.

Two further rules from the same viewings:

- **Spacing within a towered run is uneven, and evenness is the corpus's strongest
  "generated" tell** (atlas prior #7; §214 already bans it by name: "towers as drawn
  rounds/squares at SEEDED-IRREGULAR intervals").
- **A tower is a TYPE, not a repeat.** hf315 draws ten genuinely different ones — flush
  square, projecting square, round drum outside the wall, D-shape open-backed to the town,
  angular beaked with its point to the field, corbelled watch turret, tower-house of double
  thickness, hollow with a newel stair, splay-mouthed artillery mount, and a **ruined stub
  with the walk detouring around it on timber.** The open-backed D and the beaked tower are
  *functional* choices, not styles.

> **CX-14 · OPPORTUNISTIC TOWER POLICY**
> **MECHANISM.** Per run (CX-13), a tower policy: `none` on terrain-surrender and water
> runs; `clustered` on runs facing approach or level ground, count driven by run length ×
> threat; `sparse` elsewhere. Positions within a run are seeded-irregular; type is drawn
> from a small typed set selected by era, wealth and the run's exposure.
> **DERIVATION HOME.** run type (CX-13) + `threats` + `defenseGenerator`'s military scores
> + `prosperity` (masonry is expensive) + epoch/era.
> **VERDICT — PARTIAL.** §214 has the drawing rule (irregular intervals, drawn rounds, real
> gatehouses) and §205.3 has the terrain principle. **Neither says towers are a per-RUN
> policy rather than a per-circuit density**, which is the difference between "irregularly
> spaced all the way round" (still wrong) and "clustered where it matters and absent where it
> does not" (right). One line of the §214 brief, cheaply sharpened.

### §3.3 · Gates: count, placement, and the destination law

**[M-view] gate counts by tier, small n but consistent:** town 2–4 land gates (hf318 two;
hf373 two; hf62 ~three; hf372 ~three plus a river gate; hf385 ~four across three circuits);
city ~4 (hf368); metropolis 6–7 (hf389, with extramural ribbons at five of them).
**[M-index]** `gate` is named on **63 of 138 settlement plates (45.7%)** — against
`wall_circuit` at 51.4%, i.e. **a wall is named without a gate only rarely**, which is the
sanity check.

Four placement rules, all visible:

1. **A gate exists where a ROAD arrives.** Not the reverse. On hf318, hf372, hf385 and
   hf389 [M-view] every gate sits on an approach road that continues outside as a ribbon or
   a lane; the roads are the older fact.
2. **Gate names encode DESTINATION**, not compass position — hf21's *Porta Peregrina* /
   *Mercatorum*, hf63's *Porta Fluminis*, hf385's "MARKET GATE". (The corpus's duplicate-name
   defect — three EAST GATEs on hf138 — is exactly what our TRUE labels beat outright.)
3. **Gates are TYPED and unlike each other.** hf316's seven gates are seven different
   things: twin-drum, plain square, a **bricked-up arch drawn solid**, a stair postern, a
   mill water gate over the stream, a bridge bar, and — the best of them — **an "unfinished
   bar", a bar across the road where the wall was never completed.**
4. **⭐ A special-purpose gate exists for a special-purpose flow**: the muck gate (hf369),
   the conduit's own arch (hf368 [M-view]), the water gate with a chain, the postern.

> **CX-15 · GATES AS ROAD TERMINALS, TYPED**
> **MECHANISM.** Gate stage, after CX-13 and after the region's approach roads (CX-38): a gate is
> instantiated **at each intersection of an approach road with the circuit**, plus optional
> posterns and special-purpose piercings requested by systems (conduit, muck lane, mill
> race, quay). Type is selected by the road's rank and the settlement's wealth/era; the
> name is the destination, from the road's own target (a real fact we hold in `neighbors`).
> Blocked/bricked gates are produced by the epoch model when a later ring makes one
> redundant.
> **DERIVATION HOME.** `neighbors` (destinations, and hence road bearings) + road rank +
> `prosperity` + §240 epoch history.
> **VERDICT — PARTIAL, with the naming arm a clear WIN.** §239.2's engineering gain already
> states the goal exactly — *"every gate necessarily meets the street web"* — and the
> wall-side street delivers it on the inside. The outside half (gate ⇒ road ⇒ destination
> name from `neighbors`) is not stated anywhere, is nearly free, and is a place where our
> TRUE labels beat every reference plate in the corpus.

### §3.4 · Where the wall meets water — one device, drawn five ways

**[M-view] 5 of 7 walled plates terminate a run at water and mark the termination.** The
device is always the same idea — *the water is the wall, and the gap is closed by
something cheap* — and it is drawn as: a **chain across the channel** (hf318, hf372,
hf385 ×2, hf389 between two drum towers), a **quay wall** substituting for the circuit
(hf385, hf62's river face), a **water gate** with a grille (hf313, hf316's mill water
gate), a **boom** (hf24, hf101), or nothing at all where the water is wide enough.

This composes with §232 exactly: the water-terminated run leaves the waterfront **outside**
the district partition in the topological sense, which is why every one of these plates puts
the quays, mills and landings in their own strip with their own grain.

> **CX-16 · WATER TERMINATION MEMBERS**
> **MECHANISM.** Where a run terminates at water, emit a termination member from
> {chain, boom, water gate, quay wall, open} selected by channel width, navigability and
> wealth; and register the waterfront strip as its own district (§232 composition).
> **DERIVATION HOME.** river class (§205.2) + `prosperity` + water role (CX-05).
> **VERDICT — HAVE, mostly.** §205.1 already says *"water gates open through the wall at the
> banks"* and §205.3 says *"circuits anchor ON rivers, the wall ending in water-gate towers."*
> This is a law that is ruled and unbuilt rather than missing. The only addition my evidence
> makes: the **chain** is the commonest device in the eligible corpus, not the water gate,
> and it is one dashed catenary between two towers — the cheapest possible member.

### §3.5 · Citadel position — a four-way taxonomy, and it is derivable

| position | meaning | plates |
|---|---|---|
| **CORNERED-AND-DOMINATING** | on the highest ground inside, at a corner of the circuit, with its own ditch — the commonest | ★hf389 (castle on a hachured mound, NW corner, own ring), ★hf368 (castle NW on its mound), hf374 (castle at the ridge end) |
| **SUMMIT-SEPARATE** | its own walled ring at the top, the town wrapping below | ★hf373 "HIGH HOLD" [M-view], hf329, hf236's chief's compound |
| **DRIVEN-IN (the wound)** | a later citadel forced into an existing town, **facing INWARD** | hf330 — gate and heaviest work face the town, a cleared wedge with the ghosts of demolished streets under it, two old gates bricked because they opened into the cleared belt |
| **DETACHED / ON THE WATER** | outside the fabric entirely, or on its own island/spur | hf111 motte-and-bailey, hf293's island lazaret-fort, hf381's toll fort at the pass |

⭐ **The DRIVEN-IN case is the one worth building.** It is the only one that makes the
citadel a *dated event with victims*, and it produces four consequences for free: a cleared
wedge, ghost streets under it, bricked gates, and a new soldiers' quarter along the new
approach. That is §240's epoch machinery pointed at a single institution.

> **CX-17 · CITADEL SITING**
> **MECHANISM.** Choose position from the four-way taxonomy by relief (summit available?),
> circuit geometry (corner available?), and **whether the fortification event post-dates
> the fabric epoch** (§240). The driven-in case emits a clearance polygon, ghost geometry of
> what it destroyed, gate closures where the clearance blocks them, and a garrison
> micro-district on the approach.
> **DERIVATION HOME.** `institutions` (castle/citadel) + relief + `history` (fortification
> event date) + §240 epoch index + `government` (a lord's citadel faces the town; a
> communal one does not).
> **VERDICT — PARTIAL.** §240.3 already records that the wall becomes *"a first-class dated
> EVENT, binding the map to the event stream as truth rather than decoration"* — the same
> sentence should cover the citadel, and does not. The inward-facing gate is the detail that
> makes it a political statement rather than a building, and it is one boolean.

### §3.6 · Ditch, bank and the defence LADDER below stone

hf261 is the eligible ladder plate and it is directly implementable: **the SAME kinked
trace armoured five ways** — hurdle + thorn → palisade on a bank → revetted bank and ditch
with timber towers → narrow curtain with open-backed C-towers → full curtain with
rubble-core hatch, drums, barbican and double ditch. hf236 adds the pre-urban rung (two
uneven contour-following ramparts plus a partial third arc, staggered angled gate passages).

⭐ **The point is that the TRACE is the persistent object and the ARMOUR is the variable.**
That is precisely §240's epoch model applied to a single feature: the same circuit walks up
the ladder as the settlement's wealth and threat rise, and each upgrade is a dated event.

**[M-index]** `palisade` **6.5%** and `ditch_bank` **9.4%** of settlement plates — sub-town
defence is present and under-written.

> **CX-18 · THE DEFENCE-ARMOUR LADDER ON A PERSISTENT TRACE**
> **MECHANISM.** The circuit trace persists across epochs; its `armourRung` is a separate
> dated property walking hurdle → palisade-on-bank → revetted bank+ditch → narrow curtain →
> full curtain. Rung selects the drawn vocabulary (tick row vs double band), thickness,
> tower type and ditch profile. A settlement may carry different rungs on different runs.
> **DERIVATION HOME.** `prosperity` + `threats` + `defenseGenerator`'s military readiness +
> tier + `history`.
> **VERDICT — PARTIAL.** §214 names palisade tick-rows and ditch grammar and tier-scales
> them; §240 gives the epoch. **Nothing makes the trace persist while the armour changes**,
> which is what turns two laws into one mechanism and delivers §11.0's inertia at the
> circuit level. Also worth recording: **different rungs on different runs of one circuit**
> is drawn (hf372's cliff face has a low parapet where the rest is curtain) and is one line.

### §3.7 · ⭐⭐ THE INTERVALLUM AND THE WALL-FOOT — the §239 calibration

The owner's §239.2 states: *"on BOTH sides of the wall — around the periphery or directly
attached — there are streets, with very few exceptions."* My evidence **supports the law
and sharpens the exception clause into a derivation**, which is the more useful result.

**[M-view, n=7 walled plates]: 7 of 7 have a wall-side street on SOME runs. 0 of 7 have one
on EVERY run.** The presence is not a settlement-level property. **It is a per-run property,
and it correlates exactly with the run's own type from §3.1:**

| run type | inner wall-foot, observed | why |
|---|---|---|
| NEW CUTTING across open ground | **clear band / street** — hf385's new circuit encloses fields; hf372's north run has a clear band behind the ramparts | the wall came first; there was nothing to displace |
| CREST / approach runs | **street**, hf318's crest run, hf389's north, hf368 | circulation and muster where the fighting is |
| TOFT-BACKS run | **no street; plots abut** — hf372 "TOFT BACKS", hf318's burgage tofts, hf385's "CROOKED BACKS" | the wall was built along existing property lines; there was nothing to take |
| TERRAIN-SURRENDER run | **no street** — hf373's cliff parapet, hf318's scarp | there is no ground to put one on |
| military compound | **buildings abut the inner face deliberately** (atlas T-22; hf55, hf345) | the ranges ARE wall-owned structures |

**Outside the wall**, the corresponding observation: a clear belt exists where the defence
is live (hf372's cleared field under siege; hf311's ditch and berm), and is **eaten first**
where it is not (hf40's shanties leaning on the outer face; hf365's ditch built over as
shops at the busy end, gardens in the middle, still open and wet at the poor end).

⭐ **That last plate is the whole thing in one sentence: the outer clear belt's survival
varies ALONG the circuit, by the pressure at that point.**

> **CX-19 · PER-RUN WALL-FOOT POLICY**
> **MECHANISM.** Each run (CX-13) carries an inner and an outer wall-foot policy derived
> from its own type: inner ∈ {street, lane, none-abutting, wall-owned}; outer ∈ {clear,
> ditch, encroached}. §239.2's guarantee — the wall is always reachable and every gate meets
> the street web — is delivered by requiring **at least one continuous inner circulation
> path**, which may route one block in from the wall where a run's policy is `none-abutting`.
> The outer belt's encroachment level varies by local pressure (adjacent quarter's wealth
> and the gate's traffic), not globally.
> **DERIVATION HOME.** run type (CX-13) + §240 epoch order + adjacent ward wealth + gate
> traffic.
> **VERDICT — PARTIAL, and this is a genuine sharpening of a ruled law.** §239.2 is right
> and its engineering gain is real. **But "with very few exceptions" implemented as a global
> ring road will produce a band the corpus never draws**: every enumerated plate has runs
> where the fabric touches the wall, and those runs are the ones that tell you the wall came
> second. §200's wall-clearance census must therefore exempt by RUN TYPE, not just by named
> member class — and §200.2's abutment variant already anticipates this ("lawful only as an
> explicitly-derived variant"). **This is my most concrete recommendation to wave nine:
> make the derivation the run type.**

### §3.8 · The outgrown wall — five fates, and a fossil vocabulary

hf124 (the plan cure), hf347/hf385 (three circuits) and hf365 give a complete, discrete
ladder. A wall a town has outgrown becomes one of exactly five things:

1. **A STANDING INTERNAL WALL** — still there, built against and over, pierced by
   unlicensed doorways and a cart opening, its ditch built over. Towers become **dovecotes
   and dwellings** (★hf385 "DOVECOTE TOWER" ×3, "TOWER DWELLING" [M-view]; hf124's dovecote
   nest-dot circle).
2. **A QUARRIED STRETCH** — reduced to a stub with a mason's yard beside it and a garden
   built on top; the stone reappears in the town's new work (hf365, hf124).
3. **A FOSSILISED STREET** — gone as a wall, surviving as a **curving lane exactly on its
   line** (★hf385's "CROOKED LANE" wrapping The Knolle [M-view]; hf347).
4. **A FOSSILISED PROPERTY LINE** — gone entirely, surviving as the **curving boundary
   between two differently-textured parcels**, kinking the building lines as it goes
   (hf124, hf365, hf335's ancient hedge doing the same job).
5. **A FILLED DITCH AS A GARDEN STRIP** — the single most legible fossil in the corpus:
   **a curving strip of long narrow gardens** where the ditch was (★hf318 "OLD DITCH GARDEN
   STRIP", ★hf385 "OLD DITCH GARDENS" [M-view]; hf347, hf365's rope walks on the flat ditch
   ground).

And the gate's four fates in parallel (hf365): whole and reused as the lock-up · a single
jamb with the road running round it · gone but for **the road's narrowing at that point** ·
bricked into a house.

**[M-index]** `wall_dead` (bricked/blocked/robbed/quarried/stub/property-line) is named on
**15 of 138 settlement plates (10.9%)** — respectably high for a lower bound, and it means
the corpus treats wall death as *normal*, not exceptional.

> **CX-20 · THE FOSSIL LADDER**
> **MECHANISM.** When §240 adds a later ring, the superseded circuit does not vanish: each
> of its runs draws a fate from the five-rung ladder, weighted by local land pressure
> (high pressure → quarried or built over; low → standing). The fate then emits real
> geometry into the CURRENT fabric — a curving lane in the street graph, a curving parcel
> boundary in the plot layer, a strip of long narrow gardens in the land-use layer, a
> tower-shaped building. **The old wall stops being a wall and becomes an input to the
> street, plot and land-use stages.**
> **DERIVATION HOME.** §240 epoch index + land pressure (population growth between epochs)
> + `prosperity`.
> **VERDICT — MISSING, and it is §240's biggest unclaimed dividend.** §240.3 lists the
> dividends it expects (vintage triad, density gradient, demotion) and does not list this
> one. §239.4 gets close from the other direction (a circuit outliving its fabric). The
> mechanism is what makes an old town look old at a glance **without drawing a single ruin**,
> and it directly serves MF-S3a's growth-sequence work — the fossil is how you read history
> out of a plan.

---

## §4 · THE EDGE AND THE OUTSIDE

The owner named this explicitly, and it is where the corpus is most obviously ahead of us.
Atlas T-24's verdict on b6's countryside was blunt: *"the weakest surface in b6… field
parcels are ~10–30× the corpus's size relative to the settlement"* — and at village and
thorp the countryside is 85%+ of the plate.

### §4.1 · Three edge kinds, and what selects between them

| edge | drawn as | selected by |
|---|---|---|
| **HARD** | fabric stops at a line — wall, water, cliff, marsh, intake wall | a physical or legal boundary exists |
| **FEATHERED** | plots thin, gaps widen, gardens then closes then fields; no line anywhere | no boundary; ordinary growth |
| **RIBBON** | fabric continues along the ROAD only, thinning with distance and **stopping at different distances on different roads** | growth with a strong movement axis |

⭐ **[M-view] hf389 is the exemplar and the detail matters: extramural ribbons at five gates,
each stopping at a DIFFERENT distance.** Equal-length ribbons would read as generated. The
stopping distance is a per-road fact: it tracks that road's traffic.

**The hard edge is not the default even where a wall exists.** [M-view] hf385's new circuit
encloses **brickfield, orchard, closes, tenter grounds and two ruled empty plots** — the
wall is out ahead of the fabric, so the *real* edge is feathered and sits well inside the
circuit. hf347 and hf324 (the half-filled bastide) do the same.

> **CX-21 · EDGE KIND PER BEARING**
> **MECHANISM.** Fabric-edge stage: for each bearing, classify the edge as hard/feathered/
> ribbon by testing for a boundary object, then for a road. Ribbon extent is a per-road
> function of that road's rank and traffic — **explicitly unequal across roads.** Feathered
> edges emit the density ramp (plots → gardens → closes → fields) rather than a boundary.
> **DERIVATION HOME.** circuit runs (CX-13) + substrate boundaries (CX-02) + approach-road
> ranks (CX-38) + `population` growth rate.
> **VERDICT — PARTIAL.** §5.0e (faubourg) and §232 (the wall as a partition that CLIPS
> growth) cover the hard and ribbon cases well, and atlas T-21 records b6 as MEETS on
> extramural presence. **The unequal ribbon length is not covered and is the difference
> between "we have suburbs" and "the suburbs look real."** One number per road.

### §4.2 · Suburbs cluster at ONE or TWO gates — and WHICH gate is derivable

MF-S1's T-21 established the concentration (never evenly distributed). **The eligible corpus
answers the follow-up question: which gate.** Four selectors, in observed priority order:

1. **THE BUSIEST ROAD.** hf311's knot is at the gate the main road enters; hf20, hf42.
2. **THE CROSSING.** hf62's entire far-bank development is at the bridge foot and nowhere
   else along the reach [M-view]; hf102's bridgehead cluster; hf155.
3. **THE WATER.** hf138's growth strands along the shore; hf389's densest extramural work
   (tenter grounds, rope walk, canal) hugs the river and canal [M-view].
4. **THE POOR SIDE.** hf40's shanty belt is on the poor half only — the suburb goes where
   land is cheapest, which is the side nobody wants.

And the negative rule: **suburbs do not form at a gate that leads nowhere.** hf318's two
suburbs are at the two gates with roads; the scarp and river sides have none [M-view].

> **CX-22 · GATE SELECTION FOR EXTRAMURAL GROWTH**
> **MECHANISM.** Rank gates by (road rank × destination importance) + crossing bonus +
> waterfront bonus − adjacent-ward wealth, and allocate extramural growth to the top one or
> two only. Never distribute evenly.
> **DERIVATION HOME.** `neighbors` (destination importance is a fact we hold and no
> reference plate has) + `tradeRouteAccess` + ward wealth (§10.A3).
> **VERDICT — PARTIAL.** §5.0e and §18.2 give the faubourg and the inn belt; §232 makes
> faubourgs their own districts (correct). **The gate-selection rule is not stated.**
> This is another place our TRUE data wins: we know where the roads actually go.

### §4.3 · ⭐ THE EXTRAMURAL ORDERING — a distance ladder, and it is a real rule

The corpus orders extramural land uses by distance from the gate with striking consistency.
Composited from hf311, hf267 [E-index — both are outside my viewing set; hf311 and hf267 are
holdout-excluded and were read only in the index], hf343, hf383, hf369, hf389 [M-view],
hf332 [M-view]:

| band | contents | why it is there |
|---|---|---|
| **0 — at the gate** | toll bar, cart queue, gate ward and watch house | control |
| **1 — the first hundred paces** | **great courtyard inns eating enormous plots**, stables, farriers, smithies, hay and fodder market, beast pound | the things that serve arrivals, and need land the town has not got |
| **2 — just beyond** | market gardens in rig, orchards, tenter grounds, rope walks, brickfields | **long or dirty processes that need cheap flat ground** |
| **3 — deliberately apart** | tanneries, dye yards, lime and tile kilns, shambles overflow, potters — **always in ONE downwind/downstream arc** | noxious, and the arc is a single sector |
| **4 — set apart by law** | leper house with its own boundary ditch, lazaret, plague ground, **the common midden** | contagion and disgust |
| **5 — the last mark on the road** | **gallows**, and beyond it wayside crosses and milestones | jurisdiction's outer edge, sited to be seen by arrivals |
| **6 — the working countryside** | market-garden belt → arable → pasture → wood/waste | carriage cost (hf371's ring model, index-only) |

Two hard rules fall out, and both are NEGATIVE rules of the kind the brief asked for:

- ⭐ **The noxious trades occupy ONE ARC, not a ring.** hf366 states it exactly ("the noxious
  trades all lie in one downwind, downstream arc"); hf343, hf368 [M-view], hf288 confirm.
  A ring of tanneries would be wrong.
- ⭐ **Charity and contagion are on the SAME road but at opposite distances.** hf383: the
  great hospital stands **just inside a gate**; the leper house is **small and far out along
  its own road**, with its own chapel, burial plot, well, boundary ditch and a roadside alms
  box with a worn patch beside it. The hospital wants traffic; the lazaret wants distance.
  **Same institution family, opposite siting rule, and both derivable from the same fact.**

**[M-index] over 138 settlement plates:** `extra_inn` **15.2%**, `gardens` **14.5%**,
`suburb` **13.8%**, `noxious` **8.7%**, `cemetery` **8.0%**, `lazaret` **4.3%**,
`gallows` **2.9%**. All lower bounds; the ordering, not the shares, is the finding.

> **CX-23 · THE EXTRAMURAL DISTANCE LADDER**
> **MECHANISM.** Extramural stage, after gate selection: place institutions and land uses
> into distance bands 0–6 measured **along the approach road**, from a per-class band
> assignment. Noxious classes additionally take a single ARC constrained by the dirt vector
> (CX-11); contagion classes take a distance floor and their own access lane; the gallows
> takes the outermost band on the busiest road specifically.
> **DERIVATION HOME.** `institutions` (each class carries its band) + `tradeRouteAccess` +
> dirt vector + `government` (a jurisdiction's gallows).
> **VERDICT — PARTIAL.** §161c's EDGE ring and §6's noxious rule give bands 3 and 6; §18.2
> gives band 1. **Bands 4 and 5 (charity/contagion/execution) and the single-arc constraint
> are not covered**, and the ordering is not expressed as an ordering. The whole ladder is
> one table keyed off the institution list we already generate — the cheapest large win in
> this document.

### §4.4 · How the field system meets the built edge — four junctions, all drawn

This is the specific thing atlas T-24 says b6 gets worst, and the corpus is precise about it:

1. **TOFT-TO-FURLONG.** The plot tails end and the strips begin, **and the strips run at the
   toft's own bearing** for the first furlong before swinging to the valley's (hf93, hf85,
   hf299, ★hf318's burgage tofts running down to the river [M-view]).
2. **CLOSES AS THE BUFFER.** Between town and open field lies a belt of small hedged closes,
   orchards and paddocks — irregular, individually fenced (hf221's bocage, ★hf385's
   "CLOSE"/orchard/tenter belt inside the new wall [M-view], hf365).
3. **THE INTAKE LINE.** ⭐ The sharpest edge in the corpus: hf352's **one continuous wall
   running around the hill at one height, above which nothing is enclosed and below which
   everything is.** A single line that explains an entire landscape. hf142 and hf356's
   scarp-foot lines do the same in another register.
4. **THE HARD REFUSAL.** Fields simply stop at the marsh/sand/salt with a drawn margin —
   hf354's "sour edge" with dead trees; hf351's field system whose seaward third is pale
   unrecoverable sand; ★hf389's reed marsh [M-view].

And the drift detail that makes any of it read as history: **hf348's ridge-and-furrow drawn
running OVER the old streets** of a dead town — the corpus's best dating device — and
hf335's new plot ranks **inheriting the furlong pitch** of the fields they replaced.

> **CX-24 · THE FIELD/FABRIC JUNCTION**
> **MECHANISM.** Countryside stage: emit a junction band between fabric and open field whose
> type is selected per bearing — toft-to-furlong (strips inherit the plot bearing for one
> band), closes buffer, intake line (a single iso-elevation boundary where terrain is
> upland), or hard refusal at a substrate mask edge. Strip bearings are anchored to **roads
> and streams**, never radially to the settlement (atlas prior #2, standing).
> **DERIVATION HOME.** `terrainType` + plot geometry at the edge (MF-S3a's layer) + the
> refusal mask (CX-02) + open-field vs enclosed mode (§16 is already ruled).
> **VERDICT — PARTIAL.** §16's open-field ruling and §16.5's enclosed mode exist and
> §16.2's orientation law is right. **The junction band itself is not modelled** — b6 goes
> straight from fabric to very large field polygons, which is why T-24 reads as it does.
> The intake line is MISSING outright and is a one-line iso-elevation boundary with enormous
> legibility return.

### §4.5 · Approach roads and their furniture

hf71's five-rung road ladder and hf320's eleven-way street dictionary are already in the
atlas as T-23. What the eligible corpus adds is **what stands BESIDE the road, and at what
spacing**:

- **milestones / mile posts** at regular intervals on a paved high road (hf155, hf239,
  hf295); **way-poles** through a pass (hf158); **guide posts** across a featureless moor
  (hf352); **cairns** at a summit (★hf381 [M-view], hf145's grave cairns "at the worst
  stretch");
- **wayside crosses and shrines** approaching a settlement (hf311, hf272's station crosses);
- ⭐ **the wayside inn at the HALF-WAY POINT.** hf381 [M-view] draws market towns on the
  great road at about one day's travel apart, **with an inn standing alone at the exact
  midpoint of each gap** — "The Halfway House", "The Traveller's Rest", "The Sign of the
  Boar". This is a placement rule stated as geometry;
- **the pack-horse inn** on the dashed pack track where no cart could go, and a **hospice**
  at the pass with a **toll fort**;
- **the drove road runs wide and green and AVOIDS the towns and their tolls** [M-view hf381]
  — a road that is defined by what it refuses;
- **the superseded approach**: old lanes dwindling to dotted beside the new bridge [M-view
  hf381]; hf158's avalanche fan burying the old track with the new line cut around it.

> **CX-25 · ROAD FURNITURE AND THE DAY'S-TRAVEL RULE**
> **MECHANISM.** Region/approach stage: roads carry furniture by rank — milestones on
> paved, guide posts on featureless ground, cairns at summits, crosses near settlements.
> **Between any two settlements more than a day's travel apart on a road of rank ≥ secondary,
> place a wayside inn at the midpoint**, and a rest stance on a drove road. A superseded
> route is retained as a ghost with dwindling rank.
> **DERIVATION HOME.** `neighbors` (distances!) + road rank + `terrainType` +
> `tradeRouteAccess`.
> **VERDICT — MISSING, and it is nearly free.** §11.3's road-death ladder is ruled and
> covers rank decay. Nothing places anything **on** a road. We hold `neighbors` with
> distances, which is precisely the input the rule needs, and the output is a named, TRUE
> feature on an otherwise empty stretch of plate — exactly the low-tier problem T-24 names,
> where the countryside is 85% of the leaf.

### §4.6 · What the countryside's own structure teaches

Six rules, each with a plate and each implementable:

1. **FIELD SHAPE ENCODES TENURE, not terrain alone.** hf238's demesne is **one-way plough**
   against the tenants' **multi-bearing patchwork**, and the contrast lands at a glance.
   hf305 draws the invisible layer directly: tenure dashes dividing one holder's strips from
   another's, grass baulks, headland, gore wedge, fallow, mark stones, a **dole meadow
   divided into numbered lots for annual re-allotment.**
2. **BOUNDARY KIND IS ITS OWN VOCABULARY.** hf321 draws twelve — laid hedge with irregular
   trees standing IN it, hedge-and-ditch **with the ditch on one side only, showing which
   owner dug it**, dry-stone wall, bank-and-ditch, paling, hurdle with gaps, **grass baulk
   with no line at all**, lynchet, wood bank, drainage ditch, park pale — and the one the
   renderer most needs: **a property line where the hedge is gone entirely, surviving only
   as the edge between two differently-textured parcels.**
3. **FARMSTEAD SPACING ENCODES THE SETTLEMENT MODE.** hf356 is the corpus's best reasoning:
   **above the scarp, no villages at all and two isolated farms at wells; below it, heavy wet
   clay and therefore DISPERSED moated farmsteads; along the junction, a tight row of
   nucleated villages one per spring.** Three settlement modes on one sheet, each caused.
4. **THE PARISH IS A STRIP ACROSS THE GRAIN.** hf356 again: each parish is a long narrow
   strip running UP onto the down for sheep and DOWN into the vale for wood, all parallel,
   all crossing the scarp. One device explaining a whole geography.
5. **MANAGED WOOD IS DRAWN AS COMPARTMENTS AT DIFFERENT ROTATION STAGES**, with an
   **exhaustion gradient with distance from the city** (hf370: nearest the city the wood is
   gone entirely and is furze, heath and stump ground; then coppice; then high forest; then
   unbanked wild wood).
6. **THE COMMON IS AN INSTITUTION WITH INVISIBLE INTERNAL BOUNDARIES.** hf360: the outer
   bound is a bank and ditch with a gated gap and a pound per township, but the internal
   divisions between the five townships' portions are **a line of mark stones, a stream, a
   line of old thorns and a ridge** — real and invisible — with an **intercommon wedge
   bounded by nothing at all.**

> **CX-26 · THE COUNTRYSIDE AS STRUCTURE**
> **MECHANISM.** Countryside stage: (a) parcels carry a `tenure` and a `boundaryKind`, and
> the boundary is drawn from the twelve-way vocabulary — including the no-line cases;
> (b) settlement MODE (nucleated / dispersed / linear) is derived, not assumed, from soil
> proxy + water availability; (c) woodland is compartmentalised with rotation stages and a
> distance-graded intensity; (d) commons carry an outer physical bound and internal
> non-physical ones.
> **DERIVATION HOME.** `terrainType` + `population` + `government`/tenure model +
> `resources` (wood, pasture) + `institutions`.
> **VERDICT — MISSING for (a),(c),(d); PARTIAL for (b).** §16 rules the open-field/enclosed
> axis, which is (b)'s half. **Nothing derives dispersal**, and dispersal-vs-nucleation is
> arguably the single most visible countryside fact at village tier and below. T-24's
> six ground primitives are the render half; this is the derivation half, and the derivation
> is what makes the primitives land in the right places.

---

## §5 · INSTITUTION SITING AS A RELATIONAL SYSTEM

The brief asked for **distances and adjacencies, not presence** — and for the NEGATIVE
rules. This is where the corpus is most systematic and where our laws are thinnest: §161n
gives institutions a scale ladder (how BIG), and nothing gives them a siting rule (WHERE).

### §5.1 · The siting table

Read off the eligible corpus; ★ = confirmed on a plate I opened. "centre" means the primary
void; distances are in bands (at / near / mid / edge / outside / far outside).

| institution class | relative to CENTRE | relative to GATE | relative to WATER | relative to WALL | negative rule (what it is never next to) |
|---|---|---|---|---|---|
| **great church / cathedral** | at or one block off; **its own precinct, AIRIER than the fabric** | — | — | often **notches the wall** to be included | never in the noxious arc; never on the flood ground |
| **parish church** | at a secondary void or on a knoll; **at a visibly different ANGLE to the streets around it** (★hf335) | — | above flood line | — | never downwind of tanning/smoke (★hf332 puts it uphill from the salt air) |
| **monastery / abbey** | **outside or at the edge**, own precinct wall, own water | own gate | **takes its own leat/stew ponds**, terraforms drainage (★hf146) | often abutting or outside | never inside the tight core |
| **friaries** | **inside, but distributed and marginal** — ★hf389 has Blackfriars N and Greyfriars S, both against the wall, neither central | — | — | pressed to the wall | never adjacent to each other |
| **castle / citadel** | §3.5's four-way taxonomy | commands one | on the bluff/water if there is one | **corner of the circuit, own ditch** | never in the market |
| **market (primary)** | **IS the centre**; a street-widening, a green or a carved square (hf259's three forms) | on the gate-to-gate spine | — | — | never adjacent to the shambles' drain |
| **specialist markets** | **sited by their goods' logistics — see §6.2** | hay/beast at the EDGE gate | fish AT the quay | — | beast market never in the fine quarter |
| **guild / cloth / market hall** | on or at the primary void | — | — | — | — |
| **tolbooth / weigh house / scales** | **at the void, abutting the hall**; doubled where jurisdiction doubles (hf331) | — | — | — | — |
| **mill (water)** | wherever the flow allows — **the flow, not the plan, sites it** | — | **on the leat, across the tail** | frequently OUTSIDE, and the wall detours to include it (★hf372) | never above the settlement's clean take |
| **mill (wind)** | **on the open exposed ground OUTSIDE**, on a mound (★hf318, ★hf389, ★hf385) | near, on the field side | — | outside | never inside the fabric |
| **quay / warehouse / crane** | edge | at the water gate | **AT the water, warehouses immediately behind** | own strip, own grain | — |
| **granary** | **adjacent to its intake** — ★hf327's granary blocks sit at the boat landing on raised platforms | — | at the landing | — | never at the far side from the road that feeds it |
| **inns (great courtyard)** | on the spine | ⭐ **band 1 OUTSIDE the busiest gate, on enormous plots**; a second cluster at the market | — | — | — |
| **hospital / almshouse** | — | ⭐ **just INSIDE a gate** (traffic = alms) | — | — | — |
| **leper house / lazaret** | — | ⭐ **far OUTSIDE along its own road**, own ditch, own chapel, own well, roadside alms box | isolated island if water exists (hf293) | far outside | never adjacent to any dwelling |
| **cemetery (parish)** | wrapped round the church, **crowded S and E, near-empty N** (hf344, index-only) | — | above flood | — | — |
| **cemetery (overflow/plague)** | — | — | — | **outside**, staked | never inside |
| **gallows** | — | ⭐ **the last mark on the busiest road out**, on a knoll | — | far outside | — |
| **tannery / dye / lime kiln / potter** | — | outside, downwind | **below the clean take, discharge fan drawn** | outside | ⭐ **never upwind or upstream of the settlement — and NEVER in more than one arc** |
| **shambles** | at the market, but **with a blood channel to a drain** | — | drains to the river below the stairs | — | never above a water stair |
| **rope walk / tenter ground** | — | — | often waterside | ⭐ **outside or against the wall — they need LENGTH and cheap flat ground** (★hf389: rope walk beside the canal, tenter grounds outside the E wall) | never in the core |
| **school / scholars' quarter** | ⭐ **adjacent to the religious precinct that spawned it** (★hf327) | — | — | — | — |
| **caravanserai / beast lines** | ⭐ **at the desert/land approach, OUTSIDE or at the outermost quarter** (★hf327) | at one or two gates only | — | outside | never in the river quarter |
| **treasury / mint / records** | ⭐ **inner walled precinct with ONE gate, and the surrounding streets bend so none runs at its doors** (hf334) | own guarded approach road | — | — | never on a through route |

### §5.2 · ⭐ Institutions that generate their own micro-district

The second-order pattern the brief asked for. Six institution classes reliably grow a
service quarter, and the quarter's TRADES are specific to the institution:

| institution | the micro-district it grows |
|---|---|
| **cathedral / great church** | close wall with a ceremonial and a service gate; **prebendal houses each unlike, each in its own garden**; almonry with a poor queue; works yard; the canons' garth quiet vs the lay cemetery crowded; town fabric pressing outside (hf266, index-only) |
| **pilgrimage shrine** | hospices, badge-sellers' encroachment wedge, a **processional circuit worn wider** with station crosses, hostel fields with tent-ring ghosts, a graveyard density gradient from the shrine end (hf272) |
| **university / schools** | schools street, **bookbinders' row**, physic garden, proctors' lock-up, scholars' walk — and the grain changes at every college wall (hf269, hf176) |
| **castle / garrison** | soldiers' lodgings, victualling yards, a horse market along the new approach (hf330); mason's yard, because the castle is always being repaired (hf345) |
| **treasury / mint / records** | scriveners and parchmenters **with soaking pits and stretching frames at the river**, lawyers' inns, lodging houses for suitors, a debtors' hold (hf334) |
| **port / customs** | interpreters' street (drawn as **the busiest lane on the plate**), public crane and public weighbeam the foreign enclaves must use, watch posts, lazaret jetty (hf367, index-only) |
| **infrastructure of any kind** | ⭐ **a custodian's dwelling** — the keeper's cottage at the spring house (★hf368), the lock-keeper's house with garden and toll board (hf295), the wood-ward's cottage (hf370), the warrener's lodge (hf351) |

### §5.3 · The doubling rule

⭐ hf331 and hf380 establish something no law of ours contemplates: **when a settlement
contains two jurisdictions or two faiths, its small institutions DOUBLE, and the doubling
is the point.**

hf331 (dual lordship): a boundary runs **through** the fabric, down the middle of the high
street, jinking behind a plot row. North is the bishop's half; south the borough's. Each has
its own market, its own cross, its own tolbooth, its own scales and **its own gallows outside
its own gate.** And **the two halves have visibly different plot rhythms**, so the
jurisdiction is legible in the grain itself. The shared wall is unequally maintained, with
one ruinous tower where the responsibility lapsed.

hf380 (two faiths): two prayer precincts of different plan, two burial grounds at opposite
ends both outside the wall, two ritual waters, **two butchers' rows each with its own drain,
because the meat may not be shared** — and interleaved fabric with only two streets wholly
of one or the other.

The calibration lane recorded the methodological corollary and it is worth carrying: the
anti-duplicate rule applies to PROPER NAMES only and **must never be applied to institutions
that genuinely double** (§HF-4c #26).

> **CX-27 · INSTITUTION SITING AS A CONSTRAINT SOLVE**
> **MECHANISM.** Institution stage, after the void hierarchy and the circuit: each
> institution class carries a **siting profile** — a band relative to centre, a gate
> relation, a water relation, a wall relation, a required adjacency, and a set of
> **prohibited adjacencies**. Placement is a constrained assignment over candidate sites,
> not a scatter. Classes flagged `spawnsQuarter` additionally emit their named service
> trades as a micro-district with its own grain. Where `government`/`factions` show two
> jurisdictions, or `culture`/faith facts show two communities, the doubling set is
> instantiated on opposite sides of the internal boundary.
> **DERIVATION HOME.** `institutions` (the class list already exists and is rich) +
> `government` + `factions` + `culture` + the void hierarchy (MF-S3a) + the circuit.
> **VERDICT — MISSING, and it is the largest uncovered area in my half after the substrate.**
> §161n gives SCALE. §203 (zone containment + fill) gives an institution a zone to be inside.
> **Nothing gives an institution a RELATION.** Our dossier already knows which institutions
> exist and what they are for; what it never asks is *what must this be near, and what must
> it never be near.* The negative rules are the cheap half and carry most of the realism:
> "never upwind", "never above the clean take", "never on a through route", "never adjacent
> to a dwelling" are four predicates that would prevent most of the siting errors a naive
> placer makes.

### §5.4 · The airiness rule and the precinct boundary

Confirmed on every precinct plate and visible on ★hf389 [M-view]: **religious and civic
precincts are drawn AIRIER than the fabric around them** — courts, garths, gardens, orchards
— and the boundary between the two densities is a **wall with named gates**, never a line.
hf266's whole lesson is that two-density boundary. Atlas T-05's per-district open-share
modifiers already quantify this (+15–20 points for religious precincts, +25–30 for military
compounds); what the corpus adds is that **the density step is the district boundary's only
legible marker**, which composes exactly with atlas T-17 (districts read via grain, material
and footprint shape, never a boundary line).

> **CX-28 · PRECINCT AS A DENSITY STEP**
> **MECHANISM.** A precinct institution emits a bounded zone whose fill band is offset from
> its surroundings by a stated minimum, plus a precinct wall with typed gates (ceremonial,
> service). The step, not a line, is what makes it read.
> **DERIVATION HOME.** `institutions` + §203's per-district fill bands.
> **VERDICT — HAVE, unbuilt.** §203 arm 2 is exactly this law and MF-S1's T-05 supplies the
> numbers. Recorded here only to confirm the corpus agrees, and to add the one missing
> clause: **the precinct's own boundary must be a wall with typed gates**, because that is
> what stops the airier zone reading as a hole in the fabric.

---

## §6 · CIRCULATION AND LOGISTICS

### §6.1 · The gate-to-market spine

**[M-index] `gate` and `market_void` co-occur on 27 of 138 settlement plates**, the
strongest co-incidence in the census. Structurally: the primary void sits **on a route
between two gates**, and the route is the widest channel in the plan. hf129's "dark bazaar
spine gate-to-gate", hf104's "covered bazaar spine gate-to-gate", ★hf318's Crest Street
running gate to gate past the church, ★hf389's High Market on the through line.

This is MF-S3a's territory on the street-hierarchy side; my addition is the LOGISTICS
consequence — the spine must be continuously passable by the widest vehicle the settlement's
trade uses, which is what makes it the widest channel rather than merely a long one.

### §6.2 · ⭐⭐ MARKET TYPE IS SITED BY ITS GOODS' LOGISTICS

**[M-view] hf389 is the discovery, and it is one of the two most implementable findings in
this document.** Varrenholt has FOUR markets and each is where its goods can reach it:

| market | where | why |
|---|---|---|
| **High Market** | central street-widening on the spine | general trade, maximum footfall |
| **Old Market** | at the bridgehead by the river | the older centre, at the older crossing |
| **Fish Market** | **at the quay**, tiny, right on the waterfront | fish arrives by water and does not travel |
| **Hay Market** | **at the SW edge by a gate** | bulky, low-value, arrives by cart, must not enter the fine quarters |

★hf385 does the same at town scale (a "New Market" beside the river quarter and a market
gate between old and new); hf363 draws the corollary in time — **the market MOVES to the new
bridge and the new road, and the lanes tip with it**: those running downhill to the new
market are widened and better paved, those running uphill to the old one narrowed and two
blocked at their upper ends.

⭐ **The general rule: a market's position is a function of its goods' arrival mode and
value density.** Water goods at the water. Bulk goods at the edge gate. High-value goods
central and under watch (hf268's goldsmiths' row **under watch by the priory gate**;
hf366's goldsmiths in "the shortest, narrowest, best-paved street with a gated end and no
yards at all"). That is derivable from `supplyChains` + `resources` + `tradeRouteAccess`.

> **CX-29 · MARKET PLACEMENT BY ARRIVAL MODE**
> **MECHANISM.** Void stage: each specialist market is placed by (arrival mode → nearest
> compatible terminal: quay / edge gate / spine) and (value density → centrality and
> watchedness). The primary void stays on the gate-to-gate spine. A market whose terminal
> moves (new bridge, moved harbour) leaves the old void behind as a dying one, with its
> approach lanes narrowing — §240's epoch machinery again.
> **DERIVATION HOME.** `supplyChains` + `resources` + `tradeRouteAccess` + `institutions`
> (market halls) + `population`.
> **VERDICT — MISSING.** §6 covers market/noxious siting in principle; nothing keys a void
> to a logistics terminal. This is high leverage because **it multiplies voids** — a town
> with one market square is thin, and a town with a general market, a beast market at the
> edge gate and a fish market at the quay reads instantly as a working place. MF-S3a owns
> void geometry; the coupling to arrival mode is mine, and it needs their layer to consume it.

### §6.3 · Laydown, waiting and turning ground — the space nobody models

The corpus draws, consistently, the **negative space that goods need**:

- **cart queue at the toll bar** (hf311, a rank of carts drawn waiting); **goods queue yards
  on both rims of the ferry** [M-view hf276]; **waiting ground at the mill**, a worn rutted
  patch (hf340); **barges queuing below the flash lock** (hf295); **beast lines and fodder
  yards** at the caravan quarter [M-view hf327].
- **stall stations drawn as faint dashed set-out lines and post sockets in the paving**, so
  customary use is written into the surface (hf342) — and **the ground changes texture
  between the beast pitch, the corn pitch and the general pitch.**
- **the drove stance**: six large hedged overnight enclosures, each with its own gate off the
  street and its own water (hf333).
- **the beach as a working floor** [M-view hf332]: hulls in ranks, capstan circles with warp
  lines, net grounds, a derrick with its sweep arc drawn.

⭐ The transferable rule from hf333, and it is a rendering rule as much as a siting one:
**the dunged and poached ground inside each stance is drawn as a heavily stippled worn
texture that STOPS EXACTLY AT THE HEDGE LINE.** Land use written into surface texture with a
hard boundary. See §8.3.

> **CX-30 · LAYDOWN AND WAITING GROUND**
> **MECHANISM.** Every logistics terminal (gate toll, crossing, mill, quay, market, drove
> stance) reserves an open ground sized by its throughput, with a **worn-surface texture**
> and, where relevant, a queue direction along its feeding road. These grounds are
> reserved BEFORE fabric fills, so they survive as voids rather than being carved out later.
> **DERIVATION HOME.** `supplyChains` throughput + `tradeRouteAccess` + `population`.
> **VERDICT — MISSING.** §201/§202's alley register and access laws guarantee reachability;
> nothing reserves working space. Note the ordering constraint: this must run **before**
> fill, or the void will not exist — which makes it an epoch-stage concern (§240) rather
> than a decoration pass.

### §6.4 · Wharf → warehouse → market: the chain, and its inland twin

**[M-index] `quay_wharf` and `warehouse` co-occur on 8 of 138** (lower bound). Structurally
the chain is always: **water → landing/crane → warehouse rank immediately behind, with
loading doors facing the water → weighing/customs at the head → then the road inland to the
market.** ★hf327 shows the inland twin at the same time and on the same plate: **caravanserai
courts (the largest courtyards in the city) with beast lines, fodder yards and salt stacks in
ranks on the desert side; granary blocks on raised platforms at the boat landing on the river
side; and the merchants' great houses in the strip BETWEEN the two** — the trans-shipment
logic written as a land-use sandwich.

> **CX-31 · THE TRANS-SHIPMENT SANDWICH**
> **MECHANISM.** Where two transport modes meet, emit three ordered bands: mode-A terminal
> and its storage → the exchange institutions (customs, weigh, merchants' houses, exchange
> hall) → mode-B terminal and its storage. Storage footprint is a function of throughput and
> its footprint SHAPE is modal (long ranks with loading doors for water; large courtyards
> for beasts; raised platforms where flooding is a fact).
> **DERIVATION HOME.** `tradeRouteAccess` + `supplyChains` + `resources` + terrain.
> **VERDICT — PARTIAL.** §161m covers the docks supply chain. The **inland terminal** has no
> equivalent and is exactly what a desert/steppe/caravan settlement is made of — see §7.

### §6.5 · Droving and its edge effects

hf333 is the eligible whole-town case: the through street **enormously wide with its
frontages set far back and its middle a bare beaten surface, because the herds must pass,
narrowing hard between toll bars at each end.** Behind the frontages, six unequal hedged
stances. Plus: drovers' inns with long stable ranges, horn and hide dealers, a leather yard,
a great scale, a stock market ringed by **holding pens rather than shops**, a pound, a beast
pond with a hard causeway — and outside, a broad green way, a ford with a hard bottom and a
swim channel beside it, and **a stance on the common for herds that will not pay the toll.**

★hf381 [M-view] gives the regional half: the drove road runs wide and green and **avoids the
towns and their tolls entirely**, crossing the great road between settlements.

⭐ Two rules: **(a) a movement economy widens the street and pushes the frontage back**
— the opposite of the usual pressure; **(b) every toll generates its own avoidance route**,
and the avoidance route is drawn.

> **CX-32 · MOVEMENT ECONOMY AND TOLL AVOIDANCE**
> **MECHANISM.** Where `supplyChains`/`resources` show a livestock or bulk through-trade:
> widen the through route, set frontages back, attach stances behind the frontages sized by
> herd volume, and emit toll bars at both ends. At region scale, emit an avoidance route
> that bypasses each toll — a second, cheaper edge in the road graph.
> **DERIVATION HOME.** `resources`/`supplyChains` (livestock, wool, salt) + `neighbors` +
> `tradeRouteAccess`.
> **VERDICT — MISSING.** Nothing in §150–§245 makes the street network respond to what moves
> on it. Note it is also the cleanest available cure for the "one street width fits all"
> reading atlas T-04 measured (b6's hierarchy at half the corpus's depth).

### §6.6 · Deliberate friction — where traffic is slowed on purpose

A short catalogue, because it is a class our generator has no reason to invent:
**toll bars at both ends of a wide street** (hf333); **market bars**; **bridge gates at both
abutments and a gate tower part-way along** (hf307, hf274); **barbicans whose outer arch is
set OFF the axis so the turn is visible** (hf313); **staggered angled gate passages with
guard platforms** (hf236); **a stronghold whose three baileys each have their gate offset
from the last so no straight run exists** (hf325); **checkpoints pinching both approaches**
(hf325); **curfew chains at street mouths** (hf277, hf384); **the treasury precinct's
streets bent so none runs at its doors** (hf334).

⭐ **The unifying idea: security is drawn as GEOMETRY that denies a straight run.** That is a
plan-level statement, cheap to express, and it is the kind of thing that makes a plan look
designed by someone with a motive.

### §6.7 · Desire paths — the corpus's one drawing of unofficial movement

hf311 (index-only) draws **a fan of worn tracks cutting the corners between radiating roads,
as informal curves against the formal road geometry.** hf344 draws **a diagonal short cut
worn across the empty north churchyard by people going to market.** hf278 draws
**beaten-path stars at wells** in snow. hf384 draws **fine dashed paths that avoid every lit
dot and every watch station** — the ways people take when they do not wish to be seen.

> **CX-33 · DESIRE PATHS AND WORN APPROACHES**
> **MECHANISM.** After the street web and the point features: for each high-traffic
> destination pair whose network path exceeds the straight line by more than a threshold,
> emit an informal path drawn in a lighter, curvier primitive; and give every well, gate,
> conduit head, ford and stance a **worn approach stipple**. Where lawfulness is low,
> additionally emit an avoidance route between unlit/unwatched points.
> **DERIVATION HOME.** the street graph + point features + lawfulness/`government`.
> **VERDICT — MISSING.** Cheap, and disproportionately effective: it is the single clearest
> signal that a plan was walked rather than drawn. It also fits the §10.C DM lens directly.

---

## §7 · REGIONAL AND CULTURAL MORPHOTYPES

The setting-agnostic promise (`product-scope`, the deity doctrine, §304's invented-country
captions) is a **structural** promise, not a labelling one. A euro-temperate fabric with
Arabic street names is a culture-bake failure wearing a costume — which is exactly the trap
the corpus fell into four times (hf329 Italian, hf350, hf356, hf361 Latin) before
counter-phrase #25 cured it.

### §7.1 · What actually changes, structurally, by setting

| morphotype | the STRUCTURAL signature (not the ornament) | plates |
|---|---|---|
| **euro-temperate row/burgage** | continuous frontage, deep plots 4–6:1 to a back lane, party walls, ginnels | hf93, hf120, ★hf318, ★hf389 |
| **courtyard-compound (dry/earth)** | ⭐ **thick-walled round-cornered compounds packed wall to wall; alleys barely a line wide, dog-legged and dead-ended; no through-block permeability** | ★hf327, hf104, hf139, hf364's resettled quarters |
| **walled-ward grid** | every quarter itself walled and gated; great avenues **frontage-less because the wards turn their backs on them** | hf326 (index-only) |
| **rank-belt** | the town in concentric social BELTS with offset gates and dead-end streets so nothing runs through | hf325 |
| **contour hill town** | §1.3's two grammars; cisterns under every court; water OUTSIDE the lower gate | ★hf373, hf329 |
| **cliff / rock-cut** | dwellings cut into faces in rows one above another; ledge paths; the hill is storage | hf357, hf297, hf253 |
| **stilt / pile** | boardwalk street web on pile dots; the creek network IS the street network; **the one hard ridge carries everything ground-built** | hf132, hf358, hf240 |
| **water-as-street (canal)** | S-curve grand canal + irregular lesser web; campo wells; **no wall — the lagoon is the wall** | hf235 |
| **terp / polder** | mounds + causeways on piles; dike-top village one house deep; the lift chain | ★hf146, hf284, hf127 |
| **pastoral / tent (steppe)** | ⭐ **no fields at all**; tent circles in kin groups, unequal corrals, drove trails converging on water, watch mound | hf128, hf150, hf232 |
| **mobile capital (ordu)** | the horde as a city: two great arcs of tent circles, felt-walled royal enclosure, **last year's camp ground as ghost circles across the river** | hf290 (index-only) |
| **savanna kraal** | uneven scratchy thorn enclosures, stilt granaries, braided cattle tracks, **thorn barrier on ONE bearing** | hf232 |
| **ceremonial causeway city** | ⭐ **shape driven by a MOVEMENT structure, not a wall** — four causeways to four shrines, dense along them, empty between: four arms and four wedges | hf328 |
| **arctic / sea-harvest** | no fields; flensing stages, try-works, fish-rack combs, meat caches on stands, sod keyhole ovals | hf237 |
| **taiga / two-network** | ⭐ **summer river network and winter ice network connecting DIFFERENT places** | hf353 |
| **mesa / pueblo** | mesa-top fabric, ONE cliff stair-road and rim hoist, check-dams at gully mouths | hf224, hf253 |
| **atoll / archipelago** | reef band, the pass, lagoon-facing village, **one island one job** | hf231, hf312 |
| **karst** | no surface water; settlement at the resurgence; dew ponds where there is no spring | hf349, hf297 |
| **loess sunken-court** | ⭐ **village reads from above as a scatter of open rectangles set INTO the farmland** | hf357 |
| **monsoon levee** | ribbon 1–3 houses deep riding the levee; floating market; klong cuts with sluices | hf240 |

### §7.2 · The three drivers that actually produce all of it

Reduce that table and it collapses to three variables. **This is the finding — not the
catalogue, which is unbounded, but the fact that three derivable drivers generate it:**

1. **⭐ MATERIAL.** ★hf327 is the corpus's clearest demonstration: no stone and no timber ⇒
   thick earth walls ⇒ round-cornered compounds ⇒ wall-to-wall packing ⇒ alleys one line
   wide, dog-legged, dead-ended ⇒ **a grain unlike anything else in the corpus, and legibly a
   consequence of the building material.** hf136's all-timber northern city (palisade comb,
   log booms, plank quay) is the same argument in wood; hf304's eight vernacular dwellings
   are the specimen sheet, each captioned with an invented country name **precisely so the
   plate teaches that form follows material and climate rather than culture.**
2. **⭐ WATER SCARCITY.** Where water is scarce the fabric reorganises around storage:
   cisterns under every court and a great vaulted one under the square (★hf373), qanat/falaj
   lines with gardens anchored to them (hf125), pothole cisterns and one descent trail
   (hf253), aqueduct on arches (hf104). Where water is abundant and hostile, it reorganises
   around exclusion: dikes, terps, causeways, raised platforms (★hf146, hf284).
3. **⭐ MOBILITY.** Where the population moves, the "settlement" is a **ground plan for
   recurring occupation**: corrals, drove trails, watch mounds, last year's camp as ghost
   circles, and **no fields whatsoever.** This is the one morphotype family that breaks every
   assumption a fabric generator makes, because it has no plots, no frontage and no permanent
   street.

> **CX-34 · MATERIAL DRIVES FOOTPRINT GRAMMAR**
> **MECHANISM.** Footprint stage: a `buildingMaterial` derived from `resources` × `terrain`
> × `culture` selects a **footprint grammar** — rectangular row (timber/stone frame),
> thick-walled courtyard compound (earth), pile/boardwalk (wet), rock-cut chamber row
> (cliff), sod keyhole (treeless cold), tent circle (mobile) — and each grammar carries its
> own packing rule, alley width floor, party-wall behaviour and corner radius.
> **DERIVATION HOME.** `resources` (stone/timber/clay/reed presence) + `terrainType` +
> `culture` — **all three exist.**
> **VERDICT — MISSING, and it is the highest-value setting-agnosticism mechanism.**
> §17.1 (party walls) and §17.4 (fronting) encode the euro-temperate grammar as if it were
> the only one. hf327 proves a second grammar produces a completely different plan from the
> same population and the same trade. **One enumerated field changes the entire look of a
> non-European settlement without a single new label.**

> **CX-35 · THE WATER-SCARCITY REORGANISATION**
> **MECHANISM.** Where the water mode is NONE/WELL or the terrain is arid: replace the
> distributed-well layer with a storage layer (cisterns per block, one monumental cistern
> under the primary void, catchment channels ruled into the void's paving), and place the
> settlement's washing/watering facility OUTSIDE the lower gate at the source with a worn
> path to it. Where water is abundant and hostile: emit the exclusion layer (dike, terp,
> causeway, raised platform) as the settlement's founding terraform.
> **DERIVATION HOME.** water mode (§5.0b, exists) + `terrainType`.
> **VERDICT — PARTIAL.** §5.0b's NONE/WELL mode exists and b6 declares it. **Nothing changes
> when it is set** beyond the absence of a river, which is the difference between a label and
> a morphology.

### §7.3 · ⭐⭐ THE BINDING CONSTRAINT: our terrain vocabulary is SEVEN TOKENS

`config.terrainType ∈ {plains, hills, forest, riverside, coastal, mountain, desert}`
(verified, §0.6). The corpus expresses **at least twenty structurally distinct settings** in
§7.1, and the ones it expresses best — marsh/levels, delta, steppe, karst, dune coast, taiga,
volcanic, loess, mangrove, altiplano, salt lake, atoll, mesa — **have no token at all.**
"desert" collapses wadi, oasis, hamada, dune coast, salt lake and mesa into one word.
"coastal" collapses cliff coast, dune coast, estuary bar, fjord, atoll, mangrove and shingle
ribbon.

This is not a rendering gap. **It is a derivation gap: there is no fact to derive from.**
Everything in §7.1 and §7.2 is downstream of it.

> **CX-36 · WIDEN THE TERRAIN VOCABULARY, OR MAKE IT COMPOSITE**
> **MECHANISM (proposal only — this is owner-gated, see §11).** Two candidate shapes, both
> written out so the choice is vetoable:
> **(a) WIDEN the enum** to ~18–20 tokens. Simple, but it is a persistence-shape change
> touching saves, filters, the gallery facet list and every terrain-keyed table, and it
> makes every existing settlement's terrain a legacy value.
> **(b) COMPOSE it** — keep the seven as the coarse token and add a small orthogonal
> `terrainModifiers` set (`arid · wet · frozen · volcanic · karst · saline · steep ·
> unstable · treeless`) derived at generation from existing signals where possible. Additive,
> back-compatible, and the morphotype falls out of (token × modifiers) rather than a longer
> list.
> **I recommend (b)** and record it as a JUDGMENT: composite modifiers keep the seven-token
> facet vocabulary the gallery and the server RPC already filter on (migration 063/071
> alignment is explicitly noted in `galleryUtils.js`), which a widened enum would break.
> **DERIVATION HOME.** itself — this IS a dossier fact.
> **VERDICT — NOT-DERIVABLE TODAY; OWNER-GATED.** Persistence shape is on judgment-ledger
> §3's owner-gated list. **Filed as a proposal, not a decision.** But recorded loudly,
> because it is the single upstream blocker for §7 in its entirety, and every mechanism in
> this section is stalled behind it.

---

## §8 · DIMENSIONS NOBODY NAMED

The owner asked explicitly for what is "beyond what I just stated." These are the ten I
found that do not fit the six headings above, ordered by how much of the plate they explain.

### §8.1 · ⭐ PROCESS GROUND — the working surface that exceeds the settlement

**[M-view] hf332's drying racks cover more ground than Saltern Howe does**, and they are on
the open windy shoulder rather than in the sheltered hollow, which is the plate's whole
argument. hf343's tan pits are dozens of sunken rectangles in ranked rows. hf370's coppice
compartments fill the sheet with the city small in one corner. hf354's evaporation pans run
the length of the shore. ★hf327's salt stacks and beast lines occupy a third of the caravan
quarter [M-view].

**The rule: some economies need more GROUND than they need buildings, and the ground is
sited by a physical requirement (wind, sun, slope, water) rather than by convenience.** Our
generator will systematically under-draw these because they are not buildings and not fields.

> **CX-37 · PROCESS GROUND.** **MECHANISM:** an economic activity requiring open working
> ground emits a sized, textured ground polygon with a siting predicate (windward / sunny /
> level / waterside / downwind), placed before or alongside the fabric, not after.
> **DERIVATION HOME:** `resources` + `supplyChains` + `institutions`. **VERDICT — MISSING.**

### §8.2 · ⭐ THE CATCHMENT — the map's subject can be a SYSTEM, not a place

hf291 draws a parish as an obligation catchment; hf360 a common as an institution; hf370 a
city's fuel shed; hf371 a city's bread catchment in cost rings; hf294 an aqueduct line with
the settlements that hang off it; ★hf381 a country's ways with settlements as knots [M-view].
**In each, the unit of the map is a system and the settlements are its consequences.**

For us this is not (only) a new leaf type. **It is the correct derivation ORDER**: the region
is what places the settlement (CX-01, CX-25), and a settlement generated without one will
always look dropped rather than grown.

> **CX-38 · THE REGION IS AN INPUT, NOT A BACKDROP.** **MECHANISM:** derive a minimal region
> — neighbours at real distances, roads with ranks, one water system, one resource
> catchment — BEFORE the settlement, and let it fix the siting, the approach bearings, the
> gate set and the extramural ordering. **DERIVATION HOME:** `neighbors` + `trade` +
> `resources` (all exist). **VERDICT — MISSING, and it is a sequencing finding: several
> mechanisms above (CX-01, CX-15, CX-22, CX-25, CX-32) all wait on it.**

### §8.3 · ⭐ SURFACE TEXTURE AS TENURE — land use written into the ground, with a hard edge

hf333's dunged stance ground **stops exactly at the hedge line.** hf342's market ground
changes texture between the beast pitch, the corn pitch and the general pitch, and the
customary stall stations are **faint dashed set-out lines and post sockets in the paving.**
hf345's bailey ground changes between beaten, cobbled and untrodden. hf320's eleven street
types each have a **different surface texture** — dense cobble stipple, thin patchy stipple
with a puddle hollow, grass tone, braided ruts.

⭐ **This is the corpus's cheapest large win and it is a pure rendering mechanism:** the
ground is not a background, it is a per-parcel textured surface whose boundaries are
land-use boundaries and are hard.

> **CX-39 · GROUND SURFACE AS A FIRST-CLASS LAYER.** **MECHANISM:** every parcel and street
> segment carries a `surface` (beaten / cobbled / stipple / grass / rutted / poached /
> untrodden) selected by use and traffic, rendered as texture with a hard boundary at the
> parcel edge. **DERIVATION HOME:** land use + traffic. **VERDICT — PARTIAL.** T-24 covers
> the six *rural* ground primitives; the *urban* surface ladder and the hard-boundary rule
> are not covered.

### §8.4 · THE COST-OF-ACCESS ORGANISER

hf310: a cliff-top house where **the cost of getting up organises everything** — a windlass
platform with its cable drawn dashed to a basket at the bottom, a pilgrim stair with numbered
stations and a chain rail on the exposed pitch, and at the foot **everything that cannot
climb**: pilgrim inns, a donkey park, a letter-box shrine where messages are left. hf298's
siq: **the unloading grounds and camel yards are immediately inside the inner gate, because
nothing large gets further.** ★hf276: the goods queue yards sit at the head of the stair
[M-view]. hf224: one cliff stair-road and a rim hoist.

> **CX-40 · ACCESS COST SORTS LAND USE.** **MECHANISM:** where a settlement has a high-cost
> access segment, sort activities to either side of it by their transport requirement, and
> emit the transfer apparatus (hoist, stair, queue yard, beast park) at the break.
> **DERIVATION HOME:** terrain + `siteReason` (CX-01). **VERDICT — MISSING.**

### §8.5 · OBLIGATION GEOGRAPHY — paths that exist because of a duty

hf291's **corpse road** from each dependent thorp to the mother church (the only burial
ground) and its **sunday paths** converging; hf352's corpse road with a **coffin stone** on
it; hf344's worn path from the priest's door to the parsonage gate; hf272's processional
circuit **worn wider** with station crosses; hf305's **perambulation route** dashed around
a great oak.

⭐ **A route can exist because of an obligation rather than a trade**, and those routes are
named, worn and drawn. Our `institutions` and `neighbors` hold exactly the obligations
(which settlement's church serves which hamlet) — this is a fact we have and never draw.

> **CX-41 · OBLIGATION ROUTES.** **MECHANISM:** for each dependency relation between a
> settlement and an institution it does not itself contain, emit a named route with a worn
> primitive and its ritual furniture. **DERIVATION HOME:** `neighbors` + `institutions`.
> **VERDICT — MISSING.** Note it is the natural region-scale companion to CX-38.

### §8.6 · ⭐ THE MOVED THING — relocation as a first-class state

hf309: the harbour moved — old channel now silt meadow with a **stranded quay, warehouse
ranks, a customs hall and a market place left inland and dry**, a portage road to the new
water, training walls, a dredge scow, and a raw new settlement on fresh pilings. hf348: the
town moved. hf363: the market moved, **and the lanes tipped.** hf252: the ford moved. hf351:
the haven moved inland behind the last ridge. hf294: the water moved and the village died.
hf322: the **shore** moved and left an old quay line behind.

⭐ **The corpus treats relocation as a normal event with a standard consequence set:** the
old thing survives as stranded infrastructure, a connector is built between old and new, and
the routes re-rank. That is §240's epoch machinery pointed at a *point feature* rather than
at a ring, and it delivers narrative for almost nothing.

> **CX-42 · RELOCATION EVENTS.** **MECHANISM:** a relocation event on a point feature
> (harbour, market, crossing, well, settlement) emits: the abandoned original at reduced
> ink with its infrastructure intact but stranded, a connector route, and a re-ranking of
> every route that served it. **DERIVATION HOME:** `history`/`eventLog` + §240 epoch index.
> **VERDICT — MISSING; and §240.3 should list it beside the vintage triad as a dividend.**

### §8.7 · THE SECOND NETWORK

hf353: **summer river network and winter ice network connecting different places**, the
winter routes running straight across frozen bogs and lakes, staked, with a staging hut a
day apart. hf312: dashed boat paths linking every island. hf339: the wet season strikes out
the fords and puts two ferry stages to work **that work only now.** hf384: the night ways
that avoid every lit dot. hf278: the staked ice road.

> **CX-43 · SEASONAL / CONDITIONAL NETWORKS.** **MECHANISM:** a second route layer valid
> under a stated condition (season, water state, night), drawn in its own dashed primitive,
> connecting a **different** node set from the primary. **DERIVATION HOME:** climate +
> water mode + lens. **VERDICT — MISSING.** Strong lens material: it makes the winter and
> wet-season lenses *structural* rather than a recolour, which is exactly the objection
> atlas Table B raises about the watercolour lens being flatter than the parchment one.

### §8.8 · MICROCLIMATE SITING — wind, sun, frost, salt

Collected across §1.2 and §5.1 but worth naming as its own dimension because it recurs in
six independent plates: villages **upwind** of ash (hf350); the church **uphill from the salt
air** and the poorest cottages **in the wet hollow** (★hf332); threshing floors on the
**windward** shoulder (★hf373 "WINDY FLOORS"); the drying racks on the **windy** shoulder
rather than the sheltered hollow (★hf332); vines on the **south** slope with the **frost
hollow unplanted** (hf283); freeze-drying grounds sited on the **exposed frost floor**
(hf359); smokehouses at the **downwind** end (★hf332); potters' quarter **downwind** (hf104).

**This is the most frequently-drawn siting logic in the corpus that our dossier cannot
express at all** — there is no wind bearing, no sun bearing and no aspect. See §12.

### §8.9 · THE UNBUILT — enclosed but not built

★hf385's new circuit encloses brickfield, orchard, closes, tenter grounds and **two ruled
empty plots** [M-view]. hf324's bastide: half the plots carry a frontage range, a quarter
only a hut set back, a quarter are **bare ruled outlines with garden rig in them**, and two
whole streets are **ditched and staked with frontages that are just lines on grass.**
hf274's young charter town has **vacant plots**; hf41's boom fringe has surveyed-not-built
streets in the ghost register.

⭐ **Ambition is drawn as unfilled provision, and it is the clearest possible signal of a
town's trajectory.** A wholly-filled settlement reads as static.

> **CX-44 · PROVISION AHEAD OF OCCUPATION.** **MECHANISM:** the epoch's laid-out extent and
> its occupied extent are **separate**; the difference is drawn as ruled empty plots, staked
> frontages and interim land uses (garden rig, orchard, stone pit). Fill ratio is derived
> from growth trajectory. **DERIVATION HOME:** `population` history + `prosperity` trend +
> founding kind. **VERDICT — MISSING, and it is a direct §240 dividend** — an epoch that is
> laid out but not filled is exactly what a planted town is, and §240.2 already derives ring
> count from promotion events and prosperity history. One ratio.

### §8.10 · THE CUSTODIAN — infrastructure breeds a dwelling

Already listed in §5.2 but it deserves its own line because it is a one-rule generalisation:
**every piece of standing infrastructure in the corpus has someone living beside it** — the
keeper's cottage at the spring house [M-view hf368], the lock-keeper's house with its garden
and toll board (hf295), the wood-ward's cottage and forester's lodge (hf370), the warrener's
lodge (hf351), the patrol hut on the aqueduct (hf294), the shepherd's hut on the moor
(hf352), the saw-crews' hut on the ice (hf282), the keeper's clearing in the wood (hf114).

> **CX-45 · CUSTODIAN DWELLINGS.** **MECHANISM:** infrastructure classes flagged
> `needsCustodian` emit one small dwelling adjacent, with its own garden and worn approach.
> **DERIVATION HOME:** `institutions`/infrastructure class. **VERDICT — MISSING.** Trivial,
> and it converts an isolated glyph into an inhabited fact.

---

## §9 · RECONSTRUCTION TRACES

Eight plates traced end to end. **All eight are plates I opened** (§0.3), none is a holdout
member, and each is traced against the §246 test — *could our process have produced a plate
indistinguishable in KIND and QUALITY from this one?* — never against pixel identity.

Each trace gives: the **dossier facts required**, the **pipeline sequence** we would run,
**what we would emit**, and **where we would diverge.** Divergence is the deliverable.
Divergence severity: **⛔ STRUCTURAL** (the plan would be a different plan) ·
**⚠ SUBSTANTIVE** (the plan is right, a load-bearing feature is absent) ·
**◦ COSMETIC** (present but at the wrong value).

---

### TRACE 1 · hf62 `bankside-town` — the water-as-EDGE town

**What it is.** A walled town on one bank; the circuit is a landward half-ring closing on
the river; the river face is a low quay wall with mills and landings; one bridge crosses to
a six-building bridgehead knot and then fields.

| dossier facts required | do we hold them? |
|---|---|
| tier=town, population, prosperity | ✔ |
| terrainType=riverside; water mode=BANKSIDE | ✔ (mode declared in b6's cartouche today) |
| tradeRouteAccess=river | ✔ |
| institutions: walls, mills, market, church | ✔ |
| **water role = EDGE** (CX-05) | ✘ |
| **river class** (§205.2 ladder) | ✘ (ruled, unbuilt) |
| **siteReason = crossing/bankside** (CX-01) | ✘ |

**Pipeline sequence we would run.** substrate (water only) → fabric/districts → wall trace →
render. **The corpus's sequence, reconstructed:** region → siteReason → water role → epoch
core → circuit as run chain → water-termination member → waterfront strip as its own district
→ crossing → bridgehead district → fields.

**What we would emit.** A walled town with a river alongside, a bridge, water gates, correct
palette, TRUE labels and a declared water mode — atlas T-12/T-14 already grade us MEETS on
the mode and on the worked water in principle.

**Where we would diverge.**
- ⛔ **The circuit would be a trace fitted to the fabric, not a chain of runs.** The corpus's
  landward arc is a sequence of decisions; ours would read geometric (atlas T-10's measured
  verdict on b6). **CX-13.**
- ⛔ **The far bank would be symmetric or arbitrary.** Nothing in our pipeline says the far
  bank gets *only* a bridgehead knot. **CX-06.**
- ⚠ **The waterfront would not be a worked FACE.** We draw quays and bridges; we do not order
  mill/quay/stair/landing along a flow, and we do not give the waterfront its own grain as a
  district. **CX-08, CX-16.**
- ⚠ **No wall-foot variation.** Our reserved band would be uniform; the plate has a lane
  inside the west and south runs and blocks abutting on the north-east. **CX-19.**
- ◦ Towers would be evenly spaced (atlas prior #7; §214 already bans it).

---

### TRACE 2 · hf318 `town-unequal-circuit` (Crookhorn) — the reference implementation of a wall

**What it is.** The plate that proved the polygon prior curable. Nine named runs, each with
a reason; towers on three runs and absent on the scarp and river; a chain across the water;
the old ditch surviving as a garden strip; suburbs at the two road gates only; the ford still
named inside the town it long ago outgrew.

| dossier facts required | do we hold them? |
|---|---|
| tier=town, population, prosperity, threats | ✔ |
| institutions incl. **abbey** (drives the notch) | ✔ |
| terrainType=hills + **a relief field** (drives crest and scarp) | ✘ — scalar only |
| **fortification event dates** (drives seam and re-use run) | partial (`history` exists; not spatial) |
| **plot geometry at the wall line** (drives the toft-backs run) | ✔ from MF-S3a's layer |
| `neighbors` (drives which gates, and their names) | ✔ |

**What we would emit.** A walled town with two gates, suburbs, a market street, burgage
plots, a church, a mill, a windmill, and true names for all of it.

**Where we would diverge.**
- ⛔ **No crest run and no scarp run — we have no relief field to read.** Two of the nine runs
  are simply not derivable today. **CX-02 blocks CX-13.**
- ⛔ **No abbey notch.** Our circuit does not consult the institution list. **CX-13.**
- ⛔ **No terrain-surrender run.** §205.3 rules that a cliff flank needs no wall, and we would
  draw one, which §205.3 itself calls "the violation."
- ⚠ **No fossil ditch.** The "OLD DITCH GARDEN STRIP" is the plate's clearest history mark and
  needs CX-20 plus §240's earlier epoch.
- ⚠ **Suburbs at the wrong gates, or at all of them.** **CX-22.**
- ⚠ **The ford would vanish once bridged.** The corpus keeps superseded infrastructure named
  and drawn. **CX-07, CX-42.**
- ◦ Even tower beading.

⭐ **This trace is the sharpest statement of the sequencing problem in the whole document:
six of its seven divergences are downstream of one missing input — a relief field.**

---

### TRACE 3 · hf385 `town-three-circuits` (Holtmere) — the §240 epoch trace

**What it is.** Three circuits, none a ring, none concentric with any other, each of visibly
different shape, plus a settlement centre of gravity that **moved** from the knoll-and-ford
to the ridge road and river. The oldest survives as a crooked lane on its line, a ditch-garden
strip, a stone stub and a labelled gate gap. The middle stands, internal, its towers now
dovecotes and dwellings, meeting the water at a quay wall and two chains. The third is
sprawling and lopsided, bulging to enclose brickfield, orchard and tenter grounds, with a
dead-straight new cutting, towers clustered on the open runs and absent along the river —
and inside it, ground enclosed but **not built**.

| dossier facts required | do we hold them? |
|---|---|
| population **history** (drives epoch count) | ✔ |
| promotion events, prosperity history | ✔ |
| **epoch index** (§240) | ✘ — ruled, wave-nine, unbuilt |
| relief (the knoll) | ✘ |
| institutions with dates | partial |

**Where we would diverge.**
- ⛔ **Concentric rings.** With no run typing, three circuits derived from one fabric will
  come out nested and similar. The corpus needed six attempts to beat exactly this and the
  cure was per-run causes. **CX-13 is a precondition for §240 looking right.**
- ⛔ **The centre would not move.** Our growth expands about a fixed centre; Holtmere's
  gravity migrates from the ford to the ridge road, which is why the three circuits are
  off-centre from one another. This is MF-S3a's growth-sequence territory and mine only at
  the circuit; flagged for their lane.
- ⛔ **The dead circuits would vanish rather than fossilise.** **CX-20** — the single largest
  §240 dividend not listed in §240.3.
- ⚠ **The new circuit would hug the fabric.** Enclosing unbuilt ground requires **CX-44**
  (provision ahead of occupation); without it the wall is always tight and the town always
  looks finished.
- ⚠ Towers-as-dovecotes: a reuse rule, not a decoration. **CX-20.**

---

### TRACE 4 · hf389 `city-metropolis-wallshape` (Varrenholt) — the whole-system metropolis
<!-- ⟦FOLD §297/§298⟧ renamed from `city-metropolis-grain-max` at §298.2e: the plate measures the COARSEST grain of the nine metropolis plates, so the old stem mis-taught. -->


**What it is.** Wall as a chain with a church-precinct notch, a river run that stops at a
chain, a straight new west run, a wobbling south suburb run and a bad closure. Towers
clustered N/NW/W, absent on river and marsh. Castle on a hachured mound in the NW corner
with its own ditch. Three friaries/priories, each AIRIER than the fabric, all marginal, none
adjacent to another. **Four markets, each sited by its goods' arrival mode.** Canal with a
rope walk beside it; tenter grounds outside the east wall; quays with crane ticks; reed marsh
to the south with the fabric stopping dead at it; **extramural ribbons at five gates, each
stopping at a different distance**; windmills as flat glyphs on the open ground outside.

| dossier facts required | do we hold them? |
|---|---|
| tier=metropolis, population, prosperity, trade profile | ✔ |
| institutions (castle, three religious houses, four markets, mills) | ✔ |
| supplyChains (fish, hay, cloth, rope) | ✔ **and unused spatially** |
| water mode + river class + water role | partial / ✘ / ✘ |
| relief + marsh mask | ✘ |
| neighbors → five roads at five bearings with unequal traffic | ✔ **and unused** |

**Where we would diverge.**
- ⛔ **One market, not four.** We would place a market as a void; nothing multiplies or
  positions them by arrival mode. **CX-29** — and this is the divergence a reader would
  notice first, because four differently-shaped voids is most of what makes this plate read
  as a metropolis rather than a large town.
- ⛔ **Ribbons of equal length at every gate, or none.** **CX-21, CX-22.**
- ⛔ **The marsh would not stop the fabric.** **CX-02.**
- ⚠ **The three religious precincts would not repel each other**, and might not be airier.
  §203's fill bands give the airiness; nothing gives the mutual repulsion or the marginality.
  **CX-27.**
- ⚠ **Rope walk and tenter grounds would sit anywhere.** They need length and cheap flat
  ground — a footprint-shape constraint, not a zoning one. **CX-27, CX-37.**
- ◦ Grain: atlas T-01/T-02 already measure our metropolis grain as the worst miss on the
  ladder; that is MF-S3a's and MF-B's lane, not mine.

---

### TRACE 5 · hf327 `city-mudbrick-river-caravan` (Tamboura) — the setting-agnostic test

**What it is.** A great earth-built city where the caravan road meets the river. **No wall** —
a discontinuous earth bank with thorn on the desert side, the river on the other. Thick-walled
round-cornered courtyard compounds packed wall to wall, alleys barely a line wide, dog-legged
and dead-ended. Caravan quarter on the desert side (two caravanserai courts as the largest
courtyards in the city, beast lines, fodder yards, salt stacks in ranks); boat quarter on the
river (earth landing, granary blocks on **raised platforms**, fish drying downstream);
merchants' great houses in the strip **between**. Friday mosque precinct as an open square at
the junction; scholars' quarter of small courts beside it; walled ruler's compound with a
stepped platform; wells and cisterns as circles; and the pocked **earth pits on the outskirts
where the building material was dug.**

| dossier facts required | do we hold them? |
|---|---|
| terrainType=desert **and** riverside simultaneously | ⛔ **the enum is single-valued** |
| **buildingMaterial = earth** | ✘ (derivable from `resources`, not derived) |
| tradeRouteAccess = river **and** crossroads | ⛔ single-valued |
| culture (non-European) | ✔ (11 tokens incl. arabic, steppe, mesoamerican) |
| institutions (mosque-equivalent, ruler's compound, school) | ✔ (setting-agnostic classes) |

**Where we would diverge.**
- ⛔⛔ **We would draw a European row-plot town with desert-coloured washes.** §17.1/§17.4
  encode frontage-and-party-wall as *the* packing grammar. The compound grammar produces a
  different plan from the same population, the same tier and the same trade. **CX-34 — the
  single most important mechanism in this document for the setting-agnostic promise.**
- ⛔ **We would probably draw a wall.** A discontinuous thorn-and-earth bank on one bearing
  only is not in our vocabulary; §214's palisade rung is the nearest and it is a full circuit.
  **CX-18's per-run rungs plus a partial-arc option (MF-S1's GAP-E) would cover it.**
- ⛔ **The two trade quarters would not be on opposite sides with the merchants between.**
  **CX-31.**
- ⚠ **No earth pits.** Material extraction is the plate's proof that the material is local;
  it is one land use derived from `buildingMaterial`. **CX-34's free dividend.**
- ⚠ **Granaries not on raised platforms, not at the landing.** **CX-27, CX-31.**
- ⚠ The dual terrain/route facts cannot both be expressed. **CX-36 (owner-gated).**

---

### TRACE 6 · hf373 `town-hilltown` (Kerrack Holt) — terrain as the plan-maker

**What it is.** Three long contour streets wrapping the hill, linked by short straight stair
alleys; blocks long, thin, curved and **wedge-shaped where contours converge**; the citadel
("High Hold") a separate walled ring on the summit with the kirk beside it; the circuit a
chain that becomes a bare parapet along the SW cliff and carries a **labelled mismatched
join**; **no well on the hill** — four rain-catch cisterns in the fabric plus a great vaulted
cistern under Crown Square, whose paving is ruled to catch into it; **the washing spring and
beast troughs OUTSIDE the lower gate** with a worn switchback path down to them; threshing
floors on the windward shoulder outside; terraces on the sunny slope below the wall.

| dossier facts required | do we hold them? |
|---|---|
| terrainType=hills/mountain | ✔ |
| **relief field with gradient and aspect** | ✘ |
| water mode = NONE/WELL + a spring below the town | partial |
| prosperity (a vaulted cistern is expensive) | ✔ |

**Where we would diverge.**
- ⛔ **A flat-town street web with hill shading over it.** Contour streets and stair alleys
  are not in our street derivation. **CX-03.**
- ⛔ **The cistern layer would not exist**, and the settlement would have wells it cannot
  have. **CX-35, CX-09.**
- ⛔ **The washing spring would not be outside the gate** — nothing places a facility outside
  because the resource is outside, and nothing wears a path to it. **CX-09, CX-33.**
- ⚠ **The wall would be drawn along the cliff.** §205.3 forbids exactly this and we cannot
  yet obey it.
- ⚠ Threshing floors and terraces would not be sited by wind and sun. **§8.8 — NOT-DERIVABLE.**
- ◦ Blocks would be rectangular rather than wedge-shaped; the wedge is a free consequence of
  CX-03 + §239.1.

---

### TRACE 7 · hf332 `town-fishing-drying` (Saltern Howe) — when the process is bigger than the town

**What it is.** A ribbon town one to three plots deep between a shingle beach and a rising
bank, with short openings down to the beach between plot groups. The beach is the working
floor (hulls bow-on in ranks, capstan circles with warp lines drawn, net grounds, a derrick
with its sweep, a stone-lined noost, a hard, an old slipway ghosted in moved shingle). Behind
the lane, **the entire upper ground is drying racks** — comb rows in ranks on the open windy
shoulder rather than in the sheltered hollow. Smokehouses at the downwind end; cooperage;
salt pans and cotes at the creek; **the church set high on the bank away from the salt air**;
**the poorest cottages in the wet hollow behind the ridge**; a beacon on the headland; a
wreck's ribs on the reef.

| dossier facts required | do we hold them? |
|---|---|
| terrainType=coastal, tradeRouteAccess=port | ✔ |
| resources=fish, salt; supplyChains=curing | ✔ |
| prosperity, population | ✔ |
| **wind bearing / exposure** | ✘ |
| **shore type** (shingle vs cliff vs sand vs mud) | ✘ |

**Where we would diverge.**
- ⛔ **The drying ground would not exist**, and it is more than half the plate. **CX-37.**
- ⛔ **The town would not be a ribbon**, because nothing constrains fabric between a beach and
  a bank. **CX-02, CX-21.**
- ⚠ **The beach would be a coastline, not a working floor.** **CX-30, CX-39.**
- ⚠ **The church would sit centrally** rather than uphill away from the salt. **§8.8.**
- ⚠ **The poor would not be in the wet hollow.** We have ward wealth (§10.A3) but no
  microclimate to correlate it with. **§8.8.**
- ◦ The ghosted old slipway (a relocation mark) — **CX-42.**

---

### TRACE 8 · hf146 `terrain-marsh-levels` — the substrate leaf, and the hardest trace

**What it is.** Not a settlement plate at all: a country. One dry gravel ridge carries the
causeway, the village and the abbey; **everything else is water.** Terp farms out in the
marsh, each joined to the ridge by a timber causeway on piles. Peat moor with turf cuttings
and stacks, and a warning ("Dangerous Bottoms"). Duck decoy with curved pipes; eel bucks;
salt pans. And the drift: **the abbey's new ruled drainage grid reclaiming parcels**, visibly
newer than everything around it.

| dossier facts required | do we hold them? |
|---|---|
| a REGION with terrain variation, not a point | ⛔ |
| **marsh as a terrain token** | ⛔ — no token exists |
| the abbey as a **regional actor** with a reclamation event | ✘ |
| dependent farms as settlement members | partial (`neighbors`) |

**Where we would diverge.**
- ⛔⛔ **We could not produce this leaf at all today.** Our unit of generation is one
  settlement with a terrain label; this is a region with a substrate, a settlement hierarchy
  and an institutional actor changing the land. **CX-38.**
- ⛔ **"Marsh" is not expressible.** It would be `plains` or `riverside`. **CX-36.**
- ⛔ **The causeway network** — the thing that makes three terp farms members of one village —
  has no analogue. **CX-12, CX-41.**
- ⚠ **The reclamation grid** (an institution terraforming, with the new work legibly newer) is
  §161b territory and is exactly the vintage triad applied to fields rather than to fabric.
- ◦ The eel bucks, decoy and turf stacks are §214 vocabulary and would follow the law once
  a marsh substrate existed to hang them on.

⭐ **This trace is the honest floor of the §246 answer: for a substrate leaf, the answer to
"could our process have produced something indistinguishable in kind" is NO, and the blocker
is not rendering — it is that we do not model a region.**

---

## §10 · THE DIVERGENCE LEDGER, RANKED BY BREADTH OF EFFECT

Ranked by **how many of the eight traces the divergence appears in**, then by how many
mechanisms unblock behind it. This is the answer to "what are we missing, what should we
have, what should improve."

| # | divergence | traces hit | unblocks | verdict |
|---|---|---|---|---|
| **1** | **No terrain SUBSTRATE — relief is a scalar, there is no gradient, no aspect, no mask** | 2,3,4,6,7,8 (6/8) | CX-02, CX-03, CX-04, CX-13 (2 of 9 run types), CX-19, CX-21 | **§214 is RULED and cannot be built to its own text without it.** Highest. |
| **2** | **The circuit is a trace, not a chain of typed runs** | 1,2,3,4 (4/8, i.e. every walled trace) | CX-13, CX-14, CX-16, CX-18, CX-19, CX-20 | PARTIAL vs §205.3/§161m. The corpus needed six attempts to beat exactly the failure we would reproduce. |
| **3** | **No region — the settlement is generated without a context that places it** | 1,2,4,7,8 (5/8) | CX-01, CX-15, CX-22, CX-25, CX-32, CX-38, CX-41 | MISSING. Also a **sequencing** finding: several mechanisms wait on it. |
| **4** | **One packing grammar (row/burgage) for every culture and material** | 5 severely, 4 and 6 mildly | CX-34, CX-35, and the whole of §7 | MISSING. **The setting-agnostic promise is structurally unmet**, not cosmetically. |
| **5** | **Institutions have scale but no RELATIONS — no required or prohibited adjacencies** | 1,2,4,5,6,7 (6/8) | CX-23, CX-27, CX-28, CX-29, CX-45 | MISSING. §161n gives size; nothing gives place. Cheapest large win: the NEGATIVE rules. |
| **6** | **Water is a channel, not a system — nothing is ordered along a flow** | 1,4,5,6,7 (5/8) | CX-08, CX-09, CX-10, CX-11, CX-16 | MISSING. `supplyChains` exists and is spatially unused. |
| **7** | **Markets are singular and unplaced by logistics** | 4 severely, 1,2,3 mildly | CX-29, CX-30, CX-31 | MISSING. Multiplies voids; strongest single "this is a working place" signal. |
| **8** | **The extramural ordering is unmodelled beyond the inn belt and the noxious ring** | 1,2,4,7 | CX-23, CX-22, CX-21 | PARTIAL vs §161c/§18.2. One table keyed off the institution list. |
| **9** | **Superseded things vanish instead of fossilising** (walls, fords, quays, markets, harbours) | 1,2,3,7 | CX-20, CX-42, CX-07 | MISSING. **§240's biggest unclaimed dividend.** Makes a town look old with no ruins drawn. |
| **10** | **No provision ahead of occupation — every settlement looks finished** | 3, 5 | CX-44 | MISSING. One ratio; direct §240 dividend. |
| **11** | **Wall-foot policy is global, not per-run** | 1,2,3,4 | CX-19 | PARTIAL vs §239.2. **A global ring road would produce a band the corpus never draws.** |
| **12** | **No working/laydown ground, no worn surfaces, no desire paths** | 1,4,7 | CX-30, CX-33, CX-39 | MISSING. Cheap; the clearest "this plan was walked" signal. |
| **13** | **No microclimate — wind, sun, frost, salt are not facts** | 6,7 (and 6 further plates) | §8.8 | **NOT-DERIVABLE.** See §12. |
| **14** | **Second/seasonal networks absent** | (none of the eight; 5 plates elsewhere) | CX-43 | MISSING. Makes the winter/wet lenses structural rather than a recolour. |

---

## §11 · GAP ANALYSIS AGAINST ODQ §150–§245

Read from `refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md` (read-only).
**COVERED** = a law names the mechanism and it is built or building. **PARTIAL** = a law
names part of it; the missing piece is stated. **GAP** = no law covers it; a mechanism sketch
is offered as a **proposal only — the chair rules.**

### §11.1 · The ruled-but-not-built laws my evidence calibrates

The brief asked me to pay particular attention to these. Each gets a verdict on whether my
evidence **confirms, sharpens, or complicates** the law as written.

| law | status | what my evidence says |
|---|---|---|
| **§205.2 — river class follows function** | RULED, deferrable to wave eight with cause | **CONFIRMS and extends.** The four-rung ladder holds. **But class is the wrong axis on its own** — a class-4 river can be an EDGE, a SPINE or an OBSTACLE and the three produce opposite plans (CX-05, §2.1). Recommend the class ladder ship **with** a `waterRole`, or the ladder will change a width and nothing else. |
| **§205.3 — terrain-maximised defences** | RULED, wave nine | **CONFIRMS strongly, and sharpens the implementation shape.** "A cliff flank needs NO wall — drawing one is the violation" is exactly right and is drawn on 6 of the 7 walled plates I opened. ⚠ **COMPLICATION: implementing it as an exception on a single fitted trace will reproduce the corpus's own worst defect.** The corpus beat that defect only by treating the wall as a chain of typed runs (CX-13). Terrain-surrender is one run type among nine, not a post-hoc test. |
| **§214 — feature iconography** | RULED, wave nine first-order | **CONFIRMS the drawing rules entirely** (masonry band never a bare polyline; seeded-irregular towers; gatehouses as structures; hachure/crag/canopy/reed/terrace vocabulary). ⛔ **BLOCKED, and this is not recorded anywhere I could find: §214's TERRAIN arm has no relief field to consume.** Hachure whose spacing tightens with gradient, crag hatch selected by land form, terraces following each band's own curve — all three need a substrate (CX-02/CX-04). **§214 cannot be built to its own text until the substrate exists. Sequencing flag for wave nine.** |
| **§239.1 — block termination at hard edges** | RULED, wave nine first-order | **CONFIRMS, and it is the right generalisation.** The owner's extension to "wall, street, water, cliff" is exactly the corpus's behaviour, and the wedge-shaped hill block (§1.3) falls out of it for free. Add nothing. |
| **§239.2 — the wall-side street** | RULED, wave nine first-order | **CONFIRMS the law, SHARPENS the exception clause into a derivation.** 7/7 plates I opened have a wall-side street on SOME runs; **0/7 on every run.** "With very few exceptions" should be implemented as a **per-run policy** (CX-19), and §200's clearance census must exempt by **run type**, not only by named member class — otherwise correct output reds. |
| **§239.3/§240 — the wall's temporal primacy, epoch generation** | RULED, wave nine first-order | **CONFIRMS, and adds two dividends §240.3 does not list.** (a) **CX-20, the fossil ladder** — the superseded circuit becomes a lane, a property line, a garden strip, a dovecote-tower; this is how a town looks old without ruins. (b) **CX-44, provision ahead of occupation** — a circuit enclosing unbuilt ground (hf385, hf324, hf347). ⚠ **COMPLICATION: three concentric rings is the failure mode.** hf385's three circuits are non-concentric with a migrating centre; §240 will produce nested rings unless CX-13 lands with it. **§240 and CX-13 are one piece of work, not two.** |
| **the underground stratum** | wave nine first-order | **CONFIRMS the two-layer ghost idiom** (surface at ~⅓ ink under a full-ink subject) and — the finding worth carrying — **§HF-4c #33: the idiom generalises beyond the underground** to any SYSTEM that is not the fabric: city water works over a half-ink city (hf368), charity foundations over a half-ink town (hf383), a dead settlement at ⅓ ink beside a live one (hf348). ⚠ Also: **the underground carries the ring prior into a new habitat** (hf193's radial wheel, hf301's symmetric galleries) — galleries must chase something (a seam, a street, a water table), never radiate. |

### §11.2 · The ranked gap list

Ranked by leverage = (traces affected × mechanisms unblocked × cheapness). Every GAP is a
proposal; the chair rules. **Nothing here is a decision and nothing here was implemented.**

| rank | item | verdict | law | what is missing / the sketch |
|---|---|---|---|---|
| **1** | **Terrain substrate (gradient, aspect, land-form, buildable mask)** | **GAP** | §214 depends on it; §239.1 consumes it | A relief FIELD, not the b6 `RELIEF 0.30` scalar. Sketch: a coarse height/land-form grid per settlement, deterministic from seed + terrainType, exposing gradient, aspect, land-form class and a buildable mask. **Everything in §1, most of §3 and all of §7's terrain arm is behind this.** |
| **2** | **The circuit as an enumerated chain of typed runs (CX-13)** | **PARTIAL** | §205.3, §161m, §240 | Nine run types, each with a cause our facts supply. Ship with §240 or §240 produces rings. |
| **3** | **The region as an input (CX-38)** | **GAP** | — | Neighbours at real distances + roads with ranks + one water system, derived BEFORE the settlement. Unblocks siting, gates, ribbons, road furniture, obligation routes. `neighbors` and `trade` already hold the facts. |
| **4** | **Footprint grammar by material (CX-34)** | **GAP** | §17.1/§17.4 encode one grammar | Six grammars keyed off `resources` × `terrainType` × `culture`. **This is the setting-agnostic promise's structural half.** |
| **5** | **Institution siting relations, especially the NEGATIVE rules (CX-27)** | **GAP** | §161n (scale only), §203 (containment only) | Per-class siting profile: band, gate relation, water relation, wall relation, required and **prohibited** adjacencies. The four prohibitions in §5.1 prevent most naive-placer errors. |
| **6** | **Flow-ordered water chains (CX-08) + domestic water ladder (CX-09/CX-10)** | **GAP** | §205.1 (channel only), §161m (docks) | Directed channel centreline + upstream/downstream slot requests. Domestic water by uncovered-distance, with a prominence gradient by ward wealth. `supplyChains` is the input and is spatially unused today. |
| **7** | **The extramural distance ladder (CX-23)** | **PARTIAL** | §161c, §18.2, §6 | Bands 4 (charity/contagion) and 5 (gallows) uncovered; the **single-arc** constraint on noxious uncovered. One table. |
| **8** | **The fossil ladder (CX-20) + relocation events (CX-42)** | **GAP** | §240.3 lists other dividends | Superseded circuits/crossings/quays/markets emit real geometry into the current fabric. |
| **9** | **Market placement by arrival mode (CX-29)** | **GAP** | §6 (siting in principle) | Multiplies voids; couples to MF-S3a's void layer. |
| **10** | **Per-run wall-foot policy (CX-19)** | **PARTIAL** | §239.2, §200.2 | Derive the exception from run type; make §200's census exempt by run type. |
| **11** | **Water role axis (CX-05) + second-bank rule (CX-06) + join/divide (CX-12)** | **PARTIAL** | §5.0b, §232, §239.1 | §232 already partitions at the wall; extend the same to water and add the **duplication** consequence. |
| **12** | **Edge kind per bearing, unequal ribbon length (CX-21/CX-22)** | **PARTIAL** | §5.0e, §232, atlas T-21 | Per-road ribbon extent; gate ranking for growth allocation. |
| **13** | **The dirt vector: plume + upstream clean take (CX-11)** | **PARTIAL** | MF-S1 **GAP-F** (unruled), §6, §161c | GAP-F's plume alone is decoration. **Plume + upstream take is an argument.** Add the muck gate. |
| **14** | **Ground surface as a first-class layer (CX-39)** | **PARTIAL** | T-24 (rural primitives only) | Urban surface ladder with hard parcel-edge boundaries. Pure render mechanism; large return. |
| **15** | **Laydown/waiting ground (CX-30) + desire paths (CX-33) + custodians (CX-45)** | **GAP** | §201/§202 (access only) | Must reserve space **before** fill, i.e. an epoch-stage concern. |
| **16** | **Crossing kit with superseded predecessor (CX-07)** | **PARTIAL** | §205.1 | A crossing is an institution with a catchment, not a segment. |
| **17** | **Road furniture and the day's-travel rule (CX-25)** | **GAP** | §11.3 (rank decay only) | Nearly free; `neighbors` holds the distances; fixes the empty countryside at low tiers. |
| **18** | **The field/fabric junction band and the intake line (CX-24)** | **PARTIAL** | §16, §16.2, §16.5 | Junction band per bearing; the intake line is one iso-elevation boundary with outsized legibility return. |
| **19** | **Defence-armour ladder on a persistent trace (CX-18) + partial-arc defences** | **PARTIAL** | §214, §240, MF-S1 **GAP-E** | Trace persists, armour walks the rung, **different rungs on different runs** is drawn and is one line. GAP-E's `partialDefenceArc` is confirmed by hf232's one-bearing thorn barrier and hf172's one-bearing barricade. |
| **20** | **Provision ahead of occupation (CX-44)** | **GAP** | §240.2 derives ring count already | One fill ratio from growth trajectory. |
| **21** | **Seasonal/conditional second networks (CX-43)** | **GAP** | §12 lens family | Makes winter/wet lenses structural. |
| **22** | **Countryside structure: tenure, boundary kinds, dispersal mode (CX-26)** | **PARTIAL** | §16 | **Dispersal-vs-nucleation is not derived** and is the most visible countryside fact at village and below. |
| **23** | **Terrain vocabulary width (CX-36)** | ⛔ **OWNER-GATED** | — | Persistence shape. **Proposal only.** Recommend composite modifiers over a widened enum. |

### §11.3 · Two findings that complicate a law rather than extending it

Recorded separately because they are the kind of thing that costs a wave if it surfaces late:

1. ⚠ **§200's wall-clearance census will red on correct output** once §239.2 and CX-19 land,
   unless its exemption is keyed to **run type**. Atlas T-22 already warned that inner-face
   abutment is NORMAL in military compounds and must be exempted by name; my evidence widens
   that from "military compounds" to "any run built along existing property." The census as
   §200.2 words it (abutment lawful "only as an explicitly-derived variant") is compatible —
   **the derivation is the run type**, and saying so now is cheaper than discovering it at the
   census.
2. ⚠ **§240 and CX-13 are one piece of work.** §240 derives ring count from history and is
   correct; but three rings derived without run typing will come out concentric, which is the
   exact prior the corpus spent three growth rounds and eleven deformed plates failing to
   beat. **Landing §240 first and CX-13 later means shipping the corpus's worst defect and
   then removing it, which is a declared-shift event we would be paying for twice.**

---

## §12 · INSPIRATION, NOT YET DERIVABLE

Findings with real evidence behind them and **no derivation home in the dossier as it
stands.** They are recorded here rather than disguised as rules. Each states what fact would
be needed.

1. ⭐ **MICROCLIMATE — wind bearing, sun bearing, aspect, frost, salt exposure.**
   The most frequently drawn siting logic in the corpus (§8.8, eight independent plates) and
   we hold **no bearing field of any kind** — the §7/E8 correction already established this
   for hazards. Would need: a prevailing-wind bearing and a sun/aspect model. ⚠ Note the
   honest counter-argument: a bearing invented at generation time is a **new world fact**,
   which under THE PROMISE is a seed-permanent commitment; it is not free and it is not mine
   to make. **Filed as owner-gated, not proposed.**
2. **SHORE TYPE** (shingle / sand / mud / cliff / reef). hf322's waterfront ladder and
   hf332's ribbon both key off it. No fact exists; `coastal` is one token.
3. **SOIL / DRAINAGE PROXY.** hf356's whole argument — nucleated on the spring line,
   dispersed on the wet clay, absent on the dry down — needs a soil axis we do not have.
   Partly proxied by `terrainType` and water mode; not honestly derivable today.
4. **BUILDING MATERIAL** is *nearly* derivable from `resources` and is listed as CX-34's
   home; but the mapping from a resource list to a material grammar is a judgment call that
   affects every footprint and therefore every leaf's geometry — **a declared-shift event**,
   flagged rather than assumed.
5. **CULTURAL PLAN GRAMMARS beyond material** — hf326's walled wards, hf325's rank belts,
   hf328's causeway city. These are *political* organising principles, not material ones. We
   hold `government` and `factions`; whether a government type may drive a plan grammar is a
   product decision about how deterministic culture should be, and it brushes the
   setting-agnosticism law. **Recorded, not proposed.**
6. **THE OBLIGATION GRAPH.** CX-41 needs to know that hamlet X buries at church Y. We hold
   `neighbors` and `institutions` separately; nothing relates them as a dependency. Deriving
   it is plausible and is a real modelling decision, not a rendering one.
7. **hf338's UNFINISHED SURVEY as a pipeline mirror.** The plate draws one sheet in four
   states of completion that grade into one another — underdrawing, ink, wash, lettering. It
   is not a settlement fact at all; it is **a picture of our own render pipeline**, and it is
   the natural reference for progressive rendering, partial-detail LOD and any
   surveyed/unsurveyed fog concept. Recorded as inspiration for §12.6's fog folio-isation,
   with no derivation home because it needs none.

---

## §13 · WHAT THIS LANE DID NOT DO — stated affirmatively

1. **No pixel measurement of context features.** Every figure is either [M-view] on a stated
   sample of 12 or [M-index] over descriptions. Measuring, say, extramural fabric share
   against intramural would need per-plate hand-set windows — the exact hazard
   `MFS1-grain2.py`'s own header names — and I did not fake it.
2. **81 plates were never opened**, and several were the best plate for a section of my brief
   (§0.1 names them). Findings resting on them are marked **[E-index]**.
3. **I opened 12 plates of 232 eligible (5.2%).** Every [M-view] figure states its n. The
   viewed set is deliberately biased toward walled and water-bearing settlements, which is
   what my brief is about; it is **not** a random sample and no share is projected from it to
   the corpus.
4. **I did not re-derive MF-S1's T-10 – T-24 tallies**, and I did not quote the atlas's
   figures as authoritative because MF-S2 is amending it concurrently (§0.5). Where my
   evidence disagrees with an atlas figure I said so rather than silently replacing it.
5. **I did not read MF-S3a's output** and have not reconciled against it. Overlaps are
   flagged in-place (the market as void vs the market as terminal; the wedge block; the
   migrating centre; the growth sequence).
6. **No mechanism here was implemented, and nothing was decided.** Every CX row is a
   proposal. The two owner-gated items (CX-36 terrain vocabulary; microclimate bearings) are
   marked as such and were deliberately **not** decided within the lane.
7. **No git writes, no memory writes**, no edits outside this file, `MFS3B-context-census.py`,
   `MFS3B-context-census.csv` and the receipt in the scratchpad.

---

## §14 · THE ONE-PARAGRAPH ANSWER TO §246

**Could our process have produced a plate indistinguishable in kind and quality from these?**
For an aesthetically-lit town leaf: **not yet, but the gap is enumerable** and MF-A1 plus
atlas §2.3.3 already own the painted half. For the CONTEXT — which is what this lane
studied — the honest answer is that **we would produce a plausible settlement with an
implausible relationship to its world.** The wall would be a shape rather than nine
decisions; the water would be a channel rather than a system; the institutions would have
sizes but no neighbours; the outside would be a ring rather than a ladder; and a desert
courtyard city would come out as a European row town in warm ink. **Six of those five
failures trace to two missing inputs — a terrain substrate and a region — and the seventh to
one missing enum.** Nothing in this compendium requires a new rendering capability we lack;
almost all of it requires facts we already hold to be **spatially consumed** for the first
time. `supplyChains`, `neighbors`, `institutions` and `resources` are, today, four rich
dossier fields that the map reads for labels and not for geometry. **That is the finding.**

**MF-S3b ends here. Advisory throughout: no git writes, no memory writes, nothing decided.**
