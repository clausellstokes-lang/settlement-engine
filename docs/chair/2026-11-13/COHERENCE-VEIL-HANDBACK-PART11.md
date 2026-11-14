# COHERENCE-VEIL — hand-back, part 11: the tenth seat (212 rebuilt by identity, to the reader's acceptance run)

Seat: VEIL-10, lane `lane/coherence-veil-2026-11-11`, from **7d99e9b8e** (read back from origin first: equal; its four
checksums as PART 10 states them, proved). Brief: `lane/chair-2026-11-08 :: docs/chair/2026-11-14/briefs/BRIEF-VEIL-10.md`
(the chair is session_01ACmDYZrFEVXyZEUg1NDxxC). Every database is an in-process pglite or a scratch native PostgreSQL
16 cluster in this container (`/var/tmp/v10pg`, locale C.UTF-8, trust auth, unix socket `/var/tmp/rv7` only, no TCP).
No hosted database, no production credential, no `supabase db push`, no `migration repair`, no deploy, no golden's
door, no pull request. **Nothing is applied anywhere but those local databases.**

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN, untouched) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN, untouched) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` |
| 212 at 7d99e9b8e (PART 10's last) | `a222b83dc0d05a03d0de88106be2e573f8ebf4a3ca5b08a1a871c4c143ed78f3` / down `5e85b349…c4c01` |
| 212 after V7-3 | `02e00643e418856f4f16e517a256a2c62835d589d6cab6e0136dd9737b7adfa6` / down unchanged `5e85b349b82305ef3033ea8bfc0abc51dcfac0a81113458504223a4a5b2c4c01` |
| 212 after V7-1 (the name search rebuilt) | `715009bdce20c719bef5139a2e08257d87b95e7ea44e1d3a7b464bfa4245e751` / down `d99237b4b71e2c734f83b8b5cda15f201a85e4902ab05a7e4503d51620458a7b` (its drops are 212's twenty-five helpers, by signature) |

**Not final. The owner's pack `veil-212/` still describes old bytes: do not use it.**

## 1. Where the ninth seat stopped (the first act)

One commit after 6692efdda: 7d99e9b8e (item 1: the two derived lists by positive account, the birth name swept). PART 10
says its V7-1 "is the next commit" and item 2 "follows": neither was pushed, so both are lost and are rebuilt here in
the design's form. No stop and no unanswered question is named in PART 10 or in that commit: no first message was owed.

## 2. The acceptance run, red first (the brief's item 2)

`run-all.sh` (the reader's library, copied out of `lane/review-veil-3-2026-11-12` at 61a253a79 by `git archive`, never
committed here) at 7d99e9b8e: **37 checks, 18 pass, 19 fail; the twin differs on 2 of 15 shares; the deep row and both
large rows fail** (3,000 deep: `stack depth limit exceeded` where 211 serves in 32 ms; 200 x 5,000: 350 ms on 211,
8,411 ms on 212; 600 x 10,000: 1,365 ms against 49,313 ms). Its print: `veil-probe-10/out/run-all-red-at-7d99e9b8e.txt`.
(The reader's 17 / 20 at 6692efdda became 18 / 19 with the ninth seat's item 1: a11 passes.)

## 3. The cures, in the brief's order

| Finding | 212 (server) | Client twin | Red first -> green |
|---|---|---|---|
| **V7-3** a house hidden whole is removed whole BY ITS ID ALONE | `_gallery_veil_apply`: the removal no longer asks the class a second time of the trimmed card | `galleryVeil.js :: applyVeil`, the same | `tests/security/galleryVeilHandRows.pglite.test.js` (new: rows written by hand, three shares, gallery, link, import and the twin as a read of its own), arm V7-3: `out/hand-V7-3-red.txt` (nameless `{"category": ...}` records left by every read) -> `out/hand-V7-3-after.txt` (1 of 1) |
| **V7-1** the name search rebuilt, with what turns on it: **V7-4** (a key, a join, an id, camel case, squeezed, the name without its qualifier, a plural), **V7-6** (the cost), **V7-7** (what is not hidden stays), **V7-9** (U+0130; a label with no name), **V7-10** (no call a level; the bound) | section 4c, fourteen helpers `_gallery_veil_name_*` and `_gallery_veil_named`; `_gallery_veil_second_homes` asks the whole text once and walks only on a hit; `_gallery_veil_apply` hands over the labels. Gone: `_gallery_veil_folded_name`, `_names`, `_sweep`, the prefilter | `gallerySecondHomes.js`, THE NAME SEARCH (`buildNameSearch`, `sweepHiddenNames`, `nameFold`, the three tables); `applyVeil` hands over the labels. Gone: `foldedHolds`, `namesText`, `sweepNames` | `galleryVeilHandRows.pglite.test.js`, five new arms of the builder's own plants (EVERY SCRIPT, THE FORMS, WHAT IS NOT HIDDEN STAYS, THE BOUND, THE TABLES; server against twin on each: 0 paths) and `gallerySecondHomes.pglite.test.js` 'THE TWO FOLDS ARE ONE' re-keyed: `out/hand-V7-1-red-at-4f7c60cbb.txt` (5 of 6 red), `out/folds-arm-red-at-4f7c60cbb.txt` -> `out/guards-green-V7-1.txt` (both files, 11 of 11; the three gates) |

V7-3, said plainly: the set of ids removed whole is decided before any eye runs (211's rule, unchanged: a card address
on a house the data puts in the class), and the list is then filtered by that set alone. Plants: in the class by a
declared `clandestine` tag, by a `subterranean` facet, by `institutionFunction`, as an illegal brokerage alone (tags and
service keys), a Criminal category, and TWO records under one id of which only the first is in the class.
**A row for the owner's veto:** by the id alone, a second record that SHARES the id of a house hidden whole goes with
it, in the class or not (before, it stayed with its four eyes shut). It shares the hidden house's address and, where
the id is derived, its name. Pinned in the arm.
At this commit: gates `typecheck:domain:strict` 0 (1,113), `typecheck:ratchet` 0 (167), eslint 0, each through
`scripts/gate-tail.sh`. The lane's pins galleryVeilCures, gallerySecondHomes, pgliteHookTimeoutRatchet: green;
galleryServerVeil: the SAME six reds as `veil-probe-8/out/pins-at-1a2412716.txt` (the ruled tie-role cut, 68 lines,
every path `relationships[...].npc1Role|npc2Role` or its "(order or value)" line): carried to item 3 (a).

## 4. THE NAME SEARCH, AS BUILT (design (ii); V7-1, V7-4, V7-6, V7-7, V7-9, V7-10)

Built by a builder working for this seat (the sub-brief `SUB-BRIEF-V7-1.md`), in migration 212 section 4c and in the
client's twin (`gallerySecondHomes.js`, THE NAME SEARCH), rule for rule. It REPLACES the eighth seat's sweep
(`_gallery_veil_folded_name`, `_names`, `_sweep` and the prefilter; `foldedHolds`, `namesText`, `sweepNames`): nothing of
it is patched. `_gallery_veil_fold` / `foldName` STAY, under a comment that says what they are: the catalogue
identity's fold (the engine's own fold of a birth name into `catalogId`), which the rules BY IDENTITY compare with (the
two lists by positive account, the processor match). They are not the name search's fold.

**The laws, as built** (points 1 to 5 of the design this section held before it was built):

1. **One fold, both engines, every script, no `lower()` / `toLowerCase()`, no locale.** A SEPARATOR is a character of
   the one explicit set (as designed; `_gallery_veil_name_sep`, `NAME_SEP`: the same text). Everything else is kept.
   The fold of a text: (a text with a character outside ASCII only) the preparation, then A-Z lowered by an explicit
   map, every run of separators one `_`.
2. **Case outside A-Z lives in the NEEDLE.** One table of case classes (1,028 classes, 2,067 letters), generated once
   (`veil-probe-10/gen-name-tables.mjs`, Unicode 17.0) and carried as the same literal by both engines
   (`_gallery_veil_name_case`, `NAME_CASE`); sharp s and "ss" are one.
3. **One search for all hidden names at once:** one alternation, `(^|B)(n1|n2|...)(e?s)?(B|$)` on the folded text (B:
   `_`, or the end of a string), each name's words joined by `_?`. A house's names: its name, its label where it has no
   name (V7-9), the name without its bracketed qualifier, its catalogue identity, each processing name only it answers
   to. A name that is separators only is searched as written.
4. **Keys as well as values;** an id and a join are strings like any other. FLOORS: the town's `name`; the `id` and
   `name` of a house still listed (its `label` where it has no name); a shown power's `faction` and `name`. An open
   name that holds a hidden one is cut out before the search, longest first. An entry of a list whose own `id` or
   `name` is taken leaves the list whole.
5. **The whole text is asked first; the walk is iterative** (211's `_gallery_veil_drop_hooks` shape), bounded: the
   root is level 0, and a container at level 64 that holds a hit at any depth is withheld whole.

**Where the mechanism differs from the design as it was written, each with its measure** (`veil-probe-10/out/measures-V7-1.txt`; the scripts in `veil-probe-10/measure/`):

| The design said | Built | The measure |
|---|---|---|
| NFKC, then the marks U+0300..U+036F removed | **NFKD**, then those marks removed (an accent is no part of a letter: `é` is `e`, `й` is `и`) | under NFKC the upper-cased copy of 97 letters folds apart from the letter (U+01F0, U+0390, U+03B0, U+1E96..U+1E99, U+1F50.., whose capital is a letter and a mark); under NFKD, 74 by the same simple key (`upper-miss.mjs`); with the closure below, 63 of 145,620 letters as built, all of them Greek letters with an iota subscript (`case-copies.mjs`) |
| the case table from the simple lower-case map, with U+0130, U+212A, final sigma, sharp s written in | the closure of "lower-cases to" AND "upper-cases to" (one code point each) over the letters the preparation leaves alone; U+0130 and U+212A need no entry (NFKD writes them I and K); the dotless i is in i's class | an upper-cased copy is found: U+0131 upper-cases to I, final sigma to capital sigma |
| a word boundary on both sides of every name | a boundary at an end of the name ONLY where that end is a letter or digit of an alphabet that separates its words (ASCII, U+00C0..U+058F, Georgian, U+1E00..U+1FFF, U+2C00..U+2DFF, U+A640..U+A7FF) | a Han or Thai name inside its sentence, and an Arabic name behind a joined particle, have no separator beside them: red at 4f7c60cbb, and red under `(^|_)...(_|$)` |
| each letter with case variants a bracket | only a letter OUTSIDE A-Z is bracketed; the text's A-Z are lowered (one pass) | 1,200 names of three words: 675 ms to compile with every ASCII letter bracketed, 40 ms without (`compile-cost.sql`) |
| a string asked of the alternation | the alternation is run over the document's text ONCE, and once more only where that found something, to mark the strings that hold a name; each later test of one string is a look-up among those | one alternation of 1,200 names costs 0.14 to 0.6 ms to start: 10,000 strings asked one by one, 1.4 to 6.2 s; one 388 KB text asked whole, 3 to 145 ms (`alt-cost.sql`) |
| (not said) | THE SKEW: 57 code points Unicode 17.0 decomposes and PostgreSQL 16 does not are written as their decomposition by both engines first | `nfkd-skew.mjs`; after it the fold is the same string in both engines for all 1,112,063 code points, alone and inside a name, on PostgreSQL 16.15 (`native-fold.mjs`) and for the basic plane on the guard's PostgreSQL 18.3 |
| (not said) | an open name that IS a hidden one (the same letters: a shown power `Red Hand`, a house `Red hand` hidden) keeps its floor and is NOT cut out of other strings | the closed choice: the owner hid that name |

**Rows for the owner's veto, new with this build:**
- A PERSON (or any entry of a list) whose own `id` or `name` holds a hidden house's name leaves its list whole (the
  design's point 4; REVIEW-VEIL-7's shape 6 put it to the chair). `Black market broker` goes with `Black market` hidden.
- The name without its bracketed qualifier IS the name: with `Guild (thieves)` hidden, every string with the word
  `guild` goes (an open house's longer name aside).
- Accents are not letters: `Résumé hall` hidden takes `resume hall`. The dotless i is i.
- The squeezed spelling is the name: `Greycourt` goes with `Grey court` hidden.
- The town's own `name` is a floor; a sentence that holds the town's name, where that name holds a hidden one, goes.
- A key is a string: with `Black market` hidden the key `blackMarket` goes with what it holds (`hasBlackMarket` stays).

**Outside the law, listed:** an inflected form of a name (a Russian genitive); a Greek letter with an iota subscript
upper-cased (its capital adds an iota: 63 letters); a mark outside U+0300..U+036F (Arabic vowel signs); a combining
mark that only a newer Unicode than an engine's knows may be ordered differently by the two engines; an engine older
than Unicode 15.0 or newer than 17.0 is outside the skew's measure (the guard asks the basic plane on every run).

**A RULING IS OWED: a shown power whose name is a hidden house's.** As the design has it (and the builder's brief:
a shown power "keeps its name"), an open name that IS a hidden name keeps its floor and is not cut out of other
strings. On born towns that bites (`out/born-old-against-new-V7-1.txt`: the eight towns of the routine pin, the old
twin against the new, 48 projections): a metropolis that hides the house `Thieves' guild (powerful)` shows the POWER
`Thieves' Guild`, and the house's name without its qualifier is the power's name: the power's record keeps its name and
every other string that names the power goes (5 on a public read: two conflicts' parties and sentences, a tension's
list; 60 with Reveal DM: people's goals and memberships). A city that hides `Thieves' guild chapter` loses the same
strings with Reveal DM (43), by a processing name only that house answers to. The other reading (an open name that
equals a hidden one is cut out of every string, as a longer one is) keeps them, and needs one more step so that a
LONGER hidden name that holds an open one (`Thieves' guild (powerful)` itself) is still taken: each such name replaced
by a mark before the open name is cut, in order of length. Not built: it is a law, not a mechanism.
Also seen there: the role and title `the fence` go where `Fence (word of mouth)` is hidden (4 paths, with two ties'
copies), and the trace's downstream effect whose target is `blackMarket` goes where `Black market` is hidden (9
entries: the camel-cased name; the brief's measure of that token is still owed).

**The cost, as built** (`out/timings-after-V7-1.txt`, `out/measures-V7-1.txt`; PostgreSQL 16.15, nothing else running):
the reader's 300 KB row (600 houses hidden whole, 10,000 strings, no reveal), three runs: the frozen 211 alone 1,315 /
1,160 / 1,293 ms, 001..212 1,354 / 1,180 / 1,489 ms (the law: no more than twice). 3,000 deep under Reveal DM: 36 / 34
/ 34 ms against 34 / 40 / 42 ms (at 4f7c60cbb: `stack depth limit exceeded`). With NO reveal, 300 and 400 deep both
chains serve and 3,000 deep both raise alike (the sanitiser's own walk, before the veil: not 212's). 200 x 5,000: 445 against 435 ms. The
search for one name is built in 1.1 ms, for 600 in 14 ms; the 198 KB text of that row's 10,000 strings is asked in 41 ms. Beyond the
reader's rows: 1,200 names of three words each and 300 open names, built in 91 ms; a 198 KB text asked in 172 ms with
no hit, 279 ms with one; the walk to one hit among 10,000 strings, 278 ms.

**The acceptance run at these bytes** (`out/run-all-after-V7-1.txt`): 37 checks, **30 pass, 7 fail**; the twin differs
on 0 of 15 shares; the deep row and both large rows pass. Red still, each the next commits': a07 (V7-5: a renamed
house with no catalogue identity, its birth name in the trace), d06 (V7-8: `hasGuild`, `hasChurch`), e02 to e06 (V7-2:
the five second homes of a source amended after the birth). **The rollback, rehearsed at these bytes**
(`out/rollback-rehearsal-V7-1.txt`): 212 twice, its down file twice, 212 again, on a copy of the 211 chain: 0 lines of
the catalogue differ at each step; 65 helpers, 65 immutable, none a definer, none callable by a reader role.

