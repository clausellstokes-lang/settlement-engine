# TROUBLE-LINES-2: a trouble's hooks, eight kinds (PAGE-7's builder; the chair's rulings of 16:19; VETOABLE, the owner's)

These are hooks only; lasting effects are not built (ruling 1). The tables use these columns:

- **need** is a fact-vocabulary atom, read by `factVocabulary.js :: atomHolds` over `factsOf(record)`. `!atom` means the
  atom reads false (a stored row's `excludes`). `+` means all of them must hold.
- **home** is where `src/domain/facts/` answers the need.
- **rate** is how often the need holds among the kind's tensions on the 900 towns.
- **prints** is the share of the kind's places that print the line, under the selection below.
- **S** marks one of today's three stored hooks; **H** marks a need that is hideable (CAUSES-DATA rule 5).

The selection: the 3 highest of `fnv1a32(`${seed}::trouble::${kind}::hook::${text}`)` among the lines whose need holds.
The stored array keeps its length. Source: `measures/page-7/hooks/pools.mjs` and `measure.pools.out.txt`.

## crime_wave (231 tensions; 12 lines, 6 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 1 S | The crime wave is coordinated. Someone is directing it to create a pretext | none | 100% | 29.9% |
| 2 S H | A guard captain is on the payroll of the criminal network | `watch` + `organised crime` (`defence.js :: defenceOf`; `criminalStructureKey.js :: criminalStructureKeyOf`) | 81.8% | 19.0% |
| 3 S | Those who would take the law into their own hands have picked out a culprit on bad information | none | 100% | 30.3% |
| 4 | A household woke to find its door forced and nothing taken, and wants to know what the thieves were looking for | none | 100% | 34.6% |
| 5 | A boy who runs errands for half the place has started carrying more coin than any errand pays | none | 100% | 34.6% |
| 6 | Those who talk of taking the law into their own hands meet tonight, and they want someone who can fight | none | 100% | 32.0% |
| 7 | A traveller robbed on the way in swears the robber knew which bag held the money | none | 100% | 31.6% |
| 8 | A stallholder at the market has stopped reporting thefts, and will not say why | `market` (`market.js :: marketOf`) | 84.4% | 26.8% |
| 9 H | A watchman afraid of the night round is looking for someone to walk it with him, and will pay from his own purse | `watch` (`defence.js :: defenceOf`) | 82.3% | 25.5% |
| 10 H | A shopkeeper has been told to close by the end of the week, by people who did not give their names | `organised crime` (`criminalStructureKey.js`) | 84.4% | 21.2% |
| 11 H | Two crews have been seen arguing over the same ground, and a fight between them looks a night away | `rival rings` (`rivalRings.js :: rivalRingsStand`) | 30.7% | 7.8% |
| 12 H | A thief caught in the act is being held in a cellar by the household that caught him, and nobody knows what to do with him next | `law: ≤ critical` (`lawBand.js :: lawBandOf`) | 14.7% | 6.5% |

## guild_conflict (215 tensions; 12 lines, 4 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 1 S | A guild master's records have gone missing ahead of an audit | `guild` (`guild.js :: guildOf`) | 99.5% | 27.9% |
| 2 S | A journeyman denied mastership has proof the exam was rigged | `guild` (`guild.js`) | 99.5% | 19.1% |
| 3 S | Someone is sabotaging both sides to destabilize the market for a third party | `market` + `guild` (`market.js`; `guild.js`) | 99.5% | 27.9% |
| 4 | A trader selling outside the rules has had a cart overturned in the night, and has a fair idea who did it | none | 100% | 31.2% |
| 5 | A craftsman working from home has been told to stop selling, and means to carry on | none | 100% | 26.0% |
| 6 | Both sides of the quarrel over trade are counting heads before the next gathering, and each is a few short | none | 100% | 24.7% |
| 7 | A family that sells to both sides is being pressed to choose, and has asked for a few more days | none | 100% | 29.8% |
| 8 | A stall at the market has been promised to two traders at once, and both will turn up at dawn | `market` (`market.js`) | 100% | 22.8% |
| 9 | The guild is about to fine a member for buying from an outsider, and the member has threatened to name who else does it | `guild` (`guild.js`) | 99.5% | 33.5% |
| 10 | A trader turned away from selling is taking the matter to the court, and needs a witness who saw it | `court sits` (`defence.js :: courtHoldersOf`) | 93.0% | 23.3% |
| 11 | A boat's cargo sits unloaded at the water's edge while the two sides argue over who may sell it | `navigable` (`water.js :: waterOf`) | 42.3% | 11.6% |
| 12 H | A trader outside the guild has been offered protection by people outside the law, and is tempted | `organised crime` (`criminalStructureKey.js`) | 81.9% | 22.3% |

Line 3 has two stored spellings: "both sides" (`byMemory.unanchored`, 185/215) and "both guilds" (the base template,
30/215). The pool keeps "both sides", which is true under either set of camps.

## resource_scarcity (114 tensions; 9 lines, 5 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 1 S | A store of the scarce goods is being kept off the market on purpose | `market` (`market.js`) | 42.1% | 16.7% |
| 2 S | The scarcity was engineered. Someone destroyed the competing supply route | none | 100% | 52.6% |
| 3 S | An alternative source exists but the information is being suppressed | none | 100% | 51.8% |
| 4 | A household caught hoarding is about to be turned out by its neighbours, and swears it was keeping the goods for others | none | 100% | 51.8% |
| 5 | A carter offers to fetch what is short from elsewhere, if someone will pay half the price before he sets out | none | 100% | 48.2% |
| 6 | A family that cannot pay the prices asked is selling its last good tools to buy what it needs | none | 100% | 40.4% |
| 7 | With the place going hungry, a sack of food has gone missing from a household that had little to spare | `famine` (`famine.js :: famineOf`) | 18.4% | 7.9% |
| 8 | A party sent to take supplies for the war is due tomorrow, and households are hiding what they can | `war: at war` (`warState.js :: warStateOf`) | 18.4% | 7.9% |
| 9 | A boat has come in loaded with what is short, and its master is asking twice what anyone here can pay | `navigable` (`water.js`) | 44.7% | 22.8% |

## external_threat (79 tensions; 9 lines, 4 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 1 S | The threat is being exaggerated by someone who profits from wartime contracts | `!war: peace` (`warState.js`) | 32.9% | 13.9% |
| 2 S | A diplomatic channel exists that the war party is suppressing | `!war: peace` (`warState.js`) | 32.9% | 12.7% |
| 3 S | The threat has an agent already inside the settlement | none | 100% | 51.9% |
| 4 | A rider brings fresh news of the danger tonight, and it does not match what the last one said | none | 100% | 49.4% |
| 5 | A family is packing to leave before dawn, and the neighbours are trying to stop them spreading panic | none | 100% | 54.4% |
| 6 | A stranger asking about the roads in and out has asked for a bed for the night | none | 100% | 63.3% |
| 7 | A stretch of the wall has been found crumbling, and mending it needs more hands than there are | `walls` (`defence.js`) | 58.2% | 21.5% |
| 8 H | Those who keep order are calling for volunteers, and the first to come forward is the last one anyone expected | `guardPresence` (`factsOf.guardPresence`, `defence.js`) | 70.9% | 25.3% |
| 9 | Tracks of the beasts that press on this place have been found beside a well-used path, closer than ever | `crisis: monster_pressure` (`crisisKind.js :: crisisOf`) | 24.1% | 7.6% |

## succession_crisis (74 tensions; 9 lines, 4 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 1 S H | A would-be heir approaches outsiders to investigate a rival's past | `ruler: lord` (`rulerKind.js :: rulerKindOf`) | 9.5% | 4.1% |
| 2 S H | The ailing ruler wants a final errand completed before naming a successor | `!ruler: council` + `!ruler: elder` + `!crisis: succession_void` (`rulerKind.js`; `crisisKind.js`) | 8.1% | 6.8% |
| 3 S H | Someone is poisoning the ruler slowly, and someone in the household knows | the same as line 2 | 8.1% | 2.7% |
| 4 | One of the would-be successors is giving a feast tonight, and every guest will be counted | none | 100% | 63.5% |
| 5 | A would-be successor wants a rival's supporters watched, quietly, and is offering coin for it | none | 100% | 59.5% |
| 6 | A letter meant for one would-be successor has reached another, and both now know what it says | none | 100% | 60.8% |
| 7 | A household that has backed no one is visited by each side in turn, and has asked for protection from both | none | 100% | 62.2% |
| 8 H | A council member has not yet said whom they back, and their house was broken into last night | `ruler: council` (`rulerKind.js`) | 43.2% | 21.6% |
| 9 | With the seat empty, the seal used on the place's business has gone missing | `crisis: succession_void` (`crisisKind.js`) | 37.8% | 18.9% |

## outside_debt (63 tensions; 9 lines, 5 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 1 S | The original loan documents contain a clause that was never disclosed publicly | none | 100% | 47.6% |
| 2 S | A creditor's agent is in town conducting a quiet assessment before enforcement | `!crisis: under_siege` (`crisisKind.js`) | 98.4% | 39.7% |
| 3 S | The debt could be voided, if someone can prove it was obtained through fraud | none | 100% | 25.4% |
| 4 | The one who kept the accounts of the loans has gone missing a week before the collectors are due | none | 100% | 46.0% |
| 5 | A family that would bear the cost is quietly moving its goods out of the place, cart by cart | none | 100% | 39.7% |
| 6 | The outside power has sent word of the day it will collect, and wants to know who will meet its people | none | 100% | 41.3% |
| 7 | The creditors have taken a household's goods against the debt, and the household wants them back before they leave | `crisis: indebted` (`crisisKind.js`) | 44.4% | 19.0% |
| 8 | A wealthy household offers to pay the debt itself, in return for a say in how the place is run | `prosperity: ≥ prosperous` (`prosperityRank.js :: prosperityLabelOf`) | 27.0% | 15.9% |
| 9 | A trader at the market is selling off stock cheap before the collectors arrive, and seems to know the day | `market` (`market.js`) | 66.7% | 25.4% |

## legitimacy_crisis (58 tensions; 9 lines, 6 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 1 S | A document that would settle the question of legitimacy exists, and both sides would rather it stayed lost | none | 100% | 43.1% |
| 2 S | Those in power are paying people to speak for them at the gatherings, because no one will do it for free | none (an approved seat swaps in its twin: `historyData.js :: LEGITIMACY_HELD_TWINS`) | 100% | 44.8% |
| 3 S | A third party is keeping the question open on purpose, because an unsettled claim is easier to bargain with | none | 100% | 37.9% |
| 4 | Someone has painted a challenge to the authority's right to rule where everyone will see it at dawn, and those in charge want the hand found | none | 100% | 44.8% |
| 5 | A speaker who questions the right to rule is due at a gathering tonight, and those in charge mean to stop the gathering | none | 100% | 48.3% |
| 6 | One of those who deny the mandate has been offered a post by those in charge, and has not yet answered | none | 100% | 46.6% |
| 7 | Those risen against the authority have taken a cart of supplies on the road, and the carter is missing | `crisis: insurgency` (`crisisKind.js`) | 32.8% | 15.5% |
| 8 | A preacher of the new faith is telling crowds that those in charge rule without blessing | `crisis: religious_conversion` (`crisisKind.js`) | 15.5% | 5.2% |
| 9 H | The power that stands above the governing one has sent an envoy to look into the question, and both sides are courting the envoy | `seat outranked` (`seatOutranked.js :: seatOutrankedOf`) | 24.1% | 13.8% |

## corruption_scandal (51 tensions; 9 lines, 6 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 1 S | The investigator who uncovered the corruption has received a death threat | none | 100% | 41.2% |
| 2 S | A key witness can be found, but won't speak without protection | none | 100% | 47.1% |
| 3 S | The corruption goes higher than anyone yet suspects; those pressing to expose it are being used | none | 100% | 54.9% |
| 4 | A copy of the evidence is being passed from hand to hand, and one copy differs from the rest | none | 100% | 35.3% |
| 5 | An official named in the evidence is selling property in a hurry | none | 100% | 35.3% |
| 6 | Someone has offered to buy the evidence outright, for more than it seems worth | none | 100% | 41.2% |
| 7 | The hearing on the evidence is set for next week, and the clerk who was to read it out has fallen ill | `court sits` (`defence.js :: courtHoldersOf`) | 43.1% | 5.9% |
| 8 | One of those who betrayed the place is named in the evidence, under another name | `crisis: recently_betrayed` (`crisisKind.js`) | 39.2% | 19.6% |
| 9 | A trader who paid dues to the corrupt has kept every receipt, and is deciding whom to give them to | `market` (`market.js`) | 47.1% | 19.6% |

## The bar, by size

Places are the 150 of each size; the census's own 50 a size are shown in brackets. Source: the `BAR` lines of
`measure.pools.out.txt`.

- **Today:**
  - top share: thorp 16.7, hamlet 17.3, village 14.0, town 32.7, city 52.7 (54.0), metropolis 58.7 (56.0).
  - second place prints: thorp 6.1, hamlet 6.9, village 6.0, town 12.4, city 24.4 (22.2), metropolis 27.1 (25.5).
- **With these pools:**
  - top share: thorp 10.7, hamlet 11.3, village 8.0, **town 14.7, city 19.3 (20.0), metropolis 19.3 (22.0)**.
  - second place prints: thorp 3.7, hamlet 3.6, village 4.4, town 4.7, **city 8.1 (7.3), metropolis 8.8 (8.1)**.
- Three places of one size in a row that share any hook: 41.0% (city 73.0, metropolis 81.1). This is reported only; it is
  not the bar.

**Second place prints: met at every size. Top share: met through town, missed in cities and metropolises.** The cause
is structural. crime_wave sits in 53% of cities and guild_conflict in 59% of metropolises, so with 3 of about 11
admitted lines their lines average about 14.5% of a size's places, and the spread of 79 or 88 places lifts the top line
to 29 (city 79 places: [29 27 26 26 24 21 21 19 17 17 10]).

Keying the hash text-first (the town's bytes last) is worse: city 45/150 (`measure.pools.textfirst.out.txt`). Keep
seed-first.

Getting the top share to about 15% at those two sizes takes about 16 lines in those two pools, or 2 taken a place.
That is the chair's call.
