# SKEPTIC — LANE LIGHT — LENS: THE LIFECYCLE, NO MIGRATION AND THE THREE HOLES (1d · 1e · 1f)

Seat: Opus 5 — Fable-unvalidated, the verifier. Read-only on every tree.
Dock: `$SC/skepLIGHT` at `990a7860a`. Base control: `$SC/laneSEAM` at `8961388ce` (porcelain 0, untouched).
Porcelain `skepLIGHT`: **0 before · 0 after**. Vitest runners: 0 before every run, counted in its own call each time.
One mutation plant taken, on `src/domain/clone.js`, inside a single command that backed up, planted, ran, restored
and printed porcelain; `cmp` IDENTICAL, md5 `9588c7e2730b6b2c04c34513a6765cff` before and after, porcelain 0 after.
No `git checkout`, no `--write`, no build, no whole-suite run.

Every figure below is from a command executed here and whose output I read.

---

## THE HEADLINE

The receipt's central lifecycle claim holds and is not vacuous: **no read path stamps a persisted config**, and
the arm that says so really reds when a read path is made to stamp. Cars 1d/1e/1f reproduce figure-for-figure.
Two corrections and one new finding stand against the receipt, none of them HIGH:

* **NEW — MEDIUM.** The reconciliation import boundary keeps a FOREIGN world's birth-law marker while dropping
  its roster, which is the exact state the sibling archive-less importer's own header forbids. Lighting made this
  the ordinary case rather than a theoretical one. Uncovered by any arm.
* **MEDIUM.** The first-paint BYTE half of the eager-closure proof was never executed — the dist-reading contracts
  SKIP, and the byte ratchets' dry reads do not stand in for them.
* **MEDIUM (sizing, not mechanism).** "The lighting widened the server door by ONE key" is literally true but
  understates: the added key is strictly broader than the one already riding, and the roster's server exposure
  went from structurally unreachable to live.

---

## (a) THE NO-MIGRATION ARM, AND EVERY OTHER READ PATH

### The structural proof — CONFIRMED

`LIVING_CONTENT_LAW_CONFIG_KEY` has, in the whole of `src/`, exactly three uses outside its declaring leaf:

| site | act |
|---|---|
| `src/domain/content/livingContentLaw.js:209` | the **only** write — inside `newSettlementLivingContentLaw()` |
| `src/domain/density/densityCreateBoundary.js:269` | the clamp's destructure in `birthConfig` |
| `src/lib/importScrub.js:163` | the gallery-ingest strip |

`newSettlementLivingContentLaw` has exactly two callers, both classified BIRTH:
`src/store/settlementGenerateAction.js:135` and `src/lib/instantWorld/composeInstantWorld.js:138`, both through
`birthConfig`. There is therefore **no read-path writer to find**: a stamp is not merely absent, it has nowhere
to live. `src/lib/importReconciliationAdmission.js` contains **0** occurrences of the key (measured with `grep -c`).

### The arm is not vacuous — CONFIRMED BY PLANT

`tests/domain/livingContentLawWiring.test.js` at the tip: **19 passed**.

Plant: `deepClone` in `src/domain/clone.js` made to stamp `_livingContentLawVersion: 2` onto any cloned object
carrying a `config` — a clone-path stamp, the read-path act property 3 forbids. Result:

```
Tests  2 failed | 17 passed (19)
AssertionError: cloned: a world born under law 1 acquired a law marker on a lit build …
```

Both the `UNDO/CLONE` arm and the `NO MIGRATION` arm convicted. Restored; `cmp` IDENTICAL; porcelain 0.

### Every other read path, driven — CONFIRMED

| suite | result | path |
|---|---|---|
| `tests/store/accountImportSlice.test.js` | **26 passed** | account import, live entry + every `versionHistory[i].settlement` |
| `tests/lib/importScrub.test.js` | **13 passed** | gallery ingest |
| `tests/store/campaignSlice.galleryImport.test.js` | **6 passed** | the second gallery path |
| `tests/lib/importReconciliation.test.js` | **18 passed** | reconciliation |
| `tests/lib/accountSettlementContentPortability.test.js` | **17 passed** | the portability layer |
| `tests/security/livingContentRosterPublicDrop.test.js` | **7 passed** | both public projections |

Read at source: `accountImportBody.js:467-534` remaps-or-drops the roster on the live settlement **and** on every
snapshot in `versionHistory`, and touches no config key. `regenSection` never reaches the seam at all — the
roster's one call site is `generateSettlementPipeline.js:185`, and `regenNPCsPipeline` / `regenHistoryPipeline`
are separate exports that do not call it.

