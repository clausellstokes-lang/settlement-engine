# PAGE-3's hand-back (kept current at every push; last written 2026-11-20 13:54 UTC by `date -u`)

Read this, then `PAGE-2-HANDBACK.md` (its section 1, the rulings in force, still governs where this file is silent),
then `briefs/BUILDER-RULES.md` and the brief of the unit you take. PAGE-3 integrates; builders (the Agent tool) build.

## 1. State

- Lane `lane/page-3-2026-11-20`, cut at 6b82c8e4a (PAGE-2's final tip; src/tests identical to 0c9069489). The chair's
  "THE LANE IS YOURS at 6b82c8e4a", 12:52 UTC. NOTHING MERGED YET.
- The lane's measure reproduces at the base (`measures/page-2/measure.mjs`, 50 a size): 39.9% three-forge (city 83.3%);
  it differs from `measure.before.out.txt` only in the two lacking-sides lines (the noted regex fix).
- Two-tree base births: 0c9069489 and 6b82c8e4a identical (525/525, 720/720), cached in this container's scratchpad `cw/`.
- RESOLVED (the chair, 12:55): the dead 'overwhelms' branch is NOT mended (PAGE-2's ruling 1 governs; the prompt's
  clause was struck). L1's builder is cut only after S6 is on origin AND merged here; one builder at a time in
  `historyGenerator.js` / `historyData.js`; K may run beside them.

## 2. Units

| unit | state | branch | commit | next |
|---|---|---|---|---|
| S6 | PAGE-2's builder; origin `lane/page-2-2026-11-20-t1` now at 532a74fa2 (moved past 12dc0f96c: the follow-up? NOT yet relayed by the chair, UNREAD by PAGE-3) | lane/page-2-2026-11-20-t1 | 532a74fa2 | read once, re-run red/green, censuses, confinement, merge FIRST |
| sides table | a89859e6f READ by PAGE-3, red/green re-run, merged with its manifest row (00ec2d54e) and the lighting census refrozen (3707→3708 files); tests/lint 220/220 there. The chair's six changes (13:22, `briefs/S7-FOLLOWUP.md`): the builder STOPPED at its first check: change 1 is wrong by the code (only 7 template sides are ever written over; 8 of 11 `named` rows never hold a name; 4 rows without `named` do). ASKED THE CHAIR 13:4x: does {power} fill from the stored side or the roster by `means`, and what of the four? Changes 2-6 hold; change 5 needs the case arm to accept the case of the side a fixed row stands for | origin `lane/page-3-2026-11-20-s7-wip` (merge + census + brief, 688682b22) | a89859e6f | on the ruling: build the follow-up (a builder, brief S7-FOLLOWUP.md + the ruling), read, re-run, re-take the census, merge into the lane, one line to the chair |
| L2 | PAGE-2's builder; uncommitted | lane/page-2-2026-11-20-l2 | | lines to the chair; merge third |
| L4/S9/S3 | PAGE-2's builder; uncommitted | lane/page-2-2026-11-20-s | | seven reworded lines to the chair; merge fourth |
| L1 | NOT DISPATCHED (builds on S6's tip) | | | dispatch on T2.md once S6 is on origin |
| K | PHASE 1 DONE, TRIAL FAILS CONFINEMENT: OTHER 353 leaves/44 towns (golden), 686/89 (census): the powers' conflicts (`powerStructure.conflicts`, parties swap, 34 towns lose their conflict), `factionRelationships[].narrative/direction`, `pressureSentence` (26), ~42 census goals outside classes 2/5, one tie between unmoved cards changing archetype. Bands move for exactly 3 roles (273 cards/151 towns). Also moves tests/lint `poolDominance` (old_debt 0.1389 > 0.1293) and `writerReach` (shapesDigest). Output: `measures/page-3/K-trial-f4a434660.out.txt` | origin `lane/page-3-2026-11-20-k-wip` | f4a434660 (code), b2f8fe25e (scripts) | the chair's ruling on OTHER; Phase 2 only on its word |

## 3. THE CHAIR'S ORDER OF 13:48 (supersedes 13:32's hold: the owner, "We have a weekly reset so don't mind that")

The order of 12:52 again: S6, the sides table, L2 (origin `lane/page-2-2026-11-20-l2-wip` 609c52c5d), L4/S9 (origin
`lane/page-2-2026-11-20-s-wip` f2957d5be), L1, K last; as many builders side by side as are path-disjoint (one at a time
in `historyGenerator.js` / `historyData.js`). L1 is NOT dispatched until the chair's change to it arrives (a trouble's
sentence says WHY IT IS HAPPENING HERE, from the record). NEW RULE: never commit on a branch while its push is in flight;
before every push `git ls-remote` and push only if the remote differs (an empty push runs `npm run check` inside the
hook and fixture tests damage the repository; a push log showing `npm run check` is killed and the chair told). Checked
here 13:5x: core.bare false, no "Fixture" author.

## 3a. The 13:32 order (history)

PAGE-3 does THREE things only: (a) the sides table with the six changes, merged, its commit to the chair; (b) S6 when
its follow-up lands; (c) K's trial result to the chair in one message. L1, L2, L4/S9 and K's build wait on origin until
the chair says. Every branch pushed (`-wip` when unfinished) after every return; this file current at every push.

## 4. Owed at the join (the chair, 13:22)

- A PARITY TEST on the joined tree: this lane's `src/data/tensionSideMeanings.js` and the session sheet's
  `src/domain/tension/sideArchetypes.js` (origin/lane/frame-5-2026-11-20) must agree on what a side means.
- The working line 43ab0f5eb (point 82) is merged into the lane at 6cf1e8e89 (no conflict).

## 4a. THE CHAIR'S RULINGS OF 13:50

- SIDES: {power} fills from the ROSTER by `means` (ruler = governing power; a power kind only where the document holds
  EXACTLY ONE of that kind: the reader's test); the reader never names a side stored as the template's own words unless
  its row carries `named`; a side already stored as a power's name is shown as stored (Legitimate heir, Corrupt officials,
  Official guards, Power behind throne: no `named`). The case arm may match the fixed row's words OR the side it stands
  for. The follow-up builder (page3/s7-fix) resumed on this at 13:5x.
- PAGE-2'S BUILDERS ALL STOPPED; each branch UNFINISHED, to be finished by builders of PAGE-3's line cut from these tips:
  S6 `lane/page-2-2026-11-20-t1` 532a74fa2 (its gates never ran; merge doors owed); L2 `-l2-wip` 609c52c5d (76 lines,
  22.9%→14.2%; four register reds owed at the doors; THE 76 LINES TO THE CHAIR AS A FILE BEFORE MERGE); L4+S9 `-s-wip`
  f2957d5be (the seven reworked lines in: SEND THEM TO THE CHAIR; 6 importer reds: three golden, three tests anchored on
  secrets L4 cured, re-key by cause; the guard not started).
- S9 REDESIGNED: its 40 OTHER cards NOT accepted. S9 becomes a POST-PASS like the goals' refusal: secrets dealt exactly
  as today; THEN draw-free a misfit card takes its next admitted line no card of the town holds; a card that is not a
  misfit keeps its secret BYTE FOR BYTE; if a later draw of the same card makes that impossible, the builder says which
  and stops.

## 4b. L1 RE-CUT (the chair, 13:56): T2.md's 24 wordings are NOT written

A trouble's sentence says WHY IT IS HAPPENING HERE, from the record, shown AT RENDER; this lane's part is DATA ONLY.
The chair's measure (300 built towns): three in a row share a trouble's sentence 33.0% mixed, 40.8% towns, 80.8% cities,
79.8% metropolises; names masked change nothing; "crime is rising" in 25.7% of towns, "guild against outside traders"
18.7%. STEPS: (1) MEASURE per kind (crime_wave, guild_conflict first, then the next six): what `historyGenerator.js`
reads to give a town that kind (weights, conditions) and which born-record facts stand in its towns, each with its rate.
(2) PROPOSE to the chair in ONE message before any line: per kind a CLOSED TABLE OF CAUSES, each a pure predicate over the
document with its rate (none above ~a third of the kind's towns; a plain wording when none holds), in priority order.
(3) THE LINES: two wordings a cause, three plain a kind, each saying ONLY what its predicate holds; no new fact, secret
or crime; no pronoun after a power's name; to the chair in batches before merge. (4) `src/data/tensionCauses.js` + a
totality test; the display seat builds the reader; the stored description stays. TARGETS (built towns, names masked):
mixed under 10%; three cities in a row under 25%. Not started by PAGE-3.

## 5. Open questions to the chair (asked, unanswered at this writing)

- (answered 13:50: see 4a.)
- 14:2x: K's OTHER (353/44 golden, 686/89 census): a sixth class, or K stops.

## 6. Container facts (this container only; a successor re-makes them)

- `npm ci` done in /home/user/settlement-engine; `/node_modules` added to `.git/info/exclude` (the lighting door refuses a
  dirty tree, and the worktrees' node_modules symlink is untracked).
- Worktrees: /home/user/wt-page3-k (K), /home/user/wt-page3-s7 (`page3/s7-merge`), /home/user/wt-page3-s7fix
  (`page3/s7-fix` = origin `lane/page-3-2026-11-20-s7-wip`). The ledger ref review-fixes-2026-07-08 is fetched (tests/lint
  `ledgerCitationIntegrity` reds without it).
