# lane REG-5 — THE DRAWN WORLD · BRIDGES · QUAYS · THE BYTE-CEILING MINT — RECEIPT

**Seat:** REG-5 (Opus implementer). **Chair:** Fable. **Base:** `6cd4b19efb763a3f7799d9d30974436236ac6545`
(`refs/preserve/map-sandbox-regseam-bands`, the REG-SEAM seal).
**Worktree:** `$SP/laneREG5-tree` (detached; no ref moved).

## §0 · SCOPE ECHO

Opening acts (maintenance): (1) `OP_CEILING_BY_TIER` city 10,000 → 10,100 · (2) `classify.mjs`
group-id cure + declared i1/i5/i7 baseline re-records + i5 re-verify · (3) the §634.3 kit
consolidation into `harness/instruments/` · (4) the three walker bills → 318/318.

Deliverables: (5) the countryside band (A2.2) · (6) L-REG-31 bridge alignment · (7) REG-QUAY
(the §635.4 waterfront exemption) **+ the §636.2 V-QUAY dress leg (chair addendum, mid-flight)**
· (8) the byte-ceiling mint proposal.

### ⚠ CHAIR ADDENDUM RECEIVED MID-FLIGHT (ODQ §636)
The warehouse blind re-round scored 33 %; quay warehouses with no quay furniture read as
farmsteads. REG-QUAY gains **V-QUAY** (chair-minted §636.2, vetoable): closed vocabulary —
bollard row (one row = ONE fixture) · hoist/crane · pier-deck edge · stacked goods/barrels —
provisional band **2–5 fixtures per drawn quay** at page register, built on REG-4's V-B13
furnishing machinery, anatomy bound to `$SP/reg-detail/DETAIL-REGISTER.md` waterfront anchors
where they exist (report THIN where they do not; never invent anatomy). Exits: fixture-count
census per drawn quay inside the band + planted control + quay crops among the judging artifacts.
The geometric exemption has priority; the dress leg is the one item that may be handed back
partially built.

## §1 · SETUP PROOF

```
worktree:  git worktree add "$SP/laneREG5-tree" 6cd4b19efb763a3f7799d9d30974436236ac6545   → EXIT 0
           HEAD is now at 6cd4b19ef "REG-SEAM 3/3: the §628 ceilings land…"
node_modules (render):  mkdir -p node_modules && cp -R <repo>/node_modules/seedrandom node_modules/
node_modules (gate):    PER-PACKAGE SYMLINKS into the repo's node_modules — 435 links, 434 entries.
           ⚠ THIS IS THE REG-SEAM LANE'S OWN METHOD, RE-DERIVED BY INSPECTION, not `ln -s` of the
           whole directory (the banked hazard). The tree gets its OWN node_modules directory so
           root-hoisting resolves from the tree, while the payloads stay shared.
           vitest resolves 4.1.11 · acorn resolves 8.18.0 · `npm ci` NOT run (EUSAGE, no lock).
           ⚠ 3 of the 40 declared deps are absent from the repo's node_modules — `three`,
           `@types/node`, `pg`. None is imported by the fabric or lint suites; recorded, not cured.
baseline:  node harness/exemplars.mjs $SP/reg5/renders/BASE   → 18 SVG + manifest = 29 files ✅
           ⚠ the corpus is 28 SVG + manifest.json = 29 ARTIFACTS (18 keys, two of which render
           six lenses); "29 files" and "28 artifacts+manifest" are the same count said two ways.
           Re-rendered after the node_modules build: 28 of 28 byte-identical. The symlinks are inert.
```

---

# §2 · OPENING ACT 1 — `OP_CEILING_BY_TIER` city 10,000 → 10,100 (ODQ §635.2) — **DONE, AND IT IS BYTE-INERT**

One value moved, with its cause written above it in the source.

```
export const OP_CEILING_BY_TIER = Object.freeze({
  thorp: 1000, hamlet: 1400, village: 2000, town: 9300, city: 10100, metropolis: 14200,
});                                                              ^^^^^ was 10000
```

### DORMANCY — **CONFIRMED, 29 of 29 byte-identical to the REG-SEAM seal**
```
28 of 28 SVG byte-identical (`cmp -s`), manifest.json byte-identical      same=28 moved=0
```
⭐ **THE FIXED-POINT CAVEAT DID NOT FIRE HERE, AND THAT IS A MEASURED RESULT, NOT AN ASSUMPTION.**
The §628 header warns that two mid-pass rations SPEND against `CEIL`, so a raise normally moves
the drawing (REG-4 measured town BASE 4,386 → 4,447 for the same picture when the pin moved).
At city the unarmed spend is 6,814 primitives against a 10,000 pin — the rations are nowhere near
biting, so a 100-primitive raise changes nothing. **No declared shift is owed for this act.**

### LIVENESS CONTROL — because a pin that changes nothing could equally be a pin nobody reads
```
MUTATION: city 10100 → 6000, corpus re-rendered
  city  prim 6814 → 6560     migration  prim 6818 → 6564
  MOVED city-city-accessible.svg   532264 → 517606
  MOVED city-city-darkFantasy.svg  526830 → 518895
  MOVED city-city-illustrated.svg  528069 → 520134
  MOVED city-city-parchment.svg    528153 → 520218
  MOVED city-city-vtt.svg          526249 → 518314
  MOVED city-city-watercolor.svg   528237 → 520302
  MOVED migration-city-parchment.svg 528578 → 520643
  → exactly the 7 city-tier artifacts, and NOTHING else, on all 28
RESTORE: 28 of 28 byte-identical to the pre-mutation render
```
**The pin is read, it rations exactly the city tier, and the raise is inert at today's spend.**

---

# §3 · OPENING ACT 2 — `classify.mjs` — **CURED, AND THE INHERITED DIAGNOSIS WAS WRONG ABOUT THE BIG HALF**

## §3.1 · ⛔⛔ THE CORRECTION OF RECORD — the +64 circles are REG-3's, not REG-4's

REG-I1 §2.2 attributed the +64 circles to REG-4's market furniture: *"all 64 new circles (the
ringed step-circle market cross, the conduit, the pond, the trough) are typed PLATE CHROME."*
**Refuted by single-arm renders.** Each arm rendered alone, circles on `town-town-parchment.svg`:

| arm | circles |
|---|---|
| unarmed base | 3 |
| `--fuse` | 3 |
| `--rampart` | 3 |
| **`--shapes`** | **67** |
| `--market` | **3** |
| `--footprint` | 3 |
| all five armed | 67 |

The circles are **REG-3's shape code**, and they live inside `<g id="landmarks">`.
`marketFurniture` is BATCHED — it carries **three** elements on the town leaf, not sixty-four.

## §3.2 · ⭐⭐ AND THE LARGER DEFECT WAS NEVER NAMED — THE CHROME-ZONE FLOOD

A per-rule probe (`$SP/reg5/classifyDiag.mjs`) records which of the classifier's 19 rules
convicted every element. On `town-town-parchment.svg`:

```
                        UNARMED          ARMED
chromeZones             10               74        (rect 7 + circle 66 + 1 cartouche)
landmarks group         95 landmark      119 landmark + 64 chrome(R4) + 57 chrome(R5)
census chrome           30               154
```

`chromeZones` is built **from raw tags before any role exists**, so each of the 64 landmark
circles planted a 22-unit-padded exclusion box; the point test then ate **57 landmark PATHS**
that were never rects or circles at all. That half is invisible in a role census — the elements
it eats are not of the type the census would make you look at. **121 of 240 landmark elements on
one leaf.**

## §3.3 · A FIFTH GROUP ID THE RECEIPT DID NOT NAME

Group ids across the armed corpus (28 artifacts): `precincts` is live on **8**, and the `inG`
ladder never knew it either. It is REG-3's, minted specifically to keep precinct voids OUT of the
landmark salience read, so it needed a role that is not `landmark`.

## §3.4 · THE CURE — one table, one reorder, one restriction

`$SP/reg-instruments/lib/classify.mjs` (pre-cure copy preserved verbatim at
`$SP/reg5/classify.PRE-CURE.mjs`, sha1 `5250267030ce481ac838c57d2275aa2c905f47cb`):

1. **`GROUP_ROLE`**, one exported table replacing the hand-written `inG` ladder that four waves
   had to remember to extend and did not:
   `fields→field · fabric→building · landmarks→landmark · yards→yard · squares→square ·`
   `marketOutline→square · marketFossils→building · marketFurniture→detail ·`
   `faubourgDistricts→ground · precincts→yard`
