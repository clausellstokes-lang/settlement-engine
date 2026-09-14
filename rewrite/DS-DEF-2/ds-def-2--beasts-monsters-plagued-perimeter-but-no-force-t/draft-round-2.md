# DRAFT ROUND 2 — DS-DEF-2 · pool `Beasts & Monsters: plagued, perimeter but NO force to hold it`

Writer seat: Opus 5 (Fable-unvalidated), for the Fable chair. Written under ADDENDUM 14 and `rewrite/recut/CONTRADICTION-TABLE.md`: **a face is LAWFUL unless it CONTRADICTS the record; silence is permission; "the card does not license it" is not a finding.**

**This round answers ONE failing owned measure and is not dry.** The gate's round-1 verdict was a single arm on a single face: `shapes.participialOpenerRate` (over) = 13.62 band-widths on 1 of 12 faces. That face is variant 2's third sub-row, which opened *Coming up to {settlement} out of plagued country, …* — the only sentence in the pool whose first word ended in `-ing`. It is rewritten on a new construction. Six further renderings are lifted for the craft verdict (vocabulary spend and the same-opener repeats), and every round-1 face that carried the gate cleanly and carried a telling particular is kept.

Three variants in, three variants out; vids, order and angle tags unchanged. Twelve renderings, four per semantic variant.

---

## THE ROWS (ready to paste under the pool's heading)

1. `[ledger]` The defences at {settlement} are entered as standing, and under them the roster leaves a blank where a garrison or a militia would be named. That same entry gives the country outside as plagued with creatures.
   - `[face]` No garrison is seated at {settlement} and no militia is raised, and the works stand without either. Their inner face is where the town keeps what it does not leave outside after dark, and the reason is the plagued country.
   - `[face]` Creatures work the country around {settlement}, and the town's answer to them is built work that carries no garrison and no militia. What that answer costs falls on whoever has business outside the works after the light goes.
   - `[face]` Plagued country lies outside {settlement}, and the works that face it carry no garrison and no militia. Who goes out into that country, and how far out, is settled between the people who go.
2. `[visitor]` A stranger at {settlement} is told the hours before anything else, and the works on the way in are good work with no garrison and no militia behind them. The country outside is plagued, and the hours are not a courtesy.
   - `[face]` Animals at {settlement} are brought inside the works before dusk, and a stranger arriving late enough to watch it done has the plagued country explained without asking. The town seats no garrison and raises no militia.
   - `[face]` Nothing leans against the outer face of the works at {settlement}, and a stranger who asks why is given the country outside for an answer. That country is plagued, and the town behind the works keeps no garrison and no militia.
   - `[face]` What stands at {settlement} is built work that no garrison holds and no militia is called to, and the country outside it is plagued. People going out on an errand carry more than the errand needs, and a stranger is not told why.
3. `[unfolding]` The works at {settlement} stand to a plagued country, and the town's arrangements seat neither a garrison nor a militia in them. Outside them the ground is kept clear, and the keeping of it is somebody's work.
   - `[face]` Stores lean against the inner face of the works at {settlement}, and the short way across the town runs along beside them. The country beyond is plagued, and no garrison or militia is seated in the works.
   - `[face]` The country at {settlement} is plagued and the works are sound, and no garrison or militia stands in them. Who decides when everything comes inside is not in the record.
   - `[face]` Water is fetched in company at {settlement}, and the plagued country is the whole of the reason. No garrison is quartered in the works and no militia is raised in the town.

---

## --- NOTES

### The card's clauses, cited short below

- **(a)** `predicate` first leg — `measuredMonsterFamily(config.monsterThreat) === 'plagued'`: **monster activity in the surrounding region, never disease** (F4-05), country-scoped and never a totality over the town.
- **(b)** `predicate` second leg — `standingDefenseForces(settlement).walls.present === true`: something in the `walls` bucket stands.
- **(c)** `predicate` third leg — `garrison.present || militia.present === false`: **no garrison and no militia**, and nothing wider (F1-25 bounds the negation to those two bodies).
- **(slot)** `bag: {settlement: proper}`, FILLED at this block's call sites (`defenseStateProse.js:621`).
- **(silence)** ADDENDUM 14's test: the record neither holds the claim nor denies it, so it is the writer's. The row checked against is named in each case.

### Variant 1 · `[ledger]` — claim set (a) + (b) + (c), entered as the office would enter it

