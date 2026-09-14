# CURE — block DS-DEF-2 · pool `Internal Security: court without detention`

Curer seat: Opus 5 (a different author from the writers). One target was named by the refuter's
packet and by the chair: variant 1 face 10. It is cured. Every other row below is BYTE-IDENTICAL to
`draft.md`, the WITHHELD faces included — a withheld verdict is not a target and nothing was touched
on the chair's behalf.

---

## THE POOL'S CHOSEN ROWS

1. `[ledger]` {settlement} keeps a court and no room to hold anybody in. What the law here can take from a man is his money or his place in the town.
   - `[face]` `[watch · pair 1 · disagree]` The watch says what it comes across after dark is dealt with after dark, there being nowhere to leave a man until morning.
   - `[face]` `[court · pair 1 · disagree]` The court says it hears in the daylight what the watch settled in the dark, and that nobody asks it first.
   - `[face]` `[hall]` The hall says the purse does not run to a room and never has. It does not say who asked for one.
   - `[face]` `[market]` At the market a stallholder says a short weight goes before a magistrate and comes back as a sum, and that the scales it was weighed on stay on the stall.
   - `[face]` `[register]` A sexton holds that the parish has a place for a man once he is dead and the town has none for him while he is alive.
   - `[face]` `[guild]` A guild factor says a sum is paid out of a man's takings and forgotten, and that the mark taken off his work is not.
   - `[face]` `[tavern]` At the tavern they say a man with a house here pays and stays, and a man without one goes.
   - `[face]` `[stranger]` A pedlar says there is nothing here to take from a man who owns nothing in the town, and that the town has only the one thing left to do with him.
   - `[face]` `[gate]` At the gate they say they are given a man and a direction and no reason for either.
   - `[face]` `[garrison]` A soldier says what comes at the town is the garrison's business and the people walked out of it are not.
2. `[street]` Everyone in the town has seen a man brought in at one door and walk out by the same one, and the town takes it that nothing much was decided.
   - `[face]` `[tavern · pair 2 · disagree]` At the tavern they say a man who walks out the same day was never going to be kept, whoever heard him.
   - `[face]` `[court · pair 2 · disagree]` The court says a man walks out because there is nowhere to walk him to, and not because of what was decided.
   - `[face]` `[gate]` At the gate they say they are the last part of the town a man sees and the only part that was told to expect him.
   - `[face]` `[watch]` The watch says it is asked why a man is out again and has no answer to give that anybody takes.
   - `[face]` `[market]` At the market they say a man let go is at the stalls again, and the stall he took from is expected to serve him.
   - `[face]` `[hall]` The hall says a man heard here goes back to his own street afterwards, and that what his street does with him is nobody's business at the hall.
   - `[face]` `[stranger]` A pedlar's word is that the town names a sum he cannot find and then settles for the road, and that the road is the one he came in by.
3. `[unfolding]` A matter is heard here and nothing is built to keep the person it is heard about. A household that wants a man kept away from it does the keeping itself.
   - `[face]` `[watch]` One of the night patrol says the households that want a man kept off do their own keeping, and that the patrol knows which doors those are.
   - `[face]` `[hall]` The hall says the same fine is asked of a man with a shop and a man with a bundle, and that this is what fairness means here.
   - `[face]` `[market]` At the market a stallholder says a stall keeps its own eye on a man it has had trouble with. The eye costs the stall a pair of hands.
   - `[face]` `[court]` The court says it names what is owed and does not ask whether it can be got.
   - `[face]` `[tavern]` The man a household wants kept off drinks at the same table as everybody else, a carter at the tavern says.
   - `[face]` `[guild]` The guilds say a fine on a master is worked off by his journeymen, and that nobody hearing the matter knows it.
   - `[face]` `[garrison · pair 3 · reinforce]` A soldier says the garrison is not asked about any of it until somebody runs. <!-- joinable -->
   - `[face]` `[gate · pair 3 · reinforce]` At the gate they say the ones who run go out with the carts before first light. <!-- joinable -->

--- NOTES

### THE CURE — one target, one change

- **variant 1 face 10 · `[garrison]` · FAIL floor 1 · CURED.**
  - was: *A soldier says the wall is the garrison's business and the people walked out past it are not.*
  - now: *A soldier says what comes at the town is the garrison's business and the people walked out of it are not.*
  - the finding cured: the possessive asserted a WALL. At town the `garrison` source is seated by a
    `Barracks` row (`required: false`, `baseChance: 0.3`, `institutionalCatalog.js:1363-1368`) while
    `Town walls` is an INDEPENDENT coin (`required: false`, `baseChance: 0.5`, `:1332-1338`), so the
    face draws on garrisoned towns with no wall at all, where `inst.hasWalls`
    (`priorityHelpers.js:52`) is false and the same tab prints `threatAssessment.js:121`
    "Professional garrison without perimeter walls." while `safetyProfile.js`'s `wallNote` resolves
    to the empty string. THE RECORD IS THE FLAG. Table F1-07.
  - what the cure spends instead: `Defence services` p 1.0 on the `Garrison` row — what comes at the
    town — which is the source's own service wherever the source is seated and carries no fabric
    with it. The second half keeps the pool's own sanction, the road, which
    `defenseDisplay.js:233` ("Fines and exile only.") prints on every preimage town, and "out of it"
    is out of the TOWN, not out past a work the record may not hold.
  - what was deliberately NOT changed: the edge is the whole of the face and it survives whole — the
    garrison's remit stops where this pool's subject starts. The sentence keeps its subject, its
    order and its landing noun, so it remains a different sentence from every sibling and from
    variant 3's `[garrison]` face ("not asked about any of it until somebody runs"); the antithesis
    close the selector counted as one of variant 1's two is neither added nor removed; no record is
    cited, so the PROVENANCE ceiling is untouched; no source, tag, pair number or join comment moved.

