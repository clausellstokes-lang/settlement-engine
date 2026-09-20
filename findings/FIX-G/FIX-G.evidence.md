# FIX-G2 — MEASUREMENT AND THE TWO CANDIDATE WORDINGS (written BEFORE the first edit)

**Lane:** FIX-G (Opus), worktree `$SP/lane-fix-g`, branch `fix-food-card-2026-09-19`, base `ad7ddf2c9`.
`git status --short` empty before the measurement and after it (plain `node` + `git` only; nothing gated ran).

**The base holds the recon's ground — CONFIRMED, not taken on report.**

```
$ git diff --stat 58fcfe614 ad7ddf2c9 -- src tests/fixtures tests/helpers
 src/domain/worldPulse/calamityKernel.js | 47 ++++++++++++++++++++++++++++-----
 1 file changed, 41 insertions(+), 6 deletions(-)
```

One `src/` file moved between RECON-G's read tip and my base, and it is the calamity kernel — nothing
in the food card's or the viability record's path. `tests/fixtures` is byte-identical.

**Goldens before the first edit:**

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

---

## 1. The bar's producer, by symbol — CONFIRMED

`src/generators/foodGenerator.js:486-491`, inside the food record's return:

```js
resilienceScore: Math.round(
  (storageMonths / 12 * 35)          // storage weight
  + (diversityScore * 30)             // diversity weight
  + (importDependency < 0.2 ? 15 : importDependency < 0.4 ? 8 : 0) // low dependency bonus
  + (deficitPct < 5 ? 20 : deficitPct < 20 ? 10 : 0)               // adequacy bonus
),
```

**Four things, and they are what the bar's name and gloss have to say aloud:** the granary's months,
how many food sources are active, how little must be imported, and whether the harvest covers the need.

The word beside it is a different number entirely — `foodGenerator.js:339-359`, a ladder over
`deficitPct` / `surplusPct` / the famine flag, in which `resilienceScore` is not an input.

## 2. The two facts disagree — MY OWN EXECUTION at this base

`node $SP/lane-fix-g-scratch/g2-measure.mjs` — one run, 168 rows (6 tiers x 7 terrains x 4 routes,
seed `g2-measure-v1`), 4.0 s wall, cached to `g2-rows.json`:

```
A. the BAR observed beside each WORD (this grid):
   Import-Dependent         n= 80  41..83  mean 57.8
   Deficit                  n= 35  30..80  mean 50.2
   Secure                   n= 27  61..93  mean 72.6
   Pressured                n= 26  51..90  mean 67.6

B. is the WORD a function of the BAR?  distinct scores=30; scores carrying >1 word: 12
   bar 51 -> {Pressured, Import-Dependent, Deficit}
   bar 83 -> {Secure, Pressured, Import-Dependent}
   bar 65 -> {Pressured, Deficit, Import-Dependent}
   bar 80 -> {Pressured, Deficit, Import-Dependent}

C. an alarming WORD beside a bar at or over half : 106/168
   a reassuring WORD beside a bar under half      : 0/168
   e.g. thorp|plains|road (Torrimare): "Pressured" beside a bar 61% full

D. worst inversion (a better word on a shorter bar):
   "Import-Dependent" at 41% (thorp|mountain|road)  vs  the strictly worse "Deficit" at 80% (metropolis|mountain|mountain_pass)
```

This is an independent reproduction of RECON-G's finding on a different grid and a different seed:
the failure is one-directional, twelve of thirty bar values carry more than one word, and a reader
given one heading has no way to tell which of the two facts the row is about. **The premise holds.**

## 3. Surface census — who shows the pair, who shows one fact

Measured by grep at this base, not transcribed:

| Surface | the WORD | the BAR | cured here |
|---|---|---|---|
| `src/components/new/tabs/OverviewTab.jsx` 455-467 | yes (`statusCase(eco.foodSecurity.label)`) | yes (`width: resilienceScore%`) | **YES — the only surface that shows BOTH** |
| `src/pdf/sections/Overview.jsx` 149-151 | no | no | **caption only** (it repeats the caption byte-for-byte; pinned by `tests/components/g5FirstSurveyPdfTwins.test.js:45`) |
| `src/components/new/tabs/DefenseTab.jsx:254` | no | score only, under `Disasters & Famine`, and only as a fallback behind `scores.disaster` | no — one fact, left alone |
| `src/pdf/lib/viewModelBodySlices.js:174-176` -> `src/pdf/sections/DefenseSecurity.jsx:97` | no | score only, under `Food resilience`, same fallback chain | no — one fact, left alone |
| `supabase/functions/_shared/ai{Output,Charter,Grounding}Bundle.js` | field | field | no — typed food-ledger fields handed to a model, no heading, no pair, and generated bundles |
| `src/lib/structuralFingerprint.js:212` | no | `food_resilience`, a fingerprint key | no — not reader-facing |

**No surface other than the Overview row presents the two as one fact.** Ruling (3) is therefore
satisfied by curing the Overview row and its PDF caption twin.

