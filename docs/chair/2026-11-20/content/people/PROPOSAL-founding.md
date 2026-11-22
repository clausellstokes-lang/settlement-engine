# PROPOSAL — `history.founding.foundedBy` and `history.founding.overcoming` (PEOPLE-1, measuring seat M3, 2026-11-20)

## 0. As printed (M5, 2026-11-20T17:52Z)

PEOPLE-2's measuring seat M5, on the chair's ruling of 17:13 UTC ("FOUNDING IS IN SCOPE: it prints through the traditions card"). Base `9110b9861` (its `src/` identical to `43ab0f5eb`); 100 places a size, seeds `hxd-<size>-0..99`, born as the chair's instrument births them. Scripts and counts: `measures/m5-render.census.jsx` + `m5-render.mjs` (the rendered arm, NAMES-3's pattern), `m5-measure.mjs`, `m5-amend.mjs`, each with its `.out.txt`; the fill list is `measures/m5-rite-fills.out.txt`. M3's own measure re-run on a fresh cache reproduces `m3-origins.out.txt` line for line (0 lines differ); the stored founding is equal in both trees and in M3's cache on 600 of 600 places.

### 0.1 Where it prints, by containment (rendered)

**The writer of the rite is NOT on the base.** It is TRAD-1's `src/domain/traditions/traditionDescription.js :: describeTradition` (read whole), with its frames in `src/data/traditionDescriptionTable.js :: CAUSE_FRAMES.founding`. It lives on `lane/trad-4-2026-11-20` (`7955e5304`), which is not an ancestor of the base. On the base, `TraditionsTab.jsx :: TraditionRow` prints a name, a motif chip and a calendar line, and no description at all. So I rendered both trees: the base, and the traditions tree (`git archive` of the trad-4 tip; package files equal).

The rite's clause: `describeTradition`, S3, on the founding core only (`id` ends `.0` and `foundedYear === 1`, with `history.founding.age > 0`). For the OWNER it fills `{foundedBy}` verbatim into one of three frames, keyed on `<seed>` and `<rite id>#origin`, not on the founder's words:
- "It has been kept since {town} was founded by {foundedBy}, {age} years ago."
- "{Town} has kept it since its founding by {foundedBy}, {age} years ago."
- "It goes back to the founding of {town} by {foundedBy}, {age} years ago, and has been kept since."

For a READER it never reads `foundedBy` (CTR11; the bare pool).

Places whose rendered surface contains the stored text (thorp/hamlet/village/town/city/metropolis, of 100 each):

