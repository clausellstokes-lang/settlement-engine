# COHERENCE-VEIL — phase 2 hand-back, part 6: the fifth seat (the fourth seat's cures applied, the line merged, the veil proved on the merged tree)

Seat: COHERENCE-VEIL-5, lane `lane/coherence-veil-2026-11-11`, from `5a2399cf9` (read back from origin before any
work). The fourth seat's part 6 was lost with its container; this file is written new. Migration 211 is a FILE,
applied nowhere: every database here was an in-process pglite or a scratch native PostgreSQL 16.15 cluster on this
machine (`/var/tmp/cv5`, UTF8, trust auth, unix socket only). No hosted database was touched; no golden's door was
run; nothing was deployed.

**TIP:** the commit carrying this file, pushed plainly as `lane/coherence-veil-2026-11-11` and read back from origin.

The lane's commits from 5a2399cf9, one cause each: `2f692687a` V4-1 · `c0f4545a6` the recreated ID_KEYS commit · `325f1bbb4` the floor as it was · `05414bb06` V4-2 · `66382ec47` the read-only block's section (10) · `98b4d0f26` the id differential re-run · `ebdbda820` **the merge of the line at e969a75b7** · `f66adf5d8` the lighting census by its door · `d5455d4a8` the V5 composition pin · `cd356da43` the lighting census (+1 title) · `365c7fde3` the probes and records · `aa928181c` a record renamed without a date (the suite's one red of mine) · this hand-back with the merged six-size record.

## 0. Outcome

- The fourth seat's three cures are on the lane, byte for byte where they can be (§1), with the one lost commit
  recreated as its own commit.
- Every proof the brief names was run before the merge and again after it, with the same counts (§2, §4).
- The renamed-key census is complete (§3): two classes, both cured; nothing else a shut eye or a hidden row governs
  was renamed or retired.
- The line `origin/lane/integration-2026-11-07` at `e969a75b7` is merged as its own commit, `ebdbda820`. One conflict,
  the lighting census, resolved by its door (§5). No conflict in `src/`, in the veil's source, in migration 211 or its
  rollback.
- The composition with the powers lane is proved and pinned, red first (§4.2).
- No ceiling moves and the lane owes no bytes: the first-paint closure is raw-identical to the line's (§6).
- The whole suite at the final merged tip: §7.

## 1. What was applied (step 1)

On local branch `veil5` at `5a2399cf9`, in a scratch worktree with `npm ci`, `git am` of
`origin/lane/chair-2026-11-08 :: docs/chair/2026-11-13/probes/VEIL-4/VEIL-4-cures.mbox` (each patch alone, so the
recreated commit could sit in its place):

| Lane commit | The fourth seat's | Client `galleryVeil.js` | Migration 211 | Test file `galleryVeilCures` |
|---|---|---|---|---|
| `2f692687a` V4-1 (a tie's ends: `from`, else `npc1Id`, else the name) | `b672694c2` | `e35557210` = header | `809a9fec3` = header | `73ec7e881` = header |
| `c0f4545a6` **RECREATED**: `npc1Id`, `npc2Id` in the parity fuzz's `ID_KEYS`, with a two-line comment | `bbeeb2bd3` (not saved) | — | — | `c7272deec` (the lost one was `b7f22c43e`: the comment's words are new, so it cannot equal) |
| `325f1bbb4` the floor as it was (ruling 331) | `3fcf695aa` | `2ee3987e3` = header | `6cc82965b` = header | — |
| `05414bb06` V4-2, server only (a shut goals / ties eye withholds `factionGoal` / `linkedFactionIds`) | `a557bf8c8` | — | `767f39e91` = header | `d003f5add` (header's `554fe7641` sat on the lost commit) |

**Why the recreated commit was needed:** V4-2's hunks were written on top of it (they apply with offsets −2/−2/−4
without it), and without it the class fuzz (400 documents × four reads, 211 against 210) never draws a tie in
master's spelling, so old-shape towns would not be in the lane's fuzz. Patch 3's own diff applied unchanged: its
added and removed lines equal the mbox's line for line (the mbox's blank context lines had lost their leading space;
`git am` matched them).

## 2. The proofs before the merge (step 2), at `98b4d0f26` (the four cure commits plus two probe records)

