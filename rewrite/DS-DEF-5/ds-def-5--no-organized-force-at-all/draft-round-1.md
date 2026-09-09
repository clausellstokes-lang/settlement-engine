# DS-DEF-5 · `NO organized force at all` · REWRITE draft round 1

Seat: Opus 5 (Fable-unvalidated) · block `DS-DEF-5` · role `spine` · 3 variants in, 3 variants out, 12 wordings (the numbered row plus three faces on every variant).

Paste-ready: the three numbered rows below are the COMPLETE replacement for the pool's three variant rows under the bold pool line **NO organized force at all**. Same vids, same order, same angle tags, none added, none removed, none merged. The pool declares no typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) in the annex today; none is touched and none is repeated here.

1. `[ledger]` Defense at {settlement} is the charge of no garrison or militia, and order of no watch.
   - `[face]` Nothing of the town's keeping stands under arms at {settlement}, and no watch is set.
   - `[face]` Neither soldiery nor watch is kept at {settlement}.
   - `[face]` The town keeps neither garrison nor watch at {settlement}, and raises no militia.
2. `[street]` The town keeps no soldiers of its own and sets no watch.
   - `[face]` Nothing here is on watch for the town, and nothing under arms.
   - `[face]` Order here answers to no watch, and defense to no garrison or militia.
   - `[face]` The streets go unwatched, and the town's defense rests with no body it has raised.
3. `[visitor]` A stranger enters {settlement} unmet by any watch and unchallenged by garrison or militia.
   - `[face]` A stranger's arrival at {settlement} is marked by no watch, and answered by no garrison and by no militia.
   - `[face]` Whoever arrives at {settlement} answers to no watch and to no soldiery the town keeps.
   - `[face]` Neither watch nor armed body of the town's meets a stranger at {settlement}.

--- NOTES

## A. The card, printed, and the clause labels used below

`node scripts/prose-licence-card.mjs DS-DEF-5 'NO organized force at all'` returns: role **spine**; **reads** `forces` (not-produced) with `forces.garrison.present`, `forces.militia.present`, `forces.watch.present` (measured), absent implying no candidate; **predicate** none recovered (the pool has no key-function branch); **bag** `{band: RESERVED, counterpart: proper, faction: proper, settlement: proper}`, FILLED at this block's call sites `{settlement}`; **relation** none and **attach** empty (a spine takes neither, ARCH 4.5); **seat/form** not a seat-taker / `sentence`; **move** none declared; **angle** `ledger street visitor`; **echo** spine mounts 2 (tab `defense`), modifier mounts 0, the echo table keyed on the coarser producer root `forces`; **covert** no; **source** muster and watch, standing LICENSED, a two-source row, a STATE ORGAN interested where the town is captured; **audience** player, no mark.

- **[MC]** the card's `may claim` line: *that `forces` holds, as a STANDING fact of the record.* Read with the three measured reads, which are the only fields this pool sees, the value that selects this key is `garrison.present` false AND `militia.present` false AND `watch.present` false. That conjunction is the pool's ONE claim, and it is exactly three lacks in one: no garrison, no militia, no watch. Every wording carries all three limbs, because a wording that named only two would assert a smaller claim set than its siblings and break claim-equality across the faces (arm A6 read across the faces). The soldiery limb and the watch limb are the two-limb rhythm the twelve wordings use, because the three lacks in a bare list are the tricolon (fault 4) and R-DA-10's "two items or four, never habitually three".
- **[BND]** the claim is BOUNDED to the town's own standing arms. `mercenary / contracted forces PRESENT` is a live sibling pool of this same block and can render on the same page (this key reads garrison, militia and watch and no mercenary field), so a wording asserting that nothing whatever is under arms would contradict a sibling (arms A1 and A11). Every wording therefore bounds its arms limb by an institution name (`garrison`, `militia`), by the town's keeping or raising, or by a possessive of the town.
- **[BAG]** `{settlement}`, `proper`, FILLED, the only slot written anywhere in this packet. `{band}` is RESERVED; `{counterpart}` and `{faction}` are not filled at this block's call sites and no wording names them. Variant 1 and variant 3 carry exactly one `{settlement}` in the row and in all three faces; variant 2 carries none in the row and none in any face, exactly as it stands today. Every face's `{slot}` set equals its parent's (ARCH 2.5's face refusal held).
- **[OPN]** no row and no face opens on `{settlement}`. This holds the seam contract's sentence-row rule (a sentence-form row begins on a capital that is not a `proper`-typed slot, T-F1) and ARCH 2.5's face refusal (T-F8) on the same line, and it takes the pool's settlement-token opener share to zero (wall 10 of MOVE-GRAMMAR 1.4; R-DA-17).
- **[MN]** `may NOT`: a count, a cause, a season, a future, a standpoint, a second fact.
- **[SRC]** source `muster + watch`, a two-source row, standing LICENSED. **No wording cites a holder.** The holders this card names are the muster roll and the watch, and this pool's whole content is that neither body stands in this town, so a citation would name a keeper the record does not hold here, and none of S3's three reasons is present (no two accounts disagree, no count is taken from an interested party, no keeper is a power here). The provenance budget of section 24 is a ceiling of one and rarely is the norm (the exemplar registers with raw text cite at 0 per 786 sentences), so zero is the lawful reading and arm A13 has nothing to catch.
- **[RC]** REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim. None is approached. Every subject is an institution or the corporate town, never its people counted, excepted or totalised, which is why the shipped "individual armed citizens" and "nobody" do not survive.
- **[FENCE]** the block's own PROVENANCE and FENCE (`:2872-2879`): a group's presence asserts capability, never history; walls ride `defenseProfileHasWalls`. No wording here names a wall, a gate, a chartered hall, a ward or a contract, because each belongs to a sibling pool of this block (`walls PRESENT/ABSENT`, `charter hall`, `arcane defense`, `mercenary`) and arms A1 and A11 forbid restating or contradicting them.

