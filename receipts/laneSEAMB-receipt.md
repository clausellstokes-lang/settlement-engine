# TE-SEAM-B receipt — the shipped hamlet-boundary seam cure

Lane: TE-SEAM-B (Opus implementer seat). Date: 2026-08-24.
Worktree: `$SP/laneSEAMB-tree`, created from **`e4ed27f48`** (branch `claude/composite-r4`, the build slot).
`npm ci` in the worktree: exit 0, 468 node_modules entries, `.husky/_` shim present, `seedrandom` present (no manual copy needed).
The chair CASes the branch. This lane moved no refs.

STATUS: **COMPLETE — GREEN.** Tip `73f5dfc02`. Full gate `[gate-tail] exit: 0` over 29,077 tests,
re-proved byte-for-byte at the committed tip. Gate run 1 was RED and the red was MINE (§10.1) —
diagnosed, cured, and the census re-recorded with its cause stated (§10.2).

---

## §1 The defect, restated at the slot

`src/components/map/TierIcon.jsx` and `src/store/mapSlice.js` each carried a private inline
population→tier chain capping **hamlet at 240**, against the landed truth in
`src/data/constants.js` (`POPULATION_RANGES.hamlet.max = 400`, `popToTier` boundary 400).
For populations **241–400** the realm-map icon and the `settType` on a burg-derived config said
`village` while every other surface said `hamlet`. Present and shipping at the build slot.

## §2 The change (3 files, +111 / −18)

Both inline chains replaced with a call to the single landed classifier `popToTier`.
No fallback to a literal 240→400 edit was needed: **no bounded-closure constraint applies to
either surface** — see J-SEAMB-1.

Full diff: §9 below.

### §2.1 A hazard the smallest-shape edit would have shipped (CONFIRMED)

The two chains were **not** pure re-spellings of `popToTier`. `TIER_FROM_POP` in `TierIcon.jsx`
declared `(pop = 0)`, so a missing population defaulted to a thorp. `popToTier` has no default and
falls through every `<=` comparison on `undefined`. Measured:

```
undefined  TIER_FROM_POP=thorp  popToTier=metropolis  popToTier(v??0)=thorp
null       TIER_FROM_POP=thorp  popToTier=thorp       popToTier(v??0)=thorp
0          TIER_FROM_POP=thorp  popToTier=thorp       popToTier(v??0)=thorp
NaN        TIER_FROM_POP=metropolis popToTier=metropolis popToTier(v??0)=metropolis
241        TIER_FROM_POP=village popToTier=hamlet      popToTier(v??0)=hamlet
400        TIER_FROM_POP=village popToTier=hamlet      popToTier(v??0)=hamlet
401        TIER_FROM_POP=village popToTier=village     popToTier(v??0)=village
```

A bare `popToTier(settlement.population)` would therefore have drawn a **metropolis crown** on any
placement of unknown size. That path is live: `PlacementsLayer.jsx:101` calls
`tierFor(settlement || { population: p.population })`, and `p.population` is optional on a
placement record. The cure carries `popToTier(settlement.population ?? 0)` and the guard pins it.
`burgToConfig` needed no guard — `const pop = burg.population || 500` already defaults upstream.

## §3 The producer-equality guard

Added to the **existing** `tests/data/popToTierBoundary.test.js` — no new test file, so no
new-test-file ratchet bill (memory law: a new test file reds three censuses at landing).
That file already existed to assert `popToTier` agrees with `POPULATION_RANGES`; the seam guard is
the same invariant extended from the table to its consumers.

Seven tests added in two blocks:

- **behavioural** — `tierFor` and `burgToConfig({population})` .settType both equal `popToTier(p)`
  across the required boundary set `{60,61,240,241,400,401,900,901,5000,5001,25000,25001}`;
  an explicit `241–400 ⇒ hamlet` assertion on all three surfaces; the stored-tier-wins pin; and the
  `?? 0` regression pin from §2.1 (which also records `popToTier(undefined) === 'metropolis'` as
  the trap being guarded).
- **structural (habitat removal)** — both cured files must contain `popToTier` and must match
  **zero** population-threshold comparisons (`/(?:<=|>=|<|>)\s*(?:60|61|240|…|25001)\b/g`).
  Measured at the cured state: both files return 0 matches, so the ban is exact, not approximate.

## §4 Convicting mutation (CONFIRMED — the control can fail)

Both mutations were applied to the real source, run, and reverted from a byte copy
(`$SP/mutation-backup/`); `diff` after each restore reported IDENTICAL. No `git stash` was used.

**Mutation 1 — re-plant the 240 chain in `TierIcon.jsx`.** `TRUE_EXIT=1`, `4 failed | 6 passed (10)`:

