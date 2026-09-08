# RECEIPT — lane DESK-ECON2 — **COMPLETE**
⟦Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 · Dock: `$SC/laneECON2`, detached at `940d161ca`⟧

STATUS: **COMPLETE**. ONE car, **`333b1a83c`**, on `940d161ca`. **Porcelain 0.** Every claim
carries **CONFIRMED** (executed evidence quoted) or **PLAUSIBLE** (reasoning only).

    333b1a83c  DESK-ECON2: §0c-3 closed, the economy desk leaves its own tab, and four
               positions light   (13 files, +1427/−83, 1 new src file, 0 new test files)

FINAL VERIFICATION AT THE COMMITTED TIP — CONFIRMED, exits captured in-shell:
`economyStateProseDesk` + `economicsTabFlow` + the three mount walkers + the projection
contract: **exit 0, 126 passed (6 files)**. `npx vitest run tests/lint/` WHOLE: **exit 1,
7 failed / 2124 passed of 2131** — down from 9 failed at the pre-cure measurement; the
seven are the five triaged below (three register acts owed to the chair, two not mine).
The pre-commit hook altered **no staged file** (md5 compared before and after, all 13).
Trailers verified on the landed commit: `Seat: Opus 5 — Fable-unvalidated` / `Lane: DESK-ECON2`.

## Arrival receipts — CONFIRMED
- `git rev-parse HEAD` = `940d161ca155ab2be76c9d15b9a8207d9c2f7c2f` — matches the brief.
- `git status --porcelain | wc -l` = `0` at arrival.
- `node_modules`: 455 top-level entries, symlinks into the main repo. Not materialised, untouched.
- Gate at arrival: `uptime` load-1 = **25.28**, `[v]itest/dist/workers` = **7**. Quiet window
  NOT open; every act below the "PROOF" heading waited for it (log: `$SC/econ2work/quiet.log`,
  `06:56:22 streak=1 · 06:57:22 streak=2 · 06:58:22 streak=3 → QUIET WINDOW OPEN`).

## RE-DERIVED PREMISES — the brief is a claim; these are measurements
| premise | chair's claim | measured at `940d161ca` | verdict |
|---|---|---|---|
| 8 economy blocks dark | DS-ECO-4,5,7,10,11 · DS-SUP-1,2,3 | exactly those 8 in `UNMOUNTED_BLOCKS` | **CONFIRMED** |
| the desk mounts DS-ECO-1,2,2,3,6,8,9,12 | yes | 8 rows over 7 blocks, `economics.*` | **CONFIRMED** |
| DS-ECO-11 carries 17 pools / 53 variants | yes | 17 / 53 | **CONFIRMED** |
| EconomicsTab "580 effective (20 free)" | 580 | **587** effective / 712 physical (eslint Linter) | ⛔ **CORRECTED** — 13 free, not 20 |
| `{complexity}` dark, C1 = 1 of 3 | yes | C1 **1/3** · C2 2/3 · C3 2/3 · C4 3/3 · C5 2/3, driven through the shipped kernel | **CONFIRMED** |
| `deriveEconomicComplexity` emits eleven strings | yes | **11 distinct**, by exhausting (tier × 0..14 × 0..14 × bool); byte-identical to `desk7-words.md`'s eleven keys, map injective and surjective | **CONFIRMED** |
| EconomicsGlance says "all three positions are GLANCE" | yes | it carries **FOUR** and `economics.prosperityHeader` is a **sentence** that prints | **CONFIRMED (the DESK-11 defect)** |
| "measure `overview`'s effective lines first — it already carries 8+3 sentences" | overview is the DS-ECO-8 candidate | ⛔ **`overview` IS DISQUALIFIED, and not on line count.** `overview.systemsHealth` (DS-GEN-3, mounted `sentence` at this base) carries **five `prosperity: *` pools** and OverviewTab draws them. A second prosperity sentence there is exactly the contradiction R-DST-A forbids | ⛔ **CHAIR'S CANDIDATE REFUSED, with the measurement** |
| the router has 25 tabs (parent's correction) | 25 | 25 `case` labels, derived from `renderTab` | **CONFIRMED** |
| OutputContainer is at its ceiling | 600/600 | **600 effective / 1050 physical**, and unchanged both ways after my edits | **CONFIRMED** |

## STATUS: three acts, ONE car
DESK-7, DESK-10, DESK-11 and the mounts landed as **one commit**, and that is a departure from
the brief's "cars in this order" recorded rather than taken silently: DESK-7 and the three
mounts both live in `economyStateProse.js` and `economyStateProseDesk.test.js`, and this dock
has no interactive staging, so a per-car split by whole-file staging would have produced a
first commit that does not build. Reviewability is bought with the commit body instead.

## WHAT LANDED
### DESK-7 — §0c-3 CLOSED
`COMPLEXITY_NOUN` wires the chair's eleven forms **verbatim** (transcribed from
`desk7-words.md` after a programmatic byte-comparison against the producer's own eleven
strings — no key mistyped, no phrase reworded). Keyed on the producer's string, declared in
`SLOT_FILL_TABLES`, and still passed through `bareCommonFill` so the shape contract is
enforced at the FILL rather than at the lookup. The annex §0c-3 is closed **in place** with
the measured before/after table, and the §0c `{complexity}` row's "until §0c-3 is ruled" tail
is replaced.

