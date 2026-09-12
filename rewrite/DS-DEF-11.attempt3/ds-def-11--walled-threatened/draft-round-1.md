Seat: Opus 5 — WRITER (Fable-unvalidated). Block DS-DEF-11 · pool `WALLED-THREATENED` · DRAFT round 1.
The rows below are the complete replacement for the pool's three variant rows and nothing else. The block's
typed lines (RECEIPT / STATE-KEY / SLOTS / SECTION-TARGET / PROVENANCE) are not mine and are not repeated.
Three variants, in their own order, under their own vids, each with its own angle tag; four wordings each.

1. `[ledger]` A {defwork} stands to {settlement}'s name.
   - `[face]` The town of {settlement} is possessed of a {defwork}.
   - `[face]` Among the defenses of {settlement} the {defwork} holds its place.
   - `[face]` At {settlement} the {defwork} is an item of the town's own defensive work.
2. `[street]` {settlement} has a {defwork} standing.
   - `[face]` A fixture of {settlement} is the {defwork}.
   - `[face]` With the town at {settlement} goes a {defwork}.
   - `[face]` The {defwork} of {settlement} belongs to the town.
3. `[visitor]` The fortification of {settlement} is a {defwork}.
   - `[face]` Walled by a {defwork}, {settlement} stands.
   - `[face]` Fixed defense at {settlement} takes the form of a {defwork}.
   - `[face]` The walled place at {settlement} has its {defwork}.

--- NOTES

**The card, printed first and read whole** (`node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-THREATENED'`,
run read-only in `$SC/laneRW-DEF11`):

```
LICENCE (block DS-DEF-11 · role spine · key `WALLED-THREATENED`)
  reads:      forces.walls.present   (measured)
              settlement.config.monsterThreat   (measured)
              settlement.defenseProfile.economicGates.military   (measured)
  predicate:  (none recovered: the pool has no key-function branch)
  bag:        {defwork: bare-common, settlement: proper}
              FILLED at this block's call sites: {settlement} · NAMED BUT NEVER FILLED: {defwork}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 2 (tabs: defense) · modifier mounts 0 (none)
  covert:     no
  source:     muster + road · standing LICENSED · two-source row
  may claim:  that `present` holds, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact,
              another civic object of the class `wall`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character
              and that character's fate; a theological claim about a deity
```

