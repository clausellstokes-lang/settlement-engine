# lane TE-REG-0 — everything-on taste specimen — RECEIPT

STATUS: in flight. Session 1 (predecessor) 10:41–11:05. Session 2 (R2, fresh executor) from ~11:10.

WORKSPACE: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0/`

---

## SESSION 1 (predecessor) — DONE, verified by R2

- Worktree at sealed tip: `w3f-tree` = ee0db96d3 (detached). seedrandom 3.0.5 copied in (not a symlink).
- Base SVGs rendered in `out/`: city-parchment (els=369 prim=5799), village-parchment (els=135 prim=1226), city-darkFantasy (els=333).
- INK_SCALE ladder is NOT gated — unconditional in `inkScale()`. No flag to turn on.
- `postPass.mjs` written: classifier + fusion + countryside + landmark + cartouche-translation + chrome.
- Cartouche translation CONFIRMED landed — `FABRIC 1 : 3.8 HOUSEHOLDS` and `RELIEF 1.00` are gone; replaced by
  `COMFORTABLE, NOT RICH` / `A DEEP INLET UNDER STEEP HILLS` / `LAID OUT TO A PLAN · RAISED AS A GARRISON · BUILT ALONG THE WATER`.

## SESSION 1 — DEFECTS R2 FOUND ON SURVEY (do not re-trust the 11:05 artifacts)

1. **`erode` was never imported** into postPass.mjs, so `WATER()` would have thrown. The lane
   had been running `--no-water`; the delivered specimen had NO water rims, NO surface ruling.
2. `metrics-city.json` at 11:05 shows `--no-paper --no-shadow --no-waver --no-water` were all in
   force. The delivered specimen was therefore NOT "everything-on".
3. **THE WATER WAS GREEN.** MF-A1 `warmRemap()` L69 has an explicit `cool-grey → grey-green`
   branch. Measured: base water `#7E8E97` → REG-0 `#798C97` → MF-A1 `#768A79` (B falls 151→121,
   below G). That fails §574's FTG leg AND the corpus leg (hf103 Fluvius = pale cornflower,
   hf131 harbour = deep slate-blue).
4. **`shoot.sh` could print `SHOOT_OK` for a Chrome ERROR PAGE.** It built `file://png/.full-x.svg`
   from a RELATIVE path → `ERR_INVALID_URL` → Chrome screenshotted its own error page → 40,547 B
   file → `[ -s "$OUT" ]` passed. Fixed: paths absolutised + a byte floor + a distinct
   `SHOOT_SUSPECT` exit 2. ⚠ An exit code with no content check is not a verdict.

---

## SESSION 2 (R2) — RESUME POINT (t+~55)

### LANDED THIS SESSION (all in postPass.mjs, all metric-confirmed)

- **erode imported**; WATER() live: 3-tone water (base slab = shallow, inset body = deep, two
  tidemark rims) + freehand surface ruling. `water_deep 1, water_rim 2, water_rules 1`.
- **REBLUE()** — the post-MF-A1 corrective. MF-A1 runs BYTE-UNCHANGED (it is a preserved artifact);
  REG-0 tags its own marks `data-reg0=` on the way in and re-states them after paint(). Applied:
  `water.fill 1, deepwater.fill 1, waterrim.stroke 2, waterrule.stroke 1, wall.stroke 8,
  wall.fill 8, square.fill 2, square.stroke 2, squares_unslopped 1`.
- **Double-jitter guard** — MF-A1's `a1hand` wraps ONLY `fabric` + `landmarks`, so those two roles
  hand their waver to MF-A1 and every other role keeps REG-0's. The fused masses are emitted
  OUTSIDE the fabric group, so they keep their own `MASS_AMP` wave (captured before the guard).
- **WALL CLEAR BAND (chair regime B)** — subtractive, cannot create overlaps. r=7.19u, 50 of 2216
  building subpaths cleared (2.26%). Landmarks and yards are never struck.
- **THE CIRCUIT NEVER CROSSES WATER** — 12 wet cuts, 634.7u of wall struck off the fjord,
  13 end-work bastions, 41 tower marks, 1 stranded gatehouse mass dropped. ⚠ NO RELIEF FIELD in
  this geometry, so the cliff/crag half of the termination law is skipped and reported.
