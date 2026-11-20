# COHERENCE-VEIL — hand-back, part 23: the twenty-second seat (V10-2 merged; R3 and R4 by builders in parallel; R5 to R7; DOORS; E)

Seat: VEIL-22, branch `lane/veil-22-2026-11-20`. Assignment: `lane/chair-2026-11-08 ::
docs/chair/2026-11-20/seventh/prompts/VEIL-22.txt` (it binds VEIL-21.txt whole, as amended by PART 22), read at 25947602c
(the seventh chair is session_019yED1SUxGVHyjQnoqoFvQ8). Every database is a scratch native PostgreSQL 16.15 cluster in
this container (`/var/tmp/v18pg`, locale C.UTF-8, trust auth, unix socket `/var/tmp/rv7` only, `listen_addresses = ''`,
`fsync = off`) or in-process pglite. No hosted database, no production credential, no `supabase` command, no deploy, no
pull request. Written 06:18 UTC (`date -u`).

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The rulings this seat works to
VEIL-21.txt's "RULINGS IN FORCE", VEIL-22.txt's "RULINGS SINCE", PART 22 sections 0a, 5 to 8. Since the hand-over:
- **VR42 (05:10 UTC):** a criminal-worded GOVERNING body is tier 2 (the town's public nature); for `power.entry` the
  governing power's row is never removed while the government's name stays; R3's born test holds it. `safety.economicDragDesc`
  is R3's row (by attribution); its prose copy `prose.shadowEconomy` R5's.
- **THE LANE IS YOURS at 463d0362c (05:52 UTC).** Owed from R2: the gate through the party link and master's stored shape
  (before R3 merges); the `safety.blackMarketCapture` page column ('re-derive' unmarked, 'not drawn' otherwise) CONFIRMED on
  one condition to prove (the page knows it from the served signal alone; under a given signal its absence is the same for
  every town); V10-2 at the first stage boundary; R6 prepared at b47b7bbdb, not merged.
- **06:10 UTC:** the reader's cold read of R2: R2 HOLDS (restamp 96 of 96 per shape; the black market's share absent on
  every marked read, equal to the owner's on unmarked; raw measures absent). **VR44 (HIGH, for the doors' merge):** the
  tile's stability is the BAND WORD alone on every non-owner read, marked or unmarked. "DOORS 3e1115c81" handed back
  PARTIAL (`lane/veil-doors-3-2026-11-20`): merge `--no-ff` after R3 and R4, every hunk read, the two inside
  `import_gallery_dossier` hardest; then ONE builder, ONE commit, red first: VR44, VR41's two narrowings (1,393 lived
  entries, 42 -> 0 withheld, a born arm), the reader's repros and the acceptance run at the merged tree; "DOORS-IN <commit>"
  with 212's sha256. VR43's one-row count goes into the deploy note.

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at the cut) |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (proved at the cut) |
| 212 at the cut 463d0362c and after V10-2 (d136940c3) | `05b915ab119e2f9766a3cea47fdd9ec023fc2155f588f1b4127ea5b347118f10` |
| 212's rollback at the cut | `1454f8f3fa53943130a22d412152e0eddcf3e05684b3cf01f62e77c069e2a66e` |

## 2. The cut, the instruments, V10-2

