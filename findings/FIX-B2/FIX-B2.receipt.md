# FIX-B2 — RECEIPT: the twelve engine members with a consumer in another chunk, cut by placement

**Lane:** FIX-B2 (Opus BUILD). **Chair:** Fable 5.1, session a9df403c. **Branch:**
`fix-engine-anchors-2026-09-20`, cut at `c33446830`. **Worktree:** `$SP/lane-fix-b2`.
Pre-edit measurements: `FIX-B2.evidence.md`. Batch plan: `FIX-B2.lane-resume.md`.

Every figure below is **CONFIRMED by execution** unless labelled PLAUSIBLE.

---

## THE HEADLINE

| | before (`ec0a30da2` dist) | after commit 1 | after commit 2 | after commit 3 |
|---|---|---|---|---|
| chunks statically importing the engine | **38** | **18** | **17** | **5** |
| engine chunk bytes | **677,935** | 674,095 | 644,273 | **643,221** (−34,714) |
| first-paint closure files | 8 | 8 | 8 | **8** |
| first-paint raw bytes | 1,039,267 | 1,039,310 | 1,039,414 | **1,039,443** (+176, budget 1,048,000) |
| `generation.worker` bytes | 1,401,208 | 1,401,208 | 1,401,208 | **1,401,208** |
| effective engine headroom | 365 B | 4,205 B | 34,027 B | **35,079 B** |
| `EAGER_FIRST_PAINT_MODULES` | 268 | 268 | 268 | **268** |

**Commits:** `5cc0e6c14` · `2fa685264` · `fd4be7c07` (branch `fix-engine-anchors-2026-09-20`).
**Nothing joined the importer set at any step.** The 679,000 ceiling is untouched.

---

## COMMIT 1 — the LOW leaves (TOOL-12 moves 4, 5, 6, 10) + two refuted comments