```
FAIL tests/data/popToTierBoundary.test.js > structural — no source file re-forks the tier chain >
     src/components/map/TierIcon.jsx classifies through popToTier only
AssertionError: expected [ '<= 60', '<= 240', '<= 900', …(2) ] to deeply equal []
- Expected
+ Received
- []
+ [ "<= 60", "<= 240", "<= 900", "<= 5000", "<= 25000" ]
 ❯ tests/data/popToTierBoundary.test.js:118:54

AssertionError: expected 'village' to be 'hamlet' // Object.is equality
Expected: "hamlet"
Received: "village"
 ❯ tests/data/popToTierBoundary.test.js:97:60
```

**Mutation 2 — re-plant the 240 chain in `mapSlice.burgToConfig`.** `TRUE_EXIT=1`:

```
FAIL … > mapSlice.burgToConfig stamps the same settType as popToTier at every boundary
AssertionError: expected 'village' to be 'hamlet' // Object.is equality
 ❯ tests/data/popToTierBoundary.test.js:71:74

FAIL … > the 241-400 window is hamlet on every surface, not village
AssertionError: expected 'village' to be 'hamlet' // Object.is equality
 ❯ tests/data/popToTierBoundary.test.js:79:74

FAIL … > structural … > src/store/mapSlice.js classifies through popToTier only
AssertionError: expected [ '<= 60', '<= 240', '<= 900', …(2) ] to deeply equal []
+ [ "<= 60", "<= 240", "<= 900", "<= 5000", "<= 25000" ]
```

Both halves of the guard convict each surface independently.

## §5 Targeted evidence

| Run | Files | Tests | TRUE_EXIT |
|---|---|---|---|
| BASELINE, pre-change (6 files) | 6 passed | 47 passed | 0 |
| Guard alone, post-change | 1 passed | 10 passed (3 pre-existing + 7 new) | 0 |
| Mutation 1 (control) | 1 failed | 4 failed / 6 passed | **1** |
| Mutation 2 (control) | 1 failed | 3 failed / 7 passed | **1** |
| Restored state, 11 files | 11 passed | 121 passed | 0 |
| Walker census, base test file (negative control, §10.1) | 1 passed | 33 passed | 0 |
| Walker census, after the `each` cure + re-record | 1 passed | 33 passed | 0 |
| Mutation re-run vs the RESHAPED structural block | 1 failed | 3 failed / 7 passed | **1** |
| **AT THE COMMITTED TIP `73f5dfc02`, 10 files** | **10 passed** | **123 passed** | **0** |

`npx eslint` on the three changed files: `LINT_EXIT=0`.
`tests/data/popToTierBoundary.test.js` is **not** in `scripts/.test-ratchet-baseline.json`
(grep count 0), so no baselined-failure bookkeeping is owed.

## §6 Lifecycle trace of `settType` (the brief's mandatory leg)

Traced by a dedicated read-only agent, then **every load-bearing claim re-verified by this seat's
own reads** at the lane worktree. Verdict: **`settType`/`tier` from either cured surface is NEVER
persisted. No stale value can be read back. No migration is owed.**

| Path | Finding | Label | Evidence |
|---|---|---|---|
| create | Placement write shape is `{ settlementId, x, y, cellId, placedAt }` — **no tier, no settType** | CONFIRMED (own read) | `src/store/mapSlice.js:365-370` |
| persist (device) | Zustand persistence is an explicit 8-key allowlist and **`mapState` is not in it** | CONFIRMED (own read) | `src/store/persistProjection.js:9-22` |
| persist (campaign) | The written `mapState` envelope is an explicit allowlist — `schemaVersion, fmgSnapshot, seed, customBackdrop, placements, labels, markers, forests, layers, viewport, savedAt`. **No tier/settType key.** Routes to `localStorage['sf_campaigns:<owner>']` and Supabase `saved_maps` | CONFIRMED (own read) | `src/store/campaignSlice.js:808-822` |
| read / hydrate | `replaceMapState` takes `placements` **verbatim**; nothing re-derives a tier, because nothing stored one | CONFIRMED (agent, spot-checked) | `src/store/mapSlice.js:719-742` |
| regenerate | Tier is derived at **render time** on every paint, from the save row's `tier` or the population fallback | CONFIRMED | `PlacementsLayer.jsx:101` |
| `burgToConfig` output | **Never produced** — the function has zero callers (§6.1), so its `settType` reaches no sink at all | CONFIRMED (own grep) | — |

**Answer to the brief's question:** old saves do **not** carry `'village'` for pops 241–400. There
is no stored value to go stale, so the reconciliation the brief anticipated is not owed. The chair
has nothing to rule on for save data.

