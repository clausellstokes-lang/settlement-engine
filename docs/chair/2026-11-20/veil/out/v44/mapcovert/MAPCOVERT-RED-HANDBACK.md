# MAPCOVERT-RED — HANDBACK (VEIL-44, chain B's second seat; the builder MAPCOVERT-RED)

Branch `lane/veil-44-2026-11-23-mapcovert-wip`, cut at 23bb8b8ae (no re-key). Tests and probes only: no line of `supabase/`, the
registry, `scripts/veil/` or `src/`. Every database local (PG16 on `/var/tmp/rv7`, PGlite). `package.json`, `package-lock.json`
untouched. Logs and data: `/var/tmp/v18/out/v44/mapcovert/` (not committed; the tables are copied to `logs/` beside this file).

## STOPS (and deviations), first
1. **A PUSH RAN THE WHOLE CHECK, KILLED.** Push 2 (11:09 UTC) found origin already at my tip (push 1's pre-push hook ran while I
   committed 5f5552d88, and push 1 carried it), so the hook saw no ref and ran `npm run check`. Its log showed `test:ratchet`
   starting at 11:13 (waiting on the mutex, never run); I killed the whole tree (git push, the hook, `npm run check`, the
   ratchet's mutex waiter) at 11:21; push exit 143, origin unchanged. Every push since is guarded in the same command
   (HEAD against `git ls-remote ... | cut -f1`, as the seat's 12:07 rule) and ran the lane gates only.
2. **THE DUMP SCRIPT IS NOT ON THIS TREE.** The brief names `docs/chair/2026-11-20/veil/out/v33/legacy/dump.sh` "on this tree"; it
   is not (it lives on `origin/lane/veil-42-2026-11-23-meas-wip`, committed at c7a50cd10). I ran its committed bytes
   (`git show eb0c60920:...` of `dump.sh` and `dump.probe.jsx`, dump.sh byte-equal to c7a50cd10's; sha256 83ffd4d2..., d8eca0a2...)
   from a scratch directory `/var/tmp/v18/out/v44/mapcovert/dumptool/`; nothing of it is committed here.
3. **um.probe.jsx COULD NOT START ON THIS TREE AS COPIED.** It imports `src/domain/display/galleryVeilPeople.js` (rekeyId), absent at
   23bb8b8ae (no re-key); every shard failed at the import (first run, 11:42). rekeyId is read only in M's branch (UM_M=1), so
   748e715d1 loads it only under UM_M=1. One line; U's reads are unchanged. This is a change beyond "add ONLY the assertion mode":
   named here for the seat's veto.
4. The seat's CORRECTION (the chair's N84 (1), 10:54 UTC) TAKEN: control (d), the party link, is added and is the member's acceptance;
   (c) stays a second control; (c) and (d) differences recorded, not asserted. The seat's 12:14 note TAKEN: my counts stand beside
   chain B's below; my two test seeds are among chain B's seven.

## UNIT 1 — THE PLANT, A TEST (`tests/security/galleryMapCovert.pglite.test.js`, new; PGlite, migrations 001..212 of this tree)
Shape: the ruling-5 block's `covertTown` (an open tie; a covert tie whose description, tension and phrasing carry `mapcov1..3`;
`prominentRelationship` the covert tie's copy; `pressureSentence` its phrasing, naming both ends). Each share on its own
`map_with_campaign` map (`saved_maps`, `gallery_share_campaign`, `campaign.settlementIds` = the town, one owner: the 046 guard).
Markers: unmarked `{}`; the default `writeShareVeil({}, [])`; a HAND marker (um.probe.jsx's `hand`: tell-common.mjs's OPEN at AT).
Chain B's two places born in the test as the tell gate births its 140 (tell-common.mjs :: loadEngine's birth: DEFAULT_CONFIG +
the dials + size + crisis, generateSettlementPipeline over birthConfig, publicProse composed) and stored as
`src/lib/saves.js :: supabaseSave` stores a document (withNeighbourNetworkFromRelationship, asserted a no-op: no
neighborRelationship; then withPublicProse). Both births BYTE-EQUAL to the dump's `stored-today/<seed>.json` (cmp, 12:09).

RED at 9e8c33a91 (run 3, 12:10 UTC, `logs/test-run3.full.log`): **3 failed | 5 passed (8)**:
- × `MAP-COVERT (a): get_gallery_map's member ...` — 24 sends: on each of the 3 markers at Reveal off, the covert copy, the
  covert-telling sentence, `mapcov1`, `mapcov2`, `mapcov3` (twice), and both keys present where the link has neither.
- × `MAP-COVERT (b): import_gallery_map's member ...` — 24 sends, the same.
- × `MAP-COVERT (a) and (b) on chain B's two places ...` — 60 sends: r3m-town-wartime-0-29 and r3m-city-none-1-107, both doors,
  3 markers: the covert copy byte-equal, its full and tension (and phrasing), `prominentRelationship` present where the link has none.
GREEN (the controls): `(c) THE CONTROL` (the gallery read), `(d) THE CONTROL, the member's acceptance` (the link), `THE TOOTH`
(an open tie's copy, no covert tie: served as stored on the gallery read, the link, the map member and the map import, 3 markers),
`(c) THE CONTROL on chain B's two places` (each stored copy covert by the twin's rule; (c) and (d) withhold it),
`REVEAL DM, RECORDED NOT RULED` (36 cells handed). Not skip, todo or `fails`.
(c) against (d): they AGREE on both keys at Reveal off on every marker (plant and places): `MAPCOVERT-CD ... agree`.

REVEAL DM AS OBSERVED (recorded, not ruled; `logs/records.txt`), each on all three markers:
| town | gallery | link | map member | map import |
|---|---|---|---|---|
| plant | copy + sentence | neither | copy + sentence | copy + sentence |
| r3m-town-wartime-0-29 | copy + sentence | sentence only (stored, not covert-telling) | copy + sentence | copy + sentence |
| r3m-city-none-1-107 | copy (no stored sentence) | neither | copy | copy |

## UNIT 2 — THE ARM ON BOTH STORED SETS
Copied unchanged (17b302f45, from eb0c60920), then 5f5552d88: `UM_ASSERT=map` in `um-an.mjs` (per door x marker x key, the map reads
at Reveal off — `get_gallery_map` member, its page `fetchGalleryMap`, `import_gallery_map` member — carrying the stored covert copy
or covert-telling sentence; exit 1 on any, or on a run that read nothing); `um.sh` names the mode. Stored sets: `stored-today`
(mc-tip 23bb8b8ae, 140, publicProse composed), `stored-master` (mc-master db832c892, 140). Template v28tpl (the seat's, from
/home/user/wip at 23bb8b8ae; its 212 sha256 ff20ed89 = this tree's).
- **today: EXIT 1 (RED)**: 7 of 140 stored copies covert, 0 sentences; **7 of 7 reads in each of the 9 cells** (3 doors x 3 markers)
  = 63 carries. Places: r3m-city-none-1-107, r3m-city-infiltrated-0-42, r3m-metropolis-infiltrated-0-62, r3m-town-wartime-0-29,
  r3m-city-infiltrated-1-102, r3m-city-under_siege-1-118, r3m-metropolis-none-1-137 — CHAIN B'S SEVEN, the same count (c08f514d1's
  U-UNMARKED: 7 of 7 in each cell). Beside chain B's widened trial (1 place): 1 of 1 per cell then, 7 of 7 now.
- **master: EXIT 0**: 0 of 140 stored covert copies (master writes no `covert` flag), 0 of 0 reads per cell: the no-covert control,
  as chain B's `ummaster`. A green here is vacuous by construction, not a cure.
THE DOORS EACH RUN READ: the gallery read (`get_gallery_dossier`) and its page (`fetchPublicDossier`) 0 of 7 at off, 7 of 7 at DM;
the import (`import_gallery_dossier`) and its page (`fetchDossierForImport`) 0 of 7 off, 7 of 7 DM; the map member
(`get_gallery_map`) and its page (`fetchGalleryMap`) 7 of 7 off and DM; the map's import (`import_gallery_map`) 7 of 7 off and DM;
the link (`get_unlisted_dossier`) 0 of 7 off and DM; `get_unlisted_map`: hands no member dossier (0 of 140).

## tests/lint WHOLE (ledger ref first: review-fixes-2026-07-08 = 235efce1a)
- base 23bb8b8ae (`/home/user/wt/mc-base`): **17 failed files | 48 failed tests | 3256 passed (3304)**.
- 9e8c33a91: 18 | 49 | 3255: ONE new offender, mine: `mutationCoverageManifest.test.js > TOTALITY` asked for a row.
- 33079c5d5 (the row: `scripts/mutation-coverage-manifest.json`, `galleryMapCovert.pglite.test.js`, rationale `pglite-executed`, as
  its siblings): **17 | 48 | 3256 passed (3304), the failing titles IDENTICAL to the base (diff empty; `logs/lint-base-fails.txt`, `logs/lint-33079c5d5-fails.txt`)**.
No negative matcher in the file (no `// anchored:` needed). `pgliteHookTimeoutRatchet.test.js`: green beside it.

## DROPPED, AND WHY
`import_gallery_dossier` is not asserted in the test (not a map door; unit 2 reads it). No pressureSentence plant on born places: 0
of 140 tell one. Nothing else.

## CONFIRMED vs PLAUSIBLE
CONFIRMED (executed): the fault on (a) and (b) for the hand plant and both places, every marker, Reveal off; the controls (c), (d),
the tooth green; 7 of 7 per cell on stored-today, 0 on master; the births byte-equal to the dump. PLAUSIBLE (read, not run): that
the cause is 211 :: `get_gallery_map` never calling 212 :: `_gallery_apply_member_overrides` (chain B's reading; consistent with
every count); that a cured member agreeing with (d) on the two keys will turn (a), (b) and the arm green.

Commits: 17b302f45, e4c862faa, 5f5552d88, 343c5d675, 748e715d1, 9e8c33a91, 33079c5d5, and this handback's own commit, which is the pushed tip of `lane/veil-44-2026-11-23-mapcovert-wip` (a file cannot name its own hash; the report to the seat names it).
