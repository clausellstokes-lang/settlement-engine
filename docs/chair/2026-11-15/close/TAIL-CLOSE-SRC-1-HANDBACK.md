# TAIL-CLOSE-SRC-1 — hand-back (kept current with each push)

Branch `lane/tail-close-src-2026-11-15`, cut from the joined line at `0be92717` (read back from origin).
Scratch tree outside the main checkout, its own `npm ci`. Births: RECORD-MEASURE-1's `births-only.sh` over
CENSUS-3's 720 seeds, the decompressed corpus hashed: base `d941b197471b1131`.

MOVING CHECK: the ten builder branches are all BEHIND the joined line (39 to 349 commits), so a two-dot diff marks
nearly every file as differing; I read MOVING as what a branch itself changed (three-dot, `join...branch`). By that
reading only `src/generators/safetyProfile.js` is moving (tail-display-civic). Everything else named in the list is still.

| # | red | state | commit |
|---|---|---|---|
| 1 | domainAnyCastBaseline (28 holes in 4 files) | CURED: real types; code byte-identical after comment strip; births identical; both tsc configs 0 introduced | `cbb1cb26c` |
| 1' | the same test's 5th red at this checkout | ENVIRONMENT: the clone is shallow, so `introducedAt` shas resolved to no commit; green once fetched. Not the tree's | — |
| 5 | paradigmAxisCatalog roster | CURED without enrolling: the file never imported the catalog; its local `MODIFIER_WORDS` (a catalog symbol name) tripped the symbol arm; renamed `WORDS_OF_MODIFIER` | `9b32f3112` |
| 6 | servicesStructure (402 > 400) | CURED: `hasCriminalInstitution` moved to `services/serviceRollMaterialization.js` (one home for the keyword list); 383 lines | `0950495d2` |
| 2 | rawColorLiteral (1209 > 1206) | CURED: the three are NOT in ResourcesTab (its two strings hold a hex inside a longer string, which the counter does not count); measured per file 653678e77 -> tip: all three in `src/pdf/sections/SupplyChainFlow.jsx`'s NO_STATE (SURFACES-1 item 1, b6f5d459b), now `swatch['#HEX']` from design/tokens.js, the same strings | `508b611e6` |
| 3 | noLegacyFactionReaders: SummaryTab :37, :49 | CURED: both read the ruling powers; the OTHER_SHAPES rows had drifted a line (5e511271f's import). `w` -> `ps` (POWERS_RECEIVER), FactionBar's prop `factions` -> `powers`; the two dead rows leave the core | `29eec3efb` |
| 3 | noLegacyFactionReaders: safetyProfile.js:820 | LEFT: MOVING (tail-display-civic changes the file). The read is `crimeSignalOf(lists).factions.length`, the crime signal's own powers list (the class the core's `crimeSignal.js:91` and `defenseDisplay.js` rows name 'the crime signal'); to finish after SWEPT | — |
| 4 | defenceFactReaders: 3 court-gate + 1 first-member reader | NAMED, not cured: STOP. Both registers' `_doc` say "no row is ever added", and none of the four lines routes through the home with the same value without re-deciding: (i) `chainNeedShown.js:76` (f9b957cbd, TAIL-DISPLAY-ECON 2) tests a printed SERVICE string for "gate" against `defenceOf`'s gate/walls, read on the line above (generationCoherence's banked agreement-arm shape); (ii) `governanceNarrative.js:361` (8dad2e567, POWERS-13) `hasCourt: Boolean(instFlags.inst.hasCourtSystem)`, which IS the home's answer through the flag bag (`priorityHelpers.js:82 hasCourtSystem: home.hasCourt`), counted only because the ASSIGN arm wants it spelt `home.`; (iii) `governanceNarrative.js:735` (a5a9e4372, TAIL-POWERS-3 2) `seatIsMilitary` tests the ruling POWER's NAME for "garrison" (another sense); (iv) `narrativeGenerator.js:531` (b52481302, TAIL-NARRATIVE 1) `hasCivicHall` by catalog id incl. the three court ids (the label-join freeze; the home reads names off the live roster, so not the same value). Court-gate total 18 of a never-rising 20, first member 73 of 77: banking all would also break the court-gate cap. The chair's door | — |
| 5 | (above) | | |
| 7a | recordRegisterTotality A7 (magicDef) | NAMED: `83883baaa` feat(UPKEEP-CAPACITY C6): the alchemist's shop and quarter are a trade, not retained casters (the chair's G5): green at its parent e22308d24, red at it. A DECLARED move (G5) | — |
| 7b | defenseTabFlow STOP-2 premise (alchemist as arcane defense) | NAMED: the same `83883baaa` (red at it, green at its parent) | — |
| 7b | vocabularyPageFindings planted `house: alchemist` | NOT the same cause: green at 83883baaa, already red at 653678e77 and at both parents of 6aeaa4154 (STYLE-2-MERGE point 46: line 3575cf061 and COHERENCE-POWERS 313c67e2b); 83883baaa is on neither. Cause not found inside the budget | — |
| 7c–7e | siteCoherenceRatchet, newsHeadline/Voice, tierInertiaEnvelope | NOT REACHED (budget) | — |
| 8 | style-law lines in running seats' files | not mine unless the chair says | — |

PROOF CARRIED BY EACH COMMIT: the red test alone before and after; every test file naming a touched file, base vs after, the same
failing set except the cure; eslint on the touched files; `tsconfig.full.json` 167 and `tsconfig.domain-strict.json` 1899 errors at
base and after, 0 introduced and 0 removed (message-normalized); the 720 births byte-identical after every commit
(`d941b197471b1131`). No twelve-birth page-grid instrument was found in the probes named; for the display files the code is
byte-identical after a comment strip (items 1) or the values are the same strings (items 2, 3, 5).
