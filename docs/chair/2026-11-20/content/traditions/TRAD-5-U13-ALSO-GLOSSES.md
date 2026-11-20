# TRAD-5 · UNIT 13 · STEP ONE — THE SIXTEEN "ALSO" GLOSSES (FOR THE CHAIR'S EYE; NO CODE)

Written 2026-11-20 20:57 UTC (`date -u`) by a builder seated by TRAD-5, on
`briefs/TRAD-5-U13-SAME-SUBJECT.md :: ADDENDUM 1` (the chair's ruling of 20:56 UTC: cure (B)). Proposed, not built:
no file under `src/` or `tests/` changes in this step. Vetoable by the owner.

## HOW AN "ALSO" LINE JOINS

`src/domain/traditions/traditionDescription.js :: compose` builds S1 as `` `${lead} that ${glossText}.` `` (lead from
`src/data/traditionDescriptionTable.js :: ACT_LEADS`, every lead a singular noun phrase; gloss from `:: ELEMENT_GLOSS`). Each
proposed line is shaped as a present gloss is, a verb phrase that follows "that", with "also" before the verb:
"A procession on foot that also honours the first boats to come ashore."

Each proposed line is ONE of its element's present lines, verbatim, with "also" before it (the same honoured thing,
nothing added). On the pattern of `src/data/traditionDescriptionTable.js :: KEEPER_FRAMES_TOO`, it is NEVER A PICK. It is
held apart from `ELEMENT_GLOSS`, so a rite described alone, or the first rite of its element in the shown set, never reads
it. Only a LATER rite reads it: a rite whose element an earlier rite of the place's shown set already holds.

## THE SIXTEEN

| element | present gloss lines (verbatim) and their declarations | proposed "also" line and its declaration |
|---|---|---|
| founding | "marks the founding", "honours the founding", "remembers the founding days": each `colour: true` (`plain`) | "also marks the founding": `colour: true` |
| first-landing | "marks the first landing", "remembers the first landing", "honours the first boats to come ashore": each `needs: ['navigable']` | "also honours the first boats to come ashore": `needs: ['navigable']` |
| charter | "honours the charter", "marks the granting of the charter", "remembers the charter": each `colour: true` | "also honours the charter": `colour: true` |
| hearth | "honours hearth and household", "blesses hearth and home", "honours home and family": each `colour: true` | "also honours hearth and household": `colour: true` |
| harvest | "gives thanks for the harvest": `excludes: ['crisis: hunger']`; "is held for the harvest": `twinOf: 'gives thanks for the harvest', crisis: ['any']`; "marks the gathering of the harvest": `crisis: ['any']`; "gives thanks for what the fields have given": `excludes: ['crisis: hunger']`; "is held for what the fields give": `twinOf: 'gives thanks for what the fields have given', crisis: ['any']` | "also marks the gathering of the harvest": `crisis: ['any']` (no twin needed; see below) |
| river | "honours the river", "blesses the river", "honours the river and its waters": each `needs: ['river']` | "also honours the river": `needs: ['river']` |
| stone | "honours the standing stones", "honours the old standing stones", "stays true to the standing stones": each `colour: true` | "also honours the standing stones": `colour: true` |
| the-dead | "remembers the dead", "honours the dead", "remembers those who came before": each `colour: true` | "also remembers the dead": `colour: true` |
| field | "blesses the fields", "honours the fields", "blesses the furrows": each `colour: true` | "also blesses the fields": `colour: true` |
| forge | "honours the forge", "blesses the forge", "honours the smith's craft": each `needs: ['institution: smith']` | "also honours the forge": `needs: ['institution: smith']` |
| market | "celebrates the market", "honours the market", "blesses the market and its trade": each `needs: ['market']` | "also honours the market": `needs: ['market']` |
| hunt | "honours the hunt", "blesses the hunt", "marks the hunting season": each `colour: true` | "also honours the hunt": `colour: true` |
| long-sun | "marks the long days of high summer", "marks midsummer", "honours the long summer sun": each `colour: true` | "also marks midsummer": `colour: true` |
| tide | "honours the tide", "blesses the tide", "honours the sea and its tides": each `needs: ['coast']` | "also honours the tide": `needs: ['coast']` |
| greening | "welcomes the year's new growth", "marks the coming of spring", "honours the first green of the year": each `colour: true` | "also marks the coming of spring": `colour: true` |
| stars | "is held under the stars", "honours the stars", "marks the courses of the stars": each `colour: true` | "also honours the stars": `colour: true` |

## WHERE THE DECLARATIONS DIFFER: HARVEST ONLY