| Proof | Result |
|---|---|
| The veil's pins (`galleryServerVeil` + `galleryVeilCures`) | **44 of 44**, exit 0, 472 s |
| The rollback, native, the 1,366-line catalogue (`veil-probe-5/native/rollback.sh`) | down vs 210: **0**; down twice: **0**; 211 again vs 211: **0**; control 210 vs 211: 50; no `_gallery_veil*` left |
| Red first (`veil-probe-5/redfirst/`) | V4's five pins at 5a2399cf9's 211 and client: **5 failed of 5**; at 325f1bbb4's 211 (before V4-2): V4-2's **2 failed**, V4-1's 3 passed |
| The six-size probe (never re-run after patch 3) | exit 0, 1,678 s, every chain whole: **522 rows, 8,136 reads; carried, overrides, changed, sameRow, oldShows, postFreeze, splice, editorState, nameless, nameless210 all 0; importMap 84** — equal to `towns-cv4.json` on every count (`veil-probe-2/out/towns-cv5-pre.json`) |
| The id differential (never re-run after patch 3) | **26,515 compared, 0 unequal, 0 raised**; 570 client throws, 915 legacy apart (part 5 exactly). With `KEYS_EXTRA=npc1Id,npc2Id` (new: master's tie ends drawn): 26,547 / 0 / 0 |
| The deployed client's fixture (the fourth review's 12 towns × 8 shares, master's own writer and four reads, three chains) | **show-more on master's page: 0** (the review's 18 gallery shares of hand-hidden relationship descriptions, in both chains, are gone; `classify.mjs` prints nothing); every other count (hide-more, carried, postFreeze, labels, breaks 0) equal to the review's own run |
| The renamed-key census on the 203 fixture | §3 |

## 3. The census of renamed and retired keys (complete)

**The 2/3/1/1 instrument was lost** with the fourth seat's container (its fixture `v42-fixture.sql` and its counts
were never committed). It is rebuilt in two parts.

**(a) The table census, by execution** (`veil-probe-5/census-kinds.mjs`, `out/census-kinds.json`): master's
`CARD_KINDS`, `GROUPING_REMOVERS` and exports (db832c892) against the lane's, every kind, eye, floor, list and id rule;
then every rename and retirement in `settlementMigrations.js`'s two steps (v1 → v2, v2 → v3) checked against it.

| Stored key in master's shape | What governed it in master | In the lane | Verdict |
|---|---|---|---|
| `relationships[].npc1Id` / `npc2Id` (→ `from` / `to`) | the relationship id rule (every tie eye and card) | id reads `from`, else `npc1Id`, else the name | **V4-1, cured** |
| `npcs[].factionGoal` (deleted) | the npc `goals` eye | not in the client's table | **V4-2, cured on the server** (register does not grow) |
| `npcs[].linkedFactionIds` (→ memberships) | the npc `ties` eye | not in the client's table | **V4-2, cured on the server** |
| `npcs[].factionAffiliation`, `secondaryAffiliation` (→ memberships) | the npc floor; a house hidden whole removed either where it names that house | the floor no longer lists them; the house pass removes ANY string key but `id`/`name` naming a hidden house (client and 211 alike) | not an exposure: only institutions can be hidden whole, and a key no eye names is never removed in either version, so the floor difference changes nothing; the house pass is a superset of master's |
| `npcs[].institution` (string → `{ kind, key }`) | the `ties` eye; the house passes | the same eye; both passes read either shape (`npcHouseOf`, `_gallery_veil_npc_house`) | holds |
| `npcs[].corrupt`, `corruptionVector`, `corruptTies` (→ `allegiance`) | the `corruption` eye | the same eye, `allegiance` added | holds |
| `npcs[].densityRungRole` (deleted) | no eye | no eye | nothing to govern |
| `factions` (the grouping) | the npc and faction lists | the same lists | holds |

Every other kind (institution, faction, event, tension, conflict) is field-for-field and rule-for-rule identical;
the groupings are identical. The deployed client's fixture (§2) confirms it by execution: master's page over 211
shows nothing master hid, and its hide-more by path (`out/classify-less-pre.txt`) holds no person or relationship
path (only the "every default opened" shares the review classed).

**(b) The owner's count** — section (10) of the read-only block (`veil-probe-2/predeploy-readonly.sql`), with seven
fixture rows (`veil-probe-3/predeploy-fixture.sql`): shares hiding master-shape ties by hand and their hides; DM-revealed
shares shutting a master person's goals or ties over a stored `factionGoal` / `linkedFactionIds`. At 203:
**2 / 3 / 3 / 3**, as built; every other section equal to `predeploy-run-cv4-203.txt`; the block writes nothing (rows'
md5, functions' md5 and write counters equal before and after; the READ ONLY control refused). Record
`veil-probe-3/out/predeploy-run-cv5-203.txt`. My figures are my rows: they cannot be compared to the lost 2/3/1/1.

## 4. After the merge (step 4), at the merged tree

### 4.1 Every proof of step 2 again

| Proof | Result |
|---|---|
| The veil's pins + the veiled-face guard (`galleryServerVeil`, `galleryVeilCures`, `playerRecordVeiledFace`), at `f66adf5d8` | **48 of 48** (44 + the guard's 4) |
| The V5 composition pin (new, §4.2), at `d5455d4a8` | 1 of 1 (and in the whole suite, §7) |
| The rollback (migrations and rollback byte-identical to the patched tree: `git diff veil5 HEAD -- supabase/migrations supabase/rollback` is empty) | **0 / 0 / 0**; control 50 |
| The id differential | **26,515 / 0 / 0** (570, 915); old-shape draw 26,547 / 0 / 0 |
| The deployed client's fixture, chains from the merged tree's files | classify **0**; every count equal to before the merge |
| The read-only block at 203 | every figure identical (2 / 3 / 3 / 3 in section (10)); writes nothing |
| The six-size probe on the merged generator (the powers lane's towns) | exit 0, 1,727 s (beside the suite), every chain whole: **522 rows, 8,136 reads; every offence 0; importMap 76** (84 before the merge): the same class, the map member lacking a card's `title`/`category`/`role` on unmarked live shares (the map hiding more, classed by the review as "map lacks"), fewer rows because the powers lane's towns carry one fewer office card (`veil-probe-2/out/towns-cv5-merged.json`) |

### 4.2 The composition with the powers lane (red first)

`galleryVeilCures`: "V5 (the composition): a row hidden by hand on a powers-lane leader or claimant stays hidden in
both stored shapes, by every read and on the page". On 11 towns of the merged generator (hamlet to metropolis, calm
and `succession_void`, one infiltrated city): every power's named person (a membership of rank 1: **63 leaders**)
and the claimants' powers' faces (`institution.kind === 'power'`: **12**). Markers on every field an eye governs
(secret, goal, personality, hooks; master's `factionGoal` in the old shape) and on the description of each tie they
start. Each town in the NEW shape and in MASTER'S (taken back through both migration steps: memberships as
`factionAffiliation` / `secondaryAffiliation` / `linkedFactionIds`, a house as its name, an allegiance as the corrupt
mark, ties in `npc1Id/npc2Id`), Reveal DM off and on, with one-person reveals, class switches, whole-card hides and
tie hides drawn at random: 44 shares.
- **Hidden (675 markers): none sent** by the gallery, link, import or map read, **none drawn** on the page.
- **Open (711): each draws on the page exactly as at 210**, and every one 210's page draws (363) is sent at 211.
- **The red control:** 210's gallery response sends 442 of the hidden markers.
- **Red first:** with 5a2399cf9's 211 and client on the merged tree, red (master's `factionGoal` under a shut goals
  eye sent by gallery, import and page). The generated ties carry their own `id`, so this pin does not reach V4-1's
  class; V4-1's own pins do.
