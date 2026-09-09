Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2 · pool key `Invasion & War`: militia only · role spine · draft round 1.
Three variants in, three variants out: the same vids, the same order, the same single angle tag on each numbered line, none added, none removed, none merged. Four wordings per variant (the numbered line is the first wording; the three `[face]` sub-rows are the other three), claim-equal to each other and no paraphrase of a sibling. No `[plain]` marker anywhere: it belongs to modifier rows and the projector refuses it on a spine. The pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are untouched and are not repeated here.
The rows below are the complete replacement for the pool's variant rows, ready to paste under the pool's heading.

1. `[ledger]` The muster at {settlement} is the town's own people under arms.
   - `[face]` Arms at {settlement} are the townspeople's.
   - `[face]` Citizens make up the militia at {settlement}.
   - `[face]` Those who carry arms at {settlement} are people of the town.
2. `[street]` The town's defence is the townspeople, and it keeps no professional garrison.
   - `[face]` What the town has under arms is its own people. Soldiering is not a trade the town keeps.
   - `[face]` Here the militia is made of citizens, and beside it the town keeps no standing force.
   - `[face]` Under arms here stand the town's own, and no garrison.
3. `[visitor]` A stranger at {settlement} meets townspeople under arms and no soldiers by trade.
   - `[face]` The armed people a newcomer meets at {settlement} are the town's own, and the town keeps no garrison of professionals.
   - `[face]` A visitor to {settlement} is met by armed citizens, and by no standing force.
   - `[face]` The arms a traveller sees at {settlement} are in citizens' hands and in no garrison's keeping.

--- NOTES

**The card, as printed** (`node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: militia only'`, run in `laneRW-DEF2`), with the clause labels used below:
- **C-READ** — `reads: invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)`; absent means no candidate.
- **C-PRED** — `predicate: … === no walls, citizen militia`.
- **C-CLAIM** — `may claim: that (=== no walls, citizen militia) holds, as a STANDING fact of the record`.
- **C-BAG** — `bag: {band: RESERVED, route: proper, settlement: proper}`, **FILLED at this block's call sites: {settlement}**. So no face carries `{band}` or `{route}`, no face names a band word, and no face names a road.
- **C-ROLE** — `role spine` · `form sentence` · `move (none declared)` · `angle: ledger street visitor` · `relation: a spine takes no relation` · `attach: empty (a spine takes no attach set)`.
- **C-NOT** — `may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class force`.
- **C-SRC** — `source: muster · standing LICENSED`; a citation of that holder is licensed *where the provenance budget allows*. **No face cites it** — see THE CITATION, DELIBERATELY UNSPENT below.
- **C-REFUSED** — always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.
- **C-AUD** — `audience: player (no mark)`; `covert: no`. No face carries a `dm-only` mark and no face is a covert twin.

**The three licensed claims, read off the one predicate value.** `invasionRowSituation` (`src/domain/display/stateProse/defenseStateProse.js:412-419`) returns `'no walls, citizen militia'` exactly when `walls === false`, `garrison === false`, `militia === true`, so the value the card licenses under C-CLAIM has three halves and no more:
- **K1** — the settlement holds no walls (`walls === false`).
- **K2** — the settlement keeps no professional garrison (`garrison === false`; a garrison outranks a militia in the branch, which is why this value implies its absence).
- **K3** — the force the settlement holds is its own citizens under arms (`militia === true`).

**K1 is claimed by no variant, and is therefore written by none.** Not one of the three shipped sentences asserts the absence of walls; keeping the claim set means K1 is not added (§21–§23: never add). Recorded as a finding for the chair, not cured here: this pool's rows never state the wall half of their own predicate, so a reader of the composed passage learns the militia and not the open perimeter. Curing it would mean adding a claim to a shipped variant, which this wave forbids.

**Per variant: what was kept, what was dropped, and under which law.**

