# CENSUS-4 declaration ledger — the atom words (phase A, 2026-11-04)

> **PHASE B (2026-11-05): SUPERSEDED BY `src/domain/facts/factVocabulary.js`** (CENSUS-1b, corrected to the chair's
> vocabulary rulings `docs/census/VOCABULARY_RULINGS_2026-11-04.md`). The ledger was re-spelled mechanically, never
> re-judged (177 atoms): `water` → `navigable`; `other-npc` → `other npc`; `famine` (a line saying people starve) →
> `starving`; `crime` → `organised crime`; `crisis: "calm"` → `excludes: crisis`; `ruler: council, elder, mayor, priest`
> → `excludes: ruler: lord, ruler: occupier` (a keyed atom takes one key); a crisis kind written in `needs` → the line's
> `crisis` list; `tier: >=` → `tier: ≥`. `tests/lint/census4Ledger.walker.test.js` holds every atom to the vocabulary
> and names the atoms with no reader yet (`institution: guild` 21 lines, `organised crime` 10). The table below is the
> phase-A record.

The side ledger of `docs/census/declarations/<pool-id>.json` (one file per pool) uses EXACTLY
these atom words: the design's §1 facts (`docs/DESIGN_POOL_CENSUS.md`), each answered by its ONE
reader in `src/domain/facts/factsOf.js` (CENSUS-1's fourteen homes). Phase B maps them onto
CENSUS-1b's `factVocabulary.js` words; where 1b spells an atom differently the ledger is
re-spelled mechanically, never re-judged.

## File shape

```json
{
  "pool": { "id": "npcData.NPC_FACTION_GOALS", "file": "src/data/npcData.js", "drawKind": "R",
            "drawSite": "npcGenerator.js:613 pickFromArray", "colour": false, "crisisScoped": false,
            "keyDeclares": { "<pool key>": ["<atom>", "..."] }, "lines": 108, "declaring": 31, "note": "" },
  "rows": [ { "id": "Garrison Commander#0.short", "text": "…", "needs": ["walls"], "excludes": [],
              "crisis": [], "colour": false } ]
}
```

- `needs`: presence/value atoms the record MUST hold for the line to be true here.
- `excludes`: atoms the record must NOT hold (the twin's side: "no walls to speak of").
- `crisis`: `[]` = silent; `"calm"` = the line asserts no crisis presses; `"any"` = sayable under
  every condition in a crisis-scoped pool; else a list of crisis KINDS and/or FAMILIES (a
  disjunction).
- `colour: true` on a row = read, presumes nothing (pure colour). A pool-level `colour: true` is
  the pool's ruling that every line is colour.
- Atoms the pool KEY guarantees (a pool keyed by `under_siege`, by role `Garrison Commander`, by
  institution name) go in `keyDeclares` on the pool row, never on the line.

## Atoms and their readers

| atom | values | reader |
|---|---|---|
| `walls` · `palisade` · `gate` · `watch` · `militia` · `garrison` · `hospital` · `healer` | presence | `factsOf(r).defence.<atom>` — `walls` is the PERIMETER only (ruling 3) |
| `market` | presence | `factsOf(r).market` |
| `water` · `coast` · `river` | presence | `factsOf(r).water.navigable` / `.coast` / `.river` |
| `institution: <kind>` | kind ∈ hospital · healer · monastery · mill · smith · bathhouse · docks · quarry · mine · tavern · school · temple · granary | `factsOf(r).hasInstitution(kind)` |
| `ruler: <kind>[, <kind>…]` | elder · lord · priest · mayor · occupier · council; several values are a disjunction within the dimension (design §3.2). "The council" as THIS place's governing body is `ruler: council, elder, mayor, priest` (every kind that sits a council; a lord's or an occupier's place refuses it) | `factsOf(r).rulerKind` |
| `other-npc` | presence | `factsOf(r).hasOtherNpc(npc)` |
| `magic` | presence | `factsOf(r).magic.functions` |
| `famine` | presence (the one starving rule) | `factsOf(r).famine.starvingAllowed` |
| `migration: <dir>` | influx · exodus | `factsOf(r).migration.direction` |
| `war: <state>` | front · aggressor · at war · peace | `factsOf(r).warState` |
| `population: <band>` | small · middling · large | `factsOf(r).populationBand` |
| `terrain: <class>` | plains · hills · forest · riverside · coastal · mountain · desert | `factsOf(r).terrain` |
| `stores: <cmp> <n>` | e.g. `stores: < 3` (months) | `factsOf(r).storesMonths` |
| crisis KINDS | under_siege · famine · occupied · politically_fractured · indebted · recently_betrayed · infiltrated · plague_onset · succession_void · monster_pressure · insurgency · religious_conversion · slave_revolt · wartime · mass_migration | `factsOf(r).crisis.kinds` |
| crisis FAMILIES (ruling 2) | threat · hunger · succession · unrest · any | `factsOf(r).crisis.families` (`any` = the `crisis` family) |

## Atoms a line presumes that have NO factsOf reader on this base (reported, not invented)

| atom | nearest reader today | status |
|---|---|---|
| ~~`institution: guild`~~ → `guild` | `factsOf(r).guild` (`facts/guild.js`, CENSUS-4b) | **homed** (the chair's answer 4): the 21 lines re-spelled `guild` |
| `crime` → `organised crime` | `factsOf(r).crime` (CENSUS-3b's delegation to `deriveCriminalStructure`) | **homed** (merged into CENSUS-4b) |
| `tier: <cmp> <tier>` | the field `record.tier` + `tierAtLeast` | a field, no factsOf getter |

A line that presumes one of these is declared with it in the ledger so the row is not lost; phase
B cannot apply such an atom until it has a home (the vocabulary refuses an atom whose reader is
null, design §3.3).

## What is NOT an atom

- A slot the renderer fills with a fallback (`{faction}` → "the dominant faction", `{commodity}`
  → "key goods"): its presence is not a record fact the line can get wrong.
- Climate and season (ruling 8): no field, no atom. A line presuming winter is noted in `note`.
- What the line is ABOUT (the pool key): a Garrison Commander goal presumes the commander; it
  is the `walls` it mentions that is the atom.
- A building's own walls (ruling 3).
