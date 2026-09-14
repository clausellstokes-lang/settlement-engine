1. `[ledger]` `[plain]` {settlement} is effectively undefended. A serious attempt on the town would meet nothing slower than the walk to its centre.
   - `[face]` The defence of {settlement} amounts to nothing an attempt in force would have to work at. Reaching the centre is the whole of the delay such an attempt would meet.
   - `[face]` Undefended is the plain word for {settlement}. An attempt made in earnest would be delayed by the length of the walk and by no arrangement the town keeps.
   - `[face]` For its defence {settlement} keeps nothing that would answer an attempt. Such an attempt would take the time of coming in, and no longer.
2. `[street]` `[plain]` What the town could not survive shapes what it provokes and what it leaves alone.
   - `[face]` The town measures what it takes up against what it could not survive, and lets the rest alone.
   - `[face]` Quarrels are not started here, and they are not carried far. Both restraints are cut to what the town could not stand.
   - `[face]` What would end the town is not a thing the town tests, and its dealings stay well inside what it can bear.
3. `[visitor]` `[plain]` A stranger reaches the centre of {settlement} without being stopped, challenged or counted.
   - `[face]` Unasked, a stranger comes into {settlement} and unasked reaches its centre.
   - `[face]` Arrival at {settlement} goes unmarked. A stranger stands at the centre before the business of asking begins.
   - `[face]` Passage into {settlement} is not stopped, and the centre is reached without a word said.

--- NOTES

**THE STANDING REFUSAL (whole pool) — the card licenses nothing, and the card is wrong.**
The printed card for `readiness CRITICAL` reads `may claim: nothing: the census recovered no reading, so no claim is licensed`, on the ground that "no pool-key function returns this key as a literal, no template of one binds it, and no module-level key table names it". Under that line as printed, **all twelve faces below are refusals of the rule "every claim in every face is licensed by the LICENCE CARD and by nothing else"**, and so is any possible rewrite of this pool, including the shipped rows.

The card's ground is false against the code in the dock. `src/domain/display/stateProse/defenseStateProse.js:676-680` is exactly the template the card says does not exist — `posturePoolKey(readinessScore)` returns `` `readiness ${scoreBand(readinessScore)}` `` guarded by `CORPUS['DS-DEF-1'].pools[key]` — and `:752` binds it (`posture: projected(posturePoolKey(settlement?.defenseProfile?.readiness?.score))`), rendered at `src/components/new/tabs/DefenseTab.jsx:138-140`. `scoreBand` (`src/domain/display/defenseScoreBands.js:38-39`) returns `CRITICAL` below twenty. The recovery gap is mechanical, not semantic: the sibling `terrain` pools recover because `TERRAIN_DEFENCE_OF` is a module-level key table, and the four `readiness` pools do not because their key is interpolated from a band function's return — the card prints the same empty `reads` line for `readiness STRONG`, `ADEQUATE` and `WEAK`, which is a per-lens census defect, not four silent pools.

**THE LICENCE THESE ROWS ARE WRITTEN AGAINST**, offered to the chair as the card's corrected body, with every other card line taken as printed:
- `reads:` `defenseProfile.readiness.score` (via `posturePoolKey`)
- `predicate:` `scoreBand(readiness.score) === CRITICAL` (score below twenty); absent or non-numeric is silence, never CRITICAL (the function's own guard)
- `may claim:` that the settlement's readiness band is CRITICAL, as a STANDING fact of the record
- unchanged from the printed card and obeyed throughout: bag `{settlement}` only; **no citation** (`source: (none) · standing SOURCE-UNRESOLVED`, so no provenance move fires anywhere below); no count, no cause, no season, no future, no standpoint, no second fact; no totality over persons.
- the annex's own PROVENANCE FENCE obeyed: the readiness word summarises the five arms and asserts nothing about any one of them, so no face names a wall, a garrison, a militia, a muster, a granary or the watch; `guardEffectivenessDesc` belongs to DS-DEF-3 and is untouched.

**Per face, the clause that licenses each claim.** Every face carries exactly one typed claim — the band, as a STANDING fact (move PRESENT, grammar V1; MOVE-GRAMMAR §1.2 row 1, §2.1 V1) — realised at the variant's own angle. The measure-clauses below are all subjunctive edges of that one fact (A2; R-DA-07's "the edge is subjunctive"), never second facts.

