# RECEIPT POOLS — LEGACY (the seeded variant corpus for the LIVE ROUTED TOKENS)

## Fable 5 content authoring, 2026-08-03. This annex has NO design volume of its own.
## It discharges THE LEGACY CLAUSE of the spine's frequency-scaled floor
## (`DESIGN_FP_SPINE.md` §2 SP-6, AMENDED 2026-08-03): *"the floor extends to the
## ~269 LIVE routed tokens (today largely single-voiced) — their pools are
## pre-authored in the content annexes and wired under the lit-kind prose
## discipline."* The seven sibling annexes cover kinds their volumes MINT; this one
## covers the kinds the engine ALREADY MINTS AND ROUTES today. Where this file and
## `DESIGN_FP_SPINE.md` disagree, the spine wins and the disagreement is a bug to
## report.

**Status: CONTENT. Nothing here schedules a wave, lights a flag, or edits `src/`.
It is the authored corpus a wiring wave consumes.**

---

## ✅ RETROFIT COMPLETE — THE R1 SUBJECT-PHRASE HALF IS WIRED, 170 OF 170 KINDS (2026-08-03)

**`170 / 200 kinds wired.` §3 and §4 — every R1 subject-phrase pool in this annex — are
LIVE in `src/`. The remaining 30 are §1's 24 receipt-sentence pools (R2) and §2's 6
news-summary pools (R3), which are deliberately NOT closed here; see the boundary below.**

| Section | Desk | Kinds | Wired | Slice |
|---|---|---|---|---|
| §3c | population / demographics | 4 | ✅ | 1 — `1b9b2b10` |
| §3a | war | 12 | ✅ | 2 — `6d33aa8d` |
| §3d | events | 28 | ✅ | 2 — `6d33aa8d` |
| §3c | economy / trade | 13 | ✅ | 3 — `9dc12049` |
| §3b | faith | 5 | ✅ | **4** |
| §3e | divination | 1 | ✅ | **4** |
| §4a | war (fallback-voiced) | 29 | ✅ | **4** |
| §4b | trade (fallback-voiced) | 27 | ✅ | **4** |
| §4c | faith (fallback-voiced) | 5 | ✅ | **4** |
| §4d | divination (fallback-voiced) | 5 | ✅ | **4** |
| §4e | events (fallback-voiced) | 41 | ✅ | **4** |
| **§3 + §4 total** | | **170** | **✅ 170** | |
| §1 | receipt sentences (R2) | 24 | ⛔ not this lane | — |
| §2 | news summaries (R3) | 6 | ⛔ not this lane | — |

**WHERE THE CODE IS.** `src/domain/display/rumorPhrasePools.js` holds §3's 63 pools;
`rumorFallbackPhrasePools.js` + `rumorFallbackPhrasePoolsEvents.js` hold §4's 107 (split
for the 800-effective-line domain ceiling, R-BLD-4). `settlementRumors.js`'s `whatPhrase`
is the single selector; both arms widen through one helper on one hash key, so the corpora
cannot drift into different selection behavior. Enforced by
`tests/domain/rumorPhrasePools.test.js` and `tests/domain/rumorFallbackPhrasePools.test.js`.

**WHY §1 AND §2 ARE A DIFFERENT LANE, NOT AN OVERSIGHT.** §3/§4 are read by ONE pure
selector that takes no slots. §1's pools are consumed by the five registry-backed receipt
functions in `src/domain/worldPulse/eventProse.js`, each carrying a PARALLEL
`requiredSlots` array — *a pool
grown without its parallel row throws at the new index* (retrofit disclosure §4) — and
wiring note LEG-3 additionally requires a new walker asserting
`pool.length === requiredSlots.length`. §2's are `{headline, summary, reasons}` triples
carrying live interp keys. Different consumer, different failure mode, different gate.
Bundling them into an R1 wiring wave is exactly what LEG-7 forbids for the sibling case.
**Deliberately deferred, documented, priced — not a bug to re-find.**

**WHAT DID NOT MOVE.** The three owner-gated items are untouched and remain owner-gated:
DEFECT-1/2/3's de-slugging of the twelve MUTILATED §4 anchors (`coup_detat` → "detat" is
still live, now as one voice in six rather than the only one), and DEFECT-8's digit
retirement. `tests/domain/rumorFallbackPhrasePools.test.js` freezes the mutilated roster
at exactly twelve so neither a silent repair nor a new mutilation can land unremarked.

---

## ⚠️ THE RETROFIT DISCLOSURE — READ BEFORE WIRING A SINGLE POOL

Every pool in this file RETROFITS a kind that is **already live and already
routed**. That makes wiring them a different act from wiring a sibling annex,
and the difference is the whole of this section.

1. **WIRING IS A DISCLOSED SAME-SEED PROSE SHIFT.** Today each of these kinds
   renders ONE string (or, for the sentence-pool kinds of §1 and §2, one of four
   or five). Giving it a pool means an existing seed that used to draw the single
   string may now draw a different member. Same world, same tick, same facts —
   different words. That is a behavior change on a shipped surface and it rides
   the recorded-ruling pattern already established by J-POP-12 and J-INT-13: the
   spine's frequency-scaled-floor amendment IS the design half of that recorded
   ruling, and **this annex is its content half**. THE PER-KIND GOLDEN PLAN STILL
   LANDS AT WIRING — it is not written here and must not be assumed written.
2. **VARIANT 1 IS THE CURRENT LIVE STRING, VERBATIM — FROM TWO PROVENANCES.** In
   every pool below, variant 1 (and, in §1 and §2, variants 1..N) reproduce exactly
   what the reader is shown today. **93 pools reproduce a string `src/` HOLDS**
   (§1's 24 `WAR_RECEIPTS` template arrays, §2's 6 `summary` pools, §3's 63
   `WHAT_PHRASES` rows), marked `[live, verbatim]`. **107 pools reproduce a string
   `src/` COMPUTES** — §4's fallbacks, which no source line contains: `whatPhrase()`
   strips and de-underscores the token at call time. Those are marked `[fallback,
   live — byte-identity anchor]`, and J-LEG-4 rules that the byte-identity clause
   binds them exactly as it binds an authored string. Either way the pool ONLY EVER
   WIDENS. A wiring wave that keeps the live string at pool index 0 and leaves the
   selector dark is **byte-identical** — that is the dark path, and it must stay
   provably byte-identical until the flag lights.
3. **THE POOL ORDER IS LOAD-BEARING.** Index 0 is the byte-identity anchor.
   Re-ordering a pool is a prose shift even with the flag dark, because the seeded
   selector is `pickLine`'s `hash(seed) % pool.length` — and, on the five
   registry-backed receipt functions, `eligible[hash(seed#kind) % eligible.length]`
   over the slot-filtered subset. Under either form every insertion moves every
   later index. Append; never insert, never re-sort.
4. **`requiredSlots` IS PARALLEL AND MUST GROW WITH THE POOL.** The §1a/§1b/§1d/§1e/§1f
   pools are consumed by `warCoalitionReceipt` / `warRulingReceipt` /
   `dispositionReceipt` / `lineageReceipt` / `warCostReceipt`
   (`src/domain/worldPulse/eventProse.js`), each
   of which indexes a parallel `requiredSlots` array by template index and filters to
   templates whose slots the caller actually holds (the NO-FABRICATION rule). **Every
   variant added to a registry-backed pool below carries its own `requiredSlots`
   line.** A pool grown without its parallel row throws on the new index.
   **THE ONE EXEMPTION IS §1c.** `corruption_exposed` is a casus-reason pool read by
   `warReceipt` → `pickLine`, which carries NO parallel array and does no slot
   filtering; its six variants therefore carry no `requiredSlots` row, and adding one
   would invent a guard the consumer cannot honour.
5. **THE FAMILY ID IS THE ORIGINAL INDEX.** `familyId: ${kind}.${templateIndex+1}`.
   Appending is safe for the repetition envelope's family accounting precisely
   because indices never move.

---

## THE POOLED-AXIS DOCTRINE (the ruling that shapes this file)

A legacy kind does not have "a string". It has **axes** — different surfaces that
say different things about the same token. The census counted the DEEPEST axis per
kind; this annex deepens THAT axis and names it on every pool. Three axes exist,
and only two of them are under the floor.

| Axis | Where it lives | Register | Under the floor? |
|---|---|---|---|
| **THE TELLING — receipt sentence** | `WAR_RECEIPTS` and friends (`src/domain/worldPulse/eventProse.js`), the `summary` pools of `UPSWING_NEWS` / `NPC_GOAL_NEWS` | one to two clauses, chronicle voice | **YES** (§1, §2) |
| **THE TELLING — subject phrase** | `WHAT_PHRASES` / `whatPhrase()` (`settlementRumors.js`) | a lowercase NOUN PHRASE, no terminal stop | **YES** (§3, §4) |
| **THE NAME — label / gloss** | `CONDITION_ARCHETYPE_TEMPLATES[k].label` and `.description` (`activeConditions.js`), `STRESSOR_CATALOG[k].label`, `SECONDARY_RELATIONSHIP_STATUSES[k].label` | a Title-case chip name; a one-sentence explainer | **NO — see J-LEG-1** |

**J-LEG-1 (RULING, vetoable) — A NAME IS NOT A TELLING, AND THE FLOOR DOES NOT
BIND IT.** A condition's `label` is the settlement card's chip; its `description`
is the explainer under that chip. Both answer *"what is this thing"*, and both are
read by a player who is orienting, not being told a story. The LEGIBILITY LAW's
glance tier requires them to be **stable**: a Corruption scandal that calls itself
something different every time it is looked at is not deeper, it is unrecognisable.
So labels and glosses are excluded from the frequency-scaled floor by their KIND,
not by budget. Where a kind carries one, this file records it on an `ALSO LIVE:`
line so the exclusion is visible and auditable rather than silent. *(If the chair
is overruled, the gloss axis is a separate, smaller bill — roughly twenty kinds —
priced in the DEFERRED AXES REGISTER at the tail.)*

**J-LEG-2 (RULING, vetoable) — A KIND'S SECOND TELLING AXIS IS DEFERRED, NOT
DENIED.** Twenty-nine kinds carry BOTH a receipt-sentence pool (§1/§2) and a
subject phrase. This file deepens the axis the census measured — the deeper one —
and records the other on the pool's `ALSO LIVE:` line. Deepening the second axis
is maintenance under the same amendment, and it is listed at the tail. It is
deliberately deferred, documented, and not a bug to re-find.

---

## THE THREE REGISTERS (a variant must match its pool's register exactly)

**R1 — THE SUBJECT PHRASE (§3, §4).** A lowercase noun phrase with no terminal
punctuation, which must read correctly in BOTH of the live frames:

> "Travellers bring word of **the granaries standing empty** near here."
> "**Soldiers marching to war** in {settlement}."

So: no leading capital, no full stop, never a bare verb, never a finite clause.
Gerund-headed and article-headed noun phrases both work; a phrase that only reads
in one frame is a defect, not a variant.

**R2 — THE RECEIPT SENTENCE (§1).** One to two clauses, full stop, chronicle
register, the shape `WAR_RECEIPTS` already ships. Slots per the convention below.

**R3 — THE NEWS SUMMARY (§2).** The `summary` member of a `{headline, summary,
reasons}` triple. Two sentences at most; keeps the live interp keys of its own
pool, appended clauses included (`${x.dep}`, `${x.built}`, `${x.graft}`).

---

## THE SLOT CONVENTION

No template bakes a proper noun or a rendered count. **The R1 subject-phrase pools
of §3 and §4 take NO SLOTS AT ALL** — the live frame supplies the settlement name
and the address chain around the phrase, which is why the address law is satisfied
without the phrase carrying a name. R2 and R3 pools carry the corpus slots.

**Canonical slots (corpus-wide):** `{settlement}` `{counterpart}` `{npc}`
`{faction}` `{house}` `{temple}` `{band}` `{reason}` `{good}` `{route}`
`{third_party}` `{war}` `{term}`

**THE LIVE-INTERP MAPPING (mechanical, for the wiring wave).** The live pools
interpolate a single `x` object. The transformation is exactly one substitution in
each direction and nothing else:

| This file | `src/domain/worldPulse/eventProse.js` | This file | `src/domain/worldPulse/eventProse.js` |
|---|---|---|---|
| `{settlement}` | `${x.settlement}` (in §2: `${x.name}`) | `{band}` | `${x.band}` |
| `{counterpart}` | `${x.counterpart}` | `{good}` | `${x.good}` |
| `{third_party}` | `${x.third_party}` | `{route}` | `${x.route}` |
| `{npc}` | `${x.npc}` | `{house}` | `${x.house}` |
| `{temple}` | `${x.temple}` | `{domain}` | `${x.domain}` |
| `{lean}` `{weight}` `{answer}` `{welcome}` `{aspect}` `{practice}` | the WR-2 disposition band fills, unchanged | `{goal}` | `${x.goal}` (§2 NPC pools) |

**Volume-local band slots (DECLARED here; each fills from a CLOSED engine
vocabulary, never free text):** `{lean}` `{weight}` `{answer}` `{welcome}`
`{aspect}` `{practice}` `{domain}`. These are not new — every one is already live
in the WR-2 pools this file extends; they are declared here because this annex adds
templates that use them and `requiredSlots` must name them.

---

## THE HARD CONSTRAINTS THIS FILE IS WRITTEN UNDER

