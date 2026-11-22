# U2 — the builder B2's report (THE ONE TABLE AND THE ONE KIND READER; CS6, CS4)

Written 2026-11-20T09:15Z (read from `date -u`), on `lane/seat-2026-11-20-u2`, cut from `fd5323d05`. Not pushed. CONFIRMED = executed here; PLAUSIBLE = read or reasoned, not executed.

## Outcome

Built and committed: `src/domain/seat/seatTable.js` (new), `src/domain/rulingPower.js` (its old table and alternates are now reads of the one table), `tests/domain/seat/seatTable.test.js` (new). **Three STOPs for SEAT-2's ruling** (none is mine to cure):

1. **First-paint and worker bytes over their zero-slack ceilings** (the brief: "a rise over the ceiling: stop and report").
2. **The competition-layer step is HELD, not committed.** `factionCompetition.js` sits at exactly its 800-line `max-lines` ceiling, so the seat-law branch can't land. It needs two import lines; the lint-staged hook refuses the file at 802. The step is ready below.
3. **`writerReach.walker` reds on a frozen register.** `hidden on factions` gains `campaign-pdf=N`, because the kind reader reads `hidden` off the row (the CURE requires this) and `seatTable.js` is in the campaign-pdf closure through `rulingPower.js`. Re-recording `surfaceReach` belongs to the integrator.

## Red → green (CONFIRMED)

| arm (tests/domain/seat/seatTable.test.js, 29 tests) | module absent | module present, rulingPower unwired | wired |
|---|---|---|---|
| all | suite fails to load, 0 run | 1 failed / 28 passed: "(2) … the old table lives in the one home: rulingPower.js spells none of its forms" | 29 / 29 |

With the HELD step applied, under the arms' earlier `test.each` shape: unwired 6 failed / 130 passed (the one-home arm, plus five seat-law competition arms: craft, outsider, occupation, the three together, the born Craft Guilds). Wired: 136 / 136. I rewrote `test.each` to plain loops because `sovereigntyLightingContract`'s "EACH-FAMILY PARK DEBT" arm went 106 → 107 on the each-only file. The rewrite cured it.

