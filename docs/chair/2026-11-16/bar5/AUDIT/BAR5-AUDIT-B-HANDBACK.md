# BAR5-AUDIT-B · HAND-BACK · laws 2, 3 and 5 (seat B)

**STATUS: IN PROGRESS.** The detectors and the LAW 5 inventory are built. Every control is read on the sixty. The 720 and the fresh 300 are still rendering at this tip; sections 2, 3 and 6 fill in when they finish.
Tip read: `9867b4b17` (the joined line, `lane/join-2026-11-14`). Nothing under `src/` changed, no test file was added, and nothing is cured.

## How to run it again

- Render with PAGE-COPY: `HOLDERS=<PAGE-COPY>/holders.tipA.json sh <PAGE-COPY>/census3.sh <tree> <out> 4 --seeds <seeds> --count-only`.
- Laws 2 and 3: `node docs/chair/2026-11-16/bar5/AUDIT/runB.mjs <out> <result.json> <SECOND-CHECK.final72.json>`. Add `GONE=<SECOND-CHECK.final75.json>` for the read before.
- Law 5: `node docs/chair/2026-11-16/bar5/AUDIT/law5-inventory.mjs <tree> <out.json> <SECOND-CHECK.final72.json>`. This is static; no town is born.
- The detectors: `tests/helpers/pageLaws/pageB.mjs` reads the page into cards, Services entries and chains. `law2.mjs` and `law3.mjs` are the laws. Each is a pure function over `{ record, tabs }` and returns `{ law, rule, town, tab, i, line, against, why }`.
- They read the dossier tabs only (`Summary/`, `Systems/`, `World/`, `Notes/`, `Table/`). The PDF and the journal are copies of the tabs and are not counted twice.
- LAW 2 skips Plot Hooks, Rumours, Notes and NPC `Secret:` lines, because a hook or a rumour states its own fact.

## 1. THE CONTROLS (the sixty: `bar0-<shape>-rand-21..26`)

Every STANDS control of LAW 2 (12) and of LAW 3 (10) is found. No EXPLAINED control of LAW 2 (7) is found. Of the WEAK rows, C7834 and C17069 (LAW 2) and C6320 and C24243 (LAW 3) are not found: no rule reads density ("crowd") or a source label.
The read before (`SECOND-CHECK.final75.json`, 40 STANDS): **0 are still found**. Seven of the 40 sentences still print. The three of LAW 2's shape are now marked (C0543 `Curtailed by the siege.`, C6632 `Scarce in the famine.`, C19622 `Stopped by the siege.`). The other four (C7336, C24951, C30692, C31074) belong to other laws.

