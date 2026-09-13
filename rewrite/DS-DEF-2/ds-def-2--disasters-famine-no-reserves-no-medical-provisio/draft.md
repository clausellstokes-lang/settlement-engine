# DRAFT — DS-DEF-2 · `Disasters & Famine: NO reserves, NO medical provision`

selector: Fable 5.1 (the taste seat, ADDENDUM 18 ruling 8) · 2026-09-13 · for the Fable chair
read whole: `rewrite/recut/EXEMPLAR-PACK.md` · this pool's `card.md` (mechanical (1)-(7) and the marker's (7)-(9)) · the shipped rows at `f2da5a3ee` and the current rows (identical, three lines, no faces, no dm-only) · `candidates-1.md` (writer 1 of 2 · seat Opus 5 · lens THE TELLING PARTICULAR) · `candidates-2.md` (writer 2 of 2 · seat Fable 5.1 · lens THE SOCIAL POSITION and THE WITHHELD REASON) · and, read-only in the dock, `src/domain/display/stateProse/faceSources.js` and `stateProseKernel.js` for what actually seats on this preimage.
STATUS: COMPLETE. Rows chosen below; every held candidate and every refusal is under NOTES.

---

## THE ROWS

**`Disasters & Famine`: NO reserves, NO medical provision**
1. `[ledger]` No granary stands here and no house is kept for the sick. The grain is ground on somebody else's stone.
   - `[face]` `[elders · pair 1 · disagree]` The older households say a place this size has no call for a granary. <!-- joinable -->
   - `[face]` `[stranger · pair 1 · disagree]` A drover says a place this size is exactly where one would be wanted. <!-- joinable: ", though a drover says …" -->
   - `[face]` `[market]` Grain is bought here to eat and not to keep, in the account of those who sell at the market.
   - `[face]` `[register]` Those who bury the dead hold that they are sent for when the bread stops coming to a door, and not before.
   - `[face]` `[tavern]` At the tavern they say a sack is weighed by whoever grinds it and weighed again by whoever owns it, and the difference is the standing argument.
2. `[street]` It is common knowledge here that there is no granary to go to and no sick-house to be carried to, and the town does not count either as a lack.
   - `[face]` `[elders · pair 2 · disagree]` The older households say a sick house here is never left to itself. <!-- joinable -->
   - `[face]` `[tavern · pair 2 · disagree]` At the tavern they say the houses that are sat up with are the houses that have sat up with others. <!-- joinable: ", though at the tavern they say …" -->
   - `[face]` `[stranger]` The bread left on a step is how a sick house is known from the lane, a traveller reports.
   - `[face]` `[market]` At the market they say a house with somebody ill in it comes for vinegar and roots, and that whoever has them names the price.
   - `[face]` `[register]` Those who bury the dead say they are the one trade here that is sent for in a bad year and not thanked for coming.
3. `[visitor]` A stranger who asks here for the granary is shown a field, and one who asks for the sick-house is shown a door.
   - `[face]` `[stranger]` The sacks that leave a house for the stone are counted going and not counted coming back, by a carter's reckoning.
   - `[face]` `[tavern]` At the tavern they say a stranger who asks for the sick-house is taken for the sick, and served at the door.
   - `[face]` `[elders]` What a stranger calls a want is only how the place is arranged, in the older households' account, and they do not say who arranged it.
   - `[face]` `[register]` Those who bury the dead say part of the plot digs easily and part does not, and that everybody here knows which is which.
   - `[face]` `[market]` Those who sell at the market say a buyer can have grain here on a market day and no place to keep it.

---

--- NOTES

### THE ROSTER AS IT ACTUALLY SEATS (read in the dock, `faceSources.js`, not from the card alone)

