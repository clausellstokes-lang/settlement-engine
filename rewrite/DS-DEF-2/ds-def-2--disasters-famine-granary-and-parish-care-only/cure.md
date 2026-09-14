CURER (seat: Opus 5 — a different author from the writers) · block DS-DEF-2 · pool `Disasters & Famine: granary AND parish care only`
Base: the selector's draft at draft.md. Five targets named by the refuter (refute.md). Every untargeted face is byte-identical to the draft.

## THE ROWS

1. `[ledger]` Grain is kept in store here. No house is kept for the sick, and the parish does the tending.
   - `[face]` `[hall · pair 1 · reinforce]` A clerk in the hall says the store is the town's to keep and not the town's to open.
   - `[face]` `[market · pair 1 · reinforce]` Those who sell at the market say the store takes no part in the price of the loaf.
   - `[face]` `[watch]` The church door stands open at night, one of the watch says, and the store door does not.
   - `[face]` `[register]` A local priest says the store has a door and a lock. The tending has neither.
   - `[face]` `[guild]` The guilds say the store is no use to a man who cannot work, and the trades carry that loss themselves.
   - `[face]` `[tavern]` At the tavern they say one hand holds the key to the store, and that nobody at the table knows the hand.
   - `[face]` `[gate]` One of those on the gate says a cart carrying for the store goes through ahead of a cart carrying for a stall.
   - `[face]` `[garrison]` The garrison says the store is the one thing here worth standing in front of, and that standing in front of it is nobody's order.

2. `[street]` Everyone here has seen the store door and nobody here has seen it stand open, and everyone here knows that a sickness in a house is answered by whoever the parish sends.
   - `[face]` `[register · pair 1 · disagree]` A local priest says the tending falls to the parish and is paid for by nobody.
   - `[face]` `[hall · pair 1 · disagree]` A clerk in the hall says the tending is what a parish is for, and that the purse has no line in it for a parish.
   - `[face]` `[tavern]` At the tavern they say the one who comes to sit up and the one who comes to dig are the same trade.
   - `[face]` `[market]` Those who sell at the market say a household with somebody ill in it comes late and buys small, and that the stalls know a sick house sooner than the parish.
   - `[face]` `[guild]` A guild factor says the hands that stay at home with a sick house are hands the trade is short. Nobody makes that good.
   - `[face]` `[watch]` On the round, one of the watch says, a house with somebody ill in it is known by the door left on the latch.
   - `[face]` `[stranger]` A traveller says that asking after the sick here gets a person and asking after the grain gets a building.
   - `[face]` `[court]` A clerk who hears the town's disputes says a quarrel between neighbours over who sat up last comes before the hall.

3. `[visitor]` A drover says the town looks provided for from outside, and that whoever tends a sick house here comes out of the church.
   - `[face]` `[register]` A local priest says a stranger asks for a house and is given a person, and that nobody born here asks for the house.
   - `[face]` `[market]` Grain is hard to keep here, those who sell at the market say, for anybody without a door of their own in the town.
   - `[face]` `[tavern]` At the tavern they say strangers walk up to look at the store, and that nobody here does.
   - `[face]` `[watch]` Strangers ask the watch where the grain is kept, the watch says, and nobody has ever asked it where the sick are.
   - `[face]` `[guild]` A guild factor says what a stranger takes for provision is a store the trades filled and cannot open.
   - `[face]` `[court]` Those who hear disputes say a stranger's questions about the store are ordinary and the ones about the sick are new to them.

--- NOTES

### THE FIVE TARGETS — what was cured, and with what

**v1 · face 1 · hall · FLOOR 2 (magnitude) · CURED, the refuter's own cure taken verbatim.**
was: *A clerk in the hall says the store is kept full and not kept open.*
now: *A clerk in the hall says the store is the town's to keep and not the town's to open.*
The proportion is gone and nothing replaces it: the sentence now asserts only WHOSE the store is and what the town does not do with it, and neither is a quantity. `Town granary` carries `Grain storage` on p 1.0 and `Milling service` off p 0.5 (institutionServices.js:1429-1431) — no opening, releasing, rationing or distribution service sits at or above the bar on the row this key fixes, so *not the town's to open* denies nothing the engine's own menu says this body does. It remains ONE CLAUSE and still joins: *A clerk in the hall says the store is the town's to keep and not the town's to open, and those who sell at the market say the store takes no part in the price of the loaf.* The pair stays `reinforce` and stays `joinable`. No detector in `CLAUSE_DETECTORS` reads the new clause (`keeps` is not `keep`; `is kept (here|in)` is gone with the old wording), so the variant's move sequence is unchanged.

