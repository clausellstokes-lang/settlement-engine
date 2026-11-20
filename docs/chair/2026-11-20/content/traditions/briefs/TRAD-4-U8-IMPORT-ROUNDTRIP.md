# TRAD-4 · UNIT 8 — THE READER'S TRADITIONS ON THE IMPORT PATH, AND THE SAVE/SERVE ROUND TRIP ON MORE THAN FOUR TOWNS

Written 2026-11-20 16:2x UTC by TRAD-4 on the chair's word of 16:08 UTC ("STILL YOURS FOR THE READER: the import path,
and the round trip on more than 4 towns"; REVIEW-VEIL-13 §3, "NOT DONE: import (stub missing then); the 140-town round
trip"). Read `TRAD-2-COMMON.md` first; it binds you (read "TRAD-2" there as "TRAD-4"). Base: `lane/trad-4-2026-11-20` at
`34b71577f` (units 1–5 and 7 merged). Unit 6 is built beside you (docs tools only): path-disjoint.

THIS IS A PROOF UNIT: it adds arms; it changes no source. If an arm finds a LEAK (a reader-facing byte naming something a
DM can hide), STOP at the red, commit nothing of a cure, and report the red with its plant: the chair rules the cure.

## Files you may change
`tests/security/traditionDescriptionSharedPage.test.js` (the traditions' own born test) and, in
`scripts/mutation-coverage-manifest.json`, ONLY the `rationale` string of that file's row (describe units 2, 4, 4b, 7 and
yours). Anything else: STOP and report (a new pglite test file is a change TRAD-4 must approve first: ask in your report).

## Read first (no wider)
The security file WHOLE (its existing round trip: how the drawn rows go through `composePublicProse` / `withPublicProse`
and the server's sanitizer, and on how many towns); `src/store/galleryImportSettlement.js` WHOLE (the import path: the
RPC's payload, then the clone the importer saves); `supabase/migrations/048_gallery_import_dossier.sql` and the latest
migration that redefines `import_gallery_dossier` (find it by `git grep -l import_gallery_dossier supabase/migrations`),
read, never edited; one existing `tests/security/gallery*.pglite.test.js` that exercises the sanitizer or the import RPC
in pglite, for the harness only.

## The arms (red first where an arm can be red: say for each whether it is a PIN, green at base by construction)
1. THE ROUND TRIP, WIDENED: born towns of EVERY tier and at least six cultures, at least 24 (the security reader asked for
   more than 4; 140 is its own figure: use it if the run stays under three minutes, else 24 and say so), each with a
   hideable house planted to keep a rite, under the default veil, the party link, and every Curate address hidden: the
   rows drawn at save (`sharedTraditionRowsOf`), after the server's sanitizer (pglite, the real SQL), are BYTE-EQUAL to
   the client's, name nothing hidden, and carry dense `tradition.shared.<n>` ids. Non-vacuity: every tier contributes at
   least one row with a keeper or a cause.
2. THE IMPORT PATH: a dossier made `gallery_importable`, fetched through the import RPC in pglite, then cloned as
   `importGallerySettlementImpl` clones it (drive the function itself with its `fetchDossierForImport` and `saves`
   collaborators stubbed through `vi.mock`; never re-write its transform): (a) the clone's traditions text (the drawn rows
   under `publicProse`) is byte-equal to what the gallery served, and names nothing hidden; (b) the IMPORTER's OWNER page
   for the clone (`shownTraditionsOf(clone)` and `describeTradition(rec, clone, { audience: 'owner' })`) names no house,
   power, person, founder or event the served document lacked. MEASURE AND REPORT, do not cure: on the clone (its seed
   scrubbed, a new id), how many of the born towns show the importer the SAME traditions set the gallery served (CTR9:
   the reader never derives a set from `id`; the importer is an owner, whose set genesis derives): a mismatch is not a
   leak, it is a finding for the chair.
3. Every arm's planted name is asserted ABSENT only after a control proves the same name PRESENT on the owner's page of
   the source town (the plant reaches the leaf).

## Gates at your commit
Your file; every test file naming `traditionDescription` or `shownTraditions` (`git grep -l`); `tests/lint` WHOLE (the
lighting census may stay red by count: TRAD-4 re-takes it); `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`,
`npm run lint`. The run time of your file alone, stated.
