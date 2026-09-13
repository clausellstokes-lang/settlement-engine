# DS-DEF-2 · `Invasion & War: walls AND professional garrison` · candidates-1

<!-- writer 1 of 2 · seat Fable 5.1 · lens THE TELLING PARTICULAR (one object with a weight, an owner or a smell; a thing described only in use or in dispute) · voice THE MASTER ARCHIVER'S HAND (ruling 13a as the owner qualified it) -->
<!-- read: EXEMPLAR-PACK.md (the 2026-09-13 re-cut) · the pool's three shipped rows at f2da5a3ee (unchanged in the current state) · card.md for this pool. Nothing else. -->
<!-- CHECKPOINT: this file is rewritten as the packet grows; a successor continues from it. -->

<!-- HOW THE CARD WAS HONOURED, so the selector need not re-derive it:
  · THE WALL IS NEVER NAMED. On the town slice the walls bucket can be seated by `Gates (if walled)` alone, so no face predicates a circuit, a ring, a walk, a parapet, a stair or a material. Every face writes THE WAY THROUGH (the gate, the bar, the way in), which `hasGates` makes true on all 306 towns. `{defwork}` is not used, because it renders "gates (if walled)" on a gates-only town and no sentence survives that string; `{defmaterial}` is not used because it is absent on three rosters of five.
  · THE FORCE IS ALWAYS PAID AND STANDING (ruling 35: the sibling rung `walls with citizen militia` must not fit), and THE WAY THROUGH IS ALWAYS CONTROLLED (the sibling `force with NO walls` must not fit). "the soldiers", "the men on the bar", "the men the town pays" — plural, never an officer, never the Guard Captain (F3-06). Where "garrison" appears it carries the town's possessive (F1-121).
  · NO RECORD IS CITED THAT THE TIERS DO NOT ALL KEEP: no toll book (no keeper at city and metropolis), no muster roll (no keeper anywhere on this key), no parish register cited as a book (no keeper at city), no "the accounts" (town-safe only). The hall SAYS what its purse does; the sexton SPEAKS; the men on the bar SAY what they take. The one record-shaped fact the notebook carries is the engine's own: paid men and no roll of them.
  · THE PURSE IS NEVER SPLIT (F4-02): no face says the men were paid and the gate was not, or the reverse. The one lawful disagreement is whether what the bar takes reaches the purse, and that is the pair material throughout.
  · THE PAY IS NEVER CALLED SHORT OR LATE as a fact, since the economic band is open across the preimage; the soldiers are neither slack (a `plagued` town prints "well-drilled") nor barely enough (a `settled` town prints "substantially more than the threat level requires").
  · No count, no rate, no date, no season, no history, no "always", no size word. The elapsed forms used ("has seen", "has been shown") run over the key's own reads, over frozen fields, or over the archiver's own presence (ruling 11).
  · No `compromised` candidate is offered: section (2c) marks no covert field on this pool and the tag would be refused.
  · The dead are never placed relative to the gate (the two burial rows contradict each other at metropolis).
  · A note on "the bar": the engine's rows say "gates" (plural at city). "the bar" is used as the class word for the way through, "the gate" beside it; where the selector prefers the plural on a city page, "the bars" reads in every face below without other change.
  · SOURCES SEATED, per section (7): universal — stranger · gate (whoever holds the way through) · garrison · watch · hall · tavern · market (with the granary) · register (the sexton); conditional — guild (Craft guilds REQUIRED at town, 0.98/0.95 at city, 0.7 at metropolis) · elders (Town council opt 0.9, TOWN ONLY, absent above) · court (Courthouse 0.6 at town, Multiple courthouses REQUIRED at city and metropolis; the WORD court is free, its record is not). Never: muster (no roll on this key), the crown's assessor. The households are the bill's bearer and never a speaker.
  · Untagged faces below are BARE FACTS the engine holds (ruling 40), not the stranger's: each is marked in a comment so the selector does not read the missing tag as the default.
-->