| vid | the shipped sentence's claims | disposition |
|---|---|---|
| 1 `[ledger]` | (a) the town can put armed citizens into the field; (b) *on their own ground*; (c) *this counts for something against a disorganized raid*; (d) *and for nothing at all against a disciplined force* | (a) KEPT as K3 (C-CLAIM). (b) DROPPED: a terrain claim licensed by no field on this card (C-NOT, "a second fact"); the ground is the `terrain` pools' own read in DS-DEF-1, and asserting it here restates a sibling block's claim (arm A1). (c) DROPPED: a capability assessment against an event class the card does not hold — a standpoint and a second fact (C-NOT), and the raid is another civic object of the class `force` (C-NOT, verbatim). (d) DROPPED on the same three grounds; "a disciplined force" is the refused object of the class `force` named outright. The `, which` tail that carried (c) and (d) is gone with them (R-DA-03; the brief's no-which-clause wall). |
| 2 `[street]` | (a) *the town knows its own country*; (b) *and knows that knowing it*; (c) *is not an answer to a professional army* | (a) DROPPED: a knowledge claim about the townspeople over a country field this card does not read (C-NOT, "a second fact"). (b) DROPPED: a belief frame about what the town knows it knows — R-DA-13's belief-frame floor stands at zero and is executable now. (c) DROPPED as a capability comparison and as another civic object of the class `force` (C-NOT). What survives is the assertion the clause presupposes and the row exists to make: the town's force is its own people (K3) and professional soldiery is not what it has (K2). See THE ONE INTERPRETIVE CALL below. |
| 3 `[visitor]` | (a) a stranger meets armed townspeople; (b) *who are entirely competent*; (c) *on their own ground*; (d) *and have never stood in a line with anybody* | (a) KEPT as K3 (C-CLAIM), the visitor angle licensed by C-ROLE. (b) DROPPED: an evaluative adjective on persons, which the record registers hold at zero (R-DA-14; R-DA-10's evaluative-adjective floor), and a standpoint (C-NOT). (c) DROPPED as in variant 1. (d) DROPPED twice over: a historical claim about training with no event-provenance field behind it (C-NOT "a cause"; MOVE-GRAMMAR §1.2 row 2, HISTORY needs provenance), and a totality over persons ("never … with anybody" — C-REFUSED, always). Its licensed residue is K2, which the rewritten faces carry as the absent professional garrison. |

**Face by face — the clause that licenses each claim, and the word count.**

*Variant 1 `[ledger]` — the muster in the record's own account; K3 alone; grammar V1 (PRESENT).*
1. parent, 11 words — "The muster at {settlement} is the town's own people under arms" = K3 by C-CLAIM; `{settlement}` by C-BAG. `muster` is used as the civic object the field names (R-DA-10), not as the holder of a record: no reading is attributed to it, so no provenance move is made (C-SRC). Close: an object.
2. face, 6 words — "Arms at {settlement} are the townspeople's" = K3 by C-CLAIM, the possession stated flat. The short line exists by R-DA-06's floor; it is compression, not plainness (§21.4).
3. face, 7 words — "Citizens make up the militia at {settlement}" = K3 by C-CLAIM, using the predicate's own noun `militia`. Close: the name.
4. face, 11 words — "Those who carry arms at {settlement} are people of the town" = K3 by C-CLAIM. The quantification is over the arms-carriers, which is the predicate's own set (`militia === true`, `garrison === false`), never over the settlement's persons, so C-REFUSED's totality bar is not engaged.

*Variant 2 `[street]` — the arrangement as the town holds it; K3 then K2; grammar V3 (PRESENT → LACK). No slot, exactly as the shipped row carries none.*
1. parent, 12 words — "The town's defence is the townspeople" = K3 by C-CLAIM; "it keeps no professional garrison" = K2 by C-CLAIM (`garrison === false`). The LACK is the second half only, with no completing "but" (R-DA-02); it does not open the sentence (order wall 3). Close: an absence.
2. face, 18 words — "What the town has under arms is its own people" = K3; "Soldiering is not a trade the town keeps" = K2, as its own sentence (R-DA-03: the qualification takes a sentence, never a tail). Two sentences, the ceiling A1 allows.
3. face, 16 words — "Here the militia is made of citizens" = K3; "beside it the town keeps no standing force" = K2.
4. face, 10 words — "Under arms here stand the town's own" = K3, inverted; "and no garrison" = K2, elliptical on the same verb. The ellipsis is rhythm, not a claim moved (§3.4: word order and punctuation are spendable, a claim is not).

*Variant 3 `[visitor]` — what the arrangement shows to someone arriving; K3 then K2; grammar V3.*
1. parent, 13 words — "A stranger at {settlement} meets townspeople under arms" = K3 by C-CLAIM; "and no soldiers by trade" = K2. Close: an absence.
2. face, 20 words — "The armed people a newcomer meets at {settlement} are the town's own" = K3; "the town keeps no garrison of professionals" = K2. The longest wording in the pool.
3. face, 14 words — "A visitor to {settlement} is met by armed citizens" = K3; "and by no standing force" = K2.
4. face, 16 words — "The arms a traveller sees at {settlement} are in citizens' hands" = K3; "and in no garrison's keeping" = K2. `keeping` is custody, a literal word for a garrison's charge, not a figure (R-DA-11).

**Claim-equality across the faces of each variant (arm A6, read across the faces).** Variant 1: four wordings, K3 in each, nothing else in any. Variant 2: four wordings, K3 + K2 in each. Variant 3: four wordings, K3 + K2 in each. No face of any variant carries a claim its siblings do not, and no face carries K1.

**Walls checked on every one of the twelve wordings.** No em dash · no exclamation · no question mark · no digit and no percent · no `which`-clause · no semicolon and no colon · no first or second person · no future indicative and no bare "will" · no citation and no holder named · no count word and no band word · no season, no cause, no history, no standpoint, no belief frame, no forecast · no figure, no sense verb on an abstraction, no inanimate intent · no evaluative adjective on a person · no totality over persons, no exemption from a duty, no named character, no deity · no attacking force, army, raid or company named anywhere (C-NOT's `force` clause is the tightest wall in this pool and every dropped clause above breached it) · every face of variants 1 and 3 carries exactly one `{settlement}` and no other slot, every face of variant 2 carries none, so each face's slot set equals its parent's (ARCH §2.5, the face-row refusal column) · **no wording opens on `{settlement}`** (ARCH §2.5's seam contract and T-F8; the shipped `[ledger]` row opened on the slot and no longer does) · exactly one bracketed tag on each numbered line, and the three sub-rows match `FACE_ROW_RE` = `/^\s*-\s+\`\[face\]\`\s+(.*)$/` (`scripts/lib/dossier-annex-grammar.mjs:107`).

**THE THREAD (owner, 2026-09-08 ~21:4x).** This pool is the spine, so it opens the passage and hands a noun forward rather than picking one up. Every one of the twelve closes on a noun a modifier can carry: arms, the townspeople, {settlement}, the town, the garrison, the standing force, the trade, the militia's keeping. No wording closes on a pronoun (R-DA-04's pronoun-closer ceiling: zero of twelve). No wording depends on a neighbour to be read, and none of the three variants turns outward, so no modifier is left holding a subject the spine changed under it.

**Grammar spread, reported, not gated.** Realised: V1 on variant 1, V3 on variants 2 and 3. §2.1 asks a pool of three for three distinct level-1 grammars; only two are reachable here, because every other member needs a field this card does not hold — V2 a structural-consequence field, V4 a named-object field, V5 an institution row, V6 a state whose value is unresolved, V7 event provenance, V8 a `not-held` record field. MOVE-GRAMMAR §3.2 governs: *never write a member the block cannot license*, so the pool is written across the members the block holds and the shortfall is a report, not a breach.

**Spread figures, measured on the twelve wordings (information, never a target — §21.1).** Words per wording: 11, 6, 7, 11 · 12, 18, 16, 10 · 13, 20, 14, 16. Mean 12.83, sd 4.04 (R-DA-05's within-pool floor is 4.0; the value is where the writing landed, not a number chased — a threshold hit exactly is the fault). Under eight words: two of twelve (0.167, against R-DA-06's floor of 0.030). Over thirty: none. No two of the twelve share their first two words. Close kinds: four on a present object or name (variant 1), eight on an absence (variants 2 and 3) — the skew is the licensed content, since two of the three variants carry K2 and K2 is an absence.

**THE CITATION, DELIBERATELY UNSPENT.** C-SRC licenses a citation of the muster, unlike the DS-DEF-1 spines whose holder is unresolved. None is written. §24 caps the budget at one citation per unit and admits it only for one of S3's three reasons: no two accounts disagree here, the card refuses counts outright, and the muster is the town's own roll of its own people rather than a record whose keeper is a power over the fact. The exemplar registers with raw text cite at zero per 786 sentences, so silence is the norm and a citation here would be the habit a refuter names. The licence is left unspent on purpose, not overlooked.

**Siblings (arms A1 and A11), neither restated nor contradicted.** The five other `Invasion & War` values are branches of the same function and can never render beside this one; even so, no face here asserts a wall (that is `walls with citizen militia`'s claim) and none asserts a professional force present (that is `walls AND professional garrison` and `force with NO walls`). The rows that *do* render alongside are the other four threat rungs: `Beasts & Monsters` owns the monster country and the perimeter posture, `Internal Security` the courts and the holding, `Economic Survival` the revenue, `Disasters & Famine` the granary and the sick-house. No face here touches any of them. Consistency with the `Beasts & Monsters` rungs holds by construction: a town on this branch has armed people and no line, which is what those rungs say of the same flags. DS-DEF-1's `terrain` pools own the ground, and the two ground claims the shipped rows made are dropped rather than repeated.

**Refusals: none.** All three variants were made lawful under the card. No variant is banked, and the banked count for this pool stays at zero.

**THE ONE INTERPRETIVE CALL, recorded for veto.** Variant 2's shipped sentence makes no licensed claim *outright*: its two assertions are a knowledge claim and a capability comparison, and both are dropped. The rewrite keeps K3 + K2 on the ground that the discarded clause presupposes them — "not an answer to a professional army" is said *of a town whose force is its own people*, and the subject of the whole sentence is the town rather than any garrison. The alternative reading is that variant 2's licensed claim set is empty, in which case the variant is a refusal row carrying its faces and no lawful wording. The chair may take that reading; if it does, variant 2's four wordings above are banked unchanged under §21.2 and nothing is trimmed either way. Recorded here because the whole of a shipped variant's surface was dropped and something had to stand in its slot.
