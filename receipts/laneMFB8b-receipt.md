# Lane MF-B8b — THE WALL-FABRIC HOTFIX **and the §234 ARCHITECTURE PILOT**: receipt

**Lane MF-B8b (Opus), 2026-08-17. ODQ §230 (the owner's mutual-bounding law) + §232 (the wall
is a district partition) + §234.4 (this lane IS the derivation-graph pilot), on MF-B8's tree.**
**Touched:** the sandbox only. **NO git tree write, NO repo gate, NO branch move, NO memory
write, NO git command of any kind.** Every write went to `mf-proto/build-out/**`,
`mf-proto-out/b8b/**`, `MFB8b-*` or the disposable `laneMFB8b-tip` overlay.

---

## §0 · THE HEADLINE, STATED FIRST

**The owner is right, the staleness hypothesis is wrong, the defect is eight times larger than
the wall — and it predates MF-B8.**

> **§230.1's leading hypothesis — that the censused circuit and the drawn circuit had DIVERGED
> across generations — is REFUTED, by hash, on every walled leaf.** The census's `claimLine`
> reconstructs **byte-identically** from the lens's `polygon` under the band's own offset.
> The two surfaces shared their geometry exactly as §230 asks, **and the wall still crossed
> buildings** — because they also shared a BLIND PREDICATE.
>
> ⛔⛔ **AND IT DID NOT START AT b8. Measured against the b7 tree with b7's own claim publisher:
> 771 bodies stood in reserved ground there too, 84 of them in wall bands — while MF-B7's
> receipt reported "§200: 408 before, 0 after, worst penetration 0.00". THE b7 CURE SHIPPED ITS
> OWN BLIND AUDITOR.** The owner's catch did not find a b8 regression; it found the residue of a
> cure that had been certifying itself for two waves (§1.2b).

| reserved surface | the b8 census read | measured AREA-TRUE, same bodies, same claim objects |
|---|---|---|
| §17.4 street carriageways | **0** | ⛔ **1,299** |
| §205A water claims | **0** | ⛔ **13** |
| §200 wall bands | **0** | ⛔ **190** |
| **corpus total** | **0 of 22,934** | ⛔ **1,502 drawn bodies standing in reserved ground** |

⭐⭐⭐ **THE CLASS, AND IT IS THE ONE TO BANK: A CLAIM NARROWER THAN THE BODY THAT CROSSES IT IS
INVISIBLE TO A VERTEX-SAMPLED PREDICATE — AND A CENSUS THAT INHERITS THE LAW'S OWN PREDICATE
CANNOT REFUTE THE LAW.** Sharing the OBJECT is necessary and **not sufficient**. That is the
pilot's first and most expensive lesson, and it is the §234 input that matters most.

**AFTER (all figures executed this session, after the final edit):**

```
vitest (lane config, bare)               Test Files 6 passed (6)  Tests 134 passed (134)
                                         = MF-B8's 116 + 18 NEW; ZERO pins re-recorded
cross-process determinism                10 separate processes, identical=10 mismatched=0
                                         c7d922f6631e718a8ba4f0e09471002cc2396bbaced99dba3e0652552560e480
§17   DRAWN-geometry disjointness        0 intersecting DRAWN pairs — ALL SIXTEEN LEAVES
§17.4 DRAWN street right-of-way          0 of 23,116 bodies, AREA-TRUE   (b8's predicate hid 1,299)
§205A DRAWN water right-of-way           0 of 23,116 bodies, AREA-TRUE   (b8's predicate hid 13)
§200  DRAWN wall band                    0 of 23,116 bodies, AREA-TRUE   (b8's predicate hid 190)
§200  DRAWN INK crossings                0 bodies crossed by the stroke the lens actually draws
§232  district straddlers                0 of 62 districts on the walled leaves (pre-cure 14 of 46)
§202  landlocked                         0 — b8's win PRESERVED
§201B orphan street segments             0 — ★ b8's 4-segment REGRESSION is GONE (§6)
§205A unaccounted crossings              100 (b8: 103)
op ceiling (§217 per-tier ratchet)       ALL 96 RENDERS UNDER THEIR TIER CEILING
purity scan (comments stripped)          Math.random/Date/localeCompare/Math.pow/trig — NONE (44 files)
sizeBaseline (lane instrument)           MAX 794 (buildFabric.js) against the 800 ceiling — UNDER
forbidden constructs / XML parse         gradient/filter/blend/image/drop-shadow ABSENT; 26/26 parsed
```

**Deliverables**

- `mf-proto/build-out/src/**` — **4 NEW modules** (`reservedGround.js`, `wallCircuit.js`,
  `districtPartition.js`, `wallCycle.js`); `walls.js`, `groundLaw.js`, `buildFabric.js`,
  `leafCensus.js` amended; `harness/renderFolio.mjs` amended
- `mf-proto/build-out/tests/domain/townMapWallCircuit.test.js` — **18 pins, 7 of them
  COUNTERFACTUALS that must red**
- `mf-proto-out/b8b/` — 16 exemplars + the town's and city's six lenses + 3000 px plates +
  `manifest.json` + five forensic PNGs
- instruments: `MFB8b-walldiag.mjs` (the three-way divergence probe), `MFB8b-forensic.mjs`,
  `MFB8b-siblings.mjs`, `MFB8b-straddle.mjs`, `MFB8b-zoom.mjs` (pixel-exact owner view),
  `MFB8b-bodies.mjs`, `MFB8b-siblings-b7.mjs` (the same instrument against the b7 tree),
  `MFB8b-battery/-det/-plates/-grain`

