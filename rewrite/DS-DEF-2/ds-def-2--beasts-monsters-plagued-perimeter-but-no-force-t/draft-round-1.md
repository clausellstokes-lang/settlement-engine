# DRAFT ROUND 1 — DS-DEF-2 · pool `Beasts & Monsters: plagued, perimeter but NO force to hold it`

Writer seat: Opus 5 (Fable-unvalidated), for the Fable chair. Written under ADDENDUM 14 and `rewrite/recut/CONTRADICTION-TABLE.md`: **a face is LAWFUL unless it CONTRADICTS the record; silence is permission; "the card does not license it" is not a finding.**

Three variants in, three variants out; vids, order and angle tags unchanged. Each variant carries its numbered line plus three `[face]` sub-rows — twelve renderings, four per semantic variant.

---

## THE ROWS (ready to paste under the pool's heading)

1. `[ledger]` The defences at {settlement} are entered as standing, and under them the roster leaves a blank where a garrison or a militia would be named. The same entry has the country outside plagued with creatures.
   - `[face]` No garrison is seated at {settlement} and no militia is raised, and the works stand without either. Their inner face is where the town keeps what it does not leave outside after dark, and the reason is the plagued country.
   - `[face]` Creatures work the country around {settlement}, and the town answers with built work. Neither a garrison nor a militia is seated behind the built work.
   - `[face]` Plagued country lies outside {settlement}, and the works that face it carry no garrison and no militia. Who goes out into that country, and how far out, is settled between the people who go.
2. `[visitor]` A stranger walking in at {settlement} is told the hours before anything else, and the works on the way are good work with no garrison and no militia behind them. The country outside is plagued, and the hours are kept as carefully as the works.
   - `[face]` The animals at {settlement} are brought inside the works before dusk, and a stranger arriving late enough to watch it done has the plagued country explained without asking. The town seats no garrison and raises no militia.
   - `[face]` Coming up to {settlement} out of plagued country, a stranger meets works that are good and a town that has neither a garrison nor a militia. Nothing is left stacked against the outer face, and the reason is not explained to strangers.
   - `[face]` Good work stands at {settlement} with no garrison in it and no militia, and the country outside is plagued. People going out on an errand carry more than the errand needs, and a stranger is not told why.
3. `[unfolding]` The works at {settlement} stand to a plagued country, and the town's arrangements seat neither a garrison nor a militia in them. The ground outside is kept clear, and the keeping of it is somebody's work.
   - `[face]` Stores lean against the inner face of the works at {settlement}, and the short way across the town runs along beside them. The roster shows no garrison and no militia, and the country outside is plagued.
   - `[face]` The country at {settlement} is plagued and the works are sound, and the town seats neither a garrison nor a militia in them. Who decides when everything comes inside is not in the record.
   - `[face]` Neither a garrison nor a militia stands to the works at {settlement}, and the works are good work. Water is fetched in company, and the plagued country is the reason.

---

## --- NOTES

### The card's three clauses, cited short below

- **(a)** `predicate` / `may claim` — the reader selects the row `plagued country, perimeter without force`, first leg: `measuredMonsterFamily(config.monsterThreat) === 'plagued'`, **monster activity in the surrounding region, never disease** (F4-05).
- **(b)** same predicate, second leg: `standingDefenseForces(settlement).walls.present === true` — something in the `walls` bucket stands.
- **(c)** same predicate, third leg: `garrison.present || militia.present === false` — **no garrison and no militia**, and nothing wider (F1-25 bounds the negation).
- **(slot)** `bag: {settlement: proper}`, FILLED at this block's call sites.
- **(silence)** ADDENDUM 14's floor test: the record neither holds nor denies it. The row checked against is named in each case.

### Variant 1 · `[ledger]` — claim set: (a) + (b) + (c), entered as the office would enter it

