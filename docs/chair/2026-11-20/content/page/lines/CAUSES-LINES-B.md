# CL2, file B: the causes' lines for outside_debt, legitimacy_crisis and great_flood, for the chair and the owner to read (vetoable)

Brief: `briefs/CL2.md` (530ae8415), which binds `briefs/CL1.md`'s rules 1-6 and its file shape. The tables, the rates
and the 14:33 ruling come from `PAGE-5-HANDBACK.md` section 5 at 4f48cd6e4. No measure was re-run. Rates are written
`raw <held> → <assigned>`. A cause gets three wordings where it is in `WORDS`, else two. Plain wordings: three for
outside_debt and legitimacy_crisis, four for great_flood.

Slots: `{power}` is used only by `merchants_rule`, for the governing power's `faction` name (the one power with
`isGoverning`). `rival_power` (legitimacy_crisis) reads `factsOf(record).rivalPower`, which is a boolean
(`rivalPower.js :: rivalPowerOf`) and names no power, so its lines take no slot. No line puts a pronoun after `{power}`.

Past events (`old_debt`, `old_crash`, `old_flood`): `history.historicalEvents[]` entries carry `yearsAgo`, `name`,
`description`, `severity`, `lastingEffects`, `plotHooks`, `type` and `templateType`. The lines use none of these and no
slot. They say only that the trouble has come before and is here again.

The stored sentence is chosen as in file A: with no own event on the timeline, the `byMemory.unanchored` words print, in
the present tense. With an own event, the template's own past-tense words print, or a variant whose words differ from
that event's.

No row is marked HIDEABLE in this file.

---

## outside_debt

### The stored sentences (`src/data/historyData.js`, the `outside_debt` row)

- No own event on the timeline: "The settlement owes a heavy debt to an outside power, and the power is preparing to
  collect"
- Own event on the timeline (`old_debt`): "The settlement owed a significant debt to an external power that was
  preparing to collect" / "A large debt to an outside power came due, and the creditor was moving to enforce it" / "The
  settlement had borrowed heavily from a foreign power now ready to call the debt in"

### creditors_sit · rank 1 · not hideable · the crisis record holds the debt to an outside power (`t.stress` type `indebted`, label "Indebted to Outside Power") · raw 44.4% → 23.8%

0. Debt sits heavy here, and the outside power the place owes is moving to collect.
1. Deep in debt, the place faces a creditor from beyond its bounds that means to be paid.
2. What the place owes to a power outside is pressing hard, and the lender is preparing to collect.

### old_crash · rank 1 · not hideable · the timeline holds a market crash or a trade collapse (`history.historicalEvents[].templateType` is `'market_crash'` or `'trade_collapse'`) · raw 27.0% → 14.3%

The crash and the debt are set side by side. Neither line says the crash made the debt (the record does not).

0. Trade here has crashed before, and now the place owes a heavy debt to an outside power that is preparing to collect.
1. With a past ruin of its trade behind it, the place is deep in debt to a lender from outside who is moving to collect.

### hard_up · rank 1 · not hideable · the prosperity is Struggling or Poor (`economicState.prosperity`, read off the record, not through factsOf) · raw 22.2% → 14.3%

0. Hard up as it is, the place owes a heavy debt to an outside power that is ready to collect.
1. The place has little money to spare, and a power beyond its bounds that it owes is preparing to collect.

### merchants_rule · rank 1 · not hideable · the governing power is of category economy (`powerStructure.factions[]` with `isGoverning`, `category === 'economy'`; read off the record) · raw 20.6% → 14.3%

0. With {power} governing, the place owes a heavy debt to an outside power that is preparing to collect.
1. The place, governed by {power}, has borrowed heavily from outside, and the lender is moving to collect.

### old_debt · rank 1 · not hideable · the timeline holds an outside_debt event (`history.historicalEvents[].templateType === 'outside_debt'`) · raw 20.6% → 6.3%

0. The place has owed an outside power before, and it is in debt again, with the creditor preparing to collect.
1. Once more a heavy debt binds the place to a power from outside that means to collect.

### through_trade · rank 2 · not hideable · the place is an entrepot (`economicState.isEntrepot`, read off the record; `tradeGoods.js :: deriveIsEntrepot`: a crossroads route, or a port with an international trade house or a warehouse district) · raw 27.0% → 6.3%

0. Goods pass through here on their way elsewhere, and the place owes a heavy debt to an outside power that is preparing to collect.
1. As a waypoint of passing trade, the place owes a great deal beyond its bounds, and the creditor is moving to collect.

### Plain (no cause holds) · raw → 20.6%

0. The place is heavily in debt to a power beyond its bounds, and that power wants payment.
1. An outside creditor is preparing to call in what the place owes.
2. A large debt to a lender from outside hangs over the place, and collection is coming.

### Dropped

- None. Every field the rows read exists under its name.

---

## legitimacy_crisis

### The stored sentences (`src/data/historyData.js`, the `legitimacy_crisis` row)

- No own event on the timeline: "The right of the current authority to rule is openly and widely questioned, and no one
  can agree on who, if anyone, holds a legitimate claim"
- Own event on the timeline (no row in the table reads it): "The right of the current authority to rule was openly and
  widely questioned, and no one could agree on who, if anyone, held a legitimate claim" / its two variants in
  `historyDescVariants.js`

