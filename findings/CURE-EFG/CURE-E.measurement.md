# CURE-E — MEASUREMENT: run 17's one red, the trade-route token floor

**Lane:** Opus CURE-E. **Stamped** Sun Sep 20 02:51:08 EDT 2026 (`2026-09-20T06:51:08Z`), read from `date` in the same call as this stamp.
**Probe:** `$SP/lane-cure-e-scratch/probe.mjs` — plain `node`, no vitest/eslint/tsc/build. Nothing was written in any read tip; all five tips' `git status --short` were EMPTY before and after (verified twice, 0 lines each).

---

## 1. THE HEADLINE

The red is **a broken test scanner, not a broken product.** `DISPLAY_LEXICON.tradeRouteAccess` is still exactly, and only, the set the generator can produce. The arm's *source scan* of the producer went half-blind at EM-P3 and now sees 3 of the 5 tokens.

**The mechanism, CONFIRMED:** the arm slices the producer file between two literal markers —

```js
const pools = source.slice(
  source.indexOf('const TERRAIN_ROUTE_POOLS'),
  source.indexOf('export const CULTURES'),
);
```

EM-P3 hoisted `export const CULTURES` from *below* the pools table to *above* it. The two markers **inverted**, so `start > end`, and `String.prototype.slice` returns `''` **silently** — no throw, no `-1`, no signal. The pools table stops contributing entirely; only the `/pool/i` line filter survives, and it yields 3 tokens.

| tip | `indexOf(POOLS)` | `indexOf(CULTURES)` | ordered? | slice len | tokens | count |
|---|---|---|---|---|---|---|
| `a41a0e109` (green era) | 1061 | 1632 | **yes** | 571 B | crossroads, isolated, **port**, **river**, road | **5** |
| `58fcfe614` (after B3a+P3) | 1646 | 1601 | **NO** | 0 B | crossroads, isolated, road | **3** |
| `ad7ddf2c9` (after B1e) | 1646 | 1601 | **NO** | 0 B | crossroads, isolated, road | **3** |
| `e5bdfd031` (after B1d) | 1646 | 1601 | **NO** | 0 B | crossroads, isolated, road | **3** |
| `32602dc60` (after the cures; the code tip) | 1646 | 1601 | **NO** | 0 B | crossroads, isolated, road | **3** |

