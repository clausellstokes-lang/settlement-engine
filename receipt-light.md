# RECEIPT — LANE LIGHT — car 1 (the dial lit and landed)

Seat: Opus 5 — Fable-unvalidated · Lane: LIGHT · Dock: `$SC/laneLIGHT`, cut at the §916 product
tip `8961388ce` (claude/composite-r4), detached HEAD, `node_modules` symlinked (never cloned, no
vite build taken).

Brief: `$SC/briefs/brief-LIGHT-car1.md` (read whole) · hazard: `$SC/briefs/LIGHT-HAZARD.md` ·
owner rows: RESUME-NOTE 09-08 13:55 ("Also feel free to land everything lit on" —
"Retroactively as well") and 09-08 13:57 (no true launched settlements; all existing are tests,
inconsequential ⇒ the retroactive half discharged as NO migration).

**Every figure below is from a command this lane executed.** CONFIRMED = executed here.

---

## THE CARS

| car | sha | what |
|---|---|---|
| 1a | `04c37d83f` | the roster loader gains its caller — `loadGenerationLawPayloads()` on the create boundary, awaited by all seven paths that can reach the pipeline, held to the tree by two new walker arms |
| 1b | `35fa42980` | the dial lit — `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION = ROSTER_LIVING_CONTENT_LAW_VERSION`; every dormancy arm inverted, never relaxed; the writer-reach dark row retired by its own premise |
| 1c | (below) | THE PROMISE under law 2 — byte-identical but the roster, on 525 + 768 |
| 1d | (below) | no migration — a law-1 world stays law-1 on every path, lit |
| 1e | (below) | the three holes' arms at dial 2 |
| 1f | (below) | the lit walkers |

---

## CAR 1a — THE LOADER'S CALLER (`04c37d83f`)

### The plant and its site
`loadGenerationLawPayloads()` — `src/domain/density/densityCreateBoundary.js`, an async export
beside `birthConfig`. It awaits `loadLivingContentRoster()` from `livingContentSeam.js`
(the dynamic `import(` form untouched). The boundary is its home because that module already
answers "which law does a birth mint"; the payload a law needs is the same question's other half.

**The seven awaiters** (declared per row in `PIPELINE_REACHERS.payloadAwaitedBy`):

| reacher (class) | awaits it in |
|---|---|
| `settlementGenerateAction.js` (BIRTH) | itself |
| `workers/generationRequest.js` (EXECUTOR) | `settlementGenerateAction.js` **and** `workers/generation.worker.js` |
| `lib/instantWorld/composeInstantWorld.js` (BIRTH) | `store/instantWorldBody.js`, `components/WorldPage.jsx`, `components/surveyor/ConstructionPanel.jsx` |
| `components/surveyor/ConstructionPanel.jsx` (PREVIEW) | itself |
| `workers/customContentPreview.worker.js` (PREVIEW) | itself |
| `store/campaignContentBindingSession.js` (PREVIEW) | itself |

Two worker shells load for themselves because **a Web Worker evaluates its own copy of the module
graph**; a main-thread load does not arm the worker's seam. Both `onmessage` handlers became
`async` with the await INSIDE the existing `try`, so a load failure answers on the shell's own
error channel instead of becoming an unhandled rejection.

`composeInstantWorld.js` is synchronous by design and RE-EXPORTS the loader rather than wrapping
it, so its three callers arm the seam from the chunk they have already paid for and no second
name for one act exists.

### The outage, demonstrated live
A lit birth with the loader NOT awaited, executed in this dock:

```
Error: [livingContentSeam] v2 world, roster payload not loaded
    at livingContentRosterFor (src/domain/content/livingContentSeam.js:121:11)
    at generateSettlementPipeline (src/generators/generateSettlementPipeline.js:180:33)
```

### The two plants (structural prevention), md5-restored
* **PLANT A** — the await deleted from `generation.worker.js`:
  `densityCreateBoundary.walker` **1 failed / 15 passed**, naming
  `src/workers/generationRequest.js: src/workers/generation.worker.js no longer awaits the payload`.
* **PLANT B** — the await deleted from all seven: **2 failed / 14 passed**,
  `nothing in src/ names the create boundary's async payload edge … expected 0 to be greater than 1`.
* Restored by `cp` from a scratchpad copy; all seven md5s **MATCH**; walker back to **16 passed**.
  No `git checkout` was used at any point.

