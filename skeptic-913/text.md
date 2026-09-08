# SKEPTIC 913 — LENS: THE TEXT CURES AND THE DEFERRALS (car 9)
⟦Seat: Opus 5 — Fable-unvalidated · refuter · dock `$SC/laneLMAT` tip `19642a9fce0817213040af0a0815ac5ced09fbbb`⟧
Taken 2026-09-07 19:2x–19:35 EDT (from `date`). Porcelain BEFORE 0, AFTER 0. Read-only throughout:
no edit, no commit, no checkout, no build, no vitest (see GATE).

## GATE — WHY NOTHING WAS EXECUTED IN VITEST
`$SC/HOLD-VITEST` absent at both checks. But `pgrep -fl vitest | grep -v gate-mutex | wc -l`
read **0** at 19:2x and **4** at 19:3x. Under the fence, no focused file was run. Every verdict
below rests on `git show`/`git grep`/`grep` at the tip, which I executed and read. The receipt's
green counts (12/6/14/…) are therefore UNTESTED by me and are not asserted here.

---

## THE HEADLINE — THREE FALSE SENTENCES CAR 9 EXISTS TO ERASE ARE STILL IN SHIPPED src/ AT ITS OWN TIP

Car 9's commit subject is "the false byte claim, the false hydration claim, the false reader
claim". Each cure was applied only at the sites the fold happened to enumerate. A grep of the tip
for the sentences themselves finds survivors the fold never listed, and none is in the DEFERRED
list.

### F1 (HIGH) — the FALSE HYDRATION sentence survives inside an executable `why` string IN THE
### VERY FILE CAR 9 EDITED
`src/domain/density/densityCreateBoundary.js:142`, inside
`PIPELINE_REACHERS['src/store/settlementGenerateAction.js'].why`:
> `+ 'screen it explicitly mints a new identity. state.config is never hydrated from a '`
> `+ 'saved settlement, so fullConfig cannot carry an existing world\'s law. It mints '`

That is DEF-11's exact false claim, in the same shipped-executable-string form that the fold and
the receipt both treat as the AGGRAVATING factor for DEF-10 (`:326`). Car 9 corrected the
docblock at `:48` and the `GENERATION_LAWS.livingContent.why` at `:374` and left this one
untouched, 230 lines above the second edit. Diff check: `git show 19642a9fc -- densityCreateBoundary.js`
touches only the `:45–58` and `:325–380` regions.

### F2 (MEDIUM) — a FOURTH hydration site, stated as a hard-won measurement
`src/domain/density/densityLaw.js:62`:
> `* was OVERTURNED on executed evidence in the same car: state.config is the wizard's`
> `* FORM state and is never hydrated from a save, so the store's generate action is an`
> `* unambiguous birth. The correction is kept rather than deleted because …`

The false claim is presented there as a correction earned by execution — the most misleading
possible form, and the one a successor is likeliest to trust.

### F3 (MEDIUM) — the FALSE BYTE-IDENTICAL sentence survives at a third site
`src/domain/content/livingContentLaw.js:153–155`:
> `* 238, dropped the boundary out of it, and left every emitted dist file`
> `* byte-identical — so the import below this comment is a lazy -> lazy edge …`

Byte-identical at base `7d96e2b72` and at HEAD (`git show 7d96e2b72:… | grep -n` finds it at the
same `:153`). The tip-wide grep for the phrase returns exactly two hits: car 9's own correction
note in `densityCreateBoundary.js:332`, and this uncured one.

### F4 (LOW/MEDIUM) — the "false friend" tense car 9 fixed survives in two more places
Car 9 rewrote the seam-arming comment in `livingContentLawWiring.test.js` from "the same path
production takes" to "WOULD take", and the receipt calls that out by name. The identical wording
is still at `tests/domain/livingContentMaterialization.test.js:76` and `:95` — a second file that
arms the seam by hand and tells its reader this is production's path.

---

## THE LENS, ITEM BY ITEM

### (a) DEF-10 — the figures, and whether the sentence is now true
**Traceability — CONFIRMED.** 658 / 1,377 / 0-changed-size all reproduce upstream of car 9:
- `$SC/receipt-l-mat.md:47–48` (the L-MAT section the lens names): "A vs B: 0 chunks ADDED,
  0 chunks REMOVED, **0 files changed SIZE.** 658 files re-hashed (347 JS chunks + 311 prerendered
  HTML documents), every one byte-length-identical."