2. **`rect|circle → chrome` now runs AFTER the group table** (J-I1-3's stated cure).
3. **A chrome zone is planted only by an element OUTSIDE every drawing group.** This is the cure
   for §3.2 and it is byte-exact on the base corpus: all three base circles live in
   `<g id="legend">`, all seven zone-planting rects at root.

⭐ **THE CHROME-ZONE POINT TEST KEEPS ITS PRECEDENCE over the group table, deliberately.** Moving
the table above it as well was considered and rejected: with the flood stopped, a path lying
wholly inside a zone really is occluded by plate furniture, and a mask claiming those pixels would
sample the cartouche's colour rather than the drawing's. Only the one defective rule is reordered.

## §3.5 · THE MEASURED DELTA — `$SP/reg5/classifyDelta.mjs`, pre-cure module vs cured, same SVGs

```
══ UNARMED:  3 of 28 artifacts move, 6 elements re-roled
   corpus census delta: {"chrome":-6,"landmark":+6}
   metropolis / polycentric / town-2 — each ONE landmark circle (r<60) that planted a zone,
   and the ONE landmark path that zone ate. A small pre-existing defect in the base too.

══ ARMED:   28 of 28 artifacts move, 2,127 elements re-roled
   corpus census delta:
     landmark +1921 · chrome −1975 · building +51 · square +28 · street +10 · yard +8
     detail −19 · ground −4 · wall −2 · water −18
```
Every re-roled element attributed to its group (town-town-parchment, armed):
```
   64  landmarks|circle|chrome->landmark          1  marketOutline|path|detail->square
   54  landmarks|path|chrome->landmark            1  marketFurniture|path|ground->detail
    2  marketFossils|path|{detail,ground}->building
    2  faubourgDistricts|path|{detail,wall}->ground
    4  (root)|path|chrome->{detail,street,wall,wall}   ← paths the flood used to eat
```
⭐ `water −18` is a CORRECTION, not a loss: on the darkFantasy palette `bluish()` fired on the
market's batched furniture and on faubourg ground. A market pond drawn in `mix(paper,ink,0.30)`
was never the river.

## §3.6 · THE BASELINE RE-RECORD — **DECLARED, AND THE DECLARED SHIFT IS ZERO**

Pre-cure file preserved verbatim (never edited in place — the REG-I0b precedent):
`out/baselines-d1b32e339-PRE-REG5-CLASSIFIER-CURE.json`, sha1 `48268155ef749f1a3d2f5a6cda03aa8f9bb9dd38`.
Re-record: `node run-baselines.mjs --out=$SP/reg5/out/baselines-REG5CURE.json` → `BASELINES_DONE`.

```
per-instrument: rows total / moved / verdicts moved
   i1_squint             15 / 0 / 0
   i4_landmarkSalience    5 / 0 / 0
   i4_decoyControl        5 / 0 / 0
   i5_roleContrast       15 / 0 / 0
   i7_categoryHue        15 / 0 / 0
   TOTAL                 55 / 0 / 0
```

⭐⭐ **AND THE HONEST REASON, WHICH REFUTES REG-I1's OWN PREDICTION.** J-I1-3 said the cure "moves
the role masks on every plate and therefore every recorded i1/i5/i7 baseline, including the ones
at `d1b32e339` that four waves have been priced against." It does not. All five baseline plates —
`BASE-city`, `BASE-village`, `BASE-town`, `SPEC-city`, `SPEC-village` — read the **UNARMED**
`renders/base` SVGs, which carry none of the five group ids and no landmark circle. The defect is
armed-only, and the recorded baselines were never armed. **Four waves were not mis-priced.**

### ⛔⛔ THE CONTROL, BECAUSE A ZERO IS WHAT A DEAD INSTRUMENT RETURNS
`node ctrl/baselineLiveness.mjs` — i1 run twice over the same two plates, the arms differing ONLY
in which classifier they call. The mutant is a COPY with `landmarks` struck from the group table;
the live instrument was never mutated, so no sibling lane could read a broken classifier.

```
── BASE-city        landmarkEls   groundPx   streetPx   squint.street   1−OVL
   LIVE                      94       8924       6183          1.5706   0.6806
   MUTANT                     0       8512       6183          1.6625   0.6953   → MOVED
── BASE-village
   LIVE                      22       1083       2692          1.3087   0.7488
   MUTANT                     0        939       2692          1.4629   0.7865   → MOVED
REG5_BASELINE_CONTROL LIVE
```
⭐ `LIVE`'s `squint.street = 1.5706` on BASE-city **reproduces the recorded baseline figure
digit for digit** — an independent check that the re-record re-derived the row rather than
copying it.

## §3.7 · THE i5 RE-VERIFY, ARMED — **REG-4's "ZERO VERDICT REGRESSIONS" SURVIVES THE CORRECTION**

`node regI1-i5contrast.mjs` re-run **unchanged**, against **byte-identical inputs** (REG-I1's own
`renders/regI1-{base,all}` + `png/regI1/*.png` at the REG-4 seal `7fba086d5`). The only thing that
differs between REG-I1's recorded run and this one is the classifier — a clean isolation, and one
that needed no new Chrome shot.

| leaf · arm · pair | PRE-CURE | POST-CURE | Δ | verdict |
|---|---|---|---|---|
| town · base · street:ground | 1.7529 | 1.7529 | 0.0000 | FAIL→FAIL |
| town · base · wall:all | 7.7536 | 7.7536 | 0.0000 | PASS→PASS |
| town · base · water:ground | 1.5164 | 1.5164 | 0.0000 | PASS→PASS |
| town · armed · street:ground | 1.8548 | **1.8494** | −0.0054 | FAIL→FAIL |
| town · armed · **wall:all** | 4.2681 | **4.2731** | **+0.0050** | PASS→PASS |
| town · armed · water:ground | 1.5291 | **1.5247** | −0.0044 | PASS→PASS |
| city · base · (all three) | 1.8818 / 7.2925 / 1.3168 | unchanged | 0.0000 | FAIL/PASS/FAIL |
| city · armed · street:ground | 1.7270 | **1.7255** | −0.0015 | FAIL→FAIL |
| city · armed · **wall:all** | 4.6529 | **4.6645** | **+0.0116** | PASS→PASS |
| city · armed · water:ground | 1.1246 | **1.1236** | −0.0010 | FAIL→FAIL |
| village · base/armed · street:ground | 1.9003 / 1.9640 | 1.9003 / **1.9620** | 0/−0.0020 | FAIL→FAIL |
| village · wall:all, water:ground | n/a (unwalled, dry) | n/a | — | n/a |

**VERDICT REGRESSIONS: 0**, now measured over the corrected classification rather than over a
population in which 121 of 240 landmark elements were filed as plate chrome.

### ⚠⚠ THE §635.3 WATCH ROW, ANSWERED BEFORE ANY BUILD PROCEEDED
The standing order: any change touching circuit ink or its surroundings re-measures `wall:all`
FIRST. Measured:

```
                       REG-SEAM       this cure     headroom vs floor 3.00
town  wall:all         4.2681    →    4.2731        1.2731  (was 1.2681)
city  wall:all         4.6529    →    4.6645        1.6645  (was 1.6529)
wall PIXELS  town      6028      →    6021          (−7 of ~6,000)
wall PIXELS  city      6662      →    6644          (−18 of ~6,600)
wall MEAN RGB          [89,79,65] →   [89,79,65]    unchanged, both leaves
```
**The cure does not soften the circuit — it improves the row by 0.1–0.3 %.** The seven/eighteen
lost wall pixels are hf311's TOLL BAR, drawn in wall ink inside `faubourgDistricts` and now
correctly filed as district ground. Wall mean colour does not move at all. Cleared to proceed.

---

# §4 · OPENING ACT 3 — THE KIT CONSOLIDATION (§634.3) — **DONE, ZERO BEHAVIOUR CHANGE PROVED**

`harness/instruments/` now holds the four reusable pieces, each with the hazard it exists to stop
written into its own header:

| file | what moved in | the law it carries |
|---|---|---|
| `leaf.mjs` | corpus row → built fabric, through the harness's own `buildOne` (never a fork) | ⚠⚠ `artifactName(key, lens)` composes the EXACT `<key>-<tier>-<lens>.svg`. The `town-*` glob matches `town-2-town-parchment.svg` first and has bitten this programme four times; the kit removes the shape of the mistake, not just an instance |
| `digest.mjs` | artifact hashing, dir comparison, dormancy/determinism folds | ⛔⛔ `livenessAgainst()` makes the differs-from-unarmed control part of the MEASUREMENT. A double-run compares an arm to itself and cannot tell deterministic from never-ran — a 29/29 "armed" pass at REG-SEAM had rendered the unarmed corpus four times |
| `control.mjs` | the planted-control scaffold | the four steps made mandatory: measure clean · plant · prove it MOVED · restore and PROVE the restore. The restore runs in a `finally`, so a throw inside the measurement cannot leave a planted file on disk. `inputControl()` is the preferred variant where the damage can be expressed as an input |
| `crops.mjs` | rule-first box selection + the bounded shot | a box cannot be constructed without its rule string (`ruleBox` throws otherwise) — *a crop chosen after looking is a crop chosen to flatter*. `shootBounded()` is J-REG4-11 made mechanical: wall-clock bound, and **the verdict is the PNG's existence and size, never the exit status** |

Re-pointed: `laneREG3/leaf.mjs` (now a thin re-export) · `laneREG2/pickCrops.mjs` · `laneREG4/seamCensus.mjs` · `laneREG4/sliverCensus.mjs` · `laneREG4/crops.mjs`.

### THE PROOF — one census per wave, byte-identical stdout
```
                       before → after
  REG-4 seam census      IDENTICAL   (ARM 1 TOKEN 0 of 18 · ARM 2 DOORWAY 0 of 175 · ZERO TINT SEAMS)
  REG-4 sliver census    IDENTICAL   (ARMED 0 of 26,751 · CONTROL C1 DISARMED 1,984 of 28,662 POSITIVE)
  REG-3 typing probe     IDENTICAL   (16,286 bytes)
  REG-2 crop picker      IDENTICAL   (LAND 219 -55 150 150 · TERM 189 549 … · CORNER 482 401 …)
```
All four exited 0 and `cmp` reports no difference on any byte.

---

# §5 · OPENING ACT 4 — THE THREE WALKER BILLS — **318 / 318**

### The bills, read off an executed gate rather than inherited
```
BEFORE (lane base, clean worktree):  15 files · 318 collected · 315 passed · 3 FAILED
  1  derivationGraph.walker  · the hand-minted fork keys are EXACTLY the frozen inventory
     expected {…13} to deeply equal {…15}   ADDED: marketRegister.js 2 · shapeCode.js 3
  2  stageManifest.walker 1  · every fabric module is assigned to exactly ONE node
     UNASSIGNED 6: faubourgOrigin · frontageFusion · marketRegister · minFootprint
                   · rampartWorks · shapeCode
  3  stageManifest.walker 2  · every node's allowedImports EQUALS its real import set
     ASSEMBLY import drift: MISSING walls.js
```
⚠ **THE SANDBOX TREE DOES NOT CARRY `tests/setup/fastCheckSeed.js`**, which `vite.config.js`
names as a setup file. Without it the whole suite reports **15 failed / "no tests"** — the exact
ZERO-COLLECTED presentation the banked node_modules hazard warns about, from a different cause.
Cured by copying the ledger branch's own file unmodified (sha-matched, untracked, never staged).

### The registration — DERIVED, never guessed
Guessing costs 277 s a guess, so the walker's own `derive()` was **lifted out of vitest**
(`$SP/reg5/deriveManifest.mjs`, verbatim, reading the same `stageManifest.js`) and every candidate
evaluated in under a second. Assignments chosen so that **no new backward edge and no SCC change**
is created — checked, not hoped:

| module | node | why | new cross-node edges |
|---|---|---|---|
| `frontageFusion.js` | **S10** | fuses the packer's own parcels, called immediately after `packFabric` | none (adds `reservedGround.js` to S10's allowed set; `PRIMITIVES>S10` already exists) |
| `shapeCode.js` | **S11** | S11 *is* the shapes stage; `composeInstitution`/`composeFarmstead`/`roofFormFor` | none |
| `marketRegister.js` | **S7** | L-REG-6 — a market is one giant street; the void surface IS the street web | none |
| `rampartWorks.js` | **S13** | `bandRegime`/`wearGrade` are wall-band works, imported beside `walls.js` | **`S4>S13`** (it reads `waterMode.js`) — forward, so no inversion |
| `faubourgOrigin.js` | **S15** | habitation builds the faubourgs; origin typing types them | none |
| `minFootprint.js` | **S20** | a late ink-side suppression over already-drawn bodies | none |

⛔ **NONE went into `S1/S8/S9/S12`.** Those are `UNBUILT_STAGES`, and arm 8 asserts they own no
module — filling a declared hole to make a red go away would have been the weakening move.

Derived fields brought current (all re-derived from source, none invented):
`S7.randomNamespaces` +`*|*|a`, +`*|b13|*` · `S10.allowedImports` +`reservedGround.js` ·
`S11.randomNamespaces` +`*|roof|*` · `S13.allowedImports` +`waterMode.js`,
`randomNamespaces` +`rampart.E*`, `statefulForkSites` **2 → 3** ·
`ASSEMBLY.allowedImports` +7 · `NODE_EDGES` +`S4>S13` (88 → 89).

### ⭐⭐ A FOURTH BILL THE INHERITED LIST DID NOT NAME — the whole-fabric fork pin
Registering the six made arm 4's TOTAL pin red: `expected 18 to be 17`. **The eighteenth stream is
not new code.** `rampartWorks.js` has carried one `fabricRng(` since REG-2 landed and was invisible
because `derive()` skips an unassigned file outright (`if (!node) continue;`). Measured, per module:
```
rampartWorks.js 1   marketRegister.js 0   shapeCode.js 0
frontageFusion.js 0   minFootprint.js 0   faubourgOrigin.js 0
```
**Five new fabric modules across four waves and exactly one stateful stream between them.** The pin
moves 17 → 18 because the census got honest, not because a wave opened a stream — declared in the
test's own source, never silently.