**PER-POOL ELIGIBILITY AFTER THE FILL — CONFIRMED, driven through the shipped desk:**

| DS-ECO-1 pool | dark | filled |
|---|---|---|
| C1 a high rung on a working approach | **1 of 3** | **3 of 3** |
| C2 a high rung on a narrow approach | 2 of 3 | 3 of 3 |
| C3 the middle rungs | 2 of 3 | 3 of 3 |
| C4 a low rung on a working approach | 3 of 3 | 3 of 3 (never named the slot) |
| C5 a low rung on a narrow approach | 2 of 3 | 3 of 3 |
| **block total** | **10 of 15** | **15 of 15** |

### DESK-11 — the docblock
`EconomicsGlance.jsx` said "All three positions in this file are GLANCE rungs, so none of them
prints a corpus sentence today". Wrong on both counts since the file landed. Corrected in
place with the four positions tabulated and the reason the tiles still read `drawn?.sentence`
(the depth is the registry's, so removing the read would put the decision back in the tab).

### THE ARCHITECTURAL ACT — the economy desk's ONE CALLER
`src/components/new/economyDeskRead.js` (**NEW**, 40 effective / 800 ceiling) holds the desk
call, the seed, the audience and the §885.3 gate. Walker ARM 2 admits exactly one component
file per desk and the economy desk now draws on FOUR tabs, so the call could not stay in
`EconomicsTab.jsx`. `SILENT_ECONOMY_DESK` is written out rather than derived, so the gate does
not depend on the desk staying silent over garbage.

### POSITIONS, RUNGS AND TABS — with the reason
| position | block | rung | tab | why this tab |
|---|---|---|---|---|
| `economics.exportPosture` | DS-ECO-10 | `sentence` | economics | the Trade Profile section is the surface; the posture sentence frames the chips it already prints |
| `resources.groundAndWorkings` | DS-ECO-11 | `sentence` | resources | **four lenses at one position** (terrain · strengths · strategic worth · the one exploitation line), in the order the terrain header and the exploitation section print their data. The block IS the resources page |
| `services.catalogStanding` | DS-SUP-3 | `sentence` | services | **two lenses** (the catalog against its rung, and the one impaired house). The block is `EXPECTED_SERVICES_BY_TIER` against `availableServices`, which is this tab's whole subject |
| `daily_life.standingOfLiving` | DS-ECO-8 | `sentence` | daily_life | **THE DS-ECO-8 PAGE DECISION.** Not economics (DS-ECO-1 speaks there, R-DST-A) and **not overview** (DS-GEN-3 already speaks about the prosperity rung at `overview.systemsHealth` through five `prosperity: *` pools — measured). `daily_life` prints the band word as its Economy anchor fact and carries no prosperity sentence of any kind, which is exactly what a LADDER block wants: the reader has the band, the corpus says what living at it is like |

`DS-ECO-8` keeps its `glance` row at `economics.economyTile`; one sentence rung, driven in the
DOM (the economics page must NOT print the line the daily-life page does — asserted).

Every mount row appended at the END of `DOSSIER_MOUNTS`; only my leaf's ids struck from
`UNMOUNTED_BLOCKS`; nothing else in that file touched but its own docblock.

## ⛔ FINDINGS — each measured, each with the ONE ACT that lights it
1. ⛔⛔ **`{good}` IS DARK ON EVERY GENERATED WORLD, AND HAS BEEN SINCE DS-ECO-12 LANDED.**
   `leadingGoodNoun` fills **0 of 48** generated settlements. All **99** distinct
   `primaryExports` labels the generator writes are Title-Case, and `{good}`'s declared shape
   is `bare-common`, which refuses a capitalised fill. This is §0c-3's twin one slot over, and
   it was invisible because nothing rendered the desk with a real fill and read the sentence.
   **28 variants of this leaf name `{good}`.** ONE ACT: the §0c-3 act applied to `{good}` — an
   authored bare-common form per canonical good, or an annex ruling on the shape. Reader-facing
   words ⇒ the chair's, not a lane's.
2. ⛔⛔ **THE SUPPLY-CHAIN FAMILY IS STRUCTURALLY DARK — DS-ECO-5, DS-SUP-1, DS-SUP-2, for ONE
   reason and not three.** Their only producer is `economicState.activeChains[]`, and measured
   over 24 generated settlements: `{chain}` ← `label` conformant **0 / 318**, `{resource}` ←
   `resource` **0 / 123**, `{good}` ← `outputs[0]` **0 / 314**. All three slots are declared
   `bare-common`; all three producers emit Title-Case display labels. **38 variants** name
   `{chain}` and every one is unreachable while that holds. Same ONE ACT as finding 1.
3. ⛔ **A CORPUS POOL WITH NO PRODUCER: `POSTURE: import_dependent`.** `deriveExportPosture`'s
   `if`-chain has five arms (none/entrepot/vulnerable/limited/established) and the sixth status
   exists only as a key of its own `EXPORT_STATUS_LABEL` table. Proved by exhausting the
   producer. ONE ACT: an import-dependence arm on that ladder — a shipped read-model's output
   on every import-heavy town, so a product call. **Pinned as an exposure**, so the day it
   lands the pin reds.
4. ⛔ **A POOL THAT CONTRADICTS ITS OWN CONDITION: `POSTURE: vulnerable` × `{access}`.**
   `deriveExportPosture` returns `vulnerable` **only** when `access === 'isolated'`, and
   `isolated` is THE one access value `ACCESS_NOUN` deliberately gives no fill. So the one
   variant of that pool naming `{access}` is ineligible in every world that can reach the pool:
   2 of 3, always, by construction. Pinned.
5. ⛔ **THE TERRAIN LABEL TRAP, AND IT IS ALREADY SHIPPED IN A COMPONENT.**
   `resourceAnalysis.terrain` is a DISPLAY name and `TERRAIN_DATA`'s seven names are `Coastal ·
   Riverside · Mountain · Forest · Plains · Hills · Desert/Arid`, while the corpus authored
   `Coastal · Plains · Forest · Hills · Mountains · River · Desert · Swamp · Tundra`. **Three
   of seven do not equal their pool.** `ResourcesTab.jsx`'s own `terrainColor` map keys on the
   CORPUS words: **4 of its 9 keys are live, 5 are dead**, and `Riverside`/`Mountain`/
   `Desert/Arid` all fall to the default accent today. The desk keys on `config.terrainType`
   (the canonical token) instead. The tab's map is NOT cured here — it is a shipped colour
   defect in a file this car touches, and curing it changes rendered accents.
6. ⛔ **THREE DS-ECO-11 TERRAIN POOLS HAVE NO PRODUCER.** `TERRAIN: Swamp` and `TERRAIN:
   Tundra` are authored and `TERRAIN_DATA` has no such key; a config naming one produces
   `resourceAnalysis.error: 'Invalid terrain type'` and NO terrain, so the page prints
   `Unknown` and the desk stays silent. That silence is also why `TERRAIN: anything else (the
   default accent)` is unreachable — every token that HAS an analysis has a named pool.
7. ⛔⛔ **A NUMBER DISAGREEMENT FOUND IN THE RENDERED SENTENCE, NOT IN REASONING.** Every
   `{resource}` seam in DS-ECO-11 was authored around a mass noun (*"The {resource} SITS at the
   edge…"*, *"…nobody in this town is working IT"*, *"what {resource} FETCHES elsewhere"*), and
   `exploitation[].rawResource` writes plurals beside its mass nouns. The first real render
   printed **"The animal hides sits at the edge of being worth a great deal"** and **"point at
   the medicinal herbs, and nobody in this town is working it"** — fluent and false.
   CURED at the desk by `singularBareCommonFill` (a trailing-`s` screen whose reach is stated:
   exact over the 13 shipped values, a heuristic beyond them, and refusing is the safe
   direction). **THE COST IS REAL AND MEASURED: the exploitation lens falls from 32/48 to
   23/48 drawn settlements**, because a plural-headed leading resource now silences the lens
   rather than mis-stating it. ONE ACT for the other half: four DS-ECO-11 variants authored
   number-neutral — a reader-facing word decision, so the chair's.
8. ⚠ **`rawResource` CARRIES TWO VOCABULARIES IN ONE FIELD.** Of the values seen, 13 are human
   phrases (`medicinal herbs`, `timber`, `glass sand`) and **7 are raw engine tokens**
   (`mountain_timber`, `alpine_pasture`, `glass_sand`, `camel_herds`, `hot_springs_mineral`,
   `desert_salt`, `oasis_water`). Note `glass_sand` AND `glass sand` both occur. The desk
   refuses the tokens (the shape check does it), so those rows go silent. Generation-side.
9. ⚠ **ONE `{institution}` SEAM READS ODDLY OVER A GENERIC HOUSE LABEL.** DS-ECO-11's
   `fullyExploited [ledger]` supplies no article — *"the ground gives it, Mill finishes it"*.
   True, printable, and slightly terse. Not cured: refusing would darken the variant, and
   re-wording the corpus is not a lane's. Raised.
10. ⚠ **`Bakers (5-15)` is the one non-conformant `{institution}`** of the 25 the resource
    generator writes (§0d's digit ban reaches every shape). One variant on one row goes silent.
    Same class as DESK-GEN2's `Merchant guilds (3-8)` blocker.

## WHAT I COULD NOT MOUNT HONESTLY — 5 of 8, each with the measurement
- **DS-ECO-5, DS-SUP-1, DS-SUP-2** — finding 2. Not "not reached": **unreachable** while
  `{chain}`/`{resource}`/`{good}` are `bare-common` and `activeChains` is Title-Case.
  DS-SUP-2 carries a second, independent gap: `deriveSupplyChainState` returned only
  `stable · strained · scarce · substituted` over **641 chain readings** on 48 settlements —
  `blocked`, `captured` and `collapsing` were never produced — and `CAPTURED`'s three variants
  are all `dm-only` AND name `{faction}`, the slot this desk deliberately leaves unfilled.
- **DS-ECO-4** (market prices) — `deriveMarketPrices` is `present` on 42/48 but its
  `highlight` is **null on 48/48 aspatially**: `commodityBandForGood` reads a
  `commodityStocks` spatial ledger that a freshly generated world does not have, so every
  band is `adequate` and no deviation exists. `NO HIGHLIGHT: everything steady` and `MIXED`
  are reachable (8 of 16 variants); `HIGHLIGHT: dear` and `HIGHLIGHT: cheap` name `{good}` on
  all 8 of their variants and are dead twice over (finding 1 and the missing ledger).
  Dormant-at-birth, mountable in a played campaign. **Not mounted** because 8 of its 16
  variants would be unreachable on every world the generator can build.
- **DS-ECO-7** (the freshness note) — `economyFreshnessNote` returns **null on 48/48**
  (`reconciliationLog` is empty at generation); the note is a regenerate-boundary detector.
  Its `[canonical]` variant IS the live string — the projection binds it through
  `LIVE_STRING_BINDINGS` — so drawing it would REPLACE what the leaf already prints. And its
  one rendering home, `EconomyFreshnessNote.jsx`, is shared by **six** surfaces, so a
  `<tab>.<position>` row would name one tab for a component that renders on five more.
  ONE ACT: a rung prop on that leaf supplied by exactly one host (the shape this car used for
  `DeskLines`), plus a ruling on which host owns the position. Left for the chair because the
  CATALOG pool becomes unreachable under C3 the moment TALLIES speaks, and that is a
  content decision.

## PROOF — every exit captured in-shell, under the mutex, in the quiet window
| gate | exit | result |
|---|---|---|
| `tests/domain/economyStateProseDesk.test.js` | **0** | **59 passed** |
| `tests/ui/economicsTabFlow.test.js` | **0** | **13 passed** (was 8) |
| the three walkers + `dossierStateProseProjection.contract.test.js` | **0** | **54 passed** |
| `node scripts/generate-dossier-state-prose.mjs --check` | **0** | "verified 68 state blocks / 2266 variants across 6 desks" — my annex edits change no projected byte |
| `npm run typecheck:domain:strict` (the REAL script) | **0** | "no strict-type regressions (1121 errors, ceiling 1121)" — **ceiling unmoved**; 19 errors I introduced were all cured, none baselined |
| `npx eslint` on all 12 touched files | **0** | clean |
| `npx vitest run tests/lint/` WHOLE (pre-cure) | **1** | 9 failed / 2122 passed |
| `npx vitest run tests/lint/` WHOLE (at the committed tip) | **1** | **7 failed / 2124 passed of 2131** — 2 cured at cause, 3 register acts, 2 not mine |

### Two reds CURED AT CAUSE, not worked around
- `negativeAssertionAnchor` — 3 NEW un-anchored negatives (2 desk, 1 UI). Cured with
  `// anchored: <reason>` on the matcher line, **only the new sites** (that walker is a
  two-sided trap: curing one too many reds it the other way). → green 9/9.
