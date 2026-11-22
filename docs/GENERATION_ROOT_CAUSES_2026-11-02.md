# Generation root causes (2026-11-02)

> Saved to the repository on 2026-11-02 at the owner's word ("Save these files both the review and the audits to the repository"). Code citations are to branch `claude/ux-consolidation-2026-10-30` at `c0ef42c13` (PR #68). The probes, corpora and per-settlement files named below lived in the session's scratchpad and are not preserved; the figures they produced are recorded here.

All eight failures were reproduced. The investigators made fresh settlements the way the app does at c0ef42c13, and also re-read the audit's own files. Nothing in the repository was changed. A few counts differ from the report, or are not what they seem. Those are listed under "What did not reproduce as stated" at the end.

## The few reasons underneath

1. **Sentences state a fact without checking it.** Most text is a fixed line picked by something nearby, such as the economy grade, the trade route, a slider or the size label. It is not picked by the fact the line states. "The settlement is starving" fires on "short by any amount, on a road". "…undermine garrison morale" fires on the economy score. "No single creed holds sway" fires on "no patron god has been set". Nothing looks at what the line claims. This shows up in all eight failures.

2. **Nothing records one answer to each question, so each tab works out its own.** Six questions each have two to five separate writers that never compare notes: how much food is stored, whether there is a church, how much the place relies on magic, what defends it, who holds the seat, and what to call the place. Often the engine already has the right answer and the page doesn't read it. Examples are the months of stored grain, the defence roster, and the Elder who was created first as head of the place.

