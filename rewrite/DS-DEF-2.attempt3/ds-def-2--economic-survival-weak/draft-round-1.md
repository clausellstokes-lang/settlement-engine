# DS-DEF-2 · `Economic Survival: WEAK` · REWRITE draft round 1

Writer seat: Opus 5 (Fable-unvalidated). Block DS-DEF-2, role **spine**, pool key `Economic Survival: WEAK`.
Rows below are the complete replacement for the pool's variant rows: three variants in place, same vids, same order, each with its own angle tag unchanged and three `[face]` sub-rows (four wordings per semantic variant). The pool's typed lines are untouched and are not repeated here.

---

1. `[ledger]` Money at {settlement} is short of what an emergency costs.
   - `[face]` {settlement} has less money than an emergency costs.
   - `[face]` Emergency spending at {settlement} would exceed what the town has.
   - `[face]` Against the cost of an emergency, what the town at {settlement} could spend on one is weak.
2. `[street]` Trouble at {settlement} costs more than the town can pay.
   - `[face]` Money is what {settlement} would run short of in an emergency.
   - `[face]` Paying for an emergency at {settlement} would come to more money than the town could put its hands on.
   - `[face]` The town's money at {settlement} falls short of an emergency's price.
3. `[unfolding]` What an emergency at {settlement} would cost stands well above the money the town could raise.
   - `[face]` Whatever {settlement} could raise against an emergency, the emergency would cost more.
   - `[face]` The money the town at {settlement} could find would give out while the emergency was still running.
   - `[face]` An emergency at {settlement} would be underfunded.

---

--- NOTES

## 0. The card this pool is written against (printed, `scripts/prose-licence-card.mjs DS-DEF-2 'Economic Survival: WEAK'`)

- **reads** `scoreBand(economicScore)` via `ECONOMIC_ROW_POOL` in `defenseStateProse.js`; **predicate** `=== WEAK`.
- **bag** `{band: RESERVED, route: proper, settlement: proper}`; **FILLED at this block's call sites: `{settlement}` alone**.
- **role** spine (takes no relation, no attach, no declared move).
- **source** none · standing SOURCE-UNRESOLVED — **no citation is licensed**; a face naming a record holder is refused by arm A13.
- **may claim** that the reader selects the row `WEAK`, as a STANDING fact of the record.
- **may NOT** a count · a cause · a season · a future · a standpoint · a second fact.
- **REFUSED COLUMNS** a totality over persons · an exemption from a duty · a named character and that character's fate · a theological claim.

**The single licensed proposition, in words:** the town's money stands below what an emergency costs it. Every one of the twelve wordings asserts that and nothing else. Slots: `{settlement}` exactly once per face, no `{band}`, no `{route}` (both unfilled at this block's call sites).

## 1. Per variant — the claims KEPT, and the claims DROPPED

**Variant 1, `[ledger]`.** Old row: *Chronic shortfall at {settlement} limits what the town can do in an emergency before the emergency starts; the pay is irregular, and irregular pay shows up as morale exactly when it matters.*
- KEPT (licensed by **may claim**, the band as a standing fact): the town's money falls short of what an emergency costs.
- DROPPED **chronic** — asserts the shortfall's duration and its non-sudden origin; a HISTORICAL clause off a standing configuration field (MOVE-GRAMMAR §1.1 R-DST-B; card **may NOT: a cause**).
- DROPPED **the pay is irregular** — a second fact, and a particular no field of this pool holds (card **may NOT: a second fact**; R-DA-10 hollow specificity).
- DROPPED **irregular pay shows up as morale exactly when it matters** — a cause chained to a consequence with no event-provenance field and no household row (CONSEQUENCE is double-licensed, MOVE-GRAMMAR §1.2 row 7); also a MEANING move, which does not exist (§1.3).
- DROPPED **before the emergency starts** — an event sequence off a field that holds no event.