- **MARKETS ARE ONE GIANT STREET** — square de-tinted to the exact road hex, boundary stroke
  removed, `SQUAREVOID` welds the seam underneath, `a1slop` stripped off the squares wrapper,
  stall rows + market cross furnish the void.
- **BLOCKFRONT BARS STRIPPED + RE-HOMED (owner order)** — the harness's standalone
  `INK.block`+`linecap=square` bar (renderFolio.mjs §11a) was being swept into role `wall` by the
  old classifier and made 1.85× LOUDER. Now role `blockfront`, stripped (1 element), and its 2×
  weight re-homed onto the street-facing edge of the fused mass: **32.83 % of silhouette heavy,
  67.17 % ordinary**; masses below a rank threshold get no heavy line at all.

### RESUME POINT 2 (t+~85) — LANDED SINCE

- ⚠⚠ **REBLUE FILLED THE WALL.** `fill="none"` matches `fill="` — re-stating it as a hex
  filled every open wall polyline and put two page-sized black wedges across the folio.
  Cured: only a value that is ALREADY a hex may be re-stated. CONFIRMED by re-render.
- City specimen verified visually: water blue, wall loudest and STOPPING at both banks with
  end-work bastions, fused dark masses against bright street voids, market reading as a
  widened void with stalls and a cross, translated cartouche, curved ward labels.
- SHAPES CARRY MEANING, safe subset landed: `rhX` cross-hatch for great buildings (same NW
  light as the directional hatch and as MF-A1's `a1block`), CHURCHYARD void, WATERFRONT
  long-mass tone (8 masses, city). ⭐ Area-rank alone picked a courthouse and a
  cartographers' guild, so a CHURCH-CLASS GUARANTEE was added — the church now displaces the
  4th landmark (city `cat:parish_churches_10_30` @ 466.5,480.2; village `cat:parish_church`
  @ 682.4,487.8) and both leaves render 1 churchyard.
- ⛔ **darkFantasy IS NOT SHIPPABLE and is deliberately withheld.** In the night lens the
  bluish() water test catches 15 elements instead of 3, waterM swells over the page, and the
  wall-water clip then strikes 2,809.7 units of circuit and leaves 464.1 — it deletes the wall.
  Diagnosis recorded; the classifier needs a night-lens-specific water test. A bad exhibit is
  worse than none.
- ⚠ RACE TO RE-CHECK: the controls job read `md5 AFTER-city.png` while the main job may have
  been rewriting it. Re-compare CTRL-rerun.png ↔ AFTER-city.png after both settle.

### FINAL STATE — COMPLETE (t+~130)

All deliverables in `reg0/out` + `reg0/png`. Controls all green at the FINAL code state
(quoted in the chair report). Two more defects found and cured after RESUME POINT 2:

5. **crop.mjs stamped a SECOND `preserveAspectRatio`** on a document that already had one.
   Duplicate attribute ⇒ not well-formed ⇒ Chrome renders its XML-error page ⇒ every AFTER
   crop came out a flat slab of *identical* byte length (24,750 B ×3). Tell: identical sizes.
6. **The wall-water clip produced a CATERPILLAR** where the circuit runs ALONG a bank rather
   than across it — a dozen short stubs plus piled end-works. Cured twice: end-works
   deduplicated inside 14u, and a surviving run must now exceed `FRONTAGE × 2.5` (15.6u).
   13 raw termini → 3 end-works; the terminus now reads as one squared bastion at the shore.

⛔ darkFantasy withheld (see above) — deliberately not shipped, diagnosis recorded.
⛔ Chair's TANGENTIAL wall-band regime (A) NOT attempted; regime B (clear space) shipped.
⛔ Fabric-wide SHAPES CARRY MEANING not possible — no per-building type in the leaf.

### EXACT RE-RUN
```
cd .../scratchpad/reg0
R0=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad
node postPass.mjs out/base-city-city-parchment.svg out/spec-city.svg \
  --seed=reg0 --lens=parchment --frontage=6.25 --no-paper --no-shadow \
  --paint="$R0/mf-a1-recovered/MFA1-paint.mjs" --metrics=out/metrics-city.json
./shoot.sh out/spec-city.svg png/AFTER-city.png 2200
```
(`--no-paper` / `--no-shadow` are DELIBERATE: MF-A1's P2–P5 owns the aging and M1 owns the mass
shadow; REG-0's own copies would double them.)
