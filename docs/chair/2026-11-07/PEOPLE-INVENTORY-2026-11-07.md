# PEOPLE-INVENTORY — the measurement for the people car (PEOPLE-0, 2026-11-07)

Seat: Opus 5.5, child of the cloud chair. Measure-only: no product byte, no register write. Base: master `db832c892` (rung 1 landed). Instruments (committed beside this file, `people-0/`): `faces.mjs` (the proposed face table, 180 families), `measure.mjs` (births each settlement and writes one fact line), `aggregate.mjs` (the per-tier tables). Re-run: `node docs/chair/2026-11-07/people-0/measure.mjs soak <out> 0 1000` / `… golden <out>`, then `node …/aggregate.mjs <out>`.

**Corpora.** SOAK = the soak 1,000 (`soak1k-<i>`, `scripts/audit/soak-review/corpus.mjs :: birth(i)`, density law ON, 167/167/167/167/166/166 per tier); the soak battery itself was also run as briefed (`soak-review.mjs --count 1000 --workers 4`: 1000 settlements, 1676 findings, 0 errors, exit 0) and births the same settlements. GOLDEN = the 525 (`goldenCorpus()`, born exactly as `generatorGoldenMaster.test.js :: hashFor`). ⚠ The golden 525 is born WITHOUT the Register VII marker (v1 path: a golden thorp carries 2 powers and 3 NPCs; a soak thorp 1 and 1–3), so the SOAK figures are the product's figures and lead every table; GOLDEN is shown where it differs in kind. Cells read `min / median / max (μ mean)`.

**The reading of "faction" used throughout (measured, vetoable).** The estate holds two things called factions: (a) the POWERS, `powerStructure.factions` (named, ranked, `isGoverning`, the backing catalogue lands on them); (b) the NPC GROUPING, `settlement.factions` = `[{name, members, dominantCategory}]`, which since GS-2 is a pure projection of (a) by each NPC's single `factionAffiliation` (`src/generators/power/factionGrouping.js`). The density law (Register VII, `src/domain/density/densityBands.js`, signed) rolls each power's named people into three rungs (head / middle / lowest, `densityRungRole`). "Removing factions entirely" is read as: (b) and the per-NPC faction fields go; (a) stays as THE POWERS; each representative belongs to every power its house backs, ranked first / second / third.

## 0. The figures first (SOAK, medians)

| tier | houses (non-fabric) | representatives (faces) | judgment houses | today's NPCs | powers | powers with ≥3 faces | hooks proposed (faces + tension-class + history) / today | relationships proposed (one per card) / today |
|---|---|---|---|---|---|---|---|---|
| thorp | 5 | 2 (μ 1.6; 8 of 167 have 0) | 1 | 1 | 1 | 14/182 (8%) | 8 / 9 | 2 / 0 |
| hamlet | 6 | 2 (μ 2.6; 24 of 167 have 0) | 1 | 3 | 1 | 78/222 (35%) | 10 / 12 | 2 / 2 |
| village | 13 | 9 (μ 8.9) | 1 | 5 | 2 | 206/398 (52%) | 18 / 18 | 9 / 8 |
| town | 29 | 23 (μ 22.7) | 5 | 8 | 4 | 420/641 (66%) | 35 / 25 | 23 / 18 |
| city | 66 | 51 (μ 50.1) | 10 | 14 | 6 | 649/999 (65%) | 66 / 37 | 51 / 36 |
| metropolis | 87 | 68 (μ 67.1) | 15 | 26 | 7 | 811/1192 (68%) | 82 / 46 | 68 / 65 |

Five measured facts the car turns on:

1. **The cast grows 2.6–3.6× above the village** (town 8 → 23, city 14 → 51, metropolis 26 → 68 cards) and shrinks or holds below it (thorp 1 → 2, with 8 thorps and 24 hamlets at ZERO faces). One face per house is the owner's word; the size is its consequence, and the NPC tab, the PDF and the hook count all scale with it.
2. **The seat has no house in half the small places.** A governing house (the Government shelf, crier excluded) is on the roster in 144/167 thorps but only **84/167 hamlets and 70/167 villages** (golden: 48/84, 24/84): the government rows are optional at those tiers. "The seat of government always first" therefore needs a face minted from the governing POWER where no house carries it — the one face not born of a house.
3. **The backing catalogue lands on ONE power per archetype.** A share goes to the leading faction of its archetype (`powerSupport.js :: houseBacksOf`), so the density law's DOUBLED NICHES (city/metropolis `doubledNiches` 1–2: a second military, a second merchant power) get nothing: of the powers at zero faces, **264/313 in cities and 307/381 in metropolises are the second of their archetype**; the rest are `other` powers (Independent Bloc, Revolt Leadership, Creditor's Representative, Reformist Faction…), which no catalogue row backs (96% of the 189 `other` powers have zero faces). That is why ~every city and metropolis has a power at 0 (165/166) while two thirds of all powers clear three.
4. **Hooks today are 54.5% person-linked, 27.6% unlinked, 11.0% historical, 7.0% power-linked** (24,960 hooks on the 1,000). Every NPC carries 1–2 hooks (μ 1.5; ~50% carry two). One per face cuts the person hooks per card and, because the cards multiply, roughly DOUBLES the city and metropolis hook tab (37 → 66, 46 → 82 medians).
5. **Relationships today saturate the cast** (town and up: every NPC is in 2+ ties; 9 kinds). One outgoing per card leaves, on a simulation (PLAUSIBLE: target weighted by house weight, ×3 for a shared power), ~40% of faces named by nobody, ~34% by one, ~26% by two or more (max in-degree 6–8).

## 1. The houses

