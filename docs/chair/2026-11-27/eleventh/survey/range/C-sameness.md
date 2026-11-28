# (C) WHAT A READER SEES (RANGE-MEASURE, 2026-11-28)

Tree b693c4605. C and V as the app renders them (owner view, every tab and disclosure walked; Notes tabs left out; chrome
left out: src/copy lines, JSX text, a component's line on 90% of pages: C 23,532, V 23,379 sentences). A SENTENCE: 4+ words
ending . ! ?. "WORD FOR WORD BUT FOR NAMES": each town's own proper names masked as `#` (every record string under a key
ending in `name`, and each part of a person's name; a name held by 2% of towns or more, "Elder Council", "Shepherd
collective", is a kind, not a name, and stays). `tools/names.mjs`, `tools/sameness.mjs`. Counts CONFIRMED.

## (i) ACROSS TOWNS: a page's sentences that also print in another town of the same size
**C: of 412,416 sentences, 96.0% also print, word for word but for names, in at least one other town of the same size; 76.7%
in a tenth or more of the towns of that size; 34.6% in HALF or more. V: 95.1% / 71.4% / 28.4%.**
Per page (the mean of each page's own share; another town / a tenth of them / half of them):

| size | C | V |
|---|---|---|
| thorp | 94 / 63 / 19 | 93 / 52 / 14 |
| hamlet | 93 / 53 / 14 | 92 / 45 / 10 |
| village | 93 / 53 / 11 | 92 / 48 / 8 |
| town | 95 / 67 / 20 | 94 / 62 / 15 |
| city | 97 / 82 / 36 | 96 / 77 / 30 |
| metropolis | 97 / 86 / 48 | 96 / 82 / 42 |

By tab (sentences pooled over sizes; each sentence counted against the towns of its own size):

| tab | sentences C / V | in another town of its size C / V | in 10%+ of its size C / V | in half or more C / V |
|---|---|---|---|---|
| World/Relationships | 84535 / 81419 | 94% / 94% | 85% / 84% | 59% / 55% |
| World/NPCs | 62156 / 59297 | 95% / 93% | 62% / 58% | 10% / 8% |
| Systems/Services | 60500 / 57417 | 100% / 100% | 96% / 94% | 74% / 63% |
| Systems/Institutions | 48138 / 46104 | 100% / 100% | 87% / 82% | 3% / 1% |
| Summary/Plot Hooks | 37645 / 36210 | 99% / 99% | 89% / 88% | 45% / 42% |
| Systems/Defense | 32235 / 31271 | 98% / 98% | 79% / 70% | 22% / 15% |
| Systems/Power | 21835 / 20250 | 95% / 92% | 60% / 44% | 27% / 6% |
| Systems/Economics | 19023 / 22546 | 98% / 97% | 77% / 68% | 33% / 20% |
| Summary/Overview | 13278 / 13292 | 91% / 87% | 47% / 36% | 9% / 7% |
| World/Daily Life | 10171 / 10181 | 88% / 87% | 25% / 6% | 1% / 0% |
| World/Traditions | 9711 / 9708 | 76% / 74% | 27% / 21% | 4% / 1% |
| World/Faith | 3233 / 3160 | 100% / 99% | 97% / 92% | 88% / 47% |
| World/History | 2998 / 3016 | 80% / 77% | 33% / 27% | 0% / 0% |
| Summary/Crisis | 2423 / 2388 | 96% / 94% | 25% / 25% | 10% / 6% |
| Systems/Resources | 2124 / 2467 | 95% / 91% | 63% / 51% | 0% / 0% |
| Systems/Outlook | 1140 / 1452 | 93% / 89% | 59% / 35% | 7% / 0% |
| Systems/Magic | 978 / 974 | 99% / 96% | 82% / 66% | 0% / 0% |
| Summary/Foundations | 293 / 287 | 95% / 91% | 0% / 0% | 0% / 0% |

Reading it (PLAUSIBLE): Services, Institutions, Faith and Plot Hooks are near-total repeats (fixed catalogue text and the
secret pools); Relationships repeats 85% in a tenth of towns because a city prints its 8-line tie keys for twenty pairs;
Daily Life, Traditions and History are the least repeated (6 to 33% in a tenth of towns): the newest pools, keyed on the
town's own facts.

**THE FIFTY SENTENCES THAT PRINT IN THE MOST TOWNS** (C, any size; the V count beside it, "<204" where the sentence is not in
V's top 300):

| # | sentence (names masked as #) | towns C | towns V | tab | home |
|---|---|---|---|---|---|
| 1 | The faith’s god and the church’s name are yours to set. | 887 | 859 | World/Faith | domain/dossier/faithReading.js :: FAITH_YOURS_LINE |
| 2 | Most folk attend the rites through the year. | 861 | <204 | World/Faith | domain/dossier/faithReading.js :: observanceOf() |
| 3 | The seat is not in criminal hands. | 810 | 736 | Systems/Power | data/people/dmPowerLines.js :: CAPTURE_RUNG_LABELS.none |
| 4 | No arcane practitioners on the rolls. | 596 | 550 | Systems/Defense | domain/display/defenseDisplay.js :: ARCANE_NONE |
| 5 | Wards, detection and counterspell are beyond this settlement. | 596 | 550 | Systems/Defense | domain/display/defenseDisplay.js :: ARCANE_NONE |
| 6 | Secret: Was present when # did something they've never accounted for publicly. | 526 | 522 | World/NPCs | generators/npcGenerator.js :: generateCrimeLevel.1 |
| 7 | Secret: Has been reading #'s correspondence through an intermediary. | 520 | 529 | World/NPCs | (unhomed) |
| 8 | No deterrence beyond force. | 485 | 500 | Systems/Defense | domain/display/defenseDisplay.js :: caps.2.note |
| 9 | # has begun to act like someone who considers the debt paid. | 468 | 458 | Summary/Overview | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.tension |
| 10 | # does not. | 468 | 461 | Summary/Overview | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.tension |
| 11 | # has never asked for it back. | 467 | 439 | World/Relationships | (unhomed) |
| 12 | Someone keeps paying off their small debts around the place before they can, and has left no name. | 467 | 451 | Summary/Plot Hooks | data/npcData.js :: NPC_FACTION_LOYALTY.other |
| 13 | # still owes the debt and still knows it. | 465 | 455 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.desc |
| 14 | # is about to call it in. | 465 | 453 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.tension |
| 15 | # borrowed #'s good name to win a post. | 464 | 435 | World/Relationships | (unhomed) |
| 16 | # owes # a great deal, and neither has ever said so aloud. | 463 | 450 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.desc |
| 17 | # nursed # through a winter fever when no one else would come. | 462 | 453 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.desc |
| 18 | # has refused # a small favour for the first time in years. | 462 | 453 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.tension |
| 19 | Neither mentions it, and both know exactly how much is still owed. | 459 | 457 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.desc |
| 20 | # owes # for an old kindness. | 453 | 455 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.desc |
| 21 | Grind grain into flour for bread and other foods. | 450 | 450 | Systems/Services | data/institutionServices.js :: INSTITUTION_SERVICES.Mills (2-5).Grain  |
| 22 | A room let in a private house, by the night or the week. | 450 | 450 | Systems/Services | data/institutionServices.js :: INSTITUTION_SERVICES.Housing (75-650 ho |
| 23 | A bed by the hearth and a place at a shared table, for a traveller who asks. | 449 | 446 | Systems/Services | data/institutionServices.js :: INSTITUTION_SERVICES.Dwellings (1-8).Ho |
| 24 | # would rather be repaid in favours. | 447 | 456 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.tension |
| 25 | # owes # a large sum in coin, borrowed in a bad year and repaid in small amounts ever since. | 444 | 454 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.desc |
| 26 | # has offered to clear what is left of the debt in one payment. | 444 | 454 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.old_debt.tension |
| 27 | They have promised the same order to two buyers, and both are due to collect on the same morning. | 439 | 428 | Summary/Plot Hooks | data/npcData.js :: NPC_FACTION_LOYALTY.economy |
| 28 | Property Rents Ground rents on civic-owned buildings, stalls, and residential plots within the walls. | 438 | 394 | Systems/Economics | generators/economy/economicState.js :: generateEconomicState |
| 29 | The two of them remember it differently. | 431 | 407 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.desc |
| 30 | # knows, and is watching for it. | 429 | 403 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 31 | # owes their place to # and has kept others from climbing the same way. | 427 | 403 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.desc |
| 32 | # has one favour left to call in, and is saving it. | 427 | 403 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 33 | The answer took too long. | 424 | 401 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 34 | A third party has asked #, quietly, whether # can be trusted. | 421 | 397 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 35 | Neither discusses the divergence directly. | 420 | 409 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 36 | The settlement keeps score, and so do they. | 416 | 364 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.peer_rivalry.desc |
| 37 | # now operates in ways # would not approve of. | 415 | 407 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 38 | # vouched for # when nobody else would. | 414 | 397 | World/Relationships | (unhomed) |
| 39 | # corrected # in public last month, and was right. | 414 | 397 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 40 | A post opens at midsummer, and only # or # can fill it. | 414 | 362 | Summary/Overview | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.peer_rivalry.tension |
| 41 | # and # trained together and have competed ever since. | 414 | 362 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.peer_rivalry.desc |
| 42 | Slaughtered and dressed on premises or nearby. | 414 | 325 | Systems/Services | data/institutionServices.js :: INSTITUTION_SERVICES.Butchers (3-8).Fre |
| 43 | #'s first post came from that word. | 412 | 400 | World/Relationships | (unhomed) |
| 44 | It is the first time a debt between teacher and student has run that way. | 411 | 413 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 45 | # has asked # for a loan. | 409 | 410 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 46 | Each counts the other's wins more carefully than their own. | 404 | 376 | World/Relationships | (unhomed) |
| 47 | # has taken on a client # turned away on principle. | 402 | 395 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension |
| 48 | Neither has ever been more than one favour ahead. | 401 | 383 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc |
| 49 | # has said nothing about it, to anyone. | 399 | 375 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.peer_rivalry.tension |
| 50 | # has hired away #'s best assistant. | 398 | 370 | World/Relationships | data/npcData.js :: STRESS_ECONOMIC_EFFECTS.peer_rivalry.tension |

## (ii) WITHIN A PAGE: the same thing said twice
**MY READING (PLAUSIBLE)** on 30 pages of C, five a size, by a seeded shuffle (`tools/pairs.mjs`, seed `range-ii`; drawn
before V was rendered). A script first proposes candidate pairs (two different sentences of one page sharing content stems:
overlap 0.5 with 3+ shared, or Jaccard 0.4), and I read the strongest eight a page; on cities and metropolises, pairs that are
one template with other names were set apart first (they are counted below). **46 pairs say the same thing twice in other
words, on 28 of the 30 pages: 1.5 a page** (thorp 6 on 5 pages, hamlet 7, village 9, town 9, city 6, metropolis 9). On a
big page only eight of several hundred candidates were read, so this is a floor. The repeat offenders:
- "No granary; about a month and a half in household stores." (Economics or Crisis) beside "Food endurance: No granary: under
  siege the outlying fields would be lost; household stores would carry the thorp for about a month…" (Defense): on all 15 thorp, hamlet
  and village pages read.
- "Nobody here is paid to keep order." beside "Nobody at Stredburg is paid to keep order; what order the place has, its own
  people keep." (Defense, one tab).
- "People keep away from the outlying houses, and nobody walks out at night." beside "Nobody at Llanmere goes out after dark if
  they can help it, and the outlying houses stand empty at night." (Defense, one tab).
- "With a leading figure gone, a visitor finds people unsure whose word counts now." beside "A leading figure is gone, and who
  takes their place is not settled." (Daily Life, one tab).
- "Holds the seat, but many doubt its right to it…" beside "Constraint: Cannot carry the council on anything hard while so many
  doubt the seat's right." (one person's card).
- A house's description on Institutions repeated in other words as its service on Services ("High-interest loans against
  pledged goods, with no questions." / "Short-term loans against pledged goods."; the fuller; the sawmill; the registers).
- Two traditions' keepers: "Its keeping falls to the monasteries; Yafang Wu, the senior abbot, presides." / "It is in the
  keeping of the monasteries, with Yafang Wu, the senior abbot, presiding."; "X takes in more from market taxes than from
  anything else." / "Market taxes bring X more than anything else."
- Two people of one page with one dealing line in two wordings ("Keeps out of trouble by keeping away from you…" / "Avoids you
  to stay clear of trouble, and passes you on…").

**BY SCRIPT: ONE TEMPLATE TWICE ON ONE PAGE** (the same words for other people or other houses; `tools/selfrep.mjs`): of a
page's sentences, the share that repeats a template already printed on that page:

| size | C | V |
|---|---|---|
| thorp | 10.6% (12 a page) | 11.5% (13) |
| hamlet | 13.4% (19) | 13.5% (20) |
| village | 15.0% (30) | 14.6% (29) |
| town | 16.5% (67) | 16.6% (66) |
| city | 18.9% (148) | 18.8% (142) |
| metropolis | 21.1% (220) | 20.7% (206) |

By tab (C): Relationships 30%, Institutions 31%, Plot Hooks 22%, Services 18%, Power 17%, Defense 16%, Economics 13%, NPCs 4%.
A metropolis page reads "X spent seven years at Y's side." and "Half of the people X deals with first came through Y's door."
for three or four pairs each (dp-metropolis-15: four pairs).

## (iii) THE CODE-COMPOSED PART: how many shapes
Here "composed" is every sentence NOT drawn from a key of 2+ lines: one-line table cells (the record's catalogue text),
code literals and templates, and unhomed sentences (C 45.0% of sentences, V 45.3%; the survey measure's 68% counted pools
at the draw doors only, so the house descriptions and tie lines were "composed" there and are keys here). A SHAPE is the
source template with its slots emptied (an unhomed sentence: its text, names and numbers masked).
**C: 4,903 distinct composed shapes (V 5,887). The fifty commonest are 16.6% of composed sentences (V 15.2%), 7.5% of all
sentences (V 6.9%); the twelve commonest 5.8% (V 5.6%).** The composed part is NOT a form of twelve shapes: it is a long
tail. Its sameness is that each shape prints word for word: most are fixed catalogue or record text with no slot.

The fifty commonest composed shapes (C; V's count beside; "cell" = a one-line table cell, "none" = unhomed):

| # | shape (slots as …) | kind | C | share of all C | V | home |
|---|---|---|---|---|---|---|
| 1 | … here depend on … brought in…. | code | 1851 | 0.45% | 2195 | domain/display/chainNeedShown.js :: chainNeedLine() |
| 2 | No arcane practitioners on the rolls. Wards, detection and counterspell are beyond this settlement. | code | 1192 | 0.29% | 1100 | domain/display/defenseDisplay.js :: ARCANE_NONE |
| 3 | , and what is still harvested … … further | code | 900 | 0.22% | 893 | domain/display/defenseDisplay.js :: stretched |
| 4 | The faith’s god and the church’s name are yours to set. | code | 887 | 0.22% | 859 | domain/dossier/faithReading.js :: FAITH_YOURS_LINE |
| 5 | Most folk attend the rites through the year. | code | 861 | 0.21% | - | domain/dossier/faithReading.js :: observanceOf() |
| 6 | The seat is not in criminal hands | cell | 810 | 0.20% | 736 | data/people/dmPowerLines.js :: CAPTURE_RUNG_LABELS.none |
| 7 | Daily bread. The staple food of most people. Quality and price vary. | cell | 764 | 0.19% | 628 | data/institutionServices.js :: INSTITUTION_SERVICES.Bakers (5-15).Fres |
| 8 | … holds the seat…; … … people that … rule is right and ordained. Each props up the other. | code | 740 | 0.18% | 264 | generators/factionDynamics.js :: computeFactionRelationships() |
| 9 | Raw logs into planks and beams. Essential input for all construction. | cell | 736 | 0.18% | 594 | data/institutionServices.js :: INSTITUTION_SERVICES.Sawmill.Lumber mil |
| 10 | The money of … pays for the charity of …, and the charity keeps the poor quiet. Each needs the other, and neither likes  | code | 692 | 0.17% | 270 | generators/factionDynamics.js :: computeFactionRelationships() |
| 11 | # has never asked for it back. | none | 681 | 0.17% | 574 | (unhomed) |
| 12 | They and the religious authorities both keep people in line. The … deals with bodies and the clergy with minds, and each | code | 678 | 0.16% | 312 | generators/power/factionStanding.js :: guardReligiousNote |
| 13 | # borrowed #'s good name to win a post. | none | 676 | 0.16% | 568 | (unhomed) |
| 14 | Watertight barrels for ale, wine, salted meat, and fish. Essential packaging for trade. | cell | 626 | 0.15% | 622 | data/institutionServices.js :: INSTITUTION_SERVICES.Cooper.Barrel maki |
| 15 | Dig, inter and close the grave. Rites where there is someone at hand to say them. | cell | 600 | 0.15% | 600 | data/institutionServices.js :: INSTITUTION_SERVICES.Burial ground.Buri |
| 16 | … … the faith in …. | code | 600 | 0.15% | 600 | domain/dossier/faithReading.js :: faithLinesOf() |
| 17 | Reforge broken tools, re-edge blades, mend ironwork. Often more valuable than new. | cell | 598 | 0.14% | 684 | data/institutionServices.js :: INSTITUTION_SERVICES.Blacksmiths (3-10) |
| 18 | Axes, ploughs, hinges, nails. The foundation of agricultural and construction work. | cell | 598 | 0.14% | 684 | data/institutionServices.js :: INSTITUTION_SERVICES.Blacksmiths (3-10) |
| 19 | Criminal activity is coordinated enough to maintain routes and territories but lacks a single controlling authority. Sev | cell | 591 | 0.14% | 417 | domain/display/defenseDisplay.js :: CRIM_STRUCTURE_DATA.semi-organized |
| 20 | No granary; … in household stores. | code | 585 | 0.14% | 547 | domain/summary/tonightSheet.js :: foodStoresWords() |
| 21 | Magical practitioners outside guild oversight: identity work, scrying, targeted effects. Available if you know where to  | code | 578 | 0.14% | - | generators/servicesGenerator.js :: generateAvailableServices |
| 22 | Practitioners misuse … for profit. Identity alteration, scrying, …, or targeted curses-for-hire. | code | 578 | 0.14% | - | generators/safetyProfile.js :: generateSafetyProfile |
| 23 | Bulk ale for taverns and households. Staple beverage where water is unsafe. | cell | 576 | 0.14% | 562 | data/institutionServices.js :: INSTITUTION_SERVICES.Brewery.Ale produc |
| 24 | Stores: a granary, … of grain. | code | 574 | 0.14% | 568 | domain/summary/tonightSheet.js :: foodStoresWords() |
| 25 | The largest trading event of the year. Merchants from distant regions. | cell | 556 | 0.13% | 440 | data/institutionServices.js :: INSTITUTION_SERVICES.Major annual fairs |
| 26 | Rent horses for single journeys or extended travel. Quality varies by price. | cell | 546 | 0.13% | 440 | data/institutionServices.js :: INSTITUTION_SERVICES.Stable district.Ho |
| 27 | Collect toll from all who cross. Rate varies by load and cargo. | cell | 542 | 0.13% | 428 | data/institutionServices.js :: INSTITUTION_SERVICES.Toll bridge.Crossi |
| 28 | Was present when … did something they've never accounted for publicly. Neither has acknowledged the other was there | code | 527 | 0.13% | 525 | generators/npcGenerator.js :: generateCrimeLevel.1 |
| 29 | Operates unlicensed gambling. Revenue funds broader criminal network. Attracts debt spirals and desperation crime. | code | 520 | 0.13% | 498 | domain/display/defenseDisplay.js :: criminalOpNote() |
| 30 | Moves goods around customs and guild charters. Corrupt officials, unofficial landing points, and false manifests. | code | 516 | 0.13% | 410 | domain/display/defenseDisplay.js :: criminalOpNote() |
| 31 | Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly  | code | 516 | 0.13% | 342 | generators/power/claimStanding.js :: ARCANE_ADVISORY |
| 32 | Secret: Has been reading #'s correspondence through an intermediary. | none | 514 | 0.12% | 521 | (unhomed) |
| 33 | An active … smuggling operation moves contraband through the settlement. The routes are established and the operators ha | code | 510 | 0.12% | 404 | generators/safetyProfile.js :: generateSafetyProfile.desc |
| 34 | # vouched for # when nobody else would. | none | 508 | 0.12% | 445 | (unhomed) |
| 35 | #'s first post came from that word. | none | 502 | 0.12% | 446 | (unhomed) |
| 36 | Tripe, tallow, bone, hide. Nothing wasted. By-products sold to chandlers and tanners. | cell | 488 | 0.12% | 410 | data/institutionServices.js :: INSTITUTION_SERVICES.Butchers (3-8).Off |
| 37 | No deterrence beyond force. | code | 485 | 0.12% | 500 | domain/display/defenseDisplay.js :: caps.2.note |
| 38 | Strike official coinage from bullion. Quality and weight guaranteed by authority. | cell | 482 | 0.12% | 364 | data/institutionServices.js :: INSTITUTION_SERVICES.Mint (official).Co |
| 39 | Goods move past checkpoints. The routes exist; the operators know the schedules. | code | 478 | 0.12% | 378 | generators/servicesGenerator.js :: generateAvailableServices |
| 40 | Everyone who deals with # recognises the teacher. | none | 471 | 0.11% | 419 | (unhomed) |
| 41 | Half of the people # deals with first came through #'s door. | none | 469 | 0.11% | 435 | (unhomed) |
| 42 | # spent seven years at #'s side. | none | 468 | 0.11% | 435 | (unhomed) |
| 43 | It is the first payment # has asked for. | none | 468 | 0.11% | 463 | (unhomed) |
| 44 | # has not said it since. | none | 468 | 0.11% | 430 | (unhomed) |
| 45 | # once told a full room that # was the best pupil they had taught. | none | 466 | 0.11% | 425 | (unhomed) |
| 46 | Dressed stone blocks for construction. Consistency and size matter for fortifications. | cell | 466 | 0.11% | 434 | data/institutionServices.js :: INSTITUTION_SERVICES.Stone quarry.Cut s |
| 47 | … grows …, with some to put by against a bad year. | code | 465 | 0.11% | 296 | components/new/tabs/EconomicsTab.jsx :: foodSentence() |
| 48 | Two of the clients have repeated it to #. | none | 460 | 0.11% | 438 | (unhomed) |
| 49 | # kept #'s name out of a scandal that ruined two others. | none | 456 | 0.11% | 435 | (unhomed) |
| 50 | # has been telling clients that #'s work is slipping. | none | 454 | 0.11% | 434 | (unhomed) |
