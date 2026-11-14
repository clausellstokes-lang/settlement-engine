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
| 212 after V7-2 (a second home by identity) | `70810c2a1839a3534370ccf091bdb13eb41b0a95f7c096369651b5e40313ef1e` / down unchanged `d99237b4b71e2c734f83b8b5cda15f201a85e4902ab05a7e4503d51620458a7b` (no helper added, removed or re-signed) |

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
| **V7-2** a second home follows its source's eye BY IDENTITY, never by matching text (section 9) | `_gallery_veil_card` (the impression), `_gallery_veil_sources` (every tie with its two eyes, any shut tension, every event with its lasting-effects eye), `_gallery_veil_second_homes` (the composed homes), `_gallery_veil_embeds` (the words, both directions): restated, none re-signed | `gallerySecondHomes.js` (`withholdImpression`, `annotationEventShut`, `secondHomeSources`, `withholdSecondHomes`, `embedsAny`), rule for rule | `galleryVeilHandRows.pglite.test.js`, three new arms of the builder's own plants (THE FIVE HOMES, THE PRESSURE SENTENCE, NO EVENT NO TIE; server against twin on each: 0 paths): `out/hand-V7-2-red-at-1e5832dda.txt` (3 of 3 red: 240, 168 and 120 lines, no control among them) -> `out/guards-green-V7-2.txt` (the three guard files, 46 of 46; the three gates) |

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
first among them the ruling owed on a shown power whose name is a hidden house's. And section 9's: the rows where only
the words tie a copy to its source, the prices and faults of the identity rule for the owner's veto, and its limits.

## 6. The rulings worked to

The brief (BRIEF-VEIL-10.md, on the chair's lane) carries them whole: THE DESIGN, RULED (i) to (vi) (the chair's record
of 2026-11-14 00:18 UTC, "THE SECURITY READER'S WRITTEN ANSWER"); the work's order (V7-3, V7-1, V7-2, then the rest);
the acceptance run ruled ("THE SECURITY READ OF 212 FILED"); BRIEF-VEIL-9 as this seat's own brief; records 411, 414,
418, 420 (CHAIR-HANDOFF-FOURTH section 4). No ruling has reached this seat by message.

## 7. How this seat worked, and what it has and has not verified itself

- V7-3 was built by the seat. V7-1 (5abf99906) was built by a builder the seat started inside its own session, with a
  fresh context and a written sub-brief (the design of section 4 as first written, the laws of the lane, no push); the
  seat pushed its commit. The harness reports that builder used 589 thousand tokens in all (122 tool calls, 93 minutes).
- EXECUTED BY THE SEAT on 5abf99906's bytes: the four checksums; the reader's `run-all.sh`
  (`out/run-all-seat-at-5abf99906.txt`: 37 checks, 30 pass, 7 fail, namely a07, d06, e02 to e06; server against twin
  equal on 15 of 15 shares; 3,000 deep 31 ms on 211 against 38 ms; 200 x 5,000: 386 against 412 ms; 600 x 10,000:
  1,241 against 1,305 ms); the hand-row guard, 6 of 6.
- **NOT DONE BY THE SEAT: the builder's SQL and twin were not read line by line by the seat** (its context mark). The
  builder's own claims that the seat did not repeat: the fold equal for all 1,112,063 code points; the rollback
  rehearsal (0 lines); gallerySecondHomes 5 of 5; the born-town comparison. A successor's first act is to read 212
  section 4c and `gallerySecondHomes.js :: THE NAME SEARCH` whole.
- V7-2 (section 9) was built by a second builder the seat started the same way (the sub-brief `SUB-BRIEF-V7-2.md`);
  every figure of section 9 is that builder's, EXECUTED by it unless the line says otherwise. What the seat itself has
  run or read of it is the seat's to add here.
- galleryServerVeil: the builder reports the same six arms red as at 4f7c60cbb, with ONE PRINTED PATH MOVED in town-2
  (its cause, a role "the fence", is PLAUSIBLE, not executed): to be classed at item 3 (a) before the pin is re-keyed.

## 8. The measure the brief orders for V7-4's trace token (executed by the seat; `out/trace-token-240-born.txt`)

240 towns born at this tip (six sizes, calm and infiltrated, 20 seeds each; `measure/trace-token.probe.jsx`), every
string of `simulationTrace[]` that spells a house name of any of those towns when squeezed:
- `simulationTrace[].downstreamEffects[].target = "blackMarket"` (the bare token): **68 towns; in 23 the roster holds
  a house "Black market", in 45 it does not.** It appears with no such house, so by the chair's ruling it is the
  engine's name for a quantity: OUTSIDE the law, listed with both counts. AS BUILT, the name search takes it where a
  house "Black market" is hidden whole (its squeezed spelling), and nowhere else: more than the law asks, and what the
  reader's born run expects as green (its `names-anyform` allows the two schema keys only). For the chair's veto.
