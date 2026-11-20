# PAGE-4's hand-back (the display lane after PAGE-1)

Kept current at every push; last written 19:20 UTC 2026-11-20 (`date -u`). A successor needs THIS FILE and the briefs
under `docs/chair/2026-11-20/content/page/briefs/` only. The seat's prompt:
`git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PAGE-4.txt`. PAGE-1's hand-back
(`PAGE-1-HANDBACK.md`, true at `a67e1b502`) holds the rulings 1-8 and the measures; this file adds what came after.

## Where it stands

- BRANCH `lane/page-4-2026-11-20`, cut at PAGE-1's final tip `a67e1b502` ("THE LANE IS YOURS", the chair 14:29 UTC).
- MERGED: CARD (S1, S2) from `lane/page-1-2026-11-20-card` `c03e48972` (merge `fe1ff5410`). Red 7 of 7 at base re-run by
  PAGE-4; green and the merge's gates green: see the table.
- MERGED: MAGIC (S5) from `lane/page-1-2026-11-20-magic` `dcb3b2744` (merge `fdec4d96f`; phoneChromeFloor's floors and
  the wiring census's producerIndexFiles re-measured by their doors at the merged tree: 620/863/665, 1437).
- MERGED: CARD-SERVED (the chair's condition (1) on CARD) from `page-4-card-served-2026-11-20` `e26476fa5` (merge
  `cf997215b`); the lighting census refrozen by its door for MAGIC's and CARD-SERVED's two new test files (`2cae388bc`).
- MERGED: SAFETY (S4) from `lane/page-1-2026-11-20-safety` `58fa4078c` (merge `83b2fa0f1`); lighting refrozen
  (`3712`); SAFETY's reader-bytes pin RE-TAKEN BY ITS DOOR (`SAFETY_READER_BYTES_RECORD=1`) on a `git archive` of
  `ad446c3ce` (the lane without SAFETY: the pin at `ff51769f7` predated CARD's and MAGIC's approved reader changes, 678 of
  3,300 surfaces), then plain at the tip 2/2: SAFETY moves no reader byte (`1f9552396`).
- MERGED: MAGIC-AUDIENCE (brief `briefs/MAGIC-AUDIENCE.md`) from `page-4-magic-audience-2026-11-20` `9c5ddf0ea` (merge
  `dad2f377b`): `magicMeasuresApart.js :: magicRelyNamesPrinted`, the Magic tab's own gate, read by the tab and the Overview
  line; the raw `config.magicExists` read gone (observedShapeReaders green). The line takes NO audience: the builder
  measured that every audience's Magic tab prints the same names from the same document (424 of 1,020 born documents, for
  owner, player and public alike); the one break was a made-up relied-upon village with nothing supplying magic, now no
  line. CONFIRMED by the chair 16:45: no audience parameter. The sides table is unchanged between `c5da1cfb3` and
  PAGE-5's final `f7f5986b5` (the chair's diff, 16:45).
