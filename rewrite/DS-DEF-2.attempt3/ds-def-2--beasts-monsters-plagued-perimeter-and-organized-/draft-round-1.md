1. `[ledger]` The country about {settlement} runs with creatures, and people hold the wall.
   - `[face]` The wall at {settlement} is held by people, and the country around the town is thick with beasts.
   - `[face]` People stand on the wall at {settlement}, and the country about them is plagued.
   - `[face]` Walled and held, {settlement} sits in plagued country.
2. `[street]` A wall is up at {settlement}, and it is held.
   - `[face]` The town keeps its wall at {settlement} and keeps people on the wall.
   - `[face]` People are on the wall at {settlement}, and the wall is up.
   - `[face]` Those on the wall at {settlement} are people the town keeps.
3. `[unfolding]` Creatures are still thick in the country about {settlement}, and the town's wall is still up.
   - `[face]` The wall at {settlement} stands yet, and the country about it is plagued.
   - `[face]` In country that stays plagued, {settlement} stays walled.
   - `[face]` The country about {settlement} does not empty of creatures, and the wall of the town does not come down.

--- NOTES

**Pool.** DS-DEF-2 · `Beasts & Monsters: plagued, perimeter AND organized force` · draft round 1 · Opus WRITER (Seat: Opus 5, Fable-unvalidated), for the Fable chair.
Card printed first: `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, perimeter AND organized force'` in `laneRW-DEF2`. The block's annex section read whole (`laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2726`): this pool's three rows at `:2596-2598`, its six sibling `Beasts & Monsters` pools, and the nineteen spines of the block's other four rows (arms A1 and A11 — nothing below restates or contradicts a sibling). The selecting branch read at source: `src/domain/display/stateProse/defenseStateProse.js:400-415` (`BEASTS_ROW_POOL`), `:429-440` (`beastsRowSituation`), `:447-450` (`beastsRowPoolKey`), and the caller at `:655`.

**Counts.** 3 variants · 12 wordings (3 spine rows + 9 `[face]` sub-rows, i.e. four faces per variant). None added, none removed, none merged, none reordered; each variant keeps its own vid and its own single angle tag (`[ledger]`, `[street]`, `[unfolding]`), exactly as the corpus carries them. No `[plain]` marker anywhere — §2.5 seats `plain` on `role: modifier` rows only and this pool is a **spine** (card: `role spine`), so the projector's typed-declaration branch would throw on it.

**Row form.** `FACE_ROW_RE` at `laneRW-DEF2/scripts/lib/dossier-annex-grammar.mjs:107` is `/^\s*-\s+`\[face\]`\s+(.*)$/` — the marker is BACKTICKED. The brief's unbackticked rendering would not match; the rows above are written to the regex and to ARCH §2.5's example.

**Word count per wording** (whitespace tokens, `{settlement}` counting one):

| variant | spine row | `[face]` 1 | `[face]` 2 | `[face]` 3 |
|---|---|---|---|---|
| 1 · `[ledger]` | **12** | **18** | **14** | **8** |
| 2 · `[street]` | **10** | **13** | **12** | **11** |
| 3 · `[unfolding]` | **16** | **13** | **8** | **19** |

mean **12.83** · min **8** · max **19**. Every wording is ONE sentence; no semicolon anywhere (a spine that contributes no second segment contributes no arm-Q summarising beat to any unit composed on it).

---

## 1. WHAT THE CARD LICENSES — the three components

The card prints one claim: that `beastsRowSituation(family, perimeter, force)` selects the row `plagued country, perimeter and force` of `BEASTS_ROW_POOL`, **as a STANDING fact of the record**. Read against the branch, that one row-selection resolves to exactly three components, and every component is part of the SAME typed claim (one table row, one key string), not three separate facts:

| # | component | the read that licenses it | what it does NOT license |
|---|---|---|---|
| C1 | the country about the town is plagued | `settlement.config.monsterThreat` → `measuredMonsterFamily` → `family === 'plagued'` (`defenseStateProse.js:330-335, 429-431`) | how many creatures, of what kind, what they have done, when, or what follows |
| C2 | the town has a perimeter | `standingDefenseForces(settlement).walls.present` → `perimeter` (`:648`, `:655`) | a second civic object of the wall class (a gate, a ditch, a tower), the wall's condition, extent or upkeep |
| C3 | the town has an organized force | `garrison || militia` → `force` (`:650-651`, `:655`) | a count, a wage, a rota, a name, a kind, or whose the force is beyond the town's own institutions |

