# RECEIPT POOLS — WAR (the seeded variant corpus for DESIGN_WAR_RULINGS_ARCHITECTURE.md)

## Fable 5 content authoring, 2026-08-02. This is the CONTENT ANNEX to the war-rulings
## architecture (amendments A–S compiled, waves WR-0c through WR-10). The volume specs
## KINDS and — in its §8 Herald contract — one exemplar sentence for a dozen of them;
## this file supplies the POOLS every phrased kind draws from. It is bound by
## DESIGN_FP_SPINE.md §2 SP-6 (THE CONTENT-DEPTH FLOOR + THE REPETITION ENVELOPE) and by
## the volume's own §1a-5 (receipts carry enforcement: id, address chain, typed action,
## settlements BY NAME, recorded reason), §1a-6 (premium isolation + audience
## projection), §1a-7 (finite semantics), §1b-B (absolute coherence — a suppressed score
## names the state that suppressed it), and §8 (the Herald + legibility contract).
## Where this file conflicts with the volume or the spine, they win and the conflict is
## a bug to report (§10-6).

---

## THE AUTHORING CONTRACT (read before adding a single line)

**THE FLOOR (SP-6, spine §2).** Every phrased kind ships a seeded variant pool of AT
LEAST FOUR templates, seeded per-entity — per directed pair for casus and termination
receipts, per errand for envoy receipts, per war record for endings — so same-seed
worlds keep their sentences forever (THE PROMISE). The kind's WHAT_PHRASES registration
walker asserts the floor: a two-variant kind reds the gate exactly as an unregistered
one does (volume §10-5).

**THE FAMILY RULE.** Slot variety is not depth. Two templates differing only in slot
fills are ONE family for the floor's count. Every variant below takes a different
STRUCTURE and a different ANGLE off the palette: *the event plain · the street's view ·
the ledger's or institution's view · the consequence forward · the understatement or
irony*. A pool that reads as one sentence five times has not met the floor, whatever
the count says.

**THE HOUSE SHAPE.** These pools are the `WAR_RECEIPTS` shape already built in
`src/domain/worldPulse/eventProse.js` (per-type pools, seeded on the directed pair key,
stable across ticks so no pair churns its prose). The existing casus and peace-mirror
pools are NOT restated here; this annex covers only the kinds the WR waves MINT.

**THE SLOT CONVENTION.** No proper noun and no cause is ever baked into a template. The
spine's closed slot set, plus three volume-local slots declared at the foot of the
table:

