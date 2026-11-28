# (D) THE RENAME, MEASURED

Every count here is a script's (CONFIRMED). Tree cccda7569. The corpus is the first 300 births of C and the first 300 of V. Both plans are ordered by size, so these 600 are the thorps and hamlets only (150 + 150 each). The 900 + 900 of (E) cover every size.

For each birth, the harness (`tools/rename-harness.jsx`) makes four renamed copies, each with the product's own writer (see (C)):
- **T**, the town: `name` set to "Quillmarsh", as `renameSettlementImpl` writes it.
- **P**, the person: the seat's holder, or else the first named person, renamed "Odalric Venn" by `applyNpcRenameToSettlement`.
- **H**, the house: the first institution, renamed "Greywater Hall" by `applyInstitutionRenameToSettlement`. No UI control reaches this writer.
- **F**, the power: the first power, renamed "The Ashen Compact" by `applyFactionRenameToSettlement`.

Each copy is re-stamped with its shared-page prose, as the persisting save re-stamps it. Then every tab of the owner's page is walked as OutputContainer renders it. The non-DOM surfaces are read as well: the PDF composers and headlines, the Foundry journal, the Tonight sheet and the session sheet's thread headings.

**How a line is classed.**
- A line "moved by the name only" is one that is equal to a line printed before the rename once both names are reduced to one token. The reduction also drops the article before the name, folds case and decodes HTML entities (`tools/analyze-d.mjs :: renamer`).
- Every other new line counts as moved "otherwise".
- A move is put down to a site by the instrumented `kernel/proseHash.js`. The harness logs every pick made with its key, its chosen line and its call site. A pick is "re-dealt" where its key held the old name and the same site, called with the renamed key, chose another line.

Tables: `D-moved.tsv`. Raw results: `work/D-C.res.json`, `work/D-V.res.json`.

## Counts

| rename | corpus | pages with any moved line | pages with a line moved otherwise | lines moved | by the name only | otherwise |
|---|---|---|---|---|---|---|
| town | C | 300 | **300** | 19,606 | 15,264 | **4,342** |
| town | V | 300 | **300** | 20,354 | 15,830 | **4,524** |
| person | C | 300 | 39 | 9,169 | 9,091 | 78 |
| person | V | 300 | 36 | 9,209 | 9,137 | 72 |
| house | C | 300 | 298 | 2,190 | 996 | 1,194 |
| house | V | 300 | 279 | 2,252 | 1,020 | 1,232 |
| power | C | 300 | 179 | 10,377 | 10,013 | 364 |
| power | V | 300 | 175 | 10,762 | 10,422 | 340 |

### Re-dealt picks, by site of (A)

