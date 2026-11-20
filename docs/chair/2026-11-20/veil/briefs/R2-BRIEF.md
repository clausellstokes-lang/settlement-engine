# R2 BRIEF — the withhold-always rows (VR16 rule 1), the withhold-always numbers (VR33) and the five rows found drawn (VR37)

Written by VEIL-21 (seat of the seventh chair; assignment `lane/chair-2026-11-08 ::
docs/chair/2026-11-20/seventh/prompts/VEIL-21.txt`). You are a BUILDER working for VEIL-21. A security lane: a slip is
a leak. MEASURE FIRST, RED FIRST. A failure falls toward WITHHOLDING, never toward sending.

## Where you are
- Your worktree and branch are named in the message that sends you this file (a worktree of the seat's container, cut
  from the seat's lane tip that carries this file). You COMMIT ON YOUR BRANCH, by explicit paths, ONE commit for the
  stage; you NEVER push (the seat pushes your branch, reads your diff line by line, re-runs your red and green).
- Read whole, before any edit: `CLAUDE.md`; `docs/chair/2026-11-19/veil/briefs/SUB-BRIEF-VR7.md` (the specification:
  design points 1 to 6, R2 in point 5, RULING VR16 whole); `src/domain/veil/rosterChoiceRegistry.js` (its header, its
  legend, and every row this stage builds: the rows whose `server` is `public._gallery_veil_withhold_always`, plus the
  rows the rulings below re-class); PART 21 sections 5, 5b, 5c, 5e
  (`docs/chair/2026-11-20/veil/COHERENCE-VEIL-HANDBACK-PART21.md`); 212 whole
  (`supabase/migrations/212_share_veil_later_cures.sql`, sha256 at your base `fec111c205018b3f…4acea3`) and its
  rollback; the twin `src/domain/display/gallerySecondHomes.js` and `src/domain/display/galleryVeil.js` whole; the two
  harnesses `tests/security/shareRenderTwice.pglite.test.jsx` and `tests/security/rosterChoiceInversion.pglite.test.js`.
  Any other file you change or judge, read whole once.

## THE LAWS (binding word for word; from `prompts/VEIL-17.txt` on `lane/chair-2026-11-08`)
211's two files stay BYTE-FROZEN (sha256 `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` and
rollback `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f`; prove both before your first edit and in
your commit message): EVERY CURE GOES INTO 212 AND THE CLIENT'S TWIN. A house hidden whole, and anything that gives it
away, never reaches a non-owner read (the gallery read, the party link, the import send, the public page, the map; both
stored shapes; Reveal DM on and off). WHERE THE VEIL CANNOT BE SURE, IT WITHHOLDS. THE COST LAW: no read more than twice
the frozen 211 on the reader's 300 KB row, its V8-3 row and the largest born town; a read never fails where 211 serves.
RED FIRST: each cure is shown red on its own row before it is cured. ALL DATABASES LOCAL: in-process pglite or the
seat's scratch PostgreSQL 16 (unix socket `/var/tmp/rv7`, `listen_addresses = ''`); no hosted database, no production
credential, no `supabase` command, no `migration repair`, no deploy, no push, no pull request.
ALSO: never `--no-verify`; never the whole suite; no test run with any of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE,
GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY, GIT_PREFIX or GIT_NAMESPACE in the environment; `package.json` and
`package-lock.json` untouched; never `src/components/gallery/CurateMode.jsx` or
`src/domain/display/criminalVeilSwitch.js` (VEIL-V102's seat holds the switch; its `criminalVeilSwitch.test.js` VS1 (b)
and (c), eight reds, are KNOWN and NOT YOURS: name them, do not touch them); never DOORS's parts of 212 (the
`get_gallery_dossier` `chronicle` expression and the tile columns, `_gallery_public_tile_rows`, the chronicle helpers,
`get_gallery_map`'s member expression) nor the registry rows `tile.*` / `chronicle` (VEIL-DOORS-2's). Every gated
test line through `scripts/gate-mutex.sh --run` (`GATE_MUTEX_TIER=shared`, `--maxWorkers=2`); read a gate by
`sh scripts/gate-tail.sh <cmd>`, never through a pipe. A new helper called only inside the definer read functions is
REVOKED from PUBLIC, anon and authenticated BY NAME in this same commit (VR27 as amended). A new top-level named numeric
constant is forbidden (carry numbers in a frozen object). The owner's own reads and exports of their own town are
UNTOUCHED (VR16 (3)): withhold-always is for non-owner reads only.

