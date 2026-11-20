**Rules lit: who rules (seat law v2 + the contest lit) AND fortune (size-relative fortune law v2), on 14 joined lanes (the thirteen of `rehearsal/join-1` + fortune-3). The depth lane (depth-3) is NOT JOINED.**

# REHEARSAL 2 — THE LIT READ (2026-11-20)

Worktree `/home/user/wt/rehearsal2`, local branch `rehearsal/lit-1` (cut from `rehearsal/join-1` at `fe1f5b83e`), tip `14bc9b078`. Nothing pushed. Scratch: this directory.

## Part 1 — the join

**1a. Fortune lane (`origin/lane/fortune-3-2026-11-20` at `f313bc92f`): JOINED.** `git merge --no-ff --no-commit` stopped on exactly six conflicts, the six the seat lane's recipe names (`measure-lit.sh`: `conflicts.expected`). Resolutions:
- `src/domain/density/densityCreateBoundary.js` (5 hunks) and `tests/lint/densityCreateBoundary.walker.test.js` (2 hunks): resolved by running the seat lane's own step, `node docs/chair/2026-11-20/content/seat/u4/measure-lit.mjs resolve /home/user/wt/rehearsal2` ("kept both, seat first, fortune second"; the seat registry row closed by `}),` before the fortune row: 1). Result checked by eye: `birthConfig` clamps `LIVING_CONTENT_LAW_CONFIG_KEY`, `SEAT_LAW_CONFIG_KEY`, `FORTUNE_LAW_CONFIG_KEY` and spreads `newSettlementDensityLaw()`, `newSettlementLivingContentLaw()`, `newSettlementSeatLaw()`, `newSettlementFortuneLaw()`; both imports stay; the walker's `MINT_SYMBOLS` and `MINT_HOMES` carry both lanes' rows. `node --check` passes on both.
- Registers and censuses, the rehearsal branch's side of each conflicted hunk kept (`keep-ours.mjs` here; every file still valid JSON). **OWED: its own door at the real join** for each:
  - `docs/content/wiring-census.json` (1 hunk, 1 fortune line dropped)
  - `tests/lint/.lighting-census-baseline.json` (1 hunk, 9 lines dropped)
  - `tests/lint/.tuning-inventory.json` (2 hunks, 5 lines dropped)
  - `tests/lint/.tuning-register.json` (2 hunks, 50 lines dropped)
  - (auto-merged without conflict: `scripts/mutation-coverage-manifest.json`.)
- Committed locally as `b1c085013` (a merge must be committed before the next one can begin).

**1b. Depth lane (`origin/lane/depth-3-2026-11-20` at `408a7babb`): NOT JOINED (aborted).** Six conflicts: `docs/content/wiring-census.json`, `scripts/census/pool-dominance.register.json`, `tests/lint/.lighting-census-baseline.json` (registers: would take ours), `src/domain/facts/factVocabulary.js` (add-only: both sides add entries, would keep both), and two outside the brief's rule:
- **`src/domain/facts/factsOf.js`** — not on the add-only list. Symbol: the `factsOf` getter object and the import tail. Ours (HEAD): `get causeHouses() { return causeHousesOf(record); }`, `get entrepot() { return entrepotOf(record); }` + `import { causeHousesOf } from './causeHouses.js'; import { entrepotOf } from './entrepot.js';`. Theirs (depth): `get waterSource()`, `get externalMill()`, `get commonGrazing()` + `import { commonGrazingOf, externalMillOf, waterSourceOf } from './rosterGrounds.js';`. (Both add-only in shape, but the file is not one the brief lets me union.)
- **`src/domain/facts/registeredWords.js`** — a MODIFY/MODIFY of one row, not an addition. Symbol: the house row's `leaf`/`atoms`. Ours: `atoms: key === "thieves' guild" ? ['house: thieves_guild'] : key === 'smuggling' ? ['house: smuggling'] : []` (PAGE-7). Theirs: `atoms: [...(HOUSE_FAMILY_ATOMS[key] || [])]` with a leaf naming `HOUSE_FAMILY_ATOMS` (BUILD-CONFLICT, DEPTH-2).
Both sides' full hunks: `logs/depth-conflicts.txt`. `git merge --abort` run; the tree is the fortune merge, clean.

