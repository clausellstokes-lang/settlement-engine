1. `[ledger]` `[plain]` Grain is laid by at {settlement} against hunger, and the clergy tend the sick. What the clergy can do against disease is better than nothing and well short of a hospital.
   - `[face]` The stores at {settlement} are held against want, and the sick are left to the parish. Parish care falls well short of a hospital and is still more than nothing at all.
   - `[face]` What is kept back at {settlement} stands against hunger, and the church nurses the ill. A hospital would do more, and nothing at all would do less.
   - `[face]` Hunger at {settlement} would be met out of the store, and sickness by the church. The church is more than nothing against a disease and less than a hospital.
2. `[street]` `[plain]` A bad year is something the town can eat its way through. A plague it meets with prayer, and after the prayer with nursing.
   - `[face]` Want the town can sit through on what is stored. Sickness it answers with prayer, and with nursing behind the prayer.
   - `[face]` Food enough to carry the town through a year that fails is in hand, and a plague is met by the parish at prayer and the parish at the bedside, in that order.
   - `[face]` Stored food carries the town through a year gone wrong. The town's answer to a plague is prayer, and nursing when the praying is done.
3. `[visitor]` `[plain]` A traveller stopping at {settlement} finds the store full and the infirmary small, and can tell from the pair which of the two the town has thought about.
   - `[face]` Full stores at {settlement} and a small room for the sick: which of the two the town has thought about is plain to a stranger.
   - `[face]` A granary in good supply, a sick-room barely furnished: what {settlement} shows a stranger is where the town's attention has gone.
   - `[face]` A stranger walks past a full store at {settlement} and into a small room where the sick are nursed, and does not have to ask which of them the town has favoured.

--- NOTES

**Packet.** Block DS-DEF-2 · pool key `Disasters & Famine: granary AND parish care only` · draft round 1 · Opus WRITER seat (Fable-unvalidated). Three existing variants rewritten in place under their own numbers and their own bracketed tags; none added, removed, merged or reordered; four wordings per variant (the `[plain]` parent plus three `[face]` sub-rows), twelve wordings in the pool.

