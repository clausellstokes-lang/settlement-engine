DS-DEF-2 · pool `Internal Security: no legal infrastructure` · REWRITE draft round 1
Writer: Opus 5 (Fable-unvalidated) · role `spine` · 3 variants in, 3 variants out · 12 wordings

The rows below are the complete replacement for the pool's variant rows, ready to paste under
the pool's bold heading. The typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are not
repeated and are not this writer's.

1. `[ledger]` {settlement} keeps neither a court nor a prison.
   - `[face]` No court sits at {settlement}, and the town has nowhere to hold a prisoner.
   - `[face]` Court and cell are both things {settlement} does without.
   - `[face]` A charge at {settlement} has no court to be tried in. The town has nowhere to keep the person charged.
2. `[street]` A wrong done in the town comes before no court, and whoever did it goes into no cell.
   - `[face]` The town has no court to try a case in and no lock-up to hold a prisoner.
   - `[face]` Neither court nor cell has a place in the town.
   - `[face]` A prisoner would have nowhere to be kept in the town, and a case nowhere to be heard.
3. `[visitor]` A stranger who brought a complaint to {settlement} would find neither a court to hear it nor a cell for the one complained of.
   - `[face]` At {settlement} a traveller would find no court for a complaint and no cell for a prisoner.
   - `[face]` The court a stranger would look for at {settlement} is not there, and neither is the cell.
   - `[face]` A complaint carried into {settlement} has no court to come before. The one it names has no cell to be held in.

--- NOTES

**THE CARD, AS THIS PACKET READS IT.** `internalRowPoolKey(court, prison)`
(`src/domain/display/stateProse/defenseStateProse.js:506`) returns this pool's key on the one
branch `!court && !prison`, and the card's `reads` are exactly `court` (not-produced) and
`prison` (not-produced). So the pool's whole licensed claim set is two standing negatives:
this town holds no court, and this town holds no place of detention. The card's `may claim`
line ("that `court` holds, as a STANDING fact of the record") is read on the negative branch
as the standing fact the branch selects on. `predicate: (none recovered)` is the card's own
row for a pool whose key function it did not table; the branch above is quoted rather than
inferred. Nothing else on the card is fillable: `bag` is FILLED at `{settlement}` alone
(`band` RESERVED, `route` unfilled), `relation`/`attach` are empty because a spine takes
neither, `move: (none declared)`, `source: (none) · SOURCE-UNRESOLVED` so **no face names a
holder** (arm A13), `covert: no` so every row is the player's with no mark.

**LICENCE PER FACE.** Every one of the twelve wordings asserts the same two claims and no
third, so the licence reads once per claim rather than once per face:

| claim | licensed by | carried by |
|---|---|---|
| the town holds no court | card `reads: court (not-produced)` on the branch `!court && !prison`; `may claim: … as a STANDING fact` (present tense, no history — R-DST-B) | all 12 wordings |
| the town holds no place of detention | card `reads: prison (not-produced)`, same branch and same standing | all 12 wordings |
| the slot `{settlement}` | card `bag: {settlement: proper}`, FILLED at this block's call sites | v1 all four faces; v3 all four faces; v2 none (slot-set parity with its own parent, ARCH §2.5's face rule) |

**WHAT WAS DROPPED, AND UNDER WHICH REFUSAL.**

- v1 old, "order here rests on force alone" — a claim about what holds order, licensed by no
  read on the card; card `may NOT: a cause`, `a second fact`. DROPPED.
