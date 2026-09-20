# COMPILE REPORT — EM-B3d (Opus COMPILE lane `COMPILE-EM-B3d`, 2026-09-20)

## Outcome

**DRAFT — READY-able in one pass, subject to Q1 (blocking).** The packet, its manifest and its evidence are compiled to the estate's standard against the read tip `ee204c827`. Every contract is measured; no premise is refuted; nothing is adjudicated by this lane. **One thing only stands between this DRAFT and dispatch: the packet's honest shape is 4 modified production files against the standard's cap of 3, and a budget override (or the chair's narrower rule) must be recorded before dispatch.** Every other question below carries a recommendation and is non-blocking.

## Files (all in this lane's scratch; nothing was written anywhere else)

- `$SP/lane-em-compile-EM-B3d-scratch/EM-B3d.md`
- `$SP/lane-em-compile-EM-B3d-scratch/EM-B3d.manifest.json`
- `$SP/lane-em-compile-EM-B3d-scratch/EM-B3d.evidence.md`
- `$SP/lane-em-compile-EM-B3d-scratch/EM-B3d.compile.report.md` (this file)

Read tip: `ee204c827fa525327206e7427ad77e1e3526912f`; `git status --short` EMPTY at start (14:40:46 EDT) and at end (15:05:47 EDT). Preamble measured `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675` — matches the chair's stamp, so the launch's STOP did not fire.

## The finding that changes the packet's standing

**`tests/lib/editTravel.test.js` claims an import arm it does not execute.** Design §12 item 4 — the governing ruling — reads *"the travel instrument is a RUNTIME test that a fork, an **import** and the gallery projection carry neither key, not a static walker"*, and the suite's own docblock repeats it (*"not into a fork, not into an import, not into the gallery projection"*). Its A7 executes **(i) fork, (ii) backup export, (iii) realm snapshot** — there is no import arm. EM-B3a discharged the import row of its lifecycle table by REASONING, which was correct and is not a runtime proof of a surface the design names.

⇒ EM-B3d is **not only defense in depth**: it builds the strip K4 deferred *and* the one runtime arm the design's ruling names and the instrument lacks. Nothing in EM-B3a is reopened — K4 said the strip was deferred, not wrong.

## The measurements, with their commands

Full commands and outputs are in `EM-B3d.evidence.md` under the cited section.

| # | Measurement | Result | Where |
|---|---|---|---|
| 1 | `scrubImportedTreasury`'s body, contract and doc | read whole; `Object.hasOwn` guard + destructure-drop; **reference-identical** on every no-op path, stated in its own docblock | E-SCRUB |
| 2 | The three call sites, BY SYMBOL | `galleryImportSettlement.js:71` · `galleryImportMap.js:290` · `accountImport.js:617`, each quoted with its length (91 / 95 / 44 chars); no `max-len` rule exists | E-SITE |
| 3 | **A FOURTH import path?** | **NONE.** Denominator `git grep -n "scrubImportedTreasury" -- src` = 8 lines (1 def, 1 doc, 3 imports, 3 calls). `importReconciliationAdmission.js:684` and `accountImportBody.js:414` both route through `prepareSettlementEntry`; `campaignImport.js` imports table EVENTS; every other `savesService.save` writes a LOCAL settlement | E-DENOM |
| 4 | Every writer/reader of the two keys in `src/` | 14 files; **one** reader of `settlement.decrees` (`personaSlicer.js:172`), **zero** of `settlement.dmLayer` outside EM-B3a's veils; `decreeTracker.js`'s 22 hits are a pulse-advance derivation, not the key | E-KEYS |
| 5 | Can any shipped path put either key on an import today? | **NO** — and it is now declared, not only measured: EM-R0a landed `recordRegister.js`'s `NOT_YET_WRITTEN_KEYS = Object.freeze(['dmLayer','decrees','crossSettlementConflicts'])` | E-KEYS |
| 6 | Observed-shape register, plain | `node scripts/check-observed-shape-readers.mjs` → **`exit 0`** (captured from the command, never a pipe), *"1964 finding(s), exactly matching the frozen inventory"* | E-OSR |
| 7 | ⭐ **Both spellings, measured on scratch copies** | see below | E-SPELL |
| 8 | Which arms this packet extends / leaves | extends `tests/lib/importScrub.test.js` (4 new `it`s in 1 new `describe`) and `tests/lib/editTravel.test.js` (1 new `test` in the EXISTING second `describe`); **leaves every existing arm untouched** | E-SCRUB, E-REG |
| 9 | Byte budgets | **reaches NONE** — see below | E-BUD |
| 10 | Lighting delta | `files +0 · parked +0 · credited +0 · titles +5 · suiteTitles +1` | E-REG |
| 11 | Mutation coverage | **zero rows owed on BOTH arms** | E-REG |
| 12 | `tests/security` governance | **not owed** — no arm lands there | — |