| law | kind | id | town | tab | found | by rule |
|---|---|---|---|---|---|---|
| L2 | STANDS | C0333 | city-under_siege+famine-rand-24 | Systems/Institutions | found | L2.siege.abroad L2.siege.cutgood |
| L2 | STANDS | C0927 | city-under_siege+famine-rand-24 | Systems/Services | found | L2.siege.cutgood |
| L2 | STANDS | C5441 | city-under_siege+famine-rand-26 | Systems/Institutions | found | L2.siege.abroad |
| L2 | STANDS | C0350 | city-under_siege+famine-rand-24 | Systems/Institutions | found | L2.siege.abroad |
| L2 | STANDS | C3223 | city-under_siege+famine-rand-25 | Systems/Institutions | found | L2.siege.abroad |
| L2 | STANDS | C5452 | city-under_siege+famine-rand-26 | Systems/Institutions | found | L2.siege.abroad |
| L2 | STANDS | C3231 | city-under_siege+famine-rand-25 | Systems/Institutions | found | L2.famine.meat |
| L2 | STANDS | C8174 | city-wartime-rand-24 | Systems/Institutions | found | L2.war.iron |
| L2 | STANDS | C8475 | city-wartime-rand-24 | Systems/Institutions | found | L2.war.animals |
| L2 | STANDS | C11307 | city-wartime-rand-25 | Summary/Plot Hooks | found | L2.war.iron |
| L2 | STANDS | C43575 | village-famine-rand-26 | Systems/Institutions | found | L2.famine.work |
| L2 | STANDS | C42116 | village-famine-rand-24 | Systems/Defense | found | L2.law.collapsed |
| L2 | EXPLAINED | C2960 | city-under_siege+famine-rand-25 | Summary/Overview | not found | - |
| L2 | EXPLAINED | C5442 | city-under_siege+famine-rand-26 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C17210 | hamlet-under_siege-rand-24 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C17771 | hamlet-under_siege-rand-25 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C18377 | hamlet-under_siege-rand-26 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C5621 | city-under_siege+famine-rand-26 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C17209 | hamlet-under_siege-rand-24 | Systems/Institutions | not found | - |
| L2 | WEAK | C17069 | hamlet-under_siege-rand-24 | Summary/Overview | not found | - |
| L2 | WEAK | C7834 | city-wartime-rand-24 | Summary/Overview | not found | - |
| L3 | STANDS | C3874 | city-under_siege+famine-rand-25 | Systems/Economics | found | L3.outputs |
| L3 | STANDS | C3911 | city-under_siege+famine-rand-25 | Systems/Economics | found | L3.outputs |
| L3 | STANDS | C17290 | hamlet-under_siege-rand-24 | Systems/Economics | found | L3.foodLineStopped |
| L3 | STANDS | C17893 | hamlet-under_siege-rand-25 | Systems/Economics | found | L3.chainOverStopped |
| L3 | STANDS | C42011 | village-famine-rand-24 | Systems/Resources | found | L3.failedFood |
| L3 | STANDS | C42947 | village-famine-rand-25 | Systems/Resources | found | L3.failedFood |
| L3 | STANDS | C31652 | town-calm-rand-24 | Systems/Economics | found | L3.needed |
| L3 | STANDS | C39608 | village-calm-rand-24 | Systems/Economics | found | L3.halfway |
| L3 | STANDS | C37887 | town-occupied-rand-25 | Systems/Resources | found | L3.halfway |
| L3 | STANDS | C39597 | village-calm-rand-24 | Systems/Economics | found | L3.foodModel |
| L3 | WEAK | C6320 | city-under_siege+famine-rand-26 | Systems/Resources | not found | - |
| L3 | WEAK | C24243 | metropolis-calm-rand-25 | Systems/Resources | not found | - |

## 2. THE COUNTS

The sixty: **LAW 2: 37 instances in 12 towns** · **LAW 3: 24 instances in 19 towns** (`tables/B.sixty.instances.json`).

| rule | what it reads | sixty: towns · instances |
|---|---|---|
| L2.siege.abroad | siege, and the page's "nothing comes in by road": an unmarked line naming caravans, travellers, pilgrims or goods "from abroad" | 6 · 13 |
| L2.siege.cutgood | siege, and the page's "depend on medicinal herbs from outside, which the siege has cut off": an unmarked medicine row | 1 · 6 |
| L2.famine.meat | famine, and the herds failed (or the town has no pastoral chain, is under siege, and nothing comes in): an unmarked meat or dairy row | 2 · 4 |
| L2.famine.work | famine, and "No one can earn a normal living": an unmarked line promising steady work | 1 · 1 |
| L2.war.iron | war, and "War has taken the iron": the smiths' unmarked Repairs, Tool manufacture or Weapon smithing | 2 · 8 |
| L2.war.animals | war, and "Every sound animal … has a receipt": unmarked horse hire | 1 · 2 |
| L2.law.collapsed | "Law & order · Collapsed": an unmarked line saying theft is answered | 3 · 3 |
| L3.outputs | a chain printed Running or Operational lists, as an output or export, a service the page marks stopped | 5 · 7 |
| L3.chainOverStopped | a chain printed Running or Operational, every one of whose houses is stopped | 2 · 2 |
| L3.failedFood | "✗ Failed this year · X", and X among the commodities available | 5 · 5 |
| L3.foodLineStopped | the food line puts on the table a catch whose fishing the page marks stopped | 1 · 1 |
| L3.foodModel | the food line names game or fish as the table's own food, beside a Farmland house that sells its own grain | 2 · 2 |
| L3.needed | "Needed, and not brought in: X" with "that work stands idle": an unmarked Crafts or Economy house that works X | 4 · 4 |
| L3.halfway | the record's gap says no final goods can be made (the page prints "stops half-way" or "semi-finished"), yet a chain on that material prints the missing house's finished goods | 3 · 3 |