- `stranger` and `elders` resolve on every town of the preimage (the elders by tier: thorp, hamlet, village). These are the two universal seats; a thorp with nothing rolled hears these two and the spine, and that is the law, not a defect.
- `tavern` resolves where a row names `tavern` or `alehouse` or `inn`: the hamlet's `Alehouse` (0.55) seats it; ⚠ the village's `Ale house` (0.80) does NOT (`institutionRoles.js` says so by name: `TAVERN_NAMES` spells `alehouse` and the catalogue carries both rows). So the tavern is heard on roughly half the hamlets and on no village unless one rolls an inn. Both writers assumed the village's ale house seats it; the faces are written so that nothing turns on it.
- `register` resolves where a row names a church, temple, abbey, monastery or friary and does not begin with the exclude prefix (`Access to …`): the village's `Parish church` seats it; ⚠ the hamlet's `Access to parish church` and the thorp's and hamlet's `Burial ground` do NOT. The card's mechanical (7) seats the register on `Burial ground` at thorp; the kernel does not. Both writers wrote every register face as *those who bury the dead* on the card's word, so the faces are true wherever they draw (a village has a graveyard, required). Flagged to the chair: the card's instrument and the kernel disagree on this seat, and the kernel is what renders.
- `market` resolves on `Periodic market` (0.12 hamlet) and `Weekly market` (0.60 village).
- Four card sources have NO word in the closed vocabulary and were held out of the rows: the households who farm, whoever grinds the grain, those who draw the water, the reeve, those who treat the sick. Their voice is carried where the vocabulary allows: the elders are written as *the older households* by both writers (the marker's own phrase), so the households' stake reaches the page through that seat; the mill reaches it through the tavern's and the stranger's accounts of the stone. The untokened candidates worth routing are listed further down.
- `compromised` is REFUSED on this pool (card (2c): no covert field marks it). No such candidate was offered by either writer and none is kept.

### THE COUNT

Five seats per variant (stranger · elders · register · tavern · market), one face per seat, no seat doubled: in variants 1 and 2 two of the five seats are the halves of a marked pair, so the pair IS those sources' one face each. Fifteen faces, three spines. The pin is `1 + FACE_SOURCES.length` (fifteen, a ceiling) and no variant approaches it. Variant 3 carries no pair, on purpose (see THE FRAME RULES below).

### PER FACE — speaker · candidate (packet and seat) · why it won

Variant 1, spine: packet 2 (Fable 5.1). Two bare engine facts and a stop: the granary and the hospital reads, then the required mill row as the household meets it (`Access to external mill` / `Mill`, home grinding barred by the row's own text, so the stone is always another's). Packet 1's spine added *and the stone takes its share*, a fact the engine does not hold stated in the archiver's own hand, which is the archiver claiming knowledge (ruling 40): refused for that clause. Shape: the subject first, negative.
- elders (pair 1, disagree) · packet 1 (Opus 5) · the elders' stake in one clause, a place defending its own arrangement; a single clause that reads after *though*.
- stranger (pair 1, disagree) · packet 1 (Opus 5) · the actual contrary: the same premise, the opposite conclusion. A real disagreement, so the kind stands. Both halves are universal seats, so this pair renders on every town of the preimage, thorps included.
- market · packet 2 (Fable 5.1) · the market's one stake (grain is not bought against the year) in the fewest words, the attribution last so the variant's verbs do not run. Judged: *to eat and not to keep* is a contrast that carries a fact, not the empty antithesis the tell list names.
- register · packet 2 (Fable 5.1) · who is owed and when, in the buriers' own interest, and it invents nothing the record denies (a neighbour's bread at a sick door is a custom, not a row). Preferred over packet 1's *they write nothing down* (a no-record claim the register's own seat, a village with a `Records` service at p 0.5, could contradict) and over packet 2's *their work does not slacken in a bad year*, which is true of any town.
- tavern · packet 1 (Opus 5) · the complaint that carries the fact, the stake and a voice at once: the miller's share as the standing argument, with *whoever grinds it* and never the miller. Preferred over packet 2's *whoever grinds the grain eats in a bad year and everyone else counts*, which costs a second reading on *counts*.