### 7 — the spelling measurement (this is where the register's whole cost lives)

The detector counts a read **only** at `ts.isPropertyAccessExpression`, and `isWriteTarget` excludes `ts.isDeleteExpression`. Three candidates were written to scratch and parsed with the tree's own TypeScript 6.0.3:

| Spelling | `dmLayer`/`decrees` property accesses | Register cost | Reference-identical |
|---|---:|---|---|
| **A — `Object.hasOwn` guard + destructure-drop (CONTRACTED)** | **0** | **ZERO rows** | **yes** |
| B — `settlement.dmLayer === undefined` guard | 2 | would MINT `dmLayer on settlement` + `decrees on settlement` — the chair's migration-bundle door | yes |
| C — `delete clone.<key>` after an unconditional spread | 2, both `isWriteTarget` ⇒ 0 counted | zero rows | **no** — moves every import's bytes |

Two live controls, executed in the tree rather than reasoned: `src/lib/importScrub.js` destructure-drops eight keys and carries **zero** inventory rows while four of those same keys convict as property reads elsewhere (`_seed on config`, `primaryDeitySnapshot on config`, `cultDeitySnapshots on config`, `decrees on settlement`); and `publicSafe.js` carries only `{"covert on settlement":1}` although EM-B3a landed `delete clone.dmLayer; delete clone.decrees;` in it. Measurement was on scratch copies; the read tip was never edited.

Also measured, and worth the chair's note: the register's three file manifests (`scanTree`, `sourceTree`, `executionTree`) are a **frozen genesis record, not a live gate** — `publicSafe.js`, `worldSnapshotPublic.js` and `accountData.js` all read DRIFTED from their recorded sha and `recordRegister.js` is absent from all three, yet the scan exits 0.

### 9 — the budget table