The 720 and the fresh 300: PENDING. The thirty commonest lines and the counts by writer file: PENDING.

## 3. PRECISION: PENDING (twenty drawn from the 720 for each law, seeded, judged by hand)

## 4. THE CURE'S FORM: PENDING (the findings so far are in section 5)

## 5. LAW 5 · THE STATIC INVENTORY (`law5-inventory.mjs`; table `tables/B.law5.inventory.json`)

The script read every string and template literal in the 31 source files of the pools that print, as the brief lists them: houses and variants, services, hooks, ties, scenes, the state annex's leaves, food lines and defence lines. It matched each against the lexicon below.

- **244 distinct crisis-sensitive lines.**
- **158 are NOT declared for any crisis**: no crisis atom on the line, and no crisis mark on its row.
  - 101 declare nothing.
  - 20 are declared `colour`, which says the line presumes nothing; that is false for a line the lexicon catches. Examples are C43575's "the work never dries up" and C0333's "medicines brought from abroad".
  - 26 declare `needs` that are not the crisis. C0350's bowyer line declares `needs: ["watch","garrison"]` and nothing for the caravans.
  - 11 are annex lines drawn by a state key whose measure may or may not read the crisis. They are reported apart and not read here.
- 31 are covered at the row, where `crisisDependence.js` gives the service or house a siege-stopped dependence.
- 63 declare on the line itself; 37 of those carry a crisis atom.

| file | sensitive lines | not declared for a crisis | declare nothing | colour | needs, no crisis atom | state-keyed (annex) | classes (of the undeclared) |
|---|---|---|---|---|---|---|---|
| `src/data/institutionDescVariants.js` | 51 | 28 | 5 | 13 | 10 | 0 | plenty 6, outside 19, iron 1, work 1, animals 1, law 1 |
| `src/data/institutionalCatalog.js` | 23 | 23 | 23 | 0 | 0 | 0 | plenty 1, outside 22, animals 2 |
| `src/data/institutionServices.js` | 50 | 20 | 17 | 0 | 3 | 0 | animals 4, iron 2, plenty 6, outside 8 |
| `src/data/cultureProfiles.js` | 17 | 16 | 10 | 0 | 6 | 0 | outside 15, plenty 1 |
| `src/data/dossierStateProse/general.generated.js` | 15 | 12 | 6 | 0 | 0 | 6 | outside 8, plenty 4 |
| `src/data/dossierStateProse/economy.generated.js` | 11 | 7 | 1 | 4 | 0 | 2 | outside 4, plenty 4 |
| `src/components/new/dailyLifeLogic.js` | 6 | 6 | 6 | 0 | 0 | 0 | outside 6 |
| `src/data/arrivalProse.js` | 21 | 5 | 3 | 1 | 1 | 0 | outside 5, plenty 1 |
| `src/data/historyData.js` | 5 | 5 | 3 | 0 | 2 | 0 | outside 5 |
| `src/generators/economy/foodBalance.js` | 6 | 5 | 5 | 0 | 0 | 0 | outside 5 |
| `src/generators/economy/prosperity.js` | 5 | 5 | 3 | 0 | 2 | 0 | outside 5 |
| `src/generators/safetyProfile.js` | 5 | 5 | 5 | 0 | 0 | 0 | outside 2, law 3 |
| `src/data/narrativeData.js` | 5 | 4 | 4 | 0 | 0 | 0 | outside 4 |
| `src/data/npcData.js` | 5 | 4 | 2 | 2 | 0 | 0 | outside 3, plenty 1 |
| `src/domain/dailyLife.js` | 4 | 4 | 4 | 0 | 0 | 0 | plenty 2, outside 2 |
| `src/data/dossierStateProse/stressors.generated.js` | 4 | 3 | 3 | 0 | 0 | 0 | outside 2, plenty 1 |
| `src/data/dossierStateProse/defense.generated.js` | 3 | 2 | 0 | 0 | 0 | 2 | outside 2 |
| `src/generators/economy/incomeLineSiblings.js` | 6 | 2 | 0 | 0 | 2 | 0 | outside 2 |
| `src/data/dossierStateProse/power.generated.js` | 1 | 1 | 0 | 0 | 0 | 1 | outside 1 |
| `src/domain/foodways.js` | 1 | 1 | 1 | 0 | 0 | 0 | plenty 1 |
| **all** | 244 | 158 | 101 | 20 | 26 | 11 | |


