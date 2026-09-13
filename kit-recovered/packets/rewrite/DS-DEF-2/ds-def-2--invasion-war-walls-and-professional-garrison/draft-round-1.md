# DS-DEF-2 · `Invasion & War: walls AND professional garrison` · DRAFT ROUND 1

*Seat: Opus 5 — Fable-unvalidated. Written under brief ADDENDUM 14 (a face is lawful unless it contradicts the record; silence is permission), the four floors, and `rewrite/recut/CONTRADICTION-TABLE.md`. Three variants rewritten in place under their own vids and their own angle tags; four faces each; nothing added, removed or merged.*

---

## THE ROWS — the complete replacement for the pool's variant rows

1. `[ledger]` The books at {settlement} carry the works and the men's wages under one head. The wage is entered; the names are not.
   - `[face]` Keeping the defences and keeping men in pay are one duty in the reckoning at {settlement}, and no clerk here is asked to choose between them.
   - `[face]` Against invasion the entry at {settlement} shows a work and a force, and the town is charged for both whether or not anything comes.
   - `[face]` The men in pay at {settlement} are kept rather than called out, and what keeps them is the same charge that keeps the work up.
2. `[visitor]` A stranger coming up to {settlement} sees the work before he learns that men are kept for it, and it is the keeping that makes an attempt dear.
   - `[face]` The work at {settlement} is what a stranger sees from outside. That men are kept for it is what he is told before he asks.
   - `[face]` An attempt on {settlement} would be charged for the work and charged again for the men kept for it. The charge for the men is the one nobody prices in advance.
   - `[face]` Travellers in and out of {settlement} say the same of the place. The work is up, and the keeping of it is a paid trade.
3. `[street]` The argument in this town is over what the works cost, never over whether they would serve. Men are kept for them, and the wage for the men is the same argument.
   - `[face]` Children play at the foot of the works here and are not called off. The work stands, and men are kept at a wage to keep it standing.
   - `[face]` A work standing and a wage that keeps men for it is what the town counts on. What is said about those men is another matter, and it is not said to them.
   - `[face]` The town's position is that it could be held. That position rests on a work that stands and a wage that is paid.

---
--- NOTES

**REFUSALS: none.** All three variants are written lawful under the four floors. Nothing is banked.

**The licence shorthand used below.**
- **[CARD]** — the card's `may claim` line: *that `invasionRowSituation(walls, garrison, militia)` selects the row `walls, professional garrison` of `INVASION_ROW_POOL`, as a STANDING fact of the record.*
- **[W]** — the card's read, resolved: `standingDefenseForces(settlement).walls.present === true` (a standing, ruin-filtered member of the walls bucket, `defenseInstitutionBuckets.js:84-89`, `:169-182`).
- **[G]** — the card's read, resolved: `standingDefenseForces(settlement).garrison.present === true` (a paid, standing member of the garrison bucket, `:88-91`; the WORD "the garrison" and its generics settled lawful by CONTRADICTION-TABLE §R-3).
- **[PURSE]** — floor 4's positive model, F4-02: ONE multiplier `milUpkeepMult` over *garrison wages, wall maintenance* together (`defenseGenerator.js:182`, `:189-192`). Stating that the two are one charge is the engine's own arithmetic; splitting them is the breach.
- **[DETER]** — floor 4's positive model, F1-34's ground read the licensed way: `stressGenerator.js:118-125`, walls ×0.6 and a military body ×0.7 on the siege roll, **never to zero**. An attempt is dearer, never impossible.
- **[SILENCE]** — ADDENDUM 14: the record does not carry it and does not deny it, and none of the five closed rosters is touched. Silence is permission.

