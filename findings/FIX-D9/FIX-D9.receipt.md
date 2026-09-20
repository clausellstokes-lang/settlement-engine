# FIX-D9 — receipt

**Outcome:** the four dark modules are dispositioned, the disposition is executable, and one
module is retired under a signed decision. **Three commits on `fix-dead-generators-2026-09-20`,
base `6a3e8089f`, working tree CLEAN.** Stamp `Sun Sep 20 13:20:38 EDT 2026`.

| sha | subject | paths |
|---|---|---|
| `dbf3d09fe` | the three dark density modules dispositioned DARK-BY-DESIGN, nothing deleted | 4 |
| `3a5618ed8` | foldTradeCategories RETIRED, with its test and its no-op excision row | 5 |
| `47197c30a` | the dead-code disposition made executable by a walker that parses the doc | 2 |

`git show --stat` on each named ONLY its own files. `git status --short` empty. The hook mangled
nothing: the canonical line is intact in all three modules at HEAD, `titularSuccession.js:29` is
still the cited sentence, and the RETIRED arm is in the committed walker.

## The measurement (CONFIRMED, executed)

- **Importers by resolved path** over 5,297 files across `src`/`tests`/`e2e`/`scripts`/`api`/
  `supabase`: all four modules had **exactly one importer each, every one a test file**.
- **Unreachable from all seven build entries** (including `src/utils/pdfRender.worker.js`, which
  is *not* under `src/workers/`). **248 of 2,247 `src/` modules are reachable from no entry.**
- **ESD/eager, non-circularly:** `ENGINE_SHARED_DOMAIN` seeds from every file under
  `src/generators/`, and the eager graph seeds itself from ESD — so the obvious check answers
  itself. Re-running both shipped derivations with the trio skipped: **ESD 51 → 49, EAGER 268 →
  266**; `titularSuccession.js` alone holds `factionLifecycle.js` and `cohesionWeave.js`.
  35,400 B is **SOURCE**, deliberately not reported as emitted bytes. → **FIX-B3**.
- **`foldTradeCategories` was superseded**, traced through history: born with its importer at
  `d855b58fc8`, replaced by `projectOwnedCustomTradeDirection` at `c1ea091f7a` (which takes the
  old input as `legacySatisfies`). §14 still ships. Its excision row was **1 of 18 no-ops**; the
  list is now **17 rows, 0 no-ops**.

## The gate

| step | result |
|---|---|
| eslint bare, 6 files | EXIT=0, no output |
| `tests/lint` WHOLE | **1 failed / 174 passed (175)** files · **1 failed / 2800 passed (2801)** tests |
| `tests/build` WHOLE | **52 passed / 7 skipped (59)** files · **419 passed / 119 skipped (538)** tests, EXIT=0 |
| `tests/domain` WHOLE | **985 passed (985)** files · **16642 passed (16642)** tests, EXIT=0 |
| observed-shape | EXIT=0, 1964 findings, byte-identical to the pre-edit control |
| goldens | byte-identical at gate start and end |

The **only** red is the lighting census, and it is mine and expected. The 7 dist-skipped build
files (no `VERIFY_DIST=1`): `factionRenameDoorLazy`, `firstPaintNonJs`, `interiorLazy`,
`loadingJourneyLazy`, `pendingEditProseLazy`, `townMapLazy`, `versionDiffLazy`. ⭐
`engineChunkLazy.test.js` is **not** among them — its excision-partition arms ran and passed.

## Counterforce, three ways, each mutated alone

| | result | the red |
|---|---|---|
| (a) header removed | 1 failed / 9 passed (10) | `titularSuccession.js: carries NO '// dark-until:' line` |
| (b) importer planted | 1 failed / 9 passed (10) | `densityAscension.js (DARK-BY-DESIGN) is imported by: src/lib/fixd9CounterforceProbe.js` |
| (c) retired path re-created | 1 failed / 9 passed (10) | `...records as RETIRED is back on disk: src/domain/region/foldTradeCategories.js` |
| (d) restored | **1 passed (1), 10 passed (10)** | SHA back to `f455ebef…e626`, `git status` clean |

## The lighting delta — recorded, NEVER refrozen

Frozen: `files 2656 · parked 383 · credited 2273 · titles 25074 · suiteTitles 6684`.
The walker asserts in order and stops at the first miss, so **files, parked and credited passed
UNCHANGED** (one credited file in, one out — net zero, executed). It stopped at **titles
25074 → 25077, +3**, this lane's whole delta (+10 from the new walker, −7 from the deleted test).
⚠ **`suiteTitles` was never evaluated.** By arithmetic it is +1; that figure is **PREDICTED, NOT
MEASURED**, and the chair should re-measure at the refreeze. The baseline file is untouched.

