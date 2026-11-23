# R4I-TONIGHT-2 HANDBACK (VEIL-42, chain B; rulings 40.3 (2), 40.7 (2), (3), 40.8 (3)). STOPPED EARLY: the run was ended at about 06:58 UTC, before any of my heavy runs held the mutex.

Branch `lane/veil-42-2026-11-23-tonight-wip` (local, never pushed), cut at 9f9b819f7. Brief `briefs/R4I-TONIGHT-2-BRIEF.md`
at 015b3c020 (with its ADDENDUM, N59). No message from the seat about the "77" reached me.

## RESUMED 08:37 UTC (the seat: N69 (4)); STATE AT THE WIP COMMIT (10:2x UTC)
- HOLD A (07:45-08:00) and HOLD B (08:00-08:34) ran. shareRenderTwice RED FIRST (the patched harness on 9f9b819f7, R2):
  MAIN 4 rows, every one a non-id row, the Tonight sheet's want line (metropolis-calm-2, gallery and link, desktop and
  phone: "use this crisis to take the seat ..." | "be the one people turn to ..."); TONIGHT arm 4 rows; 2 of 5 failed. GREEN
  (G3): 5 of 5. The 30 d-files (G4): 238 of 238, 30 files.
- N69 (4): the probe's TWIN halves read a raw row with no served marker (M's "77" fault), and so did shareRenderTwice's TONIGHT
  arm (`env.twinRow`, the unmarked `writeShareVeil({}, [])`): BOTH RE-POINTED in the tree to the twin's projection (gallery
  `projectShareVeil(galleryPayloadFor(stored, ...))`, link `linkTwin.shared.mjs :: linkTwinOf`); the probe adds the server's
  served document (L1) beside the page's read of it (L2, `servedPage`, named, not red). THE SERVER HALVES STAND:
  server2 (a) on the 140: red 58 of 140 places (gallery|off 41) -> green 0 of 140; on the pool red 728 of 1,808 (green: not
  yet run); (c) ownerServer on the 140: role line on both 0 (red 0), goal withheld 16 a read. THE TWIN HALVES of holds A/B
  are NOT TRUSTED and are re-run (hold C: srt red/green and the arm on the 140; hold D: the pool red/green).