**Files:** `vite.config.js`, `tests/build/vendorPdfLazy.test.js`,
`tests/build/livingContentSeamLazy.test.js`. **Zero `src/` bytes.**
**Build:** `✓ built in 19.76s`, `BUILD1_EXIT=0`, mutex acquired after 0 atomic / 0 legacy /
0 shared-drain polls (the chair's landing build had already released).

### The placements
| module | → chunk | emitted |
|---|---|---|
| `domain/content/livingContentSeam.js` + `domain/content/livingContentLawVersion.js` | `living-content-seam` (NEW) | **1,118 B** |
| `lib/narrativeMutations.js` | `narrative-mutations` (NEW) | **724 B** |
| `generators/stressPriority.js` | `stress-priority` (NEW) | **341 B** |
| `domain/customCategories.js` | **joins `engine-core-lazy`** (no new chunk) | 23,846 → **25,341 B** (+1,495) |

Emitted `.js` assets 545 → **548** (+3, exactly the three new chunks).

### THE IMPORTER SET: 38 → 18. Nothing joined. All eight named anchors left.
```
⛔ JOINED THE SET (0): NONE  ✓
⭐ THE NAMED ANCHORS THIS COMMIT TARGETED:
   ✓ LEFT  livingContentLaw          ✓ LEFT  factionRename
   ✓ LEFT  livingContentRoster       ✓ LEFT  generalDeskRead
   ✓ LEFT  densityCreateBoundary     ✓ LEFT  CompendiumPanel
   ✓ LEFT  importScrub
   ✓ LEFT  StructuredCampaignReconciliation
```
**The 20 that left:** CompendiumPanel, EconomicsTab, HistoryTab, OverviewTab, PlotHooksTab,
RelationshipsTab, StructuredCampaignReconciliation, ViabilityTab, accountImport,
accountImportBody, densityCreateBoundary, factionRename, galleryImportMap,
galleryImportSettlement, generalDeskRead, generateSettlementPDF, importScrub, livingContentLaw,
livingContentRoster, settlementPendingEdits.

⭐ **The 173-byte chunk is off the engine.** `livingContentLaw` (173 B) was dragging 677,935 B —
a 3,918× ratio, TOOL-12 item 4's sharpest instance. It now imports `living-content-seam` (1,118 B).

⭐ **THE SEAMCYCLE COUNT WAS FIVE, NOT FOUR, AND ALL FIVE LEFT.** `vite.config.js:214-217` claimed
`livingContentLawVersion.js` had "one emitted importer". Measured: SIX static importers, five
outside the engine chunk, in five emitted chunks — TOOL-12 §3a named four and omitted
`livingContentRoster` (1,788 B). The corrected comment carries the measured five; the dist
confirms all five departed.

### First-paint closure — 8 files, moved modules ABSENT, all three budgets green
```
CLOSURE_FILES 8
CLOSURE_RAW    1039310 / 1048000  margin 8690
CLOSURE_GZIP    330539 /  337000  margin 6461
CLOSURE_BROTLI  277569 /  283000  margin 5431
```
The 8: content-identity, data, engine-core, index, kernel, vendor-icons, vendor-react,
vendor-state. **None of the four moved homes is in it.**

⚠ **HONEST DELTA: the closure grew +43 B raw** (1,039,267 → 1,039,310), all of it in the entry
chunk (568,871 → 568,914). That is the `__vitePreload` map paying ~14 B per newly minted chunk
home — TOOL-12 §4 priced it in advance at ~37 B per home against an 8,733 B margin. Gzip +45,
Brotli +113. It is a real cost, it is within margin by 8,690 B, and it is the reason
`customCategories` JOINED `engine-core-lazy` rather than minting a fifth home.

### Engine chunk and the ceiling
```
ENGINE_SIZE 674095   (was 677,935 — −3,840 B)
vendorPdfLazy: >300000 true; <679000 true; slack-to-strict 4904
engineChunkLazy band: >200000 true; <1400000 true
EFFECTIVE_HEADROOM (679000 - 674095 - 700 cross-env) = 4205
```
**The ceiling is untouched at 679,000** (§934.68 is the owner's question). Effective headroom
365 B → **4,205 B**, an 11.5× improvement, by placement alone.

### Worker — byte-identical, as predicted by construction
```
WORKER generation.worker-ChvrnTyn.js count=1
WORKER_SIZE 1401208 / 1401208  slack 0
```
⭐ Same content hash (`-ChvrnTyn`) before and after: `worker.rollupOptions` is unset, so
`manualChunks` never runs for worker builds. Predicted, then measured.

### Source-level facts re-asserted after the edit
- Shipped `manualChunks` executed: all four rules fire; `stepMetadata` still `pipeline-metadata`
  (rule order intact); `narrativeData.js` still `engine` (comment-only).
- `manualChunks=='engine'` 111 → **110**; unruled orphans 1997 → **1993**.
- `EAGER_FIRST_PAINT_MODULES` **268 → 268** — pins change no ESD membership.
- `living-content-seam`'s only outward edge is `vendor-state` (the `__vitePreload` helper's pinned
  home, eager) — lazy→eager, the safe direction. `narrative-mutations` and `stress-priority` have
  **zero** outward edges and can drag nothing.

### The two comment corrections in this commit
1. **`vite.config.js:214-217` (SEAMCYCLE)** — the "one emitted importer" claim replaced with the
   measured five importers and their chunk sizes, and both excision rows amended from
   "deliberately UNPINNED" to pinned. The excisions themselves stand.
2. **`vite.config.js:866-869` (narrativeData, the chair's addendum 83 / TOOL-12 item 2)** — the
   "still calls into the engine's PRNG/helpers at runtime" rationale is refuted by the file it
   governs. CONFIRMED: `src/data/narrativeData.js` has **0 static imports, 0 re-exports, 0 dynamic
   imports**, 40,003 source bytes, and its header records the two rng-capturing tables moved to
   `generators/narrativeText.js`. **The rule STAYS** — the chair refused the move as a ledger move
   (all consumers in-engine ⇒ the generation fetch is byte-identical). The corrected comment also
   records why deleting the rule is worse: `narrativeData.js` would fall through to `data-lazy`,
   which **106 emitted chunks** statically import.
3. `tests/build/livingContentSeamLazy.test.js` — one stale placement sentence ("rides the lazy
   engine chunk with its one importer") amended; the arm itself (`eager.has(SEAM) === false`) is
   untouched and still true.
4. `tests/build/vendorPdfLazy.test.js` — the byte-vs-character question settled. **It already
   measures BYTES** (`statSync().size`), so no fix was owed; a comment now records why that
   matters: this build measures **674,095 bytes vs 673,988 characters**, a **107 B** gap that a
   decoded-string `.length` would read optimistic against a four-figure margin.

### Pins moved in this commit
**NONE.** No ceiling, budget, baseline or member-set pin was edited. Every existing pin either
improves (the engine band, both arms) or holds (`engine-core-lazy` `toHaveLength(1)` and its
`>5_000`/`<50_000` band — 25,341 B is inside).

### Commit 1 gate results
```
VERIFY_DIST=1 ... Test Files  59 passed (59) | Tests  538 passed (538)   exit 0
control, no switch  ... Tests  475 passed | 63 skipped (538)
```
⭐ **63 dist-gated arms EXECUTED.** The brief's rule is that a `skipIf(!requireDistRead)` arm
that skipped is not a pass; the control run is the executed proof that these did not skip.
`npx eslint` (bare) on all three files: exit 0. **Commit: `5cc0e6c14`.**

---

## COMMIT 2 — the MED pair (TOOL-12 moves 2, 3) + the second refuted claim

**Files:** `vite.config.js` only. **Build:** `✓ built in 18.11s`, exit 0.

| module | → chunk | emitted |
|---|---|---|
| `generators/computeActiveChains.js` + `chainMagicSubstitution.js` + `lib/prebuiltResourceChains.js` | `resource-chains` (NEW) | **19,895 B** |
| `generators/helpers.js` + `generators/priorityHelpers.js` (a CYCLE) | `generator-helpers` (NEW) | **10,544 B** |

- **Importer set 18 → 17**, `DailyLifeTab` left, **nothing joined**.
- **Engine 674,095 → 644,273 B (−29,822).**
- Closure still **8 files**, raw 1,039,414 (margin 8,586). Worker unchanged.
- `manualChunks=='engine'` 110 → 106; unruled 1,993 → 1,992; EAGER 268.

**The cycle, counted before and after as the brief asked.** `helpers.js` and
`priorityHelpers.js` import each other, so they are indivisible. Before: **25** in-engine
importers of `helpers.js` + **2** of `priorityHelpers.js` = **27 edges**. After: **24 + 1 = 25**
edges cross as `engine → generator-helpers`; the two that vanished are the pair's own
cross-edges, now internal to the chunk. The brief's "25 re-point" is the after-figure, confirmed.

**Both closures edge-free on the EMITTED graph** (not just the source model):
`resource-chains → data-lazy, data, custom-registry, content-identity, engine-core`;
`generator-helpers → kernel, engine-core`. Neither reaches back into `engine`.

**The chair's addendum 84 ruling 1** landed here, beside the rule move 3 touches:
`vite.config.js`'s stressTypes note claimed "helpers.js (engine-core) re-exports
STRESS_INSTITUTION_EFFECTS from it, so an 'engine' assignment would make engine-core →
engine". Every load-bearing clause is false: `helpers.js` rules into **`engine`** (no
`src/domain/helpers.js` exists), it has **no stressTypes edge at all** (three static deps:
`data/constants.js`, `kernel/rngContext.js`, `priorityHelpers.js`), and stressTypes' seven
real importers are three `src/domain/**` + four `src/generators/**`. **The rule is not
re-litigated** — stressTypes still falls through to `data`.

### Commit 2 gate results
```
VERIFY_DIST=1 ... Test Files  59 passed (59) | Tests  538 passed (538)   exit 0
```
`npx eslint` (bare) `vite.config.js`: exit 0. **Commit: `2fa685264`.**

---

## COMMIT 3 — the last two leaves + the owed build tests

**Files:** `vite.config.js`, `tests/build/engineChunkLazy.test.js`,
`tests/build/vendorPdfLazy.test.js`. **Build:** `✓ built in 19.14s`, exit 0.

| module | → chunk | emitted |
|---|---|---|
| `generators/terrainHelpers.js` | `terrain-helpers` (NEW) | **620 B** |
| `domain/magicFilter.js` | **joins `engine-core-lazy`** | 25,341 → **25,890 B** |

- **Importer set 17 → 5**, **nothing joined**.
- **Engine 644,273 → 643,221 B.** Closure **8 files**, raw 1,039,443 (margin 8,557).
- Worker **1,401,208**, slack 0, unchanged at every step.
- `manualChunks=='engine'` 106 → 105; unruled 1,992 → 1,991; EAGER **268**.

⭐ **terrainHelpers is the smallest module and held the most chunks** — 49 outside modules
reach it — which is why the worldPulse/realmManifest family survived commits 1 and 2 and
falls here. My pre-build source model predicted exactly this ordering.

### THE FIVE THAT REMAIN, each accounted for
| chunk | why |
|---|---|
| `SettlementsPanel` (262,712 B) | `structuralValidator.js` — the chair's **REFUSED** HIGH move (six-module closure) |
| `composeInstantWorld`, `generationRequest`, `instantWorldBody` | `generateSettlementPipeline.js` — the engine's **own legitimate door**, not a defect |
| `generateWorldBook` (15,087 B) | ⛔ a **Rollup grouping artifact** — see below |

⛔ **`generateWorldBook` is not curable by this wave's method, and the honest report says so.**
Its named module's own static closure is 90 modules and reaches **zero** engine members
(measured), yet the emitted chunk statically imports both the engine and `SettlementsPanel`.
An emitted chunk's NAME is one representative module, never its membership. This is a real
caveat on TOOL-12 item 5's proposed importer-count ratchet: such a count would ratchet
Rollup's grouping as much as the estate's own edges.

### The owed build tests (the chair's addendum 84, ruling 2)
New **titles in existing homes, no new file**, so no walker governing `tests/build` is newly
opted into (the 2026-09-20 CREATE/RENAME addendum does not fire).

| home | added | why that home |
|---|---|---|
| `tests/build/engineChunkLazy.test.js` | +4 titles, +1 suite | it **executes** the shipped `manualChunks` and reads dist; it is the engine chunk's own contract file |
| `tests/build/vendorPdfLazy.test.js` | +1 title | `entryStaticClosure()` lives there and nowhere else |

Arms: a 12-row pin table; anti-vacuity (every module exists, and `npcGenerator` must still
route to `engine` as a live control); placement; emitted-exactly-once; no-modulepreload; and
absent-from-entry-closure with its own non-vacuity pair.

⭐ **RED-FIRST PROOF, executed:** against the real config the placement arm finds **0**
misplaced; against a planted mutant with the `stress-priority` rule deleted it finds **1** and
names it — `src/generators/stressPriority.js expected stress-priority, got engine`.

### Commit 3 gate results
```
VERIFY_DIST=1 ... Test Files  59 passed (59) | Tests  543 passed (543)   exit 0
```
**538 → 543 is exactly the five titles added**, which is the executed proof they ran.
`npx eslint` (bare) on all three files: exit 0. **Commit: `fd4be7c07`.**

---

## THE TWO REFUSALS, RESTATED (the chair's, recorded and vetoable)

1. **Move 1 — `src/data/narrativeData.js` to its own chunk: REFUSED.** Every consumer is
   in-engine, so the generation fetch would be byte-identical and only the measured ledger would
   shrink. A ledger move is not a cure. The rule stays; only its false rationale was corrected.
   Its real, smaller benefit is cache granularity (35,858 B of authored prose re-hashing on every
   generator edit) — recorded as that, and explicitly **not** as "the user downloads less".
2. **Move 7 — `lib/prebuiltResourceChains.js` alone: REFUSED** (ledger-only; zero outside
   consumers, confirmed at my tip). It rode commit 2 only inside move 2's closure, and the rule
   comment says so.
3. **The `structuralValidator` closure: REFUSED** (HIGH; six modules, a seventh of the chunk).
   It is one of the residual anchors by design, and `SettlementsPanel` (262,712 B) is the cost.

## WHAT THIS BOUGHT, IN PRODUCT TERMS

Before, 38 emitted chunks — `CompendiumPanel` (153,849 B), `GenerateWizard`, `RealmInspector`,
every dossier tab, a 173-byte version-constant chunk — had to download **677,935 B of
generators** to read a formatter, a category list, a version constant or a terrain helper.
After, **5 do**, and four of those five are the engine's own door or the one refused move. The
ledger win (−34,714 B, headroom 365 B → 35,079 B) is real but secondary; it is a side effect
measured, not the goal reported.

## ⛔ NOTICED AND NOT TOUCHED (new — TOOL-12's items 1-12 are already slotted by the chair)

1. **⛔ `negativeAssertionAnchor.walker.test.js` scans RAW LINES WITH NO COMMENT STRIPPING.**
   Its `scanUnanchoredNegatives` reads `readFileSync(...).split('\n')` and matches per line, with
   no comment strip anywhere in the function — so a file that merely NAMES the three matchers in
   prose convicts itself against a frozen, EXACT per-file count. This bit me: a draft comment in
   `engineChunkLazy.test.js` explaining why I used a filter moved that file's count 7 → 9 without
   adding one assertion. The walker's header documents the two-line marker rule in detail but says
   nothing about this. **Slot:** one line in that walker's header, beside the marker rule.
2. **⛔ `generateWorldBook` shows an importer-count ratchet would measure Rollup, not the estate.**
   TOOL-12 item 5 slots a shrink-only ratchet on the engine's static-importer count, sized at 38.
   The figure is now **5** — but one of those five is a chunk whose named module's 90-module
   closure reaches **no** engine member, so it cannot be cured by moving any member. A count pinned
   here would red on a Rollup grouping change that no estate edge caused. **Slot:** if the chair
   still wants the ratchet, size it at 5 and write the caveat into it; the per-module placement
   pins this lane added are the part that actually names a culprit.
3. **⛔ `src/store/aiSlice.js` (EAGER) dynamic-imports `lib/narrativeMutations.js`**, which before
   this lane lived in the engine chunk — so the AI path fetched 677,935 B of generators at action
   time to reach a ~4 kB mutation helper. Cured here as a side effect of move 6. Worth a line
   because it is the same class as the anchors but on a DYNAMIC edge, which neither the importer-set
   scan nor the first-paint closure would ever have surfaced. **Slot:** whoever audits the AI path's
   fetch cost next.
4. **⛔ `vite.config.js`'s data-tables comment block contained TWO false claims about the tree**
   (narrativeData's PRNG rationale, and the stressTypes/helpers mechanism), both corrected here at
   the chair's direction. Neither was load-bearing for the rule it justified, which is why both
   survived so long. **Slot:** no action owed; recorded as a pattern — a rule whose stated reason
   nobody can execute is a rule nobody re-checks.
5. **⛔ The `stressTypes.js` placement was NOT re-litigated.** Its rule still routes it to `data`,
   and the mechanism that justified that is now known to be false. Whether `data` is still the right
   home is an open, unpriced question. **Slot:** one measurement in whichever packet next prices the
   eager/lazy data split.

---

## BATCH 4 — the standing instruments (the LAST batch)

```
tests/lint  WHOLE   Test Files  174 passed (174) | Tests  2791 passed (2791)  exit 0  (324.55s)
tests/copy/voiceMechanics.test.js   Test Files  1 passed (1) | Tests  30 passed (30)  exit 0
npx eslint (BARE) vite.config.js tests/build/{engineChunkLazy,vendorPdfLazy,livingContentSeamLazy}.test.js  exit 0
```
174 files on disk, 174 ran — the directory was swept whole, and that sweep INCLUDES
`negativeAssertionAnchor.walker.test.js` and `mutationCoverageManifest.test.js`, both green.

### ⭐ THE LIGHTING CENSUS: MEASURED, AND MY DELTA IS ZERO

The walker ran inside that sweep and **passed**, which means it evaluated all five figures in
order and matched every one. It asserts against `tests/lint/.lighting-census-baseline.json`,
which this lane never touched (`git diff c33446830..HEAD -- tests/lint/` is EMPTY; the file's
last commit is the base `c33446830`, the chair's fifth refreeze):

```
measuredAtSha  f4c395e2d7d70fdab300f32ba1cdb78f77c7a21c   measuredBy chair-fable-a9df403c
files 2656 · parked 383 · credited 2273 · titles 25074 · suiteTitles 6684
```

**MY DELTA: 0 · 0 · 0 · 0 · 0.** The tuple stands at `2656·383·2273·25074·6684`. **No refreeze
was run and none is owed.**

⚠ **This was PREDICTED and then MEASURED, in that order, and the prediction is worth recording
because it is what made the owed tests cheap.** Commit 3 adds 5 test titles and 1 suite title,
which would normally move `titles` and `suiteTitles`. It did not, because
`RUNNING_SUITE_MODIFIERS` is `['concurrent','sequential','shuffle','each','for']` — `runIf` and
`skipIf` are deliberately absent, since the walker reads a syntax tree and not a run — so a file
opening its suites with `describe.runIf(...)` is PARKED and nothing beneath them is credited.
Both homes I chose were already parked (the walker's own §7103 note records exactly this for
`vendorPdfLazy.test.js`). Choosing already-parked homes was deliberate: adding a `describe.runIf`
to a CREDITED file would have parked it and moved `parked` UP and `credited` DOWN together.

⛔ **The chair's correction stands regardless, and I want it recorded as accepted.** "Zero by
construction" was the right instinct for commit 1 and the wrong law for the lane. The owed tests
were written because they are owed; the zero delta is a happy property of the homes, not the
reason the tests exist, and if the tuple had moved I would have recorded the delta and handed it
to the refreeze rather than skipped the tests.

### Goldens, first measurement to last
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```
Byte-identical before the first edit and after the third commit. `UPDATE_GOLDEN` /
`GOLDEN_SHIFT_SIGNED` never set.

### Final branch state
```
fd4be7c07  FIX-B2: pin the last two anchored leaves and write the owed build tests …
2fa685264  FIX-B2: pin the MED pair — the active-chain closure and the helpers cycle …
5cc0e6c14  FIX-B2: pin the four LOW anchored leaves out of the lazy engine chunk …

 tests/build/engineChunkLazy.test.js       | 128 +++++
 tests/build/livingContentSeamLazy.test.js |  15 +-
 tests/build/vendorPdfLazy.test.js         |  44 ++++
 vite.config.js                            | 250 ++++++++++++++++++++++---
 4 files changed, 422 insertions(+), 15 deletions(-)

git diff --name-only c33446830..HEAD -- src   → EMPTY
git status --short                            → EMPTY
```
