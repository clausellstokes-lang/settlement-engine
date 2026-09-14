Seat: Opus 5 — REFINER (Fable-unvalidated; a different author than the drafter). Block DS-DEF-11 · pool `WALLED-THREATENED` · REFINEMENT round over the draft commit.
Twelve wordings in, twelve out: three variants under their own vids, in their own order, under their own angle
tags, four wordings each. No variant added, removed or merged; no face added or dropped; the block's typed lines
(RECEIPT / STATE-KEY / SLOTS / SECTION-TARGET / PROVENANCE) are not mine and are not repeated.

1. `[ledger]` {settlement} has the {defwork} standing to its name.
   - `[face]` The item of fortification {settlement} shows is the {defwork}.
   - `[face]` In the {defwork} stands {settlement}'s fixed defense.
   - `[face]` Under the head of defense {settlement} holds the {defwork}.
2. `[street]` The work of defense at {settlement} is the {defwork}.
   - `[face]` What goes with {settlement} is the {defwork}.
   - `[face]` With the {defwork} for a fixture, {settlement} is walled.
   - `[face]` For fortification {settlement} has the {defwork}.
3. `[visitor]` The fortification of {settlement} is the {defwork}.
   - `[face]` Fortified, {settlement} has the {defwork} as its fabric.
   - `[face]` Fixed defense at {settlement} takes its shape in the {defwork}.
   - `[face]` The standing work at {settlement} is the {defwork}.

--- NOTES

**The card, re-read first** (`node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-THREATENED'`, run read-only in
`$SC/laneRW-DEF11`). Unchanged from the draft's print: one licensed claim — that `present` holds, as a STANDING
fact of the record — on the read `forces.walls.present`; bag `{defwork: bare-common, settlement: proper}`; a spine,
so no relation, no attach, no declared move; `may NOT: a count, a cause, a season, a future, a standpoint, a second
fact, another civic object of the class wall`; `source: muster + road · standing LICENSED`, and a citation still
refused on the draft's four grounds (the census row's `source.holder` is `null`; none of S3's three reasons holds;
Part B §24's ceiling and the exemplars' 0-per-786 rate make a citation on a plain standing fact the habit arm A13
refuses; and a citation is two claims, which would break claim-equality across a variant's four faces).

**TWO FAULTS THE REFINEMENT CURES, BOTH VERIFIED IN THE DOCK, BOTH INVISIBLE TO A READING OF THE TEXT ALONE.**
These are why this round moved more than a word here and there. Neither is a claim the refinement adds; one is a
rendering fault, the other is a claim the card never licensed.

