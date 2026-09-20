# TOOL-8 — THE DARK-GUARD CENSUS (measure-first, read-only)

Lane: Opus RECON, chair Fable 5.1 session a9df403c, 2026-09-20.
Tree read: `$SP/read-tip-63e40fe57` @ `63e40fe5708c1459fe303442c38e66fa8e9b388b`, `status --short` EMPTY at start and end (CONFIRMED, both ends).
Work written ONLY under `$SP/lane-tool-8-scratch/`. No gate run, no edit, no stage, no commit.

---

## 0. WHAT WAS MEASURED, AND WITH WHAT

Four instruments, each named so the chair can weigh a claim by the instrument that made it.

| # | Instrument | What it answers | File |
|---|---|---|---|
| I1 | **acorn AST scan** of `src/generators/**` + `src/domain/**` (1,171 files, 1,197,046 nodes, 0 parse failures) | the candidate POPULATION: site, literal, guarded receiver | `scan.mjs` → `candidates.json` |
| I2 | **prototype-level execution instrument** over the full 525-row golden corpus (`String.prototype.{includes,startsWith,endsWith,indexOf,lastIndexOf,search,match,matchAll,replace,replaceAll,split}`, `RegExp.prototype.{test,exec}`), site attribution by V8 `CallSite` frames | per-site EVALUATED / MATCHED | `instrument.mjs`, `instrument3.mjs` |
| I3 | **input capture** for the dark set — the distinct receiver values each dark guard actually saw (≤40 per site) | *what the guard was fed* | `instrument2.mjs` → `dark-inputs.json` |
| I4 | **exact field vocabularies** parsed from the 525 serialized settlements (no sampling) | does the thing the guard hunts EXIST, and under what spelling | `vocab.mjs` → `vocab.json` |

**No stride was needed. CONFIRMED:** the full 525 rows run uninstrumented in **8.49 s** (`rows 525 errs 0 ms 8490 MB 73.6`). Every figure below is the FULL corpus, 525 of 525, zero pipeline errors.

Exact corpus vocabularies (I4), 525 rows:
`instNames=231 svcNames=375 resKeys=51 facNames=31 secrets=321 incomeSrc=26 goods=98 npcRoles=112 histDesc=53 allShort=8287`

---

## 1. THE FIX-D4 ANCHOR, REPRODUCED INDEPENDENTLY

`src/generators/npcGenerator.js:1353–1367` — the sanitiser named in the charter, found by symbol (`mentionsCriminalGuild`) beside the `secondaryAffiliation` fallback at :1334.

```
src/generators/npcGenerator.js:1358 STRMETH includes "thieves"        ev=969 mt=36   LIVE
src/generators/npcGenerator.js:1360 PRED    hasInst  "thieves"        ev=968 mt=0    DARK
src/generators/npcGenerator.js:1362 REGEX   replace  "thieves guild"  ev=318 mt=0    DARK
src/generators/npcGenerator.js:1362 REGEX   replace  "criminal guild" ev=318 mt=0    DARK
```

**CONFIRMED, and the arithmetic closes exactly.** 969 NPC secrets were tested; **36** contain the word `thieves`; the other eligibility arm (`includes('guild') && includes('criminal')`) carries the remaining **123**; total eligible **159**; `ev=318` on the replace is `159 × 2 chained .replace calls`; **scrubbed 0**. That is the charter's "eligible 159, scrubbed 0" reproduced independently.

⚠ **`ev` semantics for the `PRED` shape.** `hasInst(kw)` is `instNames.some(n => n.includes(kw))`, so the instrument sees one call per *institution name*, not per predicate call. `hasInst('thieves') ev=968` is ≈37 predicate calls × ≈26 institutions — consistent with the 36 `thieves` mentions above. `PRED` eligibility counts are therefore in units of name-comparisons; `STRMETH`/`REGEX` counts are in units of calls. Nothing in the classification depends on the unit (matched-is-zero is unit-free), but a reader comparing two rows must not.

The I3 input capture names the miss in the guard's own words:

> literal `thieves guild` ← input `"On the payroll of the thieves' guild as a silent informant"`

An apostrophe. `/thieves guild/gi` cannot reach `thieves' guild`, and the corpus writes it with the apostrophe every time (321 distinct secrets, I4).

