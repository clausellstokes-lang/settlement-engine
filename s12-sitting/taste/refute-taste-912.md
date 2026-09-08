Seat: Opus 5 — Fable-unvalidated (the verifier). Findings, never a pass; the chair rules on every row.

# REFUTATION OF THE TASTE SAMPLE (TASTE-SAMPLE-912.md), pairs ts-1 … ts-5

**Corpus.** The product tip in the dock `laneB6` at **3b1c0eaa51f77561a036ae7ec54682c39856192c** (`3b1c0eaa5`). The main working tree was never read for a corpus fact (tree law).
**Porcelain on the dock: 0 BEFORE, 0 AFTER.** (`git -C <laneB6> status --porcelain | wc -l` executed twice.) Nothing was written outside `MY/`; scratch under `MY/refuter-scratch/`.
**Method.** Every figure below comes from a command executed in this session. The two leaves were parsed to JSON by brace-matching (`MY/refuter-scratch/block.py`); the pair mechanics were recomputed with check-pair.mjs's own regexes re-implemented (`MY/refuter-scratch/measure.py`); `check-pair.mjs` was re-run on all three pairs files and reproduces the sample's §4 receipts VERBATIM, including the cut1 R4 FAIL; `gen-probe.mjs` was re-run READ-ONLY on both seeds from copies under `MY/refuter-scratch/`; two further read-only probes (`hist/h.mjs`, `hist/k.mjs`) imported the product's own `generateSettlementPipeline` and `foundedPoolKey`.

**Headline.** The five pairs are clean on the arms an instrument can see (slots, digits, em dashes, length, count and duration bands, the ration, the sentence ceiling, the future indicative) — I reproduced every one. They are NOT clean on claim preservation or on the honesty of their grammar labels. **Four of five carry at least one REFUTED item; three of the five grammar labels do not survive contact with the block's fields; and the sample's central two-seed demonstration for the GAP class rests on a probe artefact.**

---

## ts-1 — DS-POW-5 [ledger] index 0 — labelled **V5 INSTITUTION → PRESENT**

BEFORE (leaf index 0, located by exact string): *What governs {settlement} calls itself the {seat}, and the name is precise …*
AFTER: *The {seat} is what governs {settlement}, a title precise about the town's size and its pretensions, and one outsiders routinely mistake.*
Measured: words 24 → 21 · sentences 1 → 1 · opener `what governs` → `the {}` · slots `{seat, settlement}` → `{seat, settlement}` · closer `mistake` → `mistake` · DURATION added/lost none · COUNT added/lost none · CONTRAST shape 0 → 0 · no rationed word moved.

### (a) C-pair

| test | verdict | severity | evidence |
|---|---|---|---|
| the self-naming claim survives | **REFUTED** | **HIGH** | The BEFORE's assertion is *reflexive*: the governing body **calls itself** the {seat} — the title is the body's own designation, and the naming AGENT is the body. The AFTER asserts an identity — the {seat} **is what governs** — and names no agent at all. The self-designation claim is gone. Its cost is not cosmetic: the pool's other two variants are both about *who uses the title* (a stranger corrected for another; the town's two forms), so the ledger variant's job in the pool is to say whose name it is. This is index 0, **canonical-at-zero** (`stateProseKernel.js:298` `if (!seed) return eligible[0]`), so the claim moved on the line a falsy seed and the canonical projection render. |
| the object of "mistake" survives | **REFUTED** | MEDIUM | BEFORE: the name is precise *in a way outsiders routinely mistake* — what outsiders mistake is the MANNER of the precision (they misread how the name is exact). AFTER: *a title …, and **one** outsiders routinely mistake* — "one" is a title, so what outsiders mistake is now the TITLE. The manner is lost and the object of the verb changes. The sample's own claim list writes this as "outsiders routinely mistake **it**", whose vague pronoun conceals exactly the difference under test. |
| no claim added / no manufactured particular | CONFIRMED | — | Nothing enters that the BEFORE did not hold; "title" for "name" is sibling vocabulary already in the pool ("by any other title", "its proper title"). |
| no modality / threat class / band moved | CONFIRMED | — | No will/shall/would either side; DURATION and COUNT sets identical; no quantifier added. |
| internal coherence of the AFTER | **REFUTED** | MEDIUM | The appositive *a title precise about …* attaches to *The {seat}*, which the same clause has just asserted **is what governs** — so the sentence makes the governing BODY be a TITLE. Rendered on seed A: "The Guild Council is what governs Breitturm, a title precise about the town's size…". The BEFORE kept body and name apart ("calls itself the {seat}, and **the name** is precise"). |

