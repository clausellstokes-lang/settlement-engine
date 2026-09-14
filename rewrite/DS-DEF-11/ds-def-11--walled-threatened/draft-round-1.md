Seat: Opus 5 — WRITER (Fable-unvalidated). Block DS-DEF-11 · pool `WALLED-THREATENED` · DRAFT round 1.
The rows below are the complete replacement for the pool's three variant rows and nothing else. The block's
typed lines (RECEIPT / STATE-KEY / SLOTS / SECTION-TARGET / PROVENANCE) are not mine and are not repeated.
Three variants, in the shipped order, under the shipped vids, each opening with its own single angle tag;
four wordings each (the numbered line and three `[face]` sub-rows). Every wording states ALL THREE of the
card's licensed reads — the work standing, the country's live threat, the keeping paid — in its angle's own
stance. No `[plain]` marker anywhere.

1. `[ledger]` Danger stands in the country, and {settlement} keeps its {defwork} at full charge.
   - `[face]` Wages and keeping are answered in full on {settlement}'s {defwork}, and dangerous is the country.
   - `[face]` The threat is live. At {settlement} a {defwork} stands, and its upkeep wants nothing.
   - `[face]` The cost of the {defwork} standing at {settlement} is met to the last, and the country is not quiet.
2. `[street]` A {defwork} stands at {settlement} in dangerous country. The keeping is paid.
   - `[face]` The country is dangerous, and nothing is owing on {settlement}'s {defwork}.
   - `[face]` In dangerous country {settlement} has a {defwork} standing, and the money for it is found.
   - `[face]` Danger the country carries, and at {settlement} the money holds and the {defwork} holds.
3. `[visitor]` The {defwork} at {settlement} stands whole in its keeping, and the country around is dangerous.
   - `[face]` Set in dangerous country, {settlement} is enclosed, and the {defwork} stands with its keeping paid.
   - `[face]` Dangerous country lies at {settlement}, and the town stands enclosed by a {defwork} kept at full cost.
   - `[face]` The keeping of the {defwork} standing at {settlement} is met entire, and the country the town sits in is dangerous.

--- NOTES

**The card, printed first and read whole** (`node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-THREATENED'`,
run read-only in `laneRW-DEF11`; nothing else executed, no dock entered, no byte written outside this packet):

```
LICENCE (block DS-DEF-11 · role spine · key `WALLED-THREATENED`)
  reads:      forces.walls.present   (measured)
              settlement.config.monsterThreat   (measured)
              settlement.defenseProfile.economicGates.military   (measured)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  (none recovered: the pool has no key-function branch)
  bag:        {defwork: bare-common, settlement: proper}
              FILLED at this block's call sites: {settlement} · NAMED BUT NEVER FILLED: {defwork}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 2 (tabs: defense) · modifier mounts 0 (none)
  covert:     no
  source:     muster + road · standing LICENSED · two-source row
              a citation of this holder is licensed where the provenance budget allows
  may claim:  that `present` holds, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact,
              another civic object of the class `wall`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character
              and that character's fate; a theological claim about a deity
```

**THE THREE READS AS ONE KEYED CONDITION (the skeleton's fence 1, followed).** The branch returns this key
only when all three reads hold, so a wording that states the work, the live threat and the paid keeping states
the state the key names; the card's "a second fact" refuses facts OUTSIDE the reads (a grain, an inspection,
a season, an act), and every one of those is refused below. What the register card still demands, and what
every wording obeys: one flowing sentence or two short ones, a qualification never as a tail, and **no causal
joint between the reads** — the three stand co-ordinate or juxtaposed, never joined by a because, a for, an
against, a requires, a so or a purpose infinitive. The typed claim set is identical across all twelve wordings
and across the three variants (arm A6 reads across the faces): `(PRESENT, forces.walls.present, true)` ·
`(PRESENT, settlement.config.monsterThreat, live)` · `(PRESENT, economicGates.military, at identity)`.

**Per variant — the licensed claims KEPT, the unlicensed claims DROPPED, and the reads the shipped line never
stated.**

**1 `[ledger]` (shipped):** *"{settlement} keeps its {defwork} because the country requires it; the threat is
on the town's books as plainly as the grain."*
- KEPT — the town keeps a wall-class work: `may claim` on `forces.walls.present`; "keeps" also rides lawfully
  on the gate at identity. **The clause `{settlement} keeps its {defwork}` stands VERBATIM in the numbered
  row**: it is this variant's density floor (§21.4), the one verb that carries the work and its paid keeping
  together without a joint, and the owner's exemplar clauses were written to be kept.
- KEPT — the country carries a live threat: `may claim` on `settlement.config.monsterThreat`; the shipped line
  had it only as the object of a cause, and it is now stated as a standing fact in its own right.