Variant 2, spine: packet 2 (Fable 5.1). The public carries this spine (ruling 29: a spine may be carried by the public), and the second half is the perception the card's own §9 names as the hook: the place does not experience the absence as a lack. Packet 1's spine (*No granary was ever raised here…*) permutes spine 1's opener and its closing clause (*Nobody here has ever put the question*) is a bare assertion of the town's behaviour in the archiver's hand: refused on the assembly veto and on ruling 40.
- elders (pair 2, disagree) · packet 1 (Opus 5) · the elders' pride, one clause. Judged: not a reassurance close in ruling 34's sense (a writer comforting a reader); it is one side of a dispute the tavern half contradicts on the page, and if it is read as a reassurance it is the pool's one honest untagged reassurance, on a matter no field settles.
- tavern (pair 2, disagree) · packet 1 (Opus 5) · the contrary: care is reciprocity, not custom. A real disagreement. The pair number is the writer's own (pair 2 of the packet's variant 2; its pair 3 was dropped, see refusals) and is kept exactly.
- stranger · packet 2 (Fable 5.1) · THE POOL'S ONE PHYSICAL PARTICULAR (ruling 31 as the brief rations it): a thing seen from the lane, the object fronted, the attribution last. Preferred over packet 1's *the sick here are behind the same doors as everyone else*, which is lawful and plain but describes where this notices.
- market · packet 1 (Opus 5) · the sick-house side from the one seat with a price in it: consonant with the plague-onset machine string (price gouging on medicines) without asserting an outbreak, and consonant with the village apothecary row. Judged under ruling 31: vinegar and roots are the goods of the market's own trade, the thing its stake makes it notice (pack §1), not a second witnessed particular; the refuter's presence measure may count them and it refuses nothing.
- register · packet 2 (Fable 5.1) · the buriers' grievance, sized to their standing: sent for and not thanked. Preferred over packet 1's *nobody stands between the house and the ground*, which on the register's only seat (a village, with a resident priest whose life ceremonies are at p 1) reads as a denial of a required service.

Variant 3, spine: packet 2 (Fable 5.1). The stranger's conditional, and the card's own image (§9: a stranger asks where the stores are and is shown a field); one sentence; a root-cellar thorp is not contradicted, since the question about the granary still gets a field. Packet 1's spine (*Nothing is built here to hold either it or the sick*) denies the thorp's `Communal root cellar` (0.25), which the card's (8) says to write around: refused on floor 1.
- stranger · packet 2 (Fable 5.1) · the withheld reason on the mill's share, the attribution last (*by a carter's reckoning*), so the pool's three stranger faces stand in three frames (a drover says · a traveller reports · by a carter's reckoning). Displaced by this choice: packet 2's bill line (*the house behind the door is the one that pays…*), which is as good and reads straight after the spine's door, but opens *A drover says* a second time in the pool; held below.
- tavern · packet 2 (Fable 5.1) · the dry note: the asker taken for the sick and served at the door. Nothing asserted about an outbreak; a plot before the line ends.
- elders · packet 2 (Fable 5.1) · the object fronted, the attribution in the middle, and the reason withheld twice (what a stranger calls a want, and who arranged it). Preferred over packet 1's *the question worth asking is whose field lies nearest the water*, which is a riddle at a glance.
- register · packet 1 (Opus 5) · the one odd particular, unexplained (pack §14), from the one body this pool requires that gets busier when the key bites; no placement of the ground is asserted. The alternate, packet 2's *Nobody but a stranger asks those who bury the dead how many they bury…, and they keep no count*, is lawful and in the visitor's stance and is held below.
- market · packet 2 (Fable 5.1) · RETAGGED from `[market · pair 2 · aside]` to plain `[market]`: the tavern half of that aside (*a stranger asking after the granary is taken for a buyer*) added nothing the market half did not, and the kept tavern face of this variant is the stronger tavern line, so the survivor stands alone as the brief licenses. Preferred over packet 2's *A stranger buys grain here by the sack and carries it off the same day*, which would open on *A stranger* directly under a spine that opens on *A stranger*.

