Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2 · pool `Beasts & Monsters`: `plagued`, NO perimeter and NO force · REWRITE draft, round 1.
Written under the licence card printed by `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, NO perimeter and NO force'` in laneRW-DEF2. Three variants in, three variants out: same vids, same order, same bracketed tags, same slot sets, none added, none removed, none merged.

## THE ROWS (paste under the pool's bold heading; the typed lines above it are untouched)

1. `[ledger]` `[plain]` The country around {settlement} is thick with creatures, and the town has no force and no wall.
   - `[face]` {settlement} keeps no perimeter and no force in a country worked by beasts.
   - `[face]` Beasts hold the country around {settlement}; the town shows no line and keeps nothing under arms.
   - `[face]` Creatures have the run of the country, and {settlement} is without wall or force.
2. `[street]` `[plain]` The town does not defend itself. The country around it is full of beasts, and the town is neither walled nor armed.
   - `[face]` In a beast-ridden country, the town keeps no force and stands unwalled.
   - `[face]` Nothing defends the town, and beasts have the country.
   - `[face]` Unwalled and without a force, the town sits in a country given to creatures.
3. `[visitor]` `[plain]` Nothing at the edge of {settlement} is walled or held, and the country outside is plagued.
   - `[face]` Creatures are loose in the country, and the edge of {settlement} is open and unheld.
   - `[face]` No wall and no force stand at {settlement}, and beasts are what the country holds.
   - `[face]` Beasts range the country, and {settlement} shows neither wall nor force.

--- NOTES

### A. What the card licenses, and the claim every wording carries

The card's `may claim` line is one clause: that `beastsRowSituation(family, perimeter, force) === plagued country, neither` holds, as a STANDING fact of the record. That single predicate has two readable halves — the FAMILY half (the country is plagued with the beasts-and-monsters family) and the NEITHER half (no perimeter, no force). Every one of the twelve wordings asserts exactly those two halves and nothing else, so the four wordings of each variant are claim-equal (arm A6) and the three variants are claim-equal to each other, which is what the pool held before.

Per-face licensing, clause by clause:

| wording | clause | card clause that licenses it |
|---|---|---|
| 1 `[plain]` | "the country around {settlement} is thick with creatures" | `may claim` (the FAMILY half of the predicate); `bag {settlement}` FILLED at this block's call sites |
| 1 `[plain]` | "the town has no force and no wall" | `may claim` (the NEITHER half: perimeter false, force false) |
| 1 face i | "in a country worked by beasts" / "keeps no perimeter and no force" | `may claim`, both halves; slot from the card bag |
| 1 face ii | "Beasts hold the country around {settlement}" / "shows no line and keeps nothing under arms" | `may claim`, both halves |
| 1 face iii | "Creatures have the run of the country" / "{settlement} is without wall or force" | `may claim`, both halves |
| 2 `[plain]` | "The town does not defend itself." | `may claim`, the NEITHER half stated as the town's standing practice |
| 2 `[plain]` | "The country around it is full of beasts" / "neither walled nor armed" | `may claim`, both halves |
| 2 face i | "In a beast-ridden country" / "keeps no force and stands unwalled" | `may claim`, both halves |
| 2 face ii | "Nothing defends the town" / "beasts have the country" | `may claim`, both halves (the NEITHER half compressed to its conjunction, under the density law §21.4) |
| 2 face iii | "Unwalled and without a force" / "a country given to creatures" | `may claim`, both halves |
| 3 `[plain]` | "Nothing at the edge of {settlement} is walled or held" / "the country outside is plagued" | `may claim`, both halves; `plagued` is the predicate's own state word |
| 3 face i | "Creatures are loose in the country" / "the edge of {settlement} is open and unheld" | `may claim`, both halves |
| 3 face ii | "No wall and no force stand at {settlement}" / "beasts are what the country holds" | `may claim`, both halves |
| 3 face iii | "Beasts range the country" / "{settlement} shows neither wall nor force" | `may claim`, both halves |

Slots: variant 1 and variant 3 carry `{settlement}` in all four wordings, variant 2 carries none — each face's slot set equals its parent's, which is ARCH §2.5's face refusal ("a face whose `{slot}` set differs from the parent's"). `{band}` is RESERVED and `{route}` is unfilled at this block's call sites, so neither appears, and no wording names a road, an approach route or any other geography the card does not read.