**THE ONE LICENSED CLAIM, and why it is one.** The card's `may claim` line names a single triple:
`(PRESENT, forces.walls.present, true)` — the settlement holds a wall-class work, as a STANDING fact of the
record. Every one of the twelve wordings below asserts that triple and asserts nothing else, so the four
wordings of each variant are claim-equal to one another (arm A6 reads across the faces), and the three
variants are claim-equal to each other, which is what MOVE-GRAMMAR §1.1 requires of a pool ("the claim is
what the seed may never vary; the grammar is what it must"). The claim set is checked against the census row,
not inferred: `predicate: []`, `readsGrain: "branch"`, `objectClass: "wall"`, `slotsFilled: ["settlement"]`,
`slotsWithoutProvider: ["defwork"]`, `source.holder: null`, `source.standing: "LICENSED"`.

**Per variant — what the shipped sentence claimed, what is KEPT, what is DROPPED.**

**1 `[ledger]` (shipped):** *"{settlement} keeps its {defwork} because the country requires it; the threat is
on the town's books as plainly as the grain."*
- KEPT: the wall-class work stands to the settlement — card `may claim`, on the read `forces.walls.present`.
- DROPPED (a cause): *because the country requires it* — card `may NOT: a cause`; and R-DST-B, since a standing
  configuration field licenses a structural clause and never a historical or causal one.
- DROPPED (a second fact): *the threat is on the town's books* — card `may NOT: a second fact`. See refusal 2.
- DROPPED (a figure): *as plainly as the grain* — a comparison that is not a measurement in words (R-DA-11),
  and a second civic object the card holds no field for.
- DROPPED (the trailing coordinate): the semicolon limb goes with the second fact it carried; the rewritten
  variant carries no semicolon and no coordinate tail, so arm Q's trailing-coordinate shape cannot fire.

**2 `[street]` (shipped):** *"Nobody in {settlement} thinks of the {defwork} as ornament; the town knows what
it is for and checks it."*
- KEPT: the wall-class work is the settlement's and stands — card `may claim`.
- DROPPED (a totality over persons): *Nobody in {settlement}* — the card's REFUSED COLUMNS, always.
- DROPPED (a belief frame and a standpoint): *thinks of … as ornament*, *the town knows what it is for* —
  card `may NOT: a standpoint`; FEELING and MEANING are non-moves estate-wide (MOVE-GRAMMAR §1.3); R-DA-14.
- DROPPED (a purpose): *what it is for* — a cause in the dative.
- DROPPED (a duty, and an act): *and checks it* — an INSTITUTION assertion needs a `whatItDoes` row, and the
  institution table's duty columns are `closed: false` at this tip (CLERK-LAWS §1.2 note); no act is licensed
  without event provenance, which this block's own PROVENANCE line says it does not have.

**3 `[visitor]` (shipped):** *"{settlement} is enclosed the way working things are enclosed: against
something, and recently attended to."*
- KEPT: the wall-class work stands at the settlement — card `may claim`.
- DROPPED (a figure and a generalisation): *the way working things are enclosed* — R-DA-11 and R-DA-12.
- DROPPED (a cause): *against something* — card `may NOT: a cause`.
- DROPPED (a season and an act with no provenance): *recently attended to* — card `may NOT: a season`; the
  block's PROVENANCE line records that the one historical clause this block might want has no backing fact at
  this tip and is deliberately absent.
- Also dropped, deliberately: the word *enclosed*. The engine's wall-name class includes `inner citadel`
  (`defenseGenerator.js`), which does not enclose a settlement, so a fill can make an enclosure sentence false.
  The rewritten variant asserts presence and standing, never geometry.

**Per face — which card clause licenses each claim it makes.** Every row below makes exactly one claim; the
licence is the same clause in all twelve, and the two slot fills are licensed by the `bag` line.

| row | the claim it makes | licensing clause of the card |
|---|---|---|
| 1 | a wall-class work stands to the settlement | `may claim: that \`present\` holds, as a STANDING fact` (read `forces.walls.present`, measured); slots by `bag` |
| 1-f1 | the settlement is possessed of a wall-class work | the same `may claim` clause; `bag: {settlement: proper}` |
| 1-f2 | a wall-class work holds its place among the settlement's defenses | the same `may claim` clause; the plural `defenses` names no second object of class `wall` |
| 1-f3 | a wall-class work is an item of the settlement's own defensive work | the same `may claim` clause; `objectClass: wall` bars a second one, and none is named |
| 2 | the settlement has a wall-class work standing | the same `may claim` clause, with the STANDING modality in the participle |
| 2-f1 | a wall-class work is a fixture of the settlement | the same `may claim` clause; `fixture` carries permanence, not upkeep |
| 2-f2 | a wall-class work goes with the settlement | the same `may claim` clause; accompaniment, never a cause |
| 2-f3 | a wall-class work belongs to the settlement | the same `may claim` clause; possession by `defenseProfile.institutions.walls` being the settlement's |
| 3 | the settlement's fortification is a wall-class work | the same `may claim` clause, as a classifying predication |
| 3-f1 | the settlement stands walled by a wall-class work | the same `may claim` clause; `walled` is the state key's own word, the instrument not a cause |
| 3-f2 | the settlement's fixed defense takes the form of a wall-class work | the same `may claim` clause; `fixed` classifies a kind, never an event |
| 3-f3 | the walled place at the settlement has its wall-class work | the same `may claim` clause |

**Refusals (a refusal is a result).**

1. **No citation on any of the twelve, though one is licensed.** The card prints `source: muster + road ·
   standing LICENSED · two-source row` and "a citation of this holder is licensed where the provenance budget
   allows". It is refused on four grounds. (a) The census row's `source.holder` is `null` with
   `holderReason: "town-resolved: … the holder is named by holdersOf(kind, settlement)"`, so no face can name
   the holder without inventing one. (b) None of S3's three reasons holds: there are not two accounts that
   disagree, the claim is not a count, and the fact is not one whose keeper is a power in this town. (c) Part B
   §24 sets the ceiling at one citation per unit and records the exemplar registers citing at 0 per 786
   sentences, so a citation on a plain standing fact is the habit arm A13 and §4.4.3 refuse. (d) A citation is
   two licensed claims (S3), and a variant's four wordings must carry one identical claim set, so a citation on
   one face breaks claim-equality and on all four is the habit. The lawful place to exercise the move on this
   block is a chair act, not a writer's draft.

2. **The threat is claimed nowhere, though `settlement.config.monsterThreat` is a measured read.** The card's
   `may claim` is built from the predicate's field and falls back to `reads[0]` because the census recovered no
   predicate for `wallRationalePoolKey` (`predicate: []`, `readsGrain: "branch"` — the reads are the whole
   selecting branch, and its first entry is only the primary field). So the only claim the card licenses is
   `present`. Independently: the sibling modifier pool `country: pressed (walled)` asserts exactly
   `settlement.config.monsterThreat` as a standing fact and attaches to the walled spines, so a spine asserting
   the threat would restate a sibling (arms A1 and A11) as well as add the second fact the card refuses. The
   threat reaches the reader through the modifier composed beside this spine, which is the composed-prose
   architecture working as designed.

3. **The upkeep gate is claimed nowhere.** `settlement.defenseProfile.economicGates.military` is a measured
   read of the same branch and is the discriminator of the sibling pool `WALLED-STRAINED`; the card licenses no
   claim on it here. This is why no wording uses `keeps`, `keeps up`, `sound`, `whole`, `manned` or `stays up`:
   each would assert a condition of the work beyond its presence, and three of them are the strained pool's.

4. **The noun `wall` appears nowhere; only the adjective `walled`.** The card refuses "another civic object of
   the class `wall`", and a bare `wall` standing beside `{defwork}` reads as a second object of that class.
   `walled` is the state key's own word and asserts the licensed predicate, not an object. For the same reason
   no gate, ditch, tower, rampart, circuit, stone or timber is named anywhere: the block's SLOTS line rules
   that the wall-class work is named by its RECORDED name through `{defwork}` and never by a baked noun.

5. **`{defwork}` is kept in all twelve, against a printed wiring gap.** The card says
   "NAMED BUT NEVER FILLED: {defwork}" and the census row carries `slotsWithoutProvider: ["defwork"]`. A writer
   cannot cure that: dropping the slot would mean naming the work with a baked noun, which the block's SLOTS
   declaration forbids, and would also change the wording set's slot signature away from the shipped rows'.
   The slot set is `{defwork} {settlement}` on all twelve, identical within each variant, which is what
   `assertFaces` requires. **The gap is raised to the chair as a wiring row, not a text row.**

6. **The pool cannot carry three distinct level-1 grammars.** MOVE-GRAMMAR §2.1 asks a pool of k variants for
   min(k, 8) distinct level-1 grammars. With one field, one claim and no second licensing field, V2
   (PRESENT → CONSEQUENCE), V3 (PRESENT → LACK), V6 (PRESENT → OPEN), V7 (HISTORY → PRESENT) and V8
   (PRESENT → GAP) are all filtered out for want of their licensing field, and V4/V5 would need the object or
   institution row to carry a second assertion the card refuses. Every wording is therefore a realisation of V1
   (PRESENT) in a different syntactic shape. The census already records `grammars: 2` for the shipped pool, so
   this is not a regression the rewrite introduces; it is a structural property of a single-field spine, and it
   is reported here rather than faked with a grammar tag. No `[grammar: Vn]` tag is authored on any row.

7. **A sitting row, raised because the rewrite surfaced it.** Under a strict reading of the card, the spines of
   `WALLED-THREATENED`, `WALLED-QUIET` and `WALLED-STRAINED` all license one and the same claim — that
   `forces.walls.present` holds — because the census recovered no predicate for `wallRationalePoolKey` and the
   fallback is `reads[0]` for all three. The three pools then differ only in the modifiers composed beside them.
   That may be the intended architecture (the spine states the standing fact; the modifiers carry the threat and
   the purse), or it may mean the card's `may claim` line under-serves a multi-field spine and the key
   function's branch should be recovered so the predicate resolves. **The chair's, not a writer's.** I wrote to
   the card as printed.

**The soft bands, measured and reported as information (§21.1: position inside a band is information only).**

- Words per wording: 6 · 9 · 10 · 13 | 5 · 7 · 8 · 8 | 7 · 6 · 10 · 8. Mean 8.08, range 5 to 13,
  population sd **2.10**. This MISSES R-DA-05's ≥ 4.0 spread figure, and the miss is declared rather than
  cured: the licensed claim has one limb, R-DA-05's own statement is that rhythm follows load, and §21.4 rules
  that padding a lawful line toward a middle is the regression. A longer line here could only be built from
  words that assert nothing. One soft rule exceeded, within §16.1's budget of a third.
- Openers: all twelve are pairwise distinct on their first two words — `A {defwork}` · `The town` ·
  `Among the` · `At {settlement}` · `{settlement} has` · `A fixture` · `With the` · `The {defwork}` ·
  `The fortification` · `Walled by` · `Fixed defense` · `The walled` (A11).
- The settlement token opens exactly ONE row in the pool (variant 2, the `[street]` row) and no face, down
  from two of three shipped variant rows: order constraint 10 and R-DA-17 ("the town's name is not the default
  opener"), and `assertFaces`' proper-slot bar, which applies to face rows and not to the parent row
  (`dossier-annex-grammar.mjs:693`).
- No wording ends on `{settlement}` (the `…ment` closer detector) or on a pronoun. The twelve closers, in
  order: `name` · `{defwork}` · `place` · `work` · `standing` · `{defwork}` · `{defwork}` · `town` ·
  `{defwork}` · `stands` · `{defwork}` · `{defwork}`. By KIND that is the object 6 · a condition 3
  (`place`, `standing`, `stands`) · a civic noun 2 (`work`, `town`) · a name 1. R-DA-04 asks that the KIND of
  close vary across the pool and that a variant land on the civic noun the field names; four kinds appear, and
  the object close is high at 6 of 12 because the field names exactly one civic thing and the claim has one
  limb, so a close of another kind would have to be bought with a word that asserts nothing. Reported as a
  second soft exceedance, within §16.1's budget of a third.
- Zero of each, checked wording by wording: digit, percent, em dash, en dash connector, exclamation, question,
  colon, semicolon, parenthesis, `which`, `-ly` adverb, `-ing` opener, `There is` / `It is` opener, doubled
  adjective, triad, quantifier (`no`, `every`, `all`, `only`, `nobody`, `none`), future indicative, past marker
  (`was`, `were`, `had`, `once`, `formerly`, `still`, `no longer`, `since`, `recently`), contrast shape
  (`rather than`, `not X but`, `, not x`, `less … than`), wh-cleft, bare relative, record-citation shape,
  provenance lexicon, cognition verb, sense verb on an abstraction, simile, and `thing` (the abstract-closer
  detector matches `thing\b`).
- **No `and` and no coordinate tail anywhere in the twelve.** The shipped pool's three semicolon limbs are the
  shape the walk raises WITHHELD rows on; the rewrite carries none, so no wording offers arm Q a trailing
  coordinate and no wording asks S2's clause seat for a consequence it has no field for.
- Sibling distance, measured by hand against the two modifier pools that attach to this spine
  (`country: pressed (walled)`, `watch: bought (revealed)`, read at `$SC/taste/*/refine-B.md`): no wording of
  mine names the country, the threat, a grade word (`beset`, `harried`, `settled`), the watch, a purchase, the
  muster, wages or a record-holder; shared four-grams with either pool, zero. Against the four sibling spine
  pools of this block as they stand today: no wording reuses `keeps`, `stone`, `circuit`, `marks where`,
  `too small`, `ahead of any present need`, or `stands better than`.

**THE THREAD (§1.4.1).** This pool is a spine, so it is always first in the composed unit and hands the thread
forward rather than picking one up. Every one of the twelve carries `{settlement}` and `{defwork}`, and
`{settlement}` never falls last, so the sentence that follows has the town's name to take up — which is
exactly what both attaching modifier pools do: every face of `country: pressed (walled)` and of
`watch: bought (revealed)` carries `{settlement}` and takes it forward. No wording of mine leans on a pronoun
reaching outside its own sentence, and none closes on a pro-form, so any modifier the composer ranks first by
salience reads cleanly after any of the twelve. No wording turns outward, because a spine's one claim is the
passage's opening fact and a turn outward is placed last.

**Nothing trimmed (§22).** Three variants in, three variants out, under vids 1, 2 and 3, in the shipped order,
under the shipped angle tags `[ledger]`, `[street]` and `[visitor]`. No variant added, removed or merged; no
`[plain]` marker anywhere (it belongs to modifier rows and the projector refuses it on a spine); one bracketed
tag per row. Four wordings per variant, one for one with the owner's four-faces rule. The shipped wording of
each variant leaves the product because it fails the voice; its slot survives and its text stays in the annex
history.
