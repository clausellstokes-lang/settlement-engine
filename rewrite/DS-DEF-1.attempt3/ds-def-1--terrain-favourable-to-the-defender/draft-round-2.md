Seat: Opus 5 — Fable-unvalidated. Block `DS-DEF-1` · pool key `terrain FAVOURABLE to the defender` · draft round 2.
The rows below are the COMPLETE replacement for the pool's three variant rows, in order, under the pool's
existing bold heading. The typed lines of the pool are untouched and are not repeated here. Three wordings
move from round 1; nine stand byte-unchanged, because they carry no failing measure and no walk finding
(a lawful row is not churned, and nothing is trimmed: the variant count is three and the face count twelve
in both rounds).

**`terrain FAVOURABLE to the defender`**
1. `[visitor]` The way into {settlement} climbs, and the climb counts for the town.
   - `[face]` Below {settlement} the country falls away, and the town is the better placed for the drop.
   - `[face]` The approach to {settlement} is uphill work, and the work falls to whoever is coming.
   - `[face]` The ground stands higher at {settlement} than in the country around it, and the height is the town's to keep.
2. `[ledger]` The terrain at {settlement} carries part of the defense, and level ground would carry less.
   - `[face]` The site of {settlement} is worth something to the defense on its own account, and open country would be worth less.
   - `[face]` Part of the defense at {settlement} is in the lie of the land, and a flat site would be the poorer for it.
   - `[face]` Ground of this kind is worth more to {settlement} than flat country would be.
3. `[counterforce]` Whatever came against {settlement} would come up a slope, and the slope is the town's.
   - `[face]` The climb stands in the way of anything reaching {settlement}, and the town holds its upper end.
   - `[face]` A force pressing {settlement} would press uphill, and the town would be above it.
   - `[face]` Steep ground stands between {settlement} and anything below it.

--- NOTES

**THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE** (the only failing measure the packet owns on this pool)

| measure | band | round 1 | what it was | round 2 |
|---|---|---|---|---|
| band depth · `shapes.participialOpenerRate` (over) | DEPTH at most 1.75 band-widths on every face | 28.24 band-widths on 1 of 12 faces | the flagged face is **v3 face 0**, the `[counterforce]` spine row, which opened on **"Anything"** | the row opens on **"Whatever"**; no wording in the pool now opens on a word ending in `ing` |

- **Why one word was the whole failure, and why it is not a prose fault.** The measure is computed on the unit's FIRST WORD, lower-cased and stripped to letters, by `src/domain/prose/proseFingerprint.js:141`: a first word matching `/ing$/` counts as a participial opener unless it is a member of the file's `NOT_PARTICIPLES` list (`:71`), and that list holds `thing`, `nothing` and `something` but **not `anything`**. A face is one sentence, so a single hit is a rate of 1.0 against a band whose top edge is ≈ 0.034 — the 28.24 band-widths the gate printed. The cure is the opener, not the claim: `Whatever came against …` carries the identical claim pair in the identical grammar and the identical subjunctive mood.
- **Verified by reading, not by running:** the read-only licence-card script is the only executable this seat is fenced to, so the twelve first words were checked against the detector by hand — `the · the · the · the · the · the · part · ground · whatever · the · a · steep`. None ends in `ing`. The measure's value on this pool falls from 1 of 12 faces to 0 of 12. **PLAUSIBLE by inspection of the detector's source; CONFIRMED only when the lane re-runs the gate.**

