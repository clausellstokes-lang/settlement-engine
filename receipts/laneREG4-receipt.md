# lane TE-REG-4 — MARKETS · FAUBOURG ORIGINS · DENSIFICATION · THE MINIMUM-FOOTPRINT LAW — RECEIPT

BASE: `93fa8a2ca7c347c35aea94776dfeb7dc70bf0190` (refs/preserve/map-sandbox-reg3-shapes)
WORKTREE: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneREG4-tree` (detached)
CHARTER: `docs/DESIGN_REGISTER_PROGRAM.md` §0, §2 (L-REG-3, L-REG-6), §5 REG-4 row, A2.2, A2.3, A7 (L-REG-30);
ODQ §629 (the B13 band) and §630 (the minimum-footprint law).
DRESS TARGETS: hf259 (three market shapes + encroachment islands) · hf342 (civic furniture as plan
glyphs, STRICT TOP-DOWN) · hf320 (market street with stall dashes; the pound) · hf311 (before-the-gate
anatomy) · hf267 (the nuisance belt) · hf32 (ribbon suburbs on every radial).

---

## RESUME POINT 0 (t+~40) — SETUP PROVEN, THE FABRIC MEASURED, NOTHING WRITTEN TO SRC YET

### (a) SETUP PROOF

`git worktree add … 93fa8a2ca7…` → `HEAD is now at 93fa8a2ca TE-REG-3: THE SHAPE CODE …`.

⚠ **`npm ci` FAILS ON THE SEALED SANDBOX TREE AND THE REASON IS NOT seedrandom.** Captured
verbatim:

```
npm error code EUSAGE
npm error The `npm ci` command can only install with an existing package-lock.json or
npm error npm-shrinkwrap.json with lockfileVersion >= 1.
```

The map-sandbox seal carries **no `package-lock.json`** (the tree is `harness/ out/ package.json
src/ tests/ tsconfig.json vite.config.js vitest.laneMFB1.config.js` — the sparse fabric sandbox).
The established cure applies and is what REG-3's own tree used: `laneREG3-tree/node_modules`
contains exactly one package, `seedrandom`. Executed:

```
cp -R <repo>/node_modules/seedrandom "$T/node_modules/"
node -e 'require(".../node_modules/seedrandom")' → seedrandom OK 0.908061
```

**BASELINE ARTIFACT COUNT (the verdict, not the exit status):**
`node harness/exemplars.mjs $S/base-out` → `18 SVG + manifest.json`, **29 files**, 14.6 s.
(18 leaves; town and city each carry five extra lenses → 29 artifacts. Matches REG-3's 29/29.)

### (b) ⭐⭐ THE ORIENTATION PROBE — `harness/laneREG4/probeReg4.mjs`, all 18 leaves, UNARMED

Everything REG-4 needs is measured off the sealed fabric before a line is written. Full JSON at
`$SP/reg4work/probe0.json`.

| leaf | tier | pop | squares (kind) | commons | faubourg buildings (`kind`) | gates | §18.4 colonized rows | parcels |
|---|---|---|---|---|---|---|---|---|
| thorp | thorp | 27 | 1 `well` | 0 | 0 | 0 | 0 | 4 |
| hamlet | hamlet | 220 | 1 `green` | 0 | 0 | 0 | 0 | 43 |
| village | village | 512 | 1 `green` | 1 | 0 | 0 | 0 | 103 |
| town | town | 3,502 | 1 `market` | 2 | **9** — inn 2 · house 7 | 2 | **6** | 1,016 |
| town-2 | town | 2,497 | 1 `market` | 1 | **0** ⚠ | 2 | **5** | 941 |
| city | city | 20,091 | 2 `market` | 2 | **20** — inn 3 · house 17 | 6 | **6** | 1,487 |
| metropolis | metropolis | 71,325 | 2 `market` | 3 | **44** — inn 6 · house 38 | 5 | **8** | 2,290 |
| polycentric | town | 3,334 | 1 `market` | 2 | 8 — inn 1 · house 7 | 1 | 7 | 981 |
| highwater | town | 3,502 | **3** `market` | 1 | 3 — house 3 | 4 | 7 | 1,087 |
| mountain | village | 512 | 1 `green` | 1 | 0 | 0 | 0 | 73 |
| fjord | town | 3,140 | 1 `market` | 2 | 0 (no circuit) | 0 | 6 | 1,103 |
| siege/plague/famine | town | 3,502 | 1 `market` | 2 | 9 | 2 | 6 | 1,016 |
| migration | city | 20,091 | 2 `market` | 2 | 20 | 6 | 6 | 1,487 |
| year-018 | town | 3,502 | 1 `market` | 2 | **0** (no circuit in yr 18) | 0 | **0** | 1,046 |
| year-100 | town | 3,502 | 1 `market` | 2 | 3 — inn 2 · house 1 | 2 | **0** | 1,046 |
| crossing | town | 3,502 | 1 `market` | 2 | 4 — house 3 · inn 1 | 3 | 6 | 1,079 |

**FOUR FINDINGS THAT SET THE WAVE'S SHAPE:**

1. ⭐⭐ **THE MARKET-INFILL FOSSIL IS ALREADY IN THE FABRIC AND IS NOT THIN.** `snapshot.js`
   `marketColonization()` (§18.4) publishes *middle rows* — "permanent stalls hardening into shops,
   then houses, splitting one great square into the two narrow streets" — gated on
   `year ≥ age × (0.42 + lawfulness × 0.50)`, town+ only, `fabric.meta.marketColonized` counting
   them and the swept bodies landing in `fabric.stateMarks.rows`. **It fires on 11 of 18 leaves
   (5–8 rows each) and is correctly ABSENT on `year-018` and `year-100`** — the two snapshot leaves
   whose reason string says the place is still open. Deliverable 3 is therefore a **CONSUMPTION**
   under J-REG3-1's law, exactly as the faubourg typing is. It is NOT reported THIN.
2. ⭐ **`faubourg.kind` IS 100 % COVERED** (house/inn) across the eight leaves that carry
   faubourgs, reproducing REG-3's corpus figure (house 114 · inn 24). Every faubourg building
   already carries its GATE (`buildFaubourgs` is gate-first by construction: the key is
   `faubourg|${gateId}|${road.key}|${i}`). **The origin type needs no invention — only geometry
   that makes it VISIBLE.**
3. ⚠ **`town-2` HAS TWO GATES AND ZERO FAUBOURG BUILDINGS** — a live subject for the wave's own
   coverage claim, and the one leaf where "every extramural district carries a typed origin" is
   vacuously true. Named now so it is not discovered as a pass.
4. ⛔ **THE SLIVERS ARE REAL AND MEASURABLE.** Short-axis / area percentiles over the drawn
   parcels, per leaf, with `meta.plotFrontage` beside them (fabric units):

| leaf | frontage | shortAxis min | p01 | p05 | p50 | area min | p01 | p05 | p50 |
|---|---|---|---|---|---|---|---|---|---|
| polycentric | 4.70 | **0.278** | 0.613 | 1.133 | 3.756 | **0.259** | 1.511 | 3.776 | 21.98 |
| town | 4.93 | 0.541 | 0.955 | 1.389 | 3.978 | 1.340 | 3.162 | 5.832 | 26.45 |
| fjord | 4.82 | 0.486 | 0.914 | 1.371 | 4.115 | 1.168 | 3.241 | 5.492 | 26.65 |
| city | 6.25 | 0.630 | 1.551 | 2.099 | 4.484 | 1.313 | 6.437 | 15.50 | 49.88 |
| metropolis | 5.54 | 0.655 | 1.452 | 1.804 | 3.838 | 4.854 | 8.351 | 16.02 | 42.13 |
| village | 13.75 | 0.921 | 1.093 | 1.439 | 5.735 | 4.180 | 4.982 | 13.88 | 61.30 |

### (c) ⭐⭐ THE TINT SEAM, LOCATED IN THE SOURCE BEFORE IT IS MEASURED IN PIXELS

`harness/renderFolio.mjs` stage **§7** paints the street web as STROKED channel lines in
`chTone` (= `roadTone` for every rank but `alley`/`ringOld`); stage **§8** paints each square as

```js
B.add(`fill="${roadTone}" stroke="${mix(P.paper, P.ink, 0.46)}" stroke-width="${INK.road}" …`, polyPath(sq.polygon));
```

So the **fill token already matches** (`roadTone` both sides) — but the square carries a **closed
ink border at `INK.road` width all the way round, including across every street mouth**, and it is
painted AFTER the web, so the border overdraws the carriageway that runs into it. That closed
border is the seam L-REG-6 forbids, and it is also precisely what hf259's *carved square with
ENTRY GAPS* draws differently.

### (d) SQUARES ARE BLOBS TODAY

`streets.js deriveSquares()` emits one `organicBlob(cx, cy, r, rng, { steps: 11–12, rough: 0.16–0.17 })`
per square. None of hf259's three shapes exists. The heart square's `kind` is
`well` (thorp) / `green` (hamlet, village) / `market` (town+); city+ adds up to 2–3 per-organism
squares (`civic` / `churchyard` / `market`).

NEXT: the seam measurement in pixels; the market shape derivation; the B13 furnishing; the
faubourg origin geometry; the densification differential against the SEALED base; the L-REG-30
floor measurement.

---

## RESUME POINT 1 (t+~100) — THE THREE ARMS BUILT AND WIRED; EXITS NOT YET RUN

**FILES WRITTEN** (all inside the lane worktree; no shipped-src bytes outside the fabric sandbox
this arc already writes in):

| file | + | what |
|---|---|---|
| `src/domain/townMap/fabric/marketRegister.js` | NEW ~470 | hf259's three shapes selected from the street web · the mouths · the register polygon (inscribed by construction) · V-B13 + the §629.1 band · the §18.4 fossil consumption. Pure; no draws. |
| `src/domain/townMap/fabric/faubourgOrigin.js` | NEW ~200 | the typed origin (gate / bridgehead / road) consumed from `faubourg.kind`, `faubourg.gate`, `walls[].gates`, `fabric.bridges`; the district ground whose ASPECT is the visible tell. |
| `src/domain/townMap/fabric/minFootprint.js` | NEW ~230 | L-REG-30: the three floor candidates with their derivations, the caliper short axis, the FUSE/CLAMP/DROP verdict table, and the drawn-body subject set. Ink-side only. |
| `src/domain/townMap/fabric/buildFabric.js` | ~40 | SINGLE WRITER, minimal: one stage 8c beside the fusion and the shape code, two conditional publication keys at the END of the literal (so no existing key's position moves). |
| `harness/renderFolio.mjs` | ~150 | §8r the shared void surface with the outline BROKEN at every mouth · §8x the encroachment islands + the retreat ghost · §8f the V-B13 plan glyphs · §11b-r the typed faubourg districts · the `MF()` chokepoint applied at every drawn-body site. |
| `harness/exemplars.mjs` | 10 | `--market`, `--footprint`, `--floor=F-A\|F-B\|F-C`. |

**THE ARMS ARE SEPARATE AND THE SPLIT IS DELIBERATE** (J-REG4-1): `--market` carries the market
register and the faubourg origins; `--footprint` carries L-REG-30 alone, because that arm can
SUPPRESS a drawn body — a strictly larger claim than re-cutting a void — and so earns a dormancy
proof of its own.

### FIRST MEASUREMENTS, ARMED (all 18 leaves, `buildOne(spec, {marketRegister:true, minFootprint:true})`)

- **Voids re-cut: 23 across the corpus. Fixtures INSIDE the §629.1 band: 23 of 23.**
- **Shapes: cigar 7 · carved 16 · triangular 0.** ⚠ The triangular branch does not fire anywhere
  on this corpus — reported, not tuned into existence; a liveness control for the branch is owed
  and is listed below.
- **Faubourg origins: gate 42 · road 87 · bridgehead 0**, over 129 buildings on 8 leaves, with
  **gate resolution 100 % (every building resolved to a real gate object, 0 fallbacks)**.
  ⚠ `bridgehead` is likewise unfired on this corpus — same treatment.
- **§18.4 infill fossils consumed: 2–4 per town+ leaf, 0 on `year-018`/`year-100`** — the two
  snapshot leaves whose own reason string says the place is still open. The arm tracks the
  fabric's dated record exactly.
- **L-REG-30 at the provisional floor F-C:** sub-minimum 0 of 31 (thorp) … 208 of 3,171
  (metropolis); dropped 0–19 per leaf; clamped 1–17.

### OP SPEND, FIRST READ (primitives, parchment lens)

| leaf | BASE | `--market` | `--footprint` | BOTH | signed ceiling |
|---|---|---|---|---|---|
| village | 1,226 | 1,237 | 1,184 | 1,195 | 2,000 |
| town | 4,386 | 4,387 | 4,348 | 4,385 | 9,300 |
| city | 5,799 | 5,880 | 5,701 | 5,782 | 10,000 |
| metropolis | 7,985 | 8,102 | 7,784 | 7,901 | 14,200 |

⭐ The footprint law is a NET SAVING (fewer bodies drawn); the market register costs +1 … +117.
⚠ These are the §628-signed ceilings, which already carry REG-3's raises; REG-2's and REG-3's own
armed spend is NOT in this table and the four-arm measurement is owed.

NEXT: the tint-seam census with its convicting mutation · the sliver census with the planted-sliver
control · the densification differential (band-agnostic per the chair's mid-flight instruction) ·
dormancy + determinism · the floor-candidate table · the instrument leg · the corpus crops.

---

# ⭐ TE-REG-4 · MARKETS · FAUBOURG ORIGINS · DENSIFICATION · L-REG-30 — THE EXITS

## §2 · THE EXITS, EACH WITH ITS EXECUTED FIGURE

### (1) ⭐⭐ ZERO TINT SEAMS STREET ↔ MARKET (L-REG-6) — **CONFIRMED, 0 of 141**

`node harness/laneREG4/seamCensus.mjs --leaves=ALL`, all 18 leaves, 23 voids:

```
ARM 1 · TOKEN     : 0 of 18 void fills differ from the street's own #F3EBD6
ARM 2 · DOORWAY   : 0 of 141 street mouths carry ink across them, over 23 voids
VERDICT           : ZERO TINT SEAMS
```

**THE TWO CONVICTING MUTATIONS, each redding its OWN arm and neither contaminating the other:**

| mutation | what it plants | result |
|---|---|---|
| `--mutate=fill` | a DIFFERING market fill (`#EDE2C6` for `#F3EBD6`) in the emitted `<g id="squares">` | **ARM 1 reds 18 of 18**; ARM 2 stays 0 of 141 |
| `--mutate=border` | the SEALED behaviour restored — a CLOSED ring round every void, doorways included | **ARM 2 reds 122 of 141**; ARM 1 stays 0 of 18 |

