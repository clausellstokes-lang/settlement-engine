# FIX-B2 — the measurements, taken BEFORE the first edit (LANE-PARALLEL §2)

**Lane:** FIX-B2 (Opus BUILD). **Chair:** Fable 5.1, session a9df403c.
**Worktree:** `$SP/lane-fix-b2`, branch `fix-engine-anchors-2026-09-20`, cut at `c33446830`.
**Stamp (from `date` in the same call as the goldens):** `Sun Sep 20 08:38:02 EDT 2026`.
**`git status --short` at worktree creation:** EMPTY (0 lines).

All figures below are CONFIRMED by execution. No build has run yet; every dist figure is read
from TOOL-12's BEFORE copy `$SP/lane-tool-12-scratch/dist-ec0a30da2/` (built at `ec0a30da2`; my
tip is four docs/register commits later with no `src/` change). My own build re-measures them.

---

## 0. Goldens, before the first edit

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

## 1. TOOL-12's graph reproduces EXACTLY at my tip (`tools/graph.mjs`, plain node, no gate)

```
TREE .../lane-fix-b2
src modules 2247; manualChunks=='engine' 111; unruled(orphan-capable) 1997
== THE ENGINE CHUNK'S DOORS (7 of 111 members are reachable from outside the chunk) ==
== ENGINE MEMBERS NOT IN generateSettlementPipeline's STATIC CLOSURE (3) ==  (the dark density trio)
EAGER_FIRST_PAINT_MODULES 268
```

## 2. The BEFORE dist (`tools/distimporters.mjs`)

```
emitted .js assets 545
engine chunk engine-v9Z9eGQ1.js (matches 1) size 677935 B / 677828 chars
== CHUNKS THAT STATICALLY IMPORT engine-v9Z9eGQ1.js: 38 ==
WORKER generation.worker-ChvrnTyn.js 1401208 B (readFileSync().length on a Buffer) / statSync 1401208 B
```

- **677,935 B vs 677,828 chars** — TOOL-12 item 9's 107-byte gap, reproduced.
- `vendorPdfLazy.test.js:750` measures `statSync(...).size` = **BYTES, already correct**. So the
  brief's byte-vs-char question resolves to the COMMENT arm, not a fix (see §6).
- `generationWorkerLazy.test.js:472` reads `readFileSync(...).length` on a **Buffer** = bytes, also
  correct; both agree at 1,401,208.

### The 38, with sizes
```
153849 CompendiumPanel · 262475 SettlementsPanel · 104632 realmManifest · 103998 GenerateWizard
 41090 RealmInspector · 47291 StructuredCampaignReconciliation · 35634 EconomicsTab · 29851 OverviewTab
 28961 RelationshipsTab · 26603 accountImportBody · 22381 campaignAdvanceSession · 21497 generalDeskRead
 21456 WizardNewsPanel · 18700 settlementPendingEdits · 17645 DailyLifeTab · 17583 generateSettlementPDF
 16139 WorldPulsePanel · 14849 generateWorldBook · 14579 ViabilityTab · 14566 HistoryTab
 14422 factionRename · 11111 partyImpact · 10914 composeInstantWorld · 8902 LiveWarStatus
  7562 accountImport · 7485 HeraldMobileCompanion · 6812 galleryImportMap · 6199 forecastRun
  4859 auspice · 4168 advanceCampaignWorld · 3873 instantWorldBody · 2850 PlotHooksTab
  2002 galleryImportSettlement · 1788 livingContentRoster · 1625 generationRequest · 846 importScrub
   686 densityCreateBoundary · 173 livingContentLaw
```
The 173-byte `livingContentLaw` chunk drags 677,935 B — a **3,918×** ratio.

## 3. THE TWELVE, re-derived at my tip (`tools/needs.mjs`)

`needs.mjs` walks each outside module's static closure, **stopping at the engine boundary**, and
collects the engine members it directly imports — i.e. exactly why that module's chunk must import
the engine chunk. ⚠ It counts the **six co-located orphans** as engine members (`--also=`): five of
the twelve are unruled (`manualChunks(id) === null`) and land in the chunk by Rollup co-location,
so a model that reads only `manualChunks` MISSES FIVE OF THE TWELVE. With them:

```
engine members (111 ruled + 6 co-located) 117
outside modules that NEED at least one engine member: 94
== ENGINE MEMBERS WITH AN OUTSIDE CONSUMER (12) ==
    49 outside modules  src/generators/terrainHelpers.js
    46 outside modules  src/generators/computeActiveChains.js
    16 outside modules  src/domain/content/livingContentLawVersion.js
     9 outside modules  src/lib/narrativeMutations.js
     9 outside modules  src/generators/stressPriority.js
     6 outside modules  src/domain/magicFilter.js
     6 outside modules  src/domain/content/livingContentSeam.js
     5 outside modules  src/generators/generateSettlementPipeline.js
     4 outside modules  src/domain/customCategories.js
     4 outside modules  src/generators/structuralValidator.js
     3 outside modules  src/generators/helpers.js
     2 outside modules  src/generators/priorityHelpers.js
```

**TOOL-12's "twelve members explain all 38" is CONFIRMED independently at my tip.** Note
`lib/prebuiltResourceChains.js` is NOT among them — it has ZERO outside consumers, which is
precisely why TOOL-12 priced move 7 as ledger-only and the chair refused it standalone. It rides
commit 2 only as part of `computeActiveChains`'s closure.

### Cumulative simulation of THIS lane's moves
| after | engine members | outside modules needing the engine | members with an outside consumer |
|---|---|---|---|
| base | 117 | 94 | 12 |
| commit 1 | 112 | 63 | 7 (terrainHelpers, computeActiveChains, magicFilter, pipeline, structuralValidator, helpers, priorityHelpers) |
| commit 2 | 107 | 61 | 4 (terrainHelpers, magicFilter, pipeline, structuralValidator) |
| commit 3 | 105 | **9** | **2** |

**The residual 2 are exactly the two this lane does not move:**
- `generateSettlementPipeline.js` — the chunk's own legitimate door (composeInstantWorld,
  instantWorldBody, generationRequest, and the two worker entries).
- `structuralValidator.js` — the chair's REFUSED HIGH move (SettlementDetail, SettlementsPanel,
  CoherencePanel, checkDraftEdit).

⚠ **The mass leaves in commit 3, not commit 1.** `terrainHelpers`'s 49 outside modules and
`computeActiveChains`'s 46 overlap heavily (the worldPulse/realmManifest family needs BOTH), so
commits 1 and 2 cut only the chunks that anchor on the small leaves; the worldPulse family stays
anchored until `terrainHelpers` moves. The per-commit dist scan is what I report, not this model.

## 4. EVERY MOVED MODULE'S CLOSURE IS EDGE-FREE (no edge back into the engine)

Outward static deps of all twelve moved modules, with their RULED chunk:

```
engine-core        eager  src/domain/arcaneInstitutionVocabulary.js     (magicFilter's)
engine-core        eager  src/domain/content/customContentSemanticAuthority.js
engine-core        eager  src/domain/resourceSemantics.js
engine-core        eager  src/domain/resourceTerrainCompatibility.js    (terrainHelpers')
content-identity   eager  src/domain/deterministicSort.js
data               eager  src/data/goods/identity.js
data               eager  src/data/institutionalCatalog.js
data               eager  src/data/constants.js
kernel             eager  src/kernel/rngContext.js
data-lazy          lazy   src/data/goods/chains.js
custom-registry    lazy   src/lib/dependencyEngine.js
custom-registry    lazy   src/lib/customRegistry.js
ORPHAN             lazy   src/domain/content/livingContentRoster.js  ← the seam's DYNAMIC dep only
```

Every one lands in a NAMED chunk. **No moved module statically reaches the engine chunk**, which
is what makes each anchor a clean cut rather than a re-parenting. CONFIRMED twice: at rule level
(above) and by the simulation (§3), which walks *through* each moved module and would surface any
engine member it reached.

## 5. ⭐ FIRST-PAINT SAFETY — zero eager STATIC contacts

A dynamic edge is a lazy boundary (`vite.config.js:265-266`, and both shipped derivations spell
`[^'"()]` to enforce it), so static and dynamic importers are counted separately:

```
living-content-seam                  static-imp   8 (eager: 0)   dyn-imp  0
engine-core-lazy(+customCategories)  static-imp   2 (eager: 0)   dyn-imp  0
narrative-mutations                  static-imp   2 (eager: 0)   dyn-imp  1 (src/store/aiSlice.js — LAZY BOUNDARY)
stress-priority                      static-imp   3 (eager: 0)   dyn-imp  0
resource-chains                      static-imp   4 (eager: 0)   dyn-imp  0
generator-helpers                    static-imp  26 (eager: 0)   dyn-imp  0
engine-core-lazy(+magicFilter)       static-imp   5 (eager: 0)   dyn-imp  0
terrain-helpers                      static-imp   7 (eager: 0)   dyn-imp  0

EAGER *STATIC* CONTACTS: 0   ✓ no new chunk can enter the first-paint static closure
```

