**`Beasts & Monsters`: `settled`, defenses beyond the need**
1. `[counterforce]` Nothing comes out of the country at {settlement} against the perimeter, and the perimeter is the heavier of the two.
   - `[face]` Little enough comes out of the country at {settlement}, and out of all proportion to it stands the wall.
   - `[face]` Pressure out of the country does not reach {settlement}, and the works stand at more than its weight.
   - `[face]` Against a country that sends nothing, {settlement} keeps a line, and it is the line that is out of scale.
2. `[ledger]` The country at {settlement} is settled, and the perimeter standing against it is provision past the need.
   - `[face]` A settled country lies around {settlement}, and the perimeter the town holds is more than a settled country requires.
   - `[face]` Beasts ask little of {settlement}, and the wall stands to far more.
   - `[face]` Provision against beasts at {settlement} runs ahead of what the country asks, the country settled and the wall standing.
3. `[visitor]` A stranger walking out from {settlement} finds a settled country, and coming back finds a perimeter that does not match it.
   - `[face]` What a stranger meets outside {settlement} is settled ground, and what stands at the town's edge is a wall of a weight that ground never asks.
   - `[face]` Coming to {settlement} through a settled country, a stranger arrives at works that would suit a harder one.
   - `[face]` Between a stranger and {settlement} lies settled country. The perimeter at the town's edge is not scaled to that country.

--- NOTES