| face | claim | ground |
|---|---|---|
| line | the defences stand | **(b)** |
| line | the roster carries no garrison and no militia | **(c)**, stated as the roster's own blank; the record-word licence is W24-struck-open, and no keeper is named, so F1-24 is clear |
| line | the country outside is plagued with creatures | **(a)** |
| line | the entry, the roster, the page as the record's furniture | **(silence)** — W24 struck entire; no holder cited, F1-24 clear |
| f2 | no garrison is seated, no militia is raised | **(c)** |
| f2 | the works stand | **(b)** |
| f2 | the town keeps goods against the works' inner face after dark | **(silence)** — no condition, use or wear field exists on any `walls` row this desk reads (`defenseInstitutionBuckets.js:169-182` answers `present`/`count`/`names` only); checked against F4-01 (no decay asserted), F2-01 (no quantity), F3-05 (culture-neutral furniture) |
| f2 | the reason is the plagued country | **(a)**, with the relation named rather than gestured |
| f3 | creatures work the country | **(a)** |
| f3 | the town's answer is built work | **(b)** |
| f3 | neither a garrison nor a militia is seated behind it | **(c)** |
| f4 | plagued country lies outside | **(a)** |
| f4 | the works face it | **(b)** |
| f4 | they carry no garrison and no militia | **(c)** |
| f4 | who goes out, and how far, is settled between the people who go | **(silence)** — unnamed persons of no seated office may act (ADDENDUM 14 relaxes W22; F3-06 clear because no singular tier office is implicated); no magnitude is spoken, "how far out" is the open question and not a distance |

### Variant 2 · `[visitor]` — claim set: (a) + (b) + (c), met from outside by a stranger

| face | claim | ground |
|---|---|---|
| line | a stranger arrives and is told the hours | **(silence)** — an unnamed stranger and an unnamed teller; F1-126 clear (no minted name), F3-06 clear |
| line | the works on the way are good work | **(b)** for the object; **(silence)** for *good* — the engine models no condition, quality or soundness on any wall row this desk reads, and only an AGE or DECAY reading would reach F2-07 / F4-01 |
| line | no garrison and no militia behind them | **(c)** |
| line | the country outside is plagued | **(a)** |
| line | the hours are kept as carefully as the works | **(silence)** — a comparison stated as a measurement in words, no rate word and no frequency (checked against F2-06) |
| f2 | the animals are brought inside the works before dusk | **(silence)** — no livestock, pen or curfew field exists; a habitual present, no rate (F2-06), no season (F2-02) |
| f2 | the country is plagued | **(a)** |
| f2 | the works stand | **(b)** |
| f2 | the town seats no garrison and raises no militia | **(c)** |
| f3 | the stranger comes out of plagued country | **(a)** |
| f3 | the works are good | **(b)** + **(silence)** as the line above |
| f3 | the town has neither a garrison nor a militia | **(c)** |
| f3 | nothing is left stacked against the outer face, and the reason is not explained to strangers | **(silence)** — the withheld reason invents nothing and closes nothing; checked against F1-30 (no body is denied), F2-04 (no event) |
| f4 | good work stands, with no garrison in it and no militia | **(b)** + **(c)** |
| f4 | the country outside is plagued | **(a)** |
| f4 | people going out on an errand carry more than the errand needs, and a stranger is not told why | **(silence)** — a class of unnamed persons, a relative comparison with no count in it (F2-01 checked), the reason withheld rather than asserted |

### Variant 3 · `[unfolding]` — claim set: (a) + (b) + (c), the arrangement read as a standing matter with a part left open

