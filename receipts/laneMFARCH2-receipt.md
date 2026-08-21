# Lane MF-ARCH-2 — THE EPOCH / VERSION AXIS (ODQ §239 / §240 / §241.6): receipt

**Lane MF-ARCH-2 (Opus 5), 2026-08-17, under the FEATURE-LAW FREEZE, on MF-ARCH's tree.**
**Touched:** the sandbox only. **NO git tree write, NO repo gate, NO branch move, NO memory
write, NO state-mutating git command of any kind.** The one git command used was the read-only
`git show refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md` the brief specifies.
Every write went to `mf-proto/build-out/**`, `mf-proto-out/arch2/**`, the disposable
`laneMFARCH2-tip` overlay, and `MFARCH2-*` scratch files.

---

## §0 · THE HEADLINE, STATED FIRST

> ⭐⭐⭐ **ALL EIGHT DERIVATION CYCLES ARE GONE. THE PIPELINE IS ACYCLIC AT BINDING GRANULARITY
> AND AT FIELD GRANULARITY, MEASURED BY MF-ARCH'S OWN INSTRUMENT — and the version-naming half
> of the cure moved NOT ONE BYTE (determinism digest byte-identical across it).** `wallCycle.js`
> has been DELETED: with the axis explicit its bounded solve had nothing left to solve.

> ⭐⭐⭐ **AND THE 6.8 % WENT TO ZERO BY CONSTRUCTION. MF-ARCH measured 1,331 of 19,563 drawn
> bodies standing outside the circuit traced from the umbrella they helped form. It is now
> 0 of 15,176 epoch members on every walled leaf**, with each circuit's own containment residual
> reported by the derivation and pinned at 0. Nothing was clipped: 4,607 bodies are extramural
> **by derivation** — the suburb the last wall left outside, which is §5's "suburbs sprawl
> outside the gates" arriving as a consequence.

| the measure | MF-ARCH | **MF-ARCH-2** |
|---|---|---|
| distinct derivation cycles | **8** | **0** |
| write-backs in the assembly | 18 (9 closing a cycle) | **4** (0 closing a cycle; all accumulator `Map.set`) |
| divergence sites (read → WRITE → read) | 8 of 13 field write-backs | **0 of 0** — the class is structurally impossible |
| widest cycle, binding / field granularity | 25 stages / 24 bindings | **0 / 0** |
| bodies outside the circuit they helped form | **1,331 of 19,563 (6.8 %)** | **0 of 15,176** |
| epochs in the DERIVATION | none — one node, one hash, one pass | **one ring per epoch, epoch index on the ring, ladder in the input hash** |
| hand-minted fork keys dropping the reroll salt | **5 of 12** | **0** — cured, ratchet re-frozen at 4 + 1 |
| bounded solvers in the fabric | 1 (`wallCycle.js`) | **0** |

**AFTER (every figure executed this session, at my tip, after the final edit):**

```
vitest (lane config, bare)               Test Files 7 passed (7)  Tests 162 passed (162)
                                         = MF-ARCH's 152 + 10 NEW; ZERO pins re-recorded
cross-process determinism                10 processes, identical=10 mismatched=0
                                         87da9c41a892a3d764c17f20728dc94437e1d868ac5f7589a46df545c1a7bf7c
cross-ENGINE determinism (4 V8 modes)    1 distinct digest — see §7
§17 / §17.4 / §205A / §200 drawn census  0 / 0 / 0 / 0 over 23,391 bodies, AREA-TRUE
§202 landlocked · §201B orphan streets   0 · 0 — b8b's and MF-ARCH's wins PRESERVED
§240.1 containment residual, every ring  0 on every ring of every walled leaf
epoch members outside their own circuit  0 of 15,176
op ceiling (§217 per-tier ratchet)       ALL 96 RENDERS UNDER THEIR TIER CEILING
purity scan (comments stripped)          Math.random/Date/localeCompare/Math.pow/trig — NONE
sizeBaseline (lane instrument)           MAX 790 (buildFabric.js) against 800 — UNDER (ARCH: 793)
SCC · module import graph                43 nodes 151 edges — ACYCLIC
SCC · stage graph (binding granularity)  129 nodes 446 edges — 0 NON-TRIVIAL SCCs
SCC · stage graph (field granularity)    364 nodes 847 edges — 0 NON-TRIVIAL SCCs
```

**Deliverables**

- **items 1, 2, 3 DELIVERED WHOLE; item 4 DELIVERED as the shared quantum + the three hash
  tiers with their counterfactual; item 6 DELIVERED as far as one machine allows; item 5
  HANDED OFF with cause (§9).**
- `src/domain/townMap/fabric/epochAxis.js` — **NEW.** The epoch ladder, the containment closure.
- `src/domain/townMap/fabric/lateGround.js` — **NEW.** The ground law's late passes, extractable
  only because the version axis removed their write-backs.
- `src/domain/townMap/fabric/wallCycle.js` — **DELETED.**
- amended: `buildFabric.js`, `walls.js`, `wallCircuit.js`, `builtUmbrella.js`, `leafCensus.js`,
  `fabricGeometry.js`
- `tests/domain/townMapWallCircuit.test.js` — **+8 pins** (24 → 32 titles), 1 titled
  counterfactual + 3 inline ⛔ arms
- `tests/lint/derivationGraph.walker.test.js` — **+2 pins** (11 → 13 titles), both
  counterfactual; the declared cycle roster is now **EMPTY**, and the fork-key ratchet re-frozen
- instruments: `MFARCH2-scc.mjs`, `MFARCH2-epoch.mjs`, `MFARCH2-facts.mjs`,
  `MFARCH2-hashtiers.mjs`, `MFARCH2-engines.mjs`, `MFARCH2-render.mjs`, `MFARCH2-battery.mjs`,
  `MFARCH2-det.mjs`, `MFARCH2-drawn.mjs`, `MFARCH2-diag[2-6].mjs`, `MFARCH2-sync.sh`
- plates: `mf-proto-out/arch2/` — 32 (16 leaves × parchment + darkFantasy) with `manifest.json`
- reports: `MFARCH2-scc-final.log`, `MFARCH2-battery-final.log`, `MFARCH2-det-final.log`,
  `MFARCH2-engines.log`, `MFARCH2-hashtiers.log`, `MFARCH2-suite-final.log`

---

## §1 · ITEM 1a · THE VERSION AXIS AS NAMING — AND IT MOVED NOT ONE BYTE

MF-ARCH's finding was that all eight cycles are **two versions of one artifact sharing one
binding name**. The first half of the cure is therefore not geometry at all: it is giving each
version its own name. That was done first, on purpose, so that any later shift could be
attributed to the epoch derivation alone rather than to a rename.

