1. `[ledger]` The wall at {settlement} stands, and the men who hold it are soldiers by trade. That deters raiding and it deters a conventional assault, and it does not extend to a long siege with nothing stored behind the wall.
   - `[face]` A standing garrison keeps the line at {settlement}, and the line does not stand on its own. It answers a raid and it answers an assault brought in order, and no answer of that kind reaches a long siege with nothing stored behind the line.
   - `[face]` At {settlement} a paid garrison stands on a wall that the town keeps up. Raids are deterred by that and so are assaults brought on in the ordinary way, and a long siege with nothing stored behind the wall is not.
   - `[face]` The men on the perimeter at {settlement} are soldiers by profession, and the perimeter is where they stand. A raid is held off and so is a conventional assault, and a long siege with nothing stored behind the perimeter is past what the men on it can hold.
2. `[visitor]` A stranger comes up to {settlement} and takes the measure of the place. The wall stands and the men who belong to it stand with it, and the stranger prices an attempt against both.
   - `[face]` An outsider walking up to {settlement} finds the works manned and not empty. The estimate an outsider brings does not survive that, and the cost of an attempt is set again on the spot.
   - `[face]` A traveller who stops at {settlement} sees soldiers standing where the line runs. The cost of an attempt on the town is read off the line and the soldiers together, and the traveller reads it before going on.
   - `[face]` From outside {settlement} the wall shows and the soldiers on it show too. A newcomer who prices an attempt on the town prices it against the wall and the soldiers at once, and not against the wall alone.
3. `[street]` The town takes it as settled that the place could be held. What the town has standing is the ground for saying so, and hope does not enter into the reckoning.
   - `[face]` Here the place is spoken of as one that could be held. The ground for saying it is what the town has in hand, and hope is no part of the ground.
   - `[face]` The matter of whether the place could be held is settled in this town. What settles the matter is in plain sight, and the town does not have to reach for hope in order to say so.
   - `[face]` Confidence that the place could be held is ordinary talk. What it rests on is what the town keeps in hand, and hope is not what holds it up.

--- NOTES

**Packet.** Block DS-DEF-2 · pool key `Invasion & War: walls AND professional garrison` · draft **round 2** · Opus WRITER seat (Fable-unvalidated). Three existing variants rewritten in place under their own numbers and their own bracketed tags; none added, removed, merged or reordered. Four wordings per variant (the numbered row plus three `[face]` sub-rows), **twelve wordings** in the pool. Ready to paste under the pool's bold heading in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` as the complete replacement for the pool's variant rows.

**THE ROUND-1 REFUSAL, CURED (the reason this round exists).** Round 1 wrote `1. `[ledger]` `[plain]` …`, a SECOND bracketed tag on the numbered row; the projector folds an unknown tag into `marks` and the contract test reds with `unclassified: [ 'plain' ]`. ARCH §2.5's table shows the numbered row carrying exactly one tag, and the two DS-DEF-2 pools already landed in this annex (`Beasts & Monsters: plagued, perimeter AND organized force`; `Beasts & Monsters: frontier, force without a perimeter`) carry exactly one — the angle tag — with the plain wording on that same line and three `- `[face]`` sub-rows beneath. **Round 2 writes the numbered row as `N. `[angle]` <plain wording>`.** The numbered row IS the plain wording; the tag on it is the variant's own, untouched. Nothing typed is added.

**THE GATE'S TWO FAILING MEASURES, ANSWERED MEASURE BY MEASURE.** Both were measured on the rows the pool still carries, because the round-1 paste was refused and the pool kept its previous rows. Both are cured to ZERO, on every one of the twelve wordings, not on one.

| measure | where it fired | value that fired | what round 2 does | value now |
|---|---|---|---|---|
| `shapes.whichTailRate` (over), depth 26.027 on 1 of 3 | variant 1's `…to hold it, which is real deterrence…` | `, which` in a one-sentence unit ⇒ rate 1.000 | the relative tail is retired; the qualification takes its own sentence (R-DA-03, "never a tail"); no wording in the pool contains the string `, which` | **0.000 on 12 of 12** |
| `punctuation.parenthesisRate` (over), depth 3.082 on 1 of 3 | variant 2's `…together (the wall and the men who belong to it) and…` | one `(` in a one-sentence unit ⇒ rate 1.000 | the parenthetical apposition becomes the second sentence's own subject; no wording in the pool contains `(` or `)` | **0.000 on 12 of 12** |

