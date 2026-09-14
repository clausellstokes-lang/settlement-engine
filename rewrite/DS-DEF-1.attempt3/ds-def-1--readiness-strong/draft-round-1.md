# DS-DEF-1 · `readiness STRONG` · REWRITE draft round 1

Seat: Opus 5 (Fable-unvalidated) · block `DS-DEF-1` · role `spine` · 4 variants in, 4 variants out, 16 wordings (the numbered row plus three faces on every variant).

Paste-ready: the four numbered rows below are the COMPLETE replacement for the pool's four variant rows under the bold pool line **readiness `STRONG`**. Same vids, same order, same angle tags, none added, none removed, none merged. The pool declares no typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) in the annex today; none is touched and none is repeated here.

1. `[visitor]` {settlement} reads from the road in as a town well defended, and defended past sufficiency.
   - `[face]` On the way in, {settlement} is a town in strong defensive order, and in more of it than the ordinary case would take.
   - `[face]` A traveller finds {settlement} defended in earnest, and finds the defense past what would merely do.
   - `[face]` Seen from outside, {settlement} is a town of real defensive strength, well past the ordinary.
2. `[ledger]` The defensive standing of {settlement} is entered as strong, and strong is the highest mark the scale carries.
   - `[face]` Taken together, what {settlement} keeps against attack stands strong, and stands above the mark that would merely cover the town.
   - `[face]` Well clear of merely sufficient, {settlement} is entered strong on this head.
   - `[face]` Strong is what {settlement} comes to under defense, and no mark above it is written.
3. `[street]` Defense at {settlement} is strong and to spare.
   - `[face]` Strong defense is what {settlement} keeps, and it keeps more than the plain measure.
   - `[face]` The work of defending {settlement} is well done, and done beyond what would do.
   - `[face]` In matters of defense {settlement} is in good order, and the order is not the bare kind.
4. `[counterforce]` Set against whatever might be attempted, {settlement} stands in strength and stands with margin.
   - `[face]` An attempt on {settlement} would be an attempt on a strong defense, well found and not thinly held.
   - `[face]` Against outside pressure, the defense of {settlement} holds strong, and holds with something to spare.
   - `[face]` Whatever might be brought against {settlement} would be met, and met by a defense of real depth.

--- NOTES

## A. The card, printed, and the clause labels used below

