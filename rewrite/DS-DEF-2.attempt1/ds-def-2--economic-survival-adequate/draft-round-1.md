Seat: Opus 5 — Fable-unvalidated. Block `DS-DEF-2`, pool key `Economic Survival: ADEQUATE`, REWRITE draft round 1.
Three existing variants rewritten in place, one for one: same vids, same order, same bracketed tags, none added, none removed, none merged (§22).
Each variant is one `[plain]` wording plus three `[face]` sub-rows — four wordings per semantic variant, each a different vocabulary and rhythm inside the voice, none a paraphrase of its sibling; an unweighted seeded roll picks one at render, so every wording stands alone.
This pool is a SPINE (the card: `role spine`, `attach` empty, `relation` none). Every wording is written to open a composed passage and to end on a civic noun a modifier can carry forward.

---

## THE ROWS (paste under the pool's existing bold line, replacing rows 1–3)

**`Economic Survival`: `ADEQUATE`**
1. `[ledger]` `[plain]` {settlement} can meet a short emergency out of its own money. A longer one would take more than the town holds.
   - `[face]` What {settlement} can put against an emergency is enough for one that ends quickly and is measured to that and nothing past it; a longer emergency would cost more than the whole sum.
   - `[face]` A short emergency is inside what {settlement} can cover. A drawn-out one would come to more than the town can pay.
   - `[face]` The purse at {settlement} answers trouble that ends quickly. Trouble that lasts is more than the purse.
2. `[unfolding]` `[plain]` The town's capacity to pay for its own emergencies is real and it is finite. A demand that carries on reaches where the capacity ends.
   - `[face]` The money the town can put to its own emergencies is money it actually has, and it goes only so far. A demand that does not stop goes past the money.
   - `[face]` Emergencies here are paid for out of a fund that exists, and the fund has an end. Past that end nothing is paid for.
   - `[face]` What the town has to spend on an emergency is a sum already in hand. How far that sum goes is fixed, and a demand of any length past it is unpaid.
3. `[threshold]` `[plain]` A crisis of the ordinary length is inside what {settlement} can fund. Where the funding would fail is past that length, and how far past is not written.
   - `[face]` Funding at {settlement} carries a crisis of the ordinary run and stops at some point past it. Where that point falls is nowhere in the record.
   - `[face]` The ordinary crisis is paid for at {settlement}. The point where paying stops is past it and is not recorded.
   - `[face]` What {settlement} can hold out for is a crisis of the usual sort, and a limit lies somewhere beyond that. No figure is set against the limit.

---

## --- NOTES

### N.0 The card, as printed, and what it licenses

`node scripts/prose-licence-card.mjs DS-DEF-2 'Economic Survival: ADEQUATE'` prints, in the lines this packet is written against:

- **reads / predicate:** `scoreBand(economicScore)` (via `ECONOMIC_ROW_POOL` in `defenseStateProse.js`) `=== ADEQUATE`
- **bag:** `{band: RESERVED, route: proper, settlement: proper}`; **FILLED at this block's call sites: `{settlement}`**
- **role / seat:** spine; takes no relation, no attach, no declared move; angle `ledger threshold unfolding`
- **source:** `(none)` · standing **SOURCE-UNRESOLVED** — no citation is licensed; a face naming a record holder is refused by arm A13
- **may claim:** that the band holds, as a **STANDING fact of the record**
- **may NOT:** a count, a cause, a season, a future, a standpoint, a second fact
- **REFUSED COLUMNS, always:** a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim

**The reading this packet takes of `may claim`, stated so the chair can refuse it.** `scoreBand` is a *banding* function over one score, and `ADEQUATE` is its middle value: the band word asserts, in one claim, that the town sits **above `WEAK` and below `STRONG`**. The floor (a short crisis is fundable out of the town's own money) and the ceiling (a longer one is not) are therefore the **two bounds of one licensed claim**, not two facts. Every wording above states both bounds and nothing else. If the chair reads the may-claim line as licensing the floor alone, every wording in this pool — and the three sentences standing in the product today — carries an unlicensed ceiling, and the set is banked whole (refusal 1 is written for that reading).

**The card lines that are executable were obeyed exactly.**

- **Slots.** Every wording of variant 1 and variant 3 carries `{settlement}` and no other slot; **every wording of variant 2 carries no slot at all**, because the product's variant 2 carries none — the face `{slot}` set equals its parent's in all three families (ARCH §2.5's face row). No wording names `{band}` or `{route}`: the card marks `band` RESERVED and `route` unfilled at this block's call sites, so neither may be spoken.
- **Source.** No wording names a keeper, a book, a roll, a count-taker or an office. The provenance move (MOVE-GRAMMAR §4.4.3; §24's one-citation ceiling) is spent nowhere in this pool, so arm A13 has nothing to refuse.
- **Seat and form.** A spine seats first; no wording opens on a comma, a connective, a clause-list word or a lower-case fragment, and each is a complete sentence-form row.
- **Face openers.** **No `[face]` opens on `{settlement}`** — ARCH §2.5's face row refuses "a sentence face opening on a `proper`-typed slot of the block's bag" (T-F8). One row in the pool opens on the slot, the `[plain]` line of variant 1, which is the variant row and not a face; that is one settlement-opener variant in the pool, which is what R-DA-17 / wall 10 permits.
- **Refused columns.** No totality over persons (see refusal 2), no exemption, no named character, no theological claim.

### N.1 Per-face licence, claim by claim

**`[card: band]`** below means the card's `may claim` line — `scoreBand(economicScore) === ADEQUATE` as a standing fact of the record — read with its two bounds as set out in N.0. It is the ONLY licence cited in this packet; nothing here rests on the annex, on a sibling rung, on an institution, on a walls predicate, on `config.monsterThreat` or on `compound.inst`.

**Variant 1 `[ledger]` — four wordings, claim-equal (arm A6).** Claim set: **(a)** an emergency that ends quickly is met out of the town's own money; **(b)** a longer one would cost more than the town holds.

- **(a) `[card: band]`** — the band's floor (above `WEAK`, which is where the sibling band puts a town that cannot pay in the ordinary case). Carried by *can meet a short emergency out of its own money* / *is enough for one that ends quickly* / *is inside what {settlement} can cover* / *answers trouble that ends quickly*.
- **(b) `[card: band]`** — the band's ceiling (below `STRONG`, which is where the sibling band puts a town that absorbs a sustained crisis). Carried by *would take more than the town holds* / *is measured to that and nothing past it; a longer emergency would cost more than the whole sum* / *would come to more than the town can pay* / *Trouble that lasts is more than the purse*.
- **Modality.** Three wordings state (b) as a subjunctive edge (*would take*, *would cost*, *would come to*), as A2 and MOVE-GRAMMAR wall 2 require of an edge; the fourth states it as a comparison in words (*is more than the purse*), which is R-DA-11's licensed form of a comparison and asserts no future. No wording carries a bare future indicative.
- **Claims dropped, declared:** see refusal 2 (the count, and the totality over persons).

**Variant 2 `[unfolding]` — four wordings, claim-equal, all four slotless.** Claim set: **(a)** the town's own capacity to pay for its emergencies is real and in hand; **(b)** it is finite; **(c)** a demand that continues past it is not paid for.

- **(a) `[card: band]`** — the band's floor again, here stated as the reality of the capacity rather than as what it covers. Carried by *is real* / *is money it actually has* / *out of a fund that exists* / *is a sum already in hand*.
- **(b) `[card: band]`** — the band's ceiling, as the boundedness of the same fund. Carried by *it is finite* / *it goes only so far* / *the fund has an end* / *How far that sum goes is fixed*.
- **(c) `[card: band]`** — the ceiling's other face: what falls outside the band. Carried by *reaches where the capacity ends* / *goes past the money* / *Past that end nothing is paid for* / *a demand of any length past it is unpaid*. Each is a general conditional on a duration, never a dated or seasonal one and never a forecast.
- **Claim dropped, declared:** see refusal 3 (the seasonal trend — the whole motion of the `[unfolding]` angle).

**Variant 3 `[threshold]` — four wordings, claim-equal.** Claim set: **(a)** a crisis of the ordinary length is inside what the town can fund; **(b)** past that length there is a point where the funding stops; **(c)** where that point falls is not in the record.

- **(a) `[card: band]`** — the band's floor. Carried by *is inside what {settlement} can fund* / *carries a crisis of the ordinary run* / *The ordinary crisis is paid for* / *What {settlement} can hold out for is a crisis of the usual sort*.
- **(b) `[card: band]`** — the band's ceiling, stated as a threshold, which is this variant's tag and is conditional throughout (MOVE-GRAMMAR wall 2): *Where the funding would fail is past that length* / *stops at some point past it* / *The point where paying stops is past it* / *a limit lies somewhere beyond that*. No wording asserts that a crisis of that length arrives.
- **(c) `[card: band]`, CONTESTED — the licence named so it can be refused.** The claim is that the record fixes the band and not the point inside it. Its ground is the **shape of the card's own `reads`**: `scoreBand` returns a band, so where inside the band this town sits is a thing the read does not produce. This is an ABSENCE of class (c) LIMIT — a fact of the record, never of the world (R-DA-08; MOVE-GRAMMAR §1.2 row 11) — and it neither opens any wording nor sits adjacent to another absence. Carried by *how far past is not written* / *Where that point falls is nowhere in the record* / *is not recorded* / *No figure is set against the limit*. **If the chair reads a LIMIT as needing a typed computed flag (`truncated`, `inferred`) rather than the banding shape of the read, claim (c) is unlicensed in all four wordings and variant 3's set is banked (refusal 4).**
- **Claims dropped, declared:** see refusal 4 (the count, and the untested-edge history claim this replaces).

### N.2 THE THREAD (owner, 2026-09-08 ~21:4x), and how a spine is written for a place it does not choose

Every wording hands a noun (or the noun's pro-form for the same civic thing) forward from its first sentence to its second: *money → the town holds* · *an emergency → a longer emergency; what can be put against it → the whole sum* · *a short emergency → a drawn-out one; cover → pay* · *the purse → trouble that lasts → the purse* · *capacity → the capacity* · *money → the money* · *the fund → an end → that end* · *a sum → that sum* · *fund → the funding; the ordinary length → that length* · *some point → that point* · *paid for → paying stops* · *a limit → the limit*. No wording changes subject in the middle and hands nothing back.

Because this pool is the spine, no wording is written to follow anything: each states its civic fact from a standing start, and none opens on a pronoun, a connective or a bare demonstrative. Each **ends on a thing a modifier can pick up** — the money, the sum, what the town can pay, the purse, the capacity, the fund's end, the unpaid demand, the record, the limit — so whichever sibling modifier the composer seats next has a noun of the spine's to carry forward, and the spine reads the same whether one modifier follows it or three.

### N.3 Walls checked across all twelve wordings

Em dash 0 · exclamation 0 · question mark 0 · digit 0 · numeral word standing as a count 0 · `, which` 0 and relative `which` 0 · first or second person 0 · expletive opener (`There is` / `It is`) 0 · future indicative (`will` / `shall`) 0 · citation of a holder 0 · named character 0 · totality over persons 0 · exemption 0 · theological claim 0 · figure, simile or inanimate intent 0 · sentences per wording ≤ 2 (A1) · semicolon 1 of 12 (variant 1's first face; R-DA-06's rationed joint) · colon 0 · slot set identical within every variant, and variant 2 slotless throughout · `{settlement}` opens 1 of 12 wordings and 1 of 3 variants, and no face at all.

Two readings are **reported, not claimed clean**, so a refuter does not have to find them: *the purse* (variant 1's fourth wording) is read as the ordinary civic term for a town's money and not as a metonymic figure under R-DA-11 — the corpus already uses it in the sibling `Internal Security` rung; and *a demand that does not stop goes past the money* (variant 2's second wording) puts an extent verb on an abstraction, which is motion and not intent, and is measured against R-DA-11's inanimate-intent limb rather than assumed past it.

Close kinds vary across the twelve, as R-DA-04 requires and as a pool of one close kind would breach: a condition (*more than the town holds*, *more than the town can pay*, *is unpaid*), an object (*the whole sum*, *the purse*, *the money*, *the capacity*), an absence (*nothing is paid for*, *not written*, *nowhere in the record*, *is not recorded*, *No figure is set against the limit*). No wording closes on a pronoun (R-DA-04's pronoun-closer ceiling), and no wording closes on a gnomic or life-general sentence (R-DA-12).

Siblings, checked for restatement and contradiction (arms A1 and A11): `STRONG` owns *absorb a sustained crisis out of its own revenue* and the garrison's pay; `WEAK` owns *chronic shortfall* and *irregular pay*; `CRITICAL` owns *cannot fund a response to anything* and *exhausts the town's capacity*. **No wording above uses revenue, shortfall, garrison, morale, or exhausts**, and none touches the four other rungs' property (walls, force, courts, granary, sick-house) or their fields.

### N.4 THE LIST OF REFUSALS

1. **All three variants — REPORTED against the card's `may NOT: a second fact`.** Every wording carries two facts, and so does every sentence standing in the product today; claim-equality (arm A6) forbids reducing them, and §22 forbids trimming the variant. Read here as N.0 reads it — a band word's floor and ceiling are one claim's two bounds, and a two-sentence spine is licensed by A1 and by R-DA-03's own-sentence qualification — with the alternative reading named: if `a second fact` bars the ceiling, the pool is refused whole and banked with its twelve wordings. **The chair's to settle; not a writer's call.**
2. **Variant 1 — two claims DROPPED, declared.** (i) *within a few months* is a **count**, which the card refuses; the claim it carried (that a long crisis outruns the money) is kept and the figure is not. (ii) *the reserves are not deep enough to hide that from anybody* asserts a **totality over persons**, which is a REFUSED COLUMN and absolute — it cannot be cured by wording, and no wording above carries it. Both are claim changes, which is the refuters' column: named here rather than made quietly.
3. **Variant 2 — one claim DROPPED, declared; the `[unfolding]` angle keeps its tag and loses its motion.** *every season of pressure moves the finite part closer* is refused three times over: the card's `may NOT: a season`; the card's `may NOT: a cause`; and a trend asserted over time is a HISTORY-shaped claim, which MOVE-GRAMMAR §1.2 row 2 and R-DA-19 license only from an event-provenance field this card does not hold. The residue kept in all four wordings is the band's own ceiling stated as a bound on duration. **This is a sitting row under §21: the tag `[unfolding]` is not mine to touch, and the only motion the card licenses is the conditional one written above.**
4. **Variant 3 — one claim DROPPED and one REPLACED, both declared.** (i) *a few months past the beginning of one* is a **count**, dropped as in refusal 2. (ii) *the town has not been asked to find out where* asserts that no crisis of that length has occurred — a negative **HISTORY** claim with no event-provenance field, refused by MOVE-GRAMMAR §1.2 row 2 and R-DA-19. It is replaced by claim (c) of N.1, that the record fixes the band and not the point, whose licence is the banding shape of the card's own `reads`. **That licence is CONTESTED and is the chair's to allow or refuse; if it is refused, variant 3's four wordings are banked with their measurement, never trimmed.**
5. **Modality corrected, declared, and not a claim change.** The product's indicative-habitual edges (*begins eating reserves*, *moves the finite part closer*) are written above as the licensed conditional or subjunctive (A2; MOVE-GRAMMAR wall 2; R-DA-07). No future is added anywhere and none is removed from a place a field licensed it.
6. **No refusal on the slot, source, relation, attach, seat, echo, covert or audience lines.** All were executable and all are obeyed as N.0 sets out.

### N.5 The measurements, printed (executed on this file; `{settlement}` counted as one word)

| variant | tag | wording | words | sentences |
|---|---|---|---|---|
| 1 | `[ledger]` | `[plain]` | 21 | 2 |
| 1 | `[ledger]` | `[face]` a | 33 | 1 (semicolon joint) |
| 1 | `[ledger]` | `[face]` b | 21 | 2 |
| 1 | `[ledger]` | `[face]` c | 17 | 2 |
| 2 | `[unfolding]` | `[plain]` | 25 | 2 |
| 2 | `[unfolding]` | `[face]` a | 31 | 2 |
| 2 | `[unfolding]` | `[face]` b | 24 | 2 |
| 2 | `[unfolding]` | `[face]` c | 32 | 2 |
| 3 | `[threshold]` | `[plain]` | 28 | 2 |
| 3 | `[threshold]` | `[face]` a | 26 | 2 |
| 3 | `[threshold]` | `[face]` b | 20 | 2 |
| 3 | `[threshold]` | `[face]` c | 27 | 2 |

Twelve wordings, 17 to 33 words. The short line exists (17, and a seven-word opening sentence in variant 2's fourth wording) and the long ones carry a longer load; the spread is the load's and not a metronome's.