**v2 · face 0 · spine · FLOOR 2 (magnitude, aggravated as a public face) · CURED, with a declared deviation of three words — see below.**
was: *Everyone here has seen the store kept full, and everyone here knows that a sickness in a house is answered by whoever the parish sends.*
now: *Everyone here has seen the store door and nobody here has seen it stand open, and everyone here knows that a sickness in a house is answered by whoever the parish sends.*
The refuter's seeing clause is taken WORD FOR WORD. What everyone has seen is now a thing (a door) rather than a proportion, and the durative runs over no field at all instead of over `economicState.foodSecurity.storageMonths`, which `foodStockpile.js:297,406` moves. Card (2b′) clears the negation: `Town granary`'s NOT-SEEN list is `Grain storage` alone, and a door not seen standing open is no claim about whether grain is stored.
⚠ **THE DEVIATION, DECLARED FOR THE CHAIR TO VETO.** The prescribed cure closes on the perception half — *and the town takes that for provision* — and in doing so drops the spine's second clause, which the refuter itself passed. I kept the passed clause instead. Ground: this key fixes TWO facts (a granary, and parish care with no house for the sick), the spine is the only line of the variant guaranteed to render, and a spine that says nothing about the tending would sit exactly as comfortably on the sibling rung `Disasters & Famine: granary, NO medical provision` (ruling 35, card §2d). The finding named was the unbanded proportion; the care clause was not the finding, and the brief's own instruction is to cure the finding and nothing else. The perception half is lawful and good and is recorded here so a chair can prefer it: *Everyone here has seen the store door and nobody here has seen it stand open, and the town takes that for provision.* No third shape was attempted — one sentence, three clauses, and the public's anaphora carries it.

**v2 · face 8 · court · FLOOR 1 (a service at or above the bar denied) · CURED, the denial inverted; the prescribed sentence's last four words not taken — see below.**
was: *…a quarrel between neighbours over who sat up last is not a thing the hall can settle.*
now: *A clerk who hears the town's disputes says a quarrel between neighbours over who sat up last comes before the hall.*
`Town hall` → `"Dispute arbitration": { on: true, p: 0.8, desc: "Bring commercial and civil disputes before a magistrate." }` (institutionServices.js:1625), and at city `City hall` → `"Appeals court": { on: true, p: 0.8 }` (:1631). The face now says what that service does and denies nothing. The speaker and the frame are the draft's, untouched.
⚠ **WHY NOT THE PRESCRIBED CLOSE.** The prescribed cure ends *…comes before the hall like any matter of trade*. That lands on `trade`, and the variant's tavern face already lands on `trade` (*the one who comes to sit up and the one who comes to dig are the same trade*) — and both faces are about sitting up with the sick. Four faces draw per page, so the two can co-render, and the collision is the same class of fault the refuter's own craft section names in this very variant (two faces landing on `parish`). Rather than cure one finding by making a second one worse, I dropped the comparison: the shorter candidate stops sooner, lands on `hall` (a noun no other face in the variant closes on), and the restraint is the archiver's own — the fact, and then the stop.