`node scripts/prose-licence-card.mjs DS-DEF-1 'readiness STRONG'` returns: role **spine**; **reads** `scoreBand(readinessScore)` via `READINESS_ROW_POOL` in `defenseStateProse.js`; **predicate** `scoreBand(readinessScore) === STRONG`; **bag** `{band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, FILLED at this block's call sites `{settlement}`; **relation** none and **attach** empty (a spine takes neither); **seat/form** not a seat-taker / `sentence`; **move** none declared; **angle** `counterforce ledger street visitor`; **echo** spine mounts 1 (tab `defense`); **covert** no; **source** `(none)`, standing SOURCE-UNRESOLVED; **audience** player, no mark.

- **[MC]** — the card's `may claim` line: *that the reader `scoreBand(readinessScore)` selects the row `STRONG` of `READINESS_ROW_POOL`, as a STANDING fact of the record.* Read with `reads` and `predicate`, and with the block's own STATE-KEY (`RECEIPT_POOLS_DOSSIER_STATE.md:2504-2508`, the four bands `STRONG` ≥65 · `ADEQUATE` ≥40 · `WEAK` ≥20 · `CRITICAL` <20), this is the pool's ONE claim, and it has two inseparable halves: the town's defensive readiness **is strong**, and **strong is the top of the scale**, so the standing is above the merely sufficient one. The second half is the band's own boundary against its sibling key `readiness ADEQUATE`, exactly as the `CRITICAL` packet writes its band as the floor ("the lowest mark the scale carries") and the `ADEQUATE` packet writes its band's upper edge ("nothing spare"). It names a sibling BAND, which is the one contrast R-DA-02 licenses, and it adds no field: `STRONG` and `ADEQUATE` are disjoint, so "above the merely sufficient" is entailed by the predicate and is not a second fact.
- **[BAG]** — `{settlement}`, `proper`, FILLED. It is the only slot written anywhere in the packet; `{band}` is RESERVED, `{route}` and `{counterpart}` are not filled at this block's call sites, so no wording names them. Every face carries exactly one `{settlement}`, so every face's `{slot}` set equals its parent's (§2.5's face refusal held).
- **[MN]** — `may NOT`: a count, a cause, a season, a future, a standpoint, a second fact.
- **[SRC]** — source `(none)`, SOURCE-UNRESOLVED: **no citation is licensed**; no wording names a holder of a record, and arm A13 has nothing to catch.
- **[RC]** — REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim. None is approached: the corporate subject is the town, never its people counted or excepted.
- **[FENCE]** — the block's own PROVENANCE + FENCE (`:2510-2517`): the readiness word is a SUMMARY of the five arms and asserts nothing about any one of them, and `guardEffectivenessDesc` belongs to `DS-DEF-3`. No wording in this packet names a wall, a gate, an approach that is watched, a muster, a garrison, a watch, a store or a granary. This is the single largest change from the shipped rows.

## B. The claim set, and what was dropped from each shipped variant

All sixteen wordings carry [MC] and nothing else, so the four faces of each variant are claim-equal to each other (arm A6 read across the faces, not back to the shipped sentence). What the shipped rows carried and the card does not license is dropped, which is the rewrite's purpose; nothing is added.

- **v1 `[visitor]`** kept: the town reads from outside as a defended place ([MC]). Dropped: *"the approaches are watched"* (a fact of the watch — [FENCE], `DS-DEF-3`'s field, and a second fact under [MN]); *"the works are kept up"* (a fact of the built fabric — [FENCE], `DS-DEF-2`'s institution flags); *"none of it looks like it was thrown together"* (a standpoint under [MN], and an implied history of how the town came to be so — no event-provenance field, MOVE-GRAMMAR §1.2 row 2).
- **v2 `[ledger]`** kept: the standing is strong, and strong is the top mark ([MC]). Dropped: *"what {settlement} can field and what {settlement} has built"* (two named arms — [FENCE]; also two facts under [MN]); *"the town would take real effort to threaten"* (a CONSEQUENCE move, double-licensed by event provenance × a household row under MOVE-GRAMMAR §1.2 row 7, and this card holds neither); *"and knows it"* (a belief frame — [MN]'s standpoint; R-DA-13's belief floor).
- **v3 `[street]`** kept: the defense is strong, with more than the plain measure ([MC]). Dropped: *"does not spend much time thinking about being attacked"* (a belief frame over the town's people — [MN] and [RC]); *"the reason is not complacency"* (a cause — [MN]); *"the town is not relying on anything else instead"* (a second fact about a recourse no field holds — [MN]).
- **v4 `[counterforce]`** kept: the standing set against an attempt ([MC]). Dropped: *"Nothing presses {settlement} at present"* (a fact about current threat; no field on this card, and `config.monsterThreat` is `DS-DEF-2`'s); *"the absence is not luck"* (a cause — [MN]); *"not worth the price of trying"* (an attacker's valuation, which is `strategic value`'s pool and not this one — arms A1 and A11: neither restate nor contradict a sibling).

## C. Per face — which clause licenses which claim

**Variant 1 `[visitor]` — the band from outside, with the vantage and no observer's verdict in it.** The angle tag is a property of the row and licenses the VANTAGE (the road, the approach, the outside), never a second claim; no face asserts what anybody concludes.
- Row: "well defended" is [MC] half one; "defended past sufficiency" is [MC] half two. `{settlement}` by [BAG]. The one settlement-token opener of the pool sits here (wall 10 of MOVE-GRAMMAR §1.4).
- Face 1: "in strong defensive order" [MC] half one; "in more of it than the ordinary case would take" [MC] half two. The thread runs on the pronoun carrying `order` forward (§1.4.1).
- Face 2: "defended in earnest" [MC] half one; "past what would merely do" [MC] half two. "A traveller" names no person the world holds and asserts nothing of him; the verb is on a concrete subject, so R-DA-11's sense-verb floor is not touched.
- Face 3: "a town of real defensive strength" [MC] half one; "well past the ordinary" [MC] half two.

**Variant 2 `[ledger]` — the band in the record's own accounting idiom.**
- Row: "entered as strong" [MC] half one; "strong is the highest mark the scale carries" [MC] half two, stated as the scale's position and not as a count of the bands ([MN]'s no-count held: no band is numbered, no threshold is quoted). "Entered" is the office's own act of setting the fact down, not a citation of a holder ([SRC] held: the office does not cite its own books, §24's ceiling and arm A13).
- Face 1: "stands strong" [MC] half one; "above the mark that would merely cover the town" [MC] half two, naming the sibling band `ADEQUATE` by its reading and not by an added fact (R-DA-02's licensed contrast; not fronted, and this is the only variant whose contrast is explicit).
- Face 2: "Well clear of merely sufficient" [MC] half two fronted, "entered strong on this head" [MC] half one. "On this head" is the record's heading idiom and names no holder.
- Face 3: "Strong is what {settlement} comes to under defense" [MC] half one, inverted for rhythm; "no mark above it is written" [MC] half two, as a fact of the record's own scale.

**Variant 3 `[street]` — the band in the town's plain idiom, with no mind in it.** The angle survives as vocabulary; nothing is asserted about what anyone in the town believes, notices or fears ([MN], [RC]).
- Row: "strong" [MC] half one; "and to spare" [MC] half two, in the plain idiom. Eight words: the short line the register card licenses.
- Face 1: "Strong defense is what {settlement} keeps" [MC] half one; "more than the plain measure" [MC] half two.
- Face 2: "well done" [MC] half one; "done beyond what would do" [MC] half two. "The work of defending" is the summary activity, never a named arm ([FENCE]).
- Face 3: "in good order" [MC] half one; "not the bare kind" [MC] half two.

**Variant 4 `[counterforce]` — the band read as resistance, agentless and in the subjunctive.** No attacker exists, no attempt is asserted, no outcome beyond the standing capacity is predicted: the frame is conditional throughout, which is the only mood A2 and R-DA-07 allow at an edge, and it is the shape the sibling `terrain FAVOURABLE` packet's `[counterforce]` variant already takes in this block.
- Row: "stands in strength" [MC] half one; "stands with margin" [MC] half two. The thread carries `stands` forward.
- Face 1: "an attempt on a strong defense" [MC] half one; "well found and not thinly held" [MC] half two, the negation naming the sibling band `WEAK` by its reading (R-DA-02).
- Face 2: "holds strong" [MC] half one; "with something to spare" [MC] half two.
- Face 3: "would be met" [MC] half one, as the readiness band's own content in the subjunctive; "a defense of real depth" [MC] half two, the depth being the band's position and not a claim about any one arm ([FENCE]).

## D. The walls, checked on the sixteen wordings

Zero em dashes · zero exclamation marks · zero digits and zero percents anywhere, including the connectives · zero `which` clauses · zero questions · zero first or second person · zero citations and zero named holders ([SRC]) · zero named characters, totalities over persons, exemptions or theological claims ([RC]) · zero future indicatives, every edge subjunctive (A2, R-DA-07) · zero existential openers (`There is` / `It is`) · zero figures, similes and inanimate intents (R-DA-11) · zero three-segment sentences and zero which-tails (R-DA-03) · zero named arms of the five ([FENCE]) · one slot only, `{settlement}`, one occurrence per wording, face sets equal to parent sets · one bracketed angle tag per row, no `[plain]` marker · the settlement token opens exactly one variant of the pool and no two adjacent (wall 10) · no two of the sixteen wordings share their first two words (A11: `{settlement} reads` · `On the` · `A traveller` · `Seen from` · `The defensive` · `Taken together` · `Well clear` · `Strong is` · `Defense at` · `Strong defense` · `The work` · `In matters` · `Set against` · `An attempt` · `Against outside` · `Whatever might`).

Word counts, `{settlement}` counted as one word — variant rows first, then their three faces in order:
- v1 `[visitor]`: **15** · 23 · 16 · 15
- v2 `[ledger]`: **18** · 20 · 12 · 15
- v3 `[street]`: **8** · 14 · 14 · 17
- v4 `[counterforce]`: **14** · 18 · 15 · 17

Within-pool spread over the four variant rows: mean 13.75, sample sd **4.19**, against R-DA-05's floor of 4.0 — met, and met without padding because the band's two halves give each row a lawful second clause.

## E. Bands exceeded, reported (§16's channel: a soft rule reports its distance; it fails only past the depth, the budget or the ceiling)

1. **R-DA-04, the KIND of close does not vary.** All sixteen wordings close on a CONDITION of a civic thing. The close-kind set is {condition · prohibition · absence · object · a name not given}, and this card licenses no `none-exists` field (no absence), no duty or exemption (no prohibition), no named object beyond the town itself, and no withheld name. The kind cannot vary inside the licence; the CLOSING NOUN varies instead (sufficiency · take · do · ordinary · carries · town · head · written · spare · measure · do · kind · margin · held · spare · depth).
2. **Sentence count goes uniform at one.** The shipped v3 was the pool's only two-sentence variant; its second sentence carried a belief frame, a cause and a second fact, all unlicensed, so it does not survive. A second sentence built from [MC] alone would be the summarising second sentence R-DA-03 and R-DA-12 drive to 0.000, so none is written. This is a words cut, never a variant cut: v3 keeps its vid, its number, its angle and its slot (§22 (a) and (e); the count of variants and of faces rises, never falls).
3. **The two halves of [MC] recur in all sixteen wordings.** With one licensed claim there is nothing else to say, so the VOCABULARY and the RHYTHM carry the variation (the record's own idiom in v2, the plain idiom in v3, the vantage in v1, the subjunctive in v4) and no face is a paraphrase of a sibling. The distance is reported here so the refuter reads it as a measured consequence of the card and not as a tic.

## F. Refusals

**None.** All four variants were made lawful under the card; no variant is banked as a refusal row.

## G. The one call a refuter should test first

The second half of [MC] — *strong is the top of the scale, so the standing is above the merely sufficient one*. It is written as ENTAILED by the predicate (the four bands are disjoint) and as the licensed sibling-band contrast of R-DA-02, and it is the half that carries what the shipped rows meant by "would take real effort to threaten" and "not worth the price of trying" once their unlicensed causes, consequences and valuations are dropped. If the chair rules that the band's position is a second claim rather than the same claim's boundary, every wording loses its second clause, the pool goes to sixteen short one-clause wordings, and the within-pool spread of §D falls below R-DA-05's floor. The sibling packets for `readiness ADEQUATE` ("nothing spare") and `readiness CRITICAL` ("the lowest mark the scale carries") are written on the same reading, so the ruling should be taken across the four bands at once and not on this pool alone.
