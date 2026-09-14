# DS-DEF-5 · `walls ABSENT` · REWRITE draft round 1

Seat: Opus 5 (Fable-unvalidated) · block `DS-DEF-5` · role `spine` · 3 variants in, 3 variants out, 12 wordings (the numbered row plus three faces on every variant).

Paste-ready: the three numbered rows below are the COMPLETE replacement for the pool's three variant rows under the bold pool line **walls ABSENT**. Same vids, same order, same angle tags, none added, none removed, none merged. The pool declares no typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) in the annex today; none is touched and none is repeated here.

1. `[ledger]` {settlement} keeps no wall.
   - `[face]` No wall stands at {settlement}.
   - `[face]` {settlement} is entered as an unwalled town.
   - `[face]` Fortification is a thing {settlement} does not have.
2. `[visitor]` A traveller comes the whole way into {settlement} without coming to a wall.
   - `[face]` The way into {settlement} passes no wall.
   - `[face]` A stranger arrives at {settlement} and arrives at no wall.
   - `[face]` From the road, {settlement} is a town no wall encloses.
3. `[street]` The town at {settlement} has an edge and not a wall.
   - `[face]` Open on every side, the town at {settlement} is unwalled.
   - `[face]` Round the town at {settlement} no wall runs.
   - `[face]` A wall is what the town at {settlement} lacks.

--- NOTES

## A. The card, printed, and the clause labels used below

`node scripts/prose-licence-card.mjs DS-DEF-5 'walls ABSENT'` returns, in the dock at `laneRW-DEF5`:

```
LICENCE (block DS-DEF-5 · role spine · key `walls ABSENT`)
  reads:      forces.walls.present   (measured)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  (none recovered: the pool has no key-function branch)
  bag:        {band: RESERVED, counterpart: proper, faction: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 2 (tabs: defense) · modifier mounts 0 (none)
  covert:     no
  source:     muster · standing LICENSED
  may claim:  that `present` holds, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
  everywhere); a named character and that character's fate (product scope); a theological claim
  about a deity (the deity doctrine)
```

