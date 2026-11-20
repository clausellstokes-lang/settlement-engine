# TROUBLE-HOOK-THEMES: the trouble hooks, each beside a proposed theme (PAGE-10's builder; DRAFT for the chair's eye, VETOABLE, the owner's)

The brief: `briefs/THEMES-DRAFT.md`. Source: `src/data/troubleHooks.js :: TROUBLE_HOOKS` at `41edc9410`, with legitimacy_crisis line 9
(the one whose need is `seat outranked`) STRUCK by the chair and left out, so this table has **85 rows** (the file at that commit has 86).

- **index** is the row's 0-based position in its kind's pool AFTER the strike, i.e. its slot in `TROUBLE_HOOK_THEMES[kind]` (the chair's line number less one).
- **needs** is the row's `needs`; `!atom` is an `excludes` atom; `+` joins them.
- **proposed theme** is a member of `src/domain/hookThemes.js :: HOOK_THEMES`, no other word; `ASK` where none fits. Usage follows the authored
  table in that file (`AUTHORED_HOOK_THEMES`): a line that echoes one of its templates takes that template's theme, and the reason names it.
- **reason** appears only where the choice is close (at most eight words).

| kind | index | text | needs | proposed theme | reason |
|---|---|---|---|---|---|
| crime_wave | 0 | The crime wave is coordinated. Someone is directing it to create a pretext | none | `crime_ring` | directed crimes; the pretext reads ambition |
| crime_wave | 1 | A guard captain is on the payroll of the criminal network | `watch` + `organised crime` | `corruption` | per authored "paying their soldiers" |
| crime_wave | 2 | Those who would take the law into their own hands have picked out a culprit on bad information | none | **ASK** | vigilantes scapegoat someone; no mob-justice theme |
| crime_wave | 3 | A household woke to find its door forced and nothing taken, and wants to know what the thieves were looking for | none | `looming_threat` | per authored "robbed like a professional" |
| crime_wave | 4 | A boy who runs errands for half the place has started carrying more coin than any errand pays | none | `crime_ring` | per authored "son comes home with coin" |
| crime_wave | 5 | Those who talk of taking the law into their own hands meet tonight, and they want someone who can fight | none | **ASK** | vigilantes recruiting fighters; no mob-justice theme |
| crime_wave | 6 | A household robbed in the night swears the robber knew which chest held the money | none | `betrayal` | inside knowledge, per authored "hidden savings" |
| crime_wave | 7 | A stallholder at the market has stopped reporting thefts, and will not say why | `market` | `crime_ring` | silenced victim; blackmail close |
| crime_wave | 8 | A watchman afraid of the night round is looking for someone to walk it with him, and will pay from his own purse | `watch` | `looming_threat` |  |
| crime_wave | 9 | A shopkeeper has been told to close by the end of the week, by people who did not give their names | `organised crime` | `crime_ring` | a protection racket |
| crime_wave | 10 | Two crews have been seen arguing over the same ground, and a fight between them looks a night away | `rival rings` | `rivalry` | two crews; crime_ring close |
| crime_wave | 11 | A thief caught in the act is being held in a cellar by the household that caught him, and nobody knows what to do with him next | `law: ≤ critical` | **ASK** | household holds a thief; no self-justice theme |
| crime_wave | 12 | A cart left loaded overnight was emptied before dawn, and the carter wants to know who was awake | none | **ASK** | one night theft, culprit unknown; no theft theme |
| crime_wave | 13 | An old woman's savings have gone from under her floor, and only her family knew where they were kept | none | `betrayal` | only family knew, per authored "hidden savings" |
| crime_wave | 14 | A pedlar is selling goods cheap that several households swear were taken from them | none | `smuggling` | fencing, per authored "stolen ring" line |
| crime_wave | 15 | Chalk marks have appeared on several doors overnight, and the households behind them are frightened | none | `looming_threat` | per authored "name scratched into door" |
| guild_conflict | 0 | A guild master's records have gone missing ahead of an audit | `guild` | `corruption` | per authored "ledger missing, auditor coming" |
| guild_conflict | 1 | A journeyman denied mastership has proof the exam was rigged | `guild` | `corruption` | rigged exam; ambition close |
| guild_conflict | 2 | Someone is sabotaging both sides to destabilize the market for a third party | `market` + `guild` | `ambition` | a hidden third party; rivalry close |
| guild_conflict | 3 | A trader selling outside the rules has had a cart overturned in the night, and has a fair idea who did it | none | `rivalry` |  |
| guild_conflict | 4 | A craftsman working from home has been told to stop selling, and means to carry on | none | `rivalry` |  |
| guild_conflict | 5 | Both sides of the quarrel over trade are counting heads before the next gathering, and each is a few short | none | `rivalry` |  |
| guild_conflict | 6 | A family that sells to both sides is being pressed to choose, and has asked for a few more days | none | `divided_loyalty` | pressed to choose sides |
| guild_conflict | 7 | A stall at the market has been promised to two traders at once, and both will turn up at dawn | `market` | `rivalry` | authored double-promises split rivalry/scarcity_pressure |
| guild_conflict | 8 | The guild is about to fine a member for buying from an outsider, and the member has threatened to name who else does it | `guild` | `blackmail` | threat to name others |
| guild_conflict | 9 | A trader turned away from selling is taking the matter to the court, and needs a witness who saw it | `court sits` | `rivalry` | per authored "quarrel before dispute-settlers" |
| guild_conflict | 10 | A boat's cargo sits unloaded at the water's edge while the two sides argue over who may sell it | `navigable` | `rivalry` | scarcity_pressure close |
| guild_conflict | 11 | A trader outside the guild has been offered protection by people outside the law, and is tempted | `organised crime` | `crime_ring` |  |
| guild_conflict | 12 | An apprentice has run from one side of the quarrel to the other, and taken a master's tools along | none | `betrayal` | per authored "apprentice brings the recipes" |
| guild_conflict | 13 | A craftsman has made goods for a trader who is not allowed to sell them, and wants paying regardless | none | `hidden_debt` | unpaid work, per authored "owes a year's takings" |
| guild_conflict | 14 | A trader at the market has been selling under the agreed price, and a crowd is expected at the stall tomorrow | `market` | `rivalry` | undercutting; looming_threat (the crowd) close |
| guild_conflict | 15 | A guild master has quietly bought from a trader outside the guild, and someone saw it happen | `guild` | `corruption` | master breaks own rule; blackmail close |
| resource_scarcity | 0 | A store of the scarce goods is being kept off the market on purpose | `market` | `scarcity_pressure` | deliberate hoarding; corruption close |
| resource_scarcity | 1 | The scarcity was engineered. Someone destroyed the competing supply route | none | `rivalry` | sabotaged competitor; ambition close |
| resource_scarcity | 2 | An alternative source exists but the information is being suppressed | none | `forbidden_knowledge` | a suppressed truth; corruption close |
| resource_scarcity | 3 | A household caught hoarding is about to be turned out by its neighbours, and swears it was keeping the goods for others | none | `scarcity_pressure` |  |
| resource_scarcity | 4 | A carter offers to fetch what is short from elsewhere, if someone will pay half the price before he sets out | none | `scarcity_pressure` |  |
| resource_scarcity | 5 | A family that cannot pay the prices asked is selling its last good tools to buy what it needs | none | `scarcity_pressure` |  |
| resource_scarcity | 6 | With the place going hungry, a sack of food has gone missing from a household that had little to spare | `famine` | `scarcity_pressure` | per authored "eggs and bread" line |
| resource_scarcity | 7 | A party sent to take supplies for the war is due tomorrow, and households are hiding what they can | `war: at war` | `scarcity_pressure` | requisition; looming_threat close |
| resource_scarcity | 8 | A boat has come in loaded with what is short, and its master is asking twice what anyone here can pay | `navigable` | `scarcity_pressure` |  |
| external_threat | 0 | The threat is being exaggerated by someone who profits from selling to the fearful | `!war: peace` | `corruption` | profiteering on fear |
| external_threat | 1 | A way to come to terms exists, and those who want a fight are keeping it quiet | `!war: peace` | `forbidden_knowledge` | a suppressed truth; betrayal close |
| external_threat | 2 | The threat has an agent already inside the settlement | none | `secret_identity` | a hidden agent; betrayal close |
| external_threat | 3 | A rider brings fresh news of the danger tonight, and it does not match what the last one said | none | `looming_threat` |  |
| external_threat | 4 | A family is packing to leave before dawn, and the neighbours are trying to stop them spreading panic | none | `looming_threat` |  |
| external_threat | 5 | Someone nobody here knows has been asking about the paths in and out, and has asked for a bed for the night | none | `outsider_suspicion` | per authored "traveller asking which nights" |
| external_threat | 6 | A stretch of the wall has been found crumbling, and mending it needs more hands than there are | `walls` | `looming_threat` | short of hands; scarcity_pressure close |
| external_threat | 7 | Those who keep order are calling for volunteers, and the first to come forward is the last one anyone expected | `guardPresence` | **ASK** | an unexpected volunteer; no theme fits |
| external_threat | 8 | Tracks of the beasts that press on this place have been found beside a well-used path, closer than ever | `crisis: monster_pressure` | `looming_threat` |  |
| succession_crisis | 0 | A would-be heir approaches outsiders to investigate a rival's past | `ruler: lord` | `succession` | rivalry close |
| succession_crisis | 1 | The ailing ruler wants a final errand completed before naming a successor | `!ruler: council` + `!ruler: elder` + `!crisis: succession_void` | `succession` |  |
| succession_crisis | 2 | Someone is poisoning the ruler slowly, and someone in the household knows | `!ruler: council` + `!ruler: elder` + `!crisis: succession_void` | `betrayal` | a poisoner within; succession close |
| succession_crisis | 3 | One of the would-be successors is giving a feast tonight, and every guest will be counted | none | `succession` |  |
| succession_crisis | 4 | A would-be successor wants a rival's supporters watched, quietly, and is offering coin for it | none | `succession` | rivalry close |
| succession_crisis | 5 | A letter meant for one would-be successor has reached another, and both now know what it says | none | `succession` | a leaked letter; forbidden_knowledge close |
| succession_crisis | 6 | A household that has backed no one is visited by each side in turn, and has asked for protection from both | none | `divided_loyalty` | pressed to choose sides |
| succession_crisis | 7 | A council member has not yet said whom they back, and their house was broken into last night | `ruler: council` | `succession` | intimidating a backer; looming_threat close |
| succession_crisis | 8 | With the seat empty, the seal used on the place's business has gone missing | `crisis: succession_void` | `succession` |  |
| outside_debt | 0 | The original loan documents contain a clause that was never disclosed publicly | none | `hidden_debt` | per authored "clause they didn't read" |
| outside_debt | 1 | A creditor's agent is in town conducting a quiet assessment before enforcement | `!crisis: under_siege` | `hidden_debt` | enforcement coming; looming_threat close |
| outside_debt | 2 | The debt could be voided, if someone can prove it was obtained through fraud | none | `corruption` | a fraudulent loan; hidden_debt close |
| outside_debt | 3 | The one who kept the accounts of the loans has gone missing a week before the collectors are due | none | `vanished_person` |  |
| outside_debt | 4 | A family that would bear the cost is quietly moving its goods out of the place, cart by cart | none | `hidden_debt` | flight from the debt; betrayal close |
| outside_debt | 5 | The outside power has sent word of the day it will collect, and wants to know who will meet its people | none | `hidden_debt` | looming_threat close |
| outside_debt | 6 | The creditors have taken a household's goods against the debt, and the household wants them back before they leave | `crisis: indebted` | `hidden_debt` |  |
| outside_debt | 7 | A wealthy household offers to pay the debt itself, in return for a say in how the place is run | `prosperity: ≥ prosperous` | `ambition` | per authored "controlling interest" line |
| outside_debt | 8 | A trader at the market is selling off stock cheap before the collectors arrive, and seems to know the day | `market` | `corruption` | insider knowledge, per authored "property" line |
| legitimacy_crisis | 0 | A document that would settle the question of legitimacy exists, and both sides would rather it stayed lost | none | `forbidden_knowledge` | buried proof; succession close |
| legitimacy_crisis | 1 | Those in power are paying people to speak for them at the gatherings, because no one will do it for free | none | `corruption` |  |
| legitimacy_crisis | 2 | A third party is keeping the question open on purpose, because an unsettled claim is easier to bargain with | none | `ambition` | a hidden third party; rivalry close |
| legitimacy_crisis | 3 | Someone has painted a challenge to the authority's right to rule where everyone will see it at dawn, and those in charge want the hand found | none | `rivalry` | per authored "petition wants an answer" |
| legitimacy_crisis | 4 | A speaker who questions the right to rule is due at a gathering tonight, and those in charge mean to stop the gathering | none | `rivalry` | per authored "petition wants an answer" |
| legitimacy_crisis | 5 | One of those who deny the mandate has been offered a post by those in charge, and has not yet answered | none | `divided_loyalty` | dissenter offered office; corruption close |
| legitimacy_crisis | 6 | Those risen against the authority have seized a store of supplies, and the keeper of it is missing | `crisis: insurgency` | `vanished_person` | the missing keeper; scarcity_pressure close |
| legitimacy_crisis | 7 | A preacher of the new faith is telling crowds that those in charge rule without blessing | `crisis: religious_conversion` | `faith_crisis` |  |
| corruption_scandal | 0 | The investigator who uncovered the corruption has received a death threat | none | `looming_threat` |  |
| corruption_scandal | 1 | A key witness can be found, but won't speak without protection | none | `looming_threat` | a frightened witness; corruption close |
| corruption_scandal | 2 | The corruption goes higher than anyone yet suspects; those pressing to expose it are being used | none | `corruption` | betrayal close |
| corruption_scandal | 3 | A copy of the evidence is being passed from hand to hand, and one copy differs from the rest | none | `betrayal` | forged copy, per authored "forged seal" |
| corruption_scandal | 4 | An official named in the evidence is selling property in a hurry | none | `corruption` |  |
| corruption_scandal | 5 | Someone has offered to buy the evidence outright, for more than it seems worth | none | `blackmail` | evidence as leverage; corruption close |
| corruption_scandal | 6 | The hearing on the evidence is set for next week, and the clerk who was to read it out has fallen ill | `court sits` | `corruption` | convenient illness; looming_threat close |
| corruption_scandal | 7 | One of those who betrayed the place is named in the evidence, under another name | `crisis: recently_betrayed` | `secret_identity` |  |
| corruption_scandal | 8 | A trader who paid dues to the corrupt has kept every receipt, and is deciding whom to give them to | `market` | `forbidden_knowledge` | per authored "overheard a bribe" |

## Count per theme (85 rows)

| theme | rows |
|---|---|
| `hidden_debt` | 6 |
| `forbidden_love` | 0 |
| `secret_identity` | 2 |
| `divided_loyalty` | 3 |
| `smuggling` | 1 |
| `blackmail` | 2 |
| `rivalry` | 11 |
| `betrayal` | 5 |
| `corruption` | 11 |
| `succession` | 7 |
| `faith_crisis` | 1 |
| `vanished_person` | 2 |
| `forbidden_knowledge` | 4 |
| `old_wound` | 0 |
| `looming_threat` | 9 |
| `scarcity_pressure` | 7 |
| `crime_ring` | 5 |
| `outsider_suspicion` | 1 |
| `ambition` | 3 |
| `grief` | 0 |
| **ASK** | 5 |

## Every ASK (5)

- crime_wave 2: vigilantes scapegoat someone; no mob-justice theme
- crime_wave 5: vigilantes recruiting fighters; no mob-justice theme
- crime_wave 11: household holds a thief; no self-justice theme
- crime_wave 12: one night theft, culprit unknown; no theft theme
- external_threat 7: an unexpected volunteer; no theme fits

Three of the ASKs (crime_wave 2, 5, 11) are one beat the closed set lacks: people taking the law into their own hands. Whether to amend
`HOOK_THEMES` (J-HK-3, the owner's) or to answer them with a nearest member is the chair's to rule.
