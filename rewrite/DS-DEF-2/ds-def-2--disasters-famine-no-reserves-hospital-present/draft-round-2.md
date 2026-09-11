# DRAFT ROUND 2 — DS-DEF-2 · `Disasters & Famine: NO reserves, hospital present`

Seat: Opus WRITER (Opus 5, Fable-unvalidated), for the Fable chair. This file is the only thing this
seat wrote, anywhere. `laneRW-DEF2` was READ only; the only thing executed there was the read-only
licence-card script the brief names. Nothing in any dock was edited, committed or tested.

Continued from `draft-round-1.md` in the same directory (the checkpoint law: round 1 was read whole
first and what was sound is KEPT verbatim). Written against the same authorities round 1 names: the
printed licence card; `skeleton.md` (read whole, VARIANT 3 re-read in full for this round); the annex
rows at `RECEIPT_POOLS_DOSSIER_STATE.md:2922-2934` with the sibling pools above and below it;
REGISTER-CARD.md with S2 and S3; RULES-V2-PART-B §1, §16–§16.2, §18, §20, §21–§21.4, §22, §23, §24;
MOVE-GRAMMAR §1–§3, §1.4.1, §4.4.1–§4.4.3; CLERK-LAWS §2.4.1 and §2.6.1; ARCH v2 §2.5 and §8.3;
brief ADDENDUM 13 parts A and B (W11–W27); the ten writer rules W1–W10; R-i · R-ii · R-iv · R-vi ·
R-viii′.

**THREE variants rewritten in place, in order, each under its own vid and its own ONE angle tag.
TWELVE faces. ZERO refusals. TWO faces changed from round 1; ten carried byte-unchanged.**

---

## THE GATE'S TWO MEASURES, ANSWERED (this is what round 2 is for)

| the gate's row on round 1 | where it lands | what round 2 does |
|---|---|---|
| band depth · `shapes.participialOpenerRate` (over) = **13.62** band-widths on **1 of 12** faces | VARIANT 3, face 2 — `Standing at {settlement} are those tending the sick.` The metric is `first.filter(w => /ing$/.test(w) && !NOT_PARTICIPLES.test(w))` over the face's sentences (`proseFingerprint.js:141`), so the single `-ing` first word on a two-sentence face reads **0.5** | the participial opener is **struck**. The face keeps its INVERSION, its two sentences, its second subject and its landing noun; the fronted element becomes the `[unfolding]`'s own deixis, which this block already uses on an `[unfolding]` row (`Grain stays in store here`, the `granary, NO medical provision` pool). New reading: **0** |
| band depth · `punctuation.colonRate` (over) = **6.987** band-widths on **1 of 12** faces | VARIANT 3, face 3 — `… those tending the sick: against hunger, no granary stands.` The metric is `count(/:\s/)` over sentences, so one colon on a one-sentence face reads **1.0** | the colon is **struck**. The face keeps its pseudo-cleft subject and gains the pool's one PAIRED CLEFT, which is the skeleton's own "kept as a shape" for this variant (§(6): *something standing against the one pressure and nothing standing against the other, in one unit, presence first*). New reading: **0** |

**No other face is touched.** Variants 1 and 2 cleared every band in round 1 and are carried
byte-unchanged; §21.2's push toward the ceiling is Phase 2's, by a different author, and a draft round
that rewrites passing faces on its own motion risks a new failing measure for no measured gain
(§21.3: where one effort must choose, the licensed one wins).

**Verification of the two new faces against the fingerprint's own 21 formulas** (computed from
`src/domain/prose/proseFingerprint.js:97-150` as it stands in the dock, on the face text with
`{settlement}` counted as one word, nothing written and nothing executed in the dock):

| face | sentences | words | every one of the 21 metrics |
|---|---|---|---|
| v3 face 2, round 1 | 2 | 8 + 8 | `participialOpenerRate` **0.5**; all twenty others 0 |
| v3 face 2, **round 2** | 2 | 8 + 8 | **all twenty-one 0** |
| v3 face 3, round 1 | 1 | 14 | `colonRate` **1.0**; all twenty others 0 |
| v3 face 3, **round 2** | 1 | 19 | **all twenty-one 0** |