### §6.1 `burgToConfig` is dead code (CONFIRMED)

Zero callers repo-wide. `grep -rn "burgToConfig"` over the whole tree returns exactly four hits: the
definition (`mapSlice.js:815`), two prose comments (`PlacementsLayer.jsx:152`, `TierIcon.jsx:18`),
and one docs row. It is spread onto the store at `src/store/index.js:83` so it exists on
`getState()`, but nothing reads it; it is absent from `src/store/operationRegistry.js` (20 mapSlice
ops registered, not this one); `src/store/selectors.js` contains zero `burg` references; and there
is no dynamic `store[name]` access anywhere in the repo.

**Consequence for the declared shift: correcting `burgToConfig` changes no behaviour whatsoever.**
It is habitat removal, not a behavioural fix. The entire behavioural change lives in
`TierIcon.tierFor`. Flagged for the chair as a disposition question in §7.2 — I did **not** delete
it (out of lane scope).

### §6.2 The one reachable behavioural path (CONFIRMED — narrower than the brief assumed)

`tierFor`'s population fallback only fires when a placement has no resolvable save row. Modern
placements carry **no `population` key** (see the write shape above), so `p.population` is
`undefined` and the fallback yields `thorp` — the 240 arm is unreachable for them.

The 241–400 window bites on exactly one path: **v1→v2 migrated campaigns.** `migrateMapState`
preserves the legacy `name`/`population` onto each v2 placement record and coerces
`settlementId: p.settlementId || null`:

```js
// src/store/campaignSlice.js:314-323 (verified by own read)
v2Placements[String(p.burgId)] = {
  settlementId: p.settlementId || null,
  x: p.x, y: p.y,
  cellId: p.cellId ?? null,
  placedAt: p.placedAt || new Date().toISOString(),
  // Preserve legacy name/population so a restore can rebuild the burg …
  name: p.name,
  population: p.population,
};
```

A legacy placement carrying a real population with a null/unresolvable `settlementId` therefore
reaches the classifier with a genuine number, and the 240 boundary decides the glyph. Narrow, real,
and user-visible.

### §6.3 ⚠ One PERSISTED DERIVATIVE does exist — cached gallery covers (CONFIRMED, chair's call)

The tier value is not persisted, but the **rendered glyph** is baked into a cached image:

- `serializeOverlaySvg` clones the live `[data-map-overlay-svg]` node (`src/lib/mapThumb.js:81-90`).
- `PlacementsLayer` — and therefore every `TierIcon` glyph — is **inside** that SVG:
  `src/components/MapOverlay.jsx` opens the tagged `<svg>` at :261, renders `<PlacementsLayer>` at
  :342, closes at :346. (Verified by own read.)
- The composite is encoded JPEG q=0.82 and uploaded to the public Supabase Storage bucket
  `map-backdrops`, with the URL persisted to the `gallery_image_url` column
  (`src/lib/mapThumb.js:139-147`, `src/lib/gallery.js:1143-1147`).
- It is **never invalidated**: seeding is keyed once per `${kind}:${campaignId}` and the capture
  "only FILLS AN EMPTY SLOT" — `MapShareEditor.jsx:174-198` returns early when `imageUrl` is set.

So any campaign cover published **before** this cure keeps a JPEG showing the old village dot for a
241–400 settlement, and no code path will regenerate it. **This is the only reconciliation question
the cure raises, and it is a data question, not a code one** — re-capture the affected covers, or
accept the drift. Reported, not acted on, per the brief. Note it is bounded by §6.2: only covers of
v1-migrated campaigns with unlinked legacy placements in that window are affected.

## §7 Declared shift

### §7.0 Blast radius, proved exhaustively (CONFIRMED)

Rather than assert the window, I scanned it. The retired chain (copied verbatim from
`e4ed27f48:TierIcon.jsx:25-31`) versus the cure, over every integer 0..120000 plus the non-numeric
edges:

```
integer domain 0..120000 scanned
differing populations: 160
min differing: 241   max differing: 400
contiguous window? true
old tier in window: village -> new tier: hamlet
undefined  old=thorp       new=thorp
null       old=thorp       new=thorp
NaN        old=metropolis  new=metropolis
-5         old=thorp       new=thorp
0          old=thorp       new=thorp
0.5        old=thorp       new=thorp
240.5      old=village     new=hamlet    <<< DIFFERS
400.5      old=village     new=village
Infinity   old=metropolis  new=metropolis
```

The change moves **exactly** the contiguous window 241–400 and nothing else. Every nullish, NaN,
negative and infinite edge is byte-identical to the retired behaviour — the `?? 0` guard is what
buys that.

### §7.1 THE DECLARED SHIFT ROW