- `economyReadModelCoverage` — `economyDeskRead.js` and `DailyLifeTab.jsx` landed
  unclassified. Both classified **FROZEN_DEFERRED** with written reasons. ⚠ DailyLifeTab
  enters that census **on a COMMENT** (the file's own documented blind spot — my `prosperity:`
  mention in the DS-ECO-8 draw-site note). Classified rather than dodged: rewording a comment
  to leave a census is gaming the instrument. → green 15/15.

### The remaining reds, triaged — CONFIRMED
| file | mine? | disposition |
|---|---|---|
| `clampPrimitiveBaseline` (1) | **no** | banked 62 vs live 78 — named in `_DESK-LAW.md` as the one permitted red |
| `observedShapeReaders` (2) | **no** | the single violation is `economyStateProse.js: isCriminal on incomeSources`, from sibling car `0e78576d4` (DESK-ECONFAITH C3) — **PROVED an ancestor of my base**: `git merge-base --is-ancestor 0e78576d4 940d161ca` exits 0. My edits never touched `criminalIncomePoolKey` |
| `sovereigntyLightingContract` (1) | **yes** | the lighting census — a REGISTER ACT (below) |
| `tuningRegister` (1) | **yes** | dependents moved — a REGISTER ACT |
| `proseNumerics` (2) | **yes** | rows RELOCATED, count unchanged — a REGISTER ACT |

