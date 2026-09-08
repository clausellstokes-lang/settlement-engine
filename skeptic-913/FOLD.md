# §913 SKEPTIC FOLD — L-MAT-FIX cars 7–9 (`f46ba7846` · `2fd5a380e` · `19642a9fc`)
⟦Seat: Opus 5 — Fable-unvalidated (FOLDER) · dock `$SC/laneLMAT`, tip
`19642a9fce0817213040af0a0815ac5ced09fbbb` · four lenses folded: behaviour · instruments · text · proof⟧
Taken 2026-09-07 19:42–19:46 EDT (from `date`). Read-only: no edit, no commit, no checkout, no build,
no vitest. Where a lens verdict decided a HIGH I re-measured it myself in the dock; those rows carry
**(fold-re-measured)**.

⛔ **THE RULE THIS FOLD APPLIES.** Every figure below is the FOLD's, never the receipt's. A receipt
sentence and a lens measurement that disagree are settled on executed evidence; where two lenses
disagree the row says which evidence is stronger and why.

---

## (1) THE TABLE — every receipt claim tested

### CAR 7 — BEHAVIOUR (DEF-1…DEF-5, REFUSAL 5, the DEF-3 re-cut)

| # | receipt claim | verdict | lens / figure |
|---|---|---|---|
| 1 | DEF-1 cure lands on BOTH gallery paths; reference-identical when nothing to strip | **CONFIRMED** | behaviour — `galleryImportSettlement.js:71`, `galleryImportMap.js:293`; exactly two gallery importers in `src/store/`; the early return is real and armed |
| 2 | DEF-1 BEFORE: "the gallery ingest copied … from a foreign account's dossier" | **PARTLY** | behaviour — the default public projection is a 40-key ALLOWLIST (`_gallery_sanitize_public_json`, net-current 189) naming neither record; the leak reaches the ingest only through the DM-full opt-in. The row needs "on a DM-shared dossier" |
| 3 | REFUSAL 5: the destructure is shared by three import paths, and the refusal's arm can fail | **CONFIRMED** | behaviour — `accountImport.js:610`, `galleryImportMap.js:301`, `galleryImportSettlement.js:82`; the arm calls `prepareSettlementEntry`, the caller of the shared scrub |
| 4 | DEF-2 BEFORE/AFTER (a LIT marker minted a roster; the clamp stops it) | **CONFIRMED, executed both directions** | behaviour — pre-cure marker `2` / roster `ROSTER`; tip `undefined` / `null`; the clamp arm carries its own positive control; wiring **12 passed** |
| 5 | DEF-3: "the only constructible identity map is the empty `archiveBacked:false` default" | **CONFIRMED** | behaviour — the boundary passes no archive; `accountContentPortability.js:276` is the only non-archive constructor |
| 6 | DEF-3: "every non-null record refuses anyway, **byte for byte the same outcome**" | **REFUTED** for one constructible case | behaviour (executed) — a provenance receipt with ZERO `materializedDefinitions` returns `{ok:true}` and is carried back unchanged; **fold-re-measured**: admission caps at `> 2_000` (`settlementContentProvenance.js:415`) and sets no minimum. The DROP is the stricter of the two — the ruling stands, the sentence is false |
| 7 | DEF-3: "the remapper import added **three** modules to `web-transitive`" | **REFUTED — it is two** | behaviour (closure probe) tip 898 → 900 with only the portability edge; **fold-re-measured** the frozen `closureSizes["web-transitive"] = 897`, so 898 = 897 + DEF-1's own leaf. Three is the CAR's total against HEAD, not the remapper's |
| 8 | DEF-3: "closure diff vs HEAD = `livingContentLawVersion.js` alone" | **CONFIRMED** | behaviour + fold arithmetic — 898 = 897 + 1 |
| 9 | DEF-3: `source on stress` flipped `web-transitive` N→R | **PARTLY** — mechanism CONFIRMED, the counterfactual walker RUN **UNTESTED** | behaviour — `scanSurfaceReads` grades it R from `settlementContentProvenance.js`; reproducing the walker red needs a dock write the fences forbid |
| 10 | DEF-3: `Object.hasOwn` is "the second half of the same decision" (instrument-avoidance) | **PARTLY** | behaviour — one uncalled-out behaviour difference: `customContentRoster: null` (key present) is now deleted AND reported `..._record_unmappable`. **fold-re-measured** `Object.hasOwn` at `importReconciliationAdmission.js:476, :484` |
| 11 | DEF-3 drop placement is a single path to `normalizedInput` | **CONFIRMED** | behaviour — `:606` / `:631` / `:677`, handed on at `importReconciliationExecution.js:53` |
| 12 | DEF-3 BEFORE: a foreign roster "reached `normalizedInput` … unwarned" | **CONFIRMED at its first hop, executed** | behaviour — reconciliation meta yields `versionHistory.length = 0` while the live settlement still carries the source id |
| 13 | DEF-4: every `versionHistory[i].settlement` takes the same remap-or-drop | **CONFIRMED** | behaviour — `accountImport.js:654`; both envelopes armed; slice **26 passed** |
| 14 | DEF-5: a local-only row is carried; unresolvable still refuses | **CONFIRMED, executed** | behaviour — pre-cure `..._identity_incomplete` → tip `ok:true`; four arms, not one; portability **17 passed** |
| 15 | THE PROMISE table — every named arm exists and asserts the row | **CONFIRMED** | behaviour — all six paths located by file and line |

