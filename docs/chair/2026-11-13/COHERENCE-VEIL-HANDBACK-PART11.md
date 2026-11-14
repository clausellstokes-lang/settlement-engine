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

## 4. THE DESIGN OF THE NAME SEARCH, as this seat will build it (design (ii); V7-1, V7-4, V7-6, V7-7, V7-9, V7-10)

Written down before it is built, so a successor can finish it. Nothing below is in the bytes yet.

1. **One fold, both engines, every script, no reliance on `lower()` / `toLowerCase()` or on a locale.** A SEPARATOR is a
   character of one explicit set of code points (every ASCII character that is not a letter or digit; U+0080 to U+00BF,
   U+00D7, U+00F7; U+2000 to U+206F; U+2E00 to U+2E7F; U+3000 to U+303F; U+FE30 to U+FE6F; U+FEFF; the full-width
   punctuation of U+FF00 to U+FF65). EVERYTHING ELSE IS KEPT, so a name of symbols only, or in a script with no case
   and no spaces, is matched as written. The fold of a text: (non-ASCII text only) NFKC, then the combining marks
   U+0300 to U+036F removed; A-Z lowered by an explicit map; every run of separators one `_`.
2. **Case outside ASCII lives in the NEEDLE, not in the text.** Each letter of a hidden name that has case variants is
   written in the pattern as a bracket of its variants, from ONE explicit table of pairs carried as the same literal in
   both engines (generated once from Unicode's simple lower-case map, with U+0130 as i, U+212A as k, final sigma as
   sigma, sharp s as ss). No text is ever case-mapped by an engine's own function outside A-Z.
3. **One search a string for all hidden names at once:** one alternation, `(^|_)(n1|n2|...)(e?s)?(_|$)` on the folded
   text, each name's words joined by `_?` (so the squeezed and camel-cased spellings are the same needle). A house's
   names: its name, its label where it has no name, the name without its bracketed qualifier, the name it was born with
   (its catalogue identity), each processing name only it answers to. A name whose fold is empty (separators only) is
   searched as written.
4. **Keys as well as values;** an id and a join are strings like any other (no `from` / `to` / `id` exemption). FLOORS,
   never taken: the town's own `name`; the `id` and `name` of a house still listed; a shown power's `faction` / `name`.
   An open name that holds a hidden one is blanked before the search (longest first), so `Black market bazaar` is not
   `Black market`. An entry of a list whose own `id` or `name` is taken leaves the list whole (no record without a name).
5. **The whole text is asked first** (the document's text with its escapes neutralised, folded once): no hit, no walk.
   **The walk is iterative** (211's `_gallery_veil_drop_hooks` shape: only the nodes on the way to a hit are rebuilt),
   bounded at 64 levels: a container at the bound whose text holds a name is withheld whole (the closed answer).
6. **By identity before any of this** (design (i)): the lists (done), every existence flag, the income row by its
   house, the trace by its house, the annotation by its event, a tie's copy by its person; the second homes by their
   source's identity (V7-2).

## 5. Rows left outside the law (PART 9's list, PART 10's, kept current)

PART 9 section 3's rows stand as PART 10 left them (C1, C3 pending the measure the brief orders for the trace's
camel-case token, C4, C5, the joined role word, the five rows of REVIEW-VEIL-6 section 2.5). New here: V7-3's shared-id
row (section 3).

## 6. The rulings worked to

The brief (BRIEF-VEIL-10.md, on the chair's lane) carries them whole: THE DESIGN, RULED (i) to (vi) (the chair's record
of 2026-11-14 00:18 UTC, "THE SECURITY READER'S WRITTEN ANSWER"); the work's order (V7-3, V7-1, V7-2, then the rest);
the acceptance run ruled ("THE SECURITY READ OF 212 FILED"); BRIEF-VEIL-9 as this seat's own brief; records 411, 414,
418, 420 (CHAIR-HANDOFF-FOURTH section 4). No ruling has reached this seat by message.