1. `[ledger]` The way into the town is barred and the men on the bar are paid soldiers. The town pays for the gate and for the men out of one purse.
   <!-- spine shape 1 of 3: THE BARE FACT, two sentences, the archiver's own hand. walls bucket + garrison + the single military line (defenseGenerator.js:189). -->
   - `[face]` `[stranger]` A carter says the first word said to him here was said by a soldier at the bar, and that the word was the toll.
   - `[face]` `[gate · pair 1 · disagree]` The men on the bar say the toll is the toll, and what the hall does with it afterwards is the hall's affair.
   - `[face]` `[hall · pair 1 · disagree]` A clerk in the hall says the toll goes into the purse that pays the men who take it, and that the purse is one purse.
   <!-- pair 1 joinable: "The men on the bar say the toll is the toll and what happens to it afterwards is the hall's affair, though a clerk in the hall says it goes into the purse that pays the men who take it." The disagreement is the one the card leaves open: whether the bar's takings reach the purse. Neither denies the field. -->
   - `[face]` `[gate]` The gatekeepers say every cart is opened and every coin counted, and that the counting is the part nobody thanks them for.
   - `[face]` `[garrison]` One of the soldiers says the town pays him to stand at the bar, and that what a factor pays him for a day's escort is between the factor and him.
   <!-- Guard hire (town, on, 0.9) and Mercenary hire (city, on, 0.6) are the engine's own menu; reported as the soldier's account, not a fact. -->
   - `[face]` `[watch]` One of the watch says the soldiers are paid to stand where they are put and the watch to go where it is called.
   <!-- duties, not organisations relieving each other: safe on a city whose Garrison row is ruined and whose watch is the only garrison-bucket row. -->
   - `[face]` `[guild · pair 2 · disagree]` A guild factor says the trades pay at the bar and pay the hall again, and that nobody has shown them the same coin twice.
   - `[face]` `[hall · pair 2 · disagree]` A clerk in the hall says the coin the trades pay at the bar is the coin that pays the men at the bar, and that a factor who cannot follow it there has not tried.
   <!-- pair 2 joinable: "A guild factor says the trades pay at the bar and pay the hall again and have not been shown the same coin twice, though a clerk in the hall says the coin paid at the bar is the coin that pays the men at it." Guild seat: Craft guilds required at town, likely above. -->
   - `[face]` `[tavern]` At the tavern the soldiers are counted as custom, and the talk is which of them is off duty and which is not.
   - `[face]` `[tavern]` It is said at the tavern that the soldiers know every carter by his load and no carter by his name.
   - `[face]` `[market]` A stallholder says every sack that comes through the bar is counted twice, once by a soldier and once by whoever is selling it.
   - `[face]` `[register]` The sexton says a soldier is buried like anyone else here, and that the parish charges the same for it.
   - `[face]` `[elders]` One of the elders says the custom is that the gate is the town's and the men on it are the town's servants, and that the men have not been told so.
   <!-- seat: Town council opt 0.9, TOWN ONLY; the elders kind (Record of custom) resolves nowhere above town. -->
   - `[face]` `[court]` The court holds that a toll taken at the bar may be argued before it, and that the arguing costs more than the toll.
   <!-- seat: Courthouse 0.6 at town, Multiple courthouses required at city and metropolis; the court speaks, no court record is cited. -->
   - `[face]` The gate and the men on it are paid for out of one purse. The taverns pay the toll on every cask that comes through the bar, whichever purse it ends in.
   <!-- BARE FACT + THE BILL (ruling 32): the cost landed on the taverns, a row every preimage tier holds; the second sentence keeps the open question open ("whichever purse"). Untagged on purpose; not the stranger's. -->

   NOTES for the selector (kept off the rows until the cars land):
   - weighing, pair 1 (car 18i): `[archiver · pair 1 · weigh]` It may be that both are right, and the coin is paid once at the bar and counted again at the hall.
   - weighing, pair 2 (car 18i): `[archiver · pair 2 · weigh]` Which of the two is right is argued in the town, and the arguing has not moved the toll.
   <!-- both weighings OPEN; neither favours the hall or the guild; variant 3's weighing leans the other way so no source is favoured across the block. -->
   - observed (car 18n): `[archiver · observed]` At dusk the bar goes down across the way in and a soldier stands beside it.
   - observed, alternate (car 18n): `[archiver · observed]` The bar coming down at dusk is heard in the nearest houses.
   <!-- the physical particular for this variant (ruling 31): a thing seen, or the alternate, a thing heard. "at dusk" is lawful (the card: no rate word). Both are true wherever hasGates and a garrison stand; neither infers into a silence a required row denies. -->
   - public (car 18n): `[public]` Everyone in the town has seen the bar go down at dusk with a soldier beside it, and takes it that the town is kept.
   <!-- the seeing is true on every preimage town; "kept" is what the town makes of it and may be mistaken. -->
   - notebook, dm-only, shade CLARITY, feeling clarity: The soldiers are paid and there is no roll of them anywhere this office can point to: whoever pays them is the only one who counts them.
   <!-- the engine's own fact (holdersOf('muster') is empty on every native town of this key); no count, no office named. -->
   - notebook, dm-only, shade CONJECTURE, feeling curiosity: What the bar takes and what the hall says it has are counted by two hands, a soldier's and a clerk's… nobody has laid the two side by side, and it would be worth knowing why not.

