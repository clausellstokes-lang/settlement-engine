# EM-R0a — COMPLETION RECEIPT, filled BY EXECUTION (Opus build lane, slot-2, 2026-09-20)

**COMMIT `26f22d3948c6db3e7eae03e78049bc7ed4a76564`** on `fixes-2026-09-18-consist`, base `680eacb8d`.
`git show --stat HEAD` names exactly §7's SIX paths; `git status --short --untracked-files=all` EMPTY;
`git diff HEAD --stat` empty, so the pre-commit hook rewrote nothing and the committed bytes are the
bytes that were proved. Trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

```
docs/content/wiring-census.json                  |   2 +-
scripts/mutation-coverage-manifest.json          |   4 +
src/domain/edit/recordRegister.js                | 190 ++++++++++
tests/lib/editTravel.test.js                     |   4 +-
tests/lint/recordRegisterTotality.walker.test.js | 439 +++++++++++++++++++++++
tests/store/decreeRegistryPersistence.test.js    |   4 +-
6 files changed, 638 insertions(+), 5 deletions(-)
```

## Seal identity
- `implementation:dispatch -- EM-R0a` exit 0. integrityDigest
  `981c3b3919dbc765812a3b4b95dbf418da8201da29bb58e8d9078e7fe03ae10d`,
  capsuleDigest `1a05b1ca00afc6a7c12d83a54348dfb735fea288151f5d89b9f0685ad6f49d93`,
  dispatchDigest `480104fbdd97c94d89025cb87b7bb0db8b430799f67e270a35c9f4fb6ab27c23`,
  head `680eacb8dd80dc8e0b587a9baa0da33652e0acea`, verifiedBase `2dc08a595…`. Never re-sealed.
- Preamble SHA-256 MEASURED at the tip = `c9f33c8d…6675`, equal to the packet header's stamp.
- `retiredSymbols` `[]` — the validator's retiree rule had no subject.

## Every count line, in order
| step | result |
|---|---|
| batch 1 · goldens on a CLEAN tree at 680eacb8d | `Test Files 1 failed \| 1 passed (2)` · `Tests 1 failed \| 19 passed (20)` |
| red-first · walker, register absent | `Test Files 1 failed (1)` · `Tests no tests` — `Cannot find module '../../src/domain/edit/recordRegister.js'` |
| walker green | `Test Files 1 passed (1)` · `Tests 7 passed (7)` |
| eslint BARE, both new files | exit 0 |
| `typecheck:ratchet` | exit 0 — `167 error(s), ceiling 167` |
| `typecheck:domain:strict` | exit 0 — `1113 errors, ceiling 1113` |
| nine §P6 mutants (twice: before and after the NUL cure) | each nonzero exit, each `Tests 1 failed \| 6 passed (7)` under its OWN title |
| sealed check 1 (four files) | `Test Files 4 passed (4)` · `Tests 41 passed (41)` |
| byte + citation pins (controlBytes · copyCorruption · seedLoopTotality · sourceCitationIntegrity) | `Test Files 4 passed (4)` · `Tests 34 passed (34)` |
| `tests/store/decreeRegistryPersistence.test.js` | `Tests 5 passed (5)` |
| `tests/lib/editTravel.test.js` | `Tests 3 passed (3)` |
| `tests/copy/voiceMechanics.test.js` | `Tests 30 passed (30)` |
| ⛔ `tests/lint` WHOLE, once (176 files) | `Test Files 2 failed \| 174 passed (176)` · `Tests 3 failed \| 2822 passed (2825)` · 457.68s |
| `tests/lint/proseWiringCensus` after the census regen | `Test Files 1 passed (1)` · `Tests 78 passed (78)` |
| lighting walker, once, separately | `Test Files 1 failed (1)` · `Tests 1 failed \| 33 passed (34)` — EXPECTED |
| A8 after the last edit | `Test Files 1 failed \| 1 passed (2)` · `Tests 1 failed \| 19 passed (20)` |
| `check:packet -- EM-R0a` | exit 1 — only `focused-2` red |
| `implementation:resume -- EM-R0a` | exit 1 — only `focused-2` red |

