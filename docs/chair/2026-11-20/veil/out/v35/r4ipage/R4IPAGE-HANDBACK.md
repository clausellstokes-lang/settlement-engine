# R4I-PAGE HANDBACK (VEIL-35, chain B; stopped by the owner's stop order, 22:58 UTC). WIP.

Branch `lane/veil-35-2026-11-22-r4ids-wip`, not pushed. Commits: 1d8ef0264 (the twin and the arms), c7a50cd10 (instruments
from 216cb46d8, the stored arm), and this handback commit.

## Built
- `src/domain/display/galleryVeilPeople.js` (new): 212's re-key rule for rule: `readSalt`, `rekeyId`, `rekeyAt`,
  `rekeyEach`, `rekeyPeople` (with STOP 1's card-own ties), `rekeyServed` (the marker, decided by the card). Every rule
  carries `// registry: people.rekey`.
- `galleryVeil.js`: one salt per projection call. `rekeyPeople` runs in `applyVeil` after `applyRosterChoices` and before
  `withholdAlways`, and on `projectShareVeil`'s unmarked path. The twin writes no served marker (there is no writer of a
  v2 marker in src), so `rekeyServed` is the rule, judged by the arms.
- `galleryRosterChoices.js`: ruling 53's fold. `idKeyOf` is folded into `idText`, which is exported. The powers' id set
  still takes only strings and numbers, as 212's `wn_ids` does.
- Part-one file: plants (e) and (f), and THE CHAIR'S ARM. Ruling 53's walker is re-stated in
  `galleryRosterChoices.pglite.test.js`.

## Proofs
- (a) RUN. Red first, all twin-side: arm (1) 18, (e) 51, (f) 12, chair's arm 132. After the twin edit: 12 of 12 green.
  Figures are in proofs.txt.
- (b) NOT DONE: the guards are not re-stated. The reds are listed by name in b-guards-other.txt (16 reds in 6 files) and
  b-guards-security-partial.txt (security run KILLED at 22:22 UTC, partial). Command:
  `sh scripts/gate-tail.sh npx vitest run tests/security --maxWorkers=1`.
- (c) RUN: `--check` 0; the four walkers 30 of 30; the ruling 53 walker 3 of 3.
- (d) NOT RUN separately. Tell3/4/5/8, galleryServerVeil, galleryVeilHandRows, galleryRosterChoices, shareRenderTwice,
  rosterChoiceInversion and criminalSwitchHandReach are in the guard run. galleryServerVeil (11), galleryVeilHandRows (14),
  galleryRosterChoices (2) and criminalSwitchHandReach (12) RED there, unclassified.
- (e) NOT RUN: tests/lint whole was killed by the stop order. Command: `sh scripts/gate-tail.sh npx vitest run tests/lint`
  (the ledger branch was refreshed).
- (f) RUN: typecheck 167 against a ceiling of 167, OK; eslint on the 5 touched files 0.
- (g) RUN: template `v35r4tpl`, pool `/var/tmp/v18/t2/pool-v35r4` (A 21:36 to 21:55, B to 22:05), verify 45 re-read, 0
  differ. GATE-1 is 4 of 92 at every setting, Reveal off and on, twin = server (4 / 4). LOWER BY RULE 7. GATE-2 has 20 red
  cells. No worse than 4 / 7 / 20. See g-gates-tail.txt.
- (h) NOT RUN. Command: `npm run build`, then
  `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js`.
- STORED ARM: NOT RUN beyond the instruments commit. Its reachable part:
  - Part one's two born towns carry publicProse exactly as saves.js stores them (`withPublicProse(t, composePublicProse(t))`).
  - On those, arm (2)'s tooth (ii) searches every string and every key, the marker included. It finds 0 stored person
    ids served. CONFIRMED for those two towns only.
  - Master-born documents: `dump.sh` at a scratch worktree of db832c892, then
    `stored.sh /home/user/wt/r4i35 <dump> <out> v35r4tpl`. Neither has a person-id arm yet; one is owed.

## STOPs
1. PRODUCT CODE, NOT A TEST PIN: `criminalVeilSwitch.js :: offeredAddressesOf` (lines 130-136) compares two `applyVeil`
   outputs byte for byte. With one salt a call, the two always differ, so the curate switch offers every default. Red:
   curateModeCriminalSwitch "no criminal part" (2). The same cause plausibly explains criminalVeilSwitch births (c) and
   criminalSwitchHandReach (12). This needs a ruling (for example, a comparison modulo the bijection); it is not cured here.
2. `tests/lib/gallery.test.js` "a share marked with a veil renders through it" is red at b983c16b6 with HEAD's sources.
   It was there before this unit and is not an id pin.

## Next
Rule on STOP 1. Then re-state the id pins modulo the bijection: publicSafe (7), partyLinkClient (2), people6 (2),
criminalVeilSwitch VR34(b) and (b)/(c), and the security reds once each is classified. After that, run (d), (e), (h) and
the stored arm.
