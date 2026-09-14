1. `[ledger]` The country around {settlement} carries creatures. Entered to the town's name are a wall and a muster.
   - `[face]` In the country around {settlement}, where creatures are abroad, the works and the muster are carried standing.
   - `[face]` Creatures range the country around {settlement}, and the town's wall and the muster both stand entered.
   - `[face]` The works and the town's force are entered as standing at {settlement}, and creature country lies around the town.
2. `[street]` Defense at {settlement} includes a wall and a muster, and creatures press the country outside.
   - `[face]` The town has a wall at {settlement} and a muster of its own, and the creatures are out in the country.
   - `[face]` A wall and a muster stand at {settlement}, and the country around the town carries creatures.
   - `[face]` The creatures are in the country around {settlement}, and the town has both a wall and a force.
3. `[unfolding]` What {settlement} has built is in place and the muster with it, and the creature pressure out of the country stands unmet.
   - `[face]` The wall at {settlement} stands and so does the muster, and the pressure from the country's creatures lies open.
   - `[face]` At {settlement} the muster stands and the wall as well, and the pressure of creatures in the country stands open.
   - `[face]` Both the works and the town's force at {settlement} are in place, and the pressure out of the country, where the creatures are, is unsettled.

--- NOTES

Cure round 1 * pool `Beasts & Monsters: plagued, perimeter AND organized force` * 6 targets, 6 cured, 0 refused.
Baseline: the annex at HEAD `471ce894a83658b0e0fe480819a9f1dcd22605e3`, lines 2596 to 2607. The six non-target faces
(v1 f0, v2 f1, v2 f2, v3 f0, v3 f2, v3 f3) are BYTE-IDENTICAL to that baseline, verified by `diff`: six hunks, the six
targets, nothing else. Mechanical sweep of the twelve rows: no em dash, no exclamation, no digit in prose, no
`which`, no `garrison` / `militia` / `watch` / `guard` / `gate` / `perimeter` / `roll` / `books` / material word;
every row carries exactly one slot and it is `{settlement}`; no row opens on the slot (T-F8); all twelve first-two-word
openers are distinct after slot normalisation (A11): `The country` * `In the` * `Creatures range` * `The works` *
`Defense at` * `The town` * `A wall` * `The creatures` * `What {settlement}` * `The wall` * `At {settlement}` *
`Both the`. A machine scan for shared contiguous runs of five or more words between any two faces of one variant
returns exactly two, both bare NOUN PHRASES and neither a clause: `a wall and a muster` (v2 f0 against the judge's own
REVERT at v2 f2) and `pressure out of the country` (v3 f0 against v3 f3, two faces this judgment KEEPS and which are
therefore untouchable here). Both are the pool's licensed noun pair and its country-scoped threat phrase, which the
SKELETON RULE requires every face to carry; J-2(c)'s threshold is a CLAUSE or SENTENCE of five or more words, and no
clause-level collision remains anywhere in the pool.

