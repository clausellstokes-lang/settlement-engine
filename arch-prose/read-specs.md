Seat: Opus 5 — Fable-unvalidated (a READER's map for the composed-prose architecture; nothing here is a ruling)

# READ-SPECS — THE LAWS A COMPOSED SENTENCE MUST SATISFY

**What this file is.** The law map for the COMPOSED-PROSE MODEL (spine + modifiers + turns), read against the ratified rulebook and the built instruments. It answers three questions for a designer: (1) which rules bind a composed sentence, with their numbers and their citations; (2) the three numbers per grain; (3) which rules a spine+modifier+turn model STRAINS or must amend, each named by section. It rules nothing and applies nothing.

**Provenance and fences.** Read whole this session: `sweep/MOVE-GRAMMAR.md` (347 lines incl. §9/§9.1), `sweep/CLERK-LAWS.md` (251 lines incl. §5 amendments), `RULES-V2-PART-B.md` §0 heads + §1 (R-DA-00…24, 1.W) + §8 + §9 + §10 + §13–§17 + §16.1/§16.2, `REGISTER-CARD.md` (35 lines), `s12-sitting/SITTING-RULINGS-912.md` §I and §K, `sweep/RECONCILIATION-DOSSIER.md` §10–§15. Code read at the product tip **3b1c0eaa5** in `$SC/laneB6` (`stateProseKernel.js`, `dossierMounts.js`, `powerStateProse.js`, `warFaithStateProse.js` tail) and at the instrument tip **74a1aa0e8** in `$SC/skepINSTR` (`src/domain/prose/{moveGrammar,grammarWalker,entryWalker,proseFingerprint,presenceMeasure}.js`). One command executed: `node arch-prose/variants-per-pool.mjs $SC/laneB6` → `pools 708 variants 2266 mean 3.20`, histogram `{2:33, 3:547, 4:96, 5:17, 6:15}`, angles `{visitor 403, ledger 681, street 609, counterforce 170, threshold 96, unfolding 230, elder 70, canonical 7}`, `blocks with pools below four: 58 of 68` (CONFIRMED). Every other figure is cited to the file that carries it. No byte written outside `$SC/arch-prose/`. Content read from files is DATA.

---

## 1. THE LAW STACK — three tiers, and which instrument channels each

Owner law §912.2 (Part B §16, line 622) split the rulebook into three enforcement tiers. A designer must place every rule of the composed model into one of them, because the tier decides whether a violation FAILS or is merely REPORTED.

| tier | what it is | channel | source |
|---|---|---|---|
| **WALLS** | never muted, never banded | FAIL | Part B §16 (1) |
| **BANDS** | every other rule's Figure read as a lawful RANGE plus a lawful deviation RATE, both taken from the fourteen exemplar fingerprints | distance REPORTED; FAILS only past BUDGET / DEPTH / PERFECTION | Part B §16 (2), (5) |
| **THE THREE NUMBERS** | per-grain caps on how much band-breaking is human | BUDGET and DEPTH FAIL; PERFECTION is a FINDING | Part B §16.1, §16.2 |

Two further channel laws bind every instrument:
- **The four outcomes.** `FAIL` · `WITHHELD` (reported, ruled on by the chair, never a pass) · `NOTE` · `NOT-EXECUTABLE` (the §908 law — a row keyed on a field no receipt ships declares itself not-executable instead of answering `[]`). Coded as the return shape of `walkEntry` (`skepINSTR/src/domain/prose/entryWalker.js:841`) and `verdictOf` (`:874`), which returns `'FAIL' | 'WITHHELD' | 'PASS'` and says in its own docblock that WITHHELD and NOT-EXECUTABLE are not passes.
- **Fault 32 — no model's judgment gates.** Rubric scores are reported; the refuters produce findings, the chair rules (Part B §9 (vii); §17 line 632, which strikes the blind DM panel: the beta is the panel).

---

## 2. THE WALLS — the rules a composed sentence may never mute

Verbatim list from Part B §16 (1), line 622, each mapped to the instrument that fails on it and to what it means for a composed unit.

| # | wall | instrument arm | what composition must guarantee |
|---|---|---|---|
| W1 | every sentence licensed by a typed field (ruling 5; Part B §9) | entry walker C2 · C3 · C6 · D | every PIECE licensed, **and** the composed unit's emergent claims licensed (§8.5 below) |
| W2 | B-CLAIM — a rewrite may spend word order, punctuation and a rationed phrase; never a claim, a modality, a threat class or a pool's spread | C4 (entryWalker `armC4`, the quantifier × `closed` limb and `FUTURE_INDICATIVE`); `check-pair.mjs` :69–:129 | a connective may not add a claim; a joint may not add a modality |
| W3 | THE PROMISE — A7/A17: pool length, key, block id and index are seed inputs; a same-seed FACT shift is forbidden; a same-seed TEXT shift is declared and owner-signed | no runtime arm — placement law (CLERK-LAWS §2.5) | every new draw is a NEW key with its length fixed at birth; index 0 canonical |
| W4 | sibling coherence in structural fact (CLERK-LAWS C5) | entryWalker `armC5` (`:627 typedFactsOf`) | siblings of one cell agree in band-per-governed-noun; small particulars may differ |
| W5 | no digits (A4) and no em dashes (B-DASH) in prose | `check-pair.mjs:69` (`DIGIT in AFTER`, `EM DASH in AFTER`); kernel `isFilled` (`stateProseKernel.js:136`) rejects a numeric slot fill on purpose | the connective inventory loses the em dash (see §9, strain S12) |
| W6 | product scope — world-only, sub-century, never a named character's fate | MOVE-GRAMMAR §1.2 row 3; NON_MOVES.FORECAST (`moveGrammar.js:59`) | no turn reaches a person's fate |
| W7 | deity doctrine — faith is culture | MOVE-GRAMMAR §1.2 row 9 | a TRADITION modifier never carries theology |
| W8 | the audience law (A5; R-DA-01's no-you) | kernel law 2, `variantIsAudible` (`stateProseKernel.js:159`); `dm-only` truncates to silence | a covert modifier may never leak onto a player composition |
| W9 | the archivist never on chrome (CC-1) | register scope | the composed model does not cross to R9/R16/R10 |
| W10 | public and paid copy owner-signed | ledger act | every composed surface's text is signed at the walk |

**Two order walls are estate-wide and behave as walls inside a composed unit** (`moveGrammar.js:122` `WALLS`, scoped as SITTING B.4.1 ruled): W-O1 *STATE precedes CAUSE where both appear* (scope `*`), W-O2 *THRESHOLD/EDGE is always conditional or subjunctive* (scope `*`), W-O3 *ABSENCE never opens and never sits beside another ABSENCE* (scope `*`), W-O7 *the last move is a standing fact the table could act on* (scope `*`). Walls 4, 5, 6, 9 and 10 are **scoped** — 4 and 8 herald, 5, 6 and 10 dossier, 9 chronicle — so a composed model ported to another register does NOT inherit them.

---

## 3. THE TYPED MOVE VOCABULARY — what a piece may assert

`skepINSTR/src/domain/prose/moveGrammar.js:38` `MOVES` — the shape is `Record<string, {asserts: string, licences: string}>`, frozen. Eleven assertive moves plus two positional.

| move | asserts | licensing field (the drawability test) |
|---|---|---|
| PRESENT | the condition that stands | a standing configuration field: the STATE-KEY, a band, a tier, a posture |
| HISTORY | what happened; a closed span | an EVENT-PROVENANCE field ONLY |
| PERSON | an office-holder as office, at most one recorded act | a role: an office roll, `role`, `holderRole` |
| OBJECT | a named thing — the object, never the class | `good`, `resource`, a built-fabric field |
| INSTITUTION | who holds, who counts, who is counted, what it does | a row of the institution table; the predicate by a COLUMN value |
| CONTRADICTION | two records carry one fact differently | a provenance field carrying TWO accounts |
| CONSEQUENCE | what an event cost, on a household, trade or office | **double-licensed**: event provenance AND a household/office row |
| GEOGRAPHY | where; land, route, neighbours by name | a geography / terrain / route / dest field |
| TRADITION | a custom, a rite, a feast | a custom/rite/creed field |
| OPEN | a civic matter left standing open — never an interrogative | a state field whose value is unresolved/contested/pending |
| ABSENCE | what the record does not hold, or what the world has none of | LACK ← a `none-exists` field · GAP ← a `not-held` field with provenance · LIMIT ← a computed flag |
| CLOSE (positional) | the last move is a standing fact of a varied KIND | positional — a KIND, never a position rule |
| LABEL (positional) | the run-in label / pointer / route | the registry entry (chrome and docent only) |

**The licensing law under every row** (MOVE-GRAMMAR §1.1, R-DST-B/A6): *a standing configuration field licenses a STRUCTURAL clause and never a HISTORICAL one; only an event-provenance field licenses history.* A move whose licensing field is null **is not drawn and is not written empty** — the grammar member is filtered out for that block.

**The eight non-moves** (`moveGrammar.js:59` `NON_MOVES`, each with a `detect` RegExp — arm G's whole job): FORECAST (`/\b(will|shall)\b…/`), MEANING (the gloss / summarising second sentence), VERDICT, FEELING, FIGURE, SAYING; plus (spec-only, no regex) CAUSE-in-the-chronicle and a per-entry FRAME/VANTAGE. **MEANING is the one that bites the composed model hardest** — see strain S16.

---

## 4. THE GRAMMARS — level 1 (a variant) and level 2 (a tab)

`moveGrammar.js:90` `LEVEL1_ORDERS` — `Record<'V1'…'V8', {order: string[], licences: string}>`:

| id | order | licence | standing |
|---|---|---|---|
| V1 | PRESENT | the state key alone | live; **78.4 % of 1,986 classified lines over 200 towns** against a 10.7 % ceiling at n = 14 (SITTING §K.2) |
| V2 | PRESENT → CONSEQUENCE | state key + a STRUCTURAL-consequence field | live |
| V3 | PRESENT → ABSENCE (LACK) | state key + a `none-exists` field | the LACK class is **declared not demonstrable — no such field exists anywhere** (dossier §10 item 5) |
| V4 | OBJECT → PRESENT | a named object + the state key | live |
| V5 | INSTITUTION → PRESENT | an institution row + the state key | live |
| V6 | PRESENT → OPEN | a state field whose value is unresolved | **NOT-EXECUTABLE today — no typed field on a leaf** (SITTING A12; MOVE-GRAMMAR §9) |
| V7 | HISTORY → PRESENT (the joint chosen) | R2 only: event provenance + the state key | live in R2 only |
| V8 | PRESENT → ABSENCE (GAP) | state key + a `not-held` field with provenance | needs the typed absence-field class (owner-gated schema act, R-DA-08) |

`moveGrammar.js:107` `LEVEL2_ORDERS` E1–E6 (the tab's mount order) — **`changesShippedSurface: true`, OWNER-GATED under THE PROMISE** until the fingerprint-inputs receipt exists (Part B §10 item 12; PROSE_INVENTORY §7.9: display labels can be persisted hash inputs). Nothing draws it today.

**Pool-level spread law** (MOVE-GRAMMAR §2.1, A11 generalised): a pool of k variants carries `min(k, 8)` DISTINCT level-1 grammars, at least two in every pool of two or more.

**The `grammar:` tag** (`moveGrammar.js:145` `GRAMMAR_TAG_CONTRACT`): shape = a member id of `LEVEL1_ORDERS`, one per variant; annex form = a second bracketed tag `` `[grammar: V4]` `` riding `VARIANT_RE`'s optional group; leaf form = `"grammar": "V4"` beside `angle`/`marks`/`slots`; `movesWith` = `scripts/generate-dossier-state-prose.mjs` `parseTag()` **and** `tests/data/dossierStateProseProjection.contract.test.js` (the `--check` byte-compare), or the mark vocabulary silently gains eight members and `STATE_MARK_DIMENSIONS`' contract test reds. `seedSafe`: the tag changes no pool length, key, index or eligibility — `variantIsAnchored` reads `slots`, `variantIsAudible` reads `marks`, neither reads `grammar`. **Arm A gates on the TAG and only reports on untagged variants; the classifier measures 0.75–0.83 (20/24 exact) and never gates** (SITTING §K.2).

---

## 5. THE CEILINGS AND THE ARMS — the shape walker

`skepINSTR/src/domain/prose/grammarWalker.js`. Every number is an ARGUMENT with **no default**; a caller that supplies no shape gets `null` and the arm declares itself NOT-EXECUTABLE (`:97` docblock — a default would make a recommendation law by shipping).

```
ceilingFor(n, shape) -> number|null            // grammarWalker.js:97
  n <= 2  => null (NOT-EXECUTABLE)
  else    => min(1/n + shape.slack, shape.ratioCap / n)
            chair's recommended shape: slack 0.10, ratioCap 1.5
runCeilingFor(n, samples, shape) -> number|null // :112
  p = 1/n;  se = sqrt(p(1-p)/samples)
  => p + max(2*se, shape.runFloor)              // runFloor recommended 0.05
```

| arm | fn | reds on | recommended number |
|---|---|---|---|
| A — the ceiling | `armA` `:186` | any single order's share above `ceilingFor(n)`; the index-0 grammar histogram likewise | n measured **per tab after the licensing filter**; NOT-EXECUTABLE at n ≤ 2 |
| B1 — the run | `armsB` `:232` | same-order-as-previous above `runCeilingFor` **over the simulated reading sequence, never the pool dump** | 1/n + 2 SE, floor 1/n + 0.05 |
| B2 — adjacency | `armsB` `:232` | two adjacent mounts / tabs / treaty terms / quiet advances in one order or verbatim | "no more than chance" (the sitting corrected the earlier hard zero) |
| B3 — the rota | `armsB` `:232` | a successor distribution concentrating (a strict A→B→C→A cycle passes A and B1 perfectly) | no successor above 0.50 where n ≥ 3; row entropy printed |
| C-pair / C-sibling | entry walker | the AFTER carries the BEFORE's typed claim set; siblings cohere in structural fact | zero unresolved |
| D — the licence | `walkGrammar` `:592`, entry `armD` | a variant naming a slot the composer's bag for **(block, pool)** never fills — unreachable at every draw | zero; **114 such variants shipped today** (SITTING §K.4) |
| E — the spread | `armE` `:319` | a pool of ≥ 2 carrying one grammar; two variants sharing their first two words; uniform sentence count where they differed | pools uniform in grammar ≤ 0.30; uniform segment count R1 0.575 → ≤ 0.400; repeated opener 0.112 → ≤ 0.030 |
| F — the walls | `armF` `:357` | F1 cause-before-state · F2 bare future · F3 absence opening/adjacent · F6 three+ segments and the which-tail | zero |
| G — the non-moves | `armG` `:401` | any `NON_MOVES` detector fires | zero, with per-item skeptic adjudication |
| H — not-executable | throughout | a pool of one; a keyed cell with no draw; a register with no loader; n ≤ 2 | printed, never a pass |
| I / J | `walkGrammar` `:592`, `tenGaps` `:556` | arm I the unwritten slot (owed); arm J the FACT BUDGET (direction only) | see strain S3 |

**Per-register ceilings, as re-derived by the sitting** (Part B §10 items 1–6, superseding MOVE-GRAMMAR §2's fixed 0.35/0.40/0.60): the formula `min(1/n + 0.10, 1.5/n)` everywhere; chrome/docent 0.35 at n = 4 and 0.433 at n = 3; DM page the five shape-varying members at ≤ 0.30, no run beyond two; R5 n = 2 and **no share ceiling at all**; the ladder ≤ 0.07 lift-filtered.

**The reading-order caveat (MOVE-GRAMMAR §0, binding).** `sameOpenerAsPreviousRate`, `runsOfThreeSameLengthBand` and `neighbourVariation` are consecutive-pair statistics. For the estate they were computed over a POOL DUMP whose adjacent lines are siblings no reader meets together. Every consecutive-pair ceiling is measured over a **SIMULATED READING SEQUENCE** (the composed dossier over N ≥ 200 seeds). The dump figures are the authoring signal; the sequence figures are the verdict.

---

## 6. THE THREE NUMBERS, PER GRAIN

Set under the owner's delegation, MEASURED not invented, vetoable. Two measurements exist and they disagree by grain — that disagreement is itself the ruling (§912.7 / Part B §16.2, line 637).

**Measurement 1 — register level** (`s12-sitting/verify/three-numbers.py`; SITTING §I): the ten LEAF exemplar registers, 21 rate metrics, leave-one-out against the band formed by the other nine. Rules exceeded per record **min 1 · median 3.5 · max 7 of 21** (5 %–33 %); depth **median 0.11 · p90 0.52 · max 1.68** band-widths (the max is martin-narrative's dialogue share, a register-DEFINING feature); records at zero exceedances **0 of 10**.

**Measurement 2 — paragraph level** (INSTR-912 §2.6; SITTING §K.1): 113 exemplar paragraphs, each scored against the band of the other nine registers. Exceeded share **median 57 % · p90 67 %**; depth **median 0.25 · p90 1.75** band-widths; **0 of 113 at zero**. Applied per entry, the register-level numbers would fail essentially every human paragraph — the unsatisfiable-ceiling class.

| grain | BUDGET (share of soft rules a unit may exceed) | DEPTH (band-widths outside on any one rule) | PERFECTION | standing |
|---|---|---|---|---|
| REGISTER / TAB / POOL (aggregates) | **1/3** (7 of 21 today) FAILS above; **1/6** expected, REPORTED above | **0.5** | zero exceedances ⇒ FLAGGED SUSPECT | ruled §912.3, re-affirmed §912.7 |
| ENTRY (a paragraph) | **2/3** | **1.75** | same flag | **PROVISIONAL** — 3 of 10 registers, all Le Guin; the other seven raw texts no longer exist on the machine; re-measurement OWED (a research act, the owner's on cost and IP) |

Exemption: a metric a register DECLARES as its defining feature in its own Part A is exempt from DEPTH (`ThreeNumbers.definingFeatures`, `grammarWalker.js:433`). SPREAD (item 4) prints WHICH rules each unit exceeds; **a register whose units all exceed the SAME rules is flagged — uniform imperfection is the template.**

**The 21 soft-rule instruments** (`proseFingerprint.js:35` `RATE_METRICS`, frozen, in order): `wordsPerSentence.{shareUnder8, shareOver30, neighbourVariation}` · `punctuation.{semicolonRate, colonRate, emDashRate, questionRate, exclamationRate, parenthesisRate}` · `shapes.{antithesisRate, triadRate, participialOpenerRate, whichTailRate, doubledAdjectiveRate, adverbsPerSentence, thereIsOpenerRate, dialogueShare}` · `closers.{abstractNounRate, pronounRate}` · `openers.sameOpenerAsPreviousRate` · `runsOfThreeSameLengthBand`.

**The scoring shape** (`proseFingerprint.js:158`):
```
scoreAgainstBands(metrics, bands) -> {scored: string[], unscorable: string[],
  exceeded: Array<{metric, value, depth, side: 'under'|'over'}>}
  depth = (band.lo - value)/width  or  (value - band.hi)/width;  width = hi - lo
armThreeNumbers(paragraphs, bands, three, unit) -> GrammarReport   // grammarWalker.js:433
  three = {budgetShare, expectedShare, depthBandWidths, definingFeatures?}
  no bands supplied => NOT-EXECUTABLE;  fp.sentences < 2 => NOT-EXECUTABLE
```
The bands themselves live OUTSIDE the repo (the exemplar-derived material stays out; the walker takes them as an argument — SITTING §K.1, the lane's fence upheld).

**The presence measure — REPORTED, never a gate** (Part B §13.2; `presenceMeasure.js:103` `presenceOf(paragraphs)`): (1) concrete sensory nouns per hundred words from a published closed lexicon (`:37` `SENSORY_NOUNS`); (2) the share of paragraphs carrying a licensed texture device (`:87` `hasTextureDevice`); (3) the five-sense spread with its entropy. **It is never a gate on the rewrite and no rule acquires a size from it.**

---

## 7. B-CLAIM AND THE ENTRY WALKER — what a composed sentence may and may not assert

**B-CLAIM, stated** (MOVE-GRAMMAR §3.4; Register Card line 18): a rewrite may spend **word order, punctuation and a rationed phrase**. It may NOT spend: a **CLAIM** · a **MODALITY** (a subjunctive kept, a habitual kept, a future never added) · a **THREAT CLASS** · a **POOL'S SPREAD**. It is not licensed to drop a sibling-naming word (R4/R4-BAND) or a "That is" clause carrying the pool key's discriminating claim.

**The entry instrument** — `entryWalker.js:841`:
```
walkEntry(entry, ground) -> {fails, withheld, notes, notExecutable}
entry  : {id, text, block?, pool?, angle?, marks?, slots?, file?, line?, register?}
ground : {scope: 'estate'|'settlement',
          columns: Record<string, {closed: boolean, values: string[]|null, nullEverywhere?: boolean}>,
          rows?, joins?: string[], eventProvenance?: boolean, gender?,
          fill?: {declared: string[], variantUnion: string[], composed: string[]},
          siblings?: ProseEntry[]}
finding: {id, klass: 'C1'|'C2'|'C3'|'C4'|'C5'|'C6'|'D'|'Q'|'X'|'F25',
          arm, clause, column, value, sibling?, description}
```

| class | fails on | notes for a composed unit |
|---|---|---|
| C1 count vs count | two band phrases governing ONE count noun; a figure outside `QUANTITY_BANDS` (a cardinal ≤ 3 is WITHHELD, not failed — 3 is the lowest band ceiling) | a spine and a modifier that both band the same noun collide here |
| C2 duty vs exemption | an exemption on a null column; a count duty on an office/institution whose `whatItCounts` is empty. The duty context is **clause-local**, not entry-local | a composed unit can create a duty+exemption PAIR neither piece carried |
| C3 state vs provenance | a historical/causal/actor/capacity/spatial clause on a state-only block; a pronoun against `gender`; a year on `FOUNDED_UNDATED`. Semantic half WITHHELD | the connective must not make a state modifier read as history |
| C4 modality spent | a quantifier over an OPEN column; a bare future indicative | persons are **never** closed on any settlement |
| C5 sibling vs sibling | siblings banding one governed noun differently. The office and status limbs are **WITHHELD** (a measured retreat — without a subject a status word is not a structural fact) | today reads `ground.siblings` = the other variants of the SAME pool cell only |
| C6 relation gestured at | a relation lemma with an empty join set; NOT-EXECUTABLE where no join set is supplied | every relation the composition asserts needs a join edge |
| D licence | a slot the variant does not declare; a slot the (block, pool) composed bag never fills | keyed on (block, pool) — see strain S5 |
| Q qualify | WITHHELD: a second sentence naming no second field and carrying no band word | a modifier naming its slot passes by construction |
| X exhaustivity | WITHHELD: a specificational copula over an open column; self-naming WITHHELD by the chair's own ruling | |
| F25 citation | WITHHELD: no loader reaches a cited record's fields | |

**The four Brackwater fixtures** (CLERK-LAWS §2.4 as amended by SITTING B.4.7, built in car 1): (a) no rows — refuses office, duty, exemption, both quantifiers, and the FIGURE; (b) full rows, persons open — resolves every noun and still fails both quantifiers; (c) persons CLOSED (synthetic, unproducible) — the quantifier arm falls silent, proving it keys on the FLAG; (d) rows flagged `closed` at the ROW while the COLUMN is open — the only fixture discriminating per-column from per-row.

**The anti-vacuity guard.** The walker reds on the shipped breaches or the run is red for THAT reason. **Seven live breaches, not four** (SITTING §K.6): `newsVoice.js:97` · `RECEIPT_POOLS_DOSSIER_STATE.md:5233` + its leaf twin `general.generated.js:855` · `factionDynamics.js:466` · `causal::*::311#0` · three crier lines `VOICE_LINES::authority::{onset#3, relief#3, fade#3}` naming "the reeve's writs". All seven are the owner's at the walk.

**Where the walker runs — the gate, never the draw** (CLERK-LAWS §2.5; R-DA-20): `tests/lint/*.walker.test.js` over the leaves and the annex by raw bytes, plus the projection's `--check`. It NEVER runs at runtime, because `drawVariant` is `% eligible.length` and a draw-time refusal would change `eligible` and move every later index — a seed input under A7, owner-gated under THE PROMISE.

---

## 8. THE SEED AND POOL LAWS — the kernel's own contract

`laneB6/src/domain/display/stateProse/stateProseKernel.js` at 3b1c0eaa5, 357 lines, a pure headless leaf with no imports.

```
variantIsAnchored(variant, slots) -> boolean            // :146  every named slot has a non-empty string fill
variantIsAudible(variant, audience) -> boolean          // :159  'dm-only' truncates to silence for the player
STATE_MARK_DIMENSIONS = {severity:[minor,major,catastrophic],
                         deficit:[deficit,'no deficit'],
                         anchor:[anchored,'not anchored']}   // :192
eligibleVariants(pool, {slots, audience, dimensions}) -> Variant[]   // :247  fail-CLOSED on an unanswered dimension
fillSlots(text, slots) -> string|null                   // :280  any unfilled slot => null
drawVariant(eligible, blockId, poolKey, seed) -> Variant|null        // :301
  = !seed ? eligible[0]
          : eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length]
readStateProse(corpus, blockId, poolKey, options) -> {blockId, poolKey, angle, text}|null  // :318
```
Five kernel laws, verbatim in the docblock: **(1) anchored liveness** — no fill ⇒ `null` ⇒ the composer renders NOTHING, never a stub (R-DST-K); **(2) fail-closed audience**; **(3) the avalanche-mixed draw** (a raw FNV modulo left half a power-of-two pool unreachable — measured on wizard_news); **(4) seedless is canonical-at-zero**; **(5) the demoted state dimension, fail-closed** — a pool partitioned by a dimension the caller has not answered is UNREADABLE, because a wrong sentence is worse than none. `isFilled` (`:136`) **rejects a number on purpose**: §0d bans digits, so a numeric fill is a caller bug.

**The mount law (C3)** — `dossierMounts.js:26–52`: *a block's SENTENCE rung renders at exactly ONE position per settlement page-set*; other positions render GLANCE and DETAIL and no sentence. Held structurally by `rung` on every row and by `sentenceMountForBlock` answering at most one position; `tests/lint/dossierMountRegistry.walker.test.js` refuses two sentence rows for one block at build time. The one written exception is DS-GEN-6's tier overlay: two sentences from two POOLS of one block at one position.

**Growth law** (MOVE-GRAMMAR §3.2, §7.1; A7/A17): growth is NEVER an in-place append — appending moves every later index and changes what every existing seed draws. A sentence that must say something new goes in a **NEW POOL KEY by a chair act**, whose length is a seed input from its birth and whose index 0 is its canonical line. No existing key is renamed.

---

## 9. WHAT A SPINE + MODIFIER + TURN MODEL STRAINS — the core map

Each strain names the rule and the section that must be amended, or the design constraint that discharges it.

**S1 · THE UNIT PROBLEM — every per-variant size is anchored on today's unit.** Part B §1.0 states the unit law: PROBE figures are per VARIANT, fingerprint figures per SENTENCE, and three ceilings were already re-anchored once when the refuter caught the mismatch (R-DA-02's 0.0401, R-DA-03's 0.0066/0.0123, R-DA-06's 0.122). A composed unit is 2–3 variants joined, so `, which` ≤ 0.010/variant (R-DA-03), the antithesis shape ≤ 0.045/variant (R-DA-02), the elaborated GAP ≤ 0.020/variant (R-DA-08) and the rationed pet words ≤ 0.200 (R-DA-10) all mis-fire unless re-anchored on the composed unit. **AMEND: Part B §1.0 (the unit law) and every Figure it governs; §16.2's grain table gains a COMPOSED-UNIT row.**

**S2 · THE THREE-SENTENCE WALL vs "spine plus two modifiers" — the sharpest strain.** R-DA-03 (Part B §1) is *the qualification gets its own sentence, never a tail, never a third*; wall 6 (`moveGrammar.js:122`, dossier-scoped) is *QUALIFY never as a "which" tail; never a third sentence*; `grammarWalker.js:357` `armF` fails F6 on segment count and on a which-tail; `check-pair.mjs:78` fails at `THREE+ SENTENCES`. A spine plus two modifiers is three facts. The model has exactly three exits and each costs something: (i) modifiers as clauses inside ≤ 2 sentences — collides with the which-tail half of wall 6 and pushes `shapes.whichTailRate` (a soft rule) past its band; (ii) amend wall 6's sentence ceiling for a composed unit — a WALL amendment, the chair's, and it takes R-DA-03's Figure with it (`, which` 0.066 → ≤ 0.010; 2nd-sentence summary 0.035 → 0.000); (iii) cap the composition at spine + ONE modifier for the dossier and spend the second modifier only where a joint is licensed. **AMEND: Part B §1 R-DA-03 and MOVE-GRAMMAR §1.4 wall 6, together; the taste sample must show the chosen exit.**

**S3 · ARM J — THE FACT BUDGET — is the connective's licensing law.** Part B §10 item 13: *an entry's sentence count ≤ its count of licensed (move, field, value) triples plus its label/pointer units; **no sentence exists to connect two others***. A connective carrying a RELATION (tension, consequence, contrast) is precisely a device that exists to connect two facts. It is licensed only when the RELATION itself resolves to a typed triple — which is exactly the brief's own BOUND ("RELATION: only along the engine's causal edges"). **The design must make the relation a fourth licensed element with its own field, or arm J refuses the joint.** Arm J is direction-only today (spec deferred, chair M-5); the composed model is the thing that makes it executable, so its spec is a lane car.

**S4 · CONTRAST is the most-rationed of the four relations.** Wall 5 (dossier-scoped): *CONTRAST only where a sibling pool key or sibling band names the rejected alternative; never fronted as the subject; never the closing move of more than one variant per pool*. R-DA-02's direction is a 3–6× cut: `rather than` 0.113 → ≤ 0.020 per variant; the antithesis SHAPE 0.139 → ≤ 0.045 per variant; the fingerprint 0.1088 → ≤ 0.035 per sentence. `check-pair.mjs:82–87` counts the SHAPE, not the phrase, and its `R4-BAND` limb WITHHOLDS every contrast cut in a pool with sibling bands. **A "contrast" connective may not be licensed by a fact pair; it needs a sibling key or band. The design's connective taxonomy must say so, or the wave will manufacture the exact shape the wave exists to cut.**

**S5 · THE LICENCE ARM IS KEYED ON (block, pool) AND THE COMPOSITION MOVES THE SITE.** `entryWalker.js` `armD` reads `ground.fill.composed` — the slots the composer's bag actually offers for THIS (block, pool) — and fails a variant naming a slot the bag never fills (114 such variants ship today; SITTING §K.4). A modifier authored for block B and attached to a spine at block A's mount is licensed by A's bag, not B's. **AMEND: arm D gains a composition-site reading; SITTING §J gap (e) already names the (block, pool) key as the right one, so the amendment is an extension, not a reversal.** The upside is real: composition can revive some of the 114 by mounting them where the slot IS filled.

**S6 · THE C3 MOUNT LAW REFUSES A SECOND SENTENCE RUNG FOR ONE BLOCK.** `dossierMounts.js:26–52` and its build-time walker allow exactly one sentence rung per block per page-set. A cross-block modifier makes block B's fact speak at block A's position. Either the registry types a new **modifier rung** (a rung that is not a sentence rung), or modifiers are confined to pools of the SAME block (the DS-GEN-6 exception's shape: two pools of one block at one position, explicitly blessed). **AMEND: `dossierMounts.js`'s rung vocabulary and `dossierMountRegistry.walker.test.js`; the same-block confinement is the cheaper reading and is already precedented.**

**S7 · ADJACENCY WALLS MUST HOLD BY CONSTRUCTION, NEVER BY A DRAW-TIME FILTER.** Wall 3 (estate-wide): *ABSENCE never opens and never sits beside another ABSENCE*; `armF` F3 fails on both. Composition can put a LACK modifier beside a GAP spine. But CLERK-LAWS §2.5 and R-DA-20 forbid a runtime refusal: a filter that removes a candidate changes `eligible.length` and moves every later index — a seed input. **So the composition algorithm must make the adjacency impossible deterministically at candidate-set construction (a typed move-class exclusion fixed at the freeze), and that candidate set's length is a seed input from its birth.** Any later change to the exclusion rules re-rolls every installed world: a declared, owner-signed TEXT shift.

**S8 · THE WORDING FAMILY MUST BE ELIGIBILITY-IDENTICAL, or the one-in-four is not one-in-four.** The owner's ~22:30 rule quadruples every semantic variant. `eligibleVariants` (`:247`) filters by `variantIsAudible` (marks), `variantIsAnchored` (slots) and the demoted dimensions before `drawVariant` takes `% eligible.length`. **Therefore every face of a wording family must carry the IDENTICAL `slots` array, the IDENTICAL `marks` array (audience mark and dimension words alike) and the identical licensing claim set** — otherwise a face drops out on some towns and the family's faces are drawn at unequal rates, which is a weighted draw wearing an unweighted one's coat. This is a checkable authoring law and belongs in the family's definition. (It also answers the brief's two-level question: with eligibility-identical faces, a flat draw over the wording list and a two-level draw are distributionally identical; the flat draw needs no new key, the two-level draw does.)

**S9 · POOL LENGTH ×4 IS A DECLARED SAME-SEED TEXT SHIFT, AND IT IS THE ONLY LAWFUL FORM OF GROWTH.** A7/§7.1: growth is never an in-place append. Quadrupling a pool is a length change, so every installed world re-rolls `% poolLength` for that pool. The brief already books this as the declared, owner-signed TEXT shift; the migration car proves wording-only on the golden sample. **The corollary the design must state: the re-roll happens ONCE. A later fifth wording on one pool re-rolls it again — so a family's size is fixed at the freeze, and "never trim" must be paired with "never append after the freeze; a new wording goes in a new key."**

**S10 · COMPOSITION DOES NOT CURE THE BLOCKS THAT HOLD ONE FACT.** `ceilingFor` returns `null` at n ≤ 2 (`grammarWalker.js:97`). Today **33 of 68 blocks license exactly ONE level-1 member** and **22 blocks hold only `{settlement}`** (SITTING §K.5, correcting A12's 20); six of thirteen tabs hold one block, so tab-order variation is "not applicable" today (dossier §10 item 6). A modifier needs a SECOND typed fact; where the block holds none, composition has nothing to attach. **The lever is the authoring wave (§912.1 / Part B §15), sized from the unrendered-facts census: 72 facts held by the six composers, 13 rendered as a word, 59 KEY-ONLY (82 %) — an UPPER bound on the opportunity, not a count of dark facts** (SITTING §K.8).

**S11 · SALIENCE MUST BE A PURE FUNCTION OF STATE AND SEED.** The kernel's own contract: *"Eligibility is a function of the state alone, and the draw is a function of the seed and the pool identity alone"* (`stateProseKernel.js` docblock, THE PROMISE paragraph). A salience score that reads anything else — a clock, a render counter, a mutable cache — breaks same-seed stability. A tie broken by seed is a NEW hash key and therefore a seed input from birth. **Design law: `salience(state) -> ranked candidates`, deterministic; ties broken by a documented new key; the scoring weights fixed at the freeze (a weight change re-orders and is a declared text shift).**

**S12 · THE JOINT IS THE SCARCEST RESOURCE.** The connective inventory is nearly exhausted by the walls before design begins: the **em dash is banned estate-wide** (B-DASH; `check-pair.mjs:69`; `punctuation.emDashRate` is a scored soft rule); the **which-tail is a wall** (wall 6); the **semicolon is rationed** (R-DA-06: R2 0.360 → ≤ 0.130, anchor tolkien-elevated 0.122); the **colon HOLDS at one joint per variant** (R-DA-06); a **period costs a sentence** (S2); a **participial opener** is band-floored at 0.0117 ≤ 0.020 (R-DA-18). **The design must publish its connective set with each member's band and its licensing relation, and count joints per composed unit as its own figure.**

**S13 · EVERY PUBLISHED ESTATE FIGURE IS A PRE-COMPOSITION FIGURE.** Joining two variants changes `wordsPerSentence.*`, `neighbourVariation`, `sameOpenerAsPreviousRate` (a modifier's opener stops being an opener) and the closer statistics. The simulated reading sequences (`grammarWalker.js` §4.1 item 4) must be regenerated over COMPOSED units before any consecutive-pair number is quoted. The figures that will move: the settlement-token opener **700 of 2,914 = 0.240** (dossier §10 item 1, correcting 0.209), `sameOpenerAsPreviousRate` 0.1321, `runsOfThree` 0.3202, `neighbourVariation` 0.399, words-per-sentence sd 7.2, and V1's 78.4 % run share. **The design must schedule a re-measure car and must not re-use a dump figure as a composed figure.**

**S14 · ARM Q IS SATISFIED BY CONSTRUCTION IF EVERY MODIFIER NAMES ITS FIELD.** `armQualify` withholds a second sentence that names no slot and carries no band word. A modifier keyed on a secondary fact will name that fact's slot or its band. **Design law: a modifier whose surface names neither a slot nor a band word is not licensed — it is the summarising beat, which is the machine's own signature.**

**S15 · A TURN ON A STATE SPINE IS REFUSED WHERE IT NEEDS PROVENANCE.** CONSEQUENCE is **double-licensed** — event provenance AND a household/office row (`moveGrammar.js:38` row CONSEQUENCE; R-DA-19). R-DA-19 forbids the event move in R1 STATE outright (no provenance field there). So a turn keyed on a typed explanation is drawable only where the explanation carries provenance — R2, the annex event rows, R8 — or it must be recast as V2's **structural** consequence (what the arrangement costs the town as a STANDING fact, never an event). **AMEND nothing; but the design must type its turns into two classes and refuse the historical class on a STATE spine.**

**S16 · THE NAMED TURN IS ONE STEP FROM THE `MEANING` NON-MOVE — the model's most dangerous piece.** The brief's example turn is a NAME for a combination ("the gate is sold"). `NON_MOVES.MEANING` (`moveGrammar.js:59`) exists because *no field holds what a fact means; a second sentence is a second FACT of a varied kind or nothing*; R-DA-03 drives the 2nd-sentence summary rate 0.035 → **0.000**; R-DA-12's generalisation test makes the gnomic closer the lowest-ceiling close kind with its **baseline run BLOCKING** before any ceiling is set; VERDICT is a non-move. **A turn is lawful only where the ENGINE holds the named combination as a typed explanation with its own field — the brief's own rule ("keyed on the engine's typed EXPLANATIONS, never on raw fact conjunctions") is exactly the line, and it must be enforced by an arm, not by authoring discipline.** Without that arm, a turn is a MEANING move with a good vocabulary — the failure mode the owner named in his own words.

**S17 · THE WALKED ENTRY MUST BE THE COMPOSED UNIT, AND THAT MAKES THE GATE SAMPLED.** CLERK-LAWS §2.1: *the walker takes ONE ENTRY at a time — a rendered unit with its typed context*. Composition can create a claim no piece carries (an office noun in the spine + a duty verb in the modifier = a C2 pair). So the freeze gate must walk COMPOSED units. But the composed space is combinatorial, so the gate becomes a SAMPLE over the 200-town run, while R-DA-20's SIZE is *zero unresolved over 2,734 R1/R2 variants and 4,626 A-U rows*. **AMEND R-DA-20's SIZE to two figures: zero unresolved over every PIECE in isolation (exhaustive, as today) plus zero unresolved over the enumerated compositions of the N-town sample (sampled, with N and the sha printed).** A sampled gate that calls itself exhaustive is the false-green instrument the estate has already burned.

**S18 · UNIFORM COMPOSITION IS THE TEMPLATE WEARING IMPERFECTION'S COAT.** §912.3 item 4 (SPREAD) flags a register whose units all exceed the SAME rules; the PERFECTION CEILING flags a unit with zero exceedances. If "the floor is a spine plus up to two modifiers" is implemented as "always two", every unit has the same shape and the SPREAD arm fires on the whole register. **Design law: the modifier COUNT varies (0, 1, 2) as a function of how many salient secondary facts the town actually holds — the variation must come from the DATA, which is fault 35's law restated: nothing at render time produces variation.**

**S19 · REGISTER SCOPE.** Walls 4, 5, 6, 9 and 10 are scoped (`moveGrammar.js:122`; SITTING B.4.1). A composed model exported to the Herald, the ladder, the chronicle or the DM page inherits only walls 1, 2, 3 and 7 plus that register's own rules (Part B §2–§5), its own ceilings (R5 has none; the ladder's is ≤ 0.07 lift-filtered; the DM page's ≤ 0.30 with no run beyond two) and its own absence dialect (Part B §8).

**S20 · THE `grammar:` TAG VOCABULARY DOES NOT COVER A COMPOSED UNIT.** `GRAMMAR_TAG_CONTRACT.shape` is *a member id of `LEVEL1_ORDERS` (`V1`…`V8`), one per variant*. A composed unit realises an order that is not a member. Either the unit's order is DERIVED from its pieces' tags (spine tag + ordered modifier tags), or the tag vocabulary is extended — and any extension moves `parseTag()` in `scripts/generate-dossier-state-prose.mjs` and the `--check` byte-compare in `tests/data/dossierStateProseProjection.contract.test.js` **together, or the mark vocabulary silently gains members and `STATE_MARK_DIMENSIONS`' contract test reds** (`GRAMMAR_TAG_CONTRACT.movesWith`).

---

## 10. WHAT THE MODEL GETS FOR FREE

Rules the composed model satisfies by construction, so the design should claim them rather than re-engineer them:
- **Fault 35 / ruling 3** — the grammar is authored into the pieces and the seed only chooses; no sampler, penalty or style instruction is involved (MOVE-GRAMMAR §3.1). A composed model is the purest form of this.
- **Ruling 4 (the full form)** — a modifier whose licensing field is null is simply not a candidate; nothing is written empty (MOVE-GRAMMAR §1.1; §5.2 rule 2).
- **The seedless canonical line** — index 0 of each new list is the canonical composition, so `--check`, the census and the print path stay stable (kernel law 4, `stateProseKernel.js:301`).
- **The audience law** — a `dm-only` modifier is filtered by `variantIsAudible` before the draw, so the covert seam never leaks provided S8's eligibility-identity law holds.
- **Arm E (the spread)** — a pool whose variants differ in modifier count differ in segment count and opener, which is exactly what `armE` (`:319`) asks of a pool.

---

## 11. OPEN QUESTIONS

1. **Which exit does S2 take** — modifiers as clauses inside two sentences (paying `shapes.whichTailRate` and colliding with wall 6's tail half), an amendment to wall 6's three-sentence ceiling for composed units, or a hard cap of spine + ONE modifier in the dossier? This is a WALL question and therefore the chair's, put to the owner if the amendment reaches R-DA-03's Figure.
2. **Is a composed unit a new GRAIN for the three numbers** (§16.2 gives REGISTER/TAB/POOL and ENTRY only), and if it is an ENTRY, do the provisional 2/3 and 1.75 hold on a unit that is 2–3 authored pieces rather than one hand's paragraph? The per-entry numbers are already provisional on ONE author's texts (SITTING §K.1).
3. **Arm J's spec** — what counts as a licensed (move, field, value) triple for a RELATION, and does a connective consume a triple or ride the modifier's? Direction only today (Part B §10 item 13; chair M-5).
4. **Same-block or cross-block modifiers** (S6)? Same-block is precedented by DS-GEN-6's tier overlay and needs no registry change; cross-block needs a new rung class and moves `dossierMountRegistry.walker.test.js`.
5. **Does the composed unit's claim set equal the union of its pieces' claim sets, or can a composition assert more?** C-pair's equality (Part B §10 item 7) is written for a rewrite pair; the composed analogue is unwritten.
6. **Flat draw over all wordings of all eligible variants, or two-level (variant then wording)?** With S8's eligibility-identity law they are distributionally identical; the flat draw needs no new key and no new seed input, which is the cheaper answer under THE PROMISE — but the design must state it and prove the identity law is enforced at authoring.
7. **How is the modifier candidate list's LENGTH frozen** (S7/S9), and what is the migration car's proof that the one-time re-roll is wording-only on the golden sample?
8. **The turn arm** (S16) — what instrument proves a turn is keyed on a typed explanation and not on a fact conjunction? `src/domain/explanation.js` and its feeders were NOT read by this reader; the seam is the architect's §5 and needs its own census before any turn is authored.
9. **Where does the sampled composed gate get its N**, and does the anti-vacuity guard need composed fixtures (a composition that manufactures a C2 pair) beside the seven shipped breaches?
10. **The seven raw exemplar texts** are gone from this machine; the per-entry band re-measurement is owed and is the owner's on cost and IP (SITTING §K.1). Until then every ENTRY-grain number in the composed model is provisional on one author.
11. **V3's LACK class is not demonstrable** — no `none-exists` field exists anywhere (dossier §10 item 5) — and **V6 is NOT-EXECUTABLE** for want of a typed unresolved field (SITTING A12). Two of the eight level-1 members are therefore unavailable as modifier classes today; does the authoring wave mint their fields, and is that a schema act (owner-gated)?