| rename | site | C: pages re-dealt (picks re-dealt / picks keyed on the name) | V |
|---|---|---|---|
| town | A1-A7, A9, A10 Daily Life slots (`dailyLife.js :: pickNameable`) | **300** (3,997 / 4,818) | **300** (4,110 / 5,070) |
| town | A8 Daily Life, outsider impressions' second part | 158 (162 / 308) | 162 (174 / 317) |
| town | A18 crisis summary vantage (`crisisSummaryVantage.js :: summaryColumnOf`, a raw `fnv1a32 % 4`) | 97 (489 / 489) | 109 (559 / 559) |
| town | A26 PDF / Foundry overview headline | 75 (150 / 194) | 87 (174 / 218) |
| town | A19 / A20 fortune lines (Power tab) | 15 (15 / 34) | 22 (22 / 28) |
| person | A28 PDF / Foundry people headline | 39 (78 / 168) | 36 (72 / 168) |
| power | A30 card honorific | 6 (6 / 22) | 7 (7 / 33) |
| power | A15 conflict hook | 0 | 1 (1 / 1) |
| house | (no key holds a house's name) | 0 | 0 |

The person rename's "otherwise" lines (39 and 36 pages) are exactly the people headline's pages. The town rename's are:
- Daily Life: 1,937 lines on the tab and 1,929 in the PDF for C; 2,012 and 1,981 for V.
- The overview headline: 147 / 176 lines on Foundry and 75 / 87 in the PDF.
- The crisis summary vantage: Defense 69 / 82 lines, Tonight 69 / 82.

A few lines come from the Power tab's fortune lines and the state prose.

### The house and the power: moved by the NAME read as a KIND, not by a hash

No key holds a house's name, and the power rename re-deals almost no pick. Even so, the house rename moves lines on 298 of 300 (C) and 279 of 300 (V) pages, and the power rename on 179 and 175. These lines move because the product reads the institution's or power's NAME to decide what it is. The largest groups:
- Economics, 498 / 457 lines.
- Daily Life, 190 / 208.
- The PDF prose, 100 / 135.
- Traditions, 44.
- "Institutions behind this power (3)" falling to "(2)".

Examples:
- C dp-thorp-0, house "Subsistence farming" renamed "Greywater Hall": the Economics row "Honey and beeswax", "Foraged goods" is gone.
- C dp-thorp-2, the same rename: Foodways loses "What each holding grows goes to its own table".
- C dp-thorp-1: Daily Life's gathering place goes from "People talk in the fields while they work..." to "Most days people stop to talk by the wayside shrine...".
- C dp-thorp-0, power "Elder Council" renamed "The Ashen Compact": Defense goes from "The old families keep the peace..." to "The neighbours keep the peace...".
- C dp-thorp-1: the NPC card "Governor" becomes "Military Governor".
- C dp-thorp-5: the Overview's identity gains "and run by civic association".

This is a different defect from RENAME-REDEALS: a rename changes what the record is taken to hold. It is measured here and not cured here.

## One worked example a site (key, line before, line after)

| site | example |
|---|---|
| A1-A10 Daily Life | C dp-thorp-0. Key `Linyuan::dailyLife.food_culture::adequate` becomes `Quillmarsh::dailyLife.food_culture::adequate`, and line A5 becomes A4. On the page, the outsider impressions go from "Whatever a visitor wants done, the Elder Council has a say in it. Travellers here talk of beasts seen at the edge of the settled land. ..." to "Ask who decides things here, and the answer is the Elder Council. A visitor soon learns that the country beyond is not to be walked carelessly. ..." |
| A8 outsider second part | C dp-thorp-0. Key `Linyuan::dailyLife.outsider_impressions::second`, and the second part goes from `services.healing` to `services.defense`. |
| A18 crisis vantage | C dp-thorp-1, occupied. Key `Rotbach::occupied` becomes `Quillmarsh::occupied`. Defense goes from "The occupiers watch Rotbach closely, and the resistance watches them back, careful never to be caught." to "Keeping order in Quillmarsh is the occupiers' business now, and the locals are not trusted to help." |
| A26 overview headline | C dp-thorp-0. Key `Linyuan` becomes `Quillmarsh`, and frame `local` becomes `traveller`. The headline goes from "Moderate. In Linyuan, a thorpe of 12, the talk is all of the debt to outsiders: ..." to "Moderate. You reach Quillmarsh, a thorpe of 12, and it shows at once: ...". |
| A19/A20 fortune | C dp-thorp-62. Key `Al-bazaar::295` becomes `Quillmarsh::295`, and line C becomes A. |
| A28 people headline | C dp-thorp-22. Key `Otto Fischer` becomes `Odalric Venn`. "Three people worth knowing; Otto Fischer, ... carries the most weight." becomes "Ask who matters here and you hear three names; Odalric Venn, ... comes first." |
| A30 honorific | C dp-thorp-1. Key `npc_power_occupation_authority::Occupation Authority` becomes `...::The Ashen Compact`, and form 0/2 becomes 1/2. |
| A15 conflict hook | V, one page. Key `Elder Council>Merchant Guilds::Authority over military conscription lists::jurisdiction`, with the power's name in it. |

## The SHARED page

The share was rendered as PublicDossierView renders it: `toPublicSafe` -> `projectShareVeil` -> readOnly playerView, with every tab walked.

**After the town's rename, the owner's page and the shared page print the same lines.** Their only new differences are 8 lines on 8 pages of C and 31 lines on 31 pages of V. All 39 are in Daily Life, and all 39 are lines of the OWNER-ONLY slot `commoner_resentments_dm` (A6), checked against its pool. That slot re-deals on the owner's page and never prints on the share. Every other difference between the two pages was already there before the rename.

The shared page itself re-deals exactly as the owner's does: 300 of 300 pages in each corpus. Its own Daily Life and crisis-vantage picks run at view, keyed on the new name (pick log: 3,036 / 3,141 Daily Life picks and 97 / 109 vantage picks keyed "Quillmarsh"). Its stamped lines are re-composed from the renamed record by the persisting save.

This agreement holds because the rename PERSISTS through `supabaseUpdate`, which re-stamps. The model here is a stamp composed right after the rename. A shared page whose save failed or was deferred (`flushSuppressPersist`) would keep the old stamp while its Daily Life re-deals at view (PLAUSIBLE, not measured).