```
AFTER the six assignments:  318 collected · 317 passed · 1 FAILED  (arm 4's total pin, above)
AFTER the 17 → 18 pin edit:  see §12's gate at the committed tip — the figure quoted there is
                             the one taken AFTER the last edit, and it is the only one that counts
        +0 test files · +0 collected
```
⚠ The registration is **read-side only** and that was proved, not assumed: the unarmed corpus is
**28 of 28 byte-identical** after the manifest edit.

---

# §6 · DELIVERABLE 5 — THE COUNTRYSIDE BAND (A2.2) — **HALF MET, AND THE OTHER HALF IS OWNER-GATED**

Band: countryside coverage at village tier within ±10 points of the corpus-measured 85 % → **[75, 95]**.

## §6.1 · TWO INDEPENDENT INSTRUMENTS, AND THEY AGREE

⭐ The quantity was measured twice by paths that share no code below the artifact: a
stage-rasterizer that reads `renderFolio`'s countryside passes directly, and
`$SP/reg5/countryside.mjs`, which never looks at the renderer and reads the emitted SVG through
`lib/classify.mjs`'s role masks — the same masks i1 and i5 measure through.

| leaf | tier | stage rasterizer | role masks | in band? |
|---|---|---|---|---|
| **`village-village-parchment`** | village | **85.8 %** | **88.4 %** | ✅ **IN BAND on both** |
| **`mountain-village-parchment`** | village | **32.3 %** | **40.0 %** | ⛔ **OUT on both**, by 42.7 / 35.0 points |
| town (cross-check) | town | 57.0 % | 64.1 % | n/a |
| thorp / hamlet | — | 89.2 / 84.6 | 90.7 / 87.1 | n/a |
| fjord / city / metropolis | — | 5.7 / 3.8 / 28.9 | 54.4 / 52.6 / 35.9 | n/a |

The two disagree in LEVEL on water-bearing leaves (the role-mask instrument counts the `water`
role as drawn countryside; the rasterizer does not) and agree closely everywhere the difference
cannot bite. **On the two village-tier leaves — the only ones the exit names — they agree on the
verdict and on which leaf fails.**

**VILLAGE TIER: 1 of 2 leaves in band.**

### The metric, stated with its denominator
`coverage = |extramural cells carrying a countryside mark| / |extramural cells|`, on a 500×500
decision grid over the 1000×1000 folio. **DENOMINATOR in words:** every cell NOT inside the urban
envelope — the 22-unit morphological closing of the building ∪ landmark mask, the same envelope
`rolePopulations` uses and the same region stage 6 floods with the urban wash. The leaf carries no
neatline, so the frame is the whole viewBox. **NUMERATOR:** the `field`, `detail`, `yard`, `square`
and `water` roles. `chrome` and `text` are excluded — the cartouche is not countryside, and a
metric that counted plate furniture would reward a bigger legend.

⛔ **`fabric.fields.coverage` IS NOT THIS METRIC and must never be substituted for it.** It is
`drawnUnits / supplyUnits` — the share of the WORKED ZONE that got drawn, counting parcel area
that falls off the leaf entirely. It reads **0.9109 on village and 0.7208 on mountain**, which
would make the mountain look like a 72 % leaf rather than a 40 % one.

## §6.2 · ⭐⭐ THE CAUSE IS NOT A BUDGET, AND THAT IS THE WHOLE FINDING

The mountain leaf is not short of ink; it is short of **published truth**. Measured, same seed,
both leaves at village tier:

| | village | mountain |
|---|---|---|
| `fields.arableShare` | **1.0000** | **0.5759** |
| dry cells | 117 | 191 |
| arable cells | **117 of 117** | **110 of 191** |
| lands REFUSED | 7 | **79** |
| `supplyUnits` | 1,500,668 | **781,507** |
| relief marks (hachures/hills/formLines) | 37 / 18 / 15 | 37 / 18 / 15 |
| op spend vs the village ceiling 2,000 | 1,226 | **1,540 (460 spare, 23 %)** |

**42 % of the mountain's dry ground is refused for tillage, and the fabric publishes NOTHING for
the ground that refusal frees.** Enumerated at the source: there is no `orchard`, no `pasture`, no
`meadow`, no `woodland`/`canopy` and no `waste` anywhere under `src/domain/townMap/fabric/` —
`fields.js`'s own prose says *"the surplus is pasture, wood and waste"* and then publishes no
surface for any of the three. The only tree geometry in the whole fabric is
`fields.trees` — isolated hedgerow trees, 59 of them on this leaf.

⭐ **AND THE OP BUDGET WOULD CARRY THE CURE.** The arithmetic, because "there is headroom" is not
a measurement: 40 % coverage on mountain is ~97,800 marked cells from roughly 400 countryside
marks — about **245 cells a mark**. The 460 spare primitives under the signed village ceiling are
worth ~112,700 cells, which would take the leaf from 40 % to about 86 %. **The ceiling is not the
constraint. The missing surface is.** No §217 raise is asked for and none would help.

## §6.3 · WHAT REG-5 DID **NOT** BUILD, AND WHY — the exit's second clause

The charter's exit is *"in-band on the village-tier leaves **or a reported measured need for a
signed raise**"*. This is the second clause, and the need is not for a ceiling raise.

Closing the mountain gap requires drawing something on ground the fabric declares unploughable.
Every candidate is a **new fabric surface** — a pasture/wood/waste derivation with its own siting
law, its own determinism, its own census and its own three-ratchet bill. Under J-REG3-1
(**consumption over invention**) that is not this lane's to mint, and under the standing gate list
it is the **new capability versus repair** class, which is owner-gated whatever the delegation.

**J-REG5-6 · The countryside band is reported at 1 of 2 village leaves rather than forced to 2 of
2.** Chose: report the measured structural cause and stop. Rejected: (a) drawing relief hachures
denser to pad the number — it would move the metric without drawing the countryside, which is
exactly the "instrument pointed at nothing" failure this programme keeps banking; (b) minting a
pasture/wood/waste surface inside a presentation wave — new capability, owner-gated, and it would
arrive unattributable inside a wave carrying four other deliverables. **Say "veto" to flip it.**

### ⚠ THE CHAIR'S MONOCULTURE ADVISORY, ANSWERED WITH A MEASUREMENT — and it is HALF right

The advisory reports the countryside as *"100 % of dry ground ploughed — no meadow, pasture,
common, waste, orchards, or field lanes anywhere"*. Measured at the seal, unarmed:

| leaf | tier | `arableShare` | `fields.lanes` | `outlyingLanes` | hedges | trees | commons |
|---|---|---|---|---|---|---|---|
| thorp | thorp | **1.000** | 5 | 0 | 111 | 61 | 0 |
| hamlet | hamlet | 0.975 | 7 | 4 | 117 | 55 | 0 |
| village | village | **1.000** | 5 | 3 | 117 | 48 | 1 |
| mountain | village | **0.576** | 3 | 2 | 110 | 59 | 1 |
| town | town | 0.878 | **0** | 8 | 77 | 33 | 1 |
| fjord | town | 0.119 | 4 | 7 | 43 | 17 | 2 |

**CONFIRMED:** no meadow, pasture, waste or orchard surface exists anywhere in the fabric — the
audit is exactly right, and `fields.js`'s own prose (*"the surplus is pasture, wood and waste"*)
publishes none of the three. On the two plains leaves `arableShare` really is 1.000.

**REFUTED, and it matters because lanes are the advisory's own preferred variety-neutral
element:** field lanes DO exist and ARE drawn — 3–7 per rural leaf, emitted at `renderFolio.mjs`
1c (`fields.lanes`) and 1d (`outlyingLanes`), plus 110–117 hedgerows and 48–61 hedgerow trees.
The one leaf with **zero** field lanes is `town`. So the variety-neutral surface the advisory
would reach for is already there, already consumed, and already counted in the 88.4 %.

**J-REG5-7 · The band was NOT reached by hardening the monoculture, and nothing is pinned to
"coverage = arable".** Chose: count what exists — the metric's numerator is the `field`, `detail`,
`yard`, `square` and `water` ROLES, not the arable strip count, so a leaf that later swaps strips
for pasture at the same coverage reads the same number and REG-H cannot be forced to regress it.
Rejected: (a) more arable to hit the number — it is the wrong drawing and REG-H would undo it;
(b) more lanes/closes to pad — measured, the shortfall is 35 points on `mountain` and lanes are
worth single points, so it would not reach the band and would spend REG-H's design space to fail;
(c) any test pinning a coverage figure — **no test was written for this metric at all**, so no
ratchet stands in REG-H's way. The shortfall is reported for the signed decision instead.
**Say "veto" to flip it.**

---

# §7 · DELIVERABLE 7 — REG-QUAY (§635.4) — **CURED, AND THE RULING'S OWN MECHANISM WAS THE MINORITY CAUSE**

## §7.1 · ⛔⛔ THE CORRECTION THE CHAIR MUST SEE FIRST

§635.4 pins the defect on `bodyRefusal` having no waterfront exemption. That clause is real. It is
also **not where the piers die.** Measured over 162 composed piers:

```
   bodyRefusal / standing-water .......   5
   bodyRefusal / crag ................    6
   clipped to nothing by the WATER CLAIM  93
   clipped below the area floor ......   34
   ────────────────────────────────────────
   127 of 162 (78 %) die at enforceGround STEP 1's right-of-way clip, not at step 3d.
```

**Why `bodyRefusal` mostly misses, and it is worth banking:** it reads `sub.wet` — the substrate's
hydrology — which is a **different surface** from the drawn watercourse. Measured pier-centroid
wetness on the river leaf runs **0.070–0.153 against a 0.64 limit**. A body can be standing in the
drawn river and read as bone dry to the ground law.

⭐ **Curing only the named clause would have rescued about one pier in fourteen and reported a
fix.** The contradiction is the same contradiction — one law moors what another erases — so the
exemption was applied wherever the water erases a moored body. **This is a divergence from the
literal ruling and it is recorded here to be vetoed in isolation (J-REG5-3, §11).**

## §7.2 · THE CURE

| file | change |
|---|---|
| `groundRefusal.js` | `bodyRefusal(sub, poly, exempt)` — an optional exempt-clause list, plus `WATERFRONT_EXEMPT_CLAUSES = ['standing-water']`. ⛔ **`crag` is NEVER exempt**: a pier may stand in the water, nothing may stand on a cliff. `exempt` is an explicit argument, never a field read off the polygon — a polygon does not know it is a quay, its OWNER does |
| `groundLaw.js` | `enforceGround` builds a second, DRY claim set (`water.channel` / `water.shore` withdrawn) and a moored institution part answers to it in steps 1, 3, 3c and inside `demoteBody`. ⛔ **Streets, wall circuit, party lines and crag are untouched** — a quay may stand in the river; it may not stand in the high street |
| `buildFabric.js` | `waterfront: options.waterfrontExemption === true` — ARMED-ONLY; plus three census rows on `meta`, published on every leaf so a reader can tell "no quays here" from "the arm is dormant" |
| `harness/exemplars.mjs` | `--quay` |

⭐ **THE MOORED PREDICATE READS A STAMP THAT WAS WRITE-ONLY.** `moorWaterBound` has always
written `lm.fronts = 'water'` with the reason *"§161m physical absolute: a quay answers to the
water, not to a street"* — and **nothing between that write and the ground law ever read it.**
That is how the contradiction survived: the intent was recorded and never consulted. `owner` was
already on the enrolment record at `groundLaw.js` and already unused.