THE INSTRUMENTS RE-MADE in this container (PART 21 section 6, PART 20 section 4): the cluster; `pg@8.13.1` in
`/var/tmp/v18/pgmod`; the readers' library (`git archive 72a3bb24f` REVIEW-VEIL-6/-7/-8, `origin/lane/review-veil-9-2026-11-19`
REVIEW-VEIL-9) in `/var/tmp/v18/lib`; the probes flat in `/var/tmp/v18/rv9`, three imports re-pointed; R1's runner and
tally in `/var/tmp/v18/`; master `/home/user/wt/master` (detached at db832c892, `node_modules` by `cp -al`). Dry run at
0d28ccf19 (before the hand-over, nothing written): registry `--check` exit 0, walker 11 of 11, render-twice 4 of 4,
inversion 4 of 4, acceptance EXIT 0.
THE CUT: `lane/veil-22-2026-11-20` at **463d0362c** (VEIL-21's final tip, read back from origin).
V10-2: `git merge --no-ff origin/lane/veil-v102-2026-11-20` (cabdfaa69), no conflict: **d136940c3**. Read line by line:
galleryVeil.js's hunk in `curateModelFor` only (VR34: every copy of a card; the house each person belongs to as the applier
reads it); criminalVeilSwitch.js narrows the switch to the addresses the Curate model draws; CurateMode.jsx hands the model
in; one manifest row. The commit hook's eslint left V10-2's files byte-equal to its tip.
AT d136940c3, executed (`out/v22/`): registry `--check` exit 0; walker 11 of 11; V10-2's three test files, VR17's walker and
the eight veil guard files: **176 of 177** (`v102-merged-guards-at-d136940c3.txt`, 1,397 s). THE ONE RED, ATTRIBUTED:
`criminalVeilSwitch.test.js` VS1 (b): **21 lines, every one "safety blackMarketCapture"** (28 lines on 12 births before
V10-2; the (c) lines are gone): V10-2's test asserts the family content of the unveiled projection reaches the visitor; R2
withholds `blackMarketCapture` on every read (as it does `weight`, which the test already serves as withheld). A test
pinning the behaviour before R2: aligned by the test-only builder (R6's re-cut), not by loosening.

## 3. The list, as it stands

| Item | State |
|---|---|
| V10-2 | MERGED d136940c3 (section 2) |
| R3 (roster choices) | BUILDER STARTED (`/home/user/wt/r3`, `v22-r3`, from d136940c3; VR42 and the economicDragDesc measure in its launch) |
| R4 (the people) | BUILDER STARTED (`/home/user/wt/r4`, `v22-r4`, from d136940c3; `cast.roles[].id` re-keyed before R2's step) |
| R2's owed gate: the link and master's shape | DONE at d136940c3 (section 4) |
| R6 | prepared at b47b7bbdb: re-cut by a test-only builder (KNOWN_TIER1 shrinks: R2 withholds `defence.scores.internal`; align or retire `rosterChoiceInversion`; VS1 (b) aligned; the blackMarketCapture condition measured) |
| R5, R7 | after R3, after R6 |
| DOORS 3e1115c81 | after R3 and R4, with its builder (section 0) |
| the stored figures, E | not started |

## 4. R2's owed gate, through the server (d136940c3; the committed export; the reader's differ, R1's runner, 2 shards)

| Read | Before R2 (R1's committed export, `out/v20/`) | At d136940c3 (`out/v22/gate/`) |
|---|---|---|
| New shape, gallery (VEIL-21, at 7591663b4) | UNREGISTERED 131 (137 at 0d28ccf19) | 42 (`out/v21/seat-r2/`) |
| New shape, party link (N=2) | 125 | **registered 13, diffuse 21, rng-only 13, UNREGISTERED 38** (`gate-link-new-at-d136940c3.txt`) |
| Master's shape, gallery (N=1, master's generator db832c892, chain 203+211+212) | 145 | **registered 13, diffuse 15, rng-only 10, UNREGISTERED 66** (`gate-gallery-master-at-d136940c3.txt`) |
| Master's shape, link (N=1) | 132 | **registered 13, diffuse 15, rng-only 10, UNREGISTERED 55** (`gate-link-master-at-d136940c3.txt`) |

The runner's own invocation: `gate-queue.sh` beside them. THE UNION of the three readings' unregistered paths: 96 paths,
each matched against EVERY registry row (built or not): R4's holders 52, R5's composed 22, R3's roster choices 12, second
homes 2, apply 2, and **SIX WITH NO ROW AT ALL**: `publicProse.blocks.economy:{daily_life,resources,services}.{incomeMix,
criminalLine}` (the three alias blocks of `economy:economics`, whose own `incomeMix`/`criminalLine` ARE registered): on 30 of
30 reads the served town LACKS the key its house-free counterfactual carries (`{"@":"economy:economics"}`, `null`), and
removing an ordinary house never moves it (C empty). Unregistered since R1 (present in the pre-R2 gate too). To the chair;
proposed host: R5 (the composed prose, beside `prose.incomeWeight.alias`).
The master-only unregistered paths are the people (`npcs[]`, `factions[].members[]`, `prominentRelationship`,
`pressureSentence`, the levers' holders: R4), `powerStructure.factionRelationships[].direction` (R3), the cast roles (R4),
`economicState.incomeSources[].desc` and `compound.inst.hasMercenary` (registered, unbuilt).

## 5. The chair's word of 06:29 and 06:38 UTC; R6's re-cut, unit by unit

- **CTR9 (06:29, for knowledge):** a content seat (TRAD-1, `lane/trad-2026-11-20`) adds the traditions as TEXT under
  `publicProse` (owner-side composers `display/publicProse.js`, `publicProseCompose.js`); on the joined tree the gate must
  show that sub-path NOT differing (a difference is a finding against that seat, not a row here). If R5 edits either
  composer, the chair is told which lines.
- **06:38:** THE SIX ALIAS PATHS (section 4) CONFIRMED FOR R5: alias rows beside `prose.incomeWeight.alias`, each bound to
  the rule of the block it aliases (served exactly when its target is; never outlives its target's withholding); red first
  on the 30 reads; the registry's new row count in the "R5" line. GENERAL RULE: at E the gate's FOUR readings (gallery and
  link, both stored shapes) show UNREGISTERED 0, any path left named with its reason. VS1 (b)'s commit names the R2
  behaviour each pin holds.

R6'S RE-CUT (test-only builder, `v22-r6`, pushed as `lane/veil-22-r6-2026-11-20`; hand-back `out/v22/r6/R6-HANDBACK.md`):
- 060be8f46 (NOT MERGED): b47b7bbdb cherry-picked onto 49d3de5b2. INVERSION green: KNOWN_TIER1 {defence.scores.internal}
  -> {} (R2 withholds the scores). RED green. MAIN red 66: `cast.stakes` (a stake naming a criminal power still served:
  R3's `power.entry` cures), `cast.roles` wording (R3/R5), and 16 twin-versus-server lines that are jsonb KEY ORDER alone;
  CONTROL red 8, the same key order (a diagnostic run sorting keys: CONTROL green, those 16 lines 0).
- **THE SEAT'S RULING ON KEY ORDER (VEIL-22, vetoable by the chair):** jsonb stores an object's keys in a fixed order that
  is a function of the key set alone, so it carries no document data; the twin-versus-server and CONTROL comparisons compare
  objects modulo key order, ARRAY ORDER KEPT EXACTLY (VR21); a planted reorder and a planted value are still caught.
  Applied by a second test-only builder (units: the ruling, `rosterChoiceInversion` aligned or retirement recommended, the
  blackMarketCapture condition measured). R6 merges after R3.
- e56a0d42f, TAKEN ONTO THE LANE as **b5cb22caf**: VS1 (b) aligned: the expected show copy is the unveiled projection less
  every BUILT withhold-always row of the registry (54), read live; teeth: a planted served `blackMarketCapture` caught 24 of
  24, a withheld `crimeTypes` caught 24 of 24. RED before **24** lines (the "21" of section 2 was read from a 42-line tail:
  CORRECTED), every one "safety blackMarketCapture" (`out/v22/r6/vs1b-red.txt`). The seat's own re-run at b5cb22caf: 9 of 9
  (`out/v22/seat-vs1b-green-at-b5cb22caf.txt`). VS1's reds after V10-2: ZERO.
- A SLIP, recorded: the first builder once ran vitest from this checkout (it wrote only vitest's cache under
  `node_modules/.vite`; no tracked file changed).

## 6. VR45; R6 complete (waiting on R3); R4 not green, its cure

**VR45 (the chair, 06:53 UTC, no veto, one arm added):** the twin-versus-server and CONTROL comparisons compare objects
modulo key order (jsonb orders keys by a rule over the key set alone); ARRAY ORDER EXACT (VR21); plants prove (a) a
reordered array, (b) a changed value, (c) an added or a missing key at any depth are still caught. APPLIED at **6978a8fc2**
(`v22-r6`): CONTROL 8 red -> green; twin-versus-server 16 -> 0; plants (a) 2/2, (b) 2/2, (c) 2/2 and at the deepest object
of 48 served documents (depth up to 6) 48/48 each (`out/v22/r6/counterfactual-keyorder-ruled.txt`).
R6 (`lane/veil-22-r6-2026-11-20`, 7d9ebd078; NOT MERGED, waits on R3): MAIN red 50: `cast.stakes` @ city-famine-7 30
lines (a stake naming a criminal power still served: R3's `power.entry`), `cast.roles` @ city-insurgency-3 20 lines (the
reason's wording: R3/R5). `rosterChoiceInversion` ALIGNED, NOT RETIRED (7334bdf11): under VR32 its inverting list shrank
6 -> 3 (tier 2; `prosperityStanding` still inverts on metropolis-insurgency-5); its tier-2 pin, not-re-derivable pin,
TOTAL, FIDELITY and births have no other holder (the builder's table, `out/v22/r6/R6-HANDBACK.md`).
THE CHAIR'S CONDITION ON `safety.blackMarketCapture`, PROVEN (7d9ebd078, `blackmarket-capture-condition.txt`): 12 towns
(7 with a criminal house, 5 without), Reveal DM off and on: the server carries it on 0 of 96 reads; a marked share draws
it on 0 towns; an unmarked gallery read draws it on 12 of 12, equal to the owner's figure 24 of 24; the party link draws it
on 0; the overrides swapped between rows move the decision with them 48 of 48 (the served signal alone).

R4 (dfa031f3e, pushed as `lane/veil-22-r4-2026-11-20`; 212 -> `ba7d8631…3a51c9`, rollback -> `786c8bd8…31b2`): NOT GREEN.
Born test `galleryVeilPeople.pglite` red 4/7 -> green 7/7; walker 11/11; `--check` 0. Guards red by VR10's re-key:
`galleryServerVeil` 10/17, `publicSafe` 7/56, `galleryVeilSignalCopies` 4/5, `criminalVeilSwitch` 1/9. THE SEAT'S READ OF
ITS DIFF found `_gallery_veil` drawing `gen_random_uuid()` while declared IMMUTABLE (a cached plan with constant arguments
could fold one salt for every read), and the twin's salt drawn once per page load. A CURE BUILDER from
`briefs/R4-CURE-BRIEF.md` (lane 9894c75d8): the salt's volatility red first, the twin one salt a projection, each guard red
read and re-stated under THE SEAT'S RULING (vetoable: modulo the read's person-id bijection, renamed by first appearance;
teeth: a reference not following its card reds, any stored id served reds, a changed non-id byte reds), then R2-BRIEF's
green list.

## 7. The chair's word of 07:10 and 07:14 UTC: the salt, VR46, the successor

**THE SALT (07:10, binding on R4-CURE; relayed to its builder):** (1) red first, honest about plan caching: the prepared
read executed AT LEAST SEVEN TIMES (a generic plan after five) and once more under `plan_cache_mode = force_generic_plan`;
green: every execution a different salt; then VOLATILE on every function that draws or carries the salt. (2) THE FINAL
CATALOGUE: one statement listing `provolatile` for every function 211 and 212 create or restate, each with its reason; no
function that reaches the salt is immutable or stable, directly or through a call. **211 AND 212 IN ONE PUSH:** 211 is
byte-frozen and its own text keeps its own declarations (`_gallery_veil` IMMUTABLE there); 212 runs after it and RESTATES
`_gallery_veil` (and every function that carries the salt): 212's restatement is THE FINAL DEFINITION a deployed database
holds; between the two statements, inside one migration run, no read is served. (3) THE COST LAW re-measured, before and
after. (4) THE TWIN: one salt a projection; two projections of one town in one page load differ in their person ids.
**VR46 (07:10, the seat's guard ruling, no veto, two teeth added):** a guard that pins a served person id byte-for-byte is
re-stated modulo the read's person-id bijection (canonical names by first appearance), every other byte compared exactly;
teeth, each executed: (i) a reference not following its card reds; (ii) any stored person id served reds; (iii) a changed
non-id byte reds; (iv) within one read the re-key is a BIJECTION (two stored people under one id, or one person under two,
reds); (v) two reads of one town DIFFER in their person ids (the server through the prepared statement; the twin). A red
that does not hold under the re-statement stops the builder.

**FOR THE OWNER, IN PLAIN WORDS: WHAT A READER OF A SHARED PAGE LOSES BY THE RE-KEY (VR10).** Every time a visitor opens a
shared town, each person in it gets a fresh, random id that holds only for that one load of the page. So: a link or an
anchor pointing at one person's card stops working after a reload (the card is still there, under a new id); anything a
visitor's browser might remember about a person by their id between visits would not carry over (the seat found no such
store in the page code today: a search of the page and library code for anchors, scrolling or local storage tied to a
person found none; PLAUSIBLE, read, not executed); and an imported copy keeps the ids of the one read it was taken from,
so two imports of the same town cannot be matched person to person by id (an import is always a new save, so nothing in
the app relies on that). Names, roles and every tie between people are unchanged within a page; only the hidden key moves.

**THE SUCCESSOR (07:14):** VEIL-23 (session_019yED1SPikQqQKF16wCQQfC) is seated beside this seat on its tip and writes
nothing until the chair's word. THE HAND-OVER at the first clean boundary (after "R3", or after the R4 cure merged green,
or at 380,000 tokens): this file current with a section "the hand-over", then "<stage> <commit>, HANDED OVER".

## 8. THE HAND-OVER (to VEIL-23, on the chair's word of 07:24 UTC; written 07:24 UTC)

THE MARK: the chair read this seat's true count from the session record: **381,559 tokens** (this seat's own estimate ran
about a third low; `get_session` reads 0). This seat hands over now and is afterwards only a RELAY for the builders it
started (their reports return to its session): it reads no diff, merges nothing, briefs nothing.

**MERGED ON THE LANE (`lane/veil-22-2026-11-20`; tip: the commit carrying this file):** 463d0362c (the cut) -> V10-2
`--no-ff` **d136940c3** -> VS1 (b)'s alignment **b5cb22caf** (cherry-picked from e56a0d42f; VS1's reds zero; the seat's
re-run 9 of 9). Records only besides: the gate (section 4), PART 23, `briefs/R4-CURE-BRIEF.md`. 212 on the lane is still
`05b915ab…8f10` (no stage after R2 is merged); 211 `eface6d0…`/`ce8474ff…` unchanged.

**BRANCHES AND BUILDERS (pushed as transport; none for a pull request):**
| Stage | Branch (origin) | Commit | Brief | State, and what it owes |
|---|---|---|---|---|
| R3 | `lane/veil-22-r3-2026-11-20` (worktree `/home/user/wt/r3`, `v22-r3`) | 9e082aa0a | `briefs/R3-BRIEF.md` + the launch's VR42/economicDragDesc addendum (section 0) | BUILT, NOT GREEN, builder STOPPED (its mark). 14 rows built; twin in new `galleryRosterChoices.js`; 212 -> `04693646…959e`, rollback -> `653ae8b2…b2f4` (its commit message garbles one hash line; the hand-back's are right). Born red 7/11 -> green 11/11; acceptance EXIT 0 (40 PASS); harnesses 58/58; `--check`, typechecks, eslint 0; cost: Langengrund Reveal-DM 570.7 ms (bound 709.0), link 2.16x 211, 50/500/500 1.97x. THE ONE RED: `galleryVeilHandRows` V8-4 (8 lines "powerStructure.factions[0] lost its name": its hand row's "Thieves' Guild" is raised by the hidden "Thieves' guild chapter"; the 03:15 power observable withholds it) — **SENT TO THE CHAIR FOR A RULING (07:18 UTC)**: the seat holds the observable governs, V8-4 re-recorded on a shown power no hidden house raises, its floor and sweep arms kept, plus an arm that the raised power leaves WHOLE. Two observables not met as worded, both by SHOWN houses (`out/v21/r3/measure-observables.txt`): "Magical crime" in 2 towns (control allows); semi-organized labels above the control pool. UNCOMMITTED in its worktree: the reruns' outputs `out/v21/r3/guards-security-rerun.txt` (1 failed of 68: V8-4) and `guards-exits.txt`; `guards-twin.txt` (the twin batch) did not finish. NOT READ BY THIS SEAT: the diff. |
| R4 | `lane/veil-22-r4-2026-11-20` (worktree `/home/user/wt/r4`, `v22-r4`) | dfa031f3e (+ the cure's commit to come) | `briefs/R4-BRIEF.md`, then `briefs/R4-CURE-BRIEF.md` + the chair's 07:10 additions + VR46's teeth (iv), (v) + VEIL-23's cures (1) to (3), all relayed to the cure builder (section 7; 07:25 UTC) | R4 NOT GREEN (guards pinning byte-stable ids: galleryServerVeil 10/17, publicSafe 7/56, galleryVeilSignalCopies 4/5, criminalVeilSwitch 1/9). **R4-CURE BUILDER RUNNING** in this seat's session: owes the salt red (seven executions + forced generic plan) and VOLATILE, the volatility catalogue, cost before/after, the twin's one salt a projection, every guard red re-stated under VR46 with teeth (i)-(v), the substring and key search for stored ids (two plants), numeric ids re-keyed (a plant), the withheld holders' names searched in every served string (a hit outside R5's or the doors' rows is tier 1: STOP), then R2-BRIEF's green list (acceptance, render-twice, inversion, guards, typechecks). Its report returns to this seat: relayed UNREAD. |
| R6 | `lane/veil-22-r6-2026-11-20` (worktree `/home/user/wt/r6`, `v22-r6`) | 7d9ebd078 | `briefs/R6-BRIEF.md` + the seat's units | COMPLETE, NOT MERGED, waits on R3 (its MAIN arm red 50: `cast.stakes` (R3), `cast.roles` reason wording (R3/R5)). VR45 at 6978a8fc2; rosterChoiceInversion aligned 6 -> 3 (7334bdf11); the blackMarketCapture condition proven (7d9ebd078). Builders ended. |

**THE RULINGS SINCE THIS SEAT'S PROMPT (each vetoable by the owner):** VR42 (the governing power's row stays); the
blackMarketCapture page column CONFIRMED and its condition proven; VR44 (the tile's stability, the band word alone, every
non-owner read: at the doors' merge); the six alias paths hosted by R5 (each bound to its target's rule; red first on the
30 reads; the new row count in the "R5" line); THE GATE AT E: the four readings (gallery and link, both shapes)
UNREGISTERED 0, any path left named; VR45 (key order); THE SALT (sections 6, 7); VR46 (the guards modulo the read's
person-id bijection, five teeth); CTR9 (TRAD-1's traditions text under `publicProse` must show as not differing; if R5
edits `publicProse.js` or `publicProseCompose.js`, the chair is told which lines).

**WHAT THIS SEAT WOULD DO NEXT, IN ORDER, AND WHY:**
1. The chair's ruling on V8-4 (pending), then an R3-CURE builder (V8-4 re-recorded or the rule changed as ruled; R3's
   uncommitted rerun outputs committed; the twin batch `guards-twin.txt` re-run, `criminalVeilSwitch` and
   `observedShapeReaders` named), then READ R3's diff line by line and merge it (R3 first: R4 places its call line after
   R3's; R5 derives from R3's inputs). Send "R3 <commit>".
2. R4 when its cure returns green: read line by line (the salt's volatility first), merge after R3, the call-line order
   at the merge, the volatility catalogue checked by hand. "R4 <commit>".
3. R6 merged after R3 (re-run its MAIN arm at the merged tree: it must go green on R3's rows).
4. R5 (composed prose; the six alias rows; CTR9's composers), then R7.
5. DOORS 3e1115c81 `--no-ff` after R3 and R4, every hunk read, the two inside `import_gallery_dossier` hardest; ONE
   builder: VR44, VR41's two narrowings, the reader's repros and the acceptance run at the merged tree, AND VEIL-23's cure
   (4): the frozen share's NAME and TIER columns come from the raw copy (`src.j`): a born arm that the column equals the
   served body's name and tier on every read, with a planted town whose name holds a hidden house's name; else read both
   from the body. "DOORS-IN <commit>" with 212's sha256. VR43's one-row count into the deploy note.
6. The gate's four readings again (target UNREGISTERED 0), the stored figures once at the merged tree, then E.

**THE INSTRUMENTS in this container** (for any seat that shares it; VEIL-23 has its own): the cluster `/var/tmp/v18pg`
(socket `/var/tmp/rv7`), `/var/tmp/v18/{pgmod,lib,rv9,base,t-d1369}`, R1's runner and tally in `/var/tmp/v18/`, master
`/home/user/wt/master`, worktrees `/home/user/wt/{r3,r4,r6}`; the gate's invocation `out/v22/gate/gate-queue.sh`.
