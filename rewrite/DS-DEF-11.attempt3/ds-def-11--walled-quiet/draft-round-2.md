Seat: Opus 5 — Fable-unvalidated (writer, DS-DEF-11 · pool `WALLED-QUIET` · draft round 2)

# DS-DEF-11 · `WALLED-QUIET` — the rewritten variant rows (paste under the pool's bold heading)

3 variants rewritten in place, same vids, same order, same angle tags, none added, none removed, none merged.
Twelve faces (each numbered line is its variant's first face, then three `[face]` sub-rows).

1. `[visitor]` {settlement} keeps a {defwork}, and it stands.
   - `[face]` A {defwork} stands at {settlement}.
   - `[face]` The {defwork} that {settlement} keeps stands.
   - `[face]` At {settlement} a {defwork} is up, and up it remains.
2. `[elder]` The {defwork} stands; {settlement} has it up.
   - `[face]` A {defwork} is up at {settlement}, and it holds.
   - `[face]` The {defwork} {settlement} has, it has standing.
   - `[face]` What {settlement} has is a {defwork}, and it is up.
3. `[ledger]` Entered as standing, the {defwork} stands.
   - `[face]` A {defwork} is carried, and carried as standing.
   - `[face]` The {defwork} is entered standing.
   - `[face]` What is entered is a {defwork}, and it is entered standing.

--- NOTES

## 1. THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

**The one failing owned measure: `band depth · shapes.participialOpenerRate (over) = 28.24 band-widths on 2 of 12 faces` (DEPTH ceiling 1.75 on every face).**

The metric is `rate(first.filter((w) => /ing$/.test(w) && !NOT_PARTICIPLES.test(w)))` over the first
word of each sentence, lower-cased and stripped of non-letters (`src/domain/prose/proseFingerprint.js:141`,
with `NOT_PARTICIPLES` at `:71`). At the face grain a face is one sentence, so the rate is 0 or 1
and nothing between: a face either opens on an `-ing` word or it does not. Round 1's two offenders
were the only two faces in the pool that did:

| round 1 face | first word | round 2 replacement | first word |
|---|---|---|---|
| v1 `[face]` Standing at {settlement} is a {defwork}. | `standing` | `[face]` At {settlement} a {defwork} is up, and up it remains. | `at` |
| v3 `[face]` Standing work: the {defwork} stands. | `standing` | `[face]` The {defwork} is entered standing. | `the` |

**MOVED: `shapes.participialOpenerRate` 2 of 12 faces → 0 of 12 faces, measured, printed below.**
Every face's first word was run through the shipped regex pair in this lane (read-only, `node -e`
against `proseFingerprint.js`'s own constants): `settlement · a · the · at · the · a · the · what ·
entered · a · the · what`. None ends in `ing`; the two `-ing` words that remain in the pool
(`standing`) both sit in a sentence's interior, where the metric does not look. Not one face is a
draw away from the ceiling — the measure is at the band's floor on all twelve, not merely inside it.

**No measure that passed in round 1 was disturbed, and none was newly broken.** Every face was run
against the shipped regexes for the other scored shapes; all twelve read `false`/`0` on: the
`which`-tail, the `There is`/`It is` opener, the antithesis shape, the triad, the doubled adjective,
the pronoun closer, and `-ly` adverbs (an adverb is worth watching precisely here: one `-ly` word in
a one-sentence face is a rate of 1.000 against a band top near 0.40, which would have been a NEW
failure at roughly 2 band-widths, so the set carries none). Punctuation moves the same way it did in
round 1 or downward: one semicolon in the pool (variant 2's line, the exact device round 1 carried
through the gate), zero colons (round 1 carried one, on the face the participial rule removed), zero
em dashes, zero digits, zero question and exclamation marks, zero quotation marks.

**Lengths are held inside round 1's own distribution** so that no length-derived measure moves: 5 to
11 whitespace words per face against round 1's 5 to 11, and `neighbourVariation`, `runsOfThree`,
`shareUnder8` and `shareOver30` are structurally identical at the face grain (a single sentence
yields the same values for any wording of that length).

**One instrument artefact, reported not cured (a finding for the chair, not a refusal).** At the
AUTHORED grain the closer regex reads the token `{settlement}` as an abstract-noun closer, because
`settlement` ends in `ment` (`closers.abstractNounRate`, `:147`). The one face that closes on the
slot — `A {defwork} stands at {settlement}.` — is carried unchanged from round 1, where the gate
measured it and did NOT report it, so the behaviour is confirmed benign on this gate as configured;
it would bite a future run that scores that metric on the authored grain, and it is a property of
the instrument's grain rather than of the sentence.

## 2. WHAT EACH FACE CLAIMS, AND THE CARD CLAUSE THAT LICENSES IT

**The card, printed this session** (`node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-QUIET'`):
reads `forces.walls.present` · `settlement.config.monsterThreat` ·
`settlement.defenseProfile.economicGates.military`; predicate NONE RECOVERED (no key-function
branch); bag `{defwork: bare-common, settlement: proper}`; role SPINE (no relation, no attach, no
move declared); angle `elder` · `ledger` · `visitor`; source muster + road, standing LICENSED,
two-source row; **may claim: that `present` holds, as a STANDING fact of the record**; **may NOT: a
count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class
`wall`**; refused columns always: a totality over persons, an exemption from a duty, a named
character and that character's fate, a theological claim.

All twelve faces assert exactly ONE claim, and it is the same claim in all twelve — that the
settlement's wall-class work is present, in the standing modality the card names. Its licence is the
card's `may claim` line over the read `forces.walls.present`. The slot fills are licensed by the
card's `bag` and by the pool's own SLOTS line, which requires `{defwork}` to fill from the
settlement's RECORDED wall-class institution name and forbids a baked or invented noun — which is
why no face writes wall, stone, gate, circuit or rampart.

| row | claim asserted | licensing clause | how the STANDING modality is carried |
|---|---|---|---|
| 1 line | `present` holds, of {settlement} | may-claim on `forces.walls.present`; bag `{settlement}` proper + `{defwork}` bare-common | "keeps … and it stands" |
| 1 face a | same | same | "stands" |
| 1 face b | same | same | "that {settlement} keeps stands" |
| 1 face c | same | same | "is up, and up it remains" |
| 2 line | same | same | "stands; … has it up" |
| 2 face a | same | same | "is up … and it holds" |
| 2 face b | same | same | "it has standing" |
| 2 face c | same | same | "is a {defwork}, and it is up" |
| 3 line | same, in the record's own diction | same; the card's phrase "as a STANDING fact of the record" licenses the entered/carried frame | "Entered as standing … stands" |
| 3 face a | same | same | "carried, and carried as standing" |
| 3 face b | same | same | "is entered standing" |
| 3 face c | same | same | "is entered … entered standing" |

No face makes a second claim, so no face needs a second clause. **No face carries a citation.** The
card declares `move: (none declared)` and none of amendment S3's three reasons is present (two
accounts that disagree; a count from an interested party; a record whose keeper is a power), so the
provenance ceiling of one citation per unit (Part B §24; MOVE-GRAMMAR §4.4.3) is deliberately spent
at zero and the muster and the road are not named. Variant 3's `entered`/`carried` is the office's
own formula for its own entry, not an attribution to a holder — naming a holder here would be both
unlicensed and, by §4.4.3, the office citing its own books.

