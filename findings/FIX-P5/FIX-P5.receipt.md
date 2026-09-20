# FIX-P5 — RECEIPT (complete, 2026-09-20 09:15 EDT)

Lane: Opus FIX-P5 (parallel). Chair: Fable 5.1, session a9df403c.
Worktree `$SP/lane-fix-p5`, branch `fix-floors-labels-2026-09-20`, cut at **63e40fe57**.
`git status --short` **EMPTY**. Working tree clean; nothing staged, nothing untracked.

## OUTCOME

Nine items were assigned. **Six are cured and landed with walkers; two are STOPPED with
measurements that belong to the owner; one is REFUTED by the source.** Five commits, each
red-first proved, each by explicit pathspec, each verified with `git show --stat HEAD` to
name only its own files.

## THE COMMITS

| sha | subject |
|---|---|
| `e207d0718` | the floors, the lock mark and the check reach /pricing (F9, F16, noticed 4) |
| `881c84863` | register the ladder cells as a new launch-pill host (the follow-up `e207d0718` owed) |
| `5c29fef92` | the phone bar's seats hold their words, and the painted control's overhang is measured (F8, noticed 7) |
| `a5575107a` | one tier word on every reader-facing surface (F14) |
| `ec7d8a363` | a dossier badge's capitals belong to its style (noticed 6, and F14's last site) |

26 files: 16 under `src/`, 9 under `tests/`, 1 manifest.

## EVERY COUNT LINE (mutex, SHARED tier, `--pool=threads --maxWorkers=2`)

RED FIRST — each cure's test executed against a deliberately uncured tree, plant restored
byte-identically every time (`diff` against a saved cured copy empty):

```
GROUP A (2 plants: the charter's 12px <p> loses proseFontSize; lockedCell forced false)
  Test Files  2 failed (2)
       Tests  3 failed | 19 passed (22)
  FAIL launchLock.pricing > the entitlement ladder marks its priced cells and only its priced cells
       Expected: "$2.99 per settlementAvailable at launch"   Received: "$2.99 per settlement"
  FAIL publicChromeFloor > THE PROSE FLOOR: every prose-shaped size on a rostered surface …
       src/components/pricing/PricingBands.jsx:141  12px  ::  <p style={{ margin: 0, fontSize: FS.sm, …
  FAIL publicChromeFloor > the prose-floor roster baselines are exact in both directions
       PricingBands "floored": 12 -> 11

GROUP B (plant: flex: '1 1 auto' -> flex: 1)
  Test Files  1 failed (1)
       Tests  1 failed | 11 passed (12)
  FAIL phoneBarOrder > … > the seats really are sized by their content in the shipped source
       expected '\nimport { useState, …' to match /flex:\s*'1 1 auto'/

GROUP C (plant: 'Thorpe' -> 'Thorp' in the PDF's tier table)
  Test Files  1 failed (1)
       Tests  1 failed | 3 passed (4)
  FAIL tierWord.census > every tier-label table in src/ spells the smallest rung the one way
       src/pdf/lib/viewModel.js:58  6 rungs, thorp = "Thorp"

GROUP D (plant: one badge back to literal capitals)
  Test Files  1 failed (1)
       Tests  1 failed | 13 passed (14)
  FAIL dossierLabelCase > … > no dossier component types a shouted word into its content
       src/components/new/tabs/ResourcesTab.jsx:94  "UNEXPLOITED"  (UNEXPLOITED)
```

GREEN:

```
tests/components (pricing 8 files)        Test Files    8 passed (8)      Tests    70 passed (70)
tests/ui (pricing trio)                   Test Files    3 passed (3)      Tests    19 passed (19)
tests/design (contrast + kill list)       Test Files    2 passed (2)      Tests    73 passed (73)
tests/components (4 arrow files)          Test Files    4 passed (4)      Tests    92 passed (92)
tests/copy                                Test Files   13 passed (13)     Tests   155 passed (155)
tests/pdf                                 Test Files   46 passed (46)     Tests   458 passed (458)
tests/config (tierFacts + ladder)         Test Files    2 passed (2)      Tests    44 passed (44)
compendiumHubs + seoCompendium            Test Files    2 passed (2)      Tests    10 passed (10)
tests/components (4 dossier suites)       Test Files    4 passed (4)      Tests    52 passed (52)
tests/ui  WHOLE                           Test Files  162 passed (162)    Tests  1076 passed (1076)
tests/lint WHOLE (final tree)             Test Files    1 failed | 171 passed (172)
                                               Tests    1 failed | 2778 passed (2779)
tests/copy/voiceMechanics (final tree)    Test Files    1 passed (1)      Tests    30 passed (30)
npx eslint, all 26 touched files          clean, exit 0
```

