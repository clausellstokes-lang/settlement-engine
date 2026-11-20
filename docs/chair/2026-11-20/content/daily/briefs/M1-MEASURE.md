# DAILY-1 · M1 — THE MEASURE OF THE EIGHT DAILY LIFE SLOTS (a builder's brief; measure only, nothing in `src/` changes)

You are a measuring builder for DAILY-1 (lane `lane/daily-1-2026-11-20`, checkout `/home/user/settlement-engine`, base
bd42d63c7 = the working line 43ab0f5eb + `lane/kernel-mix-2026-11-20`). Your output is FILES; your final message is at
most 200 words: outcome first, then the paths, then one CONFIRMED-vs-PLAUSIBLE sentence. Never print a log whole
into your context: every run goes to a file and you read its count lines.

## The question
The Daily Life slots written by `src/domain/dailyLife.js :: deriveDailyLife` (read it whole: 650 lines) are mostly
one sentence shared by most places, and at the small sizes several are FALSE for the place (walls a thorp lacks; a
trade quarter in a place with no quarters; bakers where no bakery stands). The cure (a later unit, not yours) makes
each slot say only what the record holds, then varies the wording by keyed hash. Your measure is what that cure is
built on, and what could refute it.

## What you write (all under `docs/chair/2026-11-20/content/daily/measures/M1/`)
- `measure.m1.mjs` (one script; re-runnable; its first output line is its RE-RUN command), `m1.out.txt` (its
  output), `SUMMARY.md` (at most 120 lines: the tables below, no flag lines, no sample dumps).
- Births: 150 places a size, the six sizes thorp → metropolis, seeds `hxd-<size>-0..149`. Reuse the birth path of
  PAGE-9's measure: `git show origin/lane/page-9-2026-11-20:docs/chair/2026-11-20/content/page/measures/THIN/measure.thin.mjs`
  (read it; copy what births a place; do not import across branches). Derive with `deriveDailyLife(settlement)` on
  the born record exactly as a page read does (find how the page reaches it: see 4).

## The tables (SUMMARY.md), in this order: `dawn_work`, `gathering_places`, `child_warnings`, then `food_culture`, `commoner_resentments`, `outsider_impressions`, `unspoken_topics`, `recent_changes`
1. BRANCHES. For each slot, every branch of its writer (name it by its condition, e.g. `dawn_work:defense-critical`),
   and each branch's share BY SIZE (places taking it / 150), plus the slot's top single text share by size over ALL
   150 places of the size, and its distinct-text count by size.
2. FALSE LINES. For each slot, how many places by size print a clause that is FALSE for them, by a RECORD TEST you
   name and implement from the fact homes under `src/domain/facts/` (`factsOf.js` names them; prefer an existing
   getter, e.g. `hasInstitution`, `defenceOf`, `waterOf`, `marketOf`; if no home answers a test, say so and use the
   nearest record field, naming it). At least these tests: walls stand; a watch / guard force stands; gates stand;
   a bakery stands; a smithy stands; the place has quarters (`spatialLayout.quarters` or its home); a market stands;
   a bridge / a well / an open square is held by the record; "streets" / "the wealthier streets" at a thorp or
   hamlet; caravans / warehouses where the place has no trade route or warehouse; "temple kitchens" where no temple;
   "the council" where the ruling body is not a council (`rulingBodyOf`); "any town" said of a place that is not a
   town. For every test: the count by size and ONE example place id. A clause you cannot test from the record: list
   it as UNTESTABLE with why.
3. FACT REACH (what a true wording could stand on). For each size, the share of the 150 places holding each fact a
   true wording might need: walls; watch; gates; each house kind that could name a gathering place (temple/church/
   shrine, market of each kind, inn/tavern, guildhall, well/water source, mill, bridge, square), bakery, smithy,
   quarters; the food sources the record holds (name the field: crops, fish, herds, imports, its home) and the
   prosperity band (name its home); the ruling body's kind; the threat kinds and their visibility; the history beats
   `recentDisruption` / `unresolvedWound` present; `corruption_exposed`; the public-legitimacy band. Flag every fact
   in this table whose house is hideable by `src/domain/people/cardVeil.js :: isHideableHouse` or that is about crime.
4. WHO READS THE SLOTS TODAY. Every caller of `deriveDailyLife`, `deriveDailyLifeSlot`, `summarizeDailyLife`,
   `compareDailyLife` and any stored `dailyLife` field (grep `src/`, including `src/generators/steps/assembleSettlement.js`,
   `src/lib/ai.js`, `src/lib/structuralFingerprint.js`, `src/domain/regenerationDelta.js`, `src/components/`): by
   `path :: symbol`, one line each: does it print, store, hash, diff or send to the AI layer? IS ANY SLOT STORED AT
   BIRTH (a field on the saved record) or only derived at read? A stored fingerprint or golden that would move if a
   slot's text moved: name it.
5. THE KEY. The cure keys its pick ONLY on what every read serves: the place's NAME and the slot. For each slot say
   whether that holds, with the line of code QUOTED WITH ITS TEXT: (a) where a shared read (the shared projection /
   served document; find it under `src/domain/veil/` or the share path, READ ONLY) keeps `name` and strips `_seed`;
   (b) whether `deriveDailyLife` is ever run on a shared read's document; (c) whether any slot would need a person's
   id (re-keyed on a shared read).
6. THE PEOPLE. `buildContext` calls `deriveAllNpcProfiles(settlement)` for every slot. Which slot TEXT depends on
   `ctx.npcs` today (quote the line, or "none")? Does `deriveAllNpcProfiles` read a person's secrets or hooks
   (`path :: symbol`, the fields it reads)? Do not build a parity arm; say what one would have to pin.
7. THE HIDEABLE READS TODAY. Each existing branch whose condition reads a crime fact or a hideable house (e.g.
   `commoner_resentments` reads `criminal_opportunity`): list it with its line.

## Kept laws
Nothing under `src/`, `tests/`, `scripts/` changes. Never `npm run check`, never the whole suite, never a census.
No git commit, no push (DAILY-1 commits your files). Every hour you write is read from `date -u` in the same command.
If a table cannot be made as asked, write why in SUMMARY.md and stop rather than invent.