- MERGED: SAFETY-MOUNT (brief `f6d892a94`) from `page-4-safety-mount-2026-11-20` `9500ae4c8` (merge `03c6a8571`): `OverviewTab`
  and `DefenseTab` hand `safetyAudienceOf` the two props AS PASSED (an omitted prop is a reader); every other use of the
  two flags keeps its default of false. `tests/components/safetyMount.test.jsx` holds the mount and a mount census of
  `src/` (both mounts, in `OutputContainer.jsx`, pass both props; READER_PAGES empty). Lighting refrozen 3715 (`ceb6e70b6`).
  Reader bytes: SAFETY-MOUNT moved NONE (the 300 moved at its merge were all `pdf.vm`, OUTPUT's, re-taken by PIN-FIX).
- MERGED: PIN-FIX (brief `ab01d4cc5`) from `page-4-pin-fix-2026-11-20` `e6d7db124` (merge `b5527a133`): MAGIC's caption
  at `proseFontSize` (the phone floor's one violation gone; desktop sizes unchanged); `dossierPhoneFloorAllViews`
  re-measured (desktop World/NPCs 284 -> 293 by CARD, Systems/Magic 3 -> 4 by MAGIC; mobile prose 283 -> 292, 1 -> 2),
  bisected at the lane's merges; `safetyReaderBytes.base.json` re-taken by its door (300 moved, all `pdf.vm`, OUTPUT's).
- THE LANE IS GREEN AT `b5527a133` (19:19 UTC): the six gates and both pins (receipts below). NO BUILDER IS OUT.
  THE ONE HEAVY GATE AT A TIME rule holds (`scripts/gate-mutex.sh --run`); a queued run GIVES UP after 40 polls (exit 3):
  re-queue it, do not read it as a red. THIN's measure searches a stored sentence by
  CONTAINMENT, not equality (SAME-1's `tools/printed.mjs` on `origin/lane/same-1-2026-11-20`).
- MERGED: OUTPUT (S3) with OUTPUT-FIX (`page-4-output-fix-2026-11-20` `b73ec574c` over OUTPUT `ac0ccdd80`; merge
  `c01804e5d`): `outputInWords.js`; the three fractions reworded; ", held back by having no market." DECLARED
  (`excludes: ['market']`, through `filterDeclared`) because `presumedThings` refuses an undeclared "market" (the builder's
  choice under the walker's own rule: the chair's to overrule). Registers re-measured at the merge by their doors:
  phoneChromeFloor 619/862/664; rawColorLiteral 1200; wiring `--check` 0; lighting 3714 (`127cf3949`).
- FOUND AT THAT MERGE (`dossierPhoneFloorAllViews`, `safetyReaderBytes`: NOT in the six gates, so CARD's and MAGIC's
  merges missed them): MAGIC's caption sits under the phone prose floor (12px < 14px), a DEFECT; World/NPCs 284 -> 293
  (CARD) and Systems/Magic 3 -> 4 (MAGIC) owed; `pdf.vm` moved by OUTPUT. CURED by PIN-FIX (above). FROM NOW ON
  each merge also runs `tests/components/dossierPhoneFloorAllViews.test.jsx` and `tests/ui/safetyReaderBytes.test.jsx`.

## THE LANE'S RULES AT EVERY MERGE (PAGE-4's practice; the last one the chair's 17:13 ruling)

- Read the builder's diff once, line by line. Re-run its red at its base, on a `git archive` of that commit with its new
  test files copied in (never a mixed tree). Run green at the merged tip.
- A register both sides moved (`docs/content/wiring-census.json`, `phoneChromeFloor.census.test.js`,
  `rawColorLiteral.test.js` BUDGET, `.lighting-census-baseline.json`) is RE-MEASURED BY ITS DOOR at the merged tree,
  never summed. Wiring: `node scripts/wiring-census.mjs`, then `--check`. Lighting:
  `LIGHTING_CENSUS_REFREEZE='<seat>' LIGHTING_CENSUS_NOTE='<cause>' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`
  on a CLEAN tree, then the walker plainly. A builder's worktree under `.claude/worktrees/` counts as dirty: PAGE-4 put
  `.claude/worktrees/` in `.git/info/exclude` (local only).
- THE SIX GATES, each to a file (`scratchpad/gates.sh <outdir>`; recipe: `sh scripts/gate-tail.sh <cmd>`): the lighting
  walker; `node scripts/wiring-census.mjs --check`; `npx vitest run tests/lint` WHOLE (needs the local
  `review-fixes-2026-07-08` ref); `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`.
- AND BOTH PINS (the chair, 17:13: a rule of the lane): `npx vitest run tests/components/dossierPhoneFloorAllViews.test.jsx`
  and `npx vitest run tests/ui/safetyReaderBytes.test.jsx`. A moved figure is re-taken by its door with its cause. The
  phone walk's door is its own run's figures. The reader pin's door is `SAFETY_READER_BYTES_RECORD=1`.
- While a builder runs, every heavy run goes through `sh scripts/gate-mutex.sh --run -- <cmd>`.
- A builder's worktree is cut by the harness from origin/main. Its prompt must make it `git checkout -b <branch> <lane sha>`
  first.

## The rulings that came after PAGE-1's list (the chair's; each vetoable by the owner)

9. 13:22 (amended 13:50) THE SIDES AS SHOWN, the reader's rules: (1) a power's name ONLY through a row's `named` wording,
   filled through `governanceAccount.js :: powerNameInProse`; a row without `named` is never named; (2) only where the
   document in hand holds EXACTLY ONE power of the kind meant (the ruler: its governing power), else the row's words;
   (3) never the same power on two sides of one tension: the later side keeps its words; (4) `presumes` checked FIRST: a
   town lacking the house shows `without` (null `without` DROPS the side); (5) a side the generator wrote over follows
   the data file header's rules 2-4, rule 3 reading the slot row's `without` first; (6) every side as shown begins with a
   capital; (7) reads only the document given; a served document lacking a withheld power is a town without it; a guard
   that no surface prints a side except through the reader; the session sheet's three labels call it at the join (not
   PAGE-4's to build). Tests for (1)-(3) red first on a MADE-UP roster.
10. 14:17 CARD's words APPROVED (`words/PAGE-1-WORDS.md` at `bcac8ab77`). Two conditions at its merge: (1) the weight on a
   served page is ranked among the powers the document in hand holds; a power with no figure prints "first of <power>"
   with NO weight (test on a made-up served document, red first): brief `CARD-SERVED.md`; (2) the removed people-tab
   filter is accepted; a switch "Heads of powers" is added as its own small unit AFTER S1-S5 only if it costs under about
   thirty lines in the people tab; else left out and said so.
11. 14:23 THE SIDES TABLE: `src/data/tensionSideMeanings.js` and `tests/data/tensionSideMeanings.test.js`, taken BYTE FOR
   BYTE from `c5da1cfb3` on `origin/lane/page-5-2026-11-20` (`git show c5da1cfb3:<path> > <path>`), never edited (a wrong
   row goes to the chair). The census of side readers: `docs/chair/2026-11-20/content/page/SIDE-READERS.md` at `837394d8f`
   on that lane. A SECOND data file follows (`src/data/tensionCauses.js`, a trouble's sentence from causes the document
   holds): ONE module serves both, same surfaces, same guard.
12. 14:29 MAGIC's words APPROVED. Its Overview line may print to EVERY audience on three conditions, each a test at the
   merge: composed only from the document in hand; per audience, the chains it names are a subset of the chains that
   audience's Magic tab prints; listed below for the security reader.
13. 14:29 OUTPUT's drag clause: NO mirror of the generator's weights in a display file. The share in words stands. The
   clause names only a drag that is a plain fact of the record, no weight, no ranking: no market or fair -> "held back by
   having no market"; if the stored record carries the drags' own terms (`economicState.compound`) it reads those;
   else no clause. No generator threshold copied.
14. 13:32 and 14:29, every seat: nothing only in a container (unfinished branches pushed as `-wip`); never commit while a
   push of that branch is in flight; `git ls-remote` before every push; one builder at a time.

15. 15:10 THE MARK is 450,000. THE CAUSES' SEAM: PAGE-7 delivers `src/domain/display/tensionCause.js ::
   tensionCauseSentenceOf(record, tension)` (the sentence, or null: then the stored text). PAGE-4's unit is the WIRING ONLY:
   first a census of the readers of a tension's `description` (like SIDE-READERS.md: the page, the session sheet, the
   export, any card), then every surface in PAGE-4's files calls it; a surface in another seat's files is NAMED to the
   chair, not edited. No pick, no predicate. The chair forwards PAGE-7's merge commit.
16. 15:16 SAFETY's words APPROVED as written ("<Label> day to day; <clause>.", five law clauses, two seat clauses, the wave
   clause, the led form "Safety: …"). OUTPUT: two changes before its merge (brief OUTPUT-FIX.md, the chair's words verbatim).
   The chair reads each unit's words on its branch: no words message is sent for SAFETY and OUTPUT.
17. 15:42 THE THIN PAGES, FIRST HALF, ORDERED before the deploy (vetoable by the owner): brief `briefs/THIN.md` (PAGE-1's,
   `94d111a44`), ONE builder, render only, AFTER OUTPUT and SAFETY: (a) Daily Life prints the FOUR of `deriveDailyLife`'s
   eight slots the brief says can print as they are (the four needing mended pools wait); (b) Outlook stops dropping its
   warnings and dependencies; (c) Magic prints each contributor's reason. CONDITIONS: (1) nothing new computed or stored
   (two-tree tool 0 differences); (2) MEASURE FIRST on the 300 (`hxd-<size>-0..49`): per slot and line, distinct texts and
   the largest share of one text BY SIZE; a line printing one sentence in more than about a quarter of a size's places is
   NOT printed and goes to the chair with its count; (3) every audience fails closed: list what each slot and line READS;
   a DM fact prints on the owner's page only; the list goes here for the security reader; (4) the page's added words to
   the chair before the merge; censuses by their doors. The chair wants a token estimate with the measure.
18. 15:58 SAFETY's audience FAILS OPEN at the mount (the tabs default `publicDossier`/`playerView` to false): A FAULT.
   Cure ruled, red first: brief `briefs/SAFETY-MOUNT.md`. Only what the Safety line reads changes. The SAME-1 seat
   measures every sentence the page prints: a unit that changes printed text has its commit forwarded there by the chair.
19. 16:33 THE {power} FILL (exactly one power of the kind in the document gives its name as prose takes it; else null) is
   PAGE-7's, a pure helper beside the sides table, built in its causes unit. THE SIDES READER CALLS IT and writes no fill
   of its own. The chair forwards "CAUSES <commit>"; the sides and the causes' wiring both wait for it.

## The order

CARD, CARD-SERVED, MAGIC, SAFETY, MAGIC-AUDIENCE, OUTPUT with OUTPUT-FIX, SAFETY-MOUNT, PIN-FIX (ALL MERGED; PAGE-4's
part ends here, the chair 17:13) -> PAGE-9's: THIN first half (ruling 17) -> THE SIDES AS SHOWN, on PAGE-7's fill (ruling 19)
(`briefs/SIDES.md` + rulings 9 and 11; brief to be amended with them) -> the causes' wiring (ruling 15) -> "Heads of
powers" if under thirty lines. At the last commit: the two-tree tool, the page census walker, the owner's before/after file.

## For the security reader at the join

- THE CARD'S WEIGHT reads ONE served field: `powerStructure.factions[].power` (via `cardPowers.js :: powersOf`), ranked
  only among the roster rows of the document in hand that carry a finite figure (`cardStandingRead.js :: powerWeightHere`).
- CARD-SERVED: a power the card's membership names but the document's roster does NOT hold is never named in the
  Standing row (`cardStandingRead.js :: cardFirstOfWeights`, fail closed); a held power with no figure prints
  "first of <power>" with no weight. NOT CURED HERE, FOR THE SECURITY READER: the card's separate power line
  (`cardPowers.js :: cardPowerLine`, pre-existing) names every power in the card's memberships whether or not the served
  roster holds it (CARD-SERVED's builder's measurement).
- MAGIC's Overview line (`magicMeasuresApart.js :: magicMeasuresApartLine`) prints to EVERY audience: composed only from
  the document in hand; names only what that audience's Magic tab prints (`magicRelyNamesPrinted`, one gate);
  `tests/components/magicAudience.test.jsx` holds both.
- SAFETY: a NEW SURFACE THAT READS CAPTURE (`powerStructure.criminalCaptureState`), the owner's page only
  (`safetyShown.js :: safetyShownOf`, fails closed to 'reader' on any audience but 'owner'). NOTE: `OverviewTab` and
  `DefenseTab` default `publicDossier` and `playerView` to false, so a caller that omits BOTH props reads as the owner
  (the gate the Crisis tab already uses): A FAULT, ruling 18, CURED by SAFETY-MOUNT (merge `03c6a8571`). THE CRISIS TAB has the same
  default; its page takes its own audience since the sheet lane's U0 (not PAGE-4's files). The PDF's line is only in the DM's own document (`vm.safetyQualifier` under
  `dmView`). Reader bytes: 300 towns x 11 reader surfaces, 0 moved by SAFETY (`tests/ui/safetyReaderBytes.test.jsx`).

## Merge receipts

| Unit | Merge | Red at base | Green | Gates |
|---|---|---|---|---|
| CARD | `fe1ff5410` | 2 files failed, 7 of 7 tests (PAGE-4's re-run) | 8 files, 65 of 65 (the 8 test files the unit touched) | lighting 34/34; wiring `--check` exit 0; tests/lint 220 files, 3271/3271; typecheck:ratchet 0; domain:strict 0; lint 0 |
| MAGIC | `fdec4d96f` | 1 file, 2 of 2 tests (PAGE-4's re-run) | 11/11 with the floor census | see the row below |
| CARD-SERVED | `cf997215b` | 5 of 6 in its new file at `2e29d60ea` (PAGE-4's re-run on a `git archive`; the builder recorded 3 of 14 over more files) | at `2cae388bc`: 8 files 45/45 (CARD, CARD-SERVED, MAGIC and the view-model/journal tests) | at `2cae388bc`: lighting 34/34; wiring 0; tests/lint 219/220 files, 3269/3271 (observedShapeReaders, MAGIC's raw read: with MAGIC-AUDIENCE); both typechecks 0; lint 0 |
| SAFETY | `83b2fa0f1` | 2 of 3 files (module missing; owner guard 2 failed); reader bytes green at base = the pin | 4 files 23/23 after the pin re-take | with MAGIC-AUDIENCE's row |
| MAGIC-AUDIENCE | `dad2f377b` | 1 of 4 (the unsupplied village) at `65b324b5e` | 3 files 8/8 (with MAGIC's and the reader-bytes pin); lighting 3713 refrozen, plain 34/34; observedShapeReaders green | at `2a661ab99`: lighting 34/34; wiring 0; tests/lint 220/220 files, 3271/3271; typecheck:ratchet 0; domain:strict 0; lint 0: THE LANE IS GREEN |
| OUTPUT with OUTPUT-FIX | `c01804e5d` | see `build/OUTPUT/` and `build/OUTPUT-FIX/` | outputInWords and the economics views | lighting 3714 (`127cf3949`); the pins NOT run (found after: PIN-FIX) |
| SAFETY-MOUNT | `03c6a8571` | 6 of 12 at `f6d892a94` (PAGE-4's re-run on a `git archive`: each tab printed the owner's line with neither prop or one) | safetyMount + safetyShown green; lighting 3715 refrozen (`ceb6e70b6`), plain 34/34 | at `ceb6e70b6`: wiring 0; tests/lint 220/220, 3271/3271; ratchet 167/167; strict 1113/1113; lint 0. Pins: floor red (MAGIC's 12px caption, the owed counts), reader bytes 300 moved, all `pdf.vm`: both PIN-FIX's |
| PIN-FIX | `b5527a133` | floor pin 1 of 2 at `ab01d4cc5` (PAGE-4's re-run on a `git archive`: the 12px caption) | both pins green: floor 2/2; reader bytes + safetyMount 14/14 | lighting 34/34; wiring 0; tests/lint 220/220, 3271/3271; ratchet 167/167; strict 1113/1113; lint 0: THE LANE IS GREEN |

## For the successor (PAGE-9): what you would trip on

- The builders' worktrees (`.claude/worktrees/agent-*`) and their local branches live only in PAGE-4's container; every
  unit is merged, so nothing there is owed. `.claude/worktrees/` is excluded in `.git/info/exclude` (local, not
  committed) so the lighting refreeze sees a clean tree: do the same in your checkout if you use worktree builders.
- The harness cuts a worktree builder from origin's default branch: start each brief with `git checkout -b <branch> <lane sha>`.
- A builder's red is re-run on a `git archive` of its base with only the new test files copied in (a mixed tree gave an
  unfaithful count once, CARD-SERVED).
- Every new test file moves the lighting census by one: refreeze by its door on a clean tree (the refreeze run fails BY
  DESIGN), then the plain run is the proof.
- The two pins are NOT in the six gates: run both at every merge (the rule above).