## ⛔ Noticed, and each specific enough to slot

1. **The prose wiring census red was MINE, and I did not assume either way.** `tests/lint`
   reddened on `proseWiringCensus.walker.test.js` ("stale-bytes"). Restoring the deleted module
   alone took that walker from 2 failures to **78 passed (78)**, which convicts the deletion. The
   `--dry` door priced it exactly: **rows 0, shas none, bytes 2060817 → 2060817; the only delta is
   `stamp.producerIndexFiles` 1172 → 1171**. Regenerated (one line); the prose leaf did not move,
   so the forced-order hazard did not apply. **Judgment recorded vetoably in the commit.**
2. **⭐ THE FINDING TOOL-15b INHERITS — the class is live, not hypothetical.**
   `sourceCitationIntegrity`'s symbol arm is **REPORT-ONLY** (its own comment: *"Never an
   assertion on the count"*), and it **let a 226-line stale citation ride through three composed
   commits**. This is the first live instance.
   - **How it surfaced:** my own near-miss. A 7-lines-for-1 note in `vite.config.js` shifted
     `testTimeout` 912 → 917 and staled two citers; the detector saw it only as `codeSym 3 → 5`,
     so the gate would have passed green. I cured mine by making the edit line-neutral.
   - **The real instance, measured by walking every commit from my base to the slot tip:**
     FIX-B2's three landings moved `testTimeout` **912 → 1040 (`05bd8d074`) → 1110 (`bb1f15dd0`)
     → 1138 (`ede9b5300`)**, while `tests/lint/siteCoherenceRatchet.test.js:69` and
     `tests/scripts/implementationSession.test.js:187` still said `:912`. Nothing red. Not past
     EOF, so the EOF arm could not see it either. **Ruled by the chair into commit 4 (`FIX-B2b`)
     of this composition.**
   - **A THIRD, of an older vintage:** `tests/data/dossierStateProseProjection.contract.test.js:1509`
     cites `vite.config.js:877-878` for the `/src/data/` → `data-lazy` rule; at the slot tip those
     lines are unrelated prose, and at my own base they were the `narrativeData` force-route — so
     it was already imprecise **before FIX-B2 and before this lane**. Outside the chair's
     two-file scope for commit 4; it shows the class is a standing property of line-addressed
     citations into a churning config, not a FIX-B2 artifact.
     ✓ **CLOSED WITH A SLOT, not deferred: TOOL-15b's brief carries it as its second instance**,
     to cure while it brings the asserted symbol arm to a zero baseline (the chair, 2026-09-20).
   - **The shape of the cure, now TOOL-15b's brief:** the symbol arm stops being report-only for
     `CODE_TREES` (where citations are already gate-wired with no baseline), and config citations
     move to symbol-addressing. This lane's line-neutral trick is a local dodge, not the cure.
3. **248 `src/` modules are reachable from no build entry** — TOOL-23, which reuses this scanner.
4. **The walker proves zero importers, not unreachability.** A module imported only by another
   dark module would pass. Stated in the walker header, the manifest row and the doc. → TOOL-23.
5. **A mutation plant in a module imported only by its own test** can be killed by that one file
   alone — weaker than the promotion-path sentence implies. → TOOL-6b's family.
6. **`vendorPdfLazy.test.js`'s FP-G7 history comment still names `region/foldTradeCategories`.**
   Left deliberately: it is an accurate statement about what FP-G7 did in 2026-07, not a claim
   about the current tree. A future reader greps the name and finds history plus the RETIRED row.
7. **`scripts/wiring-census.mjs:349` cites `defenseGenerator.js:189-191`** but `economicGates` is
   declared at 467/647 — one of the 3 standing report-only symbol findings, pre-existing and not
   mine. Named because it is in the same class as item 2.

## Provenance, stated plainly

The retirement rests on an owner grant relayed by the chair, which this lane cannot verify. The
chair owns it (§934.47 addendum 98) and the doc records it as the chair's vetoable use of the
grant. The engineering case was measured before the ruling, and the deletion is reversible on an
unpushed branch. `src/domain/customContentSchema.js` is in the retirement commit **by the chair's
explicit acceptance**, named as such in the commit body.
