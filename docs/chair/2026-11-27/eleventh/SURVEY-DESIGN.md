# THE SURVEY: THE DESIGN (S1; the eleventh chair, 2026-11-28; written from the two measures and the owner's six messages)

READ FIRST: `SURVEY-CHARTER.md` (his six messages verbatim, each with the chair's reading). THE MEASURES: `survey/measure/`
(SURVEY-MEASURE, 06e8ab679: `REPORT.md`, `A-door.md`, `B-atoms.tsv`, `C-pools.tsv`, `D-failopen.md`, `E-clashes.md`,
`F-precedence.md`, `G-promise.tsv`) and `survey/voices/` (VOICES-MEASURE, 4fc044951: `REPORT.md`, `A-lines.tsv`,
`B-speakers.md`, `C-traits.md`, `D-ties.md`, `E-findings.tsv`, `F-towns/`). Every number below is theirs (1,800 rendered
pages of the corpora C and V on 682667fe2) unless said. NOTHING HERE IS BUILT. Vetoable by the owner in every part.

## 1. WHAT THE MEASURES CHANGED IN THE CHARTER's PICTURE (five corrections, all accepted)
1. FAIL-OPEN IS NOT THE LEVER. "A judgment the record cannot answer refuses the line" happens 43 times in 1,800 pages, in
   one pool; opening it prints 33 wrong lines for 5 right. Three atoms use UNKNOWN on purpose to silence a line and its
   twin. **UNKNOWN STAYS SILENT. Nothing is loosened.**
2. THE ENGINE ALREADY SAYS IT UNLESS RULED OUT: of 5,862 pool lines that print, 4,074 (69.5%) declare nothing and print
   freely; 161,557 refusals (91 a page) are 59.5% NOUN, 23.6% noun-and-judgment, 9.5% a state in force, 6.0% a judgment
   answered: the right kind.
3. THE CLASSES ARE FOUR, NOT TWO: NOUN 111, BOTH 35, STATE 46, JUDGMENT 22 (of 230 atoms).
4. THE PRINTED CLASHES ARE NOT TWO JUDGMENTS AT ODDS ON ONE RECORD. They are (a) LATE WRITES: a line answered at birth, the
   record moved after (29 pages: `prosperity: ≤ poor` beside a Comfortable rung, 23; a guild hook beside "no guild", 6);
   (b) CLAIMS WITH NO ATOM: "savings held" and "a place debt in force outside a crisis" (103 + 18 pages: point 122's cure B2
   takes these to 0 in code: `display/solvencyShown.js`, `SOLVENT_LINES`).
5. A RULE THAT WATCHES POOL LINES SEES A THIRD OF THE PAGE: 68% of sentences are composed by code or printed from the record.

## 2. THE RULE, AS BUILT FROM THAT
**THE RECORD IS THE ONLY ARBITER; THERE IS NO SECOND ARBITER BETWEEN LINES AT RUN TIME.** His rule ("if one thing is true
another cannot be": disqualifiers, not qualifiers) is realised so:
- A CLAIM is an atom of the fact vocabulary with ONE reader on the FINAL record. Two claims that exclude each other are
  written ONCE, in a TABLE OF EXCLUSIONS between atoms (`src/domain/facts/claimExclusions.js`, new: pairs or bands; data,
  no logic). The table is not consulted when a page is drawn. It does three things, all at test time:
  (i) it proves the READERS agree: no record of the corpora answers both sides true (a property over C, V and the goldens);
  (ii) it drives THE PAGE CLASH CENSUS: over the corpora, as the app renders, no page prints a line that stands on side A
  beside a line that stands on side B: **target 0, a ratchet of its own, the release's number for the promise**;
  (iii) it is what a line's `excludes` is checked against by a walker (a line that asserts A declares A).
- So a line yields because THE RECORD refuses it (its own `needs` / `excludes`), never because another line printed first.
  THE HARDER CLAIM STANDS by construction: the softer line is the one that declares, and it falls to its twin, the next
  admitted line of its pool, or nothing (the door as it is: `facts/drawDeclared.js`).
- NOUNS stay as they are (fail-closed; 83% of refusals).
- **THE ORDER OF HARDNESS (F-precedence, accepted) is the order in which a claim gets its atom and the softer side its
  declaration:** a state in force; a stored figure or roster; a computed grade or verdict; a live tension (a past event
  never clashes with the present: it sequences); a keyed prose line; drawn flavour. A quoted voice is outside the order.

## 3. THE SURVEYOR (his fourth message)
- EVERY UNMARKED SENTENCE IS HIS. Nothing is attributed to him; no "I". THE FRAME IS SET ONCE: one line at the head of the
  dossier and of the PDF (the chair's proposal for his veto: "A survey of <town>, as recorded."), and the promise's copy.
- HIS THREE KINDS ARE A CLASSING, NOT A RUN-TIME SWITCH: a RECORDING is a sentence composed from the record or printed from a
  record field (rank 1 to 3: it cannot be wrong of the record); a REMARK is a keyed or declared prose line (rank 5: it stands
  unless the record rules it out); an ANECDOTE is a colour line (rank 6: it claims nothing). The pool census gains a `kind`
  column, derived (code-composed and record fields: recording; a declaring line: remark; colour: anecdote) and held by the
  wiring census's own door. NO REWRITING OF HIS LINES: the visitor's-eye lines (19% of street prints), the unspoken and the
  chronicle are his as they stand.
- "SOFT PAIRS" STAY: "pays its way" beside a grade of Weak (238 and 101 pages) is a margin beside a shock: two true things.

## 4. VOICES (his fifth and sixth messages; the tenth chair's design; the voices measure's nine changes, all taken)
- **WHERE:** a quote sits INSIDE AN EXISTING CARD, ONE SLOT A CARD, one fixed place and style on every tab; on the card of
  THE THING IT IS ABOUT, signed "<Name>, <role>"; a person's own card may carry one line of their own. No card: no quote.
  THE CARD KINDS OF THE FIRST CUT (to be confirmed by the unit's measure against the components): an institution's card; a
  power's card; a current tension's card; a tradition's row; the crisis card; a person's card.
- **WHICH CARDS SPEAK:** decided BEFORE any line or speaker is chosen, by rank on the town's seed and the card's own id
  (`kernel/proseHash.js`, as point 121's picks: stable under pool edits), against a threshold by WEIGHT: the weightiest
  cards (a crisis, a severe tension, the ruling power) speak about three times in four; lesser cards about one in four;
  thorps and hamlets lower still. THE THRESHOLDS ARE NAMED TUNING VALUES IN THE TUNING INVENTORY, THE OWNER's TO SIGN.
  A HARD CAP beside them: three quotes a tab; ONE QUOTE A PERSON a page.
- **WHO SPEAKS:** the ranking of the tenth chair's design (the institution the subject belongs to; least-used first), with
  the measure's rules: the speaker is a NAMED person of the record whom THIS READER may see; a grievance is voiced by the
  aggrieved, never by an officer of the power it names; no public mouth ever speaks a line that names a criminal house
  (13 of 31 would today); no "unnamed voice" (31% of street lines have no subject: those stay the surveyor's); where no
  lawful speaker stands, the card is silent.
- **WHAT IS SAID:** SAID lines are WRITTEN FOR THE MOUTH, chosen by hand, in pools keyed by card kind and the card's state
  (a strained mill, a contested seat, a rite kept under a crisis): NOT every street line re-voiced. EACH LINE IN FOUR
  VERSIONS keyed on the person's STORED disposition (the measure refuted "read from traits": it is a stored field). THE
  MANNER is the person's STORED speech line (already unique per place up to 30 people): no new tag table. A SAID line may be
  skewed; it declares its NOUNS like any line (it names nothing the town lacks) and nothing else.
- **THE ONE LIAR:** at most one a place; a legitimate person with a criminal tie (`npc.allegiance`: 318 and 253 towns of 900
  hold one; none in thorps); the false line is about what the tie touches; chosen explicitly (the person and the line);
  MARKED FOR THE DM ONLY.
- **VIEW TIME, NOTHING STORED:** quotes are picked at view (no birth moves; a saved town gains them); every SAID line has an
  id, held by the id guard (`IMPORTED_POOLS`).
- **THE SHARED PAGE SHOWS NO QUOTE UNTIL THE VEIL LANDS (fail-closed, uniformly: no tell).** Whether a card speaks and who
  speaks read the roster; a quote that came and went with a hidden person would let a reader count what is hidden (the
  traditions draw taught this on 2026-11-28: ruling 122-T-2). The owner's page, the PDF and the Tonight sheet carry them;
  "VOICES-ON-SHARE" (the choice made on the floor, or stamped at publish) is a unit of the veil lane, last before release.
- WHAT VOICES DO NOT DO: they dissolve 5 of 38 known page findings and worsen none; 33 are faults in any voice.

## 5. THE UNITS, IN ORDER (each its own commit, red first; measure first where said; an independent reader on the top tier
before a point lands; landings as today: the joined tip's whole suite in shards)
| unit | what | kind | moves | seat-hours (a guess) |
|---|---|---|---|---|
| S-A THE FINAL RECORD | every declared line drawn AT BIRTH and stored is re-answered against the final record where it PRINTS (a view gate by the line's own text and pool; the presumption ledger's replay, `facts/presumptionCheck.js`, exists and only tests call it): the 29 late-write pages to 0; MEASURE FIRST which stored lines carry a declaration and how many pages each moves | engine, view time | pages only | 7 |
| S-B THE TWO MISSING CLAIMS | `reserves held` and `a place debt in force` become ATOMS with one reader each (lifted from point 122's `solvencyShown.js`; that file's callers move to the atoms), declared on the lines that assert them | engine | none (point 122 moved the pages) | 3 |
| S-C THE TABLE AND ITS CENSUS | `claimExclusions.js`; the readers' property; THE PAGE CLASH CENSUS as a ratchet at 0 with its own door; the walker that a line asserting a tabled claim declares it | tests, one data file | none | 6 |
| S-D THE FAMILIES | for each family of claims that can exclude: MEASURE (lines on each side, by reading; pages printing both), then declare the softer side, prove 0 on C and V. FIRST FOUR: money (after S-B: the residue), prosperity (late writes), food (plenty against want), safety (quiet against dangerous). THEN, only where its measure finds a page: trade, the seat's hold, labour, the powers' strength | view time | pages | 12 (first four); 3 each after |
| S-E THE KINDS | the census's `kind` column and its door; the frame line at the head of the dossier and the PDF | census, two components | every page gains one line | 4 |
| S-F THE PROMISE's COPY | the 81 places of `G-promise.tsv` read against the new promise; EVERY CHANGED LINE LISTED FOR THE OWNER's VETO BEFORE IT IS COMMITTED | copy | copy | 3 |
| S-G1 VOICES, THE ENGINE | the slot in six card kinds (screen, PDF, Tonight); which cards speak (the thresholds); who speaks (the ranking and its rules); the liar's choice; the DM's mark; ids and the guard; fail-closed on the shared page | engine, components | pages | 14 |
| S-G2 VOICES, THE LINES | about 110 SAID lines by card kind and state, each in four versions (about 440 sentences), and about 40 liar lines: WRITTEN BY A BUILDER, READ BY THE CHAIR LINE BY LINE, A SAMPLE OF 60 PUT TO THE OWNER | prose | pages | 10 |
| S-H READS AND LANDINGS | two independent readers (S-A to S-F; S-G); three landings with their shards and CI reads | | | 14 |
| S-I COLD-READ-20 | twenty towns read cold against the new promise; the bar is the owner's number | acceptance | | 4 |
**ABOUT 80 SEAT-HOURS (S-A to S-I; 86 if all four later families find pages). THREE TO FOUR DAYS at three builders at a
time. THE ACCOUNT's WEEKLY WINDOW IS THE BINDING LIMIT (it read `allowed_warning` at 23:47 UTC on 2026-11-27 and resets on
2026-12-04): the chair does not expect S-G to fit this week beside points 122 and 123 unless he turns on extra usage.**
THE ORDER IF THE WINDOW BINDS: S-A, S-B, S-C, S-D's first four, S-E, S-F (the promise made true: about 35 seat-hours); then
S-G (the voices: about 24) and S-H's second read; then S-I; then the share veil.

## 6. WHAT IS NAMED FOR THE OWNER (his hand or his veto)
- THE PROMISE's WORDS (the charter's point 4) and every changed line of copy (S-F).
- THE FRAME LINE's WORDS (S-E). THE SPEAKING THRESHOLDS and the caps (S-G1): tuning values.
- A SAMPLE OF SIXTY SAID LINES AND EVERY LIAR LINE (S-G2).
- THE PAGE CLASH CENSUS's number at the release (S-C): the claim the promise stands on.
- NO BIRTH MOVES ANYWHERE IN THE SURVEY as designed: nothing joins his golden signing from it.
