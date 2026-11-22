# TROUBLE-LINES-1: a trouble's hooks and lasting effects, eight kinds (PAGE-7's builder, brief `briefs/TROUBLE-LINES.md`, 2026-11-20)

Words only, VETOABLE (the owner's). Nothing under `src/` or `tests/` was touched. The measure, its outputs and the pools as
data are in `measures/page-7/hooks/`: `measure.mjs` (900 towns `hxd-<size>-0..149`, built as `page-5/sim.mjs` builds them;
the final record), `measure.today.out.txt` (step 1), `pools.mjs` (these lines as data) and `measure.pools.out.txt` (the
same 900 towns with these pools in place of today's lists). The chair's census was re-run as asked
(`chair-census.mjs` and `chair-narr.mjs`, copied from `origin/lane/chair-2026-11-08`; output `census.json`, `census.city.out.txt`,
`census.metropolis.out.txt`). It gives the same rows: in cities, `currentTensions[].plotHooks[]` has 92 texts, 7.3 a place,
and the commonest prints in 27 of 50 places; `lastingEffects[]` has 32 texts, 3.9 a place, and the commonest prints in
27 of 47 places.

## Where today's lines come from (the sources)

- **Data:** `src/data/historyData.js :: HISTORICAL_EVENTS_DATA[type].plotHooks` and `.lastingEffects`, with the
  `byMemory.unanchored.plotHooks` copy that replaces the list when the timeline holds no event of the type
  (crime_wave and guild_conflict carry one). The data file also holds the tier twins and fact twins of the lasting effects:
  `historyData.js :: HISTORY_DESC_SIBLINGS`, the "TAIL-HISTORY-4 batch 5" and "TAIL-HISTORY-5 batch 6" rows. It also holds
  the hook swap for an approved seat, `historyData.js :: LEGITIMACY_HELD_TWINS`, applied by `legitimacyHeldTensions`.
  `src/data/historyDescVariants.js :: HISTORY_DESC_VARIANTS` holds descriptions only, and no hook or effect.
- **Generator:** `src/generators/historyGenerator.js :: buildHistoricalEvent`, with `tensionByMemory` before it. A current
  tension stores the template's WHOLE hook list after `drawDeclared.js :: filterDeclared`, so a refused row leaves the list.
  It also stores the WHOLE effect list after `generators/history/sizedLastingEffects.js :: sizedLastingEffects`, so a row
  takes its twin or is dropped. There is no draw and no choice: **two places with one kind share every line.** At assembly,
  `src/generators/power/rosterText.js :: settleTensionsToRoster` runs `legitimacyHeldTensions` again. The timeline's own
  events are a separate path (`generateEventNarrative`: drawn by `randInt`, resolved by `resolveTimelineHook`), and these
  pools do not touch it.
- **The page:** `src/domain/dossier/plotHooks.js :: collectPlotHooks` (the Plot Hooks tab, `PlotHooksTab.jsx`; counted on
  `SummaryTab.jsx`) prints a tension's hooks, and so does `src/pdf/lib/viewModel.js :: buildViewModel` (`tensions[].hooks`,
  via `cleanHooks`). `src/components/new/tabs/HistoryTab.jsx :: TensionRow` prints only the description and the camps.
  **No page code prints a tension's `lastingEffects`.** It is stored, searched (`dossierSearch.js` indexes the description
  only) and veiled (`galleryVeil.js`), but never printed. The census counts it as a stored sentence.

## Step 1, the measure (count lines of `measure.today.out.txt`)

- KINDS, the 900 towns: 1543 tensions of 29 kinds. The eight commonest are crime_wave 231 · guild_conflict 215 ·
  resource_scarcity 114 · external_threat 79 · succession_crisis 74 · outside_debt 63 · legitimacy_crisis 58 ·
  corruption_scandal 51.
- How many lines a place prints today. The template holds 3 hooks and 2 effects; legitimacy_crisis holds no effects.
  - crime_wave prints 3 hooks in 190 places and 2 in 41 (the watch row is refused in small places).
  - external_threat prints 1 hook in 53 places (the two war rows exclude `war: peace`).
  - succession_crisis prints 1 hook in 68 places (two rows exclude a council, an elder or `crisis: succession_void`).
  - resource_scarcity prints 2 hooks in 66 places (no market).
  - Every effect list holds 2 lines. In resource_scarcity and external_threat those 2 are taken by size from 5 or 6 twins.