### THE FRAME RULES, as applied

- Attribution verbs in reading order: v1 say · says · (in the account of) · hold · say; v2 say · say · reports · say · say; v3 (by … reckoning) · say · (in the … account) · say · say. No verb three times running. No two faces of one source in one frame: the stranger's three are *a drover says* / *a traveller reports* / *by a carter's reckoning*; the elders' three are *The older households say* (twice, in two variants, as pair halves) and *in the older households' account*; the register's three are *hold that* / *say* / *say*; the tavern's are all *At the tavern they say*, the seat's own idiom, and no two are adjacent in one variant.
- Opener classes in reading order: v1 subject · subject · object fronted · subject · place; v2 subject · place · object fronted · place · subject; v3 object fronted (the sacks) · place · object fronted (a what-clause) · subject · subject. No run of three. Spines: the subject first (negative) · the public's *It is common knowledge here* · the stranger's conditional: three shapes.
- Variant 3 carries no pair because its candidates are subject-heavy and every tavern and elders line there opens on *say*: any placing of packet 2's stranger/elders disagree pair (*the want of a granary is the first thing seen from the road* / *it is not a want and not the town's to explain*) beside a third face made either three *say*s running or three subject openers running. The two lone faces kept (the elders' *What a stranger calls a want…* and the stranger's sacks line) carry the same dispute in two frames. The pair and its weighing are held below in case the chair prefers the pair; it is the model form of ruling 22's lean.
- No two adjacent faces share a frame; no variant sits on one grammatical subject (v1: households, drover, grain, buriers, the tavern; v2: households, the tavern, the bread, the market, buriers; v3: the sacks, the tavern, a want, buriers, sellers).
- The pool's spines never use the survey's clause; nothing on the page says *the survey*, *the record*, *this office* or *entered as*. `{settlement}` appears nowhere: 0 units.
- Rations: ONE physical particular (v2 stranger, the bread on the step) · ZERO consequence faces kept (the bill line is held, below; *at most* one is the rule) · ONE observed candidate and TWO weighings at most, both held under NOTES until cars 18n and 18i land.
- Long beside short: v1 runs from a fourteen-word pair half to a twenty-seven-word tavern line; v2 from a thirteen-word pair half to a twenty-five-word market line; v3 from a twenty-one-word stranger line to a twenty-six-word elders line. Counted by word after the tag, comments stripped.

### HELD — the weighing (ruling 22; car 18i NOT YET LANDED; never into the rows today)

- weigh | variant 1 | pair 1 | It may be that the place has never been asked for more than it can give, and that the stranger is describing a year that has not come. <!-- packet 1 (Opus 5); a conjecture that opens; no self-naming; no forecast (a year that has not come is a description, not a will) -->
- weigh | variant 3 | pair 1 (the held pair, below) | The households' account is the likelier here, a pedlar counting a place without a store as a place with nothing to buy. <!-- packet 2 (Fable 5.1); a lean with its reason drawn from the OTHER source's stake, which is the licensed form; kept only if the chair seats the held pair -->
- REFUSED weighing: packet 1's for its pair 2 (the pair kept in v2): *The tavern's is the likelier of the two, a house that has been sat up with having more reason to remember it than one that has not.* The lean's reason is about who remembers, not the elders' stake; ruling 22 licenses a lean only with its reason drawn from the other source's stake. The v2 pair stands without a weighing.
- REFUSED weighings: packet 2's *On this the two agree* (its v1 pair 2, not kept) and *Which is nearer the truth is argued here, and it is not settled* (its v2 pair 1, not kept): lawful forms, orphaned by the pairs not seating.

### HELD — the observed face (ruling 27; car 18n NOT YET LANDED)

