# PEOPLE-FACE-CENSUS — which institutions get a representative, judged one by one (2026-11-07)

> The chair's census on the owner's word of 2026-11-07 (verbatim): *"I don't think all institutions need an NPC representative like burial grounds or annual fair or weekly markets that traditionally don't have a representative for that role solely as they are an amalgamation of actors or for other reasons. Frankly I would like you to make a census/judgement call on each institution case by case simply to mark if they deserve an NPC for our rework or not based on what they are."* This census SUPERSEDES PEOPLE-RULINGS R-P1's ordered rules (and withdraws the weight-3 precedence that made a metropolis's 'District markets (5-10)' a face). Every family of `src/data/institutionalCatalog.js` (180 families, 519 tier rows, read at the integration tip) is judged below on what it is, and a tier row is judged on its own where it is a different kind of thing from its family. Vetoable by a word.

## The test (the owner's, in one sentence)

An institution gets a representative when, in the world, someone would be **sent for to speak for it**: the guild's master, the office's holder, the house's head, the temple's priest, the company's captain, the shop's owner, the keeper of a post. It gets none when there is nobody to send for: a **market or a fair** (every stall its own master), a **district or quarter** of many independent doors, a **burial ground, a wall, a well, a sewer, housing, the commons** (works and grounds), a **transient** (a passing troupe, a travelling wizard), or **several of a kind with no common head**. Several of a trade DO have a common head — the trade's master or warden — so 'Blacksmiths (3-10)' keeps the master smith while 'Taverns (5-20)' keeps nobody (no tavern warden was ever sent for). A seat building (hall, palace) is its government's house, not a second seat.

Verdicts: **FACE** (title) · **NONE** (reason). Per-row verdicts are listed where they differ from the family's; `[F]` marks a fabric row (always NONE: X-46 car 3). The 27 'judgment' families of PEOPLE-0 are judged here with everything else.

## Economy (53 families)

| family | rows (tier: name) | verdict | title · reason |
|---|---|---|---|
| Subsistence farming | th, ha; vi Farmland | NONE | the commons: every household farms its own |
| Common grazing land | ha, vi | NONE | the commons |
| Communal root cellar | th | NONE | a shared store, no keeper |
| Fisher's landing | th Fishing community; ha, vi | NONE | many boats, each its own master |
| Fishmonger | vi | FACE | the fishmonger · a shop |
| Fish market | vi–me | NONE | a market |
| Shepherd | th Shepherd collective; ha, vi | FACE | the head shepherd · a collective has a head |
| Dairy farmer | ha, vi | FACE | the dairy farmer |
| Beekeeper | vi | FACE | the beekeeper |
| Wildfowler | vi | FACE | the wildfowler |
| Woodcutter's camp | th–vi | FACE | the camp foreman |
| Charcoal burner | ha–me | FACE | the collier |
| Peat cutter | ha, vi | FACE | the peat-reeve |
| Mine | ha Mine (open cast); vi–me | FACE | the mine captain |
| Stone quarry | ha–me | FACE | the quarry master |
| Salt works | ha–me | FACE | the salt master |
| Hunter's lodge | ha–to | FACE | the master of the hunt |
| Furrier's district | ci, me | NONE | a district |
| Weekly market | ha Periodic market; vi, to; ci Daily markets; me District markets (5-10) | NONE | a market, at every tier (the weight-3 metropolis row included) |
| Multiple market squares | to Market square; ci, me | NONE | a market |
| Major annual fairs | to Annual fair; ci, me | NONE | a fair |
| International trade center | me | NONE | a quarter of foreign houses, no common head |
| Merchant guilds (3-8) | to; ci (15-40); me (50-100+) | FACE | the senior guild master · a guild has a master |
| Money changers | to; ci Banking houses; me Banking district | FACE | the banker · a house of money has a head, at every tier |
| Pawnbroker | ha–me | FACE | the pawnbroker |
| Inns and taverns (district) | ha Wayside inn · vi Travelers' inn | FACE | the innkeeper · one inn |
| | to Inn (multiple) · ci, me (district) | NONE | many inns, no inn warden |
| Alehouse | ha Alehouse · vi Ale house | FACE | the alewife · one house |
| | to Taverns (5-20) | NONE | many taverns |
| Coaching inn | to–me | FACE | the coaching-inn keeper |
| Caravanserai | ha–me | FACE | the caravanserai keeper |
| Caravan masters' exchange | vi Waystation · to Caravaneer's post | FACE | the waystation keeper / the post's master |
| | ci, me (exchange) | FACE | the exchange's steward · a chartered exchange has officers (a market does not) |
| Carriers' hiring hall | vi; to Carriers' guild | FACE | the carriers' master |
| Pack animal trader | ha, vi | FACE | the horse-coper |
| Stable district | ha Stable yard · vi Stable master | FACE | the stable keeper / the stable master · one yard |
| | to–me Stable district | NONE | a district |
| Beast trainers | to–me | FACE | the beast master · a trade with a master |
| Post relay station | to–me | FACE | the postmaster |
| River ferry | vi–me | FACE | the ferryman |
| River boatyard | vi–me | FACE | the boatwright |
| Shipyard | to–me | FACE | the master shipwright |
| Barge and river transport company | to–me | FACE | the barge master |
| Docks/port facilities | to–me | NONE | a place of many; the harbour master's office is the face of the port |
| Harbour master's office | to–me | FACE | the harbour master |
| Toll bridge | vi–me | FACE | the toll-keeper |
| Customs house | to–me | FACE | the customs collector |
| Town granary | to; ci City granaries; me State granary complex | FACE | the granary reeve / the master of granaries |
| Warehouse district | to Merchant warehouses; ci, me | NONE | a district |
| Public bathhouse | to–me | FACE | the bath-keeper |
| Slave market | to–me | NONE | a market |
| Slave market district | ci, me | NONE | a district |
| Auction house | to–me | FACE | the auctioneer |
| Assay office | to–me | FACE | the assayer |
| Mint (official) | to Mint; ci, me | FACE | the mint master |
| Listening post | to–me | FACE | the watcher · a post has its keeper |
| Chroniclers' exchange | ci, me | FACE | the chronicler · a chartered exchange |