### The eager-closure proof (no build taken)
`EAGER_FIRST_PAINT_MODULES` re-derived from `vite.config.js` before and after the car:
**263 → 263**. `densityCreateBoundary.js`, `livingContentSeam.js`, `livingContentLaw.js`,
`livingContentRoster.js`, `livingContentLawVersion.js` and all seven awaiters are OUTSIDE it in
both states. `livingContentRoster.js` carries no `ENGINE_SHARED_DOMAIN_EXCISIONS` row, so its
absence from the eager graph is also proof it never entered `ENGINE_SHARED_DOMAIN` (that set
seeds the eager derivation). The seam's own three regex arms
(`tests/build/livingContentSeamLazy.test.js`) are green: 6 passed.
⚠ **NO `dist/` EXISTS IN THIS DOCK**, so the chunk-membership read the brief names could not be
taken; the two derivations plus the excision-list read are what stand in its place, and no build
was run (the fence).

### Executed (one focused file at a time, runners 0 before each)
`densityCreateBoundary.walker` 16 · `livingContentSeamLazy` 6 · `livingContentLawWiring` 12 ·
`livingContentMaterialization` 11 · `livingContentRosterPublicDrop` 6 ·
`generationWorkerLazy` 6 (+4 skipped) · `customContentPreviewLazy` 1 (+2) · `worldPageLazy` 3 ·
`engineChunkLazy` 8 (+7) · `settlementSlice` 28 · `instantWorldBinding` 6 ·
`surveyorConstructionPanel` 5 · `generationClient` 17 · `generationWorkerIdentity` 8 ·
`composeInstantWorld` 20 · `campaignRuntimeCallerCoverage` 8 · `negativeAssertionAnchor` 9.
eslint 0 on all sixteen changed files.

### One instrument widened, argued not loosened
`tests/build/generationWorkerLazy.test.js`'s EXACT static-import list for the worker shell goes
from two entries to three. Kept exact rather than relaxed to `toContain`.

---

## CAR 1b — THE DIAL LIT (`35fa42980`)

### The dial line
`src/domain/content/livingContentLaw.js:96-97`

```js
export const NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION =
  ROSTER_LIVING_CONTENT_LAW_VERSION;
```

### 0 of 525 golden rows move with the dial — three-way, executed
| tree | 525 hashes, md5 of the manifest |
|---|---|
| base `8961388ce` (clean `git archive` extract) | `3d091d2400e0c9b68ea2be262a5c3e78` |
| this tree, dial temporarily DARK (control) | `3d091d2400e0c9b68ea2be262a5c3e78` |
| this tree, dial LIT (shipped) | `3d091d2400e0c9b68ea2be262a5c3e78` |

⚠ **`generatorGoldenMaster` IS RED AT THIS TIP AND IT IS NOT THIS LANE'S RED.** It reports
525 of 525 rows drifting from the COMMITTED manifest — **at the base commit exactly as here**.
That is the declared pre-existing prose shift recorded in `scripts/.test-ratchet-baseline.json`
(the fixture cannot be re-recorded before the owner-signed GENESIS freeze). This lane adds zero
rows; the three md5s above are the control.

### The dial's own arms, inverted rather than relaxed
* `livingContentMaterialization`: `is dormant by default` → `the dial is LIT, and the mint writes
  the marker and nothing else`, with the dormant branch still exercised through the leaf's closed
  test.
* `livingContentLawWiring`: `boundaryWithDarkLaw()` added as the mirror of `boundaryWithLitLaw()`;
  the file's two halves SWAP SIDES. The dark arms are kept because the dial is one line in BOTH
  directions and an estate that stops exercising the dormant branch cannot revert on a bad day.
* THE SAME-SEED CONTROL changed SHAPE without weakening: `toEqual(raw)` → equal after subtracting
  the marker's two config echoes, plus an assertion that the marker really is present (so the
  comparison is a subtraction, not two identical inputs).
* THE CLAMP (DEF-2) moved to the DORMANT dial, which is the only dial it matters at — the mint is
  spread LAST, so a non-empty mint always wins and the destructure is load-bearing only when the
  mint is `{}`. A new LIT-direction arm covers the other half: an incoming marker of 1, and an
  incoming unshipped 3, both lose to the dial.