**A correction to the earlier attempt of this packet, recorded so the chair can veto it.** A cut-off earlier run of
this seat wrote this file with FIVE targets cured and left `v1 f1` untouched, on the reading that the annex at HEAD
already carries the DRAFT face there (`The works at {settlement} are carried standing, and the muster with them, in a
country where the creatures are.`) and so needed nothing. That reading is wrong on the judgment's own face: JUDGMENT.md
section 3.1 rules `v1 f1` **CURE**, not REVERT, and gives the reason in terms, that "the draft face carries the same
generic-article country frame ('in a country where the creatures are'), so the breaching clause stands in the draft and
a revert would install an R-DA-03 tail besides". The disposition line of that section reads `1 reverted * 6 cure
target(s) * 5 kept`, and the one revert is `v2 f2`. So the baseline text at `v1 f1` is a cure TARGET carrying its
breach, not a cure. It is cured below. Curing it forced one consequential change to a second target, `v1 f2`, which is
recorded under that target.

**V1 f1 CURED (the target the earlier attempt missed).** Baseline at HEAD: `The works at {settlement} are carried
standing, and the muster with them, in a country where the creatures are.` Now: `In the country around {settlement},
where creatures are abroad, the works and the muster are carried standing.` This is the judge's named cure taken
verbatim. The named breach is W5, the naming-form article, with the skeleton rule: R1, the measured `plagued` tier, was
riding a GENERIC-article frame (`a country where the creatures are`), which states the tier as a CLASS of country
rather than as this country's standing, and a generic reading is a maxim, which the register card refuses outright
("closes on a moral, an uplift, a maxim or a hook"). The cure definites the frame and fronts it: `In the country around
{settlement}` names THIS country by the slot, and `where creatures are abroad` predicates the tier of it. The
R-DA-03 flat tail the judge warned of is gone with it, because the country is now the governing frame and not a
trailing locative. One slot, as the judge required. Claims, each with its law: `In the country around {settlement},
where creatures are abroad` = R1, `family === 'plagued'`, monster activity stated over the COUNTRY as W2 requires and
never as a totality over the town (C7: the war arm renders on the same page), `creatures` being the engine's own noun
at `threatAssessment.js:52`, layer NONE; `the works` = R2, `forces.walls.present`, the walls bucket's ratified
always-safe class word, true of every member including `Citadel` and `Gates (if walled)`, with no geometry word and no
material (W11, W15), layer BODY; `the muster` = R3, `forces.garrison.present || forces.militia.present`, the always-safe
class word for the paid military (ADDENDUM 13 A.5), layer BODY; `are carried standing` = the card's `may claim`, a
STANDING fact of the record, in the office's own formula (R-vi / W7), with no record noun, no agent-source and no
citation, so the provenance budget of zero is untouched (W24). Nothing added: no count, no magnitude, no cause between
the tier and the bodies, no manning, no use, no season, no verdict, no band word. The interpolated where-clause is
lawful here on the chair's own ruling at `v3 f3` KEEP: "the named bars are the which-clause and the tail, and an
interpolated where-clause is neither". Construction: a fronted prepositional frame carrying a relative, then one main
clause; the order is R1 then R2 and R3; the landing is `standing`. That is the draft's declared grammar for this face's
slot in the variant (the country as locative, R1 to R2 and R3, landing on the bodies standing), so W4 holds.

**V1 f2 CURED, and moved off the earlier attempt's verb.** Baseline at HEAD: `Creatures range the country around
{settlement}, and the town's wall and its muster both stand.` Now: `Creatures range the country around {settlement},
and the town's wall and the muster both stand entered.` The named breach W1 is cured by W1's second lawful form: the
binding possessive `its`, which follows the object `the town's wall` and binds to it, giving the wall's muster, is
dropped, and the second body stands as the bare class word `the muster`, the possessor staying seated on the town for
the first body only. The refuter's secondary ground, a `[ledger]` face with no ledger surface, is cured by `stand
entered`, the office's own word (R-vi / W7 names `entered` in the formula family) in a standing statement, with no
agent-source and no record noun, so W24 and the zero provenance budget are untouched, and the face keeps clear of face
0's `Entered to the town's name` formula exactly as the judge required. The judge's base for this face is `the town's
wall and the muster both stand`, and that base is carried verbatim with the entry word appended. WHY IT IS NOT THE
EARLIER ATTEMPT'S WORDING: that run set this face to `... are carried standing`, which was lawful only while `v1 f1`
was assumed frozen at its HEAD text; with `v1 f1` now cured to the judge's model, which ends `the works and the muster
are carried standing`, the two faces of ONE variant would share the contiguous clause `and the muster are carried
standing`, six words near-verbatim, which is precisely the A5 sibling-distance wall J-2(c) sets at five, and is the
same fault this judgment used to refuse two reverts in this very pool. Moving THIS face rather than f1 is the right
side to move, because the judge fixed f1's sentence in full and gave this face explicit latitude ("the curer may
restore an entry surface"). The four landings of the variant are now distinct: `a wall and a muster` (f0), `standing`
(f1), `entered` (f2), `the town` (f3). Claims: `Creatures range the country around {settlement}` = R1, country-scoped
(W2), layer NONE; `the town's wall` = R2, the walls bucket's class word with the possessor seated on the town (W1),
layer BODY; `the muster` = R3, layer BODY; `both stand entered` = the card's `may claim` in the ledger's stance, the
office formula, no citation. No claim added: `both` is a floating quantifier over the two subjects just named and
asserts nothing about the size of the town's defenses, and it is the chair's own word in the named cure.

**V1 f3 CURED, with the judge's model now restorable verbatim.** Baseline at HEAD: `A wall and a muster are entered as
standing at {settlement}, and creature country lies around the town.` Now: `The works and the town's force are entered
as standing at {settlement}, and creature country lies around the town.` The named breach, A5 and the four-faces rule
with Part B 21.1 sibling distance, was that the body half was face 0's clause turned over, the same noun pair (`a wall
and a muster`) under the same office formula, so two faces shared their whole lexis on the half carrying R2 and R3. The
cure is the judge's named one, restoring a distinct wall and force spelling: `the works` for R2 and `the town's force`
for R3, both ratified always-safe class words (W15, ADDENDUM 13 A.5). NOTE FOR THE CHAIR: the earlier attempt of this
packet inverted the judge's pair to `The town's force and the works` to dodge an opener collision with the then-standing
`v1 f1`, which began `The works at {settlement}`. Curing `v1 f1` to the judge's fronted country frame removes that
collision, so the judge's model is restored VERBATIM here, and the openers of the variant are now `The country` * `In
the` * `Creatures range` * `The works`, all distinct, with no `The town` against `The town's` near-twin anywhere in the
pool. Claims: `The works` = R2, layer BODY, no material named (W11) and no geometry (the word is true of every bucket
member); `the town's force` = R3, layer BODY, the possessor seated on the town (W1); `are entered as standing` = the
card's `may claim` in the office's formula (R-vi / W7), no citation; `creature country lies around the town` = R1,
country-scoped (W2), layer NONE, with `the town` co-referring with `{settlement}` and carrying the noun forward (J-1).
The second clause is byte-identical to the baseline, so nothing the card licenses was dropped and nothing was added.
The noun pair is now disjoint from face 0's, which is exactly what the A5 finding asked for.

