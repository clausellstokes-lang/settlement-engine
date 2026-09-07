# RECEIPT — LANE L-MAT — **PARTIAL** (in flight)
Seat: Opus 5 — Fable-unvalidated · Lane: L-MAT · Chair: Fable 5.1 (session 8de5f153)
Dock: $SC/laneLMAT · cut at 3b1c0eaa51f77561a036ae7ec54682c39856192c

## PREDECESSOR
Session b43943b4 arrived 2026-09-07 10:24:17 EDT, took the arrival check, wrote the header
of this file, and died with its session before writing a product byte. Its header block is
KEPT verbatim in the arrival section below (marked "predecessor"); its "CARS (none yet)" is
superseded. Successor session 8de5f153 arrived 2026-09-07 10:56:39 EDT (`date`).

## STATUS: PARTIAL — car 1 landed; cars 2-6 in flight.

## ARRIVAL CHECK (successor, 2026-09-07 10:56:51 EDT, from `date`) — PASS
- HEAD `3b1c0eaa51f77561a036ae7ec54682c39856192c` == `git -C <main tree> rev-parse claude/composite-r4`
  (`3b1c0eaa51f77561a036ae7ec54682c39856192c`). CONFIRMED.
- `git status --porcelain | wc -l` = 0. CONFIRMED.
- `ls -A node_modules | wc -l` = 454 (brief said "≈453"; predecessor measured 453 at 10:24).
  CONFIRMED within the brief's tolerance; the one-file drift is not investigated.
- `$SC/HOLD-VITEST` ABSENT at 10:56:51 EDT and re-checked before every vitest since. CONFIRMED.
- Predecessor's own arrival block (verbatim): HEAD match, porcelain 0, 453 symlinked packages,
  HOLD-VITEST absent at 10:24:17 EDT.

## CARS
| # | sha | subject |
|---|-----|---------|
| 1 | `442c7f988` | the create boundary leaves first paint; the PIN is REFUTED by the build |

Dock tip after car 1: `442c7f988`. Porcelain 0.

## BUILD LISTINGS (the two the brief asks for; three builds taken, plus one control)
All builds `sh scripts/gate-mutex.sh --run -- npm run build`, exit 0, ~22 s each.

**Build A — BASE** `3b1c0eaa5`, 11:58:11→10:58:33 EDT. 1,377 emitted files.
**Build B — CAR 1** (source edits, no pin), 11:02:57→11:03:22 EDT. 1,377 emitted files.
**Build C — DETERMINISM CONTROL**, same tree as B, 11:04:45→11:05:08 EDT.

- C vs B: **0 files re-hashed, 1,377 identical.** The build is deterministic, so the A-vs-B
  diff below is a real difference and not toolchain noise. (This control was not in the brief;
  it was taken because the A-vs-B diff had a shape — 658 re-hashes at zero byte delta — that
  is indistinguishable from a nondeterministic build until the control is run.)
- **A vs B: 0 chunks ADDED, 0 chunks REMOVED, 0 files changed SIZE.** 658 files re-hashed
  (347 JS chunks + 311 prerendered HTML documents), every one byte-length-identical.
- `dist/assets/densityCreateBoundary-CLYaPKyo.js` — 101 B, md5 `581a4f0bf295115ab1177f5be4fb1f65`
  — is present and IDENTICAL in A and B.