## 4. Budget exposure — no ceiling is in play

- `OverviewTab.jsx` is reached only through `lazy(() => import('../new/tabs/OverviewTab'))`
  (`src/components/dossier/dossierLazyTabs.js:21`), so it sits behind the dynamic-import boundary and
  outside the first-paint static closure (`CLOSURE_BUDGET_BYTES`, `tests/build/vendorPdfLazy.test.js:565`).
- No `manualChunks` rule in `vite.config.js` names `components/new/tabs`, so the tab is its own
  Rollup-emitted lazy chunk and **no `tests/build` ceiling covers it**. The declared ceilings are
  first-paint raw/gzip/brotli, `data-lazy`, the generation worker, HTML/CSS/fonts/webp — none of them.
- `src/pdf/sections/Overview.jsx` rides the lazy PDF stack; the edit there is one string swapped for
  another, net zero either way.
- `max-lines` headroom (eslint counts with `skipBlankLines`+`skipComments`; measured):
  `OverviewTab.jsx` 482 effective against the 600 components ceiling; `src/pdf/sections/Overview.jsx` 529.
  Neither file has a per-file override in `scripts/.size-baseline.json`.

**No ceiling test can red on FIX-G2. No STOP.**

---

## 5. THE TWO CANDIDATE WORDINGS

Both are display-only, both carry no numeral, no em dash and no exclamation point, and both leave every
golden untouched. The choice is which name makes a reader see TWO facts where they now see one.

*(Both names are given below in the case the LADDER produces — see §6, which corrected an
earlier draft of this file that title-cased them.)*

### CANDIDATE 1 — "Stores and supply"  ⭐ MY PICK

- **Name:** `Stores and supply`, rendered `{tokenCase('stores and supply')}`
- **Gloss:** `the granary, the food sources, how little is imported, and whether the harvest covers the need`
- **Caption:** `Score bars and the Viability and Defense statuses are as judged at the first survey. Food Security is the condition of the land as surveyed; the stores and supply reading is re-judged as the campaign advances.`

### CANDIDATE 2 — "Food resilience"

- **Name:** `Food resilience`, rendered `{tokenCase('food resilience')}`
- **Gloss:** `how well the town would ride out a bad season, read from its granary, its sources and its imports`
- **Caption:** `Score bars and the Viability and Defense statuses are as judged at the first survey. The Food Security word is the condition of the land as surveyed; the food resilience reading is re-judged as the campaign advances.`

### Why 1

1. **The cure's whole job is separation, and candidate 2 does not separate.** "Food Security" beside
   "Food Resilience" is one abstraction beside another; a DM cannot tell from those two names which
   row is about the pantry and which about the land. "Stores and Supply" names the things themselves,
   so the reader learns in one glance that the bar is not the word's fill.
2. **The owner's tome law (2026-09-19).** The chrome speaks the scribe's grammar, plain nouns a DM
   would say aloud, never a dashboard's. "Stores" and "supply" are said aloud at a table; "resilience"
   is a dashboard's abstraction.
3. **The grid already spends "Resilience" four rows up.** `Economic Resilience` is a sibling bar in the
   same two-column grid. A second `… Resilience` invites a reader to compare two unrelated composites
   and adds a naming collision where the point is to remove one.
4. **Candidate 2's one real advantage is consistency with the PDF**, whose Defense chapter prints
   `Food resilience` (`src/pdf/sections/DefenseSecurity.jsx:97`). Measured, that advantage is smaller
   than it looks: the PDF's figure is `defenseProfile.scores.disaster ?? resilienceScore`, the
   disaster-gated read with resilience only as a FALLBACK, and the DefenseTab prints the same chain
   under a third name, `Disasters & Famine`. The Overview's bar is the only unconditional
   `resilienceScore` on any surface, so it is not the same reading and should not borrow the name.
   The three-names-one-number tangle is recorded in the report as noticed-and-not-touched.

### What the pick costs, stated plainly

The Overview row gains one small rubric line between the word and the bar. The caption grows by
about seventy characters and stops promising a re-judging that only half the row receives. No printed
word moves, no golden moves, no saved world changes, and the two pinned copy twins
(`g5FirstSurveyCopy.test.js`, `g5FirstSurveyPdfTwins.test.js`) are updated in the same change, which
is the one-string-vetoable idiom both files declare in their own headers.

---

## 6. THE TYPOGRAPHIC IDIOM — the chair's correction, measured and obeyed

The launch told me the idiom was SMALL CAPITALS AND RUBRICS. The chair corrected it mid-lane:
it is a THREE-RUNG LADDER ENDING IN SENTENCE CASE. I measured the correction rather than
taking it on report, and it is right on every point.

