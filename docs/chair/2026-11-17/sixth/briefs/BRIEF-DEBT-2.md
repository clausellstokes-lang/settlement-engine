# BRIEF-DEBT-2 · three declarations the supply rule's landing owes (registers that follow the code; written 18:21 UTC, 2026-11-17)

You are SEAT DEBT-2 of the sixth chair (session_01FbPLbcLDSJzZFzb5B7EjxR). The owner's supply rule (BIRTH-3) joins the
working line as point 33. The whole check, compared BY NAME with the line's, shows three REGISTERS that follow the code
and were not brought along. You bring them along, each with the measure that earns its row. You change no behaviour.
This file is your whole assignment; rules N1, N2, N3, N6 and N8 of `docs/chair/2026-11-17/sixth/briefs/BRIEF-LEFT.md`
on the chair's lane (lines 20 to 58) bind you.

YOUR BASE: `lane/point33-candidate-2026-11-17` at e0242a12a82285a736f9997360ec1e8a5fbd3568 (tree 4a9735d2f9). YOUR ONE
BRANCH: `lane/debt-2-2026-11-17`. You merge nothing. THE TWO WHOLE CHECKS BY NAME: `git fetch origin
lane/checks-2026-11-17`, `docs/chair/2026-11-17/checks/line-ed1d43529/names.final.txt` (the line) and, when the chair
has published it, `.../candidate-e0242a12a/names.final.txt`.

## D1 · the generation fork register lacks two live pairs

RED AT THE CANDIDATE, GREEN AT THE LINE: `tests/lint/generationForkRegistry.contract.test.js` A2 ("the register declares
one row per live pair: expected 74 to be 76") and `tests/generators/generationForkCensus.test.js` A3e ("the measured
pair set is the registry's, not a literal: expected 76 to be 74"). WHY: BIRTH-3 DECLARED two writes that already
happened: `src/generators/steps/generateNarratives.js` gained `mutates: ['economicState']` (the birth writes its
words onto `economicState.primaryImports`) and `src/generators/steps/assembleSettlement.js`'s `mutates` gained
`'npcs'`. The register owes one row a live pair, each with the class ITS SOURCE earns under the register's own rules
(the contract's Tier 2 reads the source; read how the last rows were added: `git log -S` on the register's file).
Find the two pairs by running the contract, not by guessing. `generationForkCensus` A1, A4 and A6 are red at the line
too: STORED counts of the reference corpus, the close's: NOT YOURS.

## D2 · the held-key writer census sees a new declared writer

RED AT THE CANDIDATE, GREEN AT THE LINE: `tests/lint/heldKeyWriterCensus.walker.test.js` A2 ("a held-key writer step
appeared or retired": 14 rows live, 13 in `STEP_ROSTER`). The new row is the assembly step's write of `npcs`, a HELD
key. BEFORE YOU ADD THE ROW, MEASURE AND WRITE DOWN: (a) the write is at the line's ed1d43529 already, undeclared
(BIRTH-3's hand-back at your checkout, `docs/chair/2026-11-17/birth/BIRTH-3-HANDBACK.md`, AMENDMENT 1: `step
"assembleSettlement" wrote undeclared ctx key(s) [npcs]`): show it with the pipeline's contract probe in a scratch
worktree of ed1d43529; (b) UNDER A HELD ROSTER (a pin bag that holds `npcs`, in the form
`tests/generators/rosterFinalUnderHeldRoster.test.js` builds one) DOES THE ASSEMBLY'S WRITE CHANGE THE HELD ROSTER in
any row of the corpus that test walks? IF IT DOES NOT: add the row with a dated, measured note in the form of the
notes beside it, and move the two counts the arm pins only as the measure says. IF IT DOES: DO NOT ADD THE ROW. That
is a fault (a held roster rewritten at assembly): name it to the chair with one configuration and the diff of the
roster, and leave D2 red.

## D3 · the goods roster lacks one consumer

RED AT THE CANDIDATE, GREEN AT THE LINE: `tests/build/vendorPdfLazy.test.js` WEAVE ST-2 ("goods consumers absent from
the roster in src/domain/goods.schema.js — add a row for each: R | l | none | member |
src/domain/display/crisisStoppedRow.js"). One row in `src/domain/goods.schema.js`'s roster, with the eager flag, the
halves and the door THE TEST DERIVES (it prints the row it wants). Then ONE `npm run build` and
`npx vitest run tests/build/vendorPdfLazy.test.js tests/build/bootSmoke.test.js`: say what each reads (the build's
other reds at the line are named in the line's list: not yours). If the row would pin a module lazy that the eager
closure reads (ruling EG1), STOP and name it.

## Your files, and no other

The fork register's own file (the contract test imports it), `src/domain/goods.schema.js` (roster rows only),
`tests/lint/heldKeyWriterCensus.walker.test.js` (`STEP_ROSTER` and the counts of arm A2 only),
`tests/generators/generationForkCensus.test.js` ONLY IF arm A3e holds a figure that follows the register (say which).
YOU RE-TAKE NO STORED FIGURE of generated output (reference files, the golden corpus, counts of towns or lines).
`src/domain/display/crisisStoppedRow.js` is another seat's: you do not touch it.

## Your net and your hand-back

Each alone through `sh scripts/gate-tail.sh`: both type gates; `npx eslint` on your changed files;
`npx vitest run tests/architecture`; ALL of `tests/lint` by name at your base and at your tip (N2: `comm` the two
lists; only your three arms may leave, none may appear); `tests/generators/pipelineContract.test.js`,
`isolatedTrade.test.js`, `pipelinePinnedMode.test.js`, `generationForkCensus.test.js` (N3: say what each reads at base
and tip). THE HAND-BACK: `docs/chair/2026-11-17/close/DEBT-2-HANDBACK.md`: one row a register (the rows you added,
word for word; the measure that earns each; base and tip of each test), then what you left by name. ONE message to the
chair of at most 120 words. NEVER a pull request, `--no-verify`, a force push, master, a deploy. Budget: 250,000 of
your count.