- Three places of one size in a row (seeds i, i+1, i+2) where two of them print one same string:
  - **Hooks: 48.0% of all triples** (thorp 16.2 · hamlet 20.3 · village 24.3 · town 45.9 · **city 87.2 · metropolis 93.9**).
  - **Effects: 43.6% of all triples** (thorp 13.5 · hamlet 14.9 · village 14.2 · town 41.2 · **city 84.5 · metropolis 93.2**).
  - In the cities, each of crime_wave's five lines (3 hooks, 2 effects) prints in 79 of 150 places, and each of
    guild_conflict's prints in 75. In the metropolises, guild_conflict's print in 88 of 150 and crime_wave's in 79.
- The rates of the facts per kind are listed beside each need below. They come from the `FACT` lines of step 1, or, for the
  atoms step 1 did not list, from the `NEW … needs` lines of the pools run (the same 900 towns and the same tensions).

## How the lines are chosen (no new draw)

For each tension, read the record at the point where today's list is written:

1. A line is ADMITTED where its need holds: `atomHolds(need, factsOf(record)) === true`, or the need is `none`.
2. The admitted lines are ranked by `fnv1a32(`${seed}::trouble::${kind}::hook::${text}`)`, highest first, and the top
   **3 hooks** are kept. Effects use the key `::effect::` and the top **2** are kept.

The stored arrays keep their length (3 and 2): only the strings move. Every pool has at least three lines that need
nothing, so no place prints a short list. The pools run found **0 short lists in 1543 tensions** (`short 0/n` on every
pool).

These pools replace the tier twins and the fact twins. Each line carries its own need instead, so a line that needs
`tier: ≤ village` or `market` takes the twin's place. Any byMemory copy of a hook list goes too
(`byMemory.unanchored.plotHooks`): the pool belongs to the kind, not to the memory.

All 33 needs used here are atoms the vocabulary already holds (`ATOMS 33 needs used, unknown to the vocabulary: none`).
**No new atom is asked for.**