Both replacements are therefore cleaner on the instrument than two faces round 1 already PASSED
(`v1 face 2` reads `under8` 0.5 and `neighbourVariation` 0.133; `v2`'s numbered line reads `under8`
1.0), so no new measure is put at risk.

---

## THE ROWS (the complete replacement for the pool's variant rows; paste under the pool's bold heading)

1. `[ledger]` Those tending the sick are entered at {settlement}, and against hunger no granary is entered.
   - `[face]` Carried at {settlement} are those tending the sick. The town carries no granary against hunger.
   - `[face]` Set down at {settlement} are those tending the sick, and against hunger no granary is set down.
   - `[face]` The town of {settlement} has those tending the sick entered, and against hunger no granary is entered.
2. `[street]` The town has those tending the sick. Against hunger the town keeps no granary.
   - `[face]` Those tending the sick are in the town, and against hunger it has no granary.
   - `[face]` What the town has are those tending the sick, and against hunger no granary.
   - `[face]` In the town are those tending the sick, and against hunger no granary at all.
3. `[unfolding]` Those tending the sick stand at {settlement}, and against hunger no granary stands.
   - `[face]` Here at {settlement} stand those tending the sick. Against hunger the town stands with no granary.
   - `[face]` What stands at {settlement} are those tending the sick, and what does not stand is a granary against hunger.
   - `[face]` The town of {settlement} has those tending the sick standing and no granary standing against hunger.

--- NOTES

### 0. THE FOUR CLAIMS EVERY ONE OF THE TWELVE FACES CARRIES, AND THE CLAUSE THAT LICENSES EACH

Unchanged from round 1, and unchanged by the two new faces: the claim set is IDENTICAL in all twelve
(arm A6 reads across the faces). The key is the CONJUNCTION `hasGranary === false && hasHospital ===
true`, so a face naming one half prints a sibling cell's fact (skeleton §261); every face states both
halves in the fixed order.

| the claim, as every face makes it | the surface used | the card clause / law that licenses it |
|---|---|---|
| C1 — a CARE-class row stands on this town's record | **those tending the sick** (this spelling and no other, in all twelve faces) | the card's `reads` / `predicate`: `disasterRowSituation(granary, hospital, church) === no reserves, hospital` is reached only on `hospital === true`; `may claim:` the row is selected **as a STANDING fact of the record**. The spelling is fixed by the alias bar (A-15; W15), the only always-safe form of `hasHospital` — true of a hospital, a monastery and a healer alike. Layer BODY (REFERENT-TABLE row 63) |
| C2 — NO GRANARY stands on this town's record | **no granary** / **what does not stand is a granary** (the body word negated at the roster grain, never a stock word) | the same `reads` / `predicate`: reached only on `granary === false`; the LACK move (MOVE-GRAMMAR §1.2 row 11 class (a), licensed by a `none-exists` field, its own examples being body words negated) and R-DA-08's declared gap, written **in the record, never in the world**. Layer: the negated BODY (marker open row 1) |
| C3 — the conjunction itself, presence FIRST and absence SECOND | the fixed order of every face, the two NEW faces included | the card's `predicate` is the conjunction; the order is a WALL, not a band — an ABSENCE never opens (MOVE-GRAMMAR §1.4 wall 3; R-DA-08; the register card's absence clause) |
| C4 — hunger is the pressure a granary answers to | **against hunger** (bare, generic, in all twelve faces) | the ROW'S LABEL at its ENGINE meaning (W14) — `Disasters & Famine` is the fifth readiness row's label (`threatAssessment.js:190`), and the block's subtitle is *the five pressures, and what the town actually has standing against each* — with D-12's ENTAILED purpose of the recorded noun (`granary`: grain is stored; it buffers a harvest). Named as a CLASS, never an event, a season, a harvest, a year or an outcome (W17, W18, R-DA-16) |
| the `{settlement}` token, in variants 1 and 3 only, never as the first token of any face | `at {settlement}` · `Here at {settlement}` · `The town of {settlement}` | the card's `bag: {settlement: proper}`, FILLED at this block's call sites; the parent slot sets are kept exactly (ARCH §2.5: a face whose `{slot}` set differs from its parent's is REFUSED) — vid 1 `{settlement}`, vid 2 `{}`, vid 3 `{settlement}`. `{band}` is RESERVED and `{route}` unfilled: no face names either and no face speaks a band word |

**SICKNESS IS SPOKEN ONCE PER FACE, NOT TWICE (W6).** `against sickness` beside `those tending the
sick` is the DOUBLED BEAT — a clause restating the read it follows — because the body's own safe
spelling already names its pressure. The pressure class is therefore spoken on the half where it is
not a restatement. Both new faces obey this.

**CITATION COUNT: ZERO, in all twelve faces.** The card prints `source: (none) · standing
SOURCE-UNRESOLVED` and "NO citation is licensed: a face naming a record holder here is refused by arm
A13". No face carries a record NOUN either (W24: on a read that resolves no holder, no record word at
all) — `entered`, `carried`, `set down`, `stands`, `stand`, `has`, `keeps` are VERBS; the office's own
formula is the `[ledger]`'s lawful surface (R-vi, W7) and the tag is a STANDPOINT licensing no noun.