**The card, as printed.** `role: spine` · `reads: disasterRowSituation(granary, hospital, church)` (via `DISASTER_ROW_POOL` in `defenseStateProse.js`) · `predicate: === granary, parish care` · `bag: {band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites `{settlement}` · `relation: (a spine takes no relation)` · `seat/form: (not a seat-taker) / sentence` · `move: (none declared)` · `angle: ledger street visitor` · `attach: (empty: a spine takes no attach set)` · `echo: spine mounts 1 (tabs: defense)` · `covert: no` · `source: (none) · standing SOURCE-UNRESOLVED — NO citation is licensed; a face naming a record holder is refused by arm A13` · `may claim: that the predicate (=== granary, parish care) holds, as a STANDING fact of the record` · `may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class temple` · `audience: player (no mark)` · `REFUSED COLUMNS: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim about a deity`.

**The claim set carried, one id per claim (the BEFORE's, unchanged).**
- K1 — grain is stored at the settlement.
- K2 — the clergy of the parish tend the sick there.
- K3 — the store stands as a reserve against hunger.
- K4 — what stands against disease is better than nothing and well short of a hospital (a comparison in words, both halves).
- K5 — the town can eat through a bad year.
- K6 — what the town does about a plague is pray and nurse.
- K7 — prayer comes before the nursing.
- K8 — the store is full.
- K9 — the provision for the sick is a small room.
- K10 — a stranger can see which of the two the town has given its thought to.

**Variant 1 `[ledger]` — the four wordings and the clause licensing each claim.**

| wording | claims made | licence |
|---|---|---|
| `[plain]` | K1, K2 | card `may claim:` (the predicate as a STANDING fact of the record) on `reads: disasterRowSituation(granary, hospital, church)` — `granary` licenses K1, `parish care` licenses K2 |
| `[plain]` | K3 | NOT licensed by any card clause: the predicate holds that a granary stands, never what it is held against — convicted by `may NOT: a second fact` (see REFUSALS R1) |
| `[plain]` | K4 | the LACK half (`well short of a hospital`) is licensed by the read's own `hospital` term being false in the predicate, written as R-DA-02's flat lack and as R-DA-11's comparison in words; the `better than nothing` half names the sibling key `Disasters & Famine: granary, NO medical provision` and is licensed at the register grain by R-DA-02 (the rejected alternative names a sibling pool key), by NO card clause (see R1) |
| `[plain]` slot | `{settlement}` | card `bag: {settlement: proper}`, FILLED at this block's call sites |
| `[plain]` angle | ledger | card `angle: ledger street visitor` |
| `[face] 1` | K1, K2, K3, K4 | as the plain, clause for clause; the second sentence carries `the parish` forward as `Parish care` |
| `[face] 2` | K1, K2, K3, K4 | as the plain; K4 written as a two-sided subjunctive measurement (`would do more` / `would do less`), so no future indicative and no evaluative verdict |
| `[face] 3` | K1, K2, K3, K4 | as the plain; the hunger clause is subjunctive (`would be met`), the disease clause present, so the edge and the standing fact are told apart (A2, R-DA-07) |

**Variant 2 `[street]` — the four wordings and the clause licensing each claim.**

| wording | claims made | licence |
|---|---|---|
| `[plain]` | K5 | NOT licensed — the predicate holds that a granary stands, not that the town can eat through a bad year; convicted by `may NOT: a second fact`, and the bounded bad year sits against `may NOT: a season` (see R2) |
| `[plain]` | K6 | the parish half of the predicate licenses that the church's people nurse the sick; PRAYER is licensed as a TRADITION move (a practice the culture holds), and no wording says a god is addressed, answers, or exists — the DEITY DOCTRINE is held, faith as culture and never theology |
| `[plain]` | K7 | NOT licensed — a precedence between two acts that no field holds; convicted by `may NOT: a second fact` (see R2) |
| `[plain]` slot | none | the parent variant carries no slot; every face of it carries none (ARCH §2.5: a face whose `{slot}` set differs from the parent's is refused) |
| `[plain]` angle | street | card `angle: ledger street visitor` |
| `[face] 1` | K5, K6, K7 | as the plain; K7 carried by placement (`with nursing behind the prayer`) rather than by the parent's ordinal phrase |
| `[face] 2` | K5, K6, K7 | as the plain; K7 carried by the parent's own ordinal phrase, kept once in the pool so the wording is not lost from the annex |
| `[face] 3` | K5, K6, K7 | as the plain; K7 carried as a completed-act clause (`when the praying is done`), which is a sequence and not a duration |

**Variant 3 `[visitor]` — the four wordings and the clause licensing each claim.**

| wording | claims made | licence |
|---|---|---|
| `[plain]` | K8 | NOT licensed — a fill state of the store; the card refuses a count and the read holds no quantity (see R3 (b)) |
| `[plain]` | K9 | NOT licensed — a civic object of the medical class asserted while the read's `hospital` term is false in the predicate (see R3 (c)) |
| `[plain]` | K10 | NOT licensed — convicted twice: `may NOT: a standpoint` (what a stranger can tell) and the FEELING non-move of MOVE-GRAMMAR §1.3 (what the town has thought about is a collective mental state) (see R3 (a)) |
| `[plain]` slot | `{settlement}` | card `bag:` as above |
| `[plain]` angle | visitor | card `angle: ledger street visitor` |
| `[face] 1` | K8, K9, K10 | as the plain; the colon is the chosen joint (R-DA-06), used twice in this pool and nowhere else |
| `[face] 2` | K8, K9, K10 | as the plain; the two civic objects are named in the compressed nominal head and the claim rides one clause, which is the density law's compression and not a new claim |
| `[face] 3` | K8, K9, K10 | as the plain; the stranger's movement is the `visitor` angle's manner, never a second claim |

**REFUSALS — three, one per variant; every wording is written and none is trimmed (§22).**

1. **Variant 1 `[ledger]` cannot meet the card's `may NOT: a second fact`.** The card licenses exactly one claim: that the predicate holds. K3 and K4 are two further standing facts, and K4's second half compares this town's provision to a sibling key's. Neither can be dropped: arm A6 requires the four faces to be claim-equal to the variant as it stood, and §22 (a)/(e) forbids removing what the sentence stood for. Every other law tested below holds in all four wordings. The disposition is the chair's: carry K3 and K4 as inherited on the spine, or migrate them to modifier pools by a chair act, which a writer may not perform.

2. **Variant 2 `[street]` cannot meet `may NOT: a second fact`, and touches `a season`.** K5 asserts a capability over a bounded bad year; the read holds that a granary stands and nothing about what it can carry the town through, and a bounded bad year is the nearest thing in this pool to the season the card refuses. K7 asserts a precedence between prayer and nursing that no field holds. Both are the parent's own claims and are kept in all four wordings. **Held, not refused:** the prayer itself, which is licensed as a practice of the parish under the DEITY DOCTRINE (faith as culture); no wording claims a deity acts, answers or exists, and no wording assigns a feeling to the townspeople.

3. **Variant 3 `[visitor]` cannot be made lawful by rewording at all, and is the sharpest refusal in the pool.** Its only claims are K8, K9 and K10, and each is convicted:
   - **(a)** K10 is refused twice over: the card's `may NOT: a standpoint`, and MOVE-GRAMMAR §1.3's FEELING non-move, since what a town has *thought about* is a collective mental state no field carries. R-DA-13's belief-frame floor is zero.
   - **(b)** K8's `full` and K9's `small` / `barely furnished` are fill and size claims. The read carries a presence, never a quantity or a scale, so both sit against `may NOT: a count` at its nearest edge.
   - **(c)** K9 asserts a room or house for the sick as a civic object while the predicate holds the `hospital` term FALSE. This is a same-entry contradiction candidate of the C3-lexical class (CLERK-LAWS §2.2), and it is the one finding in this packet a walker can be expected to fire on: the sibling key `Disasters & Famine: granary, NO medical provision` says a town with the granary and no medical provision has *nothing at all* against disease, so an infirmary here reads as an institution the block's own branch structure does not hold. The parish's nursing is licensed; a furnished room for it is not.
   All four wordings are written to the ceiling within that failure and no new failing state is added (§21.2). A ruling is owed: either the `parish care` branch is typed to say what fabric the care uses, or the variant is banked as an unlawful set with its faces (§21.2's banked count), or the claim is re-seated by an owner-gated claim change.

**The card/register conflict, restated because it governs all three refusals.** No variant of this pool carries only one claim, and the card licenses only one. The register card (A1, amendment S2) permits two sentences and a second fact in its own sentence; the licence card's `may NOT: a second fact` forbids it outright. On the card's plain words no wording in this pool is lawful; on the register's, all twelve are. The same conflict is on record from the `Invasion & War: walls AND professional garrison` packet. The chair's ruling is owed and this packet decides nothing.

**Laws tested and held across all twelve wordings.**
- No em dash, no exclamation mark, no digit, no percent, no question mark, no `, which` tail anywhere. The three occurrences of `which` are interrogative pronouns inside a subject or object clause (`which of the two…`), the parent's own construction, and never a relative tail.
- No first or second person; no persona; no address to the reader.
- No future indicative. The four modal edges (`would be met`, `would do more`, `would do less`, and the parent's implied hypothetical year) are subjunctive; STATE never FATE holds.
- No citation of any kind. `source: (none) · SOURCE-UNRESOLVED` licenses none, so no wording names a keeper, a roll, a register or an authority; arm A13 has nothing to fire on. The parish is named as the SUBJECT of the fact, never as the holder of a record about it.
- No figure, no simile, no sense verb on an abstraction, no inanimate thing acting with intent. `the town's attention has gone` in variant 3 face 2 is a possessive of a mental state (part of refusal R3 (a)), not an inanimate actor.
- No totality over persons, no exemption from a duty, no named character, no theological claim (the card's REFUSED COLUMNS, all four clear).
- One term for one thing WITHIN each wording (R-DA-22): a wording that says `store` never also says `granary`; a wording that says `the church` never also says `the parish` or `the clergy`. The term varies ACROSS the four faces, which is the owner's four-vocabularies rule and not a registry breach. The four vocabularies of variant 1 are grain/clergy · stores/parish · what is kept back/church · store/church; of variant 2, bad year/prayer · want/sickness · food enough/parish · stored food/praying; of variant 3, store/infirmary · stores/room for the sick · granary/sick-room · store/room where the sick are nursed.
- One religious object per wording, never two (the card's `may NOT: another civic object of the class temple`). Variant 2 face 2 names `the parish` twice, which is one object under two of its functions and is R-DA-22's single term held.
- Slot discipline: every wording of variants 1 and 3 carries `{settlement}` exactly once, every wording of variant 2 carries none, matching each parent's set.
- T-F8: no wording opens on the proper-typed slot, and the `[plain]` parents are held to the same rule as the faces, because the draw is unweighted over all four and each must stand alone.
- A1 and R-DA-03: every wording is one or two sentences; no third sentence, no qualification carried as a tail.
- THE THREAD (§1.4.1): in every two-sentence wording the second sentence carries a noun forward — `the clergy` · `the parish`/`Parish care` · `the church` · `the town`/`it` · `prayer`/`the praying`. Variant 1 face 2's second sentence turns outward to the hospital and to nothing at all, and is placed last, which is the one lawful turn. As this pool is the SPINE, every wording closes on a civic noun or a present condition of one that a modifier can pick up: `a hospital` · `nothing at all` · `less` · `a hospital` · `nursing` · `the prayer` · `order` · `done` · `thought about` · `a stranger` · `gone` · `favoured`.
- A11 spread: no two of the twelve wordings share their first two words — `Grain is` · `The stores` · `What is` · `Hunger at` · `A bad` · `Want the` · `Food enough` · `Stored food` · `A traveller` · `Full stores` · `A granary` · `A stranger`.
- R-DA-04 close kinds are varied inside each variant (an object, an absence, a condition, an object; a practice, an object, a condition, a condition; a condition, a person, a condition, an act). Two of variant 1's four close on `a hospital`, which is the price of keeping K4's comparison in every claim-equal face; declared, not hidden.
- R-DA-05 rhythm: word counts with the slot as one word run 31 / 32 / 27 / 29 for variant 1, 24 / 21 / 33 / 25 for variant 2, 28 / 25 / 21 / 32 for variant 3; the shortest sentence in the pool is ten words (variant 2 face 1's first) and the longest wording is thirty-three.
- R-DA-06: the semicolon is spent nowhere; the colon is spent twice, both in variant 3, both as the nominal head of a compressed unit.
- Sibling distance (arms A1, A11): no wording restates or contradicts `granary AND hospital`, `granary, NO medical provision`, `NO reserves, hospital present` or `NO reserves, NO medical provision`. The siblings' own phrases (`a failed harvest`, `a place for grain`, `the sick-house`, `outlast a hungry year`, `somewhere to put the sick`) are avoided in all twelve wordings; where a comparison to a sibling's state is inherited (K4), it names the state and never the sibling's words.

**Declared consequences of the rewrite (not refusals).**
- **The existential opener is gone.** The BEFORE's variant 1 opened `There is food stored at {settlement}`, which R-DA-07 caps at 0.020 per variant and which this pool ran at 0.333. No wording in this packet opens on `There is` or `It is`, and none contains an expletive subject. The pool's contribution to `thereIsOpenerRate` falls from one to zero.
- **The colon-as-payoff joint is gone from variant 1.** The BEFORE joined its two facts with a colon that made the second half a gloss of the first; all four wordings now carry the second fact in its own sentence or its own coordinate clause (R-DA-03, amendment S2).
- **Zero settlement-openers, unchanged.** The BEFORE opened no variant on the slot and neither does this packet, so wall 10 (R-DA-17: at most one settlement-opener per pool) is satisfied at zero.
- **`in that order` survives once.** The parent's ordinal phrase is kept in exactly one face so the annex does not lose the wording, and the other three faces carry K7 by placement instead; this is a spread choice, not a trim.