### insurgency · rank 1 · not hideable · the crisis record holds an insurgency (`t.stress` type `insurgency`, label "Insurgency") · raw 32.8% → 20.7%

0. An insurgency is under way, and many openly deny the government's right to rule.
1. With an insurgency defying those in charge, no one agrees who, if anyone, has the right to govern.

### creed · rank 1 · not hideable · the crisis record holds a religious conversion (`t.stress` type `religious_conversion`, label "Religious Conversion") · raw 15.5% → 8.6%

0. A change of faith is spreading through the place, and the government's right to rule is in question.
1. As a new creed wins converts, the authority's claim to rule is openly disputed.

### crisis_band · rank 1 · not hideable · the public legitimacy is in its crisis band (`factsOf(record).legitimacyCrisis`, `legitimacyCrisis.js :: legitimacyCrisisOf`) · raw 29.3% → 5.2%

0. The people do not hold the government legitimate, and no one can agree who has a better claim.
1. Public trust in the government's right to rule has given way, and no rival claim commands agreement.

### outranked · rank 1 · not hideable · a power that does not govern stands above the governing one (`factsOf(record).seatOutranked`, `seatOutranked.js :: seatOutrankedOf`) · raw 24.1% → 5.2%

0. Another power stands above the government in the place, and the government's right to rule is openly questioned.
1. With the governing power outweighed by another, who holds a rightful claim to rule is anyone's argument.

### lord · rank 1 · not hideable · the ruler kind is lord (`factsOf(record).rulerKind === 'lord'`: a noble, feudal, ducal or royal authority, or a steward or appointee) · raw 20.7% → 12.1%

0. The place is held under a lord's authority, and that authority's right to rule is openly questioned.
1. Many deny that the lordly seat over the place holds any rightful claim, and none agree who does.

### rival_power · rank 1 · not hideable · a power not the governing one stands at Significant or above (`factsOf(record).rivalPower`, a boolean: no `{power}`) · raw 46.6% → 29.3%

0. A strong power stands beside the government, and the government's right to rule is openly questioned.
1. With another power of weight outside the seat, no one agrees who, if anyone, rightly governs.
2. The government's claim to rule is disputed in a place where a second strong power stands.

### Plain (no cause holds) · raw → 19.0%

0. Many in the place deny that those in charge have any right to rule.
1. The authority's claim to govern is in open dispute, and no other claim is agreed either.
2. Whether the government rules by right is the question of the day, and no answer satisfies.

### Dropped

- None. Every field the rows read exists under its name.

---

## great_flood

### The stored sentences (`src/data/historyData.js`, the `great_flood` row)

- No own event on the timeline (present tense: a feared trouble): "Rising water is the settlement's standing fear, and
  every wet season reopens the quarrel over who must dig the ditches, who keeps the low ground, and who pays for both"
- Own event on the timeline (`old_flood`, past tense): "Waters rose with little warning and reshaped {location},
  drowning livelihoods and redrawing who owned what" / "The water came up with almost no warning and remade {location},
  drowning livelihoods and unsettling every question of who owned what" / "A flood rose fast across {location}, carrying
  off livelihoods and leaving the ownership of half the ground in doubt"
- The lines below keep the unanchored sentence's frame: the present tense, the flood as the place's standing fear, and
  the quarrel over who must guard against it and who pays. The four plain lines name no river, no coast and no rising
  sea. They also name no floodwater, rain, ditch or low ground, because not every town has these. They speak only of the
  flood the place fears and the quarrel over it.

### old_flood · rank 1 · not hideable · the timeline holds a great_flood event (`history.historicalEvents[].templateType === 'great_flood'`) · raw 15.4% → 15.4%

0. A great flood has struck the place before, and the fear of another keeps the quarrel over who must guard against one alive.
1. The flood has come before, and the place again argues over who must make ready for the next one and who pays.

### coast · rank 2 · not hideable · the water is maritime (`factsOf(record).water.coast`, `water.js`: a coast, or a port route off a riverside) · raw 10.3% → 5.1%

0. The place lies at the water's edge, where a flood is the standing fear, and who must guard against one and who pays is an open quarrel.
1. With open water at hand, the place dreads a great flood and quarrels over whose labour and whose purse must answer one.

### river · rank 2 · not hideable · the water is a river (`factsOf(record).water.river`, `water.js`: a river route or a riverside) · raw 30.8% → 28.2%

0. The place lies by a river, and the fear of a flood divides it over who must keep the banks and who pays.
1. With a river at hand, a great flood is the place's standing fear, and the work of guarding against one is a quarrel.
2. A river runs by the place, and each wet season reopens the question of who must answer its floods and at whose cost.

### Plain (no cause holds; four wordings) · raw → 51.3%

0. A great flood is the place's standing fear, and the quarrel over who must guard against one and who pays never rests.
1. The fear of a flood divides the place over who must make ready for one and who bears the cost.
2. Whether a flood will come, and who should pay to keep one out, is a quarrel the place cannot settle.
3. The place lives in dread of a great flood, and argues over whose work and whose purse must answer one.

### Dropped

- None. Every field the rows read exists under its name.
