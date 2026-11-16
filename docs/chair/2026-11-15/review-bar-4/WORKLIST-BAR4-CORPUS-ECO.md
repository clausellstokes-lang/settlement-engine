# WORKLIST · BAR4-CORPUS-ECO

10 rows: 5 STANDS, 4 WEAK, 1 LEFT-BY-BAR3.

STANDS: a real contradiction by the strict second check (the page against its own town). WEAK: one loose word (cure where one word settles it; never rewrite a true line to chase a tone). LEFT-BY-BAR3: a row the round before left, with where its measure is. A FLAG IS STILL A CANDIDATE: verify each row by the record before you cure it. The read towns are NOT among the 720: bear one alone to see its record (`docs/chair/2026-11-14/probes/READ-ALL/packets10/seeds.bar4.txt`). The writers below were traced by the chair with `grep -F` of the fixed words under `src/` at 640266f64: check each.

## C26403 · STANDS · bar0-metropolis-calm-rand-22 · Systems/Economics

> The metropolis leans first on its fishing for its food, so a bad season for the fishing is felt at every table.

WHY: THE CHAIR: the same page says 'It has worked out its river fisheries.' (C26653) and 'Short of fish': one rule with C30469 in the sister metropolis || the checker (EXPLAINED): In the record, all of the 54% grown locally is fish, and fishing is the only food chain running. The fishery is depleted and the chain vulnerable, which is exactly why the sentence warns that a bad fishing season is felt at every table; it claims no abundance. The readers' premise (fishery depleted) is true, but it does not make the sentence false.
- evidence: foodSources: ["fish"], activeChains: ["Fishing & water"] — record s.economicState.foodSecurity
- evidence: What it puts on the table itself is fish from the local waters. — record foodRecord.foodwaysLine
- evidence: River Fishing [vulnerable; its resource River fisheries depleted] — cal-10.txt LAND
- evidence: magicNote "Temple fishing rites improve depleted catch" — record river_fishing chain
- writer (the words "leans first on its"): src/data/dossierStateProse/economy.generated.js

## C30469 · STANDS · bar0-metropolis-calm-rand-23 · Systems/Economics

> The metropolis leans first on its fishing for its food, so a bad season for the fishing is felt at every table.

WHY: The page itself says the fishery is fished out and fish is bought in, so the town cannot lean first on its fishing. The line comes from the record's food ledger, which still names fish as the only home food source against its own depleted fishing grounds: a record split, but the page sentence contradicts the page.
- evidence: Fish & Maritime Produce The fishery here is fished out; the fish sold now is salted and bought in. — cal-11.txt C30411
- evidence: Little is left worth taking from the fishing grounds at Tzulcoatl this year — cal-11.txt C30703
- evidence: Fish market: Short of fish — cal-11.txt C29677; LAND: Fishing Grounds (depleted); imports Salted fish (local sea fisheries exhausted)
- evidence: foodSources ['fish'], foodwaysLine 'Its own food is the day's catch.' — record s.economicState.foodSecurity.foodRecord (the source of the line)
- writer (the words "leans first on its"): src/data/dossierStateProse/economy.generated.js

## C33209 · WEAK · bar0-thorp-calm-rand-21 · Systems/Economics

> Quirigche leans first on its hunting for its food, so a bad season for the hunting is felt at every table.

WHY: THE CHAIR: 'leans first on its hunting' beside holdings tilled for the table: an emphasis, the weaker twin of C33207 || the checker (EXPLAINED): 'Leans first on its hunting' leaves room for the smallholdings as a second source, and hunting is the record's food source. The reader's point that foraging areas are absent does not touch hunting, whose grounds are available. 'Harvest 100%' is income, not food.
- evidence: "foodSources": ["game"], activeChains ["Hunting & foraging"] — record s.economicState.foodSecurity
- evidence: Hunting Grounds (available) — cal-12.txt LAND
- evidence: Each family tills a small holding, all of it for the table. — cal-12.txt C33132
- writer (the words "leans first on its"): src/data/dossierStateProse/economy.generated.js

## C19130 · STANDS · bar0-hamlet-under_siege-rand-21 · Systems/Economics

> Balcombe's food comes from more than one source, the grain harvest most of all, so a poor year in one does not empty the hamlet's tables.

WHY: The first half is true: the record has two food sources, grain and fish. But the sentence's reassurance that one poor year 'does not empty the hamlet's tables' is denied by the lines just above it, which put the hamlet in deficit with hunger already here. Under the siege and a 63% gap, that comfort is false.
- evidence: FOOD: the word the page prints Deficit · grown 38% · gap 63% · stores 1.6 months — cal-07.txt FOOD
- evidence: Most households go short, and hunger is already here. — cal-07.txt C19126
- evidence: Nothing has come into Balcombe since the siege closed the roads, and what the hamlet can still grow is not near enough. — cal-07.txt C19129
- evidence: foodSources ["grain", "fish"], diversityNote "two food source types" — record s.economicState.foodSecurity
- writer (the words "so a poor year in one does not empty"): src/data/dossierStateProse/economy.generated.js

## C20588 · STANDS · bar0-hamlet-under_siege-rand-23 · Systems/Economics