### CAR 8 — INSTRUMENTS (DEF-6…DEF-9, R-G, U1)

| # | receipt claim | verdict | lens / figure |
|---|---|---|---|
| 16 | DEF-6: the deleted loop was a tautology | **CONFIRMED** | instruments — the set was built two statements above by spreading the same frozen keys |
| 17 | DEF-6: the kept `toContain` can die | **CONFIRMED** | instruments — `settlementGenerateAction.js` is not among the 23 pipeline reachers and is not `MINT_HOME`; revert the widening and it reds |
| 18 | DEF-6: the stray message now names the DIAL | **CONFIRMED** | instruments — walker **14 passed** |
| 19 | DEF-7: the key set is derived from the generated roster and anchored on `CUSTOM_DEFINITION_IDENTITY_KEYS` | **CONFIRMED** | instruments; **fold-re-measured** the derivation at `livingContentRosterPublicDrop.test.js:178–190`, threshold `length + 2` (5 keys) |
| 20 | DEF-7: "the count is **read off** the real row" | **PARTLY** | instruments — it is a `toBeGreaterThan` THRESHOLD against a derived number, not a read-off count |
| 21 | DEF-7: the "Non-vacuity for the census itself" arm proves the identity keys are covered | ⛔ **REFUTED — the arm cannot fail** | instruments; **fold-re-measured**: `rosterKeys` is built from `rows.flatMap(row => Object.keys(row))` and there are **0** `defineProperty` calls under `src/domain/content/`, so `Object.hasOwn(row,key)` ENTAILS `key ∈ rosterKeys`. It is a NEW tautology of exactly the shape DEF-6 deleted, and the regression it claims to guard turns the `if` false and the arm silently green |
| 22 | DEF-8 BEFORE: `regenNPCsPipeline` never returns `config`, so the three post-conditions were untouchable | **CONFIRMED** | instruments — `generateSettlementPipeline.js:474` |
| 23 | DEF-8: a positive control that can fail; the claim re-pointed at a failable arm | **CONFIRMED** | instruments — snapshot taken BEFORE the call; walker `:562` / `:567` die if the read order flips |
| 24 | DEF-9: both arms go through `expectAbsentWithAnchor` with a live sibling anchor | **CONFIRMED** | instruments — `:139`, `:154` |
| 25 | DEF-9: "**no per-file budget moved**" | **CONFIRMED by measurement** | instruments — `BARE_NEGATIVE_RE` counted base vs tip on all 8 touched files; `accountImportSlice.test.js` 9 = 9, its frozen row; walker **9 passed** |
| 26 | R-G: the DM share is a PUBLICATION switch, so the refusal condition does not hold | **CONFIRMED** | instruments — `ShareToGallery.jsx:452`, the owner's own words |
| 27 | R-G: the client half lands beside `dmNotes` / the seed carriers | **CONFIRMED** | instruments; **fold-re-measured** `src/domain/display/publicSafe.js:308–309`, unconditional inside `if (full)` |
| 28 | R-G: the SQL twin re-issues both keys | **CONFIRMED (twice, independently)** | instruments + text — the net-current delete chain in `129_…` names neither key |
| 29 | R-G: the twin is at "supabase migrations **120**/129" | ⛔ **REFUTED** | instruments + text agree 120 only CALLS it; **fold-re-measured**: definers are `030/031/099/121/129`, 120 has two call sites (`:54`, `:55`). ⚖ Where the two lenses part — instruments says write `121/129`, text says write `129` — **instruments is the stronger**: the same file already says `migration 121/129` at `:275` and `:323`, so the car ships two citations disagreeing about one function, and the wrong one is the one handed to the engineer told to amend the delete chain. Cure to `121/129`; 129 is the net-current body |
| 30 | U1: the `:251`/`:280` arms cover the plant, and the count is 12/2 | **CONFIRMED by derivation** | instruments — the third stray arm cannot fire because the law carries `wiring: 'WIRED'` |
| 31 | U1: clean and restored md5 `ad11078e…`, no plant residue | **CONFIRMED** | instruments + proof — dock, `git show`, worktree all agree |
| 32 | U1: the PLANTED md5 `25475df5…` | **UNTESTED** | instruments — a hash of a file that never existed in git; reproducing it needs a forbidden write. A claim, not a receipt |

