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

---

# 2026-09-20 ~15:0x EDT — THE RESUMED AGENT'S UNGATED TURN (fresh Opus, chair session 4a1823e2)

✅ **THE STOP IS RULED (ODQ §934.47 addendum 114) AND THIS LANE IS A MEMBER OF BATCH 1.**
`UPDATE_ORGANIC_SAMPLES=1` is LAWFUL for FIX-P9 under six conditions; commit 4's shape is ACCEPTED;
two further units (5 and 6) are assigned. **⇒ GO STRAIGHT TO `## THE BATCH-1 APPLY SCRIPT` AT THE
FOOT OF THIS NOTE — it is the only runnable procedure here.** `$S/FIX-P9.STOP.md` is kept as the
measurement record. Nothing was ever applied; this branch is at `de16bdf6a`, `git status --short` EMPTY.

## WHAT THIS TURN PROVED (all ungated, all executed)

| claim | receipt |
|---|---|
| the two commit-3 scratch files are the note's files | sha `be16f8ec…` / `4205c905…` — exact match |
| both goldens unmoved | `7177cd6e…` / `921c51cf…` before and after |
| commit 3 lints clean | `npx eslint` BARE on both cured files → **exit 0**, no output (`$S/eslint.commit3.log`) |
| commit 3 moves the sample golden | `pricing-desk.html` holds **13** `†`, each the literal the commit deletes |
| commit 4 moves the same golden | `library-desk.html` holds **1** rendered `>Thorp<` cell |
| the note's step 2 was wrong | RENDERED `†` in `src/`: **1 before, 0 after**; total LINES 4 → 6 (the cured files quote the glyph in their own comments). Measure RENDERED sites, never the line count. |
| commit-4 drafts parse | `espree` (the census's own parser) → PARSE OK on both |

## COMMIT 4 — MEASURED AND DRAFTED (the chair's question answered)

**May a file under `src/components/organic/samples/` lawfully import the estate's tier-word table?**
The tier-word source is `src/config/tierFacts.js` `SIZE_LABEL` (`thorp: 'Thorpe'`) — the table commit 1
routed the generator through.

- **The import walker permits it.** `tests/design/organicFixtureLeak.test.js` bans exactly ONE
  direction: nothing *outside* the samples dir may import *from* it. It places no ban on the samples
  dir importing from `src/config/`, and it walks only `src/`, so a TEST importing the fixtures is
  lawful too (its header says so: "NOTHING outside … (and tests)").
- **The fixture's own declared contract forbids it**, and that contract is load-bearing.
  `fixtures.js`'s header: *"Deliberately decoupled from the generated artifacts … so the byte-stable
  sample golden never drifts when those regen."* Importing `SIZE_LABEL` would make
  `library-desk.html`'s bytes a function of `config/tierFacts.js`, so any future config edit would red
  `tests/design/organicSamples.test.js` from an unrelated lane — the exact coupling the header exists
  to prevent, and the same golden already blocking this commit.

⇒ **The smallest cure is the one-character literal, not an import; the coupling goes in the TEST.**
Drafted and parse-checked:

```
$S/fixtures.COMMIT4.js          bf5a175c8dfa16bd95f273d71ae116edbc6ac53591b2412b81a810d6a29cb6ec
   -> src/components/organic/samples/fixtures.js
      (tier: 'Thorp' -> 'Thorpe' at the Gull's Watch row, + a header paragraph that tells the
       next lane NOT to import SIZE_LABEL here and why)
$S/tierWord.census.COMMIT4.js   278e26e62ba02be44bdbfbb015334b4161bfafacc5f5eb9f53168b3c52d91117
   -> tests/copy/tierWord.census.test.js
      (one import + ONE new arm, "THE TASTE-VETO SAMPLES", which fails on 'Thorp')
```

The pin's hazards were measured and are discharged: `negativeAssertionAnchor` scans only
`not.toContain|not.toMatch|not.toHaveProperty` — `.toEqual([])` is explicitly OUT of scope — and
`tierWord.census.test.js` carries NO frozen row, so no `// anchored:` marker is owed. `seedLoopTotality`
is satisfied (collect, then assert once). `quota.tier` ('Cartographer', a PRICING tier) is deliberately
outside the population, stated at the site. **Lighting delta for commit 4: titles +1 · suites +0.**

## ⛔ SUPERSEDED BY `## THE BATCH-1 APPLY SCRIPT` AT THE FOOT — DO NOT RUN THIS SECTION AS WRITTEN
(It was written for a SOLO gate at this branch's stale base. Batch 1 runs FOCUSED files only, at the
integration tip, and the chair's ONE full check afterwards is the whole-directory proof. Kept because
its per-command mutex spelling and its expectations are still correct.)

## THE OLD SOLO-GATE BATCH — reference only

Every line: mutex, SHARED tier, worker-capped, ONE directory or explicit file list, redirected to a
file, exit captured from the command itself. `S` and `W` as defined at the top of this note.
⛔ A line with no printed count DID NOT RUN. ⛔ Re-hash both goldens at the end; identical or STOP.

```sh
cd "$W"
M='GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20'   # ⛔ SPELL IT INLINE, never expand this
```

### STEP 0 — the OWED sweep on `de16bdf6a` (commit 2's, and it is owed regardless of the ruling)
```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint > "$S/r0-lint.log" 2>&1; echo "exit $?"; tail -25 "$S/r0-lint.log"
```
EXPECT `Test Files 2 failed | 173 passed (175)` — the SAME two named reds as commit 1 (the lighting
walker at TITLES; `observedShapeReaders`' input-drift arm). **A THIRD red is a STOP.**

### STEP 1 — commit 3, only if the chair rules the sample door lawful
```sh
cp "$S/PricingSample.COMMIT3.jsx"    src/components/organic/samples/PricingSample.jsx
cp "$S/PricingTierCards.COMMIT3.jsx" src/components/pricing/PricingTierCards.jsx
npx eslint src/components/organic/samples/PricingSample.jsx src/components/pricing/PricingTierCards.jsx > "$S/r1-eslint.log" 2>&1; echo "exit $?"   # BARE, expect 0 (already proved this turn)

# 1a. RED FIRST — the drift guard is the real red-first: the golden still holds 13 daggers
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design > "$S/r1a-design-RED.log" 2>&1; echo "exit $?"; tail -25 "$S/r1a-design-RED.log"
#    EXPECT exactly ONE failing title: "each committed fixture is byte-identical to a fresh SSR
#    render (drift guard)", naming pricing-desk.html. Any OTHER red is a STOP. Quote it.

# 1b. THE DOOR (chair-authorised only) — re-render through the signed door, then prove green
UPDATE_ORGANIC_SAMPLES=1 GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design/organicSamples.test.js > "$S/r1b-door.log" 2>&1; echo "exit $?"; tail -20 "$S/r1b-door.log"
git status --short          # EXPECT exactly 3: the two src files + docs/samples/organic-craft/pricing-desk.html
node -e "const t=require('fs').readFileSync('docs/samples/organic-craft/pricing-desk.html','utf-8');process.stdout.write('dagger='+((t.match(/†/g)||[]).length)+' check='+((t.match(/✓/g)||[]).length)+'\n')"
#    EXPECT dagger=0 check=13 — the whole move, measured, not reasoned.

# 1c. GREEN — one directory per invocation
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design > "$S/r1c-design.log" 2>&1; echo "exit $?"; tail -12 "$S/r1c-design.log"
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/components > "$S/r1c-components.log" 2>&1; echo "exit $?"; tail -12 "$S/r1c-components.log"
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js > "$S/r1c-voice.log" 2>&1; echo "exit $?"; tail -12 "$S/r1c-voice.log"
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint > "$S/r1c-lint.log" 2>&1; echo "exit $?"; tail -25 "$S/r1c-lint.log"
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json

# 1d. COMMIT 3 — THREE pathspecs now (the artifact rides WITH its source, or the red ships)
git commit -F "$S/msg3.txt" -- src/components/organic/samples/PricingSample.jsx src/components/pricing/PricingTierCards.jsx docs/samples/organic-craft/pricing-desk.html
git show --stat HEAD        # names exactly those three
git status --short          # EMPTY
```

### STEP 2 — commit 4 (same ruling gates it; commit 3 must be committed first)
```sh
# 2a. RED FIRST, the textbook one: the PIN alone against the UNCURED fixture
cp "$S/tierWord.census.COMMIT4.js" tests/copy/tierWord.census.test.js
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/tierWord.census.test.js > "$S/r2a-pin-RED.log" 2>&1; echo "exit $?"; tail -25 "$S/r2a-pin-RED.log"
#    EXPECT 1 failed: "THE TASTE-VETO SAMPLES …" naming `libraryFixture.rows Gull's Watch tier = "Thorp"`.
#    ⛔ A GREEN HERE IS A STOP (LANE-PARALLEL's zsh warning: a red-first that comes back green means
#    the cp did not land). Confirm with: git status --short  and  grep -n "tier: 'Thorp'" src/components/organic/samples/fixtures.js

# 2b. the cure, then the same door for library-desk.html
cp "$S/fixtures.COMMIT4.js" src/components/organic/samples/fixtures.js
npx eslint src/components/organic/samples/fixtures.js tests/copy/tierWord.census.test.js > "$S/r2b-eslint.log" 2>&1; echo "exit $?"   # BARE
UPDATE_ORGANIC_SAMPLES=1 GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design/organicSamples.test.js > "$S/r2b-door.log" 2>&1; echo "exit $?"
git status --short          # EXPECT exactly 3: fixtures.js, the census, docs/samples/organic-craft/library-desk.html
grep -c 'Thorpe' docs/samples/organic-craft/library-desk.html    # EXPECT 1

# 2c. GREEN — the directory of every file this commit touches, WHOLE
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy > "$S/r2c-copy.log" 2>&1; echo "exit $?"; tail -12 "$S/r2c-copy.log"
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design > "$S/r2c-design.log" 2>&1; echo "exit $?"; tail -12 "$S/r2c-design.log"
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/components > "$S/r2c-components.log" 2>&1; echo "exit $?"; tail -12 "$S/r2c-components.log"
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint > "$S/r2c-lint.log" 2>&1; echo "exit $?"; tail -25 "$S/r2c-lint.log"
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json

# 2d. COMMIT 4
git commit -F "$S/msg4.txt" -- src/components/organic/samples/fixtures.js tests/copy/tierWord.census.test.js docs/samples/organic-craft/library-desk.html
git show --stat HEAD ; git status --short
```

### STEP 3 — the DRY-RUN composition (LANE-PARALLEL's last addendum; a clean apply is never reasoned)
```sh
TIP=$(git -C "$SP/consist" rev-parse HEAD)      # read-only; or the sha the chair names
git worktree add --detach "$S/dryrun" "$TIP"
ln -s "$W/node_modules" "$S/dryrun/node_modules"
git -C "$S/dryrun" cherry-pick d071f5068 de16bdf6a <commit3> <commit4>
#  quote: the file set per commit, blob equality vs this branch, or the verbatim conflict
git worktree remove --force "$S/dryrun"
```

---

# THE BATCH-1 APPLY SCRIPT (2026-09-20 ~16:0x EDT — written for a composer who has never met me)

**Target:** worktree `$SP/batch-1`, branch `batch-1-2026-09-20`, cut at the integration tip `7a4ea48e9`.
**`S` below is always `$SP/lane-fix-p9-scratch`** (this note's own directory). Nothing in this lane's
worktree is needed except the two commits, which are in the shared object store.

⛔ **THE GOLDEN PIN IN THE SECTIONS ABOVE IS STALE AT THE BATCH BASE.** Verified by object read
(`git show 7a4ea48e9:<path> | shasum -a 256`), the batch base carries:

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json   (unmoved)
88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084  tests/fixtures/dossier-prose-manifest-golden.json  (CURE-J's re-record)
```
Hash both before the first command and after the last; identical, or STOP.
⛔ Per addendum 114: before closing, grep `tests/ src/ scripts/` for `921c51cf` (this branch's stale
prose-golden literal) — FIX-P9 writes no such literal, but the sweep is owed by anyone near a golden.

## UNITS, IN ORDER. Each is one commit. Never reorder 4 before 3, or 5 before 4.

| # | how it lands | pathspec (EXACT, `git commit -F <msg> -- <these>`) | message |
|---|---|---|---|
| 1 | `git cherry-pick d071f5068` | (as committed) | — |
| 2 | `git cherry-pick de16bdf6a` | (as committed) | — |
| 3 | copy 2 files + the door | `src/components/organic/samples/PricingSample.jsx src/components/pricing/PricingTierCards.jsx docs/samples/organic-craft/pricing-desk.html` | `$S/msg3.txt` |
| 4 | copy 2 files + the door | `src/components/organic/samples/fixtures.js tests/copy/tierWord.census.test.js docs/samples/organic-craft/library-desk.html` | `$S/msg4.txt` |
| 5 | copy 2 files | `src/copy/en.js tests/copy/tierWord.census.test.js` | `$S/msg5.txt` |
| 6 | copy 1 file | `tests/lib/seoCompendium.test.js` | `$S/msg6.txt` |

⚠ `d071f5068` lacks the `Co-Authored-By` trailer. Recorded by the chair; **never amend it.**
⚠ The chair's forecast says 1 and 2 merge-tree clean at `7a4ea48e9`. If a pick conflicts, STOP.

## THE SOURCE FILES — verify each SHA-256 before copying

```
be16f8ec6ff761e4d62e912029f2166e012c7e87afc3dace43a582d8195c88d9  $S/PricingSample.COMMIT3.jsx     -> src/components/organic/samples/PricingSample.jsx
4205c905b02381eeec21aea8f37d40a25df5da6eb3f79749dce2fb9f02d7b654  $S/PricingTierCards.COMMIT3.jsx  -> src/components/pricing/PricingTierCards.jsx
bf5a175c8dfa16bd95f273d71ae116edbc6ac53591b2412b81a810d6a29cb6ec  $S/fixtures.COMMIT4.js           -> src/components/organic/samples/fixtures.js
278e26e62ba02be44bdbfbb015334b4161bfafacc5f5eb9f53168b3c52d91117  $S/tierWord.census.COMMIT4.js    -> tests/copy/tierWord.census.test.js   (unit 4)
c105bd6b518a044b9887893fe7f28e78983f0456eaa1e9c7ebdf3f1bf35824ac  $S/en.COMMIT5.js                 -> src/copy/en.js
01c4ed5430eadf8d9df68b0db80ae8dd155e64e8abc7e3cb62d45c327e72b4ce  $S/tierWord.census.COMMIT5.js    -> tests/copy/tierWord.census.test.js   (unit 5 — STACKED ON UNIT 4's)
7a9d64c76e2598f181ffea4c49db94fbf4aceb52f6f92be386ba499abb8e715f  $S/seoCompendium.COMMIT6.js      -> tests/lib/seoCompendium.test.js
```
⛔ `tierWord.census.COMMIT5.js` ALREADY CONTAINS unit 4's arm. Unit 5 copies it over unit 4's file;
it is not a patch on top. A `diff` of the two drafts shows exactly unit 5's addition.

⛔ These drafts were cut against **`de16bdf6a`'s** copies of `en.js`, `fixtures.js`,
`seoCompendium.test.js` and `tierWord.census.test.js`. Before copying, confirm the batch base's copy
of each is identical to this branch's (`git diff de16bdf6a HEAD -- <path>` empty in the batch
worktree). If any differs, STOP — the draft must be rebuilt, not force-copied.

## THE MUTEX LINE (spell it inline every time; a line with no printed count DID NOT RUN)

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 <EXPLICIT FILES> > "$S/<log>" 2>&1; echo "exit $?"; tail -25 "$S/<log>"
```
⛔ Never `&&`-chain these (a red blinds everything after it). ⛔ Never pipe a gate. ⛔ `npx eslint` runs
BARE, never through the mutex. **FOCUSED FILES ONLY** — the chair's one full check is the
whole-directory proof.

## UNIT 3 — the pricing sample follows the product
```sh
cp "$S/PricingSample.COMMIT3.jsx"    src/components/organic/samples/PricingSample.jsx
cp "$S/PricingTierCards.COMMIT3.jsx" src/components/pricing/PricingTierCards.jsx
npx eslint src/components/organic/samples/PricingSample.jsx src/components/pricing/PricingTierCards.jsx > "$S/b1-u3-eslint.log" 2>&1; echo "exit $?"
# RED-FIRST (condition 1) — the drift guard, BEFORE the door:
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design/organicSamples.test.js > "$S/b1-u3-RED.log" 2>&1; echo "exit $?"; tail -25 "$S/b1-u3-RED.log"
#   EXPECT exactly ONE failing title, "each committed fixture is byte-identical to a fresh SSR
#   render (drift guard)", naming pricing-desk.html. ⛔ A GREEN IS A STOP. Another red is a STOP.
# THE DOOR (condition 2), that ONE file, through the mutex:
UPDATE_ORGANIC_SAMPLES=1 GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design/organicSamples.test.js > "$S/b1-u3-door.log" 2>&1; echo "exit $?"
# CONDITION 3 — prove the diff is EXACTLY the counted substitution:
git status --short      # EXPECT exactly the 3 unit-3 paths, nothing else
node -e "const t=require('fs').readFileSync('docs/samples/organic-craft/pricing-desk.html','utf-8');process.stdout.write('dagger='+((t.match(/†/g)||[]).length)+' check='+((t.match(/✓/g)||[]).length)+'\n')"
#   EXPECT dagger=0 check=13
git diff --stat -- docs/samples/organic-craft/   # EXPECT only pricing-desk.html; siblings untouched
# CONDITION 4 — the plain re-run:
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design/organicSamples.test.js > "$S/b1-u3-green.log" 2>&1; echo "exit $?"; tail -12 "$S/b1-u3-green.log"
# CONDITIONS 5 + 6 — the artifact rides WITH its source; paste the counts into the message first:
git commit -F "$S/msg3.txt" -- src/components/organic/samples/PricingSample.jsx src/components/pricing/PricingTierCards.jsx docs/samples/organic-craft/pricing-desk.html
git show --stat HEAD ; git status --short
```

## UNIT 4 — the library sample's rung, and the census arm that holds it
```sh
# RED-FIRST: the PIN ALONE against the UNCURED fixture (the textbook one)
cp "$S/tierWord.census.COMMIT4.js" tests/copy/tierWord.census.test.js
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/tierWord.census.test.js > "$S/b1-u4-RED.log" 2>&1; echo "exit $?"; tail -25 "$S/b1-u4-RED.log"
#   EXPECT 1 failed: THE TASTE-VETO SAMPLES, naming libraryFixture.rows Gull's Watch tier = "Thorp".
#   ⛔ A GREEN IS A STOP — it means the cp did not land. Confirm with:
#      git status --short   and   grep -n "tier: 'Thorp'" src/components/organic/samples/fixtures.js
cp "$S/fixtures.COMMIT4.js" src/components/organic/samples/fixtures.js
npx eslint src/components/organic/samples/fixtures.js tests/copy/tierWord.census.test.js > "$S/b1-u4-eslint.log" 2>&1; echo "exit $?"
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/tierWord.census.test.js > "$S/b1-u4-cured.log" 2>&1; echo "exit $?"; tail -12 "$S/b1-u4-cured.log"
# the drift guard reds on library-desk, then the door, then green — same four conditions as unit 3:
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design/organicSamples.test.js > "$S/b1-u4-RED2.log" 2>&1; echo "exit $?"; tail -20 "$S/b1-u4-RED2.log"
UPDATE_ORGANIC_SAMPLES=1 GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design/organicSamples.test.js > "$S/b1-u4-door.log" 2>&1; echo "exit $?"
grep -c 'Thorpe' docs/samples/organic-craft/library-desk.html    # EXPECT 1
grep -c '>Thorp<' docs/samples/organic-craft/library-desk.html   # EXPECT 0
git diff --stat -- docs/samples/organic-craft/                   # EXPECT only library-desk.html
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design/organicSamples.test.js > "$S/b1-u4-green.log" 2>&1; echo "exit $?"; tail -12 "$S/b1-u4-green.log"
git commit -F "$S/msg4.txt" -- src/components/organic/samples/fixtures.js tests/copy/tierWord.census.test.js docs/samples/organic-craft/library-desk.html
git show --stat HEAD ; git status --short
```

## UNIT 5 — the wizard's prose, and the census arm that reaches a STRING
```sh
# RED-FIRST: the ARM ALONE against UNCURED en.js
cp "$S/tierWord.census.COMMIT5.js" tests/copy/tierWord.census.test.js
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/tierWord.census.test.js > "$S/b1-u5-RED.log" 2>&1; echo "exit $?"; tail -25 "$S/b1-u5-RED.log"
#   EXPECT 1 failed: THE READER-FACING PROSE, naming the TWO src/copy/en.js strings and NOT
#   fixtures.js (unit 4 already cured it). ⛔ A GREEN IS A STOP.
cp "$S/en.COMMIT5.js" src/copy/en.js
npx eslint src/copy/en.js tests/copy/tierWord.census.test.js > "$S/b1-u5-eslint.log" 2>&1; echo "exit $?"
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/tierWord.census.test.js tests/copy/voiceMechanics.test.js tests/copy/localeParity.test.js > "$S/b1-u5-green.log" 2>&1; echo "exit $?"; tail -15 "$S/b1-u5-green.log"
git commit -F "$S/msg5.txt" -- src/copy/en.js tests/copy/tierWord.census.test.js
git show --stat HEAD ; git status --short
```

## UNIT 6 — the compendium head test declares its synthetic row
```sh
cp "$S/seoCompendium.COMMIT6.js" tests/lib/seoCompendium.test.js
npx eslint tests/lib/seoCompendium.test.js > "$S/b1-u6-eslint.log" 2>&1; echo "exit $?"
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lib/seoCompendium.test.js tests/lint/negativeAssertionAnchor.walker.test.js > "$S/b1-u6-green.log" 2>&1; echo "exit $?"; tail -20 "$S/b1-u6-green.log"
#   ⛔ NO RED-FIRST IS OWED HERE and none should be faked: the new arm pins a property the tree
#   already satisfies. The anchor walker is run WITH it because this file carries a frozen row of
#   exactly 1 un-anchored site and the draft keeps it at 1 (measured: HEAD 1, draft 1).
git commit -F "$S/msg6.txt" -- tests/lib/seoCompendium.test.js
git show --stat HEAD ; git status --short
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
```

## RED-FIRSTS: WHAT IS ALREADY EXECUTED AND QUOTED, AND WHAT IS STILL OWED

**ALREADY EXECUTED (ungated, quoted in the messages — the composer need not repeat these):**
- unit 3: `npx eslint` BARE on both files, **exit 0** clean; the rendered-glyph census
  (RENDERED `†` in src/ 1 → 0 while matching LINES 4 → 6); `pricing-desk.html` holds 13 `†`.
- unit 4: both drafts parse (espree); `library-desk.html` holds exactly 1 rendered `>Thorp<`.
- unit 5: **the arm's own logic, executed with plain node over the real tree** (`$S/probe-commit5.mjs`,
  exit 0): forbidden set derives to exactly `[{token:'thorp',cased:'Thorp',word:'Thorpe'}]`;
  uncured tree → **3 offenders** (fixtures.js + the two en.js strings); with the unit-4 and unit-5
  texts substituted → **0 offenders**; 2,250 files scanned, 20 raw-hit suspects, zero false positives.
- unit 6: anchor-site count HEAD **1**, draft **1**; draft parses.
- ALL UNITS: edge-shared membership measured — none of the four `src/` paths
  (`PricingSample.jsx`, `PricingTierCards.jsx`, `fixtures.js`, `en.js`) is in the union of the five
  bundle metas' 148 `inputs`. Addendum 98 discharged; no `build:edge-shared` is owed.

**STILL OWED, INSIDE THE BATCH WINDOW** (each is marked `[BATCH WINDOW]` in its message file):
unit 3's drift-guard red + door + green; unit 4's pin-alone red, cured green, drift-guard red + door
+ green; unit 5's arm-alone red and cured green; unit 6's focused green + the anchor walker.

## REGISTERS THIS LANE MOVES, AS DELTAS

**Lighting** (register frozen `2664·359·2305·25501·6812`), cumulative for FIX-P9 across all six units:
`files +0 · parked +0 · credited +0 · titles +6 · suiteTitles +1`
(commit 1 +1/+0 · commit 2 +2/+1 · unit 3 +0/+0 · unit 4 +1/+0 · unit 5 +1/+0 · unit 6 +1/+0.)
Zero `test`/`it`/`describe` removed anywhere; **no test file created, renamed or deleted by this lane**,
so no new walker-directory opt-in. ⛔ NEVER REFROZEN — the refreeze is the chair's terminal act.

**Observed-shape**: commit 1's regenerated compendium artifact is an execution INPUT
(`detectorSources: []`, so no governed migration bundle). Absorbed by the chair at the composition
with the plain `--write`. `scripts/.observed-shape-readers-baseline.json` is UNTOUCHED by this lane.

**Tier-word census register**: stays at ZERO. Both new arms are CURED-SURFACE arms, not register rows.

## DIRECTORIES THE CHAIR'S ONE FULL CHECK MUST COVER FOR THIS LANE
Measured with `git grep -l` over `tests/` for each touched file's basename (addendum 114's law):
`tests/lint` (mandatory, always) · `tests/copy` · `tests/design` · `tests/components` · `tests/lib` ·
`tests/build` · `tests/docs` · `tests/domain` · `tests/store` · `tests/joins` · `tests/ui`.
The chair's forecast already names the thirteen `tests/ui/compendium*` files,
`tests/docs/compendiumDataFreshness.test.js` and `tests/store/operationRegistry.walker.test.js` as
readers of the regenerated compendium artifact; all are inside the full check.

## ⛔ NOTICED AND NOT TOUCHED — carried forward, plus ONE NEW

Items 1, 3 and 4 of the original list are now units 4, 6 and 5. Item 2 (the observed-shape baseline)
is the chair's at the composition. **Items 5 and 6 are CLOSED by the chair.** Remaining:

- ⭐ **NEW, found by unit 5's derivation and reported rather than built:**
  `src/lib/emailTemplates.js:153` says **"Up to Town size (Capital with a Cartographer
  subscription)"**. "Capital" is the pricing catalog's synonym token, not the reader-facing word —
  the estate word for that rung is **"Metropolis"**. It is a reader-facing sentence in a PAID-SURFACE
  email, so it is outside this lane's assigned scope and outside the census's derived scope (the arm
  derives from SIZE_LADDER, which excludes `capital` precisely so the eight legitimate "Capital"
  literals in src/ stay green). **Slot:** one word plus an arm that derives the `capital` alias's
  reader-facing word, or a ruling that the email may use the catalog synonym.

## STATE AT THIS PAUSE
Nothing staged, nothing modified, tip `de16bdf6a`, `git status --short` EMPTY, both this branch's
goldens at their recorded hashes. Scratch written this turn: `FIX-P9.STOP.md`, `fixtures.COMMIT4.js`,
`tierWord.census.COMMIT4.js`, `en.COMMIT5.js`, `tierWord.census.COMMIT5.js`, `seoCompendium.COMMIT6.js`,
`msg3.txt`, `msg4.txt`, `msg5.txt`, `msg6.txt`, `build-commit4.mjs`, `build-commit56.mjs`,
`probe-commit5.mjs`, `eslint.commit3.log`. ⛔ `$SP/batch-1` was NOT touched.
