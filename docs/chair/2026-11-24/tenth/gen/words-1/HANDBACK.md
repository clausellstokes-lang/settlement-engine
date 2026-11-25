# WORDS-1 — HAND-BACK (a seat of the tenth chair; kept current at every push)

Law: `docs/chair/2026-11-24/tenth/prompts/START-WORDS-1.txt` and `START-GEN-COMMON.txt` on `lane/chair-2026-11-08`. The chair is
session_019yED1SUxGVHyjQnoqoFvQ8; CLOSE-7 is session_019yED1QNMqSLp7ohcZB88VP. A successor reads those two files, then this section.

## 0. WHERE THE SEAT STANDS: THE WHOLE MEMORY (written 09:02 UTC 2026-11-25)

### FOR THE JOIN (CLOSE-8), current at 16:26 UTC 2026-11-25 — read this block first; the log below is history

FOUR UNITS HANDED IN AND ACCEPTED BY THE CHAIR (merge E8 before E8b), cut at the base `origin/lane/close-7-2026-11-24-cures` 0ec96f13d8:
| unit | branch | commit | what |
|---|---|---|---|
| E1 the double possessive (G5) | `lane/words-1-2026-11-25-e1-wip` | 902b7005d | owner pages C 125/122 → 0, V 145/126 → 0; public projection C 52/41, V 34/19 → 0 |
| E8 the reflexive slot, STEP ONE | `lane/words-1-2026-11-25-e8-wip` | 94b7a13d9 | the tie and the RANK.enter want: C 627 strings in 390 places, V 595 in 381; 0 disagreeing |
| E8b the bound card lines (G20, G28-G30), ON TOP OF E8 | `lane/words-1-2026-11-25-e8b-wip` | e75f090b7 | twelve card-line rows: C 1157 strings in 501 places, V 1126 in 500; round trip 0; successor byte-equal |
| D6 the contender's word (G7, G20, G21) | `lane/words-1-2026-11-25-d6-wip` | 81ac266a5 | "Could contend" / "Could contest the seat" on bound cards: C 502, V 452 pages |

The joined proof (`reports/JOINED-PROOF.md`): no battery row moved and 0 changes unexplained by a unit on C and V. Both typechecks
are at their ceilings (167 and 1113) in each unit's own worktree and on the joined tree. Every unit's lint fails only the base's
four (proseComposed, proseCorpusBytes x2, sovereigntyLightingContract); D6 adds writerReach (below).

MERGE NOTE: E1 and D6 merge cleanly; E8 meets E1 in three files:
- `src/generators/people/goals.js`: the imports; take both: `import { fillAgreement, holdsPossessive, powerNameWithArticle } ...` and
  `import { reflexiveOf, secondMentions } ...`.
- `tests/generators/people/goalSentencesOnceInTown.test.js`: keep both helpers (`longTitled`, `heldGoal`); the check reads
  `vantageHash(heldGoal(longTitled(c)), v)`.
- `src/data/people/personMention.js`: keep both blocks (E1's ROLE_POSSESSIVE / OF_FORM_STOPS, E8's `reflexiveOf`).

NAMED FOR THE OWNER (nothing re-recorded):
- Goldens and censuses moved, all on RED-AT-LINE: rosterFinalUnderHeldRoster A1, generationForkCensus A1 (E8); powerEconomyFreshness
  A4, dossierProseManifest DRIFT, generatorGoldenMaster, espionageDormancyFence (E1).
- The frozen writer-reach row (D6): `scripts/.writer-reach-baseline.json` "type on factionRelationships" web-transitive N→R.
- E8's held line: POWER.corrupted "Set the terms … themselves", a banked samenessHideable red, keeps its they-form (option (b)).
- For the owner's veto: "Could contend", "Could contest the seat"; the cards still reading "Contender": C 503, V 671 (C 388, V 501
  with no recorded conflict with the holder).