### ⭐ PLANT-OUT — the citation law proved in BOTH directions (CONFIRMED)
Broke ONE literal (`resources.groundAndWorkings` → `…PLANT`) in the one draw site.
- **Walker RED:** `resources.groundAndWorkings: 0 sites under src/components`.
- **UI RED on the LIVENESS ANCHOR:** the corpus sentence is absent from the rendered DOM.
Restored by **INVERSE EDIT** and verified **`cmp`-identical** to a backup taken BEFORE the
plant (md5 `22afcaa240d35719d339f07219a7cf0d` both sides). Both suites green again.

### The rendered DOM, read rather than described
Every distinct sentence the four new lenses draw over 48 generated settlements was printed and
read (`$SC/econ2work/smoke.mjs`). That read is what found finding 7; **residual slots: 0** on
every draw, before and after the cure. 19 corpus pools reached over the 48.

## SIZE — measured before and after (eslint Linter, skipBlankLines + skipComments)
| file | before | after | ceiling |
|---|---|---|---|
| `EconomicsTab.jsx` | 587 | **589** | 600 |
| `EconomicsGlance.jsx` | 61 | 61 | 600 |
| `ResourcesTab.jsx` | 187 | **193** | 600 |
| `ServicesTab.jsx` | 232 | **244** | 600 |
| `DailyLifeTab.jsx` | 288 | **294** | 600 |
| `OutputContainer.jsx` | **600** | **600** | 600 — **line-neutral, 1050 physical both ways** |
| `economyDeskRead.js` (NEW) | — | 40 | 800 |
| `economyStateProse.js` | 203 | **333** | 800 |
| `dossierMounts.js` | ~140 | 153 | 800 |
No Glance extraction was forced; `scripts/.size-baseline.json` is untouched.

