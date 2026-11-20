# GOALS-4 · builder 11 · report

Branch `lane/goals-4-2026-11-20-b11`, not pushed. Base for item 8: d874c81e9, merged clean at 1f973dfb9.

**Commits:** f9c5e55ce (1, the test, committed red) · 0410c70ac (2) · a484d65ff (4) · 142d367ba (5) · 1f973dfb9 (merge) · 494a4b012 (7) · d48807022 (8) · this report.

**Lines the pronoun test reds** (the same at both bases): mutual_leverage.tension#12, MF and FM, green after item 2. Still red, left for the chair to rule: mil_crim_corruption.tension#7 ("what him/her is known to earn", all four pairs) and gov_econ_dependence.desc#1 ("what him/her can afford", MF and FM).

**Item 3: STOP, not landed.** The stored values are read from the PRINTED index's declaration in `src/generators/people/ties.js:252-256`. `temperOfTie` reads the printed rows for `trust: 'full'`, and the result sets `firstTemper` (:196), which `inTemperOf` (:192) uses to set the archetype and strength of the pair's later ties. Under rung (i) alone this could not change anything, because no archetype with a reserve declares `full`. Under the extension to (ii) that the chair confirmed at 20:50, genuine_respect `full`→none would turn warm into the kind's own temper. I ran an unlanded prototype with both clauses: births moved only relationships[] description, tension and proseVariant, plus their prose copies outside relationships[] (prominentRelationship 2, pressureSentence 1 in the census). The same-page repeats test went green. tieReserveHead (b) and (c) went red, because they pin the old trust guard. Condition (b) was not done. Rule (ii) is untouched.

**Item 6: STOP.** The ledger `docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json` is hand-written and has no write tool (aba73c9e6: "no write tool"). It is missing all 26 reserve rows, not only #8.

**(c), places/repeats at 150 a size:** 280/3323 before and after. The prototype gives 266/3267; mutual_leverage drops from 186 places to 134.

**(d), towns moved:** golden 109, census 158. The only change is tension text (my item 2), plus its copies: pressureSentence 1 and prominentRelationship 1.

**A3/A7:** 328 and [695, 278, 2179]. Bisected to point 84, GOALS-3's merge 31a053445 (point 83 reads 327/275). The one new row is city|germanic|desert|road|civilized|golden-master-v3: E5, taken leaf prominentRelationship, mixedOutside empty. On that town, E5 went 0→3.

**Green:** powerStructure, editCorpusRatchet, people 195/195, ties 99/100, typecheck:ratchet, typecheck:domain:strict, lint (0 errors). **Red:** narrativeQualityCorpus 1 (item 3), colourMarks4h 1 (item 6), tieLinePronouns 1 (the two lines above).