**Why a comma-and joint is not a second fact.** The card's `may NOT` bars *a second fact*. C1, C2 and C3 are one row of one table — the key string is literally `plagued country, perimeter and force` — so a wording that states them in one sentence asserts ONE typed claim, not two. Every wording above is one sentence with at most one joint, and the joint is a comma and a word from the connectives list (`and`); no `which`, no em dash, no colon-as-payoff.

**C3 is written neutrally, and that is a correction.** `force = garrison || militia`. A garrison need not be raised from the townspeople, so "the town's own people" would mint a particular the field does not hold. Every wording therefore says *people*, *the wall is held*, or *people the town keeps* — the last licensed because `standingDefenseForces` re-derives from `settlement.institutions` (`:604-609`), so the force IS an institution of this settlement even when it is professional.

**No citation is taken.** The card licenses one (`source: muster · standing LICENSED`), but Part B §24 caps provenance at one citation per unit and only for S3's three reasons — two accounts disagreeing, a count from an interested party, a keeper who is a power. None holds here: there is no count, no dispute, and the office would be citing its own roster. The exemplars with raw text cite at zero per 786 sentences, so a citation here would be the habit §24 names as a refuter's finding.

---

## 2. VARIANT BY VARIANT — what was kept, and what was dropped

Dropping is the rewrite's purpose; the shipped breach is the corpus's known state. Nothing is added anywhere.

### Variant 1 · `[ledger]` — KEPT C1 + C2 + C3

Old row: *"The country around {settlement} is thick with creatures and the town has answered it properly: there is a wall to hold and there are people to hold it, and both are in use constantly."*

| claim in the old sentence | disposition | law |
|---|---|---|
| the country is thick with creatures | **KEPT** (C1) | `may claim` · `predicate` |
| there is a wall | **KEPT** (C2) | `may claim` · `predicate` |
| there are people to hold it | **KEPT** (C3) | `may claim` · `predicate` |
| *"the town has answered it properly"* | **DROPPED** | `may NOT: a standpoint` — a verdict on the arrangement, and MOVE-GRAMMAR §1.3 VERDICT (no field rates this) |
| *"both are in use constantly"* | **DROPPED** | `may NOT: a second fact` and `a count` — `both` is a quantifier over the two objects, and a rate of use is a fact no read holds |
| the expletive *"there is / there are"* | **DROPPED as form** | R-DA-07 (the copula stays, the expletive goes) |

### Variant 2 · `[street]` — KEPT C2 + C3 only

Old row: *"Defense at {settlement} is not an emergency arrangement, it is the week's work: the rotations run, the gates close on time, and nobody treats any of it as unusual."*

| claim in the old sentence | disposition | law |
|---|---|---|
| a perimeter stands (*the gates*) | **KEPT** (C2), re-said on the licensed object | `may claim`; `may NOT: another civic object of the class wall` bars *gates* as a minted second object |
| an organized force stands (*the rotations run*) | **KEPT** (C3), without the rota | `may claim`; the rota itself is a count the card refuses |
| *"is not an emergency arrangement, it is the week's work"* | **DROPPED** | `may NOT: a standpoint` + `a second fact`; also R-DA-02 (a contrast needs a sibling pool key naming the rejected alternative — none does) |
| *"the gates close on time"* | **DROPPED** | `may NOT: a second fact` and `a season` — punctuality is a tempo fact no read holds |
| *"nobody treats any of it as unusual"* | **DROPPED** | REFUSED COLUMN: **a totality over persons**; also a belief frame |
| C1 (plagued country) | **NOT ADDED** | the old sentence never made it; adding it would breach *never ADD a claim*. The variant is honestly thinner than its siblings, and that is the drop working. |

### Variant 3 · `[unfolding]` — KEPT C1 + C2 only

Old row: *"What {settlement} has built is holding against the pressure and is being spent doing it; the posture is survivable, and survivable is the most that can be said of it here."*

