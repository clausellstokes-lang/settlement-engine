# PLACE-1 MEASURE brief 2 — `economicState.safetyProfile.safetyDesc` (the Defense tab's safety line)

Written by PLACE-1, `date -u` at writing: 2026-11-20T16:01Z. Read `BRIEF-MEASURE-COMMON.md` beside this file FIRST and WHOLE: it says how; this says what.
Your output: `docs/chair/2026-11-20/content/place/safetyDesc-MEASURE.md` and `docs/chair/2026-11-20/content/place/tools/safetyDesc/`.

## What the chair measured (50 places a size, at 43ab0f5eb; reproduced by PLACE-1)
One sentence holds 28 of 50 thorps ("The neighbours keep an eye on one another, and what trouble there is, everyone soon …") and 33 of 50 cities ("A mix of safer and more exposed areas. The garrison patrols the main paths; quieter …"); towns 16 of 50 ("A mix of safer and more exposed areas. The watch covers the main paths; quieter spot…").

## Where to start (a map; section B is yours to complete)
- The writer: `src/generators/safetyProfile.js` (read WHOLE): the `safetyDescs` accumulation and every later assignment of `safetyDesc` (the joined sentences, the state-crime and criminal-government branches, the calm branch). Its truth filter: `src/generators/safetyLineTruth.js` (read WHOLE) and its declared siblings (`tests/generators/safetyLineSiblings.test.js` names them).
- The force facts: `src/domain/facts/defence.js`, `forceHours.js`, `guardPay.js` and the `defenseFactsOf` home cited in `docs/DESIGN_POOL_CENSUS.md` §1 (the watch/walls/garrison rows: note the COMPETING readers there, `priorityHelpers.getInstitutionNames`; a wording you propose reads the HOME, never the competing reader).
- Readers found by a first grep (incomplete): `DefenseTab.jsx`, `EconomicsTab.jsx`, `proseFieldLabels.js`, `generationCoherence.js`, `dossierStateProse/{economy,defense}.generated.js`, `guardLineUnderTheLaw.js`, `defenseDisplay.js`, `defenseStateProse.js`, `dossierMounts.js`, `dmFieldProjection.js`, `userEdits.js`, `settlementPendingEdits.js`, and the tests: `safetyModerateSmallPlace`, `safetyLinesSayTheRecord`, `safetyForceLines`, `safetyLineSiblings`, `tailDefeconSafetyLines`, `coherenceAgreeCures`, `projectionAgreement`, `narrativeQualityCorpus`, the save fixtures (a SAVED town keeps its stored sentence: say how the fixtures prove it).

## What the proposal must respect for THIS field
- The repeated sentences are the CALM and the MIXED readings: replacements stay calm or mixed exactly as today (a place the line calls safe is not made dangerous, a place with no watch is not given one), and say WHO keeps the peace and WITH WHAT, from the record (the watch, the garrison, the militia, the neighbours; walls or none; by day or by night), never a trouble the record lacks.
- Measure the field as a WHOLE (it may be several joined sentences): report the repeated FIRST sentence and the repeated whole line separately, by size; propose wordings per repeated sentence-slot, keyed by `pickVariant` on the seed and the field AND the slot.
- `economicDragDesc` (the same file) is a SEPARATE brief: do not propose for it; but name any coupling you find between the two.