## Crafts (36 families)

| family | rows | verdict | title · reason |
|---|---|---|---|
| Mills (2-5) | th, ha Access to external mill [F] | NONE | fabric: the mill is elsewhere |
| | vi Mill; to–me Mills (2-5) | FACE | the miller · the head miller |
| Maltster | ha, vi | FACE | the maltster |
| Blacksmiths (3-10) | ha Resident smith (part-time); vi Blacksmith; to–me | FACE | the smith / the master smith · a trade with a master |
| Specialized metalworkers | ci, me | FACE | the master metalworker |
| Jeweller | to | FACE | the jeweller |
| Luxury goods quarter | ci, me | NONE | a quarter |
| Carpenters (5-15) | ha (part-time); vi; to–me | FACE | the carpenter / the master carpenter |
| Thatcher | vi | FACE | the thatcher |
| Cooper | vi–me | FACE | the cooper |
| Apothecary district | vi Apothecary · to Apothecary (established) | FACE | the apothecary · a shop |
| | ci, me Apothecary district | NONE | a district |
| Bowyers & fletchers (guild) | vi Bowyer & fletcher; to–me | FACE | the bowyer |
| Sawmill (commercial) | vi Sawmill; to–me | FACE | the sawyer |
| Brewery | vi Brewer; to–me | FACE | the brewer |
| Vintner | to–me | FACE | the vintner |
| Tanners | vi Tannery; to–me | FACE | the tanner |
| Tanner (established) | to–me | FACE | the master tanner |
| Fuller | vi–me | FACE | the fuller |
| Dyer | vi–me | FACE | the dyer |
| Weavers/Textile workers | to–me | FACE | the master weaver |
| Potter | vi–me | FACE | the potter |
| Brickmaker | vi–me | FACE | the brickmaker |
| Cobbler's guild | vi Cobbler; to–me | FACE | the cobbler |
| Tailor's guild | vi Tailor; to–me | FACE | the tailor |
| Butchers (3-8) | to–me | FACE | the master butcher |
| Bakers (5-15) | to–me | FACE | the master baker |
| Smelter | to–me | FACE | the smelt master |
| Chandler | to–me | FACE | the chandler |
| Glassmakers | to Glassblower; ci, me | FACE | the glassmaker |
| Ropemaker | to–me | FACE | the ropemaker |
| Midwife | vi–me | FACE | the midwife |
| Woodcarver | vi–me | FACE | the woodcarver |
| Village scribe | vi | FACE | the scribe |
| Printing house | to–me | FACE | the printer |
| Cartographer's workshop | vi, to; ci, me Cartographer's guild | FACE | the cartographer |
| Craft guilds (5-15) | to; ci (30-80); me (100-150+) | FACE | the senior craft-guild master |
| Alchemist quarter | to Alchemist shop | FACE | the alchemist · a shop |
| | ci, me Alchemist quarter | NONE | a quarter |

## Religious (11 families)

