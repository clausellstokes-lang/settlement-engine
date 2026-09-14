# DS-DEF-2 · `Invasion & War: walls AND professional garrison` · DRAFT ROUND 2

*Seat: Opus 5 — Fable-unvalidated. Written under brief ADDENDUM 14 (a face is lawful unless it CONTRADICTS the record; silence is permission), the four floors, and `rewrite/recut/CONTRADICTION-TABLE.md`. Three variants rewritten in place under their own vids and their own angle tags; four faces each; nothing added, removed or merged. Round 2 answers the gate's single failing measure and re-spends the vocabulary the re-cut handed back.*

---

## THE ROWS — the complete replacement for the pool's variant rows

1. `[ledger]` The books at {settlement} enter the works and the garrison's pay under one head, and the entry carries the wage with no name against it.
   - `[face]` One purse at {settlement} answers for the upkeep of the fortification and for the wages of the men kept for it, and when it runs short it runs short on both at once.
   - `[face]` Whoever keeps the accounts at {settlement} enters the repair of a defence-work and the wage of the men kept for it against the same sum.
   - `[face]` The garrison at {settlement} is a charge the books carry and a body the books do not name. The record holds the wage, and the defences that wage keeps up.
2. `[visitor]` A stranger prices the defences at {settlement} easily enough. What he cannot weigh from outside is the wage that keeps men for them, and it is the wage that decides whether an attempt is worth making.
   - `[face]` The works at {settlement} are visible to anyone. That they are somebody's paid charge is learned later, and a stranger learns it from the way he is answered.
   - `[face]` What an attempt on {settlement} would cost is set by the defence-work and by the men kept in pay for it, and a stranger reckons the men last.
   - `[face]` Traders who come through {settlement} give the place the same short account: the defences are up, and somebody is paid a living to keep them.
3. `[street]` In this town the argument is not over whether the place could be held. The cost of the men is what gets debated, and their pay and the repairs to the works come off the one purse.
   - `[face]` Repair work on the defences is let out here like any other job, and the men kept under arms draw on the same purse. The purse keeps no order of precedence between them.
   - `[face]` What the defences are worth is not argued here. What the paid men are worth is argued, and it is not argued in front of them.
   - `[face]` The paid men are known here by sight and not by name. What gets discussed is the wage, and the same charge keeps the works in repair.

---
--- NOTES

**REFUSALS: none.** All three variants are written lawful under the four floors. Nothing is banked.

### A. THE GATE'S MEASURE, ANSWERED

| owned measure the gate failed | round 1 | round 2 | how |
|---|---|---|---|
| `shapes.participialOpenerRate` (over) = **28.24 band-widths on 1 of 12 faces** | one sentence in the pool opened on an `-ing` clause: vid 1 face 2, *"Keeping the defences and keeping men in pay are one duty…"* | **0 of 12 faces. Zero sentences in the pool open on a participle or a gerund**, counted over every sentence, not only the first of each face | vid 1 face 2 was rebuilt on a new subject rather than re-ordered: the gerund pair is gone and the subject is now **the purse itself** (*One purse at {settlement} answers for…*), which also carries F4-02 in the engine's own arithmetic instead of asserting it about a clerk |

Measured after the rewrite, over all twelve faces: participle- or gerund-opening sentences **0**; `There is` / `It is` sentence-openers **0** (the fingerprint floor for that shape is 0.000 to 0.006 and round 1 sat at zero; the rebuild did not spend it); em dashes **0**; exclamations **0**; question marks **0**; digits **0**; `which`-clauses **0**; semicolons **0**. Face lengths run 25 to 37 words, and the pool keeps a short line (faces 3 and 8 at 25).

**Not a dry round.** Beyond the failing measure, the round also moved the one verdict the gate cannot see: distinct word types across the twelve faces rise **112 to 132** on 355 tokens (type/token 0.348 to 0.372), and the twelve opening bigrams are now twelve distinct ones with no repeated grammatical subject anywhere in the pool.

### B. THE LICENCE SHORTHAND

