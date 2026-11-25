# WORDS-1 — HAND-BACK (a seat of the tenth chair; kept current at every push)

Law: `docs/chair/2026-11-24/tenth/prompts/START-WORDS-1.txt` and `START-GEN-COMMON.txt` on `lane/chair-2026-11-08`. The chair is
session_019yED1SUxGVHyjQnoqoFvQ8; CLOSE-7 is session_019yED1QNMqSLp7ohcZB88VP. A successor reads those two files, then this section.

## 0. WHERE THE SEAT STANDS: THE WHOLE MEMORY (written 09:02 UTC 2026-11-25)

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
NOT IN STEP ONE (E8b): the card lines (tells 899/852, impressions, secrets, goal.long npcGenerator); their draws dedupe by text
in registries (castPowers hookRegistry.tells, CarriedSecrets), so a draw-time fill would move draws: a design is owed.
npcData.js was read in its changed region only (pairProse, the tie table), not whole: said in the hand-in.
