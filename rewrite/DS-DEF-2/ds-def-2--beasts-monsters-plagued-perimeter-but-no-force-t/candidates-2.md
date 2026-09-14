# CANDIDATES — writer 2 of 2 · seat Opus 5 · block DS-DEF-2

**Pool key:** `Beasts & Monsters: plagued, perimeter but NO force to hold it`
**Lens:** THE SOCIAL POSITION (who pays, who is owed, who is resented; the source's stake shows in what it calls a fact) + THE WITHHELD REASON (the fact set down plainly, the reason not given).
**Voice:** the master archiver's hand. A fact the engine holds stands bare; every account names its source.

---

## THE CONSTRAINTS THIS PACKET WAS WRITTEN AGAINST (the writer's own working list, from the card)

- **The cure for the pool's characteristic breach.** The key fixes no garrison, no militia, **no soldiers of its own, no company** — it does NOT fix "nobody to man it". At town a `Town watch` is required with Night patrol (p 1) and Gate duty (p 0.8), and the military pay gate reaches it. So this packet never writes *nobody on it*, *nobody to hold it*, *nobody is paid to stand on it*, *nobody is under arms*, *no post is assigned*, *the guard*. It writes **no soldiers · no company · nobody whose whole work it is · nobody was asked**.
- **One purse (F4-02 / V-17).** Never *the wall is kept and the men are not paid*, never *spent on repair rather than on holding*. Money lines in this packet are about **who bears the cost and who is owed**, never about the size or state of the gate — `defenseProfile.economicGates.military` is OPEN and prints beside this row.
- **No material** (`Palisade` at thorp against `Town walls` at town): the perimeter is **the line**, **the works**, **the way through**. No `{defmaterial}`, no stakes, no stone, no material source.
- **No tier word inside a face** (the preimage is thorp AND town): *here*, *the place*, *the households*, never *the village* and never a bare *the town*.
- **The citation ceiling on this pool is ZERO** — no toll book, no roll, no register-as-a-record, no accounts, no "from the road". Every account is attributed by role and nothing else. *The purse* is a thing, not a record, and is kept.
- **Durative licence:** lawful over the walls / garrison / militia buckets (the key's own reads) and over `config.monsterThreat` (frozen). **Refused over `institutions[bucket=watch]`** — nothing here says *the watch has kept the gate since*.
- **`plagued` is MONSTERS, not disease**, and the place is not cowed (a sibling string can call the guard drilled and alert).
- **No `compromised` candidate is offered**: card §2c records this pool is not one of the pools a compromised hall, watch or court is marked on.
- **Not a speaker anywhere here:** the muster, the militia, the garrison, the crown's assessor. No face asserts that nobody musters (the thorp `Household levy` collision, W-02).

### SEATS — which tier resolves which source

| source | seat on this preimage |
|---|---|
| `stranger` | universal (always resolves) |
| `gate` — those who hold the way through | universal on the shipped catalogue (marker's judgment, card §7, vetoable) |
| `register` — **written as "whoever buries the dead"** | universal (`Burial ground` at thorp, `Parish burial grounds` at town). The word *parish* / *sexton* is TOWN-ONLY and is used in exactly one candidate, marked. |
| `elders` | **thorp only** (below town the governing body is a household or elder consensus, never a room) |
| `hall` · `tavern` · `guild` · `watch` · `market` · `court` | **town only** (`Town hall` · `Taverns (5-20)` · `Craft guilds (5-15)` · `Town watch` · `Market square`/`Weekly market` · `Town hall` seats `hasCourtSystem`) |

⚠ **A pair must resolve whole**, so no pair in this packet crosses the tiers: `elders` is paired with nothing, and every pair is either two town-only sources or a town-only source with a universal one. ⚠ **The hall and the court are ONE ROW at town** — no candidate here contrasts them as two bodies.

---

## VARIANT 1 — `[ledger]` · THE COST AND WHO CARRIES IT

1. `[ledger]` The country around {settlement} is thick with creatures and the line around the place is kept up. The place keeps no soldiers.
   - `[face]` `[stranger]` A traveller says the work on the line is better kept than the place looks able to keep it, and that nobody he asked would name who pays.
   - `[face]` `[gate]` Those who hold the way through say the bar is what they answer for, and that nobody has asked them to answer for the rest of the line.
   - `[face]` `[hall]` The hall calls the keeping of the line the first charge on the common purse, and says the purse buys the line and not a company.
   - `[face]` `[hall · pair 1 · disagree]` A clerk in the hall says the keeping of the line is paid out of the common purse and falls on everyone alike. <!-- joinable -->
   - `[face]` `[guild · pair 1 · disagree]` The guilds say the trades carry the most of it and have nothing standing on the line for the money. <!-- joinable · seat: town -->
   - `[face]` `[guild]` The work on the line is let out in the season when the trades have hands to spare, the guilds say. The households that send the hands see nothing back for them. <!-- THE BILL (ruling 32); two sentences, so unpaired · seat: town -->
   - `[face]` `[watch · pair 2 · disagree]` The watch says what its people do at the way through is work and not a favour. <!-- joinable · seat: town -->
   - `[face]` `[tavern · pair 2 · disagree]` At the tavern they say the ones at the way through do it because they live nearest and for no other reason. <!-- joinable · seat: town -->
   - `[face]` `[watch]` The watch says its people have other work in the daytime, and that the line gets whatever is left of them. <!-- seat: town; "part-time guards" is the row's own word, F1-27 kept -->
   - `[face]` `[register]` Whoever buries the dead says the country takes what it takes, and does not say whether the line has changed that. <!-- universal wording -->
   - `[face]` `[register]` The parish says the ones the country takes are buried at its own cost and mourned at the household's. <!-- seat: TOWN ONLY (the word "parish") -->
   - `[face]` `[market]` Stallholders say the market pays its share where it stands, and that the share buys the line and never soldiers. <!-- seat: town -->
   - `[face]` `[court]` The court says the line reaches it as a dispute between neighbours over work owed, and in no other form. <!-- seat: town; Dispute arbitration p 0.8 -->
   - `[face]` `[elders]` The elders say the households behind the line have always kept it, and that which of them keeps which part is settled among themselves. <!-- seat: thorp; durative over the walls read, ruling 11 -->

---

## VARIANT 2 — `[visitor]` · THE WAY THROUGH, AND WHAT IS ASKED THERE

2. `[visitor]` Travellers report good work along the line here and no soldiers on it. They ask at the way through what keeps the creatures off, and they are given the line for an answer.
   - `[face]` `[stranger]` A drover says the bar was down when he reached it and up again behind him, and that the one who lifted it went back to another trade.
   - `[face]` `[gate]` Those who hold the way through say the road is theirs as far as they can see down it, and that what comes off the country comes without notice.
   - `[face]` `[hall]` A clerk in the hall says there is one way in and that the common purse keeps it, and calls that enough. <!-- seat: town -->
   - `[face]` `[tavern · pair 3 · reinforce]` At the tavern they ask a stranger about the road before they ask his business. <!-- joinable · seat: town -->
   - `[face]` `[gate · pair 3 · reinforce]` Every carter tells those who hold the way through what the road was like before they are asked for it. <!-- joinable -->
   - `[face]` `[stranger · pair 4 · view]` A pedlar says nobody here asked where he had come from, only what the road was like.
   - `[face]` `[watch · pair 4 · view]` The watch says what it wants from a stranger is the road behind him and not his business. <!-- seat: town -->
   - `[face]` `[guild]` The guilds say the trade comes in by the one way and goes out by it, and that the keeping of the way is charged to the trade at both ends. <!-- seat: town -->
   - `[face]` `[register]` Whoever buries the dead says the ones taken on the road are carried in by whoever came upon them. The carrying falls on the finder, and nobody makes it good. <!-- THE BILL; two sentences, unpaired; universal wording -->
   - `[face]` `[market]` Stallholders say a stranger's goods are looked over at the way through and priced again once they are inside. <!-- seat: town -->
   - `[face]` `[court]` The court says a stranger stopped at the way through can bring the matter before it, and that stopping him is nobody's decision to explain. <!-- seat: town -->
   - `[face]` `[elders]` The elders say a stranger who comes in after dark is let through without a question, and the question keeps until morning. <!-- seat: thorp -->

---

## VARIANT 3 — `[unfolding]` · WHO GOES OUT, AND WHO WAS NEVER ASKED

3. `[unfolding]` The country outside the line is not quiet. The line is kept up, the place keeps no company of its own, and nobody here gives a reason.
   - `[face]` `[stranger]` A traveller says he asked here who keeps the line and was answered differently by everyone he asked.
   - `[face]` `[gate]` Those who hold the way through say the ones who walk the line after dark are the same ones, and that they do not come to the bar to be counted.
   - `[face]` `[hall]` Nobody has come to the hall asking for a company, a clerk there says, and the purse does not pay for what nobody has asked for. <!-- seat: town -->
   - `[face]` `[watch · pair 5 · disagree]` The watch says it has said what it is short of, and said it to the hall. <!-- joinable · seat: town -->
   - `[face]` `[hall · pair 5 · disagree]` A clerk in the hall says nothing about the line has come to it in a form it can act on. <!-- joinable · seat: town -->
   - `[face]` `[watch]` The watch says the nights are stood by people who are wanted elsewhere in the daytime. What that costs is paid by their own households and by nobody else's. <!-- THE BILL; two sentences, unpaired · seat: town -->
   - `[face]` `[tavern]` At the tavern the standing argument is which households go out to the line and which have found reasons not to. <!-- seat: town -->
   - `[face]` `[tavern · pair 6 · view]` At the tavern they say the ones who go out to the line are owed by everyone who stays in. <!-- seat: town -->
   - `[face]` `[court · pair 6 · view]` The court says a household that sends nobody to the line can be brought before it, and that the bringing is where the matter ends. <!-- seat: town -->
   - `[face]` `[guild]` The guilds say they would pay for a company if the paying stopped there, and that it never does. <!-- conditional, not a forecast · seat: town -->
   - `[face]` `[market]` Stallholders say the stalls come down while there is still light, and that nobody has ever said they must. <!-- seat: town -->
   - `[face]` `[register]` Whoever buries the dead says what the country takes is buried with everyone else, and that no one asks for the ground to be kept apart. <!-- universal wording -->
   - `[face]` `[elders]` The elders say the same households have always gone out to the line, and that nobody can say who settled that. <!-- seat: thorp; durative over the walls read -->

---

# NOTES — candidates the projector refuses today, offered for the selector

## (a) THE PUBLIC (ruling 28; car 18n NOT LANDED) — one per variant

What everyone SAW binds under floor 1 in full; what everyone MAKES OF IT is the shared perception and may be mistaken. Plural roles only, no power's stake.

- variant 1 · `[public]` Everyone here has seen the line kept up and no soldiers along it, and the place takes that for an arrangement somebody decided on.
- variant 2 · `[public]` Everyone here has seen the bar go down at dusk without anybody being told to drop it, and the place counts the way through kept.
- variant 3 · `[public]` Anyone here can name the households that go out to the line, and the place counts the line held because of it.

*(The third is the cleanest hook of the three: what was seen is true, and what is made of it is the town's own reading and the game master's to overturn.)*

## (b) THE ARCHIVER OBSERVED (ruling 27 as re-cut by 40; car 18n NOT LANDED) — one per variant

Bare passive, no observer named, no *the survey*, no *this office*, no elapsed number. At most one per rendered variant.

- variant 1 · `[archiver · observed]` The ground outside the line is kept clear and nothing has been let grow into it.
- variant 2 · `[archiver · observed]` The bar at the way through is worn smooth where hands take it. <!-- the physical particular, ruling 31 -->
- variant 3 · `[archiver · observed]` The mending on the line is newer in some places than in others, and nobody has been named for any of it.

## (c) THE ARCHIVER'S WEIGHING (ruling 22; car 18i NOT LANDED) — offered on the disagree pairs only

Each opens and none closes. No *the office*, no *this record*.

- **pair 1** (hall / guild) — It may be that both are right, and the purse is filled by everyone and spent where the trades can see it.
- **pair 2** (watch / tavern) — Which of the two it is the place has not settled between them, and it is not settled here either. <!-- ⚠ "here" reads as the place, not the document; if the selector hears the document in it, the shorter form is: The two do not agree. -->
- **pair 5** (watch / hall) — It may be that both are telling it straight, and what the watch said was not said in the room where the purse is decided.
- **pair 3** (tavern / gate, reinforce) — usually nothing at all; where it is taken: The two say the same thing from opposite ends of the road.

## (d) THE NOTEBOOK — `dm-only` offers, one per variant

No covert field marks this pool, so none of these concludes: the notebook suspects and the question stays open. Third person, two sentences at most, the notebook's devices only, no digit, no em dash, no forecast. Shades and feelings spread.

- variant 1 · **conjecture / curiosity** · Nobody has ever been asked to stand on the works, and nobody at the hall seems to think that a question… it may be that asking it would settle who has been paying for the keeping all along. It would be worth knowing who answers first.
- variant 2 · **unsure / unease** · Nothing anybody said at the way through was wrong. That is the part of it that sits badly: every one of them answered for the bar and not one of them for the rest of the line.
- variant 3 · **hearsay / eagerness** · It is said at the tavern that the same households go out and always have, and the tavern would know them by name. If the going out is owed rather than offered, then whoever settled the owing can be asked, and it would be worth the asking.

*(Clarity test on each: what the note suspects and what could come of it are both sayable in one breath. Floor 2 holds — no sum, no count, no date. The `dm-only` mark itself is the selector's to set; these are offered as notebook text only.)*

---

# THE WRITER'S SELF-SCAN

- No `{settlement}` in any face; it appears in one unit only (spine 1).
- No digit, no em dash, no exclamation mark, no semicolon, no contraction anywhere.
- No *will* or *shall* before a verb. Two conditionals (`would pay`, in the guild's V3 face) and one in the weighing register (`it may be`).
- No named record of any kind — the citation ceiling on this pool is zero.
- No named office as a face's subject and none as an attribution: *the hall* / *a clerk in the hall*, never *the mayor* or *the clerk*; *the elders* plural, never *the elder*; no *guard captain*, no *high priest*.
- No wall material, no material source, no decay clock and no permanence on the fabric.
- No tier noun inside a face.
- Duratives used: *have always kept it*, *have always gone out to the line* (over the walls read, the key's own), *has been seen*-class forms avoided on the watch entirely.
- Three spines, three shapes: the bare fact (1), an account carried by a source (2), the fact plus the withheld reason (3).
- Tells checked and absent: no which-clause closer, no summarising close, no antithesis pair, no reassurance (and none is licensed here, no `compromised` face being offered), no clever last beat, no copula dodge, no evaluator adjective, no bare *it is said* (the one use names the tavern).
- One physical particular offered per variant (the ground kept clear · the bar worn smooth · the newer mending), and one BILL per variant (the guild's hands · the finder's carrying · the watch's households).
