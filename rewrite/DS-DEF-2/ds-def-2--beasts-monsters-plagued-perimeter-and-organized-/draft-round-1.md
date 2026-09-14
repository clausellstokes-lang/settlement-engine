# DRAFT ROUND 1 — DS-DEF-2 · pool `Beasts & Monsters: plagued, perimeter AND organized force`

Seat: Opus 5 (writer, Fable-unvalidated). Test: **ADDENDUM 14** — a face is LAWFUL unless it CONTRADICTS the record; silence is permission.
Written to `rewrite/DS-DEF-2/ds-def-2--beasts-monsters-plagued-perimeter-and-organized-/skeleton.md`, the licence card, and `rewrite/recut/CONTRADICTION-TABLE.md`.
Status: COMPLETE — three variants, twelve faces.

---

## THE ROWS (paste under the pool's bold heading; replaces the three shipped variant rows entire)

1. `[ledger]` The country around {settlement} is thick with creatures. The wall's keeping and the patrols' provisioning fall under one heading, and an argument about either is an argument about both.
   - `[face]` A wall, a muster and a bounty purse are what the accounts at {settlement} carry. The bounty is the entry people ask after, and what it is paid for is out in the country.
   - `[face]` Creatures are a standing entry in the country around {settlement}, not a piece of news. The wall stands, the people are under arms, and the returns carry the cost of both.
   - `[face]` The roll at {settlement} says who can be put out, and those who go into the country say what part of it they will not cross alone. Both entries stand in the record.
2. `[street]` Defense at {settlement} is not an emergency arrangement. The wall has people on it, the patrols go out, and what they go out into is full of creatures.
   - `[face]` The gate at {settlement} takes the day's last traffic and then the bar goes across, and what is outside the bar stays outside until morning.
   - `[face]` Money, not creatures, is what gets argued over at {settlement}. The bounty is the item, and the arguing is done where the muster can hear it.
   - `[face]` A stretch of the road out of {settlement} is not taken alone. The town does not think that needs explaining, and it keeps a wall up and a guard on it all the same.
3. `[unfolding]` What stands at {settlement} is a wall and a muster. What is left open is the country beyond them, and it is full of creatures.
   - `[face]` The wall at {settlement} is older work than the purse that keeps it up, and the guard is paid out of that purse. Neither says anything about what is in the country tonight.
   - `[face]` The people who walk the wall at {settlement} tell the country one way and the people who pay for the walking tell it another, and the town takes neither side.
   - `[face]` A wall is up at {settlement} and a muster with it. Beyond both lies the country, and it keeps its creatures.

--- NOTES

**REFUSALS: none.** All three variants are written lawfully in place under their own vids and their own angle tags; nothing is added, removed or merged; no variant is banked.

**The card's clauses, as used below.**
- **[R1]** the card's `may claim`, first conjunct: `family === 'plagued'` — the COUNTRY around the town carries creature activity, at the top rung of the closed three-rung band, as a STANDING fact.
- **[R2]** the card's `may claim`, second conjunct: a wall-class body STANDS on the live roster (presence only; no row, no material, no geometry, no condition).
- **[R3]** the card's `may claim`, third conjunct: an organized force STANDS (garrison bucket OR militia bucket); spoken only in a class word.
- **[SOURCE]** the card's `source: muster · standing LICENSED` — the muster's holder always resolves on this key, so the roll, the returns, the accounts and the entries are citable; never a number on them.
- **[BAG]** the card's `bag`, FILLED `{settlement}`: every face carries exactly that slot, once, and never opens on it.
- **[MODEL]** the engine's own positive model, affirmatively true and therefore sayable: ONE multiplier over wall maintenance and force wages together (`defenseGenerator.js:182`, `:189-192`; F4-02), the gate on this row named *patrol provisioning* with bounty purses in the generator's own comment (`defenseDisplay.js:279`; `defenseGenerator.js:213-215`), and a pay floor that makes pay short or late but never none (F4-04).
- **[SILENCE]** ADDENDUM 14: the record neither carries nor denies it, so it is lawful. Named here so no refuter reads an omission as a claim.