1. **NUMBER: ten of the draft's twelve break on a real fill.** `defworkFill`
   (`src/domain/display/stateProse/defenseStateProse.js:912-922`) lowercases the settlement's own wall-class
   institution name and returns it as a `bare-common` fill. The catalogue rows that reach it are **plural**:
   `'Town walls'`, `'City walls and gates'`, `'Massive walls and fortifications'`, `'Palisade or earthworks'`
   (`src/data/institutionalCatalog.js:1332`, `src/data/spatialData.js:37`, `src/data/institutionLadders.js:21-22`,
   `src/data/supplyChainData.js:884`), beside the singular `'Palisade'` and `'Citadel'`. So the draft renders
   *"A town walls stands to Brackwater's name"*, *"the town walls holds its place"*, *"is a city walls and gates"*.
   Every face carrying `a {defwork}`, or `{defwork}` as the subject of a finite verb, or `its` pointing back at
   `{defwork}`, is broken on the commonest fill of all. **The cure, applied to all twelve:** `{defwork}` is never
   preceded by an indefinite article, never the subject of a finite verb (nor of a relative clause's verb), and is
   never the antecedent of a pronoun. It appears as an object, a predicate complement after a singular subject, or
   inside a prepositional phrase — all number-neutral. Every one of the twelve was read back with `town walls`,
   `city walls and gates`, `palisade or earthworks`, `palisade` and `inner citadel` substituted in.
2. **TIER: the draft's five uses of "the town" assert a fact the pool does not test.** `wallRationalePoolKey`
   (`:940-951`) reaches `WALLED-THREATENED` on `walls × militaryGate × monsterFamily` and **never reads `tier`** —
   `tier` is read only on the unwalled branch. A hamlet or village holding a palisade or earthworks is exactly the
   designed ladder (`institutionLadders.js:21`, and `supplyChainData.js:882`'s own note places earthworks at
   hamlet/village), and it renders this pool. So *"The town of {settlement}"*, *"the town's own"*, *"belongs to the
   town"*, *"the town at {settlement}"* say a village is a town. It is a second fact under the card's `may NOT`, and
   it contradicts this block's own siblings, which spend two whole pools discriminating village from town
   (`UNWALLED-SMALL` / `UNWALLED-LARGE`, whose text turns on *"stops short of a town"*) — CLERK-LAWS C5, sibling
   coherence in structural fact. **The cure:** the noun `town` appears nowhere in the twelve. Belonging is carried
   instead by the settlement's own genitive (`to its name`, `{settlement}'s fixed defense`, `as its fabric`) or by a
   verb of holding whose subject is `{settlement}` — which is what `defenseProfile.institutions.walls` licenses and
   all it licenses. **The same two faults sit in `WALLED-QUIET`, `WALLED-STRAINED` and the two `UNWALLED` pools as
   they stand today (`a {defwork} stands`, `The {defwork} stands`, `the town's`, `held by the town`). Those rows are
   not mine and I did not touch them: raised to the chair as a pool-set row, not a text row.**

**Per face — what changed, and the law or target behind it.** (§21.2: lawful is not done. §21.4: never plainer with
no law behind the change.)

1. **`1` `[ledger]`** — *"A {defwork} stands to {settlement}'s name."* → *"{settlement} has the {defwork} standing
   to its name."* The draft's idiom is the best thing in the packet — an item standing to a name is the account's own
   phrase and it pays twice, because the work also literally stands — so it is kept whole and only its grammar moves:
   `{defwork}` leaves subject position (fault 1) and `standing` becomes a participle, which is number-neutral. The
   settlement token opens this row and no other in the pool, which is the one opener order constraint 10 and R-DA-17
   allow; it opens no face, because `assertFaces` bars a face from opening on a `proper`-typed slot (ARCH §2.5, T-F8).
2. **`1-f1`** — *"The town of {settlement} is possessed of a {defwork}."* → *"The item of fortification {settlement}
   shows is the {defwork}."* `The town of` goes for fault 2. `possessed of a` goes for fault 1 and because
   possession-by-adjective is `WALLED-STRAINED`'s spine vocabulary (*"is {settlement}'s own"*, *"held by the town"*,
   *"the town owns"*) — sibling distance. What replaces it is the ledger's own economy: an account **shows** an
   **item** under a head. The face keeps the variant's longest line so the variant is not flat.
3. **`1-f2`** — *"Among the defenses of {settlement} the {defwork} holds its place."* → *"In the {defwork} stands
   {settlement}'s fixed defense."* Three faults in the old line: `the {defwork} holds` breaks on a plural fill,
   `its` points at `{defwork}`, and *"Among the defenses"* implies a plurality of defenses the card holds no field
   for (`may NOT: another civic object of the class wall`). The new line is the pool's ONE inversion, and it is
   number-safe by construction: the postposed subject is `{settlement}'s fixed defense`, singular, so the verb is
   right on every fill. It also moves `{defwork}` to the front of a line for the first time, which is how the pool
   stops closing on the same word.
4. **`1-f3`** — *"At {settlement} the {defwork} is an item of the town's own defensive work."* → *"Under the head of
   defense {settlement} holds the {defwork}."* The old line carried both faults at once (`the {defwork} is` and
   *"the town's own"*) and bought its length with *"an item of ... defensive work"*, a category noun standing in for
   the thing itself — the flab the density law (§21.4) says to cut. `Under the head of` is the ledger's word for the
   account an item is entered against, so the angle is carried by one precise phrase instead of a possessive frame.