## §7.3 · THE DRAWN-QUAY CENSUS — 24 declared seeds

Seeds `reg5-quay-01…24`, tier cycling village/town/city/metropolis, terrain cycling
coastal/riverside, **written down before anything was measured**. Nothing forces a port.

```
   UNARMED       quays 10 · DRAWN 4 · UNDRAWN 6 · piers  7 · moored 10 · exempted 0  (clause saved 0)
   ARMED --quay  quays 10 · DRAWN 7 · UNDRAWN 3 · piers 18 · moored 10 · exempted 30 (clause saved 3)
   Δ drawn +3 · Δ undrawn −3 · Δ piers +11
```
⭐ **`clause saved 3` of 30 exempted bodies is §7.1's finding stated as a counter** — the counter
is the COUNTERFACTUAL (the unexempted question re-asked), not the population. The clause the
ruling names saved three; the claim withdrawal saved the other eleven piers.

### ⚠ MY HONEST NUMBER IS 6 OF 10 UNDRAWN, NOT 4 OF 12
The ruling's figure was 4 of 12; a sibling recon measured 2 of 11. The spread is a **predicate**
difference, not a sampling one: `lm.solids.length > 0` counts a quay as drawn when the ground law
has left it an array of EMPTY polygons (`it.ref[it.field] = []` at `groundLaw.js`). This census
requires a solid of **at least three points**, because a two-point ring draws nothing. Both
readings are reported; the stricter one is the one a reader can see on the plate.

### THE THREE THAT REMAIN, ATTRIBUTED — and they are the law working
All three are `cat:fish_market` on **village/coastal** leaves, and none dies to water:
```
   reg5-quay-01  part 0/1 deepest 6.78  by street.road.approach.corridor.2~frame.2
   reg5-quay-09  part 0   deepest 5.43  by street.road.approach.corridor.2~frame.2
                 part 1   deepest 7.82  by street.high
   reg5-quay-13  part 0/1 deepest 12.32 by street.high
   (control: reg5-quay-05, same 5.43 penetration, IS drawn — its parts clear the area floor)
```
**The exemption deliberately does not withdraw the street's right-of-way**, so these are quays
sited across a carriageway. That is a SITING question, not a waterfront one, and it belongs with
the L-REG-32 siting car rather than here. **Deferred with reason; not a bug to re-find.**

### THE PLANTED CONTROLS — both LIVE, restore proved
```
   C1 · UNMOOR AT SOURCE (waterWorks.js, `lm.fronts = 'water'` → 'street')
        armed     quays 1 drawn 1 piers 4 moored 1
        unmoored  quays 1 drawn 1 piers 2 moored 0
        restored byte-identical: true   (sha 2441dfd3… before AND after)
        → LIVE — the plant moved the measurement and the file restored byte-identical
   C2 · BLIND THE COUNTER (one quay's solids emptied): drawn 1 → 0
        → LIVE — DRAWN is a function of solids, not of the roster
```
⚠ C1 runs its measurement in a **child process**. ESM caches the module graph, so a plant measured
in the process that already imported the file re-measures the pre-plant code and reports a DEAD
control on a live cure. Banked.

⛔ **THE LEGACY `port` PATH IS DELIBERATELY NOT CURED** (§635.4). `glyphAssign.js` / `massing.js`
carry the same defect, import nothing from `fabric/`, and die at the cutover. Confirmed separate
by execution: no file outside `src/domain/townMap/fabric/` imports any fabric module.
**Documented, not a bug to re-find.**

## §7.4 · V-QUAY — THE DRESS LEG (chair addendum, ODQ §636.2) — **BUILT, 7 of 7 IN BAND**

Why it exists, in the blind reader's own words: a quay warehouse with no quay furniture reads as
a **farmstead**. The shed is not the tell; the working gear on the apron is.

⭐ **NO NEW FABRIC MODULE.** `deriveQuayRegister` lives in `waterWorks.js`, which already owns
quay mooring and is already registered at S17 — so the dress leg costs **zero** stage-manifest
rows, zero new walker bills and zero new module registration. The quay's furniture belongs with
the quay's water works; the cheap answer and the right answer are the same one here.

### The closed vocabulary, every member anchored — **nothing is THIN**
| kind | anatomy anchor (`$SP/reg-detail/DETAIL-REGISTER.md`) |
|---|---|
| `bollardRow` | hf322 *"ashlar quay with bollards"* + hf133's mooring swing circles. ⭐ **ONE ROW = ONE FIXTURE** (§636.2 verbatim), exactly as V-B13's stall row is |
| `hoist` | hf122 *"treadwheel cranes with dashed swing arcs"* — a wheel-and-jib PLAN with its dashed arc |
| `pierDeckEdge` | hf322 *"timber jetty on pile dots"* |
| `goodsStack` | hf122 *"countable cargo — barrels with stave lines, crates, jars, timber"* |

⛔ **PROJECTION IS STRICT TOP-DOWN.** hf122 titles itself a PLAN study and hf265 reads "HULLS FROM
ABOVE"; there is no elevation anywhere in this vocabulary. Placement is `hashUnit`-deterministic
off the leaf's own fork key, on REG-4's V-B13 pattern. The gear takes its own
`<g id="quayFurniture">` — filed among `landmarks` a bollard row would enter instrument 4's
salience read as a MONUMENT, and filed at root it would fall to the very `rect|circle → chrome`
rule this lane's opening act had to cure. The classifier was taught the id in the same act.

### THE CENSUS — 24 declared seeds, band 2–5 per DRAWN quay
```
   drawn quays 7 · furnished 7 · fixtures 21 · mean 3.00 · IN BAND 7 of 7
   vocabulary: bollardRow 7 · pierDeckEdge 7 · goodsStack 5 · hoist 2
      reg5-quay-05 village  cat:fish_market   2  bollardRow, pierDeckEdge
      reg5-quay-06 town     name:fishmonger   4  bollardRow, pierDeckEdge, goodsStack, hoist
      reg5-quay-10 town     name:fish-market  3  bollardRow, pierDeckEdge, goodsStack
      reg5-quay-14 town     name:fishmonger   4  bollardRow, pierDeckEdge, goodsStack, hoist
      reg5-quay-17 village  cat:fish_market   2  bollardRow, pierDeckEdge
      reg5-quay-18 town     name:fish-market  3  bollardRow, pierDeckEdge, goodsStack
      reg5-quay-21 village  cat:fish_market   3  bollardRow, pierDeckEdge, goodsStack
   VERDICT: EVERY DRAWN QUAY FURNISHED IN BAND — 7 of 7
```
⛔ **THE DENOMINATOR IS *DRAWN* QUAYS.** A quay whose piers the ground law ate has no apron, and
furnishing it would be the dress leg papering over the defect the geometric leg exists to cure.

### CONTROLS — all three LIVE
```
   C1 · ARM WITHDRAWN (no --vquay): furnished 0        → LIVE, the census reads zero unarmed
   C2 · GEOMETRIC DEPENDENCY (--vquay WITHOUT --quay): furnished 4 vs 7 armed both
        → LIVE — fewer quays survive to be furnished, so the dress DEFERS to the geometry
   C3 · THE BAND (a planted 7-fixture quay): CAUGHT   (real out-of-band in sample: 0)
```
⭐ **C2 is the control that matters** and it is the one a dress leg usually does not have: it
proves the furniture cannot appear on a quay the ground law erased. 15 of 28 armed artifacts carry
`<g id="quayFurniture">`.

---

# §8 · DELIVERABLE 6 — L-REG-31, THE BRIDGE ANGLE CENSUS — **MEASURED; 4 OUTLIERS, AND A WORSE FINDING BESIDE THEM**

Measured from the **FABRIC**, not the SVG, and the equivalence was proved rather than assumed: all
nine deck paths on `town`/`highwater`/`crossing` were found **verbatim** in the emitted SVG, long
axis = `along × 360/1024` to 0.01°. The 28 artifacts are only **18 distinct fabrics** (town and
city ship six lenses each), so per-SVG measurement would count one geometry six times.
**BASE and ARMED bridge/river records are byte-identical** (executed diff), so one table covers both.

### The tangent, and why the obvious estimator was abandoned
The river polyline is dense: **290 vertices over 1,508 units, mean spacing 5.22 = 0.31× the
river's own width.** A single segment is a sub-width detail, not a tangent; a windowed chord
over-smooths at bends. So the primary instrument is **window-free**: the true normal is the
direction of the **shortest wet crossing** through the bridge point, scanned at 0.25° against the
drawn wet set. Its perpendicular IS the local tangent, defined by geometry rather than by a window.

**Sensitivity — the census swings on the window, which is why the window had to go (n=19):**

| tangent estimator | inside ±15° | outside | median dev | max dev |
|---|---|---|---|---|
| **true normal (primary, window-free)** | **15** | **4** | **7.8°** | **80.0°** |
| the code's own `across` (1 segment) | 15 | 4 | 7.4° | 79.8° |
| chord ±0.25w | 15 | 4 | 10.8° | 78.4° |
| chord ±0.5w / ±1w / ±2w | 9 | 10 | 16.7 / 20.4 / 28.5° | ~80° |
| PCA ±1w | 9 | 10 | 17.4° | 80.1° |

**Instrument negative control (CONFIRMED):** on synthetic straight rivers of known width 16 the
shortest crossing measured **16.000 at 89.75°**; a deck 45° off-normal measured **22.627**
(16/cos45 = 22.627); 75° off measured **61.819**; a dry probe returned **null**, not a number.

### THE CENSUS — published on both bases, because the denominator is not the same
```
   18-leaf corpus       15 inside ±15°  ·  4 outside  ·  fail rate 21.1 %
   12 distinct sites     5 inside       ·  4 outside  ·  fail rate 44.4 %   ← the honest headline
```
Six leaves (`town`, `siege`, `plague`, `famine`, `year-018`, `year-100`) are ONE site carrying the
same two bridges with identical values. **The honest reading is 4 of 9, not 4 of 19.**

| dev | leaf | key | crosses |
|---|---|---|---|
| **80.0°** | highwater | `wallLane.main.run.new-cutting.12\|3` | 105.76 of a 17.57 reach = **6.02×** |
| **71.9°** | crossing | `street.high\|55` | 114.97 of a 16.71 reach = **6.88×** |
| **39.2°** | crossing | `…corridor.1~frame.1\|118` | 21.75 of a 16.71 reach = 1.30× |
| **19.7°** | highwater | `street.ringOld.E2\|1` | 19.07 of a 17.57 reach = 1.09× |

Conforming decks run **1.004–1.086×** the shortest crossing; every defect is **≥ 1.302×**.

### ⛔⛔ THE FINDING THAT OUTRANKS THE ANGLE — TWO DECKS NEVER REACH DRY LAND
The drawn deck is `2 × max(span·0.85, width·0.9)` and `span` is always the **nominal** river width,
so the deck is a fixed ~1.7× the river width **regardless of the crossing it actually has to make**.
Endpoint clearance measured on all 19:
```
   highwater  wallLane…|3     endA −6.94   endB −4.07   ⛔ BOTH ENDS IN THE WATER
   crossing   street.high|55  endA −4.09   endB −8.10   ⛔ BOTH ENDS IN THE WATER
   all other 17               +2.42 … +6.13 / +2.61 … +8.10   dry
```
**Two 28–30-unit planks floating in the middle of a 105–115-unit stretch of water, touching
neither bank.** That is a visible ink defect, not a tolerance question.