**Standing choices that bind every face in this pool, and their ground.**
- **The perimeter noun is always the generic *the work* / *the works* / *the defences*, never a line, a circuit, a ring, a wall, stone or timber.** F1-07 (a `Citadel` is inner and a `Gates (if walled)` row is a point; both sit in the walls bucket by the `wall` substring) and F1-32 (the row's own printed description fixes the material). *Work* is true of a palisade, an earthwork, town walls, masonry, a citadel and a gate row alike.
- **The force is always *men in pay* / *men kept at a wage* / *a force* / *the keeping*, never soldiers, an army, a watch, a militia or a company.** F1-27 (a `Professional city watch` in this bucket is full-time law enforcement, not soldiers), F1-32's shape on a force row (a `Barracks` is housing), F1-03 and F1-26 (the key never reads `militia` and `Citizen militia` is `exclusiveGroup: 'civilianDefense'`). The paid, standing character is carried by *in pay*, *at a wage*, *kept*, *a paid trade* — which is what the bucket actually holds on every member.
- **No face stations a body on the works.** F1-83: at posture `deployed` the engine's own string is *army committed in the field*. Every face says the town KEEPS them; none says they are standing there.
- **No possessive fixes the employer, and "the garrison" bare is never used.** `Garrison` is kept under a noble or royal banner (`institutionVocabulary.js:164`) while `Professional city watch` is the town's own; F1-121 costs one possessive where an occupier is on the page. *Men in pay*, *men kept for it*, *a wage that is paid* fix nothing and survive both.
- **No gate, no checkpoint, no entry control.** `hasGates` does not fire on a `Citadel`-only or `Earthwork`-only roster (`priorityHelpers.js:53`), and where it is false `safetyProfile.js:463-464` prints *no gates to bribe and no checkpoints to avoid*. The visitor faces therefore keep the stranger outside the arrangement rather than inside its procedure — F1-08 avoided at the cost of the pool's most obvious texture, deliberately.
- **Zero citations.** Per the skeleton's pricing at §0.6: the muster's only roster-backed keeper is the `Citizen militia`, which this key never consults, so a cited roll is F1-24 across much of the preimage. The record VOCABULARY (books, entry, head, charge, reckoning, wage) is free entire — W24 struck — and is used freely; nothing is attributed to a keeper.
- **Mechanical:** no em dash, no exclamation, no question, no digit, no percent, no `which`-clause, anywhere in the twelve. Every face is one or two sentences with at most one joint.

### Variant 1 · vid 1 · `[ledger]` · slots `{settlement}` — four faces

Angle held: the clerk's view, the wall and the men entered as charges on one account, and the entry's own gap. Level-1 grammar: PRESENT → GAP (V8; the gap never opens and sits beside no other absence).

- **Face 1 (the numbered line)** — *The books at {settlement} carry the works and the men's wages under one head. The wage is entered; the names are not.*
  - a work stands and is a charge → **[W]** + **[CARD]**.
  - men are kept at a wage → **[G]** + **[CARD]**.
  - the two ride one head → **[PURSE]** (F4-02, the engine's own pairing of *garrison wages, wall maintenance*).
  - the entry holds no names → **[SILENCE]**. The claim is about what the WAGE ENTRY carries, not about any roll existing anywhere; no field records the names of a garrison's men, and no roster row is denied. Deliberately narrowed off the skeleton's *no roll of them* because the branch also fires on towns that DO carry a `Citizen militia` and therefore a muster-keeper (F1-03, `holderTable.js:279-288`).
- **Face 2** — *Keeping the defences and keeping men in pay are one duty in the reckoning at {settlement}, and no clerk here is asked to choose between them.*
  - the two keepings → **[W]** + **[G]** + **[CARD]**.
  - one duty, no choosing between them → **[PURSE]**, stated the way F4-02 actually models it: the direction can never be split, so the choice the sentence denies is a choice the engine does not offer. "Clerk" is an unnamed role the tier does not seat (F3-06 clear: the mandatory roles are Mayor, Guard Captain, High Priest, Corrupt Official).
- **Face 3** — *Against invasion the entry at {settlement} shows a work and a force, and the town is charged for both whether or not anything comes.*
  - a work and a force, under the row's own heading → **[W]** + **[G]** + **[CARD]** (the row is `Invasion & War`, `threatAssessment.js:113-130`, built for every town).
  - charged for both → **[PURSE]**.
  - *whether or not anything comes* → **[SILENCE]** and floor 2 kept: no prediction, no outcome, no rate, no elapsed course. It leaves the matter standing open, which is the register's own requirement.
- **Face 4** — *The men in pay at {settlement} are kept rather than called out, and what keeps them is the same charge that keeps the work up.*
  - kept rather than called out → **[G]** + **[CARD]**: the key's discriminating fact is a PROFESSIONAL force, and the contrast is licensed by the sibling keys `walls with citizen militia` and `militia only` (order constraint 5: a contrast where a sibling pool key names the rejected alternative; not fronted, not the closing move).
  - one charge for both → **[PURSE]**.
  - *keeps the work up* is a present duty, never a permanence claim (F4-01 respected in both directions: no decay clock asserted, no institution row declared permanent).

### Variant 2 · vid 2 · `[visitor]` · slots `{settlement}` — four faces

Angle held: what an outsider reads off the place without being told, and what the reading costs him. Level-1 grammar: PRESENT → CONSEQUENCE (structural) (V2). No named thing, no furnished approach (F3-05: no defense pool reads the culture profile, so nothing is thatched, hearthed, greened or snowed), no terrain and no road (F1-102).

- **Face 1 (the numbered line)** — *A stranger coming up to {settlement} sees the work before he learns that men are kept for it, and it is the keeping that makes an attempt dear.*
  - the work is visible from outside → **[W]** + **[SILENCE]** (what a stranger notices is not a field).
  - men are kept → **[G]** + **[CARD]**.
  - the keeping makes an attempt DEAR → **[DETER]**: dearer, never impossible, which is exactly the ×0.6 / ×0.7 model and is why no face reaches for *nothing takes this town* (F1-34).
  - the stranger is unnamed and meets nothing named → F1-126 clear by construction.
- **Face 2** — *The work at {settlement} is what a stranger sees from outside. That men are kept for it is what he is told before he asks.*
  - **[W]**, **[G]**, **[CARD]** as above.
  - *told before he asks* → **[SILENCE]**: the record carries no arrival procedure either way, and the face asserts no gate, no gatekeeper and no body at a post (F1-08, F1-83 both avoided).
- **Face 3** — *An attempt on {settlement} would be charged for the work and charged again for the men kept for it. The charge for the men is the one nobody prices in advance.*
  - the doubled charge → **[W]** + **[G]** + **[DETER]**, in the craft lexicon the pool already owns (charge, price, keeping).
  - the subjunctive *would* is the only licensed reach at an outcome (A2, the edge); *will* and *could not be taken* would be F2-05 and F1-34.
  - *nobody prices it in advance* → **[SILENCE]**, and it is the unit's open matter. No ordinal and no count: the second charge is named by its object (*the charge for the men*), not by a number.
- **Face 4** — *Travellers in and out of {settlement} say the same of the place. The work is up, and the keeping of it is a paid trade.*
  - attribution to a CLASS of witness, never to acquaintance → the register card's hedge-by-distance; no vague authority, no *it is said*.
  - the work is up → **[W]**; the keeping is a paid trade → **[G]** (a livelihood is the bucket's own professional character, and *trade* names no office the roster seats).

### Variant 3 · vid 3 · `[street]` · slots NONE — four faces

Angle held: the town's own talk and the things it does not arrange. **No slot, no proper name, no tier word** (F1-31), **no totality over persons** (the card's refused column), no elapsed course (F2-05 — the street voice's first reach, and every *has held*, *still*, *the last time* is kept out). Level-1 grammar: PRESENT → OPEN (V6).

- **Face 1 (the numbered line)** — *The argument in this town is over what the works cost, never over whether they would serve. Men are kept for them, and the wage for the men is the same argument.*
  - a work stands, men are kept → **[W]** + **[G]** + **[CARD]**.
  - the cost is argued and the capability is not → the block's own fence licenses a CAPABILITY clause and bars a historical one; *would serve* is subjunctive (A2). A live civic dispute over cost is **[SILENCE]**, and it is the unit's standing-open matter.
  - the wage and the works are one argument → **[PURSE]**. No shortfall is asserted in either direction, because `milUpkeepMult` reaches 1.0 on part of the key's range and the printed *Upkeep underfunded* note (`defenseDisplay.js:280`) does not fire there.
  - *the argument in this town* is a civic fact, not a claim about every person — the refused totality column is respected.
- **Face 2** — *Children play at the foot of the works here and are not called off. The work stands, and men are kept at a wage to keep it standing.*
  - ease at the town's own grain → **F1-34's own rider, in terms**: *children on the earthwork* is named there as free, against a totality which is not. The generic *the works* keeps F1-32 clear where F1-34's example does not.
  - **[W]** + **[G]** + **[PURSE]** (the wage keeps the work up: the one purse's own English).
  - conduct, never feeling: the disposition is shown by what nobody does, per MOVE-GRAMMAR §1.3's non-move FEELING.
- **Face 3** — *A work standing and a wage that keeps men for it is what the town counts on. What is said about those men is another matter, and it is not said to them.*
  - **[W]** + **[G]** + **[PURSE]** + **[CARD]**.
  - the town's reliance rests on the ARRANGEMENT and not on the men's quality → this is the face deliberately written to survive the whole preimage: `safetyProfile.js` prints *The garrison patrols the main paths* (`:288`), *overwhelmed or corrupt* (`:296`) and *a formality: present on paper, absent in practice* (`:306`) across this key's range, and a face praising the force is refutable on part of it.
  - what is said, and not said to them → **[SILENCE]**, impersonal, no totality, no named person, no office the tier seats (F3-06).
- **Face 4** — *The town's position is that it could be held. That position rests on a work that stands and a wage that is paid.*
  - *could be held* → the capability clause the block's own fence names, subjunctive (A2), computed by **[DETER]**. Not *will hold*, not *cannot be taken*.
  - the position's two supports → **[W]** + **[G]** + **[CARD]**; *a wage that is paid* carries the professional character without naming a payer (F1-121, `institutionVocabulary.js:164`).
  - the pool's one short change of pace, per the skeleton's §3.7 note that the shortest line in the pool must not be lost.

### The pool as a whole

- **The discriminating claim survives in all twelve**: a standing work AND a paid standing force, together, in every face. No face is claim-identical to `walls with NO force`, `force with NO walls`, `walls with citizen militia`, `militia only` or `neither walls nor force`.
- **The four claims the skeleton bars are gone in every spelling**: no siege prediction, no stores condition, no `which`-clause, no body stationed on the works.
- **Construction spread (the DULL check).** Subjects, in order: the books · a gerund pair · the entry (behind a prepositional opener) · the men in pay · a stranger · the work · an attempt · travellers · the argument · children · a fronted complement · the town's position. First two words, all twelve distinct except the deliberate article. Landing nouns: names · them · comes · up · dear · asks · advance · trade · argument · standing · them · paid. Two faces are two sentences with no joint, six are two sentences with one, four are one sentence with one.
- **Vocabulary spread.** Ledger: books, head, wage, names, duty, reckoning, clerk, entry, charge. Visitor: sees, learns, told, asks, attempt, price, travellers, trade. Street: argument, cost, serve, children, called off, said, position, rests. The craft lexicon is the keeping itself, per the exemplar pack's §10, and no descriptive word is spent twice.
- **The thread.** This pool is a SPINE and sits first in its unit with zero modifier mounts today, so each face hands a noun forward that a modifier could take up (the work, the wage, the men, the charge, the argument) and closes on a standing fact rather than a set-up. Each reads alone and reads as an opener.
- **The page fact.** No face opens on the works in the same words the `Beasts & Monsters` paragraph above it can use; three of the twelve open on a person or a noun from outside the defence vocabulary entirely.
