---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-05
  tags: 
    - fp-build
    - spine
    - belief
    - sp-b
    - wr-10-lighting
    - hazard
  status: active
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-05T10:23:18.707Z
---

# SP-B LANDED — the believed-world axes (three families, four borrows, two mints)

Worktree minifold, branch `claude/composite-r4`, parent HEAD `edea9b1f`.

## What exists now

Three new arms on the EXISTING `beliefAxes` fold (seam ruling 1 / J-SP-1 — no
believed-world module, no second decay law): `scarcityBands` (per closed good
class), `conditionsBands` ({pullBand, routePositionBand, storesBand, tierBand}),
`devotionBand`. Flags `believedScarcityEnabled` / `believedConditionsEnabled` /
`believedDevotionEnabled`, all three CQ5-complete in one commit (manifest +
AUTHORED cert rows in `subsystemRowsVirtual.js`, never pending — the lane's
`VIRTUAL_PENDING_RULE_KEYS` stays `[]`).

New leaves: `src/domain/worldPulse/beliefAxisSubjects.js` (the derivations, band
vocabularies, no flag reads) and `src/domain/worldPulse/outboundImpression.js`
(second-order heuristic, ZERO imports, no flag — J-SP-6). The ONE gate door is
`beliefAxes.subjectAxesActive`, which forms the strict conjunction with
`beliefAxesEnabled` and hands gates down as data.

## ⭐⭐ THE BORROW CENSUS — most of SP-B's "band edges" were already in the tree

Measured 2026-08-05. Only TWO ladders are mints:

- `tierBand` = `TIER_ORDER` (src/data/constants.js) — IMPORTED.
- `storesBand` = `ENVOY_STORES_BANDS` {bare,thin,stocked,deep} — MIRRORED.
- `routePositionBand` = `ROUTE_FLOW_BANDS` {none,trace,stirring,steady,established} — MIRRORED.
- `devotionBand` = `pietyBandLabel`'s {secular,lukewarm,observant,faithful,devout},
  and its EDGES too: rungs key on religionState's own `standing` + patron seat, so
  SP-B mints NO devotion numbers.
- `pullBand` {shunned,overlooked,sought,coveted} — MINT.
- scarcity {scant,pinched,sufficient,plentiful} — MINT (`FOOD_FLOW_BANDS` grades
  the food flow only; its bottom rung `famished` does not generalise to iron).

## ⚠️⚠️ MIRROR-NOT-IMPORT: the cross-layer ladder pattern (reusable)

`envoyErrandVocabulary.js` is the GRAMMAR port and `routeNetworkFlows.js` the
TRADE port. Importing either from an INFO leaf mints an UNLICENSED cross-layer
pair, and licensing one is a CHAIR declaration (a couplingRegistry row) — not an
implementer's move. The cure that needs no ruling: declare the ladder locally and
land a walker that IMPORTS BOTH SIDES and asserts verbatim equality both ways
(test files have no layer). `tests/lint/spAxisVocabulary.walker.test.js` is the
template; it also EXECUTES `pietyBandLabel` across its rungs rather than comparing
a transcription. Precedent one file over: `AXIS_TUNING.CAT_ADOPT_ACCURACY`.

## ⚠️⚠️ A GUARD THAT CANNOT BE REDDENED CANNOT BE PROVEN (executed, cost a pin)

Deleting `if (!beliefAxesActive(worldState)) return null;` from
`subjectAxesActive` left the ENTIRE four-fence dormancy set GREEN (17/17). The
conjunction is guarded TWICE — at that door and again by beliefMap's own
`if (ctx.axesActive)` at the call site — so the second guard silently covered for
the first. Cure: a DIRECT unit assertion on the door, after which the same mutant
reds. Whenever defence-in-depth exists, at least one pin must address each layer
ON ITS OWN TERMS, or one of them rots into decoration.

## Sources that are REACHABLE (probed on really-generated settlements)

`settlement.economicState` carries: `foodSecurity.{storageMonths,foodRatio}`,
`prosperity` (PROSPERITY_TIERS; ranks 1..5 observed over 72 worlds, 0 and 6 not),
`tradeAccess` (the raw config route class {isolated,road,river,port,crossroads,
mountain_pass} verbatim — all six confirmed), `isEntrepot`, `localProduction`,
`primaryExports`, `primaryImports`, `necessityImports`. `settlement.foodSecurity`
is UNDEFINED — it lives at `economicState.foodSecurity`. `config.primaryDeitySnapshot`
is undefined on a fresh generate. Good classes = `REGIONAL_GOOD_CATEGORIES`
(src/domain/region/goodsCatalog.js — outside the coupling census scope, so
importable from worldPulse; four worldPulse modules already do).

⚠️ ONE CULTURE IS NOT ENOUGH for band-edge reachability: 36 germanic settlements
never crossed `foodRatio > 1.10`. The corpus was widened to two cultures rather
than lowering the edge.

## ⚠️ beliefMap.js headroom is nearly gone

773 → 778 effective against an 800 ceiling. The next wave touching it gets ~22
lines. New logic goes in a sibling leaf, always.

## Seam notes for SP-B2 / ES-4

`sovereigntyMarketStage.beliefLegsOf` returns `{tierBand, storesBand, routeBand,
trajectoryBand}` — note **`routeBand`**, while SP-B writes **`routePositionBand`**
(the §4 canonical model's spelling, which ES also binds). SP-B2 bridges the two
names; it is a naming seam, not a contradiction. The three borrowed ladders match
`SOVEREIGNTY_{TIER,STORES,ROUTE}_BANDS` minus their `unknown` prefix, so the
mapping is the identity plus absence-handling.

CR-WR10-H still needs SP-B2 + ES-4; SP-B alone mints only the SURFACES.