- First-paint closure at B (8 files, walked from `dist/index.html`'s entry script):
  raw **1,042,086** / 1,048,000 (margin 5,914) · gzip **330,797** / 337,000 (6,203) ·
  Brotli **277,749** / 283,000 (5,251). Since every dist file is byte-identical between A and
  B, these are the BASE figures too: **car 1 costs zero first-paint bytes.**

## BRIEF FIGURES RE-DERIVED (a brief figure is a hypothesis)
| brief figure | measured at the dock | verdict |
|---|---|---|
| `settlementSliceHelpers.js:44` is the sole eager edge / re-export | line 44 exactly; only `birthConfig` consumer is `settlementGenerateAction.js:47` | CONFIRMED |
| `composeInstantWorld.js:56` imports the boundary directly (lazy) | line 56 exactly; not in the eager set | CONFIRMED |
| main.jsx closure 239 → 238; boundary leaves the eager set | 239 → 238; `EAGER_FIRST_PAINT_MODULES` 264 → 263; boundary true → false | CONFIRMED |
| `densityLaw.js` stays eager (density cost unchanged) | still eager; still an ESD member | CONFIRMED |
| ceilings `vendorPdfLazy.test.js` :565 / :595 / :596 = 1_048_000 / 337_000 / 283_000 | exactly those three lines and values | CONFIRMED |
| walker `MINT_HOMES` row for the helpers file at `:48-52` | rows at :48-52, helpers at :51 | CONFIRMED |
| `densityCreateBoundary.js` header "237 modules" (:226, brief said :231) | the closure is **239** at this tip; the header is STALE. Line is :226, not :231 | CONFIRMED stale / brief's line cite off by 5 |
| header "the lane awaits `loadEngine()`" (:246-248) | FALSE: `loadEngine` lives in `settlementSlice.js:42` and the lane never calls it; the lane calls `runGeneration` (`:40`) and dynamically imports `workers/generationRequest.js` (`:61`) | CONFIRMED false |
| ESD has 68 members, seeded from `src/generators` only | 68 exactly | CONFIRMED |
| `livingContentLaw.js` is NOT an ESD member (so the header's excision instruction is inert) | not a member; `livingContentLawVersion.js` and `livingContentSeam.js` ARE | CONFIRMED |
| `livingContentLaw.js:94-95` dial = default; `:154-162` mint returns `{}` | exactly | CONFIRMED |
| `livingContentRoster.js:33-34` nothing in `src/` reads the key; `:189-194` sort by new id | exactly | CONFIRMED |
| `settlementSlice.js` size-ratcheted (tolerance 0) — the reason the helpers file exists | `scripts/.size-baseline.json` carries `src/store/settlementSlice.js` = 824. Neither `settlementSliceHelpers.js` nor `settlementGenerateAction.js` carries a row | CONFIRMED — and the ratchet is NOT touched by this car |

## REFUSALS (a refusal is a result)
1. **CAR 1's `manualChunks` PIN — REFUSED, with the measurement.** The brief predicted that
   de-eagering leaves `densityCreateBoundary.js` an orphan that Rollup co-locates into the big
   lazy `engine` chunk (the FP-G11/FP-G17 class). Two builds refute it: the module ALREADY has
   its own 101-byte emitted chunk at the base commit, and that chunk is byte- and
   content-hash-identical after the car. There is no orphan to pin, and a pin would be a
   routing rule written against a hypothesis the build refutes. The brief's own largest
   unpriced risk ("does de-eagering re-parent the big lazy `engine` chunk into
   `composeInstantWorld`'s chunk?") is answered NO by the same diff: 0 chunks added, 0 removed,
   0 size changes.

## JUDGMENT CALLS — RETROVALIDATION ROW
| id | call | who | ground |
|----|------|-----|--------|
| R-A | O-11 path 1 = public projection DROPS the roster, PINNED; no migration, no allowlist entry | **CHAIR RULING** | pending car 4 |
| R-B | O-11 path 2 = RESOLVE-OR-DROP on account import, per-settlement grain | **CHAIR RULING** | pending car 5 |
| R-C | O-11 path 3 = one OPTIONAL core key, omitted when dormant | **CHAIR RULING** | pending car 6 |
| R-D | `_livingContentLawVersion` may reach the public projection; RECORDED not changed | **CHAIR RULING** | pending car 4 |
| R-E | the mint is spread inside `birthConfig`, main-thread, mirroring the density precedent | **CHAIR RULING** | pending car 2 |
| L1 | REFUSE the car-1 `manualChunks` pin | LANE | two builds: the chunk already exists and is identical (above) |
| L2 | DELETE the walker's `MINT_HOMES` helpers row rather than keep it as an allowlist entry | LANE | the leaf names the mint nowhere now; a kept row is a standing excuse for a mint returning to an eager store leaf. Walker green at 14/14 after the deletion |
| L3 | take a build-determinism CONTROL the brief did not ask for | LANE | the A-vs-B diff shape (658 re-hashes, zero byte delta) is indistinguishable from a nondeterministic build without it |

## DEFERRED (documented, not a bug to re-find)
- (none yet)