| face | claim | ground |
|---|---|---|
| line | the works stand to a plagued country | **(b)** + **(a)** |
| line | the town's arrangements seat neither a garrison nor a militia in them | **(c)** |
| line | the ground outside is kept clear, and the keeping of it is somebody's work | **(silence)** — no terrain, approach or clearance field is read here (F1-102 checked: no terrain type is named); the keeper is unnamed, holds no seated office, and the question of who is left standing open |
| f2 | stores lean against the works' inner face; the short way across the town runs beside them | **(silence)** — the perimeter's civic use is nowhere modelled; F1-19 checked (no warehouse or bonded store is asserted as a building; these are goods, not a row) |
| f2 | the roster shows no garrison and no militia | **(c)** |
| f2 | the country outside is plagued | **(a)** |
| f3 | the country is plagued | **(a)** |
| f3 | the works are sound | **(b)** + **(silence)** for *sound*, as above; it asserts a present condition and not permanence (F4-01's re-cut wording checked) |
| f3 | the town seats neither a garrison nor a militia | **(c)** |
| f3 | who decides when everything comes inside is not in the record | **(silence)** — a GAP in the record, not in the world; no body is denied (F1-25 checked), no office is seated (F3-06 checked) |
| f4 | neither a garrison nor a militia stands to the works | **(c)** |
| f4 | the works are good work | **(b)** + **(silence)** as above |
| f4 | water is fetched in company, and the plagued country is the reason | **(a)** for the country; **(silence)** for the practice — a class of unnamed persons, the relation named rather than gestured, no rate and no count |

---

## REFUSALS

**None.** All three variants are written lawful; no variant is banked. Nothing was trimmed: three variants in, three out, in their own order under their own angle tags, four faces apiece.

---

## THE WRITER'S OWN CALLS, recorded so a refuter or a refiner can overturn them

1. **No face says "a wall", "the perimeter", "the line" or "a gate."** The key reads `walls.present` as a boolean, and the bucket's reachable rows include `Citadel` (*"Inner fortress. Last refuge in siege."*, `institutionalCatalog.js:1931`) and `Gates (if walled)` (`:1356`). A citadel is inner and a gate is a point, so neither word survives the whole preimage (F1-07), and `hasGates` does not fire on a citadel-only town, where `safetyProfile.js:463-464` prints *"no gates to bribe and no checkpoints to avoid"* (F1-08). Every face therefore stands on **the works · built work · good work · the defences**, which are true of stakes at a thorp, stone at a town and masonry at a stripped city alike. The cost is the gate imagery the skeleton's §4.1(i) recommends; the gain is that no face is false anywhere in the preimage. *A refiner who judges the citadel-only share unreachable can buy back the gate in one or two faces.*
2. **No face denies a person.** The negation is spoken only as the two bodies the key actually reads — *a garrison* and *a militia*, named — never as "nobody", "no one", "unmanned", "no guard" or "nothing organised" (F1-25, the pool's defining trap; a `Town watch` is `required: true` at town with night patrol and gate duty, a `Household levy` may stand at thorp, and four buckets go unread). For the same reason no face says "there is no muster": the thorp's `Household levy` musters by its own row (`institutionalCatalog.js:104`) and W-02 forbids denying it here.
3. **No face makes a pay claim.** This key reads none of the four upkeep gates; a split purse (F4-02/F4-03) and a total collapse (F4-04) are the two easiest ways to be wrong on this desk, and the gates are not this pool's to spend.
4. **No material, no age, no decay, no permanence.** F1-32 fixes the material per row and no word survives the boolean; F4-01's re-cut bars both the rotting wall and the everlasting one. *Good* and *sound* are present-condition words only.
5. **Every trend in the shipped rows is converted to a standing condition**, per the CONTRADICTION-TABLE's own conversion: *doing less each season* → the ground outside kept clear and whose work that is; *the watch thins* → the roster's blank; *the thinning is not being reversed* → who decides when everything comes inside, not in the record. Four floor-2 breaches leave the `[unfolding]` row and nothing replaces them with a softer trend word.
6. **The pool now carries read (a) in all twelve renderings.** Two of the three shipped rows never named the country at all, which the skeleton calls the pool's largest loss of truth; and since `Invasion & War: walls with NO force` says the empty perimeter twice more in the same box (`DefenseTab.jsx:150-183`), the plagued country is the only thing this pool can say that its neighbours cannot.
7. **Twelve distinct openers, twelve distinct first constructions.** The particulars are thirteen and none repeats: the blank on the entry · what is kept against the inner face after dark · creatures working the country · who goes out and how far · the hours · the animals in before dusk · nothing stacked against the outer face · what people carry on an errand · the ground kept clear · the stores leaning on the inside · the short way across the town · who decides when everything comes inside · water fetched in company. No face opens on the `{settlement}` proper slot (T-F8). No em dash, no exclamation mark, no digit, no `which`-clause, no face longer than two sentences.

## FACE LENGTHS (words, slot counted as one)

| variant | line | face 2 | face 3 | face 4 |
|---|---|---|---|---|
| 1 `[ledger]` | 35 | 40 | 25 | 34 |
| 2 `[visitor]` | 45 | 37 | 42 | 38 |
| 3 `[unfolding]` | 36 | 36 | 34 | 30 |

Spread 25–45 words; no two faces of one variant share a length band and a grammar.
