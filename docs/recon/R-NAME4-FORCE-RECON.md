# R-NAME4-FORCE-RECON — the strength surface, the six-facet law, and the force-composition clerk's inputs (at `f49e83ac3`)

Orphaned sub-recon of the stood-down TE-NAME lane (§756), preserved. All receipts at build tip `f49e83ac3`.

## THE STRENGTH SURFACE (`src/domain/display/armyStrength.js`, 198 L, read whole)
Exports: `latentStrength(settlementOrItem)` :63 · `attritionPhrase(remainingFraction)` :86 ·
`deployedArmyStatus({settlementId, worldState, nameFor})` :130 · `deployedArmyStandings({...})` :166 ·
`hasDeployedArmy({worldState})` :194 · `ARMY_STRENGTH_PHRASES` :198. `conditionPhrase` is module-private.
⚠ No export takes `(settlement, deploymentRecord)` — a positional-pair clerk is a THIRD signature shape;
decide deliberately. **Key finding: `armyStrength.js` reads `cap.theoreticalCapacity` ONLY (:65) and never
touches `cap.facets` — a composition clerk would be the FIRST facet-reading display consumer.**

## THE SIX-FACET LAW (`src/domain/worldPulse/militaryStrength.js`, 328 L)
`FACET_WEIGHTS` :74-81 = manpower .26 · institutions .24 · materiel .20 · logistics .12 · economy .10 ·
will .08 (each facet 0..100). Envelope :307-313: `{theoreticalCapacity, currentCapacity, facets, hooks:
{warExhaustion, warDrain, armyDeployed}, contributors[]}`. Inputs per facet mapped with receipts (tier +
log-population → manpower :110-120; military institutions + `defenseLedger.military` → institutions
:87/:187-196; exports/imports/institutions vs `MATERIEL_PATTERN` → materiel :207-215; `foodLedger`
resilience/storage → logistics :235-241; causal `economic_capacity` → economy :245-247;
government/deity temper → will :254-272). **NOT read: `terrain` (nowhere in the file); `veterancy` lives in
`martialReadiness.js` and reaches the army only as a deployment-record stamp.** Above the facets:
`currentCapacity = theoretical − warExhaustion×22 − warDrain×18` (:296/:305), wrapped by
`warCapacityReads.js:170-195` into `{theoretical, offensive, homeDefense, facets}`.

## THE DEPLOYMENT RECORD (canonical factory `warArmyRecord.js:85-138`, NOT warDeployment)
Fields at seed: `targetId`(:105 — the HOME id is the LEDGER KEY, not a field) · `maxStartStrength`/
`currentEffectiveStrength` :109-110 · `accumulatedAttrition` 0 · **`readiness` CONDITIONAL (omitted at 0,
:114)** · `manpower` = facets.manpower/100 :124 · `supplyIntegrity` :127 · `morale` = (will+manpower)/200
:128 · `equipmentCondition` :129 · `magicSupport` = facets.materiel/100 :130 · `commandQuality` =
facets.institutions/100 :131 · `foodReserve` :132 · `logisticsBurden` :134 · `objective`/`returnCondition`
:135-136. Later-attached: `joinLedger`, casus `openingReasons`, `recalled{cause,tick}`.
**The record is itself a derived projection of the six facets (:124-132) — a clerk reading it reads strength
one hop downstream, satisfying §746.2 (derived FROM strength, never feeds it) by construction.** The sack is
`computeSackTransfer` :56-63, returned to the caller, NEVER stored. **Naval: NO record-side signal** —
`worldState.navalTransit` is a separate ledger (`navalLayer.js`, `navalDisplay.js`); a `marine` unit type
must derive from the SETTLEMENT's port/shipyard institutions (`navalLayer.js:130`) or be dropped.

## VOCABULARY VERDICT
**No unit-type vocabulary exists anywhere** (`forceComposition|troopType|unitType|UNIT_TYPES` = 0 hits in
src+tests) — NAME-4 mints a NEW one. Unit words today are regex fragments/prose only. ⚠ **Design-premise
correction: the materiel regex exists at THREE sites, not two** — `militaryStrength.js:85` ·
`tradeSalience.js:60` · **`moralMartialLean.js:97`** (unnamed martial-goods pattern). Magic gating: the
closed 4-token ladder `MAGIC_LICENCE_LEVELS` (`constants.js:57`, "spelled exactly once, here"); the better
gate for a mage contingent is `deriveMagicProfile().roles.military` banded
`absent|occasional|common|integral` (`magicProfile.js:64-66`); `config.magicExists === false` hard-zeros
(:49-51); the record's `magicSupport` (:130) is the most direct in-record signal.

## DISPLAY-LEAF HOUSE CONVENTIONS (from 5 siblings read whole)
Header block: `domain/display/<name>.js — THESIS`, the producing wave/ruling, then the caps law-clauses
("HEURISTIC DM LANGUAGE — NO INTERNALS" · "PRESENTATION ONLY… nothing mutates worldState, forks rng, or
reads a wall clock" · "INERT, NOT CRASH, WHEN ABSENT" · strict-clean, no React/Zustand). Banding idioms:
frozen descending-floor array + `.find()` (≥4 bands) or chained ternary (tiny ladders); every bander TOTAL.
Codepoint-sorted lists (prefer shared `compareCodepoint`, `deterministicSort.js`). Display MAY import
worldPulse — "display reads domain, NEVER the reverse" (`hegemonyRead.js:5-6`); 17 of 76 display files do.
House test: the no-digit-leak assertion (`armyStrength.test.js:31-32` `expect(phrase).not.toMatch(/\d/)`) —
a `{type: count}` clerk returns integers BY DESIGN and departs from every sibling there; its header must say
so and its test needs a different invariant (counts sum to a banded total; types ⊆ the frozen vocabulary).
The facet→role mapping is already half-written at `warArmyRecord.js:121-132` — reuse that correspondence.