- v1 old, "force alone deters only while it is present" — a life-general closer (R-DA-12's
  generalisation test; MOVE-GRAMMAR §1.3's MEANING and VERDICT non-moves) and a claim about
  deterrence no field holds. DROPPED.
- v1 old, "There is no legal machinery" — the expletive opener (R-DA-07, direction down); the
  claim itself is kept, narrowed to the two named fields (R-DA-10's concrete civic noun).
- v2 old, "settles things itself, quickly" — a positive claim about how disputes are settled
  and how fast; no read, and a season/rate the card refuses. DROPPED.
- v2 old, "does not always settle them well" — an evaluative verdict (MOVE-GRAMMAR §1.3
  VERDICT; card `may NOT: a standpoint`). DROPPED.
- v3 old, "A stranger wronged at {settlement} discovers" — the wronging is an event no
  provenance field holds (R-DST-B: a standing configuration field licenses no history). The
  hypothetical is kept but moved into the subjunctive, where it asserts nothing (A2, the edge
  is subjunctive).
- v3 old, "the discovery surprises nobody local" — a totality over persons (the card's
  REFUSED COLUMNS, always) and a FEELING (MOVE-GRAMMAR §1.3). DROPPED.
- v3 old, "there is nowhere to take it" — kept, but NARROWED: read whole it claims no forum of
  any kind, which is a totality the card does not license; it is rewritten as the two licensed
  members of the pair. Narrowing an over-broad claim to its licensed core is a drop, not an
  addition.

**THREE JUDGMENTS THIS PACKET MAKES, EACH RECORDED SO IT CAN BE VETOED.**

1. *The pair is written as ONE compound LACK, not two adjacent ABSENCE moves.* MOVE-GRAMMAR
   §1.2 row 11 bars an ABSENCE sitting beside another ABSENCE. The two negatives here are the
   two coordinates of a single branch — the pool key IS the pair — so they are written as one
   move over a compound object. If the chair reads them as two moves, every face in the pool
   breaches the adjacency wall and the pool cannot be written at all under its own key; that
   reading is therefore refused here and flagged.
2. *Every variant carries both members of the pair.* The rewrite law keeps the licensed claims
   the OLD sentence made. Old v2 named neither member explicitly and old v3 named an
   over-broad "nowhere"; in both the licensed content is the branch's own situation, which is
   the pair. Writing the pair in all three keeps the pool's siblings claim-coherent (arm
   C-sibling) and keeps the four faces of each variant claim-equal to each other (arm A6).
3. *The `[visitor]` angle survives the card's "may NOT: a standpoint".* A standpoint refusal
   bars asserting what someone believes or perceives; v3 asserts no belief and no perception,
   only the lack, reached through a subjunctive antecedent that asserts nothing (A2). The angle
   tag is the variant's own and may not be changed, so the alternative was a refusal row; this
   writer judges the subjunctive lawful instead.

**FORM CHECKS RUN OVER ALL TWELVE WORDINGS.** No em dash · no exclamation · no question · no
digit or percent · no `which`-clause · no `There is`/`It is` opener · no future indicative
(three `would`s, all subjunctive) · no citation and no record holder named · no count · no
cause · no totality over persons · no named character · no figure, no sense verb on an
abstraction, no inanimate intent · no fragment (every row is FORM `sentence`) · no `[plain]`
marker and exactly one bracketed angle tag per numbered row.

**SPREAD (A11, R-DA-05).** The first two words of all twelve wordings are distinct:
`{settlement} keeps` · `No court` · `Court and` · `A charge` · `A wrong` · `The town` ·
`Neither court` · `A prisoner` · `A stranger` · `At {settlement}` · `The court` ·
`A complaint`. Sentence counts differ inside the pool (one sentence and two). No closer is a
pronoun (R-DA-04). The settlement token opens exactly ONE wording in the pool, the v1 variant
row (R-DA-17's ceiling of one per pool); **no `[face]` sub-row opens on the proper-typed slot**
(ARCH §2.5, T-F8). Word counts: v1 8 · 14 · 9 · 20; v2 18 · 17 · 10 · 18; v3 24 · 17 · 17 · 22.

**THE THREAD (owner, 2026-09-08 ~21:4x).** This pool is a spine, so every wording is the
passage's first sentence and hands a noun forward rather than picking one up: each ends on a
civic noun a modifier can thread from (`prison`, `prisoner`, `cell`, `court`, `the town`). The
two two-sentence faces thread inside themselves — v1's third face carries `charge` forward as
`the person charged`, v3's third carries `complaint` forward as `the one it names` — so neither
changes subject without handing something back.

**SIBLINGS (arms A1, A11).** The three sibling pools of this row are `full legal chain (court
AND prison)`, `court without detention` and `detention without process`. No wording here
borrows their key language (the phrase "legal chain" is deliberately not used), none restates
them, and none contradicts them: every claim is the negative of the pair they divide. Nothing
here names the watch, the muster, the walls, a garrison or a militia — those are the other
rows' and DS-DEF-11's facts, and the echo bound (spine mounts 1, tabs: defense) keeps this
spine off them.

**REFUSALS:** none. All three variants are written lawfully at draft round 1; no variant is
banked.