| claim in the old sentence | disposition | law |
|---|---|---|
| a built perimeter stands (*what {settlement} has built*) | **KEPT** (C2), as a standing fact rather than a built one | `may claim` as a STANDING fact; R-DST-B (a standing configuration field licenses a STRUCTURAL clause, never a historical one), so *built* is written as *is up* / *stands* / *walled* |
| the country presses (*against the pressure*) | **KEPT** (C1) | `may claim` · `predicate` |
| *"is holding against the pressure"* as an outcome | **DROPPED** | `may NOT: a cause` — an effect of the arrangement, which no read holds |
| *"is being spent doing it"* | **DROPPED** | `may NOT: a second fact` + `a cause` — a cost clause needs (event provenance × a household or office row), MOVE-GRAMMAR §1.2 move 7 |
| *"the posture is survivable"* | **DROPPED** | `may NOT: a standpoint`; CL-7 / R-DA-12 (a rating word needs a typed rating field) |
| *"survivable is the most that can be said of it here"* | **DROPPED** | `may NOT: a standpoint`; the gnomic closer (R-DA-12) and the summarising second sentence (MOVE-GRAMMAR §1.3 MEANING) |
| C3 (the force) | **NOT ADDED** | the subject of *is being spent* is the built works, not people; the old sentence makes no force claim, so adding one would breach *never ADD a claim*. **This is the packet's one contestable reading** and is flagged for the sitting in §5. |

---

## 3. FACE BY FACE — which card clause licenses each claim

Every face is claim-equal to its three siblings (arm A6 reads ACROSS the family, not back to the old sentence). Slot set `{settlement}`, exactly once in every wording, never sentence-initial (T-F8) and never sentence-final.

**Variant 1** (each face carries C1 + C2 + C3, all three under `may claim` / `predicate`):