### 1. VARIANT 1 · `[ledger]` — CARRIED BYTE-UNCHANGED FROM ROUND 1

The angle's stance, the construction contract and every face's licence stand exactly as
`draft-round-1.md` §1 records them and are not restated here. **Declared construction (W4): THE
RECORD'S ACT** (`entered` · `carried` · `set down`). Level-1 grammar V3 (PRESENT → LACK). Four faces,
15 · 15 · 17 · 17 words; subjects care-body / fronted-participial-inversion / fronted-participial-
inversion / naming form; landings absence / pressure / `set down` / `entered`. Gate reading on all
four: inside every band.

`Carried` and `Set down` are PAST participles, not `-ing` forms, so neither is counted by
`shapes.participialOpenerRate` (`/ing$/` on the first word); the gate confirmed this by failing one
face only, and that face was vid 3's.

### 2. VARIANT 2 · `[street]` — CARRIED BYTE-UNCHANGED FROM ROUND 1

As `draft-round-1.md` §2. **Declared construction (W4): THE TOWN'S HAVING** (`has` · `keeps`), never
the entry formula and never the present standing. No `{settlement}` in any face (parent slot set
`{}`). Four faces, 14 · 15 · 14 · 15 words. No field here holds anything the town knows, says,
believes, feels, values or minds, so no face reports any of it (W22, W23, R-DA-13/14, the FEELING
non-move). Gate reading on all four: inside every band.

### 3. VARIANT 3 · `[unfolding]` — TWO FACES REWRITTEN, TWO CARRIED

**The angle's stance realised (skeleton §(5); R-iv).** The pair set out AS IT NOW STANDS — a care row
standing, no granary standing — with one matter left standing open in the present by what the face
declines to say: the stock the town actually holds, which no field on this card reads and which no
face guesses at. Under skeleton §(4) the OPEN QUESTION move is NOT licensed as a sentence here (no
typed field on this card carries an unresolved, contested, pending or unmet value), so the
standing-open matter is realised exactly as the register card permits — *stated, never asked* — by the
face stopping where the card stops.

**The variant's declared construction (W4), UNCHANGED BY THIS ROUND: THE PRESENT STANDING** (`stand` ·
`stands` · `standing`). Both new faces keep it in their main verb, so W4's construction contract holds
and neither face moves onto vid 1's entry formula or vid 2's plain having.