| surface | base: foundedBy | traditions tree: foundedBy | overcoming (both trees) |
|---|---|---|---|
| History tab, Founding block (`HistoryTab.jsx`; `Collapsible`, `defaultOpen = true`) | 100 at every size = 600 | 600 | 600 |
| Traditions card (owner's page) | **0** | 78/84/85/100/100/100 = **547** | 0 |
| any other web view | 0 | 0 | 0 |
| PDF element tree (`SettlementPDF`, canon_dossier; ch. 08 and the Identity fallback) | 600 | 600 | 600 |
| Foundry journal (`journalPages.js :: buildJournalPages`) | 600 | 600 | 600 |

**Rites (traditions tree, `shownTraditionsOf` then `describeTradition`):**
- 1,692 rites are shown on 600 places. Of these, 547 owner rites quote `foundedBy` (32%), one on each of 547 places, and all 547 are found on the rendered card.
- Reader rites quoting it: 0.
- By size: thorp 78 of 113, hamlet 84 of 120, village 85 of 150, town 100 of 286, city 100 of 442, metropolis 100 of 581.
- The founding core is not shown on 22 thorps, 16 hamlets and 15 villages: their core's motif is refused by the tab's declared needs.
- The chair's 387 of 1,232 (31%) was TRAD-1's corpus (432 towns, 12 cultures). Mine is 547 of 1,692 (32%) on the default config: the same share.

`historyBeats.js :: deriveFoundingCause` ("founded by …") and `:: deriveFirstProsperitySource` ("Prosperity came slowly, …") print on no rendered web view of either tree (containment 0 beyond the History tab).

### 0.2 Today, and 0.3 the projection (M3's 108 wordings and its selection, as written)

Top share by size: places printing the commonest masked sentence over places holding it. The rite sentence is the S3 sentence alone, with the town masked to `#` and the age to `0`; its denominator is the places printing a founding rite.

| | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| stored `foundedBy` today | 38/100 38% | 41/100 41% | 26/100 26% | 26/100 26% | 29/100 29% | 37/100 37% |
| **stored, projected** | 13% | 11% | 13% | 10% | 11% | 11% |
| rite sentence today | 14/78 18% | 14/84 17% | 10/85 12% | 14/100 14% | 16/100 16% | 16/100 16% |
| **rite sentence, projected** | 6/78 8% | 4/84 5% | 4/85 5% | 7/100 7% | 6/100 6% | 8/100 8% |

M3's 38/41/26/26/29/37% is re-confirmed. The rite sentence is already split three ways by its frames, so it stands lower today. It is still over the bar at thorp, hamlet, city and metropolis.

The commonest rite sentence today, each "# has kept it since its founding by …" or "It has been kept since # was founded by …":
- thorp: "… a discharged soldier who liked the view …";
- hamlet: "… three or four families who agreed to try wintering together …";
- village: "… a noble granted lands by the crown …";
- town: "… a merchant consortium that needed a waypoint …";
- city: "… royal decree and a century of forced investment …";
- metropolis: "… the slow accretion of three smaller settlements …".

The commonest projected:
- thorp: the soldier's line, today's (6 of 78);
- hamlet: "a household that settled first …" (4 of 84);
- village: "a noble granted lands in the forest by the crown …" (4 of 85);
- town: the consortium, today's (7 of 100);
- city: "royal decree, and a century of forced investment in its walls and markets" (6 of 100);
- metropolis: "a great trade house whose banking outgrew …" (8 of 100).

The commonest projected stored line by size is M3's §5, unchanged.

### 0.4 The fill read (`m5-rite-fills.out.txt`)

**What the file holds:**
- 260 distinct projected rite sentences with a new founder wording in them, on 369 places, each with its count.
- After them, as a reading aid, every one of the 108 wordings in each of the three frames (324 lines).
- One line in A, "a great trade # on the riverbank", is a mask artefact: the place holds a name "house". It is not the wording.

I read them all. **20 wordings** do not read as English inside the rite, or fight its grammar. Every cure keeps M3's `needs`, so on 600 of 600 places the hash picks the same index as M3's pool (`m5-amend.out.txt`). The shares above stand. M3's guards on the cures: 0 misses, and none keeps a comma.

**A. A motion verb before `{ground}`, which is a place phrase ("came in the hills", "fled on the shore", "moved its business on the riverbank").**

| M3 wording | M5 wording |
|---|---|
| a discharged soldier who came {ground} with nowhere better to be, and stayed | a discharged soldier with nowhere better to be who settled {ground} and stayed |
| a group of settlers who came {ground} looking for land of their own | a group of settlers who looked for land of their own and found it {ground} |
| escaped serfs who fled {ground}, beyond the reach of their former masters | escaped serfs who hid {ground} beyond the reach of their former masters |
| a merchant coalition that outgrew the place it started in and moved its business {ground} | a merchant coalition that outgrew the place it started in and set up again {ground} |

**B. A clause ending on a bare word that the frame's ", N years ago" completes.** "drew others after, 120 years ago" reads as "after 120 years ago"; likewise "settle near, …" and "brought more, …".

| M3 wording | M5 wording |
|---|---|
| a retired tradesperson who settled {ground}, whose skills drew others after | a retired tradesperson who settled {ground} and whose skills drew others to follow |
| a retired tradesperson who set up by the road, whose skills drew others to settle near | a retired tradesperson who set up by the road and whose skills drew others to settle nearby |
| a retired tradesperson who set up where the roads cross, whose skills drew others to settle near | a retired tradesperson who set up where the roads cross and whose skills drew others to settle nearby |
| a healer who stopped at the crossroads to treat a traveller and stayed, since every road brought more | a healer who stopped at the crossroads to treat a traveller and stayed where every road brought more |

**C. A comma that splits the founder in two after "by".** In "founded by royal decree, and a century of forced investment in its walls and markets, 300 years ago", the second half reads as a separate clause. Under the second frame, "its walls" could also be the rite's. Today's rows have no comma.

| M3 wording | M5 wording |
|---|---|
| royal decree, and a century of forced investment in its walls and markets | royal decree and a century of forced investment in walls and markets |
| royal decree to build a city {ground}, and a century of forced investment | royal decree to build a city {ground} and a century of forced investment |
| royal decree to hold the river, and a century of forced investment | royal decree to hold the river and a century of forced investment |
| royal decree to hold the crossing of the roads, and a century of forced investment | royal decree to hold the crossing of the roads and a century of forced investment |
| imperial decree, and skilled people moved by force to settle {ground} | imperial decree and the forced settling of skilled people {ground} |
| imperial decree to hold the river, and the forced relocation of skilled populations | imperial decree to hold the river and the forced relocation of skilled populations |
| imperial decree to hold the road, and the forced relocation of skilled populations | imperial decree to hold the road and the forced relocation of skilled populations |
| the slow accretion of three smaller settlements around a shared market, eventually merged under a single administration | the slow accretion of three smaller settlements around a shared market that eventually merged under a single administration |

**D. A span that the frame's point in time fights.** "Founded by … whose members drifted into secular life over two generations, 120 years ago."

| M3 wording | M5 wording |
|---|---|
| a small religious community that settled {ground}, whose members drifted into secular life over two generations | a small religious community that settled {ground} and whose members drifted into secular life over the next two generations |
| a small religious community that built the first temple here, whose members drifted into secular life over two generations | a small religious community that built the first temple here and whose members drifted into secular life over the next two generations |

**E. Stacked commas that hang the age on the last verb.**

| M3 wording | M5 wording |
|---|---|
| a discharged soldier who took the road home, stopped here, and never went on | a discharged soldier who stopped here on the road home and never went on |
| a pair of siblings who stopped where the roads cross, unable to agree which road to take | a pair of siblings who stopped where the roads cross because they could not agree which road to take |

**Two lighter kinds, not counted in the 20:**
- Thirteen wordings hold one comma before a closing phrase: "…, independent of rivals" (4), "…, with the resources to …" (3), "…, who brought their skills with them" and its kin (3), "…, far from the trade roads" and its kin (3). In the frame they read "…, independent of rivals, 300 years ago": English, if heavy. Dropping the comma is the integrator's choice.
- None of the 108 says a thing the record lacks. Every house, wall, palisade, quay, temple, market, healer and route word has its `need`; M3's guard holds.

**A kind M3's wordings share with TODAY'S rows, which no founder cure removes.** Every founder phrase that ends on a verb meets ", N years ago" there:
- "a single extended family who came and never left, 120 years ago";
- "… who agreed to try wintering together and never stopped, 120 years ago";
- today's religious row, "… over two generations, 120 years ago".

The age then reads as the time of the last verb. The cure belongs to the frame, not to the founder. For example: "It has been kept since {town} was founded, {age} years ago, by {foundedBy}." That is TRAD-1's table on the traditions lane: see 0.6.

### 0.5 `overcoming`

M3's tops are re-confirmed on the same births:
- today: 24/22/22/27/35/27%;
- projected: 10/8/10/11/13/10%;
- the same sentences as M3's §5.

It prints by containment on the History tab ("How survived", 600 of 600), in the PDF tree (600) and in the Foundry journal (600), in both trees. It prints on no traditions card and in no other web view. `deriveFirstProsperitySource`'s sentence prints nowhere rendered.

### 0.6 What the chair must rule (M5)

1. **Which tree the rite figure is.** The founding prints through the traditions card only once `lane/trad-4` (TRAD-1's description) merges. On the base, the card prints 0 founders.
   The founder prints today on the History tab, the PDF and the Foundry journal, on every place.
2. **The 20 cures above, in place of M3's wordings.** They make no change to any need, and no share moves.
3. **The frame's age after the founder (0.4, the shared kind).** This is TRAD's to cure in `traditionDescriptionTable.js :: CAUSE_FRAMES.founding`, by putting `{age}` before `{foundedBy}`, or to leave as it is. The frames are keyed on the rite's id, so a reorder moves no other sentence.


This file follows the same base, births, scripts and validation as `PROPOSAL-settlementReason.md`:
- base `01351d72d` (src identical to `43ab0f5eb`);
- 100 places a size;
- `measures/m3-births.mjs`, `measures/m3-origins.mjs` and `measures/m3-pools.mjs`, with their `.out.txt` count lines.

The validation held: 600 of 600 stored founders are a `FOUNDER_KIND` row, and 600 of 600 stored overcomings are a table row.

~~**Where they print:** the PDF only, per SAME-1's render (the chair, 16:30 UTC): chapter 08, `src/pdf/sections/HistoryFounding.jsx` via `src/pdf/lib/viewModel.js`.~~ (M5: refuted by render: the History tab, the PDF and the Foundry journal each print both fields on 600 of 600 places, §0.1.) The code also holds two further readers:
- the web History tab's Founding block (`src/components/new/tabs/HistoryTab.jsx`)~~, which SAME-1's render did not see printing~~ (M5: it prints, open by default, on 600 of 600 places, §0.1);
- the Foundry journal (`src/foundry/journalPages.js`).

**Kept short, on the chair's order.** Both fields come after `settlementReason`.

## The answer

| field | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| foundedBy today | 38% | 41% | 26% | 26% | 29% | 37% |
| **foundedBy projected** | 13% | 11% | 13% | 10% | 11% | 11% |
| overcoming today | 24% | 22% | 22% | 27% | 35% | 27% |
| **overcoming projected** | 10% | 8% | 10% | 11% | 13% | 10% |

(Places printing the top sentence over the places holding the field. All 100 places hold both fields at every size.)

No new atom is asked. Every founder wording reads only facts already settled at the founding draw: terrain, route, water, houses, walls, palisade, healer and market. Each of these is equal between the birth state and the final record on all 600 places (measured in the m3-births cache).

## 1. The function

Both fields are written in `src/generators/narrativeGenerator.js :: genArrivalDetail`, which `historyGenerator.js` calls once (`historyGenerator.js` is untouched). `src/domain/facts/founder.js` writes nothing: it is the founder's READER (`founderOf`, `FOUNDER_KIND`).

**`foundedBy`**
- It is drawn by `pick(FOUNDERS_BY_TIER[tier])`: four or five rows a tier.
- `foundingRowAdmits.js :: admittedRow` resolves it without a draw against `FOUNDER_ADMITS`, the roster tests: market, a sacred house, walls, a crossroads.
- `founderForOrigin` then resolves it against the Origin row: `FOUNDER_AGREES`, `ORIGIN_AGENT_KINDS` and `FOUNDER_PURPOSE`.

**`overcoming`**
- It is drawn by `pick(OVERCOMING_BY_PROSPERITY[prosperity] || Moderate)`: three rows a table.
- The table is chosen by `economicState.prosperity`. Comfortable, Struggling and Modest have no table of their own and fall back to Moderate.

**What the draw costs.** `rngContext.js :: pick` takes ONE `_roll()` whatever the table's length, so a longer table would not change the draw count. It would change `floor(r·length)`, though: every seed would take another row, and today's line would not survive at index 0. So both tables stay as written and are drawn as today. The draw-free variant pick (`pickVariant`) comes AFTER the resolved row, with the row as the branch.

## 2. Today's branches (100 places a size; `m3-origins.out.txt`, "branch" lines)

- **foundedBy** (resolved row; each place one entry):
  - thorp: soldier 38, family 26, siblings 22, healer 14;
  - hamlet: families 41, tradesperson 27, household 23, religious 9;
  - village: noble 26, settlers 21, tradespeople 19, refugees 19, serfs 15;
  - town: consortium 26, noble 24, merchants 20, veterans 15, religious 15;
  - city: royal decree 29, noble house 26, merchant coalition 23, military command 22;
  - metropolis: accretion 37, trade house 33, imperial decree 28, dynastic 2.
- **overcoming** (table · challenge kind): the Moderate table carries the thorp (68), hamlet (63), village (49) and town (68). Prosperous carries the city (78) and metropolis (75). The challenge kinds spread each table four to six ways (full split in the `.out.txt`).

## 3. The readers

| path :: symbol | kind | what breaks if the words change |
|---|---|---|
| `src/pdf/sections/HistoryFounding.jsx`, `src/pdf/lib/viewModel.js`, `src/pdf/sections/IdentityDailyLife.jsx` (falls back to `foundedBy`) | PRINTS (PDF) | nothing |
| `src/components/new/tabs/HistoryTab.jsx` (Founding: "Founded by", "How survived"); `src/foundry/journalPages.js` | PRINTS (web, export) | nothing |
| `src/domain/historyBeats.js :: deriveFoundingCause` ("founded by <foundedBy>"), `:: deriveFirstProsperitySource` ("Prosperity came slowly, <overcoming lowercased>.", only where no top export) and the bundled copy in `aiGroundingBundle.js` | COMPOSES | every new founder line is a lowercase noun phrase, and every new overcoming line is an adverbial phrase (by, through, with, at, though, only, behind): guarded, 0 misses |
| `src/domain/facts/founder.js :: founderOf`, `FOUNDER_KIND`; `foundingRowAdmits.js :: FOUNDER_AGREES`, `agentAgrees`, `purposeAgrees`, `founderAgrees` (keyed by the founder's EXACT text) | MATCHES (the founder's kind and the agreement tables) | a variant read raw is kind `other` and disagrees with every row that names an agent. **The new file maps every variant to its canonical row, and these readers read through that map.** Each variant keeps its row's kind, number and purpose. |
| `src/domain/facts/sovereign.js` (the founding gives a sovereign through its words) | MATCHES (sovereign words) | none: no variant drops a sovereign word its row has (crown, royal, imperial; guarded, 0 misses) |
| `tests/domain/facts/missingLeaves.test.js` (parses the `FOUNDERS_BY_TIER` block from source; `FOUNDER_KIND` keys must EQUAL its lines) | MATCHES | holds: the table is untouched; the variants live in the new file |
| `tests/generators/foundingOneFounder.test.js`, `tailNarrativeRows.test.js` (founder regexes, `founderAgrees` on stored text), `foundingRowsRead.test.js`, `founderHamletNoMill.test.js` (exact hamlet line) | MATCHES (seeded) | red where a pick leaves index 0: they read the canonical row through the map, or are re-keyed by identity |
| `tests/lint/presumptionClasses.register.json` (the noble rows' `sovereign` class) and the walker's file map | MATCHES | the new file needs its row and its register rows |
| `src/generators/generationCoherence.js` (maritime and magic audit on every string) | MATCHES | 0 maritime words outside `coast` (guarded) |
| `tests/property/generatorGoldenMaster.test.js` | hashes | moves where a pick leaves index 0: the owner's door |

## 4. The candidate wordings (all in `measures/m3-pools.mjs`, with their needs)

**foundedBy: 108 wordings over 25 rows.** A row gets two to seven wordings; the dynastic row (2 metropolises) keeps its own line. Each says the SAME founder, and adds WHERE they founded the place from the place's own facts:
- `{ground}`: its terrain;
- its route: the road, the river, the crossroads, by boat, far from the trade roads;
- its water: river or shore;
- a house that stands: smith, quarry, temple, monastery, mill and market, bank, docks;
- its defences: palisade, walls;
- a healer;
- the wild country (`monster frontier`).

Examples:
- thorp, "a discharged soldier who liked the view …": "a discharged soldier who stopped where the roads cross and never chose one" (`route: crossroads`); "a discharged soldier who raised the first palisade here and stayed behind it" (`palisade`).
- hamlet, the families: "three or four families who wintered together beside the river and never moved on" (`river`).
- village, the refugees: "refugees fleeing war or persecution who found the hills easy to defend" (`terrain: hills`).
- city, the military command: "a military command that fortified the river crossing and found civilians followed" (`river`).
- metropolis, the accretion: "the slow accretion of three smaller settlements around a shared market, eventually merged under a single administration" (`market`).

No variant adds a trade (no fishers, miners or herders), so none can contradict the Origin row beside it. No variant names a house the roster lacks.

**overcoming: 36 wordings.** They are keyed by the prosperity table and by the KIND of the record's own `initialChallenge`, the row the page prints just above as "Early trial". The kinds are:
- threat: raids, bandits, hostile inhabitants, wildlife;
- rival: rights disputes, rival claimants, competing markets;
- lords: a lord's harassment or pressure;
- water: storms, flooding, navigation;
- land: harsh land, poor harvests, no outside resources;
- sickness.

Each wording answers the trial beside it and keeps its table's weight: Moderate managed, Poor paid for it, Prosperous did it well. Examples:
- Moderate · rival: "by holding to their claim until the other side gave it up"
- Poor · water: "only after losing much of what was first built to the water"
- Prosperous · threat: "behind walls built early and built well" (`walls`)

Wealthy has no places on this sample and gets no wordings.

**The selection:**
- foundedBy: `pickVariant([resolvedRow, ...eligible wordings of that row], '<seed>::history.founding.foundedBy')`.
- overcoming: `pickVariant([drawnRow, ...eligible wordings of table × kind], '<seed>::history.founding.overcoming')`.

Both picks come after the draws and the agreement walk, which are unchanged. Index 0 is today's line. `speakTierNoun` leaves every new wording unchanged at every size (guarded).

## 5. Projected (in the table above)

The commonest projected sentence of each size:

| size | foundedBy | overcoming |
|---|---|---|
| thorp | 13%, "a discharged soldier who liked the view …" (today's) | 10%, "by striking a bargain with the other side that both could live with" |
| hamlet | 11%, "a household that settled first …" (today's) | 8%, "with help from external allies …" (today's) |
| village | 13%, "refugees … who found the location defensible" (today's) | 10%, "though the founding was harder than anyone admitted …" (today's) |
| town | 10%, "a merchant consortium that needed a waypoint …" (today's) | 11%, "by striking a bargain …" |
| city | 11%, "a powerful noble house …" (today's) | 13%, "by attracting the right people at the right time" (today's) |
| metropolis | 11%, "the slow accretion … around a shared market …" | 10%, "through good fortune and good decisions …" (today's) |

**Where the projection approximates the code path:** the atoms are read by `birthFactsOf` over the final roster and config, the founding state's own view, so only atoms settled at birth are used. The rest is as in the settlementReason proposal, §5.

## 6. What must be ruled

1. **The build's shape.** Both picks need the resolved founder and the drawn challenge, which `genArrivalDetail` builds inside one object literal (`initialChallenge` and `overcoming` are its sibling keys). The least touch is one call wrapping the returned object in `narrativeGenerator.js :: genArrivalDetail`: `return withFoundingWordings({ … }, foundingState, config?._seed);`. That edits the `return {` line and its closing line.

   It also needs one canonical map read by the matchers in `founder.js` and `foundingRowAdmits.js`, so that every agreement table reads the canonical row (§3).

   This is two files beyond the data file. **Ruling needed:** accept it. ~~The other choice is to defer both fields: they print in the PDF only.~~ (M5: they print on the History tab, the PDF and the Foundry journal everywhere, and on the traditions card once TRAD-1's description merges, §0.1.)
2. **What a change by the holding lane could move.** The goals lane holds `narrativeGenerator.js`, and these fields are written in it by DRAWS. A change that adds or removes a main-stream draw before step 14 (`generatePopulation`, where people are drawn) moves which founder and overcoming each seed takes. The shares move by noise, not structure. An edit to `genArrivalDetail` itself moves the call site.
3. **The noble and crown founders, which the brief raised.** Of the noble or crown-grant founders, the ruler is not a lord in:
   - 25 of 26 villages;
   - 21 of 24 towns;
   - 19 of 26 cities.

   The variants do not change which founder prints. Two cures were considered and neither is clean:
   - **Refusing noble founders without a lord** needs the ruler kind in the founding state. `birthFactsOf` takes it only if `powerStructure.government` is handed; it is settled by step 14, per CENSUS-4c.
   - **The `sovereign` atom** cannot gate the founder: `sovereign.js` reads the founding itself, so the test would be circular.

   A refusal would move rows by the onward walk, which raises the share of the row after the noble one. A grant two centuries old does not need a lord today. **Ruling needed:** leave it (my reading), or hand the government to the founding state and refuse the noble rows.
4. **The prosperity fallback.** Comfortable, Struggling and Modest take the Moderate table. So a struggling place reads "through determination and cooperation" while a poor one reads "at significant cost":
   - 15 thorps and 24 hamlets are Struggling;
   - 20 thorps and 38 towns are Comfortable.

   I do not propose a change, since it would move rows. I flag it for the chair.
5. **The golden master** moves where a pick leaves index 0, which is the owner's door. The seeded founder tests are re-keyed, or read through the canonical map (§3).