⛔ **AND THE CENSUS ITSELF HAD TO BE CURED BEFORE IT COULD BE BELIEVED.** Its first spelling
found the outline by a PATH SIGNATURE (`fill="none" … stroke-linecap="round"`) and read **110 of
141 mouths as seamed** — because the CARRIAGEWAY RUNNING INTO THE DOORWAY has exactly that
signature. The instrument was convicting the street of being at the door. The cure is REG-3's
J-REG3-9 applied to this wave: the void outline takes its own `<g id="marketOutline">`, and a
group id is a classification.

### (2) ⭐ hf259's THREE MARKET SHAPES, SELECTED FROM FABRIC GEOMETRY — **cigar 7 · carved 16 · triangular 0**

The selector reads the FRONTING CHANNELS with `buildStreetWeb`'s own predicate
(`distToPolyline(sq.center, ch.line) ≤ sq.radius + ch.width × 0.75`, lifted verbatim), splits
them into MAJOR mouths (width ≥ 0.55 × the widest at the place), and asks two questions in order:
a through-route on `high`/`artery`/`ringOld` within 35° of opposite carrying ≥ half the major
carriageway ⇒ **cigar**; else exactly three major mouths with min pairwise separation ≥ 60°
⇒ **triangular**; else **carved**.

⛔ **THE FIRST SPELLING WAS A BUCKET AND THE MEASUREMENT SAID SO: `carved` for 20 of 22 voids**,
because it thresholded on a MOUTH COUNT and a city market is fronted by thirteen channels. The
cure is the reference's own reading — hf259's triangular green is three ROADS and its cigar is one
road WIDENED — so the shape is decided on the major ways while every minor way still earns its
entry gap.

