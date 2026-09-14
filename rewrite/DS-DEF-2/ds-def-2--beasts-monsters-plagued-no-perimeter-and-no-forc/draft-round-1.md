# DRAFT ROUND 1 — DS-DEF-2 · pool `Beasts & Monsters: plagued, NO perimeter and NO force`

Seat: WRITER (Opus 5, Fable-unvalidated), for the Fable chair. Written under **ADDENDUM 14** (a face is lawful unless it contradicts the record; silence is permission), the four floors, and `rewrite/recut/CONTRADICTION-TABLE.md`. Three variants, in place, same vids, same angle tags. Four faces each (the numbered line plus three `[face]` sub-rows). Twelve renderings. Nothing added, nothing merged, nothing trimmed.

**Paste-ready rows follow.**

---

1. `[ledger]` Under this heading the record gives {settlement} a country thick with creatures, no wall to the town and no garrison or muster of its own. It gives nothing after that.
   - `[face]` Nothing is drawn round {settlement}, and no garrison or muster stands inside it. The beasts that work the open ground come up to the doors of the houses.
   - `[face]` At {settlement} the stock comes in close at dark. The town has no wall for it to come in behind, no garrison, no muster, and a country outside full of things that feed on it.
   - `[face]` The ground runs up to {settlement} on every side with nothing to stop at, no garrison or muster is kept here, and whose business it is to meet what walks in off a plagued country is not settled in the town.
2. `[street]` What {settlement} does about the beasts in the country is done door by door, with no wall to stand on and no garrison or muster to turn out. In the town it is spoken of as an arrangement.
   - `[face]` The argument at {settlement} is whose stock is loose in the road once the light goes, and not what a loose animal draws in from the fields. With no wall to shut and no garrison or muster to call, the argument is what fills the evening.
   - `[face]` Something heard in the fields at night is a household matter at {settlement}. No line runs round the town, no garrison sits in it, no muster comes out of it, and what is heard out there is not always stock.
   - `[face]` That {settlement} has no wall, no garrison and no muster is not a thing the town discusses. What is in the country after dark, it discusses.
3. `[visitor]` A stranger arriving at {settlement} crosses nothing to get in and cannot say afterwards where the town begins. No garrison quarters here and no muster is called, and beasts work the country on every side.
   - `[face]` The wall a stranger looks for at {settlement} is not there, and the garrison and the muster asked after go the same way. What is out in the fields beyond the last houses is told at length by whoever is asked.
   - `[face]` The way into {settlement} is not arranged as though anything were to be stopped on it: no wall crosses it, no garrison watches it, no muster forms on it. The creatures of the country use it as freely as anybody with business on it.
   - `[face]` A house with room in it takes a stranger in at {settlement}, and the shutter is barred from the inside. The town keeps no wall, no garrison and no muster, and what moves in the country when the houses are shut is the shutter's business.

--- NOTES

**The card's clauses, named once and cited by letter below.**

- **(R1)** `reads` / `predicate` — `beastsRowSituation(family, perimeter, force) === 'plagued country, neither'`, `defenseStateProse.js:429-441`. It resolves to three facts, and every face states all three:
  - **(R1a)** `family = 'plagued'` — the country around THIS settlement is pressed by creatures (`MONSTER_FAMILY_OF`, `:279-284`, `:331-335`). Monsters, never disease (floor 4, **F4-05**).
  - **(R1b)** `perimeter = false` — `standingDefenseForces(settlement).walls.present === false` over the closed keyword list `wall · citadel · palisade · earthwork · inner citadel · massive walls` (`defenseInstitutionBuckets.js:84-88`, call site `:655`).
  - **(R1c)** `force = false` — `(garrison.present || militia.present) === false` (`:625-626`, `:655`). **Scoped to those two buckets only**; the watch, mercenary, charter and arcane buckets are NOT read by this key and are left standing in every face.
- **(R2)** `bag` — `{settlement}` is the one slot filled at this block's call sites. No face writes `{band}` or `{route}`.
- **(R3)** `source: muster · standing LICENSED`, provenance ceiling one citation per unit (§24). **No face spends it**: with the militia absent, a cited muster ROLL would be **F1-03** / **F1-24**, so the muster appears only as the class word in a denial.
- **(R4)** **ADDENDUM 14, the floor test** — everything a face holds beyond (R1) is licensed by the record's silence. Each such claim is listed below with the floors it was checked against.