- `targetId = "institution.<snake>"`: for the criminal houses always with its house (black_market 30 / 0,
  smuggling_network 66 / 0, assassins_guild 23 / 0, thieves_guild_powerful 16 / 0, ...): the house's own entry, by
  identity. But NOT every `targetId` has a house on the roster: `institution.black_market_bazaar` 21 with / 15
  without, `institution.rookery` 10 / 27 (an entry for a house the birth weighed and did not keep). So the trace BY
  POSITIVE ACCOUNT (the only rule that answers V7-5's renamed house, whose record keeps nothing of its birth name)
  will also drop such entries on a Reveal-DM share that hides some house whole: to be counted when it is built.
- `downstreamEffects[].target = "institution.<snake>"`: mixed (smelter 51 / 74, mill 5 / 63, sawmill 2 / 82): a join
  to a house where one stands; the name search takes it where that house is hidden whole.

## 9. THE SECOND HOMES, BY IDENTITY, AS BUILT (design (i); V7-2; the chair's record 418)

The earlier rules asked whether a home's WORDS still held the hidden sentence, so a source amended after the birth left
its born wording in the home. Each composed home now follows the eye of the source its composer built it from, found
by what the record says, in migration 212 and in the twin alike. Nothing of the name search, the derived lists, the
flags, the income rows or the trace is touched. The measure is `out/second-homes-cost-V7-2.txt` (the twin, base
1e5832dda against these bytes; probes in `measure/second-homes-*.{probe.jsx,diff.mjs}`): **guard** = the four born
towns of `gallerySecondHomes.pglite.test.js :: TOWNS`, both stored shapes, the reveal off and on (16 projections);
**wide** = 240 born towns, new shape, reveal off. With the DEFAULT veil no home's count moves (guard and wide: 0).

| Home | What its composer builds it from | Its identity and its rule | Every eye shut: sent before -> after (wide; guard) |
|---|---|---|---|
| `history.legacyAnnotations[].annotation` | `legacyGenerator.js :: annotationBody`: its event's name and years (floor), fixed words by the event's type, and the event's FIRST lasting effect | ITS ENTRY'S EVENT (the entry keeps `eventName`, `eventType`, `yearsAgo`; the record register keys it so): the event of the same name (`event` in an older spelling); none, the one of the same type and years; none, every event (closed). Withheld when that event's lasting-effects eye is shut. And by the words, both directions, against every shut string of any event | 105 -> 4; 12 -> 0. 370 of 475 went before by the words. PRICE 101 (12): entries that hold no lasting effect at all (their event has none) |
| `history.siegeNarrative` | `siegeCapability.js`: a recent event's name (floor) and the FIRST current tension's description | no mark of which tension: withheld when ANY current tension's description eye is shut (the words can add nothing) | 0 -> 0; 0 -> 0 |
| `prominentRelationship.full / .tension / .phrasing` | `settlementNarrative.js :: genRelNarrative`: ONE tie: its two ends and type, its description, its tension, a phrasing written from the tension (125 of 125) or from the description's tail | ITS TIE: the same two ends and type, or a copy still equal to its text; none, every tie (closed). `full` by the description eye, `tension` by the tension eye, `phrasing` by either unless it IS the tension as that stands with its eye open | 9 -> 0 each; 0 -> 0: the 9 are ORPHANS (below) |
| `pressureSentence` | `generatePressureSentence`: the first of the stress's line, the succession line, a tie's phrasing (a draw of its own: ANY tie), `powerStructure.recentConflict`, a small place's line | the record ties it to no one tie. (1) BY ITS ENDS: the tie whose two names it holds (26 of the 27 born from a tie), as the phrasing. (2) NO OTHER ACCOUNT: it names no tie's two ends, the town is under no stress and it is not `recentConflict`: any tie's shut eye. (3) THE WORDS, both directions, on the ties as they stand and on the stored wording (`prominentRelationship.full / .tension`, the tie's text as born) | 213 -> 208; 16 -> 16. FAULT 5: the succession line of a town under no stress |
| `<person>.presentation.impression` | `npcGenerator.js`: a line of the title's own pool, else of the category's: NOTHING of the card | ITS PERSON: withheld when that person's appearance eye is shut | 7,010 -> 0; 928 -> 0. PRICE: all of them |