> Its food comes from more than one source, the herds most of all, so a poor year in one does not empty the hamlet's tables.

WHY: THE CHAIR: the same sentence under the same state (a siege, FOOD Deficit) was held to STAND at C19130 by another checker: one rule for both: a calm-times reassurance printed while the tables are short || the checker (EXPLAINED): The line is about a poor year in one source, and the record does give the hamlet several (herds, river fish, 26% by magic). The present hunger comes from the siege cutting the trade, as C20586 says, not from one source failing, and 'does not empty the tables' is not 'no one goes short'.
- evidence: River Fisheries (available); Open Grazing Land (available) — header LAND; by magic 26% — header FOOD
- evidence: Meat and milk from the herds and the day's catch anchor the table. — cal-08 C20584
- evidence: The trade that fed Darhankul is shut out by the siege — cal-08 C20586
- writer (the words "so a poor year in one does not empty"): src/data/dossierStateProse/economy.generated.js

## C13374 · WEAK · bar0-city-wartime-rand-22 · Systems/Economics

> It is not a subject anyone raises unprompted.

WHY: 'Not a subject anyone raises unprompted' is a stock calm line (the same pair prints in Secure Uaxacatl). Here it stands under a printed Pressured word, a 3% shortfall and wartime, which it softens. With the band secure, 8.7 months in store and nearly every household fed, it is a matter of tone rather than a false fact. The grain-monopoly line the reader cites (C12509) is a plot hook.
- evidence: FOOD: the word the page prints Pressured · band secure · gap 3% · stores 8.7 months — cal-05.txt FOOD
- evidence: Short: 609 lbs/day — cal-05.txt C13366
- evidence: nearly every household is fed, and a bad season would leave some of them short — cal-05.txt C13369
- evidence: CRISIS: Wartime — cal-05.txt
- writer (the words "not a subject anyone raises unprompted"): src/data/dossierStateProse/economy.generated.js src/domain/coherence/crisisBlindFindings.js

## C30692 · STANDS · bar0-metropolis-calm-rand-23 · Systems/Economics

> The shadow trade at Tzulcoatl is small, but it is not casual: somebody organises it.

WHY: The page calls the same unrecorded trade 'small' here and 'not small' in Power; with an 11% share, a powerful thieves' guild and an underground city, 'small' is the false one.
- evidence: A share of what arrives at Tzulcoatl never appears at the gate, and the share is not small. — cal-11.txt C30831
- evidence: Shadow Economy: 11% of trade unrecorded — cal-11.txt C30683
- evidence: Criminal Syndicate Revenue 11% (third-largest source); HOUSES: Smuggling network; Thieves' guild (powerful); Underground city; Whisper market; Assassins' guild — header
- writer (the words "but it is not casual"): src/data/dossierStateProse/economy.generated.js
- writer (the words "is not small"): src/data/dossierStateProse/power.generated.js src/data/dossierStateProse/stressors.generated.js src/domain/certification/subsystemRowsSeat.js

## C43690 · WEAK · bar0-village-calm-rand-21 · Systems/Economics

> Miloka lives on one trade.

WHY: This is the page's concentration warning, and its substance is true: 71% of the money comes from the harvest, and a bad harvest year sinks the village. 'Lives on one trade' overstates that, since tithes and coal bring in the other 29%, and 'trade' is a loose word for farming. It is a matter of degree, not a false statement.
- evidence: Miloka lives on one trade. / It is doing well enough now, but if that trade has a bad year, the whole village has a bad year. — cal-17.txt C43690-C43691
- evidence: Harvest 71%, Church Tithes 20%, Iron & Metalwork 9% — header INCOME
- evidence: Harvest What the households grow and raise on their holdings — cal-17.txt C43687
- writer (the words "lives on one trade"): src/data/dossierStateProse/economy.generated.js

## C38176 · WEAK · bar0-town-calm-rand-23 · Systems/Economics

> Apothecary & Alchemy A thriving alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.

WHY: The trade is real and exported, so customers from other settlements fit, and its inputs are imported. But 'thriving' is too strong a word for the town's smallest income share (5%), from a shop marked Vulnerable that lacks both of its inputs. The fault is one word of degree, not a false statement.
- evidence: Apothecary & Alchemy 5% — cal-15.txt INCOME (the smallest share)
- evidence: Alchemist shop exists but lacks access to medicinal herbs; ... hot_springs_mineral — cal-15.txt LAND gaps
- evidence: exports: ... Alchemical trade (potions, reagents) — cal-15.txt TRADE
- evidence: Alchemist shop / Vulnerable — cal-15.txt C37803, C37805
- writer (the words "A thriving alchemical trade"): src/generators/economy/incomeLineSiblings.js

## C47622 · LEFT-BY-BAR3 · (3 of 78: see BAR3-DEFECON-2-HANDBACK.md) · Summary/Outlook

> …at a price the settlement cannot pay in coin.

WHY: LEFT by BAR3-DEFECON-2 ('not measured by me; left, in order'): MODERATE_GAP_TWIN's hook beside a STRONG economic survival.
- writer (the words "cannot pay in coin"): src/generators/economy/foodBalance.js src/generators/economy/outlookHookSiblings.js
