# BAR3-PLACES · hand-back (2026-11-15)

Base: the joined line at 59185b62a (read back from origin; the tip the prompt named). Branch: `lane/bar3-places-2026-11-15`, one batch, one commit. Work in a scratch worktree; the census's 720 run once before (at 59185b62a) and once after (at the batch's tree).

## The rulings worked to

BRIEF-BAR2 (the method) with BRIEF-BAR3's amendments 1-9; my section's directions H1-H6, copied here and each MEASURED FIRST:

- (H1) THE ARRIVAL'S VIGNETTES UNDER A STATE THAT DENIES THEM: a runner out of the side gate, a dog driving animals across the road, lanes of stalls all speaking at once, market day filling with buyers by road, a broker matching buyers to goods, visitors treated as arriving: under a siege, an occupation's curfew, a famine, or where no market stands; a wine shop, a temple district or a mages' guild the houses do not hold; bolts of cloth in every yard where little cloth is made.
- (H2) THE CROWN IN A SOVEREIGN CITY ("<town> is in a kingdom at war and doing well out of it..."; "A crown officer has arrived with requisition orders..."; "the crown's officers" on the roads) where the settlement answers to no higher lord; "doing well out of it ... merchants getting rich" where prosperity falls or the merchants are suppressed; "founded by royal decree" beside "no overlord".
- (H3) HISTORY AGAINST THE TOWN'S OWN AGE AND FOUNDING: a collapse "the settlement was built upon" dated at the town's own age; "Founded on the bank..." against the founding reason; two events each given as what shaped the city; a trade label's mark printed inside history prose ("(taxed by occupation)"); "Last century" for thirty-two years ago.
- (H4) A HOUSE'S DESCRIPTION AGAINST THE RECORD: a brewery that "sends beer across the region" where no beer is exported; furs "from northern settlements" where they come from the town's own grounds; a mint's seigniorage with no coinage income; a vintner who "bought the vineyard" where no grapes grow.
- (H5) TITLES THAT DO NOT FIT THEIR HOLDER'S SEX, STILL ("Lord Mayor", "Lord Warden", "Lord Marshal", "Headman", "Dairyman", "Merchant Prince", "Brewster", "Beemaster" for the other sex; each printed in several places of a town): the titles' leaf holds the form: find which writers still print the raw title and send them through it.
- (H6) THE TOWN'S TENSIONS TAGLINE ("The tensions here are the domestic kind..."; "Stable enough that its tensions are the slow kind...") where the record's live tension is of another kind; "Things are fine." under Dangerous and a legitimacy crisis; "A quarrel goes to the heads of the oldest families, and most are settled before they come to blows." where violence is routine.