> **Declared shift — hamlet-boundary seam cure (TE-SEAM §3 window 241–400).**
> Same-seed realm-map tier icons and burg-derived `settType` flip **village → hamlet** for
> settlement populations 241–400 inclusive. Cause: `TierIcon.jsx` and `mapSlice.burgToConfig`
> carried private inline tier chains capping hamlet at 240 against the landed
> `POPULATION_RANGES.hamlet.max = 400`; both now call `popToTier`. No other population, and no
> other surface, moves. Stored tiers are untouched — THE PROMISE is not engaged (nothing in a save
> or a placement record stores a tier from either site; §6).

### §7.2 The denominator, stated honestly

**Fixture corpus: 0 / 47.** A dedicated census walked every checked-in fixture, sample, golden and
demo dataset with a population-bearing record. **Not one record falls in 241–400.**

| Dataset | Denominator | In 241–400 |
|---|---|---|
| `tests/fixtures/simSoakReceiptFixture.json` | 36 | 0 |
| `tests/fixtures/legacy-saves/april-2026-v1.json` | 3 | 0 |
| `tests/fixtures/save-museum/{02,03,04}-*.json` | 3 | 0 |
| `src/data/sampleDossier.json` | 1 | 0 |
| `src/components/home/landingFixture.js` | 2 | 0 |
| `src/domain/compendium/generated/compendiumData.generated.js` | 1 | 0 |
| `src/components/organic/samples/fixtures.js` | 1 | 0 |
| `src/data/sampleSettlements.js`, `src/data/foundingSeeds.js` | 0 | 0 (tier only, no population) |
| `tests/fixtures/cartography-calibration-corpus.json` | 0 | 0 (504 tier rows, **no** population key) |
| **TOTAL** | **47** | **0** |

Two structural reasons this zero is robust rather than lucky: there is **no checked-in burg/FMG
fixture at all** (both bridges build burgs live from `pack.burgs` with `b.population * 1000`), and
`tierFor` short-circuits on an explicit tier, which every museum/legacy/landing record carries.

**So the corpus cannot be the denominator — the band is.** The defensible framing:

> **241–400 is 160 of the 340 integers in the canonical hamlet band (61–400) — 47.1% of
> hamlet-tier population space.**

That is the honest exposure statement, and it also explains why this shipped: *the seam was
invisible to the corpus precisely because nothing in the corpus samples the window.*

### §7.3 At-risk tests and goldens: none (CONFIRMED)

- 56 test files contain a population literal in 241–400 (82 literals), but the **intersection with
  files referencing `TierIcon|tierFor|burgToConfig|PlacementsLayer|mapSlice` is empty.** Those are
  engine/demographics tests classifying through the unchanged `popToTier`.
- Every seam-touching test pins an explicit tier, so none exercises the classifier.
  ⚠ **Near-miss worth recording:** `tests/ui/placementsLayerFirstAdvance.test.jsx:33` is
  **pop 400 with `tier: 'village'`**. Under the retired chain 400 → village; under `popToTier`
  400 → hamlet. It stays green *only* because the explicit tier wins. If anyone ever strips that
  `tier` field, that line flips village → hamlet. Deliberately left as-is — the fixture is
  self-consistent under the stored-tier rule and changing it would be scope creep.
- `scripts/.observed-shape-readers-baseline.json` — `TierIcon.jsx {"settType on settlement": 1}`
  and `mapSlice.js {"tier on save": 1}` both hold: the cure preserves the `settlement.settType`
  read and adds no new observed-shape read (`popToTier(pop)` reads a local).
- `scripts/.size-baseline.json` — neither file has an entry, so the +2/+6 line growth hits no cap.
- No thumbnail/prerender golden encodes a derived tier.

### §7.4 A pre-existing red that is NOT this lane