⭐ `src/store/aiSlice.js` IS an eager module and it reaches `narrativeMutations.js` — but only by
`import(`. That is not a first-paint risk; it is the opposite finding, and a product one: **today
the AI path fetches the whole 677,935 B engine to reach a 3,977-byte mutation helper.**

Pinning changes no ESD membership, so `EAGER_FIRST_PAINT_MODULES` must stay **268**. I re-run
`graph.mjs` after each edit and assert that figure.

## 6. Chunk-graph safety for the two `engine-core-lazy` joiners (moves 5 and 8)

Measured from the BEFORE dist's own specifiers:

```
engine-core-lazy-Cnd1KL-B.js (23846 B)
   IMPORTS: content-identity, engine-core, custom-schema, data-lazy, kernel
   IMPORTED BY (35)
engine-core-DEo3MRBd.js (125886 B)
   IMPORTS: data, content-identity, kernel          ← does NOT import engine-core-lazy
```

`customCategories` → `deterministicSort` (content-identity) and `magicFilter` →
`arcaneInstitutionVocabulary` (engine-core). **Both edges ALREADY EXIST** on `engine-core-lazy`,
so the two joins add **no new chunk, no new chunk edge, and no `__vitePreload` map entry** — and
cannot form a cycle (`bootSmoke.test.js`'s real arm re-proves this against my dist). That settles
the brief's open question: **moves 5 and 8 both JOIN `engine-core-lazy`; neither mints a chunk.**
Size band check: `engineChunkLazy.test.js:108-109` requires `>5_000` and `<50_000`; 23,846 plus
~2,156 + ~961 ≈ **27 kB**, comfortably inside. `toHaveLength(1)` stays 1.

## 7. Existing pins my moves touch

| pin | effect |
|---|---|
| `vendorPdfLazy.test.js:786-787` engine band `>300_000` / `<679_000` | both arms IMPROVE; ceiling untouched (§934.68 is the owner's) |
| `engineChunkLazy.test.js:66-67` band `>200_000` / `<1_400_000` | improves; never binds |
| `engineChunkLazy.test.js:106-109` engine-core-lazy `toHaveLength(1)`, `>5_000`, `<50_000` | holds (§6) |
| `engineChunkLazy.test.js:238-249` orphan-excision guard (EXECUTES `manualChunks`) | **more** satisfied — it pins the previously-unplaced excisions |
| `vendorPdfLazy.test.js:1725-1727` the three first-paint budgets | byte-untouched; not this lane's |
| `generationWorkerLazy.test.js:159` `WORKER_BUNDLE_CEILING_BYTES = 1401208` | `worker.rollupOptions` is unset so `manualChunks` never runs for workers — unmoved by construction; measured anyway |
| `livingContentSeamLazy.test.js:135-138` | a COMMENT claiming the seam "rides the lazy engine chunk" — my move makes it false; corrected in commit 1 |
| `tests/lib/prebuiltResourceChains.test.js` | runtime registration only, no placement claim; unaffected by a config-only change |

Only THREE tests execute `manualChunks`: `customContentCharsetLazy`, `engineChunkLazy`,
`vendorPdfLazy` — all under `tests/build`, which I run whole.

**No new pin is written and no test file or title is created** (the lighting census is FROZEN at
`2656·383·2273·25074·6684` and the brief forbids it here). TOOL-12's "a new pin owes a new build
test" is recorded as an owed ⛔ item for the chair to slot, not skipped silently.

## 8. The two refused moves, restated (the chair's, recorded and vetoable)

1. **Move 1 — `src/data/narrativeData.js` to its own chunk: REFUSED.** Its consumers are all
   in-engine, so the generation fetch is byte-identical afterwards; only the measured ledger
   shrinks. A ledger move is not a cure. ⭐ The rule STAYS; only its false rationale is corrected
   (below). CONFIRMED at my tip: the module has **0 static imports, 0 export-from, 0 dynamic
   imports**, 40,003 source bytes, and its header (lines 1-8) records that the two rng-capturing
   tables moved to `generators/narrativeText.js` — so `vite.config.js:866-869`'s "still calls into
   the engine's PRNG/helpers at runtime" is refuted by the file it governs (ODQ §934.47 addendum
   83 / TOOL-12 item 2).
2. **Move 7 — `lib/prebuiltResourceChains.js` alone: REFUSED** (ledger-only; zero outside
   consumers, confirmed in §3). It rides commit 2 inside move 2's closure.
3. **The `structuralValidator` closure: REFUSED** (HIGH; six modules, a seventh of the chunk
   re-shaped for a byte problem). It is one of the two residual anchors in §3, by design.

## 9. The SEAMCYCLE claim, measured (`vite.config.js:214-217`)

The note justifies leaving `livingContentLawVersion.js` UNPINNED because Rollup co-locates it
"into the lazy `engine` chunk where its **one emitted importer** already lives".

**REFUTED.** `livingContentLawVersion.js` has **SIX** static importers. One (`livingContentSeam.js`)
is itself co-located into the engine chunk; the other **FIVE live outside it**:

```
src/domain/content/livingContentLaw.js            → livingContentLaw-DBcv22d5.js        173 B
src/domain/content/livingContentRoster.js         → livingContentRoster-BVqW1xdO.js   1,788 B
src/domain/density/densityCreateBoundary.js       → densityCreateBoundary-CvdsOKVn.js   686 B
src/lib/importScrub.js                            → importScrub-G9LGW_Vq.js             846 B
src/lib/importReconciliationAdmission.js          → StructuredCampaignReconciliation-Cg5PPuLY.js 47,291 B
```

All five emitted chunks are in the 38. `needs.mjs` with move 4 simulated alone: **zero of the five
still needs the engine** — so move 4 cuts all five, and none reaches the engine by another path.

⚠ TOOL-12 §3a named FOUR chunks here; the measured figure is **FIVE** — it omitted
`livingContentRoster`, which my dist scan shows is in the 38 and which move 4 also cuts. The
corrected comment carries the measured five.

## ⛔ Noticed, not touched (new — not among TOOL-12's already-slotted items)

1. **⛔ `vite.config.js:874-877` carries a SECOND refuted claim in the same comment block as the
   narrativeData one.** It says stressTypes.js "MUST NOT stay in 'engine': helpers.js
   (engine-core) re-exports STRESS_INSTITUTION_EFFECTS from it, so an 'engine' assignment would
   make engine-core → engine". Measured at my tip: `src/generators/helpers.js` is ruled into
   **`engine`, not `engine-core`** (there is no `src/domain/helpers.js`; the three `helpers.js`
   files are `generators/`, `components/settlements/`, `components/settlement/eventComposer/`),
   and it has **no stressTypes edge at all** — its three static deps are `data/constants.js`,
   `kernel/rngContext.js`, `generators/priorityHelpers.js`. The seven real importers of
   `data/stressTypes.js` are three `src/domain/**` and four `src/generators/**` modules. The
   rule's CONCLUSION (let stressTypes fall through to `data`) may still be right for another
   reason, so I neither changed the rule nor rewrote that half of the comment — the chair asked
   for the narrativeData rationale specifically.
   ✅ **RULED (chair, ODQ §934.47 addendum 84): corrected in COMMIT 2**, whose move 3 touches that
   very rule. Rationale corrected, rule kept, TOOL-12/FIX-B2 named as the measurement.
2. **⛔ Every new pin this lane adds is owed a build test by the estate's own idiom**
   (`contentIdentityLazy`, `cultureProfilesLazy`, `customContentCharsetLazy`,
   `livingContentSeamLazy`, `userRouteIdentityLeaf`): absent-from-entry-closure +
   present-in-a-lazy-chunk, with the non-vacuity pair. ~~This lane writes none.~~
   ✅ **RULED (chair, addendum 84): WRITTEN IN COMMIT 3**, one title per new pin, in the existing
   `tests/build` homes — a frozen tuple is never a reason to skip an owed test; the title delta is
   measured, recorded in the receipt, and absorbed by the chair's refreeze at the train's terminal.
   Homes and the two freeze hazards (the exact-count negative-assertion rows; the parked/credited
   rule that predicts a ZERO delta) are worked out in `FIX-B2.lane-resume.md`, batch 3.
3. **⛔ The engine chunk's static-importer count has no instrument.** TOOL-12 item 5 slots the
   ratchet at 38; this lane MOVES that number, so whatever figure the chair mints must come from
   the post-FIX-B2 build, not from 38.
