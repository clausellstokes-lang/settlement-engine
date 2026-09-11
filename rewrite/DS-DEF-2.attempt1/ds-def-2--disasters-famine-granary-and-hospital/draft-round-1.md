# DS-DEF-2 · `Disasters & Famine`: granary AND hospital — REWRITE, draft round 1

Seat: Opus 5 — Fable-unvalidated. Writer packet. The rows below are the complete replacement
for this pool's variant rows, ready to paste under the pool's bold heading in
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. Three variants in, three out; each under its own
number, its own bracketed tag unchanged, one `[plain]` line and three `[face]` sub-rows.
Nothing else in the pool is touched: the block's typed lines (RECEIPT, STATE-KEY, SLOTS,
SECTION-TARGET, PROVENANCE + FENCE, PDF PARITY) and the pool's bold key line are not mine and
are not repeated here.

---

1. `[ledger]` `[plain]` The town at {settlement} keeps a granary and a hospital.
   - `[face]` The town's keeping at {settlement} runs to a granary and a hospital.
   - `[face]` At {settlement} the town has a granary in its keeping, and it has a hospital in the same keeping.
   - `[face]` A hospital is kept at {settlement}, and a granary is kept there by the same town.
2. `[street]` `[plain]` This town has a granary and a hospital.
   - `[face]` The hospital stands, and the granary.
   - `[face]` In this town a granary stands, and in this same town a hospital stands as well.
   - `[face]` Here the town has a granary of its own, and a hospital of its own.
3. `[counterforce]` `[plain]` A granary stands at {settlement}, and a hospital.
   - `[face]` Both a granary and a hospital stand.
   - `[face]` Where the town at {settlement} stands, a granary stands and a hospital stands as well.
   - `[face]` Among the buildings the town at {settlement} has standing are a hospital and a granary.

---

--- NOTES

## 0. THE CARD, PRINTED AT THE DOCK BEFORE A WORD WAS WRITTEN

`node scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: granary AND hospital'`, run
in `laneRW-DEF2` (the only thing executed anywhere; nothing else ran, nothing in any dock was
written):

`role spine` · `reads disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL in
defenseStateProse.js)` (absent ⇒ no candidate) · `predicate ... === granary, hospital` ·
`bag {band: RESERVED, route: proper, settlement: proper}`, **FILLED at this block's call sites
`{settlement}`** · `relation (a spine takes no relation)` · `seat/form (not a seat-taker) /
sentence` · `move (none declared)` · `angle counterforce ledger street` · `attach (empty: a
spine takes no attach set)` · `echo spine mounts 1 (tabs: defense) · modifier mounts 0` ·
`covert no` · `source (none) · standing SOURCE-UNRESOLVED — NO citation is licensed; a face
naming a record holder here is refused by arm A13` · `audience player (no mark)` ·
**`may claim`: that the read holds (=== granary, hospital), as a STANDING fact of the record** ·
**`may NOT`: a count, a cause, a season, a future, a standpoint, a second fact, another civic
object of the class `care`** · `REFUSED COLUMNS, always: a totality over persons; an exemption
from a duty; a named character and that character's fate; a theological claim about a deity`.

**The predicate, re-grounded at the leaf** (`src/domain/display/stateProse/defenseStateProse.js:516-530`,
`:597`): `disasterRowSituation(granary, hospital, church)` returns `'granary, hospital'` on
`granary && hospital`, and the arguments are `civicFlag(compound.hasGranary)`,
`civicFlag(compound.hasHospital)`, `civicFlag(compound.hasChurch)`. Two consequences bind every
face. **(a) The claim is PRESENCE, not contents:** the flags say the two buildings stand, and
say nothing about what is in the granary or who is in the hospital. **(b) `church` is not
consulted on this branch** — the docblock at `:507-511` states it in the file's own words — so
its value is UNKNOWN here and no face may name a church, a parish, clergy or an infirmary.

## 1. WHAT EACH FACE CLAIMS, AND THE CARD CLAUSE THAT LICENSES IT

