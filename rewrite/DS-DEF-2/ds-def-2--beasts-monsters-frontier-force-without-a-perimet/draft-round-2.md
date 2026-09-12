# DRAFT ROUND 2 — DS-DEF-2 · `Beasts & Monsters: frontier, force without a perimeter`

Seat: Opus WRITER (Fable-unvalidated), for the Fable chair. Written under **ADDENDUM 14** (a face is lawful unless it contradicts the record; silence is permission), the four floors, the DEFENSE desk rows of `rewrite/recut/CONTRADICTION-TABLE.md`, and the marker's `skeleton.md` in this directory. No dock was entered; only the read-only licence-card script was run.

**3 variants · 12 faces** (each variant: the numbered line plus three `[face]` sub-rows). Vids, order and angle tags unchanged. Slot sets unchanged: vid 1 and vid 2 carry `{settlement}`, vid 3 carries none. No face and no variant line opens on a `proper`-typed slot (ARCH §2.5 T-F8; R-DA-17 wall 10). No em dash, no exclamation, no digit, no `which`-clause, no `[plain]` marker. **Refusals: none.**

## THE GATE'S FEEDBACK, ANSWERED

The gate returned ONE failing owned measure on round 1:

> band depth · `punctuation.colonRate` (over) = 6.987 band-widths on 1 of 12 face(s)

**The face was 2c, and it was the pool's only colon.** Round 1 landed its three reads as a list hung off a colon (`... before anybody explains it: frontier country, armed people, and no work standing between the country and the town`). One colon on a one-sentence face is a rate of one per sentence against a colon band whose exemplar ceilings run 0.102 to 0.364 per variant, so the single joint carried the whole distance.

**The cure is a construction change, not a punctuation swap.** The list is not re-hung on a comma or a dash (a dash is a wall) and the reads are not dropped. Face 2c is rebuilt as two sentences: the observation keeps its opener and its verb, and the three reads become a plain three-limb predicate sentence of their own, each limb with its own subject and finite verb. The face now carries **zero** colons, zero semicolons and zero dashes; the pool carries zero of all three across all twelve faces. Measured delta: `colonRate` 1 of 12 faces → 0 of 12.

**Nothing else moved.** The other eleven faces are byte-identical to round 1, because the gate reported no other owned measure outside depth and the craft spread (twelve openers, no shared construction) was already carried. The one changed face keeps its opener (*Anyone arriving*), its position as the pool's one all-three-reads face, and its word count inside round 1's measured range.

---

## THE ROWS, READY TO PASTE

**`Beasts & Monsters`: `frontier`, force without a perimeter**
1. `[ledger]` The frontier country around {settlement} is answered by armed people and by no wall at all. Whatever comes chooses the place, and the town arrives afterwards.
   - `[face]` Nobody is stopped on the way into {settlement} and nobody is turned away. What the town has is a muster, and a muster is in one place at a time.
   - `[face]` Nothing is kept out of {settlement}. What comes off the frontier is met by the town's own people, inside the town.
   - `[face]` Wherever the people under arms at {settlement} stand, the houses furthest out are on the wrong side of nothing at all.
2. `[visitor]` A stranger reaches {settlement} without being stopped, asked or turned aside. Whoever the town has under arms is met further in, and met by accident.
   - `[face]` The last house on the way into {settlement} is simply the last house. A stranger is well inside the town before meeting anybody armed.
   - `[face]` By whatever way a traveller comes to {settlement}, nothing on it says where the town begins. The people who would do the meeting stand somewhere within, and where they are wanted is not their choice.
   - `[face]` Anyone arriving at {settlement} can see the arrangement whole before anybody explains it. The country is frontier, the answer to it is people under arms, and no work stands between the two.
3. `[street]` The town can answer trouble and cannot prevent it, and whether the one is worth as much as the other is an argument that stands open.
   - `[face]` Word comes in at night and the muster goes one way and not the other. The part of the town it leaves behind is a part of the town.
   - `[face]` The town does not close at dark, and it does not pretend to. Trouble is answered where it happens to be, and answering is all the town claims.
   - `[face]` The complaint in the town is not that it keeps armed people. It is that armed people go to a place, and the places they do not go to are also the town.

---

## --- NOTES

**No refusals.** Every variant is written lawful. The two shipped faults named at skeleton §X.2 are gone: `soldiers` (vid 2, CR-1 — contradicted on the militia half of the preimage) is replaced everywhere by a class-blind naming of the force, and `every season` (vid 3, CR-15 — F2-02 and F2-06 together) is replaced by a standing-open argument that carries no clock.

**The pool's whole discipline, obeyed in every one of the twelve.** `garrison || militia` is one boolean over a part-time citizen body and over multiple standing garrisons, so no face predicates the body's kind. The namings used are *armed people* · *a muster / the muster* (F1-03: "the muster" as the class word is free everywhere) · *the town's own people* · *the people under arms* · *whoever the town has under arms* · *anybody armed* · *the people who would do the meeting* · *people under arms* (2c). None of them is `soldiers`, `professionals`, `full-time`, `the garrison`, `the militia`, `armed citizens`, `townspeople` or `the able-bodied` (CR-1, CR-2); none is `the watch` (CR-3); no muster ROLL is cited as a record (CR-9 / F1-24, the `muster` holder resolving only on the militia half).

