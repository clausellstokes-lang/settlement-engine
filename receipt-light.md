# RECEIPT — LANE LIGHT — car 1 (the dial lit and landed) + car 2 (the fold's cures)

⚠ **THIS FILE WAS CAR 1's RECEIPT AND CARRIES CAR 2's CORRECTIONS IN PLACE.** The
LIGHT skeptic fold (`$SC/skeptic-light/FOLD.md`, 32 CONFIRMED · 2 REFUTED · 7 PARTLY ·
8 UNTESTED · 1 NEW) convicted eight sentences below. Every one is corrected WHERE IT
STANDS and marked `[corrected at car 2: …]` rather than deleted, so a reader meets the
false sentence and its correction together instead of a silently tidied record. Car 2's
own arms and figures are in **§ CAR 2** at the foot.

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

⛔ **[corrected at car 2: B7 — THIS IS A MODULE-GRAPH PROOF, AND NO BYTE CLAIM IN THIS
LANE WAS EXECUTED.]** The paragraph above reads as though the derivations stood in for the
missing dist. They do not stand in for the BYTES. Measured by the fold: `vendorPdfLazy`
is **27 passed / 27 skipped** — `distExists` is false, so exactly half that file, every
dist-reading contract, skipped; and `tests/lint/sizeBaseline.test.js` contains **0**
occurrences of `dist`, so the byte ratchets' dry reads are not a substitute either. Three
things remain unmeasured in bytes at this tip: chunk membership for `livingContentRoster.js`
and its `customContentManifest.js` closure; the first-paint total against its ceiling (the
seam's own header cites 1,045,910 -> 1,095,584 against 1,047,000); and the two WORKER
bundles, which car 1a gave genuinely new static edges — `densityCreateBoundary.js` and
`livingContentLaw.js` were not in either shell's pre-car static closure, and
`generationWorkerLazy`'s exact import list went 2 -> 3. The module GRAPH proof is sound and
independently re-derived at both trees (263 -> 263); the emitted delta is not this lane's
to claim. **The chair's ruling C5 disposes of it: §917 owes no separate build because
`run-gate-917.sh` runs `npm run check` — the production build, STRICT DIST, the first-paint
ceilings and the 27 dist contracts live — so every byte claim is executed AT THE GATE.**

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
  the marker and nothing else`, ~~with the dormant branch still exercised through the leaf's closed
  test~~.
  ⛔ **[corrected at car 2: B2 — THE STRUCK CLAUSE IS FALSE, AND IT WAS FALSE WHEN WRITTEN.]**
  At car 1's tip the mint's `{}` branch was **executed by nothing**. `newSettlementLivingContentLaw()`
  had exactly two real call sites in the estate (`livingContentLawWiring.test.js:235`,
  `livingContentMaterialization.test.js:327`) and both took the LIT branch, while every DARK drive
  (`boundaryWithDarkLaw`) replaces the function WHOLESALE with `vi.doMock`. What the leaf's closed
  test exercises is `readLivingContentLawVersion(DEFAULT)` and `materializesLivingContent({})` —
  the LEAF, not the mint's ternary. **CURED at car 2e**, and the blindness is EXECUTED, not argued:
  with the dormant branch planted to write a marker, `livingContentLawWiring` stayed **19 passed**
  and the pre-cure `livingContentMaterialization` stayed **11 passed**. The revert was, until car 2e,
  a one-line act no arm had ever run.
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

⚠ **[corrected at car 2: B3 — TWO CELLS OF THE RATE ROW WERE STATED, NOT MEASURED BY THE FILE
THAT PRINTS THEM.]** At car 1's tip the RATE arm counted only `v2RosterCount` and asserted only
`moved`; it never asserted `verdict.v1`/`verdict.v2` per row and never counted `v1Roster`. So
"roster under law 1 = 0" and "wrong law = 0" on the RATE row were true (the fold measured both
independently on three seeds and on 96 pack-loaded towns) and carried by a table rather than by
an assertion. **CURED at car 2d**, and the blindness is EXECUTED: with
`readLivingContentLawVersion` planted to return the dormant default for every value, the RATE arm
as committed at `5c8d7b6d5` ran **1 passed** while the cured arm reds by name
(`rate-0-0: the lit arm is not v2: expected 1 to be 2`). The GOLDEN row's cells were asserted
from the day that arm was written; only the RATE row was carrying prose.

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

⚠ **[corrected at car 2: B6 — THE HEADLINE OVERSTATES ITS SCOPE, AND THE BODY BELOW IT DOES NOT.]**
The lit-minted world reaches **THREE** arms at car 1's tip, not "the boundaries": the gallery ingest
and the two public projections. The reconciliation drop and the account remap / `versionHistory`
hole are still driven by hand-built rosters, which the car's own text says plainly ("deliberately
NOT re-driven here"). **The reconciliation half is closed at car 2a** — a lit-product-minted world
now goes through `admitExistingCampaignImport` itself. The ACCOUNT remap and the `versionHistory`
hole remain hand-built and are deferred-and-recorded, not forgotten: they need an archive receipt,
which is a fixture that suite already owns.

⚠ **RECORDED, NOT CURED:** the DM-full projection carries the law MARKER on the config. A build
fact, not an account-scoped identifier, and the gallery INGEST drops it on the way back in.

---

## CAR 1f — THE LIT WALKERS (`5faa1c4b9`)

⚠ **[corrected at car 2: B8 — THE TITLE BUYS DOCUMENTATION, NOT COVERAGE. Read it as "the lit
walkers, and the one that is BLIND".]** The car's entire diff to `mechanismLitCoverage.test.js`
is an **18-line header comment**: zero executable change, the walker's denominator unmoved, the
green identical before and after. The body below is honest about this ("green and BLIND … and now
says so in its own header"); the CAR TITLE is not, and a title is what a later reader indexes on.
⇒ **THE GAP, NAMED AND DEFERRED-AND-RECORDED (chair, S.3):** nothing in the estate enumerates
VERSIONED GENERATION LAWS and demands a lit proof of each, the way `mechanismLitCoverage` does for
`worldPulse` mechanisms. `GENERATION_LAWS` in `densityCreateBoundary.js` is the nearest register and
it checks WIRING (who may mint), never lit coverage. A walker for that is a CAPACITY-train row, not
this lane's — recorded so it is not re-found as a new finding.

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
retirement recorded in the register's header. ~~That moves ONE frozen value and nothing else:~~

⚠ **[corrected at car 2: B4 — THE `--write` MOVES TWO VALUES, NOT ONE.]** `baselineOf()` rebuilds
the whole object and stamps `sha: headSha(root)`, so the chair's register car will move the digest
**and `frozenAtSha`** — `455ec96a4abace0ae7eb68d09e419820bacd5b5d` -> the §917 sha. Nothing else:
population, closureSizes, scanStats, the three digests, `pendingSurfaceCeiling` 3,
`reviewableDarkCount` 526 and `darkUnregistered` 1322 are identical on the plain run, at car 1's
tip and again at car 2's. The one frozen value the strike itself causes is:

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

⛔⛔ **[corrected at car 2: B5 — LITERALLY TRUE, MATERIALLY UNDERSTATED, AND THIS IS THE
SENTENCE THAT REACHES THE OWNER.]** "Alike conditional" and "one more key" both survive a
literal reading and both price the debt smaller than it is. Three measurements, none of them
this lane's opinion:
1. **THE TWO KEYS ARE NOT ALIKE CONDITIONAL.** On 96 RATE towns with the reference pack loaded:
   **roster 96/96, provenance 32/96.** The provenance receipt is written only when the generated
   town ADOPTED a definition; the roster is written whenever the environment HOLDS one. The added
   key therefore rides **three times as many** DM-shared dossiers as the key already riding.
2. **IT IS A STRICT SUPERSET, NOT A SIBLING.** `publicSafe.js:283-287` in the estate's own words:
   the roster records every reviewed living-content definition in scope, adopted or NOT, while
   provenance names which of them materialized. The exposure is the author's WHOLE UNADOPTED
   LIBRARY, not the part that landed in the town.
3. **THE ROSTER'S SERVER EXPOSURE WENT FROM UNREACHABLE TO LIVE AT CAR 1a.** Before the loader
   gained a caller, a lit config threw out of the pipeline, so no product-minted world could carry
   a roster at all. The provenance door was open; the roster was not standing at it.
**The refusal is unchanged and correct** — a migration is a deploy-shaped act on a shared surface
and remains owner-gated. What changes is the PRICE the owner is quoted. The chair's ruling C4:
land lit with the SQL twin as it is, and the §917 ledger row states this as an OWNER ROW carrying
this measurement, never as "one more key on an already-open door".

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
3. ~~**Every line this lane added to a src file is a COMMENT**, except two: the
   `loadGenerationLawPayloads` import and its `await` in `settlementGenerateAction.js`.~~
   ⛔ **[corrected at car 2: B1 — THE FIGURE IS FALSE; THE CONCLUSION IS NOT.]** Measured over
   `git diff 8961388ce..990a7860a -- src/`: **339 added src lines, of which 47 are non-comment and
   non-blank** (the dial line, the loader and its seven await sites, six `payloadAwaitedBy` rows,
   one re-export, two `self.onmessage = async`, and five lines of one `GENERATION_LAWS` `why`
   string) — not two. Re-measured at car 2 and reproduced exactly. Car 2 adds **75 src lines, 15
   of them non-comment and non-blank**; the whole lane over the §916 tip is **414 added src lines,
   62 non-comment and non-blank**. A false figure inside a true finding is the class this estate
   refuses in other people's work, which is why it is corrected rather than dropped. The E2
   conclusion stands on legs 1 and 2, both of which the fold confirmed independently, and the
   scan below re-runs clean at car 2's tip: no added `src/` string literal in either range carries
   an em dash, an exclamation mark, a `toFixed` or a float interpolation, and the E2 ratchet's
   scope is `src/data + src/domain` in any case.

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

---

# § CAR 2 — THE FOLD'S CURES (five cars over `990a7860a`; chair, SITTING §S)

Seat: Opus 5 — Fable-unvalidated · Dock `$SC/laneLIGHT`, `node_modules` symlinked, no build taken.
Charter: SITTING §S.4 — A1 (strip + arm + blast radius), A2, A3, A4, the dark-dial mint arm, B1–B8.
**Every figure below is from a command this car executed and whose output I read.**

| car | sha | what |
|---|---|---|
| 2a | `e7bf28383` | the reconciliation boundary strips the foreign birth law, on BOTH of the marker's echoes (A1, ruling C1) |
| 2c | `5c8d7b6d5` | the payload arm checks ORDER, not presence (A3, ruling C6) |
| 2d | `fa9ccc74d` | the RATE arm asserts what it prints (A4) |
| 2e | `707118f80` | the dark-dial mint arm — the dormant branch executed through the real function |
| 2b | `ef3ee6cbd` | register: the lighting census refrozen by ritual, and **A2 REFUSED with the measurement** |

The consist is **6 files: 1 `src/`, 5 `tests/`** (one of them the census register the brief permits).
Nothing under `src/domain/display/stateProse/`, `src/domain/prose/` or `src/data/dossierStateProse/`;
no other census; no leaf. Five commits, each carrying all three trailers.

## 2a — A1, AND THE MARKER HAS TWO ECHOES

`dropReconciledSettlementContentRecords` now strips `LIVING_CONTENT_LAW_CONFIG_KEY` in the
destructure shape `importScrub.js:158-166` already ships, reading the key from the leaf that
declares it. SILENTLY — no third `settlement_content_record_unmappable` issue — and unconditional
on either record, because since the lighting the ordinary reconciled import is marker-carrying and
roster-less, which is the lying shape itself.

⭐ **THE FIRST CUT STRIPPED `settlement.config` ALONE, AS THE RULING NAMES IT, AND THE ARM FAILED.**
Measured: after admission the persisted **`settlement._config` still read `_livingContentLawVersion`**,
and it was that config's ONLY underscore-prefixed key. The gallery importer needs one strip only
because `gallery.js`'s `stripImportConfidential` deletes `_config` wholesale as a regeneration
hazard; nothing deletes it here. Cleaning one echo and leaving the other tells the same lie one
level down, on the very object `SaveToLibraryButton.jsx` persists as a save's regeneration input.
**The strip runs over both echoes — an extension of C1's ground to its second echo, recorded here
for the chair to veto.**

    the arm (new, in importReconciliation.test.js)   19 passed (18 -> 19; that file carried 0 marker assertions)
    PLANT — the strip removed                        1 failed / 18 passed (19), by the arm's own name:
      "the reconciled world kept a FOREIGN account's birth-law marker. With the roster dropped two
       lines below, that is a world claiming it was born under the roster law while carrying no
       roster — permanently, because nothing downstream re-mints one."
      restored by cp · md5 8bb4df172ab347908d04de4b49cb9ec4 · cmp OK · porcelain 5 before, 5 after

    BLAST RADIUS, all four re-run     accountImportSlice                26 passed
                                      accountSettlementContentPortability 17 passed
                                      importScrub                       13 passed
                                      campaignSlice.galleryImport        6 passed
    THE PROMISE, re-run after A1      livingContentPromiseBytes  5 passed, 42.52 s — 0 movers on 1,293
                                      livingContentLawWiring    19 passed
    OSR (read only, no write)         exit 0 — 1972 finding(s), exactly matching the frozen inventory
    EAGER_FIRST_PAINT_MODULES         263 — the new leaf edge into src/lib did not enter first paint

## 2c — A3, AND THE RELOCATION PLANT (untested row U6, now executed)

`awaitPrecedesConsumer()` walks FORWARD from the await with a relative brace depth of zero over the
comment- and string-stripped code: a consumer call found while the depth is still >= 0 was reached
without the await's own block closing. Six CALL-form needles, because every awaiter names its
consumer in an import line ABOVE the await and two of the seven pass the pipeline as a VALUE. The
needle list is itself held to the tree. Four controls, all SHIPPED shapes.

    the walker, clean tree            16 passed (title count unmoved — strengthened in place)
    PLANT — the await MOVED (not deleted) below `runGeneration` in settlementGenerateAction.js:
                                      1 failed / 15 passed (16), naming BOTH rows that declare it:
      "src/store/settlementGenerateAction.js: … awaits the payload, but NOT before the generation
       call in the same function body — the await was moved below it, or into a branch the live
       path does not take"  |  "src/workers/generationRequest.js: … (same)"
      ⛔ and the file STILL CONTAINED the literal, at line 198 — the old presence arm would have
         stayed GREEN. That is U6 discharged by execution rather than by belief.
      restored by cp · md5 e92c201764474476727eac8d4af29d9a · cmp OK · porcelain 3 before, 3 after

## 2d — A4, AND THE BLINDNESS EXECUTED

The RATE arm gains `verdict.v1` / `verdict.v2` per row (768 x 2, named by seed) and `v1RosterCount`
pinned at 0. **The file goes 5 tests -> 5 tests** — no block, no describe, so the §917 test-census
prediction does not move with this car.

    clean control                     livingContentPromiseBytes 5 passed, 42.52 s
    PLANT — `readLivingContentLawVersion` made to return the dormant default for every value, then
    the RATE arm alone re-run twice against the SAME planted product:
      (1) WITH the cure               1 failed — "rate-0-0: the lit arm is not v2: expected 1 to be 2"
      (2) the PRE-CURE arm, as        1 passed — GREEN under the identical plant. The byte
          committed at 5c8d7b6d5      comparison cannot see it: `worldBytes` subtracts the marker
          (git show HEAD:…)           either way, so `moved` stays [] and `v2RosterCount` stays 0
                                      while both worlds are law 1.
      restored · leaf md5 745052ee9aa158069f9dc855ceda7e6d · cmp OK on both files · porcelain 2 -> 2

## 2e — THE DARK-DIAL MINT ARM (untested row U3, now executed)

The dial is a module-level const, so the arm varies what the LEAF hands the law module and
re-imports under `vi.resetModules`. **The mint itself is untouched** — the ternary, the key and the
returned object are the product's own — and `vi.isMockFunction` is asserted false inside the arm so
a future substitution cannot quietly restore the false green. The same real function, re-imported
with the leaf untouched, mints the marker: one function, one ternary, two answers.
⇒ **THE BRIEF'S REFUSAL CONDITION WAS NOT REACHED.** No runtime switch was added to the product; the
leaf is a seam the harness already owns, and the shipped source line was never edited.

    the arm                           12 passed (11 -> 12)
    PLANT — the dormant branch made to write an empty-but-present marker:
                                      1 failed / 11 passed (12) —
      "the mint wrote something at the dormant dial … expected { _livingContentLawVersion: 1 } to
       deeply equal {}"
    ⛔ THE BLINDNESS, EXECUTED under that same plant:
      livingContentLawWiring          19 passed — green on a corrupted dormant branch
      livingContentMaterialization    11 passed — the PRE-CURE file (git show fa9ccc74d:…), green
      restored · md5 c123bdf7a491120922084a46ce21cc7a · cmp OK on both files · porcelain 1 -> 1

## 2b — THE CENSUS REFROZEN, AND ⛔⛔ CURE A2 REFUSED WITH THE MEASUREMENT

The walker was **RED before this car** (`expected 24048 to be 24046`), which is the proof the door
had to open. Refrozen by the baseline's own ritual on a CLEAN tree at `707118f80`, then verified by
a plain re-run — **34 passed**.

    files       2557 -> 2557   ·  parked  375 -> 375  ·  credited 2182 -> 2182
    titles     24046 -> 24048  ·  suiteTitles 6422 -> 6422
    (+2 = car 2a's one test and car 2e's one test; cars 2c and 2d moved no title)

**A2 IS REFUSED.** The fold recorded `"date": "2026-09-09"` as a stale provenance numeral against a
refreeze the commit body, `measuredBy` and the receipt all place on 2026-09-08. **It is not stale.
It is UTC, and it is the ritual's own output:**

    tests/lint/sovereigntyLightingContract.walker.test.js:744
        date: new Date().toISOString().slice(0, 10),          <- toISOString is UTC

    prior refreeze commit 48c001cc8   2026-09-08 21:57:50 -0400  =  2026-09-09T01:57:50+00:00
    this machine at this car          local 2026-09-08 23:05 EDT =  utc 2026-09-09 03:05 UTC
    and THIS refreeze, run by the ritual with no hand near the field, wrote "2026-09-09" a SECOND
    time — independently reproducing the numeral the cure asked to correct.

The one-numeral hand edit would replace a value the instrument PRODUCES with one it cannot
reproduce, and the next refreeze would write 2026-09-09 back. The walker asserts only that the four
provenance strings are non-blank, so nothing turns on the value.
⇒ **What the chair may still want is a DIFFERENT act:** if the census should stamp the measuring
seat's LOCAL day, that is a one-line change to line 744 of the walker and a register car of its
own. Not taken here — the walker is an instrument and this lane holds no ruling on it. Vetoable.

## THE GATES AT CAR 2's TIP `ef3ee6cbd`

| gate | result |
|---|---|
| whole `tests/lint` (once, at the tip) | **1 failed / 2490 passed (2491)** across **148 passed / 1 failed (149)** files — the ONE failure is the refused writer-reach register digest (R1), the same two digests as at car 1's tip. ⇒ discharges the fold's untested row **U1** exactly as predicted. |
| `check-domain-strict` | **exit 0** — "no strict-type regressions (1120 errors, ceiling 1120)" |
| `check-full-typecheck` | **exit 0** — "no type regressions (173 error(s), ceiling 173)" |
| OSR `check-observed-shape-readers` (read only) | **exit 0** — "1972 finding(s), exactly matching the frozen inventory"; **no write** |
| prose-numerics re-key (dry) | **exit 0** — `baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0` |
| writer-reach plain (dry) | **exit 0** — `judged 6532 · LIT 560 · LIT-NAME 4646 · DARK 1326 (reviewable 526)`, identical to the banked population; baseline file untouched |
| lighting census walker (plain, post-refreeze) | **34 passed** |
| the cast walker `domainAnyCastBaseline` | green inside the whole `tests/lint` run |
| `eslint src/ tests/ scripts/` | **exit 0** — 0 errors, 31 warnings; **overlap with car 2's 6 touched files EMPTY** |
| added-`src/`-literal scan (em dash / bang / `toFixed` / float) | **0 hits** in `990a7860a..HEAD` and in `8961388ce..HEAD` |
| porcelain | **0** |
| vitest runners at return | **0** |

## WHAT CAR 2 MOVES IN THE §917 PREDICTIONS

* **test-census ratchet `--update`**: the fold predicted `totalFiles 2502 -> 2503`, `totalTests 32436 -> 32451`
  and warned to run it AFTER A1/A4. Both have landed. The fold's +15 split
  (`livingContentPromiseBytes` +5, `livingContentLawWiring` +7, `densityCreateBoundary.walker` +2,
  `livingContentRosterPublicDrop` +1) contains **no `importReconciliation` row** — car 1's whole
  change to that file was a three-line prose amendment — so car 2's two tests are the sixteenth and
  the seventeenth: **A1 adds one** (`importReconciliation` 18 -> 19), **A4 adds none** (assertions
  inside two existing blocks), **the dark-dial arm adds one** (`livingContentMaterialization`
  11 -> 12), and **no new test FILE**. ⇒ the prediction becomes **`totalFiles 2503`,
  `totalTests 32453`** (+1 file, +17 tests over the banked `2502` / `32436`). Counted at source and
  cross-checked against the lighting census's own independent `titles` move of +2 at car 2b.
  ⚠ An earlier draft of this line read `32452` / "+16" by folding car 2a's test into the fold's
  +15; corrected here rather than patched silently, because a stale numeral in a prediction is the
  class this receipt spent car 2b refusing.
* **writer-reach `--write`**: unchanged — digest and `frozenAtSha`, nothing else (B4).
* **lighting census**: already moved, by ritual, at car 2b. Nothing left for §917.
* **OSR · prose-numerics**: nothing, re-measured at this tip.

## ⚠ ONE OBSERVATION FOR THE CHAIR, NOT A FINDING, AND NOT CURED

`prepareSettlementEntry` strips `_seed` at the top level and `scrubImportedConfig` strips
`config._seed`, but **nothing on the reconciliation path touches `settlement._config`**, which is
why car 2a had to strip the marker's second echo by hand. On the world this car measured, that
`_config`'s only underscore-prefixed key was the law marker, so no seed rode with it. **Whether a
source export whose `_config` carries `_seed` would survive this boundary was NOT measured**, and it
is not this lane's row: it is a seed-dormancy question about a different key, on a path whose
`_config` handling differs from the gallery path's wholesale delete (`gallery.js:127`). Recorded so
it is not re-found as a new finding, and so it can be measured on purpose by whoever owns it.

## CAR 2 — THE CHAIR'S VERIFICATION AND RULINGS (Fable, 2026-09-08 23:1x)
Re-measured at `ef3ee6cbd` (13 cars over 8961388ce; porcelain 0): the reconciliation module now names the law key (CONFIRMED by grep); the lane's whole `tests/lint` 148/149 with the one refused writer-reach digest (the chair's door). Rulings: (1) A1's extension to the `settlement._config` echo — ACCEPTED as within C1's ground (a boundary that drops a record drops every echo of the marker that claims it; the arm proved the first cut insufficient); (2) A2 REFUSED by the lane on a true ground — the census date is UTC written by the ritual itself (`sovereigntyLightingContract.walker.test.js:744`), so `2026-09-09` is not stale; SITTING §S c-3 is AMENDED: the numeral stands, and whether the ritual writes local days is a one-line instrument change for a later register car, not taken; (3) the dark-dial mint arm landed through the version leaf under `vi.resetModules` with no runtime switch — ACCEPTED; (4) the observation that nothing on the reconciliation path touches `settlement._config`, so whether a source export's `_seed` survives that boundary is unmeasured — a PROMISE-adjacent row for the sitting agenda (§G) and a small arm in the next boundary car; (5) the §917 test-census prediction is `totalFiles 2503`, `totalTests` derived (+17 by the lane's count, never predicted). Seat: Fable 5.1 — validated.

# § CAR 3 — THE WORKER BUNDLE (three cars over `dd0b68c0d`; chair, SITTING §S c-5)

Dock `$SC/laneLIGHT`, base `dd0b68c0d`. Shas:

| car | sha | what |
|---|---|---|
| 3a | `3bb6853c4` | the two worker shells arm the SEAM'S loader; the walker's declared table + the aggregate arm |
| 3b | `f4433c943` | the single-chunk arm retired and replaced by the declared-lazy-edge arm + the module-worker arm |
| register | `f88d6bc54` | the lighting census refrozen by ritual, titles 24,048 → 24,049 |

## THE BUILDS — every figure from `npx vite build` in this dock

The build is byte-stable: a control rebuild of the UNTOUCHED tip reproduced the
gate's own hashes and sizes exactly (`generation.worker-1YsDAmwr.js`,
1,404,524 B), so the deltas below are the edit and not build noise.

| build | generation.worker | its lazy chunk | customContentPreview.worker |
|---|---|---|---|
| tip `dd0b68c0d` (control) | **1,404,524 B** | `livingContentRoster-D2HjP6Oc.js` 55,471 B | 1,627,972 B |
| after the shave (3a) | **1,404,493 B** (−31 B) | `livingContentRoster-CE43XTKG.js` 55,465 B | 1,627,941 B (−31 B) |
| measurement only: lazy edge REMOVED entirely | **1,404,248 B** | none emitted | — |

The preview worker **has no ceiling test** — said plainly, as the brief asked.

## ⛔⛔ THE CEILING: STOPPED, WITH THE NUMBER, AND THE RE-MINT IS THE CHAIR'S

`WORKER_BUNDLE_CEILING_BYTES = 1,404,242` (minted at `f6545dcd9`, §900).
At this tip, after the shave: **1,404,493 B — over by 251 B.** The arm is left
RED and the constant is UNTOUCHED.

⭐ AND THE THIRD BUILD IS WHY THE SHAVE COULD NEVER HAVE CLOSED IT. With the
lazy edge removed from the shell ENTIRELY — no import, no await, nothing of car
1a left — the worker still measures **1,404,248 B, six bytes ABOVE the §900
ceiling**. So the §917 tip weighs more than the §900 tip for reasons that are not
the arming at all, and no amount of transport-side shaving can reach 1,404,242.

The composition of the 282 B the gate reported, now decomposed by measurement:

* **+6 B** — other §917 work, present with no lazy edge at all.
* **+245 B** — the lazy edge as it now stands: the seam's loader, the emitted
  dynamic import, and the await. Irreducible while the roster is behind a seam,
  and removing it is not available: the seam THROWS on a v2 world whose payload
  was never loaded, and the dial is lit.
* **+31 B** — the create boundary's module, which car 3a removed.

## ⛔ THE BRIEF'S "SHARED CHUNK" PREMISE IS REFUTED BY THE BUILD

The brief expected the roster chunk to be shared with the main graph, and step 3
(b) would have asserted it. It is not shared. Vite bundles every worker entry as
its own rollup build, so this dist emits the same source module **three times**,
each referenced by exactly one bundle (measured by scanning every `.js` in
`dist/assets` for each hashed name):

| chunk | bytes | referenced by |
|---|---|---|
| `livingContentRoster-Be-TAUWP.js` | 1,788 | `engine-Dh3R46GK.js` (the main graph) |
| `livingContentRoster-CE43XTKG.js` | 55,465 | `generation.worker-BuvTfkDK.js` only |
| `livingContentRoster-C9dEfpoI.js` | 1,094 | `customContentPreview.worker-4AiUKc4T.js` only |

The sizes differ because each build carries whatever of the roster's closure its
own bundle does not already hold. So the generation worker pays a **55,465 B
second cold fetch inside the user's wait** on a lit path — a real product fact,
not a byte-accounting one, and the chair's row rather than a lane's. The arm was
written to the measurement: it pins that the chunk exists, that the worker
bundle alone names it, and that its payload is NOT ALSO inlined into the bundle
(the sentinel pair), instead of asserting a sharing that does not happen.

## THE `import(` LIST AT THE TIP

```
advanceInterval.worker-B6MKQvud.js       (none)
customContentPreview.worker-4AiUKc4T.js  import("./livingContentRoster-C9dEfpoI.js")
generation.worker-BuvTfkDK.js            import("./livingContentRoster-CE43XTKG.js")
pdfRender.worker-0X-9M_FS.js             (none)
```

## THE NEW ARM'S PLANTS — four, executed, each convicting a different way

1. **A second dynamic import in the shell, rebuilt.** `import("./customContentManifest-C68AZo4i.js")` joined the roster edge; the count arm red: *"the worker bundle carries 2 dynamic import(s); WORKER_LAZY_EDGES declares 1."*
2. **`{ type: 'module' }` dropped from `generationClient.js`.** The module-worker arm red: *"A classic worker cannot execute the import( the bundle now carries."*
3. **A second `await` in `loadGenerationLawPayloads()`.** The walker's new aggregate arm red: *"the aggregate awaits 2 payload loader(s) (loadLivingContentRoster, loadSomeSecondPayload) … A second payload here is invisible to both workers."*
4. **The worker reverted to the aggregate.** The per-row arm red on its declared literal: *"src/workers/generation.worker.js no longer contains await loadLivingContentRoster()"* — the table is a declaration, not a loophole.

Plus in-test controls: the target scanner on one edge, two edges and none; the
loose opening scanner refusing `reimport(x)`; the module-worker pattern anchored
against a classic construction; and, in the walker, both needles proved
non-interchangeable IN BOTH DIRECTIONS (the default needle must not match a
seam-armed body, and the seam needle must not match an aggregate-armed one).

## THE GATES AT CAR 3's TIP `f88d6bc54` (porcelain 0)

* **whole `tests/lint`**: **149 files / 2,492 tests, ALL GREEN.**
* **whole `tests/build`** (`VERIFY_DIST=1`, fresh build): **53 of 54 files, 471 of 472 tests green.** The single red is the ceiling arm above — the declared STOP. The retired single-chunk red is CURED.
* **`npm run lint`**: 0 errors (31 warnings, all pre-existing).
* **`typecheck:ratchet`**: OK, 173 errors against a ceiling of 173.
* **`typecheck:domain:strict`**: OK, 1,120 errors against a ceiling of 1,120.
* **OSR (`check:observed-shape-readers`)**: `1972 finding(s), exactly matching the frozen inventory` — EXACT, no `--write`.
* **first-paint static closure**: 8 chunks, **1,042,172 B** against the 1,048,000 B budget — unmoved by this car, which is entirely worker-side.

## THE REGISTER DOORS

* **lighting census**: moved BY RITUAL (`f88d6bc54`), titles 24,048 → 24,049.
  ⭐ Two `it`s were added and the census moved by ONE: car 3b's arm sits inside
  `describe.runIf(DIST_EXISTS)`, and `runIf` is a NON_FOCUSING modifier in that
  walker's closed grammar, so its titles are never live. The register's note
  records that so the arithmetic is not spent twice.
* **OSR**: read exact, not written.
* **every other `--write`**: not touched.

## PROSE CORRECTED RATHER THAN LEFT FALSE

`livingContentSeam.js` claimed the aggregate was its only caller and
`densityCreateBoundary.js` claimed the two shells called the aggregate; both are
now false and both were rewritten, with the byte reason and the walker that
holds it. `livingContentRoster.js`'s cure paragraph was corrected the same way.