**1c. Typecheck and smoke.** `sh scripts/gate-mutex.sh --run -- timeout 900 npm run typecheck:domain:strict` (log `logs/typecheck-domain-strict.log`): `[domain-strict] ✓ no strict-type regressions (1113 errors, ceiling 1113).` exit 0 (queued 20:29:02, released 20:31:32 UTC; most of that wait was the mutex held by others). SMOKE (plain node, `birth.mjs . smoke`, log `logs/smoke-preflip.log`): one visitor birth per size through `birthConfig`, all six born: thorp Gortcross, hamlet Aryapalli, village Palenqha, town Filopchori, city Balcross, metropolis Capolitus, each with its right tier. Nothing repaired.

## Part 2 — the flip

Three one-line edits, committed locally as `14bc9b078` "REHEARSAL ONLY: the flip (never pushed)":
- `src/domain/seat/seatLaw.js`: `export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;`
- `src/domain/seat/seatCircumstances.js`: `export const SEAT_CONTEST_LIT = true;` (tuning table untouched)
- `src/domain/fortune/fortuneLaw.js`: `export const NEW_SETTLEMENT_FORTUNE_LAW_VERSION = SIZE_RELATIVE_FORTUNE_LAW_VERSION;`

PROOF (`logs/smoke-flipped.log`): `birthConfig(visitorConfig)` now returns `{"_densityLawVersion":2,"_livingContentLawVersion":2,"_seatLawVersion":2,"_fortuneLawVersion":2}`, and every born record carries **`_seatLawVersion: 2`** and **`_fortuneLawVersion: 2`** in its config (all six sizes; before the flip both were absent). All 900 pool records checked: 0 lack seat 2, fortune 2 or `_randomizePriorities: true`.

## Part 3 — the pool and the three measures

**THE POOL.** `birth.mjs` copies the seat instrument's `visitorJob` (`measure-lit.mjs` lines 168-179) verbatim: `{ ...DEFAULT_CONFIG, settType: size, four toggle bags {}, _randomizePriorities: true }`, the content runtime from the real custom-content slice at rest, born as `generateSettlementPipeline(birthConfig(config), null, { seed, ...runtime })`, no law forced (the flipped dials mint them). Seeds `visitor-<size>-0..149`, 150 a size, 900 births, **0 errors**. Cached as `pool/<size>-<i>.json`. **Time: 81 s wall** (two processes, three sizes each; thorp 6 s, hamlet 6 s, village 10 s, town 19 s, city 47 s, metropolis 68 s).

Measures: `measures.mjs` (reads the cached pool; 6 s). All figures in `measures.json`.

### MEASURE 1 — a trouble's sentence

Function used: **`src/domain/display/tensionCause.js :: tensionCauseSentenceOf(record, history.currentTensions[0])`** (on the joined tree). Sentences compared with the place's own names masked (`scripts/sameness-census.mjs :: maskerFor`: the place's name, its people's names, its powers' names; digits to 0). Every place in the pool has a live trouble; where the first trouble's kind has no cause table the function returns null and nothing prints.

| size | places with a live trouble | places printing a cause sentence | distinct sentences | commonest sentence, share of all 150 | P(≥2 of 3 random print one same sentence) | commonest STORED description, share | same P over the stored description |
|---|---|---|---|---|---|---|---|
| thorp | 150 | 80 | 44 | 4.7% (7) | 2.0% | 10.7% (16) | 10.7% |
| hamlet | 150 | 75 | 45 | 4.7% (7) | 1.6% | 7.3% (11) | 10.6% |
| village | 150 | 73 | 44 | 4.0% (6) | 1.2% | 7.3% (11) | 6.7% |
| town | 150 | 104 | 57 | 4.7% (7) | 2.7% | **21.3% (32)** | 21.8% |
| city | 150 | 113 | 43 | 6.0% (9) | 5.3% | **46.0% (69)** | 46.9% |
| metropolis | 150 | 114 | 52 | 8.0% (12) | 5.2% | **42.0% (63)** | 41.6% |