Every one of the twelve wordings asserts **exactly one typed claim** — the card's `may claim`
line, `disasterRowSituation(...) === 'granary, hospital'`, in the present, as a standing fact of
the record — and nothing else. Where a face names `{settlement}` the slot is licensed by the
card's `bag`, FILLED at this block's call sites. There is no second claim anywhere in the set,
so the four faces of each variant are claim-equal to one another (arm A6) and to the variant
they replace, minus the matter §2 lists as refused.

| # | face | words | the claim, and its licence |
|---|---|---|---|
| 1 | `[plain]` The town at {settlement} keeps a granary and a hospital. | 10 | granary present AND hospital present, standing → `may claim`. `{settlement}` → `bag` (FILLED). `keeps` asserts the town holds them, which is what the two flags are; no contents, no cause, no season. |
| 1a | The town's keeping at {settlement} runs to a granary and a hospital. | 12 | same one claim → `may claim`; `runs to` is the extent of the holding, not a second fact. Slot → `bag`. |
| 1b | At {settlement} the town has a granary in its keeping, and it has a hospital in the same keeping. | 19 | same one claim, said as two parallel entries of the office's own formula (REGISTER-CARD: "the WORD may recur; the FACT must not") → `may claim`. The trailing coordinate names the SECOND BUILDING of the same predicate value, so it is the claim's other half and not a qualifying beat. Slot → `bag`. |
| 1c | A hospital is kept at {settlement}, and a granary is kept there by the same town. | 16 | same one claim, agentless passive with the keeper named at the close → `may claim`. `the same town` is the settlement the slot already names; it introduces no office, holder or role. Slot → `bag`. |
| 2 | `[plain]` This town has a granary and a hospital. | 8 | same one claim → `may claim`. No slot: the shipped variant 2 carries none and the face slot set must equal its parent's (ARCH §2.5, the `[face]` row). |
| 2a | The hospital stands, and the granary. | 6 | same one claim, gapped → `may claim`. |
| 2b | In this town a granary stands, and in this same town a hospital stands as well. | 16 | same one claim, the locative frame repeated → `may claim`. |
| 2c | Here the town has a granary of its own, and a hospital of its own. | 15 | same one claim; `of its own` states the holding, which is the flag → `may claim`. It does not claim the town built them (no event provenance) or that no one else has one. |
| 3 | `[plain]` A granary stands at {settlement}, and a hospital. | 8 | same one claim, object-fronted → `may claim`. Slot → `bag`. |
| 3a | Both a granary and a hospital stand. | 7 | same one claim → `may claim`. `Both` is resolved inside the sentence by the pair it heads; it is not a count of anything (the card's `may NOT: a count` bites on quantities the record does not hold, and the pair IS the predicate value). |
| 3b | Where the town at {settlement} stands, a granary stands and a hospital stands as well. | 15 | same one claim → `may claim`. The frame asserts only that the town stands where it stands; it makes no geography claim (no terrain, route or neighbour is named — MOVE-GRAMMAR §1.2 row 8 has no licensing field here). Slot → `bag`. |
| 3c | Among the buildings the town at {settlement} has standing are a hospital and a granary. | 15 | same one claim, inverted → `may claim`. `Among the buildings` implies other buildings exist and asserts nothing about them; it is not a totality (no `closed` column is read) and names no second civic object. Slot → `bag`. |

**Slot sets.** Variant 1: `{settlement}` in all four wordings, exactly once. Variant 2: none in
all four. Variant 3: `{settlement}` in all four, exactly once. Every face's slot set is
byte-equal to its parent's (ARCH §2.5's `[face]` refusal). `{band}` is RESERVED and `{route}` is
never filled at this block's call sites; neither appears anywhere in the set.

**No citation, anywhere.** `source` is `(none) · SOURCE-UNRESOLVED`, so S3's PROVENANCE move
(MOVE-GRAMMAR §4.4.3) is unlicensed on this pool and arm A13 would refuse it. No face names a
holder, a roll, a register, a book or a keeper. Twelve faces, zero citations.

## 2. THE REFUSALS — matter the shipped variants carried that the card does not license

A refusal is a result. Each row below names the shipped words, the card clause or wall that
refuses them, and the counterfactual under which they would come back. **Nothing was trimmed
in §22's sense:** no variant, no face and no pool row is removed, the three vids and their order
stand, and the twelve wordings replace three. What falls away is unlicensed matter inside a
sentence, which §22 states plainly is editing and not trimming.

