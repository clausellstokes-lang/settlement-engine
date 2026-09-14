# DRAFT ROUND 2 — DS-DEF-2 · pool `Internal Security: court without detention`

Seat: Opus 5 (writer, Fable-unvalidated), for the Fable chair. Written under ADDENDUM 14
(a face is lawful unless it contradicts the record; silence is permission), the four floors,
`rewrite/recut/CONTRADICTION-TABLE.md` (defense rows + the header strike list), the licence
card printed from the DEF2 dock, and the marker's skeleton for this pool.

Three variants, in order, one for one against the shipped rows. Four faces each (the numbered
line plus three `[face]` sub-rows). Slot discipline unchanged from round 1: vid 1 `{settlement}`
opening, vid 2 NO SLOT in any face, vid 3 `{settlement}` mid-sentence. No refusals.

**WHAT THIS ROUND MOVES.** The gate returned one failing owned measure:
`shapes.participialOpenerRate` **(over)**, 13.62 band-widths deep, on 2 of 12 faces. The two
faces are 2.3 and 3.3, and the fault in each is a single sentence-initial gerund subject
(`Naming is what the law can do` · `Paying or walking is that person's own choice`). Both
sentences are rewritten; no other face is touched, so the pool's other measures move only by
the two faces' own word counts. The pool now carries **zero** sentence-initial participles or
gerunds, in any face, in any clause that opens a sentence. (Clause-medial gerunds survive
where they were never the fault: *because keeping a person is beyond the town*, 1.1.)

---

## THE POOL'S REWRITTEN ROWS — ready to paste under the pool heading

1. `[ledger]` {settlement} enters a wrong in the same book as a licence and a levy, with nowhere to put the person while the entry is written. What answers it is a fine or a banishment.
   - `[face]` The line that pays for order at {settlement} carries a gaol in its name and no gaol under it. What is heard here is answered in coin or in distance, because keeping a person is beyond the town.
   - `[face]` Coin and the road are what {settlement} sets against a wrong, and neither falls the same way on one house as on the next. Nothing is kept here but the entry.
   - `[face]` A grievance and a deed wait in the same line at {settlement} and are settled at the same table. What leaves that table is coin, or a person on the road, because there is nowhere to keep one.
2. `[street]` The town can put a name to a wrong and cannot put a hand on whoever did it, so it charges money or sends the person off.
   - `[face]` A matter is heard, and the one it concerns leaves by the same door as the people who come to watch. Nothing is done with a person here, so the town takes coin or an empty house.
   - `[face]` Some wrongs come to the law here and some are settled between houses. The ones that come in are named, and then paid for or walked away from, because nobody is kept.
   - `[face]` A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here. The law gets as far as the name; the rest falls on the house.
3. `[unfolding]` Whatever can be decided at {settlement} is decided, and the town holds no one past the deciding. The one who will neither pay nor go is where the arrangement runs out.
   - `[face]` A permit at {settlement} is finished where it is asked for, and a wrong is finished as far as the naming and no further. The part that would need a person kept has no place to be done.
   - `[face]` Nothing stands between a finding at {settlement} and the answer to it, because the town has no room to put a person in the meantime. A fine and a departure are near to hand, and neither needs a door that locks.
   - `[face]` A judgement at {settlement} is the whole of the town's part, because there is nowhere to keep the person it falls on. That person pays, or takes the road, and the record says nothing about a refusal.

---

--- NOTES

**No refusals.** All three variants are written lawfully; none is banked.

**The test applied.** ADDENDUM 14: each face was checked by asking what would have to be
FALSE on the dossier for it to be true. Where the answer was "nothing; the record is silent",
the face stood. The card's `reads` are cited below as what each claim rests on; the flavour
rows are marked SILENCE, which under ADDENDUM 14 is permission, not a fault.

### THE TWO REWRITTEN SENTENCES — the measure answered

| face | round 1 (failing) | round 2 | opener now |
| --- | --- | --- | --- |
| 2.3 s2 | *Naming is what the law can do; keeping is not.* | *The law gets as far as the name; the rest falls on the house.* | determiner + noun |
| 3.3 s2 | *Paying or walking is that person's own choice, and the record says nothing about a refusal.* | *That person pays, or takes the road, and the record says nothing about a refusal.* | determiner + noun |

Both replacements keep every claim the failing sentence carried, add none, and keep the
construction distinct from every sibling:

- **2.3 s2** keeps the capability pair (the court names; nothing keeps a person) and the pool's
  only semicolon, so the punctuation variety of round 1 survives. The grammar changed from a
  pseudo-cleft on a gerund to a reach statement with a consequence landed on a household, which
  is the second clause earning its place by CONSEQUENCE rather than by restatement. The noun
  *house* is carried forward from the face's own first clause, so the thread holds and the turn
  outward is not a mid-passage subject swap. It does not re-run the spine's construction
  (spine 2 is *the town can … and cannot …*; this is *the law gets as far as …*).