Fifteen elements declare the same thing on every present line: `colour: true` for founding, charter, hearth, stone,
the-dead, field, hunt, long-sun, greening and stars; one shared `needs` for first-landing, river, forge, market and tide.
Each "also" line takes that same declaration, so it presumes exactly what its element's lines already presume.

Harvest (`CRISIS_SCOPED_ELEMENTS`) differs line by line. Two lines give thanks and `excludes: ['crisis: hunger']`, each
with a `crisis: ['any']` twin. One line, "marks the gathering of the harvest", declares `crisis: ['any']` and stands
alone. The narrowest common ground is that line: it gives no thanks, so no crisis family refuses it and it needs no twin.
PROPOSED: "also marks the gathering of the harvest", `crisis: ['any']`, no twin. In its crisis-scoped pool it is safe
under every crisis and under none.
NOT PROPOSED (named so the chair can choose it instead): "also gives thanks for the harvest", `excludes: ['crisis: hunger']`,
with its twin "is also held for the harvest", `twinOf` that line, `crisis: ['any']`. That would be two lines and a twin
rule where one line serves.

## THE LAWS, CHECKED BY GREP

A scratch check (outside the worktree) held the sixteen lines against the walker's own lists, copied verbatim from
`tests/lint/traditionDescriptionFrames.walker.test.js`: `CAUSE_WORDS` (with "goes back"), `DRAMA_WORDS`, `KEEP_FORMS`,
`OUTCOME_WORDS`, plus `/\b(the|a) town\b/i` and `/\{/` (no placeholder, so no house or person can be named). It ran at
2026-11-20 20:57 UTC with exit 0. Results:
- 16 of 16 keys match `ELEMENT_GLOSS`, in its order.
- Every line minus its "also" is one of its element's present lines, verbatim (16 of 16). No new feeling, nothing the
  record does not hold.
- 0 lines hit any list. No cause word, no drama word, no "kept"/"keep"/"keeps", no outcome word, no "the town"/"a town",
  no name.
- Each of the 30 `ACT_LEADS` lines was joined with each of the 16 lines as `compose` joins them (480 first sentences).
  None says a form of "keep" twice, so unit 9's bar holds: the leads' single "kept" ("A feast day kept by custom",
  "A vigil kept through the night") meets no second one.

Two things for the chair to see; neither is proposed here:
- A THIRD rite of one element reads the same "also" line as the second. Unit 10's bar still holds, because S1 as a whole
  never repeats (element+act never repeats, so the leads differ). Calm: 137 later rites in 95 places, so 42 of them are a
  third or later rite of their element.
- A later rite of a held element whose keeper is also held reads "also" in S1 and "too" in S2
  (`KEEPER_FRAMES_TOO`), e.g. "A vigil that also honours the forge. It too is in the keeping of …". Both are true and
  quiet.

## WHAT THE CURE MOVES

From `out-trad5/SAME-SUBJECT.txt` (unit 13's measure, the "later rites of a held element" column):
- calm pool: 137 of 1,232 descriptions (thorp 1, hamlet 1, village 0, town 8, city 40, metropolis 87);
- visitor pool: 82 of 1,256.

Owner and reader are alike to the place in both pools. Each moved description changes only its S1 gloss; nothing in
genesis moves (CTR3).

## WHAT A BUILDER THEN DOES

A builder adds, in `src/data/traditionDescriptionTable.js`, an `ELEMENT_GLOSS_TOO` table, one declared line per element
as above, held apart from `ELEMENT_GLOSS`. In `src/domain/traditions/traditionDescription.js :: compose`, S1's gloss reads
it only when an earlier rite of the audience's shown set holds the same element.

There is one thing a builder must add for this. The ledger `compose` already threads for unit 10's rotation (`taken`,
made once a set in the set's loop) holds printed SENTENCES, not elements. Also, `traditionDescription.js :: drawTurn`
rotates only over pools of colour lines, and five of these lines declare `needs`. So the set needs its held elements
threaded beside `taken`; a rite alone (null) reads as today. The "also" line goes through the one declared draw (`draw`),
with harvest still crisis-scoped. Where that line is refused (its `needs` unmet), the rite's present gloss stands. Then:
- `tests/lint/traditionDescriptionFrames.walker.test.js` adds the table to `rows()`, so the cause, drama, keep-twice and
  outcome bars cover it.
- The declared-line and presumed-things walkers read it as they read `ELEMENT_GLOSS`.
- A domain test pins that the first rite of an element and a rite alone never read "also", and that a later one does.
- The census rows that count S1 wordings are updated at their own doors.

All of this is by explicit paths, with no genesis change and no register beyond what the chair rules.