**Slot sets, per ARCH §2.5's face-row refusals.** Variants 1 and 2 carry `{settlement}` and
`{defwork}`, exactly as their shipped parents did, and every one of their faces carries both.
Variant 3 carries `{defwork}` alone, exactly as its shipped parent did, and none of its faces
introduces `{settlement}`. No face opens on the `proper`-typed slot (T-F8); the only settlement-token
opener in the pool is variant 1's numbered line, which is the one variant per pool R-DA-17's order
constraint 10 allows. No face opens on the bare-common `{defwork}` either, since that token renders
lower-case and would break a sentence-form row's capital (ARCH §2.5's seam contract).

## 3. WHAT WAS DROPPED FROM EACH SHIPPED VARIANT, AND UNDER WHICH REFUSAL

The shipped rows (`.attempt1/kept.md`, the corpus's known state) and what the card refuses in each.
Dropping is the rewrite's purpose; nothing is added.

- **v1 shipped:** "{settlement} keeps a {defwork} the present peace does not obviously require, and
  keeping it is cheaper than ever needing it again."
  - KEPT: the {defwork} is present, of {settlement} (may-claim).
  - DROPPED "the present peace does not obviously require" — a SECOND FACT (the threat read asserted),
    a STANDPOINT ("obviously") and a CAUSE (a requirement relation). Card may-NOT: second fact ·
    standpoint · cause.
  - DROPPED "keeping it is cheaper than ever needing it again" — a COUNT (a cost comparison), a CAUSE
    and a FUTURE. Card may-NOT: count · cause · future; R-DA-07 (nothing takes the future).
- **v2 shipped:** "The {defwork} stands ahead of any present need; walls are easier to keep than to
  raise, and {settlement} keeps this one."
  - KEPT: the {defwork} is present, of {settlement} (may-claim).
  - DROPPED "ahead of any present need" — the SECOND FACT (the quiet) with a STANDPOINT.
  - DROPPED "walls are easier to keep than to raise" — a MAXIM (R-DA-12's generalisation test; the
    register card's no-maxim wall), a CAUSE, and a bare plural naming ANOTHER CIVIC OBJECT OF THE
    CLASS `wall` (card may-NOT, last item).
- **v3 shipped:** "The town pays little for its {defwork} now that it asks little of it; built work
  stands on its own patience."
  - KEPT: the {defwork} is present (may-claim).
  - DROPPED "The town pays little" — a COUNT on the purse; the upkeep gate is a READ of this pool and
    never a claim of it.
  - DROPPED "now that it asks little of it" — a CAUSE joined to the SECOND FACT (the quiet).
  - DROPPED "built work stands on its own patience" — a FIGURE (an abstraction given intent, R-DA-11)
    and a MAXIM.
  - DROPPED the tier noun "The town" — `settlement.tier` is not among this pool's three reads, so a
    tier word is an unlicensed claim on a key that also fires below town size. No row of this pool
    carries a tier noun.

## 4. THE THREAD, THE ANGLES, AND SIBLING DISTANCE

**THE THREAD (§1.4.1).** These are SPINE rows, so each is read first and must hand a noun forward
rather than take one. Every face closes on the spine's own material — the standing predicate
(`stands` · `remains` · `holds` · `standing` · `up`) or one of the two slot nouns — so a modifier
mounting after it has `the {defwork}`, `it` or the settlement to pick up, whichever the salience
order puts next. Not one face changes subject in its middle and hands nothing back; the two faces
that shift subject at all (variant 1's line and variant 2's line) shift to a resumptive pronoun or
possessor of the same object, which is the thread carried, not broken.

**THE ANGLES, each with its own field, so no face is a paraphrase of a sibling.** Variant 1
`[visitor]` takes the plain STANDS field of a traveller's sight; variant 2 `[elder]` takes the
possession-and-UP field of the town's own plain speech; variant 3 `[ledger]` takes the record's
ENTERED/CARRIED diction. Inside each variant the four faces differ by rhythm, which is the owner's
stated alternative to a different vocabulary: variant 1 runs coordinate-with-pronoun · minimal
SVO · that-relative · fronted locative with an inverted tail; variant 2 runs semicolon-with-
resumptive · coordinate · left-dislocation · pseudo-cleft; variant 3 runs fronted participial phrase ·
coordinate with the record's repetition · minimal passive · pseudo-cleft with a coordinate tail.
No two variants share their first two words (A11): `{settlement} keeps` · `The {defwork}` ·
`Entered as`.

**Siblings (arms A1/A11), read in this block's annex section before writing.** `WALLED-THREATENED`
holds the same licensed presence claim, so its round-1 vocabulary is deliberately avoided here in
full: possessed of · a fixture of · belongs to · holds its place · an item of the town's own
defensive work · the fortification of · walled by · fixed defense · the walled place · stands to
{settlement}'s name. `WALLED-STRAINED`'s frames (is in place at · is {settlement}'s · owns its ·
holds a) are avoided for the same reason. `UNWALLED-SMALL`'s "What stands at {settlement} is …" was
drafted and then refused for restating a sibling's frame; variant 1's cleft was moved into the
that-relative instead. Nothing here contradicts a sibling: every row asserts only presence and
standing, which is what every walled key holds.

## 5. REFUSALS

**NONE.** All three variants are written, all twelve faces are lawful under the card, and no variant
is banked. The banked count for this pool stays at zero.

## 6. FINDINGS FOR THE CHAIR (reported, not refusals; carried forward from round 1, both still true)

1. **The pool key's discriminating claim is not licensed by its own card.** `WALLED-QUIET` is "walls,
   no live threat", but the card's may-claim names only `present`, its predicate line reads "(none
   recovered: the pool has no key-function branch)", and "a second fact" is refused outright. The
   quiet — the half that distinguishes this pool from `WALLED-THREATENED` — is therefore absent from
   all three variants, and these rewritten spines carry the same typed claim a rewritten
   `WALLED-THREATENED` spine would carry. That is MOVE-GRAMMAR §3.4 / U9's line about a grammar
   dropping the clause that carries the pool key's discriminating claim. Two ways out, both above a
   writer's seat: recover the pool's predicate into the card so the quiet becomes claimable, or rule
   that a state key may select without being said. These rows take the card as the authority, per the
   brief.
2. **`{defwork}` is NAMED BUT NEVER FILLED at this block's call sites** (the card's bag line). All
   twelve faces need it and the pool's SLOTS line forbids a baked noun, so if the fill never arrives
   every variant of this pool is unrenderable or renders a raw token. A wiring row, not a wording row.
3. **Band positions this draft knowingly sits outside, and why.** Within-pool words-per-sentence sd is
   about 1.9 against R-DA-05's 4.0 floor (lengths 5 to 11), and R-DA-04's close-kind spread runs to
   three kinds (condition, object, name) rather than five. Both follow from a one-claim licence:
   there is not enough licensed material to carry a long sentence or a wider close set, and the
   density law forbids buying length with padding. Reported as distance; not cured by inventing a
   fact. Under §16.2's ENTRY grain (BUDGET two thirds, DEPTH 1.75) the set sits inside the budget.

**Walls checked on every one of the twelve rows:** no em dash · no exclamation · no digit or percent ·
no `which`-clause · no question · no first or second person · no expletive opener · no future
indicative · no citation · no figure · no maxim · no tier noun · no material noun · no second
wall-class object · no `-ly` adverb · one sentence per face (A1) · one bracketed angle tag per
numbered line, `[plain]` nowhere.

## 7. THE WORD COUNT OF EACH FACE (whitespace tokens, the fingerprint's own unit)

| variant | line | face a | face b | face c |
|---|---|---|---|---|
| 1 `[visitor]` | 7 | 5 | 6 | 10 |
| 2 `[elder]` | 7 | 9 | 7 | 10 |
| 3 `[ledger]` | 6 | 8 | 5 | 11 |