### ROOT CAUSE, measured — `waterMeetings`' TRANSIT verdict does not bound the water covered
```
   all 15 conforming   incursion 4 segs · run chord 1.46–1.56× riverW · first seg 0.37–0.39×
   highwater ringOld|1     1 seg · 6.49×      highwater wallLane|3   1 seg · 13.42×
   highwater ringOld|11    1 seg · 12.58× (yet dev 4.8° — square by luck)
   crossing  street.high  16 segs · 6.07×  (the street runs DOWN the channel, then emerges)
```
Two mechanisms, one cause: a coarse single segment 6.5–13.4× the river's width skims the claim and
lands its dry ends on opposite banks, so it scores TRANSIT; or a street runs **inside** the channel
for 16 segments before emerging. Taking the whole run instead of the first segment moves the second
case by only 10.6° and fixes nothing.

⚠ **A FIELD-NAME TRAP for the cure car:** `waterWorks.js:306`'s `across` does **not** hold the
across-channel direction — it holds the RIVER's own tangent (`bearingIndex(run.at.wx, run.at.wy)`),
verified to 0.1° on all 19. The name reads as the opposite of what it stores.

### ⭐⭐ THE CENSUS WAS RE-BUILT INDEPENDENTLY IN THIS LANE — AND IT CAUGHT A DEFECT IN ITSELF

`harness/laneREG5/bridgeAngles.mjs` re-implements the census from scratch, and the first run
**inverted the verdict: 15 of 19 OUTSIDE the band** where the sub-lane's instrument said 15 of 19
INSIDE. Chased rather than averaged:

⛔⛔ **THE RADIAL STEP, NOT THE ANGULAR STEP, SETS THE ANGULAR RESOLUTION OF A NORMAL READ OFF A
LENGTH MINIMUM.** Crossing length goes as `w / cos(θ)`, so a length quantized to ±`step` cannot
distinguish any bearing inside `arccos(w / (w + step))`. At `step = w/60` that blur is **10.4°** —
comparable to the ±15° band itself, so the reported minimum lands anywhere in a ten-degree basin
and the verdict belongs to the quantizer, not the drawing. **A parameter that looks like a
performance knob inverted a law's census.**

Cured by **bisecting the last wet→dry interval to 1e-4 units** (blur < 0.2°, ~14 extra probes a
ray). The cured instrument then reproduces the independently written one **digit for digit**:
`town/street.high|46` deck 135.0 · normal 128.8 · dev 6.3 on both; `highwater/street.high|86`
135.0 · 132.3 · 2.8 on both. **Two implementations, two authors, one answer — that is what makes
the 4 believable, and it is why the disagreement was worth an hour.**

```
── L-REG-31 · ANGLE CENSUS: 19 bridges · IN BAND ±15° 15 · OUTSIDE 4
   highwater  wallLane.main.run.new-cutting.12|3   deck  90.7  normal  11.0   dev 79.7 ⛔
   crossing   street.high|55                       deck 145.9  normal  38.0   dev 72.1 ⛔
   crossing   …corridor.1~frame.1|118              deck  27.1  normal  66.3   dev 39.2 ⛔
   highwater  street.ringOld.E2|1                  deck 226.1  normal  66.0   dev 19.9 ⛔
   town/siege/plague/famine/year-018/year-100 ×2   dev 7.6 and 6.3            (one site, six leaves)
   highwater  street.road.approach…                dev 13.2 · ringOld.E2|11 5.1 · street.high|86 2.8
```
⚠ My `deckSpan/shortest` column is **1.69–1.73 on every bridge including the conforming ones** —
that is not a defect signal, it is the deck-length law restated: the deck is drawn a fixed
~1.7× the NOMINAL width whatever crossing it faces. The discriminating ratio is the sub-lane's
`excess` (water actually crossed ÷ shortest crossing), which runs 1.004–1.086 conforming and
≥ 1.302 on every defect.

### THE PLANTED SKEWED-DECK CONTROL — the charter names it; all three arms LIVE
```
   C1 · EVERY DECK TURNED 90° (a deck laid ALONG the river): 15 of 15 CONFORMING decks now RED
        still in band after the turn: highwater/…|3 (was 79.7° out)
   C2 · A 30° SKEW (twice the band) planted on every deck:   15 of 15 CONFORMING decks now RED
   C3 · NEGATIVE (unmutated re-run): 0 rows differ — deterministic, and it does not red a clean deck
```
⚠⚠ **C1's PREDICATE IS "EVERY CONFORMING DECK REDS", NEVER "EVERY DECK REDS", and the first
spelling was wrong in a way worth banking.** Deviation is measured between UNDIRECTED axes, so a
90° turn is an **involution on the band**: it reds everything that was square and SQUARES anything
that was ~90° out. `highwater/wallLane` sits 79.7° off, so turning it 90° leaves it 10.3° off —
inside the band, correctly. A control asserting 19 of 19 was asserting something arithmetically
false, and the natural way to make it pass would have been to weaken the instrument.

**⛔ NO CURE WAS APPLIED.** L-REG-31's cure is a change to how a shipped deck is aimed AND how long
it is drawn; the two floating decks are the same code path. That is a REG-BRIDGE car's work with
its own census and its own control, and doing it inside a wave already carrying four deliverables
would make it unattributable. **Deferred with reason (J-REG5-5, §11) — but the instrument and its
convicting control are BUILT and committed, so the cure car starts with a census that has already
been shown to move.**

## §8.1 · L-REG-32, THE SITING MEASURE (ODQ §637) — **THE LAW IS NOT MEASURABLE AGAINST THIS MODEL**

⛔⛔ **THE RIVER HAS NO WIDTH PROFILE. IT HAS *A* WIDTH.** `waterMode.js:89` —
`const width = 7 + builtRadius * 0.030;` — one scalar per leaf, no taper. `waterClaims` hands out
`{line, width}`; `deriveBridges` sets `span: rel.width`; the renderer strokes a **constant-width**
line. Sampled bank-to-bank every 0.25 widths along the whole centreline:

| leaf | nominal W | profile min | mean | max | max/min | samples |
|---|---|---|---|---|---|---|
| town (+5 siblings, crossing) | 16.71 | **16.71** | 17.01 | 21.44 | 1.28 | 361 |
| highwater | 17.57 | **17.57** | 17.89 | 22.73 | 1.29 | 350 |
| town-2 | 16.32 | **16.32** | 17.03 | 69.92 | 4.28 | 341 |

The minimum equals the nominal width **exactly, everywhere**; the only variation is a chord
clipping the inside of a meander. **span/narrows is 1.000–1.059 for every bridge — because every
point is a local narrows.** The metric cannot discriminate.

**Corridor width is provably inconsequential.** Swept at 1 block, 3 blocks, 6 blocks and 10 river
widths (26.8 → 167 units): the narrows figure moved **≤ 0.09 units** on any bridge and the ratio
**≤ 0.005**.

**J-REG5-BR-1 · corridor half-length C = 3 × median block dimension** (26.80 / 28.43 / 29.81 →
C = 80.4 / 85.3 / 89.4 units), derived from the street web's own scale per the brief. ⚠ Recorded
**with the caveat that the sweep above proves the choice moves no figure** — accept it cheaply.
*(Median street SEGMENT length is 1.23–6.41 units: that is polyline sampling density, not street
scale, and must not be used as the corridor primitive.)*

**FORDS: they exist, they are inert, and the mirror clause is untestable.**
`fabric.routes.crossings` carries **17 ford records over 18 leaves / 7 over 4 river sites**, all
exactly on the centreline. Reach width vs the local mean runs **0.974–0.995×** — marginally
*narrower*, the opposite of "wide shallow reaches", but the deviation is 1–3 % and is the same
meander artefact. There are no wide reaches for a ford to prefer.
⛔ **And no ford is ever drawn.** Created at `routes.js:141-145`, read by one consumer
(`corridorPull`, `routes.js:246`) which reads only `x, y, weight` — **`kind` is never branched
on** — and `renderFolio.mjs` has no ford pass. The ford that justifies the site and the bridge
that gets drawn are two unconnected derivations from the same river.

## §8.2 · ⭐⭐ THE §637.3 LIFECYCLE ANSWER — **NO BRIDGE IS EVENT-TRUTH**

**Placement:** `src/domain/townMap/fabric/waterWorks.js:269` `deriveBridges`, called from exactly
one site, `buildFabric.js:1008-1010` (stage 5b). Two push sites, `waterWorks.js:327` and `:348`.
No site anywhere constructs, mutates, appends to or filters `fabric.bridges` after `buildFabric`
returns. The deck angle is set at `waterWorks.js:305`.

**The permissive answer: a later cure CAN move every bridge in the corpus. Nothing is protected by
THE PROMISE.** The deriver's whole input surface is `{ rel, channels, frontage }`; `rel` comes from
`deriveWaterMode` and reads four undated facts (population, `tradeRouteAccess`, substrate flow,
distance to nucleus); `channels` is geometry; `frontage` is a scale quantity. **Nothing on the
bridge path reads `record`'s history channel** — and `readFireYears` reads `fabricScars`/`eventLog`,
which `snapshot.js:16-17` records as **absent at head**.

The one coupling worth naming is a DERIVATION, not an event: the wall is year-gated and wall lanes
feed the channel set, so a pre-circuit snapshot has different channels — but the vintage comes from
`record.get('wall-built-year')`, which is derived from the extent trajectory with no construction
event at head. **Measured:** `year-018` (no circuit) carries the same 2 bridges with identical
values as present-day `town`, while `highwater` gains a 5th, wall-lane bridge.

| lifecycle path | status | verified by |
|---|---|---|
| create | `deriveBridges`, 1 call site, 2 push sites | **EXECUTION** (18 leaves, 19 records) |
| read | 5 in-build consumers + renderer + legend row | reading |
| **persist** | ⛔ **NOTHING PERSISTS A BRIDGE** — `buildFabric` has no application-side caller at all; no manifest key matches `bridge` or `ford` | **EXECUTION** |
| regenerate | recomputed from scratch every build, snapshots included | **EXECUTION** |
| undo / migrate | nothing enters app state, so nothing to revert or migrate | follows from persist |

⚠ **A SECOND, INDEPENDENT BRIDGE FAMILY exists and the cure car must not conflate it:**
`buildBridges` at `src/domain/townCartography/cartographyDefenses.js:223` emits `carto:bridge:N` by
plain segment intersection, feeds the app's town-scene UI, **never reads `fabric.bridges`**, and is
also pure geometry. A cure aimed at L-REG-31/32 will not reach it — **and it is what a user
actually sees today.**

---

# §9 · DELIVERABLE 8 — THE BYTE-CEILING MINT (§635.3) — **A PROPOSAL. NOTHING IS PINNED.**

Measured over **216 renders** (every leaf × every lens × both arms) at the §635.2-signed op table,
not over the shipped 28-artifact corpus — because **four of the six tier-setters (`polycentric`,
`mountain`, `migration`, `metropolis`) ship parchment only**, so a ratchet built from the output
directory never sees the lens that sets three of the six maxima.