`scripts/check-observed-shape-readers.mjs` exits 1 at **pristine `e4ed27f48`** — reproduced from a
clean `git archive HEAD` extraction, same exit code, same message ("observed-shape detector or
unscanned execution input changed since the schema-10 instrument was governed"). It is a
pre-existing instrument-governance state. It is also **not in the `npm run check` chain** (verified
by reading the script chain: the chain runs the eleven `validate:*` legs, `typecheck:ratchet`,
`typecheck:domain:strict`, `lint`, `test:ratchet`, `build`, `verify:dist` — no observed-shape leg),
so it neither affects this lane's gate nor should be blamed on it.

## §8 Judgment rows

**J-SEAMB-1 — imported `popToTier` at both sites rather than editing the literal 240→400.**
The brief allowed a literal fix if an import were structurally awkward. It is not, at either site,
and I verified rather than assumed:
- `src/data/constants.js` is a **zero-import pure-data leaf** (`grep` for import/require: no hits).
- Map side: `src/components/map/heraldRegister.js:49` **already** imports `popToTier` from
  `../../data/constants.js` — same directory, same chunk. Decisive prior art.
- Store side: no store slice imported `src/data/` before this, which is why I checked the
  first-paint closure rather than trusting the shape. `constants.js` is already eager — both
  `src/generators/lookups.js` and `src/components/HomeHero.jsx` import it statically, and
  `vite.config.js` names `main.jsx / kernel / lookups` as the true first-paint graph. The new edge
  therefore adds **no module** to the eager closure and drags nothing behind it (the FP-G11
  formatNumber / FP-G17 resolveTerrain orphan-reversal failure mode does not apply: constants.js is
  neither excised nor unpinned).
The build + `verify:dist` legs of the full gate are the executed check on that reasoning.
Say "veto" to flip either site back to a literal 240→400.

**J-SEAMB-2 — the guard went into the existing `tests/data/popToTierBoundary.test.js`, not a new file.**
The brief prefers this and the memory law bills a new test file against three censuses. That file is
the natural home: it already asserts `popToTier ≡ POPULATION_RANGES`, and the seam guard extends the
same invariant from the table to its consumers. Cost: `tests/data/` now imports a `.jsx` component
and a store slice. Both are safe under the repo's default `environment: 'node'` — `tierFor` is pure,
`theme.js` has no module-level DOM access, and `createMapSlice` is a plain object literal with no
localStorage read at construction. Say "veto" for a dedicated file plus the three ratchet re-stamps.

**J-SEAMB-3 — added a structural ban, not only the behavioural equality the brief asked for.**
Behavioural equality proves the two known surfaces agree today; it cannot see a *third* surface
growing its own chain, which is precisely how this defect arose. The ban is exact rather than
approximate because both cured files measure **zero** threshold comparisons at the cured state.
It is scoped to the two files with a named extension point rather than swept repo-wide, so it
cannot red on unrelated numeric comparisons elsewhere. Say "veto" to drop the structural block.

## §9 Diff

`3 files changed, 111 insertions(+), 18 deletions(-)`

```diff
--- a/src/components/map/TierIcon.jsx
+++ b/src/components/map/TierIcon.jsx
@@ -1,3 +1,4 @@
+import { popToTier } from '../../data/constants.js';
 import { swatch } from '../theme.js';
@@ -21,20 +22,21 @@
-const TIER_FROM_POP = (pop = 0) => {
-  if (pop <= 60)        return 'thorp';
-  if (pop <= 240)       return 'hamlet';
-  if (pop <= 900)       return 'village';
-  if (pop <= 5000)      return 'town';
-  if (pop <= 25000)     return 'city';
-  return 'metropolis';
-};
-
 export function tierFor(settlement) {
   if (!settlement) return 'village';
   const t = (settlement.tier || settlement.settType || '').toLowerCase();
   if (['thorp','hamlet','village','town','city','metropolis'].includes(t)) return t;
-  return TIER_FROM_POP(settlement.population);
+  // ⛔ SINGLE SPELLING: classify through the landed `popToTier`, never an inline
+  // chain. …  The `?? 0` is LOAD-BEARING: `popToTier(undefined)` returns
+  // 'metropolis' where the deleted chain's `pop = 0` default returned 'thorp'.
+  // @guarded-by tests/data/popToTierBoundary.test.js — the producer-equality block.
+  return popToTier(settlement.population ?? 0);
 }

--- a/src/store/mapSlice.js
+++ b/src/store/mapSlice.js
@@ -16,6 +16,12 @@
+// The landed tier classifier. `data/constants.js` is a ZERO-IMPORT pure-data leaf
+// already inside the eager first-paint closure … so this edge adds no module
+// to that closure and drags nothing behind it.
+import { popToTier } from '../data/constants.js';
@@ -815,15 +821,15 @@
     const pop = burg.population || 500;
-    let settType;
-    if (pop <= 60)        settType = 'thorp';
-    else if (pop <= 240)  settType = 'hamlet';
-    else if (pop <= 900)  settType = 'village';
-    else if (pop <= 5000) settType = 'town';
-    else if (pop <= 25000) settType = 'city';
-    else                  settType = 'metropolis';
+    // ⛔ SINGLE SPELLING … `pop` is already defaulted above.
+    // @guarded-by tests/data/popToTierBoundary.test.js
     return {
-      settType,
+      settType: popToTier(pop),
       population: pop,

--- a/tests/data/popToTierBoundary.test.js
+++ b/tests/data/popToTierBoundary.test.js
+ (+85 lines) two describe blocks: "producer equality — every tier classifier
+ agrees with popToTier" (5 tests) and "structural — no source file re-forks the
+ tier chain" (2 test.each cases). Full text in the worktree.
```

SHA256 of the exact bytes the full gate tested:

```
8ee6db4f14f01153206a9fdf8495729f8833bd43fa669b173e6fe181c2a6a609  src/components/map/TierIcon.jsx
3f4abba4dbd69962fcb88177b40953591bb29be5a35ed2d743983dd11df80b21  src/store/mapSlice.js
34ded1af61b82fa4c626a5177d6593826337c13ef37f376f6705536c0ada88f9  tests/data/popToTierBoundary.test.js
```

Working tree at gate time carried **only** these three modified files (`git status --porcelain`) —
no foreign WIP in this worktree.

## §10 Full gate

### §10.1 RUN 1 — RED, and the red was MINE (`[gate-tail] exit: 1`)

Mutex polled clean before launch; the gate acquired the atomic lock itself as PID 10150 after 0
polls. Disk 13.4 GB. Lint 0 errors / 29 warnings (all pre-existing, none in my files). It died in
`test:ratchet`:

```
[test-ratchet] TEST REGRESSIONS (fix them; do not widen the census):
  1 failing test(s) NOT in the frozen census:
    tests/lint/sovereigntyLightingContract.walker.test.js :: … THE CENSUS IS AN ASSERTION …
      msg: AssertionError: the parked-file count moved from SP-C's measured 358 — a rule
      widened or narrowed, or a lane changed a file's shape; re-MEASURE and re-record:
      expected 367 to be 366 // Object.is equality
```

⚠ **The exit-status trap fired exactly as the standing law says it does.** The background-task
notification for this run reported *"completed (exit code 0)"* — that is my wrapper's trailing
command's status, **not** the gate's. `gate-tail.sh`'s own line said `exit: 1`. Only the
`[gate-tail] exit:` line is a verdict.

**Ownership settled by executed negative control, not by assumption.** With ONLY my test file
restored to its base blob (`git show 'HEAD:tests/data/popToTierBoundary.test.js'`, 1,498 bytes —
non-empty, so the zsh brace hazard did not fire) and both src cures left in place, the walker
passes **33/33, exit 0**. With my guard present it reads 367. **The regression was mine.**

**Root cause:** my structural block's first draft used `test.each(SINGLE_SPELLING_FILES)` — an
`each` over a **non-literal table**. This repo's sovereignty-lighting walker PARKS any test file
that does that, because a parked file's titles cannot be statically registered and so prove nothing
to the census. Parking `popToTierBoundary.test.js` moved parked 366 → 367.

**Cure:** the two arms are now spelled as two ordinary `test()` calls with **literal titles**,
sharing a plain `expectSingleSpelling(rel)` helper. This is the repo's own recorded SP-D idiom —
*loop inside a named test, never generate tests from a loop* — and the same mistake and cure are
already documented in this very census block for the `pactKernelMount` draft. A comment in the
guard now names the trap so the next author does not re-make it.

### §10.2 The census re-record (a legitimate, declared, one-time move)

Un-parking the file exposed a **second** figure the sequential assertions had never evaluated.
Per this block's own standing warning — *"the five figures are asserted in SEQUENCE … Whoever
re-records MUST re-derive all five, and must not assume the four unasserted ones are still at
their frozen values"* — I measured all five by execution rather than by arithmetic, using the
documented one-line probe (planted, run, removed; the file restored byte-identically, `diff` clean):

```
PROBE5 {"files":2525,"parked":366,"credited":2159,"titles":21059,"suiteTitles":5854}
```

`tests/lint/sovereigntyLightingContract.walker.test.js:6582` re-recorded, with the cause stated in
the block's established format:

> `2,525/366/2,159/21,052/5,852` → `2,525/366/2,159/21,059/5,854`

- **+7 titles** — the 7 arms I added (5 producer-equality, 2 structural).
- **+2 suiteTitles** — the 2 `describe` blocks I added.
- **files / parked / credited UNCHANGED** — no new test file, and the file is credited again.
- Arithmetic closes: 366 + 2,159 = 2,525.

⚠ **The base was proved undrifted rather than assumed** — the very hazard this block exists to
prevent. The negative control in §10.1 (my test file at base, src cures in place, walker green
33/33) *is* the proof that the base tuple was exactly the frozen `21,052/5,852`. So the whole
+7/+2 is this car's, with nothing inherited from a concurrent lane.

**This is the only figure this car moves, and it is declared, not absorbed.**

### §10.3 Post-cure targeted evidence

| Check | Result | TRUE_EXIT |
|---|---|---|
| `sovereigntyLightingContract.walker.test.js` | 33 passed (33) | 0 |
| `popToTierBoundary.test.js` | 10 passed (10) | 0 |
| Convicting mutation re-run **against the reshaped block** | 3 failed / 7 passed | **1** |

The control was re-executed after the reshape — a guard that convicted in its old shape proves
nothing about its new one. `mapSlice.js` restored byte-identically afterwards (`diff` clean).

### §10.4 RUN 2 — GREEN ✅

Relaunched over the 4-file tree. Mutex polled clean before launch; acquired as PID 54978 after 0
polls. All 20 legs executed in order — the eleven `validate:*` steps, `typecheck:ratchet`,
`typecheck:domain:strict`, `lint`, `test:ratchet`, `prebuild`, `build`, `postbuild`, `verify:dist`
— nothing inherited from run 1.

```
[test-ratchet] OK — no test regressions (11 known failure(s) of 29077 tests, ceiling 11).
[prerender] wrote 314 static route documents … under dist/
[test-ratchet] STRICT DIST OK — 53 discovered/reported file(s), 467 test(s), zero
               failed/non-run/uncollected/missing/extra/duplicate rows.
[gate-tail] full log: $TMPDIR/gate-tail.54093.log
[gate-tail] exit: 0 (the gate's own status, not a pipe's)
```

Every green criterion the brief set is met:

| Criterion | Value |
|---|---|
| `[gate-tail] exit:` | **0** |
| collected-test count (from the FULL log, not the tail) | **29,077 tests**; strict-dist 467 |
| banked failures | 11, ceiling 11 — unchanged, none added |
| disk | 13.3 GB free (≫ 300 MB) |
| full log | `$TMPDIR/gate-tail.54093.log` (956 lines) |

### §10.5 The commit, and the re-proof AT the tip

Staged **explicitly by path** — never `-A`/`-u`/`.`. Four files staged, four committed, nothing
else in the tree before or after.

Commit **`73f5dfc02d9e1a8be51a8bc3788ba566de910ee1`**.

The pre-commit hook ran `lint-staged` → `eslint --fix` → *"Updating Git index again"*, which is
exactly the standing hazard that makes `git diff HEAD` blind. **Re-proved at the committed tip by
comparing blob bytes, not diffs** — SHA256 of each `git show HEAD:<path>` against the bytes the
gate actually tested:

```
MATCH  src/components/map/TierIcon.jsx                        8ee6db4f…c2a6a609
MATCH  src/store/mapSlice.js                                  3f4abba4…1df80b21
MATCH  tests/data/popToTierBoundary.test.js                   413eb279…d9d43063f
MATCH  tests/lint/sovereigntyLightingContract.walker.test.js  cc12e604…7548bd6e3
```

All four identical — the hook changed nothing, so run 2's green binds to the commit rather than to
a superseded working tree. `git status --porcelain` is empty at the tip; no untracked file was
consumed by the hook.

**Final targeted re-run AT the committed tip** (a check, not an edit, is the last action before the
done-claim): **10 files / 123 tests passed, TRUE_EXIT=0.**

⚠ **A FOREIGN STASH IS PRESENT AND WAS PRESERVED.** `git stash list` shows
`stash@{0}: On analytics-intelligence-layer: generation-tuning fixes` = `21341de0c…`. That is
**not** lint-staged's transient backup (which was `3291f3c21`, "WIP on (no branch): e4ed27f48", and
was cleaned up by the hook itself). It is the owner's pre-existing WIP on another branch. This lane
never ran `git stash` — briefs forbid it — and left it untouched.

