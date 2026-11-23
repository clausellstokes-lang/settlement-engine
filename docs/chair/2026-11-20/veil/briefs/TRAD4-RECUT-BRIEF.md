READS WHOLE: this brief; the block "TRAD-4 UNIT 8" of `tests/security/traditionDescriptionSharedPage.test.js` at 14f16760b (its lines 937-1139: `git show 14f16760b:tests/security/traditionDescriptionSharedPage.test.js | sed -n 937,1139p`); `src/store/galleryImportSettlement.js`; `src/lib/gallery.js :: fetchDossierForImport` (that function only). NOTHING ELSE WHOLE: 212 and the registry are NOT read whole (you edit neither). WINDOW: 1,000,000; BUDGET about 350,000.

# TRAD4-RECUT — brief (VEIL-44; IMPORT-DOOR's unit 0, as the brief's RE-STAMP item 3 says; each ruling vetoable by the owner)

You are a BUILDER of the share veil's lane. TESTS ONLY: no line of `supabase/`, the registry, `scripts/veil/` or `src/`. A red that can
only be cured by one of those is a STOP, reported, not cured.

## Where you work
- Worktree `/home/user/wt/trad4`, branch `lane/veil-44-2026-11-23-trad4-wip`, cut by the seat at `lane/veil-44-2026-11-23-door-wip` (the
  lane's tip, no re-key). `node_modules` and `.husky/_` linked to `/home/user/wip`'s.
- THE SAME LAWS AS `briefs/MAPCOVERT-RED-BRIEF.md` "Where you work" (read that section only): every database local; the `E=` prefix; runs
  over a minute through the mutex, backgrounded, exit appended, waited for in pieces under ten minutes; never a gate through a pipe; the
  ledger ref before `tests/lint`; commit by explicit paths after each step and push your own branch by its own name; never `--no-verify`,
  never a force push, NEVER A PULL REQUEST; "WIP, UNPROVED" before a wait over ten minutes; a refusal of your permission check stands.

## THE UNIT: THE PIN "AN IMPORT EQUALS THE GALLERY READ"
THE SOURCE: TRAD-4's block (14f16760b on `origin/lane/trad-4-2026-11-20-u8-wip`): 140 born towns, saved, served through PGlite on the
migrations, imported through `importGallerySettlementImpl` with `fetchDossierForImport`, the clone compared with what was served. The file
is NOT on this tree, and the block imports three modules the lane lacks (`src/domain/traditions/traditionDescription.js`,
`shownTraditions.js`, `src/data/traditionDescriptionTable.js :: KEEPER_HOUSES`).
THE RE-CUT, as a NEW file `tests/security/galleryImportEqualsRead.pglite.test.js` (a basename outside the mutation manifest's pattern; if a
walker asks for a manifest row, add it and name it):
1. Keep ONLY: the birth of the 140 (every tier, at least six cultures, as the block does it), the save (as `src/store/saves.js` stores a
   document: N5/E134: say how), the served read through PGlite on THIS tree's migrations 001..212, the import through
   `importGallerySettlementImpl` + `fetchDossierForImport` (the block's mocks of the rpc and `saves.save`), the clone.
2. DROP: every tradition row, `plantOf` and the KEEPER_HOUSES plant, the owner's-page and names-nothing-hidden arms (they read the
   traditions modules). Say in the file's header, by the block's own titles, what was taken and what was dropped, and why.
3. THE ASSERTIONS, for every town, on MARKED shares (the default `writeShareVeil({}, [])` and one hand marker as `um.probe.jsx` of
   `origin/lane/veil-42-2026-11-23-meas-wip` builds its `hand`) AND UNMARKED (`{}`), at Reveal OFF and ON (`gallery_share_dm`), importable:
   (a) `import_gallery_dossier(slug).data` EQUALS `get_gallery_dossier(slug).data` for the same share, value for value (ruling 56; ruling 57
       (b): an unmarked share's import equals its listing), EXCEPT where the import's own gate differs: a person whose `allowImport` is false
       (the splice's `for_import`): list any such difference by name and by that rule; nothing else may differ;
   (b) THE CLONE: the clone's document rows equal the served `data`'s, except what `fetchDossierForImport` strips or adds on purpose (read
       it: the seed, `_config`, notes, the civility mask; list each by name);
   (c) NOT VACUOUS: the 140 cover every tier; at least one town per marker carries a row the veil withholds (so equality is not two empty
       documents), counted and asserted.
   THE ID LAW: at this tip person ids are not re-keyed, so the comparison is by raw value; WRITE IT THROUGH ONE COMPARATOR FUNCTION in the
   file (`sameModuloIds(a, b)`), today the identity, so that at the R4-IDS merge the seat switches it to
   `tests/security/personIdBijection.shared.mjs` (on the R4-IDS branches, not here) in one line. Say that in the header.
4. EXPECTED: GREEN at this tip (212 restates the import with the veil; ruling 56 measured it byte-equal at decc8c9e7). A red is a FINDING,
   not a cure: report it by town, marker and path. THE TOOTH: plant a difference (a scratch copy of the served row with one veiled path
   restored) and show the assertion reds; restore it; say so.
5. `tests/lint` WHOLE after the file (the ledger ref first), the count beside the same run at the base (the MAPCOVERT-RED builder's base run,
   `/home/user/wt/mc-base`, may already exist: reuse its figure if its tree is 23bb8b8ae, and say so).
6. YOUR REPORT `docs/chair/2026-11-20/veil/out/v44/trad4/TRAD4-RECUT-HANDBACK.md`: STOPS first; what was taken and dropped; the assertions'
   counts; the tooth; `tests/lint`; CONFIRMED vs PLAUSIBLE; last line your commits and pushed tip. Final message: at most 200 words + one table.