---

### VARIANT 1 · `[ledger]` — the office's flat entry

**Claim set carried by all four faces:** (R1a) + (R1b) + (R1c). **Dropped from the shipped row** (contradicted, not "unlicensed"): "nothing organized" (**C-2 / F4-18** — the watch, mercenary, charter and arcane buckets), "no specialist recourse" (**C-1 / F1-06** — `forces.charter.present`, and `institutionProbability.js:197-199` gives the charter hall a five-fold chance in a plagued country), "no force" unqualified (**C-3**), "survival rests on terrain" (**C-6 / F4-07** — `TERRAIN_DEFENCE_OF` reads `terrain EXPOSED` on Plains and Desert), "rests on distance" (a field this key does not read). **Kept from the shipped row:** the flat ledger entry, the absent perimeter named by its function rather than its fabric, and the settled rather than emergency register.

| face | claim | licence |
|---|---|---|
| 1 | a country thick with creatures | **R1a** |
| 1 | no wall to the town | **R1b** |
| 1 | no garrison or muster of its own | **R1c** |
| 1 | the record holds nothing further under this heading | **R4** — the ABSENCE move, class (b) GAP, written of the RECORD and never of the world (R-DA-08; MOVE-GRAMMAR §1.2 row 11). It asserts no missing body, so it reaches no closed roster. |
| 2 | nothing is drawn round the settlement | **R1b** |
| 2 | no garrison or muster stands inside it | **R1c** |
| 2 | beasts work the open ground | **R1a** |
| 2 | they come up to the doors of the houses | **R4** — a standing habit of the creatures and a household fact. Floor 1: no roster row, flag or bucket speaks to doors or houses. Floor 2: simple habitual present, no count, no course. Floor 4: not the works, not a readiness explanation (**F4-06**). |
| 3 | the stock comes in close at dark | **R4** — the household defence the record neither carries nor denies; the owner's own licensed instrument (the simple habitual present). No rate word (**F2-06**), no count (**F2-01**). |
| 3 | no wall for it to come in behind | **R1b** |
| 3 | no garrison, no muster | **R1c** |
| 3 | a country outside full of things that feed on it | **R1a**, at the grain a person meets it |
| 4 | the ground runs up on every side with nothing to stop at | **R1b** — the perimeter stated as the absent EDGE, which asserts no member of the `wall` keyword class (**C-5 / F1-07**) and no gate (**F1-08** avoided entirely, both directions). |
| 4 | no garrison or muster is kept here | **R1c** |
| 4 | what walks in off a plagued country | **R1a** |
| 4 | whose business it is to meet it is not settled in the town | **R4** — the OPEN QUESTION move (MOVE-GRAMMAR §1.2 row 10), declarative. Floor 1: it denies no body — it says the town has not agreed, not that nothing exists, so the charter hall, watch and mercenary company are untouched (**C-4** deliberately not walked). Floor 2: simple present, not the perfect. |

### VARIANT 2 · `[street]` — what is said and done in the town

