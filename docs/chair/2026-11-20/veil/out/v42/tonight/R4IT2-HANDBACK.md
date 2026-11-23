# R4I-TONIGHT-2 HANDBACK (VEIL-42, chain B; rulings 40.3 (2), 40.7 (2), (3), 40.8 (3)). STOPPED EARLY: the run was ended at about 06:58 UTC, before any of my heavy runs held the mutex.

Branch `lane/veil-42-2026-11-23-tonight-wip` (local, never pushed), cut at 9f9b819f7. Brief `briefs/R4I-TONIGHT-2-BRIEF.md`
at 015b3c020 (with its ADDENDUM, N59). No message from the seat about the "77" reached me.

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