### CAR 9 — TEXT (DEF-10…DEF-13, R-I, R-J, X8, X12, X13)

| # | receipt claim | verdict | lens / figure |
|---|---|---|---|
| 33 | DEF-10 figures 658 / 1,377 / 0-changed-size are traceable | **CONFIRMED** | text — 311+347 = 658; 658+719 = 1,377; `build-base.meta` `LISTING_LINES=1377` |
| 34 | DEF-10: the corrected sentence is now true | **CONFIRMED** | text — docblock `:328` and `why` `:374`, both scoped to the car-1 cut |
| 35 | DEF-10: the false sentence sat "inside the executable `why` string **a walker reads**" | **PARTLY — over-stated** | text; **fold-re-measured**: the walker's only `.why` assertions are `:247`, `:427`, `:435`, all `length > 40\|60`. **No instrument reads any `why` CONTENT** — which is exactly why row 37 could sit uncaught for the whole consist |
| 36 | DEF-11: all three named sites now name the Library Load hop and the CLAMP | **CONFIRMED** | text — three sites read; the underlying `SettlementsPanel.jsx:102–103` and `configSlice.js:99–103` facts re-derived, not taken on report |
| 37 | DEF-11: the false hydration claim was "re-shipped at THREE sites" (i.e. the cure is complete) | ⛔ **REFUTED — five sites, two uncured** | text; **fold-re-measured**: `densityCreateBoundary.js:142` carries it **inside an executable `why` string in the very file car 9 edited** (F1, HIGH), and `densityLaw.js:62` presents it as a correction earned on executed evidence (F2) |
| 38 | DEF-10: the false byte-identical claim was cured at the sites enumerated | ⛔ **REFUTED — a third site survives** | text; **fold-re-measured** `livingContentLaw.js:153–155`, unchanged since base (F3) |
| 39 | DEF-13: the "same path production takes" false friend was fixed | **PARTLY** | text — the identical wording survives at `livingContentMaterialization.test.js:76` and `:95` (F4) |
| 40 | DEF-12: "exactly ONE reader" | **PARTLY** | text — true of one consuming FILE; three read sites (`accountImportBody.js:467, :526, :528`), two added by cars 7/9. "No display, export or projection surface reads it" — CONFIRMED |
| 41 | DEF-12: the cure cites `livingContentRoster.js:37` | ⛔ **REFUTED — wrong at its own commit** | text; **fold-re-measured**: `:37` is the fixture-pack law paragraph; the reader fact is the ⚠ AMENDED paragraph at `:55–57`, pushed down by car 9's own header. The cure re-commits the defect DEF-12 exists to fix |
| 42 | R-J: no caller; the throw at `livingContentSeam.js:111`; the builder never registered | **CONFIRMED** | text — the load-bearing half of the outage |
| 43 | R-J: `loadLivingContentRoster` "occurs in `src/` **exactly twice**" | ⛔ **REFUTED at its own commit** | text; **fold-re-measured**: three occurrences at the tip (`livingContentRoster.js:7`, `livingContentSeam.js:64`, `:92`) — the counting sentence is itself the third. Shipped in three homes and in the receipt row |
| 44 | R-J: the four homes are present | **CONFIRMED** (a fifth too) | text |
| 45 | R-I: four options recorded; car 6 unbuilt; no bytes shipped | **CONFIRMED** | text — car 9's diff touches five files, none a provenance module |
| 46 | R-I: the lane's ground for rejecting the narrow digest is "REFUTED — the blindness belonged to the fixture" | ⛔ **REFUTED — the refutation is wrong** | text; **fold-re-measured**: the content-addressed id is a `revisionId \|\|` FALLBACK (`customContentVersioning.js:199`), and the product's ONLY caller (`customContentLocalLedger.js:385`) passes `revisionId: makeCustomContentUuid()` — `crypto.randomUUID()`. Every revision id the product mints is a random UUID, so the narrow digest IS blind in the product. The lane's original ground is restored. **HIGH — an input to an owner-gated persisted-shape decision** |
| 47 | R-I: "the fact that OUTRANKS all four" — the provenance receipt is null on a roster-only world | **PARTLY — over-general** | text; **fold-re-measured**: `settlementContentProvenance.js:380` returns null only when environment AND `bindingHash` AND `definitions.length` are all empty; a reviewed environment (the precondition for a roster) makes it non-null, and the estate's own lit fixture asserts BOTH keys truthy on one settlement. True of the degenerate case only |
| 48 | X8: the walker reads one declared writer per row, so the 56-green cannot see the 2nd/3rd sites | **CONFIRMED** | text — register `:81–84`, walker `:798` |
| 49 | X12: the `MINT_HOMES` deletion landed in car 1 | **CONFIRMED, executed** | text |
| 50 | X13: `build-base.meta` reads 10:58:11 | **CONFIRMED** | text — but the typo still stands in the BUILD LISTINGS table at receipt `:39`; only the X13 row 500 lines later carries the correction |