## §11 Proposed memory rows (for the chair — this lane did NOT write MEMORY.md)

Per the index's standing "LANES: DO NOT WRITE THIS FILE" law, these are reported, not appended.

1. **⚠⚠ `popToTier` HAS NO DEFAULT — swapping an inline chain for it can CROWN an unknown.**
   Every inline tier chain in this repo was written `(pop = 0) => …`; `popToTier(undefined)` falls
   through every `<=` and returns **`'metropolis'`**, not `'thorp'`. A "single-spelling" cure that
   drops the guard silently upgrades unknown-population placements to a metropolis crown. The cure
   is `popToTier(x ?? 0)`. Measured 2026-08-24 (TE-SEAM-B). `null`, `0` and `NaN` are unaffected —
   only `undefined` diverges, which is exactly the value a placement record yields.
2. **`mapSlice.burgToConfig` is DEAD CODE** — zero callers repo-wide; spread onto the store at
   `src/store/index.js:83` so it exists on `getState()`, but absent from `operationRegistry.js`,
   absent from `selectors.js`, and no dynamic `store[name]` access exists anywhere. Any "fix" to it
   is hygiene with zero behavioural effect. Disposition (correct vs delete) is unruled.
3. **⚠ A CACHED GALLERY COVER IS A PERSISTED DERIVATIVE OF EVERY MAP GLYPH.** `mapThumb.js`
   `serializeOverlaySvg` clones the *rendered* `[data-map-overlay-svg]` DOM — which contains
   `PlacementsLayer`'s `TierIcon` glyphs (`MapOverlay.jsx` svg 261→346, layer at 342) — encodes
   JPEG and uploads to the public `map-backdrops` bucket, persisting the URL to
   `gallery_image_url`. It is **never invalidated** (`MapShareEditor.jsx:174-198` only fills an
   empty slot). So any render-time visual cure leaves published covers stale forever. ⚠ Note the
   trap: grepping `mapThumb.js` for `tier`/`population` finds **nothing** and reads as "thumbnails
   don't carry tier" — the dependency is through the DOM, not through data.