Measured first, by direction (the census's 720 at 59185b62a; the readers' towns born alone):
- H1: TRUE where measured. The runner prints in 3 towns, all under a siege (3/3 false); the broker of far goods in 10, 7 with no market house; the lanes of stalls in 8 (1 besieged); the dog and the covert grain route print in no besieged town of the 720 (0/14, 0/16): the state lives in the readers' towns (bar0-hamlet-under_siege-rand-6, bar0-city-under_siege+famine-rand-8 and the wide read's three), where each was false; cured there and for the state wherever it prints.
- H2: THE PREMISE HOLDS ONLY IN THE READERS' TOWNS: of the 720, 20 hold a City-state government and NONE of them is at war, so the crown's lines are false in 0 of the 720's printers and in every sovereign city at war the readers met (bar0-city-wartime-rand-7, -13, -14). Cured by rewording the war's whole crown class to claim no crown and no kingdom (true wherever it prints), so no new atom: my ask for `sovereign` was withdrawn to the chair. "Doing well out of it" where prosperity falls (C36830's second half): LEFT (below).
- H3: the mark inside history prose: 0 of the 720 (an occupation's mark; the read town only); the collapse "built upon" at the town's own age: 4 of the 88 trade-collapse events of the 720 fall within five years of the age. "Founded on the bank" (C30340), two events each "what shaped the city", "Last century" for 32 years: NOT REACHED (below).
- H4: the furs line prints in 177 towns and claims a northern origin in every one (the chain is the town's own hunting grounds wherever it prints); the beer line in 9+11; the seigniorage claim in 47; a royal charter in 4. The vintner's line (C18117) already hedges ("when either comes to the cellar"): STRUCK. The caravanserai (C54334): its services stand without camel herds: STRUCK.
- H5: NOT REACHED (below). The leaf's own header rules that an office's title (Lord Mayor, Lord Marshal) is the office's and never takes a holder's form: the premise for those two is against a standing ruling, and the chair's word is needed before a writer is sent through the leaf for them.
- H6: the two taglines print in 10 and 4 towns; both claimed the town's whole tension of one kind (and "Stable enough"): reworded to claim the oldest quarrels only. "Things are fine." (`src/data/dossierStateProse/economy.generated.js:2755`) and "A quarrel goes to the heads of the oldest families..." (`src/generators/safetyProfile.js:1016`, `src/generators/safetyLineTruth.js:154`) are other seats' files: NAMED (below).

## Batch 1 (one commit): the war names no crown; the arrival, the crisis secrets, the history, the houses and the tensions claim no more than the record bears

Cures, at their writers (every line in the form its file already uses):
- H2, the crown class (wartime): `stressTypes.js` the crisis hook ("An army requisition officer has arrived with orders..."); `stressNarrative.js` WARTIME_VARIANTS ("<N> is at war and doing well out of it", "<N> is fighting a war it may not win", "on army requisition"); `crisisSummaryVantage.js` the wartime vantage pools (eight lines: "is at war", "the army's officers", "the war asks", "An army requisition officer"); `narrativeData.js` STRESS_DESCS.wartime (the army seal; "This is a war's traffic, not trade's" for C52131's market city; "when the army returns them"); `narrativeText.js` ("the war chest is paying"); the town mint's royal charter (`institutionalCatalog.js`).
- H1: `narrativeData.js` the siege's runner (a face at the gate's grille, the gate stays shut) and the occupation's busy streets (orderly); `arrivalProse.js` the wine shop (drinks for the whole room), the broker of far goods (needs a market), the lanes of stalls (a town's, not under a siege), the dog on the road (not under a siege), the cloth in every yard (the yards), the living from the ground (part of the living), the press of the lane; `stressInstitutionEffects.js` the famine's covert grain route refuses a siege and its slot takes a declared twin (a cellar laid in before the siege; reached by resolution, no draw moved), and the famine's "export decisions" claim no export.
- H3: `historyGenerator.js` the exports the history reads are stripped of their trade mark (the three marks `tradeMarkOf` reads); a trade collapse within five years of the town's age takes its founding twin, draw-free.
- H4: `institutionDescVariants.js` the brewery pair (no beer beyond the town); `institutionalCatalog.js` the mint (seigniorage while metal reaches the dies); `supplyChainData.js` the furs' entrepôt note (no northern origin).
- H6: `narrativeText.js` the two taglines; `narrativeGenerator.js` genCoherence (C18651: the tithes' holder "has a say the official seat must reckon with", not more power than the seat).
- The declaration ledgers (`docs/census/declarations/*.json`) re-keyed by identity for every reworded text (the form of e1f09df15).

Rows (towns before -> after on the 720, the inventory diff):
- CURED, GONE: C14378 177->0; C13819 47->0; C8742 33->0; C2300 22->0; C30302/C2355 14->0; C9952 11->0; C24238/C33769 10->0; C29348 9->0; C0013/C21235/C52132 6->0; C53735 6->0; C24620 4->0; C8717/C34091/C36830 4->0 (the kingdom half; see LEFT); C4391/C6106 3->0; C35876/C5844/C17218 1->0 (the export claim; C5844's slash label: NAMED).
- CURED, FEWER by exactly their false state: C24627 10->3 (the three hold a market); C13759 8->7 (the besieged one).
- CURED in the readers' towns only (0 in the 720; guarded on the town read): C5938/C14995/C17349/C3989 (the siege's covert route: the twin), C13758 (the dog), C30299 (busy streets), C31794 (the mark), C15699 (the collapse at the founding: 4 towns of the 720 take the twin), C52131 ("not a market city's traffic": reworded).
- STRUCK: C18117 (the vintner's line hedges its fruit); C54334 (a caravanserai's water, fodder and protection stand without its own herds); C46403 (the temple district: its declaration's `institution: temple` reads every house of worship, the vocabulary's own reading; the city holds parish churches and monasteries); C35910 (a person who helped cause a shortfall is true of a failed fishery as of a field).
- OTHER LINES SILENCED: none beyond the rows. THE INHERITORS READ (the widest twenty): the twenty are the reworded lines themselves (each true where it prints: read in the towns below) and, where the broker and the lanes were refused, the arrival paragraph's own redraw ("Two partners go over their accounts...", "Travellers are offered water...", "People draw water in an order nobody needs to explain."), true in every state; one wartime hamlet (r2s-wartime-hamlet-2) redrew its stress vignette on the same paragraph's substream (the horses -> the noticeboard; both true there): the arrival's redraw-once moves nothing outside its paragraph by design.

### The guard

`tests/generators/bar3PlacesRows.test.js`: 34 CURED pairs (22 on the census's seeds, 12 on the readers' towns), each RED at 59185b62a (run there: 34 of 34 failed) and green at the tip; 4 KEEP rows (the dog where no siege stands, the lanes in a market town, the broker where a market stands, the covert route where no siege stands), green at both; one pool arm (the wartime vantage pools hold no crown and no kingdom), red at the base. The base's own run is the plant.

### Every new or changed line (the veto list), with three towns it is read in

| line | read in |
|---|---|
| "An army requisition officer has arrived with orders that will strip the settlement of something it cannot spare..." | r2r-hamlet-5, r2r-metropolis-4, bar0-city-wartime-rand-7 (sovereign) |
| "<N> is at war and doing well out of it: army contracts pay..." / "<N> is fighting a war it may not win." / "Supply caravans pass through on army requisition." | r2s-wartime-village-0, r2s-wartime-city-1, bar0-city-wartime-rand-13 (sovereign); r2r-hamlet-5, r2r-hamlet-53, r2r-metropolis-4 |
| the wartime vantage pools (eight lines: "is at war: army carts pass through", "now that the war has come", "much of the money there is", "the war asks", "the army's officers" x2, "The war makes its demands", "An army requisition officer wants more") | r2r-hamlet-53, r2r-thorp-32, r2r-metropolis-4 |
| "At the gate a clerk with an army seal records what comes and goes. This is a war's traffic, not trade's." | r2s-wartime-town-0, bar0-city-wartime-rand-9 (the market city read) |
| "...the receipts do not say when the army returns them." | r2r-hamlet-5, r2r-hamlet-53, r2r-thorp-11 |
| "...the garrison is reinforced, and the war chest is paying." | r2s-wartime-city-1 |
| "A face shows at the grille of the small side gate, sees your group, and is gone." | r2r-metropolis-14, r2s-under_siege-metropolis-2, bar0-city-under_siege+famine-rand-12 |
| "The market is open, the streets are orderly, the gates are attended by soldiers whose armour is not local." | bar0-town-occupied-rand-7 |
| "A patron stands drinks for the whole room, and makes sure everyone knows who is paying." | r2r-city-3, r2r-city-44, bar0-town-occupied-rand-7 (occupied) |
| the broker of far goods now needs a market; the lanes of stalls need a market and a town, not under a siege; the dog not under a siege (conditions only, no words changed) | r2s-monster_pressure-city-0; r2r-city-32; r2r-hamlet-18 |
| "Bolts of cloth hang drying in long bright strips across the yards." | r2r-city-20, r2r-city-29, r2r-city-31 |
| "Part of <N>'s living comes out of the ground, and its dust is on the doorsteps nearest the workings." | r2r-city-18, r2s-insurgency-village-1, r2s-insurgency-village-2 |
| "The smell of incense drifts out into the lane." | r2r-hamlet-20, r2r-hamlet-42, r2r-thorp-11 |
| the famine secret's siege twin: "Laid in a cellar of {food} before the siege closed the roads, and is selling it at triple the official price after dark" | bar0-city-under_siege+famine-rand-8 (siege and famine) |
| "Has documentation proving the famine was made worse by decisions taken by {faction}, and has been paid to lose it" | r2r-city-44, r2r-village-24, r2s-famine-city-0 |
| the brewery pair: "...supplying the town's taverns. It eats grain..." / "It keeps the taverns stocked, and stands among the larger buyers..." | r2r-town-18, r2r-town-28, r2r-town-34 |
| the mint: "Its seigniorage is revenue while precious metal reaches the dies." / the town mint: "...under the charter of whoever rules. Revenue for the granting authority while metal comes in." | r2r-city-13, r2r-city-15, r2r-city-19; r2r-town-1, r2r-town-2, r2r-town-11 |
| "Furs travel from the hunting grounds through trading posts, and the settlements along the route profit from the trade." | r2r-city-0 (smallest reach the chain's tier), r2r-city-1, r2r-city-10 |
| "The trade the settlement was founded to serve failed within its first few years, and the wealth it was meant to carry never came" | r2r-city-17, r2r-hamlet-34, bar0-hamlet-under_siege-rand-8 (siege) |
| "Beside whatever else divides it, its oldest quarrels are the domestic kind (...)" / "Its oldest tensions are the slow kind: ..." | r2r-city-36, r2r-hamlet-29, r2r-metropolis-10; r2r-city-18, r2r-hamlet-17, r2r-hamlet-51 |
| "...Whoever controls trade and tithes has a say the official seat must reckon with." | r2r-town-8, r2r-metropolis-3, r2r-metropolis-24 |

## Rows named for other seats

- C5844 (BAR3-PEOPLE or BAR3-LABELS, the `{faction}` slot's filler): "decisions taken by Military/Guard": the slot prints the slash-joined roster label as a power's name; the leaf is `src/domain/display/powerSentenceName.js`; the filler is `src/generators/npcGenerator.js`'s crisis-secret slot (another seat's file).
- C18650 / C18651's premise (the seat holding `src/generators/safetyProfile.js`): the flag `safetyProfile.flags.theocraticEconomy` stands where the religious power is Minor and the tithes 7% (bar0-metropolis-calm-rand-7); my sentence now claims less, but its first clause ("Economic activity flows through religious institutions") is the flag's.
- H6 (the seat holding `src/generators/safetyProfile.js` and `src/generators/safetyLineTruth.js`): "A quarrel goes to the heads of the oldest families, and most are settled before they come to blows." where violence is routine; (BAR3-LABELS, `src/data/dossierStateProse/economy.generated.js:2755`): "Things are fine." under Dangerous and a legitimacy crisis.

## Gates at the tip

eslint on every touched file: green. The strict-domain gate: green. The type ratchet: green (167, ceiling 167). The presumed-things register: the stale rows my rewordings left (14 of the widened register, 2 of the first) went out by `node scripts/presumed-things-door.mjs --shrink` in this commit (PT3). The guard: green at the tip, 34 of 34 CURED red at the base.

## The books (amendment 2)

The twenty law suites, each run ALONE at the tip: 14 green. SIX red, each run alone at 59185b62a too: `pipelinePinnedMode`, `generationForkCensus`, `presumedThings.walker`, `writerReach.walker`, `proseWiringCensus.walker`, `engineCoreLazyEdge`: RED AT BOTH WITH THE SAME ARMS: the base's, not mine (one arm of `proseWiringCensus`, "every holder-table citation is a live producer write" (`yearsAgo -> historyGenerator.js:328`), was red at my tip only: my lines shifted the cited line; CURED at its cause: my helper moved to the file's end, the cited lines 159-905 stand where the base has them). `engineCoreLazyEdge`'s red (`ironAtHand.js -> crisisKind.js`) is the base's (red there, same message).

The presumed-things walker's FRESH hits of my reworded lines (PT3: each reworded line names only what its old line named, true where it prints; NAMED for the close): `institutionDescVariants.js` the brewery pair (`house: tavern`, `house: brewery`: the brewery stands, the taverns as before); `narrativeData.js` the occupation's orderly streets (`armedForce`, `streets`) and the wartime road (`openTrade`); `stressInstitutionEffects.js` the famine's decisions (`famine`); `supplyChainData.js` the furs (`resource: hunting_grounds`, printed only on that chain); `narrativeText.js` the war chest (`garrison`, `war`: the line needs a garrison); `stressNarrative.js` and `crisisSummaryVantage.js` (`war`: printed only under the wartime crisis). (The walker's `powerSiblings.js` / `claimStanding.js` / `rulingStructure.js` "City watch" hits are the base's.)

The test files that pin a text I changed (13, by `grep` of the old texts), run at the tip: four re-keyed by identity in their own form (`stressNarrativeDeclared`, `stressSummaryDeclared`, `w2FixData12Rows`, `tailCrisisBatch5`: the old texts replaced by the new, no arm changed), one re-keyed by its text beside a dated note (`arrivalIndebtedDistrictTwin`); all green after but two:

### The books my cures move (NAMED, not re-taken)

| test | arm | old | new | door | batch |
|---|---|---|---|---|---|
| `tests/generators/crisisFoodWord.test.js` | "no food secret reads the export slot": the count of famine/siege/war secrets carrying `{food}` | 4 | 5 (the covert route's siege twin) | the file's own count; the close | 1 |
| `tests/data/tailHistoryBatch4.test.js` | KEEP: the broker of far goods "still prints" in `r2r-thorp-43` | prints | refused (the thorp holds no market: the cure's own measure; the line prints in the 3 market towns) | the row's address; the close | 1 |
| `tests/property/generatorGoldenMaster.test.js` and the golden surfaces | the 525 reference configurations | - | 83 of 525 move AGAINST 59185b62a: `institutions` 46 (the house descriptions: mint, brewery), `economicState` 37 (the furs' entrepôt note), `arrivalScene` 1 | the golden's door | 1 |

## Guards owed

None of mine: the batch's guard is committed.

## What is left, in order

1. H5, the titles (C46800 "Lord Marshal" for a woman, C6627 / C6113 "Lord Mayor", C4398 "Lord Warden"): the leaf `src/data/holderTitleForms.js` rules an office's title the office's, never a holder's form; a ruling is needed (the chair's) before the office titles take a form; then `narrativeGenerator.js:550` (`topNPCRole`), `institutionalCatalog.js`'s connection line and the people's mints are the writers to send through the leaf. Not measured on the 720.
2. H2's second half: "doing well out of it ... merchants with the right friends are getting rich" where prosperity falls and the merchant guilds are suppressed (C36830): the profit text's renderer condition (`stressNarrative.js`) reads prosperity ≥ moderate only; measure the falling band and the suppressed guild on the 720 first.
3. H3's rest: C30340 "Founded on the bank..." (ORIGIN_POOLS, 28 towns) against the founding reason; "two events each what shaped the city"; "Last century" for 32 years ago: not measured.
4. C34042 (the fish trade "has never paid better" beside a strained fish trade, `narrativeText.js` PRESSURE_SENTENCES) and C36357 (`foodways.js` SOURCE_PHRASES, "Most meals start from game" with no hunted share): not reached.
5. C26792 (`historyData.js` byMemory: "the right to rule is openly questioned" beside an Endorsed legitimacy): not reached.
6. The rows named for other seats (above).

## Instruments

As the predecessor's: `git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` and `origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` into the scratchpad; `census3.sh <tree> <out> 4` (about 21 minutes); `inventory.py <out> before.json`; `inventory_diff.py before.json after.json <the eight worklists' rows, concatenated>`. The readers' towns: `TREE=<tree> OUT=<out> SEEDS=<file> node <CENSUS-3>/births.mjs` (with `node_modules` linked into `<out>`). The 525 hashes: a scratch test file (never committed) that births `goldenCorpus()` and writes each record's whole and per-field hash, run in both trees.

## The hand-back's state

Final: pushed with batch 1. After this push I push nothing more.