| the write-back | the two versions, now named |
|---|---|
| `builtUmbrella.partition ← wallCycle` | `builtUmbrella` → `umbrellaWalled` |
| `packed.parcels ← ground` | `packed.parcels` → `parcelsLawful` → `closing.accessible.parcels` |
| `lod.masses ← ground` | `lod.masses` → `massesLawful` → `drawn.masses` |
| `shanty.huts ← ground` | `shanty.huts` → `hutsLawful` → `swept.huts` → `drawn.huts` |
| `fabricWeb.squares ← facedSquares` | `fabricWeb` → `facedWeb` |
| `builtUmbrella.greens ← facedGreens` | `umbrellaWalled` → `umbrellaFaced` |
| `shanty.huts ← ground2` | the law's pass 2 — `swept` |
| `stateMarks.bodies ← ground3` | the law's pass 3 — `stateMarksSwept` |
| `relief.waterStrokes` (a forward edge) | `relief` → `reliefDrawn` |

**RESULT, EXECUTED, BEFORE ANY GEOMETRY WAS TOUCHED:**

```
determinism digest  c7d922f6631e718a8ba4f0e09471002cc2396bbaced99dba3e0652552560e480
                    ⭐ BYTE-IDENTICAL TO MF-ARCH's AND MF-B8b's
SCC · stage graph   129 nodes 443 edges — 0 NON-TRIVIAL SCCs (from 2 blobs of 25 and 2)
write-backs         18 → 5, of which 0 close a cycle (from 9)
suite               154 passed, ZERO re-recorded
```

⭐⭐⭐ **THE CLASS, AND IT IS THE WAVE'S CHEAPEST LESSON: EIGHT CYCLES IN A PIPELINE WERE WORTH
EXACTLY NINE `const` DECLARATIONS.** The cycles were never in the derivation; they were in the
naming. Everything expensive in this wave came afterwards, from making the epochs REAL.

### §1.1 · ⛔ AND FIVE MORE WRITE-BACKS WERE HIDING WHERE NO SCC COULD SEE THEM

`censusLeaf` assigned its survivors straight back into its caller's `packed`, `lod`, `shanty`
and `faubourgs`. Those are five real write-backs on artifacts the assembly had already
published — and **MF-ARCH's instrument could not report one of them**, because a stage graph
extracted from `buildFabric` stops at the call.

⭐⭐⭐ **THE CLASS: A WRITE-BACK PERFORMED INSIDE A CALLEE IS INVISIBLE TO THE CALLER'S CYCLE
ANALYSIS.** The census now RETURNS its version (`closing.accessible`) and takes the artifact
ARRAYS as arguments rather than the containers that hold them — taking `packed` whole is what
made assigning back into it look natural. A walker arm pins that `censusLeaf` contains no
assignment into a parameter's field, and carries the shape it forbids so the arm is not vacuous.

### §1.2 · ⭐ A STAGE THAT WRITES BACK CANNOT BE EXTRACTED; A STAGE THAT RETURNS A VERSION CAN

`lateGround.js` (43 effective lines) exists only because of the rename. While the late ground-law
passes assigned into `shanty`, `faubourgs` and `stateMarks` they had to sit inside
`buildFabric`'s scope to reach those bindings. Once each returns a version they are ordinary
functions, and `buildFabric.js` came down from 801 to 790 effective lines — **which is the
margin the epoch work then spent.** MF-B8b called its own forced decomposition "a benefit
disguised as a cost"; this one was the enabling step.

---

## §2 · ITEM 1b · THE EPOCH AXIS, BUILT (ODQ §240)

### §2.1 · WHAT WAS ACTUALLY THERE, AND IT WAS WORSE THAN "MISSING"

MF-ARCH reported the epochs as present in the OUTPUT and absent from the DERIVATION. Reading the
trace shows the sharper version: **the older ring was `shrinkAbout(todayOutline, centroid,
ratio)` — a SCALED COPY of the modern silhouette.** Two rings drawn that way share every bay and
lobe; they tell a reader nothing except that somebody scaled a polygon. `walls.js` names exactly
this defect (§157, "a concentric decoration") in its own comment — about a *different* arm, four
lines below the arm that was doing it.

⭐ **AND A SECOND FINDING FELL OUT OF READING `wallVintageRatio` PROPERLY: ITS NUMERATOR IS A
CONSTANT.** `atBuild = FOOTPRINT_R × √0.210` is the TOWN THRESHOLD, fixed for every settlement,
so the recorded wall year only ever decided WHETHER a vintage exists — never how large it was.
Four waves consumed that function as a per-settlement measurement of growth. ⭐ **THE CLASS: A
FUNCTION WHOSE NAME DESCRIBES ITS CALLERS' BELIEF RATHER THAN ITS CODE SURVIVES EVERY REVIEW
THAT READS THE NAME.** The honest half is kept and generalized (§2.2).

### §2.2 · THE LADDER — RING COUNT DERIVED, NEVER A KNOB (§240.2, binding)

A circuit is raised when a settlement **passes a tier threshold** — the moment the wall is also
the charter's proof, which is `walls.js`'s own material precedence read forward. §5's footprint
bands supply the extent at each threshold as arithmetic:

```
extent(t) = FOOTPRINT_R × √(TIER_PROFILE[t].footprint[0]) ÷ today's built radius
town 258.5u   city 352.2u   metropolis 429.5u
```

Three gates, all facts, none of them a dial:

