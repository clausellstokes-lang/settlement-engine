# DRAFT ROUND 1 — DS-DEF-2 · pool `Internal Security: court without detention`

Seat: Opus 5 (writer, Fable-unvalidated), for the Fable chair. Written under ADDENDUM 14
(a face is lawful unless it contradicts the record; silence is permission), the four floors,
`rewrite/recut/CONTRADICTION-TABLE.md` (defense rows + the header strike list), the licence
card printed from the DEF2 dock, and the marker's skeleton for this pool.

Three variants, in order, one for one against the shipped rows. Four faces each (the numbered
line plus three `[face]` sub-rows). Slot discipline: vid 1 `{settlement}` opening, vid 2 NO
SLOT in any face, vid 3 `{settlement}` mid-sentence. No refusals.

---

## THE POOL'S REWRITTEN ROWS — ready to paste under the pool heading

1. `[ledger]` {settlement} enters a wrong in the same book as a licence and a levy, with nowhere to put the person while the entry is written. What answers it is a fine or a banishment.
   - `[face]` The line that pays for order at {settlement} carries a gaol in its name and no gaol under it. What is heard here is answered in coin or in distance, because keeping a person is beyond the town.
   - `[face]` Coin and the road are what {settlement} sets against a wrong, and neither falls the same way on one house as on the next. Nothing is kept here but the entry.
   - `[face]` A grievance and a deed wait in the same line at {settlement} and are settled at the same table. What leaves that table is coin, or a person on the road, because there is nowhere to keep one.
2. `[street]` The town can put a name to a wrong and cannot put a hand on whoever did it, so it charges money or sends the person off.
   - `[face]` A matter is heard, and the one it concerns leaves by the same door as the people who come to watch. Nothing is done with a person here, so the town takes coin or an empty house.
   - `[face]` Some wrongs come to the law here and some are settled between houses. The ones that come in are named, and then paid for or walked away from, because nobody is kept.
   - `[face]` A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here. Naming is what the law can do; keeping is not.
3. `[unfolding]` Whatever can be decided at {settlement} is decided, and the town holds no one past the deciding. The one who will neither pay nor go is where the arrangement runs out.
   - `[face]` A permit at {settlement} is finished where it is asked for, and a wrong is finished as far as the naming and no further. The part that would need a person kept has no place to be done.
   - `[face]` Nothing stands between a finding at {settlement} and the answer to it, because the town has no room to put a person in the meantime. A fine and a departure are near to hand, and neither needs a door that locks.
   - `[face]` A judgement at {settlement} is the whole of the town's part, because there is nowhere to keep the person it falls on. Paying or walking is that person's own choice, and the record says nothing about a refusal.

---

--- NOTES

**No refusals.** All three variants are written lawfully; none is banked.

**The test applied.** ADDENDUM 14: each face was checked by asking what would have to be
FALSE on the dossier for it to be true. Where the answer was "nothing; the record is silent",
the face stood. The card's `reads` are cited below as what each claim rests on; the flavour
rows are marked SILENCE, which under ADDENDUM 14 is permission, not a fault.

### Variant 1 · `[ledger]` · slots `{settlement}` ×1, opening (order constraint 10 kept)

Word counts: 34 · 38 · 31 · 38.