### (b) U1–U12
U1 n/a (no contrast either side). U2 CONFIRMED (1 sentence). U3 CONFIRMED (no rationed word added; measured 0 → 0 on all nine patterns). U4 n/a. U5 neutral — the close is unchanged (`mistake`, a verb) and R-DA-04/B0.3 is not cited, so the "cited and not delivered" failure does not fire. U6 CONFIRMED (no cause fronted; A1's wall is untouched). U7 n/a. U8 n/a. U9 CONFIRMED (no gloss cut or created). U10 — **measured**, see (d)7 and the note below. U11 CONFIRMED. U12 CONFIRMED (no historical, spatial, capacity or actor clause added).

### (c) the grammar label
**PARTLY**, MEDIUM. The AFTER does open on the institution and does end on the present state, so the *order* claim is honest. Two corrections bind: (i) it is ONE copular clause with an institution SUBJECT, not two moves — V5's "INSTITUTION → PRESENT" is realised as a subject swap, which is also why it is hard to tell apart from ts-3 (see (c) overall, below); (ii) **A3**: `{seat}` is filled by `properFill(text(power.governingName))` (`powerStateProse.js:852`), i.e. a **proper** shape, and the AFTER puts it directly after the definite article in sentence-opening position. A3 says a rewrite "may not put a `proper` fill after an article". The BEFORE already does this mid-sentence, so the breach is relocated and fronted rather than created — but a rule the sample is demonstrating should not be fronted while unremarked.

**Worst finding: the self-naming claim is dropped on the canonical-at-zero line. REFUTED, HIGH.**

---

## ts-2 — DS-POW-5 [visitor] index 1 — labelled **V1 PRESENT**

BEFORE: *A stranger who addresses the {seat} at {settlement} by any other title is corrected, politely and immediately.*
AFTER: *A stranger who gives the {seat} at {settlement} any other title is corrected at once, and politely.*
Measured: words 17 → **17** · sentences 1 → 1 · opener `a stranger` → `a stranger` (unchanged) · slots unchanged · closer `immediately` → `politely` (adverb → adverb) · DURATION none moved · COUNT none moved · ration 0 → 0.

### (a) C-pair

| test | verdict | severity | evidence |
|---|---|---|---|
| "addresses … by any other title" → "gives … any other title" | **PARTLY** | MEDIUM | *Address X **by** title T* is an act of speech to X using T. *Give X title T* is conferral — applying the title to X, in speech about it, in writing, in a ledger. The AFTER's act is wider than the BEFORE's, so the class of stranger who gets corrected widens. The typed claim as the sample words it ("a stranger who **uses** another title is corrected") is broad enough to cover both, which is why the pair passes on the sample's own list; the correction is that the claim set was written loosely enough to absorb the change. |
| "immediately" → "at once" | CONFIRMED | — | Same claim. Neither is a §0d band word; measured, the DURATION set is identical before and after, so no band moved (U11 clean). |
| the correction is polite | CONFIRMED | — | Kept, moved to the close. |

### (b) U1–U12
U2 CONFIRMED. U3 CONFIRMED. U5 — the AFTER still closes on an adverb (`politely` for `immediately`); no gain, no citation, so no U5 breach, but no delivery either. U10 CONFIRMED (opener unchanged, so the pool's opener set is untouched by this pair). U11 CONFIRMED. U12 CONFIRMED. U1/U4/U6/U7/U8/U9 n/a.

### (c) the grammar label
**CONFIRMED that it is a single PRESENT move** — and that is the finding. The BEFORE is *already* V1; the AFTER is V1. On every measured axis the pair is a null edit: 17 → 17 words, 1 → 1 sentence, opener identical, adverb closer either way, ration and band sets identical. It demonstrates no structural variation while carrying a live claim risk (the row above). Under the sample's own purpose — "not a sentence rewritten well but ONE claim shown in more than one STRUCTURE" — ts-2 contributes the *absence* of a move, not a third grammar.

**Worst finding: the act widens from address to conferral, in an edit that buys nothing measurable. PARTLY, MEDIUM.**

---

## ts-3 — DS-POW-5 [street] index 2 — labelled **V4 OBJECT → PRESENT**

BEFORE: *The town at {settlement} calls the hall by its proper title in public and something shorter everywhere else, and both usages are precise.*
AFTER: *The hall at {settlement} goes by its proper title in public and something shorter everywhere else. Both usages are precise.*
Measured: words 23 → 20 · sentences 1 → **2** · opener `the town` → `the hall` · slots `{settlement}` → `{settlement}` (the variant carries NO `{seat}`) · closer `precise` → `precise`.

### (a) C-pair

| test | verdict | severity | evidence |
|---|---|---|---|
| the explicit agent "The town … calls" | **REFUTED** | MEDIUM-HIGH | This is not merely the standpoint. *The town calls the hall X in public and Y elsewhere* names WHO uses the two forms, and restricts the claim to the town. *The hall goes by X … and Y …* names no user and asserts general usage — the form the hall goes by, to anyone. The agent is dropped AND the usage is generalised, which is a claim widened, not a claim re-angled. Evidence it matters: the sibling [visitor] variant asserts that a stranger who uses **any other title** is corrected. Under the BEFORE the two coexist (the town's shorter form is the town's own). Under the AFTER, the hall generally "goes by" a shorter form everywhere else — which is what the [visitor] variant says gets you corrected. **The cut sharpens a sibling contradiction** (see (e)). |
| "both usages are precise" as its own sentence — fault 1 / R-DA-03? | CONFIRMED (not a breach) | — | It is a QUALIFY move, not a summary: the predicate *precise* is a second fact about the two usages named in sentence 1, not a restatement of them. R-DA-03 licenses exactly this ("the qualification gets its own sentence, never a tail"), and the two-sentence ceiling holds (U2: 2, measured). The residual is a taste question — the anaphoric *Both usages* sits near the register's measured second-sentence tic — which I record as WITHHELD, LOW: a human reader must judge whether it reads as a clerk's second fact or as a summarising beat. |
| no claim added | PARTLY | MEDIUM | See (c): the AFTER makes "the hall" the asserted subject. The hall is not invented (fault 24 is clear — "hall" is baked vocabulary elsewhere in DS-POW-5: `merchant_league [counterforce]`, `mixed [street]`, `theocracy [visitor]`, and in this variant's own BEFORE), but promoting it from a mid-sentence mention to the thing the sentence is about strengthens an unlicensed built-fabric claim (U12/R-DST-B). |

### (b) U1–U12
U2 CONFIRMED (2). U3 CONFIRMED. U5 close unchanged (`precise`, an adjective) — not cited, so no breach. U10 CONFIRMED on the arms measured: sentence spread 1/1/1 → 1/1/2 (gained), openers stay three distinct (`the {}` / `a stranger` / `the hall`). U11 CONFIRMED. **U12 PARTLY, MEDIUM** — the spatial/built-fabric claim promoted, as above. U1/U4/U6/U7/U8/U9 n/a.

### (c) the grammar label — **REFUTED, HIGH**
V4's licence is *a named object + the state key*, and MOVE-GRAMMAR §1.2 row 4 fixes the licensing field as **a named-object field: `good`, `assetId`, `resource`, a built-fabric field, a plant id**. The chair's own sitting (SITTING-RULINGS-912 §F.1) licensed V4 on this block by **{route}/{good}**. Measured at 3b1c0eaa5:

- the block's per-variant slot union is `{good, institution, route, seat, settlement}` — {good} and {route} exist **in other pools of the block**, never in this pool;
- the shipped composer's only DS-POW-5 read is `powerStateProse.js:895`, and it fills **`slots: { settlement: town, seat: governing }` and nothing else**. The file's own comment beside it states: {institution}, {route} and {good} "are deliberately absent — one variant each of forty, no producer, and anchored liveness drops them without costing a pool."

So **no object slot on DS-POW-5 is ever filled on the shipped surface**, and V4 has no field licence on this block at all — not the one the sitting granted, and not any other. The object the AFTER opens on, "the hall", is licensed **by the variant's own prior text and by nothing else**. Two aggravations: the pool key is literally *"governing body name: a SLOT, never a baked noun"*, and the rewrite promotes the baked noun to the subject position; and this variant carries no `{seat}` slot, so the sample's C-sibling sentence ("all three variants assert one governing body titled {seat}") is not true of it as written.

**Worst finding: V4's licence does not exist on this block as composed; the label is not honest. REFUTED, HIGH.**

---

## ts-4 — DS-GEN-14 [elder] index 0 — labelled **V8 PRESENT → GAP**

BEFORE: *Nobody wrote down the beginning of {settlement}; the town simply proved convenient, and convenience compounded.*
AFTER: *{settlement} proved convenient, and convenience compounded. Nobody set down its beginning.*
Measured: words 15 → 11 · sentences 1 → 2 · opener `nobody wrote` → `{} proved` · slots unchanged · closer `compounded` → `beginning` · DURATION none moved · COUNT none moved · ration `nobody` 1 → 1 (kept).

### (a) C-pair

| test | verdict | severity | evidence |
|---|---|---|---|
| "wrote down" → "set down" — the record's gap or the world's? | **CONFIRMED** | — | Both are recording verbs with a human subject; both state that nobody performed the act of recording. The AFTER is honestly **in the record**, which is R-DA-08's own distinction and the thing the task asked me to test. This is the pair's genuine strength. |
| "the town simply proved convenient" → "{settlement} proved convenient" | CONFIRMED | — | Same referent (the town IS {settlement}); no claim moved. |
| position and form of the GAP | CONFIRMED | — | R-DA-08 satisfied in all four of its stated limbs: written, in the record, **not the opener**, flat and alone as its own sentence, **replacing** the opener position rather than being appended, and shorter (15 → 11, the unwaivable LONGER arm clear). |
| no modality / count / band moved | CONFIRMED | — | `nobody` kept, so the COUNT arm reads no change (measured: COUNT sets identical). |

### (b) U1–U12
U2 CONFIRMED (2). **U3 PARTLY, LOW** — no rationed word is added (measured 0 → 0 on all nine patterns), but the pair's own rule text calls *"simply"* "a rationed word". It is not: A10's ration is the nine {rather than · which is/means · nobody/no one/nothing · its own · whatever · enough to · kind of/sort of · quiet(ly) · still/yet/already}, and `check-pair.mjs`'s RATION array is the same nine. Cutting "simply" is good craft; citing a ration it is not on is a false citation. U5 — the close moves from a verb (`compounded`) to a noun (`beginning`), which is B0.3's direction, though to an abstract noun (R-DA-04's `abstractNounRate` guard). **U10 REFUTED, HIGH** — see the next row. U11 CONFIRMED. **U12 NOTE** — *proved convenient, and convenience compounded* is a PAST clause on a key whose provenance field is null by construction (CLERK-LAWS C3); it is pre-existing in the BEFORE and is not introduced by the cut, but it is why the label's first move is wrong (see (c)). U1/U4/U6/U7/U8/U9 n/a.

**U10 in full, measured on the pool (not asserted).** The pool `GROWN-UNRECORDED` has k = 2 (elder [0], street [1]).

| axis | before | after |
|---|---|---|
| sentence counts | 1 / 1 | 2 / 1 — **spread gained** ✓ (the sample's claim, CONFIRMED) |
| two-word openers | `nobody wrote` / `{} was` | `{} proved` / `{} was` — distinct as strings ✓ |
| **variants opening on the settlement token** | **1** | **2** |
| close kinds | `compounded` (a condition) / `time` (a manner) | `beginning` (the gap) / `founded` (the gap) — **one kind** |

Two rules bite that no instrument reported. **R-DA-17**, whose figure is `settlement token 610 of 2,914 (0.209) → ≤ 0.167` with the explicit clause *"per pool at most one settlement-opener variant"*: the cut takes this pool from one to two and moves the register's figure the wrong way. `check-pair.mjs`'s A11 arm compares the **first two words** with slots normalised to `{}`, so `{} proved` and `{} was` differ and the arm stays silent — the receipt's clean A11 line is a true statement about a test that cannot see this. **R-DA-04 / MOVE-GRAMMAR's CLOSE** ("the close is a KIND drawn from a closed set"; §1.4 wall 5 bars a contrast as "the closing move of more than one variant per pool"): after the cut both variants of the pool close on the absence. A spread the sample does not measure is spent while a spread it does measure is gained.

### (c) the grammar label — **REFUTED, MEDIUM-HIGH**, on two independent grounds
1. **The first move is not PRESENT.** *proved convenient, and convenience compounded* is past tense. Under MOVE-GRAMMAR §1.2 that is a HISTORY move, which is licensed by an event-provenance field only — and on this key there is none. The honest label is HISTORY → GAP, and HISTORY is itself unlicensed here. (Inherited from the BEFORE, not created.)
2. **V8's licensing field does not exist.** V8 requires *"state key + a **not-held field with provenance**"*. Executed: `generalStateProse.js:623` reads `const key = !history.founding ? 'GROWN-UNRECORDED' : …`. The key is computed from the **falsiness of `history.founding`** — the block *merely lacking* the field, which R-DA-08's own text refuses as a licence ("licensed by a typed absence field, **never by the block merely lacking one**"). The block's declared slots are `{settlement, timeband_age}` — no absence field, no provenance field. And the chair's own sitting measured it: A12, *"no slot licenses V3 (none-exists), **V8 (not-held with provenance)** or V2 … anywhere"*. The sample writes two V8 pairs against its own census three sections later without reconciling them. Whether a typed STATE-KEY **value** may stand in for a not-held **field** is a rule question only the chair can settle; as the rules read today, the V8 tag is not honest.

**Worst finding: the pool's settlement-opener count goes 1 → 2 and its close kinds flatten to one, unreported by the receipt. REFUTED, HIGH.**

---

## ts-5 — DS-GEN-14 [street] index 1 — labelled **V8 PRESENT → GAP**

BEFORE: *{settlement} was never founded so much as agreed to, one household at a time.*
AFTER: *{settlement} was agreed to, one household at a time, and never founded.*
Measured: words 14 → 12 · sentences 1 → 1 · opener `{} was` → `{} was` · slots unchanged · closer `time` (noun) → `founded` (past participle) · DURATION set identical (`never` kept) · COUNT identical · **CONTRAST shape 0 → 0**.

### (a) C-pair

| test | verdict | severity | evidence |
|---|---|---|---|
| a modality spent | **REFUTED** | **HIGH** | *"never X **so much as** Y"* is a hedged comparative: it concedes a sense in which "founded" might be said and asserts that "agreed to" is the truer description. *"was agreed to …, **and never founded**"* is a flat, unhedged categorical negation of any founding act. The AFTER hardens a comparative into an absolute. B-CLAIM is explicit: a rewrite "may spend punctuation, word order and a rationed phrase; it may **not** spend a claim, **a modality**, a threat class, or a pool's spread." A hedge removed is a modality moved. |
| the sibling-licensed contrast is "KEPT" | **PARTLY** | MEDIUM | The *word* "founded" is kept, so the R4 arm is satisfied (verified: it fires on the first cut and not on this one). The *contrast* is not kept — it is dissolved into coordination. And no instrument saw either state: `check-pair.mjs`'s CONTRAST regex matches neither "never X so much as Y" nor "X, and never Y", so the measured antithesis shape is **0 → 0** and the R4-BAND WITHHELD channel never armed. U4's own lesson ("count the SHAPE, not the phrase") is live and unclosed on exactly this pair. |
| the record's gap vs the world's | **REFUTED on the label** (not on C-pair) | **HIGH** | *"and never founded"* is a claim about the **world** — no founding act occurred — not about the record. R-DA-08's form is "the gap … in the record never in the world." The world-claim is present in the BEFORE too, so C-pair does not lose anything here; what fails is the LABEL. The sample's rule text calls the closing clause "the record's absence of a founding act, stated flat", and it is neither in the record nor flat nor alone: it is a trailing coordinate inside another clause, with the adverbial *one household at a time* wedged between the auxiliary and the ellipsed second predicate. |
| the accretion claim | CONFIRMED | — | *one household at a time* kept intact; `never` kept, so no DURATION word added or lost. |

### (b) U1–U12
**U1 PARTLY** — see the contrast row; the keep is right, the mechanism that certified it is a word-presence test, not a contrast test. U2 CONFIRMED (1). U3 CONFIRMED. **U4 NOTE, MEDIUM** — the antithesis shape is invisible to the rubric here in both directions. **U5 REFUTED, MEDIUM** — B0.3 ("land on a noun") moves the WRONG way: the BEFORE closed on the noun `time`, the AFTER closes on the participle `founded`. U10 — the pool-level cost is booked under ts-4's U10 table (this pair contributes the second settlement-token opener's partner and the second absence-close). U11 CONFIRMED. U12 NOTE (past clause on a null-provenance key, pre-existing). U6/U7/U8/U9 n/a.

### (c) the grammar label — **REFUTED, HIGH**
All of ts-4's ground 2 (V8's licensing field does not exist; A12 measured it absent estate-wide) applies unchanged, plus two of ts-5's own: the first move is past, not PRESENT; and the GAP is neither "in the record" nor "flat and alone". The one thing the label gets right — and it is a real gain — is that the absence moves OFF the opener, satisfying wall 3 and R-DA-08's "never the opener".

**Worst finding: a hedged comparative hardened into a categorical negation — a modality spent. REFUTED, HIGH.**

---

## (c) OVERALL — ARE THE THREE DS-POW-5 GRAMMARS DISTINCT, OR THREE COSTUMES OF ONE SHAPE?

**REFUTED that they are three. MEDIUM-HIGH.** Reduced to move order:

| pair | subject | predicate | move order |
|---|---|---|---|
| ts-1 AFTER | *The {seat}* — the governing body | *is what governs {settlement}* | [nominal naming the body] → PRESENT |
| ts-3 AFTER | *The hall at {settlement}* — the governing body's building | *goes by its proper title …* | [nominal naming the body] → PRESENT |
| ts-2 AFTER | *A stranger who …* | *is corrected …* | PRESENT (one move) |

ts-1 and ts-3 are the **same two-move sequence**: open on a nominal denoting the governing body, predicate the standing fact about its title. They differ only in the TYPE LABEL attached to that opening nominal — INSTITUTION vs OBJECT — and the two nominals denote the same referent. ts-2 is a single PRESENT and is **structurally identical to its own BEFORE**. So the pool exhibits two move orders, one of which the rewrite did not produce.

Corroborating measurement: variants of the pool opening on an article go **2 → 3** after the cut (`what governs` / `a stranger` / `the town` → `the {}` / `a stranger` / `the hall`). The rewrite moved the pool's opening shapes toward uniformity even as the two-word-string test stayed clean. The one genuine reordering in the whole sample is ts-1's flip of the copular clause; the sample's other four pairs deliver a subject relabel, a null edit, and two absence relocations.

ts-4/ts-5 as PRESENT → GAP: **REFUTED** on the "PRESENT" half (both open past) and on the V8 licence (no `not-held` field with provenance exists — measured at the code that computes the key, and independently in the chair's own A12). The "GAP not the opener" half is **CONFIRMED for both** and is the sample's clearest real gain.

---

## (d) THE SAMPLE'S OTHER CLAIMS

| # | claim | verdict | evidence |
|---|---|---|---|
| 1 | Both seeds draw DS-POW-5 at indices 0 and 1 | **CONFIRMED** | Re-ran `gen-probe.mjs` read-only from copies under `MY/refuter-scratch/genA` and `genB`. Seed A → Breitturm, pop 2,921, 42 lines, DS-POW-5 `[ledger]` = index 0. Seed B → Langburg, pop 2,198, 40 lines, DS-POW-5 `[visitor]` = index 1. Matches the shipped JSONs byte-for-byte in substance. |
| 2 | Both seeds draw DS-GEN-14 at index 1 | **REFUTED as a fact about the towns; CONFIRMED only of the probe** | **HIGH.** True of the probe: both draw `GROWN-UNRECORDED [street]` = index 1. But `gen-probe.mjs` calls `general.generalStateProse(s, **{}**, opt)`, and `generalStateProse.js:1782` reads `const hist = readings.history && … ? readings.history : {}`. With an empty readings object `hist = {}`, and `foundedPoolKey({})` returns `GROWN-UNRECORDED` unconditionally. Executed against the real objects: **`foundedPoolKey(s.history)` = `FOUNDED-OLD` for BOTH seeds** (Breitturm `history.founding.age` 265, Langburg 244). The shipped caller passes `history: r.history` (`components/new/generalDeskRead.js`). The leaf's own comment at `generalStateProse.js:614` states GROWN-UNRECORDED "IS REACHABLE AND UNREACHED … the generator wrote one on 48 of 48 settlements." **So the GAP class is demonstrated on a pool neither seeded town reaches on the shipped surface.** Two consequences: the "same block under two seeds" for the GAP block shows the SAME variant twice (no variation at all), and ts-4 (index 0) is never drawn under either seed. |
| 3 | the draw formula quoted matches `stateProseKernel.js` | **CONFIRMED** | `stateProseKernel.js:304` is `return eligible[avalanche32(fnv1a32(\`${seed}::${blockId}::${poolKey}\`)) % eligible.length];` — verbatim. Note the preceding line 303, `if (!seed) return eligible[0]`, is the canonical-at-zero branch the sample states separately. |
| 4 | no `none-exists` field exists | **CONFIRMED** | `grep -rn "none-exists\|noneExists\|none_exists"` over the dock's `src` returns **0 hits, 0 files**. |
| 5 | V6's unresolved value exists only as display labels | **CONFIRMED (one citation path corrected)** | `LivingWorldTab.jsx:149` is `return { label: 'contested', color: RED };` — the file is at `src/components/**howto**/LivingWorldTab.jsx`, not the path A12's shorthand suggests. `AdvanceReport.jsx:51` is `held: GREEN, absorbed: SECOND, contested: AMBER, undone: RED, null: MUTED,` — a colour map. `"unresolved"` on the six state leaves occurs only inside prose text, never as a state value. |
| 6 | DS-POW-5's slot set is exactly {settlement, seat, institution, route, good} | **PARTLY** | MEDIUM. True as the **union of the per-variant slot lists** (measured: `good, institution, route, seat, settlement`). False as the block's **declared** `slots` field, which is **eight**: `settlement, seat, faction, counterpart, good, route, band, institution`. False as the **composed fill set**, which is **two** — `powerStateProse.js:895` fills `{ settlement, seat }` only. The distinction is load-bearing, because MOVE-GRAMMAR §3.2 makes the walker's arm D check a variant's tag "against its block's fields", and the three readings give three different admissible sets. This is what sinks ts-3's V4 (see above). |
| 7 | the pool's openers after the cut are three distinct two-word openers | **CONFIRMED** | Measured with check-pair's own normalisation: `the {}` · `a stranger` · `the hall`. (They were also three distinct before: `what governs` · `a stranger` · `the town`. No spread was gained on this axis; article-openers went 2 → 3.) |
| 8 | no AFTER is longer than its BEFORE | **CONFIRMED** | 24→21 · 17→17 · 23→20 · 15→11 · 14→12. Matches the sample exactly. |
| 9 | the checker's R4 refusal of the first ts-5 cut was correct | **CONFIRMED** | Re-ran `check-pair.mjs` on `pairs-gap-2026-09-07.cut1-FAILED-R4.json`: `#ts-5 FAIL … R4: CUT a word that names a SIBLING pool key: founded (siblings: FOUNDED-YOUNG \| FOUNDED-OLD)`. Correct on the instrument and correct on A8's law: DS-GEN-14's sibling pool keys are literally `FOUNDED-YOUNG` and `FOUNDED-OLD`, so the rejected alternative names a sibling key and the contrast is licensed. The chair's declaration of this failure is accurate, and I reproduce it. |
| 10 | the §4 receipts, verbatim | **CONFIRMED** | Both re-runs reproduce the sample's §4 block character-for-character, including `corpus loaded: 2734 variants in 1020 pools`. |

---

## (e) C-SIBLING, PER POOL

**DS-POW-5 `governing body name: a SLOT, never a baked noun` (k = 3) — REFUTED, MEDIUM.**
The sample states: "No variant asserts an office, a count, an exemption or a relation another denies." Two corrections.
1. A structural tension exists between [visitor] (*a stranger who gives the {seat} any other title is corrected at once*) and [street] (*the hall goes by its proper title in public and **something shorter everywhere else**, and both are precise*). It is pre-existing, but ts-3 **sharpens** it: the BEFORE confined the shorter form to the town's own usage ("The town … calls"); the AFTER makes it what the hall generally goes by, which is precisely what the [visitor] variant says draws a correction. A rewrite that widens a usage into a sibling's prohibition has spent sibling coherence.
2. The C-sibling sentence says all three variants "assert one governing body titled `{seat}`". The [street] variant carries no `{seat}` slot at all (its slot list is `["settlement"]`) and names its subject with the baked noun "hall".
Otherwise the three cohere in band, office, status, quantifier, geography, calendar and outcome, and differ lawfully in standpoint (the record · a stranger · the street). No count, exemption or relation moved.

**DS-GEN-14 `GROWN-UNRECORDED` (k = 2) — REFUTED, MEDIUM-HIGH.**
The cut **creates** a sibling contradiction that the BEFORE did not carry. After the cut, [elder] says *Nobody set down its beginning* — which presupposes there **was** a beginning that went unrecorded — while [street] says *and never founded*, a flat denial that any founding act occurred. That is a disagreement in **outcome**, a structural fact under CLERK-LAWS C5, and the small-particulars allowance (a name form, a date's shape, a wording) does not reach it. The BEFORE's hedge ("never founded **so much as** agreed to") was what kept the two compatible; hardening it broke the pair. The two variants also now share the settlement-token opener and a single close kind (see ts-4's U10 table), so the pool's lawful difference has narrowed to standpoint alone.

---

## SCORE

Counts are of the tests **explicitly graded** in the sections above (n/a and NOTE rows are not counted).

| pair | CONFIRMED | REFUTED | PARTLY | WITHHELD | worst finding | severity |
|---|---|---|---|---|---|---|
| **ts-1** | 8 | 3 | 1 | 0 | the self-naming claim ("calls itself the {seat}") is dropped, on the canonical-at-zero line | **HIGH** |
| **ts-2** | 7 | 0 | 2 | 0 | "addresses … by" → "gives" widens the act, in an edit with no measurable gain | MEDIUM |
| **ts-3** | 5 | 2 | 2 | 1 | V4's licence does not exist on this block as composed; "the hall" is licensed by nothing | **HIGH** |
| **ts-4** | 6 | 2 | 1 | 0 | the pool's settlement-token openers go 1 → 2 (R-DA-17) and its close kinds flatten to one; unreported | **HIGH** |
| **ts-5** | 4 | 3 | 2 | 0 | a hedged comparative hardened into a categorical negation — a modality spent (B-CLAIM) | **HIGH** |
| **(c) grammars** | 1 | 2 | 1 | 0 | ts-1 and ts-3 are one move order with two subject labels; ts-2 is unchanged | MEDIUM-HIGH |
| **(d) claims** | 8 | 1 | 1 | 0 | both seeds draw DS-GEN-14 → GROWN-UNRECORDED only because the probe passes `{}` readings; the real key is FOUNDED-OLD | **HIGH** |
| **(e) C-sibling** | 0 | 2 | 1 | 0 | the ts-4/ts-5 cut creates a sibling contradiction about whether a founding happened | MEDIUM-HIGH |
| **TOTAL** | **39** | **15** | **11** | **1** | | |

**The single worst finding in the sample:** claim (d)2. The GAP class — the sample's whole §3, two of its five pairs, and the demonstration the owner is being shown as evidence that absence can be written honestly — is exhibited on a pool that neither seeded town draws. `foundedPoolKey(s.history)` returns `FOUNDED-OLD` for both, and the leaf's own comment records that the generator writes a founding on 48 of 48 settlements. The demonstration is not wrong about the sentences; it is wrong about the towns.

---

## CURES PROPOSED (a cure never adds a claim)

**Every text cure below was EXECUTED through `check-pair.mjs` at 3b1c0eaa5 and passes every mechanical arm** (`MY/refuter-scratch/cures2.json`; receipt reproduced at the end of this section). My first draft of four of these FAILED the LONGER arm by one word each; the forms below are the re-cut ones, and the word counts are measured, not counted by eye. Offered as "test this, don't trust it" — the chair rules.

### The text cures

1. **ts-1 (HIGH) — restore the self-naming agent.** Two forms; the chair picks.
   - **1a, the minimal claim-preserving cut (24 → 22 words, PASS):** *"What governs {settlement} calls itself the {seat}, a name precise about the town's size and pretensions in a way outsiders routinely mistake."* Every claim of the BEFORE survives intact — the self-designation, the manner ("in a way … mistake"), both objects of the precision. It spends only punctuation and four words (", and the name is" → ", a name"), which is exactly what B-CLAIM licenses. It does **not** deliver V5's institution opener; under cure 9 that is the honest outcome for this variant.
   - **1b, the V5-ordered form that keeps the naming (24 → 24 words, PASS):** *"The {seat} is what {settlement} calls what governs it, a name precise about the town's size and pretensions in a way outsiders routinely mistake."* Opens on the institution as V5 requires, restores **who does the naming**, restores the manner, and removes the body/title conflation by returning to "a name". Equal length, so the LONGER arm is clear. It is the more strained sentence of the two; that strain is the price of the grammar, and it should be visible to the owner rather than paid for with a claim.
2. **ts-3 (HIGH) — withdraw the V4 tag, or move the pair to a block that licenses V4.** No claim is added either way.
   - **(i) Withdraw.** Re-tag ts-3 as V1 and state in the sample that V4 is **not drawable on DS-POW-5**, because the composer fills only `{settlement}` and `{seat}` (`powerStateProse.js:895` and the comment beside it). This makes the licensing-filter demonstration *stronger*, not weaker: the sample would then show members removed by fields rather than one member written on a licence that is not there.
   - **(ii) Relocate.** The sitting already named the fallback, `DS-ECO-11 :: "TERRAIN: Plains"` (k = 3, `{resource}/{good}/{institution}`). Before cutting there, verify **by the method used here** — read the composer's `slots:` argument, not the leaf's slot list — that the object slot is actually filled. The two are not the same set on DS-POW-5 and may not be there either.
3. **ts-3 (MEDIUM-HIGH) — restore the agent (23 → 20 words, PASS).** *"The town at {settlement} uses the hall's proper title in public and something shorter everywhere else. Both usages are precise."* Keeps the sample's two-sentence gain and its R-DA-03 move, restores the town as the user so the sibling [visitor] variant is not contradicted, and is three words shorter than the BEFORE. It also drops the V4 opener, which cure 2(i) makes moot.
4. **ts-5 (HIGH) — keep the hedge, keep "founded", keep the close (14 → 13 words, PASS).** *"{settlement} was agreed to more than ever founded, one household at a time."* Retains the sibling-naming word so R4 stays clear; retains the **comparative modality** ("more than") that the sample's cut hardened into a categorical negation; retains a DURATION word ("ever" for "never", neither added nor lost); keeps the absence off the opener; and closes on **"time"**, a condition, not on the absence.
5. **ts-4 (HIGH) — take the settlement token off this variant's opener (15 → 14 words, PASS).** *"The town proved convenient, and convenience compounded. Nobody set down the beginning of {settlement}."* Same claim set as the sample's cut, same two-sentence spread gain, absence still off the opener and still flat and alone — and the pool's settlement-opener count returns to one. It also lands the close on the town's own name, which is B0.3's direction delivered rather than cited.

**Cures 4 and 5 taken together — the pool measured before, at the sample's cut, and cured:**

| | openers | variants opening on the settlement token | sentence counts | closers |
|---|---|---|---|---|
| BEFORE | `nobody wrote` / `{} was` | 1 | 1 / 1 | `compounded` (condition) / `time` (condition) |
| the sample's cut | `{} proved` / `{} was` | **2** | 2 / 1 | `beginning` (**absence**) / `founded` (**absence**) |
| cured | `the town` / `{} was` | **1** | 2 / 1 | `{settlement}` (a name) / `time` (a condition) |

The cure keeps the one spread the sample gained (sentence counts) and returns the two it spent (the settlement-opener count, the close kind), at 14 and 13 words against 15 and 14.

### The declaration cures (no text moves)

6. **The V8 tag (MEDIUM-HIGH) — rule it, do not assume it.** Either (i) the chair rules in writing that a typed STATE-KEY **value** naming an absence (`GROWN-UNRECORDED`) is a lawful V8 licence — amending R-DA-08's *"never by the block merely lacking one"* and A12's *"no slot licenses V8 … anywhere"* in the same act, since `generalStateProse.js:623` computes the key from `!history.founding`; or (ii) the sample re-tags both gap pairs and declares V8 **NOT-EXECUTABLE** on today's data, exactly as it already declares V3/LACK. Option (ii) costs nothing and is consistent with the sample's own honesty about LACK.
7. **The label's first move (MEDIUM) — say "PAST" where the verb is past.** Both gap pairs open on a past clause, so neither is "PRESENT → GAP". Either re-tag the first move HISTORY (and carry the finding that HISTORY is unlicensed on a key with no event provenance) or print the tense beside the tag. A grammar tag a reader falsifies by looking at the verb is worth less than no tag.
8. **(d)2 (HIGH) — re-probe with real readings before the owner sees §3.** `gen-probe.mjs` passes `{}` as `readings` to the composers; `generalStateProse.js:1782` then defaults `hist` to `{}` and the DS-GEN-14 key is `GROWN-UNRECORDED` for any seed whatsoever. Pass the readings the shipped caller builds (`components/new/generalDeskRead.js`) and re-derive what the two towns really draw — measured, they draw `FOUNDED-OLD`. Then pick the GAP pool from what a town actually renders. If no shipped pool renders a GAP under either seed, the honest sample says so, and the GAP class joins LACK as declared-not-demonstrable at this tip.
9. **(c) (MEDIUM-HIGH) — show a genuinely different move order, or say the block cannot.** With cure 2, DS-POW-5's admissible set on the *composed* fill data is V1 and V5 — two members for three variants. That is a truer and more interesting statement than three tags, and it is the sitting's own A12 finding ("the latent grammar's variety on today's data is bounded by the FIELDS the blocks hold, not by the rules"). The sample is stronger for saying it than for demonstrating a third grammar the data does not license.
10. **(d)6 (MEDIUM) — print three slot numbers, not one.** Wherever the sample says "the block's slot set", print all three: the declared `slots` field, the per-variant union, and the composer's actual fill set. On DS-POW-5 they are **8, 5 and 2**, and the walker's arm D will have to be told which one it reads.

### Instrument gaps this sample exposes (for the walker lane, not for the chair's pen)

11. (a) an A11 arm on the **settlement-token opener count per pool**, not only the two-word string — it is what missed the ts-4 breach; (b) a **close-kind** arm per pool — it is what missed the ts-4/ts-5 flattening; (c) the CONTRAST regex extended to `never X so much as Y` and to a trailing coordinate negation, so a shape *dissolved* is not read as a shape *absent* (measured: ts-5 reads 0 → 0 today, in both directions); (d) a **tense** arm over the AFTER, so a "PRESENT" tag on a past clause fails mechanically; (e) a **licence** arm that reads the composer's fill set rather than the leaf's slot list.

### The cures' receipt (executed)

```
$ node check-pair.mjs <laneB6> cures2.json
#cure-1a PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [ledger]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/1
#cure-1b PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [ledger]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/1
#cure-3 PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [street]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/2
#cure-4 PASS(mechanical) DS-GEN-14 :: GROWN-UNRECORDED [street]
    · A11 SPREAD (sentences, pool "GROWN-UNRECORDED" DS-GEN-14, angles elder/street): 1/1 → 1/1
#cure-5 PASS(mechanical) DS-GEN-14 :: GROWN-UNRECORDED [elder]
    · A11 SPREAD (sentences, pool "GROWN-UNRECORDED" DS-GEN-14, angles elder/street): 1/1 → 2/1

corpus loaded: 2734 variants in 1020 pools; 5 pass mechanically, 0 WITHHELD (R4-BAND ...), 0 fail
```
Word counts, measured: cure-1a 24 → 22 · cure-1b 24 → 24 · cure-3 23 → 20 · cure-4 14 → 13 · cure-5 15 → 14. None longer. **A mechanical pass is not a claim-preservation verdict here either** — these are the refuter's proposals and the chair rules on their claims exactly as it rules on the sample's.

---

*Read-only throughout. No tree was edited, committed, checked out, stashed or reset; no vitest and no npm was run. `check-pair.mjs` and `gen-probe.mjs` were executed from copies or with absolute paths, with cwd under `MY/refuter-scratch/`; the only files written are this one and the scratch scripts and probe outputs beneath `MY/refuter-scratch/`.*
*Dock porcelain: **0 before, 0 after**. Product **3b1c0eaa5** unchanged.*