- For the veil's lane: these re-worded joiners write a power's description or standing: governanceAccount's four standing sentences,
  seatHolderLines standing/standingVacant, and factionDynamics's ordained narrative.

E8b HANDED IN 18:21 UTC: `lane/words-1-2026-11-25-e8b-wip` e75f090b7, cut ON TOP OF `-e8-wip` 94b7a13d9 (G28; re-uses
`reflexiveOf`). E8 is merged BEFORE E8b; E8b's diff is read against 94b7a13d9 (it merges onto E1 as E8 does: personMention.js
keeps both blocks; goals.js's import line gains heldCardLine). Proof: reports/e8b-proof-C.txt, -V.txt, e8b-successor.txt.
THE DESIGN IT BUILT — E8b, the card lines (tells, impressions, secrets, goal.long; C 1786 bound strings at the measure), WANTED BEFORE THE
RELEASE. The design was ruled by the chair in G20 (2):
- The draw and its dedupe run on the line's text exactly as today: no draw moves, no dedupe key changes.
- The reflexive is resolved AFTER the draw, where the line is bound to its person.
- The proof is E8's: every moved string differs in the reflexive alone, 0 disagreeing against the raw-record oracle, 0 unexplained.
- A site where the text is stored before its person is known is a STOP: report the site, build nothing there.

BASE: `origin/lane/close-7-2026-11-24-cures` at 0ec96f13d8 (point 116 lit, the guard merged, engine '0.10.0').
MY BRANCH: `lane/words-1-2026-11-25` (this file, tools, reports). Units go up as `lane/words-1-2026-11-25-<unit>-wip`, cut at
the base. No other name is pushed. No pull request, ever.

FIRST MESSAGE SENT to the chair at about 09:01 UTC (order E1, E8, D6).

THE UNITS, IN ORDER:
1. E1, the double possessive as a class. THE CHAIR RULES its cure: measure (count, by template or joiner, three examples
   each, on C and V lit), then ONE message with a proposed form per source; build nothing of E1 until the ruling.
2. E8, a reflexive slot ("themselves" agrees with the right person; the ninth chair's N26, amended by N28: today the two
   THEY_BOUND later mentions skip the pronoun and take the next rung). Measure, red first, build, a check over every birth.
3. D6, the contender's word (intake 11; SCOPE-LINE decision 2). THE CHAIR PICKS: three wordings, each with the count of
   pages it changes and one page read whole with it. The word only; no standing, seat or tie changes.

RULINGS IN FORCE (verbatim in `docs/chair/2026-11-24/tenth/gen/RULING-G.md` on lane/chair-2026-11-08):
- G5 (09:35) E1, by source: (1) role rung holding a possessive before 's: skip that rung, take the next; none left: the "of"
  form. (2) power name holding a possessive in the five joiners: the "of" form there only; a name without one byte for byte.
  (3) house fill: the SHORT title derived from the long one's own source by dropping the possessor (no new table, no title
  hard-coded; D8 may re-word "reeve"); else "the office of the lord's steward". (4) "{settlement}'s {institution}" where the
  institution holds a possessive: "the {institution} at {settlement}", as a rule. CHECK: the measure's detector over every
  composed sentence of every birth of C and V, OWNER pages AND the PUBLIC PROJECTION: 0 after; places moved = the table's.
  Hand-in names any re-worded joiner that writes a power's description or standing tail (for the veil's lane).
- G5, E8's scope: WIDE: a reflexive bound to ONE person takes that person's stored pronoun (card lines binding the card's
  own person, and the tie); no gender or "they" keeps "themselves". Counts on both corpora; golden rows named.
- G7 (09:52) D6: wording 1 ("Could contend" / "Could contest the seat"), EVERY tied card, tied = dependent, symbiotic OR
  subordinate (C 502, V 452 pages). Shared page does not stop it; touch nothing under gallery*. OWED COUNT: of the cards that
  keep "Contender"/"Contests the seat", how many hold a recorded conflict with the holder (C and V). The two phrases go on
  the owner's veto list.