- **THE CHAIR'S LINE: no printed cause sentence stands above 15% of any size's places** (the highest: metropolis 8.0%, "With rival rings at odds and no single organisation over them, crime here is rising.").
- The STORED description of the first trouble does cross it at three sizes: "Crime is rising faster than those in charge can answer it, and some talk of taking the law into their own hands" is the first trouble's description in 21.3% of towns, 46.0% of cities, 42.0% of metropolises. Whether the page prints the stored description beside the cause sentence I did not establish (PLAUSIBLE: the trouble card shows both).
- 70 thorps, 75 hamlets, 77 villages, 46 towns, 37 cities, 36 metropolises print no cause sentence for their first trouble (its kind has no table; seen: `trade_dispute`, `corruption_scandal`, `plague_years`, `heresy_trial`).
- The five commonest per size are in `measures.json` (`M1.<size>.five`).

### MEASURE 2 — rulers in trouble with no cause

Calm = `!t.stress`; risk = `coupRiskLabel(coupContenders(t))`, Critical folded (the seat instrument's own definitions, `measure-lit.mjs` lines 35-37, 48-49). Counts, Holding · Stable · Contested · Critical:

| size | calm (n) | crisis-born (n) | calm Contested or Critical | of which THE PAGE GIVES NO CAUSE |
|---|---|---|---|---|
| thorp | 0 · 102 · 0 · 0 (102) | 0 · 43 · 5 · 0 (48) | 0 | 0 |
| hamlet | 8 · 91 · 0 · 0 (99) | 2 · 41 · 8 · 0 (51) | 0 | 0 |
| village | 67 · 20 · 10 · 0 (97) | 11 · 6 · 36 · 0 (53) | 10 | **6** |
| town | 104 · 1 · 4 · 0 (109) | 15 · 0 · 22 · 4 (41) | 4 | **4** |
| city | 104 · 2 · 4 · 0 (110) | 13 · 1 · 15 · 11 (40) | 4 | **4** |
| metropolis | 100 · 0 · 5 · 0 (105) | 14 · 0 · 14 · 17 (45) | 5 | **5** |
| **all** | | | **23** | **19** |

- All 23 calm contested places read **Contested**, none Critical (gated, the first challenger heavier than the incumbent's amplified weight). Villages: all ten an Elder Council, the first challenger religious in nine and military in one. Towns, cities, metropolises: the first challenger military in nine of thirteen, religious in four.
- **The cause line is a mechanical rule of mine, stated at the head of the file**: "the page gives this cause" when a printed sentence (the troubles' cause sentences and stored descriptions, the governance account, the power desk's sentences) NAMES a challenger the contest names; else "THE PAGE GIVES NO CAUSE". The 4 with a cause are all villages, each a governance-account sentence of the kind "The Religious Authorities are at odds with it." / "The hall is at odds with the Religious Authorities."
- Every block (holder and form, risk, challengers with weights, legitimacy score and breakdown, every trouble with its printed cause, stressors, the desk lines, the verdict): **`measure2-places.md`**; raw: `measure2-blocks.json`.
- **MERITS**: no field or reader called merits exists on the joined tree (the fortune lane changes the legitimacy breakdown's prosperity/safety/defence terms only); each block prints the breakdown and says "merits: none on this tree".
- Seen in the blocks, not judged: several calm contested places print a desk `stabilityHeader [Stable]` sentence ("Everyone at Birabad knows who decides, and nobody expects that to change this season.") beside a `legitimacyBanner [Contested]` and the Contested risk.

### MEASURE 3 — a sentence repeated inside one place

Included: every string leaf of the stored record of 40 characters or more, place's own names masked (`maskerFor`), split at `. ` `! ` `? `; skipped the keys the privacy scrub strips in full mode (`_seed`, `_regenSeed`, `_config`; `publicSafe.js` 537-544) and nothing else. A second reading also drops `simulationTrace` (no file under `src/components` or `src/pdf` reads it, by grep).

| size | places with ≥1 repeated sentence (all leaves) | the same, `simulationTrace` dropped |
|---|---|---|
| thorp | 100.0% (150) | 100.0% (150) |
| hamlet | 100.0% | 100.0% |
| village | 100.0% | 100.0% |
| town | 100.0% | 100.0% |
| city | 100.0% | 100.0% |
| metropolis | 100.0% | 100.0% |

The measure as specified saturates; the twenty commonest (all 900; both lists with three path pairs each in `measures.json`: `top20`, `top20b`) say why:
- 1-4, 8 (all leaves): engine trace and receipt strings, `simulationTrace[].causes[].reason` ⟷ itself (e.g. "Power derives in part from the institution mix (0 institutions across 0 categories).", 804 places) and `generationCoherenceReceipt.judgments[].evidence[].detail` ⟷ itself ("Dramatic pressure is explained by the final dossier.", 659 places). Not page prose as far as the paths show (PLAUSIBLE).
- "Dependent on trade routes." / "Siege, road closure, or blockade would impair operations." (431 places each): `economicState.tradeDependencies[].impact` ⟷ itself, the same impact text on several dependencies.
- The rest (12 of the 20 with the trace dropped): **people's cards sharing one physical line** — `npcs[].physical.clothes` ⟷ `npcs[].physical.clothes` (e.g. "a good coat inherited from a larger relative", 376 places; 5 such lines over 317 places each), `npcs[].physical.feature` (≈250 places each), `npcs[].physical.build` ("slight: smaller than expected for the role", 435 places). Two different people in one place carrying the same description. Concentrated in cities and metropolises (e.g. clothes: 126 of 150 cities, 146 of 150 metropolises).
- Same fact stored twice by design, where the paths make it plain: none of the twenty sits at two DIFFERENT fields; every pair is one field repeated across rows of an array. (The `culturalNotes` ⟷ `culturalIdentity` doubles below fall outside the top twenty.)

## Part 4 — the twelve places

Way used: **(c), a plain walk of the record**, in page order (overview, who rules, powers, trouble, daily life, traditions, safety and trade, history's recent line, six people), drawing on the page's own readers where the tree has them: `governanceAccountRead` and `powerDeskRead` (who rules), `generalDeskLines` (overview desk lines), `tensionCauseSentenceOf` (cause), `shownTraditionsOf` + `describeTraditions` (traditions), `holderOf`, `coupContenders`/`coupRiskLabel`. Why not (a): `scripts/census/sameness-census.render.census.jsx` renders only through vitest/jsdom (a mutex gate), births its own places (`DEFAULT_CONFIG`, not the visitor's), and writes every line MASKED. Why not (b): `buildViewModel` runs in plain node, but walked whole a town is thousands of string leaves (services 770, relationships 865, people 691), far past 400 lines, and it holds neither the contest nor the trouble's cause sentence. Renderer: `render.mjs`. Daily life is the record's `culturalIdentity`/`culturalNotes`/food label (the Daily Life tab's own prose is the AI passages, absent for a visitor). A person's ties are listed on each person's card, so a tie between two of the six appears twice: that is MY rendering, not the page.

Files (all under 175 lines): `places/thorp-0.md`, `places/thorp-1.md`, `places/hamlet-0.md`, `places/hamlet-1.md`, `places/village-0.md`, `places/village-1.md`, `places/town-0.md`, `places/town-1.md`, `places/city-0.md`, `places/city-1.md`, `places/metropolis-0.md`, `places/metropolis-1.md` (in this directory).

### Foot-list (seen in the twelve; a scan for sentences twice in a file, for brackets and placeholders, and my own reading)

Printed twice in one place:
- **The overview's pressure sentence again inside the governance account** (who rules), word for word: `hamlet-1` and `village-0` ("A dispute over grazing rights and water access has run for two seasons, and the families on each side no longer speak to one another."), `thorp-0` (the same with "those on each side of it"), `hamlet-0` and `village-1` ("The most devout households want a say over who may trade and when, and not everyone here agrees.").
- **Two or three powers with one description**: `metropolis-0` (two craft powers: "The trades regulate their own production and apprenticeships, but carry little weight beyond the workshops."; and "Trade disruption and requisition are hurting the bottom line. The power is lobbying for compensation and receiving promises." on three powers); `city-1` (two craft powers: "The trades regulate their own production and apprenticeships; a reliable secondary presence in civic life."); `metropolis-1` ("Undermanned and underfunded; unable to enforce law consistently and aware of it." on two powers); `city-0`, `metropolis-1` ("The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not." in two powers' descriptions).
- **Three people with one position line**: `city-1` ("Runs a smaller house behind the leading one in quiet times." and "Growing into the leading house's trade invites a reply; staying out of it means staying small." on three cards).
- `culturalNotes` repeats two of `culturalIdentity`'s own lines in every one of the twelve (e.g. `town-0`: "Household, guild, parish, and estate obligations overlap…" and "Farmsteads and craft yards form compact wards…"). Stored twice; whether the page prints both I did not establish.
- `metropolis-1`: one tradition's tail ("houses: River ferry · persons: Prima Regulus · keeper: house") twice — those are `describeTraditions` metadata fields that my walk prints as labels.

Brackets or placeholders unfilled (`{…}`, `undefined`, `null`, `NaN`, `[object Object]`): **none** in the twelve (grep).

A sentence naming a thing the place's own lists do not hold (my reading, not exhaustive): `town-0` (Hartgrund) — the governance account says "The merchants have argued against every one of them [the levies]", but Hartgrund's powers are only the Arcane Council and the Religious Authorities (it has a merchant guild institution, no merchant power). Also seen: the who-rules desk prints `stabilityHeader [Stable]` beside `legitimacyBanner [Contested]` in the same section (e.g. `town-0`).

## CONFIRMED (executed, with the file)

- Fortune merge: six conflicts, resolved as stated, committed `b1c085013` (`logs/merge-fortune.log`). Depth merge: six conflicts, two outside the rule, aborted (`logs/merge-depth.log`, `logs/depth-conflicts.txt`).
- `typecheck:domain:strict` 1113 at ceiling 1113, exit 0, through the mutex (`logs/typecheck-domain-strict.log`).
- Smoke before and after the flip, six sizes, no crash (`logs/smoke-preflip.log`, `logs/smoke-flipped.log`).
- Flip committed `14bc9b078`; all 900 records carry `_seatLawVersion: 2`, `_fortuneLawVersion: 2`.
- Pool 900 births, 0 errors, 81 s (`logs/pool-a.log`, `logs/pool-b.log`, `pool/`).
- Measures 1-3 (`measures.json`, `measure2-places.md`, `measure2-blocks.json`); twelve places rendered (`places/`).

## PLAUSIBLE (read, not run)

- That the trouble card prints the stored description beside the cause sentence (so the 21-46% stored-description repeat reaches the page).
- That `simulationTrace` and `generationCoherenceReceipt` strings are not shown as prose (no component/PDF reads `simulationTrace`; `generationCoherenceReceipt` IS read by `VersionsTab.jsx`, `generalDeskRead.js`, `pdf/lib/generationContracts.js`).
- That the depth lane's `factsOf.js` hunks would union cleanly (both sides add getters only); not tried, per the brief.
- No build, no `npm run check`, no suite run; `tests/lint` and the register walkers were not run on this tree.
