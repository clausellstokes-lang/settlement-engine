# THE LAWS' JOIN: THE MEASURE FIRST (CLOSE-1 unit 3; written 2026-11-22 08:08 UTC, read from `date -u`; on the join scratch 4bba8781d)

All CONFIRMED by reading the merged tree (git grep and node), unless marked.

1. **`birthConfig` (src/domain/density/densityCreateBoundary.js :: birthConfig).** Each lane added the SAME three
   things and nothing else: an import of its law's key and mint, a clamp (`[SEAT_LAW_CONFIG_KEY]: _incomingSeatLaw`,
   `[FORTUNE_LAW_CONFIG_KEY]: _incomingFortuneLaw`) and a mint spread (`...newSettlementSeatLaw()`,
   `...newSettlementFortuneLaw()`), with a doc paragraph each. The union (seat first) is in the join; node:
   `birthConfig({_seatLawVersion:2,_fortuneLawVersion:2,a:1})` gives `{"a":1,"_densityLawVersion":2,"_livingContentLawVersion":2}`.
   No lane touched another line of the boundary.
2. **`GENERATION_LAWS`.** One row a law: density, livingContent, seat, fortune, each `wiring: 'WIRED'`. Both
   new rows' `why` says "THE DIAL IS DARK": the flip must rewrite both, as the living-content row was rewritten the
   day it was lit, and each lane's wiring test arm 4 ("GENERATION_LAWS.<law> is a WIRED row that says the dial is
   dark, and why") is on the flip's list.
3. **What pins a new place's birth.** THREE tests pin `birthConfig(null)`: `tests/domain/livingContentLawWiring.test.js`
   (the CREATE (LIT) arm), `tests/domain/seatLawWiring.test.js` arm 1 and `tests/domain/fortuneLawWiring.test.js` arm 1
   (each copies the living-content arm's value). COMMON-RULES 14 (c) wants exactly one. At the flip, all three move
   at once.
4. **The saved-place tests.** SAVED-SEAT, `tests/domain/seat/seatLawSavedTown.test.js` (608 lines; arms 1 to 6;
   `vi.mock` hoisted with a `dial.lit` switch over `seatLaw.js` AND `seatCircumstances.js`; one seed
   `saved-seat-12`). SAVED-TOWN, `tests/domain/fortuneLawSavedTown.test.js` (465 lines; arms 0 to 6; `vi.doMock`
   over `fortuneLaw.js` with the graph re-imported per version; seed `saved-town-metropolis-0`). The two
   harnesses differ in shape. Arms both have: NO MIGRATION (dark stays 1), THE CONVERSE (lit stays 2), "Apply Saved
   Configuration & Regenerate" is a birth, THE LEGACY EDGE, THE IMPORT, a re-derive road. Only seat's: both
   transfers, the tick re-derive (arm 6). Only fortune's: the surveyor's unminted preview (arm 3), the full reroll (4b).
   Neither lights the OTHER law: no test walks a town with both dials lit.
5. **The atom `seat contested`.** NO SUCH ATOM IS ON THE JOINED TREE: `git grep -F "seat contested"` finds one
   test title only (`patronContest.test.js`), and no vocabulary, registered-word or class-table row names a
   contested seat. The page's risk word is `src/domain/rulingPowerCoup.js :: coupRiskLabel` (Holding, Contested,
   Critical. The seat could fall), read by `EngineSections.jsx` and `powerDeskRead.js`. The record's side is
   `factionStanding`'s `contestedBy` and `coupContenders` (law 1's `contestedBy` is a birth fault U6, SEAT-B,
   cures: E42). So item (1)'s last test has no atom to pin today: FOR THE CHAIR (the atom is either a pool's declared
   need to be added by SEAT-B, or the test pins `contestedBy`-non-empty == `coupRiskLabel` in {Contested, Critical}).