| face | claim | ground |
|---|---|---|
| line | the defences stand and are so entered | **(b)** |
| line | the roster carries no garrison and no militia | **(c)**, stated as the roster's own blank; W24 is struck entire, so the record words are free, and no holder is cited, so F1-24 is clear |
| line | the country outside is plagued with creatures | **(a)** |
| line | the entry, the roster, the blank as the record's furniture | **(silence)** — no keeper named; F1-24 clear |
| f2 | no garrison seated, no militia raised | **(c)** |
| f2 | the works stand | **(b)** |
| f2 | goods are kept against the works' inner face after dark | **(silence)** — no condition, use or wear field exists on any `walls` row this desk reads (`defenseInstitutionBuckets.js:169-182` answers `present`/`count`/`names` only); checked against F4-01 (no decay, no permanence), F2-01 (no quantity), F3-05 (culture-neutral furniture) |
| f2 | the reason is the plagued country | **(a)**, the relation NAMED rather than gestured |
| f3 | creatures work the country | **(a)** |
| f3 | the town's answer is built work | **(b)** |
| f3 | that work carries no garrison and no militia | **(c)** |
| f3 | the cost of the arrangement falls on whoever has business outside after dark | **(silence)** — a class of unnamed persons (ADDENDUM 14 relaxes the person bar; F3-06 clear, no singular tier office implicated); no magnitude (F2-01), no rate (F2-06), no elapsed course (F2-05); a burden, never a pay claim on the upkeep gates (F4-02/03 untouched) |
| f4 | plagued country lies outside | **(a)** |
| f4 | the works face it | **(b)** |
| f4 | they carry no garrison and no militia | **(c)** |
| f4 | who goes out, and how far, is settled between the people who go | **(silence)** — unnamed persons; "how far out" is the open question and not a distance (F2-01 checked) |

### Variant 2 · `[visitor]` — claim set (a) + (b) + (c), met from outside by a stranger