### THE CONSIST PROOF AND THE BUILD

| # | receipt claim | verdict | lens / figure |
|---|---|---|---|
| 51 | three commits, trailers, per-car file counts, union **18** | **CONFIRMED** | proof — 13 / 4 / 5, each matching its own commit message |
| 52 | no forbidden byte moved | **CONFIRMED** | proof — five frozen baselines md5-identical at base, tip and worktree; 0 hits for lockfiles, baselines, goldens, migrations |
| 53 | `typecheck:ratchet` exit 0, 173 / ceiling 173 | **CONFIRMED live at the tip** | proof — gate executed, baseline md5 unchanged after |
| 54 | the proof table's focused-file inventory | **PARTLY** | proof — 18 files, not 19; every one resolves at the tip |
| 55 | `negativeAssertionAnchor.walker` 9 passed, budgets EXACT | **CONFIRMED** (twice) | proof + instruments — the walker is byte-unchanged base→tip and enforces exact equality |
| 56 | `observedShapeReaders.walker` 44 passed | **CONFIRMED** | proof — 39.3 s |
| 57 | "`check-observed-shape-readers` = 1972, exactly the frozen inventory" | **CONFIRMED indirectly** | proof — frozen total 1972 / identities 1397, byte-identical base→tip→worktree; the script itself not invoked (it has a `--write` path) |
| 58 | the remaining consist-table greens — `accountImport` 31 · `importScrub` 13 · `campaignSlice.galleryImport` 6 · `writerReach.walker` 56 · `livingContentSeamLazy` 6 · `layerBoundaries` 3 · the four `VERIFY_DIST` files (15/10/9/42) · eslint on 18 files | **UNTESTED** (11 gates) | no lens re-ran them; the text lens was fenced out by 4 live vitest processes. Eight of the nineteen rows WERE re-run and all matched |
| 59 | the TIP build figures (8 files · 1,042,122 · 330,822 · 277,755 · 570,296 · 126,461 · 1,377) | **CONFIRMED** | proof — independently re-walked with the test's own BFS; every figure exact; raw margin 5,878 B |
| 60 | the three keys occur **zero** times in all eight first-paint chunks; carriers are lazy | **CONFIRMED** | proof — with the nuance that `importScrub-*` carries the two record keys, importing the marker as an alias from the lazy engine chunk |
| 61 | the new import edge is real; the leaf's importer set grows 6 → 7 | **CONFIRMED** | proof |
| 62 | the BASE column (1,042,086 / 330,813 / 277,727) | **PARTLY** | proof — arithmetic closes on all three deltas and matches the earlier Build-E record; not reproduced (a build is outside the fences) |
| 63 | "**WHAT THE 36 BYTES ARE — measured, not inferred**": engine-core's +9 is plumbing for the `livingContentLawVersion.js` leaf | **PARTLY — the location is measured, the causation is not** | proof — char 125,402 does fall inside the `export{…}` alias list (which begins at 124,583), but at the tip that leaf's constant lives in the lazy `engine-*` chunk, `engine-core` carries neither the literal nor `customContentRoster`, and `importScrub-*` imports nothing from `engine-core`. The causal story is **UNTESTED** |
| 64 | "the two tip builds produced identical chunk hashes" (determinism) | **UNTESTED** | proof — a build is outside every lens's fences |
| 65 | the +36 is stated, priced and repeated rather than rounded away | **CONFIRMED** | proof — framing honest; bolded, priced against the 5,914 B margin, and carried as DEFERRED row 8 |
| 66 | `node_modules` 455 "recorded, not acted on" | **PARTLY** | proof — `ls -A` 455 / `ls` 452; the three hidden entries are `.bin`, `.vite`, `.vite-temp`, and the BASE dock's listing is byte-identical by `diff`. **No package entered**; the framing leaves a reader suspecting a dependency moved |
| 67 | DEFERRED rows 1–7 are real deferrals, correctly not acted on | **CONFIRMED** | text — each re-derived; row 5's `settlementSlice.js:45` dynamic import verified live |
| 68 | DEFERRED row 8 is a deferral | **PARTLY** | text — it is a recorded behaviour SHIFT, not a deferral; correctly refused the round-down |
| 69 | the DEFERRED list is complete | ⛔ **REFUTED** | text — F1–F4 are in no deferral, no header and no row: they are the cure's incompleteness, and a successor grepping the false sentence will find it in an executable string and believe it |
| 70 | THE LAWS HELD — dial 1, no `--write`, no migration, no golden, no push, explicit staging | **CONFIRMED** | proof + all four lenses + this fold — porcelain 0 and HEAD `19642a9fc` unchanged at every boundary |