**Variant 1 · `[ledger]`**
1. *the country is thick with creatures* **[R1]** — the top rung restated in English, carried from the shipped row on the marker's §1 claim 3 reading. *the wall's keeping and the patrols' provisioning fall under one heading* **[R2][R3][MODEL]** — the one-purse fact, stated without direction, so neither gate is said to be paid while the other is not. *an argument about either is an argument about both* **[SILENCE]** — a dispute, no shortfall asserted.
2. *the accounts carry a wall, a muster and a bounty purse* **[R2][R3][SOURCE][MODEL]**. *the bounty is the entry people ask after* **[SILENCE]** — unnamed persons, no office. *what it is paid for is out in the country* **[R1]** — the threat stays country-scoped, which is what keeps the face off F1-34.
3. *creatures are a standing entry in the country, not a piece of news* **[R1]** — the rung as a standing condition, and the negation refuses the event framing rather than asserting one. *the wall stands, the people are under arms* **[R2][R3]**. *the returns carry the cost of both* **[SOURCE][MODEL]**.
4. *the roll says who can be put out* **[R3][SOURCE]** — the muster's own record, no number on it (F2-01; §R-8). *those who go into the country say what part of it they will not cross alone* **[R1][SILENCE]** — a class of witness, unnamed and plural. *both entries stand in the record* **[SOURCE]** — two accounts, neither settled; the pool's one citation face.