2. `[visitor]` A stranger is stopped at the bar before he is anywhere else in the town, and the man who stops him is paid by the town to do it.
   <!-- spine shape 2 of 3: THE STRANGER carries it, one sentence; the card's own order (stopped first, counted second, admitted third), written at the bar and not at a wall. -->
   - `[face]` `[stranger]` A pedlar says his pack was opened at the gate and nothing was taken from it but the toll.
   - `[face]` `[stranger]` A drover says the bar was the first thing he paid for here and the tavern the second.
   - `[face]` `[gate · pair 1 · disagree]` The men on the bar say a stranger pays the bar, and the bar settles with the hall in its own time.
   - `[face]` `[hall · pair 1 · disagree]` A clerk in the hall says a stranger who pays at the bar has paid the town, whatever the men at the bar tell him.
   <!-- pair 1 joinable: "The men on the bar say a stranger pays the bar and the bar settles with the hall in its own time, though a clerk in the hall says a stranger who pays at the bar has paid the town." -->
   - `[face]` `[gate]` The gatekeepers say a stranger is asked where he is from and what he carries, and that the second answer is the one that costs him.
   - `[face]` `[garrison]` One of the soldiers says he can tell a carter from a stranger by how far from the bar the cart stops.
   <!-- the telling particular: the distance is a habit, not a measurement, and no number is in it. -->
   - `[face]` `[watch]` One of the watch says a stranger who comes in at dusk is the soldiers' to stop and the watch's to find later.
   - `[face]` `[guild]` A guild factor says a stranger pays at the bar once and a factor pays there with every load, and that the soldiers are politer to the stranger.
   - `[face]` `[tavern · pair 2 · aside]` At the tavern they say the soldiers drink with strangers more readily than with carters, since a stranger has not argued the toll with them.
   - `[face]` `[register · pair 2 · aside]` The sexton says a stranger who dies here is buried by the parish and the toll he paid is not returned.
   <!-- pair 2 is an ASIDE: two unrelated notices on the same state (a stranger at the bar), from the tavern and the parish; no weighing on an aside. The register face is the dry note. -->
   - `[face]` `[market]` In the market it is said that a stranger's load is looked at closely at the bar and a known one less so.
   - `[face]` `[elders]` One of the elders holds that a stranger ought to be met by the town and not by the town's soldiers, and that the bar is where the town lets its soldiers meet him instead.
   <!-- seat: Town council opt 0.9, TOWN ONLY. -->
   - `[face]` `[court]` The court holds that the toll can be argued before it by anyone who paid it, a stranger as much as a carter.
   - `[face]` A stranger pays at the bar once. The inns pay it on every load that reaches them and charge him for it a second time.
   <!-- BARE FACT + THE BILL: landed on the inns (Inn (multiple) required at town, Inns and taverns (district) at city and metropolis). Untagged on purpose; not the stranger's. -->

   NOTES for the selector:
   - weighing, pair 1 (car 18i): `[archiver · pair 1 · weigh]` Which of the two holds the coin longer is a matter of talk in the town, and it is not settled here.
   - observed (car 18n): `[archiver · observed]` A stranger's cart stops short of the bar and is not waved on.
   <!-- the physical particular for this variant: the cart, stopped. True wherever the way through is controlled; no inspection asserted, so it holds on a Town walls town whose gate row says only "control who enters". -->
   - public (car 18n): `[public]` It is common knowledge here that a stranger pays at the bar before he pays anywhere else, and the town counts that as the soldiers earning their wage.
   - notebook, dm-only, shade HEARSAY, feeling unease: It is said at the tavern that a stranger's toll is whatever the soldier names, and the tavern would say that. What the bar takes is in no book this office has been shown.
   <!-- "has been shown" runs over the archiver's own presence (ruling 11); the note does not assert that no book exists, since a toll-bar holder can resolve at town. -->
   - notebook, dm-only, shade CONJECTURE, feeling worry: It is to be hoped that the men on the bar are not tempted to name a stranger's toll by his coat… a soldier who is paid to count is not paid to guess.