| face | claim | ground |
|---|---|---|
| line | a stranger arrives and is told the hours | **(silence)** — an unnamed stranger and an unnamed teller (W27's stance rules struck; F1-126 clear, no minted name; F3-06 clear). "The hours" names no number, no duration and no frequency: checked against F2-01 and F2-06 |
| line | the works on the way in are good work | **(b)** for the object; **(silence)** for *good* — the engine models no condition, quality or soundness on any wall row this desk reads; only an AGE or DECAY reading would reach F2-07 / F4-01 |
| line | no garrison and no militia behind them | **(c)** |
| line | the country outside is plagued | **(a)** |
| line | the hours are not a courtesy | **(silence)** — the dry note; a standing fact about a practice, no verdict on a body, no rate |
| f2 | animals are brought inside the works before dusk | **(silence)** — no livestock, pen or curfew field exists anywhere this desk reads; a simple habitual present with no rate (F2-06) and no season (F2-02) |
| f2 | the country is plagued, and it is what the practice is about | **(a)** |
| f2 | the works stand | **(b)** |
| f2 | the town seats no garrison and raises no militia | **(c)** |
| f3 | nothing leans against the outer face | **(silence)** — as f2's inner face above; an absence of furniture, never of a body (F1-25 checked: no body is denied) |
| f3 | a stranger asks and is given the country for an answer | **(silence)** — unnamed persons; the answer is withheld in its particulars and closes nothing |
| f3 | that country is plagued | **(a)** |
| f3 | the town behind the works keeps no garrison and no militia | **(b)** + **(c)** |
| f4 | what stands is built work | **(b)** |
| f4 | no garrison holds it and no militia is called to it | **(c)** |
| f4 | the country outside it is plagued | **(a)** |
| f4 | people going out on an errand carry more than the errand needs, and a stranger is not told why | **(silence)** — a class of unnamed persons; a relative comparison with no count in it (F2-01 checked); the reason withheld rather than asserted |

### Variant 3 · `[unfolding]` — claim set (a) + (b) + (c), the arrangement read as a standing matter with a part left open

| face | claim | ground |
|---|---|---|
| line | the works stand to a plagued country | **(b)** + **(a)** |
| line | the town's arrangements seat neither a garrison nor a militia in them | **(c)** |
| line | the ground outside is kept clear, and the keeping of it is somebody's work | **(silence)** — no terrain, approach or clearance field is read here, and no terrain type is named (F1-102 checked); the keeper is unnamed, holds no seated office, and who it is stays open |
| f2 | stores lean against the works' inner face; the short way across the town runs beside them | **(silence)** — the perimeter's civic use is nowhere modelled; F1-19 checked (no warehouse or bonded store is asserted as a building row; these are goods, not an institution) |
| f2 | the country beyond is plagued | **(a)** |
| f2 | no garrison or militia is seated in the works | **(b)** + **(c)** |
| f3 | the country is plagued | **(a)** |
| f3 | the works are sound | **(b)** + **(silence)** for *sound* — a present condition, not an age and not a permanence (F4-01's re-cut wording checked) |
| f3 | no garrison or militia stands in them | **(c)** |
| f3 | who decides when everything comes inside is not in the record | **(silence)** — a GAP in the record, not in the world; no body is denied (F1-25 checked), no office is seated (F3-06 checked) |
| f4 | water is fetched in company, and the plagued country is the whole of the reason | **(a)** for the country; **(silence)** for the practice — unnamed persons, the relation named rather than gestured, no rate and no count |
| f4 | no garrison is quartered in the works and no militia is raised in the town | **(b)** + **(c)** |

---

## THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

| the gate's round-1 row | what it measured | what this round does |
|---|---|---|
| **band depth · `shapes.participialOpenerRate` (over) = 13.62 band-widths on 1 of 12 faces** | `proseFingerprint.js:141` — the rate of sentences whose FIRST word ends in `-ing` and is not in `NOT_PARTICIPLES`. The single hit was variant 2's third sub-row, *Coming up to {settlement} out of plagued country, …*: one of that face's two sentences, so the face read 0.5000 against a band whose ceiling is measured in hundredths. | That face is rebuilt on a different construction and a different first move — **`Nothing leans against the outer face of the works at {settlement}, …`** — with the stranger kept, the arrival kept, and the withheld reason kept. **No sentence in any of the twelve renderings now opens on a word ending in `-ing`**, so the measure reads 0.0000 on every face. |

**The other twenty arms, measured on the twelve renderings before submission** (the same formulas, read off `proseFingerprint.js:120-150`): em dash 0 · exclamation 0 · question 0 · semicolon 0 · colon 0 · parenthesis 0 · `, which` 0 · triad 0 · antithesis 0 · doubled adjective 0 · `There/It is` opener 0 · dialogue 0 · digits 0 · adverbs 0 (round 1 carried one, *carefully*, now cut) · sentences over 30 words 0 · sentences under 8 words 0 · runs of three same-length bands 0 (no face exceeds two sentences) · **same-opener-as-previous 0 on every face** (round 1 carried it on three, all now split) · abstract-noun closers 0. The two arms that carry a value are the pronoun closer (five faces, at the same 0.5 per face that four faces of round 1 carried inside depth) and neighbour variation, which is non-zero on every face but variant 1's fourth, where the two sentences are of equal length as they were in round 1.

## THE CRAFT VERDICT, ANSWERED

The DULL charge is the one a gate cannot see, so it is answered here in its own terms.

1. **The vocabulary spend was the round-1 fault, and it is the fault the owner measured** (168 distinct words against the shipped corpus's 519). Round 1 spent *good work* three times and *the works* in eleven of twelve renderings with almost nothing else in the perimeter's neighbourhood. **This round spends *good work* once**, and puts a different concrete thing in each rendering: the blank on the entry · what is kept against the inner face after dark · creatures working the country · the cost falling on whoever is outside when the light goes · who goes out and how far · the hours · animals in before dusk · nothing leaning on the outer face · what people carry on an errand · the ground kept clear and whose work that is · stores against the inside and the short way running beside them · who decides when everything comes inside · water fetched in company. Thirteen particulars, none repeated.
2. **Twelve distinct constructions, checked at the first two words.** No two renderings share them: *The defences · No garrison · Creatures work · Plagued country · A stranger · Animals at · Nothing leans · What stands · The works · Stores lean · The country · Water is.* No rendering opens on the `{settlement}` proper slot (T-F8). A11's spread rule holds at the pool grain as well as the variant's.
3. **Twelve distinct spellings of the negation**, because the negation is the claim every face must carry and is therefore the likeliest collapse: the roster's blank · *no garrison is seated … no militia is raised* · *built work that carries no garrison and no militia* · *the works that face it carry* · *with no garrison and no militia behind them* · *the town seats … and raises* · *the town behind the works keeps* · *built work that no garrison holds and no militia is called to* · *the arrangements seat neither … nor* · *no garrison or militia is seated in the works* · *no garrison or militia stands in them* · *no garrison is quartered … no militia is raised in the town*.
4. **Every second clause does a job**: cost (v1 f3), consequence landed on a household (v2 f4, v3 f4), contrast of the worked and the unworked (v1 line), voice (v2 line, v2 f3), withholding (v2 f4, v2 f3), and the open matter (v1 f4, v3 line, v3 f3). None restates its first clause; none reassures; none summarises.
5. **Three matters stand open and are not closed**: who goes out and how far (v1 f4), whose work the keeping of the ground is (v3 line), who decides when everything comes inside (v3 f3) — the last of these a gap in the record rather than in the world.
6. **Read (a) is carried by all twelve renderings**, as it was in round 1. Two of the three shipped rows never named the country at all, which the skeleton calls the pool's largest loss of truth, and the sibling pool `Invasion & War: walls with NO force` says the empty perimeter twice more in the same box (`DefenseTab.jsx:150-183`): the plagued country is the only thing this pool can say that its neighbours cannot, so every face says it.

## REFUSALS

**None.** All three variants are written lawful; no variant is banked. Nothing was trimmed: three variants in, three out, in their own order under their own angle tags, four faces apiece, twelve renderings.

## THE WRITER'S OWN CALLS, recorded so a refuter or a refiner can overturn them

1. **No face says *a wall*, *the perimeter*, *the line* or *a gate*, and this is the round's one real craft cost.** The key reads `walls.present` as a boolean and the bucket's reachable rows include `Citadel` (*"Inner fortress. Last refuge in siege."*, `institutionalCatalog.js:1931`) and `Gates (if walled)` (`:1356`). A citadel is inner and a gate is a point, so neither word survives the whole preimage (F1-07), and on a citadel-only town `hasGates` is false and `safetyProfile.js:463-464` prints *"no gates to bribe and no checkpoints to avoid"* on the same dossier (F1-08). Floor 1's quantifier is the preimage, not the skeleton's town, so the gate seam the skeleton calls the pool's richest (§4.1(i)) is left unspent. Every face stands instead on **the works · built work · good work · the defences**, true of stakes at a thorp, stone at a town and masonry at a stripped city alike. *A refiner who judges the citadel-only share unreachable can buy back the gate in one or two faces and should say which share they are betting on.*
2. **No face denies a person.** The negation is spoken only as the two bodies the key reads — *a garrison* and *a militia*, named — never as *nobody*, *no one*, *unmanned*, *no guard* or *nothing organised* (F1-25, the pool's defining trap: a `Town watch` is `required: true` at town with night patrol and gate duty, a `Household levy` may stand at thorp, and four buckets go unread). For the same reason no face says there is no muster: the thorp's `Household levy` musters by its own row (`institutionalCatalog.js:104`).
3. **No face makes a pay claim.** This key reads none of the four upkeep gates; a split purse (F4-02/F4-03) and a total collapse (F4-04) are the two easiest ways to be wrong on this desk. *What that answer costs* in variant 1's third face is a burden on people, not a reading of a gate.
4. **No material, no age, no decay, no permanence** (F1-32, F2-07, F4-01). *Good* and *sound* are present-condition words and are each spent once.
5. **Every trend in the shipped rows stays converted to a standing condition** (§4.2 of the skeleton): *doing less each season* → the ground outside kept clear and whose work that is; *the watch thins* → the roster's blank; *the thinning is not being reversed* → who decides when everything comes inside, not in the record. Four floor-2 breaches left the shipped `[unfolding]` row in round 1 and nothing has been let back in.
6. **The three variants keep three distinct level-1 grammars** (MOVE-GRAMMAR §2.1): variant 1 is PRESENT → GAP (V8), variant 2 is OBJECT/PERSON → PRESENT (V4), variant 3 is PRESENT → OPEN (V6).

## FACE LENGTHS (words, the `{settlement}` slot counted as one)

| variant | line | face 2 | face 3 | face 4 |
|---|---|---|---|---|
| 1 `[ledger]` | 36 | 40 | 38 | 34 |
| 2 `[visitor]` | 41 | 36 | 41 | 43 |
| 3 `[unfolding]` | 37 | 37 | 30 | 32 |

Spread 30–43 words over twelve renderings; the pool totals 445 words.
