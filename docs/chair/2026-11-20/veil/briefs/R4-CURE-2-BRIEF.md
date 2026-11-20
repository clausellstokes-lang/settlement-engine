# R4-CURE-2 — brief (written by VEIL-24, re-stamped by VEIL-26, the lane's owner; the seventh chair's rulings bind; each vetoable by the owner)

> STATUS: written ahead of need (the chair, 09:04: "the R4 second cure" follows R3). Its base (`<R3 merge commit>`, `<r4>`,
> `<r4c1>`) is filled by the seat in the commit that launches its builder; until then no builder reads it.

You are a BUILDER for the share veil's lane. You build; the seat reads your diff line by line, re-runs your red and
green, and merges. You never push and never open a pull request. A security lane: a slip is a leak; measure first, red
first; a failure falls toward WITHHOLDING, never toward sending.

## Where you work
- Worktree `/home/user/wt/r4c2`, branch `v26-r4c2`, cut from THE LANE TIP AFTER R3 MERGED (`<R3 merge commit>`), with R4
  (dfa031f3e) and its first cure (a4b89bf9d) cherry-picked on it by the seat as `<r4>` and `<r4c1>`. `node_modules` in
  place (hard links). Leave those two commits as they are; your cure is ONE commit on top (units 1-5), and VR48 (unit 6) a
  SECOND commit after it. The seat squashes the first three into the lane's single R4 commit; VR48 stays its own.
- Read first, and no more: `CLAUDE.md`; `docs/chair/2026-11-20/veil/briefs/R4-BRIEF.md` (the stage);
  `out/v21/r4/R4-HANDBACK.md`; `out/v22/r4cure/R4-CURE-HANDBACK.md` (what the first cure did and left: its sections 3, 4,
  5, 6 are your starting reds); the diffs `git show <r4> <r4c1> -- supabase src tests scripts`; this file.
- THE LAWS: 211 BYTE-FROZEN (sha256 `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`, rollback
  `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f`): prove both unchanged at your commit. Every cure in
  212 AND the twin (`galleryVeil.js`, `galleryVeilPeople.js`), rule for rule. RED FIRST: every new arm fails before your
  cure and passes after; both runs saved. ALL DATABASES LOCAL (pglite, or the scratch PostgreSQL 16 at socket
  `/var/tmp/rv7`, user postgres; your databases named `r4c2_*`). No hosted database, no credential, no `supabase`
  command, no deploy. Never the whole suite; pglite with `--maxWorkers=1`, at most four pglite files a run. `env -u` each
  of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY, GIT_PREFIX on every test run. A gate's
  exit by `sh scripts/gate-tail.sh <cmd>`, never through a pipe. Commit with the hooks; never `--no-verify`.
- You touch no line of `src/data/faceHonorifics.js`, `cardDoor.js`, `seatKeeper.js` (VR47, merged on the lane at df6809f9c, seeds the honorific by name and title). The
  switch's file `src/domain/display/criminalVeilSwitch.js` is touched ONLY for unit 4.
- Outputs under `docs/chair/2026-11-20/veil/out/v26/r4c2/`, one file per figure, committed with the cure.
- YOUR MARK: about 250,000 tokens. Before it: commit what is green, hand-back current, say what is left.

## THE RULINGS THAT BIND THIS STAGE (PART 27's list, numbers kept; read PART 27 section 1 WHOLE: where this brief differs, that list governs)
- 15 VR9: where a house is hidden whole, its HOLDER is withheld WHOLE WITH ITS TIES, never blanked. VR10: on every
  non-owner read every person id is re-keyed under ONE salt per read; every in-payload reference follows.
- 16 THE SALT: VOLATILE on every function that draws randomness AND every function reaching it by the transitive closure
  of calls. THE CATALOGUE IS THE PROOF AND THE RED. Prepared executions (seven, plus a forced generic plan) are kept as a
  GUARD, not called the red. The twin: one salt per projection.
