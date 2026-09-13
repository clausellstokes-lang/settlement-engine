# SKELETON — DS-DEF-2 · pool `Internal Security: detention without process`

Marker: Fable 5.1, for the Fable chair (REWRITE car 8b, block DS-DEF-2). Dock read at `laneRW-DEF2` = f2da5a3ee (read only; nothing edited, nothing run beyond the licence-card script). STATUS: COMPLETE — four checkpoints on disk (section 0 with variant 1; variants 2 and 3; the pool whole); no section is pending. Every line here is a judgment against the card, the register card, MOVE-GRAMMAR, Part B and ADDENDUM 13 A and B; the earlier attempts' packets were read as DATA and are not followed.

## 0. THE CARD, THE READS, THE LAYERS (checkpoint 1)

### 0.1 The licence card, verbatim (`node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: detention without process'`)
```
LICENCE (block DS-DEF-2 · role spine · key `Internal Security: detention without process`)
  reads:      court   (not-produced)
              prison   (not-produced)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  (none recovered: the pool has no key-function branch)
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  may claim:  that `court` holds, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim about a deity
```
The census row (`docs/content/wiring-census.json`, block DS-DEF-2, this pool): `status: RESOLVED` · `keyFunction: internalRowPoolKey` · `rung: literal` · `reads: ["court", "prison"]` · `readsGrain: branch` · `predicate: []` · `absent: {court: not-produced, prison: not-produced}` · `variants: 3` · `grammars: 1` · `objectClasses: []` (the key string carries no `law` token, so the card prints no class-`law` bar here, unlike the `full legal chain` sibling) · `covert: false` · `sites: ["defense.threatAssessment"]` · `k: 1` · `source.holder: null`, `holderReason: "no mapping row resolves any field this pool reads"`, `standing: SOURCE-UNRESOLVED`.

### 0.2 THE CARD'S `may claim` LINE IS WRONG FOR THIS CELL — an instrument row, recorded here so no writer follows it
The card prints `may claim: that court holds` because the predicate was not recovered (the census `predicate: []`; `internalRowPoolKey` is "DELIBERATELY NOT TABLED", `defenseStateProse.js:369`) and the print falls back to `reads[0]`. The engine's own branch is the opposite: `src/domain/display/threatAssessment.js:144-151` — `if (hasCourtSystem && hasPrison)` → full chain; `else if (hasCourtSystem)` → court without detention; `else if (hasPrison)` → **`'Detention without systematic prosecution.'`**, THIS cell; `else` → no legal infrastructure. The key function `defenseStateProse.js:506-510` returns this pool key exactly when `court` is FALSE and `prison` is TRUE, both read as strict booleans through `civicFlag` (`:309`, `v === true`) off `compound.hasCourtSystem` / `compound.hasPrison` (`:657-659`). So the two reads this pool carries, as the engine holds them:
- **(P) `prison` = TRUE** — `compound.inst.hasPrison`, a substring flag over the live roster names `prison · stocks · large prison · massive prison` (`src/generators/priorityHelpers.js:54`). The shipped rows that light it: `Small prison/stocks` (town tier, `baseChance 0.7`, desc "Holding cells and public punishment", `institutionalCatalog.js:1564`; its services `Holding cells` p 1.0 "Short-term detention pending trial or payment of fines" and `Public punishment` p 0.8, `institutionServices.js:1635-1637`), `Large prison` (city, 0.7, `:2282`), `Massive prison` (metropolis, 0.5, `:2514`). No prison, stocks, pillory or gaol row exists below town (catalogue lines 6-922 grepped: none).
- **(L) `court` = FALSE** — `compound.inst.hasCourtSystem` false: NO live row named `courthouse · court buildings · democratic assembly · city hall · town hall` (`priorityHelpers.js:55`).
A writer who took the card's `may claim` line literally would write a false sentence. Recorded for the register car beside OW-21 (the card's referent column): the card's `may claim` print should follow the key function's branch, not `reads[0]`, on the four Internal Security pools. All three earlier attempts read the card the same corrected way; the correction is the engine's, not theirs.