- **3.3 s2** keeps the two answers as the person's own, keeps the GAP form last and unresolved,
  and now opens on the unnamed person carried straight out of the first sentence's *the person
  it falls on*, which strengthens the thread rather than only satisfying the measure. *Takes the
  road* is a twelfth distinct spelling of the mandated pair and collides with no sibling
  (*a banishment* · *distance* · *the road* · *a person on the road* · *sends the person off* ·
  *an empty house* · *walked away from* · *nor go* · *a departure*).

### Variant 1 · `[ledger]` · slots `{settlement}` x1, opening (order constraint 10 kept)

Word counts: 34 · 38 · 31 · 38. **Unchanged from round 1** — no face in this variant carried the
failing measure.

- **1.0 (canonical).** *a standing body enters and answers a wrong* <- `compound.inst.hasCourtSystem === true`, the card's predicate (`court` truthy) and its `may claim` line: the court holds as a STANDING fact. Stated as ENTERING and ANSWERING, never trying, so it is true of the `Town hall` row (`institutionServices.js:1622-1627`, civil arbitration only) as well as of the city's criminal benches. *the same book as a licence and a levy* <- the same roster row's own recorded services, Permit applications, Tax payment, Record filing. *nowhere to put the person* <- `compound.inst.hasPrison === false`, the key's second read; the pool's discriminating claim, in capability form. *a fine or a banishment* <- two named answers, denied by nothing; exile is positively modelled (`npcLedger.js:756`, `warAuthorityVerdict.js:23`), and the pair is written as what answers a wrong, never as a closed inventory, so the city `Workhouse` town does not falsify it. No keeper is named (card `source: SOURCE-UNRESOLVED`).
- **1.1.** *the line that pays for order carries a gaol in its name* <- the order gate's own English, *watch wages, court and gaol funding*, one charge (`defenseGenerator.js:246`). The purse is stated as ONE charge and no direction is split between its heads, so the four-gate bar is clear; no shortfall, figure or total failure is claimed, so the bounded-shortfall bar is clear; the watch is not named, so the militia/watch exclusion and the part-time bar are untouched. *no gaol under it* <- `hasPrison === false`. *answered in coin or in distance* <- as 1.0. *keeping a person is beyond the town* <- `hasPrison === false`, capability form. The gerund here is clause-medial, never a sentence opener, and is not the measure's object.
- **1.2.** *Coin and the road are what {settlement} sets against a wrong* <- as 1.0. *neither falls the same way on one house as on the next* <- total record silence on the incidence of a fine or a banishment; SILENCE, carried without a magnitude, a share or a totality over persons. *Nothing is kept here but the entry* <- `hasPrison === false`, written as the ABSENCE move, flat, not the opener of the face.
- **1.3.** *a grievance and a deed wait in the same line and are settled at the same table* <- the roster row's own service list again (arbitration beside record filing); SILENCE supplies the queue and the table. *coin, or a person on the road* <- as 1.0. *nowhere to keep one* <- `hasPrison === false`. An unnamed person appears and acts; the person bar is struck by name and no singular office the tier seats is addressed.

### Variant 2 · `[street]` · NO SLOT in any face (projector rule, ARCH 2.5 face sub-row)

Word counts: 27 · 37 · 32 · 35. Faces 2.0 to 2.2 unchanged from round 1; 2.3's second sentence
rewritten, its word count 31 -> 35.

- **2.0 (canonical).** *can put a name to a wrong* <- `hasCourtSystem === true`; the naming form is true of every row behind the flag, including `Democratic assembly`, and names no building and no procedure. *cannot put a hand on whoever did it* <- `hasPrison === false`; the offender is an unnamed person, licensed. *charges money or sends the person off* <- the two answers, habitual and generic, never a particular banishment. No slot, no count, no rate, no date.
- **2.1.** *the one it concerns leaves by the same door as the people who come to watch* <- `hasPrison === false` read at street level: the grep covers `stocks`, so there is no post, no pillory and no public punishment apparatus (`priorityHelpers.js:54`; `institutionServices.js:1635-1639`), and the record is silent about what stands in its place. SILENCE. Present habitual throughout; no event the record did not run. *Nothing is done with a person here* <- `hasPrison === false`. *coin or an empty house* <- the two answers, landed on a household.
- **2.2.** *Some wrongs come to the law here and some are settled between houses* <- SILENCE: the record says nothing about what the town declines to bring in. Written as a STANDING condition, not a course, and the first clause affirms the law, so the denial-direction bar is clear. *named, and then paid for or walked away from* <- the predicate plus the two answers. *nobody is kept* <- `hasPrison === false`.
- **2.3 (REWRITTEN).** *A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here* <- SILENCE on incidence; a cross-party condition, never a magnitude and never a comparison against an earlier state. *The law gets as far as the name* <- `hasCourtSystem === true` stated as reach, with the stopping point being the key's second read, `hasPrison === false`; a capability, not a course, and no clock, no interval and no rate is welded to it. *the rest falls on the house* <- SILENCE: nothing in the record says who bears what a fine or a departure costs, so the consequence is written where the dossier is silent and the GM has a household to run. No magnitude, no totality over persons, no exemption claimed (whoIsExempt is null everywhere, and this face claims no exemption). The pool's single semicolon still sits here.

### Variant 3 · `[unfolding]` · slots `{settlement}` x1, never the opener

