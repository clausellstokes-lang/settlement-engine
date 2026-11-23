# R4I-PAGE-2 — brief (R4-IDS's twin, second builder; VEIL-38, chain B). READ WHOLE: this brief; `src/domain/display/criminalVeilSwitch.js`; `src/domain/display/galleryVeilPeople.js`; `tests/security/personIdBijection.shared.mjs`; `docs/chair/2026-11-20/veil/out/v35/r4ipage/R4IPAGE-HANDBACK.md`. In `src/domain/display/galleryVeil.js` read `applyVeil` and `projectShareVeil` WHOLE as functions, the rest by grep. EVERY OTHER FILE is read by grep, or as one test's body when you classify that test. YOU NEVER OPEN OR EDIT migration 212, its rollback, `src/domain/veil/rosterChoiceRegistry.js` or `registry.json` (beyond a grep).

Written by VEIL-38 on 2026-11-23 (`lane/veil-38-2026-11-23`). The owner may veto it. The cure's design is `briefs/R4-IDS-BRIEF.md` PART TWO, and its server side is built (R4I-SQL, b983c16b6). The twin was built by R4I-PAGE (1d8ef0264): its diff was read once by the seat with NO FAULT. This brief takes up the list R4I-PAGE left undone (PART 36 section (2c)) and the chair's two rulings on its stops (E136 (b)).

## WHERE YOU RUN
- Worktree `/home/user/wt/r4ip2` on the LOCAL branch `lane/veil-38-2026-11-23-r4ipage2-wip`, cut at fd7163ba6 (the seat makes it; `node_modules` is a link to `/home/user/wip/node_modules`). Commit there by explicit paths, one commit per item. NEVER push, never `--no-verify`, never a pull request.
- Do not touch the seat's worktree `/home/user/wip`: its instruments and pool read that tree while they run.
- Every database is local: pglite, or the scratch PostgreSQL 16 at socket `/var/tmp/rv7` (`PGHOST=/var/tmp/rv7 PGUSER=postgres`, databases named `r4ip2_*`; the template `v27x211` = 001..211, and `v28tpl` = it + the -wip's 212).
- No `supabase` command, no hosted database, no deploy.
- Every test run is `env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE`, to a log file, through `sh scripts/gate-tail.sh <cmd>`, and its result is read from the log's exit line, NEVER through a pipe. pglite files run with `--maxWorkers=1`, or 2 for `tests/security` whole. A heavy run (over 5 minutes) goes through `sh scripts/gate-mutex.sh --run -- <cmd>`.
- First run `git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD` in the worktree, so that the ledger ref exists before any `tests/lint` run.

## ITEMS, IN THIS ORDER (each its own commit; red first where it cures; STOP and report rather than invent)

### S1 — THE SWITCH'S ONE SALT (E136 (b), ruled; NOT "modulo the bijection")
THE FAULT: `criminalVeilSwitch.js :: presentCriminalGroupings` compares `JSON.stringify(applyVeil(payload, []))` with `JSON.stringify(applyVeil(payload, [d.address]))`. The ruling names `offeredAddressesOf`, but the byte comparison is here; it feeds `present` to `criminalPartsOf` / `criminalSwitchStateOf` / `setCriminalVeil` (`CurateMode.jsx`, the OWNER's curate screen). Since the re-key, each `applyVeil` call draws its own salt, so every grouping "differs" and the switch offers every default.

THE CURE AS RULED: the switch's projections run under ONE salt, passed in on the OWNER'S OWN PAGE only.
- `applyVeil(publicSettlement, veil, opts)` takes an optional third argument `{ salt }` (a string). Given one, it uses it in place of `readSalt()`; absent, behaviour is byte-identical to today.
- `presentCriminalGroupings` draws ONE `readSalt()` and passes it to EVERY `applyVeil` call it makes.
- NO OTHER CALLER passes a salt: `projectShareVeil`'s and `projectServedVeil`'s calls never do, and 212 has no salt parameter.
- THE SERVER NEVER TAKES A SALT FROM A CALLER: you change nothing on the server. A test reads 212's text and shows that no function `_gallery_veil*`, `get_gallery_dossier`, `get_unlisted_dossier` or `import_gallery_dossier` has a parameter named like a salt, and that `_gallery_veil` draws it inside.

ITS GUARD: a walker (in an existing security or lint file of the lane, or a new `tests/security/criminalSwitchSalt.test.js`; check the mutation-manifest name pattern for the basename) proves that `applyVeil`'s third argument is passed from `criminalVeilSwitch.js` alone among `src/` (grep of call sites). A plant shows the walker can fail.

ITS ARM ("the switch offers exactly what it offered before the re-key"):
- REFERENCE: the tree with `galleryVeilPeople.js :: rekeyPeople` mocked to the identity (`vi.mock`): exactly the tip's (af708f2fd's) twin before the re-key.
- On the lane's births and plants (the tell gate's 92 towns and 48 controls through `docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs`, as the Tell arms take them; plus `criminalSwitchHandReach`'s and `curateModeCriminalSwitch`'s fixtures), for Reveal DM off and on: `presentCriminalGroupings`, `criminalSwitchStateOf`, `setCriminalVeil(…, true/false, …)` and `flipCriminalVeil` must be EQUAL, set for set, between the cured tree and the reference.
- Red first: with S1 unapplied the arm reds (say the count). Green after.
- ALSO write `docs/chair/2026-11-20/veil/out/v38/r4ip2/switch-offer.probe.jsx` plus a one-command `.sh`: the same comparison over a pool directory's part-B seeds (`RV9_POOL_DIR`, the shape `pool.sh` writes), run through `/var/tmp/v18/rv9/vitest.config.mjs` as the tell2 probe is. Run it on the 92 + 48 yourself. The seat runs it on its pool.