### 0.3 REACHABILITY (a note for the chair, not a licence; the faces are written for the cell as the key names it)
`Town hall` is `required: true, baseChance: 1` at town (`institutionalCatalog.js:1550`); `City hall` and `Multiple courthouses` are required at city (`:2268`, `:2275`); every prison row is town tier or above. So `prison TRUE and court FALSE` cannot arise on a native roster at any tier: the cell fires only where a town-or-larger roster still carries its prison row and its required hall no longer counts (the desk refuter, `defense.refute.md:20`: "unreachable at city on a native roster (a ruin stamp can later remove …)"; `isLiveInstitution`, `institutionRoster.js:38-42`, drops `ruined · removed · destroyed · remnant`), and custom-content rows light no flag (`nativeSemanticName` returns `''` for them). Consequences for the writer: (i) the settlement is town-tier or above wherever this prints, but the TIER is not a read of this pool, so no face names a tier (W3 needs a read; there is none) — "the town" is the desk's generic and is safe; (ii) the hall's loss is HISTORY the pool does not read: no face says the hall fell, burned, was lost or was closed.

### 0.4 THE LAYER OF EACH READ (ADDENDUM 13 B, rules 1-2; the referent table rows 20-21, 49-50)
| read | layer of the READ | licensed nouns | refused nouns on this read |
|---|---|---|---|
| (P) `prison` TRUE | **BODY** (a flag over roster rows; the referent table row 21: "BODY: flag `hasPrison` only — no holder kind") | the gaol · a place of confinement · cells · "the prison" as the flag's own class word; the ACT the row means: the town can HOLD a person (D-16 ENTAILS "people can be held", HOLDS) | the stocks · the pillory (a member's name, not the class: the row may be `Large prison`); a gaoler, a warden, the keys, a turnkey (ROLE/PERSON: no role read); capacity, conditions, sentences, anyone currently held, a count (D-16 NOT ENTAILED); the gaol's funding or keeping (the ORDER purse, `defenseGenerator.js:244-252`, is not a read here) |
| (L) `court` FALSE | **NONE — an absence** (A.1: "an absence … no institution noun of any layer"); the class word "court" is licensed IN NEGATION ONLY, because the flag's falsity excludes every member row (courthouse, court buildings, assembly, city hall, town hall) — so "no court", "no court sits", "not before a court" are true on every member | no court · no court sits · nothing tried before a court · the town's law (a FUNCTION word, referent row 50: "enforcement · the law (function, never agent)") | "the court" affirmed; "courts" plural as buildings (D-F21's finding on the sibling); the hall, the seat, the council (W21 — no power slot is read; the hall is exactly the row that is absent); the magistrate, the reeve, the mayor, the elders (W22/W27: no role read, no elders kind resolves); "no process", "no settled way", "no law" as TOTALITIES over the town's procedures (the flag records building rows, never procedure) |
| the pool as a whole | no HOLDER (SOURCE-UNRESOLVED): **W24 — no record word at all** (no rolls, books, record, minute, writ); no POWER (no `{seat}`, no capture read); no ROLE; no EXTERNAL BODY; no TRADITION | the town · {settlement} · the country (not needed here) | the watch, the guard, the garrison, the soldiers (W20: bodies the read never reaches; D-F4 charged exactly this on the sibling `full legal chain` v2); "who", "whoever", "somebody", "one person's word", "on whose" (W22: a PERSON as the determinant of an institutional fact — the referent survey's D-F8/D-F9 findings on DS-DEF-6 `Prison only` "who is holding the keys" are this pool's exact shape) |

### 0.5 The block's header lines and the register card's six registers
- STATE-KEY: five fixed rows with a `scoreBand` badge, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. SLOTS: `{settlement}` `{band}` `{route}` — only `{settlement}` is FILLED at this block's call sites; `{band}` is RESERVED; no face names a band. SECTION-TARGET: `defense`.
- PROVENANCE + FENCE: "Institution presence is a STANDING fact with no recorded history; the causal clauses here are capability clauses … and never historical ones". That line DESCRIBES the shipped text; the card binds on cause (ADDENDUM 8 ruling 2) and refuses a second fact, so on this pool the "capability clause" allowance licenses nothing beyond the two reads; a conjunction of two flags computes no relation, and a spine takes none.
- The six registers, one line each (the register card): the dossier (the record itself; the clerk's third person; the town's name not the default opener) · the NPC ladder · the Herald · the chronicle · the DM page · chrome and the docent. This pool is DOSSIER, R1 STATE, a spine, the player face, no mark, `k: 1`.
- Composition fences this pool carries: a spine at one mount (`defense.threatAssessment`), modifier mounts 0 — today the composed unit at this mount is the spine alone, so each face is a whole passage by itself; the THREAD still binds a two-sentence face (its second sentence carries a noun forward from its first, R-i at k = 0). T-F8: no sentence face opens on `{settlement}` (a `proper`-typed slot of the bag) — so, stricter than wall 10, ZERO faces open on the slot. Zero em dashes, exclamations, questions, digits; no `, which` (a hard wall; R-DA-03; the brief).

### 0.6 The shipped rows, verbatim (annex `RECEIPT_POOLS_DOSSIER_STATE.md:2670-2673`)
1. `[ledger]` {settlement} can hold people and has no settled way of deciding whether it should, which makes enforcement here a matter of who is doing it.
2. `[visitor]` A stranger at {settlement} is careful in a way he would not need to be in a town with courts, and cannot say precisely why.
3. `[street]` The town can put a person away at {settlement} and cannot say on what grounds, and has learned not to ask on whose.

Three shipped variants; the card's angle set (ledger · street · visitor) matches the three tags one for one; `grammars: 1` (every row is one PRESENT sentence with tails).

---

## 1. VARIANT 1 `[ledger]` (checkpoint 2)

### 1.1 The shipped sentence, verbatim
> {settlement} can hold people and has no settled way of deciding whether it should, which makes enforcement here a matter of who is doing it.

### 1.2 Every claim, one per line
| # | claim | verdict | licence or the law it breaks | referent layer (claim / read) |
|---|---|---|---|---|
| 1a | the town can hold people (a capacity to confine, not an occupancy) | **LICENSED** | read (P) `prison` TRUE; D-16 ENTAILS "people can be held" (HOLDS); the modal "can" keeps it a standing capacity, never a count or a held person | BODY (the confinement is the flag's own act) / read (P) BODY — MATCH |
| 1b | the town has no court (the licensed kernel inside "no settled way of deciding") | **LICENSED** | read (L) `court` FALSE; stated as a LACK (MOVE-GRAMMAR §1.2 row 11 class (a); R-DA-02's LACK limb), never as the opener (wall 3) | NONE-absence / read (L) NONE-absence — MATCH, but only in the court-bound form |
| 1c | there is NO settled way AT ALL of deciding whether a person should be held | **UNLICENSED** — a totality; an observable the fields do not hold | the flag records five building rows, not procedure; nothing reads the elders kind, a headman, a custom, or any deciding body; "settled way" is a procedure word no field holds. The licensed compression is 1b: no court sits to decide it | NONE-procedure / read (L) is a building-row absence — MISMATCH |
| 1d | "which makes" — the two facts stand in a causal relation | **UNLICENSED** — a cause (`may NOT: a cause`); a `, which` tail (a hard wall: R-DA-03, MOVE-GRAMMAR wall 6, the brief's no-which-clause) | a spine takes no relation; no RELATION TABLE row joins two flags; ADDENDUM 8 ruling 2 (the card binds on cause) | n/a |
| 1e | enforcement here depends on WHO is doing it | **UNLICENSED** — a second fact (`may NOT: a second fact`); a standpoint on how power is exercised (`may NOT: a standpoint`); a PERSON as the determinant of an institutional fact (W22 "the person who", "whoever"; the referent survey's D-F8/D-F9 shape); "enforcement" as an observable dependent on its agent is held by no field (the function word itself is safe, referent row 50) | PERSON (never a referent) / the pool reads no ROLE, no POWER — REFUSED |
| 1f | (form) the sentence opens on `{settlement}` | form refusal, not a claim | T-F8 refuses a sentence face opening on a `proper`-typed slot; R-DA-17 the town's name is not the default opener | — |
| 1g | (form) "here" — the record's place-deixis | lawful | the clerk who was there; no claim | — |

### 1.3 THE READS THE REWRITE MUST STATE (every face of this variant)
- (P) a place of confinement stands and the town can hold a person — as the ledger enters a standing capacity (the modal or the office's formula "entered as standing", R-vi/W7), never a count, an occupant, a gaoler, a condition, the gaol's keeping.
- (L) no court — as a LACK after (P) (V3, PRESENT → LACK; or a two-sentence face where the second sentence carries "the town"/"the cells"/"a person" forward, R-i), in the court-bound form: no court sits, nothing goes before a court, no court to try or to name a ground.
- Plus the shipped sentence's LICENSED claims: 1a and 1b (both are the reads; the ledger adds nothing else lawful).
- The two reads are ONE keyed condition (ADDENDUM 8 R-v): stating both in one face is not "a second fact"; joining them by a CAUSE is.

### 1.4 THE ANGLE'S STANCE — `[ledger]`
The ledger is the clerk's way of entering the fact (W24: a STANDPOINT that licenses NO record noun and no citation; SOURCE-UNRESOLVED besides, so no "the rolls", "the books", "on record", "the count"): it may set the two facts down flat as standing, in the office's formula, measure nothing against nothing (no roll to measure against), and close on the civic thing (the cells, the court that does not sit, a person held). It may NOT say who confines, who decides, why, since when, how often, or what enforcement "is a matter of"; it may not name a hall, a watch, a magistrate or a purse (none is read).

### 1.5 THE TURNS WORTH KEEPING (verbatim, lawful under the card)
- "can hold people" — the plain modal of (P); lawful as it stands. Because T-F8 bars the slot as an opener, the clause is carried mid-sentence or after a lawful subject ("The town at {settlement} can hold people …", "At {settlement} the town can hold people …"), never as the shipped opener.
- Nothing else in this row is lawful: 1c is a totality, 1d a cause and a which-tail, 1e a person.

### 1.6 WHAT WOULD MAKE THE REWRITE A REGRESSION HERE
- An INVENTORY LINE (ADDENDUM 7 rule 3): "{settlement} keeps cells and no court." / "A person may be held at {settlement} and may not be tried." — the two reads with no ledger stance and no turn (the attempt-2 and attempt-3 shape, which the chair read as flatter than the shipped exemplar).
- A lost licensed read: a face with (P) and no (L), or (L) and no (P).
- A lost lawful turn: "can hold people" dropped for a plainer "has a prison" with no law behind the change (ADDENDUM 6, §21.4).
- A dropped angle: the ledger written as a bare civic fact with no entering formula, or written as the street's idiom.
- The breaches re-entering by another door: "whoever", "somebody", "the person who", "on whose word", "one judgment", "the keys" (W22); "so"/"because"/"makes" joining the two reads (a cause); "no process", "no law", "no settled way" as totalities; "the hall", "the watch", "the guard", "a magistrate" (W20/W21/W22); a record word (W24); "cannot be tried" as an absolute rather than "not before a court" (a totality over adjudication the flag does not record).
- Four faces that differ in vocabulary alone (W4: construction, not vocabulary).

---

## 2. VARIANT 2 `[visitor]` (checkpoint 3)

### 2.1 The shipped sentence, verbatim
> A stranger at {settlement} is careful in a way he would not need to be in a town with courts, and cannot say precisely why.

### 2.2 Every claim, one per line
| # | claim | verdict | licence or the law it breaks | referent layer (claim / read) |
|---|---|---|---|---|
| 2a | a stranger at {settlement} (the visitor's eye is on the town) | **LICENSED** as the stance only | `angle: visitor` names the standpoint; W27: "a stranger" is the visitor's eye — it may SEE, never act, decide, be told or be given a name; it carries no claim of its own | NONE (a stance, not a referent) / — |
| 2b | the stranger IS CAREFUL (a conduct, a wariness) | **UNLICENSED** — an assigned reaction (the register card: "no persona, no assigned reaction"); the FEELING non-move (MOVE-GRAMMAR §1.3); the stranger ACTING (W27); a standpoint (`may NOT`) | no field holds any visitor's conduct; the safety label is not a read of this pool and would be AGGREGATE anyway (W20) | PERSON-as-actor — REFUSED |
| 2c | this town has no court, unlike a town with courts | **LICENSED** in its kernel | read (L) `court` FALSE; the contrast names the sibling pool keys (`full legal chain`, `court without detention`), the one licensed CONTRAST (R-DA-02; wall 5) — never fronted, never the closing move of more than one variant per pool | NONE-absence / read (L) — MATCH; "courts" plural as buildings is refused (D-F21's finding on the sibling): the class word is singular, "a town with a court" |
| 2d | in a town with courts the stranger would NOT NEED to be careful | **UNLICENSED** — a second fact about the sibling state (a hypothetical conduct in another town: a forecast in the subjunctive about a person, not an edge of this town's state); the belief frame "need" | no field reads what a court would spare a visitor; the register's edge-subjunctive licence is for a STATE's edge (A2), not a person's conduct | PERSON / no read — REFUSED |
| 2e | "he" — the stranger is male | **UNLICENSED** — a particular no field holds (NL-4: a pronoun by `gender` only; the visitor has no field); an invented person | product scope: a person is never a referent | PERSON — REFUSED |
| 2f | the stranger cannot say precisely why | **UNLICENSED** — an interior state (FEELING); a person's incapacity (W22); the hook close (the register never closes on a hook; R-DA-04's kinds; MOVE-GRAMMAR wall 7: the last move is a standing fact) | nothing reads what a visitor can or cannot say | PERSON — REFUSED |
| 2g | (missing) the place of confinement | the shipped visitor never claims (P) | — | the rewrite must add it: see 2.3 |

### 2.3 THE READS THE REWRITE MUST STATE (every face of this variant)
- (P) a place of confinement stands — what the stranger's eye can SEE: cells stand at {settlement}; a gaol stands; the town has somewhere to hold a person. (The shipped visitor did not carry (P); the skeleton rule, ADDENDUM 7 rule (2), and ADDENDUM 8 R-v require every face to state all of the card's reads, and the two reads are one keyed condition, so adding (P) here is stating the key, not adding a claim. The earlier attempts' court-only visitor faces would fail the skeleton rule as inventory lines with a read missing.)
- (L) no court — what the stranger does not find: no court sits at {settlement}; nothing here goes before a court; a town with a court would have one to go to (the sibling contrast, 2c, kept in its kernel).
- Plus the shipped sentence's LICENSED claims: 2a (the stance) and 2c (the kernel of the contrast).
- Order: (P) before (L) (V3), or (L) as a negated surface after the stranger's arrival with (P) beside it; never (L) as a bare absence opener (wall 3); at most one negated-surface opener per variant (W10/R-ii).

### 2.4 THE ANGLE'S STANCE — `[visitor]`
The visitor is an eye passing through: it sees the cells and finds no court, and that is the whole of its licence (W27; W8: the visitor carries a read only as a thing's standing state, never as the town's act, never as an accounts fact). It may say what a stranger FINDS, MEETS, SEES, IS SHOWN NOTHING OF (an absence seen); it may name the sibling state as the thing not found here ("a town with a court"). It may NOT be careful, wary, uneasy, warned, told, surprised, or unable to say; may not be "he" or "she"; may not bring a complaint, a wrong, a grievance or a case (an act, and a second fact — the DS-DEF-2 `full legal chain` v3 "brings a complaint" shape is the sibling's, and it is an act); may not be directed by anyone (a person). The stranger's eye lands on the civic thing last: the cells, the court that is not there.

### 2.5 THE TURNS WORTH KEEPING (verbatim, lawful under the card)
- "A stranger at {settlement}" — the stance's opener; lawful as it stands and it does not open on the slot.
- "in a town with courts" — the sibling contrast kernel; lawful only re-cut to the singular class word, "in a town with a court" (so not verbatim; the shape is kept, the plural is dropped under D-F21).
- Nothing else: 2b, 2d, 2e, 2f are the stranger acting, feeling, gendered and unable to say.

### 2.6 WHAT WOULD MAKE THE REWRITE A REGRESSION HERE
- An INVENTORY LINE: "A stranger at {settlement} finds no court in the town." (attempt 3) — one read, no (P), the visitor's eye doing nothing an eye does; or "A stranger's complaint goes to no court" (attempt 2) — an act added.
- A lost licensed read: any visitor face that states the court's absence without the place of confinement, or the reverse.
- A lost lawful turn: the stranger's opener replaced by "Visitors …"/"A newcomer …" in all four faces so that the stance's own noun is gone (one face may vary the noun — the traveller, the newcomer — but the stranger is the register's word, W27).
- A dropped angle: the visitor written as the ledger (the office's formula) or as the street (the town's idiom).
- The breaches re-entering: "careful", "wary", "goes carefully", "keeps a caution", "not told why", "cannot name what is missing" (2b, 2f by another route — the attempt-1 shape); "he"/"she"; "courts" plural; a person who tells, directs, holds or decides; "the watch at the gate", "the hall" (W20/W21; no such read).
- Four faces built on one construction with the noun swapped (W4).

---

## 3. VARIANT 3 `[street]` (checkpoint 3)

### 3.1 The shipped sentence, verbatim
> The town can put a person away at {settlement} and cannot say on what grounds, and has learned not to ask on whose.

### 3.2 Every claim, one per line
| # | claim | verdict | licence or the law it breaks | referent layer (claim / read) |
|---|---|---|---|---|
| 3a | the town can put a person away at {settlement} (a capacity to confine, in the town's idiom) | **LICENSED** | read (P) `prison` TRUE; D-16 ENTAILS "people can be held" (HOLDS); the modal keeps it a capacity, never an occupant, a count or a sentence; "put away" is the street's word for the flag's act and asserts no member row (not "the stocks", not "the cells are full") | BODY (the confinement is the flag's act; "the town" is the settlement as possessor, the desk's generic) / read (P) BODY — MATCH |
| 3b | no court names the ground (the licensed kernel of "cannot say on what grounds") | **LICENSED** | read (L) `court` FALSE: the body that would state a charge and try it is absent; stated as a LACK after (P), in the court-bound form ("no court to name the ground", "nothing laid before a court") | NONE-absence / read (L) — MATCH only in the court-bound form |
| 3c | the TOWN cannot say on what grounds a person is held (an incapacity of the town; no ground exists at all) | **UNLICENSED** — a totality over the town's procedures; an observable the fields do not hold (no field records grounds, charges or their absence; the hall's Dispute arbitration service is a service of the absent hall and reads nothing about grounds) | the flag records five building rows; the licensed compression is 3b | NONE-procedure / read (L) is a building-row absence — MISMATCH |
| 3d | the town HAS LEARNED (a habit acquired over time) | **UNLICENSED** — a HISTORY move with no event-provenance field (the block's own fence: presence is a standing fact with no recorded history; R-DST-B/A6; MOVE-GRAMMAR §1.2 row 2); a belief frame (what the town has learned); a THIRD clause (R-DA-03: never a third; wall 6) | nothing reads a custom, a memory, an elders kind or any past | AGGREGATE-belief over persons / no read — REFUSED |
| 3e | the town does not ask ON WHOSE authority a person is put away — an unnamed person or power holds the confining word | **UNLICENSED** — a second fact; a PERSON as the load-bearing referent (W22: "on whose", "one person's word"); if read as a POWER, no power slot or capture read exists on this pool (W21/W20) and the interest it implies is the DM's channel (W26) | the pool reads two flags and nothing about who orders a holding | PERSON or POWER / no read — REFUSED |
| 3f | (form) a triple-clause sentence ("and … , and …") | form refusal | R-DA-03 (a qualification is a sentence, never a tail, never a third); the tricolon habit | — |

### 3.3 THE READS THE REWRITE MUST STATE (every face of this variant)
- (P) the town can put a person away — in the street's idiom (the town as subject; the plain verb: put away, lock up, hold, keep), as a standing capacity.
- (L) no court — in the street's idiom: nobody is tried here; nothing goes before a court; there is no court to take it to; a person is held and no court sits.
- Plus the shipped sentence's LICENSED claims: 3a and 3b (the reads, in the town's words).
- The two reads are one keyed condition (R-v); a face may set them side by side ("The town can put a person away and has no court to try one") and may not join them by a cause.

### 3.4 THE ANGLE'S STANCE — `[street]`
The street is the fact in the town's own idiom (W27: a stance, never a holder's record): the town as subject, the plain verb, the short line, the close on the civic thing. It may say what the town CAN do (hold, put away) and what it HAS NOT (a court), as the record holds them; it may use the town's word for the gaol's act. It may NOT say what the town knows, has learned, fears, asks or does not ask (a belief frame; a history; the register never assigns a reaction to a town any more than to a person); may not say "everyone here", "nobody here" (a totality over persons, a refused column); may not name who confines or on whose word; may not say the holding is unjust, arbitrary, or "without grounds" as a fact about grounds; may not reach for the purse, the watch, the hall or the elders.

### 3.5 THE TURNS WORTH KEEPING (verbatim, lawful under the card)
- "The town can put a person away at {settlement}" — lawful as it stands; the street's idiom for (P) and the density floor of this variant (ADDENDUM 6: a lawful shipped clause may stand verbatim as ONE of the four faces). Attempt 3 kept it; that was right.
- "cannot say on what grounds" — NOT lawful as it stands (3c); its licensed re-cut is the court-bound absence ("no court to say on what grounds", "and no court names the ground"), so the shape can be carried, the totality cannot.
- "has learned not to ask on whose" — nothing survives (3d, 3e).

### 3.6 WHAT WOULD MAKE THE REWRITE A REGRESSION HERE
- An INVENTORY LINE: "The town can take a person up at {settlement} and cannot take that person to court." is at the floor, not below it; "Someone can be held at {settlement} and no court is held." (attempt 2) is below it and carries "someone" (W22).
- A lost licensed read: a street face with (P) alone ("the cells can be filled") or (L) alone.
- A lost lawful turn: "put a person away" dropped from every face — the shipped idiom is the floor; keep it in at least one face.
- A dropped angle: the street written in the ledger's formula ("entered as standing") or with the visitor's eye.
- The breaches re-entering: "on whose word", "whoever", "somebody decides", "the word that made it" (W22 — the attempt-1 round-2 faces "answers to the word that made it", "whoever ordered the taking" are exactly this); "has learned", "never asks", "leaves alone", "does not put the question" (a habit or belief; a history); "no ground", "no grounds stated" as a fact about grounds (3c); "the town confines and names no ground" (the town as an agent naming, an act not read); "the stocks" (a member's name); a triple clause; a cause.
- Four faces that share a construction (W4) or an opener (A11: no two variants share their first two words; no two faces of one variant open alike).

---

## 4. THE POOL, WHOLE (checkpoint 4)

### 4.1 The reads, once (every face of every variant states both)
- **(P)** a place of confinement stands at {settlement}; the town can hold a person. BODY. Modal capacity only. Class words: the gaol · a place of confinement · cells · the prison (the flag's word); the street's verbs: put away · lock up · hold · keep.
- **(L)** no court at {settlement}. An absence (NONE); the class word "court" in negation only; stated as a LACK, never the opener, never beside another absence (wall 3); the court-bound forms: no court sits · nothing goes before a court · no court to try · no court to name a ground.
- The two are ONE keyed condition (`!hasCourtSystem && hasPrison`): state both; join them by no cause; add no third fact.
- Nothing is cited (SOURCE-UNRESOLVED; A13); no record word (W24); no body the read does not reach (W20); no person (W22); no power slot (W21); no tier word; no history of the hall; no purse.

### 4.2 The spread contract for the drafter (A11 · W4 · R-DA-04 · R-DA-05)
- Three variants, three constructions (`grammars: 1` today is the corpus fault the rewrite cures): the ledger as V3 PRESENT → LACK in the office's formula; the visitor as the eye's finding with the sibling contrast (V3 with the contrast kernel, or a two-sentence face under R-i); the street as the town-subject plain line (V3 in the idiom, the short line among them). No two variants share their first two words; no two faces of one variant open alike; zero faces open on `{settlement}` (T-F8).
- Close KINDS varied across the pool from R-DA-04's set: an object (the cells; a person held), an absence (no court; before no court), a prohibition (nothing tried here), a condition. Not the same kind on every face; never a pronoun close; never a hook.
- Rhythm follows load: the short line exists (the street's), the long one is one joint at most, the whole face two sentences at most (S2's guard).
- THE THREAD: a two-sentence face carries a noun forward (the town → the town; a person → that person; the cells → the court that is not there); the last sentence is a standing fact the table could act on (wall 7).

### 4.3 The shared hazards, in one list (each a FAIL with the bar named)
W22 "who is doing it" · "whoever" · "on whose" · "somebody" · "one person's word" · a gaoler, a warden, the keys · W27 the stranger careful, told, wary, unable to say, gendered · W20 the watch, the guard, the garrison, the soldiers, the magistrate · W21 the hall, the council, the seat · W24 the rolls, the books, the record, "on record" · totality: "no process", "no law", "no settled way", "no grounds", "everyone", "nobody" · cause: "which makes", "so", "because", "therefore" · history: "has learned", "since", "no longer", "was" · a which-clause · a third clause · "courts" plural as buildings · "the stocks" / "the pillory" (a member's name) · occupancy or count ("the cells are full", "those held") · the gaol's keeping or funding (the order purse is not read) · a tier word · a season · a future indicative.

### 4.4 Rows for the chair (recorded, not acted; nothing here is a writer's task)
1. **The card's `may claim` line prints the wrong polarity on this cell** (§0.2): `that court holds` where the key function returns this pool only when `court` is FALSE. A register-car row beside OW-21: the four Internal Security cards should print the branch (`internalRowPoolKey`'s else-if ladder) as the predicate, or at least `may claim: that prison holds and court does not`. The same defect will sit on `no legal infrastructure` (both false) and on `court without detention` (prison false), where the card's `reads[0]` fallback happens to read true.
2. **Reachability** (§0.3): on a native roster no tier can light this cell (every prison row is town+, where the hall is required); it fires only where the required hall is not live. Recorded as a census/desk fact for the register car; the faces are written for the cell as the key names it, tier-neutral and without the hall's history.
3. The earlier attempts' visitor variants stated (L) only, on a "never add a claim" reading; under ADDENDUM 7 rule (2) and ADDENDUM 8 R-v every face states both reads. If the chair reads "never add" the other way on a variant whose shipped sentence omitted a read, that is a ruling for the fold; this skeleton takes the skeleton rule as written.

### 4.5 Closing count
Variants marked: 3 (`[ledger]` · `[visitor]` · `[street]`), in the annex's order, vids unchanged. Claims tagged: 7 + 7 + 6 = 20 (including two form refusals and one missing-read row). LICENSED: 1a, 1b, 2a, 2c (kernel), 3a, 3b (kernel). UNLICENSED: 1c (totality), 1d (cause; which-tail), 1e (person; second fact; standpoint), 2b (reaction), 2d (hypothetical conduct), 2e (gendered person), 2f (interior state; hook), 3c (totality), 3d (history; belief; third clause), 3e (person or unread power). Lawful turns to carry: "can hold people" (mid-sentence); "A stranger at {settlement}"; "The town can put a person away at {settlement}". Reads every face must state: (P) and (L). Rows for the chair: 3.
