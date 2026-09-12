# DRAFT ROUND 2 — DS-DEF-2 · pool `Beasts & Monsters: plagued, NO perimeter and NO force`

Seat: WRITER (Opus 5, Fable-unvalidated), for the Fable chair. Written under **ADDENDUM 14** (a face is lawful unless it contradicts the record; silence is permission), the four floors, and `rewrite/recut/CONTRADICTION-TABLE.md`. Three variants, in place, same vids, same angle tags. Four faces each (the numbered line plus three `[face]` sub-rows). Twelve renderings. Nothing added, nothing merged, nothing trimmed.

**THE GATE'S MEASURE THIS ROUND ANSWERS.** One owned measure failed round 1: `punctuation.colonRate` **(over) = 2.994 band-widths on 1 of 12 faces**, against a band DEPTH ceiling of 1.75. The offending rendering was variant 3's second `[face]` sub-row, the only colon in the pool. It is rewritten below, and the pool now carries **zero colons across all twelve renderings** — the same state the eleven unflagged faces were already in, so the measure is moved to the band's floor and not merely under the ceiling. Every other measure the gate scored passed on all twelve; those eleven renderings are therefore carried forward unchanged, deliberately, rather than churned into new exposure.

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
   - `[face]` Creatures out of the plagued country use the road to {settlement} as freely as anybody with business there. Nothing on that road is arranged as though a thing were to be stopped on it, and no wall, garrison or muster stands at the end of it.
   - `[face]` A house with room in it takes a stranger in at {settlement}, and the shutter is barred from the inside. The town keeps no wall, no garrison and no muster, and what moves in the country when the houses are shut is the shutter's business.

--- NOTES

**The card's clauses, named once and cited by letter below.**

- **(R1)** `reads` / `predicate` — `beastsRowSituation(family, perimeter, force) === 'plagued country, neither'`, `defenseStateProse.js:429-441`. It resolves to three facts, and every face states all three:
  - **(R1a)** `family = 'plagued'` — the country around THIS settlement is pressed by creatures (`MONSTER_FAMILY_OF`, `:279-284`, `:331-335`). Monsters, never disease (floor 4, **F4-05**).
  - **(R1b)** `perimeter = false` — `standingDefenseForces(settlement).walls.present === false` over the closed keyword list `wall · citadel · palisade · earthwork · inner citadel · massive walls` (`defenseInstitutionBuckets.js:84-88`, call site `:655`).
  - **(R1c)** `force = false` — `(garrison.present || militia.present) === false` (`:625-626`, `:655`). **Scoped to those two buckets only**; the watch, mercenary, charter and arcane buckets are NOT read by this key and are left standing in every face.
- **(R2)** `bag` — `{settlement}` is the one slot filled at this block's call sites. No face writes `{band}` or `{route}`.
- **(R3)** `source: muster · standing LICENSED`. **No face spends the citation**: with the militia absent, a cited muster ROLL would be **F1-03** / **F1-24**, so the muster appears only as the class word in a denial, which the table licenses everywhere.
- **(R4)** **ADDENDUM 14, the floor test** — everything a face holds beyond (R1) is licensed by the record's silence. Each such claim is listed below with the floors it was checked against.

---

### VARIANT 1 · `[ledger]` — the office's flat entry · UNCHANGED FROM ROUND 1

All four renderings carried every measure the gate scored. No colon was present in any of them. Carried forward verbatim.

**Claim set carried by all four faces:** (R1a) + (R1b) + (R1c). **Dropped from the shipped row** (contradicted, not "unlicensed"): "nothing organized" (**C-2 / F4-18** — the watch, mercenary, charter and arcane buckets), "no specialist recourse" (**C-1 / F1-06** — `forces.charter.present`, and `institutionProbability.js:197-199` gives the charter hall a five-fold chance in a plagued country), "no force" unqualified (**C-3 / F1-25**), "survival rests on terrain" (**C-6 / F4-07** — `TERRAIN_DEFENCE_OF` reads `terrain EXPOSED` on Plains and Desert), "rests on distance" (a field this key does not read, **F2-09**). **Kept from the shipped row:** the flat ledger entry, the absent perimeter named by its function rather than its fabric, and the settled rather than emergency register.