### The §628 philosophy, extracted as a formula rather than paraphrased
```
  ceiling(tier) = ROUNDUP( fixpoint_max(tier), U )
    fixpoint_max = the maximum over EVERY leaf × EVERY lens of that tier, re-measured with the
                   CANDIDATE ceiling in force, iterated to a stable value
    and if ROUNDUP(m,U) − m is smaller than the movement the raise itself induces, step to the
    next U   (this is why village went 1,697 → 1,800 and metropolis 9,403 → 9,700)
    U = 100 for ops — a fixed ABSOLUTE unit, 10.0 % of the smallest pin, 0.70 % of the largest
  MARGIN IS AN OUTPUT, NOT AN INPUT. No target percentage exists anywhere in §628.
```
**The scale translation:** op maxima span 968 → 13,136 (13.6×); byte maxima span 122,794 → 821,784
(6.7×). **`U = 10,000 bytes` reproduces §628's own relative granularity** — 8.1 % of the thorp
figure, 1.2 % of the metropolis figure — three orders of magnitude up at the same discipline.

### THE PROPOSED TABLE — the chair signs; nothing below is pinned
| tier | fixed-point max (bytes) | set by | **proposed ceiling** | margin | % |
|---|---|---|---|---|---|
| thorp | 122,794 | thorp / parchment | **130,000** | 7,206 | 5.87 % |
| hamlet | 141,192 | hamlet / **watercolor** | **150,000** | 8,808 | 6.24 % |
| village | 180,083 | mountain / **watercolor** | **190,000** | 9,917 | 5.51 % |
| town | 555,362 | **polycentric** / parchment | **560,000** | 4,638 | 0.84 % |
| **city** | **676,473** | **migration / watercolor** | **680,000** | **3,527** | **0.52 %** |
| metropolis | 821,784 | metropolis / **watercolor** | **830,000** | 8,216 | 1.00 % |

**TIGHTEST: `city` at 3,527 bytes / 0.52 %** — the same tier that is tightest on the op table
(0.79 %), for the same reason. ⛔ **Do not mint from the BASE arm**: it names the wrong
tier-setters (BASE town is `fjord`, ARMED town is `polycentric`) and sits 18–33 % low.

### THE LENS QUESTION, MEASURED — and the ranking INVERTS between arms
Unarmed, **accessible** is the fattest lens on 15 of 18 leaves; armed, **accessible is the
CHEAPEST on 18 of 18** and **watercolor** is the worst on 15 of 18. Confirmed by a ceiling sweep:
the Accessible hatch draws against `max(0, CEIL − prims.n − TAIL_RESERVE)`, so once the armed
passes have consumed the ceiling its budget clamps toward zero. **A ceiling must be set from the
worst lens — but the correction is ≤ 216 bytes on any tier**, because in no tier does a lens of
`town`/`city` beat that tier's parchment-only setter.

### THE FIXED-POINT QUESTION — **CONFIRMED: bytes have NO fixed point of their own**
Four independent lines, each with a positive control:
1. **Positive control** — sweeping the op ceiling on armed `city`: 9,000 → 10,004 prim / 674,680 B;
   **10,100 → 10,016 prim / 675,998 B**; 11,000–14,000 flat. The instrument DOES detect a ration
   responding to a budget. Every figure above is therefore a saturated fixed-point figure.
2. **Runtime interception** — `Buffer.byteLength`, `TextEncoder.encode` and `Array.join`
   instrumented and reset after the fabric build: **0 byte measurements during the render**; all
   three counters fire immediately afterwards on three deliberate calls (the positive control).
3. **Static census** — `CEIL` is read at exactly four sites and every one subtracts `prims.n`.
   The single string-length read in `renderFolio.mjs` is a glyph count of an input place-name.
4. **Behavioural signature** — primitives visibly hug their ceiling (10,008 against 10,000;
   10,020 against 10,100). Bytes hug no round number in any of the 216 renders.

⭐⭐ **THE CONSEQUENCE THE CHAIR MUST RULE ON.** The coupling runs one way — **op ceiling → bytes,
never bytes → anything** — so a byte ceiling is stable under its own raises but **NOT under an op
raise**: `city 10,000 → 10,100` moved the city byte maximum **+1,318 B**. The §628 rule must
therefore extend: **an op-ceiling raise now owes a byte re-measure in the same act.**

⚠ And the two tables are not yet consistent. Priced at each tier's measured bytes-per-primitive,
the op headroom already signed is worth far more than a 10 KB byte margin — **at town, 1,786 spare
ops ≈ 132,000 bytes**, which would blow a 560,000 ceiling by ~132 KB. That is not a defect in the
proposal; **it is what "BYTES primary" means** — at town/city/metropolis the byte gate binds first
and the op table becomes the second gate, exactly as §635.3 intends. Flagged so the chair signs it
deliberately rather than meeting it on the first town wave.

### TWO TRAPS FOR WHOEVER WRITES THE RATCHET
1. **Pin `Buffer.byteLength(svg)`, never `svg.length`.** The SVG carries em-dashes; the gap is
   10–23 bytes (0.003–0.008 %). A `.length` test pins a figure low and reads green while wrong.
2. **The shipped driver renders six lenses only for `town` and `city`.** A ratchet built from the
   28-artifact output directory never sees the lens that sets three of the six maxima.

Determinism for the ratchet CONFIRMED: three consecutive renders of `migration`, `polycentric` and
`metropolis` returned sha256-identical SVGs at identical byte counts.

---

# §10 · THE ALWAYS BLOCK

## §10.1 · DORMANCY — **28 of 28 + manifest byte-identical to the REG-SEAM seal**
Taken at the tip, after the last edit. Every arm this lane added is off by default.

## §10.2 · DETERMINISM — **28 of 28 on four arms, every one with its own liveness control**
⛔ **LITERAL FLAGS ON THE COMMAND LINE.** zsh does not word-split an unquoted `$var`: a
flags-in-a-variable loop passes the whole string as ONE argument and every arm renders UNARMED
while the double-run still reads 28/28 (§635.1, banked). Every arm below is spelled out.
```
   arm                                                  double-run   differs-from-unarmed
   (none)                                                28 of 28     0 of 28  (reference)
   --quay                                                28 of 28    15 of 28  LIVE
   --quay --vquay                                        28 of 28    15 of 28  LIVE
   --fuse --rampart --shapes --market --footprint
     --quay --vquay                                      28 of 28    28 of 28  LIVE
   ⭐ AND THE DRESS ARM'S OWN CONTROL, which the row above cannot give:
   --quay --vquay  vs  --quay                                        15 of 28  LIVE
```
The fourth row's liveness is the one that would have caught the banked trap; the fifth is the one
that catches a dress arm that renders nothing.

## §10.3 · OP SPEND AT THE SIGNED PINS — **EVERY TIER HOLDS; NO RAISE ASKED FOR**
`thorp 1,000 · hamlet 1,400 · village 2,000 · town 9,300 · city 10,100 · metropolis 14,200`

| tier | unarmed max | ALL ARMS + `--quay --vquay` | ceiling | margin | % | set by |
|---|---|---|---|---|---|---|
| thorp | 904 | 968 | 1,000 | 32 | 3.20 % | thorp |
| hamlet | 1,126 | 1,256 | 1,400 | 144 | 10.29 % | hamlet |
| village | 1,540 | 1,764 | 2,000 | 236 | 11.80 % | mountain |
| town | 5,236 | 7,514 | 9,300 | 1,786 | 19.20 % | polycentric |
| **city** | 6,818 | **10,020** | **10,100** | **80** | **0.79 %** | migration |
| metropolis | 9,557 | 13,136 | 14,200 | 1,064 | 7.49 % | metropolis |

⭐ **THE §635.2 RAISE ABSORBS BOTH NEW ARMS.** City lands at 10,020 against the new 10,100 — and
these figures were produced by a rig entirely independent of the byte sub-lane's, which measured
**the same 10,020 and the same thorp margin of 32**. Two rigs, digit for digit.

## §10.4 · THE §635.3 WATCH ROW — re-measured FIRST, before any build proceeded
See §3.7. `wall:all` **improves** (town 4.2681 → 4.2731, city 4.6529 → 4.6645 against floor 3.00);
wall mean RGB unchanged on both leaves. Nothing this lane did softens the circuit.

## §10.5 · NEW TEST FILES — **NONE.** Three-ratchet delta: **0 / 0 / 0**
Every new probe is a HARNESS file (`harness/instruments/*`, `harness/laneREG5/*`), not a test.
`tests/` gained **no file**; the two touched test files gained **no case**. Collected stays 318.

---

# §11 · JUDGMENT CALLS — all vetoable

| # | call | why, and what was rejected |
|---|---|---|
| **J-REG5-1** | The five group ids take the roles `marketOutline→square · marketFossils→building · marketFurniture→detail · faubourgDistricts→ground · precincts→yard`, chosen by **what the ink draws**, not by what produced it. | `faubourgDistricts→ground` keeps hf311's TOLL BAR out of the `wall` role (drawn in wall ink, but not circuit) and the frontage SPINE out of `street` (not carriageway). `precincts→yard` and not `landmark`, because REG-3 minted that group precisely to keep precinct voids out of the salience read. Rejected: splitting a batched group by element shape — one group, one classification, which is the law the ids exist under. |
| **J-REG5-2** | Only `rect\|circle → chrome` was reordered; **the chrome-ZONE point test keeps its precedence** over the group table. | With the zone flood stopped, a path lying wholly inside a zone really is occluded by plate furniture, and a mask claiming those pixels would sample the cartouche's colour rather than the drawing's. Moving the table above the point test as well was measured and rejected — it would re-classify ink the eye cannot see. |
| **⭐⭐ J-REG5-3** | **REG-QUAY's exemption was widened from the ruled clause to the water's own CLAIM.** | §635.4 pins the defect on `bodyRefusal`. Measured: that clause kills **11 of 162** piers and the water claim kills **127**. Curing only the named clause would have rescued one pier in fourteen and reported a fix. The contradiction is identical in kind — one law moors what another erases — so §632.3's MACHINERY ruling covers both. ⛔ Streets, wall circuit, party lines and `crag` are untouched: a quay may stand in the river, never in the high street. **This is a divergence from the literal ruling; veto it in isolation and the narrow version still lands.** |
| **J-REG5-4** | The drawn-quay predicate requires a solid of **≥ 3 points**, not `solids.length > 0`. | The ground law leaves an emptied part as `[]` in place, so the loose predicate counts a quay with nothing but empty rings as DRAWN. That is why the three published figures differ (ruling 4/12, sibling 2/11, this lane 6/10 undrawn). Both readings are reported; the stricter one is what a reader can see on the plate. |
| **J-REG5-5** | **L-REG-31's outliers were measured and NOT cured — but the instrument AND its convicting control are built and committed.** | The cure changes how a shipped deck is aimed AND how long it is drawn (the two floating decks are the same code path), which is a REG-BRIDGE car with its own census and control. Doing it inside a wave already carrying four deliverables would make it unattributable. The discriminating predicate is handed over ready: conforming decks are ≤ 1.086× the shortest crossing, every defect ≥ 1.302×. |
| **J-REG5-6** | The countryside band is reported at **1 of 2 village leaves** rather than forced to 2 of 2. | Rejected: (a) drawing relief hachures denser to pad the metric — it moves the number without drawing the countryside; (b) minting a pasture/wood/waste surface inside a presentation wave — new capability, owner-gated. The op budget is NOT the constraint (460 spare primitives at village ≈ 46 coverage points); the missing published surface is. |
| **J-REG5-7** | The band work does **not** harden the monoculture and **nothing is pinned to "coverage = arable".** | The metric's numerator is the `field`/`detail`/`yard`/`square`/`water` ROLES, so a leaf that later swaps strips for pasture at the same coverage reads the same number — REG-H cannot be forced to regress it. **No test was written for this metric at all**, so no ratchet stands in REG-H's way. |
| **J-REG5-8** | V-QUAY lives **inside `waterWorks.js`**, not in a new fabric module. | A new module costs a stage-manifest row, four derived fields, an edge-set update and a fresh walker bill — the exact tax this lane spent its morning paying off for six other modules. The quay's furniture belongs with the quay's water works; the cheap answer and the right answer coincide. |
| **J-REG5-9** | The V-QUAY census's denominator is **DRAWN quays**, and `--vquay` furnishes nothing that `--quay` did not rescue. | A dress leg that furnished an erased quay would hang bollards in open water beside an absent shed — papering over the geometric defect it was minted to compensate for. Control C2 proves the dependency by measurement (4 furnished without `--quay` vs 7 with). |
| **J-REG5-BR-1** | Corridor half-length **C = 3 × median block dimension** (80.4 / 85.3 / 89.4 units). | Derived from the street web's own scale per the brief. ⚠ Recorded with the caveat that a 1-block → 10-width sweep moves the narrows figure by **≤ 0.09 units** — accept it cheaply and do not spend a decision defending it. Median street SEGMENT length (1.23–6.41) is polyline sampling density, not street scale, and must not be used. |
| **J-REG5-BR-2** | The bridge conformance instrument is **window-free** (shortest wet crossing), not a windowed chord tangent. | Executed: on `town/street.high` a ±1w chord reports 25.7° while the deck takes a 1.018× shortest crossing. The window family swings the census from 15/19 to 8/19 **with no change in the drawing** — a band pinned to a windowed tangent pins the window, not the law. |
| **J-REG5-BR-3** | Grade on `excess` (deck span ÷ shortest crossing) **alongside** the angle. | Scale-free, needs no band negotiation, separates cleanly (1.004–1.086 conforming vs 1.302 / 6.020 / 6.879). The angle alone misses that `highwater/ringOld\|11` sits on a 12.6× river-width segment yet crosses square. |

