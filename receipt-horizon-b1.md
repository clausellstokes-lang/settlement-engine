# RECEIPT — lane HORIZON-B1 (Opus 5, Fable-unvalidated) — CHARSET Car 2

## STATUS: COMPLETE for the seven cars listed. OWED items are itemised and none is silent.

Dock `$SC/laneCHARSET2`, verified on arrival: HEAD `df7cdd37e11bde8365c0322f0c882f61988865d5`,
`git status --porcelain` = 0 lines, detached, node_modules SYMLINKED (never materialised).
Final tip `3cd85c62c`, porcelain 0. Date 2026-09-05.

## The consist (seven cars, single-parent, each with `Seat: Opus 5 — Fable-unvalidated` + `Lane: HORIZON-B1`)

| sha | car |
|---|---|
| `756db8619` | the wiring at the AUTHORING chokepoints; the leaf is never statically imported |
| `b5fa47795` | the restore split (CS-9) — an import of the user's own export never asks the wall |
| `7126cfae2` | the proofs — the split measured, R4 named, the design's own fixture retired |
| `7f2ddce39` | one vocabulary — the six codes on all three surfaces; the edge re-mint refused with a measured reason |
| `86883755c` | the bill — the wiring walker's mutation-coverage row, earned by four executed plants |
| `14c9613a8` | the reachability proof — a sentinel census over TWO rendered dossiers |
| `3cd85c62c` | correction — the R7 census is ten of FOURTEEN, and four fields arrived, not five |

## ⛔ FIVE CORRECTIONS TO THE BRIEF / DESIGN (each measured, each load-bearing)

### C1. The design's charset ARITHMETIC is stale at this tip, and the brief repeats it
The brief describes Car 1's table as the design's `759 · 218 · 190`. MEASURED from the
generated artifact:

| surface | count | method |
|---|---|---|
| `web-display` / `foundry` / `json-export` | unbounded | `unbounded` |
| `dossier-pdf` | **759** | `fontkit-intersection` (8 inputs) |
| `campaign-pdf` | **776** | `embedded-roster-and-textpass` (5 inputs) |
| `world-book` | **776** | `embedded-roster-and-textpass` (5 inputs) |

`policy` = `{"enforcement":"report","nonLatin":"undecided","embeddedFont":"Lora"}`.
`|D ∩ S|` for `institutions.name` = **756**, not the design's 189.
CAUSE: `36d6e57fb` (§894, "the two paid books embed Lora"), which landed AFTER Car 1
(`4ae140102`). §1.11's own law — read the TABLE, never the literals — is what saved this
car: every arm written here reads the table.

### C2. `Kovačević` — the fixture the design AND the brief name for the restore split — is CLEAN
`validateCustomContentCharset('institutions', { name: 'Kovačević' })` returns **0
rejections**; so do `Uroš Hadžić` and `Über Ægis Hall`. A restore-split test written to the
brief's letter would have PASSED WITH THE WALL FULLY CONSULTED. The hostile fixture is
`Aurora 影 Provisioners` (`U+5F71`, uncovered on `dossier-pdf`), and an anti-vacuity arm
pins both readings so the day the table moves again the file says so.

### C3. R2's blast radius is WIDER than the design priced, and it changed the wiring shape
Car 0 probe 6's static half re-run (`$SC/hb1/probe-graph.mjs`, `@babel/parser` over **2,173**
src modules; EAGER set from vite's own `EAGER_FIRST_PAINT_MODULES` = **265**):

- entry-owned dynamic import targets: **92**; `|R|` (their transitive STATIC closure): **1,215**
- EAGER modules reaching the leaf: **0** — the zero-eager-bytes claim holds
- IN `R`, therefore equally dangerous: `customContentManifest.js` (14 static importers),
  `customContentCommands.js` (3), `contentPacks.js` (7), `customContentSliceRuntime.js`,
  `accountImportBody.js`, `CustomContentEditor.jsx`, `CustomContent.jsx`, `src/copy/en.js`

The design calls `customContentCommands.js` "lazy · 0 B". On R2's own mechanism it is not:
a static edge there lists the charset chunk in the ENTRY's `__vite__mapDeps` exactly as one
from the manifest would. CONSEQUENCE: **every** wiring edge is `import()` and the wall is
threaded as a VALUE (`options.charset`). Pinned: zero static importers of the leaf under
`src/`, exactly one dynamic importer.