**Unread buckets left alone.** Watch, mercenary, charter and magicDef are unread by this key, so no face asserts or denies any of them (CR-5, CR-6, CR-7). Every absence written is narrowed to the walls bucket or to `hasGates` — `no wall at all`, `no work stands between the two`, `nothing on it says where the town begins`, `the town does not close at dark` — and never to defence in general, which is why no face says "and nothing else". Note in particular that 2c's rebuilt second sentence says *the answer to it is people under arms*, never "the defence is people": the former names what answers the frontier and leaves every unread bucket untouched, while the latter would have been a totality over the defence class and would have collided with `magicDef` on part of the preimage.

### Variant 1 · `[ledger]` · slot `{settlement}`

| face | claim | what licenses it |
|---|---|---|
| 1 (line) | frontier country around the town | `measuredMonsterFamily(config.monsterThreat) === 'frontier'`; the card's predicate. The tier word is the engine's own, one of exactly three (`monsterThreat.js`) |
| | answered by armed people | `garrison.present \|\| militia.present === true` (`defenseStateProse.js`). Class-blind, so true on both halves of the preimage |
| | and by no wall at all | `standingDefenseForces(settlement).walls.present === false`; the walls bucket (`defenseInstitutionBuckets.js`). Narrowed to the walls class, so it denies no unread bucket |
| | whatever comes chooses the place | the branch's own reading (`threatAssessment.js`), and a capability clause under the block's PROVENANCE fence. No creature named, no incident (CR-13); `whatever comes` kept from the shipped line as the marker asked (§V1.8) |
| | the town arrives afterwards | kept verbatim (§V1.8). A standing disposition; no elapsed course, no tense beyond the habitual present (CR-16) |
| 1a | nobody is stopped on the way in, nobody is turned away | `hasGates` is necessarily FALSE on this key (`priorityHelpers.js`: every member of its keyword set also matches the walls bucket), and `safetyProfile.js` prints the engine's own denial on the same dossier — *no gates to bribe and no checkpoints to avoid*. Skeleton §4 and §9(b) |
| | a muster is in one place at a time | a SHAPE claim, never a number (§9(c); CR-14 bars counting the ways in and does not reach a claim about position). `the muster` is the free class word (F1-03) |
| 1b | nothing is kept out | the perimeter read and `hasGates` together; the sibling key `frontier, credible deterrence` names the rejected alternative, so the contrast is sibling-licensed (R-DA-02) and is used once in the pool |
| | met by the town's own people, inside the town | the force read, class-blind; the reactive consequence at the key's own grain, so the continuous `scoreBand(scores.monster)` badge beside the row cannot collide (CR-22 / §1.6 W-10) |
| 1c | wherever the people under arms stand | deliberately unlocated: it asserts no position, so it holds from a hamlet's citizen militia to a metropolis's multiple garrisons |
| | the houses furthest out are on the wrong side of nothing at all | the perimeter absence, taken as a present consequence rather than a story (§9(c), §9(f)); a superlative of position, not a magnitude (CR-14); no founding and no non-building narrated (CR-17) |

### Variant 2 · `[visitor]` · slot `{settlement}`

| face | claim | what licenses it |
|---|---|---|
| 2 (line) | a stranger reaches the town without being stopped, asked or turned aside | `hasGates` false + `safetyProfile.js`. W27's stance rules are struck, so a stranger may act, be turned away or not be turned away |
| | whoever the town has under arms is met further in, and met by accident | the force read, class-blind; an observable of the two facts already stated, with no interior assigned to the stranger. Deliberately **not** the sibling `Invasion & War` sentence printed two paragraphs below (*A stranger sees soldiers at {settlement} and no line for them to stand behind*) — different opening, different verb, different observation (CR-25 / §X.5) |
| 2a | the last house is simply the last house | the perimeter absence read as the town having no marked edge; §9(b). An object-first opening (V4), the one face in the pool that leads on a built thing |
| | a stranger is well inside the town before meeting anybody armed | the force read and the perimeter read together; no distance and no count (CR-14) |
| 2b | by whatever way a traveller comes, nothing on it says where the town begins | the perimeter absence. Note the discipline on CR-12: the claim is about the town's want of a marked edge, never about the country's terrain or route, neither of which this key reads |
| | the people who would do the meeting stand somewhere within | the force read, subjunctive, unlocated |
| | where they are wanted is not their choice | the branch's own reading (*attackers choose the point of engagement*), written as a standing capability and not as an event |
| **2c (REBUILT THIS ROUND)** | the arrangement is seen whole before anybody explains it | the perimeter absence and the force read as an observable of arrival; the `[visitor]` stance's standpoint, which is licensed (the standpoint prohibition is STRUCK) |
| | the country is frontier | `measuredMonsterFamily(config.monsterThreat) === 'frontier'`; the card's predicate, in the engine's own tier word |
| | the answer to it is people under arms | `garrison.present \|\| militia.present === true`, class-blind. *The answer to it* is scoped to the frontier country named in the same sentence, so it totalises nothing and reaches no unread bucket |
| | no work stands between the two | `walls.present === false`, narrowed to the works class exactly as the other eleven faces narrow it. Simple habitual present, the floor-2 instrument; no magnitude, no distance, no duration |