### Nine test files and two scripts gained the async prelude
`composeInstantWorld` is a classified BIRTH and is SYNCHRONOUS, so a caller that does not await
the payload meets the seam's throw. Eight test files compose at module scope, so the await is at
module scope with them: `worldCode`, `constructRealm`, `composeInstantWorld`, `composerPipeline`,
`factionDedup`, `genesisDiplomacy`, `mundaneRealmAcceptance`, `mundaneRealmProjection`, plus
`worldGenerationClockSeam.walker`. Scripts: `observe-genesis-war-ramp.mjs` (top-level await) and
`dormancy-bit-compare.mjs` (per-tree, tolerant of an older tree with no payload edge).

### Executed after the flip
`livingContentMaterialization` 11 · `livingContentLawWiring` 14 · `livingContentRosterPublicDrop` 7 ·
`densityCreateBoundary.walker` 16 · `worldCode` 13 · `constructRealm` 6 · `composeInstantWorld` 20 ·
`composerPipeline` 17 · `factionDedup` 18 · `genesisDiplomacy` 23 · `mundaneRealmAcceptance` 21 ·
`mundaneRealmProjection` 11 · `worldGenerationClockSeam.walker` 12 · `settlementSlice` 28 ·
`instantWorldBinding` 6 · `worldConditionsRegen` 3 · `customContentTunablesRuntime` 5 ·
`locksEngine` 13 · `regenPreservation` 6 · `editProseQueueSpine` 14 · `pendingEditsQueueReset` 5 ·
`settlementSlice.sentinelTierRegate` 4 · `campaignWorldPulseSpatialCanon` 16. eslint 0.

---

## CAR 1c — THE PROMISE UNDER LAW 2, BY BYTES (`807de3eef`)

New file `tests/domain/livingContentPromiseBytes.test.js` (5 tests, 44.16 s). Both corpora are
IMPORTED, never re-spelled: `tests/helpers/goldenMasterCorpus.js` and
`scripts/prose-rate-corpus.mjs`'s `rateGrid()`.

| corpus | N | movers | roster under law 1 | roster under law 2 | wrong law | seconds |
|---|---|---|---|---|---|---|
| GOLDEN 525 | 525 | **0** | 0 | 0 | 0 | 29.4 |
| RATE 768 | 768 | **0** | 0 | 0 | 0 | 28.9 |

**Not one byte other than the law's own declaration moved on 1,293 configurations.** `wrongLaw=0`
is what stops the comparison being one law run twice: every dark row resolved to v1, every lit
row to v2.

### The one excepted field, and a MEASURED CORRECTION TO THE BRIEF
The brief expects `customContentRoster` to be "a frozen record under 2, EMPTY when the run's
reviewed environment holds no living-content definition". **Measured: it is ABSENT, not an empty
record.** `buildLivingContentRoster` returns `null` when no bucket yields a row, so law 2 writes
NO KEY AT ALL on such a run — the empty-roster count is 0 of 525 and 0 of 768, not 1,293 empty
records. Emitting an empty record instead would widen the persisted settlement shape on every
world the product mints, which is an owner-gated persistence decision: **REFUSED, with this
measurement.** The module's own header already argues for the null.

### And the roster is not vacuous (the anti-vacuity measurement)
A lit birth driven through `birthConfig` with `tests/fixtures/customContentReferencePack.js`:
roster PRESENT, `schemaVersion` 1, buckets `deities · factions · stressors · traditions`, one row
each; the dark twin carries none; and after removing the marker AND the roster the two worlds are
**byte-identical**. Materialization is eligibility, and recording moves no other byte.