- **1.0 (canonical).** *a standing body enters and answers a wrong* ← `compound.inst.hasCourtSystem === true`, the card's predicate (`court` truthy) and its `may claim` line: the court holds as a STANDING fact. Stated as ENTERING and ANSWERING, never trying, so it is true of the `Town hall` row (`institutionServices.js:1622-1627`, civil arbitration only) as well as of the city's criminal benches — F1-12 cleared. *the same book as a licence and a levy* ← the same roster row's own recorded services, Permit applications, Tax payment, Record filing; record vocabulary free (W24 struck entire). *nowhere to put the person* ← `compound.inst.hasPrison === false`, the key's second read; the pool's discriminating claim, in capability form. *a fine or a banishment* ← two named answers, denied by nothing; exile is positively modelled (`npcLedger.js:756` the banishment door, `warAuthorityVerdict.js:23`), and the pair is written as what answers a wrong, never as a closed inventory, so the city `Workhouse` town does not falsify it. No keeper is named (card `source: SOURCE-UNRESOLVED`, F1-24 clear).
- **1.1.** *the line that pays for order carries a gaol in its name* ← the order gate's own English, *watch wages, court and gaol funding*, one charge (`defenseGenerator.js:246`). The purse is stated as ONE charge and no direction is split between its heads, so F4-02/F4-03 are clear; no shortfall, figure or total failure is claimed, so F4-04 is clear; the watch is not named, so F1-01/F1-26 are untouched. *no gaol under it* ← `hasPrison === false`. *answered in coin or in distance* ← as 1.0. *keeping a person is beyond the town* ← `hasPrison === false`, capability form.
- **1.2.** *Coin and the road are what {settlement} sets against a wrong* ← as 1.0. *neither falls the same way on one house as on the next* ← total record silence on the incidence of a fine or a banishment; SILENCE, and the licensed form of the shipped row's best asset, carried without a magnitude, a share or a totality over persons. *Nothing is kept here but the entry* ← `hasPrison === false`, written as the ABSENCE move, flat, not the opener, not adjacent to another absence.
- **1.3.** *a grievance and a deed wait in the same line and are settled at the same table* ← the roster row's own service list again (arbitration beside record filing); SILENCE supplies the queue and the table. *coin, or a person on the road* ← as 1.0. *nowhere to keep one* ← `hasPrison === false`. An unnamed person appears and acts; W22 is struck by name and no singular office the tier or the stress seats is addressed (F3-06 clear).

### Variant 2 · `[street]` · NO SLOT in any face (projector rule, ARCH §2.5 face sub-row)

Word counts: 27 · 37 · 32 · 31.