### REFUSED TARGETS

None. The one target named was cured.

### NOT TARGETS, CARRIED UNCHANGED — recorded so the chair can see they were read and left alone

- variant 1 face 2 `[court]` and variant 3 face 3 `[market]` stand WITHHELD in the refuter's packet,
  not failed. A withheld verdict is the chair's call, the refuter offered a cure for each, and
  neither was named to this seat. Both faces are byte-identical above.
- the refuter's four CRAFT reservations (the spine echo in variants 1 and 3, the "and that" join
  count, the one indefinite man, the one claim stated three times) are craft at the pool grain and
  were not named as targets. Changing any of them would move faces the gate diffs. Untouched.
- the WIRING rows W-1 to W-4 charge the engine, not the writer, and no face answers to them.

### HELD BACK UNTIL THE CARS LAND — never in the rows above

The archiver's weighing (ruling 22; car 18i not landed; two is the pool's ration):

- weigh | variant 1 | pair 1 | It may be that both are right, and what neither of them has is a room to put the matter in until morning. *(packet 2, Opus 5 — a conjecture, and it opens)*
- weigh | variant 2 | pair 2 | The court's account is the likelier of the two, the tavern having its own reason to hold any hearing a formality. *(packet 2, Opus 5 — a lean whose reason is drawn from the other source's stake, which is the one licensed form of it)*
- Pair 3 takes no weighing. Neither writer offered one and neither source has a stake against the other.

The archiver as witness (ruling 27; car 18n not landed; one per pool):

- observed | variant 3 | The bench outside the chamber has nobody set to keep anyone on it. *(packet 2, Opus 5 — bare passive, no observer named, and it observes only what the key itself fixes. Packet 1's bar-on-the-inside candidates assert a fitting the record does not hold; packet 1's "no door in the hall is barred" ties the chamber to the hall's roof, which reads against the required `Multiple courthouses` at city.)*

The public (ruling 28; same car). Spine 2 is already carried by the public, so these are alternates:

- public | variant 1 | Anybody here can say what a man is charged in coin and nobody can say where he would be kept, and the town counts that as order. *(packet 1, Opus 5)*
- public | variant 2 | It is common knowledge here that nobody taken up is kept overnight, and the town counts that as the matter being closed. *(packet 2, Opus 5)*
- public | variant 3 | Everyone in the town knows which households keep their own eye on which men, and takes it that this is what keeping the peace amounts to. *(packet 1, Opus 5 — the best of the six: a seeing that binds, and a perception about what it means that the town may well have wrong)*

The compromised role (ruling 26; car 18m not landed). `court` is the ONE source §2c marks on this pool; `[hall · compromised]` and `[watch · compromised]` are refused here. Three shapes, one per variant:

- compromised | variant 1 | minimise | The court says what comes before it is heard and settled, and that there is less of it than the town supposes. *(packet 2, Opus 5)*
- compromised | variant 2 | reassure | The court says matters here are heard as they should be, and asks that the town be left to get on with it. *(packet 2, Opus 5)*
- compromised | variant 3 | blame the talk | A magistrate says the matters that come to the chamber are the ordinary ones and that talk of any others is talk. *(packet 1, Opus 5)*
- The honest untagged reassurance that would make a reassurance on this page a question rather than an answer is available and NOT placed: *The watch says the streets are walked after dark, and that this much of it is true whatever else is said.* (packet 2, Opus 5; it reassures on `Night patrol` p 1.0, which genuinely holds on every preimage town.)

### FLAGGED TO THE CHAIR, NOT DECIDED HERE

1. The brief says cars 18i, 18m and 18n have not landed and that a weighing, an observed face and a compromised face must stay under NOTES; the lane's own `RECEIPT_POOLS_DOSSIER_STATE.md` already carries `[archiver · pair 1 · weigh]`, `[archiver · observed]` and `[hall · compromised]` rows inside the DS-DEF-2 section, under `Economic Survival: STRONG`. The brief was followed, because a token the projector refuses fails the whole packet while a kept candidate under NOTES is lifted into a row at no cost. If the cars have in fact landed, the three headings above are ready to promote as they stand.
2. Spine 3 keeps the tag `[unfolding]`, which is none of the three surviving stances, per the brief's instruction to keep the tag exactly. Both writers flagged the same rub. The sentence under it no longer charts a trend, which was the current row's F2-08 breach.