`check:packet` per-step: validate-packets 0 · typecheck-full 0 · typecheck-domain 0 · lint-manifest 0 ·
focused-1 0 · **focused-2 1** · focused-3 0 · focused-4 0 · **focused-5 0 (`Test Files 175 passed (175)`
· `Tests 2791 passed (2791)` — the whole `tests/lint` minus the lighting walker, on the landed bytes)**.
`resume` per-step identical. `[implementation-packets] valid: 195 packets (1 READY)`.

## The NAMED PRE-EXISTING RED — the only failure anywhere, and not this lane's
`tests/property/dossierProseManifest.test.js :: ⭐ THE PROVENANCE REFUSES A FIXTURE ITS RECORDER DID
NOT WRITE` — *"a fixture whose recorder has moved since it was written is REFUSED
(comment-insensitive since 2026-09-20): re-record with `node scripts/prose-manifest-cells.mjs
--record`"*, three recorder hashes differing. PROVED RED ON A CLEAN TREE at `680eacb8d` before any
byte of this packet. The three recorder files (`tests/helpers/dossierManifest.js`,
`tests/helpers/goldenMasterCorpus.js`, `scripts/prose-rate-corpus.mjs`) were read and never edited.
No golden re-recorded; `UPDATE_GOLDEN` and `GOLDEN_SHIFT_SIGNED` never set.

## Goldens — byte-identical before the first edit and after the last
`generator-golden-master.json` `7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e`
`dossier-prose-manifest-golden.json` `921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41`

## Lighting census — measured, NEVER refrozen
Frozen tuple `2664 · 359 · 2305 · 25501 · 6812` (register at `d279d13eb`). The walker asserts its five
figures IN ORDER and stops at the first miss, so the only figure it EVALUATED is `files`:
`the estate's file count moved — re-measure, do not re-word: expected 2665 to be 2664` → **files +1**.
The other four were measured independently by the walker's own `classifySource` over the emitted file:
**PARK REASONS `[]`**, 7 live titles, 1 suite title.
**DECLARED DELTA, unchanged from §7: `files +1 · parked +0 · credited +1 · titles +7 · suiteTitles +1`.**
`tests/lint/.lighting-census-baseline.json` untouched; `LIGHTING_CENSUS_REFREEZE` never set.

## Wiring census (EM-PREAMBLE §P2 row 13)
`node scripts/wiring-census.mjs` printed
`[wiring-census] wrote docs/content/wiring-census.json — 708 pools, 165 relation rows, 7 stamped files`.
Regenerated file: `producerIndexFiles` **1172 → 1173** — one line, one new producer, this packet's leaf.
Never edited by hand. Its staleness was the second red in the directory-whole run, and the regeneration
cured it (`Tests 78 passed (78)`).

## Acceptance cases: 8 of 8 executed
A1–A7 green in the walker (`Tests 7 passed (7)`) and each proved to BITE by its own mutant; A8 green
by comparison against the clean-tree baseline with both goldens byte-identical.

## §P6 mutant hygiene — nine, each red under its OWN title, each restored
Pre-mutant SHA-256 `f0d6440ef1762768a9e75a5b15533daeb199d1711f04647ec276951b321270e3`, restored exactly
after every one. M1 delete a `RECORD_CLASSES` row → **A1**; M2 add a saved-only key to
`GENERATED_KEYS` → **A1**; M3 a non-identifying `KEYED_COLLECTIONS` key → **A3**; M4 an unobserved
`ATOMIC_COLLECTIONS` path → **A3**; M5 drop a `KEY_UNPROVEN_AT_LENGTH_ONE` row → **A4**; M6
`relationships` out of HELD → **A5**; M7 a group root at no path → **A6**; M8 `incomeSources` back into
KEYED → **A7**; M9 the declared total to 99 → **A7**. Every run `Tests 1 failed | 6 passed (7)`, so no
mutant was ambiguous. THE WHOLE SWEEP WAS RE-RUN after the control-byte cure, so the proof rests on the
bytes that landed.

