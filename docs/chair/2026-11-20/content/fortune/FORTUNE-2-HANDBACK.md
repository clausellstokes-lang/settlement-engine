# FORTUNE-2 hand-back (HANDED OVER to FORTUNE-3; last written 2026-11-20 15:53:59 UTC by `date -u`)

For a successor (FORTUNE-3): this file and the briefs (`briefs/COMMON.md`, `U2.md` to `U4.md`) are all you need.
Lane branch `lane/fortune-2-2026-11-20` (taken at 57a79cc2d, FORTUNE-1's hand-over). The chair is
session_019yED1SUxGVHyjQnoqoFvQ8 (send_message, Claude Code Remote MCP server); one line at each unit landed green,
at most 300 words, with your count (the chair reads the true one; your own runs about a third low).

## 1. Rulings in force (each vetoable by the owner; every figure DRAFT, signed by none)

1. Everything in `FORTUNE-1-HANDBACK.md` section 1 (items 1 to 10) stands.
2. The chair, 12:01 UTC: the Power tab's reason clause is cured UNDER LAW 2 ONLY. Under law 1 the sentence tells the
   truth about the score beside it; rewording it would make words and number disagree. U4 LISTS the law-1 readings
   (each clause, its trigger term, how many of twenty towns a size print it). Recorded in `briefs/U4.md`.
3. FORTUNE-2's addition to U4 (accepted 12:01): FS5's dark rule binds every cure (law 1 picks today's line).
4. The chair, 13:17 UTC: `readerShapeResolver` (tests/lint) is NOT a flake on one run: before U2 or U3 merges, find
   WHICH token was 260 long in the whole run and whether U1's files hold it; U1's -> cured on the lane; reproduced at the
   base in a whole run -> the line's, the chair takes it. The lane's last commit needs `tests/lint` whole green by its
   count line.
5. The chair, 13:17 UTC: `tests/lint/.tuning-inventory.json`'s `measuredAtSha` (acf2c2180, U1's builder's pre-amend
   commit, not on the lane) is re-taken by its own door at the NEXT merge, with the cause in the commit; not before.
7. The chair, 13:56 UTC: the owner, "We have a weekly reset so don't mind that": builders side by side where path-disjoint;
   nothing stays only in a container. NEW PUSH RULE: never commit on a branch while its push is in flight; `git ls-remote`
   before every push and push only if the remote differs.
8. The chair, 13:56 UTC: NEW UNIT U5 "MERITS OF RULE" (`briefs/U5.md`): measure and propose, build nothing until ruled;
   lands DARK under the fortune law; numbers in the leaf's table; must not delay U2, U3 or "factionDynamics released".
6. The chair, 13:17 UTC: the working line moved to 43ab0f5eb (point 82). Merge it into the lane BEFORE THE LAST UNIT
   (U4), not before.

## 2. The units

| unit | state | branch | commit |
|---|---|---|---|
| briefs corrected for FORTUNE-2 | DONE | lane/fortune-2-2026-11-20 | 1b050c590, b079b6a89 |
| U1 law leaf, dark | MERGED, GREEN (chair accepted 13:17) | merge 2daa80771 of bc3c5cc8e; censuses re-taken 4822cff0b | pushed |
| U2 fortune | MERGED, GREEN (sent "U2/U3 GREEN bb6b4257a") | merge 6279d0433 of c48db76b0+2c6835758 | pushed |
| U3 standing + play-time guard | MERGED, GREEN; "factionDynamics released at bb6b4257a" SENT | merge 8ec9782f6 of df9e4c749 | pushed |
| registers after U2+U3 | tuning inventory e5e48cd81 (the chair's ruling 5 done); lighting b21a3a29d (3710 files, 475 parked); wiring unchanged | — | — |
| readerShapeResolver 260>256 | ANSWERED: the gate's long TMPDIR (see section 3); not U1's, not the line's | — | — |
| U5 merits of rule (measure + propose) | APPROVED by the chair 15:30 UTC under seven conditions (section 6, verbatim); BUILT BY FORTUNE-3 after the hand-over | pushed as lane/fortune-2-2026-11-20-u5-wip (64db7ba3d on 4951522fd) | U5-PROPOSAL.md there |
| U4 FS7 | NEXT for FORTUNE-3: first merge the working line's 43ab0f5eb into the lane (ruling 6), then cut U4 | lane/fortune-2-u4-2026-11-20 | — |
| re-measure forced on; owner's page re-check; confinement; final hand-back; "FORTUNE <commit>" | after U4 | — | — |

The chair, 13:31 UTC (usage warning): nothing stays only in a container. Every builder branch is pushed as
`lane/fortune-2-2026-11-20-uN-wip` now and after every return; a successor fetches those. No new measuring helpers; one
builder at a time unless a second is already running.

## 3. The integrator's routine at a merge (as done for U1)

`git merge --no-ff --no-commit <builder commit>`; drop any census change (`git checkout HEAD -- docs/content/wiring-census.json tests/lint/.lighting-census-baseline.json`);
commit the merge; then on the CLEAN tree re-take by their doors and commit "chore(registers): …":
`LIGHTING_CENSUS_REFREEZE='<seat>' LIGHTING_CENSUS_NOTE='<why>' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`
(exits non-zero by design) and `node scripts/wiring-census.mjs`. Red re-run: the builder's test files alone on the
pre-unit tree. Gates (one script, each line `sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh …` to a file):
`tests/lint` whole; every test file naming a changed module; `validate:tuning-bands`, `typecheck:ratchet`,
`typecheck:domain:strict`, `lint`, `node scripts/wiring-census.mjs --check`. A red is the unit's only if it is green at
the pre-unit tree. ⛔ RUN THE GATES WITH THE DEFAULT TMPDIR (/tmp): `tests/lint/readerShapeResolver.test.js` encodes its
mkdtemp path into a token capped at 256, so a ~95-char TMPDIR reds it at any commit (EXECUTED 13:5x: 260 at tip and base;
149 under /tmp).

KNOWN REDS AT THE BASE (b079b6a89), not ours: tests/build/engineBundleReplay (3), engineServiceCore (1),
engineServiceStoreParity (4), tests/domain/editWorldFactResources (A2, A6), tests/generators/institutionBudgetPromise (1),
tests/property/dmLayerGoldenIsolation (A7). tests/lint whole was 220/220 green at the base (3271 tests).

## 4. Instruments

- Prototype measure: `sh docs/chair/2026-11-20/content/fortune/instruments/run.sh <checkout> <scratch>`; re-run by
  FORTUNE-2 at 3c48af25c from a scratch copy: all seven outputs byte-identical to the committed `measures/`.
- Confinement: `node <confinement>/trees.mjs 0c9069489 <tip> <workdir> --words=none` (the tool from
  `origin/lane/names-3-2026-11-20:docs/chair/2026-11-20/content/tools/confinement/`, copied out; run from the repo root),
  then sha256 of `born-*/golden.jsonl` and `census.jsonl`. At 4822cff0b: 525/525 and 720/720 identical; golden
  663fe111…, census 882694dc… both sides.
- After the build, the forced-on arm on the REAL law: `measure.mjs` must set `_fortuneLawVersion: 2` AFTER `birthConfig`
  (owed with the re-measure); then re-check every figure on `FOR-THE-OWNER.md`: if one moves, tell the chair FIRST.

## 4a. The gates at the U2/U3 tip (EXECUTED, default TMPDIR; tree b21a3a29d = bb6b4257a's source)

tests/lint whole 220/220 (3271 tests); validate:tuning-bands, typecheck:ratchet 167/167, typecheck:domain:strict
1113/1113, lint 0 errors, wiring-census --check: green. Governing (85 files naming prosperity, factionDynamics,
computePublicLegitimacy, rulingStructure, fortuneLaw): 80 pass; 5 red, the SAME titles red at 4822cff0b (diffed
identical), the line's stored fingerprints: worldFactRederive, pipelinePinnedChoosers, powerEconomyFreshness,
espionageDormancyFence, generatorGoldenMaster. Confinement 0c9069489 -> bb6b4257a: 525/525 and 720/720 identical,
sha256 golden 663fe111…, census 882694dc… on all three trees (0c9069489, 4822cff0b, bb6b4257a).

## 4b. What FORTUNE-3 does, in order (the seat's prompt's list, from here)

1. Merge the working line (43ab0f5eb or its newer tip, as the chair says) into the lane; re-take every register keyed on
   a shared file by its own door on the merged tree (proposal section 14); the lighting and wiring censuses.
2. U4 (FS7, `briefs/U4.md`, with the chair's rulings of 11:52 and 12:01 in it): one builder; cures under law 2 only.
3. U5 (section 6, the chair's seven conditions): merge `lane/fortune-2-2026-11-20-u5-wip` (docs and instruments) first;
   condition 3's census of band readers and the `reBand` check come BEFORE any build; condition 6's sentences go to the
   chair first.
4. The measure re-taken on the BUILT rule forced on (`measure.mjs` sets `_fortuneLawVersion: 2` AFTER `birthConfig`:
   the owed one-line change), and `FOR-THE-OWNER.md` re-checked: if a figure moves, tell the chair FIRST with before
   and after.
5. The final confinement (0c9069489 -> the tip, 525 and 720 equal) and `tests/lint` whole green by its count line at the
   last commit; the hand-back; "FORTUNE <commit>". THE FORTUNE LAW IS NEVER LIT BEFORE THE SEAT'S LAW (the leaf's header
   says so).

Builder worktrees of FORTUNE-2 (`scratchpad/wt-u2`, `wt-u3`, `wt-u5`, `wt-red`) live only in FORTUNE-2's container;
everything in them is pushed (`-u2-wip`, `-u3-wip`, `-u5-wip`) or merged.

## 5. Executed vs plausible

EXECUTED: U1's red and green, the merge, the censuses, the confinement, every gate count above, and the readerShapeResolver cause.

## 6. U5, THE CHAIR'S RULING OF 2026-11-20 15:30 UTC (verbatim, as ordered)

> CHAIR, 15:30 UTC. U5 "MERITS OF RULE": I HAVE READ THE PROPOSAL WHOLE (64db7ba3d, all twelve sections). APPROVED AS PROPOSED, TO BE BUILT DARK, under seven conditions. Put this message verbatim in your hand-back; FORTUNE-3 builds it after the hand-over.
> 1. THE TWO MERITS as chosen (the principled ruler; a catastrophe weathered within 40 years), +10 each, counted only upward, only at Tolerated or better, only with no trouble of today about the ruler and no capture; the safety rule by the size's usual range (it puts the calm city back level with the other sizes: Approved 18% pooled without it, 39% with it); Endorsed never on fewer than two reasons, kept as a test. Every row is a DRAFT row of the leaf's one table, signed by none: the owner's at the close.
> 2. MY FIGURE WAS WRONG AND YOURS STANDS: safety costs a calm place about nothing (0 to -1.8); my -4 was the mean over all places. I correct it to the owner.
> 3. THE STRUCTURAL COST, RULED: THE MERITS ARE A LATE STEP THAT RE-BANDS; THE BIRTH'S POWERS STAND. No multiplier is re-run: that is the shape you measured, and FS4, the contest and the capture rung hold only for it. BUT NO PRINTED WORD MAY CONTRADICT THE STORED BAND. The build's first task is the census of every birth reader of a band above Tolerated. A reader that WRITES WORDS from the band (`settleClaimsToLabel`, `annotateFactionStanding`, the relation's direction if it is printed) is re-run in the late step (pure and idempotent, proved by running it twice) or proved to say the same at both bands. A reader that writes NUMBERS is listed with what it read, and stays. ARM: on every town the late step moves, re-running the word-writers changes nothing. VERIFY IN THE CODE that play-time `reBand` has this same shape; if it does not, tell me before building.
> 4. THE LEGACY CLAUSE READS NO FREE TEXT: one matcher over the legacy generator's OWN list of "never put right" wordings (exported from `legacyGenerator.js`, never copied), a pinning test, and a made-up new wording that reds: the seat lane's pattern for the transfer sentence.
> 5. THE PRINCIPLED MERIT NAMES ITS OWN TRAIT LIST in the fortune leaf, with a test that it equals today's `straight` family and that the vice families are the card's.
> 6. THE REASON IS PRINTED, composed at render from the document in hand by the same predicates as the birth step (one shared helper). ITS SENTENCES COME TO ME FIRST: two merits, three wordings each, plain words; the event by its stored name, the ruler by office; nothing the record does not hold (the place came through it under this rule; never that this person led it). A shared page that does not serve the ruler's membership omits the principled reason.
> 7. FOR THE SECURITY READER AT THE JOIN, listed in the hand-back: the merits depend on the capture rung (a condition), so `breakdown.merits` is a field a hidden house can move.
> ORDER: "U2/U3 GREEN" and "factionDynamics released at <commit>" first; then your hand-over; U5's build is FORTUNE-3's. The merits under the seat's law are read in the joint measure. Your count by my read at 15:07: 266,579.

FOR THE SECURITY READER AT THE JOIN (condition 7): `publicLegitimacy.breakdown.merits` (once U5 is built) depends on
the capture rung, a condition a hidden criminal house can move: a served page must not let it reveal a hidden house.

U5's proposal, instruments and measures live on `lane/fortune-2-2026-11-20-u5-wip` (64db7ba3d); merge that branch into
the lane before building U5 (docs and instruments only).
