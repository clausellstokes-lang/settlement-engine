# Capture at birth, arm default (900 born towns through birthConfig, 0 errors)

Executed: `node docs/chair/2026-11-20/content/seat/capture/measure-capture.mjs --arm default --n 150` (210s). Seeds and configs are measure-holder.mjs's own. Raw rows: `capture-default.json`.

## (1) The capture rung at birth (`powerStructure.criminalCaptureState`) by tier

| tier | none | adversarial | equilibrium | corrupted | capture | towns |
|---|---|---|---|---|---|---|
| thorp | 150 | 0 | 0 | 0 | 0 | 150 |
| hamlet | 148 | 0 | 0 | 2 | 0 | 150 |
| village | 148 | 0 | 1 | 1 | 0 | 150 |
| town | 141 | 0 | 6 | 3 | 0 | 150 |
| city | 128 | 0 | 20 | 2 | 0 | 150 |
| metropolis | 114 | 2 | 27 | 7 | 0 | 150 |
| **all** | **829** | **2** | **54** | **15** | **0** | 900 |

Re-derivation check: `hallCaptureOf(record, { climate: captureClimateOf(record) })` over the born record differs from the stored rung in **0** towns.

Where each stored rung comes from (agent rung / climate rung, the derivation's two terms):

- corrupted <- agent corrupted / climate none: 13
- corrupted <- agent corrupted / climate equilibrium: 1
- corrupted <- agent corrupted / climate adversarial: 1
- equilibrium <- agent equilibrium / climate none: 32
- equilibrium <- agent none / climate equilibrium: 18
- equilibrium <- agent equilibrium / climate equilibrium: 4
- adversarial <- agent none / climate adversarial: 2
- none <- agent none / climate none: 829

## (2) Criminal powers (rows) and criminal houses (institutions) per town

A criminal POWER is `allegiance.js :: isCriminalPower` (category criminal, or a name containing "thie"); a criminal HOUSE is `corruption.js :: isCriminalInstitution` on the roster, "faced" where a card's `institution` is that house.

| count | criminal powers (all rows) | independent (not governing) | governing | criminal houses (roster) | criminal houses with a face |
|---|---|---|---|---|---|
| 0 | 874 | 874 | 900 | 511 | 511 |
| 1 | 17 | 17 | 0 | 84 | 84 |
| 2+ | 9 | 9 | 0 | 305 | 305 |

Criminal power rows by name: Thieves' Guild [criminal] 26 · The Underground [criminal] 5 · The Black Circle [criminal] 2 · The Shadow Compact [criminal] 2

A criminal power whose row is NOT veiled by `cardVeil.js :: isVeiledPower` (criminal by name only): 0 rows.

People on record per criminal power (cards whose `memberships` name it): all rows p10/p50/p90 2 / 5 / 10 (histogram <=2:4 <=3:4 <=4:9 <=6:5 <=9:6 >9:7); independent powers only 2 / 5 / 10 (histogram <=2:4 <=3:4 <=4:9 <=6:5 <=9:6 >9:7).

Their `influence` values: independent:high 18 · independent:low 189.

## (3) The crime-worded forms and the rung each reaches

Towns born with a crime-worded form (the governing row criminal by `isCriminalPower`, or named Corrupt Council / Corrupt City Council / Shadow Senate / Corrupt Oligarchy / Shadowed Council): **0** of 900.


By tier: none.

**Probe A — the form forced ordinary** (the same born record, the governing row's category read as `government`; cast, ranks, allegiances unchanged; the one derivation re-run):


Control: the same probe on the 900 towns without a crime form: unchanged 900.

**Probe B — the agents removed** (every card's `allegiance` off, the form kept):


Probe B over every corrupted or captured town: corrupted -> adversarial 1 · corrupted -> equilibrium 1 · corrupted -> none 13.

## (4) The captured towns: the black market, criminal diversity, the lawful market

Captured towns at birth: **0** — too few for a distribution alone; the same measures follow over every town with an independent criminal power, labelled.

### CAPTURED towns (rung `capture`) (0 towns)

| measure | field | p10 / p50 / p90 | histogram |
|---|---|---|---|
| black market's share | `safetyProfile.blackMarketCapture` (%) | – |  |
| criminal diversity: rackets | `safetyProfile.crimeTypes.length` | – |  |
| criminal diversity: operations listed | `safetyProfile.criminalInstitutions.length` | – |  |
| criminal diversity: running chains | `criminalStructureKey.js :: runningCriminalChains` | – |  |
| criminal houses with a face | roster | – |  |
| lawful market spread: income sources | `economicState.incomeSources.length` | – |  |
| lawful market spread: effective sources | 1 / HHI of `incomeSources[].percentage` | – |  |
| lawful market concentration: top source | max `incomeSources[].percentage` | – |  |
| lawful market size: running chains | `activeChains` running, not criminal | – |  |
| lawful market size: exports | `primaryExports.length` | – |  |
| lawful market size: local production | `localProduction.length` | – |  |
| criminal operations per lawful effective source | criminalInstitutions.length / (1/HHI) | – |  |
| black market beside the lawful | bmc / (100 - bmc) | – |  |

Under the proposed line:  ().

### Every town with an independent criminal power (any rung) — LABELLED: not only captured (26 towns)

| measure | field | p10 / p50 / p90 | histogram |
|---|---|---|---|
| black market's share | `safetyProfile.blackMarketCapture` (%) | 12 / 22 / 31 | <=10:1 <=15:6 <=20:4 <=30:9 >30:6 |
| criminal diversity: rackets | `safetyProfile.crimeTypes.length` | 3 / 4 / 6 | <=2:2 <=3:6 <=4:7 <=5:4 >5:7 |
| criminal diversity: operations listed | `safetyProfile.criminalInstitutions.length` | 2 / 6 / 8 | <=1:1 <=2:4 <=4:2 <=5:5 >5:14 |
| criminal diversity: running chains | `criminalStructureKey.js :: runningCriminalChains` | 1 / 2 / 2 | <=0:1 <=1:9 <=2:16 |
| criminal houses with a face | roster | 2 / 6 / 7 | <=1:1 <=2:3 <=3:2 <=4:2 >4:18 |
| lawful market spread: income sources | `economicState.incomeSources.length` | 10 / 12 / 14 | <=8:2 <=10:3 <=12:10 >12:11 |
| lawful market spread: effective sources | 1 / HHI of `incomeSources[].percentage` | 5.77 / 7.69 / 8.25 | <=6:5 <=8:15 <=10:6 |
| lawful market concentration: top source | max `incomeSources[].percentage` | 21 / 24 / 31 | <=20:3 <=30:17 <=40:6 |
| lawful market size: running chains | `activeChains` running, not criminal | 6 / 10 / 17 | <=6:4 <=8:7 <=10:3 <=14:7 >14:5 |
| lawful market size: exports | `primaryExports.length` | 8 / 18 / 20 | <=8:4 <=12:1 <=16:4 >16:17 |
| lawful market size: local production | `localProduction.length` | 10 / 14 / 29 | <=4:1 <=8:2 <=12:6 <=16:7 >16:10 |
| criminal operations per lawful effective source | criminalInstitutions.length / (1/HHI) | 0.35 / 0.78 / 1.13 | <=0.25:2 <=0.5:3 <=0.75:7 <=1:9 <=1.25:4 >1.25:1 |
| black market beside the lawful | bmc / (100 - bmc) | 0.14 / 0.28 / 0.45 | <=0.1:1 <=0.2:6 <=0.3:11 <=0.4:2 <=0.6:6 |

Under the proposed line: **ONE UNDERBOSS 18** · **CRIME BOSSES 8** (ONE UNDERBOSS: town 4, city 5, metropolis 9; CRIME BOSSES: metropolis 8).

**Which criminal diversity is truest.** The three candidates' vocabularies over the towns with an independent criminal power:

- `crimeTypes` (prose lines): Smuggling 22 · Magical crime 22 · underground worship 8 · religious fraud 8 · contested property 8 · informant networks 8 · political violence 7 · loyalty testing 7 · information trade 7 · debt evasion 5 · quarantine violation 3 · plague profiteering 3 · Street gang activity 2 · desperation theft 1 · black market food 1
- `criminalInstitutions` (the roster's operations): Front Businesses 22 · Smuggling Network 20 · Gambling District 17 · Assassins' Guild 15 · Underground City 14 · Red Light District 13 · Thieves' Guild (Powerful) 12 · Rival Gangs 7 · Black Market 5 · Black Market Bazaar 5 · Street Gang 3 · Smuggling Operation 2 · Thieves' Guild Chapter 2 · Gambling Halls 2
- running criminal chains: black_market 24 · guild_crime 17

Correlations (same towns): operations x criminal houses with a face 0.93; crimeTypes x operations -0.16; crimeTypes x blackMarketCapture 0.55; operations x blackMarketCapture -0.44.

**The proposed line (figures, not law).**

| side | reads | figure |
|---|---|---|
| CRIME BOSSES | the criminal trade is spread over several operations | `criminalInstitutions.length` >= 3 |
| | spread at least 0.75 as wide as the lawful market | `criminalInstitutions.length` / (1 / HHI of `incomeSources[].percentage`) >= 0.75 |
| | and large | `blackMarketCapture` >= 20 (bmc / lawful (100 - bmc) >= 0.25) |
| ONE UNDERBOSS | any one of the three fails: narrow, narrow beside the lawful market, or small | |

## (5) The criminal power's own open members, top three and top one by `influence` (captured towns)

The power is the hall's `underworld` (`hallCaptureOf`: the strongest criminal power that is not the ruler). Its OWN OPEN members: cards whose `memberships` name it, never the lord (rank 1 of the governing power), never any member of the governing power (the hall), never an agent (a card holding an `allegiance`). Stable tie order: `influence` (high > moderate > low), then the card's numeric `power` descending, then its rank in the criminal power (1, 2, 3, unranked), then roster order.

Pool size per captured town p10/p50/p90 –; towns with 0 / 1 / 2 / 3+ such people: 0 / 0 / 0 / 0 — **0 of 0 captured towns have fewer than three**.

Top one: –. Top three's influence: –. Members excluded as the lord or the hall, per town: –.

LABELLED, wider sets (the same rule): corrupted or captured towns with an independent criminal power (2): 0 / 1 / 2 / 3+ = 0 / 0 / 0 / 2; every town with an independent criminal power (26): 0 / 0 / 4 / 22.

## (6) Twelve towns (the captured first, then the nearest rung)

- **seat-measure-town-85** — form Town Council; front's leader Tun Hau (Merchant guilds (3-8), the senior guild master, an agent); rung **corrupted** (agents at ranks 1); underworld Thieves' Guild; bmc 18, criminal operations 2 against lawful effective sources 6.85.
  Card: **ONE UNDERBOSS** — Akna Batab (Hired blades, the blade captain; high, rank –).
- **seat-measure-metropolis-78** — form Grand Merchant Oligarchy; front's leader Raoul Philanthropenos (International trade center, the exchange master, an agent); rung **corrupted** (agents at ranks 1); underworld Thieves' Guild; bmc 12, criminal operations 7 against lawful effective sources 7.78.
  Card: **ONE UNDERBOSS** — Raoul Kalojan (Underground city, the undercity boss; high, rank –).
- **seat-measure-hamlet-77** — form Free Elder Council; front's leader Hypatia Bryennios (Dairy farmer, the dairy farmer, an agent); rung **corrupted** (agents at ranks 1); underworld –; bmc 1, criminal operations 0 against lawful effective sources 1.24.
  Card: **ONE UNDERBOSS** — (no open member on record).
- **seat-measure-hamlet-87** — form Elder Council; front's leader Dhul-Nun al-Farabi (Dairy farmer, the dairy farmer, an agent); rung **corrupted** (agents at ranks 1); underworld –; bmc 1, criminal operations 0 against lawful effective sources 1.24.
  Card: **ONE UNDERBOSS** — (no open member on record).
- **seat-measure-village-17** — form Elected Reeve; front's leader Guelagetza Balam (Mine, the mine captain, an agent); rung **corrupted** (agents at ranks 1,3); underworld –; bmc 8, criminal operations 0 against lawful effective sources 1.24.
  Card: **ONE UNDERBOSS** — (no open member on record).
- **seat-measure-town-35** — form Town Mayor; front's leader Rostislav Ilyin (Weavers/Textile workers, the master weaver, an agent); rung **corrupted** (agents at ranks 1,3); underworld –; bmc 8, criminal operations 2 against lawful effective sources 6.39.
  Card: **ONE UNDERBOSS** — (no open member on record).
- **seat-measure-town-101** — form Feudal Appointee; front's leader Manchu Yoshida (Lord's appointee, the lord's appointee, an agent); rung **corrupted** (agents at ranks 1); underworld –; bmc 8, criminal operations 2 against lawful effective sources 6.29.
  Card: **ONE UNDERBOSS** — (no open member on record).
- **seat-measure-city-4** — form Merchant Guild Council; front's leader Akash Parekh (Merchant guilds (15-40), the senior guild master, an agent); rung **corrupted** (agents at ranks 1); underworld –; bmc 8, criminal operations 3 against lawful effective sources 6.76.
  Card: **ONE UNDERBOSS** — (no open member on record).
- **seat-measure-city-73** — form City-State Council; front's leader Muqali Fergana (Merchant guilds (15-40), the senior guild master, an agent); rung **corrupted** (agents at ranks 1); underworld –; bmc 8, criminal operations 3 against lawful effective sources 6.76.
  Card: **ONE UNDERBOSS** — (no open member on record).
- **seat-measure-metropolis-0** — form Grand Council; front's leader Chandravathi Mukherjee (International trade center, the exchange master, an agent); rung **corrupted** (agents at ranks 1); underworld –; bmc 23, criminal operations 6 against lawful effective sources 6.96.
  Card: **CRIME BOSSES** — (no open member on record) [only 0 on record].
- **seat-measure-metropolis-41** — form Ducal Governorship; front's leader Purev Qipchaq (Noble governor, the governor, an agent); rung **corrupted** (agents at ranks 1); underworld –; bmc 8, criminal operations 8 against lawful effective sources 6.84.
  Card: **ONE UNDERBOSS** — (no open member on record).
- **seat-measure-metropolis-43** — form Grand Council; front's leader Eivor Gormsson (International trade center, the exchange master, an agent); rung **corrupted** (agents at ranks 1,2); underworld –; bmc 8, criminal operations 7 against lawful effective sources 7.05.
  Card: **ONE UNDERBOSS** — (no open member on record).

## (7) The public difference: a captured town and the same town uncaptured

The twin is the SAME born record with the hall re-written at a lower rung through the one writer and its relation reader (`hallCapture.js :: writeHallCapture` with `rederive`, then `factionDynamics.js :: withCaptureRelations`) — the derivation's own path, nothing minted. Diffed: the owner's `powerStructure`, then `publicSafe.js :: toPublicSafe` (the non-owner served document, default mode) and `publicVeiledRecordOf` (the audience-gated readers' record).

**Twin at `corrupted`** over 0 captured towns:

- owner: –
- toPublicSafe: –
- publicVeiledRecordOf: –

**Twin at `none`** over 0 captured towns:

- owner: –
- toPublicSafe: –
- publicVeiledRecordOf: –

What the captured town's public document still carries (toPublicSafe, 0 towns): ; the governing row's public `category`: ; the underworld's name occurrences in the public JSON p10/p50/p90 –; relation rows owner – vs public –; the lord's public card keys: ; criminal-power members outside the hall on record –, of them with a public `title` –.

