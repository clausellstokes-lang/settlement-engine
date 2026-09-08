# War Circulation / WC-0D — the amnesty and jubilee term families

- **Status:** LANDED
- **Train:** `refs/trains/wc-0`, **member 4 of 4 — THE TERMINAL MEMBER.** Plan:
  `laneTC14-TRAIN-PLAN.md`. ⭐ **It carries the census row and re-derives the whole tuple at `I4`,
  the train's last `tests/`-moving commit, so `T` stays docs-only.**
- **Chair authority:** `OWNER_DECISION_QUEUE.md` **§52 ruling 1** (the five-member `TERM_FAMILIES`
  literal — **never the landing record** — with the inertness pin re-aimed, SIGNED), **§52 ruling
  2** (the six house-voice lines are corpus authoring at this compile, chair-signed here on the
  §47 O-6 pattern), and **§52 ruling 4** (the inertness re-grounding recorded). Rulings consumed:
  **CR-WC-12** (WC-0 registers its two producer-less rows immediately; TB proceeds independently;
  whichever lands second rebases trivially).
- **Volume:** WC — the war-circulation owner-amendment program.
- **Family preamble, cited BY SHA-256:** `docs/implementation/preambles/WC-PREAMBLE.md`
  sha256 `5241a798e3033007721c1090c69a8fd1608475aef32aae7b7663670867f05b1f` — the bytes LANDED at `D0` (`a393b109`); unmoved since.
- **Branch:** `claude/composite-r4`
- **Verified base:** `claude/composite-r4` at `98c7872ebf3bb5a43091a5ff7d1b7918881593f0`
- **Base-state capsule:** `6b822540`; HEAD is its docs-only child, executed as exactly one
  path — **J-T1**.
- **Chain position:** member 4 of 4, THE TERMINAL MEMBER, on `WC-0C` landed at `cf7e6466`.

---

## 1. Reconciled authority

| Source | What it binds |
|---|---|
| `docs/implementation/preambles/WC-PREAMBLE.md` @ the sha above | §P0–§P11, and **§P2.6/§P2.7/§P2.8** in particular — the derived-list census, the landing-record refusal, and the inertness-for-the-true-reason law |
| `laneWCC-cures.md` cure 2 + `laneTC14-HOUSE-LINES.md` | the 32-reference consumer census, the two reds, and the six drafted lines |
| `docs/DESIGN_FP_ARCH_WC.md` @ `c5305a82` | §3 WC-0 (the TERM_FAMILIES consumer census block) · §1.10 "Debt needs exits" · §8.1 row 17 (WR-10) |
| `laneWV-WC-SUBSTRATE.md` **R13/R14/R15** | the pin the volume names does not exist; the cure it prescribes is forbidden; the census is short by two `src/` and six test consumers |

---

## 2. Outcome and boundary

### 2.1 What lands

**Two producer-less term-catalog rows, each in its own family, and every consumer the derived
family list reaches.**

`amnesty` and `jubilee` are the two exits §1.10 ("Debt needs exits") requires a settlement to be
able to write into a peace. They land as `executor: 'seam'` rows with **no `CLASS_TERM` entry and
no peacetime draft-lens membership** — the `non_intervention` mechanism verbatim: **no producer ⇒
never drafted ⇒ byte-identical registration.**

⭐ **BUT THE NO-PRODUCER RECIPE DOES NOT REACH `TERM_FAMILIES`.** The family list is DERIVED from
`TERM_TYPES` at module scope, so registering two producer-less rows **mutates an exported array —
two new members, re-sorted — with no producer involved.** That is why this member is a consumer
census with a catalog edit attached, rather than a catalog edit with a note.

### 2.2 What it deliberately does NOT build — the non-goals, named