Walls checked on every wording: no digit, no percent, no em dash, no exclamation, no question, no `which`-clause, no first or second person, no future indicative, no citation, no named character, no deity, no season, no count, no cause, no invented office. One semicolon in twelve wordings (variant 1, face ii). Word order across the pool alternates country-first and town-first so no order runs the pool. No two of the twelve wordings share their first two words, and exactly one wording opens on the settlement token (variant 1, face i), inside R-DA-17's per-pool ceiling.

Closes vary in kind (R-DA-04): an absence ("no wall", "neither wall nor force"), a standing condition of the country ("beasts", "creatures", "what the country holds"), and an object at the edge ("under arms", "unheld"). No pronoun closer anywhere.

### B. Word counts

| variant | plain | face i | face ii | face iii |
|---|---|---|---|---|
| 1 `[ledger]` | 17 | 13 | 16 | 14 |
| 2 `[street]` | 22 | 12 | 9 | 14 |
| 3 `[visitor]` | 16 | 15 | 15 | 11 |

Twelve wordings, mean 14.5 words, sd 3.29. Every wording is shorter than the sentence it replaces (before: 33, 29 and 30 words), which is editing inside the band and not a trim under §22 — no sentence, variant, face slot or pool is removed.

### C. CLAIMS DROPPED FROM THE BEFORE — a claim-set change, reported, not smuggled

Three of the shipped variants carried claims the card does not license. Under ruling 5 as R-DA-15 applies it ("an unlicensed office, count or exemption is not a claim the pool was entitled to hold — ruling 5 requires its removal; the B-CLAIM bar is not engaged"), these are removed rather than carried, and every removal is listed here for the chair. If the chair rules any of them licensed by a read the card does not print, the affected faces need a re-draft.

- **Variant 1** — "and no specialist recourse": a third institution absence; the card reads only `family, perimeter, force` and its `may NOT` bars a second fact. **"and survival here rests on terrain, distance and the ability to leave"**: a GEOGRAPHY move with no geography field, a means-and-cause clause (`may NOT: a cause`), and a behavioural claim about the inhabitants.
- **Variant 2** — "What it does is watch, and move, and hope the pressure goes around it": an act set no field holds plus a motive; FEELING is a non-move estate-wide (MOVE-GRAMMAR §1.3). **"and that is understood by everyone in it"**: a totality over persons, the card's first REFUSED COLUMN, always.
- **Variant 3** — "A stranger arriving at {settlement}": a PERSON move with no role field. **"understands the danger before anybody explains it"**: an interior state, and a near-totality over persons. **"because nothing about the place is arranged as though danger were expected to be met"**: a cause joined to a counterfactual expectation.

### D. REFUSALS — laws this pool cannot meet inside its card

1. **The distinct-grammar floor cannot be met at three.** MOVE-GRAMMAR §3.2 asks a pool of k variants for min(k, |set|) distinct level-1 grammars. On this card only V1 (PRESENT) and V3 (PRESENT → LACK) are licensable — V2, V4, V5, V6, V7 and V8 each need a field the card does not read (a structural-consequence field, a named object, an institution row, an unresolved state value, event provenance, a `not-held` record field). The pool therefore carries two grammars across three variants and varies the ORDER of the predicate's two halves inside them. Not curable by wording; a chair row.
2. **The within-pool length spread sits under its floor.** R-DA-05 asks within-pool sd ≥ 4.0; this pool measures 3.29 with one fact and two halves to state. Reported as a band distance (the band is a licence, the distance is information, §16/§21.1), not a wall.
3. **The card refuses "a standpoint" while the pool's typed angle tags are `[street]` and `[visitor]`.** The tags are not mine to touch, so the faces realise the angles without asserting an observer: `[street]` as the town's ordinary practice, `[visitor]` as the outside-in order and the outward-facing nouns (the edge, what stands, what the country holds). No wording asserts that anyone sees, understands or expects anything. If the chair reads the `[visitor]` tag as licensing an observer, variant 3's four wordings are the ones to re-draft.
4. **No provenance citation is written, deliberately.** The card marks the muster as a licensed standing source, but §24 caps provenance at one citation per unit AND only for one of S3's three reasons — two accounts that disagree, a count from an interested party, a record whose keeper is a power. None obtains here: the card holds one account, no count, and no power's record. MOVE-GRAMMAR §4.4.3 also makes a citation on a fact whose holder is the office itself a finding. The exemplar registers cite at zero per 786 sentences; silence is the lawful reading.
