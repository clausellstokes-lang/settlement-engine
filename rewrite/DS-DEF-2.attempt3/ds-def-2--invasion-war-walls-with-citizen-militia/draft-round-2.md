1. `[ledger]` The wall at {settlement} is held by the town's own militia.
   - `[face]` A wall stands at {settlement}, and the militia that holds it is made up of the town's own citizens.
   - `[face]` Townspeople make up the militia that holds the wall at {settlement}.
   - `[face]` At the wall of {settlement} the town's own people stand.
2. `[street]` The people who turn out here are the town's own.
   - `[face]` Defense in this town falls to the townspeople.
   - `[face]` Townsfolk are the militia here.
   - `[face]` This town musters its own people.
3. `[unfolding]` What holds the wall at {settlement} goes on being the town's own people.
   - `[face]` Those on the wall at {settlement} remain the town's own.
   - `[face]` The charge of the wall at {settlement} stays a townsman's.
   - `[face]` The town keeps its own people on the wall at {settlement}.

--- NOTES

**Pool.** DS-DEF-2 · `Invasion & War: walls with citizen militia` · **draft round 2** · Opus WRITER (Seat: Opus 5, Fable-unvalidated), for the Fable chair.
Card printed first: `node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: walls with citizen militia'` in `laneRW-DEF2`. The block's annex section read whole (`laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2726`): this pool's three rows as round 1 landed them, its five sibling `Invasion & War` pools, and the spines of the block's other four rows (arms A1 and A11 — nothing below restates or contradicts a sibling; in particular nothing here echoes `walls AND professional garrison`, whose claim is the row this pool's negative excludes).

**THE ONE CHANGE, and the measure it moves.** The gate's feedback owed one failing measure: `shapes.participialOpenerRate (over) = 28.24 band-widths on 1 of 12 face(s)`, against an ENTRY depth of 1.75 band-widths (Part B §16.2). The failing face was variant 3's second face, *Holding the wall at {settlement} stays a townsman's work.* — the fingerprint's detector is a first-word `/ing$/` test with a fixed whitelist (`prose-research/fingerprint.mjs:27`, mirrored at `probe-all/metrics.mjs:68`), and `Holding` is on neither whitelist, so that one face measured at rate 1.0 against a register band whose centre is 0.0117.

It is **replaced**, one for one (§22 (e): refinement is a substitution, never a removal), by
`The charge of the wall at {settlement} stays a townsman's.`

The replacement is not a determiner bolted onto the same gerund (*The keeping of…* would pass the detector while leaving the shape the detector is a proxy for). It changes the shape: a plain nominal subject with an `of`-complement, a durative copular verb, and an elliptical possessive predicate. **No wording in the set now opens on an `-ing` word at all** — the twelve first words are `The · A · Townspeople · At · The · Defense · Townsfolk · This · What · Those · The · The`, and the twelve two-word openers are listed at §4. Measured on the set: `participialOpenerRate` **1 of 12 → 0 of 12**; the measure is moved from failing to zero, so this round is not dry.

Nothing else in the set is touched. The other eleven wordings are byte-identical to round 1, because the gate named no other failing measure on them and §21.2's push toward the ceiling is the REFINEMENT round's job (a different author, Part B §21 phase 2), not this one. The two round-1 judgment calls carried to the sitting are carried again, unchanged, at §5 below.

**Counts.** 3 variants · 12 wordings (3 spine rows + 9 `[face]` sub-rows, i.e. four faces per variant). None added, none removed, none merged, none reordered; each variant keeps its own vid, its own order and its own single angle tag (`[ledger]`, `[street]`, `[unfolding]`), exactly as the corpus carries them and exactly as the card's `angle:` line prints them. No `[plain]` marker anywhere — ARCH §2.5 seats `plain` on `role: modifier` rows only and this pool is a **spine** (card: `role spine`), so the projector's typed-declaration branch would throw on it. The `[face]` marker is BACKTICKED, to `FACE_ROW_RE` at `laneRW-DEF2/scripts/lib/dossier-annex-grammar.mjs:107` (`/^\s*-\s+`\[face\]`\s+(.*)$/`).