**Where only the words tie a copy to its source (listed, with counts on the 240):**
- a `pressureSentence` that names no tie's two ends in a town under a stress (169) or equal to `recentConflict` (39):
  208 of 240. None of them is a tie's phrasing as born (0 of 208). Matched in both directions, current and stored.
- an annotation against its own event's description and hooks and against another event's strings (the default veil
  shuts every event's hooks: 0 of 475 annotations go by it).
- an impression against ANOTHER person's appearance is not matched at all (PART 7's row, unchanged).

**For the owner's veto (each a count on born towns):**
1. THE IMPRESSION: every impression (7,010 of 7,011; guard 928 of 928) goes where its person's appearance eye is shut,
   and the composer never builds it from the appearance (1 of 7,011 holds a string of its own person's appearance).
   Built as ruled (the impression by its person). The other reading, the words alone in both directions, keeps them
   and leaves the reader's e06 red.
2. An annotation that holds no lasting effect goes with its event's eye: 101 of 105.
3. `pressureSentence` with no other account: 5 of 240 towns lose a succession line where any tie's eye is shut.
   Without that rule the reader's e05 stays red (its sentence names neither end in full; the record gives it no tie).
   The rule "any shut tie takes the sentence" alone would take 213 of 240.
4. THE DESCRIPTION'S EYE ALONE (the ties' description switch, the tension open): a phrasing in the composer's third
   form (the two names, the type's gloss, then the tension) goes though it was built from the open tension: 23 of 125
   `prominentRelationship.phrasing` (guard: the one town that has it), 9 of the 27 tie-built sentences (a tenth, which
   names one end, goes by rule (2)); the phrasing that IS the tension stays (93; 17). The record cannot tell that head from one written by hand (the owner edits both
   fields: `settlementPendingEdits.js`). The cure, not built: the engine's gloss table (`settlementNarrative.js ::
   TIE_GLOSS`, 18 glosses and a default) carried by both engines; a drifted copy would only withhold more.
5. The narrative goes with ANY shut tension: 11 of the 26 towns that have one have more than one tension, so a
   per-card eye on another tension than the first takes a narrative whose own tension is open.
6. A copy whose source the record does not name follows every event's, every tie's eye.

**Limits (outside the law, listed):** a person renamed after the birth whose tie is then rewritten (the sentence keeps
the old names: words only); an open event later given a hidden event's birth name takes that entry; a stress put on a
town after its birth, where the sentence was a tie's and names one end; `yearsAgo` beyond a double's precision (the
engines compare numbers differently there); an anonymous legacy event (the server reads it closed, the twin by its
hash: as before).

**FOUND BY THE MEASURE, NOT TOUCHED (not the veil's):** on a PUBLIC projection the sanitiser drops a tie flagged
`covert` from `relationships[]` (`publicSafe.js`, COVERT DROP), and `prominentRelationship` still tells that tie: its
two names, its type, its description, its tension and the phrasing: 9 of the 125 born towns that have one (types seen:
"The Patron No One Names", "Silent Partnership"). With the default veil it is sent as before this commit; where any
tie's eye is shut the closed rule now takes it (the 9 above). EXECUTED on the twin's projection; the server's
sanitiser is PLAUSIBLY the same (not run).

**The editor (read, not run):** the owner edits `pressureSentence` and `prominentRelationship.phrasing` by hand; no
writer recomposes a second home when its source is edited; a history reroll mints the narrative and the annotations
again (`settlementRegenAction.js`).

**At these bytes:** the acceptance run (`out/run-all-after-V7-2.txt`): 37 checks, **35 pass, 2 fail**: a07 (V7-5) and
d06 (V7-8), the next commits'; e01 to e07 pass; the twin differs on 0 of 15 shares; 3,000 deep 38 ms on 211 against
43 ms; 200 x 5,000: 387 against 376 ms; 600 x 10,000: 1,298 against 1,230 ms. The guards (`out/guards-green-V7-2.txt`):
galleryVeilHandRows 9 of 9, gallerySecondHomes 5 of 5, galleryVeilCures 32 of 32; gates `typecheck:domain:strict` 0
(1,113), `typecheck:ratchet` 0 (167), eslint 0, each through `scripts/gate-tail.sh`. The rollback, rehearsed
(`out/rollback-rehearsal-V7-2.txt`): 212 twice, its down file twice, 212 again: 0 lines of the catalogue differ at each
step; 65 helpers, 65 immutable, none a definer, none callable by a reader role. The lane's pins (`out/pins-V7-2.txt`):
galleryServerVeil the same six arms red (every one of its 17 printed paths a tie's role copy or its "(order or value)"
line), not touched; twelve other files green.
