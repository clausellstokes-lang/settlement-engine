# SKEPTIC — §912 / lane L-MAT — LENS: THE BUILD AND FIRST PAINT (car 1 `442c7f988`, L1 + L3)
Seat: Opus 5 — Fable-unvalidated (skeptic). Read-only on every tree. No build run.
Dock: .../scratchpad/laneLMAT — HEAD `7d96e2b72245fa465182d59dade31621f31ecf2c`, porcelain 0 BEFORE and AFTER.
HOLD-VITEST absent, re-checked before each of the four vitest runs.
Artifacts read: `$SC/lmat/build-{base,car1-nopin,car1-nopin-B,car2,tip}.{listing,meta}` (the brief's
"lmat-builds/" holds only `build-BASE.log`; the real listings are under `$SC/lmat/`).
My own scripts: `cmp2.py`, `rehash.py`, `closure.mjs` (this dir).

## THE HEADLINE
Every arithmetic figure the lane reports reproduces EXACTLY. Two claims do not:
one is a shipped false sentence in product source (twice), the other is the car's own framing.

## 1. THE LISTINGS (re-derived independently; normalized by stripping the 8-char content hash)
| pair | chunks ADDED | REMOVED | files whose SIZE moved | total byte delta | files whose BYTES moved |
|---|---|---|---|---|---|
| base → car 1 (B) | 0 | 0 | **0** | **0** | 658 = 311 html + 347 js |
| base → car 2 (D) | 0 | 0 | 1 — `densityCreateBoundary.js` 101 → 130 (+29) | +29 | 685 = 311 html + 374 js |
| base → tip (E) | 0 | 0 | 2 — `accountImportBody.js` 22,782 → 25,209 (+2,427); boundary +29 | **+2,456** | 685 |
All five listings are 1,377 lines. `LISTING_LINES=1377` in all five metas. CONFIRMED, every figure.

**L3 (the determinism control) CONFIRMED the hard way**: `build-car1-nopin.listing` and
`build-car1-nopin-B.listing` are the SAME FILE BY md5 (`5e0e4e769d2f2ab4fee3ec78fffbd0e3`) —
0 differing lines out of 1,377. The control is real and the A-vs-B diff is therefore a real
difference, exactly as L3 argues.

## 2. ⛔ REFUTED — "every emitted dist file stayed BYTE-IDENTICAL" (and it is SHIPPED, twice)
The receipt's own body is correct ("658 files re-hashed … every one byte-length-identical").
The COMMIT MESSAGE of `442c7f988` is not, and neither is the product source:
- `src/domain/density/densityCreateBoundary.js:289` — "every emitted dist file stayed byte-identical"
- `src/domain/density/densityCreateBoundary.js:326` — the same clause inside the `GENERATION_LAWS.livingContent`
  `why` string, i.e. inside the executable register a walker reads.
MEASURED: of 1,377 emitted files, **719 are byte-identical and 658 are not** (311 prerendered HTML
+ 347 JS chunks). What is true is "no emitted file changed SIZE" / "byte-LENGTH identical".
A successor reading :289/:326 inherits a false measurement about the exact instrument (the listing
diff) this lane exists to have taken.

## 3. THE PIN (L1) — REFUSAL UPHELD, ON FIRMER GROUND THAN THE LANE GAVE
- `vite.config.js` is untouched by the whole consist (`git diff --stat 3b1c0eaa5..7d96e2b72 -- vite.config.js`
  is empty) and names no density module at all. No pin landed. CONFIRMED.
- The chunk exists at base and is unchanged by car 1: line 265 of both listings,
  `101  581a4f0bf295115ab1177f5be4fb1f65  dist/assets/densityCreateBoundary-CLYaPKyo.js`. CONFIRMED.
- IS IT REALLY THE BOUNDARY MODULE? The tip's dist is still on disk and matches `build-tip.listing`
  byte for byte (md5 `7249f814c7063a12122dae9d8c70f718` both). Its 130-byte
  `densityCreateBoundary-P6jKctaH.js` contains `birthConfig`'s body — a spread of the config, an
  `engine-core` import (the density mint) and an inlined `{}` (the dormant living-content mint).
  So the chunk carries the module's code, not a facade. CONFIRMED at the tip; the base bytes
  themselves were not recoverable (I could not reconstruct the exact 101 bytes; the shape and length
  match, and car 2's +29 lands on this chunk and nowhere else).
- A GROUND THE LANE DID NOT STATE, which makes the refusal stronger: the FP-G11/FP-G17 guard the
  brief invoked — `engineChunkLazy.test.js:238` — has NO jurisdiction here. It iterates
  `ENGINE_SHARED_DOMAIN_EXCISIONS` (18 members) and `densityCreateBoundary.js` is not one of them,
  nor is it named anywhere in `vite.config.js`. The brief's premise was a class error, not just a
  wrong prediction.
- CLEAN-INSTALL RISK: UNTESTED (no build allowed). Nothing in the tree asserts that this module
  keeps its own chunk, so a Rollup/Vite bump could re-parent it silently. It is contained rather
  than guarded: the engine chunk is itself asserted ABSENT from the entry closure
  (`vendorPdfLazy.test.js:735`), so co-location would cost no first paint.

## 4. ⚠ PARTLY — "the create boundary LEAVES FIRST PAINT" is true of the SOURCE derivation only;
##    at the BUILT bundle the module was never in first paint and no byte moved
SOURCE side, re-derived by me at three trees (`git archive` of `3b1c0eaa5` and `442c7f988` into this
dir, plus the live dock):
```
BASE  MAINJSX_CLOSURE=239  IN[densityCreateBoundary.js]=true   IN[densityLaw.js]=true
CAR1  MAINJSX_CLOSURE=238  IN[densityCreateBoundary.js]=false  IN[densityLaw.js]=true
TIP   MAINJSX_CLOSURE=238  EAGER_COUNT=263  EAGER[densityCreateBoundary.js]=false
```
239 → 238, boundary true → false, density unchanged, EAGER 263 at the tip. ALL CONFIRMED.

BUILT side, measured by me with the test's own walker (`closure.mjs`, a transcription of
`entryStaticClosure()`), against the dock's live tip dist:
```
8 files  RAW 1042086  GZIP 330813  BROTLI 277727   boundary in closure: false
```
— identical to the receipt's tip figures to the byte. And the base closure was the SAME 8 files:
* `dist/index.html` is **8,197 bytes in all four builds** and the tip's carries exactly 7
  `rel="modulepreload"` links (the 7 non-entry closure members; the boundary is not among them).
  An extra preload line for the boundary chunk would be ~84 bytes, so base had 7 links too.