- observed | variant 1 | `[archiver · observed]` No door in the place is marked for the sick. <!-- packet 1 (Opus 5); bare passive, no observer, true on every town that draws the key (no hospital row), and denies no required row's service -->
- alternates, not kept (one per pool at most): packet 1's *No room in any house here has been given over to the sick alone* (a durative over the frozen `hasHospital`, lawful) and *The path to the water is worn wider than the road out of the town* (a measurement-comparison; a second particular); packet 2's *Grain goes out of the houses by the sack and comes back by the sack, lighter, and nobody at the water remarks on the difference* (two claims, the second a claim about everyone's behaviour) and *A stranger asking here for the sick-house is sent to a door, and the door is a house like the others* (restates spine 3).

### HELD — the public (ruling 28; car 18n NOT YET LANDED)

- public | variant 1 | `[public]` Anyone here can name the field the grain comes off and the house it goes into, and the town takes that for a store. <!-- packet 1 (Opus 5); the seeing is true, the perception is the hook -->
- public | variant 3 | `[public]` Anyone here can point a stranger to the field where a granary would stand if there were one, and the town counts the pointing as an answer. <!-- packet 2 (Fable 5.1) -->
- variant 2: none held, because the kept spine is already the public's (*It is common knowledge here…*); a public face there would seat the public twice on one variant.
- not kept: packet 1's *Everyone here has seen a sack go to the stone and come back lighter, and the town counts the difference fair* (a second particular on the mill's share) and *It is common knowledge here that the sick are nursed in the house they live in…* (the spine's frame again); packet 2's *Anyone here can say at once which house a sick person is in, since there is no place for the sick but a house…* (a *since* clause explaining the beat before it) and its v1 public on the sack coming back lighter (the same particular a third time).

### HELD — the untokened sources (the card seats them; the vocabulary has no word)

For the chair to route to a token, to the public, or to a car. Offered in face syntax by the writers; the best of each:
- households · packet 1 · The households say the seed kept back for the next sowing is the last thing eaten and the first thing argued over. <!-- the strongest untokened line in either packet; the elders' seat could carry it as *the older households say* if the chair rules that the households' stake and the elders' seat are one -->
- households · packet 2 (v1) · No granary stands here. The want of one, by the households' account, is paid by whichever house has the worst harvest, and by no other. <!-- the bill on a Dwellings row; two sentences; never paired -->
- mill · packet 2 (v2) · Whoever grinds the grain holds that the talk at the water is talk, and that nobody who talks has offered to grind their own. <!-- the resented seat answering; home grinding barred by the row -->
- mill · packet 1 · Whoever grinds the grain says the share is the share, and that anybody who wants it written down may write it down themselves.
- reeve (conditional: `Lord's reeve` 0.30 thorp · `Lord's steward` 0.55 hamlet / 0.30 village · `Village reeve` 0.92 village) · packet 2 · The reeve, collecting the lord's share, says the share is fixed and the harvest is not, and that neither is the reeve's doing. <!-- the archaic word shown doing its work (ruling 20); the outside claim on the harvest, the only stake on this pool that runs against the town's -->
- those who treat the sick (conditional: `Midwife` 0.50 · `Apothecary` 0.45, village) · packet 2 · A woman who knows which roots bring a fever down says she is sent for after the neighbours stop coming, and is paid in bread. <!-- a person, never the healer; the key denies the row, not the woman -->
- water · packet 1 · Those who draw the water say the buckets come back full and the talk comes back with them. <!-- a figure (talk coming back with buckets) by the research's veto; recorded, not recommended -->

### HELD — the notebook (ruling 17)

The pool's shipped rows carry no `dm-only` row and the card marks no covert field, so there is no hard state for a note to carry and nothing the notebook may settle. RECOMMENDATION: add no `dm-only` row to this pool. If the chair wants one, the two notes from packet 2 (Fable 5.1) that pass the clarity test and point at something the fair copy leaves open:
- shade unsure · feeling surprise · For a place with no granary and no sick-house, nobody here asks a stranger for either… it is possible the want is met somewhere that does not show, a cellar under somebody's floor, a woman who knows roots. Or it is possible the place has not yet been asked for more than it has. <!-- points at conditional rows the card names without seating them -->
- shade clarity · feeling eagerness · The sacks are counted going to the stone and not coming back, and there is only the stone between, and whoever keeps it. If the difference is ever wanted, that is where to ask for it, and it would be worth the asking. <!-- sits beside the kept v3 stranger face -->
- not recommended: packet 2's hearsay note (*It is said at the water that the bread stops at a door once the sickness in it is named…*) circles a custom the kept rows do not carry (the v2 pair on the bread was not seated), and its conjecture note on a private store under a floor edges toward asserting a store the key's neighbour rung would hold.

### HELD — page-worthy candidates displaced by the rules, for the chair's swap if wanted

- v3 stranger, packet 2 · A drover says the house behind the door is the one that pays for the want of a sick-house, with a hand kept back from the field. <!-- the bill, landed on a required row; displaced only by the stranger-frame rule (a second *A drover says*); the chair may swap it for the sacks line, which would then move the mill's share out of v3 -->
- v3 stranger, packet 2 · A pedlar says nobody here thinks of the want of a granary until a stranger asks after one. <!-- plain and engaged; the same frame rule -->
- v3 pair, packet 2 · `[stranger · pair 1 · disagree]` A pedlar says the want of a granary is the first thing seen from the road. / `[elders · pair 1 · disagree]` The older households say it is not a want and not the town's to explain. <!-- joinable; both seats universal; displaced by the verb-run and opener-run rules as set out above; its weighing is the licensed lean, held above -->
- v3 register, packet 2 · Nobody but a stranger asks those who bury the dead how many they bury in a bad year, by their own account, and they keep no count.
- v2 stranger, packet 1 · A stranger says the sick here are behind the same doors as everyone else, and that nobody tells a visitor which doors.
- v2 elders, packet 2 · A bad year is met house by house, in the older households' account, and a granary would only make it the town's quarrel. <!-- displaced because the elders' v2 seat went to the pair -->
- v2 tavern, packet 2 · At the tavern a carter says the town would sooner bury a neighbour than carry one to a sick-house it would have to pay for. <!-- who pays; displaced because the tavern's v2 seat went to the pair -->
- v1 elders, packet 2 · The older households say a granary would want a key, and do not say whose hand they would not trust it to. <!-- the withheld reason; displaced because the elders' v1 seat went to the pair -->

### REFUSED, with the ground (the selector's veto list, never a refuter's finding)

- packet 1 v1 elders · *nothing was ever built here for the keeping of anything* · denies the thorp's `Communal root cellar` (card (8): write around it).
- packet 1 v1 register · *they write nothing down, and that the remembering falls to the households* · a no-record claim on the register's only seat, where a `Records` service may be on; and *the remembering* is an abstraction.
- packet 1 v1 stranger · the cart that is paid for · two sentences, and *the place the grain is put says the only answer anyone gave was a cart* costs a second reading.
- packet 1 v2 register · *nobody stands between the house and the ground* · reads as a denial of the resident priest's life ceremonies on the seat where the register draws.
- packet 1 v2 pair 3 (register / stranger, reinforce) · *nobody here is kept for the tending of the sick* · the village keeps a resident priest whose row carries `Healing` at p 0.7; and the stranger half restates spine 3.
- packet 1 v3 elders · *whose field lies nearest the water* · a riddle at a glance (clarity first, ruling 29d).
- packet 1 v3 tavern · *a stranger asks where the stores are and a neighbour asks who is short* · a balanced pair of two askers; concrete, but the tavern's seat in v3 went to the stronger line.
- packet 1 v3 market and pair 4 (elders / market) · *what a place this size has is whatever somebody carried in* · a clever last beat answering the beat before it.
- packet 2 v1 stranger · *whoever asks after the granary here is shown a field* and pair 2 (stranger / register, reinforce) · both restate spine 3's image; the register half (*the field is the town's store*) is a figure.
- packet 2 v1 elders · *A sick-house … would only gather the sick under one roof, and they leave it at that* · the tail explains the beat before it.
- packet 2 v1 pair 1 (elders / tavern, disagree) · *the harvest is each house's own* / *the stone has its share of a harvest before the house does* · a real disagreement and a good one, but v1's elders and tavern seats went to packet 1's pair and tavern line, which carry the same dispute with the miller's share in the tavern's own weighing image; held as the alternate pair for v1 if the chair prefers a disagreement about whose the harvest is over one about whether a granary is wanted.
- packet 2 v2 pair 1 (elders / tavern, disagree) · the bread brought and the bread stopping · a real disagreement, but it would put the bread custom on four faces of the pool (v1 register, v2 stranger, both halves); the v2 seats went to packet 1's pair on the sitting-up.
- packet 2 v2 pair 2 (register / stranger, view) · *a bad year shows first at the grave* / *first at the water, in who is not there* · a fine view pair; not seated because both seats were already taken in v2 and seating it would double two sources.
- packet 2 v2 register · *paid in kind, bread and a share of the goods … not asked to the table afterwards* · *a share of the goods* is ambiguous (whose goods) at a glance.
- packet 2 v2 market · *nobody here buys grain against a bad year, only for the next baking* · a near-paraphrase of the kept v1 market face.
- packet 2 v3 elders · *a stranger asking for a sick-house is asking to put the sick out of the house, and that it is not done here* · lawful and good; the v3 elders seat went to the object-fronted line for the opener mix.
- packet 2 v3 market · *A stranger buys grain here by the sack and carries it off the same day* · opens on *A stranger* under a spine that opens on *A stranger*.
- packet 2 v3 pair 2 tavern half (aside) · *a stranger asking after the granary is taken for a buyer* · added nothing its market half did not; the market half is kept, retagged plain.
- No candidate in either packet spent a digit, an em dash, a semicolon, an exclamation mark, a date, a count, a rate, a first person or `{settlement}`; none named the town inside a face; none gave a speaker a memory over a live field (the one perfect kept, *the houses that have sat up with others*, is a source's opinion about custom and runs over no engine field, and is noted here for the refuter's eye).

