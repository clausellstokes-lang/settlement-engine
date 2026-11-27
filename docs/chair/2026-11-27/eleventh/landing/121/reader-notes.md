# READER 121 — running notes (independent reader of point 121, "TAIL-PICKS")

Session container: own cloud checkout. Scratch: `<scratchpad>/r121` (outside the repository; linked as /home/user/r121).
Every number below is from my own scripts (`scripts/`, `tools/` in the scratch) unless a line says otherwise.

## 0. Setup (2026-11-27, session start 19:59 UTC)
- `npm ci` (exit 0); `git fetch --unshallow origin` (exit 0); `review-fixes-2026-07-08` fetched as a local ref.
- Chair's record: `lane/chair-2026-11-08` at e5c601208 (worktree `/home/user/chair`, read-only). My push branch
  `lane/reader-121-2026-11-27` is cut from that tip.
- BASE: 360e716c2f7f52669e531d9aa603c61c1222acbc (`/home/user/base`, detached).
- JUDGED: `lane/stack-121-tail-wip-2026-11-27` at 2ab62ef33526f61876a2167c483c37e36816ab86 (`/home/user/tip`, detached). Seven commits above the
  base: 39e0063c4 door, 999135901 fortune, 4471a391f traditions, 11f0197cb tonight, cf2e84c2d frames, 757c10115 the short round, 2ab62ef33 the merge.
- `git diff --stat 360e716c2 2ab62ef33`: 27 files, +719 −251: 11 under src, 16 under tests (5 new).
- Read whole: the assignment; RULING-121-1, RULING-121-3, RULING-121G-1; the handoff's entry V9 ONLY (not V15/V16: the chair's view of this change);
  TAIL-REPORT.md, TAIL-SITES.tsv; RULING-G G63 and G79; landing/120/reader-notes.md (the method); rmeasure/tools (all); the diff under src (all).

## What the diff is (by reading; each claim below is then executed)
- `src/kernel/proseHash.js`: `pickRendezvous` rewritten over two shared helpers (`rendezvousEntry`, `rendezvousBefore`); new `rankRendezvous(lines, key, idOf)`.
- `src/domain/facts/drawDeclared.js :: drawDeclared`: a ranked mode (`options.rankKey` a string; `taken`), `drawRanked`, `admitter`, `rankedIdOf`;
  `draw` now optional; a new guard `throw new TypeError('drawDeclared: no draw and no rankKey …')`.
- ONE caller of the ranked mode under src: `traditions/traditionDescription.js :: draw` (no `taken`, no `keepRefused`). `drawTurn` walks `rankRendezvous`
  itself (its `taken` is a set of RENDERED SENTENCES, not the door's `taken` of ids) and hands the turned line to the unranked door (`draw: () => turned`).
- fortune (2 draws): `pickRendezvous` INSIDE the unranked door's `draw`; tonight `castWantOf`: `pickRendezvous` over the lines `castWantAdmits` admits;
  ring: `rankRendezvous` walked, the list door (`filterDeclared`) asked a row at a time, RING-2 skipped where `streetsNotQuiet`; scope line and the three
  PDF heads: `pickRendezvous` over the whole pool (no door, no admission).
- Data: `traditionDescriptionTable.js` gains `id` on every row; CAST_WANTS rows `{ id, text }`; ORGANIZED_RING_NOTES rows `{ id, text, … }` exported;
  SCOPE_LINE_FRAMES rows `{ id, say }` exported; three headline lists hoisted to module level as `{ id, say }` rows, exported.

## (1) THE RANK AND THE DOOR — CONFIRMED by execution (`scripts/q1-kernel.mjs`, `q1-tie.mjs`, `q1-door.mjs`; `out/q1-*.txt`)
THE RANK (tip `rankRendezvous` / `pickRendezvous`, against my own FNV-1a 32 + murmur3 fmix32 in BigInt):
- 20,000 random pools (1 to 30 lines, non-ASCII ids): rank == my reference 20,000; `pickRendezvous === rankRendezvous[0]` 20,000; the tip's
  `pickRendezvous` === the BASE's `pickRendezvous` 20,000 (point 120's picks do not move by the rewrite); shuffled / reversed list: the same rank 20,000 / 20,000.
- one line removed: the others keep their order 20,000; one line added: the others keep their order 20,000; the added line heads the rank 2,022 (1/(n+1): 2,031).
- TIES: 5 true 32-bit collisions of my own under the key `dp-town-7::tradition.dp_town_7.1#done` with ids of the table's own form (e.g.
  LEAD.feast.1039599 / LEAD.feast.1222382 = 1368821740): the two adjacent, the SMALLER id by string first, in either list order; pick equal on tip and base: 5/5.
- EMPTY list / not an array (null, undefined, a string, an array-like, a number): rank `[]`, pick `undefined`.
- FALSY KEY ('' null undefined 0 NaN false): the rank is the list's OWN ORDER (a copy), the pick `lines[0]`: order-dependent (as the base's pick). '0' is truthy.
- A LINE WITH NO ID, outside the door: `idOf` gives undefined, hashed as the string 'undefined': the id-less lines sit in LIST ORDER (2,000/2,000; the
  reversed list gives the other end): POSITION decides among them, silently. (The cast wants, the ring, the scope line, the heads and the fortune draws
  call the helper with `(l) => l.id`; the door and `traditionDescription.js :: ownIdOf` throw instead.) DUPLICATE ids: list order, 2,000/2,000.
- SPREAD: 5 ids x 5 rank positions over 200,000 keys: chi2 28.0 on 16 df. Two pools with the SAME ids under DIFFERENT keys agree 40,301 of 200,000
  (40,000 if independent). NOTE: under ONE key two pools sharing ids agree always (the PDF heads and the scope line share ids 'local', 'official',
  'traveller', 'newcomer' but never a key).
THE DOOR'S RANKED MODE (my pool: 5 lines + 2 twins, the atom `tier: ≥ village`, a thorp and a town; 2,000 keys):
- (0) the door prints what my own reading of the claim says (highest in my rank that the place admits, or whose twin it admits): 4,000/4,000
  (by twin 520; a refused top with a REFUSED twin gives the next printable 281).
