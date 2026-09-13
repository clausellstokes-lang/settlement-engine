# DS-DEF-2 · pool `Beasts & Monsters: plagued, NO perimeter and NO force` · REWRITE draft, round 1

Writer: Opus 5 (Fable-unvalidated). Block DS-DEF-2 · role spine · key
`Beasts & Monsters: plagued, NO perimeter and NO force`.

Three existing variants, rewritten in place under their own numbers and their own angle tags
(`[ledger]` · `[street]` · `[visitor]`, in the shipped order, index 0 canonical); none added,
none removed, none merged. Three `[face]` sub-rows per variant — four wordings per semantic
variant, the numbered row counting as the first. The typed lines of the pool (RECEIPT /
STATE-KEY / SLOTS / SECTION-TARGET / PROVENANCE / PDF PARITY) are untouched and not repeated.
No `[plain]` marker anywhere (it is a MODIFIER marker and the projector refuses it on a spine).

---

## THE ROWS — the complete replacement for the pool's variant rows

1. `[ledger]` An embattled country of monsters lies around {settlement}, and neither a wall nor a force stands in the place.
   - `[face]` Creatures range the country around {settlement}, and the place holds neither wall nor muster.
   - `[face]` Around {settlement} the country is plagued with monsters, and the place is entered as neither walled nor mustered.
   - `[face]` Monster country is what {settlement} sits in, and the place stands without a wall or a force.
2. `[street]` In a country of monsters, {settlement} stands open and unmustered.
   - `[face]` Out in monster country {settlement} keeps no muster and no wall.
   - `[face]` A plagued country of monsters surrounds {settlement}, a place with no wall and no muster.
   - `[face]` At {settlement} the place stands with neither a wall nor a force in a country of monsters.
3. `[visitor]` A stranger comes to {settlement} through a country of monsters and finds there neither a wall nor a force.
   - `[face]` What a stranger sees at {settlement} is a country of monsters and a place without a wall or a muster.
   - `[face]` Coming to {settlement} out of monster country, a stranger finds a place that keeps no muster and no wall.
   - `[face]` The first thing a stranger meets at {settlement} is monster country, and the next is a place open and unmustered.

---

## --- NOTES

### N0 · The card, and the claim set it licenses

The licence card printed for this pool (`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts &
Monsters: plagued, NO perimeter and NO force'` in `laneRW-DEF2`) carries ONE read and one
predicate branch:

- `reads: beastsRowSituation(family, perimeter, force)` (via `BEASTS_ROW_POOL` in
  `defenseStateProse.js`).
- `predicate: beastsRowSituation(family, perimeter, force) === plagued country, neither`.
- `bag: {band: RESERVED, route: proper, settlement: proper}` · `FILLED at this block's call
  sites: {settlement}`.
- `seat/form: (not a seat-taker) / sentence` · `move: (none declared)` · `angle: ledger street
  visitor` · `relation: (a spine takes no relation)` · `attach: (empty)` · `covert: no` ·
  `audience: player (no mark)`.
- `source: muster · standing LICENSED` — "a citation of this holder is licensed where the
  provenance budget allows".
- `may claim: that the reader ... selects the row 'plagued country, neither' ... as a STANDING
  fact of the record.`
- `may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic
  object of the class 'wall'.`
- `REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character
  and that character's fate; a theological claim about a deity.`

**The one keyed condition (R-v) has three limbs, and they are the whole licensed claim set:**

