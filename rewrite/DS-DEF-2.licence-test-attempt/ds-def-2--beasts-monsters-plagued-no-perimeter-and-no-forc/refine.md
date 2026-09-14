# DS-DEF-2 · pool `Beasts & Monsters: plagued, NO perimeter and NO force` · REFINEMENT (phase 2)

Refiner: Opus 5 (Fable-unvalidated), a DIFFERENT author than the drafter. Input: `draft-round-2.md`
(the lawful draft, gate-clean on its one failing owned measure). Three existing variants refined
IN PLACE under their own numbers and their own angle tags (`[ledger]` · `[street]` · `[visitor]`,
the shipped order, index 0 canonical); none added, none removed, none merged; three `[face]`
sub-rows per variant, one for one. No claim added, none dropped: every face still asserts exactly
C1 (the country around the town is at the `plagued` monster tier), C2 (no wall-class work stands)
and C3 (no garrison and no militia stands), and nothing else. No `[plain]` marker anywhere.

---

## THE ROWS — the complete replacement for the pool's variant rows

1. `[ledger]` An embattled country of monsters lies around {settlement}, and the place stands inside it without works or muster.
   - `[face]` Creatures range the country around {settlement}. The place has neither muster nor works.
   - `[face]` The country about {settlement} is plagued with monsters, and the place is entered as wanting works and muster.
   - `[face]` Monsters are abroad in the country around {settlement}, and nothing of works or muster stands in the place.
2. `[street]` In a country plagued with monsters, {settlement} stands open and unmustered.
   - `[face]` Out in monster country {settlement} keeps neither works nor muster.
   - `[face]` A country of monsters surrounds {settlement}, a place with no works and no muster.
   - `[face]` Beasts are thick in the country around {settlement}, and the place itself stands with no works and no force.
3. `[visitor]` A stranger comes to {settlement} through a country plagued with monsters, and finds neither works nor muster in the place.
   - `[face]` What a stranger sees at {settlement} is a country of monsters, and a place in it with no works and no muster.
   - `[face]` The place a stranger finds at {settlement} stands open and unmustered, and around it lies an embattled country of beasts.
   - `[face]` The first thing a stranger meets at {settlement} is monster country, and the next is a place with no muster and no works.

---

## --- NOTES

### N0 · THE ONE POOL-WIDE MOVE, STATED ONCE (it accounts for the wall word in all twelve)

**The draft spelled the empty wall class `a wall` / `walled`; the refinement spells it `works`
in all twelve, with no exception.** Ground, three-fold and all of it law rather than taste, and
now READ OFF THE PRODUCER rather than argued from the corpus:

- **W15 / the alias table A-7.** The always-safe spelling of any `walls`-bucket member is
  *the works* / *what the town has built*; a generic English word is licensed only where the row
  it names resolves on this town's record, and on this key NO row resolves at all. `D-6` of the
  entailment table states the same thing from the other side: the `wall` civic class has no
  always-safe geometric generic (`perimeter` is false of a Citadel, `wall` is false of
  `Palisade or earthworks`), and the safe generic is *the works*.
- **The under-read.** C2 is the emptiness of the WHOLE class. "No wall stands" leaves the
  disjunctive `Palisade or earthworks` member standing in the reader's ear; "no works stand"
  is the read itself. This is the skeleton rule, not a synonym swap.
- **Sibling coherence (A1 / A11; R-DA-22 one term for one thing).** The six sibling Beasts pools
  of this same block already spell this class *the works* / *what the town has built*, and the
  `settled, nothing organized` pool spells this very C2+C3 pair "keeps no works and no muster".
  The draft's `wall` was the one pool in the block using a different term for the same thing.

**THE PRODUCER, READ THIS ROUND — and it withdraws the draft's one exception.** The draft kept
`walled` at face 1b on the ground that `defenseProfileHasWalls` is "the receipt's own predicate
word". **That ground is false, and the exception falls with it.** This pool never calls that
predicate: `defenseThreatProse` derives the limb from `standingDefenseForces(settlement).walls
.present` (`defenseStateProse.js:624`, `:655`), and `standingDefenseForces`
(`defenseInstitutionBuckets.js:169`) partitions the LIVE, ruin-filtered roster on
`DEFENSE_BUCKET_KEYWORDS.walls` — **six substring classes: `wall`, `citadel`, `palisade`,
`earthwork`, `inner citadel`, `massive walls`** (`:84-87`). So C2 is the emptiness of a
SIX-MEMBER class, and `walled` is the generic English word for ONE of the six: true on every
town the row fires on, and narrower than the read on all of them. That is W15's alias bar exactly
(a generic word where the row it names is not the read) and R-DA-22's one-term-for-one-thing
against itself inside one pool. Face 1b is re-cut on the class word in §N1. No claim moves
anywhere: C2 before, C2 after — the wording states more of it, never more than it.