## B. The claim set, and what was dropped from each shipped variant

All twelve wordings carry [MC] and nothing else, so the four faces of each variant are claim-equal to each other. What the shipped rows carried and the card does not license is dropped, which is the rewrite's purpose; nothing is added.

- **v1 `[ledger]`** kept: the three lacks, as a standing fact ([MC]). Dropped: *"has no organized force"* in its unbounded form, which asserts a totality over every armed body including the contracted forces of a live sibling pool ([BND], arms A1 and A11), rewritten as the bounded conjunction the card actually reads; *"Defense here is individual armed citizens"* (a positive second fact naming who defends, held by no field, and a totality over persons, [MN] and [RC]); *"with no command, no training and no way to coordinate a response"* (three further second facts, none of them a read field, and a tricolon, [MN] and fault 4).
- **v2 `[street]`** kept: the three lacks ([MC]). Dropped: *"would defend itself as a crowd defends itself"* (a simile, R-DA-11's figure floor, and a forecast of how the town would perform, which is FATE and has no field, MOVE-GRAMMAR 1.3); *"which is to say"* (a which-clause, R-DA-03, and a gloss on the sentence before it, the MEANING non-move); *"briefly and in several directions at once"* (a manner verdict on an event that has not happened, [MN]'s standpoint and future).
- **v3 `[visitor]`** kept: the three lacks, met from outside ([MC]). Dropped: *"can find nobody whose responsibility the town's defense is"* recast off persons and onto the three institutions ([RC]'s totality over persons); *"because it is not anybody's"* (a cause, [MN], and a circular one).

## C. Per face, which clause licenses each claim

**Variant 1 `[ledger]`, the office's own accounting idiom.** The angle is a property of the row and licenses the REGISTER (charge, keeping, setting), never a second claim.
- Row: "the charge of no garrison or militia" is [MC]'s two arms limbs; "and order of no watch" is [MC]'s watch limb, carried by ellipsis on the same predicate. `{settlement}` by [BAG], not at the opening by [OPN]. The close lands on `watch`, the civic noun a following modifier can pick up (THE THREAD, MOVE-GRAMMAR 1.4.1).
- Face 1: "Nothing of the town's keeping stands under arms" is [MC]'s arms limbs, bounded by [BND]'s keeping; "no watch is set" is the watch limb. Close on a condition (`set`), a different close kind from the row (R-DA-04).
- Face 2: "Neither soldiery nor watch is kept" carries both limbs in eight words, the pool's short line (R-DA-05, rhythm follows load). "Soldiery" is the collective noun for garrison and militia together; "is kept" carries [BND].
- Face 3: "neither garrison nor watch" plus "raises no militia" names all three read fields in a two-limb rhythm, bounded by the town's own keeping and raising ([BND]). Close on `militia`.

**Variant 2 `[street]`, the town's plain idiom, with no mind in it.** Nothing is asserted about what anyone in the town believes, notices or would do ([MN], [RC]); the angle survives as vocabulary and as the street's nouns.
- Row: "keeps no soldiers of its own" is [MC]'s arms limbs with [BND]'s possessive; "sets no watch" is the watch limb. No slot, exactly as the shipped row stands ([BAG]).
- Face 1: "on watch for the town" and "nothing under arms" are the two limbs, the second inheriting "for the town" by ellipsis, which is where its bound sits ([BND]).
- Face 2: "Order here answers to no watch" is the watch limb; "and defense to no garrison or militia" is the arms limbs, elliptical on the same verb. The two civic functions are named, not evaluated ([MN]).
- Face 3: "The streets go unwatched" is the watch limb as a plain standing condition of the streets; "rests with no body it has raised" is the arms limbs bounded by the town's raising ([BND]). "No body it has raised" is a contact clause, never a which-clause (R-DA-03).

**Variant 3 `[visitor]`, the arrival, with no observer's verdict in it.** The angle licenses the VANTAGE and no second claim; no face says what the stranger concludes, expects or feels ([MN]).
- Row: "unmet by any watch" is the watch limb; "unchallenged by garrison or militia" is the arms limbs, named as institutions so the bound is [BND]'s. The stranger is a vantage, not a person the world holds, and nothing is asserted of him ([RC]).
- Face 1: "marked by no watch" and "answered by no garrison and by no militia" are the three limbs, the longest wording of the pool and the one that names every read field ([MC]).
- Face 2: "answers to no watch" is the watch limb; "to no soldiery the town keeps" is the arms limbs with [BND]. The opener "Whoever arrives" varies the variant's opener without a pronoun (R-DA-05; R-DA-04's pronoun-closer floor untouched anywhere in this packet).
- Face 3: "Neither watch nor armed body of the town's" carries both limbs in a correlative, bounded by the possessive ([BND]); the close is the town's name, a close kind not used elsewhere in this variant (R-DA-04).