Variant 1 `[ledger]` — claims carried: (a) the band, as the town being effectively undefended; (b) its measure, that no arrangement would slow a serious attempt beyond the time of walking in.
- face 0 (20 words): (a) `may claim` corrected clause, the band as a standing fact. (b) "would meet nothing slower than the walk to its centre" — the same fact as a measurement in words (R-DA-11's licensed comparison), subjunctive (A2). Thread: `{settlement}` → "the town" → "its centre". Close kind: object.
- face 1 (30 words): (a) "amounts to nothing an attempt in force would have to work at" — the band. (b) "Reaching the centre is the whole of the delay" — the measure. Thread: "attempt in force" → "such an attempt". Close kind: condition.
- face 2 (28 words): (a) "Undefended is the plain word for {settlement}" — the band, named as the record's own word. (b) "delayed by the length of the walk and by no arrangement the town keeps" — the measure, closing on the shipped noun. Thread: `{settlement}` → "the town". Close kind: absence.
- face 3 (24 words): (a) "keeps nothing that would answer an attempt" — the band. (b) "would take the time of coming in, and no longer" — the measure. Thread: "an attempt" → "such an attempt". Close kind: prohibition.
- Distinctness: the measure-phrase differs in every face (the walk to its centre · reaching the centre · the length of the walk · the time of coming in), and so does the attacker phrase (a serious attempt · an attempt in force · an attempt made in earnest · an attempt). No face opens as another does; only face 0 opens on the settlement token (R-DA-17), and the second sentence never opens on "There is" (R-DA-07's existential floor, which the shipped row breached).

Variant 2 `[street]` — claims carried: (a) the band, as the edge of what the town could not survive; (b) that the edge bounds what the town provokes and what it does not.
- face 0 (15 words): (a) "What the town could not survive" — the band as a subjunctive edge. (b) "shapes what it provokes and what it leaves alone" — the shipped verb, both sides kept. Single sentence, one joint, no tail. Close kind: prohibition.
- face 1 (18 words): (a)+(b) as one measuring act; "lets the rest alone" keeps the second side. Close kind: prohibition.
- face 2 (22 words): (b) first, (a) last as the passage's one turn outward (§1.4.1). Thread: "Quarrels" → "they" → "Both restraints". Close kind: condition.
- face 3 (22 words): (a) "What would end the town" — the edge, subjunctive. (b) "its dealings stay well inside what it can bear". Close kind: condition.
- **CLAIM-SET DELTA, declared:** the shipped row's frame "The town knows perfectly well" is NOT carried in any face. Two grounds, both independent. (i) The estate holds no field for a settlement's interior — FEELING is a non-move (MOVE-GRAMMAR §1.3: "no field carries motive, belief or mood; the reaction is an ACT"), and R-DA-13's belief-frame floor is EXECUTABLE now and stands. (ii) A1 sibling non-restatement: the co-firing sibling pool `strategic value LOW` already carries a `[street]` row built on the same frame ("The town knows it is not worth taking and has made a kind of peace with the knowledge"), and posture and prize compose on one page. The typed claim — the town's conduct is bounded by an edge — is carried whole in all four faces as the ACT the estate's own law asks for. **If the chair reads the knowing as a claim rather than as the angle's realisation, the delta is a refusal and this variant is banked; it is not a face-level fix, since none of the four faces carries the frame.**
- Slot set: the shipped row carries no slot, so no face carries one (ARCH §2.5: a face whose `{slot}` set differs from the parent's is refused).

Variant 3 `[visitor]` — claims carried: (a) the band, as a stranger reaching the centre unstopped, unchallenged, uncounted.
- face 0 (13 words): the shipped realisation, triad kept once in the pool (R-DA-10 rations the triad; no other face uses one). Close kind: absence.
- face 1 (11 words): the short line (R-DA-05's rhythm-follows-load; the short line exists). The deliberate "unasked … unasked" echo is lawful under §1.4.1 (the echo bound counts facts, not nouns). Close kind: object.
- face 2 (17 words): "Arrival … goes unmarked", then the stranger at the centre. Thread: "Arrival" → "A stranger stands at the centre". Close kind: condition.
- face 3 (15 words): "Passage … is not stopped, and the centre is reached without a word said". Close kind: absence.
- **CLAIM-SET DELTA, declared:** the shipped row's "by anybody at all" is NOT carried. It is a totality over persons, which the card refuses in the line that holds always (`REFUSED COLUMNS, always: a totality over persons`) and which CLERK-LAWS §1.3 licenses only by `closed` on the quantified column, closed nowhere here. Its removal is required rather than permitted — R-DA-15 obeys row 6: an unlicensed count or exemption "is not a claim the pool was entitled to hold (ruling 5 requires its removal — the B-CLAIM bar is not engaged)". Every face therefore states the stranger's passage rather than quantifying over persons; no face contains "nobody", "no one", "anyone" or "all".
- Residual risk named, not cured: "counted" (face 0, the shipped word) asserts that no roll is taken of an arrival, which is an INSTITUTION-shaped negative with no table row behind it. It is kept because A6 keeps the shipped claim; faces 1 to 3 realise the same fact without it, so a refuter's finding on it costs one face and not the variant.

**Walls checked on every face:** no em dash, no exclamation, no digit or number-word asserting a count, no `which`-clause, no question, no citation, no colon or semicolon, no future indicative (every edge subjunctive), no figure, no second-sentence summary or gloss, no verdict or moral close, no reader address, no per-arm claim, no slot outside `{settlement}`, and each face's slot set identical to its parent's.

**REFUSALS**
1. **WHOLE POOL, all three variants, all twelve faces — `may claim: nothing`.** The printed licence card licenses no claim at all, so no lawful face of this pool exists under the rule as written. The rows above are written against the corrected licence stated at the head of these notes; the receipt for the correction is `defenseStateProse.js:676-680` and `:752`, `DefenseTab.jsx:138-140`, `defenseScoreBands.js:38-39`. This is a census-recovery defect that hits all four `readiness` pools of DS-DEF-1 identically and is the chair's to rule; it cannot be cured by a writer, and no further draft round can move it.
2. **Variant 2 — the belief frame is not carried in any face** (grounds above). A refusal only if the chair rules the town's knowing to be a claim of the shipped row rather than the `[street]` angle's realisation of it.
3. No variant is refused for the voice itself; all three are written in place under their own numbers with their tags untouched, and nothing is trimmed.