## Budgets
Effective production lines **139** against §7's `≤ 210` (the packet predicted 164 from the compile
lane's own formatting). Twelve exports, all frozen, at exactly the declared sizes: RECORD_CLASS_NAMES 8 ·
RECORD_CLASSES 47 · GENERATED_KEYS 41 · SAVED_ONLY_KEYS 4 · NOT_YET_WRITTEN_KEYS 3 · CLASS_EXCEPTIONS 3 ·
KEYED_COLLECTIONS 48 · ATOMIC_COLLECTIONS 15 · CROSS_ENTRY_TOTALS 2 · KEY_UNPROVEN_AT_LENGTH_ONE 9 ·
UNMERGEABLE_COLLECTIONS 3 · CONSISTENCY_GROUPS 7. **Bundle delta 0 B in all four budgets**: `grep -rn
recordRegister src tests` finds the leaf's own header and the walker's import only — no production
importer, and no `src/generators/**` module names `src/domain/edit` (§5.5 holds). The chair runs
`npm run build` + `verify:dist` at the landing; this lane built nothing.

## ⛔ NOTICED
1. ⛔⛔ **A RAW NUL BYTE THIS LANE PLANTED AND CURED BEFORE THE LANDING.** The walker's composite-key
   helper was first written with a literal NUL as a `.join()` separator: `file` reported the source as
   `data`, text-mode `grep` went silent on it, and `tests/lint/controlBytes.test.js` — which exists for
   exactly this class and records the identical shape from `src/components/AccountPage.jsx:79` — would
   have reddened the directory-whole run. CAUSE: a ` ` escape written through a JSON-encoded tool
   parameter becomes the raw byte. CURE (not an escape spelling): the composite identity is now
   `JSON.stringify(key.map(...))`, which needs no separator and cannot re-acquire the byte. The first
   directory-whole run was STOPPED rather than allowed to grade stale bytes, and the nine-mutant sweep
   was re-run afterwards. Both committed blobs are `Unicode text, UTF-8 text` with zero C0/DEL bytes.
   ⭐ Worth a line to TOOL-25's owner: the class recurs through tooling, not through typing.
2. ⚠ **§12 OF THE PACKET IS STALE AGAINST §7** — it still says "THE COMPLETION COMMIT NAMES EXACTLY
   THESE THREE PATHS" while §7 carries six after the chair's placement cuts. §7 is the sealed authority
   and the chair records the correction at the flip. Not amended by this lane.
3. ⚠ **The effective-line prediction (164) does not reproduce (139).** Same content, different wrapping;
   the binding figure is the `≤ 210` bound. Three sibling EM-R packets inherit that table.
4. **`sourceCitationIntegrity`'s report-only arms printed pre-existing debt** during the directory-whole
   run — 4 symbol-arm citations off by a line or moved (`AppViews.jsx:46`, `npcVerdictPulse.js:133`,
   `Primitives.jsx:120`, and `scripts/wiring-census.mjs:349` citing `defenseGenerator.js:189-191`), and
   9 bare `:NNN` addresses past EOF in `docs/implementation/packets/**`. NONE is this packet's; recorded
   because it is FIX-C2's family and the wiring-census one sits in a script this packet runs.
5. **The stride rule is now spelled in code** — "the FIRST row of each (settType, terrainOverride) pair
   among the grid rows, then every non-grid row" is expressed as the first row of each culture-collapsed
   corpus key, which reproduces the pre-proof lane's 63 rows and every E-10 figure exactly. EM-R0b/R0c/
   R6/R7 inherit that spelling with the register.
6. **Three other lanes held the shared tier throughout** (`tests/lint`, `tests/components`, `tests/ui`);
   every run of this lane queued through `gate-mutex.sh` and printed a count. The foreign stash was never
   touched; no `$SP/consist`, read-tip, ledger checkout or other lane directory was entered.

## Deviations
`NONE` from §7/§8, other than the intra-lane cure in item 1, which changed no declared row and moved no
assertion.
