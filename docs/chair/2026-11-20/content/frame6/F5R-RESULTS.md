# FRAME-7 · F5R — the seat's holder is a printed line on every framed sheet (results)

Written 2026-11-20T19:57Z (`date -u`) by FRAME-7's builder of F5R on `frame7-f5r` (cut at `90874e392`, C2b and LINT1 merged). The brief is `F5R-SEAT-LINE.md` (the chair's ruling (a), 17:45 UTC; it supersedes F5 of `F1-F5-SHEET-RULINGS.md`). Vetoable by the owner. Scratch (gate logs): `/tmp/claude-0/-home-user-settlement-engine/3a0abab8-982f-5160-bd15-a7106ee48595/scratchpad/F5R/`.

**Instruments** (in `frame6/tools/F5R/`): `f5r.mjs <pool.json> <src/> <out.json>` composes the owner's and a stranger's sheet for every town of the 330-town calm pool, digests both (sha256 of the sheet's JSON, 16 hex) and counts the framed owner sheets whose seat's holder is printed nowhere (no face on a side, no seat line); `F/cmp.mjs` compares two runs; `panel.mjs <pool.json> <src/>` runs Session Mode's panel filter (`SessionMode.jsx`, verbatim) over the framed sheets whose holder stands on no side; `seatroles.mjs` reads the calm seat row's role against the card's `role` and `title`; `six.mjs` writes `F5R-SIX.txt`. The pool: `tools/pool.mjs 55` at the base, tried 484, calm 330. BASE = an archive of `90874e392`'s `src/`. TIP = this commit's `src/`.

## What was built

**The line rides its own field, `sheet.seat`, not `sheet.people`.** `tonightSheet.js :: composeTonightSheet` gains `seat` on the owner's framed sheet only, and only where the holder the calm sheet voices stands on no side: `frameSeatOf(source, frame)` reads `peopleOf(source)`'s own seat row (the calm sheet's composition: his name, his office as that row gives it, with the empty-seat keeper's form, and its source) and returns `{ name, role, sourcePath }`, or null where the calm sheet voices no holder or he is already a face. The key is absent on every other sheet (as `frame` is). `seatLineOf(seat)` is the ONE line, the same words on every surface:

> **Holds the seat: {name}, {office}.** — e.g. frame-calm-city-14: "Holds the seat: Saoirse O'Meara, First Magnate."

Its one word of its own is the sheet's existing label `TONIGHT_COPY.seat` ("Holds the seat", the calm sheet's own label for the same person); no new copy. Printed under the three sides by the three renderers, which the four surfaces mount: `components/TonightSheet.jsx` (a `data-tonight-seat` line under the sides; the Table View and Session Mode both mount it, so `TableView.jsx` and `SessionMode.jsx` are unchanged), `pdf/sections/TonightAtTheTable.jsx` (a Text under the sides), `foundry/journalPages.js` (a paragraph under the sides' list, never a fourth bullet).

**Why its own field (measured, not argued):**
1. **Session Mode.** Its panel ("The people at the table's elbow") skips every name in `sheet.people`. On the 32, the panel shows the holder in **32 of 32** with the own field, and in **0 of 32** with F5's people-riding patch (`panel.mjs` over the base with `f5-domain-only.patch`'s composition applied, against the tip). So ruling 2 holds with `SessionMode.jsx` untouched: the holder is in no framed sheet's people, the panel keeps his card (temperament, want, secret), and the Tonight section prints his line.
2. **The people to voice stay the sides' faces.** The frame's own conditions read `people` as faces (troubleWeight's W4 arm: every person stands on a side; city-14: the people's sides equal the frame's). With the own field the W4 arm does not move (3 towns the patch moved: town-20, town-80, metropolis-51), and city-14's people are unchanged (only its digest moves, by the new key).
3. **The line is not a voiced row.** The ruling asks for who holds the seat, by name and office: one line, not a person's want or secret. A `people` row carries a line, a `says`, a `sameAs`; a renderer printing only part of it would leave the rest composed and unprinted (the very invariant `tonightSheetOnce.test.jsx` "no field the sheet prints is absent…" reds on).

**One hat.** The line reads the calm row's `role`, which on the card is the office the office table writes (`data/officeTitles.js`, a dual-hat leader's `role`; or the seat face's own word, "the governor", "the monarch", "the lord's appointee"); never the card's `title`. On the 32: the card's `title` is a second trade in 24 ("the senior guild master" ×10, "the exchange master" ×6, "the mine captain", "the master smith", "the fishmonger", …); the line names the office in 32 of 32 and that trade in none (the city-14 arm pins it on "the senior guild master").

**The stranger's sheet: no line.** The frame is the owner's alone; a stranger's sheet is today's, whose people to voice already carry the same holder by name and office ("Mayor · Holds the seat", 63 of 63 framed towns). A second line would print him twice; and the seat field is composed only beside a frame, which a stranger never gets. Proved: stranger 330/330 byte for byte; the four stranger arms of `frameSheetRulings.test.js` (no `seat` key, no `frame`, the holder among its people, on the 63).

## The count (pinned on the 63)

Framed owner sheets whose seat's holder is printed nowhere (the calm sheet voices him; he is no face on a side; and, at the tip, no seat line): **32 -> 0**. At the base: W3 16, W2 12, W4 3, W1 1 — hamlet-35, -49; village-20, -58; town-1, -20, -33, -56, -68, -74, -80; city-8, -14, -22, -25, -27, -33, -35, -45, -52, -57; metropolis-8, -19, -21, -22, -48, -51, -56, -57, -59, -64, -68. At the tip: 32 sheets carry `seat`, each equal to the stranger's seat row's name, role and source (32/32); no sheet carries both a face and a seat line (0); the 31 whose holder is a face carry no `seat` key. The 32 lines, by town, close `F5R-SIX.txt`; five of their sheets (one a size, hamlet to metropolis) and one face sheet are printed whole above them. THE THORP HAS NO FRAMED SHEET (thorp 0, hamlet 8, village 15, town 7, city 14, metropolis 19), so none carries the line.

## Proof (a): the digests, base against tip, over the whole pool

`f5r.mjs` at each tree, `F/cmp.mjs`: **stranger 330/330 equal; calm owner 267/267 equal; framed owner 31/63 equal, 32 moved**, the moved set equal to the 32 above (each gains the `seat` key and nothing else: `six.mjs` checks the five it prints, "the sheet gains its seat line and nothing else"). No framed flag moved.

## Proof (b): red first

1. **The composition and the renderers** (`tests/domain/tension/frameSheetRulings.test.js` § F5R and the new `tests/components/tonightSeatLine.test.jsx`, both run with the four `src` files at `90874e392`): **5 failed, 14 passed**. Red: "frame-calm-city-14: the holder, on no side of the crime wave, is the sheet's seat by name and office, in one line"; "over the 63: no framed owner sheet leaves the seat's holder unprinted (32 at the base -> 0)" (the 32 listed); "over the 63: the holder is printed once…"; "frame-calm-city-14: \"Holds the seat: Saoirse O'Meara, First Magnate.\" on the Table View, Session Mode, the PDF and the journal"; "over the 32: each surface prints the holder's one line once…". Green at the base (as they must be): the stranger arm, the Session Mode panel arm (see below), the face sheet and the calm sheet arms, F1 and F2.
2. **The renderers alone** (the tip's `tonightSheet.js`, the three renderers at the base): `tonightSeatLine.test.jsx` **2 failed, 4 passed**, each of the 32 red on all four surfaces ("/ table: []", "/ session: []", "/ pdf: the line prints 0 times", "/ journal: the line prints 0 times").
3. **The panel arm** ("Session Mode's panel keeps the holder visible") is green at the base and at the tip: the base's panel never hid the holder (he was in no `people`). It guards the shape this unit refused: under F5's people-riding composition it is red on 32 of 32 (`panel.mjs`, item 1 of "why its own field").

Green at the tip: the two files **19 passed**.

## Proof (c): the pins

Grep of `tests/` for the sheet's readers (every test file importing `tonightSheet.js`, `TonightSheet.jsx`, `TonightAtTheTable.jsx`, `journalPages.js`, `TableView.jsx` or `SessionMode.jsx`: 75 files) and run whole. ONE pin moved, an owner's framed sheet, by this ruling, re-recorded:
- `tests/domain/tension/troubleWeight.test.js` "frame-calm-city-14: framed by the same crime wave on W2, which outranks W4: it keeps its sheet byte for byte" -> retitled "… its sheet is its pin (moved by FRAME-7 · F5R alone)": `d9c0870f07fe7c2a` -> **`e86b7ab4dfdd0bf8`** (the sheet gains `seat`: Saoirse O'Meara, First Magnate; the chair's condition on its people, unchanged, still asserted; the seat added to the arm). The brief's `8e8c894bfd0c5af0` was the people-riding patch's digest.
- NOT moved: troubleWeight's W4 people arm (town-20, town-80, metropolis-51), which the brief expected to move: the people to voice are unchanged.
- No renderer snapshot of a framed owner sheet exists to move (the 73 other importers green).

Widened, not moved (a guard): `tests/domain/tension/frameWordsLevel.test.jsx` — CF9 (a)'s closed set gains `seat: 'Holds the seat'` (the existing `TONIGHT_COPY.seat`); its no-prose-literal scan reads `frameSeatOf` and `seatLineOf` too; CF9 (c) classifies the seat line on its born pool (the label, then the record's own name and office; 5 of its 14 towns carry a seat line: town-40, town-59, city-38, metropolis-1, metropolis-3).

## Gates

- the two test files: red as above, then 19 passed.
- `tests/domain/tension` whole + `tests/domain/summary` whole + `tests/security/frameShareVeil.test.jsx`: before the re-pin 1 failed (city-14's pin) / 74 passed; after it **11 files, 75 passed**.
- every other test file importing a changed file (73 files, listed by the grep above): **73 passed, 570 passed + 1 expected fail**, 0 failed.
- `npm run typecheck:ratchet` 167/167 (exit 0); `npm run typecheck:domain:strict` 1113/1113 (exit 0); `eslint` on the eight touched files: 0 errors, 0 warnings.
- `tests/lint` whole at the tip: see the last section.

## (d) for the security reader

New on the OWNER's framed sheet only: the key `seat` (`{ name, role, sourcePath }`) and its printed line "Holds the seat: {name}, {office}." on the Table View, Session Mode, the PDF and the Foundry journal. The person and office it names are those the stranger's sheet already prints as its seat row (no new person or word reaches any reader). It is composed only beside a frame, which is composed only for `audience: 'owner'` (the first lock) and only from a record carrying its seed (the second); a stranger's sheet carries no `seat` key (330/330 byte for byte; frameShareVeil's arms green, unchanged). What I would test on a shared path: that no shared projection's Tonight sheet carries `seat` (it cannot without `frame`). Nothing of the security lane was touched.

## tests/lint whole at the tip

`npx vitest run tests/lint` (the tree of this commit, its new test file on disk): **220 files, 2 failed / 218 passed; 3271 tests, 2 failed / 3269 passed**. Both reds are known and FRAME-7's, none this unit's:
- `tuningRegister.walker.test.js` "the measured tree matches the committed inventory exactly": its three rows, `sideArchetypes.js#FRAME_TUNING` (measured, not in the inventory), `crisisCast.js#CRISIS_CAST_TUNING` (dependents moved), `tonightSheet.js#WANT_MAX_WORDS` (dependents moved). No register refrozen.
- `sovereigntyLightingContract.walker.test.js` "THE CENSUS IS AN ASSERTION, NOT A SENTENCE": the estate's file count 3722 -> 3723, by this unit's one new test file (`tests/components/tonightSeatLine.test.jsx`). The census is FRAME-7's door; not re-measured here.
Every other walker green, `writerReach` among them (the renderers' new read of `sheet.seat` reads a field of the composed sheet, not of the record).
