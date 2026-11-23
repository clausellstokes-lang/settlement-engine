# TRAD4-RECUT — hand-back (VEIL-44; IMPORT-DOOR's unit 0; builder TRAD4-RECUT)

Branch `lane/veil-44-2026-11-23-trad4-wip`, cut at b58abc48b. Tests only: one new file
`tests/security/galleryImportEqualsRead.pglite.test.js` and one row in `scripts/mutation-coverage-manifest.json` (a walker asked
for it). Nothing in `supabase/`, the registry, `scripts/veil/` or `src/`; `tests/security/traditionDescriptionSharedPage.test.js`
never created or edited (TRAD-4's block was read only, by `git show 14f16760b:...`).

## STOPS
**None.** Three mismatches with the brief, none of which stopped the work, each open to the seat's veto:
1. The brief names `src/store/saves.js`. There is no such file. The save is `src/lib/saves.js :: supabaseSave`, and the file's header says how
   it stores a document.
2. (b) as written allows only what `fetchDossierForImport` strips or adds. The clone (`saves.save`'s entry `.settlement`) also carries
   `importGallerySettlementImpl`'s own on-purpose changes. So (b) is cut into two seams: (b1) the fetch, exactly as the brief puts it,
   and (b2) the clone, which allows only the keys `CLONE_RULES` names, each with the step that changes it, and only the re-derived
   string paths `REDERIVED_STRINGS` names. The full list is below.
3. The first whole run took 2,994 s against a 3,000 s hook guard. FINDING (performance, not a leak): `get_gallery_dossier` joins
   `_gallery_public_tile_rows()`, the whole public tile set, on every read. With the 840 share rows kept, a gallery read cost about 3.07 s;
   with one row at a time it cost 0.22 s, the same as the import. The test now deletes each share's row once it has been read and imported
   (2,894 s fell to 477 s, and every count and the tooth's record were byte-identical in the two runs). The pool's guard is 7,200 s.

## TAKEN AND DROPPED (by the block's own titles; also in the file's header)
- TAKEN: the birth of the 140, using the block's `born` (6 tiers round-robin, 7 cultures in runs of 6, seeds `trad4-u8-<tier>-<culture>-<i>`).
  The save is `withPublicProse(t, composePublicProse(t))`. That equals `supabaseSave`'s `data`, because the neighbour step is a no-op,
  which is asserted for every town. Also taken: the served read on PGlite over THIS tree's migrations 001..212, all of them and in file
  order; the import through `importGallerySettlementImpl` + the real `fetchDossierForImport`, with the block's mocks (rpc → PGlite
  `import_gallery_dossier`, `saves.save` captured); the clone. From "THE IMPORT PATH (a)" the file keeps its shape: every town served
  and imported, the seed gone, the clone compared with what was served.
- DROPPED: every tradition row, `plantOf`, the KEEPER_HOUSES plant; "NOT VACUOUS"'s plant and keeper halves; "CONTROL (arm 3)", "THE
  ROUND TRIP (client)", "THE ROUND TRIP (server)", "NAMES NOTHING HIDDEN", "THE IMPORT PATH (b)", "MEASURED (CTR9)". All of them read
  the traditions modules this lane lacks. Also dropped: the block's partial server (hand-made tables plus six `netCurrentFn` bodies).

## THE ASSERTIONS (5 `it`s; 140 towns × 3 markers × Reveal off/on = 840 shares, each a row of its own, importable)
Markers: unmarked `{}`, the default `writeShareVeil({}, [])`, and the hand marker as um.probe.jsx builds its `hand` (OPEN, AT of
tell-common.mjs).

| arm | what | result at 08c131826 |
|---|---|---|
| (c) NOT VACUOUS | 140 towns, 6 tiers, 7 cultures; 6 shares and 6 imports per town; `fetchDossierForImport` called 840 times; the neighbour step a no-op; for each marker, ≥1 town withholds a row | GREEN. Rows withheld: unmarked 140 towns / 280 shares / 235,224 rows (stored → served); default 140 / 280 / 70,864 (unmarked served → marked served); hand 140 / 211 / 69,763 |
| (a) import = gallery read | `import_gallery_dossier(slug).data` equals `get_gallery_dossier(slug).data` through `sameModuloIds` (today identity on sorted-key JSON) | GREEN: 0 differences of 840. Persons with `allowImport` false: 0, so the `for_import` exception is allowed nowhere |
| (b1) the fetch | `dossier.settlement` = served `data` less `seed`, `_seed`, `_config`, `config._seed`, `dmNotes`, `dossierNotes`, `narrativeNotes`; a string may differ only by the civility mask (`veilText`); envelope id/name/tier = the row's | GREEN: 0 differences. Strips applied 0 times (the server never serves those keys); masks 0 |
| (b2) the clone | top-level keys differ only as `CLONE_RULES` names; every clone string stands in the served `data` except under `importedFrom` and at the 7 `REDERIVED_STRINGS` paths; no seed | GREEN: 0 differences |
| THE TOOTH | scratch copy of a marked share's served `data` with one veiled path restored from the unmarked read | reds (a) and (b2) (the real `expect(...).toEqual([])` throws), then the unplanted copy passes both. Recorded: `thorp germanic #0 Hartwiese \| default \| off: history restored, 2 reds ... $.history.currentTensions (length 0 vs 1)` |

(b2), measured: the keys that differ, with the shares each differs in. `importGallerySettlementImpl`'s literal:
`neighbourNetwork` 840, `interSettlementRelationships` 840, `importedFrom` 840. `rederiveServed` (VR25): `economicState` 840,
`defenseProfile` 840, `powerStructure` 840 (breakdown, recentConflict), `spatialLayout` 840, `activeConditions` 228. `castsNotKnown`:
`stress` 228, `stressors` 228. `normalizeSettlement` defaults: `simulationTrace` 420, `aiOverlays` 420, `userCanon` 420. The rules
also name `config` and `neighborRelationship`, which differed 0 times. Re-derived strings the served `data` lacks: crimeTypes type/desc
390 each; `powerStructure.recentConflict` 840; quarters name/location/desc 2,916 each; landmarks 3,798.

## tests/lint WHOLE (ledger ref first: review-fixes-2026-07-08 = 235efce1a)
- base b58abc48b, run here (not mc-base: that tree is 23bb8b8ae, not mine): **17 failed files | 48 failed | 3256 passed (3304)**
- d14488985: 18 | 49 | 3255. The ONE new offender was `mutationCoverageManifest.test.js > TOTALITY`, which asked for a row.
- 42da5e0a8 (the row: rationale, `pglite-executed`, as its siblings): **17 | 48 | 3256**, failing titles IDENTICAL to the base (diff empty).
- 08c131826 (the faster pool): **17 | 48 | 3256 (3304)**, failing titles IDENTICAL to the base (diff empty; `logs/lint-base-fails.txt`, `logs/lint-08c131826-fails.txt`).
The file has no negative matcher. Its hooks take literal-constant guards (900,000 ms boot; 7,200,000 ms pool).

## CONFIRMED vs PLAUSIBLE
- CONFIRMED (executed twice, 140 towns, 5/5 green, tallies identical): (a), (b1), (b2), (c), and the tooth, as above. The gallery
  read's cost grows with the public row count in PGlite: 3.07 s with 840 rows kept, 0.22 s with one row.
- PLAUSIBLE: that the per-read scan of `_gallery_public_tile_rows()` costs the same in production, where it grows with the public
  gallery's size (measured only on PGlite). Also PLAUSIBLE: that the seat meant (b) to cover the fetch only; the clone's extra keys are
  all on-purpose steps of `importGallerySettlementImpl`, named, not judged.

Commits: 1f2961c58, d14488985 (WIP, UNPROVED), 42da5e0a8, 08c131826, and this hand-back's own commit, which is the pushed tip of `lane/veil-44-2026-11-23-trad4-wip` (its SHA is in the seat's report).
