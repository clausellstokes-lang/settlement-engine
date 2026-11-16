# BAR5-MARKS · HAND-BACK · what the crisis stops is not on offer unmarked (LAW 2's rows of a house or a service)

**STATUS: IN PROGRESS.** Base `600b7683a` (the joined line; no later tip). Branch `lane/bar5-marks-2026-11-16`. The audit
`lane/bar5-audit-b-2026-11-16` at `d40d6ab28` is merged `--no-ff` (helpers and documents only).

## THE RULES

Counts are instances / towns of my six rules, by the audit's runner (`docs/chair/2026-11-16/bar5/AUDIT/runB.mjs`) over the
PAGE-COPY render. BEFORE is `600b7683a`. It reproduces the audit's tables exactly in all three populations. AFTER is
pending: the tip render is running.

| rule | the two readings, and where | the one fact made | before: sixty · 720 · fresh 300 | after |
|---|---|---|---|---|
| L2.war.iron | the war's iron hook (`economy/foodBalance.js`, stored `economicViability.plotHooks`) vs the mark, which could not reach a war (`crisisStoppedRow.js :: STOPPING_CRISES`) | `src/domain/facts/warReach.js :: warTakesOf` (WM1). Wartime stops the dependence word `iron` (the forges) only where the hook is on the record. Mark: "Curtailed by the war." | 8/2 · 9/4 · 25/10 | pending |
| L2.war.animals | the paddocks line (`narrativeData.js :: STRESS_DESCS.wartime`, stored `arrivalScene`) vs the same | the same leaf, the word `working animals` (stables, pack-animal trade, horse, carriage and pack-animal hire) | 2/1 · 5/2 · 2/1 | pending |
| L2.siege.cutgood | the herbs "from outside, which the siege has cut off" (`chainNeedShown.js`, read from the record's imports) vs the herb houses, declared NONE or `input` with no import reading | `crisisDependence.js :: INPUT_IMPORTED_AS`: a herb house whose input the record imports by name is on an imported input under a siege ("Curtailed by the siege."). `INCOME_REMEDY_HOUSES`: the remedies' income shares read their houses | 5/1 · 15/3 · 17/5 | pending |
| L2.siege.abroad | the descriptions' own outside trade vs the rows' declared dependence (NONE) | on the row where the whole house trades so: the stable district and the pack-animal trade `travellers` (their in-town rows freed: SV7, so "Curtailed"); the apothecary district `imported input` (its own "imported medicines"). By line where only part of the trade is outside (the bowyers, the bodyguards, the free company, the great cathedral, the monastery's pilgrims): a declaration plus a twin. House twins are read LATE (`DESC_LATE_SIBLINGS`), because a randomly drawn siege is settled after the description draw (r2r-metropolis-14) | 13/6 · 24/12 · 55/28 | pending |
| L2.famine.meat | the food record's no-herds-and-nothing-comes-in vs `stoppedBy('famine')`, which stops only the failed source | `crisisStoppedRow.js :: noHerdsHere`: under a siege, the meat of a town whose food sources name no livestock and whose pastoral chain is off is stopped | 4/2 · 0 · 8/4 | pending |
| L2.famine.work | the famine's "no one can earn a normal living" vs the cobbler lines, which were declared colour | by line: the cobbler's three lines declare the famine, each with a twin (two struck from the colour column) | 1/1 · 1/1 · 0 | pending |

All six rules together, before: sixty 33/9 · 720 54/19 · fresh 300 107/39.

- **Named exclusion (page detector, `law2.mjs`):** under `L2.siege.abroad`, the record's own account of the past printed as a tension (`history.currentTensions[]` and `historicalEvents[]`). Measure rule 2 applies: the past states its own fact. It covers 1 instance in the 720 (r2s-under_siege-city-2). The line is `historyData.js`, which is no file of mine.
- **The guard:** `tests/domain/bar5MarksLaw2.test.js`, with its detector `tests/helpers/pageLaws/law2Marks.mjs`. It reads the same six rules off the born record and the mark leaf.
  - (a) The zero over the census's 720.
  - (b) Positive controls, with the marks read blind: r2s-under_siege-metropolis-0 (abroad), r2r-metropolis-14 (cutgood), r2s-wartime-metropolis-0 (animals).
  - (b) Constructed controls: a calm city (r2r-city-0) with the war's two lines written on, which are the read's C8174 and C8475; and a twin's original written back, the cobbler (C43575) and the bowyers (C5452).
  - (c) The paddocks line is still the pool's own line.
- **LAW 5 (my files), static inventory:**
  - Before: 71, by the audit's own inventory at the base. That is 47 by the widened inventory at the base (W1 to W6), and 26 once the reviewed exclusions are applied too.
  - After: **0**.
  - The widenings of `law5-inventory.mjs`, each where it misread:
    - W1: a text in two channels declares the union.
    - W2: a line declaring another fact is still covered by its row.
    - W3: the catalogue's own descriptions belong to their house.
    - W4: each class reads its own crisis's row words.
    - W5: a twin is read in its original's row.
    - W6: a service row carries its house's dependence.
    - Plus 17 reviewed exclusions, each with its reason, in `EXCLUDED_LINES`.
  - The lexicon controls read as the audit's: 11 of 12 caught, the same miss (C0927).
  - The widening also lowers other files' counts: 158 to 134 of 244 undeclared at the base. This is a change of the instrument, said here for the seats that read it.
- **C42840 ("Collects the lord's dues and the tithe")** is cured: it is reworded to "Collects the dues owed and the tithe" (LAW 4, seat BAR5-PEOPLE's detector).

## The net

- **Red at 600b7683a (named, not chased):**
  - colourMarks4h (1)
  - tailHouses1Gaps (1)
  - generationForkCensus (3)
  - pipelinePinnedMode (3)
  - tieProseDeclared (2)
  - observedShapeReaders (4)
  - presumedThings (1)
  - proseCorpusBytes (2)
  - proseTasteCorruption (1)
  - proseWiringCensus (12)
  - tuningRegister (1)
  - writerReach (6)
- **At tip:** pending.

## The books my cures move (pending the tip net)

- `tests/generators/houseDescLateReRead.test.js`, "the table": the count `DESC_LATE_SIBLINGS` goes 11 → 26 (my 15 late twins).
- `tests/data/colourMarks4h.test.js`, "the descriptions": the colour column goes 492 → 490 (the cobbler's two lines now declare the famine).
- `tests/generators/institutionProseDeclared.test.js`, "each definition carries exactly the ledger's declaration": the ledger row of "Tithe and dues" now has the new text.

## FOR THE OWNER, IN PLAIN WORDS

Pending.