**Variant 2 · `[street]`**
5. *defense is not an emergency arrangement* **[SILENCE]** — a negated characterisation, denying no field. *the wall has people on it* **[R2][R3]** — manning is not entailed by a walls row and is not denied by one; the engine positively puts people on this gate. *the patrols go out* **[R3][MODEL]** — `patrol` is a force-class token, free anywhere (F1-01's own note). *what they go out into is full of creatures* **[R1]**.
6. *the gate, the day's last traffic, the bar* **[R2][SILENCE]** — every stock walls row on this key satisfies `hasGates`; the traffic and the bar are silence. *what is outside the bar stays outside until morning* **[SILENCE]** — a simple habitual, no rate and no schedule kept.
7. *money, not creatures, is what gets argued over* **[R1][SILENCE]**. *the bounty is the item* **[MODEL]**. *the arguing is done where the muster can hear it* **[R3][SILENCE]** — the force in its class word, an audience, no count and no shortfall.
8. *a stretch of the road is not taken alone* **[R1][SILENCE]** — the country's rung met at the grain a person meets it at; a habitual, no rate. *the town does not think that needs explaining* **[SILENCE]** — the town as the street's collective subject, no totality over persons and no mental state assigned to anybody named. *it keeps a wall up and a guard on it* **[R2][R3]** — "the guard" is the engine's own word wherever a law body resolves, and on this key one necessarily does (`safetyProfile.js:271`, `:336`; F1-04, R-5).

**Variant 3 · `[unfolding]`**
9. *what stands is a wall and a muster* **[R2][R3]** — the plain present, replacing the shipped perfect. *what is left open is the country beyond them* **[R1]** — the open matter, stated as a standing condition and not as a course. *it is full of creatures* **[R1]**.
10. *the wall is older work than the purse that keeps it up* **[R2][SILENCE]** — a relative age, which F2-07 licenses explicitly and which denies no printed age. *the guard is paid out of that purse* **[R3][MODEL]** — pay asserted, never its absence (F4-04's floor). *neither says anything about what is in the country tonight* **[R1][SILENCE]** — the record's silence written as the open matter.
11. *the people who walk the wall* **[R2][R3]**; *the people who pay for the walking* **[MODEL]**; *tell the country one way and another, and the town takes neither side* **[R1][SILENCE]** — two accounts unadjudicated, both parties plural and unnamed.
12. *a wall is up and a muster with it* **[R2][R3]**. *beyond both lies the country, and it keeps its creatures* **[R1]** — the flat short line the register keeps for the matter that is settled, landing on the read's own noun.

**WHAT WAS DROPPED FROM THE SHIPPED ROWS, and on which law**
- *has answered it properly* — the verdict falls to F1-40 (the badge beside this prose reaches CRITICAL over this key's own domain) and the perfect falls to F2-05.
- *both are in use constantly* — F2-06, a rate welded to a habitual.
- *it is the week's work* / *on time* — F2-06 again, twice.
- *nobody treats any of it as unusual* — the card's `REFUSED COLUMNS` line (a totality over persons), and it would read absurd under the siege, occupation, famine or quarantine banner this key never consults.
- *the rotations run* — kept in substance as *the patrols go out*; "rotations" is the engine's WATCH word on this branch (`threatAssessment.js:58`) and a watch is impossible on a militia town (F1-01, F1-26).
- *has built* — F2-05's perfect; replaced by *what stands* and *a wall is up*.
- *is holding against the pressure* — F2-05's durative and an outcome the pulse adjudicates.
- *is being spent doing it* — F4-01: no material decay clock exists anywhere in the engine.
- *the posture is survivable* and *survivable is the most that can be said of it here* — F1-40 and F2-05, plus the summarising gloss.

**WHAT WAS ADDED, and why none of it is a claim**
The bounty purse, the returns, the roll, the bar at the gate, the last traffic of the day, the stretch of road nobody crosses alone, the argument over money, the people who walk the wall against the people who pay for the walking, and the wall older than the purse that keeps it. Not one of these is denied by a field, a flag, a band, a label or a roster row on any town in this key's preimage; under ADDENDUM 14 silence is permission. Every one of them is either the engine's own furniture for this exact gate or a plot hook a game master can start a session with, which is what the re-cut asks for.

**THE THREE RESIDUAL RISKS, named so the refuters rule on them rather than discover them**
1. **The gate (face 6).** `hasGates` matches every walls-class row the catalogue seats, so a gate is true across the stock domain; it turns false only on a live roster whose sole walls row is `Citadel`, or on a custom rampart, where `safetyProfile.js:463-464` prints "no gates to bribe" (F1-08). One face of twelve rests on it, deliberately, because the marker's §2 flavour row names the gate as the pool's largest unused ground. If the chair rules the citadel edge binds, the cure is to move that face's scene inside the wall rather than at its opening.
2. **The road (face 9).** `config.terrainType` and `tradeRouteAccess` print on the overview and this key reads neither (F1-102). The face names no route class, no access band and no terrain: "a stretch of the road out of {settlement}" asserts only that a way out exists, which no field denies and which an `isolated` town still has.
3. **`thick with creatures` (face 1).** Carried verbatim from the shipped row on the marker's own contested reading (skeleton §1 claim 3): an intensity at the top rung of a closed three-rung band is the band restated in English, not a magnitude the read does not carry. If the chair reverses it, the cure named by the marker is the rung itself and not a plainer word.

**THE POOL AS A WHOLE (the DULL check, answered before it is asked)**
- Twelve faces, twelve distinct openings: *The country around · Defense at · What stands at · A wall, a muster · Creatures are · The roll at · The gate at · Money, not creatures · A stretch of · The wall at · The people who · A wall is up.* No two numbered lines share their first two words; no face opens on `{settlement}`.
- Twelve distinct constructions: the one-purse entry · the negated characterisation · the double relative · the itemised list · the classification plus its cost · the two-witness citation · the gate scene · the inverted subject · the road habit and the town's silence · the relative age · the two-account disagreement · the short flat close.
- The landings vary in kind and are civic: *both · creatures · creatures · the country · both · the record · morning · hear it · all the same · tonight · neither side · its creatures.*
- Lengths run 21 to 34 words; five faces are one sentence in effect and none exceeds two; the shortest is the last of the pool, as the register wants.
- Lexicon: 130 distinct words over 349 tokens. `country` falls once every forty-four words against the corpus tic's once every twenty-one. No evaluator adjective, no mood noun, no copula dodge, no gloss tail, no summarising close, no tricolon by habit, no *testament*, *resilience*, *infrastructure*, *community* or *posture*.
- Four unnamed persons or classes of person act across the pool and not one is named, and not one occupies the singular office the tier emits (F3-06).
- One matter is left standing open in every variant and is closed nowhere: what is in the country.

Status: **COMPLETE** (2026-09-12). Twelve faces on disk. Written section by section under the checkpoint law. Nothing outside this packet file was written anywhere; the only command run in `laneRW-DEF2` was the read-only licence-card script, and every other lane touch was a file read.