1. **THE VINTAGE IS THE GATE.** No recorded founding age ⇒ ONE circuit on today's fabric,
   UNDERSTATED rather than invented (`walls.js`'s own standing rule, preserved).
2. **A LATER CIRCUIT IS EARNED, NOT MERELY PERMITTED**: the previous ring must enclose ≤ 0.86 of
   today's extent — the single test `walls.js` already applied, now applied at every step.
3. **THE TIER CAPS HOW MANY A SETTLEMENT MAINTAINS AT ONCE** (`TIER_CIRCUIT_CAP`).

⭐⭐ **AND WHEN THE CAP BINDS, A SETTLEMENT KEEPS ITS CURRENT CIRCUIT AND REMEMBERS ITS FIRST.**
That is history rather than convenience: the intermediate ring is the one that got demolished and
built over as the city expanded past it, while the first survives as the change of GRAIN §11.1
draws and the last survives because it is still the wall.

**MEASURED, EVERY WALLED LEAF — AND EVERY RING COUNT IN THE CORPUS IS PRESERVED:**

| leaf | tier | rings | epoch extents | ladder |
|---|---|---|---|---|
| town · siege · plague · famine | town | 1 | 0.836 → suburb | 1 circuit, cap 1 |
| polycentric | town | 1 | 0.840 → suburb | 1 circuit, cap 1 |
| city · migration | city | 2 | 0.660 · 0.899 → suburb | 2 circuits, cap 2 |
| metropolis | metropolis | 2 | 0.585 · 0.972 → suburb | 3 earned, **1 absorbed**, cap 2 |
| highwater | city (demoted) | 2 | 0.734 · 1.000 | 2 circuits, cap 2 |
| year-100 | town | 1 | 1.000 | vintage unknown — understated |
| thorp · hamlet · village · mountain · fjord · year-018 | — | 0 | one unwalled epoch | — |

⛔ **§240.2 PERMITS A METROPOLIS THREE AND I AM DRAWING TWO, DELIBERATELY, AND THE THIRD IS
DERIVED RATHER THAN DENIED.** The ladder computes the metropolis's three thresholds
(0.585 / 0.797 / 0.972); the cap withholds the middle one. Two measured reasons, both stated in
the module: the §217 metropolis op ceiling stands at 9,700 with 83 primitives of headroom and a
third circuit with its towers, gates and ditch does not fit; and a new visible ring is a FEATURE
under the §234 freeze. **The derivation is kept, the drawing is capped, and the CAP is the thing
to lift — not the rule.** (J-A2-3.)

⚠ **§240.2 SAYS "A VILLAGE EARNS ZERO CIRCUITS" AND THIS MODULE DOES NOT ENFORCE IT.** A walled
village is the LANDED MODEL's decision (`meta.hasWalls`), and refusing a circuit the model
asserts would break the one-decider rule this programme is built on. The tier caps the number of
circuits a settlement MAINTAINS; whether there is a wall at all remains the dossier's. **No
walled leaf in the corpus is below town tier, so nothing in the corpus tests the difference.**

### §2.3 · THE CIRCUIT OF EPOCH E IS TRACED FROM EPOCH E's OWN FABRIC

`builtUmbrella.epochCircuitRing` cuts the SAME cells the built umbrella was made from at the
epoch's extent and closes them at the SAME `WALL_CLOSE_FRONTAGES` radius. The old circuit
therefore has its own shape — its own notches cut across, its own bays kept — and the two
vintages read as two different towns. §240.3's vintage triad falls out of this for free.

⚠ **THE EXTENT CUTS CELLS, NOT WHOLE BODIES,** deliberately: a block run straddling the epoch
boundary is exactly the block a wall was driven through, and the closing then decides whether the
circuit walks round it or cuts the chord — the wall's own economics answering, not a tie-break.

**A pin asks the question a scaled copy would fail:** the metropolis's two rings are compared as
normalized radius profiles (scale removed) and must NOT be the same shape.

### §2.4 · ⭐⭐⭐ "COMPLETELY BOUNDS IT" — FOUR WRONG ANSWERS BEFORE THE RIGHT ONE

This is the part of the wave that cost the most and taught the most. Each spelling was executed
and measured; each is recorded because each is a class.

| attempt | measured | the class it taught |
|---|---|---|
| radial max about the body's centroid, one push per angular sector | ⛔ pushed facets out by up to **251 view units** on a 392-unit city | ⭐ **A RADIAL REPAIR ASSUMES A STAR-SHAPED SUBJECT, AND A TRACED TOWN OUTLINE IS NOT ONE.** |
| local push: any facet inside the body moved back onto its boundary | ⛔ **141 of 15,168** bodies still walled out | ⭐ **A CONTAINMENT PROVED AT THE VERTICES IS NOT A CONTAINMENT OF THE POLYGON** — the chord between two outside vertices still cuts in. |
| + push each edge out by the body's deepest excursion, along the OFFENDER's direction | ⛔ **33** epoch points still outside a DRY metropolis ring | ⭐ **A REPAIR THAT TAKES ITS DIRECTION FROM THE OFFENDER RATHER THAN FROM THE BOUNDARY CAN FAIL TO REPAIR** — a direction nearly parallel to the edge slides the vertex ALONG the curtain. (The §232 lesson, read from the other side.) |
| + push along the vertex bisector | ⛔ **1–2 points per ring** on four leaves | ⭐ **A CORNER MOVED ALONG ITS BISECTOR DOES NOT TRANSLATE ITS EDGES BY THE SAME DISTANCE** — the travel is short by a cosine. |
| ⭐ **the right answer** | **0** | see below |

**THE RIGHT ANSWER HAS THREE PARTS, AND THE FIRST IS THE ONE THAT MATTERS:**

1. ⭐⭐⭐ **A CONTAINMENT CLAIM MUST BE MADE AT THE RESOLUTION THE BOUNDARY IS ALLOWED TO HAVE.**
   A 20-facet stone curtain **cannot** contain a 2,300-point outline exactly — the polygon has no
   degrees of freedom left, and every local repair above was trying to buy them. FORM BY KIND
   (rule 5) says a stone curtain runs tower-to-tower in straight-ish runs, so **the chord across
   a bay is the LAW, not an artifact.** The epoch is therefore `resampleClosed(body, facets)` —
   the epoch AT THE WALL'S OWN RESOLUTION — and the fabric between that hull and the raw body is,
   by derivation, the next epoch. Nothing is clipped; ground is attributed.
2. **TERRAIN SERVICE IS SUBORDINATE TO CONTAINMENT.** The pull searches ±1.5 margins and only one
   is offset back, so an unguarded pull seats a facet INSIDE the fabric it bounds — the origin of
   MF-ARCH's 6.8 %. A candidate standing in the epoch is now refused: **the wall may climb the
   rise, it may not walk through the town.**
3. **THE CLOSURE RUNS LAST AND ON A DENSIFIED EPOCH**, because the outward offset and the
   corner-cutting smooth both run after the pull and both can lose ground.

⚠ **THE CLOSURE IS A CAPPED SWEEP (6), NOT A SOLVER, AND THE DIFFERENCE IS WHY IT IS ADMISSIBLE
IN A WAVE THAT DELETED ONE.** Each round only ever moves vertices OUTWARD, so the sequence is
monotone and terminates; a round that moves nothing stops it. There is no convergence criterion
and no tolerance — **and every circuit publishes its own `containmentResidual`, pinned at 0**, so
a cap that was ever too small reds a pin instead of shipping a wall that does not bound its town.

### §2.5 · ⛔⛔ I RECORDED A MECHANISM AS REFUTED BEFORE IT WAS

The densified-epoch closure was measured at "32 bodies before, 32 after" and I **removed it as
machinery that does nothing**, with a comment saying so. It was measured against a population
**dominated by bodies on the half-ring's water flank** — ground no closure can or should reach,
because the river is the fourth wall. With that exemption applied the same change moves the
number from 1 to 0. It is back, and the comment now records the correction rather than the error.

⭐⭐ **THE CLASS: A NEGATIVE RESULT MEASURED AGAINST A CONFOUNDED POPULATION IS NOT A NEGATIVE
RESULT.** This is MF-ARCH's "comparing two predicates means varying one thing" from the other
side, and it nearly cost a real cure.

### §2.6 · ⛔ AND THE HALF-RING EXEMPTION WAS A TOLERANCE UNTIL IT WAS A RULE

My first residual test exempted points within 1.1 water widths of the centreline — the half-ring
filter's own threshold. It left one point convicted on the city, because **the dropped arc
bulges**: ground the river plainly defends can sit further from the line than the filter's
threshold. Measured on the failing bodies: **8 to 77 units from the centreline.** Tuning the
number to fit them is exactly what this programme calls a defect.

⭐⭐ **THE CLASS: AN EXEMPTION EXPRESSED AS A TOLERANCE IS A SECOND SPELLING OF THE RULE IT
EXCUSES.** The test is now the rule itself — *the closed circuit contained this point and only
the water flank dropped it* — for which the ring publishes `closedPolygon`.

### §2.7 · THE RESULT, PER LEAF

```
leaf         bodies  rings  E-members  OUTSIDE OWN CIRCUIT  suburb
town           1562      1        998        0 ✔               564
city           2458      2       1927        0 ✔               531
metropolis     4016      2       3628        0 ✔               388
polycentric    1500      1        923        0 ✔               577
highwater      1549      2       1357        0 ✔               192
siege          1511      1        998        0 ✔               513
plague         1563      1        998        0 ✔               565
famine         1562      1        998        0 ✔               564
migration      2458      2       1927        0 ✔               531
year-100       1604      1       1422        0 ✔               182
⇒ 0 of 15,176 epoch members outside their own circuit  (MF-ARCH: 1,331 of 19,563)
⇒ 4,607 bodies EXTRAMURAL BY DERIVATION — the suburb, as a consequence
```

⚠ **THE CENSUS'S EPOCH ASSIGNMENT IS A FACT ABOUT THE FABRIC, NEVER "IS IT INSIDE THE RING".**
A body belongs to the innermost epoch whose **hull** contains it — the fabric the ring was traced
FROM, one derivation step BEFORE the ring. Defining membership by the ring would be the
self-referential pin class (a set defined by the predicate it is then tested against), and the
"0" would be worth nothing.

⚠ **AND "HELD" MEANS BY ITS OWN CIRCUIT *OR ANY LATER ONE*, WHICH IS THE LAW AND NOT A
SLACKENING.** MEASURED on the city fixture: one market solid sits **15 units inside epoch 0's
hull and 2.5 units outside epoch 0's ring**, while standing 169 units inside the city wall. The
old wall was built through or past it; the town it stands in is the later one. The strict
per-ring claim — every point of an epoch's own boundary inside its own ring — is pinned
separately and reads **0 on every ring of every walled leaf and every fixture.**

---

## §3 · ITEM 2 · `wallCycle.js` IS DELETED

MF-B8b built it as §234.2's "bounded deterministic solve inside a real cycle" and wrote its cut
edge into its own header. With the version axis explicit there is no cycle to cut: the circuit is
derived from an epoch complete before it, and district space is partitioned at the working ring
and published under its own name. **Both are forward edges.** `wallStandingFor` moved to
`wallCircuit.js` (the node's own first input belongs with the node); `partitionAtTheWall` is
called directly.

**The proof that the deletion is safe is the SCC report, not the argument:** 0 non-trivial SCCs
at both granularities with the module in the bin, and the walker's declared-cycle roster is now
**empty** with a counterfactual that plants MF-ARCH's exact write-back back into the real
assembly source and asserts the walker convicts it.

---

## §4 · ITEM 3 · THE LATENT FORK-KEY SALT DEFECT, CURED (§241.5b)

Seven `buildFabric.js` sites minted a key by hand; **five dropped the reroll salt** and a sixth
re-added it as `|v${variant}` — a THIRD spelling of a rule that already had two. All seven now go
through `fabricForkKey` / `keyedRandom`; the file mints none.

| key | activity, stated | after |
|---|---|---|
| `${seed}\|meander` (×2) | **LATENT** — the trace's own inputs carry the variant | `fork('meander')` |
| `${seed}\|coast\|i` | ⛔ **ACTIVE** — its input is the landed model's two-point path, variant-invariant, so the jitter was identical at every reroll | `keyedRandom(seed,'coast','jitter',i,{variant})` |
| `${seed}\|umb` | **LATENT** | `fork('umb')` |
| `${seed}\|built-umb` | **LATENT** | `fork('built-umb')` |
| `${seed}\|built\|wall` | **LATENT** | `fork('built\|wall')` |
| `${seed}\|colonize\|v${variant}` | salted BY HAND | `fork('colonize')` |

⚠ **THE CORPUS DOES NOT EXERCISE THE ONE ACTIVE SITE** — every coastal leaf finds a shore
contour, so the fallback never runs. **This cure is provable by construction and not by a moved
sha, and saying so is the honest report.**

⚠ **AND A BEHAVIOURAL PIN ON THE OTHER FIVE WOULD BE VACUOUS BY MF-ARCH'S OWN MEASUREMENT** —
their inputs already carry the variant, so their outputs moved at a reroll before the cure too.
The enforcement is therefore a SOURCE property (the assembly mints no bare-seed key, asserted
with the forbidden shape carried alongside so the arm is not vacuous), and the test says why.

**THE RATCHET IS RE-FROZEN EXACTLY** at `snapshot.js: 1, substrate.js: 4`, with
`buildFabric.js` asserted ABSENT. ⚠ **`substrate.js` composes its own root as
`${seed}::substrate::variant:N` — a second SPELLING of the salt, but the salt IS there.**
Converting it to `fabricForkKey` moves every leaf in the corpus for no measured defect;
**recorded as a duplicated-rule hazard for wave nine, not cured here.**

---

## §5 · ITEM 4 · THE TOPOLOGY QUANTUM AND THE THREE HASH TIERS

**THE QUANTUM HAS ONE HOME.** `wallCircuit.js` carried a private `n6`/`polyText`; a private
spelling of a shared rule is the class this programme keeps finding (`wallClaims`, the gate
split, the reroll salt). `fabricGeometry` now exports `TOPOLOGY_PLACES`, `q6` and `topoText`
beside the existing paint quantum `r2`, with the two purposes named:

- **PAINT** — `r2`, two decimals, what the lens strokes; otherwise left float. Nothing legal is
  decided from it.
- **TOPOLOGY** — `q6`, six decimals, applied at the moment of serialization, so "did this
  geometry change" has one answer rather than a per-caller float tolerance.

⚠ **THE QUANTUM IS A SERIALIZATION RULE, NOT A STORAGE RULE, AND THAT IS THE WHOLE SCOPE HERE.**
Geometry is still carried as float and every law still decides on floats. Quantizing the STORED
legality geometry moves every pixel in the corpus and owes its own equivalence proof — **handed
off (§9).**

**THE THREE TIERS ARE BUILT AND THEY DISCRIMINATE** (`MFARCH2-hashtiers.mjs`):

| tier | what it is | moves when |
|---|---|---|
| WORLD | canonical, ordered, quantized semantic state — bodies by key, rings by epoch, claims, channels, water, district identities. No ink at all. | the town changed |
| PROJECTION | the command stream, every paint attribute stripped, in document order | what is DRAWN changed |
| RASTER | the pixels, through `sharp`/libvips at a fixed size | a reader would see a different page |

```
WORLD / PROJECTION / RASTER, 16 leaves, executed at the final tip — full table in
MFARCH2-hashtiers.log. town 1a93a009 / 0132e9b0 / 0997909d · city b58c8fb0 / 62043480 / 5bb2f76c

COUNTERFACTUAL, executed:
  PAINT-ONLY (parchment → darkFantasy)  WORLD UNCHANGED ✔   RASTER MOVED ✔
  GEOMETRY (one parcel moved 1 unit)    WORLD MOVED ✔
  IDENTITY-ONLY (one districtId renamed) WORLD MOVED ✔
```

⭐ **AND THE FIRST RUN ALREADY PAID FOR ITSELF WITH A FINDING: `town` AND `famine` HAVE THE SAME
WORLD HASH AND DIFFERENT PROJECTION AND RASTER HASHES** (as do `city` and `migration`). The
famine leaf differs from the plain town leaf **entirely outside the legality surface** — its six
`stateMarks.marks` are drawn expressions that no §195.0 census governs. One digest over the SVG
could never have said that. ⚠ It also names this tier's own boundary: WORLD covers the legality
surface and the identities, **not** the marks, the immersion suite, the fields or the relief.

⛔ **THE RASTER TIER NEVER READS GREEN WHEN IT IS UNAVAILABLE** — if `sharp` fails to load the
run reports UNAVAILABLE and exits non-zero.

---

## §6 · MF-ARCH's, MF-B8b's AND MF-B8's WINS, RE-QUOTED AT MY TIP

| claim | MF-ARCH | **MF-ARCH-2, re-measured this session** |
|---|---|---|
| suite | 152/152 | **162/162, ZERO re-recorded** |
| determinism, 10 processes | 10/10 `c7d922f6…` | **10/10 `87da9c41…c601fc`** (moved — §8) |
| §17 DRAWN disjointness | 0 pairs | **0 pairs, all 16 leaves** |
| §17.4 DRAWN street right-of-way | 0 of 23,116 | **0 of 23,391, AREA-TRUE** |
| §205A DRAWN water right-of-way | 0 | **0** |
| §200 DRAWN wall band | 0 | **0** |
| §202 landlocked | 0 | **0** |
| §201B orphan street segments | 0 | **0** |
| §232 district straddlers | 0 | **0** (pinned, green) |
| per-tier op ceilings | 96/96 under | **96/96 UNDER** (thorp 914/1000 · hamlet 1014/1100 · village 1664/1800 · town 4454/4600 · city 6308/6400 · metropolis 9617/9700) |
| purity scan | none | **NONE** (45 files) |
| sizeBaseline | max 793/800 | **max 790/800 — UNDER** |
| module import graph | 42 nodes, acyclic | **43 nodes, acyclic** |

**RUN-1 PARCHMENT SHAs, ALL 16 LEAVES, AT MY TIP** (every one moved — see §8 cause 101):

```
thorp        b402c7d4b4a97a1c0c0222840675bb8841c783fb9dfccbaeb5f4cc5244a7bd9e
hamlet       226011b4a1d335a806ba165d52eb635fbb8d613bddb79af8040e96d920c862ad
village      4edb3a680e0f1b8361f0acee0520ac750d7fdcba13864e42cf1a9183ee6b100b
town         85fe7726f10d4320f1a08fc809de86bb2bdd1cf944b204912a88bf919afdf9de
city         ae2eb05fc63079b4fcc0e89792cd22cebab510b83a8dfacc513c588767e8b9d7
metropolis   500ae409f3adabe3adb733a8fc1eb967265547d5f39f607ee4d8467cf140c3c2
polycentric  0e8f049412f3f6a39d23d91229eda4a8e918bc7ce1da98e09555f0cc53aab567
highwater    ed8a78f0e2a16dd6bc36e4ea820c66cfba00ed0ac283e032095d45400647fa36
mountain     84ce877567649194517d1723ae52227b77becdf9af19dcbe7a93e0ede3ab9b75
fjord        8c08382755633c3c7030c4ed30b582477879523422976a1ebd66270b2ae86b02
siege        fd0f4ab12e368e61f450809ff76b82ebe065ad7ff706a8d245395b05048d81b1
plague       61e1701e72fec46947658adf2952db5dffe22089efff9721e91fea43470a2588
famine       30df3d6a6a798c9317c2d52280fb279865cff555bddf18916a54bbf7bc40c38b
migration    e32311d404ce6585cf4360015bab5e7e34c18834d494fc0d14a253b228949dfc
year-018     0aff4fa3f84840ecec4483e4289eb46aa9372354907469a391539fcccee80baa
year-100     ce4395d53190c73c449d5d7c6ffc3d1db1e6f60f402bc40c61add535d7bb9563
```

**HEADROOM AGAINST MF-ARCH, EXACTLY, BECAUSE "ALL UNDER" HIDES THE DIRECTION:** thorp 81→86,
hamlet 76→86, village 137→**136**, town 161→**146**, city 62→92, metropolis 78→83. ⚠ **THE TOWN
TIER LOST 15 PRIMITIVES OF SLACK AND THE VILLAGE ONE** — the town leaves gained fabric where the
wall pulled in, and a tier at 146 of 4,600 is the one to watch. City gained 30 (its outer ring is
traced from a smaller body). No ceiling was raised and none was breached.

---

## §7 · ITEM 6 · THE CROSS-ENGINE HARNESS — AND EXACTLY WHAT IT PROVES

`MFARCH2-engines.mjs` renders the whole corpus under four **different execution modes of the
JavaScript runtime** and compares digests. The drivers are chosen to change how the arithmetic is
actually executed, not merely to run it twice:

```
node (default)                        TurboFan optimizes hot loops after warm-up
node --jitless                        NO JIT AT ALL — the whole build interprets
node --no-opt                         baseline tier only; no optimizing compiler
node --no-flush-bytecode
     --no-lazy-feedback-allocation    a third tiering profile
```

**⭐ THE QUESTION HAS CONTENT.** V8's optimizing tiers may keep intermediates in registers or
fuse operations differently from the interpreter. If any of the fabric's arithmetic were
sensitive to that, `--jitless` and the ordinary run would disagree — and **every golden in this
programme would be a property of how warm the process was when it ran**, which nothing here would
ever have noticed.

⛔⛔ **WHAT IT DOES NOT PROVE, STATED SO IT IS NEVER READ AS MORE.** One V8, one libm, one
machine, one architecture. It says nothing about SpiderMonkey or JavaScriptCore, nothing about
ARM vs x86, nothing about a browser. **The purity scan's ban on trig, `pow`, `Math.random`,
`Date` and `localeCompare` is what makes cross-engine agreement PLAUSIBLE — an enforcement by
scan, not a proof by execution — and this harness does not upgrade it.** ⚠ The DRIVER TABLE is
the deliverable: adding `bun`, `deno` or a headless browser is one row, and a driver that cannot
run is reported and exits non-zero rather than passing quietly.

---

## §8 · ⚠⚠ THE DECLARED SAME-SEED SHIFT (§110.3) — causes 97–101

MF-ARCH declared none. **This wave declares five, appended to MF-B8b's 93–96, and the sequence
in which they were measured is itself the evidence for how they are attributed:**

- **after the version axis (§1): ZERO leaves moved.** Determinism digest byte-identical.
- **after the epoch axis (§2): TEN leaves moved.** The six with no circuit — thorp, hamlet,
  village, mountain, fjord, year-018 — were **byte-identical**. ⭐ *A byte-identical leaf is a
  proof when it is the leaf the change should not reach.*
- **after the fork-key cure (§4): ALL SIXTEEN moved**, including those six.

**97. THE EPOCH AXIS.** Each circuit is traced from its own epoch's fabric instead of a scaled
copy of today's outline, so every ring on every walled leaf moves; on a two-vintage leaf the
OUTER ring moves in from today's extent to the tier threshold it was raised at (city 1.000 →
0.899, metropolis 1.000 → 0.972), and the fabric beyond it becomes suburb by derivation.
**98. THE CONTAINMENT CLOSURE AND THE GUARDED TERRAIN PULL.** A pull candidate standing inside
the epoch is refused, and the traced ring is held outside its epoch — every walled leaf.
**99. THE DITCH MOVES TO THE WORKING CIRCUIT.** It was dug round whichever ring was traced FIRST,
which on a two-ring leaf was the OLD one: a moat round the disused core and none round the wall
the city actually mans. **This is a correction, and it is visible.**
**100. PER-EPOCH KEYED RNG STREAMS.** `wall.epoch.k` replaces one stream walked in ring order, so
every gate-bricking and ditch-affordance draw on a walled leaf moves. **This is §240.4's inertia
seam being closed, and it necessarily moves bytes once.**
**101. THE FORK-KEY SALT CURE.** meander, coast jitter, growth umbrella, built umbrella, wall and
colonize key through `fabricForkKey`. **This moves every leaf in the corpus, including the six
the epoch axis leaves alone.**

**PUBLISHED META FIELDS THAT MOVE** (corpus totals, MF-ARCH → MF-ARCH-2):

| field | MF-ARCH | MF-ARCH-2 | reading |
|---|---|---|---|
| `zoneOutside` | 281 | **237** | improvement — fewer bodies outside their own wash |
| `zoneMajorityOutside` | 258 | **217** | improvement |
| `zoneOffBand` | 54 | **63** | moved with the fabric |
| `waterCrossings` | 141 | **193** | more channels cross water |
| `waterExempt` | 27 | **28** | |
| ⛔ `waterViolations` | 114 | **165** | **UP 51 — REPORTED, NOT EXPLAINED AWAY** |
| `landlocked` · `orphanStreets` | 0 · 0 | **0 · 0** | ✔ preserved |

⛔⛔ **`waterViolations` RISING BY 51 IS THE ONE FIGURE IN THIS RECEIPT THAT LOOKS LIKE A
REGRESSION AND I HAVE NOT CHARACTERIZED IT.** §205A counts street crossings of the watercourse
that carry no named work; the wall pulling inward pushed fabric — and with it street channels —
into ground near the water that was previously intramural. It is a REPORTING census (MF-B7's own
law: it reports, it does not block), and no pinned-at-zero law moved. **It is measured, it is
named, and it is the first thing wave nine should look at (§9).**

---

## §9 · WHAT I DID NOT DO — stated plainly

1. ⛔ **ITEM 5 IS NOT BUILT** — spatial indexing with canonical insertion AND result ordering,
   an indexed-vs-exhaustive equivalence pin on fixtures, and per-census runtime budgets with a
   completeness status where "skipped due to scale" can never read green. **Cause: items 1–3 and
   the four wrong containment answers (§2.4) consumed the wave.** `reservedGround.claimIndex` is
   still the template MF-ARCH named, and MF-ARCH's §203 lattice arm is still the first census
   that will want a budget.
2. ⛔ **THE LEGALITY GEOMETRY IS NOT STORED ON THE QUANTIZED GRID** (§5). Only the serialization
   is fixed-precision. Quantizing storage moves every pixel and owes its own equivalence proof.
3. ⛔ **THE METROPOLIS'S THIRD CIRCUIT IS DERIVED AND WITHHELD** (§2.2) — op ceiling and freeze.
4. ⛔ **`waterViolations` 114 → 165 IS NOT CHARACTERIZED** (§8).
5. ⛔ **`substrate.js`'s SECOND SPELLING OF THE REROLL SALT IS NOT CURED** (§4).
6. ⛔ **THE CONTENT HASH IS STILL 4×32 BITS FROM `fabricRng.hash32`** — MF-B8b's item 3 and
   MF-ARCH's, untouched. The WORLD/PROJECTION/RASTER tiers use sha-256 in the harness; the
   DOMAIN's staleness detector is unchanged and still says in its own comment that it is not a
   security primitive.
7. ⛔ **STREETS AND WATER DID NOT BECOME GRAPH NODES**; **THE §205A SUBJECT SET WAS NOT WIDENED**
   (92 bodies, MF-ARCH's measurement); **b8/b8b's open items are untouched** — T-23/T-24, the
   four zoom defects, GAP-B's flat gradient, T-05's fill bands, the metropolis grain, the click
   region coverage, the faubourg district-id owner gate.
8. ⛔ **NO FORENSIC ZOOM WAS TAKEN, AND THIS TIME THAT IS A GAP RATHER THAN A JUSTIFIED
   OMISSION.** MF-ARCH could skip it because its SHAs were byte-identical to the plates the chair
   had already reviewed. **Mine are not: ten leaves' walls have moved shape and the ditch has
   changed ring.** The 32 plates are written to `mf-proto-out/arch2/` with a manifest, but
   **nobody has looked at them.** ⚠ *The old core is now a different shape from the modern wall
   — that is the intended change and it is the one a reader will see first.*

---

## §10 · WHAT WAVE NINE INHERITS

**THE FOUNDATION, LANDED AND ENFORCED**

1. **An acyclic pipeline, proved at two granularities**, with an EMPTY declared-cycle roster and
   a counterfactual that plants MF-ARCH's own write-back back into the real assembly.
2. **The epoch axis as a built substrate** — ring count derived from tier thresholds, one ring
   per epoch, epoch index on the ring and in the input hash, the suburb named.
3. **A containment guarantee the derivation reports on itself** (`containmentResidual`, pinned 0).
4. **Per-epoch keyed streams**, so §240.4's inertia seam is closed and pinned.
5. **No bounded solver anywhere in the fabric.**
6. **10 new pins.** THREE are titled ⛔ COUNTERFACTUAL arms that must red (the planted write-back
   in the real assembly source; the callee-write-back scan with the shape it forbids carried
   alongside; `boundEpoch` given a trace that steps inside its epoch). FOUR more carry inline ⛔
   arms: the ladder's "a city with no room to have outgrown its wall earns ONE"; the content
   hash's epoch-relabelling refusal; the body census's two-ended non-vacuity bound (there ARE
   members and there IS a suburb); the fork-key scan's own forbidden shape.

**THE FOUR THINGS TO DO FIRST, IN THIS ORDER**

1. ⭐⭐⭐ **LOOK AT THE PLATES** (`mf-proto-out/arch2/`). This wave moved every walled leaf's wall
   and no human has seen one. The specific things to judge: does the epoch-derived old core read
   as an older town rather than a smaller copy; does the outer ring at 0.899 of the city's extent
   leave a suburb that reads as a suburb; does the ditch on the working circuit read right.
2. **CHARACTERIZE `waterViolations` 114 → 165** (§8). It is the only number in this wave that
   moved the wrong way.
3. **ITEM 5 — SPATIAL INDEXING, EQUIVALENCE PINS, PER-CENSUS RUNTIME BUDGETS.** Unstarted;
   MF-ARCH's design and entry points stand unchanged.
4. **RULE ON THE METROPOLIS'S THIRD CIRCUIT** (§2.2). It is derived, it is withheld by a cap, and
   lifting the cap needs an op-ceiling raise and an owner ruling — not a code change.

**OPEN QUESTIONS HANDED OVER WITH NUMBERS ATTACHED**

- `waterViolations`: **+51** corpus-wide, cause named, not characterized.
- The metropolis's absorbed intermediate ring: extent **0.797**, earned and not drawn.
- `substrate.js`'s hand-rolled salt spelling: **4** sites.
- `snapshot.js`'s hand-minted key: **1** site, composing from a now-properly-salted root.
- WORLD-hash coverage gap: `stateMarks.marks`, immersion, fields, relief — **not** in tier 1.
- MF-ARCH's own handoffs, all still open: §205A subject set **92** bodies; streets/water raw-handle
  exposure **19** and **58** reads.

---

## §11 · JUDGMENTS (all vetoable; these AMEND B1…B8b's and MF-ARCH's lists)

- **J-A2-1 · THE VERSION AXIS WAS LANDED AS A SEPARATE, BEHAVIOUR-NEUTRAL STEP BEFORE ANY
  GEOMETRY MOVED.** It cost an extra full verification cycle and it is what lets this receipt
  attribute every moved byte to a named cause. *Recorded because it is the shape of the wave.*
- **J-A2-2 · THE RING COUNT DERIVATION PRESERVES EVERY RING COUNT IN THE CORPUS, DELIBERATELY.**
  A derivation that also re-calibrated how many rings a settlement gets would have smuggled a
  tuning change into an architecture wave under a freeze. The ladder is new; the answers are the
  ones the corpus already had. *Say "veto" and I will re-derive the calibration too.*
- **J-A2-3 · THE METROPOLIS'S THIRD CIRCUIT IS DERIVED AND WITHHELD BY A TIER CAP** rather than
  by pretending the facts do not earn it. Two measured reasons (§2.2).
- **J-A2-4 · §240.2's "A VILLAGE EARNS ZERO CIRCUITS" IS READ AS THE DOSSIER'S DECISION, NOT
  THIS MODULE'S.** Refusing a circuit the landed model asserts would break the one-decider rule.
  *Flagged rather than taken as settled.*
- **J-A2-5 · THE EPOCH IS DEFINED AT THE WALL'S OWN FACET RESOLUTION** (§2.4). Ground beyond the
  chord is attributed to the next epoch rather than clipped or force-walled. This is the decision
  that makes "0 by construction" true rather than approximately true.
- **J-A2-6 · "HELD" IN THE BODY-LEVEL CENSUS MEANS BY ITS OWN CIRCUIT *OR ANY LATER ONE*** (§2.7).
  The strict per-ring claim is pinned separately and reads 0; this arm asks the reader-visible
  question. *Both are reported; veto the second and the first still stands.*
- **J-A2-7 · THE DITCH MOVED TO THE WORKING CIRCUIT.** It is a visible change on two-ring leaves,
  it is a correction of an ordering accident rather than a new law, and it is declared as cause 99.
- **J-A2-8 · THE FORK-KEY CURE WAS TAKEN EVEN THOUGH IT MOVES EVERY LEAF INCLUDING THE SIX THE
  EPOCH AXIS LEAVES ALONE.** MF-ARCH froze it for exactly that reason; the brief instructs the
  cure here, and riding one declared shift is cheaper than two. **The cost is that the six
  unwalled leaves are no longer a control for the epoch work** — which is why §8 records the
  three-stage measurement instead.
- **J-A2-9 · ITEM 5 IS HANDED OFF WHOLE RATHER THAN STARTED THIN**, per the brief's instruction.
- **J-A2-10 · `censusLeaf`'s CONTRACT CHANGED FROM CONTAINERS TO ARRAYS.** Taking `packed` whole
  is what made assigning back into it look natural. This is a callee-signature change five
  arguments wide and it is flagged, not treated as cosmetic.

---

## §12 · HAZARDS FOR THE LANDING EXECUTOR (additions to B1 §11 … MF-ARCH §10)

- ⚠⚠ **MF-ARCH's ACORN MINT-TRIGGER STILL RIDES.** `tests/lint/derivationGraph.walker.test.js`
  parses source with `acorn`. **THE EXECUTOR OWES AN EXPLICIT devDependency, and a dependency
  bump is a MINT TRIGGER (package.json / package-lock governed).** If acorn is absent the tests
  must FAIL, never skip. **This wave adds two more pins to that file, so the obligation grows.**
- ⚠⚠ **MF-ARCH's THREE META CORRECTIONS STILL RIDE AND ARE NOW SUPERSEDED BY NEW FIGURES.** The
  executor should land MF-ARCH's `waterCrossings` / `waterViolations` / `zoneMajorityOutside`
  corrections **and** this wave's further movement (§8) as ONE declaration, not two.
- ⚠⚠ **ONE SOURCE FILE DELETED (`wallCycle.js`) AND TWO ADDED (`epochAxis.js` 179 eff,
  `lateGround.js` 43 eff).** The executor owes a sizeBaseline row for each new file and must
  REMOVE the deleted one's row. ⚠ A census that only ever grows will red on the deletion.
- ⚠⚠ **THE TEST CENSUS: this wave adds 10 TITLES to TWO EXISTING FILES and no new file.** The
  file census is unchanged; the TITLE census moves by exactly 10. MF-ARCH's and b8b's warning
  that the title census sits AT its pinned ceiling compounds — **three waves of titles are now
  queued behind one landing.**
- ⚠⚠ **`censusLeaf`'s SIGNATURE CHANGED** (J-A2-10): it takes `parcels`, `masses`, `huts`,
  `faubourgBuildings`, `faubourgLeanTos`, `frontage`, `mergedKeys` instead of `packed`, `lod`,
  `shanty`, `faubourgs`. Any other caller in the repo must move with it.
- ⚠⚠ **THE FABRIC'S PUBLISHED BODY FAMILIES ARE NOW THE *ACCESSIBLE* VERSIONS BY CONSTRUCTION.**
  `fabric.parcels`, `fabric.lod.masses`, `fabric.shanty.huts`, `fabric.faubourgs.*` and
  `fabric.stateMarks.bodies` are the post-repair arrays because the assembly names them, not
  because a callee wrote through a reference. Behaviour is identical; **a lane that re-adds a
  write-back "for safety" would create a second reading of every one of them.**
- ⚠⚠ **THE CIRCUIT NODE PUBLISHES THREE NEW SURFACES**: `node.epochs` (the whole ladder, suburb
  included, each walled entry carrying its `body` and `containmentResidual`), and per ring
  `epoch`, `epochHull`, `containmentResidual`, `closedPolygon`. ⚠ **`epochHull` and
  `closedPolygon` are DIAGNOSTIC, not a law surface** — the content hash covers what the
  accessors publish, so a consumer measuring legality against them reads an unverified copy.
- ⚠⚠ **`ringsText` NOW INCLUDES THE EPOCH INDEX**, so every circuit content hash changes even
  where geometry did not. That is deliberate (two rings of one geometry at two epochs are two
  facts) and it means **no stored circuit hash from any earlier wave verifies.**
- ⚠ **`walls.js` NO LONGER EXPORTS `wallVintageRatio`** and no longer contains `convexish`,
  `shrinkAbout` or `centroidOf`. A consumer outside the fabric layer was not audited.
- ⚠ **`fabric.walls[].vintageRatio` IS NOW THE EPOCH'S EXTENT.** Same meaning (the share of
  today's extent this ring was fitted to), same two pins pass; the value moves on multi-ring
  leaves because the outer ring is no longer at 1.000.
- ⚠ **`epochAxis.js` IS IMPORTED BY BOTH `walls.js` AND `builtUmbrella.js`, AND `wallCircuit.js`
  NOW IMPORTS `builtUmbrella.js`.** The module graph is still acyclic — pinned — but the fabric
  layer's import count went 145 → 151 edges.
- ⚠ **EFFECTIVE-LINE COUNTS OF EVERY FILE THIS WAVE TOUCHED**: `buildFabric.js` **790**
  (ARCH: 793) · `wallCircuit.js` **292** (253) · `walls.js` **197** · `builtUmbrella.js` **197** ·
  `leafCensus.js` **275** (270) · `fabricGeometry.js` **425** · `epochAxis.js` **179** ·
  `lateGround.js` **43**. All under the 800 domain ceiling.
- ⚠ **THE CONTAINMENT CLOSURE IS THE MOST EXPENSIVE THING THIS WAVE ADDS** — a densified epoch
  (segments ≤ 0.2 margin) tested against a 20–30 vertex ring, up to 6 sweeps, once per ring per
  walled leaf. It moved no op ceiling and every tier gained headroom, but it is O(dense × facets)
  and is the second census that will want item 5's runtime budget.

---

## §13 · MEMORY-WORTHY FACTS FOR THE CHAIR

1. ⭐⭐⭐ **EIGHT DERIVATION CYCLES WERE WORTH NINE `const` DECLARATIONS.** The version axis
   dissolved every one of them with the determinism digest byte-identical. MF-ARCH's law is
   confirmed by construction: **a derivation cycle is usually a missing version axis**, and
   naming the versions is the whole of the cure — the geometry work that followed was the
   OWNER'S LAW, not the cycle's.
2. ⭐⭐⭐ **A WRITE-BACK PERFORMED INSIDE A CALLEE IS INVISIBLE TO THE CALLER'S CYCLE ANALYSIS.**
   Five real ones lived in `censusLeaf`; no SCC over `buildFabric` could ever have reported them.
3. ⭐⭐⭐ **A CONTAINMENT CLAIM MUST BE MADE AT THE RESOLUTION THE BOUNDARY IS ALLOWED TO HAVE.**
   A 20-facet curtain cannot contain a 2,300-point outline; four local repairs failed trying to
   buy degrees of freedom the law does not grant. Define the subject at the boundary's own
   resolution and the claim becomes exactly true.
4. ⭐⭐⭐ **A FUNCTION WHOSE NAME DESCRIBES ITS CALLERS' BELIEF RATHER THAN ITS CODE SURVIVES
   EVERY REVIEW THAT READS THE NAME.** `wallVintageRatio` was consumed for four waves as a
   per-settlement measurement of growth; its numerator was a constant.
5. ⭐⭐⭐ **A NEGATIVE RESULT MEASURED AGAINST A CONFOUNDED POPULATION IS NOT A NEGATIVE RESULT.**
   I removed a working cure and wrote a comment explaining why it did nothing.
6. ⭐⭐ **AN EXEMPTION EXPRESSED AS A TOLERANCE IS A SECOND SPELLING OF THE RULE IT EXCUSES.**
   The half-ring exemption had to become the filter's own predicate; the distance version needed
   tuning to fit its own evidence (8 to 77 units).
7. ⭐⭐ **A REPAIR THAT TAKES ITS DIRECTION FROM THE OFFENDER RATHER THAN FROM THE BOUNDARY CAN
   FAIL TO REPAIR** — and **A CORNER MOVED ALONG ITS BISECTOR DOES NOT TRANSLATE ITS EDGES BY THE
   SAME DISTANCE.** Both cost a measured round.
8. ⭐⭐ **A RADIAL REPAIR ASSUMES A STAR-SHAPED SUBJECT**, and a traced town outline is not one:
   251 view units of "closure" on a 392-unit city.
9. ⭐⭐ **A STAGE THAT WRITES BACK CANNOT BE EXTRACTED; A STAGE THAT RETURNS A VERSION CAN.**
   The decomposition that freed the line budget was a consequence of the naming, not a separate
   piece of work.
10. ⭐⭐ **PER-EPOCH KEYED STREAMS ARE WHAT MAKE AN EPOCH BOUNDARY AN INERTIA SEAM RATHER THAN A
    RE-ROLL.** One stream walked in ring order means adding a later circuit re-rolls every gate
    of an earlier one — and the outer ring is traced FIRST, so the earlier epoch is exactly what
    moves.
11. ⭐ **THREE HASH TIERS EARN THEIR KEEP ON THE FIRST RUN.** `town` and `famine` share a WORLD
    hash and differ in PROJECTION and RASTER: the famine leaf's whole difference is outside the
    legality surface, which one digest over the SVG could never say.
12. ⭐ **FOUR V8 EXECUTION MODES AGREE ON THE WHOLE CORPUS' DIGEST** — the goldens are a property
    of the code, not of how warm the process was. ⚠ One machine; not a cross-browser proof.