### N1 · ONE LINE PER FACE — what changed, and the law or target behind it

**Variant 1 · `[ledger]` — grammar V3 (PRESENT → LACK) kept in all four (W4, the construction contract).**

| # | change | law / target |
|---|---|---|
| 1 | `neither a wall nor a force stands in the place` → `the place stands inside it without works or muster`; the shipped clause `An embattled country of monsters` is kept verbatim as the canonical opener | N0 (W15 / A-7 / D-6); THE DENSITY FLOOR (the shipped lawful clause stands as the index-0 face, unsmoothed); THE THREAD — `inside it` now hands the country forward into the second clause, where the draft's `in the place` handed nothing back |
| 1a | one sentence → TWO (`Creatures range the country around {settlement}. The place has neither muster nor works.`), and the landing moves from the muster to the works | R-DA-05 (`wordsPerSentence.sd` within the pool: 3.38 → 4.04, over the 4.0 floor — this face carries the pool's short end at thirteen words); R-i (the spine's own second sentence carries a noun forward: `{settlement}` → `the place`); R-DA-04 (the close kind varies) |
| 1b | `Around {settlement} the country is…` → `The country about {settlement} is…`; and `entered as neither walled nor mustered` → `entered as wanting works and muster` | TWO changes, one taste and one law. (i) R-DA-05 / the tic count — the draft opened four of twelve faces on a fronted place; this one goes subject-first and the pool's fronted-place openers fall to two of twelve. (ii) **THE LAW CURE, on the producer read this round (§N0):** the walls limb is a six-keyword bucket, so `walled` under-read C2 and engaged W15; the class word replaces it. The office's `entered as` formula (W7 / R-vi) is KEPT — it is the pool's one office surface — and its complement moves from an adjectival pair to the block's own LACK idiom, which the sibling `plagued, perimeter but NO force` pool already carries twice (`the force to hold them is wanting`; `the holding of them wants a garrison or a militia`). **A ceiling gain falls out of the cure:** `wanting` states the double LACK with NO negative particle, so 1b becomes the only face of variant 1 that is not built on `without` / `neither…nor` / `nothing of`, and the variant's four faces now differ in the SHAPE of the negation as well as in subject and landing (A11 sibling distance; §21.1). Eighteen words before and after, so R-DA-05's within-pool sd does not move |
| 1c | rebuilt: `Monster country is what {settlement} sits in, and the place stands without a wall or a force.` → `Monsters are abroad in the country around {settlement}, and nothing of works or muster stands in the place.` | the draft's cleft was the mannered member of the four and it landed on the same absence as face 1; the new face takes the block's own high-band idiom (`beasts are abroad` at the `plagued, perimeter but NO force` pool) and closes on the civic OBJECT (`the place`) instead of a fourth absence — R-DA-04's varied close kind; `nothing of works or muster` is the sibling corpus's own negation shape (`nothing of the muster holds them`) |

**Variant 2 · `[street]` — V1 in the numbered row and in 2a/2b (the whole condition in one predicate), V3 at 2c (W4).**

| # | change | law / target |
|---|---|---|
| 2 | `In a country of monsters` → `In a country plagued with monsters` | THE DENSITY LAW / the skeleton — `plagued` is the HIGH band of `config.monsterThreat` and the engine's own label word (L-1, rendered at its engine meaning: monsters, never disease); the draft's `of monsters` stated presence where the card's read is a TIER. `open and unmustered` is kept exactly: it is the compressed pair this pool's ceiling rests on, and making it plainer would be the regression §21.4 names |
| 2a | `keeps no muster and no wall` → `keeps neither works nor muster` | N0; and the face is cut to ten words to hold the pool's short end against the twenty-three-word 3c (R-DA-05's within-pool spread) |
| 2b | `A plagued country of monsters surrounds…` → `A country of monsters surrounds…`; `no wall` → `no works` | N0; and R-DA-10's rationed-pet-word figure is measured PER VARIANT — the draft carried `plagued` twice inside variant 2. The four faces of this variant now spell C1 four different ways (`plagued with monsters` · `monster country` · `a country of monsters` · `thick with monsters`), which is the four-faces-differ-in-construction rule reaching the vocabulary too |
| 2c | `At {settlement} the country is thick with monsters, and the place itself stands with neither a wall nor a force.` → `Beasts are thick in the country around {settlement}, and the place itself stands with no works and no force.` | the draft's third fronted-place opener in one variant (the tic); the new opener is subject-first and finite. `thick` is kept (the band word the drafter defended), `force` is kept (the engine's own token at `defenseStateProse.js:655`) so the pool still lands once on the producer's own word. **The lead noun is `Beasts`, not `Creatures`:** an earlier pass of this refinement opened both 1a and 2c on `Creatures`, which is the same pet word leading two of twelve faces (R-DA-10's rationed-word figure; A11's dispersion) — and the family name the pool key itself carries is `Beasts & Monsters`, so the three family words now sit at nine / one / two instead of nine / two / one. Nineteen words before and after |