**THE CARD, AS READ.** `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: settled, defenses beyond the need'` prints: role `spine`; reads `beastsRowSituation(family, perimeter, force)` via `BEASTS_ROW_POOL`; predicate `=== settled country, perimeter`; bag `{band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites `{settlement}`; form `sentence`; angles `counterforce ledger visitor`; source `muster · standing LICENSED`; covert `no`; audience `player (no mark)`; **may claim** that the predicate holds, as a STANDING fact of the record; **may NOT** a count, a cause, a season, a future, a standpoint, a second fact; refused columns a totality over persons, an exemption from a duty, a named character and that character's fate, a theological claim.

**THE THREE LICENSED CLAIMS, named once and used below by number.**
- **C1 — the country is settled.** Licensed by the card's `predicate` limb `settled country` (the `family` argument of the read, `measuredMonsterFamily`'s corpus word).
- **C2 — the town holds a perimeter.** Licensed by the card's `predicate` limb `perimeter` (the `perimeter` argument, the `defenseProfileHasWalls` predicate the block's PROVENANCE + FENCE note pins).
- **C3 — the works stand past what the country asks.** Licensed by the card's `may claim` on the predicate taken WHOLE: the branch is named `settled, defenses beyond the need`, and the disproportion is the conjunction of C1 and C2, not a fact beside them. Every realisation of C3 below is a comparison written as a measurement in words (R-DA-11), never a purpose, a cause, a cost or a judgment of the town.

**FORCE IS NOT LICENSED HERE, AND THIS IS WHY THE OLD VARIANT 3 LOSES ITS TAIL.** `defenseStateProse.js:365-377` returns `settled country, perimeter` from `perimeter` alone; its own docblock states that this branch "deliberately does not consult the force at all". No wording in this packet says anyone stands on the perimeter, or that nobody does.

**CLAIM LEDGER, per wording.** All twelve carry exactly {C1, C2, C3} and nothing else, so the four faces of each variant are claim-equal to one another (arm A6 reads across the faces).

| variant | wording | C1 | C2 | C3 | words |
|---|---|---|---|---|---|
| 1 `[counterforce]` | row | "Nothing comes out of the country … against the perimeter" | "the perimeter" | "is the heavier of the two" | 20 |
| 1 | face a | "Little enough comes out of the country" | "the wall" | "out of all proportion to it" | 19 |
| 1 | face b | "Pressure out of the country does not reach" | "the works" | "at more than its weight" | 18 |
| 1 | face c | "a country that sends nothing" | "keeps a line" | "the line … is out of scale" | 20 |
| 2 `[ledger]` | row | "The country … is settled" | "the perimeter standing against it" | "provision past the need" | 17 |
| 2 | face a | "A settled country lies around" | "the perimeter the town holds" | "more than a settled country requires" | 19 |
| 2 | face b | "Beasts ask little of" | "the wall" | "stands to far more" | 12 |
| 2 | face c | "the country settled" | "the wall standing" | "runs ahead of what the country asks" | 19 |
| 3 `[visitor]` | row | "finds a settled country" | "a perimeter" | "does not match it" | 21 |
| 3 | face a | "is settled ground" | "a wall" | "of a weight that ground never asks" | 26 |
| 3 | face b | "through a settled country" | "works" | "would suit a harder one" | 18 |
| 3 | face c | "lies settled country" | "The perimeter at the town's edge" | "is not scaled to that country" | 20 |

**WHAT EACH OLD VARIANT LOST, AND UNDER WHICH LAW.**
- **Variant 1 `[counterforce]`** kept C1 ("very little in the country") and C2 ("substantial works facing it"). DROPPED: "whatever the walls here are for, it is not the creatures" — a PURPOSE attributed to the works, which is a cause under the card's `may NOT`, and a standpoint besides; MOVE-GRAMMAR §1.3 holds no MEANING move.
- **Variant 2 `[ledger]`** kept C1+C2+C3 ("comfortably over-provided against beasts"). DROPPED: "The pressures that matter to this town are internal" — a second fact, and one belonging to the sibling row `Internal Security` (arms A1/A11: a spine neither restates nor contradicts its siblings); DROPPED: "its defensive spending does not reflect that" — a spending fact no field of this read holds, carrying a standpoint on the town's choices.
- **Variant 3 `[visitor]`** kept C2 ("the perimeter"). DROPPED: "how relaxed the people on it are" — persons on the perimeter (a FORCE assertion this branch does not consult) and a feeling (MOVE-GRAMMAR §1.3, FEELING does not exist).

**ONE JUDGMENT CALL, DECLARED FOR THE REFUTER.** Old variant 3 carried C1 and C3 only through "relaxed", the clause the rewrite drops. The rewritten variant 3 states C1 and C3 plainly. I read this as KEEPING the pool's predicate rather than ADDING a claim: a spine variant renders its branch, and the card licenses the whole predicate to every variant of the pool, so C1 and C3 were never variant 3's to add or lose. If the refuter reads it the other way, the lawful narrowing is variant 3 asserting C2 alone, which would break claim-equality with variants 1 and 2 of the same pool. Flagged, not decided here.

**NO CITATION IS TAKEN.** The card licenses the `muster` holder "where the provenance budget allows". Part B §24 caps the budget at one citation per unit and only for one of S3's three reasons; none is met here (no two accounts disagree, no count is claimed, and the muster is not the keeper of the wall's record). The exemplar registers cite at zero per 786 sentences, so no wording cites.

**THE THREAD (owner, 2026-09-08 ~21:4x).** Every wording is a spine and is written to open a passage. The two-sentence face (variant 3, face c) carries "country" forward from its first sentence into its second. No wording changes subject mid-passage without handing a noun back, and none ends on a turn that a modifier would have to repair. Each reads as an opener and as the sentence a salience-ordered modifier follows: the closing noun of every wording is the wall, the line, the works, the perimeter or the country, which is the noun a DS-DEF-2 modifier attaches to.

**FORM AND FENCE CHECKS RUN BY HAND.**
- One bracketed angle tag per numbered row, carried verbatim from the shipped rows: `[counterforce]`, `[ledger]`, `[visitor]`. No `[plain]` anywhere (a spine row refuses it).
- Three `- \`[face]\`` sub-rows per variant, matching `FACE_ROW_RE` (`dossier-annex-grammar.mjs:107`).
- Slot set `{settlement}`, exactly once, in every one of the twelve wordings — identical to each parent row's set (§2.5's face refusal).
- No wording opens on `{settlement}` (T-F8: a sentence face opening on a `proper`-typed slot of the bag is refused). The shipped variant 2 did open on it; the rewrite does not.
- Zero em dashes, zero exclamation marks, zero digits, zero percents, zero question marks, zero `which`-clauses. No `, which` tail anywhere (R-DA-03).
- No sentence takes the future indicative; the one modal is the subjunctive "would" of variant 3 face b, which is an edge (A2).
- Present tense throughout; no expletive opener ("There is / It is") in any wording (R-DA-07). The shipped variant 1 opened on one; the rewrite does not.
- Variant count 3, unchanged; vids 1, 2, 3 in the shipped order; none added, merged or removed (§22, never trim).
- First two words differ across the three numbered rows ("Nothing comes" · "The country" · "A stranger") and across all twelve wordings.
- Close kinds vary: an object ("the wall"), a condition ("out of scale", "does not match it"), a magnitude in words ("to far more"), a standing absence of demand ("that ground never asks"). Pronoun closers: zero (R-DA-04's 0.055 ceiling).
- Twelve distinct realisations of C3, so no template beat repeats across the pool (fault 9; the same rule broken the same way everywhere is the template).
- Length band 12 to 26 words, mean about 19; the short line exists (variant 2 face b at 12) and nothing runs past 30 (R-DA-06).
- Density law (§21.4): "the wall stands to far more" and "out of all proportion to it stands the wall" are compressed and inverted on purpose; neither is to be flattened by a refiner without a law behind the change.

**SIBLING DISTANCE (arms A1 and A11).** The neighbouring spine `Beasts & Monsters: settled, nothing organized` owns "heartland", "never needed to think about what is outside it" and "walks out … and meets nothing"; `frontier, credible deterrence` owns "visible from a long way off" and "ordinary rather than anxious"; the `Invasion & War` rows own "serious perimeter and a serious absence" and "the wall and the men who belong to it". No phrase from any of them is reused, and no wording here contradicts one: this pool says a settled country and a standing perimeter, which its `nothing organized` sibling denies only on the perimeter.

**REFUSALS.** None. All three variants are written; no variant failed a law it could not be made to meet.
