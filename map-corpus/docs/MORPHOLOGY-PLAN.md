# THE PLAN-STRUCTURE COMPENDIUM — MF-S3a

### Lane MF-S3a (Opus 5), 2026-08-17. ODQ §245 (the urban-planning study) as sharpened by §246 ("if you had to create these exact same images using OUR process, how would you do it?").
### Advisory deliverable. Read-only lane: no git writes, no memory writes, no edits outside this file and the `MFS3a-*` instruments and JSON beside it.
### Sibling lane MF-S3b holds the CONTEXT half (geography, water, walls, edges, institution siting, circulation, regional morphotypes). Cross-references are marked **→ S3b**; nothing here duplicates that half.

---

## §0 · WHAT THIS DOCUMENT IS, AND HOW TO READ IT

The owner asked for the corpus's **urban planning** — "the actual structure of the streets, districts, variance of the buildings" — and explicitly for dimensions **beyond** that list. Then he sharpened the question to its most useful form: *could our pipeline emit a plate like this, and if not, what is missing?*

So every finding below is written in two parts.

1. **THE FINDING** — what the corpus does, tagged **[M]** measured or **[E]** eye-estimated, with the plates it rests on.
2. **THE RECONSTRUCTION FORM** — how our pipeline would have to produce it: the **MECHANISM** (stage, inputs, rule), the **DERIVATION HOME** (which dossier fact drives it), and the **VERDICT**:

| Verdict | Meaning |
|---|---|
| **HAVE** | we already derive this; the governing law is named |
| **PARTIAL** | the law exists but something specific is missing; the missing piece is named |
| **MISSING** | no law covers it; a mechanism is proposed (proposal only — the chair rules) |
| **NOT-DERIVABLE** | nothing in the dossier could drive it; filed in §14 as inspiration, not smuggled in as a rule |

**The calibration target is REGISTER AND KIND, never pixel-identity.** The corpus carries defects we ban — even spacing, the concentric prior, garbled lettering, real-world name leaks — and our maps are *true* where the corpus's are decorative. The test written against throughout is: **could our process have produced a plate indistinguishable in kind and quality from this one?**

### §0.1 · HONESTY KEY

- **[M]** = measured by the instruments saved beside this file (§0.4), on a stated window, reproducible.
- **[E]** = read by eye off the plate at the stated zoom. **No [E] figure is presented as [M].**
- **CONFIRMED** = I executed the measurement or looked at the pixels in this lane. **PLAUSIBLE** = reasoning from evidence I did not directly execute.
- Where a figure exists in `laneHFM1-corpus-measured.csv`, I cite **the CSV**, never the atlas's prose — per the chair's instruction, because lane MF-S2 is editing `laneMFS1-urbanism-atlas.md` concurrently and its numbers may move under me. The atlas is treated as **read-only** throughout; where I extend one of its targets I name the target (T-nn) and say what I add.

### §0.2 · EXCLUSIONS APPLIED

**THE BLIND HOLDOUT — 91 PLATES EXCLUDED [M, CONFIRMED].** `laneHFM1-holdout-proposal.json` was parsed for every `hf<n>` token appearing **anywhere** in the file — the `proposed`, `kept`, `added` and `dropped` arms *and* the 12-swap `minimal_swap` arms. That conservative union is **91 distinct plates**, all present on disk. Every one was excluded from every observation, measurement, sample and trace in this document. (The narrower reading — `proposed ∪ minimal_swap.proposed` — is 81 plates; I took the wider union because the brief said "conservatively", and because a plate named in the `dropped` arm is still a plate whose identity the holdout design has reasoned about.)

**STUDIABLE FRAME: 222 plates**, composed as — town 49 · specimen 28 · terrain 27 · zoom 15 · city 15 · village 12 · stressor 11 · fantastical 10 · systems 8 · underground 7 · metropolis 6 · lens 6 · thorp 5 · hamlet 5 · series 5 · chrome 4 · exp 4 · trade 3 · institution 2. By era: HF-1 35 · HF-2 21 · HF-3 54 · HF-4b 51 · HF-4c 61.

**THE LETTERING SCRUB — 35 plates [M, CONFIRMED].** Parsed from `laneHF4-receipt.md`'s scrub section: hf148, hf170, hf171, hf190, hf249, hf253, hf268, hf284, hf287, hf292, hf295, hf296, hf298, hf299, hf306, hf309, hf310, hf314, hf318, hf328, hf329, hf341, hf348, hf350, hf351, hf353, hf356, hf357, hf361, hf368, hf372, hf373, hf374, hf375, hf383. **No naming or lettering observation in this document is drawn from any of them.** Their geometry is used freely and is cited as geometry — hf306 and hf298 in particular carry load in §8 and §10, on plan structure only.

### §0.3 · SAMPLE

- **Whole-corpus reading**: all 222 studiable plates were passed over via `laneHF-CALIBRATION.md`'s per-plate index (what each teaches, and its recorded defects), and 36 were viewed directly as full plates or gridded contact sheets.
- **MEASURED DEEP SAMPLE: 49 windows over 36 plates** — 35 whole-settlement windows plus 14 sub-windows that isolate a *quarter or epoch inside one plate* (the `@part` rows). Composition of the whole-settlement windows: thorp 2 · hamlet 2 · village 3 · town 17 · city 7 · metropolis 4. Sub-windows: hf26 old/new-quarter/burnt, hf72 east/west nuclei, hf121 huddle, hf239 camp/vicus, hf347 core/outer-ring, hf40 rich/poor, hf274 oldbank/newcharter.
- **Windows are HAND-SET** and recorded in `MFS3a-windows.json` as fractions of the plate. This follows the `MFS1-grain2.py` convention and its warning: **a window is the analyst's eye-bounds and must be re-set for any new plate.** I attempted three successive auto-hull detectors (ink density, junction density, "the settlement is what the countryside surrounds") and **all three failed** — the corpus's hatched countryside shares both the luminance and the ink density of built fabric. That failure is recorded because it is itself a finding about the plates (§13.4).

### §0.4 · INSTRUMENTS (saved beside this file, re-runnable)

| File | What it measures |
|---|---|
| `MFS3a-frame.py` → `MFS3a-frame.json` | the studiable frame; holdout and scrub exclusions |
| `MFS3a-plangraph.py` | fabric hull, street space, **street graph** (junction typing, degree mix, dead ends, mesh), **Boeing orientation entropy / order φ**, block area–shape–solidity, backland green share |
| `MFS3a-voids.py` | grain (cells across), **street width in plot-widths** via distance transform, **void hierarchy** (squares, markets, emptiness) |
| `MFS3a-contact.py` | gridded contact sheets, for hand-setting windows |
| `MFS3a-overlay.py` / `MFS3a-valwin.py` | **visual validation sheets — the instrument is not trusted until the sheet is looked at** |
| `MFS3a-planmetrics.json`, `MFS3a-voidmetrics.json` | the 49-window outputs quoted throughout |

**Three calibrations were performed before any number was believed**, and each is recorded in the instrument's own docstring:

1. **Street space is found by a LOCAL-adaptive luminance threshold, not a global one.** A global Otsu on a town plate returns ~118 and separates *ink from not-ink* — the wrong split. Otsu taken on the non-ink subset returns ~190 and correctly separates block fill (L 167–172) from street/void (L 212–220), a 45 L gap. But even that fails on ward-washed plates like hf34, whose ward washes span the street luminance; the local-adaptive rule (`L > localmean(7.5% of longside) + 12`) succeeds there because **the street is always the palest thing in its own neighbourhood** even when it is not the palest thing on the plate.
2. **Skeleton spurs are not dead ends.** Unpruned skeletons report 54–72% dead-end nodes. That is an artifact. After spur pruning the figure lands at 11–39% (§1.3), and the pruning threshold is recorded per row.
3. **Grain is invalid below village tier.** ODQ §244.5 already established that a scanline grain instrument returns "99.6 cells across" for a twelve-roof thorp because it is counting hedges and furrows. My instrument inherits that trap exactly — hf90 returns 55.0 cells across for a twelve-roof thorp. **Every thorp and hamlet row carries `grain_valid:false` and appears in no band aggregate.**

**Visual validation was executed** on hf72, hf40, hf34, hf26, hf3, hf33 and on the four windows carrying the headline claim (hf239@camp/@vicus, hf26@newquarter/@old). The skeletons trace real streets; the windows sit on real fabric. **CONFIRMED.**

---

# PART 1 — THE PLAN, MEASURED

## §1 · THE STREET NETWORK AS A GRAPH

### §1.1 · THE CORPUS'S STREET GRAPH IS T-DOMINATED AND X-STARVED — the single most transferable graph fact

**[M, CONFIRMED — 35 whole-settlement windows.]** Junction-type mix across the corpus:

| Node type | min | **median** | max |
|---|---|---|---|
| dead end (deg 1) | 0.110 | **0.209** | 0.391 |
| **T or Y (deg 3)** | 0.510 | **0.653** | 0.738 |
| X (deg 4) | 0.000 | **0.015** | 0.055 |
| star (deg ≥5) | 0.000 | **0.000** | 0.009 |
| **X : T ratio** | 0.000 | **0.024** | 0.085 |

**The corpus's median settlement has forty-three T-junctions for every X-junction.** Not one of the 35 windows exceeds 5.5% X-nodes, and 22 of 35 have *zero* nodes of degree ≥5 — there is essentially no such thing as a five-way star in this corpus except where a plate deliberately draws a radiating gate-fan.

This is the sharpest single number in this document, because a naive street generator — one that lays a mesh, or that connects points by shortest paths, or that grows a lattice — produces **X-junctions as its default**. Real organic accretion produces T-junctions, because a new lane is nearly always driven *into* an existing frontage rather than laid across it. The X-junction is a *design act*; the T-junction is a *growth act*.

Mesh quality is likewise narrow and diagnostic: **mean degree 2.13–2.67 (median 2.47)**, **edge/node ratio 1.17–1.55 (median 1.40)**, **γ connectivity 0.393–0.521 (median 0.473)** — that is, roughly *half* the edges a maximally-connected planar graph could carry. The corpus draws neither a tree (γ→0.33) nor a mesh (γ→1.0); it draws a **half-mesh with a strong T bias**.

> **RECONSTRUCTION FORM — MECHANISM.** In the street stage, streets must be generated by **attachment, not intersection**. Concretely: a new street segment is seeded at a point *on an existing segment* (creating a T) and grown outward until it meets a hard edge (wall, water, cliff, another street) — and the meeting is resolved by **terminating at the frontage**, not by crossing it. An X may only be minted when two *arterials of the same rank* cross, and that event is budgeted, not free. Target bands to census per leaf: `X:T ≤ 0.09`, `deg≥5 share ≤ 0.01`, `γ ∈ [0.39, 0.52]`, `mean degree ∈ [2.1, 2.7]`.
> **DERIVATION HOME.** The T:X ratio is driven by **founding kind + lawfulness + epoch**: a founded-planned settlement (castra, bastide, charter borough) earns a higher X budget *in the epoch that was planned* and only there; organic epochs get near-zero. §11.2's order drift moves the budget over time.
> **VERDICT: MISSING.** §201.2's street-attachment law guarantees every segment attaches *somewhere*, which is a connectivity floor, not a **junction-type distribution**. §202's universal access is likewise a reachability property. Nothing in §150–§245 constrains the *shape* of attachment, and a generator can satisfy both existing laws perfectly while emitting an all-X lattice. **Proposed: a `junctionMix` census with the bands above, plus a generation rule that a new segment terminates on the frontage it meets unless it is arterial-on-arterial.** This is the highest-leverage graph finding in the study.

### §1.2 · ORIENTATION-ORDER φ IS THE MEASURED PLANNED/ORGANIC DISCRIMINATOR — and it works *within one settlement*