- **[CARD]** — the card's `may claim` line: *that `invasionRowSituation(walls, garrison, militia)` selects the row `walls, professional garrison` of `INVASION_ROW_POOL`, as a STANDING fact of the record.*
- **[W]** — the card's read resolved: `standingDefenseForces(settlement).walls.present === true`, a standing, ruin-filtered member of the walls bucket (`defenseInstitutionBuckets.js:84-89`, `:169-182`).
- **[G]** — the card's read resolved: `standingDefenseForces(settlement).garrison.present === true`, a paid standing member of the garrison bucket (`:88-91`). **The WORD "the garrison" is settled lawful wherever the bucket resolves, `Barracks` included, by CONTRADICTION-TABLE §R-3** — round 1 declined to use it and round 2 spends it.
- **[PURSE]** — floor 4's positive model, **F4-02**: ONE multiplier `milUpkeepMult` over *garrison wages, wall maintenance* together (`defenseGenerator.js:182`, `:189-192`). Stating that the two ride one charge is the engine's own arithmetic; splitting them is the breach. **F4-03**: the four gates differ in degree, never in direction. **F4-04**: the licensed extreme is short, late or thin, never none.
- **[DETER]** — floor 4's positive model at `stressGenerator.js:118-125`: walls ×0.6 and a military body ×0.7 on the siege roll, **never to zero**. An attempt is dearer, never impossible.
- **[SILENCE]** — ADDENDUM 14: the record neither carries it nor denies it, and none of the five closed rosters is touched. Silence is permission, and *"the card does not license it"* is not a finding.

### C. STANDING CHOICES THAT BIND EVERY FACE, AND THEIR GROUND