5. **`2` `[street]`** — *"{settlement} has a {defwork} standing."* → *"The work of defense at {settlement} is the
   {defwork}."* `a {defwork}` breaks (fault 1), and the settlement-token opener is now spent on row 1, where the
   stronger idiom lives; a pool may spend it once (order constraint 10). What is left is the plainest thing the
   street register can say — a work of defense, named. The line is flat and hard on purpose: it is index 0's
   neighbour and the falsy-seed reader meets this shape.
6. **`2-f1`** — *"A fixture of {settlement} is the {defwork}."* → *"What goes with {settlement} is the {defwork}."*
   The draft's line was already number-safe, so this change is for the pool's grammar spread, not for a fault:
   `goes with` is the draft's own 2-f2 idiom (*"With the town at {settlement} goes a {defwork}"*), which was itself
   broken twice over (`a {defwork}` as an inverted subject, plus `the town`), and the free relative rescues it in the
   one shape that survives the number rule. It is the pool's only cleft. Checked against `WALLED-QUIET`, which owns
   two clefts of its own (*"What {settlement} has is a {defwork}"*): no shared four-gram, and a different verb in a
   different sense.
7. **`2-f2`** — *"With the town at {settlement} goes a {defwork}."* → *"With the {defwork} for a fixture,
   {settlement} is walled."* Both faults were in this one line. The replacement keeps the draft's accompaniment
   sense but re-seats it as an absolute phrase, so `{defwork}` sits inside a preposition and the finite verb belongs
   to `{settlement}`. It closes on `walled`, the state key's own word predicated of the settlement — and pointedly
   NOT on `{defwork}` as the instrument of walling, because the fill class includes `citadel` and `inner citadel`,
   which do not wall a place. That is the draft's own enclosure refusal, extended: the draft still shipped *"Walled
   by a {defwork}"* at 3-f1, which makes the citadel the walling agent. Presence and standing are claimed; geometry
   is not.
8. **`2-f3`** — *"The {defwork} of {settlement} belongs to the town."* → *"For fortification {settlement} has the
   {defwork}."* `The {defwork} ... belongs` breaks on the plural fill and `to the town` is fault 2 — and the pair
   *"belongs to the town"* is the closest any face came to `WALLED-STRAINED`'s *"a work the town owns"*. The
   replacement is the pool's shortest line (six words) and carries no frame at all, which is the spread the variant
   needed and the register's licensed short line (R-DA-05: rhythm follows load).
9. **`3` `[visitor]`** — *"The fortification of {settlement} is a {defwork}."* → *"The fortification of
   {settlement} is the {defwork}."* The smallest change in the packet, and deliberately so: the classification is
   already the right shape for the angle, the subject is singular so the copula is safe on every fill, and only the
   article had to move (fault 1). Nothing else here is bought back.
10. **`3-f1`** — *"Walled by a {defwork}, {settlement} stands."* → *"Fortified, {settlement} has the {defwork} as
    its fabric."* The article breaks and the instrument reading is false on a citadel fill (note 7). `Fortified` is
    the same state stated of the settlement, with no agent, and it keeps the participial opener that gave the draft
    its best rhythm here. `fabric` is the estate's own noun for built work and is the one noun in the packet that
    appears nowhere else in it, so the visitor variant lands on a word of its own.
11. **`3-f2`** — *"Fixed defense at {settlement} takes the form of a {defwork}."* → *"Fixed defense at {settlement}
    takes its shape in the {defwork}."* The article breaks (fault 1). Beyond that, *"takes the form of"* was the
    limpest verb phrase in the packet — a construction that names a category twice and asserts nothing the copula
    would not. `takes its shape in` puts the work where the defense actually consists, and is kept deliberately
    distinct from `1-f2`'s `stands in` so the two are not one idiom in two variants.