---

## §1 · DIAGNOSIS — THE DIVERGED SURFACE, NAMED WITH EVIDENCE

### §1.1 · THE STALENESS HYPOTHESIS IS REFUTED (CONFIRMED)

`MFB8b-forensic.mjs town`, run against the **b8** tree:

```
ring kind=main form=palisade vertices=117
  DRAWN   ring.polygon      sha=8f8ad7f365637e40  v0=(820.69, 934.56) v1=(831.11, 923.16)
  CENSUS  ring.claimLine    sha=857ffc4f1b110ec3  v0=(821.49, 935.36) v1=(831.96, 923.90)
  band stone=1.902 inner=2.265 outer=4.529 width=8.696 half=4.348 shift=1.132
  reconstructed offsetPolygonOutward(polygon, shift, 1.5)
                            sha=857ffc4f1b110ec3  → IDENTICAL
```

The censused geometry **is a pure function of the drawn geometry, in the same generation**, on
every ring of every walled leaf (city, metropolis, highwater and polycentric all reproduce it;
the old-core rings have `shift = 0` and are byte-identical to the drawn ring). **There is no
stale generation anywhere in the wall.**

### §1.2 · THE ACTUAL DIVERGED SURFACE IS THE PREDICATE, AND IT IS COPIED IN FOUR PLACES

The law and its auditor asked the same question the same wrong way — `for (const p of poly)`,
the body's **vertices**, against the claim's **centreline**:

| file:line (MF-B8 tree) | function | role |
|---|---|---|
| `src/domain/townMap/fabric/groundLaw.js:268-279` | `deepestClaim` | the §200 verification arm B7 added |
| `src/domain/townMap/fabric/groundLaw.js:296-318` | `clipOutOfStreets` | **the clip itself — no violating vertex, no clip** |
| `laneMFB8-drawn.mjs:166-180` | `drawnInWallBand` | the §200 census |
| `laneMFB8-drawn.mjs:106-118` | `drawnInStreet` | the §17.4 census |

**THE QUOTED BODY — the owner's own catch, located.** MF-B8 town leaf,
`backHouse:org.district.market_quarter~1/p.140.3.0#back`:

```
polygon (4 vertices): (642.45, 430.40) (648.01, 435.56) (636.91, 447.50) (631.36, 442.34)
crossing claim segment [wall.main.1] (644.65, 439.89) → (641.19, 438.18)   half = 4.348
per-vertex distance to that segment:  7.882   5.475   10.251   10.677
⇒ VERTEX penetration −1.019  (the census reads CLEAN)
   EDGE   penetration  4.348  (the maximum possible: the claim lies WHOLLY INSIDE the body)
```

The wall runs through the middle of a 7.6 × 16.3-unit back-house and **all four of its corners
stand clear of an 8.70-unit band**. Mapped to the owner's plate (the folio's viewBox is
`0 0 1000 1000`, so a 3000 px render is 3 px/unit):

```
view (639.68, 438.95) → 3000px (1919, 1317) → crop@1050,1050/900 (869, 267)  ★ INSIDE THE OWNER'S CROP
```

⚠ **The transverse extent is the mechanism.** The body's extent along the claim is **11.93 u
against an 8.70 u band (ratio 1.37)** — the wall bridges the body and misses every corner.

### §1.2b · ⛔⛔ AND THE BLIND SPOT WAS ALREADY OCCUPIED AT MF-B7 — ITS OWN §200 CURE WAS VACUOUS

I ran the same instrument against the **b7** tree (`MFB8b-siblings-b7.mjs`, importing b7's own
`wallClaims`), so this is CONFIRMED rather than reasoned:

| tree | drawn bodies | STREET census / true | WATER census / true | WALL census / true |
|---|---|---|---|---|
| **MF-B7** | 11,308 | 0 / ⛔ **671** | 0 / ⛔ **16** | 0 / ⛔ **84** |
| **MF-B8** | 22,934 | 0 / ⛔ **1,299** | 0 / ⛔ **13** | 0 / ⛔ **190** |
| **MF-B8b** | 23,116 | **0 / 0** | **0 / 0** | **0 / 0** |

⛔⛔ **MF-B7's headline — "§200 THE WALL-CLEARANCE LAW: 408 bodies before, 0 after, worst
penetration 0.00" — WAS ITSELF VACUOUS. 84 bodies still stood in a wall band and the census it
shipped in the same commit could not see one of them.** The 408 it cured were real and the cure
was real; what B7 could not know is that its new census inherited the ground law's own predicate,
so it certified exactly the residue the ground law was blind to.

