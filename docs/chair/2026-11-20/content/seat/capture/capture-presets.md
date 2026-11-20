# Capture at birth, arm presets (960 born towns through birthConfig, 0 errors)

Executed: `node docs/chair/2026-11-20/content/seat/capture/measure-capture.mjs --arm presets --n 10` (214s). Seeds and configs are measure-holder.mjs's own. Raw rows: `capture-presets.json`.

## (1) The capture rung at birth (`powerStructure.criminalCaptureState`) by tier

| tier | none | adversarial | equilibrium | corrupted | capture | towns |
|---|---|---|---|---|---|---|
| thorp | 160 | 0 | 0 | 0 | 0 | 160 |
| hamlet | 159 | 0 | 1 | 0 | 0 | 160 |
| village | 158 | 0 | 2 | 0 | 0 | 160 |
| town | 130 | 0 | 16 | 14 | 0 | 160 |
| city | 127 | 12 | 12 | 9 | 0 | 160 |
| metropolis | 118 | 21 | 13 | 7 | 1 | 160 |
| **all** | **852** | **33** | **44** | **30** | **1** | 960 |

Re-derivation check: `hallCaptureOf(record, { climate: captureClimateOf(record) })` over the born record differs from the stored rung in **2** towns (seat-measure-city-criminal_haven-8: stored adversarial, re-read equilibrium, climate re-read equilibrium; seat-measure-metropolis-arcane_academy-4: stored adversarial, re-read equilibrium, climate re-read equilibrium; the seam reads the climate over its own roster before the later steps, so a re-read over the final roster can differ on the climate term only).

