# STYLE-2 · SW-10 HOOKS — the lane record (2026-11-09)

Seat SW-10 HOOKS (Opus 5.5), child of the cloud chair `session_01FbPLbejcfwX5nii12VM673`; lane `lane/style-2-hooks-2026-11-09` cut from the merge train's final tip `bd07005b9`. Brief: `BRIEF-STYLE-2-WAVE-2026-11-09.md` (SW-10 · HOOKS with its 09:2x addition) on the chair's lane; law: WIRING-RULINGS §5–§8 and STYLE-RULINGS-2. Every new line below is a PROPOSAL for the owner's veto; nothing here is signed.

## 1. The measure first (bd07005b9, the soak's 1,000)

The soak's own figure at the base: Plot Hooks repetition **0.299 all / 0.355 same-tier** (thorp .070 · hamlet .102 · village .177 · town .388 · city .627 · metropolis .777), the wave's W7 figure reproduced. A per-pool decomposition (the tab's own source, `domain/dossier/plotHooks.js :: collectPlotHooks`, split by the soak's `storySentencesOf`, the pairwise numerator attributed to the pool of the sentence; it reproduces the soak's figure to the third place) bisects the rise:

| pool | all | same-tier | sentences | distinct |
|---|---|---|---|---|
| person · npcData `other` | .082 | .094 | 7,014 | 14 |
| person · `government` | .048 | .046 | 4,812 | 13 |
| person · `small_settlement` | .045 | .042 | 3,744 | 11 |
| person · `economy` | .043 | .057 | 6,137 | 17 |
| person · `military` | .033 | .041 | 5,013 | 16 |
| economics (foodBalance's hooks) | .016 | .016 | 1,471 | 12 |
| person · `criminal` | .013 | .022 | 3,238 | 12 |
| person · `religious` | .010 | .012 | 2,201 | 12 |
| person · the title pools (all titles) | ≈.006 | ≈.010 | — | 1–3 per title |
| conflict · safety · crisis · traditions | ≤.001 each | ≤.004 | — | — |

**0.274 of the 0.299 is the person hooks drawn from `data/npcData.js :: NPC_FACTION_LOYALTY`'s category pools** (11–17 lines each, drawn by every card in every town; a card whose line is held walks its title pool, then `other` first — `people/representatives.js :: dryPoolWalk`). The chair took the pool into this lane (STOP ruled 12:4x/12:59: SW-7 closed at be1f2d6b3 and never touched it).

Sizing (placeholder lines in a scratch worktree, never committed): every pool to 30 and titles to 4 → 0.148 / 0.190; `other` 40, government/economy/military 24, religious/criminal/small_settlement 18, titles 4 → 0.152 / 0.199. The second allocation was written.

## 2. The causes (one commit each; deltas unsigned)

| commit | cause | red-first | hooks all / same-tier after |
|---|---|---|---|
| `ce61aa3f5` | the conflict hooks' plural grammar: `hookLines.js` — a party is `{ name, plural }` (`hookPartyOf`, plurality by the head word through `display/governanceAccount.js :: pluralPowerName`), every verb, possessive and pronoun bound to a party agreeing (has/have, is/are, its/their, it/they, says/say …, "Guilds'") in all 36 templates of the seven families | `tests/domain/dossier/conflictHookPlural.test.js`: 3 failed at bd07005b9 → 3 passed | 0.299 / 0.355 (display-drawn; plural-agreement faults in conflict hooks on the 1,000 **268 → 0**, 616 towns hold a plural power) |
| `4ba2a241d` | `other` 12 → 40 (28 lines) | `personHookSpread.test.js` floor arm, red over the previous data → green (each pool commit the same) | 0.221 / 0.289 |
| `fff55a455` | `government` 11 → 24 (13) | as above | 0.199 / 0.266 |
| `db0e0b0f2` | `economy` 11 → 24 (13) | as above | 0.179 / 0.241 |
| `d782e1891` | `military` 11 → 24 (13) | as above | 0.165 / 0.223 |
| `169941774` | `religious` 11 → 18 (7) | as above | 0.162 / 0.219 |
| `abee0dbf9` | `criminal` 8 → 18 (10) | as above | 0.157 / 0.210 |
| `fbbe4a992` | `small_settlement` 8 → 18 (10) | as above | 0.154 / 0.202 |
| `2a1051b81` | the 44 title pools 3 → 4 (`personHooksByTitle.js`) | the title arm red over the previous data (1 failed); the spread arm lands here: sixteen soak cities/metropolises share 0.721 of their person hooks pairwise at bd07005b9, 0.450 here (< 0.55) | 0.154 / 0.202 |

The growth was first one commit (8a26d8a08, never pushed); on the chair's 13:06 word ("land by pool, one cause each") it was re-cut into the eight commits above, the final tree byte-identical to it. Each pool commit's theme tags ride with it in `hookThemes.js`.

Per pool at the lane tip (all / same-tier): other .049/.066 · government .026/.027 · economy .025/.034 · military .019/.026 · economics .017/.017 (untouched) · religious .007/.008 · criminal .005/.008 · small_settlement .002/.007 · safety .002/.004 · conflict .001/.001. Per tier: thorp .054 · hamlet .061 · village .075 · town .186 · city .363 · metropolis .478. The most-repeated hook line 532 → 475 towns (now `economy`'s new "promised the same order to two buyers").

**The target is met:** STYLE-0's 0.157 / 0.213 against 0.154 / 0.202 (the soak's own `aggregates/repetition-prose.json :: hooks` at the tip tree, CONFIRMED by the soak run, not only by the decomposition). City and metropolis stay the highest tiers (.363 / .478): their card counts exceed any pool; the measured next floor is title-first drawing (§5).

**Not slotted.** The chair's order put slotted variants first; a slot reading the card (`{house}`, `{office}`, `{rival}`) must be filled where the line is drawn (`npcGenerator.js :: drawPersonHook`, `representatives.js :: spareHookLine`, `personHooks.js`), outside this fence, and the soak's skeleton masks power and person names, so a power-name slot would lower the exact figure and not the masked frame. The chair ruled (13:02) the fence stays and named growth and declared place-fact rows (`needs`) as the cure; growth alone met the target, so no new declared row was written (the new lines presume no institution).

## 3. The referee (the 1,000 through the soak's own story hashes, bd07005b9 → the tip tree)

- The twenty most-repeated frames: identical counts, none raised; **no new entry in the top forty**.
- Story / skeleton / exact repetition 0.035 / 0.108 / 0.048 → unchanged.
- Finding classes: every class's count identical; `coh:tier-noun` absent at both (0).
- New lines carry no "faction", no "rather than", no "a stranger", no hook-truth word (force, walls, watch, famine, hospital, magic — `tests/generators/people/personHooks.test.js`'s vocabulary arm green).

## 4. The deltas (UNSIGNED, for STYLE-2-MERGE's signing; the six suites in a clean worktree at each parent and tip)

| cause | gm /525 (cumulative vs the recorded golden) | fence /360 (vs the previous cause) | herald | prose /1,050 | witness | pdf |
|---|---|---|---|---|---|---|
| `ce61aa3f5` (parent bd07005b9) | 0 | 0 | 0 | 0 | 0 | 0 |
| `4ba2a241d` other | 412 | 315 | — | — | — | — |
| `fff55a455` government | 424 | 285 | — | — | — | — |
| `db0e0b0f2` economy | 424 | 228 | — | — | — | — |
| `d782e1891` military | 424 | 201 | — | — | — | — |
| `169941774` religious | 424 | 222 | — | — | — | — |
| `abee0dbf9` criminal | 494 | 153 | — | — | — | — |
| `fbbe4a992` small_settlement | 525 | 84 | — | — | — | — |
| `2a1051b81` titles (the tip) | 525 | 27 | 0 | 0 | 0 | 0 |

Every fence row moved by every pool cause lies in `npcs[].plotHooks` alone (field-diffed against the previous cause: outside `npcs` 0 rows, `npcs` with `plotHooks` stripped 0 rows). The gm figure is the count of configs differing from the recorded golden at that commit, not a per-cause delta (the merge seat re-records once). herald, prose, witness and pdf were run at ce61aa3f5 and at the tip's tree (8a26d8a08, byte-identical); 0 at both, so 0 at every commit between (PLAUSIBLE per commit, CONFIRMED at both ends).
The six suites: 55/55 at bd07005b9 and at ce61aa3f5; 53/55 at the tip tree — the two reds are the gm and the fence, the cause's own. **The fence's 360 rows move in `npcs[].plotHooks` alone**: field-diffed against the parent (outside `npcs`: 0 rows; `npcs` with `plotHooks` stripped: 0 rows) — zero residue. The gm's 525 is PLAUSIBLY the same field (not field-diffed; the merge seat field-diffs when signing). Why: the person hook is drawn by the stream over its pool, so a larger pool moves every card's draw; nothing downstream reads the hook text but the hook count, which is unchanged (one per card).

Registers: the drawDeclaredKeys walker's line-keyed `CONTENT_KEYED` row re-keyed by identity (`hookLines.js#232 → #266`, the same `createConflictHookDraw` call). eslint clean on every touched file; `tsc --noEmit` 167 = 167 at each cause; `tsconfig.domain-strict.json` adds no error in `hookLines.js`.

## 5. ROUTED and what stays

- `src/domain/crisis/crisisHooks.js`'s lever line "… if it gives way, Religious Authorities loses most, because the crisis hits its base" — the same plural fault in SW-6's file (seen on the 1,000 by the plural probe; not counted cleanly — the probe's crisis hits include the cast line's "X of Merchant Guilds is stirring it", which is correct) → **SW-6** (the chair told it).
- "Merchant Guilds (dominant)'s" — the suffix is a slot leak → **SW-8**.
- The economics pool (`src/generators/economy/foodBalance.js :: deriveSupplyRiskAnalysis`, .017; its "one importer … quadrupled the price" frame at 376 towns) — a generator-time line with no draw-free key at its step; not cured here (the target was met without it). Next lane: four vantages keyed by the place.
- The city/metropolis floor: a title-first draw (`representatives.js :: drawCardHooks` and `npcGenerator.js :: drawPersonHook`) with ≥6 lines per title, or card-slotted lines — draw-site code, outside this fence.

## 5a. The full suite

The full vitest at the lane's product tree (the pool causes' final tree, byte-identical to 2a1051b81's sources), in a clean worktree: **37,967 tests, 57 failed** (35 files) against the base line's 28 (MERGE-TRAIN's record: densityLaw ×4, editCorpusRatchet ×4, killNpcDoubleImpair ×3, characterConsumers ×3, clergyTraitPlane ×2, editWorldFactResources ×2, worldPulseFactionSeating ×2, layerBoundaries' cycle, readerValidationOnPage, institutionBudgetPromise, regenNpcEnrichment, x46NpcBand, composeStateProse, deityStanceLane, religionLegitimacyFactionKey — all 28 present, unchanged). The 29 new rows: each of their 18 files passes alone at bd07005b9 (347/347) and reds alone at the tip (27 + the gm and the fence). By class:

- **The two declared goldens** (gm 525, fence 360) — this lane's unsigned moves.
- **Cured through their doors in `39b5f2b4c`:** the wiring census (`tablePools`, 2 bytes), the writer-reach register (the governanceAccount import's reach), the mutation manifest (the new generators test's rationale row), the fork census's observed line (1436 → 1534 by identity); **and the lighting census** (the two new test files) by its own clean-tree ritual in the commit after this record.
- **Left for the merge seat, each a consequence of the unsigned gm move** (it reads the committed golden corpus, its control hash, or the engine bundle the corpus is replayed through): engineBundleReplay ×3, engineServiceCore, aiCharter/aiGrounding/aiOutputSchema bundle freshness, edgeSharedBundleReproducibility ×4 (npcData.js and hookLines.js are engine-bundle inputs — `npm run build:edge-shared` at the merge point, as MERGE-TRAIN did at car 4's), pipelinePinnedMode ×3, pipelinePinnedChoosers, nameHeldThroughAssembly, powerEconomyFreshness, rosterFinalUnderHeldRoster, dmLayerGoldenIsolation, worldFactRederive, generationForkCensus A1. PLAUSIBLE that each clears at the signed re-record: the golden door refuses an unsigned capture ([NO_SIGNATURE]), so it could not be proven on the lane.

## 6. CONFIRMED against PLAUSIBLE

CONFIRMED: the base and tip figures (two soak runs), the per-pool decomposition (it reproduces the soak's figure), both red-firsts (red at the base, green at the tip, logs in the commit bodies), the six suites' counts at each parent and tip, the fence's zero residue outside `plotHooks`, the referee's top forty. PLAUSIBLE: the gm's 525 rows confined to `plotHooks` (not field-diffed); each new line's theme tag (a judgment within the closed set).

## 7. Every line written, for the owner's veto

**The conflict templates (`ce61aa3f5`).** A singular party reads the old sentence byte for byte; a plural party now reads, for example (old → new):
- "Religious Authorities has posted guards on what it says is its own, and Merchant Guilds says … was never Religious Authorities's to hold." → "Religious Authorities have posted guards on what they say is their own, and Merchant Guilds say … was never Religious Authorities' to hold."
- "Religious Authorities has begun issuing its own papers over …, and Craft Guilds is refusing to honour them." → "Religious Authorities have begun issuing their own papers over …, and Craft Guilds are refusing to honour them."
- "… and Thieves' Guild benefits from its absence more than Grain Holders does." → "… more than Grain Holders do."
No template's words changed beyond the agreement.

**The person hooks (`4ba2a241d` … `2a1051b81`, one pool per commit).**

**government** (old: none — appended to the pool's tail) · theme tag in brackets

1. A clerk in their office has been copying letters at night, and the copies have turned up in a rival's hands. [betrayal]
2. They signed an order last month on bad information, and the family it ruined has learned whose seal is on it. [old_wound]
3. A petition they set aside has gathered names from half their street, and the people who signed it want an answer this week. [rivalry]
4. Someone is collecting fees in their name, and the people paying think the receipts are honest. [corruption]
5. Their deputy has started answering questions meant for them, and people have begun going to the deputy first. [ambition]
6. An old ruling of theirs is being used to take a widow's house, and they cannot undo it without admitting the mistake. [old_wound]
7. They promised the same post to two people, and both have already told their families. [rivalry]
8. A ledger they swore was complete is missing the pages for one season, and an auditor is coming to read it. [corruption]
9. Their sister has been taking gifts from people who need their signature, and they found out from the person who paid most. [corruption]
10. They were seen leaving a house they had no business in, on the night its owner disappeared. [vanished_person]
11. A rule they wrote to stop one abuse has opened the door to another, and the people using it are their friends. [corruption]
12. Someone has forged their seal well enough to fool their own staff, and three orders went out under it before anyone noticed. [betrayal]
13. They owe their post to a patron who has started asking for repayment in favours they cannot grant openly. [hidden_debt]

**military** (old: none — appended to the pool's tail) · theme tag in brackets

1. Two of the people under their command have been settling a private quarrel with drawn steel, and the rest are picking sides. [rivalry]
2. An old comrade has turned up asking for a favour that could cost them their post if anyone learns of it. [divided_loyalty]
3. They signed for supplies that never arrived, and the merchant who sold them is already spending the money. [corruption]
4. Someone under their command has been selling duty rosters to people who want to know when the roads are empty. [betrayal]
5. A report they wrote years ago blamed the wrong person for a death, and the right one has just come back. [old_wound]
6. Their second has been meeting with the people they answer to, and orders have started arriving without passing through them. [ambition]
7. A deserter they let go quietly has been caught elsewhere and is telling everyone who let them walk. [divided_loyalty]
8. They have been ordered to clear a family off land the family has worked for generations, and the order is lawful. [divided_loyalty]
9. The pay chest came up short again this month, and the only other key belongs to someone they trust. [betrayal]
10. A local family has been feeding the people under their command for free, and now expects a favour in return. [hidden_debt]
11. One of their best people has asked to be released, and will not say what they are afraid of. [looming_threat]
12. Tracks they were told to ignore lead from the edge of the fields to a camp nobody has reported. [looming_threat]
13. They lost a wager to someone who now wants payment as a closed eye on one particular night. [hidden_debt]

**religious** (old: none — appended to the pool's tail) · theme tag in brackets

1. A family has asked them to bury someone the faith forbids burying, and has offered a gift too large to refuse quietly. [faith_crisis]
2. The offerings have doubled this season, and they cannot find out who is giving or why. [hidden_debt]
3. A preacher from outside has been drawing their congregation away, and saying things about them that are partly true. [rivalry]
4. They married a couple in secret at one family's request, and the other family has just found out. [forbidden_love]
5. A child in their care claims to hear the god speak, and the child has been right three times. [faith_crisis]
6. They have stopped believing, have told no one, and still lead the prayers every week. [faith_crisis]
7. Someone has been reading the private letters kept in their care, and two of those letters were confessions. [blackmail]

**economy** (old: none — appended to the pool's tail) · theme tag in brackets

1. A buyer has paid them in advance for a whole season of goods, far above the price, and will not say what the goods are for. [smuggling]
2. Their bookkeeper has been taking a little from every sale for years, and the books balance only because the bookkeeper wrote them. [betrayal]
3. A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find. [hidden_debt]
4. They sold a batch they knew was bad, and the customer it sickened is now asking who supplied it. [corruption]
5. A rival has hired away their two best hands in one week, on wages the rival cannot afford for long. [rivalry]
6. They have promised the same order to two buyers, and both are due to collect on the same morning. [scarcity_pressure]
7. A lender has bought the note on their shop and wants it settled by the end of the month. [hidden_debt]
8. Their scales were tested and found heavy in their favour, and they swear someone changed them overnight. [corruption]
9. A family they put out of business has opened again under a new name, two doors down. [rivalry]
10. Someone has been selling cheaper and worse goods under their mark, and customers are blaming them. [rivalry]
11. They have quietly stopped paying a supplier who cannot afford to take them to law. [hidden_debt]
12. A crate came to them by mistake, and the people who meant to receive it have started asking around for it. [smuggling]
13. Their apprentice has been offered a partnership by a rival, on condition that the apprentice brings the recipes. [betrayal]

**criminal** (old: none — appended to the pool's tail) · theme tag in brackets

1. Two of their people have started running jobs of their own, and are telling newer hands that the old boss is finished. [ambition]
2. A debt they called in was paid by someone they have never met, and that person now wants to meet. [hidden_debt]
3. A load of theirs was taken on the road by people who knew the day, the route and the password. [betrayal]
4. Someone has been using their name to frighten shopkeepers, and the shopkeepers have begun paying the wrong people. [crime_ring]
5. A child they pay to carry messages has stopped coming, and the last message never arrived. [vanished_person]
6. An honest official they have never managed to buy has started asking about one of their fronts by name. [looming_threat]
7. They are holding goods for someone who has stopped answering, and the goods are beginning to draw attention. [smuggling]
8. A rival crew has offered peace, and the offer arrived on the same day one of their people went missing. [rivalry]
9. Someone in their own crew has been skimming, and the sum matches exactly what a rival is now spending. [betrayal]
10. A family they once ruined has a son who has just come of age, and he has started asking where they sleep. [old_wound]

**other** (old: none — appended to the pool's tail) · theme tag in brackets

1. A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there. [rivalry]
2. They lent their savings to a friend who has since left, and the friend's family says there was no loan. [hidden_debt]
3. Their landlord has doubled the rent and will lower it only if they report on the family next door. [blackmail]
4. A letter addressed to them was opened before it arrived, and the sender says it carried money. [betrayal]
5. Their son has been seen at night with people who do not work, and comes home with coin. [crime_ring]
6. A customer paid them with a ring that someone else has reported stolen. [smuggling]
7. They saw an accident that was no accident, and the person responsible knows they saw it. [looming_threat]
8. An inheritance they did not expect has arrived from a relative they never met, along with that relative's debts. [hidden_debt]
9. Their spouse has been making payments to someone every month for years, and will not say who. [blackmail]
10. Two neighbours have each asked them to stand witness in the same dispute, on opposite sides. [divided_loyalty]
11. They told a lie to protect a friend, and the friend is now repeating it to people who matter. [betrayal]
12. A child they took in as a favour has family who want the child back, and want paying for the years. [old_wound]
13. Their best customer owes them a year's takings and has started avoiding their street. [hidden_debt]
14. Someone has been asking the neighbours what time they leave in the morning and when they come home. [looming_threat]
15. A tool they lent out came back broken, and the borrower insists it was broken when it left. [rivalry]
16. They have been invited to the wedding of someone who once ruined their family, and refusing would be noticed. [old_wound]
17. A purse they found and kept has a rightful owner, and that owner has started asking around. [hidden_debt]
18. Their partner in a small venture has disappeared with the takings and left the debts in their name. [betrayal]
19. A family they look after has stopped answering the door, and the shutters have stayed closed for a week. [vanished_person]
20. They agreed to hold a parcel for a traveller, and two different people have since come to collect it. [smuggling]
21. An old letter of theirs, written in anger years ago, has been shown to the person it was about. [old_wound]
22. Their apprentice has been talking to a rival, and came back with an offer to buy them out. [ambition]
23. Someone keeps paying off their small debts around the place before they can, and has left no name. [secret_identity]
24. A cousin has arrived to stay without warning, and spends every day watching one particular house. [outsider_suspicion]
25. They found a name scratched into their door overnight, and it belongs to someone who died last winter. [looming_threat]
26. Their savings were hidden in a place only one other person knew, and the savings are gone. [betrayal]
27. A neighbour's quarrel with them has gone before the people who settle disputes, and the hearing is next week. [rivalry]
28. Someone close to them has been ill in a way nobody can name, and recovers whenever one particular visitor stays away. [looming_threat]

**small_settlement** (old: none — appended to the pool's tail) · theme tag in brackets

1. The family that has always mended the common track says it is theirs to close, and has closed it. [rivalry]
2. A cow belonging to one family was found dead in another family's field, and the two families no longer speak. [rivalry]
3. Someone has been moving the boundary stones at night, a little each time, always in the same direction. [rivalry]
4. A young couple from two families who do not speak have been seen together, and both families have noticed. [forbidden_love]
5. The person who settled every quarrel here has died, and two neighbours both expect to take their place. [succession]
6. A pedlar who comes every spring did not come this year, and the goods everyone ordered were paid for in advance. [vanished_person]
7. Someone has been taking eggs and bread from doorsteps, a little at a time, and nobody has caught them. [scarcity_pressure]
8. An outsider has offered to buy the best field for twice what it is worth, and the owner is tempted. [outsider_suspicion]
9. The oldest family has started keeping its children indoors after dark, and will not say what they saw. [looming_threat]
10. A letter came for a neighbour who has been dead for years, and the seal on it is one nobody here knows. [forbidden_knowledge]

**The title pools' fourth lines** (old: none)

- *the house boss* — A regular who always lost has started winning every night, and the dealers want to know who is teaching the regular.
- *the madam* — A client has paid for a whole year of evenings in advance, and the worker he pays for has asked them for help leaving.
- *the district madam* — A family has come asking for a daughter who works on their street, and the daughter has asked them to say she is not there.
- *the arena master* — A fighter's family has offered them their savings to keep the fighter out of the next bout.
- *the guild's master* — An old member has stopped paying dues, saying the guild still owes for work done before the master took office.
- *the college master* — A teacher they hired turns out to have no learning at all, and the students have loved every lesson.
- *the whisper broker* — A client wants to buy back a secret the client sold them, at any price.
- *the theatre manager* — The owner of the theatre has sold it to someone who will not give a name, and the lease ends at midsummer.
- *the miller* — A farmer brought grain with stones mixed in to make the weight, and wants flour for the full weight.
- *the pit boss* — A new fighter beat their champion in the yard behind the pit, in front of twenty witnesses, and wants a match.
- *the beast master* — An animal bought from them last month has hurt its new owner, and the owner is telling everyone it was sold wild.
- *the front man* — A customer has started treating them as the real owner, and has offered a deal the real owners would never take.
- *the postmaster* — A letter has arrived for someone who died here ten years ago, in a hand the family recognises.
- *the collier* — A family has been living in the woods near their stand, and the wood they cut keeps going missing.
- *the quarry master* — The crew has found old cut stones under the quarry floor, older than anyone knew, and the landowner wants work stopped.
- *the warehouse factor* — A merchant has died owing a year of storage, and three heirs each say the goods in that bay are theirs.
- *the pawnbroker* — A family heirloom pledged by a son has been missed by his mother, and she has come asking what he got for it.
- *the cartographer* — A surveyor they trained has sold copies of their maps to the people the maps were meant to be kept from.
- *the master fishmonger* — Someone has been leaving spoiled fish at their stall overnight, and the customers think it is their stock.
- *the innkeeper* — A guest left without paying, and left behind a list of names of people in this place.
- *the network's spider* — An informant they trusted wants out, and has offered every secret the informant knows as the price of leaving.
- *the ropemaker* — A customer has ordered a rope of a length that only makes sense for a climb, and wants it unmarked.
- *the lodge master* — A founding member's grandchild has asked to see the lodge's first records, and those records name a crime.
- *the toll-keeper* — The people who own the road have raised the toll without telling the carters, and the carters blame them.
- *the undercity boss* — A family has moved into one of their empty passages, and refuses to leave.
- *the black marketeer* — A customer paid in coins that someone is looking for, and that someone is following the coins back to them.
- *the glassmaker* — A buyer has ordered panes cut to one exact size, many of them, for a building nobody has heard of.
- *the coaching-inn keeper* — A driver has been carrying a sealed box on every coach, and the box goes off with a different rider at each stop.
- *the master smith* — A lock they made for a rich house has been opened without a mark, and the owner is asking who else has the pattern.
- *the cobbler* — A customer has ordered boots for a child, with a hidden pocket in the heel, and paid in advance.
- *the lanista* — A fighter they sold years ago has come back free and wealthy, and wants to buy the rest of their stable.
- *the guildmaster of thieves* — A thief has handed back everything taken from one house, and will not tell the guild why.
- *the banker* — A clerk has been lending depositors' money on the side at a higher rate, and the borrowers think the bank knows.
- *the master furrier* — A trapper has brought in a pelt from an animal nobody has seen in these hills for fifty years.
- *the auctioneer* — A buyer paid for a lot and never collected it, and the lot has started to draw visitors who only look.
- *the hospital's master* — A nurse has been sending patients home early, and two of them have died at home.
- *the dyer* — Their best colour comes from a plant that grows on one family's land, and that family has stopped selling it.
- *the stable master* — A rider has left a horse with them and paid for a year, and the horse is one that was reported stolen.
- *the chandler* — A customer has ordered black candles in a number that matches the households on one street.
- *the impresario* — Their company has been invited to perform for a family that ruined the last company to accept.
- *the bath-keeper* — A bather collapsed in the hot room last week, and the family says someone held the door shut.
- *the fuller* — A weaver they work for has asked them to swear that cloth was lost in the vats when it was sold.
- *the skydock master* — A crew has asked to dock without being written down, and has offered a year of fees in coin.
- *the grove elder* — A child has been visiting the grove alone at night, and has started speaking of things only the elders were told.