Expected: `curateModeCriminalSwitch` "no criminal part" (2), `criminalVeilSwitch` births (c) and `criminalSwitchHandReach` (12) green after S1. Say which do and which do not.

### S2 — `tests/lib/gallery.test.js` "a share marked with a veil renders through it: the defaults hide, a delta shows"
It is red at b983c16b6 (the server side only). READ IT BY CAUSE FIRST, before anything is built on it:
1. Run it at af708f2fd (a scratch worktree of the tip, never committed to) and at fd7163ba6.
2. Read the assertion that fails and what it compares.
3. If the re-key caused it (an id or marker key pinned byte for byte, or anything the salt moves), cure it INSIDE R4-IDS: an id pin is re-stated modulo the bijection (below); a product cause is cured in the twin or reported to the seat.
4. If it is red at af708f2fd too, or for a cause outside R4-IDS: CHANGE NOTHING and report it to the seat with the cause, as a STOP.

### G — THE VR46 GUARDS (every red classified BY NAME; the id pins re-stated)
- THE 16 REDS in six non-security files (`out/v35/r4ipage/b-guards-other.txt`). Run the 34 files that call `galleryPayloadFor` / `applyVeil` / `projectShareVeil` / `get_gallery_dossier` / `get_unlisted_dossier` (find them by grep) once AFTER S1, to a log.
- THEN `tests/security` WHOLE, once AFTER S1 (it was killed at 167 tests with 41 reds unclassified; about an hour or more: through the mutex, in the background, read in pieces). Save the failing titles to `out/v38/r4ip2/g-security.txt`.
- EVERY RED gets ONE class, in a table `out/v38/r4ip2/G-CLASSES.md` (file, title, class, the line that pins, the cure):
  - (i) AN ID PIN: a served person id, tie id or marker key compared byte for byte (against another read, the owner's record, the 210 page or the twin). RE-STATE IT MODULO THE READ'S PERSON-ID BIJECTION AND NOTHING ELSE (`personIdBijection.shared.mjs :: unkeyPeople`, `canonPeople`, `bijectionTeeth`; its FIVE TEETH executed per re-stated guard: a reference that does not follow its card reds; a stored person id served anywhere reds; a changed non-id byte reds; the re-key is a bijection within a read; two reads of one town differ). The guard keeps every other byte it held.
  - (ii) S1's cause: green after S1, nothing re-stated.
  - (iii) THE TIP'S OWN RED: `galleryVeilHandRows.pglite.test.js` "V7-2 THE PRESSURE SENTENCE", the row "STAYS: the power structure's recentConflict". It is red at af708f2fd by E136 (e) (a stale pin; chain C re-states it on the tip). Prove it red at af708f2fd too; do NOT re-state it here.
  - (iv) ANY OTHER RED: A STOP. Name it with its cause to the seat; do not cure it.
- `galleryServerVeil` (11), `galleryVeilHandRows` (14: one of them is (iii)), `galleryRosterChoices` (2) and `galleryVeilCures` (2) are the partial run's known families: read each by cause.
- After the re-statements, re-run every file that reded, until each is green but (iii).
- `tests/lint` WHOLE after this item (below).

### A — THE ARMS ON THEIR OWN (each file its own run, to its own log)
- Tell3, 4, 5, 8: `tests/security/galleryVeilTell{3,4,5,8}.pglite.test.js`.
- The part-one file `galleryVeilIds.pglite.test.js` (the plants (a)-(f) and the chair's arm). Plus a NOTE of the seat's read to cure: in the chair's arm, the LINK's first read is judged against ITSELF (`ref = refsOf(x.doc)`). Anchor it to the twin's reference, as the gallery read is, or say why it cannot be.
- `galleryServerVeil`, `galleryVeilHandRows`, `galleryRosterChoices`.
- The harnesses `shareRenderTwice.pglite.test.jsx`, `rosterChoiceInversion.pglite.test.js`, `criminalSwitchHandReach.pglite.test.js`.
- The walkers `tests/lint/rosterChoiceRegistry.walker.test.js`, `mutationCoverageManifest.test.js`, `rosterChoicePools.walker.test.js`, `crimeTypesReaders` and `recentConflictReaders`.
- `node scripts/veil/rosterChoiceRegistry.mjs --check`.
- Each count, red and green, goes in the hand-back.

### ST — THE STORED ARM'S PERSON-ID PART (E134 (3); PART 36 ruling 36.6)
The universe of every proof of this lane is the document as `saves.js` stores it: `withPublicProse(t, composePublicProse(t))` for today-born, and master's save for master-born. The read-stored instruments are on the tree (c7a50cd10: `docs/chair/2026-11-20/veil/out/v33/legacy/`: `stored.sh`, `dump.sh`, `legacy.probe.jsx`, `lp-an.mjs`). They have NO person-id arm yet: you write it.
- WRITE `out/v38/r4ip2/stored-ids.probe.jsx` plus a one-command `.sh` taking `<tree> <stored dir> <outdir> <template>` in `stored.sh`'s shape. Over every stored document it reads it through the twin AND the server (Reveal off and on; marked and unmarked as the stored marker says) and reports:
  - (1) every served id, key and slug spelling a withheld power or a hidden house, by the lane's fold, BY SURFACE (0 expected).
  - (2) THE COUNT of stored person ids served UN-RE-KEYED anywhere (substring, key, the marker), with the count IN STORED-ONLY FIELDS said separately (`publicProse` blocks and any other key a birth lacks), EVEN IF 0.
  - (3) two reads share no person id; every reference inside one read resolves (the chair's arm's walk).
  - (4) on master-born documents, what the re-key does to their ids and references: counted, with its controls (a document that hides nothing; a known bad reference planted) failing where they should.
- RUN IT on the small set you can make without the seat's pool: today-born stored documents of the gate's 92 + 48 towns. `dump.sh` with `LP_A=0 LP_B=0 LP_TOWNS=1` gives the towns; make the today-born set at your worktree and the master-born set at a scratch worktree of `origin/master` db832c892 (`git worktree add --detach`, never committed to; its own `npm ci`).
- If `dump.sh` will not run without a pool directory, say so and stop this item with the probe written. The seat runs it whole on its pool.

### L — `tests/lint` WHOLE, at your last commit
Run `sh scripts/gate-tail.sh npx vitest run tests/lint`. Say the count by name against the lane's standing reds: 48 red of 3,304 at af708f2fd by E127's count (the 22 standing + R5-DESC's 26 by design). The list of failing files at af708f2fd is `out/v36/seated/lint-whole-fails-af708f2fd.txt` on `origin/lane/veil-36-2026-11-22` (`git show`). Any OTHER red is yours to cure before you stop: an anchor, the manifest's row for a new test file, a citation.

### B — THE BUILD
Run `npm run build`, then `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js`. Report first paint's three figures and the worker's: `galleryVeilPeople.js` and `sha256Hex` may reach the page only where `galleryVeil.js` already does.

Also run typecheck (`node scripts/check-full-typecheck.mjs`, ceiling 167) and eslint on every file you touched.

## LAWS
- 211 is byte-frozen (`eface6d0…0b01` / `ce8474ff…712f`).
- Make no edit to 212, its rollback, the registry or `registry.json`. If a cure needs one, STOP to the seat.
- A red is red first and SAID.
- Run `tests/lint` whole after any test change.
- A STOP rather than invention.
- STOP EARLY with what is left if the work will not fit about 250,000 tokens. Commit what is done, and write the hand-back `out/v38/r4ip2/R4IP2-HANDBACK.md` at EVERY commit (what is done, with counts; what is left; the exact commands).

YOUR LAST MESSAGE: at most 250 words. Give your last commit; the files; S1's arm red then green; S2's cause; the G table's counts by class; each arm's red and green counts; the stored arm's figures; `tests/lint` whole's count; the build's figures; CONFIRMED vs PLAUSIBLE.
