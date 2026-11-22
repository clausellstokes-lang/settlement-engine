# SAVED-TOWN (fortune U7): a saved town keeps the fortune law it was born under, proved end to end on the LIT build (tests only). Written 2026-11-20T20:18:45Z by FORTUNE-4 on the chair's order of 20:03 and 20:17 UTC.

THE FORTUNE TWIN of the who-rules lane's SAVED-SEAT unit (`docs/chair/2026-11-20/content/seat/briefs/SAVED-SEAT.md` on
`origin/lane/seat-7-2026-11-20`: read it whole by `git show`; TAKE ITS SHAPE arm for arm, so that the two fold into one test
over `GENERATION_LAWS` at the join). The owner decided at ~19:13 UTC that the law SHIPS LIT; the default's flip is the
chair's at the close. This unit proves BEFORE the flip that no path but a birth changes a saved town's law.

READ FIRST: `COMMON.md` (its laws bind; its paths for the veil are `src/domain/display/publicSafe.js` and `galleryVeil.js`).
Then WHOLE: `tests/domain/livingContentLawWiring.test.js` (its describe "NO MIGRATION — a law-1 world stays law-1 on every
path, on the LIT build" is your TEMPLATE: how it lights the build by mocking the law module's dial, the store's load, the
`regenSection` seam, the clone seam, and `it('⛔ THE STOP: a section regen never stamps a law onto an existing world')`);
`tests/domain/fortuneLawWiring.test.js` (how the fortune dial is mocked: `vi.doMock` of `src/domain/fortune/fortuneLaw.js`);
`src/domain/fortune/fortuneLaw.js` whole; `LIGHTING-WORKLIST.md` section (c) (beside this folder).

BRANCH: `git worktree add -b lane/fortune-4-saved-2026-11-20 <your dir> <the commit FORTUNE-4 names>`, then `npm ci` there.
Push as `lane/fortune-4-2026-11-20-saved-wip` after your commit (`git ls-remote` first; push only if the remote differs).

FILES YOU OWN (nothing else): NEW `tests/domain/fortuneLawSavedTown.test.js` (the basename clear of the mutation manifest's
words: census, scan, baseline, ratchet, walker, parity, coverage, golden, contract, pin, ...); your report
`docs/chair/2026-11-20/content/fortune/briefs/SAVED-TOWN-REPORT.md`. NOTHING under `src/`. If a path DOES re-stamp or
re-read the law wrongly, that is a FINDING: write the red arm, mark it `it.fails` ONLY if FORTUNE-4 rules so, and STOP with
the path by symbol; the cure is a separate unit.

THE LIT BUILD IN THE TEST: the fortune dial mocked lit (`fortuneLaw.js :: NEW_SETTLEMENT_FORTUNE_LAW_VERSION` =
`SIZE_RELATIVE_FORTUNE_LAW_VERSION`, so `newSettlementFortuneLaw()` mints 2 at a birth). Assert at the top of each arm that
the build IS lit (the template's guard), so a later flip cannot make an arm vacuous. "Keeps law 1" means at every step: the
config carries no `_fortuneLawVersion`; `resolveFortuneLawVersion` reads 1; and where the step re-runs generation,
`powerStructure.publicLegitimacy` and the prosperity fields equal the dark build's.

ARMS (each a red-first PLANT recorded in your report: the plant, its failing title, restored):
1. THE NO-MIGRATION ARM: a town born on the DARK build (markerless: assert `_fortuneLawVersion` absent) goes, on the LIT
   build, through: JSON stringify/parse (a save and a load); the store's load path (`src/lib/settlementConfigMigration.js ::
   migrateSettlementConfig` and the template's slice); `regenSection` (`src/store/settlementRegenAction.js ::
   regenSectionAction`) of the POWER section and of the ECONOMY section; the edit re-derive (`src/store/editSlice.js ::
   storedConfigFor` -> `src/store/settlementRederiveAction.js :: regenerateWithLayer`); the clone seam (`deepClone`);
   several ticks of `src/domain/timeProgression.js :: advanceTime`. At EVERY step "keeps law 1" holds. NEGATIVE CONTROL:
   pick a town (a city or a metropolis is likely) where law 2 WOULD differ (its legitimacy score or band, or a prosperity
   field): the same step on the same town stamped `_fortuneLawVersion: 2` differs. Plant: a step that stamps the marker
   (e.g. the load spreading `newSettlementFortuneLaw()`) must red this arm.
2. THE CONVERSE: a town born LIT (marker 2) keeps 2 through the same steps: no step strips the marker or reads it dark.
   Plant: a step that drops `config._fortuneLawVersion` must red it.
3. THE SURVEYOR'S UNMINTED PREVIEW (the chair, 20:03, ruled): `src/components/surveyor/ConstructionPanel.jsx :: commit`
   saves `generated.dossier` produced by `generateSettlementPipeline(config, ...)` WITHOUT `birthConfig`: on the lit build it
   stays law 1 (markerless). Pin it as it is, by the module the commit calls (do not render the component unless the template
   does), and say in the title that it is a preview, unminted, pinned as ruled.
4. THE BIRTHS THAT ARE BY DESIGN: "Apply Saved Configuration & Regenerate" (`SettlementsPanel.jsx :: onLoad` -> a Generate
   through `src/store/settlementGenerateAction.js`) AND the full reroll of a town on screen (the same action) are BIRTHS: a
   saved dark town's configuration regenerated on the lit build is born lit (the clamp drops an incoming marker; the dial
   writes 2). Pin both, the title saying it is a birth, not a migration.
5. THE LEGACY EDGE (PLAUSIBLE, worklist (c)): a legacy save with NO `settlement.config` regenerated by `regenSectionAction`
   (`cfg = settlement.config || config`) while the store's form config holds a LIT world's `_config` (a lit town loaded
   first). MEASURE what happens: if the markerless town reads the law lit, that is a FINDING: STOP and report (no cure here).
6. THE IMPORT: a gallery file carrying `_fortuneLawVersion: 2` keeps it through `src/lib/importScrub.js ::
   scrubImportedConfig` and `scrubGalleryImportLivingContent`; a markerless import stays markerless.
(The campaign re-bind, `src/store/campaignContentBindingSession.js`, `save.config || save.settlement._config || {}`: one
step of arm 1 if the template reaches it cheaply; else list it in your report as not driven.)

PROOF IN YOUR REPORT: red and green per arm (plant and restore, each failing title quoted); every test file naming
`fortuneLaw.js` (`grep -rl fortuneLaw tests`); `tests/lint` WHOLE (green but the census arms your new file moves: the
lighting census; FORTUNE-4 takes it); `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`. Every run
to a file, read by its count lines (`sh scripts/gate-tail.sh`), never through a pipe, default TMPDIR; never the whole
suite. No statement packed onto a shared line. Report <=350 words plus ONE table (arm, plant, red title, green). Commit by
explicit paths, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; no census rows.