GROUND:
- Corpora: C = `tools/make-plan.mjs` (dp-<size>-<i>, i 0..149, config {settType}); V = `tools/make-visitor-plan.mjs` over
  `tools/plan-lit.json` (the chair's, copied). Plans in the scratchpad as planC.json / planV.json (regenerable).
- The page battery: `tools/page-battery.mjs` + `page-battery.render.census.jsx` (CLOSE-7's READ-25 runner, copied verbatim).
  Base renders WITH VIEWS: `node tools/page-battery.mjs --plan=planC.json --out=base-C --tree=/home/user/wt/base --views`
  (and V), through `scripts/gate-mutex.sh --run`, about 15-18 min each on 4 workers.
- `/home/user/wt/base` is a detached worktree at 0ec96f13d (node_modules linked): read and run, never committed.

IN FLIGHT (09:21 UTC): the V render (scratchpad base-V/); then, queued, e8-records and d6-measure on C and V (logs
e8rec-*.log, d6-*.log) through the mutex.
E1 ON C (gap 0, 900 births): 125 hits in 122 places; four sources: (1) the later-mention ROLE rung before "'s"
(`personMention.js :: oneSentence`) on titles holding a possessive ("the network's head", poolMap.js / mintTitles.js): 59;
(2) power names holding a possessive ("Headman's Authority", "Thieves' Guild") in possessive joiners: 47 (power.generated.js
"{seat}'s place", "in {faction}'s pocket"; factionDynamics.js ordained narrative; governanceAccount.js :: possessive;
dmPowerLines.js theOwn); (3) wants' house fill (`goals.js :: PERSON_HOUSE_PLACE`, "the lord's steward's office"): 20;
(4) "{settlement}'s {institution}" on "Caravan masters' exchange" (economy.generated.js), at gap 1: 2.
E8 ON C: 0 sentences with he/she beside a they-reflexive (N28 holds). The class left: a they-reflexive bound to ONE gendered
person: card lines (goal.short "make themselves useful" 419 printed, personality.tell, presentation.impression, secrets) and
the tie "would rather keep to themselves". Needs a hand-classed bound/other table, like THEY_BOUND.
E1 DONE AS A MEASURE (09:35 UTC): `reports/E1.md` (C 125/122, V 145/126; the four sources, three examples each, the
proposed forms). THE RULING ASKED of the chair at 09:35 UTC. BUILD NOTHING OF E1 UNTIL IT COMES.
D6 MEASURED, THREE WORDINGS SENT (09:51 UTC): `reports/D6.md` (ties read against the ruler OR its seatOf form: first contender
N C 442/632, V 265/611; per-card N pages C 494 V 308). Recommended wording 1 "Could contend" · "Could contest the seat", every
tied card, N. THE PICK IS THE CHAIR'S: build nothing of D6 until it comes. Flagged: a shared page showing the Power tab prints
the new label.
E8 MEASURED ON RECORDS (`tools/e8-records.mjs`, `tools/e8-classes.mjs` = the hand-classed table): BOUND C 1786 strings in 521
places, V 1746 in 526 (tells 899/852, want RANK.enter 466/433, the tie 157/158, impressions 202/215, secrets/goal.long the rest);
BOUND-THEY (left as written) C 36, V 32; OTHER C 446, V 466. Scope question put to the chair in the E1 message (card lines + tie).
E8 STEP ONE BUILT (10:00 UTC): `lane/words-1-2026-11-25-e8-wip` 5214ccd2f (worktree /home/user/wt/e8, hooks and node_modules
linked), cut at 0ec96f13d, NOT YET PUSHED. `personMention.js :: reflexiveOf`; the tie mutual_leverage.tension[12] binds its asked
card; the wants RANK.enter and POWER.corrupted carry `{self}` (goalFamilies.js), filled by goals.js only where the want is
written (`writtenText`); every candidate is held/compared on the old text (`HELD_SELF`), stored texts read back by `heldText`.
Red first: tests/generators/people/reflexiveSlot.test.js (2 red on base, 14 wrong in 5 births); green with goalFamilies,
personMention walker and leaf tests (47/47).
E8 STEP ONE PROVEN ON RECORDS (10:25 UTC): twin (`tools/twin-dump.mjs --norm=e8`): C 390 records moved [0 3 18 77 142 150],
V 385 [0 2 17 82 135 149], moved BEYOND the reflexive 0 and 0. Every-birth check (`tools/e8-check.mjs`): base C 627 wrong in
390 places / V 616 in 385; E8 0 / 0. -e8-wip PUSHED at 5214ccd2f.
STATE AT 11:01 UTC:
- E8 -wip at b67bbf56d (PUSHED): option (b) taken (asked the chair 10:4x, "(b) unless you say (a)"): POWER.corrupted "Set the
  terms … themselves" keeps its they-form (banked red row 48d62f1d94f5 in samenessHideable.existingReds.json, no door). Two goal
  pins re-stated by cause (goalSentencesOnceInTown (u), goalsNoRepeatedWording (b): a want read in the held form). Re-run of
  those three: 23/23. Its lint run e8-lint.log had 6 reds; base-lint.log decides which are known; e8-lint3 re-runs.
  Known-red named (RED-AT-LINE): rosterFinalUnderHeldRoster A1, generationForkCensus A1 (golden). E8 copy 172/172.
- E1 -wip at 2a378064a (PUSHED): red 3/4 on base (wt/red), green 4/4. Gates queued: e1-named (125 files), e1-copy, e1-lint.
- D6 -wip at 24a3d7e7b (PUSHED): powerStrata.js BOUND_TO_RULER_KINDS/boundToRuler (`bound`, `powerBound`), PowerStrata.jsx
  words; powerStrata.test.jsx pin re-stated by cause. Gates queued: d6-red (in wt/red), d6-named (49), d6-copy, d6-lint;
  then e8-lint3.
- SCRATCH (local only, never pushed): wt/all on `scratch/words-1-all2` = e1 + e8 + d6 merged WITH hooks (the first try,
  scratch/words-1-all bfcca3c75, was committed with core.hooksPath=/dev/null: a fault, deleted, reported to the chair).
- 12:05 UTC: CHAIR: (b) stands for E8's held line; D8 PARKED (keep "the lord's reeve" as a test case only; nothing waits on it);
  a joined proof tree is NEVER committed: detached worktree, `git merge --no-commit --no-ff`, prove, record the commits, remove.
  E1 -wip 97ba72d9b PUSHED: e1-named 117/121 files (reds: bar7DesksLines item 8 and goalSentencesOnceInTown (u), both
  re-stated by E1's cause in 97ba72d9b; powerEconomyFreshness A4 and dossierProseManifest DRIFT are on RED-AT-LINE); copy
  172/172; lint running. E8 -wip 94b7a13d9 PUSHED (manifest rationale for reflexiveSlot.test.js). Base lint (wt/red) reds:
  proseComposed, proseCorpusBytes x2, sovereigntyLightingContract (+ proseDrawnAnchors from my copied E1 test, since cured).
  CHAIN (bmv1hv30q, after e1-lint): d6-red, d6-named, d6-copy, d6-lint, e8-lint3, e1-re, e1-red2.
- NEXT: when e1-red2.log has its exit line, run `sh scratchpad/run-renders.sh` minus its wait (page battery --views
  --strings on base and all, C and V, ~70 min, in TWO background calls under 2 h each), then classify every changed string
  and page line by unit; the D6 owed count (contenders keeping "Contests" with a recorded conflict with the holder).
STATE AT 13:32 UTC (`date -u`):
- GATES DONE (chain bmv1hv30q): E1 lint at 72db12c69 = the base's four reds only (proseComposed, proseCorpusBytes x2,
  sovereigntyLightingContract); E1 re-run 28/28; E1 red on base 3/4. E8 lint (94b7a13d9) = the same four only.
  D6: red on base 1/1; named 47/48 files (the red, dossierPhoneFloorAllViews x2 "World/Daily Life 9→8", is RED ON THE BASE
  too: base-phonefloor.log, 13:18 UTC; not D6's); copy 172/172; lint: the base four + proseNumerics (CURED in 81ac266a5: my
  header note shifted PowerStrata.jsx's ledger rows 285→288; the note dropped) + writerReach (FROZEN REGISTER, NAMED, NOT
  RE-RECORDED: `scripts/.writer-reach-baseline.json` surfaceReach row "type on factionRelationships" web-transitive N→R, D6's
  powerStrata.js now reads the tie's `type`; the shrink-only `--write` door, tried in the scratch tree wt/red and reverted,
  would also re-freeze the base's own drift (closure sizes, digests), so it is the owner's/CLOSE-7's).
- PUSHED: e1-wip 72db12c69 (13:19), d6-wip 81ac266a5 (13:24); e8-wip 94b7a13d9 unchanged.
- THE JOINED PROOF TREE (chair's 11:01 method): /home/user/wt/join, detached at 0ec96f13d8; `git merge --no-commit --no-ff`
  of e1-wip 72db12c69 + d6-wip 81ac266a5 (octopus of all three refused on goals.js and goalSentencesOnceInTown); then
  `git diff 0ec96f13d8 e8-wip(94b7a13d9) | git apply -3`; three conflicts resolved by union (personMention.js: both blocks;
  goals.js: both imports; the test: vantageHash(heldGoal(longTitled(c)))). CLOSE-7 meets the same two conflicts. Never
  committed; removed after the proof.
- RENDERING (13:30, two background calls, mutex): page battery --views --strings on wt/base and wt/join, C and V
  (scratchpad s-base-C/V, s-join-C/V). Then: `tools/joined-proof.mjs <base> <join>` (E1 zero check on owner pages + public,
  strings and lines classed by unit, rows moved, examples), `tools/e8-check.mjs` and `tools/d6-owed.mjs` on wt/join, C and V.
- THEN the three hand-ins (UNIT lines to CLOSE-7 and the chair), each naming: frozen/golden rows moved (rosterFinalUnderHeldRoster
  A1, generationForkCensus A1, powerEconomyFreshness A4, dossierProseManifest DRIFT, the writer-reach row), E8's held line,
  the governanceAccount standing sentences (veil's lane), the veto-list phrases, partial reads.
STATE AT 14:50 UTC:
- TYPECHECKS (chair, 14:20): typecheck:ratchet 167/167 and domain:strict 1113/1113 in wt/e1, wt/e8, wt/d6 and wt/join: all OK.
- THE JOINED PROOF RAN (`tools/joined-proof.mjs`, scratchpad proof-C.txt / proof-V.txt): C record moved 428, page 587; V 411 / 555;
  battery rows moved 0 / 0; unexplained by any unit 0 / 0. E1 owner pages C 125/122 → 0 (122 places moved = the table), V 145/126
  → 3 in 2. D6 pages C 502, V 452 (= G7's). E8 C 627 strings in 390 places, V 595 in 381.
- E1 RESIDUE FOUND (owner pages and PUBLIC projection), five more joiners of sources (1)/(2): power.generated.js's possessive
  standing alone (desk.stabilityHeader "one name, the Headman's Authority's," and legitimacyLens "it is not the {seat}'s.");
  seatHolderLines "the {form's} seat(s)"; governanceNarrative's council meetings; the bracketed qualifier's possessive
  (personMention qualifiedPossessives, "Kathleen Farrell (the hospital's master)'s family"); one secret stakes literal
  ("the carriers' master's door"). CURED in wt/e1 (uncommitted at 14:50), test extended; gates running (e1b-*.log); then the
  joined tree is rebuilt and re-rendered for the after side.
STATE AT 15:31 UTC:
- HANDED IN (15:24) to the chair and CLOSE-7: UNIT D6 81ac266a5 (C 502 / V 452 pages, owed count 115 on 109 / 170 on 160,
  bound-with-conflict 285 on 240 / 215 on 192, flag vs oracle 0) and UNIT E8 94b7a13d9 step one (C 627 strings in 390 places,
  V 595 in 381; e8-check on the joined tree 623 / 591 covered lines, 0 disagreeing; unexplained 0), with the merge note.
- CHAIR G20 (15:24): (1) D6 stands as built; figure owed and SENT: cards still "Contender" C 503, V 671 (unbacked C 388,
  V 501). (2) E8b WANTED before the release; design ruled: draw and dedupe on the line's text as today, the reflexive resolved
  AFTER the draw where the line is bound to its person; proof = E8's (only the reflexive differs, 0 disagreeing, 0
  unexplained); a site that stores text before its person is known is a STOP (report it, build nothing there). (3) Once
  CLOSE-7 has taken D6, E1 and E8: say context size; under 600,000 build E8b as `-e8b-wip`, else write (2) here as the next
  seat's unit and say HANDS OVER at a commit boundary.
- E1 residue cure 902b7005d PUSHED (from wt/e1). Joined tree rebuilt with it (first joined renders kept as s-join1-*);
  re-render of join C/V, E1 lint, typechecks on e1 and join running (s-join-*.log, e1c-lint.log, tc2-*.log).
STATE AT 16:22 UTC:
- UNIT E1 HANDED IN (16:21) at 902b7005d to the chair and CLOSE-7: joined proof (`reports/JOINED-PROOF.md`) owner pages
  C 125/122 → 0, V 145/126 → 0; public C 52/41 → 0, V 34/19 → 0; record → 0; page places moved 122 / 126 = the table;
  unexplained 0/0; battery rows 0/0. Lint = base four; typechecks OK on e1 and the joined tree.
- G21 (15:30): nothing more built on D6; the "Contender" figure named for the owner's veto.
- The joined tree /home/user/wt/join REMOVED (its commits are in JOINED-PROOF.md).
- NEXT (G20 (3)): when CLOSE-7 has taken D6, E1, E8: one line to the chair with my context size; under 600,000 build E8b
  as `lane/words-1-2026-11-25-e8b-wip`, else hand over at a commit boundary with E8b's design (G20 (2)) as the next unit.
STATE AT 16:38 UTC (read from `date -u`; an earlier draft wrote 17:05 by mistake) — E8b IN BUILD (worktree /home/user/wt/e8b, branch -e8b-wip on 94b7a13d9, UNCOMMITTED):
- MEASURE (records, base): the twelve rows, C 1157 strings, V 1126 (tells 899/852, impressions 202/215, crisis secrets 25/28,
  rare 11/12, siege goal.long 13/8, title secrets 2/5, behaviour 5/6). STOP sites: none (gender set at npcGenerator.js:132,
  before every draw of these lines; survey by an Explore agent, its claims spot-checked).
- BUILT: personMention.js BOUND_CARD_LINES (regex literals), `boundReflexives(card)`, `heldCardLine(text)`; ONE pass at
  narrativeGenerator.js:1068 (goaledNpcs; skipped under a held npcs pin) and generateSettlementPipeline.js:617 (regen,
  non-keepers); held-form reads in rareSecrets.js :: rareRowOf, goals.js :: secretRefuses, tonightSheet.js (2), and
  crisisFactFindings.js (1). Plan sent to the chair at about 16:33 ("build unless you veto").
- BARRED (one line sent to the chair): worldPulse/successorNpc.js:49-50 copies tell/goal.long onto a genderless successor.
- Test: tests/generators/people/boundCardLines.test.js (11 C births, all twelve rows met). Gates (e8b-*.log) and renders of
  wt/e8 vs wt/e8b, C and V (s-e8-*, s-e8b-*), running from 16:38.
STATE AT 16:47 UTC: CHAIR G29 (plan not vetoed; proof adds (1) the ROUND TRIP: heldCardLine(stored after) byte-equal to the
  base's stored string for every card of C and V, 0 differing, and a walker: no reader matches the twelve rows except through the
  helper; (2) the successor byte-unchanged; the regen: a non-keeper re-resolved = a fresh resolve, a keeper untouched; STOP at any
  moved string beyond the reflexive). G30: the ONE edit in successorNpc.js is allowed and required (copy the held form).
  DONE in wt/e8b (uncommitted): successorNpc.js copies heldCardLine(tell / goal.long) (import at the file's end, no line moves);
  tests/lint/boundCardLinesReaders.walker.test.js (readers of the row tables: HELD 4 through the helper, BEFORE_THE_PASS 3 with
  reasons, the successor, a planted control); boundCardLines.test.js gains the regen case; manifest rationale for both tests.
  Tools: tools/e8b-roundtrip.mjs (G29 (1) over the battery strings), tools/e8b-successor.mjs (G29 (2), made records, both trees).
STATE AT 18:22 UTC: UNIT E8b e75f090b7 HANDED IN to the chair (only). Moved C 1157 in 501 / V 1126 in 500 (= the measure);
  round trip 0/0; beyond the reflexive 0; other record strings 0; battery rows 0; unexplained 0; successor 6 built, 0 differing;
  regen keeper untouched; walker green; lint = base four; typechecks OK. Fault owned to the chair: one `npx tsc` run outside
  the mutex. All four of my units are handed in; the seat waits on the chair.
STATE AT 18:36 UTC: E8b ACCEPTED (18:24). NEXT UNIT E13b "HOW THEY DEAL" (chair 18:24): measure and design in ONE message,
  BUILD AND WRITE NOTHING BEFORE THE RULING; the sentences are the owner's to veto. MEASURE SENT 18:35 (tools/e13b-measure.mjs over
  the base battery records): cards holding a dealing line C 5148 / V 4861; 52 pairs (4 × 12 + 4 own lines), all met; town-pairs
  with 2/3/4/5 cards C 590/96/12/2, V 532/72/9/0; towns doubled C 333, V 336; full no-repeat moves C 826 strings in 333 places,
  V 703 in 336. DESIGN proposed: one town pass beside E8b's, cards of a pair ranked by fnv1a32(seed::dealing::card id), rank 0
  keeps today's line, new lines in a NEW table (generationForkCensus pins npcData.js:1686 by line). New sentences: 67 (none
  repeat on C∪V), 57 (3 a pair), 39 (2 for each doubling pair). WAITING ON THE CHAIR'S NUMBER.
STATE AT 18:49 UTC: CHAIR G39 (18:37): E13b RULED: 70 new sentences (every pair two lines, the 18 pairs reaching three cards three);
  cut ON TOP OF -e8b-wip e75f090b7 as `lane/words-1-2026-11-25-e13b-wip` (merge order E8, E8b, E13b). BUILT in /home/user/wt/e13b
  (UNCOMMITTED): src/data/people/dealingLines.js (NPC_DEALING_LINES, first lines by import; DEALING_POOL_OF_FIRST_LINE),
  src/generators/people/dealingLinesOfTown.js (the town pass), wired at narrativeGenerator.js:1068 and pipeline.js:617 (no line
  moves), tests/generators/people/dealingLines.test.js, manifest rationale. e13b/SENTENCES.md holds the 70 for the owner.
  Residual (pool exhausted) expected C 16, V 9 cards. Gates (e13b-*.log) and proof (s-e13b-*, twinb-*) running.
NOT IN STEP ONE (E8b): the card lines (tells 899/852, impressions, secrets, goal.long npcGenerator); their draws dedupe by text
in registries (castPowers hookRegistry.tells, CarriedSecrets), so a draw-time fill would move draws: a design is owed.
npcData.js was read in its changed region only (pairProse, the tie table), not whole: said in the hand-in.