- **C1 — the country around `{settlement}` is at the `plagued` monster tier.** MONSTER ACTIVITY
  in the surrounding country (W14; label trap L-1: "The surrounding region is plagued by MONSTER
  activity"; the structural validator's own spelling of the value is "Embattled region"). A
  PRESENT move on a country token. **Referent layer NONE** — it names no body. Stated over the
  COUNTRY, never as a totality over the town (W2, C7: the Invasion rows of this block print war
  pressures on the same page). Never disease, never war, never raiders, never "the pressure"
  (the stress record `monster_pressure`'s word, not this tier's).
- **C2 — no wall-class work stands on the town's record.** The `perimeter` argument at
  `defenseStateProse.js:655` is false. A LACK (MOVE-GRAMMAR §1.2 row 11 class (a), a
  `none-exists` world fact). **Layer BODY, negated** (the walls bucket, empty).
- **C3 — no garrison and no militia stands.** `force = garrison || militia` at `:655` is false.
  A LACK. **Layer BODY, negated** (two buckets, empty). The read consults ONLY those two
  buckets: the watch, mercenary and charter buckets are unread, so no wording says "no watch",
  "no specialists", "no hired men", "undefended" or "nothing organized".

Every one of the twelve wordings asserts exactly C1, C2 and C3 and no fourth claim. The four
wordings of one variant are claim-equal to EACH OTHER (arm A6 reads across the faces), and the
three variants are claim-equal because the pool key is the conjunction of the card's three
limbs; they differ lawfully in ANGLE, GRAMMAR, vocabulary, construction and rhythm (C-sibling:
siblings cohere in structural fact and differ in standpoint and grammar). W9 is respected: the
density floor counts the card's READS (three), never an entailment-table attribute.

**The two LACKs are stated as ONE keyed condition** (skeleton §0.5): one negated surface
covering both ("neither a wall nor a force", "no muster and no wall", "without a wall or a
force") or a positive frame ("open and unmustered"). Never two ABSENCE moves side by side
(MOVE-GRAMMAR §1.4 wall 3), never the opening move of any wording, and never more than one
negated surface per wording (W10).

### N1 · What the old sentences claimed, and what was dropped

**Old variant 1** — `[ledger]` `An embattled country and nothing organized standing in it:
{settlement} has no line, no force and no specialist recourse, and survival here rests on
terrain, distance and the ability to leave.`

| claim in the old row | disposition | clause |
|---|---|---|
| the country is embattled (= `plagued`) | **KEPT (C1)** | the card's `reads` + `may claim ... as a STANDING fact`; kept VERBATIM in the numbered row as "An embattled country", bound to the monsters in its own clause so C7 cannot read it as war |
| `{settlement}` has no line (no wall) | **KEPT (C2)** | same clause; the WORD "the line" is dropped for "wall" (referent row 81 / refute row 241: "the line" is a CONDITIONAL wall alias, refused where the pool also reads a force — this pool reads both) |
| `{settlement}` has no force | **KEPT (C3)** | same clause; "force" is the engine's own token at `:655` and is kept verbatim in two wordings |
| "nothing organized standing in it" | **DROPPED** | a TOTALITY over defense bodies the read never consults (W20; referent row 56: `force = garrison \|\| militia` excludes the watch, mercenary and charter buckets; DS-DEF-5 may print `watch PRESENT` on the same tab) |
| "no specialist recourse" | **DROPPED** | the charter-hall BODY at the person grain on a key that does not read `charter` (W20; the referent table's own wrong-layer finding on annex `:2606`, and D-F-class row `specialists · specialist recourse`) |
| "survival here rests on terrain" | **DROPPED** | card `may NOT: a cause` and `a second fact`; no terrain field is read on this key (and terrain is a route DEFAULT on most towns, L-3) |
| "distance" | **DROPPED** | card `may NOT: a second fact`; no geography read (MOVE-GRAMMAR row 8 needs a geography field) |
| "the ability to leave" | **DROPPED** | card `may NOT: a second fact`; a capacity fact the fields do not hold, and a TOTALITY OVER PERSONS (a REFUSED COLUMN) |
| "survival" as a noun | **DROPPED** | card `may NOT: a future`; a forecast in a noun and a verdict — STATE never FATE (A2, THE PROMISE) |
| the two habitual triads | **DROPPED with their claims** | R-DA-10: two items or four, never three by habit |
| the colon joining a country fact to a town fact, with a third riding on "and" | **RE-CUT** | the register card: a second fact takes its own sentence; S2 excepts only a computed CONSEQUENCE, and a spine carries no consequence field |
| the nominal absolute opener with no verb | **RE-CUT** | the desk gesture the WOVEN TEST refuses at a seam; every wording is sentence-form |

**Old variant 2** — `[street]` `The town does not defend itself. What it does is watch, and move,
and hope the pressure goes around it, and that is understood by everyone in it.`

| claim in the old row | disposition | clause |
|---|---|---|
| a threat from the country | **KEPT in substance (C1)** | the card's `reads`; the WORD "the pressure" is dropped — it is the engine's word for the STRESS record `monster_pressure` (S-10), not for the `config.monsterThreat` tier this key reads |
| the double absence (present only by implicature) | **STATED OUTRIGHT (C2 + C3)** | the card's `reads`; the skeleton's §2.3 item 4 — each face states all three reads |
| "The town" as identity | **DROPPED** | a VALUE no field on this key holds; the key reads no tier and fires thorp through town (at city the required `Professional city watch` is a garrison keyword and `force` reads true, O-1). The safe nouns are `{settlement}` and "the place" (CLERK-LAWS C2; the DS-DEF-11 UNWALLED-SMALL precedent) |
| "does not defend itself" | **DROPPED** | a TOTALITY over every defense body AND an act of the town as one agent (W23 fused agent; a totality over persons is a REFUSED COLUMN) |
| "watch, and move, and hope" | **DROPPED** | three ACTS no field holds, one of them the WATCH bucket the read never consults; and a habitual triad |
| "hope" | **DROPPED** | a FEELING — MOVE-GRAMMAR §1.3: no FEELING move exists anywhere in the estate; and a belief frame (R-DA-13's executable floor) |
| "the pressure goes around it" | **DROPPED** | a FIGURE (an inanimate thing with a path — R-DA-11) and a FORECAST |
| "understood by everyone in it" | **DROPPED** | a TOTALITY OVER PERSONS (a REFUSED COLUMN, always) and a belief frame |
| the summarising second sentence | **DROPPED** | §16 (6) / R-DA-03: no MEANING move exists; a second sentence is a second FACT of a varied kind or nothing |

**Old variant 3** — `[visitor]` `A stranger arriving at {settlement} understands the danger before
anybody explains it, because nothing about the place is arranged as though danger were expected
to be met.`

| claim in the old row | disposition | clause |
|---|---|---|
| the stranger's arrival | **KEPT as the angle's FRAME** | W27: "a stranger" is the visitor's eye — it may see, never act, decide, be told or be given a name; the arriving is the syntax of noticing, not a claim. Kept in all four wordings |
| "the place" as the settlement's generic noun | **KEPT** | no tier read; the safe term |
| a threat from the country | **KEPT in substance (C1)** | the card's `reads`; stated as the country met on the way in |
| the double absence (by implicature under "nothing about the place is arranged") | **STATED OUTRIGHT (C2 + C3)** | the card's `reads` |
| "understands" | **DROPPED** | a belief frame on a PERSON (W22: no person as a load-bearing referent; W27: the stranger may see, never understand) |
| "the danger" | **DROPPED** | a forecast in a noun and a VERDICT — the record states the tier, never what it portends (A2, THE PROMISE; the UNWALLED-SMALL precedent refused "safety" on the same ground) |
| "before anybody explains it" | **DROPPED** | persons as agents (W22), an observable scene the fields do not hold, and "anybody" as a totality over persons (a REFUSED COLUMN) |
| "because" | **DROPPED** | card `may NOT: a cause`, joining a person's interior to an observable |
| "nothing about the place is arranged" | **DROPPED** | a TOTALITY over every observable of the place (W20); the licensed residue under it is C2 + C3 only |
| "as though danger were expected to be met" | **DROPPED** | a belief frame attributed to the town as one mind, a FIGURE, and a forecast shape |
| the sentence landing on a verb phrase ("to be met") | **RE-CUT** | R-DA-04: the close is a standing fact of a varied KIND; nine of the twelve wordings land on a civic noun and three on a condition |

Nothing was added to any variant. No wording asserts an office, a count, an exemption, a holder,
an event, a season, a future, a cause or a standpoint.

### N2 · The grammars, the constructions, and the openers

The level-1 members drawable on this key are exactly **V1 and V3** (skeleton §0.5): V2 has no
consequence field (a spine takes no relation and the card names none); V4 has no named object
(`{defwork}` is not in the bag and no wall resolves); V5 has no institution row (both buckets
are empty); V6 has no unresolved field; V7 is R2-only; V8 has no `not-held` record field. A pool
of three over a licensable set of two: two variants realise the two members and the third
necessarily shares a member with a sibling and is told apart by its ANGLE and its CONSTRUCTION
(W4, the construction contract — this is the draft's declared grammar per variant and the
refiner keeps it).

| variant | angle | grammar | construction, declared |
|---|---|---|---|
| 1 | `[ledger]` | **V3 — PRESENT (C1) → LACK (C2 + C3 in one surface)** | two moves in one sentence: the country's tier entered as the record holds it, then the double absence as its own assertion. The office's formula is the ledger's lawful surface (R-vi / W7) and appears once, as "is entered as" |
| 2 | `[street]` | **V1 — PRESENT alone: the compound condition in ONE predicate** | one clause, the absences carried inside the place's standing rather than asserted as their own move; the plain shape a resident states a standing condition in |
| 3 | `[visitor]` | **V3 — PRESENT (C1) → LACK (C2 + C3 in one surface)** | two moves in the ORDER OF NOTICING: the country met on the way in, then what stands at the place, in the shape of a thing seen rather than a thing recorded |

**Within a variant the four wordings differ in CONSTRUCTION, not only vocabulary** — the
subject, the order of the reads inside the grammar, and the landing noun all move:

| wording | subject | landing noun | close kind |
|---|---|---|---|
| 1 | an embattled country | the place | object |
| 1a | creatures | muster | absence |
| 1b | the country | (walled / mustered) | condition |
| 1c | monster country | force | absence |
| 2 | `{settlement}` | (open / unmustered) | condition |
| 2a | `{settlement}` | wall | absence |
| 2b | a plagued country | muster | absence |
| 2c | the place | monsters | object |
| 3 | a stranger | force | absence |
| 3a | what a stranger sees | muster | absence |
| 3b | a stranger | wall | absence |
| 3c | the first thing a stranger meets | (open / unmustered) | condition |

**The openers, all twelve distinct in their first two words** (A11's sibling-distance rule):
"An embattled" · "Creatures range" · "Around {settlement}" · "Monster country" · "In a" · "Out
in" · "A plagued" · "At {settlement}" · "A stranger" · "What a" · "Coming to" · "The first".

- **No wording opens on `{settlement}`.** T-F8 / ARCH §2.5 refuse a sentence face opening on a
  `proper`-typed slot of the block's bag, and the seam contract says a sentence-form row begins
  on a capital that is not a `proper`-typed slot; wall 10 would allow one numbered row to do it,
  and today none of the three shipped rows does, so the pool keeps that shape. Two wordings open
  on a capitalised preposition with the slot second ("Around {settlement}", "At {settlement}"),
  which is a capital that is not the slot.
- **Every wording opens on a capital.** The block's PROVENANCE names the `plagued`+nothing
  branch — THIS pool — as the one that leaks a lowercase sentence lead; the defect does not
  return.
- **No ABSENCE opens any wording.** C1, the country's tier, is the PRESENT opener of every one
  of the twelve; the double absence always follows it.
- **The slot set is `{settlement}` on the numbered row and on every `[face]` sub-row**,
  identical to the parent's on every face (ARCH §2.5: a face whose `{slot}` set differs from the
  parent's is refused). `{band}` is RESERVED and `{route}` is unfilled at this block's call
  sites; neither is named anywhere.
- **Every wording is sentence-form** (`seat/form: (not a seat-taker) / sentence`): no fragment,
  none opening on a comma or a clause-list word, none verbless.

### N3 · THE THREAD (§1.4.1, R-i)

- Every wording is ONE sentence, so R-i's "a spine's own second sentence carries a noun forward
  from its first" is not engaged inside any wording; the connection that is engaged is the
  within-sentence one, and in each of the eight two-clause wordings the second clause carries a
  noun forward from the first: **the place** (1, 1a, 1b, 1c, 2c), **a place** picked up from the
  named settlement (2b, 3a, 3b, 3c), **there** resolving to `{settlement}` (3).
- No wording changes subject in the middle and hands nothing back. Where the subject does shift
  outward — 2c and 3a, which state the place and then the country — the shift is the passage's
  ONE turn outward and it sits LAST, which is the form the owner's law allows.
- Each wording hands forward a civic thing a later modifier can pick up: **the wall's absence**,
  **the muster's absence**, **the place**, **the country**, **the creatures**. None ends on a
  pronoun and none ends on an abstraction ("its condition", "its situation", "the arrangement").
- The card records **spine mounts 1 (tabs: defense) · modifier mounts 0 (none)**: the candidates
  leaf for DS-DEF-2 is empty until car 9 authors it, so this spine composes alone today. The
  rows are nonetheless written so that a modifier can attach after any of them without a change
  of subject being stranded.

### N4 · Face by face — which card clause licenses each claim

Every wording below carries exactly three claims — C1, C2, C3 — and each of the three is
licensed by the SAME card clause: `reads: beastsRowSituation(family, perimeter, force)` with
`predicate: === plagued country, neither`, under `may claim: that the reader ... selects the row
'plagued country, neither' ... as a STANDING fact of the record`. The slot in every wording is
licensed by `bag: {settlement: proper}` with `FILLED at this block's call sites: {settlement}`.
The table below names, per wording, the SURFACE that carries each claim, so a refuter can check
the claim against the limb rather than against the sentence.

**Variant 1 · `[ledger]` · V3 · PRESENT → LACK · 19 / 14 / 18 / 17 words**

| # | wording | C1 (the tier, layer NONE) | C2 + C3 (the two LACKs, layer BODY negated, one surface) |
|---|---|---|---|
| 1 | `An embattled country of monsters lies around {settlement}, and neither a wall nor a force stands in the place.` | "An embattled country of monsters lies around {settlement}" — the shipped clause kept, with "of monsters" binding the label to its ENGINE meaning in the same clause (W14, L-1; C7's war reading closed) | "neither a wall nor a force stands in the place" — ONE negated surface; "force" is the engine's own token at `:655` |
| 1a | `Creatures range the country around {settlement}, and the place holds neither wall nor muster.` | "Creatures range the country around {settlement}" — the tier at its engine meaning, scoped to the country (W2) | "holds neither wall nor muster" — one surface; "the muster" is the always-safe CLASS word for the paid military (ADDENDUM 13 item 5) and asserts no roll |
| 1b | `Around {settlement} the country is plagued with monsters, and the place is entered as neither walled nor mustered.` | "the country is plagued with monsters" — the engine's own label bound to monsters in its own clause | "is entered as neither walled nor mustered" — one surface; "entered as" is the office's own formula (R-vi / W7), applied to the WORLD fact, never to a gap in a record |
| 1c | `Monster country is what {settlement} sits in, and the place stands without a wall or a force.` | "Monster country is what {settlement} sits in" — a cleft on the tier, country-scoped | "stands without a wall or a force" — one surface, the skeleton's own sanctioned form |

**Variant 2 · `[street]` · V1 · one predicate · 10 / 11 / 15 / 17 words**

| # | wording | C1 | C2 + C3 |
|---|---|---|---|
| 2 | `In a country of monsters, {settlement} stands open and unmustered.` | "In a country of monsters" — the tier as the standing condition the statement is about | "stands open and unmustered" — the POSITIVE frame; "open" is a ratified C2 spelling and "unmustered" the adjectival form of "no muster". No negated surface at all, so W10 is not engaged |
| 2a | `Out in monster country {settlement} keeps no muster and no wall.` | "Out in monster country" | "keeps no muster and no wall" — ONE surface (the skeleton's "no wall and no muster stands" form), the reads in the reverse order from the numbered row |
| 2b | `A plagued country of monsters surrounds {settlement}, a place with no wall and no muster.` | "A plagued country of monsters surrounds {settlement}" — the label bound to monsters | "a place with no wall and no muster" — one surface, carried in an appositive on the named settlement |
| 2c | `At {settlement} the place stands with neither a wall nor a force in a country of monsters.` | "in a country of monsters" — placed LAST as the passage's one turn outward | "stands with neither a wall nor a force" — one surface |

**Variant 3 · `[visitor]` · V3 · the order of noticing · 19 / 20 / 19 / 20 words**

| # | wording | the FRAME (not a claim) | C1 | C2 + C3 |
|---|---|---|---|---|
| 3 | `A stranger comes to {settlement} through a country of monsters and finds there neither a wall nor a force.` | "A stranger comes to {settlement}" — the visitor's eye; it sees, it does not understand, judge, ask or get told (W27) | "through a country of monsters" — the tier as the thing met on the way in | "finds there neither a wall nor a force" — one surface, in the shape of a thing seen |
| 3a | `What a stranger sees at {settlement} is a country of monsters and a place without a wall or a muster.` | "What a stranger sees at {settlement}" — a cleft of noticing, no interior | "a country of monsters" | "a place without a wall or a muster" — one surface |
| 3b | `Coming to {settlement} out of monster country, a stranger finds a place that keeps no muster and no wall.` | "a stranger finds" | "out of monster country" — the tier on the approach | "a place that keeps no muster and no wall" — one surface; the relative is "that", never "which" |
| 3c | `The first thing a stranger meets at {settlement} is monster country, and the next is a place open and unmustered.` | "a stranger meets" | "monster country" | "a place open and unmustered" — the positive frame; the ORDER of noticing is the visitor's ceiling (the country first, the place second) |

**The source move, deliberately absent — the pool's provenance budget is ZERO.** The card
resolves `source: muster · standing LICENSED`, but on THIS key the muster's only roster holder
(a `Citizen militia` with an instantiated `Muster training` service, OV-5) is excluded by the
read itself, since `militia` is false on every town this key fires on. No roll resolves, so no
wording carries a record word — not "the roll", "the rolls", "the muster roll", "the books",
"the record", "according to" (W24; the referent law's rule 5). The `[ledger]` tag is a
STANDPOINT and licenses no record noun and no citation of its own (W24). §24's ceiling of one
citation per unit finds none of S3's three reasons on a flat LACK read from standing flags: the
pool states no count, holds no second account, and the holder here would be the office's own.
The exemplar registers with raw text cite at zero per 786 sentences, so silence is the norm.

**The words the pool does NOT use, and why** (each a breach the rewrite drops rather than
inherits): "the town" (a tier value on a key that reads no tier) · "the watch", "the guard",
"soldiers", "the men on the wall", "specialists", "specialist recourse", "hired men" (bodies the
read never reaches — W12, W13, W15, W20) · "undefended", "nothing organized", "no defense",
"nothing between" (totalities, and `Undefended` is an AGGREGATE readiness label this key does
not read — W20) · "the line" (a CONDITIONAL wall alias refused where the pool also reads a
force) · "stone", "timber" (W11, the material bar: no `{defmaterial}` fill is minted) · "the
pressure", "raiders", "the enemy" (the stress record's and the heartland vocabulary's words) ·
"plague", "sickness" (W14: `plagued` is monster activity, never disease) · "danger", "safety",
"survival", "risk", "at the mercy of" (forecasts in nouns) · "palisade", "ditch", "gate",
"earthwork" (a second civic object of the class `wall`, the card's own may-NOT) · "never
walled", "no longer", "not yet" (history on a standing fact with no ancestry — R-DST-B and the
block's PROVENANCE line).

**`{defwork}` is not named anywhere**, and no wording's grammar depends on the shape of a wall
name: the slot is not in this block's bag, no wall resolves on this key, and the two `{defwork}`
residuals ("palisade or earthworks", "gates (if walled)") therefore cannot break a sentence here
(ADDENDUM 13 part A item 2).

### N5 · The walls, checked

No em dash · no exclamation · no digit and no percent anywhere, and none in a connective · no
question · no `which`-clause (the only relatives are "that" and "what") · no "I", no "you", no
reader address · no expletive opener ("There is", "It is" — R-DA-07) · no future indicative, no
bare future, no forecast (A2, THE PROMISE) · no figure, no simile, no sense verb on an
abstraction, no inanimate thing acting with intent (R-DA-11; "range", "lies around",
"surrounds", "sits in" are literal, and "creatures" and "monsters" are animate) · no triad · no
semicolon and no colon anywhere in the pool · no office, no count, no exemption, no quantifier
over a table column (R-DA-15) · no totality over persons · no named character and no fate · no
deity · no second-person and no covert mark (`covert: no`; `audience: player (no mark)`) · no
`[plain]` marker on any spine row and exactly ONE bracketed tag per numbered row · no citation
and no record noun · no cause joint anywhere ("because", "so", "and so", "which is why", "with
nothing to hold it" all absent) · no belief frame, no feeling, no act of the place, no decision
of the place, no knowing of the place · no hedge ("seems", "looks", "appears") · no history · no
ABSENCE opener and no two ABSENCE moves side by side · at most one negated surface per wording.

### N6 · Bands reported, with their distance (soft rules, not walls — §16 / §16.2)

REPORTED per §16's channel rule: a soft rule reports its distance and fails only past the depth,
the budget or the ceiling. Nothing below is a wall breach.

1. **Close-kind spread (R-DA-04) is narrow by construction.** Of the twelve wordings, seven
   close on the absence (wall · muster · force), two on an object (the place · monsters) and
   three on a condition. The kinds `prohibition` and `a name not given` are unreachable: the
   card licenses no duty and no unnamed party. The order wall (ABSENCE never opens) pushes the
   double absence to the tail of every V3 realisation, so the narrowness is structural.
   Distance: one soft rule, bounded by the law itself.
2. **Two wordings close on the same condition word, "unmustered"** (variant 2's numbered row and
   variant 3's third face). They sit in different variants and in different grammars, and no
   two wordings of ONE variant share a landing; reported rather than cured, because the lawful
   C3 vocabulary on this key is exactly "no force" / "no muster" / "nobody mustered" / the
   adjectival "unmustered", and spending another would repeat a landing elsewhere.
3. **"unmustered" / "mustered" / "walled" as participles** (three of the twelve wordings) are
   named here for the refuters rather than left for the fold to find. The reading intended is
   the flat standing one — no muster resolves, no wall resolves. If a refuter reads "unmustered"
   as asserting that a muster exists and was not called out (an EVENT reading, which no field
   holds), the lawful substitutes are already in the packet in the same variant: "keeps no
   muster and no wall" (2a) and "a place with no wall and no muster" (2b) for variant 2, and
   "a place without a wall or a muster" (3a) for variant 3.
4. **Within-pool length spread (R-DA-05, within-pool sd ≥ 4.0) is reached at the pool grain and
   not inside variant 3.** The twelve wordings run 10 to 20 words; variant 1 runs 14 to 19,
   variant 2 runs 10 to 17, variant 3 runs 19 to 20. Variant 3's four wordings sit in a
   one-word band, because the visitor's frame plus three reads has a floor the frame sets.
   Distance: one soft rule on one variant; the remedy would be dropping the frame, which is the
   variant's angle.
5. **The grammar ceiling is NOT-EXECUTABLE for this pool.** R-DA-17's per-tab formula reports
   NOT-EXECUTABLE at n ≤ 2, and the admissible level-1 set here is exactly {V1, V3}. Three
   variants over two members means one member is realised twice; the two V3 variants are told
   apart by angle and by declared construction (N2), which is the form §0.5 recorded for the
   chair.
6. **The OPEN QUESTION move is not drawable.** The register card asks every town to leave one
   civic matter standing open, stated never asked; no field on this key carries an unresolved,
   contested or pending value, so the pool is written without it (skeleton §4). This is the
   pool's one silence against a card of the register, declared rather than hidden.
7. **PERFECTION CEILING.** The pool is not inside every band (rows 1, 2 and 4 above), so
   §16.1's suspect-at-zero flag does not fire.

### N7 · Sibling arms A1 and A11 — neither restated nor contradicted

Read against the block's twenty-five sibling pools, and against the six other `Beasts & Monsters`
rungs in particular:

- `plagued, perimeter AND organized force` · `plagued, perimeter but NO force to hold it` ·
  `frontier, credible deterrence` · `frontier, force without a perimeter` · `settled, defenses
  beyond the need` · `settled, nothing organized` are DISJOINT branches of one STATE-KEY: each
  asserts a different value of the same reader. No contradiction is possible and none is
  restated. The vocabulary held clear of them for sibling distance: **thick with creatures**
  (`:2596`), **the perimeter** and **long stretches of good work** (`:2602`), **the watch thins**
  (`:2603`), **credible deterrence** and **the wild country** (`:2611-2613`), **substantial
  works** and **relaxed** (`:2621-2623`), **heartland** (`:2626`) appear in no wording here.
- The `Invasion & War: neither walls nor force` rung (`:2655-2658`) prints on the SAME PAGE and
  reads the same two buckets against WAR. This pool therefore never lets "embattled" stand
  unbound, never says "raiders", "the enemy", "an attack" or "a siege", and never states the
  absences as a claim about what an army could do (C7; W17). Its own claim stays the country's
  monster tier.
- `DS-DEF-5` may print `watch PRESENT`, `mercenary PRESENT` or `charter hall PRESENT` on the
  same tab. Nothing here says "no watch", "no specialists", "no hired men" or any totality that
  those rows would contradict.
- The head record names the settlement's TIER on the same page. Nothing here calls the place a
  town, a village or a hamlet.
- `DS-DEF-1`'s readiness badge is an AGGREGATE on the same page. Nothing here uses "undefended"
  or any band word (W20).
- **No wording restates a sibling's fact and no wording contradicts one.** The one contrast
  device (wall 5) is not used at all: no wording names a rejected alternative, so R-DA-02's
  contrast ceiling is not spent here.

### N8 · Refusals

**None.** All three variants were made lawful under the card; each keeps every LICENSED claim
its shipped sentence carried (variant 1's C1, C2 and C3; variant 2's C1 in substance; variant
3's C1 in substance) and states outright the reads the shipped sentence left to implicature;
each drops every unlicensed claim listed in N1. No variant is banked as a refusal row and the
banked count for this pool is zero.

The ratchets: **variant count 3 before and 3 after**, the vids, the order and the angle tags
unchanged (index 0 `[ledger]`, index 1 `[street]`, index 2 `[visitor]`); **face count rises from
0 to 9 sub-rows**, so the wording count rises from 3 to 12 and only ever rises (§22, never
trim). Nothing was deleted, merged or shortened out of existence: the shipped text's slot
survives in every case and its words leave the product because they fail the voice, exactly as
§22 defines the edge.