## D. The walls, checked line by line

Zero em dashes, zero exclamation marks, zero digits, zero percent signs, zero question marks, zero which-clauses, zero semicolons across all twelve wordings. No existential opener ("There is", "It is") anywhere (R-DA-07). No figure, no simile, no sense verb on an abstraction, no inanimate intent (R-DA-11). No future indicative and no fate (A2, THE PROMISE). No second sentence anywhere: the claim is one, so each wording is one sentence, and no wording carries a summarising second beat (R-DA-03, R-DA-12, fault 1). No citation ([SRC]). No pronoun closer and no abstract-noun closer: the twelve closes are `watch`, `set`, `{settlement}`, `militia`, `watch`, `arms`, `militia`, `raised`, `militia`, `militia`, `keeps`, `{settlement}`. No tricolon. No repeated phrase above one recurrence: "under arms" twice of twelve, "soldiery" twice of twelve, and the field's own nouns (`watch`, `garrison`, `militia`) recur because R-DA-22 requires one term for one thing.

## E. Reported band positions (information, never a gate)

- Word counts per wording: v1 16 / 15 / 8 / 13; v2 12 / 12 / 13 / 15; v3 14 / 19 / 15 / 13. Pool mean 13.75, standard deviation about 2.6.
- **Within-pool length spread sits below R-DA-05's 4.0 floor and is reported, not cured by padding.** The pool licenses ONE claim of three conjoined lacks and no second fact, so every lawful wording is one sentence carrying two limbs, and the load that drives rhythm does not vary across the twelve. Buying spread here would mean adding a claim (forbidden) or thinning one below claim-equality (forbidden). The distance is the honest position of a one-claim absence pool; section 16.1's budget treats a soft rule's distance as a report, and this is the pool's one exceedance.
- Opener spread: twelve wordings, nine distinct openers (`Defense`, `Nothing` twice, `Neither` twice, `The town` twice, `Order`, `The streets`, `A stranger`, `A stranger's`, `Whoever`). Within a variant every opener is distinct. Settlement-token opener share 0.000.
- Grammar: every wording realises V3 (PRESENT with LACK) on MOVE-GRAMMAR 2.1's level-1 set, since the pool's only licensed content is the `none-exists` conjunction. The pool cannot carry min(k, 8) distinct level-1 grammars, because no other member's licensing field is non-null on this card (no event provenance, no institution row returned, no object, no unresolved state value). Reported as a licensing filter, not as flattening.
- Provenance move rate 0.000 of twelve, against a ceiling of one per unit ([SRC]).

## F. REFUSALS

None. All three variants are written lawful under their own vids and angle tags, and no variant is banked.
