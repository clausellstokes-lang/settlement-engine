# CL2, file A: the causes' lines for resource_scarcity, external_threat and succession_crisis, for the chair and the owner to read (vetoable)

Brief: `briefs/CL2.md` (530ae8415), which binds `briefs/CL1.md`'s rules 1-6 and its file shape. The tables, the rates
and the 14:33 ruling come from `PAGE-5-HANDBACK.md` section 5 at 4f48cd6e4. No measure was re-run. Rates are written
`raw <held> → <assigned>` from that section. A cause gets three wordings where it is in `WORDS`, else two. Each kind
gets three plain wordings.

Slots: `{power}` is not used in this file. `rival_power` (succession_crisis) reads `factsOf(record).rivalPower`. That
field is a boolean (`rivalPower.js :: rivalPowerOf`) and gives no power's name, so its lines name no power.

Past events: `history.historicalEvents[]` entries carry `yearsAgo`, `name` (the type's title, e.g. "The Shortage"),
`description`, `severity`, `lastingEffects`, `plotHooks`, `type` and `templateType` (`historyGenerator.js ::
generateEventNarrative`, and where the timeline is built). The `old_*` lines use none of these: they say only that the
trouble has come before and is here again, with no slot.

How the stored sentence is chosen, for every kind here (`historyGenerator.js :: buildHistoricalEvent` → `tensionByMemory`
→ `apartFromOwnEvent`): where the timeline holds no event of the kind, the `byMemory.unanchored` words print, in the
present tense. Where it does hold one, the template's own words print, in the past tense (no kind here has a `dated`
form), or the first variant (`historyDescVariants.js`) whose words differ from that event's. A description the
selection wrote for the town itself is kept.

No row is marked HIDEABLE in this file: no predicate here names or implies a criminal house.

---

## resource_scarcity

### The stored sentences (`src/data/historyData.js`, the `resource_scarcity` row)

- No own event on the timeline: "A critical resource is running short, and some are hoarding it while others cannot pay
  the prices asked"
- Own event on the timeline (`old_scarcity`): "A critical resource became scarce, causing hoarding and price gouging"
  / "A vital resource ran short, and hoarding and inflated prices followed" / "Scarcity of a critical good drove some to
  hoard it and others to gouge on the price"