**Variant 2, `[street]`.** Old row: *The people who would have to hold {settlement} through something are already owed, and they have not forgotten it.*
- KEPT: the same single band claim, in the street's plain idiom.
- DROPPED **the people who would have to hold {settlement}** — the garrison/militia, an institution presence read by sibling pools (`Invasion & War`) and not by this one; naming it here is an INSTITUTION move with no table row (R-DA-15) and an A11 restatement of a sibling.
- DROPPED **are already owed** — arrears: a second fact, and a count-shaped claim (card **may NOT: a count, a second fact**).
- DROPPED **they have not forgotten it** — an interior/belief frame over persons (R-DA-13's belief-frame floor; FEELING does not exist, §1.3; card **may NOT: a standpoint**; REFUSED COLUMN: a totality over persons).

**Variant 3, `[unfolding]`.** Old row: *The shortfall at {settlement} is chronic rather than sudden, and each season of it removes a little more of what the town could do about a crisis when one comes.*
- KEPT: the same single band claim, stated as the comparison it is.
- DROPPED **chronic rather than sudden** — a CONTRAST whose rejected alternative names no sibling pool key and no sibling band (the siblings are STRONG · ADEQUATE · CRITICAL); R-DA-02 and order wall 5.
- DROPPED **each season of it** — a season, named in the card's **may NOT** list, and a rate over time no field holds.
- DROPPED **removes a little more … when one comes** — a trend, which is FORECAST by another name (§1.3; A2; card **may NOT: a future**). The subjunctive edge survives; the trend does not.

## 2. Per face — the clause that licenses every claim it makes

Each face makes exactly one claim. `[card:may-claim]` is the licence in every row below; the second column names the law that keeps the wording inside it.

| face | claim | licensed by | kept lawful by |
|---|---|---|---|
| 1 `[ledger]` numbered | money below an emergency's cost | card **may claim** (the band, standing) | R-DA-11 (a comparison is a measurement in words); no cause, no tense but the present |
| 1a | the same | card **may claim** | the short line (R-DA-06's `< 8` floor); no second fact |
| 1b | the same | card **may claim** | A2 — the edge is subjunctive (`would exceed`), never a future indicative |
| 1c | the same | card **may claim**; the band word *weak* is the reader's own value, not an added rating (CL-7's rating-needs-a-field satisfied by `scoreBand`) | R-DA-02 — the fronted phrase is a measurement, not a contrast of alternatives |
| 2 `[street]` numbered | the same | card **may claim** | R-DA-18 (plain register, the air in the noun); no belief frame |
| 2a | the same | card **may claim** | the cleft is word order, spendable under B-CLAIM / MOVE-GRAMMAR §3.4 |
| 2b | the same | card **may claim** | §21.4 the density law — idiom that rewards the reader (`put its hands on`), no law traded for plainness |
| 2c | the same | card **may claim** | R-DA-04 — closes on a civic magnitude, not a pronoun |
| 3 `[unfolding]` numbered | the same | card **may claim** | A2 subjunctive; the two terms of one comparison, not two facts |
| 3a | the same | card **may claim** | the recurring word `emergency` is licensed (register card: the WORD may recur, the FACT must not) |
| 3b | the same | card **may claim** | A2 — the duration is subjunctive and names no tick, no date and no season |
| 3c | the same | card **may claim** | the short line; a bare standing condition, R-DA-07's present |

**Provenance:** zero citations across twelve faces. The card resolves no holder (`SOURCE-UNRESOLVED`), so S3's three reasons cannot be met and §24's ceiling of one citation per unit is not spent. Arm A13 has nothing to catch.

**Sibling distance (arms A1 and A11).** The three sibling bands of this row read: STRONG *can absorb a sustained crisis*; ADEQUATE *can fund a short crisis*; CRITICAL *cannot fund a response to anything*. Every face here is written as a COMPARATIVE shortfall (`short of`, `less than`, `would exceed`, `falls short`, `stands above`, `underfunded`) and never as an absolute incapacity, which is CRITICAL's register — the WEAK/CRITICAL seam is the one a refuter would test. No face names walls, garrison, militia, court, prison, granary or hospital, so no sibling ROW of DS-DEF-2 is restated or contradicted.

**The thread (owner, 2026-09-08 ~21:4x).** This pool is the SPINE: it opens the passage and hands nouns forward rather than picking one up. Every face carries three nouns a modifier can take: the town (`{settlement}` / `the town`), the money, the emergency. No face closes on a pronoun, so a modifier seated after any of the twelve has a bare noun to carry.

**Walls checked across all twelve faces:** no digit · no em dash · no exclamation · no question · no `which`-clause · no semicolon or colon · no expletive opener (`There is` / `It is`) · no future indicative · no first or second person · no named character · no deity claim · no totality over persons · no exemption · no figure, sense verb on an abstraction or inanimate intent.

**A11 dispersion:** all twelve faces open on distinct first-two-word pairs. Exactly ONE face in the pool opens on the settlement token (face 1a), so R-DA-17's per-pool opener rule holds with no adjacency risk.

## 3. Reported band positions (measurements, not claims of a pass)

- **Word counts per face:** 1: 10 · 8 · 10 · 17 | 2: 10 · 11 · 19 · 11 | 3: 16 · 12 · 17 · 7. Mean 12.3, range 7 to 19.
- **Within-pool word-count sd = 3.75 population / 3.92 sample, against R-DA-05's within-pool floor of ≥ 4.0** — a reported distance of 0.25 below the floor on the population grain and 0.08 on the sample grain (the grain the corpus figure was taken on is not stated in R-DA-05, so both are printed), inside §16.1's DEPTH allowance but named here rather than assumed. Its cause is structural and worth the chair's eye: the shipped variants bought their length with the unlicensed claims this rewrite drops, and a one-fact licence cannot carry a twenty-five-word sentence without a second fact. Round 2 or the refinement round can widen it only by lengthening the comparison's terms, not by adding a claim.
- **Short line present:** 1 of 12 faces under eight words (0.083 against R-DA-06's `≥ 0.030` floor).
- **Level-1 grammar spread: NOT-EXECUTABLE at |admissible set| = 1.** Filtering MOVE-GRAMMAR §2.1's V1–V8 by this pool's licensing fields leaves V1 (`PRESENT`, the state key alone) as the only drawable member: V2 needs a structural-consequence field, V3 a `none-exists` field, V4 a named object, V5 an institution row, V6 an unresolved state value, V7 event provenance, V8 a `not-held` field, and the card holds none of them. §3.2's "min(k, |set|) distinct grammars" therefore evaluates to one, and §3.1's rule against writing a member the block cannot license forbids manufacturing the others. The three variants differ in ANGLE, rhythm and the shape of the single PRESENT move, which is the whole spread this pool can lawfully show. Reported as a pool-level not-executable, never as a pass.
- **R-DA-04 close-kind variation is bounded** to *condition* and *object* closes for the same reason: *prohibition*, *absence* and *a name not given* each require a field the card does not hold.
- **Perfection ceiling (§16.1):** this set is NOT at zero exceedances — the sd row above is its declared one.

## 4. Refusals

**None.** All three variants are written lawfully in place under their own numbers and their own angle tags; no variant is banked as a refusal row. The two rows above (the within-pool sd distance, and the single-member grammar set) are REPORTED measurements, not refusals, and neither prevents the pool from shipping.