| face | C1 licensed by | C2 licensed by | C3 licensed by | close kind |
|---|---|---|---|---|
| spine · *the country … runs with creatures … people hold the wall* | `predicate` (`family === 'plagued'`) | `predicate` (`perimeter`) | `predicate` (`force`) | an object (the wall) |
| 1 · *the wall … is held by people … thick with beasts* | `predicate` | `predicate` | `predicate` | an object (beasts, the country's own noun) |
| 2 · *people stand on the wall … the country about them is plagued* | `predicate`, in the branch's own word | `predicate` | `predicate` | a condition (plagued) |
| 3 · *Walled and held, {settlement} sits in plagued country* | `predicate` | `predicate` (*walled*) | `predicate` (*held*) | an object (the country) |

**Variant 2** (each face carries C2 + C3 only):

| face | C2 licensed by | C3 licensed by | close kind |
|---|---|---|---|
| spine · *a wall is up … and it is held* | `predicate` (`perimeter`) | `predicate` (`force`) | a condition (held) |
| 1 · *the town keeps its wall … and keeps people on the wall* | `predicate`; the keeping is the settlement's own institution (`standingDefenseForces`) | `predicate` | an object (the wall) |
| 2 · *people are on the wall … and the wall is up* | `predicate` | `predicate` | a condition (up) |
| 3 · *those on the wall … are people the town keeps* | `predicate` | `predicate` | a condition (the keeping) |

**Variant 3** (each face carries C1 + C2 only):

| face | C1 licensed by | C2 licensed by | close kind |
|---|---|---|---|
| spine · *creatures are still thick … the town's wall is still up* | `predicate` | `predicate` | a condition (up) |
| 1 · *the wall … stands yet … the country about it is plagued* | `predicate` | `predicate` | a condition (plagued) |
| 2 · *in country that stays plagued, {settlement} stays walled* | `predicate` | `predicate` | a condition (walled) |
| 3 · *the country … does not empty of creatures … the wall … does not come down* | `predicate` | `predicate` | a condition (standing) |

**The walls, checked on all twelve.** No em dash · no exclamation · no question · no digit or percent · no `which`-clause · no second sentence · no citation · no "I" and no "you" · no future indicative and no forecast · no figure, simile or inanimate intent · no quantifier (`both`, `every`, `all`, `nobody` are gone) · no totality over persons · no office, count or exemption absent from the institution table · no named character · no theological claim · no season, no tempo, no cause · one bracketed tag per spine row.

**THE THREAD.** These rows are spines, so each stands first in its unit and must HAND a noun forward rather than pick one up. Every wording ends inside a clause whose head noun is one of the three the composer's modifiers attach to — *the wall*, *the country* (with *beasts* / *creatures* as its own noun), or *people* — so a modifier seated after any of them can carry a noun forward without a turn. Variant 2's spine row closes on the pronoun of its own subject (*a wall is up … and it is held*); the noun *wall* is that sentence's subject and stays available to the modifier, and the row is deliberately the pool's short line (the register card: *the short line exists*).

---

## 4. THE GRAMMARS, AND WHY THREE DISTINCT ONES ARE NOT AVAILABLE HERE

MOVE-GRAMMAR §2.1 asks a pool of k variants for `min(k, 8)` distinct level-1 grammars. Of the eight, only PRESENT-family members are drawable on this pool: there is no event-provenance field (no V7), no `none-exists` field (no V3), no `not-held` field with provenance (no V8), no institution row of the block's own (no V5), no unresolved value (no V6), and no structural-consequence field (no V2). What remains is **V1 (PRESENT)** and **V4 (OBJECT → PRESENT)**, and the pool uses both: variant 1 and variant 3 open on the state (V1), variant 2 opens on the object (V4). Inside each family the four faces vary the ORDER of the components and the syntax — co-ordinate, passive, force-first, fronted participle — which is the variation a claim-equal family can lawfully carry. Reporting two grammars where the rule asks three is arithmetic on a conjunction spine, not a shortfall in the wording; twenty-two of DS-DEF-2's twenty-six pools share the shape.

**Openers across the twelve** (A11 / R-DA-17): `The country` · `The wall` · `People` · `Walled` · `A wall` · `The town` · `People` · `Those` · `Creatures` · `The wall` · `In country` · `The country`. Two wordings share `The wall`, two share `People`, two share `The country` — 0.167 each, the top of the measured exemplar same-opener band. No wording opens on the settlement token (R-DA-17's rule and T-F8 both).

**One term for one thing** (R-DA-22). The perimeter is *the wall* in all twelve, never *line*, *perimeter* or *works*; the force is *people* (or *people the town keeps*), never *watch*, *garrison* or *militia* — those are office names the card does not license on this pool. The distance between the faces is therefore carried by rhythm and by the country's own vocabulary (*creatures* / *beasts* / *plagued*), which is what the licence leaves available; naming the object four ways would buy sibling distance with an unlicensed particular.

**Density** (§21.4). The shortest wordings — eight words at variant 1 face 3 and variant 3 face 2 — carry the whole claim set of their family; they are compressed, not plainer. No wording is padded to sit at a band's middle.

---

## 5. REFUSALS

**None.** All three variants are written lawfully, one for one, under their own numbers and their own angle tags. No variant is banked.

**Two judgment calls recorded for the sitting, either of which the chair may overturn without touching the other faces:**

1. **Variant 3 carries no force claim.** The subject of the old row's *is being spent doing it* is *what {settlement} has built*, so the works are what is spent, not people; on that reading the old sentence asserts C1 and C2 only, and adding C3 would breach *never ADD a claim*. If the chair reads the old row as asserting the force, variant 3's four wordings are re-drafted with C3 and the family stays claim-equal.
2. **Variant 2 carries no plagued-country claim.** Its old row states the arrangement and never the country. If the chair rules that the pool KEY's own family word licenses C1 on every variant of the pool regardless of what the old sentence said, variant 2's four wordings take C1 as well.

**One card defect, reported not worked around.** The card's `reads` and `predicate` lines both print the census's synthetic label `beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)` rather than a field path, so a claim-token check that splits that label on `.` recovers the dead tokens `js)` / `js)s` and no segment naming `perimeter`, `force` or `family` can bind the claim to the field. The rung-3 tabling car made the predicate an exact `if and only if` at the source (`defenseStateProse.js:429-440`), which is what §1 above is written from; one `FIELD_SYNONYM_ROWS` entry citing the branch would make the card readable for the other rung-3 rows of this block before they are dispatched.