- (i) A LINE ADDED THAT THE PLACE REFUSES: printed line AND ledger note unchanged 2,000/2,000 (with a refused twin of its own: 2,000/2,000).
  (i') a refused line added WITH an admitted twin is a line the place can print: moved 411, should 411, wrong 0.
- (ii) a line removed that the place did not print (an unprinted twin too): unchanged 23,480/23,480. The printed line removed: the next printable 1,000/1,000.
- (iii) refused top + admitted twin: `{ line: twin, resolvedBy: 'twin', refused: [the top's atoms] }`, one note (the twin's id, 'twin').
- (iv) `taken`: the next in rank 2,000/2,000; all taken: none, no note.
- (v) `keepRefused`, nothing printable: the head of the rank, 'kept', one note 2,000/2,000. (vi) `held`: skipped before the rank 2,000/2,000; a held twin
  never prints 426/426; every candidate held: none, no note, no roll.
- (vii) an undeclared pool: the top, noted once 'drawn'; the facts thunk is read 0 times. (viii) facts null: every declaring line refused (fail-closed).
- (x) a line with no id (a bare string, an object): `TypeError: drawDeclared ranked mode: a line with no id in pool …` (a numeric id is accepted as its string).
  `rankKey` AND `draw` both given: `draw` is never called. A NUMBER `rankKey` is not the ranked mode (the draw is called).
  No `draw` and no `rankKey`: tip `TypeError: drawDeclared: no draw and no rankKey (pool)`; base `TypeError: options.draw is not a function` (a TypeError both).
- TWO EDGES, both UNREACHABLE today (no caller under src passes `taken` or `keepRefused` with `rankKey`):
  (v') `keepRefused` + nothing printable + a REFUSED line added: the KEPT line moves in 515 of 2,000 keys (the head of the rank is kept, and a refused
       line can head it): there the bar "nothing a place cannot print may change what it prints" does not hold.
  (iv') `taken` holding a TWIN's id: the twin still prints 426/426 (taken is asked of the domain, never of a twin).
  (ix) `rankKey: ''` is the ranked mode with a falsy key: the list's own order, so POSITION decides (the one caller's key always holds '::').
THE UNRANKED MODE, tip against base, by the same calls: 20,000 random calls (pools with and without ids, twins, colour, crisis-scoped, pool atoms,
  held, keepRefused, a null draw, five records and none) through each tree's own door: result AND ledger identical 20,000/20,000
  (outcomes reached: none 7,368, drawn 8,245, argmax 2,876, twin 916, kept 595). On the corpora: below ((4), records and pages).

## (8) THE WALKERS AND REGISTERS — part 1, CONFIRMED (`scripts/q8-presumed.mjs`: each tree's own `tests/lint/presumedThings.shared.mjs :: scanTree`)
- `git diff --stat 360e716c2 2ab62ef33 -- tests/lint scripts`: EMPTY. No register, baseline, census or walker file changed against the base (the 27
  changed files are 11 under src, 12 under tests/domain, 2 under tests/domain/{display,facts}, 1 tests/kernel, 1 tests/security).
- THE PRESUMED-THINGS WALKER'S ARM 1 READING (its own `scanTree(root)`), base against tip: 5,359 hits on both (5,395 with its instruments), the SAME set
  of hit keys (sha256 of the sorted keys 1c2153c5cac42b53 on both); `src/data/institutionServices.js`: 131 hits on both. The builder's "131" stands.
- THE DIRECT RETURN RESTORED (my scratch worktree /home/user/q8 = the tip with `return drawRanked(…)` in place of `const ranked = …; return ranked;`):
  5,348 hits, key hash 365e48a3c3230b05: 19 keys differ. On `src/data/institutionServices.js` 131 -> 121: 14 hits GONE (armedForce 2, market 4,
  militia 3, mill 1, watch 4) and 4 NEW (siege 3, walls 1); and 1 GONE on `src/domain/prose/holderTable.js` (market). The door's comment says "moves 10
  hits on institutionServices.js": the net there is 10, the keys that move are 18 there and 1 in a second file the comment does not name.
  So the walker's reading of two files that this change does not touch hangs on whether the door RETURNS A CALL: `presumedThings.shared.mjs :: trace`
  follows a returned call's arguments as a reach. The builder bound the result to a name instead of teaching the trace; a comment in the door is what
  holds it. (The walker's own verdict on that plant: below, when run.)

## Corpora (re-born by me; never a number carried from elsewhere)
- C = `rmeasure/tools/plan-C.json` (900: dp-<size>-<i>, { settType }); V = `plan-V.json` (the same 900 seeds, the visitor's config).
- Born as `births.census.jsx` births them (`generateSettlementPipeline(birthConfig(row.config), null, { seed, customContent: {} })`), on the BASE and
  on the TIP, twice over: by my page harness (`tools/h121.jsx`, the record's rmeasure harness with a player/share walk and a base-stamped share walk
  added; a warm-up dossier rendered and discarded first in every process, for the lazily loaded panel) and by my site harness (`tools/hB.jsx`: each
  site's own function called on the born record, every pick's key and every door call's pool, admission and result traced by bundle-time wraps; the PDF
  chapters walked as element trees; Foundry, the AI grounding, TonightSheet / TableView / SessionMode as components). One esbuild bundle a tree
  (`tools/build121.mjs`, `tools/buildB.mjs`); no tree is written. ONE heavy job at a time, through `scripts/queue.sh`.

## (4) RECORDS MOVED, AND THE UNRANKED DOOR ON THE CORPORA — CONFIRMED (`scripts/an-sites.mjs`; `out/an-sites-{C,V}.txt`)
- RECORDS MOVED base -> tip: C 0 of 900, V 0 of 900 (sha256 of JSON.stringify(record)).
- EVERY CALL OF THE DOOR DURING A BIRTH (`drawDeclared`, `filterDeclared`: pool, key, surface, kind, pool size, resolvedBy, the line, the refused
  atoms), in order, base against tip: the whole sequence equal in C 900/900 towns (2,997,784 calls) and V 900/900 (2,919,694 calls).
- EVERY CALL OF THE DOOR WHILE THE SAVE'S STAMP IS COMPOSED (`composePublicProse`: every desk's reader as the player view reads it; the converted
  pools aside): sequence equal C 900/900 (15,653 calls), V 900/900 (26,170 calls).
- A record read back from its JSON (a save's round trip) gives every site the same lines AND the same traces as the record born in memory: C tip
  900/900, C base 900/900 (so the plants below run on the saved records).

## (2) EACH CONVERTED SITE — CONFIRMED (`an-sites.mjs`; C | V)
WORDS (each tree's own exports, compared by value): `traditionDescriptionTable.js` 17 exports; with the ids taken off, deep-equal to the base's 17/17
  (words, needs, excludes, crisis, twinOf, colour); 143 rows, 143 ids, 143 distinct, all of the form <TABLE>.<pool>.<n>; the base's rows carry no id.
  Fortune rows equal (ids A B C; A B C both: as on the base). Cast wants: words equal role by role in order; 13 ids. Ring notes: words and declarations
  equal; RING-2 alone declares (needs `tier: ≥ village`, excludes `crime wave`). Scope frames: what each prints equal, in order. The PDF heads' lists
  were inside their functions on the base: compared by what prints (the base's own FNV modulus reproduced: its row for every key, below).
KEYS, ADMISSION, THE PICK (base against tip, every draw of both corpora):
- FORTUNE (`governanceAccount.js :: governanceAccountOf`): towns with a fortune sentence 93 | 90 of 900. Merit draws 40 | 51, lasting 53 | 39: the pick's key
  (`place::event::yearsAgo`, `place::age`) and the door's key equal to the base's on every draw; pool equal; tip's line == the head of my own rank on
  every draw. Lines moved: merit 24 | 39, lasting 40 | 24. The player's paragraph (the veiled record) draws the owner's line 900/900 | 900/900.
  STILL BY INDEX in the same paragraph, NOT converted and not in the claim's list (the census names it, TAIL-SITES row 25, LEAVE):
  `governanceAccount.js :: arrangementOf` (`fnv(seed::slot) % n`) picks the seat's three arrangements, the capture / corrupted / competitive / tense
  sentences (2 each), the CONSEQUENCE wordings (2 or 3 a tie) and the fracture line: a wording added to one of those lists re-deals its towns.
- THE TRADITION DESCRIPTION (`traditionDescription.js :: draw`, `drawTurn`): owner's page: 843 | 853 towns with rites, 2,506 | 2,541 rites, 8,847 | 8,965
  door calls; the reader's (the shared page's rows): 8,844 | 8,912. The sequence of (pool, key) asked equal to the base's in every town; on every ranked
  draw `rankKey` === the door's `key` === the key the base's `pickVariantMixed` was handed (8,631 + 8,649 | 8,697 + 8,652).
  ADMISSION: for every line the door was handed, its admission and its twin's, base against tip: equal on EVERY draw (C 8,847 + 8,844, V 8,965 +
  8,912). (Where the rotation stood on one tree only the door was also handed the `again` lines: C 139 + 121 draws, V 189 + 168; the common lines equal.)
  THE PICK: on every ranked draw the door's line == my own reading (my rank over the pool's ids; the first line admitted, or whose twin is):
  C owner lead 2,506, gloss 2,506, house 1,291, power 849, cause 900, economy 579 (8,631/8,631); C reader 8,649/8,649; V 8,697/8,697 and 8,652/8,652.
  resolvedBy: tip drawn 8,502 twin 345 | drawn 8,647 twin 318 (base: drawn 8,491 twin 356 | drawn 8,644 twin 321); no 'none', no 'kept', no 'argmax'.
  Rotated draws (the turn) on the tip: C house 102, power 14, economy 95, cause 5 (base house 108, power 11); V house 96, power 74, economy 97, cause 1.
  `describeTradition(rite, { set })` a rite at a time == `describeTraditions(set)` 900/900 | 900/900. Lines moved (owner, by table): C lead 1,894,
  gloss 1,706, house 922, power 591, cause 608, economy 443; descriptions that differ 2,456 of 2,506 | 2,486 of 2,541.
  SPREAD (ranked draws, tip): lines printable in 50 or more draws 92 | 105: printed by none 0 | 0; over 3x its share 0 | 0; z sd 0.86 | 0.94, max |z| 2.21 | 2.53.
  Owner against reader on one slot key: C 7,024 of 7,024 the same line; V 7,108 of 7,109 (the one: dp-metropolis-42's economy frame, whose ROTATION
  differs because the reader's earlier rites named other incomes; lead and gloss never differ).
  STILL BY POSITION, by ruling 121-1: the `again` lines (KEEPER_FRAMES_TOO) are walked in their written order after the rank.
  `OWNER_FRAMES` is drawn by no town of C or V (no rite of a fresh birth carries an owner).
- TONIGHT'S CAST WANTS (`tonightSheet.js :: castWantOf`): 31 | 40 calls, one a town, ALL of the `lever` role. Arguments equal; the key
  `person|crisis|role` == the base's `castHash` key 31/31 | 40/40; the pool and the lines `castWantAdmits` admits equal 31/31 | 40/40; tip == the head of
  my rank over the admitted ids 31/31 | 40/40. Moved 26 | 36. NOTE (the key, as on the base): every one of these is a crisis STAND-IN
  (`generators/steps/resolveCrisisCast.js`: `id = npc_temp_<kind>`, no goal, no house), so THE KEY HOLDS NO TOWN: C's 31 calls are 4 distinct keys
  (`npc_temp_warden|monster_pressure|lever` in 19 towns, `npc_temp_healer|plague_onset|lever` 5, `npc_temp_grain|famine|lever` 4,
  `npc_temp_healer|mass_migration|lever` 3): every town with that stand-in in that crisis voices the SAME want, and lever.2 ({house}) is refused in
  every call. A born person always carries a goal, so no other role's pool is drawn on C or V. The census (TAIL-SITES row 15) read this key as
  "falls back to the person's name": the same class as the economics head's key (no town), not this change's.
- THE RING VANTAGE (`defenseDisplay.js :: withRingVantage`): organised 174 | 197 towns; key equal 174/174 | 197/197; the vantages a place can print (my
  own walk: the list door a row at a time, RING-2 also needing quiet streets) equal to the base's 174/174 | 197/197; the vantage step == the first of my
  rank the place can print 174/174 | 197/197. Places that refuse RING-2: 84 | 87. The note printed after the later rules: tip RING-1 34, RING-2 19,
  RING-3 32, RING-4 29, other 60 | 41, 23, 31, 39, 63 (base 40, 14, 32, 28, 60 | 54, 18, 32, 30, 63); moved 76 | 95.
  THE EXCEPTION (the base's ONE drawn row refused, the table's own note printed): 23 | 28 places; there the tip prints RING-1 8, RING-3 9, RING-4 6 |
  14, 5, 9. RING-2 printed where the place cannot print it: 0 | 0.
- THE SCOPE LINE (`settlementQuickGuide.js :: cultureScopeLine`): 900 | 900 picks; key equal 900/900; frame moved 723 | 723 (C and V are the same seeds);
  tip == my rank's head 900/900. Tip frames plain 197, traveller 194, official 180, newcomer 171, local 158.
- THE PDF HEADS (`pdf/lib/headlines.js :: seedPick`): overview 293 | 287 picks (a crisis in force), economics 876 | 794, people 758 | 765; key equal to the
  base's on every pick; no empty key on either corpus; tip == my rank's head on every pick; moved overview 232 | 222, economics 730 | 632, people 381 | 380.

## (3) THE BAR, BY MY OWN PLANTED EDITS — CONFIRMED on C (`scripts/plants-spec.mjs`, `plant-run.sh`, `an-plant.mjs`; `out/plants/results-C.txt`; V below)
Each plant is ONE source replacement applied IN MEMORY at bundle time (`tools/buildB.mjs --plant`, each anchor must occur exactly once; no tree
touched), the tip's and its twin on the base; the 900 saved records of C are read by the planted bundle and by the unplanted one; a town "moves" when
what the site prints differs. "Should move" is my own reading from the UNPLANTED run's picks and my own hash (the tip only: the base picks by position).
Tip: moved / should; extra; missing   [base: towns moved, of them NOT printers of the edited line]. In every plant the other sites moved 0.
ONE TRADITION TABLE, `ELEMENT_GLOSS` (the founding pool: 1,282 draws in 623 towns):
- T1 a printed line removed (GLOSS.founding.2):                213 / 213; 0; 0   [420, 206]
- T2 a line added (GLOSS.founding.4, colour):                  136 / 136; 0; 0; every moved town prints the new line   [461]
- T3 a line added with a need NO town of C has (`river`):        0 / 0; the 1,282 draws that refuse it: 0 moved   [408]
- T3b a line added with a need SOME towns lack (`tier: ≥ town`): 73 / 73; 0; 0; all to the new line; the 542 draws that REFUSE it: 0 moved
- T4 a line re-worded in place (GLOSS.founding.1):             211 / 211; 0; 0   [212, 0]
- T5 the pool's rows in reverse order:                           0 / 0   [419]
- T6 a line no town printed, removed (TOO.seat.2, an `again` line printable in 28 rotated draws, printed in none): 0 / 0   [0]
     (no line of a RANKED tradition pool is printed by no town of C: every drawn pool's every line prints somewhere)
- T7 a drawn line of a declared pool removed (GLOSS.harvest.3):  82 / 82; 0; 0   [162, 83]
- T8 a TWIN removed (GLOSS.harvest.2):                          25 / 25; 0; 0   [20, 0]
THE TURN (frames the rotation walks):
- T9 HOUSE.placePower.2 removed:  165 / 165; 0; 0; 66 rotated draws of the pool in 30 towns: the 7 of those towns that did not print the removed line: 0 moved   [271, 97]
- T10 ECON.chief.2 removed:       213 / 213; 0; 0; 185 rotated draws in 84 towns: the 13 that did not print it: 0 moved   [293, 72]
     (so a second rite's turned wording is stable when a line neither rite printed is removed)
- T11 POWER.seat.4 added (colour): 218 towns moved; every one prints the new line somewhere; 436 of the 438 moved draws go to the new line; the other 2
     (dp-town-22, owner and reader) are a CASCADE through the rotation: its first rite takes the new line, which frees "It falls to {power}.", and its
     later rite, whose rank that line heads, turns back to it. (8 of the 218 are towns where the new line out-ranked a ROTATED wording.)   [base: 618 towns moved]
- T12 A DECLARED LINE ADDED TO A FRAME TABLE (HOUSE.placePower.4, needs `coast`; no town of C has a coast, so EVERY town refuses it):
     30 TOWNS MOVE (66 draws), none can print the line: every town with a rotated draw of that pool. `traditionDescription.js :: drawTurn` rotates
     only where `all.every(isColourLine)`: one declared line switches the rotation OFF for every town, and each of the 30 then prints one keeper
     sentence under two rites (dp-town-62: "It is held at the weekly market, in the keeping of the Merchant Guilds." under rites 1 and 2; unplanted: 0
     such towns). The same rule on the base (278 towns moved there). HERE THE BAR DOES NOT HOLD: a line no place can print changes what 30 places print.
     (Whether a walker forbids a declared line in a frame table: (7), mutant H3.)
THE SCOPE LINE (5 frames, each printed by 158 to 197 towns: none is printed by no town, so that removal cannot be planted here):
- S1 a printed frame removed ('official'): 180 / 180; 0; 0   [720, 539]      - S2 a frame added ('visitor'): 160 / 160; all to it   [709]
- S4 re-worded in place ('traveller'):     194 / 194; 0; 0   [184, 0]        - S5 rows reversed: 0 / 0   [755]
- S3 a frame added WITH `needs: ['coast']`: 160 / 160, the same towns as S2: all 160 print it and NONE has a coast (900 of 900 towns of C have none):
     A NEED ON A ROW OF THIS POOL IS READ BY NOBODY (no door stands at the scope line or at the PDF heads; `scripts/q3-s3-coast.mjs`).
THE CAST WANTS (the lever pool: 31 calls, 4 keys):
- C1 a line no town printed, removed (lever.2, refused in every call): 0 / 0   [4, 4]     - C2 a printed line removed (lever.3): 22 / 22   [4, 0]
- C3 a line added (lever.4): 5 / 5, all to it   [19]     - C4 a line added that needs a house ({house}; all 31 refuse it): 0 moved   [19]
- C5 re-worded (lever.1): 9 / 9   [27, 0]                    - C6 rows reversed: 0 / 0   [31]
ONE PDF HEADLINE LIST (the economics head, 876 picks):
- H1 a printed row removed ('official'): 191 / 191; 0; 0   [694, 268]   - H2 a row added ('merchant'): 203 / 203, all to it   [700]
- H3 re-worded ('trade'): 275 / 275   [60, 0]                           - H4 rows reversed: 0 / 0   [876]
BEYOND THE BRIEF, THE RING: R1 RING-3 removed 56 / 56 [113, 68]; R2 RING-5 added needing `tier: ≥ city` 33 / 33, all to it [127];
  R3 RING-2 (the streets vantage, refused by 84 places) removed: 21 / 21: only the towns that printed it [116, 87].
NO TOWN MOVED THAT SHOULD NOT in 30 of the 31 plants; the one that does is T12. (Five plants were added later, below: T14, the same shape as T12 at
another pool, and T13, T15, T16, the id test's removals and replacements. The final count: 36 plants; a town moves that should not under T12 and T14,
and under T13 and T16, which re-number ids on purpose.)

## Housekeeping
- My first push of the notes (019bf004a, 20:55 UTC) went out WITHOUT the pre-push hook: the report worktree, cut fresh from the chair's tip, had no
  `.husky/_` (the shims `npm ci` writes only in the main checkout), so git found no hook. Not `--no-verify`. Cured (`npx husky` in that worktree);
  every later commit and push runs the hooks.

## (3)/(7) T12's GUARD, AND THE NEW ID TEST UNDER HONEST WORK — CONFIRMED (`scripts/mutants.mjs` in my scratch worktree /home/user/mut, `mut/results-h3.jsonl`)
- H3 (the declared frame line of T12, tests untouched): RED on the two COUNT pins (`traditionDescriptionFrames.walker` "THE COUNT … expected 144 to
  be 143"; `traditionDescriptionIds` "143 ids") and on 2 rows of `tests/domain/traditionDescription.test.js` "ONE TOWN, NO SENTENCE TWICE".
- H3b (the same, the two pins moved to 144 as an author would): STILL RED on those 2 rows ("A KEEPER SLOT THAT R…: expected 2 to be 3"; "THE EIGHT
  TOWNS …: expected [ …(2) ] to deeply equal []"). So T12's edit AT THIS POOL cannot land unseen while those rows stand (at CAUSE_FRAMES.dead the same edit reds NOTHING: "THE EXCEPTION'S GUARD, POOL BY POOL", below). No walker states the rule itself ("a frame
  table holds colour lines only"): `traditionDescriptionFrames.walker` asks only that a colour line declare nothing else.
- H1b AN HONEST REMOVAL (GLOSS.founding.2 removed, ITS ID RETIRED so the pool reads .1 and .3; the two pins moved to 142): RED in
  `tests/domain/traditionDescriptionIds.test.js :: each pool's lines are <TABLE>.<pool>.1 … n in order`: "ELEMENT_GLOSS.founding: expected
  [ 'GLOSS.founding.1', 'GLOSS.founding.3' ] to deeply equal [ 'GLOSS.founding.1', 'GLOSS.founding.2' ]". THE NEW TEST DEMANDS IDS DENSE 1..n IN ORDER:
  the only way to green it after a removal is to RENUMBER the survivors, which the table's own header forbids ("never renumbered or reused (a removed
  line's id is retired)") and which re-deals every town that printed a renumbered line. (Also red there, on its own law: the walker's FLOORS,
  "gloss.founding: 2 < 3": every gloss pool is AT its floor of three, so no gloss line can be removed without adding one.)
- H2b an honest append (GLOSS.founding.4 'keeps the founding day', pins to 144): the ids test and the count GREEN; RED only on the walker's style law
  ("no first sentence says 'kept' twice": my words, not the ids).

## (4) LINES MOVED AT THIS CHANGE, BY SITE — CONFIRMED (the sites' own functions on every town, base against tip; C | V)
- the scope line 723 | 723 towns; the ring note 76 | 95; the governance paragraph (a fortune sentence) 64 | 63; tradition descriptions 2,456 of 2,506 in
  842 towns | 2,486 of 2,541 in 852 (the reader's rows 2,452 | 2,487); the PDF heads: overview 232 | 222, economics 730 | 632, people 381 | 380;
  the Tonight sheet's cast want 26 | 36.
- ON THE OWNER'S TABS (scope + ring + governance + descriptions): mean 3.69 | 3.74 lines a town; towns by count C 0:9 1:82 2:240 3:169 4:114 5:95 6:86
  7:49 8:44 9:12; no town of either corpus has nothing moved on any surface.
- The rendered pages (what differs OUTSIDE the sites): below, when the tip's pages are rendered.

## (5) EVERY SURFACE — part 1, CONFIRMED on the tip, every town of C and V (`an-sites.mjs`; `tools/hX.jsx`, `out/x-C-tip`)
Surfaces found by reading every caller of the seven sites' functions: the tabs (Overview's identity line; Power's governance paragraph; Defense's
criminal structure; Traditions); the shared page (the four STAMPED blocks); the dossier search (`dossierSearch.js :: traditionsOf`, the same leaf); the
PDF (`Overview`, `EconomicsTrade`, `NotableNPCs` heads; `PowerStructure`; `DefenseSecurity`; `IdentityDailyLife`; `Traditions`, mounted only with a lit
mirror; `TonightAtTheTable`); Foundry (`journalPages.js`: the three heads, the Tonight page); `TonightSheet.jsx` under `TableView.jsx` and
`SessionMode.jsx`. The campaign book and the world book print none of these lines (no caller). The committed edge bundles (`supabase/functions/_shared/
engineBundle.js`, `aiGroundingBundle.js`, built 2026-11-19) hold none of the seven sites (0 matches of their keys and pools).
- PDF chapters walked as element trees (each <Text> a line; `SettlementPDF` called as `utils/generateSettlementPDF.js` builds its props, canon phase):
  PowerStructure holds the governance paragraph 900/900 | 900/900; IdentityDailyLife the scope line 900/900 | 900/900; DefenseSecurity the ring note
  430/430 | 450/450; Overview / EconomicsTrade / NotableNPCs hold their head 900/900 each | 900/900 each; TonightAtTheTable the cast want 31/31 | 40/40.
- Foundry (`buildFoundryModuleFiles`, markdown unescaped): the three heads 900/900 each | 900/900; the Tonight page the cast want 31/31 | 40/40.
- `TonightSheet`, `TableView`, `SessionMode` rendered as components: the cast want 31/31 each | 40/40 each. The sheet's own coherence check
  (`crisisFactFindings.js :: crisisCastSenseFindings`, which re-asks `castWantOf`): 0 findings on 900 C towns, tip and base.
- THE STAMP a fresh save stores: 'overview:identity'.scope == the line 900/900 | 900/900; 'power:governance' == the player's paragraph 900/900 | 900/900
  (and the player's fortune line == the owner's 900/900); 'defense:criminal'.ringNote == the tab's note 432/432 | 456/456; 'traditions' rows == the
  reader's rows 843/843 | 853/853. A fresh share's public record holds no `_seed` (0/900): the stamp is what carries the seed-keyed lines.
- THE SEARCH (`enumerateDossierObjects`): holds every description the tab prints: the owner's view 843/843, the owner's player view (the reader's
  text) 843/843, the shared page (the stamp's rows) 843/843 (C).
- THE PDF's TRADITIONS CHAPTER is not mounted on a fresh birth (no lit mirror: 900/900). With the mirror lit by me (the set the tab shows): the lit
  record describes as the tab does 843/843 and the chapter holds every description 843/843 (C).
- A DM SHARE (full), walked on 60 towns of C: the scope line 60/60, the ring note 60/60, the owner's governance paragraph 60/60, the stamp's (reader's)
  tradition rows 60/60.
- THE AI GROUNDING (`buildAiGroundingPayload`): holds none of the sites' sentences: 0 hits on 900 | 900 towns (scope line, each head, a description,
  a want, the ring vantage, the governance paragraph searched as strings).
- A PAGE STAMPED ON THE BASE, READ ON THE TIP (from the two trees' stamps): differs from the owner's tip page in 891 | 894 of 900 towns: scope 723 | 723,
  governance 64 | 63, ring note 76 | 95, traditions 838 | 848 towns (2,452 of 2,506 | 2,487 of 2,541 rows). Rendered: below.

## (6) WITHIN ONE PAGE — part 1, CONFIRMED
- A whole sentence under two rites of one town (owner and reader): C base 0, tip 0; V base 0, tip 0.
- The ring's "streets" vantage where the place cannot print it (a thorp, a hamlet, a crime wave, unquiet streets): 0 | 0 on the tip.
- A tradition line the place refuses: on every ranked draw the printed line is one my own walk says the place admits, or the admitted twin of a
  refused one (C 17,280, V 17,349 draws); a rotated draw prints a colour line (it declares nothing).
- A cast want against the town's facts (`scripts/q6-wants.mjs`: 120,000 combinations of role, person, 15 crises, a house or none, the seat held or
  empty): a held-seat want under an empty seat 0; a house line for a house-less person 0; "<plural noun> takes" 0; an unfilled slot 0; on tip and base.

## (9) ANYTHING ELSE — part 1 (by reading and by hash)
- The diff base..tip is exactly the six commits' 27 files (the merge added none; its one conflict, `tests/domain/tailDefeconDisplayLines.test.js`, keeps
  both sides' rows). NOT CONVERTED, BYTE-EQUAL TO THE BASE (sha256): `dossier/hookLines.js`, `display/tensionCause.js` and `data/tensionCauses.js`
  (no importer under src but themselves), the eight sites outside the line (`causeConjunctionContent`, `causeLifecycleVocabulary`, `heraldCausalGrammar`,
  `marketPrices`, `settlementRumors`, `warAndRoadNames`, `traditions/prose`), the three LEAVE sites (`composeStateProse`, `stateProseKernel`, `foodways`),
  and point 120's `dailyLife.js` and `dossierViewModel.js`.
- 58 files under src call the door (42 `drawDeclared(`, 26 `filterDeclared(`, 15 `resolveDeclared(`, 38 `resolveSibling*(` call sites, the same counts
  on base and tip); ONE passes `rankKey` (`traditionDescription.js`).
- WHAT THE MESSAGES DO NOT SAY (each small):
  * `drawDeclared.js`: `draw` is now OPTIONAL in the options' type, so a caller that passes neither `draw` nor `rankKey` type-checks and throws at
    run time (the base's type required `draw`); the ranked mode silently ignores `registry` (no caller passes both); the file's head still
    describes only the unranked resolution.
  * `defenseDisplay.js :: ORGANIZED_RING_NOTES`: two comments still say a refused vantage "prints the table's own note" (the W2-C-LEAVES-9 paragraph and
    the line above RING-2), and "Index 0 is the original": on the tip a refused vantage gives the NEXT row of the rank.
  * `scripts/lib/table-pools.mjs` (the pool table of the census scripts, untouched): its `drawSite` for `tonightSheet.CAST_WANTS` still reads
    "pool[floor(castHash(personId, crisis, role) * n)]".
  * `KEEPER_FRAMES_TOO` rows carry ids (TOO.*) that no pick reads (they are walked by position).
- The builder's stated ranks, by my own hash: bar0-city-wartime-rand-28 RING-2 > RING-4 > RING-1 > RING-3; guard-thorp-4 RING-2 > RING-3 > RING-4 >
  RING-1; r2r-town-7 heads RING-4, r2r-town-40 heads RING-1; r2s-plague_onset-village-3 RING-2 > RING-4; the five scope anchors head newcomer,
  newcomer, newcomer, traveller, local: all as its comments say.

## (4) (5) (6) THE RENDERED PAGES, C — CONFIRMED (`tools/h121.jsx`, `scripts/an-pages.mjs`, `scripts/q6-census.mjs`; `out/an-pages-C.txt`)
900 dossiers a tree, the real OutputContainer with every group, tab and disclosure walked: as its OWNER sees it, and as a FRESH SHARED PAGE (the
stamp the save path composes, `projectShareVeil(toPublicSafe(stamped))`, readOnly + playerView); on the tip also THE BASE's STAMP on the same record.
A difference is "explained" only if putting the site's tip line in place of its base line (from `an-sites.mjs`) makes the base's view equal the tip's.
- RECORDS: recordHash equal 900/900; the born record's JSON byte-equal 900/900.
- THE STAMP a save stores: differs base -> tip in 891 towns, and ONLY in the four blocks named: traditions 838, overview:identity 723,
  defense:criminal 76, power:governance 64 (version 'pp-1' on both; no other block differs).
- THE OWNER'S TABS: printed lines 1,120,886 on the base and 1,120,886 on the tip; views byte-equal 18,388 of 20,093; the views that differ are
  World/Traditions 842, Summary/Overview 723, Systems/Defense 76, Systems/Power 64 and NO OTHER. LINES THAT DIFFER OUTSIDE THE CONVERTED SITES: 0
  (towns with a difference the sites' own lines do not explain: 0 of 900). No lazily loaded panel is missing on either tree (the warm-up).
- A FRESH SHARED PAGE: 952,071 lines on both; the same four views differ (838, 723, 76, 64); unexplained 0.
- EACH SITE'S LINE ON THE TIP'S PAGES: the owner's Overview holds the scope line 900/900 and the fresh share the SAME line 900/900; the owner's Power tab
  the governance paragraph 900/900, the share the player's 900/900; the owner's Traditions tab each description 2,506/2,506, the share each reader's
  row 2,506/2,506; the owner's Defense tab the ring note 430/430, the share the same note 430/430.
- A PAGE STAMPED ON THE BASE, READ ON THE TIP (rendered): prints another line than the tip's fresh page in 891 of 900 towns (scope 723, traditions
  838, ring note 76, governance 64). EVERY difference is the base's stored line standing whole in place of the tip's (towns with any other
  difference: 0): no half sentence, no mixed block; and the base's line is one the place can print (the admitted sets are equal). e.g. dp-city-64:
  stale "Latin-inspired, built in masonry around a civic square, and run by patronage and law." beside the owner's "Latin-inspired; people here live
  in a place built in masonry …"; stale ring note "Ask who runs crime here …" beside the owner's "Shopkeepers here pay one ring …".
- WITHIN ONE PAGE: a line twice in one snapshot of a view: 42,679 on both trees; a sentence of six words or more in two lines of one view 1,613 and
  1,613, of them a converted site's sentence 0 and 0; in two views of one dossier 9,440 and 9,440, of them inside a site's paragraph 298 and 298 (the
  governance paragraph's vignette, also on the Overview: not a converted pick). A whole sentence under two rites: 0 and 0.
- THE TREE'S OWN PAGE CENSUS (`pageCensusFindings`, 28 patterns, the tip's checker over both trees' pages): towns GAINING a row on the tip 0, losing
  one 0; the table equal (P17 603, P18 419, P16three 348, P8any 60, P14 1, P5b 1).
- TIME (mean ms a town, 4 processes): owner walk base 3,194, tip 3,076; share walk 2,804 and 2,694; birth 353 and 345 (my own scans ran beside the
  base's run). No cost that can be seen in a page.

## (2)/(9) THE PARAGRAPH'S OTHER PICKS — CONFIRMED by plant G1 (`governanceAccount.js :: arrangementOf`, NOT converted: census row 25, LEAVE)
- A fourth wording added to `CONSEQUENCE.tense`: 59 towns of C move, 24 to the added wording and 35 NOT (re-dealt among the old three), the same on
  the tip and on the base. The seat's arrangements, the four estranged-power sentences, the consequences and the fracture line pick by
  `fnv(seed::slot) % n`: this is not in the claim's list of what was left on purpose; the census lists it as "a fixed list of orders … not a pool of wordings".

## (3) THE SAME PLANTS ON V — CONFIRMED (`out/plants/results-V.txt`; V's 900 records born once and read from JSON; the base's side run for ten plants)
Tip moved / should; extra [base moved, of them not printers]:
- T1 168 / 168; 0 [323, 157]   T2 108 / 108, all to the new line   T3 (needs `river`; V has rivers) 20 / 20, the 832 refusing draws: 0 moved
- T3b (needs `tier: ≥ town`) 57 / 57, the 420 refusing draws: 0 moved   T4 155 / 155   T5 reversed 0 / 0 [329]   T6 0 / 0   T7 44 / 44   T8 14 / 14
- THE TURN: T9 107 / 107, of 16 towns with a rotated draw the 3 that did not print the removed line: 0 moved; T10 174 / 174, the 11 such towns: 0 moved;
  T11 250 towns move, every one prints the new line (490 of 534 moved draws go to it; the rest are the cascade inside those towns).
- T12 (the declared frame line; V has coasts): 23 towns move, 8 of them to the new line and 15 THAT NEVER PRINT IT (28 of the 551 refusing draws move)
  [base 196]. The exception stands on V as on C.
- SCOPE (the same seeds as C): S1 180 / 180 [720, 539]; S2 160 / 160; S3 (a need nobody reads) 160; S4 194 / 194; S5 0 / 0 [755].
- CAST WANTS (40 calls): C1 0 / 0 [23, 23]; C2 13 / 13; C3 4 / 4; C4 the 40 refusing calls: 0 moved; C5 27 / 27; C6 0 / 0 [40].
- THE ECONOMICS HEAD (794 picks): H1 171 / 171 [662, 331]; H2 112 / 112; H3 187 / 187; H4 0 / 0 [794].
- THE RING: R1 51 / 51; R2 23 / 23; R3 (RING-2 removed) 28 / 28 [145, 109].
- G1 (the unconverted arrangement): 42 towns move, 14 to the added wording, 28 not.
SO, ON C AND V: of 32 plants a corpus (31 on the converted picks), every one moves exactly the towns my own reading says, except T12; the pool's order
reversed moves 0 towns at every site (base: 419 | 329, 755, 31 | 40, 876 | 794).

## (8) THE WALKERS AND REGISTERS — CONFIRMED (`scripts/walkers.sh`: each file ALONE by vitest, json reporter, exit code kept; `out/walkers-*/`)
ON THE TIP (/home/user/tip, 2ab62ef33; no tracked file changed by the runs):
- `tests/lint/presumedThings.walker.test.js` 43/43 green (every arm; exit 0; 140 s)      - `declaredLineShape.test.js` 3/3 green (exit 0)
- `drawDeclaredKeys.walker.test.js` 3/3 green (exit 0)                                    - `samenessHideable.walker.test.js` 31/31 green (exit 0)
- `domainAnyCastBaseline.test.js` 19/19 green (exit 0)                                    - `stablePickIds.walker.test.js` 25/25 green (exit 0)
- `node scripts/stable-pick-ids-door.mjs`: "the baseline matches the tree (144 scopes, 637 ids)", exit 0.
- REGISTER, BASELINE AND WALKER FILES CHANGED AGAINST THE BASE: none (`git diff --stat 360e716c2 2ab62ef33 -- tests/lint scripts` is empty).
THE BOUND RETURN: the walker's ARM 1 reading of the tip is the base's (5,359 hits, the same keys; `institutionServices.js` 131 on both: part 1 above).
WITH THE DIRECT RETURN RESTORED (/home/user/q8): the walker is RED, 2 of 43, both in ARM 1: "every source literal that names a thing declares it, or
  has its row: expected [ …(4) ] to deeply equal []" (the 4 new hits: siege 3, walls 1, all in `src/data/institutionServices.js`) and "no stale row:
  … expected [ …(15) ] to deeply equal []" (the 15 hits gone: 14 in `institutionServices.js`, 1 in `src/domain/prose/holderTable.js`). So a tidy-up
  that undoes the binding is SEEN (the walker reds); but nothing about those 19 literals changed: the walker's reading of two data files hangs on
  the shape of one `return` in the door. The door's comment ("moves 10 hits on institutionServices.js") gives the net of one file, not the 19 keys of two.

## (7) THE RE-POINTED TESTS — CONFIRMED (`scripts/mutants-spec.mjs`, `mutants.mjs` in my scratch worktree /home/user/mut; `mut/results.jsonl`, `mut/<id>.json`)
BY READING THE DIFF (16 test files: 11 re-pointed, 5 new). Cases (`it`) and `expect(` counts, base to tip, file by file: bar6CrimeOneReading 4/26 to 4/26;
crisisFactFindings.wants 2/6 to 2/6; ringNoteStreetsSmallPlace 2/4 to 2/4; fortuneLastingSentence 10/65 to 10/65; fortuneMeritSentence 10/47 to 10/47;
tailCrisisBatch2 4/2 to 4/2; tailDefeconDisplayLines 2/1 to 2/1; tonightOwnGoal 7/17 to 7/17; tonightWantRegister 5/8 to 5/8; traditionDescription 57/158
to 57/158; traditionDescriptionSharedPage 50/120 to 50/120; pickRendezvous 8/19 to 10/22; new: drawDeclaredRanked 8/15, pageFramesRanked 7/12,
tonightCastWantsRanked 3/6, traditionDescriptionIds 1/3. No case dropped; no skip, todo or only; every changed `expect` keeps its matcher kind and points
at the line the place now prints (two became LONGER: `/the Flood, 12 years ago/` to `/in memory of the Flood since then, 12 years ago/`). The five
scope-line anchors keep their seed and their forbidden clause; only "what prints in its place" carries the new frame's words. #B00162 is re-seated
(r2r-town-7 to r2r-town-40), as the builder says.
BASELINE. The tip, unmutated: 0 red of 249 (19 files: the 16 changed test files, `tests/pdf/headlines.test.js`, and the walkers
`traditionDescriptionFrames` and `declaredLineShape`). No mutant's red is a file that failed to load (suite errors 0 of 54): each is an assertion.
THE BASE'S OWN TEST FILES ON THE TIP'S SOURCE (ten re-pointed files; tailDefecon aside, the merge mixed it): 14 red of 151: exactly the rows of the
builder's table (the five scope anchors by seed: r2s-plague_onset-hamlet-1, r2s-under_siege-metropolis-0, r2r-thorp-24, r2r-thorp-54,
r2s-mass_migration-hamlet-1). ONE row of the table is NOT red there: `crisisFactFindings.wants`'s struck tic: on rows `{ id, text }` the base's
`Object.values(CAST_WANTS).flat().join(' ')` reads "[object Object] …" and can no longer fail: the re-pointing (`.map((w) => w.text)`) is what keeps
it alive (my mutant T5 reds it).
A MUTANT FOR EVERY ROW (54 mutants of mine, one edit each, each run on the files that could see it; ALL 54 red at least one row). The 20 rows of
`repointed.tsv`, and the mutants of mine that red each:
  1 fortuneMeritSentence U5b (a)                      F1 (idOf by text: 1 of 6), F3 (key order: 3 of 6), F5 (first row: 3 of 6)
  2 fortuneLastingSentence U7b (a); (b) three rows    (a) F2 4/4, F4 3/4, F6 2/4; (b) fixed line after the first merit: F1 F3 F5; (b) "It" opening: F2 F4 F6;
                                                      (b) first merit's sentence not printed: F2 F4
  3 THE LEAF'S PICK IS THE RENDEZVOUS PICK            D1 (rankKey altered: 15 draws), D5 (door walks the rank from the bottom: 24)
  4 a rite … says only what is done: one sentence     D2 (id GLOSS.long-sun.3x), D5, D6 (a power sentence for every rite), K1 (lowest hash)
  5 the dead take the MOST RECENT …                   D3 (id CAUSE.dead.3x), D4 (the OLDEST event), D5, K1, C3
  6 CONTROL: "The Granary Fire" … STILL recalled      C1 C2 C3 C5 C6 and D4 (below)
  7 tonightOwnGoal: an empty seat never "gives way"   T1 (HELD_SEAT less instigator.3), T2 (less instigator.1), T3 (the seat never read)
  8 tonightWantRegister: every line voiceable         T4 (defender.2 lengthened)
  9 crisisFactFindings.wants: no "rather than"        T5 (exploiter.1 says it)
 10 ringNote: thorp and hamlet print the next in rank R2 (only the head asked), R5 (RING-2 loses its tier), and H2 (a fifth vantage appended)
 11 ringNote: village, town, city keep it             R4 (RING-2 never), R6 (tier ≥ town), R9 (key altered)
 12 bar6 (c) the positive controls (w28)              R1 (RING-2 loses `excludes crime wave`), R2, R9
 13 tailDefecon #B11428 r2s-plague_onset-village-3    R3 (the streets skip dropped: LIVENESS ANCHOR)
 14 tailDefecon #B00162 r2r-town-40                   R7 (id RING-1x), R8 (ringWithoutSeat ignores the seat), R9
 15 tailCrisisBatch2: no FALSE clause (5 anchors)     S1 (key altered: 2 of 33), S9 (always the first frame: 5 of 33, the five anchors)
 16-18 anchors hamlet-1, thorp-24, migration-hamlet-1 S2 (newcomer frame re-worded: the three seeds), and each seed's own clause let through: S5, S6, S8
 19 anchor r2s-under_siege-metropolis-0               S3 (traveller frame re-worded), S5 (estates clause let through)
 20 anchor r2r-thorp-54                               S4 (local frame re-worded), S7 (an elder's rule never read)
ROWS THAT DO NOT RED: none.
THE NEW TESTS, the same way: the kernel (K1 lowest hash: 4 rows of pickRendezvous.test.js; K2 a tie to the larger id: the tie row, on a real tie
C139599/C322382; K3 the tail unsorted: 3 rows; K4 a falsy key ranked: 2 rows), the door (N1 the twin never asked, N2 `taken` ignored, N3 no throw on a
line with no id: one row each of drawDeclaredRanked), the heads (N4 N5 N6: one row each of pageFramesRanked), the cast wants (T6: the first admitted
in pool order: tonightCastWantsRanked).
WHAT THE SITE TESTS TAKE ON TRUST (by K1): with the kernel's rank inverted the fortune files (20 cases), pageFramesRanked (7), tonightCastWantsRanked (3),
drawDeclaredRanked (8) and "THE LEAF'S PICK" stay GREEN: their expectation is the kernel's own pick over the key. What the kernel's pick IS stands
in `tests/kernel/pickRendezvous.test.js` (4 rows red) and in the rows pinned to printed words (2 red in traditionDescription.test.js). A layering,
not a hole: said so the next reader does not take the site rows for a pin of the hash.

THE CONTROL, ON ITS MERITS (`tests/security/traditionDescriptionSharedPage.test.js`, TRAD-4 UNIT 7 (1); my probe `tools/hC.jsx` runs the test's own
SPECS, plant and helpers on each tree: `out/control-{base,tip}/control.json`).
- The change: `RECALL` was the string 'in memory of the great fire, 2 years ago'; it is now `/in memory of the great fire(?: since then)?, 2 years ago/`.
  The pool is CAUSE.dead: .1 'It is kept in memory of {event}, {when}.', .2 '{Town} keeps it in memory of {event}, {when}.', .3 'It has been kept in
  memory of {event} since then, {when}.' The string matched .1 and .2 only; the pattern matches the three and nothing else of the table.
- Of the five born towns TWO are controls (three hold a "granary": Grünwiese, Chrissotopia, Terranovum, on both trees; the test asks `> 1`).
  BASE: Khanqila draws CAUSE.dead.2, Farovetum CAUSE.dead.2: the string matched both. TIP: Khanqila draws CAUSE.dead.3 ("A day of small offerings that
  honours the dead. It is kept by the monasteries. It has been kept in memory of the great fire since then, 2 years ago."), Farovetum CAUSE.dead.1
  ("… It is kept in memory of the great fire, 2 years ago."). So the string, left alone, reds the CONTROL at Khanqila on the tip (seen: the base's
  file on the tip's source, "Khanqila: expected false to be true").
- The same `recalls` is the NEGATIVE of the arm beside it ("THE PLANTS … recall no fire of two years ago", 20 plants): there the pattern is the
  STRICTER reading. On both trees the 20 plants recall nothing under either matcher, and their descriptions and rows are byte-equal with the event
  withheld (20/20, 20/20).
- It can still fail: the CONTROL reds under C1 (`holdsAName` answers true), C2 (the reader names the event by its name), C3 (the year one off),
  C5 (the reader given no event), C6 (the kind's phrase re-worded), D4 (the oldest event taken); under C4 (`holdsAName` answers false) the CONTROL
  stays green and THE PLANTS red with 60 entries (20 plants x descriptions, rows, recalled).
- MY JUDGMENT: not a loosening. What the control asserts (the reader is still told the event, by its kind and its year, where no held name shares a
  word with it) is what it asserted; the frame around it was never the subject. The other honest cure (another seed) would leave the negative arm
  blind to the third frame on Khanqila's four plants. One thing the builder does not say: the control stands on exactly two towns, the floor of its own
  `> 1` (unchanged by this change).

## (5) A BASE-STAMPED PAGE READ ON THE TIP: IS ANYTHING WORSE THAN ANOTHER TRUE LINE? — CONFIRMED on C (`scripts/q5-foreign-mixed.mjs`; the tip's own render of the base's stamp on the same record, 900 towns)
- 891 of 900 pages print a stored line where the tip's fresh page prints its own: 3,315 lines displaced, 3,315 stored in their place, in four views
  (World/Traditions 838, Summary/Overview 723, Systems/Defense 76, Systems/Power 64): the four blocks of the stamp, nothing else.
- Each stored line is one the base printed for that town through the same door (admission equal on every draw, (2) above): a line true of the town.
- ONE PAGE, TWO WORDINGS? A displaced line still printed in another view of the base-stamped page: 0 of 900. A displaced sentence of six words or
  more (one the stored line does not hold) printed in another view: 0. A stored line's own sentence printed in two views: 0. The traditions block is
  stored whole (the base's own rotation), so no rite's stored sentence meets a live one.
- So the owner's page (derived at render) and that owner's page shared before the change differ in 891 | 894 towns (V by its stamps; V's shared
  pages were not rendered) until the owner saves again; nothing printed is false, repeated or self-contradicting.

## (4) (5) (6) THE RENDERED PAGES, V — CONFIRMED, the owner's tabs (`out/an-pages-V.txt`, `out/q6-census-V.txt`; V's shared pages were NOT walked: V's stamps and the sites' own functions stand for them, (5) part 1)
- RECORDS MOVED: 0 of 900 (recordHash equal 900/900; the born record's JSON byte-equal 900/900).
- THE STAMP differs in 894 of 900 towns, only in the four blocks: traditions 848, overview:identity 723, defense:criminal 95, power:governance 63.
- THE OWNER'S TABS: 1,092,108 printed lines on each tree; views byte-equal 18,354 of 20,087; towns with a view that differs 894; the views that differ:
  World/Traditions 852, Summary/Overview 723, Systems/Defense 95, Systems/Power 63, and no other. TOWNS WITH A DIFFERENCE THE SITES' OWN LINES DO NOT
  EXPLAIN: 0 (each site's base line replaced by its tip line in the base's page gives the tip's page, line for line).
- The tip's tabs hold each site's line: scope 900/900, governance paragraph 900/900, descriptions 2,541/2,541, ring note 450/450.
- WITHIN ONE PAGE: a line twice in one snapshot 40,410 on both trees; a sentence of six words or more in two lines of one view 1,572 and 1,572 (a
  converted site's: 0, 0); in two views of one dossier 9,820 and 9,820 (a converted paragraph's: 359 and 359, the tension sentence the Overview and
  Power both print, not a converted pick); a whole sentence under two rites 0, 0. THE PAGE CENSUS (28 patterns): towns gaining a row on the tip 0,
  losing one 0 (rows: P17 486, P18 416, P16three 237, P8any 134, NEW2 6, P19 2, P14 1, equal on both trees).
- Time: the owner's walk 2,907 ms a town on the base, 2,880 on the tip (the same 4-process load).
- THE OLD MATCHER ON THE TIP, executed (`mut/mutants-c7.json`, `mut/results-c7.jsonl`): the string in place of the pattern: 1 red of 50, the CONTROL
  at Khanqila. With every plant made to leak (C4's `holdsAName` answers false) and read through the string: THE PLANTS red with 52 entries, not 60:
  the string does not see 8 of the 20 "recalled" leaks (the four plants each of Khanqila and Terranovum, whose rite draws CAUSE.dead.3 on the tip);
  the pattern sees 20 of 20. So on its negative arm the change is a TIGHTENING.

## (3)/(7) THE ID TEST AGAINST THE BAR: A REMOVAL RE-NUMBERED — CONFIRMED by plant T13 on C and V (`out/plants/results-*.txt`; the tip alone, the base has no ids)
`tests/domain/traditionDescriptionIds.test.js` asks of every pool `lines.map((l) => l.id)` toEqual `<TAG>.<pool>.1 … n` in source order: DENSE ids.
- T1 (above): GLOSS.founding.2 ("honours the founding") removed, the other ids as they were: 213 | 168 towns move, exactly its printers.
- T13: the SAME removal with the line after it re-numbered into the gap (GLOSS.founding.3 "remembers the founding days" becomes GLOSS.founding.2),
  which is what the test asks for: 309 | 244 towns move: the 213 | 168 printers and 96 | 76 towns that NEVER printed the removed line
  (dp-thorp-36, dp-thorp-68: "remembers the founding days" becomes "marks the founding"). No other site moves; errors 0.
- So the one new test that reads the ids pushes an author removing a line (any but a pool's last) to the edit that breaks the bar, and reds the
  edit that keeps it (the id retired: H1b above, "[GLOSS.founding.1, GLOSS.founding.3] to deeply equal [GLOSS.founding.1, GLOSS.founding.2]"). Its
  own header says the ids are there "so a later edit to a pool moves only the places that printed, or now out-rank to, that line". Unique ids of the
  stated form would hold that; density does not. (Which edits it greens and reds, executed: below.)

## (3) THE EXCEPTION'S GUARD, POOL BY POOL — CONFIRMED (`mut/mutants-j.json`, `mut/results-j.jsonl`: my scratch worktree, nine tradition test files, 182 cases; the unmutated tip 0 red)
T12's shape (one DECLARED line, `needs: ['coast']`, appended to a frame pool the rotation walks; the two 143 pins moved to 144 as an author would):
  J1 HOUSE_FRAMES.placePower   2 red: "ONE TOWN, NO SENTENCE TWICE": the keeper slot that runs out ("expected 2 to be 3"); THE EIGHT TOWNS
  J2 HOUSE_FRAMES.body         1 red: THE EIGHT TOWNS (5 sentences twice)
  J3 POWER_FRAMES.seat         4 red: THE EIGHT TOWNS (10); the shared page's UNIT 10 rows (Suryatala; Ringthwaite and Bergbrekka)
  J4 ECONOMY_FRAMES.chief      3 red: THE PAYER RUNS OUT; the keeper slot; THE EIGHT TOWNS (4)
  J5 CAUSE_FRAMES.dead         0 red of 182: NO TEST HOLDS IT.
So the exception is held where a born town of the tests happens to exhaust that pool, by rows written for another purpose; no row and no walker
states "a pool the rotation walks holds colour lines only" (`traditionDescription.js :: drawTurn`'s `all.every(isColourLine)`). Not probed: the other
seven frame pools (HOUSE bodyPerson, place, placePerson; POWER religious, merchantry; ECONOMY lesser, only), the founding causes, OWNER_FRAMES.
- AT THE POOL NO TEST HOLDS, on the corpora (plant T14: `line({ id: 'CAUSE.dead.4', …, needs: ['coast'] })` appended to CAUSE_FRAMES.dead):
  C: all 173 draws refuse the line, and 4 towns move (should 0): the 10 rotated draws; each of the 4 then prints a whole sentence under two rites
  (unplanted 0): dp-metropolis-99 "Morkholm keeps it in memory of the Siege, 120 years ago." under rites 4 and 5; dp-metropolis-4 "Stormbø keeps it
  in memory of the Siege, 68 years ago." under rites 3 and 6; dp-city-7 "Temürbulag keeps it in memory of the Siege, 57 years ago." under 2 and 4.
  V: 5 towns move, 4 of them to the new line (they have a coast), 1 that refuses it (dp-city-58). The base under the same plant: 54 | 58 towns.
  THIS CORRECTS MY EARLY NOTE TO THE CHAIR ("held by a test"): held at four of the five pools I probed, not at this one.

## (7) WHAT THE NEW ID TEST GREENS AND REDS — CONFIRMED (`mut/mutants-m.json`, `mut/results-m.jsonl`; five files, 147 cases; pool GLOSS.founding)
  M1 line 2 removed, line 3 RE-NUMBERED to 2 (pins 142)      the id test GREEN; 2 red, both the walker's FLOORS ("gloss.founding: 2 < 3", a law of the base)
  M2 line 2 removed, its id RETIRED (ids 1, 3; pins 142)     3 red: the floors and the id test
  M3 line 2 REPLACED, id retired (ids 1, 3, 4; three lines)  1 red: the id test alone
  M4 line 2 REPLACED, ids dense (1, 2 = the old 3, 3 = new)  0 red of 147
  M5 the three rows written in another order, ids kept        1 red: the id test alone (plant T5: a re-ordering moves no town)
A gloss pool sits on its floor of three, so an honest removal there is a REPLACEMENT: M3 against M4. The corpus numbers of the two: below (T15, T16).
- THE TWO REPLACEMENTS ON THE CORPORA (plants T15, T16; the door's line == my own rank over the planted ids on every draw: 1,282/1,282 | 1,006/1,006):
  T15, the id RETIRED (ids 1, 3, 4; the id test RED): 300 | 239 towns move: the 213 | 168 that printed the removed line and 87 | 71 the new line
  out-ranks; a town moved for neither cause: 0 | 0.
  T16, ids DENSE (0 red of 147): 420 | 338 towns move: the 213 | 168 and 207 | 170 that never printed the removed line, of them 169 | 137 that the new
  line does NOT out-rank under the ids as they were: moved by the re-numbering alone (dp-thorp-4: "remembers the founding days" becomes "recalls the
  founding").

## (9) WHAT THE CONVERSION COSTS — CONFIRMED (`tools/hT.jsx`, built without trace wraps; each site's own function over C's 900 saved records; two passes a tree, three rounds a pass, medians of six; ms a town)
  governanceAccountOf            base 0.059   tip 0.061
  describeTraditions (owner)     base 0.098   tip 0.114     (the one site whose cost moves: +0.016 ms a town)
  sharedTraditionRowsOf          base 0.762   tip 0.782
  composeTonightSheet            base 3.134   tip 3.067
  deriveCriminalStructure        base 0.077   tip 0.073
  cultureScopeLine               base 0.177   tip 0.143
  the three PDF heads            base 0.0072  tip 0.0086
  composePublicProse (the stamp) base 76.7    tip 77.1      (ranges 73.6 to 77.1 and 73.2 to 80.0: inside the noise)
  THE HELPERS ALONE (microseconds a call, 200,000 calls): `pickRendezvous` over 3 lines 0.79 on the base, 0.70 on the tip (10 lines 2.1, 30 lines
  5.9); the index pick it replaces (`pickVariantMixed`) 0.35 and 0.33 at any size; `rankRendezvous` (new) 3 lines 1.1, 10 lines 2.8, 30 lines 8.5.
  THE RENDERED PAGE: the owner's walk 3,194 ms a town on the base and 3,076 on the tip (C); 2,907 and 2,880 (V); a birth 353 and 345 (C).
  So: a converted pick costs about twice the index pick it replaces, a third of a microsecond more; no page, stamp or birth is measurably slower.

## BEFORE REPORTING (2026-11-27)
- The judged branch re-fetched at 22:24 UTC and again just before the report was sent: `lane/stack-121-tail-wip-2026-11-27` is at 2ab62ef33, the
  commit I judged: nothing new to read.
- The chair's record branch moved after I cut mine (e5c601208 to f34d87106 at 22:24 UTC): NOT read (I was not to know the chair's view). A branch
  `lane/stack-121-guard-wip-2026-11-27` exists (cccda7569): NOT read, not mine to judge.
- One early note went to the chair (the T12 exception, "held by a test"); the report corrects it (held at four of five pools probed).
- Pushed here: these notes and SECOND-READER-121.txt, nothing else. No file of the judged branch was changed; every plant and mutant lived in memory
  (bundles) or in my scratch worktree, which is clean (`git status` of /home/user/mut after the last run: clean).

## NOT CHECKED (plainly)
- The whole suite (not mine to run): I ran the 16 changed test files, the six walkers of question (8), the tradition and PDF-head files beside them.
- A real browser, and the PDF's bytes: pages were rendered by the tree's own components under jsdom; PDF chapters were walked as element trees.
- A hosted share (the server's path): a fresh share was composed as the save path composes it and rendered by the tree's own shared-page component.
- V's shared pages (V: the owner's tabs, the stamps and the sites' own functions); the DM share on 60 towns of C only.
- The exception's guard at seven of the twelve frame pools, the founding causes and OWNER_FRAMES (five pools probed).
- Corpora: C and V, 900 towns each, fresh births; no town with history played forward, no lit mirror but the one I lit for the PDF's chapter, no custom content.
- The guard branch; the chair's entries after e5c601208; the committed edge bundles beyond a search for the sites' keys (they predate the change).
