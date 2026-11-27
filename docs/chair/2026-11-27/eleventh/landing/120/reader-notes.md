# READER 120R — running notes (independent reader of point 120, rebuilt)

Session container: own cloud checkout. Scratch: `<scratchpad>/reader120` (outside the repository).
All numbers below are from my own scripts (`scripts/` in the scratch) unless a line says otherwise.

## 0. Setup (2026-11-27)
- `git fetch --unshallow origin`; `review-fixes-2026-07-08` fetched as a local ref.
- Chair's record: `lane/chair-2026-11-08` at 87e8a9009 (worktree `/home/user/chair`, read-only; my push branch
  `lane/reader-120r-2026-11-27` is cut from that tip in the main checkout).
- Base: 1f946c43f1 (`/home/user/base`, detached).
- Judged: `lane/stack-120-d13-wip-2026-11-27` at df0401af6 (3 commits: be58ebed1 helper, cf9ce97ca Daily Life, df0401af6 viability)
  and `lane/stack-120-guard-wip-2026-11-27` at 30539f145 (2 commits: edad442d6 guard, 30539f145 its reader arm).
  Merged locally (fast-forward, detached) in `/home/user/reader120` = 30539f145.
- NOTE at start: the d13 branch holds NO re-pointed test yet (only its new `tests/kernel/pickRendezvous.test.js`); question (8) waits.
- Also on origin, not in my brief: `lane/stack-120-owed-wip-2026-11-27` (c1dd12135). Not read.
- `npm ci` in the main checkout (exit 0), `node_modules` linked into base and reader120.
- Read whole: the two assignment files; RULING-G G62, G63, G76, G79, G80, G81; START-D13-120R.txt; START-GUARD-120R.txt;
  the diff 1f946c43f1..30539f145 (all of it); close-8 birth-1 tools; close-10 D13 tools; CLOSE-10-HANDBACK 0.3, 0.4.
