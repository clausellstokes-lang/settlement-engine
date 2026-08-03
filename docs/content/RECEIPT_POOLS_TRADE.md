# RECEIPT POOLS — FP-TRADE (the seeded variant corpus for DESIGN_FP_TRADE.md)

**What this is.** The SP-6 CONTENT-DEPTH FLOOR made real for the trade program.
`DESIGN_FP_SPINE.md` §SP-6 lawed it: *every phrased kind ships a seeded variant
pool of AT LEAST FOUR templates, seeded per-entity so same-seed worlds keep their
sentences; the kind's WHAT_PHRASES registration walker asserts the floor — a
two-variant kind reds the gate exactly as an unregistered one does; exemplar
sentences in the volumes are the pool's FIRST member, never its whole.* The
volume specs KINDS; this annex is the pool. The measured cautionary tale is the
~11-string hook corpus with its 8.19%/35% repeat rates — four variants is a
floor, not a target, and the crown-drama kinds (TR-6's corner, TR-4's grain road)
carry five or six.

**Shape precedent:** `src/domain/worldPulse/eventProse.js` `WAR_RECEIPTS` — a
per-type pool, seeded on a stable entity key (the directed pair, the house id,
the errand id), so a world's sentences are stable across ticks and differ between
entities. Variant 1 of each pool is the canonical member (the volume's own
exemplar where one exists); the others are its angle-distinct siblings.

## Slot convention (the ten; no eleventh is minted here)