12. **`3-f3`** — *"The walled place at {settlement} has its {defwork}."* → *"The standing work at {settlement} is
    the {defwork}."* This face was number-safe, so the change is for sibling distance and for the card's modality:
    `the place` is `UNWALLED-SMALL`'s own noun, used four times there (*"Nothing walls the place"*, *"The place goes
    unwalled"*), and a walled pool borrowing the unwalled pool's head noun is the collision a refuter names first.
    `standing` is the card's modality word carried in the one grammatical role it has not yet taken in this pool —
    attributive — and the line closes on the civic thing the field names.

**Measured, and reported as information only (§21.1: position inside a band is information, never a target).**

- **Openers.** All twelve pairwise distinct on their first two words: `{settlement} has` · `The item` · `In the` ·
  `Under the` · `The work` · `What goes` · `With the` · `For fortification` · `The fortification` ·
  `Fortified, {settlement}` · `Fixed defense` · `The standing` (A11). The settlement token opens exactly one row and
  no face; `{defwork}` opens none, because a `bare-common` fill is lowercase and cannot begin a sentence.
- **Shapes, per variant, four for four.** V1: settlement-subject SVO · copular with a relative · inversion ·
  fronted-PP SVO. V2: copular · free-relative cleft · absolute phrase plus copula · fronted-PP SVO. V3: copular ·
  participial opener plus SVO · bare-NP SVO · copular. One inversion in the pool; two participial or absolute
  openers; four fronted prepositional phrases on four different prepositions (`In`, `Under`, `With`, `For`) — no
  fronted-place habit, no repeated ledger closer.
- **Closes, by KIND (R-DA-04), measured.** The twelve closers in order: `name` · `{defwork}` · `defense` ·
  `{defwork}` · `{defwork}` · `{defwork}` · `walled` · `{defwork}` · `{defwork}` · `fabric` · `{defwork}` ·
  `{defwork}`. Four kinds: the civic thing the field names, 8 of 12; a civic noun, 2 (`defense`, `fabric`); a name,
  1; a condition, 1. **The object close RISES against the draft's 6 of 12, and it is declared, not cured**: with
  `{defwork}` barred from subject position by fault 1, the complement is the position it can lawfully occupy, and
  R-DA-04's headline instruction is to land on the civic noun the field names — the variety limb is the second half
  of that rule, and it is where this pool pays. Deforming a sound line to buy a fifth kind is the move §21.4 names as
  the regression, so the figure is reported instead. A second soft exceedance, within §16.1's budget of a third.
- **Length.** 8 · 9 · 7 · 9 | 9 · 7 · 9 · 6 | 7 · 8 · 10 · 8 (slots counted as one word, the closing period
  dropped). Mean 8.08, range 6 to 10, population sd **1.12**, against R-DA-05's ≥ 4.0 spread figure. **This misses by
  more than the draft did (sd 2.10), and the miss is declared, not cured.** The draft's wider spread was bought in
  part with words that assert nothing — *"an item of the town's own defensive work"*, *"is possessed of"* — and one
  of those phrases carried the tier claim, so the spread fell as the flab and the unlicensed claim came out. §21.4
  rules that padding a lawful line toward a band's middle is the regression; §16.1 allows the exceedance within the
  budget of a third. A longer line on this pool could only be built from a claim the card refuses.
- **Zero of each, checked wording by wording:** digit, percent, em dash, en dash, exclamation, question, colon,
  semicolon, parenthesis, `which`, `-ly` adverb, `-ing` opener, `There is` / `It is` opener, `and` or any coordinate
  tail, doubled adjective, triad, quantifier (`no`, `every`, `all`, `only`, `nobody`, `none`, `whatever`), future
  indicative, past marker, contrast shape, bare relative on a slot, citation or provenance lexicon, cognition verb,
  sense verb on an abstraction, simile, `thing`, and the words `town`, `village`, `place`, `keeps`, `owns`, `own`,
  `up`, `entered`, `books`, `record`, `circuit`, `wall` as a noun.
