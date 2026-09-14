# CRITIQUE — LENS: THE PROMISE AND DETERMINISM
**Seat: Opus 5 — critic (Fable-unvalidated), adversary to `ARCH-COMPOSED-PROSE.md` v1.**
Read-only throughout. Product read at `$SC/laneB6` = `3b1c0eaa5` (`git log --oneline -1`, executed). Nothing written outside `$SC/arch-prose/`. Nothing over twelve words quoted from any exemplar text.

## What I executed (every figure below traces to one of these or to a file:line I read)
1. `node $SC/arch-prose/_crit-hash.mjs` — the kernel's own `fnv1a32` + `avalanche32` (transcribed from `stateProseKernel.js:92-115`) over the §0 walked key.
   `w-2917::DS-DEF-11::WALLED-STRAINED` → hash `4122965447`, `%2 = 1`; `…::w` → `2033132843`, `%4 = 3`.
2. `node $SC/arch-prose/_crit-pools.mjs $SC/laneB6` — a census over the six shipped leaves:
   `pools 708 variants 2266 twoVariantPools 33`; `numeric-looking pool keys: 0`; **7 pools contain a `canonical` variant, and all 7 are MIXED — `canon 1 of 4` in every case** (DS-ECO-3 ×3, DS-ECO-6 ×2, DS-ECO-7 ×2).