The predicate half is a **different** defect and both are real:
- `hasInst` in `npcGenerator.js:937` **does** lowercase its names (`nativeSemanticNames(institutions).map(name => name.toLowerCase())`), so this is NOT a case bug — it is a **vocabulary-coverage** bug. The corpus's criminal institution vocabulary (I4, exact) is `Thieves' guild chapter`, `Black market`, `Street gang`, `Smuggling operation`, `Black market bazaar`, `Multiple criminal factions`. `hasInst('thieves')` reaches only the first; `hasInst('criminal')` reaches only the last — and **`criminal` matches 0 of the 231 institution names the corpus actually generated** (I4). A street gang is criminal infrastructure and both predicates miss it, exactly as the charter says.

---

## 2. THE CANDIDATE POPULATION (I1)

`src/generators/**` (49 files) + `src/domain/**` (1,122 files) = 1,171 files, 0 parse failures.

| Shape | Sites | Note |
|---|---:|---|
| `EQ` — `=== '<lit>'` / `!== '<lit>'` | 7,778 | 1,402 distinct literals; 840 in `src/generators` |
| `STRMETH` — `.includes/startsWith/endsWith/indexOf/lastIndexOf/split/replace('<lit>')` | 1,726 | 1,516 are `.includes` |
| `REGEX` — a RegExp **literal** used in `.replace/.test/.match/.matchAll/.search/.split` | 486 | 400 are `.replace` |
| `PRED` — `hasInst/has/hasIncomeSource/hasInstNamed/hasRes/…('<lit>')` | 272 | 11 distinct predicate helpers |
| `NEWREGEX` — `new RegExp('<lit>')` | 5 | |
| **TOTAL** | **10,267** | |

### 2.1 One instrument boundary, declared up front

I2 observes **method calls**. It cannot see `EQ` (`x === 'lit'`) at all without rewriting source. The 7,778 `EQ` sites therefore carry **no executed match count** in this census. A cheap screen was run instead (is the literal present as a string value anywhere in the corpus?) and it is **too noisy to act on**: 6,493 of 7,778 literals never appear as a corpus value, because most `===` comparisons are over internal enums, config keys and mode flags that never reach the settlement object. Reported as a measurement, not a finding. **The lint should not cover the `EQ` shape** (see §5.4).

---

## 3. THE CANDIDATE TABLE — EVALUATED / MATCHED over 525 of 525 rows

Reach classes. `DARK` = evaluated ≥ 1 and matched **0**, confirmed by the UNCAPPED pass 3.

| Shape | LIVE | **DARK (confirmed)** | UNREACHED | UNJOINED | not instrumented |
|---|---:|---:|---:|---:|---:|
| `STRMETH` | 355 | **680** | 335 | 356 | — |
| `REGEX` | 45 | **15** | 153 | 273 | — |
| `PRED` | 29 | **33** | 78 | 132 | — |
| `NEWREGEX` | 0 | 0 | 5 | 0 | — |
| `EQ` | — | — | — | — | 7,778 |
| **TOTAL** | **429** | **728** | **571** | **761** | **7,778** |

- **UNREACHED** (571) — the call site never ran in a generation corpus. 409 of them are `src/domain` prose/display/pulse modules the corpus does not load (§8 N12). This is a **corpus-reach** fact, not a darkness finding.
- **UNJOINED** (761) — the literal was evaluated somewhere but the V8 frame could not be pinned to this exact line (a helper deeper than 3 `src/` frames, or an inlined arrow). Reported honestly as unattributed; no claim is made about them.

### 3.1 ⛔ THE INSTRUMENT LIED ONCE AND THE CORRECTION IS THE HEADLINE NUMBER

Pass 1 capped stack capture at 20,000 per literal and reported **835** dark sites. The uncapped pass 3 (**841 s**, 59,582,843 evaluations) proves **107 of those were CAP ARTEFACTS** — the guard does match, just not inside the first 20,000 evaluations of its literal. `garrison` alone is evaluated **2,987,768 times** in one corpus pass; a 20,000 window sees 0.7% of its life.

**728 CONFIRMED DARK** (724 in `src/generators`, 4 in `src/domain`).

---

## 4. THE DARK LIST, CLASSIFIED

Each dark guard was bound to **the field it actually reads** (inferred from the receiver values I3 captured), and its normalization detected (663 of 728 read a lowercased projection; the rest read raw names). The literal was then tested against that field's **exact** corpus vocabulary.

| Class | Count | Meaning |
|---|---:|---|
| **SPELLING_MISS** | **1** | the literal cannot reach a spelling that EXISTS — the FIX-D4 shape, a live falsehood |
| **CASE_MISS** | **7** | the literal's case cannot reach a name that EXISTS — the FIX-D4 shape |
| PRECEDENCE_SHADOWED | 173 | the value exists and an EARLIER arm of the chain always claims it — redundant, not broken |
| INPUT_ABSENT | 545 | the value never occurs in 525 rows — honest dead code for this corpus |
| *(withdrawn)* | 2 | `serviceClassifier.js:129,130` (`'cure '` / `' cure'`) were flagged SPELLING_MISS by a loose normaliser matching `"se**cure**d"` inside `Loans (secured)`. **REFUTED:** 0 of 375 service names start with `cure ` or contain ` cure`. They are INPUT_ABSENT. |

### 4.1 ⭐ THE EIGHT — every real FIX-D4 member in `src/generators`, and seven of eight are ONE helper

```
   ev      shape  method     literal              site                                   field      the spelling it cannot reach
  318      REGEX  replace   "thieves guild"      npcGenerator.js:1362                   secrets    "…the thieves' guild as a silent informant"
17361      PRED   has       "craft"              spatialGenerator.js:162                instNames  "Craft guilds (5-15)"
17181      PRED   has       "fishing"            spatialGenerator.js:142                instNames  "Fishing community"
16343      STRMETH includes "monastery"          spatialGenerator.js:87                 instNames  "Monastery or friary"
 9819      PRED   has       "Magic"              spatialGenerator.js:186                instNames  "Academy of magic"
 1286      STRMETH includes "Smith"              spatialGenerator.js:168                instNames  "Resident smith (part-time)", "Blacksmiths (3-10)"
  469      PRED   has       "monastery"          spatialGenerator.js:74                 instNames  "Monastery or friary"
  216      PRED   has       "alehouse"           spatialGenerator.js:132                instNames  "Alehouse"
```

**The instrument localised the whole case-drift class, unprompted, to the one module whose predicate does not lowercase** — `spatialGenerator.js:21`, `const has = (keyword) => instNames.some(n => n.includes(keyword))` over `institutions.map(i => i.name)` (§8 N1). Every sibling generator lowercases first; this one does not, and every case-miss in the estate's generation surface is here.

**Ruled one by one (a chain sibling can make a dark arm harmless — this was checked, not assumed):**

| # | Site | Intent (its own comment / structure) | Real loss? | Cheapest cure |
|---|---|---|---|---|
| D1 | `npcGenerator.js:1362` `/thieves guild/gi`, `/criminal guild/gi` | *"Sanitise criminal guild references if no criminal infrastructure"* | **YES.** 159 eligible NPC secrets, **0** scrubbed; 36 of the 969 tested say `thieves`, and the corpus spells it `thieves' guild` every time. A settlement with no criminal infrastructure still ships an NPC on a thieves' guild payroll. | **fix the literal** → `/thieves'? guild/gi`. ⚠ moves the golden (§7 Q1). The predicate half (`!hasInst('thieves') && !hasInst('criminal')`) misses `Street gang`, `Black market`, `Smuggling operation` and needs the vocabulary widened in the same act. |
| D2 | `spatialGenerator.js:162` `has('craft')` in `has('craft') \|\| (has('guild') && !has('Merchant'))` | Artisan Quarter gate | **YES.** `Craft guilds (…)` misses the lowercase arm; the fallback `has('guild') && !has('Merchant')` FAILS whenever `Merchant guilds (…)` is also present — both are in the 231-name vocabulary. A settlement with craft **and** merchant guilds gets no Artisan Quarter. | lowercase `has()` (one line, §7 Q4), or `has('Craft')`. |
| D3 | `spatialGenerator.js:186` `has('Magic')` in `has('Wizard') \|\| has('Mage') \|\| has('Magic')` | Mages' Quarter gate | **YES.** `Academy of magic` contains none of `Wizard`/`Mage`/`Magic`. A settlement whose only arcane institution is the Academy gets no Mages' Quarter. | as D2. |
| D4 | `spatialGenerator.js:74` `has('monastery')` in `has('church') \|\| has('Cathedral') \|\| has('monastery')` | Religious Quarter gate | **YES.** `Monastery or friary` alone yields no Religious Quarter, and the `else if (has('shrine') \|\| has('Shrine'))` branch is ALSO dark (0 of 231 names contain either). | as D2. |
| D5 | `spatialGenerator.js:87` `n.includes('monastery')` | Religious Quarter **landmark** list | **YES (cosmetic).** `Monastery or friary` is never listed as a landmark of the quarter it can create. | as D2. |
| D6 | `spatialGenerator.js:168` `n.includes('Smith')` | Artisan Quarter **landmark** list | **YES (cosmetic).** The corpus spells them `Resident smith (part-time)`, `Blacksmith`, `Blacksmiths (3-10)` — lower-case `s` in all three. The Artisan Quarter never lists a smith. | as D2. |
| D7 | `spatialGenerator.js:142` `has('fishing')` in `has('Fishing community') \|\| has('fishing')` | Fishing Landing gate | **NO.** The first arm matches `Fishing community` exactly. A dark lowercase duplicate. | **retire the arm** (or keep as a declared-dark spelling hedge). |
| D8 | `spatialGenerator.js:132` `has('alehouse')` in `has('Alehouse') \|\| has('alehouse') \|\| has('Wayside inn')` | hamlet Alehouse & Common gate | **NO.** `has('Alehouse')` matches exactly. | as D7. |

**Introducing commit.** `git log -S'thieves guild' --oneline -- src/generators/npcGenerator.js` and `git log -S'mentionsCriminalGuild' …` both return exactly one commit: **`e608542bd2`** ("Settlement Engine — full build with Supabase backend, Stripe payments, AI narrative, PRNG determinism") — the genesis import. The sanitiser has never been touched since it was born, and has never fired. No later commit ever re-examined it; there is no intent to read beyond the comment *"Sanitise criminal guild references if no criminal infrastructure"*.

### 4.2 The 173 PRECEDENCE_SHADOWED — redundant, NOT broken

Concentrated in `serviceClassifier.js` (80), `institutionProbability.js` (18), `economy/economicState.js` (15), `historyGenerator.js` (11). The value the arm hunts DOES occur; an earlier arm of the same `||` chain or ternary ladder always takes it first. **These must never red a lint** — see §5.4.

Worth one note anyway: `serviceClassifier.js`'s header claims `SERVICE_CATEGORY_MAP` *"covers all 260 known services unambiguously"*. MEASURED: the map holds 280 keys and covers **124 of the 375** service names the corpus generates; **251 fall through** into the keyword heuristic. The heuristic is load-bearing, and 80 of its arms are dead weight inside it (§8 N3).

### 4.3 The 545 INPUT_ABSENT — honest dead code for THIS corpus

Top by eligibility: `generationCoherence.js:330` (`/\b(?:e\.g|i\.e)\.\s+/gi`, **1,742,458** evaluations, 0 matches), `goodsCatalog.js:278` (`/['"]/g`, 131,104), `priorityHelpers.js:203` (`teleportation`/`planar`/`extradimensional`/`airship`, 74,342 each), `economyReconciliation.js:62` (`/\s+\(dominant\)$/`, 68,472), `rulingStructure.js:139-146` (`manor`/`royal seat`/`feudal`, 46,644).

"Honest dead **for this corpus**" is the exact claim. `manor`, `royal seat` and `feudal` are plausible institution names the golden's 525 configurations never roll; that is a **corpus-coverage** question, not a code defect, and it is the reason the lint needs a `DECLARED_DARK` door rather than a delete key.

---

## 5. THE LINT, PRICED

### 5.1 Wall-clock, measured (CONFIRMED, this box, single process, `node v24.12.0`)

| Run | What | Wall-clock |
|---|---|---:|
| baseline | 525 rows, no instrument, serialise to disk | **8.49 s** |
| I2 capped | 525 rows, all 759 candidate literals, stack attribution, **20,000 captures/literal cap** | **106.7 s** (12.6×) |
| I3 | 525 rows, dark literals only, value capture, per-literal saturation | **135.8 s** |
| I2 uncapped | 525 rows, 529 dark literals, **no cap** (59,582,843 evaluations) | **> 8 min** |

The estate's one full-corpus pass costs **84,181,053 candidate-literal evaluations**. That number is the price of the naive design and it is why the naive design must be refused.

`vite.config.js:912` sets `testTimeout: 20000`. The estate already has precedent for overriding it on a corpus walker — `tests/lint/worldGenerationClockSeam.walker.test.js:704` closes `}, 120000)` and `:717` closes `}, 180000)`. So a 110 s test is *permitted*; it is still the wrong price for a guard census.

### 5.2 The design the measurement argues for — registry + exact vocabulary, NOT prototype instrumentation

Prototype patching is the wrong mechanism inside vitest, for two reasons beyond cost:

1. **It is global and the worker is shared.** `Object.defineProperty(String.prototype, 'includes', …)` inside a vitest worker changes `String.prototype` for every other suite that worker later loads. The estate runs 127 files in parallel (`vite.config.js:907` comment). A leak here is a cross-suite hazard, not a slow test.
2. **A capped or strided instrument can invent darkness.** This lane hit it: pass 1's 20,000-per-literal cap reported sites dark that pass 3 proves live — `garrison` alone is evaluated **2,987,768** times, so a 20,000 window sees 0.7% of its life. *Any* lint that concludes "0 matches" from a truncated window is a false-alarm generator.

The cheap design that answers the FIX-D4 question exactly:

```
tests/lint/darkGuardCensus.walker.test.js
  ├─ a REGISTRY   src/…/darkGuardRegistry.js — one row per registered guard:
  │     { id, file, line, literal, shape, field: 'instNames'|'svcNames'|'secrets'|…,
  │       normalization: 'raw'|'lowercased', disposition: 'LIVE'|'DECLARED_DARK', why }
  ├─ a SOURCE ARM   the acorn scan of §2 re-run over src/generators — every site whose
  │     shape matches must carry a registry row (totality, both directions, the
  │     chooserTotality idiom); a NEW unregistered guard REDS
  └─ a CORPUS ARM   ONE uninstrumented corpus pass → the exact field vocabularies of §0
        (I4). For each row: eligible = |vocabulary(field)| ;
        matched = |{ v ∈ vocabulary(field) : predicate(normalize(v), literal) }|.
        matched === 0 && eligible > 0 && disposition !== 'DECLARED_DARK'  → RED.
```

**Price: 8.5 s** for the full 525 rows (or ~1.7 s at a 1-in-5 stride), plus pure string work over ≤ 8,287 values — under a second. It fits the default 20,000 ms timeout with an order of magnitude to spare, it patches nothing, and it cannot be truncated because the vocabulary is exact rather than sampled.

It also catches the FIX-D4 bug *statically once the row exists*: `literal 'thieves guild'` vs `vocabulary('secrets')` → 0 matches while `normalize('thieves guild')` matches `thieves' guild` → RED with the counter-example quoted.

### 5.3 The declared-dark allowlist

`DECLARED_DARK` rows are the honest dead, and the taxonomy below is what the allowlist's `why` field must range over. Three families found in this census that must be allowed to stay dark **forever**, not "until someone gets to them":

- **Defensive escapes.** `src/domain/arcaneInstitutionIdentity.js:165` — `kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` escapes regex metacharacters in a keyword before building a `RegExp`. It has never fired because no arcane keyword contains a metacharacter. Retiring it converts a safe construction into an injection. **Correct to stay dark.**
- **Idempotent normalisers.** Four copies of `.replace(/^_+|_+$/g, '')` (`src/domain/supplyChainState.js:215`, `src/generators/factionRoles.js:380`, `src/domain/activeConditions.js:574`, `src/generators/steps/subsumptionPass.js:25`) trim underscores a preceding `[^a-zA-Z0-9]+ → _` pass can only produce at the edges. Dark by construction.
- **Negated dedupe guards.** `src/generators/economy/economicState.js:405,424,444,461,479,497` — `!hasIncomeSource('grain')`, `!hasIncomeSource('wool')`, … The comment at :397 says the evaluation order is load-bearing: each guard exists so a later rung cannot re-push a stream an earlier rung already pushed. A **dark** dedupe guard means *no duplicate ever occurred* — which is the guard working, not the guard broken. A lint that reds these is a lint the estate will disable.

### 5.4 False-positive classes, measured not guessed

| Class | What it looks like | Evidence from this census | Mitigation |
|---|---|---|---|
| **PRECEDENCE-SHADOWED** | an arm of an `||` chain or a ternary ladder that an earlier arm always claims first | `src/generators/services/serviceClassifier.js` alone holds **303** dark sites in one ~160-arm ternary; `y.includes('last rites')` is dark although `Last rites` IS a corpus service name — an earlier arm took it | register the **chain**, not the arm; red only when NO arm of a chain matches, or require the row to declare `precededBy` |
| **NEGATED GUARD** | `!hasX('lit')` | §5.3 | registry field `polarity: 'negated'` → never red |
| **DEFENSIVE** | escapes, idempotent normalisers | §5.3 | `DECLARED_DARK` |
| **TRUNCATION** | a capped/strided instrument's 0 | pass 1 vs pass 3, `garrison` ×2,987,768 | exact vocabulary, never a sampled window |
| **CORPUS REACH** | the module is not on the generation path | **409** `src/domain` sites were never evaluated at all (263 STRMETH + 146 REGEX UNREACHED); `src/domain/prose/wiringCensus.js` alone holds 44 | scope the lint to `src/generators/**` in wave 1; `src/domain` needs a *different* corpus (a pulse/dossier driver), not this one |
| **CANDIDATE-POOL INPUTS** | the guard reads catalogue candidates, not the settlement's output | `src/generators/institutionProbability.js` weights over **candidates**; the 231 names in the output are a subset of the 268-name catalogue | registry `field: 'catalogue'` rows validate against the catalogue, not the corpus |

### 5.5 The mutation row

`tests/lint/mutationCoverageManifest.test.js` enforces that every correctness-asserting invariant file carries a `mutation`, `rationale` or `uncovered` entry in `scripts/mutation-coverage-manifest.json`, with `uncoveredBaseline` shrink-only. A new `darkGuardCensus.walker.test.js` therefore needs, in the same commit:

1. a `check_caught*` label planted in `scripts/mutation-sweep.sh` — the honest mutation is **to fix the FIX-D4 literal**: change `/thieves guild/gi` to `/thieves'? guild/gi` in `src/generators/npcGenerator.js` and assert the walker's *count* moves (the registry row's `matched` goes 0 → non-zero). That proves the walker is reading real execution rather than restating its own registry;
2. `src/generators/npcGenerator.js` added to the sweep's `MUTATED_FILES` refusal list (rule 4 of the manifest test — a missing row lets `git checkout --` discard a maintainer's uncommitted work in that file);
3. a **negative control** in the walker itself, in the `worldGenerationClockSeam` idiom: a synthetic registry row whose literal is known-absent must RED, so a walker that silently registers nothing cannot pass green.

**⛔ Note for the chair:** item 1 is a *behaviour-changing* mutation — see §7 Q3.

---

## 6. RECOMMENDATION

**Build the lint, in the registry-plus-exact-vocabulary shape of §5.2, scoped to `src/generators/**` — and build it BEFORE the eight cures, not after.**

The reasoning, in the order it decided:

1. **The class is real but SMALL, and the instrument that finds it is the expensive part.** 10,267 candidates → 728 dark → **8** true FIX-D4 members. A human sweep would have drowned in the 545 honest-dead and the 173 precedence-shadowed; the discriminator (bind the guard to its field, detect its normalization, test against the exact vocabulary) is what makes the 8 legible. That discriminator is exactly the lint. Building it is not overhead on the cure — it **is** how the cure is found and how the ninth member is caught.
2. **Seven of the eight are one helper.** `spatialGenerator.js:21` is the single raw-name `has()` among six private copies of the same predicate (§8 N10). The structural cure — one shared `institutionMatches(names, keywords)` with one declared normalization — closes the habitat; the lint is the ratchet that stops a seventh copy. This is `structural-prevention`'s shape and the estate already half-walked it: the `isDockInstitution` comment at `spatialGenerator.js:114` records a cure of ONE member of this class, locally, leaving the trap armed. That is the third same-shape fix; the rule says stop patching members.
3. **The cure order I would propose** (the chair's to slot): (a) the lint + registry, with all 728 rows born classified and the 8 marked `LIVE_EXPECTED` so the walker REDS today; (b) `spatialGenerator`'s `has()` normalization — one line, closes D2–D8, one recorded shift; (c) D1's literal + predicate vocabulary, which is the one that changes shipped NPC prose and wants the golden signature.
4. **Do NOT scope the lint to `src/domain` in wave 1.** 409 of its text-guard sites are never evaluated by a generation corpus. A walker that reports "all clear" over a surface it never executed is the vacuous green the estate's own `contractTestAntiVacuity` walker exists to convict.

**What I would NOT do:** ship the prototype-patching instrument as the lint. It is global mutation inside a shared vitest worker, it costs 107 s capped / 841 s uncapped, and a capped version invents darkness — this lane produced 107 false dark sites that way before pass 3 refuted them. The measurement instrument is scratch; the registry is the shippable thing.

**Confidence.** The 8 are **CONFIRMED** (executed over 525 of 525 rows, uncapped, with the missed spelling quoted from the corpus). The behaviour-loss rulings D2–D6 are **CONFIRMED** at the vocabulary level (both spellings are in the 231-name corpus vocabulary) and **PLAUSIBLE** at the per-settlement level — I did not execute a settlement that has `Craft guilds` AND `Merchant guilds` and read its quarter list. That single execution is the first thing a cure lane should do.

---

## 7. QUESTIONS ONLY THE CHAIR CAN ANSWER

1. **Is TOOL-8 a measurement or a cure lane?** This report is measure-only per the charter. The FIX-D4 literal cure (`/thieves guild/gi` → an apostrophe-tolerant form) **moves generator output** on rows where the scrub then fires, which moves the golden. Does that cure belong to TOOL-8, to a CURE lane, or behind the owner's golden signature?
2. **Scope of the lint's first wave.** `src/domain` contributes 5 of the confirmed dark sites and **409 never-evaluated** sites, because the golden corpus exercises generation only. Wave 1 scoped to `src/generators/**` is honest and cheap; `src/domain` needs a second corpus (pulse/dossier driver). Is a declared-blind-spot wave-1 acceptable, or must the lint be born whole?
3. **The mutation row's shape** (§5.5 item 1). The natural mutation is a *real fix* to `npcGenerator.js`. The sweep would then plant a change that legitimately moves the golden. Does the sweep get a non-golden-touching alternative (a synthetic registry row), or is the real-fix mutation with a recorded shift the chair's preference?
4. **`spatialGenerator.js`'s `has()` — one cure or per-site cures?** `const has = (keyword) => instNames.some(n => n.includes(keyword))` at `:21` is **case-sensitive over raw catalogue names** while every sibling generator (`narrativeGenerator:471`, `structuralValidator:276`, `economy/viability:235`, `economy/economicState:377`) lowercases first. Lowercasing `has()` is a one-line change that moves several quarters at once (a behaviour shift across the corpus). Per-site literal fixes are smaller but leave the trap armed. Which?
5. **`DECLARED_DARK` needs an owner-visible vocabulary.** The three honest families in §5.3 (defensive escape / idempotent normaliser / negated dedupe) are a proposal. Does the chair want that vocabulary closed (a frozen enum the walker asserts), as `FORK_CLASS_VOCABULARY` is in `habitForkRegistry.js`?
6. **The 09-19 "no deferred work" law (ODQ §934.56).** This census produces a list of items larger than one lane. Each needs a slot, an owner decision point, or a close-with-reason **this turn**. §8 lists them unslotted because slotting is the chair's act — please assign.

---

## 8. ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

Nothing below was edited. Each carries its site and its evidence.

**N1 — `src/generators/spatialGenerator.js:21` is the one raw-name `has()` in the estate.**
`const has = (keyword) => instNames.some(n => n.includes(keyword))` over `institutions.map(i => i.name)` — **not lowercased**, unlike `narrativeGenerator.js:471`, `structuralValidator.js:276`, `economy/viability.js:235`, `economy/economicState.js:377`, all of which lowercase first. The estate already cured ONE member of this class in this very file (`:114 isDockInstitution`, whose comment names the `'port'` / `'Teleportation circle'` false wharf). The cure was local; the trap stayed armed. CONFIRMED consequences in §4.

**N2 — `src/generators/npcGenerator.js:613–615`, a token substituter for tokens that no longer exist.**
`grep -c "{commodity}" src/data/npcData.js` → **0**. `{commodity}` survives only in `historyGenerator.js`, `tradeCommodity.js`, `narrativeGenerator.js`, `data/stressInstitutionEffects.js` — not in `NPC_FACTION_GOALS`. The third link in the same chain, `.replace(/grain/g, commodity === 'grain' ? 'grain' : commodity || 'grain')`, is an **unbounded** substitution with no `\b`: the day a goal says "grainy" or "grainstore" it corrupts it. Dark today; armed.

**N3 — `src/generators/services/serviceClassifier.js` — 303 dark arms in one ~160-arm ternary, and a header claim that does not measure out.**
The header says `SERVICE_CATEGORY_MAP` "covers all 260 known services unambiguously". MEASURED: the map holds 280 keys and covers **124 of the 375** distinct service names the corpus generates; **251 fall through** into the keyword heuristic. So the heuristic is load-bearing, not vestigial — and 303 of its arms never decide anything.

**N4 — `src/generators/narrativeGenerator.js:500,516` — two ladder rungs for names that do not exist.**
`hasInst('professional guard')`: 0 of 231 corpus institution names contain it, exact or case-insensitive. The corpus **does** generate `Professional city watch`, which the LATER `hasInst('city watch')` rung catches. `hasInst('healer')`: 0 of 231, though `healerRef`'s whole job is to name a healer.

**N5 — `src/generators/economy/foodBalance.js:221` — a declared behaviour no row exercises.**
The comment at :216 states: *"config token is de-slugged: 'mountain_pass' must arrive as 'mountain pass trade'"*. `.replace(/_/g,' ')` on `effectiveRoute` fired **0 times in 525 rows**. `goldenMasterCorpus.js` contains exactly two `mountain_pass` rows. A declared contract asserted by a comment and exercised by nothing.

**N6 — `src/generators/historyGenerator.js:464`, a substitution label the corpus never reaches.**
`'Legitimate heir'` is a real faction label on `src/data/historyData.js:1124`; its sibling `'Wealthy merchants'` (`historyData.js:1139`) IS live in the same chain. So the machinery works and one named data row is out of corpus reach — a coverage gap in the corpus, not a spelling bug in the guard.

**N7 — `src/generators/historyGenerator.js:471`, a cure that may be a fossil.**
`.replace(/\b(.{4,40}) vs \1\b/g, '$1')` with the comment *"Remove accidental doubled nouns (e.g. 'the council vs the council')"*. Never fires. Either the doubling was cured upstream and this is a fossil, or the corpus misses the shape.

**N8 — `src/generators/power/economyReconciliation.js:62`, a normaliser and its producer disagree.**
`.replace(/\s+\(dominant\)$/, '')` with the comment *"Prosperity projects merchant dominance as a display suffix"*. **0 of the 31 distinct corpus faction names carry `(dominant)`.** Either the suffix is added at read time (so the generator-side normaliser is in the wrong layer), or the projection no longer happens.

**N9 — `src/generators/institutionProbability.js:82`, a latent spelling drift.**
`inst.includes('armory')` — American only. `src/domain/worldPulse/militaryStrength.js:88` and `src/lib/entities.js:165` both spell the class `armory|armoury`. Neither spelling appears in the 231-name corpus vocabulary or in `src/data/institutionalCatalog.js`. Harmless today, armed for the day an *Armoury* lands. The same file carries `fortif`, `bandit`, `levy`, `harbor`, `feudal`, `planar trader` — all 0 of 231.

**N10 — SIX private copies of one predicate, with two different normalizations. This is the habitat.**
`npcGenerator:937` (lower) · `narrativeGenerator:471` (lower) · `structuralValidator:276` (lower) · `economy/viability:235` (lower) · `economy/economicState:377` (lower) · `spatialGenerator:21` (**raw**) · `priorityHelpers:25 hasAny` (raw). One shared `institutionMatches(names, keywords)` with ONE declared normalization is the structural cure (`structural-prevention`'s single-writer shape); the dark-guard lint is the ratchet that keeps a seventh copy from appearing.

**N11 — two exemplars for the `DECLARED_DARK` allowlist, not bugs.**
`src/generators/generationCoherence.js:330` (`/\b(?:e\.g|i\.e)\.\s+/gi` stripped **before** the lower-case-sentence regex at :341 — a pre-pass that protects a later check) and `src/domain/region/goodsCatalog.js:278` (`[&/+]`, `['"]` strips in `stripAnnotations`). Both dark, both correct.

**N12 — `src/domain` is out of this corpus's reach and no claim should be made about it.**
409 text-guard sites in `src/domain` were **never evaluated** (263 `STRMETH` + 146 `REGEX`), e.g. 44 in `src/domain/prose/wiringCensus.js`, 13 each in `composedWalker.js` / `entryWalker.js`. The generation corpus does not load the prose/display/pulse modules. A `src/domain` dark-guard census needs a pulse/dossier driver corpus.

**N13 — a catalogue entry that never generates (separate from any guard).**
`"Woodcutter's camp"` is in `src/data/institutionalCatalog.js`, but **0 of the 231** institution names the 525-row corpus generated contain `Woodcutter` (exact or case-insensitive). `spatialGenerator.js:151–160`'s `Woodcutters' Ground` quarter is therefore unreachable for the entire golden corpus. The guard is innocent; the catalogue selection is the question.

**N14 — this lane's own instrument hazard, worth recording.**
A per-literal cap on stack captures INVENTS darkness. `garrison` is evaluated **2,987,768** times in one corpus pass; a 20,000-capture window sees 0.7% of its life and reported `hasInst('garrison')` (`narrativeGenerator.js:496`) as dark. Any future lane instrumenting this estate by prototype patching must either run uncapped (≈10 min for the dark subset alone) or derive from an exact vocabulary.