### One arm was wrong on its first cut, corrected in place
The lifecycle arm replayed from `loaded.config` on the pipeline docblock's claim that
`config._seed` "is how a saved settlement replays itself". It is not: a generated
`settlement.config` is the RESOLVED config and carries no `_seed`, so re-running on it produces a
DIFFERENT TOWN (`densityCreateBoundary.js`'s header records the same executed finding). The arm
replays from the INPUT config and asserts separately that the LAW travels on the persisted config.

---

## CAR 1d — NO MIGRATION (`4c95c926f`)

The owner's second word of 2026-09-08 DISCHARGES the retroactive half of the first: there is
nothing to migrate. `livingContentLaw.js`'s property 3 stands unchanged and gains ONE dated
paragraph quoting the owner. **No migration, no read-path stamp, no provenance line for one.**

### The arms
* A PERSISTED law-1 world — markerless, exactly what any save from before the flip is — JSON
  round-tripped, placed on a store whose WIZARD CONFIG IS LIT, `regenSection('npcs')` run against
  it, then taken through the clone seam every undo, snapshot and version-history entry round-trips
  through. All three hops leave the marker absent, the resolved law at 1, and the roster absent.
  Two positive controls: the build is asserted LIT, and the regen is asserted to have really
  rewritten `npcs`.
* Every reader treats ABSENT as empty, driven: the gallery strip (REFERENCE-identical — it did not
  merely survive, it did not allocate), the account remapper (`{ok:true, roster:null}`, never a
  refusal), both public projections.

**THE PLANT:** `importScrub.js`'s presence test replaced by a dereference reds the arm with
`TypeError: Cannot read properties of undefined (reading 'schemaVersion')` — 1 failed / 15 passed.
Restored, md5 MATCH, 16 passed.

### Six stale sentences corrected where they stand
`livingContentSeam.js` · `generateSettlementPipeline.js` · `composeInstantWorld.js` ·
`settlementGenerateAction.js` · `importScrub.js` · `densityCreateBoundary.js`'s GENERATION_LAWS
`why` STRING. ⭐ And one of them named the WRONG MECHANISM even before the flip:
`importReconciliationAdmission.js` grounded the OSR walker's blindness on "the dial is dormant",
when what actually keeps the roster off that corpus is `customContent: {}`.

---

## CAR 1e — THE THREE HOLES' ARMS AT DIAL 2 (`fc546fd2e`)

| suite | at dial 2 |
|---|---|
| `importScrub` (gallery ingest, DEF-1) | 13 passed |
| `campaignSlice.galleryImport` (the second gallery path) | 6 passed |
| `importReconciliation` (DEF-3) | 18 passed |
| `accountImportSlice` (DEF-4/DEF-5, live entry + every `versionHistory[i].settlement`) | 26 passed |
| `accountSettlementContentPortability` (the remap-or-drop law) | 17 passed |
| `livingContentRosterPublicDrop` (O-11 path 1) | 7 passed |
| `livingContentLawWiring` (DEF-2's clamp, both directions) | 19 passed |

⭐ **AND THE ARM NONE OF THEM HAD.** Every L-MAT-FIX cure drives a HAND-BUILT roster, because on
the day they were written the product could not mint one. This car adds a world minted by the LIT
PRODUCT (through `birthConfig`, with a reviewed environment) carried into the boundaries: the
anti-vacuity arm first (marker 2, buckets exactly the law's four, provenance beside it), then the
gallery ingest drop (roster + provenance + the foreign birth law, town intact) and both public
projections.

⚠ **RECORDED, NOT CURED:** the DM-full projection carries the law MARKER on the config. A build
fact, not an account-scoped identifier, and the gallery INGEST drops it on the way back in.

---

## CAR 1f — THE LIT WALKERS (`5faa1c4b9`)

`mechanismLitCoverage` is **green (12 passed) and BLIND to this law**, and now says so in its own
header. Both axes miss a VERSIONED GENERATION LAW: axis 1 enumerates flat modules under
`src/domain/worldPulse` (these live under `src/domain/content/`), axis 2 enumerates `<x>Enabled`
simulation-rules flags (this is a version constant, and the lit path is decided by the WORLD'S
persisted config). It was green while the law shipped unlit, green now it is lit, and green
through the whole period when lighting would have taken generation down.

The reference-pack drive and the DM-full arm landed in 1e, where the boundary arms are.

---

## REGISTER — THE LIGHTING CENSUS (`48c001cc8`)

Refrozen by its own ritual on a clean tree at `5faa1c4b9`, verified by a plain re-run (34 passed).

    files 2556 -> 2557 · parked 375 -> 375 · credited 2181 -> 2182
    titles 24031 -> 24046 · suiteTitles 6419 -> 6422

⚠ The note was written wrong once ("no suite title moved", against the same run's 6419 -> 6422)
and RE-MEASURED rather than patched; the second refreeze moved no figure, which is the proof only
the prose changed.

---

## REFUSALS — each with its measurement

### R1 — the writer-reach REGISTER DIGEST (`--write` refused; the chair's register car)
Lighting the dial convicts the dark-register row `customContentRoster on settlement` at clause
D-dial, in the instrument's own words:

```
writer-reach dark register row "customContentRoster on settlement" is UNVERIFIABLE (clause D-dial):
the shipped dial NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION already EQUALS the lit
ROSTER_LIVING_CONTENT_LAW_VERSION (2), so the key is written on every world and this read must be
judged normally. Retire the row rather than outliving its own premise.
```

The row's own `lighting` prose said the same before the day came ("this row must die with its
premise"). It is **STRUCK** from `scripts/lib/writer-dark-register.mjs` (6 rows → 5) with the
retirement recorded in the register's header. That moves ONE frozen value and nothing else:

    registerDigest  ac4734954adbaee04755427934180b8f129c0b0df21072ec00f49b7e797bd1b0
                 -> 14a3b59541fe2288628da0a815192e34c8138d55f73e98ffefae63e902076501

**Everything else is unmoved, measured:** `node scripts/check-writer-reach.mjs` (plain, no flag)
**exits 0** and prints `WRWALKER HOLD — judged 6532 · LIT 560 · LIT-NAME 4646 · DARK 1326
(reviewable 526)`, identical to `scripts/.writer-reach-baseline.json`'s `population`
(`judged 6532, lit 560, litName 4646, dark 1326`), `reviewableDarkCount 526`,
`pendingSurfaceCeiling 3`, `darkUnregistered 1322`. The baseline file is **untouched**
(`git status --porcelain scripts/.writer-reach-baseline.json` → 0 lines).

⛔ This lane may not run a register `--write` (the brief's fence permits only the lighting census
ritual and the wiring census count-only re-take). So **`tests/lint/writerReach.walker.test.js` is
left RED on that ONE digest arm — 55 of 56 pass** — for the chair's register car. Five other arms
that referenced the retired row were re-authored so the digest is the only red: the row count
(6 → 5), the dial-rows list (two → one), and three plants whose DOOR moved to the DENSITY dial
(still 1 against a register version of 2), because a plant that dies at D-dial never reaches the
clause it was built for.

### R2 — the roster's EMPTY-RECORD shape (owner-gated persistence; refused)
See car 1c. The brief expects an empty frozen record under law 2; the code writes NO KEY. Changing
that widens the persisted settlement shape on every world the product mints.

### R3 — the `_gallery_dm_full_json` SQL twin (owner-gated migration; refused, and it is the
lane's one real exposure finding)
The CLIENT half of the DM-full drop is landed (`publicSafe.js` deletes both records). The SERVER
re-issues the stored row through `_gallery_dm_full_json` (net-current at migration 129), which
drops a NAMED list and passes everything else — neither `customContentRoster` nor
`customContentProvenance` is on that list, so a dossier shared with `gallery_share_dm` and read
back from the server still carries the author's unadopted homebrew library.

⚠ **THE LIGHTING DID NOT OPEN THIS DOOR, IT WIDENED IT BY ONE KEY.**
`customContentProvenance` is written by the pipeline with no reference to any dial and has ridden
that path for as long as it has existed; lighting adds `customContentRoster` beside it. **BOTH are
conditional on the run's reviewed environment holding custom content** — measured on this build, a
generation with `customContent: {}` writes NEITHER key, lit or dark (0 of 525, 0 of 768). The
exposure window is authors of homebrew who then DM-share, not every user.

A migration is a deploy-shaped act on a shared surface: **no migration file was written.** The
spent dial tripwire in `livingContentRosterPublicDrop.test.js` was re-cut onto the real gap — a
pin over the net-current SQL body asserting it strips NEITHER key, with a BANK-THE-WIN instruction
so the arm's RED is the cure arriving.

### R4 — the test-totals census (`check-test-ratchet.mjs`) NOT run
It runs the whole suite, which this lane's fences forbid. **Predicted delta, counted by hand from
the executed per-file figures: +1 test file, +15 tests.** (livingContentPromiseBytes +5 in a new
file; livingContentLawWiring +7; densityCreateBoundary.walker +2; livingContentRosterPublicDrop
+1.) `tests/lint/testRatchet.test.js` itself is green at 94 passed.

---

## CAR 1g — THE ONE STRICT RED LIGHTING PRODUCED (`990a7860a`)

`check-domain-strict` at the tip, verbatim:

```
src/domain/content/livingContentLaw.js(191,10): error TS2367: This comparison appears to be
unintentional because the types '2' and '1' have no overlap.
[domain-strict] strict-type regressions in the domain kernel (fix or annotate; do not widen the
baseline): src/domain/content/livingContentLaw.js: 1 strict errors (baseline 0) — +1
```

The comparison is the mint's DORMANT branch, which is what keeps the revert one line; TypeScript
inferred the LITERAL type of whatever the dial holds and convicted it as dead. Cured by
`@type {number}` on the dial, argued at the line: **a dial's declared type must be the SPACE of
law versions and never today's setting.** The sibling density dial needs no annotation only
because it sits at the default, where its two literals overlap; it will need this the day it is
lit, and the note says so. The baseline was NOT widened.

---

## THE GATES AT THE LANE TIP `990a7860a`

| gate | result |
|---|---|
| whole `tests/lint` | **1 failed / 2490 passed (2491)** across **148 passed / 1 failed (149)** files — the ONE failure is the refused writer-reach register digest (R1) |
| `check-domain-strict` | **exit 0** — "no strict-type regressions (1120 errors, ceiling 1120)" |
| `check-full-typecheck` (tsconfig.full.json) | **exit 0** — "no type regressions (173 error(s), ceiling 173)" |
| OSR `check-observed-shape-readers` (read only) | **exit 0** — "1972 finding(s), exactly matching the frozen inventory"; drift lines 0; **no write** |
| prose-numerics re-key (dry) | **exit 0** — `baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0` |
| writer-reach plain (dry) | **exit 0** — `WRWALKER HOLD — judged 6532 · LIT 560 · LIT-NAME 4646 · DARK 1326 (reviewable 526)`, identical to the baseline; baseline file untouched |
| lighting census walker (plain, post-refreeze) | **34 passed** |
| the cast walker `tests/lint/domainAnyCastBaseline.test.js` | green inside the whole `tests/lint` run |
| the byte ratchets `tests/lint/sizeBaseline.test.js`, `tests/lint/proseCorpusBytes.test.js` | green inside the whole `tests/lint` run |
| first-paint byte budget `tests/build/vendorPdfLazy.test.js` | **27 passed / 27 skipped** |
| `eslint src/ tests/ scripts/` | **exit 0** — 0 errors, 31 warnings, **none on any file this lane touched** |
| voice E2 `tests/copy/voiceMechanics.test.js` | **1 failed / 18 passed** — and the failure is INHERITED, not this lane's (below) |
| `tests/lint/testRatchet.test.js` | 94 passed |
| porcelain | **0** |
| vitest runners at return | **0** |

### ⚠ THE VOICE E2 RED IS INHERITED, AND THE PROOF IS THREE-WAY
The arm reports exactly two files:

```
src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0
```

1. **The chair predicted this state at §916**, in `run-registers-916.sh`'s own PREDICTIONS line:
   "voice E2 = the two INHERITED banked files (labelBands em 5, generalStateProse em 3)". The
   file names and both counts match exactly.
2. **`git diff --stat 8961388ce..HEAD` on both files is EMPTY** — this lane never touched either.
3. **Every line this lane added to a src file is a COMMENT**, except two: the
   `loadGenerationLawPayloads` import and its `await` in `settlementGenerateAction.js`. Neither
   carries an em dash, an exclamation mark, a `toFixed` or a float interpolation, and the E2
   ratchet's scope is `src/data + src/domain` in any case.

⚠ **NOT RUN, AND WHY:** `node scripts/check-test-ratchet.mjs --update` (the census totals) runs the
WHOLE SUITE, which this lane's fences forbid; it is the chair's ratchet ritual. No vite build was
taken (the fence), so no `dist/` chunk-membership read was possible — the eager-closure proof is
the two vite derivations plus the excision-list read.

---

## THE CARS, FINAL

| car | sha |
|---|---|
| 1a the loader's caller | `04c37d83f` |
| 1b the dial lit | `35fa42980` |
| 1c THE PROMISE by bytes | `807de3eef` |
| 1d no migration | `4c95c926f` |
| 1e the three holes at dial 2 | `fc546fd2e` |
| 1f the lit walkers | `5faa1c4b9` |
| register: the lighting census | `48c001cc8` |
| 1g the strict annotation | `990a7860a` |

Dock tip `990a7860a`, 8 cars over `8961388ce`, porcelain 0.