**v3 · face 0 · spine · THE CITATION LAW (F1-24, the mechanical gate) · CURED, the refuter's own cure taken verbatim.**
was: *A drover says the town looks provided for from the road, and…*
now: *A drover says the town looks provided for from outside, and that whoever tends a sick house here comes out of the church.*
Verified against the detector rather than recalled: `moveGrammar.js:225`'s PROVENANCE alternation is `the (treasury|watch|parish|market|court|census|office)('s) (books|roll|rolls|register|registers|count|ledger|ledgers)` · `the (muster|toll) (roll|rolls|books|register)` · `the elders (say|hold|remember|keep)` · `the tradition (says|holds|remembers|keeps)` · `from the road`. *from outside* appears in that alternation and in no other detector — not GEOGRAPHY (`the road (to|from)`, `the pass`, `the coast`, `the way in`), not OBJECT, not HISTORY. The corpus's citing-variant count therefore stays at the 7 the walker asserts at `tests/lint/proseMoveGrammar.walker.test.js:856-859`, and the packet is no longer refused whole. The rest of the spine, including the CONSEQUENCE clause *comes out of the church*, is byte-identical, so the variant's move sequence is otherwise unchanged.

**v3 · face 2 · market · FLOOR 1 (a same-page field denies it at a value the keys admit) · CURED, the refuter's own cure taken verbatim.**
was: *Grain is easy to buy here and hard to keep, those who sell at the market say, for anybody without a door of their own in the town.*
now: *Grain is hard to keep here, those who sell at the market say, for anybody without a door of their own in the town.*
The buying is gone and with it the clause a famine or a siege banner on the same page would make absurd (`config.stressTypes` is read by none of the five key functions; at `famine` the page prints safetyProfile.js:128). What survives is the half the refuter called the good half: a household with no storage of its own cannot hold what it buys, which is the key's own asymmetry and is true under every stress the page can carry. The object-fronted opener and the attribution-inside frame are kept, so the variant's opener mix is unchanged, and the face still lands on `town`, a noun no other face in the variant closes on.

### REFUSED TARGETS — none

All five targets were cured. Three take the refuter's prescribed sentence word for word (v1/1, v3/0, v3/2); two carry a declared deviation of a few words each, both recorded above with the ground and with the prescribed wording kept verbatim beside them so the chair can overturn either without re-reading the packet.

### WHAT WAS NOT TOUCHED, DELIBERATELY

- **The WITHHELD unit (v3 · face 5 · guild, *a store the trades filled and cannot open*)** is not a target and stands byte-identical. The refuter withheld rather than failed it and offered a cure only *if the chair agrees* (move the completed act into the present: *a store the trades fill and cannot open*). That is the chair's call, not the curer's, and it is left standing and flagged here.
- **The craft collapse in variant 2** (five sick-house phrasings; two faces landing on `parish`) is not a target and no face was re-cut for it. It is untouched except that the court face, which the refuter did fail, no longer adds a sixth collision.
- **The three WIRING rows** (W1 the card's stockpile census is wrong; W2 `storageMonths` is on the page and in no line of the read set; W3 the PROVENANCE detector's road kind is invisible to the card) are instrument defects, not face defects. Nothing in this packet repairs them and they remain the chair's to queue — W1 and W2 are what produced two of the five findings above, and W3 is what produced a third.
- Everything held under the draft's own NOTES — the two weighings, the three public candidates, the one observed candidate, the four notebook notes — is unchanged and stays under NOTES until cars 18i and 18n land. None of them was a target, and none of them carries the cured faults: the public candidate for variant 1 (*has seen the store filled and nobody here has seen it emptied*) is the one item there that touches the stock, and a chair taking it up should read it against finding v2/0 first.

### THE SCAN ON THE CURED ROWS (executed over this file, not recalled)

- 3 spines · 22 faces · 10 distinct sources · 0 units carrying `{settlement}`.
- No em dash, no en dash, no exclamation mark, no digit, no semicolon, no contraction. The apostrophes are possessives.
- Ruling 40: no self-citation token anywhere — no *the survey*, *this office*, *the record*, *entered as*, *set down here*, *so far as*. The bare statements remain engine facts only (spine 1 whole; the second sentence of the v1 register face). Every account still names its source through a role, and no cured face names a record.
- F1-24: no record is cited anywhere by name or as a generic, and the one citation the pool carried is gone.
- Floor 1: nothing raises the care to the hospital rung and nothing denies a service at or above the bar — the cured court face now affirms the one that was denied. The words *hospital*, *infirmary*, *ward*, *beds* and *physician* appear nowhere.
- Floor 2: no count, no date, no season, no rate, no magnitude in words. The two proportions the refuter found are gone, and the cures introduced no new durative over a live field: *has seen the store door* and *has seen it stand open* run over no engine field, where the struck *has seen the store kept full* ran over `storageMonths`.
- Floor 3: no minted name and no named office as subject or attribution. *A clerk who hears the town's disputes* is a role, not the magistrate the service description names.
- **The diff, executed:** the two files were parsed to 25 units each and compared unit by unit. FIVE units differ and they are the five targets; the other twenty are byte-identical, brackets included.
- **The detectors, executed, not recalled:** all twelve `CLAUSE_DETECTORS` regexes from `moveGrammar.js:200-236` were run over both files' 25 units. Draft: 10 matches, of which PROVENANCE 1 (the v3 spine). Cured: 9 matches, PROVENANCE **0**. Every other unit's match set is identical, and no cured clause gained a match. The citing-variant count the walker asserts at `:856-859` is therefore untouched. Checked individually against ABSENCE (`nobody has` requires the literal pair; *nobody here has* does not match), OPEN (`stands open`; *stand open* does not match), INSTITUTION (the verb list is `keeps|holds|takes|…|hears|…`; *keep*, *say* and a sentence-final *hall* do not match), TRADITION (`is kept (here|in)`, which the v1 cure removes), CONSEQUENCE, HISTORY, GEOGRAPHY, OBJECT and PERSON.
