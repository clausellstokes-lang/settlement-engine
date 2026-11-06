# The vocabulary rulings (the chair, 2026-11-04 ~23:35) — binding on CENSUS-1b (the vocabulary module) and on every declaring lane

These resolve the questions CENSUS-2 and CENSUS-3 raised at their phase-A boundaries, so that the four lanes declare against ONE vocabulary. CENSUS-1b builds `src/domain/facts/factVocabulary.js` and the `factsOf` getters to these rulings; the phase-B seats re-spell their ledgers to them.

## 1. The spellings of the crisis dimension (one table, no third form)

| the line… | declares |
|---|---|
| is sayable in every condition (calm and every crisis) | `crisis: any` |
| is sayable only under certain crises (kinds or families) | `crisis: siege, famine` / `crisis: hunger, threat` — "one of these is active" |
| presumes SOME crisis is active, whichever | `needs: crisis` (the presence atom `crisis` = "a crisis is active") |
| is calm about one family (false under it) | `excludes: crisis: hunger` (per family) |
| is calm, full stop (false under any crisis) | `excludes: crisis` — and in a `{crisis-scoped}` pool, silence means exactly this |

The families are F12's: `threat` (siege, occupation, beast and raider threat), `hunger` (famine, siege, any food-record deficit), `succession` (succession void, political fracture), `unrest` (insurgency, slave revolt, wartime), plus the kinds themselves. ~~UNDER SEVERAL ACTIVE CRISES the gate takes the conjunction: a line is drawable only if it is admissible for EVERY active kind (for each active K: K, K's family or `any` is in `crisis`, and neither K nor its family is in `excludes`). `drawDeclared` implements exactly this; CENSUS-2's reading (R-S1) is confirmed.~~

**Corrected 2026-11-05 — the chair's correction (R-H): the disjunction; CENSUS-2b caught the contradiction** (this section said both "the conjunction" and "R-S1 is confirmed", and R-S1 is the disjunction). UNDER SEVERAL ACTIVE CRISES: `crisis: [values]` admits a line when AT LEAST ONE declared kind or family is active (`hunger` is also on by a food-record deficit); `excludes: crisis[: F]` refuses the line if ANY active crisis is in F (or any crisis is active, for the bare form); `any` admits everywhere; `calm`, or silence in a `{crisis-scoped}` pool, admits only with no crisis active. A line that is fine under a famine but calm about threat declares `crisis: famine` + `excludes: crisis: threat`. The conjunction refused every famine line under famine + siege that did not also name the siege, muted a siege-keyed banner because a famine was on, and made every line enumerate every co-active crisis — combinations, which the design never declares. `factVocabulary.js :: crisisAdmits` implements the disjunction (CENSUS-1d unit 1, red-first `tests/domain/facts/crisisDisjunction.test.js`). CENSUS-2b's R-B1 (a keyed pool does not re-declare its key) stands as hygiene.

**R-I (the same rulings):** `crisis: K` on a line is a presence requirement in every pool — one of K must be active, so with no crisis active the line is refused unless it also lists `calm`; there is no separate spelling for "needs a kind", and bare `needs: crisis` stays "some crisis is active".

## 2. The atoms that already have one reader get a `factsOf` getter (no new home needed)

The design's §1 marked these "single" but they were not getters on `factsOf`, so the lanes parked their lines under `stop`. RULED: `factsOf(record)` exposes them by delegation, red-first, no behaviour change: `tier` (the field) and the population band; `tradeRoute` (`tradeRouteSemantics`: road / river / sea / port / isolated / crossroads); `culture` (`resolveSettlementCulture`); `foodSources` (grain, fish, game, livestock…, from `deriveFoodRecord`) and the food band / deficit / famine already homed; `imports` / `exports` (`canonImports` / `canonExports`); `crime` (`deriveCriminalStructure`: none / gangs / guild / syndicate); `faith` (`faithReadingOf`: temple, priest, patron creed, pantheon); `soldiers`, `commander`, `mercenary` (`defenseFactsOf` / `forceWordsOf`); `prosperity` (the economic band); `warState` (already homed by CENSUS-1). Season and climate stay "needs a field" (no atom).

## 3. One composite atom, defined once