### C4. A lifecycle path the design's chokepoint table omits
The account-export pack plan is applied through `applyCustomContentCommand` — the SAME
command lane the Compendium save uses — so `admissionFor` (design: "Compendium save, YES")
is ON THE RESTORE PATH. `previewCustomContentCommand` then re-derives
`prepareContentPackImport(manifest)` for the pack IDENTITY check: a second place a lit wall
could refuse a restore, and one that would ALSO break if the two derivations disagreed.
Both are covered — `isAuthoringContentSource(source)` gates the wall build, and the identity
re-derivation passes `authoring: false` explicitly.

### C5. My own written prediction was wrong once, and the measurement overturned it
The interim receipt predicted "no `mutationCoverageManifest` rationale row". `tests/lint` IS
an ENFORCER dir; the row was owed and is now paid. `tests/lib` and `tests/pdf` were NOT
flagged — measured, not assumed.

## Car 0's probes, re-run (their logs died with the old scratch dir)

| probe | design expectation | MEASURED at the dock | log |
|---|---|---|---|
| 1 — jsPDF runtime WinAnsi table | present, `|W|`=27, `W[U+20AC]`=128, `|C|`=218 | `metadata.Unicode` PRESENT, helvetica bound `codePages,WinAnsiEncoding`; **27**; **128**; `W ∩ ({20..7E}∪{A0..FF})` = **0**; `|C|` = **218**; jspdf **4.2.1** | `$SC/hb1/logs/probe1.log` |
| 2 — the compiler's fontkit derivation | `--check` green, 759 | TRUE_EXIT **0**, "custom-content manifest artifacts are current"; `dossier-pdf` **759** via `fontkit-intersection` over 8 inputs; the 8 inputs equal the `public/fonts` listing (asserted in the new render test) | `probe2-compiler-check.log`, `probe2-table.log` |
| 4 — OSR (R8) | 2 content files in scan, 0 findings | `npm run check:observed-shape-readers` TRUE_EXIT **0**, "**1993 finding(s), exactly matching the frozen inventory**" — byte-identical to Car 0's reading | `$SC/hb1/logs/osr.log` |
| 6 — the static half | 5 entry-owned chains | **92** targets, `|R|`=**1,215**, EAGER→leaf **0** (see C3) | — |

R1 stays RETIRED. No §8.5 STOP fired.

## The wiring table

| site | what runs | how the leaf is reached |
|---|---|---|
| `customContentManifest.js` `loadCustomContentCharsetWall()` | builds the wall; optional table override so `refuse` is provable without lighting the door | `import('./customContentCharset.js')` — THE ONLY EDGE IN `src/` |
| `customContentManifest.js` `admitCustomContentDefinition` | honours `options.charset`; `report` → `charset` + `charsetMarks` beside; `refuse` → `ok:false` + one house-shaped error per finding | the wall value |
| `customContentManifest.js` `admitAuthoredCustomContentDefinition` | the async authoring adapter | the loader |
| `customContentManifest.js` `isAuthoringContentSource` | `RESTORE_CONTENT_SOURCE_TYPES = ['account-export']` | — |
| `customContentCommands.js` `normalizeEntry` | under `refuse` throws the typed refusal `{ code, field, char, surface, hint }`; its MESSAGE is the house `entries[i].field: code` idiom and nothing more, because `customContentError` renders RAW in the sync banner | `options.charset` |
| `customContentCommands.js` `previewCustomContentCommand` | the pack IDENTITY re-derivation runs `authoring: false` | — |
| `customContentSliceRuntime.js` `admissionFor` | takes the wall; charset never touches `ok` under `report` | wall built once per command |
| `customContentSliceRuntime.js` `applyCustomContentCommand` | builds a wall only on an authoring source; publishes `state.customContentCharsetRejections` | `import('../domain/content/customContentManifest.js')` |
| `contentPacks.js` `prepareImport` / `defaultItemValidation` | `options.authoring` (default TRUE — a forgotten option gives you the wall, never the hole); the wall is dropped on a restore lane; `diagnostics.authoring` records which law ran | never imports the leaf |
| `ContentPackBar.jsx` (foreign shared pack) | `authoring: true` + a loaded wall | the loader |
| `accountImportBody.js` (own export) | `authoring: false`, no wall built | — |
| `en.js` | `errors.customContentCharset.{6 codes, normalise, asciiPreview}` + `.surface.{6 product nouns}` | — |
| `customContentEditorCopy.js` | `CUSTOM_CONTENT_CHARSET_HINTS` keyed by code, `CUSTOM_CONTENT_CHARSET_SURFACE_KEY` | — |
| `CustomContentEditor.jsx` | `CharsetFieldRejections` under the `FIELD_HINTS` slot, `role="alert"`, Normalise through the `Button` primitive (draft-only rewrite, offered only where the leaf measured `nfcWouldPass`) | — |
| `CustomContent.jsx` | reads the transient, passes it to the editor | — |
| `aiOutputSchema.js` / `aiCharter.js` / `customContentCore.ts` | `CONTENT_UNSUPPORTED_REASONS` 4 → 10; the charter's rendered line; the edge OUTPUT CONTRACT prompt; `CONTENT_REPAIRABLE_REASONS` gains all six (every charset verdict is field-level) | — |

