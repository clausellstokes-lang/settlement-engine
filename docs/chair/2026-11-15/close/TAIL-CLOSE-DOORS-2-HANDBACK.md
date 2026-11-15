# TAIL-CLOSE-DOORS-2 · hand-back (the doors' seat of the close, final pass)

Branch `lane/tail-close-doors-2026-11-15`, from 84a9f46d7 (TAIL-CLOSE-DOORS-1's tip). ONE merge commit of the joined line
`lane/join-2026-11-14` at **f76fe38fd** (read back from origin: the line's tip at the fetch, 11:04 UTC): **3f31a7b59**, no
conflict. Scratch tree `/home/user/doors2`: a plain clone with its own `.git` and its own `npm ci` (package files
byte-identical to the line). Every run went to a file under `/home/user/doors2-logs/`. No page line cured, no test written.

STATUS: IN PROGRESS (this file is kept current in every push).

## PART 1 · THE DOORS AT THE FINAL TREE

| # | door | exact command | what it wrote | commit | result |
|---|---|---|---|---|---|
| 1 | edge bundles | `npm run build:edge-shared` | 10 files in `supabase/functions/_shared/` (aiCharter, aiGrounding, aiOutputSchema js + meta; analyticsEvents meta; engineBundle js + meta; intentAtlas meta), from inputs on the line | 224ef8d27 | exit 0. Receipt, each alone: aiCharterBundle.freshness 19/19, aiGroundingBundle.freshness 20/20, aiOutputSchemaBundle.freshness 23/23, edgeSharedBundleReproducibility 29/29, engineBundleReplay 5 + 2 skipped (by design: the class-b goldens), engineServiceCore 1/1, engineServiceStoreParity 4/4 |
| 2 | wiring census | `node scripts/wiring-census.mjs`; then `--check` and `npm run gen:dossier-prose -- --check` | `docs/content/wiring-census.json`: producerIndexFiles 1379 -> 1380 (856 pools, 169 relation rows, 7 stamped files unchanged) | 7ac6ad0b1 | all exit 0. `wiringCensusDeclared.walker` **8/9: RED, not this door's**: its channel arm finds `CONDITION_FACT_SIBLINGS` (exported by `src/domain/worldPulse/heraldDeeds.js`, 805452e8f, the trade-fact cure) absent from `scripts/lib/table-pools.mjs` (`DECLARATION_CHANNELS` / `NOT_TABLE_CHANNELS`): a code cure, named to the chair |
| 3 | page census | `node scripts/census/page-census.mjs --shrink --out=<dir>` (720 births, 4 workers); `node scripts/census/page-census.mjs --grid --shrink` | **nothing** | none | both exit 0: "the banked corpus reads at or under the register" (every banked count equals its reading: no fall, no rise); grid "0 fall(s)". `pageCensus.walker` 14/14 |
| 4a | pool dominance, plain | `node scripts/census/pool-dominance.mjs` | nothing | none | exit 1: "0 over, 0 unregistered, 0 stale, 1 loose, 2 notes" |
| 4b | pool dominance, new rows | `--bank-new` | **nothing** ("0 new rows banked") | none | exit 0 |
| 4c | pool dominance, THE CHAIR'S PD2 | `node scripts/census/pool-dominance.mjs --tighten`, ONCE | `scripts/census/pool-dominance.register.json`: 19 top1 and 1 top5 ceilings lowered to the higher of the two corpora's readings (the loose `institutionServices:Fish market.Wholesale trade` 1 -> 0.9686 among them); 14 rows' line counts raised; 0 rows dropped (none no longer drawn), 0 added, 0 raised, 0 reasons changed | 0714ca487 | exit 0 ("948 pools written"). **The eleven PD1/PD3 rows: not one moved** (their ceilings already sit at their measure; `--tighten` takes `min(ceiling, higher reading)` and so cannot lower a ceiling below a measure: no contradiction arose). Verify (plain): "0 over, 0 unregistered, 0 stale, 0 loose, 2 notes" (the two notes on one corpus only). `poolDominance.walker` 17/17 |
| 5 | phone floors | `npx vitest run tests/components/phoneChromeFloor.census.test.js`, `tests/components/dossierPhoneFloorAllViews.test.jsx` | **nothing** (both green: no row moved) | none | 9/9, 2/2 |
| 6a | prose byte ratchet (PB1) | `npx vitest run tests/lint/proseCorpusBytes.test.js`; every leaf's bytes read against its row | **nothing**: every leaf's raw bytes EQUAL the predecessor's declared rows (defense 266746, economy 185744, general 298496, power 131321, stressors 147835, warFaith 180300; the rest unmoved): no leaf moved, no row appended | none | 18/18 |
| 6b | prose numerics | `npx vitest run tests/lint/proseNumerics.test.js` | **nothing** | none | 29/29 (no debt fell, none rose) |
| 7 | landing fixture | `node scripts/generate-landing-fixture.mjs --check` (exit 1, STALE), then `--seed lf-033 --emit` | `src/components/home/landingFixture.js`: ONE line, the weeks' advance trade line: "its market stalls stand half empty" -> "its traders have little to sell" (the close's declared move, 805452e8f) | 77b95c265 | landingFixtureFreshness 3/3, landingNarrationGrounding 4/4 |
| 8 | tuning inventory, lighting census | (last, on a clean tree, after Parts 1b and 2: both re-write test files whose titles carry figures) | | | pending |

### The cross-check around the doors (three registers other seats keep)

| register | first reading (after the merge, before any door) | after the last door |
|---|---|---|
| `node scripts/presumed-things-door.mjs --check` | exit 1: "fresh 4 · stale 2 · first-register stale 0 · banked 4688 · strips fresh 0 stale 0 banked 107" (stale: `landingFixture.js` war; `priorityHelpers.js` house: criminal faction) | pending |
| `node scripts/check-writer-reach.mjs` | exit 0: "WRWALKER HOLD — judged 12661 · LIT 691 · LIT-NAME 10563 · DARK 1407 (reviewable 389) · pending-surface debt: none" | pending |
| `node scripts/check-observed-shape-readers.mjs` | exit 1: 2 STALE ROWs (`institutionRoster.js` "_worldPulseInactive on institutions"; `settlementQuickGuide.js` "culture on settlement") | pending |

## PART 1b · THE TWO SIZE BUDGETS

pending

## PART 2 · THE OWNER'S DOOR

pending

## PART 3 · THE RECEIPT

pending
