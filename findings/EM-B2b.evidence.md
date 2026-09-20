# EM-B2b — evidence (lane EM COMPILE P3, letter `c`, Opus, session 923472dc)

Base and drift: `EM-B2a.evidence.md` §E0/§E12/§E14. Base `d31af2cee`.

## B2b-E1 · ⭐ GATE 4 — THE CULTURE FACT, NAMED READER BY READER

Design §14 final rules a world-fact change "consequence by design, never an error", and the chair
recorded my gate-4 finding on that footing. This packet therefore **states the blast radius, it
does not bound it.** Counted:

```
$ git grep -l "culture" -- src | wc -l                        145
$ git grep -l "culture" -- src/generators | wc -l              21
$ git grep -l "culture" -- src/domain/display src/pdf | wc -l  15
```

**IN-PIPELINE READERS, every one, with its read count:**

| file | reads |
|---|---:|
| `src/generators/npcGenerator.js` | 21 |
| `src/generators/steps/resolveConfig.js` | 18 |
| `src/generators/demandProfile.js` | 11 |
| `src/generators/narrativeGenerator.js` | 9 |
| `src/generators/generateSettlementPipeline.js` | 8 |
| `src/generators/economy/foodBalance.js` | 8 |
| `src/generators/generationContext.js` | 7 |
| `src/generators/steps/assembleSettlement.js` | 6 |
| `src/generators/foodGenerator.js` | 6 |
| `src/generators/steps/buildGenerationContext.js` | 4 |
| `src/generators/steps/generatePopulation.js` | 3 |
| `src/generators/steps/economyReconcilePass.js` | 3 |
| `src/generators/aiLayer.js` | 3 |
| `src/generators/steps/stepMetadata.js` | 2 |
| `src/generators/institutionProbability.js` | 2 |
| `src/generators/generationCoherence.js` | 2 |
| `src/generators/npcStructure.js` | 1 |
| `src/generators/npc/generatedNpcTitle.js` | 1 |
| `src/generators/isolationGenerator.js` | 1 |
| `src/generators/economy/prosperity.js` | 1 |
| `src/generators/computeActiveChains.js` | 1 |

**DISPLAY AND PDF READERS (the 15), heaviest first:** `src/pdf/sections/IdentityDailyLife.jsx` 18,
`src/pdf/lib/viewModel.js` 3, `src/domain/display/tracePresentation.js` 3,
`src/domain/display/institutionVocabulary.js` 3, `src/pdf/sections/EconomicsTrade.jsx` 2,
`src/pdf/lib/generationContracts.js` 2, `src/domain/display/guidanceRegistry.js` 2,
`src/pdf/lib/viewModelBodySlices.js` 1.

**The shape of the radius, measured rather than asserted:** `culture` is read at
`steps/resolveConfig.js` (18) and `steps/buildGenerationContext.js` (4) — **the first two steps of
the graph**, upstream of every chooser — and passed straight into the NPC draw
(`steps/generatePopulation.js:65`), whose generator reads it 21 more times. So a `config′` culture
change re-derives essentially the whole world. **That is §14's ruling working as designed**, and
this packet's duty is to say so in the delta rather than to pretend a boundary exists.

## B2b-E2 · THE DELTA'S ENVELOPE, AND WHY THE DM SECTION IS NEW DERIVATION

```
$ grep -n "^export" src/domain/regenerationDelta.js
90:export function deriveRegenerationDelta(before, after) {
183:export function regenerationDeltaSize(delta) {
198:export function newEntitiesByType(delta) {
```
Eleven keys, identical on the nullish branch (`:94`) and the real return (`:160`):
`directEffects, rippleEffects, capacityShifts, dailyLifeShifts, preservedCanon,
brokenDependencies, newEntities, removedEntities, newOpportunities, newRisks, summary`.
`preservedCanon` comes from `diffEntityCatalogs` and is an ENTITY diff — which is exactly why
design §12.12 rules a FIELD-LEVEL section new derivation rather than a relabelling.

Renderers: `src/components/primitives/RegenerationDeltaCard.jsx` and
`src/components/settlement/VersionDiffView.jsx:145`. Wave 1 is headless, so this packet adds the
DERIVATION only; EM-E3 renders it.

```
$ node -e "…Linter max-lines…" src/domain/regenerationDelta.js
File has too many lines (103).        (layer ceiling 800; no size-baseline entry)
```

## B2b-E3 · THE WORLD-FACT OPTION SETS ARE EM-P3'S, AND THAT IS THIS PACKET'S DEPENDENCY

The charter's Wave 0 row **EM-P3** gives terrain, culture, trade access, resources, goods, services
and stressors ONE canonical home (`resolveConfig`'s accepted values are the truth), because
culture has two spellings and terrain three today. `config′` cannot be validated against a set that
does not exist in one place, so **EM-B2b depends on EM-P3** as well as on EM-B2a.