**COUNTS over 70 rows — CONFIRMED 44 · REFUTED 10 · PARTLY 13 · UNTESTED 3.**
Row 58 bundles 11 unre-run consist gates; the other two UNTESTED are the planted md5 (32) and
build determinism (64). Every PARTLY names the half that holds and the half that over-reaches.

---

## (2) CURES OWED BEFORE THE GATE
A cure never widens scope. Each is the smallest edit that makes the shipped byte or the receipt
sentence true.

### A. SHIPPED BYTES — these must land before the gate

| # | defect | file | the smallest cure |
|---|---|---|---|
| **C1** | ⛔ **HIGH — an arm that cannot fail.** DEF-7's "Non-vacuity for the census itself" loop is guarded by a condition its own assertion is computed from | `tests/security/livingContentRosterPublicDrop.test.js:191–195` | delete the `if` and the `for`; assert unconditionally: `expect(rosterKeys).toEqual(expect.arrayContaining(CUSTOM_DEFINITION_IDENTITY_KEYS))`. One line replaces four |
| **C2** | ⛔ **HIGH — the false hydration claim in an executable `why` string, in the file car 9 edited** | `src/domain/density/densityCreateBoundary.js:142` | the same clause car 9 wrote at `:48` and `:374`: name the Library Load hop and the CLAMP. One string, no logic |
| **C3** | the false hydration claim presented as a correction earned on executed evidence | `src/domain/density/densityLaw.js:62` | one clause — the Load hop hydrates `_`-prefixed keys; the clamp is why the birth is still unambiguous |
| **C4** | the false byte-identical claim, uncured at a third site | `src/domain/content/livingContentLaw.js:153–155` | car 9's own substitution: "changed no emitted dist file's SIZE (658 of 1,377 changed bytes)" |
| **C5** | the "false friend" tense in a second seam-arming file | `tests/domain/livingContentMaterialization.test.js:76`, `:95` | "takes" → "WOULD take", exactly as car 9 did in the sibling file |
| **C6** | a citation that names a call site as the definition, disagreeing with the same file fifteen lines up | `src/domain/display/publicSafe.js:302`; `tests/security/livingContentRosterPublicDrop.test.js:39`, `:252`, `:259` | `120/129` → `121/129` (the file's own form at `:275` and `:323`); 129 is the net-current body |
| **C7** | a line-number citation invalid at its own commit | `tests/security/livingContentRosterPublicDrop.test.js:13` | cite the paragraph by its marker — the ⚠ AMENDED (lane L-MAT, O-11 path 2) paragraph of `livingContentRoster.js` — not a line number |
| **C8** | a count that is false because the sentence is itself the third occurrence | `src/domain/content/livingContentRoster.js:8–9`; the wiring-test docblock; the security-test header | delete the number, keep the load-bearing fact: nothing calls it |

### B. RECEIPT SENTENCES — false or over-reaching as written

| # | sentence | the smallest cure |
|---|---|---|
| **C9** | DEF-3 "every non-null record refuses anyway, byte for byte the same outcome" | say the drop is **stricter**, and name the zero-definition provenance receipt the remap would keep |
| **C10** | DEF-3 "the remapper import added **three** modules to `web-transitive`" | **two** (897 → 899 against HEAD); the third is DEF-1's own leaf, present at the shipped tip |
| **C11** | DEF-1 BEFORE row | insert "on a DM-shared dossier" — the default public projection is an allowlist that already dropped them |
| **C12** | DEF-10 "inside the executable `why` string **a walker reads**" | "a walker length-checks"; no instrument reads `why` content — and record that as why C2 survived |
| **C13** | R-I option 2's "**REFUTED**" label | strike it; record that the product's only `makeContentRevision` caller passes a random UUID, so the narrow digest is blind in the product |
| **C14** | R-I "the fact that OUTRANKS all four" | qualify to the degenerate case; name the counterexample fixture; drop "outranks" |
| **C15** | DEF-3's `Object.hasOwn` framing | add the one behaviour difference: an explicit-null key is now deleted and reported |
| **C16** | `node_modules` 455 | name the cause — a hidden vite cache directory, the base dock's listing identical; no package entered |
| **C17** | "WHAT THE 36 BYTES ARE — measured, not inferred" + "identical chunk hashes" | downgrade to: location measured, causation and determinism **UNTESTED** |
| **C18** | X13's typo correction sits 500 lines from the table it corrects | fix `:39` in place as well |
| **C19** | the DEFERRED list omits F1–F4 | one row — and it is not a deferral, it is the cure's incompleteness |
| **C20** | U1's planted md5 | mark that cell **claimed, not verified** |

---

## (3) RATIFY · CORRECT · OWNER

**THE CHAIR MAY RATIFY AS LANDED** — the behaviour of cars 7 and 8, on executed evidence:
DEF-1's gallery strip on both paths, REFUSAL 5 and its arm, DEF-2's clamp in both directions,
DEF-3's placement and its single path to persistence, DEF-4's version-history remap, DEF-5's
local-only row, the PROMISE table's six arms; DEF-6, DEF-8 and DEF-9 whole (including the measured
"no budget moved"); R-G's client half and its share-model reading; R-J's outage in substance; X8,
X12, X13; the consist's law-holding (no baseline, golden, migration, register write or push); the
typecheck ratchet live at the tip; and the tip build figures, re-walked independently to the byte.

