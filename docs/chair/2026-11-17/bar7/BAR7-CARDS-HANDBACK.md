# BAR7-CARDS · HAND-BACK · a person's card says its house's state once; the PDF prints what the tabs print (LAW 8: 8h)

Seat BAR7-CARDS of BRIEF-BAR7 (the chair's lane, `docs/chair/2026-11-14/briefs/BRIEF-BAR7.md`). Base: the joined line
`lane/join-2026-11-14` at **7e4a64a19** (the tip I was given; unchanged when I started). Branch `lane/bar7-cards-2026-11-17`.
All work in scratch worktrees; every render outside every tree (PAGE-COPY's `census3.sh --count-only`), measured with the
auditor's runner `docs/chair/2026-11-17/bar7/AUDIT/runH.mjs`. **The journal's own file is not mine**: it prints no dealing
line (see LEFT, item 1).

## 1. THE RULES (runH.mjs; instances, towns in brackets)

| rule | 30 before → after | 150 before → after | 720 before → after |
| --- | --- | --- | --- |
| 8h.deal | 56 (18) → 0 | 258 (89) → 0 | 1,028 (386) → 0 |
| 8h.deal.mild | 22 (9) → 0 | 103 (36) → 0 | 154 (57) → 0 |
| 8h.secret | 65 (18) → 0 | 309 (84) → 0 | 1,492 (402) → 0 |
| 8h.secret.mild | 25 (8) → 0 | 74 (24) → 0 | 155 (49) → 0 |
| 8h.wants | 3 (2) → 0 | 23 (16) → 0 | 74 (63) → 0 |
| 8h.wants.mild | 3 (2) → 0 | 12 (8) → 0 | 19 (15) → 0 |
| **8h, all** | **174 → 0** | **779 → 0** | **2,922 → 0** |
| every other rule of runH (8f … 8k) | unchanged, row by row | unchanged, row by row | unchanged, row by row |
| LAW 8 widened, all its rules | 191 → 17 | 812 → 33 | 3,073 → 151 |
| the mark set IN FRONT of "How they deal" (the broken form, 25 LOW rows) | 36 → 0 | 126 → 0 | 550 → 0 |
| keepers of a marked house whose card carries the mark line under the house line | 0 → 146 (25 towns) | 0 → 622 (110 towns) | 0 → 2,139 (478 towns) |
| a card with two mark lines | 0 → 0 | 0 → 0 | 0 → 0 |
| PDF full cards printing the mark line (`== PDF/NotableNPCs ==`) | 0 → 14 | 0 → 54 | 0 → 141 |
| item 3: the PDF's impaired list ≠ the tab's (view model, over the stored records) | — | 16 → 0 | 11 → 0 |
| item 3: the PDF's bullet printed where the tab drops the line (the page) | 0 → 0 | 2 → 0 | 1 → 0 |

THE RENDERS: base and tip, the same three populations (the thirty `bar0-<shape>-rand-42..44`, the 150 `rand-27..41`, the
census's 720 `seeds.txt`). One render worker of the base 720 died (a vitest pool timeout under load: 604 of 720 dumps);
its 116 seeds were rendered again from the same tree and merged (the corpus held all 720 births). Every base figure above
reproduces the auditor's at cfc2b680a (2,922 / 779 over the 720 / 150; 550 front marks; 2,139 keepers). Item 3's view-model
row is a probe over the stored records (`buildViewModel` against the record's list filtered by `rowMarkText`); it
reproduces the seam's 16 and 11 exactly.

THE GUARD: `tests/components/bar7CardsMarkOnce.test.jsx` (new, mine), three arms over six fixed towns (the controls' towns
of C2524, C8842, C43844, C37251 and the Outlook's two disagreeing towns, bar0-city-under_siege+famine-rand-34 and
bar0-hamlet-under_siege-rand-35). It reads only the leaf (`rowMarkText`) and the roster (`cardHouseOf`), never my helpers.
RED at 7e4a64a19 on substance (arm 1: 5 of 6 towns; arm 2: 5 of 6; arm 3: 2 of 6), GREEN at my tip:
1. the tab's card: every keeper of a marked house carries the mark once, as a line of its own (`npc-house-mark`), and no
   "How they deal" opens with it; a keeper of an unmarked house has no mark line;
2. the PDF: every person row of the view model carries the leaf's mark of its house (`houseMark`), and every full card of
   such a person prints it once, straight under its house line (each person rendered as a full card); no dealing opens
   with a mark;
3. the PDF's Outlook list names only the houses the leaf marks, recounted (the tab's reading).

## 2. THE CONTROLS (the sixth read's 8h rows; tip dumps of the thirty)

| control | town | verdict at base | at my tip |
| --- | --- | --- | --- |
| C2524 (toll-keeper) | bar0-city-under_siege+famine-rand-42 | STANDS | **CHANGED**: the card prints "Toll bridge · member of Arcane Council" / "Stopped by the siege." / "Toll-Keeper" / … "How they deal Takes the toll and lifts the gate; …" (runH: clear) |
| C8842 (stablemaster) | bar0-city-under_siege+famine-rand-44 | STANDS | **CHANGED**: "Stable district · member of Grain Holders" / "Stopped by the siege." / "Stablemaster" (clear) |
| C43844 (sawyer) | bar0-village-calm-rand-44 | STANDS | **CHANGED**: "Sawmill · member of Merchant Guilds" / "Short of timber." / "Master Sawyer" (clear) |
| C37251 (explained) | bar0-town-calm-rand-44 | EXPLAINED | **still prints**, as written: "How they deal Sells by the sack and the cart; the price goes up before winter." under "Salt works · …" / "Short of salt." (the mark leaves the front of the sentence for the card's line) |

The runner exits 3 on the thirty at my tip ("controls off: 3"): its exit 3 flags a STANDS control no longer found, which
is these three, cured as the brief asks. Every other control of the runner reads as at base.

## 3. THE LINES A READER CAN SEE (new or changed)

- **NEW, the NPC tab's card**: the house's mark ("Stopped by the siege.", "Curtailed by the siege.", "Scarce in the
  famine.", "Short of timber.", "Curtailed by the siege. Short of iron ore.") as its own line straight under the house line,
  every keeper of a house the leaf marks. Towns: bar0-city-under_siege+famine-rand-42, bar0-village-calm-rand-44,
  bar0-town-calm-rand-44 (and the 622 cards of the 150).
- **CHANGED, the NPC tab's card**: "How they deal" prints `presentation.behaviour` as drawn; the mark that stood in front
  of 126 trade lines of the 150 is gone (the same towns).
- **NEW, the PDF's full person card (Notable NPCs)**: the same mark, one line under the house line. Towns:
  bar0-hamlet-calm-rand-27 ("Dairy farmer · second of Free Elder Council" / "Short of livestock."),
  bar0-hamlet-calm-rand-29 ("Charcoal burner" / "Short of timber."), bar0-city-under_siege+famine-rand-38
  ("Mine · member of Merchant oligarchy" / "Curtailed by the siege.").
- **CHANGED, the PDF's Viability chapter, ACTIVE STRESS EFFECTS**: the bullet "Siege: Supply Chain Disruption" is no longer
  printed where the Outlook tab drops its impaired list because the leaf marks none of its houses:
  bar0-hamlet-under_siege-rand-35, bar0-hamlet-under_siege-rand-39 (the 150), r2s-under_siege-village-3 (the 720). Where it prints, its
  view-model description is the tab's list. NOTE FOR THE OWNER: the PDF prints that item's TITLE only, never its list
  (`ViabilityAssessment.jsx` renders `label(c)`); the seam's "16 of 150" was the view model's names, which no page
  printed. They now agree (16 → 0), and the one place the page could show the difference, the bullet, agrees too.

## 4. MY CURES, ITEM BY ITEM

1. **The card line** (`src/components/new/npcComponents.jsx`). `dealingShown` sets nothing in front of a sentence (it
   returns the drawn line; the twelve verbs `TRADE_LINE` are gone with the front form). New `houseMarkShown(npc,
   settlement)`: the card's house (`cardHouseOf`) → its roster row → `rowMarkText(settlement, 'house', row)`, the one leaf,
   no second reading; printed as `npc-house-mark` straight under the house line, inside the card's line block, before
   the honorific. Ruling CM1.
2. **The PDF's person card** (`src/pdf/lib/viewModel.js`: a `houseMark` key on the view row beside `house`, from the same
   leaf by the same roster lookup; `src/pdf/sections/NotableNPCs.jsx`: a line under the house line). `dealing:` keeps the
   raw line (it never carried a mark). The PDF's compact cards and name grid print no house line and no person sentence,
   so they take no mark.
3. **The Outlook list** (new leaf `src/domain/display/impairedListShown.js`: `IMPAIRED_LIST`, `impairedListMarked` moved
   unchanged from `ViabilityTab.jsx`, plus `stressEffectsShown(effects, s)`; `ViabilityTab.jsx` imports it;
   `viewModel.js :: viabilitySlice` reads it). One reading.
4. **The two red PDF files**, case by case:
   - `tailExportsPdf2Batch2.test.jsx` **E17/house** and **E17/pill** (r2s-under_siege-town-2): **the anchor made untrue by a
     declared cure, not a PDF fault.** The PDF's Institutions and Services chapters do print the siege's head line; the
     leaf's `ordinaryTimesLine` (the tabs' own) now ends it, on the same line, with its second cause's sentence ("A row
     marked short is what its house makes when supplied."), because the town's Tanners and Cobbler's guild are short of
     hides (ruling E22's reading). `HEAD_SIEGE`'s `$` failed. Measured: no other siege town of the 720 (24 forced, 7 drawn)
     prints the bare line beside a curtailed inn row or a stopped Accommodation pill, so the claim stays on its town,
     re-keyed to the line whole as the leaf prints it (`HEAD_SIEGE_SUPPLIED`, the same `^…$` literal form), dated note.
     E17/income keeps the bare `HEAD_SIEGE` (the economics chapter has no short row there; it passes).
   - `tailExportsPdf3Batch3.test.jsx` **UNSHORT** (both cases, r2s-religious_conversion-hamlet-0): **the anchor made untrue
     by a declared cure, not a PDF fault.** The hamlet's Carpenter (part-time) is short of timber at the base (the same
     born-short reading the file's earlier re-key notes), so its tabs and its PDF print the leaf's mark truly. Re-keyed by
     identity to **r2s-religious_conversion-hamlet-3** (same crisis, same tier; measured over the 24 religious_conversion
     towns: no house short by `housesShortOfInput`, no short mark on either surface by the guard's own regex), dated note.
   - Both files green at my tip (7 of 7).
   - The round before's guard `tests/domain/bar6PeopleLaw10.test.js` (8b.person) is **re-keyed by identity**: the same
     people (a keeper of a marked house whose line offers the trade), the same claim (the card carries the house's mark),
     read on the card's mark line; its positive control asserts the mark line and the sentence as drawn. Dated notes.

## 5. THE NET (each alone, through `scripts/gate-tail.sh`)

| gate | base 7e4a64a19 | my tip |
| --- | --- | --- |
| `npm run typecheck:domain:strict` | ✓ 1113, ceiling 1113 | ✓ 1113, ceiling 1113 |
| `npm run typecheck:ratchet` | OK, 167, ceiling 167 | OK, 167, ceiling 167 |
| `npx eslint` on my changed sources and tests | — | clean (exit 0) |
| `npx vitest run tests/architecture` | 347 passed | 347 passed |
| my guard | RED (3 of 3 arms) | GREEN |
| the rounds before (`bar5*`, `bar6*`, domain and generators) | 1 red: `bar6ScenesGoods.test.js` "each good reads the page's own lists …" | the same 1 red, the same message (named, not chased: BAR7-SCENES' file) |
| `tests/pdf` (all) | 2 files red (item 4: 4 cases) | 76 of 77 green with my cures; the 77th (`tailExportsPdf2Batch2`) green after its re-key (item 4's run: 2 files, 7 of 7) |
| door A `presumption-classes-door.mjs --check` | fresh 3 · stale 143 | fresh 3 · stale 143 (no fresh line of mine) |
| door B `presumed-things-door.mjs --check` | fresh 39 · stale 72 | fresh 39 · stale 72 (no fresh line of mine) |
| `npm run build` + the two build tests | not run: I touched no file under `src/domain/facts/` and no import in one | — |

## 6. DECLARED MOVES AND THE BOOKS

None stored. Every cure is a reading at print: no saved field moves, none of the 525 reference configurations moves, no
new field on the saved record, nothing in `assembleSettlement.js`, `vite.config.js` or `package.json`. No new atom of the
vocabulary. The PDF's view row gains a key `houseMark` (a view model, not the record; `tests/pdf/goldenViewModel.test.js`
green). For the close: a mutation-manifest entry for the new guard, if the close keeps one.

## 7. LEFT, BY NAME

1. **The Foundry journal's person page** (`src/foundry/journalPages.js :: notableNpcPage`) prints "House", "Wants" and
   "Secrets (GM only)" from the same view row and no dealing line, so by my brief it is not my file. It does not print the
   house's mark. The cure is one line there reading the view row's new `houseMark` (e.g. under `kv('House', …)`).
2. **The runner's `title` field** (`law8H.mjs :: readPersons`) reads `L[k + 2]`, which is now the card's mark line; it only
   labels instances and moves no count. A shared tool, not mine.
3. Nothing else of my section is left.

## 8. AFTER THE LANDING (the chair's word, 2026-11-17 about 06:20 UTC; the line at a44495b59)

- `tests/lint/ruinFilterRoster.walker.test.js` (not in either net) named my leaf `impairedListShown.js`: its roster read is a name lookup for the mark leaf. Its row is added to `RUIN_AGNOSTIC_EXEMPT` with that reason, as the chair ruled; nothing else of the walker changes.
- The walker alone at my tip: 11 of 12 green, the compliance test among them. RED: "the scan reads CODE …", `expected 115 to be 113`: the pinned count of readers (an earlier round's reader, already 114 at my base, and mine). It is a stored figure and the close's: not re-pinned.
- At my base the same walker read 11 of 12 (the count red at 114); my leaf added one reader and, before this row, one compliance failure.
- `tests/lint/domainAnyCastBaseline.test.js` (the chair's word, about 06:50 UTC) gave my new leaf `impairedListShown.js` a baseline of 0, and it held 7 `any` holes. It is now typed with no `any` and no behaviour change: the stress effect is `validationOnPage.js :: ViabilityIssue`, the shape `stressEffectsOf` returns, and the leaf declares its own `RosterRow` and `SettlementRecord`, in the form of `crisisStoppedRow.js`. No other file changed.
- That test alone at my tip: 15 of 19 green, and my file is no longer named. Its 4 reds name other files only: `economicsCrisisMarks.js` 1, `factsOf.js` 1, `seatMembers.js` 9, `sovereign.js` 9. None is mine. The other checks at my tip: domain strict ✓ 1113/1113, full-type ratchet OK 167/167 (a first typing tripped it at `viewModel.js`, cured in the leaf), eslint on the leaf clean, my guard 3 of 3.