| family | rows | verdict | title · reason |
|---|---|---|---|
| Wayside shrine | th–vi | NONE | untended; a shrine by the road has no keeper |
| Access to parish church | th, ha [F] | NONE | fabric: the church is in another place |
| | vi Parish church | NONE | the building; its priest is the Priest (resident) family's face, and a church without one is served from elsewhere |
| | to Parish churches (2-5); ci (10-30); me (50-100+) | FACE | the dean · the senior priest of the parishes |
| Burial ground | th, ha; vi Graveyard; to Parish burial grounds; ci Burial grounds and charnel house; me Cemetery network | NONE | a ground (the owner's own example) |
| Priest (resident) | vi | FACE | the priest |
| Monastery or friary | to; ci Multiple monasteries; me Major monasteries (5-10) | FACE | the abbot / the senior abbot |
| Cathedral (10,000+ only) | ci; me Great cathedral | FACE | the bishop |
| Small hospital | to; ci Major hospital; me Hospital network | FACE | the hospitaller / the hospital's master |
| Almshouse | to–me | FACE | the almoner |
| Foundling home | to–me | FACE | the foundling-mother |
| Druid Circle | vi | FACE | the archdruid |
| Elder Grove Council | to–me | FACE | the grove elder |

## Government (15 families — every one an office with a holder)

| family | rows | verdict | title |
|---|---|---|---|
| Informal elder consensus | th–vi | FACE | the eldest |
| Head-of-household consensus | th | FACE | the eldest householder |
| Lord's reeve | th | FACE | the reeve |
| Household elder | th | FACE | the household elder |
| Lord's steward | ha, vi; to Lord's appointee; ci, me Noble governor | FACE | the steward / the lord's appointee / the governor |
| Village headman | ha, vi | FACE | the headman |
| City administration | vi Village reeve; to Town council; ci, me | FACE | the reeve / the first councillor / the chief administrator |
| Village elder | vi | FACE | the village elder |
| Mayor and council | to–me | FACE | the mayor |
| Guild consortium | to Guild governance; ci, me | FACE | the consortium speaker |
| Merchant oligarchy | to–me | FACE | the first magnate |
| City-state government | ci, me | FACE | the doge |
| Democratic assembly | ci, me | FACE | the speaker of the assembly |
| Royal seat | ci, me | FACE | the monarch |
| Town crier | to–me | FACE | the crier |

## Infrastructure (9 families)

| family | rows | verdict | title · reason |
|---|---|---|---|
| Dwellings (1-8) | th–me (Dwellings…, Housing…) | NONE | housing |
| Water source | th–to [F]; ci Aqueduct or water system; me Advanced water infrastructure | NONE | works; the administration owns them |
| City hall | to Town hall; ci, me | SEAT | the seat's face, titled from the governing power, ONLY where no Government-shelf house rolls; otherwise NONE (the government's building, not a second seat) |
| Palace/government complex | me | SEAT | as City hall |
| Courthouse | to; ci Multiple courthouses; me Multiple court buildings | FACE | the magistrate / the chief magistrate |
| Small prison/stocks | to; ci Large prison; me Massive prison | FACE | the gaoler / the prison warden |
| Workhouse | to–me | FACE | the workhouse master |
| Sewage system | ci, me | NONE | works |
| Great library | me | FACE | the librarian |

## Defense (9 families)

| family | rows | verdict | title · reason |
|---|---|---|---|
| Palisade or earthworks | th Palisade; ha, vi; to Town walls; ci City walls and gates; me Massive walls and fortifications | NONE | works |
| Gates (if walled) | to | NONE | works |
| Citizen militia | th Household levy | NONE | every householder; the eldest leads, and the eldest is the seat |
| | ha, vi Citizen militia; to Town watch; ci, me Professional city watch | FACE | the militia captain / the watch captain / the watch commander |
| Village watch | vi | FACE | the watch sergeant |
| Barracks | to; ci Garrison; me Multiple garrisons | FACE | the garrison commander |
| Citadel | to–me | FACE | the castellan |
| Mercenary quarter | to Free company hall | FACE | the company captain · one hall |
| | ci, me Mercenary quarter | NONE | a quarter of companies |
| Veteran's lodge | vi–me | FACE | the lodge master |
| Warden's Lodge | to | FACE | the warden |

## Magic (8 families)

| family | rows | verdict | title · reason |
|---|---|---|---|
| Wizard's tower | ha Traveling hedge wizard | NONE | transient |
| | vi Hedge wizard; to–me Wizard's tower | FACE | the hedge wizard / the wizard |
| Mages' guild | to, ci; me Mages' district | FACE | the guild archmage · the guild stands in its district |
| Academy of magic | me | FACE | the chancellor |
| Enchanter's shop | ci, me | FACE | the enchanter |
| Scroll scribe | to–me | FACE | the scroll scribe |
| Teleportation circle | to–me | FACE | the circle-keeper |
| Healer (divine, 1st level) | vi | FACE | the healer |
| Planar embassy | me | FACE | the envoy |

