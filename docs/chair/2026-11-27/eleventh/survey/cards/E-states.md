# (E) THE STATES A QUOTE LINE COULD BE KEYED ON

Tree 777733a2a; C and V as in (A). The counts are cards (CONFIRMED, `extract.mjs`, using the tree's readers). The keys
are proposed.

## The fields

| kind | state key (proposed) | field (reader) | values |
|---|---|---|---|
| crisis | the crisis's type | `composeCrisisPage(..)[].type` (= `stress.type`) | 14 types |
| tension | type × worst severity | `history.currentTensions[].type`, `.severity` | about 20 types × minor / major / catastrophic. A type comes with one severity almost always |
| power | its place at the seat × its strength | `derivePowerStrata(..).powers[].role` (ruler / contender), `.bound` (a contender bound to the ruler: "could contend"), roster-only = none; `faction.powerLabel`; `faction.legitimacyCrisis` | ruler / contender / bound / none × Dominant … Suppressed |
| institution | its mark, else its status | `crisisStoppedRow.js :: rowMarkText(settlement, 'house', inst)` (stopped by / short of: "a strained mill"); `InstitutionsTab.jsx :: houseStatus` (Impaired / Reduced / Vulnerable); else standing. The catalogue category names the trade the line speaks of | stopped / short / marked (another mark) / Impaired / Vulnerable / standing × 11 categories |
| tradition | its element × a crisis in force | `rec.coreMotif.element` (with `.act`); a stress in force ("a rite kept under a crisis"); `rec.lastOutcome` (unheld on every born town) | 13 elements × under a crisis or not |
| person | the person's own trade (category), spoken in the person's disposition | `npc.category`; `npc.presentation.disposition` (the four versions' key, a stored field: the voices measure's finding) | 8 categories × welcoming / transactional / cautious / dismissive |

### crisis

| state | C | V |
|---|---|---|
| wartime | 37 | 31 |
| monster_pressure | 29 | 23 |
| succession_void | 28 | 21 |
| politically_fractured | 28 | 25 |
| recently_betrayed | 28 | 26 |
| indebted | 25 | 29 |
| under_siege | 23 | 15 |
| mass_migration | 18 | 19 |
| plague_onset | 17 | 11 |
| insurgency | 16 | 28 |
| infiltrated | 16 | 19 |
| occupied | 12 | 9 |
| famine | 11 | 34 |
| religious_conversion | 9 | 7 |

### tension

| state | C | V |
|---|---|---|
| guild_conflict · major | 122 | 124 |
| crime_wave · major | 119 | 122 |
| resource_scarcity · major | 110 | 149 |
| external_threat · catastrophic | 106 | 90 |
| succession_crisis · major | 69 | 69 |
| corruption_scandal · major | 69 | 54 |
| outside_debt · major | 63 | 60 |
| legitimacy_crisis · catastrophic | 63 | 79 |
| great_flood · catastrophic | 56 | 34 |
| tyranny · catastrophic | 54 | 42 |
| religious_tension · major | 53 | 46 |
| infiltration_fear · major | 47 | 33 |
| plague_years · catastrophic | 47 | 45 |
| magical_controversy · major | 47 | 60 |
| disputed_land · major | 45 | 33 |
| generational_divide · minor | 44 | 42 |
| heresy_trial · major | 40 | 49 |
| great_fire · catastrophic | 39 | 48 |
| popular_uprising · catastrophic | 38 | 46 |
| leadership_vacuum · catastrophic | 36 | 46 |
| trade_collapse · major | 36 | 29 |
| occupation_legacy · catastrophic | 36 | 25 |
| wild_magic · major | 35 | 32 |
| market_crash · major | 33 | 21 |
| population_friction · major | 30 | 39 |
| pilgrimage_surge · major | 30 | 31 |
| trade_dispute · major | 29 | 38 |
| economic_disparity · major | 28 | 25 |
| demographic_pressure · major | 18 | 19 |

### tensionType

| state | C | V |
|---|---|---|
| guild_conflict | 122 | 124 |
| crime_wave | 119 | 122 |
| resource_scarcity | 110 | 149 |
| external_threat | 106 | 90 |
| succession_crisis | 69 | 69 |
| corruption_scandal | 69 | 54 |
| outside_debt | 63 | 60 |
| legitimacy_crisis | 63 | 79 |
| great_flood | 56 | 34 |
| tyranny | 54 | 42 |
| religious_tension | 53 | 46 |
| infiltration_fear | 47 | 33 |
| plague_years | 47 | 45 |
| magical_controversy | 47 | 60 |
| disputed_land | 45 | 33 |
| generational_divide | 44 | 42 |
| heresy_trial | 40 | 49 |
| great_fire | 39 | 48 |
| popular_uprising | 38 | 46 |
| leadership_vacuum | 36 | 46 |
| trade_collapse | 36 | 29 |
| occupation_legacy | 36 | 25 |
| wild_magic | 35 | 32 |
| market_crash | 33 | 21 |
| population_friction | 30 | 39 |
| pilgrimage_surge | 30 | 31 |
| trade_dispute | 29 | 38 |
| economic_disparity | 28 | 25 |
| demographic_pressure | 18 | 19 |

### power

| state | C | V |
|---|---|---|
| bound · Minor | 720 | 391 |
| none · Minor | 554 | 316 |
| contender · Minor | 328 | 387 |
| ruler · Minor | 313 | 152 |
| ruler · Dominant | 303 | 348 |
| none · Significant | 254 | 89 |
| none · Suppressed | 202 | 227 |
| ruler · Significant | 157 | 161 |
| bound · Significant | 127 | 145 |
| none · Strong | 109 | 193 |
| bound · Strong | 84 | 83 |
| contender · Significant | 79 | 143 |
| ruler · Strong | 64 | 96 |
| contender · Dominant | 48 | 21 |
| contender · Strong | 40 | 65 |
| ruler · Suppressed | 16 | 16 |
| ruler · Strong · legitimacy crisis | 15 | 29 |
| ruler · Minor · legitimacy crisis | 12 | 22 |
| ruler · Significant · legitimacy crisis | 11 | 19 |
| none · Dominant | 10 | 109 |
| contender · Suppressed | 8 | 55 |
| ruler · Dominant · legitimacy crisis | 7 | 55 |
| none · Minor · legitimacy crisis | 5 | 19 |
| ruler · Suppressed · legitimacy crisis | 2 | 2 |
| bound · Suppressed | 2 | 49 |
| bound · Dominant | 0 | 1 |
| none · Strong · legitimacy crisis | 0 | 1 |
| none · Significant · legitimacy crisis | 0 | 12 |
| none · Suppressed · legitimacy crisis | 0 | 2 |

### institution

| state | C | V |
|---|---|---|
| standing | 28749 | 26975 |
| Vulnerable | 5112 | 5562 |
| marked | 232 | 169 |
| short | 213 | 287 |
| stopped | 73 | 49 |
| Impaired | 28 | 57 |

### institutionCategory

| state | C | V |
|---|---|---|
| Crafts | 10565 | 9789 |
| Economy | 9385 | 9056 |
| Infrastructure | 3494 | 3451 |
| Religious | 2962 | 2793 |
| Defense | 2039 | 2119 |
| Entertainment | 1693 | 1652 |
| Criminal | 1558 | 1361 |
| Adventuring | 949 | 955 |
| Magic | 876 | 798 |
| Government | 874 | 832 |
| Exotic | 12 | 293 |

### tradition

| state | C | V |
|---|---|---|
| founding | 473 | 370 |
| greening | 229 | 130 |
| founding · under a crisis | 227 | 171 |
| harvest | 215 | 129 |
| field | 178 | 58 |
| charter | 163 | 169 |
| market | 128 | 136 |
| forge | 109 | 80 |
| greening · under a crisis | 105 | 51 |
| field · under a crisis | 94 | 36 |
| the-dead | 92 | 90 |
| harvest · under a crisis | 88 | 54 |
| stars | 86 | 97 |
| charter · under a crisis | 78 | 78 |
| hunt | 67 | 97 |
| long-sun | 65 | 65 |
| market · under a crisis | 61 | 52 |
| stone | 48 | 134 |
| forge · under a crisis | 48 | 37 |
| hearth | 41 | 51 |
| stars · under a crisis | 39 | 34 |
| the-dead · under a crisis | 37 | 42 |
| hunt · under a crisis | 30 | 40 |
| stone · under a crisis | 23 | 48 |
| hearth · under a crisis | 22 | 19 |
| long-sun · under a crisis | 21 | 29 |
| first-landing | 0 | 201 |
| first-landing · under a crisis | 0 | 99 |
| tide · under a crisis | 0 | 24 |
| river | 0 | 56 |
| river · under a crisis | 0 | 27 |
| tide | 0 | 63 |

### person

| state | C | V |
|---|---|---|
| transactional | 8390 | 8071 |
| cautious | 8273 | 7957 |
| welcoming | 7955 | 7442 |
| dismissive | 2742 | 2708 |
| none | 31 | 40 |

### personCategory

| state | C | V |
|---|---|---|
| other | 13423 | 12671 |
| economy | 4801 | 4611 |
| government | 2542 | 2590 |
| criminal | 2273 | 2042 |
| military | 1777 | 1801 |
| religious | 1559 | 1412 |
| magic | 985 | 1051 |
| civic | 31 | 40 |



## Which pools must be deepest (PLAUSIBLE: read from the counts and from (C)'s budgeted simulation)

- **Institution · standing** (28,749 of 34,407 houses on C) and **Vulnerable** (5,112) hold almost every house. Split by
  category, the deepest are **Crafts, Economy, Infrastructure, Religious**. Under a tab budget an institution tab carries
  about one or two quotes, so a standing pool needs variety across towns more than depth within one. The marks (stopped,
  short: 286 houses) are rare but they are the weighty ones, and a crisis puts several on one tab. Each crisis family needs
  its own small pool (the siege's, the famine's …).
- **Power · bound / none / contender × Minor** are the commonest powers (1,602 of 3,470 on C). The **ruler** is the
  weightiest and speaks most: ruler × Dominant in small places (303), × Minor and Significant in large ones (470). One
  pool per seat role is the floor.
- **Tension:** the five commonest types (guild conflict, crime wave, resource scarcity, external threat, succession) are
  a third of the tensions (526 of 1,542 on C). But tensions seldom have a speaker (D), so these pools matter least until the owner rules on who
  voices a tension.
- **Tradition:** **founding** (700 of 2,767, the weighty one), a third of them under a crisis. Then greening, harvest and
  field. Every element exists with and without a crisis, so the "kept under a crisis" variant is needed for each element
  that speaks.
- **Person:** the four dispositions are nearly even (transactional, cautious and welcoming about 8,000 each; dismissive
  2,742). The trade categories are led by "other" (13,423: the houses' own trades), then economy, government and
  military. A person's line of their own trade is keyed best on the house's catalogue category, which (A)'s institution
  card already carries.
- **No line twice on a page:** two cards of one state on one tab would draw from one pool by rank. With a cap of three a
  tab, each (kind, state) pool that can fill a tab needs **at least three lines** (each in four versions) to keep the
  lines distinct, and the pick must skip a line already printed on the page. That is the rank's own "next line for the
  next one" (`rankRendezvous`).