THE LEXICON (`LEXICON` in `law5-inventory.mjs`, six classes):
- `outside`: from abroad, imported, caravans, caravanserai, travellers, pilgrims or pilgrimage, merchants from, foreign merchants or goods, passing trade, outside buyers, from distant or far, trade routes, the roads in or out, ships calling, coaches.
- `plenty`: plenty, abundance, feasts, well-fed, never hungry, "without going hungry", fresh meat, bread, fish, milk, produce or game, full larders, beef, pork, mutton, the day's catch.
- `work`: steady work, "the work never dries up", never short of work.
- `animals`: horse hire, renting horses or animals, fresh mounts, draught animals, cart hire.
- `iron`: reforge, mend tools, re-edge, tool manufacture, weapon smithing, ironwork.
- `law`: "thief is known", "until they make it right", crime is rare, doors unlocked, the courts sit, disputes are settled.

ITS MISSES ON THE CONTROLS (`tables/B.law5.lexicon-controls.json`):
- LAW 2: the lexicon catches 11 of the 12 STANDS. It misses **C0927** ("Rare medications … through district-wide sourcing"). That line is false only because the page says its herbs come from outside, so LAW 2's `siege.cutgood` rule catches it and no word list can. Three of the twelve (C3231, C8174, C8475) are service chips; their names are keys, not prose lines, and their sensitivity is the row's dependence (`SERVICE_DEPENDENCE`).
- LAW 3: the lexicon misses all ten STANDS. This is expected: LAW 3 is a disagreement between tabs, not a word, and no static list can see it.

THE SOURCE OF EACH LAW 2 CONTROL, and how it declares:
- C0333 and C5441: `institutionDescVariants.js:1004`, declared `colour`.
- C0350, C3223 and C5452: `institutionDescVariants.js:1007-1008` and `institutionalCatalog.js:693`, which declare `needs: ["watch","garrison"]` and no caravans.
- C43575: `institutionDescVariants.js:403`, declared `colour` (`institutionDescColour.js:157`).
- C42116: `safetyProfile.js:1018` (`NO_WATCH_SMALL`), which declares nothing.
- C11307: the hook, `foodBalance.js:831`, which IS declared (`needs: institution: smith`, `excludes: war: peace`). The false half is the unmarked row.
- C0927: `institutionServices.js:733` ("Specialist compounds"), whose row dependence holds nothing the siege stops.

WHY THE MARKS CANNOT REACH THREE CRISES (`src/domain/display/crisisStoppedRow.js`):
- `STOPPING_CRISES` is `under_siege`, `plague_onset` and `famine`; **wartime is not one of them.** No row is ever marked for a war, so every war line of LAW 2 (iron, animals) is unmarkable today.
- A famine stops only the failed food (`stoppedBy`). With no failed source it stops grain, so a siege-and-famine town with no herds of its own never marks its meat (C3231).
- No crisis marks law and order (C42116).

## 6. FOR THE OWNER, IN PLAIN WORDS: PENDING
