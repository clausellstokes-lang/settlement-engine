# PAGE-1's brief for "THE SIDES AS SHOWN" (written, NOT DISPATCHED until PAGE-2's data file lands)

Written by PAGE-1, 2026-11-20, on the chair's order of 11:58 UTC. It binds one builder under the common law of
`BUILD.md` beside this file: render only, born documents hashed equal at base and tip (the 300 and the census's
720), red first, authored lines to the chair before merge, pinned renders by their own doors, the gates to files.

## Why it is render and not stored

The session sheet's lane reads a tension's STORED side words (`history.currentTensions[].factions`) to find each side's
archetype and face. A stored rename makes a side lose its face (its probe: 21 of 174 framed sides). So the stored
`factions` stay the template's words, and THE WORDS SHOWN ARE RESOLVED AT RENDER. No file under `src/generators/`,
`src/data/historyData.js`, `src/domain/summary/` or `src/domain/tension/` is edited.

## The measure behind it (PAGE-1's helper A, `measures/A/measureA.out.txt` §F2, re-run by
`node docs/chair/2026-11-20/content/page/measures/A/measureA.mjs "$PWD" > docs/chair/2026-11-20/content/page/measures/A/measureA.out.txt 2>&1`)

90.3% of printed sides are template phrases. Of the 412 printed generically that carry a role, 265 (64.3%) could be
named from the record (guilds 73/76, rulers 91/91, criminal 26/33, merchants 17/28, old families 19/53). Sides
presuming a house the town lacks: "Legal class profiting from ambiguity" 5 of 14 drawers lack a court; "Merchants who
benefit from cheap newcomer labour" 5 of 11 lack a market; "Price regulators" 5 of 5; "the merchant class" 3 of 3;
"the criminal network" 22 of 22 have no criminal power; "Local enforcement" 6 of 6 no watch.

## The unit

1. THE DATA: PAGE-2's file of all 87 side slots (what each MEANS, what it PRESUMES, the wording WITHOUT the house).
   PAGE-1 gives you its commit and path; you take it BYTE FOR BYTE (`git show <commit>:<path> > <path>`) and never
   edit it. If a row is wrong, report it; do not mend it.
2. ONE READER, a pure leaf under `src/domain/display/` (no store, no React, no rng): for a tension's side, the words to
   show: (1) where the DOCUMENT IN HAND holds the party the side means, that power's name through
   `src/domain/display/governanceAccount.js :: powerNameInProse` (:53); (2) where the town lacks the house the side
   presumes, the data file's wording that presumes none; (3) else the template's words, byte for byte as today.
3. THE AUDIENCE: the reader reads ONLY the document it is given and holds no second source. A served (shared,
   public, player) document already lacks a withheld power, so a side meaning it falls to (2) or (3). TEST: a served
   document in which the meant power is withheld prints the template's (or the house-free) words, never the name.
4. EVERY SURFACE that prints a side calls the reader. Known so far (measure the rest, and ask PAGE-1 for PAGE-2's
   census of readers): `src/components/new/tabs/HistoryTab.jsx:100-101`, `src/components/new/tabs/OverviewTab.jsx:487-488`,
   the PDF's view model (`src/pdf/lib/viewModel.js` and its body slices), `src/pdf/sections/HistoryFounding.jsx`, the
   Overview PDF (`src/pdf/sections/Overview.jsx`), the Foundry journal if it prints sides (`src/foundry/journalPages.js`).
5. THE GUARD: a test (source scan or render walk) that no surface prints a tension's side except through the reader.
6. The report: "the reader reads only the document in hand and holds no second source", with the test's receipt.

## AMENDED BY PAGE-4, 2026-11-20 16:12 UTC (`date -u`), on the chair's rulings of 13:22 (amended 13:50), 14:23 and 15:10. THIS SECTION GOVERNS WHERE IT DIFFERS FROM THE ABOVE.

THE DATA (replaces point 1): `src/data/tensionSideMeanings.js` and `tests/data/tensionSideMeanings.test.js`, taken BYTE FOR
BYTE from `c5da1cfb3` (`git show c5da1cfb3:<path> > <path>`; that commit is on `origin/lane/page-5-2026-11-20`), never
edited; a wrong row is reported to PAGE-4, not mended. Its HEADER'S RULES 0 TO 4 ARE THE READER'S RULES; read them whole.
THE CENSUS OF SIDE READERS (replaces the "known so far" list of point 4):
`git show 837394d8f:docs/chair/2026-11-20/content/page/SIDE-READERS.md`. Every surface in it that is in THIS LANE'S FILES
(`src/components/`, `src/domain/display/`, `src/pdf/`, `src/foundry/`) calls the reader; a surface in another seat's
files (`src/domain/summary/`, `src/domain/crisis/`, `src/domain/tension/`, the session sheet) is LISTED in your report,
never edited (the session sheet's three side labels call the reader at the join: not yours).

THE READER'S RULES, the chair's (replace point 2):
1. A power's name ONLY through a row's `named` wording, `{power}` filled through
   `governanceAccount.js :: powerNameInProse` (a verb after a name through `src/data/people/powerSentenceName.js ::
   powerVerb`, if any sentence needs one). A row without `named` is never named, whatever its `means`.
2. And ONLY where the document in hand holds EXACTLY ONE power of the kind meant (the ruler: its governing power). Two or
   none: the row's own words (under the header's rule 1).
3. NEVER THE SAME POWER ON TWO SIDES OF ONE TENSION: where it would be, the later side keeps its own words.
4. `presumes` IS CHECKED FIRST: a town lacking the house shows `without`; `without` null DROPS the side.
5. A side the generator wrote over follows the header's rules 2 to 4, rule 3 reading the SLOT row's `without` first.
6. EVERY SIDE AS SHOWN BEGINS WITH A CAPITAL LETTER.
7. The reader reads ONLY the document it is given; a served document lacking a withheld power IS, to the reader, a town
   without that power, and prints exactly what such a town prints. The guard of point 5 stands.

ONE MODULE FOR A TROUBLE'S SIDES AND ITS SENTENCE (the chair, 14:23 and 15:10): a trouble's sentence will come from
PAGE-7's `src/domain/display/tensionCause.js :: tensionCauseSentenceOf(record, tension)` (null: the stored text). It is
NOT part of this unit and you build no pick or predicate; but put the side reader in ONE display module whose shape lets
the same surfaces later take the sentence from the same place (e.g. `tensionShown.js` exporting `tensionSidesShown`),
and say in your report where the sentence's call would sit on each surface.

TESTS, red first, on a MADE-UP roster (never a quoted pool sentence): rules 1, 2 and 3 each; rule 4's drop; rule 6; the
served-document case of rule 7; and the guard.