4. **The test-ratchet scope sentinel is a 10% FLOOR, not an exact pin.** `SCOPE_FLOOR_RATIO = 0.9`
   against `baseline.totalTests` (28274 @ `4deb4f026`). ADDING tests to an EXISTING file costs no
   re-freeze; the three-census bill in the standing law is specifically a **new test file**
   (`totalFiles`) event.
5. **⚠ ugrep methodology, re-confirmed the hard way:** `git grep -E "<=\s*240"` returned **zero
   hits including the two known sites** — a silent false negative that would have "proved" no
   inline chains exist. `git grep -P` is required. (Sibling of the standing ugrep-complexity row.)

## §12 Deliberately deferred (documented, not bugs to re-find)

- **`burgToConfig` disposition.** Corrected in place rather than deleted. A dead classifier that
  now looks *correct* is a marginally more attractive trap for a future caller than one that looks
  obviously stale — but deleting a store-surface function is a public-shape call, not this lane's.
  Chair's ruling.
- **Stale published gallery covers** (§6.3). Data remediation, explicitly out of lane scope per the
  brief ("measure and report; the chair rules on reconciliation").
- **`tests/ui/placementsLayerFirstAdvance.test.jsx:33`** — the pop-400 / `tier:'village'` near-miss
  (§7.3). Left untouched: it is self-consistent under the stored-tier-wins rule and editing it
  would be scope creep.