## PREDICTED REGISTER DELTAS — I took NONE; the chair takes all of them at the landing
1. **mounts baseline** `tests/lint/.dossier-mounts-baseline.json` (shrink-only):
   `UNMOUNTED_BLOCKS` **36 → 33**, `DOSSIER_MOUNTS` **33 → 37**. A lawful FALL; it passes
   today against the banked 64 and the chair may re-bank.
2. **lighting census** `sovereigntyLightingContract`: the live **TEST-TITLE** count
   **23,268 → 23,293 (+25)**. ⚠ **CORRECTING A STANDING BELIEF:** that arm counts test TITLES,
   not files, so it moves on every added `it()`/`test()` **even with no new test file**.
   **THIS CAR ADDS NO NEW TEST FILE** — every arm went into `economyStateProseDesk.test.js`
   and `economicsTabFlow.test.js` deliberately, to keep the test-ratchet floors and the
   known-failure list untouched. The **one new `src/` file** is
   `src/components/new/economyDeskRead.js`.
3. **tuning register** `tests/lint/.tuning-inventory.json`: two rows move DEPENDENTS —
   `economyStateProse.js#SOLE_EARNER_FROM` and `#LEADER_FROM`, from
   `["…/tabs/EconomicsTab.jsx"]` to `["…/new/economyDeskRead.js"]`. That is the one-caller act
   showing up correctly in the register. **No ceiling moves; no new named constant was minted**
   (the terrain route is a private frozen map, not a tuning value).