**Lost at the flip: `port` and `river`** — the two that live only inside the terrain table (`coastal: ['port','port','port','port','river']`, `plains`/`forest`/`riverside`'s `river`).

## 2. DETERMINISM — not flaky, not a random sample

The arm draws **no sample at all**: no seed, no RNG, no golden corpus. It is a pure text scan of one file plus a `Object.keys()` read. Three consecutive runs at each of two tips:

```
read-tip-32602dc60  run 1: size=3 produced=crossroads,isolated,road   idx=1646/1601
read-tip-32602dc60  run 2: size=3 produced=crossroads,isolated,road   idx=1646/1601
read-tip-32602dc60  run 3: size=3 produced=crossroads,isolated,road   idx=1646/1601
read-tip-a41a0e109  run 1: size=5 produced=crossroads,isolated,port,river,road
read-tip-a41a0e109  run 2: size=5 produced=crossroads,isolated,port,river,road
read-tip-a41a0e109  run 3: size=5 produced=crossroads,isolated,port,river,road
```

**DETERMINISTIC at every tip.** The "flaky by construction → cure is a deterministic sample" branch of the brief does **not** apply. The floor is not the defect; the scanner is.

## 3. THE LANDING THAT MOVED IT — `f4e5b64c5` (EM-P3), sole candidate

`git log a41a0e109..32602dc60 -- src/generators/steps/resolveConfig.js` returns **exactly one commit**: `f4e5b64c5` "EM-P3: the world-fact option sets get their one home…". `git log a41a0e109..32602dc60 -- tests/domain/humanizeEngineTokens.test.js` returns **nothing** — the test file has not been touched since the green run.

The diff, verbatim in the relevant part — the culture literal *below* the table is deleted and a re-export is inserted *above* it:

```diff
+export const TERRAIN_WEIGHTS = CANONICAL_TERRAIN_WEIGHTS;
+// Re-exported under its existing name for the gallery facet-alignment contract
+export const CULTURES = CANONICAL_CULTURES;

 const TERRAIN_ROUTE_POOLS = {
@@
-// Exported for the gallery facet-alignment contract (culture facet vocabulary…
-export const CULTURES = [
-  'germanic','latin','celtic','arabic','norse','slavic',
-  'east_asian','mesoamerican','south_asian','steppe','greek',
-];
```

EM-P3 is otherwise clean: its own receipts are extensive, both goldens are byte-identical, and the move is correct. It simply could not have known that a test 200 files away depended on the *declaration order* of two unrelated exports. **No blame attaches to EM-P3; the coupling was invisible by construction.**

## 4. THE PRODUCT IS CORRECT — the true producible set, read from the producer whole

`src/generators/steps/resolveConfig.js` lines 110–145, read in full. Every site a route token can be born:

| site | line | tokens |
|---|---|---|
| `TERRAIN_ROUTE_POOLS` (7 terrains) | 39–47 | crossroads, road, river, isolated, **port** |
| inline fallback when terrain is unknown | 124 | road, crossroads |
| `pool = ['road']` when the filter empties the pool | 131 | road |
| else-branch pool, townPlus & no magical isolation | 135 | road, river, crossroads, **port** |
| else-branch pool, otherwise | 136 | road, river, crossroads, **port**, isolated |
| passthrough `config.tradeRouteAccess \|\| 'road'` | 142 | the user's authored value (not generator-minted) |

**Union of everything the generator mints = `{crossroads, isolated, port, river, road}` = exactly `Object.keys(DISPLAY_LEXICON.tradeRouteAccess)`.** No hole, no orphan. The lexicon has been right the whole time.

## 5. THE SECOND, LATENT RED — a lowered floor does not clear this test

Both assertions in the arm fail at 3 tokens:

* `:163` `expect(produced.size).toBeGreaterThanOrEqual(5)` → **3**, the reported red.
* `:164` `expect([...produced].sort()).toEqual(Object.keys(DISPLAY_LEXICON.tradeRouteAccess).sort())` → `['crossroads','isolated','road']` vs `['crossroads','isolated','port','river','road']`, **also red**, just shadowed.

So the anti-vacuity floor did its job and is not the thing to move. **Lowering the floor to 3 would expose the equality red, and deleting the equality would delete the pin.** This is worth stating plainly because "the floor is too high" is the tempting misreading of the failure text.

## 6. TWO FURTHER HOLES IN THE SCANNER, both live today

Found while tracing the surviving 3 tokens. Neither is the cause of this red; both are the same class.

**(a) The `/pool/i` line filter misses the else-branch pools.** The arm's comment claims it covers "every inline fallback pool: any array literal on a line that names a pool." It does not — the literal is on a *continuation* line that does not itself contain "pool":

```
 134 poolMatch=YES        routePool = townPlus && !canUseMagicalIsolation
 135 poolMatch=NO           ? ['road','road','road','river','crossroads','port']
 136 poolMatch=NO           : ['road','road','road','river','crossroads','port','isolated'];
```

Harmless today only because those literals' union is a subset of the terrain table's. A *new* token introduced only there would be invisible to the pin — the exact rot the arm's own docblock says it exists to prevent.

**(b) The `/pool/i` line filter has a false-positive channel.** It scoops quoted lowercase tokens from any line mentioning "pool" anywhere in the 371-line file, including comparisons rather than production sites. Provenance of the 3 survivors:

```
 124: road,road,road,crossroads  <<  let pool = [...(TERRAIN_ROUTE_POOLS[resolvedTerrain] || ['road',…
 129: isolated                   <<  pool = pool.filter(r => r !== 'isolated');
 131: road                       <<  if (pool.length === 0) pool = ['road'];
 291: isolated                   <<  if (!routePool && tradeRoute === 'isolated' && townPlus) {
```

Lines 129 and 291 are a *filter* and a *comparison*. They mint nothing. A future `effect: 'terrain_biased'` on one of the nine `'…Pool'` receipt lines (232/244/247/248/267/272/280/358) would mint a phantom "produced" token and red the equality arm against a correct lexicon.

## 7. PRIOR ART THE CHAIR SHOULD WEIGH BEFORE RULING

**(a) A canonical exported set already exists — and is itself unpinned.**
`src/domain/tradeRouteSemantics.js:175`:

```js
/** The route values the random route pools can roll (resolveConfig TERRAIN_ROUTE_POOLS). */
export const GENERATED_ROUTE_VALUES = Object.freeze([
  'road', 'river', 'crossroads', 'port', 'isolated',
]);
```

So the same five values are spelled **three times**: `TERRAIN_ROUTE_POOLS` (the producer), `GENERATED_ROUTE_VALUES` (hand copy, doc-comment coupling only), `DISPLAY_LEXICON.tradeRouteAccess` (hand copy). `git grep GENERATED_ROUTE_VALUES -- tests/` shows **no test pins it to the pools** — its only test use is `SELECTABLE_ROUTE_VALUES ⊇ GENERATED_ROUTE_VALUES`. The humanize arm is therefore the **only** thing in the repo that ties *any* copy to the actual generator table, and it has been red since EM-P3.

**(b) The repo's own better spelling of this exact contract.** `tests/lint/vocabularyTotality.walker.test.js:661` — "`DISPLAY_LEXICON.incidentType === the producer set, EXACTLY, in both directions`" — composes its producer set from imported frozen sets *plus* an anchored scan, asserts with `setDiff` in **both** directions with authored failure messages, and anchors non-vacuity on a named property (`length > 50`).

**(c) The repo's own anti-vacuity idiom, stronger than a bare size floor.** `tests/domain/tradeRouteSemantics.test.js:55` anchors on a **named member**, not just a count: `expect(options.length).toBeGreaterThanOrEqual(6); expect(options).toContain('road');` — and its `panelRouteOptions()` scan anchors its regex on a *semantic* binding (`value={config.tradeRouteAccess}`) and **asserts the match was found** before using it:

```js
expect(block, 'the tradeRouteAccess <Sel> block is no longer findable in ConfigurationPanel.jsx').toBeTruthy();
```

That single `toBeTruthy()` on the match is precisely the guard the humanize arm lacks. A marker-slice has no such assertion available — `slice` cannot fail.

**(d) EM-P3b is already chartered over this exact ground.** `src/domain/worldFactOptions.js:26-30` records that trade access is **EM-P3b's row**, absent from `WORLD_FACT_SOURCES` "by ruling rather than by omission: no canonical list exists to cite yet… EM-P3b mints `TRADE_ACCESS` with its decision-fork and mechanism-coverage rows and adds the eighth key here." **Any cure that mints a canonical trade-route list overlaps a chartered packet and is the chair's to place, not this lane's.**

## 8. SIBLINGS CLEARED — no vacuous green hiding behind this red

Four tests read `resolveConfig.js` as source text. The other three were read and are **safe** — all are `toContain`/regex `test()` assertions with no marker-slice, so EM-P3's move could not have silently emptied them:

* `tests/domain/tradeRouteSemantics.test.js:60` — `expect(resolveSrc).toContain("config.tradeRouteAccess === 'random_trade'")`. Green, and would red loudly.
* `tests/domain/defenseStateProseDesk.test.js:410` — `expect(resolveSource).toContain('monsterThreat: threat,')`. Green.
* `tests/store/toggleSlice.scope.test.js:98` — four regex probes for `config._<bag>`. Green.

Two tests import from `resolveConfig.js` by symbol (`facetAlignment`, `siteCoherenceRatchet`, `compendiumWorldInputs`) — EM-P3 preserved both names deliberately (its one recorded JUDGMENT call), so those are unaffected.

## 9. THE FORK — the chair's ruling, stated as options, not chosen

The measurement says the cure is **not** a lowered floor and **not** a deterministic re-sample. Beyond that I am not ruling. Three shapes, with what each costs:

1. **Repair the slice in place** — anchor the end marker on something that cannot reorder (e.g. `source.indexOf('};', iPools)`), and *assert both indices are found and ordered* before slicing. Smallest diff, touches only the test file, keeps the pin aimed at the real producer. Does not address §6(a)/(b) or the three-copy problem.
2. **Re-cut the scan to the repo's `incidentType` idiom** — anchored extraction with an explicit found-assertion, `setDiff` both directions, non-vacuity anchored on a named member (`toContain('port')`) rather than a bare count. Cures §5, §6(a), §6(b) and the silent-empty class. Still test-only; still three copies in src.
3. **Make `GENERATED_ROUTE_VALUES` the chokepoint** — pin the lexicon and the pools to the one exported set, collapsing three spellings to one. Structurally correct and it is what the three-copy finding argues for — **but it mints the canonical trade-route list, which is EM-P3b's chartered row (§7d).** Owner/chair-gated by the charter, not mine.

My read, offered and vetoable: **(2) now, as the cure; (3) belongs to EM-P3b and should be slotted there, not smuggled into a cure lane.** (1) leaves the class alive after the third same-shape hole in one arm.

## 10. NOTICED AND NOT TOUCHED — each specific enough to slot

1. **The marker-slice idiom is a silent-failure class, not a one-off.** `String.slice(start, end)` with inverted or `-1` markers yields `''` with no signal; an arm that then asserts coverage over the empty set can pass **vacuously**. Live instance found at `tests/components/faithPanelModel.test.js:217-218` — `doc.slice(doc.indexOf('### DS-FTH-1'), doc.indexOf('### DS-FTH-2'))` and the same on the generated file. Not verified as currently empty (no gate); worth a walker that refuses a marker-slice without a found-and-ordered assertion. **Slot: a tests/lint walker, or FIX-class item.**
2. **`GENERATED_ROUTE_VALUES` is an unpinned third copy** of the route vocabulary (`src/domain/tradeRouteSemantics.js:175`), coupled to `TERRAIN_ROUTE_POOLS` by doc comment only. **Slot: EM-P3b.**
3. **The arm's docblock overstates its own coverage** — it claims "every inline fallback pool", and lines 135–136 are not covered (§6a). Whatever cure lands should correct the comment, not just the code.
4. **`src/components/home/landingFixture.js:47` carries `"tradeRouteAccess": "random_trade"`** — the roll *sentinel*, not a route. `tradeRouteSemantics` documents that the sentinel "never reaches the semantics module", yet the landing fixture holds it as a settled settlement's config, where `displayLabel` renders it "Random trade" to a reader. **Slot: a fixture correction; needs a reader check first.**
5. **`src/data/sampleDossier.json:15` carries `"tradeRouteAccess": "salt road"`** — not in any vocabulary; falls through the humanizer to "Salt road". Probably intentional flavour, but it is a sample that no `tradeRouteTier` can score (returns `'unknown'`, the fail-closed neutral). **Slot: confirm intent.**
6. **`tests/helpers/goldenMasterCorpus.js:107`** references `TERRAIN_ROUTE_POOLS` in a comment describing corpus coverage; if the cure changes how the pools are addressed, that comment is a stale-citation candidate of the same kind CURE-D just swept.

## 11. WHAT I DID NOT DO

No vitest, eslint, tsc or build was run — the gate is not mine yet, so **the red itself is quoted from the chair's run-17 report, not re-executed by me**; everything else here is executed `node` evidence. No file in any read tip was written or staged. No cure was built. `$SP/consist`, `$SP/slot-2`, the other `$SP/lane-*`, the ledger checkout and the kit were not entered.

---

**PAUSED FOR THE CHAIR'S RULING.**