**NEEDS A STATED CORRECTION IN THE LEDGER ROW** — C9–C20 above, and the three that change what the
row CLAIMS rather than how it reads: DEF-7 ships a tautological arm (C1) — the row may not say the
census is non-vacuously covered until it lands; DEF-11 and DEF-10 are **incomplete cures**, not
complete ones (C2–C4); DEF-12's own citation is wrong at its own commit (C7). The ledger row should
also state plainly that **11 of the 19 consist-table gates were not re-run by any lens**, so the
row's green is eight-of-nineteen re-verified, not nineteen.

**MUST GO TO THE OWNER**
1. **The DM-full SQL twin.** The client half landed; the server function still re-issues both keys
   on every DM-shared dossier read back. A migration is owner-gated; the citation handed to whoever
   writes it is currently wrong (C6). Confirmed independently by two lenses and this fold.
2. **R-I, with its ground corrected.** The receipt tells the owner the narrow digest is not blind in
   the product. It is: the only minting path passes a random UUID. Any key on the persisted,
   hash-validated receipt is a persistence-shape change, and the owner should also be told that the
   "outranking fact" holds only in the degenerate case (C13, C14). **Do not put the R-I row in front
   of the owner until both corrections are in it.**
3. **The +36 first-paint bytes, as a declared behaviour shift.** Real, priced, inside budget by
   5,878 B, and correctly refused the round-down — but the receipt's causal explanation and its
   determinism control are UNTESTED (C17). Declare the shift; do not declare the cause.

---

## (4) PORCELAIN — every lens, before → after

| lens | dock | porcelain BEFORE → AFTER | HEAD |
|---|---|---|---|
| behaviour (car 7) | `laneLMAT` | **0 → 0** | `19642a9fc` unchanged |
| instruments (car 8) | `laneLMAT` | **0 → 0** | `19642a9fc` unchanged |
| text (car 9) | `laneLMAT` | **0 → 0** | `19642a9fc` unchanged |
| proof (consist + build) | `laneLMAT` | **0 → 0** | `19642a9fc` unchanged |
| **this fold** | `laneLMAT` | **0 → 0** (19:42:33 → 19:46:01 EDT, from `date`) | `19642a9fce0817213040af0a0815ac5ced09fbbb` unchanged |

**TWO FENCE READINGS RECORDED, NOT HIDDEN.**
- The instruments lens read **38** vitest processes immediately before one launch, six seconds after
  its own run reported finish; 0 on every other check, and no vitest ran after it.
- The proof lens's two runs touched an ignored cache path inside the dock; porcelain 0 either side.
- The text lens ran **no** vitest at all (4 live processes at its step), which is why 11 consist
  gates stand UNTESTED. That is a fence held, not a lens that skipped work.