- DROPPED — *because … requires it*: `may NOT: a cause`, and an intent placed on an inanimate country
  (R-DA-11). Its WEIGHT is replaced by licensed specificity, not by nothing: the gate at identity, which the
  shipped line never stated (full charge · wages and keeping answered in full · upkeep wants nothing · the
  cost met to the last).
- DROPPED — *on the town's books*: a standpoint, and the wrong keeper (the road register holds the threat, and
  the office does not cite its own books — S3, MOVE-GRAMMAR §4.4.3).
- DROPPED — *as plainly as the grain*: a second fact no read of this card holds, and a comparison that is not
  a measurement (R-DA-11). The stock is DS-DEF-2's cell by the echo bound.

**2 `[street]` (shipped):** *"Nobody in {settlement} thinks of the {defwork} as ornament; the town knows what
it is for and checks it."*
- KEPT — the wall-class work stands at the settlement. That is the only licensed claim this row carried; the
  rewrite's floor is therefore HIGHER than the shipped line, which stated one read of three.
- DROPPED — *Nobody in {settlement}*: a totality over persons, a REFUSED COLUMN always.
- DROPPED — *thinks of … as ornament* and *the town knows*: a belief frame twice (R-DA-13's floor; FEELING and
  MEANING are non-moves estate-wide), and *ornament* is a contrast whose rejected alternative names no sibling
  key or band (R-DA-02).
- DROPPED — *what it is for*: a purpose, which is a cause in the dative.
- DROPPED — *and checks it*: an act no field holds (no inspection or maintenance field exists; the gate is a
  funding multiplier, not an act).
- ADDED, because the card licenses them and the shipped row omitted them: the live threat, stated plainly in
  the town's own idiom, and the keeping paid, stated as a standing condition (the keeping is paid · nothing is
  owing · the money is found · the money holds) and never as an act.

**3 `[visitor]` (shipped):** *"{settlement} is enclosed the way working things are enclosed: against something,
and recently attended to."*
- KEPT — the settlement is enclosed: `may claim` on `forces.walls.present`. **`{settlement} is enclosed`
  stands VERBATIM in face 1** — the visitor's first noticing in two words, this variant's density floor.
- KEPT — a threat stands in the country: the road holder's own grain, now stated as a fact of the country and
  never as what the work is for.
- DROPPED — *the way working things are enclosed*: a maxim (R-DA-12) and a comparison that is not a
  measurement (R-DA-11).
- DROPPED — *something*: a hedge on a fact the record holds plainly; replaced by the fact itself.
- DROPPED — *against*: a purpose word under the card. The two-beat rhythm the shipped line got from it is kept
  by a non-causal joint (the enclosure, then the country).
- DROPPED — *recently attended to*: a season and an act, both refused; the block's own PROVENANCE line records
  that WHEN has no backing fact at this tip. Its weight is replaced by the licensed standing condition of the
  work: whole in its keeping · kept at full cost · met entire.