| face | words | construction (subject · order of reads · landing noun) | round 2 | the licence, beyond C1–C4 |
|---|---|---|---|---|
| 1 (the numbered line) | 13 | care-body SUBJECT · one sentence · `and` joint · lands on `stands` | **unchanged** | the shortest face in the pool; the short line exists (R-DA-05; NL-2's rhythm-follows-load) |
| face 2 | 16 (8 + 8) | **deictic INVERSION** · postposed subject · two sentences · the town as the second subject · lands on `granary` | **REWRITTEN** | see §3.1 |
| face 3 | 19 | **PAIRED CLEFT** · `what stands` as subject, `what does not stand` as the second subject · one sentence · lands on `hunger` | **REWRITTEN** | see §3.2 |
| face 4 | 16 | the naming form as SUBJECT · active with participial complements · gapped · lands on `hunger` | **unchanged** | `The town of {settlement}` per W5; it states no band and needs no generic article to carry one |

#### 3.1 Face 2, rewritten — `Here at {settlement} stand those tending the sick. Against hunger the town stands with no granary.`

- **What changed and why.** Only the fronted element. `Standing` → `Here at {settlement}`. The
  INVERSION is kept (the subject `those tending the sick` still follows its verb), the two sentences
  are kept, the second subject `the town` is kept, the landing noun `granary` is kept, and the word
  count is unchanged at 8 + 8. The claim set is untouched, so A6 across the faces is unaffected.
- **`Here` is licensed, and it is the `[unfolding]`'s own word in this block.** It is a deixis of the
  record's standpoint, not an address to a reader (R-DA-01's no-you is untouched; the register card's
  audience law holds). The block's rewritten sibling pool `granary, NO medical provision` carries it on
  its own `[unfolding]` variant — *Grain stays in store here* — so the stance's established surface in
  DS-DEF-2 is being used, not invented. It asserts nothing: it adds no claim, no place fact, no
  GEOGRAPHY move, and no second referent.
- **`Here at {settlement}` is NOT a settlement-token opener** and does not touch wall 10 or T-F8. T-F8
  refuses "a sentence face opening on a `proper`-typed slot of the block's bag" (ARCH §2.5's face row,
  §4.2 step 8) — the first token is `Here`, a bare common word, which is exactly the token class the
  composer's down-case is allowed to case. The skeleton's instruction for this variant (*`{settlement}`
  in every face, never as the opener*) is met literally: the slot is the third word. No face of this
  pool opens on the token, so the pool sits at **zero** against wall 10's allowance of one — as in
  round 1.
