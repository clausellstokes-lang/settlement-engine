# RE-REFUTE — the CURE · block DS-DEF-2 · pool `Beasts & Monsters: plagued, perimeter but NO force to hold it`

Seat: opus (re-refuter). 2026-09-13.
Test: ADDENDUM 14 as the Fable sitting re-cut it (ADDENDUM 18; `recut/CONTRADICTION-TABLE.md` §V, §V.0, the WHAT IS NO LONGER A FINDING header). A face is lawful unless it CONTRADICTS the record. Silence is permission.
Read: `card.md` whole · `speakers.md` · `cure.md` whole (its notes read as claims to test) · `refute.md` (the first sitting) · the cured rows at `73d32a1267c8` and the draft rows at `d794c3a78d6` in the DEF-2 dock · the shipped rows at `f2da5a3ee` · `recut/CONTRADICTION-TABLE.md`.

**Scanned: 3 spines + 28 faces = 31 units, every one of them rewritten by the cure.**
**Result: 0 FAIL · 0 WITHHELD · 31 PASS. Craft at the pool grain: PASS** (the DULL finding's own measures moved; the residual is named and quantified below).
**The two named FAILs are cured and the cures hold. The WITHHELD face is gone rather than adjudicated, and the chair's question is correctly no longer put.**

---

## 1. THE MEASUREMENT FIRST (ADDENDUM 18 ruling 35 — read the fingerprint before voting)

Run: `measure-block.py <DEF2 dock> docs/content/RECEIPT_POOLS_DOSSIER_STATE.md '### DS-DEF-2'`, and the same instrument's `pool_fingerprint` re-run over the annex at `d794c3a78d6` (the draft the first sitting ruled DULL) for the comparison.

| measure (this pool, 31 units) | DRAFT `d794c3a78d6` | CURED `73d32a126` |
|---|---|---|
| `say`/`says` occurrences | **28** | **15** |
| `, and that …` tail | **11 of 31** | **2 of 31** |
| distinct attribution forms | 3 (`says`/`say`/`holds`) | **7** (+ two faces with none) |
| distinct words / words | 243 / 748 | **254 / 741** |
| opener classes (kernel `openerClassOf`) | subject 28 · place 3 | subject 26 · place 3 · attributed 1 · fronted 1 |
| same-opener rate (adjacent repeats) | 0.167 (5) | **0.233 (7)** |
| words per sentence | 20.81 ±5.99 | 21.82 ±5.81 |
| attributions per sentence (strict) | 0.75 | 0.588 |
| self-citations (ruling 40) · forecasts (ruling 33) | 0 · 0 | **0 · 0** |
| pool content ratio (distinct content words / content tokens) | — | **0.518** |

And the pool against its own block, cured pools only (content ratio · subject-opener share · same-opener): `Disasters: granary AND hospital` 0.463 · 0.733 · 0.103 | `Beasts: frontier, credible deterrence` 0.469 · 0.829 · 0.176 | `Econ STRONG` 0.487 · 0.812 · 0.355 | `Internal Security: full legal chain` 0.488 · 0.774 · 0.167 | **THIS POOL 0.518 · 0.839 · 0.233** | `Beasts: frontier, force without a perimeter` 0.518 · 0.833 · 0.371 | `Internal Security: no legal infrastructure` 0.549 · 0.667 · 0.192.

**The figure that moved the craft vote: `say`/`says` 28 → 15 with the identical tail 13 of 28 → 2 of 31, which is the collapse the first sitting actually named, measured on the instrument's own counter.** The figure that qualifies it: the kernel's opener census barely moved (subject 28/31 → 26/31) and adjacency got worse (5 → 7). Both are reported; neither is a refusal.

---

## 2. THE MECHANICAL SCAN (clean, re-executed on the cured rows, not taken from the cure's notes)

Scanned the 31 units as rowed: **no em dash (0), no exclamation mark (0), no semicolon (0), no digit (0), no contraction (the three apostrophes are genitives — *the town's own*, *A stranger's goods*, *the court's own account*), no `will`/`shall` (0).** `{settlement}` in exactly ONE unit (spine 1) and in no `[face]` sub-row. **No self-citation** (`the survey`, `this office`, `the record has`, `entered as`, `set down here`: 0). **NO NAMED RECORD ANYWHERE** — no toll book, muster roll, parish books, "the accounts", "the books", "from the road": the citation ceiling on this pool is ZERO and the rows spend nothing (**but see WIRING 1: the shipped PROVENANCE detector reads the phrase `the elders say` as a holder-kind citation, and the cure took that phrase from two faces to three**). No `the guard`. No muster, militia or garrison as a speaker. No wall material word, so the `{defmaterial}` trap is untouched. No `Mayor`, `Guard Captain`, `High Priest`, `sexton` or singular `Elder` as subject OR attribution — checked face by face against `npcGenerator.js:1511-1537`; the draft's one slip is cured and no new one was introduced. No decay clock, no permanence, no date, no founding, no rate, no digit-or-word magnitude of the town's own state.

**The preimage re-checked for the wall word.** `DEFENSE_BUCKET_KEYWORDS.walls = ['wall','citadel','palisade','earthwork', …]` (`defenseInstitutionBuckets.js:84-87`) — `Gates (if walled)` matches NONE of them, so a gates-only town cannot set this key, and the tier catalogue offers `Palisade or earthworks` at thorp and `Town walls` at town and no citadel below city. **So *the line* and *the works* are safe across the whole preimage**, and the block ruling's "perimeter is FALSE of a Citadel / of Gates" cannot reach these rows. This was checked because the pool spends *the line* 14 times.

---

## 3. VERDICTS — one row per unit (face 0 = the spine)

### VARIANT 1 `[ledger]`

| f | source | verdict | floor | the field read | finding |
|---|---|---|---|---|---|
| 0 | spine | PASS | — | `config.monsterThreat` FROZEN (card §6) | Unchanged by the cure and still the key stated, not a body inferred out of its silence. *thick with creatures* is the band word's own sense (`plagued` = monsters), not a count. |
| 1 | gate | PASS | — | `Dwellings` / `Housing`, required at both tiers | Re-cut to attribution-mid (*whoever drops it says*). Tallow, a household, a smell. *to the first doors* is a landmark, not a distance band. The one physical particular v1 spends. |
| 2 | hall | PASS | — | `milUpkeepMult` · `defenseGenerator.js:182`, `:189-192` | NEW sentence. Model-TRUE and, importantly, **not F4-02**: the engine's one multiplier covers *"garrison wages, wall maintenance"* together, and this face does not split them — it says the keeping is a charge the town carries, which is the same purse said plainly. The hall seats at town only, so *the town* names no tier the strip denies. |
| 3 | watch | PASS | — | `defenseProfile.economicGates.military`, floored 0.6 | **The first sitting's WITHHELD face, rewritten.** *what the hall sends does not reach the far side of the line* asserts a SHORT share, not NONE: F4-04's licensed extreme (short, late, thin) is met, the hall's sending is affirmed rather than denied, and the pair stays genuinely unsettled. No decay clock rides on *the far side*. |
| 4 | guild | PASS | — | `Citizen militia` / `Household levy` *"no pay"* (`institutionalCatalog.js:104`, `:1344`) | The bare-assertion tail is cured by carrying the attribution to the end of one sentence. *in the season when the trades have hands to spare* is a condition, not a rate (F2-06 wants *every spring*). *see nothing back for them* agrees with the no-pay rows rather than breaching V-09. |
| 5 | stranger | PASS | — | `defenseProfile.scores.economic`, open at every value | A stranger's comparative opinion, and opinion is free. *could get nobody to name who pays* withholds; it denies no service of the `Town hall`. |
| 6 | register | PASS | — | `monster += 20 if hasWalls` · `defenseGenerator.js:202` (printed as the Beasts & Monsters rating, `defenseDisplay.js:306`) | **The pool's nearest approach to floor 4 — see the long note.** Passed: the yardstick the sentence names is the TOLL (*The country takes what it takes*), the engine holds no toll field, and `config.monsterThreat` stays `plagued` with the works up, which is the engine agreeing that the line did not change the threat. |
| 7 | court | PASS | — | `Town hall` → Dispute arbitration p 0.8 | *hears no other kind* is scoped by its own first clause (*What reaches the court FROM THE LINE*) and AGREES with the engine, which records a civil arbitration and no criminal trial. The machine string *"Arrest, prosecute, detain"* is engine prose and cannot charge a face (WIRING 3). |
| 8 | tavern | PASS | — | `Town watch` required at town — Gate duty p 0.8 · `institutionalCatalog.js:1348-1354` | **The first sitting's FLOOR 1 FAIL, cured and re-tested.** The exclusivity clause (*and for no other reason*) is gone, and with it the only thing that denied the duty. What remains is an IDENTITY claim — who the people at the bar are — and the row's own words are *"Part-time guards"*, so gate duty falling on part-time townsfolk who live nearest is the roster's own picture rather than its opposite. The cure holds. |
| 9 | market | PASS | — | `Market square` → Civic announcements p 0.8 (the *"in the square"* placement, town-only, card §2c) | The market source seats at town only, where the placement is stated, so no thorp invention. ⚠ craft: the second clause is now BARE (see CRAFT FINDING 2). |
| 10 | elders | PASS | — | `institutions[bucket=walls]` — the key's own read | *have always kept it* is the durative ruling 11b licenses over the key's own read. Plural elders. |

### VARIANT 2 `[visitor]`

| f | source | verdict | floor | the field read | finding |
|---|---|---|---|---|---|
| 0 | spine | PASS | — | the key | Unchanged. *no soldiers on it* states the key and does not call the required `Town watch` soldiers (F1-27 clean in both directions). |
| 1 | gate | PASS | — | `Town watch` → Night patrol p 1 | *what comes off the country comes without notice* is a claim about WARNING FROM OUTSIDE the line, which no row asserts; a night patrol inside the line is untouched, so the required row is not inferred away. *The road* survives every `config.tradeRouteAccess` value (F1-102 not reached). |
| 2 | hall | PASS | — | `Town hall` → Permit applications p 1 | Affirms the service. *the town's own* is safe because the hall seats at town only. |
| 3 | watch | PASS | — | `Town watch` *"Part-time guards"* | *in a town with soldiers* names a comparison class, not this place (F1-31 / V-03 not reached). *wanted back at a trade* is the row's own part-time sense. |
| 4 | guild | PASS | — | `Inn (multiple)` → Accommodation p 1 | *every price* / *never* are a factor's hyperbole inside attributed speech over a thing the engine holds no field for; *the bed inside the line* affirms the inn. |
| 5 | tavern | PASS | — | `Taverns (5-20)` → Drink service p 1 | A reported custom with no attribution verb, place-fronted: the form the first sitting's own brief asked for by name. Habitual present. |
| 6 | register | PASS | — | `Burial` p 1 at both tiers | The bare-assertion tail is cured by carrying *and that* across. Universal wording (*whoever buries the dead*), correct at both tiers. |
| 7 | market | PASS | — | `Weekly market` → Tax collection p 0.9 · `Town watch` → Gate duty p 0.8 | Affirms both: goods looked over at the bar is the gate duty in use, not its denial. Town-only source, town-only furniture. |
| 8 | court | PASS | — | `Town hall` → Dispute arbitration p 0.8 | Affirms the service; *nobody owes him a reason* is a WITHHELD reason, not a denial. *by the court's own account* attributes to a body, names no document (citation ceiling intact). |
| 9 | elders | PASS | — | no watch row at thorp | The elders seat below town, where no `Town watch` exists, so *let through without a question* infers no body away. Plural elders. |

### VARIANT 3 `[unfolding]`

| f | source | verdict | floor | the field read | finding |
|---|---|---|---|---|---|
| 0 | spine | PASS | — | the key | Unchanged. *keeps no company of its own* is the key; *nobody here gives a reason* withholds and asserts no absent body. |
| 1 | stranger | PASS | — | — | A report of inconsistent answers. No field is touched. An unnamed person acting is expressly licensed (W22a/W22b struck). |
| 2 | gate | PASS | — | `Town watch` → Night patrol p 1 | Still the careful form the first sitting held up as the measure: the claim is about what this person was TOLD, never about whether a patrol exists. |
| 3 | watch | PASS | — | `economicGates.military`, open below 1; `fundingNote` *"Upkeep underfunded"* can fire beside it | NEW sentence. *The hall has been told* is a perfect over a SPEECH ACT, not over `institutions[bucket=watch]` (LIVE, 38 writers), so floor 2's elapsed-course bar is not reached. *what the nights cost* carries no number and no purse. |
| 4 | hall | PASS | — | `Town hall` → Permit applications p 1 · Tax payment p 0.9 · Dispute arbitration p 0.8 | A deflection about the line, denying none of the three services. A genuine disagreement with face 3, and the engine records no answer to it — card §9's designed dispute. |
| 5 | tavern | PASS | — | — | An obligation asserted as the town's view. Opinion, and a speaker's opinion is never a finding. |
| 6 | court | PASS | — | `Town hall` → Dispute arbitration p 0.8; `hasPrison` read at both values | **A near miss, passed on the burden.** *the bringing is where the matter ends* is a claim about the REMEDY available in this matter (nobody can be ordered out to the line); the court is shown receiving the matter and holding a view, which is arbitration happening, not arbitration denied. The *"Fines and exile only"* / *"Arrest, prosecute, detain"* strings are engine prose (WIRING 3). |
| 7 | guild | PASS | — | `institutions[bucket=mercenary]` OPEN in both directions (card §5) | *a company of their own* is fixed by spine 3's *no company of its own* as the town's OWN standing force, which the key fixes false. A conditional, not a forecast (`FORECAST` counter: 0). |
| 8 | register | PASS | — | `Parish burial grounds` → Burial p 1 · the *"beyond the gate"* placement (town-only, card §2c) | Affirms burial; *the ground to be kept apart* is not the per-parish placement and invents nothing at thorp. |
| 9 | elders | PASS | — | `TIER_MANDATORY_ROLES` · `npcGenerator.js:1511-1537`; `Access to external mill` (required at thorp) | **The first sitting's FLOOR 3 FAIL, cured and re-tested.** *One of the elders says* → *The elders say*: no singular `Elder` is subject or attribution anywhere in the pool now. The mill row is affirmed exactly as before, *the same gap* counts no gates (F4-03 untouched), and *nobody has put up another way* is a perfect over a human act, not over a live roster field. |

---

## 4. THE LONG NOTE — THE POOL'S NEAREST APPROACH TO A FLOOR (v1 f6, register, PASSED)

> "the works have made no difference anybody can point to"

**Why it is worth the chair's eye.** The cure turned a WITHHOLDING into an ASSERTION: the draft read *and does not say whether the line has changed that*; the cured row says the works have made no difference. And the engine positively models the works — `defenseGenerator.js:202`: `if (inst.hasWalls) monster += 20;` — and that score is printed on the same tab as the pool's own prose (`defenseDisplay.js:306`, `'Beasts & Monsters': scores.monster`). Floor 4 refuses prose that denies a thing the engine positively models.

**Why it PASSES all the same, on three grounds.**
1. **The yardstick is named in the sentence, and it is the toll.** The clause it is joined to is *The country takes what it takes*, and the speaker is whoever buries the dead. The engine holds NO burial, casualty or toll field anywhere in the same-page read set (card §3). A claim measured against a quantity the record does not hold cannot contradict the record.
2. **`config.monsterThreat` is FROZEN at `plagued` with the works standing** — the key fixes exactly that conjunction. The engine's own model is that a perimeter changes the RESPONSE CAPACITY and not the THREAT, so a face saying the line did not change what the country takes is agreeing with a frozen field rather than denying a score.
3. **It is attributed and epistemically hedged** — *anybody can point to* is a claim about what can be demonstrated, and `scores.monster` is a capacity band no inhabitant reads. The 20 points are not decomposable on the page: at this key the rating is 8 (plagued) + 20 (walls) and nothing else, so no printed number shows the works' contribution for the sentence to contradict.

**What would have made it a FAIL:** dropping the hedge and the toll clause — *the works are worth nothing*, *the line has never turned anything back* — which asserts the capacity contribution's opposite with no other yardstick in the sentence. Recorded so the chair can overturn this deliberately, and so a later writer does not read the PASS as licence for the flat form.

---

## 5. THE CURE'S OWN CLAIMS, TESTED

| the cure's claim | verdict |
|---|---|
| "the two named FAILs are cured" | **TRUE.** Both re-tested above against the same fields. Neither cure introduced a new floor. |
| "the WITHHELD face is disposed of by the rewrite, not decided" | **TRUE, and correctly so.** *what the hall sends does not reach the far side* no longer forces the money reading the pair pushed onto the old sentence, so the chair's question is genuinely no longer put. |
| "say/says falls from 28 occurrences to 15 … seven forms" | **TRUE, measured: 15.** Forms counted in the rows: `says` 9, `say` 6, `holds` 6, `hold` 2, `reports` 1, `report` 1, `found` 1, `it is said` 1, `by the account of` 2, `by its own account` 1, and two faces with none. |
| "the identical tail is gone but for two" | **TRUE: 2 of 31** (was 11 by the same counter). |
| "subject-first: 8 of 28, was 24 of 28" | **MISLEADING, and the chair should know it.** That figure counts where the ATTRIBUTION sits. The kernel's own `openerClassOf` — the classifier ruling 35/36 speak through — reads **subject 26 of 31, down from 28 of 31**. The cure moved the attribution frame; it did not move the opener census. See CRAFT FINDING 1. |
| "244 distinct over 749 → 255 over 742 … the lexical spread is barely moved, and a chair who reads thin vocabulary as the residual risk is reading it correctly" | **TRUE and honestly stated** (my counter: 243/748 → 254/741). The honesty is itself worth the chair's note: the cure reports its weakest number without dressing. |
| "no `Mayor`, `Guard Captain`, `High Priest` or singular `Elder` — checked face by face this time" | **TRUE this time.** The draft's identical claim was false; this one holds against the rows as rowed. |
| "the citation ceiling is zero and nothing cites a record" | **TRUE of named records**, and qualified by WIRING 1: the shipped detector's holder-kind vocabulary counts *the elders say* as a citation. |
| "ten distinct speakers, the stake and the particulars survive" | **TRUE.** All ten seats kept; the tallow, the grain and the gap, the carrying on the finder, the bed inside the line, the stalls down while there is light — all present. |

---

## 6. CRAFT — AT THE POOL GRAIN: **PASS**

The DULL verdict of the first sitting named ONE collapse — one attribution frame — and gave it three numbers: 27 of 28 on `say`, 13 of 28 on one tail, one attribution verb in the whole pool. **All three are cured, on the instrument's own counters** (15 occurrences, 2 tails, seven forms plus two unattributed faces). The other DULL criteria are not met and were not met before: ten speakers, not three; faces that are twelve different things a person notices, not permutations; a pool with a real stake in it (the hall defending its purse, the watch's grievance, the guilds paying for nothing, the households owing work, a stranger who cannot get a straight answer) and two pairs that genuinely disagree; and it is decisively not duller than the three shipped rows it replaces, which say *"a chokepoint on paper"* and nothing about anybody. On the block's own distribution of cured pools the pool sits mid-pack or better on every fingerprint measure (content ratio 0.518 against a cured-pool median near 0.50).

**THE RESIDUAL, NAMED AND QUANTIFIED — craft findings at the face, reported not charged.**

1. **THE OPENER CENSUS DID NOT MOVE, AND ADJACENCY GOT WORSE.** Kernel classes: subject 26 · place 3 · attributed 1 · fronted 1 (was subject 28 · place 3). Same-opener rate **0.167 → 0.233** (5 → 7 adjacent repeats). The sharp instance the cure introduced: **variant 2 now closes on three consecutive faces opening *A stranger…*** (f7 *A stranger's goods*, f8 *A stranger stopped*, f9 *A stranger who comes in*), where the draft had no run of three. Under ruling 36 read on the kernel's classes this is the pool's one clear ordering fault, and the cure for it is ONE SWAP — put the tavern (f5) or the register (f6) between them; nothing needs rewriting. The face ORDER is the curer's own flagged decision (cure §8.1), so this is overturnable without touching a sentence.
2. **A NEW BARE-ASSERTION TAIL, where the cure removed two.** Variant 1 face 9 (market) was attributed in the draft (*A stallholder says … and that nobody needs telling why*) and is now unattributed end to end: *…and nobody at the market needs telling why* states an unrecorded fact about what people think, in the archiver's bare hand, which ruling 40 reserves for a fact the engine holds. The cure fixed exactly this shape at v1 f4 and v2 f6 and then wrote it fresh here. The face's first clause is a lawful reported custom; only the tail needs the attribution back (*the stallholders say*), and one of the pool's two attribution-free faces survives either way at v2 f5.
3. **One awkward parenthetical.** *whoever buries the dead holds* (v1 f6) uses `holds` as a parenthetical report verb where English wants `says`; ruling 20 asks for the plainest word that carries it. The pool needed the verb break at that position, which is why it is reported and not pressed.
4. **The one repeated opener the cure recorded and kept** — *One of the watch* at v1 f3 and v2 f3 — stands: different verbs, different variants, and no rendered page shows both.

**THE ECHO ROW, re-measured.** Variant 1's verbatim four-word echo (*are kept up* in the spine and in two faces) is **GONE** — the pair now argues about the charge and what it reaches, which is card §9's own dispute and needs none of the spine's predicate. Variant 2's *the way through* is down from four uses to two (spine + the gate face whose post it is). Variant 3's *company* echo is kept deliberately and is load-bearing: spine 3 fixes the sense of face 7's *a company of their own* as the town's own standing force, which the key fixes false, and breaking the echo would break the licence. I agree with all three dispositions.

**THE PAIRS.** Pair 1 (hall / watch) and pair 5 (watch / hall) are `disagree` and genuinely disagree; pair 6 (tavern / court) is `view` and is two readings of one obligation. Each pair's halves are different sources, and each pair's kind describes it. Pair 1 and pair 5 both read as single clauses after ruling 23's *, though* joint, so the `joinable` claim holds.

---

## 7. WIRING ROWS — the face stands, the seam is recorded

1. ⭐ **`the elders say` IS A PROVENANCE CITATION TO THE SHIPPED DETECTOR, AND THE CURE TOOK THE POOL FROM TWO TO THREE.** `moveGrammar.js:225`'s PROVENANCE limb includes `the elders (?:say|hold|remember|keep)` beside `the muster roll` and `from the road`; the holder table gives the `elders` kind the service *"Record of custom"* and the holders *Household elder, Village elder, Village headman, Town council* (`holderTable.js:331-337`). Card §7 says every thorp government row is `required: false`, so on a thorp of this preimage that citation can resolve to no seat at all — F1-24's surviving shape. **The face stands** — the denier is a detector's vocabulary and not a field on the town's dossier, and the CARD itself seats *the elders (plural, always)* as the below-town speaker family while ruling 40 requires an account to name its source through a role. **But three things make this worth a row:** (a) the batch-3 precedent is a packet refused WHOLE for one PROVENANCE match; (b) the exact-count arm that did the refusing reads spine text only (`proseMoveGrammar.walker.test.js`: `expect(cited.length).toBe(7)` over `loadStateLeaves()`, whose `text` is the spine — the faces live in `wordings` and are not walked there), so today the three occurrences are outside it; (c) `armA13` counts citations per pool on the REPORT channel over composed units, which DO include faces (`proseComposed.walker.test.js:1041-1059`). So the shape is reported, not refused, and the cure raised this pool's count from 2 (v1 f10, v2 f9 — both already in the draft) to 3 (v3 f9, introduced by the floor-3 cure itself). **The seam to re-cut is the detector's, not the prose's:** a role attribution that ruling 40 requires cannot also be a record citation F1-24 punishes.
2. **The engine commits, beside the prose, the very inference the sitting forbids the writers.** `threatAssessment.js:66` fires on this key at town — *"Walls exist but no organized force to sustain a watch rotation … holding it requires people, and there are not enough for sustained watch"* — and `:119` adds *"no organized military force to man them"*, printed on the same tab as a `Town watch` that is `required: true` with Night patrol p 1 and Gate duty p 0.8. Under §1.4's tie-break the ROSTER is the record, so the faces that agree with the roster stand and the collision is wiring. Restated from the first sitting because it is the seam that produced the pool's original floor-1 FAIL and will keep producing them on every WALLED-NO-FORCE key until the branch says what the key fixes (no garrison, no militia, nobody paid as a force) instead of inferring the body away.
3. **The legal-chain strings are prose, not fields.** `defenseDisplay.js:233` can print *"Full enforcement chain. Arrest, prosecute, detain."* or *"Courts without detention. Fines and exile only."* beside v1 f7 and v3 f6, whose claims are about what reaches the court from the line and what remedy this matter has. The stored fields (`hasCourtSystem`, `hasPrison`) assert neither, and the `Town hall` row's only service at the bar is `Dispute arbitration`. Recorded so a later refuter does not charge a face against a machine sentence.
4. **`threatAssessment.js:59`, `:66` hardcode *Palisade* and *watch rotations*** on branches that fire for ANY walls row, so at town the engine's own sentence can say palisade over a stone `Town walls` row (card §8's W-09). No cured face relies on either word.
5. **`safetyProfile.js:276`** can print *"the constant monster threat keeps the guard exceptionally well-drilled and alert"* on a town this key fixes as having no force. No cured face relies on it; recorded so a later face is not charged against it.
6. **The frozen/live seam, restated:** the key reads the LIVE roster (38 writers) while every machine sibling in card §4 reads the generation-time snapshot (zero writers). Equal at generation, divergent after a ruin. Never a contradiction at the face.

---

## 8. TO THE CHAIR

- **The cure is taken.** Two floors closed, the withheld ambiguity dissolved rather than argued, the named DULL collapse measurably broken, and the strongest content the first sitting ordered preserved kept intact.
- **Two things are left on the table, both one move each and neither a floor:** the three-in-a-row *A stranger* openers closing variant 2 (a re-order, cure §8.1 already flags the order as the curer's), and the bare tail at variant 1 face 9 (three words of attribution).
- **One seam is worth a car:** WIRING 1. A role attribution the law requires is read by the shipped detector as a record citation the law punishes, and the floor-3 cure walked the pool one step further into it.