**Word count per wording** (whitespace tokens; `{settlement}` counts one):

| variant | spine row | `[face]` 1 | `[face]` 2 | `[face]` 3 |
|---|---|---|---|---|
| 1 · `[ledger]` | **11** | **19** | **11** | **10** |
| 2 · `[street]` | **10** | **8** | **5** | **6** |
| 3 · `[unfolding]` | **13** | **10** | **10** | **11** |

mean **10.33** · min **5** · max **19** · within-pool sd **3.375** (round 1: 3.39). Every wording is ONE sentence; no semicolon and no colon anywhere, so a spine composed on any of these contributes no second segment and no arm-Q summarising beat to its unit.

---

## 1. WHAT THE CARD LICENSES — the components, read at the branch

The card prints one claim: that `invasionRowSituation(walls, garrison, militia)` selects the row `walls, citizen militia` of `INVASION_ROW_POOL` in `defenseStateProse.js`, **as a STANDING fact of the record**. Read against the branch (`src/domain/display/stateProse/defenseStateProse.js:476-483`), that one row-selection is reached on `walls && !garrison && militia` and resolves to three components of ONE typed claim (one table row, one key string), never three separate facts:

| # | component | the read that licenses it | what it does NOT license |
|---|---|---|---|
| W | the town has a wall | `walls` — supplied by `defenseProfileHasWalls`, never a presence check on `institutions.walls` (the block's own FENCE, `:2585-2592`) | a second civic object of the wall class (a gate, a ditch, a tower), the wall's extent, condition, upkeep or ownership |
| M | the force on it is a citizen militia | `militia` true (`:479`) | a count, a wage, a rota, a muster date, a name, or what the militia would do |
| G | the town has no professional garrison | `garrison` false — the branch reads `garrison` **before** `militia` on both sides of the wall, so the row's identity includes the negative (`:472-474` docblock) | an explicit contrast unless the old sentence made one; see §2 |

**Why a comma-and joint is not a second fact.** The card's `may NOT` bars *a second fact*. W and M are one row of one table — the key string is literally `walls, citizen militia` — so a wording that states them in one sentence asserts ONE typed claim. Every wording above is one sentence with at most one joint, and the joint is a comma and `and`; no `which`, no em dash, no colon-as-payoff, no digit or percent.

**G is carried implicitly and never as a bare antithesis.** The citizen vocabulary (*militia*, *townspeople*, *townsfolk*, *citizens*, *the town's own people*, *a townsman*) is the row's own discriminating token and is what separates this pool from `Invasion & War: walls AND professional garrison`. R-DA-02 licenses a contrast only where the rejected alternative names a sibling pool key, and it bars the bare *X, not Y* shape and the fronted contrast outright; none of the twelve takes that shape, and none states the negative as its own clause, because no old sentence in this pool stated it.

**No citation is taken.** The card licenses one (`source: muster · standing LICENSED`), but Part B §24 caps provenance at one citation per unit and only for S3's three reasons — two accounts disagreeing, a count from an interested party, a keeper who is a power. None holds here: there is no count anywhere in the twelve, no dispute, and the office would be citing its own roll (MOVE-GRAMMAR §4.4.3 makes that a finding). The exemplar registers with raw text cite at zero per 786 sentences. A citation would also ADD a claim (a cited claim is two licensed claims) to sentences that never carried one.

---

## 2. VARIANT BY VARIANT — what was kept, and what was dropped

The dispositions below are round 1's and are unchanged; they are restated in full because this packet is the pool's complete replacement and must stand alone. The old sentences are the corpus's pre-rewrite rows. Dropping is the rewrite's purpose; the shipped breach is the corpus's known state. Nothing is added anywhere.

### Variant 1 · `[ledger]` — KEPT W + M

Old row: *"Walls at {settlement} with townspeople behind them: credible against raiders, and inadequate against anybody who arrives professionally and brought siege gear."*

| claim in the old sentence | disposition | law |
|---|---|---|
| walls stand | **KEPT** (W) | `may claim` · `predicate` |
| townspeople are behind them | **KEPT** (M) | `may claim` · `predicate` |
| *"credible against raiders"* | **DROPPED** | `may NOT: a standpoint` and `a future` — a rating of the arrangement against a hypothetical attacker; MOVE-GRAMMAR §1.3 VERDICT and FORECAST, neither of which exists anywhere in the estate |
| *"inadequate against anybody who arrives professionally"* | **DROPPED** | same two, plus `may NOT: a second fact`; the CONSEQUENCE move needs event provenance × a household or office row (§1.2 row 7) and this pool has neither |
| *"and brought siege gear"* | **DROPPED** | `may NOT` a particular no read holds — hollow specificity, fault 24; also a past-tense verb with no event-provenance field (R-DST-B) |
| the colon-as-payoff | **DROPPED as form** | R-DA-06 (one joint, chosen); the payoff colon is the shape the two dropped clauses hung on |

### Variant 2 · `[street]` — KEPT M only

Old row: *"The town would turn out and does not pretend that turning out is the same as being defended."*

| claim in the old sentence | disposition | law |
|---|---|---|
| the town's own people are the force (*would turn out*) | **KEPT** (M), in the present habitual | `may claim` · `predicate`; the subjunctive *would* is dropped, not converted to a future (R-DA-07, A2) |
| *"does not pretend that turning out is the same as being defended"* | **DROPPED** | `may NOT: a standpoint`; a belief frame on the town (R-DA-13's belief floor); a **totality over persons** (REFUSED COLUMN) in *the town does not pretend*; and MOVE-GRAMMAR §1.3 MEANING — the summarising second beat |
| W (the wall) | **NOT ADDED** | the old sentence names no perimeter object; adding it would breach *never ADD a claim*. The variant is honestly thinner than its siblings, and that is the drop working. **Contestable — carried at §5.** |
| the slot | **HELD EMPTY** | the old row carries no `{settlement}`; a face whose `{slot}` set differs from its parent's is refused (T-F8), so all four of this variant's wordings carry none |

### Variant 3 · `[unfolding]` — KEPT W + M

Old row: *"What {settlement} has would hold against the first thing and is unlikely to hold against the second, and nothing in hand changes that."*

| claim in the old sentence | disposition | law |
|---|---|---|
| the arrangement stands (*what {settlement} has*, *nothing in hand*) | **KEPT** (W + M) — the referent of both phrases is the row's own two holdings | `may claim` as a STANDING fact |
| *"would hold against the first thing"* | **DROPPED** | `may NOT: a future` and `a standpoint`; the referents *the first thing* / *the second* resolve only against variant 1's dropped attacker classes, so they carried nothing licensed of their own |
| *"is unlikely to hold against the second"* | **DROPPED** | same, plus a probability hedge on an outcome — R-DA-13's quantity/likelihood floor |
| *"and nothing in hand changes that"* | **DROPPED** | `may NOT: a second fact` and `a future`; a forecast of non-change, and a totality (*nothing*) over the town's holdings |

---

## 3. FACE BY FACE — which card clause licenses each claim

Every face is claim-equal to its three siblings (arm A6 reads ACROSS the family, not back to the old sentence). No wording opens on the `{settlement}` slot (T-F8); no wording opens on the settlement token at all, so R-DA-17's wall 10 is satisfied with room.

**Variant 1** — every face carries W + M, both under `may claim` / `predicate`:

| face | W licensed by | M licensed by | close · kind |
|---|---|---|---|
| spine · *the wall … is held by the town's own militia* | `predicate` (`walls`) | `predicate` (`militia`) | *militia* · object |
| 1 · *a wall stands … the militia that holds it is made up of the town's own citizens* | `predicate` | `predicate` | *citizens* · object |
| 2 · *townspeople make up the militia that holds the wall* | `predicate` | `predicate` | *the wall at {settlement}* · object |
| 3 · *at the wall … the town's own people stand* | `predicate` | `predicate` | *stand* · condition |

**Variant 2** — every face carries M only:

| face | M licensed by | close · kind |
|---|---|---|
| spine · *the people who turn out here are the town's own* | `predicate` (`militia`); *turn out* is the militia's standing constitution, in the present habitual | *the town's own* · condition |
| 1 · *defense in this town falls to the townspeople* | `predicate` | *the townspeople* · object |
| 2 · *townsfolk are the militia here* | `predicate` | *the militia here* · object |
| 3 · *this town musters its own people* | `predicate`; the muster is this settlement's own institution (card `source: muster · standing`), named as a verb and not cited | *its own people* · object |

**Variant 3** — every face carries W + M:

| face | W licensed by | M licensed by | close · kind |
|---|---|---|---|
| spine · *what holds the wall … goes on being the town's own people* | `predicate` | `predicate` | *the town's own people* · object |
| 1 · *those on the wall … remain the town's own* | `predicate` | `predicate` | *the town's own* · condition |
| 2 · **NEW** *the charge of the wall … stays a townsman's* | `predicate` (`walls`) — the wall is the sentence's own subject-head | `predicate` (`militia`) — *a townsman's* is the row's citizen token in its singular form, the whole predicate of the sentence | *a townsman's* · object |
| 3 · *the town keeps its own people on the wall* | `predicate` | `predicate` | *the wall at {settlement}* · object |

**The new face, read against every wall.** One sentence · one clause · no joint · no em dash, exclamation, question, digit, percent, semicolon, colon, parenthesis or `which` · no citation · no "I" and no "you" · no future indicative, no subjunctive, no forecast · no figure, simile or inanimate intent (*charge* is custody in the record's plain sense, not a metaphor and not an intent assigned to the wall) · no expletive or *it is the* opener · no quantifier and no totality over persons (*a townsman's* is a singular possessive predicate, not a claim about all townsmen or about every wall duty) · no count, wage, rota, date or name · no second civic object of the class `force` (the militia is named once, in its own token) · no office, exemption or duty row asserted — the sentence says who the wall's holding lies with, which is the row's own selection, and asserts no obligation, no roster and no exemption (`whoIsExempt` is null everywhere and is untouched here). **Contestable in one direction only, and carried at §5 item 3.**

**THE WALLS, checked on all twelve.** No em dash · no exclamation · no question · no digit and no percent · no `which`-clause · no second sentence · no citation · no "I" and no "you" · no future indicative and no forecast · no subjunctive edge · no figure, simile or inanimate intent · no expletive opener · no quantifier and no totality over persons · no office, count or exemption absent from the institution table · no named character and no fate · no theological claim · no season, tempo or cause · **no participial opener** · one bracketed tag per spine row and none on a face row.

**THE THREAD** (MOVE-GRAMMAR §1.4.1). These rows are spines, so each stands first in its unit and must HAND a noun forward rather than pick one up; there is no preceding sentence for any of the twelve to connect back to. Every wording ends inside a clause whose head noun is one of the three a modifier of this block can attach to — *the wall*, *the militia* (as *townspeople* / *townsfolk* / *citizens* / *people* / *a townsman*), or *the town* — so a modifier seated after any face carries a noun forward without needing the passage's one turn outward. The new face closes on *a townsman's*, the force noun in its singular, and holds *the wall* as its own subject-head, so a modifier of either salience band finds its noun. The two condition-closes (variant 1 face 3, variant 3 face 1) keep their subject noun in the clause rather than in the last word, which is the same hand-forward by a different rhythm.

**ONE TERM FOR ONE THING** (R-DA-22). The perimeter is *the wall* or *a wall* in all twelve, never *line*, *perimeter* or *works* — those are renames of a key object and the sibling pools use them. The force is rendered only in the row's own two words and their plain equivalents (*militia*, *townspeople*, *townsfolk*, *citizens*, *the town's own people*, *a townsman*); this is not a reverse thesaurus, because the CITIZENSHIP of the force is the row's discriminating content (component G) and not a decoration bought to buy distance. No wording reaches for *watch*, *garrison* or *soldiers*: the first is a different institution of this same block (`Internal Security`), and the other two are the civic object class the card's `may NOT` bars. *Charge* is not a second name for the wall or for the militia — it names the holding relation between them, which no other face names.

**SIBLING DISTANCE inside variant 3.** spine · a free relative subject with a durative copula (*What holds … goes on being*); face 1 · an NP-plus-locative subject with *remain*; face 2 · a nominal subject with an `of`-complement and an elliptical possessive predicate (*The charge of … stays a townsman's*); face 3 · the town as an active subject with a transitive verb. Four subjects, four verbs, four predicate shapes; no face is a paraphrase of a sibling, and the new face is the only one of the four whose subject is neither the force nor the town.

---

## 4. THE GRAMMARS, THE SPREAD, AND THE BANDS AS BANDS

**Grammars.** MOVE-GRAMMAR §2.1 asks a pool of k variants for `min(k, 8)` distinct level-1 grammars. Of the eight, only PRESENT-family members are drawable here: no event-provenance field (no V7), no `none-exists` field (no V3 — the row's negative is a branch condition, not a `none-exists` read), no `not-held` field with provenance (no V8), no institution row of the block's own (no V5), no unresolved value (no V6), no structural-consequence field (no V2). What remains is **V1 (PRESENT)** and **V4 (OBJECT → PRESENT)**, and the pool uses both: variants 1 and 3 open on the object and its state (V4), variant 2 opens on the state of the force (V1). Two grammars where the rule asks three is arithmetic on a conjunction spine, not a shortfall in the wording. The replacement face keeps variant 3 in V4 (the wall named first, then the state).

**Openers across the twelve** (A11 / R-DA-17): `The wall` · `A wall` · `Townspeople make` · `At the` · `The people` · `Defense in` · `Townsfolk are` · `This town` · `What holds` · `Those on` · `The charge` · `The town`. **Twelve distinct two-word openers, no repeats at all**; no variant and no face opens on the settlement token; **none opens on a participle or a gerund.**

**Close kinds** (R-DA-04): nine object closes and three condition closes, unchanged by the substitution. The other three kinds of the closed set are unreachable on this licence and the reason is typed, not stylistic — an ABSENCE close needs a `none-exists` or `not-held` field (none is read), a PROHIBITION close needs a duty or exemption row (`whoIsExempt` is null everywhere), and a NAME-NOT-GIVEN close needs a name field (the bag holds `{settlement}` alone). Reported, not worked around.

**Spread** (R-DA-05). Within-pool sd **3.375** against the rule's floor of ≥ 4.0 — one exceedance, unchanged in kind from round 1 (3.39) and well inside the ENTRY DEPTH of 1.75 band-widths (§16.2) and inside the BUDGET of two thirds. The substitution moves the figure by 0.015 of a word, which is noise: the new face is one word longer than the one it replaces and sits near the pool's mean. Sentence count is uniform at one across all twelve, and that uniformity is FORCED by the licence rather than chosen: a second sentence is a second FACT (R-DA-03, register card), and the card's `may NOT` bars one. The spread this pool can lawfully show is length (5 to 19 words) and construction, and both are spent — a relative-clause subject, a co-ordinate pair, a fronted locative inversion, an abstract-subject duty verb, a bare copula, an active institution verb, an `of`-complement nominal with an elliptical possessive, and a possessive predicate.

**Density** (§21.4). The five-word and six-word wordings (variant 2 faces 2 and 3) carry the whole claim set of their family; they are compressed, not plainer, and neither was reached by cutting a law-bearing word. The new face is likewise compressed — *stays a townsman's* is an elliptical possessive predicate, not a plainer restatement — and the substitution trades no density for plainness (§21.4's named regression). No wording is padded to sit at a band's middle, and the nineteen-word wording is long because it states both components with their constitution, not because length was wanted.

**Band position, reported.** `participialOpenerRate` 0 of 12 (band centre 0.0117, ceiling 0.020 — inside). `whichTailRate` 0. `thereIsOpenerRate` 0. `antithesisRate` 0. `triadRate` 0. `doubledAdjectiveRate` 0. `sameOpenerAsPreviousRate` 0 over the twelve. `emDashes`, `exclamations`, `questions`, `semicolons`, `colons`, `digitsInProse` all 0. The one exceedance measurable on this set is within-pool sd, above.

---

## 5. REFUSALS

**None.** All three variants are written lawfully, one for one, under their own numbers and their own angle tags. No variant is banked; the banked count for this pool stays at **zero**. No face was withdrawn (§22 (b)): the round-1 wording *Holding the wall at {settlement} stays a townsman's work.* is a one-for-one substitution under §22 (e), and its text stands in this packet and in the annex history as the measured failure it was.

**Three judgment calls recorded for the sitting, any of which the chair may overturn without touching the others:**

1. **Variant 2 carries no wall claim** (carried from round 1, unchanged). Its old row names no perimeter object at all — *turning out* is the militia's act and *being defended* is the standpoint that was dropped — so on the strict reading the old sentence asserts M and nothing else, and adding W would breach *never ADD a claim*. The cost is that variant 2's four wordings do not by themselves separate this pool from `Invasion & War: militia only`. If the chair rules that a pool KEY's own discriminating claim is owed by every variant of the pool regardless of what the old sentence said (U9 read forward rather than backward), variant 2's four wordings take W as well and the family stays claim-equal.
2. **The durative aspect in variant 3 is read as standing, not historical** (carried from round 1, unchanged). *goes on being*, *remain*, *stays* and *keeps* assert the state as it is now and say nothing about when it began; a HISTORY move would need `sourceEventId` or a `causes[]` edge, and this pool reads neither (R-DST-B). The `[unfolding]` angle has no other carrier on a pool with no provenance field. If the chair reads those verbs as importing a prior state, variant 3's four wordings fall back to the plain present and the angle tag survives as a wording marker only.
3. **NEW · *charge* is read as custody, not as a duty row.** The replacement face says where the wall's holding lies, which is the row's selection restated; it does not assert an obligation, a roster, an office or an exemption, and no INSTITUTION move is taken (no institution row is read by this pool). A refuter who reads *charge* as an assigned duty would want an institution row this block does not hold. If the chair takes that reading, the lawful fallback with the same claim set, the same rhythm class and no `-ing` opener is *The wall's holders at {settlement} are still the town's own.*, and the family stays claim-equal; the chair's ruling is asked for at the sitting rather than pre-empted here.

**One card note, reported not worked around** (carried from round 1). The card's `reads` and `predicate` lines both print the census's synthetic label `invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)` rather than field paths, so a claim-token check that splits that label on `.` recovers the dead tokens `js)` and no segment naming `walls`, `garrison` or `militia` can bind a claim to its field. The branch at `:476-483` is an exact `if and only if`, which is what §1 above is written from; one `FIELD_SYNONYM_ROWS` entry citing that branch would make the card readable for the five other `Invasion & War` rows of this block. The same note was raised on this block's `Beasts & Monsters` rows and is repeated here because the two rungs share the defect, not because it is new.