**Verdict: CONFIRMED. No stamp anywhere. Severity NONE.**

### ⚠ ONE HONEST WEAKNESS IN THE ARM'S OWN SHAPE (not a defect, recorded)

The arm's "LOAD" hop is `JSON.parse(JSON.stringify(born))` — a test-local round trip, not a production loader. Its
two live hops are `regenSection` and `deepClone`. The plant shows `deepClone` is guarded; `regenSection`
structurally cannot write `config` (the file's own DEF-8 note says so), so that hop's config assertion is a guard
against a future change rather than a live measurement. Both facts are stated in the test; neither is overclaimed
in the receipt.

---

## (b) THE THREE HOLES AT DIAL 2, AND THE CLAMP IN BOTH DIRECTIONS

### The re-run — CONFIRMED, every figure reproduces

All six suites in the receipt's 1e table reproduce exactly (table above; `livingContentLawWiring` 19).

### ⭐ NEW FINDING — MEDIUM: the reconciliation boundary admits a foreign birth law

`dropReconciledSettlementContentRecords` (`importReconciliationAdmission.js:475-499`) deletes exactly
`customContentProvenance` and `customContentRoster` from `entry.settlement`. It never touches `settlement.config`,
and the module names the law key **zero** times.

The estate's own rule for this is written in the sibling archive-less importer, `importScrub.js:115-121`:

> an ingest that kept the marker would import a world that says it was born under the roster law while carrying no
> roster — a world that lies about its own scope, permanently, because nothing downstream re-mints a roster.

and the reconciliation module's own header cites that very file as stating "the same rule … for the other
archive-less importer" (`importReconciliationAdmission.js:445-446`). Both boundaries are archive-less, both take a
FOREIGN account's world; one strips the marker, the other does not.

**Lighting is what makes this bite.** Before the flip no product-minted world carried a marker at all, so a
reconciled import could only arrive marked from a hand-lit build. After the flip every world the product mints
carries `_livingContentLawVersion: 2`, so **every reconciled foreign import now lands a marker-carrying,
roster-less world** — precisely the "lies about its own scope" state.

Not covered: `tests/lib/importReconciliation.test.js` carries no assertion on the marker (`grep`), and the lane's
entire change to that file is a three-line prose amendment. Nothing reds if this is left as it is.

Not a leak, not a byte-mover on a generated world, not generation-down — hence MEDIUM, not HIGH. The cure is one
destructure in `dropReconciledSettlementContentRecords`, or a written ruling that a reconciled world keeps its
foreign birth law and importScrub's paragraph is wrong about the general case.

### The clamp, both directions — PARTLY (true with the receipt's own correction)

Executed (`livingContentLawWiring` 19 passed), and the shape read at source:

* **At the LIT shipped dial the destructure is inert.** `birthConfig` spreads the mint LAST
  (`densityCreateBoundary.js:272-276`), so an incoming marker of `1` or an unshipped `3` loses to `2` whether or
  not it was destructured off. The arm at `:359` drives both and passes.
* **At the DORMANT dial the destructure is the whole mechanism** — the mint returns `{}` and a spread of `{}`
  deletes nothing. Driven at `:299` through `boundaryWithDarkLaw()`, with a positive control that the hydrated
  config really does mint a roster unclamped, and through the real pipeline.
* **The direction the destructure does not cover: none.** What it does not do at the lit dial is *anything*; the
  lit-direction guarantee comes from spread ORDER, not from the clamp. The receipt says exactly this. Severity NONE.

### The lit-product-minted world — PARTLY on the receipt's ⭐ claim

The receipt's headline for 1e is "the arm none of them had … a world minted by the LIT PRODUCT … carried into the
boundaries". Read at `livingContentLawWiring.test.js:699-767`, the lit-minted world reaches **the gallery ingest
and the two public projections only** — three arms. The reconciliation drop and the account remap /
versionHistory hole are still driven by hand-built rosters. The receipt's own body says so ("deliberately NOT
re-driven here"), so this is an overstated headline rather than a false claim. Severity LOW.

---

## (c) THE SECURITY DROP ARM, LIT

`tests/security/livingContentRosterPublicDrop.test.js` — **7 passed**.

* **Default (fail-closed) projection:** drops the roster and the provenance receipt, on a world that provably
  carries both first (the anti-vacuity half runs before every drop assertion).
* **DM-full projection, client:** `publicSafe.js:308-309` deletes both records explicitly; the arm asserts both
  gone and that `full` mode is still full.
* **`config._livingContentLawVersion` deliberately rides both projections** (arm R-D), argued as the same class of
  fact as `schemaVersion` / `generatorVersion`. Ruled behaviour, recorded, not a defect.
* **Server twin still open, and it is real.** Verified independently of the test: only migrations 030, 031, 099,
  121 and 129 define `public._gallery_dm_full_json`, so **129 is genuinely net-current**. Its delete chain is
  `- 'aiData' - 'aiDailyLife' - 'aiSettlement' - 'dossierNotes' - 'dmNotes' - 'notes' - 'narrativeNotes' -
  '_seed' - '_regenSeed' - '_config'` plus `config`'s own `_seed` and `latentPantheon`. Neither record is on it.
  And the stored row is the RAW settlement: `publishSettlement` (`gallery.js:57`) calls an RPC that flips a flag,
  and `gallery.js:803` re-projects `row.data` through `toPublicSafe` **client-side as defence in depth** — so the
  server's payload for a `gallery_share_dm` dossier carries both records over the wire.

**Verdict: CONFIRMED as ruled.** The client half is landed; the server half is an owner-gated migration the lane
refused with a measurement, and the tripwire arm's red is the cure arriving.

### ⚠ CORRECTION — MEDIUM: "widened by ONE key" understates the debt

The receipt and the test header both say the lighting "did not open this door, it widened it by one key",
`customContentProvenance` having ridden it already. Literally true. Two things it leaves out, both from the
estate's own source:

1. **The added key is strictly broader than the one already there.** `publicSafe.js:283-287`: the roster records
   every reviewed living-content definition in scope "adopted or NOT", while provenance "names which of them
   materialized". The roster is a superset — the author's whole unadopted library versus the part that landed.
2. **The roster's server exposure went from unreachable to live.** Before car 1a, `loadLivingContentRoster` had no
   caller, so a lit config threw out of the pipeline; no product-minted world could carry a roster at all. The
   provenance door was open; the roster was not standing at it. Sizing the remaining debt as "one more key on an
   already-open door" reads smaller than it is.

Neither changes the refusal (a migration is owner-gated and correctly declined); both change how the open row
should be priced when the owner reads it.

---

## (d) mechanismLitCoverage IS BLIND, AND WHAT WOULD HAVE CAUGHT THIS

`tests/property/mechanismLitCoverage.test.js` — **12 passed**. **The car's entire diff to that file is an
18-line header comment.** Zero executable change; the walker's denominator is unmoved. The receipt says this
plainly ("green and BLIND … and now says so in its own header"), so the claim is CONFIRMED — but car 1f's title,
"the lit walkers", buys documentation, not coverage.

**What walker, if any, would have caught a lit-only mechanic regression?**

* **None existed** while the law shipped. The walker's two axes are flat modules under `src/domain/worldPulse` and
  `<x>Enabled` simulation-rules flags; a versioned generation law is neither, and its lit path is decided by the
  WORLD'S persisted config rather than a rules bag. It was green through the whole period in which lighting would
  have taken generation down.
* **Today the nearest thing is `tests/lint/densityCreateBoundary.walker.test.js`** — 16 passed, two arms new in
  car 1a. It is a **source-text** walker, and its limit matters: the payload arm asserts only that the literal
  `await loadGenerationLawPayloads(` appears **somewhere in the file** of each named awaiter. It does not check
  that the await precedes the pipeline call, nor that it sits on the live branch. A regression that moved an await
  below `runGeneration`, or into a branch that is skipped, would keep this walker green. (I read all seven
  awaiters; every one is currently correct — `settlementGenerateAction.js:158` before `runGeneration`,
  `generation.worker.js:54` and `customContentPreview.worker.js:27` first inside their `try`,
  `instantWorldBody.js:151` before `composeInstantWorld`, `WorldPage.jsx:49` before it,
  `ConstructionPanel.jsx:86` before both branches, `campaignContentBindingSession.js:89` before the forge.)
* **The executed proofs** are `livingContentLawWiring` and `livingContentPromiseBytes`; the latter really does
  drive the production loader (`await loadGenerationLawPayloads()` at module scope, line 65), as do nine other
  test files. So the loader's async path is executed somewhere, not only walked.
* **The gap that remains:** nothing enumerates VERSIONED GENERATION LAWS and demands a lit proof of each, the way
  mechanismLitCoverage does for worldPulse mechanisms. `GENERATION_LAWS` in `densityCreateBoundary.js` is the
  nearest register, and it checks WIRING (who may mint), never lit coverage. Severity LOW — named, not cured.

---

## (e) THE EAGER-CLOSURE PROOF, AND WHAT A BUILD WOULD STILL OWE

### The derivation — CONFIRMED, both numbers reproduced independently

| tree | `EAGER_FIRST_PAINT_MODULES` |
|---|---|
| base `8961388ce` (`laneSEAM`, porcelain 0) | **263** |
| lane tip `990a7860a` (`skepLIGHT`) | **263** |

`densityCreateBoundary.js`, `livingContentSeam.js`, `livingContentLaw.js`, `livingContentRoster.js`,
`livingContentLawVersion.js` and all seven awaiters are absent from the eager set in **both** states (each
substring probed, all "absent").

The receipt's inference about the excision list checks out: `ENGINE_SHARED_DOMAIN_EXCISIONS` has 18 entries,
`livingContentRoster.js` is not among them (the seam and the version leaf are), and `computeEagerModuleGraph()`
really does seed from `[...ENGINE_SHARED_DOMAIN]` **after** the excisions are applied (`vite.config.js:223`
deletes, `:290` seeds, `:300` computes). So the roster's absence from the eager set is also proof it never
entered `ENGINE_SHARED_DOMAIN`. Sound.

### ⚠ WHAT WAS NOT PROVED, AND THE DRY RATCHETS DO NOT COVER IT — MEDIUM

`tests/build/vendorPdfLazy.test.js` — **27 passed / 27 skipped**. `distExists` is false (`ls dist` → no such
directory), so **every dist-reading contract skipped**: exactly half the file. `tests/lint/sizeBaseline.test.js`
contains **no `dist` read at all**. So the byte ratchets' dry reads are not a stand-in for the byte half; the
first-paint byte budget the seam's own header cites (1,045,910 → 1,095,584 against a 1,047,000 ceiling) was not
executed anywhere in this lane.

A build would still need to prove three things:

1. **Chunk membership** — that `livingContentRoster.js` and its `customContentManifest.js` closure land in a lazy
   chunk and not in eager `engine-core`. The source derivation proves the module GRAPH; it does not prove Rollup's
   chunk assignment.
2. **First-paint byte total** against its ceiling, and the `engine` chunk against its own.
3. **The two worker bundles**, which car 1a gave a genuinely new static edge. Measured here: walking
   `src/workers/generationRequest.js`'s pre-car static closure, `livingContentSeam.js`, `livingContentLawVersion.js`
   and `densityLaw.js` were already reached, but `densityCreateBoundary.js` and `livingContentLaw.js` were **not**.
   Both worker shells now import the boundary statically (`generationWorkerLazy`'s exact list went 2 → 3), so those
   two modules are new to both worker bundles. Their emitted size is unmeasured; `generationWorkerLazy` is a
   source-text import-list arm, not a byte arm. The delta is almost certainly small (both files are
   comment-heavy and code-light), but "almost certainly" is the word the receipt is entitled to and no more.

The receipt flags the missing dist honestly and did not run a build (the fence). The correction is only to the
weight: the two vite derivations plus the excision read are a MODULE-GRAPH proof, and no byte claim in this lane
was executed.

---

## FIGURES EXECUTED HERE

```
livingContentLawWiring              19 passed
livingContentRosterPublicDrop        7 passed
mechanismLitCoverage                12 passed
densityCreateBoundary.walker        16 passed
importReconciliation                18 passed
accountImportSlice                  26 passed
importScrub                         13 passed
campaignSlice.galleryImport          6 passed
accountSettlementContentPortability 17 passed
vendorPdfLazy                       27 passed / 27 skipped
writerReach.walker                   1 failed / 55 passed (56) — the register-digest arm only
check-writer-reach.mjs (dry)        exit 0 · judged 6532 · LIT 560 · LIT-NAME 4646 · DARK 1326 (reviewable 526)
                                    — identical to scripts/.writer-reach-baseline.json; baseline untouched
EAGER_FIRST_PAINT_MODULES           263 (base 8961388ce) -> 263 (tip 990a7860a)
PLANT (clone.js stamp)              2 failed / 17 passed — the no-migration arm convicts; restored, md5 match
porcelain skepLIGHT                 0 before, 0 after   ·  laneSEAM 0 before, 0 after
```