| Slot | Fills with |
|---|---|
| `{settlement}` | the subject settlement, by name (the address law) |
| `{counterpart}` | the other settlement in the directed pair — enemy, ally, host, seller |
| `{npc}` | a cast NPC — the seat, the legate, the held guest; never minted, never a fate resolved |
| `{faction}` | the faction, patron, or organising party named on the receipt |
| `{house}` | the merchant or landed house named on the receipt |
| `{temple}` | the temple, chapter house, or observance named on the receipt |
| `{band}` | a QUANTITY_BANDS phrase (`a few souls`, `a dozen or so`, `dozens`, `a hundred or so`, `several hundred`, `many hundreds`, `thousands`) or an authored severity/duration band word — never a figure |
| `{reason}` | the recorded reason in band words (the address law's fourth field) |
| `{good}` | the good at issue — grain, silver, salt, cloth, timber |
| `{route}` | the road, lane, or crossing, by its in-world name |
| `{third_party}` | **VOLUME-LOCAL, NEW — flagged for chair ratification.** The third party to a pair's affair: the intercepting column, the ally called, the buyer in a sovereignty trade. The war program is the only corpus volume with genuinely three-cornered receipts (interception, coalition, the settlement market); without this slot those kinds must either bake a name or lose a party from the address chain, and both are estate-law violations. |
| `{war}` | **VOLUME-LOCAL (shared with the couplings annex).** The war by its in-world name — used by the WR-9 endings tokens and the chronicle closes |
| `{term}` | **VOLUME-LOCAL (shared with the trade annex).** A treaty term family by its in-world name — tribute, restitution, market access, non-intervention |

**NO DIGITS.** No variant line below contains a numeral, a ratio, a percentage, or a
band token. Counts speak only through `{band}` or through band words already resident in
the prose (*a handful, a generation, one by one, the whole of it*). Structural labels are
metadata, not prose, and are the only digits in the file: wave ids in the headings
(WR-7), section references (§8), the variant numbering, and the trailing provenance
marker *(§8)* on an exemplar variant. A digit scan over rendered prose must strip the
numbering and the trailing marker before it runs, exactly as it does for the sibling
annexes.

**THE EXEMPLAR-VERBATIM RULE, AS APPLIED.** Where §8 authors an exemplar sentence for a
kind, that sentence is variant 1, word for word — except that baked proper nouns are
replaced by their slots. The slot law is estate law and outranks verbatim reproduction;
the wording is otherwise untouched. So §8's *"They burned Thornwall and rode home"*
lands as *"They burned {settlement} and rode home."* Every such variant is marked *(§8)*.

**HEADLINE HONESTY (R-28).** Every verb below is entailable by the receipt its kind is
minted from. An envoy who has not returned is *without word*, never dead. A silence is
read as an inference, never reported as a fact. A suppressed casus says the score was
nothing and names what contradicted it; it never says the court was lying.

**BELIEF ATTRIBUTION.** Belief-side lines carry their attribution — *men said · the word
is · it is said · they believe · the court fears*. The engine never states a belief as
its own truth. This binds hardest in WR-4 (believed trajectory), WR-7 (every envoy
picture), WR-8 (feasibility and the atrocity casus, which mints from BELIEVED razings at
news speed per J-WR-7), and WR-10 (believed valuation).

**LAW ONE.** No line confirms that a god acted — the temple calls it wrath, the chapter
house unseats a patron, the altar keeps a calendar; the god never strikes. No line
resolves or states a named person's fate: the razed town's named cast *goes out on the
roads*, the lost envoy is *without word*, the exposed traitor is *taken up as treason*.
This is why `razing_named_cast_dispersed` exists as its own kind — R's deaths-not-
departures arithmetic is a POPULATION fact, and the named are explicitly excluded from
it (volume §5 WR-8: "named cast disperses roaming — never engine-killed").

**AUDIENCE.** Every kind is authored PUBLIC unless marked. Ten kinds carry
`AUDIENCE: dm-only` and ride includeCovert/includeGroundTruth exactly as the
premium-isolation law requires (§1a-6): the two §1b-B suppression receipts of WR-1 and
WR-2, WR-3's lineage suppression, WR-4's misread-trajectory receipt, WR-5's compromised
books, WR-7's planted return, compromised volunteer, and intercepted ransom demand, and
WR-8's deterrence weighing and uncoupled license. A free surface never sees them.
[RECLASSIFIED 2026-08-02, validation chair: `ransom_demand_intercepted` was authored
public and is not — every variant sets a live truth (the legate is held, a demand
exists) against a live belief (the court acting on the worst), which is precisely the
ground-truth projection §1a-6 keeps off a free surface, and printing it would void the
K.7 tragedy the volume pins. The PUBLIC experience of that shape is silence, already
carried by `envoy_silence_inference`.]

**SIGNIFICANCE.** Classes are the spine's SP-6a family (`routine / notable / major`).
This annex ASSIGNS; it never authors a scale (volume §7).

**DESKS.** The six Herald sections of `src/domain/realm/heraldRouting.js` —
`war · faith · trade · events · divination · adjudication` — routed by what the event
IS, never by what caused it (routing law three). A trade-caused escalation files under
war; a razing judged by an altar files under faith.

---

## THE KIND CENSUS (one hundred fifty-eight phrased kinds across eleven waves)
## [CENSUS CORRECTED 2026-08-02, validation chair: two volume-specced kinds were
## missing and are authored below — WR-7b's `interceptor_parlays_own_edge` (§5 WR-7b's
## interceptor kind (c), "peace entering through the unexpected door", which no
## interception or parlay pool covered) and WR-8's
## `bargaining_ranges_do_not_overlap` (§5 WR-8 feasibility's terms consumer:
## "ranges may not overlap, and non-overlap IS the grind receipted"). The WR-7 and
## WR-8 itemisations were also miscounted against their own blocks — eight errand
## states not seven, seven ratification kinds not six, six razing kinds not eight,
## `envoy_terms_agreed` counted in no group and `returned_planted` counted twice.
## Both rows are restated below so the row sums equal the blocks that exist.]

| Wave | Phrased kinds | Count |
|---|---|---|
| WR-0c | treaty_war_blocked · treaty_repudiated · trade_war_escalation | 3 |
| WR-1 | the four deciding-term reads · war_cause_dissolved + its three per-cause forms · casus_suppressed (dm) · patron_deterrence | 10 |
| WR-2 | four channel crossings · disposition_reversal · deity_war_pressure · deity_peace_pressure · war_culture_suppressed (dm) | 8 |
| WR-3 | lineage_edge_recorded · two lineage claims · mirror_kinship_bond · lineage_claim_suppressed (dm) | 5 |
| WR-4 | two believed trajectories · five home-front streams · winning_abroad_losing_at_home · trajectory_misread (dm) | 9 |
| WR-5 | the two books suing · two divergence shapes · peace_refused + two refusal costs · ruler_books_compromised (dm) · two overturnings · succession_demand_inherited · two re-reads · war_dissolved_by_verdict | 14 |
| WR-6 | coalition_entry_priced · joined · refused · the obligation pair · expenditure · stayed · separate_peace · apportionment · spoils · debt paid/unpaid | 12 |
| WR-7 | eight errand-state kinds · envoy_terms_agreed · three §8 envoy lines · four interception/parlay kinds · seven ratification kinds · two compromise-round kinds · six ransom + hold kinds · returned_abandoned · four vetting/counter-intelligence kinds · treason exposure · two dm-only | 39 |
| WR-8 | four feasibility kinds · four intent kinds · overwhelming gate · three occupation kinds · inheritance · the razing's six kinds · three judgments · deterrence (dm) · two terror polarities · two self-limits · five license kinds · the atrocity pair · just_razing_sanctioned | 35 |
| WR-9 | the eight endings tokens of the L mix | 8 |
| WR-10 | offered · cleared · no_trade · swap · cession · edge_rewritten · grievance · fragility · lineage_survives · firesale · judged · kinship_opposes · books_diverged · overflow_valve_sold · streams_rerouted | 15 |
| | **TOTAL** | **158** |

All eight endings tokens of the WR-9 mix are present and pooled: `terms`, `exhaustion`,
`ruler_change`, `fragmentation`, `annihilation`, `conquest`,
`punitive_sack(initiation)`, `punitive_sack(vengeance)`.

All fourteen §8 Herald-contract sentences are present as variant 1 of their kind. (§8
lists twelve bullets; three of them — the two books suing, the ally's two temperaments,
the debt paid and unpaid — each carry a contrasting PAIR of sentences, so the contract
is fourteen sentences across twelve rows, and each half of each pair is its own kind.)
§8's opening row is not a sentence but a demand — *"why is this war still going?"
answered by the deciding term* — and it is satisfied by WR-1's four deciding-term pools
rather than by a single exemplar.

---

# WR-0c — OPENER HARDENING

### treaty_war_blocked (WR-0c) — Herald, war desk — significance: routine
SLOTS: {settlement}, {counterpart}, {reason}, {term}
AUDIENCE: public
1. The pact between {settlement} and {counterpart} held; the muster rolls went back into the chest unread.
2. Men expected a war and got an assize instead — the compact stood, and {reason} went to the clerks.
3. The captains of {settlement} were told the {term} forbade it, and told again.
4. There was no march that season. The paper was worth what it cost, which surprised the quays.
5. {settlement} kept its oath to {counterpart} quietly, and the grievance is still open on the ledger.

### treaty_repudiated (WR-0c) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {reason}, {term}
AUDIENCE: public
1. {settlement} repudiated its compact with {counterpart} and named {reason} for it.
2. {npc} put the treaty aside before the court, and the clerks struck every live {term} the same afternoon.
3. The wagons owed under the old terms will not come; the factors of {counterpart} are already writing it down as debt.
4. The oath was broken openly rather than quietly — a distinction {counterpart} will not be paid in.
5. They broke it in daylight and let the roads carry it; the breach is a casus in {counterpart}'s book before the season turns.

### trade_war_escalation (WR-0c) — Herald, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {good}, {reason}
AUDIENCE: public
1. The quarrel over {good} passed from the staple to the muster; {settlement} has marked {counterpart} for soldiers.
2. What began at the toll house is an order in the war ledger now, and every ordinary gate still stands in front of it.
3. The chandlers of {settlement} wanted redress and were given a deployment question instead.
4. {settlement} names {counterpart} an enemy over {reason}; whether an army follows is another court's arithmetic.
5. The tariff war ended the way tariff wars end — with a name written into the wrong ledger.

---

# WR-1 — THE TERMINATION READ

### war_termination_cause (WR-1) — warTermination receipt, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {reason}, {band}
AUDIENCE: public
1. The war between {settlement} and {counterpart} goes on because {reason} still stands, and nothing else weighed so heavy.
2. Ask the seneschal of {settlement} why the levies are still out and he will say {reason}, and say nothing after it.
3. The cause reads {band} in the ledger and the cost does not; that is the whole of the court's arithmetic.
4. The grievance has outlasted the season, the harvest, and every argument in council.
5. They are fighting for what they marched for, which the chronicles record more often than the world provides.

### war_termination_cost_to_continue (WR-1) — warTermination receipt, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {band}, {good}
AUDIENCE: public
1. What decides the war between {settlement} and {counterpart} now is the price of another season, and that price reads {band}.
2. The granaries answered the council before the captains did.
3. Ask why the court hesitates and the answer is the wagons, not the wrong.
4. The quarrel is unchanged; the arithmetic is not.
5. In {settlement}'s hall the argument has moved from the grievance to the {good}, and that is where wars are decided.

### war_termination_cost_to_stop (WR-1) — warTermination receipt, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {band}, {term}
AUDIENCE: public
1. Peace with {counterpart} would cost {settlement} more than it can carry, and that is the whole of the deciding.
2. The {term} on offer reads {band}, and no seat survives signing it.
3. They would stop if stopping were cheaper than continuing; it is not.
4. The concession is the obstacle, not the enemy.
5. What holds the levies in the field is the price of calling them home, and {npc} can count it as well as anyone.

### war_termination_momentum (WR-1) — warTermination receipt, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {band}
AUDIENCE: public
1. Too much has been spent for {settlement} to turn now, and the spending is the argument.
2. The dead are the reason the war continues, which is the oldest reason there is.
3. {npc} could end it and could not survive ending it; the seat decides before the ledger does.
4. It is not the cause and it is not the cost — it is the climbing down.
5. The war carries itself; the court has become a passenger, and the stock of commitment reads {band}.

### war_cause_dissolved (WR-1) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {reason}
AUDIENCE: public
1. The war outlived its reason — men still dying for a god nobody worships. *(§8)*
2. {reason} is gone from the ledger and the levies are still out.
3. The clerks of {settlement} could not find the grievance this quarter; the captains found the enemy without difficulty.
4. Whatever they are fighting for, it is not what they marched for.
5. The cause dissolved in the spring, and nobody told the field.

### war_cause_dissolved_sacred (WR-1) — Herald, faith desk — significance: major
SLOTS: {settlement}, {counterpart}, {temple}
AUDIENCE: public
1. The {temple} no longer keeps the high altar at {counterpart}, and the holy claim ended with the seat.
2. The rite they marched against is not practised there any more; the pews are as empty as the casus.
3. {settlement}'s whole claim rested on a patron the chapter house has since put down.
4. The war was blessed at an altar that no longer stands.
5. The faithful were told the quarrel had been settled above them, and the levies came home slowly.

### war_cause_dissolved_lineage (WR-1) — Herald, war desk — significance: notable
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. The steading {settlement} claimed is gone, and the claim went with it.
2. There is no daughter house left at {counterpart} to reclaim; the edge is severed on the map and in the book.
3. The seat's entire argument was a granary that no longer feeds anyone.
4. They marched to take back what the winter had already taken.
5. The lineage is history now rather than title, and history is not a casus.

### war_cause_dissolved_opportunism (WR-1) — Herald, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {faction}
AUDIENCE: public
1. {counterpart} is no longer the easy mark it was believed to be, and the appetite went with the belief.
2. The word is that {faction} would answer for {counterpart} now; the price of the venture changed overnight.
3. A patron alters an arithmetic no grievance could.
4. They came for a weak neighbour and found a protected one.
5. The season passed, the walls were mended, and the reason for the war mended with them.

### casus_suppressed (WR-1) — §1b-B suppression receipt, war desk — significance: routine
SLOTS: {settlement}, {counterpart}, {reason}
AUDIENCE: dm-only
1. The claim scored nothing: the live read of {counterpart} contradicts it, and the contradicting record is named.
2. {settlement}'s court could argue the grievance; its own ledgers argue back.
3. Nothing was minted, so nothing can ripen: the grievance waits on {reason} moving, not on the seat's temper.
4. The clerks kept both entries — the claim, and the record that refuses it — and filed them on the same page.
5. The cause exists on paper and dies against the state that produced it.

### patron_deterrence (WR-1) — Herald, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {faction}, {band}
AUDIENCE: public
1. Men said {faction} would come for {counterpart} if anyone touched it, and the venture was quietly costed again.
2. The patron never marched, and never needed to.
3. The captains of {settlement} priced the second army as well as the first and stopped there.
4. It is said a word from {faction} is worth a garrison; this season it was.
5. A protected neighbour is a poor prize, and the season went by without a march.

---

# WR-2 — DISPOSITION

### disposition_martial_crossed (WR-2) — Herald, war desk — significance: notable
SLOTS: {settlement}, {band}
AUDIENCE: public
1. The martial temper of {settlement} stands {band} now; the drill ground is busier than the market.
2. The reeve's muster rolls are read aloud on feast days, which tells you where the town keeps its pride.
3. Boys who would have gone to the quays go to the watchfires instead.
4. It is a {band} appetite for war, and the council has stopped arguing about it.
5. They have learned to answer questions with soldiers, and the answers keep working.

### disposition_mercantile_crossed (WR-2) — Herald, trade desk — significance: notable
SLOTS: {settlement}, {band}, {good}
AUDIENCE: public
1. {settlement}'s mercantile temper stands {band}; the council counts in cargoes.
2. The quays set the price of everything now, including opinions.
3. A generation of good ledgers has made the merchants louder than the captains.
4. Where the town once asked whether a thing was right, it asks what it costs.
5. The staple in {good} is the politics; the rest is ceremony.

### disposition_diplomatic_crossed (WR-2) — Herald, events desk — significance: notable
SLOTS: {settlement}, {band}
AUDIENCE: public
1. {settlement} carries a {band} appetite for parley; the hall keeps more chairs than it needs.
2. Every quarrel goes to a table first, and most of them stay there.
3. The seat has learned that a legate is cheaper than a levy.
4. They talk before they march, which their neighbours read as either wisdom or weakness, according to taste.
5. The town's best rooms are kept for guests it does not like.

### disposition_insular_crossed (WR-2) — Herald, events desk — significance: notable
SLOTS: {settlement}, {band}, {house}
AUDIENCE: public
1. {settlement} has turned {band} inward; the gates close earlier each year.
2. The factors of {house} are lodged outside the walls now, courteously and firmly.
3. The council's answer to every road is that the road can wait.
4. They want nothing from anyone, which is a policy until it is a weakness.
5. The tolls are high and the welcome is thin, and the town calls both prudence.

### disposition_reversal (WR-2) — Herald, events desk — significance: notable
SLOTS: {settlement}, {band}
AUDIENCE: public
1. What the victories taught {settlement}, the losses have untaught.
2. The same council that voted the levies votes the granaries now.
3. A temper is not a ratchet: {settlement}'s appetite has turned back toward where it began, and reads {band}.
4. Men who argued for the war argue for the road, and are not embarrassed.
5. The town changed its mind slowly, the way towns do, and over the same ledgers.

### deity_war_pressure (WR-2) — Herald, faith desk — significance: notable
SLOTS: {settlement}, {temple}, {band}
AUDIENCE: public
1. The {temple} of {settlement} keeps a war god's calendar, and the bar for a quarrel sits {band} lower for it.
2. The chantry blesses the muster before the harvest, and has for a generation.
3. Priests who speak of restraint find thin congregations here.
4. It is not that the altar orders wars; it is that it has never argued against one.
5. A town takes its temper from whatever it prays over.

### deity_peace_pressure (WR-2) — Herald, faith desk — significance: notable
SLOTS: {settlement}, {temple}, {band}, {good}
AUDIENCE: public
1. {settlement}'s {temple} keeps the harvest rites, and its court is {band} slower to muster.
2. The pews are full at sowing and the drill ground is empty.
3. The chapter house prices a war in seed {good}, which is a price no captain likes to hear.
4. The altar has never forbidden a war; it has merely made one look expensive.
5. Where the tithe is grain, the answer to a grievance is usually another season.

### war_culture_suppressed (WR-2) — §1b-B suppression receipt, war desk — significance: routine
SLOTS: {settlement}, {temple}
AUDIENCE: dm-only
1. A peaceable house with a harvest {temple} and a book of losses cannot raise war pressure; the read returns nothing and names all of it.
2. The clerks went looking for a martial temper at {settlement} and wrote down what they found instead, item by item.
3. A town that has lost its wars and prays for rain is not made warlike by being asked.
4. The court could be pressed and would not move; the ledger explains why before anyone asks.
5. Incoherence is visible rather than silent: the score is nothing, and every record that made it nothing is on the sheet.

---

# WR-3 — THE LINEAGE CLAIM

### lineage_edge_recorded (WR-3) — Herald, events desk — significance: notable
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. The steading at {settlement} stands on its own books now, and remembers whose granary fed it.
2. {counterpart} seeded it, provisioned it, and has been outgrown by it.
3. What was a satellite is a settlement; the parish register says so, which is what matters later.
4. The daughter house keeps its own reeve and its own quarrel with the tolls.
5. A lineage edge is a small entry in a book and the cause of a great deal.

### casus_lineage_claim_parent (WR-3) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. {settlement} claims {counterpart} by right of founding: it seeded the place, and the place has fallen {band} below the seeding.
2. The parent house says the daughter cannot hold what it was given, and offers to hold it instead.
3. There is a founding charter in the chest at {settlement} and a hungry season at {counterpart}; the two arguments arrived together.
4. They call it reclamation and their neighbours call it what it is.
5. A thriving parent has no quarrel with a modest steading — which is why this parent's books are worth reading.

### casus_lineage_claim_child (WR-3) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {house}
AUDIENCE: public
1. {settlement} was founded out of {counterpart} and has outgrown it; the seat, it says, should follow the granary.
2. The daughter house keeps the bigger market and asks why it keeps the smaller title.
3. The factors of {house}, who once shipped through the parent's wharf, own it in all but the charter.
4. The child claims the seat by the simplest argument there is: it feeds more people.
5. What was gratitude for a generation has become a grievance in a single harvest.

### mirror_kinship_bond (WR-3) — Herald, events desk — significance: notable
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. The same founding that arms a claim binds a peace: {settlement} and {counterpart} read one edge and chose the other sign.
2. They share a charter and a graveyard; the courts remembered the graveyard.
3. Kin do not sack kin cheaply, and both books said so.
4. The lineage was cited by both sides to opposite ends, and the quieter reading held.
5. The bond cost {settlement} the claim, and the council called it a bargain.

### lineage_claim_suppressed (WR-3) — §1b-B suppression receipt, war desk — significance: routine
SLOTS: {settlement}, {counterpart}
AUDIENCE: dm-only
1. You do not sack the satellite you spent a generation provisioning; the claim scores nothing and the chronicle is named against it.
2. The relationship record contradicts the casus, and the receipt says which entries do it.
3. The court could raise the claim; its own wagon books refuse it.
4. Sustained provisioning stands in the ledger where the grievance would go.
5. Nothing was minted, so nothing decays; this claim waits on a change in the wagon books, not a change of heart.

---

# WR-4 — COMPARATIVE COSTS + THE HOME FRONT

### war_trajectory_winning (WR-4) — warCosts receipt, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. The court of {settlement} believes the war is turning its way, and prices every offer accordingly.
2. The word from the field is good, and the word is all the hall has.
3. Terms that would have been signed in the spring are refused by the harvest, on no better evidence.
4. Believing you are winning is expensive; the court has begun to pay for it.
5. It is said the enemy is spent {band}. The couriers who say so have been a fortnight on the road.

### war_trajectory_losing (WR-4) — warCosts receipt, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {term}
AUDIENCE: public
1. {settlement}'s court believes the war is going against it, and the belief moves faster than the news.
2. The hall has begun to ask what peace costs, which is the first honest question of the war.
3. Every report is read for the worst line in it.
4. They may be wrong. They are certainly frightened, and the {term} they draft will show it.
5. A court that believes it is losing will sign what a court that is losing would not.

### home_front_roads (WR-4) — warCosts receipt, trade desk — significance: notable
SLOTS: {settlement}, {route}, {band}
AUDIENCE: public
1. {route} has gone to ruts while the levies were away, and the tolls have gone with it.
2. Nobody has cut the causeway brush in a season; the drovers take the long way and charge for it.
3. While the war continues, the road-work goes undone.
4. The bridge at the ford held through the war and has not held since.
5. One of {settlement}'s wartime roads has worsened; the loss is {band} harder to ignore.

### home_front_stores (WR-4) — warCosts receipt, events desk — significance: notable
SLOTS: {settlement}, {band}, {good}
AUDIENCE: public
1. The granaries of {settlement} hold {band}, and there is another season of war in front of them.
2. The reeve has begun measuring the seed {good}, which is the last measure before hunger.
3. The war eats first and the town eats after; that order is written in the stores.
4. The campaign continues while the stores remain low.
5. There is bread enough for the season, and the season is not the question.

### home_front_hands (WR-4) — warCosts receipt, events desk — significance: notable
SLOTS: {settlement}, {band}, {npc}
AUDIENCE: public
1. {settlement} has sent {band} of its hands to the field, and the work at home has noticed.
2. The harvest was got in by the old and the young, and got in late.
3. The muster took the smiths first, which the town will feel for a generation.
4. Names that ran the market are on the roll instead of the ledger, {npc} among them.
5. A town can survive a war; it cannot keep sending its working hands away without paying for it at home.

### home_front_institutions (WR-4) — warCosts receipt, events desk — significance: notable
SLOTS: {settlement}, {temple}
AUDIENCE: public
1. The assize at {settlement} sits with a clerk and no justice; the court has been hollowed by the war's bill.
2. The {temple} keeps its doors and has stopped keeping its school.
3. Institutions need not fall to thin, and thin, and one day fail at the thing they are for.
4. What was a working court is a room with a register in it.
5. The buildings remain. Their offices cannot do the work they were built to do.

### home_front_markets (WR-4) — warCosts receipt, trade desk — significance: notable
SLOTS: {settlement}, {counterpart}, {good}, {house}
AUDIENCE: public
1. The factors of {house} no longer come to {settlement}'s staple, and the wharf shows it.
2. The wharf hands stand about by the middle of the morning, and have done so since the levies went out.
3. {good} that moved through this town moves around it now.
4. A recorded market tie has closed while the war continues.
5. The tolls are what they were and there is nothing to toll.

### winning_abroad_losing_at_home (WR-4) — warCosts receipt, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. {settlement}'s banners stand on {counterpart}'s walls and its own granaries hold {band}.
2. The couriers bring victories and the reeve brings the accounts; only one of them is believed in the market.
3. The victory dispatch is read out in the market square, where the price of bread answers it.
4. Every field taken has been paid for with a road, a craftsman, and a market.
5. The gains abroad are real. So is the strain at home, and home is nearer.

### trajectory_misread (WR-4) — warCosts receipt, war desk — significance: routine
SLOTS: {settlement}, {counterpart}
AUDIENCE: dm-only
1. The court believed the war was turning; the field says otherwise, and the receipt carries both readings.
2. What {settlement}'s hall knows and what is true have parted company, and the distance is on the record.
3. The belief is honest and wrong, which is the most expensive combination there is.
4. The terms about to be drafted rest on a report the world has already overtaken.
5. Nobody in that hall is wrong on purpose, which will be no comfort to anyone afterward.

---

# WR-5 — THE TWO BOOKS + THE POLITICAL LOOP

### sued_for_peace_seat (WR-5) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. {npc} sued for peace. *(§8)*
2. The offer went out over the seat's name and not the town's, and the quays noticed the distinction.
3. It was the seat that could not carry another season, whatever the granaries said.
4. {npc} sued, and the council was told afterward.
5. The peace served the man before it served the walls, and the receipt names whose books it answered.

### sued_for_peace_realm (WR-5) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. The realm sued for peace. *(§8)*
2. The council of {settlement} voted the offer and {npc} carried it, willing or not.
3. The granaries wrote the terms; the seat only signed them.
4. It was the town that wanted it ended and the town that will pay for the ending.
5. The offer went out over the settlement's name, which tells you which book was open.

### war_continued_for_the_seat (WR-5) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {faction}
AUDIENCE: public
1. The war ruins {settlement} and secures {npc}, and it continues.
2. The council's arithmetic and the seat's arithmetic parted in the spring; the seat's won.
3. Peace would cost the hall more than the war costs the town.
4. Every season of this war is a season {faction} cannot move.
5. The receipt names whose books were served, and they were not the town's.

### war_ended_against_rival_triumph (WR-5) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. {settlement} ended a war it was winning, because winning it would have crowned {npc}.
2. The victory was already spoken for, and the seat declined to pay for another man's triumph.
3. Terms were taken that the field did not require.
4. A general too successful is a problem no treaty solves, so the treaty solved the war instead.
5. They stopped short, and the reason is in the hall rather than the field.

### peace_refused (WR-5) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {reason}, {route}
AUDIENCE: public
1. {counterpart} offered terms and {settlement} refused them; the refusal stands on the record with {reason} and a name beside it.
2. The legate was heard, thanked, and sent back down {route} with nothing.
3. The offer was read aloud in council, which is how the town learned there had been one.
4. A refusal is a fact like a battle and goes into the same book.
5. {npc} said no, and the saying of it hardened everything after.

### refusal_cost_legitimacy (WR-5) — Herald, adjudication desk — significance: notable
SLOTS: {settlement}, {npc}, {band}
AUDIENCE: public
1. {settlement} refused peace, and the streets priced the refusal within the season.
2. The seat spent its standing to keep its war.
3. Men who bore the levy quietly do not bear a refused peace quietly.
4. The council's confidence in {npc} reads {band}, and the refusal is the reason on every tongue.
5. Nothing was lost in the field that day. A good deal was lost in the market square.

### refusal_cost_ally_patience (WR-5) — Herald, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}, {band}
AUDIENCE: public
1. {counterpart} was refused, and {third_party} read the refusal as a bill it had not agreed to.
2. The ally's factors have begun asking how long, which is the question before the door.
3. Patience is a stock like any other, and this drew {band} on it.
4. They refused peace with somebody else's soldiers in the field.
5. The alliance held. It is thinner than it was, and both courts know it.

### ruler_books_compromised (WR-5) — the covert seam, adjudication desk — significance: major
SLOTS: {settlement}, {npc}, {faction}
AUDIENCE: dm-only
1. {npc} optimises a third book: the terms answer {faction}'s needs before {settlement}'s.
2. Every concession refused is a concession the patron would have paid for.
3. The seat's arithmetic is sound; it is being done for somebody else.
4. The web already knows whose interest this is, and the receipt names it.
5. The war serves a party that has not sent a single man to it.

### war_party_overturns_peacemaker (WR-5) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {npc}, {faction}
AUDIENCE: public
1. The peace {npc} signed cost the seat: the war party took the hall and named the treaty as their grievance.
2. {faction} organised around one decision and rode it into the council chamber.
3. Men who were nobody in the spring hold the gate keys by the harvest.
4. The town did not overturn a ruler; it overturned a signature.
5. A peace made against the powers is a coup with a delay on it.

### peace_party_overturns_warmonger (WR-5) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {npc}, {faction}
AUDIENCE: public
1. {settlement} put down the seat that kept the war, and the granaries did the counting.
2. {faction} formed at the almsgate and finished in the hall.
3. The war was the whole of the grievance and the whole of the programme.
4. They removed the man and kept the levies, which is how these things usually end.
5. The successor inherits a peace he must now actually make.

### succession_demand_inherited (WR-5) — succession record, adjudication desk — significance: notable
SLOTS: {settlement}, {npc}, {faction}
AUDIENCE: public
1. {faction} seated {npc} on one condition, and the condition rides the succession record.
2. The new seat is not free: it was seated to do a particular thing about the war.
3. A coup that does not bind its successor was a coup for nothing.
4. The demand is written where the succession is written, and the next re-read must answer it.
5. He holds the hall, and the hall holds a receipt.

### successor_repudiates_war (WR-5) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. {npc} came to the seat, read the war again, and the levies are coming home.
2. The quarrel belonged to a man who no longer holds the chair.
3. The new seat owes the dead nothing and says so, which is easier from that chair than from any other.
4. Momentum breaks at a succession, and this one broke loudly.
5. Nothing changed in the field. Everything changed in the hall.

### successor_escalates_war (WR-5) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. {npc} came to the seat and widened the war his predecessor could not end.
2. The same state, the same ledgers, a different character — and a new front.
3. The successor opened with a muster, and the town read it correctly.
4. The restraint was never in the ledgers; it sat in a chair, and it sits there no longer.
5. He inherited a stalemate and called it an opportunity.

### war_dissolved_by_verdict (WR-5) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. The officeholder whose rot opened the war was removed; {npc} holds no quarrel with {counterpart}, and the war has nothing left to stand on.
2. The casus was a man, and the man is out of office.
3. The court that raised the grievance cannot now find anyone in it who owns the grievance.
4. A verdict in one hall closed a war in another.
5. They went to war over a corruption and unmade the war by exposing it, which the chronicles will call luck.

---

# WR-6 — THE COALITION GRAPH

### coalition_entry_priced (WR-6) — the alliance-web risk read, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}, {band}
AUDIENCE: public
1. {settlement} counted who would answer for {counterpart}, and then who would answer for those, and the counting took a season.
2. The word is that the far houses would come; whether they would come in time is a different word.
3. The obligation is plain and the arithmetic behind it is not.
4. Entering a war is cheap; entering the war behind it is not, and this one prices {band}.
5. They read the whole web before they read the field, which is why they are still deciding.

### coalition_joined (WR-6) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {third_party}, {route}
AUDIENCE: public
1. {settlement} answered the call and opened its own edge against {third_party}; the casus on the record is the obligation itself.
2. The banners went out down {route} within the fortnight, which the quays took as a good sign and the granaries did not.
3. They came because they had said they would, and because the reading of not coming was worse.
4. An ally's war is a war, with its own ledger and its own ending.
5. {settlement} is now at war with a settlement it has no quarrel with, on paper and in fact.

### coalition_refused (WR-6) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {route}
AUDIENCE: public
1. They were called, and would not come. *(§8)*
2. {settlement} read the alliance web, read its own books, and sent regrets down {route}.
3. The refusal is a fact in the record now; how {counterpart} reads it is {counterpart}'s character.
4. The obligation was real and the answer was no, and both will be remembered.
5. Nothing was broken that day except an expectation, which is the durable kind.

### casus_alliance_obligation (WR-6) — casus receipt, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}
AUDIENCE: public
1. {settlement} is in this war because {counterpart} called and the compact answers for it.
2. There is no grievance in the ledger — only a signature, and the signature was enough.
3. The obligation is the whole cause; when the caller's cause dies, so does this one.
4. They march for a paper, which is a better reason than most.
5. This edge against {third_party} exists because an older edge does.

### mirror_obligation_discharged (WR-6) — mirror receipt, events desk — significance: notable
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. The obligation is discharged: {settlement} came when called, and the compact is quiet again.
2. What stood between them as a claim stands as a bond.
3. They paid the alliance in the only coin it takes, and the ledger closed even.
4. What was owed was given, and nobody has to remember it as a grievance.
5. The compact survived being used, which is the only test that matters.

### coalition_expenditure_read (WR-6) — the derived bill, trade desk — significance: notable
SLOTS: {settlement}, {counterpart}, {band}, {route}
AUDIENCE: public
1. Since it joined, {settlement} has drawn {band} from its stores and {band} from its rolls, and the bill is legible to anyone who can read a granary.
2. Nobody kept a war ledger; the wagon books and the burial register kept it for them.
3. The territory it holds is worth less than {route} was worth before the army wore it out.
4. What the alliance cost was never written down as a total — it is what the other books already say.
5. The reckoning exists whether or not the coalition wants to hold it.

### coalition_stayed (WR-6) — Herald, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}
AUDIENCE: public
1. They stayed. *(§8)*
2. {settlement}'s cause went out of the ledger a season ago and its levies are still in {third_party}'s fields.
3. The council reread the war, weighed the same ledgers as its neighbours, and reached the opposite conclusion.
4. Staying was a decision and not an inertia, and the record says who made it.
5. The ally that stays is owed differently from the ally that came.

### coalition_separate_peace (WR-6) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {third_party}
AUDIENCE: public
1. They went home. *(§8)*
2. {settlement} settled its own edge with {third_party} and left the rest of the war standing.
3. The peace was pairwise, as every peace in this world is; the others learned of it from travellers.
4. What the abandoned call betrayal, the departed call arithmetic, and the record carries both.
5. One edge closed, and the war it belonged to did not notice for a season.

### coalition_apportionment (WR-6) — the settlement, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {band}, {good}
AUDIENCE: public
1. The losers were assessed together and pay separately: {band} in {good} falls on {settlement} by capacity, culpability, and who called whom.
2. The aggregate was agreed in an afternoon and the apportionment took the winter.
3. The town that started it pays most, which surprised the town that started it.
4. Collective liability, pairwise payment — the wagons roll along the edges they always rolled along.
5. The apportionment goes permanently into the record and will be quoted at the next war.

### coalition_spoils_divided (WR-6) — the settlement, trade desk — significance: major
SLOTS: {settlement}, {counterpart}, {band}, {good}
AUDIENCE: public
1. The victors divided by who bled, who led, and who came late, and the late ones argued.
2. {settlement} took {band} of the {good} and thinks it took too little.
3. Spoils are the war after the war, fought over a table.
4. What was won together is held separately, and the holding is where alliances die.
5. Every share is a judgment on somebody's contribution, and every judgment is remembered.

### coalition_debt_paid (WR-6) — Herald, trade desk — significance: notable
SLOTS: {settlement}, {counterpart}, {route}
AUDIENCE: public
1. They paid what they owed. *(§8)*
2. {counterpart} settled with {settlement} in full and in season, and the alliance is stronger than the war left it.
3. The wagons came when they were supposed to, which is rarer than victory.
4. A debt discharged is a bond; the ledger says so and so does {route}.
5. Nobody will make a war out of this one.

### coalition_debt_unpaid (WR-6) — Herald, trade desk — significance: major
SLOTS: {settlement}, {counterpart}, {route}, {good}
AUDIENCE: public
1. They never paid. *(§8)*
2. {settlement} bled for {counterpart} and has been sent excuses down {route} for a season.
3. The {good} given in the lean years is a debt in one book and a courtesy in the other.
4. The coalition won, and the winners are the two parties to the next quarrel.
5. An unpaid ally is a casus that has not been filed yet.

---

# WR-7 — THE ENVOY PROGRAM

## WR-7a — THE ERRAND

### envoy_departed (WR-7a) — envoyErrand receipt, adjudication desk — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {route}
AUDIENCE: public
1. {npc} left {settlement} for {counterpart}'s court by {route}, carrying the seat's authority and nothing faster than a horse.
2. The legate went out at first light with a sealed sheet and a picture of the world already going stale.
3. The town watched a man leave and understood that the war now moves at his pace.
4. He carries what the court believes, which is not the same as what is.
5. An errand is a week to a leg, and there are several legs.

### envoy_on_the_road (WR-7a) — transit kernel receipt, events desk — significance: routine
SLOTS: {npc}, {route}, {settlement}, {counterpart}
AUDIENCE: public
1. {npc} lies at {route} this week; a road is a place, and he is in it.
2. The legate is somewhere between the courts, which is the only honest thing anyone can say.
3. Nothing has changed at either hall, and something has changed everywhere he has passed.
4. News overtakes a man on a road. It always has.
5. He will arrive with the world he left and find another.

### envoy_intercepted (WR-7b) — Herald, war desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {third_party}, {route}
AUDIENCE: public
1. {npc} was taken on {route} by {third_party}, and the court he was riding to does not know it.
2. A column with its own reasons found the legate before the destination did.
3. The sheet he carried is read now by somebody who was never meant to read it.
4. Interception is not capture; it is a change of counterparty.
5. The errand did not fail. It arrived somewhere else.

### envoy_parlaying (WR-7b) — envoyErrand receipt, adjudication desk — significance: notable
SLOTS: {npc}, {settlement}, {counterpart}
AUDIENCE: public
1. {npc} sits at parley with {counterpart}, and each side is arguing from a different world.
2. The terms are being drafted from pictures that stopped matching a fortnight ago.
3. Two courts' beliefs have met in one room, and neither of them is the truth.
4. The talking has begun, which is not the same as the stopping.
5. Whatever is agreed here binds nothing until it is carried home and told.

### envoy_terms_agreed (WR-7b) — Herald, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {term}
AUDIENCE: public
1. A {term} was struck at {counterpart} and is a sheet of paper on a road.
2. {npc} has an agreement and a fortnight of riding between it and any authority.
3. The war continues while the peace travels, and both are true at once.
4. What was agreed was agreed on beliefs, and the beliefs will be tested on the way home.
5. A signature at a parley is a promise about a world neither party can see.

### envoy_returning (WR-7a) — envoyErrand receipt, adjudication desk — significance: notable
SLOTS: {npc}, {settlement}, {counterpart}, {route}
AUDIENCE: public
1. {npc} rides for {settlement} with the terms and is a richer target than he was going out.
2. The return leg is the dangerous one, and every party that wanted the war continued knows it.
3. He carries the peace at the speed of a horse and the war at the speed of couriers.
4. The court that sent him is waiting on a road, which is a poor thing to wait on.
5. Nothing is settled until he tells it.

### envoy_home (WR-7a) — Herald, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}
AUDIENCE: public
1. {npc} came home to {settlement} and told the terms, and only then did they mean anything.
2. The sheet was read aloud in council, and the council heard one man's account of another court.
3. He arrived, and the world he described had moved on without either of them.
4. The errand is closed and the argument is beginning.
5. The peace exists now, and it exists because a man got back.

### envoy_held (WR-7b) — foreignGuestHold receipt, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {reason}
AUDIENCE: public
1. {npc} is held at {counterpart} on {reason}, a guest in every sense but the one that matters.
2. He is neither jailed nor free; the captor's record calls it a hold, and so does everyone else.
3. The court that sent him has had no word and is drawing conclusions.
4. A held envoy is a term sheet nobody has read and a demand nobody has made yet.
5. The hold began on a particular day and is being counted, which is how ransoms start.

### envoy_lost (WR-7a) — envoyErrand receipt, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {route}
AUDIENCE: public
1. The errand closed without word: {npc} did not reach {counterpart} and has not come home.
2. Nothing is known beyond the silence, and the record says exactly that.
3. {route} took him, in whatever sense roads take people; the receipt does not pretend to know.
4. What the court does next rests on an absence.
5. A man is missing, and a peace is missing with him.

### envoy_silence_inference (WR-7a) — the hostility inference, divination desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {route}
AUDIENCE: public
1. No word has come from {route}; the court fears the worst. *(§8)*
2. The window for his return closed a fortnight ago, and the hall has begun to speak of {npc} in the past tense.
3. Silence is being read as an answer, and it may not be one.
4. {settlement} believes {counterpart} has taken its legate. It believes this because nothing has arrived.
5. The court is hardening around an absence, which is the cheapest thing in the world to be wrong about.

### terms_never_reached (WR-7a) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {route}
AUDIENCE: public
1. The terms were agreed and the envoy never reached them. *(§8)*
2. Peace was made on {route} and died there.
3. Two courts have agreed and neither of them knows it.
4. The sheet exists. The war exists. Nothing has connected them.
5. What was signed at the parley is the property of the road now.

### terms_signed_for_a_fallen_town (WR-7b) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {route}
AUDIENCE: public
1. The terms were signed for a town that had already fallen. *(§8)*
2. {settlement} conceded {route}, which was cut before the ink was mixed.
3. The document is perfectly valid and describes nowhere.
4. Both parties bargained hard over a thing that no longer existed.
5. The mismatch will be discovered in the ordinary way and become the next grievance.

## WR-7b — INTERCEPTION + THE PARLAY

### parlay_at_an_occupied_venue (WR-7b) — Herald, adjudication desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}
AUDIENCE: public
1. They parleyed at {settlement} — a town {counterpart} holds, which nobody thought worth mentioning.
2. The terms of the war were drafted in a hall under the enemy's garrison, and the wine was good.
3. A legal venue is a legal venue; the irony is not the clerks' business.
4. The seat that owns the town was not in the room.
5. Peace was discussed where the war had already been decided.

### interceptor_dilemma (WR-7b) — Herald, war desk — significance: notable
SLOTS: {third_party}, {settlement}, {counterpart}, {route}
AUDIENCE: public
1. {third_party} holds terms it could carry home, and carrying them means leaving the field.
2. The commander must choose between a paper and a position, and his books disagree.
3. Carrying the sheet is a real military cost, and the court will not see it that way.
4. He can win the war or end it, and not both this season.
5. The mission was to hold {route}. The opportunity is on the table.

### interceptor_parlays_own_edge (WR-7b) — Herald, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {third_party}, {route}
AUDIENCE: public
1. {third_party} took the legate meant for {counterpart} and found it had no quarrel of its own left to argue; the parley opened on its own edge instead.
2. The column that stopped {npc} on {route} was the enemy's ally and out of reasons, which is a thing that happens to allies.
3. Peace came in at the door nobody was watching: one edge of the war closed at a roadside, and the war did not.
4. The commander read his own ledger, could not find the cause in it, and negotiated for himself.
5. {settlement} sued one court and settled with another, and the clerks will spend the winter writing it up.

### parlay_terms_neither_court_drafted (WR-7b) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {term}
AUDIENCE: public
1. The field parley produced a {term} neither hall would have written, because neither hall was in the field.
2. Two stale pictures met and agreed on a third world.
3. The commanders drafted from what they had seen; the courts will read it from what they were told.
4. Both seats will call the sheet strange, and both will be right.
5. What is fair depends entirely on where you were standing when you last had news.

## WR-7c — RATIFICATION + THE COMPROMISE ROUND

### ratification_passed (WR-7c) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {term}
AUDIENCE: public
1. The powers of {settlement} voted the {term} through, each on its own account of it.
2. The sheet was ratified by a hall that had heard it described rather than read it.
3. It passed, and no member of the coalition believes quite the same thing about what passed.
4. The war ends on this edge and continues on the others.
5. Ratification is a majority of beliefs, not a majority of facts.

### ratification_failed (WR-7c) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {term}
AUDIENCE: public
1. The {term} failed the vote at {settlement}; the errand and the season both come to nothing.
2. Every power wanted an end and none of them would take this end.
3. It was refused by a hall that heard it from one man.
4. The refusal costs what refusals cost, and the war goes into another winter.
5. Nothing about the sheet was wrong. It arrived in the wrong room.

### coalition_vetoes_ruler (WR-7c) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. {npc} accepted the terms and the coalition overruled him; the seat was outvoted from above.
2. A ruler can be overturned from below by his streets and from outside by his allies, and this time it came from outside.
3. {settlement}'s signature was not {settlement}'s to give.
4. The alliance discovered it had a veto and used it, which changes every negotiation after.
5. He agreed. It did not matter, and the hall has noticed.

### unanimous_in_judgment_split_in_fact (WR-7c) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {third_party}
AUDIENCE: public
1. Every power wanted the same outcome and they voted against each other, because each had its own envoy.
2. The coalition was unanimous in judgment and split in fact, and no vote can tell the difference.
3. The vote will be quoted for a generation as proof of bad faith, and it was nothing of the kind.
4. Nobody lied. Nobody was reckless. The terms failed anyway.
5. The distance between the halls is measured in couriers, and the couriers disagreed.

### belief_selection (WR-7c) — the credibility ladder, adjudication desk — significance: notable
SLOTS: {settlement}, {npc}, {counterpart}
AUDIENCE: public
1. {npc} had accounts from more than one envoy and chose which to believe; the choosing is on the record as an act.
2. The court took the report it preferred, and the preference is legible.
3. Two men saw one parley. The seat picked one of them, and the picking was politics.
4. Credibility was weighed, and so were other things.
5. Whose account carries a hall is a fact about the hall.

### testimony_corroborated (WR-7c) — the credibility ladder, divination desk — significance: notable
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. Two envoys of {settlement} tell the same tale of the parley, and the council treats it as corroborated.
2. The accounts agree in the parts that matter, which is as near to knowledge as this world gets.
3. Sending more than one was expensive and has become cheap.
4. The word is confirmed by its own repetition, and the hall knows the difference.
5. It is still an account. It is merely a better one.

### testimony_lone (WR-7c) — the credibility ladder, divination desk — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. One envoy returned from {counterpart}, and the whole peace rests on {npc}'s telling of it.
2. The account is reported, not corroborated, and the record says so plainly.
3. A single source with a great deal riding on it — the ladder has a name for that.
4. The hall is deciding a war on a man's memory of a room.
5. He may be honest and mistaken, and the sheet cannot tell them apart.

### compromise_round_opened (WR-7c) — Herald, adjudication desk — significance: notable
SLOTS: {settlement}, {counterpart}, {route}
AUDIENCE: public
1. The vote was close, so both courts sent envoys out again — and the fighting did not pause for it.
2. There is no ceasefire in this world; the talking rides alongside the war.
3. {settlement} and {counterpart} are negotiating and campaigning in the same season, as everyone does.
4. A near miss is an invitation, and both halls took it.
5. {route} carries legates in both directions, and neither court will know for a fortnight.

### acceptance_bands_widened (WR-7c) — the convergence instrument, adjudication desk — significance: notable
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. The round failed, and both courts will take {band} less than they would have taken before it.
2. Each failure makes the next offer cheaper to accept; that is the whole of the convergence.
3. Nobody conceded. Everybody's floor moved.
4. What was unthinkable in the spring is merely unpleasant by the harvest.
5. The war is being ended by an attrition of expectations rather than of armies.

## WR-7d — RANSOM + THE COMPROMISED ENVOY

### ransom_demanded (WR-7d) — the claim, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {route}, {band}
AUDIENCE: public
1. {counterpart} has named a price for {npc}, and the demand is riding {route} at the same speed as everything else.
2. The claim rides the ordinary reparations shape with a man as its subject.
3. A demand corrects a silence, if it arrives.
4. The captor has decided the guest is worth more sold than kept, and {band} is the asking.
5. {settlement} will learn its legate lives when a wagon-bill reaches the hall.

### ransom_paid (WR-7d) — Herald, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {band}, {good}
AUDIENCE: public
1. {settlement} paid for {npc} and got him back, along with everything his captors let him see.
2. The price was {band} in {good}, and the council paid it faster than it pays its roads.
3. A realm buys back its man and does not inspect what came home with him.
4. The wagons went out and a trusted source came in.
5. He is home, and every account he carries came out of the room he was held in.

### ransom_refused (WR-7d) — Herald, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {reason}, {good}
AUDIENCE: public
1. {settlement} would not pay, and {npc} remains at {counterpart} on the captor's terms.
2. The council priced a man against a season's {good} and said so out loud.
3. The market square had the whole of it by evening, and the square keeps a longer memory than the council.
4. It was prudent, and prudence has a face on it now.
5. They abandoned him for {reason}, and the record carries the reason under both their names.

### ransom_demand_intercepted (WR-7d) — the false inference stands, divination desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {route}
AUDIENCE: dm-only
1. The demand for {npc} never reached {settlement}; the court still believes the worst and is acting on it.
2. A correction was sent and {route} ate it.
3. Somewhere a captor waits for an answer to a letter that was never delivered.
4. The misreading stands, and the war is being widened on it.
5. Two courts are each waiting on the other, and neither knows it.

### guest_released (WR-7d) — foreignGuestHold receipt, adjudication desk — significance: notable
SLOTS: {npc}, {settlement}, {counterpart}, {route}
AUDIENCE: public
1. {counterpart} released {npc} without price, and the release is a message.
2. The captor decided a returned guest was worth more than a paid one.
3. He was fed, kept, and sent home down {route} with an escort, which is its own kind of terms.
4. Nothing was asked. Everything was said.
5. Mercy is legible and so is calculation, and the record does not distinguish them.

### guest_escaped (WR-7d) — foreignGuestHold receipt, adjudication desk — significance: notable
SLOTS: {npc}, {settlement}, {counterpart}
AUDIENCE: public
1. {npc} is out of {counterpart}'s hold and on the roads; the record closed the way the record closes.
2. He left without leave and without a horse, and the ledger says only that the hold has ended.
3. The court will hear it from him, which is the only way it will hear it.
4. A hold that ends this way ends a ransom claim with it.
5. What he saw in that house is travelling now.

### returned_abandoned (WR-7d) — Herald, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {faction}
AUDIENCE: public
1. {npc} came home to {settlement} unransomed, carrying the grievance himself.
2. The man the council would not buy back is in the council chamber.
3. He is owed something the record cannot pay, and he knows the exact sum.
4. Abandonment is a personal fact; it does not decay the way a treaty decays.
5. {faction} has been looking for a grievance with a name on it and now has one.

### returned_planted (WR-7d) — the plant, divination desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {faction}
AUDIENCE: dm-only
1. {npc} returns believing what his captors arranged for him to believe, and the hall counts him a trusted source.
2. The plant had a season to settle and a road to ripen on.
3. Nothing he says is a lie he knows about.
4. {settlement} bought back its man and the thing riding with him.
5. The corroboration ladder will place him high, which is precisely the point.

### envoy_volunteered_compromised (WR-7d) — the covert seam, divination desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {faction}
AUDIENCE: dm-only
1. {npc} asked for the errand, and {faction} did not have to ask him twice.
2. The seat's own snapshot is about to be carried, entire and true, to the one place it must not go.
3. He is the only soul in this world who will hold two courts' truths at once.
4. Volunteering is the whole of the tell, and nobody in that hall reads tells.
5. The terms he brings back will be fair, and fair to somebody else.

### vetting_careful (WR-7d) — the seat's choice, adjudication desk — significance: notable
SLOTS: {npc}, {settlement}, {house}
AUDIENCE: public
1. {settlement} read the man before it read the errand: loyalty, kin, and who his creditors are.
2. The seat asked whose table he had eaten at, did not care for the answer, and chose again.
3. Vetting costs a season and saves a war, when it works.
4. The careful court sends the safer man on purpose, and {house} is not consulted.
5. They chose slowly, and the choosing is itself a record of the seat's character.

### vetting_hurried (WR-7d) — the seat's choice, adjudication desk — significance: notable
SLOTS: {npc}, {settlement}
AUDIENCE: public
1. {settlement} needed a legate by the week's end and took the one who offered.
2. Nobody asked whose table he had eaten at; there was no time, and there is never time.
3. A hurried seat picks the willing, and the willing are sometimes willing for a reason.
4. The errand went out the door with the man who wanted it.
5. It may be nothing. It is on the record either way.

### send_two (WR-7d) — counter-intelligence, adjudication desk — significance: notable
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. {settlement} sent a pair to {counterpart}, which costs what it costs and buys corroboration.
2. The seat wanted a witness as much as a negotiator.
3. Two accounts of one room are the only counter-intelligence a hall can afford.
4. If they disagree, the disagreement is the intelligence.
5. It is an expensive way of saying the court does not entirely trust its own men.

### envoy_accounts_diverged (WR-7d) — the traitor's signature, divination desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. The envoys of {settlement} came home with different rooms, and the ladder noticed before the council did.
2. Two men at one parley cannot both be describing it; the corroboration failed, and the failure is the finding.
3. The seat has an account, a contradiction, and a question about a man.
4. One of them is mistaken and one of them is something else, and the record says only that they differ.
5. This is what sending a pair was for, and nobody enjoys it.

### envoy_treason_exposed (WR-7d) — the covert-to-revealed seam, adjudication desk — significance: major
SLOTS: {npc}, {settlement}, {counterpart}, {faction}, {term}
AUDIENCE: public
1. {npc} of {settlement} was shown to have carried {faction}'s interest into the parley, and the hall has taken it up as treason.
2. The covert became public in one afternoon, which is the only way it ever becomes public.
3. The {term} he negotiated is a question now: repudiate it, or admit who bought it.
4. The buyer is named in the record, which makes the buyer a casus.
5. The seat that hurried its vetting is explaining it.

---

# WR-8 — CONQUEST + THE RAZING

### conquest_feasibility_believed (WR-8) — the belief composite, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. {settlement}'s court believes {counterpart} can be taken, and the belief has begun moving armies.
2. The reach of the enemy's friends was counted {band}, and counted from a hall.
3. Whether it is true is a separate question the campaign will settle.
4. Feasibility is a belief with wagons attached.
5. The captains march on the picture, not on the country.

### bargaining_ranges_do_not_overlap (WR-8) — the belief composite, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {term}, {band}
AUDIENCE: public
1. What {settlement} believes it could take by force is more than {counterpart} believes it must give, and there is no {term} between the two.
2. Both halls drafted honestly and neither sheet came near the other's floor; the season goes on because nothing was ever on the table.
3. The distance between the two offers reads {band}, and no envoy can ride that far.
4. There is nothing to sign yet. There is a great deal still to say.
5. The grind is not stubbornness. It is arithmetic, done twice, out of two different books.

### conquest_overreach_misread (WR-8) — the mistaken-feasibility receipt, war desk — significance: major
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. {settlement} believed conquest was within reach and it was not; the receipt still carries what was believed and why.
2. The counting was honest and the country was not what the counting said.
3. They marched on a picture and met a place.
4. The mistake is a season old and will be paid for over a generation.
5. Every report that fed the belief sits in the record, which will be small comfort.

### doom_misread (WR-8) — the mistaken-feasibility receipt, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {term}
AUDIENCE: public
1. {settlement} believed itself doomed and conceded a {term} it did not have to concede.
2. The sheet was signed by a court that had counted its enemies and forgotten its friends.
3. The country was stronger than the hall believed, and nobody discovered it in time.
4. Fear is cheaper than a campaign and costs more.
5. The record says what was believed. It also says what was there.

### conquest_intent_formed (WR-8) — the intent read, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {temple}
AUDIENCE: public
1. By its own reckoning {settlement} can take {counterpart}, and now it intends to; capability was waiting on character.
2. The martial temper, the {temple}'s calendar, and a belief about what kind of place {counterpart} is, arriving together.
3. The court did not decide it could. It decided it should.
4. The receipt names what was believed about the enemy, and it is not flattering.
5. Annexation is the object now, and the campaign changes shape with it.

### conquest_intent_refused (WR-8) — the intent read, war desk — significance: notable
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. By its own reckoning {settlement} could take {counterpart}, and it will not; the enemy is believed decent, and that is the whole of it.
2. The council found nothing in the other town to justify holding it.
3. Capability never implies intent, and this hall knows the difference.
4. They will beat them and leave them standing, which is a policy and not a kindness.
5. The refusal is receipted with what was believed about {counterpart}, and the belief is the reason.

### conquest_mercy (WR-8) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. They could have taken everything and did not. *(§8)*
2. {counterpart}'s walls were open and {settlement} took terms instead.
3. The garrison left the granaries and the register alone, on orders that will be remembered.
4. Restraint was a choice with a price, and {npc} paid it.
5. The town survives and knows exactly who let it.

### conquest_intent_deceived (WR-8) — the I4 road, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {faction}
AUDIENCE: public
1. {settlement} presses the conquest believing {counterpart} is what it was told, and the receipt names the belief and where it came from.
2. Word reached the hall of things done at {counterpart}, and nobody has asked who carried it.
3. A good realm can be pointed at anything, provided the pointing is done well.
4. They march in the certainty of the righteous, which is the most useful certainty to manufacture.
5. It is said the enemy is monstrous. It is said by {faction}, which wanted this war.

### overwhelming_gate_failed (WR-8) — the gate's negative case, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {term}
AUDIENCE: public
1. {settlement} is winning and is not overwhelming, so it is negotiating.
2. The field is theirs and the country is not; the difference is a {term}.
3. Clearly ahead is not the same as able to hold, and the captains said so first.
4. They will take terms because taking the place is beyond them this season.
5. A war won is not a country taken, and the gate held.

### occupation_begun (WR-8) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. {counterpart} is held and not annexed: a garrison, a curfew, and the old register still in the old hall.
2. {settlement} pays {band} every week for the holding and calls it a victory.
3. The town is occupied and the seat is intact, which suits nobody permanently.
4. Occupation is a cost with a flag on it.
5. They hold the walls. The town is another matter.

### occupation_unrest (WR-8) — Herald, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {faction}, {band}
AUDIENCE: public
1. {counterpart} under garrison is {band} restless; the market closes early and the watchfires burn late.
2. The occupier's proclamations are read aloud and answered in the alleys.
3. Nothing has happened yet, which is what everyone says before it does.
4. The garrison costs more each season and buys less.
5. {faction} is organising in a town that has nothing else to do.

### occupation_revolt (WR-8) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. {counterpart} rose against its garrison; the streets were the battlefield, and the streets are still there.
2. The occupation ended the way occupations end, on a night nobody planned.
3. {settlement} holds the walls and has lost the town inside them.
4. Holding is not owning, and the ledger has now said so at length.
5. The revolt was in the record before it was in the streets, for anyone reading the unrest.

### conquest_inheritance (WR-8) — the counterforce, trade desk — significance: major
SLOTS: {settlement}, {counterpart}, {route}, {good}
AUDIENCE: public
1. {settlement} has annexed {counterpart} and annexed its famine with it.
2. The victor's granaries feed the loser's people now, which nobody costed in the spring.
3. A conquered country arrives with its roads, its enemies, and its hunger.
4. They won a province and inherited a bill.
5. The {good} that would have carried {settlement} through the winter is going out down {route}.

### razing_done (WR-8) — Herald, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {temple}
AUDIENCE: public
1. They burned {settlement} and rode home. *(§8)*
2. {counterpart} took the town, emptied it, and did not stay the night.
3. The granaries went first, then the {temple}, then the rest.
4. There was no garrison because there was nothing left to garrison.
5. What was done at {settlement} was done deliberately and quickly, and the roads carried it everywhere within the fortnight.

### razing_demotion (WR-8) — popToTier receipt, events desk — significance: major
SLOTS: {settlement}, {band}
AUDIENCE: public
1. {settlement} is a village now by every measure that counts, and the register has caught up with the truth.
2. A market charter means nothing with no market under it.
3. The tier fell because the people did, in that order.
4. What was a town is a place people pass through.
5. Nobody demoted {settlement}; the counting did, and it counted {band}.

### razing_institutions_shelled (WR-8) — institution status receipt, adjudication desk — significance: major
SLOTS: {settlement}, {temple}
AUDIENCE: public
1. The assize at {settlement} keeps its seal and its bench and has nobody left who may sit on it.
2. The {temple} stands and does nothing, which is the definition the clerks use.
3. Institutions outlive their function by exactly as long as their buildings.
4. There is a court, a school, and a granary at {settlement}, and not one of them works.
5. The shell is the receipt.

### razing_refugees (WR-8) — the escape share, events desk — significance: major
SLOTS: {settlement}, {counterpart}, {band}, {route}
AUDIENCE: public
1. {band} got out of {settlement} and are on {route} with what they carried.
2. The escape share is small and it is real, and the roads are full of it.
3. Neighbouring towns are deciding what they owe strangers, and deciding differently.
4. They left in the burning year, and their grandsons will still say so.
5. A town does not vanish. It relocates, badly.

### razing_named_cast_dispersed (WR-8) — the named-cast mercy, events desk — significance: major
SLOTS: {settlement}, {npc}, {route}, {house}
AUDIENCE: public
1. The named of {settlement} went out on the roads, and where they went is not yet written anywhere.
2. {npc} was last seen on {route} and has not been seen since.
3. The register keeps their names, because the register keeps everything.
4. They scattered as the factors of {house} scattered to the quays.
5. Some of them will be heard from. That is a different chronicle.

### razer_departed (WR-8) — the departure is the receipt, war desk — significance: major
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. {counterpart} left {settlement} the same week, and left no garrison and no claim.
2. There was nothing to occupy, and the leaving says what the burning meant.
3. The departure is the receipt: this was punishment, not conquest.
4. They wanted it gone, not held.
5. The news of it was home a good while before the army was.

### razing_judged_monumental (WR-8) — the world judges, faith desk — significance: major
SLOTS: {settlement}, {counterpart}, {temple}
AUDIENCE: public
1. The {temple} named what was done at {settlement} the worst thing in living memory, and the naming carries.
2. Courts that had no quarrel with either party have written it into their records.
3. The world's judgment is not a law and prices like one.
4. It is spoken of in the same breath as the great calamities, which is a place no realm leaves quickly.
5. {counterpart} is a word now rather than a neighbour.

### razing_judged_lesser (WR-8) — the world judges, events desk — significance: notable
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. The razing of {settlement} was noted, condemned in the ordinary way, and largely absorbed.
2. Courts wrote it down and went on trading.
3. It was a bad thing in a season of bad things.
4. Nobody's alliance changed, which is its own verdict.
5. Distance is a kind of forgiveness, and the roads were long.

### razing_judged_recognized (WR-8) — the world judges, events desk — significance: notable
SLOTS: {settlement}, {counterpart}, {house}
AUDIENCE: public
1. Some halls read the burning of {settlement} as a lesson properly taught, and said so where it would be repeated.
2. {counterpart}'s standing rose in the places where such standing rises.
3. What one court calls atrocity another calls an example.
4. The judgment falls on the observer's axis, and some axes point the other way.
5. {house} sent gifts, and the gifts are in the record.

### razing_deterrence_weighed (WR-8) — the retaliation web, war desk — significance: routine
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: dm-only
1. Before the burning, {counterpart} counted who would answer for {settlement} and priced the answering {band}.
2. The web was read at the aftermath rather than the field, which is the correct place to read it.
3. The deterrence was real and was not enough.
4. The weighing is done; what the neighbours actually do with it is a later entry in a later book.
5. What the razer expected of the world, and what it thought that expectation was worth, are both on the sheet.

### terror_works (WR-8) — the neighbour's read, war desk — significance: notable
SLOTS: {settlement}, {counterpart}, {route}
AUDIENCE: public
1. {counterpart} has not been troubled on that frontier since {settlement} burned, and everyone knows why.
2. The tolls along {route} are paid early and in full.
3. Fear is a policy with a shelf life, and this one is still good.
4. Nobody has tested them. That is the whole of the result.
5. It worked, and that it worked is the part the chronicles will have trouble with.

### terror_backfires (WR-8) — the neighbour's read, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {faction}
AUDIENCE: public
1. The burning of {settlement} bought {counterpart} a frontier of enemies who had been merely neighbours.
2. Courts that were indifferent in the spring are treating with each other by the harvest.
3. Terror teaches, and it does not control what it teaches.
4. {faction} formed for no other reason and needed no other reason.
5. They meant to be feared and are, and the fear is organising.

### ash_pays_no_tribute (WR-8) — the material self-limit, trade desk — significance: notable
SLOTS: {settlement}, {counterpart}, {good}
AUDIENCE: public
1. Ash pays no tribute: {settlement} owed {counterpart} {good} for a generation and owes nothing to anyone now.
2. The plunder was carried home in a season; the tribute would have come every year.
3. The captains chose the wagon over the ledger, and the ledger noticed.
4. What was burned cannot be taxed, which is an argument that never persuades an angry court.
5. They took everything, and they took it the once.

### remnant_nothing_left (WR-8) — the material self-limit, war desk — significance: routine
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. There was nothing left at {settlement} to take, and the column turned back.
2. A ruined place cannot be ruined again; the march accomplished nothing and cost a season.
3. The granaries were empty, the register gone, and the wells already fouled.
4. Vengeance arrived after the fact and found no fact.
5. {counterpart} spent a season reaching a conclusion the world had already reached.

### vengeance_license_minted (WR-8) — the license ledger, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. {settlement} holds the right of answer against {counterpart} for what was done, and the right is written where rights are written.
2. The burning made a claim that does not decay the way grievances decay.
3. One license, one coalition, and it can be spent only the once.
4. It is not a war. It is a permission, and permissions wait.
5. It stands for {band}, and an heir may collect what a father was given.

### vengeance_license_prosecuted (WR-8) — the license ledger, war desk — significance: major
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. {settlement} spent its right of answer on {counterpart}, and the ledger shows it spent and gone.
2. What was owed for the burning was collected, in the manner such things are collected.
3. The license is consumed, and nothing new was minted against the avenger.
4. The loop closed, which is rarer than the chroniclers admit.
5. They waited a generation and did not wait longer.

### vengeance_license_rested (WR-8) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {faction}
AUDIENCE: public
1. {settlement} held the right of vengeance, and let it rest. *(§8)*
2. The claim stands unspent in the record, and the seat has said publicly that it will stay there.
3. Mercy that costs nothing is not mercy; this one cost the hall {faction}.
4. They could have marched with the world's blessing and put the horses away instead.
5. The right does not expire this generation, and the town knows it.

### vengeance_license_expired (WR-8) — the license ledger, adjudication desk — significance: notable
SLOTS: {settlement}, {counterpart}
AUDIENCE: public
1. The right {settlement} held against {counterpart} has outlived everyone who wanted it used.
2. A generation is the whole life of such a claim, and this one reached the end of it.
3. It is a legend in the hall now rather than a law in the book.
4. Grandsons inherited a permission and no appetite.
5. The clerks struck it from the live record and kept the entry, as clerks do.

### vengeance_license_uncoupled (WR-8) — the coupling gate, adjudication desk — significance: routine
SLOTS: {settlement}, {counterpart}
AUDIENCE: dm-only
1. The holder's own relationship with {counterpart} never reached the extreme, so the license arms nothing.
2. A right of answer with no quarrel behind it is a paper.
3. The coupling failed, and the receipt names both readings.
4. {settlement} may prosecute when it hates enough, and it does not.
5. The permission is live and unusable, which is the design.

### casus_atrocity_answer (WR-8) — casus receipt, war desk — significance: major
SLOTS: {settlement}, {counterpart}, {third_party}
AUDIENCE: public
1. {settlement} takes up arms over what is believed done at {third_party}, and the belief arrived at the speed of the roads.
2. Someone must stop them: it is the whole argument, and it builds alliances faster than any grievance.
3. The town they say was burned is not the town that is marching.
4. Word of the burning reached this hall a season late and lost nothing on the way.
5. It is said {counterpart} razed a town whole. The saying is what mints the cause.

### mirror_atrocity_atoned (WR-8) — mirror receipt, faith desk — significance: notable
SLOTS: {settlement}, {counterpart}, {temple}
AUDIENCE: public
1. {counterpart} answered for what was done at {settlement}, and the cause has gone out of the ledger.
2. Restitution was paid, the {temple} rebuilt, and the courts that were arming have stood down.
3. Atonement is expensive and cheaper than the coalition it prevents.
4. What could not be undone was at least paid for, publicly and by name.
5. The just answer minted nothing against the avenger; the answer was the answer.

### just_razing_sanctioned (WR-8) — J-WR-8's price, faith desk — significance: notable
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. The burning at {settlement} was licensed and is still counted against {counterpart}, at {band} of the ordinary weight.
2. A sanctioned razing costs less than an unsanctioned one and does not cost nothing.
3. The courts that approved it have not forgotten that they approved it.
4. Mercy remained available throughout, which is why the price is real.
5. Righteousness discounts the bill; it does not tear it up.

---

# WR-9 — THE ENDINGS MIX (the eight tokens of amendment L's envelope)

### ending_terms (WR-9) — endings token, chronicle close — significance: major
SLOTS: {war}, {settlement}, {counterpart}, {term}
AUDIENCE: public
1. {war} ended on terms, carried home and told.
2. Both courts signed what neither would have signed in the spring.
3. It ended in a hall, which is where most of them end.
4. Nobody won. The {term} says otherwise in careful language.
5. The tribute begins at the next quarter day and will be paid for a generation.

### ending_exhaustion (WR-9) — endings token, chronicle close — significance: major
SLOTS: {war}, {settlement}, {counterpart}, {route}
AUDIENCE: public
1. {war} ended because {settlement} could not feed it any longer, and {counterpart} could not either.
2. There was no battle at the end; there were empty granaries at both ends of {route}.
3. The terms are thin because nothing was left to bargain with.
4. They stopped the way a fire stops.
5. Exhaustion signs a poorer treaty than victory and keeps it longer.

### ending_ruler_change (WR-9) — endings token, chronicle close — significance: major
SLOTS: {war}, {settlement}, {npc}
AUDIENCE: public
1. {war} ended when {npc} came to the seat at {settlement} and read it differently.
2. The state was unchanged; the character in the chair was not.
3. A succession broke the momentum that nothing in the field could.
4. His predecessor could not have signed this, and that is the whole explanation.
5. The levies came home to a hall that had changed hands while they were out.

### ending_fragmentation (WR-9) — endings token, chronicle close — significance: major
SLOTS: {war}, {counterpart}, {band}
AUDIENCE: public
1. The coalition against {counterpart} came apart edge by edge, and each edge made its own peace.
2. There was never a table; there were {band} separate roads home.
3. The last ally to leave got the worst terms, which everyone had predicted and nobody had prevented.
4. {war} did not end. It dispersed.
5. Pairwise it began and pairwise it finished, as everything here does.

### ending_annihilation (WR-9) — endings token, chronicle close — significance: major
SLOTS: {war}, {settlement}, {counterpart}
AUDIENCE: public
1. {settlement} is not there any more, and {war} ended because one of its parties did.
2. The register was closed by the clerks of {counterpart}, which is the only formality that survived.
3. Nothing was signed. There was nobody left with the authority to sign.
4. The named of that town are on the roads, and the town is a place on a map.
5. It ended the way the chronicles least like to record, which is briefly.

### ending_conquest (WR-9) — endings token, chronicle close — significance: major
SLOTS: {war}, {settlement}, {counterpart}
AUDIENCE: public
1. {counterpart} took {settlement} whole and holds it under garrison at a price it pays weekly.
2. {war} ended in annexation, which is the rarest of these endings and the most expensive.
3. The seat is gone, the walls are held, and the town is undecided.
4. What was a party to the war is a possession in the ledger.
5. They won it. Holding it is the next war, quieter and longer.

### ending_punitive_sack_initiation (WR-9) — endings token, chronicle close — significance: major
SLOTS: {war}, {settlement}, {counterpart}
AUDIENCE: public
1. {war} ended when {counterpart} burned {settlement} and went home.
2. There were no terms, because terms were never the object.
3. The intent was punishment, and the record says so from the beginning.
4. The victor took nothing it could not carry and left nothing it could not burn.
5. A war can end without a treaty, and this is what that looks like.

### ending_punitive_sack_vengeance (WR-9) — endings token, chronicle close — significance: major
SLOTS: {war}, {settlement}, {counterpart}
AUDIENCE: public
1. {settlement} spent the right it had held since the burning, and {war} ended in the manner it began.
2. The answer arrived a generation late and in kind.
3. The right was spent to the last of it, and the burning it answered mints nothing further.
4. Courts that condemned the first burning were quieter about this one.
5. It ended even, which is the word the chroniclers use when they have nothing better.

---

# WR-10 — THE SOVEREIGNTY MARKET

### sovereignty_sale_offered (WR-10) — Herald, trade desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}, {good}, {route}
AUDIENCE: public
1. {counterpart} has offered {settlement} for sale, and the bundle on the table is {good}, allyship, and {route}.
2. The asset is a satellite and the seller says so plainly; free towns are not for sale, and everyone repeats it.
3. A settlement is a treaty like any other, drafted by the same clerks on the same paper.
4. The offer went out to the halls that could actually hold it, which is a short list.
5. What is being sold is an edge on a map and a great many people who were not asked.

### sovereignty_sale_cleared (WR-10) — Herald, trade desk — significance: major
SLOTS: {settlement}, {counterpart}, {third_party}, {good}, {route}
AUDIENCE: public
1. The trade cleared: {counterpart}'s reserve was met and {third_party}'s ceiling was not reached.
2. {settlement} changed overlords for {good}, {route}, and a compact, and none of it moved a soul.
3. Both halls valued the bundle through their own needs and the values overlapped, which is all a bargain is.
4. It was signed in an afternoon and will be argued about for a generation.
5. A town was sold. The town found out afterward.

### sovereignty_no_trade (WR-10) — the named no-trade outcome, trade desk — significance: routine
SLOTS: {settlement}, {counterpart}, {third_party}, {band}
AUDIENCE: public
1. The machinery ran and produced nothing: {counterpart} would not take what {third_party} could bear to give.
2. The buyer reached its ceiling before the seller reached its reserve, and both walked away polite.
3. The bundle was stacked as high as it would go and stood {band} short.
4. There was no bargain, and the absence is on the record with the reason.
5. What the buyer offered, the seller's needs valued at nothing; appropriateness is not a rule anyone can write.

### sovereignty_swap (WR-10) — Herald, trade desk — significance: major
SLOTS: {settlement}, {counterpart}, {third_party}, {route}
AUDIENCE: public
1. {counterpart} and {third_party} exchanged satellites, and each thinks it got the better of it.
2. {settlement} went one way and a town of its size went the other, along roads neither will use again.
3. The swap was symmetric on paper and never on the ground.
4. Each overlord solved a problem and made one for the towns.
5. Nobody moved. Everything changed.

### cession_for_peace (WR-10) — Herald, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {third_party}, {reason}
AUDIENCE: public
1. {counterpart} ceded {settlement} to end the war, and the cession rode home in an envoy's sheet.
2. The town was the price of the peace, and the town was not consulted.
3. What could not be held was traded for what could not be won.
4. The terms name the settlement, the reason, and both seats; the clerks were careful about that.
5. A war ended and a grievance began, in the same document, for {reason}.

### sovereignty_edge_rewritten (WR-10) — the transfer, events desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}, {route}
AUDIENCE: public
1. {settlement}'s overlord is {third_party} now; the people are the same people and the tolls go elsewhere.
2. The edge on the map was rewritten and the lineage edge was kept, which will matter later.
3. Nobody moved house. The wagons take {route} instead.
4. The charter chest changed halls; the reeve did not change.
5. What was owed to one seat is owed to another, and the owing is unchanged.

### sold_settlement_grievance (WR-10) — Herald, events desk — significance: major
SLOTS: {settlement}, {counterpart}, {third_party}
AUDIENCE: public
1. {settlement} was sold and has said so, at length, in every hall that will hear it.
2. The town keeps a grievance against the seat that sold it and a suspicion of the seat that bought it.
3. Being traded is a wound no treaty term addresses.
4. They were a possession in the record and have now read the record.
5. The grievance is fresh, named, and pointed at {counterpart}, which sold them.

### bought_seat_fragility (WR-10) — the puppet seat, adjudication desk — significance: notable
SLOTS: {settlement}, {third_party}, {band}
AUDIENCE: public
1. {third_party} holds {settlement} and holds it thinly; the new seat's standing reads {band}, and revolt stands with it.
2. Bought authority starts where earned authority ends up after a bad war.
3. The garrison is small and the compliance is polite, and neither is a settlement.
4. They own the town and negotiate with it weekly.
5. Nothing was conquered, so nothing was decided.

### lineage_survives_the_sale (WR-10) — the surviving edge, events desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}
AUDIENCE: public
1. {counterpart} sold {settlement} and remains its founder in the record, which is a claim in waiting.
2. The lineage edge survives the sale as history, and history is a casus.
3. A seller's remorse has a name and a charter behind it.
4. The town it seeded answers to {third_party} now and still remembers whose granary fed it.
5. Independence and reclamation are mintable from the same entry, which is the joke.

### wartime_firesale (WR-10) — Herald, trade desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}, {band}
AUDIENCE: public
1. {counterpart} sold {settlement} in the middle of its war, and the price says exactly what the buyer believes about its trajectory.
2. A wartime sale is legal, discounted, and read by everyone.
3. The seller took {band} of what the town was worth in peacetime, and took it gladly.
4. Nobody buys at that price out of charity.
5. {third_party} is wagering that the decline continues and has put wagons behind the wager.

### sovereignty_sale_judged (WR-10) — the world judges, faith desk — significance: notable
SLOTS: {settlement}, {counterpart}, {third_party}, {temple}
AUDIENCE: public
1. {counterpart} sold {settlement} to a hall that has burned towns, and the courts have noticed.
2. Selling is ordinary; selling to that buyer is not, and the observer's axis decides which it was.
3. The {temple} spoke about it, which it does not do about ordinary contracts.
4. The price was good and the standing was expensive.
5. Some halls will not receive {counterpart}'s factors this season and have not said why.

### kinship_opposes_the_sale (WR-10) — the coherence read, adjudication desk — significance: notable
SLOTS: {settlement}, {counterpart}, {house}
AUDIENCE: public
1. {counterpart}'s council would not sell {settlement}: the founding bond outweighed the bundle, and the bundle was good.
2. They seeded that town and would not put a price on it, which {house} found sentimental and expensive.
3. Kinship is a valuation like any other, and it valued this above grain.
4. The offer was refused without a counter, which says everything.
5. What a house will not sell is a fact about the house.

### sale_books_diverged (WR-10) — the two books, adjudication desk — significance: major
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. {npc} sold {settlement} to save the seat; the town's books and the seat's books wanted opposite things, and the seat signed.
2. The family silver went out the door on a bad afternoon and bought a quiet council.
3. The realm lost a satellite and the ruler kept a hall, and the record is plain about which of the two was being served.
4. It was necessary for exactly one person in the room.
5. Nobody argues it was a good bargain. They argue about who it was good for.

### overflow_valve_sold (WR-10) — the emergent cost, events desk — significance: notable
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. {counterpart} sold the steading its overflow used to go to, and the overflow has nowhere to go.
2. The valve was worth more than the price, and the council knows it now.
3. They are {band} over their ceiling and out of land they can call their own.
4. A satellite is a place to put people, and the ledger had no column for that.
5. The squeeze arrived a generation after the sale, on schedule and unforeseen.

### streams_rerouted (WR-10) — the transfer, trade desk — significance: routine
SLOTS: {settlement}, {counterpart}, {third_party}, {good}, {route}
AUDIENCE: public
1. The {good} that went to {counterpart} goes to {third_party} now, by the same carts and a longer road.
2. {settlement}'s tribute rides {route} these days, and the drovers have opinions about it.
3. The caravans changed destination and nothing else changed.
4. The wharf at {counterpart} is quieter than it was, and the quiet has a cause with a name.
5. Streams follow the edge, and the edge moved.

---

## OPEN ITEMS FOR THE VALIDATION CHAIR

1. **`{third_party}` is a new slot.** The spine's closed set has two settlement slots;
   the war program is the only volume with genuinely three-cornered receipts
   (interception: home, destination, interceptor · coalition: caller, ally, enemy ·
   the settlement market: asset, seller, buyer). Without a third slot those kinds must
   bake a name or drop a party from the address chain. Ratify the slot, or rule the
   affected kinds down to two-party framing and accept the thinner address chain.
2. **WR-2's channel crossings are authored as level statements, not directions.** A
   crossing receipt says where the temper now stands (`{band}`), not that it rose or
   fell, so one pool serves both directions honestly. If the Herald wants direction in
   the prose, each of the four channels needs a risen/waned split and the census grows
   by four kinds.
3. **`war_cause_dissolved` is authored generic plus three per-cause forms.** The volume
   names three dissolutions explicitly (sacred, lineage, opportunism); the remaining
   war reasons dissolve through the generic pool. If WR-1's dissolution-totality walker
   requires a per-type sentence for every WAR_REASON_TYPE, this annex is short by ten
   pools and the shortfall is authoring, not design.
4. **WR-9 phrases eight endings tokens and nothing else.** The wave is measurement;
   its envelopes, certification rows, and the deciding-term histogram phrase nothing.
   Declared empty deliberately, on the POP-7 precedent.
5. **`razing_named_cast_dispersed` carries LAW ONE's whole weight for WR-8.** Every
   variant leaves the named unresolved by construction. If any downstream surface
   renders a fate for a dispersed name, that surface is the defect, not this pool.
6. **WR-4's EVEN trajectory is DECLARED EMPTY, deliberately.** `warCosts.js` returns a
   null comparison on the even case, and the volume pins the silence — "even ⇒ the
   deciding-term receipt never names trajectory". A third trajectory pool would put a
   sentence exactly where the design demands none, so the kind is two pools and the
   absence is a decision, on the POP-7 precedent (§5 WR-4).
7. **`bargaining_ranges_do_not_overlap` sits next to WR-1's `war_termination_cost_to_stop`
   and is not it.** The WR-1 pool answers "what decides this war" from one court's
   ledger; this one is the two-sided feasibility receipt the volume demands ("ranges may
   not overlap, and non-overlap IS the grind receipted"). If the chair would rather the
   grind speak only through the deciding term, this pool is the one to strike, and
   WR-8's feasibility loses its terms consumer.

---

## VERIFICATION PASS — 2026-08-02 (validation chair, adversarial read against the eight
## hard constraints, the SP-6 floor, and the volume census)

Every one of the pools below was read line by line against the eight constraints. What
was found and fixed, so the next reader does not re-derive it:

- **Family-rule collapses (constraint 7), eight pools.** `casus_suppressed`,
  `war_culture_suppressed`, `lineage_claim_suppressed`, `home_front_markets`,
  `winning_abroad_losing_at_home`, `trajectory_misread`,
  `unanimous_in_judgment_split_in_fact`, and `razing_deterrence_weighed` each carried
  two or more variants at the same angle — most often two restatements of the
  mechanism in the dm-only suppression pools, where the street's-view angle is
  unavailable and the ledger's view was reached for twice. The duplicates were
  rewritten onto the unused angles (consequence forward, the clerk's view, the
  irony), never deleted; every pool still stands at five.
- **Headline honesty (constraint 3), three lines.** `ransom_refused` asserted that an
  abandoned man "will come home eventually" — a fate the receipt cannot entail and
  LAW ONE will not have. `conquest_intent_formed` and `conquest_intent_refused` stated
  capability as world fact ("{settlement} can take {counterpart}") when N2's
  feasibility is a BELIEF composite that K3 forbids from reading truth; both now
  attribute the reckoning to the court that did it.
- **An engine-law contradiction.** `razer_departed` closed with "The army was home
  before the news was" — the exact inverse of the reputation race the volume pins in
  WR-7a ("news still outruns people"). Inverted.
- **Premium isolation (constraint 6).** `ransom_demand_intercepted` reclassified to
  `AUDIENCE: dm-only`; see the AUDIENCE note above.
- **Repetition-envelope echoes.** Four verbatim clauses shared across kinds that can
  co-occur on one settlement in one season — "the muster rolls went back into the
  chest" (`treaty_war_blocked` / `patron_deterrence`), "a room with a register"
  (`home_front_institutions` / `razing_institutions_shelled`), "the contradicting
  record is named" (`casus_suppressed` / `war_culture_suppressed`), and "the receipt
  names what was believed about" (`conquest_intent_formed` /
  `razing_deterrence_weighed`) — were varied on one side each. Two deliberate echoes
  were KEPT because the design intends them: the vetting pair's "whose table he had
  eaten at" (careful vs hurried is the contrast) and the suing pair's "the offer went
  out over — name" (seat vs realm), both being mutually exclusive for a given war.
  `coalition_entry_priced` / `razing_deterrence_weighed` also share "counted who would
  answer for", which is kept: the volume states outright that the deterrence read IS
  the alliance-web risk read pointed at the aftermath.
- **Clean on the rest.** No digits in any rendered line (780 variants scanned, the
  numbering and the *(§8)* marker stripped). No slot outside the declared set, no slot
  used without declaration. No exclamation marks, no modern idiom, no kitsch
  archaism. No line confirms a god acted; no line resolves a named person's fate. All
  fourteen §8 Herald sentences present as variant 1 of their kind, slot-substituted
  and otherwise verbatim. Every kind stands at five variants — one above the SP-6
  floor of four.
