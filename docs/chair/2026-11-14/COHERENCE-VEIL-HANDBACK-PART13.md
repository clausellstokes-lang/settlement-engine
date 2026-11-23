# COHERENCE-VEIL — hand-back, part 13: the twelfth seat (the security reader's findings and the design's rest, to one checksum)

Seat: VEIL-12, lane `lane/coherence-veil-2026-11-11`, from **ac0bb20a4** (read back from origin first: equal; the four
checksums as the brief states them, proved). Brief: `lane/chair-2026-11-08 :: docs/chair/2026-11-14/briefs/BRIEF-VEIL-12.md`
(the chair is session_01ACmDYZrFEVXyZEUg1NDxxC). Every database is an in-process pglite or a scratch native PostgreSQL
16.15 cluster in this container (`/var/tmp/v12pg`, locale C.UTF-8, trust auth, unix socket `/var/tmp/rv7` only,
`listen_addresses = ''`). No hosted database, no production credential, no `supabase db push`, no `migration repair`, no
deploy, no golden's door, no pull request. **Nothing is applied anywhere but those local databases.**

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The rulings this seat works to (each vetoable by the owner)

- **PART 12's sections 0 and 0b stand as written there** (the five rulings; V8-1's inverted boundary; V8-3's one pass;
  V8-9's bounded batches; LOW V8-2, V8-4, V8-5 each one commit by identity, else the pack; ruling (5) on all four
  strings). The chair's brief to this seat confirms every one of them.
- **THE CHAIR'S RULING ON PART 12's SECTION 6** (the brief, 2026-11-14, copied whole): "THE IMPRESSION'S WORDS ARE
  COMPARED CLAUSE BY CLAUSE: the pieces of the appearance and of the impression are cut also at the comma, the
  semicolon and the colon (still twelve code points or more), in both directions, by the one fold, the same in both
  engines; every other words-rule keeps its sentence pieces. The guard's arm is re-keyed to this ruling, never
  loosened. Counted on born towns when built."
- **THE ORDER** (the brief): (1) V8-1; (2) ruling (2) clause by clause, ruling (5) on all four strings, R2; (3) V8-3,
  V8-9, then V8-2, V8-4, V8-5; (4) B, C, D; (5) E, the acceptance run at ONE checksum, then ONE message to the chair and
  212 unchanged until the chair answers; (6) F (a) to (e); G, the owner's pack, LAST.