R11: `customContentCharsetRejections` is cleared at ALL SEVEN `customContentError = null`
sites plus the initial state, pinned by a paired-count arm. It is absent from
`partializeStoreState` (which persists only config/toggles/displayPrefs/advanceAutoResolve)
and from the `sf_custom_content*` local mirror (which writes `customContent` alone).

## The restore-split proof, in one line
A wall whose `validate()` THROWS, handed to both lanes: the restore lane imports all three
entries and never throws, while the SAME wall on the authoring lane does throw — so the
restore lane did not consult the wall rather than consulting a forgiving one.

## The reachability table (R7)
Method: a unique ASCII sentinel in each of the 41 classified free-text fields of the
reference pack (40 injected; `factions.rivals` absent from the pack; none skipped for a
closed vocabulary or a length cap), TWO dossiers rendered
(metropolis/mediterranean/coastal/port `charset-reach-a`; city/norse/river/crossroads
`charset-reach-b`), sentinels read back from the rendered element trees. The two worlds
agreed exactly.

| direction | verdict |
|---|---|
| REACHED but NOT declared `dossier-pdf` | **none** — asserted hard; there is no hole in the wall |
| DECLARED `dossier-pdf` but reached NEITHER dossier | **10 of 14** — pinned as a measured census and REPORTED |

The ten: `deities.domain`, `deities.name`, `institutions.tags`, `resources.description`,
`services.description`, `services.name`, `tradeGoods.description`, `tradeGoods.name`,
`traditions.epithet`, `traditions.name`. The FOUR that arrived: `institutions.name`,
`institutions.category`, `institutions.description`, `resources.name`.

⚠ SELF-CORRECTION, recorded rather than tidied away: car `14c9613a8`'s body and docblock said
"ten of fifteen" and named five arrivals. The declared set is FOURTEEN and the arrivals are
FOUR, derived by executing the declaration filter over the generated table. `3cd85c62c`
corrects the docblock; the commit body of `14c9613a8` cannot be amended and stands wrong on
that one figure. No assertion moved -- `DECLARED_NOT_REACHED` already held exactly the ten
measured rows.

⚠ **This is a REPORT, not a manifest edit.** The instrument cannot separate an
over-declaration from a reference entry that was never adopted into either world; telling
them apart wants WRWALKER's executed `surfaceClassesOf`, which is not in this tree. Editing
the manifest on this evidence would LOOSEN the wall on a paid surface. The design priced R7
at "40 % on 1–3 rows"; the measurement says ten.

## Plants — five, each RED BY NAME, each restored by inverse edit and cmp-verified

| plant | arm reddened | exit |
|---|---|---|
| `accountImportBody.js` loses `authoring: false` | 'the account-import pack lane asks prepareImport for a restore' | 1 (1 failed / 14) |
| `contentPacks.js` stops dropping the wall on a restore | THREE arms including 'the restore lane never CONSULTS the wall, proved by a wall that explodes' | 1 (3 failed / 4) |
| a STATIC import of the leaf in `customContentManifest.js` | 'no file under src/ statically imports the leaf or its generated table' | 1 (1 failed / 7) |
| one paired `customContentCharsetRejections = []` deleted | 'every customContentError clear clears the charset list beside it' | 1 (1 failed / 7) |
| `validateCustomContentCharset` stubbed to find nothing | 'HOSTILE: the wall names exactly the four codepoints the dossier cannot draw' | 1 (1 failed / 6) |

Every restore verified with `cmp` against a backup taken BEFORE the plant; porcelain 0 after
each. The four wiring plants are written into the mutation-coverage rationale row with their
exit codes, so the walker's catching power is recorded rather than asserted.

## Executed receipts (every exit captured in-shell)