| face | claim | licence |
|---|---|---|
| 1 | a country thick with creatures | **R1a** |
| 1 | no wall to the town | **R1b** |
| 1 | no garrison or muster of its own | **R1c** |
| 1 | the record holds nothing further under this heading | **R4** — the ABSENCE move, written of the RECORD and never of the world. It asserts no missing body, so it reaches no closed roster (**F1-01 … F1-07** all clear). |
| 2 | nothing is drawn round the settlement | **R1b** |
| 2 | no garrison or muster stands inside it | **R1c** |
| 2 | beasts work the open ground | **R1a** |
| 2 | they come up to the doors of the houses | **R4** — a standing habit of the creatures and a household fact. Floor 1: no roster row, flag or bucket speaks to doors or houses. Floor 2: simple habitual present, no count (**F2-01**), no rate (**F2-06**), no course (**F2-05**). Floor 4: not the works, not a readiness explanation (**F4-06**). |
| 3 | the stock comes in close at dark | **R4** — the household defence the record neither carries nor denies; the simple habitual present, which ADDENDUM 14 names as the writer's main instrument. |
| 3 | no wall for it to come in behind | **R1b** |
| 3 | no garrison, no muster | **R1c** |
| 3 | a country outside full of things that feed on it | **R1a**, at the grain a person meets it |
| 4 | the ground runs up on every side with nothing to stop at | **R1b** — the perimeter stated as the absent EDGE, which asserts no member of the `wall` keyword class (**F1-07**) and neither asserts nor denies a gate (**F1-08** avoided in both directions). |
| 4 | no garrison or muster is kept here | **R1c** |
| 4 | what walks in off a plagued country | **R1a** |
| 4 | whose business it is to meet it is not settled in the town | **R4** — the OPEN QUESTION. Floor 1: it denies no body; it says the town has not agreed, not that nothing exists, so the charter hall, watch, mercenary company and arcane bucket are untouched (**F1-05 · F1-06 · F1-17** clear, and **F1-25**, the negation direction, is not walked). Floor 2: simple present, not the perfect. |

### VARIANT 2 · `[street]` — what is said and done in the town · UNCHANGED FROM ROUND 1

All four renderings carried every measure the gate scored. Carried forward verbatim.