## Adventuring (5 families)

| family | rows | verdict | title · reason |
|---|---|---|---|
| Adventurers' charter hall | ha–to; ci, me Multiple adventurers' guilds | FACE | the charter master / the senior charter master |
| Hireling hall | to–me | FACE | the hiring master |
| Hired blades | to–me | NONE | freelancers, no company |
| Dungeon delving supply district | ci, me | NONE | a district |
| Sage's quarter | ci, me | NONE | a quarter |

## Criminal (16 families)

| family | rows | verdict | title · reason |
|---|---|---|---|
| Fence (word of mouth) | th Local fence; ha–to | FACE | the fence |
| Outlaw shelter | th | FACE | the outlaw host |
| Bandit affiliate | ha, vi | FACE | the bandit contact |
| Smuggling waypoint | ha, vi; to Smuggling operation; ci, me Smuggling network | FACE | the smuggler / the network's head |
| Multiple criminal factions | to Street gang | FACE | the gang boss · one gang |
| | ci, me Multiple criminal factions | NONE | several gangs, no common head (the criminal power's people come from its organisations) |
| Thieves' guild chapter | ci; me Thieves' guild (powerful) | FACE | the guildmaster of thieves |
| Front businesses | to–me | NONE | several shops, a cover; the gang behind them is another house |
| Underground network | vi–me | FACE | the network's spider · an organisation |
| Underground city | me | NONE | a place |
| Rookery | to–me | NONE | a slum |
| Whisper market | ci, me | NONE | a market |
| Black market | ci; me Black market bazaar | NONE | a market |
| Contract killer | ci, me | FACE | the killer · a person |
| Assassins' guild | me | FACE | the guild's master |
| Kidnapping ring | ci, me | FACE | the ringleader |
| Human trafficking network | ci, me | FACE | the trafficker |

## Entertainment (11 families)

| family | rows | verdict | title · reason |
|---|---|---|---|
| Village musician | vi Village musician | FACE | the musician · a person (weight 0: in no power) |
| | to Traveling performers | NONE | transient |
| Theaters | to, ci; me Multiple theaters | NONE | several houses, no one sent for |
| Opera house | me | FACE | the impresario · one house |
| Bardic college | ci, me | FACE | the college master |
| Gambling den | to; ci Gambling halls; me Gambling district | FACE | the house boss · the biggest house's boss is the one the powers deal with, at every tier |
| Brothel (red light district) | to Brothel; ci, me | FACE | the madam · one house |
| Red light district | ci, me | NONE | a district |
| Fighting pits | to–me | FACE | the pit boss · the pits are run |
| Gladiatorial school | to–me | FACE | the lanista |
| Colosseum/arena | me | FACE | the arena master |
| Charlatan fortune tellers | to–me | NONE | several charlatans, no head |

## Exotic (7 families)

| family | rows | verdict | title · reason |
|---|---|---|---|
| Planar traders | me | NONE | a few traders, no house |
| Dragon resident | me | FACE | the dragon · the most memorable face in the town (weight 0: in no power) |
| Golem workforce | ci, me | FACE | the golem-master · a workforce has an overseer |
| Undead labor | ci, me | FACE | the necromancer-overseer |
| Dream parlors (high magic) | me | NONE | parlours, plural places |
| Airship docking (high magic) | me | FACE | the skydock master · a facility with a master |
| Message network (high magic) | me | FACE | the message-master |

## What changed against PEOPLE-0's table and R-P1

NONE now, FACE before: International trade center, Underground city (the weight-3 rule withdrawn); Charlatan fortune tellers; Inn rows at town and above; Alehouse's Taverns row; Stable district's town-and-above rows; Apothecary district's and Alchemist quarter's city-and-above rows; Theaters; Hired blades; Front businesses; Slave market; Planar traders; Dream parlors; Wayside shrine; Traveling performers; Traveling hedge wizard; Household levy; Mercenary quarter at city and above; Multiple criminal factions at city and above; the village Parish church row (the Priest family carries the person). FACE now, judged before as ground: none. Titles changed: Money changers' rows, Lord's steward's rows, City administration's rows, Caravan rows, Smuggling rows, the senior forms at the city and metropolis rows of several trades. The registry therefore needs the mark PER TIER ROW as well as per family (`at[tier].face` overriding `shared.face`, as `fabric` is declared), and PEOPLE-1 applies this census as its step 1b before step 2's generator draws from the marks.