| gate | TRUE_EXIT | reading |
|---|---|---|
| `npx vitest run` the 4 charset files (first proof car) | **0** | 4 files / 54 tests |
| `npx vitest run` the 11-file charset + consumer set | **0** | 11 files / 148 tests |
| `npx vitest run tests/domain/customContent*.test.js` (15) | **0** | 294 tests |
| `npx vitest run` store/lib customContent + contentPacks + accountImport (21) | **0** | 163 tests |
| `npx vitest run tests/pdf/customContentGlyphReach.test.js` | **0** | 7/7, inside the 120 s budget, no arm raised |
| `npx vitest run tests/lint/` WHOLE at the committed tip `86883755c` | **1** | 2 failed / 2137 passed — BOTH attributed below |
| `npx vitest run tests/copy/` WHOLE at the same tip | **1** | 4 failed / 117 passed — attributed below |
| `npm run typecheck:domain:strict` | **0** | 1120 errors, ceiling 1120, UNCHANGED (red once at +3/+3, cured, re-measured) |
| `npm run lint` (src/ tests/ scripts/) | **0** | 0 errors, 31 pre-existing warnings |
| `npm run check:observed-shape-readers` | **0** | 1993 findings, exactly the frozen inventory |
| `node scripts/generate-custom-content-manifest.mjs --check` | **0** | artifacts current — no generated file was hand-edited |
| `npx vitest run tests/lint/mutationCoverageManifest.test.js` | **0** | 10/10 after the rationale row |

Every vitest run went through `sh scripts/gate-mutex.sh --run --` under the quiet-window law
(three consecutive 60 s probes: load1 **3.21 / 2.22 / 1.98**, zero vitest workers).

### Whole-directory reds, attributed
- `tests/lint/clampPrimitiveBaseline.test.js` — BASE. Identical reading before and after my
  cars (`expected [ …(62) ] to deeply equal [ …(72) ]`); this lane touched no clamp.
- `tests/lint/sovereigntyLightingContract.walker.test.js` — **MINE, and a REGISTER act**:
  `expected 2524 to be 2521`, i.e. the tree measures 2524 against a banked 2521. +3 = my
  three new test files. The chair takes the refreeze.
- `tests/copy/voiceMechanics.test.js` (4 arms) — BASE. `expected 770 to be <= 670` and
  `expected 37 to be <= 6`, identical before and after; NOT ONE of my touched files appears
  in either per-file list, and both arms are exact-match per file.
- `mutationCoverageManifest` was mine and is now GREEN.

## Register deltas — PREDICTED IN WRITING, before the chair's instruments run
- lighting census `files` **2521 → 2524** (+3) — MEASURED by the walker, not predicted.
- `parked` **371 → 371** (+0): none of the three new files is `describe.runIf`-gated.
- `credited` **2150 → 2153** (+3); the arithmetic `parked + credited = files` closes.
- `titles` **23184 → 23208** (+24) and `suiteTitles` **6214 → 6222** (+8), derived by count:
  wiring 8 `it` / 3 `describe`, restore-split 7 / 1, glyphReach 7 / 3, admission +2 / +1.
  ⚠ these two are DERIVED, not executed — the walker's own figures print only after the
  file-count arm passes, and a probe that inserted a `console.log` before it did not reach
  the line. The chair's refreeze measures them; treat +24/+8 as PLAUSIBLE, +3/+0/+3 as CONFIRMED.
- `mutationCoverageManifest`: one `rationale` row added; `uncoveredBaseline` stays **186**;
  invariants 658 → 659.
- `domain-strict`: **1120**, ceiling 1120, unchanged.
- `sizeBaseline`: no touched src file approaches 800 lines. `CustomContentEditor.jsx` 616 and
  `CustomContent.jsx` 636 TOTAL lines, both under eslint's 600 EFFECTIVE ceiling (green).
- no `package.json` byte; no generated artifact regenerated; no golden touched; no seed moved.

## OWED — none of it silent
1. **The edge-shared re-mint (CHAIR).** `aiCharterBundle.freshness`,
   `aiOutputSchemaBundle.freshness` and `edgeSharedBundleReproducibility` are RED: 4 failed
   at `7126cfae2` (before the vocabulary car — MEASURED by reverting the vocabulary, running,
   and restoring from backup with cmp), 8 failed after it. Cause: `customContentManifest.js`
   is one of the 112/113 recorded inputs of both bundles. ⛔ THIS LANE CANNOT MINT IT: with
   this dock's symlinked node_modules, `npm run build:edge-shared` (TRUE_EXIT 0) rewrote nine
   `node_modules/immer|seedrandom/...` input rows as
   `../../../../../../../Users/cstokes/Desktop/settlement-engine/node_modules/...`, which
   would commit the owner's home path into a shared artifact. Reverted and byte-verified
   against HEAD; the bad mint is kept at `$SC/hb1/backup-badmint/` for comparison. The memory
   row's sequence (materialise immer+seedrandom → build → commit → RESTORE the symlinks) is
   a chair act. NOTE: the re-minted meta also gained
   `src/domain/content/customContentCharset.{js,generated.js}` as bundle inputs — the edge
   bundles will now inline the leaf and its table (~17 KB, Deno side only, no first paint).
