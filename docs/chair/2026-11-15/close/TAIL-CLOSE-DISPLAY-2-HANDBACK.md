# TAIL-CLOSE-DISPLAY-2 — hand-back (current at each push)

Branch `lane/tail-close-display-2026-11-15`, succeeding TAIL-CLOSE-DISPLAY-1 at 71ac99969. First act: the joined line
merged at ae50369d4 (70f7635c, clean); the line moved to ceeaeec8 (it touches red 9's file), merged again (6f39cb2a,
clean). Work in a scratch clone with its own `npm ci`. Every red run alone at the merged tree first: all nine red.
Bisect: each file over the joined line's first parent from d817736d8 (green there for reds 1-8; red 9's file joins the
line at fp 55, 412938baf), the version of the test file each point holds; docs-only points skipped.

## The nine

| red | file | turned at | verdict |
| --- | --- | --- | --- |
| 6 | incomeRowsBorneOut.test.js (1) | fp 23, 390168d6b (JOIN-7 · 26, lane/tail-defecon-c at ea788e17c): TAIL-DEFECON-C-2's D25 pin (28f86423, anchor "Agricultural Rents" in r2r-thorp-24) met TAIL-DEFECON-2's DECLARED move D10 (df2fa5ca, already on the line at fp 21: the rents row is titled "Harvest" where no lord's steward or reeve stands) | RE-KEYED by identity: the same town, the same row under its D10 title ("Harvest") |
| 7 | institutionProseDeclared.test.js (1) | fp 87, 679e52b01 (JOIN-8 · 26, lane/tail-display-civic at c2f053333): TAIL-DISPLAY-CIVIC-4's DECLARED V6 rewording (d5839e51: the council's Dispute adjudication row reads "Hears the town's civil pleas at the council bench", was "… in the town court") left the declarations ledger's row on the old text | RE-KEYED by identity: the ledger row `Town council\|Dispute adjudication` takes the reworded text (the precedent: e35851db and 5c1e94f5 carry their rewordings into the same ledger); its needs/excludes/crisis unmoved. The 13 test files that read `docs/census/declarations/` green |
| 9 | tailDisplayCivic3V1.test.js (1) | born red on the line at fp 55, 412938baf (JOIN-8 · 10, lane/tail-display-civic at 6cf555801): green at its own commit 1f030877; the joined line already held TAIL-CORPUS-DEF-2's DECLARED rewording of DS-POW-4 Critical v1 (51217c0e: "Nothing at … protects the {seat} now. {counterpart} has the strength …" → "The office no longer shields the {seat} at {settlement}: against a move by {counterpart}, holding the title will not be enough."). r2r-metropolis-50's record is unmoved (the same factions and governance account at both ends); only the line's wording | RE-KEYED by identity: the same town, the same vid, the pair COMPUTED through `tests/helpers/drawnProse.js` as TESTS-C's two (raw label / the leaf's form); the cure holds ("by The Guard", never "Military/Guard") |
| 8 | tailDisplayCivicBatch2.test.jsx (2) | fp 66, d700bda44 (JOIN-8 · 16, lane/tail-powers-b at 4ff449a7b): TAIL-POWERS-B-2's DECLARED move c1263e61 (withConflictRelations: a symbiotic or dependent pair the conflicts hold at HIGH takes the quarrel's twin, direction 'escalating'); r2s-occupied-town-3's merchants-and-craftsmen row is today P31's twin (d99bce57, DECLARED, JOIN-9 · 15, 470ff0a7). The batch-2 cure holds: no "stable" chip prints beside a HIGH quarrel at any of its towns; the pair now carries the record's own "escalating" | RE-KEYED by identity: the two cured rows' "what prints" is the pair with its record chip "escalating"; r2r-metropolis-31's keep is its pair's present chip ("escalating", was "declining"); the declining arm kept in r2r-city-10 (The Highborn Circle↔Merchant Guild Council, dependent, "declining"), a town the guard already births |
| 3 | gapReadsPrintedImports.test.js (3) | fp 25, 4b19b7446 (JOIN-7 · 27, lane/tail-defecon-r at a515e1b54): TAIL-DEFECON-R's DECLARED move M-V (fcf4cae6: grapes and glass sand reach their house by any route; vintner 184 → 11, glassblower 13 → 1) took the gaps the three towns' live arm read (r2r-city-30 and r2s-politically_fractured-city-2: grapes; r2s-plague_onset-town-0: glass sand). The forbidden arm held at all three (no gap names a good that arrives) | RE-KEYED by identity: each town replaced by the nearest of its own shape (size, crisis) whose page still prints a gap the lists name, from a scan of r2r-city-0..40 and the two crises' 1..15: r2r-city-28, r2s-plague_onset-town-5, r2s-politically_fractured-city-4 (clay to the brickmaker/potter); both arms kept. NAMED, not mine: the Imports line still prints "grapes" / "glass sand" as NEEDED (no trade brings them) where M-V reads them as reaching by route (M-V's own commit names the import-list join for the economy seat) |
| 2 | journalPrintsTheTabsLeaf.test.js (1) | fp 72, 3e482b329 (JOIN-8 · 19, lane/tail-defecon-c at 849bd8679): TAIL-DEFECON-C's DECLARED D34 (a) (680d16b54: the hot springs no herbs; "12 herb cards gone (true)"): r2r-thorp-0's herbs were its springs'. Proven alone: D34 (a)'s resourceData.js hunk reverted at the merged tree turns reds 1, 2, 4 and 5 green | RE-KEYED by identity: r2r-thorp-9, the nearest thorp (scan 0..19) whose Exploitation table names the herbs by the tab's leaf; the NOT arm kept |
| 5 | resourceAnalysisCoupling.test.js (1) | fp 72, 3e482b329: D34 (a) (680d16b54, DECLARED): rr2s-metropolis-calm-rand-1 files no herbs, so the test's own `herbs.value` read an absent row (the TypeError is the test's, not the page's: reverting D34 (a)'s data hunk alone turns it green). No birth of the shape (a full herbs row beside a depleted herb ground) in 270 towns; no other good of the town shows the coupling (rand-10's empty reason is the "no house named" arm: it stays empty with rule (2) disabled) | RUNS ON A MADE RECORD (the chair's V16 (a), vetoable): this file's own `generateResourceAnalysis` reader, a forest town with an ancient grove and herb gathering grounds and the chain's two houses (Apothecary, Alchemist shop): grounds depleted → reason ''; KEEP: grounds live → "Complete production chain in place". Red-first: with rule (2)'s `sourceDepleted` off the arm reds. The #457 half stays on its birth. FOR THE OWNER'S VETO LIST |
| 4 | chainWorksThroughItsTrade.test.js (1) | fp 72, 3e482b329: D34 (a) (680d16b54, DECLARED): r2r-village-38's herbs were its hot springs'. No birth of the shape (clergy chains read as working the springs' herbs) in 270 towns; r2r-village-125 (clergy at the springs beside another ground's herbs) prints its line with NOT_WORKED_THROUGH's clergy entry switched off, so it guards nothing | RETIRED BY NAME (the chair's V16 (b), vetoable): the births line "clergy r2r-village-38" only, with D34 (a) and the scan written in the test; the palisade and walls births lines and the unit arm (which reds with the clergy entry off: measured) untouched. FOR THE OWNER'S VETO LIST |
| 1 | resourceGradeReadsChainLeaf.test.jsx (1) | fp 72, 3e482b329: D34 (a) (680d16b54, DECLARED): rr2s-metropolis-calm-rand-1 files no herbs (they were its springs'). No birth of the shape in 270 towns (rand-27, rand-108: Full beside a live grove that works them, true). Two made records in the file's own shape read Full by design (the only herb ground spent: the model is silent, the filing stands), so V16 (a) has no honest build here | RETIRED BY NAME (the chair's V16 (b), vetoable): the births test "P1-a … (rr2s-metropolis-calm-rand-1, #1160)", with D34 (a) and the scan written in the test; the unit arm guards the same branch (its record filed Full groups as Unexploited too: measured) and stays untouched. FOR THE OWNER'S VETO LIST |

## Proof

Each red run alone before (red, the counts above) and after (green); eslint clean on every touched test; the hook's
type ratchet (167/167), strict-domain gate (1113/1113) and lint green on every push (red 6's push went out from a side
worktree without the hook: the three gates were run on that exact commit, 9a13dd0a, after: all exit 0). The 13 files
that read `docs/census/declarations/` green after red 7. No source file changed by this seat: the page and the grid
move by nothing here.

## Named, not mine

- The Imports line's NEEDED list still prints "grapes" and "glass sand" where M-V (fcf4cae6) reads them as reaching by
  route (r2r-city-30, r2s-plague_onset-town-0, r2s-politically_fractured-city-2); M-V's own commit names the import-list
  join for the economy seat (`src/domain/display/tradeListDisplay.js :: importsAsPrinted` reads
  `resourceAnalysis.imports.critical`).
- `src/domain/facts/chainWorking.js` NOT_WORKED_THROUGH's clergy entry: no birth reaches it since D34 (a) (the unit arm
  keeps it guarded).

## For the owner's veto list (V16)

- red 5: #1163 runs on a made record (V16 a).
- red 4: the births line "clergy r2r-village-38" retired by name (V16 b).
- red 1: the births test "P1-a … rr2s-metropolis-calm-rand-1, #1160" retired by name (V16 b).

HANDED BACK.
