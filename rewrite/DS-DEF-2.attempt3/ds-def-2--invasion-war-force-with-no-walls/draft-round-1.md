# DS-DEF-2 · `Invasion & War: force with NO walls` · REWRITE draft round 1

Seat: Opus 5 (Fable-unvalidated) · role `spine` · 3 variants in, 3 variants out · 4 wordings per variant (the numbered row plus three `[face]` sub-rows).
Paste block: the rows below replace the pool's variant rows under the pool's own bold heading. The pool's typed lines are untouched and are not repeated here.

---

1. `[ledger]` {settlement} keeps a professional garrison and no wall.
   - `[face]` A professional force garrisons {settlement}; the town has no perimeter.
   - `[face]` The soldiers at {settlement} are regulars, and the town stands without works.
   - `[face]` Trained troops serve at {settlement}. No wall encloses the town.
2. `[street]` The town's defense is people rather than works.
   - `[face]` Defense here is a matter of people, and the town keeps no wall.
   - `[face]` The town has people for its defense. It has no walls.
   - `[face]` The town defends itself with people and with no works.
3. `[visitor]` A stranger sees soldiers at {settlement} and no line for them to stand behind.
   - `[face]` A traveller finds soldiers at {settlement} and no wall around the town.
   - `[face]` A visitor to {settlement} sees a garrison and an unwalled town.
   - `[face]` A newcomer at {settlement} sees soldiers. The town shows no wall.

---

--- NOTES

**The card, short.** `reads` `invasionRowSituation(walls, garrison, militia)` · `predicate` the row `no walls, professional garrison` of `INVASION_ROW_POOL` · `may claim` that reading selects that row, as a STANDING fact of the record · `may NOT` a count, a cause, a season, a future, a standpoint, a second fact · `bag` FILLED at this block's call sites `{settlement}` · `angle` ledger street visitor · `source` muster, standing, LICENSED where the provenance budget allows · REFUSED COLUMNS a totality over persons, an exemption, a named character's fate, a theological claim.

**The licensed claim set of this pool, whole.** Two limbs of one selected row, and nothing else: (L1) the town has no walls; (L2) the town's force is a professional garrison. Every wording below carries its variant's inherited subset of {L1, L2} and adds nothing.

### Variant 1 `[ledger]` — claim set {L1, L2}

Old row: *"{settlement} keeps a professional force and no perimeter. It answers raiders well and cannot hold a siege, because there is nothing here to hold."*
KEPT: L2 ("a professional force") and L1 ("no perimeter"), both under `may claim` (the row as a standing fact).
DROPPED, with the clause each breaks: "answers raiders well" — `may NOT: a standpoint` and `a second fact` (a capability rating no field holds); "cannot hold a siege" — `may NOT: a future` and `a second fact`; "because there is nothing here to hold" — `may NOT: a cause`.

