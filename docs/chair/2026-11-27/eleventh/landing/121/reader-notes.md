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
NO TOWN MOVED THAT SHOULD NOT in 30 of the 31 plants; the one that does is T12.

## Housekeeping
- My first push of the notes (019bf004a, 20:55 UTC) went out WITHOUT the pre-push hook: the report worktree, cut fresh from the chair's tip, had no
  `.husky/_` (the shims `npm ci` writes only in the main checkout), so git found no hook. Not `--no-verify`. Cured (`npx husky` in that worktree);
  every later commit and push runs the hooks.

## (3)/(7) T12's GUARD, AND THE NEW ID TEST UNDER HONEST WORK — CONFIRMED (`scripts/mutants.mjs` in my scratch worktree /home/user/mut, `mut/results-h3.jsonl`)
- H3 (the declared frame line of T12, tests untouched): RED on the two COUNT pins (`traditionDescriptionFrames.walker` "THE COUNT … expected 144 to
  be 143"; `traditionDescriptionIds` "143 ids") and on 2 rows of `tests/domain/traditionDescription.test.js` "ONE TOWN, NO SENTENCE TWICE".
- H3b (the same, the two pins moved to 144 as an author would): STILL RED on those 2 rows ("A KEEPER SLOT THAT R…: expected 2 to be 3"; "THE EIGHT
  TOWNS …: expected [ …(2) ] to deeply equal []"). So T12's edit cannot land unseen while those rows stand. No walker states the rule itself ("a frame
  table holds colour lines only"): `traditionDescriptionFrames.walker` asks only that a colour line declare nothing else.
- H1b AN HONEST REMOVAL (GLOSS.founding.2 removed, ITS ID RETIRED so the pool reads .1 and .3; the two pins moved to 142): RED in
  `tests/domain/traditionDescriptionIds.test.js :: each pool's lines are <TABLE>.<pool>.1 … n in order`: "ELEMENT_GLOSS.founding: expected
  [ 'GLOSS.founding.1', 'GLOSS.founding.3' ] to deeply equal [ 'GLOSS.founding.1', 'GLOSS.founding.2' ]". THE NEW TEST DEMANDS IDS DENSE 1..n IN ORDER:
  the only way to green it after a removal is to RENUMBER the survivors, which the table's own header forbids ("never renumbered or reused (a removed
  line's id is retired)") and which re-deals every town that printed a renumbered line. (Also red there, on its own law: the walker's FLOORS,
  "gloss.founding: 2 < 3": every gloss pool is AT its floor of three, so no gloss line can be removed without adding one.)
- H2b an honest append (GLOSS.founding.4 'keeps the founding day', pins to 144): the ids test and the count GREEN; RED only on the walker's style law
  ("no first sentence says 'kept' twice": my words, not the ids).