- **One wrong turn, mine, corrected before the commit:** my first draft spread the one-person reveals over the
  writer's output, overwriting a whole-card hide (which `writeShareVeil` stores as that person's `revealDm: false`)
  with a reveal the panel cannot store. The 210 client drew those markers too, so 211 was twinning the client. The
  pin writes the overrides in the panel's own order (`writeShareVeil(members, deltas)`).

**Old-shape towns in the lane's fuzz:** the class fuzz now draws `npc1Id`/`npc2Id` (the recreated commit) and
`factionGoal`/`linkedFactionIds` with the goals and ties switches (V4-2); the V4 class pin is 60 towns in master's
shape; V5 adds the powers lane's people in master's shape.

## 5. The merge (step 3)

`git merge --no-ff origin/lane/integration-2026-11-07` at **`e969a75b7`** (266 commits over the merge base
`decc7bf15`; the powers lane at its point 46, `6aeaa4154`; the hook's lane rule `7d429f6cb`). Commit `ebdbda820`.
The merged tree equals `git merge-tree --write-tree` of the two tips in every file but the census baseline.

| File both sides changed | Resolution |
|---|---|
| `tests/lint/.lighting-census-baseline.json` | CONFLICT. The line's side (`--theirs`, the line being the merged-in side here); then re-taken by its ritual in `f66adf5d8`: the plain walker red (files 3228 ≠ 3224), `LIGHTING_CENSUS_REFREEZE='COHERENCE-VEIL-5'` on the clean tree, the plain walker 34/34. files 3224 → 3228, parked 397 → 398, credited 2827 → 2830, titles 29206 → 29243, suites 7902 → 7905 (the lane's four test files). Again in `cd356da43` for V5's one title: 29243 → 29244 |
| `scripts/mutation-coverage-manifest.json` | merged by itself |

