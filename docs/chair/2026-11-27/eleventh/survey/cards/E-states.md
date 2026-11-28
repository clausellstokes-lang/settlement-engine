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

| state | C |
|---|---|
| wartime | 37 |
| monster_pressure | 29 |
| succession_void | 28 |
| politically_fractured | 28 |
| recently_betrayed | 28 |
| indebted | 25 |
| under_siege | 23 |
| mass_migration | 18 |
| plague_onset | 17 |
| insurgency | 16 |
| infiltrated | 16 |
| occupied | 12 |
| famine | 11 |
| religious_conversion | 9 |

### tension

| state | C |
|---|---|
| guild_conflict · major | 122 |
| crime_wave · major | 119 |
| resource_scarcity · major | 110 |
| external_threat · catastrophic | 106 |
| succession_crisis · major | 69 |
| corruption_scandal · major | 69 |
| outside_debt · major | 63 |
| legitimacy_crisis · catastrophic | 63 |
| great_flood · catastrophic | 56 |
| tyranny · catastrophic | 54 |
| religious_tension · major | 53 |
| infiltration_fear · major | 47 |
| plague_years · catastrophic | 47 |
| magical_controversy · major | 47 |
| disputed_land · major | 45 |
| generational_divide · minor | 44 |
| heresy_trial · major | 40 |
| great_fire · catastrophic | 39 |
| popular_uprising · catastrophic | 38 |
| leadership_vacuum · catastrophic | 36 |
| trade_collapse · major | 36 |
| occupation_legacy · catastrophic | 36 |
| wild_magic · major | 35 |
| market_crash · major | 33 |
| population_friction · major | 30 |
| pilgrimage_surge · major | 30 |
| trade_dispute · major | 29 |
| economic_disparity · major | 28 |
| demographic_pressure · major | 18 |

### tensionType

| state | C |
|---|---|
| guild_conflict | 122 |
| crime_wave | 119 |
| resource_scarcity | 110 |
| external_threat | 106 |
| succession_crisis | 69 |
| corruption_scandal | 69 |
| outside_debt | 63 |
| legitimacy_crisis | 63 |
| great_flood | 56 |
| tyranny | 54 |
| religious_tension | 53 |
| infiltration_fear | 47 |
| plague_years | 47 |
| magical_controversy | 47 |
| disputed_land | 45 |
| generational_divide | 44 |
| heresy_trial | 40 |
| great_fire | 39 |
| popular_uprising | 38 |
| leadership_vacuum | 36 |
| trade_collapse | 36 |
| occupation_legacy | 36 |
| wild_magic | 35 |
| market_crash | 33 |
| population_friction | 30 |
| pilgrimage_surge | 30 |
| trade_dispute | 29 |
| economic_disparity | 28 |
| demographic_pressure | 18 |

### power

| state | C |
|---|---|
| bound · Minor | 720 |
| none · Minor | 554 |
| contender · Minor | 328 |
| ruler · Minor | 313 |
| ruler · Dominant | 303 |
| none · Significant | 254 |
| none · Suppressed | 202 |
| ruler · Significant | 157 |
| bound · Significant | 127 |
| none · Strong | 109 |
| bound · Strong | 84 |
| contender · Significant | 79 |
| ruler · Strong | 64 |
| contender · Dominant | 48 |
| contender · Strong | 40 |
| ruler · Suppressed | 16 |
| ruler · Strong · legitimacy crisis | 15 |
| ruler · Minor · legitimacy crisis | 12 |
| ruler · Significant · legitimacy crisis | 11 |
| none · Dominant | 10 |
| contender · Suppressed | 8 |
| ruler · Dominant · legitimacy crisis | 7 |
| none · Minor · legitimacy crisis | 5 |
| ruler · Suppressed · legitimacy crisis | 2 |
| bound · Suppressed | 2 |

### institution

| state | C |
|---|---|
| standing | 28749 |
| Vulnerable | 5112 |
| marked | 232 |
| short | 213 |
| stopped | 73 |
| Impaired | 28 |

### institutionCategory

| state | C |
|---|---|
| Crafts | 10565 |
| Economy | 9385 |
| Infrastructure | 3494 |
| Religious | 2962 |
| Defense | 2039 |
| Entertainment | 1693 |
| Criminal | 1558 |
| Adventuring | 949 |
| Magic | 876 |
| Government | 874 |
| Exotic | 12 |

### tradition

| state | C |
|---|---|
| founding | 473 |
| greening | 229 |
| founding · under a crisis | 227 |
| harvest | 215 |
| field | 178 |
| charter | 163 |
| market | 128 |
| forge | 109 |
| greening · under a crisis | 105 |
| field · under a crisis | 94 |
| the-dead | 92 |
| harvest · under a crisis | 88 |
| stars | 86 |
| charter · under a crisis | 78 |
| hunt | 67 |
| long-sun | 65 |
| market · under a crisis | 61 |
| stone | 48 |
| forge · under a crisis | 48 |
| hearth | 41 |
| stars · under a crisis | 39 |
| the-dead · under a crisis | 37 |
| hunt · under a crisis | 30 |
| stone · under a crisis | 23 |
| hearth · under a crisis | 22 |
| long-sun · under a crisis | 21 |

### person

| state | C |
|---|---|
| transactional | 8390 |
| cautious | 8273 |
| welcoming | 7955 |
| dismissive | 2742 |
| none | 31 |

### personCategory

| state | C |
|---|---|
| other | 13423 |
| economy | 4801 |
| government | 2542 |
| criminal | 2273 |
| military | 1777 |
| religious | 1559 |
| magic | 985 |
| civic | 31 |



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