⭐⭐⭐ **THE FULL CLASS, NOW WITH ITS EVIDENCE: A CURE AND ITS CENSUS WRITTEN IN THE SAME COMMIT
FROM THE SAME PREDICATE MEASURE THE HALF OF THE LAW THE PREDICATE CAN SEE.** This is why the owner
has now caught the same contradiction twice (ODQ §230.3's own observation): the class does not die
cure-by-cure, because each cure ships the auditor that would have caught it, built from the same
blind question.

⚠ **AND IT IS WHY b7 LOOKED CLEAN AND b8 DID NOT, EXACTLY:** the b7 **town** leaf carried **0**
wall violations — b7's 84 were on the city (14), metropolis (27), highwater (26) and polycentric
(3) — so B7's wall-run zoom, taken on the town, was honestly clean. The b8 town gained 2, and one
of them fell inside the frame the owner was sent. **The rate barely moved (b7 6.8 % of bodies in
reserved ground, b8 6.5 %); the defect simply walked into the picture.**

### §1.3 · TWO FURTHER DEFECTS THE PROBE EXPOSED, BOTH REAL

**(a) THE RESERVATION IS WIDER THAN THE STROKE AND STILL OFFSET FROM IT.** MF-B7 pinned "the
band is never thinner than the ink" — a claim about WIDTH. Measured at b8, on the leaves whose
towns keep no glacis (correctly, by §5.0e.3), the reservation about the **drawn** line:

| leaf | reserved outward | the stroke's outer half | verdict |
|---|---|---|---|
| city (main) | 1.400 | 1.445 | ⛔ 0.045 u of ink on unreserved ground |
| metropolis (main) | 1.368 | 1.405 | ⛔ 0.037 u |
| **polycentric (main)** | 0.988 | 1.300 | ⛔ **0.312 u** |
| town / highwater | 5.480 / 6.817 | 1.25 / 1.48 | ✔ |

⭐ **THE CLASS: A RESERVATION WIDER THAN THE STROKE CAN STILL BE OFFSET FROM IT; CONTAINMENT IS
A TWO-SIDED CLAIM.** Cured by a **side floor** in `wallBand` — each face must contain the
stroke's own half — and pinned per face, per ring, per leaf.
⚠ And the root of it was a restatement error worth naming: `WALL_BAND.inkShare = 0.42` is what
the STONES scale by; the lens strokes at `INK_SCALE.wall = 0.55` clamped to `[1.8, 4.6]`. One
number was standing in for another.

**(b) THE LENS WAS STILL SPLITTING BY DROPPING VERTICES.** MF-B7 cured that inside `wallClaims`
("splitting a polyline by dropping vertices removes a length that depends on the vertex spacing,
not on the opening's width") **and left the identical bug in `renderFolio`** — so the drawn gate
opening and the reserved gate opening were different widths on every walled leaf.
⭐ **THE CLASS: A DEFECT CURED IN ONE SPELLING OF A DUPLICATED RULE SURVIVES IN THE OTHER, AND
THE TWO THEN DISAGREE ABOUT THE SAME TOWN.** Pinned with a counterfactual: on a 200-unit ring
sampled every 40 units with a 25-radius gate, the exact splitter opens **50.000** (the gate's own
diameter) and the vertex-dropping spelling opens **80** (the vertex spacing).

---

## §2 · THE CURE, AS THE §234 ARCHITECTURE PILOT

Five modules, and the shape is the point rather than the fix.

### `reservedGround.js` — ONE ANSWER TO "DOES THIS BODY STAND IN RESERVED GROUND?"

`segToPolyDist` is **segment-to-polygon**: zero when the claim crosses an edge, zero when the
claim runs inside the body, the true nearest approach otherwise. `deepestPenetration` is the one
question; `kerbHalfPlane` is the one repair line — and it carries the **straddle** case the old
code had no branch for: when the claim runs THROUGH a body there is no violating vertex to take
a direction from, so the direction comes from the body's own centroid. The facade lands on the
kerb and the wall stops the growth it crosses, in one operation. `claimIndex` returns candidates
in **canonical ascending order** (§234's spatial-indexing rule).

**Consumers, all of them, now:** `groundLaw.clipOutOfStreets`, `groundLaw.deepestClaim`, every
census, every pin.

### `wallCircuit.js` — THE CANONICAL CIRCUIT NODE

```
WALL_CIRCUIT_INPUTS   17 declared names — the WHOLE consumed set
deriveWallCircuit()   REFUSES an input record carrying anything not on that list
node.inputsHash       128-bit content hash over the declared inputs, serialized in fixed order
node.contentHash      128-bit content hash over what the node PUBLISHES
verifyCircuit()       every accessor re-verifies; a mutated node THROWS
assertCircuitFresh()  re-derives the input hash from the CURRENT fabric — the stale-generation gate
circuitDrawnRuns()    what the LENS strokes
circuitClaims()       what every LAW and CENSUS reserves
circuitBandSide()     −1 intramural / 0 in-band / +1 extramural  (§232)
circuitHold()         project a point onto the band's face  (§232)
splitAtGates()        THE ONE SPLITTER, at THE ONE gate radius (GATE_RADIUS_SHARE = 0.075)
```

⭐⭐ **`wallClaims` WAS DELETED FROM `walls.js`.** Not moved for tidiness — the duplicate rule was
the defect, so the cure is that **there is no second implementation to call.** The gate radius,
which lived as `builtRadius * 0.075` in two files, is now one exported constant.

⭐⭐ **THE ROADS ENTER THE HASH BY GEOMETRY, NOT BY COUNT** — a road that MOVED without changing
the count is exactly the staleness the hash exists to catch, and a count would miss it. Pinned.

### `districtPartition.js` — §232, AS A DERIVATION

The band is removed from **district space before any region is traced**: the circuit's own ground
belongs to no quarter, and each side is traced as its own mask by the umbrella's existing
routine. **A district cannot straddle because there is no lattice on which a straddling region
could be traced** — the census is a theorem about the construction, not a hope about the output.
Extramural regions take their **own district identity** (`~faubourg`) with a `parentDistrictId`,
never an intramural quarter continued, exactly as §232 rules.

### `wallCycle.js` — THE BOUNDED SOLVER NODE

**THE CYCLE, NAMED: wall ↔ fabric.** The circuit is traced from the fabric the town built; the
fabric is then bounded by the circuit. **Solved in TWO FIXED PASSES and never iterated** — no
convergence criterion, no tolerance, no fixed-point engine, so §11.0's determinism law is
untouched. **THE CUT EDGE IS WRITTEN DOWN:** *district-partition → circuit* is cut — the wall
does not move to accommodate the quarters it splits, which is the historical direction and the
one that terminates.

### The lens

`renderFolio` pulls `circuitDrawnRuns(fabric.wallCircuit)`. It no longer knows how a wall opens
at a gate; it asks.

---

## §3 · §232 · THE DISTRICT PARTITION — PRE-CURE COUNTS, OWNER-CREDITED

**MEASURED BEFORE ANY CHANGE** (`MFB8b-straddle.mjs`, on the circuit object the lens draws, by
area share on a fixed 2.0-unit lattice — never by vertex sampling, which is the very defect
§230 is about):

| leaf | districts | ⛔ STRADDLERS | worst minority share | which |
|---|---|---|---|---|
| town | 4 | **2** | **26.8 %** | `district.government_quarter`, `district.market_quarter` |
| city | 6 | 1 | 4.7 % | `district.religious_quarter` |
| metropolis | 6 | 1 | 0.2 % | `district.government_quarter` |
| polycentric | 4 | 1 | 12.0 % | `district.market_quarter` |
| highwater | 4 | 0 | — | — |
| siege / plague / famine | 4 each | 2 each | 26.8 % | as town (same seed) |
| migration | 6 | 1 | 4.7 % | as city |
| year-100 | 4 | 2 | 26.8 % | as town |
| **CORPUS** | **46** | ⛔ **14** | | |

**AFTER: 0 straddlers on every walled leaf**, and the town's districts go 4 → 6 as its two
faubourgs take their own identity. ⚠ **The riverside town's `government_quarter` had 26.8 % of
its area on the far side of its own wall — and it is the quarter the owner's zoom is labelled
with.** The owner's two catches (the wall crossing fabric, and the district law) were the same
place on the same plate.

⛔⛔ **A RESIDUE THE NEW CENSUS CAUGHT ON ITS OWN FIRST RUN, worth more than the cure.** With the
regions traced on a lattice that already respects the band, the polycentric town still reported
**one straddler — 1 sample of 25,049**. Cause: `organicRing` displaces every traced vertex by up
to half a grid cell to kill the pixel staircase, *after* the mask has been split.
⭐ **THE CLASS: A BOUNDARY THAT IS CORRECT ON THE LATTICE CAN BE SMOOTHED BACK ACROSS IT — a
derivation is only as exact as the last pass that touches its output.**
⛔ **And my first cure was wrong in an instructive way.** I marched the offending vertex toward
the region's centroid; for a crescent-shaped faubourg wrapping its own gate that direction points
ACROSS the wall, so it cured the intramural region and **created** a straddle in the extramural
one (0.4 %). ⭐ **A "MOVE IT BACK INSIDE" THAT TAKES ITS DIRECTION FROM THE REGION RATHER THAN
FROM THE BOUNDARY CAN MOVE IT FURTHER OUT.** The correction is now a single exact projection onto
the band's own face, taken from the circuit (`circuitHold`). 0 on every leaf.

---

## §4 · THE SIBLING AUDIT (§230.2) — AND THE SIBLINGS WERE WORSE THAN THE WALL

`MFB8b-siblings.mjs`, both questions asked of every reserved surface:

**(a) DIVERGENCE — none.** Street claims **are** the drawn channels (one object, no offset).
Water claims are republished from the same water relation the lens draws. Wall claims are the
hashed offset of the drawn ring. **Nothing in this family is stale.**

**(b) PREDICATE — the wall's blindness was the family's blindness:**

| leaf | STREET before → after | WATER before → after | WALL before → after |
|---|---|---|---|
| hamlet | 4 → **0** | 0 → 0 | — |
| village | 5 → **0** | 0 → 0 | — |
| town | 90 → **0** | 1 → **0** | 2 → **0** |
| city | 151 → **0** | 3 → **0** | 32 → **0** |
| metropolis | 197 → **0** | 0 → 0 | 61 → **0** |
| polycentric | 79 → **0** | 0 → 0 | 8 → **0** |
| highwater | 83 → **0** | 1 → **0** | 47 → **0** |
| mountain | 4 → **0** | 0 → 0 | — |
| fjord | 85 → **0** | 0 → 0 | — |
| siege / plague / famine | 90 → **0** each | 1 → **0** each | 2 → **0** each |
| migration | 151 → **0** | 3 → **0** | 32 → **0** |
| year-018 / year-100 | 90 → **0** each | 1 → **0** each | 0 / 2 → **0** |
| **CORPUS** | **1,299 → 0** | **13 → 0** | **190 → 0** |

**The cure is the same shared construction in all three cases: one predicate, one home, area-true,
consumed by the law and by every census.**

---

## §5 · MF-B8's WINS, RE-QUOTED AT MY TIP

| b8 claim | b8 | **b8b, re-measured this session** |
|---|---|---|
| grain walk, monotone, town+city in band | 5.4 · 10.4 · 17.0 · **48.0** · **61.0** · 70.0 | 5.4 · 10.4 · 17.0 · **50.5** · **61.3** · 70.0 — MONOTONE; town (45–80) ★ MEETS, city (60–95) ★ MEETS |
| burgage plot series (4.2 : 1, flush frontage) | BUILT | unchanged — its pins pass in the 134 |
| block silhouette / two-tier stroke | 31 widths/leaf | **31 distinct stroke widths on the town leaf**, six fabric-scale (0.20 · 0.22 · 0.24 · 0.26 · 0.30 · 0.35 …) |
| per-tier op ceilings, pinned as a ratchet | 96/96 under | **96/96 UNDER** (thorp 919/1000 · hamlet 1024/1100 · village 1663/1800 · town 4439/4600 · city 6338/6400 · metropolis 9622/9700) |
| determinism, 10 processes | 10/10 | **10/10**, `c7d922f6631e718a8ba4f0e09471002cc2396bbaced99dba3e0652552560e480` |
| standing censuses 0/0 as DRAWN geometry | 0/0 over 22,934 | **0/0 over 23,116** — and now AREA-TRUE, so the zero means what it says |
| §202 universal access, 0 landlocked | 0 | **0** |
| §217 efficiency + sizeBaseline | max 790/800 | **max 794/800 — UNDER** (lane instrument) |

**Body count rose 22,934 → 23,116.** The area-true clip does not delete more; §17.3's demotion
ladder catches what the clip now finds, so **182 more bodies survive** than under b8's blind pass.

**Run-1 parchment SHAs (MF-B8b):**

```
thorp        b60d7bc50f96d306328704dab3db803e52aefca56cd59be725587d43ac278d44   ← UNCHANGED from b8
hamlet       9ab404a4f6cf044300be04cf2c72e54f6c097384ecd5880f662ab3d911b5dcbd
village      cd3fb9d08fcd7b74bd0b6c4c0512cd289339e6835d63a4c89b678283b18bf71d
town         fe0c710298a6f8b8e7c0f5466121f45f6fb6227a60235d8b1b54d2f3e8f0cf2a
city         8b4fee02ea70b051b62b4bb197ec8cda34f2ac4e160f319f089be8c6e7103c7d
metropolis   7c6ae2dabdea5d68f6dc50fe805cbf45c7cd4fbff047a34f76f79538ab689f13
polycentric  2bc90b1f0a0ef7d07c9f6515c748f6f2a3bddb04671eab827c605499e3ba9753
highwater    6e331eb7d81ab74a77d42a514b713a54996970dbb707443e68e7f8206fb21ed0
mountain     c63024be1ace2cc98c3d47dc3a4a10c6af462e8f37ee73bad79d194637d2f9f2
fjord        158909fa18927811ed6ed5c019aae11388d4899df6eb251bfb0c88c4af3f1420
siege        223424eda152d666ced80773f1475ccc1c191d1f7a828ef19f8430d00b5ce902
plague       f46953819bb07f9c7cfb55cd7e7ebc4645f6128b0c06ce04910c19ba455e4786
famine       57c1d3479ebd806355ce50d0e0f5ba96c8768ad6bf44542c2f447a17275de945
migration    18fdeaec61c8775e71e82c8cb82a5f8b3aafa5fa9e20a889a371b2d327f2587d
year-018     54f1447365c6023010f114d6fa29ba10670a34bfb9923b7cd21528eb8cc1cada
year-100     30762c4c3e1349583b5f15934b6c04cc5c3e17f6b47c893a725d9d06641b7702
```

⭐ **THE THORP IS BYTE-IDENTICAL TO b8 AND THAT IS A PROOF, NOT A COINCIDENCE.** It is the one
leaf with no wall and no body in any reserved claim, so the one leaf this wave should not move.

---

## §6 · A b8 RESIDUAL CURED WITHOUT BEING AIMED AT

**§201 B's 4 ORPHAN STREET SEGMENTS ARE GONE** — b8 recorded them as a regression against b7's 0
and made them "wave nine's first check". MEASURED at b8b: **0 orphan segments on every leaf,
including the city and migration leaves that carried 2 each.**
**PLAUSIBLE cause, not confirmed:** the area-true clip removes bodies that were standing across
a channel and severing it. The experiment that would settle it is re-running b8's own
`streetWeb` attachment probe with only the predicate reverted.

§205A's unaccounted crossings fall 103 → **100**; the two residual classes b8 named (the quay
street's own exemption predicate, four non-marine institutions on the coastal claim) are
untouched and remain wave nine's.

⚠ **§203's zone containment reads 281 where b8 read 268, and the two figures are NOT comparable.**
§232 redefined the partition the census measures against — the faubourgs are now their own
districts — so this is a changed denominator, not a regression. **Stated rather than smoothed.**

---

## §7 · THE FORENSIC ZOOM — I LOOKED, AND HERE IS WHAT IT SHOWS

**THE OWNER'S EXACT VIEW**, reproduced pixel for pixel (`MFB8b-zoom.mjs`: 3000 px render of the
town, `extract` at 1050,1050 over 900 px — the same view as `mf-proto-out/b8/TE-zoom-b8-center.png`).
`MFB8b-zoom-ownerview-BEFORE.png` · `MFB8b-zoom-ownerview.png`.

**BEFORE — and it reproduces the owner's plate exactly:** the black circuit crosses the top of
the crop and **passes through fabric** at three places along it; and **two heavy black rectangles
stand alone in open field at the left, attached to nothing** — a gatehouse's two piers, drawn
where the wall's own run had been eaten by the vertex-dropping split.

**AFTER:** the circuit runs clear of the fabric across the whole crop, with the intervallum lane
open behind it; and **the wall now reaches its own gatehouse** — the run ends exactly at the gate
circle, so the piers stand on the circuit instead of in a field. That second change was not the
defect the owner reported; it is §1.3(b) becoming visible.

**THE WALL RUN** (`MFB8b-zoom-wallrun{,-BEFORE}.png`, view 490,360 + 110 at 2400 px). Before, the
stroke passes over a brown range and clips a pale toft strip at the right; after, the range stands
clear below the stroke and the tofts stop short of it. ⚠ **Honestly: this crop's change is modest,
because the town only ever had two convicted bodies.** The measured evidence is what carries this
claim; the zoom corroborates it.

**THE DISTRICT-PARTITION SEAM** (`MFB8b-zoom-seam.png`, view 630,400 + 120 at 2400 px). The gate
at (682.5, 456.0): the two heavy piers with the road passing between them, the wall run ending
exactly at the pier, the water gate with its bars where the circuit meets the river — and across
the opening, the extramural cluster now on its OWN ground as `district.government_quarter~faubourg`
(centroid 676.7, 431.7; area 1,080) while `district.government_quarter` proper (centroid 737.0,
553.3; area 4,880) stays inside. **§232 read at a glance: the same quarter's name on both sides is
gone.**

---

## §8 · WHAT I DID NOT DO — stated plainly

1. ⛔ **THE OTHER RESERVED SURFACES ARE CURED BUT NOT PILOTED.** Only the WALL became a graph
   node. The street web and the water relation still travel as plain objects; they are now
   governed by the shared predicate, but nothing stops a consumer re-deriving a second reading of
   where a street is. **That is MF-ARCH's job and this lane's clearest hand-off.**
2. ⛔ **`fabric.walls` IS STILL REACHABLE.** The node publishes `rings` and the fabric carries
   them under the old name so the lens's tower/gate/ditch reads are untouched. A consumer that
   ignores the accessors and re-derives from `walls[].polygon` can still publish a second reading.
   The accessors make staleness impossible **for consumers that use them**; only deleting the raw
   handle makes it impossible outright, and that is a sweep across the lens I did not take.
3. ⛔ **THE CONTENT HASH IS 4×32 BITS FROM `fabricRng.hash32`, NOT A CRYPTOGRAPHIC DIGEST.** It is
   a staleness detector and says so in its own header. §234's three hash tiers will want better.
4. ⛔ **NO SCC DIAGNOSTIC WAS BUILT.** I found the wall↔fabric cycle by reading, named it, and cut
   it by hand. §234.2 asks for the diagnostic FIRST; this lane is the worked example it should be
   validated against, not the tool.
5. ⛔ **`keyedRandom` / lineage identities, fixed-precision topology coordinates, the cross-engine
   CI** — all §234, all untouched here.
6. ⛔ **THE §201 B CAUSE IS PLAUSIBLE, NOT CONFIRMED** (§6), and it names the experiment that
   would settle it. The b7→b8 question was PROMOTED to CONFIRMED by running the instrument against
   the b7 tree (§1.2b).
7. ⛔ **b8's OWN OPEN ITEMS ARE UNTOUCHED:** T-23/T-24 the countryside and road ladder, the four
   zoom defects (the clipped-institution spike, the block front line over empty ground, the orphan
   toft), GAP-B's flat gradient, T-05's fill bands, the metropolis grain, the click-region
   coverage, the §205A residue.

---

## §9 · JUDGMENTS (all vetoable; these AMEND B1…B8's lists)

- **J-B8b-1 · THE STALENESS HYPOTHESIS IS REPORTED REFUTED RATHER THAN QUIETLY REPLACED.** §230.1
  named a leading hypothesis; the evidence says otherwise, and the receipt leads with that.
  *Say "veto" and I will re-frame, but I will not re-derive the evidence.*
- **J-B8b-2 · THE PREDICATE IS SHARED AND THE CENSUS'S INDEPENDENCE IS BOUGHT WITH
  COUNTERFACTUALS INSTEAD.** The alternative — a deliberately independent second predicate for the
  censuses — was considered and rejected: two implementations of one question is the defect class
  this lane exists to close. So the census consumes the same proven predicate, and its
  non-vacuity comes from **planted bodies that must red** (7 counterfactual arms).
- **J-B8b-3 · THE WALL BAND'S SIDE FLOOR IS THE STROKE'S OWN HALF-WIDTH**, applied per FACE, so a
  serious town's glacis and a lax town's absent one are untouched wherever they already exceed the
  ink. It changes the band on the no-glacis leaves only.
- **J-B8b-4 · A FAUBOURG'S DISTRICT ID IS `${parent}~faubourg` WITH A `parentDistrictId`.** §232
  rules a faubourg is its own district; it therefore needs its own identity. ⚠ **This grazes the
  landed one-element-per-district-id public contract and is flagged, not taken as settled** —
  see §10.
- **J-B8b-5 · THE CYCLE IS CUT AT district-partition → circuit**, in two fixed passes, never
  iterated. The wall does not move for the quarters it splits.
- **J-B8b-6 · `wallClaims` WAS DELETED RATHER THAN DEPRECATED.** A duplicated rule with one
  spelling cured is worse than either spelling alone.
- **J-B8b-7 · THE §232 SMOOTHING RESIDUE IS HELD BY PROJECTION ONTO THE BAND FACE, NOT BY A
  RE-DERIVATION.** The growth was derived with the wall as its boundary; only the drawn outline of
  that growth is held to it. Re-deriving would have meant a third pass and an iteration risk.
- **J-B8b-8 · `wallCycle.js` EXISTS AS ITS OWN MODULE** rather than as two calls in `buildFabric`.
  §234 asks for cycles isolated as named bounded solver nodes; a named file is the cheapest
  possible expression of that, and it kept `buildFabric.js` under the ceiling (824 → 794).

---

## §10 · HAZARDS FOR THE LANDING EXECUTOR (additions to B1 §11 … B8 §15)

- ⚠⚠ **FOUR NEW SOURCE FILES** — `reservedGround.js` (137 eff), `wallCircuit.js` (244),
  `districtPartition.js` (103), `wallCycle.js` (23). **The executor owes a sizeBaseline row for
  each**, and MF-B8's warning stands: **the test census sits AT its pinned ceiling and this wave
  adds 18 TITLES in a NEW FILE** — `townMapWallCircuit.test.js` reds TWO censuses (the file census
  and the title census) unless both are landed with it.
- ⚠⚠ **`walls.js` NO LONGER EXPORTS `wallClaims`.** Every consumer must move to
  `wallCircuit.circuitClaims(fabric.wallCircuit)`; tests that construct rings by hand use
  `claimsOfRings(rings, builtRadius)`. A lane that re-adds `wallClaims` re-creates the divergence.
- ⚠⚠ **`groundLaw.TOUCH_EPS` IS NOW RE-EXPORTED FROM `reservedGround.js`.** Its value is unchanged
  (0.02) and its import path from consumers is unchanged, but there is now exactly one definition.
- ⚠⚠ **THE §232 FAUBOURG IDS ARE A PUBLIC-SURFACE CHANGE.** `umbrella.partition` now publishes
  regions whose `districtId` is `${parent}~faubourg`, plus `wallSide` and `parentDistrictId`
  fields. The landed **one-element-per-district-id** click-region contract still holds (ids are
  unique — pinned), but **five UI suites hit-test that surface** and a new id shape is
  owner-gated. **REPORTED, NOT TAKEN AS SETTLED.**
- ⚠⚠ **THE LENS NOW IMPORTS DOMAIN CODE FOR ITS WALL RUNS** (`circuitDrawnRuns`). `renderFolio` is
  still HARNESS; the four new modules are DOMAIN and stratum-agnostic.
- ⚠⚠ **THE GROUND LAW CLIPS MORE, SO THE DEMOTION LADDER FIRES MORE.** Corpus: 899 demotions,
  2,574 drops, and **182 MORE bodies surviving** than b8. Any pin keyed to a b8 drop count moves.
- ⚠ **NEW FABRIC KEY: `fabric.wallCircuit`.** `fabric.walls` is its `rings` — the same array
  object, so both names see one thing.
- ⚠ **`traceWalls` NOW RETURNS `bandParts.inkHalf`** alongside stone/inner/outer/width/half/shift.
- ⚠ **`buildFabric.js` IS AT 794/800 EFFECTIVE LINES BY THE LANE'S OWN INSTRUMENT** (b8: 790).
  My own stricter count reads 800. **Re-measure with the repo's sizeBaseline before landing** —
  the margin is six lines under one reading and zero under another.
- ⚠ **DECLARED SAME-SEED SHIFT (§110.3), causes 93–96, appended to MF-B8's ninety-two:**
  **93.** the reserved-ground predicate becomes AREA-TRUE, so 1,502 bodies across the corpus are
  clipped, demoted or dropped where they previously stood in a claim;
  **94.** the wall band gains a per-face side floor, widening the band on the no-glacis leaves;
  **95.** the drawn circuit is split at the gate circle's exact crossings instead of by dropping
  vertices, so every walled leaf's wall runs and gate openings move;
  **96.** §232 re-partitions district space at the wall, so every walled leaf's district washes,
  labels and click regions change and the extramural regions become their own districts.
  **Fifteen of sixteen leaves move; the thorp is byte-identical.**

---

## §11 · §234 PILOT NOTES — WHAT THE GRAPH IDIOM COST AND TAUGHT

*Input to the MF-ARCH wave. Written as findings, not as endorsement.*

1. ⭐⭐⭐ **THE SHARED OBJECT WAS NOT THE CURE, AND ASSUMING IT WAS WOULD HAVE SHIPPED THE DEFECT
   AGAIN.** §230 diagnosed a divergence between two geometries and prescribed one object. The two
   geometries were already one object, provably. **What diverged was the QUESTION, not the
   ANSWER.** The graph's content hashes are worth having, but they would have caught nothing here.
   **MF-ARCH should state the contract as: one artifact, one accessor, AND one proven predicate —
   with the census's independence bought by counterfactuals rather than by a second implementation.**
2. ⭐⭐⭐ **"CONSUMERS PULL THROUGH THE ACCESSOR" IS UNENFORCEABLE WHILE THE RAW HANDLE EXISTS.**
   The accessors verify the hash, so a consumer that uses them cannot be stale. Nothing stops
   `fabric.walls[0].polygon`. The only real enforcement I found was **deleting the second
   implementation** (`wallClaims`) — after which a consumer wanting a second reading has to write
   the algorithm itself, which a walker can see. **MF-ARCH's enforcement should be a source scan
   for raw-handle reads, not an honour system around accessors.**
3. ⭐⭐ **DECLARED INPUTS PAY FOR THEMSELVES IMMEDIATELY, AND THE COST IS ONE ARGUMENT-SHUFFLING
   FUNCTION.** Writing `WALL_CIRCUIT_INPUTS` forced me to notice that `traceWalls` reads the
   substrate, the road web and the umbrella through handles that are not facts. The split I landed
   — `inputs` (hashed, declared) vs `raw` (accessors onto facts already named) — is honest but it
   is a **seam a future lane can smuggle through**: a handle that gains a fact of its own escapes
   the hash silently. **MF-ARCH needs a rule for handles, not just for inputs.**
4. ⭐⭐ **THE CYCLE WAS REAL, SMALL, AND CHEAP ONCE NAMED — 23 EFFECTIVE LINES.** §234.1's
   correction ("one truth graph, not one solver") is borne out. What actually cost effort was
   **deciding which edge to cut**, and that decision is a domain judgment (a wall does not move for
   a quarter) rather than anything an SCC analysis can supply. **The diagnostic should report the
   SCC and demand a written cut edge; it must not choose one.**
5. ⭐⭐ **A CONTENT HASH OVER "WHAT THE NODE PUBLISHES" NEEDS A DELIBERATE BOUNDARY.** `waterGates`
   are attached to the rings by a later stage; had the hash covered them, every accessor would
   throw after that stage. Restricting the hash to the geometry the accessors publish is correct
   and is a **decision a future node author will have to make again, in a place where it is easy
   to get wrong in either direction** (too wide throws; too narrow misses a mutation).
6. ⭐⭐ **CANONICAL RESULT ORDERING FROM THE SPATIAL INDEX IS NOT OPTIONAL** — which claim clips a
   body first is a decision, and the determinism run is what proves it stable. 10/10 identical
   across 10 processes, with the digest **unchanged across a subsequent behaviour-neutral
   refactor**, which is the sharper proof of the two.
7. ⚠ **THE COST, MEASURED:** four new modules (507 effective lines), one deletion, five amended
   files, 18 new pins, ~100 s of suite time for the new file alone (it builds six fabrics), and one
   forced decomposition of `buildFabric.js` to stay under the domain ceiling. **The decomposition
   was a benefit disguised as a cost** — the input record belongs with the node that declares it,
   and the ceiling is what made me put it there.
8. ⭐⭐ **THE PILOT'S SHARPEST EVIDENCE CAME FROM RUNNING THE NEW INSTRUMENT AGAINST THE OLD
   TREE.** One `sed` of a tip path turned "the mechanism is plausible" into "MF-B7's own §200 cure
   was vacuous, 84 bodies, measured". **MF-ARCH should make instrument-against-prior-tree a
   standard step, not an afterthought** — a new census's first duty is to re-grade the waves that
   shipped under the old one.
9. ⚠ **THE PILOT DID NOT TEST THE HARD PART.** One node, one cycle, one hand-cut edge. Nothing
   here exercises demand-driven consumption, early cutoff, cross-node invalidation, or a graph
   large enough for the SCC diagnostic to be doing real work. **Treat these notes as evidence about
   the IDIOM's ergonomics, not about the ARCHITECTURE's scalability.**

---

## §12 · MEMORY-WORTHY FACTS FOR THE CHAIR

1. ⭐⭐⭐ **A CLAIM NARROWER THAN THE BODY THAT CROSSES IT IS INVISIBLE TO A VERTEX-SAMPLED
   PREDICATE.** 1,502 bodies stood in reserved ground under three censuses reading 0/0.
1b. ⭐⭐⭐ **A CURE AND ITS CENSUS WRITTEN IN THE SAME COMMIT FROM THE SAME PREDICATE MEASURE ONLY
   THE HALF OF THE LAW THE PREDICATE CAN SEE.** MF-B7 cured 408 bodies out of the wall bands and
   shipped the census that certified it — and 84 bodies were still standing in wall bands at b7,
   invisible to both. **Measured against the b7 tree, not inferred.** This is why the same
   contradiction reached the owner twice: the class survives cure-by-cure because each cure
   builds its own auditor out of the same blind question.
2. ⭐⭐⭐ **A CENSUS THAT INHERITS THE LAW'S OWN PREDICATE CANNOT REFUTE THE LAW.** The b8 censuses
   were faithful copies of `groundLaw`'s question. A census must share the law's GEOMETRY and must
   not share its BLIND SPOT.
3. ⭐⭐⭐ **SHARING THE OBJECT IS NECESSARY AND NOT SUFFICIENT** — the §230 fix, generalized
   correctly. Proven here by hash: the two surfaces were already one object.
4. ⭐⭐ **A RESERVATION WIDER THAN THE STROKE CAN STILL BE OFFSET FROM IT; CONTAINMENT IS A
   TWO-SIDED CLAIM.** MF-B7's "band ≥ ink" pin was green while the ink hung over the reservation.
5. ⭐⭐ **A DEFECT CURED IN ONE SPELLING OF A DUPLICATED RULE SURVIVES IN THE OTHER, AND THE TWO
   THEN DISAGREE ABOUT THE SAME TOWN.** B7 cured the gate split in the claim and not in the lens.
6. ⭐⭐ **A BOUNDARY THAT IS CORRECT ON THE LATTICE CAN BE SMOOTHED BACK ACROSS IT** — a derivation
   is only as exact as the last pass that touches its output.
7. ⭐⭐ **A "MOVE IT BACK INSIDE" THAT TAKES ITS DIRECTION FROM THE REGION RATHER THAN FROM THE
   BOUNDARY CAN MOVE IT FURTHER OUT.** My own first §232 cure did exactly that.
8. ⭐ **A BYTE-IDENTICAL LEAF IS A PROOF WHEN IT IS THE LEAF THE CHANGE SHOULD NOT REACH.** The
   thorp's sha survived a wave that moved fifteen of sixteen leaves.
9. ⭐ **A DETERMINISM DIGEST UNCHANGED ACROSS A REFACTOR IS A STRONGER RECEIPT THAN A GREEN
   SUITE** — it proves the decomposition was behaviour-neutral, which no assertion did.