# §12 · DEFERRED, WITH REASONS — documented, not bugs to re-find

1. **L-REG-31's four angle outliers and the two mid-channel decks.** Measured, root-caused,
   predicate handed over. REG-BRIDGE's work (J-REG5-5).
2. **The three residual undrawn quays** (`cat:fish_market`, village/coastal). They die to
   `street.high` and an approach corridor, not to water — a SITING question that belongs with the
   L-REG-32 car. The exemption deliberately does not withdraw a street's right-of-way.
3. **`moorWaterBound` anchors on the river CENTRELINE, not the bank.** Its own comment says *"THE
   ROOT IS AT THE BANK"*, which is true for a coast and false for a river — measured anchor 3.15
   units from the centreline of a 16.71-unit channel. Not cured: moving the anchor moves every
   quay's geometry on every river leaf, which is a same-seed shift that belongs in a car that can
   carry its own declaration. **The cure car must fix this or a rescued quay floats mid-river.**
4. **The legacy `port` path** (`glyphAssign.js` / `massing.js`) — deliberately uncured, dies at the
   cutover (§635.4). ⚠ And the corollary the chair should see: `buildFabric` has **no
   application-side caller at all**, so the shipped map today IS the legacy path and this defect
   is currently invisible to users.
5. **Fords are inert.** 17 records, `kind` never branched on, never rendered. Not this lane's.
6. **The countryside monoculture.** REG-H's, by the chair's own advisory (J-REG5-6/7).
7. **3 of 40 declared deps are absent from the repo's `node_modules`** (`three`, `@types/node`,
   `pg`). None is imported by the fabric or lint suites. Recorded, not cured.
8. **`tests/setup/fastCheckSeed.js` is absent from the sandbox tree.** Borrowed from the ledger
   branch unmodified and left UNTRACKED — never staged. A successor must re-copy it or the suite
   reports 15 failed / "no tests".

---

# §13 · FILE MANIFEST — every file this lane wrote, one line of why

## In the tree (four commits, `c77a77887` → `1840376bc`; every path staged EXPLICITLY)
| file | +/M | why |
|---|---|---|
| `harness/renderFolio.mjs` | **M** | city ceiling 10,000 → 10,100 with its cause above it; the V-QUAY render pass (`<g id="quayFurniture">`) |
| `harness/exemplars.mjs` | **M** | `--quay` and `--vquay`, each independently dormant |
| `harness/instruments/leaf.mjs` | **NEW** | the kit · leaf resolution + `artifactName()`, the anti-glob cure |
| `harness/instruments/digest.mjs` | **NEW** | the kit · hashing, `compareDirs`, `livenessAgainst`, `determinism` |
| `harness/instruments/control.mjs` | **NEW** | the kit · `plantedControl` (four mandatory steps, restore in a `finally`, restore PROVED) + `inputControl` |
| `harness/instruments/crops.mjs` | **NEW** | the kit · `ruleBox` (a box cannot exist without its rule) + `shootBounded` + `quicklook` |
| `harness/laneREG{2,3,4}/…` (5 files) | **M** | re-pointed at the kit; four censuses proved byte-identical |
| `harness/laneREG5/quayCensus.mjs` | **NEW** | the drawn-quay census, 24 declared seeds, + C1/C2 |
| `harness/laneREG5/quayOne.mjs` | **NEW** | one leaf's quay figures in a FRESH process — ESM caches the module graph, so a plant measured in-process reports a dead control on a live cure |
| `harness/laneREG5/vquayCensus.mjs` | **NEW** | the V-QUAY fixture-count census + C1/C2/C3 |
| `harness/laneREG5/bridgeAngles.mjs` | **NEW** | L-REG-31's angle census, window-free normal by bisection, + the planted skewed-deck controls |
| `harness/laneREG5/quayCrops.mjs` | **NEW** | the quay judging crops, three arms from one rule-selected box |
| `src/domain/townMap/fabric/stageManifest.js` | **M** | six modules registered; derived fields brought current; `NODE_EDGES` +`S4>S13` |
| `src/domain/townMap/fabric/groundRefusal.js` | **M** | `bodyRefusal(sub, poly, exempt)` + `WATERFRONT_EXEMPT_CLAUSES` |
| `src/domain/townMap/fabric/groundLaw.js` | **M** | the dry claim set, the moored predicate, three census counters |
| `src/domain/townMap/fabric/waterWorks.js` | **M** | `deriveQuayRegister` + `V_QUAY_KINDS` + `V_QUAY_BAND` |
| `src/domain/townMap/fabric/buildFabric.js` | **M** | `waterfront:` and `quayRegister:` wiring; three `meta` rows |
| `tests/lint/stageManifest.walker.test.js` | **M** | the fork-total pin 17 → 18, declared in the source |
| `tests/lint/derivationGraph.walker.test.js` | **M** | `marketRegister.js: 2` + `shapeCode.js: 3` joined the frozen inventory, declared |

## Chair-side (not in the tree)
| file | +/M | why |
|---|---|---|
| `reg-instruments/lib/classify.mjs` | **M** | `GROUP_ROLE` + `CHROME_GROUPS`, the rule reorder, the zone-plant restriction, `quayFurniture` |
| `reg5/classify.PRE-CURE.mjs` | **NEW** | the pre-cure module, preserved verbatim (sha1 `5250267030ce…`) so the delta is a differential against the shipped instrument |
| `reg5/classifyDiag.mjs` · `reg5/classifyDelta.mjs` | **NEW** | the per-RULE probe that caught the zone flood; the corpus-wide delta |
| `reg5/ctrl/{classify.MUT.mjs,baselineLiveness.mjs}` | **NEW** | the mutant-classifier control for the zero-delta re-record |
| `reg5/deriveManifest.mjs` | **NEW** | the walker's own `derive()` lifted out of vitest — 277 s a guess → under a second |
| `reg5/countryside.mjs` | **NEW** | the second, independent coverage instrument |
| `reg-instruments/out/baselines-d1b32e339-PRE-REG5-CLASSIFIER-CURE.json` | **NEW** | the pre-cure baseline, verbatim, never edited in place |
| `reg5/out/*` | **NEW** | gates, censuses, the i5 re-run, the quay census JSON |

⛔ **NOT TOUCHED:** the shared repo working tree · any ref (`refs/preserve/map-sandbox-regseam-bands`
still `6cd4b19ef`) · `MEMORY.md` · the ODQ · `out/baselines.json` (the pre-cure file is preserved
beside it; the re-record went to `reg5/out/`) · any other lane's worktree · `tests/setup/` (borrowed,
untracked, never staged) · `node_modules/` (**NOT gitignored in this sandbox — every `git add` was
an explicit path list and `git add -A/-u/.` was never run**).

# §14 · EXACT RE-RUN

```zsh
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad
T=$SP/laneREG5-tree            # detached at 1840376bc
I=$SP/reg-instruments

# ── setup (npm ci FAILS here: EUSAGE, no package-lock in the sparse tree)
cd /Users/cstokes/Desktop/settlement-engine
git worktree add "$SP/laneREG5-tree" 6cd4b19efb763a3f7799d9d30974436236ac6545
cd $T && mkdir -p node_modules && cp -R /Users/cstokes/Desktop/settlement-engine/node_modules/seedrandom node_modules/
# for the GATE, give the tree its own node_modules by PER-PACKAGE SYMLINK (never `ln -s` the dir):
cd $T/node_modules && for e in /Users/cstokes/Desktop/settlement-engine/node_modules/*; do [ -e "$(basename $e)" ] || ln -s "$e" "$(basename $e)"; done
mkdir -p $T/tests/setup && cp /Users/cstokes/Desktop/settlement-engine/tests/setup/fastCheckSeed.js $T/tests/setup/

# ── opening act 1 · the ceiling, dormancy and its liveness control
cd $T
node harness/exemplars.mjs $SP/reg5/renders/BASE          # 18 SVG + manifest = 29 files
#   (mutate city → 6000, re-render, confirm exactly the 7 city artifacts move, restore)

# ── opening act 2 · the classifier
cd $SP/reg5
node classifyDiag.mjs  $SP/reg5/renders/CEIL/town-town-parchment.svg $SP/reg5/renders/ARMED/town-town-parchment.svg
node classifyDelta.mjs $SP/reg5/renders/CEIL $SP/reg5/renders/ARMED
node --max-old-space-size=8000 ctrl/baselineLiveness.mjs           # REG5_BASELINE_CONTROL LIVE
cd $I && node --max-old-space-size=12000 run-baselines.mjs --out=$SP/reg5/out/baselines-REG5CURE.json
cd $I && node --max-old-space-size=12000 regI1-i5contrast.mjs --json=$SP/reg5/out/regI1-i5contrast-REG5CURE.json

# ── opening act 3 · the kit, and the proof it changed nothing
cd $T
node harness/laneREG4/seamCensus.mjs --leaves=ALL
node harness/laneREG4/sliverCensus.mjs --leaves=ALL
node harness/laneREG3/probeTyping.mjs
node harness/laneREG2/pickCrops.mjs city

# ── opening act 4 · the walkers
cd $SP/reg5 && node deriveManifest.mjs            # ARM 1..7, all agree
cd $T && npx vitest run tests --pool=threads --maxWorkers=2      # 318 / 318
#   ⛔ NOT `--reporter=basic`: vitest 4 has no such reporter and it dies as a Startup Error.
#   ⛔ `--poolOptions.threads.*` does not exist in vitest 4 either; the working cap is the above.

# ── the deliverables
node --max-old-space-size=8000 $SP/reg5/countryside.mjs $SP/reg5/renders/CEIL --leaves=village,mountain,town
node harness/laneREG5/quayCensus.mjs  --controls
node harness/laneREG5/vquayCensus.mjs --controls
node harness/laneREG5/bridgeAngles.mjs --controls   # 19 bridges, 15 in band; C1/C2/C3 LIVE
node harness/laneREG5/quayCrops.mjs --leaf=fjord,town --out=$SP/reg5/crops

# ── the always block · ⛔ LITERAL FLAGS, NEVER $flags (zsh passes the whole string as ONE arg)
node harness/exemplars.mjs $SP/reg5/renders/D-off-1
node harness/exemplars.mjs $SP/reg5/renders/D-off-2
node harness/exemplars.mjs $SP/reg5/renders/D-q-1   --quay
node harness/exemplars.mjs $SP/reg5/renders/D-q-2   --quay
node harness/exemplars.mjs $SP/reg5/renders/D-qv-1  --quay --vquay
node harness/exemplars.mjs $SP/reg5/renders/D-qv-2  --quay --vquay
node harness/exemplars.mjs $SP/reg5/renders/D-all-1 --fuse --rampart --shapes --market --footprint --quay --vquay
node harness/exemplars.mjs $SP/reg5/renders/D-all-2 --fuse --rampart --shapes --market --footprint --quay --vquay
```