The single failure in `tests/lint` is `sovereigntyLightingContract` — the expected lighting
red. Every other standing instrument (`negativeAssertionAnchor`, `mutationCoverageManifest`,
`voiceMechanics`, eslint) is GREEN on the final tree.

## THE LIGHTING DELTA — MEASURED, ISOLATED, **NOT REFROZEN**

Run once, separately:

```
tests/lint/sovereigntyLightingContract.walker.test.js
  Test Files  1 failed (1)
       Tests  1 failed | 33 passed (34)
AssertionError: the estate's file count moved — re-measure, do not re-word:
  expected 2652 to be 2650
```

The walker throws at the FIRST figure, so it prints only `files`. Isolating my share by
counting the same enumeration on the untouched base tree:

```
$SP/read-tip-63e40fe57   test files: 2651
$SP/lane-fix-p5          test files: 2652
```

- **+1 is the base tree's own drift**, by other hands, between `32602dc60` (where this
  base's register was measured, `2650·383·2267·25028·6677` at `1b381485f`) and `63e40fe57`.
- **+1 is MINE** — `tests/copy/tierWord.census.test.js`.

**MY OWN DELTA, counted from the diff rather than inferred from the walker:**

```
files +1 · parked +0 · credited +1 · titles +16 · suiteTitles +3
```

Per file: arrowGeometry +3 tests / +1 describe · publicChromeFloor +3 · phoneBarOrder
+3 / +1 · dossierLabelCase +1 · launchLock.pricing +1 · lockedPriceSlots +1 · the new file
4 tests / 1 describe. **Zero** `test`/`it`/`describe` removed anywhere in the diff.

⛔ NOT REFROZEN. The refreeze is a train's terminal act and the chair's. The branch register
is at `2656·383·2273·25074·6684` (`c33446830`), two refreezes ahead of this base, so the
chair composes my delta onto THAT, not onto what this tree can see.