- **The perimeter is named under four heads and never as a ring, a line, a circuit or a material**: *the works* (×4), *the defences* (×5), *the fortification* (×1), *a defence-work* (×2), plus the oblique head *the repair / repair work* where the charge stands for the thing. **F1-07** (a `Citadel` is inner and `Gates (if walled)` is a point; both sit in the walls bucket by substring, and DS-DEF-5 can print the works differently on the same desk) and **F1-32** (the row's own printed description fixes the material: stakes on a `Palisade`, stone on `Town walls`, masonry on a city). ⚠ *The walls* was reconsidered this round and refused again: on a `Citadel`-only or `Gates`-only live roster the bucket reads present while the same dossier's own wall surface can read otherwise, so the word risks an on-page self-contradiction that the generic heads do not. This is the one place the pool's vocabulary is genuinely narrowed by floor 1 rather than by habit, and it is declared here so the refuter can see it was priced.
- **The force is named as *the garrison* (×2, per §R-3), *the men / the paid men / men kept in pay / men kept under arms* (×9) and *somebody paid a living* (×1) — and never as soldiers, an army, a company, a watch or a militia.** **F1-27** (a `Professional city watch` in this bucket is full-time law enforcement, not soldiers), **F1-32**'s shape on a force row (a `Barracks` is housing), **F1-03** and **F1-26** (the key never reads `militia`, and `Citizen militia` carries `exclusiveGroup: 'civilianDefense'`). The paid, standing character rides on *in pay*, *at a wage*, *kept*, *draw*, *a living*, which is what every member of the bucket actually holds.
- **No face stations a body on the works.** **F1-83**: at posture `deployed` the engine's own string is *army committed in the field*. Every face says the men are **kept for** the works, paid, drawn on the books or known by sight. None says they are standing there, and the round-2 wordings were audited for *at them*, *behind them*, *on it*, *to be there*, all of which were drafted and cut.
- **No possessive fixes the employer.** `Garrison` is kept under a noble or royal banner (`institutionVocabulary.js:164`) while `Professional city watch` is the town's own, so the face may not decide which; **F1-121** costs one possessive only where an occupier is on the page, and *the garrison's pay* / *the garrison at {settlement}* are the town's own rostered body, which is what `hasGarrison` reads.
- **No gate, no checkpoint, no entry control, and no road.** `hasGates` does not fire on a `Citadel`-only or `Earthwork`-only roster (`priorityHelpers.js:53`), and where it is false `safetyProfile.js:463-464` prints *no gates to bribe and no checkpoints to avoid* (**F1-08**, which bars the denial as well as the assertion). Round 1's three visitor faces leaned on *the road*; round 2 removes every one, because `config.tradeRouteAccess` and `terrainType` print on the overview and **F1-102** denies an approach the config does not hold.
- **No citation.** The provenance budget allows one, and the skeleton prices it at zero (§0.6): the muster kind's only roster-backed keeper is the `Citizen militia`, which this key never consults, so a cited muster roll is **F1-24** across much of the preimage. The record VOCABULARY is free entire (W24 struck) and is spent hard — *books, entry, head, accounts, sum, charge, wage, purse, precedence, repair, let out* — with nothing attributed to a keeper.
- **No magnitude.** No count of men, no length, no height, no share, no sum of money, no rate, no season, no duration (**F2-01**, **F2-02**, **F2-06**). The only number words in the pool are *one head*, *one purse*, *one sum* and *the one purse*, and each of them states the singleness of the charge, which is **F4-02**'s own model (ONE multiplier) and not a magnitude the read withholds. Round 1's *two charges* was cut this round for being a count with no model behind it.
- **No elapsed course anywhere.** Every verb is the simple habitual present or a subjunctive *would*. No *has stood*, *still*, *no longer*, *since*, *again*, *the last time*, no comparative against an earlier state, no prediction the pulse adjudicates (**F2-05**, **F2-07**, **F2-08**).

### D. VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` — four faces

Stance held: the clerk's view, the work and the men entered as one charge, and the gap in the entry. Level-1 grammar: **PRESENT → GAP**.

- **Face 1, the numbered line** (25 words) — *The books at {settlement} enter the works and the garrison's pay under one head, and the entry carries the wage with no name against it.*
  - a work stands and is a charge → **[W]** + **[CARD]**.
  - a paid standing force, named in the engine's own word → **[G]** + **[CARD]**, with §R-3 as the ground for *the garrison*.
  - the two under one head → **[PURSE]**, F4-02's own pairing of *garrison wages, wall maintenance*.
  - the wage entered with no name against it → **[SILENCE]**. The claim is about what the WAGE ENTRY carries, never about a roll existing anywhere; no field records the names of a garrison's men, and no roster row is denied. Deliberately narrowed off the skeleton's *no roll of them*, because the branch also fires on towns that DO carry a `Citizen militia` and therefore a muster-keeper (**F1-03**, `holderTable.js:279-288`).
- **Face 2** (33 words) — *One purse at {settlement} answers for the upkeep of the fortification and for the wages of the men kept for it, and when it runs short it runs short on both at once.* **← the face the gate failed, rebuilt.**
  - the work, the force, the pairing → **[W]** + **[G]** + **[CARD]**.
  - one purse over both → **[PURSE]** stated as the engine computes it rather than asserted about a person.
  - *when it runs short it runs short on both at once* → **F4-03** in terms: all four gates are monotone in one input and differ in degree, never in direction, so a shortfall can never fall on one half alone. The clause is conditional, not a rate (**F2-06**) and not an assertion that this town's gate bites, since `milUpkeepMult` reaches 1.0 over part of the key's range; and it stops well short of **F4-04**, since nothing is said to be unpaid.
- **Face 3** (25 words) — *Whoever keeps the accounts at {settlement} enters the repair of a defence-work and the wage of the men kept for it against the same sum.*
  - **[W]** + **[G]** + **[CARD]** + **[PURSE]**, in one flat entry with no second clause: the pool's short line.
  - *whoever keeps the accounts* → an UNNAMED person, licensed by name in the re-cut (W22a/W22b struck; the office column "is OPEN and STAYS OPEN"). **F3-06** cleared deliberately: this is not the Guard Captain and not *the officer who signs for the wages*, but a bookkeeper, an office the tier does not seat among Mayor, Guard Captain, High Priest and Corrupt Official.
  - *to be kept in repair* is maintenance, the engine's own word, and asserts neither a decay clock nor the permanence of a row (**F4-01** in both directions).
- **Face 4** (30 words) — *The garrison at {settlement} is a charge the books carry and a body the books do not name. The record holds the wage, and the defences that wage keeps up.*
  - the garrison as a standing rostered body → **[G]** + **[CARD]** + §R-3.
  - a body the books do not name → **[SILENCE]**, the same narrow claim as face 1 in a different construction: what the ENTRY holds, never what exists.
  - the wage keeping the defences up → **[W]** + **[PURSE]**, the one purse in its plainest English, and a present duty rather than a permanence claim (**F4-01**).

### E. VARIANT 2 · vid 2 · `[visitor]` · slots `{settlement}` — four faces

Stance held: what an outsider reads off the place unaided, and what the reading costs him. Level-1 grammar: **PRESENT → CONSEQUENCE (structural)**. No named thing, no furnished approach (**F3-05**: no defense pool reads the culture profile, so nothing is thatched, hearthed, greened or snowed), no terrain and no road (**F1-102**).

- **Face 1, the numbered line** (36 words) — *A stranger prices the defences at {settlement} easily enough. What he cannot weigh from outside is the wage that keeps men for them, and it is the wage that decides whether an attempt is worth making.*
  - the work is legible from outside → **[W]** + **[SILENCE]** (what a stranger notices is no field's business, and W27's stance rules are struck entire).
  - the wage keeps men → **[G]** + **[CARD]**.
  - the wage decides *whether an attempt is worth making* → **[DETER]**, held as a judgment inside an unnamed person rather than an outcome asserted of the world: dearer, never impossible, which is exactly ×0.6 and ×0.7 and is why no face reaches for *nothing takes this town* (**F1-34**).
  - the stranger is unnamed and meets nothing named (**F1-126**).
- **Face 2** (28 words) — *The works at {settlement} are visible to anyone. That they are somebody's paid charge is learned later, and a stranger learns it from the way he is answered.*
  - **[W]**, **[G]**, **[CARD]**, the pairing carried by *somebody's paid charge*.
  - *the way he is answered* → **[SILENCE]**, and it is the face that reaches for the skeleton's §2.8 texture (a town that keeps professionals is a town a stranger is processed by) **without** a gate, a gatekeeper or a body at a post: **F1-08** and **F1-83** both cleared, and the answering is done by an unnamed plural, never by the tier's one Guard Captain (**F3-06**).
- **Face 3** (28 words) — *What an attempt on {settlement} would cost is set by the defence-work and by the men kept in pay for it, and a stranger reckons the men last.*
  - the doubled cost → **[W]** + **[G]** + **[DETER]**.
  - the subjunctive *would* is the only licensed reach at an outcome; *will cost* is **F2-05** and *could not be taken* is additionally **F1-34**.
  - *reckons the men last* → **[SILENCE]**, and it leaves the unit's matter standing open with no ordinal over events and no count: the second thing is named by its object, never by a number.
- **Face 4** (25 words) — *Traders who come through {settlement} give the place the same short account: the defences are up, and somebody is paid a living to keep them.*
  - attribution to a CLASS of witness, never to acquaintance, and never *it is said*.
  - the works are up → **[W]**; a paid living → **[G]**, since a livelihood is the bucket's own professional character and *a living* names no office the roster seats.
  - the colon is the pool's only one, and this is its only aside.

### F. VARIANT 3 · vid 3 · `[street]` · slots NONE — four faces

Stance held: the town's own talk, and the things it settles without discussing. **No slot, no proper name, no tier word** (**F1-31**), **no totality over persons** (the card's refused column), **no elapsed course** (**F2-05**, the street voice's first reach: every *has held*, *still*, *the last time* kept out). Level-1 grammar: **PRESENT → OPEN**.

- **Face 1, the numbered line** (37 words) — *In this town the argument is not over whether the place could be held. The cost of the men is what gets debated, and their pay and the repairs to the works come off the one purse.*
  - a work stands and paid men are kept → **[W]** + **[G]** + **[CARD]**.
  - *could be held* → the capability clause the block's own fence names, subjunctive, computed by **[DETER]**. Never *will hold*, never *cannot be taken*.
  - the cost argued and the capability not → the sibling-licensed CONTRAST (the key `militia only` and `neither walls nor force` name the rejected alternatives), unfronted and not the closing move; it is the only contrast in the pool.
  - one purse for pay and repairs → **[PURSE]**. No shortfall asserted in either direction.
  - *the argument in this town* is a civic fact and not a claim about every person: the refused totality column is respected, here and in all four faces.
- **Face 2** (33 words) — *Repair work on the defences is let out here like any other job, and the men kept under arms draw on the same purse. The purse keeps no order of precedence between them.*
  - **[W]** + **[G]** + **[CARD]** + **[PURSE]**, with the craft lexicon the exemplar pack names for this desk (the work let out, the contract, the purse) rather than a thesaurus.
  - *no order of precedence* → **F4-02** and **F4-03** stated from the purse's side: the direction can never be split, so the precedence the sentence denies is a precedence the engine does not offer.
  - round 1's face here rested on unbarred doors at night; it was cut this round because the key reads no safety field and the preimage includes towns whose own page prints *The garrison is overwhelmed or corrupt* and *a formality: present on paper, absent in practice* (`safetyProfile.js:296`, `:306`).
- **Face 3** (26 words) — *What the defences are worth is not argued here. What the paid men are worth is argued, and it is not argued in front of them.*
  - **[W]** + **[G]** + **[CARD]**.
  - the town's reliance rests on the ARRANGEMENT and not on the men's quality: this is the face written to survive the whole preimage, since `safetyProfile.js` prints *The garrison patrols the main paths* (`:288`), *overwhelmed or corrupt* (`:296`) and *a formality* (`:306`) across this key's range, and a face that praised the force would be refutable on part of it. The face takes no side, and says only that the question is live.
  - *not argued in front of them* → **[SILENCE]**, impersonal, no totality, no named person, no office the tier seats.
- **Face 4** (27 words) — *The paid men are known here by sight and not by name. What gets discussed is the wage, and the same charge keeps the works in repair.*
  - **[G]** + **[W]** + **[CARD]** + **[PURSE]**.
  - *known by sight and not by name* → **[SILENCE]**, the skeleton's §3.8 flavour taken at the street grain, and the third construction in the pool for the one standing gap, each in a different voice: the entry with no name against it, the body the books do not name, the men known by sight.
  - the totality is dodged in the wording: *the paid men are known here* is a civic fact, where *nobody here knows their names* would be the refused column.

### G. THE POOL AS A WHOLE

- **The discriminating claim survives in all twelve.** A standing work AND a paid standing force, together, in every face. No face is claim-identical to `walls with NO force`, `force with NO walls`, `walls with citizen militia`, `militia only` or `neither walls nor force`.
- **The four claims the skeleton bars are gone in every spelling**: no siege prediction, no stores condition, no `which`-clause, no body stationed on the works.
- **The DULL check, at the pool grain.** Twelve grammatical subjects, no two alike: the books · one purse · whoever keeps the accounts · the garrison · a stranger · the works · what an attempt would cost · traders · the argument · repair work · what the defences are worth · the paid men. Twelve distinct opening bigrams. Landing nouns: *it · once · sum · up · making · answered · last · them · purse · precedence · them · repair*. Constructions: two flat entries, one fronted interrogative-clause subject (×2, in different variants and different tenses), one appraisal, one colon-aside, one class-of-witness report, two conduct sentences, one denial-and-counter pair. Round 1's collapse risk was a single economic register spread over all twelve; this round adds the contract and the trade (*let out*, *like any other job*, *a living*, *traders*), the person (*whoever keeps the accounts*), and the appraisal (*prices*, *weigh*, *reckons*) as three vocabularies the ledger does not own.
- **Three angles, three different things the pairing IS**, per §4 of the skeleton: `[ledger]` one charge and a body the entry does not name; `[visitor]` a work read from outside and a wage that cannot be read from outside; `[street]` a settled capability and an unsettled cost. No two rows could swap angles unnoticed.
- **The thread.** This pool is a SPINE with zero modifier mounts today, so each face hands a noun forward that a modifier could take up (the wage, the purse, the works, the men, the charge, the argument) and closes on a standing fact rather than a set-up. Every face reads alone, and every face reads as an opener.
- **The page fact.** No face opens on the works in the words the `Beasts & Monsters` paragraph above can use; nine of the twelve open on something other than the perimeter noun entirely (the books, a purse, a bookkeeper, the garrison, a stranger, an attempt's cost, traders, the argument, the paid men), and only three open on it.