**The lane's pins at these bytes** (`out/pins-V7-1.txt`): galleryVeilCures, pgliteHookTimeoutRatchet,
galleryMapMemberCount, gallerySanitizer, migrationSearchPathPin, migrationGrantPosturePin: green. galleryServerVeil: the
same six arms red as at 4f7c60cbb, every path printed a tie's role copy; one path of the print moved (town-2). Not
touched. **The owner's pack `veil-212/` names the eighth seat's helpers: more out of date than before; not touched.**

## 5. Rows left outside the law (PART 9's list, PART 10's, kept current)

PART 9 section 3's rows stand as PART 10 left them (C1, C3 pending the measure the brief orders for the trace's
camel-case token, C4, C5, the joined role word, the five rows of REVIEW-VEIL-6 section 2.5). New here: V7-3's shared-id
row (section 3); and section 4's rows for the owner's veto and its list outside the law (the name search as built),
first among them the ruling owed on a shown power whose name is a hidden house's.

## 6. The rulings worked to

The brief (BRIEF-VEIL-10.md, on the chair's lane) carries them whole: THE DESIGN, RULED (i) to (vi) (the chair's record
of 2026-11-14 00:18 UTC, "THE SECURITY READER'S WRITTEN ANSWER"); the work's order (V7-3, V7-1, V7-2, then the rest);
the acceptance run ruled ("THE SECURITY READ OF 212 FILED"); BRIEF-VEIL-9 as this seat's own brief; records 411, 414,
418, 420 (CHAIR-HANDOFF-FOURTH section 4). No ruling has reached this seat by message.