| wording | claims | licence for each |
|---|---|---|
| row 1 | L2 "a professional garrison"; L1 "no wall" | `predicate` (the row's own two limbs) via `may claim`; `{settlement}` by the FILLED bag; angle `ledger` by the card's angle line |
| face a | L2 "A professional force garrisons"; L1 "no perimeter" | as row 1 |
| face b | L2 "are regulars"; L1 "stands without works" | as row 1 |
| face c | L2 "Trained troops serve"; L1 "No wall encloses the town" | as row 1 |

### Variant 2 `[street]` — claim set {L1, L2-narrow}

Old row: *"The town's defense is people rather than works, and people can be gone around."*
KEPT: L2 in the narrow form the old sentence made it — the defense is PEOPLE (the old sentence never said *professional*) — and L1 by the rejected alternative "works", a contrast licensed because the sibling pool keys of this block name walls (`walls AND professional garrison`, `walls with citizen militia`, `walls with NO force`), so R-DA-02's keep-test passes on a sibling key.
DROPPED: "people can be gone around" — `may NOT: a future` and `a standpoint` (what an attacker could do), and MOVE-GRAMMAR §1.3 FORECAST.
**Declared, not a refusal:** this variant is claim-narrower than variants 1 and 3 because "professional" is a claim the old sentence did not make and `never ADD a claim` forbids supplying it. The row's discriminating fact against the sibling `militia only` pool therefore lives in the predicate, not in this variant's text — as it already did in the shipped row. No wording here says or implies *citizens*, which would contradict the row.

| wording | claims | licence for each |
|---|---|---|
| row 2 | L2-narrow "defense is people"; L1 "rather than works" | `may claim` (the row as a standing fact); the contrast by a sibling pool key (R-DA-02); angle `street` by the card's angle line; no slot, matching the parent's empty `{slot}` set |
| face a | L2-narrow "a matter of people"; L1 "keeps no wall" | as row 2, the lack stated flat rather than as a contrast |
| face b | L2-narrow "has people for its defense"; L1 "has no walls" | as row 2 |
| face c | L2-narrow "defends itself with people"; L1 "with no works" | as row 2 |

### Variant 3 `[visitor]` — claim set {L1, L2}

Old row: *"A stranger sees soldiers at {settlement} and no line for them to stand behind, and can see how that decides where any fight would happen."*
KEPT: L2 ("soldiers") and L1 ("no line"), and the observer frame, which the card's `angle: ledger street visitor` licenses (the stranger is a frame, not a named character — product scope holds).
DROPPED: "can see how that decides where any fight would happen" — `may NOT: a future`, `a cause` and `a standpoint`.
"for them to stand behind" is inherited from the old sentence as a gloss on what a line is; it asserts no world fact and is not re-added anywhere it was absent.

| wording | claims | licence for each |
|---|---|---|
| row 3 | L2 "soldiers"; L1 "no line" | `may claim`; `{settlement}` by the FILLED bag; angle `visitor` |
| face a | L2 "soldiers"; L1 "no wall around the town" | as row 3 |
| face b | L2 "a garrison"; L1 "an unwalled town" | as row 3; the lack carried attributively so the pool shows a second level-1 grammar (PRESENT alone) beside the PRESENT → LACK of the rest |
| face c | L2 "soldiers"; L1 "shows no wall" | as row 3 |

### Laws held, with the reading each was held under

- **No citation anywhere.** The card licenses the `muster` holder, but a provenance move would be a SECOND licensed claim that no old sentence made, and `never ADD a claim` outranks the licence; §24's ceiling (one per unit, only for S3's three reasons) is not reached either, since this pool states no count and carries no two accounts. Recorded so a refiner does not read the absence as an oversight.
- **ABSENCE never opens** (MOVE-GRAMMAR §1.4 wall 3). Both limbs must be carried, so every wording states the force first and the lack second. That fixes the move order across the family; it is the row's own shape, not a habit, and face b of variant 3 breaks it by incorporating the lack into the state.
- **No expletive opener, no digit, no em dash, no exclamation, no question, no which-clause, no future indicative, no cause joint, no season, no count word, no totality over persons** — checked wording by wording.
- **Slot sets are parent-identical**: variants 1 and 3 carry `{settlement}` in all four wordings; variant 2 carries none in all four, as its shipped row does. No `{band}` (RESERVED) and no `{route}` (in the bag, unfilled at this block's call sites).
- **Openers.** The three rows open on `{settlement}`, "The town's" and "A stranger" — no shared first two words. `{settlement}` opens at most this one variant of the pool (R-DA-17).
- **Closes** land on wall · perimeter · works · town · works · wall · walls · works · behind · town · town · wall. No pronoun closer. Two close kinds appear (the lack; the condition), which is narrow — the honest consequence of a two-limb row where one limb is an absence. Reported, not cured by inventing a third.
- **The thread.** Every two-sentence wording carries the town forward as its second subject (variant 1 face c, variant 2 face b, variant 3 face c). As a spine this pool opens its passage, and each wording leaves a modifier the nouns *garrison / soldiers / town / wall / works* to pick up.
- **Spread.** Word counts 8 to 14; one semicolon in twelve; sentence counts 1/1/1/2, 1/1/2/1, 1/1/1/2; the contrast shape appears in one wording of twelve.

### Word counts ( `{settlement}` counted as one word )

| variant | row | face a | face b | face c |
|---|---|---|---|---|
| 1 `[ledger]` | 8 | 10 | 12 | 10 |
| 2 `[street]` | 8 | 13 | 11 | 10 |
| 3 `[visitor]` | 14 | 12 | 11 | 11 |

### REFUSALS

None. All three variants were made lawful under the card; no wording is banked as a refusal row.
