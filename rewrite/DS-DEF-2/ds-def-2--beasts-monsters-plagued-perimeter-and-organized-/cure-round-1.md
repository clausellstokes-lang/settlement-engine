1. `[ledger]` The country around {settlement} carries creatures. Entered to the town's name are a wall and a muster.
   - `[face]` The works at {settlement} are carried standing, and the muster with them, in a country where the creatures are.
   - `[face]` Creatures range the country around {settlement}, and the town's wall and the muster are carried standing.
   - `[face]` The town's force and the works are entered as standing at {settlement}, and creature country lies around the town.
2. `[street]` Defense at {settlement} includes a wall and a muster, and creatures press the country outside.
   - `[face]` The town has a wall at {settlement} and a muster of its own, and the creatures are out in the country.
   - `[face]` A wall and a muster stand at {settlement}, and the country around the town carries creatures.
   - `[face]` The creatures are in the country around {settlement}, and the town has a wall and a force.
3. `[unfolding]` What {settlement} has built is in place and the muster with it, and the creature pressure out of the country stands unmet.
   - `[face]` The wall at {settlement} stands and so does the muster, and the pressure from the country's creatures lies open.
   - `[face]` At {settlement} the muster stands and the wall as well, and the pressure of creatures in the country stands open.
   - `[face]` Both the works and the town's force at {settlement} are in place, and the pressure out of the country, where the creatures are, is unsettled.

--- NOTES

Cure round 1 · pool `Beasts & Monsters: plagued, perimeter AND organized force` · 5 targets, 5 cured, 0 refused.
Baseline: the annex at HEAD `471ce894a83658b0e0fe480819a9f1dcd22605e3` (lines 2596-2607). The seven non-target faces are
BYTE-IDENTICAL to that baseline (verified by `diff`: five hunks, the five targets, nothing else). Mechanical sweep of
the twelve rows: no em dash, no exclamation, no digit in prose, no `which`, no `garrison` / `militia` / `watch` / `gate`
/ material word; every row carries exactly one slot and it is `{settlement}`; the three numbered lines keep their
openers `The country` · `Defense at` · `What {settlement}` and none opens on the slot.

**V1 face 2 — CURED.** Was: `Creatures range the country around {settlement}, and the town's wall and its muster both
stand.` Now: `Creatures range the country around {settlement}, and the town's wall and the muster are carried
standing.` The named breach W1 is cured by W1's SECOND lawful form: the binding possessive `its` is dropped and the
second body stands as the bare class word `the muster` (the possessor stays seated on the town for the first body,
`the town's wall`). The refuter's secondary ground — a `[ledger]` face with no ledger surface — is cured by restoring
the office's own formula `are carried standing` (R-vi / W7: the office's formula is the ledger's lawful surface; no
record noun, no citation, no agent-source, so the provenance budget of zero is untouched, W24). The construction
contract (W4) is kept: the subject is still the creatures, the order is still R1 then R2+R3, and the landing is the
standing itself — distinct in all three from face 0 (country subject, two sentences, the inverted entry), face 1
(works subject, R2+R3 then R1) and face 3 (bodies subject, R3+R2 then R1). The formula it now shares with face 1 is
the office's own and the register card licenses the WORD to recur; the A5 conviction on face 3 required the same noun
pair UNDER the same formula, and this face's pair (`the town's wall` + `the muster`) is not face 1's (`The works` +
`the muster`) and its formula is not face 0's (`Entered to the town's name`). Claims, each with its law: `Creatures
range the country around {settlement}` = R1, the `plagued` tier stated over the COUNTRY (W2; `creatures` is the
engine's own noun, `threatAssessment.js:52`), layer NONE; `the town's wall` = R2, `forces.walls.present`, the walls
bucket's class word (W15), layer BODY; `the muster` = R3, `garrison || militia`, the always-safe class word for the
paid military (ADDENDUM 13 A.5), layer BODY; `are carried standing` = the card's `may claim` (a STANDING fact of the
record) in the ledger's stance. Nothing added: no count, no magnitude, no cause, no relation between the three reads,
no manning, no season, no verdict, no record noun.

