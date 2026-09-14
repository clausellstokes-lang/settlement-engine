# Brief — SCRIBE W3d: THE WRITER SEES THE PAGE, AND THE ROSTER SEATS THE BODIES THE PAGE NAMES
(chair Fable 5.1, 2026-09-14 ~16:5x; the corpus is PAUSED; the Scribe is the only lane)

Same dock, laws and gate as W3a/W3b (read both briefs and `SCRIBE-SIM-2026-09-14.md` RUN 3 whole). Dock `$SC/kit/lane-scribe` at `fdc980f4c` (sealed `refs/preserve/scribe-w3b-2026-09-14`), porcelain 0.

## THE MEASUREMENT
RUN 3: Opus ships 84 %, Sonnet 78 %; 28 contradictions in ~1,400 lines. 24 of the 28 are PAGE contradictions — the line denies a machine line the WRITER NEVER SAW, because W3a's turn shape dropped the card's `page` rows from the writer's turn (they reach only the second reader). 8 are ROSTER — mostly bodies the pool's own fills name (factions, circles, councils, named relationships) that the town block's roster does not list, so the reader calls them unseated; two are real (a guild where the row is a workshop; "the returns" / "the books" as records — the corpus's own spine names "the season's returns").

## THE CARS (one commit each; the W3a gate list after each; `simulate.mjs build` on render-town × {defense, overview} and sim-hamlet × overview quoted)

### CAR 1 — THE WRITER'S TURN CARRIES THE PAGE (`scribeBrief.js` buildScribeUserTurn)
After THE STATE THIS PAGE READS and before THE LINES TO WRITE, print `THE PAGE AS THE READER MEETS IT` — every `card.page` row of kind `badge`, `machine` and `row` (never the composed rows, which are the corpus lines the writer is replacing), in page order, as `[kind] label: text`, with one sentence above: "These lines are printed on the same page as yours. A line of yours that denies one of them is refused; a line that agrees with the band where the badge word differs is not (the two ladders)." The town block is unchanged. Test: the turn contains the crisis summary and the guard assessment of the pinned town; the composed rows are absent from that section.

### CAR 2 — THE ROSTER SEATS THE BODIES THE PAGE NAMES (`townCard.js` townOf; `scribeBrief.js` town block)
`town.bodies` (new, sorted, byte-stable): every named body the page can name — the faction rows the engine holds for this settlement (`factionDynamics` / `politics` names as the card already reads them for the pool fills), the named parties of `prominentRelationship`, the named circles/councils of the conflict rows, and every `{hall}`-shaped fill value the pools' `slots.fills` carry — each `{name, kind, source}` with `source` naming the row it came from. The town block prints them under `THE BODIES THIS PAGE NAMES` with the sentence "a body here may act and speak; a body not here may be named only as the corpus line names it". `refuteUnit`'s REFERENT-body/role arms and the checklist's ROSTER test read `town.bodies` in addition to `roles`/`institutions`. Golden re-recorded with only `town.bodies` moving. Test: on the pinned town the Governing Council and the Order of the Watch are in `bodies` with their source row.

### CAR 3 — THE RECORD AND ROSTER TESTS GRANT WHAT THE CORPUS LINE ITSELF NAMES (`scribeBrief.js` buildTier1Checklist)
The checklist's RECORD and ROSTER questions add: "a record, office or body that the pool's own corpus line names (printed beside the facts) is granted"; the checklist prints the corpus spine and faces per pool beside the unit's lines (it already prints the facts). Test: a line naming "the season's returns" on DS-DEF-3 is not a RECORD yes by construction of the prompt (assert the grant sentence and the corpus line are present).

### CAR 4 — THE THREE CARD DEFECTS THE READER FOUND ARE PINNED AS REPORTS, NOT CURED
In `townCard.js`, a `pools[].caveats[]` row (REPORT, never a refusal) where: a pool's every read is null AND the pool key is a non-default state (the `STALLED trade` case); a `structure null` key fires beside an `Internal Security` badge that reads Dangerous; a `flagDriven count zero` key fires on a town whose `historicalCharacter` names an occupation or a conquest. Printed in the turn as `CAVEAT: …` so the writer writes the key without asserting the reading the page denies. Each with a pinned control on a town where it fires. These are corpus/engine findings and go to the ledgers by name in your report.

Report as before: sha, files, gate lines verbatim, the build outputs, JUDGMENTs, anything undone. The chair runs RUN 4 after.
