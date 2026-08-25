# lane TE-REG-0b — the §590 RAMPART draw-level preview — RECEIPT

STATUS: in flight. Started ~12:48 CDT 2026-08-24.
WORKSPACE: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0/`
NEW FILES ONLY: `rampart.mjs`, `probeBody.mjs`, `probeWall.mjs`, `ref/*`, `out/spec-city-rampart.svg`,
`out/metrics-city-rampart.json`, `out/rampart-stats.json`, `png/*-rampart-*`.
⛔ NOT touched: postPass.mjs, MFA1-paint.mjs, out/spec-city.svg, any repo file.

---

## THE DRESS REFERENCE — what was read, and what was taken from it

Plates viewed at `/Users/cstokes/Desktop/settlement-engine/map-corpus/plates/` (downscaled
copies in `reg0/ref/`):

| plate | what it settled |
|---|---|
| **hf314-spec-wall-head** "OF THE WALL WALK" | THE BAND: outer edge + toned walk + inner parapet; the OUTER face carries the merlon comb and is the BOLD line, the inner parapet the light one. Drum tower straddling the band. Gate tower = a big rectangle straddling the band with a blank inner chamber. Ditch hachure sits OUTSIDE. |
| **hf315-spec-tower-variety** "THE SORTS OF TOWERS" | The two forms that straddle a band at plan scale: **ROVND DRVM** (circle centred on the band, ~1.8× band width) and **BOLD SQUAR** (rectangle projecting both faces). Rubble-core texture between the two edges. Open tower floor drawn as an inner void. |
| **hf313-spec-gate-anatomy** "THE MANNER OF TOWN GATES" | Gate = a block straddling the circuit with a **drum flanking each end** and a hollow passage/chamber. The stranded WATER GATE has no flanking drums. |
| **hf124-wall-seam-plan** | "(1) OLD WALL: MASONRY-BAND SURVIVAL" — the band at city-plan zoom: two dark edges, pale rubble core, drum towers as ringed circles. |
| **hf133-city-harbor-plan** (owner-named) | The register the specimen actually sits at: band + **a drum at EVERY angle turn**, doubled rings at the water termini, dotted boom across the harbour mouth. |
| **hf103-metropolis-rings** (owner-named) | Murus band with crenel ticks on the outer face; outer vallum as a separate dashed/hachured line. |
| **hf389-city-metropolis-wallshape** | The closest match in register (monochrome ink city plan): the band is a thin double line and it is the **ring towers at the turns** that make it read as a wall. |

**The grammar taken:** band-not-stroke · outer face heavier than inner parapet · course ticks
across the walk · a tower ON every angle turn · drum/square mix · gatehouse block with flanking
drums · squared end-work at the water · the ditch stays a separate dashed line outside.

---

## THE HARNESS — and the control that makes it trustworthy

`rampart.mjs` is **both** a paint shim and a driver, so `postPass.mjs` is never edited:

- postPass's pipeline is `body → paint() → REBLUE → tail`. `rampart.mjs` is passed as
  `--paint=`, so it receives the **PRE-PAINT composed body**, rebuilds the wall, and then hands
  the result to the recovered MF-A1 `paint()` **unchanged**. Paint therefore still runs LAST.
- ⚠ postPass calls `paint()` with **no `await`** — the shim must be synchronous, so MF-A1 is a
  static top-level import.

**CONTROL (executed): the harness is transparent.** With the rampart stage bypassed
(`probeBody.mjs`, same shim shape, identity transform), postPass reproduces the specimen
**byte-for-byte**:

```
MD5 (out/spec-city.svg)       = e5b9b540c6cab8533261043dfa8aa9a7
MD5 (out/.probe-city.svg)     = e5b9b540c6cab8533261043dfa8aa9a7
```

Every byte of difference in `spec-city-rampart.svg` is therefore attributable to the rampart
stage alone.

## MEASURED: the specimen's wall, before

```
CIRCUIT RUNS: 6                                   GATE MASSES: 5
  run0 sw=6.36 pts=1110 len=1423.8                  gate0 c=[277.6,44.5]  24.8x16.8
  run1 sw=6.36 pts= 902 len=1149.5                  gate1 c=[302.7,48.2]  24.1x17.6
  run2 sw=6.36 pts=  58 len=  73.4                  gate2 c=[680.8,823.7] 24.8x18.1
  run3 sw=7.33 pts=  17 len=  20.1                  gate3 c=[655.9,829.6] 23.5x19.9
  run4 sw=5.33 pts=  58 len=  70.5                  gate4 c=[654.8,789.0] 25.5x24.1
  run5 sw=5.33 pts= 201 len= 256.5
TURN ANGLES (longest run, 6u resample, n=237): p50=6.8 p75=11.6 p90=17.7 p95=21.0 max=48.6
DITCH: dashed #a19682 sw=0.3 dash="3.75 2.5", 19 pts, 10.5–12.8u OUTSIDE the circuit — NOT
       role `wall`, so it survives by construction.
```
run0 ends at (318.6,41.0) and run1 starts at (261.8,42.5): the 57u north gap holds gate0+gate1.
That is already a **twin-gatehouse pair with the road through the middle** — hf313's plate,
latent in the leaf and never drawn as such.

## RESUME POINT 1 (t+~40) — FIRST RENDER LANDED, defects found

`node rampart.mjs` → `RAMPART_OK bytes=1602800 tailStripped=2`, and:
`runs=6 joints=55 drums=30 squares=22 bastions=3 gatehouses=5 gateTurrets=10 courseTicks=853 ops=8`

CONFIRMED working (read off the final file):
- REBLUE restated the band edges + tower rings to `#181009` (wallHard) — the drawn edges only.
  The toned walk / courses / chambers carry their own `data-reg0` tags and were left alone.
  ⚠ this is the cured form of REG-0's own bug: a *toned surface* tagged `wall` goes solid black.
- MF-A1's I2 ladder landed the weights exactly as designed: outer 1.50 · inner 1.17 ·
  course 0.35 · chamber 0.38.
- Warm remap: walk `#c0af92`, tower `#af9f85`, course `#756753`.
- `filter="url(#a1shadow)"` on the group resolves (paint inserts a1defs after this stage) —
  ONE NW light, dx+2 dy+2, the same filter the building masses use.
- **OP DELTA: 543 → 545 drawn tags = +2** for the whole treatment (7 paths + 1 group replacing
  4 body wall paths + 2 WALLENDS tail paths).

DEFECTS FOUND ON THE FIRST RENDER (fixing next):
1. ⛔ **BEAD CHAINS.** run5 (SW shore) and the NW stretch draw as a necklace of touching rings:
   `JOINT_MIN=11` vs a drum diameter of `sw*1.84 = 9.8` — the spacing floor must be keyed to the
   TOWER SIZE, not a constant.
2. ⛔ **THE DUMBBELL.** run3 is 20.1u long and gets a joint at each end — two towers with a stub
   between them. Short runs need one joint, not two.
3. ⛔ **THE FJORD PILE.** run2's start, run3's two ends and a bastion land within ~15u of each
   other across DIFFERENT runs; there is no cross-run joint dedupe, so they overlap into a blob —
   the same caterpillar failure REG-0 already cured once, re-entering by a new door.
4. ⛔ **THE STRANDED GATES.** gate3/gate4 are 42–49u from any surviving circuit; flanking them
   with turrets makes a jumble. hf313's water gate has no flanking drums — suppress turrets on a
   gate block with no circuit nearby.
5. Joint density: `TURN_MIN=7°` is below the circuit's own p50 turn (6.8°), so seams are being
   promoted to corners.