3. `[street]` Everyone in the town has seen the bar down and a paid man beside it, and takes it that the town could be held.
   <!-- spine shape 3 of 3: THE PUBLIC carries it, one sentence: what everyone saw (true on every preimage town) and what everyone makes of it (a perception, licensed to be mistaken). No {settlement}. -->
   - `[face]` `[stranger]` A traveller says nobody in the town looked at the bar as he was stopped at it, and that he took the not looking for confidence.
   - `[face]` `[gate]` The men on the bar say the town is glad of them at dusk and tired of them by the time the market opens.
   - `[face]` `[garrison]` One of the soldiers says the town would rather be kept than see the keeping, and that the bar is where it has to see it.
   - `[face]` `[watch · pair 2 · reinforce]` One of the watch says the town thanks the soldiers for the days and the watch for nothing, since the watch is out when the town is asleep.
   - `[face]` `[tavern · pair 2 · reinforce]` At the tavern the soldiers are talked of as men who owe for drink, and not as the reason the town sleeps.
   <!-- pair 2 joinable, reinforce: "One of the watch says the town thanks the soldiers for the days and the watch for nothing, and at the tavern the soldiers themselves are talked of as men who owe for drink." Both say the town does not thank its keepers; two stakes, one direction. -->
   - `[face]` `[hall · pair 1 · disagree]` A clerk in the hall says the town's confidence is a thing the purse pays for, and that the purse is not thanked for it.
   - `[face]` `[guild · pair 1 · disagree]` A guild factor says the trades pay at the bar for the confidence the rest of the town has for nothing.
   <!-- pair 1 joinable: "A clerk in the hall says the town's confidence is a thing the purse pays for, though a guild factor says the trades pay for it at the bar and the rest of the town has it for nothing." -->
   - `[face]` `[market]` A stallholder says the town sleeps well because of the bar, and that the granary is the half of a siege nobody at the bar has counted.
   <!-- the granary is required at every preimage tier; the siege arithmetic is the machine row's own ("Not rated for sustained siege without significant supply stockpiles"). No level of the stores is asserted. -->
   - `[face]` `[register]` The sexton's view is that the town's confidence is well founded, and that the parish keeps ground ready in case it is not.
   <!-- the dead are not placed relative to the gate. -->
   - `[face]` `[elders]` One of the elders says the town counts the bar as its own and the men on it as hired, and that the council keeps the difference in mind.
   <!-- seat: Town council opt 0.9, TOWN ONLY. -->
   - `[face]` `[court]` The court holds that a town that feels held argues less, and that the toll is still argued.
   - `[face]` The town sleeps behind a bar it does not look at. The households pay for the sleeping in whatever the toll adds to the price of what comes through it.
   <!-- BARE OBSERVATION-SHAPED FACT + THE BILL: landed on the households (Housing required at every tier). Untagged on purpose; not the stranger's. If the selector reads the first sentence as an observation rather than a fact, it belongs under NOTES with the observed line below and the bill stands alone. -->

   NOTES for the selector:
   - weighing, pair 1 (car 18i): `[archiver · pair 1 · weigh]` The hall's account is the likelier of the two, a factor counting every toll as a loss whichever purse it fills.
   <!-- a LEAN, with its reason drawn from the other source's stake (ruling 22); it opens and does not close. Variant 1's two weighings are neutral, so the hall is not favoured across the block. -->
   - weighing, pair 2 (car 18i): `[archiver · pair 2 · weigh]` On this the two agree.
   - observed (car 18n): `[archiver · observed]` Nobody who lives here looks at the bar as they pass it.
   <!-- the physical particular for this variant is an absence: the bar, unlooked at. A bare passive-shaped observation with no observer named. -->
   - public (car 18n): `[public]` It is common knowledge here that the soldiers are paid, and the town takes it that paid men stay.
   <!-- the seeing (the soldiers are paid) is the key's own fact; "paid men stay" is the town's perception, and the engine's own model (men drifting off under a short purse) is what makes it a hook. -->
   - notebook, dm-only, shade UNSURE, feeling unease: The town is surer of the soldiers than the soldiers seem to be of the town… whichever of the two is right, the bar is where it is decided.
   - notebook, dm-only, shade CONJECTURE, feeling hope: If the confidence is well placed, the bar holds, the toll is counted honestly and the town keeps its temper: that is the better reading, and there is nothing yet on this page against it.

<!-- COUNT (verified by script): 3 spine lines · 41 face sub-rows on the rows (15 + 14 + 12, of which 3 are bare facts carrying the bill and 12 are pair halves) · under NOTES 18 further candidates: 5 weighings, 4 observed, 3 public, 6 notebook notes · 59 candidates in all. The script also confirmed no digit, em dash, semicolon, exclamation mark, contraction, forecast, size word, "wall", "{settlement}", "the survey", "the record" or "this office" in any player-page sentence; "this office" appears only in the notebook notes. -->
<!-- ATTRIBUTION VERBS USED, for the three-in-a-row veto: says · say · holds · the view is · it is said at · in the market it is said · at the tavern they say · the sexton's view is · the court holds. No verb three times running within a variant's row order. -->
<!-- SHAPES, per ruling 29: subject first (most accounts) · place first ("At the tavern…", "In the market…") · time first ("At dusk the bar goes down…") · object fronted ("The gate and the men on it are paid for…") · attribution last (none; the archiver's hand puts the source first, as the pack's exemplars do) · the entry form (the bare facts) · the bare observation (under NOTES). Long beside short in every variant. -->
