# DS-DEF-2 · `Invasion & War: walls with citizen militia` — REWRITE, draft round 1

Seat: Opus 5 (Fable-unvalidated), writer, block DS-DEF-2, draft round 1.
Role: spine (the card takes no relation, no attach, no move). Form: sentence.
Three existing variants, rewritten in place under their own numbers, their bracketed
tags untouched, none added, none removed, none merged. The typed lines of the pool
(ROLE / READS / SLOTS / SECTION-TARGET) are not repeated here and are not touched.

Paste the block below under the pool's bold heading, in place of its three numbered rows.

---

1. `[ledger]` `[plain]` Walls at {settlement} are held by the town's own people. That answers a raid and not a company that comes professionally with a siege train.
   - `[face]` The townspeople of {settlement} hold their own wall, and raiders are the limit of what it holds. Professionals with a siege train are past that limit.
   - `[face]` Raiders do not get past the townspeople on the wall at {settlement}. A professional force with a siege train would.
   - `[face]` Behind the wall at {settlement} stands a militia of the town's own people, credible against raiders and not credible against professionals who arrive with a siege train.

2. `[street]` `[plain]` The town would turn out. A turnout is not a defence.
   - `[face]` Townsfolk would come out. What comes out is a militia and not a defence.
   - `[face]` The muster would fill, and a muster on its feet is not a defended town.
   - `[face]` Turning out is what this town would do, and it is not the same as being defended.

3. `[unfolding]` `[plain]` What stands at {settlement} would hold against a raid and is unlikely to hold against a professional force. The arrangement that meets the first meets the second.
   - `[face]` A raid would be held at {settlement} and a professional force would not. The defence is the same in each case.
   - `[face]` Against raiders what {settlement} has would serve. Against a professional force the same holding would not serve.
   - `[face]` The means this town has would answer a raid at {settlement}. Those same means would not answer a professional force.

---

--- NOTES

## 0. The card this pool is written against (printed, `scripts/prose-licence-card.mjs`)

- **predicate** `invasionRowSituation(walls, garrison, militia) === walls, citizen militia`
- **may claim** that the situation holds, as a STANDING fact of the record
- **may NOT** a count · a cause · a season · a future · a standpoint · a second fact ·
  another civic object of the class `force`
- **bag** `{band: RESERVED, route: proper, settlement: proper}`; FILLED at this block's
  call sites: `{settlement}` alone
- **source** muster · standing LICENSED (a citation licensed where the provenance budget allows)
- **angle** ledger street unfolding · **covert** no · **audience** player (no mark)
- **REFUSED COLUMNS** a totality over persons; an exemption from a duty; a named character
  and that character's fate; a theological claim

Clause labels used below: **(P)** the predicate line · **(M)** the may-claim line ·
**(B)** the bag line · **(A)** the angle line · **(S)** the source line.

## 1. The claim set carried, per variant (arm A6: the four wordings of a variant are claim-equal)

**Variant 1 `[ledger]` — four claims**
- c1 walls stand at the settlement — **(P)** `walls` true, **(M)** as a standing fact.
- c2 the people on them are the town's own, a citizen militia — **(P)** `citizen militia`, **(M)**.
- c3 the arrangement is credible against a raid — **(P)** read with the block's row identity
  (`Invasion & War`), **(M)**. See §3 R3.
- c4 the arrangement is inadequate against an attacker who arrives professionally and brings
  siege equipment — same licence as c3; the professionalism and the siege train are properties
  of the hypothetical attacker, never a negated civic object of this town (§3 R7).
- The slot `{settlement}` in each wording — **(B)**; no wording opens on it (ARCH §2.5, T-F8).
- The ledger angle (the compiled flat statement) — **(A)**, a HOW, no claim.

