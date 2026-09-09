Block DS-DEF-2 · pool key `Internal Security: court without detention` · role spine · draft round 1 · Seat: Opus 5 (Fable-unvalidated)

The rows below are the COMPLETE REPLACEMENT for the pool's three variant rows, ready to paste under the pool's bold heading in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. The pool's typed lines and the bold heading are untouched and are not repeated. Three variants in, three variants out: same vids, same order, same angle tags, one bracketed tag per numbered row, no `[plain]` marker anywhere, none added, none removed, none merged. Four wordings per variant (the numbered line is the first wording, the three sub-rows the other three).

1. `[ledger]` The court at {settlement} hears what is brought to it, and the town has nowhere to hold the people it tries.
   - `[face]` Offences at {settlement} come before a court, and no prison stands behind the court.
   - `[face]` At {settlement} a court does the trying and no prison does the holding.
   - `[face]` A court sits at {settlement}; a prison does not.
2. `[street]` This town has a court for its wrongs and nowhere to put the people it judges.
   - `[face]` Wrongs are tried here; nobody is held.
   - `[face]` A wrong here reaches the court, and the person who did it cannot be kept by the town.
   - `[face]` Here the court works and no one is put away.
3. `[unfolding]` Offence after offence comes before the court at {settlement}, and the town has no prison.
   - `[face]` The work of the court at {settlement} goes on, and nobody who is tried stays in the town's keeping.
   - `[face]` Hearings go on at {settlement} and the town keeps nobody.
   - `[face]` A person tried at {settlement} is not a person the town can keep.

--- NOTES

## The card this pool is written against (printed, not paraphrased)

`node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: court without detention'`, run in `laneRW-DEF2`, returns:

- **role** `spine`; **reads** `court` (not-produced) and `prison` (not-produced); the note *(absent ⇒ no candidate; a modifier is silent, never "false")*.
- **predicate** `court truthy (no literal)`.
- **bag** `{band: RESERVED, route: proper, settlement: proper}`; **FILLED at this block's call sites: `{settlement}`**.
- **relation** none (a spine takes no relation); **attach** empty; **seat/form** not a seat-taker / `sentence`; **move** none declared; **angle** `ledger street unfolding`.
- **echo** spine mounts 1 (tabs: defense) · modifier mounts 0.
- **covert** no. **source** `(none) · standing SOURCE-UNRESOLVED` — *NO citation is licensed: a face naming a record holder here is refused by arm A13.*
- **may claim** that `court` (truthy (no literal)) holds, as a STANDING fact of the record.
- **may NOT** a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `law`.
- **audience** player (no mark). **REFUSED COLUMNS, always** a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.

## The one reading the whole packet rests on (a vetoable call, stated first)

The card prints **two reads** (`court`, `prison`) and **one recovered predicate limb** (`court truthy`). The pool KEY names the other limb ("court **without detention**"), and the branch this pool renders is the second arm of an else-if chain at `src/domain/display/threatAssessment.js:144-152` — `f.hasCourtSystem && f.hasPrison` first, then `else if (f.hasCourtSystem)`. The chain position, not the branch condition, is where the prison-falsy limb lives, which is why the card's predicate recovers only the court. The sibling card for `Internal Security: full legal chain (court AND prison)` recovers both limbs (`court truthy AND prison truthy`) and prints them in its `may claim`, so the recovery is positional, not a ruling that the prison limb is unlicensed.

**I have written the branch state as one compound standing fact — a court, and no prison — taking the prison-falsy limb as licensed by the card's own second `reads` row and realised as the ABSENCE move class (a) LACK (MOVE-GRAMMAR §1.2 row 11).** The card's `may NOT: a second fact` is not engaged, because the two limbs are one branch state and not two facts; `may NOT: another civic object of the class law` is not engaged, because the prison is one of this pool's own two reads and not an object brought in from outside the card (what that clause bars — and what the shipped rows breached — is a third object: a fine, an exile, a sentence catalogue, a magistrate, a code).

**If the chair reads `may claim` strictly** (the court limb alone, because that is the only limb the recovered predicate carries), then no wording of this pool may say "without detention", the pool cannot be told apart from its `full legal chain` sibling in prose, and **all three variants become refusal rows against Part B §16's first WALL (every sentence licensed by a typed field)**. That conditional refusal is recorded here in full so it can be ruled rather than discovered; the twelve wordings above are written on the compound reading, and nothing else in the packet changes if the chair instead orders the strict one — the three rows would then carry the court limb alone and lose their second clause.

