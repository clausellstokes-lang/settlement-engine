# DS-DEF-2 · `Invasion & War`: walls AND professional garrison — REWRITE, draft round 1

Seat: Opus 5 (Fable-unvalidated) · block DS-DEF-2 · role SPINE · 3 variants in, 3 variants out, 12 faces.
Paste the block below under the pool's bold heading, in place of the pool's three existing numbered rows.
The typed lines (ROLE / READS / RELATION / ATTACH / FORM / MOVE) are untouched and not repeated here.

1. `[ledger]` The wall at {settlement} is held, and held by professional soldiers.
   - `[face]` The line stands at {settlement}. The garrison that holds it draws a wage.
   - `[face]` {settlement} is walled and professionally garrisoned.
   - `[face]` Where the wall runs at {settlement}, the soldiers set on it are regulars.
2. `[visitor]` The soldiers on the wall at {settlement} belong to the town, and soldiering is their work.
   - `[face]` Soldiers hold the wall at {settlement}, and the town keeps them in pay.
   - `[face]` Behind the wall at {settlement} is a standing garrison.
   - `[face]` The garrison set on the wall at {settlement} is kept in arms, and the wall is its post.
3. `[street]` Wall duty at {settlement} is a paid post, and the garrison holds it as a trade.
   - `[face]` Soldiers are kept at {settlement} to stand the wall.
   - `[face]` Pay goes out at {settlement} to soldiers who stand the wall.
   - `[face]` The town's wall at {settlement} has a garrison on it, and that garrison is kept in wage.

--- NOTES

## 0. The card this pool is written against (printed, `node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: walls AND professional garrison'`)