- **R1 — variant 1's post-semicolon clause is gone.** Shipped: *"…; between them the town can
  take a failed harvest or an outbreak without either becoming a catastrophe."* Refused three
  times over: the card's `may NOT` bars **a second fact**, **a cause** and **a season**; `can
  take` is the shape of `PROVENANCE_LEXICONS.capacity` (`entryLexicons.js:246-251`: `can hold`,
  `can feed`, `can shelter`), which is a capacity claim on a field that holds only two booleans;
  and `without either becoming` forecasts an outcome the record does not hold (A2, STATE NEVER
  FATE). **This clause is also the site of twelve of the taste sample's twenty-four WITHHELD
  composed units** — `armQualify` (`entryWalker.js:866-906`) splits each sentence on `;`,
  considers every part after the first, and withholds a part that names no slot, no band word
  and no second typed field. Removing the semicolon removes the arm's input. **Counterfactual:**
  if the chair rules that the row's readiness capability is licensed — by `scores.disaster`, by
  the badge the card marks `band: RESERVED`, or by the block's own PROVENANCE + FENCE line
  ("the causal clauses here are *capability* clauses … and never *historical* ones") — the
  clause returns in round 2 as a second SENTENCE naming that field, never as a semicolon tail.
- **R2 — variant 2's close is gone.** Shipped: *"…and knows exactly what having both is worth."*
  Refused by the card's `may NOT: a standpoint` (a valuation held by the town) and by
  MOVE-GRAMMAR §1.3's non-move **VERDICT/UPLIFT** (no field holds what a fact is worth); it is
  also the machine signature the REGISTER-CARD names, the evaluative close. **Counterfactual:**
  none — no field in this block's reads can carry a valuation.
- **R3 — variant 3's whole surface is gone.** Shipped: *"Neither a failed harvest nor an outbreak
  turns into a catastrophe at {settlement}, and the reason is in the two buildings rather than in
  the luck."* Four refusals at once: **a season** and **a cause** (`the reason is`) on the
  `may NOT` list; **a count** (`the two buildings`); and a contrast whose rejected alternative
  (`rather than in the luck`) no sibling pool key names — **the site of the other twelve WITHHELD
  units**, `armA3` (`composedWalker.js:502-548`) reading `contentWords` over the twenty-eight
  sibling keys of DS-DEF-2, none of which holds `luck`. The rewritten variant 3 keeps its
  `[counterforce]` tag and its angle (what stands) and drops the pressure, the cause and the
  contrast.
- **R4 — no wording opens on the slot.** Shipped variant 1 opened *"{settlement} holds food…"*.
  ARCH §2.5 refuses a sentence-form row opening on a `proper`-typed slot of the block's bag
  (T-F8), and the seam contract states a sentence-form row begins on a capital that is not a
  `proper` slot. Cured: twelve wordings, zero slot openers; the one wording that begins near the
  token (`At {settlement} …`, 1b, and `A granary stands at {settlement}` , 3) opens on a capital
  that is not the slot. R-DA-17/Q15's "the settlement token opens at most one variant per pool"
  is satisfied vacuously at zero.
- **R5 — no face asserts what the granary HOLDS.** Shipped variant 1 claimed *holds food against a
  bad year*, variant 2 *a place for grain*. The stock is `economicState.foodSecurity.label`, which
  is the field of the two modifiers that attach to this pool alone (`stores: short`,
  `stores: import-fed`; ARCH §6.4). A contents claim in the spine would exceed the card (`may NOT:
  a count`) and would read against its own modifier in composition — *holds food against a bad
  year* beside *more is eaten than is raised and carried in*. The spine now states the HOLDING and
  the modifier states the FLOW, which is the disposition the taste sample's F3 asked for and could
  not reach from the modifier's side.
- **R6 — the church, the parish, the clergy and the infirmary are unnamed.** The branch does not
  consult `church` (`defenseStateProse.js:507-511`, `:516-521`), so its value is unknown here, and
  the card refuses **another civic object of the class `care`**. Naming one would also restate the
  sibling pool `Disasters & Famine: granary AND parish care only` (arm A1). Twelve faces, zero.
- **R7 — the law this set cannot meet: the pool cannot carry three DISTINCT level-1 grammars.**
  MOVE-GRAMMAR §3.2 asks a pool of k variants for min(k, 8) distinct level-1 grammars. The card
  declares `move: (none declared)`, no relation, no attach, no event-provenance field, no
  `none-exists` field, no institution row and no unresolved value, so of §2.1's eight members only
  **V1 (PRESENT)** and, on the object-fronted wordings, **V4 (OBJECT → PRESENT)** are licensed
  here: V2, V3, V5, V6, V7 and V8 each need a field this block does not hold, and §3.2 forbids
  writing a member the block cannot license. The set therefore carries TWO grammars across three
  variants — variant 1 and variant 2's plain line as PRESENT, variants 2a and 3 as OBJECT →
  PRESENT — which meets §2.1's "at least two in every pool of two or more" and **fails min(k, 8) =
  3**. This is a licensing fact about the pool, not a wording fault: no rewording of a two-boolean
  predicate can manufacture a third licensed grammar. **Banked as a refusal row with its
  measurement, for the sitting.** No `[grammar: Vn]` tag is written by this packet; the typed
  lines are not mine.
- **R8 — the claim reduction is a same-seed TEXT shift and is the chair's to sign.** Every
  installed world at this cell reads different words after this rewrite, and it reads FEWER
  claims: R1, R2 and R3 remove matter a reader sees today. ARCH §8.6 keeps the shift register for
  exactly this. Declared here, sized here (3 variants, 3 dropped claim-fragments, 12 wordings,
  1 cell of DS-DEF-2's 26), and not decided here.

## 3. THE MEASUREMENT — computed on this set, by hand, against the detectors transcribed from the dock

| measure | band / floor | this set |
|---|---|---|
| variants written | 3 in, 3 out, same vids, same order, same tags | **3 · 3** |
| wordings | 4 per variant (1 `[plain]` + 3 `[face]`) | **12** |
| words per wording | — | 10 · 12 · 19 · 16 · 8 · 6 · 16 · 15 · 8 · 7 · 15 · 15 (sum 147) |
| R-DA-05 · within-pool word-count sd | ≥ 4.0 | **4.13 population · 4.31 sample** (mean 12.25, range 6–19, sum of squared deviations 204.25) |
| A11 · two-word openers, all distinct | 12 distinct | **12 distinct**: the town · the town's · at {} · a hospital · this town · the hospital · in this · here the · a granary · both a · where the · among the |
| wordings opening on a `proper` slot (T-F8) | 0 | **0** |
| semicolons · colons · em dashes · digits · question marks · exclamation marks · parentheses | 0 | **0 each** |
| `which`-clauses · bare relatives (`BARE_RELATIVE`) | 0 | **0** |
| `CONTRAST_SHAPES` (`entryLexicons.js:304`) | 0 | **0** |
| `FUTURE_INDICATIVE` (`will` / `shall`) | 0 | **0** |
| `QUANTIFIERS` (`every, all, each, only, none, any, no, whole, entire, …`) | 0 | **0** |
| `AUTHORED_MAGNITUDES` (`a handful, a dozen, half, several, some, many, …`) | 0 | **0** |
| `PROVENANCE_LEXICONS` capacity · spatial · actor | 0 | **0 each** |
| `RELATION_LEMMAS` · `RECORD_CITATION` · `SPECIFICATIONAL_COPULA` | 0 | **0 each** |
| expletive opener (`There is` / `It is`) · participial opener · `-ly` adverb · doubled adjective · triad | 0 | **0 each** |
| `CLOSE_KINDS` distribution (R-DA-04, vary the kind) | not one kind | **civicNoun 2** (2a and 3c close on `granary`; both also carry a standing verb) · **standingFact 8** · **unclassified 2** (1a carries none of the list's standing verbs and closes on `hospital`, which the civicNoun list does not hold; 3a's `stand` is not the list's `stands`); **pronoun 0 · abstraction 0** |
| sentences per wording | — | **1 each** (the shipped three were one each; A11's sentence-count spread is unchanged because it was flat before) |
| citations (A13) | 0 | **0** |
| typed claims per wording | 1, and identical across the twelve | **1 · identical** |

**The two inherited findings, discharged at their site.** CLERK-LAWS §2.6.1 keys a finding on
its SITE, and both sites named by the taste sample's refusal R1 are inside this pool's own bytes.
Neither survives: variant 1 carries no semicolon, so `armQualify` has no segment after the first
to consider on any of its four wordings; variant 3 carries no contrast shape, so `armA3` reports
NOT-EXECUTABLE rather than WITHHELD. **PREDICTED, not executed** (this packet runs no walker):
the thirty-six composed units of this pool × the twelve `stores: short` faces should move from
`FAIL 0 · WITHHELD 24 · PASS 12` to `FAIL 0 · WITHHELD 0 · PASS 36`. The gate is where that
claim meets reality, and it is the lane's to run, not the writer's.

## 4. THE THREAD (MOVE-GRAMMAR §1.4.1, owner ~21:4x)

This pool is the **spine** of the disaster rung: the composer puts it first and orders modifiers
after it by salience, so a face here never follows anything — it must HAND a noun forward rather
than pick one up. Every wording ends on or carries `granary`, `hospital` or `the town`, and the
two modifiers that can ever attach here (`stores: short`, `stores: import-fed`) both open on the
food the town eats and both name `{settlement}`; the thread runs building → town → what the town
eats without a change of subject that hands nothing back. No wording opens on a pronoun, a
demonstrative or a possessive whose referent lies outside its own sentence: `Both` in 3a is
resolved by the pair it heads, `it` in 1b by `the town` earlier in its own sentence, `its own` in
2c by `the town` earlier in its own sentence. Each was read aloud after each of the three plain lines and before each of the two
modifiers' shipped faces.

## 5. WHAT DISTINGUISHES THE FOUR FACES OF A VARIANT, AND THE DECLARED COST

The claim is two civic nouns and nothing else, and R-DA-22 fixes one term per thing across the
pool: **granary** for the store building, **hospital** for the care building, both the words the
predicate itself uses. So the faces are differentiated by **rhythm and syntax**, never by synonym
— which is what "a different vocabulary or rhythm inside the voice" licenses, and what arm A5
(four synonym swaps) is aimed at. Within variant 1: plain coordination · an abstract subject with
an extent verb · a fronted locative with the office's formula repeated · an agentless passive
with the keeper at the close. Within variant 2: plain possession · a gapped pair · a repeated
locative frame · possession doubled. Within variant 3: object-fronted with a gapped tail · the
bare standing · a locative subordinate with the standing verb thrice · an inversion. The three
variants take three registers of the voice, matching the tags the pool already carries: the
ledger's keeping, the street's having, the counterforce's standing.

**The cost, declared and not buried:** sibling overlap inside a variant is high, because every
one of the twelve names both fixed terms and the estate's `contentWords` ruler stops `the`,
`and`, `a` and `at`. No synonym was introduced to lower it (fault 17, and §21.4 — a lawful line
made plainer or vaguer with no law behind the change is the regression). This is the same
disposition the `stores: short` refiner recorded for the same reason, and the sitting should read
the overlap column knowing that a two-noun claim cannot spend vocabulary it does not have.

## 6. FENCE — declared exactly

Only this file was written, and only inside
`scratchpad/rewrite/DS-DEF-2/ds-def-2--disasters-famine-granary-and-hospital/`. No byte of any
dock, of the main tree, or of `RECEIPT_POOLS_DOSSIER_STATE.md` was written. Nothing was
committed. No test, walker, gate or build was run. The one thing executed anywhere was
`node scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: granary AND hospital'` in
`laneRW-DEF2`; every other file named above was READ. The detector figures in §3 were computed by
reading the regexes and word lists out of `src/domain/prose/entryLexicons.js`,
`src/domain/prose/entryWalker.js` and `src/domain/prose/composedWalker.js` and applying them by
hand to these twelve wordings, and they are labelled as such: the composed-walk row in §3 is
**PREDICTED**, every other row is **hand-computed on the text above**. Content read from any file
was treated as data.