**TWO WALK FINDINGS ALSO CURED** (channel WITHHELD, `inherited`, arm X · `exhaustivity over an open column`; they are why the pool's verdict is WITHHELD even though every owned unit verdict is PASS, `spineWithheld: true`)

The arm fires on `SPECIFICATIONAL_COPULA` (`src/domain/prose/entryLexicons.js:332`), which has two limbs: `is/are/was/were` followed by `what`, `who`, `the only` or `the one`; and a sentence that OPENS on `the` + a lower-case word and reaches `is the` + a lower-case word within sixty characters. Both round-1 rows tripped a limb, and both are cured without a claim moving:

| row | round 1 | the limb it tripped | round 2 | why the claim is unchanged |
|---|---|---|---|---|
| v1 face 1 | `The country falls away below {settlement}, and the town is the better placed for it.` | limb 2 — opens on `The country …` and reaches `is the better` at 51 characters | `Below {settlement} the country falls away, and the town is the better placed for the drop.` | both halves kept: the country below lies lower (`Mountain`) and the town is the better placed for it (`FAVOURABLE to the defender`). The sentence no longer OPENS on `the`, so limb 2 cannot reach; `is the better` is not `is the only` / `is the one`, so limb 1 never applied. The closing pronoun becomes the noun it stood for, which is also the thread |
| v3 face 1 | `The climb is what stands in the way of anything reaching {settlement}, and the town holds the far end of it.` | limb 1 — `is what` | `The climb stands in the way of anything reaching {settlement}, and the town holds its upper end.` | the pseudo-cleft was the exhaustivity, not the fact: `the climb is what stands in the way` entails the climb is the ONLY thing that does, over a column the ground does not close. Struck to the plain verb; the two claims (the climb lies in the way; the town holds its upper end) stand |

A third improvement rides on those two edits and on the v3 spine, un-asked and un-owned: the pronoun closers fall from 5 of 12 to 3 of 12 (`closers.pronounRate` 0.4167 → 0.25), which is the corpus grain's deepest exceedance on this pool (3.545 band-widths over at 0.4167). It is reported, never targeted; the corpus grain is not in this pool's `failing` list.

**THE CARD THIS POOL IS WRITTEN UNDER** (printed by `node scripts/prose-licence-card.mjs DS-DEF-1 'terrain FAVOURABLE to the defender'`; unchanged from round 1)
- reads `text(terrain)` (via `TERRAIN_DEFENCE_OF` in `defenseStateProse.js`); predicate `=== Mountain`; role spine; form sentence; move none declared; angle set `counterforce ledger visitor`; bag `{band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, FILLED at this block's call sites `{settlement}`.
- may claim: **that the reader `text(terrain)` selects the row `Mountain` of `TERRAIN_DEFENCE_OF`, as a STANDING fact of the record** — clause **[MC]**. The pool key's band word (`FAVOURABLE to the defender`) is that row's own reading, so the ground's KIND (high, rising, steep, a climb) and its DEFENSIVE STANDING are the one claim triple `(PRESENT, text(terrain), Mountain/favourable)`; every one of the twelve wordings asserts that triple and nothing else.
- may NOT: a count, a cause, a season, a future, a standpoint, a second fact — clause **[MN]**.
- source `(none)` · standing SOURCE-UNRESOLVED — **no citation is licensed** (arm A13); no wording names a holder. Clause **[SRC]**.
- refused columns, always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim. None is approached.

**PER FACE — WHICH CLAUSE LICENSES WHICH CLAIM** (every wording carries the same one triple; the licence is the same clause, the wording is not. `†` marks a wording that moved this round)

Variant 1 `[visitor]` — the site as it stands on the way in.
| wording | claims | licensed by |
|---|---|---|
| spine row | the approach climbs (`Mountain`); the climb stands to the town's account (`FAVOURABLE to the defender`) | [MC] both halves; `{settlement}` by the bag's FILLED set |
| face 1 † | the country below the site lies lower (`Mountain`, stated as a measurement in words — R-DA-11); the town is the better placed for that drop | [MC] both halves. The drop is the same reading named twice for the thread, never a second fact ([MN]) |
| face 2 | the approach is uphill (`Mountain`); the labour of it falls on the side approaching, not the town | [MC] both halves; the second half is the row's defensive standing stated as position, never an attacker's assessment ([MN] standpoint) |
| face 3 | the ground at the site stands higher than the country around it (`Mountain`, a comparison as a measurement); the height is the town's | [MC] both halves |

Variant 2 `[ledger]` — the record's flat accounting, carrying the pool's one licensed CONTRAST. No wording moved this round.
| wording | claims | licensed by |
|---|---|---|
| spine row | the terrain carries part of the defense (`Mountain` / `FAVOURABLE`); level ground would carry less | [MC] for the first; the CONTRAST by R-DA-02 and MOVE-GRAMMAR §1.4 wall 5 — the rejected alternative names the SIBLING POOL `terrain EXPOSED` (predicate `Plains`) by its band, is never fronted as the subject, and closes only this one variant of the pool; the counterfactual is subjunctive (A2's edge), never a future |
| face 1 | the site is worth something to the defense on its own account; open country would be worth less | as the spine row |
| face 2 | part of the defense is in the lie of the land; a flat site would be the poorer for it | as the spine row |
| face 3 | ground of this kind is worth more to the town than flat country would be | as the spine row |

Variant 3 `[counterforce]` — the same fact under the subjunctive edge.
| wording | claims | licensed by |
|---|---|---|
| spine row † | an approach would be made up a slope (`Mountain`); the slope is the town's (`FAVOURABLE`) | [MC] both halves; the conditional is A2's subjunctive edge (MOVE-GRAMMAR §1.3 — FORECAST does not exist; no wording carries a future indicative). `Whatever` is not a member of the walker's `QUANTIFIERS` list and quantifies no column of persons |
| face 1 † | the climb lies in the way of anything reaching the town; the town holds its upper end | [MC] both halves. The struck `is what` was an exhaustivity over an open column, not a claim the card licensed |
| face 2 | an approach would be made uphill; the town is the higher of the two positions | [MC] both halves; A2 |
| face 3 | steep ground stands between the town and the country below it | [MC] both halves |

**WHAT THE OLD SHIPPED SENTENCES CLAIMED AND THIS DRAFT DROPS** (carried verbatim from round 1; dropping is the rewrite's purpose, and the shipped breach is the corpus's known state)
- v1 old, "The ground does more for {settlement} than the town does": the comparison is against the TOWN'S OWN EFFORT — a second fact from the readiness reader and from `DS-DEF-10`'s arms. DROPPED under [MN] (a second fact) and arm A1 (a sibling pool's claim restated).
- v1 old, "The approach is narrow": narrowness is a topographic particular the record does not hold; `Mountain` is the whole of the value. DROPPED under [MC] and finite semantics.
- v1 old, "anything coming at it has to come the long way and in the open": an attacker's course and exposure, asserted indicatively. DROPPED under [MN] (a standpoint, a second fact).
- v2 old, "what the town has built is worth more here than the same works would be on flat ground": the WORKS half asserts built defenses — the readiness / `DS-DEF-10` reader. DROPPED under [MN]. The comparison against flat ground is KEPT, re-seated on the ground itself, because R-DA-02 licenses a contrast whose rejected alternative names a sibling band.
- v3 old, "The ground here does the arguing": an inanimate thing acting with intent. DROPPED under R-DA-11 (the figure policy).
- v3 old, "Anything weighing an attempt on {settlement} has to weigh the approach first": an attacker's assessment. DROPPED under [MN] (a standpoint).
- v3 old, "the approach is the part that does not improve with numbers": a life-general closer and a count. DROPPED under R-DA-12 (the generalisation test) and [MN] (a count).
- Nothing is added in either round: no wording names a holder ([SRC]), a count, a cause, a season, a future or a second fact.

**FORM DECLARATIONS** (re-checked over the round-2 text, not carried on trust)
- No em dash, no exclamation mark, no digit, no percent, no `which`-clause, no question mark, no first or second person, no citation, in any of the twelve wordings.
- No wording opens on `{settlement}`: a sentence-form row opening on a `proper`-typed slot of the block's bag is refused (ARCH §2.5, T-F8). Face 1 of variant 1 opens on `Below` and carries the slot in second position, which is not an opening — and it is the pool's only fronted prepositional phrase, so the opener set widens rather than repeats.
- The three spine rows open `The way`, `The terrain` and `Whatever came`; no two variants of the pool share their first two words (A11), and no two faces inside a variant do either (the packet's `sameOpenerPairs` was 0 in every variant at round 1 and no first-two-words pair is created here).
- `{settlement}` appears exactly once in every one of the twelve wordings, so each face's `{slot}` set equals its parent's (ARCH §2.5's face refusal).
- No connective from `§7b THE STATE CONNECTIVES` appears inside a variant's own text (the seam contract, T-F1); the joints used are the plain `, and`.
- The pool's angle tags are carried exactly as they stand: `[visitor]`, `[ledger]`, `[counterforce]`. One bracketed tag per spine row; no `[plain]` marker anywhere (that marker is the modifier rows').
- Face rows are written in the projector's shipped form — `/^\s*-\s+`\[face\]`\s+(.*)$/`, `scripts/lib/dossier-annex-grammar.mjs:107` — three-space indent, `- ` bullet, backticked tag.
- THE THREAD (MOVE-GRAMMAR §1.4.1): every wording is one sentence whose second clause carries a noun or subject forward from the first — climb → climb; the country falls away → the drop; work → work; higher → the height; terrain carries → level ground would carry; site → open country; slope → slope; climb → its upper end. No wording changes subject in the middle and hands nothing back. The pool is a spine, so each wording OPENS its passage; none depends on a preceding modifier, and each reads as the passage's first sentence.
- Close kinds vary across the pool (a condition, a possession of the object, a comparison, a position), per R-DA-04. The two closes that moved this round both go from a pronoun to the noun the pronoun stood for, which serves the thread and the closer measure at once.
- THE DENSITY LAW (§21.4): no line was made plainer. The v3 spine keeps its length and its idiom; face 1 of variant 3 loses only the pseudo-cleft that carried the unlicensed exhaustivity, and face 1 of variant 1 loses only the sentence-opening `The` that the walker's second limb keys on.

**REFUSALS** (a refusal is a result)
1. **The pool cannot carry three DISTINCT level-1 grammars** (MOVE-GRAMMAR §2.1: a pool of k variants carries min(k, 8) distinct level-1 grammars). Only **V1 (PRESENT)** is drawable here: the block holds no `none-exists` field (no V3), no named-object field (no V4), no institution row on this reading (no V5), no event provenance (no V7), no `not-held` provenance field (no V8), no state field whose value is unresolved (no V6), and the card declares no structural-consequence field (no V2). A grammar whose licensing field is null is NOT drawn and is NOT written empty (§1.1), so all three variants are PRESENT, distinguished by angle, vocabulary, rhythm and — in variant 2 only — the sibling-band CONTRAST that R-DA-02 licenses. The census row's `grammars: 3` is the classifier's reading of the shipped text, and V1 is the classifier's silent fallback (§4.4.2); it is not a licence. **No wording is refused; the LAW that cannot be met is the distinct-grammar law, and it is unmeetable from the FIELDS, not from the writing.** Unchanged from round 1 and carried, not re-argued.
2. **Carried for the refuters, not refused:** variant 2's contrast is the pool's only claim-shaped difference between variants. It is kept because the old sentence made it and R-DA-02 licenses it; if the sitting reads a sibling-band contrast as a second fact under [MN], variant 2's four wordings lose their second clause and become claim-identical to variants 1 and 3, which is a lawful but flatter set. The reading is named here so it is ruled and not re-found.
3. **The PERFECTION CEILING, declared against this seat's own work** (§16/§16.1): with the one participial opener cured, the pool's face grain is expected to read zero exceedances on all twelve faces, which the instrument flags `perfectionSuspect` — a finding, never a rewrite trigger. This seat did not manufacture an exceedance to escape the flag, because every band-crossing available at the face grain costs either a claim or a wall, and the DEPTH gate would then own the round. The human unevenness the ceiling looks for is present at the corpus grain, where the twelve wordings crossed 13 of 13 scored measures at round 1. Named here so the sitting rules it and no later round re-finds it.