* the entry chunk is **570,269 bytes in all four builds**, and 7 of the 8 closure members are
  byte- AND filename-identical between base and car 1. Removing an eager `export{…}from"./densityCreateBoundary-…"`
  from the entry chunk cannot be a zero-byte edit.
* the tip's only STATIC importers of the boundary chunk are `settlementGenerateAction-*.js` and
  `composeInstantWorld-*.js`, both lazy; the entry names it only inside a `__vitePreload` dependency
  ARRAY (a string list for a dynamic import), never as a static edge.
CONSEQUENCE: Rollup had already bound the lazy chunk straight to the boundary chunk at base, through
the re-export. The 658 re-hashes are equal-length minifier/ordering noise rippling out of one lazy
chunk. **Car 1's shipped first-paint benefit is exactly zero bytes** — its real value is that it
moves the module out of the estate's SOURCE-level `EAGER_FIRST_PAINT_MODULES` derivation, which is
what makes car 2's static `livingContentLaw.js` import legal under `livingContentSeamLazy.test.js:134`.
The brief called car 1 "the measured lever"; the lever moves an instrument, not a payload.

## 5. IS "ZERO FIRST-PAINT BYTES" ASSERTED BY A TEST? NO.
Executed in the dock, one file at a time, exit captured in-shell:
| run | exit | result |
|---|---|---|
| `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js` | 0 | 42 passed |
| `npx vitest run tests/build/vendorPdfLazy.test.js` (no VERIFY_DIST) | 0 | 31 passed, **11 skipped** |
| `VERIFY_DIST=1 npx vitest run tests/build/engineChunkLazy.test.js` | 0 | 15 passed |
| `npx vitest run tests/build/livingContentSeamLazy.test.js` | 0 | 6 passed |
The three ceilings are at `:565` = 1_048_000, `:595` = 337_000, `:596` = 283_000 — CONFIRMED, values
and lines. All three are `it.skipIf(!requireDistRead)` and all three are
`toBeLessThanOrEqual` against an ABSOLUTE budget with ~5.9 kB of margin. **No test asserts that the
closure did not grow, and none runs at all without `VERIFY_DIST=1` + a fresh dist.** "Zero first-paint
bytes" rests entirely on the lane's two listings — which do support it (see §4), but a reader must not
believe a gate is holding it.

## 6. SMALLER FINDINGS
- `settlementSliceHelpers.js:44` (base) is exactly the re-export; `composeInstantWorld.js:56` and
  `settlementGenerateAction.js:47` are exactly as the brief says; base `settlementGenerateAction.js:61`
  is the `workers/generationRequest.js` dynamic import. All CONFIRMED at base.
- The removed re-export has no other consumer: `birthConfig` is imported only by
  `composeInstantWorld.js:56` and `settlementGenerateAction.js:56` at the tip. No lifecycle path
  (create / read / regen / clone / import / export) loses a binding.
- The header corrections CONFIRMED: `loadEngine` is defined at `settlementSlice.js:42` and used only
  at `:435`; `settlementGenerateAction.js` never names it and reaches the core through
  `import('../workers/generationRequest.js')`. The new statement is true at the tip.
- Car 1 adds NO `file.js:NN` citation in any comment line, so the estate's "a cited line number is
  wrong at its own commit" hazard does not apply to this car.
- Receipt typo (LOW): "Build A — BASE … 11:58:11→10:58:33"; `build-base.meta` says 10:58:11→10:58:33.
- Provenance nit (LOW): builds A, B and C all record `HEAD=3b1c0eaa5` in their metas, because B and C
  were taken on an uncommitted tree. The metas alone cannot say which tree is which; that A ≠ B is
  proved only by their listings differing while C reproduces B exactly.
- `ls -A node_modules | wc -l` drift (454 vs the brief's 453) was recorded and not investigated by the
  lane. UNTESTED here; it bears on §3's clean-install question.