1. **NO DIGITS.** Quantities speak only in band words (`QUANTITY_BANDS`,
   `demographicsHerald.js:58` — "a few souls", "dozens", "many hundreds" — plus the
   band vocabulary "a handful", "a score", "most", "more than once", "a
   generation"). No authored variant below contains a numeral. **The one exception
   is quarantined and disclosed:** exactly ONE pool in this file is live with a
   numeric interpolation — `reconstruction`'s §2 summary, whose four live variants
   each carry `${x.year}`. Those live strings are reproduced verbatim because
   byte-identity outranks the digit law for an existing string; **no variant this
   file ADDS introduces a numeric slot.** The engine's other numeric interpolations
   (`${x.arteries}` in `boom`'s *reasons* pool; `${x.count}` / `${x.debit}` in
   `LIFECYCLE_NEWS`) sit on axes this file does NOT deepen, and are recorded here
   only so the wiring wave meets them knowingly. Retiring any of them is a separate,
   disclosed change — DEFECT-8 at the tail.
2. **HEADLINE HONESTY (R-28).** Every phrase is entailable by the receipt's own
   facts. A phrase says what a record RECORDS or what an observer SAW; nothing
   asserts more than the state carries.
3. **BELIEF ATTRIBUTION.** Belief-side content carries its attribution — *the word
   is · it is said · they say · a court believing · men reckon*. Nothing believed is
   stated as engine truth. This binds hardest on the divination desk (§3/§4's six
   pressure kinds), on `belief_misjudgment`, and on every phrase about what a
   neighbour intends.
4. **LAW ONE.** No line confirms that a god acted — temples and believers act, the
   rites counsel, the altar keeps a calendar; the god never strikes. No line
   resolves or states a named person's fate: a fallen seat-holder is OUT OF THE
   SEAT, never dead; a missing legate is WITHOUT WORD.
5. **COVERT DISCIPLINE.** Pools marked `AUDIENCE: dm-only` project behind
   `includeGroundTruth` / `includeCovert`. Every other pool is the PUBLIC variant.
6. **THE FAMILY RULE.** Variants differing only in slot fills count as ONE for the
   floor. Every pool walks the angle palette below; no pool reaches its floor by
   restating an angle it already holds.
7. **LENGTH.** R1: a phrase, not a sentence. R2: one to two clauses. R3: two
   sentences at most.

## THE ANGLE PALETTE (eight angles; a pool at eight walks at least six)

1. **the event plain** — what it is, named without ornament
2. **the street's view** — what an ordinary person sees happening
3. **the ledger's view** — what the record, the clerk, or the office calls it
4. **the consequence forward** — what it will cost, next season
5. **the understatement / the quiet irony** — the wry reading
6. **the traveller's report** — what an outsider on the road noticed
7. **the season's frame** — the beat placed in the turning year
8. **the small human detail** — one clerk, one roof, one room set aside

## THE FLOORS APPLIED

| Cadence | Floor | Kinds here |
|---|---|---|
| chronic / routine | **8** (spine allows 8–12; the soak's phrase-repetition envelope promotes specific kinds to 10–12 at measurement — see J-LEG-3) | 116 |
| notable | **6** | 74 |
| major / rare | **4** | 10 |

**J-LEG-3 (RULING, vetoable) — EIGHT IS THE AUTHORED CHRONIC FLOOR; THE ENVELOPE
PROMOTES.** The spine's chronic band is 8–12 "according to cadence, and then
MEASURED". No pre-wiring cadence measurement exists for the legacy tokens — their
firing rates are known only in aggregate. Authoring every chronic kind at a guessed
10 or 12 would be a fabricated precision. So: **8 for every chronic kind here**,
which satisfies the floor, plus the standing instruction that the soak's
phrase-repetition instrument is the arbiter — any legacy kind that measurably
exhausts inside a season window is BELOW ITS FLOOR whatever its count, and its
promotion to 10–12 is maintenance, not new design. The kinds most likely to be
promoted are named in the tail's PROMOTION WATCHLIST so the soak knows where to
look first.

---
# §1 — THE RECEIPT-SENTENCE POOLS (R2)

Twenty-four kinds whose deepest live axis is a `WAR_RECEIPTS` template array in
`src/domain/worldPulse/eventProse.js`. Variants 1..N below are **the live pool,
verbatim and in live order**, slotted per the mapping table. Everything after N is
new.

**⚠️ `requiredSlots` IS AN EVIDENCE GUARD, NOT A TEXT SLOT.** The parallel array
already carries names that never render — `tollLoss`, `causewayNeglect`,
`granary`, `seedGood`, `harvestLabor`, `smithMuster`, `courtOffice`, `school`,
`wharfLabor`, `breadSupply`, `bridgeDamage`. They exist so a template asserting a
specific fact is only eligible when the caller HOLDS that fact (the no-fabrication
rule). Every added variant below declares its own guard on the same principle: if
the sentence names a bridge, it guards on bridge evidence. **A pool grown without
its parallel `requiredSlots` row throws at the new index.**

## §1a — THE COALITION POOLS (`warCoalitionReceipt`)

### casus_alliance_obligation — R2 receipt sentence — significance: notable — desk: war
CADENCE: notable → floor 6 · live 5 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "an alliance compact named as cause for war" [J-LEG-2 deferred axis]
1. {settlement} is in this war because {counterpart} called and the compact answers for it. `[live, verbatim]` · `requiredSlots: ['settlement','counterpart']`
2. The alliance obligation is one recorded cause on this edge; other live causes remain their own facts. `[live, verbatim]` · `requiredSlots: []`
3. The borrowed cause remains anchored to the caller's exact war episode and compact. `[live, verbatim]` · `requiredSlots: []`
4. They march for a paper, which is a better reason than most. `[live, verbatim]` · `requiredSlots: []`
5. This edge against {third_party} exists because an older edge does. `[live, verbatim]` · `requiredSlots: ['third_party']`
6. The compact was read aloud in council before the muster was called, which is the order the clerks entered it in. `requiredSlots: []`
7. Not a soul in {settlement} has a quarrel with {third_party}, and the levies went out all the same. `[merged ← WAR WR-6 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement','third_party']`

### coalition_debt_paid — R2 receipt sentence — significance: notable — desk: trade
CADENCE: notable → floor 6 · live 5 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a coalition debt paid" [J-LEG-2 deferred axis]
1. They paid what they owed. `[live, verbatim]` · `requiredSlots: []`
2. {counterpart} settled the recorded coalition claim owed to {settlement}. `[live, verbatim]` · `requiredSlots: ['counterpart','settlement']`
3. The conserved transfer met the recorded claim, and no unpaid remainder was minted. `[live, verbatim]` · `requiredSlots: []`
4. The payment travelled along {route} and is archived as payment, never forgiveness. `[live, verbatim]` · `requiredSlots: ['route']`
5. This coalition claim is closed; other causes and obligations remain separate. `[live, verbatim]` · `requiredSlots: []`
6. The factors on the quay had counted the wagons in before the court finished reading the writ. `requiredSlots: []`
7. It was paid late and paid whole, with no thanks offered in either direction. `[merged ← WAR WR-6 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

### coalition_entry_priced — R2 receipt sentence — significance: notable — desk: war
CADENCE: notable → floor 6 · live 5 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "an allied court pricing a call to war" [J-LEG-2 deferred axis]
1. {settlement} counted who might answer for {counterpart}, and then who might answer for those. `[live, verbatim]` · `requiredSlots: ['settlement','counterpart']`
2. The court priced the far compacts as beliefs, not promises of who would arrive. `[live, verbatim]` · `requiredSlots: []`
3. The obligation is plain and the arithmetic behind it is not. `[live, verbatim]` · `requiredSlots: []`
4. Entering a war is cheap; entering the war behind it is not, and this one prices {band}. `[live, verbatim]` · `requiredSlots: ['band']`
5. They read the whole web before they read the field, which is why they are still deciding. `[live, verbatim]` · `requiredSlots: []`
6. Whatever the court settles on, the price it has written down will be quoted back to it the next time it calls. `requiredSlots: []`
7. The reckoning wanted a wider sheet than the war itself had ever required. `[merged ← WAR WR-6 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

### coalition_expenditure_read — R2 receipt sentence — significance: notable — desk: trade
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "an allied court reckoning its wartime cost" [J-LEG-2 deferred axis]
1. {settlement}'s surviving current-episode evidence reads {band}; no lifetime total is invented. `[live, verbatim]` · `requiredSlots: ['settlement','band']`
2. The read uses deployed strength, recorded attrition, live exposure, and attributable home-front evidence. `[live, verbatim]` · `requiredSlots: []`
3. Damage that healed or left the bounded record is silence in this reckoning. `[live, verbatim]` · `requiredSlots: []`
4. What the alliance cost was never written down as a total — it is what the other books already say. `[live, verbatim]` · `requiredSlots: []`
5. The reckoning exists whether or not the coalition wants to hold it. `[live, verbatim]` · `requiredSlots: []`
6. The tally was read at the table, and nobody asked to have it read twice. `requiredSlots: []`
7. A factor down from the coast asked what the alliance had cost and was given a band, not a figure. `requiredSlots: []`
8. Taken again at the turn of the season the reckoning reads {band}, and nothing is added that the other books do not already hold. `requiredSlots: ['band']`
9. Both halls will quote the reckoning at one another, each taking the half that suits it. `[merged ← WAR WR-6 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

### coalition_stayed — R2 receipt sentence — significance: notable — desk: war
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "an ally choosing to stay in the field" [J-LEG-2 deferred axis]
1. They stayed. `[live, verbatim]` · `requiredSlots: []`
2. {settlement} reread its open edge against {third_party} and kept its army in the field. `[live, verbatim]` · `requiredSlots: ['settlement','third_party']`
3. The council reread the war, weighed the same ledgers as its neighbours, and reached the opposite conclusion. `[live, verbatim]` · `requiredSlots: []`
4. Staying was a decision and not an inertia, and the record says who made it. `[live, verbatim]` · `requiredSlots: []`
5. The ally that stays is owed differently from the ally that came. `[live, verbatim]` · `requiredSlots: []`
6. The levies were told at the muster field that they were not going home, and the field took it quietly. `requiredSlots: []`
7. The road home through {route} stood open the whole season and no column took it. `requiredSlots: ['route']`
8. By harvest the army was still in the field, which is longer than the council had reckoned for. `requiredSlots: []`
9. The men were told they were going home, and then they were not, and that telling outlasts the campaign. `[merged ← WAR WR-6 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

### mirror_obligation_discharged — R2 receipt sentence — significance: notable — desk: events
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "an alliance obligation discharged" [J-LEG-2 deferred axis]
1. The obligation is discharged: {settlement} came when called. `[live, verbatim]` · `requiredSlots: ['settlement']`
2. The record now carries service under the compact beside the obligation it answered. `[live, verbatim]` · `requiredSlots: []`
3. They answered the alliance in the field, and that answer is recorded. `[live, verbatim]` · `requiredSlots: []`
4. What was owed under this call was given; other claims remain separate. `[live, verbatim]` · `requiredSlots: []`
5. The compact survived this use, and the relationship record says so. `[live, verbatim]` · `requiredSlots: []`
6. The clerks of {counterpart} entered the service the week the column came home. `requiredSlots: ['counterpart']`
7. A compact that has been used once is worth more than a compact that never has. `requiredSlots: []`
8. The men who answered the call are back at their own harvest, and the entry stands whether or not anyone thanks them. `requiredSlots: []`
9. The next call on this compact begins from a shorter account than this one did. `[merged ← WAR WR-6 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

## §1b — THE REFUSAL-COST POOLS (`warRulingReceipt`)

### refusal_cost_ally_patience — R2 receipt sentence — significance: notable — desk: war
CADENCE: notable → floor 6 · live 5 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "an ally tiring of a refused peace" [J-LEG-2 deferred axis]
1. {counterpart} was refused, and {third_party} read the refusal as a bill it had not agreed to. `[live, verbatim]` · `requiredSlots: ['counterpart','third_party']`
2. The ally's factors have begun asking how long, which is the question before the door. `[live, verbatim]` · `requiredSlots: []`
3. Patience is a stock like any other, and this drew {band} on it. `[live, verbatim]` · `requiredSlots: ['band']`
4. They refused peace with somebody else's soldiers in the field. `[live, verbatim]` · `requiredSlots: []`
5. The alliance held. It is thinner than it was, and both courts know it. `[live, verbatim]` · `requiredSlots: []`
6. The council of {third_party} has begun reading its compact aloud before it discusses anything else. `requiredSlots: ['third_party']`
7. The allied captains dined apart that week, and the servants understood it before the clerks did. `[merged ← WAR WR-5 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

### refusal_cost_legitimacy — R2 receipt sentence — significance: notable — desk: adjudication
CADENCE: notable → floor 6 · live 5 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a ruler paying for a refused peace" [J-LEG-2 deferred axis]
1. {settlement} refused peace, and the streets priced the refusal within the season. `[live, verbatim]` · `requiredSlots: ['settlement']`
2. The seat spent its standing to keep its war. `[live, verbatim]` · `requiredSlots: []`
3. Men who bore the levy quietly do not bear a refused peace quietly. `[live, verbatim]` · `requiredSlots: []`
4. The council's confidence in {npc} reads {band}, and the refusal is the reason on every tongue. `[live, verbatim]` · `requiredSlots: ['npc','band']`
5. Nothing was lost in the field that day. A good deal was lost in the market square. `[live, verbatim]` · `requiredSlots: []`
6. The refusal was posted at the assize door and read by more people than any decree that year. `requiredSlots: []`
7. The next levy will be harder to raise than the last, and the reason will not appear on the summons. `[merged ← WAR WR-5 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

## §1c — THE CASUS-REASON POOL (`warReceipt`)

### corruption_exposed — R2 casus reason — significance: notable — desk: events
CADENCE: notable → floor 6 · live 4 · +2
AUDIENCE: public
ALSO LIVE: condition label "Corruption scandal" · condition gloss "Public exposure of corruption at an institutional level." [J-LEG-1: names, not tellings — excluded from the floor] · whatPhrase subject: **unvoiced** — no `WHAT_PHRASES` row, so `whatPhrase()` returns the de-underscored token *"corruption exposed"*. Plain, not mutilated: the DEFECT-6 class, and the thirtieth deferred second axis under J-LEG-2.
1. Their court is rotten and the rot is now public. Someone must answer for it. `[live, verbatim]`
2. Their court is corrupt and the corruption is now in the open. A reckoning is demanded. `[live, verbatim]`
3. The rot in their halls is known to all now. Such exposure calls for an answer. `[live, verbatim]`
4. Their governance is fouled and the foulness laid bare. Someone must be made to answer. `[live, verbatim]`
5. What was said in their market for a season is now written in a court record, and a record cannot be unsaid.
6. Nothing is being taken this season that was not taken last season; only the knowing is new.

## §1d — THE DISPOSITION POOLS (`dispositionReceipt`, WR-2)

### disposition_martial_crossed — R2 receipt sentence — significance: notable — desk: war
CADENCE: chronic → floor 8 · live 5 · +9
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a martial temper taking hold" [J-LEG-2 deferred axis]
1. {settlement}'s martial temper now leans {lean}; resolved contests changed the lesson. `[live, verbatim]` · `requiredSlots: ['settlement','lean']`
2. The muster carries {weight} weight in council than it did a generation ago. `[live, verbatim]` · `requiredSlots: ['weight']`
3. {settlement}'s watchfires now draw a {answer} answer from the court. `[live, verbatim]` · `requiredSlots: ['settlement','answer']`
4. The court is {answer} when captains ask for another campaign. `[live, verbatim]` · `requiredSlots: ['answer']`
5. What force accomplished has made {settlement} lean {lean} on the next quarrel. `[live, verbatim]` · `requiredSlots: ['settlement','lean']`
6. The armoury is opened for inspection more often than the granary is, which was not always the order of things. `requiredSlots: []`
7. Travellers on the {route} report the watch turned out in daylight, which is new. `requiredSlots: ['route']`
8. A generation of settled quarrels taught this court what force is for, and the lesson has become the shortest argument in the room. `requiredSlots: []`
9. The martial temper of {settlement} stands {band} now; the drill ground is busier than the market. `[merged ← WAR WR-2 v1 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement','band']`
10. The reeve's muster rolls are read aloud on feast days, which tells you where the town keeps its pride. `[merged ← WAR WR-2 v2 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
11. Boys who would have gone to the quays go to the watchfires instead. `[merged ← WAR WR-2 v3 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
12. It is a {band} appetite for war, and the council has stopped arguing about it. `[merged ← WAR WR-2 v4 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['band']`
13. They have learned to answer questions with soldiers, and the answers keep working. `[merged ← WAR WR-2 v5 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
14. The armoury's accounts have overtaken the almshouse's, and nobody in {settlement} finds it worth remarking. `[merged ← WAR WR-2 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement']`

### disposition_mercantile_crossed — R2 receipt sentence — significance: notable — desk: trade
CADENCE: chronic → floor 8 · live 5 · +9
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a mercantile temper taking hold" [J-LEG-2 deferred axis]
1. {settlement}'s mercantile temper now leans {lean}; resolved ventures changed the lesson. `[live, verbatim]` · `requiredSlots: ['settlement','lean']`
2. The quays carry {weight} weight in council than they did before. `[live, verbatim]` · `requiredSlots: ['weight']`
3. A generation of ledgers has made the court {answer} about another bargain. `[live, verbatim]` · `requiredSlots: ['answer']`
4. The town gives a {answer} answer when its factors propose a costly venture. `[live, verbatim]` · `requiredSlots: ['answer']`
5. What commerce accomplished has made {settlement} lean {lean} on the next bargain. `[live, verbatim]` · `requiredSlots: ['settlement','lean']`
6. The staple is swept before the assize hall is, and the factors of {house} notice such things. `requiredSlots: ['house']`
7. Merchants say a venture gets a faster hearing here than a grievance does. `requiredSlots: []`
8. The ledgers of a generation stand behind the habit, and the habit now argues for itself. `requiredSlots: []`
9. {settlement}'s mercantile temper stands {band}; the council counts in cargoes. `[merged ← WAR WR-2 v1 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement','band']`
10. The quays set the price of everything now, including opinions. `[merged ← WAR WR-2 v2 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
11. A generation of good ledgers has made the merchants louder than the captains. `[merged ← WAR WR-2 v3 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
12. Where the town once asked whether a thing was right, it asks what it costs. `[merged ← WAR WR-2 v4 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
13. The staple in {good} is the politics; the rest is ceremony. `[merged ← WAR WR-2 v5 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['good']`
14. A place on the council of {settlement} is got with a warehouse now rather than a grandfather. `[merged ← WAR WR-2 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement']`

### disposition_diplomatic_crossed — R2 receipt sentence — significance: notable — desk: events
CADENCE: chronic → floor 8 · live 5 · +9
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a taste for parley taking hold" [J-LEG-2 deferred axis]
1. {settlement}'s diplomatic temper now leans {lean}; kept and broken pacts changed the lesson. `[live, verbatim]` · `requiredSlots: ['settlement','lean']`
2. The treaty table carries {weight} weight in council than it did before. `[live, verbatim]` · `requiredSlots: ['weight']`
3. A generation of agreements has made the court {answer} about another parley. `[live, verbatim]` · `requiredSlots: ['answer']`
4. The town gives a {answer} answer when a legate asks for a hearing. `[live, verbatim]` · `requiredSlots: ['answer']`
5. What diplomacy accomplished has made {settlement} lean {lean} on the next quarrel. `[live, verbatim]` · `requiredSlots: ['settlement','lean']`
6. The council keeps a room set aside for legates, and it has been in use. `requiredSlots: []`
7. Carters off the {route} say this town will talk before it bars a gate. `requiredSlots: ['route']`
8. A generation of parleys sits behind the habit, and the habit is now the shorter argument. `requiredSlots: []`
9. {settlement} carries a {band} appetite for parley; the hall keeps more chairs than it needs. `[merged ← WAR WR-2 v1 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement','band']`
10. Every quarrel goes to a table first, and most of them stay there. `[merged ← WAR WR-2 v2 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
11. The seat has learned that a legate is cheaper than a levy. `[merged ← WAR WR-2 v3 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
12. They talk before they march, which their neighbours read as either wisdom or weakness, according to taste. `[merged ← WAR WR-2 v4 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
13. The town's best rooms are kept for guests it does not like. `[merged ← WAR WR-2 v5 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
14. It has kept {settlement} out of wars it might have won, and the hall has stopped apologising for it. `[merged ← WAR WR-2 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement']`

### disposition_insular_crossed — R2 receipt sentence — significance: notable — desk: events
CADENCE: chronic → floor 8 · live 5 · +9
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a town turning inward" [J-LEG-2 deferred axis]
1. {settlement}'s inward temper now leans {lean}; its outward history changed the lesson. `[live, verbatim]` · `requiredSlots: ['settlement','lean']`
2. The factors of {house} are received {welcome} than they were before. `[live, verbatim]` · `requiredSlots: ['house','welcome']`
3. The roads beyond the walls carry {weight} weight in council than they once did. `[live, verbatim]` · `requiredSlots: ['weight']`
4. The town gives a {answer} answer when outsiders ask it to look beyond itself. `[live, verbatim]` · `requiredSlots: ['answer']`
5. What outside ties accomplished has made {settlement} lean {lean}. `[live, verbatim]` · `requiredSlots: ['settlement','lean']`
6. The gate is barred at the hour it has always been barred, and the hour has been getting earlier. `requiredSlots: []`
7. Factors out of {counterpart} say the town hears them politely and buys nothing. `requiredSlots: ['counterpart']`
8. What the outer roads brought in was weighed against what they carried off, and the weighing settled the temper. `requiredSlots: []`
9. {settlement} has turned {band} inward; the gates close earlier each year. `[merged ← WAR WR-2 v1 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement','band']`
10. The factors of {house} are lodged outside the walls now, courteously and firmly. `[merged ← WAR WR-2 v2 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['house']`
11. The council's answer to every road is that the road can wait. `[merged ← WAR WR-2 v3 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
12. They want nothing from anyone, which is a policy until it is a weakness. `[merged ← WAR WR-2 v4 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
13. The tolls are high and the welcome is thin, and the town calls both prudence. `[merged ← WAR WR-2 v5 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
14. The inn by the gate keeps fewer beds each year and calls the shrinkage demand. `[merged ← WAR WR-2 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

### disposition_reversal — R2 receipt sentence — significance: notable — desk: events
CADENCE: chronic → floor 8 · live 5 · +9
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a town changing its temper" [J-LEG-2 deferred axis]
1. {settlement}'s {aspect} temper crossed its old balance and now leans {lean}. `[live, verbatim]` · `requiredSlots: ['settlement','aspect','lean']`
2. Later outcomes reversed what this court expected from {practice}. `[live, verbatim]` · `requiredSlots: ['practice']`
3. A learned habit is not a ratchet: {settlement} now leans {lean} on {practice}. `[live, verbatim]` · `requiredSlots: ['settlement','lean','practice']`
4. The council changed its mind about {practice}, slowly and on the evidence. `[live, verbatim]` · `requiredSlots: ['practice']`
5. The old lesson no longer holds; {practice} now draws a {answer} answer. `[live, verbatim]` · `requiredSlots: ['practice','answer']`
6. The clerks recopied the standing orders on {practice}, and the new copy does not read like the old one. `requiredSlots: ['practice']`
7. Men who argued one way at the last council argued the other way at this one, and said why. `requiredSlots: []`
8. A turned temper takes a season to be believed and a generation to be forgotten. `requiredSlots: []`
9. What the victories taught {settlement}, the losses have untaught. `[merged ← WAR WR-2 v1 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement']`
10. The same council that voted the levies votes the granaries now. `[merged ← WAR WR-2 v2 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
11. A temper is not a ratchet: {settlement}'s appetite has turned back toward where it began, and reads {band}. `[merged ← WAR WR-2 v3 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement','band']`
12. Men who argued for the war argue for the road, and are not embarrassed. `[merged ← WAR WR-2 v4 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
13. The town changed its mind slowly, the way towns do, and over the same ledgers. `[merged ← WAR WR-2 v5 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
14. Neighbours who learned what to expect of {settlement} will be a season late unlearning it. `[merged ← WAR WR-2 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement']`

### deity_war_pressure — R2 receipt sentence — significance: notable — desk: faith
CADENCE: chronic → floor 8 · live 5 · +9
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a warlike teaching at the temple" [J-LEG-2 deferred axis]
LAW ONE: the rites counsel and the council decides; nothing here says a god acted.
1. {settlement}'s rites of {domain} make a quicker muster easier to defend in council. `[live, verbatim]` · `requiredSlots: ['settlement','domain']`
2. The local rites make a quicker muster easier to defend in council. `[live, verbatim]` · `requiredSlots: []`
3. Voices of restraint find less purchase in the court shaped by this worship. `[live, verbatim]` · `requiredSlots: []`
4. The rites do not order wars; they make restraint harder to argue. `[live, verbatim]` · `requiredSlots: []`
5. Local worship has lowered the court’s bar for arms. `[live, verbatim — note the curly apostrophe in the live string]` · `requiredSlots: []`
6. The {temple} blesses the muster and does not bless the waiting, and the council has noticed which is which. `requiredSlots: ['temple']`
7. It is said in the market that a captain wanting a hearing should ask for it on a feast day. `requiredSlots: []`
8. The observance keeps a calendar with more days for arms in it than its neighbours' calendars hold. `requiredSlots: []`
9. The {temple} of {settlement} keeps a war god's calendar, and the bar for a quarrel sits {band} lower for it. `[merged ← WAR WR-2 v1 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['temple','settlement','band']`
10. The chantry blesses the muster before the harvest, and has for a generation. `[merged ← WAR WR-2 v2 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
11. Priests who speak of restraint find thin congregations here. `[merged ← WAR WR-2 v3 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
12. It is not that the altar orders wars; it is that it has never argued against one. `[merged ← WAR WR-2 v4 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
13. A town takes its temper from whatever it prays over. `[merged ← WAR WR-2 v5 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
14. The {temple}'s great feast falls when the roads dry, which is also when columns move. `[merged ← WAR WR-2 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['temple']`

### deity_peace_pressure — R2 receipt sentence — significance: notable — desk: faith
CADENCE: chronic → floor 8 · live 5 · +9
AUDIENCE: public
ALSO LIVE: whatPhrase subject "the harvest rites counselling peace" [J-LEG-2 deferred axis]
LAW ONE: the rites counsel and the council decides; nothing here says a god acted.
1. {settlement}'s harvest rites leave its court {band} slower to muster. `[live, verbatim]` · `requiredSlots: ['settlement','band']`
2. The local rites make another season easier to defend than another campaign. `[live, verbatim]` · `requiredSlots: []`
3. The court sets the cost of war beside its trade in {good}, a reckoning no captain likes to hear. `[live, verbatim]` · `requiredSlots: ['good']`
4. Local worship has never forbidden war; it has made war look expensive. `[live, verbatim]` · `requiredSlots: []`
5. Where harvest rites shape the court, a grievance is more likely to wait another season. `[live, verbatim]` · `requiredSlots: []`
6. The {temple} keeps a calendar full of sowing days and thin on marching days, and the council keeps the calendar. `requiredSlots: ['temple']`
7. Travellers say the town will hear a grievance out and then ask what it would cost to wait. `requiredSlots: []`
8. Where the harvest rites set the year, a muster called at sowing argues against the whole calendar. `requiredSlots: []`
9. {settlement}'s {temple} keeps the harvest rites, and its court is {band} slower to muster. `[merged ← WAR WR-2 v1 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement','temple','band']`
10. The pews are full at sowing and the drill ground is empty. `[merged ← WAR WR-2 v2 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
11. The chapter house prices a war in seed {good}, which is a price no captain likes to hear. `[merged ← WAR WR-2 v3 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['good']`
12. The altar has never forbidden a war; it has merely made one look expensive. `[merged ← WAR WR-2 v4 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
13. Where the tithe is grain, the answer to a grievance is usually another season. `[merged ← WAR WR-2 v5 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
14. Neighbours have learned they can lose an argument here without losing a season, and they bring more arguments for it. `[merged ← WAR WR-2 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

## §1e — THE LINEAGE POOLS (`lineageReceipt`, WR-3)

### lineage_edge_recorded — R2 receipt sentence — significance: notable — desk: events
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a daughter settlement entered in the books" [J-LEG-2 deferred axis]
1. The steading at {settlement} stands on its own books now, and remembers whose granary fed it. `[live, verbatim]` · `requiredSlots: ['settlement']`
2. {counterpart} seeded it, provisioned it, and has been outgrown by it. `[live, verbatim]` · `requiredSlots: ['counterpart']`
3. What was a satellite is a settlement; the parish register says so, which is what matters later. `[live, verbatim]` · `requiredSlots: []`
4. The daughter house keeps its own reeve and its own quarrel with the tolls. `[live, verbatim]` · `requiredSlots: []`
5. A lineage edge is a small entry in a book and the cause of a great deal. `[live, verbatim]` · `requiredSlots: []`
6. The clerk who made the entry spelled the daughter house's name one way and then the other, and settled on the second. `requiredSlots: []`
7. It is an ordinary line in an ordinary register, and it will be read aloud in a quarrel a generation from now. `requiredSlots: []`
8. Carters out of {counterpart} still call it the new steading, which it has not been for some time. `requiredSlots: ['counterpart']`
9. The founding road still runs between them and is the busiest road either keeps. `[merged ← WAR WR-3 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

### mirror_kinship_bond — R2 receipt sentence — significance: notable — desk: events
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "kinship holding two settlements from war" [J-LEG-2 deferred axis]
1. The same founding that arms a claim binds a peace: {settlement} and {counterpart} read one edge and chose the other sign. `[live, verbatim]` · `requiredSlots: ['settlement','counterpart']`
2. They share a charter and a graveyard; the courts remembered the graveyard. `[live, verbatim]` · `requiredSlots: []`
3. Kin do not sack kin cheaply, and both books said so. `[live, verbatim]` · `requiredSlots: []`
4. The lineage was cited by both sides to opposite ends, and the quieter reading held. `[live, verbatim]` · `requiredSlots: []`
5. The bond cost {settlement} the claim, and the council called it a bargain. `[live, verbatim]` · `requiredSlots: ['settlement']`
6. Both registers open at the same founding entry, and both councils read as far as it and stopped. `requiredSlots: []`
7. The road between {settlement} and {counterpart} carried grain this season where it might have carried columns. `requiredSlots: ['settlement','counterpart']`
8. Nobody made a speech about it. The muster was simply not called. `requiredSlots: []`
9. The two towns keep each other's feast days, which is a compact nobody drafted and nobody signs. `[merged ← WAR WR-3 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

### lineage_claim_suppressed — R2 receipt sentence — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 5 · +8
AUDIENCE: **dm-only** — projected behind includeGroundTruth; a free surface never sees this pool.
ALSO LIVE: whatPhrase subject "a lineage claim refused by its own wagon books" [J-LEG-2 deferred axis]
1. You do not sack the satellite you spent a generation provisioning; the claim scores nothing and the chronicle is named against it. `[live, verbatim]` · `requiredSlots: []`
2. The relationship record contradicts the casus, and the receipt says which entries do it. `[live, verbatim]` · `requiredSlots: []`
3. The court could raise the claim; its own wagon books refuse it. `[live, verbatim]` · `requiredSlots: []`
4. Sustained provisioning stands in the ledger where the grievance would go. `[live, verbatim]` · `requiredSlots: []`
5. Nothing was minted, so nothing decays; this claim waits on a change in the wagon books, not a change of heart. `[live, verbatim]` · `requiredSlots: []`
6. The clerks found the provisioning entries before the court found its grievance. `requiredSlots: []`
7. A claim the wagon books contradict is a claim that stays in the drawer. `requiredSlots: []`
8. Nothing here is denied; it is outweighed by the town's own record of what it sent. `requiredSlots: []`
9. A generation of wagons out of {settlement} is a long argument, and it is still being made every quarter. `[merged ← WAR WR-3 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement']`
10. A claim and a supply line may run to the same place; only one of them scores. `[merged ← WAR WR-3 v7 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
11. To press the claim, {settlement} would have to starve the place first, and the ledger has already done that arithmetic. `[merged ← WAR WR-3 v8 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['settlement']`
12. The drovers who would have to burn that granary have been unloading at it since they were boys. `[merged ← WAR WR-3 v9 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`
13. The clerk who entered the claim entered the season's deliveries, and made no remark on either. `[merged ← WAR WR-3 v10 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: []`

## §1f — THE HOME-FRONT POOLS (`warCostReceipt`, WR-4)

### home_front_hands — R2 receipt sentence — significance: notable — desk: events
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "the muster emptying fields and workshops" [J-LEG-2 deferred axis]
LAW ONE: names on the roll are OUT OF THE WORKSHOP, never dead.
1. {settlement} has sent {band} of its hands to the field, and the work at home has noticed. `[live, verbatim]` · `requiredSlots: ['settlement','band']`
2. The harvest was got in by the old and the young, and got in late. `[live, verbatim]` · `requiredSlots: ['harvestLabor']`
3. The muster took the smiths first, which the town will feel for a generation. `[live, verbatim]` · `requiredSlots: ['smithMuster']`
4. Names that ran the market are on the roll instead of the ledger, {npc} among them. `[live, verbatim]` · `requiredSlots: ['npc']`
5. A town can survive a war; it cannot keep sending its working hands away without paying for it at home. `[live, verbatim]` · `requiredSlots: []`
6. The carts go out short-handed and come back late, and have done since the roll was read. `requiredSlots: ['harvestLabor']`
7. A traveller wanting a smith on this road was sent on to the next valley. `requiredSlots: ['smithMuster']`
8. {settlement} will feel this muster in its workshops long after the war is a date in a book. `requiredSlots: ['settlement']`
9. The apprenticeships went unfilled through the war, and the gap will reach the market a generation from now. `[merged ← WAR WR-4 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['smithMuster']`

### home_front_stores — R2 receipt sentence — significance: notable — desk: events
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "the granaries running lean during war" [J-LEG-2 deferred axis]
1. The granaries of {settlement} hold {band}, and there is another season of war in front of them. `[live, verbatim]` · `requiredSlots: ['settlement','band','granary']`
2. The reeve has begun measuring the seed {good}, which is the last measure before hunger. `[live, verbatim]` · `requiredSlots: ['seedGood']`
3. The war eats first and the town eats after; that order is written in the stores. `[live, verbatim]` · `requiredSlots: []`
4. The campaign continues while the stores remain low. `[live, verbatim]` · `requiredSlots: []`
5. There is bread enough for the season, and the season is not the question. `[live, verbatim]` · `requiredSlots: ['breadSupply']`
6. The reeve carries the granary keys on his own belt now, which he did not last year. `requiredSlots: ['granary']`
7. There is bread, and there is a queue for it, and the queue is the news. `requiredSlots: ['breadSupply']`
8. Last year's store is carrying this year's spring, and it reads {band}. `requiredSlots: ['band']`
9. The bakers have changed the loaf again, and have not been asked to explain it. `[merged ← WAR WR-4 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['breadSupply']`

### home_front_roads — R2 receipt sentence — significance: notable — desk: trade
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "the roads going to ruts during war" [J-LEG-2 deferred axis]
1. {route} has gone to ruts while the levies were away, and the tolls have gone with it. `[live, verbatim]` · `requiredSlots: ['route','tollLoss']`
2. Nobody has cut the causeway brush in a season; the drovers take the long way and charge for it. `[live, verbatim]` · `requiredSlots: ['causewayNeglect']`
3. While the war continues, the road-work goes undone. `[live, verbatim]` · `requiredSlots: []`
4. The bridge at the ford held through the war and has not held since. `[live, verbatim]` · `requiredSlots: ['bridgeDamage']`
5. One of {settlement}'s wartime roads has worsened; the loss is {band} harder to ignore. `[live, verbatim]` · `requiredSlots: ['settlement','band']`
6. The road menders were on the roll before the frost, and the frost did what frost does. `requiredSlots: ['causewayNeglect']`
7. Drovers coming into {settlement} ask which crossing is still good, and the answer keeps changing. `requiredSlots: ['settlement']`
8. A road left untended for a season is a road every carter has to learn again. `requiredSlots: []`
9. Each season {route} goes unmended costs more to mend, and the reeve says so at every sitting. `[merged ← WAR WR-4 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['route','causewayNeglect']`

### home_front_markets — R2 receipt sentence — significance: notable — desk: trade
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a wartime market closing" [J-LEG-2 deferred axis]
1. The factors of {house} no longer come to {settlement}'s staple, and the wharf shows it. `[live, verbatim]` · `requiredSlots: ['house','settlement']`
2. The wharf hands stand about by the middle of the morning, and have done so since the levies went out. `[live, verbatim]` · `requiredSlots: ['wharfLabor']`
3. {good} that moved through this town moves around it now. `[live, verbatim]` · `requiredSlots: ['good']`
4. A recorded market tie has closed while the war continues. `[live, verbatim]` · `requiredSlots: []`
5. The tolls are what they were and there is nothing to toll. `[live, verbatim]` · `requiredSlots: ['tollLoss']`
6. The stalls at the {settlement} staple are set out each market day and taken in unsold. `requiredSlots: ['settlement']`
7. Carters who used to fight for a place on the quay now choose one. `requiredSlots: ['wharfLabor']`
8. What the tolls brought in last season they do not bring in now, and the difference reads {band}. `requiredSlots: ['band','tollLoss']`
9. The carriers have learned another road, and a road is only learned the once. `[merged ← WAR WR-4 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['tollLoss']`

### home_front_institutions — R2 receipt sentence — significance: notable — desk: events
CADENCE: chronic → floor 8 · live 5 · +4
AUDIENCE: public
ALSO LIVE: whatPhrase subject "the courts and temples thinning under war" [J-LEG-2 deferred axis]
1. The assize at {settlement} sits with a clerk and no justice; the court has been hollowed by the war's bill. `[live, verbatim]` · `requiredSlots: ['settlement','courtOffice']`
2. The {temple} keeps its doors and has stopped keeping its school. `[live, verbatim]` · `requiredSlots: ['temple','school']`
3. Institutions need not fall to thin, and thin, and one day fail at the thing they are for. `[live, verbatim]` · `requiredSlots: []`
4. What was a working court is a room with a register in it. `[live, verbatim]` · `requiredSlots: ['courtOffice']`
5. The buildings remain. Their offices cannot do the work they were built to do. `[live, verbatim]` · `requiredSlots: []`
6. The {temple} still rings the hours and has stopped keeping the register. `requiredSlots: ['temple']`
7. Petitions are taken and stacked, and nobody has said they will not be heard. `requiredSlots: []`
8. A traveller with a suit to bring was told to come back after the war. `requiredSlots: ['courtOffice']`
9. The remaining clerk keeps the register out of habit, and is owed a year of wages for it. `[merged ← WAR WR-4 v6 — one-kind-one-pool, 2026-08-03]` · `requiredSlots: ['courtOffice']`

---

# §2 — THE NEWS-SUMMARY POOLS (R3)

Six kinds whose deepest live axis is the `summary` member of a `{headline,
summary, reasons}` triple (`UPSWING_NEWS`, `NPC_GOAL_NEWS`). Variants 1..4 are the
live summary pool verbatim, in live order.

**⚠️ THE SIBLING AXES ARE DEFERRED, NOT DENIED (J-LEG-2).** Each of the four
`UPSWING_NEWS` kinds also ships a `headline` pool and a `reasons` pool;
`npc_goal_culmination` ships a `headline` plus four named reason axes
(`progressReason`, `roleReason`, `conditionDescription`, `causeReason`) and
`npc_goal_rebranch` a `headline` plus two (`contextReason`, `personalityReason`) —
sixteen sibling pools, every one live at four variants and so below the notable
floor of six. Deepening them is the same maintenance under the same amendment and
is priced in the tail's DEFERRED AXES REGISTER. The summary is deepened first
because it is the sentence a reader actually reads.

**⚠️ THE ONE LIVE NUMERIC INTERPOLATION IS QUARANTINED (DEFECT-8).** Of the six
summary pools below, only `reconstruction`'s carries a numeric slot: its four live
variants each interpolate `${x.year}`, which renders digits and therefore violates
the corpus digit law. They are reproduced verbatim because byte-identity outranks
the digit law for an EXISTING string. `boom`, `bust` and `flourishing` carry NO
numeric slot on the summary axis — their digits (`${x.arteries}`) live on the
deferred `reasons` axis. **No variant added below introduces a numeric slot**, and
the appended interp clauses (`{dep}` `{built}` `{graft}`) are carried unchanged so
the added variants are drop-in.

### boom — R3 news summary — significance: notable — desk: trade
CADENCE: notable → floor 6 · live 4 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "flush times" · condition label "Boom" + gloss [J-LEG-1] · headline pool ×4 · reasons pool ×4 [J-LEG-2]
1. Brisk and sustained trade has tipped {settlement} into a boom. Markets swell and coin flows.{dep} `[live, verbatim]`
2. A steady run of brisk trade has tipped {settlement} into a boom. The markets swell and the coin runs freely.{dep} `[live, verbatim]`
3. Trade has come thick and lasting to {settlement}, and it has tipped into a boom. Its markets swell and coin flows.{dep} `[live, verbatim]`
4. Sustained, vigorous trade has carried {settlement} into a boom. Its markets swell and coin moves fast.{dep} `[live, verbatim]`
5. Trade has run heavy into {settlement} season upon season, and the town has tipped into a boom. Coin changes hands faster than the clerks can write it down.{dep}
6. {settlement} has been carried into a boom by trade that would not slacken. The wharf works past dusk and the market has outgrown its bounds.{dep}

### bust — R3 news summary — significance: notable — desk: trade
CADENCE: notable → floor 6 · live 4 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "hard times" · headline pool ×4 · reasons pool ×4 [J-LEG-2]
SLOT NOTE: {reason} maps to the live `${x.cause}` — a recorded cause clause, never free text.
ALSO POOLED: `RECEIPT_POOLS_POPULATIONS.md` (POP-1) carries a pool also named `bust` — the POP-1 ENDINGS TOKEN for a migration rush that failed, a different id space from this live `UPSWING_NEWS` trade-collapse summary. A NAME COLLISION, not a co-owned kind [J-LEG-8]
1. The trade that made {settlement} rich has collapsed because {reason}. The boom curdles into flight and empty stalls. `[live, verbatim]`
2. The commerce that made {settlement} rich has fallen apart because {reason}. The boom sours into flight and shuttered stalls. `[live, verbatim]`
3. What made {settlement} rich has come undone because {reason}. The boom curdles into departures and empty market rows. `[live, verbatim]`
4. The trade that lifted {settlement} has broken because {reason}. The boom turns to flight and abandoned stalls. `[live, verbatim]`
5. The trade that carried {settlement} has failed because {reason}. The stalls stand empty and the people who filled them have gone looking elsewhere.
6. What made {settlement} rich has stopped because {reason}. The boom has become departures, shuttered rows, and a market that opens out of habit.

### flourishing — R3 news summary — significance: notable — desk: trade
CADENCE: notable → floor 6 · live 4 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a golden age" · condition label "Flourishing" + gloss [J-LEG-1] · headline pool ×4 · reasons pool ×4 [J-LEG-2]
1. A long peace and steady rule have made {settlement} culturally fertile. Tolerance broadens and the temples keep warm.{built} `[live, verbatim]`
2. Under a long peace and a steady hand, {settlement} has grown culturally fertile. Tolerance widens and the temples stay warm.{built} `[live, verbatim]`
3. Years of peace and steady rule have left {settlement} culturally fertile. Its tolerance broadens and its temples keep warm.{built} `[live, verbatim]`
4. A lasting peace and settled rule have made {settlement} fertile in its culture. Tolerance broadens, and the temples keep warm.{built} `[live, verbatim]`
5. Peace held long enough and rule sat steady enough that {settlement} has come into flower. Strangers are made welcome and the temples keep their doors open late.{built}
6. {settlement} has grown fertile in its culture under a long quiet and a settled hand. What it makes, it has begun making for its own sake.{built}

### reconstruction — R3 news summary — significance: notable — desk: trade
CADENCE: notable → floor 6 · live 4 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a town rebuilding" · condition label "Reconstruction" + gloss [J-LEG-1] · headline pool ×4 · reasons pool ×4 [J-LEG-2]
1. {settlement} has finished rebuilding in the year {year}, its wounds closed by its own hands and its allies'.{built}{graft} `[live, verbatim — {year} is DEFECT-8]`
2. By the year {year} {settlement} has finished its rebuilding, the damage mended by its own labour and its allies' aid.{built}{graft} `[live, verbatim — {year} is DEFECT-8]`
3. {settlement} has closed its wounds at last, the rebuilding done in the year {year} by its own hands and its allies'.{built}{graft} `[live, verbatim — {year} is DEFECT-8]`
4. The rebuilding of {settlement} is complete in the year {year}. Its own people and its allies together have made it whole.{built}{graft} `[live, verbatim — {year} is DEFECT-8]`
5. {settlement} is whole again and the rebuilding account is closed. The repair was carried by the town's own labour, with what its allies advanced set against it.{built}{graft}
6. The scaffolds are down in {settlement}. What the calamity took has been put back by the town's own hands and its allies' repaid stake.{built}{graft}

### npc_goal_culmination — R3 news summary — significance: notable — desk: events
CADENCE: notable → floor 6 · live 4 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a long design come to a head" · headline · progressReason · roleReason · conditionDescription · causeReason pools, ×4 each [J-LEG-2]
LAW ONE: a culmination changes a standing, never a fate.
1. {npc} has worked toward "{goal}" for a long while, and now seizes it. `[live, verbatim]`
2. After a long pursuit of "{goal}", {npc} has at last made it real. `[live, verbatim]`
3. {npc}'s patient work toward "{goal}" has paid off; the prize is now in hand. `[live, verbatim]`
4. The long design to "{goal}" has borne fruit for {npc}. `[live, verbatim]`
5. {npc} has held to "{goal}" through a long run of setbacks and has now closed a hand on it.
6. The work {npc} has been doing toward "{goal}" is finished, and the town will learn shortly what that means for it.

### npc_goal_rebranch — R3 news summary — significance: notable — desk: events
CADENCE: notable → floor 6 · live 4 · +2
AUDIENCE: public
ALSO LIVE: whatPhrase subject "a change of ambitions" · headline · contextReason · personalityReason pools, ×4 each [J-LEG-2]
1. {npc}'s goals shift because the settlement context changed. `[live, verbatim]`
2. A changed settlement has forced {npc} to reconsider what comes next. `[live, verbatim]`
3. {npc} keeps the same character, but new circumstances now demand different aims. `[live, verbatim]`
4. New conditions in the settlement have turned {npc}'s effort toward another end. `[live, verbatim]`
5. {npc} has set the old aim down; the settlement is not the place it was when that aim was chosen.
6. What {npc} wants has moved with the town, and the old design has been left quietly where it stood.

---
# §3 — THE AUTHORED SUBJECT-PHRASE POOLS (R1)

Sixty-three kinds that already carry an AUTHORED `WHAT_PHRASES` row. Variant 1 is
that row, verbatim. Every variant is a lowercase noun phrase with no terminal stop,
and every one must read in BOTH live frames — capitalized-first and after "word
of …". **These pools take no slots**: the frame supplies the address chain.

## §3a — THE WAR DESK

### army_homecoming — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. soldiers returning home `[live, verbatim]`
2. the columns coming back down the road
3. a muster roll read off at the gate
4. beds wanted in every house on the lane
5. the watch standing down for the first time since the spring
6. carters passing a column headed the other way, homeward

### blockade_declared — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a harbour sealed off `[live, verbatim]`
2. hulls waiting outside the mole with nowhere to put in
3. an order posted at the harbour office
4. the price of everything that comes by water beginning to move
5. a quay with nothing on it but gulls
6. shipmasters turning back at the roads and asking why

### blockade_lifted — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a harbour opened again `[live, verbatim]`
2. sails standing in past the mole again
3. the harbour order struck from the book
4. a season's worth of cargo coming in all at once
5. a quay crowded enough to quarrel over
6. shipmasters on the coast road spreading word that the way is clear

### conquest — R1 subject phrase — significance: major — desk: war
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
1. a conquest `[live, verbatim]`
2. a town taken and held
3. new arms hung over an old gate
4. one court's writ running where another's did

### field_battle — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a battle in the field `[live, verbatim]`
2. hosts meeting on open ground
3. a day's fighting entered in the war ledger
4. the ground beyond the meadows left to the crows
5. a long baggage train going out and a shorter one coming back
6. travellers turned back from the road where the armies stood

### infowar_lie_exposed — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a court caught in its own lie `[live, verbatim]`
2. a story falling apart in the telling
3. a proclamation that no longer matches the record
4. men asking what else was said that season
5. a court that has stopped repeating something
6. word on the road that the tale was made up at the top

### infowar_spy_exposed — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
LAW ONE: an exposed agent is TAKEN UP, never a resolved fate.
1. paid eyes found among us `[live, verbatim]`
2. a familiar face taken up at the gate
3. a name entered against another court's account
4. everyone recalling who else that man drank with
5. a clerk who is suddenly not at his desk
6. travellers warned to keep their business to themselves here

### intervention — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a foreign hand at work `[live, verbatim]`
2. outside men in the square who answer to nobody local
3. a patron's writ arriving before his soldiers
4. a local dispute with a distant court's interest in it
5. help nobody here asked for
6. word on the road of a patron taking sides

### intervention_clash — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. rival patrons come to blows `[live, verbatim]`
2. other people's soldiers fighting in our fields
3. rival writs claiming the same ground
4. a local quarrel with foreign banners on both sides
5. a war nobody here declared
6. travellers counting strange colours on the road

### momentum_climb_down — R1 subject phrase — significance: notable — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a proud course reversed `[live, verbatim]`
2. a council unsaying what it said last season
3. an order withdrawn before it was carried out
4. a course set down quietly and not spoken of again
5. what a court does when the cost is finally written out
6. word on the road that the great plan has been dropped
7. a proclamation taken down from the assize door
8. a hard winter's arithmetic reaching the council chamber

### occupation_lifted — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Occupation lifted" + gloss [J-LEG-1 — names, not tellings]
1. an occupation ended `[live, verbatim]`
2. a garrison marching out of a town it did not come from
3. the town's own seal on its own orders again
4. a settlement finding out what it still owns
5. a gate that opens on its own hinges again
6. travellers no longer stopped at the walls

### occupation_vassalized — R1 subject phrase — significance: major — desk: war
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
1. a town brought to heel `[live, verbatim]`
2. a court taking its orders from another court's clerks
3. tribute added to everything the market sells
4. a seal that still says the old name over a hand that is not the old hand

## §3b — THE FAITH DESK
LAW ONE governs this whole section: temples, chapters, and believers act; the god never does.

### belief_misjudgment — R1 subject phrase — significance: notable — desk: faith
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
BELIEF ATTRIBUTION: every variant marks the reading as a reading.
1. a dangerous misjudgement `[live, verbatim]`
2. a court acting on what it believed rather than on what was so
3. a reading of a neighbour that the record does not support
4. a decision the council will be asked about later
5. men who were certain, and were not right
6. word travelling well ahead of the truth of it

### faith_foothold_recruited — R1 subject phrase — significance: notable — desk: faith
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a new faith taking root `[live, verbatim]`
2. a new congregation meeting where there was none
3. a chapter house entered in the parish register
4. a doorway with fresh marks cut over it
5. an observance the town will have to make room for
6. preachers on the road finding listeners here
7. a first festival kept in a season that had none
8. one more calendar for the clerks to keep track of

### faith_pact_formed — R1 subject phrase — significance: notable — desk: faith
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a pact sworn between faiths `[live, verbatim]`
2. chapter houses agreeing on a shared calendar
3. an accord between observances entered in both registers
4. a quarrel taken off the street and into a vestry
5. rites that used to be kept on opposite days
6. travellers reporting the temples on speaking terms

### pantheon_ascendancy — R1 subject phrase — significance: major — desk: faith
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
1. a faith ascendant `[live, verbatim]`
2. an observance the council now schedules around
3. offerings coming in from well beyond the walls
4. a chapter house that has had to be enlarged

### pantheon_twilight — R1 subject phrase — significance: major — desk: faith
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
1. a faith in twilight `[live, verbatim]`
2. an observance kept by fewer each year
3. a chapter house with its roof unmended
4. a calendar the council no longer schedules around

## §3c — THE TRADE DESK

### diplomacy — R1 subject phrase — significance: notable — desk: trade
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. envoys at parley `[live, verbatim]`
2. legates lodged at the town's expense
3. terms being read across a table
4. an accord being copied fair for both seals
5. what happens instead of a muster
6. travellers passing a legate's escort on the road

### export_market_loss — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. lost markets `[live, verbatim]`
2. buyers who used to come and do not
3. a market tie struck from the book
4. goods stacking up with nowhere to go
5. a staple that trades in its own town only
6. carters told there is nothing to carry this way
7. a warehouse that fills instead of empties
8. a season's making with no season's buying behind it

### flow_migration — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. people on the move `[live, verbatim]`
2. carts on the road with everything a house holds
3. arrivals entered at the gate faster than the clerk can write
4. villages that were there last year and are thinner now
5. a road busier than the market
6. travellers sharing the verge with families
7. more feet on the road than the season usually brings
8. a child asleep on a load of bedding

### flow_trade_scarcity — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. goods grown scarce `[live, verbatim]`
2. stalls with gaps where the goods should be
3. a staple listed short in the market book
4. prices climbing because there is nothing to buy
5. plenty of coin and little to spend it on
6. carters arriving light and leaving lighter
7. a shop keeping its shutters half up
8. a lean run in a season that is usually easy

### generosity_credit_default — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a debt gone unpaid `[live, verbatim]`
2. a creditor at the door with a writ
3. an obligation left open in both books
4. credit that will cost more here from now on
5. a promise kept only in the writing
6. factors comparing notes about who pays
7. a tally stick nobody wants to split
8. a term that came due and went past

### generosity_purchase — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a great purchase made `[live, verbatim]`
2. a bargain the whole market stopped to watch
3. a sale entered against a name everybody knows
4. coin leaving one town's coffers for another's
5. more paid than the thing is worth, and paid gladly
6. carters hired for a load that will take all week
7. word on the road of a court buying up a season's stock
8. a purchase made before the price could move again

### generosity_trade_overture — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. an offer of trade `[live, verbatim]`
2. a factor sent with terms and no army
3. an offer entered in the book before it is answered
4. a door held open toward a town that may not want it
5. an offer, which is cheaper than a quarrel
6. a legate's cart on the road carrying samples
7. terms proposed at the turn of the trading season
8. word that the neighbours are ready to deal

### harvest — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. the harvest `[live, verbatim]`
2. the fields coming in
3. the tithe barn filling
4. every hand in the town out in the rows
5. what the whole year will be judged on
6. carts on every lane between dawn and dark
7. the one stretch of the year nobody argues about the weather
8. the reeve counting sheaves against last year's

### hungry_gap — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. the lean season `[live, verbatim]`
2. the last of the stores set against the first of the growing
3. a granary measured more often than it is opened
4. thin soup and short tempers
5. the weeks nobody names and everybody counts
6. travellers advised to carry their own bread through here
7. seed grain looked at longer than it should be
8. a season that decides how many are here at the next one

### import_shortage — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a shortage of goods `[live, verbatim]`
2. a market with more sellers than stock
3. a supply line entered short in the ledger
4. craftsmen idle for want of material
5. a town discovering what it does not make itself
6. carters arriving empty from the usual direction
7. a smith rationing his own charcoal
8. a shortfall that came with the season and has outstayed it

### institution_build — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a great work underway `[live, verbatim]`
2. scaffolds up over a new roofline
3. a work entered against the town's own account
4. masons wanted, and paid
5. something the town will still have in a generation
6. travellers marking the new stone from the road
7. a summer of carting and cutting
8. a hole in the ground that everybody has an opinion about

### institution_closure — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a hall shuttered `[live, verbatim]`
2. a door locked that used to stand open
3. an office struck off the town's rolls
4. business that has to go somewhere else now
5. a building that is still there and no longer anything
6. travellers sent on to the next town for it
7. a clerk carrying his own box out
8. a hall that did not open again after the winter

### institution_founding — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. something new founded `[live, verbatim]`
2. a charter read out in the square
3. a new office entered on the town's rolls
4. work that will be somebody's living for a generation
5. a sign going up over a door
6. travellers told there is somewhere to go for it now
7. a beginning the clerks will date from this year
8. one more roof for the town to keep on

### intel_transfer — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. word passing quietly between courts `[live, verbatim]`
2. a rider arriving after dark and gone before light
3. an obligation entered where no goods moved
4. one court knowing what another meant it not to know
5. a gift that weighs nothing and costs a great deal
6. travellers who turn out to have been carrying more than letters
7. a favour that will be called in later
8. word going where the roads say it should not

### migration_flight — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. families taking to the road `[live, verbatim]`
2. houses left with the doors standing open
3. names coming off one gate roll and onto another
4. a column that will be somebody else's business by winter
5. what people do before they are asked to
6. a verge lined with folk resting their loads
7. a hearth left cold in a cold season
8. more leaving than the town can afford to lose

### migration_pressure — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
BELIEF ATTRIBUTION: this kind is the BUILDING of a departure, read from talk as much as from carts.
1. people on the move `[live, verbatim]`
2. talk in the lanes about where else there is to go
3. more requests to leave than the clerk has taken in a year
4. families weighing what they can carry
5. a road that is about to get busier
6. travellers asked, over and over, what it is like where they came from
7. a spring in which nobody is planting as much
8. a town that has begun to think of itself as somewhere to leave

### population_emigration — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. families leaving `[live, verbatim]`
2. carts going out that do not come back
3. names struck from the town roll
4. work going unclaimed for want of hands
5. a lane with more empty houses than full ones
6. travellers passing whole households headed the other way
7. a departure season that has not ended with the season
8. fewer at the market, and nobody saying why

## §3d — THE EVENTS DESK

### assize_verdict — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a judgement handed down at the assize `[live, verbatim]`
2. a case decided and read out
3. a ruling entered in the assize book
4. a matter that will not be raised again
5. a crowd at the court door that came for the reading
6. travellers waiting on the outcome before they move on

### authority_instability — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a shaken authority `[live, verbatim]`
2. orders given that are not quite obeyed
3. a seat whose writ is being tested
4. men waiting to see who is answered before they answer
5. a council that meets more often and decides less
6. travellers advised to ask twice who is in charge
7. a proclamation nobody has taken down and nobody is reading
8. a winter in which the usual arrangements stopped being usual

### cause_lifecycle — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. shifting fortunes `[live, verbatim]`
2. a cause that has begun to lose its people
3. a movement entered, revised, and entered again
4. what a town believes in changing shape
5. yesterday's certainty, mildly held
6. travellers finding a different argument than last time
7. a banner that has not been carried since spring
8. a season in which the loud thing went quiet

### commons_gathering — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_POPULATIONS.md` (POP-2) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. the commons gathered in the square `[live, verbatim]`
2. a crowd that came without being called
3. a gathering the clerks have started counting
4. voices the council will have to answer
5. more people in the square than at market
6. travellers unable to get through the middle of the town

### commons_petition — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_POPULATIONS.md` (POP-2) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. a petition raised by the common folk `[live, verbatim]`
2. a paper carried from door to door
3. a petition entered for the next sitting
4. a demand the seat will have to hear or refuse
5. names in every hand there is, and some in none
6. travellers asked to make their mark on the way through
7. a request put politely, and put again
8. a winter's grievance arriving at the spring session

### commons_riot — R1 subject phrase — significance: major — desk: events
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_POPULATIONS.md` (POP-2) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. the streets risen in a riot-band `[live, verbatim]`
2. a crowd that stopped asking
3. shutters up on every street off the square
4. a night the watch could not hold

### coup_succeeded — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
LAW ONE: a seizure empties a seat; it never resolves a person.
1. a seizure of power `[live, verbatim]`
2. new men in the council chamber by morning
3. a seat changed hands without a vote
4. orders arriving under a different seal
5. the same offices, answering to somebody else
6. travellers hailed at the gate by men who were not there last season

### coup_suppressed — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Coup suppressed" + gloss [J-LEG-1 — names, not tellings]
1. an uprising put down `[live, verbatim]`
2. a rising that did not last the night
3. names taken and entered against the seat
4. loyalty being asked for in writing
5. a council very sure of itself this week
6. travellers questioned harder than usual at the gate

### criminal_pressure — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a rise in lawlessness `[live, verbatim]`
2. locks bought that were never wanted before
3. more matters brought to the watch than the watch can take
4. business done earlier in the day than it used to be
5. a town that has started walking home in company
6. travellers warned off certain lanes after dark
7. a watch roster with gaps in it
8. a winter in which the takings got worse each month

### faction_capture — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a faction seizing control `[live, verbatim]`
2. one interest holding every seat that matters
3. a body whose members all answer the same way
4. decisions arriving already made
5. a council with nothing left to argue about
6. travellers told which house to approach for anything

### faction_exhaustion — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_INTERIOR.md` (INT-8) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. a faction spent and failing `[live, verbatim]`
2. a hall that used to be full at meetings
3. dues unpaid and rolls unrenewed
4. an interest that will not be able to answer the next call
5. a banner still up over an empty room
6. travellers finding nobody left to speak for it
7. old men keeping something going out of habit
8. a winter that finished what the year had started

### faction_government_challenge — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_INTERIOR.md` (INT-8) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. a challenge to those in power `[live, verbatim]`
2. an interest putting its claim to the seat's face
3. a challenge entered and dated
4. a council that has to answer or be seen not to
5. a question asked out loud that was asked quietly for years
6. travellers advised to wait and see how it lands

### faction_rival_power_contest — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_INTERIOR.md` (INT-8) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. a contest between rival powers `[live, verbatim]`
2. rival houses bidding for the same room
3. a contest recorded with neither side conceding
4. every appointment turned into a battle
5. a town whose business waits on somebody else's quarrel
6. travellers asked whose man they are before anything else

### generosity_refuge — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. refuge given to the displaced `[live, verbatim]`
2. strangers billeted in the outbuildings
3. arrivals entered and fed at the town's cost
4. mouths the town will still be feeding at winter
5. room made where there was not room
6. travellers directed here because here takes people
7. a hall cleared of its tables for beds
8. a door left open through a hard season

### generosity_refusal — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. aid turned away `[live, verbatim]`
2. carts sent back the way they came
3. aid asked for, entered, and not granted
4. a neighbour who will remember this
5. a very reasonable refusal
6. travellers told there is nothing to spare here
7. a gate that stayed shut on a bad day
8. a winter's decision the spring will be asked about

### generosity_relief — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. aid sent to the stricken `[live, verbatim]`
2. wagons going out to somewhere worse off
3. stores signed away that the town may want back
4. a stock given away that may be wanted here
5. help sent before it was asked for
6. travellers passing a laden column headed the wrong way for trade
7. a granary opened for somebody else's town
8. a hard season answered out of a barely easier one

### hierarchy_cascade — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. an upheaval in the ranks `[live, verbatim]`
2. everybody below a vacancy moving up a place
3. new faces where the old ones sat
4. a chain of changes out of one departure
5. a great deal of promotion and no new posts
6. travellers unsure which of them to ask for now

### information_shock — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
BELIEF ATTRIBUTION: news is what arrived, not what is so.
1. unsettling news `[live, verbatim]`
2. word arriving that nobody was ready for
3. a report entered before anyone could confirm it
4. a market that moved before the council did
5. news everybody repeats and nobody has checked
6. riders coming in ahead of the ordinary post
7. a crowd at the assize door reading the same sheet
8. a week in which nothing else was talked about

### moral_reckoning — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a reckoning `[live, verbatim]`
2. an old wrong finally being answered for
3. a matter reopened in the record
4. a town deciding what it will admit to
5. a question nobody wanted asked, asked
6. travellers finding the town short-tempered about its own history

### npc_contest — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. a rivalry over the same ambition `[live, verbatim]`
2. rival names after the same prize
3. a contest the record now carries under both
4. every favour in town suddenly worth asking for
5. a friendship that has stopped being one
6. travellers told to choose a side or say nothing

### npc_growth — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a change in a leader's temper `[live, verbatim]`
2. a familiar hand doing an unfamiliar thing
3. a temper the record has begun to note
4. what the next hard decision will be made by
5. the same person, weathered
6. travellers greeted by the same name in a different humour
7. a habit at council that was not there before
8. a season that left its mark on somebody who matters

### npc_ladder — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a change in who holds rank within a faction `[live, verbatim]`
2. a new order of precedence at the table
3. rank entered afresh on the house roll
4. who has to be asked first, changed
5. the same faces in different chairs
6. travellers directed to a different door than before
7. a name moved up the list without a word said
8. a settling everybody saw coming since spring

### npc_support — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a cause bound to a patron's `[live, verbatim]`
2. one name standing behind another's work
3. a sponsorship the record ties to two names
4. a design that now has money behind it
5. a cause that has acquired a bill
6. travellers told whose interest it really is
7. a house sending its own men to somebody else's business
8. an arrangement made at the turn of the year and honoured since

### party_stressor_residual — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. lingering troubles `[live, verbatim]`
2. the part of it that did not go away
3. a matter left open on the rolls
4. something that will make the next trouble worse
5. an ending that did not quite end
6. travellers finding the town still careful about it
7. a repair nobody has got round to
8. a season on from the worst of it, and still there

### plague_arrival — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
LAW ONE: sickness spreads; no named person's fate is resolved.
1. a sickness spreading `[live, verbatim]`
2. houses marked and shut
3. the first cases entered in the parish book
4. a market that will empty before the week is out
5. a season nobody here will need reminding of
6. travellers turned back short of the walls

### protection_gap — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. defences grown thin `[live, verbatim]`
2. a wall with nobody on it
3. a watch roster short of names
4. a town that would not stop much
5. gates shut out of habit rather than strength
6. travellers coming and going without being asked anything
7. a tower with its stair unsafe
8. a winter watch kept by too few

### queue_refused — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a petition denied `[live, verbatim]`
2. a matter heard and set aside
3. a request entered and refused
4. a party that will find another way to ask
5. a very courteous nothing
6. travellers told the council is not taking that today
7. a paper handed back across the table
8. a sitting that ended the way the last one did

### realm_verb_refused — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. a decree set aside `[live, verbatim]`
2. an order that was not carried out
3. a decree entered and then struck
4. a seat that has learned the limit of its writ
5. a command everybody agreed with and nobody obeyed
6. travellers finding the old arrangement still in force
7. a proclamation still on the door with nothing behind it
8. a decision unmade before the season turned

## §3e — THE DIVINATION DESK

### conflict_pressure — R1 subject phrase — significance: routine — desk: divination
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
BELIEF ATTRIBUTION: a forecast token. Every variant reads as what is FEARED or SEEN, never as a war declared.
1. the drums of war `[live, verbatim]`
2. talk in the lanes of a muster that has not been called
3. a quarrel the record shows worsening each season
4. what usually comes before a levy
5. neighbours who have stopped visiting
6. travellers reporting armed men on both sides of the border
7. a watch that has begun drilling in daylight
8. a spring in which nobody expects a quiet summer

---
# §4 — THE FALLBACK-VOICED SUBJECT-PHRASE POOLS (R1)

**THE FINDING THIS SECTION RECORDS.** One hundred and seven of the two hundred
below-floor legacy tokens have **no authored voice at all**. They are not in
`WHAT_PHRASES`; their live subject phrase is what `whatPhrase()` COMPUTES —
`WHAT_STRIP_PREFIX` eats a leading engine prefix and the rest is de-underscored.
That is why the spine says "today largely single-voiced": for these it is worse
than single-voiced, it is unvoiced. A reader today can be told, in the flagship
fiction surface, of *"word of realm verb force found steading"*.

**J-LEG-4 (RULING, vetoable) — VARIANT 1 STAYS THE FALLBACK, AND THE DEFECT IS
RECORDED SEPARATELY.** The byte-identity clause is absolute: variant 1 of every
pool below is the string `whatPhrase()` returns TODAY, marked `[fallback, live —
byte-identity anchor]`. Wiring the pool with the selector dark therefore remains
provably byte-identical. But TWELVE of these fallbacks are not merely plain, they
are **mutilated** — the strip regex ate the meaningful half of the token, so
`coup_detat` renders as *"detat"* and `institution_capture` as *"capture"* (one
under DEFECT-1, eight under DEFECT-2, three under DEFECT-3; each is tagged
`⚠️ MUTILATED` inline, and the twelve inline tags are the whole list).
Retiring a mutilated variant 1 is a second, larger prose shift with its own golden,
and it is NOT bundled into the pool wiring. Each is tagged inline and listed as
DEFECT-1 / DEFECT-2 / DEFECT-3 at the tail, with the recommended repair, for the
owner to authorise or veto on its own merits.

## §4a — THE WAR DESK

### alliance_burden — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: condition label "Alliance burden" + gloss [J-LEG-1]
1. alliance burden `[fallback, live — byte-identity anchor]`
2. a friendship that costs more than it returns
3. relief columns going out and nothing coming back
4. a debit the town's own books carry for a friend's sake
5. carts sent to an ally while the market here goes short
6. help given so often it has become an expectation
7. travellers passing this town's grain on somebody else's road
8. a winter spent keeping a neighbour standing

### ally_burden — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. ally burden `[fallback, live — byte-identity anchor]`
2. an ally who is more weight than shield
3. calls answered until the answering shows
4. an obligation the ledger keeps renewing
5. men and grain going wherever the compact says
6. a compact that has been all giving
7. travellers finding this town's soldiers billeted elsewhere
8. a season of somebody else's war paid for here

### army_deployed — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Army deployed" + gloss [J-LEG-1]
1. army deployed `[fallback, live — byte-identity anchor]`
2. the host gone and the walls left to the watch
3. a garrison entered as absent
4. a town that would be slow to defend itself
5. an empty muster field in the middle of the year
6. travellers finding the gate kept by old men

### casus_declared — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. casus declared `[fallback, live — byte-identity anchor]`
2. a reason for war read out and entered
3. a grievance put in writing at last
4. what a court says before it calls a levy
5. an old quarrel given a date
6. travellers repeating a reason for war they heard read out

### cold_war — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. cold war `[fallback, live — byte-identity anchor]`
2. neighbours not at war and not at ease
3. an edge the record keeps open and cold
4. borders watched from both sides and crossed by neither army
5. courtesies exchanged and nothing else
6. a quarrel kept just below the muster
7. travellers questioned at both ends of the same road
8. a winter of waiting on somebody else's temper

### cold_war_sanctions — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: condition label "Cold-war sanctions" + gloss [J-LEG-1]
1. cold war sanctions `[fallback, live — byte-identity anchor]`
2. inspections at a gate that used to wave carts through
3. a trade permitted on paper and obstructed in practice
4. tolls that have grown teeth
5. goods arriving a season late and costing accordingly
6. a quarrel being fought with clerks
7. carters allowing an extra day for the crossing
8. a market squeezed without a shot fired

### cold_war_supply_sanctions — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. cold war supply sanctions `[fallback, live — byte-identity anchor]`
2. a neighbour's suppliers being leaned on
3. contracts entered and then quietly not renewed
4. the roads to one town's workshops going quiet
5. a pressure applied where nobody can point to the hand
6. factors told which house they may not deal with
7. travellers noticing which wagons no longer run
8. a season in which the pinch was arranged, not suffered

### convoy_ordered — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. convoy ordered `[fallback, live — byte-identity anchor]`
2. cargo sailing under escort
3. a sailing entered with soldiers on the manifest
4. hulls that will not go out alone any more
5. protection costing as much as the cargo
6. a quay full of ships waiting on a warship
7. shipmasters comparing the escort's schedule
8. a season in which nothing crosses the water unaccompanied

### hostile — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. hostile `[fallback, live — byte-identity anchor]`
2. an open enemy across the border
3. an edge the record carries as hostile
4. gates barred against a named neighbour
5. trade that has to go the long way or not at all
6. neighbours with nothing left to say to each other
7. travellers advised not to mention where they came from
8. a border that is a front

### hostile_raid — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. hostile raid `[fallback, live — byte-identity anchor]`
2. outlying farms burned and left
3. a raid entered against a named neighbour
4. a harvest lost to somebody else's riders
5. smoke on the horizon and no army near it
6. a hamlet the town will have to feed this winter
7. carters keeping to the main road after dark
8. a raiding season that came early

### intercept_ordered — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
BELIEF ATTRIBUTION: the target column is BELIEVED; no variant asserts it is on the road.
1. intercept ordered `[fallback, live — byte-identity anchor]`
2. a column sent to meet a column that may not be coming
3. an order entered against a believed march
4. men waiting on a road for something they have been told about
5. a strike made on word rather than on sight
6. an ambush laid where the rumour says
7. travellers sent the long way round by men who will not say why
8. a season's soldiering spent on a guess

### intervention_ordered — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. intervention ordered `[fallback, live — byte-identity anchor]`
2. a patron sending men into somebody else's quarrel
3. an intervention entered under a patron's seal
4. soldiers on the road who answer to a distant court
5. help arriving that nobody local asked for
6. a local matter about to become a regional one
7. travellers passing foreign columns headed inland
8. an order given far away and felt here

### military_protection — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. military protection `[fallback, live — byte-identity anchor]`
2. a garrison kept for somebody else's walls
3. an obligation to defend, written down and dated
4. soldiers here who are not from here
5. safety bought at a standing price
6. a shield held over a town that cannot hold its own
7. travellers noticing whose colours the watch wears
8. an arrangement everybody has stopped remarking on

### occupation — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: stressor catalog label "Occupation pressure" [J-LEG-1]
1. occupation `[fallback, live — byte-identity anchor]`
2. a town held by men who came from elsewhere
3. a garrison entered where the council used to sit
4. orders posted under a foreign seal
5. a curfew nobody voted for
6. a market that trades under watch
7. travellers stopped and asked their business at the gate
8. a year of being somebody else's

### occupation_burden — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: condition label "Occupation burden" + gloss [J-LEG-1]
1. burden `[fallback, live — byte-identity anchor · ⚠️ MUTILATED, DEFECT-3]`
2. holding a town costing more than taking it did
3. garrisons entered against the occupier's own strength
4. men tied down where there is no battle
5. an army that cannot be anywhere else
6. a conquest that has to be fed and paid for
7. travellers counting the same colours in every square
8. a season of keeping what was won

### occupation_burden_cleared — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. burden cleared `[fallback, live — byte-identity anchor · ⚠️ MUTILATED, DEFECT-3]`
2. a garrison called back off a held town
3. an obligation struck from the occupier's rolls
4. men free to be somewhere else at last
5. a strength that is a strength again
6. a hold given up rather than lost
7. travellers finding the road unwatched for the first time in years
8. a weight put down at the turn of the season

### occupation_resistance — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: condition label "Occupation resistance" + gloss [J-LEG-1]
1. resistance `[fallback, live — byte-identity anchor · ⚠️ MUTILATED, DEFECT-3]`
2. a held town that will not be quiet
3. sabotage entered in the garrison's own record
4. orders posted at night and torn down by morning
5. a curfew broken more often than it is kept
6. a town obeying slowly and on purpose
7. travellers warned to be indoors after dark
8. a winter in which nothing the garrison did stuck

### peace_sued — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. peace sued `[fallback, live — byte-identity anchor]`
2. a court asking for terms
3. an offer of peace entered and dated
4. what a seat does when a war has cost more than it can carry
5. a legate sent with terms instead of a levy
6. travellers carrying word that terms have been asked for

### rebellion_vassal — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. rebellion vassal `[fallback, live — byte-identity anchor]`
2. a client town refusing its overlord
3. a rising entered against the tribute rolls
4. a tribute that has stopped arriving
5. an arrangement that has stopped being agreed to
6. travellers finding the overlord's men turned back at the gate

### reinforcement_cost — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: condition label "Reinforcement burden" + gloss [J-LEG-1]
1. reinforcement cost `[fallback, live — byte-identity anchor]`
2. the home bleeding men and grain to keep a field army standing
3. a levy entered on top of a levy
4. what it costs to keep an army where it already is
5. carts going to the front that will not come back loaded
6. a war paid for in instalments
7. travellers passing supply columns headed one way only
8. a season of feeding an army at a distance

### reinforcement_ordered — R1 subject phrase — significance: routine — desk: war
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. reinforcement ordered `[fallback, live — byte-identity anchor]`
2. a relief column marching for an ally under siege
3. a march entered under the treaty's name
4. men sent to hold somebody else's wall
5. help despatched before anyone knows whether it can arrive in time
6. a column on the road with a long way to go
7. travellers giving way to soldiers headed for the fighting
8. a compact answered with feet

### realm_verb_declare_blockade — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb declare blockade `[fallback, live — byte-identity anchor]`
2. a decree closing a harbour
3. a port closed in writing before it is closed by hulls
4. an order that will be felt on every quay
5. a decision taken far from the water it closes
6. shipmasters learning at the roads that the port is shut

### realm_verb_declare_casus — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb declare casus `[fallback, live — byte-identity anchor]`
2. a decree naming a reason for war
3. a cause entered by the realm's own hand
4. a grievance made official
5. what is read out before the levies are called
6. travellers carrying word that a cause has been declared from above

### realm_verb_intercept — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
BELIEF ATTRIBUTION: the column is BELIEVED.
1. realm verb intercept `[fallback, live — byte-identity anchor]`
2. a decree sending men against a believed column
3. a road watched on instructions carried from far off
4. an order given on word rather than on sight
5. a strike arranged before anybody has seen the target
6. travellers turned off the road by men acting under a decree

### realm_verb_order_convoy — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb order convoy `[fallback, live — byte-identity anchor]`
2. a decree putting escorts on the sea lanes
3. sailings arranged by a court that owns no cargo
4. warships assigned to merchant hulls
5. protection made a matter of decree rather than of price
6. shipmasters told when they may sail and with whom

### realm_verb_order_intervention — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb order intervention `[fallback, live — byte-identity anchor]`
2. a decree sending men into another town's quarrel
3. a fight entered into on another town's behalf
4. a distant decision arriving with soldiers behind it
5. a local matter taken out of local hands
6. travellers passing columns that answer to no town on this road

### realm_verb_order_supply_raid — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb order supply raid `[fallback, live — byte-identity anchor]`
2. a decree loosing raiders on a neighbour's supply roads
3. a slow strangling ordered from above
4. an order aimed at granaries rather than at walls
5. a campaign that will be felt at market before it is seen in the field
6. carters warned off the roads a decree has marked

### realm_verb_reinforce — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb reinforce `[fallback, live — byte-identity anchor]`
2. a decree sending a relief column to a treaty-ally
3. muster rolls drawn against somebody else's promise
4. a compact honoured by decree
5. men committed to a siege they did not choose
6. travellers giving way to a column marching under a distant seal

### realm_verb_sue_for_peace — R1 subject phrase — significance: notable — desk: war
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb sue for peace `[fallback, live — byte-identity anchor]`
2. a decree instructing a court to ask for terms
3. peace sued for from above
4. an order that ends a war somebody else was fighting
5. terms asked for over a captain's objection
6. travellers carrying word that the realm has called a halt

## §4b — THE TRADE DESK

### allied — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. allied `[fallback, live — byte-identity anchor]`
2. neighbours bound by a standing compact
3. an alliance entered on both rolls
4. a neighbour who answers when called
5. gates that open for each other's carts without question
6. a friendship with terms attached
7. travellers passing freely between the pair
8. an arrangement old enough that nobody argues it

### ceasefire_commerce — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Ceasefire commerce" [J-LEG-1]
1. ceasefire commerce `[fallback, live — byte-identity anchor]`
2. trade permitted while the fighting is paused
3. commerce entered under a temporary exception
4. carts crossing a line that soldiers may not
5. a market that exists because the field is quiet
6. business done in the space a truce leaves
7. carters hurrying while the arrangement holds
8. a season of trading against the clock

### client — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Client" [J-LEG-1]
1. client `[fallback, live — byte-identity anchor]`
2. a town that looks to a stronger one
3. a dependence entered on both books
4. decisions taken elsewhere and lived with here
5. protection that arrives with instructions
6. the lesser partner in a partnership
7. travellers told whose word carries here
8. an arrangement nobody calls by its name

### creditor — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Creditor" [J-LEG-1]
1. creditor `[fallback, live — byte-identity anchor]`
2. a town holding another's paper
3. a claim entered and not yet called
4. an obligation that gives one court a lever
5. money owed and remembered
6. a friendship with a ledger under it
7. factors comparing whose debt is where
8. a term coming due at the turn of the year

### critical_supplier — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Critical supplier" [J-LEG-1]
1. critical supplier `[fallback, live — byte-identity anchor]`
2. the one source the town cannot do without
3. a supply the market book marks before all others
4. a tie that would hurt to lose
5. everything resting on a single road
6. a dependence nobody planned and everybody uses
7. carters running the same route year on year
8. a season in which that road not opening would be the news

### debtor — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Debtor" [J-LEG-1]
1. debtor `[fallback, live — byte-identity anchor]`
2. a town that owes and is known to owe
3. an obligation entered against its name
4. terms that will have to be met or renegotiated
5. borrowing that has become a standing arrangement
6. a court doing its arithmetic more often than it likes
7. factors asking politely and then less politely
8. a term coming due before the harvest does

### diplomacy_trade — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. diplomacy trade `[fallback, live — byte-identity anchor]`
2. terms settled and the roads opened with them
3. a trade normalisation entered beside the accord
4. commerce that follows a signature
5. carts moving because clerks agreed
6. an agreement whose first proof is at market
7. carters finding the crossing simpler than last season
8. a peace that shows up in the price of things

### embargo — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Embargo" [J-LEG-1]
1. embargo `[fallback, live — byte-identity anchor]`
2. a town barred from another's markets
3. a prohibition the clerks copy forward each year
4. goods that may not lawfully move
5. a quarrel conducted through the customs house
6. a road open to feet and closed to cargo
7. carters turned back with full loads
8. a season of finding another way round

### export_market — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. export market `[fallback, live — byte-identity anchor]`
2. the town that buys what this one makes
3. an outward tie entered in the market book
4. a staple with somewhere to go
5. what the workshops here are actually for
6. a dependence dressed up as a friendship
7. carters running loaded one way and light the other
8. a trading season with a fixed destination

### food_anchor_lost — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: condition label "Food anchor lost" + gloss [J-LEG-1]
1. food anchor lost `[fallback, live — byte-identity anchor]`
2. the mill that fed the town gone
3. a granary struck from the town's own rolls
4. bread that has to come from somewhere else now
5. a shortage with a single cause
6. a wheel that has stopped turning
7. carters sent further for what used to be at hand
8. a winter facing the town without its anchor

### forced_tribute — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Forced tribute" [J-LEG-1]
1. forced tribute `[fallback, live — byte-identity anchor]`
2. goods taken under an arrangement nobody agreed to
3. an extraction entered as commerce
4. trade at a price set by the stronger party
5. a market that is really a levy
6. wagons that go out because they must
7. carters counting what is taken at the crossing
8. a season's surplus decided elsewhere

### indebtedness — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: stressor catalog label [J-LEG-1] · realm label "The Debt Crisis" [J-LEG-1]
1. indebtedness `[fallback, live — byte-identity anchor]`
2. a town living on borrowed terms
3. obligations entered faster than they are cleared
4. interest that has begun to shape the council's choices
5. a treasury working for its creditors
6. borrowing to pay the last borrowing
7. factors watching the town's paper closely
8. a year in which the terms outran the harvest

### market_shock — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: stressor catalog label [J-LEG-1] · realm label "The Great Depression" [J-LEG-1]
1. market shock `[fallback, live — byte-identity anchor]`
2. prices that moved overnight and stayed moved
3. a market entered as disordered
4. bargains struck yesterday that make no sense today
5. a crash with a very short cause
6. traders who cannot say what anything is worth
7. carters holding loads rather than selling them
8. a week that undid a season's reckoning

### mass_migration — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: realm label "The Great Migration" [J-LEG-1]
1. mass migration `[fallback, live — byte-identity anchor]`
2. whole districts on the road at once
3. arrivals and departures both entered in bulk
4. a movement no gate roll can keep up with
5. towns emptying into towns
6. a road that has become a settlement of its own
7. travellers unable to find a bed for a week's ride
8. a season that redrew where people are

### mediated_commerce — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Mediated commerce" [J-LEG-1]
1. mediated commerce `[fallback, live — byte-identity anchor]`
2. trade between enemies conducted through a third house
3. commerce entered under a broker's name
4. goods that change hands twice to change hands once
5. a market kept open by somebody standing in the middle
6. business done at arm's length and at a price
7. factors who profit by the quarrel they bridge
8. an arrangement that lasts as long as the broker does

### military_supplier — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Military supplier" [J-LEG-1]
1. military supplier `[fallback, live — byte-identity anchor]`
2. the house that arms a neighbour's soldiers
3. a supply entered against a war's account
4. iron and grain moving toward somebody else's front
5. a trade that prospers when the fighting does
6. a workshop with a standing order it cannot refuse
7. carters running weapons on an ordinary road
8. a season's making that will not come home

### neutral — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. neutral `[fallback, live — byte-identity anchor]`
2. neighbours on speaking terms and no more
3. a relation entered with nothing attached
4. towns that trade a little and expect nothing
5. an absence of quarrel and of compact both
6. a border crossed without ceremony
7. travellers passing without anybody asking why
8. a standing arrangement that is mostly the lack of one

### patron — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Patron" [J-LEG-1]
1. patron `[fallback, live — byte-identity anchor]`
2. a town that keeps a lesser one standing
3. a patronage entered on both rolls
4. protection given and obedience expected
5. a stronger hand over a weaker seat
6. an arrangement described as friendship by one side of it
7. travellers told which court to petition for anything here
8. a compact renewed without ever being renegotiated

### population_decline — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. population decline `[fallback, live — byte-identity anchor]`
2. a town with fewer in it than the last reckoning found
3. a roll that comes back shorter than the clerk expects
4. lanes with houses standing empty
5. work that will not get done for want of people
6. a settlement quietly getting older
7. travellers remarking how much room there is now
8. a year in which more left or were lost than arrived

### population_growth — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. population growth `[fallback, live — byte-identity anchor]`
2. a town bigger this year than last
3. more names on the roll each time it is taken
4. building going up beyond the old bounds
5. more mouths, and more hands with them
6. a market that has had to find more room
7. travellers finding the outskirts changed since last time
8. a year in which the town outgrew its own arrangements

### preferred_supplier — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Preferred supplier" [J-LEG-1]
1. preferred supplier `[fallback, live — byte-identity anchor]`
2. the house this town buys from first
3. a preference entered in the market book
4. a tie of habit as much as of terms
5. business that goes one way without being competed for
6. an arrangement renewed by nobody bothering to change it
7. carters running a route they could run asleep
8. a standing order that survives most seasons

### proxy — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: relationship label "Proxy conflict" [J-LEG-1]
1. proxy `[fallback, live — byte-identity anchor]`
2. courts fighting through other people's towns
3. a quarrel recorded under two names and owned by neither
4. soldiers paid by one court and sworn to another
5. a war conducted at a polite distance
6. somebody else's men doing somebody else's fighting
7. travellers unsure whose quarrel they have wandered into
8. a conflict everyone can see and nobody has declared

### relationship_label_change — R1 subject phrase — significance: routine — desk: trade
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. relationship label change `[fallback, live — byte-identity anchor]`
2. neighbours calling each other something new
3. a relation struck and re-entered under another name
4. a tie the record now describes differently
5. a change of standing between neighbours
6. an old arrangement given a new word
7. travellers finding the crossing works differently than it did
8. a turn in a long acquaintance

### compound_calling_of_debts — R1 subject phrase — significance: major — desk: trade
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
ALSO LIVE: compound signature label "The Calling of Debts" + summary [J-LEG-1]
1. compound calling of debts `[fallback, live — byte-identity anchor]`
2. a crash, and the creditors calling anyway
3. debts made unpayable and demanded in the same season
4. pledged property being seized ahead of rivals

### realm_verb_declare_trade_embargo — R1 subject phrase — significance: notable — desk: trade
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb declare trade embargo `[fallback, live — byte-identity anchor]`
2. a decree barring a neighbour's goods
3. a market closed by a court that does not buy in it
4. a bar on trade the realm will not have to enforce itself
5. a ruling the stallholders feel before they read it
6. carters turned back by a decree made far away

### realm_verb_force_resettle — R1 subject phrase — significance: notable — desk: trade
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb force resettle `[fallback, live — byte-identity anchor]`
2. a decree moving a settlement's people
3. a village emptied into a place chosen for it
4. households told where they will live next
5. a map redrawn by writ
6. travellers passing a column moving under orders

### realm_verb_repudiate_treaty — R1 subject phrase — significance: notable — desk: trade
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb repudiate treaty `[fallback, live — byte-identity anchor]`
2. a decree tearing up an accord
3. a signature made worthless from a long way off
4. terms struck out by a hand that never signed them
5. an oath ended by decree rather than by breach
6. travellers finding a crossing closed that was open last season

## §4c — THE FAITH DESK
LAW ONE governs this whole section: the observance is kept, the register is kept, the god never acts.

### cult — R1 subject phrase — significance: routine — desk: faith
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: deity tier label "Cult — a fringe or secret following" [J-LEG-1]
1. cult `[fallback, live — byte-identity anchor]`
2. a small following that keeps to itself
3. an observance entered at the fringe of the register
4. a rite kept behind a closed door
5. a faith with more conviction than numbers
6. a gathering the parish clerk cannot quite account for
7. travellers noticing marks on doorposts they do not know
8. a following that has outlasted several predictions of its end

### major — R1 subject phrase — significance: routine — desk: faith
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: deity tier label "Major — a pillar of the pantheon" [J-LEG-1]
1. major `[fallback, live — byte-identity anchor]`
2. a pillar of the pantheon
3. an observance the register puts first
4. a rite the whole town keeps whether it believes or not
5. the faith the council schedules around
6. a temple everybody can find without asking
7. travellers told which festival they have arrived in time for
8. a calendar that shapes the working year

### minor — R1 subject phrase — significance: routine — desk: faith
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: deity tier label "Minor — a lesser god" [J-LEG-1]
1. minor `[fallback, live — byte-identity anchor]`
2. a lesser god's observance
3. a rite entered below the great ones in the register
4. a chapel with a steady congregation and no ambitions
5. a faith kept by the households that have always kept it
6. an altar tended by the same family for generations
7. travellers finding a shrine they had not heard of
8. a feast day that only part of the town keeps

### pantheon — R1 subject phrase — significance: routine — desk: faith
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. pantheon `[fallback, live — byte-identity anchor]`
2. the whole company of a town's gods
3. the register's full list of observances
4. a calendar of rites that has to be fitted together
5. temples that share a town and argue about precedence
6. the arrangement of faiths a settlement lives inside
7. travellers working out which altar answers which need
8. a year's worth of festivals with their own politics

### compound_gods_abandonment — R1 subject phrase — significance: major — desk: faith
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
ALSO LIVE: compound signature label "God's Abandonment" + summary [J-LEG-1]
LAW ONE: the town's people say they are abandoned; the annex never says a god left.
1. compound gods abandonment `[fallback, live — byte-identity anchor]`
2. hunger, plague, and a fracturing faith feeding one another
3. flagellants walking between the afflicted towns
4. scapegoats named from pulpits and prophets nobody ordained

## §4d — THE DIVINATION DESK
BELIEF ATTRIBUTION governs this whole section: every variant is a FORECAST — what is feared, watched, or read from a trend — never an event that has happened.

### crime_pressure — R1 subject phrase — significance: routine — desk: divination
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. crime pressure `[fallback, live — byte-identity anchor]`
2. what the watch expects before it happens
3. a drift toward lawlessness the record keeps confirming
4. conditions that usually end in a crime wave
5. a town that feels less safe than the tally says
6. more locks bought than incidents reported
7. travellers picking up warnings before they see cause
8. a winter the watch is already dreading

### disease_pressure — R1 subject phrase — significance: routine — desk: divination
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. disease pressure `[fallback, live — byte-identity anchor]`
2. conditions that sickness usually follows
3. a health mark the record keeps moving the wrong way
4. crowding, hunger, and bad water in one place
5. what the healers are quietly preparing for
6. a town one bad season from an outbreak
7. travellers advised to water their horses elsewhere
8. a summer everybody is watching more closely than usual

### food_pressure — R1 subject phrase — significance: routine — desk: divination
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. food pressure `[fallback, live — byte-identity anchor]`
2. stores that will not reach the next harvest
3. a food reading the record shows falling
4. arithmetic the reeve has done and does not like
5. what comes before hunger
6. a town counting further ahead than it usually does
7. carters asked what grain costs three valleys over
8. a spring measured against a granary

### legitimacy_pressure — R1 subject phrase — significance: routine — desk: divination
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. legitimacy pressure `[fallback, live — byte-identity anchor]`
2. a seat being obeyed a little less each season
3. a standing the record shows slipping
4. orders that men are said to be waiting out rather than obeying
5. men beginning to ask who decided that
6. a council that has started explaining itself
7. travellers hearing the seat spoken of without much respect
8. a year in which authority thinned quietly

### regional_pressure — R1 subject phrase — significance: routine — desk: divination
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. regional pressure `[fallback, live — byte-identity anchor]`
2. trouble building somewhere up the road
3. a reading taken from the whole district and not this town
4. what the neighbours are carrying that will arrive here
5. a strain that is not local yet and will be
6. news from three directions saying the same thing
7. travellers arriving with worse reports each week
8. a season in which the whole district is uneasy

## §4e — THE EVENTS DESK

### autoplacement — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
NOTE: a DM act on the realm's map, filed as realm news on purpose (W-G / J-D1).
1. autoplacement `[fallback, live — byte-identity anchor]`
2. the realm's charter drawn
3. a map settled at a stroke
4. sites named and entered before anybody lives on them
5. a founding decided all at once
6. travellers finding roads laid to places not yet built

### betrayal — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
LAW ONE: a betrayer is exposed, never resolved.
1. betrayal `[fallback, live — byte-identity anchor]`
2. an oath broken from inside
3. a treachery entered against a trusted name
4. a door opened that was meant to be held
5. trust that turned out to be the weak point
6. travellers finding the town suspicious of its own

### calamity_forced — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. calamity forced `[fallback, live — byte-identity anchor]`
2. a disaster brought about by decree
3. a calamity entered as ordered rather than as suffered
4. ruin arriving on somebody's instruction
5. a blow the record says was chosen
6. travellers finding a town undone by a decision

### compound_shadow_court — R1 subject phrase — significance: major — desk: events
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
ALSO LIVE: compound signature label "The Shadow Court" + summary [J-LEG-1]
1. compound shadow court `[fallback, live — byte-identity anchor]`
2. a guild that has stopped needing the council
3. offices held by men who answer to a corridor
4. petitions answered faster through the wrong door

### compound_starving_city — R1 subject phrase — significance: major — desk: events
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
ALSO LIVE: compound signature label "The Starving City" + summary [J-LEG-1]
1. compound starving city `[fallback, live — byte-identity anchor]`
2. a blockade holding while the granaries empty
3. hunger and siege doing each other's work
4. surrender counted out in meals that do not come

### compound_the_wasting — R1 subject phrase — significance: major — desk: events
CADENCE: major/rare → floor 4 · live 1 · +3 · AUDIENCE: public
ALSO LIVE: compound signature label "The Wasting" + summary [J-LEG-1]
1. compound the wasting `[fallback, live — byte-identity anchor]`
2. hunger and sickness feeding each other
3. the hungry sickening faster and the sick unable to work the fields
4. two troubles that have become one

### coup_detat — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
LAW ONE: a seizure empties a seat; no fate is resolved.
1. detat `[fallback, live — byte-identity anchor · ⚠️⚠️ MUTILATED, DEFECT-1 — the coup_ strip prefix eats the meaningful half of the token]`
2. a seizure attempted at the top
3. a stroke against the seat entered in the record
4. men moving on the council chamber at an odd hour
5. power grasped at rather than passed
6. travellers finding the gates shut on an ordinary morning

### criminal_corridor — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: stressor catalog label [J-LEG-1] · realm label "The Crime Wave" [J-LEG-1]
1. criminal corridor `[fallback, live — byte-identity anchor]`
2. a road that moves what should not move
3. a corridor entered in the watch's own record
4. goods travelling with nobody's name on them
5. a route everybody knows about and nobody polices
6. carters offered work they should not take

### criminal_network — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. criminal network `[fallback, live — byte-identity anchor]`
2. an organisation the watch cannot name a head for
3. a network entered across several towns' records
4. arrangements that run underneath the ordinary ones
5. a hand in every lane and no face to it
6. travellers advised whom to pay before they trade

### custom_crisis — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Crisis" + gloss [J-LEG-1]
1. custom crisis `[fallback, live — byte-identity anchor]`
2. an authored trouble gripping the town
3. an affliction set down in the book before it was felt in the street
4. a matter that has taken over everything else
5. a town with one problem and no room for others
6. travellers finding the place turned to a single question

### disaster — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. disaster `[fallback, live — byte-identity anchor]`
2. a blow the town did not see coming
3. a calamity entered against the settlement's name
4. damage that will be years in the mending
5. a day the town will date other things from
6. work stopped everywhere while people dig
7. travellers turned back by what is left of the road
8. a season broken across the middle

### disease_outbreak — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: stressor catalog label [J-LEG-1] · realm label "The Plague" [J-LEG-1]
1. disease outbreak `[fallback, live — byte-identity anchor]`
2. sickness running through the lanes
3. cases entered faster than the healers can see them
4. a house on every street with the door shut
5. an illness that has stopped being unusual
6. travellers advised to go around

### dominant_npc_removed — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Leadership void" + gloss [J-LEG-1]
LAW ONE: OUT OF THE SEAT — never a resolved fate.
1. dominant npc removed `[fallback, live — byte-identity anchor]`
2. a seat that has lost the person who filled it
3. a vacancy entered with no successor named
4. everything that went through one pair of hands, waiting
5. a town discovering how much rested on one name
6. travellers told there is nobody to see about it just now

### faction_institution_capture — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_INTERIOR.md` (INT-8) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. institution capture `[fallback, live — byte-identity anchor · ⚠️ MUTILATED, DEFECT-2 — this is the de-underscored spelling of the DISTINCT kind institution_capture, which itself renders only "capture"]`
2. an interest taking a hall for its own
3. an entry on the roll naming the interest the hall now answers to
4. an office whose decisions now have an owner
5. a public thing quietly become a private one
6. business that goes one way whoever brings it
7. travellers told which faction to approach about the hall
8. a takeover conducted entirely in appointments

### faction_institution_suppression — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_INTERIOR.md` (INT-8) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. institution suppression `[fallback, live — byte-identity anchor · ⚠️ MUTILATED, DEFECT-2 — this is the de-underscored spelling of the DISTINCT kind institution_suppression, which itself renders only "suppression"]`
2. an interest closing a hall it could not hold
3. a suppression entered against the hall under a faction's name
4. an office prevented from doing its work
5. a rival's foothold taken away rather than taken over
6. doors shut by people who do not own them
7. travellers sent away from a hall that is open in name
8. a dismantling done in a faction's name and entered in no minute book

### faction_law_preference_push — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_INTERIOR.md` (INT-8) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. law preference push `[fallback, live — byte-identity anchor · ⚠️ MUTILATED, DEFECT-2]`
2. an interest pressing for the law it wants
3. a preference entered on the council's own record
4. rules proposed by the people they would suit
5. a statute with a beneficiary on its face
6. a council asked, again, to see it one way
7. travellers finding the same argument in every tavern
8. a season of one faction's drafting

### faction_power_shift — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. power shift `[fallback, live — byte-identity anchor · ⚠️ MUTILATED, DEFECT-2]`
2. weight moving from one interest to another
3. a shift entered on the faction rolls
4. rooms that used to be full emptying into other rooms
5. the list of people worth persuading, rewritten
6. an old balance that no longer holds
7. travellers directed to a different house than last year
8. a turn that took a season and will take a generation to undo

### faction_service_bolster — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO POOLED: the R2 Herald receipt-sentence pool for this kind lives in `RECEIPT_POOLS_INTERIOR.md` (INT-8) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. service bolster `[fallback, live — byte-identity anchor · ⚠️ MUTILATED, DEFECT-2]`
2. an interest paying to keep a service standing
3. a payment entered where a levy would normally stand
4. a hall kept open by somebody's money
5. help given where a debt will be remembered
6. a public good with a private sponsor
7. travellers told whose generosity keeps the door open
8. an arrangement renewed each season without discussion

### famine — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Famine pressure" + gloss [J-LEG-1] · realm label "The Great Hunger" [J-LEG-1]
1. famine `[fallback, live — byte-identity anchor]`
2. hunger become a public matter
3. want entered as a crisis rather than a hardship
4. queues where there used to be a market
5. a town where the food question has displaced every other
6. travellers advised to carry their own provisions

### government_change — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. government change `[fallback, live — byte-identity anchor]`
2. a seat passing to different hands
3. a change of rule entered and dated
4. a new seal on business the old one had already settled
5. the same offices with different masters
6. travellers finding a different name at the council door

### government_overthrown — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Government overthrown" + gloss [J-LEG-1]
LAW ONE: the seat falls; the person is out of it, never resolved.
1. government overthrown `[fallback, live — byte-identity anchor]`
2. a ruling power put out by force
3. an overthrow entered against the old seat
4. authority being rebuilt from the ground up
5. a council chamber under new occupancy
6. travellers finding nobody able to say who decides

### infiltration — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. infiltration `[fallback, live — byte-identity anchor]`
2. another court's people quietly inside this one
3. agents entered against a neighbour's account
4. offices held by men who report elsewhere
5. a town whose decisions are known before they are made
6. travellers warned that the walls here have ears

### information_flow — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. information flow `[fallback, live — byte-identity anchor]`
2. word moving along a road as reliably as cargo
3. a channel the clerks record as they would a road
4. news that arrives here before it arrives anywhere else
5. a town that knows things early
6. riders whose arrival the market watches for
7. travellers finding their news already stale on arrival
8. a standing arrangement for knowing

### institution_capture — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. capture `[fallback, live — byte-identity anchor · ⚠️⚠️ MUTILATED, DEFECT-2 — the institution_ strip prefix leaves a bare verb]`
2. a hall taken over by an interest
3. a capture entered against the institution's own roll
4. an office that has acquired an owner
5. decisions with a predictable direction
6. a public body that answers privately
7. travellers told who really runs it
8. a takeover done entirely through appointments

### institution_suppression — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. suppression `[fallback, live — byte-identity anchor · ⚠️⚠️ MUTILATED, DEFECT-2]`
2. a hall prevented from working
3. a body entered as prevented rather than as failed
4. an office kept from doing what it is for
5. doors closed by people with no right to close them
6. a service that exists on paper only
7. travellers carrying business the hall will no longer take
8. a dismantling nobody has announced

### insurgency — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: stressor catalog label "Insurgency pressure" [J-LEG-1] · realm label "The Uprising" [J-LEG-1]
1. insurgency `[fallback, live — byte-identity anchor]`
2. an organised resistance the seat cannot reach
3. cells entered in the record without names
4. authority contested in the lanes rather than the chamber
5. a rising that has learned patience
6. travellers advised which quarters to avoid

### magic_deadzone — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: realm label "The Great Silence" [J-LEG-1]
1. magic deadzone `[fallback, live — byte-identity anchor]`
2. a place where the workings will not work
3. an absence the ward rolls now have to account for
4. wards that stopped holding and cannot be renewed
5. practitioners here who have become ordinary
6. travellers finding their charms useless within the bounds

### magical_instability — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Magical instability" + gloss [J-LEG-1] · realm label "The Arcane Turmoil" [J-LEG-1]
1. magical instability `[fallback, live — byte-identity anchor]`
2. workings that surge and fail without pattern
3. an instability entered in the settlement's record
4. wards nobody trusts to hold
5. a town that has learned not to rely on it
6. travellers advised not to cast anything they need

### monster_raider_pressure — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
ALSO LIVE: stressor catalog label "Monster or raider pressure" [J-LEG-1] · realm label "The Raids" [J-LEG-1]
1. monster raider pressure `[fallback, live — byte-identity anchor]`
2. something coming down out of the wild country
3. raider pressure entered against the frontier
4. outlying steadings that have stopped being worth farming
5. a militia turned out more often than it should be
6. roads only used in daylight now
7. travellers hiring escorts they never used to need
8. a season the frontier is dreading

### npc_action — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
LAW ONE: an act changes a standing; it never resolves a fate.
1. action `[fallback, live — byte-identity anchor · ⚠️⚠️ MUTILATED, DEFECT-2 — the npc_ strip prefix leaves a bare noun]`
2. a name in the town doing something about it
3. an act entered against a person's own record
4. one hand moving where the council would not
5. somebody deciding not to wait
6. a move the town will be arguing about by evening
7. travellers finding the place talking about one person
8. a step taken that cannot be untaken

### plague — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Plague" + gloss [J-LEG-1]
LAW ONE: no named person's fate is resolved.
1. plague `[fallback, live — byte-identity anchor]`
2. a virulent sickness through the whole town
3. an outbreak entered at its worst grade
4. streets kept clear because nobody will use them
5. a season measured in shut doors
6. travellers turned back a day's ride out

### political_authority — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. political authority `[fallback, live — byte-identity anchor]`
2. a court whose word runs beyond its own walls
3. an authority channel entered between two seats
4. orders that carry in a town that did not issue them
5. influence that does not need soldiers behind it
6. a seat consulted about matters that are not its own
7. travellers told whose ruling settles things here
8. a standing arrangement of who defers to whom

### political_fracture — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: stressor catalog label "Political fracture" [J-LEG-1] · realm label "The Succession Crisis" [J-LEG-1]
1. political fracture `[fallback, live — byte-identity anchor]`
2. a court split down the middle
3. a fracture entered against the seat's own record
4. an answer for every question and no way to choose between them
5. a council that cannot finish a sitting
6. travellers unable to learn who speaks for the town

### realm_verb_force_abandon — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb force abandon `[fallback, live — byte-identity anchor]`
2. a decree emptying a settlement
3. a town closed the way an office is closed
4. people told to leave somewhere that still stands
5. a place ended by writ rather than by ruin
6. travellers passing a town being walked out of

### realm_verb_force_calamity — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb force calamity `[fallback, live — byte-identity anchor]`
2. a decree bringing a disaster down
3. harm set down in advance the way a market day is
4. ruin arriving because it was written
5. a catastrophe somebody put their name to
6. travellers finding a town undone on somebody's word

### realm_verb_force_found_steading — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb force found steading `[fallback, live — byte-identity anchor]`
2. a decree founding a steading
3. a name given to a place before anybody lives in it
4. ground broken because a writ said so
5. a place that begins with an order rather than a choice
6. travellers finding a new palisade where the map showed nothing

### realm_verb_force_reconsideration — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. realm verb force reconsideration `[fallback, live — byte-identity anchor]`
2. a decree making a court think again
3. a verdict sent back to the table it came from
4. a settled course reopened by writ
5. a decision taken back out of the book
6. travellers finding a settled matter reopened by writ

### realm_verb_order — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. realm verb order `[fallback, live — byte-identity anchor]`
2. a decree issued from the realm's seat
3. an order entered under the realm's own hand
4. a writ that will be read out in every square
5. something decided above the town and felt inside it
6. an instruction nobody local can appeal
7. travellers carrying word of a decree ahead of the decree
8. a season shaped by a decision made elsewhere

### rebellion — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
ALSO LIVE: condition label "Rebellion" + gloss [J-LEG-1] · stressor catalog label "Rebellion pressure" [J-LEG-1]
1. rebellion `[fallback, live — byte-identity anchor]`
2. a town organising against its overlord
3. a rising entered against a coercive patron
4. tribute withheld and men under arms
5. an arrangement being refused rather than renegotiated
6. travellers finding the overlord's writ ignored here

### reconsideration_forced — R1 subject phrase — significance: notable — desk: events
CADENCE: notable → floor 6 · live 1 · +5 · AUDIENCE: public
1. reconsideration forced `[fallback, live — byte-identity anchor]`
2. a court made to think again
3. a reversal entered against a settled course
4. a decision reopened under pressure
5. a plan taken back off the table
6. travellers finding the arrangement they were told of undone

### regional_channel — R1 subject phrase — significance: routine — desk: events
CADENCE: chronic → floor 8 · live 1 · +7 · AUDIENCE: public
1. regional channel `[fallback, live — byte-identity anchor]`
2. a standing connection between two towns
3. a channel entered on the regional graph
4. what one settlement carries to another as a matter of course
5. a tie strong enough that trouble travels along it
6. a road that is also a relationship
7. travellers using a route the two towns maintain between them
8. an arrangement that shows in both towns' records

---
# THE ACCOUNTING

| | |
|---|---|
| Kinds deepened | **200** (every LIVE routed token the census returned below floor) |
| Variants in the corpus | **1,474** (1,412 authored here + **62 MERGED IN** from `RECEIPT_POOLS_WAR.md` under J-LEG-7, 2026-08-03) |
| Variants ADDED by this annex | **1,161** (1,099 authored + 62 merged) |
| Variants reproduced VERBATIM from `src/` | **313** (206 authored live strings + 107 computed fallbacks) |
| Pools by axis | §1 receipt sentence **24** · §2 news summary **6** · §3 authored subject phrase **63** · §4 fallback subject phrase **107** |
| Pools by desk | war 47 · trade 53 · events 81 · adjudication 1 · faith 12 · divination 6 |
| Pools by floor | chronic ≥8 **116** · notable ≥6 **74** · major/rare ≥4 **10** |
| dm-only pools | 1 (`lineage_claim_suppressed`) |

*The one `adjudication` pool is `refusal_cost_legitimacy`. Its desk is registry-true:
`WAR_RULING_KIND_REGISTRY` persists `section: 'adjudication'` and the record router
honours the persisted section. `SECTION_OF('refusal_cost_legitimacy')` returns
`events` — that is the documented TOKEN-ONLY fallback (`heraldRouting.js:214`,
`:308`: adjudication is never a token-map output), not a contradiction.*

**MACHINE-VERIFIED — RE-EXECUTED 2026-08-03 by an adversarial verifier against this
file and the live tree, independently of the authoring pass:** every one of the 200
assigned kinds has a pool · every pool meets its cadence-keyed floor and its declared
floor matches its declared band · `live N · +M` equals the actual pool length in all
200 · **all 313 live anchors compare BYTE-EQUAL to `src/`** (119 §1 templates rendered
from `WAR_RECEIPTS` through a slot proxy · 24 §2 summaries from `UPSWING_NEWS` /
`NPC_GOAL_NEWS` · 170 R1 anchors from `whatPhrase()` itself, authored and computed) ·
every §3 kind has a `WHAT_PHRASES` row and every §4 kind has none · every registry-backed
kind's significance / audience / desk equals its live registry row · all 29 quoted
`ALSO LIVE:` whatPhrase subjects and all 20 quoted condition labels are verbatim ·
the digit scan over rendered pool prose (code spans stripped) is **CLEAN — zero literal
numerals in 1,412 lines** · zero duplicate lines within any pool · zero cross-pool exact
repeats except the one that is a LIVE FACT (DEFECT-4) · zero R1 lines carrying a terminal
stop, a leading capital, or a slot. **NOT machine-checkable here:** the claim that each
live-anchor count equals the census's `currentVariants` (the census is not in this file);
the executed substitute is the stronger check that each equals the LIVE pool length in
`src/`, which passed in all 200.

**RE-VERIFIED AFTER THE J-LEG-7 MERGE (2026-08-03).** The digit-scan line above now
reads **1,474**, not 1,412. Re-executed over the merged file: 200 pools · 1,474
variants · `live N · +M` equals the actual pool length in **all 200** (the 23 merged
pools' `+M` terms were restated, and only those) · **zero duplicate lines within any
pool** · variant numbering contiguous from one in all 200 · zero literal numerals in
rendered prose · zero slot outside the declared set. The merge was **append-only for
prose**: the diff against the pre-merge file carries no deletion of any variant line
and no renumbering, so every seeded draw that already landed on an index still lands
there and THE PROMISE is undisturbed. The only deleted lines are the 23 restated
`CADENCE:` headers.

---

# THE RULINGS REGISTER (chair rulings, all VETOABLE)

| Id | Ruling | Why it was needed |
|---|---|---|
| **J-LEG-1** | A NAME IS NOT A TELLING. Condition/stressor/relationship/deity-tier LABELS and condition GLOSSES are excluded from the frequency-scaled floor by their kind. | The LEGIBILITY LAW's glance tier requires a stable name. A chip that renames itself is not deeper, it is unrecognisable. FIFTY of the 200 pools carry a label of some class (20 condition · 13 relationship · 9 stressor-catalog · 3 deity-tier, plus 11 realm and 5 compound-signature labels across them); TWENTY carry a condition gloss as well, and that gloss subset is the whole of the contingent bill below. Each is recorded on its pool's `ALSO LIVE:` line so the exclusion is auditable. |
| **J-LEG-2** | A kind's SECOND telling axis is DEFERRED, not denied. This file deepens the axis the census measured. | Twenty-nine kinds carry both a receipt-sentence pool and an authored subject phrase. Deepening both here would double the file and blur which axis the census actually found short. The second bill is priced below. |
| **J-LEG-3** | EIGHT is the authored chronic floor; the soak's phrase-repetition envelope PROMOTES to 10–12. | The spine's chronic band is 8–12 "according to cadence, and then MEASURED". No pre-wiring cadence measurement exists for legacy tokens. Authoring a guessed 12 would be fabricated precision. |
| **J-LEG-4** | Variant 1 stays the FALLBACK string for the 107 unvoiced kinds; the twelve MUTILATED fallbacks are a separate, owner-gated repair. | The byte-identity clause is absolute and does not distinguish authored strings from computed ones. But retiring *"detat"* is a second prose shift with its own golden and must not ride in on a pool-widening commit. |
| **J-LEG-5** | The R1 subject-phrase pools take NO SLOTS. | The live frame supplies the settlement name and the address chain around the phrase — the NEWS ADDRESS LAW is satisfied by the sentence the phrase lands in, not by the phrase. A slot inside the phrase would double the name. |
| **J-LEG-6** | `requiredSlots` parity is a WIRING PRECONDITION, and a walker must assert it. | Six registries index a parallel array by template index. A pool grown without its row throws at the new index — a defect this annex's own additions would cause if wired carelessly. Structural prevention, not vigilance. |
| **J-LEG-7** | **ONE KIND, ONE POOL — and where the kind is LIVE, THIS ANNEX OWNS IT.** The 23 kinds that carried a same-register (R2) pool in BOTH this file and `RECEIPT_POOLS_WAR.md` are merged here; the war annex's pool body is replaced by a one-line pointer. | Two annexes claiming one selector is not a prose defect, it is an ownership defect: at wiring the two lists either merge into one draw set — and the duplicated members become literal repeats inside one pool — or one annex silently loses. LIVE beats DARK: these kinds already mint and route today, their live strings are the byte-identity anchors, and those anchors live here. The merge is APPEND-ONLY (variant 1..N untouched, nothing renumbered), so THE PROMISE holds. **62 variants moved; 80 exact duplicates dropped.** |
| **J-LEG-8** | **A SECOND AXIS IS NOT CO-OWNERSHIP.** Where the other annex's pool is a DIFFERENT AXIS of the same kind — an R2 Herald receipt against this file's R1 subject phrase or R3 news summary — both pools STAY, one per axis, and each carries an `ALSO POOLED:` cross-reference. | This is J-LEG-2's own doctrine read the other way round: a legacy kind does not have "a string", it has axes, and both render on one entry in different fields. Merging a finite-clause receipt into an R1 pool would put *"{faction} moves to capture an institution of {settlement}."* inside *"Travellers bring word of …"* — a register violation, not a de-duplication. **Eleven kinds** are disposed this way (four against POPULATIONS, seven against INTERIOR); they are the same by-design class as the CAUSAL §2 clause forms. One of the eleven — `bust` — is not even one kind: this file's `bust` is the live `UPSWING_NEWS` trade-collapse summary, POPULATIONS' `bust` is an ENDINGS TOKEN of the POP-1 mix. A name collision across two id spaces, disambiguated below, never merged. |

**THREE AMENDMENT REQUESTS TO THE SPINE (unassumed — this annex does not edit
`DESIGN_FP_SPINE.md`).** J-LEG-1 NARROWS SP-6's floor scope (names excluded);
J-LEG-3 FIXES the chronic authored floor at the band's low end with the envelope as
the promoter; J-LEG-4 CLARIFIES that the byte-identity clause binds computed
fallbacks as well as authored strings. All three are chair rulings taken under
delegated authority and should be rowed into `docs/FABLE_VALIDATION_QUEUE.md` by
the coordinating chair for re-validation. **They are recorded, not assumed.**

**J-LEG-7 AND J-LEG-8 ARE CROSS-ANNEX RULINGS AND EDIT A SIBLING FILE.** They are
the only rulings in this register whose effect reaches outside this annex: J-LEG-7
removed 23 pool bodies from `RECEIPT_POOLS_WAR.md` and replaced each with a pointer
here; J-LEG-8 added `ALSO POOLED:` cross-references to eleven pools here and to
their eleven counterparts in `RECEIPT_POOLS_POPULATIONS.md` and
`RECEIPT_POOLS_INTERIOR.md`. Both are vetoable and both are reversible from the
markers alone — every merged line carries its `[merged ← WAR …]` provenance tag
naming the wave and the source index it came from, so a veto restores the war
annex's pools exactly. Row both into `docs/FABLE_VALIDATION_QUEUE.md`.

---

## THE MERGE RESIDUE (J-LEG-7) — what the RE-CUT wave inherits

The merge was an OWNERSHIP operation and dropped only clones: 80 of the 142 war-annex
variants were byte-equal (after slot and marker normalisation) to a line already here
and were dropped; 62 moved. **What it did NOT do is re-cut PARAPHRASES**, and the
seven WR-2 pools that moved whole are where they cluster: the war annex authored a
parallel pool at the SAME angles as the live one, so the merged pool can hold one
proposition twice in two wordings. Token-similarity does not catch these — the pairs
below run from 0.62 down to under 0.30 jaccard and were found by reading. They are a
FAMILY-RULE backlog (hard constraint 6), not an ownership question, and the
protected side is always the live anchor.

| Merged pool | the paraphrase pair (merged index ↔ resident index) | the proposition said twice |
|---|---|---|
| `deity_peace_pressure` | v9↔v1 · v11↔v3 · v12↔v4 · v13↔v5 | four of the six moved lines restate a live anchor: the harvest rites slow the muster · the cost of war priced in seed, "no captain likes to hear" · the altar never forbade war, it made war look expensive · a grievance waits another season |
| `deity_war_pressure` | v11↔v3 · v12↔v4 · v10↔v6 · v9↔v5/v8 · v14↔v7/v8 | restraint finds no purchase · the rites do not order wars · the blessing of the muster · the lowered bar for arms · the feast-day calendar |
| `disposition_insular_crossed` | v9↔v1+v6 · v10↔v2 · v11↔v3 · v13↔v7 | the gates closing earlier · the factors of `{house}` received coldly · the roads' weight in council · heard politely and bought from not at all |
| `disposition_diplomatic_crossed` | v9↔v1+v6 · v12↔v7 · v13↔v6 | the hall's spare chairs vs the room set aside for legates · talks before it marches |
| `disposition_reversal` | v11↔v3 · v12↔v7 · v13↔v4 · v14↔v8 | "a temper is not a ratchet" (near-verbatim formula) · the men who argued one way arguing the other · the mind changed slowly · the season needed to believe it |
| `disposition_mercantile_crossed` | v9↔v1 · v10↔v2 · v11↔v3/v8 | the temper stated plain · the quays' weight in council · "a generation of ledgers" |
| `disposition_martial_crossed` | v9↔v1 · v12↔v9 (both moved) · v14↔v6 | the temper stated plain, three times across the merged set · the armoury-vs-civic-building comparative closing on "nobody remarks" |
| `coalition_stayed` | v9↔v6 | the men told they were going home and then not |
| `mirror_obligation_discharged` | v9↔v7 | a compact is worth more for having been used once |
| `lineage_claim_suppressed` | v13↔v6 | the clerk who entered the deliveries beside the claim and remarked on neither |
| `home_front_hands` | v9↔v3/v8 | the muster's cost arriving a generation later, now stated three times |
| `home_front_institutions` | v9↔v4/v6 | the register kept out of habit in an office that has stopped working |

**Two CAUSAL §2 clause-form pools now source from this file, and one of them sources
from a non-anchor line.** `RECEIPT_POOLS_CAUSAL.md` §2 carries a compressed clause form
for exactly two of the 23 merged kinds — `WAR/casus_alliance_obligation (WR-6)` and
`WAR/disposition_reversal (WR-2)`. Its §2.0 contract makes the sibling annex's VARIANT 1
the authority on what a kind asserts. For `casus_alliance_obligation` nothing moved: that
annex's `F1` is byte-equal to this file's variant 1, which is the live string. For
`disposition_reversal` its `F1`/`F2` were compressed from the war annex's v1/v2, which
are now this pool's **v9 and v10** — still present, still verbatim, but no longer the
anchor. Both clause forms remain faithful to what the kind ASSERTS (a temper that
crossed back), so this is a provenance note and not a contradiction: **the wave label
`WR-2` in that annex is still correct, only the file the pool sits in has changed.**
Recorded so the next reader does not re-derive it; no edit to the causal annex is
implied.

**The one J-LEG-8 pair the scan flagged, and why it is FENCED rather than re-cut.**
`commons_gathering`'s R1 anchor here — *"the commons gathered in the square"* — reads at
0.63 against POPULATIONS' R2 anchor *"The commons of {settlement} gathered in the square
over {reason}."* Both are PROTECTED: the first is the live `WHAT_PHRASES` row, the second
is the volume's §8 exemplar. The re-cut rule has no legal target on either side, and the
two land in different fields of one entry — the phrase NAMES the thing, the sentence
TELLS it, and a reader meeting both meets a heading and its story rather than the same
line twice. Accepted, recorded, not a bug to re-find.

**The disposition-pool count is the tell.** Seven pools jumped from 8 to 14 in one
step. Fourteen is far above their chronic floor of 8 and above even the envelope's
12 — so the re-cut wave has room to CUT rather than rewrite, and cutting a paraphrase
of a live anchor costs the pool nothing. **The live anchors (variants 1..5 of every
merged pool) are untouchable in that wave, as they are here.**

---

# THE DEFECT REGISTER (found while authoring; each is a repair, not a pool)

**DEFECT-1 — `coup_detat` renders as *"detat"*.** `WHAT_STRIP_PREFIX`
(`settlementRumors.js:304`) strips `coup_`, leaving a fragment that is not a word
in any language the reader speaks. **Severity: high** — it reaches the flagship
fiction surface. *Repair:* an authored `WHAT_PHRASES` row. Disclosed prose shift,
its own golden.

**DEFECT-2 — the `institution_` / `npc_` / `faction_` strips mutilate eight
tokens.** `institution_capture` → *"capture"* · `institution_suppression` →
*"suppression"* · `npc_action` → *"action"* · `faction_institution_capture` →
*"institution capture"* · `faction_institution_suppression` → *"institution
suppression"* · `faction_law_preference_push` → *"law preference push"* ·
`faction_power_shift` → *"power shift"* · `faction_service_bolster` → *"service
bolster"*. **Two pairs are worse than plain mutilation — they are IMPERSONATIONS.**
`faction_institution_capture` renders *"institution capture"*, which is the exact
de-underscored spelling of the DISTINCT kind `institution_capture` — while
`institution_capture` itself renders only *"capture"*. So the faction kind wears the
institution kind's whole name and the institution kind is left a bare verb: a reader
shown *"institution capture"* is being told, in the only words the surface gives
them, about the kind that is NOT firing. `faction_institution_suppression` /
`institution_suppression` do the same. Note the two are not byte-identical to each
other — the defect is misattribution, not literal ambiguity. **Severity: high.**

**DEFECT-3 — the `occupation_` strip mutilates three tokens.** `occupation_burden`
→ *"burden"* · `occupation_burden_cleared` → *"burden cleared"* ·
`occupation_resistance` → *"resistance"*. Each loses the fact that it is about an
occupation at all. **Severity: medium.**

**DEFECT-4 — two distinct kinds share one live phrase.** `flow_migration` and
`migration_pressure` both render *"people on the move"* (`WHAT_PHRASES:220,221`).
One is a movement that is HAPPENING (trade desk, an event); the other is a
FORECAST of one. A reader is given the same words for both. Reproduced verbatim in
both pools because it is the live string; the pools then diverge, which by itself
substantially repairs the collision. **Severity: medium; largely cured by wiring.**

**DEFECT-5 — the structural root: `WHAT_STRIP_PREFIX` is an unguarded blacklist.**
It strips a prefix and returns whatever remains, with no assertion that the
remainder is meaningful — which is exactly the *forbidden-list vs inclusion-list
polarity gap* already on the standing-hazard register. **Every defect above is one
instance of it.** *Structural repair:* a walker over every routed token asserting
either an explicit `WHAT_PHRASES` row OR that the stripped output is a
multi-word phrase not equal to a bare verb from a closed stop-list. That converts
"nobody noticed" into a red gate.

**DEFECT-6 — 108 routed tokens in this file's scope have no `WHAT_PHRASES` row at
all.** The registration walker (`settlementRumors.walker.test.js`) source-scans
minted `impactKind`s; a kind-only producer is invisible to it (a gap the file's own
comments already record for nine tokens). 107 of the 108 are the §4 pools, whose
subject-phrase axis this annex deepens — that is the content half of the cure. The
108th is `corruption_exposed` (§1c), whose DEEPEST axis is its casus-reason pool, so
this file deepens that instead and leaves its unvoiced subject phrase, *"corruption
exposed"*, on the J-LEG-2 deferred list. The walker widening is the structural half
and covers all 108.

**DEFECT-7 (cosmetic) — a war row inside the events block.**
`heraldRouting.js:197` carries `cold_war_sanctions: 'war'` on the same line as
`dominant_npc_removed: 'events'`, under the EVENTS banner comment. `SECTION_OF`
returns the right desk; only the table's readability is wrong. **Severity: low.**

**DEFECT-8 — live numeric interpolations in the Wizard News prose, one of them
inside this file's own scope.** `${x.year}` in `UPSWING_NEWS.reconstruction.summary`
(×4) is the ONLY one this annex reproduces — it is a §2 pool, so it is quarantined
under the byte-identity clause and tagged inline. The rest sit on axes this file
does not deepen and are recorded so the wiring wave meets them knowingly:
`${x.arteries}` in `UPSWING_NEWS.boom.reasons` (×4, a J-LEG-2 deferred sibling
axis); `${x.count}` in `LIFECYCLE_NEWS.orbit_dispersed.summary` (×4) and `${x.debit}`
in `LIFECYCLE_NEWS.founded.summary_strike` / `.summary_growth` / `.summary_site`
(×4 each). All render digits into chronicle prose, against the corpus digit law.
**No variant this annex adds introduces one.** *Repair:* band-word substitution,
disclosed, with its own golden — and NOT bundled with pool wiring.

---

# THE DEFERRED AXES REGISTER (deliberately deferred, documented, priced)

*Not bugs to re-find. Each is maintenance under the same 2026-08-03 amendment.*

| Deferred axis | Scope | Bill |
|---|---|---|
| **Second telling axis (J-LEG-2)** — the subject phrase of the 30 kinds whose receipt-sentence or summary pool this file deepened | 30 pools (29 authored + `corruption_exposed`'s fallback) | **186 variants** |
| **§2 sibling pools (J-LEG-2)** — `headline` and `reasons` for boom/bust/flourishing/reconstruction; `headline`+4 reason axes for `npc_goal_culmination`; `headline`+2 for `npc_goal_rebranch` | 16 pools, all live at 4, all notable | **32 variants** |
| **Condition glosses (J-LEG-1, only if the chair is overruled)** | ~20 kinds | ~120 variants |
| **The remaining routed tokens** — the census returned 200 of the spine's ~269; the balance are already at or above floor, or are not phrased kinds | — | none until the envelope says otherwise |

---

# THE PROMOTION WATCHLIST (where the soak should look first)

Chronic kinds authored at 8 that are the likeliest to exhaust inside a season
window at their real firing rate, and so the first candidates for 10–12 under
J-LEG-3:

1. **The relationship-label family** — `allied` `neutral` `hostile` `cold_war`
   `patron` `client` `creditor` `debtor` `preferred_supplier` `critical_supplier`
   `military_supplier` `embargo` `proxy` `forced_tribute` `mediated_commerce`
   `ceasefire_commerce` `export_market` `relationship_label_change`. These render
   per DIRECTED PAIR, and a dense realm has far more pairs than settlements.
2. **The seasonal pair** — `harvest` and `hungry_gap`, which fire for every
   settlement every year without fail.
3. **The five divination pressure kinds** — `food_pressure` `disease_pressure`
   `crime_pressure` `legitimacy_pressure` `regional_pressure`, which are read as
   standing forecasts rather than as events.
4. **The six home-front kinds** — during any sustained war they fire weekly for
   every belligerent.

---

# WIRING NOTES FOR THE IMPLEMENTER (Sol)

*Order matters. LEG-1 through LEG-3 are byte-identical by construction; nothing
before LEG-5 may light a selector.*

- **LEG-1 — POOLS BEHIND THE SAME DOOR.** Turn `WHAT_PHRASES` into a pool map (or
  add `WHAT_PHRASE_POOLS` beside it) and keep `whatPhrase()` returning
  **`pool[0]`** until the flag lights. Index 0 is this file's variant 1 in every
  pool. Prove byte-identity with a same-seed golden BEFORE writing the selector.
- **LEG-2 — SEED THE SELECTOR ON THE RECORD, NEVER ON THE TICK.** A rumor must not
  churn its own words between two reads of the same event. Use the key the rumor
  already carries (settlement id + source event id), exactly as `warReceipt` seeds
  on the directed pair. THE PROMISE binds: a seed is a world, forever.
- **LEG-3 — GROW THE SIX REGISTRIES WITH THEIR PARALLEL ROWS.** Every §1 addition
  above carries its `requiredSlots`. Add the J-LEG-6 walker asserting
  `pool.length === requiredSlots.length` for every registry-backed kind, so this
  class cannot recur.
- **LEG-4 — RAISE THE WALKER'S FLOOR.** The registration walker asserts a pool
  exists; make it assert the CADENCE-KEYED floor (8/6/4), reading each kind's
  significance row. A kind below its floor must red the gate exactly as an
  unregistered kind does — that is the spine's own instruction.
- **LEG-5 — THE PER-KIND GOLDEN PLAN.** Not written here and not assumable. It
  lands at wiring, per J-POP-12 / J-INT-13's recorded-ruling pattern.
- **LEG-6 — THE ENVELOPE INSTRUMENT.** Rendered-sentence repeats per settlement
  per season-window, under an authored band, **with the mutant negative control**
  (collapse one pool to a single variant and prove the envelope reds). Without the
  negative control the instrument is unfalsifiable and proves nothing.
- **LEG-7 — OWNER-GATED, SEPARATE COMMIT.** The DEFECT-1/2/3 de-slugging and the
  DEFECT-8 digit retirement. Each replaces a live string rather than widening a
  pool, so each is a larger disclosed shift with its own golden. **Do not bundle
  either into a pool-wiring wave.**

---

*END — RECEIPT_POOLS_LEGACY.md · 200 kinds · 1,474 variants · 1,161 added
(1,099 authored + 62 merged in from `RECEIPT_POOLS_WAR.md` under J-LEG-7) ·
Fable 5, 2026-08-03.*





