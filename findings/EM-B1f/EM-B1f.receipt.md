# EM-B1f — COMPLETION RECEIPT. LANDED at `6b57180ef51ed06ce8ed9048be7602351b497f1d`.

Stamped `Sun Sep 20 09:33:52 EDT 2026`. Branch `fixes-2026-09-18-consist`, sealed base `c127cdfb2`.
Every claim below is CONFIRMED by execution unless labelled otherwise.

## Seal

| fact | value |
|---|---|
| `implementation:dispatch -- EM-B1f` at `c127cdfb2` | **EXIT 0** |
| **sealDigest** | `4fe12b7597d79918f6187e5a38f67deb208c8fd170eb33ea19bbf12d8edc295c` |
| capsuleDigest | `fb88e18df3de345e128f8ffe78b5230496702f37dacc6a8ab0ef5cfdb77576e6` (moved from the first seal's `baa70e3b…0c50` — the re-seal was genuinely needed) |
| sealed head / branch / verifiedBase | `c127cdfb2` / `fixes-2026-09-18-consist` / `0cea60c7a` |
| prior seal | rotated aside by the chair as `EM-B1f.sealed-at-c33446830`, **nothing deleted**; TOOL-22 chartered |
| preamble SHA-256, measured | `ce516004a5d8e680f4160b03ce660c66d78261988b78a82239664c596600af4b` = the packet header's stamp |

**The six hashes equal `EM-B1f.six-shas.txt` at three separate moments** — after `git apply --index`,
mid-gate, and after the commit (so the pre-commit hook rewrote nothing):

```
9f692f6ce844110f5c0c8a66e34e99a1cd8b719a923a216a6695c55b1da78b7f  src/domain/roads/state.js
3535cbb431310740e760a33d26d78daf5ee05402351c9ecb477abced13d496e1  tests/lint/statusUnionTotality.walker.test.js
81a4ae8d4e58f7b9b10f9367621942a110127d6ffff9e9d7164c4448ca5482a1  tests/domain/roadsState.test.js
64665503ef9beeaef9d5e9e0f2e7018e98d3329bb4a0841669657142e62a52c5  tests/domain/warSeatBooks.test.js
31ecce8ae9458aaca09b7fb975eee64f6db52f6588a5f300cc32be43aa200609  tests/domain/roadsParticipation.test.js
e246ddff6bda27d770973a58c760e42bc6f81b45d36922cb091aec8a46531977  tests/property/npcs.property.test.js
```

## Both sealed verbs, step for step — IDENTICAL results

| step | check | `check:packet` | `implementation:resume` |
|---|---|---:|---:|
| validate-packets | the gate's own | 0 | 0 |
| typecheck-full | `tsconfig.full.json` | 0 | 0 |
| typecheck-domain | `tsconfig.domain-strict.json` | 0 | 0 |
| lint-manifest | the gate's own | 0 | 0 |
| focused-1 | eslint, the six files | 0 | 0 |
| focused-2 | irreversibleRawRoster + npcs.property | 0 | 0 |
| focused-3 | `typecheck:ratchet` | 0 | 0 |
| focused-4 | `typecheck:domain:strict` | 0 | 0 |
| focused-5 | roadsState/roadsParticipation/warSeatBooks/warSeatTermination | 0 | 0 |
| focused-6 | statusUnionTotality.walker | 0 | 0 |
| **focused-7** | goldens + dossierProseManifest + roadsDormancyGolden | ⛔ **1** | ⛔ **1** |
| focused-8 | densityLaw + advanceWorkerByteIdentity | 0 | 0 |
| focused-9 | `check-observed-shape-readers` | 0 | 0 |
| focused-10 | `check-writer-reach` | 0 | 0 |
| ⭐ focused-11 | `tests/lint` minus the lighting walker | 0 | 0 |
| focused-12 | `validate` | 0 | 0 |
| focused-13 | `build:edge-shared` (LAST) | 0 | 0 |

`check:packet` EXIT 1 · `implementation:resume` EXIT 1 — **both for exactly one reason**, the
owner-gated named red. ⛔ **The runner does NOT stop at the first failure**: it ran all 17 steps and
reported each, so the chair's checks-8–12-individually contingency did not apply.

**Count lines (identical in both verbs):**

```
focused-2   Test Files 2 passed (2)                 Tests 9 passed (9)
focused-5   Test Files 4 passed (4)                 Tests 52 passed (52)
focused-6   Test Files 1 passed (1)                 Tests 4 passed (4)
focused-7   Test Files 1 failed | 2 passed (3)      Tests 1 failed | 26 passed (27)
focused-8   Test Files 2 passed (2)                 Tests 159 passed (159)
focused-11  Test Files 173 passed (173)             Tests 2757 passed (2757)
typecheck:ratchet        OK — no type regressions (167 error(s), ceiling 167)
typecheck:domain:strict  ✓ no strict-type regressions (1113 errors, ceiling 1113)
observed-shape           1964 finding(s), exactly matching the frozen inventory
writer-reach             WRWALKER HOLD — judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294 (reviewable 495)
validate                 valid: 194 packets (1 READY)
```

⭐ **focused-11 is the THIRD PREAMBLE AMENDMENT'S sealed `tests/lint` step, and this is its FIRST
EXECUTION.** 173 files — exactly the figure §P7 states — **2757 of 2757 tests green**.

## ⛔ THE NAMED PRE-EXISTING RED (owner-gated, §934.71; the chair's ruling)

```
FAIL tests/property/dossierProseManifest.test.js > the composed-prose manifest — the DRIFT corpus,
     both audiences > ⭐ THE PROVENANCE REFUSES A FIXTURE ITS RECORDER DID NOT WRITE
AssertionError: a fixture whose recorder has moved since it was written is REFUSED
  (comment-insensitive since 2026-09-20): re-record with `node scripts/prose-manifest-cells.mjs --record`
```

⭐ **PROVED NOT TO BE THIS PACKET'S, by execution on a CLEAN tree at `c127cdfb2` with NONE of this
lane's edits present:** `Test Files 1 failed | 1 passed (2)` · `Tests 1 failed | 19 passed (20)`,
the identical title and message. It is CURE-J's owner-gated second half.
⛔ Nothing was re-recorded; `UPDATE_GOLDEN` and `GOLDEN_SHIFT_SIGNED` were never set.
ⓘ Before CURE-J commit 1 **one** recorder hash mismatched; after it **all three** do — consistent
with the identity scheme moving from whole-file to code-only, i.e. commit 1 landed as designed.

## Goldens — UNMOVED, byte-identical before the first edit and after the commit

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  dossier-prose-manifest-golden.json
```

## Lighting — delta only; the register was NEVER refrozen

Register frozen at **`2656 · 383 · 2273 · 25074 · 6684`**; baseline sha
`30966fa497b81380042f655ab405fcc4493e1a5400f0fd1dfd471d46dfa9a067`, absent from `git status`.

**`+0 files / +0 parked / +0 credited / +4 titles / +0 suiteTitles`** — exactly the predicted delta.
`titles 25074 → 25078` CONFIRMED (`expected 25078 to be 25074`); files/parked/credited CONFIRMED by
passing ahead of the failing assertion; `suiteTitles` is asserted AFTER `titles` and was never
reached, so its `+0` is measured from the diff (**0 `describe(` lines added or removed, 0 new test
files**) rather than by touching a register whose own header forbids hand-editing.
Walker run once separately: `Test Files 1 failed (1)` · `Tests 1 failed | 33 passed (34)`.

## Edge-shared — exactly SEVEN paths (STOP 9 clear), generator LAST

| bundle | sourceHash | verdict |
|---|---|---|
| `aiCharterBundle` | `577116ea20da66f5` → `bfd7319b0bf11c80` | ⭐ **MOVED** |
| `aiOutputSchemaBundle` | `556608bff80c94a6` → `436c77005fab7f7a` | ⭐ **MOVED** |
| `aiGroundingBundle` | `9788abb8fdb7287e` → unchanged | `generatedAt` only |
| `analyticsEventsBundle` | `0a6ba64ce0b8d5e2` → unchanged | `generatedAt` only |
| `intentAtlasBundle` | `9136e063f280d77f` → unchanged | `generatedAt` only |

## Red-first, the walker mutant, and §13

**Red-first** (pre-cure production file): `Tests 4 failed | 44 passed (48)` — exactly the four new
titles, every pre-existing title green. A1's red received `seat / 0.3744 / holding / 0.6256`.
**The walker mutant** (§P6): row deleted, bytes 34,234 → 33,493, `Tests 1 failed | 3 passed (4)`,
**A3 alone** red with `+ "src/domain/roads/state.js"`; restored to the exact pre-mutant SHA-256.
That diff also proves **FLAGGED gains ONLY `state.js` (6 → 7)** and `TRIGGER` unmoved — STOP 7 clear.
**§13.0**, both arms at the build's own tip, liveness anchor printed in both: **five cells
IDENTICAL row for row**; 2 of 2 roster in every cell; `jailed` changes nothing — STOP 11 clear.

## Budgets

Effective lines **288 → 293 (+5)** of a 800 ceiling (507 headroom), eslint's own flat `Linter`;
minified **7,727 → 7,911 B = +184 B** against a ≤370 B bound (repo esbuild 0.28.1);
module edges **7 → 7, delta ZERO**, edge sets identical; `entities/npcs.js` own closure **2**
modules, no cycle; `advanceInterval.worker` closure **544**, `state.js` a member; declaration line
byte-identical. ⚠ `+184 B` is **CONFIRMED** as a minified-source delta, **PLAUSIBLE** as a
rendered-chunk delta.

## The commit

`6b57180ef51ed06ce8ed9048be7602351b497f1d` — **13 files changed, 206 insertions(+), 24 deletions(-)**.
`git show --stat HEAD` names exactly the sealed thirteen; `git status --short` **EMPTY**;
trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`; the hook rewrote nothing.

---

## ⛔ NOTICED, NOT TOUCHED — each specific enough to slot

1. ⛔ **§6's VERBATIM CONTRACT DOES NOT TYPECHECK** — the one deviation, accepted by the chair and
   recorded vetoably. `TS2345` on both configs; cured with the file's own adjacent JSDoc-cast idiom,
   widening the HAYSTACK (`/** @type {readonly string[]} */ (OFF_STAGE_STATUSES)`), never the needle.
   **Slot: the chair re-cuts §6's text at the flip.**
2. ⛔ **§13.0's BASE TABLE IS REFUTED for `exiled`/`removed`** — at this tip the house IS swept from
   `powerStructure.factions` and a `faction_dissolved` beat DOES fire, against "no house leaves… in
   any cell" and "NOT a sweep". Seed-stable; premise files unmoved. ARM-INDEPENDENT, so promotion
   stands. **Slot: the chair re-cuts §13.0's prose at the flip (addendum 84).**
3. ⛔ **§7.3's kernel citation was both STALE and of a BANNED FORM** — `pulseKernel.js:662` vs the
   live `:660`, and `pulseKernelLineAddress.walker.test.js` RULE 1 freezes `pulseKernel.js:<digits>`
   at ZERO across `src/` and `tests/`. Re-spelled as the sanctioned content anchor. **Accepted.**
4. ⛔ **`isOffStage`'s own docblock now under-describes the predicate by one arm** — it still reads
   "a DM-shelved NPC (isInStasis) OR a roads hostage"; the status arm is absent. §6's verbatim diff
   does not amend it. **Slot: a comment-only cut at the flip, or a CITATION row in EM-B1a's compile.**
5. **`statusUnionTotality.walker.test.js:402`'s message "all eight flagged files" was ALREADY wrong
   at the base** — now CONFIRMED by the mutant run: `FLAGGED` is **six** files; the message conflates
   roster ROWS with flagged FILES. Pre-existing, untouched. **Slot: the TOOL lane owning that walker.**
6. ⛔ **A THIRD figure-in-a-symbol is loaded** — EM-B1k2's `requiredSymbols` carries
   `"uncoveredBaseline": 186` at `scripts/mutation-coverage-manifest.json`. The next packet that
   moves that baseline hits the §7.4 wall again. **Slot: TOOL-15, widened to `retiredSymbols` and
   every numeric row (chair, accepted).**
7. **EM-B1k2's three `_note` addresses for `roadsParticipation.test.js`** (`:409`, `:422`, `:425`)
   were already stale and this packet moved the live ones again. Symbol-pinned, nothing reds.
   **Slot: the same TOOL lane as item 6.**
8. **`tests/lint/.tuning-inventory.json:967`'s `line: 222` for `ROADS_TUNING` goes stale.** Keyed on
   `spanDigest`; re-takes on that file's next regeneration. No action owed (packet §12.1 item 5).
9. ⛔ **A FOREIGN STASH IN THE SHARED TREE, PRESERVED THROUGHOUT:**
   `stash@{0}: On analytics-intelligence-layer: generation-tuning fixes`. Never popped, dropped,
   applied or cleared; still present after the commit.
10. ⛔ **THE DIST-READ BYTE ARM WAS NOT RUN BY THIS LANE.** `tests/build/vendorPdfLazy.test.js` is
    not in this packet's `checks`, and the chair assigned `npm run build` + `verify:dist` to the
    landing. **A skipped byte arm is not a pass** — the `< 679_000` engine literal is proved by the
    chair's landing run, not by this receipt.
11. ⚠ **THE LIGHTING REGISTER STILL NEEDS THE CHAIR'S TERMINAL REFREEZE** (+4 titles). This lane
    never refroze it, by law.