⚠ **`triangular` FIRES NOWHERE ON THIS CORPUS AND THAT IS REPORTED, NOT TUNED AWAY.** The 23
voids' major-mouth separations are 9°–75°, and the one leaf with three well-spread major mouths
(`hamlet`, 75°) also has an opposed dominant pair and is correctly a cigar. **The branch is
unfired, not unreachable** — its threshold is the geometric boundary itself (a triangle's edge
normals stand 120° apart, so two roads share an edge below 60°), not a chosen number. A liveness
control for the branch is OWED and is listed in §6.

⭐ **THE INSCRIPTION INVARIANT — 0 of 1,104 register vertices outside their reserved blob.**
Every register polygon is `rBlob(θ) × profile(θ)` with `profile ≤ 0.999`, so it is a SUBSET of the
ground the law already refused; nothing that was built can be overlapped by a re-cut void.
⛔ The first spelling interpolated VERTEX RADII either side of the ray and put **104 of 1,104**
vertices outside, because between two vertices the boundary is a straight CHORD and a chord is
nearer the centre than a linear-radius blend. The exact answer is a ray/segment intersection.

Area retention (register ÷ reserved blob): **52–76 %**, cigars lowest (a lens is genuinely
narrower than the blob it is cut from) — reported, not compensated.

### (3) ⭐ THE V-B13 FURNISHING AT THE §629.1 BAND — **23 of 23 voids IN BAND**

Per-void counts against `B13_BAND` (§629.1 verbatim, per RUNG not per void kind):

| leaf | void | role | band | fixtures | kinds drawn |
|---|---|---|---|---|---|
| thorp | heart (`well`) | principal | 0–0 | 0 | — |
| hamlet | heart (`green`) | principal | 0–0 | 0 | — |
| village | heart (`green`) | principal | 1–3 | 1 | marketCross |
| town | heart (`market`) | principal | 3–7 | 6 | stallRow, marketCross, conduit, pillory, weighBeam, trough |
| city | heart | principal | 4–9 | 4 | stallRow, marketCross, conduit, pillory |
| city | shadows_district | secondary | 1–3 | 3 | stallRow, marketCross, conduit |
| metropolis | heart | principal | 5–12 | 11 | the six above, twice over |
| metropolis | shadows_district | secondary | 3–7 | 7 | the six above |
| highwater | heart / mq / mq~1 | 1 principal + 2 secondary | 3–7 / 1–3 | 6 / 3 / 2 | — |

Glyph anatomy per hf342's strict-plan law: the stall row is *one row of small rectangles with its
dashed stall-line = ONE fixture* (§629.1's own words), the cross is a ringed step-circle, the
pound is octagonal (hf320), the weigh-beam is the great beam with its two pans drawn in plan.
Stall rows run **along the void's long axis**; every fixture is kept clear of a doorway and off an
encroachment island.

### (4) ⭐⭐ THE MARKET-INFILL FOSSILS — **CONSUMED FROM §18.4, NOT THIN, NOT INVENTED**

`snapshot.marketColonization()` already publishes the hardened middle rows, gated on
`year ≥ age × (0.42 + lawfulness × 0.50)`, town+ only. REG-4 re-reads them as hf259's encroachment
islands and gives them their own anatomy and their own group.

| leaf | fossils | the fabric's own dated citation, republished verbatim |
|---|---|---|
| town / siege / plague / famine | 2 | `§18.4 age 191 ≥ 128 at order 0.51` |
| town-2 | 4 | `§18.4 age 81 ≥ 58 at order 0.60` |
| city / migration | 4 | `§18.4 age 104 ≥ 63 at order 0.37` |
| metropolis | 4 | `§18.4 age 640 ≥ 408 at order 0.44` |
| polycentric | 4 | `§18.4 age 67 ≥ 28 at order 0.00` |
| crossing | 4 | `§18.4 age 191 ≥ 128 at order 0.51` |
| **year-018 · year-100** | **0** | the two snapshot leaves whose reason says the place is still open |

⛔ **AND THE SEALED TIP DREW THEM AS A BESIEGER'S TENT.** §15b batches `stateMarks.bodies` into
ONE path — a hardened market row, a siege tent and a lazar house all in
`mix(paper, roofs, 0.42)`. REG-4 draws the islands in the fabric's own building ink at
`INK.block`, with a DASHED RETREAT GHOST of the outline the place had before they hardened.

### (5) ⭐⭐ FAUBOURG ORIGIN TYPING (L-REG-3) — **100 % OF BUILDINGS AND 100 % OF EXTRAMURAL DISTRICTS**

| leaf | buildings typed | extramural REGIONS typed | building origins |
|---|---|---|---|
| town / siege / plague / famine | 9 / 9 | 2 / 2 | gate 3 · road 6 |
| city / migration | 20 / 20 | 3 / 3 | gate 3 · road 17 |
| metropolis | 44 / 44 | 3 / 3 | gate 18 · road 26 |
| polycentric | 8 / 8 | 4 / 4 | gate 4 · road 4 |
| highwater | 3 / 3 | 0 / 0 | road 3 |
| crossing | 4 / 4 | 3 / 3 | gate 2 · road 2 |
| year-100 | 3 / 3 | 0 / 0 | gate 3 |
| town-2 | 0 / 0 | **2 / 2** | — ⚠ two gates, zero faubourg buildings |

⭐ **GATE RESOLUTION IS 100 % AND IT IS A DERIVATION, NOT A STRING PARSE.** `gateRoster()`
replicates `buildFaubourgs`' own roster exactly — **bricked gates excluded**, survivors sorted by
`compareKeys` on the rounded station before the ordinal is taken — and every one of the 129
buildings resolves to a real gate object (`gateResolved 129, gateByKeyOnly 0, gateUnresolved 0`).
The key's embedded station is kept only as a cross-check. ⚠ A first attempt that skipped the
bricked-gate filter and the sort resolved **23 of 129**.

⭐ **THE TYPE IS VISIBLE IN GEOMETRY AND THE GEOMETRY IS MEASURABLE.** Each district publishes a
`ground` polygon: a gate/bridgehead KNOT is compact, a road RIBBON is elongated, and the aspect
ratio is the tell a census can read back without being told. hf311's TOLL BAR is drawn across the
way at a knot's head; a ribbon carries its frontage spine instead.

⚠ **`bridgehead` FIRES NOWHERE ON THIS CORPUS** — the three bridge-bearing walled leaves put their
faubourgs on gate roads that do not reach a deck. Reported, not tuned. ⚠ **Every extramural
REGION types as `road`**, because a district region's own centroid is far from any gate; the
building-level typing is where `gate` lives. Both are findings for the chair, not defects hidden.

### (6) ⭐⭐ L-REG-30, THE MINIMUM-FOOTPRINT LAW — **SLIVER CENSUS 0 of 23,436**

`node harness/laneREG4/sliverCensus.mjs --leaves=ALL --controls`, floor **F-C**:

```
SLIVER CENSUS · ARMED  = 0 of 23436 drawn bodies are sub-minimum  → ZERO
CONTROL C1 · DISARMED  = 1585 of 24938 — the sealed corpus, real geometry with a real
                         defect; MUST be positive → POSITIVE (the census counts)
CONTROL C2 · A PLANTED SLIVER, injected into the DRAWN set after the law ran
  thorp   before=0 after=1 Δ=1 caught=YES     village before=0 after=1 Δ=1 caught=YES
  hamlet  before=0 after=1 Δ=1 caught=YES     town    before=0 after=1 Δ=1 caught=YES
```

C1 is the stronger control and it is i10's A3 pattern: a synthetic plant proves the predicate
fires, a genuine PRE-CURE input proves it fires on the thing it is for.

Per-leaf verdicts at F-C:

| leaf | minShort | minArea | drawn | sub (disarmed) | fused | clamped | dropped |
|---|---|---|---|---|---|---|---|
| thorp | 4.800 | 36.864 | 31 | 0 / 31 | 0 | 0 | 0 |
| hamlet | 4.500 | 32.394 | 82 | 11 / 92 | 10 | 1 | 0 |
| village | 4.537 | 32.941 | 154 | 48 / 196 | 37 | 6 | 5 |
| town | 1.800 | 5.184 | 1,438 | 103 / 1,537 | 94 | 4 | 5 |
| city | 2.061 | 6.798 | 2,052 | 106 / 2,152 | 90 | 6 | 10 |
| metropolis | 1.829 | 5.351 | 2,925 | 208 / 3,128 | 184 | 5 | 19 |
| polycentric | 1.800 | 5.184 | 1,313 | 138 / 1,449 | 125 | 2 | 11 |
| fjord | 1.800 | 5.184 | 1,394 | 136 / 1,524 | 122 | 6 | 8 |

⛔ **THE 38-BODY FLOAT DEFECT, FOUND BY THE CENSUS AND CURED.** The first pass clamped by exactly
`minShort / s`, which lands the short axis ON the floor to within float error — and the census
tests `s < minShort`. **38 of 23,436 clamped bodies came back sub-minimum** at values like
`s = 1.800` against `minShort = 1.800` and `a = 32.940` against `minArea = 32.941`.
`CLAMP_MARGIN = 1.001` is the cure: *clamped UP TO the floor* means AT LEAST the floor.

### (7) ⭐⭐ THE MEASURED FLOOR CANDIDATES — **THE CHAIR SIGNS; F-C IS THE LANE'S PROVISIONAL**

Each candidate is expressed against a quantity the leaf already draws, because an absolute floor
would mean different things at a thorp (frontage 26) and a city (frontage 6.25).

| id | rule | derivation | town `minShort` | village `minShort` |
|---|---|---|---|---|
| **F-A** | `0.30 × frontage` | `STREET_LADDER.crossAlley` — the narrowest gap the leaf draws; a body narrower than the narrowest gap beside it reads as a gap that failed to close | 1.48 | 4.13 |
| **F-B** | `0.62 × frontage` | `STREET_LADDER.blockLane` — the REFERENCES' row-block practice; the shallowest thing Watabou or FTG draws is a range about as deep as the lane it fronts | 3.06 | 8.53 |
| **F-C** ⭐ | `6 × INK.detail` | **this repo's own answer to this exact question** — REG-3's J-REG3-6 ruled legibility at "can the marks be told apart at the leaf's own line weight" and answered at six detail strokes | 1.80 | 4.54 |

`minArea = minShort² × AREA_ASPECT` with `AREA_ASPECT = 1.6` — §630.2 asks for BOTH floors so a
body that merely clears the short axis but is a stub still fails; 1 : 1.6 is the shallowest
burgage proportion `parcels.js` itself packs.

**J-REG4-4: the lane builds against F-C** because it is the only candidate already ruled in this
repo for this question, and because F-B suppresses ~35 % of a town's parcels (measured off the
short-axis percentiles: town p05 = 1.389, p50 = 3.978) which is a redraw and not a floor.
**Chair signs; the other two are one flag away (`--floor=F-A`).**