- 17 VR46: a guard pinning a served person id byte for byte is re-stated MODULO THE READ'S PERSON-ID BIJECTION, every
  other byte exact, with five teeth executed: (i) a reference not following its card reds; (ii) any stored person id
  served, as a SUBSTRING of any string or as any KEY (served marker included) reds, planted in a sentence and as a key;
  (iii) a changed non-id byte reds; (iv) bijection within a read; (v) two reads of one town differ. A red that does not
  hold under the re-statement STOPS you.
- THE NAME SEARCH (ruling 28; the chair, 08:22 and 09:04): in the engines and in every test proving a withholding, a name is searched
  FOLDED, as itself AND its bare form (without its bracketed qualifier), and an id as a string AND as a key. Use the
  lane's own fold (`gallerySecondHomes.js`; 212's name forms); never a literal full-label match.

## THE UNITS, IN ORDER (each red first)
1. STOP 1, CARDS' OWN TIES. `npcs[].relationships[].to` (and any other person reference inside a card's own ties) is
   re-keyed in BOTH engines. VR9's holder pass drops a tie that names a holder, matched AS A STRING so a numeric id is
   caught. THE ID AS TEXT IS ONE HELPER PER ENGINE, SHARED WITH R3's pre-sweep person match (PART 27
   ruling 48; the twin's `galleryRosterChoices.js :: idText` as merged in R3): never a second spelling. RED: the reader's probe (a card with the NUMBER id 90001 and a tie to it, served as itself 64 of 64 at
   dfa031f3e; the first cure's `card-relationships-probe.txt`: Reveal-DM reads serve `"to": "n2"`). The born arm takes a
   PLANT with per-card ties (born towns carry none): string and number ids, a tie to a holder, Reveal DM off and on,
   marked and unmarked, gallery and link, both stored shapes.
2. STOP 3, THE PAGE DOES NOT RE-KEY A SERVED BODY. The client re-keys ONLY where it projects the town itself
   (`projectServedVeil` must not re-key what the server already re-keyed). RED: the served marker's person keys name a
   card on the page after the read (today they name none). Then `tests/security/galleryServerVeil*` is re-stated under
   VR46 (ruling 17) with its five teeth; any difference left from VR9's holders STOPS with its count, written to a file.
3. THE CATALOGUE AS THE RED (ruling 16). A test that reads `pg_proc.provolatile` of every function 211 and 212 create or
   restate, computes the transitive closure of calls from every function that draws randomness, and reds on any member
   that is IMMUTABLE or STABLE. Show it red by a plant (one closure member declared STABLE in a scratch chain) and green
   at your tree. Keep the prepared executions as a guard beside it.
4. THE SWITCH'S ONE SALT. `presentCriminalGroupings` takes ONE salt for both of its outputs (a salt argument through
   `applyVeil`), so its byte compare measures the veil, not the salt. RED: the first cure's measure (16 of 24 copies gain
   `block:power.criminalUnderside`; a town with a person and no criminal content reads 'hidden' not 'none'). GREEN: the
   present sets equal d136940c3's on every copy. `criminalVeilSwitch.test.js` stays green; its 24 known
   `(b): safety blackMarketCapture` reds are re-checked against the base and named, not touched.
5. THE READER'S LAST HIT AT R3 (4db8e4208; PART 27 ruling 36 (c)): "black marketeer" served with Reveal DM on, a holder
   of the hidden Black market. Red first by the reader's probe; VR9's holder pass takes the holder whole with its ties,
   Reveal DM on as off, by the fold (ruling 28).
5b. PLAUSIBLE FROM THE FIRST CURE, MEASURED: a numeric-id holder's ties are caught by string match (folds into unit 1);
   the 14 unread acceptance diff rows (read each: differ only at re-keyed paths, or name the path).