3. **Facts are guessed from words in names.** Many writers decide what exists by looking for a word in a building or faction name:
   - "Access to external mill" counts as a mill.
   - A 1st-level healer counts as a hospital.
   - "Access to parish church" (a walk to the neighbour's church) counts as divine magic.
   - A faction called "Military/Guard" counts as a garrison.
   - The list of ruler words has no "elder".
   - "Subsistence farming" counts as a market because it is filed on the Economy shelf.

4. **Stand-ins were never replaced.** Some things are created as placeholders and stay that way:
   - office-holders named "The Lord Mayor" and "The Guildmaster";
   - factions named "Claimant Bloc A";
   - crises with no occupier, creditor or besieger behind them;
   - a church with no name;
   - monster threat with no creature.

   The newer design that replaces the office stand-ins, the Register VII density law, exists but is unsigned and switched off.

5. **Two base numbers are set so the alarm is always on.**
   - Food: every place, at every size, is modelled as one farm that at best feeds 92% of its people. Being short is therefore the normal state, and the "starving" hook fires nearly everywhere.
   - Merchants: guild strength comes from the economy slider, not from size or trade.

6. **The built-in self-check does not look at these connections.** It passes 389 of 389. Three investigators confirmed specific gaps:
   - No check mentions garrisons, walls or hospitals.
   - The only repetition guard counts NPC hooks inside one settlement.
   - A one-seat-holder check, if it existed, would fail 64 of 64 thorps.

   The other investigators recommend checks but did not confirm the gaps line by line.

| Failure | 1 Unchecked sentence | 2 No single answer | 3 Guessed from names | 4 Stand-ins | 5 Base number |
|---|---|---|---|---|---|
| 1 Food | main | main | part | | main |
| 2 Faith | main | main | | part (church has no name) | |
| 3 Magic | main | main | main | | |
| 4 Defense | main | main | main | | |
| 5 Rulers | part | main | main | main | |
| 6 Repetition | main | | | part | part (food hooks) |
| 7 Naming | main | | part | main | |
| 8 Size | main | main | main | part | main |

Repetition also has a cause of its own: small line libraries, and a "don't repeat" memory that lasts for only one settlement.

## Each failure

**1. Food says several things at once.**
- **The harvest is short by design.** 4 in 10 people farm, and each farmer feeds about 1.85 lb a day against a need of 2 lb (0.4 × 6 ÷ 1.3). The ÷1.3 is a hidden "storage buffer". Size never enters the sum, so villages never feed themselves and towns have no hinterland. The food code also claims to copy the geography terrain table but uses weaker values: plains 1.0 instead of 1.5, riverside 0.9 instead of 1.3.
- **The crisis hook fires on any shortfall.** One pound short is enough. It never checks the place's own food band, its stores, its size, or whether a famine was chosen.
- **Stored food has four answers:**
  - the engine's months of grain, which are never printed at first generation;
  - the Defense tab, which looks for a building with "granar" in its name;
  - the "N days of reserves" hooks, which are really the harvest share × 30;
  - prose that follows the prosperity level.
- **"Surplus" wording comes from the wrong things:** the number of exports, the prosperity level, or the size label.
- **"How short is short" has seven different cut-offs.**

Most telling: a fresh metropolis of 70,381 is 1% short. Its own band reads "Secure" and it holds 15 months of grain, yet it reads "The settlement is starving. Villagers are turning to banditry."

**2. Faith denies its own church.** The Faith tab asks one question: has this place been given a patron god? Since 2026-07-28 generation never gives one, because under your rule gods are custom content only. So the tab always takes its "no faith" branch. Its sentence was written on 2026-07-10 as cover text for an upgrade prompt, at a time when every seed carried hidden gods. Eighteen days later the hidden gods were removed, and the cover line became the only thing the tab ever says.

Meanwhile generation builds a full church that nothing passes to the Faith tab: parish churches, cathedrals, a Religious Authorities faction, a High Priest in every town and up, tithe income, and heresy trials. Premium viewers get "This settlement keeps no named faith" plus a reworded version of the same denial. The church itself also has no name, which is by your rule. But the page never says this is a blank for the DM to fill.

Most telling: the same denial appears whether the religion dial is at 0 or 100, in a thorp or a metropolis. It sits beside church evidence in 54 of 54 fresh and audit settlements, and in 120 of 120 in the larger corpus.

**3. Magic is described two ways.**
- **Some rows never ask whether magic is on.** The engine has one "does magic work here" answer, but each writer has to remember to ask it. The Overview's "Magical Capability" row and the Foundations "Magical stability" row don't ask, so a score of 0 grades "Critical" and a 50 grades "Adequate". The Defense tab's arcane row was patched for this once (T2-24); the rows next to it were not.
- **"Magic off" only means spells don't work.** The setup panel calls it "No. Historical mode", but to the engine it means only "spells do not function". The dragon is filed as a creature and the alchemists as a trade, so both are allowed in historical mode. Their odds do not change, and their wording (ancient wyrm, healing draughts, potion exports) was written for fantasy. Turning magic off actually makes alchemist quarters more common in metropolises, 43 of 60 against 11 of 60 at the default setting, because with magic on the mages' guild absorbs them.
- **"How much does it rely on magic" has three answers.** The role lines come from the slider alone: at 66, "integral", even with no practitioner. The reliance sentence comes from a flag that is set only during siege, famine or plague.
- **Five private word lists decide who practises magic.** They agree on one building name, and none of them reads the NPC list, so a Hedge Witch is never counted.

Most telling: in 36 of 36 magic-off settlements the Overview grades "Magical Capability · Critical". The generator itself has already set that score to 0 and dropped it from the readiness average because magic is off. Separately, 6 of 60 magic-off metropolises have "an ancient dragon" providing "Aerial deterrence".

**4. Garrisons, walls and hospitals that don't exist.** Sentences that mention a garrison, soldiers or walls are picked by other things: the economic score, the charter hall and monster threat, the readiness grade, the stress, or the size. None of them first checks whether a garrison or walls exist, though the engine's defence roster always knows.
- The upkeep note always calls the money "garrison pay". It is recorded for any defence at all, including a palisade, a watch or a charter hall.
- "Hospital present" comes from a flag that means "any healer or monastery".
- The Power tab treats any "Military/Guard" faction as a garrison, even when it is only an armed patrol in a hamlet.
- Every village gets a "Guard Captain" because of its size, whatever it actually has.

Most telling: a hamlet whose only defence is an adventurers' hall reads, in one row, "No walls or garrison… Upkeep underfunded: garrison pay at 96%."

**5. Who rules has no single answer.**
- **The seat is never written down.** The generator creates the head of government first (Elder, Mayor or Governor) and ties them to the governing faction. It never records that this person holds the seat.
- **The Power tab guesses, and its guess misses the Elder.** It guesses from title words, and its list of ruler words has no "elder".
- **The fallback seats stand-ins.** When the guess finds nobody, it takes any lone ruler-titled person in the settlement. In 12 of 63 hamlets that is an unnamed stand-in, "The Lord Mayor" of the Manor Household.
- **Larger places get several heads.** They can draw a Mayor, a Governor and a Reeve, all given the same head-of-government paragraph.
- **"The faction that appears to govern is not the faction that governs" names nobody.** It fires on a low legitimacy score, and nothing records who really governs. In 18 of 110 cases no stronger rival exists at all.
- **"Holds power" is overused.** It marks the ruler and up to three challengers.

Most telling: in a probe, adding the one word "elder" to the ruler list seats the governing faction's Elder in 61 of 61 unseated thorps, 47 of 47 hamlets and 12 of 12 "Lord Mayor" hamlets.

**6. Repetition.**
- **Many sentences are never chosen.** A writer holds one line for a situation and prints it whenever the situation is true, so every settlement in that situation gets the same words. Writers that run once per conflict, supply chain or leading NPC also repeat inside one settlement. These unchosen writers cause about half of the on-screen repetition.
- **Where lines are chosen, the libraries are small.** The "don't repeat" memory lasts for one settlement, and the NPC hook library is only 80 lines; a metropolis uses a third of it.

Most telling: the hook "A third party is escalating the conflict" appears exactly once per conflict in 120 of 120 settlements. Two towns with different culture, route, terrain and priorities share 24 of their 25 hook sentences.

**7. Unnamed people at the centre of the crisis.**
- **A crisis is only a label.** When a stress is rolled, nothing creates the occupier, creditor, besieger, claimants or revolt leader. The crisis text is one fixed paragraph per crisis type, and its only blank is the settlement's name, so it has to say "an outside power" or "the creditor".
- **Crisis factions carry working names.** Examples are "Claimant Bloc A", "Rival Faction B" with no Faction A, and "Unknown Faction (hidden)". The name doubles as the faction's identity and its type is guessed from it.
- **Nobody is created to lead them.** Ordinary villagers are drawn in at random, so the creditor's agent is a Miller and Claimant Bloc A a Shepherd. In 74 of 121 fresh crisis factions, nobody named is a member.
- **Office stand-ins are left as "The" + role.** A separate step creates them, and its own comment says a real name "could substitute later".
- **Monster threat has no creatures.** It is a three-step dial with no creature list behind it.

Most telling: across 184 regenerated crises, each crisis type has exactly one hook sentence, and none of the 184 names anyone.

**8. Small places written as towns.**
- **Wording.** The app knows each place's noun and can rewrite "the town" as "the thorp". But each screen has to pass the noun in, and the Economics, Services, Resources, Daily Life, History, Viability and Steadings tabs don't; the PDF does. The rewriter also leaves "a town", "every town" and "an ordinary town" alone, assuming they compare this place with somewhere else. In 63 of the 69 such phrases, they describe the place itself. Story text written at generation says "the town" outright.
- **Guild powers.** Small places may seat Merchant Guilds only if they have a market. But the check accepts any Economy-shelf building, and every thorp and hamlet must have "Subsistence farming", which is filed there. Merchant strength comes from the economy slider, not from size. Faction names and staff (Merchant Guilds, The Guildmaster) are the same at every size.

Most telling: for the thorp Ögedeiabad (28 people), the screen says "The roads into this town are busy and the town is poor" and the PDF says "this thorp… the thorp". Separately, 12 of 12 fresh thorps and hamlets pass the market check through "Subsistence farming".

## Fix shapes, smallest change with the widest effect first

**A. Check before saying it** (cause 1). These are small conditions and rewordings in existing writers, and they reach all eight failures.
- Magic rows ask the magic switch and step aside when magic is off. Put that check in the shared list of rows, so a new row cannot forget it. This fixes 23 of 23.
- Food hooks follow the food band:
  - "Starving" only for Deficit or Active Famine with little in store.
  - A grain-price hook for a moderate gap.
  - Nothing for a place that is fed.
  - "Villagers" only in small places.
  - "Days of reserves" counts real stores.
- Garrison words need a garrison and wall words need walls. Otherwise name what is actually there (militia, watch, palisade) or say nothing. Call the upkeep note "defence upkeep". "Guard Captain" and "Garrison Commander" only appear where a force exists.
- The faith line describes the church that exists and says plainly that its name and god are the DM's to set. Keep the "Awaken a living pantheon" upsell visibly separate.
- "Surplus" wording only when the place grows more than it eats.
- The note about who really governs names the faction that outranks the governing one, which is the case in 92 of 110. Otherwise it drops the claim. Challengers read "Contests the seat", not "Holds power".
- "Hospital" only for a real hospital.

**B. Stop guessing from names** (cause 3). A few tiny edits first:
- **Interim seat fix:** use the generator's own list of governing titles, which includes "elder", and match whole words. Never seat someone from another faction or an unnamed stand-in.
- The small-place guild check requires a real market.
- "Access to…" stand-ins don't count as having the building.
- The hospital flag is split into "real hospital" and "healer or infirmary".
- "Military/Guard" counts as a garrison only when a garrison exists.

Then replace the private word lists with what the building catalogue says each building is, so a Hedge Witch counts as a practitioner.

**C. Teach the self-check these connections** (cause 6). This is small and covers all eight failures. Each check should land with its fix:
- no surplus, stores or starving words unless the food record agrees;
- no faith denial beside a church;
- no magic words in historical mode;
- no garrison, wall or hospital words where there are none;
- exactly one named seat-holder, in the governing faction;
- no "town" for a place that is not a town;
- a measure of what a second settlement repeats, read off the rendered page.

**D. Record one answer per question, and have every tab read it** (cause 2). This is medium work.
- **One noun per page.** Apply it by default, as the PDF already does. In the probe this took a city's "town" lines from 76 to 0.
- **One food record.** It holds the share grown, the normal imports, the remaining gap, the band, the months stored and whether there is a granary. One set of cut-offs replaces seven. Print the stored months once.
- **What defends the place.** The engine's defence roster already holds the answer; every writer should read it.
- **Magic here.** Work out once who practises (buildings and NPCs) and what depends on them. "Integral" should require both.
- **One faith reading.** Built from the churches, the religious faction, the senior cleric and the tithes.
- **The seat-holder.** Mark one person at generation, and allow one head of government per faction.

**E. Fix the two base numbers** (cause 5). These move the golden files.
- **Food.** Small places on ordinary land should grow about 100 to 125% of what they eat. Towns and larger should be fed by a hinterland, treating the existing import shares (town 20%, city 38%, metropolis 52%) as normal supply. Use one terrain table and drop the hidden ÷1.3. In the probe, the terrain table and dropping ÷1.3 alone lift self-feeding thorps from 0 of 20 to 12 of 20. The result is still flat across sizes, so the size and hinterland term is needed as well. The headcount rescaling (X-46) and GS-3a do not move this.
- **Merchants.** Merchant strength grows with size and trade.

**F. Fill the blanks** (cause 4).
- **Office stand-ins.** Give them real names, wants and secrets, or drop the step, or sign Register VII. Register VII gives 0 role-only NPCs in 96, but it also cuts most crisis factions, and crisis texts still name nobody.
- **Sized role tables.** No Guildmaster in a thorp; "Lord of the Manor", not "Lord Mayor".
- **Cast the crisis when it is rolled.**
  - Create a named outside power and the person who fronts it, and for a famine, the real crop.
  - Give the crisis faction that power's name and a named head.
  - Rewrite the crisis texts with blanks for these, plus a few variants, which also cuts repetition.
- **Separate a faction's identity from its display name.** "(hidden)" and "Bloc A" become fields shown in plain words.
- **Monsters.** Add a small creature list by terrain and threat, and pick one or two for frontier and plagued places.

**G. Widen the libraries** (repetition's own cause).
- Say facts that are true of the whole settlement once, and build per-item sentences from that item's own facts.
- Conflict hooks come from small per-issue libraries.
- The leading-NPC paragraph gets variants, and a second faction member reads "works with X" instead of a copy.
- Every NPC detail goes through the "don't repeat" rule that tells and speech already use.
- Grow the 80-line NPC hook library.

**Decisions only you can make:**
- moving the golden files (the food change in E, and rewording the 63 "a town" sentences);
- signing Register VII, which changes what existing seeds generate;
- reopening the §815 seat rule ("never a merely-senior member");
- what "Historical mode" excludes: dragons, potion-selling alchemists, and whether mages' guilds keep absorbing alchemists (open item O1);
- whether a DM's settlements should avoid repeating each other's lines;
- whether to show the NPC behaviour line at all;
- renaming "Plagued", which reads as disease.

The god's name stays the DM's, as your rule already says.

## What did not reproduce as stated

- **Food:** 117 of 120 are short in the audit's 120-settlement set (the report says 119), and 55 of 60 fresh. "Starving" in 70 of 120 matches the audit's first set exactly; fresh default settlements give 24 of 60.
- **Repetition:** "13 behaviour lines cover 1,030 NPCs" is true of the saved data, but no tab and not the PDF prints those lines (0 of 997 found on screen). The NPC repetition a DM actually reads is the shared position and "Wants" paragraph, which two or more people share in 59 of 120 fresh settlements. The 16% figure reproduced exactly.
- **Naming:** none of the 15 crisis texts names anyone, so 15 of 15 are unnamed, not 14 of 15.
- **Faith:** the audit's saved page captures all show the free view. The investigator rendered the premium view separately and got the same denial.
- **Not traced by anyone:** the Power tab's doubled "The seat The seat stands empty".

The investigators' probes and outputs are in `/tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/causes/`, one folder per failure (food, faith, magic, defense, rulers, repetition, naming, size-wording).

# Appendix: the eight traces

Each trace was reproduced by its investigator on fresh settlements and on the audit's own corpus before any cause was named. The repository was read only.

## 1. Food says several things at once

**Reproduced:** yes

### Reproduction

All probes are under /tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/causes/food/ (the scripts and their *.out.txt files). The repo was only read: git status is clean at c0ef42c13.

(1) The audit's own 120 coherence settlements, coherence/s/*.json and *.tabs.json (audit120.mjs, hooks.mjs, knock.mjs):
- 117 of 120 grow less than they eat. Median local production as a share of need: thorp 59%, hamlet 48%, village 60%, town 48%, city 59%, metropolis 43%.
- Local production divided by effectiveAgriculture has a median of 0.919 (range 0.75 to 0.997 with no food stress). That matches a fixed constant of 0.923 times a crop jitter of plus or minus 8%.
- 116 of 120 have a residual deficit above 0 after imports. Every one of the 116 gets exactly one fixed food-crisis hook. On road or isolated routes it is "The settlement is starving" (46). On every other route it is "A single merchant guild controls grain imports and has raised prices 300%" (70). The 4 without a deficit get neither.
- "Starving" fires at deficits as low as 2%. 20 of the 46 had no stress chosen. 21 of the 46 hold 6 or more months of stored grain, including metropolises with 15 months.
- All 6 "N days of food left / reserves" hooks equal round(production / need x 30) exactly. One example is metropolis-01: 12 days against 15 months stored.
- 0 of 120 tabs ever print the stored months.
- 60 of 60 thorps, hamlets and villages print "No food reserves." on Defense, while the data holds 1.3 to 1.9 months.
- 23 of 120 carry "surplus" or "enough" wording from the prosperity or complexity writers while production is below need. Example: a hamlet of 368 at 35% of need, band Deficit, reads "The farm surplus covers what the town needs and leaves a little over".
- The audit's first corpus (corpus.jsonl from gen.mjs) gives 70 of 120 "starving" and 48 with no stress chosen, the same as REPORT.md.

(2) Fresh settlements on the app's own path (fresh.mjs): loadGenerationLawPayloads, then birthConfig({...DEFAULT_CONFIG, settType}), then generateSettlementPipeline, 10 per tier with the default random terrain and route.
- 55 of 60 are short.
- 24 of 60 carry "starving", 17 of them with no stress, at a minimum deficit of 1%.
- Example: metropolis-1, population 70,381, is 1% short, its band reads "Secure", it holds 15 months, and it still carries "The settlement is starving. Villagers are turning to banditry".
- "Subsistence with surplus" sits beside a shortfall in 7 of 10 thorps and 8 of 10 hamlets.

(3) A pure-function sweep of generateFoodSecurity (calib.mjs, no RNG active):
- A bare settlement on a road grows the same share at every size from a 30-person thorp to a 60,000-person metropolis: plains 92%, riverside 83%, coastal 65%, hills 55%, forest 46%, mountain 37%, desert 28%.
- With every farm institution and resource bonus present: plains 139%, riverside 129%, coastal 111%, hills 101%, forest 92%, mountain 83%, desert 74%.
- deriveSupplyRiskAnalysis returns the "starving" hook for a road metropolis 1,000 lb short out of 100,000 lb needed (1%) with 15 months stored, and no hook at exactly 0.
- A port producing 53% of need returns "16 days of reserves" whatever is stored.

(4) The readers' own case is audit-hamlet-2 (Megapetra, population 145, coastal, port). Its tabs say:
- "Production covers 52% of food needs";
- Defense: "No food reserves. A crop failure or supply disruption causes immediate hardship";
- "Megapetra holds no food against a bad year";
- "No reserves, but sea supply continues while port is open";
- hook: "The settlement has 16 days of reserves" (151 / 290 x 30 = 15.6);
- the data: storageMonths 1.9, which is the hamlet base of 1.5 x 1.25 because "Access to external mill" counts as a mill.
Four answers to one question.

### Root causes

**1. (calibration)** Every settlement, from a 16-person thorp to an 86,000-person metropolis, is modelled as one farm. 4 in 10 people work fields whose best yield, on open plains, feeds 92% of the population, and worse land feeds far less. Size changes nothing. Villages do not feed themselves and towns are not fed by a hinterland, so being short of food is the normal state rather than an event. The terrain table the code says it copies rates plains at 1.5 and riverside at 1.3; the food code uses 1.0 and 0.9. On top of that, production is divided by 1.3 under the name 'storage buffer'.

*Code:*

src/generators/foodGenerator.js :: generateFoodSecurity
- :34-36: PER_CAPITA_NEED 2, FARMER_PRODUCTION 6, AGRICULTURAL_WORKFORCE 0.4.
- :38-42: TERRAIN_AGRI (plains 1.0, riverside 0.9, coastal 0.7, hills 0.6, forest 0.5, mountain 0.4, desert 0.3), commented 'matches TERRAIN_DATA'. src/data/geographyData.js actually gives plains 1.5 (:437), riverside 1.3 (:144), hills 0.9 (:542), coastal 0.8 (:68), forest 0.6 (:329).
- :258: need = population x 2.
- :271-272: dailyProduction = floor(population x 0.4) x 6 x effectiveAgri x stress x cropFortune / 1.3.
- :207-213: agriMod is capped at +0.5.
- :190-191: tierImportNeed (town 0.20, city 0.38, metropolis 0.52) is the designed 'towns import' idea, but it feeds only importPct, importNote and resilienceScore, never the balance.
src/generators/economy/foodBalance.js :: deriveFoodBalanceAnalysis
- :33-38 holds the same constants for its legacy path.
- :287-308: the canonical arm copies foodSecurity production, need and deficit.

*Evidence:*

Arithmetic: 0.4 x 6 / 1.3 = 1.846 lb a head against 2 lb of need, i.e. 92.3% x terrain, with no size term anywhere.

The sweep (calib.out.txt) gives the same percentage at every size; bare plains reach 92% at most.

In the audit's 120, local / effectiveAgri has a median of 0.919. 117 of 120 are short, at medians of 43-60% at every size. The audit forced the seven terrains evenly, and the median terrain value of 0.6 gives about 55%.

On the app's default draw, 55 of 60 are short.

The display has normalised the default: dossierViewModel.js:142-143 says 'most settlements run a little hungry, and that's the baseline'.

The historical rule of thumb runs the other way. Most pre-modern people farmed, rural places fed themselves with a small surplus, and towns drew grain from their hinterland. Here a thorp on the best land is 8% short and a metropolis is short by exactly the same 8%.

Arithmetic only (nothing in the repo changed): using geographyData's terrain table and dropping the /1.3 lifts thorps that feed themselves from 0 of 20 to 12 of 20. The result is still flat across sizes (metropolis 7 of 20), which shows the missing size and hinterland term is part of the cause.

**2. (unchecked-template)** The crisis hooks fire on any shortfall at all. One pound short counts as 'starving'. The hook never asks how short the place is, what its own food band says, how much grain it holds, how big it is, or whether a famine was chosen. Because of the calibration cause nearly every place is a little short, so the 'crisis' hook is default content: on a road or isolated route the place is 'starving', and on any other route a guild has tripled grain prices. The wording is written for villages and is printed for cities as well.

*Code:*

src/generators/economy/foodBalance.js :: deriveSupplyRiskAnalysis
- :647: hasDeficit = foodBalance.deficit > 0.
- :649-655: route isolated, none or road gives 'The settlement is starving. Villagers are turning to banditry...' at severity critical.
- :656-661: every other route gives 'A single merchant guild controls grain imports and has raised prices 300%'.
- :674: the Bandit Raids branch can never run (route === 'road' inside the non-road else).
The same shortfall is cut differently in each place, so there is no single 'how hungry' verdict:
- this hook: above 0;
- src/generators/narrativeGenerator.js :: generateSettlementReason :719: 5% of need;
- src/data/bandLadders.js :: foodSecurityBandOf :57-73: 5, 15 and 40 (the label);
- foodSecurityFlagsOf :79-89: 20;
- foodBalance.js :355 and :406: 50 and 20 for viability issues and the grain-price hook (:429-433);
- foodGenerator.js :354-378: 8, 20 and 40 for prosperity;
- src/generators/economy/prosperity.js :: deriveEconomicSituationDesc :81-82: 25, printed as 'Local food production leaves X% uncovered' although the figure is the gap left after imports.

*Evidence:*

Audit's 120 (hooks.out.txt): 116 have a deficit above 0, and 116 get starving (46, road and isolated) or the monopoly hook (70, other routes); 0 get neither.

'Starving' fires at 2% (city-16 with 8.8 months, hamlet-03, town-06). 21 of the 46 hold 6 or more months. 'Villagers are turning to banditry' appears in 21 towns, cities and metropolises (knock.out.txt).

Fresh: metropolis-1 is 1% short, labelled 'Secure', holds 15 months, and is 'starving'.

Pure function: the hook appears at a 1% deficit and not at 0.

First corpus: 70 of 120, 48 with no crisis chosen, the same as REPORT.md.

**3. (missing-single-source)** 'How much food is stored?' has four writers that never compare notes:
- The engine computes months of grain from the granary building, the settlement's size and the mill.
- The Defense tab asks only 'is there a building with "granar" in its name?' and says 'No food reserves' when there is not.
- Two hooks print 'N days of reserves', but N is the share the fields grow times 30. That is a harvest ratio, not a store.
- The prose pools talk about 'the stores' according to the prosperity rung or the food band.
The stored-months figure itself rests on a mill the place may not have: the stand-in 'Access to external mill' counts as one.

*Code:*

Months stored:
- src/generators/foodGenerator.js :: generateFoodSecurity :161-166: storageMonths is 1.0 for town and up, or 1.5 for thorp and hamlet, with no granary; 2.5-12 with one; x1.25 if hasMill. hasMill (:123) matches any name containing 'mill', including 'Access to external mill'; foodBalance.js :: hasImportProcessor :565 explicitly excludes that name.
No-granary flag:
- src/generators/priorityHelpers.js :67: hasGranary = name contains 'granar'.
- It is read by src/domain/display/threatAssessment.js :181-183 ('No food reserves. A crop failure or supply disruption causes immediate hardship.'),
- by src/domain/display/defenseDisplay.js :312-314 ('Logistics & Supply · No reserves' and 'No food buffer...'),
- and by src/domain/display/stateProse/defenseStateProse.js :512-543, which picks the pool 'Disasters & Famine: NO reserves...' (defense.generated.js:991, 'holds no food against a bad year').
Days:
- src/generators/economy/foodBalance.js :: deriveFoodBalanceAnalysis :402 ('has N days of food left').
- deriveSupplyRiskAnalysis :671 ('has N days of reserves').
- Both compute round(dailyProduction / dailyNeed x 30).
Stores in prose:
- economy.generated.js DS-ECO-9 DEFICIT ('the difference is being taken out of the stores'), keyed on foodSecurity.label (economyStateProse.js :: foodSecurityPoolKey :394-401).
- DS-ECO-8 COMFORTABLE ('the stores are more than the season needs', 'reserves behind it'), keyed on prosperity.

*Evidence:*

audit-hamlet-2 shows four answers (see reproduction): 'No food reserves', 'No reserves, but sea supply continues', '16 days of reserves' (= 151/290 x 30), and 1.9 months in the data (1.5 x 1.25 from 'Access to external mill').

Across the audit's 120:
- 60 of 60 small places print 'No food reserves.' while storageMonths is 1.3-1.9.
- 6 of 6 'days' hooks equal production / need x 30 exactly; examples are metropolis-01 (12 days with 15 months) and audit-metropolis-1 (7 days with 15 months).
- No thorp, hamlet or village in the corpus has a granary-named building, yet all have storageMonths above 1.

**4. (data-not-surfaced)** The engine's real answer on stores (months of grain, even a ready-made sentence such as '15 months strategic reserve') is computed and saved but never put on a tab at first generation. The only screen reader of stored months waits for a stockpile record that the world simulation creates later. So the DM sees only the contradictory stand-ins.

*Code:*

- src/generators/foodGenerator.js :: generateFoodSecurity :387-390 builds storageNote (e.g. '15 months strategic reserve') and :441 returns storageMonths.
- src/domain/display/dossierViewModel.js :: deriveGranaryOutlook :346-351 returns available:false when foodSecurity.stockpile is absent.
- src/domain/display/stateProse/defenseStateProse.js :1477 notes that the stockpile is null on every settlement the pipeline builds.
- The other readers of storageMonths are scores: src/generators/defenseGenerator.js :272-277 feeds the 'Disasters & Famine' bar and the economic score. warResolve.js reads it for the War teaser.

*Evidence:*

0 of 120 rendered settlements print a months figure (audit120.out.txt). REPORT.md: 10 of 18 readers found the stored months (1.3-15) in the data but not on the page.

**5. (unchecked-template)** The 'surplus' wording is chosen from things other than the food balance:
- for a thorp or hamlet, from how many exports it lists;
- from the prosperity rung;
- from the size label alone;
- from a resource whose trade good is literally named 'Grain surplus'.
None of these looks at whether the place grows more than it eats.

*Code:*

- src/generators/economy/prosperity.js :: deriveEconomicComplexity :293-315: a thorp or hamlet with 3 or more exports gets 'Subsistence with surplus'. The Economics header row shows it as 'Economy: …' (economyStateProse.js :956). The {complexity} slot becomes 'farm surplus' (economyStateProse.js :: COMPLEXITY_NOUN :222, filled at :907). That goes into DS-ECO-1 'COMBINATION C3: the middle rungs', 'The {complexity} covers what the town needs and leaves a little over' (economy.generated.js:77), which is chosen by the prosperity rung (economyStateProse.js :: prosperityHeaderPoolKey :384).
- src/generators/narrativeGenerator.js :: generateSettlementReason :753-755: 'Small enough that every household knows its purpose. Surplus, if any, is modest.' is printed for every thorp and hamlet.
- src/data/resourceData.js :89 and :153: tradeGoods 'Grain surplus' (grain_fields: 'producing ... well beyond local needs') becomes an export regardless of balance.
- DS-ECO-8 and DS-ECO-1 pools ('runs a reliable surplus', 'Nobody here talks about the price of bread') are keyed on prosperity.

*Evidence:*

- In the audit's 120, 'Surplus, if any, is modest.' appears on the Overview of 40 of 40 thorps and hamlets.
- 'Surplus' wording sits beside a shortfall in 12 of 20 thorps and 11 of 20 hamlets.
- 23 of 120 have prosperity or complexity 'enough' or 'surplus' lines while production is below need. Examples: a hamlet at 35% of need with band Deficit ('The farm surplus covers what the town needs…'); a city at 36% ('Nobody here talks about the price of bread').
- Fresh: 'Subsistence with surplus' with a shortfall in 7 of 10 thorps and 8 of 10 hamlets.
- The audit's 389-settlement corpus: thorp 38 of 64, hamlet 40 of 63 (corpus-edges/scan.txt:55).

### Shared with the other failures

Repetition (failure 6): partly. The calibration cause and the any-shortfall hook cause turn a few fixed food hooks into default content.
- "A single merchant guild controls grain imports … 300%" appears in 70 of 120, "The settlement is starving…" in 46 of 120 (70 of 120 in the first corpus), and "A poor harvest somewhere else has spiked the price of grain" in 44 of 120.
- These make up 184 of the 250 economic-viability hooks (74%).
- They are only 6.3% of the 2,914 hooks on the Plot Hooks tab (7% of repeated ones), so food adds to the repetition but does not drive it. The NPC and conflict pools do.

Defense (failure 4): partly, the same kind of cause.
- The Defense tab's food rows read a building-name flag (hasGranary) rather than the engine's stored months.
- The Defense "Economic Survival" sentence (threatAssessment.js:166-172) is picked by the economic score, whose main input is storageMonths (defenseGenerator.js:272-293). Two of its bands speak of "garrison pay" and "garrison morale" without checking for a garrison. That puts garrison pay or morale into 19 of the 64 settlements that have no garrison, barracks or citadel (garrison.out.txt).
- The rest come from another writer ("Upkeep underfunded: garrison pay at N%").

Size wording (failure 8): yes for the food lines, the same kind of cause (a fixed pool never checked against the place).
- "Villagers are turning to banditry" appears in 21 towns, cities and metropolises.
- The food and prosperity pools say "covers what the town needs" and "The fields do not cover the town" in thorps and hamlets.
- "Subsistence with surplus" comes from the export count, not from food.

Naming (failure 7): same shape, different code.
- The food hooks have no slot for a person: "a merchant has offered to supply food", "A single merchant guild controls grain imports".
- 67 of the 70 monopoly-hook settlements have a merchant faction, and 48 of them have a named member NPC who is never used.
- The occupier, creditor and besieger hooks come from a different writer (the stress crises).

Faith (2), Magic (3), Rulers (5): no link found.
- Magical food lines ("divine/arcane provision", "Temple granaries blessed") appear in 48 Economics tabs and in none with magic off.

Work already under way does not cover these causes:
- GS-3a (WIP commit 17105e3a, deferred; branch claude/gs3a-food-security sits at the same tip) addresses the Overview band against the Foundations "Food supply chains" row (r = −0.03). It does not touch the calibration, the hooks or the reserves.
- The historical-scale work (X-46) changes headcounts, but the shortfall percentage does not depend on population or size (same % at every size in the sweep), so rescaling alone will not move it.

### Shape of a fix

1. Recalibrate food by size and land.
- Small places (thorp, hamlet, village) on ordinary land should grow about what they eat or a little more, perhaps 100-125%. Poor land (hills, forest) can run slightly short. Mountain and desert are short.
- Towns and larger places should be fed by a hinterland and not modelled as a farm with 40% of the people in the fields. Treat the existing size-based import share (town 20%, city 38%, metropolis 52%) as normal supply, not as a gap.
- Use one terrain table. The food code says it copies geography's; pick one.
- Drop or rename the hidden /1.3 'storage buffer' on production.
- A shortfall then becomes an event (famine, siege, a cut road, bad land) rather than the default.
- This moves goldens, so it goes through the owner's golden door.

2. Make one food answer that every sentence reads.
- The existing foodSecurity record should carry: the share grown locally, the share imported as normal, the shortfall that remains, the band, the months stored, and whether there is a granary.
- Every food sentence reads that record: Overview, Economics, Defense, viability, hooks, Quick Guide, Tonight.
- Use one set of shortfall cut-offs, the band's, instead of seven.

3. Make the hooks follow the band.
- "Starving" only for Deficit or Active Famine with little stored. A grain-price or merchant hook for a moderate gap, and no food hook for a place that is fed.
- Size-aware wording: "villagers" only for small places.
- Fill in the real merchant faction or NPC by name.

4. Print one reserves figure, the engine's stored months, once.
- For example "about 7 weeks of household and common stores, no granary", instead of "No food reserves".
- The "days of reserves" hooks read stored months x 30, not the harvest ratio.
- A stand-in "Access to external mill" stops counting as a mill.

5. Surplus words come from the food balance only.
- This covers the 'Subsistence with surplus' label and its 'farm surplus' slot, "Surplus, if any, is modest", and the 'Grain surplus' export. All appear only when the place really grows more than it eats.
- Prosperity pools stop making food claims.

6. Add one self-check: no sentence may say surplus, stores, reserves or starving unless the food record agrees.

## 2. Faith denies its own church

**Reproduced:** yes

### Reproduction

Reproduced on fresh settlements, on the audit's own 18 files and on its 120-settlement corpus. The repo was not touched. The probe is /tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/causes/faith/probe.mjs, its output is out.txt and rows.json in the same folder, and the 120-corpus count is corpus120.mjs there.

How the probe ran: it uses the app's first-generation path: loadGenerationLawPayloads(), then generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG, ...overrides}), null, {seed, customContent:{}}). It made 36 fresh settlements: 6 tiers x 6, with the religion dial at 0/20/50/80/100 and one religious_conversion stress per tier. It also loaded the 18 audit files from audit-gen/s/*.json. For each one it rendered the real FaithTab.jsx headlessly, using the audit's JSX loader, twice: once as the default anon viewer and once as a premium viewer.

A caveat for every headless render: zustand's server-side render reads getInitialState(), so useStore.setState does not reach the render. The audit's .txt renders are therefore all the anon view. To get the premium view I set the tier on the initial state.

Results, fresh (n=36) and audit (n=18):
- config.primaryDeitySnapshot is present in 0/36 and 0/18. config.latentPantheon is present in 0/36 and 0/18. faithPanelModel(s).hasEmbed is true in 0/36 and 0/18.
- Religious institutions are present in 36/36 and 18/18. A religious faction is present in 26/36 and 17/18, with power up to 59, e.g. thorp 'Religious Authorities 59'. Clergy NPCs are present in 26/36 and 13/18 (High Priest in every fresh town, city and metropolis; Archbishop/Patriarch, Inquisitor).
- The free viewer sees "The people keep their own quiet observances. No single creed holds sway, and the shrines answer to no named god." plus "Awaken a living pantheon…" in 36/36 and 18/18.
- The premium viewer sees "This settlement keeps no named faith." plus one of the DS-FTH-2 variants in 36/36 and 18/18. The variants seen were: the same "No single creed holds sway…" sentence, "There is no patron here… nothing claims the thorp", "No faith holds the thorp…", and "Worship in X is a private matter… none of them a creed's".
- The denial sits beside church evidence in 54/54 for both viewers.

The rendered audit text: every one of the 18 .txt files carries the teaser in its FAITH section, and every one also carries explicit church text elsewhere. Examples:
- audit-village-2: "Tithes are compulsory.", plus a "Church Tithes" income row and "Church holds substantial temporal power; tithes fund civic works…".
- audit-town-2: "Church institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical."
- audit-metropolis-1 (Serraagam): "Chrysostomissa Rutilius, Archbishop/Patriarch", and "What threatens the Grand Merchant Oligarchy at Serraagam is heresy rather than opposition. A rival creed…".
- audit-city-1: "A stone cathedral anchors the high ground."
- audit-thorp-2: "The Heresy Trials".

Across the rendered text: tithes appear in 7 of 18, heresy in 8, cathedral in 2, High Priest or Archbishop in 10, and some church or creed word in all 18.

The audit's 120 corpus (coherence/s): deity embed in 0/120. Religious institution in 120/120, religious faction in 98/120, clergy NPC in 90/120, a Church Tithes income row in 26/120. The captured Faith tab carries "No single creed holds sway" in 120/120, beside a church in 120/120.

### Root causes

**1. (missing-single-source)** The Faith tab answers only one question: has someone assigned this town a patron god? Generation never assigns one; under the current rule, gods are custom content only. So the tab always takes its 'no faith here' branch. Meanwhile generation builds a full church: parish churches, monasteries, cathedrals, a Religious Authorities faction with real power, a High Priest or Archbishop on the NPC list, tithe income, heresy trials in the history and a 'rival creed' power story. Nothing hands any of that to the Faith tab. Two parts of the program each own 'does this place have a church', and the Faith tab reads the part that is always empty.

*Code:*

The reader:
- src/components/settlement/faithPanelModel.js :: faithPanelModel L187-190. It reads only settlement.config.primaryDeitySnapshot; with no snapshot it returns {hasEmbed:false}. It never reads institutions, powerStructure.factions, npcs, economicState or stress.
- src/components/settlement/FaithSection.jsx :: FaithSection L343-356. It routes on model.hasEmbed: L351 ACTIVE, L353 HIDDEN for premium, L355 TEASER for free/anon.
- src/components/new/tabs/FaithTab.jsx :: FaithTab L90 (model), L111 (faithWillRender = hasEmbed || !isPremium), L157 (mounts FaithSection), L179-203 (premium absence branch).
- src/components/session/SessionMode.jsx L222-223 makes the same deity-embed-only presence test.

The empty writer:
- src/generators/generateSettlementPipeline.js L173-175: 'The roster never writes … config.primaryDeitySnapshot'.
- src/domain/worldPulse/latentPantheon.js L6-12: 'Generation NO LONGER bakes a latent pantheon … no premade deities — custom content only'.
- Commit 5f8dc7830 (2026-07-28) deleted src/generators/steps/seedStartingPantheon.js and src/generators/data/deityPool.js.

The church writers the Faith tab never consults:
- src/generators/economy/economicState.js L226-240 (the 'Church Tithes' and 'Church Tithes & Rents' income rows).
- src/generators/power/rulingStructure.js L601-624 (religiousDesc: 'Church institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical.').
- src/generators/npcGenerator.js L1449-1451 (a High Priest seat for every town, city and metropolis).
- src/data/historyData.js L1575 ('The Heresy Trials').
- src/data/dossierStateProse/power.generated.js L1866 ('…is heresy rather than opposition. A rival creed…').
- src/data/institutionDescVariants.js L430 ('Tithes are compulsory.').
- src/generators/structuralValidator.js L286 ('A stone cathedral anchors the high ground.').

*Evidence:*

The probe found the deity embed in 0/36 fresh and 0/18 audit settlements, and 0/120 in the corpus. Church evidence was present in 36/36, 18/18 and 120/120: a religious institution in every one, a religious faction in 26/36, 17/18 and 98/120, and clergy NPCs in 26/36, 13/18 and 90/120. Every one of those settlements renders the denial. The code says the same thing: faithPanelModel's only gate is config.primaryDeitySnapshot (L189-190), and grep finds no faithName, dominantFaith, creedName or deityName field written anywhere in src/generators or src/data. The authors knew the gap was the common case. FaithTab.jsx L182-187 says 'a settlement with no `primaryDeitySnapshot` is the COMMON case, not the edge (the whole review corpus is deity-free today)', and WarFaithDesk.jsx L281-286 says the same.

**2. (unchecked-template)** The 'no god' line states a fact about the world: no creed holds sway, nothing claims the town, devotion runs 'rather than clergy'. It does not say what is actually true of the data: no patron god has been named yet. It was written on 2026-07-10 as a cover line for an upgrade prompt, when every seed carried hidden gods that free viewers could not see, so a vague 'no named god' was safe. Eighteen days later the hidden gods were removed from generation. The cover line became the only thing the Faith tab ever says, for every settlement and every viewer, and no one re-checked it against what generation writes. Premium viewers are no better off: they get 'This settlement keeps no named faith.' plus one of four rewordings of the same denial, chosen only by 'is there a patron god'.

*Code:*

Free/anon viewers:
- src/components/settlement/FaithSection.jsx :: FaithTeaser L288-338, with the static sentence at L317 and the upsell at L322. It has no inputs except publicDossier.

Premium viewers:
- src/components/new/tabs/FaithTab.jsx L181 ('This settlement keeps no named faith.') and L201 (<FaithTeaserLines>).
- src/components/new/tabs/WarFaithDesk.jsx :: FaithTeaserLines L296-300.
- src/domain/display/stateProse/warFaithStateProse.js :: warFaithStateProse L778-782 (hasPatron = readings.hasPatron), L881 (faithTeaser lens), and faithTeaserPoolKey L611-613 (returns 'PRIVATE DOSSIER' whenever there is no patron; it has no other input).
- src/data/dossierStateProse/warFaith.generated.js DS-FTH-2 L4502-4602. All eight variants in both pools deny an organised faith: L4511 is the street variant, byte-identical to FaithSection L317; others are 'There is no patron here… nothing claims the town', 'No faith holds the town', and 'What devotion there is runs through custom rather than clergy'.

Print:
- src/domain/display/stateProse/printProse.js L645 puts faith.teaser into print without the faith gate.

Stale lifecycle note:
- src/store/settlementLifecycleHelpers.js :: activateFaithIfEntitled L183-205. Its docblock still says 'The generation pipeline bakes a starting pantheon LATENTLY into every seed', which has been false since 5f8dc7830. The activation it describes is therefore a no-op on every new settlement: latentPantheon is present in 0/54.

*Evidence:*

In the git history, 5f0ad7b77 (2026-07-10) is 'Phase 4, W-F5 — the axis retires, and every seed carries its silent gods'; that is when the teaser was a cover for hidden gods. Then 5f8dc7830 (2026-07-28) removed seedStartingPantheon.js (183 lines) and deityPool.js (143 lines). In the probe, the free render was identical in all 54 settlements: 'Faith The people keep their own quiet observances. No single creed holds sway, and the shrines answer to no named god. Awaken a living pantheon…'. The premium render produced 5 distinct texts across the 24 settlements that showed a single text each, and every one is a denial, e.g. 16x 'This settlement keeps no named faith. The people keep their own quiet observances. No single creed holds sway…', 4x '…No faith holds the thorp…', 2x '…There is no patron here… nothing claims the thorp'. The sentence comes out the same whether the religion dial is 0 or 100, for a thorp or a metropolis, and with or without a religious_conversion stress (rows.json).

**3. (naming-gap)** This one contributes rather than causing the denial directly. Generation builds a church that has no name and no god. The faction is 'Religious Authorities', the buildings are 'Parish churches (10-30)', and the leader is an 'Archbishop/Patriarch' of nothing in particular. So even a correct Faith tab has nothing to name, and the one passage that talks about the creed falls back on 'no named god'. The current rule (no premade gods, custom content only) makes naming the god the DM's job, and nothing on the page tells the DM that this is a blank waiting for them rather than a fact about the town. That is why the readers listed 'what the faith is called' among the things they had to settle before play.

*Code:*

- src/domain/worldPulse/latentPantheon.js L6-10: the deity doctrine, 'no premade deities — custom content only'.
- src/generators/npcGenerator.js L1449-1451: the clergy seats are given roles, not a church.
- src/generators/power/rulingStructure.js L601-624: the religious faction's description names 'the church' generically.
- A grep for faithName, dominantFaith, religionName, creedName, deityName, patronGod and patronDeity across src/generators and src/data finds zero writers.

*Evidence:*

The probe rows show religious faction names that are always generic: 'Religious Authorities', 'Reform Congregation', 'New Faith Community', 'Priestly Guidance'. Institution names are generic catalogue labels: 'Parish churches (50-100+)', 'Great cathedral', 'Major monasteries (5-10)'. A deity snapshot appears in 0/54. REPORT.md L196 lists 'what the faith is called' among the decisions all 18 readers had to make first.

### Shared with the other failures

The specific code cause is unique to the Faith failure (#2): faithPanelModel, FaithSection, FaithTeaser and DS-FTH-2 reading only the deity embed and printing a fixed denial. None of the other seven failures run through these files.

The same shape, with separate code, drives failure #5 (who rules). The shape is an 'honest absence' sentence keyed on one narrow lookup that misses what generation actually holds, so the page denies a fact generation wrote. In src/domain/dossier/powerStrata.js, L338-348 looks for a seat-holder through isRulerTitled (L269-272). That function matches only NPC_ROLE_ARCHETYPES.ruler.labels in src/domain/worldPulse/npcAgency.js L24-25: 'ruler', 'lord', 'lady', 'mayor', 'governor', 'reeve', 'chief', 'prince', 'duke', 'baron'. There is no 'elder'. On a miss, L357-362 prints 'No named seat-holder stands in the record. The chain ends, honestly, at the faction.' Verified on audit-thorp-1 (Skaldthorpe): the NPC list holds Idunn Haraldsson, role Elder, factionAffiliation Elder Council, the governing faction. The rendered Power tab (line 180 of the .txt) still says 'No named seat-holder stands in the record.' So the fix discipline is the same (an absence sentence may only fire after checking the generated layer that owns the fact), but the code is not shared.

The naming-gap pattern (#7, the unnamed occupier, creditor or besieger) looks like the same kind, a central role generated without a name. I did not trace its code, so I do not claim it.

Magic (#3) is a different reader. OverviewTab.jsx L390 grades 'Magical Capability' from dp.scores.magical, which its own comment (L381-388) calls 'the world magic slider over a wide presence read'. I did not trace whether magicExists=false reaches that score, so I do not claim a shared cause.

Food (#1), garrisons (#4), repetition (#6) and size wording (#8): I found no shared code with this cause and did not investigate them.

A side note for every investigator who renders tabs headlessly: zustand's server-side snapshot is getInitialState(). The audit's useStore.setState({settlement}) and any tier change do not reach renderToStaticMarkup, so all audit renders are the anon/free view with the initial store.

### Shape of a fix

1. Give faith one source of truth that is built from what generation already makes. A single 'faith reading' would gather:
   - the religious institutions (parish church, monastery, cathedral, shrine only);
   - the religious faction and how strong it is;
   - the senior cleric by name and role;
   - whether tithes are collected;
   - any contested-creed stress (religious_conversion, a rival congregation faction).
   The Faith tab, the Session view's faith section and the print faith passage all read that one record instead of asking only 'is there a patron god'.

2. Make the absence line state the data truth, not a world fact. When no god has been named, the tab should describe the church the town has, for example 'The parish church and its priest, under a High Priest of real political weight; tithes are collected'. It should then say plainly that the faith's name and god are not yet set and are the DM's to give. It must not say 'no creed holds sway', 'nothing claims the town' or 'rather than clergy'. Key those lines on the faith reading:
   - established church;
   - contested creeds;
   - only wayside shrines and a burial ground, with no religious faction or clergy.
   'No single creed holds sway' then appears only in the last case, or where creeds are genuinely contested.

3. Keep the premium upsell copy ('Awaken a living pantheon…') visibly separate from the sentence about the town, so selling copy never doubles as a world fact.

4. Correct the stale docblock in src/store/settlementLifecycleHelpers.js L183-185. It says generation bakes a latent pantheon into every seed; it has not since 2026-07-28.

5. Add a coherence check that fails if the Faith tab's no-faith wording renders beside any of: a religious faction, a clergy NPC, a Church Tithes income row, or a cathedral or monastery institution.

Inventing a god or creed name at generation is not part of this fix. The deity doctrine (no premade deities, custom content only) is an owner decision, so the fix only stops the page from denying the church and leaves the name to the DM.

## 3. Magic is described two ways

**Reproduced:** yes

### Reproduction

I reproduced all five symptoms. Probes are in /tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/causes/magic/. I wrote nothing to the repo, the worktree is unchanged (git status shows 0 lines), and I did not run vitest.

**Method.** probe.mjs generates settlements through the app's first-generation path (loadGenerationLawPayloads, then birthConfig({...DEFAULT_CONFIG, ...o}), then generateSettlementPipeline). It renders OverviewTab, SubstrateTab (Foundations), MagicTab and DefenseTab headlessly with the audit's own jsx loader. The fresh set is 108 settlements: three magic cases (off = magicExists:false/priorityMagic 0; zero = magicExists:true/priorityMagic 0; high = priorityMagic 85) × 6 tiers × 6 seeds. It also re-renders the audit's 18 saved files in s/*.json. summarize.mjs reads rows-fresh.json and rows-audit.json.

**1. "Magical Capability" on the Overview with magic off.**
- Fresh: 36/36 print "Magical Capability · Critical". scores.magical is 0 in all 36.
- Fresh: 36/36 Foundations also print "Magical stability · Adequate".
- Audit files: 4/4 magic-off settlements show the same (audit-thorp-1, hamlet-2, village-3, city-3).

**2. Resident dragons.** dragons.mjs ran 60 metropolises per case.
- Magic off: 6/60 have "Dragon resident". Example: dragon-off-0 Mönkhkul, "The city is home to an ancient dragon.", plus the service "Aerial deterrence: No raiding force approaches a settlement with a visible dragon" (dragon1.mjs).
- Dial zero: 9/60. Default config: 4/60. The dragon's chance does not change with the magic setting.
- In the audit's 389-settlement corpus (corpus-edges/records.jsonl) I recount 4 of 19 metropolises with magic off or dial zero: main-metropolis-5 and -14 (magicExists:false), main-metropolis-9 and edge-magic_dial_zero (dial zero).

**3. Alchemists.**
- Fresh magic off: 8/36 have an alchemist shop or quarter. All 8 export "Alchemical trade (potions, reagents)". Example: mag-off-town-0, "Sells potions and alchemical goods. A plain healing draught runs about a labourer's week of wages.", exporting "Potions and elixirs".
- Metropolises: 43/60 have alchemists with magic off, against 11/60 at the default setting.
- 389 corpus: 33/120 settlements with magic off or dial zero have alchemists.

**4. Magic tab roles against the reliance sentence.**
- Fresh high magic: 36/36 print "Economic role: integral".
- 16 of those 36 have no arcane institution and no arcane NPC.
- 13/36 sit beside an Overview "Magical Capability · Critical".
- 30/36 have a reliance line saying the place does not depend on magic. 14 of those say "Nothing structural ... depends on arcane work".
- Re-rendering audit-city-2 reproduces "Economic role: integral" (line 2005) and "Nothing structural at Nahrziyarat depends on arcane work" (line 2010). audit-town-2 shows the same pair.

**5. "No arcane practitioners on the rolls" beside a Hedge Witch.**
- Audit files: audit-hamlet-3 (Kinich Batab) and audit-town-2 (Thorkel Styrkarsson; town-2 also has a Teleportation circle).
- Fresh high magic: 2 cases (mag-high-thorp-0, mag-high-village-0).

**Knock-out probes (knock.mjs).**
- Moving audit-thorp-2's dial from 65 to 66, with nothing else changed, turns "Economic role: occasional" into "integral". audit-town-2 and audit-city-2 flip economic, medical and infrastructure from common to integral at the same step.
- Flipping magicExists from false to true on audit-thorp-1 and audit-city-3 leaves magical_stability at 50 ("adequate"), so it never reads the switch.
- The world law built with magicExists:false allows "Dragon resident", "Alchemist quarter" and "Alchemist shop", and refuses "Golem workforce" and "Mages' guild".
- getBaseChance gives Dragon resident 0.1 and Alchemist quarter 0.5 whether magic is off or at 50 (alchsrc.mjs).

### Root causes

**1. (unchecked-template)** The engine has a single function that answers "does magic work here" (magicWorksAt), but nothing makes a writer call it; each one must remember to. The generator does call it. When magic is off it sets the magic defence score to 0, and it leaves magic out of the readiness average because a place "can't be penalised for not having something that doesn't exist". Two display writers never ask. The Overview's Systems Health draws a "Magical Capability" bar for every settlement, and a 0 bands as "Critical". So every historical-mode settlement reads as failing badly at something it was never meant to have. The Foundations variable "Magical stability" starts every settlement at 50 and never reads the switch, so it prints "Adequate". This has been patched one writer at a time: T2-24 added the check to the Defense tab's Arcane Support row after 84 of 250 no-magic worlds printed "Present", and nobody added it to its siblings.

*Code:*

src/components/new/tabs/OverviewTab.jsx :: OverviewTab :390 (<ScoreRow label="Magical Capability" score={scores.magical}/>, drawn unconditionally); :73-88 ScoreRow (prints scoreBand of the bar); :156-157 (scores = defenseProfile.scores). OverviewTab.jsx and SubstrateTab.jsx contain no magicWorksAt or magicExists read at all. src/domain/display/defenseScoreBands.js :: scoreBand :66-69 (0 -> CRITICAL). src/generators/defenseGenerator.js :: computeDefenseScores :85-86 (worldLaw.magicEnabled), :314-315 (magical = 0 when magic is off); :: computeDefenseReadiness :496-514 (drops scores.magical from the average when magic is off). src/domain/causalState.js :: deriveMagicalStability :1241-1268 (base 50; reads only magicLedger band, an arcane faction and conditions, never magicExists), registered at :1325. src/components/new/tabs/SubstrateTab.jsx :45 (label) and :100-107 (renders every causal variable). The patched sibling for contrast: src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities :216-222 (T2-24). The answer they should call: src/domain/worldPulse/magicWorksAt.js :: magicWorksAt.

*Evidence:*

Fresh magic-off settlements: 36/36 "Magical Capability · Critical" with scores.magical 0 in all 36, and 36/36 "Magical stability · Adequate". The audit's own files: 4/4 the same. The coherence corpus check MAG-4 found 23/23. Knock-out: flipping magicExists false->true on audit-thorp-1 and audit-city-3 leaves the magical_stability score at 50, so it never reads the switch. The generator's own readiness function already excludes magic when it is off (defenseGenerator.js:510-514), so the generator knows and only the display row ignores it.

**2. (other)** "Magic off" means two different things. The DM picks "○ No. Historical mode". The engine only hears "spells do not function", and each catalog row decides that through its declared magicLicense. Dragon resident is licensed 'none' (ruled a creature, not a spell) and so are the alchemists (ruled a trade, ODQ §541). The world law therefore admits them in historical mode, and their odds do not move with the magic setting. Their words were written for a fantasy world and never re-read the switch. The dragon is an "ancient wyrm" with an "Aerial deterrence" service. That service is filed under employment, not magic, so it also escapes the magic-service filter. The alchemist sells "potions" and "a basic healing draught" priced like a game potion, and its chain exports "Potions and elixirs" and "Alchemical trade (potions, reagents)". Turning magic off actually makes alchemist quarters more common in metropolises. With magic on, the mages' guild or district absorbs them (an absorption the repo's own URBAN_BAND_INSTITUTIONS.md flags as open item O1), and with magic off nothing absorbs them. The change that admitted the dragon recorded that its test grid never produced one ("no positive control"), so the result was never seen.

*Code:*

src/data/institutionalCatalog.js :1607-1611 (Dragon resident: magicLicense 'none', desc 'Ancient wyrm living in city.'); :851-860 (Alchemist quarter/shop: magicLicense 'none', desc 'Potions and alchemical wares. A basic healing draught costs about what a labourer earns in a week.'). src/generators/generationContext.js :: nativeInstitutionRequiresMagic :187-196 (the declared licence is the whole answer). src/domain/arcaneInstitutionIdentity.js :: isArcaneInstitution :236-240 (licence first). src/generators/institutionProbability.js :: getBaseChance :112-117 (P1), :219-235 (P3), :341-343 (MG-3h gate; all read the licence, so 'none' rows are dial-invariant). src/data/institutionServices.js :921-925 (Dragon resident: 'Aerial deterrence'). src/data/institutionDescVariants.js :722-723 (healing-draught variants). src/generators/computeActiveChains.js :972-974 (exportLabel 'Alchemical trade (potions, reagents)'). src/data/supplyChainData.js :1126-1137 (alchemy chain outputs 'Potions and elixirs', processor 'Alchemist'). src/components/ConfigurationPanel.jsx :481-490 ("No. Historical mode"). A stale comment, src/domain/arcaneInstitutionVocabulary.js :88-90, still says the keyword list strikes Dragon resident in a dead-magic world. docs/implementation/packets/catalog-hygiene/MF-CH2B.md :259 and :297 (Dragon resident ADMITTED; no positive control).

*Evidence:*

knock.mjs: createGenerationWorldLaw({magicExists:false}).allowsInstitution returns true for Dragon resident, Alchemist quarter and Alchemist shop, and false for Golem workforce and Mages' guild. alchsrc.mjs: getBaseChance gives Dragon resident 0.1 and Alchemist quarter 0.5 whether magic is off or at 50. dragons.mjs (60 metropolises per case): dragons 6 off, 9 at dial zero, 4 at default; alchemist quarters 43/60 off against 11/60 at default. dragon1.mjs: dragon-off-0 Mönkhkul carries "The city is home to an ancient dragon." and the employment service "Aerial deterrence". Fresh magic-off small and mid tiers: 8/36 have alchemists and all 8 export alchemical trade (mag-off-town-0 also exports "Potions and elixirs"). The 389 corpus: 4/19 metropolises with magic off or at zero have a dragon (2 with magicExists:false), and 33/120 have alchemists.

**3. (missing-single-source)** "How much does this place rely on magic?" has three separate answers, and two of them sit six lines apart on the Magic tab. The role lines decide from the slider alone: once the magic dial reaches 66, "Economic role" is integral whatever stands in the settlement. That includes a thorp with no practitioner, no magic institution and no arcane faction. The "Reliance on magic" sentence reads a separate yes/no that the defence generator sets only during a siege, famine or plague when some tradition is present. So in peacetime even a city with a mages' guild that exports alchemical goods reads "Nothing structural ... depends on arcane work". That yes/no also counts a church as arcane: a plague hamlet with a wayside shrine and only a walk to the neighbouring parish church "runs on arcane work ... depends on practitioners". The Overview's magic score forces small places without a magic institution to 0 (Critical), at the same time as the Magic tab calls magic integral there.

*Code:*

src/domain/magicProfile.js :: deriveRoles :310-349. :319 sets topBand = magicLedger(...).magicLevel === 'high' (dial >= 66). :345 economic = role('economic', present, topBand), so the integral branch needs nothing but the dial; :347-348 medical and infrastructure lean on the same flag. src/domain/display/dossierViewModel.js :: deriveMagicPosture :461-487 (roleLines). src/components/new/tabs/MagicTab.jsx :82-90 (the dependence line comes from defenseMagicDependencyProse) and :136 (role lines). src/domain/display/stateProse/defenseStateProse.js :: magicDependencyPoolKey :1622-1629 and defenseMagicDependencyProse :1663-1683 (reads only defenseProfile.magicDependency). src/generators/defenseGenerator.js :458-463 (magicDependency is true only for under_siege/famine/plague_onset combined with a tradition); :109-112 hasDivine (religion >= 55 plus a 'parish church' or 'cathedral' substring, which counts 'Access to parish church'); :303-316 (small-tier zero for scores.magical). Text pool: src/data/dossierStateProse/defense.generated.js :4268.

*Evidence:*

knock.mjs: audit-thorp-2 has no arcane institution, NPC or faction. Its roles read economic "occasional" at dial 65 and "integral" at 66. audit-town-2 and audit-city-2 flip economic, medical and infrastructure from common to integral at the same 65->66 step. Fresh high magic (dial 85): 36/36 "Economic role: integral"; 16/36 with no arcane institution and no arcane NPC; 13/36 beside Overview "Magical Capability · Critical" (all thorp, hamlet or village); 30/36 with a reliance line saying the place does not rest on magic; magicDependency true in only 2/36. audit-city-2 (Mages' guild, Enchanter's shop, Alchemist quarter, alchemical exports) prints "Economic role: integral" and then "Nothing structural at Nahrziyarat depends on arcane work". audit-hamlet-1 has traditions {hasDivine:true, every other tradition false}, institutions [Wayside shrine, Access to parish church] and stress plague_onset. It prints "Lipoya runs on arcane work" (line 679) next to Defense "No arcane practitioners on the rolls" (472) and Overview "Magical Capability · Critical" (48).

**4. (missing-single-source)** "Who practises magic here?" is answered by at least five private keyword lists, and none of them reads the NPC list. The Defense tab's "No arcane practitioners on the rolls" checks only institution names, against a list that has neither "hedge witch" nor "teleportation". The Magic tab counts arcane institutions with a different pattern, and the two lists agree on exactly one catalog name, Wizard's tower. The Magic tab's pattern counts Bardic college, Druid Circle and Teleportation circle as arcane, and misses Mages' guild, Mages' district, Academy of magic, Enchanter's shop, Hedge wizard and the alchemists. The defence score uses still other lists. The Hedge Witch NPC is filed with no category. Yet the world law's own NPC pattern treats her as a magic practitioner: she is removed from every magic-off world. No magic sentence ever looks at her.

*Code:*

src/generators/priorityHelpers.js :: getInstFlags :72 hasMagicInst = names include wizard|mage|alchemist|enchant|arcane|academy of magic|scroll scribe|spellcasting|hedge wizard (institutions only). src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities :222 and :287-296 (the note 'No arcane practitioners on the rolls...'). src/domain/magicLedger.js :22 ARCANE_INSTITUTION_PATTERN = tower|sanctum|college|conclave|circle|guild.*mage|... used by src/domain/magicProfile.js :: institutionsByPattern :97-104, which drives availability, control and roles. src/generators/defenseGenerator.js :96-128 (hasArcane, hasArcaneGuild, hasDruid, hasAlchemy lists) and :310-311 (_hasActualMagic counts healer, monastery and cathedral). src/generators/priorityHelpers.js :: computeEffectiveMagicPresence :109, INST_WEIGHTS :121-127. src/data/historyData.js :940 (role "Hedge Witch", no category, minTier thorp). src/generators/generationContext.js :45-46 MAGIC_ROLE_PATTERN (includes 'hedge witch'), allowsRole :303-321 (applied only in a dead-magic world).

*Evidence:*

A sweep of catalog names shows the Magic-tab pattern matches Druid Circle | Wizard's tower | Teleportation circle | Bardic college. The Defense pattern matches Alchemist quarter | Alchemist shop | Wizard's tower | Traveling hedge wizard | Hedge wizard | Mages' guild | Mages' district | Academy of magic | Enchanter's shop | Scroll scribe. audit-town-2 has a Teleportation circle and a Hedge Witch (Thorkel Styrkarsson); its Magic tab says "Infrastructure role: integral" and its Defense tab "No arcane practitioners on the rolls". audit-hamlet-3 shows the same with Kinich Batab. On audit-metropolis-1 the Magic tab's only arcane institution is "Bardic college" while the Defense tab's is "Mages' district". On audit-village-1 the Magic tab sees none and the Defense tab sees a Hedge wizard. Fresh high magic: 2/18 "No arcane practitioners" lines sit beside a named Hedge Witch. Fresh magic off: 0/36 arcane NPCs, because the world law strikes them, so the NPC side does know she is magical.

### Shared with the other failures

**Defense (garrisons, walls and hospitals that don't exist): yes, both shapes, in the same function.**
- In defenseDisplay.js :: deriveSupportingCapabilities, the Economic Backing note (:246-254) prints "Full pay, maintained equipment..." or "Irregular pay, worn equipment, morale risk" from scores.economic. It never asks whether a garrison exists. In that same function, T2-24 added a magicWorksAt check to the arcane row only. This is the sentence-that-never-checks shape of cause 1.
- Medical Readiness "Hospital present" (:305-306) reads priorityHelpers.js:69 hasHospital, which is true for any name containing hospital, monastery, healer or friary. audit-village-1 prints "Hospital present" because of "Healer (divine, 1st level)". This is the keyword-list shape of cause 4.
- defenseGenerator's hasInst('parish church') matches "Access to parish church", which is a walk to the neighbour's church. That is how audit-hamlet-1 gained its "divine" tradition.

**Faith: same shape.**
- The Faith tab reads one config field and ignores the churches, the religious faction and the clergy. The faith investigator measured 36/36, in causes/faith/out.txt.
- Cause 3 also mixes the two up the other way: a shrine plus a plague becomes "runs on arcane work".

**Food: same shape, not traced by me.**
- The "starving" hook fires on any shortfall and never reads the stores the engine computes, which is cause 1's shape.
- The food code keeps its own arcane keyword lists (foodGenerator.js:289, economy/foodBalance.js:100-108 and :180). They are gated on magic and showed no magic-off leak (check MAG-1 food = 0).

**Who rules: likely the same shape as cause 4, not traced here.** A sentence reads one roster ("no named seat-holder") while the person sits on another (the Elder on the NPC list).

**Repetition, unnamed people and size wording: no shared cause found.** The magic reliance lines put the right size word in ("What the thorp makes...").

### Shape of a fix

Nothing was changed. This is the shape of a fix, in order.

1. **Ask the magic switch by default.** Every magic-facing row and variable should take its answer from the one "does magic work here" function, and with magic off it should step aside rather than grade. The Overview drops "Magical Capability", as the readiness average already does. Foundations drops "Magical stability". Put the check inside the shared row and variable lists, not in each writer, so a new row cannot forget it. Add a test that renders every tab in historical mode and refuses magic words.

2. **The owner rules what "Historical mode" excludes.** If it means "no fantastic elements", dragons and potion-selling alchemists go. That needs a separate licence for creatures and wonders, distinct from "needs spellcraft".
   - If alchemy stays a mundane trade, give its rows wording that depends on the switch: chemist's wares such as acids, dyes, tinctures and remedies. No healing draught priced like a potion, no "Potions and elixirs" export.
   - Either way, re-measure with a positive control, which the change that admitted the dragon never had.
   - Separately, decide whether mages' guilds should keep absorbing alchemists (the repo's open item O1). That absorption is why turning magic off makes alchemists more common.

3. **Compute "magic here" once, at generation, and have every tab read it.** It should hold two things:
   - who practises: institutions by catalog licence, and NPCs by the world law's role pattern, so the Hedge Witch counts;
   - what depends on them: supply chains run by practitioners, and stresses that practitioners offset.

   The Magic tab's roles, its reliance sentence, the Defense row and the Overview score should all read that one fact. "Integral" should require a practitioner and a real dependence, not just a dial at 66. Support that comes only from a church should be called faith, not arcane work.

4. **Retire the private keyword lists.** That means priorityHelpers' flags, magicLedger's regex and defenseGenerator's lists, replaced by catalog identity. The same move stops "Hospital present" from a healer and "church" from "Access to parish church".

5. **Add these joins to the built-in self-check (the coherence receipt)**, so it fails when two tabs answer the magic questions differently.

## 4. Garrisons, walls and hospitals that do not exist

**Reproduced:** yes

### Reproduction

I reproduced it in two ways, without changing the repo (still at c0ef42c13 with a clean tree). All probes are in /tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/causes/defense/.

(1) THE AUDIT'S OWN FILES. audit-attrib.mjs matches every hit in coherence/results.json to the code that wrote it. Only one hit needed extra tracing: a stress-driven "Garrison Commander" NPC, traced separately below.
- DEF-3 (garrison talk with no garrison, barracks or citadel), 50 of 64. Settlements carrying each source:
  - "Upkeep underfunded: garrison pay at N%": 25
  - Economic Survival line "undermine garrison morale" / "sustains garrison pay": 19
  - Power tab "The garrison handles bodies…" / "the garrison can arrest…": 17
  - Charter-hall line "a garrison is wrong for…": 15
  - Crime-wave card "The garrison · Vigilantes · …": 9
  - Charter-absent line "…is the garrison's problem…": 5
  - Charter-hall description "when the garrison cannot": 4
  - Wartime "garrison is reinforced": 4
  - Relationships: 2
  - NPC secret: 1
  - DS-DEF-2 STRONG line: 1
  - 42 of the 50 have the trouble on the Defense tab. 31 also have it on another tab. None is counted only because of the generic "a garrison is wrong for" phrasing.
- DEF-4 ("No walls or garrison" in the same tab), 18 of 40:
  - Economic Survival line: 9
  - Charter-present line: 6
  - "garrison pay" note: 6
  - Charter-absent line: 3
  - Other: 3
- DEF-2 (walls with no walls), 10 of 42:
  - Property Rents "within the walls": 4
  - NPC secrets: 3
  - Posture line "enough on the walls": 3
  - Founding line "every soul inside the walls": 2
  - Arrival "palisade lines": 1
  - Economy wealth line: 1
  - Underground-network service: 1
- HOSP-1 ("Hospital present" with no hospital), 15 of 15 hits are rosters with "Healer (divine, 1st level)" (9) or "Monastery or friary" (6). All 9 villages are healer cases.
- Hand-read case: audit-hamlet-3.txt prints "No walls or garrison." and then "…undermine garrison morale."

(2) FRESH SETTLEMENTS. fresh.mjs uses the app's own path (loadGenerationLawPayloads, then birthConfig({...DEFAULT_CONFIG,...}), then generateSettlementPipeline): 90 settlements, 15 per tier, seeds defprobe-<tier>-<i>. It calls the same functions the Defense tab calls: buildThreatAssessment, deriveDefenseReadiness, deriveSupportingCapabilities, defenseThreatProse/ForcesProse/PostureProse through drawnAtMount.
- 38 of 49 settlements with no garrison speak of one:
  - Economic Survival line: 23
  - "garrison pay" note: 20
  - Charter lens: 28, of which 11 are the absent variant that assumes a garrison, e.g. "The thorp sends soldiers to things soldiers are wrong for…"
  - Faction standing: 18
  - Charter-hall description: 8
  - Crime-wave card: 6
- "Hospital present" with no hospital: 10 of 32 (6 healer, 4 monastery). All 10 also say "Hospital infrastructure enables disease containment and systematic quarantine."
- The flag readers agree with the roster: compound.inst.hasGarrison and defenseProfile.institutions.garrison call 0 of the 49 garrisoned. So the fact exists; the sentences do not read it.
- one.mjs prints single rows:
  - defprobe-thorp-1 (25 people, roster ['Palisade']): "[Invasion & War] Walls present but no organized military force to man them… || Upkeep underfunded: garrison pay at 90%", and "[Economic Survival] …undermine garrison morale."
  - defprobe-hamlet-6 (roster ["Adventurers' charter hall"]): "[Invasion & War] No walls or garrison. … || Upkeep underfunded: garrison pay at 96%". This is one row contradicting itself.

### Root causes

**1. (unchecked-template)** Fixed sentences that mention a garrison, soldiers or walls are picked by something else: the economy grade, the charter hall plus the monster threat, the readiness grade, the stress, the tier, or a crime-wave template. None of them first checks whether the place has a garrison or walls. The engine already knows (the defence roster reading agrees with the institution list every time), but these writers never look. Inside one pool, often only some variants assume a garrison or walls, so whether a thorp talks about its garrison comes down to the seed's dice roll.

*Code:*

Garrison:
- src/domain/display/threatAssessment.js :: buildThreatAssessment L164-172. econA is chosen only from scores.economic and says 'sustains garrison pay' / 'undermine garrison morale', although hasGarrison is computed at L41 and used at L113-125 by the row above.
- src/domain/display/stateProse/defenseStateProse.js :: charterPoolKey L1201-1205 (forces.charter x monsterThreat only) -> src/data/dossierStateProse/defense.generated.js L2392-2416 'charter hall ABSENT…': "…is the garrison's problem…" / "The town sends soldiers to things soldiers are wrong for".
- defenseStateProse.js :: economicRowPoolKey L498-501 (dp.scores.economic only) -> defense.generated.js L794-797 'Economic Survival: STRONG': '…the garrison can be kept paid'.
- src/generators/historyGenerator.js :: substituteNames L466: 'Official guards' -> milFaction || 'The garrison'. The template is src/data/historyData.js L1212-1214 crime_wave.
- src/data/institutionalCatalog.js L1331 and src/data/institutionDescVariants.js L242-243: charter-hall descriptions 'when the garrison cannot'.
- src/generators/stressNarrative.js L147 and src/generators/narrativeText.js L186: wartime 'the garrison is reinforced'.
- src/data/npcData.js L1672, L1687: relationship templates about 'the garrison's pay'.
- src/data/stressInstitutionEffects.js L342, L473: NPC secrets.
- src/generators/npcGenerator.js L1455-1470 STRESS_MANDATORY_ROLES: 'Garrison Commander' for under_siege, monster_pressure, wartime and slave_revolt.

Walls:
- defenseStateProse.js :: posturePoolKey L698-702 (readiness.score only) -> defense.generated.js L62 'readiness ADEQUATE' visitor variant: '…enough on the walls…'.
- src/generators/economy/economicState.js L166-173: Property Rents 'within the walls', gated only on getTradeRouteFeatures(tier).
- src/data/narrativeData.js L429: infiltrated founding line.
- src/data/cultureProfiles.js L301 (architecturalDetails, used by arrivalScene).
- src/data/dossierStateProse/economy.generated.js L1957.
- src/data/institutionServices.js L1567.

*Evidence:*

Audit DEF-3: Economic Survival line 19, charter-absent 5, crime-wave card 9, charter-hall description 4, wartime 4, relationships 2, NPC secret 1, STRONG 1, Garrison Commander NPC 1 (coh-town-03, roster 'Town watch', no garrison). Fresh: Economic Survival 23 of 49, charter-absent 11 of 49, crime-wave 6 of 49, charter description 8 of 49. Audit DEF-2: 10 of 42, every hit one of the wall sources listed. The no-wall settlements were confirmed to have no wall, palisade or earthwork institution (coh-village-04 has none; coh-town-03 has Town watch, Free company hall and Veteran's lodge). In fresh.rows.json the existing fact (compound.inst.hasGarrison, defenseProfile.institutions.garrison, standingDefenseForces) calls 0 of 49 no-garrison settlements garrisoned. The pool keys in pools.mjs show that only some variants in each pool presuppose.

**2. (naming-gap)** The Invasion & War upkeep note always calls the money 'garrison pay'. But the number behind it is recorded whenever the place has any defence at all: walls, a militia, a watch, hired swords or a charter hall. A 25-person thorp with a palisade is told its garrison pay is at 90%, in the same row that says no organized force exists. A hamlet whose only defence is an adventurers' hall reads 'No walls or garrison… Upkeep underfunded: garrison pay at 96%'.

*Code:*

- src/domain/display/defenseDisplay.js :: READINESS_GATE_FOR L347-353: 'Invasion & War': ['military', 'garrison pay'] is a fixed label.
- deriveDefenseReadiness L386-389 prints `Upkeep underfunded: ${expense} at N%` whenever economicGates.military < 1.
- src/generators/defenseGenerator.js :: computeDefenseScores: hasAnyDefense at L185-186 (walls || garrison || militia || watch || mercenary || charterHall); milUpkeepMult at L197; economicGates.military is recorded when hasAnyDefense, at L477.
- The DefenseTab.jsx fundingNotes at L260-262 render it under the row's assess at L424-425.

*Evidence:*

Audit DEF-3: 25 of the 50 carry it, and 6 of the 18 DEF-4 cases put it beside 'No walls or garrison'. Fresh: 20 of 49 no-garrison settlements show it. The forces behind those notes: 7 thorps with only a Palisade, hamlets and villages with militia plus charter, towns with only a watch. one.mjs defprobe-thorp-1 (roster ['Palisade'], gates {military:0.9}) and defprobe-hamlet-6 (roster ["Adventurers' charter hall"], gates {military:0.96}) print the contradictions quoted above.

**3. (naming-gap)** The flag called hasHospital really means 'there is some healer or monastery here'. Every place that reads it prints the word hospital: 'Hospital present', 'Hospital infrastructure enables… systematic quarantine', 'somewhere to put the sick'. So a village with one 1st-level divine healer is shown as having a hospital. Real hospitals do exist in the catalogue under their own names, so the word is wrong rather than just loose.

*Code:*

- src/generators/priorityHelpers.js :: getInstitutionNames L68: hasHospital = hasAny(names, ['hospital','monastery','healer','friary']).
- Readers that print it as a hospital:
  - src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities L305-306: status 'Hospital present'.
  - src/domain/display/threatAssessment.js L184-185: 'Hospital infrastructure enables disease containment and systematic quarantine.'
  - src/domain/display/stateProse/defenseStateProse.js :: defenseThreatProse L619-621 -> disasterRowPoolKey L551-553: pools 'granary AND hospital' / 'NO reserves, hospital present'.
- The flag also feeds the scores in src/generators/defenseGenerator.js: monster +5, and the disaster fallback in defenseDisplay.js.
- Real hospital entries: src/data/institutionalCatalog.js L923-925 (Small hospital, Major hospital, Hospital network).

*Evidence:*

Audit HOSP-1 15 of 15: 'Apothecary, Healer (divine, 1st level)' x7, 'Healer (divine, 1st level)' x2, and Monastery-or-friary rosters x6; 9 villages, 6 towns. Fresh: 10 of 32 'Hospital present' have no hospital (6 healer, 4 monastery). All 10 also print 'Hospital infrastructure enables disease containment and systematic quarantine.' defprobe-village-3 adds the desk line '…can treat and contain an outbreak…'.

**4. (missing-single-source)** The word 'military' means two different things in the engine. One is a power bloc called 'Military/Guard', created from the military priority setting (a hamlet's version describes itself as 'Armed patrol and informal militia'). The other is an actual garrison institution. The Power tab's standing sentences treat any faction whose name contains 'Military' or 'Guard' as proof of a garrison. So hamlets and villages with no garrison read 'The garrison handles bodies, the clergy handles minds' or 'the garrison can arrest individuals'.

*Code:*

- src/generators/power/rulingStructure.js: militaryPower at L113 (from instFlags.militaryEffective, which is priority-driven; src/generators/priorityHelpers.js L375 and L385-393 keep it alive at a 0.4 multiplier even with no military institution). The faction is pushed at L570-599 when militaryPower > 5 and tier !== 'thorp' (or priority > 60).
- src/generators/power/factionStanding.js :: annotateFactionStanding: hasMilitary at L26 = a faction NAME containing 'Military' or 'Guard'. The 'the garrison…' notes are at L114-125, and 'The garrison handles bodies…' at L241-249. No institution is read.

*Evidence:*

Audit DEF-3: 17 of 50 carry these Power-tab lines. Fresh: 26 of 49 no-garrison settlements have a 'Military/Guard' faction (11 hamlet, 11 village, 4 town), and 18 of them get a faction description saying 'the garrison'.

**5. (other)** Nothing in the built-in self-check looks at defence facts, so all of this ships while the receipt passes 389 of 389.

*Code:*

src/generators/generationReceiptJudgments.js (864 lines): no judgment mentions garrison, wall, hospital or defen*.

*Evidence:*

A case-insensitive grep -n -E 'garrison|wall|hospital|defen' on src/generators/generationReceiptJudgments.js returns nothing. The report lists the self-check as passing 389 of 389.

### Shared with the other failures

Measured, same cause:
- FOOD (#1): The same unchecked-template / naming-gap shape is inside the Defense tab. threatAssessment.js L181-183 'No food reserves…' and defenseDisplay.js L311-312 'No reserves' read only hasGranary (whether a granary institution exists), never economicState.foodSecurity.storageMonths. In the audit's 120 settlements, 60 Defense tabs print 'No food reserves', and all 60 hold storageMonths > 0 (coh-thorp-01..04 = 1.9 months; crosslinks.mjs). That is the report's own example: "the Defense tab says No food reserves… the data holds 1.9 months".
- NAMING (#7): historyGenerator.js L466-467 substituteNames writes 'The garrison' and 'the criminal network' as fallback role words when no matching faction exists. That is the same place-name-holder-instead-of-a-name shape as the unnamed occupier or creditor (the audit's CON-2b check counts both).
- SIZE WORDING (#8): two links. First, speakTierNoun (stateProseKernel.js L538, L549-562) only rewrites 'the/this town', so 'A stranger sees an ordinary defended town at X' reaches villages (coh-village-04, -14). Second, npcGenerator.js L1448 TIER_MANDATORY_ROLES gives every village a 'Guard Captain', chosen by tier and not by roster: 7 of 20 audit villages with no watch, militia, garrison or guard institution still have one. That is the 'guards where none exist' half of this failure.
- REPETITION (#6): threatAssessment writes one fixed sentence per branch with no names. 'A sustained crisis will exhaust reserves and undermine garrison morale.' appears word for word in 17 audit settlements.

Same shape, not measured here:
- MAGIC (#3): OverviewTab.jsx L390 prints a 'Magical Capability' row from scores.magical with no world-law check, while the Defense tab's arcane row does check magicWorksAt. That is the same kind of row printed without asking the fact, but I did not count it.
- FAITH (#2) and WHO RULES (#5) follow the same broad pattern of several writers answering one question from different inputs, but I did not trace their code, so I am not claiming them.

### Shape of a fix

1. Settle 'what defends this place' once. The answer already exists (standingDefenseForces: walls, garrison, militia, watch, hired swords, charter hall, all from the live roster). Make it the one answer every writer reads, including the generation-time writers that run earlier: faction standing, history tension cards, stress NPC roles, relationship and secret templates, the wartime narrative, and the revenue lines.

2. Give each fixed sentence that names a garrison, soldiers or walls a stated need ('needs a garrison', 'needs walls'). Draw it only when the place meets that need. Otherwise use a variant that names what actually stands ('the militia', 'the watch', 'the palisade'), or say nothing. This applies to:
   - the Economic Survival sentences;
   - the charter-absent and posture pool variants;
   - the Property Rents and founding lines;
   - the 'Garrison Commander' stress role and the village 'Guard Captain' role.

3. Name the upkeep note after what is actually paid for: wall upkeep, watch wages, militia stores or charter retainers, or simply 'defence upkeep'. If the design means militia and walls are unpaid, stop recording a pay shortfall for them at all.

4. Split the hospital flag into two facts: a real hospital, and 'a healer or monastery infirmary'. Print the second honestly ('Healer', 'Infirmary at the monastery', 'Clergy care'), and keep its score effect if that is wanted.

5. When the Military/Guard bloc stands over only a militia or patrol, have its standing lines say so. Have the crime-wave card use the real force's name, or leave that side out, rather than writing 'The garrison'.

6. Add to the built-in self-check: no garrison words without a garrison, no wall words without walls, and no hospital words without a hospital. Also check the same thing for food, so that 'No food reserves' is never printed when stored months are above zero.

## 5. Who rules has no single answer

**Reproduced:** yes

### Reproduction

Probes (read-only on the repo) are in /tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/causes/rulers/. The main one is seat.mjs, with four modes: fresh, replay, corpus120 (seat120.mjs) and files. holds.mjs counts the "Holds power" markers. Every row is saved as rows-<mode>.json and every table as <mode>.out.txt.

1) The audit's 389 settlements, regenerated from corpus-edges/records.jsonl the way its own seat.mjs did (replay.out.txt):
   - Thorps: 64 of 64 name nobody in the seat. 61 show "No named seat-holder" and 3 show "seat stands empty" (a claimant bloc).
   - Hamlets: 48 of 63 name nobody (47 plus 1). 12 seat "The Lord Mayor" of Manor Household, a noble-category faction that does not govern. 3 seat a Reeve.
   - The governing faction has an NPC whose role is Elder in 64 of 64 thorps and 63 of 63 hamlets.
   - Villages through metropolises always seat the Mayor or Governor, except for the claimant vacancies.
   These match the audit exactly.

2) The audit's 120-settlement corpus, regenerated (corpus120.out.txt):
   - The fixed note "The faction that appears to govern is not the faction that governs" appears in 52 of 120: thorp 15, hamlet 10, village 12, town 5, city 4, metropolis 6. This also matches.
   - Across the 389, the note appears in 110. In 92 of them another faction outranks the governing one, so a name was there to give. In 18 the governing faction is still the strongest, so the claim has nothing behind it.

3) Fresh settlements on the app's own first-generation path (fresh.out.txt): loadGenerationLawPayloads, then birthConfig({...DEFAULT_CONFIG, settType, ...}), then generateSettlementPipeline, 20 per tier.
   - Thorps: 19 show "No named seat-holder" and 1 is a claimant vacancy. Every one has an Elder in the governing faction, for example Malik al-Malik, Elder of the Elder Council.
   - Hamlets: 11 show no seat-holder, 5 seat "The Lord Mayor" of Manor Household, 3 seat a Reeve and 1 is vacant.
   - Density law: every settlement is on v1, because the signature in densityBands.js is still `signed:false, live:false`.

4) The audit's 18 saved files, read without regenerating (files.out.txt):
   - All 3 thorps and 2 of 3 hamlets show no seat-holder.
   - Tlalhuitz renders "The seat · The Lord Mayor, Lord Mayor" (audit-hamlet-3.txt:331) while its Elder, Ehecatl Chel, is in the governing Feudal Stewardship.
   - Skaldthorpe's Power tab says, all on one tab: "No named seat-holder", "Ruler · Elder Council", "Household elder" as an institution behind the power, "Elder Council ↳ 1 member", and "The faction that appears to govern is not the faction that governs". Its NPC tab lists "Idunn Haraldsson · Elder" (audit-thorp-1.txt:177-229 and :412).

5) Counterfactual, done in the probe and not in the repo: add the single word 'elder' to the seat-finder's list of ruler words. The seat then goes to the governing faction's Elder in 61 of 61 unseated thorps, 47 of 47 unseated hamlets, and 12 of 12 Lord Mayor hamlets. In the 3 Reeve hamlets it switches to the Elder, because those factions hold two heads.

6) Two or more ruler-titled NPCs sit inside the governing faction in 14 of 68 villages, 17 of 61 towns, 24 of 71 cities and 37 of 62 metropolises (replay). Common pairs are Mayor and Chief Magistrate, Mayor and Reeve, Governor and City Watch Chief, Governor and Lord. In 5 of the 18 audit files two or three heads share one identical paragraph; in Palaiodion the Mayor, Governor and Reeve all read "Holds governing authority in a settlement with functional legitimacy...".

7) "↑ Holds power" appears on 4 factions in 15 of the 18 audit settlements and 52 of 60 fresh ones. In all 3 audit thorps every faction carries it.

### Root causes

**1. (missing-single-source)** The generator never writes down who holds the seat. It creates a head of government first, which is an Elder in a thorp or hamlet, a Mayor in a village to city and a Governor in a metropolis. It ties that NPC to the governing faction, then forgets which one it was. The Power tab has to guess the seat-holder afterwards from title words. The NPC tab, the Quick Guide and the role prose each make their own guess. The design that records one head per faction exists, but it lives in the Register VII density law, which is unsigned and dormant.

*Code:*

/home/user/settlement-engine/src/generators/npcGenerator.js :: generateNPCs TIER_MANDATORY_ROLES (lines 1445-1451: thorp ['Elder',…], hamlet ['Elder','Priest'], village–city ['Mayor',…], metropolis ['Governor',…]), generated first at lines 1493-1510. /home/user/settlement-engine/src/generators/npcGenerator.js :: ROLE_FACTION_MAP (lines 931-942: ['elder', govFaction], ['mayor', govFaction], ['reeve', govFaction], ['lord', govFaction], ['governor', govFaction]) locks those roles to the governing faction, applied at lines 1067-1072 and 1117-1118. No field marks the seat-holder. /home/user/settlement-engine/src/domain/dossier/powerStrata.js :: rulingChainOf (lines 308-367) infers the seat: step (1), the ladder, never fires at birth (0 of 389 'via ladder'); step (2) is the title guess. /home/user/settlement-engine/src/domain/density/densityBands.js :: REGISTER_VII_SIGNATURE (lines 60-63, signed:false, live:false) keeps the head-rung law dormant, so every new world is v1 (densityLaw.js lines 98-101; factionRoles.js line 313 notes that under v2 'the rung roll makes one of them its head').

*Evidence:*

Replay of the 389: rulingChainOf resolves the seat 'via roster' in 268 settlements, 'via ladder' in 0, and names nobody in 121. Fresh settlements on the app path report density law v1 for all 120. The governing faction holds a mandated Elder in 64 of 64 thorps and 63 of 63 hamlets, and in villages and larger the mandated Mayor or Governor is always the seat (66, 59, 68 and 60 seated, plus the claimant vacancies). The head is always there in the data; it just is not recorded as the head.

**2. (naming-gap)** The seat-finder and the generator use two different lists of what a ruler is called. The generator treats 'elder' as a governing title and puts the Elder in the governing faction. The seat-finder's list (ruler, lord, lady, mayor, governor, reeve, chief, prince, duke, baron) has no 'elder', and another table files 'elder' next to clerk and scribe. So the one person a thorp or hamlet is built around is never read as its ruler, and the tab prints 'No named seat-holder' beside the Elder. The same loose word matching works the other way too: 'chief' catches 'Chief Magistrate' and 'City Watch Chief', and 'lord' catches 'Crime Lord'.

*Code:*

/home/user/settlement-engine/src/domain/worldPulse/npcAgency.js :: NPC_ROLE_ARCHETYPES.ruler.labels (lines 24-25) has no 'elder'. NPC_ROLE_ARCHETYPES.civic.labels (line 60) lists 'elder'. /home/user/settlement-engine/src/domain/dossier/powerStrata.js :: isRulerTitled (lines 269-272) does a substring test of name, role and title against the ruler labels. rulingChainOf step (2) (lines 340-347) filters the roster to ruler-titled NPCs, so the Elder is dropped. The absence branch (lines 357-363) then writes 'No named seat-holder stands in the record. The chain ends, honestly, at the faction.', rendered by /home/user/settlement-engine/src/components/new/tabs/PowerTab.jsx :: RulingChainBlock (lines 146-151). Compare /home/user/settlement-engine/src/generators/npcGenerator.js line 933 ['elder', govFaction].

*Evidence:*

Replay of the 389: 61 of 64 thorps and 47 of 63 hamlets fall into the 'unrecorded' branch, and each one has an Elder in the governing faction. Fresh: 19 of 20 thorps and 11 of 20 hamlets, likewise. The probe re-ran step (2) with 'elder' added to the ruler words and seated the governing faction's Elder in 61 of 61 thorps, 47 of 47 hamlets and 12 of 12 Lord Mayor hamlets. Skaldthorpe (audit-thorp-1.txt:180 and :412) shows 'No named seat-holder' on the Power tab and 'Idunn Haraldsson · Elder' on the NPC tab.

**3. (unchecked-template)** When the seat-finder finds no ruler in the governing faction, it grabs any NPC in the whole settlement with a ruler-sounding title, provided there is only one. It does not check the faction, and it does not check whether the NPC is a real person or a stand-in. A separate step adds unnamed stand-ins for offices nobody holds. Every noble house gets one titled 'The Lord Mayor', a civic-head title for a town. A governing body like 'Feudal Stewardship' or 'Free Elder Council' is filed as 'government', not 'noble', so it never counts as covering the noble office. The noble house, Manor Household, gets an unnamed Lord Mayor, and because the Elder is invisible to the seat-finder, that Lord Mayor becomes the hamlet's seat-holder.

*Code:*

/home/user/settlement-engine/src/domain/dossier/powerStrata.js :: rulingChainOf line 345 `const chosen = seated || (rulers.length === 1 ? rulers[0] : null);`, the settlement-wide unique-title fallback, with no faction or placeholder check. /home/user/settlement-engine/src/generators/factionRoles.js :: FACTION_ROLES.noble (lines 55-56: role 'Lord Mayor', no tier gate). ensureFactionStructuralNpcs (lines 296-370) checks office coverage by the archetype of each NPC's faction (lines 341-357) and adds a stand-in at line 363 when the office is uncovered. generateFactionStructuralNpcs (lines 200-276) uses name nameTemplateFor(role) and returns `The ${role}` (line 399). It is called from /home/user/settlement-engine/src/generators/steps/assembleSettlement.js line 306, and is active because the density law is v1 (factionRoles.js line 313). /home/user/settlement-engine/src/domain/factionArchetypes.js :: factionArchetype (lines 103-121): a recognised category wins, so the governing bodies with category 'government' never become 'noble'.

*Evidence:*

Replay: in 12 of 63 hamlets the seat is 'The Lord Mayor [Lord Mayor]', whose faction is Manor Household (category noble), while the governing faction (category government) holds an Elder. All 12 are stand-ins. Fresh: 5 of 20 hamlets (Mönkhbaliq, Ulaancaravansarai, Cerrocivitas, Flachfeld, Tzulhuacan). Unnamed 'The Lord Mayor' NPCs appear in 83 of 389 settlements: 27 cities (Noble Families), 20 villages and 12 hamlets (Manor Household), 16 towns (Landed Gentry), 8 metropolises (Noble Houses). That matches the audit's '"The Lord Mayor" 83 times'. Tlalhuitz renders 'The seat · The Lord Mayor, Lord Mayor' (audit-hamlet-3.txt:331).

**4. (other)** Larger places can have several heads of government at once, and nothing in the generator stops it. The pool of governing roles offers Mayor, Lord, Governor, Duke/Viceroy, Chief Magistrate, Reeve and Council Member at about equal weight. The random fill can draw several of them, and all go into the governing faction. The role-prose writer then gives each one the head-of-government paragraph, because it chooses text by category, condition and rank rather than by who holds the seat. The seat-finder takes whichever comes first, usually the mandated Mayor. That is how Palaiodion ends up with a Mayor and a Governor (and a Reeve), each 'holding governing authority', plus the unnamed Lord Mayor from the cause above.

*Code:*

/home/user/settlement-engine/src/data/historyData.js :: POWER_ROLES_BY_CATEGORY government (Mayor line 21, Lord line 28, Governor line 35, Chief Magistrate line 95, Reeve line 119; priorities 6-10), read by /home/user/settlement-engine/src/generators/economy/upgradeOpportunities.js :: getUpgradeOpportunities (lines 13-60). /home/user/settlement-engine/src/generators/npcGenerator.js weighted fill (lines 1524-1550) has no one-head rule, and ROLE_FACTION_MAP (lines 933-942) locks each to the governing faction. /home/user/settlement-engine/src/generators/npcStructure.js :: reg('government', …) templates: for example, line 110 'Holds governing authority in a settlement with functional legitimacy…' goes to every government-category NPC of the dominant faction (getRank, lines 37-47). /home/user/settlement-engine/src/domain/dossier/powerStrata.js line 344 `rulers.find(...)` takes the first in roster order.

*Evidence:*

Replay: two or more ruler-titled NPCs in the governing faction in 14 of 68 villages, 17 of 61 towns, 24 of 71 cities and 37 of 62 metropolises. The top pairs are Mayor+Reeve (9 villages), Mayor+Chief Magistrate (9 towns, 6 cities), Governor+City Watch Chief (6 metropolises), and Mayor+Governor+Chief Magistrate (3 cities). Palaiodion (audit-city-1.json): Hypatia Kamytzes is Mayor, Ioannikios Alexios is Governor and Demetrios Chrysoberges is Reeve, all in Noble Governorship, all with the identical structuralPosition 'Holds governing authority in a settlement with functional legitimacy…' (audit-city-1.txt:1503-1535). 'The Lord Mayor' is in Noble Families (:1576). In 5 of the 18 audit files two or three heads share one paragraph.

**5. (unchecked-template)** 'The faction that appears to govern is not the faction that governs' is one fixed sentence. It is attached to the governing faction whenever the public-legitimacy score drops below 30. No part of the generator works out or stores which faction does govern, so the sentence can never name one; it turns a low score into a claim about a hidden ruler. The same branch cuts the governing faction's power by 40%, so the penalty itself often creates the stronger rival, and in 18 of 110 cases no stronger rival exists at all. The panel line 'Governance fractured. Real decisions are being made informally.' comes from the same flag. Meanwhile the same tab still labels the governing faction 'Ruler'.

*Code:*

/home/user/settlement-engine/src/generators/factionDynamics.js :: applyLegitimacyMultipliers (lines 517-567): the isGov branch, lines 532-538, sets mult = govMultiplier (0.60 at Legitimacy Crisis, /home/user/settlement-engine/src/data/bandLadders.js line 28) and, if publicLeg.governanceFractured, the literal crisisNote at line 537. legitimacyBandFor (lines 102-116) gives governanceFractured: score < LEGITIMACY_CUTS.contested (30, bandLadders.js line 20). computePublicLegitimacy (lines 128-172) reads prosperity, safety, and tier-scaled defense and food. The note is re-applied by the economy reconciliation replay (/home/user/settlement-engine/src/generators/power/economyReconciliation.js lines 45-50). It renders in /home/user/settlement-engine/src/components/new/tabs/power/PowerStrata.jsx :: FactionRow line 331, and the fracture line in /home/user/settlement-engine/src/components/new/tabs/PowerTab.jsx lines 339-342.

*Evidence:*

Replay of the audit's 120: 52 of 120 carry the note (thorp 15, hamlet 10, village 12, town 5, city 4, metropolis 6). Note and fracture flag agree in 120 of 120. Across the 389: 110 noted; in 92 a non-governing faction outranks the governing one after the penalty; in 18 the governing faction is still strongest. In the 11 noted audit files the governing faction was strongest in 4 before the ×0.6 cut and in 1 after it. Thorps are hit hardest because of real negative inputs: on average −18 from prosperity (Struggling or Poor in 17 of 20) and −16.8 from safety. This is not the scaling of one weight: scaling prosperity by tier as food is scaled still leaves 14 of 15 noted. Skaldthorpe shows 'Ruler · Elder Council' and the note on the same faction (audit-thorp-1.txt:198-229).

**6. (unchecked-template)** Palaiodion's last two answers come from fixed sentences that never look at what kind of government the place has. The 'Noble governor' institution always says 'a royal or ducal appointee governs', even beside a seated Mayor. The faction-standing and relationship sentences talk about council votes and council access whether or not a council governs.

*Code:*

/home/user/settlement-engine/src/data/institutionalCatalog.js line 999 ('A royal or ducal appointee governs; the city operates as a noble fief.') and its variants in /home/user/settlement-engine/src/data/institutionDescVariants.js lines 1058-1059 (the 'city|Government|Noble governor' key at line 1681). /home/user/settlement-engine/src/generators/power/factionStanding.js line 68 ('…every council vote is negotiated.'). /home/user/settlement-engine/src/generators/power/rulingStructure.js line 493 ('…expect council access in return.'). /home/user/settlement-engine/src/generators/factionDynamics.js line 409 ('They vote together…').

*Evidence:*

Palaiodion, governed by a Noble Governorship: audit-city-1.txt:349-350 'Noble governor · Government / A royal or ducal appointee governs', :1169 'The seat · Hypatia Kamytzes, Mayor', :1264-1267 'expect council access in return… every council vote is negotiated', :1310 'They vote together'.

**7. (naming-gap)** The label '↑ Holds power' goes on the ruling faction and also on up to three challengers. The challengers are, by definition, the factions that do not hold the seat. So most settlements show four factions that all 'hold power', and in a three-faction thorp every faction does.

*Code:*

/home/user/settlement-engine/src/components/new/tabs/power/PowerStrata.jsx :: FactionRow lines 306-314 print '↑ Holds power' when r.isPower. /home/user/settlement-engine/src/domain/dossier/powerStrata.js :: derivePowerStrata (lines 107-170) sets isPower for the ruler and every coup contender. /home/user/settlement-engine/src/domain/rulingPowerCoup.js :: coupContenders lines 104-106 allow up to 3 non-criminal contenders.

*Evidence:*

holds.mjs: 4 factions carry 'Holds power' in 15 of 18 audit settlements and 52 of 60 fresh ones. Every faction carries it in all 3 audit thorps (3 of 3) and in 20 of 60 fresh settlements. This matches the readers' 'four factions all marked Holds power'.

### Shared with the other failures

Three of the other failures share code with this one:

- **Naming (failure 7): yes, the same code.** The stand-in step that adds 'The Lord Mayor' (factionRoles.js :: ensureFactionStructuralNpcs, named by nameTemplateFor 'The ${role}') also produces the other role-only NPCs the audit counted: 'The Guildmaster', 'The Senior Trader', 'The Kingpin' and 'The Archmagister'. 'The Lord Mayor' alone is in 83 of 389 settlements. The unnamed occupier, creditor or besieger at the centre of a crisis comes from different code and is not explained by this cause.
- **Size wording (failure 8): partly.** The noble stand-in has one title for every size, 'Lord Mayor', with no size check, so a town office appears in 12 hamlets and 20 villages. The council-vote sentences (factionStanding.js:68, rulingStructure.js:493) are the same kind of fixed sentence that never checks the place.
- **Repetition (failure 6): partly.** The settlement never has one recorded head and the governing roles have no one-head rule, so every head-of-government NPC gets the same head paragraph from npcStructure.js. In 5 of 18 audit files two or three heads share it word for word (Palaiodion: Mayor, Governor and Reeve). The '13 behaviour lines' finding is a different pool (npcs[].presentation.behaviour: 1,030 NPCs, 13 distinct lines) and is not this cause.

**Food, faith, magic and defence: none of this code drives them.** They share the general pattern (nothing records the answer once, so each tab works out its own), but not the code.

### Shape of a fix

The fix, in plain terms (nothing has been changed):

1. **Write down who rules, once, at generation.** After the NPCs are sorted into factions, mark one person in the governing faction as the seat-holder. That person is the head the generator already creates first: the Elder in a thorp or hamlet, the Mayor in a village to city, the Governor in a metropolis. The Power tab's "Who runs this place?", the NPC tab, the Quick Guide and the PDF all read that one mark.
   - The dormant Register VII density law already has a "one head per faction" design.
   - This is your call. It changes what new settlements generate, which is a declared shift, and it reopens the rule recorded in §815 that the seat is "never a merely-senior member". The Elder is the head by construction, not just a senior member.
2. **Interim cure.** Until step 1 lands, the seat-finder should use the generator's own list of governing titles, the same one that puts the Elder in the governing faction, instead of a second list without 'elder'. It should also match whole words, so 'Chief Magistrate' and 'Crime Lord' stop counting as rulers.
3. **Seat-finder limits.**
   - Never seat someone from another faction.
   - Never seat an unnamed stand-in.
   - Remove the "only ruler-titled NPC anywhere" fallback.
4. **Noble houses.**
   - Give the noble house's stand-in a title that fits its size and is not a civic head's ("Lord of the Manor" or "Head of the House", not "Lord Mayor").
   - Give it a real name.
   - Do not add it when it would just double the seat-holder's office.
5. **One head of government per faction.** When the random fill draws governing roles, allow one head; extra Governors, Lords, Reeves or Chief Magistrates become deputies. Only the seat-holder gets the "holds governing authority" paragraph.
6. **The fracture note.**
   - When a rival really does outrank the seat, name it: "In practice it is the Religious Authorities who decide." That is true in 92 of 110 cases.
   - Otherwise drop the "is not the faction that governs" claim and keep only the low-legitimacy reading.
7. **Fixed sentences check the government first.** Council-vote and royal-appointee sentences check what kind of government the place has before they appear.
8. **Label challengers honestly.** Label them "Contests the seat", not "Holds power".
9. **Self-check.** The built-in self-check should test that there is exactly one named seat-holder, that the person is in the governing faction, and that it is not a stand-in. That check would have failed 64 of 64 thorps, which it currently passes.

## 6. Repetition

**Reproduced:** yes

### Reproduction

Reproduced on the audit's own files and on 120 fresh settlements. Nothing in the repo was changed (HEAD c0ef42c13). The probes are in /tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/causes/repetition/ (fresh.mjs, auditfiles.mjs, decompose.mjs, pairwise2.mjs, classify.mjs, npcfields.mjs, toprendered.mjs, pools.mjs). Fresh output is in fresh/ there.

AUDIT FILES. I reran the audit's pairwise.mjs on corpus.jsonl and got the same numbers:
- Story sentences: 16.0% for any pair, 20.1% for same size, worst pair 52.8% (audit-rep-metropolis-19 -> village-18).
- Plot hooks: 19.4%, 23.7%, worst 96.0% (audit-rep-town-3 -> town-7: 24 of 25 hook sentences shared, although culture, route, terrain and priorities all differ; 13 are NPC hooks, 7 viability-hook sentences, 3 tension hooks).
- The "third party is escalating" conflict hook is in 99 settlements. Exactly 99 settlements have at least one conflict. It repeats inside 45 settlements, and exactly 45 have two or more conflicts (21 have none, 54 one, 27 two, 18 three).
- Behaviour lines: 13 distinct lines over 1,030 rows. The three default lines carry 327, 313 and 273 rows (89%). Worst roster: audit-rep-metropolis-10, 9 of 17 people.
- Coherence corpus (120 settlements, the app's path): copies of the third-party hook equal the number of conflicts in 120 of 120. Every settlement with trade dependencies has exactly one distinct impact sentence (87 of 87). The trade line appears on the Economics tab up to 19 times (coh-metropolis-09), and up to 17 times in the hand-read audit-city-1.

FRESH. 20 settlements per size, built the way the app builds them: loadGenerationLawPayloads, then birthConfig({...DEFAULT_CONFIG, settType}), then generateSettlementPipeline. Each was rendered through the app's Overview, Economics, Power, History, NPCs, Relationships and Plot Hooks tabs using the audit's JSX loader, which forces collapsed cards open.
- Raw JSON, the audit's measure: story 18.1% / 24.7% / worst 49.4%; hooks 19.1% / 24.9% / worst 84.6%.
- On screen (generated sentences that also appear on a rendered tab, so interface text is excluded): story 15.8% / 24.1% / 62.5%; Plot Hooks tab 19.1%.
- Third-party hook: copies equal conflicts in 120 of 120. On the Plot Hooks tab the exact repeat is removed, but the "A neutral figure is being pressured by both X and Y" template appears 2 or 3 times on one tab in 41 of 120 (34 of 120 in the audit's corpus).
- Trade line: printed once per dependent supply chain, 120 of 120 exact; one distinct impact sentence per settlement in 89 of 89. Median per settlement: city 6, metropolis 10.5. Maximum 17.
- Behaviour lines: 13 over 997 NPCs; a line repeats inside the roster in 105 of 120 settlements.

VISIBILITY CORRECTION. The NPC behaviour and impression lines, and build, feature and clothes, are printed on no dossier tab and not in the PDF:
- 0 of 997 found on screen in the fresh set, 0 of 995 in the coherence set, 0 of 154 in the 18 hand-read texts.
- No reader in src/components or src/pdf uses presentation.behaviour.
So "13 lines over 1,030 NPCs" is true of the saved data, but no DM reads it in the app. The NPC repetition a DM does read is the shared position / constraint / "Wants" paragraph: 59 of 120 fresh, 61 of 120 coherence, 10 of 18 hand-read (for example, Filip Krylov and Yelena Nikolayev in audit-city-3 have the same paragraph).

The audit's corpus.jsonl was made by gen.mjs, which skips birthConfig. The app-path runs give the same magnitudes, so the generation path is not a factor.

### Root causes

**1. (unchecked-template)** Many sentences are never chosen at all. Each writer holds exactly one sentence for a situation and prints it every time the situation is true, and it keeps no record of having said it. Every settlement in the same situation therefore gets the same words. When that writer runs once per item (per conflict, per supply chain, per leading NPC), one settlement repeats itself too, because the sentence carries no fact about the item.

*Code:*

src/generators/power/conflicts.js :: buildConflictPlotHooks L15-50 (two fixed hooks plus three that need a flag; hooks.slice(0,3); no roll; hook 2 names nobody). It is called once per conflict at L253/L279, and the number of conflicts is randInt(1,3) at L105.
src/generators/economy/economicState.js trade-dependency loop L703-731: the impact sentence at L715-722 is picked from settlement-wide flags (isUnderStress, isEffectivelyIsolated, teleport trade), so every row gets the same text. src/generators/computeActiveChains.js L415-431 copies dep.impact onto every matching chain, and src/components/new/tabs/EconomicsTab.jsx L205-209 prints 'Needs X - {impact}' on every chain card.
src/generators/npcStructure.js :: enrichNPCsWithStructure L408-444: the top 2-5 NPCs get position, goal ('Wants') and constraint from one template per category x condition x rank (L423-424; getRank L37-48).
Across settlements: src/generators/power/rulingStructure.js L479-496 and L648-657 (faction descriptions chosen by power band); src/generators/factionDynamics.js L398-417 (merchant-craft line chosen by power ratio); src/generators/power/factionStanding.js L241-249; src/generators/economy/foodBalance.js :: deriveSupplyRiskAnalysis L643-656.
On screen, src/domain/dossier/plotHooks.js :: dedupeHooks L176-190 removes only exact text, so the neutral-figure template survives with different names.

*Evidence:*

Conflict hooks: in corpus.jsonl, settlements with a conflict (99) = settlements with the third-party hook (99) = settlements with the neutral-figure hook (99), and settlements with 2+ conflicts (45) = settlements where it repeats (45). Copies equal conflicts in 120 of 120 fresh and 120 of 120 coherence. The neutral-figure template appears 2-3 times on one Plot Hooks tab in 41 of 120 fresh.
Trade line: exactly one distinct impact sentence per settlement (89 of 89 fresh, 87 of 87 coherence). The on-screen count equals the chains carrying it, 120 of 120. Maximum 17 fresh (rep-fresh-metropolis-13), 19 coherence, 17 hand-read (audit-city-1).
NPC paragraph: shared by 2+ people in 59 of 120 fresh, 61 of 120 coherence, 10 of 18 hand-read.
Share of all repetition: these unchosen writers are 7.5 of the 15.8 points of on-screen story repetition (48%) and 6.6 of the 19.1 points of plot-hook repetition (35%) in the fresh set (41% and 35% in the audit corpus; classify.mjs). Top on-screen contributors: powerStructure.factions[].desc 3.0 points and factionRelationships narrative 1.9 points.

**2. (small-pool)** Where lines are chosen, the no-repeat rule only lasts for one settlement, and the library behind it is small. A second settlement starts with a clean slate and draws from the same few lines. A large settlement uses up a big share of the whole library, so two large settlements overlap heavily.

*Code:*

src/generators/npcGenerator.js L1398: hookRegistry = { titles, themes, tells, speech } is created fresh inside each generateNPCs call. drawLoyalty at L636 calls src/generators/hookVariety.js drawUnique; when a category runs out it accepts a repeat. The NPC hook library is src/data/npcData.js NPC_FACTION_LOYALTY: 8-12 lines per category, 80 in total. Relationship lines: npcData.js pairProse has 8 variants per archetype, drawn without repeats per settlement (src/generators/power/relationshipArchetypes.js L147).

*Evidence:*

Fresh: 1,470 NPC hook lines use exactly 80 distinct lines, the whole library (pools.mjs, npcfields.mjs). A metropolis draws a median of 26 (a third of the library) and a city 19. NPC hooks are 8.7 of the 19.1 points of plot-hook repetition. Same-size pairs repeat more (24.9% vs 19.1%) because they draw the same categories in the same amounts. The library runs out inside a roster in 4 of 20 metropolises and 2 of 20 cities, and never in smaller places. Worst audit pair: town-3 -> town-7 share 24 of 25 hook sentences, 13 of them NPC hooks.

**3. (small-pool)** The NPC 'how they behave' line is not a library at all. It is looked up from a four-value mood (welcoming, transactional, cautious, dismissive). The mood comes from an impression chosen with replacement, and a 40% override for secret-holders chooses from 3-line lists, also with replacement. Nothing stops two people in one roster getting the same line. The same with-replacement choice is used for build, clothes, role goals (2 per role) and stress secrets. Tells and speech were moved onto the per-settlement no-repeat rule earlier, and they never repeat.

*Code:*

src/generators/npcGenerator.js :: pickTitle L688-695 (pick(NPC_PLOT_HOOKS[category]); behaviour = NPC_PLOT_HOOKS_DATA[disposition]), called at L154.
src/data/npcData.js: NPC_PLOT_HOOKS L203 (28 impressions), NPC_PLOT_HOOKS_DATA L1252-1257 (4 lines), NPC_PRESENTATION_MODES L1259+ (3 x 3 lines).
Live override: src/generators/narrativeGenerator.js :: buildPoliticalNarrative L678-692 (random01(0.4), then getStressHistory at npcGenerator.js L789-845 using pickRandom2).
Other with-replacement choices: npcGenerator.js L349-354 (pickFromArray for build, feature and clothes), L605-624 (role goal), L777 (pickRandom2 of stress secrets).
Contrast: generateReligionType L312-321 uses drawUnique for tells and speech.

*Evidence:*

There are 13 behaviour lines in the whole game (pools.mjs), and all 13 appear over the 1,030 rows in corpus.jsonl; the three mood lines carry 89%; worst roster 9 of 17. Fresh: 13 lines, a repeat inside the roster in 105 of 120.
Same-run comparison: build (10 lines, with replacement) repeats in 82 of 120 rosters; tell and speech (30 lines each, no repeats) in 0 of 120. The code comment at npcGenerator.js L1392-1396 records the same fault fixed for tells and speech only.
Because none of these fields are printed (0 of 997 on screen), this cause drives the raw-JSON score: these fields are 30% of the audit's story score but 1-2% of the on-screen score (classify.mjs).

**4. (other)** Nothing measures this kind of repetition, which is why it was never caught. The only repetition guard counts NPC hooks repeating inside one settlement. Nothing measures what a second settlement repeats, and nothing covers the writers that never choose.

*Code:*

tests/simulation/distributionEnvelopes.test.js ENVELOPE 3, L151-230: it measures collectNpcHooks within one settlement, for towns and cities only. Its own comment names the 8-12-line libraries as an open follow-up for new authored content.

*Evidence:*

In the fresh set, NPC hooks repeat inside a roster in only 6 of 120 settlements, so the guard passes, while plot-hook overlap between settlements is 19.1% and the third-party hook repeats inside 41 of 120 settlements. (I read the test; I did not run vitest.)

### Shared with the other failures

FOOD: yes, the same cause (the first one: a writer that prints one fixed sentence whenever a condition holds). src/generators/economy/foodBalance.js :: deriveSupplyRiskAnalysis L643-656 prints one fixed sentence, "The settlement is starving. Villagers are turning to banditry...", whenever foodBalance.deficit > 0 on a road, isolated or no route. It ignores how big the gap is and how much is stored. That one sentence is the food failure (it fires on any shortfall), and its two halves are two of the twelve most repeated story sentences (70 of 120 settlements each). Viability hooks of this kind are 4.8 of the 19.1 points of plot-hook repetition in the fresh set (5.1 of 19.7 in the audit corpus). Making that hook read the size of the gap and the stores would also cut repetition.

DEFENSE: partly, through the same mechanism in one writer I traced. src/generators/power/factionStanding.js L241-249 prints "The garrison handles bodies, the clergy handles minds..." based on two faction names and a power gap, never on whether a garrison exists. It appears in 78 of 120 fresh settlements, including 4 with no garrison, barracks, militia, watch, guard, castle, keep or fort. Example: rep-fresh-hamlet-01, 211 people, whose institutions are farming, a quarry, an inn and a shrine. I did not trace the Defense tab's pay and morale text.

MAGIC: a small overlap. The one-per-settlement trade-impact sentence is stamped on chains whose need is "Magical ley lines" (audit-metropolis-1, Spellcasting Services), so a ley-line need reads as a road dependency. This is not the cause of the magic failure.

SIZE WORDING: a different cause. In 36 of 40 fresh thorps and hamlets, "the town" reaches a rendered tab, mostly through literal nouns in the Economics sentences ("The town eats."). That is a wording defect, not the size of a library or how lines are chosen.

FAITH, RULERS, NAMING: I found no link to how lines are chosen or how many there are, and I did not trace them, so I claim no shared cause.

### Shape of a fix

Four changes, in plain terms, plus one decision for the owner. Nothing was changed.

1. Writers that never choose need a memory and the item's own facts.
- A sentence that is true of the whole settlement is said once. For example, one line above the supply chains says the place depends on its roads; each chain card then names only what it needs.
- A sentence about one item is built from that item: the conflict's issue and parties, the chain's resource, the person's role.
- Conflict hooks come from a small library per issue, never repeated inside one settlement. The anonymous "third party" hook either names a real third party or is dropped.

2. The leading-NPC paragraph gets a few variants per situation, plus a link between people in the same seat. The second member of a faction then reads as "works with X", not as a copy of X.

3. Every NPC detail chosen with replacement goes through the per-settlement no-repeat rule that tells and speech already use: impression, behaviour, build, clothes, role goal and stress secret. The behaviour line should follow the impression itself, not a four-value mood. Because the behaviour line is never printed, the owner should first decide whether to show it or simply stop counting it as prose.

4. Grow the shared libraries so a metropolis uses a small fraction of them instead of a third. The NPC hook libraries hold 8-12 lines per category, 80 in total; relationship lines have 8 variants.

Owner's decision: should a DM's own settlements remember each other (a used-lines record across their library), or is variety only promised inside one settlement?

5. Add one guard that measures what a second settlement repeats, counted on the rendered dossier with interface text excluded. Widen the existing inside-one-settlement check from NPC hooks to every writer, including template repeats that differ only by names.

## 7. Unnamed people at the centre of the crisis

**Reproduced:** yes

### Reproduction

Probe: /tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/causes/naming/probe.mjs. Outputs are beside it: files.out.txt, fresh.out.txt, replay.out.txt, v2.out.txt and rows-*.json. Nothing in the repository was touched and vitest was not run.

(a) The audit's 18 saved files (mode `files`):
- 15 have an active crisis. In 0 of 15 does the crisis summary or hook contain any NPC name or neighbour name.
- Every stress record carries only these keys: type, label, colour, icon, summary, crisisHook, viabilityNote, historyColour, source, forcedByConfig. No field for an occupier, creditor, besieger, claimant or leader exists.
- The crisis brought 25 factions with it. 14 of them have no named member.
- 4 of 18 show a placeholder faction name and 9 of 18 have a role-only "The X" NPC.
- In the 13 frontier or plagued dossiers, the lines that mention a monster, creature or beast name a specific creature in 0. Three say "raiders" in passing.
- Examples: Penbridge is "under the administrative control of an outside power". Víkset's NPC "Is in contact with the besieging commander". Qingxian reads "The seat The seat stands empty; 2 claimants circle: Claimant Bloc A, Claimant Bloc B."

(b) 96 fresh settlements on the app's own path (mode `fresh`): loadGenerationLawPayloads, then birthConfig({...DEFAULT_CONFIG, ...}), then generateSettlementPipeline. That is every tier times all 15 stresses plus one with no stress, alternating frontier and plagued. The resulting config carries no density-law marker, so the old (v1) path runs.
- 0 of 90 crisis texts name anyone. The one hit was a false match: the surname "Bayan" inside the settlement name "Bayanshari".
- 74 of 121 crisis factions have no named member.
- 29 of 96 have placeholder factions and 62 of 96 have role-only NPCs: Lord Mayor 28, Guildmaster 17, Senior Trader 17, Watch Captain 12, Kingpin 10, Lieutenant 10, High Priestess 9, Archmagister 7.

(c) The audit's 389 corpus-edges configs, regenerated (mode `replay`):
- Exactly 195 of 389 have role-only NPCs, with the same counts (Lord Mayor 83, Guildmaster 55, Senior Trader 55, Watch Captain 32, Kingpin 30, Lieutenant 30, High Priestess 27, Archmagister 18).
- Every one of them carries the marker generatedAs='faction_structural'; none lacks it. Each has only 12 fields: no goal, no secret, no gender, no title.
- Exactly 65 of 389 have placeholder factions.
- 0 of 184 crisis texts name anyone (the 3 hits were surname-prefix false matches).
- Across those 184, each stress type has exactly 1 distinct crisis hook, and 1 distinct summary once the settlement name is masked (2 for wartime, 3 for religious conversion).
- The crisis-faction count in replay.out.txt predates adding the conversion and revolt factions to the probe; the role-only and placeholder figures are unaffected.

(d) Counterfactual (mode `v2`): the same 96 configs with _densityLawVersion: 2, the dormant newer density law.
- 0 of 96 have role-only NPCs and every crisis faction present has a named member.
- But only 24 crisis factions survive (the v2 law cuts most of them, and often drops the crisis's own faction in small places). 4 of 96 still show placeholder names, and crisis texts still name nobody.

### Root causes

**1. (naming-gap)** A crisis is only a label. When a stress is rolled, nothing creates the occupier, the creditor, the besieger, the claimants, the revolt's leader, the dead leader or the missing crop as a thing in the settlement. The crisis text is one fixed paragraph per stress type, and the only blank in it is the settlement's name. So it has to say "an outside power", "the creditor", "Someone", "A grain merchant". The same holds for the crisis-flavoured NPC goals and secrets ("the besiegers", "the occupiers", "the besieging commander", "an external power").

*Code:*

src/generators/stressNarrative.js :: RENDERERS (lines 76-165). Every renderer is (name) or (name, roll): under_siege at 77, famine 80, occupied 83 ("an outside power"), indebted 89, succession_void 101 ("The last strong leader"), monster_pressure 104 (takes no arguments at all), slave_revolt 135, wartime 143.
src/data/stressTypes.js :: STRESS_TYPE_MAP: literal crisisHook strings at lines 16-165 (17 "Someone in the leadership", 28 "A grain merchant", 59 "The creditor", 143 "The revolt's leadership", 154 "A crown officer").
src/generators/stressGenerator.js :: buildStressEntry, lines 46-59. It copies crisisHook verbatim at line 55 and adds no actor field.
src/generators/npcGenerator.js :: generateNPCGoal STRESS_GOALS, lines 370-420 (383 "the besiegers", 417 "the occupiers").
src/data/stressInstitutionEffects.js:43 ("the besieging commander").
src/data/npcData.js:874 ("an external power").

*Evidence:*

Crisis texts naming any NPC or neighbour: 0 of 15 in the audit files, 0 of 90 fresh, 0 of 184 in the replay. The stress record's keys contain no actor field in any mode. Each stress type has 1 distinct crisis hook across 184 settlements. The data needed exists elsewhere in the record but is not read: Serraagam's economy names fish as its backbone, while its famine text says only "second failed harvest season". Each culture's naming data (src/data/namingData.js) has first names, surnames and settlement-name parts, and none of these crisis texts calls on it.

**2. (unchecked-template)** "The Lord Mayor", "The Guildmaster", "The Kingpin" and the rest are deliberate placeholders that were never replaced. A late step adds a stock office-holder for any faction whose office no NPC already fills. It names that person by putting "The" in front of the role. Its own comment says a real name "could substitute ... later; for now we produce a recognizable placeholder". The step is given no culture, makes no random draws, and was designed to draw nothing so that seeds stay stable. The newer density law that replaces it (one named head per seat) exists but is switched off until the owner signs it. So every new settlement still runs the placeholder step. The role table also ignores size, which is how a thorp gets a Guildmaster and a hamlet gets a Lord Mayor.

*Code:*

src/generators/factionRoles.js :: FACTION_ROLES, lines 40-61 (Guildmaster 48, Kingpin 52, Lord Mayor 56; keyed by faction type, never by size).
src/generators/factionRoles.js :: generateFactionStructuralNpcs, lines 200-273. Takes only (faction, institutions, generationContext); writes name: nameTemplateFor(def.role) at 248; gives no goal, secret, gender or title.
src/generators/factionRoles.js :: nameTemplateFor, lines 392-400: return `The ${role}`.
src/generators/factionRoles.js :: ensureFactionStructuralNpcs, lines 296-374. Version gate at 313: returns early only under the v2 law.
src/generators/steps/assembleSettlement.js, lines 292-311. Calls it, with the note at 303 that it "takes NO draw at any tier".
src/domain/density/densityBands.js :: REGISTER_VII_SIGNATURE, lines 60-62: {signed:false, live:false}.
src/domain/density/densityLaw.js:98-101 and 188-192: NEW_SETTLEMENT_DENSITY_LAW_VERSION is 1, so newSettlementDensityLaw() returns {}.
src/domain/density/densityCreateBoundary.js :: birthConfig, lines 275-287: therefore stamps no density marker.

*Evidence:*

The replay reproduces 195 of 389 exactly, role by role (83 / 55 / 55 / 32 / 30 / 30 / 27 / 18). Every role-only NPC carries generatedAs='faction_structural' and none lacks it, so this one function is the only source. Fresh app-path settlements show no density marker and 62 of 96 have role-only NPCs. Switching to the v2 law gives 0 of 96. By size in the replay, "The Guildmaster" appears in 23 of 64 thorps and 23 of 63 hamlets, and "The Lord Mayor" in 12 of 63 hamlets. The NPCs tab renders "The Lord Mayor · ●●● / Lord Mayor / Disposition commanding", with no want and no secret (audit-city-1.txt lines 1576-1579).

**3. (naming-gap)** Factions created for a crisis get a fixed placeholder name. That name is also the faction's identity: NPCs join a faction by its name, and its type (noble, military, other) is guessed from words in the name. So the generator writes its own working labels into the name: a lettering ("Claimant Bloc A", "Rival Faction B", where no Faction A ever exists), a state note ("Unknown Faction (hidden)", "Merchant Guilds (dominant)"), or a job description ("Creditor's Representative", "Occupation Authority"). The DM then reads these on the Power tab.

*Code:*

src/generators/power/stressFactions.js :: applyStressEventFactions, lines 11-390. Literal faction names pushed at 43 (Occupation Authority), 60 (Rival Faction B), 68 (Third Bloc (Neutrals)), 77-78 (Creditor's Representative), 96 (Investigation Faction), 105 (Unknown Faction (hidden)), 122 and 130 (Claimant Bloc A/B), 198 (Reformist Faction), 288 (Peace Faction), and later for conversion and revolt.
Called from src/generators/power/rulingStructure.js:696.
src/generators/power/rulingStructure.js:497-501: 'Merchant Guilds (dominant)' when the settlement is prosperous.
src/generators/power/factionCategories.js :: inferFactionCategory (149), with keywords at 126-146. The type is read off the name; 'Claimant' was added so the blocs read as noble.
src/domain/dossier/powerStrata.js:355. The empty-seat line lists the claimant faction names as the claimants.

*Evidence:*

Placeholder faction names in 65 of 389 (replay), 29 of 96 (fresh) and 4 of 18 (audit files). Under the v2 law, 4 of 96: that law cuts factions but does not rename them. A search of src finds 0 occurrences of 'Rival Faction A'. Qingxian (audit-village-2.txt line 525) reads "... 2 claimants circle: Claimant Bloc A, Claimant Bloc B." Categories as saved in the 18 files: Investigation Faction, Unknown Faction (hidden), Creditor's Representative, Rival Faction B, Third Bloc, Reformist Faction, Peace Faction, Departure Committee, Revolt Leadership and Abolitionist Network are all 'other'.

**4. (other)** Even where a crisis faction exists, no one is created to lead it. Ordinary NPCs are rolled first (shepherd, miller, midwife). A lottery then files each one into a faction, weighted by how many members the faction still wants and whether the NPC's category fits. So the creditor's agent turns out to be a Miller, Claimant Bloc A a Shepherd, the hidden infiltrators a Midwife, or the faction has nobody. Because most crisis factions are typed 'other', only general-purpose villagers can land in them. And even when someone does land there, the crisis text never points at that person.

*Code:*

src/generators/npcGenerator.js :: mergeNPCLists (line 860). Pass 1, a role keyword locks the faction (1064-1071). Pass 2, a capacity-weighted lottery limited by category compatibility (1073-1115). Writes enriched.factionAffiliation at 1118.
The roster size is the fixed old band in src/domain/density/densityLaw.js :: LEGACY_MASS_RANGE (thorp 2-3 ... metropolis 15-20).

*Evidence:*

Audit files: 14 of 25 crisis factions have no named member. Fresh: 74 of 121. Examples from fresh: Creditor's Representative is Simeon Alexios [Miller]; Claimant Bloc A is Dalla Thorsson [Shepherd]; Unknown Faction (hidden) is Chac Chel Chel [Midwife]; War Council is Torghil Naiman [Fisherman]; in a thorp, Occupation Authority is the placeholder "The Watch Captain". Audit files: Grain Holders is a Tax Collector and a Conjurer (audit-metropolis-1); Revolt Leadership has no member (audit-metropolis-2). Under the v2 law: Creditor's Representative is a Bandit Contact and a Local Fence; Claimant Bloc A is a Woodcutter.

**5. (naming-gap)** Monster threat is a three-step dial (heartland, frontier, plagued) with no list of creatures behind it, so nothing can be named. Every monster sentence is written around that gap: "creatures", "beasts", "whether wolves, raiders, or worse", "a rival lord, a beast of unusual cunning, or something stranger". The top step is labelled "Plagued", which reads as disease.

*Code:*

src/data/monsterThreat.js :: MONSTER_THREAT_TIERS (27) and MONSTER_THREAT_RANDOM_POOL (37-39): three tokens, no roster.
src/domain/display/threatAssessment.js, lines 39-102: the 'Beasts & Monsters' row text says only creatures and monsters.
src/data/dossierStateProse/defense.generated.js, the 'Beasts & Monsters: ...' variants at 376-526.
src/generators/stressNarrative.js:104-105 (monster_pressure).
src/data/stressTypes.js:110 (its crisis hook).
src/components/map/settlementThreat.js:36 (label 'Plagued').

*Evidence:*

A search of src/generators for a creature list or roster finds none; the only creature words are incidental: food (boar), labour (undead), institutions (bandits), and the history placeholder table's {dragon_color}. In the 13 frontier or plagued audit dossiers, the lines that mention a monster, creature or beast name a specific creature in 0 of 13; 3 contain only the generic "raiders" (audit-thorp-2.txt line 151: "mustered against raiders and monsters alike").

### Shared with the other failures

5, rulers: yes, the same cause. The placeholder "The Lord Mayor" from factionRoles.js is the ruler-titled roster NPC that src/domain/dossier/powerStrata.js :: rulingChainOf (lines 339-348) can seat. That is how 12 of 63 hamlets get an unnamed Lord Mayor from another faction. The rulers investigator's fresh run found 5 of 20 hamlets with a placeholder seat. The table that picks these roles ignores size.

8, size wording: partly the same cause. FACTION_ROLES ignores size, so placeholder guild office-holders appear in places far too small for them: "The Guildmaster" and "The Senior Trader" in 23 of 64 thorps and 23 of 63 hamlets, "The Lord Mayor" in 12 of 63 hamlets. The guild faction itself is created elsewhere (rulingStructure). "The town" wording comes from other templates.

6, repetition: yes, the same cause. Because each crisis is one fixed paragraph with only the settlement's name as a blank, every settlement with the same stress repeats its summary and hook word for word: 1 distinct crisis hook per stress type across 184 settlements. The fixed descriptions of crisis factions and the fixed crisis goals and secrets in npcGenerator.js and stressInstitutionEffects.js repeat the same way.

2, faith: only the naming gap is shared, not the contradiction. None of the 18 dossiers names a deity, saint or order. The history token table (historyGenerator.js:186-230) holds four of each, and none surfaced. Why "no single creed" sits beside a cathedral is not explained by this cause.

3, magic: not shared. The structural Archmagister respects magic being off: 0 of 78 magic-off replay settlements have one.

1, food, and 4, defense: not shown to share this cause. The only overlap is the habit of fixed stock text that does not read the record, as in the famine text ignoring the settlement's own commodity.

Noticed but not traced: "The seat The seat stands empty" doubles its opening words on the Power tab.

### Shape of a fix

1. Cast the crisis when it is rolled.
- Create its actors as real entities and store them on the stress record: the outside power (a realm, house, company or warband name from the culture's naming data, or the neighbour when one exists), the person who fronts it (besieging commander, creditor's agent, occupation governor, the two claimants, the revolt's leader, the dead leader), and for famine the actual crop or commodity already in the record.
- Make each crisis faction carry that outside power's name, with a minted, named NPC as its head (with a want and a secret), instead of whoever the membership lottery drops in.

2. Rewrite the crisis texts with blanks for those actors.
- That covers the summary, hook, viability note, crisis NPC goals and crisis secrets, so the text reads "Víkset is besieged by the host of Jarl X; Commander Y is offering terms" instead of "Someone".
- Give each stress a few variants, which also cuts the word-for-word repetition.

3. Placeholder office-holders, one of three:
- draw a real culture name, want and secret for each one;
- drop the appender; or
- let the dormant v2 density law take over (it already gives 0 of 96).
- Separately, make the role table read the settlement's size, so no thorp gets a Guildmaster or Lord Mayor.
- All three options change what an existing seed generates, which touches the "a seed is a starting world forever" promise. Signing the v2 law is the owner's word (REGISTER_VII_SIGNATURE), so this is the owner's call, not a lane's.

4. Separate a faction's identity from its label.
- Give each faction a stable key, a type set explicitly when it is created rather than guessed from its name, and a drawn proper display name.
- Move "(hidden)", "(dominant)" and the A/B lettering into fields that the display turns into plain words.

5. Monsters.
- Add a small creature list keyed by terrain and threat level, pick one or two for frontier and plagued settlements at birth, and have the defense, threat and monster-pressure text name them.
- Consider renaming the "Plagued" label so it does not read as disease (the owner's wording to choose).

Everything stays editable by the DM afterwards. The owner's "Trust the DM" ruling (ODQ, 2026-11-01) asks for a head start that needs as few changes as possible, which favours naming over leaving blanks.

## 8. Small places written as towns

**Reproduced:** yes

### Reproduction

I reproduced both halves. Nothing in the repo was touched. Probes and outputs are in /tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/causes/size-wording/: fresh.mjs, summarize.mjs, fresh.out.txt, rungs.mjs, rungs.out.txt, files.mjs, files.out.txt, print.mjs, print.out.txt, gate.out.txt and indef-clauses.txt.

FRESH (fresh.mjs). 72 settlements, 12 per tier, made the way the app does it: loadGenerationLawPayloads, then birthConfig({...DEFAULT_CONFIG, ...o}), then generateSettlementPipeline. The app's own tabs were rendered headlessly as the DM, using the coherence audit's loader.
- Self-reference as a "town" (the, this, a, every, ordinary town) appears in 10/12 thorps, 12/12 hamlets and 12/12 villages.
- "the town" or "this town" alone appears in 9/12, 11/12 and 9/12.
- Of the 103 small-tier lines, 19 are stored in the settlement record. The other 84 are written by the display desks at render time.
- By tab: Economics 58 lines, Defense 10, History 16, Daily Life 7, Power 5, Tonight 5.
- Merchant Guilds hold a seat in 10/12 thorps, 12/12 hamlets and 12/12 villages. 0 of the 10 thorps and 1 of the 12 hamlets have any market. Every thorp and hamlet passes the market check through "Subsistence farming [Economy]".
- The Merchant Guilds share of a thorp's power is 28–48%.
- "The Guildmaster" placeholder NPCs: 1 thorp, 4 hamlets (2 under Grain Holders), 2 villages.

COUNTERFACTUAL. I called the same desks with and without the tier noun.
- Economy desk, "the/this town" count: thorp 105 → 24 (the 24 left are internal pool-key strings, not prose), hamlet 93 → 24, village 84 → 24, city 76 → 0.
- General desk: 23/20/12 → 0.

SCREEN VS PDF (print.mjs). The same thorp, Ögedeiabad (28 people):
- The Economics tab says: "The roads into this town are busy and the town is poor…"
- buildPrintProse (the PDF) says: "The roads into this thorp are busy and the thorp is poor…"

AUDIT FILES.
- The 18 hand-read dossiers (files.mjs): 8 of the 9 small settlements carry "town" lines (thorp-2 has none). Merchant Guilds sit in 8 of the 9. Of the 5 thorps and hamlets with Merchant Guilds, only hamlet-3 has a market ("Periodic market"). "The Guildmaster" appears in thorp-1, thorp-3 (under Grain Holders), village-2 and village-3.
- The audit's 120-settlement coherence corpus: Merchant Guilds in 18/20 thorps, and none of those 18 has a market. Hamlets: 20/20, with 19 having no market.
- Splitting the audit's 149 SCALE-3 lines across its 59 firing settlements: 55 say "the town" at render time, 19 say it in the stored record, 68 say "a/every/ordinary town" at render time, and 7 say it in the record.
- If every screen desk passed the tier noun, 47 of the 59 would still fire. If the stored prose were also fixed, 45 would still fire, on the indefinite lines alone.

### Root causes

**1. (missing-single-source)** The app already knows the right noun for each settlement and has a rewriter that turns 'the town' into 'the thorp'. But the noun is not read once for the whole page. Each screen call has to remember to pass it, and if it doesn't, nothing complains. The PDF and four tabs pass it. The Economics, Services, Resources, Daily Life, History, Viability and Steadings tabs, and the Overview tab's general-desk call, do not. So the PDF says 'the thorp' and the screen says 'the town' for the same sentence. Cities and metropolises are called 'the town' the same way.

*Code:*

The rewriter: src/domain/display/stateProse/stateProseKernel.js :: speakTierNoun L549-563, applied in src/domain/display/stateProse/composeStateProse.js L819 and L870, but only when the caller passes a tier noun. The noun comes from src/domain/display/stateProse/weaveBlock.js :: tierNounFor L119-122.

The desks forward the noun and never work it out themselves:
- src/components/new/economyDeskRead.js :: economyDeskRead L112-122 (`tierNoun: options.tierNoun ?? null`, commented 'FORWARDED, NEVER DERIVED')
- src/components/new/generalDeskRead.js :: generalDeskLines L274-278

Screen callers that never pass it:
- EconomicsTab.jsx L313 (craft line, drawn raw at L583) and L373 (economy desk)
- EconomicsTab.jsx L384 passes no tier to EconomicsGlance, which draws the header raw at EconomicsGlance.jsx L110/L133
- EconomicsTab.jsx food line L374/L568 and shadow-economy line L656, both raw `<p>`
- ServicesTab.jsx L177, ResourcesTab.jsx L119, DailyLifeTab.jsx L74, HistoryTab.jsx L163, ViabilityTab.jsx L52, OverviewTab.jsx L149, SteadingsSection.jsx L53

Callers that do pass it: printProse.js L330 and L336, DefenseTab.jsx L173, PowerTab.jsx L256, MagicTab.jsx L87, WarFaithDesk.jsx L113, and OverviewTab.jsx L173-192 (stressor desk only). The safety net in ProseBlock/DeskLines works only where `tier=` is passed: 5 of 11 DeskLines call sites do; EconomicsGlance.jsx L196-201 says a caller that omits it 'simply' gets 'no stand-down'.

*Evidence:*

rungs.out.txt matches each small-tier screen line to the desk rung that wrote it:
- 20 Economics lines from economyDesk.prosperityHeader (e.g. economy.generated.js:112 'The roads into this town are busy and the town is poor')
- 11 from foodSecurityRung ('The carts feed this town as much as the fields do', economy.generated.js:2187)
- 9 from generalDesk.economics.craftReasonLine ('…the town buys its feedstock the way other towns grow it', general.generated.js:9265)
- 2 from shadowEconomy

Counterfactual, same desks with the noun passed: thorp economy desk 105 → 24 (the 24 are pool keys, not prose), general desk 23 → 0, city 76 → 0. Screen vs PDF for Ögedeiabad (thorp, 28 people): 'this town … the town' on screen, 'this thorp … the thorp' from buildPrintProse.

**2. (unchecked-template)** The display desks' sentences were written using 'town' as the word for a settlement of any size. The rewriter changes only 'the town' and 'this town'. By rule it leaves 'a town', 'every town', 'an ordinary town' and 'the whole town' alone, on the stated belief that an indefinite 'a town' compares this place with somewhere else. That belief is wrong for this corpus: 63 of its 69 distinct 'a/every/an … town' clauses describe the settlement itself. So small places keep calling themselves towns. Some sentences come out half-rewritten and contradict themselves.

*Code:*

The matcher: src/domain/display/stateProse/stateProseKernel.js :: GENERIC_NOUN L538, which matches only 'the' or 'this' directly before 'town'. The ruling is in src/domain/display/stateProse/tierVoice.js L32-45 ('A TOWN IS DELIBERATELY UNTOUCHED', 'An indefinite article in this corpus is a COMPARISON').

The sentences, in src/data/dossierStateProse/*.generated.js:
- economy L2864 'This is a town that sells.'
- economy L1652 'Every town this size has both.'
- economy L1907 'It is an ordinary town's arithmetic'
- defense L4084 'The town is dealing with something serious and going on being a town while it does.'
- power L230 '…the town is doing well, and a town doing well rarely looks hard…'
- general L8300 '…the whole town has that directness'

The template slots available ({settlement}, {seat} and others) include no slot for the noun.

*Evidence:*

indef-clauses.txt: 69 distinct indefinite clauses in the economy, defense, power and general corpora. Only 6 are real comparisons ('what a larger town does…', 'a town with courts', 'a comfortable town', 'a town without stores', 'a farming town', 'the same neighbours').

Half-rewritten output in the fresh run:
- 'The village is dealing with something serious and going on being a town while it does.' (Defense tab, which does pass the noun)
- 'the thorp is doing well, and a town doing well…' (Power tab)
- 'The thorp is … arguing about whether there will be a town to defend.'

In the audit, 68 of the 149 SCALE-3 lines are this class, and 45 of the 59 settlements would still fire with every other source of 'town' fixed.

**3. (unchecked-template)** Some story text is written into the settlement record when it is generated: history events, their lasting effects, plot hooks and crisis narration. That text says 'the town' outright and never passes through the rewriter. It shows on the History, Tonight, Overview, Quick Guide and Plot Hooks tabs for thorps and metropolises alike. Next to it, the same files already use the size-neutral 'the settlement'.

*Code:*

- src/data/historyData.js L1187 'A standing levy roster kept ready in the town archive' (external_threat lastingEffects; the next line, L1191, says 'inside the settlement'). Picked by src/generators/historyGenerator.js L248-252 and stored as history lastingEffects; Tonight repeats it.
- historyData.js L1458 'by more of the town's leaders' (plot hook)
- src/data/historyDescVariants.js L65 'they left behind a town of former collaborators' and L109 'more pilgrims than the town could house', rendered by historyGenerator.js L243 (renderHistoryTemplate(historyDescription(…)))
- src/generators/narrativeText.js L176 (mass_migration: 'work the town no longer has'), shown on Overview and Quick Guide
- src/data/narrativeData.js L295 and L377

*Evidence:*

Audit SCALE-3: 26 of its 149 lines (19 'the town', 7 'a town') appear verbatim in the stored settlement JSON. Fresh run: 4, 6 and 9 small-tier lines from the record. 'A standing levy roster kept ready in the town archive' hit 16 times across all six tiers. These five generation-time files hold 13 'the/this town' and 13 'a town' occurrences.

**4. (other)** The roster lets small places seat Merchant Guilds only if they have a market. The check is written as 'an institution named market, or ANY institution on the Economy shelf'. Every thorp and hamlet must have 'Subsistence farming', and the catalogue files it on the Economy shelf. So the check always passes, and a 20-person farmstead with no market at all gets a merchant guild.

*Code:*

src/generators/power/rulingStructure.js :: generatePowerStructure L462-469: `merchantPower > 5 && !(tier === 'thorp' && merchantPower < 12) && (!['thorp','hamlet','village'].includes(tier) || nativeInstitutions.some(inst => name.includes('market') || inst.category === 'Economy'))`.

src/data/institutionalCatalog.js L80-89: 'Subsistence farming' is `required: true` on shelf('Economy') at thorp and hamlet; 'Common grazing land' is also required at hamlet.

*Evidence:*

Fresh: 12/12 thorps and 12/12 hamlets pass the check, every one through 'Subsistence farming [Economy]'. 0 of the 10 thorps with Merchant Guilds has a market; 1 of the 12 hamlets does (gate.out.txt).

Audit 120-settlement corpus: 18 of 18 thorps with Merchant Guilds have no market; 19 of 20 hamlets. The 18 hand-read files: 4 of 5. Villages are different: 12/12 have a real market in the fresh run.

**5. (calibration)** How much power the merchants get is read from the economy priority slider, which sets emphasis, not size. Nothing in the formula looks at how many people live there or how much trade passes through. A thorp with no market still gets three quarters of a town's merchant strength, clears the thorp minimum, and then takes a third to a half of all power because the roster has only two or three seats.

*Code:*

- src/generators/power/rulingStructure.js L112: merchantPower = round(25 × priorityToMultiplier(economyOutput))
- src/generators/priorityHelpers.js L395-414: economyOutput = economy priority × crime, magic, market (×0.75 if no market), stress and neighbour factors, with no tier term
- rulingStructure.js :: normalizeAndAnnotateFactions L66-75 rescales the few seats to 100

*Evidence:*

Fresh merchantPower at thorps: 11 to 19, median 19. 10 of 12 clear the thorp minimum of 12 set at L464. The resulting Merchant Guilds shares at thorps were 42, 46, 43, 28, 42, 39, 44, 28, 48 and 39 percent. At hamlets they were 9 to 37 percent, and 4 hamlets with merchantPower under 12 still seated the guild, because only thorps have a minimum.

**6. (label-not-size)** Once seated, the faction's name, description and staff are the same at every size. A thorp gets 'Merchant Guilds', described as 'fund civic works and expect council access', and staffed by placeholder NPCs literally named 'The Guildmaster' and 'The Senior Trader'. A hamlet's manor gets a 'Lord Mayor'. A small-place racket is named 'Thieves' Guild' even though its own description says 'a local protection operation'. The noble faction shows that names can scale with size, since it becomes 'Manor Household' at hamlets and villages. The other factions don't.

*Code:*

src/generators/power/rulingStructure.js:
- merchantLabel L497-501: always 'Merchant Guilds' or 'Merchant Guilds (dominant)'
- merchantDesc L477-493: steps up with power and route, with no tier branch
- "Thieves' Guild" fixed at L671, while its own description at L666-668 is tier-aware
- the noble label does scale with tier (L524-530)

src/generators/factionRoles.js:
- FACTION_ROLES.merchant L47-50 ('Guildmaster', 'Senior Trader'), noble L55-57 ('Lord Mayor'), with no tier input
- nameTemplateFor L398-400 returns `The ${role}`
- ensureFactionStructuralNpcs (called at src/generators/steps/assembleSettlement.js L306) adds them whenever no NPC already covers the office
- its switch-off at L313 works only under Register VII, which is not live: src/domain/density/densityLaw.js L98-101 leaves new settlements on version 1, and every fresh row has no _densityLawVersion

*Evidence:*

Audit 120-settlement corpus: 'The Guildmaster' on 11/20 hamlets and 5/20 thorps; 'The Lord Mayor' on 6/20 hamlets and 9/20 villages; Thieves' Guild on 1 thorp and 3 hamlets.

audit-thorp-3 (19 people, famine) has 'The Guildmaster' and 'The Senior Trader' under the stress faction Grain Holders.

Fresh run Merchant Guilds descriptions at thorps include 'Market merchants who profit from the settlement's position; buy from one direction, sell to another, lobby for both' and 'Established merchant community; fund civic works and expect council access'.

### Shared with the other failures

- Naming (failure 7): partly the same cause. The faction staff code makes NPCs named only 'The X' (factionRoles.js nameTemplateFor L398, through ensureFactionStructuralNpcs). The naming investigator's probe found every role-only NPC in its sets carries faction_structural: 9 of 18 audit files, 62 of 96 in its fresh set. That includes the Grain Holders' 'The Guildmaster'. The unnamed occupier, creditor or besieger is a separate question about crisis factions; I did not trace it.
- Defense (failure 4): plausible, not shown. The same roster pattern seats a faction from a slider number with no building check. Military/Guard is seated at hamlets and villages with no garrison test (rulingStructure.js L570): 15 of 20 audit hamlets, 10 of them with no guard, watch, militia or garrison building. 'The Watch Captain' placeholder appears in 9 of 20 hamlets. I did not trace the 'garrison pay or morale' sentences to this.
- Rulers (failure 5): plausible, not shown. A 'Lord Mayor' placeholder sits beside an Elder or Reeve seat in 6 of 20 hamlets and 9 of 20 villages, which gives a reader a second apparent ruler. I did not trace the 'No named seat-holder' line, which is the rulers investigator's.
- The audit's 'four cities and metropolises called a town' is the same missing-noun cause: the city economy desk goes from 76 to 0 'town' lines when the noun is passed.
- Food, faith, magic and repetition: no shared cause shown. The Economy-shelf mix-up, where subsistence farming counts as commerce, is specific to the merchant check as far as I traced.

### Shape of a fix

1. One noun for the whole page. Work out the settlement's noun from its size once, and apply it wherever a sentence is put on screen, instead of relying on each tab to pass it. The PDF already does this, so screen and print would then agree. A test that fails when any desk call lacks the noun would stop a new tab slipping through. Changing the default flips which callers have to say so: the one caller that wants the corpus's raw words (the manifest recorder) would opt out explicitly.

2. Re-word, or flag, the 'a town' sentences. About 63 sentences in the four display corpora use 'a town' / 'every town' / 'an ordinary town' / 'the whole town' to mean this place. Either give them a noun slot, so 'This is a {noun} that sells' becomes 'a thorp that sells', or mark which lines are about the settlement itself, so the rewriter can safely handle 'a/an/every/whole' too. The 6 real comparisons stay as written. The copy is the owner's, so this is the owner's call. It shifts the prose manifest and the golden files that tierVoice.js warns about.

3. Story text written at generation should not say 'town'. The history events, lasting effects, plot hooks and crisis narration in historyData.js, historyDescVariants.js, narrativeText.js and narrativeData.js should use the place's name, 'the settlement', or the same noun slot. That is about 26 occurrences in five files.

4. Guilds only where there is trade. The merchant check for small places should ask for a real market or trading house, not any Economy-shelf building. Farms, grazing and root cellars are not commerce. Merchant strength should also grow with size and trade, not just the economy slider.

5. Names and staff that fit the size. Give small places their own faction names and roles, the way nobles already become 'Manor Household':
- traders, pedlar families or the market folk instead of 'Merchant Guilds'
- a protection racket or smugglers instead of 'Thieves' Guild'
- the lord's steward instead of 'Lord Mayor'
- a chief trader, or nobody, instead of 'Guildmaster'

Placeholder staff should get real names, or not be created when the place is too small to have that office.