**The car:** `475021901` ("The ladder reaches both surfaces: the screen twins descend, and a
band word can no longer hide in a style or a sentence", 2026-09-18). Its own rule, quoted
from the commit body: *"the CHAPTER EYEBROW keeps its capitals; a GROUP HEADER NESTED INSIDE
IT is a datum and descends."* Every screen/print pair in that car moves together.

**Why small capitals were never available to copy** — `src/domain/display/labelCase.js` and the
car agree: the PDF renders in its own worker off its own theme, `@react-pdf/stylesheet` carries
no `fontVariant`, and no small-caps face is registered. A small-caps screen label would
MANUFACTURE the screen/print divergence the ladder exists to close, which is the exact defect
the car cured ("for one day the DM read 'Strong' on screen and 'STRONG' in the document they
paid for").

**The rung this label sits at.** `labelLadder.js` RUNG 2 is THE FIELD LABEL, sentence case,
muted, inline before its value. The bar's name is the name of a fact, not a section, and this
card already spends its ONE rung-1 eyebrow on the `Section title="Systems Health"` header. So
the rubric is rung 2 and descends.

**Executed, on the shipped function:**

```
"FOOD SECURITY"     -> "Food security"      shouts: true
"Stores and Supply" -> "Stores and supply"  shouts: true
"Stores and supply" -> "Stores and supply"  shouts: false
"Food Security"     -> "Food security"      shouts: true
```

`shouts` is the ladder's own predicate, `tokenCase(w) !== w`, lifted verbatim from
`LADDER_WORDS`. **My first draft's `Stores and Supply` was a word the ladder would change —
by the ladder's own test, a shout.** The built name is therefore `Stores and supply`, and it is
not hand-typed: the site renders `{tokenCase('stores and supply')}`, so the case is DERIVED by
the same function the print surface calls and a title-cased drift cannot re-enter by hand.
`tokenCase` was already imported in `OverviewTab.jsx` and already called there at the
institution-category rung, so this costs no new edge and no byte of import.

**The PDF twin, through the same call:** measured, the PDF renders NEITHER the word nor the bar
(§3), so the rubric has no print twin to route. The one thing that IS twinned is the caption,
and it is a sentence rather than a label — it carries no case call on either surface and stays
byte-identical across the pair, which `g5FirstSurveyPdfTwins.test.js` pins.

### 6b. `'FOOD SECURITY'` and the ladder vocabulary — MEASURED, and my ruling is LEAVE IT OUT

**Why it was left out**, from the exclusion's own note in `tests/pdf/labelLadderParity.test.jsx`
(≈line 145) and verified at both addresses:

> 'FOOD SECURITY' IS DELIBERATELY ABSENT, and the reason is a defect class rather than an
> oversight. The dossier uses those two words at TWO DIFFERENT RUNGS … A vocabulary arm judges a
> leaf by its word alone, so it cannot tell the two apart and would convict the eyebrow for
> being correct.

Both addresses CONFIRMED at this base:

- **Rung 1, correctly shouting:** `src/pdf/sections/EconomicsTrade.jsx:206-208` — a bare
  `FOOD SECURITY` under `type.label` + `palette.gold`, a chapter eyebrow that keeps its capitals
  by the ruling.
- **Rung 2, correctly descending:** `src/pdf/sections/SupplyChainFlow.jsx:215`
  (`{tokenCase(safe(needLabel || needKey))}`) and its screen twin
  `src/components/new/tabs/EconomicsTab.jsx:167` (`{tokenCase(chain.needLabel)}`), both over
  `supplyChainData.js:13`'s declared `label: 'Food Security'`. **That pair already renders
  "Food security" on both surfaces** — the rung-2 use is cured; only the pin is missing.

**Should FIX-G2 bring it onto the ladder? No, and the smaller honest option is what I built.**
Adding `'FOOD SECURITY'` to `SHOUTED_FIELD_NAMES` would red the parity arm on
`EconomicsTrade.jsx:206`, which is a rung-1 eyebrow being right. My cure does not touch that
eyebrow and does not hand the arm the structural handle it lacks, so the blocker is exactly
where the typography train left it. Nothing in FIX-G2 changes the calculus; claiming the row
would be buying a red with a correct element's conviction.

**PUT TO THE CHAIR (the option I did not build).** The note itself names the shape of the cure —
*"its answer was to address the ELEMENT rather than disambiguate by case"*, the same answer
`statBandsOverDigits.test.jsx` used when two ladders overlapped on one word. Concretely: give
`SupplyChainFlow`'s `CategoryGroup` header a structural handle (a `data-rung` or a dedicated
`type.group_header` style the walker can select on), then pin `'FOOD SECURITY'` **by element**
rather than by word, so the eyebrow at `EconomicsTrade.jsx:206` is never in the arm's
population. That is a typography-train act across two PDF chapters and a parity instrument;
it is not this display fix, and I have not built it.

---
*Measured by FIX-G, 2026-09-19, at `ad7ddf2c9`. Scripts and cached data in this directory:
`g2-measure.mjs`, `g2-rows.json`, `g1-probe.mjs`, `g1-bytes.mjs`, `efflines.mjs`.*