**Variant 3 · `[visitor]` — the stranger is an EYE (W22, W27): she comes, sees, finds, meets, and does nothing else; V3 in 3/3a/3c, V3 reversed in 3b.**

| # | change | law / target |
|---|---|---|
| 3 | `through a country of monsters and finds there neither a wall nor a force` → `through a country plagued with monsters, and finds neither works nor muster in the place` | N0; the band word as at face 2; and the close moves off the absence onto the civic OBJECT (`the place`), so the numbered rows of the three variants now close on three different kinds (absence · condition · object) — R-DA-04 |
| 3a | `a place without a wall or a muster` → `a place in it with no works and no muster` | N0; `in it` threads the country into the second limb, where the draft's flat coordination left the two halves side by side; at twenty-two words this face carries the pool's long end |
| 3b | `around it lies a country of beasts` → `around it lies an embattled country of beasts` | THE SKELETON RULE — this was the one face stating C1 with no band marker at all, against a `settled` sibling whose own words are "beasts are few"; `embattled` is the structural validator's own spelling of the same value, so the band is carried without a new claim. The construction (place first, the country as the passage's ONE turn outward, placed last) is untouched — that is the face the gate's cure bought and it is this variant's widest sibling distance |
| 3c | `and the next is a place open and unmustered` → `and the next is a place with no muster and no works` | `open and unmustered` stood in three of the draft's twelve faces (2, 3b, 3c) — a formula at a rate is the machine signature §16 item 6 names, and A11 wants the pool's spread, not a refrain. It is kept where it is strongest (the canonical `[street]` row and 3b's reversed face) and replaced here, which also gives the pool its one face landing on the works |

### N2 · WHAT DID NOT MOVE

The variant count, the vids, the order, the three angle tags, the slot set (`{settlement}` exactly
once in every face, no `{band}`, no `{route}`), the typed lines of the pool (RECEIPT / STATE-KEY /
SLOTS / SECTION-TARGET / PROVENANCE / PDF PARITY), the claim set (C1 + C2 + C3 in all twelve,
claim-equal across the faces of each variant — arm A6), the declared grammar per variant (W4),
and the provenance budget (ZERO citations: the card resolves `source: muster · standing LICENSED`,
but this key's force limb is a NEGATION, so no `Citizen militia` with a `Muster training` service
resolves on any town the row fires on and no roll exists to cite — OV-5, W24; no record word
appears anywhere, and `entered as` at 1b is the office's own formula, not a citation).

### N3 · THE BARS, RE-WALKED ON THE REFINED TEXT (W1–W27)

W11 no material and no material source (no wall resolves here in any case). W12 the word
`garrison` appears nowhere; the empty force buckets are stated on the class words `muster` and
`force`. W13 the watch is named nowhere, present or absent — `force = garrison || militia` does
not reach that bucket and DS-DEF-5 may print `watch PRESENT` on the same tab. W14 `plagued` is
rendered at its ENGINE meaning in every face (L-1: monster activity, never disease); no plague,
sickness, war, raider or enemy word. W15 cured pool-wide at N0, with no exception left standing:
`works` (the always-safe spelling of any member of the six-keyword walls bucket), `muster` and
`force` (the class words for the paid military, and `force` the producer's own token at `:655`)
and the family words (`monsters`, `beasts`, `creatures`) are the always-safe or producer-own
spellings; no geometric generic (`wall`, `walled`, `perimeter`, `line`) survives anywhere. W16 no pay gate is read; no upkeep, wages, pay or purse. W17 no siege,
occupation, wartime, famine, illness or insurgency. W18 no stress record; the stress record's word
`pressure` stays out. W19 no creed, deity, rank or standing. W20 C1 is stated on a country token
and names no body; C2 and C3 are BODY reads negated and are stated on the wall class and the paid
military's class word; no AGGREGATE word rides them, and `undefended` (the readiness label L-54,
an AGGREGATE this key does not read) appears nowhere. W21 no power, seat, hall, council or chamber.
W22 no person is an agent, decider or load-bearing referent; `anybody`, `everyone`, `nobody` and
`the people` appear nowhere. W23 the place never decides, defends, watches, hopes or moves; one
referent per unit; the country never acts with intent (R-DA-11). W24 no record word anywhere.
W25 no foreign force. W26 the card reads `covert: no` and `audience: player (no mark)`. W27 the
three stances stay stances; the stranger neither acts, decides, is told nor is named. W1 no
possessive pronoun follows an object. W2 C1 is country-scoped in all twelve (`the country around`,
`the country about`, `monster country`, `surrounds`, `around it`), never a totality over the town —
C7 requires it, the Invasion rows printing war pressures on the same page. W3 no tier is read and
no band word for tier is used; the settlement's noun is `{settlement}` or `the place`, never `the
town`, `the village` or `the community`. W4 kept per variant, itemised in N1. W5 no generic article
carries a band; no maxim frame. W6 no clause restates the read it follows. W7 the office's formula
appears once, at 1b (`entered as`), and never as an agent-source: no face says the roll shows or
the record sets down. W8 the ledger enters and cites nothing; the street states the standing plainly
(no field holds what the town says); the visitor reports what is seen on arrival. W9 the density
floor is counted on the card's three READS. W10 exactly one negated surface per face, and never the
opening move.

### N4 · THE MECHANICAL WALLS, RE-COUNTED BY HAND

Twelve wordings. Every one: opens on a capital that is not a slot (T-F8 — no face opens on
`{settlement}`); closes on a terminal stop; no em dash, no exclamation, no digit, no percent
(connectives included), no `which`-clause, no question, no `I`, no `you`, no expletive opener,
no habitual triad, no citation; **no participial opener on any of the twelve** — the gate's one
failing round-1 measure (`shapes.participialOpenerRate`) stays at 0.000 on 12 of 12. The draft's
stronger boast of "no participle anywhere" is CORRECTED to the measure's own scope: 1b's
`wanting` is a predicative complement of `entered as`, mid-sentence, and no face opens on an
`-ing` or `-ed` adjunct or carries a participial glossary tail (fault 2).

| # | angle | words | first two words | close kind |
|---|---|---|---|---|
| 1 | `[ledger]` | 18 | An embattled | absence (muster) |
| 1a | `[face]` | 13 | Creatures range | absence (works) |
| 1b | `[face]` | 18 | The country | absence (muster) |
| 1c | `[face]` | 18 | Monsters are | object (the place) |
| 2 | `[street]` | 11 | In a | condition (unmustered) |
| 2a | `[face]` | 10 | Out in | absence (muster) |
| 2b | `[face]` | 14 | A country | absence (muster) |
| 2c | `[face]` | 19 | Beasts are | absence (force) |
| 3 | `[visitor]` | 20 | A stranger | object (the place) |
| 3a | `[face]` | 22 | What a | absence (muster) |
| 3b | `[face]` | 20 | The place | object (a country of beasts) |
| 3c | `[face]` | 23 | The first | absence (works) |

Twelve distinct first-two-word openers (A11 / MOVE-GRAMMAR wall 10); no settlement-opener variant,
so wall 10's allowance of one is unspent. Length 10 to 23 words; within-pool
`wordsPerSentence.sd` **3.38 → 4.04**, over R-DA-05's 4.0 floor, which the draft sat under.
Fronted-place openers **4 of 12 → 2 of 12**. `open and unmustered` **3 of 12 → 2 of 12**.
No pet word leads two faces: the family words sit at nine `monsters` / two `beasts` / one
`creatures`, and no lead noun repeats (R-DA-10).
Close kinds: eight absence, one condition, three object (the draft: seven / three / two). **This
is the one measured cost of §N0's law cure, stated rather than hidden:** 1b's close moves from a
condition to an absence because the cure takes the adjectival pair off the face, and the pool's
second condition close goes with it. All three drawable kinds of R-DA-04's closed set stay
populated, and absence is the key's natural majority — its whole second half is two LACKs — so the
kind still varies where the walker measures it. Pronoun closers: zero. Abstract-noun closers:
zero. Within-pool `wordsPerSentence.sd` is unmoved by both changes (1b eighteen words before and
after; 2c nineteen before and after).

### N5 · REFUSALS

**None.** Every face is refined one for one; no face or variant is added, dropped, merged or
trimmed; no claim is added and none of the licensed set is lost. The refinement is a lawful set
kept lawful (§21.2): every change above is either a law cured (N0's W15 exposure, now read off
the producer; 3b's missing band marker) or a named target beyond the gate (the band's interior,
sibling distance, the sharper fact, the read-aloud ear) — none of them trades density for
plainness (§21.4).

**One correction is carried in the open rather than quietly fixed** (§N0, §N1 row 1b): an earlier
pass of this same refinement kept `walled` at face 1b and defended it on a predicate
(`defenseProfileHasWalls`) that this pool does not call. The producer was read this session —
`standingDefenseForces` over `DEFENSE_BUCKET_KEYWORDS.walls`, six keyword classes — and the
exception is withdrawn. The face is re-cut, the false ground is struck from N0 in words, and the
close-kind cost it carries is measured in N4. Nothing else in the packet rested on that ground.