**Claim set carried by all four faces:** (R1a) + (R1b) + (R1c). **Dropped:** "the town does not defend itself" (**C-2 / F4-18**, the shape DS-DEF-5 lens 2 refuses to print in this very state, `defenseStateProse.js:1260-1265`), "hope the pressure goes around it" (a mood; no field carries motive — MOVE-GRAMMAR §1.3 FEELING), "understood by everyone in it" (a totality over persons — the card's REFUSED COLUMNS, **C-8**). **Kept:** the arrangement read as settled rather than as an emergency, which is the shipped row's one good instinct, and the movement.

| face | claim | licence |
|---|---|---|
| 1 | the beasts in the country | **R1a** |
| 1 | what the town does is done door by door | **R4** — the private defence. It asserts no body and denies none, so it sweeps nothing (the pool's live defect, avoided). Floor 3: no named person, no singular tier office (**F3-06**). |
| 1 | no wall to stand on | **R1b** |
| 1 | no garrison or muster to turn out | **R1c** |
| 1 | in the town it is spoken of as an arrangement | **R4** — institution presence is a STANDING fact (the annex's PROVENANCE fence), so a standing arrangement is the right tense; floor 4 checked against **F4-05**'s warning that a cowed, sickened `plagued` town contradicts `safetyProfile.js:276`. |
| 2 | whose stock is loose in the road once the light goes | **R4** — the COMPLAINED-OF door. No field speaks to stock in the road; floor 2 clear (a habit, not a rate or a date). |
| 2 | what a loose animal draws in from the fields | **R1a** |
| 2 | no wall to shut | **R1b** |
| 2 | no garrison or muster to call | **R1c** |
| 2 | the argument is what fills the evening | **R4** — an open civic matter, unsettled and left unsettled. Denies no body. |
| 3 | something heard in the fields at night is a household matter | **R4** + **R1a** (what is heard is the country's creatures). "A household matter" is a statement about where the answering happens, not a denial that any body exists. |
| 3 | no line runs round the town | **R1b** |
| 3 | no garrison sits in it, no muster comes out of it | **R1c** |
| 3 | what is heard out there is not always stock | **R1a**, by the withholding form |
| 4 | no wall, no garrison and no muster | **R1b** + **R1c** |
| 4 | the town does not discuss it | **R4** — a standing civic habit; no totality over persons (the subject is the town as a body, the form the estate uses throughout). |
| 4 | what is in the country after dark, it discusses | **R1a** |

### VARIANT 3 · `[visitor]` — what a stranger meets on the ground

**Claim set carried by all four faces:** (R1a) + (R1b) + (R1c). **Dropped:** "understands the danger" and "before anybody explains it" (a stranger's interior plus a negative totality — R-DA-14 / NL-5's seen-not-meant, **C-8**), "nothing about the place is arranged as though danger were expected to be met" (**C-4 / F1-06** — a charter hall is precisely an arrangement for meeting this danger, and the totality also reaches every non-defence institution the roster carries). **Kept and re-scoped:** the subjunctive "arranged as though … were to be" (R-DA-07's subjunctive edge; a capability clause, never a historical one), now scoped to the way in and the line, and the stranger's arrival as the opener.

| face | claim | licence |
|---|---|---|
| 1 | a stranger crosses nothing to get in, and cannot say where the town begins | **R1b** — the absent perimeter met as the absent EDGE. Floor 2: present tense, and it asserts neither that the town never built (**C-7**) nor that it lost anything. |
| 1 | no garrison quarters here and no muster is called | **R1c** |
| 1 | beasts work the country on every side | **R1a** |
| 2 | the wall a stranger looks for is not there | **R1b** |
| 2 | the garrison and the muster asked after go the same way | **R1c** — the denial is carried by the two buckets the key reads, by name, and reaches no other. |
| 2 | what is out in the fields beyond the last houses | **R1a** |
| 2 | it is told at length by whoever is asked | **R4** — an unnamed person acting, expressly licensed by ADDENDUM 14 floor 3 and the struck W22. Plural and unnamed, so it is not the tier's singular Guard Captain (**F3-06**), and it mints no proper name. |
| 3 | the way in is not arranged as though anything were to be stopped on it | **R1b** — scoped to the line and the way in; it does not say the town is unarranged (the **C-4** sweep, avoided). |
| 3 | no wall crosses it | **R1b** |
| 3 | no garrison watches it, no muster forms on it | **R1c** |
| 3 | the creatures use it as freely as anybody with business on it | **R1a** + **R4**. A comparison stated as a measurement in words, not a figure (R-DA-11). |
| 4 | a house with room in it takes a stranger in | **R4** — no field speaks to lodging; floor 3 checked: no name, no singular office. |
| 4 | the shutter is barred from the inside | **R4** — the telling particular. Floor 1: a shutter is no member of the `wall` bucket (`defenseInstitutionBuckets.js:84-88`), so it substitutes for no perimeter (**C-5**). Floor 4: no decay clock and no permanence asserted (**F4-01**). |
| 4 | no wall, no garrison and no muster | **R1b** + **R1c** |
| 4 | what moves in the country when the houses are shut | **R1a** |

---

### REFUSALS

**None.** All three variants are written and all twelve faces are lawful on this seat's reading. No variant needed a refusal row.

### THE CHECKS THIS SEAT RAN, AND WHAT THEY FOUND

**Mechanical (all twelve faces):** no em dash, no exclamation mark, no digit, no percent, no `which`. Only `{settlement}` is written; `{band}` and `{route}` appear nowhere. One bracketed angle tag per numbered line, unchanged from the shipped row; no `[plain]` anywhere. Three `[face]` sub-rows per variant, twelve renderings, none added, removed or merged.

**The sweep, the pool's one live defect (skeleton closing note 1):** every absence in every face is scoped to the perimeter and to the garrison and the muster, by name. The words *nothing organized*, *no force*, *no specialists*, *nothing is arranged*, *the town does not defend itself* appear nowhere. The watch, the mercenary company, the charter hall and the arcane bucket are neither asserted nor denied in any of the twelve, so **C-1 · C-2 · C-3 · C-4** and **F1-01 · F1-05 · F1-06 · F1-17 · F1-18** are all clear, and the sibling paragraphs four rows down on the same tab may say whatever the roster holds.

**Floor 2:** no digit and no number word anywhere; no date, season, month or duration; no perfect, no durative, no *still*, *no longer*, *since*, *again*, *never*; no rate (**F2-06** — no *most nights*, no *seldom*, no *more often than not*); no prediction. *At dark*, *at night*, *after dark*, *once the light goes* are habitual, not frequencies. Nothing turns on `settlement.history` (**F2-09**).

**Floor 3:** no named character; four unnamed actors across the pool (whoever is asked, the town's arguers, a household, a house with room in it), none of them the tier's singular Guard Captain (**F3-06**); no deity. Culture furniture kept setting-agnostic per **F3-05**: doors, houses, a shutter, stock, fields, a road, a way in. *Carters* was drafted and struck as wheeled-transport furniture twelve profiles do not share.

**Floor 4:** `plagued` is creatures throughout and disease nowhere (**F4-05**); no face writes the town as cowed or sickened, which would contradict `safetyProfile.js:276`. No permanence and no decay is asserted of anything (**F4-01**). The absent perimeter is never explained by a work's condition and never used to explain a band (**F4-06**). No upkeep gate is split (**F4-02/F4-03**) — this key reads no gate and no face touches pay.

**Sibling coherence (skeleton §5c):** the `Invasion & War` row that renders two lines down in this same state (`neither walls nor force`) owns the army, the attacker and the taking of the town. None of these twelve names an attacker, a siege, an army or being taken; this row keeps the country and the creatures. The perimeter is said in nine different ways across the twelve so the two rows do not read as one sentence twice (THE THREAD).

**Craft, at the pool grain (the DULL verdict):** twelve constructions, twelve different subjects — the record, the ground, the stock, the approach, what the town does, the argument, something heard, the fact itself, a stranger arriving, the wall looked for, the way in, a house with room. Twelve different landing nouns: *after that · the houses · things that feed on it · the town · an arrangement · the evening · stock · it discusses · on every side · whoever is asked · business on it · the shutter's business*. No two faces share their first two words; no face opens on the bare slot; lengths run from twenty-six to forty-six words; face counts of sentences vary (one face of variant 1 runs as a single sentence). The perimeter is realised as *no wall · nothing drawn round · no wall to come in behind · nothing to stop at · no wall to stand on · no wall to shut · no line runs round · the wall a stranger looks for · no wall crosses it*; the country as *thick with creatures · beasts that work the open ground · things that feed on it · what walks in off a plagued country · the beasts in the country · what a loose animal draws in · not always stock · what is in the country after dark · beasts work the country on every side · what is out in the fields · the creatures use the way in · what moves when the houses are shut*.

**Every second clause earns (EXEMPLAR-PACK §4):** consequence (v1 f2, v1 f3), record-gap (v1 f1), open matter (v1 f4, v2 f2), voice (v2 f1, v3 f2), reversal (v2 f4), contrast (v3 f3), withholding (v2 f3), telling particular (v3 f4). No restatement, no reassurance, no abstraction pair, no summarising close.

**One matter left standing open in the pool:** whose business it is to meet what comes in off the country (variant 1 face 4), and the argument that fills the evening (variant 2 face 2). Neither is resolved inside its own face.
