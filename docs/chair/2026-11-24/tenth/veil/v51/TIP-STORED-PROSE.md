# TIP? STORED-PROSE ced3b1de7 (VEIL-51, unit 1; written 23:24 UTC 2026-11-24)

THE DIFF: `lane/veil-51-2026-11-24-c2-wip` = ced3b1de750a65590bb3b861395e2834dab50c18 (VEIL-41's builder's commit, no new commit of
mine; it already holds the lane's tip b58abc48b, CONFIRMED by `merge-base --is-ancestor`). `git diff b58abc48b ced3b1de7`: 14 files,
+555 -106. THE 212 HUNK FOR THE CHAIR'S WHOLE READ (N96 (d)): `supabase/migrations/212_share_veil_later_cures.sql`, +36 (38 changed
lines); src: `galleryWithholdAlways.js` +28, `rosterChoiceRegistry.js` 63; the registry JSON +120; the rest tests and a report.
212 sha d71abc9e86139cd9ad8d8cd27067642e445b802fca8600a90483a989b7848ac5, rollback 8cbd7d1c7a6d60f609b7473b14b7fe2b2ca8a3b6f3081151c2ae49d82cded5b0:
EQUAL to VEIL-41's receipts, so ppkey's 0 of 46,752 reads carrying `publicProse` (page, link, import, twin) stands, not re-run.

Every receipt below is CONFIRMED (run by me in this container, `docs/chair/2026-11-24/tenth/veil/v51/p1.sh`, logs under
`/var/tmp/v51/out/p1/`, one mutex hold a step; instruments unchanged from detached worktrees: meas and dump at d71a3ee44).

## WHY VEIL-41's FOUR MEASURES DIED IN ABOUT TWO SECONDS (one line)
Its v41 copy of `meas.sh`, run from its documents checkout, sets `MEAS_BIJ_MOD` to `<checkout>/tests/security/personIdBijection.shared.mjs`,
a file only chain B's d71a3ee44 holds: the probe's import throws "Cannot find module", the shard exits 1, meas.sh "A SHARD FAILED" exit 2
(re-run on one shard, step `why`, rc 2 at 21:34:11, the error in `why/meas-shard0.log`).

## THE FOUR WHOLE-DOCUMENT MEASURES (N90; `MEAS_BIJ=0`; template v51_c2 = v27x211 + this tree's 212)
| run | rc | L1 gallery (server vs twin, by value) | L1 link | L2 gallery | read |
|---|---|---|---|---|---|
| ctrl (handreach, MEAS_C=1) | 0 | 33 of 288 | 0 of 288 | 57 of 288 | THE CONTROL BITES: stored ids found served on 288 of 288 reads at every door (as they must without the re-key); the 33 are N106 below on 3 master-shaped docs |
| t140 (fresh, gallery+link) | 0 | 0 of 3,360 | 0 of 3,360 | 84 of 3,360 | L2 = `prominentRelationship`, Reveal off, 7 places: N117, the covert tie (V6: unit 3's) |
| st140 (140 today-born stored, every door) | 0 | 0 of 3,360 | 0 of 3,360 | 84 of 3,360 | the same N117 class, the same 7 places |
| sm140 (140 master-born stored, every door) | 0 | 352 of 3,360 | 0 of 3,360 | 352 of 3,360 | N106 EXACTLY (32 places, `factions[].power`, 1,969 leaves, Reveal DM, the 11 marked settings): 212's roster guard passes on an absent `power`; cure granted to chain B, not in this tree |
No hit inside `publicProse` on any run; nothing else differs.

## THE GATES
- set55 (re-derived 55 files; VEIL-41's list died with its container; derivation in p1.sh's head, the list `v51/set55.txt`): 3 failed of
  1,152 in 1 file = EXACTLY chain A's 3 (`rosterChoiceComposedHosts.walker`: power.desc, power.label, power.relation.dmNote; red by design,
  unit 2's worklist). VS1 green (PIN-3). 1,152 = VEIL-41's count.
- cures (`galleryVeilCures.pglite`, `migrationRehearsal`: rollback and catalogue): 47 of 47.
- `tests/lint` whole: 25 failed of 3,280 in 17 files = VEIL-41's figure. ONE IS THE UNIT'S OWN: `proseDrawnAnchors` "no NEW file carries a
  literal state-prose anchor" receives `tests/security/galleryVeilHandRows.pglite.test.js: 1 (frozen none)` (V41-PINS HandRows D; VEIL-41's
  69c07953e cut 2 to 1 and left this one). The other 24 are the tree's standing reds. (The tip: 48 of 3,304, VEIL-41's record.)
- `tests/copy` whole: 2 failed of 172, both `voiceMechanics` (V2's class; untouched by this diff).
- typecheck ratchet: 167, ceiling 167, OK. eslint on the diff's src and tests files: 0 errors.
- build: built; the dist pins 4 red of 66, ALL THE TIP'S: the same build on b58abc48b (step `tipbuild`) reads the same bytes (worker
  2,579,751 B, same hash, ceiling 2,579,708; engine 910,255 vs 909,928; first paint raw 1,175,552 vs 1,175,492). This diff adds +0 raw
  bytes at first paint, engine and worker. Brotli 314,043 here vs 314,122 on the tip (budget 313,994). Size rises are the owner's.
- After the checks: core.bare false; user and gpgsign from /root/.gitconfig only (no local override); no Fixture commit in 3 hours.

## TABLE A (from VEIL-41's `out/v41/pins/PINS-REPORT.md` at ccc2e5473; PLAUSIBLE: read, not re-probed by me)
Fourteen component sites read a publicProse block. THIRTEEN PRINT NOTHING on a served record (economy, general, stressors, the eight
defense lenses, power desk, ladder rung, governance, warFaith, magic, isolation, the viability verdict, overview identity, the dossier's
ShippedProse). ONE PRINTS A LOCAL LINE: `defenseDeskRead.js :: criminalRingNoteRead` = `criminalStructureOf(served).note`, the ORIGINAL
vantage (the owner's player view prints the seeded variant; they differ on soak1k-11 and -41: the FIDELITY GAP, named, not pinned).
Beside them, three tab-local lines equal composed strings (the Shadow Economy scale note; Defense's safetyDesc and
guardEffectivenessDesc). `src/pdf/**` reads none. PARKED_RUNG_DROP = 2 (the twin exposes no step before withhold-always).

## LINE B
The owner's Curate screen shows `block:power.criminalUnderside` in its Power section as the row "The capture reading"
(`galleryVeil.js :: CURATE_SECTIONS`), HIDDEN by default (`STATIC_DEFAULT_GROUPINGS`: "X-21c: Power's capture reading").

## OWED BEFORE A MERGE, AS I READ IT
The chair's whole read of the 212 hunk (N96 (d)). The HandRows literal anchor (1) is the unit's own lint red: computed per the walker's
message, or ruled. N106 and N117 ride elsewhere (chain B; unit 3).
