# PROPOSAL — `history.founding.foundedBy` and `history.founding.overcoming` (PEOPLE-1, measuring seat M3, 2026-11-20)

This file follows the same base, births, scripts and validation as `PROPOSAL-settlementReason.md`:
- base `01351d72d` (src identical to `43ab0f5eb`);
- 100 places a size;
- `measures/m3-births.mjs`, `measures/m3-origins.mjs` and `measures/m3-pools.mjs`, with their `.out.txt` count lines.

The validation held: 600 of 600 stored founders are a `FOUNDER_KIND` row, and 600 of 600 stored overcomings are a table row.

**Where they print:** the PDF only, per SAME-1's render (the chair, 16:30 UTC): chapter 08, `src/pdf/sections/HistoryFounding.jsx` via `src/pdf/lib/viewModel.js`. The code also holds two further readers:
- the web History tab's Founding block (`src/components/new/tabs/HistoryTab.jsx`), which SAME-1's render did not see printing;
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

   This is two files beyond the data file. **Ruling needed:** accept it. The other choice is to defer both fields: they print in the PDF only.
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
