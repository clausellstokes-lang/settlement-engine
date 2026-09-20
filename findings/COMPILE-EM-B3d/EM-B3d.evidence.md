# EM-B3d — COMPILE EVIDENCE

Every fact in `EM-B3d.md` and `EM-B3d.manifest.json` is proved here by an executed command with its output. **A fact without a command is not verified.** Lane: Opus COMPILE `COMPILE-EM-B3d`, 2026-09-20, chair session `4a1823e2`.

**THE TREE EVERY COMMAND READ:** `$SP/read-tip-em-t7`, with `SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`. Every probe script takes its tree from the `LANE_TREE` environment variable with **no default**, and prints it, per the chair's correction of 2026-09-20. No gate was run; nothing was edited anywhere.

---

## E-TIP — the read tip, its cleanliness, the preamble hash, and the stamp

```
$ cd "$SP/read-tip-em-t7" && git rev-parse HEAD && git rev-parse --short HEAD
ee204c827fa525327206e7427ad77e1e3526912f
ee204c827
$ git status --short
            <-- EMPTY at the lane's start
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675  docs/implementation/preambles/EM-PREAMBLE.md
$ date
Sun Sep 20 14:40:46 EDT 2026
```

HEAD matches the launch brief's `ee204c827`; the preamble hash matches the chair's measured `c9f33c8d…6675` (the fourth amendment), so the STOP condition the launch named does not fire.

## E-SCRUB — `src/lib/importScrub.js`, read whole, and its three exported strips

`src/lib/importScrub.js` is 168 raw lines, read whole. Its docblock:

> `importScrub.js — the SINGLE writer for the imported-settlement dormancy strip.` … `ALL THREE import paths — galleryImportSettlement.js, galleryImportMap.js and accountImport.js — route their scrub through here, so a NEW deity/faith embed key can never re-open the resurrection gap in one path only (store-4: cultDeitySnapshots was missed by both hand-maintained strips).` … `THREE STRIPS, at two levels, because the hazards live at two levels:`

`scrubImportedTreasury` (`:87`), quoted whole:

```js
export function scrubImportedTreasury(settlement) {
  if (!settlement || typeof settlement !== 'object' || Array.isArray(settlement)) return settlement;
  const economicState = settlement.economicState;
  if (!economicState || typeof economicState !== 'object' || Array.isArray(economicState)) return settlement;
  if (!Object.hasOwn(economicState, 'treasury')) return settlement;
  const {
    // eslint-disable-next-line no-unused-vars -- intentional drop of a foreign coin ledger
    treasury,
    ...restEconomicState
  } = /** @type {Record<string, any>} */ (economicState);
  return { ...settlement, economicState: restEconomicState };
}
```

Its docblock states the reference-identity contract in terms: *"Pure, and REFERENCE-IDENTICAL when there is nothing to strip: a settlement with no treasury key … comes back as the very object that went in, so this can never move a byte on the dormant path."* `scrubImportedConfig` (`:49`) is the five-key destructure-drop over `settlement.config` with the `// eslint-disable-next-line no-unused-vars -- intentional drop of seed + faith embeds` directive; `scrubGalleryImportLivingContent` (`:145`) is the `Object.hasOwn`-guarded two-stage destructure-drop, also reference-identical on the no-op path.

The existing address pin, `tests/lib/importScrub.test.js:108-125`:

```js
  it('ALL THREE import paths call it — the one-path-only shape store-4 was', () => {
    …
    for (const rel of ['src/lib/accountImport.js', 'src/store/galleryImportSettlement.js', 'src/store/galleryImportMap.js']) {
      const src = read(rel);
      expect(src, `${rel} no longer imports the coin strip`)
        .toMatch(/import\s*\{[^}]*\bscrubImportedTreasury\b[^}]*\}\s*from\s*['"][^'"]*importScrub\.js['"]/);
      expect(src.includes('scrubImportedTreasury('), `${rel} imports the coin strip but never calls it`).toBe(true);
    }
  });
```

