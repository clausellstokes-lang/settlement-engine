# FIX-P9 — LANE RESUME NOTE · CLEAN PAUSE FOR THE ACCOUNT TRANSFER (2026-09-20 14:0x EDT)

Worktree `$SP/lane-fix-p9` · branch `fix-tier-word-2-2026-09-20` · base **578272a99**.
`git status --short` is **EMPTY**. Working tree clean, nothing staged, nothing untracked.
Commit 3 is NOT applied and NOT committed — its files sit in scratch, unproven.

```
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad
W="$SP/lane-fix-p9"   S="$SP/lane-fix-p9-scratch"
```

## THE TWO COMMITS THAT EXIST

| sha | subject | proofs |
|---|---|---|
| `d071f5068` | FIX-P9: the Compendium's tier word comes from the tier-word table, through its generator | COMPLETE (incl. `tests/lint` WHOLE) |
| `de16bdf6a` | FIX-P9: the gallery register row was FALSE when written — deleted for executed pins (tests/lint WHOLE still owed on this commit) | ALL BUT `tests/lint` WHOLE |

⛔ **`d071f5068` SHIPPED WITHOUT ITS TRAILER.** I omitted `Co-Authored-By: Claude Opus 5
<noreply@anthropic.com>` from the message heredoc and no hook supplied it. Amending is
forbidden by the lane law and by the trailer ruling itself, so it is recorded, not fixed.
`de16bdf6a` carries the trailer (verified: 1 line).

## THE RULINGS I AM WORKING UNDER (chair, 2026-09-20)

1. **The gallery register row was FALSE when written** — refutation accepted; the row is
   deleted and replaced by executed pins (census source pin + the rendered arm in the
   existing `galleryFilterParity.test.jsx`); no new test file; no `src/` change; the
   commit subject says the row was false when written. **DONE in `de16bdf6a`.**
2. **The `searchIndex.js` id pinned to the token** (`tier-${t.id}`) is ACCEPTED as a repair
   that preserves the live public URL `/compendium/tier-thorp` — byte-identical on all six
   rungs today, drift-proof after; recorded as a vetoable judgment naming the three
   executed pins. **DONE in `d071f5068`.**
3. **The observed-shape red is the chair's absorb.** I do NOT re-freeze. `tests/lint` WHOLE
   may show exactly ONE named `observedShapeReaders` red on the regenerated artifact path,
   quoted with the `detectorSources: []` before/after measurement; the chair absorbs it at
   the composition with the plain `--write` on the composed tip (bundle door only if the
   plain door goes dark), gated on the walker green after.
   `scripts/.observed-shape-readers-baseline.json` is UNTOUCHED by this lane.
4. **The `†` → `✓` follow-the-product cut is ACCEPTED** (measured: the shipped mark is
   `FEATURE_MARK = '✓'`). **NOT YET APPLIED — this is all that remains.**

## EVERY COUNT LINE PRINTED SO FAR (mutex, SHARED tier, `--pool=threads --maxWorkers=2`, default reporter)

RED FIRST — commit 1, both plants restored byte-identically (`diff` empty, sha re-verified):

```
1. THE BYTE PIN re-mints by the VERB (HEAD's artifact under the cured generator)
   Test Files  1 failed (1)          Tests  1 failed | 9 passed (10)
   FAIL tests/docs/compendiumDataFreshness.test.js > the committed artifact is byte-identical to a fresh generation
   AssertionError: compendiumData.generated.js is stale. Run: npm run gen:compendium-data
   (printed diff names ONLY the thorp label line)

2. THE REGISTER ROW reds because its cause is cured (HEAD's census under the cured artifact)
   Test Files  1 failed | 12 passed (13)    Tests  1 failed | 154 passed (155)
   FAIL tests/copy/tierWord.census.test.js > THE REGISTER: the token-cased surfaces are named, executed, and may only shrink
   AssertionError: the Compendium now spells the rung "Thorpe" — if that is "Thorpe", DELETE the
   register row, because the handover it describes is done: expected 'Thorpe' to be 'Thorp'
```

RED FIRST — commit 2, plant `TIER_LABELS.thorp 'Thorpe' -> 'Thorp'` in
`src/components/new/design.js` (one site, asserted before writing), restored byte-identically
(sha `10f6a32bf428367628619ec379faae670beceae68c8cab3e059e1d03a9d87414` both sides):