- `$SC/skeptic-912/build.md:16,32` re-measures it: 719 identical + 658 not; 311 html + 347 js.
- Arithmetic checks: 311+347 = 658; 658+719 = 1,377. `$SC/lmat/build-base.meta` reads
  `LISTING_LINES=1377`, as do all five metas.

**The sentence — CONFIRMED true, with one framing correction.** The docblock (`:328`) and the
`why` (`:374`) now say "NO EMITTED DIST FILE CHANGED SIZE" / "no emitted dist file changing SIZE
(658 of 1,377 changed BYTES …)". Both are scoped to the car-1 re-export cut and are true of it.

⚠ **The "a walker reads it" framing is weaker than stated.** I read every `.why` assertion in
`tests/lint/densityCreateBoundary.walker.test.js` (`:247`, `:427`, `:435`): all three assert only
`String(row.why || '').length > 40|60`. **No instrument reads the CONTENT of any `why` string.**
The string is shipped source data, not a verified claim — which is exactly why F1 above could sit
in a sibling `why` for the whole consist without reddening anything.

### (b) DEF-11 — do all three sites name the Library Load hop and the clamp?
**CONFIRMED for the three named sites; the CURE IS INCOMPLETE (F1, F2).**
- `densityCreateBoundary.js:49–58` — names `updateConfig(migrateConfig(data.settlement?._config || data.config))`,
  `SettlementsPanel.jsx`, `SettlementDetail.jsx`, `isAllowedConfigKey: key.startsWith('_')`, and the CLAMP. ✔
- `settlementGenerateAction.js:123–133` — names the Library hop and the CLAMP. ✔
- `livingContentLawWiring.test.js:413–424` — names both. ✔

Underlying facts re-derived, not taken on report:
- `src/components/SettlementsPanel.jsx:102–103`: `const rawConfig = data.settlement?._config || data.config;` /
  `if (rawConfig) updateConfig(migrateConfig(rawConfig));` — exactly as quoted. ✔
- `src/store/configSlice.js:99–103`: `isAllowedConfigKey` returns true on `key.startsWith('_')`. ✔
- `src/components/SettlementDetail.jsx:606` carries the "Apply Saved Configuration & Regenerate"
  label (the fold said `:605` — off by one at the tip; no shipped comment cites the number).

### (c) DEF-12 — "exactly ONE reader"
**PARTLY, and the cure re-commits the defect it was written to fix.**

⛔ **THE CITATION IS WRONG AT ITS OWN COMMIT.** The new sentence in
`tests/security/livingContentRosterPublicDrop.test.js:12–14` reads "which `livingContentRoster.js:37`
names". At HEAD, `livingContentRoster.js:37` is
` * own header: the living-content definitions "deliberately have no automatic` — an unrelated
paragraph. The named fact is at **`:57`**. Car 9 itself pushed it down by adding ~20 header lines
in the same commit. DEF-12 exists *because* the old sentence cited a header its own consist had
already amended; the cure ships a citation its own car invalidated.

**The count.** `grep -rn customContentRoster src/` at the tip, classified:
- value reads: `accountImportBody.js:467`, `:526`, `:528` — one file, one logical remap, **three sites**;
- writes: `generateSettlementPipeline.js:185`, `accountImportBody.js:474`, `:532`;
- existence tests: `importReconciliationAdmission.js:484`, `importScrub.js:141`;
- destructure-to-discard: `importScrub.js:149`; delete: `publicSafe.js:308`, `importReconciliationAdmission.js:485`.
"Exactly ONE reader" holds for *one consuming file*; it does not hold site-by-site, and car 7/9
added two of the three read sites. The cited file's own wording ("Nothing reads the key for its
CONTENT") carries the qualifier the security test's sentence drops. **No display, export or
projection surface reads it — CONFIRMED** (`publicSafe.js` deletes, never reads).

### (d) R-J — the outage
**CONFIRMED in substance; PARTLY on the counting sentence.**
- `grep -rn loadLivingContentRoster src/` at the tip returns **3**: `livingContentSeam.js:92`
  (the definition), `livingContentSeam.js:64` (a comment), and `livingContentRoster.js:7` —
  car 9's own new header. At base `7d96e2b72` it returned **2**, which is the figure the receipt
  quotes. **No caller** — CONFIRMED, and that is the load-bearing half.
