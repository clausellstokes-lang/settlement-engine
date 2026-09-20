# EM-P3 — COMPLETION RECEIPT (§12, filled BY EXECUTION)

**Lane:** Opus build lane, sealed dispatch, 2026-09-19 (16:13–16:47 EDT, clock read in-shell).
**Slot:** `$SP/lane-em-b3b` on `fixes-2026-09-18-consist`. **Scratch:** `$SP/lane-EM-P3-build-scratch/`.
Every figure below is CONFIRMED (executed, output quoted) unless labelled PLAUSIBLE.

## 1. Identity

- **Verified base:** `4928be0ab7210dff47429af788670f80947d36ad`. HEAD at dispatch `af36a626d`
  (the docs-only promotion commit; `git diff --stat 4928be0ab..af36a626d` touches only
  `docs/implementation/{INDEX.md,PACKET_MANIFEST.json,packets/settlement-editor/EM-P3.md}`,
  so the src/ and tests/ trees at the two shas are identical). **CONFIRMED.**
- **Landing commit:** `f4e5b64c5f1aad56710f21891bccb1943d05633b` on `fixes-2026-09-18-consist`.
  `git show --stat HEAD` names exactly the six manifest paths and nothing else; `git status --short`
  is EMPTY; `git diff HEAD` is empty. **CONFIRMED.**
- **Preamble hash check:** `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` =
  `1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6`, equal to the packet header. **CONFIRMED.**
- **Dispatch bundle and seal identity:** `npm run implementation:dispatch -- EM-P3` **exit 0**;
  `sealDigest a724675715ad80eeb5119c4204d7d049d038132dd4c968d858a749f6dee28067`,
  `capsuleDigest a43c69543c32cfd85e9e03f94fe878cd32f5c8a348fc87eb4f45acf82c6f87c5`,
  `verifiedBranch fixes-2026-09-18-consist`, sessionDir under the worktree's git dir. **CONFIRMED.**
- **§8 step 0 re-run of P-9:** `git grep -n "'plains'\|'germanic'" -- src/components/generate/
  src/components/GenerateWizard.jsx src/components/ConfigurationPanel.jsx` → **zero lines** (exit 1).
  The wizard still spells no terrain or culture list; no sixth row. **CONFIRMED.**

## 2. Exact changed files and effective-line deltas

Measured with eslint's own `Linter` under `max-lines { skipBlankLines: true, skipComments: true }`,
base text from `git show HEAD:<path>`, never `wc -l`.

| path | action | base | now | delta | budget |
|---|---|---:|---:|---:|---|
| `src/data/worldFactOptions.js` | CREATE | 0 | 9 | +9 | ≤ 40 |
| `src/domain/worldFactOptions.js` | CREATE | 0 | 10 | +10 | ≤ 45 |
| `src/generators/steps/resolveConfig.js` | MODIFY | 274 | 272 | **−2** | ≤ 6 net |
| `src/components/gallery/galleryUtils.js` | MODIFY | 102 | 103 | **+1** | ≤ 6 net |
| `tests/components/gallery/facetAlignment.test.js` | TEST | — | — | n/a | n/a |
| `tests/build/generationWorkerLazy.test.js` | TEST | — | — | constant + comment only | n/a |

Total production effective delta **+18** against the packet's ≤ 120. **CONFIRMED.**
`tests/build/vendorPdfLazy.test.js` was READ and quoted, **never staged** (ruling Q3): it does not
appear in `git show --stat HEAD`. **CONFIRMED.**

## 3. ⭐ The worker rise, quoted (§12's own row)

A real `npm run build` on both sides, each through the EXCLUSIVE mutex, in the same worktree with
the same `node_modules` (the control was built on the clean tree BEFORE the first edit, at
`af36a626d`, whose src/ and tests/ are byte-identical to the verified base).

- **W-before** `1,401,128` B (`generation.worker-DlyAm0eS.js`) — exactly the standing ceiling, i.e.
  the previous zero-slack mint reproduced to the byte.