- Trials of the re-pointed probe, 8 of the 140: uncured (a) twin2 3 of 8 places, server2 3 of 8, (b) 3 of 8; cured 0, 0, 0.
- OWNER-MOVES: the 140, 0 lines moved of 374 people (owner-before-140 vs G1's owner dumps); the owner's page voices 0 role
  lines on the 140 and 3 on the pool (of 837 cast persons), so the pool's count is at most 3 (after: hold D).
- Hold C then D then E (lint, copy, typecheck) are QUEUED (`/var/tmp/r4it2/holdC.sh`, `queue3.sh`) behind R4I-MEASURE's
  pool run, which has held the mutex since before 08:43.

## HOLD C (11:43-11:58 UTC), THE TWIN RE-POINTED: C PROVED ON THE 140 (the pool: hold D, running from 11:58)
- shareRenderTwice, the re-pointed harness on 9f9b819f7 (RED, logs/srt2-red.txt): 2 of 5 failed: MAIN 3 rows, every one a
  non-id row, the Tonight sheet's want line (metropolis-calm-2, gallery/desktop, gallery/phone, link/phone); TONIGHT 3 rows
  ("server, two reads", "twin vs server", "eight salts give 3 sheets"). On the cured tree (GREEN, logs/srt2-green.txt): 5 of 5.
  The first red (hold A, logs/srt-red-patched.txt) gave MAIN 4 rows: the count moves with each run's salts, and every row is
  the want line. CONFIRMED.
- THE ARM ON THE 140 (four reads a place: gallery|link x Reveal off|DM; twin = the projection), logs/arm2-*-140-table.txt:
  (a) twin2 58 of 140 places differ -> 0; server2 61 -> 0. (b) twin vs served 58 -> 0; the served document vs the page's
  read of it (beside) 55 -> 0. (c) nothing-hidden places (48): a role line on both owner and shared sheet: 0 persons (red 0),
  before and after; goal withheld by the read (named, not red): 16 persons in 14 places a read (off, link|dm), 0 on
  gallery|dm; other line moved 2 on gallery|dm (owner's secret, served temperament: the DM read withholds the secret; named).
  Named: `C-OWNER-HALF-140.md`. CONFIRMED.
- WHAT CARRIES OVER FROM HOLDS A/B: the server halves (a) server2 (140: 58 -> 0; the pool red 728 of 1,808) and (c)
  ownerServer; shareRenderTwice MAIN (the page through the server) and its green; the 30 d-files 238/238; the owner dumps
  (OWNER-MOVES: no twin in them). RE-RUN: every twin half (twin2, twinServer, ownerTwin) and shareRenderTwice's TONIGHT arm.
- OWNER-MOVES on the 140: 0 lines moved of 374 people (`OWNER-MOVES.md`).

## HOLD D (11:58-12:57 UTC): C PROVED ON THE POOL (1,808 places; the twin the projection)
- (a) twin2 729 of 1,808 places differ -> 0; server2 719 -> 0. (b) twin vs served 723 -> 0; served vs the page's read (beside)
  723 -> 0. (c) nothing-hidden places (1,200): a role line on both: 2 persons a read; RED (moved) 0 to 2 a read before
  (ownerTwin gallery|off 1, link|off 1, gallery|dm 2, link|dm 0; ownerServer 2, 2, 2, 0) -> 0 on every read after; goal
  withheld by the read (named, not red): 554 persons in 522 places a read (0 on gallery|dm); other line moved 36 on gallery|dm
  (named). Named: `C-OWNER-HALF-POOL.md`. All four shards rc=0 both runs. CONFIRMED.
- OWNER-MOVES on the pool: 2 lines moved of 4,787 people, both cast-voiced levers (t2b-village-none-1906 Dokuz Ongut;
  t2p-village-none-22 Rain Goddess May): "decide who gets the shelter ..." -> "share out the shelter ...". `OWNER-MOVES.md`.
  The pool's red-vs-red owner dumps (hold B vs hold D's red): 0 moved (the dump is deterministic).
- Hold E (tests/lint, tests/copy, typecheck ratchet, domain strict) started 12:57 at 7ea3dfc69.

## COMMITTED
1. 550e2e427 docs: `out/v38/r4it/` brought from `lane/veil-42-2026-11-23` (said); the three-halves arm
   `out/v42/tonight/tonight-arm2.probe.jsx` + `.sh` + `-an.mjs` + `-named.mjs`; the hand-back (then a skeleton; this file now).
2. 47980d744 N: `tests/security/criminalSwitchSalt.test.js:114` anchored (`^`, flag `m`). RED FIRST `netCurrentExtractorAnchor`
   1 failed of 7 (that file, line 114); GREEN 7 of 7; `criminalSwitchSalt` 6 of 6. 212 holds 53 definitions anchored and
   unanchored alike. CONFIRMED (single-file runs; /var/tmp/r4it2/logs/n-*.txt).

## C: APPLIED IN THE WORKTREE, NOT COMMITTED (its heavy proofs are not read)
- `C-prepared-cure.patch` applied CLEANLY (`git apply`), then 40.7 (3) by hand: `castWantKeyOf(name)` returns `clean(name)`,
  no id parameter; its JSDoc says the key never reads the id and a nameless person takes '' (M: 0); both callers pass the
  name only (`tonightSheet.js :: peopleOf`, `crisisFactFindings.js :: crisisCastSenseFindings`); `TonightPerson.castId`'s doc
  no longer calls it the want's key.
- `C-prepared-shareRenderTwice.patch` applied CLEANLY.
- Re-pinned by cause: `tests/components/tonightSheetOnce.test.jsx :: castLinesOf` keys `castWantKeyOf(npc.name)` (was `r.id`).
- N57 grep of tests/ for every moved key and CAST_WANTS line: readerBattery (a finding's text: key-agnostic), tonightOwnGoal,
  crisisStandInWords, crisisFactFindings.wants (direct `castWantOf` calls on fixed keys: key-agnostic, unchanged),
  tonightSheetOnce (re-pinned), repeatOnceTonightTraditions and tonightWantRegister (pool membership only).
- LIGHT RUNS ON THE CURED TREE, all green: crisisFactFindings.wants + tonightOwnGoal + crisisStandInWords 14/14,
  tonightSheetOnce 4/4, tonightSeatSecret 3/3, repeatOnceTonightTraditions 2/2, readerBattery 42/42, crisisBlindWidened 10/10,
  tonightConcreteFirst 10/10, tonightWantRegister 5/5, tonightSheetCast 4/4, crisisFactFindings 9/9, tuningRegister walker
  76/76 (no register re-take needed), pdf goldenViewModel 4/4, npcNoLookVoiceTell 2/2, sections.smoke 29/29, fullPdf.render
  26/26. eslint on the five touched files: 0. No golden or snapshot found pinning a Tonight want. No "sameness" walker exists
  in this tree. PLAUSIBLE until the heavy runs are read.
- `src/` is byte-identical b088fcfc5..9f9b819f7 (`git diff --quiet b088fcfc5 9f9b819f7 -- src`; the 204-file import closure
  of `tonightSheet.js` too): the 140's OWNER-MOVES "before" is `out/v38/r4it/owner-before-140/` as it stands (not re-taken).
- Arm trial (uncured, 10 of the 140, twin and server, /var/tmp/r4it2/trial): (a) twin2 differs in 4 of 10 places, server2
  4 of 10; (b) twinServer 4 of 10; gallery|dm equal everywhere; (c) role line on both 0, goal withheld 2 (named). Teeth shown.
- (b) at the page: no existing arm compares the SHEET served vs twin; galleryWithholdAlways / galleryRosterChoices compare the
  document path by path. The arm probe's (b) and shareRenderTwice's TONIGHT arm (3 towns) build it.

## STILL QUEUED (nohup; it runs after this run ends): `/var/tmp/r4it2/queue1.sh`
- hold A (`holdA.sh`, one hold, in order): R2 shareRenderTwice RED (the patched harness on `/var/tmp/r4it2/base`, a `git
  archive 9f9b819f7`) -> `logs/srt-red-patched.txt`; R3 arm RED on the 140 -> `/var/tmp/r4it2/arm-red-140/arm-table.txt`;
  G1 arm GREEN on the 140 -> `/var/tmp/r4it2/arm-green-140/`; G3 shareRenderTwice GREEN -> `logs/srt-green.txt`;
  G4 the 30 d-files -> `logs/d-after.txt`.
- hold B: R4 arm RED on the pool (its owner dumps are the pool's "before" at 9f9b819f7) -> `/var/tmp/r4it2/arm-red-pool/`.
- Logs in `/var/tmp/r4it2/logs/`; `holdA.txt`, `holdB.txt`, `queue1.txt` carry each step's EXIT line.

## LEFT, EXACT COMMANDS (in /home/user/wt/tonight; R=docs/chair/2026-11-20/veil/out)
1. Read the holds' EXIT lines. `node $R/v38/r4it/owner-moves.mjs $R/v38/r4it/owner-before-140 /var/tmp/r4it2/arm-green-140 140`
   into `$R/v42/tonight/OWNER-MOVES.md`; the (c) names: `node $R/v42/tonight/tonight-arm2-named.mjs /var/tmp/r4it2/arm-green-140 140`.
2. G2, the pool green: `GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- env RV9_SERVER_DB=r4it2_grn sh $R/v42/tonight/tonight-arm2.sh /home/user/wt/tonight /var/tmp/r4it2/arm-green-pool v28tpl /var/tmp/v18/t2/pool-v42`;
   then `owner-moves.mjs /var/tmp/r4it2/arm-red-pool /var/tmp/r4it2/arm-green-pool pool` appended to OWNER-MOVES.md.
3. Commit C by paths: `src/domain/summary/tonightSheet.js src/domain/coherence/crisisFactFindings.js
   tests/security/shareRenderTwice.pglite.test.jsx tests/components/tonightSheetOnce.test.jsx` with OWNER-MOVES.md and this file.
4. L: through the mutex, `sh scripts/gate-tail.sh npx vitest run tests/lint` and `... tests/copy`, by name against
   `/var/tmp/r4it2/lint-48.txt` (the tip's 48) and r4ip4's four; after N only writerReach's three new are expected.
5. D: `npm run typecheck:ratchet` (ceiling 167) and `npm run typecheck:domain:strict`, through the mutex.

## FOR THE JOIN
`src/domain/summary/tonightSheet.js` (the new export `castWantKeyOf`; `castWantOf`'s parameter `personId` -> `personKey`;
`peopleOf`'s `castWantOf` call; the JSDoc of `CAST_WANTS`, `castWantOf`, `TonightPerson.castId`) and
`src/domain/coherence/crisisFactFindings.js` (the import of `castWantKeyOf`; `crisisCastSenseFindings`' `castWantOf` call
and its comment) join R4-IDS's manifest.