The two depths are the instrument's own arithmetic (`proseFingerprint.js:142` and `:138`, `rate = count/sentences`, `scoreAgainstBands` depth `(value − hi)/(hi − lo)`), and they back out the real bands the gate scored against: `whichTailRate` hi ≈ 0.0370 and `parenthesisRate` hi ≈ 0.245, each with lo 0. At hi 0.0370 **no unit shorter than ten sentences can carry a single `, which` inside the depth ceiling of 1.75**, so zero is the only lawful count for a two-sentence unit and nothing softer would have moved the measure. This is a moved owned measure on both counts, so round 2 is not dry.

**THE SHAPE ROUND 2 WRITES TO, and why (the depth ceiling is 1.75 band-widths per ENTRY, Part B §16.2).** Every rate metric divides by the unit's SENTENCE COUNT, so on a unit this short one occurrence of a rare shape is a rate of 0.5 or 1.0 and blows its band. Each of the twelve wordings is therefore built to the same skeleton, and each was checked against all twenty-one metrics by hand:
- **exactly two sentences** — a one-sentence unit forces `neighbourVariation` to 0 (below every plausible lo) and makes every other rate 0 or 1 with nothing in between;
- **both sentences 8 to 30 words inclusive** — `wordsPerSentence.shareUnder8` (`< 8`) and `shareOver30` (`> 30`) both read 0.000 on every wording, where one short or one long sentence would read 0.500;
- **the two lengths spread so `neighbourVariation` lands in 0.40–0.70** — the twelve values are 0.462, 0.489, 0.634, 0.500 · 0.470, 0.470, 0.632, 0.632 · 0.450, 0.500, 0.486, 0.621;
- **no semicolon, colon, em dash, parenthesis, question mark, exclamation mark or quotation mark** anywhere — six punctuation metrics at 0.000;
- **no `, which`; no `rather than`, no `, not x`, no `not … but`, no `less … than`** — `whichTailRate` and `antithesisRate` at 0.000 (the original variant 3's `rather than` is retired with the rest);
- **no sentence opens on a word ending `-ing`** (`participialOpenerRate` 0.000; the trap is real, `Raiding …` would have scored 0.500) and **none opens `There is` / `It is`** (`thereIsOpenerRate` 0.000; `It answers …` is outside that regex);
- **no sentence closes on an abstract noun** in `ness|tion|sion|ity|ment|ance|ence|ship|hood|dom` — `deterrence` and `arrangement` are barred from final position and appear nowhere as a closer — **and none closes on `it, them, him, her, us, me, you, this, that, there, here`**: the closers are trade · wall · own · line · up · not · stand · hold · place · both · empty · spot · runs · on · too · alone · held · reckoning · ground · town · so · talk · up;
- **the two sentences of a wording never open on the same word** (`sameOpenerAsPreviousRate` 0.000) and **no triad** (`triadRate` 0.000: no wording carries two commas before an `and`);
- **at most one `-ly` adverb per wording, and in fact none** — `adverbsPerSentence` reads 0.000, under its lo rather than over its hi, which is the shallow side of a wide band;
- **no digit, no percent, no figure, no simile, no sense verb on an abstraction, no inanimate thing acting with intent, no address to the reader, no future indicative.** The three modal edges (`would` is retired; `could be held`, `is past what … can hold`) are subjunctive or capability, never fate (R-DA-07, NL-6).

**The claim set carried, one id per claim — identical to the BEFORE's, nothing added, nothing dropped (arm A6).**
- **K1** walls stand at the settlement · **K2** a professional garrison holds them · **K3** the pair is real deterrence against raiding and against a conventional assault · **K4** the posture is not rated for a long siege where nothing is stored behind the wall (a CONDITION, never an assertion that the stores are empty) · **K5** an assessor from outside, seeing both together, revises what an attempt would cost · **K6** the town takes it as settled that the place could be held · **K7** what settles it is the arrangement in hand and not hope.

**Variant 1 `[ledger]` — every face, every claim, the clause that licenses it.**
| wording | claims | licence |
|---|---|---|
| numbered row (plain) | K1, K2 | card `may claim:` — that `invasionRowSituation(walls, garrison, militia) === walls, professional garrison` holds, as a STANDING fact of the record, on `reads: invasionRowSituation(walls, garrison, militia)` |
| numbered row | K3, K4 | **NOT licensed by any card clause** — convicted by `may NOT: a second fact`; carried because arm A6 forbids dropping an inherited claim and §22 forbids removing what the sentence stood for (REFUSAL 1) |
| numbered row, slot | `{settlement}` | card `bag: {settlement: proper}`, FILLED at this block's call sites |
| numbered row, angle | ledger | card `angle: ledger street visitor` |
| face 1 | K1, K2, K3, K4 | as the numbered row, clause for clause; the `and` joint is one joint under amendment S2, from the connectives list, no `which`, the unit still two sentences |
| face 2 | K1, K2, K3, K4 | as the numbered row; `is not` closes elliptically on the deterrence verb already stated, which is compression inside the density law (§21.4) and asserts no further fact |
| face 3 | K1, K2, K3, K4 | as the numbered row; `is past what the men on it can hold` states K4's limit as a capability clause, never a historical one (the block's PROVENANCE + FENCE line: capability clauses only, absent an ancestry surface) |