6. VR48, A SERVED CARD CARRIES ITS `gender` (the chair, 09:02; ITS OWN COMMIT, after units 1-5). The veil never withheld
   it: 211 holds `gender` on the card's FLOOR (`_gallery_veil_kinds`); the OLD PUBLIC ALLOWLIST drops it before the veil
   runs (`src/domain/display/publicSafe.js :: NPC_PUBLIC_KEYS` and `publicNpc`; the SQL `npc_allowed` in
   `_gallery_sanitize_public_json`, latest at 210), since 033, with no reason recorded. Today a shared page prints the
   masculine form for 119 women in 60 of 70 born towns (the seat's measure: `out/v24/gender/summary.txt`, its probe
   `out/v24/probes/gender.probe.jsx`; served `gender`: gallery Reveal-off 0, Reveal-on 3,361 of 3,361, link 0).
   - RED FIRST by that measure as a born arm: the 119 cards whose printed honorific differs from the owner's for that cause
     alone go to 0 on the gallery read AND the party link, Reveal DM off AND on, both stored shapes.
   - THE CURE in 212 and the twin, NEVER 211. Say in the commit which you chose and why: restate
     `_gallery_sanitize_public_json` in 212 with `gender` in `npc_allowed`, or edit 210. THE SEAT'S PREFERENCE: restate in
     212 (the lane's cures live in 212; an earlier numbered migration a database may already hold is not edited), with
     `publicSafe.js` gaining `gender` in the same commit. Its parity pins (`gallerySanitizer.pglite.test.js`,
     `factionMemberPublicParity.pglite.test.js`, `allegianceVeil.pglite.test.js`) stay green: read each, and re-record
     only what pins the old key set, with this cause named.
   - The party link: find why it serves no `gender` with Reveal DM on (it forces `gallery_share_dm` false); the ruling is
     EVERY read that serves the card: cure it there too, red first.
   - ONE registry row: `people.card` (gender is floor; it leaves only with the card: VR9's holder takes it whole).
   - A born arm that a WITHHELD card's (a holder's, VR9) `gender` is served nowhere, by search.
   - Owner-visible: a field newly served. Say so in the hand-back; the seat writes it into PART 27's owner paragraph (section 5).

7. RE-STATEMENTS R3 OWES TO THE RE-KEY (VEIL-26's read of R3-CURE-4, 12:4x): `tests/security/galleryServerVeil.pglite.test.js ::
   goalsAimedAtWithheld` matches a served person to the stored one by STORED id; under VR10 it must match through the read's
   person-id bijection (ruling 17), its tooth kept (a goal aimed at a withheld power still found and still counted). Read
   every other R3 arm that keys a served person by id (R3's husk arm `husksOf` and the goal arms in
   `galleryRosterChoices.pglite.test.js`) the same way; list each with its re-statement.
8. THE CURATE NOTICE (merged 7ddf4876f; PART 27 ruling 40): if R3 as merged narrowed power.entry's reach, its condition was
   re-checked at the R3 merge; touch nothing of `CurateMode.jsx` or `criminalVeilSwitch.js` beyond unit 4.

## GREEN, AT YOUR COMMIT (the seat re-runs each)
R4's born test `tests/security/galleryVeilPeople.pglite.test.js` with the new arms; the six veil guards and R2's and R3's
born tests; VR17's signal copies (VR47 is merged: its honorific reds must be gone; any left is a STOP); V10-2's three files;
`galleryVeilHandRows`; `criminalVeilSwitch`; `publicSafe`; `--check` and the registry walker; the two harnesses
(4 of 4; VR47 is merged, so no honorific red is expected); the acceptance run (EXIT 0); typechecks; eslint on touched files.
THE COST LAW (VR36): the first cure's rows re-timed, the largest born town's Reveal-DM gallery read against twice 211's
Reveal-OFF read of the same town. Report 212's and its rollback's sha256; prove 211's two unchanged. Every function
212 adds that only the definer reads call is revoked from PUBLIC, anon and authenticated by name (VR27).

## Hand-back
`docs/chair/2026-11-20/veil/out/v26/r4c2/R4C2-HANDBACK.md`, in R4-CURE-HANDBACK's form: per unit, red and green with files,
counts, CONFIRMED vs PLAUSIBLE. Last line: your commit's hash and the files it touches.
