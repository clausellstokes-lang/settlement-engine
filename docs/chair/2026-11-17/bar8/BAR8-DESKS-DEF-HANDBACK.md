# BAR8-DESKS-DEF · hand-back (the sixth chair's round BAR8, 2026-11-17)

Seat DESKS-DEF of `docs/chair/2026-11-17/sixth/briefs/BRIEF-BAR8.md` (the chair's lane). BASE `lane/join-2026-11-14` at
f1ca75555 (POINT 37). BRANCH `lane/bar8-desks-def-2026-11-17`. Nothing merged. No pull request.

**NOT COMMITTED, NOT PUSHED.** My own permission check refused `git commit` on this branch (twice: "Destructive or Unwanted
Actions"; the checkout's CLAUDE.md forbids staging and committing "without explicit authority"). The refusal stands and I
did not route round it; the chair was told at once. The cure is in the worktree. TO LAND IT, once commit is granted, stage
exactly these eleven paths and no others:

    docs/content/RECEIPT_POOLS_DOSSIER_STATE.md            src/data/dossierStateProse/defense.generated.js
    src/data/dossierStateProse/power.generated.js          src/domain/facts/uprising.js (new)
    src/domain/facts/factVocabulary.js                     src/domain/facts/factsOf.js
    src/domain/facts/factLayers.js                         tests/lint/factLayers.poolTable.json
    tests/lint/proseEntryContradiction.walker.test.js      tests/domain/bar8DesksDef.test.js (new)
    docs/chair/2026-11-17/bar8/BAR8-DESKS-DEF-HANDBACK.md (this file)

The worktree also holds `docs/content/wiring-census.json` and `src/data/proseNorms.generated.js` as the generator left them
(AX1: re-taken to let the generator run, NOT to be committed; restoring them with `git checkout --` was refused too).

## 1 · The rules (towns · instances · distinct lines; the thirty · the 150 · the 720)

Measured with `runK.mjs` over renders of my base and of my tip (PAGE-COPY `census3.sh --count-only`; the thirty rendered at the
base f1ca75555, not taken from the published render at K's tree).

| rule | what I did | before | after |
|---|---|---|---|
| 13f · "has no rival, and no crew is contesting" under "lacks a single controlling authority" | DS-DEF-4 semi-organized v4 declares `crime: = organized` (the key's own atom: the line leaves the key whose note says the opposite; never admitted there now); v7 its TWIN there `[unfolding · tier: ≥ village · no rival rings · crime: ≤ semi-organized]` (the pool would fall from 3 to 2) | 2·2·1 · 7·7·1 · 22·22·1 | 0 · 0 · 0 |
| 13a, the desk's line · "arrested, heard and held … expect a hearing" under "Prison only" | DS-DEF-2 full legal chain v1 declares `court sits`; ALSO its sibling v3 "there is a court to hear it" (same atom, no new words: with v1 alone declared, v3 was drawn in v1's place in Drumbeck and Brahmamandal, the same false claim) | 2·2·1 (desk line; 2·3·2 with K-WATCH's service line) · 0 · 2·2·1 | desk line 0 · 0 · 0 (the 1·1·1 left in the thirty is K-WATCH's SLOW_LAW_DESC, C39616) |
| 13d · "no wrong done there is written down" beside "record of crimes" | LEFT BY NAME (section 5) | 1·1·1 · 4·4·1 · 4·4·1 | unchanged |
| 14c · "goes to the whole {seat}" of a seat of "1 member" | DS-POW-5 council v2 declares `seat members` (BR14 (c): the EXISTING atom answers it, `seatMembers.js`); v6 the BR15 TWIN "goes to the {seat}"; ALSO its sibling v1 "the whole {seat} must agree" declares the same atom (with v2 alone declared it was drawn in v2's place in 10 seats of one) | 3·3·3 · 6·6·3 · 45·45·7 | 0 · 0 · 0 |
| 14c's sibling, not counted by runK · "because the whole {seat} must agree" of a seat of one | as above | 0 · 7 · 33 | 0 · 0 · 0 |
| 12e · "nobody … stands ready to lead them" beside a live rising | DS-POW-4 Stable v3 declares `no uprising`, the NEW ATOM of BR14 (c) (`unrest` not widened) | 1·1·1 · 0 · 0 | 0 · 0 · 0 (the line is refused in 6 more towns where it was not drawn: bar0-thorp-calm-rand-32, -35, -39, r2r-thorp-23, -31, -50) |
| 15c, the desk's half · "has none of its own to send" beside the chain card's "Monster hunting services via Veteran's lodge" | MEASURED, LEFT BY NAME: the desk line is the TRUE half (section 5) | 1·1·1 · 0 · 2·2·2 | unchanged |
| L9's two lines | DS-DEF-6 Legal Infrastructure: None v1 and DS-POW-5 FLAG: merchantArmy v1 declare `law: > collapsed`, each a TWIN `law: = collapsed`; the pool table places both at 5 | static: admitting a collapsed law 2 | 0; printed beside a collapsed law 0·0·0 → 0·0·0 |
| the granary's v2 and v3 | DS-DEF-2 granary-and-parish v2, v3 declare `stores: ≥ 3`, each a TWIN `stores: < 3` (the pool keeps 3 where stores are short: v4, v5, v6) | static: admitting short stores 2 | 0 |

NO OTHER RULE OF EITHER AUDITOR'S K TABLE MOVES: every row of runK's table other than my four is byte-equal at base and tip over
the three populations (12a … 15e). runJ was not run (my desks print none of law 11's lines; the dump diff below shows every
line that moved).

## 2 · The controls (the thirty, `controlsK.json`)

My STANDS controls are each CLEAR at the tip (so the runner exits 3, BY DESIGN): C3863, C8647 (13f), C40154, C34395 (13a, the
desk line), C16666 (14c), C16668 (12e). STILL FOUND: C16222 (13d, left by name), C36003 (15c, left by name), C39616 (13a's
service line: K-WATCH's). The WEAK C6290 is clear at base and at tip (as it was). Every other control, STANDS, EXPLAINED and
WEAK, reads at the tip exactly as at the base (`diff` of the two controls tables: only the six lines above differ).

## 3 · The guard

`tests/domain/bar8DesksDef.test.js` (new). Six tests: (1) ten desk rows over a CONSTRUCTED record (the facts of one born town
on no road, `bar8-desks-def-anchor-town`, one premise atom set each way): each line refused where its premise fails and admitted
where it holds, each twin the reverse; (2) the shared page (N4): the record, `toPublicSafe` and the share veil admit each line
and twin alike; (3) the atom `uprising` on four constructed records (a rising alone, a rising beside a crime wave, a crime wave
alone, none) and DS-POW-4 Stable v3 following it; (4) the rising read alike on the record, the public form and the share veil;
(5, 6) 14c over born census towns: four seats of one that printed "goes to the whole" at the base (r2r-hamlet-30, r2r-thorp-1,
r2s-occupied-village-0, r2s-plague_onset-hamlet-0) take the twin and refuse v1 and v2, on all three forms; three seats of
many (r2r-hamlet-6, -25, -33) the reverse. AT THE BASE: 4 failed, 2 passed (10 of 10 rows, 4 of 4 cases, 4 of 4 and 3 of 3
towns; the two shared-page arms pass). AT THE TIP: 6 passed. N5 (scratch tree of the line's tip 3b06c724b with my files on top):
the guard passes; no file of mine is touched by POINTS 38 and 39 (clean).

## 4 · The new and the changed lines (for the owner's veto list), and the diff of every dump

DIFF OF EVERY DUMP, base against tip: 161 towns differ (8 of the thirty, 26 of the 150, 127 of the 720). Every added sentence is
one of the twins below or an EXISTING line of the same pool drawn where a declared line was refused; no line of any other
writer moved.

| line | prints in (30 · 150 · 720 at the tip) | three towns |
|---|---|---|
| NEW TWIN DS-POW-5 council v6 `[street · no ruler: lord · no seat members]` "At {settlement} the town's business goes to the {seat}, and everybody has learned how long the answer takes." | 0 · 9 · 49 | r2r-hamlet-28, r2r-thorp-12, bar0-hamlet-calm-rand-36 |
| NEW TWIN DS-DEF-4 semi-organized v7 `[unfolding · tier: ≥ village · no rival rings · crime: ≤ semi-organized]` "No one boss runs the crime at {settlement}: whoever works a route keeps it, and nobody stands over them all." | 2 · 4 · 24 | bar0-city-wartime-rand-45, bar0-city-under_siege+famine-rand-46, r2r-city-27 |
| NEW TWIN DS-DEF-6 Legal None v4 `[ledger · law: = collapsed]` "{settlement} has nowhere to try a wrong and nowhere to hold anyone, so no complaint is ever written down, and order holds nowhere for long." | none of the populations (the guard's constructed record) | — |
| NEW TWIN DS-POW-5 merchantArmy v3 `[ledger · no crisis: occupied · law: = collapsed]` "The trading houses at {settlement} pay for their own armed guards, a private army that guards the houses' business and little else. Where the houses' men and the {seat} disagree, the houses' men usually win." (LEFT-LINES's words) | none | — |
| NEW TWIN DS-DEF-2 granary-and-parish v5 `[street · stores: < 3]` "The town has a little grain put by, not enough for a bad year. What it does about sickness is pray and nurse, in that order." | none (the Defense tab draws no disaster row, by the owner's word) | — |
| NEW TWIN DS-DEF-2 granary-and-parish v6 `[visitor · stores: < 3]` "You find a grain store at {settlement} that is far from full, and for the sick only a small infirmary." | none | — |
| EXISTING lines newly drawn where a declared line is refused: DS-POW-5 council v3 "watches the town's temper closely" and v5 "has left obvious decisions untaken"; DS-POW-4 Stable v2; DS-DEF-4 semi-organized v1, v2; DS-DEF-2 full chain v2 "A thing done wrong … goes somewhere and takes time" | v2 of the full chain: 2 · 0 · 3 (see section 5, item 1) | bar0-thorp-calm-rand-45, r2r-thorp-1, bar0-town-calm-rand-46 |

The twins copy no banked word: the first drafts of three (the granary pair, Legal None v4) added three FRESH rows to the
presumed-things door ("plague", "clergy", "gaol"); reworded before the count, the door reads as at the base.

NEW VOCABULARY (for the owner's veto list): ONE atom, `uprising` (presence, home `uprising`, layer 4 over the history): a live
`popular_uprising` tension of the history (`src/domain/facts/uprising.js`, import-free, ruling EG1; beneath `danger coming`,
the history's other live tension, in `factVocabulary.js`; one getter in `factsOf.js`, one home in `factLayers.js`). The atom
answers true in 7 towns of my populations (the thirty's bar0-hamlet-calm-rand-46 and the six above).

## 5 · Left by name, and where I stepped past the letter

1. **13a: the desk's POOL KEY is the false fact.** `src/domain/display/stateProse/defenseStateProse.js :: internalRowPoolKey`
   is handed `compound.hasCourtSystem` (the town-hall NAME test) while the Legal row reads the court on the live roster
   (`courtHoldersOf`, the atom `court sits`). In the 8 towns of the 720 and 2 of the thirty where they disagree (bar0-town-calm-
   rand-46, bar0-town-occupied-rand-47, bar0-town-calm-rand-30, r2r-town-5, -15, -25, r2s-under_siege-town-2, r2s-plague_onset-
   town-2, r2s-insurgency-town-1, r2s-mass_migration-town-2) the desk draws from "full legal chain" beside "Prison only". With v1
   and v3 declared, only v2 is admitted there ("A thing done wrong … goes somewhere and takes time, and the town has come to rely
   on that rather than on the watch's temper"), which reads uneasily beside "Detention without process. Arbitrary enforcement."
   (5 towns print it). The cure is that file's key reading the roster's court (the "detention without process" pool's three lines
   are true there): NOT MY FILE. v4 ("has a court and a cell", the collapsed law) is undeclared: it prints beside "Prison only"
   in none of the populations.
2. **R7 BREACHES, by name** (no twin is given to me for these, so none was written): (a) the full chain pool falls from 3 to 1
   in the 10 towns of item 1; (b) DS-POW-4 Stable falls from 3 to 2 (v1, v2) in the 7 towns with the atom; (c) DS-POW-5 council
   falls from 3 to 2 (v5, v6) in 12 seats of one under a succession crisis (r2r-hamlet-35, r2s-politically_fractured-thorp-0 to
   -3, -hamlet-3, -village-3, r2s-succession_void-thorp-0 to -3, -hamlet-3): at the base two of their three lines were the false
   ones. PROPOSED TWINS for the chair to grant or refuse (NOT in the annex): 13a v1 `[ledger · court · no court sits · prison ·
   law: > collapsed]` "Offenders at {settlement} are arrested and held, but no court sits to hear them, so a case goes as far as
   the cell and no further."; 12e v3 `[counterforce · succession settled · no unrest · uprising]` "The common people at
   {settlement} are pressing those in charge, but nobody stands ready to take the {seat}'s place."; 14c v1 `[ledger · no ruler:
   lord · no seat members]` "Decisions at {settlement} wait on the {seat}, and once made they are rarely undone."
3. **13d (towns: 1 · 4 · 4 over the thirty, the 150, the 720).** The "no legal infrastructure" pool holds exactly three
   undeclared lines, so declaring v1 drops it under three with no twin given; the record-of-crimes lines are seven, in four
   DS-DEF-3 pools, and the fact that would refuse them ("a court or a gaol stands") is a DISJUNCTION the vocabulary cannot
   declare (`court` and `prison` are two presences; `no court · no prison` is their conjunction). It needs a new atom (court or
   gaol) or the twin of v1, both the chair's. Towns: bar0-hamlet-calm-rand-45 (C16222), bar0-hamlet-calm-rand-29, bar0-thorp-
   calm-rand-33, -35, -41, r2r-hamlet-55, r2r-thorp-28, r2r-village-19, r2r-village-6.
4. **15c, the desk's half, measured: the desk line is TRUE.** In both towns of the 720 (r2s-indebted-town-0,
   r2s-succession_void-metropolis-0) and the thirty's bar0-town-calm-rand-47, the Veteran's lodge's own card offers "Services ·
   Armed escort" only (the metropolis's Mercenary quarter: "Mercenary hire · Veteran expertise"); no house offers monster hunting
   or dungeon clearance. The false half is the chain card's outputs (`tradeListDisplay.js :: chainOutputsShown`, J-INCOME's).
5. **I touched `factsOf.js` and `factLayers.js`** (one line each, plus the import) for the atom given to me by name (R3 lets the
   shared facts' files be touched where the section gives an atom); and **the pool table for a THIRD pool**,
   DS-POW-4 Stable 4 → 5: the new atom is layer 4, so the pool that declares it must sit at 5 or the layer walker gains a row.
   With it the walker prints the base's own three messages, byte for byte.

## 6 · Declared moves, the books, the doors

- DECLARED MOVES: none. Every cure is a desk line read at print; no stored field moves (the 900 births of the tip's render are
  byte-equal to the base's).
- THE DOORS (R9): presumption classes `hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938` at base and tip; presumed
  things `fresh 38 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107` at base and tip
  (identical output). No `--shrink`, no `--bank`.
- BOOKS FOR THE CLOSE (R10, AX1): the wiring census and `proseNorms.generated.js` (one comment line: 859 → 861 pools) re-taken in
  scratch only. The pins the six added variants move, each RED AT THE BASE already: the variant count 3033 → 3039; the
  `proseEntryContradiction` loaders' homes 3501 → 3507 and annex rows 2794 → 2800 (the walker's messages at base and tip differ
  in those two figures only).
- RE-KEYED (R8, dated notes beside them): `tests/lint/proseEntryContradiction.walker.test.js`, the two annex anchors re-addressed
  by their text, 6181 → 6187 and 2428 → 2429. I am the first or second desk seat as the chair rules: the second re-addresses them
  once more on a scratch merge.

## 7 · The net (R11, N2), each gate alone through `sh scripts/gate-tail.sh`, at the tip's tree

`typecheck:domain:strict` 0 (1113, ceiling 1113); `typecheck:ratchet` 0 (167, ceiling 167); eslint on the changed sources 0;
`tests/architecture` 21 files, 347 passed; `npm run build` 0, then `vendorPdfLazy` + `bootSmoke` 49 passed, 17 skipped; the guard
6 passed; the guards before (`bar5*`, `bar6*`, `leftLines`): 174 passed, 1 failed, `bar6MarksLaw8` (a) "an instance not left by
name: 17": RED AT THE BASE with the same message, named, not chased. `tests/lint` (N2): 69 failing tests by name at the base and
69 at the tip, the same names (`comm`: the one line apart is the worktree path inside `ledgerCitationIntegrity`'s message).
N3 not run: nothing under `src/generators/` changed.