Word counts: 31 · 38 · 41 · 37. Faces 3.0 to 3.2 unchanged from round 1; 3.3's second sentence
rewritten, its word count 38 -> 37.

Floor 2 governs this variant. Every face is simple habitual present: no perfect, no durative,
no comparative against a past, no ordinal over events, no modal future, and none of
*still* / *no longer* / *since* / *again*. The motion is a STANDING tension, never a course.
No face says the deciding is futile, so floor 4 (`defenseGenerator.js:232` court +20;
`safetyProfile.js:62-71`, `:283` the court suppresses crime) is clear. No plural courts.

- **3.0 (canonical).** *Whatever can be decided is decided* <- `hasCourtSystem === true`, and the engine's own positive model that the bench works. *the town holds no one past the deciding* <- `hasPrison === false`. *The one who will neither pay nor go is where the arrangement runs out* <- SILENCE: the record holds no answer to the person who refuses both, so the matter is stated and left standing open (the OPEN QUESTION move, declarative, no interrogative). The clause is about the arrangement's edge, not the bench's efficacy, so it asserts no futility.
- **3.1.** *a permit is finished where it is asked for, and a wrong is finished as far as the naming and no further* <- the roster row's own services: the administrative business completes, the naming completes, and the step that would need a person kept does not exist. A standing asymmetry, no clock. *The part that would need a person kept has no place to be done* <- `hasPrison === false`; *would* is subjunctive, never a forecast.
- **3.2.** *Nothing stands between a finding and the answer to it* <- the two reads taken as a shape: the decision is complete and the interval that detention would occupy is absent. *no room to put a person in the meantime* <- `hasPrison === false`; the duration word sits inside a negation and asserts none. *A fine and a departure are near to hand* <- the two answers. *neither needs a door that locks* <- the denial direction of `hasPrison`, which the key itself reads, so the absence is the record's own.
- **3.3 (REWRITTEN).** *A judgement is the whole of the town's part* <- `hasCourtSystem === true`; *judgement* is used without a criminal reading and is the `Courthouse` row's own printed word where that row stands, so it is true on the hall-only town and on the six-bench city alike. *nowhere to keep the person it falls on* <- `hasPrison === false`. *That person pays, or takes the road* <- the two answers, now spoken of the same unnamed person the first sentence introduced, so the thread is a carried noun and not a subject swap; no named character, no fate, no office the tier seats. *the record says nothing about a refusal* <- the GAP form, a fact of the RECORD and never of the world, leaving the pool's open matter unresolved. Nothing here is predicated of a deity and nothing crosses a culture profile.

### Craft notes for the refuters and the refiner (the pool is the unit)

- **Twelve constructions, no permutation.** The subjects across the pool are: the town as record-keeper · the order charge · the two answers · a queue and a table · the town's capability pair · a matter and a doorway · what is brought and what is not · the incidence of a fine · what can be decided · a permit against a wrong · the missing interval · the judgement as the town's whole part. No two faces are the halves of one `A, and B` join swapped. The two rewritten sentences added no construction already spent: a REACH statement with a consequence landed on a house (2.3) and a PERSON acting as subject (3.3) are each new to the pool.
- **First four words of each face, read in order** (the pack's own check): *The line that pays* · *Coin and the road* · *A grievance and a deed* · *A matter is heard* · *Some wrongs come to* · *A fine is nothing* · *A permit at {settlement}* · *Nothing stands between a* · *A judgement at {settlement}*. Nine distinct openings; none is the slot.
- **Twelve spellings of the one mandated pair**, so the claim recurs and the vocabulary does not: *a fine or a banishment* · *coin or distance* · *Coin and the road* · *coin, or a person on the road* · *charges money or sends the person off* · *coin or an empty house* · *paid for or walked away from* · *A fine ... the road ... the rest falls on the house* · *neither pay nor go* · (3.1 carries none) · *A fine and a departure* · *pays, or takes the road*.
- **Sentence shapes.** Five faces run long-then-short; four run short-then-long; one is a single sentence (2.0); one carries the pool's only semicolon (2.3). No two sentences of one face share a length and a grammar. **No sentence in the pool opens on a participle or a gerund.**
- **Words deliberately NOT spent anywhere in the pool:** trial, sentence as a verdict, convict, gallows, courthouse, cell, gaol except as the name on the charge and as a stated absence, stocks, pillory, irons, magistrate, mayor, captain, courts plural, and every word of the exemplar pack's north-European furniture (thatch, churchyard, market green, tavern, snow), since no defense pool reads the culture profile.
- **An unnamed person acts in seven of the twelve** (the one the entry is written about, the one who leaves by the door, the watchers, the houses that can pay, the one who leaves people behind, the one who will neither pay nor go, the one the judgement falls on). None is named; none is the tier's or the stress's singular office.
- **Two matters stand open and are not closed:** what becomes of the one who will neither pay nor go (3.0), and what the record holds about a refusal (3.3). Neither is resolved in its own last clause.
- **Mechanical ratchets.** No em dash, no exclamation mark, no digit, no percent, no which-clause, anywhere in the twelve faces.

*Ends. Draft round 2.*