- **reads / predicate** — `invasionRowSituation(walls, garrison, militia)` via `INVASION_ROW_POOL` in `defenseStateProse.js`, `=== walls, professional garrison`.
- **may claim** — that the reading selects the row `walls, professional garrison`, **as a STANDING fact of the record**. That is ONE fact with two named civic objects: the wall, and the garrison that is professional.
- **may NOT** — a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `force`.
- **bag** `{band: RESERVED, route: proper, settlement: proper}`, **FILLED at this block's call sites: `{settlement}`**. Every variant row and every face therefore carries `{settlement}` exactly once and carries no other slot; the parent's slot set and each face's slot set are identical (ARCH §2.5, the face-row refusal).
- **role spine** — no relation, no attach, form `sentence`, no move declared. Every row is a full sentence (no fragment faces: a fragment is the modifier's form, and this pool is a spine).
- **angle** `ledger street visitor` — each variant keeps its own tag exactly as it stood, one bracketed tag per row, no `[plain]` anywhere.

## 1. Claim ledger — what each old sentence claimed, what was kept, what was dropped

**vid 1 `[ledger]`** — *"{settlement} has a line and professionals to hold it, which is real deterrence against raiding and against a conventional assault; it is not a posture rated for a long siege without stores behind it."*
- KEPT: *a line* + *professionals to hold it* — the card's `may claim` (walls AND professional garrison, standing).
- DROPPED: *"which is real deterrence against raiding and against a conventional assault"* — a CAUSE and a STANDPOINT (a rating of what the arrangement achieves), both on the card's `may NOT`; also a `which`-clause, barred outright (register card; Part B R-DA-03 wall 6).
- DROPPED: *"it is not a posture rated for a long siege without stores behind it"* — a SECOND FACT (stores; a different reading, not this row's), a STANDPOINT (a rating), and an EDGE on an unmet future. `may NOT` on three counts.

**vid 2 `[visitor]`** — *"A stranger sizing {settlement} up sees the two things that matter together (the wall and the men who belong to it) and revises what an attempt would cost."*
- KEPT: *the wall* + *the men who belong to it* — the wall, and a garrison that is the town's own standing body. That is the row's licensed conjunction.
- DROPPED: *the stranger, his sizing up, his seeing and his revising* — a STANDPOINT (the card's `may NOT`) and an invented person the record holds no field for (R-DA-01: no persona; R-DA-14: a person of record is an OFFICE; fault 24, hollow specificity). The `[visitor]` angle survives as the row's mark and as the outward-facing diction (what stands, named from outside: the soldiers on the wall, the garrison behind it, the wall as its post); it may no longer be carried by an asserted observer.
- DROPPED: *"the two things that matter"* — an evaluation, a STANDPOINT.
- DROPPED: *"revises what an attempt would cost"* — a FORECAST and a CAUSE.

**vid 3 `[street]`** — *"The town believes it could be held, and the belief is founded on something rather than on hope."*
- KEPT: the pool's own predicate, which the belief frame presupposed — the wall, and a garrison held as a paid trade.
- DROPPED: *"The town believes"* — a BELIEF FRAME, a totality over persons in one word, and a standpoint. Belief frames stand at zero in this register (R-DA-13's executable floor; the card's `may NOT: a standpoint`).
- DROPPED: *"could be held"* — a subjunctive OUTCOME, i.e. a forecast dressed as an edge, with no field behind it.
- DROPPED: *"founded on something rather than on hope"* — a CONTRAST whose rejected alternative names no sibling pool key and no band (R-DA-02; wall 5), and an evaluation.
- Slot note: the old row 3 carried no slot. The rewritten row and all four of its faces carry `{settlement}`, so the parent-and-faces slot sets agree, and the row now names the town it is about, as its siblings do.

**Nothing was added.** The card licenses a citation of the `muster` holder ("source: muster · standing LICENSED"), and the provenance move would have bought this pool real variety — **it is refused here**, because none of the three old sentences made a source claim and the rewrite may never ADD a claim (Part B §21–§23; C-pair). The muster citation is therefore left to the authoring wave, where a new key may hold it under §24's ceiling of one citation per unit for one of S3's three reasons.

## 2. Per-face licence — which card clause licenses each claim

Every face carries the same two-part claim and nothing else, so the licence is short and identical in kind; the table names, per face, the words that carry each half.

| vid | face | the wall half (card: `may claim`, the row's `walls`) | the professional-garrison half (card: `may claim`, the row's `professional garrison`) | slots |
|---|---|---|---|---|
| 1 | a (row) | "The wall at {settlement} is held" | "held by professional soldiers" (the predicate's own word) | `{settlement}` |
| 1 | b | "The line stands at {settlement}" (the shipped row's own noun for the works) | "The garrison that holds it draws a wage" (a kept body, not a called one) | `{settlement}` |
| 1 | c | "{settlement} is walled" | "professionally garrisoned" | `{settlement}` |
| 1 | d | "Where the wall runs at {settlement}" | "the soldiers set on it are regulars" | `{settlement}` |
| 2 | a (row) | "on the wall at {settlement}" | "The soldiers … belong to the town, and soldiering is their work" | `{settlement}` |
| 2 | b | "Soldiers hold the wall at {settlement}" | "the town keeps them in pay" | `{settlement}` |
| 2 | c | "Behind the wall at {settlement}" | "a standing garrison" | `{settlement}` |
| 2 | d | "set on the wall at {settlement} … the wall is its post" | "The garrison … is kept in arms" | `{settlement}` |
| 3 | a (row) | "Wall duty at {settlement} … a paid post" | "the garrison holds it as a trade" | `{settlement}` |
| 3 | b | "to stand the wall" | "Soldiers are kept at {settlement}" | `{settlement}` |
| 3 | c | "who stand the wall" | "Pay goes out at {settlement} to soldiers" | `{settlement}` |
| 3 | d | "The town's wall at {settlement} has a garrison on it" | "that garrison is kept in wage" | `{settlement}` |

Three readings the writer is declaring, so a refuter can rule on them rather than find them:
1. **"held / holds / its post / on it" — the joint.** That the professional garrison stands on the town's wall is the row's own conjunction as the shipped `[ledger]` row already read it ("professionals to hold it"). It is a joint reading of one field, not a CAUSE and not a capability clause: no face says what the arrangement would withstand.
2. **"paid · in pay · in wage · draws a wage · Pay goes out" — the rendering of `professional`.** A professional garrison is a kept, waged body; that is what the predicate's word means and the only way the register can say it in the town's own idiom. It asserts no revenue, no treasury and no count. The `[street]` variant carries three of the four pay-renderings deliberately: money is the street's word for professional.
3. **No gendered noun anywhere.** "men / manned / man it" are struck from all twelve faces (the shipped `[visitor]` row's "the men who belong to it" is one of them). The estate's gendered-line breach is a live walker anchor (CLERK-LAWS §2.4.1, C3 arm a; NL-4's 234 male lines against a 50/50 field), and no field here holds the garrison's composition. "soldiers", "garrison", "regulars", "a standing garrison", "a paid post" carry it instead.

## 3. Walls and bands checked before shipping the draft

- **Walls.** No em dash · no exclamation · no question · no digit or percent · no `which`-clause · no second bracketed tag and no `[plain]` · no future indicative · no expletive opener ("there is / it is") · no figure, simile or inanimate intent · no evaluative adjective on the town · no quantifier or totality over persons (no "every", "only", "nobody", "nothing else") · no belief frame · no citation · no second fact · no other civic object of the class `force` (no militia, no watch, no mercenary company is named, not even as a rejected alternative — which also keeps R-DA-02's CONTRAST off this pool entirely).
- **Sibling distance (A1/A11).** The pool's siblings in this block (`walls with citizen militia`, `walls with NO force`, `force with NO walls`, `militia only`, `neither walls nor force`) are neither restated nor contradicted: every face here asserts both objects present and asserts nothing about any other force class.
- **Spread (A11).** The three variant rows' first two words are distinct ("The wall", "The soldiers", "Wall duty"), and all twelve faces open on distinct two-word heads. One face in twelve opens on the settlement token (1 c), which holds R-DA-17's ceiling at 0.083 and its "at most one variant per pool" reading.
- **Closes (R-DA-04).** No face closes on a pronoun; the closes vary in kind (soldiers · wage · garrisoned · regulars · work · pay · garrison · post · trade · wall · wall · wage).
- **Rhythm (R-DA-05/06).** Face lengths 6 to 18 words, mean 12.7 over the twelve; one face under eight words (1 c, six words) so the short line exists; nothing over thirty words; one two-sentence face (1 b) against eleven single-sentence faces; no semicolon and no colon spent in the pool; one subordinate-clause opening (1 d), one inversion (2 c), one money-first opening (3 c).
- **Grammar (MOVE-GRAMMAR §2.1 level 1).** Only V1 (PRESENT) and V4 (OBJECT → PRESENT) are licensed for this pool: with no `none-exists`, no `not-held`, no event-provenance and no structural-consequence field on the card, V2, V3, V7 and V8 are filtered out and are not written empty (§3.2). vid 1 and vid 3 are V1; vid 2 is V4 (the fabric and its holders named before the state that stands). Three variants over two licensed members is the licensing filter biting, not a spread failure. No `[grammar: Vn]` tag is written: the rows carry none today and adding one is a second marker, not this car's.
- **The thread (§1.4.1).** This is a spine, so it is always first in its composed passage; each face leaves the wall, the garrison and the town standing as nouns a modifier can carry forward, and the one two-sentence face (1 b) hands "the line" forward as "it".
- **Density (§21.4).** The plainest face in the pool (1 c, six words) is the short line the band asks for, not a plainer restatement of a lawful line; nothing was made plainer with no law behind it.

## 4. Refusals

**None.** All three variants are written lawfully under the card, in place, under their own numbers and their own angle tags, with four faces each.

One row is recorded for the chair rather than as a refusal: **the licensed `muster` citation is unspent**, because the rewrite may not add a claim the old sentence did not make (§2 above). If the chair rules that a spine may take the source its card licenses even where the shipped sentence did not cite one, this pool has an obvious fourth texture available and the writer will supply it on request.
