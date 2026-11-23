# DAILY-3 · B3 L8 — five `office:` atoms (lazy) and legitimacy L8 to L12 (the chair's E72 and E82, 2026-11-22)

Read whole, once: this file; `CLAUDE.md`; `briefs/B-BUILD-COMMON.md` items 6 to 11 (item 2 does not bind);
`measures/OFFICE/office.out.txt` (summary sections) and `measures/OFFICE/measure.office.mjs` (the reader it used); the
commit message of 7f4fbd51f (E2: the resentments route); `src/data/dailyLife/commonerResentments.js`;
`src/domain/seat/seatTable.js`; `src/domain/rulingPower.js :: governingFactionOf, nameOf`; in
`src/domain/facts/factVocabulary.js` the `ruler`, `government named` and `house` dims and how an atom family with a
getter home is declared; `src/domain/facts/factsOf.js` (its header and one getter); `vite.config.js ::
FIRSTPAINT2_LAZY_DOMAIN` and the lazy pins `factHomesLazy` keeps; `lines/L2/LINES-2.md` § 2 legitimacy #8 to #12.
Paths under `docs/chair/2026-11-20/content/daily/` unless rooted. Nothing wider.

## Where you work
Worktree `/home/user/wt-daily3-l8`, branch `lane/daily-3-2026-11-22-l8-wip`, cut from the lane at 03f67a396 (the line's
point 97 merged). Trailer `Claude-Session: https://claude.ai/code/session_01ACmDYYZpEdm9Ag2ikDGTf9`. You commit; you do
NOT push or merge. Another builder (4b) works beside you on the Daily Life tab, the store and their registers: never touch
`src/components/**`, `src/store/**`, `src/domain/dailyLife.js`.

## The ruling, exactly (E82)
1. FIVE ATOMS, one family `office`: `office: elders`, `office: headman`, `office: mayor`, `office: reeve`,
   `office: lord's steward`. THE HOME: the governing ROW's form (`rulingPower.js :: nameOf(governingFactionOf(record))`,
   the read `holderOf` makes) through `seatTable.js :: formKindOf` (row `government`; row `noble` for the steward); NEVER
   `powerStructure.government`, NEVER a name test on a label (ruling 10). THE MAP (frozen, key -> forms) lives in a NEW
   LAZY LEAF under `src/domain/facts/` (e.g. `officeForms.js`), pinned lazy where the lazy pins are kept (its door):
   elders = {Elder Council, Free Elder Council, Elder Consensus, Household Council}; headman = {Headman's Authority};
   mayor = {Town Mayor}; reeve = {Elected Reeve}; lord's steward = {Feudal Stewardship} (NOT Feudal Appointee). A test pins
   each form as a key of its row in `SEAT_TABLE`.
2. THE VOCABULARY declares `office` BY NAME with its five keys (the eager file stays import-free of the leaf); the code
   that answers it (a `factsOf` getter or the vocabulary's own lazy reader, as the `house` family does) imports the leaf
   on the LAZY side. WORDING (each a comment line beside the key): `ATOM office: <key> : seat (seatTable.js :: formKindOf)
   : the place is governed by the <key>'s form ({forms})`. Each atom row is LISTED for the join in your commit message.
3. FAIL CLOSED: where the governing row is absent or hidden (a shared read drops a row stamped `hidden: true`), the atom
   is FALSE. Dark and lit read the same (the office, not the holder). NOT hideable by an owner (a faction card's floor
   keeps its name and `isGoverning`; the infiltrator in `generators/power/stressFactions.js` is the one writer of
   `hidden: true`): say so in the vocabulary comment for the veil's reader.
4. THE LINES, VERBATIM from LINES-2 § 2 legitimacy, ids `L8` to `L12`, each with its one need: L8 `office: elders`, L9
   `office: headman`, L10 `office: mayor`, L11 `office: reeve`, L12 `office: lord's steward`. Remove the file header's NOT
   BUILT note for them. A walker that strikes a line: STOP and report it (never an exemption, never your rewording).
5. RED FIRST, then green: a test (new file, basename outside the mutation-manifest pattern list; 5 a size) that the
   five atoms read the table's forms and are false where the row is absent or hidden; that L8..L12 are in the pool with
   their needs and print only where their office holds; red before the code. GREEN: your test; `tests/domain/dailyLife*`;
   `tests/domain/facts` WHOLE (a facts file is touched); every test that names `factVocabulary` or the new leaf (grep);
   `tests/lint` WHOLE; eslint; both typechecks; every heavy run through `sh scripts/gate-mutex.sh --run -- <cmd>` (exit 3
   = gave up waiting: run again). Known reds: `RED-AT-LINE.96.tsv` beside the hand-back (and the lighting census:
   DAILY-3's). Registers, class tables' doors and the sameness house readings by their own doors.
6. MEASURE once, into `measures/B3/L8/` (F1's `measure.f1.mjs` shape): on the 900, `commoner_resentments`: top sentence %
   by size (the chair's condition 6: THORP stood at 17% with "Talk among neighbours turns, sooner or later, to what the
   Elder Council has got wrong lately."), EMPTY by size, L8..L12's share by size, false 0 (a line printed where its office
   does not hold), and the five atoms' share by size beside `measures/OFFICE`'s.

## Files you may touch
NEW `src/domain/facts/<leaf>.js`; `src/domain/facts/factVocabulary.js` (the `office` family only); `src/domain/facts/
factsOf.js` (one getter, if that is the route); `src/domain/facts/factLayers.js` (its row for the new home, if its walker
asks); `vite.config.js` (the lazy pin for the leaf only) and the lazy-pin list's own file if separate;
`src/data/dailyLife/commonerResentments.js`; your NEW test file; the presumption registers, `tests/lint/samenessHideable.
houseReadings.json` and any class-table row a walker asks for BY ITS DOOR (each named); `measures/B3/L8/`.

Final message: at most 250 words plus one table (L8..L12 share by size, false; thorp's top before/after): commit shas;
red and green with `tests/lint` whole's failing titles by name; the atom rows for the join; the lazy pin.
