# CENSUS-2 declaration ledger — the rules every row follows (2026-11-04)

This directory is CENSUS-2's **Phase A** side ledger (`docs/DESIGN_POOL_CENSUS.md` §3.1–§3.2, the chair's rulings 1–10 in the lane brief). It changes no code. Phase B applies it into the real schema once CENSUS-1b's vocabulary module lands.

## The file shape

One JSON file per pool family (`<pool-id>.json`): a dossier block (`DS-GEN-3.json` holds its 42 pools) or an off-census table (`ARRIVAL_SENSES.json`).

```json
{
  "poolId": "DS-GEN-3",
  "source": "src/data/dossierStateProse/general.generated.js (annex docs/content/RECEIPT_POOLS_DOSSIER_STATE.md)",
  "drawKind": "K",
  "drawSite": "readStateProse → eligibleVariants → drawVariant",
  "pools": [
    {
      "pool": "scores.monster: STRONG",
      "keyGuarantees": ["..."],
      "poolNeeds": [], "poolExcludes": [], "poolCrisis": null,
      "crisisScoped": true,
      "colour": false,
      "ruling": "one sentence: why scoped / why colour",
      "lines": [
        { "lineId": "vid:1", "text": "...", "needs": [], "excludes": ["crisis: threat"], "crisis": "any", "colour": false, "stop": [] }
      ]
    }
  ]
}
```

- `lineId`: `vid:<n>` for kernel pools; otherwise the table path (`ARRIVAL_SENSES.market[3]`).
- `keyGuarantees`: prose — what the pool KEY already guarantees (never repeated on a line).
- `poolNeeds` / `poolExcludes` / `poolCrisis`: atoms the key guarantees, stated once at pool level (the `{…}` on the heading).
- `crisisScoped`: the pool opted into the inverse default (`{crisis-scoped}`). Only then does a line's missing `crisis` mean calm.
- `colour`: pool level — its lines presume nothing (`{colour}`). A colour pool never opts in. Line-level `colour: true` means "this line presumes nothing beyond the key".
- `stop`: presumptions the line makes that have NO reader in `factsOf` (listed so the chair sees them; NOT declared).

## The atoms — every one has its reader in `src/domain/facts/factsOf.js`

| atom (exact spelling) | shape | reader |
|---|---|---|
| `walls` | presence | `factsOf(r).defence.walls` (the PERIMETER only, ruling 3) |
| `palisade` | presence | `.defence.palisade` |
| `gate` | presence | `.defence.gate` |
| `watch` | presence | `.defence.watch` |
| `militia` | presence | `.defence.militia` |
| `garrison` | presence | `.defence.garrison` |
| `hospital` · `healer` | presence | `.defence.hospital` · `.defence.healer` |
| `market` | presence | `.market` |
| `navigable` · `coast` · `river` | presence | `.water.navigable` · `.water.coast` · `.water.river` |
| `deficit` | presence | `.famine.starvingAllowed` (food band deficit or famine) |
| `famine` | presence | `.famine.famine` |
| `magic` | presence | `.magic.functions` |
| `institution: <kind>` | presence | `.hasInstitution(kind)`; kind ∈ hospital, healer, monastery, mill, smith, bathhouse, docks, quarry, mine, tavern, school, temple, granary |
| `stores: <op> <n>` | band | `.storesMonths` (op ∈ `<`, `<=`, `>=`, `>`) |
| `population: <op> <band>` | band | `.populationBand` (small < middling < large) |
| `terrain: <class>` | value | `.terrain` (plains, hills, forest, riverside, coastal, mountain, desert) |
| `ruler: <kind>` | value | `.rulerKind` (elder, lord, priest, mayor, occupier, council) |
| `migration: <dir>` | value | `.migration.direction` (influx, exodus) |
| `war: <state>` | value | `.warState` (front, aggressor, at war, peace) |
| `crisis: <value>` | crisis | `.crisis.has(value)` — a KIND (`under_siege`, `famine`, `occupied`, `politically_fractured`, `indebted`, `recently_betrayed`, `infiltrated`, `plague_onset`, `succession_void`, `monster_pressure`, `insurgency`, `religious_conversion`, `slave_revolt`, `wartime`, `mass_migration`) or a FAMILY (`threat`, `hunger`, `succession`, `unrest`, `crisis` = any active crisis) |
| `other-npc` | presence | `.hasOtherNpc(npc)` |

The kernel's existing marks keep their meaning and are translated, not re-invented: `walls` → `needs: walls`; `no walls` → `excludes: walls`; `deficit` → `needs: deficit`; `no deficit` → `excludes: deficit`. `severity` / `anchor` are kernel STATE keys with no fact home; they stay as kernel marks (`kernelMarks` on the line), untouched.

**No reader (a STOP — record under `stop`, never declare):** tier (a field, not a `factsOf` home: use `population:` when the line presumes SIZE), trade-route kind, crime structure, priest / faith presence beyond `institution: temple`, soldiers / commander, imports / exports, food sources (grain, fish, game, livestock), culture, climate and season (ruling 8), prosperity, safety label, readiness label, monster threat, history facts.

## The crisis field (rulings 2 and 4)

- `"any"` — sayable in every condition, crisis or none.
- `"calm"` — sayable only with no active crisis (what silence means in a scoped pool; written out in this ledger for the reader).
- `[values]` — a disjunction of kinds and families: drawable when ANY of them is active (the line PRESUMES that crisis). Add `"calm"` to the list when the line is also true with no crisis.
- A line that is calm about ONE family only (true under a famine, false under a siege) declares `crisis: "any"` plus `excludes: ["crisis: threat"]`. The family is the atom; its reader is `crisis.has(family)`, so the hunger family's food-deficit member is honoured.
- Pool-level `poolCrisis` is what a crisis-KEYED pool guarantees (`UNDER SIEGE` → `["under_siege"]`); its lines inherit it and are not calm.

## The opt-in test

A pool opts in (`crisisScoped: true`) when (a) it can render while a crisis is active and (b) at least one of its lines asserts calm, normality, safety, plenty or the absence of a pressure that some crisis contradicts. Every line of an opted pool then carries `crisis`. A pool that never asserts calm, or never renders under a crisis, stays out. A pool keyed ON a crisis opts in with its `poolCrisis`, and its lines declare `excludes: ["crisis: <family>"]` where they deny another family.

## The empty-slot test

For every opted or declared pool, ask: what share of births (916 of 1,000 carry a crisis) leave the pool with NO drawable line? If most would, the pool needs a twin or fallback — write it in the house voice (concrete, short, nothing the record does not hold) under `"twins"` on the pool, and the chair's lane doc records it with its share (~1/(n+1) of the pool's eligible births).