### (8) ⛔⛔ THE DENSIFICATION DIFFERENTIAL — **THE INSTRUMENT WORKS AND IT FINDS A DEFECT**

`node harness/laneREG4/densification.mjs --leaf=town --rungs=4`. **BAND-AGNOSTIC BY
CONSTRUCTION** (chair's mid-flight instruction — J-REG4-8 below): not one boundary population is
written down; every rung is BISECTED out of `tierForPopulation` at runtime, and the tier a build
is given comes from the same classifier call the fabric uses.

```
BAND PROBED FROM THE CLASSIFIER (no literal anywhere): [901 … 8000], next tier 'city' at 8001
```

**ARM 1 · the population ladder**

| rung | pop | rings | intramural infill | notHeld | throughWall | suburb | typed faubourg | SPRAWL |
|---|---|---|---|---|---|---|---|---|
| sub-1 | 2,321 | 1 | 950 | **0** | 6 | 469 | 59 | 410 |
| sub-2 | 3,741 | 1 | 816 | **0** | 13 | 622 | 37 | 585 |
| sub-3 | 5,160 | 1 | 944 | **0** | 1 | 608 | 56 | 552 |
| sub-4 | 6,580 | 1 | 984 | **0** | 0 | 947 | 15 | 932 |
| CROSSING | 8,001 | 2 | 1,431 | **0** | 7 | 92 | 1 | 91 |

⛔⛔ **THE ARCHITECTURAL FINDING, AND IT IS THE REASON ARM 1 CANNOT SETTLE A2.2's CLAIM:
VARYING THE POPULATION DOES NOT HOLD THE CIRCUIT STILL.** The wall's extent is re-derived from
the built umbrella at every population, and MEASURED across this sub-threshold ladder its
enclosed area runs **365,177 → 300,203 → 349,182 → 222,457 view units²** — non-monotone, and a
third smaller at the top of the band than at the bottom. A2.2's premise ("with circuit standing")
is unmet by a population sweep, and a monotone body count measured across four different circuits
is not a differential; it is four settlements.

**ARM 2 · the snapshot ladder — the only axis on which the circuit actually stands.** One site,
one population, the wall's vintage pinned from the present-day record; only the accumulated
history differs.

| leaf | year | rings | intramural infill | notHeld | throughWall | suburb | typed faubourg | SPRAWL | infill fossils |
|---|---|---|---|---|---|---|---|---|---|
| year-018 | 18 | 0 | 0 | 0 | 0 | 1,475 | 0 | 1,475 | 0 |
| year-100 | 100 | 1 | 1,414 | **0** | **0** | 64 | 3 | 61 | 0 |
| town | present (191) | 1 | 883 | **0** | 2 | 536 | 27 | **509** | 2 |

⭐ **WHAT PASSES, CONFIRMED:** `notHeld = 0` at every rung of both arms — no drawn body stands
outside its own circuit, reproducing i10's Census B zero on a corpus this wave has changed. The
market-infill fossils accumulate with the years exactly as §18.4's dated gate says (0 → 0 → 2).

⛔ **WHAT FAILS, AND IT IS A REAL PROPERTY OF THE SEALED ENGINE RATHER THAN OF THIS WAVE:**
between year 100 and the present the town's intramural holdings FALL 1,414 → 883 while its
extramural suburb rises 64 → 536, of which **509 carry no typed origin**. The engine grows
OUTWARD past a standing circuit rather than densifying inside it. That is precisely the behaviour
L-REG-3 exists to change, and changing it is a growth-model change in `builtUmbrella`/`parcels`
(L0), not a presentation-side one — **new capability versus repair, which is owner-gated. The
lane measures and reports; it does not rebuild the growth model.** (J-REG4-9.)

**THE CONVICTING CONTROL:** `--break` holds the population constant across the ladder; the
monotone arm fails and the table shows four identical rows — the differential cannot pass on a
broken input.

⛔⛔ **AND THE DIFFERENTIAL'S OWN PREDICATE WAS WRONG THREE TIMES BEFORE IT WAS RIGHT**, each in a
way that produced plausible numbers:
1. **THE TOWN'S RING IS A HALF RING** (`rings[0].halfRing === true`, with its own `closedPolygon`)
   because the river is the fourth wall — so `pointInPolygon(c, wall.polygon)` is not a question
   that polygon can answer.
2. It convicted WALL-ABUTTING HOUSES of extending THROUGH the wall, because a body against the
   inner face straddles the CENTRELINE. §575's tangential regime makes that lawful; the honest
   test is the BAND's two faces.
3. It counted the lawful SUBURB as sprawl. §241.6's own law: a body in no walled epoch's body is
   the suburb, *"lawfully outside every circuit — counted and reported separately."*
   ⭐ And the count is **LOD-CORRECTED**: a `lod.mass` is many holdings drawn as one body and
   carries its own `count`. Uncorrected, the infill total READ AS FALLING (1,265 → 1,223 → 1,300
   → 1,849) as a town densified — because merging is what densification looks like to a body
   counter.

### (9) ⭐ DORMANCY — **CONFIRMED, 29 of 29 BYTE-IDENTICAL TO THE SEALED BASE**

`node harness/exemplars.mjs <dir>` with every flag OFF, against the base rendered from the seal:

```
base-out: 29 files   off-out: 29 files
diff -rq base-out off-out   → IDENTICAL (no output, exit 0)
```

⚠ The COUNT is quoted deliberately (REG-2's caveat, inherited twice): an exit status with no
artifact count is not a verdict.

| artifact | base | armed-OFF | | armed-ON | armed-ON (2nd run) | |
|---|---|---|---|---|---|---|
| `town-town-parchment.svg` | `511f0c017d762128` | `511f0c017d762128` | SAME | `0ecf3729afb522b2` | `0ecf3729afb522b2` | SAME |
| `city-city-parchment.svg` | `3449ace03d809add` | `3449ace03d809add` | SAME | `1a2064cef5de5495` | `1a2064cef5de5495` | SAME |
| `village-village-parchment.svg` | `8c027538172907d7` | `8c027538172907d7` | SAME | `db8f246a69db6ef5` | `db8f246a69db6ef5` | SAME |
| `metropolis-metropolis-parchment.svg` | `1ab8da8db714cb82` | `1ab8da8db714cb82` | SAME | `246b8381fd32b0cc` | `246b8381fd32b0cc` | SAME |
| `manifest.json` | `695435d6d66f95df` | `695435d6d66f95df` | SAME | `a7434be414a1e393` | `a7434be414a1e393` | SAME |

⭐ **THE FOUR BASE SHAs REPRODUCE REG-3's RECEIPT DIGIT FOR DIGIT**, which is the independent
check that this lane's base really is the seal it says it is.

### (10) ⭐ DETERMINISM — **CONFIRMED, 29 of 29 ON ALL THREE ARMED COMBINATIONS**

| arm | double-run |
|---|---|
| `--market` | `diff -rq on-out on-out2` → IDENTICAL, 29 / 29 |
| `--footprint` | `diff -rq foot-out foot-out2` → IDENTICAL, 29 / 29 |
| `--market --footprint` | `diff -rq both-out both-out2` → IDENTICAL, 29 / 29 |

Every position in this wave is a `hashUnit` of a stable key; no stream draw, no `Math.random`,
no `Date`, no runtime trig (the frozen table only).

### (11) ⭐ THE REG-I0 INSTRUMENT LEG

**i10 · THE TWO ORDERED CENSUSES, RUN ARMED** via `REG_FABRIC_OPTS='{"marketRegister":true,"minFootprint":true}'`
(J-REG3-10's arm — the instrument workspace is read-only to this lane and was not edited):

```
CENSUS A · STRADDLE (law's predicate)  = 0 of 79 district regions, on 12 walled leaves of 18
CENSUS B · OUTSIDE-CIRCUIT BODIES      = 0 of 15326 members (6083 suburb, 25001 drawn bodies)
§240.1 hull vertices outside own ring  = 0
```

⭐ The member denominator **15,326** is the SEALED BASE's own figure (REG-3 measured 15,392 with
`shapeCode` armed, which adds 66 members). This wave adds **no** drawn fabric bodies — it
publishes tables the lens reads — so the zero is over the same population the seal had, which is
the honest statement rather than a larger-population claim this wave did not earn.

**i8 · NO-DRIFT TRACE — `UNTRACED MISSES = 7, staleRows = 0`.** Four are this wave's (`8r`, `8x`,
`8f`, `11r`); two are REG-3's (`12r`, `13p`); one is REG-2's (`15r`). **The four rows the chair
should commit are in §7.** ⚠ `8r` and `11r` were INVISIBLE to the walker at first: it matches
`// ── <N> · ` with `N = [0-9]+[a-z0-9]*`, so a header without the `──` rule and an id with a
HYPHEN (`11b-r`) both fall out of the roster silently. Renamed and re-prefixed so the roster is
complete — **a hidden op class is exactly the drift the instrument exists to catch.**


## §4 · JUDGMENT CALLS — all vetoable

| # | call | basis |
|---|---|---|
| **J-REG4-1** | **TWO ARMS, TWO FLAGS**: `--market` carries the market register + the faubourg origins; `--footprint` carries L-REG-30 alone. | REG-1/2/3's standing rule is one flag per WAVE, so each wave's dormancy is provable alone. L-REG-30 is applied at the granularity of the RISK instead: it can SUPPRESS a drawn body, a strictly larger claim than re-cutting a void, and a claim that large earns a dormancy proof nobody has to disentangle from the market's. |
| **J-REG4-2** | The market register is published as a **table the lens reads**; `web.squares` is untouched. | REG-1's fusion and REG-3's shape code both took this shape and the reason is the same: the ground law, the access law and the LOD merge have all already run, and a re-cut void that wrote back would be ink over a fact that had changed. The INSCRIPTION INVARIANT (register ⊆ reserved blob) is what makes it safe, and it is asserted vertex-by-vertex rather than trusted. |
| **J-REG4-3** | The market SHAPE is decided on the **MAJOR mouths** (width ≥ 0.55 × the widest), while EVERY mouth earns an entry gap. | Measured: deciding on a raw mouth count returned `carved` for 20 of 22 voids, because a city market is fronted by thirteen channels and a count threshold can only say "many". hf259's own reading is that a triangular green is three ROADS and a cigar is one road WIDENED — the shape is a fact about the ways that made the place; every other way is still a way in. |
| **J-REG4-4** | L-REG-30 builds against floor **F-C** (`6 × INK.detail`); F-A and F-B are measured and reported. | F-C is the only candidate this repo has already ruled for this exact question (REG-3's J-REG3-6, "told apart at the leaf's own line weight"). F-B would suppress ~35 % of a town's parcels — that is a redraw, not a floor. **Chair signs the pin; `--floor=F-A` switches it.** |
| **J-REG4-5** | `CLAMP_MARGIN = 1.001`. | Found by the census, not reasoned: clamping by exactly `minShort / s` left **38 of 23,436** bodies at `s = 1.800` against `minShort = 1.800`. "Clamped UP TO the floor" means AT LEAST the floor; a tenth of a percent is invisible at page register and exact in the census. |
| **J-REG4-6** | The §10 state bodies **and the §18.4 middle rows** are OUT of L-REG-30's subject set. | A siege tent is not a building and §630 is about buildings; suppressing one would delete a §10 state expression the law requires to be visible. The middle rows are the judgment half: a hardened market row IS a building by history, but REG-4's own fossil arm draws it at the void's register, where a row is one member of a set and its smallness is the point. |
| **J-REG4-7** | The register void's outline, the furniture, the fossils and the faubourg districts each take **their own `<g id>`**. | REG-3's J-REG3-9 — "a group id is a classification" — and it paid immediately: without `<g id="marketOutline">` the seam census read **110 of 141** mouths as seamed, convicting the carriageway that runs into the doorway. It also keeps a market cross out of instrument 4's LANDMARK anchors, which is the mistake REG-3's precinct voids were caught making. |
| **J-REG4-8** | The differential is **BAND-AGNOSTIC**: no boundary population is written down anywhere; every rung is bisected out of `tierForPopulation` at runtime and each build's tier comes from the same classifier call the fabric uses. | The chair's mid-flight instruction (the sandbox's thresholds are drift against the landed `popToTier` and a seam-cure car will reconcile them). No new test uses the classifier's current numeric answers as an oracle. ⚠ The bisection BRACKET must start inside the band — bisecting from 1 returns `thorp` and both probes come back null, which collapsed the first ladder onto population 0. |
| **J-REG4-9** | The differential's SPRAWL failure is **measured and reported, not cured**. | Curing it means moving extramural growth back inside a standing circuit — a change to `builtUmbrella`/`parcels` at L0, which is new capability versus repair and therefore owner-gated. The lane's job is to build the instrument and read it honestly; 509 untyped extramural bodies on the present-day town is the reading. |
| **J-REG4-10** | `REG_OP_CEILINGS`, an env override on `opCeilingFor`, INERT when unset. | `OP_CEILING_BY_TIER` at this seal still holds the PRE-REG-2 values (town 4,600 · city 6,400) while §628 has signed 9,300 / 10,000 — so a spend measured at this tip is priced against a ceiling nobody will ship, and two mid-pass rations give way early (REG-3's own "the fixed point is real" caveat). The arm measures the true spend WITHOUT moving the pin, exactly as J-REG3-10's `REG_FABRIC_OPTS` arms a census without editing the instrument. |
| **J-REG4-11** | Every Chrome shot is **time-bounded**, and the PNG's existence — never the exit status — is the verdict. | Measured in this lane: headless Chrome wrote a 708 KB screenshot and was still alive 5 min 40 s later with `execFileSync` waiting on it and four more Chromes queued behind. This is the same class as the standing "an exit code with no collected-test count is NOT a verdict" law, one tool over. |

## §7 · ⭐ THE i8 TRACE ROWS THE CHAIR SHOULD COMMIT (four; the instrument was NOT edited)

```js
'8r':  { name: 'THE MARKET AS ONE GIANT STREET — a shared void surface whose outline BREAKS at every street mouth',
         trace: ['watabou', 'ftg', 'corpus'],
         why: 'Watabou and FTG both draw a market as a WIDENING OF THE STREET SURFACE — the same '
            + 'pale ground, no border between the two — so the STRUCTURE (a junction, not a room) '
            + 'is the leads\' own reading grammar. hf259-zoom-market-voids supplies the DRESS: its '
            + 'three named shapes (cigar-widened street, triangular three-road green, carved square '
            + 'with ENTRY GAPS) and, in the third of them, the broken outline itself. §0\'s '
            + 'precedence clause exactly: structure from the leads, dress from the corpus.' },
'8x':  { name: 'THE MARKET-INFILL FOSSILS — hf259\'s encroachment islands, consumed from §18.4',
         trace: ['corpus'],
         why: 'hf259 draws the carved square with ENCROACHMENT ISLANDS EATING IT BACK, and it is '
            + 'the one market element neither lead draws at all — Watabou and FTG have no notion of '
            + 'a square that used to be bigger. The geometry is NOT invented: §18.4 '
            + 'marketColonization already publishes the hardened middle rows on an age × order '
            + 'gate, and this pass re-reads the fabric\'s own dated record with the plate\'s '
            + 'anatomy plus a dashed RETREAT GHOST of the outline the place had before them.' },
'8f':  { name: 'THE V-B13 MARKET FURNITURE — plan glyphs at the ODQ §629.1 band',
         trace: ['corpus'],
         why: 'hf342-zoom-civic-knot is the anchor and states its own projection on its face '
            + '("STRICT TOP-DOWN ORTHOGRAPHIC"): weigh-house great beam in plan, conduit, '
            + 'pillory/stocks, the market cross as a RINGED STEP-CIRCLE. hf320-spec-street-hierarchy '
            + 'supplies the market street\'s stall dashes and the drove road\'s OCTAGONAL pound; '
            + 'hf259 the green\'s pond; hf344 the yew as a specimen crown. ⚠ THE LEADS BOUND THE '
            + 'RESTRAINT rather than the vocabulary — Watabou and FTG draw nearly bare squares, '
            + 'which is why §629.1\'s LOW band edges exist (village 1, town 3) and why the count is '
            + 'rationed at all. hf342\'s own law is the upper bound: "a square without its '
            + 'furniture fails the exit."' },
'11r': { name: 'THE FAUBOURG\'S TYPED ORIGIN — gate knot / road ribbon / bridge-head, drawn as district ground',
         trace: ['corpus', 'ftg'],
         why: 'hf311-spec-gate-suburb is the REQUIRED-DETAIL ANCHOR for before-the-gate anatomy and '
            + 'draws the knot as a knot — toll bar, cart queue, courtyard great inns, smithy rank — '
            + 'while hf32-city-growth-rings draws the other case, "ribbon suburbs breaking out along '
            + 'every radial beyond the newest ring". FTG draws extramural building as loose '
            + 'structures on the approach roads and so supplies the STRUCTURE (suburbs belong to '
            + 'roads); the corpus supplies the DISTINCTION between a knot and a ribbon, which is '
            + 'what L-REG-3 asks to be visible. Watabou draws no extramural growth at all — named '
            + 'rather than passed over.' },
```

## §8 · NEW TEST FILES AND RATCHET DELTAS

**THIS LANE ADDS NO TEST FILE — the delta on all three ratchets is ZERO.**
Every exit is a sandbox instrument under `harness/laneREG4/` (`.mjs`, outside `tests/`), which is
the same shape REG-1/2/3 used and is why none of them moved a ratchet either. The standing law
("a new test file reds THREE ratchets") is therefore not triggered by REG-4.

⚠ **THE OBLIGATION THAT IS OWED AT THE PORT, and it is recorded rather than left to be re-found:**
`MARKET_SHAPES`, `V_B13`, `B13_BAND`, `FAUBOURG_ORIGINS` and `FLOOR_CANDIDATES` are five new
closed vocabularies with **no totality walker**. Nothing reds today. REG-3 owes the same for
`BODY_TYPES` / `ROOF_FORMS` / `MEMBER_ROLES` / `FAMILIES` and REG-2 for
`BAND_REGIMES` / `WEAR_GRADES` / `RAMPART_RUNGS` — **one walker can cover all three waves**, and
that walker WILL be a new test file and WILL red the three ratchets. The bill belongs to whoever
writes it, and it is one bill rather than three.

## §5 · OP SPEND vs THE §628-SIGNED CEILINGS — **EVERY TIER HOLDS; NO RAISE ASKED FOR**

⛔ **AND THE FIGURES HAD TO BE RE-MEASURED BEFORE THEY MEANT ANYTHING.** `OP_CEILING_BY_TIER` at
this seal still holds the PRE-REG-2 values — `thorp 1000 · hamlet 1200 · village 1800 ·
town 4600 · city 6400 · metropolis 9700` — while ODQ §628 has SIGNED
`hamlet 1400 · village 2000 · town 9300 · city 10000 · metropolis 14200`. Two mid-pass rations
price against `CEIL`, so a spend measured at the low pin reports a drawing that gives way early
and that nobody will ship — REG-3's own "the fixed point is real" caveat, biting. Measured
through `REG_OP_CEILINGS` (J-REG4-10), which prices at the SIGNED table without moving the pin:

| leaf | tier | signed ceiling | BASE | `--market` | `--footprint` | BOTH | **ALL WAVES ARMED** | over |
|---|---|---|---|---|---|---|---|---|
| thorp | thorp | 1,000 | 904 | 908 | 904 | 908 | **968** | 0 |
| hamlet | hamlet | 1,400 | 1,126 | 1,133 | 1,116 | 1,123 | **1,256** | 0 |
| village | village | 2,000 | 1,226 | 1,237 | 1,184 | 1,195 | **1,431** | 0 |
| mountain | village | 2,000 | 1,540 | 1,552 | 1,532 | 1,544 | **1,764** | 0 |
| town | town | 9,300 | 4,447 | 4,500 | 4,348 | 4,401 | **6,577** | 0 |
| highwater | town | 9,300 | 4,610 | 4,704 | 4,579 | 4,673 | **7,305** | 0 |
| city | city | 10,000 | 5,799 | 5,886 | 5,701 | 5,788 | **8,185** | 0 |
| migration | city | 10,000 | 5,803 | 5,890 | 5,705 | 5,792 | **8,189** | 0 |
| metropolis | metropolis | 14,200 | 7,985 | 8,108 | 7,784 | 7,907 | **11,301** | 0 |

**PER TIER, EVERY WAVE ARMED (REG-1 fusion + REG-2 rampart + REG-3 shape code + REG-4 both arms):**

| tier | signed ceiling | worst leaf | max | headroom |
|---|---|---|---|---|
| thorp | 1,000 | thorp | 968 | **32** ⛔ tightest in the corpus |
| hamlet | 1,400 | hamlet | 1,256 | 144 |
| village | 2,000 | mountain | 1,764 | 236 |
| town | 9,300 | highwater | 7,305 | 1,995 |
| city | 10,000 | migration | 8,189 | 1,811 |
| metropolis | 14,200 | metropolis | 11,301 | 2,899 |

⭐ **REG-4 ASKS FOR NO §217 RAISE.** Its own marginal spend is **+4 … +123 primitives** for the
market register and **−16 … −201 (a SAVING)** for L-REG-30, which draws fewer bodies by
construction. DOM nodes rise 64→69 at thorp and 346→423 at metropolis — every new mark batches
into an existing path, which is the same near-free unit REG-3 measured.
⚠ `OP_CEILING_BY_TIER` IS UNTOUCHED. Landing the §628 table in the pin is the chair's act, and
until it lands the tree prices at the OLD values — under which the ALL-WAVES totals are
`968 / 1,252 / 1,764 / 7,291 / 8,177 / 11,291`, i.e. **REG-2's town/city/metropolis ceilings
(4,600 / 6,400 / 9,700) are exceeded by 2,691 / 1,777 / 1,591 at the tree's own pin.** Both
readings are given so nobody has to guess which table a figure was priced against.

## §6 · DEFERRED, WITH REASONS (documented, not bugs to re-find)

1. ⛔⛔ **THE SPRAWL ARM OF THE DENSIFICATION DIFFERENTIAL FAILS AT THE SEALED TIP** — 509 untyped
   extramural bodies on the present-day town, and intramural holdings FALLING 1,414 → 883 between
   year 100 and the present. The engine grows outward past a standing circuit instead of
   densifying inside it. The cure is a growth-model change at L0 (`builtUmbrella` / `parcels`),
   which is new capability versus repair — **owner-gated. Chair's.** The instrument is built,
   band-agnostic, controlled and re-runnable.
2. ⚠ **`triangular` FIRES ON NO CORPUS VOID** and **`bridgehead` ON NO CORPUS FAUBOURG.** Both
   branches are reachable by construction and both thresholds are derived rather than chosen, but
   NEITHER HAS A LIVENESS CONTROL YET. **A synthetic control is owed** — a void with three roads
   at 120°, and a faubourg sited on a deck — on the pattern of the planted-sliver control that
   the L-REG-30 arm already carries. Until it exists, "the branch is unfired" is honest and "the
   branch works" is not claimed.
3. ⚠ **EVERY EXTRAMURAL REGION TYPES AS `road`**, because a district region's own centroid is far
   from any gate even when its buildings are not. Region-level `gate`/`bridgehead` would need the
   region's NEAREST POINT rather than its centroid. Declared; the building-level typing (gate 42 ·
   road 87) is where the distinction currently lives.
4. ⚠ **THE FOUR §628 CEILINGS ARE STILL UNLANDED IN `OP_CEILING_BY_TIER`.** Not this lane's to
   move (§217/§9/§604). ⚠ Re-measure after landing them: the ration's fixed point means the BASE
   column itself moves (town 4,386 → 4,447 between the two pins, measured above).
5. ⚠ **`i1` SQUINT, `i2` ROUTE-TRACE, `i5` ROLE CONTRAST, `i6` FRONTAGE AND `i7` FTG COLOUR WERE
   NOT RE-RUN**, and the reason is stated rather than implied: this wave adds no new ROLE and no
   new colour (every mark takes an existing role token — `roadTone`, `inkTone`, `yardTone`,
   `P.walls`), and it moves no street centreline, so i2's route trace and i7's hue are untouched.
   ⛔ **i5 AND i6 GENUINELY SHOULD MOVE AND ARE OWED**: L-REG-30 removes drawn bodies (i6's
   frontage density over conserved ink area is exactly the quantity that changes) and the market
   furniture adds detail-weight ink inside the `square` role (i5's role-pair contrast). **The lane
   ran out of window before these two; they are the first thing a successor should run**, and the
   commands are in §9.
6. ⚠ **ARM 3 OF THE SEAM CENSUS (the pixel transect) IS IMPLEMENTED BUT UNRUN.** The geometric
   arms are exact and the mutations convict on them; the raster arm is corroboration, and headless
   Chrome's hang (J-REG4-11) ate the window. `--raster` runs it.
7. ✅ **SUPERSEDED — THE CORPUS LEG COMPLETED.** All four crops rendered in BOTH arms plus the
   full pages and the 200 px squint pair; the inventory is in §3.
8. ⚠ **THE TASTE GATE IS NOT THIS LANE'S TO CLOSE.** The crops are rendered and retained in
   `<worktree>/out/`; the owner's verdict on them stands outstanding.

## §3 · THE CORPUS LEG — the market void at page register, both arms, same box

`node harness/laneREG4/crops.mjs --leaf=town` · crop box chosen by a rule written in the file
BEFORE anything was looked at: *the leaf's PRINCIPAL void, framed at 2.4 × its own reach.*

| crop | rule that chose the box | AFTER | BEFORE |
|---|---|---|---|
| **MARKET** | the principal void at 2.4 × its own reach | 708,241 B | 686,731 B |
| **FAUBOURG** | the extramural district with the most members, at 2.0 × its ground's reach | 197,362 B | 170,416 B |
| **QUARTER** | the densest 90 × 90 window of drawn bodies | 652,132 B | 655,560 B |
| **FUSED** | the L-REG-30 host that absorbed the most sub-minimum neighbours, at 14 × frontage | 504,941 B | 505,502 B |
| **PAGE** (2000 px) | the whole leaf | 2,053,050 B | 2,043,238 B |
| **PAGE-SQUINT200** | L-REG-1's own 200 px squint | 32,275 B | 32,245 B |

Boxes and every void's shape / mouth count / fixture list / §18.4 citation are recorded in
`out/CROPS4-town-picks.json`, so a reader can check the drawing against the decision.

**READ AT PAGE REGISTER, side by side:**

- **BEFORE** — a pale amoeba with a CLOSED dark outline all the way round, the line running
  straight across the street mouth at the north-west and along the whole south-east edge. Two
  small bodies float in it. It reads as a hole in the fabric, not as a place.
- **AFTER** — a CARVED SQUARE with straight sides and ENTRY GAPS: the outline stops where each
  street comes in, and the void's surface and the carriageway's are visibly one continuous
  ground. Two STALL ROWS with their dashed stall-lines run along the void's long axis (hf320's
  market street). A ringed step-circle MARKET CROSS, a CONDUIT, a TROUGH and a PILLORY stand off
  the through-line. The ENCROACHMENT ISLANDS eat the west side back in the fabric's own building
  ink, with the DASHED RETREAT GHOST showing where the outline used to run.

⚠ The register void is visibly SMALLER than the reserved blob (town retention 66 %) — the price
of a straight-sided shape cut inside a 12-gon, and the retreat ghost is what tells the reader the
place used to be bigger. Reported for the taste gate rather than compensated.

**THE OTHER THREE CROPS, read:**
- **FAUBOURG** — the two typed districts are told apart BY THEIR GEOMETRY without a label: the
  upper one is a long RIBBON strung along the approach with its frontage spine down the middle
  (`road`), the lower one a compact KNOT at the gate with hf311's TOLL BAR drawn across the way
  (`gate`). That is L-REG-3's "the type must be VISIBLE in geometry", discharged in a picture.
- **FUSED** — a densified quarter of party-walled ranges with no one-room cell anywhere in frame;
  the §630 directive's own words ("no small one room blocks") made visible.
- **QUARTER** — AFTER and BEFORE are within 3.4 kB of each other, which is the correct result: the
  footprint law removes slivers and changes nothing else about the densest ground.

## §11 · THE ARM'S OWN LIVENESS (a control, because an "unchanged" reading proves nothing alone)

i10 ran ARMED and UNARMED and came back **line for line identical** — Census A 0/79, cross-check
10/79, Census B 0 of 15,326 members, 6,083 suburb, 25,001 drawn bodies, §240.1 = 0. That is the
CORRECT result (this wave publishes tables and adds no drawn fabric body), but it is also exactly
what a dead arm returns, so the arm was proved separately:

```
REG_FABRIC_OPTS='{"marketRegister":true,"minFootprint":true}' node -e '…buildOne("town")…'
  → marketRegister present: true | voids: 1 | minFootprint present: true | verdicts: 1542
unset
  → marketRegister present: false | minFootprint present: false
```

⭐ **AND THE CROSS-CHECK'S `10 of 79` IS A BASELINE PROPERTY, NOT A REG-4 REGRESSION** — the
unarmed run reports the same 10. Named because a lane reading only the armed run would have had
to guess.

## §9 · EXACT RE-RUN

```
T=.../scratchpad/laneREG4-tree              # detached at the tip below
S=.../scratchpad/reg4work

node $T/harness/exemplars.mjs $S/off-out                        # dormant — must equal the seal
node $T/harness/exemplars.mjs $S/on-out    --market
node $T/harness/exemplars.mjs $S/on-out2   --market             # determinism double-run
node $T/harness/exemplars.mjs $S/foot-out  --footprint
node $T/harness/exemplars.mjs $S/both-out  --market --footprint
for D in base-out off-out on-out on-out2 foot-out both-out; do ls $S/$D | wc -l; done   # 29 each
diff -rq $S/base-out $S/off-out ; diff -rq $S/on-out $S/on-out2

cd $T
node harness/laneREG4/probeReg4.mjs      --json=$S/probe0.json      # the orientation census
node harness/laneREG4/probeMarket.mjs    --leaves=ALL               # shapes + inscription
node harness/laneREG4/seamCensus.mjs     --leaves=ALL               # 0 of 141
node harness/laneREG4/seamCensus.mjs     --leaves=ALL --mutate=fill     # ARM 1 must red
node harness/laneREG4/seamCensus.mjs     --leaves=ALL --mutate=border   # ARM 2 must red
node harness/laneREG4/sliverCensus.mjs   --leaves=ALL --controls    # 0 of 23,436 + C1 + C2
node harness/laneREG4/densification.mjs  --leaf=town --rungs=4      # both arms
node harness/laneREG4/densification.mjs  --leaf=town --rungs=4 --break   # must fail
REG_OP_CEILINGS='{"thorp":1000,"hamlet":1400,"village":2000,"town":9300,"city":10000,"metropolis":14200}' \
  node harness/laneREG4/probeOps4.mjs                              # the §217 table at the SIGNED pin
node harness/laneREG4/crops.mjs --leaf=town                        # the judging artifacts

cd .../reg-instruments
REG_FABRIC_OPTS='{"marketRegister":true,"minFootprint":true}' node i10-censuses.mjs --wt=$T --leaves=ALL
node i10-censuses.mjs --wt=$T --leaves=ALL                         # the unarmed control
node i8-nodrift-trace.mjs --wt=$T                                  # 7 UNTRACED — 4 rows in §7
```

⚠⚠ **THE GLOB THAT BIT REG-3 TWICE STILL BITES**: `ls town-*-parchment.svg | head -1` matches
`town-2-town-parchment.svg` FIRST. Resolve leaf files by EXACT `<key>-<tier>-parchment.svg`.

## §10 · FILE MANIFEST — every touched file, one line of why

| file | + | why |
|---|---|---|
| `src/domain/townMap/fabric/marketRegister.js` | **NEW** ~500 | hf259's three shapes selected from the street web · the mouths (`buildStreetWeb`'s own fronting predicate, lifted) · the register polygon, inscribed by construction · V-B13 and the §629.1 band as data · the §18.4 fossil consumption. Pure; no draws. |
| `src/domain/townMap/fabric/faubourgOrigin.js` | **NEW** ~250 | the typed origin for every faubourg BUILDING and every extramural DISTRICT REGION, consumed from five fields the fabric already publishes; the district ground whose aspect is the visible tell. Pure. |
| `src/domain/townMap/fabric/minFootprint.js` | **NEW** ~250 | L-REG-30: three measured floor candidates with their derivations, the caliper short axis, the FUSE/CLAMP/DROP verdict table, and the drawn-body subject set. Ink-side only; the fabric is untouched. |
| `src/domain/townMap/fabric/buildFabric.js` | ~45 | **SINGLE WRITER, minimal**: one stage 8c beside the fusion and the shape code; two conditional publication keys appended at the END of the literal so no existing key's position moves. |
| `harness/renderFolio.mjs` | ~200 | `8r` the shared void surface with the outline broken at every mouth · `8x` the encroachment islands and the retreat ghost · `8f` the V-B13 plan glyphs · `11r` the typed faubourg districts · the `MF()` chokepoint at every drawn-body site · `REG_OP_CEILINGS` (inert when unset). |
| `harness/exemplars.mjs` | 10 | `--market`, `--footprint`, `--floor=F-A\|F-B\|F-C`, mirroring `--fuse`/`--rampart`/`--shapes`. |
| `harness/laneREG4/*.mjs` | ~800 | seven sandbox instruments: the orientation probe, the market probe, the seam census, the sliver census, the densification differential, the §217 table, the crop picker. |

⛔ **NO SHIPPED-`src/` BYTES** beyond the fabric sandbox this arc already writes in; **no refs
moved, no pushes, no memory writes**; `reg0` / `reg-instruments` / `reg-detail` were READ ONLY —
`i8`, `i10` and `shoot.sh` were shelled, never edited.

---

## RESUME POINT — FINAL

**BASE** `93fa8a2ca7c347c35aea94776dfeb7dc70bf0190` (refs/preserve/map-sandbox-reg3-shapes)
**TIP** `5cce5782de376068df515291f0423335e3a00e74` — detached, on the lane worktree.
Two commits: `68ac62247` · `5cce5782d`.

⭐ **RE-PROVED AT THE WORKING TREE AFTER THE FINAL EDIT AND THEN COMMITTED** (the pre-commit-hook
hazard: a hook that re-stages makes `git diff HEAD` blind). `git status --short` shows no tracked
modification and `git diff HEAD --stat` is empty at the tip, so no hook re-staged anything;
dormancy was 29/29 byte-identical, the seam census 0 of 141 and the sliver census 0 of 23,436 on
the exact bytes that were then committed.

**A SUCCESSOR NEEDS:** §2 for the exit figures · §5 for the op table at both pins · §6 for the
eight deferrals (the SPRAWL finding is the big one) · §7 for the four i8 rows the chair should
commit · §9 for the exact re-run. **The two items awaiting a chair decision are the SPRAWL /
growth-model finding (owner-gated) and the L-REG-30 floor signature (F-C provisional).**