**V1 face 3 — CURED, with the model cure adapted for an opener collision.** Was: `A wall and a muster are entered as
standing at {settlement}, and creature country lies around the town.` Now: `The town's force and the works are entered
as standing at {settlement}, and creature country lies around the town.` The named breach (A5 / the four-faces rule:
the body half was face 0's clause turned over, the same noun pair under the same office formula) is cured by the
distinct wall-and-force spelling the refuter named — `the works` for R2 and `the town's force` for R3, both ratified
always-safe class words (W15). The refuter's model sentence put the pair in the order `The works and the town's
force`, which opens on `The works` and would collide head-on with face 1's opener `The works at {settlement}` (face 1
is the REVERTED draft face the judgment installed after the refuter wrote this cure, so the collision did not exist on
the rows the refuter read); the pair is therefore stated force-first, which also gives this face an order of the reads
(R3 then R2 then R1) that no sibling carries. Openers within the variant are now `The country` · `The works` ·
`Creatures range` · `The town's`, all distinct. The office formula `are entered as standing` is kept from the model
cure and is now carried by a noun pair disjoint from face 0's (`a wall and a muster`), which is exactly what the A5
finding asked for. Claims: `The town's force` = R3 (class word, layer BODY, the possessor seated on the town per W1);
`the works` = R2 (true of every member of the walls bucket, so it reads true on a hamlet's berm and a city's masonry
alike, W15/W11 — no material is named); `are entered as standing` = the card's `may claim` in the ledger's stance
(R-vi/W7, no citation); `creature country lies around the town` = R1, country-scoped (W2), layer NONE, `the town`
co-referring with `{settlement}` and carrying the thread (J-1). The second clause is kept verbatim from the baseline,
so nothing licensed by the card was dropped and nothing was added.

**V2 face 0 — CURED.** Was: `Defense at {settlement} is a wall and a muster, and creatures press the country outside.`
Now: `Defense at {settlement} includes a wall and a muster, and creatures press the country outside.` The named breach
(the card's `may NOT: a count`; C7) is cured exactly as the refuter named it: the equative closed the enumeration at
two — a count in words — while the reads are PRESENCE only (`forces.walls.present`; `forces.garrison.present ||
forces.militia.present`), the key never consults the mercenary bucket or the charter hall, and the other four
STATE-KEY rows sit beside this one on the defense page, so a town firing this pool may hold defensive things the
equative had just denied it. `includes` is a presence verb and not a counting or extent word: it asserts that the two
bodies stand without closing the set. The frame `Defense at {settlement}` is the shipped `[street]` row's one lawful
turn and is kept under the density floor (Part B 21.4); it is also this numbered line's A11 opener and the row keeps
it. Everything else in the line is unchanged, so R1 (`creatures press the country outside`, country-scoped per W2) and
the landing on the country stand as they did. No claim added.

**V2 face 3 — CURED.** Was: `The creatures are in the country around {settlement}, and what the town has is a wall and
a force.` Now: `The creatures are in the country around {settlement}, and the town has a wall and a force.` The named
breach (the card's `may NOT: a count`; C7; A6) is cured by dropping the pseudo-cleft, which was exhaustive by
construction — it declared these two the WHOLE of what the town has — and therefore carried a totality its siblings
(faces 1 and 2, which state plain possession) do not, breaking the claim-equality A6 reads ACROSS the four faces. The
plain possession clause is the refuter's own named cure and is claim-equal to the siblings: presence of R2 and R3,
nothing more. The construction contract holds — the subject is still the creatures, the order still R1 then R2+R3, the
landing still `a force` — so the face remains distinct from face 1 (town subject, R2+R3 then R1, landing on the
country), face 2 (the pair as subject, R2+R3 then R1, landing on the creatures) and face 0 (the arm's frame as
subject). `a force` is the ratified class word for the paid military (W15; ADDENDUM 13 A.5 — never `the guard`, never
`garrison` or `militia`, each false on half the towns this key fires on). No claim added, none dropped.

**V3 face 1 — CURED.** Was: `The wall at {settlement} stands and so does the muster, and what lies open is the
pressure from the country's creatures.` Now: `The wall at {settlement} stands and so does the muster, and the pressure
from the country's creatures lies open.` The named breach (C7; the card's `may NOT: a count`, here a count over the
record's open matters) is cured by dropping the cleft, which declared this the record's ONE open matter — a ranking a
spine cannot know, since the composer sets modifiers after this spine and the other four STATE-KEY rows each may leave
a matter of their own standing open; the register card's licence to leave one matter open is a licence for the record,
never an exclusive claim one pool may make over it. The OPEN move is now stated directly on R1, which is what R-iv
fixes for the `[unfolding]` tag: PRESENT first (R2 `The wall ... stands`, R3 `so does the muster`) and OPEN last (`the
pressure from the country's creatures lies open`), declarative, with no forecast, no trend, no duration and no
progressive act of the works. `the pressure` is the engine's own noun (`threatAssessment.js:52`) with the country
named on it so the read stays country-scoped (W2) and the war arm on the same page is not contradicted (C7). The
construction contract holds: subject the wall, order R2 then R3 then R1(OPEN), landing on `open`. The variant's four
OPEN cadences stay four — `stands unmet` (face 0), `lies open` (face 1), `stands open` (face 2), `is unsettled` (face
3) — so the density the refuter praised aloud is not traded for plainness (Part B 21.4). No claim added.

**Targets refused: none.** All five were curable within the card, the angle's stance and the bars.