⛔ No producer: no `CLASS_TERM` entry, no draft-lens membership, no executor implementation · no
house WORD for either type (chair Q6, measured — the default arm is proved total) · no widening of
`WR10_FAMILIES_AT_LANDING` (**forbidden in writing** — §2.3) · no catalog-row property
(⛔ that enters CR-WC-9's escalated persisted-shape class, which is exactly why §52.2 signed Arm 1)
· no flag · no new leaf · no `peaceTerms.js` edit · no news kind, no PDF byte, no read-model key.

⭐ **THE SEEDED CORPUS IS BYTE-IDENTICAL, AND §5 STATES THE REASON THAT IS ACTUALLY TRUE.**

### 2.3 ⛔ THE VOLUME'S OWN OBLIGATION (b) IS STRUCK

WC-0 obligation (b) reads: *"`WR10_FAMILIES_AT_LANDING` widened by the two families … IN THE SAME
COMMIT."* **Executing it would be a defect.** `sovereigntyBundle.js:74` and `:113-115` state:

> *"`WR10_FAMILIES_AT_LANDING` IS DELIBERATELY NOT WIDENED. It is named a LANDING RECORD rather
> than a policy … widening it would erase the fact the tripwire exists to preserve."*

and it reds `expect(WR10_FAMILIES_AT_LANDING.length).toBe(8)` at `:347`. **The pin this member's
two families actually red is a different one: the NAMED GROWN SET at `:340-341`.** *(WV R14; WCC
cure 2; signed at §52.1.)*

⚠ **AND THE PIN THE VOLUME NAMES DOES NOT EXIST.** WC-0 cites
`sovereigntyBundleWr10.test.js:322` as *"an exact-equality pin that reds outright"*. **There is no
such pin.** The live PIN 1b asserts the tripwire in its **FIRED** position — the tripwire already
fired and was discharged by GR-3 on 2026-08-06. *(WV R13.)*

---

## 3. THE CONSUMER CENSUS — pre-executed, and it is the member's real work

Lane WV named eight consumers. Enumerated mechanically over `src/` **and** `tests/` at
`fc8451c4`: **32 code-side references across 9 files.** Every one that carries an assertion a +2
widening reaches:

| Site | Assertion | Under +2 |
|---|---|---|
| `peaceTermsCatalog.js:294` | the derivation itself | moves, by design |
| `peaceTerms.js:154 / :1237` | **barrel import + re-export** — the hop the volume's census misses entirely | **inert; the barrel is symbol-keyed and already carries `TERM_FAMILIES`, so this member does NOT touch `peaceTerms.js`** (which is at 797/800 — the one hot file this whole train stays clear of) |
| `sovereigntyBundle.js:181 / :192` | `bundleComponentFamilies()`, `catalogGrewSinceWr10()` | both derived — **GREEN** |
| `sovereigntyBundleWr10.test.js:320 / :326 / :336 / :346 / :457` | derived identity, floor, tripwire-true, containment, derived length | **GREEN** |
| **`sovereigntyBundleWr10.test.js:340-341`** | `[...grown].sort() toEqual ['commercial','faith','population']` | ⛔ **REDS** |
| `sovereigntyBundleWr10.test.js:347` | `WR10_FAMILIES_AT_LANDING.length toBe 8` | **GREEN — iff the record is not widened** (§2.3) |
| `peaceTerms.test.js:117`, `sovereigntyTransferTerm.test.js:59` | `toContain(spec.family)` over catalog specs | GREEN |
| `peaceTermsGrantTerms.test.js:193` | `TERM_FAMILIES.length >= 11` | GREEN (13 ≥ 11) — **tightened, §5.4** |
| `spTermLiteral.walker.test.js:79 / :80` | `>= 11`, `TERM_TYPES >= 24` | GREEN (13, 26) — **tightened, §5.4** |
| `spTermLiteral.walker.test.js:93-94` | scanner-bites: every family literal spoken in the catalog | GREEN — the rows spell `family: 'amnesty'` |
| `spTermLiteral.walker.test.js:104-113` | **no SP module spells a family literal** | GREEN — ⭐ **measured: `'amnesty'` and `'jubilee'` appear ZERO times in `src/`** |
| `spTermLiteral.walker.test.js:128-132` | the mutant plants `TERM_FAMILIES[0]` | GREEN — `[0]` becomes `'amnesty'`, still unspoken in `SP_MODULES[0]` |
| **`peaceTermsWave3.test.js:386-393`** | **TOTALITY: every family has a `TREATY_COMPLIANCE_VOICE` row × 3 states** | ⛔ **REDS** |
| `peaceTermsGrantTerms.test.js:207` | every catalog row is produced, a documented seam, or owed | GREEN **iff** both rows carry `executor: 'seam'` with a written reason |
| `peaceTermsGrantTerms.test.js:272-281` | the seam-2 tripwire over the **commercial** family | GREEN — checked; the new families are their own |
| `peaceTermsGrantTerms.test.js:305` | `Object.keys(LABELS)).toHaveLength(12)` | GREEN — checked; the map is **test-local** and the default arm is proved total at `:312` |

**⇒ TWO REDS, AND THE SECOND ONE NOBODY NAMED.** `:340-341` was found by the substrate sweep;
`peaceTermsWave3.test.js:386-393` was found by the cure pass (finding N3) and is what makes the six
house-voice lines mandatory rather than decorative.

Measured live by importing the module (not by reading it):

```
TERM_TYPES.length      = 24        TERM_FAMILIES.length   = 11
TERM_FAMILIES[0] today = 'commercial'
after +2 (amnesty, jubilee):  TERM_TYPES 26, TERM_FAMILIES 13, TERM_FAMILIES[0] = 'amnesty'
grown after +2 = ["amnesty","commercial","faith","jubilee","population"]
```

---

## 4. Verified tree contract and executed preflight receipts

### 4.1 Effective lines — every touched file cold, measured with eslint's own `Linter`

| File | eff | Ceiling | In this manifest? |
|---|---:|---:|---|
| `src/domain/worldPulse/peaceTermsCatalog.js` | **113** | 800 | ✅ +2 rows (one line each — measured against the landed row shape) |
| `src/domain/display/treatyDocument.js` | **182** | 800 | ✅ +10 eff (two `Object.freeze` rows of three strings) — inside the ≤ 15 shared-file delta |
| `src/domain/worldPulse/peaceTerms.js` | **797** | 800 | ❌ **NO** — §3 |

**No file in this manifest carries a `scripts/.size-baseline.json` row.**

### 4.2 The absence that makes the walker arms clean

```
src/ files spelling 'amnesty' or 'jubilee' as a literal: 0  []
```

⚠ The only tree occurrences anywhere are two rng **seed strings** in
`tests/domain/roadsEmbassyExtensions.test.js:169` and `tests/property/roadsCharter.test.js:359` —
**not vocabulary**, and outside every scanned surface.

### 4.3 Required live symbols (existence-checked at EVERY status)

| Path | Symbol |
|---|---|
| `src/domain/worldPulse/peaceTermsCatalog.js` | `export const TERM_FAMILIES` |
| `src/domain/display/treatyDocument.js` | `export const TREATY_COMPLIANCE_VOICE` |
| `tests/domain/sovereigntyBundleWr10.test.js` | `WR10_FAMILIES_AT_LANDING` |

### 4.4 The census this member re-derives WHOLE

| Figure | At base (`98c7872e`) | **At `I4` — re-derived WHOLE, all five together** |
|---|---|---|
| lighting census | **`2431 / 364 / 2067 / 20149 / 5660`** | **`2437 / 364 / 2073 / 20175 / 5666`** |

⛔ **THE BASE TUPLE IS READ FROM THE LIVE LITERAL AT
`sovereigntyLightingContract.walker.test.js:4339`, NEVER FROM A FIRST-MATCH GREP** — the walker
carries a stack of ancestry-pin COMMENTS holding superseded tuples, and a naive parse returns
the GR-4d comment's `2412/365/2047/19984/5638` at `:4038`. The DELTA this train applies is
`+6 files / +0 parked / +6 credited / +26 titles / +6 suites`. ⚠ The figure is re-derived by
RUNNING the walker at `I4`, not by arithmetic — the arithmetic above is the prediction the run
must reproduce.

⛔ **NEVER PATCHED ONE FIGURE AT A TIME.** All five are re-derived together and the cause is named,
per the walker's own recorded law. ⚠⚠ **The census is SEQUENCED**: at `I1`–`I3` the `files` arm was
red and `parked` / `credited` / `titles` / `suiteTitles` never executed, so **`suiteTitles` is proved
separately** — grep the whole train diff over `tests/` for added `describe(` lines and require
**exactly six**.

---

## 5. Exact contracts

### 5.1 The two catalog rows

Each is **one effective line**, the shape every landed row keeps:

```js
  // WC-0D — the amnesty family. §1.10's first exit: the losing side's named are let be.
  // executor:'seam' + NO CLASS_TERM entry + NO peacetime draft-lens membership is the
  // `non_intervention` mechanism verbatim — no producer ⇒ never drafted ⇒ BYTE-IDENTICAL
  // registration. The producer lands with the wave that mints one, and the seam-2 tripwire
  // reds that day, which IS the instruction to move the reachability obligation there.
  amnesty: Object.freeze({ family: 'amnesty', weight: …, baseYears: …, maxYears: …, baseMag: …, stream: false, executor: 'seam' }),
  jubilee: Object.freeze({ family: 'jubilee', weight: …, baseYears: …, maxYears: …, baseMag: …, stream: false, executor: 'seam' }),
```

⚠⚠ **THE FIVE NUMERIC FIELDS ARE THE ONE PLACE THIS TRAIN COULD AUTHOR A NUMBER, AND IT MUST NOT.**
`weight` / `baseYears` / `maxYears` / `baseMag` are **tuning** — owner-signature surface under THE
PROMISE. ⛔ **Either they are transcribed from an existing row whose semantics genuinely match and
the transcription is recorded, or this member STOPS and the chair signs four values.** **Chair
question Q9, raised by this packet:** the volume authors none of them, and §7.B carries no WC-0 row
by design.

### 5.2 The six house-voice lines

Drafted in full, with their reasons and their executed register check, in
`laneTC14-HOUSE-LINES.md`, and reproduced in the packet's implementation notes. Home:
`src/domain/display/treatyDocument.js`'s `TREATY_COMPLIANCE_VOICE`. **All six pass the guard's four
predicates, executed.** ⛔ **LAW ONE governs `jubilee` absolutely**: not one of the three sentences
says anything about a god, a rite or a blessing — a jubilee here is a **debt release** and nothing
else.

### 5.3 The named grown set

```js
expect([...grown].sort())
  .toEqual(['amnesty', 'commercial', 'faith', 'jubilee', 'population']);
```

with the comment at `:337-339` extended by one sentence naming WC-0D as the **second discharge of
the same wire** and quoting `sovereigntyBundle.js:74`'s refusal, **so the next reader cannot mistake
a widened RECORD for the lawful move.** Zero new titles.

### 5.4 The three tightened floors *(vetoable — inherited J-WCC-3)*

`spTermLiteral.walker.test.js:79` **11 → 13**, `:80` **24 → 26**, and
`peaceTermsGrantTerms.test.js:193` **11 → 13**. **This is not bookkeeping**: the walker's own header
at `:74-78` records the slack-floor-vacuity lesson and instructs the same-commit tightening. *Veto
consequence:* the floors go on passing against a catalog **18% larger** than the one they measured.

### 5.5 ⭐⭐ THE INERTNESS PIN, RE-AIMED AT THE REASON THAT IS TRUE

The volume's stated ground — *"a family with no term on the table contributes no bundle line"* — is
**REFUTED.** `sovereigntyMarketStage.js:288-291` derives `offerableFamilies()` from
`bundleComponentFamilies()`, and `stackUntilItClears` (`:312-336`) iterates that **codepoint-ordered**
list, pushing each family into `components` with a fixed magnitude and re-clearing at every step. **A
family with no term on the table is still stacked** — the search reads the *available* set, not the
*produced* set. `'amnesty'` sorts to **position 0**, ahead of `'commercial'`.

**THE INERTNESS SURVIVES FOR A DIFFERENT REASON, AND THE PIN ASSERTS THAT ONE:**
`sovereigntyTradeEnabled` is an ENGINE-GATED **VIRTUAL** key (`simulationRules.js:282`, declared
virtual at `:158-165`) — absent from `DEFAULT_SIMULATION_RULES` **and** from every preset override —
so **no seeded corpus can reach the market at all.** The corpus is byte-identical **because the flag
is dark.**

⇒ the pin asserts **(a)** the structural darkness and **(b)** the capability delta as a **named,
executed statement of the new order** — *never* as a claim of inertness. **A pin asserting inertness
for a false reason is a green that proves nothing.**

⚠ **THE DECLARED CAPABILITY DELTA (§52.2, Arm 1 — land and declare).** With the flag lit,
`offerableFamilies()` grows by two and `'amnesty'` occupies index 0 of the stacking order, changing
which family the sovereignty market offers first, the `components` array at every subsequent step,
both valuations, and therefore the clearing verdict — **on any world where the market runs.** WC-0's
own closing line *"DORMANCY: total"* stays true of the CORPUS and is **no longer true in the
capability sense**; the receipt says so in one honest sentence.

### 5.6 Lifecycle paths (L4)

**Create** — two frozen catalog rows at module scope. **Read** — every derived consumer in §3.
**Persist** — ⛔ **nothing.** No treaty carries either type until a producer exists, so no save,
regen, undo, restore or migration path can encounter one. ⭐ **That is what makes this registration
byte-identical, and it is asserted rather than assumed** (the hardest negative, §9 M4).

---

## 6. Exact SEVEN-path manifest — seven handwritten, zero generated

| # | Action | Path | Budget |
|---:|---|---|---|
| 1 | `MODIFY` | `src/domain/worldPulse/peaceTermsCatalog.js` | **+2 eff** (two rows) |
| 2 | `MODIFY` | `src/domain/display/treatyDocument.js` | **+10 eff** (the six lines) — inside the ≤ 15 cap |
| 3 | `CREATE` | `tests/domain/amnestyJubileeRegistration.test.js` | 1 `describe` + **5** `it` |
| 4 | `TEST` | `tests/domain/sovereigntyBundleWr10.test.js` | the named grown set + the extended comment. **ZERO new titles** |
| 5 | `TEST` | `tests/domain/peaceTermsGrantTerms.test.js` | the floor 11 → 13. **ZERO new titles** |
| 6 | `TEST` | `tests/lint/spTermLiteral.walker.test.js` | the floors 11 → 13 and 24 → 26. **ZERO new titles** |
| 7 | `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | ⭐ **the census tuple, re-derived WHOLE.** ZERO new titles |

**Handwritten 7 of 12. New production leaves 0 of 2. Existing logic-bearing production files
modified 2 of 3. Feature flags 0 of 1. Acceptance cases 5 of 8.**

⛔ **NOT IN THIS MANIFEST:** `src/domain/worldPulse/peaceTerms.js` (**797/800**; the barrel is
symbol-keyed and already carries `TERM_FAMILIES`, so the +2 never reaches it — §3) ·
`tests/domain/peaceTermsWave3.test.js` (its totality loop needs **no edit**: it iterates
`TERM_FAMILIES` and greens the moment the six lines exist) · `sovereigntyBundle.js` (⛔ the landing
record is not widened) · `sovereigntyMarketStage.js` (the capability delta is **declared**, not
suppressed).

---

## 7. Ordered coding sequence

1. The two catalog rows in `peaceTermsCatalog.js`, `executor: 'seam'`, with their written reasons.
2. The six house-voice lines in `treatyDocument.js` — **before** any test edit, so
   `peaceTermsWave3`'s totality loop is green the first time it runs against 13 families.
3. The named grown set and its extended comment in `sovereigntyBundleWr10.test.js`.
4. The three tightened floors.
5. `tests/domain/amnestyJubileeRegistration.test.js`, then the §P3 anchor preflight.
6. ⭐ **The census, re-derived WHOLE, LAST** — after every `tests/` byte of the entire train is in
   place. **This is the train's final `tests/`-moving edit, and getting it last is what keeps `T`
   docs-only.**

---

## 8. Acceptance matrix — exactly five titles, ONE file, ONE `describe`

| # | Case |
|---|---|
| D1 | both rows are `executor: 'seam'` in their **own** families; `TERM_TYPES` is 26 and `TERM_FAMILIES` is 13, both derived and codepoint-sorted; and neither type appears in `CLASS_TERM` or any draft lens — **the no-producer fence, asserted** |
| D2 | ⭐⭐ **THE INERTNESS PIN, RE-AIMED**: `sovereigntyTradeEnabled` is absent from `DEFAULT_SIMULATION_RULES` **and** from every preset override — the structural reason no seeded corpus can reach the sovereignty market — asserted over the live rules objects, not over a fixture |
| D3 | ⭐ **THE CAPABILITY DELTA, DECLARED NOT HIDDEN**: with the flag lit, `offerableFamilies()` grows by exactly two and `TERM_FAMILIES[0]` is `'amnesty'`, so `'amnesty'` occupies index 0 of the stacking order — pinned as a **named, executed statement of the new order**, never as a claim of inertness |
| D4 | ⭐ **THE PLANTED-ITERATION NEGATIVE, AIMED AT THE REAL HAZARD**: a planted consumer that **indexes** `TERM_FAMILIES[0]` observes the transition `'commercial' → 'amnesty'`, so the census is proved able to red on the live positional hazard rather than on a hypothetical one |
| D5 | the six house-voice lines exist for both families across all three compliance states and pass the register guard (non-empty · terminal punctuation · no template token · settlement-agnostic), and `treatyStrainLine` resolves each without falling to the floor |

⛔ ONE literal `describe`, straight-line `it` calls, string-literal titles. **No `.each`, no
`describe.runIf`, no nesting.**

⚠ **D1 AND D2 ARE NEGATIVES AND EACH OWES AN ANCHOR** (§P3). ⚠⚠ **D2 IS THE PIN THE WHOLE MEMBER
TURNS ON** — it is the cure for a green that proved nothing, and if it is written as
*"the corpus did not move"* it becomes the very defect it replaces. **It asserts the STRUCTURAL
ABSENCE of the key from defaults and presets**, which is a fact about the rules objects, not about
a run.

---

## 9. Mutation proof — five disposable mutants

| # | Plant | Must convict |
|---|---|---|
| M1 | give `amnesty` a `CLASS_TERM` producer | D1 — ⭐ **THE HARDEST NEGATIVE the volume names**: *"a mutant adding a `CLASS_TERM` producer for amnesty must move the treaty corpus"*, proving the no-producer fence is what holds byte-identity, **not luck** |
| M2 | add `sovereigntyTradeEnabled: true` to a preset override | D2 |
| M3 | delete `jubilee`'s three voice lines | D5 — and `peaceTermsWave3.test.js:388` must red in the same run, proving the totality loop is the live guard rather than D5 alone |
| M4 | widen `WR10_FAMILIES_AT_LANDING` by the two families | `sovereigntyBundleWr10.test.js:347` — ⭐ the mutant that proves §2.3's refusal is **enforced**, not merely written down |
| M5 | restore `spTermLiteral.walker.test.js:79` to `>= 11` | ⚠ **nothing reds — and that is the finding.** A slack floor cannot be convicted by a mutant; it is convicted by the walker's own header instruction. Recorded so the tightening is understood as a **deliberate act**, not a covered one |

Each planted, convicted (M5 excepted, by design and by record), restored **digest-exact**.

---

## 10. Focused verification — exact argv

```
npx vitest run tests/domain/amnestyJubileeRegistration.test.js tests/domain/sovereigntyBundleWr10.test.js tests/domain/peaceTermsWave3.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/domain/peaceTermsGrantTerms.test.js tests/lint/spTermLiteral.walker.test.js tests/domain/peaceTerms.test.js tests/domain/sovereigntyTransferTerm.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?
npx eslint src/domain/worldPulse/peaceTermsCatalog.js src/domain/display/treatyDocument.js tests/domain/amnestyJubileeRegistration.test.js ; echo TRUE_EXIT=$?
```

⛔ Bare, fresh shell, never wrapped in `gate-mutex.sh --run`, outlasted in your own turn.

**EXPECTED AT `I4`:** every named suite GREEN · **`sovereigntyLightingContract.walker` GREEN at
`2437 / 364 / 2073 / 20175 / 5666`** — the first commit of the train at which it is green, and the
one the three named interior reds (2433 · 2434 · 2436) were declared against.

⛔⛔ **A RED BATTERY TRUNCATES; BANKING HAS NO DOOR** (§97.2 / §99.2). And the anchor ceiling
binds this member's one new file: `negativeAssertionAnchor.walker` joins the battery.

---

## 11. Wave-specific hazards, coupling and OSR

- **COUPLING BILL: ZERO.** No new `src/` file; neither modified file gains an import.
  `ARGUED_ROSTER_CEILING` and `UNLAYERED_BASELINE_CEILING` untouched by this member.
- **OSR: verify-at-build at 1998.** Two new frozen catalog rows can mint an observed shape; **a new
  finding is a STOP, never a `--write`.**
- ⚠⚠ **SAME-SEED BLAST RADIUS: the corpus cannot move, and the reason is D2, not optimism.** The
  committed settlement hash and the persisted `generationCoherenceReceipt` are the two surfaces a
  registration could reach; **neither is reachable while `sovereigntyTradeEnabled` is virtual and
  no producer exists.** ⛔ If either moves, that is a **STOP**, never a golden re-record.
- ⚠ **CR-WC-12 IS CONSUMED, NOT RE-ARGUED.** SOL_QUEUE row 23a's TB tribute family proceeds
  independently through the same one-owner floor; **whichever lands second rebases trivially**,
  because catalog rows are additive and both sets are producer-less. **No lane is serialized on
  this member.**
- ⚠ **THE FOUR NUMERIC FIELDS ARE THE MEMBER'S ONE OPEN GATE** (§5.1, chair Q9). Everything else
  this train lands is transcribed or measured; these four are the only values in the whole `wc-0`
  train that could require an owner signature, and the packet refuses to invent them.

---

## 12. Completion receipt and STOP conditions

The receipt records: the 32-reference consumer census with each site's verdict, the two reds and
their cures, the six house-voice lines with their executed register check, the three tightened
floors with the walker header that instructs them, the five titles, the five mutants (M5's
non-conviction recorded rather than hidden), **the whole census tuple re-derived with its cause
named**, the declared capability delta in one honest sentence, and OSR at its exact floor.

**STOP on:** any need to widen `WR10_FAMILIES_AT_LANDING` · any need to touch `peaceTerms.js` · any
catalog-row property (⛔ CR-WC-9) · any movement in the committed settlement hash or the persisted
`generationCoherenceReceipt` · a new OSR finding · **any of the four numeric fields lacking a
transcription source** · a census figure that does not reconcile against the six-file / six-suite
/ 26-title prediction.