- **THE COST LAW** (the brief): no more than TWICE the frozen 211 on the reader's 300 KB row, on its V8-3 row and on
  the largest born town; a read never fails where 211 serves. (The library's `run-all.sh` asks three times on its own
  large rows; the brief's twice is the law this seat reports.)

### 0a. This seat's own calls (each for the chair's veto)

1. **V8-1, which letters block.** The ruling: a name matches unless the neighbour on that side is a letter or a digit of
   a script that separates its words by spaces; Hangul is a boundary because its particles join their noun. This seat
   reads that table as **the letters and digits of the alphabets 212 already names as spaced (Latin, Greek, Cyrillic,
   Armenian, Georgian) and the ASCII digits**, by Unicode category, over the code points the preparation leaves. The
   letters of Hebrew, Arabic and the Indic and Ethiopic scripts are therefore BOUNDARIES: those scripts space their
   words but glue articles, conjunctions, prepositions or case endings to the noun (Arabic al-, wa-, bi-; Hebrew ha-,
   ve-, be-; the Dravidian case suffixes), exactly as Hangul glues its particles. The failure direction of the call is
   withholding (a hidden name glued to such a letter is found), never sending. An inflected form inside a spaced
   alphabet (a Russian genitive, an Armenian suffixed article) is not a boundary question and is not this item.
2. **V8-1, the neighbour as written.** A character that is not itself a letter or digit of the five alphabets, but
   whose compatibility form begins or ends with one (™ is TM, ² is 2, ① is 1), is a boundary: the name search writes it
   between spaces before the preparation; the words' fold is unchanged. 1,486 code points.
3. **Ruling (2), what the clause cut reads as** (the builder's reading, for the chair's veto). (a) THE CUT IS MADE IN THE
   ONE FOLD, after it: each string is folded (`_gallery_veil_case_fold` / `caseFold`), then cut at `.` `!` `?` `,` `;`
   `:` and U+2014; a run of fewer than 12 code points (counted in the fold) is no piece. The fold ALREADY writes as the
   ASCII marks: U+FF0C, U+FE50, U+FE10 (`,`); U+FF1B, U+FE54, U+FE14 and the Greek question mark U+037E (`;`); U+FF1A,
   U+FE55, U+FE13 (`:`); and U+1F101..U+1F10A, U+2A74, which hold one (every code point, executed: `out/R2-green.txt`).
   Each of these therefore cuts; so, in the impression's cut alone, do the full-width, small and compatibility sentence
   stops the fold writes as `.` `!` `?` (U+FF0E, U+FF01, U+FF1F, U+2026 and their kin), which the sentence pieces, cut
   before the fold, do not. The fold does NOT write the ideographic comma (U+3001, U+FF64), the Arabic comma and
   semicolon (U+060C, U+061B) or the Armenian comma and full stop (U+055D, U+0589) as ASCII marks: they do not cut (not
   ruled; named here). (b) THE RULE IS ONE TEST: some clause of the appearance and some clause of the impression of
   which one stands inside the other; a whole string is among its own clauses, so "a clause of the appearance inside the
   impression" and "a clause of the impression inside the appearance" are that test's two halves. The impression is read
   by its strings, so a hand-stored impression that is not a string is still read. (c) THE RECORD KEEPS ONE WORDING of
   each (the person's `physical` and `presentation.impression`; no stored copy of either anywhere): the current is the
   stored. (d) A CONSEQUENCE, EXECUTED, for the chair: the guard's Saltmere row whose appearance is amended by appending
   with no clause mark (`... never quite healed (or so the harbour clerk has it)`), while the impression holds the born
   wording after a word inside one clause (`Weathered and slow to speak, with a rope burn across the right palm that
   never quite healed.`), now ARRIVES with that wording: no clause of either stands inside the other. By identity it
   went. The ruling's words send it, and the re-keyed arm asserts it so.

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN, untouched) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN, untouched) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` |
| 212 at ac0bb20a4 (PART 12's last) | `a4ed4c0876b2dc51c865565e3390925112e55c7129f0432113acbc2167df5e4f` / down `9968741f0fa90ba986d9a850a58ebad482c079d3ea704bc8361b96a22e9a192d` |
| 212 at V8-1 (6b55663e5) | `e879358592e20f0eaeebb994a7a49038181315785168d69636a80ca32cf216ad` / down `4b96fa6cfa1481132f636c419c855808e09031e8d12a672db87785ff188afb86` |
| 212 at ruling (2), clause by clause (the commit carrying this row) | `949fed809db32e19151ca0d1ff5e7d45e88894e54a84d5ed2d01aa18658bd459` / down `15c91a3e5e20c172fbdf2c0b905e28794c23be94993d40972a6b223edbd617fd` |

**Not final. The owner's pack `docs/chair/2026-11-13/veil-212/` describes old bytes: do not use it.**

## 2. The first act

- The lane's tip read back from origin: ac0bb20a4, as the brief says. The four checksums proved at it (above).
- The reader's acceptance run at ac0bb20a4 (`run-all.sh`, this container): 37 checks, 35 pass, 2 fail (a07: V7-5,
  item B; d06: V7-8, item C); the twin equal on 15 of 15; the deep and large rows pass. As PART 12 recorded after A1.
- FOR THE JOIN, the files this lane changes, checked against every other lane on origin
  (`git log origin/lane/integration-2026-11-07..origin/<lane> -- <file>`): only `review-veil` and `review-veil-2`
  (whose commits are this lane's own ancestors) and `people-234-merge-2026-11-07-r2` (`galleryVeil.js ::
  CARD_KINDS.relationship.idOf`, `from`/`to` for the tie's ends; this lane already carries a superset of that line).

## 3. The cures, in the brief's order

| Item | 212 (server) | Client twin | Red first -> green | Commit |
|---|---|---|---|---|
| **V8-1** (HIGH) THE BOUNDARY INVERTED | `_gallery_veil_name_search` restated: a boundary is any neighbour not in the blocking table, asked by a lookbehind and a lookahead (nothing consumed), where that end of the name is in the table; the cut-out of open names (`_name_ready`) puts its mark alone, and the marks are read inside each string (`_name_hits`, the open names' pass). NEW `_gallery_veil_name_bound()` (the table: the letters and digits, L* and N*, of Latin, Greek, Cyrillic, Armenian and Georgian and the ASCII digits, over the code points the preparation leaves: 1,434 in 101 ranges; what left the old `bnd`: 760 a prepared text can hold, Armenian punctuation U+055A..U+055F, U+0589, U+058A, U+10FB, the Common modifiers, Coptic, Glagolitic, Tifinagh, Ethiopic and Bamum letters, the Cyrillic combining marks) and NEW `_gallery_veil_name_pad(text)` (call 2: 1,486 code points written between spaces before the search's preparation, in a name's fold and a text made ready; never in the words' fold). Both from `veil-probe-12/gen-name-bound.mjs` (Unicode 17.0, Node 22.23). Rollback: two more drops by signature. 68 helpers | `gallerySecondHomes.js :: NAME_BOUND`, `NAME_PAD`, `namePad` (in `nameFold`, `madeReady`, `buildNameSearch`), the same literals | Red at ac0bb20a4's bytes (`veil-probe-12/out/V8-1-red-at-ac0bb20a4.txt`, a git archive): town-f, 13 strings sent in each of 8 reads; the new arm VEIL-12 THE NEIGHBOURS, 310 sent in each of 8 (2,480), 0 controls lost. Green (`out/V8-1-green.txt`): town-f 0 of 13 sent, f19 and f20 kept, 0 paths server against twin; THE NEIGHBOURS 0 sent, 0 gone; THE TABLE IS ONE (the table and the padded set, every code point of every plane; a hidden name with each code point of the basic plane on each side, 126,974 strings) 0 differ; guards 50 of 50 (galleryVeilHandRows 13, gallerySecondHomes 5, galleryVeilCures 32; born counts unmoved); run-all 35 of 37 (a07, d06), twin 15 of 15. Cost (`out/V8-1-cost.txt`, ms, 211 / before / after): cost8 [50 500 500] 103-118 / 212-228 / 204-245, [200 2000 2000] 817-883 / 2031-2191 / 2090-2182; run-all 3,000 deep 30 / 35 / 37, 200 x 5,000 303 / 339 / 332, 600 x 10,000 1206 / 1216 / 1303 | 6b55663e5 |
| **Ruling (2)** THE IMPRESSION BY ITS WORDS, CLAUSE BY CLAUSE | `_gallery_veil_card`'s impression arm restated: withheld with a shut appearance only where a clause of the appearance and a clause of the impression hold one another, either way (call 3). NEW `_gallery_veil_clauses(jsonb)` (each string in the one fold, cut at the sentence stops, the dashes, `,` `;` `:`, 12 code points or more); `_pieces` and `_embeds` unchanged, so the pressure sentence and the annotation keep their sentence pieces. Rollback: one more drop by signature. 69 helpers. WHAT THE IMPRESSION IS BUILT FROM: the title's presentations (`titleSecretsPresentations.js :: TITLE_PRESENTATIONS`, through `poolMap.js :: titleLinesFor`) or the category's `NPC_PLOT_HOOKS` (`npcGenerator.js :: pickTitle`), drawn whole as `{impression, disposition, behaviour}`; the appearance from `NPC_AGE_DATA`, `NPC_BUILDS`, `NPC_FEATURES` and `NPC_WANTS` (`generateNPCAppearance`): nothing of the one is made from the other | `gallerySecondHomes.js :: clausePieces` NEW (the same cut), `withholdImpression` restated (the same test); `galleryVeil.js`'s call unchanged (its comment) | Red at 4e4ee0528's bytes (`veil-probe-12/out/R2-red-at-4e4ee0528.txt`, a git archive): THE FIVE HOMES re-keyed, 48 rows red (Saltmere appended and rewritten; rewritten wholly in Latin and Greek, a shared clause of eleven, a run across a comma: each in 8 reads), 0 paths server against twin; the 14 WITHHELD rows and the controls green by identity; THE CLAUSES ARE ONE absent. Green (`out/R2-green.txt`): 0 red, 0 paths; the cut one in both engines (the basic plane, 128 texts, and 38 plant strings); the arm live (the three marks taken out of the cut: 12 of the 14 WITHHELD rows red); guards 50 of 50 (13, 5, 32); run-all 35 of 37 (a07, d06), e06 PASS, twin 15 of 15; town-f unchanged; typecheck 1113 / 167, eslint 0. Born (`out/R2-born.txt`, `veil-probe-12/r2-born.probe.jsx`): 464 impressions on the guard's towns (both shapes); the default veil 0 -> 0 withheld, every appearance eye shut 464 -> 0, in each of the four reads, DM off and on, server and twin; all 464 share no clause with their own appearance | the commit carrying this row |

## 4. WHAT IS LEFT, in order (line by line, for the next seat)

1. ~~V8-1 (HIGH), the boundary inverted.~~ Done (section 3; 6b55663e5).
2. ~~Ruling (2) clause by clause.~~ Done (section 3; df73d2865). Then, each its own commit, red first:
   - **Ruling (5) on all four strings**: PART 12 section 7, first bullet, is the design (by identity in
     `_gallery_apply_member_overrides` and the twin's `galleryVeil.js :: galleryPayloadFor`; the pressure sentence by its
     two ends and by the words; the hand rows `veil-probe-11/hand/town-p.json` and `town-pc.json`; the reader's own hand
     row, `REVIEW-VEIL-8/hand/town-g.json`, its gcov1 to gcov3 strings, must go). The born count was 0 of 240.
   - **R2**: PART 12 section 7, second bullet (the processor match lowered as the engine lowers; its hand row).
3. V8-3 (one pass, the reader's `hand/cost8.sql` 10,000 row within TWICE 211); V8-9 (no unbounded pattern, the closed
   answer at any bound); then V8-2, V8-4, V8-5 (each one commit by identity, else the pack's WHAT 212 DOES NOT CLOSE).
   NOTE for V8-3 and V8-9: the name search now carries two generated literals (`_gallery_veil_name_bound`,
   `_gallery_veil_name_pad`) and asks its boundaries by lookaround; any batching of the alternation must keep the
   lookarounds on every batch and the cut-out's mark alone (section 3, V8-1).
4. B (V7-5, a07); C (V7-8, d06; R3 with it); D (the income row by its house).
5. E, the acceptance run at ONE checksum (and the cost law: TWICE 211; at V8-1 the cost8 rows of 500 + 500 and
   2,000 + 2,000 already stood at 2.0 to 2.5 times 211 BEFORE this seat: V8-3 owns them); F (a) to (e); G, the pack.
6. FOR THE CHAIR, with this hand-back: call 1 and call 2 (V8-1) and call 3 (ruling (2), section 0a), each vetoable;
   call 3 (d) above all: the born impressions with every appearance eye shut go from 464 withheld (by identity) to 0
   (by clauses), and an appearance amended by appending with no clause mark now lets the born wording arrive in the
   impression. Both are what the ruling, as written, gives.

## 5. HANDED BACK AT THE COUNT (2026-11-14, after ruling (2))

The count was read at the brief's points: 188,303 before the first builder (most of it the session's fixed context),
243,383 after V8-1 was pushed. With about 57,000 left the seat built one more small cure (ruling (2)), reviewed its diff
line by line, ran the guards (50 of 50), the acceptance run (35 of 37: a07, d06 only; e06 PASS; the twin 15 of 15)
and the three gates itself, pushed it with this file, and hands back: the next item cannot be built AND read line by
line inside the 300,000 mark. Nothing is running; nothing is half built; every commit is pushed.

## 6. How the instruments are re-made (this container's are gone with it)

- Cluster: `mkdir -p /var/tmp/v12pg /var/tmp/rv7; chown postgres:postgres both; su postgres -c
  "/usr/lib/postgresql/16/bin/initdb -D /var/tmp/v12pg --locale=C.UTF-8 -E UTF8 --auth=trust -U postgres"`; append
  `listen_addresses = ''`, `unix_socket_directories = '/var/tmp/rv7'`, `fsync = off`; `pg_ctl ... -w start`.
  `pg@8.13.1` installed in `/var/tmp/v12/pgmod` for `RV6_PGMOD`.
- The reader's library, outside every tree, never committed: `git archive 72a3bb24f
  docs/chair/2026-11-13/probes/REVIEW-VEIL-6 docs/chair/2026-11-13/probes/REVIEW-VEIL-7
  docs/chair/2026-11-14/probes/REVIEW-VEIL-8 | tar -x -C /var/tmp/v12/lib`. The acceptance run:
  `RV6_PGMOD=/var/tmp/v12/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh <worktree> <outdir>`
  (about 20 s).
- The scratch worktree: `git worktree add -b veil12 /home/user/veil12-wt origin/lane/coherence-veil-2026-11-11`, `npm ci`
  (it writes `core.hooksPath=.husky/_` into the shared config: seen, left, the lane hook needs it).
