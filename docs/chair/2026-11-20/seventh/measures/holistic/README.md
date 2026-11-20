# A holistic count of freshly born towns (the seventh chair, 2026-11-20 07:52 UTC)

Taken to answer the owner's question of 2026-11-20 ("tell me about your expectation of generated settlements
holistically") from the towns and not from memory. EXECUTED by the chair in its own container.

- THE TREE: the chair's copy of the working line at `7f18b9edb94e395134839e6bb6931cd587ccdcfd` (points 77 and 78 merged: the names work and the
  first titles table; the seat's law, the session sheet's frame and the traditions' descriptions are NOT in it).
- THE BIRTH: the names walker's own recipe (`tests/lint/namesInSentences.walker.test.js`):
  `loadGenerationLawPayloads()`, then `generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} })`.
- THE TOWNS: a prefix nobody tuned to. UNTOUCHED: `{ ...DEFAULT_CONFIG, settType }`, seeds `hxd-<size>-<i>`, 50 a
  size (300). EVERY DIAL RANDOM: the page census's `DIALS` over it, seeds `hxr-<size>-<i>`, 25 a size (150).
  At untouched settings culture, trade access, monster threat and the crisis are already random; the five
  priorities stand at 50.
- RE-RUN (about one minute each, from the line's checkout): `node batch.mjs <line> 50 25`; `node batch2.mjs <line> 50`.
- THE OUTPUTS: `batch.out.txt` (size by tier, state, government, culture, the capture rung, and SAMENESS with names
  masked); `batch2.out.txt` (legitimacy by tier, all and born under no stress, with the breakdown's means; repeated
  lines INSIDE one town by tier; one example).

WHAT IS A CRUDE PROXY AND NOT A MEASURE: the masking (a town's own names, roles, houses and powers replaced by a
mark; digits by #) under-counts a repeat whose names it fails to mask and over-counts none; the "secret that does not
fit its holder" figure is one keyword family only (a floor; the true rate is unknown). Sample sizes are 50 a size
(30 to 37 born under no stress): a share is good to about fifteen points; the gradient by size is far outside that.

ALSO READ, WHOLE: `docs/chair/2026-11-20/content/NAMES-2-PAGE-AFTER.txt` on the line (one town's whole page).

## Added 2026-11-20 09:26 UTC: how often a ruler's title becomes a culture word

`titles-reach.mjs <line> 50` on the same 300 untouched towns, at the chair's copy of the line at `930459173` (the three
titles passes merged: 259 of 726 cells authored). For each town the family of its form of government
(`officeFamilyOfForm`), then `officeTitleIn` with the town's culture and with none: the word differs in 166 of 300
(55%): thorp 40%, hamlet 46%, village 56%, town 66%, city 62%, metropolis 62%; by culture from 88% (slavic) to 32%
(east_asian). The unchanged towns are mostly the elders' family (73 of 134). NOT COUNTED: a sovereign's own seat (the
count passes `sovereign: false`); the table is called by nobody on the line yet, so this is what the page WOULD
print once the seat's lane wires it. Output: `titles-reach.out.txt`.

## Added 2026-11-20 09:38 UTC: goal wordings against demand, and the four causes read in the code

`goal-pools.mjs <line> 50` on the same 300 untouched towns: for each kind of goal (`goal.intent.<short|long>`:
family/kind) the distinct wordings seen (names masked) against the most people of ONE town drawing that kind. SHORT
GOALS: 57 kinds; 3 too thin for their busiest town (RANK/enter 12 wordings against 19 people; TIES/rival_enemy 8
against 13; TIES/ally 5 against 10); repeats NO re-deal could avoid with today's wordings: 162 of 8,996 (1.8%),
against the 17 to 23% of a city's people who repeat a wording today. So a draw without replacement inside one town
removes about nine repeats in ten, and about 20 to 30 authored wordings the rest. A FLOOR: the wordings counted are
those the 300 towns happened to draw; the true pools are at least as large. Output: `goal-pools.out.txt`.

THE FOUR CAUSES, READ BY THE CHAIR FOR THE OWNER'S QUESTION OF 09:36 ("What are your solutions"):
- fortune: `src/generators/economy/prosperity.js :: computeBaseProsperity`: a sum of the route's base, a TIER BONUS
  (0, 0, 0, 1, 1, 2), a magic bonus scaled by tier, an income-diversity bonus (more sources at larger sizes), a
  depth bonus against a tier expectation, threat and food: capped at Prosperous, where large places saturate.
- standing: `src/generators/factionDynamics.js :: computePublicLegitimacy`: 50 + prosperity (-20 to +20, NOT scaled
  by tier) + safety + defence and food (BOTH already scaled by tier, with the comment that a small place being
  vulnerable "is NORMAL, not governance failure"); bands at 75, 60, 45, 30 (`src/data/bandLadders.js`).
- named people: `src/domain/density/densityBands.js :: DENSITY_BANDS`: mass 1 to 2 at a thorp, 2 to 4 at a hamlet
  ("the owner's historical scale"; a draft under signature).
- the form of rule: projected from the strongest power (`src/domain/rulingPower.js :: GOVERNMENT_PREFERENCES` by
  archetype and tier); it does not read the town's culture.

## Added 2026-11-20 09:47 UTC: is there a named person for every place that should carry one? (the owner's question)

`faces.mjs <line> 50` on the same 300 untouched towns: places a town holds; of them the places whose catalogue row
carries a face (`src/data/institutionalCatalog.js :: faceOfInstitution`); named people. By size: thorp 8.0 places,
1.6 with a face, 1.3 named people; hamlet 10.9 / 3.4 / 3.4; village 14.4 / 9.0 / 7.7; town 31.6 / 25.5 / 23.9; city
68.3 / 61.0 / 60.0; metropolis 92.9 / 85.4 / 83.8. `faces2.mjs` prints two thorps and a village whole: WHERE THE
PEOPLE ARE FEWER THAN THE FACED PLACES, ONE PERSON HOLDS TWO (the elder is the boat-master; the priest stands for the
parish church and for the row "Priest (resident)": 50 of 50 villages hold that row and 50 hold a named priest). SO
THE OWNER IS RIGHT: every appropriate place has its named person at every size; a thorp is thin because about 2 of
its 8 places are of a kind that has a keeper. THE CHAIR'S PROPOSAL (3) OF 09:41 (a floor of two named people at a
thorp) IS WITHDRAWN. The match in `faces.mjs` is by the person's own place key only, so its "without" column
over-counts (it cannot see a second place held by the same person, or the seat's building held by the ruler).
Output: `faces.out.txt`.
