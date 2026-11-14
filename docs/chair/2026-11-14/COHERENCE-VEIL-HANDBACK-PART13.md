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

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN, untouched) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN, untouched) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` |
| 212 at ac0bb20a4 (PART 12's last) | `a4ed4c0876b2dc51c865565e3390925112e55c7129f0432113acbc2167df5e4f` / down `9968741f0fa90ba986d9a850a58ebad482c079d3ea704bc8361b96a22e9a192d` |
| 212 at V8-1 (the commit carrying this row) | `e879358592e20f0eaeebb994a7a49038181315785168d69636a80ca32cf216ad` / down `4b96fa6cfa1481132f636c419c855808e09031e8d12a672db87785ff188afb86` |

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
| **V8-1** (HIGH) THE BOUNDARY INVERTED | `_gallery_veil_name_search` restated: a boundary is any neighbour not in the blocking table, asked by a lookbehind and a lookahead (nothing consumed), where that end of the name is in the table; the cut-out of open names (`_name_ready`) puts its mark alone, and the marks are read inside each string (`_name_hits`, the open names' pass). NEW `_gallery_veil_name_bound()` (the table: the letters and digits, L* and N*, of Latin, Greek, Cyrillic, Armenian and Georgian and the ASCII digits, over the code points the preparation leaves: 1,434 in 101 ranges; what left the old `bnd`: 760 a prepared text can hold, Armenian punctuation U+055A..U+055F, U+0589, U+058A, U+10FB, the Common modifiers, Coptic, Glagolitic, Tifinagh, Ethiopic and Bamum letters, the Cyrillic combining marks) and NEW `_gallery_veil_name_pad(text)` (call 2: 1,486 code points written between spaces before the search's preparation, in a name's fold and a text made ready; never in the words' fold). Both from `veil-probe-12/gen-name-bound.mjs` (Unicode 17.0, Node 22.23). Rollback: two more drops by signature. 68 helpers | `gallerySecondHomes.js :: NAME_BOUND`, `NAME_PAD`, `namePad` (in `nameFold`, `madeReady`, `buildNameSearch`), the same literals | Red at ac0bb20a4's bytes (`veil-probe-12/out/V8-1-red-at-ac0bb20a4.txt`, a git archive): town-f, 13 strings sent in each of 8 reads; the new arm VEIL-12 THE NEIGHBOURS, 310 sent in each of 8 (2,480), 0 controls lost. Green (`out/V8-1-green.txt`): town-f 0 of 13 sent, f19 and f20 kept, 0 paths server against twin; THE NEIGHBOURS 0 sent, 0 gone; THE TABLE IS ONE (the table and the padded set, every code point of every plane; a hidden name with each code point of the basic plane on each side, 126,974 strings) 0 differ; guards 50 of 50 (galleryVeilHandRows 13, gallerySecondHomes 5, galleryVeilCures 32; born counts unmoved); run-all 35 of 37 (a07, d06), twin 15 of 15. Cost (`out/V8-1-cost.txt`, ms, 211 / before / after): cost8 [50 500 500] 103-118 / 212-228 / 204-245, [200 2000 2000] 817-883 / 2031-2191 / 2090-2182; run-all 3,000 deep 30 / 35 / 37, 200 x 5,000 303 / 339 / 332, 600 x 10,000 1206 / 1216 / 1303 | the commit carrying this row |

## 4. WHAT IS LEFT, in order

1. ~~V8-1 (HIGH), the boundary inverted.~~ Done (section 3).
2. Ruling (2) clause by clause; ruling (5) on all four strings; R2.
3. V8-3; V8-9; V8-2, V8-4, V8-5.
4. B (V7-5, a07); C (V7-8, d06; R3 with it); D (the income row by its house).
5. E, the acceptance run at ONE checksum; F (a) to (e); G, the owner's pack.

## 5. How the instruments are re-made (this container's are gone with it)

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