**Variant 2 `[visitor]` — every face, every claim, the clause that licenses it.**
| wording | claims | licence |
|---|---|---|
| numbered row (plain) | K1, K2 | card `may claim:` on `reads:` |
| numbered row | K5 | **NOT licensed** — convicted by `may NOT: a standpoint` and `a second fact`; the card's `angle: visitor` licenses the face's manner of telling, never a claim about what an assessor concludes (REFUSAL 2) |
| numbered row, slot | `{settlement}` | card `bag:` as above |
| face 1 | K1, K2, K5 | as the numbered row; `manned and not empty` is R-DA-02's licensed contrast, its rejected alternative naming the sibling pool key `Invasion & War: walls with NO force` |
| face 2 | K1, K2, K5 | as the numbered row; no contrast is drawn, so R-DA-02 is not reached |
| face 3 | K1, K2, K5 | as the numbered row; `and not against the wall alone` is R-DA-02 on the same sibling key. The BEFORE's count word `the two` is NOT carried: the card refuses `a count`, and dropping a count word drops no claim, since K5 is the claim and `both` in the numbered row is a joint pronoun and not a number |
| all four | no militia, no second force | card `may NOT: another civic object of the class force`; arms A1/A11 hold the distance from `walls with citizen militia`, `militia only` and `force with NO walls` |

**Variant 3 `[street]` — every face, every claim, the clause that licenses it.**
| wording | claims | licence |
|---|---|---|
| numbered row (plain) | K6 | **NOT licensed** — convicted by `may NOT: a standpoint`; MOVE-GRAMMAR §1.3 records that no FEELING or BELIEF move exists anywhere in the estate, and R-DA-13's belief-frame floor is zero (REFUSAL 3) |
| numbered row | K7 | **NOT licensed** — `may NOT: a standpoint`; the rejected alternative `hope` names no sibling pool key and no band word, so R-DA-02 refuses the contrast even as a form |
| numbered row, slot | none | the parent variant carries no slot; every face of it carries none, because ARCH §2.5 refuses a face whose `{slot}` set differs from the parent's |
| numbered row, angle | street | card `angle: ledger street visitor` |
| faces 1, 2, 3 | K6, K7 | as the numbered row, clause for clause; each states the town's own reckoning and the ground under it, and none names the wall or the garrison, because naming them would ADD K1 and K2 to a variant that never carried them and break claim equality in the other direction |

**REFUSALS — three, one per variant. Every wording is written and none is trimmed (§22).**
1. **Variant 1 `[ledger]` cannot meet the card's `may NOT: a second fact`.** K3 and K4 are two further standing facts beyond the one the card licenses, and K4's condition names STORES, a civic object outside this pool's `reads`. Neither can be dropped: arm A6 requires the four faces to be claim-equal to the variant as it stood, and §22 (a) holds that the rewrite changes a sentence's words and never removes the sentence it stands for. All four wordings are lawful on every other law tested. **Disposition is the chair's:** carry K3 and K4 as inherited on the spine, or migrate them to modifier pools by a chair act, which the composed-prose architecture exists to do and a writer may not perform.
2. **Variant 2 `[visitor]` cannot meet `may NOT: a standpoint` (and, on the same clause, `a second fact`).** K5 asserts what an assessor from outside concludes. `angle: visitor` licenses the manner, not that claim, and no field under `reads` holds an assessor's revision. Kept under arm A6; same disposition as (1).
3. **Variant 3 `[street]` cannot meet three laws at once, and is the sharpest refusal in the pool.** K6 is a collective belief: the card refuses a standpoint, MOVE-GRAMMAR §1.3 records no FEELING or BELIEF move in the estate, and R-DA-13's belief-frame floor is zero. K7's contrast against `hope` fails R-DA-02, whose rejected alternative must name a sibling key or a band word. K6 and K7 are the variant's ONLY claims, so **it cannot be made lawful by rewording at all** — curing it means changing what the sentence claims, which the rewrite forbids. The four wordings are written to the ceiling inside that failure and **no new failing state is added** (§21.2). A ruling is owed: mint a typed field holding the town's own account of its defensibility, or bank the set as a refusal row with its faces and print the banked count (§21.2), or re-seat the claim on the predicate by an owner-gated claim change.