**V2 f0 CURED.** Baseline at HEAD: `Defense at {settlement} is a wall and a muster, and creatures press the country
outside.` Now: `Defense at {settlement} includes a wall and a muster, and creatures press the country outside.` The
judge's named cure, verbatim. The named breach is the card's `may NOT: a count`, with C7: the equative closed the
enumeration, saying the town's defense IS these two and nothing else, while the reads are PRESENCE only
(`forces.walls.present`; `forces.garrison.present || forces.militia.present`), the key never consults the mercenary
bucket or the charter hall, and the other STATE-KEY rows of this desk sit beside this one on the same page, so a town
firing this pool may hold defensive things the equative had just denied it. An enumeration closed at two is a count in
words. `includes` is a presence verb and not a counting or extent word: it asserts that the two bodies stand without
closing the set, which is the judge's stated test. The frame `Defense at {settlement}` is the shipped `[street]` row's
one lawful turn and is kept under the density floor (Part B 21.4); it is also this numbered line's A11 opener and the
row keeps it. Everything else in the line is byte-unchanged, so R1 (`creatures press the country outside`,
country-scoped per W2) and the landing on the country stand as they did. No claim added.

**V2 f3 CURED, with one word added against a new sibling twin.** Baseline at HEAD: `The creatures are in the country
around {settlement}, and what the town has is a wall and a force.` Now: `The creatures are in the country around
{settlement}, and the town has both a wall and a force.` The named breach is the card's `may NOT: a count`, with C7 and
A6: the pseudo-cleft is exhaustive BY CONSTRUCTION, declaring these two the WHOLE of what the town has, while the reads
are presence only, so the face carried a totality its siblings do not and the four faces were not claim-equal, which is
what A6 reads ACROSS the faces. The cleft is dropped, as the judge named, and plain possession put in its place, which
is claim-equal to the siblings: presence of R2 and R3, nothing more. THE ONE DEVIATION FROM THE MODEL, recorded for
veto: the judge's model clause is `and the town has a wall and a force`, and the KEPT sibling `v2 f1` opens `The town
has a wall at {settlement}`, so the model would put the contiguous CLAUSE `the town has a wall`, five words,
subject and verb and object, into two faces of one variant, tripping J-2(c)'s own five-word threshold against a face
this judgment KEEPS and which I may not touch. `both` breaks that run at three words (`the town has`) while changing no
claim: it is a correlative over the two items the clause itself names, not a statement that the town holds exactly two
defensive things, and it is the chair's own word in the cure he wrote for `v1 f2` of this pool. The construction
contract holds: the subject is still the creatures, the order still R1 then R2 and R3, the landing still `a force`, so
the face stays distinct from f1 (town subject, R2 and R3 then R1, landing on the country), f2 (the pair as subject,
landing on the creatures) and f0 (the arm's frame as subject). `a force` is the ratified class word for the paid
military (W15, ADDENDUM 13 A.5), never `the guard`, and never `garrison` or `militia`, each of which is false on half
the towns this key fires on. No claim added, none dropped.

**V3 f1 CURED.** Baseline at HEAD: `The wall at {settlement} stands and so does the muster, and what lies open is the
pressure from the country's creatures.` Now: `The wall at {settlement} stands and so does the muster, and the pressure
from the country's creatures lies open.` The judge's named cure, verbatim. The named breach is C7 with the card's
`may NOT: a count`, here a count over the record's OPEN matters: the cleft declared this the record's ONE open matter,
a ranking a spine cannot know, since the composer sets modifiers after this spine and the other STATE-KEY rows of the
desk may each leave a matter of their own standing open. The register card's licence to "leave one matter standing
open in every town" is a licence for the RECORD, never an exclusive claim one pool may make over it. The OPEN move is
now stated directly on R1, which is what R-iv fixes for the `[unfolding]` tag: PRESENT first (R2 `The wall ... stands`,
R3 `so does the muster`) and OPEN last (`the pressure from the country's creatures lies open`), declarative, with no
forecast, no trend, no duration and no progressive act of the works. `the pressure` is the engine's own noun
(`threatAssessment.js:52`) with the country named on it, so the read stays country-scoped (W2) and the war arm on the
same page is not contradicted (C7). The construction contract holds: subject the wall, order R2 then R3 then R1 as
OPEN, landing on `open`. The variant's four OPEN cadences stay four, `stands unmet` (f0), `lies open` (f1), `stands
open` (f2), `is unsettled` (f3), so the density the refuter praised is not traded for plainness (Part B 21.4). No claim
added.

**Targets refused: none.** All six were curable within the card, the angle's stance and the bars W1 to W27.