- NOT read (not named for me): SECOND-READER-120-A/B.txt (the first build's reader reports).

## What the diff is (by reading; each claim below is then executed)
- `src/kernel/proseHash.js :: pickRendezvous(lines, slotKey, idOf)`: argmax of `mix32(fnv1a32(slotKey + '::' + id))`; tie -> smaller id (string);
  empty / non-array -> undefined; falsy key -> lines[0].
- `src/domain/dailyLife.js :: pickNameable` (10 call sites) + 2 outsider second picks (ids = branch names). Key strings unchanged.
- `src/domain/display/dossierViewModel.js :: deriveViability`: 22 rows as pairs, 8 pools, 7 picks; `pickTrue` now the rendezvous among true rows.
- 8 pool headers (comments). 1 new unit test file.
- Guard: tests/lint/stablePickIds.{shared.mjs,walker.test.js,baseline.json}, scripts/stable-pick-ids-door.mjs, 1 manifest row.

## Corpora (re-born by me, plain node, `scripts/birth.mjs`, as births.census.jsx births them)
- C = close-8 `make-plan.mjs` (900: dp-<size>-<i>, { settType }); V = `make-visitor-plan.mjs` over tenth/read/plan-lit.json (same 900 seeds, visitor config).
- Born on BASE 1f946c43f and on TIP 30539f145: `out/{C,V}-{base,tip}/rec/*.json`.
- (5) RECORDS MOVED base->tip: C 0 of 900, V 0 of 900 (sha256 of JSON.stringify(record); the 1,800 record files byte-identical). CONFIRMED.

## (1) THE HELPER — CONFIRMED by execution (`scripts/q1-helper.mjs`, `q1-tie.mjs`, `q1-spread.mjs`, `q1-corr.mjs`; outputs `out/q1-*.txt`)
- Agrees with my own reference (FNV-1a 32 and murmur3 fmix32 written from their definitions, argmax, tie to smaller id): 20,000 / 20,000 random pools
  (incl. non-ASCII names); deterministic 20,000/20,000; order-independent (shuffled, reversed) 20,000/20,000.
- Removing a non-pick keeps the pick 20,000/20,000; removing the pick gives the next highest 20,000/20,000; an added line wins or changes nothing
  20,000/20,000 (won 3,215; 1/(n+1) predicts 3,206).
- TIE RULE: three true 32-bit collisions of my own on the key `Xiaxian::dailyLife.gathering_places::plain` (e.g. ids pbbrxnlkc / vbggybpbq, both
  1849272854): the smaller id by string returned in either order, 3/3. The builder's collision ('tie': C139599 / C322382 = 1221666182) is real.
- EMPTY list / non-array (null, a string, an array-like object) -> undefined.
- FALSY KEY ('' null undefined 0 NaN false) -> lines[0], i.e. ORDER-DEPENDENT (reverse the list and the other end prints). As the old pick; reached by a
  record with no name (Daily Life) or with `_seed`, `id` and `name` all empty (viability). The string '0' is truthy; a number key is read as its string.
- DUPLICATE ID: the two lines share one hash; the FIRST in list order is returned whenever that id wins (659/659 of 2,000 keys), so the second is never
  printed and swapping them swaps the printed line: order-dependent, and the id gets ONE share between two lines.
- MISSING ID: `String(undefined)`: every id-less line hashes as the string 'undefined'; first in list order returned (704/704); a line whose id is the
  string 'undefined' ties with them. `idOf` throwing propagates.
- SPREAD over C (tip): 10,599 picks; 442 lines admitted somewhere; 246 admitted in >= 50 towns: drawn by none 0; drawn over 3x share 0.
  z of (drawn - share) over the 245 with a contest: mean 0.008, sd 1.074, max |z| 2.91 (a fair pick gives sd 1). Lowest: dawn_work|defence|W2 1 of a
  share of 6.6 (72 towns admit). On V: 312 lines >= 50 towns: none starved, none over 3x; sd 1.016, max |z| 2.93.
  (Base's modulus pick on the same corpora: sd 1.015 / 1.024: the spread is as good as it was.)
- CORRELATION of pools on one key: the 8 viability pools share `<_seed>|viability`: 28 pool pairs, 200,000 synthetic keys: worst chi2 5.7 on 1 df
  (NV x IU), two-line pools pick the same position on 50.0% of keys. On the BASE (pickVariant, one index a key) the two-line pools agreed on 100.0%.
  Daily Life across two slots of one town with 13 ids in common (gathering_places|plain, child_warnings|monster_pressure), 200,000 names: same id
  9,256 times (9,286 if independent); chi2 251.4 on 247 df. NOTE (by construction, not found in the product): ONE key over two pools that share ids
  agrees always (50,000/50,000): the rendezvous ranks ids, so a future pool that re-uses a key AND ids would be locked to its twin.
- NOTE: C and V are the same 900 seeds, so only 900 distinct viability keys exist over both. C holds 856 names over 900 towns (43 names borne by 87
  towns): towns of one name share every Daily Life key (so on the base; RENAME-REDEALS, G76, not this point).

## (2) EACH FAMILY — CONFIRMED (`scripts/measure.mjs` with a loader hook recording every pick; `analyse-q2.mjs`; `out/q2-{C,V}.txt`)
- Picks made while deriving Daily Life (owner's audience) and the viability verdict, by function:
  BASE C: pickVariantMixed 9,948 (Daily Life), pickVariant 781 (viability). TIP C: pickRendezvous 9,944 + 781; pickVariant/pickVariantMixed 0.
  BASE V: 10,188 + 756. TIP V: pickRendezvous 10,186 + 756; index draws 0.
- KEYS: every Daily Life key called on both trees is the same string (C 9,672; V 9,770); the viability key equal on 781 / 756 calls.
- ADMITTED SETS: Daily Life: equal (and in the same order) on C 9,672 of 9,672 keys and V 9,770 of 9,770; the second pick's option set and each
  option's admitted line ids equal on 900/900 and 900/900. Keys called on one tree only: C 257+257, V 369+369, EVERY one an
  `outsider_impressions::<branch>` chosen by that town's second pick on that tree (514/514, 738/738 explained; 0 unexplained).
  Viability: verdict equal 900/900 and 900/900; candidate sentences identical on C 767 calls + 14 where the tip hands pickRendezvous the true rows only
  (DC without DC3); V 656 + 100. (pickTrue's truth array is the same expression on both trees; checked by execution below.)
- Lines that move base->tip: C Daily Life 5,854 slot texts (6.50 a town; every one of 900 towns), viability 464 of 900.
  V Daily Life 6,098 (6.78 a town), viability 469 of 900.
  By slot C: food_culture 770, dawn_work 790, gathering_places 856, child_warnings 851, commoner_resentments 280, outsider_impressions 898,
  unspoken_topics 580, recent_changes 776, commoner_resentments_dm (owner only) 53.
- WORDS: Daily Life pools: 9 files, 19 exports, deep-equal by value base vs tip (0 differ); 615 lines with an id and a text. The 8 changed pool files
  change comment lines only (0 non-comment lines in the diff). Viability: read with acorn: 24 sentence templates inside deriveViability on both
  trees, the SAME LIST IN THE SAME SOURCE ORDER (22 now rows with ids NV1-2 IC1-2 IU1-2 DC1-4 DL1-2 DG1-3 DN1-2 SS1-5; the 2 others are the
  self-sufficient twins, unpicked); the four wrappers ("✗ NOT VIABLE: ", "VIABLE BUT STRAINED: ", "VIABLE WITH CRITICAL DEPENDENCIES: ", "VIABLE: ")
  equal; the 24 other string literals equal as a multiset.
- pickTrue / pickAdmitted truth arrays and twins equal by source (acorn); `outlookFactsOf(record)` (exported for the measure by a loader hook) equal
  on 900/900 C and 900/900 V records. So the viability admitted sets are what they were.
- `git diff 1f946c43f1 30539f145 -- src/domain/display/stateProse/`: EMPTY (0 bytes). Files under src changed: the 8 pool headers, dailyLife.js,
  dossierViewModel.js, proseHash.js: 11 files, no other.
- No `pickVariant`, `pickVariantMixed`, `% …length` or Math.random left in dailyLife.js or dossierViewModel.js (grep: none).
- NOTE (design, as on the base): the self-sufficient verdict printed the unpicked TWIN on C 119 of 445 and on V 144 of 334 towns (no row true);
  on C every picking self-sufficient town admits exactly SS1, SS4, SS5 (326); SS2 and SS3 are admitted by no town of C (V: 16 and 26).

## (4) THE BAR, BY MY OWN PLANTED EDITS ON C — CONFIRMED (`scripts/q4-make-plants*.mjs`, `q4-run.sh`, `q4-compare.mjs`; `out/q4-bar.txt`, `q4-bar2.txt`)
Each plant is applied IN MEMORY by a loader hook to one source file of the tree read (no tree touched); a town "moves" when any of its 9 Daily Life
slot texts or its viability summary differs from the unplanted run; "should move" is worked out from the unplanted picks and my own reference hash.
Tip (moved / should; extra; missing) [base moved, of which not the edited line's drawers]:
- Daily Life, `dawn_work|default` (drawn in 358 towns of C):
  a line no town drew, removed (B22, admitted by 15):        0 / 0   [15, 14]
  a drawn line removed (B17):                               36 / 36; 0; 0   [316, 290]
  a line added (B28, no needs):                             25 / 25 (my reference's 25), all 25 to the new line   [327: 23 to the new line, 304 re-dealt]
  a line re-worded in place (B12):                          35 / 35; 0; 0   [35, 0]
  a line's admission narrowed (B6 + `institution: smith`):  11 / 11; 0; 0   [66, 60]   (B6 + `walls` refuses nobody: every gated town of C is walled)
  the pool's lines written in reverse order:                 0 / 0   [333]
- Daily Life, the outsider SECOND pick (ids are branch names):
  every line of `services.administrative` given the need `walls` (the option vanishes in 170 towns): 70 / 70; 0; 0   [92, 24]
  one line of that option removed (A2):                     33 / 33; 0; 0   [192, 149]
- Viability, the SS pool (326 towns pick among SS1, SS4, SS5):
  a row no town admits, removed (SS2):                       0 / 0   [0]
  a drawn row removed (SS4):                               124 / 124; 0; 0   [210, 104]
  a row added (SS6, SS1's truth):                           87 / 87 (my reference's 87), all to the new row   [261: 88 to the new row, 173 re-dealt]
  a row re-worded in place (SS5):                          106 / 106; 0; 0   [98, 0]
  a row's truth narrowed (SS1 && keepsOrder):               26 / 26; 0; 0   [51, 20]
  SS4 and SS5 written in the other order:                    0 / 0   [204]
- Viability, other pools: DC2 removed (pickTrue, 34 towns): 10 / 10 [25, 17]; DG2 removed (219 towns): 80 / 80 [149, 74]; DG4 added: 64 / 64 [176: 51 new, 125 re-dealt].
- In every tip run every pick equals my reference's argmax over the planted candidates (10,599 / 10,599; 10,604 / 10,604 in the option plant).
- NO TOWN MOVED THAT SHOULD NOT, in 18 plants. Slots moved: only the planted slot (dawn_work, outsider_impressions, or the viability line).

## (6) EVERY SURFACE — CONFIRMED on the tip over all 900 C towns (`scripts/bundle.mjs` (esbuild, one bundle a tree), `q6-surfaces.mjs`, `q6-analyse.mjs`, `q6-stale.mjs`; `out/q6-*.txt`)
Surfaces found by reading every caller of `deriveDailyLife`, `deriveDailyLifeSlot`, `deriveViability`, `viabilityVerdictRead`:
- Daily Life: `components/new/tabs/DailyLifeTab.jsx` (owner tab; player view; the shared page hands it the SHARED record and it derives again);
  `pdf/sections/IdentityDailyLife.jsx :: dailyLifeLinesOf` (deriveDailyLifeSlot a slot); `domain/aiGrounding.js` (`dailyLife: deriveDailyLife(s)`);
  `causalViews.js`, `counterfactual.js`, `regenerationDelta.js` (the same derivation, compared before/after). Foundry prints NO Daily Life slot.
- Viability: `ViabilityTab.jsx` via `viabilityDeskRead.js :: viabilityVerdictRead` (owner and player: the derivation; SHARED: the summary STORED at
  the owner's save in `publicProse.blocks['viewModel:viability']`, composed by `publicProseCompose.js`); `pdf/lib/viewModel.js` (the PDF chapter
  `ViabilityAssessment.jsx`); `foundry/journalPages.js :: viabilityPage` (the same view model). The AI grounding carries no viability sentence.
- No surface holds a pick of its own for these lines. `domain/summary/settlementQuickGuide.js` holds a `pickVariant` of its own (the culture scope
  line: the tail, G76 (D)), not these lines. `SummaryTab.jsx` is mounted nowhere (`dossierLazyTabs.js`). The Overview prints Viable / Not Viable only.
Executed (rendered with react-dom/server from one esbuild bundle of the tip; 900 towns):
- owner's Daily Life tab prints the 8 public slots in page order 900/900, the owner-only line 64/64; the owner-only line on the player view, the shared
  page or the PDF: 0.
- player view: the same public slots 900/900. FRESH shared page (stamp by the save path's composer, `projectShareVeil(toPublicSafe(stamped))`,
  rendered `publicDossier`): the same 8 slot texts 900/900.
- viability sentence: owner Outlook 900/900; player 900/900; fresh shared Outlook 900/900 (stamp = the owner's summary 900/900).
  The shared record carries no `_seed` (0/900), so a re-draw there WOULD differ in 477: the stamp is what holds it.
- PDF: the chapter's lines = the public slots in page order 900/900; `buildViewModel(...).viability.summary` = the tab's 900/900.
  `normalizeSettlement` keeps `_seed`, `id`, `name` 900/900.
- Foundry (`buildFoundryModuleFiles`): holds the viability sentence 900/900.
- AI grounding (`buildAiGroundingPayload`): its 8 Daily Life slots = the page's 900/900.
STORED COPY (not new: G79 (6), A18): the stamp `publicProse` is version 'pp-1' on base and tip; of its blocks ONLY `viewModel:viability` differs,
  in 464 of 900 towns. A town saved on the base and shared, read on the tip: the shared Outlook prints the OLD sentence beside the owner's new one
  in 464 of 900 until the owner saves again (e.g. dp-city-1: owner "Oxteco can stand, but only while timber keeps arriving…", shared "Oxteco works
  well enough, as long as nobody cuts it off from the timber it buys in."). Master db832c8926 has no `publicProse` at all (0 files): no released
  save holds a stamp. No Daily Life text is stamped (0/900): the shared page derives it.
NOT THIS CHANGE, SEEN: `supabase/functions/_shared/aiGroundingBundle.js` (the server's copy of the grounding, last built 2026-11-19) is untouched by
  these commits and holds no `pickRendezvous`, no `pickNameable` either: the server-side grounding prints neither the base's nor the tip's Daily
  Life pick until `npm run build:edge-shared` is run at the join. Not rendered by me.

## (5) WHAT MOVED AT THIS CHANGE — CONFIRMED on rendered pages (`tools/birth-1/page-battery.mjs --views` on base and tip, 900 C towns each, the real
OutputContainer as its owner sees it, every group, tab and disclosure; `scripts/q5-pages.mjs`; `out/q5-pages-C.txt`; wall 13.3 / 13.5 min)
- 900 towns, 23 views a town (22 at the fewest); printed lines base 1,120,878, tip 1,120,878. RECORDS MOVED 0 (the battery's own record hash too).
- Views that differ: `World/Daily Life` 900 of 900; `Systems/Outlook` 464 of 900; NO OTHER VIEW (21 other views byte-equal in all 900 towns).
- Lines the base printed and the tip does not: Daily Life 5,854; viability 464 (the same figures as the domain measure).
- LINES THAT DIFFER OUTSIDE THE TWO FAMILIES: 0.
- The tip's Daily Life tab prints every non-empty slot text of the derivation 900/900; the Outlook tab prints the viability sentence 900/900.
- Lines moved a town: Daily Life 6.50 (C), 6.78 (V); towns by number of Daily Life slots moved (C): 3:2, 4:13, 5:111, 6:302, 7:358, 8:103, 9:11.
- STILL OWED in (5): the 360 master-born records (below, when run).

## (7) WITHIN ONE PAGE — CONFIRMED (`q5-pages.mjs`, `q7-twice.mjs`)
- The tree's own page census (`pageCensusFindings`, 28 patterns, a page that denies itself) over the 900 rendered dossiers: towns GAINING a row on the
  tip 0, losing one 0; the census table byte-equal base vs tip (P16three 348, P17 603, P18 419, P8any 60, P5b 1, P14 1; the Daily Life rows NOHEAL,
  FOODSEC, FEDFARE 0 on both).
- The same line (6 words or more) in two views of one dossier: base 8,442, tip 8,442; of them a Daily Life or viability line: 0 and 0. Twice inside
  one view: 0 and 0.
- Inside one town's nine Daily Life slots and its viability sentence: a whole sentence in two slots: C 0 -> 0, V 0 -> 0; a run of six words in two
  slots: C 3 towns -> 1, V 1 -> 0 ("the place has lost a leading", outsider_impressions + recent_changes). Not more often than the base.

## (3) THE GUARD, BY PLANTS — CONFIRMED (`scripts/q3-guard.mjs`; my scratch worktree /home/user/guardp at 30539f145, restored by `git checkout -- .`
after every plant, never committed; each plant: the walker's file alone by vitest (json reporter), the door without and with `--write`, the baseline's
bytes before and after; `logs/q3-guard.log`, `logs/q3-guard-x.log`). 45 plants.
THE FAULTS (each must be RED in the walker and REFUSED by the door: exit 2, nothing written):
- F1 a line inserted as P3 in gathering_places|plain, P3.. shifted by one: RED ("NO MOVE", "NOTHING RE-WORDED UNBANKED"); door exit 2, 17 refusals, not written.
- F2 the same with one trailing space on each moved line: RED; exit 2; not written.
- F3 P1 and P2 swapped: RED; exit 2 (2 refusals). F4 the same with a trailing space: RED; exit 2.
- F5 a retired id reused (P9 removed, door --write, another line under P9): RED ("NO REUSE"); exit 2; not written.
- F6 a silent removal (P9 removed, door not run): RED ("NO SILENT REMOVAL"); door exit 1 ("run with --write"); `--write` retires it (exit 0, written). [see H7]
- F7 a second 'SS1' over three source lines / in double quotes / with backticks: each RED ("NO DUPLICATE"); each exit 2 ("duplicate: viability SS1").
- F8 the baseline file moved away: RED (7 tests); door exit 2 ("absent: restore it from git"), no file made.
- F9 `present` emptied in every scope: RED; exit 2 (145 refusals). In ONE scope: RED; exit 2. `{ "scopes": {} }`: RED; exit 2.
- F10 viability: a row inserted as SS1, SS1..5 shifted: RED; exit 2 (5). F11 DG1/DG2 sentences swapped: RED; exit 2. F12 a second P1 in a scope: RED; exit 2.
- X5 a new id given the same words as a present line: RED; exit 2 ("holds the words banked as P5").
- F9d the baseline made invalid JSON: walker RED (23/23); the door DIES with exit 1 (a JSON.parse stack), not a refusal (exit 2); nothing written.
  (exit 1 is also the door's "would change" code.)
HONEST WORK THAT PASSES (red until the door, then GREEN):
- H1 a line appended under a new id (P21): added. H2 a re-wording in place (P7): `re-worded: gathering_places|plain P7`. H3 a retired sentence back
  under a NEW id: added. H4 a comment naming 'SS4', "SS2" and a row inside deriveViability: GREEN, the door matches. H5 a viability row appended (SS6):
  added. H6 a viability sentence re-worded (DL2): re-banked. H11 a new branch (a new scope): added. X4 one line out and one in, in ONE change: GREEN.
  X6 a line moved to another branch with its id: retired there, added here: GREEN.
HONEST WORK THE GUARD REFUSES, WITH NO CURE BY THE DOOR (its own faults; the class of G81 (4)):
- H7 A LINE REMOVED AND RETIRED BY THE DOOR, nothing added (P9): the door writes `retired: gathering_places|plain P9`, and the walker STAYS RED:
  "guard-the-guard: the reader is not vacuous (floors from the first baseline: 144 scopes, 615 + 22 ids)". The floors are the first baseline's exact
  counts, so ANY net removal reds it. H8 the same for a viability row (DG3 retired: 21 < 22). X3 the same for P0 (the test also names P0, P1, P2).
- X2 THE SS1 ROW RE-WORDED IN PLACE: the door prints `re-worded: viability SS1` and the walker STAYS RED on 4 guard-the-guard tests ("a second SS1…",
  "a row form the reader does not recognise…", "a comment naming an id…", "the fingerprint reads the sentence source…"): the walker's test file
  holds SS1's exact source line as its plant anchor. H10 the same when SS1's row is only re-flowed over two source lines (3 tests red, door matches).
- H9 A SCOPE WHOSE LINES WERE ALL RETIRED CAN NEVER TAKE A LINE AGAIN: recent_changes|condition.boom (one line, K1): K1 removed and retired by the door;
  later a line under a new id (ZZ9): door exit 2, "the baseline's present is empty where the tree holds ids: restore the baseline from git; it is
  never refilled"; walker red ("NOTHING UNBANKED") for good. Five scopes hold one line today (child_warnings|rival_neighbor, child_warnings|default,
  recent_changes|condition.war_pressure, .war_spoils, .boom).
- D11 a string of an id's form that is no id inside deriveViability (`access === 'T1'`): RED, exit 2 ("a string of an id's form outside a row"). By its
  design (fail-closed); said in the head as a red, not as work refused.
WHAT THE HEAD SAYS IT DOES NOT CATCH: each TRUE by a plant:
- D1 a moved line whose words are also changed (P1/P2 swapped, one word changed in each): reads as two re-wordings, banked, GREEN. TRUE.
- D2a an id by concatenation `'SS' + 6`: GREEN, the door "matches": TRUE. (D2b `'S' + 'S6'` IS caught: RED, exit 2.) D2c a row built outside the function: GREEN: TRUE.
- X1 a swap laundered through three door runs: GREEN at the end: TRUE. D4 a scope's entry deleted whole, ids then shifted: banked afresh, GREEN: TRUE.
- the outsider second pick keyed by branch name: TRUE by reading (`outsiderParts`); my plant dl-g (4) shows it holds the bar while names stand.
NOT IN THE HEAD'S LIST, FOUND:
- D6/D7/D8 A VIABILITY ROW WHOSE ID IS NOT "1 to 4 letters then digits" IS NOT READ AT ALL: `['SELFS1', …]`, `['SS1b', …]`, `['SS_6', …]`: walker GREEN,
  door "the baseline matches the tree (144 scopes, 637 ids)": the row is unbanked, unguarded, free to be renumbered. An honest kind (a new pool's prefix).
- D9 SOME present ids deleted from the baseline by hand (P3..P20), ids then shifted: the door adds them, GREEN (the head names only the whole scope).
- a renamed BRANCH re-deals every LINE pick of that branch as well (the branch is in the key `<name>::dailyLife.<slot>::<branch>`); the door books it
  as n retired + n added, no refusal (by reading; X6 shows the cross-scope booking). The head names only the second pick.
- ids removed before the first baseline (P12 of gathering_places|plain, and others) are not `retired` (the list is empty): they may be used again.