- **Sibling distance, measured by hand.** Against the two modifier pools that attach to this spine
  (`country: pressed (walled)` and `watch: bought (revealed)`, read at `$SC/taste/*/refine-A.md` and `refine-B.md`):
  no wording of mine names the country, the threat, a grade word, the watch, a purchase, the muster, a wage or a
  record-holder, and the whole record lexicon those pools live on (`entered`, `set down`, `booked`, `marked`, `the
  entry`, `the books`, `the return`) is left to them — my `[ledger]` variant is an ACCOUNT (name, item, head), never
  a writing act. Shared four-grams with either pool: zero. Against this block's four sibling spine pools: no wording
  reuses `keeps`, `is up`, `entered as standing`, `the town's`, `owns`, `held by the town`, `walled with`, `the
  place`, `circuit`, `weight`, `stands open`. `stand` in any form appears three times across the twelve, against
  eleven in `WALLED-QUIET`, and in three different grammatical roles (a participle on an item, a finite verb in the
  inversion, an attributive adjective).
- **Claims.** All twelve assert exactly `(PRESENT, forces.walls.present, true)`, with the work identified as the
  settlement's own fixed defense — the belonging the SLOTS line and `defenseProfile.institutions.walls` carry, and
  nothing further. Claim-equal across the four faces of each variant (arm A6) and across the three variants. Nothing
  is claimed of the threat (`settlement.config.monsterThreat` reaches the reader through the modifier composed beside
  this spine) or of the upkeep gate (`economicGates.military`, which is `WALLED-STRAINED`'s discriminator) — the
  draft's refusals 2 and 3 stand unchanged. **One claim leaves the pool in this round: the tier claim carried by
  `town`.** That is a failing state removed and no new one added (§21.2), not a trim (§22): twelve wordings in,
  twelve out, every vid, order and angle tag intact, and the draft's text stays in the annex history.
- **The thread (§1.4.1).** A spine is first in the composed unit, so it hands the thread forward rather than picking
  one up. Every one of the twelve carries `{settlement}`, and none closes on it or on a pro-form, so any modifier the
  composer ranks first by salience reads cleanly after any of the twelve — and both attaching modifier pools carry
  `{settlement}` themselves, so the noun is there to be taken up. Two rows now close on `walled` and on `fabric`,
  which gives a following modifier a second noun to carry forward where the draft offered only the object. No wording
  turns outward; a spine's one claim is the passage's opening fact and the turn outward is placed last.
- **Grammar spread.** Unchanged from the draft and reported, not faked: with one field, one claim and no second
  licensing field, V2, V3, V6, V7 and V8 are filtered out for want of their licensing fields and V4/V5 would need a
  second assertion the card refuses, so all twelve realise V1 (PRESENT) in different syntactic shapes.
  MOVE-GRAMMAR §2.1's min(k, 8) distinct level-1 grammars is not reachable on a single-field spine; the census
  already records `grammars: 2` for the shipped pool. No `[grammar: Vn]` tag is authored on any row.

**Refusals (a refusal is a result).**
1. **No citation on any of the twelve**, on the draft's four grounds, re-checked against the card as printed today.
2. **No cure for the `{defwork}` wiring gap.** The card still prints `NAMED BUT NEVER FILLED: {defwork}` at this
   block's call sites while `defworkFill` exists at `defenseStateProse.js:912`; that disagreement is a census/wiring
   row for the chair, not a text row, and I wrote to the card as printed. The slot set is `{defwork} {settlement}` on
   all twelve, identical within each variant, which is what `assertFaces` requires.
3. **The two faults above are cured only inside this pool.** The four sibling pools of DS-DEF-11 carry the same
   broken articles, the same `{defwork}`-as-subject agreements and the same `town` tier claim. Touching them is a
   chair act; naming them is mine.