**Per face — which card clause licenses each claim it makes.** Every row asserts the same three triples; the
table names the clause under each limb, and the two slot fills are licensed by the `bag` line
(`{settlement}: proper`, `{defwork}: bare-common`, kept on all twelve so no face's slot set differs from its
parent's — ARCH §2.5).

| row | the work stands | the threat is live | the keeping is paid |
|---|---|---|---|
| 1 (numbered) | `may claim` / `forces.walls.present`: *{settlement} keeps its {defwork}* | read 2 `config.monsterThreat`: *Danger stands in the country* | read 3 `economicGates.military` at identity: *at full charge* |
| 1-f1 | the same clause: *{settlement}'s {defwork}* | read 2: *dangerous is the country* | read 3: *Wages and keeping are answered in full* |
| 1-f2 | the same clause: *At {settlement} a {defwork} stands* | read 2: *The threat is live* (the STATE-KEY's own two words) | read 3: *its upkeep wants nothing* |
| 1-f3 | the same clause: *the {defwork} standing at {settlement}* | read 2, as R-DA-02's licensed contrast on the sibling pool key `WALLED-QUIET`: *the country is not quiet* | read 3: *The cost … is met to the last* |
| 2 (numbered) | the same clause: *A {defwork} stands at {settlement}* | read 2: *in dangerous country* | read 3: *The keeping is paid* |
| 2-f1 | the same clause: *{settlement}'s {defwork}* | read 2: *The country is dangerous* | read 3: *nothing is owing* |
| 2-f2 | the same clause: *{settlement} has a {defwork} standing* | read 2: *In dangerous country* | read 3: *the money for it is found* |
| 2-f3 | the same clause: *the {defwork} holds* | read 2: *Danger the country carries* | read 3: *the money holds* |
| 3 (numbered) | the same clause: *The {defwork} at {settlement} stands* | read 2: *the country around is dangerous* | read 3: *whole in its keeping* |
| 3-f1 | the same clause: *{settlement} is enclosed* and *the {defwork} stands* | read 2: *Set in dangerous country* | read 3: *with its keeping paid* |
| 3-f2 | the same clause: *the town stands enclosed by a {defwork}* | read 2: *Dangerous country lies at {settlement}* | read 3: *kept at full cost* |
| 3-f3 | the same clause: *the {defwork} standing at {settlement}* | read 2: *the country the town sits in is dangerous* | read 3: *The keeping … is met entire* |

**The angles, kept apart by vocabulary and by construction (not only by words — the subject, the order of the
reads and the landing noun all differ).**
- `[ledger]` takes the accounting register and states the reads as the compiled record holds them: *charge ·
  wages · answered in full · upkeep · cost · met to the last*. Orders: threat→work→gate · gate→work→threat ·
  threat→work→gate in two sentences · gate→work→threat with the contrast last. No holder is named and no book
  is cited, so the shipped row's wrong-keeper standpoint does not return.
- `[street]` takes the town's plain money talk and the short clause: *the keeping is paid · nothing is owing ·
  the money is found · the money holds*. Two of its four are two-sentence rows or fronted-object inversions;
  none reports a belief, a totality or an act.
- `[visitor]` takes what stands to be seen on arrival: *stands whole in its keeping · is enclosed · the town
  stands enclosed · the country around · the country the town sits in*. No persona, no time word, no seen
  particular (no mortar, no course, no sentry), no maxim, no simile.

**Refusals and recorded rows (a refusal is a result).**

1. **No variant is refused for want of a law: all three are written lawful.** The rows below are reservations
   and open rows, not failures to make a variant lawful.

2. **No citation on any of the twelve, though the card licenses one.** `source: muster + road · standing
   LICENSED · two-source row` permits a citation "where the provenance budget allows"; Part B §24 sets the
   ceiling at ONE per unit and only for one of S3's three reasons. None holds here: no two accounts disagree,
   no claim is a count, and no keeper of these reads is a power in this town. The exemplar registers cite at
   0 per 786 sentences, so the recommended count for this pool is zero and zero is what is written.

3. **The gate read is STATED in all twelve, under the chair's instruction that the rewrite states every read
   the card names.** ARCH §6.3's `NARROWS: gate` proposal for THREATENED/QUIET stands open and the census
   reads `narrowed: false`. If the chair rules the narrowing, the gate clause leaves all twelve wordings and
   the pool is a plain re-take — a wiring ruling, not a text failure. The writer does not pre-empt it.

4. **No cause anywhere, though the block is titled "why the wall".** The card as printed lists "a cause" under
   `may NOT`, and the owner's rule is that the card and nothing else licenses a claim. The shipped
   *because the country requires it* is therefore dropped and the why is left to the reader, the two facts
   co-standing. **If the chair rules CT-1a's structural-cause joint lawful on this block (the skeleton's
   fence 2), these twelve under-claim against what would then be licensed and the pool is worth a re-take.**
   Recorded, not cured.

5. **The `inner citadel` hazard on the two enclosure faces (3-f1, 3-f2).** The engine's wall-name class
   includes `inner citadel` (`defenseGenerator.js`), which does not enclose a settlement, so a fill can make
   an enclosure clause false on such a town. The skeleton rules `{settlement} is enclosed` a lawful density
   floor worth carrying, so it is carried in exactly one face and its predicate form in one other; the other
   ten wordings assert standing and keeping, never geometry. **Raised for the chair as a fill row.**

6. **`{defwork}` kept in all twelve against a printed wiring gap.** The card prints
   `NAMED BUT NEVER FILLED: {defwork}` and the census carries `slotsWithoutProvider: ["defwork"]`. A writer
   cannot cure that: dropping the slot would name the work with a baked noun, which the block's SLOTS line
   forbids. **A wiring row for the chair, not a text row.**

7. **Two level-1 grammars, not three.** V2 (PRESENT→CONSEQUENCE), V3 (PRESENT→LACK), V6 (PRESENT→OPEN),
   V7 (HISTORY→PRESENT) and V8 (PRESENT→GAP) are all filtered out for want of their licensing fields, and V5
   needs an institution row the card does not carry. The twelve realise V1 (PRESENT) and V4 (OBJECT→PRESENT).
   The census already records `grammars: 2` for the shipped pool, so this is a structural property of the
   spine, not a regression the rewrite introduces. No `[grammar: Vn]` tag is authored on any row.

**The soft bands, measured and reported as information (§21.1: position inside a band is information only).**
- Words per wording: 13 · 15 · 14 · 19 | 12 · 11 · 15 · 14 | 15 · 15 · 17 · 20. Mean 15.0, range 11 to 20,
  population sd **2.55**, which MISSES R-DA-05's within-pool spread figure of ≥ 4.0. Declared, not cured:
  §21.4 rules that padding a lawful line toward a spread number is the regression, and a longer line here
  could only be built from words that assert nothing. One soft rule exceeded, inside §16.1's budget.
- Two short sentences exist in the pool (*The keeping is paid.* and *The threat is live.*, four words each),
  which carries the shipped pool's zero short lines up to the `< 8 words` floor.
- Openers: all twelve are pairwise distinct on their first two words — *Danger stands · Wages and · The
  threat · The cost · A {defwork} · The country · In dangerous · Danger the · The {defwork} · Set in ·
  Dangerous country · The keeping* (A11).
- **The settlement token opens NO row, numbered or face.** The shipped pool had vids 1 and 3 both opening on
  it (order constraint 10 / R-DA-17's breach); the cure moves both openers and leaves the token unable to
  breach T-F8 under either reading of whether the bar reaches the numbered row.
- Close kinds (R-DA-04): condition 6 (*charge · paid · found · holds · paid · dangerous*), the civic object or
  the field's own noun 3 (*country · {defwork} · cost*), absence 2 (*nothing · quiet*), and one further
  condition close on *dangerous*. Four kinds appear; no wording closes on a pronoun, on {settlement}, or on an
  abstraction of the *thing/fact/matter* class.
- One participial opener in twelve (*Set in dangerous country*), against R-DA-18's ≤ 0.020 floor: a second
  declared exceedance, kept because the visitor's one fronted adjunct is the shape that lets the density-floor
  clause stand verbatim without opening on the slot.
- Zero of each, checked wording by wording: digit, percent, em dash, exclamation, question, colon, semicolon,
  `which`, cause word (*because · for* as purpose *· against · requires · so that · since · therefore*), time
  or season word (*recently · lately · still · now · once · since*), belief verb (*thinks · knows · feels ·
  believes*), act of upkeep (*checks · walks · mends · repairs · attends*), totality over persons (*nobody ·
  everyone · all · every · none*), simile or *the way X are*, sense verb on an abstraction, intent verb on an
  inanimate subject, future indicative, monster kind, second civic object of the class `wall` (no *wall · gate
  · rampart · circuit · stone · tower* appears; *enclosed* is a predicate, never a noun for the work), and no
  record-holder citation.
- Sibling distance, measured by hand against every pool this one composes beside. The two modifier pools whose
  attach sets touch this block (`country: pressed (walled)`, `watch: bought (revealed)`): no wording of mine
  uses *beset · harried · settled · grade · entered · booked · the country about {settlement} · return ·
  record*, nor *watch · purchase · obedience · allegiance · bought · public · open*; shared four-grams with
  either pool, zero. Against the block's four sibling spines: no wording reuses *peace · patience · pays
  little · stone · muster · thinning · too small to wall · marks where {settlement} ends · circuit · buys
  stone*. The one deliberate overlap is *wages*, which `WALLED-STRAINED` uses for the UNPAID case and this
  pool uses for the PAID case: the two keys are mutually exclusive, so the shared noun is the polarity pair
  landing on one word, not a restatement (arms A1 and A11).

**THE THREAD (§1.4.1).** This pool is the SPINE, so it opens the composed unit and hands a noun forward rather
than picking one up; k = 0 at this key today, so nothing attaches, but every wording is written so a modifier
could take up a noun from it. The nouns left standing at or near the close are the country, the {defwork}, the
keeping, the money, the charge and the cost — exactly the nouns `country: pressed` and `watch: bought` carry —
and no wording closes on a pronoun or leans on one reaching outside its own sentence, so any modifier the
composer ranks first by salience reads cleanly after any of the twelve. No wording turns outward: a spine's
opening facts are the passage's ground, and the turn outward is placed last, which is a modifier's place.

**Nothing trimmed (§22).** Three variants in, three variants out, under vids 1, 2 and 3, in the shipped order,
under the shipped tags `[ledger]`, `[street]` and `[visitor]` — one bracketed tag per numbered row, no
`[plain]` marker anywhere, no variant added, removed, merged or reordered. Four wordings per variant, one for
one with the owner's four-faces rule; each face a different construction (a different subject, a different
order of the three reads, a different landing noun), never a paraphrase of its sibling. The shipped wording of
each variant leaves the product because it fails the voice; its slot survives and its text stays in the annex
history.