## What each shipped variant carried, kept and dropped

**Variant 1, shipped:** *"{settlement} tries offences it cannot hold anyone for; the sentences available here are money and exile, and both of them fall unevenly."*

- KEPT: a court tries what is brought (the `court` limb); the town can hold nobody (the `prison` limb).
- DROPPED: **"the sentences available here are money and exile"** — a catalogue of penalties no read holds; `may NOT: another civic object of the class law`; also a second fact and a hollow particular (R-DA-10, fault 24).
- DROPPED: **"and both of them fall unevenly"** — an evaluation of how the penalties land on persons: `may NOT: a standpoint`, the REFUSED COLUMN *a totality over persons*, the VERDICT non-move (MOVE-GRAMMAR §1.3) and R-DA-12's evaluative close.

**Variant 2, shipped:** *"The town's law can name a wrong and cannot keep the person who did it, so it reaches for the purse or the road."*

- KEPT: the wrong is named and tried; the person who did it cannot be kept.
- DROPPED: **"so it reaches for the purse or the road"** — the same unlicensed penalty catalogue, joined by a causal `so`: `may NOT: a cause`, and R-DA-06's causal join is licensed only where a provenance field carries the cause (there is none on this card).

**Variant 3, shipped:** *"Each judgment {settlement} cannot enforce costs the next one a little of its weight, and the town's courts are spending down a reputation they cannot replace."*

- KEPT: judgments are given and the town cannot hold; carried as a continuing present (the `[unfolding]` angle by durative aspect alone).
- DROPPED: **"costs the next one a little of its weight"** — a cause with a trajectory across time, licensed by no event-provenance field: `may NOT: a cause`, R-DST-B / A6 (a standing configuration field licenses a structural clause and never a historical one), MOVE-GRAMMAR §1.2 row 2 (HISTORY needs event provenance).
- DROPPED: **"the town's courts are spending down a reputation they cannot replace"** — a standpoint on the court's standing, a resource metaphor doing work no field holds (R-DA-11's figure policy), and a trajectory that reads as a forecast: `may NOT: a standpoint, a future`.

Nothing is added anywhere. After the drops the three variants are claim-equal to each other as well as within themselves; that is the arithmetic consequence of the licence, not a merge — the three vids, the three angles and the pool's order all stand (§22 (a) and (e)).

## Face by face — the card clause behind every claim

Every one of the twelve wordings carries exactly two claims and no third:

- **C1** — a court holds at this settlement and tries what is brought to it. Licensed by `reads: court`, `predicate: court truthy (no literal)` and `may claim` verbatim. Realised as PRESENT / STATE (MOVE-GRAMMAR §1.2 row 1). The court's own act of hearing and trying is the read's content, not a second fact; no procedure, session, docket, bench or outcome is named.
- **C2** — the town holds nobody, because it has no prison. Licensed by `reads: prison` on the reading declared above, realised as ABSENCE class (a) LACK, stated flat, never opening a wording, never adjacent to another absence, never completed by a "but" (R-DA-02's LACK limb, R-DA-08, MOVE-GRAMMAR §1.4 wall 3).
- **Angle** is licensed per variant by the card's `angle: ledger street unfolding`, one angle per shipped tag, and asserts nothing.
- **Slot** `{settlement}` by `bag … FILLED at this block's call sites: {settlement}`; no `{band}`, no `{route}`.

| row | wording | words | C1 licensed by | C2 licensed by |
|---|---|---|---|---|
| 1 | The court at {settlement} hears what is brought to it, and the town has nowhere to hold the people it tries. | 21 | `reads: court` + `may claim` | `reads: prison`, LACK |
| 1a | Offences at {settlement} come before a court, and no prison stands behind the court. | 14 | same | same |
| 1b | At {settlement} a court does the trying and no prison does the holding. | 13 | same | same |
| 1c | A court sits at {settlement}; a prison does not. | 9 | same | same |
| 2 | This town has a court for its wrongs and nowhere to put the people it judges. | 16 | same | same |
| 2a | Wrongs are tried here; nobody is held. | 7 | same | same |
| 2b | A wrong here reaches the court, and the person who did it cannot be kept by the town. | 18 | same | same |
| 2c | Here the court works and no one is put away. | 10 | same | same |
| 3 | Offence after offence comes before the court at {settlement}, and the town has no prison. | 15 | same | same |
| 3a | The work of the court at {settlement} goes on, and nobody who is tried stays in the town's keeping. | 19 | same | same |
| 3b | Hearings go on at {settlement} and the town keeps nobody. | 10 | same | same |
| 3c | A person tried at {settlement} is not a person the town can keep. | 13 | same | same |

Claim-equal within every variant (arm A6 read across the faces, never back to the shipped sentence) and claim-equal across the pool (arm C-pair: each rewritten variant carries the licensed subset of what its shipped sentence carried).

## The walls, checked on the exact strings above

- No em dash · no exclamation · no question · no digit or numeral · no percent · no `which` in any form · no second person and no imperative · no persona and no assigned reaction.
- No citation and no record holder: no roll, register, keeper, book or office is named. `source` is SOURCE-UNRESOLVED and arm A13 refuses a face that names one; §24's provenance ceiling is unused, which is the norm the exemplar registers set (0 citations per 786 sentences).
- No cause, no causal connective, no `so`, `because`, `since`, `thus`. Every join is coordinate.
- No future indicative, no bare `will`, no forecast; no subjunctive is needed and none is used (A2, R-DA-07).
- No expletive opener (`There is` / `It is`) anywhere; the `At {settlement}` opener is a prepositional fronting, not an expletive.
- No figure, no simile, no sense verb on an abstraction, no inanimate intent: a court *sits* and *works*, a prison *stands*, hearings *go on* — all literal of the things named (R-DA-11).
- No count, no quantity band, no season, no date, no duration word. The iterative shapes (`offence after offence`, `trial`→`hearings go on`, `the work … goes on`) are aspect, not time-reckoning and not a trajectory.
- The negatives (`nobody`, `no one`, `nowhere`, `no prison`, `keeps nobody`) are the LACK stated flat about the town's provision, not the refused **totality over persons**; no wording says what every person does, is or owes, and no exemption from a duty is written (`whoIsExempt` is null everywhere).
- No named character, no fate, no deity, no theology.
- No wording opens on `{settlement}`: ARCH §2.5's seam contract (T-F8) refuses a sentence-form row opening on a `proper`-typed slot. The shipped `[ledger]` and `[unfolding]` rows opened on the token; that opening is given up to a wall, and the pool now sits at zero against MOVE-GRAMMAR §1.4 wall 10 and R-DA-17's register share.
- Slot sets are constant inside every variant, and match the shipped rows': variants 1 and 3 carry `{settlement}` once in all four wordings, variant 2 carries none in all four (ARCH §2.5's face refusal — a face whose `{slot}` set differs from the parent's).
- Two segments at most in any wording; no third sentence and no third segment anywhere (R-DA-03's 3+-segment share).
- One term for one thing (R-DA-22): the institution is `court` throughout and is never a bench, a hall or a seat; the absent thing is `prison` throughout and is never a cell, a gaol or a lockup; the act of detaining is carried by `hold` and `keep` and by the street idiom `put away` in the `[street]` variant alone. The variation is subject, voice, rhythm and construction, never a thesaurus.

## THE THREAD (§1.4.1), checked wording by wording

The spine goes first in any composed passage, so every wording must hand a noun forward and must read whole after any sibling modifier the composer seats behind it. None of the twelve depends on a sentence outside itself: no anaphor points outward, and the only pronouns (`it`, `its`) resolve inside their own clause.

- 1 — the court's act is carried into the second clause by `the people it tries`; the turn to `the town` is the passage's one turn outward and sits last.
- 1a — `court` is carried forward whole (a deliberate noun echo, lawful under §1.4.1).
- 1b — the second clause repeats the first's frame (`does the trying` / `does the holding`), so the connection is the construction itself.
- 1c — the verb is carried forward by ellipsis.
- 2 — one subject throughout.
- 2a — the turn from the wrongs to the persons sits last.
- 2b — `the person who did it` picks up `a wrong`.
- 2c — the turn outward sits last.
- 3 — the offences are the court's; the turn to `the town` sits last.
- 3a — `nobody who is tried` picks up `the work of the court`.
- 3b — the turn outward sits last.
- 3c — one clause, one subject.

Every wording also closes on a civic noun or a present condition of one, so a modifier seated after it has something to pick up: the trying, the court, the holding, the prison, the town, the keeping.

## Neither restating nor contradicting the neighbours (arms A1 and A11)

The three sibling pools of this row are the branches this one is told apart from: `full legal chain (court AND prison)` (a process the town can run end to end), `detention without process` (holding with no grounds), `no legal infrastructure` (order on force alone). No wording here claims a process, grounds, machinery, enforcement or force, and none of their phrasings is reused — `a process rather than a threat`, `a procedure rather than a favour`, `on what grounds`, `force alone` appear nowhere. The watch's temper, criminal presence and public order belong to DS-DEF-3 and DS-DEF-4 and are not touched. The block's other four rows (Beasts & Monsters, Invasion & War, Economic Survival, Disasters & Famine) share no vocabulary with these twelve. The block's known modifiers (`stores: short`, `stores: import-fed`) attach behind the `granary AND hospital` spine and never behind this one, so no wording is written to accommodate one, though each closes so that it could carry one.

## Grammar assignment (recorded, not written into the rows — the `grammar:` tag is not this packet's to add)

Level-1 members drawable on this card: **V1** (PRESENT on the compound branch state) and **V3** (PRESENT → LACK). V2 needs a structural-consequence field, V4 a named-object field, V5 an institution row (both reads not-produced, source unresolved), V6 a state field valued unresolved, V8 a typed `not-held` record field with provenance, V7 is R2 only — none is drawable, and none is written empty (MOVE-GRAMMAR §3.1).

Wordings 1b and 1c state the compound branch state in one predicate frame and read as **V1**; the other ten state the court and then the lack in their own clause and read as **V3**. That is two distinct grammars over three variants, which meets min(k, |set|) = 2 (A11 via MOVE-GRAMMAR §2.1) only through the faces, not through the numbered rows alone — a classification the walker lane may veto. **If the chair rules that the pool's grammar spread is counted on the numbered rows only, this pool cannot meet the floor**, because a two-limb branch state admits one order (PRESENT → LACK) and the licence supplies no second field for a third move. That is a card-shaped limit, not a wording fault, and it is recorded rather than papered over.

## Measured on this packet (information only — §21.1: position inside a band is never a target)

Twelve wordings; word counts 21, 14, 13, 9 · 16, 7, 18, 10 · 15, 19, 10, 13; mean 13.75; within-pool sd 4.29 (sample) and 4.11 (population), against R-DA-05's within-pool floor of 4.0 on either estimator. One wording under eight words (7) and three of eighteen or more, so the short line and the long line both exist. Openers, all twelve distinct in their first two words: `The court` · `Offences at` · `At {settlement}` · `A court` · `This town` · `Wrongs are` · `A wrong` · `Here the` · `Offence after` · `The work` · `Hearings go` · `A person`; no two variants share their first two words at the numbered-row level either. Pronoun closers: zero of twelve. Close kinds used: an object (the court, the prison, the town), a condition (the trying, the holding, the keeping), an absence (nobody, no one) — three of R-DA-04's five; a prohibition and a name-not-given are unreachable on a card that licenses no duty and no names. Semicolons: two of twelve (1c, 2a); colons: none; every other join is a comma with `and` or none at all. Sentence count: one per wording, matching the shipped rows, which are one apiece.

## Refusals

**None at the variant level.** All three variants are written, and all three are lawful on the card reading declared above.

Two conditional refusals are recorded so the chair rules them rather than finds them:

1. **The strict card reading** (`may claim` = the court limb alone). Under it all three variants fail Part B §16's first WALL, because the second clause of every wording asserts the prison limb; the pool would then be three refusal rows, and the shipped rows would fail the same wall for the same reason. The law it cannot meet: *every sentence licensed by a typed field*, on a card whose recovered predicate carries half the branch.
2. **The grammar-spread floor counted on numbered rows only** (A11 via MOVE-GRAMMAR §2.1's min(k, |set|)). Under that counting this pool cannot meet the floor with a two-limb standing state and no second licensed field. The law it cannot meet: *a pool of k variants carries min(k, 8) distinct level-1 grammars*.

One further call is recorded, not refused: wording 1c (`A court sits at {settlement}; a prison does not.`) pairs the affirmative and the negative limb in one elliptical frame. I read that as the compound branch state, not as R-DA-02's CONTRAST move, because no sibling pool key or band word is named as a rejected alternative and the shape is not fronted. If the chair reads it as a contrast, it is still licensed — the rejected alternative is the sibling pool key `Internal Security: full legal chain (court AND prison)` — and it is the pool's only wording of that shape, so wall 5's one-per-pool ceiling holds either way.