- **The other three seam sites from the TE-SEAM survey** (`tierGrammar.js`'s `tierForPopulation`
  town/city/metropolis fork at 8000/40000, the `compile.js:115` provenance string, the vestigial
  identical-branch conditional at `tierScale():661-663`) are **sandbox-only** (register seal
  `93fa8a2ca`), not on the build branch, and belong to the D3a port arc. Out of this car by
  construction.

## §13 Worktree tip

**`73f5dfc02d9e1a8be51a8bc3788ba566de910ee1`** — one commit on detached HEAD in
`$SP/laneSEAMB-tree`, parent `e4ed27f48` (the build slot). Working tree clean.

**This lane moved no refs.** `claude/composite-r4` still points at `e4ed27f48`; the chair performs
the CAS landing. ⚠ Note for the landing: this car re-records the shared
`sovereigntyLightingContract` census (§10.2). That census counts the WHOLE estate's test files and
is a **shared serializer between build lanes** — if any sibling lands test titles between this
measurement and the CAS, the tuple must be **re-measured at the merged tip**, not merged as text
and not recomputed by adding deltas. The block's own history records exactly this failure mode.

## §14 Final verdict

**GREEN — the car is built, gated, committed, and re-proved at its own tip.**

The shipped 241–400 seam is cured at both surfaces through the single landed classifier; the class
cannot silently re-fork (behavioural + structural guard, both proved convicting); the lifecycle
trace found no persisted `settType` and therefore no migration owed; the one persisted derivative
(cached gallery covers) and the `burgToConfig` disposition are reported for the chair, not acted on.

| Claim | Status |
|---|---|
| Both inline chains replaced with `popToTier` | CONFIRMED |
| Blast radius is exactly 241–400, nothing else | CONFIRMED (exhaustive 0..120000 scan) |
| Guard convicts a re-fork at both sites | CONFIRMED (4 mutation runs, all exit 1) |
| `settType` is never persisted; no migration owed | CONFIRMED (own reads of all 5 lifecycle paths) |
| Cached gallery covers bake the old glyph | CONFIRMED (chair's reconciliation call) |
| `burgToConfig` is dead code | CONFIRMED |
| Full gate green at the committed bytes | CONFIRMED (`exit: 0`, 29,077 tests) |
| Committed blobs == gated bytes | CONFIRMED (SHA256, all 4 MATCH) |
| PDF/prerender tier source | still PLAUSIBLE — inherited from the TE-SEAM survey's §6 residue, untouched and out of scope here |