`guardPresence` = watch ∨ garrison ∨ militia ∨ hired company, defined ONCE in `factsOf` as a named derived reader over the homes (the hook pools' "a guard captain…" lines and CENSUS-2's 24 `stop` lines declare `needs: guardPresence`). A composite is lawful only when it is named in the vocabulary module with its definition beside it; a line never composes atoms itself.

**Added 2026-11-05 06:17 UTC (CENSUS-1f, the chair's R-AE):** the second composite, `sacredHouse` = a temple-kind house (church, cathedral, shrine, chapel, abbey: `institutions.js :: INSTITUTION_KIND_PATTERNS.temple`) ∨ a monastery-kind house (monastery, friary), as the roster names them, defined once in `factsOf` and named in `factVocabulary.js`; `temple` stays narrow. A `council` presence has no home: no reader of the power structure's bodies exists (a council shows only through the government label, `ruler: council`), so the lines that want one ("Fund the council") wait on `council`.

## 4. Water

The vocabulary takes the reader's values and nothing else: `waterAccessKind` answers coast, river, navigable; the trade-route reader answers `port`. `lake` is an atom only if the record carries it (CENSUS-1b checks; if not, it is dropped and the procedure is corrected). The procedure document is corrected to this list.

## 5. The twin rule, corrected

The design governs: a twin is written where the gate would otherwise leave the slot EMPTY or the pool THIN for most births (the design's §4.4), not beside every rare-fact line. A single rare line in a rich pool needs no twin; the gate refuses it and the pool's other lines serve. Every twin written is recorded with its share. `docs/POOL_WRITING_PROCEDURE.md` §3 is corrected to say so.

## 6. Reader faults and weights found by the lanes (CENSUS-1b's, red-first, births counted)

- `hasInstitution`'s mill pattern matches "Access to external mill"; its tavern pattern misses "Ale house" — fix the patterns (the home's truth over the stale pattern).
- Fact 4 fixed only the First Landing element: the Tide and River tradition elements keep their base weights in landlocked places (CENSUS-3's measurement: `reader:traditions-water` 40 at 1,000, not 0). Extend the water weight rule to every water-keyed tradition element; count the births moved by that cause.
- The Daily Life instrument and the hook-pools instrument read `factsOf` (the watch regex that counts a garrison as a watch goes; the idiom "the old guard" is excluded from the hook-pools' guard sense by the instrument reading the declaration, and until then by an explicit idiom exclusion, never by rewording the line).

## 7. Ownership of shared tables

The hook tables, the NPC faction-loyalty hooks among them, are CENSUS-3's to apply; CENSUS-4 does not touch them. The institution description and service tables are CENSUS-4's. The trade lists' `kind` field is a display read model, not a persisted shape (CENSUS-3's design, accepted); the luxury band is `tier: ≥ village`; the camel chain declares `terrain: desert`; the 71 category-error rows leave the trade lists (recorded in CENSUS-3's lane doc).

## 8. Accepted as measured

DS-GEN opts in 35 of 140 pools (history, fabric and morphology pools assert no calm) — accepted. The decree pools are 34 / 96 lines, the DS desks 772 — the inventory's counts corrected. The soak harness writes no certification field: "1,000/1,000" is read as "no `cert:*` finding".

## 9. A draw site's facts (added 2026-11-05 06:18 UTC by CENSUS-1f, the chair's R-Z of 2026-11-05 04:5x)

A draw site inside the pipeline is handed only the ONE field measured as settled before its draw (through `factsOf.js :: birthFactsOf`, R-V), never the whole container that holds it: handing the goal draw the whole power structure carried a guild faction the density law can empty later (CENSUS-4d, three births failed the self-check), and handing the ruling step's sibling sets the native roster carried a militia that joins after the power step (CENSUS-1e's R-Q cure, `f2367a4`); the birth self-check (`cert:false-presumption`) stays the guard.

## 10. The per-line colour mark (added 2026-11-05 07:10 UTC by CENSUS-1g, the chair's R-AO of 2026-11-05 06:2x)

A mixed pool's line that was read and presumes nothing is marked `colour` — in the annex tag slot (`[angle · colour]`; `[colour]` in a canonical row's slot) or on a table row (`{ text, colour: true }`); the projector and the undeclared register count it as declared ("read; presumes nothing"), the draw, the kernel and the ledger read it as silence (it is no atom, so it moves no birth), `colour` beside an atom is an error, and an unread line is never marked.
