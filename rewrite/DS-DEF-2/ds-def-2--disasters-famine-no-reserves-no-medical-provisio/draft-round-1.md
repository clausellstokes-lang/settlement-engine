# DRAFT ROUND 1 — DS-DEF-2 · pool `Disasters & Famine: NO reserves, NO medical provision`

Seat: Opus 5 (writer, Fable-unvalidated), for the Fable chair. Block `DS-DEF-2`, row 5 of five.
Written under **ADDENDUM 14** (owner, 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record; silence in the record is permission.

STATUS: COMPLETE — 3 variants, 12 wordings (each variant's numbered line plus three `[face]` sub-rows). Zero refusals.

---

## THE ROWS, ready to paste under the pool's bold heading

1. `[ledger]` {settlement} holds no store in common against a bad year and gives no room over to the sick.
   - `[face]` The sum of what {settlement} has by it is nobody's to keep. No one is paid for sitting with the sick, and the sitting falls to the house.
   - `[face]` A store and a sick-house are each an office as much as a building, and no one at {settlement} holds either office.
   - `[face]` Whatever is put by at {settlement} against a hard year is put by behind somebody's own door, and the sick are nursed in their own beds.
2. `[street]` When the food runs short the asking starts at a neighbour's door, and when somebody falls ill the same door is knocked on. Neither has a door of its own.
   - `[face]` What stands in for a store here is knowing what a house would admit to holding, and what stands in for a sick-house is somebody's own room.
   - `[face]` Food reaching a house that runs short comes out of another house's own, and what is done for its sick comes out of somebody's working day. Both go on the count.
   - `[face]` Somebody who falls ill here stays in the room they sleep in, and the house goes on around them. Whatever that house puts by is in the same room.
3. `[visitor]` The answer a stranger gets at {settlement}, whether he asks after the store or after the sick-house, is a name and a door.
   - `[face]` A traveller taken ill at {settlement} becomes the business of whatever roof he is under. No room is set apart for him, and he has no claim on anybody's store.
   - `[face]` Every room a stranger passes at {settlement} has something in it, and not one of them is kept back against want or against a sickness.
   - `[face]` A stranger wanting food or a bed for somebody ill is sent to a household at {settlement}, and a household may ask what he brings, or may not want him under the roof.

---

## THE TWELVE AT A GLANCE (construction, landing noun, sentences, words)

| id | first two words | construction | lands on | sentences | words |
|---|---|---|---|---|---|
| 1 main | `{settlement} holds` | the flat entry: subject is the settlement, both absences in one clause pair | the sick | 1 | 18 |
| 1 f2 | `The sum` | the missing TOTAL, then the unpaid sitting | the house | 2 | 28 |
| 1 f3 | `A store` | definitional (the absent thing is an office), then the vacancy | office | 1 | 22 |
| 1 f4 | `Whatever is` | fronted free relative + locative; the passive nursing clause | beds | 1 | 26 |
| 2 main | `When the` | paired temporal clauses converging on one door, then a short close | own | 2 | 30 |
| 2 f2 | `What stands` | parallel substitution (what stands in for X is Y) | room | 1 | 27 |
| 2 f3 | `Food reaching` | two sources traced to households, then a four-word close | count | 2 | 31 |
| 2 f4 | `Somebody who` | a person in a room, then the store found in the same room | room | 2 | 29 |
| 3 main | `The answer` | the answer as the subject, the two askings inside a concessive | door | 1 | 23 |
| 3 f2 | `A traveller` | the stranger's own case, then two denials that fall on him | store | 2 | 30 |
| 3 f3 | `Every room` | what he sees before he is told anything | sickness | 1 | 25 |
| 3 f4 | `A stranger` | he is sent to a household, and the household's terms are open | roof | 1 | 33 |

Spread held: twelve distinct openers · no two variants share their first two words (A11) · sentence counts 1/2/1/1, 2/1/2/2, 1/2/1/1 · lengths 18 to 33 · `{settlement}` opens exactly one variant (vid 1) and is buried in vid 3 (order constraint 10) · vid 2 carries no slot in any of its four wordings · zero semicolons, zero colons, zero em dashes, zero digits, zero occurrences of `which` in any form, zero questions, zero second person.

---

## --- NOTES

### What every one of the twelve carries, and what none of them carries

**Carried in all twelve (the pool's two-flag predicate).** (i) No reserve held IN COMMON — licensed by the card's `may claim` line, `compound.inst.hasGranary === false`, `priorityHelpers.js:63`, the half of the predicate the key reads itself. (ii) No HOUSE and no TRADE for the sick — `compound.inst.hasHospital === false`, `priorityHelpers.js:64`, whose grep covers `healer` and so denies the person as well as the building.

**Dropped from every one of the twelve, against the shipped rows.**
- *holds no food* (shipped vid 1) — the record denies a STORE, never FOOD (F1-76; F1-107 over a `Surplus` tile; `storageMonths` still prints). Every face here denies the pooling, the claim and the keeper, and several state positively that the food is in the houses.
- *has nobody to treat the sick* and *a plague runs until it burns out* (shipped vid 1) — contradicted on the church slice, where the same tab prints the status `Clergy care` (`defenseDisplay.js:237-239`) and the engine halves plague probability (`stressGenerator.js:173`). Every face denies the ROOM, the BED SET APART and the PAY, never the care: *no one is paid for sitting with the sick*, *the sitting falls to the house*, *the sick are nursed in their own beds*, *somebody who falls ill stays in the room they sleep in*. Care is affirmed in five of the twelve and denied in none.
- *until it burns out* / *immediate hardship* — a forecast the pulse adjudicates and a duration (F2-05, F2-02). No face carries a modal future; the only modals are subjunctive (*would say*, *would be*) and dispositional (*may ask*, *may not want*).
- *The town's* (shipped vid 2) — F1-31 across a preimage that is overwhelmingly thorp, hamlet and village. No face carries `town`, `village`, `city`, a tier word, or a spelled band. The subjects used instead: the settlement through its slot, *a house*, *the houses*, *a household*, *a neighbour*, *somebody*, *a stranger*, *a traveller*, *here*, and no subject noun at all.
- the shipped vid 2's relative tail on `which` — a hard-wall breach and a gloss rather than a computed consequence. The string `which` does not occur anywhere in the twelve, in a clause or as a determiner.
- *because there is neither* (shipped vid 3) — a global assertion about the settlement's contents, refutable by a custom roster row invisible to both greps (F1-30, W-03). Every absence here is written as the arrangement people meet: what the asking starts at, what a stranger is answered with, what no one is paid for, what no room is kept back against, what he has no claim on.

**Never touched, in either direction, by any of the twelve.** The faith house and the clergy (`hasChurch` is passed to `disasterRowSituation` and never read on this branch, `defenseStateProse.js:589`); the tier; the route; the food label and the badge on the other clock (R-2); the culture profile's furniture; any force bucket; any history field.

### Per wording: the claims, and what licenses each

**Vid 1 · `[ledger]` · slots `{settlement}` ×1 · the clerk's entry**

*Main line — "{settlement} holds no store in common against a bad year and gives no room over to the sick." (18 words)*
- *no store in common against a bad year* — the card's `may claim`: the reader selects `no reserves, no medical provision`, as a standing fact. **against a bad year** is the shipped set's best construction kept: a reserve is held FOR a case, and naming the case asserts no occurrence (floor 2 clean; §1.7).
- *gives no room over to the sick* — the hospital half written as a ROOM, which is what `hasHospital === false` denies (F1-14). Not care, not people.
- This is the pool's one deliberately flat line (§25 of the pack: the plainest sentence is why the others land). One sentence, 18 words, the shortest of the twelve.

*Face 2 — "The sum of what {settlement} has by it is nobody's to keep. No one is paid for sitting with the sick, and the sitting falls to the house." (28 words)*
- *the sum … is nobody's to keep* — the vein §1.8 names and no shipped row used: a granary POOLS, and pooling produces a total and a keeper of the total. Without the row nobody is charged with knowing it. Licensed by `hasGranary === false` plus silence; states no magnitude, so F2-01 does not reach it (the sum named is the one that does not exist).
- *no one is paid for sitting with the sick* — the denied village row prices its own service (`institutionalCatalog.js:860`), so the absence is of a thing that would have been BOUGHT. The pay is denied; the sitting is affirmed in the same breath, which is what keeps it off the church slice.
- *the sitting falls to the house* — silence; an unnamed household acting (W22 struck by name).

*Face 3 — "A store and a sick-house are each an office as much as a building, and no one at {settlement} holds either office." (22 words)*
- *each an office as much as a building* — the two denied rows carry a keeper and a duty as well as a roof (`Town granary`: *Communal grain storage*; `Small hospital`: *Care for sick poor*). Counterfactual, so it asserts nothing about this settlement.
- *no one … holds either office* — the two flags, stated as a vacancy rather than as a fact about what stands in the place, which keeps it clear of F1-30. No tier office is implied (F3-06): an office nobody holds seats nobody.
- *sick-house* is free vocabulary naming no roster row (W15's spelling list struck entire).

*Face 4 — "Whatever is put by at {settlement} against a hard year is put by behind somebody's own door, and the sick are nursed in their own beds." (26 words)*
- *put by … behind somebody's own door* — the positive form of the same flag: the food exists (the `storageMonths` figure and the five chains are unread and untouched here), the COMMON claim on it does not. This is the face that most deliberately clears F1-76 and F1-107.
- *the sick are nursed in their own beds* — the marker's own licensed cure (*no bed that is not somebody's own*, §0.5a). Care affirmed, the bed set apart denied.
- *a hard year* varies the case-noun against the main line's *a bad year* (§1.7's instruction).

**Vid 2 · `[street]` · ⛔ no slot in any of the four · what the place knows about itself**

*Main line — "When the food runs short the asking starts at a neighbour's door, and when somebody falls ill the same door is knocked on. Neither has a door of its own." (30 words)*
- *the asking starts at a neighbour's door* — with no common store there is nothing to DRAW on, so want is a matter of ASKING (§2.8). Licensed by `hasGranary === false` plus silence on who is asked.
- *the same door is knocked on* — the shipped row's one genuinely good idea kept as an IDEA and not as words: the predicate is two absences under one branch, and the shared shape is the honest reading of the key.
- *Neither has a door of its own* — the absence written as where people go, never as what the settlement contains (F1-30). Four words short, after a twenty-two word sentence: the load-following rhythm §22 asks for.
- No slot, no tier word, no scene furniture that a culture profile could deny (F3-05): a door and a room are shapes, not materials.

*Face 2 — "What stands in for a store here is knowing what a house would admit to holding, and what stands in for a sick-house is somebody's own room." (27 words)*
- *knowing what a house would admit to holding* — pure silence, and the plot hook §2.8 asks for: the households known to hold back more than they say, who is asked and who is not. Subjunctive *would*, so no rate and no event (F2-04, F2-06).
- *somebody's own room* — the medical absence as the room a person already has.
- Parallel substitution is this face's whole construction and is used nowhere else in the twelve.

*Face 3 — "Food reaching a house that runs short comes out of another house's own, and what is done for its sick comes out of somebody's working day. Both go on the count." (31 words)*
- *comes out of another house's own* — the claim is a neighbour's to give, not a store's to issue.
- *comes out of somebody's working day* — the trade denied in its concrete form: whoever tends the sick has something else to be doing (`hasHospital === false` covers the person).
- *Both go on the count* — the shipped vid 2's best clause carried as a SHAPE in new words: a practice named in place of an outcome. It speaks no magnitude (F2-01 does not reach it), records no event (F2-04), and quietly establishes that there is an afterwards, which keeps the pool clear of F1-34's totality.

*Face 4 — "Somebody who falls ill here stays in the room they sleep in, and the house goes on around them. Whatever that house puts by is in the same room." (29 words)*
- *stays in the room they sleep in … the house goes on around them* — §2.8's ground-level reading of the missing house and trade, verbatim in sense: nothing is carried anywhere, no door shuts on it.
- *whatever that house puts by is in the same room* — both halves of the key in one image, and the sharpest available statement that the store is not common: the reserve and the sick share a floor. Present habitual throughout; no perfect, no elapsed course.

**Vid 3 · `[visitor]` · slots `{settlement}` ×1, never the opener · the place as it meets somebody who does not live in it**

*Main line — "The answer a stranger gets at {settlement}, whether he asks after the store or after the sick-house, is a name and a door." (23 words)*
- *the answer … is a name and a door* — the shipped row's *is directed to neither* carried as a shape and cured: it states what he is TOLD, never what the settlement contains (F1-30, §3.7). §3.8's finding stated for the first time in the corpus: he is not given an address, he is given a name, because the answer to a public question here is a private one.
- *whether he asks after the store or after the sick-house* — both halves of the key, as the two expectations a stranger arrives with.
- An unnamed person answers him (W22 struck); no tier office is named (F3-06); `{settlement}` sits mid-sentence, leaving the opener to vid 1 (order constraint 10).

*Face 2 — "A traveller taken ill at {settlement} becomes the business of whatever roof he is under. No room is set apart for him, and he has no claim on anybody's store." (30 words)*
- *becomes the business of whatever roof he is under* — §3.8's best hook: the two absent civic objects are the two that serve a person with no household here, and that is the visitor himself.
- *No room is set apart for him* — the hospital flag, at the grain it bites.
- *he has no claim on anybody's store* — the exact line F1-76 and F1-107 want: the houses HAVE stores, and a stranger has no claim on them. The absence is of a claim, never of food.

*Face 3 — "Every room a stranger passes at {settlement} has something in it, and not one of them is kept back against want or against a sickness." (25 words)*
- *every room … has something in it* — §3.8's third vein: both denied buildings are rooms whose value is that they stand ready and mostly empty, and this reads as economy rather than as poverty. Bounded to the rooms he passes, so it asserts no totality over the settlement's contents and no totality over persons.
- *not one of them is kept back against want or against a sickness* — both flags, as a standing condition with no outcome attached. *Want* and *a sickness* are cases, not states of this settlement (F1-76, F1-107, F1-36 all clear).

*Face 4 — "A stranger wanting food or a bed for somebody ill is sent to a household at {settlement}, and a household may ask what he brings, or may not want him under the roof." (33 words)*
- *is sent to a household* — the absence as a destination that is somebody's house; both wants in one clause.
- *may ask what he brings, or may not want him under the roof* — §3.8's last vein, entirely silence: what a place with no reserve and no sick-house assumes of the people who arrive in it. A household may act, refuse and resent (W22a/W22b struck by name); the modals are dispositional, not predictive.
- The longest of the twelve, against the main line's twenty-three: load-following, and the one face that closes on an open matter rather than a settled one.

### The mechanical ratchets, checked over all twelve
No em dash · no exclamation · no question mark · no digit or numeral word standing for a world quantity · no percent · no `which`-clause · no second person · no semicolon or colon · no future indicative · no proper name minted (`{settlement}` is the only slot) · slot sets: vid 1 four wordings × exactly one `{settlement}`, vid 2 four wordings × zero slots, vid 3 four wordings × exactly one `{settlement}` and never in the opening position · every variant one or two sentences (A1) · no `[plain]` marker anywhere · one bracketed angle tag per numbered line, unchanged from the shipped rows (`[ledger]`, `[street]`, `[visitor]`) in the shipped order.

### Floors walked, with the disposition
- **F1-09** (a granary, a common bin, a public stock) — asserted by none; denied as a COMMON store in eight wordings and written around as per-house holding in the rest.
- **F1-14** (an infirmary, a bed set apart, a healer, a physician) — asserted by none; denied as a ROOM, a BED APART and a PAID TRADE, never as care or as people.
- **F1-11 / F1-23** (a church, a shrine, the clergy) — absent in both directions from all twelve; no face prays, sends for a priest, or denies that anyone tends the sick.
- **F1-31** (a tier word, a spelled band) — zero occurrences of `town`, `village`, `city`, `hamlet`, `thorp`, or any size phrase.
- **F1-76 / F1-107** (no food at all; a famine face over a `Surplus` tile) — four wordings state positively that the food is in the houses; none makes this a hungry place, and no intensity word outruns a badge that can read STRONG.
- **F1-30** (the global absence) — no face asserts what the settlement does or does not contain in the round.
- **F1-34** (a totality) — none; *Both go on the count* and *the sitting falls to the house* both establish an afterwards.
- **F1-36 / F4-05** — the word *plague* and the word *plagued* appear nowhere; sickness is spoken of as a case, never as a hypothetical denial of one the panel may be naming.
- **F1-126 / F1-24 / F3-06** — no minted name, no cited keeper, no act on a singular rostered office.
- **F2-01 / F2-02 / F2-05 / F2-06 / F2-07 / F2-08 / F2-09** — no count, share or headcount; no date, season-as-event, month or duration; no perfect, durative, comparative-against-a-past or ordinal; no rate; no age of fabric; no trend; no dependency on a history field.
- **F3-05** (culture furniture) — the furniture is doors, rooms, beds, roofs, houses and a working day: shapes rather than materials. No thatch, barn, hearth, churchyard, green, lane, snow or winter road.
- **F4-03 / F4-04** — no gate direction split and no total failure of relief; no face speaks about the purses at all.
- **W-10 / W-11 / R-2** — no live posture word and no intensity word bound to a band; the frozen key and the live badge are not put in contact.

### REFUSALS
**None.** All three variants are written, each with four wordings, and no variant required a refusal row. No law was found that this pool's faces cannot meet.