## THE STAGE (SUB-BRIEF-VR7 point 5, R2)
"R2 rule 1: the undrawn fields withheld always (and the VR14 (i) numbers, the band's condition, `spatialLayout.quarters`)."
Build the server host `public._gallery_veil_withhold_always` in 212 (each rule commented `-- registry: <id>`) and the
twin host `gallerySecondHomes.js :: withholdAlways` (each rule commented `// registry: <id>`), called on EVERY non-owner
read (gallery read, party link, import send, public page, campaign map and its import; both stored shapes; Reveal DM off
and on; whatever the veil, including a share that hides nothing and an unmarked read). Mark each row you build
`built: true`; regenerate `registry.json` / `rulings.json` with the export (`scripts/veil/rosterChoiceRegistry.mjs`),
never by hand; `--check` exit 0; the walker (`tests/lint/rosterChoiceRegistry.walker.test.js`) green: every built row's
host exists in both engines and names the row.

## THE RULINGS IN FORCE THAT BIND R2 (the seventh chair's, final; each vetoable by the owner; where PART 21 or the sub-brief differs, THESE GOVERN)
- VR28, THE TIERS. TIER 1, BLOCKING: of a house the DM hid whole, no name, person who holds it, tie, sentence,
  crime-worded label or cause, sequence gap, column or door beside the main document, and no precise figure that
  DIFFERS from what the served document gives, reaches a non-owner read. TIER 2, RECORDED, NOT BLOCKING: a coarse band
  from a closed ordered vocabulary is sent as stored: `economy.prosperity`, `prosperityStanding`, `safety.safetyLabel`,
  `defence.readiness.label` and its colours, the stability band word, a condition's `severityBand`, and a sentence chosen
  by one of them. `economy.prosperity` and `history.founding.overcoming` STAY as R1 registered them (diffuse): do not
  re-class them.
- VR32: the inversion test compares a served value against its re-derivation from the SERVED values AS SERVED, bands
  included; a figure that equals it passes.
- VR33, THE WITHHOLD-ALWAYS NUMBERS (tier 1; withheld on EVERY non-owner read, both stored shapes, no shape test):
  `defence.scores.*` (all six) and `defence.economicGates`; `defence.readiness.score`; a condition's `severity` number;
  `compound.criminalEffective`, `militaryEffective`, `safetyProfile.safetyRatio`; an income row's `weight` (built in D:
  confirm, do not rebuild). The page re-derives from the served document where the deriver ships with it (VR19 (c)),
  else does not draw. The registry rows `defence.scores.*` and `defence.economicGates` are R1's `diffuse`: R2 RE-CLASSES
  them withhold-always with `page: 're-derive'` (or `'not drawn'`, measured), in the module, not by hand in the json.