The regex's `[^}]*` spans the whole brace list, so an import that gains a fourth name still matches: this arm stays GREEN across EM-B3d.

## E-SITE — the three import call sites, by symbol

```
$ git grep -n "scrubImportedTreasury" -- src
src/lib/accountImport.js:58:import { scrubImportedConfig, scrubImportedTreasury } from './importScrub.js';
src/lib/accountImport.js:617:  const settlement = scrubImportedTreasury({
src/lib/importScrub.js:20: *   • `scrubImportedTreasury` — over the SETTLEMENT (the W-COIN state coin ledger,
src/lib/importScrub.js:87:export function scrubImportedTreasury(settlement) {
src/store/galleryImportMap.js:15:  scrubImportedTreasury,
src/store/galleryImportMap.js:290:        settlement: scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({
src/store/galleryImportSettlement.js:25:  scrubImportedTreasury,
src/store/galleryImportMap.js  (import block :13-17)
src/store/galleryImportSettlement.js:71:    settlement: scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({
```

The three call expressions, quoted verbatim from the tree, and their lengths:

```
galleryImportSettlement.js:71  len=91   settlement: scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({
galleryImportMap.js:290        len=95           settlement: scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({
accountImport.js:617           len=44     const settlement = scrubImportedTreasury({
```

There is **no `max-len` rule** in `eslint.config.js` (`grep -n "max-len" eslint.config.js` → no output), so the one-token wrap is unconstrained by lint.

The enclosing scopes were read whole: `importGallerySettlementImpl` (`galleryImportSettlement.js:30-101`), the per-member loop of `importGalleryMapWithCampaignImpl` (`galleryImportMap.js:255-324`), and `prepareSettlementEntry` (`accountImport.js:571-660`).

## E-DENOM — the import-path denominator, and the search for a FOURTH path

The denominator is the grep above: **8 lines — 1 definition, 1 docblock mention, 3 import bindings, 3 call sites.** The three call sites are the whole population. The search for a fourth settlement-level import path:

```
$ git ls-files 'src/**' | grep -i import          (25 modules)
$ git grep -n "prepareSettlementEntry" -- src
src/lib/accountImport.js:571:export function prepareSettlementEntry(rawEntry, meta = {}) {
src/lib/importReconciliationAdmission.js:684:    const prepared = prepareSettlementEntry(rawEntry, {
src/store/accountImportBody.js:414:      const preparedResult = prepareSettlementEntry(
$ git grep -n "savesService.save\|saves\.save(" -- src        (10 call sites)
```

Findings, each opened and read:

- `src/lib/importReconciliationAdmission.js:684` and `src/store/accountImportBody.js:414` both route through `prepareSettlementEntry` — they **inherit** the strip and are not separate seams.
- `src/lib/campaignImport.js` is *"the orchestration glue between the paste/upload UI and the pure schema wall (src/domain/tableEvents.js)"* — it imports the DM's typed table EVENTS, never a settlement blob (4 occurrences of the word "settlement", all in `settlementIds` typedefs).
- `src/store/campaignImportedCreation.js` builds the campaign ENVELOPE; its settlement membership comes from `accountImportBody.js`.
- `src/hooks/useMapImageImport.js` imports a map IMAGE; `src/lib/customContentArchiveImport.js` imports custom-content definitions.
- Every other `savesService.save` call site writes a LOCAL settlement: `BuyThisDossier.jsx:174` (*"the save-first rung persists a NEW settlement"* — the user's own unsaved draft), `SettlementsPanel.jsx:212` (a sample FORK, which is a fresh generation), `store/index.js:214`, `instantWorldBody.js:206`, `SaveToLibraryButton.jsx:53`, `ConstructionPanel.jsx:142`.

⇒ **CONFIRMED: three settlement-level import paths, all three already routing through `scrubImportedTreasury`. No fourth path exists, so there is no finding to report under the launch brief's "a path that imports a settlement without the treasury scrub is a finding in itself".**

## E-KEYS — every writer and reader of `dmLayer` and `decrees` in `src/`

```
$ git grep -nP '\bdmLayer\b|\bdecrees\b' -- src        (14 files; -P, never -E, per the grep law)
```

Classified, every hit read in place:

| File | Hits | What it is |
|---|---:|---|
| `src/domain/ai/personaSlicer.js` | 3 | ⭐ **the ONE reader of `settlement.decrees`**: `:172  decrees: (home?.appliedDecrees \|\| home?.decrees \|\| []).slice(0, 6)` |
| `src/domain/display/publicSafe.js` | 8 | EM-B3a's landed veil: the `decrees` token in `PRIVATE_KEY_RE` (`:110`) and `delete clone.dmLayer; delete clone.decrees;` (`:294-295`) |
| `src/domain/display/worldSnapshotPublic.js` | 2 | EM-B3a's landed `WORLD_SNAPSHOT_HARD_DENY` members (`:92-93`) |
| `src/lib/accountData.js` | 1 | EM-B3a's landed `withoutEditState`: `:213  const { dmLayer, decrees, ...rest } = …(s)` |
| `src/domain/edit/recordRegister.js` | 2 | EM-R0a's class register: `:38  dmLayer: 'AUTHORED', decrees: 'AUTHORED',` and `:59  NOT_YET_WRITTEN_KEYS` |
| `src/domain/display/decreeTracker.js` | 22 | **NOT the settlement key.** `decreesForAdvance(entry, provenance)` reads `entry.record`'s nodes — a PULSE ADVANCE derivation. Same word, different fact |
| `src/components/map/AdvanceReport.jsx` | 11 | the render of that advance derivation |
| `causeConjunctionContent.js`, `causeConjunctionRole/ruler.js`, `institutionServices.js`, `npcProfile.js`, `events/registry.js`, `worldPulse/momentum.js`, `worldPulse/warReasons.js` | 15 | English PROSE strings containing the word "decrees" |

`src/domain/edit/recordRegister.js:55-59`, quoted:

```js
/** Declared but not yet written anywhere. Arm A1 asserts their ABSENCE, never their shape. … */
export const NOT_YET_WRITTEN_KEYS = Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts']);
```

```
$ git ls-files 'src/domain/edit/*'
src/domain/edit/recordRegister.js          <-- the ONLY member of that directory at this tip
```

⇒ **CONFIRMED: no shipped path can put either key on an imported settlement today.** EM-B3a's measurement re-measured and unchanged in substance; what has changed since is that EM-R0a landed a frozen declaration saying so.

## E-OSR — the observed-shape register, run plain, and its inventory

```
$ cd "$SP/read-tip-em-t7" && node scripts/check-observed-shape-readers.mjs > "$S/osr-base.log" 2>&1; echo "exit $?"
exit 0
$ tail -6 "$S/osr-base.log"
observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.
CR-OSR-FREEZE-6 shape-family filter …
CR-OSR-SCHEMA-6 M11 DOM-global receiver filter …
CR-OSR-SCHEMA-6 M12 language-surface filter …
M8/M9 explained-writer bank (H26 / CR-OSR-FREEZE-6-R2): 8 declared identit(ies) …
CR-OSR-FREEZE-7 UNREVIEWED-UI cohort (src/components/): 50 file(s) / 128 identit(ies) / 192 read(s) …
```

⛔ The exit code is captured **from the command itself**, never through a pipe (the chair's addendum 106).

The baseline's structure, parsed with `node`:

```
top-level keys: _doc | corpusMeta | digests | frozen | frozenAtSha | identities | inventory | manifests |
                migrationReview | minRows | originMinRows | rowTags | scanStats | scannerProvenance |
                schema | sentinel | total
inventory FILES: 387 | identities=1390 | total(reads)=1964 | frozenAtSha=31ab5d18bdd44ba0691c2e16f3ae8f3cfef36eb1
```

The `inventory` is keyed BY FILE, each value a map of `"<key> on <shape>" → count`:

```
src/lib/importScrub.js               -> ABSENT from inventory
src/lib/accountData.js               -> ABSENT from inventory
src/domain/display/worldSnapshotPublic.js -> ABSENT from inventory
src/lib/accountImport.js             -> ABSENT from inventory
src/store/galleryImportSettlement.js -> ABSENT from inventory
src/domain/edit/recordRegister.js    -> ABSENT from inventory
src/domain/display/publicSafe.js     -> {"covert on settlement":1}
src/store/galleryImportMap.js        -> {"_seed on config":1}
src/domain/ai/personaSlicer.js       -> {"appliedDecrees on settlement":1,"blocs on settlement":1,
                                        "cultDeitySnapshots on config":1,"decrees on settlement":1,
                                        "economy on settlement":1,"politicsLedgers on settlement":1,
                                        "primaryDeity on settlement":1,"primaryDeitySnapshot on config":1,
                                        "prosperity on settlement":1}

every identity naming dmLayer / decrees / appliedDecrees, across all 387 files:
  src/domain/ai/personaSlicer.js :: appliedDecrees on settlement = 1
  src/domain/ai/personaSlicer.js :: decrees on settlement = 1
  count=2
```

⭐ **THE LIVE CONTROL, AND IT IS DECISIVE.** `src/lib/importScrub.js` destructure-drops eight keys and carries **zero** inventory rows, while four of those very keys convict where they are read as PROPERTIES elsewhere in the tree: `_seed on config` at `galleryImportMap.js`, `primaryDeitySnapshot on config` and `cultDeitySnapshots on config` at `personaSlicer.js`, and `decrees on settlement` at `personaSlicer.js`. Same key names, two spellings, one convicted.

**The three file manifests are a frozen genesis record, not a live gate** — measured by comparing each recorded sha against the live file:

```
--- scanTree (2228 entries) / sourceTree (2245) / executionTree (2256) ---
  src/domain/display/publicSafe.js       recorded=958fd85de04c  live=0ee3c15dc3a3  DRIFTED
  src/domain/display/worldSnapshotPublic.js recorded=d45f1e5acd29 live=6d4aa96f2bc1 DRIFTED
  src/lib/accountData.js                 recorded=0c29cdfa9e09  live=654d6adc0634  DRIFTED
  src/lib/importScrub.js                 recorded=10c99ff3a1c6  live=10c99ff3a1c6  SAME
  src/domain/edit/recordRegister.js      ABSENT from all three manifests
--- detectorTree (11 entries) --- none of the five
```

Three of EM-B3a's own change paths read DRIFTED and `recordRegister.js` is absent entirely, yet the scan **exits 0**. ⇒ a MODIFY to `src/lib/importScrub.js` does not move the register through the manifests; only a new convicted READ could move it.

## E-SPELL — three candidate spellings, measured against the detector's OWN rule

The detector's rule, quoted from `scripts/lib/legacy-reader-shape-scan.mjs`:

```js
// scanReaders(), :540-547
for (const [file, sf] of idx.sources) {
  const visit = (node) => {
    if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) {
      const key = node.name.text;
      if (!BUILTIN_MEMBERS.has(key) && !isWriteTarget(node)) { reads += 1; …
```

```js
// isWriteTarget(), :516-526
function isWriteTarget(node) { …
  if (ts.isDeleteExpression(p)) return true; …
}
```

and the module's own header: *"computed reads (`row[key]`) are invisible — the key is not a literal"*. **Destructuring patterns and `Object.hasOwn(x, 'k')` string literals are not property accesses and are never counted.**

Three candidate spellings were written to `<scratch>/spellings/` and parsed with the tree's own TypeScript (`6.0.3`, resolved through the read tip's `node_modules`), counting exactly what `scanReaders` counts:

```
--- A-destructure.js  (Object.hasOwn guard + destructure-drop) ---
  property-access nodes total: 3   keys: isArray,hasOwn
  dmLayer/decrees property accesses: 0
--- B-propertyread.js (settlement.dmLayer === undefined guard) ---
  property-access nodes total: 3   keys: isArray,dmLayer,decrees
  dmLayer/decrees property accesses: 2
    line 3 key=dmLayer :: settlement.dmLayer
    line 3 key=decrees :: settlement.decrees
--- C-delete.js       (unconditional spread + delete clone.<key>) ---
  property-access nodes total: 5   keys: isArray,hasOwn,dmLayer,decrees
  dmLayer/decrees property accesses: 2   (both isWriteTarget ⇒ 0 counted)
--- CONTROL: live src/lib/importScrub.js (zero inventory rows) ---
  property-access nodes total: 11
  keys: config, economicState, hasOwn, isArray
  destructured/hasOwn key "_seed"                  appears as a property access: false
  destructured/hasOwn key "primaryDeityRef"        appears as a property access: false
  destructured/hasOwn key "primaryDeitySnapshot"   appears as a property access: false
  destructured/hasOwn key "cultDeitySnapshots"     appears as a property access: false
  destructured/hasOwn key "faithProfile"           appears as a property access: false
  destructured/hasOwn key "treasury"               appears as a property access: false
  destructured/hasOwn key "customContentRoster"    appears as a property access: false
  destructured/hasOwn key "customContentProvenance" appears as a property access: false
--- CONTROL: personaSlicer.js, the ONE convicted file (decrees on settlement = 1) ---
  line 172 key=appliedDecrees :: home?.appliedDecrees
  line 172 key=decrees        :: home?.decrees
```

The second live control for spelling C: `src/domain/display/publicSafe.js` contains EM-B3a's landed `delete clone.dmLayer;` and `delete clone.decrees;` and its inventory row is **only** `{"covert on settlement":1}` — no `dmLayer` or `decrees` row.

⇒ **CONFIRMED: spelling A adds ZERO reads and moves the observed-shape register by ZERO rows. Spelling B would MINT two rows through the chair's migration-bundle door. Spelling C mints nothing but forfeits reference identity.** Spelling A is contracted; B is a STOP.

The measurement was made on SCRATCH COPIES under `<scratch>/spellings/`; the read tip was never edited and `git status --short` there stayed empty.

## E-BUD — the four byte budgets, and the three worker closures

```
EAGER_FIRST_PAINT_MODULES size: 269     (imported LIVE from vite.config.js, never a hand list)
--- first-paint eager closure membership ---
  src/lib/importScrub.js                  NOT-EAGER
  src/store/galleryImportSettlement.js    NOT-EAGER
  src/store/galleryImportMap.js           NOT-EAGER
  src/lib/accountImport.js                NOT-EAGER
--- edge-shared metas (5), membership against each meta's OWN `inputs` list ---
  aiCharterBundle.meta.json         inputs= 114  hits=NONE
  aiGroundingBundle.meta.json       inputs=  74  hits=NONE
  aiOutputSchemaBundle.meta.json    inputs= 115  hits=NONE
  analyticsEventsBundle.meta.json   inputs=   2  hits=NONE
  intentAtlasBundle.meta.json       inputs=   2  hits=NONE
--- worker static SOURCE closures (relative static imports only, the emitted-chunk rule applied to source) ---
  src/workers/generation.worker.js      220 modules — none of the four in closure
  src/workers/townSceneExport.worker.js 125 modules — none of the four in closure
  src/workers/advanceInterval.worker.js 549 modules — none of the four in closure
--- the lazy engine chunk rule, from vite.config.js ---
  1044: if (id.includes('/src/generators/'))
  1104: if (id.includes('/src/data/narrativeData.js'))
```

Bounds, re-read at the tip: `WORKER_BUNDLE_CEILING_BYTES = 1401208` (`generationWorkerLazy.test.js:159` — re-minted 2026-09-18, **not** EM-B3a's quoted 1401128); `expect(size).toBeLessThan(679_000)` (`vendorPdfLazy.test.js:831`); `CLOSURE_BUDGET_BYTES = 1_048_000` (`vendorPdfLazy.test.js:565`).

⇒ **CONFIRMED: EM-B3d reaches none of the four budgeted closures and none of the three workers. No ceiling TEST row, no byte bound, no re-mint, no edge-shared regeneration.**

## E-EFF — effective lines, under eslint's own `Linter`

`max-lines` with `skipBlankLines: true, skipComments: true`, the estate's own measurement:

```
  src/lib/importScrub.js                    raw=  168  effective=   39
  src/store/galleryImportSettlement.js      raw=  102  effective=   52
  src/store/galleryImportMap.js             raw=  441  effective=  311
  src/lib/accountImport.js                  raw=  661  effective=  379
  tests/lib/importScrub.test.js             raw=  248  effective=  183
  tests/lib/editTravel.test.js              raw=  219  effective=  136
```

The ceiling for `src/lib/**` and `src/store/**` is **800** (`eslint.config.js:730-742`). `grep -n "importScrub\|galleryImport\|accountImport" eslint.config.js scripts/.size-baseline.json` → **no output**: no per-file `max-lines` override and no size-baseline entry. None of the four is on the standard's hot-file standing list. Tightest headroom: `accountImport.js`, **421** effective lines.

## E-REG — every register, measured

**Mutation coverage** — `tests/lint/mutationCoverage.shared.mjs:36-72`: a file is enumerated iff it sits under one of the eight `ENFORCER_DIRS` (`tests/lint`, `design`, `docs`, `data`, `copy`, `security`, `edgeFunctions`, `generators`) **or** its basename trips `NAME_PATTERN` = `/(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i`. `tests/lib` is not an enforcer dir; `importScrub.test.js` and `editTravel.test.js` trip no token. ⇒ **zero rows owed, on both arms.**

**Lighting census** — `tests/lint/.lighting-census-baseline.json`, read at the tip: `measuredAtSha d279d13ebe718f07b278ec6d1a705a0870159079`, `files 2664 · parked 359 · credited 2305 · titles 25501 · suiteTitles 6812`, seventh refreeze, chair `chair-fable-a9df403c`. ⛔ Quoted here only to prove the figures were READ; the packet states a DELTA and the absolute is the chair's stamp. `parkReasonsFor` is a module-private const inside a vitest test file (`sovereigntyLightingContract.walker.test.js:1670`) with no non-vitest entry point (`process.env` grep shows only `LIGHTING_CENSUS_REFREEZE` / `LIGHTING_CENSUS_NOTE`), so this compile lane **could not execute it** and does not claim to have. Structural read of both files (PLAUSIBLE, owed to the pre-proof): each imports its openers from `'vitest'`, registers straight-line under literal `describe`s, and binds no variable or parameter named `it`/`test`/`describe`.

**Wiring census** — `docs/content/wiring-census.json`: `grep -c "\"<path>\""` → **0** for all four `src/` paths. No CREATE under `src/generators/**` or `src/domain/**`, so §P2 row 13 is not owed.

**Prose numerics** — `tests/lint/.prose-numerics-baseline.json`: `grep -c "importScrub\|galleryImport\|accountImport"` → **0**. Nothing is rendered.

**Anchor ceilings** — `tests/lint/negativeAssertionAnchor.walker.test.js`:

```
:626  'tests/lib/importScrub.test.js': 1,
```

and `tests/lib/editTravel.test.js` / `tests/store/decreeRegistryPersistence.test.js` carry **no row** (EM-B3a's two CREATEs used the anchored idiom throughout). The semantics, read whole at `:809-875`: `ceilingFor` is the roster value else 0; the first arm reds when `count > ceiling`; the **`inventory honesty`** arm reds when `actual < ceiling` (*"a site was anchored; LOWER the row to N"*). The one un-anchored site in `importScrub.test.js` is `expect(out).not.toHaveProperty(stripped)` at `:42` (the loop body; `BARE_NEGATIVE_RE` = `/not\.(?:toContain|toMatch|toHaveProperty)\(/g`). ⇒ **leave `:42` exactly as it is, and anchor every new negative.**

**Citations by line** — the estate spells these by BASENAME, not by full path (a full-path grep returns nothing and would have missed all seven):

```
$ git grep -nP '\bimportScrub\.js:[0-9]' -- src docs tests scripts
src/lib/importReconciliationAdmission.js:442: * OWN HEADER ALREADY CITES. `importScrub.js:115-121` states it for the sibling
src/lib/importReconciliationAdmission.js:549:  // `importScrub.js:158-166` already ships for the same act rather than a second
tests/lib/importReconciliation.test.js:604:  // roster-less, which is exactly the state `importScrub.js:115-121` forbids: a

$ git grep -nP '\bgalleryImportSettlement\.js:[0-9]' -- src docs tests scripts        (live citations only)
tests/domain/composeStateProse.test.js:319:    // … `galleryImportSettlement.js:76` sets `_seed: undefined`, so the
tests/domain/stateProseKernel.test.js:612:    // `galleryImportSettlement.js:76` sets `_seed: undefined` on an imported town, so the
tests/property/dossierProseManifest.test.js:30: *   THE SEEDLESS CONTROL. `galleryImportSettlement.js:76` nulls `_seed`, so an imported town
tests/property/dossierProseManifest.test.js:522:    // `galleryImportSettlement.js:76` nulls `_seed`, so the desks reach `drawVariant` with an
```

The remaining hits for all four basenames sit in `docs/COMPREHENSIVE_REVIEW_2026-07-13.md`, `docs/SETTLEMENT_CAPABILITY_ATLAS.md` and `EM-B3a.md` — all **archival-excluded** by the citation walker's own four rules (`dated`: an ISO date in the filename, the three COMPREHENSIVE_REVIEWs; `sha-pin`: SETTLEMENT_CAPABILITY_ATLAS's `**Snapshot base:**` header), and a landed packet is a record that is annotated, never re-addressed.

The walker's reach, from its own header: **ARM 1 is a PAST-EOF arm** (`src`, `tests` and `scripts` carry NO baseline — *"past-EOF there is always red"*); ARM 2 is the same objective test over `docs/` against a shrink-only baseline; **ARM 3, the symbol arm, is REPORT-ONLY** and reaches 5.6 % of live-code citations. ⇒ a shift of a few lines reds **nothing**; it only makes the citation wrong. `grep -c "importScrub\|galleryImportSettlement\|galleryImportMap\|accountImport" tests/lint/.source-citation-baseline.json` → **0**.

`MANIFEST_RECORDER_FILES` (`tests/helpers/dossierManifest.js:340`) is `['tests/helpers/dossierManifest.js', 'tests/helpers/goldenMasterCorpus.js', 'scripts/prose-rate-corpus.mjs']` — `tests/property/dossierProseManifest.test.js` is **not** among them, so the four `:76` citations carry no recorder-identity risk; the net-zero edit avoids touching them at all.

## E-RES — the reservation census and the collision group

```
packets: 195
statuses: {"LANDED":193,"SUPERSEDED":2}
--- NON-TERMINAL packets and whether they reserve any of my paths ---
   (none — there are no non-terminal packets at this tip)
--- LANDED packets whose requiredSymbols or changeManifest name my paths ---
  EST-A  [LANDED] requiredSymbols=[{"path":"src/store/galleryImportMap.js","symbol":"importGalleryMapWithCampaignImpl"}]
  WF-1E  [LANDED] requiredSymbols=[{"path":"src/lib/importScrub.js","symbol":"export function scrubImportedConfig"}]
  WEB-5  [LANDED] changeManifest=[MODIFY src/lib/accountImport.js]
                  requiredSymbols=[admitRestoredLifecycle, restoreIntraEnvelopeWiring,
                                   importedNeighbourLinkId, "meta.restoreLifecycle === true"]
  EM-B3a [LANDED] changeManifest=[CREATE tests/lib/editTravel.test.js]
                  requiredSymbols=[{"src/lib/importScrub.js","export function scrubImportedTreasury"},
                                   {"tests/lib/importScrub.test.js","is REFERENCE-IDENTICAL when there is nothing to strip"}]
  EM-R0a [LANDED] changeManifest=[MODIFY tests/lib/editTravel.test.js]
--- CREATE rows on tests/ paths: 146   TEST rows on tests/ paths: 299 ---
```

⇒ **Collision group: NONE.** Every path is unreserved.

## E-SYM — `requiredSymbols` verbatim, and the POST-EDIT VALIDATION SIMULATED

Every row counted with `grep -c -F` at the read tip, then simulated against the packet's own edits:

| Path | Symbol | count now | present AFTER this packet's edits? |
|---|---|---:|---|
| `src/lib/importScrub.js` | `export function scrubImportedTreasury` | 1 | **YES** — untouched; the new function is appended after it |
| `src/lib/importScrub.js` | `export function scrubImportedConfig` | 1 | **YES** — untouched (also WF-1E's row: discharged) |
| `src/lib/importScrub.js` | `export function scrubGalleryImportLivingContent` | 1 | **YES** — untouched |
| `src/store/galleryImportSettlement.js` | `export async function importGallerySettlementImpl` | 1 | **YES** — only the import brace and the call expression change |
| `src/store/galleryImportMap.js` | `importGalleryMapWithCampaignImpl` | 1 | **YES** (also EST-A's row: discharged) |
| `src/lib/accountImport.js` | `export function prepareSettlementEntry` | 1 | **YES** (WEB-5's four rows sit at `:639` and beyond, untouched: discharged) |
| `src/domain/normalizeSettlement.js` | `export function normalizeSettlement` | 1 | **YES** — this packet forbids editing that file |
| `src/domain/edit/recordRegister.js` | `NOT_YET_WRITTEN_KEYS` | 1 | **YES** — untouched. ⚠ EM-C4a will have to MOVE `dmLayer` out of that frozen list and would then owe a `retiredSymbols` discharge for this row (§13 Q4) |
| `tests/lib/importScrub.test.js` | `is REFERENCE-IDENTICAL when there is nothing to strip` | **2** | **YES** — EM-B3a's row too; this packet appends a NEW `describe` and edits no existing title |
| `tests/lib/importScrub.test.js` | `ALL THREE import paths call it — the one-path-only shape store-4 was` | 1 | **YES** — A4 copies its SHAPE under a new, distinct title; the original is untouched |
| `tests/lib/editTravel.test.js` | `A7 — the three travel surfaces, executed end to end` | 1 | **YES** — A6 is appended beside it inside the same `describe`; no existing arm is edited |

**`retiredSymbols`: `[]`** — this packet moves, renames and deletes no symbol, so nothing is owed and nothing of another packet's is discharged. The list is an empty array, never `null`.

## E-SELF — the packet's own self-checks

```
JSON parses. id=EM-B3d status=DRAFT
retiredSymbols is an array of length 0 (never null): true
status rows matching parsePacketHeader's end-of-line anchor (must be exactly 1): 1 -> ["- **Status:** `DRAFT`"]
section 7 table paths (6): src/lib/importScrub.js, src/store/galleryImportSettlement.js,
                           src/store/galleryImportMap.js, src/lib/accountImport.js,
                           tests/lib/importScrub.test.js, tests/lib/editTravel.test.js
manifest paths      (6): (identical)
SET-EQUAL: true
every action in PACKET_ACTIONS (CREATE|DOC|MODIFY|REGISTER|TEST): true
acceptanceCases: 6 objects, all exactly {id, case}: true
checks: 8 argv arrays; any GENERATOR among them: false      (so §P2 row 12's ordering hazard does not arise)
```

The Status value stands ALONE on its line; every stamp lives on the continuation lines beneath it.

## E-END — the read tip at the lane's end

```
$ cd "$SP/read-tip-em-t7" && git rev-parse --short HEAD && git status --short
ee204c827
            <-- EMPTY
```
