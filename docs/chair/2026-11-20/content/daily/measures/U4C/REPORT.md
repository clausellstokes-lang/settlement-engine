# U4c-M — MEASURE FIRST: the PDF's chapter 02 printing the page's Daily Life lines (written 2026-11-22 08:25 UTC by DAILY-3)

The measuring builder's own tool refused this report file, so DAILY-3 wrote it from that builder's final message. The
prototype is `prototype.patch` beside it, against b03a31560 (`lane/stack-96-wip-2026-11-22`). Nothing was committed to src/ or tests/.

- THE DOCUMENT THE PRINT DERIVES FROM: the owner's saved record, normalized in `src/utils/generateSettlementPDF.js ::
  generateSettlementPDF`, then `src/pdf/SettlementPDF.jsx :: buildViewModel({ settlement, dmView: true })`. No
  `toPublicSafe` is on the path. The prototype derives from `settlement` (raw), not the AI overlay.
- THE PROTOTYPE: `src/pdf/lib/viewModel.js :: dailySlice` gains `lines`, from `deriveDailyLife(settlement)` (no
  audience): the page's slots in the page's order (`ENGINE_SLOTS`: dawn_work, gathering_places, child_warnings at
  b03a31560), a slot empty or "—" dropped. Chapter 02 (`src/pdf/sections/IdentityDailyLife.jsx`) prints them under
  DAILY LIFE; the saved AI passages and the food-balance callout keep their own rules. A probe (deleted) confirmed the
  lines match the page and print (village, town, city).
- RUNS (97 files: `tests/pdf` whole and every test naming IdentityDailyLife, dailySlice or SettlementPDF), through the
  mutex: BASELINE all green. WITH THE PROTOTYPE: 1 red.
  (a) a stored register: `tests/lint/writerReach.walker.test.js` > "the surfaceReach grammar round-trips…":
      `scripts/.writer-reach-baseline.json :: surfaceReach["age on founding"]` reads `foundry=N` -> `R`, through
      Foundry's import of `buildViewModel` (Foundry never prints `vm.daily`). Left red, never re-recorded.
  (b) pins of today's chapter text: 0. (c) real faults: 0. The goldenViewModel snapshot HOLDS.
- EAGER BYTES: none. `EAGER_FIRST_PAINT_MODULES` unchanged (332 entries, no dailyLife module).
- FOR THE CHAIR: (1) derive in `dailySlice` (moves the writer-reach register's one row) or in `SettlementPDF` / the
  chapter (no move); (2) the owner-only slot: the print path is the owner's (`dmView: true`), and the slot is absent at
  b03a31560 (it lands with this lane's E1); (3) whether the food callout prints always.