No other file was changed by both. The veil's `src/` files (`galleryVeil.js`, `gallery.js`, `ShareToGallery.jsx`)
were not touched by the line since the base.

The push's three fast gates on the merged tree: `typecheck:ratchet` **0** (167, ceiling 167);
`typecheck:domain:strict` **0** (1,113, ceiling 1,113); `lint` **0**. No commit of this seat touches `src/`.

## 6. The byte budget (step 5)

Built bare (`npm run build`) at the line `e969a75b7` and at the merged tree, measured by the test's own walk
(`veil-probe-5/meter.mjs`):

| | raw | gzip -9 | Brotli q11 | files |
|---|---|---|---|---|
| the line, e969a75b7 | 1,140,441 | 362,984 | 304,510 | 8 |
| the merged tree | **1,140,441** | 362,987 | 304,494 | 8 |
| the ceilings (`vendorPdfLazy`) | 1,121,260 | 357,225 | 299,985 | |

Seven of the eight closure files are byte-identical; the entry chunk is the same size and **identical once lazy
chunk hash names are normalized**: the +3 / −16 compressed bytes are hash names. No byte of the lane's is in the
first-paint closure. The ceilings are over on the line itself (carried red to the closing acts, as ruled); no
ceiling moves.

## 7. The whole suite at the final merged tip (step 6)

`npx vitest run --maxWorkers=2` at **`365c7fde3`** (the last code commit; every later commit is docs), the ledger
ref `review-fixes-2026-07-08` fetched first, no `dist/` present, 12:46 → 14:15 UTC (89 min), to a JSON file
(`veil-probe-5/out/suite-fails.txt` lists every red). **3,228 files (7 failed); 39,018 tests: 38,862 passed, 11
failed, 145 skipped.** Refs and local config byte-identical before and after (only this seat's branch moved, by its
own commits).

| Red at 365c7fde3 | At the line e969a75b7 | At the lane's base 5a2399cf9 | Class |
|---|---|---|---|
| landingFixtureFreshness ×2 | red, the same two | green | the line's set (FOUNDING-WORLDS) |
| foundingWorldBones (Mossgate, 19 of 20 forks) | red | green | the line's set, carried red and named at point 46 |
| newsHeadlineContract, newsVoiceContract: fail at load | red at load | green | the line's set (act 4) |
| proseFamilyContract A1, A2, A3, A5 | red, the same four | green | the line's set (act 4; A2 joined by ruling at point 46) |
| dossierProseManifest: the DRIFT tally, the DRIFT arm, the audience arm | red, the same three | green | the line's set (act 2) |
| sourceCitationIntegrity: "the archival exclusion is still the set this walker documents" (dated 237 → 238) | — | — | **THIS SEAT'S, CURED** in `aa928181c`: my record `veil-probe-5/out/master-client-review-2026-11-13.json` had a date in its name and so joined the archival roster; renamed without one; the walker 18/18 after |

The six carried files were re-run whole at the line tip and at the base (`--maxWorkers=2`, same command): at the line
exactly these 10 tests and 2 loads red, at the base all six green. So every red at the tip is the line's failing set
at the point merged (the merge book §1 row 46, §2g), brought in by the merge, plus one of this seat's own, cured.
No red is the veil's. The byte ceilings (§6) are not in this run (no `dist/`); they are red on the line itself.

## 8. What is NOT proved

- The fourth seat's 2/3/1/1 census figures: the instrument was lost; §3 replaces it and cannot reproduce it.
- The lost commit's blob `b7f22c43e`, and so patch 3's test-file blob `554fe7641`: recreated, not byte-equal (§1).
- The deployed client over the merged tree's NEW client: the master fixture runs master's client; the new client's
  page over old-shape rows is proved by the V4 and V5 pins (pglite), not by a native fixture run.