```
tests/copy/tierWord.census.test.js
   Test Files  1 failed (1)          Tests  2 failed | 3 passed (5)
   FAIL every tier-label table in src/ spells the smallest rung the one way
        src/components/new/design.js:26  6 rungs, thorp = "Thorp"
   FAIL THE CURED SURFACES: a handover that is done stays done, re-derived every run
        src/components/new/design.js TIER_LABELS drifted from config/tierFacts.js SIZE_LABEL
        expected [ 'Thorp', … ] to deeply equal [ 'Thorpe', … ]

tests/components/galleryFilterParity.test.jsx
   Test Files  1 failed (1)          Tests  1 failed | 5 passed (6)
   FAIL the TIER chips print the estate tier word, not a cased token
        expected [ 'Thorp', 'Hamlet', 'Village', …(3) ] to deeply equal [ 'Thorpe', … ]
        - "Thorpe"   + "Thorp"
   ⭐ "every OTHER facet still prints its own raw vocabulary under the shared capitalize"
      stayed GREEN under that same plant — the per-facet isolation proof.
```

GREEN:

```
COMMIT 1
  tests/copy WHOLE                     Test Files  13 passed (13)     Tests   156 passed (156)
  tests/docs/compendiumDataFreshness   Test Files   1 passed (1)      Tests    10 passed (10)
  tests/domain compendium search x2    Test Files   2 passed (2)      Tests    20 passed (20)
  tests/build sitemap + prerender      Test Files   2 passed (2)      Tests    16 passed | 5 skipped (21)
  tests/lib/seoCompendium              Test Files   1 passed (1)      Tests     4 passed (4)
  tests/store/operationRegistry.walker Test Files   1 passed (1)      Tests    24 passed (24)
  tests/joins/crisisTripleSync         Test Files   1 passed (1)      Tests    11 passed (11)
  tests/ui ten compendium suites       Test Files  10 passed (10)     Tests    44 passed (44)
  tests/components WHOLE               Test Files 297 passed (297)    Tests  2103 passed (2103)
  tests/lint WHOLE                     Test Files   2 failed | 173 passed (175)
                                            Tests   2 failed | 2816 passed (2818)
  eslint BARE, four files              exit 0, clean

COMMIT 2
  tests/copy WHOLE                     Test Files  13 passed (13)     Tests   156 passed (156)
  tests/components WHOLE               Test Files 297 passed (297)    Tests  2105 passed (2105)
  eslint BARE, two test files          exit 0, clean
  tests/lint WHOLE                     ⛔ NOT RUN — the pause. Owed on de16bdf6a.
```

THE TWO `tests/lint` REDS, both declared before they printed, both permitted:

```
1. sovereigntyLightingContract.walker  Test Files 1 failed (1)   Tests 1 failed | 33 passed (34)
   "the live TEST-title count moved … expected 25502 to be 25501"
   It PASSED files (2664), parked (359) and credited (2305) and stopped at TITLES — which
   confirms commit 1's declared delta exactly: files +0 · parked +0 · credited +0 ·
   titles +1 · suiteTitles +0.   ⛔ NOT REFROZEN.
2. observedShapeReaders.walker
   "an execution INPUT drifted since the mint — lawful, and the shrink-only re-freeze
    absorbs it: expected [ Array(1) ] to deeply equal []"
   Re-derived with plain node, both sides of the regeneration:
       BEFORE  detectorSources: []   inputs: []
       AFTER   detectorSources: []   inputs: ["src/domain/compendium/generated/compendiumData.generated.js"]
   detectorSources EMPTY ⇒ no governed migration bundle. Chair absorbs at the composition.
```

GOLDENS — identical before the first edit and after the last edit of both commits:

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

LIGHTING DELTA, cumulative for this lane so far (register frozen `2664·359·2305·25501·6812`):
`files +0 · parked +0 · credited +0 · titles +3 · suiteTitles +1`
(commit 1: titles +1 · suites +0 — THE CURED SURFACES. commit 2: titles +2 · suites +1 —
the two gallery arms and their describe.) Zero `test`/`it`/`describe` removed anywhere; no
test file created, renamed or deleted by this lane. ⛔ NEVER REFROZEN.

## WHAT REMAINS — COMMIT 3, PREPARED AND VERIFIED UNGATED, NOT APPLIED

Files are written and parse-checked but sit in scratch; the worktree is clean.

```
$S/PricingSample.COMMIT3.jsx      be16f8ec6ff761e4d62e912029f2166e012c7e87afc3dace43a582d8195c88d9
   -> src/components/organic/samples/PricingSample.jsx
      († -> a FEATURE_MARK = '✓' constant, with the ruling recorded at the site)
$S/PricingTierCards.COMMIT3.jsx   4205c905b02381eeec21aea8f37d40a25df5da6eb3f79749dce2fb9f02d7b654
   -> src/components/pricing/PricingTierCards.jsx
      (the "⚠ WHAT STILL DIVERGES" paragraph re-cut: the divergence is CLOSED)
```