3. `node $SC/arch-prose/_crit-def11.mjs` — DS-DEF-11 dumped: 5 pools, 12 variants, every one a single sentence, slots `["settlement","defwork"]`; `WALLED-STRAINED[1]` = angle `unfolding`, no `;`/`:`, 23 words, carries a `which`.
4. `node $SC/arch-prose/draw-reroll.mjs` (v1's own script, re-run) — `45.21 %` flatten / `100.00 %` two-level / `25.05 %` face-0 over 141,600 reads. Reproduces.
5. `sed` reads of `stateProseKernel.js:85-130, 150-320`, `defenseStateProse.js:725-800`, `economy.generated.js:995-1040`; `read-kernel.md:95-135, 520-565` (the draw-key finding).

---

## F1 · BREAKS · HIGH — the authoring wave adds variants to existing pools, which re-rolls them, under a signature that says it does not

**v1 claims.** §8.2: "THIN by grammar → REWRITE+FACES **plus one or two new variants** in a missing level-1 member". Car 8 builds "THIN pools gain a second grammar"; car 8's door is "the variant ratchet re-pinned (**semantic count unchanged**; the face pin 1 → 4 per pool)"; car 8's proof is "the manifest diff: **semantic `(pool, index)` preserved on 100 % of cells**". §8.6: "This architecture produces **exactly TWO** declared text shifts".

**Evidence.** `stateProseKernel.js:304` — `eligible[avalanche32(fnv1a32(\`${seed}::${blockId}::${poolKey}\`)) % eligible.length]`. The modulus is the eligible LENGTH. `read-kernel.md:107` states it flatly: adding a variant to a pool re-rolls every town where the new variant is eligible; there is no append-only escape at this tip. Arithmetic for the commonest case, a 2-variant pool gaining one (indices 0 and 1 keep their variants): the same hash `h` gives `h%2` before and `h%3` after; over `h mod 6 ∈ {0..5}` the pairs are (0,0)✓ (1,1)✓ (0,2)✗ (1,0)✗ (0,1)✗ (1,2)✗ ⇒ **33.3 % preserved, 66.7 % re-rolled**. **33 of 708 pools hold exactly 2 variants** (CONFIRMED, run 2) and are the natural THIN-by-grammar rows. So car 8 as specified changes the ANGLE and the CLAIM of roughly two thirds of the reads on ~4.7 % of a town's pools, on every installed world — the exact failure v1 refuses the flatten for (§2.6: "under the flatten the migration criterion 'wording-only on the golden sample' is unprovable, since 54.79 % of reads would change their ANGLE and claim set"), reintroduced through the back door and signed as Shift 1, whose stated proof it makes unpassable.

**Severity.** HIGH. It is simultaneously (a) an undeclared same-seed text shift class, (b) a self-contradiction inside one car's build/acceptance rows, and (c) a defeat of the migration proof the whole sequence is built around.

**Fix.** Strike variant-addition from car 8. Make it an explicit THIRD shift class with its own owner row and its own car after Shift 1: "THIN pools gain variants — a semantic re-roll on N pools, T towns, printed pool-by-pool by the manifest before signature." Add a projector arm to car 4 pinning `pools[key].length` per pool (a per-pool VARIANT-COUNT pin beside the face pin), so a pool can only grow in a car that declares the pin move. Alternatively adopt what `read-kernel` open question 3 offers — an index-stable draw (hash-per-variant-id, argmax) — but that is itself a one-time shift and an owner row, so it must be *decided*, not left implicit.

---

## F2 · BREAKS · HIGH — a TURN replaces the spine, and v1 declares the turn wave ADDITIVE

**v1 claims.** §2.2 TURN: "a whole unit … it **REPLACES the spine and the modifiers it `covers`**". §8.6: "The authoring wave's modifiers and turns are NEW keys and move no existing draw; their text changes are declared per block as **ADDITIVE** and owner-signed at the walk."

**Evidence.** Both sentences are in v1. "Moves no existing draw" is true of the hash (a turn is a new poolKey, `stateProseKernel.js:304`) and irrelevant to the reader: on every town where the turn's registry id holds, the sentence the town read yesterday — the drawn spine — is gone from the page and a different unit stands in its place. Car 11 lands `condition:<archetype>` turns on DS-CND-1's spines and `corruption:revealed` on the three `WALLED-*` spines; §6.3 sizes the latter at "3 × 4" over the WALLED cells. That is a REPLACED cell on every such town, indistinguishable in kind from Shift 2's re-key, which v1 does gate on the owner (§13 row 4).

**Severity.** HIGH — it mis-classifies a reader-visible replacement as an addition and routes it past the owner's signature.

**Fix.** In §8.6 and car 11: a turn's cells are **REPLACED**, never ADDITIVE. Car 11 gets its own declared shift (Shift 3) and its own §13 row; the manifest must name every town whose spine a turn displaces, and the acceptance becomes "the REPLACED list is finite, printed and signed", as car 10's already is.

---

## F3 · BREAKS · HIGH — a covert fact can consume a seat or a budget slot and change the PLAYER page

**v1 claims.** §0 step 5: "**The player's page over a bought watch is byte-identical to the page over an honest one** (kernel law 2)". §11's guard row for the covert seam: "the audience check per piece before the draw; … the manifest's player face recorded and diffed".

**Evidence — the specified order is the unsafe one.** §4.2 runs **step 4 the bound** ("the fact budget, the seats, the capacity; walk the ranked list … stop at two, or at no seat, or at no budget") **before step 5 per-piece eligibility** ("`eligibleVariants` then `drawVariant` … an empty pool or a null fill DROPS that candidate and the walk continues"). The audience filter lives inside `eligibleVariants` (`stateProseKernel.js:264-268`, `variantIsAudible :159-163`) — i.e. at step 5. In the single-seat case the walk continuing does save it (§0's own example). It does not save the case where the covert candidate consumes a resource that is not released:

§4.4's POSITION BUDGET — "at most TWO rungs carry modifiers … the desk keeps modifiers on the two rungs whose top-ranked (rung, modifier) pair is highest (**band**, then key 5) … and **a modifier pool seated at one rung is withdrawn from the other rungs at that mount**". `band` is computed at step 3, before any audience filter. Concretely at `overview.systemsHealth` (10 rungs, `generalStateProse.js:1712-1725`): a covert modifier at band 3 wins rung 3's slot and is withdrawn from rung 7. On the DM page rung 3 carries it. On the player page it drops at step 5, rung 3 renders bare, rung 7 is still withdrawn, and **only one rung on the mount carries a modifier — where the honest counterfactual town shows two.** A player comparing two towns reads the shape of a DM-only fact.

**Evidence — the named guard cannot see it.** §3.6's manifest compares `audience: dm` against `audience: player` **on the same town** and pins the count of cells that differ on the 12 mixed pools. A leak-by-absence is a difference between the player page of a covert town and the player page of an *honest counterfactual*; no two-audience diff on one town can detect it.

**Severity.** HIGH — it is the one class of composition bug that puts DM-only information on a player surface, and v1 asserts it closed "by construction" while specifying a construction that does not close it.

**Fix.** Two lines, both cheap. (1) Move the audience filter to **step 2**: the candidate list is filtered by `eligibleVariants(pool, {audience, slots, dimensions}).length > 0` before salience, before the bound, before the position budget and before any withdrawal — so a covert candidate can never consume a seat, a slot or a withdrawal on the player face. State it as a law: *nothing a covert piece does may be observable on the player face, including what it prevented*. (2) Add the counterfactual arm car 1 is the natural home for: compose each sampled town twice on `audience: player` — once normally, once with every `dm-only`-marked pool suppressed at the candidate stage — and assert the two renders byte-identical across all 525 towns. Without it, kernel law 2 is a claim with no instrument.

---

## F4 · STRAINS · MEDIUM — the norm leaf is a live re-measured seed input, so ordinary cars silently re-order installed worlds

**v1 claims.** §2.3: `proseNorms.generated.js` `{block::pool: rateBp}`, "an OWNER-FACING SEED INPUT from the day it ships", separated from `poolMeta` precisely "because a re-measured norm re-orders modifiers on installed worlds". §13 row 6: "it changes only in a declared car". Car 9's door: "the norm leaf (declared row)".

**Evidence.** `rateBp` is defined in §3.1 as "firing share over the sample, **by execution**", measured "at the COMPOSER layer with the readings bag rebuilt as the desk-read callers build it" (§3.4). Every authoring car changes desks: car 9 adds candidate functions and adds `economicGates` to the general desk's readings (`generalDeskRead.js:176-210`). So the measured `rateBp` of pools that nobody touched drifts as a side effect of unrelated work, and because `rateBp` feeds DEPARTURE, a drift across the 10 % line flips a band, re-orders the modifiers, and changes the composed text on installed worlds. "Declared in a car" makes it visible after the fact; it does not make it intentional, and there is no rule anywhere in v1 freezing an existing pool's row.

**Severity.** MEDIUM — not a fact shift, but a recurring, incidental same-seed text shift on every world, generated by cars whose acceptance rows say ADDITIVE.

**Fix.** Do not ship the rate as the draw input. Ship the **bit**: `proseNorms.generated.js` holds `departure: 0|1` per pool, computed once at the pool's birth car and **frozen thereafter**; the measured `rateBp` is re-printed every run as a REPORT the chair reads. A bit that crossed its line becomes a chair finding and, if taken, its own declared row — never an automatic input. This also removes the departure LINE (§13 row 5's 10 %) from the render path entirely, so a later veto of the line costs nothing on installed worlds.

---

## F5 · STRAINS · MEDIUM — the surfaced-reading arithmetic contradicts v1's own connective table, and §13 row 5's connective number is unsatisfiable

**v1 claims.** §4.5's forms column: `consequence` → three forms; `tension` → four ("empty opener · `Yet` · `Even so,` · `Against that,`"); `contrast` → "empty opener; a fronted contrast is refused"; `addition` → "**empty opener only**". §13 row 5 and car 6 both require "**≥ 3 phrases per relation per seat**".

**Evidence — the numbers.** Every headline figure uses "≈ 3 openers" regardless of the seated modifier's relation.
- §6.4, `granary AND hospital, stores short` — `stores: short` is `addition · sentence`: v1 prints "spine 3 × 4 = 12 × opener 3 × modifier 12 = **432**". With addition's one (empty) opener: 12 × 1 × 12 = **144**. Overstated 3×.
- §6.5, DS-GEN-3 — `purse: short` (consequence, 3) + `roll: falling` (**addition**, 1): v1 prints `12 × (3 × 12) × (3 × 12) = **15,552**`. Correct: 12 × 36 × 12 = **5,184**. Overstated 3×.
- §0 / §6.3 Phase 1 — the seated piece is `watch: bought (covert)`, `tension` (4 forms): v1 prints 2 × 4 × 3 × 4 × 3 = **288**. With four: 8 × 12 × 4 = **384**. Understated.
- §6.3 Phase 2 — `muster: short` (consequence, 3) + `country: pressed` (tension, 4): v1 prints **15,552**; correct 12 × 36 × 48 = **20,736**.

**Evidence — the contradiction.** "≥ 3 phrases per relation per seat" cannot hold for `addition` ("empty opener only") or `contrast` ("empty opener"), so car 6's acceptance and §13 row 5 are unmeetable as written against §4.5.

**Severity.** MEDIUM. The figures are marked ESTIMATE, but they are the owner-facing benefit case and one of them is the number under the owner's own walls example; and an owner is being asked to veto a connective count that two of four relations cannot satisfy.

**Fix.** Recompute every §0/§6 figure with the per-relation form count from §4.5's own table and print the count beside each product. Then decide the connective floor per relation, not globally: `consequence` ≥ 3 · `tension` ≥ 3 · `addition` and `contrast` = 1 (empty), and rewrite §13 row 5 to say exactly that. If the owner wants variety on `addition`, that is an authoring act with its own claim-freeness proof, not a number carried by assumption.

---

## F6 · STRAINS · MEDIUM — the "nine bound rows" are seven, and the face pin is at the wrong granularity

**v1 claims.** §2.6: "Nine rows keep one face, by refusal: the 7 `canonical` variants (CONFIRMED) and the 2 live-string-bound rows (`economy.generated.js:1007`, `:1035`)". §6.6: "2,266 × 4 = 9,064 wordings **less the 9 bound rows (27 faces)**". §8.4 / car 4: the guard is "a per-pool FACE-COUNT PIN" and the car-4 door reads "the face pin 1 → 4 **per pool**".

**Evidence.** `economy.generated.js:1004-1040` (read): `DS-ECO-7.pools.TALLIES[0]` is `{angle: "canonical", text: ECONOMY_FRESHNESS_SENTENCES.tallies, slots: []}` at :1007, and `CATALOG[0]` the same at :1035. **The two live-string-bound rows ARE two of the seven canonical rows** — the sets are not disjoint, so the exempt count is **7**, and §6.6's subtraction is wrong by 6 faces.

More consequentially, run 2 shows **all 7 canonical variants sit in MIXED pools, `canon 1 of 4` in every one** (DS-ECO-3 SHORTAGE × trade-dependent, ADEQUATE, SURPLUS × trade-dependent; DS-ECO-6 both TIER pools; DS-ECO-7 TALLIES, CATALOG). So after the freeze those seven pools each hold one 1-face variant beside three 4-face variants. A **per-pool** face pin cannot express that; it either fails at projection on all seven pools or forces faces onto a byte-copy of a live engine string, which §2.6 refuses. Since the face pin is the only thing standing between a later append and a re-roll of every world's face for that pool (§2.6, §13 row 3), a pin at the wrong granularity is an unenforced guard on a declared PROMISE control.

**Severity.** MEDIUM — the arithmetic is cosmetic, the pin is not.

**Fix.** Make the pin **per variant**: `poolMeta[key].faceCounts: number[]`, one entry per variant index, pinned by the projection contract test, moved only in a declared car; `drawFace`'s modulus is already per-variant (`1 + variant.wordings.length`), so the code needs nothing. Correct §2.6 to "seven bound rows, each `canon 1 of 4` inside a four-variant pool" and §6.6 to `9,064 − 21 = 9,043`.

---

## F7 · STRAINS · MEDIUM — salience ordering has no comparator, no final tie-break, and is degenerate on the index-paired mounts

**v1 claims.** §4.3: "within a band, **a seeded permutation on key 5**"; "A4 asserts repeat-call identity and prints the tie rate over the sample". §4.7: "ranking within a band is a function of the seed and a documented key".

**Evidence.** (a) No algorithm is given. "A seeded permutation" over per-candidate 32-bit hashes is presumably a sort by hash, but the comparator is unstated; an implementation reaching for `localeCompare` on the key as a tie-break would make the order depend on the machine's ICU build — a cross-machine determinism break inside a PROMISE-bearing path. Nothing in v1 forbids it. (b) No final tie-break is specified for equal hashes; A4 prints a tie *rate* without saying what a tie resolves to, so the answer defaults to `Array.prototype.sort` stability over the desk's candidate array — an ordering v1 never pins. (c) Worse, on the four index-paired list positions (`generalStateProse.js:1746-1937`; conflicts, steadings, neighbours, engagements) `read-kernel` records that every row loops with the SAME seed, blockId and poolKey. Key 5 is `${seed}::${blockId}::${spineKey}::salience::${candidateKey}` — **byte-identical across those rows**. So the permutation is a total tie, and §4.4's "a modifier pool seated at one rung is withdrawn from the other rungs" hands the modifier to row 1 by array position with no principle at all. Car 10, which mints the `::${instanceId}` cure, is owner-gated and sequenced AFTER the authoring wave (car 9), so the wave lands modifiers onto mounts where this is live.

**Severity.** MEDIUM — deterministic-in-practice today, but unpinned and arbitrary where it matters, and the fix is nearly free.

**Fix.** Write the comparator into §4.3 as law: sort ascending by `avalanche32(fnv1a32(key5))`, ties broken by ascending **code-unit** comparison of `candidateKey` (`a < b`, never `localeCompare`, never `Intl`); a lint arm bans `localeCompare`/`Intl`/`toLocaleLowerCase` from `composeStateProse.js` alongside the existing import fence. And move car 10's per-instance key **before** car 9, or forbid modifiers on the four index-paired positions until it lands.

---

## F8 · STRAINS · MEDIUM — the CHANGE signal makes composed text a function of elapsed time, with no fact value changing

**v1 claims.** §4.3 CHANGE: "the desk's `change` flag, true only from a PERSISTED change record (a condition's `direction: worsening`, `populationTrend.band`, **a pulse-stamped transition tick inside the window**)"; the window "one season (ESTIMATE)". §7: "A page re-rendered after the world pulse moved a fact is different because the KEY moved — the world changing, not staleness."

**Evidence.** The first two sources are persisted bands and change only when a fact changes. The third is a *comparison against the current tick*: a transition stamped at tick T scores CHANGE while `now − T ≤ one season` and stops scoring after. So a town none of whose fact values moved reads a different composed sentence — a modifier reordered out of band, or dropped from the seat — purely because ticks elapsed. §7's defence does not cover this case: **no key moved and no fact value moved**; only the clock did. §13 lists the window under row 5's vetoable numbers but nowhere records that it is a continuous text-mutation channel independent of the world's facts.

**Severity.** MEDIUM. It is not a fact shift and it is arguably "the world", but it is exactly the class of surprise a beta reader reports as "the page changed and nothing happened", and it is the one salience input that is not a pure function of persisted state.

**Fix.** Either strike the tick-window source and let CHANGE read only persisted bands (`direction`, `populationTrend.band`) — the cheapest and cleanest, and it makes salience a pure function of persisted state, matching §4.7's own wording; or, if the window stays, quantise it to a persisted band the pulse writes (`recency: 'this-season' | 'older'`) so the flip happens at a pulse boundary the world records, and add it to §13 as its own owner row naming the effect in plain words.

---

## F9 · STRAINS · LOW — two further undeclared shift channels: the connective lists and the reservoir's blockId

**v1 claims.** §2.4 key 4: the connective modulus is "the relation × seat list length"; "list lengths frozen; a longer list is a declared shift". §8.6: "exactly TWO declared text shifts". §2.9: a reservoir pool attaches at another block's site, "the reservoir pool's own draw key is untouched"; §2.3's `attach` comment allows wave-two `'DS-XXX-N:<key>'` sites, while §2.5's ATTACH refusal row reads "a key **the block does not hold**".

**Evidence.** (a) Car 6 drafts the connective set and car 9 authors modifiers in relations whose lists car 6 may not have filled; any list that grows re-rolls every joint drawn on that (relation, seat) for every world. That is a third shift class, absent from §8.6 and §13. (b) §2.2 keys a modifier draw `${seed}::${blockId}::${modifierKey}` and §4.1 calls `composeStateProse(corpus, blockId, …)` with the *attach site's* block. A reservoir pool lives in block X and speaks at block Y's mount, so the key material is ambiguous between X and Y and v1 never says which. Since the pool draws nowhere today either answer "moves nothing", but the choice is permanent from the pool's birth and must be written down. (c) §2.3 and §2.5 disagree on whether a cross-block `attach` is legal at all.

**Severity.** LOW individually; together they say the shift ledger in §8.6/§13 is not closed.

**Fix.** Add to §8.6 a **shift register**: every mechanism whose change re-rolls a drawn index — variant counts, face counts, connective list lengths, pool renames, the norm bit — each with its pin, its door and its owner row; the register is the acceptance for car 4, not prose. State the reservoir rule explicitly: a cross-block modifier keys on **its own** `blockId` (so its identity never depends on where it is seated) and §2.5's refusal row gains "except a wave-two reservoir site named in the act".

---

## F10 · HOLDS · (verified, no change needed) — the two-level roll ruling and its measurement

**v1 claims.** §2.6 and §13 row 2: the two-level roll over the brief's flatten, because "the flatten preserves the semantic variant on 45.21 % and the two-level roll on 100.00 %, with the face die uniform at 25.05 %".

**Evidence.** I re-ran v1's own `draw-reroll.mjs` at the product tip: `708 pools, 2266 variants, mean 3.20`; histogram `2->33 3->547 4->96 5->17 6->15`; `FLATTENED … 64018/141600 = 45.21 %`; `TWO-LEVEL … 141600/141600 = 100.00 %`; `face-0 share 25.05 %`. Reproduces exactly. The 100 % is structural, not statistical: nesting `wordings` inside the variant leaves `eligible.length` untouched (`stateProseKernel.js:264-268, :304`), and `drawVariant` reads only `blockId`, `poolKey` and `seed` — never a pool's or a variant's fields — so no metadata edit can move a draw. The design's central migration claim is a shape, as v1 says. One nit, cosmetic: the script's face suffix is `::wording` where §2.6 specifies `::w`; the statistic is unaffected but the two should be made to agree before the number is quoted again as the pinned key.

---

## F11 · HOLDS · (verified, no change needed) — the §0 walked receipt is real

**v1 claims.** §0 steps 1–3: `wallRationalePoolKey` returns `WALLED-STRAINED`; the spine "draws its second variant (index 1 of 2 — computed with the kernel's hash pair; **face 3 of 4** once the faces land); that variant's text carries no semicolon … and it carries a `which` tail". §6.3: 5 pools · 12 variants · every one a single sentence · slots `{settlement, defwork}` · free clause seats 3 of 12.

**Evidence.** `defenseStateProse.js:747-757` (read): `walls && typeof militaryGate === 'number' && militaryGate < 1` ⇒ `'WALLED-STRAINED'`, and the monster family is never consulted on that branch — the short-circuit v1 describes. Run 1: `avalanche32(fnv1a32("w-2917::DS-DEF-11::WALLED-STRAINED")) = 4122965447`, `% 2 = 1`; the `::w` suffix gives `2033132843 % 4 = 3`. Run 3: `WALLED-STRAINED` has 2 variants; index `[1]` is angle `unfolding`, carries no `;`/`:`, 23 words, and contains a `which`. Every element of the walked example is the code's, not the author's. Free clause seats by pool: THREATENED 0/3, QUIET 1/3, STRAINED 1/2, UNWALLED-SMALL 0/2, UNWALLED-LARGE 1/2 = **3 of 12**, and all 12 are single sentences — §4.4's and §6.3's figures both confirmed.

---

## F12 · HOLDS · LOW — object-key order is not a live hazard, but nothing keeps it that way

**v1 claims.** §4.7: "attachment is a function of the state and of frozen leaf data"; §4.2 step 2 takes "the desk's fired modifier keys".

**Evidence.** Run 2: **0 of 708 pool keys are numeric-looking**, so no `Object.keys(block.pools)` iteration reorders today (JS puts integer-like keys first, in numeric order, ahead of insertion order). The candidate list is typed as an array in §4.1's signature, which is the right shape. But a wave that mints a modifier keyed `"2"` or `"12"` — and the key idiom is free-form human-readable text — would silently reorder any candidate list derived by iterating the pools object, moving the tie-break order and, on the index-paired mounts of F7, the seated modifier.

**Fix.** One projector refusal in car 4 beside the other annex refusals: a pool key matching `^\d+$` is an error. And state in §4.1 that the candidate list is an ordered array built by explicit calls, never by iterating `pools`.

---

## Summary of the lens's four questions

| the question | the answer at v1 |
|---|---|
| does any path change a **fact** under an existing seed? | **No** — confirmed. The composer is display-only (`stateProseKernel.js:10-11`), cars 13–14 are the only persisted-shape cars and both wait on the owner. |
| does adding a pool / modifier / turn / variant move an existing town's draw? | A **pool** or a **modifier**: no (new key; `:304` reads only seed·block·pool). A **face**: no (nested; `eligible.length` untouched). A **turn**: no draw moves but the spine is *replaced* — F2. A **variant**: **yes, 66.7 % of reads on a 2-variant pool** — and v1's car 8 adds variants while claiming it does not — F1. |
| is salience deterministic across builds and machines? | Integer-only scoring: yes. Ordering: **unpinned** — no comparator, no tie-break, `localeCompare` unforbidden, degenerate on four mounts — F7. Its input, the norm leaf, drifts as a side effect of unrelated cars — F4. Its CHANGE signal moves with the clock — F8. |
| is the same-seed text shift declared exactly as the golden master demands? | **No.** Two shifts are declared; at least three more exist (variant additions F1, turn replacement F2, connective list growth F9) and one channel is continuous (F4). |
| can a beta reader ever see a town change between visits? | Legitimately, when the world pulses. Illegitimately: after any release that re-measures the norm leaf (F4), after any THIN-pool variant addition (F1), after any turn lands (F2), and — with no world change at all — as a season boundary passes (F8). |
| can a player ever see the shape of a DM-only fact? | **Yes, as specified** — a covert candidate consumes a seat/slot/withdrawal before the audience filter runs, and no instrument in v1 can detect it — F3. |