- The viability add (`buildHistoricalEvent`, a viability issue and `_rng() > 0.4`) writes the town's own sentence, and
  `tensionByMemory` keeps it: `livelihoodLead` (e.g. "The {commodity} trade is the largest the place lives by, and it is
  under strain.") followed by the top issue's `message`/`description`. Where neither exists, the template's words print.

### famine · rank 1 · not hideable · the food record's band is famine (`factsOf(record).famine.famine`, `famine.js :: famineOf`) · raw 18.4% → 13.2%

0. Famine holds the place, food is short, and those who hoard it set prices others cannot meet.
1. With the place in famine, what food there is goes to those who keep it back or can pay what is asked.

### sickness · rank 1 · not hideable · the crisis record holds a disease outbreak (`t.stress` type `plague_onset`, label "Disease Outbreak") · raw 24.6% → 21.9%

0. A disease outbreak is spreading through the place, and a needed resource runs short while some hoard it and others cannot pay.
1. With sickness abroad in the place, supplies of a vital good are thin, and their price has climbed beyond many.

### war_levy · rank 1 · not hideable · war is upon the place: wartime, an occupation, or a siege (`factsOf(record).warState` is `'at war'` or `'front'`, `warState.js :: warStateOf`) · raw 26.3% → 26.3%

0. With war upon the place, a vital resource is running short, and some hoard it while others go without.
1. War presses on the place, and the goods the people need most are scarce and dear.
2. The place is caught up in war, and the shortage of a needed good sets those who hoard against those who cannot pay.

### source_spent · rank 1 · not hideable · the leading food source's grounds are all spent, or the famine failed a food source (`factsOf(record).leadingSourceSpent`, `leadingSourceSpent.js`; `factsOf(record).failedSource`, `sceneSupply.js :: failedFoodSourceOf`) · raw 7.0% → 3.5%

Both wordings hold for both fields: they say a source has failed OR is worked out.

0. One of the place's own food sources has given out, and what remains is hoarded or priced beyond many.
1. With one of its own food sources given out, the place runs short, and the hoarders and the high prices follow.

### old_scarcity · rank 1 · not hideable · the timeline holds a resource_scarcity event (`history.historicalEvents[].templateType === 'resource_scarcity'`) · raw 13.2% → 8.8%

0. The place has gone short before and is going short again, with some hoarding while others cannot pay.
1. Scarcity has come to the place before, and now a needed resource is scarce once more, kept back by some and priced beyond others.

### isolated · rank 2 · not hideable · the trade route is isolated (`factsOf(record).route === 'isolated'`, `terrain.js :: tradeRouteOf`) · raw 16.7% → 2.6%

0. Lying off the trade routes, the place runs short of a needed resource, and some hoard what is left while others cannot pay.
1. The place sits apart from the roads of trade, and a shortage of a vital good sets hoarders against those who cannot meet the price.

### Plain (no cause holds) · raw → 23.7%

0. A needed resource is scarce, and the shortage sets those who hoard against those who cannot pay.
1. Something the place depends on is in short supply, and its price has climbed beyond many.
2. Supplies of a vital good are thin, and some are keeping back what they have while others go without.

### Dropped

- None. Every field the rows read exists under its name.

---

## external_threat

### The stored sentences (`src/data/historyData.js`, the `external_threat` row)

- No own event on the timeline: "News of approaching danger divides the community on how to respond"
- Own event on the timeline (`old_threat`): "News of approaching danger divided the community on how to respond" /
  "Word of a gathering threat split the settlement over whether to fight, treat, or flee" / "An approaching danger set
  the community against itself over the right response"

### war · rank 1 · not hideable · war is upon the place (`factsOf(record).warState` is `'at war'` or `'front'`, or `t.stress` holds `wartime`) · raw 32.9% → 24.1%

0. The war has come close, and the people are divided over whether to fight, bargain or flee.
1. With war upon the place, the danger is close, and no one agrees how to meet it.
2. The place stands in a time of war, and the argument over how to answer the danger sets neighbour against neighbour.

### beasts_pressing · rank 1 · not hideable · the crisis record holds the beast and raider threat (`t.stress` type `monster_pressure`, label "Beast & Raider Threat") · raw 24.1% → 20.3%

The label names raiders as well as beasts, so both wordings name both.

0. Beasts and raiders are pressing on the place, and the people cannot agree on how to answer them.
1. With beasts and raiders pressing in from the country around, the place is split over how to meet the danger.

### old_threat · rank 1 · not hideable · the timeline holds an external_threat event (`history.historicalEvents[].templateType === 'external_threat'`) · raw 44.3% → 29.1%

0. Danger has threatened the place before and threatens it again, and the argument over how to answer it has returned.
1. Once more a danger approaches the place, and once more the people are split on how to respond.
2. The place has faced a threat from outside before, and with another coming the community is divided again.

### militia_only · rank 2 · not hideable · a militia stands and no garrison (`factsOf(record).defence.militia` and not `.garrison`, `defence.js :: defenceOf`) · raw 21.5% → 2.5%

0. With a militia to defend the place and no garrison, news of approaching danger divides the community over what to do.
1. Danger approaches a place that has a militia but no garrison, and the people disagree on how to meet it.

### open_road · rank 2 · not hideable · the trade route is a crossroads (`factsOf(record).route === 'crossroads'`) · raw 20.3% → 2.5%

0. The place stands where roads cross, and news of approaching danger splits the people over how to respond.
1. At a meeting of roads, the place hears of danger approaching and cannot agree how to meet it.

### beasts_frontier · rank 2 · not hideable · the page itself prints the country's beasts as a threat (`factsOf(record).monsterFrontier`, `monsterFrontier.js :: monsterFrontierOf`: plagued country, or frontier country with a Weak or Critical Beasts & Monsters band) · raw 57.0% → 12.7%

0. The country around is beast-haunted, and word of a coming danger leaves the place divided over how to answer.
1. In country where beasts are a known threat, the place is split over how to meet the danger approaching.

### Plain (no cause holds) · raw → 8.9%

0. A danger is coming, and the place cannot agree whether to stand, bargain or flee.
1. Word of a threat from outside has the community at odds over what to do.
2. Something dangerous is approaching, and the people are divided on how to meet it.

### Dropped

- None. Every field the rows read exists under its name.

---

## succession_crisis

### The stored sentences (`src/data/historyData.js`, the `succession_crisis` row)

- No own event on the timeline: "Who will lead next is the quarrel of the day, and the would-be successors are each
  gathering support"
- Own event on the timeline (`old_succession`): "The ruler of the time was aging or ill, and potential heirs jockeyed
  for position" / "The one who led was failing in health, and rivals maneuvered quietly to take that place" / "As the
  ailing ruler declined, several would-be heirs positioned themselves to inherit"

### void · rank 1 · not hideable · the crisis record holds the succession void (`t.stress` type `succession_void`, label "Succession Void") · raw 37.8% → 20.3%

0. The place awaits a new leader, and the would-be successors are each gathering support.
1. Big decisions wait on a new leader, and rival claimants are each building a following.

### heir_house · rank 1 · not hideable · the ruler kind is lord (`factsOf(record).rulerKind === 'lord'`, `rulerKindLabel.js`: a noble, feudal, ducal or royal authority, or a steward or appointee) · raw 9.5% → 5.4%

The kind covers stewards and appointees as well as lords, so neither wording says "heir" or "blood".

0. The place is held under a lord's authority, and who holds it next is in open dispute among the would-be successors.
1. Rule here passes through a lordly seat, and several who would take that seat are gathering backers.

### outranked · rank 1 · not hideable · a power that does not govern stands above the governing one (`factsOf(record).seatOutranked`, `seatOutranked.js :: seatOutrankedOf`) · raw 21.6% → 0.0%

Written as the brief asks, although the cause speaks for no town after the ranks.

0. A power stronger than the government stands in the place, and the question of who leads next is wide open.
1. With the governing power outweighed by another, the would-be successors are each gathering support.

### rival_power · rank 1 · not hideable · a power not the governing one stands at Significant or above (`factsOf(record).rivalPower`, a boolean: no `{power}`) · raw 40.5% → 18.9%

0. Another power of weight stands beside the government, and the would-be successors are each gathering support.
1. With a strong power outside the seat of government, who leads next is in open dispute.

### contested · rank 1 · not hideable · the public legitimacy's label says Contested (`powerStructure.publicLegitimacy.label` /Contested/, read off the record, not through factsOf) · raw 33.8% → 18.9%

0. The government's legitimacy is contested, and those who would lead next are each gathering support.
1. With the people's acceptance of those in charge in question, the succession is an open quarrel.

### old_succession · rank 1 · not hideable · the timeline holds a succession_crisis event (`history.historicalEvents[].templateType === 'succession_crisis'`) · raw 41.9% → 21.6%

0. The place has quarrelled over its succession before, and the quarrel is back, with would-be successors gathering support.
1. Once again the question of who will lead next divides the place, as it has before.
2. A fight over the succession is nothing new here, and a fresh one has the claimants each building a following.

### Plain (no cause holds) · raw → 14.9%

0. Who will hold power next is unsettled, and each claimant is gathering backers.
1. The succession is in dispute, and the would-be leaders are each building support.
2. No one can yet say who will lead next, and the rivals for the seat are each rallying followers.

### Dropped

- None. Every field the rows read exists under its name.
