# DRAFT ROUND 1 — DS-DEF-2 · pool `Disasters & Famine: granary, NO medical provision`

Seat: Opus 5 (WRITER, Fable-unvalidated), for the Fable chair. Round 1 of phase 1.
Written to `skeleton.md` (the Fable marker's packet) under the licence card printed by
`scripts/prose-licence-card.mjs`, the REGISTER CARD (S2, S3), RULES-V2-PART-B §1 / §16–16.2 / §18 /
§20–§23, MOVE-GRAMMAR §1–§3 / §4.4.1–4.4.3 / §1.4.1, CLERK-LAWS §2.4.1 / §2.6.1,
ARCH-COMPOSED-PROSE-v2 §2.5 / §8.3, and ADDENDUM 13's two law tables (bars W1–W27).

**Inventory:** 3 variants in, 3 variants out, one for one, each under its own vid, in order, under its
own shipped angle tag. 4 wordings per variant (the numbered row + three `[face]` sub-rows) = **12 faces**.
**Refusals: none** — all three variants are written lawfully; the residual craft findings for the
refinement round are in the NOTES.

---

## THE ROWS, READY TO PASTE UNDER THE POOL'S HEADING

**`Disasters & Famine`: granary, NO medical provision**
1. `[ledger]` A granary stands at {settlement}, and neither an infirmary nor a parish stands in the town.
   - `[face]` Grain is held in store at {settlement}, and the town has neither a parish nor a sick-house.
   - `[face]` A store of grain is kept at {settlement}, and neither an infirmary nor a parish stands beside the granary.
   - `[face]` Carried as standing at {settlement} is a granary; an infirmary and a parish are not.
2. `[unfolding]` Grain stays in store here, and the town stays without an infirmary or a parish.
   - `[face]` The store goes on holding grain, and the town goes on with neither a parish nor an infirmary.
   - `[face]` Stored grain stays stored, and no sick-house or parish stands in the town.
   - `[face]` Here the grain keeps its store, and an infirmary and a parish stay absent from the town.
3. `[street]` The granary at {settlement} is where the grain is; the sick-house and the parish are not here.
   - `[face]` Grain sits in the store at {settlement}, and no infirmary or parish is part of the town.
   - `[face]` The grain has its store at {settlement}, and an infirmary and a parish are things the town is without.
   - `[face]` Grain has a store at {settlement}, and no infirmary or parish stands in this town.

---

--- NOTES

### 0. THE CLAIM SET EVERY ONE OF THE TWELVE FACES CARRIES, AND NOTHING ELSE

The card's `may claim` line is one claim at the branch grain: *that the reader
`disasterRowSituation(granary, hospital, church)` selects the row `granary, no medical provision` of
`DISASTER_ROW_POOL`, as a STANDING fact of the record.* The skeleton decomposes it into the three
statable facts the branch is made of, and **R-4** — the PAIR — is the pool's discriminating claim.
Every face states all of them:

| id | claim | the card clause that licenses it |
|---|---|---|
| C1 | a granary stands on this town's record (spoken either as the storehouse noun or as its own entailment *grain is stored*) | `reads` / `predicate`: F1 `compound.inst.hasGranary === true` is a constituent of the selected branch. Entailment D-12 ENTAILS *grain is stored*, used as a MAY (bar W9), with no quantity, fullness, months, key-holder or draw riding on it |
| C2 | no hospital-class row stands (*infirmary* · *sick-house*) | `reads` / `predicate`: F2 `hasHospital === false` is a constituent of the selected branch; the ABSENCE move class (a) LACK, `none-exists` (MOVE-GRAMMAR §1.2 row 11) |
| C3 | no church- or parish-class row stands (*parish*) | `reads` / `predicate`: F3 `hasChurch === false`, consulted as `care` in this branch alone (the block's own docblock); same LACK class |
| C4 | the pair C1 ∧ (C2 ∧ C3) — what tells this pool from `granary AND hospital`, from `granary AND parish care only`, and from the two `NO reserves` pools | `predicate` (the branch is the conjunction); the CONTRAST is lawful under R-DA-02 because the rejected alternative names **sibling pool keys** of this same STATE-KEY row |
| C5 | the town is named | `bag: {settlement: proper}`, FILLED at this block's call sites. Carried on variants 1 and 3 (their shipped rows carry it) and on all four faces of each, so each face's `{slot}` set equals its parent's (ARCH §2.6 / §2.5's face refusal row) |

**Nothing else is claimed anywhere in the twelve.** The slot set is `{settlement}` on v1 and v3 and empty on
v2 — v2's shipped row carries no slot, and adding one would ADD a claim the shipped sentence did not make
(the marker tags "the town is named {settlement}" as claim 1.1, a claim). `{band}` and `{route}` are named
by no face; this block's call sites do not fill them here.

### 1. WHAT WAS DROPPED, AND WHY IT HAD TO GO (the rewrite's purpose)

Every unlicensed claim the marker convicted is gone from all twelve faces. Named, with the law:

| shipped clause | dropped under |
|---|---|
| "can feed itself through a failed harvest" · "The stores will carry the town through hunger" · "can outlast a hungry year" | the SUFFICIENCY claim — D-12 NOT ENTAILED (*how full · how many months*), and the one reading D-12's **ENGINE CONTRADICTS** column names in its own words; plus the card's `may NOT: a season` |
| "a failed harvest" · "hunger" · "a hungry year" | the card's `may NOT: a season`; bar W17 (*a famine never entails a harvest failure or a season*) |
| "nothing at all against disease" · "no answer at all to a sick one" · "Nothing here" | the totality on an unclosed column (R-DA-15(i): a quantifier is licensed only by `closed`; `hasHospital` / `hasChurch` are keyword scans), and the outcome/efficacy frame (D-13 does not entail *that it can contain the outbreak* even where a hospital stands) |
| "a sickness here spreads until it stops of its own accord" | a second fact (card `may NOT`) and a forecast in gnomic dress (R-DA-07 / R-DA-12); the implied totality over persons is a REFUSED COLUMN |
| "a plague" | bar W17 by name (*never "the plague"*) |
| "will carry" ×2 | the bare future indicative — R-DA-07's wall, A2's FATE breach |
| "the town has not built anything that would" | the block's own PROVENANCE fence (*institution presence is a STANDING fact with no recorded history*), R-DST-B, MOVE-GRAMMAR §1.2 row 2, and bar W23 (the town as builder) |
| "knows which of the two it fears" | the FEELING non-move (MOVE-GRAMMAR §1.3), the card's `may NOT: a standpoint`, bars W22 and W23, and a totality over persons |
| "The town ... at {settlement}" (v3) | not a bar breach; the coherence fault the marker named (one referent twice in one clause, the locative implying two things) is not carried forward |

Nothing replaced them with nothing: the weight is carried by **naming both absent rows by their own class
words** instead of totalising over the record, and by landing each face on a concrete civic noun (the
granary, the store, the grain, the parish, the sick-house) — R-DA-10's concrete civic noun, against the
`abstractNounRate` guard. No face reaches for *provision*, *capacity*, *preparedness*, *resilience* or
*infrastructure* (regression (c)).

### 2. FACE BY FACE — the claims each makes, and the card clause that licenses each

Word counts count `{settlement}` as one word. "C1…C5" are §0's rows; the licence for each is there.

**VARIANT 1 · `[ledger]` · slot set {settlement} · four faces, claim-equal (arm A6 reads across them)**

| face | words | opens | lands on | claims | licence |
|---|---|---|---|---|---|
| 1a (the numbered row) — *A granary stands at {settlement}, and neither an infirmary nor a parish stands in the town.* | 16 | A granary | the town | C1 (`a granary stands` — the storehouse row named, the body word licensed because the read reaches the row, W20), C2 (`an infirmary`), C3 (`a parish`), C4 (the joint), C5 | `reads`/`predicate` for C1–C4; `bag {settlement: proper}` for C5 |
| 1b — *Grain is held in store at {settlement}, and the town has neither a parish nor a sick-house.* | 17 | Grain is | a sick-house | C1 via D-12's entailment *grain is stored* (W9: a MAY), C3 then C2 (the reads reversed), C4, C5 | as 1a; the possession verb sits on the town, never on a person (W22) and never as a decision (W23) |
| 1c — *A store of grain is kept at {settlement}, and neither an infirmary nor a parish stands beside the granary.* | 19 | A store | the granary | C1 twice-named (the stock, then the building — A-10's split respected: no quantity, no fullness), C2, C3, C4, C5 | as 1a |
| 1d — *Carried as standing at {settlement} is a granary; an infirmary and a parish are not.* | 15 | Carried as | *are not* (the flat absence close) | C1, C2, C3, C4, C5 | as 1a. "Carried as standing" is the office's own formula (R-vi / bar W7) — a verb, **not** a record noun: W24 holds (`source: (none)`, SOURCE-UNRESOLVED), so no books, roll, register or citation appears, and arm A13 has nothing to fail |

**VARIANT 2 · `[unfolding]` · slot set EMPTY (as shipped) · four faces, claim-equal**

| face | words | opens | lands on | claims | licence |
|---|---|---|---|---|---|
| 2a (the numbered row) — *Grain stays in store here, and the town stays without an infirmary or a parish.* | 15 | Grain stays | a parish | C1 (D-12's entailment), C2, C3, C4 | `reads`/`predicate`. The continuation verb (*stays*) is the present that keeps standing — the lawful `[unfolding]`, never a forecast (R-DA-07, A2) |
| 2b — *The store goes on holding grain, and the town goes on with neither a parish nor an infirmary.* | 18 | The store | an infirmary | C1, C3 then C2 (reversed), C4 | as 2a |
| 2c — *Stored grain stays stored, and no sick-house or parish stands in the town.* | 13 | Stored grain | the town | C1, C2 (*sick-house*), C3, C4 | as 2a; the pool's short line (R-DA-06's `< 8 words` floor is a register figure this pool cannot reach while stating both halves of R-4 — see §6) |
| 2d — *Here the grain keeps its store, and an infirmary and a parish stay absent from the town.* | 17 | Here the | the town | C1, C2, C3, C4 | as 2a; *stay absent* is the absence in the continuative, which is the stance's own tense and not a second claim |

**VARIANT 3 · `[street]` · slot set {settlement} · four faces, claim-equal**

| face | words | opens | lands on | claims | licence |
|---|---|---|---|---|---|
| 3a (the numbered row) — *The granary at {settlement} is where the grain is; the sick-house and the parish are not here.* | 17 | The granary | *not here* (the absence close) | C1 (the building, then its entailed stock), C2, C3, C4, C5 | `reads`/`predicate`; `bag`. The street's vantage is the civic object as met — a place where the grain is, and two places that are not in the town. No person, speaker, reaction or piece of common knowledge appears (W22, W23, the FEELING non-move) |
| 3b — *Grain sits in the store at {settlement}, and no infirmary or parish is part of the town.* | 17 | Grain sits | the town | C1, C2, C3, C4, C5 | as 3a |
| 3c — *The grain has its store at {settlement}, and an infirmary and a parish are things the town is without.* | 19 | The grain | *without* | C1, C2, C3, C4, C5 | as 3a. W1: the possessive *its* binds to *the grain*, its intended possessor; no possessive anywhere in the twelve binds to a `{defwork}`-style object |
| 3d — *Grain has a store at {settlement}, and no infirmary or parish stands in this town.* | 15 | Grain has | this town | C1, C2, C3, C4, C5 | as 3a |

### 3. THE ANGLES, KEPT AS STANCES (W27: a tag is a stance, never a body)

- **`[ledger]` (v1)** — the office's entry: what stands, then what does not, in the clerk's flattest order,
  with the office's own formula in 1d. It grades nothing, cites nothing, and produces no record noun (W24).
- **`[unfolding]` (v2)** — the condition that holds and keeps holding. The shipped row's two future
  indicatives are replaced by continuation in the present (*stays · goes on · stays stored · stay absent*):
  no *will*, no *would come*, no *until*, no *by then*, no timeless generalisation about what happens when
  sickness arrives. It still reads as a different stance from v1 (the marker's regression (d) guarded).
- **`[street]` (v3)** — the ordinary day at the civic thing: the granary as the place the grain is, the two
  absent rows as places that are not in this town. It does not become the `[visitor]`: no stranger is
  introduced, nothing is *seen*, *found* or *noticed*.

One bracketed tag per numbered row, exactly as it stands in the corpus; no `[plain]` anywhere (that is the
modifier marker and the projector refuses it on a spine row); no second tag.

### 4. THE GRAMMARS — the census's `grammars: 1` defect, addressed

MOVE-GRAMMAR §2.1 requires min(k, 8) = **3** distinct level-1 grammars in a pool of three. The members
drawable for this block (every licensing field non-null, §3.1) are exactly three, which is why the pool can
reach the figure: **V1** (the state key alone), **V3** (state key + a `none-exists` field) and **V4** (a
named object + the state key). V2, V5, V6, V7 and V8 are filtered out — there is no structural-consequence
field, no resolved institution-table row, no unresolved-value field, no event provenance and no `not-held`
record field on this read. Authored, one per variant:

| vid | grammar | how it is realised |
|---|---|---|
| 1 | **V3 — PRESENT → LACK** | the granary entered as the standing condition; the care LACK as the second move, joined with *and*, never *but*, never fronted (R-DA-02) |
| 2 | **V1 — PRESENT** | the branch stated as ONE standing condition whose negative rides inside the same predicate (*stays without* · *goes on with neither* · *stay absent*), not as a separately asserted move |
| 3 | **V4 — OBJECT → PRESENT** | the named object first (the store, the granary, the grain's building), the town's standing second |

No `[grammar: Vn]` tag is written on any row: the brief fixes the row form at ONE bracketed angle tag, and
the tag contract routes `grammar:` to `marks` (ARCH §2.5). The assignment above is the authored intent for
whoever stamps the tags. **Declared risk:** a classifier reading moves off clause structure may read an
ABSENCE move in every one of the three (the branch is negative on two of its three constituents), and
report v2 as V3 rather than V1. That is a REPORT, not a FAIL (arm A gates only tagged orders when ceilings
are supplied), and it is named here rather than left for the gate to find.

### 5. THE WALLS AND THE BARS, CHECKED ACROSS ALL TWELVE

- **Walls.** No em dash · no exclamation · no digit or percent · no `which`-clause · no question · no
  second person · no figure, simile or sense verb on an abstraction · no inanimate intent · nothing takes
  the future. Two semicolons in twelve faces (1d, 3a), inside R-DA-06's rationed band; every other joint is
  a comma and *and*.
- **W2 (country-scoped threat)** — not engaged: this read carries no `monsterThreat` and no face states one.
- **W9** — the granary's entailment is used as a MAY, once per face at most.
- **W10** — one negated surface per face, and it sits on an ABSENCE read (F2 ∧ F3), never on the PRESENT
  read; the granary half is never negated. Order constraint 3 holds: the absence never opens a face, and the
  two absent rows are carried as ONE compound assertion (*neither an infirmary nor a parish*, *no infirmary
  or parish*, *an infirmary and a parish are…*), so no ABSENCE sits beside another ABSENCE — which is what
  convicted the shipped v2.
- **W11 (material)** — no wall or building material and no material source anywhere.
- **W12 · W13 · W16** — no garrison, no watch, no muster, no gate word: this read reaches none of them.
- **W14 (labels at their engine meaning)** — `hasGranary` is a TIER PROXY and is never read as English: no
  face says how full, how long, how many, communal, or *at this size*; and **no tier word appears at all**
  (not *city*, not *town-sized*, not *a great town*) because the read holds no tier. `hasChurch` is read as
  the branch reads it — a care-class row consulted in the granary branch alone — and never as *the faith of
  the town*.
- **W15 (aliases)** — the always-safe spellings are used and no others: *the stores* / *in store* / *what
  the town holds back* for the storehouse; *infirmary* · *sick-house* for the hospital-class row (both
  in-corpus: the sibling `NO reserves, NO medical provision` row ships *the sick-house*); *parish* for the
  church-class row. No *hospital network*, no *healer*, no *those tending the sick* as a subject.
- **W17 (crisis)** — no famine, no harvest, no season, no outbreak, no illness, no sickness, no plague.
- **W18 · W19** — no stress record and no creed is touched; *parish* is the row's class word with nothing
  predicated of any deity (the deity doctrine holds by silence).
- **W20 (layer)** — the read is BODY on all three constituents, so the `storehouse` and `care` class words
  are licensed exactly here: the read reaches the rows. No band, score, badge, ladder rung or label word is
  used, because there is none in this read to carry one.
- **W21 · W22 · W23** — no power, no seat, no faction; no person as agent, decider, knower or holder; no
  relation between two referents that no field computes. The subjects across the twelve are: a granary, a
  store, grain, the town, an infirmary, a parish, a sick-house.
- **W24 (record words)** — the card resolves NO holder, so not one record noun appears: no books, rolls,
  register, ledger, accounts, minutes. `[ledger]` is used as a STANDPOINT only; *carried as standing*
  (1d) is the office's formula and cites nobody. No face names a source, so arm A13 is not engaged.
- **W25 · W26** — no external body, no covert fact, no visibility question: `covert: no`, audience player,
  no mark.
- **THE THREAD (§1.4.1).** This pool is a **spine** (`role: spine`, `attach: []`, modifier mounts 0), so
  its face is first in the composed unit. Every face ends on a noun a following modifier can pick up — the
  town, the granary, the grain, a parish, a sick-house — or on a flat absence close whose civic nouns sit in
  the same clause (1d, 3a). No face ends on an abstraction, a summary or a closed evaluation. Each face also
  reads as an opener regardless of which modifier follows it, because it makes no forward reference.
- **THE ECHO KEY.** No face adds a second disaster fact: the echo table is keyed on the whole table-rung
  reading, so every pool selecting a row of `DISASTER_ROW_POOL` shares one key, and a face may not assume it
  is the page's only disaster sentence.
- **A1 / A11 (the siblings).** Nothing here restates or contradicts the block's other spines: the four other
  threat rows speak of walls, forces, courts and revenue, and the five sibling `Disasters & Famine` rows are
  alternative branches of the same reader, never co-mounted. The pool's own sibling distance: **no two of
  the twelve faces share their first two words** (A granary · Grain is · A store · Carried as · Grain stays ·
  The store · Stored grain · Here the · The granary · Grain sits · The grain · Grain has), and **the
  settlement token opens none of them** — order constraint 10 is satisfied with room to spare, and the seam
  contract's refusal of a sentence row opening on a `proper`-typed slot (T-F8) is honoured, which the
  shipped v1 was not.

### 6. RESIDUAL FINDINGS — named for the refinement round, not hidden

1. **Three faces land on *the town*** (2c, 3b, 3d) and two more on *the town* in another case (1a, 2d).
   The constructions differ (*stands in* · *is part of* · *stay absent from*), but a refiner should push at
   least one of them onto a sharper landing noun. This is the pool's weakest craft edge: the branch offers
   exactly two civic objects and one of them is absent, so the landing vocabulary is genuinely narrow.
2. **The closest pair across the twelve** is 1a's *neither an infirmary nor a parish stands in the town*
   and 2c's *no sick-house or parish stands in the town*. They differ in quantifier form, in one noun and in
   their stance, but they are the pair arm A5 (sibling distance) will rank first.
3. **R-DA-06's `< 8 words` floor is not reachable in this pool.** Every face must state both halves of R-4
   or it becomes a sibling pool's face (the marker's regression (b), the sharpest one available here), and
   the two halves will not fit in eight words with the town named. The pool's shortest face is 2c at 13.
   Recorded as a measurement, not a refusal.
4. **The `{settlement}` slot is not added to variant 2.** Its shipped row carries no slot and the marker
   tags the naming as a claim (1.1); adding it would ADD a claim. If the chair rules that a proper-slot fill
   is not a claim, v2 gains the slot on all four faces at once (the face/parent slot-set equality of
   ARCH §2.6), never on one.
5. **Two of the twelve carry a semicolon** (1d, 3a). Inside the band, but a refiner pushing toward the
   ceiling should check the count against the pool's neighbours on the defense tab rather than in isolation.
6. **Density floor, stated honestly.** The marker found no clause of the shipped rows lawful verbatim, so
   nothing is kept word for word; what is kept is the shipped register's own vocabulary — *the stores* /
   *in store* (v2's noun, W15's always-safe spelling) and the two-sided sentence itself, which is R-4 and
   not decoration. The shipped lines got their force from the sufficiency claim, and the sufficiency claim
   is the one D-12's ENGINE CONTRADICTS column refutes; the replacement force is the pair stated in concrete
   civic nouns with no quantifier, no season and no outcome. A refiner may not answer this pool by making
   any face plainer with no law behind the change (§21.4).

### 7. REFUSALS

**None.** All three variants are written lawfully under the card and the two law tables; no variant is
banked as a refusal row, no variant is deleted, merged or left without a rewritten text, and the face count
rises from 3 to 12. The counts owed by §22 ("never trim") — variants 3 → 3, faces 3 → 12, angles 3 → 3,
grammars 1 → 3, slots named `{settlement}` → `{settlement}` — are all met or exceeded.