Measured before the cut: `git grep -n '†' -- src/components/pricing src/data` returned only
the two lines of PricingTierCards' own comment — the glyph had already left every shipped
surface. Nothing pins the sample's glyph (`tests/design/organicSamples.test.js` names only
sample ids; `.prose-numerics-baseline.json` and `organicFixtureLeak` carry no entry).
Both files are SCANNED by the observed-shape instrument, so they add no input drift.

### THE EXACT NEXT COMMANDS, IN ORDER

```sh
cd "$W"
# 0. the two remaining reds are commit 2's owed sweep — run it FIRST, it also covers commit 3 later
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
#    EXPECT: Test Files 2 failed | 173 passed (175) — the SAME two named reds as commit 1.
#    Any THIRD red is a stop.

# 1. apply commit 3
cp "$S/PricingSample.COMMIT3.jsx"    src/components/organic/samples/PricingSample.jsx
cp "$S/PricingTierCards.COMMIT3.jsx" src/components/pricing/PricingTierCards.jsx
npx eslint src/components/organic/samples/PricingSample.jsx src/components/pricing/PricingTierCards.jsx   # BARE

# 2. RED FIRST — plant the dagger back into the SHIPPED card, prove the sample follows the product
#    (no existing test pins the glyph, so the red-first is the measurement itself:
#     git grep -nP '†' -- src  must return ONLY src/domain/npc/paradigmAxisCatalog.js:178
#     after the cut; it returned 6 comment lines + that one before it.)

# 3. GREEN
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/components
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json

# 4. COMMIT 3 (trailer: Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>)
git commit -F <msg> -- src/components/organic/samples/PricingSample.jsx src/components/pricing/PricingTierCards.jsx
git show --stat HEAD   # names exactly those two
```

⚠ Commit 3 touches `src/`, so `tests/lint` WHOLE is mandatory before it (addendum 104), and
`tests/copy/voiceMechanics` matters because both files are `src/**/*.jsx` under the Tier-3
JSX baseline — `†` and `✓` are neither an em dash nor `!`, so no count should move.

## ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. **`src/components/organic/samples/fixtures.js:86` hard-codes `tier: 'Thorp'`** in the
   dossier sample fixture (`{ name: 'Gull's Watch', tier: 'Thorp', … }`). It is a rendered
   organic sample, so a reader can meet the old spelling there. The tier-word census does
   NOT catch it: it is a per-row string, not a tier-label TABLE, so no arm holds it. Slot:
   one character plus a pin, or a ruling that a sample fixture is frozen taste.
2. **`scripts/.observed-shape-readers-baseline.json` carries the pre-regeneration sha**
   `f095a90a758d…` for the artifact in BOTH `manifests.sourceTree` and
   `manifests.executionTree`. The chair's `--write` absorb updates both. Slot: the composition.
3. **`tests/lib/seoCompendium.test.js:13` builds its entry by hand** (`{ id: 'tier-thorp',
   term: 'Thorp' }`) rather than reading `COMPENDIUM_INDEX`, so it stayed green through
   both the label cure and the id pin — it would also have stayed green if the id HAD
   moved. Slot: read the real entry, or declare the fixture synthetic.
4. **`src/copy/en.js:820` and `:889` say "Thorp"** in the how-to prose ("Pick a size below
   (Thorp is small, Metropolis is huge)" and "Thorp through Metropolis"). Reader-facing
   sentences, not tables, so the census does not reach them. Slot: a copy pass, with the
   census extended to prose or an explicit exemption.
5. **`titleCase(id)` still labels the presets, the faction archetypes and the transfer
   causes** in `scripts/generate-compendium-data.mjs` (`:315`, `:521`, `:530` pre-edit).
   Those vocabularies have no estate label table, so the casing is correct today — but it
   is the same shape that produced F14. Slot: if any of the three gains a label table, the
   generator must read it.
6. **`tests/build/prerenderRoutes.test.js` skipped 5 arms** (`Test Files 2 passed (2),
   Tests 16 passed | 5 skipped (21)`) — the dist-reading ones, including the live
   `/compendium/tier-thorp` document check. The URL pin is therefore proved at the index
   and sitemap level but NOT against a built dist in this lane. Slot: the composition's
   build, or REVIEW-P2.

Evidence written before the first edit: `$S/FIX-P9.evidence.md`.
Scratch copies (all sha-verified): `compendiumData.PRE.js`, `compendiumData.CURED.js`,
`tierWord.census.CURED.js`, `tierWord.census.COMMIT2.js`, `galleryFilterParity.COMMIT2.jsx`,
`mutation-coverage-manifest.COMMIT2.json`, `PricingSample.COMMIT3.jsx`,
`PricingTierCards.COMMIT3.jsx`, `msg1.txt`, `msg2.txt`.