**Claim set carried by all four faces:** (R1a) + (R1b) + (R1c). **Dropped:** "the town does not defend itself" (**C-2 / F4-18**, the shape DS-DEF-5 lens 2 refuses to print in this very state, `defenseStateProse.js:1260-1265`), "hope the pressure goes around it" (a mood; no field carries motive), "understood by everyone in it" (a totality over persons — the card's REFUSED COLUMNS). **Kept:** the arrangement read as settled rather than as an emergency, which is the shipped row's one good instinct, and the movement.

| face | claim | licence |
|---|---|---|
| 1 | the beasts in the country | **R1a** |
| 1 | what the town does is done door by door | **R4** — the private defence. It asserts no body and denies none, so it sweeps nothing (the pool's live defect, avoided). Floor 3: no named person, no singular tier office (**F3-06**). |
| 1 | no wall to stand on | **R1b** |
| 1 | no garrison or muster to turn out | **R1c** |
| 1 | in the town it is spoken of as an arrangement | **R4** — institution presence is a STANDING fact (the annex's provenance fence), so a standing arrangement is the right tense; checked against **F4-05**'s warning that a cowed, sickened `plagued` town contradicts `safetyProfile.js:276`. This town is matter-of-fact, not cowed. |
| 2 | whose stock is loose in the road once the light goes | **R4** — the COMPLAINED-OF door (EXEMPLAR-PACK §2). No field speaks to stock in the road; floor 2 clear (a habit, not a rate or a date). |
| 2 | what a loose animal draws in from the fields | **R1a** |
| 2 | no wall to shut | **R1b** |
| 2 | no garrison or muster to call | **R1c** |
| 2 | the argument is what fills the evening | **R4** — an open civic matter, left unsettled. Denies no body. |
| 3 | something heard in the fields at night is a household matter | **R4** + **R1a** (what is heard is the country's creatures). "A household matter" states where the answering happens; it does not deny that any body exists. |
| 3 | no line runs round the town | **R1b** |
| 3 | no garrison sits in it, no muster comes out of it | **R1c** |
| 3 | what is heard out there is not always stock | **R1a**, by the withholding form (EXEMPLAR-PACK §4.6) |
| 4 | no wall, no garrison and no muster | **R1b** + **R1c** |
| 4 | the town does not discuss it | **R4** — a standing civic habit; no totality over persons (the subject is the town as a body, the form the estate uses throughout). |
| 4 | what is in the country after dark, it discusses | **R1a** |

### VARIANT 3 · `[visitor]` — what a stranger meets on the ground · ONE FACE RE-CUT

**The change, and the measure it moves.** Round 1's second `[face]` read:

> The way into {settlement} is not arranged as though anything were to be stopped on it: no wall crosses it, no garrison watches it, no muster forms on it. The creatures of the country use it as freely as anybody with business on it.

It carried the pool's only colon, and the gate scored it **2.994 band-widths over** on `punctuation.colonRate` against a ceiling of 1.75. The re-cut removes the colon at the root rather than by substituting a dash or a semicolon, neither of which this register wants: the fronted subjunctive is demoted out of first position, the creatures take the subject, and the three reads land as one closing clause. Two collateral gains, both craft and neither required: the tricolon of denials that followed the colon is gone (the register card's *never reach for three of anything by habit*), and the face now opens on the FAMILY read, an order no other rendering in variant 3 uses — variant 3's four renderings now run perimeter-first, perimeter-first-from-the-stranger's-eye, family-first, and household-first.

**Claim set carried by all four faces:** (R1a) + (R1b) + (R1c). **Dropped:** "understands the danger" and "before anybody explains it" (a stranger's interior plus a negative totality over persons), "nothing about the place is arranged as though danger were expected to be met" (**C-4 / F1-06** — a charter hall is precisely an arrangement for meeting this danger, and the totality also reaches every non-defence institution the roster carries). **Kept and re-scoped:** the subjunctive "arranged as though … were to be" — a capability clause, never a historical one — now scoped to the road rather than to the place, and the stranger's arrival as the opener of the spine.

| face | claim | licence |
|---|---|---|
| 1 | a stranger crosses nothing to get in, and cannot say where the town begins | **R1b** — the absent perimeter met as the absent EDGE. Floor 2: present tense, and it asserts neither that the town never built nor that it lost anything (**F2-03 · F2-04 · F2-05** clear; the live-roster read cannot tell those two towns apart). |
| 1 | no garrison quarters here and no muster is called | **R1c** |
| 1 | beasts work the country on every side | **R1a** |
| 2 | the wall a stranger looks for is not there | **R1b** |
| 2 | the garrison and the muster asked after go the same way | **R1c** — the denial is carried by the two buckets the key reads, by name, and reaches no other. |
| 2 | what is out in the fields beyond the last houses | **R1a** |
| 2 | it is told at length by whoever is asked | **R4** — an unnamed person acting, licensed by name under ADDENDUM 14 floor 3 and the struck W22. Plural and unnamed, so it is not the tier's singular Guard Captain (**F3-06**), and it mints no proper name. |
| 3 (re-cut) | creatures out of the plagued country use the road | **R1a** — the family read met on the ground a person walks. `plagued` is creatures throughout (**F4-05**). |
| 3 (re-cut) | as freely as anybody with business there | **R4** — a comparison stated as a measurement in words, not a figure. No count of travellers, no rate of arrivals (**F2-01 · F2-06** clear). The unnamed person with business is the relaxed floor 3's own licence. |
| 3 (re-cut) | nothing on that road is arranged as though a thing were to be stopped on it | **R1b**, scoped to the road. The subjunctive keeps it a capability clause and not a history (**F2-03** clear). It does not say the town is unarranged, so the charter hall, the watch and the mercenary company stand (**C-4 / F1-06** not walked). It also asserts no gate and denies none (**F1-08** untouched). |
| 3 (re-cut) | no wall, garrison or muster stands at the end of it | **R1b** + **R1c** — the three reads as the landing clause. The list runs to its true count, which is the number of things the key actually reads. |
| 4 | a house with room in it takes a stranger in | **R4** — no field speaks to lodging; floor 3 checked, no name and no singular office. |
| 4 | the shutter is barred from the inside | **R4** — the telling particular. Floor 1: a shutter is no member of the `walls` bucket (`defenseInstitutionBuckets.js:84-88`), so it substitutes for no perimeter. Floor 4: no decay clock and no permanence asserted of any row (**F4-01**). |
| 4 | no wall, no garrison and no muster | **R1b** + **R1c** |
| 4 | what moves in the country when the houses are shut | **R1a** |

---

### REFUSALS

**None.** All three variants are written and all twelve renderings are lawful on this seat's reading. No variant needed a refusal row, in round 1 or in round 2.

### THE CHECKS THIS SEAT RAN ON ROUND 2, AND WHAT THEY FOUND

**The gate's owned measure, re-run by hand on all twelve renderings.** Colons: **zero**. Semicolons: zero. Em dashes: zero. Exclamation marks: zero. Digits and percent signs: zero. `which`-clauses: zero. The failing measure is therefore not merely inside the ceiling but at the same value the eleven passing renderings already held, which is what makes this a move and not a shave.

**Structure.** Three variants, numbers `1 2 3` unchanged, angle tags `[ledger] [street] [visitor]` unchanged and one bracket each, no `[plain]` anywhere, three `[face]` sub-rows under each, twelve renderings, none added, removed or merged. Only `{settlement}` is written; `{band}` and `{route}` appear nowhere.

**Lengths** (words, spine first): 30 · 28 · 35 · 41 | 38 · 46 · 40 · 26 | 35 · 41 · 46 · 45. Sentence counts vary (one rendering of variant 1 runs as a single sentence, the rest as two), so no two renderings of a variant share both length and grammar.

**The sweep, the pool's one live defect (skeleton closing note 1):** every absence in every rendering is scoped to the perimeter and to the garrison and the muster, by name. The words *nothing organized*, *no force*, *no specialists*, *nothing is arranged*, *the town does not defend itself* appear nowhere. The watch, the mercenary company, the charter hall and the arcane bucket are neither asserted nor denied in any of the twelve, so **F1-01 · F1-05 · F1-06 · F1-17 · F1-25 · F4-18** are all clear, and the sibling paragraphs four rows down on the same tab may say whatever the roster holds. The re-cut face was checked against this first: "no wall, garrison or muster stands at the end of it" names the three reads and stops, where round 1's "nothing about the place is arranged" ancestor swept.

**The preimage quantifier.** The key is three booleans over one config token and reads nothing else, so it fires at every tier, culture, terrain, era and score state, and on towns that never fortified as readily as on towns whose walls the calamity kernel ruined. No rendering names a tier or a band (**F1-31 · F1-40**), none asserts a founding or a loss (**F2-03 · F2-04**), and none explains the absence by anything (**F4-06**).

**Floor 2:** no digit and no number word anywhere; no date, season, month or duration; no perfect, no durative, no *still*, *no longer*, *since*, *again*, *never*; no rate (**F2-06** — no *most nights*, no *seldom*, no *more often than not*); no prediction. *At dark*, *at night*, *after dark*, *once the light goes*, *when the houses are shut* are habitual, not frequencies. Nothing turns on `settlement.history` (**F2-09**).

**Floor 3:** no named character; five unnamed actors across the pool (whoever is asked, the town's arguers, a household, a house with room in it, anybody with business on the road), none of them the tier's singular Guard Captain (**F3-06**); no deity. Culture furniture kept setting-agnostic per **F3-05**: doors, houses, a shutter, stock, fields, a road, a way in. *Carters* was drafted twice and struck twice as wheeled-transport furniture twelve profiles do not share; the re-cut face says *anybody with business there* for the same reason.

**Floor 4:** `plagued` is creatures throughout and disease nowhere (**F4-05**); no rendering writes the town as cowed or sickened, which would contradict `safetyProfile.js:276`. No permanence and no decay is asserted of anything (**F4-01**). The absent perimeter is never explained by a work's condition and never used to explain a band (**F4-06**). No upkeep gate is split (**F4-02 · F4-03**) and no total collapse of pay is written (**F4-04**) — this key reads no gate and no rendering touches pay at all.

**Sibling coherence (skeleton §5c):** the `Invasion & War` row that renders two lines down in this same state (`neither walls nor force`) owns the army, the attacker and the taking of the town. None of these twelve names an attacker, a siege, an army or being taken; this row keeps the country and the creatures. The two sibling `plagued` pools above this one (`perimeter AND organized force`, `perimeter but NO force`) own the works and their inner face; nothing here restates or contradicts them, since this pool has no works to speak of.

**Craft, at the pool grain (the DULL verdict):** twelve constructions, twelve subjects — the record, the ground, the stock, the approach, what the town does, the argument, something heard, the fact itself, a stranger arriving, the wall looked for, the creatures on the road, a house with room. Twelve landing nouns: *after that · the houses · things that feed on it · the town · an arrangement · the evening · stock · it discusses · on every side · whoever is asked · the end of it · the shutter's business*. No two renderings share their first two words. The perimeter is realised nine ways (*no wall to the town · nothing drawn round · no wall to come in behind · nothing to stop at · no wall to stand on · no wall to shut · no line runs round · the wall a stranger looks for · nothing arranged as though a thing were to be stopped*); the country twelve ways (*thick with creatures · beasts that work the open ground · things that feed on it · what walks in off a plagued country · the beasts in the country · what a loose animal draws in · not always stock · what is in the country after dark · beasts work the country on every side · what is out in the fields · creatures out of the plagued country · what moves when the houses are shut*).

**Every second clause earns (EXEMPLAR-PACK §4):** consequence (v1 f2, v1 f3), record-gap (v1 f1), open matter (v1 f4, v2 f2), voice (v2 f1, v3 f2), reversal (v2 f4), contrast (v3 f3), withholding (v2 f3), telling particular (v3 f4). No restatement, no reassurance, no abstraction pair, no summarising close.

**THE THREAD.** Every rendering's second sentence picks up a noun from its first (*the town*, *it*, *the road*, *what is heard*, *the shutter*) or makes its shift of subject the passage's one turn outward and places it last. This pool has zero modifier mounts today, so each rendering is read first or alone; each was also read aloud after the spine of both sibling `plagued` pools to check it does not collide.

**One matter left standing open in the pool:** whose business it is to meet what comes in off the country (variant 1, third face), and the argument that fills the evening (variant 2, first face). Neither is resolved inside its own rendering.