4. **prose-numerics** `tests/lint/.prose-numerics-baseline.json`: **NET ZERO, rows RELOCATE.**
   Array length 225 before and after. Files whose frozen rows moved line: `DailyLifeTab.jsx`
   (244→259), `EconomicsGlance.jsx` (101→125, 112→136), `EconomicsTab.jsx` (359→351, 361→…).
5. **writer-reach** `scripts/.writer-reach-baseline.json`: **PLAUSIBLE, not measured** — three
   reads moved BEHIND a JSX prop (`exportPosture`, `notableAbsences`, `impairedInstitution`
   now arrive as readings). If the scanner grades any of them dark it is a FALSE DARK; absorb
   with plain `--write`. ⛔ Never "cure" the component to appease it.
6. **observed-shape / clamp**: untouched by this car; both reds pre-date my base.

## JUDGMENT CALLS — vetoable, one line each
- **DS-ECO-8 speaks on `daily_life`**, not `overview` (measured: DS-GEN-3 already speaks about
  the rung there) and not `viability` (an issues page with no prosperity band on it).
- **DS-ECO-11 draws FOUR lenses at one position.** Precedented (DS-GEN-9 draws four), but it
  is the largest block this car adds and the chair may want it capped at three.
- **The exploitation lens speaks about the FIRST row the reader meets**, or says nothing —
  rather than searching for a row it *can* speak about. The conservative reading; it is also
  what makes finding 7's cost visible instead of hiding it.
