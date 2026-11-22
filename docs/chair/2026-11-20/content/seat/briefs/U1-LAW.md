# U1 — THE SEAT LAW (CS10), dark. Builder B1. Read `briefs/COMMON.md` first.

**Goal.** A third birth law, `_seatLawVersion`, shaped exactly like the living-content law, so every later unit can branch on "was this world born under the seat law?" — and LANDED DARK: its dial at the default, so `birthConfig` mints nothing and no byte of any born world, golden or born test fixture moves.

**Read whole, then model on:** `src/domain/content/livingContentLawVersion.js` and `src/domain/content/livingContentLaw.js` (the four properties in its header: dormant default and marker omitted at default; a closed membership read that fails closed; no migration; the dial is one line); `src/domain/density/densityCreateBoundary.js` (`GENERATION_LAWS`, `birthConfig` and its incoming-key clamp, `PIPELINE_REACHERS`); `tests/lint/densityCreateBoundary.walker.test.js` (`MINT_SYMBOLS`, `MINT_HOMES`, the earned-ness arm); `tests/domain/livingContentLawWiring.test.js`; `tests/lint/writerReach.walker.test.js` with `scripts/lib/writer-reach-lit-corpus.mjs` (`dialConfigKeys`).

**Files you own:** new `src/domain/seat/seatLaw.js`; `src/domain/density/densityCreateBoundary.js` (the `GENERATION_LAWS` row, the `birthConfig` spread, the clamp of an incoming `_seatLawVersion`); `tests/lint/densityCreateBoundary.walker.test.js` (its tables only); new `tests/domain/seatLawWiring.test.js`. Anything else: stop and report.

**The module exports** (names are yours to keep or improve with a reason): `SEAT_LAW_CONFIG_KEY = '_seatLawVersion'`; `SEAT_LAW_VERSIONS` (1, 2); `DEFAULT_SEAT_LAW_VERSION` (1); `HOLDER_SEAT_LAW_VERSION` (2, the law this train builds); `NEW_SETTLEMENT_SEAT_LAW_VERSION` (the dial: **at the default**); `readSeatLawVersion(value)` (closed membership); `resolveSeatLawVersion(configOrSettlement)` (accepts a config, or a settlement carrying `config` or `_config`; fails closed); `seatsByHolder(configOrSettlement)` (true only under version 2); `newSettlementSeatLaw()` (`{}` at the default dial, else `{ _seatLawVersion: <dial> }`). Pure, no imports beyond what the template imports. Its header states the four properties in its own words and that lighting the dial is the owner's word (the living-content precedent of 2026-09-08).

**Red arms first** (`tests/domain/seatLawWiring.test.js`, each failing before the module exists):
1. `birthConfig({ settType: 'town' })` carries no `_seatLawVersion` while the dial is at the default (and `birthConfig(null)` is byte-equal to its output before your change: read it from the living-content wiring test's own pinned value, do not re-derive it).
2. An incoming `_seatLawVersion: 2` in the config handed to `birthConfig` is clamped away (an imported marker never decides a birth), exactly as the living-content key is.
3. `resolveSeatLawVersion` reads 2 from `{ _seatLawVersion: 2 }`, from `{ config: { _seatLawVersion: 2 } }` and from `{ _config: { _seatLawVersion: 2 } }`; reads 1 from absent, `'2'`, `3`, `null`, `NaN`, `{}` (fail closed).
4. `GENERATION_LAWS.seat` exists with `configKey: '_seatLawVersion'`, `mint: 'newSettlementSeatLaw'`, `dial: 'NEW_SETTLEMENT_SEAT_LAW_VERSION'`, `module: 'src/domain/seat/seatLaw.js'`, `wiring: 'WIRED'`, a `why` over 60 characters that says the dial is dark and why.
5. A planted dial (the test imports the mint and checks it returns `{ _seatLawVersion: 2 }` when called with the dial's lit value through whatever seam the living-content test uses for the same proof; if no seam exists, prove it by reading the module's source as the living-content test does) — mirror what that test does; do not invent a new seam.

**Must stay green unchanged:** `tests/domain/livingContentLawWiring.test.js` (its "exactly two keys" holds because nothing is minted), `tests/lint/writerReach.walker.test.js` (`dialConfigKeys`), `tests/lint/densityCreateBoundary.walker.test.js` after your table rows, `tests/lint` whole. If any of them reds for a reason other than your row, stop.

**Byte note.** `densityCreateBoundary.js`'s import graph decides whether `seatLaw.js` enters the first-paint closure; read the living-content row's `why` (it measured it). Say in your hand-back which side the module lands on and how you know (a build + `tests/build` run is the proof; if you cannot run it, say PLAUSIBLE).

**Cut from:** the commit SEAT-1 names when it dispatches you.