- **W-after** `1,401,208` B (`generation.worker-ChvrnTyn.js`).
- **delta +80 B** against the packet's bound of **412 B** (its per-module estimate was +206 B).
- **modules moved, with rendered bytes at both ends** (kit wrapper, per-module `renderedLength`):
  - `src/generators/steps/resolveConfig.js` **14,417 → 14,304** (worker and preview worker);
    **14,413 → 14,300** in the lazy engine.
  - `src/data/worldFactOptions.js` **new → 2,500** (worker and preview worker); **new → 2,511** in data-lazy.
  - `src/components/gallery/galleryUtils.js` **4,987 → 4,990**, in the gallery's own lazy chunk only.
- **module count at both ends:** worker **230 → 231**; only `src/data/worldFactOptions.js` entered,
  nothing left. Lazy engine **114 → 114**, nothing entered or left.
- **the emitted `engine-<hash>.js` read:** `engine-BoIzryhg.js` 678,131 → `engine-BuReDgaE.js`
  **677,935 B**, a **−196 B SHRINK**, against the live `toBeLessThan(679_000)`:
  677,935 + 700 = **678,635 < 679,000**, so the ~700 B cross-environment margin is intact.
  READ and quoted; the file was never edited.
- **data-lazy** 1,031,052 → **1,031,367** (+315 B) against a ~2.16 MB allowance.
- **eager-set proof:** `EAGER_FIRST_PAINT_MODULES` re-derived from `vite.config.js` before the first
  edit and after the last: **268 modules both ends**, `diff` of the two sorted lists **EMPTY**, and
  neither new module is in the set. `engine-core-DEo3MRBd.js` kept its content hash and its 125,886 B.
- **ATTRIBUTION CONDITION (§8.9.3):** a whole-build sweep over **all 545 emitted chunks** finds
  **exactly THREE** modules whose rendered length moved ANYWHERE, and all three are EM-P3's own
  manifest paths (the three above). **`src/domain/worldFactOptions.js` is ABSENT from every one of the
  545 chunks** — nothing in production reads `WORLD_FACT_SOURCES` yet, so rollup shakes the citation
  index out entirely — and **`galleryUtils.js` is absent from the worker**. The placement cure holds,
  and measured it is better than the estimate.
- Three unrelated chunks moved **+1 B** each (`FoundingWorlds`, `SettlementsPanel`, `custom-registry`)
  with **no module's rendered length moving**: the data-lazy chunk's minified export-alias table gained
  entries, so those importers' alias identifiers are one character longer (visible in their import
  statements, e.g. `import{$ as tt,Y as et,G as rt,a0 as st}from"./data-lazy-CjZhM6od.js"`). None of
  the three carries a byte ceiling (`git grep` over `tests/build` and `scripts/.size-baseline.json`
  finds no size row naming them). **CONFIRMED**, mechanism PLAUSIBLE (read off the emitted imports,
  not re-derived from a second control).
