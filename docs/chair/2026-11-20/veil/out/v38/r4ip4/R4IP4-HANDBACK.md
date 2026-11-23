# R4I-PAGE-4 HANDBACK (VEIL-38, chain B). STOPPED EARLY at the token budget, with what is left below.

Branch `lane/veil-38-2026-11-23-r4ipage4-wip` (local, never pushed), cut at 0755698e6. Brief: `briefs/R4I-PAGE-4-BRIEF.md`
(40e9ab00c); the chair's rulings (b), (c), (e) of 02:38 UTC, by the seat. Logs: `out/v38/r4ip4/logs/` (`*.full.txt` the
whole vitest output; `teeth-*.jsonl` each teeth execution: what bit, what was missed, what could not be built).
Every file run alone, `--maxWorkers=1`, through `scripts/gate-tail.sh`, git variables unset.

## G3 — THE 27 CLASS (i) PINS: 22 RE-STATED GREEN, 5 A STOP (commit: G3)
Each re-stated modulo the read's person-id bijection and nothing else (`personIdBijection.shared.mjs`), in the form of
HandRows' `differServed` (canonical both sides, plus (ii) the fresh-id shape, (iv) `notBijective`, (v) `readsDiffer`) where
two served reads are compared, and `unkeyPeople` against the stored record where a guard finds a person, a tie or a marker
key by its STORED id (checked against the stored card's name, so a shifted canonical order cannot pass as a person). The
five teeth run on each re-stated guard's own reads (`bijectionTeeth`, a second read for (v)); a tooth the guard cannot carry
is said in the test and measured in `teeth-*.jsonl`.

| file | red at 0755698e6 (alone) | after | teeth |
|---|---|---|---|
| criminalSwitchHandReach | 12 failed / 2 passed | 9 passed / **5 failed: STOP** | (B), (C) gallery/link/twin and (D): all five, a second read each; not built: (i)/(iv) one-under-two on the thorp's reads (no reference) |
| galleryServerVeil | 11 failed / 7 passed | 17 passed / 1 failed (RULING 4, item (b)) | law (2)'s page, the clamp: all five bite (8 towns); LAW (4): (ii), (iv) two-under-one, (v) bite; (i), (iii), (iv) one-under-two cannot (tie roles read by tie id) |
| galleryRosterChoices | 2 failed / 37 passed | **39 passed** | (ii), (iii) (through the name check), (iv) two-under-one bite; (v) on the twin reads; (i)/(iv) one-under-two not built (no person reference on the hand towns' reads); (v) not on the beforeAll reads (read once) |
| galleryVeilCures | 2 failed / 30 passed | **32 passed** | F4: (ii), (iv) two-under-one, (v) by hand; (iii) cannot (keys only); V5-4: (ii), (iii), (iv) two-under-one, (v); (i)/(iv) one-under-two not built (no reference) |
| gallerySecondHomes | 1 failed / 5 passed | **6 passed** | (i), (ii), (iv) both, (v) bite; (iii) cannot (the guard reads ties) |

THE STOP (criminalSwitchHandReach, the 5 master-shape towns, Reveal DM on; NOT an id pin, not cured): in master's stored
shape the top-level roster copies `factions[].members[]` carry their goals, and the server serves those goals' target ids
UN-RE-KEYED: `factions[0].members[0].goal.intent.short.target.id = npc_peat_cutter`, `npc_veiled_5064ee784f11c849`,
`npc_mint`, ... (minted person ids: representatives.js :: `npc_<house slug>` and the veiled form), while the same person's
card in `npcs[]` is re-keyed. Cause: the re-key (212 :: `_gallery_veil_rekey`, galleryVeilPeople.js :: `rekeyPeople`)
re-keys a roster copy's `id` alone (`rekeyEach(f.members, ['id'], ...)`), not its goal's targets. Caught by tooth (ii) in
(E) (`unkeyPeople` against the projection). A probe copy that recorded the throw instead of stopping showed it the ONLY
fault of those 5 tests (logs/g3-probe-cshr-E.full.txt). The seat's: a stored person id served on the gallery read.
Not re-stated (no red): (F)'s `V102_TALLY` hashes of the untouched reads now hash re-keyed bytes (a written measure only).
`goalsAimedAtWithheld` in galleryServerVeil had gone vacuous by the re-key (stored ids looked up on a re-keyed page): its
pages are now read back by `unkeyNamed`, so it judges again (green).
Note: the four later green runs saw item (e)'s helper change in the working tree (committed next); criminalSwitchHandReach's
ran before it. `tests/security` whole (item R4) runs every one at the last commit.
eslint on every touched file: 0 errors (logs/g3-eslint.txt).

## (b) RULING 4'S REGISTER ROW (the chair's ruling (b)): DONE (commit: B)
`src/domain/display/galleryVeilPeople.js` added, test-only: "comment; the reader rekeyServed (the served marker re-keyed
into a new object, no row written)". Read by grep: the file names the column once, line 167, `rekeyServed`'s @param
(logs/b-column-mentions.txt); `rekeyServed` builds `out = {}` and returns it, writes no row. RED at bb8897599 (RULING 4 the
one red, logs/g3-green-galleryServerVeil.txt); GREEN: galleryServerVeil 18/18 (logs/b-galleryServerVeil.txt). (A `-t` run of
RULING 4 alone is invalid: it reads a row the per-town tests insert; kept as `*-filtered-invalid*`.)
## (e) THE MASK'S TWO CONDITIONS (the chair's ruling (e)): DONE (commit: E)
`personIdBijection.shared.mjs` (F): (i) `freshShapedStoredIds(reference)` counts the stored person ids of the fresh shape;
`storedIdsServed` compares them as whole tokens (never masked) and REDS BY NAME where one exists; (ii) the mask takes whole
tokens only: `(?<![0-9A-Za-z_])(npc|tie)_[0-9a-f]{16}(?![0-9A-Za-z_])` (it was `(?![0-9a-z])`, no left edge).
- RED FIRST, by execution (logs/e-red-green-plants.txt): R4I-PAGE-3's mask MISSED three of the plants "a short stored id
  inside a longer string that is not a fresh token": `npc_2fffffffffffffff_x`, `npc_2fffffffffffffffX`, `xnpc_2fffffffffffffff`
  (the bare id and `the npc_2 smith` were caught); no count existed. GREEN after: all caught; the fresh token a short id
  begins is still the re-key's own.
- The plants as a test: galleryVeilIds "(F) THE MASK'S TWO CONDITIONS" (pure), 1 passed (logs/e-galleryVeilIds-F.txt).
- THE COUNT on R4I-PAGE-3's stored sets (`/var/tmp/r4ip3/stored-{today,master}`, `e/fresh-shaped-count.mjs`): today-born
  140 documents, 0 stored ids of the fresh shape; master-born 140, 0 (logs/e-fresh-shaped-count.txt). `stored-ids.sh`
  re-run on both: queued on the mutex (below).
## (c) THE LINK TWIN AND THE ANCHOR (the chair's ruling (c)): DONE, 36/36 AND 36/36 (commit: C)
`tests/security/linkTwin.shared.mjs :: linkTwinOf(stored, overrides)` = `applyVeil(pub, resolveVeil(defaultVeilFor(pub),
marked ? deltas : []))`, `pub = galleryPayloadFor(stored, { shareDm: false, memberOverrides: linkHonoured(overrides) })`.
Its law cited in the file: 212 :3307 (`'gallery_share_dm', false`), :3328-3334 (the apply, `settlement_share_dm` false),
:3338-3339 (`_gallery_veil(..., true)`, the comment); 211 :701 (`link`'s one branch: an unmarked share takes the default
veil) and :739-742 (revealDm:false member keys as card deltas).
ONE FINDING, MEASURED, in "what the link's apply honours": the link's `dm_full` is `pub.j` itself, the public projection
plus three live keys (212 :3329-3333; the comment at :3058), and a member's `revealDm: true` takes its card from `dm_full`
(:3111-3116), so on the link a reveal reveals nothing beyond the public card. With the overrides passed whole, the anchor
passed 24 of 36 clean reads: the 12 `plant` link reads served 4 references against the twin's 7 (6 against 9, shown), the
twin's three extra all on `npc.bo` (`revealDm: true`): `npcs[3].goal.intent.short.target.id`, `npcs[3].relationships[0]
.from/.to` (logs/c-probe2-*.full.txt). `linkHonoured` drops each `revealDm: true` (nothing else): then 36/36.
- The anchor: galleryVeilIds' chair's arm judges the first LINK read against `refsOf(linkTwin)`, not itself; THE LINK ANCHOR
  TOOTH (R4I-PAGE-3's measured patch, re-anchored): plants 36 (pinned), the self form passes 36/36 planted reads, its second
  read reds 36/36, the anchored form reds 36/36 and passes 36/36 clean reads. RED FIRST: against the gallery twin 12/36 clean
  (R4I-PAGE-3, logs there); against the whole-overrides link twin 24/36 (above). GREEN: galleryVeilIds 14/14
  (logs/c-galleryVeilIds.txt). eslint 0 (logs/c-eslint.txt).
## R — THE RUNS
1. THE 34 FILES once (through the mutex; the tree at bb8897599 + (e)'s helper in the working tree): **2 failed | 864 passed | 1
   skipped of 867**, exactly the expected two (logs/r1-files34.full.txt): `tests/lib/gallery.test.js` "a share marked with a veil
   renders through it" (S2) and `criminalVeilSwitch.test.js` VS1 "(a)-(e)" on its crime-types tooth ("some copy carries the
   crime types ... expected 0 to be greater than 0"). No other red.
2. THE ARMS ALONE: Tell3 3/3, Tell4 1/1, Tell5 2/2, Tell8 3/3 green (logs/r2-arm-*.txt); galleryServerVeil 18/18 (after (b),
   logs/b-galleryServerVeil.txt); galleryRosterChoices 39/39 (logs/g3-green-galleryRosterChoices.txt).
3. galleryVeilSignalCopies: at af708f2fd (`/home/user/wt/r4ip3-tip`, never committed to) 2 failed | 3 passed; at this tree 2
   failed | 3 passed; THE SAME two tests (server-veil-city-2, current's and master's shape) on THE SAME assertion:
   "block:services.criminal: shutting it removes something from the gallery page (the row is live): expected 0 to be greater
   than 0" (logs/r3-signalCopies-*.full.txt). The tip's own (S2's cause), not R4-IDS's.
4. `tests/security` WHOLE at c7e60ef59: QUEUED, NOT READ (chainF, through the mutex, after the stored-ids chain; writes
   logs/r4-security-whole.txt). Expected by class: shareRenderTwice's rows (R4I-TONIGHT's), criminalSwitchHandReach's 5 (the
   G3 STOP), VS1-free (not in tests/security), galleryVeilSignalCopies 2 (the tip's); RULING 4 green now.
5. `tests/lint` WHOLE at c7e60ef59: QUEUED in the same chain, first (logs/l-lint-whole.txt). See below if read.
STORED-IDS (ruling (e)), `stored-ids.sh` re-run on both sets at c7e60ef59 through the mutex (logs/st-ids-*.txt; outdirs
`/var/tmp/r4ip4/ids-{today,master}`): GATE GREEN both, exit 0. Today-born 140 / master-born 140: (1) withheld names in ids,
keys, slugs: 0 / 0; (2) stored ids served un-re-keyed: 0 / 0, in stored-only fields 0 / 0; (3) ids shared by two reads 0 / 0,
unresolved beyond the stored own dangling 0 / 0; (4) re-keyed ids/refs/ties 26,712/64,484/26,056 and 12,345/43,204/0;
controls caught 700/700 and 140/140 on both. Fresh-shaped stored ids: 0 / 0 (above).

## LEFT (exact commands; every test command with the `env -u GIT_DIR ...` prefix, through the mutex)
- Read logs/l-lint-whole.txt and logs/r4-security-whole.txt when chainF ends (`/tmp/claude-0/-home-user-settlement-engine/b88b7306-c131-56fd-80e9-32ab46d628ea/scratchpad/r4ip4/chainF.sh`, queued at 03:33 UTC through the mutex, which runs
  `sh scripts/gate-tail.sh npx vitest run tests/lint` then `... npx vitest run tests/security --maxWorkers=2`, PGHOST local).
  Count lint by name against `git show origin/lane/veil-36-2026-11-22:docs/chair/2026-11-20/veil/out/v36/seated/lint-whole-fails-af708f2fd.txt`
  (48 of 3,304); class every security red as item R4 says, the titles to `out/v38/r4ip4/g-security-final.txt`.
- THE STOP of G3 (master roster copies' goal targets un-re-keyed): the seat's / the chair's.
