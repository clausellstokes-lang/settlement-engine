# candidates-2.md — DS-DEF-2 · `Invasion & War: force with NO walls` · writer 2 of 2 (seat: Fable 5.1)

<!-- STATUS: COMPLETE. Written 2026-09-13 in one pass; the checkpoint law was honoured by writing the whole packet at once rather than a stub. -->
<!-- lens: THE SOCIAL POSITION (who pays, who is owed, who is resented; the source's stake shows in what it calls a fact) and THE WITHHELD REASON (a fact set down plainly, the reason not given). -->
<!-- voice: the master archiver's hand (ADDENDUM 18 ruling 13a). A recorded fact stands bare; every account names its source; the temperament is the default, exact. -->
<!-- read: EXEMPLAR-PACK.md · the pool's current rows (identical to the shipped rows at f2da5a3ee) · card.md. Nothing else. -->

## The roster this packet writes for (from the card, section 7)

- UNIVERSAL on every preimage town (the preimage is ONE tier, town 13/128): `stranger` · `hall` (Town hall) · `tavern` (Taverns, Inn) · `guild` (Craft guilds) · `register` (Parish churches, Parish burial grounds) · `watch` (Town watch, required) · `garrison` (FIXED TRUE by the key; at town the row is `Barracks`, housing inside the town, services Military escort and Guard hire) · `market` (Market square, Weekly market, Town granary) · `court` (card section 5: TRUE on every preimage town, seated by the Town hall; every court face below is written with NO courthouse building, trial, sentence or gaoling, so it holds whether or not the optional Courthouse row stands).
- CONDITIONAL, seat named on the tag line's comment: `gate` (seat: the `Gates (if walled)` row, baseChance 0.5, no wall dependency; the toll book and a person on the bar resolve only there) · `elders` (seat: the `Town council` row, required false, 0.9).
- NEVER: `muster` (SOURCE-UNRESOLVED on every native preimage town; no roll is cited anywhere below; the class word is not used either) · the crown's assessor · any named office (no mayor, no captain, no priest, no commander; the soldiers are always a plural).
- COMPROMISED candidates: NONE OFFERED. The card's covert section (2c) marks hall, watch and court as compromisable on OTHER pools and says of this one, three times, "this pool is NOT one of them — here the source draws as any source." No `[<source> · compromised]` line is lawful here, so none is written.
- The settlement name slot: nowhere in this packet, spine or face. The town is "the town" or "here".
- The gate trap (F1-08) is written around: no face asserts free entry, no face denies a bar; the stranger is stopped by "a person", which is true with a toll bar and without one. The absence written is the LINE, never a door.
- The purse: no face splits the one military line (F4-02), no face sets the watch and the soldiers in a pay order (F4-03), no face says nothing is paid (F4-04), and no face asserts a pay band, since the economic gate is open on this key; where pay is spoken of it is the structure (one line, all wages, two bodies on it) or a source's opinion.

---

**`Invasion & War`: force with NO walls**

1. `[ledger]` The town keeps paid soldiers and no wall. They can meet a raid in the open and cannot hold a siege, because there is no line to hold.
   <!-- spine shape: the bare fact, two sentences, the archiver's own hand; the second sentence is the engine's own reading on every preimage town (threatAssessment.js:121) -->
   - `[face]` `[hall · pair 1 · disagree]` A clerk in the hall says the soldiers' day hire is the barracks' own trade and no charge on the town's purse. <!-- joinable; subject first -->
   - `[face]` `[guild · pair 1 · disagree]` A guild factor says the trades pay for the same men once through the purse and again by the day. <!-- joinable; reads after "though"; greed and grievance sized to a town guild -->
   - `[face]` `[archiver · pair 1 · weigh]` It may be that both are right, and the same man is paid for the same day out of two purses. <!-- OFFERED; the selector carries it under NOTES until car 18i lands; a conjecture that opens -->
   - `[face]` `[hall]` The hall holds that the military line here is wages and nothing else, since there is no wall on it, and that the accounts show as much. <!-- second hall candidate; the accounts are citable here (treasury resolves at town on Tax payment); attribution "holds", not "says" -->
   - `[face]` `[guild]` A guild factor says a soldier hired to stand at a stall is paid by the stallholder for the day. The trade that hires him has already paid for him once through the hall. <!-- THE BILL (ruling 32): the cost lands on a trade the roster holds; two sentences, so never paired -->
   - `[face]` `[tavern · pair 2 · reinforce]` At the tavern they say the soldiers and the watch drink at the same tables and are paid off one line. <!-- joinable; reads after "and"; place first -->
   - `[face]` `[watch · pair 2 · reinforce]` One of the watch says the watch keeps the night patrol after a day's work and is paid off the same line as men who have no other work. <!-- joinable; the watch is part-time with day jobs, the soldiers professional, one purse (F4-19); no pay order asserted -->
   - `[face]` `[archiver · pair 2 · weigh]` On this the two agree, and there is no cause to doubt them. <!-- OFFERED; under NOTES until 18i -->
   - `[face]` `[tavern]` At the tavern they say the hall pays the soldiers and the households pay for everything else. The households are not on the accounts. <!-- THE BILL, second offer for the variant: communityMilBase is exempt from the gate, so what the households do costs the hall nothing; the selector keeps at most one bill per variant -->
   - `[face]` `[watch]` The watch's view is that a purse shared with soldiers is a purse the watch does not set the terms of. <!-- second watch candidate; grievance, no order of payment asserted -->
   - `[face]` `[garrison]` The soldiers say raiders are their business and a siege is nobody's here, since there is nothing to hold. <!-- plural always; the engine's own reading in the soldiers' mouths -->
   - `[face]` `[garrison]` The soldiers say anyone with a cart to move or a door to keep can have one of them for the day, and the hall does not ask who. <!-- second garrison candidate; Military escort and Guard hire, the barracks' own menu; the withheld thing is who hires -->
   - `[face]` `[register]` The sexton says a soldier who dies here is entered in the register of the dead as anyone is, and buried in the same ground. <!-- the register of the dead resolves at town; a generic "who dies here", no event, no count -->
   - `[face]` `[register · pair 3 · aside]` The sexton says there is no wall for the burial ground to lie beyond, and so the question of inside or outside does not arise. <!-- aside pair with the market; no placement of the ground is stated -->
   - `[face]` `[market · pair 3 · aside]` At the market they say a stall stands in the open like everything else here, and a soldier hired to stand beside it is the only line it has. <!-- aside pair; Guard hire tied to the required square -->
   - `[face]` `[market]` At the market they say the granary is the one thing here worth a raid, and that the soldiers know where it is. <!-- second market candidate; the granary is required; a dry note, no placement -->
   - `[face]` `[court]` At the court they say a dispute over a soldier's hire is heard as any other wage dispute, and the hall is asked which purse the wage came from. <!-- court seated by the Town hall (Dispute arbitration p 0.8); no courthouse, no trial, no sentence -->
   - `[face]` `[gate]` At the toll bar they say a bar with no wall on either side of it collects a toll and keeps nothing out. <!-- CONDITIONAL, seat: the `Gates (if walled)` row; a gate is a point and not a line (F1-07) -->
   - `[face]` `[gate]` Whoever keeps the toll book says a stranger is asked his business at the bar, and the soldiers are not the ones asking. <!-- CONDITIONAL, seat: `Gates (if walled)`; Entry inspection p 0.8 on that row; second gate candidate -->
   - `[face]` `[elders]` The council says what the soldiers cost is on the accounts for anyone to read, and what they are for is not written anywhere. <!-- CONDITIONAL, seat: the `Town council` row; THE WITHHELD REASON in the council's own mouth -->
   - `[face]` `[stranger]` A traveller says nothing stopped him until a person did. <!-- one sentence; true with a toll bar and without one -->
   - `[face]` `[stranger]` A pedlar says he sold to the soldiers at his stall before anyone told him what they were. <!-- second stranger candidate; the soldiers among the town, not behind anything -->
   NOTES for the selector (kept off the rows until the cars land):
   - public: `[public]` <!-- ruling 28, car 18n --> Everyone in the town has seen where the soldiers are housed and that it is a house like the others, and takes it that the soldiers are the town's own. <!-- the seeing: the barracks row is housing inside the town; the making-of-it: a perception, which may be mistaken -->
   - observed: `[archiver · observed]` <!-- ruling 27, car 18n --> The soldiers have been seen buying at the weekly market like any household. <!-- the variant's one physical particular, SEEN; Weekly market General trade p 1; a bare passive, no observer named -->
   - dm-only, the notebook <!-- ruling 17 --> · shade CONJECTURE, feeling CURIOSITY: The guilds hire the same men the hall pays for, by the day. Which purse a soldier answers to on a given day is in no account at all, and it would be worth knowing before it matters.
   - dm-only · shade UNSURE, feeling UNEASE: The whole military line here is wages… nothing on it outlasts the men it pays. Whoever holds this office next should ask the hall what the town would keep if the barracks emptied, and the hall has not been asked.
   - dm-only · shade CONJECTURE, feeling HOPE: If the soldiers are used as the town uses them, for escort and for hire, then the town has a trade in them and not only a charge: that is the better reading, and worth holding to.
   <!-- no covert fact is hard state on this pool (card 2c), so every note above suspects without concluding and settles nothing -->

2. `[street]` It is common knowledge here that the town is kept by men and not by works, and that a man can be walked around.
   <!-- spine shape: carried by the PUBLIC, one sentence; the seeing (men, no works) is the key's own reads, the second clause is what the town makes of it -->
   - `[face]` `[hall · pair 1 · disagree]` The hall holds that paid men can be sent to where the trouble is and a wall cannot be. <!-- joinable; an opinion in the present, not a decision behind the roster (F4-02) -->
   - `[face]` `[tavern · pair 1 · disagree]` At the tavern they say anyone who wants past the soldiers has only to pick a street they are not in. <!-- joinable; reads after "though" -->
   - `[face]` `[archiver · pair 1 · weigh]` Both may be true at once, and which of them matters more is not settled here. <!-- OFFERED; under NOTES until 18i; a dispute left standing -->
   - `[face]` `[hall]` A clerk in the hall says the soldiers are the whole of the town's military charge and there is nothing else on that line. <!-- second hall candidate; the structure of the one line, no band asserted -->
   - `[face]` `[tavern]` At the tavern they say the soldiers are housed in the town and drink in it, and that a fight would come to the houses before it came to them. <!-- second tavern candidate; conditional, no forecast; the barracks is housing inside the town -->
   - `[face]` `[guild · pair 2 · view]` A guild factor says a soldier hired for the day stands where he is paid to stand, and the rest of the town is not his concern that day. <!-- view pair; a view pair renders on the full stop, so not marked joinable -->
   - `[face]` `[garrison · pair 2 · view]` The soldiers say there is no wrong direction here, so they stand where they are told and the rest is luck. <!-- view pair; the card's own "no direction that is the wrong one" -->
   - `[face]` `[guild]` The guilds say openly that they hire soldiers because a soldier can be told where to stand for the day. <!-- second guild candidate; Guard hire; the entry form -->
   - `[face]` `[watch]` One of the watch says the watch walks the streets at night after a day's work. The day's work is the watchman's own trade, and the trade is a hand short for it. <!-- THE BILL (ruling 32): the cost lands on the watchman's trade; two sentences, never paired; Night patrol p 1 -->
   - `[face]` `[watch]` One of the watch says a stranger who means harm has every street to choose from, and the watch has the same streets and the night to cover them in. <!-- second watch candidate, one sentence -->
   - `[face]` `[garrison]` The soldiers say they cannot be everywhere and are not paid to be, and the town does not tell them where to be instead. <!-- second garrison candidate; THE WITHHELD REASON from the other side; no officer as subject -->
   - `[face]` `[register · pair 3 · reinforce]` The sexton says the dead lie with no line between them and the road, the same as the living. <!-- joinable; reads after "and"; the edge, no placement of the ground beyond "no line" -->
   - `[face]` `[stranger · pair 3 · reinforce]` A drover says he was past the last house before he knew he was in the town. <!-- joinable; the edge from the road; asserts nothing about a bar -->
   - `[face]` `[archiver · pair 3 · weigh]` On this the two agree, and they have no stake in common to agree for. <!-- OFFERED; under NOTES until 18i; a confidence with its reason, not a verdict -->
   - `[face]` `[stranger]` A traveller says he passed the soldiers in the street as he would pass anyone, and was not sure until later that they were the town's. <!-- second stranger candidate -->
   - `[face]` `[market]` At the market they say a stall is open ground and a soldier beside it is not a wall, and thieves know it. <!-- the market's stake; no rate, no event -->
   - `[face]` `[court]` At the court they say the matters that reach it are about who was standing where, and none of them are about a wall. <!-- court seated by the Town hall; no courthouse, no trial -->
   - `[face]` `[gate]` Whoever keeps the toll bar says the bar can be walked around by anyone who knows the ground, and the toll is paid by those who do not. <!-- CONDITIONAL, seat: `Gates (if walled)`; THE SOCIAL POSITION: who pays is the stranger -->
   - `[face]` `[elders]` The council says the town has always kept men and not works, and is not asked why. <!-- CONDITIONAL, seat: `Town council`; the durative runs over the key's own reads (walls, garrison), lawful under ruling 11a; THE WITHHELD REASON -->
   NOTES for the selector (kept off the rows until the cars land):
   - public: `[public]` <!-- ruling 28 --> Everyone in the town has seen the soldiers walk the streets like anyone else, and takes it that whoever comes down the road meets them first. <!-- the seeing is true on every preimage town; the making-of-it may be mistaken, which is the hook -->
   - observed: `[archiver · observed]` <!-- ruling 27 --> The soldiers' washing has been seen hung out where anyone passing can see it. <!-- the variant's one physical particular, SEEN; housing inside the town; no row denies it; no observer named -->
   - dm-only · shade HEARSAY, feeling CURIOSITY: It is said at the tavern that the soldiers stand where the goods are and not where the houses are… the tavern would say that, and nothing here puts the soldiers anywhere in particular. <!-- ruling 39: "it is said" with WHERE named -->
   - dm-only · shade CONJECTURE, feeling CLARITY: A town watch with day jobs and a barracks of paid men, on one line of the accounts: whoever keeps that line decides, in a thin year, which body is paid first, and it is worth asking whether the watch knows who that is. <!-- conditional on a thin year; asserts no split and no band -->
   <!-- no covert fact is hard state on this pool, so neither note closes anything -->

3. `[visitor]` A traveller says he saw the soldiers before he saw anything they could stand behind, and that this decides where any fight would be.
   <!-- spine shape: carried by a SOURCE, the stranger, one sentence, the attribution first; "would be" is the conditional, not a forecast -->
   - `[face]` `[hall · pair 1 · disagree]` A clerk in the hall says where the soldiers stand is the barracks' own affair. <!-- joinable; short -->
   - `[face]` `[court · pair 1 · disagree]` At the court they say where a soldier stands is the hall's matter and not the barracks'. <!-- joinable; reads after "though"; court seated by the Town hall; nobody singular decides -->
   - `[face]` `[archiver · pair 1 · weigh]` It may be that neither wants it, since whoever decides where the soldiers stand decides where the fight is. <!-- OFFERED; under NOTES until 18i; a conjecture, and the reason drawn from both stakes -->
   - `[face]` `[hall]` The hall holds that a raid is a matter for the soldiers and a siege a matter for the granary, and does not say which it expects. <!-- second hall candidate; the granary is required and carries the page's own siege reading; THE WITHHELD REASON -->
   - `[face]` `[guild]` A guild factor says a raid that gets past the soldiers reaches the stalls next. The stalls are the guilds' and so would be the loss. <!-- THE BILL (ruling 32): lands on the trades; two sentences, never paired; conditional throughout -->
   - `[face]` `[guild]` A guild factor says the trades would pay toward a wall if they were asked, and nobody asks them. <!-- second guild candidate; a conditional wish, not a decision the roster ran; grievance sized to a town guild -->
   - `[face]` `[tavern]` At the tavern they say the soldiers know every street because they live on them, and a raider would have to learn them first. <!-- housing inside the town; conditional -->
   - `[face]` `[tavern]` At the tavern they say a stranger asks about the soldiers and nobody in the town asks about them at all. <!-- second tavern candidate; what the town has stopped noticing -->
   - `[face]` `[watch · pair 2 · reinforce]` One of the watch says the soldiers pick where they stand and the watch takes the rest, at night, after a day's work. <!-- joinable; reads after "and"; no magnitude on "the rest" -->
   - `[face]` `[garrison · pair 2 · reinforce]` The soldiers say a raid is met wherever they choose to meet it, and a siege is not met at all. <!-- joinable; the engine's own reading, a different sentence from variant 1's -->
   <!-- no weighing offered on pair 2: the reinforce needs none, and the block should not carry the same "there is no cause to doubt them" twice -->
   - `[face]` `[garrison]` The soldiers say they can be seen from the road and mean to be. <!-- second garrison candidate; one short sentence beside the long ones -->
   - `[face]` `[register · pair 3 · aside]` The sexton says there is no line for a fight to stop at, and no line for the burial ground to lie beyond either. <!-- aside pair; two absences, no placement -->
   - `[face]` `[market · pair 3 · aside]` At the market they say a raider would reach the stalls as easily as a customer does, and the soldiers know it. <!-- aside pair; conditional; the required square -->
   - `[face]` `[court]` At the court they say a quarrel over where a soldier stood is heard the same as a quarrel over where a cart stood. <!-- second court candidate; a dry note; no trial, no sentence -->
   - `[face]` `[gate]` At the toll bar they say the bar is where a stranger is asked his business, and the soldiers are not at the bar. <!-- CONDITIONAL, seat: `Gates (if walled)`; asserts nothing about who else inspects -->
   - `[face]` `[elders]` The council says the soldiers cannot be everywhere, and does not say where they should be. <!-- CONDITIONAL, seat: `Town council`; THE WITHHELD REASON; the council is a body, no office acts -->
   - `[face]` `[stranger]` A drover says the soldiers were the first thing he saw and the barracks the second, and that the barracks is a house like the others. <!-- the barracks row is "Housing for guards or small garrison"; the pack's "wall first, watch-house second" turned over -->
   - `[face]` `[stranger]` A traveller says he could see the soldiers from the road and could see nothing between the road and the houses that a raid could not walk past. <!-- second stranger candidate; a toll bar can be walked past, so this holds on both rosters -->
   NOTES for the selector (kept off the rows until the cars land):
   - public: `[public]` <!-- ruling 28 --> Everyone in the town has seen that the soldiers can be seen from the road, and takes it that being seen is what they are for. <!-- the making-of-it may be mistaken -->
   - observed: `[archiver · observed]` <!-- ruling 27 --> The soldiers' boots have been heard on the square on a market day before the men are seen. <!-- the variant's one physical particular, HEARD; Market square and Weekly market are required; no observer named, no rate -->
   - dm-only · shade UNSURE, feeling SURPRISE: The soldiers are the first thing a stranger sees and the last thing the town mentions… a barracks in a town this size, and nobody at the hall or the tavern brought the soldiers up until asked. Either the town has stopped seeing them or it has decided not to say what it sees. <!-- the durative runs over the archiver's own presence, licensed under ruling 11; "a town this size" names no number -->
   - dm-only · shade ACCUSATORY, feeling WORRY: It is to be hoped that somebody has decided where the soldiers stand, since the hall says it is the barracks' matter and the court says it is the hall's. If nobody has, the first raid decides it for them. <!-- conditional, no forecast; names no singular office; the clarity test: the suspicion is that nobody has decided, and what could come of it is a raid met nowhere -->
   <!-- no covert fact is hard state on this pool, so the notes suspect and do not settle -->

---

## The count

- Spines rewritten: 3 (bare fact · public · source), one per variant, each a different shape, the settlement name slot nowhere.
- Face candidates in the row syntax (`[face]` lines, including pair halves): variant 1: 22 · variant 2: 19 · variant 3: 18, so 59 in all. Of these, the archiver's weighings (`[archiver · pair N · weigh]`, offered and to be carried under NOTES until car 18i): 5. Face candidates with a closed-vocabulary source tag: 54, of which pair halves: 18 (nine pairs, three per variant; the kinds disagree, reinforce, aside and view all represented) and lone faces: 36.
- Bills (a second sentence landing the cost on a household, trade or office the roster holds): 4 (V1 guild, V1 tavern, V2 watch, V3 guild); the selector keeps at most one per variant.
- NOTES candidates (kept off the rows until cars 18n and 17 land): public 3 · observed 3 · dm-only notebook 7 (shades: conjecture ×3, unsure ×2, hearsay, accusatory; feelings: curiosity ×2, unease, hope, clarity, surprise, worry).
- Compromised candidates: 0, by the card's own word (this pool is not a marked pool).
- Total candidate lines offered (spines excluded): 59 face lines and 13 NOTES lines, 72 in all; 54 of them carry a closed-vocabulary source tag and are projectable today.