**Greens on the committed shape:**
- Governing suites: every test file that names `rulingPower` or `factionCompetition`, plus the arms, `layerBoundaries`, `engineCoreLazyEdge` and `densityCreateBoundary.walker`. 110 files, 1,978 passed, 14 skipped.
- `typecheck:ratchet` 167/167.
- `typecheck:domain:strict` 1113/1113.
- `lint` 0 errors, 38 warnings (the base's 38).
- `observedShapeReaders`, `presumedThings` and `densityCreateBoundary` walkers: green.

**`tests/lint` whole: 214 of 219 files pass.** The five red files:
- `negativeAssertionAnchor`: red at the base, not mine.
- `sovereigntyLightingContract`, census arm: files 3702 → 3703, from the new test file.
- `proseWiringCensus`, two census arms: the dry run moves only the stamp, 0 rows; the cause is the new src file.
- `writerReach`: STOP 3.

## Bytes (CONFIRMED)

Method: a fresh `npm run build`, then the entry closure measured by `tests/build/vendorPdfLazy.test.js :: entryStaticClosure`'s own walk, replicated in a scratch script whose figures equal the test's. I took the base from a `git archive` of `fd5323d05`: 11,307 files, matching `git ls-tree`. Then `tests/build` with `VERIFY_DIST=1`.

| | base `fd5323d05` | U2 | delta | ceiling |
|---|---|---|---|---|
| first-paint closure, raw | 1,175,492 | 1,176,781 | **+1,289** | 1,175,492 (red) |
| gzip | 374,006 | 374,469 | +463 | 373,999 (already over at the base by 7) |
| brotli | 314,095 | 314,366 | +271 | 313,994 (already over at the base by 101) |
| generation worker | 2,579,708 | 2,580,905 | **+1,197** | 2,579,708 (red) |

The rise is the table's data, which lands in `engine-core`. Rollup already drops `pairLicense`, `formKindOf`'s map and `SEAT_CIRCUMSTANCES`, because nothing in `src` reads them yet. When U3 and U4 import them, the first-paint figure will rise further; I did not measure that cost.

Buy-back options for SEAT-2 to rule:
- (a) Split the table into a first-paint part (the transfer's 13 preferred and 5 alternate forms) and a lazy part (bands, weights, licenses, families). This is not one home.
- (b) Buy the bytes back elsewhere in the closure.
- (c) Record the bytes as owed.

## HELD: the competition step (ready; SEAT-2's ruling)

```diff
+import { seatsByHolder } from '../seat/seatLaw.js';
+import { contestKindOf, governmentFamilyOf } from '../seat/seatTable.js';
-        governmentPreference: faction.governmentPreference || (/** @type {any} */ (GOVERNMENT_BY_ARCHETYPE))[archetype] || pick(local, GOVERNMENT_PREFERENCES),
+        governmentPreference: faction.governmentPreference || (seatsByHolder(item.settlement) ? governmentFamilyOf(contestKindOf(faction)) : (/** @type {any} */ (GOVERNMENT_BY_ARCHETYPE))[archetype]) || pick(local, GOVERNMENT_PREFERENCES),
```

The seat-law arms to restore with it: for each kind, `ensureFactionStates` under `_seatLawVersion: 2` gives the table's family. Those arms are craft `guild_charter`, outsider `foreign_administration`, occupation `occupation_rule`, and the born Craft Guilds (category `economy`) `guild_charter`.

Ways to land it:
- (i) A size-baseline row for `factionCompetition.js` at 802. That widens a register, which is the chair's call.
- (ii) Move `GOVERNMENT_BY_ARCHETYPE` into the one table as the old law's id. This is file-neutral, nets −10 lines, and adds about 70 first-paint bytes. It also removes one `any`, so `.domain-any-baseline.json` must be hand-lowered by one; that file is not in my manifest.
- (iii) Decompose the file.

I declined two dodges: reformatting the old table onto fewer lines, and putting two imports on one physical line.

Also for a reader: under the law, a hidden non-criminal power's stated preference would read "criminal shadow rule". This follows the kind reader's veil-first rule, and it may need a security read.

## Judgments (each vetoable)

- **Bands** come from the measure's own "ruling bodies born" by tier on both pools. A name never born goes in its chooser's tier band. Weights are integers and a draft: 2 for the transfer's own form, 1 for the others. They are not registered and no draw reads them until train 2.
- **Guild Council, Guild Authority and Grand Guild Council** are held as own by both merchant and craft. `formKindOf` reads them as merchant, which is today's reading and keeps U3's measured R3.
- **Each band is a form → weight map.** A form is a key, not a printed line. The array shape I wrote first had 3-word literals ("Grand Merchant Oligarchy", "Merchant Guild Council", "Grand Guild Consortium") that `presumedThings` ARM 1 counted as new lines. Those names keep their `family` rows on `rulingStructure.js`.
- **The craft name is read off `.faction` only.** Reading `.name` added a reader-with-no-writer row (`observedShapeReaders`). Every writer stamps `.faction`.
- **Pair API:** `pairLicense(kind, form)` returns `{ pair: 'own'|'civic'|'fallback'|'licensed'|'none', circumstance }`. Civic/other/unknown kinds read the government row. The only license is the merchant king (Royal Authority and Ducal Governorship, `trade_wealth`).
- **Circumstance ids:** `craft_led, trade_wealth, strong_faith, martial_pressure, hunger, mandate, outside_debt, occupation`.

## Differences from `seat-draft.mjs :: SEAT_TABLE` (READ)

- **Shape:** the draft uses one flat `forms` list with a band or `*` and weights 3/2/1/0. Mine has per-band weighted maps, weights 2/1, and the alternate held through `alt`.
- **Bands:** the draft marks several forms `*`. Mine places them by measured tier:
  - Merchant oligarchy: town, large.
  - Merchant Guild Council: large.
  - Noble Governorship: large.
  - Ecclesiastical Council: large.
  - Town Mayor: town.
  - Democratic assembly: large.
  - Occupation Authority: every band.
  - Feudal Appointee: town in mine, small in the draft.
- **Born forms mine adds beyond the transfer's own:** Ducal Governorship (large), Merchant Council (town), Merchant City Council (large), Church Council (town), Arcane Council (large), Corrupt Council (town), Corrupt City Council (large).
- **Guild forms:** the draft gives merchant only Guild Council, so its Guild Authority and Grand Guild Council read craft. Mine reads all three as merchant.
- **Mixed Council:** the draft holds it as government (weight 0). Mine holds it nowhere, so it reads null; no emitter emits it.
- **`contestKindOf`:** the draft returns the archetype for a veiled non-criminal row (a hidden Merchant Guilds reads merchant). Mine reads it as criminal, per the brief. The draft also imports `isVeiledPower` and `nameOf`; mine reads the row itself.
- **`pairLicense`:** the draft returns `{ ok, license }`, takes a band, and labels the fallback `civic_fallback`. Mine returns the five words and takes no band.
- **Circumstance ids:** the same.

## Not done

- No push.
- No census re-taken.
- No `vite.config.js` pin; the table is first paint.
- No line of prose.
- No birth or transfer behaviour under the law (U5 and train 2).
- The held competition step.
- The byte buy-back.
- The `writerReach` re-record.
