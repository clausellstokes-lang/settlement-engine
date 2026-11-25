# LANDING-117: WHAT THE CHAIR ORDERED AFTER POINT 117's GATE (14:19 UTC 2026-11-25). Two builders. Read no wider than named.
The chair's lists are on the chair branch (601264de05 or later):
`git show origin/lane/chair-2026-11-08:docs/chair/2026-11-24/tenth/landing/117/{classified.txt,new-reds-messages.txt,raised-top.txt}`.
The tree for every item is 97c6bfc7a (the first hand-in).

THE TEN LINES:
- Each build item is on its own branch, cut at 97c6bfc7a, in its own worktree that you make (node_modules and .husky/_ linked).
  Commit there; never push.
- Never `--no-verify`.
- No model identifiers in commits; the trailer as before.
- Runs go through the mutex, to a log with `exit=`.
- Never read a gate through a pipe.
- No golden or fingerprint is re-recorded.
- If your permission check refuses an action, stop and say the command and the reason.
- Label each cause CONFIRMED (run) or PLAUSIBLE (read).
- RUN THE PRE-PUSH CHECKS IN YOUR OWN WORKTREE: `npm run typecheck:ratchet` and `npm run typecheck:domain:strict` (or the
  hook's own lines). A push from another checkout checks THAT checkout's tree, not your branch.
- Write partial results to your report after every run.

BUILDER T (TYPES, then FIRST PAINT and WRITER-REACH):
(1) TYPES on `lane/close-7-2026-11-24-types-wip`, cut at 97c6bfc7a:
    - JSDoc ONLY at `assembleInstitutions.js:451` (TS2322), `pageCensusFindings.js:442` x2 and `genesis.js:198` x2 and
      `dossierViewModel.js:767` (TS2345), `factionArchetypes.js:107` and `seatTable.js:240` x2 (TS7006);
    - the typecheck ratchet and strict both green by run, quoted.
(5a) FIRST PAINT grew 11,165 raw / 3,040 gzip: which file brought what into the eager chunk (is a census reader such as
    pageCensusFindings in first paint?), BY A BUILD'S CHUNK MAP OR STATS, and what a buy-back would be (do not build it).
(5b) The writer-reach register's `closureSizes` ROSE by 2 on campaign-pdf, dossier-pdf, foundry, web-transitive and world-book:
    which keys, by which unit; and the register's diff since ddca5c789, verbatim.
Report `close-7/reports/TYPES.md`. Final: at most 150 words.

BUILDER R (READS ONLY: no file under src/, tests/ or scripts/ changes):
(3) THE SIX that are not anchors: read the cause of each from its test's words and the code it names, and give the unit that moved it
    (A1 / A2 / the mirror / GUARD / B1(i) / B1(ii) / C1 / P3source):
    - statecraftExposureBand U1 (scandals 78 vs a ceiling of 57 in the seeded 20-year run);
    - goals.test I-13 (keyed determinism; Portaminus's short goal changed: a real determinism loss, or a pinned value that
      followed the births?);
    - goalSentencesOnceInTown (all five tiers);
    - tailDisplayCivicBatch2 (a cured chip prints again on r2s-occupied-town-3: a regression?);
    - tailCrisisBatch8 (Merchant Guilds prints a stake row on r2s-famine-city-1).
    That is five tests; the chair's list names six: take the sixth from `classified.txt` if it names it.
(4) THE FOUR FIGURES:
    - hookThemeDraws 2,147 -> 2,145;
    - heraldKnowledgeDeskGolden's digest;
    - dossierProseManifest (golden-master-v3 cells; the mixed-pool arm 214 -> 213);
    - townCartographyCalibration W2 (three desert rows; its re-record arm asks a written reason).
    For each: what it is, whose signing or which door, which way it moved, and by which unit.
Report `close-7/reports/READS-117.md`. Final: at most 200 words, a line per item.