**[M, CONFIRMED.]** Boeing's orientation-order φ (36 bins, bidirectional, length-weighted; φ=0 maximally disordered, φ=1 a single perfect grid) over the corpus:

- **Whole settlements: φ 0.044 – 0.103 (median) – 0.433.** The corpus's settlements are, as wholes, **strongly disordered** — the median φ of 0.103 is far below any gridded modern city.
- **But the discriminator lives INSIDE the plate.** Measured on sub-windows of the *same* plate:

| Plate | planned part | φ | organic part | φ | ratio |
|---|---|---|---|---|---|
| hf239 castra-town | the camp grid | **0.585** | the vicus fraying outside the gate | **0.074** | **7.9×** |
| hf26 town-fire-rebuild | Quartiere Nuovo | **0.652** | surviving old fabric | **0.069** | **9.5×** |
| hf274 city-twin-bridge | Newcharter borough | **0.318** | Oldbank borough | **0.131** | **2.4×** |
| hf347 town-three-circuits | inner core | 0.707 ⚠ | outer ring | 0.424 | — |

⚠ hf347's core window resolves only 11 graph nodes; that φ is **not trustworthy** and is shown for completeness only. The other three rows rest on 76–136 nodes each and were **visually verified** — the camp skeleton traces the *via principalis*/*via praetoria* cross, the vicus skeleton is a tangle, the Quartiere Nuovo skeleton is a clean lattice.

Two corollaries fall out immediately.

**(a) Planned fabric never reaches φ=1.** hf26's Quartiere Nuovo is the most rigidly planned quarter in the studiable corpus and measures 0.652, not 0.95. The corpus's own defect list already names "machine-perfect regularity in planned quarters" as a prior *not* to emulate; φ puts a number on how much drift a planned quarter actually shows. **A planned quarter that measures φ > 0.8 is drawn wrong.**

**(b) X-junctions co-vary with φ, but weakly.** hf239@camp carries the corpus's highest X share (0.088) *and* its highest trustworthy φ (0.585). But hf26@newquarter, at φ 0.652, carries X share of only 0.020 — because its grid is a **ladder** (one spine, rungs off it) rather than a lattice. So φ and X:T are **two independent dials**, and a plan needs both set.

> **RECONSTRUCTION FORM — MECHANISM.** Each **epoch/district organism** carries its own `orientationOrder` target and its own **bearing basis**. Fabric generated inside that organism samples street bearings from a von-Mises-like distribution around the basis, whose concentration is set by the target φ. An organic organism gets a near-uniform bearing draw (φ→0.05–0.12); a planned one a two-lobed draw at 90° (φ→0.35–0.65) **with mandatory jitter** so it cannot exceed ~0.7.
> **DERIVATION HOME.** `foundingKind` (founded-military → castra grid; founded-charter/bastide → borough grid; organic → no basis) × `epoch` (which ring was laid when) × `lawfulness` (order drift, §11.2) × **event history** (a fire or a sack licenses a *replanned* epoch, which is exactly hf26 and hf364).
> **VERDICT: PARTIAL.** §5.0 morphology and §11.2 order drift both name regularity as a *dial*, and §161d gives per-district grain angles ("per-district grain angles belong to the organisms"). What is missing is (i) a **measurable target** for that dial, (ii) the ceiling that forbids φ>0.8, and (iii) a census that reads φ back off the drawn geometry. **Proposed: adopt φ as the order metric, band it per epoch by founding kind, and census it per organism.** It is cheap — it is a histogram over drawn segment bearings — and it is *directly comparable to published human-settlement figures*, which no other number in our program is.

### §1.3 · DEAD ENDS ARE A POVERTY AND WATER SIGNAL, NOT A SUBURBAN ONE

**[M, CONFIRMED.]** Dead-end share, median 0.209 over 35 windows. The tails are the interesting part:

- **Highest: hf235 city-canals 0.391.** A water-as-street morphology dead-ends constantly, because a canal terminates at a *campo* or a wall and does not loop. **→ S3b** owns the water morphotype; the graph consequence is recorded here.
- **hf274 newcharter borough 0.342** — a *planned* borough with high dead-ends, because its grid is laid out to the river and stops there, and because its VACANT PLOTS mean streets are built before the fabric that would extend them.
- **hf40 poor quarter 0.296 vs hf40 rich quarter 0.215 [M].** Within one city, the **poor half carries 38% more dead ends than the rich half.** This is the clearest measured social signal in the graph. Cul-de-sac courts, infill passages and blocked lanes are what happens when land is subdivided under pressure.
- **Lowest: hf60 0.110, hf62 0.110.** Both are compact, single-epoch, wall-bounded towns whose lanes loop.

> **RECONSTRUCTION FORM — MECHANISM.** Dead-end incidence is not a knob but a **consequence of two derived pressures**: (i) subdivision pressure inside a block spawns cul-de-sac access passages (the §201.1b "cul-de-sac pocket" type, already ratified); (ii) a hard edge terminates streets that reach it (§239.1 block termination). Getting the incidence right therefore means getting **subdivision pressure per district** right.
> **DERIVATION HOME.** `prosperity` and `wardWealth` per district (poor → more subdivision → more pockets), `waterMode` (canal/lagoon morphotypes raise it structurally), `epoch` (a young planned epoch has high dead-ends until it fills — hf274, hf324).
> **VERDICT: PARTIAL.** §201.1b already names the cul-de-sac pocket as one of three lawful alley topologies, and §204 rates courts as rare. But **nothing ties dead-end incidence to district wealth**, and the corpus says that is one of the strongest legible social tells in the plan. **Proposed: band dead-end share per district by wealth rung (rich 0.15–0.22, poor 0.26–0.34) and census it.**

### §1.4 · ROUTE HIERARCHY IS REAL AND SHALLOWER THAN THE ATLAS'S SPREAD SUGGESTS

**[M, CONFIRMED.]** Street width measured properly for the first time — via the **distance transform sampled on the street skeleton** (true local width), rather than by pale-run length along scanlines. Normalised to each window's own cell pitch, so the unit is **plot-widths**:

- **p50 width 0.44 – 1.77 – 4.90 plot-widths**; **p97 width 1.24 – 5.72 – 22.07**.
- **Hierarchy depth p97/p50: 1.79 – 3.32 – 7.30.**

The distance-transform figure is a *different measurement* from the atlas's T-04 scanline ratio and the two should not be compared directly: a scanline crossing a street diagonally over-reports its width, and a scanline crossing a square reports the square. The distance transform reports the inscribed width at each point, which is what a street actually is.

What the hierarchy tail identifies is **the presence or absence of a top rung**:

- **hf298 siq-hidden-city 7.23** and **hf306 town-in-ruins 5.88** and **hf138 harbor-ribbon 7.30** are the deep ones — and each is deep for a *structural* reason: the siq's unloading ground, the ruin's emptied avenues, the ribbon's single quay street against a fabric only two blocks deep.
- **hf93 hamlet-street 1.79** and **hf88 thorp-crossroads 2.04** are the shallow ones: at the bottom of the ladder **there is only one class of street and the hierarchy is genuinely flat**.
- The middle band, towns and cities, clusters tightly at **2.4–4.6**.

> **RECONSTRUCTION FORM — MECHANISM.** Street width classes derive from **through-traffic weight** on the street graph, not from a class label. Compute a betweenness-like load on the street graph using the settlement's own gates, market, quays and institution anchors as origins/destinations; bin the load into 3–5 width classes; the number of classes available is set by tier. Then the *widest* rung is only minted if a top-rung generator exists (market void, arterial, quay street).
> **DERIVATION HOME.** `tradeRouteAccess` and the neighbour link (which gates carry weight — §161a already sets "the neighbour link sets the main road's true exit bearing"), `institutions` (the market, the port, the castle gate are the attractors), `tier` (class count), `population` (absolute width).
> **VERDICT: PARTIAL.** §11.2 makes street width the order tell and §11.3 gives the road-death ladder *outside* the settlement. GAP-C in the atlas already proposes width classes at fixed ratios. What this study adds and what is still missing is that **width should be derived from graph load, not assigned from a class ladder** — that is what makes the widest street land *where the traffic is* rather than on a designated spine, and it is what produces hf138's single fat quay street without anyone naming it. **Proposed: `streetLoad` betweenness pass → width classes; the class ladder becomes the quantiser, not the source.**

### §1.5 · WHERE THE NETWORK IS FINEST AND COARSEST — the answer is not "the centre"

**[E, CONFIRMED by direct inspection of hf40, hf33, hf34, hf72, hf274, hf347, hf306.]** The intuition that a street web is finest at the centre and coarsens outward is **false in this corpus**. What actually governs:

1. **The finest mesh sits in the OLDEST fabric, wherever that is.** hf274's Oldbank (47.2 cells across the window) against Newcharter (26.6) — the old borough is nearly twice as fine, and it is not central; it is across the river. hf26's old fabric 46.9 against Quartiere Nuovo 16.3, a **2.9× grain difference in one frame**.
2. **The second-finest sits in the POOREST fabric.** hf40's poor quarter measures 34.0 cells across its window against the rich quarter's 27.2 — and by eye the poor quarter's *footprints* are dramatically smaller still; the window figure understates it because the rich quarter's garden courts read as open ground.
3. **The coarsest sits in institutional precincts and in the newest ring** — hf34's palace and cathedral blocks, hf347's outer ring at 9.8 cells across (against the core's 17.4).

So the real rule is: **grain is a function of (age, wealth, land use), and only incidentally of radius.** A generator that imposes a radial density falloff will produce a plausible *blob* and an unreadable *history*.

> **RECONSTRUCTION FORM — MECHANISM.** Grain is set **per organism** as `f(epoch_age, districtWealth, landUse)` and the radial gradient is allowed to *emerge* from the fact that older epochs are usually inner. Never impose radius directly.
> **DERIVATION HOME.** `epoch` index and its year, `wardWealth`, district `type` (institutional precincts coarse, crafts and poor fine).
> **VERDICT: PARTIAL, and this is an important correction.** The atlas's T-03 / GAP-B proposes `radialDensityFalloff` as a morphology discriminator with per-morphology bands — a **radial** statistic. This study finds the radial reading is a *symptom*, and that fitting to it directly would bake in the concentric prior the program has spent three corpus rounds fighting. **Proposed: keep the radial statistic as a CENSUS (it is a good detector of "organic settlement rendered as an even blob") but forbid it as a GENERATOR input; the generator's inputs are epoch age, wealth and land use.**

---

## §2 · BLOCKS, PLOTS AND FRONTAGE

### §2.1 · THE BLOCK IS THE CORPUS'S UNIT OF COMPOSITION, AND ITS SHAPE IS TIGHTLY CONSTRAINED

**[M, CONFIRMED — 35 windows.]** Block shape statistics:

| Statistic | min | **median** | max |
|---|---|---|---|
| elongation (major/minor axis) | 1.56 | **2.14** | 3.42 |
| circularity (4πA/P²) | 0.126 | **0.324** | 0.578 |
| solidity (area / convex-hull area) | 0.503 | **0.748** | 0.861 |
| area ratio p90/p10 | 5.8 | **13.6** | 204.5 |

Three things follow.

**Blocks are systematically elongated — median 2.14:1, and no window's median block is round.** The corpus does not draw square blocks. It draws **strips**: a block is what is left between two roughly parallel streets, and its length is set by how far you go before the next cross-lane.

**Blocks are systematically non-convex — median solidity 0.748.** A quarter of the convex hull of a typical block is *not* block. That is the signature of streets meeting at angles and of blocks wrapping around things.

**Block area spread is enormous and it is the shape of the spread that carries information — median p90/p10 = 13.6×, running to 204×.** The extreme values are not noise; they are structure. hf40's 204× is the rich quarter's great walled courts against the poor quarter's slivers *in one frame*.

> **RECONSTRUCTION FORM — MECHANISM.** §239.1 already gives the right generation order — **a block is DEFINED by its bounding rights-of-way, never grown-then-clipped**. This study supplies the acceptance bands that make that law checkable: after the street web exists, the block set is the planar face set of the street graph, and those faces must land at elongation median 1.6–3.0, solidity median 0.60–0.86, and p90/p10 area ratio ≥ 6.
> **DERIVATION HOME.** Falls out of the street graph; no separate derivation needed. Which is the point — **if the street graph is right, the blocks are right for free.**
> **VERDICT: HAVE (law) + MISSING (bands).** §239.1 is exactly correct and this study confirms it from the references. **Proposed: add the three shape bands above to the block census.** A generator emitting median-square, high-solidity blocks has silently reverted to grow-then-clip even if the code says otherwise — these bands catch that.

### §2.2 · THE PERIMETER BLOCK WITH A GREEN CORE IS THE CORPUS'S DEFAULT, AND ITS INCIDENCE IS A WEALTH READ

**[M, CONFIRMED.]** Using the green index `2G − R − B` (calibrated on hf72: sage backland 21, terracotta roof 2), the share of each block that is *backland green* rather than roof:

| Window | median block green share | blocks ≥10% green | blocks ≥25% green |
|---|---|---|---|
| hf88 thorp-crossroads | 0.605 | — | — |
| hf331 dual-lordship town | 0.395 | 0.72 | 0.60 |
| hf90 thorp-plains | 0.358 | — | — |
| hf138 harbor-ribbon | 0.172 | 0.50 | 0.33 |
| hf235 city-canals | 0.127 | 0.42 | 0.26 |
| hf324 bastide (half-filled) | 0.107 | 0.43 | 0.30 |
| hf72 dumbbell town **west (citadel)** | **0.126** | 0.58 | 0.42 |
| hf72 dumbbell town **east (river)** | **0.028** | 0.31 | 0.14 |
| hf40 **rich quarter** | 0.0056 | 0.13 | 0.03 |
| hf40 **poor quarter** | **0.000** | **0.00** | **0.00** |
| hf34 metropolis-capital | 0.000 | 0.02 | 0.00 |

The gradient is monotonic and it is a **land-price gradient**: backland survives at thorp scale (0.36–0.61), thins through town (0.03–0.40), and is **extinguished entirely in the dense city core and the poor quarter**. hf72 shows the whole gradient inside one settlement — its upper citadel borough keeps gardens (0.126) while its river-trade borough has built them out (0.028).

⚠ **Honest limit.** This measure reads *pigment*, not land use: a plate that draws its yards in the same warm tone as its roofs will score 0 regardless of whether yards exist (hf34 and hf26 score 0.000 and both certainly have block interiors). So **a high score is strong evidence of backland; a low score is not evidence of its absence.** The measure is a one-way test and is used only that way here.

> **RECONSTRUCTION FORM — MECHANISM.** The block interior is not empty space left over — it is a **derived land use** with its own generator: a `backland` pass that, after frontage buildings are placed, fills the residual block interior with yard / garden / workshop / privy / well furniture at a density set by land price. As land price rises, backland is consumed by infill (which is exactly hf40's poor quarter and exactly the §6.4 yard-creep sequence).
> **DERIVATION HOME.** `districtWealth` × `population pressure` (current vs high-water, §161f) × `epoch age` × `district type` (crafts consume backland for workshops; residential keeps gardens).
> **VERDICT: PARTIAL.** §203 arm 2's zone-fill bands are the right home and the atlas's T-05 supplies open-share numbers per district type. What is missing is that **fill is currently a share, not a STRUCTURE**: a block at 70% built could be a perimeter block with a garden core or a scatter with gaps, and those read completely differently at glance range. **Proposed: `backlandCore` as an explicit derived object per block — the residual interior after frontage placement — with its own fill rule and its own census (share of blocks carrying a contiguous interior core ≥ X% of block area).** This is the mechanism that makes §201's alley register and §204's rarity ruling coherent, because a court is then *a backland core that failed to get a mouth*, rather than a separately-invented feature.

### §2.3 · THE PLOT SERIES IS DRAWN AS A COMB, AND ITS RHYTHM IS UNEVEN BY CONSTRUCTION

**[E, CONFIRMED at native zoom on hf93, hf72 east nucleus, hf347, hf331.]** The corpus's most repeated fine structure is the **burgage comb**: a continuous frontage line, buildings touching the street, plots running back at 4–6:1 depth:width, and the *back ends* of the plots meeting a back lane or the plots of the opposite street.

What this study adds to the atlas's T-08 is the **rhythm**, read off hf347's zoom and hf93:

1. **Plot widths within a series vary, and the variation is not random-uniform — it is CLUMPED.** Adjacent plots share widths closely (a burgage and its neighbour were laid out together), and the series then *jumps* at intervals — a double-width plot, or a narrow one, marking an amalgamation or a subdivision. What the eye reads as "hand-drawn" is this **run-length structure**, not per-plot noise.
2. **Amalgamation is drawn.** A plot twice the module width with a single building across it appears repeatedly. So does the inverse: a module split into two thin plots with a shared passage.
3. **The corner plot is different.** At a block corner the plot turns and the building wraps, producing an L-footprint. Corner buildings are consistently **larger** and are consistently the ones drawn with extra articulation (hf347's corner masses, hf72's corner blocks). The corner is where the smithy, the inn and the shop go — because it has two frontages.

> **RECONSTRUCTION FORM — MECHANISM.** A **plot-series generator** that runs along each block face: pick a module width from the district's own distribution; emit a *run* of 2–6 plots at that width ±10%; then apply an amalgamation/subdivision event with a probability set by wealth and epoch age; repeat. Corner plots are minted explicitly, get 1.4–2.0× the module area, and are the preferred anchor for street-facing commercial institutions.
> **DERIVATION HOME.** Module width from `tier` × `districtWealth`; run length and amalgamation rate from `epoch age` (old fabric has had more amalgamations) and `prosperity trajectory` (a prospering town amalgamates, a declining one subdivides — and that is a *directional* signal we can derive from the population trajectory, §161f); corner assignment from `institutions` needing frontage.
> **VERDICT: MISSING, and it is the un-deferral question.** §18.5's burgage plot-series module is **currently DEFERRED post-launch**. The atlas already recorded un-deferring it as MF-S1's strongest scope recommendation. This study independently reaches the same conclusion by a different route: **the plot series is what produces the continuous frontage line, and the continuous frontage line is what makes a block read as fabric rather than as a bag of rectangles.** Without it, §2.1's block bands can be met and the plate will still not read right. **Recorded as this lane's strongest scope recommendation; the chair rules.**

### §2.4 · THE BLOCK'S FACE AND ITS INTERIOR ARE DRAWN IN DIFFERENT REGISTERS

**[E, CONFIRMED on hf347 zoom, hf72, hf40, hf34.]** A block is not homogeneous. Reading hf347's zoom:

- the **street face** is a continuous ink line at the heaviest fabric weight, unbroken for the whole block length except at plot passages;
- the **interior** is drawn at roughly half that weight, in fragments — party walls, yard boundaries, outbuildings;
- the **back edge** where two plot series meet is drawn as a *single* line, often slightly wavering, and it is frequently the oldest surviving boundary on the plate (see §6.3).

The consequence for us is that **the block silhouette is a first-class drawn object**, not an emergent side-effect of drawing buildings. The atlas's GAP-D already proposes exactly this (`blockSilhouette` union pass) and calls it the largest visual-quality lever; this study confirms it from the plan side and adds that the silhouette is also **structurally load-bearing** — it is the line the plot series is measured from and the line the fossil boundary survives as.

> **VERDICT: MISSING — and it is the same gap the atlas named as GAP-D.** Recorded here as independently confirmed from plan structure rather than from lineweight, so the chair has two witnesses.

---

## §3 · BUILDING VARIANCE — HOW THE CORPUS AVOIDS MONOTONY

This is the section the brief flagged as the one our generator most needs, so it is written as a mechanism list rather than an observation list.

**[E, CONFIRMED across hf72, hf34, hf40, hf33, hf347, hf331, hf26, hf306; native and 1500px zooms.]** The corpus avoids monotony with **six devices, and only one of them is per-building noise.** This matters enormously: the instinct is to jitter footprints, and jitter is the *weakest* of the six.

**1 · THE TWO-LEVEL FOOTPRINT DISTRIBUTION.** Within a block, footprints are not drawn from one distribution. There is a **module** (the common house, repeated with modest variation) and a small number of **outliers** (2–4× module: the corner property, the inn, the merchant's house, the workshop range). The eye reads richness from the *outliers*, not from the module's variance. A block of 20 buildings typically shows 16–18 near-module and 2–4 outliers **[E]**.

**2 · L-, U- AND COURTYARD PLANS AT THE OUTLIERS.** The outliers are not just bigger rectangles — they change **plan topology**. hf347 and hf331 show L-plans wrapping corners, U-plans around a yard, and full courtyard plans at the inns. This is the single most effective anti-monotony device in the corpus because it breaks the silhouette, not just the size.

**3 · RUN-LENGTH RHYTHM ALONG THE FRONTAGE** (§2.3): clumps of similar plots punctuated by a jump.

**4 · ORIENTATION DISCIPLINE THAT IS LOCAL, NOT GLOBAL.** Every building in a range shares its neighbour's bearing to within a degree or two — they share party walls. But the *range* turns with the street, and adjacent ranges on different streets sit at frank angles to each other. The corpus is **rigidly disciplined at the range scale and free at the block scale.** A generator that jitters individual building bearings destroys the range; one that aligns everything to a global grid destroys the block. **The bearing carrier is the STREET SEGMENT, and buildings inherit it.**

**5 · TONE JITTER IN TWO NESTED LEVELS** — a ward-level sub-palette then a per-building jitter inside it. This is aesthetic and belongs to lane MF-A1; it is named here only because it is the device that makes an otherwise repetitive block read as varied, and because **it is nested, not flat.**

**6 · THE ROOF-TICK VOCABULARY.** Gable, hip, cat-slide, cross-gable read as different plan marks. Two extra strokes per building, and they differentiate a range that is otherwise identical.

**THE RATIO OF ORDINARY TO NOTABLE [E].** Counting legible non-ordinary structures against total footprints on the plates where both are countable: notable structures run roughly **2–5% of footprints at town scale and 1–2% at city scale**, while occupying perhaps 10–20% of built area. The corpus's monumental budget is **small in count and large in area** — which is the opposite of a generator that promotes many buildings by a small factor.

> **RECONSTRUCTION FORM — MECHANISM.** In the footprint stage: (i) draw the module size from a per-district distribution with **low** variance (±15%); (ii) mint outliers by an explicit **budget** (count derived, not probabilistic per building) and give outliers a *plan archetype* (L / U / courtyard / range) rather than a scale factor; (iii) inherit bearing from the owning street segment, never from a global basis and never per-building; (iv) apply run-length clumping along the frontage; (v) two-level tone.
> **DERIVATION HOME.** Module size from `tier` × `districtWealth`; outlier budget from `institutions` (each institution is an outlier and they are already enumerated truthfully — this is where our truth layer beats the corpus outright: *our outliers have names and reasons*) plus a small `prosperity`-driven allowance for un-named wealthy houses; plan archetype from institution `category` (§161n's ladder already does this) and from corner-ness (§2.3).
> **VERDICT: PARTIAL, in a specific and fixable way.** §161n's institution-scale ladder gives outliers their rungs and is exactly right. §5's monumental-silhouette budget bounds the count. What is missing is **(a)** the *ordinary* fabric's two-level structure — module plus a small non-institutional outlier allowance — and **(b)** the rule that **bearing is inherited from the street segment**, which is the structural cause of the range reading. **Proposed: `footprintModule` per district with an explicit outlier budget, and a hard rule that a building's bearing is its frontage segment's bearing ± a sub-degree jitter.** Item (b) is nearly free and is the single highest-return item in this section.

---

## §4 · DISTRICT STRUCTURE AND RELATIONS

### §4.1 · HOW MANY DISTRICTS A SETTLEMENT LEGIBLY HAS

**[E, CONFIRMED — counted off the studiable plates that draw distinguishable quarters, by grain/tone/footprint-shape change, ignoring labels.]** Legible districts per settlement:

| Tier | legible districts |
|---|---|
| thorp | 0–1 (the settlement *is* the district) |
| hamlet | 1 (+1 if a mill or church precinct is separately enclosed) |
| village | 1–3 |
| town | 3–6 |
| city | 5–9 |
| metropolis | 8–14 |

The important structural fact is not the count but this: **the counts are far lower than the number of *labels* the plates carry**, and far lower than an institution census would suggest. hf331 carries a dozen named things and reads as **four** districts (minster close, bishop's borough, the town borough, the shambles/craft edge). **Legibility saturates well below enumeration.**

### §4.2 · DISTRICTS DO NOT TILE — THE INTERSTITIAL MATRIX IS THE MAJORITY

**[E, CONFIRMED on hf34, hf40, hf331, hf277, hf364, hf366-class plates.]** The corpus never draws a settlement as a partition of named quarters. In every multi-district plate:

- **2–5 districts are strongly characterised** (the ones with distinct grain, tone and footprint vocabulary);
- **the rest of the fabric is undifferentiated residential matrix** that carries no district identity at all;
- district boundaries **are not drawn** — the corpus reserves drawn boundaries for *jurisdictions* (hf331's dual lordship, hf274's mid-river borough boundary, hf35's ward bound), never for character zones;
- boundaries **read as a change of grain over 1–3 blocks**, except where a hard edge (wall, river, main street) makes the change abrupt.

hf40 is the exception that proves it and the corpus's own defect list flags it: its rich/poor divide is a **single clean line**, and it reads as the least convincing thing on an otherwise superb plate.

**Adjacency [E].** Pairs that recur: castle↔its own precinct wall, never directly onto poor fabric (hf72's castello, hf34's citadel, hf330); market↔the widest street junction; noxious trades (tanning, dyeing, slaughter)↔downwind AND downstream AND at the edge, and **never adjacent to a religious precinct**; port/quay↔warehouse ranks↔merchant houses in that order inland; poor fringe↔the wall's least valuable arc and outside it. Pairs that essentially never occur: market↔noxious; religious precinct↔noxious; castle↔market directly (there is always fabric or a forecourt between them).

> **RECONSTRUCTION FORM — MECHANISM.** This is precisely §161e's model — organisms as **influence fields over a residential matrix**, with parcels sampling the strongest local field and frontiers dithering salt-and-pepper. The corpus **confirms that model against the alternative** (hard-edged single-instance polygons) very strongly.
> **DERIVATION HOME.** §161l's attribution law (districts are constituted by their members) sets field strength; the affinity matrix (§167) sets which pairs attract and repel; §161c's siting rings set the noxious/outlying placement.
> **VERDICT: HAVE — and this is the strongest confirmation in the study.** §161d + §161e + §167 together predict exactly what the corpus draws. **What is missing is only the acceptance test**, which the atlas already named as GAP-H: districts must be legible **without their labels**. This study supplies the discriminator to test with — **grain (cells across) and block-area median must differ between neighbouring districts by a stated minimum**, and I measured the real separations: hf26 old vs new **2.9×** grain, hf274 old vs new **1.8×**, hf40 rich vs poor **1.25× in grain but ~3× in footprint size by eye**. **Proposed band: neighbouring characterised districts differ by ≥1.4× in median block area OR ≥1.3× in cells-across.** Below that, they are one district wearing two names.

### §4.3 · THE MATRIX LAW IS VISIBLY TRUE — AND ONE PLATE SHOWS WHAT VIOLATING IT COSTS

**[E, CONFIRMED.]** Every studiable plate that draws a working quarter also draws **dwellings inside it**. The tanners' ground has tanners' houses; the shipyard has shipwrights' terraces ranked below the owners' houses (hf296, geometry only — lettering scrubbed); the mining town's dressing floors and smiths' row sit among ordinary dwellings (hf270). §161e's residential-matrix law ("a dwelling-free district is a bug") is corpus-confirmed without exception in the plates I read.

> **VERDICT: HAVE.** §161e. Recorded as confirmed rather than extended.

---

## §5 · CENTRES AND VOIDS

### §5.1 · CENTRE TYPOLOGY

**[E, CONFIRMED across the studiable settlement plates.]** The corpus draws six centre types, and they are structurally distinct — not one primitive resized:

1. **THE STREET WIDENING** (cigar-shaped): the market is the main street, swollen. Stall ranks sit down the middle, leaving two carriageways. Frontage is continuous through it. Most common at village and small-town tier. hf20, hf93 (embryonic), hf347.
2. **THE TRIANGULAR GREEN AT A FORK**: three roads meet, the residual triangle is the green, a well or cross pins it. hf88, hf91, hf3.
3. **THE CARVED SQUARE**: a deliberate rectangular void with 3–4 entry gaps, a market hall or cross in it, and **encroachment islands** — permanent buildings that have eaten into the square's edge. hf277, hf167, hf331.
4. **THE CHURCHYARD / PRECINCT COURT**: an enclosed void, walled or railed, *not* a traffic space. hf331's minster close and canons' garden.
5. **THE CASTLE FORECOURT**: a cleared apron outside the castle gate, held clear for military reasons, often the largest single void in a small town. hf72's west nucleus, hf330-class.
6. **THE BRIDGEHEAD / QUAY WIDENING**: a void at the point of transhipment, shaped by the water edge rather than by frontage. hf274, hf138, hf62. **→ S3b** for the water-edge geometry.

### §5.2 · POLYCENTRICITY IS MEASURABLE, AND ROUGHLY HALF THE CORPUS IS POLYCENTRIC

**[M, CONFIRMED.]** Using **second-largest void ÷ largest void** as the polycentricity index (voids being street-space regions wider than 1.6 plot-widths, measured in plot-widths²):

- **Monocentric (ratio < 0.15): 12 of 34** — hf347 (0.00), hf138 (0.00), hf274@oldbank (0.00), hf30 (0.09), hf298 (0.03), hf167 (0.03), hf33 (0.035), hf34 (0.036), hf17 (0.03), hf274 (0.097), hf37 (0.091), hf90 (0.004).
- **Polycentric (ratio > 0.55): 13 of 34** — hf239@vicus (0.963), hf121@huddle (0.922), hf331 (0.910), hf13 (0.911), hf72 (0.898), hf166 (0.878), hf235 (0.865), hf62 (0.861), hf306 (0.803), hf324 (0.791), hf26@old (0.767), hf60 (0.712), hf23 (0.691).
- **Intermediate: 9 of 34.**

**Void count ≥4 plot-widths²: median 7 per settlement, range 0–24.** So the median studiable settlement carries **seven distinguishable open spaces**, of which one or two are "centres" and the rest are yards, forecourts and widenings.

The polycentric plates are polycentric for **derivable reasons every time**: two nuclei that grew together (hf72 — castle borough plus river borough); two jurisdictions (hf331 — bishop's market and borough market; hf274 — two boroughs, two market squares, two gallows); a water morphology with many campi (hf235); a settlement whose centre has *moved* (hf363-class, hf348-class); a decayed settlement whose surviving huddle has its own new centre inside the old one (hf121, hf306).

> **RECONSTRUCTION FORM — MECHANISM.** Centres are **minted by cause, never placed by count**. Each of these mints one: the primary market (always, at the highest-load junction reachable from the strongest gate); a second market **iff** a second jurisdiction or a second charter/borough exists in the dossier; a precinct court per major religious institution; a forecourt per fortified compound; a bridgehead/quay void per transhipment point. Then the *type* of each void is selected by its cause and its position in the street graph — a void at a fork becomes a triangular green; a void on a spine becomes a widening; a void minted by an authority becomes a carved square.
> **DERIVATION HOME.** `institutions` (markets, minsters, castles, ports), `powerStructure` (§161l — a real/formal power split is what mints a *second* market: this is hf331 exactly), `foundingKind` (a planned foundation carves; an organic one widens), `event history` (a market that moved leaves the old one as a residual void — hf363), the polycentric subseed law (§161's two-strong-sites rule) for the hf72 case.
> **VERDICT: PARTIAL.** §161's polycentric subseed law covers the *two-nuclei* case well. §161n's ladder covers market scale (cross→square→covered market→exchange district). What is missing is **(a)** the **void typology** — the corpus's six types are structurally different and we appear to have one square primitive; and **(b)** the rule that **a second centre is minted by a second AUTHORITY**, which is the most legible polycentricity cause in the corpus and is fully derivable from `powerStructure` and institution attribution. **Proposed: `centreKind` selected by cause × graph position, and a `secondAuthority ⇒ secondCentre` derivation.** Note the encroachment island in type 3 is already ratified as a pinned feature under §201.1c — the corpus draws it constantly and we should keep it.

### §5.3 · THE VOID HIERARCHY — public, private, agricultural, and *vacated*

**[E/M, CONFIRMED.]** Open space in the corpus sorts into four kinds that are drawn differently and must be generated differently:

1. **PUBLIC TRAFFIC VOID** — market, green, forecourt. Bounded by continuous frontage, entered by streets, drawn at street tone.
2. **PRIVATE ENCLOSED VOID** — precinct court, cloister garth, inn yard, castle bailey. Bounded by a wall or range, entered by one controlled gap.
3. **BACKLAND VOID** — the block interior of §2.2. Never entered from the street directly; reached through the plot.
4. **AGRICULTURAL / VACATED VOID INSIDE THE SETTLEMENT** — orchards, closes, tenter grounds, brickfields, garden plots **inside the wall**. This is the one a generator will forget, and the corpus draws it constantly: hf347's ORCHARDS / CLOSES / TENTER GROUND / BRICKFIELD / BUILDING PLOTS all sit inside the outer circuit; hf121's outer ring is GARDEN PLOTS & PADDOCKS; hf306's intramural land is NEW FIELDS and TERRACED GARDENS.

⚠ **Measurement caveat, stated because it matters.** My void instrument reports the *largest* void, and on plates of type 4 that is the emptiness, not the market — hf347's largest void measures 1009 plot-widths² and is its unbuilt outer ring, not its market. So **"largest void" is not "the centre"** and must never be used that way; the type-4 case must be separated by asking whether the void is *bounded by frontage* (a market) or *bounded by the wall* (vacancy).

> **RECONSTRUCTION FORM — MECHANISM.** A `voidKind` enum with four members and four different fill rules. Type 4 in particular needs an explicit generator: **intramural land not claimed by any district organism at the current epoch is dressed as agricultural/industrial ground**, not left blank and not filled with fabric.
> **DERIVATION HOME.** Type 4's *area* is the difference between the circuit's enclosed area (sized by high-water population, §161f/§161m) and the fabric the *current* population supports — which is exactly §161f's high-water law and §161g's demotion grammar. The land use inside it derives from `terrain` + `institutions` (a brickfield needs clay; a tenter ground needs a cloth industry — hf347 has both, and both are on the plate).
> **VERDICT: PARTIAL, with a specific dividend available.** §239.4 already records the dividend — "a demoted town's circuit outlives the fabric that shrank inside it… the historically exact 'half the walled town is fields'". What is missing is the **positive generator for what fills that ground**. Left unfilled it reads as a bug; filled with generic wash it reads as laziness; filled with *derived land use* it becomes hf347, which is one of the best plates in the corpus. **Proposed: `intramuralVacancy` land-use pass, sourced from terrain + the settlement's own industries.**

---

## §6 · GROWTH SEQUENCE — READING THE HISTORY OUT OF THE PLAN

**★ This is the highest-value section, because ODQ §240 has just adopted epoch generation (core → wall → ring → wall → ring) and this evidence is what calibrates it.**

### §6.1 · HOW MANY EPOCHS A PLATE LEGIBLY SHOWS

**[E, CONFIRMED.]** Counting distinct build epochs legible **without labels** (by grain change, bearing change, plot-width change, or a fossil boundary):

| Tier | legible epochs |
|---|---|
| thorp / hamlet | 1 |
| village | 1–2 |
| town | 2–3 |
| city | 2–4 |
| metropolis | 3–4 |

**Not one studiable plate legibly shows more than four.** hf347, the corpus's three-circuit plate, shows exactly three fabric epochs plus a fourth *pending* one (the surveyed-not-built plots). This directly corroborates §240.2's binding condition — "a village earns zero circuits; a town one; a city may show two vintages; a metropolis three at most" — and supplies the fabric-epoch count alongside the circuit count. **A five-ring settlement would be outside everything the corpus draws.**

### §6.2 · WHAT CHANGES BETWEEN EPOCHS, MEASURED

**[M, CONFIRMED — the within-plate pairs.]** This is the calibration §240.3 needs for the vintage triad:

| Plate | pair | grain (cells across) | φ | dead-end share | X share |
|---|---|---|---|---|---|
| hf26 | old fabric → new quarter | **46.9 → 16.3** (2.9× coarser) | 0.069 → **0.652** | 0.164 → 0.198 | 0.023 → 0.020 |
| hf274 | Oldbank → Newcharter | **47.2 → 26.6** (1.8× coarser) | 0.131 → **0.318** | 0.225 → **0.342** | 0.023 → 0.013 |
| hf239 | vicus → castra camp | 30.0 → 33.8 (≈flat) | 0.074 → **0.585** | 0.189 → 0.140 | 0.028 → **0.088** |
| hf347 | core → outer ring | 17.4 → 9.8 (1.8× coarser) | — ⚠ | 0.182 → 0.200 | 0.000 → 0.000 |

**The pattern is consistent and it has three dials, exactly as the vintage triad predicts:**

1. **GRAIN COARSENS with each newer epoch — by 1.8× to 2.9×.** Newer fabric has bigger plots. This is counter-intuitive if you expect density to rise over time, and it is true because a new quarter is laid out on cheap land at a generous module, while the old core has had centuries of subdivision.
2. **ORDER RISES sharply with a newer *planned* epoch — φ by 2.4× to 9.5×.** But note hf239: the castra grid is the **oldest** epoch on that plate and the organic vicus is the newer one, and φ inverts accordingly. **So order tracks the epoch's FOUNDING MODE, not its age.** This is the correction that keeps the model honest: "newer = more regular" is a *tendency*, not a law, and the actual law is "planned = more regular".
3. **DEAD ENDS RISE in a young epoch that is not yet full** — hf274's Newcharter at 0.342 against Oldbank's 0.225 — because streets are laid before the fabric that would connect them.

### §6.3 · THE FOSSILISED CIRCUIT — the corpus's most reusable growth mechanic

**[E, CONFIRMED at 1500px zoom on hf347.]** hf347 draws the complete vocabulary of a wall that has been outgrown, and it is worth enumerating because **every element is derivable and each is cheap**:

1. **OLD WALL LANE** — the first circuit survives as a **ring street**, drawn slightly wider and in a different pavement tone than the ordinary lanes, running the full former circuit.
2. **WALL STUB** — a surviving masonry fragment, free-standing inside the fabric, drawn at wall weight with rubble hatch.
3. **OLD GATE GAP** — the former gate survives as a **widening and a break in the frontage line** where the ring street meets a radial.
4. **FILLED DITCH GARDENS** — the former ditch survives as a curving ribbon of **long narrow garden plots** immediately outside the old wall line, drawn green, following the ring exactly.
5. **TOWER DWELLING** — former wall towers survive as **circular buildings** embedded in the fabric, drawn as circles where every other footprint is rectilinear.
6. Plot boundaries in the ring immediately outside the old wall are **radial to the old circuit**, because they were laid out against it.

And the structural rule that generates all of it: **radials are older than rings.** The radial streets run continuously through all three circuits; the ring streets are each a fossilised defence. A settlement's oldest continuous geometry is its roads *out*, and its ring geometry is the accumulated record of its walls.

> **RECONSTRUCTION FORM — MECHANISM.** When epoch E's circuit is superseded by epoch E+1's, the old circuit is **not deleted — it is demoted to a street** and its furniture is transformed by a fixed table: `wall→ring street (width = intervallum width)`, `gate→street widening + frontage break`, `tower→circular building footprint`, `ditch→a band of long narrow garden plots on the outer side`, `intervallum→the ring street's carriageway`. Plot bearings in the adjacent ring inherit the old circuit's local normal.
> **DERIVATION HOME.** The **event stream**: §240.3 already makes the wall "a first-class dated EVENT, binding the map to the event stream as truth". A superseded circuit is simply a wall event whose settlement later exceeded it. The transformation table is fixed; what varies is *which* circuit and *when*, and both are dossier facts.
> **VERDICT: MISSING — and it is the single highest-leverage item in this document.** §240 gives us epochs and §239.3 gives the wall temporal primacy, which together mean **we will soon be generating multiple circuits**. Nothing yet says what happens to the *superseded* one. Without this table the second circuit's arrival simply erases the first, and the settlement loses the legible history that is the whole point of the epoch model. With it, every dial in §6.2 gets a visible cause, and hf347 — one of the best plates in the corpus — becomes reproducible in kind. **Proposed: `circuitDemotion` transformation table, run at each epoch boundary.** It costs one pass and it is the difference between a town with rings and a town with a biography.

### §6.4 · WHERE GROWTH ATTACHES, AND HOW A NEW EPOCH RELATES TO THE OLD

**[E, CONFIRMED across hf26, hf274, hf364, hf324, hf347, hf239, hf72.]** Four attachment modes, all derivable:

1. **RING** — growth wraps the existing mass. Requires a circuit to wrap or a roughly isotropic hinterland. hf347, hf121.
2. **RIBBON** — growth extends along a road or a shore. hf138's shore city, hf72's Via Grande spine, hf62's bankside strip. Produced by a strong single axis.
3. **NEW QUARTER BESIDE** — a planned block of fabric laid *next to* the old on fresh ground, at its own bearing, separated by a street or an edge. hf26 (beside the burnt zone), hf274 (across the river), hf364 (over the cleared scars). **This is the mode a planned epoch takes.**
4. **INFILL** — growth consumes backland inside the existing outline. Invisible as extent, visible as grain change and as the extinction of §2.2's green cores.

The relation rule that recurs: **a new epoch does not overwrite the old; it abuts it, and the seam is a street.** hf26's Quartiere Nuovo meets the old fabric along a street; hf239's vicus begins outside the camp gate; hf347's rings are separated by their fossil circuits. The one exception is mode 4, and infill is precisely the mode that *does* overwrite — which is why it is the mode that erases history.

> **RECONSTRUCTION FORM — MECHANISM.** At each epoch, select the attachment mode from the facts, then run the corresponding growth: ring (offset the current outline), ribbon (extend along the highest-weight road/shore axis), new-quarter (place a planned organism on the best adjacent buildable ground with **its own bearing basis**), infill (raise fill share inside existing blocks and consume backland).
> **DERIVATION HOME.** `terrain` and buildable ground (§161's suitability field) constrain which modes are available; `foundingKind`/charter events select new-quarter; `tradeRouteAccess` and the neighbour link select ribbon; `event history` (fire, sack, plague, charter) triggers a replanned quarter; `population` growth *rate* selects infill vs extension — **slow growth infills, fast growth extends**, which is a genuinely derivable and very legible distinction.
> **VERDICT: PARTIAL.** §161d's district-organism law already grows organisms outward from anchors and unions them into an umbrella, and §5.0e's faubourg law handles extramural growth. What is missing is that **the epoch's attachment mode is not currently a derived choice** — the organisms accrete, but nothing decides "this epoch is a planned quarter beside, at its own bearing." That decision is what produces hf26 and hf274, the two most historically legible plates in the studiable corpus. **Proposed: `epochAttachmentMode` derived per epoch, with new-quarter carrying its own bearing basis and φ target.**

### §6.5 · SURVEYED-BUT-NOT-BUILT IS A DRAWN STATE

**[E, CONFIRMED on hf347 ("BUILDING PLOTS" as an empty ruled grid), hf274 ("VACANT PLOTS" ×2), hf324 (a bastide whose grid is perhaps half occupied).]** The corpus draws the *intention* to build: street lines and plot divisions at ghost weight with no buildings on them. This is how a planned foundation actually looks for its first century, and it is the honest answer to "why does our bastide look like a filled-in grid when real ones took two hundred years to fill".

> **RECONSTRUCTION FORM — MECHANISM.** A planned epoch lays its **full** street and plot grid at once, then fills it at an occupancy rate derived from elapsed years and prosperity. Unfilled plots draw in the ghost register (§12.6/§12.8 already define one — the atlas's T-20 recommends a single `ghostInk`).
> **DERIVATION HOME.** `foundingKind` = planned/charter, `founding year` vs current year, `population` vs the plan's capacity, `prosperity` trajectory.
> **VERDICT: MISSING.** Nothing covers partial occupancy of a planned layout. It is cheap (one occupancy rate, one existing register) and it removes the "machine-perfect new quarter" defect *by construction* rather than by jitter — an unevenly-filled grid never reads as machine-made. **Proposed: `plannedOccupancy` = f(years since founding, prosperity), with unfilled plots in the ghost register.**

---

## §7 · DECAY AND SHRINKAGE MORPHOLOGY

### §7.1 · WHAT EMPTIES FIRST — the corpus's answer is LIFO, and it is unambiguous

**[E, CONFIRMED on hf37, hf70, hf121, hf241, hf306, hf217.]** Every decline plate in the corpus empties **the most recently built ground first** and holds the oldest core longest. hf70's inner huddle sits around the forum and cathedral inside a contracted ring while the outer intramural land is fields; hf121's four decay stages are arranged with the live huddle central and the field-boundary stage outermost; hf306's living town is a knot in one corner of a vast dead circuit; hf241 empties from the outside in across its panels.

**Last-in, first-out.** This is both historically right and computationally convenient: **decline is the epoch model run backwards.**

### §7.2 · WHAT SURVIVES LONGEST — four things, in order

**[E, CONFIRMED.]**

1. **The monument**, at full monumental ink and now grossly over-scale for the settlement around it. hf70's cathedral is the clearest tell in the corpus.
2. **The circuit**, long after the fabric that paid for it — bricked gates, standing towers, nothing inside.
3. **The street geometry**, surviving as field boundaries and lanes even where every building is gone (hf241's "street web persisting as field-lane ghosts"; hf306's "ghost avenues as faint lines in grass").
4. **The crossing** — bridge, ford, quay. hf37 and hf121 both keep an intact bridge and a lone extramural inn when the town has failed.

### §7.3 · ★ THE DEMOTION DISCRIMINATOR — how a shrunken settlement differs from one that never grew

The brief calls this load-bearing for our demotion law, and the corpus answers it cleanly. **[E, CONFIRMED by comparing hf70/hf121/hf306/hf37 against hf88/hf91/hf93/hf3.]** A shrunken settlement of N souls differs from a stable settlement of N souls in **six** ways, every one of them derivable from the high-water law:

| # | Signal | Shrunken | Never grew |
|---|---|---|---|
| 1 | **Enclosure : fabric ratio** | circuit encloses 3–10× the occupied area | no circuit, or a circuit that fits |
| 2 | **Monument : settlement scale** | monument sized for the *former* population — 3–5 rungs above tier | monument at its tier's rung |
| 3 | **Street web extent** | street geometry extends far beyond occupied fabric, surviving as lanes and field edges | street web coextensive with fabric |
| 4 | **Intramural land use** | agricultural/industrial ground *inside* the enclosure | fields begin outside the settlement |
| 5 | **Plot-boundary inheritance** | field parcels inside the walls follow the **old street bearings**, producing rectilinear fields at an angle to the surrounding countryside's | field bearings follow terrain and lanes only |
| 6 | **Institutional over-provision** | more churches, more gates, more market space than the population needs; some shuttered or repurposed | provision matches population |

Signal 5 is the subtlest and the most convincing, and it is nearly free for us: **when a block dies, feed it to the field generator on its own bearing**, which the atlas already observed hf70 doing. The resulting field patch is rectilinear and misaligned with the countryside, and the eye reads "this was a town" immediately.

> **RECONSTRUCTION FORM — MECHANISM.** All six fall out of running the epoch stack with a **later epoch left empty** (§240.3's own dividend) plus one addition: dead blocks are handed to the field generator **retaining their bearing and their boundary geometry**. Institutional over-provision falls out of §161n if institutions are scaled at their *founding* rung and not re-derived downward — which is also the historically correct behaviour (buildings do not shrink).
> **DERIVATION HOME.** `population` current vs high-water (§161f), the `event history` that caused the decline (§161g's cause-specific scars), institution `founding year` for the scale rung.
> **VERDICT: HAVE, mostly — §161g's demotion grammar covers 1, 2, 3 and 6 explicitly, and §239.4 records the circuit-outliving dividend. Signals 4 and 5 are PARTIAL:** §161g mentions "grassed foundation lines with ghost streets surviving as field boundaries" but does not say the **dead block inherits its bearing into the field generator**, which is the mechanism that makes signal 5 legible. **Proposed: a `deadBlock→field` handoff that preserves bearing and boundary, plus §5.3's `intramuralVacancy` land-use pass.** Together these two small pieces complete the discriminator.

---

## §8 · SCALE INVARIANTS — what a thorp and a metropolis share

The brief asks which properties are constant across tiers, because those are the ones our generator must **never tier-scale**. Answer, from the measured set:

**INVARIANT [M].** These barely move from village to metropolis:

| Property | village | town | city | metropolis |
|---|---|---|---|---|
| T/Y share (median) | 0.678 | 0.653 | 0.596 | 0.650 |
| X share (median) | 0.011 | 0.020 | 0.007 | 0.016 |
| dead-end share (median) | 0.209 | 0.195 | 0.219 | 0.225 |
| orientation-order φ (median) | 0.085 | 0.119 | 0.069 | 0.095 |
| block elongation (median) | ~2.1 | ~2.1 | ~2.1 | ~2.1 |

**The junction mix, the dead-end rate, the disorder level and the block proportion are TIER-INVARIANT.** A metropolis is not a more ordered village; it is a village's grammar at 100 cells across instead of 30. This is the most useful negative result in the study: **do not scale these with tier.**

**VARIANT [M].** These move monotonically:

| Property | village | town | city | metropolis |
|---|---|---|---|---|
| cells across (median) | 39.2 | 54.5 | 62.0 | **84.3** |
| cells across (range) | 29.0–45.1 | 29.2–65.0 | 25.8–72.0 | 82.1–101.0 |
| width hierarchy p97/p50 | 2.3–3.3 | 2.4–5.9 | 2.7–7.3 | 3.7–4.9 |
| legible districts | 1–3 | 3–6 | 5–9 | 8–14 |
| legible epochs | 1–2 | 2–3 | 2–4 | 3–4 |
| void count ≥4 pw² | 3–6 | 1–20 | 1–24 | 5–15 |

⚠ These grain figures come from **my** hand-set windows and are a partial independent replication of the atlas's T-01, not a re-statement of it: village 29–45 against T-01's 30–50; town 29–65 against 45–80; city 26–72 against 60–95; metropolis 82–101 against the re-pinned 80–120. **My town and city floors sit below T-01's** because several of my windows deliberately sit on a *quarter* rather than the whole settlement. The metropolis band agrees closely and independently.

> **RECONSTRUCTION FORM.** **MECHANISM:** the invariants become **fixed global constants** in the street-graph generator with per-leaf censuses; only the variants take `population` as an input. **DERIVATION HOME:** `population` alone drives every variant (§161f's continuous-scale law is exactly right); the invariants take no input.
> **VERDICT: PARTIAL.** §161f already forbids quantising to tier and grades continuously with population — correct and confirmed. What is missing is the **explicit invariant list**: nothing currently says "these four properties must NOT vary with population", and the natural instinct when a metropolis looks wrong is to reach for exactly those dials. **Proposed: pin the four invariants as tier-independent bands, censused per leaf.** Cheap, and it prevents a whole class of future tuning error.

---

## §9 · ANOMALY AND CHARACTER — the "one weird thing"

The brief asks what generative mechanism would produce a memorable anomaly **without randomness**. The corpus's answer, from the studiable plates, is that **every good anomaly is a collision between two rule systems** — never a perturbation.

| Plate | The one weird thing | The collision that produces it |
|---|---|---|
| hf239 castra-town | the tidy camp grid **frays** into a tangle at exactly two gates | a planned epoch's edge meets an organic epoch's growth pressure, at the points of highest traffic |
| hf26 fire-rebuild | a rigid grid sits at a frank angle to the old town, with a **burnt zone between them** | a replanning event bounded by a fire's actual footprint, which had its own irregular shape |
| hf347 three-circuits | a curving **green ribbon of long thin gardens** runs through solid fabric | a filled ditch — a defensive form surviving into a horticultural land use |
| hf274 twin-bridge | **two of everything** — two markets, two gallows, two quays, one bridge | two jurisdictions sharing one crossing |
| hf331 dual-lordship | a boundary runs *through* the town, and the shambles sit on one side only | ecclesiastical and burghal jurisdiction over one settlement |
| hf72 dumbbell | one long street connecting **two complete town centres** | two viable sites too far apart to merge, joined by ribbon growth |
| hf306 town-in-ruins | the market place sits **inside a roofless basilica** | a ruin large enough to be reused as an enclosure by a later, smaller settlement |
| hf298 siq-hidden-city | the entire unloading economy is jammed **immediately inside one gate** | a transport bottleneck meeting a break-of-bulk requirement |
| hf40 slum-fringe | the shanty belt hugs the wall on **one arc only** | poverty gradient meeting the wall's least valuable frontage |
| hf121 / hf70 | a **wall around fields** | high-water extent meeting a shrunken population |
| hf324 bastide | a market place **larger than the town needs** | a planned capacity meeting an actual population |
| hf235 canals | streets that **dead-end at water** and a fabric with no wall | water-as-street meeting the lagoon-as-wall |

**None of these needs a random number.** Every one is deterministic given two facts that are already in a dossier: two authorities, two sites, a fire's footprint, a bottleneck, a superseded wall, a plan that outran its population.

> **RECONSTRUCTION FORM — MECHANISM.** Personality is **not** a jitter budget. It is produced by letting rule systems **collide without arbitration** — specifically, by (i) allowing two organisms of the same type to coexist when the facts support two (§161e's multiplicity law), (ii) letting an epoch boundary sit where a *historical event's footprint* was rather than on a tidy offset, and (iii) refusing to smooth the seam where two bearing bases meet.
> **DERIVATION HOME.** `powerStructure` (dual authority), the polycentric subseed (two sites), `event history` with **spatial extent** (a fire, a sack, a landslide, a flood each have a footprint), `terrain` bottlenecks, superseded circuits, planned capacity vs population.
> **VERDICT: PARTIAL, with one specific and important gap.** §161e's multiplicity law and §161l's power law already permit the dual-authority anomalies, and §161's subseed law gives the dumbbell. **What is missing is that events do not appear to carry a SPATIAL FOOTPRINT.** A fire, a sack, a flood or a landslide in our event stream is a fact about a settlement, not a shape on it — yet hf26, hf166, hf279, hf302 and hf364 all derive their entire character from the *shape* of what happened to them. **Proposed: `eventFootprint` — a derived, deterministic region attached to spatially-extended events (seeded from the event's own identity plus terrain, so it is stable under the inertia law), consumed by the epoch generator as the boundary of a replanned quarter and by the render as a scar.** This is the mechanism that would let one dossier fact — "the town burned in year 214" — produce hf26's entire composition.
> ⚠ **Owner-gated adjacency flagged, not crossed:** adding a spatial footprint to events touches the event/persistence surface. Recorded as a proposal for the chair, not acted on.

---

## §10 · WHAT ELSE THE PLATES TEACH — dimensions nobody named

Six findings that fall outside the brief's ten headings.

### §10.1 · THE FRONTAGE LINE IS THE CORPUS'S PRIMARY DRAWN OBJECT

**[E, CONFIRMED.]** Looking at any good plate at zoom, what the eye follows is not buildings and not streets — it is the **continuous line where the built mass meets the street**, running the length of a block and broken only at passages. Buildings are subdivisions *behind* that line. This inverts the natural implementation order (place buildings → streets are what's left).

> **MECHANISM:** generate the frontage line as a first-class object per block face, then subdivide behind it. **DERIVATION HOME:** the block face from the street graph; the subdivision from §2.3's plot series. **VERDICT: MISSING** — and it is the same object §2.3 and §2.4 both point at from different directions. Three independent lines of evidence in this study converge on **frontage-first generation**. Recorded as the strongest structural recommendation in the document, alongside §6.3.

### §10.2 · THE CORPUS DRAWS THE PROCESS, NOT ONLY THE PRODUCT

**[E, CONFIRMED.]** Repeatedly the plates show work *in progress*: hf306's mason's yard quarrying the ruin, hf347's brickfield and building plots, hf274's works yard, hf26's rebuild strip with scaffold frames, hf364's cleared bailey. A settlement is drawn as a thing **currently being made**, and this is a large part of why the plates feel alive.

> **MECHANISM:** if the dossier says the settlement is growing this decade, mint the *supply* of that growth — a brickfield/quarry/timber yard sited by terrain, a works yard near the active edge, a rebuild strip inside a recent event footprint. **DERIVATION HOME:** `population` trajectory (growing/stable/declining) + `terrain` (clay, stone, timber) + recent `event history`. **VERDICT: MISSING.** §161b's terraforming law has the visible-work rule ("every terraform leaves its workings legible in ink") which is the same instinct applied to landscape; nothing applies it to **building**. Cheap, high narrative return, and it makes growth visible in a *snapshot*, which matters because §161k ruled the year dimension ships as snapshots rather than animation.

### §10.3 · WITHDRAWN — a finding whose only source was a holdout plate

**This slot held a finding about DESIRE PATHS** (informal worn tracks cutting the corners between formal radiating roads outside a gate). **It has been withdrawn**, because on the exclusion audit its sole source turned out to be a plate in the blind holdout, and the calibration index records it as *the only plate in the corpus that draws unofficial movement* — so there is no second, studiable witness to re-source it from.

The slot is left in place rather than renumbered so the withdrawal is visible rather than invisible. **If a future lane wants this finding, it must come from the holdout's own release, not from here.** Nothing downstream in §12–§13 depends on it.

### §10.4 · SETTLEMENTS THAT MOVED

**[E, CONFIRMED on hf309 (port relocation, geometry only — hf309 is on the lettering scrub list) and hf348-class.]** The corpus draws the **abandoned original** beside the live successor: a stranded quay, warehouses left inland and dry, a portage road linking old to new. The plan carries two settlements, one of them dead.

> **MECHANISM:** a relocation event mints a *second, abandoned* settlement footprint at the old site, rendered in the decay ladder, plus a link road. **DERIVATION HOME:** relocation is an event; the cause (silting, a moved channel, a sack) is in the event stream; the old site's position is derivable from the terrain feature that failed. **VERDICT: MISSING.** Lower priority than the epoch items but recorded because it is a striking, fully-derivable state we do not currently express.

### §10.5 · INSTITUTIONS DUPLICATE UNDER DIVIDED AUTHORITY

**[E, CONFIRMED on hf274 and hf331.]** Two jurisdictions produce **two of the jurisdiction-bearing institutions** — two markets, two gallows, two courts, two prisons — while the non-jurisdictional ones stay single. That selectivity is the realistic part.

> **MECHANISM:** institutions carry a `jurisdictional` flag; when the dossier holds two authorities over one settlement, jurisdictional institutions instantiate per authority and site themselves in their own authority's territory. **DERIVATION HOME:** `powerStructure` + §161l's attribution law. **VERDICT: PARTIAL** — §161e's multiplicity law already permits multiple instances "where facts support", and §161l already requires the real-vs-formal power split to be readable in the drawing. What is missing is the **jurisdictional flag** that says *which* institution types duplicate. Small, and it makes hf331 reproducible.

### §10.6 · THE CORPUS'S OWN PLAN-LEVEL DEFECTS, so we do not inherit them

**[E, CONFIRMED — extending the atlas's §2.4 list on the plan axis specifically.]** Not to emulate:

1. **The polygon circuit with evenly-beaded towers** — survived three corpus rounds and deformed at least eleven plates (ODQ §242.2). It is a *plan* defect, not a decoration one.
2. **The radial-wheel prior in new habitats** — it re-appeared underground (hf193) and in an industrial layout (hf271) after being suppressed in town plans. The lesson recorded in the calibration index generalises: **never arrange a feature class "around" a point.**
3. **Clean single-line district boundaries** (hf40) where gradation over 2–3 blocks is correct — §161e's parcel dithering is our cure and the corpus under-uses it.
4. **Empty blocks / block-wash LOD** (hf25, parts of hf34) — a block outline with no fabric inside. Our op budget will tempt us into exactly this.
5. **Bilateral symmetry in compositions** (hf307's bridge, near-symmetric about mid-span; hf100's near-perfect oval with its even ring streets) — symmetry is a strong "generated" tell in plan just as even spacing is in ornament.

---

# PART 2 — RECONSTRUCTION TRACES

Eight plates traced end to end: the dossier facts that would have to hold, the pipeline sequence, what it would emit, and **where it would diverge**. Divergence is the deliverable. None of these is a holdout plate; hf306 appears on the lettering-scrub list and is traced **on geometry only**.

### TRACE 1 · hf26 town-fire-rebuild — *three grains in one frame*

**Dossier facts required:** tier town; population ~4–6k, stable-to-growing; founding organic; a **fire event with a spatial footprint** covering the town's north-west quarter; prosperity sufficient to fund a replanned quarter; a chartering or lordly authority able to *impose* a plan.
**Pipeline sequence:** substrate (§5.-1) → sites → epoch 0 core (organic, φ≈0.07, grain 47 cells) → wall → epoch 1 organic accretion → **fire event fires; its footprint is marked** → epoch 2 minted as `attachmentMode = new-quarter`, `foundingMode = planned`, own bearing basis, φ target 0.65, grain 16 cells, occupancy < 1.0 → burnt footprint rendered in the decay ladder (foundation lines, ghost streets) → seam street between old and new.
**What we would emit today:** the old organic fabric, plausibly. The wall. Faubourgs.
**WHERE IT DIVERGES — four ways:** (1) **no event footprint**, so the fire has no shape and the burnt zone cannot exist; (2) **no epoch attachment mode**, so a planned quarter beside the old, at its own bearing, is not a thing we choose; (3) **no φ target per epoch**, so the new quarter would either match the old or be a machine lattice; (4) **grain would not differ 2.9× between quarters**, because grain is not currently a per-epoch property. This plate is essentially **unreachable** for us today, and four named mechanisms make it reachable.

### TRACE 2 · hf347 town-three-circuits — *the fossilised circuit*

**Dossier facts required:** tier town, high-water population well above current build-out; three recorded fortification events at three dates; a cloth industry (the tenter ground) and clay (the brickfield); prosperity growing.
**Pipeline sequence:** core → circuit 1 → ring 1 → circuit 2 → ring 2 → circuit 3 → **ring 3 not yet built** → `circuitDemotion` runs at each supersession, converting circuit 1 to Old Wall Lane with its gate gap, tower dwellings and filled-ditch gardens → `intramuralVacancy` dresses the unbuilt outer ring as orchards / closes / tenter ground / brickfield / surveyed building plots.
**What we would emit today:** ODQ §241.3 measured that **4 of 10 walled leaves already carry two concentric circuits** — so we already emit multiple rings. But it also measured that "all rings come from ONE node, ONE input hash, ONE pass — epochs exist in the OUTPUT and are absent from the DERIVATION."
**WHERE IT DIVERGES:** we would draw three rings **with no history between them**. No Old Wall Lane, no tower dwellings, no ditch gardens, no grain gradient between rings, and — the biggest miss — **the outer ring would be either full fabric or blank**, when the plate's whole subject is that it is *neither*. §240's epoch axis (MF-ARCH-2, in flight) fixes the derivation; §6.3's `circuitDemotion` and §5.3's `intramuralVacancy` are what convert that into this plate.

### TRACE 3 · hf72 dumbbell-town — *polycentric by site*

**Dossier facts required:** two viable sites (a defensible crag, a river landing) far enough apart not to merge; a road between them; tier town; a castle institution on the crag; river-trade institutions at the landing.
**Pipeline sequence:** §161's polycentric subseed law finds two strong non-adjacent sites → road connects them first → ribbon development along it → two organism clusters accrete → castle precinct wraps the crag nucleus, a second circuit wraps the river nucleus → the umbrella union is a dumbbell.
**What we would emit today:** this one is largely **reachable** — §161.1's subseed law describes this exact case, and §161d's umbrella union produces the dumbbell outline.
**WHERE IT DIVERGES — three narrower ways:** (1) the **two nuclei should differ in grain and backland** (measured: west 0.126 green vs east 0.028, cells 22.0 vs 24.8) because one is a lordly borough and one a trading one — that difference comes from district wealth and land use, which we have, but it must actually reach the fabric; (2) **Piazza Nuova sits at the join** — a centre minted by the *seam*, which no current rule mints; (3) the spine street is one continuous named artery, which requires §1.4's load-derived width to make it the widest thing on the plate. This is our **best current case**, and it is the right first target.

### TRACE 4 · hf40 slum-fringe-city — *the wealth gradient*

**Dossier facts required:** tier city; strong wealth stratification in the ward data; a wall; a poor population exceeding intramural capacity.
**Pipeline sequence:** district organisms with wealth attribute → grain, backland share and dead-end rate all derived from wealth → §5.0d parcel dithering across the frontier → §5.0e faubourg growth concentrated on the poor arc only → shanty belt outside that arc in the ghost register.
**What we would emit today:** wards with different washes; faubourgs; the wall.
**WHERE IT DIVERGES:** (1) **the poor quarter must be finer-grained, garden-free and dead-end-rich** — measured 0.296 vs 0.215 dead-end share, green share 0.000 vs 0.006 — and today wealth drives *tone*, not *geometry*; (2) the **frontier must dither over 2–3 blocks**, and here we would actually beat the reference, whose clean dividing line is its own recorded defect; (3) the shanty belt must hug **one arc**, which requires the wealth gradient to have a *bearing*, not just a value.

### TRACE 5 · hf331 town-dual-lordship — *two of everything*

**Dossier facts required:** two authorities over one settlement (a bishop and a borough) in `powerStructure`; institutions attributed to each.
**Pipeline sequence:** §161l attribution splits institutions by authority → jurisdictional institutions (market, gallows, court, prison) instantiate **per authority** → each authority's institutions seed their own district organism → the boundary between them is drawn, because it is a jurisdiction, not a character zone → two centres, measured polycentricity 0.910.
**What we would emit today:** one market, one gallows, one set of institutions; wards possibly labelled by owner.
**WHERE IT DIVERGES:** entirely on §10.5's **jurisdictional flag**. Without it we cannot duplicate the right institutions and only the right ones. This is a small mechanism with a very large legibility return, and unlike most items here it needs **no new geometry** — only a flag and a siting rule.

### TRACE 6 · hf306 town-in-ruins (**geometry only — lettering scrubbed**) — *a live town inside a dead city*

**Dossier facts required:** high-water population an order of magnitude above current; a catastrophic decline event; a monumental building surviving; a later small resettlement.
**Pipeline sequence:** epoch stack generated to high-water → all epochs above the current population left **empty** → decay ladder applied by age → dead blocks handed to the field generator **on their own bearings** → surviving monument kept at its founding rung → new small settlement organism minted in one corner with its own modest gate → a masons' yard minted by §10.2 (the process rule) quarrying the ruin.
**What we would emit today:** §161g's ruin ring and outlived monument are already law, and §239.4 already records the wall-outlives-fabric dividend, so we would get a walled town with ruins.
**WHERE IT DIVERGES:** (1) the **market place inside the roofless basilica** — reuse of a ruin as an enclosure — is not derivable by any current rule and is filed in §14 as inspiration; (2) **intramural fields on old street bearings** need §7.3's bearing-preserving handoff; (3) the **living knot in one corner** needs the resettlement to be its own organism with its own anchor, rather than a thinning of the old fabric. Item 3 is the important one: **decline by thinning looks wrong; decline by emptying-plus-a-new-small-organism looks right.**

### TRACE 7 · hf239 castra-town — *a plan fraying into a town*

**Dossier facts required:** founding kind = founded-military; a later civilian phase; a road and a river; the fort's abandonment or demilitarisation as an event.
**Pipeline sequence:** epoch 0 = the camp, `foundingMode = planned`, φ target 0.58, X budget raised (measured 0.088, the corpus's highest), orthogonal bearing basis, vallum et fossa as the circuit → epoch 1 = organic civilian growth, `attachmentMode = ribbon` at the two highest-load gates, φ 0.07, X budget near zero → the forum becomes the market by institutional continuity at the same anchor (§11.1's rebuild-at-anchor).
**What we would emit today:** a founded-military settlement, walled.
**WHERE IT DIVERGES:** (1) the **X-budget must be epoch-scoped** — this is the one place in the corpus where X-junctions are legitimately common, and a global low-X rule would flatten it; (2) the **fraying** must happen at gates weighted by traffic, not uniformly around the circuit; (3) the camp's internal buildings (horrea, principia) are institutions that must survive into civilian use with changed function but the **same footprint** — which §11.1's anchor rule supports but nothing currently expresses as *function change without geometry change*.

### TRACE 8 · hf93 hamlet-street — *the bottom of the ladder*

**Dossier facts required:** tier hamlet; a single through-road; a church; ~20–30 households.
**Pipeline sequence:** substrate → one road → frontage line both sides → plot series at 4–6:1 running back to a back lane → church at one end → no wall, no districts, one street class.
**What we would emit today:** houses along a road.
**WHERE IT DIVERGES:** (1) the **plot series is the entire structure of this plate** — measured φ 0.433, the highest of any organic window, precisely because a single street with a regular toft comb *is* an ordered structure; without §2.3's plot series we emit a scatter and lose the plate; (2) the **back lane** — the corpus draws the plots' rear boundary as a lane, which is the embryo of every later block; (3) grain must **not** be measured here at all (§0.4 calibration 3). This trace matters because it shows the burgage module is **not** a town-and-above feature: it is present at hamlet tier and it is what the whole later block structure grows out of. That is an additional argument for un-deferring §18.5.

### RANKED DIVERGENCES — by how many traces and plates they affect

| Rank | Divergence | Traces affected | Plates affected (studiable, [E]) |
|---|---|---|---|
| **1** | **No plot series / frontage-first generation** (§2.3, §2.4, §10.1) | 1,2,3,4,6,7,8 | most settlement plates at town+ and many below |
| **2** | **Epochs exist in output, not in derivation** — no per-epoch grain, φ, bearing basis, attachment mode (§6.2, §6.4) | 1,2,3,6,7 | every multi-vintage plate |
| **3** | **No `circuitDemotion`** — a superseded wall vanishes instead of fossilising (§6.3) | 2,6,7 | every plate with >1 circuit (~10% of walled) plus every demotion plate |
| **4** | **No junction-type discipline** — X:T unconstrained (§1.1) | all 8 | all |
| **5** | **Wealth drives tone, not geometry** (§1.3, §2.2, §4.2) | 3,4,6 | every stratified settlement |
| **6** | **Events have no spatial footprint** (§9) | 1,6,7 | every stressor and aftermath plate |
| **7** | **No `intramuralVacancy` land use** (§5.3) | 2,6 | every high-water/demotion plate |
| **8** | **No surveyed-not-built state** (§6.5) | 2,7 | every planned foundation |
| **9** | **No jurisdictional institution duplication** (§10.5) | 5 | the dual-authority plates |
| **10** | **No process/works layer** (§10.2) | 1,2,6 | most growing settlements |

---

# PART 3 — GAP ANALYSIS AGAINST OUR CURRENT PROCESS

Read against ODQ §150–§245 on the ledger branch. **Every proposal below is a proposal only; the chair rules.**

## §12 · THE LEDGER

| # | Finding | Verdict | Law / what is missing |
|---|---|---|---|
| §1.1 | T-dominated, X-starved junction mix | **MISSING** | §201.2 gives attachment, not junction *type*; propose `junctionMix` bands + attachment-not-intersection generation |
| §1.2 | φ as the planned/organic dial, per epoch | **PARTIAL** | §5.0, §11.2, §161d name the dial; no metric, no ceiling, no census |
| §1.3 | Dead ends track poverty and water | **PARTIAL** | §201.1b has the cul-de-sac type; nothing ties incidence to wealth |
| §1.4 | Width from graph load, not a class ladder | **PARTIAL** | §11.2/§11.3 + atlas GAP-C give classes; source should be betweenness |
| §1.5 | Grain = f(age, wealth, use), not radius | **PARTIAL** | corrects atlas GAP-B: keep radial falloff as census, forbid as generator input |
| §2.1 | Block shape bands | **HAVE + bands missing** | §239.1 is exactly right; add elongation/solidity/area-ratio bands |
| §2.2 | Backland core as a derived object | **PARTIAL** | §203 arm 2 gives fill *share*, not fill *structure* |
| §2.3 | Plot series with clumped rhythm, corner plots | **MISSING** | §18.5 deferred — **recommend un-deferring** |
| §2.4 | Block silhouette is a first-class object | **MISSING** | = atlas GAP-D, independently confirmed from plan structure |
| §3 | Module + outlier budget; bearing inherited from street | **PARTIAL** | §161n ladders outliers; ordinary fabric's two-level structure and the bearing rule are missing |
| §4.2 | Fields over a matrix, no tiling, dithered frontiers | **HAVE** | §161d + §161e + §167 — strongest confirmation in the study |
| §4.2 | District legibility discriminator | **PARTIAL** | = atlas GAP-H; this study supplies the measured band (≥1.4× block area or ≥1.3× grain) |
| §4.3 | Residential matrix everywhere | **HAVE** | §161e, corpus-confirmed without exception |
| §5.1–2 | Six centre types; second authority mints second centre | **PARTIAL** | §161 subseed + §161n ladder exist; typology and the authority rule missing |
| §5.3 | Four void kinds; intramural vacancy land use | **PARTIAL** | §239.4 records the dividend; the positive generator is missing |
| §6.1 | ≤4 legible epochs | **HAVE** | corroborates §240.2's ring counts; adds the fabric-epoch count |
| §6.2 | Per-epoch grain / φ / dead-end deltas, measured | **PARTIAL** | §240.3 predicts the vintage triad; this supplies its numbers and one correction (order tracks founding mode, not age) |
| §6.3 | **`circuitDemotion` — the fossilised circuit** | **MISSING** | §240 + §239.3 make multi-circuit imminent; nothing says what happens to the old one |
| §6.4 | Epoch attachment mode | **PARTIAL** | §161d accretes; the mode is not a derived choice |
| §6.5 | Surveyed-not-built | **MISSING** | cheap; removes the machine-grid defect by construction |
| §7.1–2 | LIFO emptying; four survivors | **HAVE** | §161g |
| §7.3 | Demotion discriminator, six signals | **HAVE (4) + PARTIAL (2)** | §161g covers 1,2,3,6; bearing-preserving dead-block handoff and intramural land use missing |
| §8 | Four tier-INVARIANTS | **PARTIAL** | §161f grades continuously; the invariant list is unstated and is exactly what tuning would wrongly reach for |
| §9 | Anomaly = rule collision; **events need footprints** | **PARTIAL** | §161e/§161l permit the dual-authority cases; `eventFootprint` missing ⚠ owner-gated adjacency |
| §10.1 | Frontage-first generation | **MISSING** | three independent lines of evidence converge here |
| §10.2 | The works layer | **MISSING** | §161b has the instinct for landscape, not for building |
| §10.3 | *(withdrawn — sole source was a holdout plate)* | — | see §10.3 |
| §10.4 | Settlements that moved | **MISSING** | lower priority; fully derivable |
| §10.5 | Jurisdictional duplication | **PARTIAL** | §161e multiplicity + §161l attribution; needs the flag |

## §13 · THE GAPS RANKED BY LEVERAGE

Ranked by *plates affected × cost of omission*, for the chair.

**1 · FRONTAGE-FIRST GENERATION AND THE PLOT SERIES (§2.3, §2.4, §10.1; §18.5 currently deferred).** Three independent findings converge on one object. It is what makes a block read as fabric instead of a bag of rectangles, it is present from hamlet tier upward, and it unlocks the block silhouette, the backland core, court frequency and district legibility as side effects. **This lane's strongest scope recommendation, and it agrees with MF-S1's.**

**2 · THE EPOCH AXIS CARRYING GRAIN, φ, BEARING AND ATTACHMENT MODE (§6.2, §6.4).** §240 is adopted and MF-ARCH-2 is building the version/epoch axis now. The axis will be structurally correct and *visually inert* unless each epoch also carries the three dials the corpus measurably changes between epochs. The numbers are in §6.2 and are ready to use.

**3 · `circuitDemotion` — THE FOSSILISED CIRCUIT (§6.3).** Highest leverage per unit cost in the document. One transformation table, run at each epoch boundary. Without it, multi-circuit settlements lose exactly the history the epoch model was adopted to express.

**4 · JUNCTION-TYPE DISCIPLINE (§1.1).** Affects every leaf. A generator meeting §201 and §202 perfectly can still emit an all-X lattice, and an all-X lattice reads as generated at a glance. Cheap to census.

**5 · WEALTH MUST DRIVE GEOMETRY, NOT ONLY TONE (§1.3, §2.2, §4.2).** Grain, backland extinction and dead-end rate are all measurably wealth-driven, and all three are currently expressed as ward wash.

**6 · `eventFootprint` (§9).** The mechanism behind most of the corpus's memorable anomalies. ⚠ Touches the event surface — flagged as owner-gated adjacency, proposed not acted on.

**7 · `intramuralVacancy` + BEARING-PRESERVING DEAD-BLOCK HANDOFF (§5.3, §7.3).** Completes the demotion discriminator and gives §239.4's recorded dividend something to actually draw.

**8 · SURVEYED-NOT-BUILT OCCUPANCY (§6.5).** Removes the machine-perfect-grid defect by construction rather than by jitter.

**9 · CENTRE TYPOLOGY + SECOND-AUTHORITY-MINTS-SECOND-CENTRE (§5.1, §5.2).**

**10 · JURISDICTIONAL INSTITUTION DUPLICATION (§10.5).** Smallest item on the list; needs a flag, not geometry.

**11 · THE WORKS LAYER (§10.2) AND MOVED SETTLEMENTS (§10.4).** Real, derivable, and correctly last. (§10.3 was withdrawn on the exclusion audit — see §10.3.)

## §13.4 · ONE METHODOLOGICAL FINDING FOR FUTURE LANES

**Three auto-detectors for "where is the settlement on this plate" all failed** — ink density, ink-skeleton junction density, and border-connected open space. The cause is that the corpus's hatched countryside shares both the **luminance** and the **ink density** of built fabric; only the *shape* of the ink differs, and that difference is not robust across 222 plates of varying style. **Any future lane measuring corpus geometry should budget for hand-set windows and should not trust an auto-hull.** The failure is recorded here so the next lane does not re-pay for it. Related and already known: ODQ §244.5's thorp-grain artifact is the same family — an instrument confidently measuring the wrong thing.

## §14 · INSPIRATION, NOT YET DERIVABLE

Filed honestly rather than dressed as rules. Each is something the corpus does well that **no dossier fact I can identify would drive**.

1. **A ruin reused as an enclosure** — hf306's market inside the roofless basilica, its amphitheatre converted to garden terraces. Would need a notion of a ruin's *usable enclosed volume*.
2. **The specific charm of a mis-shaped block** — a wedge, a swallowed lane. Our version must come from §9's collisions; the corpus's comes from a model's hand, and I cannot derive the difference.
3. **Named micro-features that imply a story** — hf347's "Crown Inn" appearing at two ends of the same lane. Our truth layer names things correctly, which is better; but the *density* of incidental named detail is a taste call, not a derivation.
4. **Which of six centre types "feels right" for a given town** beyond the causal rules in §5.1. The rules cover most of it; the residue is taste.
5. **The corpus's willingness to leave large areas quiet.** Several of the best plates have a whole sector doing very little. I could not find a derivation for restraint, and I suspect it is a composition judgment rather than a settlement fact.

---

## §15 · WHAT THIS LANE DID NOT DO

Stated affirmatively so nothing is re-found as a gap.

- **No holdout plate was opened, measured, or cited.** 91 excluded.
- **No lettering or naming observation** is drawn from the 35 scrub-list plates; hf306, hf298 and hf309 are used for geometry only and are marked as such at each use.
- **The atlas was not edited** and none of its figures is restated as mine; where I overlap a target I name it (T-01, T-03, T-04, T-05, T-08, T-17, T-18, GAP-B, GAP-D, GAP-H) and state what I add or correct.
- **The context half is untouched** — geography, water, walls as defence, edges, institution siting, circulation and regional morphotypes are lane MF-S3b's, and are cross-referenced, not duplicated.
- **Grain below village tier is not reported.** The instrument cannot measure it (§0.4 calibration 3) and the two thorp/hamlet rows in the data carry `grain_valid:false`.
- **hf347@core's φ (0.707) is not used** in any conclusion; 11 nodes is too few.
- **The green-backland measure is used one-way only** — a high score evidences backland, a low score does not disprove it (§2.2).
- **No corpus-wide incidence counts** were minted for features requiring per-plate inspection (e.g. "how many plates show two circuits"); where such a figure is needed I cite the existing record (§240.2, atlas T-10) rather than inventing one.
- **`eventFootprint` was flagged, not designed** — it grazes the event/persistence surface, which is owner-gated.

**MF-S3a ends here. Read-only throughout: no git writes, no memory writes, no edits outside this file and the `MFS3a-*` instruments and JSON beside it.**
