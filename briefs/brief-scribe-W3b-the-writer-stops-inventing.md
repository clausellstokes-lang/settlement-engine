# Brief — SCRIBE W3b: THE WRITER STOPS INVENTING; A FACE FALLS ALONE; THE READERS REPORT WHOLE
(chair Fable 5.1, 2026-09-14 ~14:2x; the owner: "continue the scribe work to completion"; the corpus is PAUSED and the Scribe is the only lane)

Same dock, same laws, same gate as `brief-scribe-W3a-one-prompt-tier1.md` (read it, and read `SCRIBE-SIM-2026-09-14.md` RUN 2 whole — the measurement this brief cures). Dock `$SC/kit/lane-scribe` at `2f63200d8` (sealed `refs/preserve/scribe-w3a-2026-09-14`), porcelain 0. Harness `$SC/kit/scribe-harness`. Never stash/checkout/reset --hard, never push, never touch package.json, deno with `--no-lock --no-check --allow-env --allow-net` for tests and `--no-lock --node-modules-dir=none` for check; commit by pathspec after `git diff --cached --stat`; the gate after every car; quote it verbatim.

## THE MEASUREMENT (RUN 2: 16 cells × Opus + Sonnet, 377 units, an Opus second reader per pair)
Tier 0 keeps 91–95 % of what is written and `CORPUS-DIFF` never fired (W3a's cure worked; ruling 27: the order arm stays FAIL). The SECOND READER refuses ~70 % of units, and its reasons are real additions the card does not hold — the measured classes, each with the reader's own example:
- ABSENCE asserted on a NULL read: "nothing here is being built and nothing sold off" (`prosperityRank = null`); "no goods come in" (every read null).
- ORIGIN / HISTORY of a body: "carts stopped on this spot before any stall did, and the stalls came afterwards"; "the market took root where the carts already stopped".
- A NAMED CONTEST between bodies with `conflict.intensity` null and no relation row ("The Governing Council" against "The Order of the Watch").
- A PRACTICE behind a boolean: `hasGranary=true` → "grain they would rather have sold", "filled by the trades and not theirs to open"; `hasHospital=false` → "nursed by the inn servants"; `hasCourtSystem` → "the court's business waits on the parish".
- A VERDICT the card's own rows cut against: "no through-traffic" beside a Caravaneer's post, a Carriers' guild, a Customs house, a Post relay station.
- COLLECTIVE BELIEF and HABITUAL SPEECH about neighbours on a card with `hasWorld=false` and no neighbour.
Actor and forecast drew almost nothing (26 and 12 lines): the roster and the no-future bar hold. Final shipped: Opus 51/198, Sonnet 60/198; power 13 %, economics 21 %, overview 33 %, defense 35 %.

## THE CARS (one commit each; gate after each; the W3a gate list plus `node simulate.mjs build --seed render-town --tab power --type town` printing without error)

### CAR 1 — THE WRITER'S BARS, FROM THE MEASURED CLASSES (`scribeBrief.js`, the global brief)
Replace the single PLAUSIBLE-ADDITION paragraph with a section headed THE SIX WAYS A LINE INVENTS, AND IS REFUSED, one short rule and one refused example each, in the brief's own register (no em dash, no digits):
1. A NULL FIELD IS UNKNOWN, NOT ABSENT. "Where a field on the card reads null, the engine has not decided it. You may not say the thing is absent, small, quiet or unchanged; you may not say anything that would be false if the field were later filled either way. A pool whose fields are all null or whose reads are absent is OMITTED, and the hand corpus draws it."
2. NO ORIGIN. "Nothing on the card has a beginning you were told. No body, market, road, custom or arrangement came before, grew from, took root, was founded, was sited or was chosen. The record holds what stands."
3. NO CONTEST THE CARD DOES NOT NAME. "Two bodies are at odds only where a relation row on the card says so; a rank, a share or a standing is not a quarrel."
4. A BOOLEAN IS A FACT, NOT A PRACTICE. "Where a field says a thing stands (a granary, a church, a court, a wall), you may say that it stands and what a person meets at it. You may not say how it is run, who fills it, who is let in, what is owed, what waits on what, or what is done for the sick, the poor or the accused, unless a field on the card says that too."
5. NO VERDICT THE CARD'S OWN ROWS DENY. "Before you write that a town lacks a thing, read the institutions and holders on the town block; if a row names it, the town has it."
6. NO NEIGHBOUR, NO REALM, NO ROAD BEYOND THE CARD. "Where `hasWorld` is false, no other settlement exists for this page: nobody speaks of neighbours, of what is said elsewhere, of what comes down the road from anywhere named."
And ONE POSITIVE RULE, placed first: "When the card gives a face nothing to stand on, write the CORPUS FACE VERBATIM at that seat. A copied corpus row is never refused: it already ships. A pool with nothing lawful to say in its spine is omitted."
Keep the ladders note and the corpus-line standing. Add the same six bars, condensed to one line each, as a `THE READER'S EYE` preface to the tier-1 checklist so both seats hold one law.

### CAR 2 — THE CARD SAYS WHAT IS UNKNOWN AND WHAT IS UNWRITEABLE (`townCard.js`, `scribeBrief.js` poolBrief)
- `poolRow.fields[]`: where `value` is null/undefined, print it in the turn as `= UNKNOWN (the engine has not decided this; assert nothing that depends on it)` and set `unknown: true` on the field row.
- Per pool, `writeable: boolean` computed on the card: false when every field is unknown AND the pool's `static.reads` are empty or all resolve to nothing on this town, or when the pool reads only campaign/world state and `town.hasWorld` is false (the `capture none` / faction pools the reader called "unwriteable on this page"). Print `THIS POOL IS NOT WRITEABLE ON THIS TOWN: omit it` in the turn for such pools. Test: on the pinned town the count of unwriteable pools per tab is asserted, and no writeable pool has all-unknown fields.
- The two-ladders note and the funding-note truth ALSO go into the town block (they are facts of the page every seat reads), not only the global brief.
- Golden re-record with only the new keys moving; say which.

### CAR 3 — A FACE FALLS ALONE; THE READERS REPORT WHOLE (`scribeBrief.js` judgeUnits/applyTier1; harness `simulate.mjs`)
- ROW-LEVEL FALLBACK: a tier-0 FAIL or a tier-1 yes on a FACE replaces that face with the corpus face at the same seat (`pool.unit.faces[i]`), and the unit ships with a verdict row `PATCHED` naming the seat and the arms; a FAIL or yes on the SPINE drops the unit whole (the spine is the fact). A notebook row that fails is dropped alone (the notebook has no corpus twin; `notebook` is `[]` on shipped pools today). Ruling 5/6's "a unit ships whole" is amended by the chair: a unit ships whole OR patched, never with a refused row. Tests: a unit whose face 1 is refused ships with face 1 = the corpus face and `PATCHED`; a refused spine still drops the unit; the artefact's `verdicts[]` carries `PATCHED` rows.
- VERBATIM-CORPUS ROWS ARE EXEMPT from tier 1 (a row byte-equal to the corpus spine/face at its seat is not sent to the second reader; it ships as the corpus). Tier 0 still runs on it (it is the corpus's own line and passes as the corpus does).
- ALL ARMS REPORTED: the product's `applyTier1` already carries every yes as an arm (verified); the harness `judge` printed only the first FAIL finding per unit — print every FAIL/WITHHELD arm per unit, and print `PATCHED` rows with their seat. The judge line gains `patched N`.
- `index.ts` and the artefact: `landBlock` carries patched units like any kept unit; the response gains `patched`.

### CAR 4 — THE CHECKLIST RIDES UNDER THE SAME LAW (`scribeBrief.js` buildTier1Checklist; `index.ts`)
- The checklist's user turn opens with THE READER'S EYE (car 1) and the ladders/funding truths; question 7 (SAME PAGE) says explicitly: "the badge word and the band are two ladders, both true; a line that agrees with the band is not a contradiction of the badge; a funding note at ninety-seven percent beside 'well-funded' is two fields, both true".
- Question 1 (CERTAINTY) re-worded to the measured class: "does the line state as decided something the facts leave UNDECIDED — an absence on an unknown field, an origin, a contest, a practice, a verdict the town's own rows deny?" Question 6 (MECHANISM) keeps its wording. (The seven arms stay seven; ruling 29 stands.)
- Harness: nothing new; the workflow already feeds the reader the two cached blocks.

### AFTER THE CARS
Report per car: sha, files, the gate lines verbatim (vitest totals; the pin 2756 where the corpus suites ran; scribe-bundle/exemplars/census --check; deno test/check), `simulate.mjs build` on render-town × {defense, power} printing the UNKNOWN/unwriteable rows, every JUDGMENT as "chose X over Y because Z", and anything you could not do. Do not seat model agents; the chair re-runs the grid (RUN 3) after you report.