**Laws tested and held across all twelve wordings.**
- No em dash, no exclamation, no question, no digit, no percent, no `which`-clause, no parenthesis, no semicolon, no colon.
- No future indicative; the modal edges are subjunctive or capability and are inherited, never added.
- No figure, no simile, no sense verb on an abstraction, no inanimate thing acting with intent, no address to the reader, no moral, no summary of the sentence before, no hook.
- **No citation.** `source: muster · standing LICENSED` makes one available and §24 caps the budget at one per unit for one of S3's three reasons; the BEFORE carries none, so adding one would break claim equality (a cited claim is TWO licensed claims, §20). Declined deliberately, recorded, not overlooked.
- No totality over persons (`A newcomer`, not `anyone`), no exemption from a duty, no named character, no theological claim — the card's REFUSED COLUMNS.
- **Slot discipline:** every wording of variants 1 and 2 carries `{settlement}` exactly once; every wording of variant 3 carries none. Each face's set equals its parent's (ARCH §2.5).
- **T-F8:** no wording opens on the proper-typed slot. `At {settlement} …` opens on `At`, the shape already landed in this same annex at `Beasts & Monsters: plagued, perimeter AND organized force`, variant 2 face 3. Applied to the numbered row as well as the faces, because the draw is unweighted over all four and each must stand alone.
- **A1 / R-DA-03:** every wording is exactly two sentences; no third; no qualification carried as a tail.
- **R-DA-22, one term for one thing, held WITHIN each wording:** variant 1 runs `wall` · `line` · `wall` · `perimeter` across its four, and never two of them inside one wording; variant 2 runs `wall` · `works` · `line` · `wall`; variant 3 names no civic object at all. The term varies ACROSS the faces, which is the owner's four-vocabularies rule and not a registry breach.
- **THE THREAD (owner, 2026-09-08 ~21:4x).** Every second sentence picks up a noun or a pronoun from the first: `That` (the wall and its soldiers) · `It` (the garrison) · `Raids … by that` · `A raid … the men on it` · `the stranger` · `an outsider` · `the traveller` · `the wall and the soldiers` · `What the town has standing` · `The ground for saying it` · `What settles the matter` · `What it rests on`. No wording changes subject in the middle and hands nothing back; where the subject turns outward, the turn is the passage's last move.
- **Spine placement.** This pool is the SPINE, so each wording was read both cold and immediately before a modifier: every one closes on a noun or a stated limit a modifier can pick up (wall · line · perimeter · both · spot · alone · reckoning · ground · talk), and none closes on a pronoun that a following modifier could re-bind.
- **A11 spread.** No two of the twelve wordings share their first two words: `The wall` · `A standing` · `At {settlement}` · `The men` · `A stranger` · `An outsider` · `A traveller` · `From outside` · `The town` · `Here the` · `The matter` · `Confidence that`.
- **R-DA-04, the kind of close varied inside each variant:** variant 1 closes on a limit, an object, an ellipsis of the verb, and a capability; variant 2 on the pair, a place, a departure, and a rejected alternative; variant 3 on a fact, a ground, an assertion, and a support.
- **R-DA-05, rhythm.** Word counts, numbered row first — variant 1: 39 · 45 · 41 · 48; variant 2: 34 · 34 · 38 · 38; variant 3: 31 · 32 · 37 · 29. The slot counts as one word.
- **Sibling distance (arms A1 and A11).** No wording restates or contradicts `walls with citizen militia`, `walls with NO force`, `force with NO walls`, `militia only`, `neither walls nor force`, or the `Beasts & Monsters: frontier, credible deterrence` row, whose `a line and a force behind it` the numbered row was moved off deliberately. No militia is named anywhere, the card refusing another civic object of the class `force`.

**One thing this packet does NOT do, declared.** It does not execute the fingerprint against the real exemplar bands: the writer's fence permits only `scripts/prose-licence-card.mjs` in the dock, and the real bands are supplied to the walker as an argument and do not live in the repo (`tests/fixtures/grammarControls.js` carries SYNTHETIC bands only, by its own header). Every band figure above is either the instrument's arithmetic re-derived by hand from `proseFingerprint.js` or a value backed out of the gate's own two reported depths, and is labelled as such. The two owned measures are CONFIRMED at zero by inspection of the twelve strings; the remaining nineteen are PLAUSIBLE-by-construction and are the gate's to score.
