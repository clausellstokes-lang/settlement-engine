# Settlement editor / train EM-T7 — EM-B3d: the import scrub strips the two editor keys — a settlement-level drop of `dmLayer` and `decrees` in `src/lib/importScrub.js`, beside `scrubImportedTreasury`, on all three import paths, with the RUNTIME import arm design §12 item 4 names and `tests/lib/editTravel.test.js` does not yet carry

- **Status:** `LANDED`
  - Compiled 2026-09-20 by an Opus COMPILE lane (lane COMPILE-EM-B3d) at the read tip `ee204c827fa525327206e7427ad77e1e3526912f`, against the chair's launch ruling on the shape. READY-able in one pass subject to the four §13 questions — **Q1 (the budget override) must be answered before dispatch**, because the packet's own §3 is over the standard's cap until the chair rules.
- **Landed at:** `429141e2d1c21cb5ee9dd5005ed1a77bbc9b3cd8` — the thirteenth landing — 6 files (+253/−12): `scrubImportedEditState` beside `scrubImportedTreasury` in `src/lib/importScrub.js`, its three call sites changed in place, five `it`s and one `test`. TRAIN EM-T8, THE PROBE: the first packet sealed and built on ITS OWN LANE BRANCH, `em-t8-b3d-2026-09-21` (two clean seals; its one STOP was a count contradiction between prose and capsule, cured as packet version 5). Its sealed proofs ran through the chair's queue (red-firsts red by name and restored byte-identical, the fourteen §10 commands, `tests/lint` whole, `check:packet` and `implementation:resume`, every exit as expected); the fourteenth lighting refreeze `5cc0b84a9` measured titles +6 and suiteTitles +1 for this member. The verifier's seat: 0 STOP · 2 FIX · 4 NOTE; both FIX findings (a restored `versionHistory[].settlement` snapshot bypasses the strip on the account door and on the export; the `Object.hasOwn` guard is unpinned against an `in` mutant) are chartered as EM-B3e, which lands BEFORE EM-C4a. Two sentences of this packet lag its own ruling and are left as history: §10's delta row reads +5 and one §9 sentence says A1–A4, where the packet rules itself at +6 and A1–A5
- **Packet version:** `5`
  - ⭐ Version 5 is ONE COUNT corrected at the PROBE (2026-09-21, the chair, after the build lane's STOP at its first step): acceptance case A5 was always sealed (the manifest's six `acceptanceCases`; its TEST row's note: "A5 joins as a fifth in the same suite") and always homed in `tests/lib/importScrub.test.js` (§9), but §7's Markdown row said "A1, A2, A3, A4 … 4 literal-titled `it`s", §8 step 2 said "A1–A4 and A6", and §10 / §12 derived `titles +5` from that four. All four sentences now say FIVE `it`s and `titles +6`. ⛔ No contract, budget, acceptance case, required symbol, change row or structured-manifest field moved: the capsule's content was right and the prose lagged it.
  - ⭐ Version 4 is the DOCS repair only (ESTATE-REPAIR-4, 2026-09-20, read tip
    `bdbf7c89c2569679bcccdb188d5d831ccfaa0e6d`): §10's account of `gate-mutex.sh` is corrected — it
    gives up after its poll budget and **exits 3** (`GAVE UP`), NOT 0. The chair retracted the
    "exits 0" claim on 2026-09-20 after checking three versions of the script; the 09-15 note that
    stated it was wrong. ⛔ **The operational instruction is UNCHANGED and still correct** — a gate
    line with no printed test count DID NOT RUN — so no command, budget, contract, acceptance case,
    required symbol or change row moved.
  - Version 3 is the DOCS repair only (ESTATE-REPAIR-3, 2026-09-20), bringing this packet under
    `COMPILE-RULES.interim.md`: the sealed `checks` row that ran the `tests/lint` DIRECTORY is
    replaced by the GOVERNING TEST FILES computed at the read tip (interim rule 8), the excluded
    directory run and the lighting walker alone move to §10 as the build lane's INSTRUMENTS, the
    literal preamble SHA-256 is withdrawn in favour of a measurement (interim rule 9), and the
    first-paint module count becomes a measurement-at-the-base with an as-of mark. ⛔ **No contract,
    budget, acceptance case, required symbol, change row or non-goal moved.** Version 2 was
    ESTATE-REPAIR-2's docs repair (the `validate:packets` row joined `checks` and §10).
- **Verified base:** `em-t8-b3d-2026-09-21` at `e80a6a3f443e2f6a36e28fbebb72e98e46869fac`
- **Last revalidated:** 2026-09-21 at `e80a6a3f443e2f6a36e28fbebb72e98e46869fac` — STAMPED BY THE CHAIR (Fable 5.1, session 4a1823e2) AT PLACEMENT, the window re-run in the same sitting as the stamp: `git diff --stat ee204c827 e80a6a3f4 -- <the eight declared paths>` and the same from `bdbf7c89c` each printed NOTHING (the six change paths and the requiredSymbols paths are byte-unmoved since both compile tips). THIS IS TRAIN EM-T8, THE PROBE (PACKET-PARALLEL ruling 1): the verified branch above is this packet's OWN LANE BRANCH, cut at the promotion commit on the train branch `em-train-8-2026-09-21`; the chair composes the lane's commit onto the train branch at the terminal. The compile's own sentence follows. — *the chair stamps both from the promotion tip. The revalidation sentence, with the facts this compile measured:* "Re-measured at `<tip>` under J-T1: `git -C <tree> diff --stat e80a6a3f443e2f6a36e28fbebb72e98e46869fac <tip> -- <the six change paths and the ten requiredSymbols paths>` printed NOTHING — zero declared paths moved; all ten `requiredSymbols` rows re-resolved verbatim (counts in `EM-B3d.evidence.md` E-SYM); `retiredSymbols` is empty; the four budgeted byte closures were re-derived and this packet reaches NONE of them (E-BUD); the observed-shape register is green at the base and moves by ZERO rows under the contracted spelling (E-OSR); the lighting DELTA of §10 is applied to the live baseline at promotion, never to a tuple copied from this document." No gate was run by the compile lane and none is claimed.
- **Depends on:** **`EM-B3a` — ✅ LANDED at `668d87512f539ad1c866ec3d9327d6d41f3d8d2f`.** That is the whole dependency list. EM-B3a is this packet's charter in miniature: its ruling **K4** deferred exactly this strip with a measured reason, its §2 non-goals and §12 receipt recorded the deferral, and its `tests/lib/editTravel.test.js` is the instrument this packet extends. ⭐ **This packet does NOT depend on `EM-B3c`, on any writer, or on the migration train** — it adds a drop, never a token, never a projection, never a scanner.
- **Depended on by:** `EM-C4a` — **THE FIRST WRITER of `dmLayer`** (charter, train EM-T7's row). The charter puts EM-B3d FIRST in EM-T7 and C4a second, and the order is the same veil-before-writer law that governed EM-B3b → EM-B3a: the import strip must exist before any code path can put either key on a record that an import file could then carry.
- **Collision group:** `NONE.` Measured at the read tip over `docs/implementation/PACKET_MANIFEST.json`: **195 packets, 193 LANDED and 2 SUPERSEDED — ZERO non-terminal packets exist**, so no sibling reserves any path (E-RES). Five LANDED packets carry rows on these paths and every one is discharged in §5's post-edit simulation: `WF-1E`, `EM-B3a` (two rows), `EST-A`, `WEB-5`, `EM-R0a`.
- **Commit authority:** `edits only; the chair commits`
- **Baseline posture:** `measured at the read tip ee204c827.` Measured and quoted in `EM-B3d.evidence.md`: `importScrub.js` read whole and its three exported strips' contracts (E-SCRUB); the three call sites by symbol with the exact call expression (E-SITE); the import-path denominator and the fourth-path search (E-DENOM); every writer and reader of `dmLayer` / `decrees` in `src/` (E-KEYS); the observed-shape register run plain, its file-keyed inventory, and **the three candidate spellings measured against the detector's own read rule** (E-OSR, E-SPELL); the four byte budgets (E-BUD); the lighting, mutation-coverage, prose-numerics, wiring-census, anchor-ceiling and citation registers (E-REG); effective lines under eslint's own `Linter` (E-EFF); the reservation census (E-RES); every `requiredSymbols` row verbatim with its count (E-SYM). **No gate was run and none is claimed.**
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675` — STAMPED BY THE CHAIR AT PROMOTION 2026-09-21, measured with `shasum -a 256` at `e80a6a3f4`: the FOURTH amendment, unchanged since the compile. **MEASURED AT THE READ TIP, STAMPED BY THE CHAIR AT PROMOTION.** ⛔ This packet quotes no literal hash of its own: a preamble hash is stale the day the next amendment lands, and the fifth amendment is drafted. The compile lane's literal, taken at `ee204c827`, is WITHDRAWN by ESTATE-REPAIR-3; the live measurement, with the tip it was taken at, is the row below.)
- **Interim compile rules:** `COMPILE-RULES.interim.md` (the chair, 2026-09-20) — the fifth amendment's eleven rules, obeyed before they land. Where this packet and `EM-PREAMBLE.md` (SHA-256 `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`, measured with `shasum -a 256` at the read tip `bdbf7c89c2569679bcccdb188d5d831ccfaa0e6d` on 2026-09-20 — the FOURTH amendment, still the tree's live text) disagree, the interim rules govern and this row is the record of it.

> ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
> (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line.

---

## 1. Reconciled authority

1. **`docs/implementation/packets/settlement-editor/EM-B3a.md` — LANDED, and this packet's charter in miniature.** Its ruling **K4**: *"the `importScrub` strip is defense-in-depth, DEFERRED and recorded … deliberately deferred, documented, not a bug to re-find"*, with the cost it measured (a fourth logic file plus three call sites) and the revisit condition it named. Its §2 non-goals and its §12 out-of-scope receipt carry the same words. This packet is the discharge of that deferral, in the slot the charter gave it.
2. **`docs/implementation/charters/EDIT-MODE-TRAIN.md`, the train table's `EM-T7` row** (read whole at the read tip and in the ledger's newest copy): *"**EM-B3d** (the `importScrub` strip of the two editor keys — defense in depth, deferred by EM-B3a's K4) → EM-C4a → EM-D0 (the first door) → BROWSER PASS 4"*, with the ⛔ note that **EM-C4a is the first writer of `dmLayer`**. The charter's sequencing amendment of 2026-09-19 17:0x ("THE DEFERRED WORK, SEQUENCED") is the act that created this slot, under the owner's law of 18:10 that **there is never any deferred work**.
3. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §12 GOVERNS**, item 4: *"the travel instrument is a RUNTIME test that a fork, an **import** and the gallery projection carry neither key, not a static walker."* ⭐ **THE IMPORT IS NAMED IN THE RULING ITSELF.** §11 ("edits do not travel") is the standing law this serves.
4. `docs/implementation/preambles/EM-PREAMBLE.md` — §P2 rows 3, 10, 11, 13; §P3.1 (goldens); §P4 (one record, one reader law); §P5 **HZ-TRAVEL** and **HZ-PERSIST-UNGATED**; §P6 (a WRITTEN-CONTRACT arm is proved by its counterforce, never red-first); §P8.
5. `docs/implementation/PACKET_STANDARD.md` — the standard itself, and in particular the **default hard scope budget**, whose three-modified-logic-files line this packet exceeds by one (§3, §13 Q1).
6. `src/lib/importScrub.js`'s own module docblock — *"the SINGLE writer for the imported-settlement dormancy strip … ALL THREE import paths … route their scrub through here, so a NEW deity/faith embed key can never re-open the resurrection gap in one path only (store-4: cultDeitySnapshots was missed by both hand-maintained strips)."* This module's law is the reason the strip is expressed once and called three times, and the reason a two-of-three landing is forbidden.
7. Live git state, quoted command by command in `EM-B3d.evidence.md`, all at `ee204c827`.

### ⭐ ONE PREMISE OF EM-B3a's K4 IS NOW MEASURABLY NARROWER THAN K4 STATED, AND IT IS NOT A REFUTATION

K4's reason was that the strip *"guards no reachable gap today"*. Re-measured at this tip, that remains **true of the DATA** and **false of the INSTRUMENT**:

- **The data half holds.** Nothing in `src/` writes either key. `src/domain/edit/recordRegister.js` (created by EM-R0a, landed since K4) declares `NOT_YET_WRITTEN_KEYS = Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts'])` — *"Declared but not yet written anywhere. Arm A1 asserts their ABSENCE"* — and the whole-`src` census (E-KEYS) finds exactly ONE reader of `settlement.decrees` (`src/domain/ai/personaSlicer.js:172`) and NO reader or writer of `settlement.dmLayer` outside the three veil sites EM-B3a landed.
- **The instrument half does not.** Design §12 item 4 names three runtime surfaces — fork, **import**, gallery projection. `tests/lib/editTravel.test.js`'s own docblock claims all of them (*"not into a fork, not into an import, not into the gallery projection"*), and its A7 executes **fork (i), backup export (ii) and realm snapshot (iii)** — **there is no import arm**. EM-B3a's lifecycle table discharged the import row by REASONING ("the source is already veiled / already omitted"), which was correct and is not a runtime proof of the surface the design names.

**Therefore this packet is not only defense in depth.** It builds the strip K4 deferred *and* the one runtime arm the design's own ruling names and the instrument does not carry. Nothing in EM-B3a is reopened: K4 said the strip was deferred, not wrong, and named the revisit.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** an imported settlement arrives WITHOUT the editor's two private keys, whatever the import file claims — on all three import paths, at the same settlement-level seam where the coin ledger is already stripped.

**Definition of done:** `src/lib/importScrub.js` exports one new pure strip, `scrubImportedEditState`, that drops `dmLayer` and `decrees` from a settlement and is **REFERENCE-IDENTICAL when there is nothing to strip**; all three import paths call it at the same seam as `scrubImportedTreasury`; six acceptance cases pass; and `tests/lib/editTravel.test.js` gains the RUNTIME IMPORT arm design §12 item 4 names. The existing `importScrub`, `accountImport`, `importReconciliation`, `treasuryDormancy.byteIdentity`, `livingContentLawWiring`, `editTravel` and `decreeRegistryPersistence` suites stay green, and every golden is UNCHANGED.

In scope:

1. **One primary behaviour** — the two editor keys do not survive an import.
2. **One required integration** — the three existing import seams, wrapped one token each.
3. **One prevention guard** — the runtime import arm, plus the three-path ADDRESS pin extended in the shape `tests/lib/importScrub.test.js` already uses for the coin strip.

Explicit non-goals:

- **Any writer.** `applyEdit`, the registry's verbs and `src/domain/edit/**` beyond the already-landed `recordRegister.js` are EM-C4a's / EM-B2a's / EM-C1's. This packet writes neither key and imports nothing from `src/domain/edit/**`.
- **Every denylist, projection and scanner.** `PRIVATE_KEY_RE`, `COVERT_KEY_RE`, `PUBLIC_TOPLEVEL_KEYS`, `toPublicSafe`, `WORLD_SNAPSHOT_HARD_DENY`, `serializeWorldSnapshotPublic`, `buildAccountExport` / `withoutEditState` and every `supabase/migrations/*.sql` are **EM-B3a's and EM-B3b's, LANDED, and are PRESERVED UNCHANGED**. Touching any of them is a STOP (§11).
- **`src/domain/normalizeSettlement.js`.** Measured: its spread runs on every LOAD and SAVE as well as every import (EM-B3a's HZ-PERSIST-UNGATED row), so a drop there would erase the owner's own edits from their own saves. It is the one seam that must NOT hold this strip, and saying so is part of the contract (§5).
- **The `EXPLAINED_WRITER_EXEMPTIONS` mint.** Measured to be owed by **nobody here**: the contracted spelling adds ZERO property reads and therefore ZERO register rows (§5, E-SPELL). A mint is a STOP (§11).
- **`src/store/persistProjection.js`, `src/store/persistMerge.js`, `src/lib/saves.js`, `src/lib/worldExport.js`** — none is an import seam; none is touched.
- **Re-addressing the four `galleryImportSettlement.js:76` citations and the three `importScrub.js:115-121` / `:158-166` citations** — avoided by construction wherever it is free, and declared where it is not (§7, §13 Q2).
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget | Measured/priced here |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0 or 1` | **0** |
| Named state writers | `0 or 1` | **0** — this packet drops, never writes |
| Feature flags | `0 or 1` | **0** |
| User-facing surfaces | `0 or 1` | **0** |
| Direct consumers | `<=2` | **3** — the three import seams ⚠ see the override below |
| New logic-bearing production leaves | `<=2` | **0** — the strip joins the existing single-writer module |
| Existing logic-bearing production files modified | `<=3` | **4** ⚠ — `importScrub.js` + its three call sites; **see the override below** |
| Additional registration-only files | `<=3` | **0** |
| Handwritten files total | `<=12` | **6** |
| New/changed effective production lines | `<=400` | **16** (`+10` importScrub, `2` changed each in the three call sites) |
| Effective lines per new leaf | `<=250` | n/a — no new leaf |
| Delta in a shared/hot file | `<=15` | **0 hot files touched.** The standing list is `EconomicsTab.jsx`, `OutputContainer.jsx`, `convergence.js`, `institutionLifecycle.js`, `App.jsx`, `SettlementsPanel.jsx`, `peaceTerms.js`, `informationStatecraft.js`; none is here. Measured with eslint's own `Linter` (E-EFF): `importScrub.js` **39 / 800**, `galleryImportSettlement.js` **52 / 800**, `galleryImportMap.js` **311 / 800**, `accountImport.js` **379 / 800** — the tightest is 421 effective lines of headroom, and none carries a `scripts/.size-baseline.json` entry or a per-file `max-lines` override |
| Acceptance cases | `<=8` | **6** |

**Overrides requested before dispatch (CHAIR ONLY — §13 Q1): `existing logic-bearing production files modified, 3 → 4`, and `direct production consumers, 2 → 3`.**

⛔ **THE OVERRUN IS STRUCTURAL AND A SPLIT WOULD BE UNLAWFUL — this is why it is an override and not a split.** The standard admits *"a smaller or explicitly approved larger budget … recorded before dispatch"*, and both overrun rows have the same single cause: **the module's own law is that the strip is written ONCE and called at ALL THREE import paths.** `importScrub.js`'s docblock states it in terms — *"ALL THREE import paths … route their scrub through here, so a NEW … key can never re-open the resurrection gap in one path only (store-4: cultDeitySnapshots was missed by both hand-maintained strips)"* — and `tests/lib/importScrub.test.js`'s arm `ALL THREE import paths call it — the one-path-only shape store-4 was` pins it by address. A split into "two paths now, one later" would land, deliberately, the exact defect the module exists to prevent. There is no other seam: the only place all three paths already meet is `normalizeSettlement`, and that function also runs on every LOAD and SAVE, so a drop there would erase the DM's own edits from their own saves (§5, §13 Q3).

⭐ **AND THE THREE CALL-SITE EDITS ARE NOT LOGIC.** Each is a one-token functional wrap of an existing expression — `f(x)` becomes `g(f(x))` — adding **zero branches, zero statements and zero new effective lines** (the line is replaced in place). The whole packet's new logic is the ten effective lines of one pure function in the file whose declared job is to hold exactly such functions. §13 Q1 offers the chair the narrower alternative (a CALL-SITE row class, the sibling of §P2 row 14's CITATION row) if it prefers a rule to an override.

Exceeding any other limit is a STOP and split, not an invitation to renegotiate.

## 4. Sealed dispatch and preflight

Run from the packet's worktree before any edit:

```sh
npm run implementation:dispatch -- EM-B3d
```

Expected: exact packet Markdown and structured capsule emitted; verified-base ancestry and unchanged declared substrate proved before the seal pins exact HEAD; the **six** non-CREATE targets clean, **zero** CREATE targets (this packet creates no file), and every required symbol resolving; Git-visible foreign dirt fingerprinted without target overlap.

⛔ **THE BASE MUST BE STAMPED AT THE PROMOTION TIP, NOT AT THIS COMPILE'S READ TIP.** `src/domain/edit/recordRegister.js` — a `requiredSymbols` path of this packet — was CREATED by EM-R0a inside any window that starts before it, and `tests/lib/editTravel.test.js` was created by EM-B3a and modified by EM-R0a. A base older than both makes the sealed substrate check throw `verified-base descendant changed declared substrate`.

Any mismatch makes this packet STALE. Stop before coding.

Edit only exact-manifest paths. This lifecycle never creates worktrees, stages, commits, merges, cleans, infers affected tests, or rules on a semantic line budget.

## 5. Verified tree contract

Every row was resolved BY SYMBOL at `ee204c827`; the command and its output are in `EM-B3d.evidence.md` under the cited section. Line numbers are the read tip's and are HINTS — re-find by symbol.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **The seam, and the shape to copy** | `src/lib/importScrub.js` | `scrubImportedTreasury` (`:87`) | the SINGLE writer for the import dormancy strip at the SETTLEMENT level; guards `!settlement \|\| typeof !== 'object' \|\| Array.isArray` then `Object.hasOwn(economicState, 'treasury')`, then a DESTRUCTURE-DROP, and returns the input **by reference** on every no-op path. Its own docblock states the reference-identity contract: *"a settlement with no treasury key … comes back as the very object that went in, so this can never move a byte on the dormant path"* (E-SCRUB) | **PRESERVE UNCHANGED.** The new strip sits BESIDE it, at the same level, in the same idiom, and is called at the same three seams |
| **The idiom, measured** | `src/lib/importScrub.js` | `scrubImportedConfig` (`:49`) | a five-key DESTRUCTURE-DROP with one `// eslint-disable-next-line no-unused-vars -- intentional drop of …` directive above the dropped names (E-SCRUB) | the exact spelling the new strip copies, for the reason §6 measures |
| **The idiom, second instance** | `src/lib/importScrub.js` | `scrubGalleryImportLivingContent` (`:145`) | `Object.hasOwn`-guarded, two-stage destructure-drop, reference-identical on the no-op path (E-SCRUB) | the precedent for an `Object.hasOwn` guard in front of a destructure-drop |
| **Import path 1 of 3** | `src/store/galleryImportSettlement.js` | `importGallerySettlementImpl` (`:30`); the call at **`:71`** | `settlement: scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({` — the settlement-level seam, 91 characters, inside the `entry` literal (E-SITE) | gains ONE token, outermost, in place |
| **Import path 2 of 3** | `src/store/galleryImportMap.js` | `importGalleryMapWithCampaignImpl`; the call at **`:290`** | `settlement: scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({` — 95 characters, inside the per-member `entry` literal (E-SITE) | gains ONE token, outermost, in place |
| **Import path 3 of 3** | `src/lib/accountImport.js` | `prepareSettlementEntry` (`:571`); the call at **`:617`** | `const settlement = scrubImportedTreasury({` over the spread of `normalized` (E-SITE) | gains ONE token, outermost, in place |
| **The denominator** | *(whole tree)* | `git grep -n "scrubImportedTreasury" -- src` | **8 lines: 1 definition, 1 docblock mention, 3 import bindings, 3 call sites — and the three call sites are exactly the three named above.** No FOURTH settlement-level import path exists: `prepareSettlementEntry` is the single door for the account file AND for the reconciliation session (`src/lib/importReconciliationAdmission.js:684`) AND for `src/store/accountImportBody.js:414`; `src/lib/campaignImport.js` imports DM table events, never a settlement blob; `src/store/campaignImportedCreation.js` builds a campaign envelope; every other `savesService.save` call site writes a LOCAL settlement (a draft, a sample fork, an instant world), not a foreign one (E-DENOM) | the three seams are the whole population; a fourth would be a STOP, and none exists |
| **The key census** | *(whole `src/`)* | `git grep -nP '\bdmLayer\b\|\bdecrees\b' -- src` | **14 files.** Exactly ONE reader of `settlement.decrees`: `src/domain/ai/personaSlicer.js:172`, `decrees: (home?.appliedDecrees \|\| home?.decrees \|\| []).slice(0, 6)`. **ZERO readers and ZERO writers of `settlement.dmLayer`** outside EM-B3a's three veil sites (`publicSafe.js:294-295`, `worldSnapshotPublic.js:92-93`, `accountData.js:213`). `src/domain/display/decreeTracker.js`'s 22 hits are an ADVANCE-ENTRY derivation (`decreesForAdvance(entry, provenance)` reads `entry.record`'s nodes), **not** the settlement key — a different fact with the same word (E-KEYS) | no shipped path can put either key on an imported settlement today; the strip is dormant AT LANDING and load-bearing from EM-C4a onward |
| **The declared absence** | `src/domain/edit/recordRegister.js` | `NOT_YET_WRITTEN_KEYS` (`:59`) | `Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts'])`, headed *"Declared but not yet written anywhere. Arm A1 asserts their ABSENCE, never their shape"*; `RECORD_CLASSES` classes both `AUTHORED` (E-KEYS) | **PRESERVE UNCHANGED** — this packet adds no key to a record and changes no class. It is a `requiredSymbols` row so that an edit is visible to the sealed dispatch |
| **⛔ THE SEAM THAT MUST NOT HOLD THIS STRIP** | `src/domain/normalizeSettlement.js` | `normalizeSettlement` (`:162`; `const out = { ...settlement }` at `:178`) | the one function all three import paths already pass through — **and it also runs on every LOAD and every SAVE** (EM-B3a's HZ-PERSIST-UNGATED row, pinned by `lifecycleRoundTrip.test.js`) | **PRESERVE UNCHANGED.** A drop here would erase the DM's own edits from their own saves. Proposing it is a STOP (§11) |
| **Register — observed shape** | `scripts/check-observed-shape-readers.mjs` | `EXPLAINED_WRITER_EXEMPTIONS`, and `scanReaders` in `scripts/lib/legacy-reader-shape-scan.mjs` | the scan is GREEN at the base (`exit 0`, *"1964 finding(s), exactly matching the frozen inventory"*). The detector counts a read **only** at `ts.isPropertyAccessExpression`, and `isWriteTarget` returns TRUE for `ts.isDeleteExpression`. Its file-keyed inventory carries **`src/lib/importScrub.js`: ABSENT** although that file destructure-drops `_seed`, `primaryDeityRef`, `primaryDeitySnapshot`, `cultDeitySnapshots`, `faithProfile`, `treasury`, `customContentRoster` and `customContentProvenance` — while the SAME keys convict where they are read as properties (`_seed on config` at `galleryImportMap.js`, `primaryDeitySnapshot on config` and `decrees on settlement` at `personaSlicer.js`). The three file manifests are a frozen genesis record, not a live gate: `publicSafe.js`, `worldSnapshotPublic.js` and `accountData.js` all read DRIFTED from their recorded sha and the scan still exits 0 (E-OSR) | **PRESERVE UNCHANGED. The register moves by ZERO rows** under the contracted spelling — measured, not assumed (§6, E-SPELL) |
| **Test home — the unit** | `tests/lib/importScrub.test.js` | `W-COIN A1.8 — scrubImportedTreasury: imports arrive COINLESS` › `is REFERENCE-IDENTICAL when there is nothing to strip` | **183 effective lines**, 5 `describe`s and 13 literal `it` titles, straight-line, `import { describe, it, expect } from 'vitest'` at `:13`, no rebinding of `it` / `test` / `describe` (E-EFF, E-REG) | A1–A4 copy this suite's shape and join it |
| **Test home — the address pin** | `tests/lib/importScrub.test.js` | `ALL THREE import paths call it — the one-path-only shape store-4 was` (`:108`) | reads each of the three importers and asserts `import { … scrubImportedTreasury … } from '…importScrub.js'` **and** `src.includes('scrubImportedTreasury(')`, *"Named individually because a second door silently covering a deleted first is this program's most-repeated verification failure"* (E-SCRUB) | A4 copies it exactly for the new symbol. ⚠ Its existing regex `[^}]*` still matches a brace list that gains a fourth name — measured, so the arm stays green across this packet |
| **Test home — the runtime travel instrument** | `tests/lib/editTravel.test.js` | `EM-B3a — HZ-TRAVEL: a fork, a backup export and a realm snapshot carry neither key` › `A7 — the three travel surfaces, executed end to end` | **136 effective lines**, 2 `describe`s and 3 literal `test` titles, `import { describe, test, expect, vi } from 'vitest'`. ⭐ **The docblock claims an import arm and A7 has none** — (i) fork, (ii) backup export, (iii) realm snapshot (E-REG) | A6 adds the missing import arm as a THIRD `test` inside the EXISTING second `describe`; **no existing arm is edited** |
| **Anchor ceiling register** | `tests/lint/negativeAssertionAnchor.walker.test.js` | `FROZEN_UNANCHORED_NEGATIVES` (`:205`), `ceilingFor` (`:809`) | `'tests/lib/importScrub.test.js': 1` — a SHRINK-ONLY ceiling with an exact `inventory honesty` arm that reds when the live count falls BELOW its row. The one un-anchored site is the `expect(out).not.toHaveProperty(stripped)` inside the loop at `:42`. `tests/lib/editTravel.test.js` carries NO row (E-REG) | **NEITHER FILE'S ROW MOVES.** Every new negative is anchored (`expectAbsentWithAnchor`, or `// anchored:` on the assertion's own line or the ONE line immediately above), and the existing `:42` site is **left exactly as it is** — anchoring it would force an edit to a register outside this manifest |
| **Citation addresses into the module** | `src/lib/importReconciliationAdmission.js` (`:442`, `:549`), `tests/lib/importReconciliation.test.js` (`:604`) | `` `importScrub.js:115-121` ``, `` `importScrub.js:158-166` `` | three LIVE `path:line` citations into this module. `tests/lint/sourceCitationIntegrity` ARM 1 is a **past-EOF** arm only (`src`/`tests`/`scripts` carry NO baseline), so a shift of a few lines reds NOTHING — but it makes the citations wrong (E-REG) | §7's coding instruction places the new function at the FILE'S END and prices the header's `+1` line; §13 Q2 puts the re-address to the chair |
| **Citation addresses into path 1** | `tests/domain/composeStateProse.test.js` (`:319`), `tests/domain/stateProseKernel.test.js` (`:612`), `tests/property/dossierProseManifest.test.js` (`:30`, `:522`) | `` `galleryImportSettlement.js:76` `` | four LIVE citations to the `_seed: undefined` line, which sits **five lines BELOW the call site this packet edits**. `tests/property/dossierProseManifest.test.js` is NOT one of `MANIFEST_RECORDER_FILES` (measured: `dossierManifest.js`, `goldenMasterCorpus.js`, `prose-rate-corpus.mjs`), so it carries no recorder-identity risk — but it is the prose-manifest suite and is better left untouched (E-REG) | ⛔ §7 makes the `galleryImportSettlement.js` edit **NET-ZERO LINES** so `:76` does not move and all four stay exact |
| **Registers that do NOT move** | `scripts/mutation-coverage-manifest.json`; `docs/content/wiring-census.json`; `tests/lint/.prose-numerics-baseline.json`; `scripts/.size-baseline.json`; `tests/lint/.lighting-census-baseline.json`; every golden | — | mutation-coverage: **zero rows owed on BOTH arms** — `tests/lib` is not an `ENFORCER_DIR` (the eight are `tests/lint`, `design`, `docs`, `data`, `copy`, `security`, `edgeFunctions`, `generators`) and neither `importScrub.test.js` nor `editTravel.test.js` trips a `NAME_PATTERN` token; wiring census: **none of the four `src/` paths is stamped** in `stamp.files`, and this packet CREATEs nothing under `src/generators/**` or `src/domain/**` (§P2 row 13 not owed); prose-numerics: **zero rows** for any of the four, and this packet renders no figure; size baseline: **no entry, none owed**; lighting: the DELTA is §10's and the refreeze is the train's terminal act (E-REG) | **PRESERVE UNCHANGED**, every one |

**Forbidden alternatives:**

- no drop in `normalizeSettlement`, `saves.js`, `persistProjection.js`, `persistMerge.js` or `worldExport.js`;
- no token added to `PRIVATE_KEY_RE` or `COVERT_KEY_RE`, no member added to `PUBLIC_TOPLEVEL_KEYS` or `WORLD_SNAPSHOT_HARD_DENY`, no edit to `toPublicSafe` or to any migration;
- **no PROPERTY READ of either key anywhere in this packet's production code** (`settlement.dmLayer`, `s.decrees`, `entry?.decrees`) — measured to mint observed-shape rows (§6, E-SPELL);
- no `delete`-based strip that clones unconditionally — it would break the reference-identity contract that is this packet's dormancy proof;
- no edit to `tests/lint/.lighting-census-baseline.json`, `tests/lint/negativeAssertionAnchor.walker.test.js`, `scripts/.observed-shape-readers-baseline.json`, `scripts/mutation-coverage-manifest.json` or any other register;
- no edit to any `EM-B3a` / `EM-B3b` deliverable;
- no import of anything under `src/domain/edit/**`;
- no new line ABOVE `_seed: undefined` in `src/store/galleryImportSettlement.js`;
- no re-serialisation of any manifest or baseline JSON; no files outside the manifest.

## 6. Exact contracts

### Inputs and outputs

```js
// src/lib/importScrub.js — ONE new exported function, APPENDED AT THE END OF THE FILE.
/**
 * THE IMPORT EDIT-STATE STRIP (EM-B3d, design §11 and §12 item 4) — an imported
 * settlement arrives with NO editor state.
 *
 * `dmLayer` records which fields on a record are the DM's own and `decrees` is the
 * ordered registry of what they have staged. Both are the AUTHOR'S working session,
 * not a property of the town, and design §11 says edits do not travel. EM-B3a veiled
 * them on every way OUT (the two public projections, the realm snapshot, the backup
 * export and the server scanner); this is the same claim on the way IN, at the one
 * boundary a record can arrive from outside the owner's own account.
 *
 * WHY IT IS A DORMANCY HAZARD, in the voice of the strips above: an imported layer
 * would assert that fields of a world this keeper never edited are nonetheless the
 * DM's, and an imported registry would seat another table's half-finished orders in
 * this campaign's editor — both keyed to entities and ticks that mean nothing here.
 *
 * ⛔ WHY IT IS A FOURTH FUNCTION RATHER THAN TWO MORE NAMES IN `scrubImportedConfig`:
 * both keys sit on the SETTLEMENT, not on `settlement.config`, so adding them to that
 * destructure would be a NO-OP that read like a guarantee — the same reasoning
 * `scrubImportedTreasury`'s own note records, and the reason store-4 shipped.
 *
 * ⛔ AND WHY THE KEYS ARE NEVER READ AS PROPERTIES HERE. A destructure-drop and an
 * `Object.hasOwn` probe are invisible to the observed-shape detector, which counts a
 * read only at a property access; `settlement.dmLayer` would mint a register row for
 * a key no generated record carries. Measured, not assumed (EM-B3d §6).
 *
 * Pure, and REFERENCE-IDENTICAL when there is nothing to strip: a settlement carrying
 * neither key — which is EVERY settlement at this commit, because nothing writes
 * either one (`src/domain/edit/recordRegister.js`'s NOT_YET_WRITTEN_KEYS) — comes
 * back as the very object that went in, so this can never move a byte on the dormant
 * path.
 *
 * @param {Record<string, any>|null|undefined} settlement
 * @returns {Record<string, any>|null|undefined}
 */
export function scrubImportedEditState(settlement) { /* exact algorithm in §8 */ }

// src/store/galleryImportSettlement.js — the import brace gains ONE name ON AN
// EXISTING LINE, and the call at :71 gains ONE token IN PLACE. NET ZERO LINES.
  scrubGalleryImportLivingContent, scrubImportedEditState,
// …
    settlement: scrubImportedEditState(scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({

// src/store/galleryImportMap.js — the same two in-place edits, same spelling.
// src/lib/accountImport.js — the one-line import at :58 gains the third name, and
//   `const settlement = scrubImportedTreasury({` becomes
//   `const settlement = scrubImportedEditState(scrubImportedTreasury({`  (its `});` gains one `)`).
```

**Return shapes, exactly.** `scrubImportedEditState` returns its input **by reference** when the settlement is not a plain object, is an array, or has neither key as an OWN key. Otherwise it returns a **shallow copy minus the two keys**, preserving the insertion order of every surviving key. It reads no value, consumes no PRNG, reads no clock, mints no id, throws on nothing, and mutates nothing. The three call sites' surrounding expressions are unchanged in type and arity; the entry literal, the array length of any settlements list, and every sibling key are untouched.

**Ordering and precedence.** The new strip runs **OUTERMOST** at each seam — after `normalizeSettlement`, after `scrubImportedTreasury`, and (on the two gallery paths) after `scrubGalleryImportLivingContent`. Outermost is chosen so the strip is the LAST word on what an imported record carries: a future migration step inside `normalizeSettlement` that re-materialized either key would still be caught. The three strips are mutually independent (disjoint key sets at disjoint levels), so order changes no output today — the choice is for the property, not the behaviour, and it is recorded so a later reader does not re-argue it.

### THE SPELLING IS MEASURED, NOT PREFERRED (the register's whole cost turns on it)

The detector (`scripts/lib/legacy-reader-shape-scan.mjs`, `scanReaders`) counts a read **only** at `ts.isPropertyAccessExpression` whose name is an identifier, and `isWriteTarget` excludes `ts.isDeleteExpression`. Three candidate spellings were parsed with the tree's own TypeScript and counted (E-SPELL):

| Spelling | `dmLayer`/`decrees` property accesses | Register cost | Reference-identical? |
|---|---:|---|---|
| **A — `Object.hasOwn` guard + destructure-drop** (contracted) | **0** | **ZERO rows** | **yes**, on the no-op path |
| B — `settlement.dmLayer === undefined` guard + destructure-drop | **2** | would MINT `dmLayer on settlement` and `decrees on settlement` at `src/lib/importScrub.js` — a CHAIR act through the migration-bundle door | yes |
| C — `delete clone.dmLayer` after an unconditional spread | 2, but both are `isWriteTarget` ⇒ **0 counted** | zero rows | **NO** — an unconditional clone moves the bytes of every import |

The live controls are in the tree and were executed, not reasoned: `src/lib/importScrub.js` destructure-drops eight keys and is **ABSENT from the inventory**, while `_seed`, `primaryDeitySnapshot`, `cultDeitySnapshots` and `decrees` each convict where they are read as properties elsewhere; and `src/domain/display/publicSafe.js` carries only `{"covert on settlement":1}` although EM-B3a landed `delete clone.dmLayer; delete clone.decrees;` in it. **Spelling A is contracted. Spelling B is a STOP (§11).**

### State schema

⛔ **BOTH VALUES ARE OPAQUE TO THIS PACKET**, exactly as EM-B3a ruled (B3a-2). This packet drops by key NAME and asserts by deep equality on the SURVIVING record; it names no field inside either value, and a test that does is a STOP. The fixtures are planted literals rich enough that a reordering cannot hide in them (one nested object and one order-observable array inside each key), reusing `editTravel.test.js`'s existing `dmLayerFixture()` / `decreesFixture()` helpers where the arm lives in that file.

**Absence rules** — identical for both keys:

- **absent:** the only state any settlement in the tree is in today. The strip takes the reference-identical branch, and that is **100 % of real imports at this landing**.
- **empty** (`decrees: []`, `dmLayer: {}`): the key is PRESENT, so it is **DROPPED**. An empty container is still a statement about another keeper's editing session and has no meaning in the destination world; it must not survive an import, and absence is the only state an imported world may be in. *(This deliberately differs from the SAVE path, where EM-B3a preserves `[]` as `[]` — there the container is the owner's own fact.)*
- **`null`:** an own key, so it is **DROPPED**. Nothing throws on it.
- **invalid legacy input** (a string, a number, an array where an object is expected): it is an own key, so it is **DROPPED**; the strip never inspects the value.
- **a non-object / array / null `settlement`:** returned **unchanged, by reference**.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| a gallery dossier carrying both keys | `importGallerySettlementImpl` | `Object.hasOwn` on either key | the saved entry's settlement has neither key | none |
| a gallery MAP member carrying both keys | `importGalleryMapWithCampaignImpl` | same | same, for every member | none |
| an account export entry carrying both keys | `prepareSettlementEntry` | same | `{ ok: true, entry }` whose settlement has neither | none |
| a reconciliation session's record | `importReconciliationAdmission` → `prepareSettlementEntry` | same | inherited, with no second seam | none |
| an import carrying NEITHER key (every import today) | any of the three | neither key own | **the identical object reference** | none |
| the owner's OWN save carrying both keys | save / load / `normalizeSettlement` | this packet adds no arm here | both keys survive byte-exact | none |

### Determinism

- **Hash/fork key:** `NONE`. No random value, no clock, no id.
- **Stable enumeration:** the shallow copy after a rest-destructure preserves every surviving key's insertion order.
- **Rounding/clamping:** none.
- **No-draw behaviour:** on a settlement carrying neither key the strip returns **the identical object reference**. ⭐ **At this landing that is EVERY import**, because nothing in `src/` writes either key (`NOT_YET_WRITTEN_KEYS`). The reference-identity arm (A2) is therefore the packet's **dormancy proof**, not a nicety: a shallow-copy-always implementation would silently move the bytes of every import this build has ever taken, and `tests/domain/treasuryDormancy.byteIdentity.test.js` is the estate's standing witness for exactly that class.

### Flag and dormancy

- **Flag:** `NONE`.
- **Dormancy:** the whole packet is dormant at its own landing — every arm is a no-op on real data, and it becomes load-bearing the moment EM-C4a writes the first `dmLayer`.
- ⛔ **HZ-PERSIST-UNGATED holds by construction:** the strip sits inside no flag conditional, and the arm that carries persisted state (`normalizeSettlement`'s spread) is untouched.
- **Golden posture:** `UNCHANGED`. `tests/property/generatorGoldenMaster.test.js` and `tests/property/dossierProseManifest.test.js` must not move; nothing here reaches the generator. Motion is a STOP (§P3.1).

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| never here; EM-C4a is the first writer and lands AFTER | adds **no domain reader** — the contracted spelling reads no value (§6) | untouched: `row.data = entry.settlement` | untouched: `normalizeSettlement`'s spread | untouched | untouched | ⭐ **THIS PACKET'S CHARGE.** All three import paths drop both keys at the settlement level, outermost. A migration of existing saves stays EM-B4's | untouched: EM-B3a's and EM-B3b's landed veils carry every way OUT |

### Receipts and privacy

- **Closed kinds:** `NONE` — no receipt, no chronicle line, no analytics event.
- **Numeric-to-word bands:** n/a — this packet renders nothing, so prose-numerics is not owed (§P2.7).
- **DM-only fields:** `settlement.dmLayer`, `settlement.decrees` — the finite list, and exactly this packet's subject.
- **Player/public projection:** unchanged; this packet touches no projection.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY:` no NPC, faction or deity state, no alignment axis.
- **Edit story:** `ENGINE-ONLY:` this packet exposes no verb. It is the last of EM-B3's four travel seams, laid down before the writer that makes it matter.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/lib/importScrub.js` | the module docblock's strip list (`:18-26`) **and** one new exported function | `+10 eff` | **(a)** Amend the docblock's `THREE STRIPS, at two levels` line to `FOUR STRIPS` **in place** and add exactly ONE bullet line for `scrubImportedEditState` — *"over the SETTLEMENT (the editor's two private keys)"*. This is a **net `+1` raw line** and `0` effective lines, and it is the whole shift this file takes. **(b)** APPEND the new function **at the very END of the file**, after `scrubGalleryImportLivingContent`, with the JSDoc of §6. ⛔ **Nothing else in this file moves**: appending at the end keeps the three live `importScrub.js:115-121` / `:158-166` citations correct to within the docblock's one line (§13 Q2), and an insertion anywhere in the middle would make them wrong by the size of the function. Use the `// eslint-disable-next-line no-unused-vars -- intentional drop of the editor's two private keys` directive above the dropped names, exactly as the two siblings do. |
| `MODIFY` | `src/store/galleryImportSettlement.js` | the named import (`:23-27`) and the call at `:71` | `2 eff changed` | ⛔ **NET ZERO LINES — this is a contract, not a style note.** Put `scrubImportedEditState` on the SAME line as `scrubGalleryImportLivingContent,` inside the existing brace list (the estate already spells two names on one import line at `accountImport.js:58`), and wrap the call **in place** on line 71. **Do not add a comment line anywhere above `_seed: undefined`**: four live citations in three test files address `galleryImportSettlement.js:76`, including `tests/property/dossierProseManifest.test.js:30` and `:522`, and a one-line shift makes all four wrong for nothing. The explanation lives in the new function's JSDoc, where this module's law already lives. |
| `MODIFY` | `src/store/galleryImportMap.js` | the named import (`:13-17`) and the call at `:290` | `2 eff changed` | The same two in-place edits, same spelling, same net-zero discipline. Nothing below `:290` is cited outside the sha-pinned `SETTLEMENT_CAPABILITY_ATLAS` (archival-excluded from the citation walker), but the discipline is kept so the three seams read identically. |
| `MODIFY` | `src/lib/accountImport.js` | the one-line import at `:58` and the call at `:617` | `2 eff changed` | Add the third name to the existing single-line import. Wrap `scrubImportedTreasury({` in place and close the extra parenthesis on the existing `});` line. ⛔ `meta.restoreLifecycle === true` (`:639`), `admitRestoredLifecycle`, `restoreIntraEnvelopeWiring` and `importedNeighbourLinkId` are WEB-5's `requiredSymbols` and must survive verbatim — this edit touches none of them. |
| `TEST` | `tests/lib/importScrub.test.js` | A1, A2, A3, A4, A5 | `n/a` | **5 literal-titled `it`s in ONE new `describe`, appended after the `DEF-1` suite** (A5, the account door end to end, is the FIFTH: the structured manifest's row has said so since the compile; this row's "4" was the one sentence that lagged it: corrected in version 5)**.** No `.each`, no loop-generated test, no nesting, and **no variable, parameter or binding named `it`, `test` or `describe`** (26 of the estate's parked files park for that alone). A4 copies `ALL THREE import paths call it — the one-path-only shape store-4 was` exactly, for the new symbol, naming each importer individually. ⛔ **Do not touch the existing un-anchored `expect(out).not.toHaveProperty(stripped)` at `:42`** — its `FROZEN_UNANCHORED_NEGATIVES` ceiling of 1 reds on a SHRINK. Every new negative is anchored via `expectAbsentWithAnchor` or a single-line `// anchored:` marker. |
| `TEST` | `tests/lib/editTravel.test.js` | A6 | `n/a` | **ONE literal-titled `test` appended INSIDE the existing second `describe`** (`EM-B3a — HZ-TRAVEL: …`), and **no existing arm is edited**. Its title names the surface the suite's docblock already claims: the import. Reuse the file's `dmLayerFixture()` / `decreesFixture()` helpers and its `expectByteEqual`. Drive the ACCOUNT path through `prepareSettlementEntry` (a real import door, headless and deterministic — the same door `tests/lib/importScrub.test.js:129` already drives) rather than a network-fetching store module, and anchor the two absences on a surviving sibling so an emptied entry cannot pass. ⚠ If the amended docblock sentence is also wanted, keep it to a comment-only in-place edit — this file carries no line-addressed citation. |

⚠ **`TEST`, not `CREATE`, for both test rows — measured, not stylistic.** `validate:packets` errors on any non-`CREATE` row whose path is ABSENT, and both files exist (EM-B3a created them). Re-counted at the read tip: **146** landed rows on `tests/` paths are `CREATE` against **299** `TEST`.

⭐ **NO NEW TEST FILE IS CREATED, AND THAT IS THE CHEAPER SHAPE.** The estate's own precedent is that every strip in this single-writer module is proved in `tests/lib/importScrub.test.js` — the coin strip (W-COIN A1.8) and the living-content strip (DEF-1) both joined it rather than opening a file. A CREATE under `tests/lib/` would also opt the packet into every walker governing that directory (the run-17/18/19 family) for no gain.

**Generated artifacts:** `NONE`. Re-derived from the five edge-shared metas' own `inputs` arrays at the read tip (114 / 74 / 115 / 2 / 2 entries): **zero hits** for any of the four `src/` paths. No `checks` command of this packet runs a generator, so §P2 row 12's ordering hazard does not arise.

### ⭐ THE BUNDLE BUDGETS, PRICED — AND THIS PACKET OWES NOTHING

| Budget | Instrument and bound | Does this packet land in it? |
|---|---|---|
| First-paint eager closure | `EAGER_FIRST_PAINT_MODULES` **imported live from `vite.config.js` at the pre-proof — the size is MEASURED AT THE BASE, NEVER QUOTED** (interim rule 9). As executed HISTORY with an as-of mark: **269** at `ee204c827` (this packet's compile) and **269** at `bdbf7c89c` (ESTATE-REPAIR and ESTATE-REPAIR-3, by importing the set). ⚠ `EM-PREAMBLE.md` §P2 row 11 and four landed packets still say 268; the amendment corrects them. Bound: `CLOSURE_BUDGET_BYTES` `1_048_000` | **NO** — all four paths `NOT-EAGER`, so this packet's delta on the closure is **+0 modules, +0 B** |
| Generation worker | `WORKER_BUNDLE_CEILING_BYTES = 1401208` (`generationWorkerLazy.test.js:159`), EXACT, zero slack | **NO** — none of the four is in `src/workers/generation.worker.js`'s **220-module** static source closure |
| Lazy engine chunk | `expect(size).toBeLessThan(679_000)` (`vendorPdfLazy.test.js:831`) | **NO** — the chunk rule is `id.includes('/src/generators/')` (`vite.config.js:1044`) plus `/src/data/narrativeData.js` (`:1104`); none of the four matches |
| Edge-shared bundles | the five `*.meta.json` `inputs` closures | **NO** — zero hits |

⇒ **No ceiling TEST row, no stated byte bound, no re-mint.** Two receipts the implementer still reports, and they are receipts rather than budgets: none of the four paths is in `townSceneExport.worker.js`'s **125**-module closure or `advanceInterval.worker.js`'s **549**-module closure either, and a module with no `manualChunks` assignment is finally placed by Rollup, which only a real build settles — the table above is the static-graph claim, which is what every `tests/build/` guard itself asserts against.

**No other file may be edited.**

## 8. Ordered coding sequence

0. Dispatch and seal the packet; stop on any preflight mismatch.
1. **Capture the baseline**, in this order, before any edit: (a) `shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json`; (b) the lighting tuple from `tests/lint/.lighting-census-baseline.json`; (c) `node scripts/check-observed-shape-readers.mjs > <scratch>/osr-base.log 2>&1; echo "exit $?"` — **never through a pipe**; (d) the six suites this packet must not move, green: `importScrub`, `accountImport`, `importReconciliation`, `treasuryDormancy.byteIdentity`, `livingContentLawWiring`, `editTravel`.
2. **Write A1–A5 and A6 as FAILING tests first** against the uncured tree, and QUOTE the red. ⚠ **A2 and A4 cannot be red-first** — A2's reference-identity holds vacuously before the function exists (the arm cannot even import it) and A4 is a written-contract address pin. Per §P6's EM amendment, each is proved by its **counterforce**: A2 against a planted `return { ...settlement }` mutant that reds its named title, restored to the exact pre-mutant SHA-256; A4 against a planted removal of one call site, likewise restored. Quote both counterforces in the receipt beside the arms.
3. `src/lib/importScrub.js`: append `scrubImportedEditState`, then amend the docblock's strip count and add its one bullet line.
4. The three call sites, in this order — `accountImport.js`, `galleryImportMap.js`, `galleryImportSettlement.js` — each a net-zero-line, in-place edit. After each, `git diff -U0 -- <that file>` must show exactly two changed lines and **zero added lines**.
5. `tests/lib/editTravel.test.js`: A6, appended inside the existing second `describe`.
6. Run focused verification (§10), then `tests/lint` WHOLE, then the goldens plain.
7. `shasum -a 256` the two goldens again: identical to step 1(a). Any motion is a STOP.
8. Write the completion receipt.

**Bounded algorithm — `scrubImportedEditState`:**

```text
1. If settlement is not a plain object (null, undefined, non-object, or an Array), return settlement.
2. If neither 'dmLayer' nor 'decrees' is an OWN key of settlement, return settlement  (REFERENCE-IDENTICAL).
3. Destructure: const { dmLayer, decrees, ...rest } = settlement;   (a destructure-drop, never a property read)
4. Return rest.
```

⛔ Step 2 uses `Object.hasOwn(settlement, 'dmLayer')` and `Object.hasOwn(settlement, 'decrees')` — **string literals, never property reads** (§6). Step 4 returns `rest` directly, as `scrubImportedConfig` does; there is no outer envelope at this seam.

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | **Main behaviour — the settlement-level drop** | a settlement carrying an OPAQUE `dmLayer` object (one nested object, one order-observable array) and an OPAQUE `decrees` array of two distinguishable ordered entries, beside real siblings (`name`, `tier`, `economicState.foodSecurity`, `institutions`) | liveness first: the fixture really carries both keys. After the strip, neither is an own key (anchored on a surviving sibling); **every other key survives deep-equal with its insertion order intact**; and **the source object is NOT mutated** — the importers spread it elsewhere | `tests/lib/importScrub.test.js` |
| A2 | **Dormancy — REFERENCE-IDENTICAL when there is nothing to strip** | (i) a settlement with neither key — *the case 100 % of real imports take at this landing*; (ii) `{ name: 'NoEconomy' }`; (iii) `null`, `undefined`, `[]` | each comes back as **the very object that went in** (`toBe`), and the array and nullish inputs do not throw. Proved by the §8 step 2 counterforce, not red-first | `tests/lib/importScrub.test.js` |
| A3 | **Boundary — empty, null and malformed are all PRESENT keys** | three settlements: `{ dmLayer: {}, decrees: [] }`; `{ dmLayer: null, decrees: null }`; `{ dmLayer: 'nonsense', decrees: 7 }` | all three lose **both** keys — an own key is dropped whatever its value, the strip never inspects the value, and nothing throws. The contrast is stated in the test's own comment: on the SAVE path EM-B3a preserves `[]` as `[]`, because there the container is the owner's own fact | `tests/lib/importScrub.test.js` |
| A4 | **Counterforce — ALL THREE import paths call it** | the source text of `src/lib/accountImport.js`, `src/store/galleryImportSettlement.js`, `src/store/galleryImportMap.js` | each file imports `scrubImportedEditState` from `importScrub.js` **and** contains `scrubImportedEditState(`, asserted **file by file with the file named in the message** — the shape the existing A1.8 arm uses, for the reason it records. Proved by the §8 step 2 counterforce | `tests/lib/importScrub.test.js` |
| A5 | **Real integration — the account door, end to end** | `prepareSettlementEntry({ settlement: { …, dmLayer, decrees, economicState: { foodSecurity, treasury } } })` after `ensureNormalizeLoaded()` | `res.ok === true`; the returned entry's settlement has **neither** editor key **and** no `treasury` (the coin strip still ran — the two strips compose rather than shadow); `foodSecurity` and the world's own content survive, so an emptied entry cannot pass | `tests/lib/importScrub.test.js` |
| A6 | ⭐ **THE RUNTIME IMPORT ARM design §12 item 4 NAMES** | a foreign import file whose settlement carries both keys planted opaque beside allowlisted content, driven through `prepareSettlementEntry` — the one import door reachable headlessly | the prepared entry's **serialized** form contains neither `"dmLayer"` nor `"decrees"` at any depth; the anchor proves the import really ran and really read the record (the entry's name, tier and an institution survive, and `importedFrom.source === 'account-export'`); and every sibling of the edited save survives **byte-exact** beside the two omissions | `tests/lib/editTravel.test.js` |

This table is the entire edge-case budget. **The observed-shape register is deliberately NOT an acceptance case** — §6's measurement is a compile-time fact about a spelling, and `node scripts/check-observed-shape-readers.mjs` in §10 is its proof; a seventh case restating it would be the redundant second guard §P6 refuses.

## 10. Verification commands

```sh
# Focused static checks — eslint runs BARE, never through the mutex (it declares no worker cap)
npx eslint src/lib/importScrub.js src/store/galleryImportSettlement.js \
  src/store/galleryImportMap.js src/lib/accountImport.js \
  tests/lib/importScrub.test.js tests/lib/editTravel.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# The observed-shape register, plain and read-only — NEVER through a pipe
node scripts/check-observed-shape-readers.mjs > "$SCRATCH/osr-head.log" 2>&1; echo "exit $?"; tail -5 "$SCRATCH/osr-head.log"

# Focused tests — ONE test directory per gated run
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lib/importScrub.test.js tests/lib/editTravel.test.js \
  tests/lib/accountImport.test.js tests/lib/importReconciliation.test.js \
  tests/lib/importReconciliationRecovery.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/treasuryDormancy.byteIdentity.test.js tests/domain/livingContentLawWiring.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/decreeRegistryPersistence.test.js tests/store/lifecycleRoundTrip.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/security/snapshotDenylistDrift.test.js tests/security/worldSnapshotDenyCensus.test.js \
  tests/security/gallerySanitizeAllowlist.contract.test.js tests/security/townMapEditsPublicDrop.test.js

# The GOVERNING LINT FILES — sealed in `checks` (interim rule 8), the lighting walker excluded
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/contractTestAntiVacuity.walker.test.js tests/lint/customContentCharsetWiring.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/premiumGateSingleSource.test.js

# The remaining governing files, one test directory per gated run
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/build/accountImportLazy.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/components/covenantClaimsParity.test.js tests/components/faithPanelModel.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/ui/accountW4d.test.jsx

# ⭐ THE BUILD LANE'S INSTRUMENTS — NOT sealed checks (interim rule 8). Run both before the commit;
# they are the ODQ §934.47 addendum 104 "tests/lint WHOLE" law, split into its two verdicts.
#   (a) the EXCLUDED directory run — MUST EXIT 0
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint --exclude=tests/lint/sovereigntyLightingContract.walker.test.js
#   (b) the LIGHTING WALKER ALONE — reds BY DESIGN under a train; its red is the named interior red
#       below and its message must match the predicted DELTA, never a tuple copied from this document
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js

# The goldens, plain
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

node scripts/implementation-packets.mjs validate

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-B3d
npm run implementation:resume -- EM-B3d

# Wave-end presentation-safe invocation; never pipe
npm run check:tail
```

**Expected:** every command exits `0`. ⛔ **A gate line with no printed test count DID NOT RUN** — the mutex's default gives up after 40 polls and **exits 3** (`GAVE UP`, never 0 — the chair's retraction of 2026-09-20, three versions of the script checked), so never drop the two exports. Report actual counts; copy no historical count. No generator is among these commands, so no step invalidates a later one.

**The train's interior red (named before it exists):** `tests/lint/sovereigntyLightingContract.walker.test.js` reds on this member's commit, because the census tuple is an exact equality and this member adds test titles. ⛔ **The prediction is a DELTA, never a tuple.**

| Figure | Walker semantics | **EM-B3d's delta** | Derivation |
|---|---|---:|---|
| `files` | every `*.test.js(x)` under `tests/` | **+0** | this packet CREATEs no test file |
| `parked` | files with ≥1 park reason | **+0** | no file's park status changes: every added registration is a straight-line literal `it` / `test` under one literal `describe`, with no `.each`, no loop, no conditional and no rebinding of `it` / `test` / `describe` |
| `credited` | files with zero park reasons | **+0** | same |
| `titles` | literal test titles in CREDITED files | **+5** | 4 new `it`s in `tests/lib/importScrub.test.js` + 1 new `test` in `tests/lib/editTravel.test.js` |
| `suiteTitles` | literal `describe` titles in CREDITED files | **+1** | one new `describe` in `tests/lib/importScrub.test.js`; A6 joins an EXISTING `describe` |

⚠ **THE `titles +6` AND `suiteTitles +1` FIGURES (five `it`s in `importScrub.test.js` + one `test` in `editTravel.test.js`; version 5 corrects version 4's `+5`, which forgot A5) ARE CONDITIONAL ON BOTH FILES BEING CREDITED, AND THAT ONE FACT IS OWED TO THE PRE-PROOF** (step 14b: a PARKED file's titles count nowhere, and EM-B1d priced a title for a long-parked file and measured `+4`). Both files read as credited by inspection — each imports its openers from `'vitest'`, registers straight-line under literal `describe`s, and binds no variable or parameter named `it` / `test` / `describe` — but the walker's own `parkReasonsFor` is the only authority and it runs under vitest, which this compile lane may not do. **The pre-proof lane prints `parkReasonsFor` for both files and confirms or corrects these two figures.** If either parks, its titles are `+0` and the park reason is the finding.

**The absolute is the chair's stamp at promotion**, read from the live `tests/lint/.lighting-census-baseline.json` and added to this delta — never from a tuple copied from this document. Re-derived whole at the TERMINAL, by the chair, never inside this packet (§P2.1, §P3.2).

**Registers that do NOT move, measured at the read tip:** the observed-shape register (**zero rows** — the contracted spelling adds zero property reads, measured against the detector's own rule); `scripts/mutation-coverage-manifest.json` (**zero rows owed on BOTH arms** of the enumeration rule); `docs/content/wiring-census.json` (none of the four `src/` paths is stamped, and no CREATE under `src/generators/**` or `src/domain/**`); `tests/lint/.prose-numerics-baseline.json` (zero rows, nothing rendered); `scripts/.size-baseline.json` (no entry, none owed); `tests/lint/negativeAssertionAnchor.walker.test.js`'s ceiling for `tests/lib/importScrub.test.js` (stays at **1**); `scripts/check-writer-reach.mjs` (no `src/domain/edit/**` file in this manifest); `scripts/.test-ratchet-baseline.json` (a scope FLOOR, not an equality); and **no bundle ceiling** (this packet reaches none).

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- the dispatch seal is missing, invalid, or belongs to another worktree state; or resume reports authority, HEAD, foreign-work or receipt-integrity drift;
- **the chair has not answered §13 Q1.** The packet's §3 exceeds the standard's three-modified-logic-files cap and its two-direct-consumers cap; without a recorded override (or the chair's narrower rule) this packet may not be dispatched, and the budget may not be quietly renegotiated;
- **a PROPERTY READ of `dmLayer` or `decrees` appears in production code** — `settlement.dmLayer`, `s?.decrees`, or any dotted access. It mints observed-shape rows through a door only the chair may open (§6);
- **the strip is proposed for `normalizeSettlement`** (or for `saves.js`, `persistProjection.js`, `persistMerge.js`) — it would erase the DM's own edits from their own saves;
- the strip would land on **two of the three import paths**, or a fourth import path is discovered that does not route through it — either is the one-path-only shape this module exists to prevent, and the second is a finding to report, never to fold in silently;
- the reference-identity branch is removed, or the strip clones unconditionally;
- `tests/lib/importScrub.test.js`'s existing un-anchored site at `:42` is anchored, or either test file's `FROZEN_UNANCHORED_NEGATIVES` standing changes;
- a line is added above `_seed: undefined` in `src/store/galleryImportSettlement.js`, or a `path:line` citation of any file in this manifest goes past EOF;
- any EM-B3a or EM-B3b deliverable is edited — a denylist token, a projection, `WORLD_SNAPSHOT_HARD_DENY`, `withoutEditState`, or any migration;
- anything under `src/domain/edit/**` is imported by this packet's code or tests, or `recordRegister.js`'s `NOT_YET_WRITTEN_KEYS` / `RECORD_CLASSES` would be edited;
- a golden, the prose manifest, or any register outside this manifest moves;
- an acceptance case needs a seventh sibling.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the next wave.

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (predicted: `importScrub.js +10`; `galleryImportSettlement.js`, `galleryImportMap.js`, `accountImport.js` **2 changed / 0 added** each; the two test files):
- The net-zero proof, per call site: `git diff -U0 -- <file>` showing exactly two changed lines and ZERO added lines:
- Acceptance cases A1–A6, and the TWO counterforces §8 step 2 requires, quoted beside A2 and A4 (the planted mutant, its red title, the restored SHA-256, the re-run green):
- Focused commands, exits, and counts (every gate line carrying a printed test count):
- `tests/lint` in its two instrument halves (§10): the EXCLUDED directory run (exit 0) and the lighting walker ALONE (the named interior red). Exit, count, and wall-clock for each:
- The observed-shape register: `node scripts/check-observed-shape-readers.mjs` exit captured from the command itself, with its finding count before and after — predicted **identical, zero rows moved**:
- The lighting census delta, re-derived at the terminal against the DELTA predicted in §10 (`files +0 · parked +0 · credited +0 · titles +6 · suiteTitles +1`) applied to the baseline the chair stamped at promotion — and the pre-proof's `parkReasonsFor` output for both files:
- Both typecheck configurations, by name:
- Dormancy/golden result (posture UNCHANGED): the two `shasum -a 256` values before the first edit and after the last, identical:
- Bundle/first-paint result: the four budgeted closures were priced at compile and this packet reaches **NONE** (§7); report the terminal's own measured worker bytes, engine-chunk bytes and first-paint closure against their unchanged ceilings, plus the receipt that none of the four paths is in `townSceneExport.worker`'s or `advanceInterval.worker`'s closure either:
- Generated artifacts: `NONE` (re-derived from the five edge-shared metas' own `inputs`; zero hits):
- Registers moved: observed-shape `0 rows` / mutation-coverage `n/a on BOTH arms` / wiring census `unmoved` / prose-numerics `n/a` / size-baseline `n/a` / anchor ceilings `unmoved` / test ratchet `unmoved` / bundle ceilings `none touched`:
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation — carried forward from the compile so the chair can slot each one (the owner's law: there is never deferred work):
  - ⛔ **`tests/lib/editTravel.test.js`'s DOCBLOCK CLAIMED AN IMPORT ARM THAT DID NOT EXIST** until this packet. Recorded because the class matters more than the instance: a suite header that names four surfaces while its body executes three is the shape a reader trusts and a gate cannot see. Whether the estate wants a walker for it is the chair's to slot.
  - The three `importScrub.js:115-121` / `:158-166` citations are wrong by the docblock's one line after this packet unless §13 Q2 rules otherwise; state which way it was ruled and what was done.
  - `tests/lint/sourceCitationIntegrity`'s ARM 1 is a **past-EOF** arm only — a citation that has drifted to the wrong line, but not past the file's end, is invisible to every gate (ARM 3, the symbol arm, is report-only and reaches 5.6 % of live-code citations). Recorded, not investigated.
- Judgment calls: `NONE` beyond the four questions of §13, each of which is the chair's.

## 13. Questions only the chair can answer

**Q1 — THE BUDGET OVERRIDE (blocking; the packet may not be dispatched without an answer).** §3 exceeds the standard's *"at most three existing logic-bearing production files modified"* (this packet: **4**) and *"at most two direct production consumers"* (this packet: **3**). Both overruns have one cause: the module's own single-writer law makes 1 definition + 3 call sites the minimum, and a split would land the exact one-path-only defect `importScrub.js`'s docblock and `tests/lib/importScrub.test.js`'s address arm exist to prevent. **The compile lane's recommendation: APPROVE the override, recorded in §3 as `existing logic-bearing production files modified, 3 → 4` and `direct production consumers, 2 → 3`.** The narrower alternative, if the chair prefers a rule to an override: mint a **CALL-SITE row class** — the sibling of §P2 row 14's ADDRESSES-ONLY CITATION row — for a production file whose only edit is a one-token functional wrap of an existing expression at an existing seam, adding zero branches, zero statements and zero effective lines. That would put this packet at 1 logic file and 3 call-site rows, inside every cap, and would serve every future strip at a shared seam. The lane recommends the override for THIS packet (it is already provided for by the standard) and offers the rule as the chair's own act, because minting a budget class is not a lane's to do.

**Q2 — THE THREE CITATIONS INTO `importScrub.js`.** Amending the module docblock from THREE STRIPS to FOUR costs a net `+1` raw line, which makes `importScrub.js:115-121` and `:158-166` wrong by one at three live sites (`src/lib/importReconciliationAdmission.js:442` and `:549`, `tests/lib/importReconciliation.test.js:604`). Measured: **no gate reds** — the citation walker's ARM 1 is past-EOF only, and 116-122 / 159-167 stay well inside a ~195-line file. The options are (a) accept the one-line drift and record it; (b) carry `src/lib/importReconciliationAdmission.js` as an ADDRESSES-ONLY **CITATION** row (§P2 row 14 — outside the logic cap) and `tests/lib/importReconciliation.test.js` as a comment-only TEST row, re-addressing all three; (c) leave the docblock saying THREE. **The lane recommends (b).** A module whose header undercounts its own exports is precisely the drift this module's header exists to prevent, the re-address is one token per row and costs no cap, and (a) leaves three knowingly-wrong addresses in the tree while (c) leaves a false header — both of which the estate's own laws refuse.

**Q3 — IS THE HONEST HOME A DIFFERENT SEAM?** The launch ruling asked this explicitly. Measured answer: **no.** The only place all three import paths already meet is `normalizeSettlement`, and it also runs on every load and save, so a drop there would erase the DM's own edits from their own saves — a data-loss defect of the same family as the one cured on the branch this month. `prepareSettlementEntry` covers the account file AND the reconciliation session AND `accountImportBody`, but it does not cover either gallery path. **The lane recommends the contracted shape — one function beside `scrubImportedTreasury`, called at the same three seams — and records that it improvised no second shape.**

**Q4 — SHOULD `recordRegister.js`'s `NOT_YET_WRITTEN_KEYS` BE A `requiredSymbols` ROW?** It is included, because a later edit that silently removes `dmLayer` or `decrees` from that frozen list is exactly the change that would make this packet's dormancy claim stale, and a path-based substrate check would not otherwise see it. **The cost the chair should weigh: EM-C4a, the first writer of `dmLayer`, must MOVE that key out of `NOT_YET_WRITTEN_KEYS`, and a LANDED `requiredSymbols` row is asserted verbatim at every status — so EM-C4a would owe a `retiredSymbols` discharge for it.** The lane's recommendation: **KEEP the row and tell EM-C4a's compile that it owes the discharge** (it already owes a class-register edit, so the cost is one line in a packet that is editing that file anyway). If the chair would rather keep EM-C4a clean, drop the row — the fact stays recorded in §5 with its command, and nothing in this packet's correctness rests on it.

### THE CHAIR'S ANSWERS — 2026-09-21, at placement (Fable 5.1, session 4a1823e2; ODQ §934.47 addendum 124; vetoable)

- **Q1 — APPROVED (ruled 2026-09-20, stamped here):** `existing logic-bearing production files modified, 3 → 4` and `direct production consumers, 2 → 3`. One definition plus three call sites is the single-writer law's own minimum; a split would land the one-path-only defect the module's docblock exists to prevent. The CALL-SITE row class stays on the next preamble amendment's agenda as a rule for future strips.
- **Q2 — (a) FOR THIS PACKET, WITH THE RE-ADDRESS SLOTTED:** the docblock says FOUR (a header that undercounts its own exports is the worse falsehood); the three citations into `importScrub.js` drift by ONE line inside comments, no gate reds (the citation walker's ARM 1 is past-EOF only), and they are re-addressed as an ADDRESSES-ONLY CITATION row in the FIRST Edit-Mode packet compiled after this probe. The probe's change manifest stays exactly as compiled and pre-proofed: six rows.
- **Q3 — THE CONTRACTED SHAPE STANDS:** one function beside `scrubImportedTreasury`, called at the same three seams. `normalizeSettlement` is NOT the home: it runs on every load and save, and a drop there would erase a DM's own edits from their own saves.
- **Q4 — THE ROW IS KEPT.** `NOT_YET_WRITTEN_KEYS` stays a `requiredSymbols` row; EM-C4a, the first writer of `dmLayer`, owes the `retiredSymbols` discharge when it moves the key (one line in a packet that edits that file anyway): carried to EM-C4a's pre-proof.