- **`exportValue` splits `high`/`very high` from everything else** — the corpus's own two-pool
  shape, transcribed.
- **THE FOOD GAP outranks THE HEALING GAP**, and both outrank the count — the corpus says a
  town with nowhere to buy a meal is "unusual at any size" while the healing pool is explicitly
  tier-conditional.
- **`A METROPOLIS-TIER CATALOG, COMPLETE` = tier `metropolis` AND zero absences.** The pool's
  "including the ones a town has no business having" reads as legal/transport/entertainment,
  which is exactly what a metropolis's expected list adds over a town's.
- **`DeskLines` is imported from `EconomicsGlance.jsx` by three more tabs** rather than moved to
  a neutral leaf: the move would cost a second new `src/` file (a second census move and a
  second classification row) for a twelve-line generic renderer. Its docblock now says so.
- **The exploitation lens carries its OWN slot bag.** `{good}` in the shared bag means the
  town's leading EXPORT; on that lens it means the finished article of one resource line. One
  bag serving both would be a slot filled from the wrong ROLE — fluent and false.
- **One commit, not three cars** — see STATUS.

## ⭐ RETROVALIDATION ROW (for the Fable chair)
| # | what was judged | what the chair must re-derive | receipts by path | priority |
|---|---|---|---|---|
| 1 | **`overview` REFUSED as DS-ECO-8's home; `daily_life` chosen** — contradicts the brief | that DS-GEN-3's five `prosperity: *` pools are mounted `sentence` at `overview.systemsHealth` and drawn by OverviewTab | `dossierMounts.js` R-DST-A note; `DailyLifeTab.jsx` draw-site comment; the UI arm that drives it in the DOM | ⭐⭐ contradicts the brief |
| 2 | **`{good}` is dark on every generated world (0/48)** and takes 28 variants with it | `leadingGoodNoun` over a fresh corpus; that all 99 export labels are capitalised | finding 1; `economyStateProse.js` header | ⭐⭐ owner/chair-facing, the §0c-3 twin |
| 3 | **The supply-chain family is structurally dark** (0/318, 0/123, 0/314) | that `activeChains[].label/resource/outputs` are Title-Case and the three slots are `bare-common` | finding 2; `economyStateProse.js` header | ⭐⭐ |
| 4 | **A plural `{resource}` is REFUSED**, costing 9 of 48 settlements their exploitation line | that four DS-ECO-11 variants are singular-only, and whether the corpus should be re-worded instead | finding 7; `singularBareCommonFill`; the desk arm that drives both directions | ⭐⭐ the cure is the chair's |
| 5 | **Two pools EXPOSED as producer-less** (`POSTURE: import_dependent`, `TERRAIN: Swamp/Tundra` + the default accent) | the exhaustion proofs before anyone deletes or lights them | the two DS-ECO-10 / DS-ECO-11 exposure arms | ⭐⭐ |
| 6 | **`ResourcesTab`'s `terrainColor` map is 5-of-9 dead** and NOT cured here | that curing it changes rendered accents on three terrains | finding 5 | ⭐ product call |
| 7 | **`economyDeskRead.js` is the one caller**, and `DailyLifeTab` is classified on a comment | ARM 2 = 1 site gated; that the classification is honest rather than a dodge | `armcheck` replay; `economyReadModelCoverage.walker.test.js` rows | ⭐⭐ |
| 8 | **Five register acts predicted** (mounts 36→33, lighting titles 23268→23293, tuning dependents, prose-numerics relocations, writer-reach) | each figure at the composed tip before banking; ⚠ the lighting arm counts TITLES not files | the register section above | ⭐⭐ landing |
| 9 | **DS-ECO-4 and DS-ECO-7 left dark** though both are partly reachable | that 8 of DS-ECO-4's 16 variants are dead on every generated world, and that DS-ECO-7's one home serves six surfaces | the residue section | ⭐ next car |
| 10 | **One commit rather than three cars** | that the three acts share two files and no interactive staging exists in a lane dock | STATUS | ⭐ |