- **[MC]** — the card's `may claim` line, read with `reads` and with the POOL KEY. **The card's own polarity is coarse and the packet says so up front:** the same card prints for `walls PRESENT` and for `walls ABSENT`, both with `may claim: that present holds`, because `predicate` recovered nothing (the block has no key-function branch for the walls pools). The discriminator is the pool key itself, exactly as the two sibling pools of one field divide it, and the block's own STATE-KEY (`RECEIPT_POOLS_DOSSIER_STATE.md:2866-2869`, the group `Fortifications` (walls)) with its FENCE (`:2872-2879`, *walls ride `defenseProfileHasWalls`, never a presence check*). So [MC] for THIS pool is: **the reading of the fortifications group for this town is the ABSENT value — the town has no wall — as a STANDING fact of the record.** One claim, and it has no second half; §G names this as the call a refuter should test first.
- **[BAG]** — `{settlement}`, `proper`, FILLED. It is the only slot written anywhere in the packet; `{band}` is RESERVED, `{counterpart}` and `{faction}` are not filled at this block's call sites, so no wording names them. Every wording carries exactly one `{settlement}`, so every face's `{slot}` set equals its parent's (§2.5's face refusal held).
- **[MN]** — `may NOT`: a count, a cause, a season, a future, a standpoint, a second fact.
- **[SRC]** — source `muster`, standing LICENSED, *a citation of this holder is licensed where the provenance budget allows*. **No wording spends it.** §24's ceiling licenses a citation only for one of S3's three reasons (two accounts that disagree; a count from an interested party; a record whose keeper is a power); this card holds no second account, the packet writes no count, and no typed fact on this card makes the muster a power. The exemplar registers with raw text cite at zero per 786 sentences, so the budget is spent nowhere in this pool and arm A13 has nothing to catch. Recorded because the licence exists and was declined, not because it was overlooked.
- **[RC]** — REFUSED COLUMNS, always. None is approached: **the packet contains zero personal pronouns** (the shipped `[visitor]` row's *him* is gone with the clause that carried it), no person is counted, excepted or named, and no deity is named.
- **[FENCE]** — the block's own PROVENANCE + FENCE (`:2872-2879`) and arms A1/A11 against the sibling spines this pool sits beside on the `defense` tab. `walls ABSENT` can render in the same passage as `garrison PRESENT`, `militia PRESENT`, `watch PRESENT`, `mercenary`, `charter hall`, `arcane defense` and as `NO organized force at all`. **So no wording in this packet says that anybody is or is not there, that anything is or is not stopped, watched, counted or kept, that entry can or cannot be controlled, or what the town can or cannot do.** It also names no terrain, no threat, no upkeep and no readiness band (`DS-DEF-1`, `DS-DEF-2`, `DS-DEF-6`), and no rationale for the state of the walls (`DS-DEF-11`, `defense.wallRationale`). This is the single largest change from the shipped rows.

## B. The claim set, and what was dropped from each shipped variant

All twelve wordings carry [MC] and nothing else, so the four wordings of each variant are claim-equal to each other (arm A6 read across the faces, not back to the shipped sentence). What the shipped rows carried and the card does not license is dropped, which is the rewrite's purpose; nothing is added.

- **v1 `[ledger]`** — shipped: *"{settlement} is unfortified. There is no perimeter, which means the town cannot control entry and cannot make a chokepoint of anything."* Kept: the town is unfortified ([MC]). Dropped: *"There is no perimeter"* as a second sentence (the summarising restatement R-DA-03 and R-DA-12 drive to 0.000, and an existential opener against R-DA-07's `There/It is` band); *", which means…"* (a `which`-tail, wall 6 of MOVE-GRAMMAR §1.4 and R-DA-03 — and the MEANING move, which does not exist anywhere in the estate, §1.3); *"the town cannot control entry"* (a CONSEQUENCE the card refuses under [MN], and a claim that reads across the watch and garrison spines — [FENCE]); *"cannot make a chokepoint of anything"* (a second consequence, and a totality).
- **v2 `[visitor]`** — shipped: *"A stranger arrives at {settlement} from whichever direction suits him and is not obliged to pass anybody on the way in."* Kept: the approach meets no wall ([MC], in the angle's vantage). Dropped: *"is not obliged to pass anybody"* (a fact about persons on the way in, which the card does not hold, which is a totality over persons under [RC], and which would flatly contradict the `garrison PRESENT` and `watch PRESENT` spines it can be composed beside — [FENCE]); *"him"* (a pronoun the `gender` field does not underwrite — NL-4's 234-line finding).
- **v3 `[street]`** — shipped: *"The town has an edge rather than a boundary at {settlement}, and the edge is wherever the last building happens to be."* Kept: the town's edge is not a made wall ([MC]), as the sibling-licensed contrast. Dropped: *"the edge is wherever the last building happens to be"* (a second fact, about the built fabric, on a field this card does not carry — [MN]); *"boundary"* is replaced by *"wall"* because the licensed fact is the fortification and a boundary is also read as a jurisdiction, which is a different field (this is a precision cut, never a plainness cut — §21.4).

## C. Per face — which clause licenses which claim

**Variant 1 `[ledger]` — the office's flat entry; the pool's short lines, and its only settlement-token openers.** Wall 10 of MOVE-GRAMMAR §1.4 is held under every draw: the token opens wordings only inside THIS variant, so any rendering of the pool shows at most one settlement-opener and no two adjacent.
- Row: *keeps no wall* is [MC] entire, in the block's own verb (its sibling spines read *keeps a standing force*, *keeps a watch*, *keeps a charter*), so the pool's negative reads in the same idiom as its positives. Four words: the short line the register card licenses, and the line a falsy seed draws (canonical-at-zero, §3.2). *Keeps* is the office's plain word for what a town has in its keeping and carries no choosing — the WHY of a wall is `DS-DEF-11`'s and is not touched.
- Face 1: *No wall stands at {settlement}* is [MC], the same fact on the wall as subject. Not an existential: the verb is a real one and the opener is the negative determiner, so R-DA-07's `There is` band is not entered.
- Face 2: *entered as an unwalled town* is [MC] in the record's accounting idiom. *Entered* is the office's own act of setting the fact down, never a citation of a holder ([SRC] held: the office does not cite its own books — §24 and arm A13).
- Face 3: *Fortification is a thing {settlement} does not have* is [MC] with the group's own heading noun as subject. It is a WORLD lack (the town has none), never a GAP in the record (no wording anywhere in this packet says the record is empty, silent or missing a return — the GAP class needs a `not-held` field with provenance and this card holds none, R-DA-08 / MOVE-GRAMMAR §1.2 row 11 class (b)).

**Variant 2 `[visitor]` — the vantage of the approach, with no observer's verdict in it.** The angle tag is a property of the row and licenses the VANTAGE (the road, the way in, the traveller) exactly as this block's other `[visitor]` rows do; it licenses no second claim. No face says what anybody sees, concludes, is obliged to do or is free to do, so [MN]'s standpoint is not entered and [RC]'s totality over persons is not approached.
- Row: *comes the whole way into {settlement} without coming to a wall* is [MC], and only [MC]: what is asserted of the traveller is that the thing he does not come to is a wall. The doubled *comes* is the row's rhythm, not a second move. Thirteen words, the pool's long line.
- Face 1: *The way into {settlement} passes no wall* is [MC] with the road as subject. *Passes* is a path verb on a path; no intent is given to an inanimate thing (R-DA-11).
- Face 2: *arrives at {settlement} and arrives at no wall* is [MC], the repetition carrying the thread on the verb rather than on a noun (§1.4.1: a deliberate echo for the thread is lawful; A11's echo bound counts facts, and the fact appears once).
- Face 3: *a town no wall encloses* is [MC] as a contact relative, which is the packet's one relative clause and is restrictive, not a `which`-tail (wall 6 held). *From the road* is the vantage with no perceiver named.

**Variant 3 `[street]` — the town's plain idiom, with no mind in it; the pool's one licensed contrast.** Nothing is asserted about what anyone in the town believes, notices, fears or has decided ([MN], [RC]).
- Row: *has an edge and not a wall* is [MC], carried by the ONE contrast the pool spends. R-DA-02 licenses a contrast whose rejected alternative names a sibling pool key, and the rejected alternative here IS the sibling key `walls PRESENT`. It is not fronted (the subject is the town), it takes no completing *but*, and it is the closing move of this variant only — the other two variants carry no contrast at all, so the pool sits well inside R-DA-02's per-variant band. *An edge* asserts nothing the town could be without and adds no field; it is the near side of the licensed contrast, and §G puts it to the refuter.
- Face 1: *Open on every side … is unwalled* is [MC]. The absolute phrase is the face's rhythm; *open* is the state of the perimeter and not an invitation, and *every side* is a totality over the compass, never over persons ([RC] held).
- Face 2: *Round the town at {settlement} no wall runs* is [MC] with the locative fronted. Ordinary English fronting, not costume: the antique air, if any, lives in the noun (R-DA-18), and no wording in this packet inverts subject and verb for period colour.
- Face 3: *A wall is what the town at {settlement} lacks* is [MC] as a cleft, the packet's fourth distinct construction of one fact. *Lacks* names the absence flat, with no completing half (R-DA-02's LACK limb: the first half only).

## D. The walls, checked on the twelve wordings

Zero em dashes · zero exclamation marks · zero digits and zero percents · zero `which` clauses · zero questions · zero first or second person and zero personal pronouns of any person · zero citations and zero named holders ([SRC]) · zero named characters, totalities over persons, exemptions or theological claims ([RC]) · zero future indicatives and zero modal futures, every wording in the present ([MN], A2, R-DA-07) · zero existential openers (`There is` / `It is`) · zero figures, similes, sense verbs on abstractions and inanimate intents (R-DA-11) · zero second sentences, zero three-segment sentences and zero which-tails (R-DA-03) · zero semicolons and zero colons · zero causes, consequences, counts, seasons and standpoints ([MN]) · zero facts of any sibling spine ([FENCE]) · one slot only, `{settlement}`, one occurrence per wording, face sets equal to parent sets · one bracketed angle tag per row, no `[plain]` marker anywhere (it is the modifier rows' marker and the projector refuses it on a spine) · the settlement token opens wordings in one variant only, so at most one opener renders and no two are adjacent (wall 10) · no two of the twelve wordings share their first two words (`{settlement} keeps` · `No wall` · `{settlement} is` · `Fortification is` · `A traveller` · `The way` · `A stranger` · `From the` · `The town` · `Open on` · `Round the` · `A wall`).

Word counts, `{settlement}` counted as one word — variant rows first, then their three faces in order:
- v1 `[ledger]`: **4** · 5 · 7 · 8
- v2 `[visitor]`: **13** · 7 · 10 · 10
- v3 `[street]`: **11** · 10 · 8 · 9

Within-pool spread over the three variant rows: mean 9.33, sample sd **4.73** (measured, not asserted), against R-DA-05's floor of 4.0 — met, and met by construction rather than by padding (the pool runs from a four-word entry to a thirteen-word approach). Over all twelve wordings: mean 8.5, sample sd 2.54. Short lines (under eight words) are 4 of 12, well above the floor R-DA-06 sets on R2 (0.030); lines over thirty words are 0 of 12, well under its ceiling of 0.340. The twelve closing words in order: wall · {settlement} · town · have · wall · wall · wall · encloses · wall · unwalled · runs · lacks. By kind that is seven closes on a named civic thing, one on a condition word, and four on a verb of state — the KIND varies within what the card can fund (§E item 1).

## E. Bands exceeded, reported (§16's channel: a soft rule reports its distance; it fails only past the depth, the budget or the ceiling)

1. **R-DA-04, the KIND of close varies less than the closed set allows.** The set is {condition · prohibition · absence · object · a name not given}. This card licenses no duty or exemption (no prohibition), no withheld name, and one civic object only — the wall that is not there. The pool therefore closes on an object, a condition or the absence itself, and the CLOSING NOUN carries the rest of the variation (wall · {settlement} · town · have · wall · wall · encloses · wall · unwalled · runs · lacks). Reported, not cured: curing it would take a field the card does not hold.
2. **Sentence count goes uniform at one, and the pool's spread in sentence count is spent.** §3.4 says a rewrite may not spend a pool's spread, and the shipped pool had one two-sentence variant (v1) against two one-sentence variants. The second sentence of v1 was the summarising restatement plus the `which`-tail consequence; both are walls, not bands, and a second sentence built from [MC] alone would be exactly the summarising second sentence R-DA-03 and R-DA-12 drive to 0.000. No second fact is available: [MN] refuses one outright, and S2's clause seat needs a CONSEQUENCE the engine computed of this sentence's own fact, which this card does not carry. The spread is therefore rebuilt in WORD COUNT (sd 4.73 over the rows, against the shipped rows' sd of 0.58 at 21, 21 and 22 words) and in construction, and the loss is declared here rather than paid for with an unlicensed clause. This is a words cut, never a variant cut: all three vids, numbers, angle tags and slot sets survive, and the wording count rises from three to twelve (§22 (a), (b), (e)).
3. **The one claim recurs in all twelve wordings.** With a single-clause claim there is nothing else to say, so VOCABULARY and RHYTHM carry the variation — the office's entry in v1, the approach in v2, the town's plain idiom in v3, and four distinct constructions of the fact in every variant (a plain predicate, a negative-subject predicate, a passive of record, a heading-noun predicate; a participial journey, a path subject, a doubled verb, a contact relative; a licensed contrast, an absolute phrase, a fronted locative, a cleft). No face is a paraphrase of a sibling, and the distance is reported here so a refuter reads it as a measured consequence of the card and not as a tic. Five of the twelve close on the word *wall*; that is the one recurring word, and the register card's rule is that the WORD may recur while the FACT may not.
4. **The ABSENCE move opens every wording.** Wall 3 of MOVE-GRAMMAR §1.4 says an ABSENCE never opens and never sits beside another ABSENCE. That wall governs the position of an absence move inside a composed order; it cannot bind a SPINE whose state key's own value is the absence, because the composer puts the spine first and the pool has no other content. Declared here, with the reason, rather than left for the walker to find. No two absences sit adjacent inside any one wording.

## F. Refusals

**None.** All three variants were made lawful under the card; no variant is banked as a refusal row.

## G. The one call a refuter should test first

**Whether `an edge` in v3's row is a second fact.** The row reads *The town at {settlement} has an edge and not a wall*. It is written as ONE claim: the rejected alternative is the sibling pool key `walls PRESENT`, which is the single contrast R-DA-02 licenses, and *an edge* is the near side of that contrast rather than a field of its own — a settled place ends somewhere whether or not the ending is built, so the word adds no particular the card must hold. If the chair rules that *an edge* asserts a fact about the town's outer limit, v3's row loses the contrast and goes to the plain form (*The town at {settlement} is unwalled at its edge*), the pool loses its only contrast, and the row's word count falls from eleven to about eight, which pulls the within-pool sd of §D from 4.73 toward R-DA-05's floor. The second call worth testing is the sibling-polarity note in [MC]: the printed card cannot tell `walls PRESENT` from `walls ABSENT`, and this packet is written on the pool key. If a car ever teaches the card the branch, this pool's card should print `may claim: that present does NOT hold`, and nothing in these twelve wordings changes.