- **The thread at k = 0 (R-i, MOVE-GRAMMAR §1.4.1).** The second sentence carries **the town** forward
  from `{settlement}`, which is the same device round 1's `v1 face 2` uses and the gate passed. The
  deliberate noun echo for the thread is lawful (§1.4.1: A11's echo bound counts facts, not nouns).
- **W10** — one negated surface (`no granary`), on the ABSENCE read, second. **Wall 3** — the absence
  never opens; the presence sentence is first. **W6** — the second sentence states the other half of
  the key, not a restatement of the first.
- **The instrument:** all 21 metrics read 0.

#### 3.2 Face 3, rewritten — `What stands at {settlement} are those tending the sick, and what does not stand is a granary against hunger.`

- **What changed and why.** The colon joint is struck and the gapped second clause is promoted to a
  second cleft, so the face now carries the pool's one PAIRED construction. The pseudo-cleft subject
  (`What stands`) is kept, the one-sentence form is kept, the present-standing verb is kept in both
  limbs. The landing moves from `stands` to `hunger`, which removes round 1's duplicate landing with
  the numbered line.
- **This is a move toward the ceiling, not only a gate fix (§21.1, §21.3, §21.4).** The skeleton's
  §(6) names exactly one thing in vid 3's shipped sentence worth keeping — *the paired frame:
  something standing against the one pressure and nothing standing against the other, in one unit,
  presence first*, kept as a shape with every noun and every relative clause inside it refused. Round
  1 carried that shape only as a comma-gapped tail. The double cleft states it whole, with both bodies
  named at their own layer and both relative clauses still struck. The density floor is therefore
  raised by this round, not spent: the replacement is sharper than the line it replaces and no plainer
  than the shipped clause it descends from.
- **It is NOT a CONTRAST and NOT the refused GRADE.** Wall 5 bars a contrast whose rejected
  alternative is fronted as the subject; there is no rejected alternative here — the two limbs are the
  two halves of the SAME key, stated in parallel, neither measured against the other. The skeleton's
  §(7) regression list names *the grade re-kept — "the imbalance", "lopsided", "uneven", "the wrong way
  round", "one and not the other" as a judgment rather than as the two facts*; this face states the
  two facts and passes no judgment, ranks nothing, and reads no badge. The `shapes.antithesisRate`
  detector confirms it mechanically: the face reads **0** on that metric (no `not X but`, no `rather
  than`, no `, not <lower-case>`, no `less … than`).
- **W10** — exactly one negated surface (`does not stand`), on the ABSENCE read, second; `a granary`
  is itself positive, so the face carries no second negation.
- **The LACK is written at the roster grain, in the record.** `what does not stand is a granary` is
  the `none-exists` field spoken as the LACK move's own class (a) — the body word negated — and not a
  claim about the town's lived world (R-DA-08). No stock word, no capability verb, no season and no
  cause enter with it.
- **The thread.** One sentence, so R-i is not engaged; the two limbs share the verb `stand` and the
  cleft frame, which is what holds the unit together for the composer's k = 0 reading.
- **The instrument:** all 21 metrics read 0 — including `triadRate` (one comma only), `doubledAdjectiveRate`
  (the comma breaks the `X and Y` adjacency) and `closers.abstractNounRate` (`hunger` is not a
  `-ness/-tion/-ity/-ment` closer).

#### 3.3 What did NOT change in variant 3, and why that is deliberate

- The **numbered line and face 4** are byte-unchanged. Both cleared every band; §22's never-trim and
  §21.3's "the licensed one wins" both argue against churning a passing face inside a draft round.
- The **landing-noun spread** is now `stands` / `granary` / `hunger` / `hunger`. Round 1's was
  `stands` / `granary` / `stands` / `hunger` — one duplicate in each, so the spread is held, not lost.
  Re-landing face 4 to break the remaining duplicate was considered and **declined**: it is a passing
  face, the change would alter its declared gapping, and the four faces already differ in SUBJECT and
  in CONSTRUCTION, which is what W4 and the brief's "THE FOUR FACES DIFFER IN CONSTRUCTION" require.
  Recorded here for the chair as a vetoable call.
- The **openers within the variant** are `Those` · `Here` · `What` · `The` — four distinct first
  words, as in round 1.

### 4. WHAT THE SHIPPED ROWS CLAIMED THAT IS DROPPED, WITH THE LAW

Unchanged from `draft-round-1.md` §4 and not restated; nothing dropped there is re-admitted by either
new face, and neither new face adds a claim. In particular vid 3's four refused inventions stay
refused: the HISTORY (`the sickness it has seen`), the negative HISTORY (`the hunger it has not`), the
TOTALITY (`nothing in hand`) and the FORECAST-in-continuous-dress (`is correcting`), together with the
GRADE (`the imbalance`) and the `{settlement}` opener.

### 5. THE DENSITY FLOOR, READ AGAINST THE SHIPPED SENTENCE AND AGAINST ROUND 1 (Part B §21.4)

Round 2 is measured twice, as §21.4 requires: against the SHIPPED sentence, and against the lawful
draft it replaces.

- **Against the shipped sentence.** Unchanged from round 1: not one clause of vid 3's shipped sentence
  is lawful whole, and its one lawful STRUCTURE — the pair in one unit, presence first — is now carried
  more completely than in round 1, by the double cleft. No lawful shipped turn is made plainer; the
  only shipped material this pool retains verbatim remains `The town` at vid 2.
- **Against round 1.** Neither replacement is plainer than what it replaces. Face 2 trades a
  participial front for a deictic front at the same length and the same construction class. Face 3
  trades a gapped tail for a full second cleft and gains five words of licensed structure. §21.4's
  regression is *a lawful line made plainer with no law behind the change*; face 2's change has a law
  behind it (the gate's band) and costs no density, and face 3's change has a law behind it and
  **adds** density.

### 6. THE POOL-LEVEL WALLS, RE-CHECKED FACE BY FACE AFTER THE TWO SUBSTITUTIONS

- **Both halves in every face** — no face prints a sibling cell's fact by naming one half. ✓
- **Presence first, absence second, in all twelve** (wall 3; R-DA-08). ✓
- **One negated surface per face**, always the licensed LACK, never a negated PRESENT read (R-ii/W10). ✓
- **No stock word anywhere**: no food, reserves, stores, stock, larder, harvest, put by, held back,
  buffer, months, enough, empty, bare. ✓
- **No capability on the care body**: no treat, contain, containment, quarantine, recovery, copes,
  equipped, prepared, answer. ✓
- **No person, no totality over persons** (W22; the card's REFUSED COLUMNS). ✓
- **No faith, deity, parish, clergy or spell** — the `church` argument is not consulted on this
  branch (W19). ✓
- **No event, season, duration, history, forecast, trajectory, cause, counterfactual or meaning gloss.** ✓
- **No grade, no band word, no comparison of the key's own two halves**, and no reading of the
  `scores.disaster` badge printed beside the face (W20). ✓
- **No second civic object**: one care body and one storehouse absence; none of the other four
  readiness rows is named (C7; W2; A1/A11), and no sibling pool's material is imported. ✓
- **No citation, no record noun** (A13; W24; SOURCE-UNRESOLVED). ✓
- **Hard walls**: no em dash, no exclamation, no digit, no percent, no which-clause, no question, no
  "I" or "you", no figure, no sense verb on an abstraction, no intent for the town or a building, no
  expletive opener (R-DA-07), **no colon and no semicolon anywhere in the pool**, no participial gloss
  tail, no maxim, no kicker, no hook, no tricolon, **no `-ing` first word on any face**, no
  settlement-token opener. ✓
- **Slot sets exactly the parents'**: vid 1 `{settlement}` · vid 2 `{}` · vid 3 `{settlement}`, the two
  new faces included (ARCH §2.5). ✓
- **Openers distinct within every variant**; the fixed body phrase `Those tending the sick` opens one
  face in each of the three variants, unavoidable while the presence must lead and its spelling is
  fixed, and a reader meets one variant per seed. ✓
- **Sentence counts**: vid 2's numbered line runs two sentences, and one face of each of vids 1 and 3
  runs two, so the pool is not uniform in segment count (R-DA-05; A11). Every second sentence carries
  a noun forward from its first (R-i; §1.4.1). ✓
- **Word counts** 13–19 across the twelve (round 1: 13–17); the shortest is vid 3's numbered line at
  13, the longest vid 3's face 3 at 19. No face is over 30 words and none is under 8. ✓
- **THE THREAD to the two unknown modifiers (k = 2).** Every face hands forward **the town** (as
  `{settlement}`, `The town of {settlement}` or `the town`) and **the pressure class**. Neither a
  `store`-class nor a `care`-class modifier can attach (T-F12 refuses a modifier whose key names a
  class this key names, and this key names both — ARCH §8.3's worked card holds the `stores: short`
  modifier off the two NO-reserves cells), so no face leans on a stock or care continuation. ✓

### 7. REFUSALS

**NONE.** All three variants are written, all twelve faces are lawful under the card, the two ratified
tables and the writer bars W11–W27 as this seat reads them. No variant was banked, none was trimmed,
none was merged, no vid moved, and no face was withheld. The round is **not dry**: it moves both of the
two failing owned measures from over-band to zero and leaves every passing measure where the gate found
it.

### 8. THE JUDGMENT CALLS THIS SEAT MADE, RECORDED VETOABLY

Rounds 1's six calls stand unamended (the absence's noun; the pressure class; sickness spoken once; the
care body's noun; `[unfolding]`'s OPEN carried by silence; the part-repaid spread debt — all recorded at
`draft-round-1.md` §8 and all still the chair's to rule). Round 2 adds three:

7. **`Here` as vid 3 face 2's fronted element.** Chosen over `At {settlement}` and over `In the town`:
   the first would put the proper token in the opening phrase and invite a wall-10 / skeleton-§(7)
   reading the seat would rather not defend, and the second is already vid 2's face 4 opener in this
   same pool. `Here` is the `[unfolding]`'s established surface in this block. If the chair reads a
   bare deixis as a per-entry FRAME (MOVE-GRAMMAR §1.3's refused move), the cure is a locative with the
   town named and the face costs two words, not its construction.
8. **The double cleft at vid 3 face 3.** It is the skeleton's "kept as a shape" realised whole, and it
   is the one place in this pool where the conjunction is heard as a pair. If the chair reads the
   paired frame as a CONTRAST under wall 5 rather than as two parallel facts, the face reverts to a
   comma-and joint and the pool loses the shape the skeleton asked to keep — a sitting row, not a
   patch.
9. **Face 4 left byte-unchanged though it now shares face 3's landing noun.** Declined as churn on a
   passing face inside a draft round (§3.3). The chair may call for the re-landing at Phase 2.