- **The re-mint:** `WORKER_BUNDLE_CEILING_BYTES` `1401128 → 1401208`, the EXACT measured bundle
  (zero slack), with a dated attribution comment in `91d5f155b`'s form naming the moved modules with
  their rendered bytes before → after, the module counts, what the bytes ARE, that the citation map
  was placed out of the closure, the buy-back as the named alternative, the offer for the owner's
  ratification, and MONOTONE-DOWN from this value. **The lane re-minted under the standing conditional
  ruling** (ODQ §934.19 addendum 2 + the charter's amendment of 2026-09-19); the chair records the
  figures in the ODQ as a named, vetoable rise.
- **The monotone (anti-vacuity) proof:** constant set to **1401207**, run under `VERIFY_DIST=1` →
  **exit 1**, `AssertionError: generation worker bundle generation.worker-ChvrnTyn.js is 1401208 B;
  the ceiling is 1401207 B ... expected 1401208 to be less than or equal to 1401207`,
  `Test Files 1 failed (1) / Tests 1 failed | 10 passed (11)`. Restored to 1401208 and re-run green. **CONFIRMED.**

## 4. Focused commands, exits and counts (every line printed a count)

| command | exit | count line |
|---|---:|---|
| dispatch `implementation:dispatch -- EM-P3` | 0 | seal + capsule digests above |
| baseline `facetAlignment.test.js` (pre-edit) | 0 | `Test Files 1 passed (1)` · `Tests 6 passed (6)` |
| FAILING FIRST `facetAlignment.test.js` | 1 | `Test Files 1 failed (1)` · `Error: Cannot find module '../../../src/data/worldFactOptions.js'` |
| `facetAlignment.test.js` (final) | 0 | `Test Files 1 passed (1)` · `Tests 8 passed (8)` |
| `tests/generators/resolveConfigReceipts.test.js` | 0 | `Test Files 1 passed (1)` · `Tests 7 passed (7)` |
| **A6** `generatorGoldenMaster` + `dossierProseManifest` | 0 | `Test Files 2 passed (2)` · `Tests 18 passed (18)` |
| `negativeAssertionAnchor.walker` + `mutationCoverageManifest` + `siteCoherenceRatchet` | 0 | `Test Files 3 passed (3)` · `Tests 28 passed (28)` |
| `tests/copy/voiceMechanics.test.js` | 0 | `Test Files 1 passed (1)` · `Tests 30 passed (30)` |
| `tests/ui/compendiumWorldInputs` + `gallerySidebarRestore` | 0 | `Test Files 2 passed (2)` · `Tests 6 passed (6)` |
| `tests/lib/galleryHubs.test.js` | 0 | `Test Files 1 passed (1)` · `Tests 8 passed (8)` |
| `VERIFY_DIST=1` `generationWorkerLazy` + `vendorPdfLazy` | 0 | `Test Files 2 passed (2)` · `Tests 65 passed (65)` |
| `VERIFY_DIST=1` `vendorPdfLazy` (verbose, to quote arms) | 0 | `Test Files 1 passed (1)` · `Tests 54 passed (54)` |
| `npm run verify:dist` (BARE; takes the exclusive mutex itself) | 0 | `[test-ratchet] STRICT DIST OK — 59 discovered/reported file(s), 538 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.` |
| `npx eslint` on all six manifest paths | 0 | no diagnostics |
| `npm run typecheck:ratchet` | 0 | `OK — no type regressions (167 error(s), ceiling 167)` |
| `npm run typecheck:domain:strict` | 0 | `✓ no strict-type regressions (1113 errors, ceiling 1113)` |
| `node scripts/implementation-packets.mjs validate` | 0 | `valid: 188 packets (1 READY)` |
| `npm run check:packet -- EM-P3` | **0** | twelve steps, each exit 0: validate-packets 381 ms · typecheck-full 14070 · typecheck-domain 11675 · lint-manifest 1273 · focused-1..8 (4549, 5496, 19725, 9104, 1338, 11810, 13582, 385) |
| `npm run implementation:resume -- EM-P3` | **0** | every step reused at 0 ms — no authority, HEAD, foreign-work or receipt-integrity drift |
| POST-COMMIT `VERIFY_DIST=1` build pair | 0 | `Test Files 2 passed (2)` · `Tests 65 passed (65)` |
| POST-COMMIT `facetAlignment.test.js` | 0 | `Test Files 1 passed (1)` · `Tests 8 passed (8)` |

Named arms proved to have RUN (not skipped) in the `VERIFY_DIST=1` verbose run: *"the engine chunk
still exists (lazy) and remains large"*, *"entry static closure raw bytes stay under the first-paint
budget (1048000)"*, *"the data-lazy chunk stays under its raw ceiling (3098110)"*, *"...its gzip
ceiling (771897)"*, *"the three first-paint budgets stay where the owner signed them > the raw, gzip
and Brotli closure budgets are unmoved"*. All ✓.

The pre-commit hook ran `eslint --fix` over the six staged files and re-indexed; `npx eslint` had
exited 0 with zero diagnostics beforehand, so there was nothing fixable to rewrite, and post-commit
`git diff HEAD` is empty with both re-runs above green. **CONFIRMED.**

## 5. Acceptance cases: 7 of 7 executed

| ID | how it was executed | result |
|---|---|---|
| A1 | equality-as-arrays across every live production spelling of terrain (data leaf, domain address, gallery facet, resolveConfig re-export) and culture (same four plus `CULTURE_PROFILE_KEYS`), inside the contract's existing arms | PASS |
| A2 | the three pre-existing culture assertions (`:75`, `:76`, `:86`) unchanged and green against the new source | PASS |
| A3 | GUARD-THE-GUARD: a planted `'tundra'` in a copy of the gallery list; the arm's red is captured and asserted to name both the fact and the member | PASS |
| A4 | two new literal-titled arms: the key set equals the SEVEN named facts exactly and `tradeAccess` is absent with the charter cited; every citation's path exists and carries `export const <SYMBOL>` verbatim (7 of 7 resolved, non-vacuity asserted first) | PASS |
| A5 | `TERRAIN_WEIGHTS` compared element-for-element to the pre-move literal, with `rng.weightedPick`'s positional read in the failure message | PASS |
| A6 | goldens run, not re-recorded; hashes identical before the first edit and after the last | PASS |
| A7 | ceiling re-minted to the exact measured bundle; the constant minus one reds with the printed figure and was restored; attribution names only this packet's modules and neither the domain leaf nor `galleryUtils.js` is in the worker | PASS |

## 6. Goldens

`shasum -a 256` before the first edit and after the last, byte-identical, `UPDATE_GOLDEN` and
`GOLDEN_SHIFT_SIGNED` never set:

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

Both equal the brief's reference values. **CONFIRMED.**

## 7. The lighting census — a NAMED interior red, NOT refrozen

In the slot, run ONCE and separately: **exit 1**, `Tests 1 failed | 33 passed (34)`,
*"the estate's file count moved — re-measure, do not re-word: expected 2648 to be 2646"*. That first
figure is EM-B3a's inherited red; the walker's equality chain is sequential, so the remaining four
figures are unreadable from that run.

The whole tuple was measured in a throwaway `git archive HEAD` probe OUTSIDE the worktree carrying
this commit's six files, with a probe-local baseline set to the predicted tuple:
**exit 0, `Test Files 1 passed (1)` · `Tests 34 passed (34)`** — an exact equality on all five.
The probe directory was deleted. `tests/lint/.lighting-census-baseline.json` is UNTOUCHED in the slot.

| figure | frozen baseline | live at this tip (EM-B3a) | **MEASURED here** | EM-P3's own delta | packet's stated delta |
|---|---:|---:|---:|---:|---:|
| `files` | 2646 | 2648 | **2648** | +0 | +0 |
| `parked` | 383 | 383 | **383** | +0 | +0 |
| `credited` | 2263 | 2265 | **2265** | +0 | +0 |
| `titles` | 25005 | 25013 | **25015** | **+2** | **+2** |
| `suiteTitles` | 6671 | 6675 | **6675** | +0 | +0 |

The measured delta equals the packet's stated delta exactly. **No STOP. No refreeze** — the
re-derivation is the train's terminal act and the chair's.

## 8. Registers, budgets and standing instruments

- Mutation-coverage manifest: **no row owed, none added** — `mutationCoverageManifest.test.js` green.
- Writer-reach / observed-shape: **no move** — no settlement field is read by either new module.
- Decision-fork / mechanism-coverage: **no row** — nothing minted (`TRADE_ACCESS` is EM-P3b's).
- Prose-numerics, size-baseline, edge-shared: **no move**; neither new file is in an edge-shared closure.
- Anchored negatives: no bare `not.toContain/not.toMatch/not.toHaveProperty` was added; the walker is green.
- Voice mechanics: both new files are inside Tier 2's scanned roots (`src/data`, `src/domain`) and
  carry no em dash or `!` in any string literal; Tier 4's tell ban is unaffected. Walker green.
- Both typecheck configurations reported by name, each at its exact floor (see §4).
- Base-versus-wave failure identity diff: the ONLY red anywhere in this lane's runs is the lighting
  walker's `files` figure, which is red at the base tip too (EM-B3a's un-refrozen landing). Identical
  identity before and after this packet. **CONFIRMED.**
- Generated artifacts: **NONE**.

## 9. Judgment calls — ONE, vetoable

**The spelling of the re-export in `resolveConfig.js`.** The packet's §6 skeleton writes
`export { TERRAIN_WEIGHTS, CULTURES };`. Built that way, the packet's OWN sealed manifest refuses the
tree: `npm run check:packet -- EM-P3` exited **2** with

```
[implementation-gate] packet manifest is invalid and non-dispatchable:
EM-P3.requiredSymbols[0].symbol is missing from src/generators/steps/resolveConfig.js: export const TERRAIN_WEIGHTS
EM-P3.requiredSymbols[1].symbol is missing from src/generators/steps/resolveConfig.js: export const CULTURES
```

because `scripts/implementation-packets.mjs` resolves a required symbol by verbatim substring
(`source.includes(row.symbol)`), and those two rows name the declarations as things this deliverable
must PRESERVE (`PACKET_STANDARD.md`: a READY packet's rows "name only what its deliverable must
PRESERVE"). `validate:packets` — a gate step and one of this packet's own §10 commands — would have
been red the same way, so that shape could not land.

**Decision:** spell the forwarding export `export const TERRAIN_WEIGHTS = CANONICAL_TERRAIN_WEIGHTS;`
(and the same for `CULTURES`). It satisfies §7's instruction verbatim ("re-export both under their
existing names... every current importer keeps working unchanged"), keeps the packet's outcome exactly
(the LIST is spelled once, in `src/data/worldFactOptions.js`; resolveConfig spells no list), and leaves
every `requiredSymbols` row in the estate true — including LANDED **SCW-0**'s row on the same file.
`validate:packets` is green at 188 packets. The manifest is not one of my six paths, so amending the
rows was not available to this lane.

**The chair's reversal, priced:** write §6's `export { TERRAIN_WEIGHTS, CULTURES };` and amend the two
rows at the LANDED flip (`retiredSymbols` + successors). It costs **12 B** in the worker — that form
was built and measured at **1,401,196 B** — so the ceiling would be re-minted to that figure, and the
lazy engine reads 677,923 B instead of 677,935 B.

## 10. Deviations

**NONE** beyond §9. §11's STOP-1 (trade access → EM-P3b) and STOP-2 (the placement cure) were already
resolved in packet version 2 and were applied as written. No golden moved; no list's members or order
changed; no ceiling was raised to finish the packet (the re-mint followed the measurement, inside the
priced bound, under the charter's named conditional act); no register was refrozen; no file outside the
six was edited; `UPDATE_GOLDEN`, `GOLDEN_SHIFT_SIGNED`, `--no-verify`, `git add -A/-u/.`, stash, reset,
amend and push were never used.

## 11. Out-of-scope observations, recorded without investigation

1. **The commit carries only the `Co-Authored-By: Claude Fable 5.1` trailer.** This session's
   attribution reminder also names `Co-Authored-By: Claude Opus 5 (1M context)`; the brief forbids
   `amend`, so the trailer was not added after the fact. The chair can add it at the terminal if wanted.
2. **The packet's §7 lighting row attributes `titles +2` to "A4's named-set arm and A7's ceiling arm",
   but A7's file takes a constant-and-comment edit only and moves no title.** The measured +2 is two
   new arms in `facetAlignment.test.js` (the named-set arm and the citations-resolve arm), which is the
   numeric delta the packet and the brief predicted. Worth a one-line correction if the row is reused.
3. **`src/domain/worldFactOptions.js` has no production reader of `WORLD_FACT_SOURCES` yet**, so rollup
   removes the whole module from every emitted chunk. The citation index is live only in the test until
   EM-A1's card reads it. That is why the worker's rise (+80 B) came in well under the +206 B estimate.
4. **`tests/helpers/goldenMasterCorpus.js` still carries a fourth terrain spelling** in a TEST helper,
   deliberately outside the manifest (the packet's own note); the walker cannot see it.
5. **`mountain_pass`** remains a selectable trade-route option no route pool rolls; EM-P3b inherits it.
6. **A type annotation was needed that the packet's §6 skeleton did not carry.** Without
   `@type {ReadonlyArray<readonly [string, number]>}` on `TERRAIN_WEIGHTS`, the tuples infer as
   `(string | number)[]`, `TERRAINS` widens, and `src/lib/galleryHubs.js` reds `typecheck:ratchet`
   (`TS2339: Property 'replace' does not exist on type 'string | number'`) against a baseline of zero.
   The annotation is in the new file, costs no runtime and no bytes, and the ratchet is back at 167/167.
7. **The slot keeps a `dist/` built from exactly this commit** (`generation.worker-ChvrnTyn.js`). It is
   gitignored and is useful for the chair's terminal `VERIFY_DIST=1`, but it goes stale the moment
   anything lands on top — a stale dist can only under-report. Delete it if the terminal rebuilds.
8. The attribution artefacts (`attrib.config.mjs` at the tree root and `dist-attrib/`) were removed
   after the measurement; `git status --short` is empty.