Where each stored rung comes from (agent rung / climate rung, the derivation's two terms):

- capture <- agent capture / climate equilibrium: 1
- corrupted <- agent corrupted / climate equilibrium: 18
- corrupted <- agent corrupted / climate none: 8
- corrupted <- agent corrupted / climate adversarial: 4
- equilibrium <- agent none / climate equilibrium: 23
- equilibrium <- agent equilibrium / climate none: 14
- equilibrium <- agent equilibrium / climate adversarial: 4
- equilibrium <- agent equilibrium / climate equilibrium: 3
- adversarial <- agent none / climate adversarial: 31
- adversarial <- agent none / climate equilibrium: 2
- none <- agent none / climate none: 852

## (2) Criminal powers (rows) and criminal houses (institutions) per town

A criminal POWER is `allegiance.js :: isCriminalPower` (category criminal, or a name containing "thie"); a criminal HOUSE is `corruption.js :: isCriminalInstitution` on the roster, "faced" where a card's `institution` is that house.

| count | criminal powers (all rows) | independent (not governing) | governing | criminal houses (roster) | criminal houses with a face |
|---|---|---|---|---|---|
| 0 | 870 | 876 | 938 | 562 | 562 |
| 1 | 62 | 67 | 22 | 88 | 88 |
| 2+ | 28 | 17 | 0 | 310 | 310 |

Criminal power rows by name: Thieves' Guild [criminal] 84 · Corrupt Council (governing) [criminal] 12 · Corrupt City Council (governing) [criminal] 6 · The Black Circle [criminal] 6 · The Shadow Compact [criminal] 4 · The Underground [criminal] 4 · Shadow Senate (governing) [criminal] 4 · The Hidden Hand [criminal] 3

A criminal power whose row is NOT veiled by `cardVeil.js :: isVeiledPower` (criminal by name only): 0 rows.

People on record per criminal power (cards whose `memberships` name it): all rows p10/p50/p90 3 / 7 / 12 (histogram <=1:4 <=2:6 <=3:15 <=4:12 <=6:24 <=9:22 >9:40); independent powers only 3 / 6 / 11 (histogram <=1:4 <=2:6 <=3:15 <=4:11 <=6:20 <=9:19 >9:26).

Their `influence` values: governing:high 48 · governing:low 280 · independent:high 44 · independent:low 607.

## (3) The crime-worded forms and the rung each reaches

Towns born with a crime-worded form (the governing row criminal by `isCriminalPower`, or named Corrupt Council / Corrupt City Council / Shadow Senate / Corrupt Oligarchy / Shadowed Council): **22** of 960.

- Corrupt Council [category criminal] -> corrupted: 12
- Corrupt City Council [category criminal] -> corrupted: 6
- Shadow Senate [category criminal] -> corrupted: 3
- Shadow Senate [category criminal] -> capture: 1

By tier: town 12 · city 6 · metropolis 4.

**Probe A — the form forced ordinary** (the same born record, the governing row's category read as `government`; cast, ranks, allegiances unchanged; the one derivation re-run):

- corrupted -> none: 6
- corrupted -> equilibrium: 10
- corrupted -> adversarial: 2
- corrupted -> corrupted: 3
- capture -> capture: 1

Control: the same probe on the 938 towns without a crime form: unchanged 936 · adversarial -> equilibrium 2.

**Probe B — the agents removed** (every card's `allegiance` off, the form kept):

- crime form corrupted -> corrupted: 21
- crime form capture -> corrupted: 1

Probe B over every corrupted or captured town: capture -> corrupted (crime form) 1 · corrupted -> adversarial 4 · corrupted -> corrupted (crime form) 21 · corrupted -> equilibrium 1 · corrupted -> none 4.

## (4) The captured towns: the black market, criminal diversity, the lawful market

Captured towns at birth: **1** — too few for a distribution alone; the same measures follow over every town with an independent criminal power, labelled.

### CAPTURED towns (rung `capture`) (1 towns)

| measure | field | p10 / p50 / p90 | histogram |
|---|---|---|---|
| black market's share | `safetyProfile.blackMarketCapture` (%) | 25 / 25 / 25 | <=30:1 |
| criminal diversity: rackets | `safetyProfile.crimeTypes.length` | 2 / 2 / 2 | <=2:1 |
| criminal diversity: operations listed | `safetyProfile.criminalInstitutions.length` | 6 / 6 / 6 | >5:1 |
| criminal diversity: running chains | `criminalStructureKey.js :: runningCriminalChains` | 2 / 2 / 2 | <=2:1 |
| criminal houses with a face | roster | 7 / 7 / 7 | >4:1 |
| lawful market spread: income sources | `economicState.incomeSources.length` | 10 / 10 / 10 | <=10:1 |
| lawful market spread: effective sources | 1 / HHI of `incomeSources[].percentage` | 6.17 / 6.17 / 6.17 | <=8:1 |
| lawful market concentration: top source | max `incomeSources[].percentage` | 25 / 25 / 25 | <=30:1 |
| lawful market size: running chains | `activeChains` running, not criminal | 6 / 6 / 6 | <=6:1 |
| lawful market size: exports | `primaryExports.length` | 17 / 17 / 17 | >16:1 |
| lawful market size: local production | `localProduction.length` | 8 / 8 / 8 | <=8:1 |
| criminal operations per lawful effective source | criminalInstitutions.length / (1/HHI) | 0.97 / 0.97 / 0.97 | <=1:1 |
| black market beside the lawful | bmc / (100 - bmc) | 0.33 / 0.33 / 0.33 | <=0.4:1 |

Under the proposed line: **CRIME BOSSES 1** (CRIME BOSSES: metropolis 1).

### Every town with an independent criminal power (any rung) — LABELLED: not only captured (84 towns)

| measure | field | p10 / p50 / p90 | histogram |
|---|---|---|---|
| black market's share | `safetyProfile.blackMarketCapture` (%) | 18 / 24 / 32 | <=10:1 <=15:4 <=20:33 <=30:34 >30:12 |
| criminal diversity: rackets | `safetyProfile.crimeTypes.length` | 1 / 2 / 5 | <=1:22 <=2:38 <=3:7 <=4:4 <=5:9 >5:4 |
| criminal diversity: operations listed | `safetyProfile.criminalInstitutions.length` | 2 / 5 / 7 | <=0:2 <=1:3 <=2:12 <=3:6 <=4:9 <=5:11 >5:41 |
| criminal diversity: running chains | `criminalStructureKey.js :: runningCriminalChains` | 1 / 1 / 2 | <=0:2 <=1:50 <=2:32 |
| criminal houses with a face | roster | 2 / 6 / 8 | <=0:1 <=1:3 <=2:10 <=3:10 <=4:11 >4:49 |
| lawful market spread: income sources | `economicState.incomeSources.length` | 8 / 11 / 13 | <=4:1 <=6:1 <=8:12 <=10:13 <=12:40 >12:17 |
| lawful market spread: effective sources | 1 / HHI of `incomeSources[].percentage` | 5.35 / 6.92 / 8.03 | <=3:1 <=6:18 <=8:55 <=10:10 |
| lawful market concentration: top source | max `incomeSources[].percentage` | 22 / 25 / 35 | <=20:4 <=30:66 <=40:10 <=50:3 <=60:1 |
| lawful market size: running chains | `activeChains` running, not criminal | 5 / 9 / 16 | <=2:2 <=4:6 <=6:17 <=8:15 <=10:9 <=14:22 >14:13 |
| lawful market size: exports | `primaryExports.length` | 7 / 16 / 19 | <=4:3 <=8:9 <=12:10 <=16:21 >16:41 |
| lawful market size: local production | `localProduction.length` | 6 / 12 / 22 | <=2:2 <=4:2 <=8:17 <=12:24 <=16:12 >16:27 |
| criminal operations per lawful effective source | criminalInstitutions.length / (1/HHI) | 0.3 / 0.79 / 1.14 | <=0.25:7 <=0.5:14 <=0.75:18 <=1:31 <=1.25:10 >1.25:4 |
| black market beside the lawful | bmc / (100 - bmc) | 0.22 / 0.32 / 0.47 | <=0.1:1 <=0.2:4 <=0.3:37 <=0.4:29 <=0.6:9 >0.6:4 |

Under the proposed line: **ONE UNDERBOSS 58** · **CRIME BOSSES 26** (ONE UNDERBOSS: village 1, town 20, city 19, metropolis 18; CRIME BOSSES: city 9, metropolis 17).

**Which criminal diversity is truest.** The three candidates' vocabularies over the towns with an independent criminal power:

- `crimeTypes` (prose lines): Smuggling 68 · Commercial crime 55 · Criminal governance 12 · political violence 6 · loyalty testing 6 · information trade 6 · Arcane black market 5 · displacement crime 4 · cultural friction 4 · black market passage 4 · underground worship 4 · religious fraud 4 · contested property 4 · informant networks 4 · Magical crime 3 · debt evasion 3 · war profiteering 2 · deserter networks 2 · conscription fraud 2 · quarantine violation 1 · plague profiteering 1 · Street gang activity 1 · Background crime 1 · desperation theft 1 · black market food 1
- `criminalInstitutions` (the roster's operations): Front Businesses 70 · Smuggling Network 61 · Red Light District 36 · Rival Gangs 35 · Gambling District 35 · Assassins' Guild 31 · Underground City 30 · Black Market 28 · Black Market Bazaar 19 · Street Gang 18 · Gambling Halls 18 · Thieves' Guild (Powerful) 16 · Smuggling Operation 7 · Gambling Den 4 · Thieves' Guild Chapter 4
- running criminal chains: black_market 76 · guild_crime 38

Correlations (same towns): operations x criminal houses with a face 0.91; crimeTypes x operations -0.08; crimeTypes x blackMarketCapture 0.62; operations x blackMarketCapture -0.07.

**The proposed line (figures, not law).**

| side | reads | figure |
|---|---|---|
| CRIME BOSSES | the criminal trade is spread over several operations | `criminalInstitutions.length` >= 3 |
| | spread at least 0.75 as wide as the lawful market | `criminalInstitutions.length` / (1 / HHI of `incomeSources[].percentage`) >= 0.75 |
| | and large | `blackMarketCapture` >= 20 (bmc / lawful (100 - bmc) >= 0.25) |
| ONE UNDERBOSS | any one of the three fails: narrow, narrow beside the lawful market, or small | |

## (5) The criminal power's own open members, top three and top one by `influence` (captured towns)

The power is the hall's `underworld` (`hallCaptureOf`: the strongest criminal power that is not the ruler). Its OWN OPEN members: cards whose `memberships` name it, never the lord (rank 1 of the governing power), never any member of the governing power (the hall), never an agent (a card holding an `allegiance`). Stable tie order: `influence` (high > moderate > low), then the card's numeric `power` descending, then its rank in the criminal power (1, 2, 3, unranked), then roster order.

Pool size per captured town p10/p50/p90 5 / 5 / 5; towns with 0 / 1 / 2 / 3+ such people: 0 / 0 / 0 / 1 — **0 of 1 captured towns have fewer than three**.

Top one: rank none (high) 1. Top three's influence: high 1 · low 2. Members excluded as the lord or the hall, per town: 1 / 1 / 1.

LABELLED, wider sets (the same rule): corrupted or captured towns with an independent criminal power (21): 0 / 1 / 2 / 3+ = 0 / 2 / 1 / 18; every town with an independent criminal power (84): 0 / 3 / 4 / 77.

## (6) Twelve towns (the captured first, then the nearest rung)

- **seat-measure-metropolis-criminal_haven-4** — form Shadow Senate; front's leader Boris Sokolov (Mayor and council, the mayor, an agent); rung **capture** (agents at ranks 1,2); underworld Thieves' Guild; bmc 25, criminal operations 6 against lawful effective sources 6.17.
  Card: **CRIME BOSSES** — Alyona Medvedev (Underground city, the undercity boss; high, rank –); Vira Lazarev (Smuggling network, the network's head; low, rank 1); Tanya Gavrilović (Pawnbroker, the pawnbroker; low, rank –).
- **seat-measure-town-mage_city-6** — form Guild Council; front's leader Christophoros Choniates (Merchant guilds (3-8), the senior guild master, an agent); rung **corrupted** (agents at ranks 1); underworld Thieves' Guild; bmc 19, criminal operations 3 against lawful effective sources 5.69.
  Card: **ONE UNDERBOSS** — Euphemia Choniates (Hired blades, the blade captain; high, rank –).
- **seat-measure-town-lawless_frontier-2** — form Corrupt Council; front's leader Yelena Corvinus (Town hall, the council's fixer); rung **corrupted** (agents at ranks –); underworld Thieves' Guild; bmc 19, criminal operations 1 against lawful effective sources 6.2.
  Card: **ONE UNDERBOSS** — Seianus Calvus (Fence (word of mouth), the fence; low, rank 1).
- **seat-measure-town-lawless_frontier-4** — form Corrupt Council; front's leader Godela Krause (Town council, the first councillor); rung **corrupted** (agents at ranks –); underworld Thieves' Guild; bmc 19, criminal operations 3 against lawful effective sources 7.28.
  Card: **ONE UNDERBOSS** — Bonifaz Gruber (Smuggling operation, the smuggler; low, rank 1).
- **seat-measure-town-lawless_frontier-5** — form Corrupt Council; front's leader Zümür Merv (Town council, the first councillor); rung **corrupted** (agents at ranks –); underworld Thieves' Guild; bmc 19, criminal operations 2 against lawful effective sources 6.2.
  Card: **ONE UNDERBOSS** — Selmeg Noyakin (Smuggling operation, the smuggler; low, rank 1).
- **seat-measure-town-criminal_haven-0** — form Corrupt Council; front's leader Hristina Tretyakov (Town hall, the council's fixer); rung **corrupted** (agents at ranks –); underworld Thieves' Guild; bmc 14, criminal operations 0 against lawful effective sources 7.08.
  Card: **ONE UNDERBOSS** — Pavel Morozov (Thieves' Guild, the guildmaster; low, rank 1).
- **seat-measure-town-criminal_haven-1** — form Merchant oligarchy; front's leader Qutula Olqunu'ud (Merchant guilds (3-8), the senior guild master); rung **corrupted** (agents at ranks 2,3); underworld Thieves' Guild; bmc 32, criminal operations 3 against lawful effective sources 5.05.
  Card: **ONE UNDERBOSS** — Abu Said Olqunu'ud (Fence (word of mouth), the fence; low, rank 3).
- **seat-measure-town-criminal_haven-5** — form Corrupt Council; front's leader Dag Eriksson (Town hall, the council's fixer, an agent); rung **corrupted** (agents at ranks 1); underworld Thieves' Guild; bmc 25, criminal operations 2 against lawful effective sources 6.56.
  Card: **ONE UNDERBOSS** — Vigdis Bjarnarson (Front businesses, the nominal owner; low, rank 3).
- **seat-measure-town-criminal_haven-6** — form Corrupt Council; front's leader Chimalxochitl Chel (Town hall, the council's fixer); rung **corrupted** (agents at ranks –); underworld Thieves' Guild; bmc 38, criminal operations 1 against lawful effective sources 4.6.
  Card: **ONE UNDERBOSS** — Yaotl Kab (Street gang, the gang boss; low, rank 1).
- **seat-measure-town-criminal_haven-8** — form Corrupt Council; front's leader Alexios II Melissenos (Mayor and council, the mayor); rung **corrupted** (agents at ranks –); underworld Thieves' Guild; bmc 25, criminal operations 2 against lawful effective sources 6.13.
  Card: **ONE UNDERBOSS** — Chrysostomissa Kataphloron (Gambling den, the house boss; low, rank 3).
- **seat-measure-city-merchant_republic-5** — form Merchant Guild Council; front's leader Mongke Ghurid (Merchant guilds (15-40), the senior guild master, an agent); rung **corrupted** (agents at ranks 1); underworld Thieves' Guild; bmc 18, criminal operations 6 against lawful effective sources 6.92.
  Card: **ONE UNDERBOSS** — Jelme Uighur (Hired blades, the blade captain; high, rank –).
- **seat-measure-city-lawless_frontier-3** — form Merchant oligarchy; front's leader Domaldr Ulfsson (Merchant guilds (15-40), the senior guild master, an agent); rung **corrupted** (agents at ranks 1); underworld Thieves' Guild; bmc 19, criminal operations 5 against lawful effective sources 7.46.
  Card: **ONE UNDERBOSS** — Egil Mordsson (Hired blades, the blade captain; high, rank –).

## (7) The public difference: a captured town and the same town uncaptured

The twin is the SAME born record with the hall re-written at a lower rung through the one writer and its relation reader (`hallCapture.js :: writeHallCapture` with `rederive`, then `factionDynamics.js :: withCaptureRelations`) — the derivation's own path, nothing minted. Diffed: the owner's `powerStructure`, then `publicSafe.js :: toPublicSafe` (the non-owner served document, default mode) and `publicVeiledRecordOf` (the audience-gated readers' record).

**Twin at `corrupted`** over 1 captured towns:

- owner: `powerStructure.factions[].captureState` 1 · `powerStructure.factionRelationships[].captureState` 1 · `powerStructure.factionRelationships[].narrative` 1 · `powerStructure.criminalCaptureState` 1
- toPublicSafe: `(identical)` 1
- publicVeiledRecordOf: `(identical)` 1

**Twin at `none`** over 1 captured towns:

- owner: `powerStructure.factions[].captureState` 1 · `powerStructure.factionRelationships[].type` 1 · `powerStructure.factionRelationships[].captureState` 1 · `powerStructure.factionRelationships[].narrative` 1 · `powerStructure.factionRelationships[].dmNote` 1 · `powerStructure.criminalCaptureState` 1
- toPublicSafe: `(identical)` 1
- publicVeiledRecordOf: `(identical)` 1

What the captured town's public document still carries (toPublicSafe, 1 towns): allegianceKey=false 1 · captureStateKey=false 1 · criminalCaptureStateKey=false 1 · govRowPublic=true 1 · underworldRowPublic=true 1; the governing row's public `category`: criminal 1; the underworld's name occurrences in the public JSON p10/p50/p90 7 / 7 / 7; relation rows owner 5 / 5 / 5 vs public 3 / 3 / 3; the lord's public card keys: [category,id,influence,institution,memberships,name,personality,physical,presentation,role,title] 1; criminal-power members outside the hall on record 10 / 10 / 10, of them with a public `title` 3 / 3 / 3.