- V5 does not reach V4-1 (generated ties carry their own `id`): V4-1's own three pins carry that class.
- Timing: not re-measured (no SQL body changed since part 5 except V4-1's two `or` arms and V4-2's one `||`).
- The early deploy of 211 alone: the fourth review's "211 then 204..210" chain (208 overwriting the veiled
  `get_unlisted_dossier`) was not re-run; the extra rollback statement it names is on the review's branch
  (`native/unlisted203.sql`). The deploy is the owner's.
- e2e and Deno: not run.

## 9. Leaving

Refs and local config were snapshotted before the work, before the suite and after the push. Changes, all expected:
local branches `veil5` and `veil5m` (this seat's), `review-fixes-2026-07-08` fetched for the suite, and
`core.hooksPath=.husky/_` written by `npm ci`'s husky install (the hook's wrappers; needed for the push to run the
lane rule). Nothing else moved. The push: `git push origin veil5m:refs/heads/lane/coherence-veil-2026-11-11`, plain,
through the hook's lane rule (the three fast gates).

## 10. This brief's rulings, copied in (the chair, session_01FE9mEws7PXYRYdjQPbSX15, 2026-11-13)

> THE LAW THESE CURES SERVE (ruled, binding): hidden by hand is never sent, by any of the four reads, in either stored
> shape (the new shape, and the shape the DEPLOYED client stored, master's); what is not hidden is sent as before, so
> that applying migration 211 alone takes nothing from the client deployed today; no ceiling moves; the retired-field
> register does not grow. Every change that reads stored data is tested against data as the deployed client stored it.

> THE WORK, in order: 1. Read the lane's tip back from origin: 5a2399cf9. On a local branch at it, in a scratch
> worktree with `npm ci`, apply the three patches (`git am` the mbox). After each, the blob ids of the client's file
> and of migration 211 must equal the ids in the patch headers, and the test file's after the first. Patch 3's test
> hunks sat on a small commit that was not saved (it only added npc1Id and npc2Id to ID_KEYS in that test file, with
> a header comment): recreate it as its own commit if the tests need it, and say so. 2. On that tree, before any
> merge, re-run the lane's proofs: the veil's pins (44 of 44), the rollback (0/0/0), the renamed-key census (2/3/1/1
> on the fixture of 203), the red-first logs, and the two never re-run after patch 3: the six-size probe and the id
> differential. Say whether the census of every other retired or renamed key that a shut eye or a hidden row governs
> is complete, and complete it if it is not. 3. Merge origin/lane/integration-2026-11-07 (its tip as you find it: name
> it) into the lane as its own commit. [...] Expected: one conflict, the lighting census baseline (take the line's
> side, then re-take it through its own door [...]); the mutation manifest merges by itself. A register or a bundle
> in conflict: the line's side, then re-derived through its own script or door. A conflict in the veil's own source,
> in migration 211 or in any src/ file is listed with its resolution; one you cannot resolve without choosing between
> two behaviours is a stop. 4. On the merged tree: every proof of step 2 again, AND the composition with the powers
> lane: a row hidden by hand stays hidden for the leaders and claimants that lane names (every power now has a named
> person), in both stored shapes, by each of the four reads and on the page, with a DM reveal off and on. Red first
> where you add a test. Old-shape towns join the lane's fuzz. 5. The byte budget, as ruled: no ceiling moves and this
> lane owes no bytes. [...] Re-measure on the merged tree and state the figures. The built bundle's size ceilings are
> carried red on the line and belong to the closing acts. 6. The whole suite once at the final merged tip [...]:
> every red classed against the line's failing set at the tip you merged (the merge book's sections 2g and 1) AND
> against the lane's reviewed base 5a2399cf9. 7. The hand-back [...]. Nothing is applied to any database by any
> seat: migration 211's deploy is the owner's alone.

> NEVER, whoever asks: `--no-verify`; a force push; a push with nothing to send; a push to any other branch; a pull
> request; anything on master; a golden's door (signing is the merge seat's); a deploy; a hosted database or
> production credentials. No adjacent repair, however tempting.

Also binding, from the chair's handoff §5: measure first; never read a gate through a pipe; one cause per commit, red
first; registers only through their doors; a red is classed against the lane's reviewed base as well as the seat's
own; stored data is tested as the deployed client stored it; a hand-back carries the rulings its seat worked to.
