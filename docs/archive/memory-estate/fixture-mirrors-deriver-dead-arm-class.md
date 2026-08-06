---
name: ""
metadata: 
  node_type: memory
  title: The fixture-mirrors-the-deriver dead-arm class (and the two-author frame-word defect)
  date: 2026-08-03
  commit: 1eafbaec
  lane: PS (first-contact prose seams)
  severity: high
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T23:04:06.686Z
---

# The fixture-mirrors-the-deriver dead-arm class

## What bit

`src/domain/simulationSpine.js` fed the generation-spine card the user sees on
first contact. SIX OF ITS SEVEN RUNGS had a **dead primary arm**: each deriver
read field names the pipeline does not write, so every rung silently fell to its
fallback and the rail printed nearly the same seven generic lines for every
settlement in the game. Shipped, live, for every first-run user.

| deriver read | generator actually writes |
|---|---|
| `settlementReason` as a **string** | an **ARRAY** of authored sentences |
| `economicState.topExport` / `.prosperityBand` | `primaryExports[]` / `prosperity` |
| `powerStructure.governanceType` | `powerStructure.government` |
| `powerStructure.factions[].name` | rows keyed **`.faction`** (the FACTION-KEY class) |
| `defenseProfile.threats` | **no such key at all** |
| `currentTensions[].label/.name` | entries carry `.type` + `.description` |

## Why the test suite was green through all of it

The suite's fixture was **hand-written from the same belief as the derivers**.
Fixture and code agreed with each other; neither agreed with the pipeline. A
fixture cannot catch this class by construction — it is authored out of the same
misconception the bug is made of.

**The cure that must exist:** a pin that boots the REAL pipeline
(`generateSettlementPipeline`) and asserts, rung by rung, that the PRIMARY arm
fired and the FALLBACK string is absent (anchored via
`expectAbsentWithAnchor`). See `describe('over REAL generated settlements')` in
`tests/domain/simulationSpine.test.js`.

**Apply this generally:** any module that projects settlement state into prose
or UI needs at least one generated-corpus pin. Fixture-only suites over
projection code are a standing vacuity risk, not a covered surface.

## The sibling defect: a frame word with two authors

The deriver returned the whole sentence `"Strained by X."` while the component
printed its own `<dt>` label `"It is currently strained by"`. The user read
both: *"It is currently strained by / Strained by under Siege, infiltrated."*

Neither half is wrong in isolation, which is why no test saw it — a domain test
asserts the deriver's return value, a component test asserts the label. **Only a
RENDER assertion that reads the `<dt>`/`<dd>` pair together can see a defect
that lives in the juncture.** `tests/components/pipelineRailSpineProse.test.jsx`
is that pin; standing plant = mutation-sweep area 64.

Cure: the frame word lives in ONE table (`SPINE_RUNGS`); derivers return only a
COMPLEMENT. Doubling is not a fixed bug, it is a shape that no longer exists.

## The splice guard (generalizable)

Fields whose contract is PROSE must never enter a noun slot **at any length**.
`powerStructure.recentConflict` is a governance vignette
(`governanceNarrative.js buildStressNarratives`); spliced into
`"People fear a return of ___"` it produced three sentences and a doubled
period. Its *short* form is still a finite clause, not a noun phrase — so a
length/punctuation guard is NOT sufficient. Refuse the field outright and let
the next arm answer.

`nounPhrase()` in simulationSpine.js is the single chokepoint every noun slot
draws through; keep it that way.

## Case rule

Never `lowercaseFirst` a title-case display label — that shipped `"under Siege"`.
`lowerLabel()` decides by where the capitals fall: all words capitalized → lower
WHOLE; capitals after word 1 → proper name, leave alone; only word 1 → lower the
opening character.
