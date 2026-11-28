# (A) THE KEYS: the card kinds and the states a SAID line is keyed on

VOICES-LINES, 2026-11-28. Tree `lane/stack-122-wip-2026-11-28` at 777733a2a, read only. Counts are a script's over the two
proof corpora (C and V, 900 births each, from `rmeasure/tools/plan-C.json` and `plan-V.json`), births made with the record's
own `births.mjs` and a read-only measure (`keys.mjs`, kept in my scratch). CONFIRMED where counted. The grouping into families
and states is MY PROPOSAL, for the chair's ruling. VOICES-CARDS had pushed nothing (`lane/voices-cards-measure-2026-11-28`
absent at 02:37 UTC), so every state below is my own.

Cross-check: the births agree with the voices measure. Towns holding a legitimate person with a criminal tie: C 318, V 253
(the measure's D-ties: 318, 253). 0 errors of 1,800.

## How common each card kind is (cards over C+V, 1,800 towns; per town by size: thorp / hamlet / village / town / city / metropolis)

| card kind | cards | per town by size | notes |
|---|---|---|---|
| an institution's card (public families) | 60,454 | 6.1 / 8.9 / 12.7 / 29.6 / 61.6 / 82.6 | the commonest by far; every craft, market, inn, show and learning card has a named face |
| a person's own card (lawful, public) | 50,679 | 1.2 / 3.4 / 8.0 / 24.0 / 55.8 / 76.6 | criminal faces (2,922) and veiled cards: no public quote |
| a power's card (lawful) | 6,838 | 1.1 / 1.2 / 2.3 / 3.7 / 5.9 / 7.2 | criminal powers (244, of which 39 hold the seat): no public quote |
| a tradition's row | 5,534 | 1.5 / 1.5 / 2.0 / 3.0 / 4.5 / 6.0 | 1,714 of them in a town under a crisis |
| a current tension's card | 4,669 | 1.0 / 1.1 / 1.6 / 1.5 / 2.5 / 2.5 | |
| the crisis card | 594 | 0.3 / 0.4 / 0.3 / 0.4 / 0.3 / 0.3 | 580 towns; 14 hold two |

## 1. AN INSTITUTION's CARD: key `inst.<family>-<condition>`

**Families** (by name and catalogue category, first match wins; 263 distinct names, none unsorted). Cards, then towns holding one:

| family | what it holds | cards | towns |
|---|---|---|---|
| `workshop` | every craft house: smiths, carpenters, coopers, potters, weavers, tailors, tanners, dyers, glass, jewellers, butchers, chandlers, ropemakers, craft guilds | 13,687 | 1,202 |
| `market` | markets, fairs, merchant guilds, warehouses, auction, banks, money changers, mint, assay, customs, pawnbroker, exchanges | 7,150 | 995 |
| `temple` | churches, cathedrals, monasteries, shrines, groves, burial grounds, almshouse, foundling home | 5,295 | 1,800 |
| `inn` | inns, taverns, alehouses, brewery, bathhouse, stables, post relay, toll bridge, carriers | 4,925 | 1,233 |
| `hall` | the seat's own houses, courts, prisons, workhouse, town crier, palace | 4,378 | 1,412 |
| `watch` | watch, garrison, militia, levy, walls, citadel, barracks, warden's lodge | 3,711 | 1,175 (with blades) |
| `grain` | mills, bakers, granaries, root cellar, maltster | 3,509 | 1,800 |
| `learning` | magic houses, library, sage's quarter, scribes, printing house, cartographers, chroniclers | 3,168 | 751 |
| `field` | farmland, grazing, shepherds, dairy, beekeeper, hunters, wildfowler, beast trainers, furriers | 3,045 | 1,531 |
| `show` | theatres, arena, fighting pits, gambling, performers, bardic college, brothels | 2,929 | 750 |
| `pit` | mine, quarry, salt works, peat, charcoal, woodcutter, sawmill, smelter | 2,748 | 1,080 |
| `blades` | mercenaries, free company, hired blades, adventurers' guilds, charter and hireling halls, veteran's lodge | 2,351 | (above) |
| `healer` | hospitals, apothecaries, midwife, healer, alchemists | 2,060 | 876 |
| `water` | fish market, landings, docks, harbour, ferry, boatyard, shipyard, barges | 1,498 | 889 |
| SILENT `criminal` | every criminal house | 2,919 | 765 |
| SILENT `works` | water sources, housing, dwellings, sewers (no keeper; a card a quote would read oddly on) | 3,873 | 1,800 |
| SILENT `exotic` | golems, dragon, airship docking, planar traders (260 cards; too few to write for) | 260 | 90 |

**Condition** (the row's own mark, `display/crisisStoppedRow.js :: rowMarkText`, the one the page prints; else the town's crisis):

| condition | reads | cards |
|---|---|---|
| `ordinary` | no mark, no crisis in force | 42,177 |
| `crisisunmarked` | no mark on the row, a crisis in force in the town | 17,261 |
| `short` | "Short of {good}." (the house's input; `{good}` guaranteed) | 500 |
| `crisismarked` | "Stopped by / Curtailed by the siege", "Curtailed by the outbreak", "Scarce in the famine", "Curtailed by the war" | 484 |
| `failing` | "Failing / Abandoned: a failed venture." (32 cards): PROPOSED SILENT | 32 |

NO "thriving" state: the record holds none for a house. A family line claims nothing of calm, so it serves `crisisunmarked` too.

## 2. A POWER's CARD: key `power.<role>-<state>`

The seat as the Power tab reads it (`dossier/powerStrata.js :: derivePowerStrata`, PowerStrata's Uncontested / Contested /
Critical), the legitimacy label and the capture rung (`powerStructure.publicLegitimacy`, `criminalCaptureState`). One state a
card, first match wins:

| key | when | towns |
|---|---|---|
| `seat-captured` | capture rung corrupted or capture | 71 |
| `seat-doubted` | seat Critical, or legitimacy Contested or Legitimacy Crisis | 564 |
| `seat-contested` | a contender presses the seat | 797 |
| `seat-secure` | none of the above | 368 (thorps and hamlets: 350 of them) |
| `lesser-contender` | a lawful power that presses the seat (religious 898, military 858, merchant 502, arcane 243, noble 179, other 96) | 2,776 |
| `lesser-standing` | a lawful power that does not (merchant 651, government 369, arcane 243, noble 225, religious 184, military 157, other 68) | 1,897 |
| SILENT | a criminal power, the seat included (39 towns) | 244 |

## 3. A CURRENT TENSION's CARD: key `tension.<group>`

`history.currentTensions[].type`: 29 types. The cause the card prints (`display/tensionCause.js`, 8 kinds with a table) is counted
in my notes and NOT keyed: no line I write needs it, and keying 60 causes three lines each is 180 lines. Groups (cards; the
types in each):

| group | cards | types | severe (major/catastrophic) |
|---|---|---|---|
| `rule` | 322 | legitimacy_crisis 142, tyranny 96, popular_uprising 84 | 322 |
| `trade` | 313 | guild_conflict 246, trade_dispute 67 | |
| `want` | 296 | resource_scarcity 259, demographic_pressure 37 | |
| `money` | 295 | outside_debt 123, market_crash 54, trade_collapse 65, economic_disparity 53 | |
| `calamity` | 269 | plague_years 92, great_fire 87, great_flood 90 | 269 |
| `faith` | 249 | religious_tension 99, heresy_trial 89, pilgrimage_surge 61 | |
| `crime` | 241 | crime_wave | |
| `neighbours` | 233 | generational_divide 86, population_friction 69, disputed_land 78 | |
| `succession` | 220 | succession_crisis 138, leadership_vacuum 82 | 82 |
| `threat` | 196 | external_threat | 196 |
| `arcane` | 174 | magical_controversy 107, wild_magic 67 | |
| `mistrust` | 141 | infiltration_fear 80, occupation_legacy 61 | 61 |
| `graft` | 123 | corruption_scandal | |

Commonest causes printed: guild_conflict.rival_power 104, resource_scarcity.war_levy 79, great_flood plain 74, guilds_rule 72.

## 4. THE CRISIS CARD: key `crisis.<group>`

`facts/crisisKind.js :: crisisOf(s).kinds`, the 15 kinds; slave_revolt 0 on the corpora. Groups (crises):

| group | kinds | count |
|---|---|---|
| `seat` | succession_void 49, politically_fractured 53 | 102 |
| `war` | wartime 68, occupied 21 | 89 |
| `trust` | recently_betrayed 54, infiltrated 35 | 89 |
| `debt` | indebted | 54 |
| `raids` | monster_pressure | 52 |
| `hunger` | famine | 45 |
| `rising` | insurgency 44, slave_revolt 0 | 44 |
| `siege` | under_siege | 38 |
| `newcomers` | mass_migration | 37 |
| `sickness` | plague_onset | 28 |
| `faith` | religious_conversion | 16 |

## 5. A TRADITION's ROW: key `trad.<act>` (the acts of `data/traditionCorpus.js`), and `trad.any-crisis`

feast 1,451 · fair 1,236 (needs a market) · procession 914 · offering 675 · vigil 654 · contest 604 · `any-crisis`: a row in a
town under a crisis 1,714 (31%).

## 6. A PERSON's OWN CARD: key `person.<family>` (the family of the person's own house)

craft (workshop) 13,687 · lore (learning, show) 6,097 · land (grain, field, water) 5,880 · table (inn) 4,925 · order (watch,
blades) 5,010 · trade (market) 4,533 · office (hall, and a power's own face 566) 2,897 · pit 2,748 · faith 2,511 · care
(healer) 2,060. SILENT: exotic houses 260, no house 71.

## THE FOUR VERSIONS (the stored disposition, `npc.presentation.disposition`)

Lawful public people: transactional 15,521 · cautious 15,461 · welcoming 14,509 · dismissive 5,117 · NONE 71 (the `civic`
cards). PROPOSED: a card with none speaks the transactional version (`npcData.js :: dealingLineFor`'s own fallback).
MY RULE FOR THE FOUR (the same thought, the same claim; only the manner moves): WELCOMING offers more, invites, warms;
TRANSACTIONAL puts it in terms of cost, work and what is owed; CAUTIOUS hedges and keeps something back; DISMISSIVE is short
and closes the talk.

## THE SLOTS, AND THE VALUES THEY TAKE ON THE CORPORA

- `{crisisNoun}` (`crisis/crisisNoun.js :: CRISIS_NOUN`): siege, famine, occupation, split between the powers, debt crisis,
  betrayal, infiltration, outbreak, succession crisis, raids, insurgency, conversion, revolt, war, migration. On a
  `crisismarked` card only siege, outbreak, famine, war. My lines write "the {crisisNoun}".
- `{good}` (the `short` mark's noun): stone 145, iron ore 66, timber 56, wool 33, hides 33, game 31, livestock 28, clay 20,
  ITS MATERIALS 18, peat 17, fish 13, coal 13, glass sand 11, grapes 9, iron 8, grain 3, salt, medicinal herbs, luxury goods;
  two joined by "or" where a house lacks two. "its materials" cannot be said in the first person: PROPOSED the engine passes
  "what we work with" for it, or the card is silent.
- `{thing}`: AVOIDED. The card names are often plural or compound ("Mills", "Weavers/Textile workers", "Access to parish
  church", "Inns and taverns", "Mayor and council", "Military/Guard"): a verb or article cannot agree with all of them. My
  lines say the family's own concrete nouns instead (the stones, the bench, the rites, the hall).
- `{place}`: used sparingly; any town name reads.

## THE ARITHMETIC (A RULING THE CHAIR MUST MAKE BEFORE (C))

At three lines a state, the keys above need: institutions 14 families x 3 + short 3 + crisismarked 3 + crisisunmarked 3 = 51;
powers 6 x 3 = 18; tensions 13 x 3 = 39; crises 11 x 3 = 33; traditions 7 x 3 = 21; persons 10 x 3 = 30. **192 lines, 768
sentences, not 110.** The brief's own list of kinds (fifteen crises, 29 tension types, twelve institution families, ten role
families, six acts) cannot be held at three a state inside 110. Three ways, for the chair:
- (i) **192 as keyed** (my recommendation if the window allows: deepest where the cards are commonest).
- (ii) **153**: persons share the keeper lines of their own house's family (a miller's own card draws the mill's keeper
  lines: the person speaks of their trade, which the charter's "one line in their own voice" allows), leaving 3 lines for a
  power's own face: saves 27; tensions merged to 10 (graft into crime, succession into rule, mistrust into neighbours):
  saves 9; institutions' `blades` into `watch`: saves 3. Merging crisis groups further is NOT advised (a siege line, a war
  line and a debt line do not read for one another).
- (iii) **110**: (ii) and two lines a state where a state is rare (under 100 cards): crisis groups, `captured`, the slot
  states. It breaks "at least three a state".
The sample (B) is keyed as (i), so its sixty lines stand under any of the three.

## THE CHECKS EVERY LINE PASSED (the sample's builder, kept in my scratch)
Each of the 240 sentences of (B): 6 to 22 words; no digit; no slot outside the four; a slot only where the row declares it;
no tab or double quote. Number words: none as a count; "one" stands only as a pronoun or an idiom ("no one", "the last one",
"the people one tells") and "first" only in "first pick", "say it first" (17 sentences; listed by the builder): the chair to
rule if those too must go.