- **2.0 (canonical).** *can put a name to a wrong* ← `hasCourtSystem === true`; the naming form is true of every row behind the flag, including `Democratic assembly`, and names no building and no procedure. *cannot put a hand on whoever did it* ← `hasPrison === false`; the offender is an unnamed person, licensed. *charges money or sends the person off* ← the two answers, habitual and generic, never a particular banishment (the projector's own warning at `npcLedgerProjection.js:116` is against narrating one). No slot, no count, no rate, no date.
- **2.1.** *the one it concerns leaves by the same door as the people who come to watch* ← `hasPrison === false` read at street level: the grep covers `stocks`, so there is no post, no pillory and no public punishment apparatus (`priorityHelpers.js:54`; `institutionServices.js:1635-1639`), and the record is silent about what stands in its place. SILENCE. Present habitual throughout; no event the record did not run. *Nothing is done with a person here* ← `hasPrison === false`. *coin or an empty house* ← the two answers, landed on a household.
- **2.2.** *Some wrongs come to the law here and some are settled between houses* ← SILENCE: the record says nothing about what the town declines to bring in. Written as a STANDING condition, not a course, and the first clause affirms the law, so F1-25 (the denial direction) is clear. *named, and then paid for or walked away from* ← the predicate plus the two answers. *nobody is kept* ← `hasPrison === false`.
- **2.3.** *A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here* ← SILENCE on incidence; a cross-party condition, never a magnitude and never a comparison against an earlier state. *Naming is what the law can do; keeping is not* ← the two reads of the key stated as one capability pair. The pool's single semicolon sits here, so the pool does not collapse onto one punctuation.

### Variant 3 · `[unfolding]` · slots `{settlement}` ×1, never the opener

Word counts: 31 · 38 · 41 · 38.

Floor 2 governs this variant. Every face is simple habitual present: no perfect, no durative,
no comparative against a past, no ordinal over events, no modal future, and none of
*still* / *no longer* / *since* / *again*. The motion is a STANDING tension, never a course.
No face says the deciding is futile, so floor 4 (`defenseGenerator.js:232` court +20;
`safetyProfile.js:62-71`, `:283` the court suppresses crime) is clear. No plural courts.

- **3.0 (canonical).** *Whatever can be decided is decided* ← `hasCourtSystem === true`, and the engine's own positive model that the bench works. *the town holds no one past the deciding* ← `hasPrison === false`. *The one who will neither pay nor go is where the arrangement runs out* ← SILENCE: the record holds no answer to the person who refuses both, so the matter is stated and left standing open (the OPEN QUESTION move, declarative, no interrogative). The clause is about the arrangement's edge, not the bench's efficacy, so it asserts no futility and outruns no badge.
- **3.1.** *a permit is finished where it is asked for, and a wrong is finished as far as the naming and no further* ← the roster row's own services: the administrative business completes, the naming completes, and the step that would need a person kept does not exist. A standing asymmetry, no clock. *The part that would need a person kept has no place to be done* ← `hasPrison === false`; *would* is subjunctive, never a forecast.
- **3.2.** *Nothing stands between a finding and the answer to it* ← the two reads taken as a shape: the decision is complete and the interval that detention would occupy is absent. *no room to put a person in the meantime* ← `hasPrison === false`; the duration word sits inside a negation and asserts none. *A fine and a departure are near to hand* ← the two answers. *neither needs a door that locks* ← the denial direction of `hasPrison`, which the key itself reads, so the absence is the record's own and F1-25 does not reach it.
- **3.3.** *A judgement is the whole of the town's part* ← `hasCourtSystem === true`; *judgement* is used without a criminal reading and is the `Courthouse` row's own printed word where that row stands, so it is true on the hall-only town and on the six-bench city alike. *nowhere to keep the person it falls on* ← `hasPrison === false`. *Paying or walking is that person's own choice* ← SILENCE; an unnamed person, no named office. *the record says nothing about a refusal* ← the GAP form, a fact of the RECORD and never of the world, leaving the pool's open matter unresolved.

### Craft notes for the refuters and the refiner (the pool is the unit)

- **Twelve constructions, no permutation.** The subjects across the pool are: the town as record-keeper · the order charge · the two answers · a queue and a table · the town's capability pair · a matter and a doorway · what is brought and what is not · the incidence of a fine · what can be decided · a permit against a wrong · the missing interval · the judgement as the town's whole part. No two faces are the halves of one `A, and B` join swapped.
- **Twelve spellings of the one mandated pair**, so the claim recurs and the vocabulary does not: *a fine or a banishment* · *coin or distance* · *Coin and the road* · *coin, or a person on the road* · *charges money or sends the person off* · *coin or an empty house* · *paid for or walked away from* · *A fine ... the road* · *neither pay nor go* · (3.1 carries none) · *A fine and a departure* · *Paying or walking*.
- **Sentence shapes.** Five faces run long-then-short; four run short-then-long; one is a single sentence (2.0); one carries the pool's only semicolon (2.3). No two sentences of one face share a length and a grammar.
- **Words deliberately NOT spent anywhere in the pool:** trial, sentence as a verdict, convict, gallows, courthouse, cell, gaol except as the name on the charge and as a stated absence, stocks, pillory, irons, magistrate, mayor, captain, courts plural, and every word of the exemplar pack's north-European furniture (thatch, churchyard, market green, tavern, snow), since no defense pool reads the culture profile (F3-05).
- **An unnamed person acts in seven of the twelve** (the one the entry is written about, the one who leaves by the door, the watchers, the houses that can pay, the one who leaves people behind, the one who will neither pay nor go, the one the judgement falls on). None is named; none is the tier's or the stress's singular office.
- **Two matters stand open and are not closed:** what becomes of the one who will neither pay nor go (3.0), and what the record holds about a refusal (3.3). Neither is resolved in its own last clause.

*Ends. Draft round 1.*
