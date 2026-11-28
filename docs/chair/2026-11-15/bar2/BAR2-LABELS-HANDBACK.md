# BAR2-LABELS hand-back (2026-11-15)

Base: the joined line `lane/join-2026-11-14` at **f8042b61a**. Branch: `lane/bar2-labels-2026-11-15`. All work was done in a scratch worktree. Nothing was merged: the chair's "MERGE THE LINE" has not come yet, so the books (F2) have **not** been run after a merge.
I am handing back by budget before LB2, LB4 and the rest of LB6.

## The rulings I worked to (the chair's, 2026-11-15; each can be vetoed by the owner)
LB0 to LB6, as written in `docs/chair/2026-11-14/briefs/BAR2-LABELS.md` on `lane/chair-2026-11-08`.

## Batches

| batch | commit | rows | measure on the census's 720 at f8042b61a |
|---|---|---|---|
| 1 LB0 | dbfa6a8d9 | (the close's patch, applied as built) | "Magical practitioners are consulted…": printed in 147, false in 9 → 0 false, and 9 print the twin. DECLARED MOVE: 9 towns, one family (`powerStructure.factions`) |
| 2 LB1 + C1229 | 96c47e43f | C0031 C15424 C15425 C20948 C11391 C17170 C22429 C17182 C25208 C1229 | display only. Reliance word moved in 38 towns (Relied upon→None 22; Integral→Relied upon 12; →Present 4). Role rows "absent" now left out where the record holds the role: economic 40, military 33, medical 23. Headline word: every magic page (720). Arcane Support twin: 41 of the 488 towns that printed it |
| 3 LB3 LB5 LB6-timber | c4cc22e46 | C4306 C14738 C15234 C16557 | DECLARED MOVE: 34 towns, 2 families: `economicState.incomeSources` 22 (timber false 21→0); `economicState.safetyProfile.safetyDesc` 12 (siege with no force 12→0). LB3 prints in **0** of the 720; on the town it was read in (bar0-city-under_siege+famine-rand-5, Smuggling 51%) it now reads Concentrated |
| pins | (this commit) | — | three rows in other seats' tests re-keyed by identity, each with a dated note (see "the books") |

How the rows were verified: by script over the before census's `corpus.ndjson.gz` (720) and over a 30-town corpus of the read towns (bar0-*-rand-3/4/5). The scripts are under the seat's scratchpad (`pr/lb1.mjs`, `lb1m.mjs`, `b3m.mjs`, `famdiff.mjs`). Every batch's guard was shown red at f8042b61a and green at the tip.

### The premises, measured (as the rulings asked)
- **LB1 truth table** (720): "Relied upon" with no practitioner rests on food made by magic (50 towns), on one arcane chain (spellcasting 172, magical goods 75 or more, divine healing 61, across all readings), or on a chain note. The class that was false is a **chain note the card does not print**: the note's tradition is not held, or it is a food note with no provision. Those notes no longer count. A made spellcasting service still counts ("what magic does"). The reader's C0031 is therefore cured on its roles ("Economic role: absent" beside a made service), not on its word.
- **"Moderate" (C11391…)**: the headline was the envelope's *availability*: low, raised one step by an arcane house. It was true as availability and false as the level. As ruled, it now prints the record's level band (Low/Medium/High). The availability prints one line below it.
- **LB2 premise is wrong on the 720**: **no** town with no wall, garrison, militia, watch or hired force rates Invasion & War Strong or Adequate. The Adequate prints come from a lone adventurers' charter hall (6 towns, e.g. r2r-village-18: military 51), a watch, or walls with a militia in a hamlet. The display's band reads `scores.military` faithfully. Deciding whether those parts may rate Adequate is a record question. **Not cured: parked** (a draw-free cap in `defenseGenerator.js` would be a declared move; no measure taken yet).

## EVERY NEW OR CHANGED LINE (for the owner's veto)
- `claimStanding.js` ARCANE_WITHOUT_PRACTITIONERS (2 lines, as the close built them): r2r-metropolis-10, -13, -15.
- `defenseDisplay.js` ARCANE_NONE_WITH_SERVICE "No arcane practitioner stands with the defence. Wards, detection and counterspell are beyond its defenders.": r2r-village-12, r2r-village-14, r2r-village-23.
- Magic tab headline: the level word (Low / Medium / High): every magic page, e.g. r2r-city-14 (Low), r2r-thorp-8 (Medium), r2r-thorp-4 (High).
- `safetyLineTruth.js` SIEGE_NO_FORCE_ORDER "No one is set to keep order here, and it frays as the food runs down.": r2r-thorp-58, r2r-hamlet-0, bar0-hamlet-under_siege-rand-4 (all under siege).
- `incomeLineSiblings.js` TIMBER_SAWN_LINE "Local forest provides timber revenue, and the timber is sawn here.": r2r-village-11, r2r-town-11, bar0-metropolis-calm-rand-3.
- `prosperity.js` LB3: no new line (an existing band): bar0-city-under_siege+famine-rand-5.
- Silenced by design: the role rows "absent" listed above (96 rows, more than 20 towns). This is the file's ruled form: a row that cannot be made true is left out.

## Rows named or parked
- **LB4 (C6890 C25137 C27195, REST C9161)**: the field is `defenseProfile.economicGates.military`, sent to the chair. The four lines read config dials instead (`pri.economy`, `resolvedMilPriority`). Not cured.
- **LB2 (C2730 C30315 C32534)**: parked, as above.
- **LB6 rest**: C26982 (chainNeedShown "grain brought in"), C2572 (herbs "Fully exploited"), C23858 ("The table rests on salted fish."), C3396 ("exploits it:"), and C23849 (fold 0) are not yet verified or cured.

## THE BOOKS MY CURES MOVE (F2: partial; the merge has not come)
- Sweep of 106 test files (the close's 22 partial reds, the patch's own test, and every test naming a file I touched), run at base and at tip, one file at a time: **93 files at base and 87 at tip had run by 15:10 UTC**.
  - Reds at both (carried from the joined line, not mine): editWorldFactResources, mergeLadderHeldKeys, recordMerge, townCartographyCalibration, worldFactRederive, generationForkCensus, institutionBudgetPromise, nameHeldThroughAssembly, pipelinePinnedChoosers, pipelinePinnedMode, powerEconomyFreshness, rosterFinalUnderHeldRoster, x46NpcBand.
  - **A LAW my batch 2 turned red, cured** (commit after d1e7b3f9e): `tests/lint/chainPrintSites.walker.test.js` (no file reads a chain's name outside the lists). My new leaf read `chain.label` for counting. It now reads `chainId`: the dependents are counted and never printed. Medical parity was checked on the 720: no chain's label says "heal" where its id does not.
  - Three new reds at the tip, all caused by my ruled cures. They are re-keyed in the pins commit with dated notes:
    - `tests/components/displayEconFlowsMagicFood.test.jsx` r2r-village-25: KEEP and anchor "Reliance on magic: Relied upon" → "…: None". The reliance rested on the very note that test says the card does not print.
    - `tests/components/displayEconRelianceFoodWords.test.jsx`: the same row.
    - `tests/domain/display/dossierViewModel.test.js`: display 'Moderate' → 'Medium' (the headline is now the level).
- Goldens: batches 1 and 3 move the record (9 + 34 towns of the 720). The generator golden master and the espionage fence will red. **How many of the 525 reference configurations move is NOT measured**: owed.
- The after census and the inventory diff (E): **not run**; owed. The before census is in the seat's scratchpad (`runs/before`).

## Guards
`tests/generators/power/arcanePractitioners.test.js`, `tests/components/bar2MagicWords.test.jsx`, `tests/generators/bar2RecordLines.test.js`.

## Instruments
`git archive` of `docs/chair/2026-11-14/probes/{READ-ALL,CENSUS-3}`. Run `census3.sh <tree> <out> 4` for the 720, and the same with `--seeds` for the 30 read towns (bar0-*-rand-3/4/5). Run `births.mjs` alone for record diffs.