**Shares (the brief's 37.5%).** Where every need holds, a line prints in 3/n of a kind's places (hooks; 3/9 is 33.3%) or
2/n (effects; 2/8 is 25%). Where few needs hold, the need-nothing lines print more often. Each pool's largest measured
share is given below.

The rule: the eight lines are worded so each one is true of the record. A stored line stays only if it claims nothing
the record lacks. A line marked "kept" is today's string, verbatim, gated by the need shown.

---

## crime_wave (231 tensions; city 79, metropolis 79)

**The kind's stored sentence:** "Crime is rising faster than those in charge can answer it, and some talk of taking the law
into their own hands" (`byMemory.unanchored`; the timeline held no crime_wave event in any of the 900 towns).
**Its camps:** the force party, those who would take the law into their own hands, and the criminal organisations.

**Stored hooks.** All three are judged false to the record:
- "The crime wave is coordinated. Someone is directing it to create a pretext" (231/231). It invents a secret and a
  director as fact.
- "A guard captain is on the payroll of the criminal network" (190/231; needs `watch`). It invents a crime and a person,
  and "the criminal network" presumes organised crime, while 15.6% of these places read `diffuse`.
- "Those who would take the law into their own hands have picked out a culprit on bad information" (231/231). It invents
  an event: the record holds only the talk.

**Stored effects.** Both are judged false to the record:
- "An expanded watch and a night curfew survive from the crackdown" (231/231). The crackdown is a past event the timeline
  lacks (0 of 231), and the curfew is an ordinance the record lacks.
- "Vigilante bands never fully disbanded and still operate quietly" (231/231). It claims past bands; the record holds only
  talk of taking the law into one's own hands.

**Hooks** (9; 4 need nothing; the largest share is 46.8%, with the city at 53.2% and the thorp at 84.6%, because a thorp
meets few needs):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Some here talk of taking the law into their own hands; who speaks loudest for it, and whom would they go after first? | none | 100% |
| 2 | Which crimes are rising here, and who has suffered them most? | none | 100% |
| 3 | Those in charge cannot answer the rising crime alone, and may welcome help from outside. | none | 100% |
| 4 | Who in this place is better off for the rising crime, and does anyone else see it? | none | 100% |
| 5 | The watch cannot keep pace with the crime; which hours and which ground does it leave uncovered? | `watch` (`defence.js :: defenceOf`) | 82.3% |
| 6 | Organised crime works this place; is the rise its own doing, or are lesser hands taking their chance? | `organised crime` (`criminalStructureKey.js :: criminalStructureKeyOf`) | 84.4% |
| 7 | Rival rings work this place and none rules the rest; is the rising crime their quarrel spilling over? | `rival rings` (`rivalRings.js :: rivalRingsStand`) | 30.7% |
| 8 | The law here has all but given way; who still answers when a neighbour is wronged? | `law: ≤ critical` (`lawBand.js :: lawBandOf`) | 14.7% |
| 9 | The traders at the market feel the rising crime first; which of them would pay to see it stopped? | `market` (`market.js :: marketOf`) | 84.4% |

**Lasting effects** (8; 3 need nothing; the largest share is 35.1%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Households bar their doors at night and keep their valuables close. | none | 100% |
| 2 | Few go about alone after dark. | none | 100% |
| 3 | Neighbours keep a closer eye on strangers than on one another. | none | 100% |
| 4 | The watch is stretched thin, and more is asked of it than it can give. | `watch` (`defence.js :: defenceOf`) | 82.3% |
| 5 | Traders take their goods in before dark and leave nothing out overnight. | `market` (`market.js :: marketOf`) | 84.4% |
| 6 | Part of what the place earns comes from outside the law, and few speak of it openly. | `criminal income` (`criminalIncome.js :: criminalIncomeOf`) | 81.0% |
| 7 | Wrongs go unanswered by the law, and people settle them among themselves. | `law: ≤ critical` (`lawBand.js :: lawBandOf`) | 14.7% |
| 8 | Strangers are asked their business at the gate. | `gate` (`defence.js :: defenceOf`) | 79.2% |

## guild_conflict (215; town 49, city 75, metropolis 88)

**The kind's stored sentence:** "Guild and non-guild traders are fighting over who may sell what, and over a say in how the
place is run" (unanchored). Where the timeline holds the guild war (14.0%), its own sentence or variant is used instead.

**Stored hooks.** All three are judged false to the record:
- "A guild master's records have gone missing ahead of an audit" (215/215). It invents an event and an audit.
- "A journeyman denied mastership has proof the exam was rigged" (215/215). It invents a person and a secret.
- "Someone is sabotaging both sides to destabilize the market for a third party" (185/215), with its twin "…both
  guilds…" (30/215). Both invent a secret and a party.

**Stored effects.** Both are judged false to the record:
- "Guild membership rolls now audited by an outside adjudicator" (215/215). It claims an office the record lacks, set up
  after a past event that 86% of these places lack.
- "One guild's charter was revoked and never fully restored" (215/215). It claims a past event the record lacks.

**Hooks** (9; 4 need nothing; the largest share is 43.7%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Who may sell what is the quarrel here; which trade is fought over hardest, and why that one? | none | 100% |
| 2 | Those without a voice in how the place is run want one; whom would they choose to speak for them? | none | 100% |
| 3 | Each side in the quarrel over trade is looking for allies; who has not yet chosen? | none | 100% |
| 4 | What would either side accept to end the quarrel, and who would be left out of the bargain? | none | 100% |
| 5 | The guild guards who may sell what; which of its rules would it least like to see tested? | `guild` (`guild.js :: guildOf`) | 99.5% |
| 6 | The quarrel is fought out at the market itself; whose goods are turned away, and who decides? | `market` (`market.js :: marketOf`) | 100% |
| 7 | A court sits here; would either side bring the quarrel before it, and at what cost? | `court sits` (`defence.js :: courtHoldersOf`) | 93.0% |
| 8 | Goods come in by water here; who may land and sell them, and who says so? | `navigable` (`water.js :: waterOf`) | 42.3% |
| 9 | Organised crime works this place too; does either side in the quarrel over trade deal with it? | `organised crime` (`criminalStructureKey.js`) | 81.9% |

**Lasting effects** (8; 3 need nothing; the largest share is 30.7%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Buyers ask who made a thing before they ask its price. | none | 100% |
| 2 | Traders on either side of the quarrel will not deal with the other. | none | 100% |
| 3 | Prices differ with who is selling, and everyone knows which side is cheaper. | none | 100% |
| 4 | Goods without the guild's mark are sold quietly, or not at all. | `guild` (`guild.js :: guildOf`) | 99.5% |
| 5 | Some stalls at the market stand empty while the right to trade from them is argued. | `market` (`market.js :: marketOf`) | 100% |
| 6 | Quarrels over who may trade are common business for the court. | `court sits` (`defence.js :: courtHoldersOf`) | 93.0% |
| 7 | Apprentices on one side of the quarrel do not cross to the other. | `guild` (`guild.js :: guildOf`) | 99.5% |
| 8 | Every new trader who arrives is asked, first of all, which side they are on. | `tier: ≥ town` (record.tier) | 98.6% |

## resource_scarcity (114; thorp 25, hamlet 26, village 21)

**The kind's stored sentence:** "A critical resource is running short, and some are hoarding it while others cannot pay
the prices asked" (unanchored). Where the stress path writes one, it is the livelihood lead and the top issue instead.
**Its camps** in every case: those hoarding, those who cannot pay, and those who would fix a fair price.

**Stored hooks:**
- "A store of the scarce goods is being kept off the market on purpose" (48/114; needs `market`) is **kept**. It is the
  hoarding the camps already name.
- "The scarcity was engineered. Someone destroyed the competing supply route" (114/114) is false: it invents a crime and a
  route.
- "An alternative source exists but the information is being suppressed" (114/114) is false: it invents a secret.

**Stored effects.** All six are judged false to the record:
- "Emergency grain reserves mandated by ordinance since the shortage" (60/114). It claims a past shortage, an ordinance,
  and grain the record does not name as the scarce good.
- Its twins "Every household has put grain by against lean years since the shortage" (33/114) and "Grain was put by
  against lean years after the shortage, and it has not been enough" (21/114). Both claim a past shortage and grain.
- "Price ceilings on the affected goods still enforced in lean seasons" (48/114). The camps say some WOULD fix a fair
  price, so none is fixed.
- Its twin "In lean seasons the affected goods are still shared out by agreement, not sold to whoever pays most" (66/114).
  It contradicts "others cannot pay the prices asked".

**Hooks** (9; 6 need nothing; the largest share is 57.0%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | A store of the scarce goods is being kept off the market on purpose *(kept)* | `market` (`market.js :: marketOf`) | 42.1% |
| 2 | Some are hoarding what is short; who holds the most, and what would make them part with it? | none | 100% |
| 3 | Some here cannot pay what is asked for what is short; what are they giving up instead? | none | 100% |
| 4 | Some would fix a fair price for what is short; who would see it kept, and who would refuse it? | none | 100% |
| 5 | Where else could the place get what it lacks, and what stands in the way? | none | 100% |
| 6 | Who sets the price of what is short, and who is losing patience with that price? | none | 100% |
| 7 | The place is going hungry; who decides who is fed first? | `famine` (`famine.js :: famineOf`) | 18.4% |
| 8 | The war takes its share of what is short; who here says it should not? | `war: at war` (`warState.js :: warStateOf`) | 18.4% |
| 9 | Boats could bring in what is short; who would pay for the cargo, and who would profit? | `navigable` (`water.js :: waterOf`) | 44.7% |

**Lasting effects** (8; 4 need nothing; the largest share is 42.1%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | What is short is counted and recounted, and nothing is wasted. | none | 100% |
| 2 | Neighbours watch what each other has, and resent what they see. | none | 100% |
| 3 | What is short sells for more than most can pay. | none | 100% |
| 4 | Families share what they can with kin, and little with anyone else. | none | 100% |
| 5 | Market days are short and tense, and the stalls sell out early. | `market` (`market.js :: marketOf`) | 42.1% |
| 6 | Hunger is plain to see in the place. | `famine` (`famine.js :: famineOf`) | 18.4% |
| 7 | The granary doors stay locked, and every measure taken out is counted. | `institution: granary` (`institutions.js :: hasInstitution`) | 36.8% |
| 8 | What the war needs is taken first, and the place makes do with what is left. | `war: at war` (`warState.js :: warStateOf`) | 18.4% |

## external_threat (79; every size)

**The kind's stored sentence:** "News of approaching danger divides the community on how to respond". `danger coming`
holds in 100%; the place is at war in 32.9%.

**Stored hooks.** All three are judged false to the record:
- "The threat is being exaggerated by someone who profits from wartime contracts" (26/79). It invents a person and a
  secret.
- "A diplomatic channel exists that the war party is suppressing" (26/79). It invents a secret and a party.
- "The threat has an agent already inside the settlement" (79/79). It invents a person and a secret.

**Stored effects:**
- "The heads of the families still keep count of who could be called on to fight" (40/79; `tier: ≤ village`) is **kept**:
  it is a standing practice and claims no event.
- These are false:
  - "Watch towers and muster drills maintained since the alarm" (56/79) claims a past alarm (55.7% hold no past event) and
    towers the roster may lack.
  - "Every household still knows where to run if the alarm is raised again" (23/79) claims a past alarm.
  - "A standing levy roster kept ready in the town/city/metropolis archive" (15, 11 and 13 of 79) claims an archive the
    record lacks.

**Hooks** (8; 4 need nothing; the largest share is 58.2%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | News of danger is coming in; who brought it, and how much of it is true? | none | 100% |
| 2 | Some want to stand and fight, some to bargain, some to hide; which way is the place leaning? | none | 100% |
| 3 | What exactly is coming, and how long before it arrives? | none | 100% |
| 4 | Those who would flee need somewhere to go; where would they go, and who would take them in? | none | 100% |
| 5 | The walls are the place's answer to the danger; are they in a state to hold? | `walls` (`defence.js :: defenceOf`) | 58.2% |
| 6 | Those who keep order here would be first to face the danger; how many could be put to it, and how soon? | `guardPresence` (`factsOf.guardPresence`, `defence.js`) | 70.9% |
| 7 | The place is already at war; is the danger the war coming closer? | `war: at war` (`warState.js :: warStateOf`) | 32.9% |
| 8 | Beasts already press on this place; is the danger more of them, or something else? | `crisis: monster_pressure` (`crisisKind.js :: crisisOf`) | 24.1% |

**Lasting effects** (8; 3 need nothing; the largest share is 41.8%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | The heads of the families still keep count of who could be called on to fight *(kept)* | `tier: ≤ village` (record.tier) | 50.6% |
| 2 | Every household has thought about what it would carry if it had to leave. | none | 100% |
| 3 | Strangers on the road are asked where they have come from, and what they have seen. | none | 100% |
| 4 | Talk of the danger runs through every gathering. | none | 100% |
| 5 | Someone is always on the walls, looking out. | `walls` (`defence.js :: defenceOf`) | 58.2% |
| 6 | Those who keep order are drilled and kept close to hand. | `guardPresence` (`defence.js`) | 70.9% |
| 7 | The war's demands come first in everything the place decides. | `war: at war` (`warState.js :: warStateOf`) | 32.9% |
| 8 | Traders hold back their goods, waiting to see what the danger brings. | `market` (`market.js :: marketOf`) | 59.5% |

## succession_crisis (74; every size)

**The kind's stored sentence:** "Who will lead next is the quarrel of the day, and the would-be successors are each
gathering support" (unanchored).
**Rulers:** a council in 43.2% of these places, elders in 39.2%, a lord in 9.5% and a mayor in 8.1%. The seat stands empty
(`crisis: succession_void`) in 37.8%.

**Stored hooks:**
- "A would-be heir approaches outsiders to investigate a rival's past" (74/74) is **kept**, gated by `ruler: lord`.
  Ungated it is false: an "heir" presumes a hereditary seat, which 90.5% of these places lack.
- "The ailing ruler wants a final errand completed before naming a successor" (6/74) is false: it invents an illness.
- "Someone is poisoning the ruler slowly, and someone in the household knows" (6/74) is false: it invents a crime and a
  secret.

**Stored effects:**
- "Rival claimant bloodlines still contest ceremonial precedence" (74/74) is **kept**, gated by `ruler: lord`. Ungated it
  is false: bloodlines presume a hereditary seat.
- "Succession now governed by a charter drafted in the aftermath" (74/74) is false. It claims a past aftermath and a
  charter, and a charter that governs succession contradicts the open quarrel.

**Hooks** (10; 5 need nothing; the largest share is 56.8%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | A would-be heir approaches outsiders to investigate a rival's past *(kept)* | `ruler: lord` (`rulerKind.js :: rulerKindOf`) | 9.5% |
| 2 | Each would-be successor is gathering support; whose backing would settle it? | none | 100% |
| 3 | What does each would-be successor promise, and to whom? | none | 100% |
| 4 | Who has the right to choose the next to lead, and does everyone agree on that much? | none | 100% |
| 5 | Who stands to lose most if the wrong one leads next? | none | 100% |
| 6 | Which would-be successor has the fewest backers, and what might that one try? | none | 100% |
| 7 | The seat stands empty while the quarrel goes on; who handles the place's business in the meantime? | `crisis: succession_void` (`crisisKind.js :: crisisOf`) | 37.8% |
| 8 | The council must agree on who leads next; whose voice is still undecided? | `ruler: council` (`rulerKind.js`) | 43.2% |
| 9 | The elders will name who leads next; which of them is still to be won over? | `ruler: elder` (`rulerKind.js`) | 39.2% |
| 10 | A strong power beside the governing one watches the quarrel; which would-be successor does that power favour? | `rival power` (`rivalPower.js :: rivalPowerOf`) | 40.5% |

**Lasting effects** (7; 3 need nothing; the largest share is 50.0%; line 1 printed in none of the 7 lord places, though
it was admitted there):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Rival claimant bloodlines still contest ceremonial precedence *(kept)* | `ruler: lord` (`rulerKind.js`) | 9.5% |
| 2 | Every gathering is read for who stands beside whom. | none | 100% |
| 3 | Decisions that can wait are put off until it is known who will lead. | none | 100% |
| 4 | Families take sides, and those on opposite sides keep apart. | none | 100% |
| 5 | No one holds the seat, and the place's business waits. | `crisis: succession_void` (`crisisKind.js`) | 37.8% |
| 6 | Council meetings run long and end without agreement. | `ruler: council` (`rulerKind.js`) | 43.2% |
| 7 | Traders hold off on long bargains until they know who will lead. | `market` (`market.js :: marketOf`) | 56.8% |

## outside_debt (63; every size)

**The kind's stored sentence:** "The settlement owes a heavy debt to an outside power, and the power is preparing to
collect" (unanchored). `crisis: indebted` holds in 44.4%.

**Stored hooks:**
- "The debt could be voided, if someone can prove it was obtained through fraud" (63/63) is **kept**: it is a
  conditional and asserts no fraud.
- "The original loan documents contain a clause that was never disclosed publicly" (63/63) is false: it invents a secret.
- "A creditor's agent is in town conducting a quiet assessment before enforcement" (62/63) is false: it invents a person,
  and "in town" is said of thorps.

**Stored effects.** Both are judged false to the record:
- "Tribute payments to the external creditor continue on a schedule" (63/63). Payments kept up contradict a creditor
  preparing to collect.
- "Municipal borrowing now capped by a charter clause" (63/63). It claims a past clause the record lacks, and
  "municipal" is said of 9 thorps.

**Hooks** (8; 5 need nothing; the largest share is 57.1%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | The debt could be voided, if someone can prove it was obtained through fraud *(kept)* | none | 100% |
| 2 | The outside power is preparing to collect; what will it take if the debt is not paid? | none | 100% |
| 3 | Who here took the loans, and what did the money buy? | none | 100% |
| 4 | Some who profited from the debt want no questions asked; what would a question find? | none | 100% |
| 5 | Who will bear the cost of paying, and are they willing? | none | 100% |
| 6 | The place is poor and the debt is heavy; what could it sell or give up to pay? | `prosperity: ≤ poor` (`prosperityRank.js :: prosperityLabelOf`) | 22.2% |
| 7 | The place is wealthy enough to pay; why has the debt not been paid? | `prosperity: ≥ prosperous` (same) | 27.0% |
| 8 | The creditors' demands are already felt here; whose goods would be taken first? | `crisis: indebted` (`crisisKind.js :: crisisOf`) | 44.4% |

**Lasting effects** (7; 4 need nothing; the largest share is 39.7%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Every expense is argued over, because every coin may be owed. | none | 100% |
| 2 | Those who took the loans are spoken of with bitterness. | none | 100% |
| 3 | Families put aside what they can against the day the debt is called in. | none | 100% |
| 4 | Little is mended or built while the debt hangs over the place. | none | 100% |
| 5 | Part of what the place earns goes out to its creditors before it can be spent at home. | `crisis: indebted` (`crisisKind.js`) | 44.4% |
| 6 | Traders keep their best goods out of sight, in case they are taken against the debt. | `market` (`market.js :: marketOf`) | 66.7% |
| 7 | The bank lends little, and on hard terms, while the debt stands. | `institution: bank` (`institutions.js :: hasInstitution`) | 42.9% |

## legitimacy_crisis (58; every size; peace in 100%)

**The kind's stored sentence** has two forms: "…openly and widely questioned…", or, under an approved seat, "Most here
accept the current authority's right to rule, but some question it openly…" (`LEGITIMACY_HELD_TWINS`). The need-nothing
lines below are true under both forms. "Few accept" needs `legitimacy crisis`.
**Its camps:** the sitting authority, those who deny its mandate, and pragmatists who want any stable answer.

**Stored hooks.** All three are judged false to the record:
- "A document that would settle the question of legitimacy exists, and both sides would rather it stayed lost" (58/58).
  It invents a secret.
- "Those in power are paying people to speak for them at the gatherings, because no one will do it for free" (42/58), with
  its approved-seat twin "…so that their backers sound louder than the doubters" (16/58). Both invent bribery.
- "A third party is keeping the question open on purpose, because an unsettled claim is easier to bargain with" (58/58). It
  invents a party and a secret.

When these leave the pool, `LEGITIMACY_HELD_TWINS` swaps no hook any more and keeps only its two descriptions.

**Stored effects:** none. The template holds none, so the stored array has length 0. **Kept length 0, these lines print
nowhere.** They are written as the brief asks, and the measure scored them with 2 taken, as if they were given a length.
Giving the kind effects is not mine to decide.

**Hooks** (9; 5 need nothing; the largest share is 65.5%, the highest of the eight pools: three of the four needs hold in
under a third of these places):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Some here question the authority's right to rule; on what grounds, and who first said so? | none | 100% |
| 2 | Those who deny the authority's mandate: what would they put in its place? | none | 100% |
| 3 | Some want any stable answer to who should rule; what would it take to win them over? | none | 100% |
| 4 | What does the sitting authority do to show its right to rule, and who is convinced? | none | 100% |
| 5 | Those who question the right to rule speak openly; who listens, and who would rather they were silent? | none | 100% |
| 6 | Few here accept the authority's right to rule; who still obeys, and why? | `legitimacy crisis` (`legitimacyCrisis.js :: legitimacyCrisisOf`) | 29.3% |
| 7 | Some have risen against those in charge; how many of the doubters stand with the rising? | `crisis: insurgency` (`crisisKind.js :: crisisOf`) | 32.8% |
| 8 | A new faith is spreading here; does it question the authority's right to rule as well? | `crisis: religious_conversion` (`crisisKind.js`) | 15.5% |
| 9 | A power stands above the governing one; does the favour of that power make or break the authority's claim? | `seat outranked` (`seatOutranked.js :: seatOutrankedOf`) | 24.1% |

**Lasting effects** (7; 3 need nothing; the largest share is 48.3%, if two are taken):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Orders from those in charge are obeyed slowly, and sometimes argued with first. | none | 100% |
| 2 | People are careful whom they speak in front of when the authority comes up. | none | 100% |
| 3 | Dues owed to those in charge are paid late, or short, by those who doubt the right to ask. | none | 100% |
| 4 | Many obey those in charge only where they are watched. | `legitimacy crisis` (`legitimacyCrisis.js`) | 29.3% |
| 5 | Those in charge go about with guards, and keep away from some parts of the place. | `crisis: insurgency` (`crisisKind.js`) | 32.8% |
| 6 | Those who keep order are asked, openly, on whose authority they act. | `guardPresence` (`defence.js`) | 60.3% |
| 7 | Prayers for those in charge are said in some houses of worship and left out in others. | `sacredHouse` (`institutions.js :: hasInstitution`, temple ∨ monastery) | 82.8% |

## corruption_scandal (51; every size)

**The kind's stored sentence:** "Evidence of official corruption has surfaced but powerful figures resist investigation".
`crisis: recently_betrayed` holds in 39.2%.

**Stored hooks.** All three are judged false to the record:
- "The investigator who uncovered the corruption has received a death threat" (51/51). It invents an event, a threat.
- "A key witness can be found, but won't speak without protection" (51/51). It invents a person.
- "The corruption goes higher than anyone yet suspects; those pressing to expose it are being used" (51/51). It invents a
  secret.

**Stored effects.** All three are judged false to the record:
- "Several old families carry names still quietly disgraced" (51/51). It claims a past disgrace, and the scandal is
  still open.
- "An oversight office was established to audit officials afterward" (22/51). It claims a past office, which contradicts
  "resist investigation".
- Its twin "Since then, whoever handles the common purse has had to show the accounts to the heads of the families"
  (29/51). It claims the same past.

**Hooks** (9; 5 need nothing; the largest share is 54.9%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Evidence of corruption has surfaced; who found it, and who else has seen it? | none | 100% |
| 2 | Powerful figures resist the investigation; what are they protecting, and how far will they go? | none | 100% |
| 3 | Who benefited from the corruption without taking part in it, and do they know it? | none | 100% |
| 4 | Reformers want the corruption exposed; what would they do with power if they had it? | none | 100% |
| 5 | Whose names does the evidence touch, and who has it left out so far? | none | 100% |
| 6 | A court sits here; will the evidence ever be put before it? | `court sits` (`defence.js :: courtHoldersOf`) | 43.1% |
| 7 | The place was recently betrayed; is the corruption bound up with the betrayal? | `crisis: recently_betrayed` (`crisisKind.js`) | 39.2% |
| 8 | Traders paid the dues asked of them; how much of it went where it should? | `market` (`market.js :: marketOf`) | 47.1% |
| 9 | A power beside the governing one stands to gain if the corruption is proven; how hard will that power press? | `rival power` (`rivalPower.js :: rivalPowerOf`) | 39.2% |

**Lasting effects** (8; 4 need nothing; the largest share is 45.1%):

| # | line | need (home) | rate |
|---|---|---|---|
| 1 | Those in office are watched closely, and trusted little. | none | 100% |
| 2 | Payments owed to those in charge are made grudgingly, and every receipt is kept. | none | 100% |
| 3 | Talk of the evidence turns up in every quarrel, whatever the quarrel is about. | none | 100% |
| 4 | Those pressing for an investigation are careful whom they trust. | none | 100% |
| 5 | Every ruling of the court is doubted, by one side or the other. | `court sits` (`defence.js :: courtHoldersOf`) | 43.1% |
| 6 | Traders ask for a receipt for every due they pay. | `market` (`market.js :: marketOf`) | 47.1% |
| 7 | Officials keep their own records of what passes through their hands, in case they are asked. | `tier: ≥ town` (record.tier) | 43.1% |
| 8 | After the betrayal and the corruption both, few here trust anyone in office. | `crisis: recently_betrayed` (`crisisKind.js`) | 39.2% |

---

## What these pools do on the 900 towns (`measure.pools.out.txt`)

- **The largest share of any one line.** Today every hook and every effect of the eight kinds prints in 100% of its
  kind's places, apart from the gated and twinned rows. With these pools the largest single line is:

  | kind | hooks | effects |
  |---|---|---|
  | crime_wave | 46.8% | 35.1% |
  | guild_conflict | 43.7% | 30.7% |
  | resource_scarcity | 57.0% | 42.1% |
  | external_threat | 58.2% | 41.8% |
  | succession_crisis | 56.8% | 50.0% |
  | outside_debt | 57.1% | 39.7% |
  | legitimacy_crisis | 65.5% | (48.3%) |
  | corruption_scandal | 54.9% | 45.1% |

  Every line of every pool printed somewhere, except succession effect 1.
- **Three places of one size in a row that share a string**, across all 29 kinds, with only these eight pools changed:

  | | today | with these pools |
  |---|---|---|
  | hooks | 48.0% (city 87.2, metropolis 93.9) | 44.7% (thorp 16.2 · hamlet 17.6 · village 23.0 · town 41.2 · city 82.4 · metropolis 87.8) |
  | effects | 43.6% (city 84.5, metropolis 93.2) | 31.8% (thorp 13.5 · hamlet 7.4 · village 13.5 · town 24.3 · city 57.4 · metropolis 74.3) |

- **Why the hook triples barely move.** Two places with one kind, each taking 3 of 9 lines, share at least one line
  1 − C(6,3)/C(9,3) = **76%** of the time. Half of the cities carry crime_wave and half carry guild_conflict, so a city
  triple nearly always holds a pair of one kind. Any pool of about 8 with 3 taken keeps the any-shared-string triple
  metric high. What it does cut is a line's share (100% → under 47% for the two big kinds) and the number of shared
  strings per pair. Lowering the triple metric further needs larger pools or fewer lines taken, and that is the chair's
  call, not this brief's.

## Notes for PAGE-7 (not decided here)

1. The hooks stored on a tension never pass through `substituteNames`. These lines use no slot and no power's name, and
   carry no pronoun after either.
2. A tension's `lastingEffects` is printed by no page code (see the sources above). The census and the export of the
   stored record are its only readers.
3. legitimacy_crisis stores no effects: should it take 2?
4. Each pool can be removed whole, so a veto of one kind's lines leaves the other kinds' lines standing.