### WORTH KEEPING

Fifteen faces and three spines are seated. Of the writers' candidates, twenty-three were genuinely worth the page: the fifteen seated, plus eight displaced by the rations and the frame rules and held above (the bill line, the *nobody thinks of the want* line, the v3 disagree pair with its lean, the buriers' *keep no count* line, the *same doors* line, the *town's quarrel* line, the *granary would want a key* line, the *bury a neighbour* line). No seated source lacked a candidate worth the page; the seat with the thinnest bench was the market, whose three kept faces carry one stake (grain is not kept) in three constructions and one different stake (the price of vinegar and roots). The households and whoever grinds the grain had page-worthy candidates and no seat.

### FOR THE CHAIR

- The dock's annex already carries, on `Invasion & War: walls with NO force`, role slots (`{elders} {v:keep}`), an `[archiver · observed]` row and a `[public]` row inside the rows. This draft keeps the class words and holds observed, public and weigh under NOTES as the brief directs; if the chair converts this pool at the same car as that one, the held rows above are ready to promote.
- Physical particular reading applied (ruling 31 as the brief states it, one per pool): the bread on the step is the pool's witnessed particular; the sack, the stone, vinegar and roots are the nouns of the sources' own trades. If the refuter reads the ration as counting every concrete noun, the vinegar line (v2 market) is the one to swap, and packet 2's *nobody here buys grain against a bad year, only for the next baking* is its plain replacement.

SEATS: packet 1 (Opus 5) 7 faces · packet 2 (Fable 5.1) 8 faces and all 3 spines · 15 faces, 3 spines, 18 rows kept.