The catalogue (`src/data/institutionalCatalog.js`) holds **180 families** (the backing catalogue `src/data/institutionBacking.js` resolves every one; the brief's "179" counts its literal rows, one family sharing a key). Under the chair's reading ("a house with a keeper") the proposed verdicts are **144 FACE · 27 JUDGMENT · 9 NO FACE**, and every FABRIC tier row (X-46 car 3: the dwellings, the water source, the walk to another's church or mill) is NO FACE whatever its family says. The table is `people-0/faces.mjs`; every placed name on both corpora resolved (unclassified: none).

Per tier, on the rosters (houses = non-fabric rows; the institution budget `src/data/institutionBudget.js` anchors 5→3 … 60,000→93 count the same rows):

| tier | SOAK houses | SOAK faces | SOAK judgment | SOAK no-face + fabric | GOLDEN houses | GOLDEN faces | GOLDEN judgment |
|---|---|---|---|---|---|---|---|
| thorp | 2 / 5 / 7 | 0 / 2 / 3 (μ 1.6) | 0 / 1 / 2 | 5 / 6 / 8 | 3 / 4 / 4 | 1 / 1 / 2 | 0 / 0 / 1 |
| hamlet | 3 / 6 / 12 | 0 / 2 / 8 (μ 2.6) | 0 / 1 / 2 | 7 / 7 / 8 | 3 / 4 / 7 | 0 / 1 / 4 | 0 / 1 / 1 |
| village | 6 / 13 / 23 | 3 / 9 / 19 (μ 8.9) | 0 / 1 / 4 | 5 / 5 / 6 | 8 / 9 / 10 | 5 / 6 / 7 | 0 / 0 / 1 |
| town | 12 / 29 / 48 | 7 / 23 / 40 (μ 22.7) | 3 / 5 / 9 | 3 / 4 / 5 | 15 / 23 / 42 | 11 / 17 / 33 | 3 / 5 / 8 |
| city | 28 / 66 / 91 | 18 / 51 / 75 (μ 50.1) | 4 / 10 / 16 | 4 / 4 / 5 | 57 / 63 / 70 | 43 / 49 / 55 | 7 / 11 / 12 |
| metropolis | 59 / 87 / 107 | 46 / 68 / 83 (μ 67.1) | 9 / 15 / 21 | 4 / 5 / 5 | 80 / 86 / 89 | 63 / 68 / 71 | 13 / 14 / 15 |

**REPRESENTATIVES PER TIER = the FACE column** (judgment houses would add 1 / 1 / 1 / 5 / 10 / 15 at the medians). A thorp is mostly fabric and commons (farmland, grazing, root cellar, burial ground, palisade): its people are the elder, the levy's captain, perhaps a fence or a shrine-keeper.

**For the chair — the judgment houses** (27 families, by how often they roll on the 1,000): Weekly market 555 · Multiple market squares 499 · City hall 499 · Warehouse district 405 · Fish market 378 · Stable district 312 · Luxury goods quarter 295 · Major annual fairs 290 · Sage's quarter 257 · Furrier's district 239 · Dungeon delving supply district 221 · Charlatan fortune tellers 203 · Fisher's landing 198 · Red light district 168 · Palace/government complex 166 · Docks/port facilities 146 · International trade center 126 · Underground city 89 · Wayside shrine 78 · Teleportation circle 59 · Golem workforce 58 · Rookery 50 · Village musician 45 · Listening post 41 · Undead labor 35 · Message network 35 · Dragon resident 8. Three kinds: (i) a PLACE with an office over it (markets, fairs, docks, districts: a warden exists in the world but the house is the ground); (ii) a BUILDING whose keeper is already another house's face (City hall / Palace beside Mayor and council or the Royal seat: two faces for one government); (iii) a weight-0 house that is nonetheless a person (Village musician, Charlatan fortune tellers, the Dragon resident — the dragon is the most memorable face in the town and backs no power). The proposed default: (i) no face; (ii) a face ONLY where no Government-shelf house is seated — measured, that is 58/167 towns and 7/166 cities, and in every one of them the hall or palace is the only seat house there is; (iii) a face, ranked in no power (weight 0 backs none).

The full family table follows (shelf · family · tiers it exists at · X-45 weight · backing shares, G gov N noble M merchant W military R religious C criminal A arcane K craft · proposed title · rosters carrying it on the soak 1,000).

### FACE

| shelf | family | tiers | weight | backs | proposed title | rosters (soak 1,000) |
|---|---|---|---|---|---|---|
| Economy | Fishmonger | vi | 1 | M | the fishmonger | 10 |
| Economy | Shepherd | th ha vi | 1 | N0.6 M0.4 | the head shepherd | 48 |
| Economy | Dairy farmer | ha vi | 1 | M | the dairy farmer | 43 |
| Economy | Beekeeper | vi | 1 | M | the beekeeper | 8 |
| Economy | Wildfowler | vi | 1 | M | the wildfowler | 6 |
| Economy | Woodcutter's camp | th ha vi | 1 | N0.5 M0.5 | the camp foreman | 42 |
| Economy | Charcoal burner | ha vi to ci me | 1 | K | the collier | 242 |
| Economy | Peat cutter | ha vi | 1 | N | the peat-reeve | 16 |
| Economy | Mine | ha vi to ci me | 2 | N0.5 M0.5 | the mine captain | 160 |
| Economy | Stone quarry | ha vi to ci me | 1 | M | the quarry master | 198 |
| Economy | Salt works | ha vi to ci me | 2 | G0.5 M0.5 | the salt master | 150 |
| Economy | Hunter's lodge | ha vi to | 1 | N0.6 W0.4 | the master of the hunt | 43 |
| Economy | Merchant guilds (3-8) | to ci me | 2 | M | the guild master | 394 |
| Economy | Money changers | to ci me | 1 | M | the banker | 237 |
| Economy | Pawnbroker | ha vi to ci me | 1 | M0.7 C0.3 | the pawnbroker | 188 |
| Economy | Inns and taverns (district) | ha vi to ci me | 2 | M | the innkeeper | 547 |
| Economy | Alehouse | ha vi to | 1 | M | the alewife | 227 |
| Economy | Coaching inn | to ci me | 1 | M | the coaching-inn keeper | 209 |
| Economy | Caravanserai | ha vi to ci me | 2 | M | the caravanserai keeper | 101 |
| Economy | Caravan masters' exchange | vi to ci me | 2 | M0.7 W0.3 | the caravan master | 124 |
| Economy | Carriers' hiring hall | vi to | 1 | K | the carriers' master | 55 |
| Economy | Pack animal trader | ha vi | 1 | M | the horse-coper | 29 |
| Economy | Beast trainers | to ci me | 1 | M | the beast trainer | 252 |
| Economy | Post relay station | to ci me | 1 | G | the postmaster | 149 |
| Economy | River ferry | vi to ci me | 1 | G | the ferryman | 173 |
| Economy | River boatyard | vi to ci me | 1 | K | the boatwright | 135 |
| Economy | Shipyard | to ci me | 2 | K0.5 M0.5 | the master shipwright | 52 |
| Economy | Barge and river transport company | to ci me | 2 | M | the barge master | 44 |
| Economy | Harbour master's office | to ci me | 2 | G | the harbour master | 116 |
| Economy | Toll bridge | vi to ci me | 1 | G | the toll-keeper | 250 |
| Economy | Customs house | to ci me | 2 | G | the customs collector | 285 |
| Economy | Town granary | to ci me | 2 | G | the granary reeve | 499 |
| Economy | Public bathhouse | to ci me | 1 | G | the bath-keeper | 299 |
| Economy | Slave market | to ci me | 2 | M0.7 C0.3 | the slaver | 13 |
| Economy | Slave market district | ci me | 3 | M0.7 C0.3 | the slave-market master | 69 |
| Economy | Auction house | to ci me | 1 | M | the auctioneer | 186 |
| Economy | Assay office | to ci me | 1 | G | the assayer | 43 |
| Economy | Mint (official) | to ci me | 3 | G | the mint master | 208 |
| Economy | Chroniclers' exchange | ci me | 1 | M | the chronicler | 138 |
| Crafts | Mills (2-5) (fabric: Access to external mill) | th ha vi to ci me | 1 | N | the miller | 666 |
| Crafts | Maltster | ha vi | 1 | K | the maltster | 23 |
| Crafts | Blacksmiths (3-10) | ha vi to ci me | 2 | K | the smith | 450 |
| Crafts | Specialized metalworkers | ci me | 2 | K | the master metalworker | 304 |
| Crafts | Jeweller | to | 1 | K | the jeweller | 35 |
| Crafts | Carpenters (5-15) | ha vi to ci me | 1 | K | the carpenter | 414 |
| Crafts | Thatcher | vi | 1 | K | the thatcher | 27 |
| Crafts | Cooper | vi to ci me | 1 | K | the cooper | 333 |
| Crafts | Apothecary district | vi to ci me | 2 | K | the apothecary | 396 |
| Crafts | Bowyers & fletchers (guild) | vi to ci me | 1 | K0.6 W0.4 | the bowyer | 370 |
| Crafts | Sawmill (commercial) | vi to ci me | 1 | K | the sawyer | 310 |
| Crafts | Brewery | vi to ci me | 1 | K | the brewer | 333 |
| Crafts | Vintner | to ci me | 1 | M0.5 N0.5 | the vintner | 244 |
| Crafts | Tanners | vi to ci me | 1 | K | the tanner | 185 |
| Crafts | Tanner (established) | to ci me | 1 | K | the master tanner | 229 |
| Crafts | Fuller | vi to ci me | 1 | K | the fuller | 291 |
| Crafts | Dyer | vi to ci me | 1 | K | the dyer | 293 |
| Crafts | Weavers/Textile workers | to ci me | 2 | K0.6 M0.4 | the master weaver | 371 |
| Crafts | Potter | vi to ci me | 1 | K | the potter | 359 |
| Crafts | Brickmaker | vi to ci me | 1 | K | the brickmaker | 345 |
| Crafts | Cobbler's guild | vi to ci me | 1 | K | the cobbler | 343 |
| Crafts | Tailor's guild | vi to ci me | 1 | K | the tailor | 355 |
| Crafts | Butchers (3-8) | to ci me | 1 | K | the master butcher | 342 |
| Crafts | Bakers (5-15) | to ci me | 1 | K | the master baker | 330 |
| Crafts | Smelter | to ci me | 2 | K | the smelt master | 331 |
| Crafts | Chandler | to ci me | 1 | K | the chandler | 285 |
| Crafts | Glassmakers | to ci me | 1 | K | the glassmaker | 253 |
| Crafts | Ropemaker | to ci me | 1 | K | the ropemaker | 302 |
| Crafts | Midwife | vi to ci me | 1 | R | the midwife | 305 |
| Crafts | Woodcarver | vi to ci me | 1 | K | the woodcarver | 227 |
| Crafts | Village scribe | vi | 1 | G | the scribe | 4 |
| Crafts | Printing house | to ci me | 2 | K0.5 M0.5 | the printer | 78 |
| Crafts | Cartographer's workshop | vi to ci me | 1 | K | the cartographer | 319 |
| Crafts | Craft guilds (5-15) | to ci me | 2 | K | the craft-guild master | 499 |
| Crafts | Alchemist quarter | to ci me | 2 | A | the alchemist | 206 |
| Religious | Access to parish church (fabric: Access to parish church) | th ha vi to ci me | 0 | R | the priest | 666 |
| Religious | Priest (resident) | vi | 1 | R | the priest | 167 |
| Religious | Monastery or friary | to ci me | 2 | R | the abbot | 264 |
| Religious | Cathedral (10,000+ only) | ci me | 3 | R | the bishop | 149 |
| Religious | Small hospital | to ci me | 1 | R | the hospitaller | 240 |
| Religious | Almshouse | to ci me | 1 | R | the almoner | 39 |
| Religious | Foundling home | to ci me | 1 | R | the foundling-mother | 45 |
| Religious | Druid Circle | vi | 2 | R | the archdruid | 9 |
| Religious | Elder Grove Council | to ci me | 2 | R0.6 G0.4 | the grove elder | 156 |
| Government | Informal elder consensus | th ha vi | 2 | G | the eldest | 69 |
| Government | Head-of-household consensus | th | 2 | G | the eldest householder | 40 |
| Government | Lord's reeve | th | 2 | N0.6 G0.4 | the reeve | 13 |
| Government | Household elder | th | 2 | G | the household elder | 57 |
| Government | Lord's steward | ha vi to ci me | 3 | N0.7 G0.3 | the steward | 90 |
| Government | Village headman | ha vi | 2 | G | the headman | 50 |
| Government | City administration | vi to ci me | 3 | G | the chief administrator | 131 |
| Government | Village elder | vi | 2 | G | the village elder | 18 |
| Government | Mayor and council | to ci me | 3 | G | the mayor | 51 |
| Government | Guild consortium | to ci me | 3 | K0.5 G0.5 | the consortium speaker | 77 |
| Government | Merchant oligarchy | to ci me | 3 | M0.6 G0.4 | the first magnate | 57 |
| Government | City-state government | ci me | 3 | G | the doge | 29 |
| Government | Democratic assembly | ci me | 3 | G | the speaker of the assembly | 23 |
| Government | Royal seat | ci me | 3 | G0.6 N0.4 | the monarch | 27 |
| Government | Town crier | to ci me | 1 | G | the crier | 204 |
| Infrastructure | Courthouse | to ci me | 2 | G | the magistrate | 407 |
| Infrastructure | Small prison/stocks | to ci me | 1 | G0.6 W0.4 | the gaoler | 293 |
| Infrastructure | Workhouse | to ci me | 1 | G | the workhouse master | 176 |
| Infrastructure | Great library | me | 3 | A0.4 R0.3 G0.3 | the librarian | 149 |
| Defense | Citizen militia | th ha vi to ci me | 1 | G0.7 W0.3 | the captain of the watch | 683 |
| Defense | Village watch | vi | 1 | G0.6 W0.4 | the watch sergeant | 14 |
| Defense | Barracks | to ci me | 2 | W | the garrison commander | 372 |
| Defense | Citadel | to ci me | 3 | W0.6 G0.4 | the castellan | 257 |
| Defense | Mercenary quarter | to ci me | 2 | W0.5 M0.5 | the company captain | 251 |
| Defense | Veteran's lodge | vi to ci me | 1 | W | the lodge master | 205 |
| Defense | Warden's Lodge | to | 1 | W0.5 N0.5 | the warden | 13 |
| Magic | Wizard's tower | ha vi to ci me | 2 | A | the wizard | 15 |
| Magic | Mages' guild | to ci me | 3 | A | the guild archmage | 71 |
| Magic | Academy of magic | me | 3 | A | the chancellor | 35 |
| Magic | Enchanter's shop | ci me | 1 | A | the enchanter | 59 |
| Magic | Scroll scribe | to ci me | 1 | A | the scroll scribe | 67 |
| Magic | Healer (divine, 1st level) | vi | 1 | R | the healer | 5 |
| Magic | Planar embassy | me | 3 | G0.5 A0.5 | the envoy | 25 |
| Adventuring | Adventurers' charter hall | ha vi to ci me | 1 | W0.5 G0.5 | the charter master | 401 |
| Adventuring | Hireling hall | to ci me | 1 | M | the hiring master | 54 |
| Adventuring | Hired blades | to ci me | 1 | W0.6 C0.4 | the blade captain | 139 |
| Criminal | Fence (word of mouth) | th ha vi to | 1 | C | the fence | 39 |
| Criminal | Outlaw shelter | th | 1 | C | the outlaw host | 7 |
| Criminal | Bandit affiliate | ha vi | 1 | C | the bandit contact | 7 |
| Criminal | Smuggling waypoint | ha vi to ci me | 1 | C | the smuggler | 248 |
| Criminal | Multiple criminal factions | to ci me | 2 | C | the gang boss | 177 |
| Criminal | Thieves' guild chapter | ci me | 3 | C | the guildmaster of thieves | 101 |
| Criminal | Front businesses | to ci me | 1 | C0.7 M0.3 | the front man | 264 |
| Criminal | Underground network | vi to ci me | 2 | C | the network's spider | 118 |
| Criminal | Whisper market | ci me | 2 | C | the whisper broker | 152 |
| Criminal | Black market | ci me | 2 | C | the black marketeer | 169 |
| Criminal | Contract killer | ci me | 1 | C | the killer | 67 |
| Criminal | Assassins' guild | me | 3 | C | the guild's master | 80 |
| Criminal | Kidnapping ring | ci me | 1 | C | the ringleader | 7 |
| Criminal | Human trafficking network | ci me | 2 | C | the trafficker | 8 |
| Entertainment | Theaters | to ci me | 1 | M0.5 N0.5 | the theatre manager | 252 |
| Entertainment | Opera house | me | 3 | N0.6 M0.4 | the impresario | 109 |
| Entertainment | Bardic college | ci me | 2 | N0.6 A0.4 | the college master | 211 |
| Entertainment | Gambling den | to ci me | 1 | C0.6 M0.4 | the house boss | 271 |
| Entertainment | Brothel (red light district) | to ci me | 2 | C0.6 M0.4 | the madam | 151 |
| Entertainment | Fighting pits | to ci me | 1 | C0.5 M0.5 | the pit boss | 102 |
| Entertainment | Gladiatorial school | to ci me | 2 | W0.6 N0.4 | the lanista | 156 |
| Entertainment | Colosseum/arena | me | 3 | G0.6 N0.4 | the arena master | 130 |
| Exotic | Planar traders | me | 2 | M0.6 A0.4 | the planar factor | 26 |
| Exotic | Dream parlors (high magic) | me | 1 | A | the dream-keeper | 35 |
| Exotic | Airship docking (high magic) | me | 3 | M0.6 G0.4 | the skydock master | 32 |

### JUDGMENT

| shelf | family | tiers | weight | backs | proposed title | rosters (soak 1,000) |
|---|---|---|---|---|---|---|
| Economy | Fisher's landing | th ha vi | 1 | M | the boat-headman | 198 |
| Economy | Fish market | vi to ci me | 1 | M | the fish-market warden | 378 |
| Economy | Furrier's district | ci me | 1 | M | the furriers' warden | 239 |
| Economy | Weekly market | ha vi to ci me | 1 | M | the market warden | 555 |
| Economy | Multiple market squares | to ci me | 2 | M | the clerk of the markets | 499 |
| Economy | Major annual fairs | to ci me | 2 | M | the fair warden | 290 |
| Economy | International trade center | me | 3 | M | the exchange master | 126 |
| Economy | Stable district | ha vi to ci me | 1 | M | the stable master | 312 |
| Economy | Docks/port facilities | to ci me | 2 | M0.6 G0.4 | the wharfinger | 146 |
| Economy | Warehouse district | to ci me | 2 | M | the warehouse factor | 405 |
| Economy | Listening post | to ci me | 1 | C0.5 G0.5 | the watcher | 41 |
| Crafts | Luxury goods quarter | ci me | 2 | M | the luxury-trade warden | 295 |
| Religious | Wayside shrine | th ha vi | 1 | R | the shrine-keeper | 78 |
| Infrastructure | City hall | to ci me | 3 | G | the town clerk | 499 |
| Infrastructure | Palace/government complex | me | 3 | G0.7 N0.3 | the chamberlain | 166 |
| Magic | Teleportation circle | to ci me | 2 | A0.6 G0.4 | the circle-keeper | 59 |
| Adventuring | Dungeon delving supply district | ci me | 1 | M | the outfitter | 221 |
| Adventuring | Sage's quarter | ci me | 2 | A0.6 R0.4 | the sage | 257 |
| Criminal | Underground city | me | 3 | C | the undercity boss | 89 |
| Criminal | Rookery | to ci me | 2 | C | the rookery boss | 50 |
| Entertainment | Village musician | vi to | 0 | G | the musician | 45 |
| Entertainment | Red light district | ci me | 2 | C0.6 M0.4 | the district madam | 168 |
| Entertainment | Charlatan fortune tellers | to ci me | 0 | C | the fortune teller | 203 |
| Exotic | Dragon resident | me | 0 | G | the dragon | 8 |
| Exotic | Golem workforce | ci me | 2 | A | the golem-master | 58 |
| Exotic | Undead labor | ci me | 2 | A | the necromancer-overseer | 35 |
| Exotic | Message network (high magic) | me | 2 | G0.6 A0.4 | the message-master | 35 |

### NO FACE

| shelf | family | tiers | weight | backs | proposed title | rosters (soak 1,000) |
|---|---|---|---|---|---|---|
| Economy | Subsistence farming | th ha vi | 1 | N0.6 G0.4 | — | 0 |
| Economy | Common grazing land | ha vi | 1 | N0.5 G0.5 | — | 0 |
| Economy | Communal root cellar | th | 1 | G | — | 0 |
| Religious | Burial ground | th ha vi to ci me | 1 | R | — | 0 |
| Infrastructure | Dwellings (1-8) (fabric: Dwellings (1-8), Dwellings (5-25), Dwellings (15-100), Housing (75-650 households), Housing (500-4000 households), Housing (3500+ households)) | th ha vi to ci me | 0 | G | — | 0 |
| Infrastructure | Water source (fabric: Water source, Multiple water sources) | th ha vi to ci me | 0 | G | — | 0 |
| Infrastructure | Sewage system | ci me | 1 | G | — | 0 |
| Defense | Palisade or earthworks | th ha vi to ci me | 1 | G0.6 W0.4 | — | 0 |
| Defense | Gates (if walled) | to | 1 | G0.5 W0.5 | — | 0 |

## 2. The powers

**What they are today (SOAK, 4,634 powers on 1,000 towns).** Archetype (`domain/factionArchetypes.js :: factionArchetype`) · count · faces landing on it through the backing catalogue (min / median / max) · share with ≥3 · share at 0 · times governing:

| archetype | powers | faces | ≥3 | at 0 | governing |
|---|---|---|---|---|---|
| merchant | 837 | 0 / 16 / 62 | 79% | 19% | 172 |
| military | 659 | 0 / 4 / 62 | 56% | 33% | 37 |
| government | 658 | 0 / 3 / 67 | 57% | 12% | 610 |
| religious | 637 | 0 / 2 / 59 | 50% | 20% | 83 |
| noble | 283 | 0 / 3 / 29 | 58% | 27% | 15 |
| criminal | 264 | 0 / 7 / 55 | 76% | 18% | 45 |
| other | 189 | 0 / 0 / 21 | 4% | 96% | 8 |
| arcane | 107 | 0 / 6 / 59 | 79% | 17% | 30 |

Names (most frequent): government — Elder Council 176, Headman's Authority 98, Household Council 93, Feudal Stewardship 45, City-State Council 29, Royal Authority 27; military — Military/Guard 363, War Council 72, Occupation Authority 48, The Shield Compact 33; religious — Religious Authorities 445, Priestly Guidance 41, The Clergy Alliance 30; criminal — Thieves' Guild 175, Corrupt Council 23, The Black Circle 18; merchant — Merchant Guilds 296, Craft Guilds 165 (the `craft` share lands here), Grain Holders 51, Merchant oligarchy 39; noble — Noble Houses 88, Noble Families 60, The Highborn Circle 36; other — The Independent Bloc 60, Revolt Leadership 24, Creditor's Representative 23, Reformist Faction 19, Investigation Faction 16; arcane — Arcane Orders 61, Arcane Council 25.

Powers per tier (Register VII `factions` band 1–1 / 1–2 / 2–3 / 3–5 / 5–8 / 7–10, measured medians 1 / 1 / 2 / 4 / 6 / 7). The governing power is `government` in 155/167 thorps, 157 hamlets, 148 villages, but only 9/167 towns (towns are governed by merchant 59, religious 21, criminal 23, military 19, noble 15, arcane 13, other 8); the X-45 rule sends the government share to the seat whatever its tag, so the seat is always backed.

**How the backing table maps houses to powers.** Each house's shares (summing to one) land on the LEADING power of each archetype; a lapsed share goes to the row's fallback or nowhere; a house with nothing landed answers to the seat at no weight. Measured on SOAK: faces backing two or more powers μ 0.0 / 0.1 / 0.5 / 3.0 / 8.0 / 13.6 per town (thorp → metropolis; max 22); faces on the default (no share landed) μ 0.1 / 0.4 / 2.1 / 2.3 / 4.5 / 5.8.

**Faces per power, per tier, and the shortfalls:**

| tier | powers with ≥3 faces | towns with any power <3 | towns with a power at 0 | of the powers at 0: `other` · 2nd of its archetype · sole of its archetype | governing power <3 |
|---|---|---|---|---|---|
| thorp | 14/182 (8%) | 154/167 | 23 | 1 · 2 · 20 | 153/167 |
| hamlet | 78/222 (35%) | 127/167 | 62 | 11 · 4 · 48 | 93/167 |
| village | 206/398 (52%) | 146/167 | 47 | 19 · 10 · 20 (17 military) | 15/167 |
| town | 420/641 (66%) | 138/167 | 70 | 36 · 26 · 13 | 0 |
| city | 649/999 (65%) | 165/166 | 165 | 45 · 264 · 4 | 0 |
| metropolis | 811/1192 (68%) | 165/166 | 165 | 69 · 307 · 5 | 0 |

Counting the judgment houses as faces changes little (thorp 47/182, hamlet 92/222, village 224/398, town 421/641, city 658/999, metropolis 811/1192): the gap is structural, not a few houses short.

**The proposed weighted roll with its floor.** Membership: a face belongs to every power its house has a landed share in (the X-45 arithmetic, unchanged: no double counting, because ranking is per power and the share is the house's loyalty). Within each power the first / second / third most influential are drawn by a weighted roll without replacement, weight = landed share × house weight (0.5 for a weight-0 house), with three floors:
- **Floor 1 — the seat first.** The governing power's first is the seat's face: the Government-shelf house (the highest-weight one where two roll, e.g. Lord's steward beside Village headman). Measured, the roster carries NO Government-shelf house in 23/167 thorps, **83/167 hamlets, 97/167 villages**, 58/167 towns, 7/166 cities, 0 metropolises. Every one of the 65 towns and cities without one carries a City hall or Palace (a judgment house), so above the village the hall IS the seat's house when nothing else is; below it there is no seat house at all and the seat's face must be minted from the governing power under its own title ("the headman", "the eldest") — the one representative born of a power rather than a house. With that mint the governing powers under three faces fall from 153 → 147 thorps, 93 → 80 hamlets, 15 → 8 villages (0 at town and up either way): the small places are short of PEOPLE, not of seats.
- **Floor 2 — the power's own landmark second** (non-governing powers: first): the highest-weight house whose LARGEST share is the power's archetype. At town and up the governing power's top face is weight 2–3 in every town (town w2:103 w3:64; city and metropolis w3 in all 332), so the floor binds only below the town.
- **Floor 3 — none.** The third is the roll's; a power with fewer than three faces shows the ones it has ("up to three").

**Fewer than three, and what then (the chair's ruling).** Below the town most powers cannot hold three people (thorp 8%, hamlet 35%, village 52% clear it), and above it ~a third of powers are empty for two causes the catalogue cannot fix by more houses: (a) **doubled niches** — rule either that a doubled archetype SPLITS its archetype's landed shares between its two claimants by their power figure (no double count; the second military power gets the barracks, the first keeps the citadel), or that the doubled claimant takes no representative and shows its top three borrowed from the first; (b) **`other` powers** (stress-born: Revolt Leadership, Creditor's Representative, Investigation Faction…) — rule either that each mints its own single face from the stressor (the creditor's representative IS a person), or that they recruit from the default-share faces (μ 2–6 per town above the village). Proposed: split for (a), mint for (b), "up to three" everywhere.


## 3. Hooks by source and party

The collector is `src/domain/dossier/plotHooks.js :: collectPlotHooks` (its own classes: `npc`, `faction` [one drawn line per conflict, `hookLines.js`], `tension` [current tensions; plus the crisis hooks `crisisHooks.js` and the traditions, which ride `tension` and are split out below], `economics`, `safety`, `history`). There is no "outlook" class in the collector. Measured per settlement on SOAK (after the truth gate and dedupe, exactly what the tab shows):

| tier | total | npc | crisis | tension | faction (conflicts) | history | economics | safety |
|---|---|---|---|---|---|---|---|---|
| thorp | 4 / 9 / 17 | 0 / 2 / 4 | 0 / 1 / 4 | 1 / 3 / 6 | 0 / 0 / 1 | 0 / 2 / 6 | 0 / 0 / 3 | 0 |
| hamlet | 6 / 12 / 22 | 2 / 4 / 8 | 0 / 1 / 6 | 1 / 3 / 6 | 0 / 0 / 2 | 0 / 2 / 8 | 0 / 1 / 3 | 0 / 0 / 1 |
| village | 9 / 18 / 27 | 4 / 7 / 14 | 0 / 1 / 4 | 1 / 6 / 9 | 0 / 1 / 4 | 0 / 2 / 8 | 0 / 1 / 3 | 0 |
| town | 14 / 25 / 39 | 6 / 12 / 20 | 0 / 2 / 4 | 1 / 6 / 9 | 0 / 2 / 4 | 0 / 3 / 7 | 0 / 1 / 3 | 0 / 0 / 4 |
| city | 27 / 37 / 49 | 13 / 20 / 28 | 0 / 2 / 4 | 3 / 7 / 9 | 0 / 2 / 4 | 0 / 3 / 7 | 0 / 1 / 4 | 0 / 1 / 4 |
| metropolis | 32 / 46 / 67 | 16 / 29 / 46 | 0 / 2 / 4 | 3 / 9 / 9 | 0 / 2 / 4 | 0 / 3 / 7 | 0 / 1 / 4 | 0 / 1 / 4 |

(No tradition hooks fired on the 1,000: the traditions mirror is dark at birth.) **By party kind** (the hook's links), 24,960 hooks: an individual (`npc` link) 13,594 (54.5%) · none 6,889 (27.6%: tensions, economics, safety, unlinked crisis lines) · a historical event 2,741 (11.0%) · a power (`faction` link) 1,736 (7.0%). Today every NPC carries 1–2 hooks (μ 1.5; 4,717 of 9,573 NPCs carry two).

**Under the owner's rule** (one per representative + the tension-class + the history hooks; the tension class here = tension + crisis + traditions + the conflict line, which is a power-vs-power tension):

| tier | faces (1 each) | tension-class | history | proposed | today | GOLDEN proposed / today |
|---|---|---|---|---|---|---|
| thorp | 0 / 2 / 3 | 1 / 4 / 9 | 0 / 2 / 6 | 4 / 8 / 15 (μ 8.5) | 9 (μ 9.7) | 6 / 9 |
| hamlet | 0 / 2 / 8 | 1 / 5 / 10 | 0 / 2 / 8 | 3 / 10 / 20 (μ 10.5) | 12 (μ 12.7) | 5 / 10 |
| village | 3 / 9 / 19 | 3 / 7 / 14 | 0 / 2 / 8 | 8 / 18 / 29 (μ 18.3) | 18 (μ 18.0) | 13 / 16 |
| town | 7 / 23 / 40 | 3 / 9 / 13 | 0 / 3 / 7 | 12 / 35 / 54 (μ 34.7) | 25 (μ 25.7) | 25 / 23 |
| city | 18 / 51 / 75 | 7 / 12 / 17 | 0 / 3 / 7 | 32 / 66 / 91 (μ 64.8) | 37 (μ 37.3) | 61 / 32 |
| metropolis | 46 / 68 / 83 | 7 / 12 / 17 | 0 / 3 / 7 | 58 / 82 / 98 (μ 82.1) | 46 (μ 46.4) | 82 / 46 |

**The pools.** KEPT: the tension hooks (`history.currentTensions[].plotHooks`, `historyData.js`), the history hooks (`historicalEvents[].plotHooks`), the crisis hooks (`crisisHooks.js`, already one per cast role and re-derived from the cast), the traditions hooks. RE-HOMED: the NPC hook pool (`npcGenerator.js`, keyed today by the NPC's role and category) → keyed by the face's INSTITUTION and title, one drawn per card; the conflict line (`hookLines.js`, already one per conflict, naming two powers) → a tension hook between powers (the owner's "between powers, groups"). FOR THE CHAIR (not named in the owner's three sources): the economics hooks (`economicViability.plotHooks`, μ 0.6–1.4) and the safety hooks (`safetyProfile.plotHooks`, μ 0–1.1) — retire, or fold into the tension class as "tensions of the place". Proposed: fold (they are tensions; retiring them removes the only food-gap and crime hooks). RETIRED: the second NPC hook (μ 0.5 per card today) and the `relationship` hook category (already unemitted since X-2).

## 4. Relationships

Today (`npcGenerator.js` 701–722, 1590–1660; archetypes `power/relationshipArchetypes.js`; prose `power/settlementNarrative.js`), SOAK: ties per town 0 / 0 / 1 (thorp), 1 / 2 / 6, 4 / 8 / 18, 9 / 18 / 33, 26 / 36 / 48, 41 / 65 / 80 (metropolis). From the village up every NPC sits in 2+ ties (village 858/872, town 1430/1431, city and metropolis all). Kinds (21,530 ties): political 17.3% · rival 17.2% · ally 16.1% · debtor_creditor 16.0% (the "leverage" kind) · mentor_student 12.2% · respect 10.6% · enemy 5.1% · family 3.9% · patron_client 1.6%. Pairs by NPC category: government~government 3,026 · government~military 2,031 · government~religious 1,901 · economy~government 1,768 · other~other 1,721 · economy~economy 1,202 · criminal~economy 1,158. Ties are undirected pairs today (`npc1Id`/`npc2Id`); no card "owns" a tie.

**Under the owner's rule** (one OUTGOING tie per card; a card may be NAMED by many): ties = the faces that have a peer (thorp 0 / 2 / 3 … metropolis 46 / 68 / 83 — about today's count from the town up, more below it). In-degree that falls out — a simulation, PLAUSIBLE until the car chooses its target rule (target weighted by house weight, ×3 when the two share a power):

| tier | named by nobody | named by exactly one | named by two or more | max |
|---|---|---|---|---|
| thorp | 30% | 65% | 4% | 2 |
| hamlet | 33% | 46% | 21% | 4 |
| village | 38% | 34% | 27% | 6 |
| town | 40% | 34% | 26% | 7 |
| city | 40% | 34% | 26% | 8 |
| metropolis | 41% | 33% | 26% | 8 |

So about a quarter of the cast is "called by two or more" and becomes a hub of multiple relationships; ~40% are named by nobody (their only tie is their own outgoing one). Pool coverage: the nine kinds cover every relationship the owner named (allies, rivals, enemies, leverage = debtor_creditor/patron_client); the archetype table is keyed on the pair's categories and power, which a face carries (its institution's shelf → category), so the pools survive; what changes is that the writer draws ONE tie per source card instead of a pair saturation.


## 5. Every surface the faction object feeds at birth

(b) = the grouping `settlement.factions`; (c) = the per-NPC fields `factionAffiliation`, `secondaryAffiliation`, `linkedFactionIds`, `factionGoal`, `densityRungRole`, `structuralRank`. NEW = the powers + each face's ranked memberships `[{power, rank}]` + its institution. Mapped by a read-only sweep and spot-checked (crisis `membersOf`, NPC card line, Power-tab member count, the absent save migration: all CONFIRMED by reading the lines). Counts: ~62 non-test src files touch (b) (~24 simulation, ~38 birth/display/edit — most of the 38 only FALL BACK to (b) after `powerStructure.factions`); ~58 touch (c) directly plus ~6 through `npcInFaction` / `factionRosterOf` / `npcHomeInstitution` (~21 simulation, ~37 birth/display/edit); 153 test files read (b) or (c).

| surface | writer / reader (file:line) | reads from (b)/(c) today | would read instead |
|---|---|---|---|
| The grouping itself | `power/factionGrouping.js:28`; written `steps/assembleSettlement.js:347`, `generateSettlementPipeline.js:449,579`; `narrativeGenerator.js:929 relinkFactionMembers` | builds (b) from `factionAffiliation` | deleted |
| NPC affiliation writers | `npcGenerator.js:1125` (affiliation), `:1269` + `steps/corruptionPass.js:74` (secondary), `:1285` (`factionGoal`) | W (c) | W memberships from the house's landed shares; `factionGoal` is shown on NO card today (veiled, renamed, never rendered) — retire |
| Structural standing | `npcStructure.js:38–48, 397, 440` | `factionAffiliation` → W `structuralRank`, `goal.short`, `structuralPosition` | the first-rank power's standing |
| Density law roster + rungs | `density/applyDensityLaw.js:490–528`; `densityRungs.js:92`; `titularSuccession.js:189–243` (imported by `successionGrammar.js`) | W `factionAffiliation`, `densityRungRole` | superseded by one face per house + first/second/third (Register VII's `mass` band — signed — is replaced by the house count) |
| Legacy office NPCs | `factionRoles.js:252–345` (pre-law worlds only) | W/R (c), (b) fallback | retired with the grouping |
| **Crisis cast** (instigator, brunt, defender, treater, waverer, face) | `crisis/crisisCast.js:400–406 membersOf` (used 514, 524, 623, 703, 728, 764, 778); exploiter 665, scapegoat 684, collaborator 746, brunt→instigator 879 | `npc.factionAffiliation === power` | faces holding a membership in the power, by rank |
| Crisis cast — lever | `crisisCast.js:535–590` | none (role regex + institutions) | the lever house's FACE becomes the holder (cleaner than today's regex) |
| Crisis cast — seat rows / ruling chain | `dossier/seatHolder.js:104` → `worldPulse/npcLadderFactionMembership.js:53 npcInFaction` | (c) | governing power's rank 1 (⚠ `npcInFaction` is SHARED with the simulation) |
| Crisis hooks ("X of House") | `crisis/crisisHooks.js:98–103` | `factionAffiliation` | first-rank power |
| Cast temp NPC / findings | `steps/resolveCrisisCast.js:83`; `coherence/crisisCastFindings.js:61` | (c) | memberships |
| **Tonight sheet** | `summary/tonightSheet.js:192, 274–293` | none directly; inherits the cast, the ruling chain, the hooks, `goal.short` | inherits |
| **Legitimacy model + label** | `factionDynamics.js:128, 525`; `power/rulingStructure.js:745`; `PowerTab.jsx:191, 258` | **none** (powers + economy) | unchanged |
| **Power tab** — POWER DISTRIBUTION / THE POWERS | `dossier/powerStrata.js:104` | none (powers) | unchanged |
| Power tab — FACTIONS member count | `components/new/tabs/power/PowerStrata.jsx:298` | `factionAffiliation === power` | faces with a membership (+ the top three named) |
| Governing house's note / faction notes / GM advisory | `powerStrata.js:441`; `factionDynamics.js:319, 400, 543` | none (`crisisNote`, `dmNote` on powers) | unchanged |
| **NPC cards** | `npcComponents.jsx:85` (search), `:337` (the faction line); `NPCsTab.jsx:65–80` (grouping) | `factionAffiliation` | "first of X · second of Y" + the institution; group by first-rank power |
| NPC profile / AI grounding | `npcProfile.js:558, 572`; `ai/personaSlicer.js:151`; `ai/suggestedQuestions.js:40`; `factionProfile.js:350` | (c); (b) fallback | memberships; powers |
| **Plot hooks** | `dossier/plotHooks.js:407` (NPC sub-line), `:417–436` (conflict parties) ← `power/conflicts.js:63–96, 274` (pairs from (b) members) | (c); (b) | first-rank power; conflicts paired over powers |
| Relationships | `npcGenerator.js:701, 1590`; `relationshipArchetypes.js`; `settlementNarrative.js` | **none** | unchanged (optional: weight by shared power) |
| Dossier search / entity web / links / view model | `dossierSearch.js:276, 328`; `realmEntityWeb.js:234`; `entityLinks.js:408`; `display/dossierViewModel.js:510`; `tableLedger.js:308`; `state/deriveSystemState.js:199`; `normalizeSettlement.js:103` | (c); (b) fallback | memberships; powers |
| Gallery veil / public-safe projection | `display/galleryVeil.js:147–178, 723`; `display/publicSafe.js:55, 124, 159, 222` | (b) members; all (c) fields | veil the memberships + institution |
| **PDF** | `pdf/lib/viewModel.js:249, 724–734` → `sections/NotableNPCs.jsx:143, 357`, `NPCQuickRef.jsx:40`; power lists `viewModel.js:201, 397, 454, 750, 840`, `viewModelBodySlices.js:156` | (c); (b) fallback | memberships by rank; powers |
| **Foundry** | `foundry/journalPages.js:163, 179, 187, 227` | through the PDF view model + cast | inherits |
| Generation receipt / coherence | `generationReceiptJudgments.js:155–195`; `generationCoherence.js:70`; `recordBatteryFindings.js:78`; `coherence/readerBattery.js:320`; `coherence/hookTruthRecord.js:51`; `coherence/seatHolderFindings.js:53` | (c) ∈ powers; (b) identity, members, conflict parties | each membership ∈ powers; one face per face-bearing house; drop (b) checks |
| Neighbours / instant world | `neighbourGenerator.js:186`; `relationships/neighbourBackLink.js:200`; `crossSettlementConflicts.js:171`; `lib/instantWorld/factionDedup.js:202` | (b) fallback / rewrite | powers; delete |
| **DM edit layer** | `factionRename.js:227–260, 738, 913, 1125`; `institutionRename.js:116, 222, 237`; `store/settlementPendingEditWriters.js:35` (SEAT_FIELDS); `pendingEditIntents.js:81`; `edit/mergeConsequence.js:80`; `edit/recordRegister.js:16, 49, 169, 212` (`factions` HELD, `npcs` keyed `id`, relationships keyed `npc1Id,npc2Id,type`); `npc/npcOps.js:72`; `entities/npcs.js:51–301`; `entities/successors.js:58`; `factionRefs.js:95`; `customContent.js:64, 388`; `opVocabulary.js:182` | (c) as seat fields; (b) members as a second rename home | membership refs + institution ref; the (b) paths removed from the register |
| UI odds and ends | `OutputContainer.jsx:561`; `LibraryToolbar.jsx:105`; `SettlementDetailEditNames.jsx:32`; `SettlementWorkbench.jsx:109`; `EventComposer.jsx:213`; `CascadePreviewPanel.jsx:288` | (b) length/names; (c) | powers; memberships |
| Schema / saves | `settlement.schema.js:311, 468–484, 982`; `settlementMigrations.js:41–57` (only a v0→v1 stamp); `lib/saves.js:388` | declares (b), (c) | declare memberships + institution rep; **a real migration step is owed: none exists** |
| The census annex (rung-2 branch, `RECEIPT_POOLS_DOSSIER_STATE.md` + `_CAUSAL_DOSSIER.md`) | 37 of 171 blocks carry `{faction}` (135 uses) or `{govFaction}` (4) | the slots name a POWER (`powerStructure.factions[].faction`); NO block reads NPC grouping membership (the one `members[]` key is DS-POW-7's `worldState` blocs: simulation) | unchanged: the annex is inherited whole |

**FPZ's, untouched (the simulation).** `worldPulse/`: `npcLadderFactionMembership.js` (`npcInFaction` — shared with the birth seat rows above: the car changes its INPUT, FPZ owns it), `npcLadderState.js`, `npcLadderKernel.js`, `npcVerdictApply.js`, `npcVerdictTable.js`, `npcLedger.js`, `npcCirculationTable.js`, `npcAgency.js`, `houseLedger.js`, `factionDensityKernel.js`, `successorNpc.js`, `causeLifecycle.js`, `oathHolder.js`, `religionLegitimacy.js`, `warSeatBooks.js`, `assizeKernel.js`, `corruptionImpair.js`, `causeVocabulary.js`, and (b) fallbacks in `warRulingsNews.js`, `warPoliticalLoop.js`, `settlementPolitics.js`, `supplyKernel.js`, `beliefMap.js`, `brokeragePatronage.js`, `factionCompetition.js`, `thievesGuild.js`, `factionCapture.js` (capture events); `domain/corruption.js:648`; `density/factionLifecycle.js:113`; `generators/density/densityAscension.js`; `domain/events/` (`mutateEntities.js`, `mutateHelpers.js`, `undoEvent.js`, `registry.js`, `affordanceManifest.js`, `batch.js`, `factionResponses.js`); `entities/propagate.js:320–483`; `store/settlementSlice.js:1469`. The pulse record and the advance loop read (b)/(c) only through these.

## 6. What moves

Golden surfaces (each through its own door, `tests/helpers/goldenRecordDoor.js`):
- **The generator master 525** (`tests/fixtures/generator-golden-master.json`): every row — the NPC roster's size, ids, fields and the draw stream after it all move.
- **The fence 360** and **the witness** (`preset-lighting-witness-golden.json`): every row that carries NPCs, ties or hooks — all of them.
- **The composed-prose manifest** (`dossier-prose-manifest-golden.json`): every sentence that names an NPC, a tie or a hook; the `{faction}` power sentences hold where the powers hold.
- **The soak records** (rung 1's signed thousand-settlement window, `scripts/audit/soak-review` aggregates): NPC, hook and tie distributions move by design (cards ×2.6–3.6 above the village; hooks ~×1.8 at city/metropolis).
- The dormancy goldens that hash a whole settlement (belief, corruption-web, contested-goals …) move wherever they hash the roster.

Registers: the **observed-shape register** (the NPC shape gains memberships + institution, loses six fields; `settlement.factions` leaves); **writer reach** (new writer: the representative generator; retired: `factionGrouping`, `relinkFactionMembers`, the affiliation writers); the **wiring census** (`proseWiringCensus.walker`: the NPC-hook and conflict-line pools re-keyed); the **fork census** (new keyed forks for the face roll and the one-tie draw; the density seams' forks retire); the **lighting census** (`.lighting-census-baseline.json`: `factionGoal`/rung readers dark → removed); the **tuning register** (`.tuning-register.json`: the `<tier>.factions.min/max` rows stay, the `mass` rows and `faction_head` are superseded by the house count — Register VII is SIGNED, so that line is the owner's); `recordRegister.js` HELD/MIRROR declarations for `factions[].members[]`; `heldKeyWriterCensus`.

## 7. THE CAR PLAN

Seven lanes, in order; each lands on its own proof, the goldens move ONCE at the end (one signed shift, one door, per §3 rule 7).

| # | lane | depends on | what it proves |
|---|---|---|---|
| P1 | **The catalogue flags and titles** — `faces.mjs` promoted into the registry as a registry-only mark (`face: 'the miller'`, never on a row or a save, like `fabric`/`rare`); the chair's 27 judgments applied | the chair's rulings below | walker: every family resolves to face / no-face; every fabric row is no-face; every face carries a title; no product output moves (dark) |
| P2 | **The representative generator** — one face per face-bearing house (+ the minted seat face where no seat house rolls), drawn in roster order on its own keyed fork; personality/goal/secret pools keyed by title and shelf | P1 | one NPC per face house, zero duplicates, ids stable across regen; the seat always faced; card counts per tier inside the measured envelope above |
| P3 | **The powers from the backing table** — memberships from `houseBacksOf`'s landed shares; the first/second/third weighted roll with floor 1 (seat) and floor 2 (landmark); the doubled-niche split and the `other`-power mint as ruled | P2 | every membership ∈ powers; the shares never double count (sum per house ≤ 1); powers at zero faces fall from the measured 165/166 cities to the ruled residue |
| P4 | **The crisis cast and Tonight re-derived** — `membersOf` and the seat rows read memberships; the lever reads the lever house's face | P3 | the cast receipt findings stay at their pins on the 1,000; every cast role names a face; Tonight byte-moves only by name |
| P5 | **The hooks** — one hook per face from the re-keyed pool; tension + history + crisis + traditions kept; the conflict line as a power-vs-power tension; economics/safety as ruled | P2 | one person hook per card exactly; the truth gate and the dedupe unchanged; per-tier totals inside §3's proposed envelope |
| P6 | **The relationships** — one outgoing tie per card, target rule as ruled; ties become directed (`from`, `to`); the Relationships tab lists a card's own tie and the ties naming it | P3 | out-degree exactly 1 (0 for a lone face); kinds' coverage; in-degree distribution reported |
| P7 | **The surfaces' re-wiring + the records** — the §5 table (card line, NPC tab grouping, Power tab member count, PDF, Foundry, search, veil, receipts, the edit layer's rename/seat fields, the schema) ; **the save migration** (`factionAffiliation`/`secondaryAffiliation` → memberships; `settlement.factions` dropped; DM-authored NPCs kept as faces of no house); then the one golden shift + the registers in §6 | P4–P6 | no reader of (b)/(c) left outside FPZ's list (a walker); a v1 save loads with its authored NPCs, locks and custom content intact; one full check |

**Risks measured.**
1. **Too few people below the town.** A thorp has 0–3 faces (8/167 have none); 24/167 hamlets have none; 154/167 thorps and 127/167 hamlets have a power under three. "Up to three" must be the rule, and the seat mint is the floor that keeps every town with at least one face.
2. **The seat is not a house in half the small places** (83/167 hamlets, 97/167 villages): without the mint, the governing power has no first.
3. **The backing catalogue cannot populate a doubled niche or an `other` power** (264 + 45 of 313 zero-powers in cities): this is a ruling, not a tuning.
4. **The cast triples at the top** (metropolis 26 → 68 cards; ~10 KB of NPC record per 6 NPCs measured today → the save and the PDF grow in proportion) and the Register VII `mass` band (signed: 18–30 at a metropolis) is overridden by the house count — the owner's.
5. **The DM edit layer** (`docs/GENERATION_CONTRACTS.md`; `recordRegister.js`): `npcs` is HELD and keyed by `id`, relationships by `npc1Id,npc2Id,type` — regenerating the roster under a held key must keep DM-authored and locked NPCs, which under the new model are faces of no house (or of a custom house: `customContent.js:64` maps `factionAffiliation` → `controlledBy` and must map to memberships instead). The rename cascades (`factionRename.js`, `institutionRename.js`) lose their (b) second home and gain the institution→face join (an institution rename now renames a card's title source).
6. **No faction save migration exists** (`settlementMigrations.js` only stamps v1): P7 owes the first real one; `SCHEMA_VERSION` 1 → 2 is the rule for a removed field (`settlement.schema.js:42`).
7. **`npcInFaction` is shared** between the birth seat rows and the simulation: P4 changes its input shape; FPZ must be told the day it lands.

**What the chair must rule.** (1) The 27 judgment houses (proposed: places no face; hall/palace a face only where no seat house; weight-0 persons a face in no power). (2) The seat mint where no seat house rolls. (3) Doubled niches: split the archetype's landed shares (proposed) or borrow the first claimant's three. (4) `other` powers: mint one face from the stressor (proposed) or recruit from default-share faces. (5) "Up to three" below three. (6) Economics and safety hooks: fold into the tension class (proposed) or retire. (7) The one-tie target rule. And for the OWNER (signed register): the house count replacing Register VII's named `mass` band, and the size of the cast at city and metropolis (51 and 68 cards).

**CONFIRMED vs PLAUSIBLE.** Every count in §0–§4 is CONFIRMED (measured on the 525 and the 1,000 by the committed instruments); the in-degree distribution in §4 and the floor-2 rule's effect are PLAUSIBLE (a simulation of a target rule the car has not chosen); the §5 surface table is a read-only sweep, spot-checked on four rows, its line numbers PLAUSIBLE to ±a few lines.