⚠ **`classify()` TAKES A PATH, NOT SOURCE TEXT** — handing it the text reads as `ENAMETOOLONG`
with the whole SVG in the error message.
⚠ **`acorn` does not resolve from `$SP/reg5`** — `deriveManifest.mjs` imports it by absolute path.
⚠ **Every leaf is named by EXACT `<key>-<tier>-<lens>.svg`.** `ls town-*` matches
`town-2-town-parchment.svg` FIRST; `harness/instruments/leaf.mjs` composes the name instead.

---

# §15 · ⭐⭐ MY OWN DELIVERABLE TRIPPED TWO OF THE WALKERS I HAD JUST DISCHARGED

Reported prominently because it is the best evidence in this receipt that the machinery works, and
because a lane that quietly fixed it would have hidden the one moment the guard did its job.

The gate at the first committed tip came back **316 / 318, two failures — both mine, both from
V-QUAY**, and neither was predictable from reading the code:
```
   derivationGraph  · HAND_MINTED_FORK_KEYS  waterWorks.js  expected 1, got 7
   stageManifest 3  · S17 random-namespace drift
                      + *|vquay|*  + *|vquay|*|*|n  + *|vquay|*|*|u  + *|vquay|*|*|v
```
`deriveQuayRegister` mints six `${seedKey}|…` keys (the fixture count, the two placement
coordinates, three per-kind counts) and four namespace spellings. **Both registered, neither
weakened:** S17's list gains the four spellings beside the deriver that mints them, and the frozen
inventory moves 1 → 7 with its cause in the source — an EIGHTH still reds. `statefulForkSites` is
unchanged and honestly so: these are pure `hashUnit` string hashes with no stream.

Counted with the walker's own matcher, executed rather than reasoned:
```
   waterWorks.js  →  7  ['${seeding.seed}|', '${seedKey}|' × 6]
```
Both registrations are read-side: **28 of 28 byte-identical** after them.

⭐ **THE CLASS, banked:** *every new derivation that mints a key owes both registries in the same
commit, and the two are in different files* — `stageManifest.js` (S-node namespaces) and
`tests/lint/derivationGraph.walker.test.js` (the hand-minted inventory). Registering one and not
the other reds the OTHER walker, which reads as an unrelated failure. Adding a derivation to an
**already-registered** module does not escape this: the module's row is registered, its KEYS are not.

---

# §16 · MEMORY ROWS PROPOSED TO THE CHAIR
Topic files written; **`MEMORY.md` NOT touched**, per the index law (lanes do not write the index).

1. `a-key-minting-derivation-owes-two-registries.md` — ⚠⚠ a new key-minting fabric derivation owes
   `stageManifest.js`'s node `randomNamespaces` **and** `derivationGraph.walker`'s
   `HAND_MINTED_FORK_KEYS`, in different files; registering one reds the OTHER walker, which reads
   as an unrelated failure. Being inside an ALREADY-REGISTERED module does not exempt you. Carries
   the lifted-walker method (280 s a guess → under a second) and the arm-4 whole-fabric total trap.
2. `chrome-zones-flood-from-drawing-circles.md` — ⛔⛔ `classify.mjs` planted chrome zones from raw
   tags, so 64 landmark circles cost 121 of 240 landmark elements, **57 of them PATHS the zone
   flood ate** — invisible in a role census. Carries both corrections of record (the circles are
   REG-3's, not REG-4's; the recorded baselines do NOT move) and the per-RULE probe method.
3. `radial-step-sets-the-angular-resolution.md` — ⛔⛔ when an estimator reads an ANGLE off a
   LENGTH minimum, the RADIAL step sets its angular resolution (`blur = arccos(w/(w+step))`); at
   `w/60` that is 10.4° against a 15° band, and it INVERTED L-REG-31's census. Cure is bisection,
   not a finer sweep. Carries the involution trap in the 90° control and the
   "chase a verdict-level disagreement, never average it" method.
4. `the-quay-dies-to-the-water-claim-not-bodyrefusal.md` — ⛔⛔ §635.4's named mechanism is the
   minority cause: 127 of 162 piers die at the water CLAIM, 11 at `bodyRefusal`, because
   `bodyRefusal` reads `sub.wet` and not the drawn watercourse. Carries the ordered kill chain, the
   write-only-stamp class, and the still-open river-centreline anchoring.

# §17 · JUDGING ARTIFACTS
`$SP/reg5/crops/` — the quay crops, three arms from the SAME rule-selected box, PNG-verified:
```
   RULE: the quay's own anchor, framed at 5× the leaf's plot frontage (written before rendering)
   fjord  BASE 132,977 B · QUAY 136,349 B · VQUAY 150,585 B   box 406 182 60 60  (name:fish-market)
   town   BASE 315,721 B · QUAY 378,842 B · VQUAY 393,382 B   box 252 673 60 60  (name:fishmonger)
```
⚠ Rendered at the **quicklook tier** (§634.2, ~0.5 s) rather than headless Chrome. The tier law
reserves Chrome for exit legs; these are judging crops for the chair's eye and the third blind
round runs after the seal. **Stated so the chair can order a Chrome re-shoot rather than assume one.**

---

# §18 · SHARED-TREE NOTE (checked at lane close)

The ledger branch `review-fixes-2026-07-08` **advanced during this lane**, `120cb2857` →
`278d1d8ca`, and the shared tree carries **staged changes that are not mine** — including
`docs/CONVENTION_AUDIT_2026-08-25.md`, the audit behind the chair's monoculture advisory. That is
a parallel session's work: **preserved, untouched, unstaged by me.**

This lane never wrote to the shared tree, never staged anything there, and moved no ref.
`refs/preserve/map-sandbox-regseam-bands` is still `6cd4b19ef`. All work is on the detached
worktree `laneREG5-tree`, left in place as evidence. ⚠ `node_modules/` is **NOT gitignored** in
this sparse sandbox, so every commit staged an EXPLICIT path list; `git add -A` / `-u` / `.` was
never run, and both untracked trees (`node_modules/`, `tests/setup/`) survived the hook.

---

# §19 · THE FINAL GATE, AT THE COMMITTED TIP

⛔ Verification binds to a snapshot, so this is a run **after the last edit**, with the committed
blobs proved identical to the working files.

```
committed blob == working file:
  ✅ harness/renderFolio.mjs                        045fba3d3479eac4bf6c52371d7c62b07a9d9a87
  ✅ harness/exemplars.mjs                          054830776d569eae0fba507778f0894e4a6d3f23
  ✅ src/domain/townMap/fabric/stageManifest.js     1682c4c7c6c40fb4b1b649df013b248b435046ec
  ✅ src/domain/townMap/fabric/groundLaw.js         46c208fc0cc6bac81d069e88c160d2163dec2cea
  ✅ src/domain/townMap/fabric/groundRefusal.js     b3af0156808dd6cde84765b55209315688b0f2d0
  ✅ src/domain/townMap/fabric/waterWorks.js        e2b2d33d8bfa3cc89faa72601d768e1c5cedb601
  ✅ src/domain/townMap/fabric/buildFabric.js       5989c62a4a586f59c758d8894a9caecabe3cc301
  ✅ tests/lint/stageManifest.walker.test.js        130bb02d8ab59dc79ef8f08d194c63265a20975a
  ✅ tests/lint/derivationGraph.walker.test.js      7f5138e879e55633ee38294eaea39e0d15d1a62b
ancestry: ✅ 6cd4b19ef is an ancestor of 1840376bc
working tree: clean (only untracked node_modules/ and tests/setup/ — ⚠ NEITHER is gitignored in
              this sparse sandbox, so every commit staged EXPLICIT paths; `git add -A`/`-u`/`.`
              was never run, and both survived the hook)
```

| run | files | collected | passed | failed |
|---|---|---|---|---|
| lane base `6cd4b19ef` (control, clean worktree) | 15 | **318** | 315 | **3** |
| after the six registrations | 15 | 318 | 317 | 1 (arm 4's total pin) |
| first tip `c77a77887` | 15 | 318 | 316 | 2 (**V-QUAY's own two bills**) |
| cured tip `23937d687` | 15 | 318 | 318 | 0 |
| **SEAL TIP `1840376bc`** | **15** | **318** | **318** | **0** |
| delta vs base | **0** | **+0** | **+3** | **−3** |

**+0 collected, +0 test files, −3 failures.** The three inherited walker bills are discharged and
the two my own deliverable created are registered. The seal-tip run is the last action of the lane
— **a check, not an edit** — with the working tree clean apart from the two untracked trees.

---

## VERDICT

**PASS.** All four opening acts done with executed proof; three of the four deliverables complete;
the fourth (the countryside band) is **half met with its structural cause measured and its cure
identified as owner-gated**, which is the exit's own second clause.

- **Dormancy** 28 of 28 + manifest byte-identical to the REG-SEAM seal, taken at the tip.
- **Determinism** 28 of 28 on four arms, every arm carrying its own differs-from-unarmed control
  and LITERAL flags on the command line.
- **Op spend** holds at every signed ceiling; city tightest at 80 of 10,100 — and the figure was
  reproduced digit-for-digit by a second, independent rig.
- **Gate** 318 / 318.

⛔ **THE ONE THING THE CHAIR MUST RULE: J-REG5-3.** REG-QUAY's exemption was widened from the
clause §635.4 names to the water's own CLAIM, because the named clause kills 11 of 162 piers and
the claim kills 127. Veto it and the narrow version still lands — it just rescues one pier in
fourteen instead of eleven.

**LANE TIP: `1840376bc96cf2851d75016c1873cf33416703f4`** (detached; no ref moved — the chair seals).