- `registerLivingContentRosterBuilder` in `src/`: defined at `livingContentSeam.js:71`, called only
  from `loadLivingContentRoster` (`:95`). No other src caller. So the builder is never registered
  in the product. CONFIRMED.
- **The throw is at `livingContentSeam.js:111`** — `throw new Error('[livingContentSeam] v2 world,
  roster payload not loaded');`, inside `livingContentRosterFor` (`:108`), reached from
  `generateSettlementPipeline.js:180` after the `materializesLivingContent(config)` gate. CONFIRMED,
  line-exact.
- **The four homes — CONFIRMED, all present at the tip** (and a fifth): `livingContentRoster.js:5–14`
  (⛔⛔ first paragraph); `livingContentLawWiring.test.js:41–52` (docblock) and `:95–101`
  (the seam-arming comment, now "WOULD take"); `livingContentRosterPublicDrop.test.js:263–266`
  (the DM-full arm's failure message, landed in car 8); plus that file's header `:39–50`.

⚠ **But all three "counting" sentences are false at their own commit.** `livingContentRoster.js:8–9`
ships "it appears in `src/` exactly twice: its own definition and one comment beside it"; the
wiring docblock and the security header say the same. The sentence itself is the third occurrence.
The claim they exist to make (no caller) survives; the count does not.

### (e) R-I — the four options, the narrow digest, the outranking fact
**The four options as written — CONFIRMED** present in the receipt (`:572–584`), matching the fold
(`FOLD.md:263–279`) and the brief's R-I. **No bytes shipped** — car 9's diff touches five files and
none is a provenance/receipt module. CONFIRMED.

⛔ **THE NARROW DIGEST'S REFUTATION IS ITSELF REFUTED.** R-I records: "the product's
`makeContentRevision` is CONTENT-ADDRESSED (`revision:${definitionId}:${number}:${contentHash.slice(0,16)}`),
so the narrow digest is not blind in the product — the blindness belonged to the fixture."
Reading the product:
- `src/domain/content/customContentVersioning.js:199`:
  `id: revisionId || \`revision:${definitionId}:${number}:${contentHash.slice(0, 16)}\`` —
  the content-addressed form is a **FALLBACK**, taken only when no `revisionId` is passed.
- `grep -rn 'makeContentRevision(' src/` returns exactly **one** product caller:
  `src/lib/customContentLocalLedger.js:385`, and it passes **`revisionId: makeCustomContentUuid()`**.
- `makeCustomContentUuid` (`customContentLocalLedger.js:77–88`) is `crypto.randomUUID()` with a
  `Math.random()` fallback.
⇒ **Every revision id the product mints is a random UUID and carries no content.** The narrow
digest (`definitionId` + `revisionId`) IS blind to a content change in the product, on the product's
only minting path. The fixture's hand-written `revision:<bucket>:<localUid>:1` was, on this point,
faithful to the product rather than lying about it. The lane's original ground for rejecting
option 2 is restored; R-I's "REFUTED" label on it is wrong. This is recorded as an input to an
OWNER-GATED persisted-shape decision, which is why it is rated HIGH.

⚠ **THE "OUTRANKING FACT" IS OVER-GENERAL.** `buildSettlementContentProvenance`
(`src/domain/content/settlementContentProvenance.js:369–381`) returns `null` only when
**all three** of environment, `bindingHash` and `definitions.length` are empty:
`if (!environment && !bindingHash && definitions.length === 0) return null;`
`environmentReference` (`:344–359`) returns non-null whenever the run's context carries an
`environmentId` + `environmentRevisionId` + sha256 `environmentHash` — i.e. a **reviewed
environment**, which is precisely the precondition for a roster to exist at all. The estate's own
lit fixture proves the coexistence: `livingContentRosterPublicDrop.test.js:236–240` asserts BOTH
`settlement[ROSTER_KEY]` and `settlement[PROVENANCE_KEY]` truthy on one `litSettlement()`
(`generateSettlementPipeline` + `identifyCustomContentPack(customContentReferencePack())`).
⇒ "returns null for a world with only a roster" is true of the degenerate case; "so no receipt
exists to carry the marker **on the very worlds R-C targets**" is not established, and the estate's
own fixture is a counterexample. It should not be presented to the owner as the fact that
outranks all four.

### (f) X8 — does `writerReach.walker` read one declared writer per row?
**CONFIRMED, by reading both the walker and the register.**
- `scripts/lib/writer-dark-register.mjs:81–84`: the row `customContentRoster on settlement`
  declares a **single** `writer: 'src/generators/generateSettlementPipeline.js'`.
- `tests/lint/writerReach.walker.test.js:798`:
  `expect(writeShapesIn(read(row.writer), row.key), …).toEqual([])` — one path, read once.
  `:766` shows `writer` is a single repo-relative src string.
⇒ the 56-green cannot see `accountImportBody.js:474` (car 5) or `:532` (§912's version-history
loop). Two undeclared assignment sites; the receipt's "second … now a third" counting is exact.
The shipped header sentence (`livingContentRoster.js:64–72`) states it truthfully and does not
widen the walker. CONFIRMED.

### X12 — CONFIRMED, executed
`git show 3b1c0eaa5:tests/lint/densityCreateBoundary.walker.test.js` has
`'src/store/settlementSliceHelpers.js'` at `MINT_HOMES:51`; at `442c7f988` (car 1) the row is gone.
The deletion is car 1's, not car 3's.

### X13 — CONFIRMED, executed
`$SC/lmat/build-base.meta` line 1 reads `Mon Sep  7 10:58:11 EDT 2026`; line 4 `10:58:33`.
The receipt's `:39` still reads "11:58:11→10:58:33" — the correction sits only in the X13 row
500 lines later, so a successor reading the BUILD LISTINGS table still inherits the typo. LOW.

### (g) THE DEFERRED ROWS — deferral, bug, or mislabelled cure?
| # | row | ruling |
|---|---|---|
| 1 | R-J: the loader has no caller | **A REAL DEFERRAL the chair must carry.** Wiring it is a capability change; recorded in five places; nothing ships broken while the dial is dark. CONFIRMED. |
| 2 | DM-full SQL twin | **A REAL, OWNER-GATED DEFERRAL, and the security claim CHECKS OUT.** Net-current `_gallery_dm_full_json` is `129_strip_latent_pantheon_gallery_dm_full.sql:41`; its delete chain is `- 'aiData' - 'aiDailyLife' - 'aiSettlement' - 'dossierNotes' - 'dmNotes' - 'notes' - 'narrativeNotes' - '_seed' - '_regenSeed' - '_config'` plus a config-level `- '_seed' - 'latentPantheon'`. **Neither key is stripped.** Client half landed (`publicSafe.js:308–309`). ⚠ Citation nit: the function is DEFINED at 030/031/099/121/**129**; 120 only mentions it. "migrations 120/129" should read 129 (net-current). |
| 3 | R-I / car 6 | A real deferral, but its RECORDED GROUND is defective — see (e). Carry the row, not the reasons. |
| 4 | X8's walker hole | A real deferral. CONFIRMED above. |
| 5 | three walker holes, largest `settlementSlice.js:45` | CONFIRMED: `git show HEAD:src/store/settlementSlice.js` line 45 is `_enginePromise = import('../generators/generateSettlementPipeline.js')…` — a live dynamic-import pipeline reacher. Real deferral. |
| 6 | OSR/writer-reach blind to import boundaries | Real deferral; consistent with the car-7 DEF-3 re-cut evidence. Not re-derived here (out of lens). |
| 7 | `node_modules` 455 | Real, trivial, correctly not acted on. |
| 8 | +36 first-paint bytes | Not a deferral but a recorded behaviour shift, correctly refused the round-down. Not re-derived (no build taken). |
| — | **F1–F4 above** | ⛔ **MISSING.** Three uncured instances of the two false sentences this car exists to erase, plus two of the false-friend tense — none deferred, none recorded, none in any header. They are not deferrals; they are the cure's incompleteness, and a successor grepping for "never hydrated from a saved settlement" will find the false claim in an executable string and believe it. |

## WHAT I DID NOT TEST
- Every green count in "THE CONSIST PROOF" (12/6/14/17/26/31/13/6/18/9/56/44/…): UNTESTED —
  four vitest processes were live when I reached that step and the fence forbids running under them.
- The two builds and the +36 B / 1,042,122 figures: UNTESTED — no build permitted.
- Cars 7 and 8 substantively (other lens).