| Slot | Binds to |
|---|---|
| `{settlement}` | the subject settlement — the receipt's home address |
| `{counterpart}` | the other settlement of the directed pair (partner, rival, destination) |
| `{npc}` | the cast person — factor, supercargo, envoy (read-wired per TR-2/J-TR-9, never stored) |
| `{faction}` | any OTHER named faction — a rival house, a guild, a robber band, a captor |
| `{house}` | the merchant house's name (a faction with books, TR-2) |
| `{temple}` | a named temple — **DECLARED UNUSED in this volume** (see resolutions) |
| `{band}` | a band word from the closed vocabulary the kind's Bands line names |
| `{reason}` | the recorded typed reason (the address law's "and why") |
| `{good}` | a canonical good from `goodsCatalog` (`normalizeGood` folded) |
| `{route}` | the named road / lane / pass the receipt addresses |

Every proper noun and every cause is a slot. No name is ever baked into a
template — the address law needs settlements BY NAME and the recorded reason, and
a baked name is an unaddressable receipt.

## Hard constraints these pools were written against

1. **NO DIGITS ANYWHERE.** Counts speak in band words (a handful, a score, many,
   most) or in `{band}`.
2. **HEADLINE HONESTY (R-28).** The verb is entailable by the receipt's facts.
   `factor.silence_overdue` never says *captured*; `corner.gate_crossed` claims
   only the share the independent census measured.
3. **BELIEF ATTRIBUTION.** Every belief-side pool carries its attribution ("they
   say", "the word is", "men said", "the court fears") — never engine truth.
4. **LAW ONE.** No god is ever confirmed to have acted; no named person's death is
   ever stated or resolved. The captured factor is held, ransomed, overdue, or
   silent — never dead. The ruined house's factors scatter to the quays.
5. **COVERT DISCIPLINE.** Public variants everywhere; the four DM-only pools carry
   `AUDIENCE: dm-only` and never leak to a free surface.
6. **VARIANT DISTINCTNESS (the family rule).** Each variant is a different
   structure AND angle from the palette — the event plain · the street's view ·
   the ledger's/institution's view · the consequence forward · the
   understatement/irony. Two variants differing only in slot fills are ONE.
7. **LENGTH.** One to two clauses. A receipt is a chronicle line, not a paragraph.
8. **SIGNIFICANCE** is an ASSIGNMENT from SP-6a's one family — `routine / notable
   / major` — never a scale minted here (the R5 ruling).

## Authoring resolutions (recorded, vetoable)

- **Exemplars are slotted, not literal.** The chair's brief says the volume's own
  exemplar is variant 1 verbatim; estate law says no proper noun is ever baked.
  Where they collide, LAW WINS and the exemplar's names become slots — wording and
  structure otherwise untouched (Aldenmoor → `{counterpart}`, House Verren →
  `{house}`, Factor Maren → Factor `{npc}`, Threeways → `{counterpart}`). Blocks
  whose variant 1 is an exemplar say so. **Verifier amendment:** the first draft
  applied this rule to TOWNS and PERSONS but not to ROADS and GOODS, and left
  three exemplars baked — "the salt road" (`factor.silence_overdue`), "the river
  grain" (`grain.arrival`, `dossier.food_security_line`) — while the sibling
  `grain.arrival_drought` had correctly slotted the volume's "river road" to
  `{route}`. The rule is one rule: a road named in a template is exactly as
  unaddressable as a town named in it, and a good named in a template is a wrong
  receipt for every other good. All three now slot.
- **Dates de-digited.** The dossier exemplar "…in the spring of '43" carries
  numerals; the season alone survives ("…in the spring"). Two exemplar-borne
  word-counts are retained verbatim because the voice contract itself blesses them
  ("Nine years the grain compact held", "third year of ten") — flagged inline for
  the verifier.
- **Gendered pronouns removed from exemplars.** "one price in her head" →
  "in their head": a pronoun agreeing with a slot is a bake.
- **Two exemplars stay COMMODITY-LOCKED, by ruling — and the cost is a SELECTOR
  CONSTRAINT, not a silent bug.** `corner.gate_crossed` variant 1 ("{house} holds
  the grain, and the bread knows it") and `corner.remembered_generational` variant
  1 ("the winter {house} held the grain") keep *grain* unslotted, against the rule
  above. The reason: the volume's §8 Herald contract requires both sentences
  VERBATIM and TR-6's crown fixture is a grain corner, so slotting them would put
  this annex in conflict with its own spec — and the volume outranks the annex.
  The corner, however, can run on ANY good, and "the bread knows it" is false for
  salt. Therefore: **the seeded picker must not draw variant 1 of either kind when
  the cornered good is not grain.** Every other variant of both pools is
  good-agnostic, so the four-variant floor still holds for a salt or wool corner.
  Vetoable — the only alternative is rewriting the volume's mandated sentences,
  which only the volume may do.
- **The food-noun class, scoped.** Bread, loaves, and bakers are grain-only nouns
  and appear ONLY where the kind's subject is food by construction: TR-4's whole
  grain road, the `famine_profiteering↔famine_relief` pair, `provision`, and the
  two locked corner exemplars above. Elsewhere in TR-6 the pools speak in `{good}`
  (`corner.gate_crossed` variant 4 was rewritten off "every loaf" for exactly this
  reason). *Granary*, *warehouse*, *stalls*, and *quay* are NOT in this class —
  they are storage and market nouns that hold any good, and the voice contract
  names granaries among the concrete period nouns it wants.
- **`{temple}` is declared unused.** FAITH owns the tithe and the famine-as-wrath
  omen END TO END (the correction-pass ruling folded into TR-2's Couplings); TRADE
  is a READ SURFACE there and mints no temple-voiced receipt. Declared, not
  omitted.
- **Four pools are DM-only** and the reason is recorded in each: the amendment-B
  suppression receipt names a truth-side read (`cc.suppressed`); the syndicate's
  true book is the covert half of TR-2b (`house.covert_interest`); the declared/true
  purpose split is the Q amendment (`factor.true_purpose`); the truth-beside-belief
  dossier toggle rides `includeGroundTruth` (`dossier.market_line_truth`).
- **`house.covert_interest` is PROVISIONAL.** TR-2b is a recorded shape, not a
  drafted wave; its pool is authored to the floor so the wave does not land
  content-starved, and is re-validated when TR-2b is drafted.

- **Frequency-scaled depth amendment (2026-08-03; the spine's floor amendment).**
  SP-6's four-variant rule is a FLOOR, not a shape. The spine now scales depth by
  how often a kind fires: chronic/routine kinds carry EIGHT TO TWELVE
  angle-distinct variants, notable kinds AT LEAST SIX, major/rare kinds at least
  four. In this annex the routine pools were raised to nine, the dossier panel
  lines to ten (a panel line's angles are its STATES, and a town's dossier is
  re-read every session, so it repeats faster than any headline), and the notable
  pools to seven; the major/rare pools already met their floor and were left
  untouched. The palette was widened past the original five to: the event plain ·
  the street · the institution's ledger · the consequence forward · the
  understatement · the traveller's report · the season's frame · the small human
  detail — plus the counterpart's-side and the rival's-view angles wherever a
  directed pair or a market rival exists. Every addition APPENDS: variant one of
  every pool, and every variant that stood before this pass, is untouched, so the
  seeded picker's existing draws are unchanged in identity and only the modulus
  moves (a disclosed same-seed sentence shift on every deepened kind, which is the
  point of the amendment and not a regression).

- **VERIFIER PASS, 2026-08-03 (adversarial re-check).** Counts and discipline held:
  one hundred seven kinds at seven hundred ninety variants, no pool below its scaled
  floor, no digit in any rendered line, no undeclared slot, no identical pair, and a
  diff against the pre-deepening blob carrying **no deletion line at all** — nothing
  renumbered, reworded, or removed. What the re-check did catch was **formula
  over-deployment across pools**, which the family rule reaches even when every pool
  passes on its own: the construction *"at the turn of the season"* appeared in the
  baseline corpus exactly once and the deepening added it **ten** more times, in ten
  different kinds, so a reader meeting a contract, a toll, a caravan, a dormant house,
  a granary tally, a monopoly's terms, an errand, and an overdue factor would meet the
  same clause in all of them. Eight were re-authored in place (the two where the timing
  is load-bearing — `market.dispatch_chosen` and `factor.ransomed_home` — were kept).
  Likewise the two-sided template *"At {counterpart} the sending is …; at {settlement}
  it is …"* landed at variant nine of three separate pools; one was kept
  (`cc.contract_honored`) and two re-authored. One doubled opening,
  *"Travellers say the {route} is …"*, was broken in `cc.dependency_comfort`, leaving
  the deliberate `route.promoted` / `route.demoted` mirror intact. Index identity is
  unchanged throughout — only the sentence at the index moved. The high lexical overlap
  the scan reports inside the dossier panel pools is by design: a panel line's angles
  are its STATES, and those states are genuinely distinct.

## The census (107 phrased kinds)

| Wave | Kinds | Of which DM-only |
|---|---|---|
| TR-1 casus commercii | 20 (16 taxonomy types + suppression + two crossings + dossier line) | 1 |
| TR-2 the house | 15 (acts, rise/fall, dormancy/lineage, posture, dossier line) | 1 |
| TR-3 believed markets | 8 | 1 |
| TR-4 the grain road | 10 | 0 |
| TR-5 the pact lane | 10 | 0 |
| TR-6 corner + speculator | 15 (corner arc, counterforces, monopoly arm, memory, dossier line) | 0 |
| TR-7 ventures | 9 | 0 |
| TR-8 the traveling factor | 9 | 1 |
| Endings (TR-9 contract; minted at the named waves) | 6 | 0 |
| Route estate (TR-9's Herald debt — the five `route_*` kinds) | 5 | 0 |

---

# TR-1 — THE CASUS COMMERCII (`casusCommerciiEnabled`)

The sixteen taxonomy types are eight force/counterforce PAIRS scoring off the same
evidence; the pools are written so the mirror reads as the same clerk's hand.

### cc.contract_default (TR-1) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {counterpart} took the wagons and sent nothing back; the compact is broken.
2. The wharf at {settlement} waited for a cargo that never came, and stopped waiting in the autumn.
3. The factors' book at {settlement} carries {counterpart} in the column of debts unanswered.
4. What {counterpart} owes in {good} stands unpaid, and the next bargain will be dearer for it.
5. {counterpart} kept every clause but the one that cost it something.
6. Travellers out of {counterpart} bring word of full warehouses there and cannot explain the empty road.
7. The carters sent to fetch it waited out the month at the far gate and came home with the load they left with.

### cc.contract_honored (TR-1) — Herald, commerce desk — significance: routine
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {counterpart} sent the {good} as agreed, and sent it on the season it was owed.
2. The quays of {settlement} have learned to expect {counterpart}'s wagons, and have not been disappointed.
3. Season upon season, the book at {settlement} shows {counterpart}'s side of the contract clean.
4. The compact with {counterpart} holds, and the factors of {settlement} borrow against it.
5. Nothing has happened between {settlement} and {counterpart} for years — which, in trade, is the whole of the good news.
6. Travellers out of {counterpart} say the {good} was loading before the season turned, and it was.
7. The {settlement} gate looks for {counterpart}'s wagons in the same week every year, and the year is reckoned from them.
8. A carter's boy at {settlement} knows the {counterpart} teams by their bells and runs to the gate before the clerks have heard anything.
9. At {counterpart} the sending is entered as a small matter; at {settlement} it is entered as the year's security.

### cc.toll_extortion (TR-1) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {route} {good}
AUDIENCE: public
1. {counterpart} raised its toll on the {route}, and every wagon out of {settlement} pays for the road twice.
2. At the gate the carters count the levy and say the {route} has a landlord now.
3. The toll stands in {settlement}'s book as a wound that reopens at every crossing.
4. While {counterpart} holds the {route}, the {good} of {settlement} grows dearer with every league.
5. {counterpart} calls it the upkeep of the road; the carters call it something shorter.
6. Merchants coming the other way say the gate at {counterpart} has grown a second table and a longer list.
7. The levy went up when the passes opened and has not come down since the snow returned.

### cc.toll_relief (TR-1) — Herald, commerce desk — significance: routine
SLOTS: {settlement} {counterpart} {route} {good}
AUDIENCE: public
1. {counterpart} lightened its toll on the {route}, and the wagons out of {settlement} came back heavier.
2. The carters noticed before the clerks did; the gate takes less than it did.
3. The {route} costs {settlement} less this season than last, and {counterpart}'s name is on the reason.
4. With the levy eased, the {good} of {settlement} reaches further than it has in years.
5. {counterpart} took less at the gate and gained more at the wharf.
6. Travellers report the gate on the {route} keeps a shorter list now, and reads it faster.
7. The first wagons through paid the new rate without believing it, and came back the long way to check.
8. The gate-clerk at the {route} crossing has a new tariff board and the old one leaning against the wall behind it.
9. The long way round the {route} has gone quiet, and the villages on it have begun asking {counterpart} why.

### cc.market_exclusion (TR-1) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {settlement} shut its market to {counterpart}'s {good} and called it prudence. *(volume exemplar, slotted)*
2. The stalls at {settlement} have no place for {counterpart}'s carts now; the gate-clerks turn them at the bridge.
3. The licence register at {settlement} no longer carries a single name out of {counterpart}.
4. Shut out of {settlement}, the {good} of {counterpart} must go the long way and arrive worth less for it.
5. It was published as an ordinance of quality, and every merchant in {counterpart} read it correctly.
6. Carters turned at the bridge were back in {counterpart} with the news before the ordinance had been copied out.
7. A trader who had sold in that market since their apprenticeship was handed the licence back at the gate.

### cc.market_opened (TR-1) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {settlement} opened its market to {counterpart}'s {good}, and the bridge has been busy since.
2. The carters of {counterpart} sleep in {settlement}'s inns now, and the innkeepers have opinions about it.
3. The licence register at {settlement} carries {counterpart} names again, the first in a long while.
4. With the gate open, {counterpart}'s {good} sets the terms in {settlement}'s stalls, and its rivals have noticed.
5. {settlement} called it a courtesy; the wharf calls it a windfall.
6. Word of the opening reached {counterpart} before the couriers did, carried by carters who had already been through.
7. The gate-clerk at {settlement} has a page of new names to learn and spells half of them wrong.

### cc.cornering (TR-1) — Herald, commerce desk — significance: major
SLOTS: {settlement} {counterpart} {house} {good}
AUDIENCE: public
1. A house of {counterpart} holds the {good} that {settlement} eats, and {settlement} knows it.
2. In the market at {settlement} the {good} comes from one warehouse, and the warehouse stands in {counterpart}.
3. The stall-books of {settlement} record a single hand behind every sale of {good} this season.
4. While {house} holds the granaries of {counterpart}, no bargain struck in {settlement} is struck freely.
5. {counterpart} calls it a prudent stock; {settlement} calls it a hand at the throat.

### cc.provision (TR-1) — Herald, commerce desk — significance: routine
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {counterpart} sold {settlement} the {good} it needed, in the season it was needed.
2. The bread at {settlement} came from {counterpart}'s wagons this winter, and the bakers said so.
3. The granary book at {settlement} names {counterpart} in every entry of the lean months.
4. {settlement} owes {counterpart} a full granary, and debts of that kind are remembered longest.
5. {counterpart} made no speech about it; the wagons arrived.
6. Carters down from {counterpart} came in loaded and went back empty, and made nothing of it.
7. It is the lean months {counterpart} sells into, and it has sold into them every year the clerks can name.
8. An old woman at the {settlement} gate counted the wagons in and told her grandchildren whose they were.
9. At {counterpart} the sale is a season's ordinary business; at {settlement} it was the difference between a hard winter and a bad one.

### cc.famine_profiteering (TR-1) — Herald, commerce desk — significance: major
SLOTS: {settlement} {counterpart} {house} {good}
AUDIENCE: public
1. {settlement} says {house} sold dear to it while the granaries of {counterpart} stood full.
2. In the bread queues of {settlement} they name {house}, and they do not say the name kindly.
3. The relief book at {settlement} records what {counterpart} asked for {good} in the hungry season, and the clerks underlined it.
4. What {counterpart} took from {settlement} in the famine will be argued at every table for a generation.
5. {counterpart} calls it the market; {settlement} lived through that winter and calls it something else.

### cc.famine_relief (TR-1) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {counterpart} sent {good} into {settlement}'s hungry season and asked nothing at the gate.
2. The queues at {settlement} thinned the week {counterpart}'s wagons came, and the town has not forgotten which week.
3. The granary book at {settlement} carries {counterpart}'s name against the worst month of the year.
4. What {counterpart} gave in the lean season will be spoken of when the next bargain is struck.
5. {counterpart} sent the {good} quietly; {settlement} has been loud about it ever since.
6. Carters on the road say they passed {counterpart}'s wagons going the other way, loaded, and were waved through the toll.
7. A baker at {settlement} kept one of {counterpart}'s empty sacks nailed above the oven, and would tell you why.

### cc.dependency_fear (TR-1) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {good} {route}
AUDIENCE: public
1. {settlement} buys its {good} from {counterpart} and from nowhere else, and the court has begun to say so aloud.
2. In the guildhall at {settlement} they ask what happens to the bread if the {route} closes.
3. The books at {settlement} show one supplier of {good} and no second name — a column that reads as a leash.
4. So long as {counterpart} holds the only road for {good}, every quarrel between them will be argued on {counterpart}'s terms.
5. {counterpart} calls it a partnership; {settlement} has begun to call it a rope, though not yet in public.
6. Travellers at the {settlement} gate are asked how the harvest looked at {counterpart}, and are asked before they are asked their business.
7. Every winter the question is put again in the guildhall, and every spring the wagons arrive and it is put away.

### cc.dependency_comfort (TR-1) — Herald, commerce desk — significance: routine
SLOTS: {settlement} {counterpart} {good} {route}
AUDIENCE: public
1. {settlement} buys its {good} from {counterpart} and sleeps the better for it.
2. The carters run the {route} in all weather now; the road is a habit and not a venture.
3. The books at {settlement} show one supplier of {good} for years running, and not one lean month among them.
4. While the {route} holds, {settlement} has no need to court a second seller, and no wish to.
5. It is a dependence, and nobody in {settlement} has thought to worry about it.
6. Strangers remark that the {route} is busier than the towns at either end of it; neither town finds that strange.
7. Winter and summer alike the {good} comes from {counterpart}; the season changes the weather and nothing else.
8. Children at {settlement} know the {counterpart} carters by name, which is a kind of treaty nobody signed.
9. The guildhall at {settlement} keeps no list of second sellers and has not been asked for one in years.

### cc.contraband_injury (TR-1) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. The word in {settlement} is that {counterpart}'s gates pass contraband, and that {settlement}'s losses begin there.
2. The carters say the {route} out of {counterpart} carries two cargoes, and only one of them is declared.
3. The assize at {settlement} has heard the same complaint against {counterpart} from a score of merchants.
4. Until {counterpart} answers for its gates, {settlement}'s wardens will search every cart off that road.
5. Nothing was proved. The market at {settlement} settled the matter anyway.
6. Carters say the night traffic out of {counterpart} is heavier than the day's, and say it where the wardens can hear.
7. The wardens of the towns down the {route} have begun comparing their seizure books, and the same gate is named in all of them.

### cc.honest_gates (TR-1) — Herald, commerce desk — significance: routine
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. {counterpart}'s gates are said to be clean, and {settlement}'s merchants trade there without a second man watching.
2. The carters call the {route} out of {counterpart} a dull road, which from a carter is high praise.
3. The wardens' book at {settlement} records no seizure out of {counterpart} in a long season.
4. While {counterpart}'s gates keep that name, {settlement}'s factors will leave cargo on the quay overnight and expect to find it there.
5. {counterpart} has no reputation at all in this matter, and that is the reputation it wanted.
6. Merchants who have gone through worse gates make a point of mentioning {counterpart}'s, which is rare praise from that trade.
7. Season after season the search at {counterpart} takes the same short hour, and the carters have stopped budgeting for more.
8. The gate-wardens at {counterpart} are said to hand back what they find and to look insulted when thanked.
9. {counterpart} pays its gate-wardens better than the law asks and counts their books oftener, and makes no announcement of either.

### cc.route_predation (TR-1) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. {counterpart} lets the {route} go unpoliced, and the wagons of {settlement} pay the difference.
2. Season after season of losses on the {route}, and the carters of {settlement} name the same stretch of road.
3. The loss column for the {route} in {settlement}'s book is longer than the column for the sea.
4. While the {route} stays unwardened, {settlement}'s factors will price {counterpart}'s goods for the risk of fetching them.
5. {counterpart} says the woods belong to nobody; {settlement} agrees, and remembers who owns the road through them.
6. Travellers hire a second man for that stretch and do not think themselves timid for it.
7. The inn at the head of the {route} keeps a room for carters who turned back, and it is seldom empty.

### cc.route_wardenship (TR-1) — Herald, commerce desk — significance: routine
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. {counterpart} put patrols on the {route}, and the wagons of {settlement} began to arrive whole.
2. The carters say the {route} is quiet now; they mean the woods and not the traffic.
3. The loss column for the {route} in {settlement}'s book has stood empty since {counterpart} took the wardenship.
4. A policed road is worth a toll, and {settlement}'s factors have stopped arguing about the toll.
5. {counterpart} calls it the upkeep of the road. This time the carters agree.
6. Travellers say there are patrol fires along the {route} at night now, and that they slept.
7. The wardens ride the {route} through the winter too, which is when it used to be worst.
8. A carter's wife at {settlement} has stopped walking out to meet the evening wagons, and says so with some embarrassment.
9. The bands that worked the {route} have moved to roads nobody wardens, and those towns have noticed.

### cc.suppressed (TR-1) — DM ledger, scoring receipt — significance: routine
SLOTS: {settlement} {counterpart} {reason} {good}
AUDIENCE: dm-only
*Amendment B: a casus contradicted by a live read scores nothing, with a receipt naming the read. DM-only because the receipt states truth-side state.*
1. The grievance of {reason} against {counterpart} was set aside: the granaries it names stood empty on the day.
2. {settlement}'s complaint scored nothing; the read it rests on says the opposite.
3. The entry stands at nothing and stays in the book; if the granaries fill, it will be weighed again.
4. Nobody at {settlement} was told the claim of {reason} scored nothing, or which read struck it out.
5. The court may say what it likes about {counterpart}'s {good}; the stock book says otherwise, and the stock book is the evidence.
6. The claim was weighed against the live read and failed it; nothing of {reason} reaches the score.
7. Season after season the same grievance is entered and set aside, and the read that strikes it out never changes.
8. {settlement} believes the grievance live and acts on it; the ledger has scored it at nothing since the day it was entered.
9. The clerk who struck it out wrote the read's name in the margin and nothing else.

### cc.severance_crossing (TR-1) — Herald, headline — significance: major
SLOTS: {settlement} {counterpart} {reason} {good}
AUDIENCE: public
1. Trade between {settlement} and {counterpart} is severed, and the reason entered in the book is {reason}.
2. The bridge road stands empty of carts, and both towns have stopped blaming the weather.
3. The licence registers at {settlement} were closed against {counterpart} this week, name by name.
4. With the tie cut, {settlement} must find its {good} elsewhere, and elsewhere is further.
5. It took one ordinance to end what took a generation to build.

### cc.partnership_crossing (TR-1) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {settlement} and {counterpart} are trading partners in earnest now, and the ledgers on both sides say so.
2. There are {counterpart} accents in {settlement}'s market every week, and nobody remarks on them any more.
3. The book at {settlement} shows {counterpart} risen from an occasional name to the first name.
4. What binds them now in {good} will be argued over when they next quarrel.
5. No treaty was signed. The wagons simply kept coming.
6. It was a summer's convenience once, and it is how both towns eat now.
7. There are marriages between the two quays, and {settlement} has stopped calling {counterpart}'s carters strangers.

### dossier.trade_relation_line (TR-1) — town dossier, relations panel — significance: routine
SLOTS: {counterpart} {band} {good} {route} {reason}
AUDIENCE: public
1. Trade with {counterpart}: severed — they shut their market in the spring. *(volume exemplar, slotted and de-digited)*
2. Trade with {counterpart}: {band} — {good} moves both ways, and the road is policed.
3. Trade with {counterpart}: strained — the toll on the {route} has not come down since the quarrel.
4. Trade with {counterpart}: none recorded; no cart has crossed in living memory.
5. Trade with {counterpart}: {band} — bound to their {good}, and the guildhall says so uneasily.
6. Trade with {counterpart}: severed — the reason recorded is {reason}, and neither court disputes it.
7. Trade with {counterpart}: {band} — chiefly {good}, and chiefly one way.
8. Trade with {counterpart}: reviving — the first carts in a generation came up the {route} last season.
9. Trade with {counterpart}: {band}, and seasonal; the {route} is shut from the first frost to the thaw.
10. Trade with {counterpart}: {band} — steady for years, and nobody at the guildhall can name the year it began.

---

# TR-2 — THE HOUSE (`merchantHousesEnabled`)

### house.formed (TR-2) — Herald, house voice — significance: notable
SLOTS: {settlement} {house}
AUDIENCE: public
1. {house} keeps books at {settlement} now, and the wharf has begun to watch them.
2. There is a new name on the {settlement} quay, and the older names have noticed.
3. The guild register at {settlement} entered {house} among the trading concerns this season.
4. With {house} lending and buying, no venture out of {settlement} will be arranged without asking them first.
5. {house} began with one warehouse and a modest credit, as every house that matters began.
6. The sign went up unpainted and stayed unpainted a season, which the wharf noticed and respected.
7. Factors out of {settlement} carry the new name in their orders now, and are asked about it at every gate.

### house.sponsor_caravan (TR-2) — Herald, house voice — significance: routine
SLOTS: {settlement} {counterpart} {house} {good}
AUDIENCE: public
1. {house} put its name to a caravan out of {settlement}, bound for {counterpart}.
2. The wagons left the {settlement} gate before dawn with {house}'s mark on the tarpaulins.
3. The sponsorship stands in {house}'s book against the {good} it hopes to sell in {counterpart}.
4. If the caravan reaches {counterpart}, {house} is the richer; if not, the road will have it.
5. {house} calls it a modest venture, and it has sold nothing yet, which is the modest part.
6. The caravan was seen at the second ford keeping good time, by carters with no reason to lie about it.
7. {house} sponsors one caravan a season, and the quay at {settlement} sets its year by them.
8. A child of the {house} rides with the wagons this time, which the older factors regard as either training or insurance.
9. At {counterpart} they know the mark, and have kept space at the wharf against it.

### house.take_route_interest (TR-2) — Herald, house voice — significance: routine
SLOTS: {house} {route}
AUDIENCE: public
1. {house} took an interest in the {route}. *(volume exemplar, slotted)*
2. The carters on the {route} have a new employer's name to learn.
3. {house}'s book now carries the {route} among its standing interests, with the season noted.
4. Whatever befalls the {route} now befalls {house}, and {house} will act as though it does.
5. {house} bought no road — there is no road to buy. It bought the traffic, which is better.
6. Travellers on the {route} report new sheds at the water stops, and the same mark on all of them.
7. The interest was taken before the passes opened, which is when such things are taken.
8. The ferryman at the crossing has a retainer now and has stopped arguing about the fare.
9. The other houses read the entry the day it was made, and have begun asking what {house} knows about the {route}.

### house.extend_credit (TR-2) — Herald, house voice — significance: notable
SLOTS: {settlement} {house} {route}
AUDIENCE: public
1. {house} extended credit to the seat of {settlement}, and asked for the {route} in the terms.
2. The clerks say the seat borrowed from {house} this season, and the clerks are rarely wrong about that.
3. {house}'s book carries the seat of {settlement} as a debtor, which is a different thing from a patron.
4. A seat that owes {house} will find {house} at its elbow the next time the market law is written.
5. {house} lent freely and asked for nothing in writing, which is how the expensive favours begin.
6. The loan was made in the lean month, when a seat asks and does not bargain.
7. The instrument was signed in the guildhall and not the court, at {house}'s asking.

### house.relief_grant (TR-2) — Herald, house voice — significance: notable
SLOTS: {settlement} {house} {good}
AUDIENCE: public
1. {house} opened its granaries to {settlement} in the lean month and took no profit on it.
2. The bread queues at {settlement} shortened, and the loaves came with {house}'s mark on the sacks.
3. The relief stands in {house}'s book as a loss, entered without complaint.
4. The town will remember {house} kindly for a season, and longer if the next winter is worse.
5. {house} gave the {good} away and let other people say why.
6. Travellers into {settlement} that month found the queues short and the reason freely offered.
7. It was done in the worst week of the winter, which is the week that gets remembered.

### house.petition_pact (TR-2) — Herald, chancery desk — significance: routine
SLOTS: {settlement} {counterpart} {house} {good} {reason}
AUDIENCE: public
1. {house} petitioned the seat of {settlement} to treat with {counterpart} over {good}.
2. The guildhall sent its request to the court, and the court has not yet answered.
3. {house}'s petition is entered in the court book: a compact for {good}, with the reason given as {reason}.
4. If the seat listens, {settlement} is bound to {counterpart} for years, and {house} has counted those years.
5. {house} asked for a treaty and called it a courtesy to the town.
6. The wharf at {settlement} had read the petition before the court did, and had already priced it.
7. {house} puts its petition in before the harvest is counted, every time, and has never explained why.
8. The petition is in the family's own hand and not a clerk's, which the court book notes without comment.
9. At {counterpart} they have heard of the petition and are waiting to be asked properly.

### house.holdings_rise (TR-2) — Herald, house voice — significance: notable
SLOTS: {settlement} {house} {band}
AUDIENCE: public
1. {house} is {band} now, and the wharf says so without irony.
2. There are new warehouses on the {settlement} quay, and they are all one family's.
3. {house}'s book crossed into the {band} rank this season, and its credit crossed with it.
4. At {band}, {house} can outlast a bad season, and outlast rivals who cannot.
5. {house} has taken to lending rather than borrowing, which is the only announcement it will make.
6. {house}'s factors have taken the good table at the {settlement} inn, and nobody has argued about it.
7. The older houses of {settlement} have begun inviting {house} to things, which is how they count.

### house.holdings_fall (TR-2) — Herald, house voice — significance: notable
SLOTS: {settlement} {house} {band}
AUDIENCE: public
1. {house} is {band} now, and the wharf has stopped saying so to its factors' faces.
2. A warehouse on the {settlement} quay changed hands this season, and it was {house}'s.
3. {house}'s book fell a rank, and its lenders have begun to ask for terms.
4. At {band}, {house} cannot carry a bad voyage, and the next one decides it.
5. {house} says it is consolidating. Its rivals have learned that word.
6. The mark on the remaining warehouse was repainted this spring, which the wharf found sadder than the sale.
7. Factors at the far gates have begun asking {house}'s riders for terms in advance, politely.

### house.credibility_fall (TR-2) — Herald, house voice — significance: notable
SLOTS: {settlement} {house} {reason}
AUDIENCE: public
1. {house}'s word is worth less at the {settlement} wharf than it was a season ago, and the reason recorded is {reason}.
2. Factors who once took {house}'s word now ask for it in writing.
3. The guild book records {house}'s default, and the entry will outlive the debt.
4. {house} will find every future bargain dearer and will not be told why.
5. Nobody has accused {house} of anything, and nobody deals with it on a handshake either.
6. Riders coming into {settlement} carry the story ahead of {house}'s own factors, and tell it first.
7. A bargain was struck at the wharf last week with a clerk present, and both parties pretended that was usual.

### house.dormant (TR-2) — Herald, house voice — significance: routine
SLOTS: {settlement} {house} {reason}
AUDIENCE: public
1. {house} trades no longer at {settlement}; its books are closed but kept, and the reason is {reason}.
2. The warehouse door is barred and the mark painted out; the ledgers went with the family.
3. The guild register moved {house} to the dormant column, with its holdings entered as they stood.
4. Whatever {house} still owns it cannot use, and when it trades again it will trade from that page.
5. {house} did not fail; it simply stopped being a house of trade, which the register handles differently.
6. The wharf at {settlement} still calls the corner building {house}'s, and will for a generation.
7. The books were closed for a season and have stayed closed through every season since.
8. The family keeps the ledgers dry and the mark's stencil in a drawer.
9. Factors arriving at {settlement} with {house} in their orders are sent to an address that answers nothing.

### house.woken (TR-2) — Herald, house voice — significance: routine
SLOTS: {settlement} {house}
AUDIENCE: public
1. {house} trades again at {settlement}, and the books were reopened where they were closed.
2. The mark is back on the warehouse door, a little fresher than the wood around it.
3. The guild register returned {house} to the active column with its old holdings intact.
4. {house} resumes with the standing it had and the rivals it left.
5. The interval will not appear in {house}'s own telling of the matter.
6. The wharf at {settlement} has begun saying the name aloud again, and pretending it never stopped.
7. They reopened before the passes did, which the older factors read as confidence.
8. The first entry in the reopened book carries the season and nothing else at all.
9. The houses that divided {house}'s custom between them have stopped dividing it and started defending it.

### house.lineage_return (TR-2) — Herald, house voice — significance: notable
SLOTS: {settlement} {house}
AUDIENCE: public
1. The {house} name trades again. *(volume exemplar, slotted)*
2. There is a {house} on the {settlement} wharf once more, and the old carters make a point of the name.
3. The guild register carries a new entry under an old name, and the books beneath it are fresh.
4. The name is the same and the credit is not; {house} begins where any new house begins.
5. They left the trade ruined, and their grandsons opened the warehouse again, quietly.
6. They opened in the spring, which the old carters say is what the family did the first time.
7. The name is cut into the lintel of a building the family no longer owns, and {house} has made no request about it.

### house.out_of_posture_act (TR-2) — Herald, house voice — significance: notable
SLOTS: {settlement} {house} {reason}
AUDIENCE: public
1. {house} is a cautious concern, and it has staked everything on this one; the town has remarked on it.
2. The wharf at {settlement} did not expect it of {house}, and says so at every table.
3. The act is entered in {house}'s book against its own standing practice, with the reason given as {reason}.
4. If it fails, {house} will be judged for the boldness before it is judged for the loss.
5. {house} has done what it spent a generation advising others not to do.
6. The quay has been betting on it quietly, and not in {house}'s favour.
7. The story reached the far gates within the season, improved a little at each of them.

### house.covert_interest (TR-2b, provisional) — DM ledger, syndicate lane — significance: notable
SLOTS: {settlement} {house} {good} {route}
AUDIENCE: dm-only
*TR-2b is a recorded shape, not a drafted wave; pool authored to the floor and re-validated when the wave is drafted.*
1. {house}'s declared interest is the {route}; its true one is what moves on it after dark.
2. The front is a {good} warehouse; the {good} is real, and it is not the business.
3. Two books are kept, the guild's copy and the family's, and they do not agree about {good}.
4. If the assize ever reads the second book, {house} loses the first.
5. {house} is a respectable concern at {settlement} and has paid a great deal to remain one.
6. The second book is kept in a hand nobody at the guild would recognise.
7. Every honest cargo {house} moves on the {route} makes the other kind easier to move.

### dossier.house_entry_line (TR-2) — town dossier, factions panel — significance: routine
SLOTS: {settlement} {counterpart} {house} {npc} {band} {good} {route} {reason}
AUDIENCE: public
1. {house} — {band}; the {route}, the {good} trade; Factor {npc}, abroad at {counterpart}. *(volume exemplar, slotted)*
2. {house} — {band}; interests in {good} only; Factor {npc}, at home.
3. {house} — {band} and falling; the {route} interest sold this season; Factor {npc}, at {settlement}.
4. {house} — dormant; books kept, no acts recorded; no factor cast.
5. {house} — {band}; the word at the wharf is poor since the {reason}; Factor {npc}, abroad at {counterpart}.
6. {house} — {band} and rising; new warehouses on the {settlement} quay; Factor {npc}, on the {route}.
7. {house} — {band}; holds a stock of {good} and sells none of it; Factor {npc}, at home.
8. {house} — {band}; lender to the seat of {settlement}; Factor {npc}, abroad at {counterpart}.
9. {house} — {band}; an old name newly returned, credit unproven; Factor {npc}, at {settlement}.
10. {house} — {band}; the {route} interest and a venture out to {counterpart}; Factor {npc}, overdue.

---

# TR-3 — BELIEVED MARKETS (`believedMarketsEnabled`)

Every public pool here is belief-side and carries its attribution. Truth reaches
these sentences only through arrivals, rumor, and plants.

### market.believed_dear (TR-3) — Herald, market desk — significance: routine
SLOTS: {settlement} {counterpart} {good} {route}
AUDIENCE: public
1. {good} is dear in {counterpart}, they say — and dearer for the saying. *(volume exemplar, slotted)*
2. Every carter at the {settlement} gate has the same rumour, and each has it from a different road.
3. The factors of {settlement} have written {counterpart} down as dear in {good}, on the word of the last cart in.
4. If the word holds, half the wagons in {settlement} will be on the {route} before the month is out.
5. Nobody in {settlement} has seen {counterpart}'s market, and everybody in {settlement} knows what it pays.
6. A rider in off the {route} said what {counterpart} was paying, and said it in a full room.
7. The word came up with the first wagons of the season, and a season's dispatches will be built on it.
8. The innkeeper at the {settlement} gate has begun charging riders less for their beds and hearing more.
9. One old factor at {settlement} asks who carried the word, and is answered with a shrug.

### market.believed_glut (TR-3) — Herald, market desk — significance: routine
SLOTS: {settlement} {counterpart} {good} {route}
AUDIENCE: public
1. {good} is cheap in {counterpart}, they say, and the carters have stopped asking after the road.
2. The word at the {settlement} wharf is that {counterpart} is drowning in {good}.
3. The factors of {settlement} have marked {counterpart} soft in {good} and turned their ledgers elsewhere.
4. While the word stands, no cart out of {settlement} will trouble the {route}.
5. A rumoured glut is worth more than a real one; it costs nothing to carry.
6. The last carters in from {counterpart} said the stalls there were stacked to the awnings, and were believed.
7. The word arrived with the harvest and will outlast it by a season at least.
8. A young factor loaded for {counterpart} anyway and has been talked out of it twice since.
9. Nobody has asked which harvest the word refers to, and the wharf would rather not.

### market.belief_corrected_by_arrival (TR-3) — Herald, market desk — significance: notable
SLOTS: {settlement} {counterpart} {good} {band}
AUDIENCE: public
1. A caravan came in from {counterpart}, and {settlement} learned what {good} really fetches there.
2. The carters brought the truth home with the cargo, and the wharf revised itself in an afternoon.
3. The factors' book at {settlement} was struck through and written again: {counterpart}, {good}, {band}.
4. The next wagons out of {settlement} will go somewhere else entirely.
5. The rumour survived a season and one arrival.
6. The carters were made to tell it twice, once at the {settlement} gate and once in the guildhall.
7. It took one arrival at the end of the season to undo what the whole season had built.

### market.wrong_market_arrival (TR-3) — Herald, market desk — significance: notable
SLOTS: {settlement} {counterpart} {house} {good} {band}
AUDIENCE: public
1. The caravans came for the famine and found the harvest. *(volume exemplar)*
2. They unloaded into a market that had no need of them, and the stalls hardly looked up.
3. The {good} is entered at {counterpart} against a band it no longer commands, and the loss is {house}'s.
4. {house} will sell at {band} or carry it home, and either way the season is spent.
5. The word was true when they left {settlement}, and that is the whole of the tragedy.
6. The lead carter asked twice at the {counterpart} gate whether they had come to the right town.
7. The stake was reckoned against a band that had already gone, and the reckoning is what {house} will be judged on.

### market.dispatch_chosen (TR-3) — Herald, market desk — significance: routine
SLOTS: {settlement} {counterpart} {house} {good} {route}
AUDIENCE: public
1. {house} sent its wagons to {counterpart} because {good} is believed dear there.
2. Of the roads out of {settlement} the carters were given the {route}, and were not told why.
3. The dispatch is entered against the believed band at {counterpart} and the danger on the {route}.
4. If the belief is stale, the cargo will discover it first.
5. They chose the market they had heard of over the market they could see.
6. The road report {house} acted on came from one rider, and the rider has ridden on.
7. The dispatch goes out at the turn of the season, when the belief is the freshest it will ever be.
8. The senior factor argued for the shorter road and was overruled by the ledger.
9. Other houses of {settlement} read the same word and stayed where they were.

### market.stale_belief (TR-3) — Herald, market desk — significance: routine
SLOTS: {settlement} {counterpart} {good} {route}
AUDIENCE: public
1. {settlement} still holds {counterpart} dear in {good}; it has been otherwise since the spring.
2. No cart has come up the {route} in months, and the wharf's opinion of {counterpart} is that old.
3. The factors' book at {settlement} carries a band for {counterpart} that no living cargo supports.
4. Someone will sail on that page before anyone corrects it.
5. The news is only as fresh as the road, and the road has been quiet.
6. The last traveller to speak of {counterpart}'s market did so a season ago and has not come back that way.
7. The band was true at the harvest and has been carried through a whole winter without a witness.
8. The page has been thumbed pale and never once amended.
9. The guildhall at {settlement} keeps the season beside the band, and nobody reads the season.

### dossier.market_line (TR-3) — town dossier, market line — significance: routine
SLOTS: {counterpart} {good} {band}
AUDIENCE: public
1. {good}: fair here; dear in {counterpart}, they say. *(volume exemplar, slotted)*
2. {good}: {band} here; nothing heard out of {counterpart} in a season.
3. {good}: {band} here, and {band} on every road the carters name.
4. {good}: {band} here; {counterpart} is said to be glutted, though the word is old.
5. {good}: {band} here — and the town believes {counterpart} is worse off, which is why the wagons are loading.
6. {good}: {band} here; the word out of {counterpart} is a season old and was good then.
7. {good}: {band} here, and dearer every week the roads stay shut.
8. {good}: {band} here; {counterpart} is said to be the same, which nobody trusts.
9. {good}: {band} here — the last arrival from {counterpart} corrected the wharf sharply.
10. {good}: {band} here; no road has brought word of {counterpart} at all, and the factors dispatch elsewhere.

### dossier.market_line_truth (TR-3) — town dossier, DM toggle — significance: routine
SLOTS: {counterpart} {good} {band}
AUDIENCE: dm-only
*Rides `includeGroundTruth`; the only surface where the two scarcities appear side by side, and they are never combined.*
1. {good}: {band} here in truth; the town believes {counterpart} dear, and {counterpart} is {band}.
2. {good}: believed {band} at {counterpart}; the stocks there say otherwise, and no arrival is due to correct it.
3. {good}: belief and truth agree at {counterpart} this season, the roads having been open.
4. {good}: the town's picture of {counterpart} is a season old and drifting further each week.
5. {good}: {band} in truth on every road here; every dear band the town holds was planted or misheard.
6. {good}: {band} in truth here and believed otherwise; nothing on the roads will correct it this season.
7. {good}: {band} at {counterpart} in truth; the town's band was true a season ago and has drifted since.
8. {good}: the belief here is dearer than the truth, and the wagons now loading will discover it at the gate.
9. {good}: {band} in truth at {counterpart}; the belief was planted and has held.
10. {good}: belief and truth agree here; the town has been lucky rather than informed.

---

# TR-4 — THE GRAIN ROAD (`foodCaravansEnabled`)

### grain.arrival (TR-4) — Herald, granary desk — significance: routine
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. Fed by {counterpart}'s grain up the {route} — a handful of caravans a month. *(volume exemplar, slotted and de-digited)*
2. The wagons come up the {route} on their days, and the bakers of {settlement} plan by them.
3. The granary book at {settlement} credits {counterpart} for the month's stores, load by load.
4. So long as the {route} runs, {settlement} eats without asking after its own harvest.
5. It is the dullest traffic on the road, and the town would not last a season without it.
6. Travellers time their own journeys by the {counterpart} wagons and are seldom wrong by a day.
7. They come up the {route} from the thaw to the first frost, and the town lays in accordingly.
8. The children at the {settlement} gate know which teams belong to which driver, and wave at both.
9. Nobody at {settlement} could say what the town ate before the {route} ran, and nobody has needed to.

### grain.arrival_drought (TR-4) — Herald, granary desk — significance: notable
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. No wagon has come up the {route} in a season; the granaries speak of it. *(volume exemplar, slotted)*
2. The bakers of {settlement} have begun asking the carters questions the carters cannot answer.
3. The granary book at {settlement} has an empty column where {counterpart}'s loads should stand.
4. At this rate the stores of {settlement} will not see the spring, and the seat knows the arithmetic.
5. Nothing has happened on the {route}, and that is precisely the trouble.
6. Travellers off the {route} report no wagons behind them and none ahead.
7. A gate-keeper at {settlement} has begun walking out along the {route} at dusk, and says it is for the air.

### grain.granary_crossing (TR-4) — Herald, granary desk — significance: notable
SLOTS: {settlement} {band}
AUDIENCE: public
1. The granaries of {settlement} are {band}, and the seat has ordered the stores counted.
2. The bread at {settlement} is smaller this week, and nobody has said why aloud.
3. The granary book at {settlement} crossed into {band} on the season's tally.
4. At {band}, {settlement} can feed itself into the spring and no further.
5. The stores are {band}. The town has not noticed yet; the clerks have.
6. The loft doors at {settlement} were counted open one by one, and the clerk wrote as they went.
7. The tally is taken when the last cart is in, and at {settlement} the last cart came early.

### grain.blockade_bite (TR-4) — Herald, headline — significance: major
SLOTS: {settlement} {route}
AUDIENCE: public
1. The {route} into {settlement} is cut, and the granaries fall week by week.
2. The carters turn back at the ring of tents, and the town counts what is left in the lofts.
3. The granary book at {settlement} records a fall each week and no arrival against it.
4. If the siege holds through the season, {settlement} will be eating its seed corn.
5. No battle has been fought at {settlement}; the wagons simply stopped.

### grain.bypass_trickle (TR-4) — Herald, granary desk — significance: notable
SLOTS: {settlement} {route}
AUDIENCE: public
1. The {route} into {settlement} is cut, and a little grain arrives anyway; the besiegers have not worked out how.
2. The town says the circle in the undercroft is fed as well as the garrison, and the town is not entirely wrong.
3. The granary book at {settlement} credits arrivals against a road no wagon has used in a month.
4. {settlement} will not fall this season, and the besiegers have begun to plan for the next.
5. A blockade takes the road. It has never taken everything.
6. A child at {settlement} was found with a full sack and no answer about where it came from.
7. The besiegers' own carters say the woods are busier at night than the road is by day.

### grain.smuggler_relief (TR-4) — Herald, granary desk — significance: notable
SLOTS: {settlement} {good}
AUDIENCE: public
1. The {good} that reached {settlement} this week came by no road on any map.
2. The bakers ask no questions, and the wardens have not been asking either.
3. No arrival is entered in {settlement}'s book, and the granary is fuller than the book says.
4. While the shortage lasts, the hidden paths will carry what the gate will not.
5. The law of {settlement} forbids it, and the seat of {settlement} is grateful for it.
6. It has come that way every week of the shortage at {settlement}, and will stop the week the shortage does.
7. The sacks arrive unmarked, and somebody has taken care to unmark them.

### grain.tribute_robbed (TR-4) — Herald, headline — significance: major
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. The tribute was sent, and taken on the road. *(volume exemplar)*
2. The carters walked back to {settlement} with nothing but the story.
3. The dispatch stands in {settlement}'s book, and the arrival stands nowhere in {counterpart}'s.
4. {counterpart} will call it default until it hears otherwise, and it may not hear otherwise.
5. Both towns kept the bargain. The {route} did not.

### grain.robbery_claim (TR-4) — Herald, chancery desk — significance: notable
SLOTS: {settlement} {counterpart} {faction} {route}
AUDIENCE: public
1. {settlement} entered a claim against the {faction} that took its tribute on the {route}.
2. The carters named the banners at the assize, and the clerks wrote the name down.
3. The undelivered balance stands in {settlement}'s book as a claim and not as a debt.
4. {counterpart} will be paid by somebody; the argument is only over which of them pays.
5. The grain is gone, and the claim will outlive the wagons by a generation.
6. One carter drew the banner from memory at the assize, and the clerks pinned the drawing to the claim.
7. Every town on the {route} has begun asking whose wardens were meant to be there.

### grain.export_withheld (TR-4) — Herald, granary desk — significance: notable
SLOTS: {settlement} {counterpart} {good} {reason}
AUDIENCE: public
1. {settlement} has {good} to spare and is sending none; the seat calls it prudence.
2. The carters were paid off at the gate and told to come back in the spring.
3. The export stands cancelled in {settlement}'s book, with the reason entered as {reason}.
4. {counterpart} will find its {good} elsewhere, and will remember where it did not find it.
5. The granaries are full and the road is open. That is the whole of the decision.
6. The wharf at {settlement} is divided about it and loud on both sides.
7. The refusal reached {counterpart} by way of the carters it turned away, which is the worst way to hear it.

### dossier.food_security_line (TR-4) — town dossier, food security line — significance: routine
SLOTS: {settlement} {counterpart} {route} {band}
AUDIENCE: public
1. Fed by {counterpart}'s grain up the {route} — which closes in winter. *(volume exemplar, slotted)*
2. Fed from its own fields and nowhere else; a bad harvest here is a bad year.
3. Fed by {counterpart}'s wagons on the {route}; stores {band}, and falling.
4. Fed by the {route} alone — cut it, and {settlement} has a season's grace and no more.
5. Fed by many roads, no one of which matters, which is why {settlement} sleeps well.
6. Fed by {counterpart} and by one other road; stores {band}, and steady.
7. Fed by the {route} in summer and by its own lofts in winter; stores {band} at the turn.
8. Fed by wagons it does not control; the seat of {settlement} has begun saying so in the guildhall.
9. Fed by {counterpart} under a standing compact; stores {band}, and the compact has years to run.
10. Fed by the {route}, which the besiegers hold; stores {band} and falling week on week.

---

# TR-5 — THE PACT LANE (`tradePactsEnabled`)

### pact.proposed (TR-5) — Herald, chancery desk — significance: notable
SLOTS: {settlement} {counterpart} {good} {reason}
AUDIENCE: public
1. {settlement} has proposed a compact to {counterpart}: {good} by the year, against the standing of the road.
2. The court sent its offer, and the wharf heard about it the same day.
3. The proposal stands in the court book — {good}, by the year — with the reason entered as {reason}.
4. If {counterpart} agrees, {settlement} has bought its bread for a decade; if not, it has shown its hunger.
5. {settlement} asked politely, and asked from a position it would rather not have explained.
6. The offer went out in fair copy, with the seal set twice because the first impression was poor.
7. The envoy's road was watched from both ends, and {counterpart} knew the errand before the envoy arrived.

### pact.formed (TR-5) — Herald, headline — significance: major
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. A grain compact: {counterpart}'s wagons for {settlement}'s peace of mind. *(volume exemplar, slotted)*
2. The seals were set at the bridge, and both sets of carters drank on it.
3. The instrument is entered at both courts: {good} by the year, for a term of years.
4. {settlement} will eat and {counterpart} will be owed, and both will remember which.
5. It is a small document, and it decides who marches and who does not.

### pact.formed_under_hunger (TR-5) — Herald, headline — significance: major
SLOTS: {settlement} {counterpart} {reason}
AUDIENCE: public
1. They bought the grain before they bled for it. *(volume exemplar)*
2. The muster rolls at {settlement} were drawn up and set aside in the same week the compact was sealed.
3. The court entered the compact with the pressure it answers named beside it: {reason}.
4. {settlement} has bought its bread for years, and will owe {counterpart} for every one of them.
5. The winter's argument was war; the spring's answer came on wheels.

### pact.refused (TR-5) — Herald, chancery desk — significance: notable
SLOTS: {settlement} {counterpart} {good} {reason}
AUDIENCE: public
1. {counterpart} refused the compact, and the reason returned with the envoy was {reason}.
2. The wharf at {settlement} took the refusal harder than the court did.
3. The court book records the offer, the refusal, and the season, and nothing else.
4. {settlement} will buy its {good} dearer now, and will not forget who made it do so.
5. {counterpart} kept its independence and paid for it in a currency it has not counted yet.
6. The envoy came back carrying the draft, still folded as it had gone out.
7. The refusal came before the harvest, when {counterpart} could afford to give one.

### pact.term_refused_stacking (TR-5) — Herald, chancery desk — significance: routine
SLOTS: {settlement} {counterpart} {good} {reason}
AUDIENCE: public
1. The second clause was struck: {settlement} is already bound in {good} to another hand.
2. The clerks would not enter it, and the envoys argued in the corridor about whose fault that was.
3. The instrument between {settlement} and {counterpart} already carries a term of that family, and the new one was refused with the reason recorded as {reason}.
4. Until the standing term lapses, no rival clause can be written onto the same page.
5. It was a generous offer, and there was no room on the parchment for it.
6. The wharf at {settlement} heard about the struck clause the same evening and priced it before the court had ruled.
7. The standing term has a year or two left in it, and {counterpart} has been told to come back then.
8. The envoy of {counterpart} kept the struck page and folded it away, which the clerks thought a bad sign.
9. At {counterpart} it is recorded as a refusal; at {settlement} it is recorded as an impossibility.

### pact.renewed (TR-5) — Herald, chancery desk — significance: notable
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The compact between {settlement} and {counterpart} was renewed for another term of years.
2. The same clerks, the same bridge, and a shorter argument than the first time.
3. The instrument is entered again, its record clean and its term extended.
4. The wagons will keep coming, and the carters' sons will drive them.
5. Nothing was renegotiated, which is the highest compliment a compact receives.
6. The old instrument was read aloud once, out of habit, and nobody stopped it.
7. Carters at the bridge learned of the renewal by being waved across it into {counterpart}.

### pact.installment_honored (TR-5) — Herald, chancery desk — significance: routine
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {counterpart} delivered the year's {good} under the compact, and the granary book says so.
2. The wagons came in on their season, as they have every year of it.
3. The compliance stack at {settlement} records the installment paid in full.
4. Another clean year on the record makes the next renewal easier and the next quarrel harder.
5. It arrived. There is nothing further to report, and that is the report.
6. Travellers passed the loaded wagons at the ford and thought nothing about them worth reporting.
7. It arrives in the same week of the same season each year, and the warehouses of {settlement} are made ready on the week.
8. The clerk at {settlement} has a mark for it and uses no words at all.
9. The instrument names a week and {counterpart}'s wagons keep it, which is rarer in the {settlement} court book than that book admits.

### pact.suspended (TR-5) — Herald, chancery desk — significance: notable
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {counterpart} suspended its {good} under the compact: its own reserve stands below the floor.
2. The wagons did not come, and the letter that came instead was read twice at the {settlement} court.
3. The instrument records a suspension and not a default; the clause was written for exactly this year.
4. Whether {settlement} calls it misfortune or oathbreach depends on what it believes about {counterpart}'s harvest.
5. The compact held. The harvest did not.
6. The letter was read out at the {settlement} court and again at the granary door, where it landed differently.
7. The suspension runs to the next harvest, and there are lean months between here and it.

### pact.breached (TR-5) — Herald, headline — significance: major
SLOTS: {settlement} {counterpart} {good} {reason}
AUDIENCE: public
1. Nine years the grain compact held; the ninth year broke it. *(volume exemplar; the year-count is the volume's own, flagged for the counts ruling)*
2. The carters waited at the bridge until the season turned, and then went home.
3. The compliance stack records the breach against {counterpart}, with the reason entered as {reason}.
4. {settlement} will have its {good} from elsewhere and its grievance from here.
5. The document is still valid. Nobody has troubled to say so.

### dossier.treaties_panel_line (TR-5) — town dossier, treaties panel — significance: routine
SLOTS: {counterpart} {good} {route} {reason}
AUDIENCE: public
1. Grain compact with {counterpart} — honored, third year of ten. *(volume exemplar, slotted; the year-count is the volume's own, flagged)*
2. Market access to {counterpart} — standing; no term, no renewal, no quarrel.
3. Toll exemption on the {route} — honored; the gate takes nothing from this town's carts.
4. Exclusivity in {good} to {counterpart} — strained; the guildhall wants it gone.
5. Grain compact with {counterpart} — suspended this year; their reserve is below the floor.
6. Grain compact with {counterpart} — broken; the reason recorded is {reason}.
7. Provisioning compact with {counterpart} — proposed; the court has not answered.
8. Wardenship of the {route} shared with {counterpart} — honored; neither side has claimed the credit.
9. Exclusivity in {good} to {counterpart} — refused; a term of that family already stands.
10. Market access to {counterpart} — renewed for a further term, with nothing renegotiated.

---

# TR-6 — THE CORNER + THE FAMINE SPECULATOR (`corneringEnabled`)

The program's crown drama. Every counterforce carries its own pool, because a
counterforce the chronicle cannot narrate reads to the player as decoration.

### corner.attempt_begun (TR-6) — Herald, market desk — significance: notable
SLOTS: {settlement} {house} {good} {route}
AUDIENCE: public
1. {house} has been buying {good} wherever it is cheap, and buying all of it.
2. The carters say every soft market on the {route} has met the same buyer this season.
3. {house}'s book at {settlement} fills with {good} it has no customer for, which is the point of it.
4. If the lean season comes as {house} expects, it will own the answer to it.
5. Nobody has broken a law, and the granaries of several towns are emptier all the same.
6. {house}'s factors have been paying in coin and asking for no receipt, which the smaller sellers found generous.
7. The buying began after the harvest was counted and before anybody else had finished counting.

### corner.gate_crossed (TR-6) — Herald, headline — significance: major
SLOTS: {settlement} {house} {good}
AUDIENCE: public
1. {house} holds the grain, and the bread knows it. *(volume exemplar, slotted)*
2. The stalls of {settlement} sell {good} from many hands and one warehouse, and have stopped pretending otherwise.
3. The census of reachable stock puts {house}'s share of {settlement}'s {good} above the band, and the clerks entered the day.
4. Nothing of {good} moves in {settlement} until the roads open but on {house}'s terms.
5. {house} calls it a stock held against a hard winter. It is not wrong, and that is the worst of it.

### corner.profiteering_sale (TR-6) — Herald, headline — significance: major
SLOTS: {settlement} {house} {good} {band}
AUDIENCE: public
1. They sold dear to the starving, and the town remembers. *(volume exemplar)*
2. The queue at the {settlement} granary learned the new terms at the door and met them.
3. The sale book at {settlement} enters every load of {good} at {band}, and every entry is evidence.
4. {house} will be richer by spring and friendless for a generation.
5. It was a fair bargain, freely struck, between a full warehouse and an empty stomach.

### corner.conscience_pressure (TR-6) — Herald, house voice — significance: notable
SLOTS: {settlement} {house}
AUDIENCE: public
1. The guilds of {settlement} have begun to move against {house}'s own institutions while the gouge runs.
2. {house}'s factors are served last at the inns now, and served in silence.
3. The abhorrence stands recorded against {house}'s standing in its own town.
4. {house} may hold the granary and lose the hall it sits in.
5. Its neighbours have not stopped dealing with {house}. They have stopped inviting it.
6. A {house} child was left off the guild's midwinter list, and the omission was arranged.
7. It began as a season's coldness and has hardened into the way {settlement} does business.

### corner.broken_by_arrivals (TR-6) — Herald, headline — significance: notable
SLOTS: {settlement} {house} {good}
AUDIENCE: public
1. The dear band {house} made was heard on every road, and the roads answered.
2. Wagons came into {settlement} from towns that had never sent one, and the queue thinned by noon.
3. The arrivals of {good} are entered against {house}'s held share, and the share no longer commands the gate.
4. {house} will sell into the band it broke, and count the difference for years.
5. The corner advertised itself, which was always the flaw in it.
6. The first cart in from a strange town was cheered at the gate, which embarrassed the driver.
7. The roads answered within the season, which is faster than {house} had reckoned any road could.

### corner.broken_by_smugglers (TR-6) — Herald, headline — significance: notable
SLOTS: {settlement} {house} {good}
AUDIENCE: public
1. The corner broke: the smugglers' road fed {settlement} when the warehouse would not. *(volume exemplar, slotted)*
2. The bread came in at night, off nobody's road, and the wardens looked the other way.
3. No arrival is entered anywhere, and {house}'s share of the reachable {good} has fallen regardless.
4. {house} holds the gate, and the woods hold everything else.
5. The law was broken and the town was fed; the assize has been asked which of those matters.
6. The stalls sold {good} nobody could account for, and no stallholder was asked to.
7. It came in through the worst weeks and stopped when the roads opened, as though it had been waiting.

### corner.riot_seizure (TR-6) — Herald, headline — significance: major
SLOTS: {settlement} {house} {good}
AUDIENCE: public
1. The crowd at {settlement} went from petition to the warehouse door, and the door gave way.
2. They carried the {good} to the public granary in their arms, in daylight, past the wardens.
3. The stock is entered out of {house}'s book and into the town's, load for load.
4. {house} will have its grievance against {settlement} and no {good} left to argue it with.
5. The petitions were ignored for a month. The warehouse took an afternoon.

### corner.forced_sale_edict (TR-6) — Herald, headline — significance: major
SLOTS: {settlement} {house} {good} {band}
AUDIENCE: public
1. The seat of {settlement} ordered {house}'s {good} sold into the public granary at {band}.
2. The wardens stood at the warehouse and counted the sacks out while the town watched.
3. The stock moves at the ordered band, entered whole, and {house}'s grievance is entered with it.
4. The town will eat, and the seat will answer to {house} for years.
5. It was tyranny, and the bakers of {settlement} were entirely in favour of it.

### corner.emergency_purchase (TR-6) — Herald, headline — significance: notable
SLOTS: {settlement} {house} {good} {band}
AUDIENCE: public
1. The seat of {settlement} bought {house}'s {good} at the forced band rather than let the town go without.
2. The town watched its own seat pay the gouge, and has been talking about it since.
3. The purchase is entered against the seat's books at {band}, which {house} set.
4. {settlement} is fed and its seat is poorer, and the commons will remember who made it pay.
5. The seat could have seized it and paid instead; it will be judged for both.
6. The seat's clerk counted the coin out on the warehouse table while the crowd watched from the yard.
7. The band the seat paid was known at the next town before the wagons were unloaded at {settlement}.

### corner.carry_strain (TR-6) — Herald, house voice — significance: routine
SLOTS: {settlement} {house} {good}
AUDIENCE: public
1. {house} has held the {good} another season, and its credit has thinned in the holding.
2. The warehouse at {settlement} is full, and the wharf has begun to wonder how long a family can wait.
3. The carry stands against {house}'s credit band, entered season by season.
4. If the lean season does not come, the stock will ruin {house} as surely as a shipwreck.
5. It costs nothing to hold {good}, except everything else {house} might have done with the money.
6. The wharf at {settlement} has begun speaking of {house} in the past tense, which is premature and unkind.
7. Another season held, and the stock has now been carried longer than it was bought to be.
8. The warehouse is turned and aired each month by men paid to do nothing else.
9. The other houses of {settlement} have stopped bidding against {house} and started waiting for it.

### corner.exit_sale (TR-6) — Herald, house voice — significance: notable
SLOTS: {settlement} {house} {good} {band}
AUDIENCE: public
1. {house} sold its {good} into the dear band a week before the wagons came.
2. The wharf at {settlement} calls it luck, and {house}'s factors have not corrected them.
3. The stock is sold out of the book entire, at the band standing on the day.
4. {house} is {band} now, and the roads that would have broken it arrived too late to matter.
5. It heard the wagons coming before anyone else did, and did the only sensible thing.
6. The sale was arranged in an evening, by {house} factors who did not go home to change.
7. The guild book records the sale and the arrivals in the same season, in that order, and the order is the whole story.

### monopoly.dwell_notice (TR-6) — Herald, market desk — significance: routine
SLOTS: {settlement} {house} {good}
AUDIENCE: public
1. There is one seller of {good} in {settlement}, and there has been for years.
2. The stalls quote {house}'s terms because there are no other terms to quote.
3. The sale book at {settlement} names the same supplier in every entry of the season.
4. Nothing is scarce and nothing is cheap; {house} takes its toll quietly.
5. It is not a corner. Nobody else has come, and nobody else comes.
6. The stallholders at {settlement} complain about the terms and buy at them, as they have for years.
7. The terms are set once a season and have not moved a rank in years of them.
8. There is a second warehouse on the quay, empty, that {house} pays the rent on.
9. Merchants passing through {settlement} ask who else sells {good} and are answered with a look.

### monopoly.broken_by_entry (TR-6) — Herald, market desk — significance: notable
SLOTS: {settlement} {house} {faction} {good}
AUDIENCE: public
1. A second house keeps books at {settlement} now, and {good} is bargained over for the first time in years.
2. The carters have a choice of employers, and have discovered that they enjoy it.
3. {faction}'s entry drops {house}'s share below the band the ledger watches.
4. {house} will meet the newcomer's terms or watch its custom walk down the quay.
5. The years of easy takings summoned the rival; the quiet toll paid for its wagons.
6. The new house painted its mark on the quay wall opposite {house}'s, which everyone agreed was deliberate.
7. Merchants arriving at {settlement} are met at the gate by two sets of factors now, and enjoy it.

### corner.remembered_generational (TR-6) — Herald, chronicle voice — significance: notable
SLOTS: {settlement} {house}
AUDIENCE: public
1. They still call it the winter {house} held the grain.
2. The old carters date things from it: before that winter, and after.
3. The chronicle of {settlement} keeps the season under {house}'s name, and no clerk has moved it.
4. Grandchildren of that queue will refuse {house}'s custom without being able to say why.
5. The corner lasted a season; the name has lasted generations.
6. There is a word in the {settlement} market for buying more than you need, and it is {house}'s name.
7. Strangers at {settlement} are told the story before they are told the way to the inn.

### dossier.corner_market_line (TR-6) — town dossier, market line — significance: routine
SLOTS: {house} {good} {band}
AUDIENCE: public
1. {good}: desperate — {house} holds the granaries. *(volume exemplar, slotted)*
2. {good}: dear — one warehouse behind the stalls, and no wagons due.
3. {good}: {band} — {house}'s stock is broken and the roads are open again.
4. {good}: {band} — the granary was taken from {house} by the crowd in the spring.
5. {good}: {band}; sole supplier {house}, standing these many years.
6. {good}: {band} — {house} buys everything soft on every road, and has for a season.
7. {good}: {band} — sold out of {house}'s book a week before the wagons came.
8. {good}: {band}; the seat bought {house}'s stock at the forced band rather than go without.
9. {good}: {band} — a second house keeps books here now, and the terms are argued again.
10. {good}: {band}; the stock came in by no road on any map, and the stalls asked nothing.

---

# TR-7 — VENTURES (`venturesEnabled`)

### venture.proposed (TR-7) — Herald, house voice — significance: routine
SLOTS: {settlement} {counterpart} {house} {good}
AUDIENCE: public
1. {house} has put a venture before its partners: {good} to {counterpart}, on the strength of what the road reports.
2. The wharf at {settlement} knows the shape of it already, which is how the wharf usually knows.
3. The venture is entered proposed, with the believed band at {counterpart} named as the reason.
4. If the partners agree, {house}'s season rides on one road.
5. It is a modest proposal, and every ruin in the guild book began as one.
6. The proposal was argued over a table at the {settlement} guildhall until the candles were done.
7. It is put before the partners now so the wagons can leave for {counterpart} when the passes open.
8. The road report it rests on came in with the last carts of the season and has not been checked since.
9. Another house was offered a share and asked for a night to think about it.

### venture.departed (TR-7) — Herald, house voice — significance: notable
SLOTS: {settlement} {house}
AUDIENCE: public
1. The {house} venture left {settlement} at the turn of the season, stake and all.
2. Half the quay came to watch the loading, which is the honest measure of the risk.
3. The stake is entered out of {house}'s books at departure; the return is entered nowhere yet.
4. Until it comes back, {house} is poorer by everything it put aboard.
5. The wagons went out heavy. That is all anyone knows for certain.
6. They went out with the first clear week of the season and will be judged on the last one.
7. An older factor of {house} walked the wagons to the {settlement} gate and did not go back to the quay after.

### venture.failed (TR-7) — Herald, headline — significance: major
SLOTS: {settlement} {house} {reason} {route}
AUDIENCE: public
1. The {house} venture is lost, and the cause recorded is {reason}.
2. The news came back to the {settlement} quay before the season did, and it came back alone.
3. The venture closes failed in {house}'s book, the stake struck out and nothing set against it.
4. {house} will not stake another for a long while, and will be careful when it does.
5. The {route} took it. The {route} has taken better.

### venture.completed (TR-7) — Herald, headline — significance: major
SLOTS: {settlement} {house} {band}
AUDIENCE: public
1. The {house} venture returned with fortune. *(volume exemplar, slotted)*
2. The quay at {settlement} counted the wagons in twice, to be sure of them.
3. The venture closes completed, and {house}'s books cross into {band} on the strength of it.
4. {house} will stake again by spring, and stake higher.
5. One voyage, and the family that was talked about is now consulted.

### venture.abandoned (TR-7) — Herald, house voice — significance: routine
SLOTS: {counterpart} {house} {reason}
AUDIENCE: public
1. {house} called its venture back before the second stage, and the reason recorded is {reason}.
2. The carters were paid off at {counterpart} and the cargo sold where it stood.
3. The venture closes abandoned, the stake partly recovered and the season spent.
4. {house} kept its books and lost its year.
5. It was the sensible course, and no ballad will be made of it.
6. The quay heard of {house}'s recall before the carters did, and had its opinions ready for them.
7. It was called back before a second season could close on it, which is the only mercy in the entry.
8. The order caught them at an inn, and they read it twice before turning the teams.
9. At {counterpart} the cargo was bought cheap by people who knew exactly why it was for sale.

### venture.joint_stake (TR-7) — Herald, house voice — significance: routine
SLOTS: {house} {faction}
AUDIENCE: public
1. {house} and {faction} have staked a venture together and split it down the middle.
2. The two families put their marks on the same tarpaulin, which the quay had not expected to see.
3. Both books carry the stake at a banded share, and both carry the same expected return.
4. If it comes home they will do it again; if it does not, they will argue about whose road it was.
5. They have distrusted each other for a generation and found one season's reason not to.
6. The quay has made a joke of {house}'s mark beside {faction}'s and repeats it hourly.
7. They agreed it in the winter, when neither {house} nor {faction} could have carried the season alone.
8. The instrument was drawn in two copies, and each family keeps its own, unread since.
9. At the far gates the venture is known by both names, and nobody there finds the pairing strange.

### venture.joint_default (TR-7) — Herald, house voice — significance: notable
SLOTS: {house} {faction}
AUDIENCE: public
1. {faction} did not put in its share, and {house} carried the venture alone.
2. The quay watched one family load and the other explain.
3. The unpaid share is entered against {faction} in {house}'s book, and in the guild's.
4. {house} will have its return and its grievance, and the grievance will last longer.
5. The partnership held to the last clause but one.
6. The share was promised at the guildhall in front of witnesses, and {house} has begun asking the witnesses.
7. The default came at the loading, when there was no season left to find another partner in.

### venture.overreach_out_of_posture (TR-7) — Herald, house voice — significance: notable
SLOTS: {house} {reason}
AUDIENCE: public
1. {house} staked more than a cautious concern should, and the wharf has said so plainly.
2. The older factors argued against it and were overruled by the family.
3. The stake stands above {house}'s own standing practice, with the reason entered as {reason}.
4. If it comes home they were bold, and if not they were foolish, and the same men will say both.
5. {house} has spent a generation telling other people not to do this.
6. {house} voted it at a table, and the vote is remembered as having been close.
7. The size of the stake was known at the far gates before the wagons reached the first of them.

### dossier.venture_line (TR-7) — town dossier, house entry — significance: routine
SLOTS: {counterpart} {route} {band}
AUDIENCE: public
1. The {counterpart} venture — underway, due by autumn. *(volume exemplar, slotted)*
2. The {route} venture — proposed; the partners have not yet agreed.
3. The {counterpart} venture — overdue; nothing heard since the pass closed.
4. The {counterpart} venture — returned; the books are {band} for it.
5. The {counterpart} venture — failed on the {route}; the stake is struck out.
6. The {counterpart} venture — abandoned at the second stage; the stake is part recovered.
7. The {counterpart} venture — jointly staked; the share is entered at {band}.
8. The {route} venture — departed this season; nothing entered against it yet.
9. The {counterpart} venture — returned early and light; the books are {band} and nobody is pleased.
10. The {route} venture — revived from a proposal the partners refused once already.

---

# TR-8 — THE TRAVELING FACTOR (`factorErrandsEnabled`)

### factor.departed (TR-8) — Herald, house voice — significance: routine
SLOTS: {settlement} {counterpart} {house} {npc} {good}
AUDIENCE: public
1. Factor {npc} rode out of {settlement} for {counterpart}, carrying the house's terms and its credit.
2. The quay saw them off without ceremony; a factor's departure is not news until it fails to end.
3. The errand is entered against {house}'s book: {counterpart}, terms for {good}, departed this week.
4. Whatever {npc} agrees at the far end, {house} is bound to it.
5. They left with a satchel and a season's authority, which is the whole of the office.
6. They left early enough to have the passes both ways, if nothing on the road delays them.
7. {npc} carried a second horse and no servant, which the quay read as haste.
8. They were seen at the first ford by carters coming in, riding easily.
9. At {counterpart} they are expected, and a room has been kept against the errand.

### factor.fair_circuit_return (TR-8) — Herald, market desk — significance: notable
SLOTS: {settlement} {house} {npc}
AUDIENCE: public
1. Factor {npc} came back from the circuit with a head full of what every market pays.
2. The inns of {settlement} had the news before the guildhall did, and the guildhall has stopped minding.
3. Every band {npc} carried home is entered as an arrival would be — the best writing in the book.
4. {house} will dispatch on what {npc} saw for a season, and be right more often than its rivals.
5. One rider, a season of roads, and the wharf's picture of the world is written again.
6. {npc} came in dusty and was made to talk before being let to wash.
7. A whole season of roads arrives in one afternoon, and the {settlement} wharf spends a week on it.

### factor.stale_arrival (TR-8) — Herald, market desk — significance: notable
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. Factor {npc} rode for the fair with one price in their head, and found another at the gate. *(volume exemplar, slotted; the possessive de-gendered)*
2. The bargain they were sent to strike had been struck by somebody else a month before.
3. The snapshot carried out of {settlement} and the band standing at {counterpart} do not agree, and both are recorded.
4. {npc} will make the best terms available and be judged against terms that no longer exist.
5. Nothing went wrong; the road was simply longer than the news was fresh.
6. {npc} asked the gate-clerk twice, and the gate-clerk was patient about it.
7. The band they carried out of {settlement} was a season old at the {counterpart} gate, and the season had been a fast one.

### factor.silence_overdue (TR-8) — Herald, house voice — significance: notable
SLOTS: {house} {npc} {route}
AUDIENCE: public
1. No word from the {route}; {house} fears for its factor. *(volume exemplar, slotted)*
2. The inns along the {route} have not seen {npc} pass, and say so with the care of men who do not want to be quoted.
3. The errand stands open past its expected week, with no return entered against it.
4. {house} will send a second rider before it sends a ransom, and hopes to send neither.
5. It is early yet. The house has begun to say so more often than it did.
6. The expected week passed, and then the season did, and {house} has stopped naming a new week.
7. {house} has kept the horse {npc} would have ridden home, and stabled it fed.

### factor.captured (TR-8) — Herald, headline — significance: major
SLOTS: {house} {faction} {npc} {route}
AUDIENCE: public
1. {faction} holds Factor {npc}, taken on the {route} with the house's papers.
2. The carters who walked home say the banners were plain enough to name.
3. The capture is entered against the errand, and the terms {npc} carried are entered as lost.
4. {house} will pay to have its factor back, and be a smaller house for it.
5. They took the satchel first and the rider second, which says plainly what the road wanted.

### factor.ransomed_return (TR-8) — Herald, house voice — significance: notable
SLOTS: {house} {faction} {npc}
AUDIENCE: public
1. Factor {npc} came home out of {faction}'s hold, ransomed, and thinner.
2. The quay cheered, and the guildhall counted what the release had cost.
3. The errand closes returned; the terms it carried do not return with it.
4. What {npc} believes about the road ahead was learned in a cell, and {house} will act on it.
5. They came back with everything except the one thing they were sent for.
6. {npc} would not speak of the hold at the guildhall, and spoke of it at the inn.
7. The ransom was paid at the turn of the season, when {house} could least afford it.

### factor.true_purpose (TR-8) — DM ledger, covert lane — significance: notable
SLOTS: {house} {faction} {npc}
AUDIENCE: dm-only
*The Q amendment's declared/true split; the public surface sees only the declared commercial errand.*
1. {npc} rides declared for {house} and truly for {faction}, and the terms will tilt at the far end.
2. The satchel carries two sets of instructions, and the second is not written down.
3. Declared purpose commercial, true purpose covert — both entered, and only one visible to the courts.
4. Whatever {house} learns about its own terms, it will learn after {faction} does.
5. The house vetted them thoroughly, and vetted them a year too late.
6. {npc}'s pay comes out of two purses and is entered in one book.
7. Whatever {npc} agrees for {house} will have been agreeable to {faction} first.

### factor.pact_errand (TR-8) — Herald, chancery desk — significance: routine
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. Factor {npc} carries {settlement}'s proposal to {counterpart} in person.
2. The court sent a merchant rather than a herald, which the wharf read as a compliment to the merchant.
3. The errand carries the draft terms and the seat's authority to amend them.
4. The compact will be argued at {counterpart}'s table on whatever {npc} believes on arrival.
5. A treaty travels at the speed of a rider, as it always has.
6. The wharf at {settlement} knew the terms before the court had finished sealing them.
7. The errand goes out before the passes close, so that an answer can come back before the winter.
8. {npc} was offered the seat's ring to carry and gave it back at the gate, preferring their own name.
9. At {counterpart} the court has been told a merchant is coming and has not decided what that means.

### dossier.factor_line (TR-8) — town dossier, house entry — significance: routine
SLOTS: {settlement} {counterpart} {faction} {npc} {route}
AUDIENCE: public
1. Factor {npc} — on the road to {counterpart}, expected by midsummer. *(volume exemplar, slotted)*
2. Factor {npc} — overdue; no word since the spring. *(volume exemplar, slotted)*
3. Factor {npc} — at home in {settlement}; no errand standing.
4. Factor {npc} — held by {faction} on the {route}; ransom under discussion.
5. Factor {npc} — returned from the circuit; the house's bands are fresh.
6. Factor {npc} — ransomed home out of {faction}'s hold; no errand standing.
7. Factor {npc} — on the circuit; expected back at {settlement} by the frosts.
8. Factor {npc} — at {counterpart}, treating for the seat of {settlement}.
9. Factor {npc} — turned back on the {route}; the errand stands open.
10. Factor {npc} — home from {counterpart}; the terms came back unagreed.

---

# THE ENDINGS (TR-9's closed contract; minted at the waves named)

`TRADE_ENDING_KEYS = {fortune, ruin, monopoly, collapse, severance, cornered}` —
owner-settled, CLOSED. `collapse` is an honest permanent zero while
`routeLifecycleEnabled` is dark; its pool ships anyway so the wave that lights J
is not the wave that discovers the corpus is empty.

### ending.fortune (minted TR-2/TR-7) — Herald, headline — significance: major
SLOTS: {settlement} {house}
AUDIENCE: public
1. {house} is made: the venture came home, and the wharf has rearranged itself around it.
2. The quay counts {house} among the great names now, and cannot remember when that started.
3. The books cross into the top band, with interests entered across {settlement} and half the roads out of it.
4. {house} will lend to seats now, and seats will take the loan.
5. A generation of dull, correct decisions, and one voyage that paid.

### ending.ruin (minted TR-2/TR-7) — Herald, headline — significance: major
SLOTS: {settlement} {house}
AUDIENCE: public
1. {house} is broken; its factors scattered to the quays. *(volume exemplar, slotted)*
2. The warehouse door at {settlement} was chained by the guild, and the crowd that watched was small.
3. The books close at the bottom band, the interests struck out one by one, and the family survives them.
4. The name will trade again in somebody's grandchildren's time, or it will not.
5. It was not one bad season; it was one bad season after everything else.

### ending.monopoly (minted TR-6) — Herald, headline — significance: major
SLOTS: {settlement} {house} {good}
AUDIENCE: public
1. {house} is the only seller of {good} in {settlement}, and has been long enough that the town has stopped noticing.
2. The carters stopped trying the other roads a generation ago, and no one has thought to try them since.
3. The census of reachable stock has put {good} behind one door for seasons on end, with no forced band anywhere in it.
4. What {settlement} pays for {good} it will go on paying, and no road out of the town argues with it.
5. No law was broken and no rival came. That is what a monopoly is.

### ending.collapse (minted TR-4; dark-J honest zero) — Herald, headline — significance: major
SLOTS: {settlement} {route}
AUDIENCE: public
1. The market at {settlement} is dead: the roads that made it now run around it.
2. The wharf still stands, and the warehouses behind it are let to families who are not merchants.
3. The route ledger shows the {route} demoted and then abandoned, and every flow through {settlement} closed without comment.
4. What trade remains will be local, and {settlement} will be a place people pass by.
5. Nobody sacked it. The river moved, and the wagons followed the river.

### ending.severance (minted TR-1/TR-5) — Herald, headline — significance: major
SLOTS: {settlement} {counterpart} {good} {reason}
AUDIENCE: public
1. {settlement} and {counterpart} trade no longer, and the reason entered in the book is {reason}.
2. The bridge is open and empty, and both sides have stopped explaining it to visitors.
3. Every licence, every standing term, every flow between them closes on the same page.
4. What each needed from the other will come the long way now, or not at all.
5. A tie a generation in the making, ended in a season, over {good}.

### ending.cornered (minted TR-6) — Herald, headline — significance: major
SLOTS: {settlement} {house} {good}
AUDIENCE: public
1. {house} held the {good} of {settlement} through the whole season, and no road broke it.
2. The town ate what it was sold, at what it was asked, until the thaw.
3. The held share stayed above the band from the first frost to the spring, and every sale is on the record.
4. {house} is rich and will not be forgiven; both facts will outlast the granary.
5. The wagons came in the end. They came after it was over.

---

# THE ROUTE ESTATE (TR-9's Herald debt — the five `route_*` kinds)

Seventeen built modules with zero Herald presence today; T-11's tellable is that
the silent road estate speaks. The totality walker reds any of these five without
a registered pool.

### route.chartered (TR-9) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {counterpart} {good} {route}
AUDIENCE: public
1. A road is opened between {settlement} and {counterpart}, and the charter names the {good} it was cut for.
2. The first carts went through in the spring, and the villages along it charged them for water.
3. The route is entered chartered, with the demand that argued for it recorded beside it.
4. What the {route} carries now will decide which of the two towns grows.
5. It is a track with a name, which is how all of them start.
6. The charter was cut into a post at the fork where the {route} leaves the old road.
7. It was chartered in the spring, so that a first season's traffic could pay for the cutting.

### route.promoted (TR-9) — Herald, commerce desk — significance: routine
SLOTS: {route}
AUDIENCE: public
1. The {route} carries more than it was cut for, and the clerks have raised its standing.
2. There are inns on it now, and the inns are full.
3. The flow tally moves the {route} up a rank on the season's count.
4. Traffic that went the long way comes this way now, and the long way is quieter for it.
5. Nothing was built. The carters simply chose it, over and over.
6. Travellers say the {route} is crowded enough to be slow, and say it as a compliment.
7. It carried through the whole of the wet season this year, which it had never done before.
8. A ferryman on the {route} has taken on help and is building a second boat.
9. The wardens have been given the {route} as a standing duty, and the money to keep it.

### route.demoted (TR-9) — Herald, commerce desk — significance: routine
SLOTS: {route} {reason}
AUDIENCE: public
1. The {route} carries less than it did, and the clerks have lowered its standing.
2. The inns along it have begun keeping shorter hours.
3. The flow tally drops the {route} a rank, with the reason entered as {reason}.
4. If the traffic keeps falling, the road will be a track again within a generation.
5. Nobody closed it. Fewer people are going that way, that is all.
6. Travellers report the {route} empty enough to be quick, and quick enough to be uneasy.
7. It fell away over a single season, which the clerks call unusual and the carters do not.
8. The ferryman on the {route} has begun farming the bank instead.
9. The wardens ride it less often now, which will not help, and everyone knows it will not.

### route.abandoned (TR-9) — Herald, commerce desk — significance: notable
SLOTS: {settlement} {route}
AUDIENCE: public
1. The {route} is abandoned; no cart has been recorded on it in a long season.
2. The bridge timbers went for firewood, and nobody in {settlement} objected.
3. The route is entered abandoned, its flows closed and its charter lapsed.
4. Whatever {settlement} used to fetch by that road it will fetch elsewhere, or do without.
5. The road is still there. It is only the traffic that has gone.
6. The last milestone was taken for a doorstep, and the house it serves is not new.
7. Travellers who ask after the {route} at {settlement} are given directions to a different road.

### route.revived (TR-9) — Herald, commerce desk — significance: notable
SLOTS: {route}
AUDIENCE: public
1. The {route} carries carts again, for the first time in a generation.
2. The old carters knew the way and were pleased to be asked.
3. The route is entered revived, its flows resuming against its old charter.
4. The reason it died has gone, and the reason it lived has not.
5. Nothing is forgotten on this map — not even a road.
6. Someone cleared the ford on the {route} by hand before the first carts came, and has not said who.
7. The first season's traffic was light, and the second season's was not.