| Budget | Bound at the tip | Reached? |
|---|---|---|
| First-paint eager closure | `EAGER_FIRST_PAINT_MODULES` imported live — **269** modules (EM-B3a's 268 has moved) | **NO** — all four `NOT-EAGER` |
| Generation worker | `WORKER_BUNDLE_CEILING_BYTES = 1401208` (re-minted 2026-09-18; EM-B3a's quoted 1401128 is stale) | **NO** — none in the **220**-module closure |
| Lazy engine chunk | `< 679_000`; rule `id.includes('/src/generators/')` + `/src/data/narrativeData.js` | **NO** |
| Edge-shared bundles | the five metas' own `inputs` (114/74/115/2/2) | **NO** — zero hits |
| *(receipts, not budgets)* | `townSceneExport.worker` 125 modules; `advanceInterval.worker` 549 modules | **NO** to both |

⇒ no ceiling TEST row, no byte bound, no re-mint, no `build:edge-shared`. No generator is among the packet's `checks`, so §P2 row 12's ordering hazard does not arise.

### The scope budget, and the one overrun

| Row | Cap | This packet |
|---|---:|---:|
| Behaviour families | 1 | 1 |
| New logic leaves | ≤2 | **0** |
| **Existing logic-bearing production files modified** | **≤3** | **4** ⚠ |
| **Direct production consumers** | **≤2** | **3** ⚠ |
| Handwritten files | ≤12 | 6 |
| New/changed effective production lines | ≤400 | **16** |
| Acceptance cases | ≤8 | 6 |

Effective lines under eslint's own `Linter`: `importScrub.js` 39/800, `galleryImportSettlement.js` 52/800, `galleryImportMap.js` 311/800, `accountImport.js` 379/800. **No hot file, no per-file `max-lines` override, no size-baseline entry.** Tightest headroom 421 lines.

## `requiredSymbols`, with the post-edit validation simulated per row

All eleven rows verified verbatim with `grep -c -F` at the read tip, and every one survives this packet's own edits. `retiredSymbols` is `[]` (an array, never `null`).

| Path | Symbol | now | after |
|---|---|---:|---|
| `src/lib/importScrub.js` | `export function scrubImportedTreasury` | 1 | YES |
| `src/lib/importScrub.js` | `export function scrubImportedConfig` | 1 | YES (discharges WF-1E) |
| `src/lib/importScrub.js` | `export function scrubGalleryImportLivingContent` | 1 | YES |
| `src/store/galleryImportSettlement.js` | `export async function importGallerySettlementImpl` | 1 | YES |
| `src/store/galleryImportMap.js` | `importGalleryMapWithCampaignImpl` | 1 | YES (discharges EST-A) |
| `src/lib/accountImport.js` | `export function prepareSettlementEntry` | 1 | YES (WEB-5's four rows untouched) |
| `src/domain/normalizeSettlement.js` | `export function normalizeSettlement` | 1 | YES (edits forbidden) |
| `src/domain/edit/recordRegister.js` | `NOT_YET_WRITTEN_KEYS` | 1 | YES ⚠ EM-C4a would owe the discharge — Q4 |
| `tests/lib/importScrub.test.js` | `is REFERENCE-IDENTICAL when there is nothing to strip` | 2 | YES (EM-B3a's row too) |
| `tests/lib/importScrub.test.js` | `ALL THREE import paths call it — the one-path-only shape store-4 was` | 1 | YES |
| `tests/lib/editTravel.test.js` | `A7 — the three travel surfaces, executed end to end` | 1 | YES |

**Collision group: NONE.** 195 packets, 193 LANDED + 2 SUPERSEDED — **zero non-terminal packets exist**, so no sibling reserves any path.

Self-checks: the §7 table and the JSON `changeManifest` are **SET-EQUAL** on all six paths; every action is in `PACKET_ACTIONS`; `acceptanceCases` are six `{id, case}` objects; the Status value stands ALONE on its line (exactly one row matches `parsePacketHeader`'s end-of-line anchor).

## Two coding constraints that are contracts, not style

1. **`src/lib/importScrub.js`: the new function is APPENDED AT THE END.** Three live `path:line` citations address `importScrub.js:115-121` and `:158-166` (`importReconciliationAdmission.js:442` and `:549`, `tests/lib/importReconciliation.test.js:604`). Appending keeps them correct to within the docblock's one line; an insertion in the middle moves them by the size of the function.
2. **`src/store/galleryImportSettlement.js`: NET ZERO LINES.** Four live citations address `galleryImportSettlement.js:76` (`composeStateProse.test.js:319`, `stateProseKernel.test.js:612`, `dossierProseManifest.test.js:30` and `:522`), five lines below the call site this packet edits. The new name goes on an EXISTING import line (the estate already spells two names on one line at `accountImport.js:58`) and the call is wrapped in place, so `:76` does not move. Measured: the citation walker's ARM 1 is **past-EOF only**, so a shift reds nothing — it just makes four citations wrong for free, and free is the wrong price.

Also contracted: `tests/lib/importScrub.test.js`'s existing un-anchored `expect(out).not.toHaveProperty(stripped)` at `:42` is **left exactly as it is** — its `FROZEN_UNANCHORED_NEGATIVES` ceiling of 1 reds on a *shrink*, and that register is outside this manifest.

## Questions for the chair (four, each with the lane's recommendation)

**Q1 — THE BUDGET OVERRIDE. BLOCKING.** 4 modified production files against a cap of 3; 3 direct consumers against a cap of 2. Both have one cause: the module's own law is *"ALL THREE import paths … route their scrub through here … (store-4: cultDeitySnapshots was missed by both hand-maintained strips)"*, so 1 definition + 3 call sites is the floor, and a two-of-three split would deliberately land the exact defect the module exists to prevent. **Recommend: APPROVE the override** (`3 → 4` and `2 → 3`), recorded in §3 before dispatch — the standard already provides for *"an explicitly approved larger budget"*. Narrower alternative, if the chair prefers a rule: mint a **CALL-SITE row class**, the sibling of §P2 row 14's ADDRESSES-ONLY CITATION row, for a production file whose only edit is a one-token functional wrap of an existing expression at an existing seam (zero branches, zero statements, zero effective lines). That puts this packet inside every cap and serves every future strip at a shared seam — but minting a budget class is the chair's act, not a lane's.

**Q2 — THE THREE CITATIONS INTO `importScrub.js`.** Amending the docblock from THREE STRIPS to FOUR costs a net `+1` raw line and makes three live citations wrong by one. No gate reds (past-EOF only). **Recommend: carry `src/lib/importReconciliationAdmission.js` as an ADDRESSES-ONLY CITATION row (outside the logic cap, per §P2 row 14) and `tests/lib/importReconciliation.test.js` as a comment-only TEST row, re-addressing all three.** A module whose header undercounts its own exports is the drift that header exists to prevent; the re-address is one token per row and costs no cap.

**Q3 — IS THE HONEST HOME A DIFFERENT SEAM?** The launch asked explicitly. **Measured answer: no**, and the lane improvised no second shape. The only place all three paths already meet is `normalizeSettlement` — which also runs on every LOAD and SAVE, so a drop there would erase the DM's own edits from their own saves. `prepareSettlementEntry` covers the account file, the reconciliation session and `accountImportBody`, but neither gallery path. **Recommend the contracted shape: one function beside `scrubImportedTreasury`, called at the same three seams.**

**Q4 — SHOULD `NOT_YET_WRITTEN_KEYS` BE A `requiredSymbols` ROW?** It is included, so that a silent removal of either key from that frozen list is visible to the sealed dispatch. The cost: **EM-C4a, the first writer of `dmLayer`, must move that key out of the list and would then owe a `retiredSymbols` discharge.** **Recommend: KEEP the row and tell EM-C4a's compile it owes the discharge** (C4a is editing that file anyway). If the chair would rather keep C4a clean, drop it — nothing in this packet's correctness rests on it and the fact stays recorded in §5 with its command.

## ⛔ Everything noticed and not touched — each specific enough to slot (the owner's law: there is never deferred work)

1. **`tests/lib/editTravel.test.js`'s docblock names four travel surfaces and its body executes three.** EM-B3d closes this instance (A6). **The CLASS is unslotted:** a suite header that claims a surface its body never drives is invisible to every gate. *Proposed fate — a TOOLING slot: a walker, or a convention, that pairs a suite docblock's enumerated surfaces with its executed arms. The chair rules whether this is work or is CLOSED as not worth a walker.*
2. **`tests/lint/sourceCitationIntegrity` ARM 1 is a PAST-EOF arm only.** A citation that has drifted to the *wrong line* but not past EOF is invisible to every gate in the estate; ARM 3 (the symbol arm) is report-only and reaches **5.6 %** of live-code citations. Two coding constraints above exist purely because no gate would catch the drift. *Proposed fate — an OWNER'S/CHAIR'S DECISION POINT at the next tooling window: is a line-content citation check wanted, or is the drift accepted and recorded?*
3. **EM-B3a's §7 quotes `WORKER_BUNDLE_CEILING_BYTES = 1401128` and a 268-module first-paint closure; both are stale at this tip** (**1401208**, re-minted 2026-09-18; **269** modules). A LANDED packet is a record and is annotated, never rewritten — recorded here so the next compile does not copy either figure. *Proposed fate — CLOSED, not work: the figures are measured fresh at every pre-proof by law.*
4. **The observed-shape baseline's three file manifests are frozen at `31ab5d18b` and are not a live gate** — three of EM-B3a's own change paths read DRIFTED and `src/domain/edit/recordRegister.js` is absent from all three, while the scan exits 0. This is by design (the identity check is the inventory, not the shas), but it is not written down anywhere a lane would find it, and this lane spent a measurement discovering it. *Proposed fate — a MEMORY/hazard row, not code.*
5. **`src/domain/display/decreeTracker.js` and `src/components/map/AdvanceReport.jsx` use the identifier `decrees` for a pulse-advance derivation, 33 hits, entirely unrelated to `settlement.decrees`.** Any future grep-led audit of the editor keys will re-find them. *Proposed fate — CLOSED with reason, recorded in EM-B3d §5 so the next reader does not re-find it as new.*
6. **`src/domain/ai/personaSlicer.js:172` reads `home?.appliedDecrees || home?.decrees` — the estate's ONE reader of `settlement.decrees`, and it predates the editor.** It is already a convicted observed-shape row (`decrees on settlement: 1`, `appliedDecrees on settlement: 1`). When EM-C1 makes `decrees` a real registry, that slicer will read the DM's staged orders into an AI persona slice. Not this packet's to touch, and **not obviously right**. *Proposed fate — a named line in EM-C1's compile: does the persona slicer read PENDING decrees, APPLIED decrees, or neither?*
7. **`scripts/mutation-coverage-manifest.json` was reserved by EM-P2 when EM-B3a compiled; at this tip there are ZERO non-terminal packets, so nothing is reserved by anyone.** Recorded because "reserved by a non-terminal packet" is a claim with a short shelf life and two packets have now quoted it. *Proposed fate — CLOSED, not work.*

Every claim in this report is **CONFIRMED** (an executed command, quoted in `EM-B3d.evidence.md`) except one, which is marked **PLAUSIBLE** and named as owed: whether `tests/lib/importScrub.test.js` and `tests/lib/editTravel.test.js` are CREDITED rather than PARKED in the lighting census. `parkReasonsFor` lives inside a vitest test module with no non-vitest entry point, so this lane could not execute it and does not claim to have. Both files read as credited by structure (openers imported from `'vitest'`, straight-line literal registration, no rebinding of `it`/`test`/`describe`), and the `titles +5 · suiteTitles +1` prediction rests on that. **The pre-proof lane prints `parkReasonsFor` for both files and confirms or corrects those two figures**; if either parks, its titles are `+0` and the park reason is the finding.