2. **The lighting-census refreeze (CHAIR):** `2521 → 2524` at minimum; see the deltas above.
3. **The edge `validValue` charset branch — DELIBERATELY DEFERRED, RECORDED, not a bug to
   re-find.** The vocabularies are widened on all three surfaces, but `customContentCore.ts`
   does not yet RETURN a charset code. Implementing it needs either a second implementation
   of the leaf's protocol in TypeScript — a detector fork the estate forbids by its own hoist
   law (`codeOnlySource.js:9-18`) — or a new `build:edge-shared` ENTRIES row producing a
   `customContentCharsetBundle.js`, which is a NEW generated artifact plus a new freshness
   register: a chair/owner act, not a lane's. Under `report` the branch would be dormant
   anyway. Recommend it as the lighting wave's edge car, sequenced with the one re-mint.
4. **The build (CHAIR):** the eight closure chunks byte- and hash-identical, and the ENTRY's
   `__vite__mapDeps` array diffed BY FILENAME. This lane's fence forbade a build; the static
   graph says the answer should be "unchanged" (zero static importers of the leaf), and that
   is a PREDICTION the build must settle.
5. **`tests/docs/` whole** was not run (the design's per-car bill names it). No doc counts
   moved and no migration landed, so no red is predicted — unverified.
6. **`docs/CUSTOM_CONTENT_PROMOTION_CONTRACT.json` / the architecture table row `CC-CHARSET`**
   were NOT touched: `customContentPromotionContract.test.js` passes today and the contract
   row belongs with the lighting act rather than the dark wiring. Recorded as an open item.

## RETROVALIDATION ROW (for the Fable chair)

| # | what was JUDGED (Opus 5, unvalidated) | what the chair must RE-DERIVE | receipts | priority |
|---|---|---|---|---|
| 1 | Every wiring edge to the leaf is `import()`, and the wall is threaded as `options.charset` rather than imported at each site — a DEVIATION from §8.2, which has `customContentCommands.js` importing the leaf directly | that `|R|` = 1,215 really contains `customContentCommands.js` and `contentPacks.js`, i.e. that the deviation is forced rather than stylistic | `$SC/hb1/probe-graph.mjs`; `tests/lint/customContentCharsetWiring.test.js` | ⭐⭐ HIGH — it shapes the whole car |
| 2 | The restore lane does not produce `charset_legacy` MARKS, contrary to §1.11's ruling text: the brief's stronger law ("the wall never consulted", provable by a static pin) was implemented instead. Producing marks requires consulting the wall on the restore path, which contradicts the pin the brief demands | which law the owner wants: silent-blind restore (implemented) or blind-with-marks | `tests/lib/customContentCharsetRestoreSplit.test.js`; `src/lib/contentPacks.js` | ⭐⭐ HIGH — an owner-visible product behaviour |
| 3 | The 10-row R7 census is REPORTED, not acted on; no manifest edit was made | whether any of the ten is a real over-declaration (needs WRWALKER's `surfaceClassesOf`) | `tests/pdf/customContentGlyphReach.test.js`, `$SC/hb1/logs/vitest-reach2.log` | ⭐ MEDIUM — a manifest edit for the owner's desk |
| 4 | The charset codes were added to the AI OUTPUT SCHEMA and the charter prompt while the wall that produces them is dark — a paid-surface model-contract change landing dormant | whether a dark vocabulary widening is wanted before the lighting wave, given it invalidates the cached prompt prefix | `7f2ddce39`; `tests/domain/aiOutputSchema.test.js` + `aiCharter.test.js` both PASS | ⭐ MEDIUM |
| 5 | The typed refusal's MESSAGE is the house `entries[i].field: code` idiom rather than a copy-key render, to satisfy ⟦A57 L7⟧ ("no `U+`, no surface class token" in the raw sync banner) without putting prose in a domain module | whether the banner should instead render from `customContentCharsetRejections` | `src/domain/content/customContentCommands.js` `charsetRefusal` | MEDIUM |
| 6 | `en.js`'s surface nouns are CAPITALISED ("The dossier PDF") where ⟦A57 L7⟧ writes them lowercase, because the only interpolation site is sentence-initial | the wording, if the map gains a second, mid-sentence consumer | `src/copy/en.js` | LOW |
| 7 | Predicted `titles +24` / `suiteTitles +8` are DERIVED by counting, not executed | the refreeze measures them | this receipt | LOW, but do not quote them as measured |