## GOLDENS — IDENTICAL BEFORE THE FIRST EDIT AND AFTER THE LAST

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  dossier-prose-manifest-golden.json
```

Re-hashed after the PDF tier-label change, which `tests/pdf`'s 458 tests also cover.

## REGISTERS THIS MOVES WHEN COMPOSED (as DELTAS)

- `phoneChromeFloor.census` ROUTE_BASELINE: `/pricing` **floored 7 -> 17, bare 10 -> 0**, and
  `owner: 'lane 28 — the pricing page'` **REMOVED**. **/pricing is the ONLY row this lane
  moves** — every other row is byte-identical between the untouched base and the committed
  branch (re-verified after the last commit).
- `publicChromeFloor.census` ROSTER: **+3 files** (PricingPage 0/2/0, PricingBands 2/2/0,
  PricingTierCards 3/1/0) and a **new PROSE_FLOOR_ROSTER** (9 / 12 / 3).
- `launchPillHostWrap` OTHER_HOSTS: **+`'src/components/pricing/PricingBands.jsx': 2`**.
- `lockedPriceSlots.census`: **+1 arm** over the entitlement ladder.
- `mutation-coverage-manifest.json`: **+1 rationale row** for the new census.
- ⚠ Pre-existing at the base, **NOT this lane's**, green in the permitted direction:
  `/create` row says bare 98, the tree measures 97 (an owned row may only fall);
  `/settlements` says files 206, the tree measures 208 (files is a floor).

## ⛔ THE TWO ITEMS THAT ARE THE OWNER'S

**F7 — the painted Sign In slip. STOPPED, as the brief orders. Nothing was built.**
At 375 px the brass plate's DOM box is **83.92 x 22.47**; the slip the type is drawn inside
is **46.92 x 11.89** outer and **38.92 x 9.89** content (after its 1 px rule each side and
3 px padding). `AccountMenu` `slipStyle` sets `lineHeight: 1`, so a 12 px face needs 12 px
of height against a 9.89 px box: **it misses by 2.11 px**, and it misses at 320, 391 and 430
too. The control is already PAID at 83.92 x 44.
This is also already the estate's recorded position, which the review did not have in view:
`publicChromeFloor.census.test.js` carries an EXECUTED exception row (§934.26) re-deriving
LIVE / FORCED / PAID every gate run, and pinning the crossover at clientWidth 625.
**The owner's choice: re-cut the plate so the slip is taller, or accept 10 px on a 44 x 44
target.** No third option exists that does not shrink the face or lay something over the
painting.

**noticed 5 — the realm gate's exclamation. REFUTED BY THE SOURCE. Not re-worded.**
The brief expects it in "a JSX text node or content JSON that voiceMechanics does not scan".
It is in neither: `src/copy/en.js:496`, `realmGate.valueLines[1]`; `voiceMechanics` DOES scan
it and carries a named, count-pinned Tier-1 exception for it citing §934.26; and `en.js:486-493`
explains why it lives there rather than in a component (a component literal falls under the
Tier-3 JSX ratchet, whose budget is ZERO and which has no allowlist).
**ODQ §934.26 addendum:** "an owner's verbatim order outranks the estate's own voice law for
that one string ... Vetoable: say the word and the exclamation becomes a full stop."
Re-wording it would overturn an owner's verbatim copy order. If the owner wants the full
stop it is one character in `en.js` and one count in the allowlist row.

## ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. **The taste-approved sample still draws `†`.** `src/components/organic/samples/PricingSample.jsx`
   keeps the dagger while the shipped `FeatureRow` now draws `✓`. A sample is the RECORD of
   what was approved and re-cutting it is a taste decision this lane does not own. The
   divergence is declared at the shipped site. Slot: re-cut the sample to match, or veto the
   glyph change.
2. **The Compendium's tier label is generated and byte-pinned.**
   `scripts/generate-compendium-data.mjs` writes `label: titleCase(id)` -> "Thorp", baked into
   `compendiumData.generated.js`, which `tests/docs/compendiumDataFreshness.test.js` pins
   byte-identical. Registered in the new census with its reason; the row is EXECUTED against
   the shipped artifact so it REDS the day it is cured. Slot: a lane that may regenerate a record.
3. **The gallery capitalises raw facet tokens.** `textTransform: 'capitalize'` in
   `GallerySidebar`, `GalleryCard`, `GalleryDetail` over `galleryUtils.TIER_OPTIONS` — which is
   why the TIER chip reads "Thorp". The same CSS covers terrain, status and tags, so pointing
   the tier at SIZE_LABEL is a decision about how the gallery names ALL its facets. Registered.
   Slot: one ruling on facet naming, then one edit.
4. **Five prose-shaped 12-13 px lines on lane 28's surfaces** — `src/App.jsx:916` and `:946`,
   `src/components/HomeHero.jsx:326` and `:418`, `src/components/generate/ClerkNote.jsx:52`.
   They clear the chrome floor and sit under the prose floor, exactly the class F9 closed on
   /pricing. This is why `PROSE_FLOOR_ROSTER` is opt-in by roster. Slot: add each file to that
   roster as its surface is cured.
5. **`phoneChromeFloor`'s `/create` and `/settlements` rows are stale against 63e40fe57**
   (bare 98 vs 97 measured; files 206 vs 208 measured). Both green in the permitted direction,
   so nothing reds — but a re-measure would bank the win the way the registry's own law asks.
   Slot: re-record at the next composition.
6. **`WizardOutputToolbar` pins sticky at `HEADER_H`** (22.47 px at 375) while the painted
   controls occupy the first 44 px above it. The toolbar's top ~21.5 px therefore sits under
   two invisible buttons across the home plate (x 0-169) and the Sign In plate (x 206-290).
   Measured as geometry only; whether anything interactive lives in that band needs a browser.
   Slot: REVIEW-P2's account walk, at 375.
7. **`tests/components/dossierPhoneFloorAllViews.test.jsx` cannot see /pricing.** It renders
   the dossier's views only, so the rendered half of the floors on the public conversion pages
   is still unmeasured; only the source half is pinned. Slot: a rendered floor walk over the
   public routes, or REVIEW-P2 with the production build.

## THINGS THE GATE CAUGHT IN MY OWN WORK, RECORDED RATHER THAN QUIETLY FIXED

- `--reporter=basic` is not a vitest reporter in this tree. That invocation printed a startup
  error and **no count line — it did not run**, which is exactly the hazard the lane law names.
- `lockedPriceSlots`'s anti-vacuity floor was a **guessed** `rows >= 10` and reded honestly
  (`expected 9 to be greater than or equal to 10`). The ladder measures 4 groups, 9 rows,
  18 value cells, one priced. Replaced with that measurement. Recorded in `e207d0718`.
- `e207d0718` **shipped a red walker**: putting the pill in a `<td>` is a new kind of host and
  `launchPillHostWrap` froze the host set precisely so that is looked at. Closed by
  `881c84863`, which says so in its subject rather than burying it in an unrelated commit.
- My own `not.toMatch` in `phoneBarOrder` was **un-anchored** and `negativeAssertionAnchor`
  caught it. Anchored on the single line above (the marker rule is one line, never wrapped).