- VR37, THE FIVE ROWS FOUND DRAWN (PART 21 5b; the render-twice harness's `KNOWN_DRAWN`), BY THIS ORDER OF PREFERENCE:
  (a) the page re-derives the value from the served document; (b) where an entry names its house or its faction, it is
  withheld PER ENTRY by that house's eye, never always, and what is left is dense (VR21); (c) only then withheld always,
  the page not drawing it, the loss listed.
  `conditions.severity`: the number withheld, the band served (`severityBand` becomes tier 2, sent as stored), the
  chips drawn from the band. `defence.readiness.score`: withheld; the label stays; the page re-derives the score or
  draws the label alone. `cast.stakes` and `cast.roles`: (b). `power.relation.direction`: by the order; SAY WHICH AND
  WHY. Each of the five leaves `KNOWN_DRAWN` (shrink-only) with its class. YOUR HAND-BACK CARRIES THE TABLE: row, class,
  what the page shows after.
- VR21: after the veil removes a member of a sequence, no counter, index, id sequence or count taken before the removal
  reaches a non-owner read (a per-entry withholding of `cast.*` leaves the rest dense).
- R5's LAW (keep it in mind; R5 builds the composed rows): a served value composed from a withheld one is withheld or
  recomposed with it, numbers included. If an R2 withholding leaves a SERVED composed value that pins the withheld
  number down, name it in your hand-back (do not build R5).
- VR16 (2), THE IMPORT: the import never carries what a non-owner page withholds; where the importer's app needs a
  withheld field it is re-derived at the save from the served data alone (`src/domain/veil/importRederive.js ::
  rederiveServed`, VR25, built) or read as "not known". MEASURE FIRST, for every row R2 newly withholds that VR25's ten
  do not cover (at least `defence.scores.*`, `defence.economicGates`): what the importer's own record draws without it.
  A field neither covers comes to the seat BEFORE you build around it.
- NOT IN R2: the import keeping the served prosperity band (PART 21 5e point 1) is the side builder's
  (`briefs/VR25-OWED-BRIEF.md` unit 3, the chair's placement of 02:42 UTC); do not touch `importRederive.js` for it.

## MEASURE FIRST (the act that could refute this brief; report it before building if it does)
At your base, through the server (pglite chain or the scratch cluster): for each row R2 builds, is it present on each
non-owner read (gallery, link, import send, public page, map member; both stored shapes: the new, and master's via the
master worktree `/home/user/wt/master` as `RV9_GEN`; Reveal DM off and on; a share hiding nothing)? A row already absent
everywhere is recorded, not rebuilt. For the five drawn rows: which component draws each, and what the page shows when
the value is absent today (blank, NaN, "undefined", a wrong chip?).

## WHAT GREEN MEANS (all executed, each with its output file under `docs/chair/2026-11-20/veil/out/v21/r2/`)
1. RED FIRST: a born test (new or extended; a `tests/security/*.pglite.test.js` basename that avoids the mutation
   manifest's name pattern unless it owes a row, and owes the manifest's `pglite-executed` rationale like its siblings),
   THROUGH THE SERVER on born towns, the twin beside it, showing every built row present on a non-owner read at the base
   (red), absent after (green), on every read and both Reveal settings; the owner's read still carrying them; the
   twin equal to the server. Red output kept (`red.txt`), green kept (`green.txt`).
2. The render-twice harness: `KNOWN_DRAWN` EMPTY (each of the five classed and struck), MAIN arm byte-equal, 4 of 4.
3. The inversion harness 4 of 4; `KNOWN_INVERTING` shrinks where a row is now withheld (`defence.scores.internal`);
   name what remains and its tier.
4. Registry `--check` exit 0; the walker green; the export regenerated.
5. The six guard files (`GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2
   tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js
   tests/security/galleryVeilCures.pglite.test.js tests/security/galleryServerVeil.pglite.test.js
   tests/security/gallerySanitizer.pglite.test.js tests/security/galleryMapMemberCount.pglite.test.js`), VR17's
   `tests/security/galleryVeilSignalCopies.pglite.test.js` and `tests/lint/veilCopySites.walker.test.js`, the twin's
   tests (`tests/domain/display/publicSafe*.test.js`, `tests/components/publicProseVeil*.test.js`,
   `tests/lib/gallery.test.js`, `tests/store/galleryImportRederive.test.js`), every test file that names a module you
   changed: green, or each red named and attributed (the switch's VS1 (b)/(c) are known).
6. The acceptance run (REVIEW-VEIL-7: `cd /var/tmp/v18 && PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v18/pgmod sh
   lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh <your worktree> <outdir>`): EXIT 0, 37 of 37.
7. `npm run typecheck:domain:strict`, `npm run typecheck:ratchet`, `npx eslint <touched files>`, each through
   `sh scripts/gate-tail.sh`.
8. THE COST (VR36), once after the change: `docs/chair/2026-11-19/veil/measure/v8245-cost.sh` (the V8-3 row, 50/500/500,
   the two 300 KB rows; x211 | base | after) and the largest born town (Albaorum, ~499 KB; the method of
   `docs/chair/2026-11-19/veil/measure/bcd-big-cost.mjs`): the Reveal-DM gallery read bound by TWICE 211's Reveal-OFF
   read of the same town; every read serves.
9. 212's and its rollback's sha256 after; the rollback restores what it must (212's rollback drops what you add).
10. One commit on your branch, by explicit paths, the receipts in its message; the author read back.

## YOUR HAND-BACK (a file `docs/chair/2026-11-20/veil/out/v21/r2/R2-HANDBACK.md`, committed with the stage; your final message at most 300 words)
The commit; the rows built (ids); the VR37 table (row, class, what the page shows after); the import measure's answer;
red and green; the harnesses; guards; acceptance; cost rows; 212's sha256 pair; every pin red and left; what you ran
(CONFIRMED) told from what you infer (PLAUSIBLE). Stop at about 300,000 tokens of your own context: commit what is green,
write the hand-back, stop.