### Variant 3 · `[street]` · NO SLOT (all four faces carry none, per ARCH §2.5)

| face | claim | what licenses it |
|---|---|---|
| 3 (line) | the town can answer trouble and cannot prevent it | kept verbatim as the marker asked (§V3.8): the pool's thesis, class-blind, tense-free, and true of every town in the preimage. The force read and the perimeter read as capabilities, which is exactly what the block's PROVENANCE fence licenses |
| | whether the one is worth as much as the other is an argument that stands open | the register card's *one matter left standing open*, and §9(d). Replaces the shipped `every season`: no clock, no rate, no duration (F2-02, F2-06). It is a comparison between two capabilities, never a comparative against an earlier state (F2-05) |
| 3a | word comes in at night and the muster goes one way and not the other | habitual present, no event narrated (CR-13, F2-04); a direction, never a count (CR-14); `the muster` is the free class word |
| | the part of the town it leaves behind is a part of the town | §9(c) landed on a household as a standing fact. The unnamed people here are a plural and a place, never the singular office the tier seats (CR-19 / F3-06) |
| 3b | the town does not close at dark, and it does not pretend to | `hasGates` false; the `[street]` stance's licence to state what the town does not pretend. Time of day, not a date, a season or a duration (F2-02) |
| | trouble is answered where it happens to be, and answering is all the town claims | the force read and the reactive consequence, at the key's grain |
| 3c | the complaint in the town is not that it keeps armed people | the force read, stated as the town's own understanding of it; the exemplar's COMPLAINED-OF door. No interior is reported and no totality over persons is asserted (a REFUSED COLUMN on the card). The claim is what the complaint is about, never what minds hold |
| | armed people go to a place, and the places they do not go to are also the town | §9(c) again, from the street rather than the record; a shape claim, no magnitude |

### Two craft notes the chair may want on the record

1. **The tier word is carried by five of the twelve faces** (1, 1b, 2b as *the country*, 2c, and by implication in 3). It is not forced into all twelve: the shipped `[visitor]` and `[street]` variants both omitted it (skeleton §V2.4, §V3.4), and an unweighted seeded roll draws one face at a time, so every face stands alone on the force read and the perimeter read, which are the two the whole preimage shares.
2. **Twelve constructions, twelve openers, unchanged by the cure.** *The frontier country · Nobody · Nothing · Wherever · A stranger · The last house · By whatever way · Anyone arriving · The town can · Word comes · The town does not · The complaint.* No face is a permutation of a sibling, none swaps the halves of one `A, and B` join, and the pool spends no single noun more than three times across its twelve renderings. The rebuilt 2c keeps its opener and its unique job in the pool (the one face that lands all three reads), so the cure costs the spread nothing.

### The twelve faces, measured

| face | words | sentences | slot | opener | round 2 |
|---|---|---|---|---|---|
| 1 (line) `[ledger]` | 26 | 2 | `{settlement}` | The frontier country | unchanged |
| 1a | 30 | 2 | `{settlement}` | Nobody | unchanged |
| 1b | 21 | 2 | `{settlement}` | Nothing | unchanged |
| 1c | 21 | 1 | `{settlement}` | Wherever | unchanged |
| 2 (line) `[visitor]` | 25 | 2 | `{settlement}` | A stranger | unchanged |
| 2a | 24 | 2 | `{settlement}` | The last house | unchanged |
| 2b | 35 | 2 | `{settlement}` | By whatever way | unchanged |
| 2c | 32 | 2 | `{settlement}` | Anyone arriving | **REBUILT** (was 27 words, 1 sentence, 1 colon) |
| 3 (line) `[street]` | 26 | 1 | none | The town can | unchanged |
| 3a | 29 | 2 | none | Word comes | unchanged |
| 3b | 28 | 2 | none | The town does not | unchanged |
| 3c | 33 | 2 | none | The complaint | unchanged |

Range 21 to 35 words, the same range as round 1; 2c's move from 27 to 32 words stays inside it and breaks no neighbour pairing (2b is 35 and two sentences, 3 is 26 and one, so no two consecutive faces share a length and a grammar — R-DA-05). Mechanically checked over the row region: **zero colons**, zero semicolons, zero em dashes, zero exclamation marks, zero digits, zero `, which` tails, zero `[plain]` markers, and no face or variant line opening on a `proper`-typed slot.