**Variant 2 `[street]` — two claims, and no slot**
- c5 the town would turn out — **(P)** `citizen militia` (a citizen militia turning out is the
  militia's own standing form), **(M)**; subjunctive throughout (A2, STATE never FATE).
- c6 a turnout is not a defence — the militia half of c3/c4; **(P)** read with the row identity, **(M)**.
- The BEFORE carries no `{settlement}`; every wording of variant 2 is written slotless so the
  face `{slot}` set matches its parent and the pair instrument's SLOTS arm (`check-pair.mjs:67-68`)
  stays silent.
- The street angle — **(A)**.

**Variant 3 `[unfolding]` — three claims, at the BEFORE's referent level**
- c1' what the settlement has would hold against a raid — **(P)**, **(M)**, subjunctive.
- c2' it is unlikely to hold against a professional force — **(P)**, **(M)**.
- c7 the same arrangement meets both cases — **(P)**: the branch names ONE configuration, so the
  identity across the two threat classes is the predicate restated, **(M)**. This is the lawful
  rendering of the BEFORE's "nothing in hand changes that" (§3 R2).
- No wording of variant 3 names the wall or the militia: the BEFORE said "what {settlement} has",
  and holding that referent level keeps the pair instrument's claim key unchanged (§3 R6).
- The unfolding angle is carried by aspect (what stands, what meets, the same means), never by a
  trend verb or a future — **(A)** with the card's `may NOT: a future`.

## 2. Per wording: which clause licenses each claim

| # | wording | words | claims | licence |
|---|---|---|---|---|
| 1 | `[plain]` Walls at {settlement} are held… | 25 | c1 c2 c3 c4 | P, M, B, A |
| 1 | `[face]` The townspeople of {settlement} hold their own wall… | 26 | c1 c2 c3 c4 | P, M, B, A |
| 1 | `[face]` Raiders do not get past the townspeople… | 20 | c1 c2 c3 c4 | P, M, B, A |
| 1 | `[face]` Behind the wall at {settlement} stands a militia… | 27 | c1 c2 c3 c4 | P, M, B, A |
| 2 | `[plain]` The town would turn out. A turnout is not a defence. | 11 | c5 c6 | P, M, A |
| 2 | `[face]` Townsfolk would come out… | 14 | c5 c6 | P, M, A |
| 2 | `[face]` The muster would fill… | 15 | c5 c6 | P, M, A |
| 2 | `[face]` Turning out is what this town would do… | 17 | c5 c6 | P, M, A |
| 3 | `[plain]` What stands at {settlement} would hold… | 27 | c1' c2' c7 | P, M, B, A |
| 3 | `[face]` A raid would be held at {settlement}… | 21 | c1' c2' c7 | P, M, B, A |
| 3 | `[face]` Against raiders what {settlement} has would serve… | 17 | c1' c2' c7 | P, M, B, A |
| 3 | `[face]` The means this town has would answer a raid… | 20 | c1' c2' c7 | P, M, B, A |

No wording asserts a count, a cause, a season, a future, a standpoint, a named person, an
office, an exemption, a duty, a totality over persons, or a civic object of the class `force`
other than the militia the predicate names. No em dash, no exclamation mark, no digit, no
percent, no which-clause, no question, no second person, no existential opener, no figure.
Every hypothetical is subjunctive (`would`).

## 3. Refusals, removals and the rows the chair owes a ruling on

**R1 — REMOVED, a standpoint (variant 2).** The BEFORE reads "…and does not pretend that
turning out is the same as being defended". "Does not pretend" asserts the town's own belief
about itself: the card's `may NOT: a standpoint`, and MOVE-GRAMMAR §1.3's FEELING non-move
("no field carries motive, belief or mood"). Ruling 5 as R-DA-15 states it requires the removal
of a claim the pool was not entitled to hold, so the standpoint is gone and the substantive
claim (c6) is kept in all four wordings. **Chair row:** the pair instrument will read this as a
claim LOST, not merely unadded; it is a deliberate removal under ruling 5, not a trim (the
variant keeps its slot, its number and its tag; §22(a) and §22's "shortening inside the band").

**R2 — REMOVED, an unlicensed totality (variant 3).** The BEFORE closes "…and nothing in hand
changes that". "Nothing in hand" quantifies over the whole of what the town holds; a quantifier
is licensed only by `closed` on the quantified column (R-DA-15(i); CLERK-LAWS C4) and the card
declares no `closed` flag. It is rendered instead as c7, the identity of the arrangement across
the two threat classes, which is the predicate restated and carries the same force. **Chair
row:** same class as R1 — a claim narrowed, not dropped, and visible to `check-pair.mjs`.

**R3 — CARRIED WITH A REFUSAL CONTINGENT: the assessment halves.** c3, c4 and c6 say what the
configuration is worth against a raid and against a professional attack. The card's `may claim`
line licenses only "that the situation holds, as a STANDING fact", and its `may NOT` line bars
"a second fact". Two readings:
- (i) the reading this draft is written under — the block is the five-row THREAT ASSESSMENT and
  the row is `Invasion & War`, so what the configuration is worth against invasion IS the
  situation's own semantic content, not a second fact from a second field;
- (ii) the strict reading — the assessment is a second fact, in which case **all three variants
  and all twelve wordings fail the card**, and so does every wording the BEFORE shipped. Under
  (ii) the pool cannot be made lawful at all: stripped of the assessment the row would say only
  that walls and a militia exist, which is DS-DEF-5's block restated (arm A1) and leaves the
  threat-assessment row with no content.
  **The chair's ruling is owed. This draft is unlawful under (ii) and lawful under (i).**

**R4 — the PROVENANCE move DECLINED.** The card licenses the muster as a source and says a
citation is allowed where the budget permits. None of amendment S3's three reasons is met here:
no count is licensed on this card, no two accounts disagree, and the muster is not typed as a
power in this town. Part B §24 puts the exemplar rate at zero citations in 786 sentences, so a
citation on a fact with no S3 reason would be the citation habit a refuter names. No wording
cites a holder.

**R5 — a dangling deictic resolved (variant 3).** The BEFORE says "the first thing" and "the
second" with no antecedent inside the variant; the antecedent lives in variant 1, which never
co-renders with variant 3. All four wordings name the two threat classes (a raid, a professional
force). **Chair row:** read here as a specification of the claim the BEFORE already made, not an
added claim; the pair instrument will see two new nouns.

**R6 — variant 3 held at its referent level.** The card would license naming the wall and the
militia in variant 3, but the BEFORE said "what {settlement} has"; naming them would add nouns
the BEFORE did not carry. Every variant-3 wording says "what stands", "the defence", "the same
holding", "those same means".

**R7 — the A0b narrowing avoided everywhere.** ARCH §6.4 records that whether `citizen militia`
implicitly claims *no professionals* is the undecided planted case. No wording claims the town
keeps no professional soldiers; in every wording the professionalism belongs to the attacker.

**R8 — format note.** The brief asks for the number, the existing bracketed tag, a `[plain]`
line and three `[face]` sub-rows; ARCH §2.5's example carries `[plain]` in the tag position
where the shipped corpus carries the angle. Both are printed above (`` `[ledger]` `[plain]` ``).
If the projector's tag branch admits one bracketed token per row, drop `` `[plain]` `` and the
rows stand unchanged.

## 4. Spread, band position and the walls checked

- Twelve distinct first-two-word openers across the pool: *Walls at · The townspeople · Raiders
  do · Behind the · The town · Townsfolk would · The muster · Turning out · What stands · A raid
  · Against raiders · The means* (A11; no two share their opener).
- Word counts 11 to 27; pool sd well above the 4.0 floor (R-DA-05); one wording under twelve
  words (the short line exists), four over 24, none over 30 (R-DA-06's >30 ceiling untouched).
- Close kinds varied (R-DA-04): object (siege train, force, town), condition (the limit, would,
  serve, unchanged/each case, defended), a name not given (the second). No pronoun closer.
- Joints: one per sentence, and every joint a comma with a plain connective; no colon and no
  semicolon in the pool (the BEFORE's one colon is spent, R-DA-06's colon budget unused); no
  comma tail carrying a second fact; no third sentence anywhere (R-DA-03).
- THE THREAD: every two-sentence wording carries a noun or its anaphor forward — *people → That
  · wall → the limit · townspeople → would · what stands → the arrangement · would be held → the
  defence · what {settlement} has → the same holding · means → those same means*. Where the last
  sentence changes subject to the attacker (variant 1's third wording) it is the passage's one
  turn outward and sits last.
- Each wording is written to stand first in the passage (this pool is a spine) and to end on a
  noun a following modifier can pick up: the wall, the townspeople, the militia, the muster, the
  means, the defence. ARCH §6.4 records this cell at k = 0, so no modifier attaches to it today.
